import { Plus, X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { useT } from '../../../../lib/locale';
import { formatMoney } from '../../../../lib/money';
import styles from './ModifierSelectionDialog.module.css';

export type PosProductSize = {
  id: string;
  name: string;
  priceCentimes: number;
  isDefault?: boolean;
};

export type PosChoiceValue = {
  id: string;
  name: string;
  priceDeltaCentimes: number;
  isDefaultSelected: boolean;
  sizeRules: Array<{
    sizeId: string;
    available: boolean;
    priceDeltaCentimes: number | null;
  }>;
};

export type PosChoiceSection = {
  id: string;
  name: string;
  required: boolean;
  min: number;
  max: number;
  selectionMode: 'single' | 'multiple';
  /** Empty means every size. */
  applicableSizeIds: string[];
  values: PosChoiceValue[];
};

type ModifierSelectionDialogProps = {
  productName: string;
  sizes: PosProductSize[];
  sections: PosChoiceSection[];
  onClose: () => void;
  onAdd: (selection: { sizeId: string; choiceValueIds: string[] }) => void;
};

function sectionApplies(section: PosChoiceSection, sizeId: string) {
  return (
    section.applicableSizeIds.length === 0
    || section.applicableSizeIds.includes(sizeId)
  );
}

function valueAvailable(value: PosChoiceValue, sizeId: string) {
  const rule = value.sizeRules.find((row) => row.sizeId === sizeId);
  return !rule || rule.available;
}

function valueDelta(value: PosChoiceValue, sizeId: string) {
  const rule = value.sizeRules.find((row) => row.sizeId === sizeId);
  return rule?.priceDeltaCentimes ?? value.priceDeltaCentimes;
}

function defaultSizeId(sizes: PosProductSize[]) {
  return sizes.find((size) => size.isDefault)?.id ?? sizes[0]?.id ?? '';
}

function defaultChoiceIds(sizeId: string, sections: PosChoiceSection[]) {
  const selected: string[] = [];
  for (const section of sections.filter((row) => sectionApplies(row, sizeId))) {
    const defaults = section.values.filter(
      (value) => value.isDefaultSelected && valueAvailable(value, sizeId),
    );
    if (section.max === 1) {
      if (defaults[0]) selected.push(defaults[0].id);
    } else {
      for (const value of defaults.slice(0, section.max)) {
        selected.push(value.id);
      }
    }
  }
  return selected;
}

export function ModifierSelectionDialog({
  productName,
  sizes,
  sections,
  onClose,
  onAdd,
}: ModifierSelectionDialogProps) {
  const t = useT();
  const [sizeId, setSizeId] = useState(() => defaultSizeId(sizes));
  const [selected, setSelected] = useState(() =>
    defaultChoiceIds(defaultSizeId(sizes), sections),
  );

  const applicableSections = sections.filter((section) =>
    sectionApplies(section, sizeId),
  );
  const size = sizes.find((candidate) => candidate.id === sizeId);
  const valid = Boolean(size) && applicableSections.every((section) => {
    const count = section.values.filter((value) =>
      selected.includes(value.id),
    ).length;
    if (section.required && count < 1) return false;
    return count >= section.min && count <= section.max;
  });
  const priceCentimes = size
    ? size.priceCentimes
      + applicableSections
        .flatMap((section) => section.values)
        .filter((value) => selected.includes(value.id))
        .reduce((sum, value) => sum + valueDelta(value, sizeId), 0)
    : 0;

  function selectSize(nextSizeId: string) {
    setSizeId(nextSizeId);
    setSelected(defaultChoiceIds(nextSizeId, sections));
  }

  function toggle(section: PosChoiceSection, valueId: string) {
    const sectionValueIds = section.values.map((value) => value.id);
    setSelected((current) => {
      if (section.max === 1) {
        return [
          ...current.filter((id) => !sectionValueIds.includes(id)),
          valueId,
        ];
      }
      if (current.includes(valueId)) {
        return current.filter((id) => id !== valueId);
      }
      const groupCount = current.filter((id) =>
        sectionValueIds.includes(id),
      ).length;
      return groupCount < section.max
        ? [...current, valueId]
        : current;
    });
  }

  return (
    <OverlayPortal>
    <div
      className={styles.overlay}
      role="presentation"
      onPointerDown={(event) => closeOnBackdrop(event, onClose)}
    >
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modifier-selection-title"
      >
        <header>
          <span>
            <small>{t('CUSTOMIZE ORDER')}</small>
            <h2 id="modifier-selection-title">{productName}</h2>
          </span>
          <button type="button" onClick={onClose} aria-label={t('Close selection')}>
            <X width={18} height={18} aria-hidden="true" />
          </button>
        </header>
        <div className={styles.groups}>
          {sizes.length > 1 ? (
            <fieldset>
              <legend>
                <strong>{t('Size')}</strong>
                <span>{t('Required · pick one')}</span>
              </legend>
              <div className={styles.options}>
                {sizes.map((candidate) => (
                  <label key={candidate.id}>
                    <input
                      type="radio"
                      name="product-size"
                      checked={sizeId === candidate.id}
                      onChange={() => selectSize(candidate.id)}
                    />
                    <span>{candidate.name}</span>
                    <strong>{formatMoney(candidate.priceCentimes)}</strong>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          {applicableSections.map((section) => {
            const visibleValues = section.values.filter((value) =>
              valueAvailable(value, sizeId),
            );
            return (
              <fieldset key={section.id}>
                <legend>
                  <strong>{section.name}</strong>
                  <span>
                    {section.required || section.min > 0
                      ? t('Required')
                      : t('Optional')}
                    {' · '}
                    {t('up to {max}', { max: section.max })}
                  </span>
                </legend>
                <div className={styles.options}>
                  {visibleValues.map((value) => {
                    const delta = valueDelta(value, sizeId);
                    return (
                      <label key={value.id}>
                        <input
                          type={section.max === 1 ? 'radio' : 'checkbox'}
                          name={`choice-${section.id}`}
                          checked={selected.includes(value.id)}
                          onChange={() => toggle(section, value.id)}
                        />
                        <span>{value.name}</span>
                        <strong>
                          {delta === 0
                            ? t('Included')
                            : `+ ${formatMoney(delta)}`}
                        </strong>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>
        <footer>
          <button type="button" className={styles.cancel} onClick={onClose}>
            {t('Cancel')}
          </button>
          <button
            type="button"
            className={styles.add}
            disabled={!valid}
            onClick={() =>
              onAdd({
                sizeId,
                choiceValueIds: selected.filter((id) =>
                  applicableSections.some((section) =>
                    section.values.some((value) => value.id === id),
                  )
                ),
              })}
          >
            <Plus width={16} height={16} aria-hidden="true" />
            {t('Add to order')} · {formatMoney(priceCentimes)}
          </button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
