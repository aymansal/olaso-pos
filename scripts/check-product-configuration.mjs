import assert from 'node:assert/strict';
import { resolveProductConfiguration } from '../src/lib/productConfiguration.ts';

const sizeRegular = {
  id: 'size-regular',
  productId: 'product-espresso',
  name: 'Regular',
  priceCentimes: 1000,
  status: 'active',
};
const sizeLarge = {
  id: 'size-large',
  productId: 'product-espresso',
  name: 'Large',
  priceCentimes: 1400,
  status: 'active',
};

const recipeItems = [
  { ingredientId: 'coffee', quantity: 18 },
  { ingredientId: 'water', quantity: 30 },
  { ingredientId: 'cup', quantity: 1 },
];

const milkSection = {
  id: 'section-milk',
  productId: 'product-espresso',
  name: 'Milk',
  selectionMode: 'single',
  required: false,
  minimumSelections: 0,
  maximumSelections: 1,
  status: 'active',
};

const requiredMilkSection = {
  ...milkSection,
  required: true,
  minimumSelections: 1,
  maximumSelections: 1,
};

const extraSection = {
  id: 'section-extra',
  productId: 'product-espresso',
  name: 'Extra',
  selectionMode: 'multiple',
  required: false,
  minimumSelections: 0,
  maximumSelections: 2,
  status: 'active',
};

const noteSection = {
  id: 'section-note',
  productId: 'product-espresso',
  name: 'Note',
  selectionMode: 'single',
  required: false,
  minimumSelections: 0,
  maximumSelections: 1,
  status: 'active',
};

const largeOnlySection = {
  id: 'section-large-only',
  productId: 'product-espresso',
  name: 'Large only',
  selectionMode: 'single',
  required: false,
  minimumSelections: 0,
  maximumSelections: 1,
  status: 'active',
};

const oat = {
  id: 'value-oat',
  sectionId: 'section-milk',
  name: 'Oat milk',
  priceDeltaCentimes: 400,
  status: 'active',
};
const whole = {
  id: 'value-whole',
  sectionId: 'section-milk',
  name: 'Whole milk',
  priceDeltaCentimes: 0,
  status: 'active',
};
const shot = {
  id: 'value-shot',
  sectionId: 'section-extra',
  name: 'Extra shot',
  priceDeltaCentimes: 300,
  status: 'active',
};
const syrup = {
  id: 'value-syrup',
  sectionId: 'section-extra',
  name: 'Syrup',
  priceDeltaCentimes: 200,
  status: 'active',
};
const noCup = {
  id: 'value-no-cup',
  sectionId: 'section-extra',
  name: 'No cup',
  priceDeltaCentimes: 0,
  status: 'active',
};
const exactWater = {
  id: 'value-exact-water',
  sectionId: 'section-extra',
  name: 'Exact water',
  priceDeltaCentimes: 0,
  status: 'active',
};
const note = {
  id: 'value-note',
  sectionId: 'section-note',
  name: 'Less foam',
  priceDeltaCentimes: 0,
  status: 'active',
};
const largeTopping = {
  id: 'value-large-topping',
  sectionId: 'section-large-only',
  name: 'Whipped cream',
  priceDeltaCentimes: 250,
  status: 'active',
};
const multi = {
  id: 'value-multi',
  sectionId: 'section-extra',
  name: 'Decaf oat swap',
  priceDeltaCentimes: 100,
  status: 'active',
};

const effects = [
  {
    id: 'effect-add-shot',
    valueId: 'value-shot',
    effectType: 'add',
    ingredientId: 'coffee',
    quantity: 9,
    sortOrder: 10,
  },
  {
    id: 'effect-replace-oat',
    valueId: 'value-oat',
    effectType: 'replace',
    ingredientId: 'water',
    replacementIngredientId: 'oat',
    quantity: 120,
    sortOrder: 10,
  },
  {
    id: 'effect-set-water',
    valueId: 'value-exact-water',
    effectType: 'set-exact',
    ingredientId: 'water',
    quantity: 10,
    sortOrder: 10,
  },
  {
    id: 'effect-remove-cup',
    valueId: 'value-no-cup',
    effectType: 'remove',
    ingredientId: 'cup',
    quantity: 0,
    sortOrder: 10,
  },
  {
    id: 'effect-multi-remove',
    valueId: 'value-multi',
    effectType: 'remove',
    ingredientId: 'water',
    quantity: 0,
    sortOrder: 10,
  },
  {
    id: 'effect-multi-add',
    valueId: 'value-multi',
    effectType: 'add',
    ingredientId: 'oat',
    quantity: 100,
    sortOrder: 20,
  },
  {
    id: 'effect-conflict-a',
    valueId: 'value-syrup',
    effectType: 'add',
    ingredientId: 'coffee',
    quantity: 1,
    sortOrder: 10,
  },
  {
    id: 'effect-conflict-b',
    valueId: 'value-shot',
    effectType: 'set-exact',
    ingredientId: 'coffee',
    quantity: 20,
    sortOrder: 20,
  },
  {
    id: 'effect-missing-replace',
    valueId: 'value-whole',
    effectType: 'replace',
    ingredientId: 'missing-milk',
    replacementIngredientId: 'whole',
    quantity: 100,
    sortOrder: 10,
  },
  {
    id: 'effect-negative',
    valueId: 'value-syrup',
    effectType: 'add',
    ingredientId: 'syrup',
    quantity: -1,
    sortOrder: 30,
  },
];

function base(overrides = {}) {
  return {
    sizeId: sizeRegular.id,
    choiceValueIds: [],
    sizes: [sizeRegular, sizeLarge],
    recipeItems,
    sizeQuantities: [],
    sections: [milkSection, extraSection, noteSection, largeOnlySection],
    sectionSizeIds: [
      { sectionId: largeOnlySection.id, productSizeId: sizeLarge.id },
    ],
    values: [
      oat,
      whole,
      shot,
      syrup,
      noCup,
      exactWater,
      note,
      largeTopping,
      multi,
    ],
    valueSizes: [],
    effects,
    effectSizes: [],
    ...overrides,
  };
}

// One size identity — base recipe and size price, no choices.
{
  const resolved = resolveProductConfiguration(
    base({ sections: [], values: [], effects: [] }),
  );
  assert.equal(resolved.unitPriceCentimes, 1000);
  assert.deepEqual(
    [...resolved.ingredients.entries()].sort(),
    [
      ['coffee', 18],
      ['cup', 1],
      ['water', 30],
    ],
  );
}

// Per-size quantity override.
{
  const resolved = resolveProductConfiguration(
    base({
      sizeId: sizeLarge.id,
      sizeQuantities: [
        { ingredientId: 'coffee', productSizeId: sizeLarge.id, quantity: 24 },
        { ingredientId: 'water', productSizeId: sizeLarge.id, quantity: 0 },
      ],
    }),
  );
  assert.equal(resolved.unitPriceCentimes, 1400);
  assert.deepEqual(
    [...resolved.ingredients.entries()].sort(),
    [
      ['coffee', 24],
      ['cup', 1],
    ],
  );
}

// Add effect.
{
  const resolved = resolveProductConfiguration(
    base({
      choiceValueIds: [whole.id, shot.id],
      effects: effects.filter((effect) => effect.id === 'effect-add-shot'),
    }),
  );
  assert.equal(resolved.unitPriceCentimes, 1300);
  assert.equal(resolved.ingredients.get('coffee'), 27);
}

// Replace effect.
{
  const resolved = resolveProductConfiguration(
    base({
      choiceValueIds: [oat.id],
      effects: effects.filter((effect) => effect.id === 'effect-replace-oat'),
    }),
  );
  assert.equal(resolved.unitPriceCentimes, 1400);
  assert.equal(resolved.ingredients.has('water'), false);
  assert.equal(resolved.ingredients.get('oat'), 120);
}

// Set-exact effect.
{
  const resolved = resolveProductConfiguration(
    base({
      choiceValueIds: [whole.id, exactWater.id],
      effects: effects.filter((effect) => effect.id === 'effect-set-water'),
    }),
  );
  assert.equal(resolved.ingredients.get('water'), 10);
}

// Remove effect.
{
  const resolved = resolveProductConfiguration(
    base({
      choiceValueIds: [whole.id, noCup.id],
      effects: effects.filter((effect) => effect.id === 'effect-remove-cup'),
    }),
  );
  assert.equal(resolved.ingredients.has('cup'), false);
}

// Instruction-only value — zero effects, price unchanged beyond delta.
{
  const resolved = resolveProductConfiguration(
    base({
      choiceValueIds: [whole.id, note.id],
      effects: [],
    }),
  );
  assert.equal(resolved.unitPriceCentimes, 1000);
  assert.deepEqual(
    [...resolved.ingredients.entries()].sort(),
    [
      ['coffee', 18],
      ['cup', 1],
      ['water', 30],
    ],
  );
}

// Multi-effect value.
{
  const resolved = resolveProductConfiguration(
    base({
      choiceValueIds: [whole.id, multi.id],
      effects: effects.filter((effect) =>
        effect.id === 'effect-multi-remove' || effect.id === 'effect-multi-add'
      ),
    }),
  );
  assert.equal(resolved.unitPriceCentimes, 1100);
  assert.equal(resolved.ingredients.has('water'), false);
  assert.equal(resolved.ingredients.get('oat'), 100);
}

// Size applicability — large-only section rejected on regular.
assert.throws(
  () =>
    resolveProductConfiguration(
      base({ choiceValueIds: [whole.id, largeTopping.id] }),
    ),
  /not available for this size/,
);
{
  const resolved = resolveProductConfiguration(
    base({
      sizeId: sizeLarge.id,
      choiceValueIds: [whole.id, largeTopping.id],
      effects: [],
    }),
  );
  assert.equal(resolved.unitPriceCentimes, 1650);
}

// Required / min / max.
assert.throws(
  () =>
    resolveProductConfiguration(
      base({
        sections: [requiredMilkSection, extraSection, noteSection, largeOnlySection],
        choiceValueIds: [],
      }),
    ),
  /Milk requires 1 to 1 choices|Milk is required/,
);
assert.throws(
  () =>
    resolveProductConfiguration(
      base({
        sections: [requiredMilkSection, extraSection, noteSection, largeOnlySection],
        choiceValueIds: [whole.id, oat.id],
      }),
    ),
  /Milk requires 1 to 1 choices/,
);
assert.throws(
  () =>
    resolveProductConfiguration(
      base({
        choiceValueIds: [shot.id, syrup.id, noCup.id],
        effects: [],
      }),
    ),
  /Extra requires 0 to 2 choices/,
);

// Negative-quantity rejection.
assert.throws(
  () =>
    resolveProductConfiguration(
      base({
        choiceValueIds: [whole.id, syrup.id],
        effects: effects.filter((effect) => effect.id === 'effect-negative'),
      }),
    ),
  /effect quantity|at least 0/,
);

// Missing replace target.
assert.throws(
  () =>
    resolveProductConfiguration(
      base({
        choiceValueIds: [whole.id],
        effects: effects.filter(
          (effect) => effect.id === 'effect-missing-replace',
        ),
      }),
    ),
  /cannot replace an ingredient that is not in the recipe/,
);

// Conflicting effects on the same ingredient across selected values.
assert.throws(
  () =>
    resolveProductConfiguration(
      base({
        choiceValueIds: [whole.id, shot.id, syrup.id],
        effects: effects.filter(
          (effect) =>
            effect.id === 'effect-add-shot'
            || effect.id === 'effect-conflict-a'
            || effect.id === 'effect-conflict-b',
        ),
      }),
    ),
  /conflict on the same ingredient/,
);

// Per-size price and quantity overrides on a choice value / effect.
{
  const resolved = resolveProductConfiguration(
    base({
      sizeId: sizeLarge.id,
      choiceValueIds: [oat.id],
      effects: effects.filter((effect) => effect.id === 'effect-replace-oat'),
      valueSizes: [
        {
          valueId: oat.id,
          productSizeId: sizeLarge.id,
          available: true,
          priceDeltaCentimes: 550,
        },
      ],
      effectSizes: [
        {
          effectId: 'effect-replace-oat',
          productSizeId: sizeLarge.id,
          quantity: 180,
        },
      ],
    }),
  );
  assert.equal(resolved.unitPriceCentimes, 1950);
  assert.equal(resolved.ingredients.get('oat'), 180);
}

// Unavailable value on this size.
assert.throws(
  () =>
    resolveProductConfiguration(
      base({
        choiceValueIds: [oat.id],
        valueSizes: [
          {
            valueId: oat.id,
            productSizeId: sizeRegular.id,
            available: false,
            priceDeltaCentimes: null,
          },
        ],
      }),
    ),
  /not available for this size/,
);

console.log('Product configuration resolver checks passed.');
