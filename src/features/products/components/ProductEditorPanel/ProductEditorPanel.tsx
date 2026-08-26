import {
  ArrowRight,
  DotsThree,
  FloppyDisk,
  Leaf,
  Link,
  LinkBreak,
  SlidersHorizontal,
} from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import type {
  ManagedCategory,
  ManagedIngredient,
  ManagedModifierGroup,
  ManagedProduct,
  ManagedRecipeData,
  ManagedProductSize,
  ManagedChoiceSection,
  ProductSaveInput,
} from '../../productManagementTypes';
import { ModifierGroupDialog } from '../ModifierGroupDialog/ModifierGroupDialog';
import { ProductChoiceSectionDialog } from '../ProductChoiceSectionDialog/ProductChoiceSectionDialog';
import { RecipeEditorDialog } from '../RecipeEditorDialog/RecipeEditorDialog';
import { SizesEditorDialog } from '../SizesEditorDialog/SizesEditorDialog';
import styles from './ProductEditorPanel.module.css';

interface ProductEditorPanelProps {
  product?: ManagedProduct;
  creating: boolean;
  defaultCategoryId?: string;
  nextSortOrder: number;
  categories: ManagedCategory[];
  modifierGroups: ManagedModifierGroup[];
  ingredients: ManagedIngredient[];
  productSizes: ManagedProductSize[];
  choiceSections: ManagedChoiceSection[];
  products: ManagedProduct[];
  recipeData?: ManagedRecipeData;
  isRecipeLoading: boolean;
  onSave: (input: ProductSaveInput) => Promise<void>;
  onSetStatus: (
    product: ManagedProduct,
    status: ManagedProduct['status'],
  ) => Promise<void>;
  onDelete: (product: ManagedProduct) => Promise<void>;
  onSaveModifierGroup: (group: ManagedModifierGroup) => Promise<void>;
  onSetModifierGroupArchived: (
    group: ManagedModifierGroup,
    archived: boolean,
  ) => Promise<void>;
  onSaveRecipe: (
    product: ManagedProduct,
    items: { ingredientId: string; quantity: number }[],
    sizeQuantities: Array<{ ingredientId: string; productSizeId: string; quantity: number }>,
  ) => Promise<void>;
  onSaveSize: (size: ManagedProductSize) => Promise<unknown>;
  onDeleteSize: (size: Required<Pick<ManagedProductSize, 'id' | 'revision'>>) => Promise<unknown>;
  onSaveChoiceSection: (section: ManagedChoiceSection) => Promise<unknown>;
  onDeleteChoiceSection: (section: Required<Pick<ManagedChoiceSection, 'id' | 'revision'>>) => Promise<unknown>;
  onCopyChoiceSections: (sourceProductId: string, destinationProductId: string, sizeNameMap?: Record<string, string>) => Promise<unknown>;
}

function formatMad(centimes: number) {
  return new Intl.NumberFormat('en-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
  }).format(centimes / 100);
}

export function ProductEditorPanel({
  product,
  creating,
  defaultCategoryId,
  nextSortOrder,
  categories,
  modifierGroups,
  ingredients,
  productSizes,
  choiceSections,
  products,
  recipeData,
  isRecipeLoading,
  onSave,
  onSetStatus,
  onDelete,
  onSaveModifierGroup,
  onSetModifierGroupArchived,
  onSaveRecipe,
  onSaveSize,
  onDeleteSize,
  onSaveChoiceSection,
  onDeleteChoiceSection,
  onCopyChoiceSections,
}: ProductEditorPanelProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceMad, setPriceMad] = useState('0');
  const [available, setAvailable] = useState(true);
  const [modifierGroupIds, setModifierGroupIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showRecipe, setShowRecipe] = useState(false);
  const [showModifiers, setShowModifiers] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    setName(product?.name ?? '');
    setCategoryId(
      product?.categoryId ??
        categories.find(
          (category) =>
            category.id === defaultCategoryId && category.status === 'active',
        )?.id ??
        categories.find((category) => category.status === 'active')?.id ??
        '',
    );
    setPriceMad(String((product?.basePriceCentimes ?? 0) / 100));
    setAvailable(product?.status !== 'unavailable');
    setModifierGroupIds(product?.modifierGroupIds ?? []);
  }, [creating, defaultCategoryId, product?.id, product?.revision]);

  useEffect(() => {
    setMessage('');
  }, [creating, product?.id]);

  const category = categories.find(
    (candidate) => candidate.id === categoryId,
  );
  const archived = product?.status === 'archived';
  const statusLabel = archived
    ? 'Archived'
    : available
      ? 'Active'
      : 'Unavailable';
  const priceCentimes = Math.round(Number(priceMad) * 100);
  const sizes = productSizes.filter((size) => size.productId === product?.id && size.status !== 'archived');

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      await onSave({
        id: product?.id,
        name,
        categoryId,
        basePriceCentimes: Math.round(Number(priceMad) * 100),
        status: available ? 'active' : 'unavailable',
        sortOrder: product?.sortOrder ?? nextSortOrder,
        modifierGroupIds,
        expectedRevision: product?.revision,
      });
      setMessage('Changes saved.');
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  if (!product && !creating) {
    return (
      <aside className={styles.panel} aria-labelledby="product-editor-title">
        <div className={styles.empty}>
          <Leaf size={28} aria-hidden="true" />
          <h2 id="product-editor-title">Select a product</h2>
          <p>Choose a live menu record or add a new product.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.panel} aria-labelledby="product-editor-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <small>PRODUCT DETAILS</small>
          <h2 id="product-editor-title">
            {creating ? 'Add product' : 'Edit product'}
          </h2>
        </span>
        <span className={styles.headerActions}>
          <span
            className={`${styles.activeStatus} ${archived || !available ? styles.inactiveStatus : ''}`}
          >
            <span />
            <strong>{statusLabel}</strong>
          </span>
          <button
            type="button"
            disabled={!product || saving}
            aria-label={
              archived ? 'Restore product' : 'Archive product'
            }
            title={archived ? 'Restore product' : 'Archive product'}
            onClick={async () => {
              if (!product) return;
              const nextStatus = archived ? 'active' : 'archived';
              if (
                nextStatus === 'archived' &&
                !window.confirm(`Archive ${product.name}?`)
              ) {
                return;
              }
              setSaving(true);
              setMessage('');
              try {
                await onSetStatus(product, nextStatus);
                setMessage(
                  nextStatus === 'archived'
                    ? 'Product archived.'
                    : 'Product restored.',
                );
              } catch (caught) {
                setMessage(
                  caught instanceof Error
                    ? caught.message
                    : 'Status change failed.',
                );
              } finally {
                setSaving(false);
              }
            }}
          >
            <DotsThree size={16} weight="regular" aria-hidden="true" />
          </button>
          {product ? (
            <button
              type="button"
              className={styles.deleteAction}
              disabled={saving}
              onClick={async () => {
                if (!window.confirm(
                  `Delete ${product.name}? Past orders will be preserved.`,
                )) return;
                setSaving(true);
                setMessage('');
                try {
                  await onDelete(product);
                } catch (caught) {
                  setMessage(caught instanceof Error
                    ? caught.message
                    : 'Product could not be deleted.');
                } finally {
                  setSaving(false);
                }
              }}
            >
              Delete
            </button>
          ) : null}
        </span>
      </header>

      <div className={styles.identity}>
        <span className={styles.identityLeft}>
          <span className={styles.artwork}>
            <Leaf size={25} weight="regular" aria-hidden="true" />
          </span>
          <span className={styles.identityCopy}>
            <strong>{name || 'New product'}</strong>
            <small>
              {(product?.key ?? 'NEW').toUpperCase()} ·{' '}
              {category?.name ?? 'Uncategorized'}
            </small>
          </span>
        </span>
        <span className={styles.priceSummary}>
          <strong>
            {formatMad(Math.round((Number(priceMad) || 0) * 100))}
          </strong>
          <small>Base price</small>
        </span>
      </div>

      <div className={`${styles.divider} ${styles.identityDivider}`} />
      <h3 className={styles.infoTitle}>Product information</h3>

      <label className={`${styles.field} ${styles.nameField}`}>
        <span>Product name</span>
        <input
          value={name}
          disabled={archived}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className={`${styles.field} ${styles.codeField}`}>
        <span>Product code</span>
        <input value={(product?.key ?? 'Generated on save').toUpperCase()} readOnly />
      </label>
      <label className={`${styles.field} ${styles.priceField}`}>
        <span>Price</span>
        <span className={styles.priceInput}>
          <input
            aria-label="Price in MAD"
            type="number"
            min="0"
            step="0.01"
            value={priceMad}
            disabled={archived}
            onChange={(event) => setPriceMad(event.target.value)}
          />
          <small>MAD</small>
        </span>
      </label>
      <label className={`${styles.field} ${styles.categoryField}`}>
        <span>Category</span>
        <select
          value={categoryId}
          disabled={archived}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Uncategorized</option>
          {categories.map((candidate) => (
            <option
              value={candidate.id}
              disabled={candidate.status === 'archived'}
              key={candidate.id}
            >
              {candidate.name}
            </option>
          ))}
        </select>
      </label>
      <div className={`${styles.field} ${styles.availabilityField}`}>
        <span>POS availability</span>
        <button
          type="button"
          className={`${styles.availability} ${!available ? styles.availabilityOff : ''}`}
          aria-pressed={available}
          disabled={archived}
          onClick={() => setAvailable((current) => !current)}
        >
          <strong>{available ? 'On' : 'Off'}</strong>
          <span><span /></span>
        </button>
      </div>

      <div className={`${styles.divider} ${styles.infoDivider}`} />
      <div className={styles.optionsHeader}>
        <strong>Sizes &amp; options</strong>
        <span>
          <button type="button" disabled={!product || archived} onClick={() => setShowSizes(true)}>Sizes</button>
          <button type="button" disabled={!product || archived} onClick={() => setShowChoices(true)}>Choices</button>
        </span>
      </div>
      <div className={styles.options}>
        {sizes.map((size) => <span className={styles.option} key={size.id}><strong>{size.name}</strong><small>{formatMad(size.priceCentimes)} · {size.status}</small></span>)}
        {choiceSections.map((section) => <span className={styles.option} key={section.id}><strong>{section.name}</strong><small>{section.values.length} choices</small></span>)}
        {!sizes.length && !choiceSections.length ? <small className={styles.emptyOptions}>No sizes or product choices yet.</small> : null}
      </div>
      <p className={styles.legacyNote}>POS still uses legacy shared groups until the next update.</p>
      <button type="button" className={styles.legacyGroups} onClick={() => setShowModifiers(true)}><SlidersHorizontal size={12} />Legacy POS groups</button>

      <div className={`${styles.divider} ${styles.optionsDivider}`} />
      <div className={styles.recipeHeader}>
        <strong>Recipe &amp; stock</strong>
        <span>
          <span className={recipeData?.versionNumber ? styles.recipeDotLinked : ''} />
          <small>
            {isRecipeLoading
              ? 'Loading'
              : recipeData?.versionNumber
                ? `Version ${recipeData.versionNumber}`
                : 'Not linked'}
          </small>
        </span>
      </div>
      <div className={styles.recipeEmpty}>
        <span className={styles.recipeIcon}>
          {recipeData?.versionNumber ? (
            <Link size={16} weight="regular" aria-hidden="true" />
          ) : (
            <LinkBreak size={16} weight="regular" aria-hidden="true" />
          )}
        </span>
        <span className={styles.recipeCopy}>
          <strong>
            {recipeData?.versionNumber
              ? `${recipeData.items.length} linked ingredients`
              : creating
                ? 'Save product before recipe'
                : 'Fiche technique not added'}
          </strong>
          <small>
            {recipeData?.versionNumber
              ? `${recipeData.versions.length} immutable version${recipeData.versions.length === 1 ? '' : 's'} saved.`
              : 'Link exact base-unit quantities when ready.'}
          </small>
        </span>
        <button
          type="button"
          disabled={!product || !recipeData || isRecipeLoading}
          onClick={() => setShowRecipe(true)}
        >
          <span>{recipeData?.versionNumber ? 'Edit' : 'Set up'}</span>
          <ArrowRight size={11} weight="regular" aria-hidden="true" />
        </button>
      </div>
      {message ? <p className={styles.notice}>{message}</p> : null}
      <button
        type="button"
        className={styles.save}
        onClick={save}
        disabled={
          saving ||
          archived ||
          !name.trim() ||
          !Number.isFinite(Number(priceMad)) ||
          Number(priceMad) < 0
        }
      >
        <FloppyDisk size={16} weight="regular" aria-hidden="true" />
        <span>{saving ? 'Saving…' : 'Save changes'}</span>
      </button>

      {showModifiers ? (
        <ModifierGroupDialog
          groups={modifierGroups}
          ingredients={ingredients}
          onClose={() => setShowModifiers(false)}
          onSave={onSaveModifierGroup}
          onSetArchived={onSetModifierGroupArchived}
        />
      ) : null}
      {showRecipe && product && recipeData ? (
        <RecipeEditorDialog
          product={product}
          data={recipeData}
          sizes={sizes}
          onClose={() => setShowRecipe(false)}
          onSave={(items, sizeQuantities) => onSaveRecipe(product, items, sizeQuantities)}
        />
      ) : null}
      {showSizes && product ? <SizesEditorDialog product={product} sizes={sizes} onClose={() => setShowSizes(false)} onSave={onSaveSize} onDelete={onDeleteSize} /> : null}
      {showChoices && product ? <ProductChoiceSectionDialog product={product} products={products} sizes={productSizes} ingredients={ingredients} sections={choiceSections} onClose={() => setShowChoices(false)} onSave={onSaveChoiceSection} onDelete={onDeleteChoiceSection} onCopy={onCopyChoiceSections} /> : null}
    </aside>
  );
}
