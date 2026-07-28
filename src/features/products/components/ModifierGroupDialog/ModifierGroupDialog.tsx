import { FloppyDisk, Plus, Trash, X } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import type {
  ManagedIngredient,
  ManagedModifierGroup,
} from '../../productManagementTypes';
import styles from './ModifierGroupDialog.module.css';

interface ModifierGroupDialogProps {
  groups: ManagedModifierGroup[];
  ingredients: ManagedIngredient[];
  onClose: () => void;
  onSave: (group: ManagedModifierGroup) => Promise<void>;
  onSetArchived: (
    group: ManagedModifierGroup,
    archived: boolean,
  ) => Promise<void>;
}

function blankGroup(sortOrder: number): ManagedModifierGroup {
  return {
    name: '',
    required: false,
    minSelections: 0,
    maxSelections: 1,
    status: 'active',
    sortOrder,
    options: [],
  };
}

export function ModifierGroupDialog({
  groups,
  ingredients,
  onClose,
  onSave,
  onSetArchived,
}: ModifierGroupDialogProps) {
  const [selectedId, setSelectedId] = useState(groups[0]?.id ?? 'new');
  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedId),
    [groups, selectedId],
  );
  const [draft, setDraft] = useState<ManagedModifierGroup>(
    selectedGroup ?? blankGroup(groups.length * 10 + 10),
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(
      selectedGroup
        ? structuredClone(selectedGroup)
        : blankGroup(groups.length * 10 + 10),
    );
    setError('');
  }, [groups.length, selectedGroup?.revision, selectedId]);

  function updateOption(
    index: number,
    patch: Partial<ManagedModifierGroup['options'][number]>,
  ) {
    setDraft((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, ...patch } : option,
      ),
    }));
  }

  async function submit() {
    setSaving(true);
    setError('');
    try {
      await onSave(draft);
      onClose();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Modifier save failed.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modifier-dialog-title"
      >
        <header>
          <span>
            <small>MENU OPTIONS</small>
            <h2 id="modifier-dialog-title">Modifier groups</h2>
          </span>
          <button type="button" onClick={onClose} aria-label="Close modifier editor">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.groupPicker}>
          <label>
            <span>Group</span>
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {groups.map((group) => (
                <option value={group.id} key={group.id}>
                  {group.name}{group.status === 'archived' ? ' · Archived' : ''}
                </option>
              ))}
              <option value="new">New group</option>
            </select>
          </label>
          <button type="button" onClick={() => setSelectedId('new')}>
            <Plus size={15} aria-hidden="true" />
            New group
          </button>
        </div>

        <div className={styles.groupFields}>
          <label>
            <span>Name</span>
            <input
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>Minimum</span>
            <input
              type="number"
              min="0"
              max="10"
              value={draft.minSelections}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  minSelections: Number(event.target.value),
                }))
              }
            />
          </label>
          <label>
            <span>Maximum</span>
            <input
              type="number"
              min="1"
              max="10"
              value={draft.maxSelections}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  maxSelections: Number(event.target.value),
                }))
              }
            />
          </label>
          <label className={styles.required}>
            <input
              type="checkbox"
              checked={draft.required}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  required: event.target.checked,
                  minSelections: event.target.checked
                    ? Math.max(1, current.minSelections)
                    : current.minSelections,
                }))
              }
            />
            Required choice
          </label>
        </div>

        <div className={styles.optionsHeader}>
          <strong>Options</strong>
          <button
            type="button"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                options: [
                  ...current.options,
                  {
                    key: '',
                    name: '',
                    priceDeltaCentimes: 0,
                    ingredientEffects: [],
                    status: 'active',
                    sortOrder: current.options.length * 10 + 10,
                  },
                ],
              }))
            }
          >
            <Plus size={14} aria-hidden="true" />
            Add option
          </button>
        </div>

        <div className={styles.options}>
          {draft.options.map((option, optionIndex) => (
            <article className={styles.option} key={option.id ?? optionIndex}>
              <div className={styles.optionFields}>
                <label>
                  <span>Option name</span>
                  <input
                    value={option.name}
                    onChange={(event) =>
                      updateOption(optionIndex, { name: event.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Price delta · MAD</span>
                  <input
                    type="number"
                    step="0.01"
                    value={option.priceDeltaCentimes / 100}
                    onChange={(event) =>
                      updateOption(optionIndex, {
                        priceDeltaCentimes: Math.round(
                          Number(event.target.value) * 100,
                        ),
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    option.id
                      ? updateOption(optionIndex, { status: 'archived' })
                      : setDraft((current) => ({
                          ...current,
                          options: current.options.filter(
                            (_, index) => index !== optionIndex,
                          ),
                        }))
                  }
                  aria-label={`Remove ${option.name || 'option'}`}
                >
                  <Trash size={15} aria-hidden="true" />
                </button>
              </div>

              <div className={styles.effects}>
                {option.ingredientEffects.map((effect, effectIndex) => (
                  <span className={styles.effect} key={`${effect.ingredientId}-${effectIndex}`}>
                    <select
                      aria-label="Effect ingredient"
                      value={effect.ingredientId}
                      onChange={(event) => {
                        const effects = option.ingredientEffects.map(
                          (current, index) =>
                            index === effectIndex
                              ? { ...current, ingredientId: event.target.value }
                              : current,
                        );
                        updateOption(optionIndex, {
                          ingredientEffects: effects,
                        });
                      }}
                    >
                      {ingredients.map((ingredient) => (
                        <option value={ingredient.id} key={ingredient.id}>
                          {ingredient.name}
                        </option>
                      ))}
                    </select>
                    <input
                      aria-label="Signed ingredient quantity"
                      type="number"
                      step="1"
                      value={effect.quantityDelta}
                      onChange={(event) => {
                        const effects = option.ingredientEffects.map(
                          (current, index) =>
                            index === effectIndex
                              ? {
                                  ...current,
                                  quantityDelta: Number(event.target.value),
                                }
                              : current,
                        );
                        updateOption(optionIndex, {
                          ingredientEffects: effects,
                        });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateOption(optionIndex, {
                          ingredientEffects: option.ingredientEffects.filter(
                            (_, index) => index !== effectIndex,
                          ),
                        })
                      }
                      aria-label="Remove ingredient effect"
                    >
                      <X size={13} aria-hidden="true" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className={styles.addEffect}
                  disabled={!ingredients[0]}
                  onClick={() =>
                    ingredients[0] &&
                    updateOption(optionIndex, {
                      ingredientEffects: [
                        ...option.ingredientEffects,
                        {
                          ingredientId: ingredients[0].id,
                          quantityDelta: 1,
                        },
                      ],
                    })
                  }
                >
                  <Plus size={12} aria-hidden="true" />
                  Ingredient effect
                </button>
              </div>
            </article>
          ))}
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}
        <footer>
          {draft.id ? (
            <button
              type="button"
              className={styles.archive}
              onClick={async () => {
                setSaving(true);
                try {
                  await onSetArchived(draft, draft.status !== 'archived');
                  onClose();
                } catch (caught) {
                  setError(
                    caught instanceof Error
                      ? caught.message
                      : 'Status change failed.',
                  );
                } finally {
                  setSaving(false);
                }
              }}
            >
              {draft.status === 'archived' ? 'Restore group' : 'Archive group'}
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            className={styles.save}
            onClick={submit}
            disabled={saving}
          >
            <FloppyDisk size={16} aria-hidden="true" />
            {saving ? 'Saving…' : 'Save group'}
          </button>
        </footer>
      </section>
    </div>
  );
}
