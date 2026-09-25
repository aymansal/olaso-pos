import { Save, Plus, Trash, X } from '@boxicons/react';
import { useEffect, useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import { useT } from '../../../../lib/locale';
import type {
  ManagedChoiceEffect,
  ManagedChoiceSection,
  ManagedIngredient,
  ManagedProduct,
  ManagedProductSize,
} from '../../productManagementTypes';
import styles from './ProductChoiceSectionDialog.module.css';

interface ProductChoiceSectionDialogProps {
  product: ManagedProduct;
  products: ManagedProduct[];
  sizes: ManagedProductSize[];
  ingredients: ManagedIngredient[];
  sections: ManagedChoiceSection[];
  onClose: () => void;
  onSave: (section: ManagedChoiceSection) => Promise<unknown>;
  onDelete: (section: Required<Pick<ManagedChoiceSection, 'id' | 'revision'>>) => Promise<unknown>;
  onCopy: (
    sourceProductId: string,
    destinationProductId: string,
    sizeNameMap?: Record<string, string>,
  ) => Promise<unknown>;
}

const EFFECT_LABELS: Record<ManagedChoiceEffect['effectType'], string> = {
  add: 'Add',
  replace: 'Replace',
  'set-exact': 'Set amount',
  remove: 'Remove',
};

const blankSection = (productId: string, sortOrder: number): ManagedChoiceSection => ({
  productId,
  name: '',
  selectionMode: 'single',
  required: false,
  minimumSelections: 0,
  maximumSelections: 1,
  sortOrder,
  status: 'active',
  productSizeIds: [],
  values: [],
});

const blankEffect = (ingredientId: string, sortOrder: number): ManagedChoiceEffect => ({
  effectType: 'add',
  ingredientId,
  quantity: 1,
  sortOrder,
  sizeQuantities: [],
});

const blankValue = (sortOrder: number): ManagedChoiceSection['values'][number] => ({
  name: '',
  priceDeltaCentimes: 0,
  isDefaultSelected: false,
  sortOrder,
  status: 'active',
  sizeRules: [],
  effects: [],
});

function withOneUsual(section: ManagedChoiceSection): ManagedChoiceSection {
  let kept = false;
  return {
    ...section,
    values: section.values.map((value) => {
      if (!value.isDefaultSelected) return value;
      if (kept) return { ...value, isDefaultSelected: false };
      kept = true;
      return value;
    }),
  };
}

export function ProductChoiceSectionDialog({
  product,
  products,
  sizes,
  ingredients,
  sections,
  onClose,
  onSave,
  onDelete,
  onCopy,
}: ProductChoiceSectionDialogProps) {
  const t = useT();
  const [selectedId, setSelectedId] = useState(sections[0]?.id ?? 'new');
  const selected = sections.find((section) => section.id === selectedId);
  const [draft, setDraft] = useState<ManagedChoiceSection>(
    selected ?? blankSection(product.id, sections.length * 10 + 10),
  );
  const [sourceId, setSourceId] = useState('');
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [copyOpen, setCopyOpen] = useState(false);
  const [openStock, setOpenStock] = useState<Record<number, boolean>>({});
  const [openSizes, setOpenSizes] = useState<Record<number, boolean>>({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const activeSizes = sizes.filter(
    (size) => size.productId === product.id && size.status === 'active',
  );
  const sourceSizes = sizes.filter(
    (size) => size.productId === sourceId && size.status === 'active',
  );
  const copyProducts = products.filter(
    (item) => item.id !== product.id && item.status !== 'archived',
  );

  useEffect(() => {
    setDraft(
      selected
        ? withOneUsual(structuredClone(selected))
        : blankSection(product.id, sections.length * 10 + 10),
    );
    setError('');
    setOpenStock({});
    setOpenSizes({});
  }, [product.id, sections.length, selected?.revision, selectedId]);

  useEffect(() => {
    setMapping(
      Object.fromEntries(
        sourceSizes.map((size) => [
          size.id!,
          activeSizes.find((item) => item.name === size.name)?.id ?? '',
        ]),
      ),
    );
  }, [sourceId, sourceSizes.length, activeSizes.length]);

  function updateValue(
    index: number,
    patch: Partial<ManagedChoiceSection['values'][number]>,
  ) {
    setDraft((current) => ({
      ...current,
      values: current.values.map((value, valueIndex) =>
        valueIndex === index ? { ...value, ...patch } : value,
      ),
    }));
  }

  function updateEffect(
    valueIndex: number,
    effectIndex: number,
    patch: Partial<ManagedChoiceEffect>,
  ) {
    const value = draft.values[valueIndex];
    if (!value) return;
    updateValue(valueIndex, {
      effects: value.effects.map((effect, index) =>
        index === effectIndex ? { ...effect, ...patch } : effect,
      ),
    });
  }

  function setMode(selectionMode: ManagedChoiceSection['selectionMode']) {
    setDraft((current) => ({
      ...current,
      selectionMode,
      maximumSelections: selectionMode === 'single' ? 1 : Math.max(2, current.maximumSelections),
      minimumSelections:
        selectionMode === 'single'
          ? current.required
            ? 1
            : 0
          : current.minimumSelections,
    }));
  }

  function toggleSize(sizeId: string) {
    setDraft((current) => ({
      ...current,
      productSizeIds: current.productSizeIds.includes(sizeId)
        ? current.productSizeIds.filter((id) => id !== sizeId)
        : [...current.productSizeIds, sizeId],
    }));
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      await onSave(withOneUsual(draft));
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Choice section save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function removeValue(index: number) {
    const next = {
      ...draft,
      values: draft.values.filter((_, valueIndex) => valueIndex !== index),
    };
    setDraft(next);
    if (!draft.id || draft.revision === undefined) return;
    setSaving(true);
    setError('');
    try {
      await onSave(next);
    } catch (caught) {
      setDraft(draft);
      setError(caught instanceof Error ? caught.message : 'Choice delete failed.');
    } finally {
      setSaving(false);
    }
  }

  async function removeSection() {
    if (!draft.id || draft.revision === undefined) {
      onClose();
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onDelete({ id: draft.id, revision: draft.revision });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Delete failed.');
    } finally {
      setSaving(false);
    }
  }

  const needsSizeMap = sourceSizes.some((size) => !mapping[size.id ?? '']);

  return (
    <OverlayPortal>
      <div
        className={styles.overlay}
        data-products-palette
        role="presentation"
        onPointerDown={(event) => closeOnBackdrop(event, onClose)}
      >
        <section
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="choice-dialog-title"
        >
          <header className={styles.header}>
            <span className={styles.heading}>
              <small>{t('CHOICES')}</small>
              <h2 id="choice-dialog-title">{product.name}</h2>
            </span>
            <button type="button" onClick={onClose} aria-label={t('Close choices editor')}>
              <X width={18} height={18} aria-hidden="true" />
            </button>
          </header>

          <div className={styles.tabs} role="tablist" aria-label={t('Groups')}>
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={section.id === selectedId}
                className={section.id === selectedId ? styles.tabOn : styles.tab}
                onClick={() => setSelectedId(section.id!)}
              >
                {section.name}
              </button>
            ))}
            <button
              type="button"
              role="tab"
              aria-selected={selectedId === 'new'}
              className={selectedId === 'new' ? styles.tabOn : styles.tab}
              onClick={() => setSelectedId('new')}
            >
              <Plus width={13} height={13} aria-hidden="true" />
              {t('New group')}
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.setup}>
              <label className={styles.nameField}>
                <span>{t('Group')}</span>
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>
              <div className={styles.mode} role="group" aria-label={t('How many choices')}>
                <button
                  type="button"
                  aria-pressed={draft.selectionMode === 'single'}
                  onClick={() => setMode('single')}
                >
                  {t('One')}
                </button>
                <button
                  type="button"
                  aria-pressed={draft.selectionMode === 'multiple'}
                  onClick={() => setMode('multiple')}
                >
                  {t('Several')}
                </button>
              </div>
              <button
                type="button"
                className={draft.required ? styles.requiredOn : styles.required}
                aria-pressed={draft.required}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    required: !current.required,
                    minimumSelections: !current.required
                      ? Math.max(1, current.minimumSelections)
                      : current.selectionMode === 'single'
                        ? 0
                        : current.minimumSelections,
                  }))
                }
              >
                {t('Required')}
              </button>
              {draft.selectionMode === 'multiple' ? (
                <>
                  <label className={styles.limit}>
                    <span>{t('At least')}</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={draft.minimumSelections || ''}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          minimumSelections: Number(event.target.value),
                        }))
                      }
                    />
                  </label>
                  <label className={styles.limit}>
                    <span>{t('At most')}</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="0"
                      value={draft.maximumSelections || ''}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          maximumSelections: Number(event.target.value),
                        }))
                      }
                    />
                  </label>
                </>
              ) : null}
            </div>

            {activeSizes.length > 1 ? (
              <div className={styles.sizes}>
                <span>{t('Sizes')}</span>
                <div>
                  {activeSizes.map((size) => {
                    const exclusive = draft.productSizeIds.includes(size.id!);
                    return (
                      <button
                        key={size.id}
                        type="button"
                        className={exclusive ? styles.sizeOn : styles.size}
                        aria-pressed={exclusive}
                        onClick={() => toggleSize(size.id!)}
                      >
                        {size.name}
                      </button>
                    );
                  })}
                </div>
                <small>
                  {draft.productSizeIds.length === 0 ? t('All sizes') : t('Selected sizes only')}
                </small>
              </div>
            ) : null}

            <div className={styles.valuesHead}>
              <strong>{t('Choices')}</strong>
              <button
                type="button"
                disabled={!ingredients[0]}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    values: [
                      ...current.values,
                      blankValue(current.values.length * 10 + 10),
                    ],
                  }))
                }
              >
                <Plus width={13} height={13} aria-hidden="true" />
                {t('Add')}
              </button>
            </div>

            {draft.values.map((value, valueIndex) => {
              const stockOpen = openStock[valueIndex] ?? value.effects.length > 0;
              const sizesOpen =
                openSizes[valueIndex]
                ?? value.sizeRules.some(
                  (rule) => !rule.available || rule.priceDeltaCentimes !== undefined,
                );
              return (
                <article className={styles.value} key={value.id ?? valueIndex}>
                  <div className={styles.valueRow}>
                    <label className={styles.valueName}>
                      <input
                        aria-label={t('Choice name')}
                        value={value.name}
                        placeholder={t('Choice')}
                        onChange={(event) =>
                          updateValue(valueIndex, { name: event.target.value })
                        }
                      />
                    </label>
                    <label className={styles.extra}>
                      <span>{t('Extra')}</span>
                      <span className={styles.extraBox}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          value={value.priceDeltaCentimes / 100 || ''}
                          onChange={(event) =>
                            updateValue(valueIndex, {
                              priceDeltaCentimes: Math.round(Number(event.target.value) * 100),
                            })
                          }
                        />
                        <small>{t('DH')}</small>
                      </span>
                    </label>
                    <button
                      type="button"
                      className={value.isDefaultSelected ? styles.usualOn : styles.usual}
                      aria-pressed={value.isDefaultSelected}
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          values: current.values.map((item, index) => ({
                            ...item,
                            isDefaultSelected:
                              index === valueIndex
                                ? !value.isDefaultSelected
                                : false,
                          })),
                        }))
                      }
                    >
                      {t('Usual')}
                    </button>
                    <button
                      type="button"
                      className={styles.link}
                      onClick={() =>
                        setOpenStock((current) => ({ ...current, [valueIndex]: !stockOpen }))
                      }
                    >
                      {t('Stock')}
                    </button>
                    {activeSizes.length > 1 ? (
                      <button
                        type="button"
                        className={styles.link}
                        onClick={() =>
                          setOpenSizes((current) => ({ ...current, [valueIndex]: !sizesOpen }))
                        }
                      >
                        {t('By size')}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className={styles.remove}
                      aria-label={t('Remove {name}', { name: value.name || t('Choice') })}
                      disabled={saving}
                      onClick={() => void removeValue(valueIndex)}
                    >
                      <Trash width={15} height={15} aria-hidden="true" />
                    </button>
                  </div>

                  {sizesOpen && activeSizes.length > 1 ? (
                    <div className={styles.sizeRules}>
                      {activeSizes.map((size) => {
                        const rule = value.sizeRules.find(
                          (item) => item.productSizeId === size.id,
                        );
                        return (
                          <label key={size.id} className={styles.sizeRule}>
                            <span>{size.name}</span>
                            <input
                              type="checkbox"
                              checked={rule?.available ?? true}
                              onChange={(event) =>
                                updateValue(valueIndex, {
                                  sizeRules: [
                                    ...value.sizeRules.filter(
                                      (item) => item.productSizeId !== size.id,
                                    ),
                                    {
                                      productSizeId: size.id!,
                                      available: event.target.checked,
                                      ...(rule?.priceDeltaCentimes === undefined
                                        ? {}
                                        : { priceDeltaCentimes: rule.priceDeltaCentimes }),
                                    },
                                  ],
                                })
                              }
                            />
                            <input
                              aria-label={t('{name} extra', { name: size.name })}
                              type="number"
                              placeholder={t('DH')}
                              step="0.01"
                              value={
                                rule?.priceDeltaCentimes
                                  ? rule.priceDeltaCentimes / 100
                                  : ''
                              }
                              onChange={(event) =>
                                updateValue(valueIndex, {
                                  sizeRules: [
                                    ...value.sizeRules.filter(
                                      (item) => item.productSizeId !== size.id,
                                    ),
                                    {
                                      productSizeId: size.id!,
                                      available: rule?.available ?? true,
                                      priceDeltaCentimes: Math.round(
                                        Number(event.target.value) * 100,
                                      ),
                                    },
                                  ],
                                })
                              }
                            />
                          </label>
                        );
                      })}
                    </div>
                  ) : null}

                  {stockOpen ? (
                    <div className={styles.stock}>
                      {value.effects.map((effect, effectIndex) => (
                        <div className={styles.effect} key={effect.id ?? effectIndex}>
                          <MenuSelect
                            ariaLabel="Stock change"
                            className={styles.effectSelect}
                            value={effect.effectType}
                            onChange={(id) =>
                              updateEffect(valueIndex, effectIndex, {
                                effectType: id as ManagedChoiceEffect['effectType'],
                              })
                            }
                            options={(
                              Object.keys(EFFECT_LABELS) as Array<
                                ManagedChoiceEffect['effectType']
                              >
                            ).map((type) => ({
                              id: type,
                              label: EFFECT_LABELS[type],
                            }))}
                          />
                          <MenuSelect
                            ariaLabel="Ingredient"
                            className={styles.effectSelect}
                            value={effect.ingredientId}
                            onChange={(id) =>
                              updateEffect(valueIndex, effectIndex, {
                                ingredientId: id,
                              })
                            }
                            options={ingredients.map((ingredient) => ({
                              id: ingredient.id,
                              label: ingredient.name,
                            }))}
                          />
                          {effect.effectType === 'replace' ? (
                            <MenuSelect
                              ariaLabel="Replacement"
                              className={styles.effectSelect}
                              value={effect.replacementIngredientId ?? ''}
                              placeholder="Replacement"
                              onChange={(id) =>
                                updateEffect(valueIndex, effectIndex, {
                                  replacementIngredientId: id,
                                })
                              }
                              options={ingredients.map((ingredient) => ({
                                id: ingredient.id,
                                label: ingredient.name,
                              }))}
                            />
                          ) : null}
                          {effect.effectType !== 'remove' ? (
                            <input
                            aria-label={t('Amount')}
                              type="number"
                              min="0"
                              placeholder="0"
                              value={effect.quantity || ''}
                              onChange={(event) =>
                                updateEffect(valueIndex, effectIndex, {
                                  quantity: Number(event.target.value),
                                })
                              }
                            />
                          ) : null}
                          <button
                            type="button"
                            className={styles.effectRemove}
                            aria-label={t('Remove stock change')}
                            onClick={() =>
                              updateValue(valueIndex, {
                                effects: value.effects.filter((_, index) => index !== effectIndex),
                              })
                            }
                          >
                            <X width={13} height={13} aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className={styles.addEffect}
                        disabled={!ingredients[0]}
                        onClick={() =>
                          updateValue(valueIndex, {
                            effects: [
                              ...value.effects,
                              blankEffect(
                                ingredients[0]?.id ?? '',
                                value.effects.length * 10 + 10,
                              ),
                            ],
                          })
                        }
                      >
                        <Plus width={12} height={12} aria-hidden="true" />
                        {t('Stock change')}
                      </button>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          {copyOpen ? (
            <div className={styles.copy}>
              <MenuSelect
                ariaLabel="Copy from product"
                className={styles.copySelect}
                value={sourceId}
                placeholder="Choose product"
                onChange={setSourceId}
                options={copyProducts.map((item) => ({
                  id: item.id,
                  label: item.name,
                }))}
              />
              {needsSizeMap ? (
                <div className={styles.mapping}>
                  {sourceSizes.map((size) => (
                    <label key={size.id}>
                      {size.name}
                      <MenuSelect
                        className={styles.mapSelect}
                        value={mapping[size.id ?? ''] ?? ''}
                        placeholder="Map size"
                        onChange={(id) =>
                          setMapping((current) => ({
                            ...current,
                            [size.id!]: id,
                          }))
                        }
                        options={activeSizes.map((item) => ({
                          id: item.id ?? '',
                          label: item.name,
                        }))}
                      />
                    </label>
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                className={styles.copyAction}
                disabled={!sourceId || needsSizeMap}
                onClick={async () => {
                  try {
                    await onCopy(sourceId, product.id, mapping);
                    onClose();
                  } catch (caught) {
                    setError(caught instanceof Error ? caught.message : 'Copy failed.');
                  }
                }}
              >
                {t('Copy')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.copyToggle}
              onClick={() => setCopyOpen(true)}
            >
              {t('Copy choices from another product')}
            </button>
          )}

          {error ? <p className={styles.error}>{t(error)}</p> : null}

          <footer className={styles.footer}>
            {draft.id ? (
              <button
                type="button"
                className={styles.delete}
                disabled={saving}
                onClick={() => void removeSection()}
              >
                {t('Delete')}
              </button>
            ) : (
              <button type="button" className={styles.cancel} onClick={onClose}>
                {t('Cancel')}
              </button>
            )}
            <button
              type="button"
              className={styles.save}
              onClick={save}
              disabled={saving || !draft.name.trim()}
            >
              <Save width={16} height={16} aria-hidden="true" />
              {saving ? t('Saving…') : t('Save')}
            </button>
          </footer>
        </section>
      </div>
    </OverlayPortal>
  );
}
