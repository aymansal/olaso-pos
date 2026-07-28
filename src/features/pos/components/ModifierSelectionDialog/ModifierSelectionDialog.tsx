import { Plus, X } from '@phosphor-icons/react';
import { useState } from 'react';
import { formatMoney } from '../../../../lib/money';
import styles from './ModifierSelectionDialog.module.css';

export type PosModifierGroup = {
  id: string;
  name: string;
  minimumSelections: number;
  maximumSelections: number;
  options: Array<{
    id: string;
    name: string;
    priceDeltaCentimes: number;
  }>;
};

type ModifierSelectionDialogProps = {
  productName: string;
  basePriceCentimes: number;
  groups: PosModifierGroup[];
  onClose: () => void;
  onAdd: (modifierOptionIds: string[]) => void;
};

export function ModifierSelectionDialog({
  productName,
  basePriceCentimes,
  groups,
  onClose,
  onAdd,
}: ModifierSelectionDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const valid = groups.every((group) => {
    const count = group.options.filter((option) =>
      selected.includes(option.id),
    ).length;
    return (
      count >= group.minimumSelections
      && count <= group.maximumSelections
    );
  });
  const priceCentimes =
    basePriceCentimes
    + groups
      .flatMap((group) => group.options)
      .filter((option) => selected.includes(option.id))
      .reduce((sum, option) => sum + option.priceDeltaCentimes, 0);

  function toggle(group: PosModifierGroup, optionId: string) {
    const groupOptionIds = group.options.map((option) => option.id);
    setSelected((current) => {
      if (group.maximumSelections === 1) {
        return [
          ...current.filter((id) => !groupOptionIds.includes(id)),
          optionId,
        ];
      }
      if (current.includes(optionId)) {
        return current.filter((id) => id !== optionId);
      }
      const groupCount = current.filter((id) =>
        groupOptionIds.includes(id),
      ).length;
      return groupCount < group.maximumSelections
        ? [...current, optionId]
        : current;
    });
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modifier-selection-title"
      >
        <header>
          <span>
            <small>CUSTOMIZE ORDER</small>
            <h2 id="modifier-selection-title">{productName}</h2>
          </span>
          <button type="button" onClick={onClose} aria-label="Close modifiers">
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <div className={styles.groups}>
          {groups.map((group) => (
            <fieldset key={group.id}>
              <legend>
                <strong>{group.name}</strong>
                <span>
                  {group.minimumSelections > 0 ? 'Required' : 'Optional'}
                  {' · '}
                  up to {group.maximumSelections}
                </span>
              </legend>
              <div className={styles.options}>
                {group.options.map((option) => (
                  <label key={option.id}>
                    <input
                      type={
                        group.maximumSelections === 1 ? 'radio' : 'checkbox'
                      }
                      name={`modifier-${group.id}`}
                      checked={selected.includes(option.id)}
                      onChange={() => toggle(group, option.id)}
                    />
                    <span>{option.name}</span>
                    <strong>
                      {option.priceDeltaCentimes === 0
                        ? 'Included'
                        : `+ ${formatMoney(option.priceDeltaCentimes)}`}
                    </strong>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <footer>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.add}
            disabled={!valid}
            onClick={() => onAdd(selected)}
          >
            <Plus size={16} aria-hidden="true" />
            Add to order · {formatMoney(priceCentimes)}
          </button>
        </footer>
      </section>
    </div>
  );
}
