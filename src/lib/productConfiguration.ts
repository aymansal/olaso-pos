export type ChoiceEffectType = 'add' | 'replace' | 'set-exact' | 'remove';

export type ProductSize = {
  id: string;
  productId: string;
  name: string;
  priceCentimes: number;
  status: 'active' | 'unavailable' | 'archived';
};

export type ProductChoiceSection = {
  id: string;
  productId: string;
  name: string;
  selectionMode: 'single' | 'multiple';
  required: boolean;
  minimumSelections: number;
  maximumSelections: number;
  status: 'active' | 'archived';
};

export type ProductChoiceValue = {
  id: string;
  sectionId: string;
  name: string;
  priceDeltaCentimes: number;
  status: 'active' | 'archived';
};

export type ProductChoiceValueEffect = {
  id: string;
  valueId: string;
  effectType: ChoiceEffectType;
  ingredientId: string;
  replacementIngredientId?: string;
  quantity: number;
  sortOrder: number;
};

export type ResolvedProductConfiguration = {
  unitPriceCentimes: number;
  ingredients: Map<string, number>;
};

function integer(value: number, label: string, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum) {
    throw new Error(`${label} must be a safe integer of at least ${minimum}.`);
  }
  return value;
}

export function resolveProductConfiguration(input: {
  sizeId: string;
  choiceValueIds: string[];
  sizes: ProductSize[];
  recipeItems: Array<{ ingredientId: string; quantity: number }>;
  sizeQuantities: Array<{
    ingredientId: string;
    productSizeId: string;
    quantity: number;
  }>;
  sections: ProductChoiceSection[];
  sectionSizeIds: Array<{ sectionId: string; productSizeId: string }>;
  values: ProductChoiceValue[];
  valueSizes: Array<{
    valueId: string;
    productSizeId: string;
    available: boolean;
    priceDeltaCentimes: number | null;
  }>;
  effects: ProductChoiceValueEffect[];
  effectSizes: Array<{
    effectId: string;
    productSizeId: string;
    quantity: number;
  }>;
}): ResolvedProductConfiguration {
  const size = input.sizes.find((candidate) => candidate.id === input.sizeId);
  if (!size || size.status === 'archived') {
    throw new Error('Select an available product size.');
  }

  const selectedIds = [...new Set(input.choiceValueIds)];
  if (selectedIds.length !== input.choiceValueIds.length) {
    throw new Error('Product choices must be unique.');
  }

  const ingredients = new Map<string, number>();
  for (const item of input.recipeItems) {
    integer(item.quantity, 'Recipe quantity', 1);
    const override = input.sizeQuantities.find(
      (row) =>
        row.ingredientId === item.ingredientId
        && row.productSizeId === size.id,
    );
    const quantity = override ? override.quantity : item.quantity;
    integer(quantity, 'Size recipe quantity');
    if (quantity > 0) ingredients.set(item.ingredientId, quantity);
  }

  const sectionSizeLinks = new Map<string, string[]>();
  for (const link of input.sectionSizeIds) {
    const linked = sectionSizeLinks.get(link.sectionId) ?? [];
    linked.push(link.productSizeId);
    sectionSizeLinks.set(link.sectionId, linked);
  }

  const applicableSections = input.sections.filter((section) => {
    if (section.status !== 'active') return false;
    const linked = sectionSizeLinks.get(section.id);
    return !linked || linked.length === 0 || linked.includes(size.id);
  });

  const valuesById = new Map(input.values.map((value) => [value.id, value]));
  const selectedValues = selectedIds.map((id) => {
    const value = valuesById.get(id);
    if (!value || value.status !== 'active') {
      throw new Error('A selected product choice is unavailable.');
    }
    return value;
  });

  for (const value of selectedValues) {
    const section = applicableSections.find(
      (candidate) => candidate.id === value.sectionId,
    );
    if (!section) {
      throw new Error(`${value.name} is not available for this size.`);
    }
    const sizeRule = input.valueSizes.find(
      (row) => row.valueId === value.id && row.productSizeId === size.id,
    );
    if (sizeRule && !sizeRule.available) {
      throw new Error(`${value.name} is not available for this size.`);
    }
  }

  for (const section of applicableSections) {
    const count = selectedValues.filter(
      (value) => value.sectionId === section.id,
    ).length;
    if (
      count < section.minimumSelections
      || count > section.maximumSelections
    ) {
      throw new Error(
        `${section.name} requires ${section.minimumSelections} to ${section.maximumSelections} choices.`,
      );
    }
    if (section.required && count < 1) {
      throw new Error(`${section.name} is required.`);
    }
  }

  let unitPriceCentimes = integer(size.priceCentimes, 'Size price');
  for (const value of selectedValues) {
    const sizeRule = input.valueSizes.find(
      (row) => row.valueId === value.id && row.productSizeId === size.id,
    );
    const delta = sizeRule?.priceDeltaCentimes ?? value.priceDeltaCentimes;
    if (!Number.isSafeInteger(delta)) {
      throw new Error(`${value.name} has an invalid price.`);
    }
    unitPriceCentimes += delta;
  }
  integer(unitPriceCentimes, 'Resolved price');

  const claimed = new Map<string, string>();
  const effects = [...input.effects].sort(
    (left, right) => left.sortOrder - right.sortOrder || left.id.localeCompare(right.id),
  );
  for (const value of selectedValues) {
    for (const effect of effects.filter((row) => row.valueId === value.id)) {
      const sizeRule = input.effectSizes.find(
        (row) => row.effectId === effect.id && row.productSizeId === size.id,
      );
      const quantity = sizeRule ? sizeRule.quantity : effect.quantity;
      integer(quantity, `${value.name} effect quantity`);

      const claim = (ingredientId: string) => {
        const prior = claimed.get(ingredientId);
        if (prior && prior !== effect.id) {
          throw new Error(
            `Selected choices conflict on the same ingredient for ${value.name}.`,
          );
        }
        claimed.set(ingredientId, effect.id);
      };

      if (effect.effectType === 'add') {
        claim(effect.ingredientId);
        ingredients.set(
          effect.ingredientId,
          (ingredients.get(effect.ingredientId) ?? 0) + quantity,
        );
      } else if (effect.effectType === 'remove') {
        claim(effect.ingredientId);
        ingredients.delete(effect.ingredientId);
      } else if (effect.effectType === 'set-exact') {
        claim(effect.ingredientId);
        if (quantity === 0) ingredients.delete(effect.ingredientId);
        else ingredients.set(effect.ingredientId, quantity);
      } else if (effect.effectType === 'replace') {
        if (!effect.replacementIngredientId) {
          throw new Error(`${value.name} is missing a replacement ingredient.`);
        }
        if (!ingredients.has(effect.ingredientId)) {
          throw new Error(
            `${value.name} cannot replace an ingredient that is not in the recipe.`,
          );
        }
        claim(effect.ingredientId);
        claim(effect.replacementIngredientId);
        ingredients.delete(effect.ingredientId);
        if (quantity === 0) {
          ingredients.delete(effect.replacementIngredientId);
        } else {
          ingredients.set(effect.replacementIngredientId, quantity);
        }
      } else {
        throw new Error(`${value.name} has an unknown ingredient action.`);
      }
    }
  }

  for (const [ingredientId, quantity] of ingredients) {
    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      throw new Error(`Resolved recipe quantity for ${ingredientId} is invalid.`);
    }
    if (quantity === 0) ingredients.delete(ingredientId);
  }

  return { unitPriceCentimes, ingredients };
}
