import { v } from 'convex/values';
import { mutation } from './_generated/server';
import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';
import {
  boundedInteger,
  cleanKey,
  cleanText,
  conflict,
  expectRevision,
  invalid,
  mutationId,
  notFound,
  requireManagement,
} from './lib/management';
import { sessionArgs } from './lib/session';

const productStatus = v.union(v.literal('active'), v.literal('unavailable'), v.literal('archived'));
const choiceStatus = v.union(v.literal('active'), v.literal('archived'));
const effectType = v.union(v.literal('add'), v.literal('replace'), v.literal('set-exact'), v.literal('remove'));
const sizeRule = v.object({
  productSizeId: v.string(), available: v.boolean(), priceDeltaCentimes: v.optional(v.number()),
});
const effect = v.object({
  localId: v.optional(v.string()), effectType, ingredientId: v.id('ingredients'),
  replacementIngredientId: v.optional(v.id('ingredients')), quantity: v.number(), sortOrder: v.number(),
  sizeQuantities: v.array(v.object({ productSizeId: v.string(), quantity: v.number() })),
});
const value = v.object({
  localId: v.optional(v.string()), key: v.string(), name: v.string(), priceDeltaCentimes: v.number(),
  isDefaultSelected: v.boolean(), sortOrder: v.number(), status: choiceStatus,
  sizeRules: v.array(sizeRule), effects: v.array(effect),
});

async function requireProduct(ctx: MutationCtx, id: Id<'products'>) {
  const product = await ctx.db.get(id);
  if (!product) return notFound('Product');
  if (product.status === 'archived') return conflict('Restore this product before editing its configuration.');
  return product;
}

export const saveSize = mutation({
  args: {
    ...sessionArgs, id: v.optional(v.id('productSizes')), productId: v.id('products'), key: v.string(),
    name: v.string(), priceCentimes: v.number(), sortOrder: v.number(), isDefault: v.boolean(),
    status: productStatus, expectedRevision: v.optional(v.number()), clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const product = await requireProduct(ctx, args.productId);
    const key = cleanKey(args.key, 'Product size key');
    const name = cleanText(args.name, 'Product size name', 80);
    const priceCentimes = boundedInteger(args.priceCentimes, 'Size price', 0, 10_000_000);
    const sortOrder = boundedInteger(args.sortOrder, 'Size order', 0, 100_000);
    const existing = args.id ? await ctx.db.get(args.id) : undefined;
    if (existing) {
      if (existing.lastMutationId === clientMutationId) return { id: existing._id, revision: existing.revision };
      if (existing.productId !== product._id) return invalid('Product size belongs to another product.');
      expectRevision(args.expectedRevision, existing.revision);
    } else {
      const sizes = await ctx.db.query('productSizes').withIndex('by_product', (q) => q.eq('productId', product._id)).take(9);
      if (sizes.filter((size) => size.status !== 'archived').length >= 8) return invalid('A product can have at most 8 sizes.');
      const duplicate = await ctx.db.query('productSizes').withIndex('by_product_key', (q) => q.eq('productId', product._id).eq('key', key)).unique();
      if (duplicate) return conflict('A product size with this key already exists.');
    }
    const now = Date.now();
    if (args.isDefault && args.status !== 'archived') {
      const sizes = await ctx.db.query('productSizes').withIndex('by_product', (q) => q.eq('productId', product._id)).take(9);
      for (const size of sizes) if (size._id !== existing?._id && size.isDefault && size.status !== 'archived') {
        await ctx.db.patch(size._id, { isDefault: false, revision: size.revision + 1, updatedAt: now, updatedBy });
      }
    }
    if (existing) {
      await ctx.db.patch(existing._id, { key, name, priceCentimes, sortOrder, isDefault: args.isDefault,
        status: args.status, revision: existing.revision + 1, updatedAt: now, updatedBy, lastMutationId: clientMutationId });
      return { id: existing._id, revision: existing.revision + 1 };
    }
    const id = await ctx.db.insert('productSizes', { productId: product._id, key, name, priceCentimes, sortOrder,
      isDefault: args.isDefault, status: args.status, revision: 1, updatedAt: now, updatedBy, lastMutationId: clientMutationId });
    return { id, revision: 1 };
  },
});

export const removeSize = mutation({
  args: { ...sessionArgs, id: v.id('productSizes'), expectedRevision: v.number(), clientMutationId: v.string() },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const size = await ctx.db.get(args.id);
    if (!size) return { id: args.id, revision: args.expectedRevision + 1 };
    if (size.lastMutationId === clientMutationId) return { id: size._id, revision: size.revision };
    expectRevision(args.expectedRevision, size.revision);
    await ctx.db.patch(size._id, { status: 'archived', isDefault: false, revision: size.revision + 1,
      updatedAt: Date.now(), updatedBy, lastMutationId: clientMutationId });
    return { id: size._id, revision: size.revision + 1 };
  },
});

export const saveSection = mutation({
  args: {
    ...sessionArgs, id: v.optional(v.id('productChoiceSections')), productId: v.id('products'), key: v.string(),
    name: v.string(), selectionMode: v.union(v.literal('single'), v.literal('multiple')), required: v.boolean(),
    minimumSelections: v.number(), maximumSelections: v.number(), sortOrder: v.number(), status: choiceStatus,
    productSizeIds: v.array(v.string()), values: v.array(value), expectedRevision: v.optional(v.number()),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const product = await requireProduct(ctx, args.productId);
    const key = cleanKey(args.key, 'Choice section key');
    const name = cleanText(args.name, 'Choice section name', 80);
    const minimumSelections = boundedInteger(args.minimumSelections, 'Minimum selections', 0, 30);
    const maximumSelections = boundedInteger(args.maximumSelections, 'Maximum selections', 1, 30);
    if (minimumSelections > maximumSelections || (args.required && minimumSelections < 1)
        || (args.selectionMode === 'single' && maximumSelections > 1) || args.values.length > 30) {
      return invalid('Choice section selection rules are invalid.');
    }
    if (new Set(args.productSizeIds).size !== args.productSizeIds.length) return invalid('Choice section sizes must be unique.');
    const existing = args.id ? await ctx.db.get(args.id) : undefined;
    if (existing) {
      if (existing.lastMutationId === clientMutationId) return { id: existing._id, revision: existing.revision, valueMappings: [] };
      if (existing.productId !== product._id) return invalid('Choice section belongs to another product.');
      expectRevision(args.expectedRevision, existing.revision);
    } else {
      const sections = await ctx.db.query('productChoiceSections').withIndex('by_product', (q) => q.eq('productId', product._id)).take(13);
      if (sections.filter((section) => section.status === 'active').length >= 12) return invalid('A product can have at most 12 choice sections.');
      if (await ctx.db.query('productChoiceSections').withIndex('by_product_key', (q) => q.eq('productId', product._id).eq('key', key)).unique()) {
        return conflict('A choice section with this key already exists.');
      }
    }
    const sizes = await Promise.all(args.productSizeIds.map(async (id) => await ctx.db.get(id as Id<'productSizes'>)));
    if (sizes.some((size) => !size || size.productId !== product._id || size.status === 'archived')) return invalid('Choice sections need active product sizes.');
    const ingredientIds = args.values.flatMap((row) => row.effects.flatMap((item) => [item.ingredientId, ...(item.replacementIngredientId ? [item.replacementIngredientId] : [])]));
    const ingredients = await Promise.all(ingredientIds.map((id) => ctx.db.get(id)));
    if (ingredients.some((ingredient) => !ingredient || ingredient.status !== 'active')
        || args.values.some((row) => row.effects.length > 10 || new Set(row.sizeRules.map((rule) => rule.productSizeId)).size !== row.sizeRules.length)) {
      return invalid('Choice values are invalid.');
    }
    const now = Date.now();
    let sectionId: Id<'productChoiceSections'>;
    let revision: number;
    if (existing) {
      sectionId = existing._id; revision = existing.revision + 1;
      const oldValues = await ctx.db.query('productChoiceValues').withIndex('by_section', (q) => q.eq('sectionId', sectionId)).take(31);
      for (const old of oldValues) await ctx.db.delete(old._id);
      await ctx.db.patch(sectionId, { key, name, selectionMode: args.selectionMode, required: args.required,
        minSelections: minimumSelections, maxSelections: maximumSelections, sortOrder: boundedInteger(args.sortOrder, 'Choice section order', 0, 100_000),
        status: args.status, revision, updatedAt: now, updatedBy, lastMutationId: clientMutationId });
    } else {
      revision = 1;
      sectionId = await ctx.db.insert('productChoiceSections', { productId: product._id, key, name,
        selectionMode: args.selectionMode, required: args.required, minSelections: minimumSelections, maxSelections: maximumSelections,
        sortOrder: boundedInteger(args.sortOrder, 'Choice section order', 0, 100_000), status: args.status,
        revision, updatedAt: now, updatedBy, lastMutationId: clientMutationId });
    }
    const oldLinks = await ctx.db.query('productChoiceSectionSizes').withIndex('by_section', (q) => q.eq('sectionId', sectionId)).take(9);
    for (const link of oldLinks) await ctx.db.delete(link._id);
    for (const productSizeId of args.productSizeIds) await ctx.db.insert('productChoiceSectionSizes', { sectionId, productSizeId });
    const valueMappings: Array<{ localId: string; id: Id<'productChoiceValues'>; effects: Array<{ localId: string; id: Id<'productChoiceValueEffects'> }> }> = [];
    for (const row of args.values) {
      const valueId = await ctx.db.insert('productChoiceValues', { sectionId, key: cleanKey(row.key, 'Choice value key'),
        name: cleanText(row.name, 'Choice value name', 80), priceDeltaCentimes: boundedInteger(row.priceDeltaCentimes, 'Choice price', -10_000_000, 10_000_000),
        isDefaultSelected: row.isDefaultSelected, sortOrder: boundedInteger(row.sortOrder, 'Choice value order', 0, 100_000),
        status: row.status, revision: 1, updatedAt: now, updatedBy });
      for (const rule of row.sizeRules) await ctx.db.insert('productChoiceValueSizes', { valueId, productSizeId: rule.productSizeId,
        available: rule.available, ...(rule.priceDeltaCentimes === undefined ? {} : { priceDeltaCentimes: boundedInteger(rule.priceDeltaCentimes, 'Choice size price', -10_000_000, 10_000_000) }) });
      const effects = [];
      for (const item of row.effects) {
        if (item.effectType === 'replace' && !item.replacementIngredientId) return invalid('Replace effects need a replacement ingredient.');
        const effectId = await ctx.db.insert('productChoiceValueEffects', { valueId, effectType: item.effectType,
          ingredientId: item.ingredientId, replacementIngredientId: item.replacementIngredientId,
          quantity: boundedInteger(item.quantity, 'Choice effect quantity', 0, 1_000_000), sortOrder: boundedInteger(item.sortOrder, 'Choice effect order', 0, 100_000) });
        for (const quantity of item.sizeQuantities) await ctx.db.insert('productChoiceValueEffectSizes', { effectId,
          productSizeId: quantity.productSizeId, quantity: boundedInteger(quantity.quantity, 'Choice effect size quantity', 0, 1_000_000) });
        if (item.localId) effects.push({ localId: item.localId, id: effectId });
      }
      if (row.localId) valueMappings.push({ localId: row.localId, id: valueId, effects });
    }
    return { id: sectionId, revision, valueMappings };
  },
});

export const removeSection = mutation({
  args: { ...sessionArgs, id: v.id('productChoiceSections'), expectedRevision: v.number(), clientMutationId: v.string() },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    const section = await ctx.db.get(args.id);
    if (!section) return { id: args.id, revision: args.expectedRevision + 1 };
    if (section.lastMutationId === clientMutationId) return { id: section._id, revision: section.revision };
    expectRevision(args.expectedRevision, section.revision);
    await ctx.db.patch(section._id, { status: 'archived', revision: section.revision + 1,
      updatedAt: Date.now(), updatedBy, lastMutationId: clientMutationId });
    return { id: section._id, revision: section.revision + 1 };
  },
});

export const copySections = mutation({
  args: {
    ...sessionArgs, sourceProductId: v.id('products'), destinationProductId: v.id('products'),
    sizeIdMap: v.record(v.string(), v.string()), localSectionIds: v.array(v.string()),
    clientMutationId: v.string(),
  },
  handler: async (ctx, args) => {
    const updatedBy = await requireManagement(ctx, args);
    const clientMutationId = mutationId(args.clientMutationId);
    if (args.sourceProductId === args.destinationProductId) return invalid('Choose a different product to copy choices.');
    await requireProduct(ctx, args.sourceProductId);
    await requireProduct(ctx, args.destinationProductId);
    const sources = await ctx.db.query('productChoiceSections')
      .withIndex('by_product', (q) => q.eq('productId', args.sourceProductId)).take(13);
    const sections = sources.filter((section) => section.status === 'active');
    if (sections.length !== args.localSectionIds.length) return invalid('Copied choice sections do not match their source.');
    const now = Date.now();
    const copied = [];
    for (const [index, source] of sections.entries()) {
      const key = `copy-${clientMutationId.slice(-8).toLowerCase()}-${index}`;
      const prior = await ctx.db.query('productChoiceSections')
        .withIndex('by_product_key', (q) => q.eq('productId', args.destinationProductId).eq('key', key))
        .unique();
      if (prior) {
        copied.push({ localId: args.localSectionIds[index]!, id: prior._id });
        continue;
      }
      const sectionId = await ctx.db.insert('productChoiceSections', {
        productId: args.destinationProductId, key, name: source.name, selectionMode: source.selectionMode,
        required: source.required, minSelections: source.minSelections, maxSelections: source.maxSelections,
        sortOrder: source.sortOrder, status: 'active', revision: 1, updatedAt: now, updatedBy, lastMutationId: clientMutationId,
      });
      const links = await ctx.db.query('productChoiceSectionSizes').withIndex('by_section', (q) => q.eq('sectionId', source._id)).take(9);
      for (const link of links) {
        const productSizeId = args.sizeIdMap[String(link.productSizeId)];
        if (!productSizeId) return invalid('Every copied source size requires a destination size.');
        await ctx.db.insert('productChoiceSectionSizes', { sectionId, productSizeId });
      }
      const values = await ctx.db.query('productChoiceValues').withIndex('by_section', (q) => q.eq('sectionId', source._id)).take(31);
      for (const sourceValue of values) {
        const valueId = await ctx.db.insert('productChoiceValues', {
          sectionId, key: sourceValue.key, name: sourceValue.name, priceDeltaCentimes: sourceValue.priceDeltaCentimes,
          isDefaultSelected: sourceValue.isDefaultSelected, sortOrder: sourceValue.sortOrder, status: sourceValue.status,
          revision: 1, updatedAt: now, updatedBy,
        });
        const valueSizes = await ctx.db.query('productChoiceValueSizes').withIndex('by_value', (q) => q.eq('valueId', sourceValue._id)).take(9);
        for (const sourceSize of valueSizes) {
          const productSizeId = args.sizeIdMap[String(sourceSize.productSizeId)];
          if (!productSizeId) return invalid('Every copied source size requires a destination size.');
          await ctx.db.insert('productChoiceValueSizes', { valueId, productSizeId, available: sourceSize.available,
            ...(sourceSize.priceDeltaCentimes === undefined ? {} : { priceDeltaCentimes: sourceSize.priceDeltaCentimes }) });
        }
        const effects = await ctx.db.query('productChoiceValueEffects').withIndex('by_value', (q) => q.eq('valueId', sourceValue._id)).take(11);
        for (const sourceEffect of effects) {
          const effectId = await ctx.db.insert('productChoiceValueEffects', {
            valueId, effectType: sourceEffect.effectType, ingredientId: sourceEffect.ingredientId,
            replacementIngredientId: sourceEffect.replacementIngredientId, quantity: sourceEffect.quantity, sortOrder: sourceEffect.sortOrder,
          });
          const effectSizes = await ctx.db.query('productChoiceValueEffectSizes').withIndex('by_effect', (q) => q.eq('effectId', sourceEffect._id)).take(9);
          for (const sourceSize of effectSizes) {
            const productSizeId = args.sizeIdMap[String(sourceSize.productSizeId)];
            if (!productSizeId) return invalid('Every copied source size requires a destination size.');
            await ctx.db.insert('productChoiceValueEffectSizes', { effectId, productSizeId, quantity: sourceSize.quantity });
          }
        }
      }
      copied.push({ localId: args.localSectionIds[index]!, id: sectionId });
    }
    return { copied };
  },
});
