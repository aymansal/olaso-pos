import { allocateCentimes } from './costs.ts';
import {
  resolveProductConfiguration,
  type ProductChoiceSection,
  type ProductChoiceValue,
  type ProductChoiceValueEffect,
  type ProductSize,
} from './productConfiguration.ts';

const MAX_COMBOS = 64;

export type ProductCostIngredient = {
  id: string;
  currentStockQuantity: number;
  inventoryValueCentimes?: number;
  costStatus: 'complete' | 'incomplete';
};

export type ProductCostValue = ProductChoiceValue & {
  isDefaultSelected?: boolean;
};

export type ProductCostRange = {
  complete: boolean;
  hasRecipe: boolean;
  minimumCostCentimes?: number;
  maximumCostCentimes?: number;
  missingIngredientIds?: string[];
};

function valueAvailable(
  value: ProductCostValue,
  sizeId: string,
  valueSizes: Array<{
    valueId: string;
    productSizeId: string;
    available: boolean;
  }>,
) {
  if (value.status !== 'active') return false;
  const rule = valueSizes.find(
    (row) => row.valueId === value.id && row.productSizeId === sizeId,
  );
  return !rule || rule.available;
}

function sectionCandidates(
  section: ProductChoiceSection,
  sizeId: string,
  values: ProductCostValue[],
  valueSizes: Array<{
    valueId: string;
    productSizeId: string;
    available: boolean;
  }>,
): string[][] {
  const valid = values.filter(
    (value) =>
      value.sectionId === section.id && valueAvailable(value, sizeId, valueSizes),
  );
  const sets: string[][] = [];
  const push = (ids: string[]) => {
    if (
      ids.length < section.minimumSelections
      || ids.length > section.maximumSelections
    ) {
      return;
    }
    const key = ids.slice().sort().join('\0');
    if (sets.some((row) => row.slice().sort().join('\0') === key)) return;
    sets.push(ids);
  };

  if (section.minimumSelections === 0) push([]);

  if (section.maximumSelections === 1) {
    for (const value of valid) push([value.id]);
    return sets;
  }

  // # ponytail: multi sections use empty + singletons + defaults only (cap 64)
  if (section.minimumSelections <= 1) {
    for (const value of valid) push([value.id]);
  }
  const defaults = valid
    .filter((value) => value.isDefaultSelected)
    .map((value) => value.id);
  if (defaults.length > 0) push(defaults);
  return sets;
}

function enumerateCombos(sections: string[][][], limit: number): string[][] {
  if (sections.some((sets) => sets.length === 0)) return [];
  const out: string[][] = [];
  const walk = (index: number, prefix: string[]) => {
    if (out.length >= limit) return;
    if (index >= sections.length) {
      out.push(prefix);
      return;
    }
    for (const set of sections[index]!) {
      if (out.length >= limit) return;
      walk(index + 1, [...prefix, ...set]);
    }
  };
  walk(0, []);
  return out;
}

function costIngredients(
  quantities: Map<string, number>,
  ingredients: Map<string, ProductCostIngredient>,
): { complete: true; costCentimes: number } | {
  complete: false;
  missingIngredientIds: string[];
} {
  let costCentimes = 0;
  const missingIngredientIds: string[] = [];
  for (const [ingredientId, quantity] of quantities) {
    if (quantity === 0) continue;
    const ingredient = ingredients.get(ingredientId);
    if (
      !ingredient
      || ingredient.costStatus !== 'complete'
      || ingredient.inventoryValueCentimes === undefined
      || ingredient.currentStockQuantity <= 0
      || quantity > ingredient.currentStockQuantity
    ) {
      missingIngredientIds.push(ingredientId);
      continue;
    }
    costCentimes += allocateCentimes(
      ingredient.inventoryValueCentimes,
      ingredient.currentStockQuantity,
      quantity,
    );
  }
  if (missingIngredientIds.length) {
    return {
      complete: false,
      missingIngredientIds: [...new Set(missingIngredientIds)].sort(),
    };
  }
  return { complete: true, costCentimes };
}

export function computeProductCostRange(input: {
  sizes: ProductSize[];
  recipeItems: Array<{ ingredientId: string; quantity: number }>;
  sizeQuantities: Array<{
    ingredientId: string;
    productSizeId: string;
    quantity: number;
  }>;
  sections: ProductChoiceSection[];
  sectionSizeIds: Array<{ sectionId: string; productSizeId: string }>;
  values: ProductCostValue[];
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
  ingredients: ProductCostIngredient[];
}): ProductCostRange {
  const activeSizes = input.sizes.filter((size) => size.status === 'active');
  if (activeSizes.length === 0 || input.recipeItems.length === 0) {
    return { complete: false, hasRecipe: false };
  }

  const sectionSizeLinks = new Map<string, string[]>();
  for (const link of input.sectionSizeIds) {
    const linked = sectionSizeLinks.get(link.sectionId) ?? [];
    linked.push(link.productSizeId);
    sectionSizeLinks.set(link.sectionId, linked);
  }

  const ingredients = new Map(
    input.ingredients.map((ingredient) => [ingredient.id, ingredient]),
  );
  const missingIngredientIds = new Set<string>();
  let minimumCostCentimes: number | undefined;
  let maximumCostCentimes: number | undefined;
  let sawComplete = false;
  let comboCount = 0;

  for (const size of activeSizes) {
    const applicable = input.sections.filter((section) => {
      if (section.status !== 'active') return false;
      const linked = sectionSizeLinks.get(section.id);
      return !linked || linked.length === 0 || linked.includes(size.id);
    });
    const perSection = applicable.map((section) =>
      sectionCandidates(section, size.id, input.values, input.valueSizes),
    );
    const remaining = MAX_COMBOS - comboCount;
    if (remaining <= 0) break;

    for (const choiceValueIds of enumerateCombos(perSection, remaining)) {
      comboCount += 1;
      let resolved;
      try {
        resolved = resolveProductConfiguration({
          sizeId: size.id,
          choiceValueIds,
          sizes: input.sizes,
          recipeItems: input.recipeItems,
          sizeQuantities: input.sizeQuantities,
          sections: input.sections,
          sectionSizeIds: input.sectionSizeIds,
          values: input.values,
          valueSizes: input.valueSizes,
          effects: input.effects,
          effectSizes: input.effectSizes,
        });
      } catch {
        continue;
      }
      const cost = costIngredients(resolved.ingredients, ingredients);
      if (!cost.complete) {
        for (const id of cost.missingIngredientIds) missingIngredientIds.add(id);
        continue;
      }
      sawComplete = true;
      minimumCostCentimes = minimumCostCentimes === undefined
        ? cost.costCentimes
        : Math.min(minimumCostCentimes, cost.costCentimes);
      maximumCostCentimes = maximumCostCentimes === undefined
        ? cost.costCentimes
        : Math.max(maximumCostCentimes, cost.costCentimes);
    }
    if (comboCount >= MAX_COMBOS) break;
  }

  if (missingIngredientIds.size > 0) {
    return {
      complete: false,
      hasRecipe: true,
      missingIngredientIds: [...missingIngredientIds].sort(),
    };
  }
  if (!sawComplete || minimumCostCentimes === undefined || maximumCostCentimes === undefined) {
    return { complete: false, hasRecipe: true, missingIngredientIds: [] };
  }
  return {
    complete: true,
    hasRecipe: true,
    minimumCostCentimes,
    maximumCostCentimes,
  };
}
