import {
  CheckCircle,
  Clock,
  DotsThree,
  Info,
  MapPin,
  Package,
  Printer,
  Receipt,
  ArrowsClockwise,
  ArrowCounterClockwise,
  Storefront,
  User,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { ReceiptPreviewDialog } from '../../../../components/ReceiptPreviewDialog/ReceiptPreviewDialog';
import type { OrderHistoryRecord } from '../../../../data/orderHistory';
import { formatMoney } from '../../../../lib/money';
import styles from './OrderDetailPanel.module.css';
import { CancellationDialog } from '../CancellationDialog/CancellationDialog';

function serviceLabel(order: OrderHistoryRecord) {
  if (order.receipt.serviceType === 'dine-in') return 'Dine in';
  if (order.receipt.serviceType === 'take-away') return 'Take away';
  return 'Order online';
}

function stateLabel(order: OrderHistoryRecord) {
  if (order.syncState === 'failed') return 'Needs sync';
  if (order.syncState === 'pending') return 'Waiting to sync';
  if (order.status === 'cancelled') return 'Cancelled';
  if (order.status === 'refunded') return 'Refunded';
  return 'Completed';
}

export function OrderDetailPanel({
  order,
  retrying,
  reprinting,
  cancelling,
  onRetry,
  onReprint,
  onCancel,
}: {
  order?: OrderHistoryRecord;
  retrying: boolean;
  reprinting: boolean;
  cancelling: boolean;
  onRetry: (localSaleId: string) => Promise<void>;
  onReprint: (order: OrderHistoryRecord) => Promise<void>;
  onCancel: (order: OrderHistoryRecord, reason: string) => Promise<void>;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [cancellationOpen, setCancellationOpen] = useState(false);

  if (!order) {
    return (
      <aside className={`${styles.panel} ${styles.empty}`} aria-live="polite">
        <Receipt size={28} aria-hidden="true" />
        <strong>No order selected</strong>
        <span>Choose a saved order to inspect its receipt snapshot.</span>
      </aside>
    );
  }

  const itemCount = order.receipt.lines.reduce(
    (total, line) => total + line.quantity,
    0,
  );
  const metadata = [
    { icon: Storefront, value: serviceLabel(order), label: 'Service' },
    { icon: MapPin, value: order.receipt.tableLabel ?? '—', label: 'Table' },
    {
      icon: Clock,
      value: new Date(order.receipt.completedAt).toLocaleTimeString(
        'en-GB',
        { hour: '2-digit', minute: '2-digit' },
      ),
      label: 'Created',
    },
  ] as const;
  const canRetry = order.syncState !== 'synced';
  const canReprint = order.status === 'completed' && Boolean(order.printState);
  const canCancel = order.status === 'completed' && Boolean(order.printState);
  const statusTone = canRetry || order.status !== 'completed'
    ? styles.statusAttention
    : styles.statusComplete;
  const syncNote = order.syncState === 'failed'
    ? 'Cloud synchronization needs attention. Retry when online.'
    : order.syncState === 'pending'
      ? 'Saved locally · waiting for cloud acknowledgement'
      : 'Cancellation and refund permissions await owner confirmation';
  const printNote = order.printState === 'failed'
    ? 'Printer unavailable · reprint available'
    : order.printState === 'pending'
      ? 'Receipt pending · reprint available'
      : order.printState === 'printed'
        ? `Receipt sent · ${order.printAttemptCount} attempt${order.printAttemptCount === 1 ? '' : 's'}`
        : 'Reprint unavailable on this tablet';
  const syncStateNote = order.syncState === 'synced'
    ? 'Cloud synced'
    : order.syncState === 'failed'
      ? 'Needs sync'
      : 'Waiting to sync';

  return (
    <aside className={styles.panel} aria-labelledby="selected-order-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <small>SELECTED ORDER</small>
          <h2 id="selected-order-title">{order.receipt.receiptNumber}</h2>
        </span>
        <span className={styles.headerActions}>
          <span className={`${styles.orderStatus} ${statusTone}`}>
            <span />
            <strong>{stateLabel(order)}</strong>
          </span>
          <button type="button" aria-label="Cancel order" title={canCancel ? 'Cancel this whole sale' : 'This order cannot be corrected'} disabled={!canCancel || cancelling} onClick={() => setCancellationOpen(true)}>
            {canCancel ? <ArrowCounterClockwise size={16} weight="regular" aria-hidden="true" /> : <DotsThree size={16} weight="regular" aria-hidden="true" />}
          </button>
        </span>
      </header>

      <div className={styles.metadata}>
        {metadata.map(({ icon: Icon, value, label }) => (
          <span className={styles.metaItem} key={label}>
            <Icon size={16} weight="regular" aria-hidden="true" />
            <span>
              <strong>{value}</strong>
              <small>{label}</small>
            </span>
          </span>
        ))}
      </div>

      <div className={styles.customer}>
        <span className={styles.customerIdentity}>
          <span className={styles.customerIcon}>
            <User size={16} weight="regular" aria-hidden="true" />
          </span>
          <span>
            <small>Customer</small>
            <strong>{order.receipt.customerName ?? 'Walk-in'}</strong>
          </span>
        </span>
        <small>{order.cashierName ?? 'Cashier unavailable'}</small>
      </div>

      <div className={`${styles.divider} ${styles.customerDivider}`} />

      <div className={styles.itemsHeader}>
        <strong>Order items</strong>
        <small>{itemCount} {itemCount === 1 ? 'item' : 'items'}</small>
      </div>

      <div className={styles.items}>
        {order.receipt.lines.map((item, index) => {
          const options = item.modifiers
            .map((modifier) => modifier.optionName)
            .join(', ');
          return (
            <article className={styles.item} key={`${item.productName}-${index}`}>
              <span className={`${styles.itemIcon} ${index === 0 ? styles.itemIconActive : ''}`}>
                <Package size={17} weight="regular" aria-hidden="true" />
              </span>
              <span className={styles.itemCopy}>
                <strong>{item.productName}</strong>
                <small>
                  {options ? `${options} · ` : ''}
                  {formatMoney(item.unitPriceCentimes)} × {item.quantity}
                </small>
              </span>
              <strong className={styles.itemTotal}>
                {formatMoney(item.lineTotalCentimes)}
              </strong>
              {index < order.receipt.lines.length - 1
                ? <span className={styles.itemDivider} />
                : null}
            </article>
          );
        })}
      </div>

      <div className={`${styles.divider} ${styles.itemsDivider}`} />

      <div className={styles.paymentHeader}>
        <strong>Payment</strong>
        <span>
          <span />
          <small>{order.receipt.paymentMethod}</small>
        </span>
      </div>

      <dl className={styles.payment}>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatMoney(order.receipt.subtotalCentimes)}</dd>
        </div>
        <div><dt>Tax</dt><dd>{formatMoney(order.receipt.taxCentimes)}</dd></div>
        <div className={styles.total}>
          <dt>Total</dt>
          <dd>{formatMoney(order.receipt.totalCentimes)}</dd>
        </div>
      </dl>

      <div className={`${styles.divider} ${styles.actionsDivider}`} />

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.reprint}
          disabled={!canReprint || reprinting}
          title={canReprint ? 'Print the immutable saved receipt' : printNote}
          onClick={() => void onReprint(order)}
        >
          <Printer size={17} weight="regular" aria-hidden="true" />
          <span>{reprinting ? 'Printing…' : 'Reprint'}</span>
        </button>
        <button
          type="button"
          className={styles.preview}
          onClick={() => setPreviewOpen(true)}
        >
          <Receipt size={17} weight="regular" aria-hidden="true" />
          <span>View receipt</span>
        </button>
        <button
          type="button"
          className={styles.sync}
          disabled={!canRetry || retrying}
          onClick={() => void onRetry(order.localSaleId)}
        >
          {canRetry ? (
            <ArrowsClockwise size={18} weight="regular" aria-hidden="true" />
          ) : (
            <CheckCircle size={18} weight="regular" aria-hidden="true" />
          )}
          <span>{retrying ? 'Retrying…' : canRetry ? 'Retry sync' : 'Synced'}</span>
        </button>
        <button type="button" className={styles.cancelOrder} disabled={!canCancel || cancelling} onClick={() => setCancellationOpen(true)}>
          <ArrowCounterClockwise size={17} weight="regular" aria-hidden="true" />
          <span>{cancelling ? 'Cancelling…' : 'Cancel'}</span>
        </button>
      </div>

      <div className={styles.stockNote} title={order.printError ?? printNote}>
        <Info size={13} weight="regular" aria-hidden="true" />
        <span>{printNote} · {syncStateNote}</span>
      </div>
      {previewOpen ? (
        <ReceiptPreviewDialog
          receipt={order.receipt}
          statusMessage={
            order.syncState === 'synced'
              ? 'Cloud copy confirmed · saved receipt snapshot'
              : syncNote
          }
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
      {cancellationOpen ? (
        <CancellationDialog
          receiptNumber={order.receipt.receiptNumber}
          onClose={() => setCancellationOpen(false)}
          onConfirm={(reason) => onCancel(order, reason)}
        />
      ) : null}
    </aside>
  );
}
