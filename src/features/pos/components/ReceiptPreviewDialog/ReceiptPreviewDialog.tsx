import { X } from '@phosphor-icons/react';
import type { SavedReceipt } from '../../../../data/localSales.ts';
import { formatMoney } from '../../posSession';
import styles from './ReceiptPreviewDialog.module.css';

export function ReceiptPreviewDialog({
  receipt,
  onClose,
}: {
  receipt: SavedReceipt;
  onClose: () => void;
}) {
  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-preview-title"
      >
        <header>
          <span>
            <small>DEVELOPMENT RECEIPT · ON-SCREEN PREVIEW</small>
            <h2 id="receipt-preview-title">{receipt.receiptNumber}</h2>
          </span>
          <button type="button" onClick={onClose} aria-label="Close receipt preview">
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <dl className={styles.meta}>
          <div>
            <dt>Completed</dt>
            <dd>{new Date(receipt.completedAt).toLocaleString('en-GB')}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>{receipt.serviceType.replaceAll('-', ' ')}</dd>
          </div>
          {receipt.customerName ? (
            <div><dt>Customer</dt><dd>{receipt.customerName}</dd></div>
          ) : null}
          {receipt.tableLabel ? (
            <div><dt>Table</dt><dd>{receipt.tableLabel}</dd></div>
          ) : null}
        </dl>
        <div className={styles.lines}>
          {receipt.lines.map((line, index) => (
            <article key={`${line.productId}-${index}`}>
              <span>
                <strong>{line.receiptName}</strong>
                {line.modifiers.length > 0 ? (
                  <small>
                    {line.modifiers.map((modifier) => modifier.optionName).join(', ')}
                  </small>
                ) : null}
              </span>
              <span>{line.quantity} × {formatMoney(line.unitPriceCentimes)}</span>
              <strong>{formatMoney(line.lineTotalCentimes)}</strong>
            </article>
          ))}
        </div>
        <dl className={styles.totals}>
          <div><dt>Subtotal</dt><dd>{formatMoney(receipt.subtotalCentimes)}</dd></div>
          <div><dt>Tax</dt><dd>{formatMoney(receipt.taxCentimes)}</dd></div>
          <div><dt>Total</dt><dd>{formatMoney(receipt.totalCentimes)}</dd></div>
        </dl>
        <p>{receipt.taxPolicyLabel}</p>
        <p>{receipt.paymentMethod}</p>
        <footer>
          <span>Saved locally · synchronization continues automatically</span>
          <button type="button" onClick={onClose}>Close preview</button>
        </footer>
      </section>
    </div>
  );
}
