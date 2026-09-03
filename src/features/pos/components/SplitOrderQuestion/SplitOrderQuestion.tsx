import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { useT } from '../../../../lib/locale';
import styles from './SplitOrderQuestion.module.css';

export function SplitOrderQuestion({
  processing,
  onCancel,
  onSplit,
  onSingle,
}: {
  processing: boolean;
  onCancel: () => void;
  onSplit: () => void;
  onSingle: () => void;
}) {
  const t = useT();
  return (
    <OverlayPortal>
      <div
        className={styles.overlay}
        role="presentation"
        onPointerDown={(event) => {
          if (!processing) closeOnBackdrop(event, onCancel);
        }}
      >
        <section
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="split-order-title"
        >
          <p id="split-order-title" className={styles.question}>
            {t('Does this order need to be split?')}
          </p>
          <footer className={styles.actions}>
            <button
              type="button"
              className={styles.single}
              disabled={processing}
              onClick={onSingle}
            >
              {t('No, one payment')}
            </button>
            <button
              type="button"
              className={styles.split}
              disabled={processing}
              onClick={onSplit}
            >
              {t('Yes, split it')}
            </button>
          </footer>
        </section>
      </div>
    </OverlayPortal>
  );
}
