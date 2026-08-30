import { X } from '@boxicons/react';
import { OverlayPortal } from '../OverlayPortal';
import { formatMoney } from '../../lib/money';
import styles from './ReceiptPreviewDialog.module.css';

export type ReceiptPreviewValue = {
  receiptNumber: string;
  completedAt: number;
  cashierName?: string;
  serviceType: 'dine-in' | 'take-away' | 'order-online';
  customerName?: string;
  tableLabel?: string;
  lines: Array<{
    productName: string;
    receiptName?: string;
    quantity: number;
    unitPriceCentimes: number;
    lineTotalCentimes: number;
    sizeName?: string;
    modifiers: Array<{ optionName: string }>;
    complimentary?: boolean;
  }>;
  subtotalCentimes: number;
  discountCentimes: number;
  taxCentimes: number;
  totalCentimes: number;
  taxPolicyLabel: string;
  paymentMethod: string;
};

export function ReceiptPreviewDialog({
  receipt,
  onClose,
  statusMessage = 'Saved locally · synchronization continues automatically',
}: {
  receipt: ReceiptPreviewValue;
  onClose: () => void;
  statusMessage?: string;
}) {
  return (
    <OverlayPortal>
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
            <X width={18} height={18} aria-hidden="true" />
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
          {receipt.cashierName ? (
            <div><dt>Cashier</dt><dd>{receipt.cashierName}</dd></div>
          ) : null}
          {receipt.customerName ? (
            <div><dt>Customer</dt><dd>{receipt.customerName}</dd></div>
          ) : null}
          {receipt.tableLabel ? (
            <div><dt>Table</dt><dd>{receipt.tableLabel}</dd></div>
          ) : null}
        </dl>
        <div className={styles.lines}>
          {receipt.lines.map((line, index) => (
            <article key={`${line.productName}-${index}`}>
              <span>
                <strong>{line.receiptName ?? line.productName}</strong>
                {(() => {
                  const options = [
                    line.complimentary ? 'Offert' : '',
                    line.sizeName,
                    ...line.modifiers.map((modifier) => modifier.optionName),
                  ].filter(Boolean).join(', ');
                  return options ? <small>{options}</small> : null;
                })()}
              </span>
              <span>{line.quantity} × {formatMoney(line.unitPriceCentimes)}</span>
              <strong>{formatMoney(line.complimentary ? 0 : line.lineTotalCentimes)}</strong>
            </article>
          ))}
        </div>
        <dl className={styles.totals}>
          <div><dt>Subtotal</dt><dd>{formatMoney(receipt.subtotalCentimes)}</dd></div>
          {receipt.discountCentimes > 0 ? (
            <div>
              <dt>Offert</dt>
              <dd>-{formatMoney(receipt.discountCentimes)}</dd>
            </div>
          ) : null}
          <div><dt>Tax</dt><dd>{formatMoney(receipt.taxCentimes)}</dd></div>
          <div><dt>Total</dt><dd>{formatMoney(receipt.totalCentimes)}</dd></div>
        </dl>
        <p>{receipt.taxPolicyLabel}</p>
        <p>{receipt.paymentMethod}</p>
        <footer>
          <span>{statusMessage}</span>
          <button type="button" onClick={onClose}>Close preview</button>
        </footer>
      </section>
    </div>
    </OverlayPortal>
  );
}
