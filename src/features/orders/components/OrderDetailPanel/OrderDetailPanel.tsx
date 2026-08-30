import { Clock, DotsHorizontalRounded, InfoCircle, Package, Printer, Receipt, RotateCcw, Store } from '@boxicons/react';
import { useState } from 'react';
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
  if (order.status === 'cancelled' || order.status === 'refunded') {
    return 'Cancelled';
  }
  return 'Completed';
}

export function OrderDetailPanel({
  order,
  reprinting,
  cancelling,
  onReprint,
  onCancel,
}: {
  order?: OrderHistoryRecord;
  reprinting: boolean;
  cancelling: boolean;
  onReprint: (order: OrderHistoryRecord) => Promise<void>;
  onCancel: (order: OrderHistoryRecord, reason: string) => Promise<void>;
}) {
  const [cancellationOpen, setCancellationOpen] = useState(false);

  if (!order) {
    return (
      <aside className={`${styles.panel} ${styles.empty}`} aria-live="polite">
        <Receipt width={28} height={28} aria-hidden="true" />
        <strong>No order selected</strong>
        <span>Choose a saved order to inspect its receipt snapshot.</span>
      </aside>
    );
  }

  const itemCount = order.receipt.lines.reduce(
    (total, line) => total + line.quantity,
    0,
  );
  const createdAt = new Date(order.receipt.completedAt).toLocaleTimeString(
    'en-GB',
    { hour: '2-digit', minute: '2-digit' },
  );
  const canReprint = order.status === 'completed' && Boolean(order.printState);
  const canCancel = order.status === 'completed' && Boolean(order.printState);
  const statusTone = order.syncState !== 'synced' || order.status !== 'completed'
    ? styles.statusAttention
    : styles.statusComplete;
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
            {canCancel ? <RotateCcw width={16} height={16} aria-hidden="true" /> : <DotsHorizontalRounded width={16} height={16} aria-hidden="true" />}
          </button>
        </span>
      </header>

      <div className={styles.metadata}>
        <span className={styles.metaItem}>
          <Store width={16} height={16} aria-hidden="true" />
          <small>Service</small>
          <strong>{serviceLabel(order)}</strong>
        </span>
        <span className={styles.metaItem}>
          <Clock width={16} height={16} aria-hidden="true" />
          <small>Created</small>
          <strong>{createdAt}</strong>
        </span>
      </div>

      <div className={styles.itemsHeader}>
        <strong>Order items</strong>
        <small>{itemCount} {itemCount === 1 ? 'item' : 'items'}</small>
      </div>

      <div className={styles.items}>
        {order.receipt.lines.map((item, index) => {
          const options = [
            item.complimentary ? 'Offert' : '',
            item.sizeName,
            ...item.modifiers.map((modifier) => modifier.optionName),
          ].filter(Boolean).join(', ');
          return (
            <article className={styles.item} key={`${item.productName}-${index}`}>
              <span className={`${styles.itemIcon} ${index === 0 ? styles.itemIconActive : ''}`}>
                <Package width={17} height={17} aria-hidden="true" />
              </span>
              <span className={styles.itemCopy}>
                <strong>{item.productName}</strong>
                <small>
                  {options ? `${options} · ` : ''}
                  {formatMoney(item.unitPriceCentimes)} × {item.quantity}
                </small>
              </span>
              <strong className={styles.itemTotal}>
                {formatMoney(item.complimentary ? 0 : item.lineTotalCentimes)}
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
        {order.receipt.discountCentimes > 0 ? (
          <div>
            <dt>Offert</dt>
            <dd>-{formatMoney(order.receipt.discountCentimes)}</dd>
          </div>
        ) : null}
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
          <Printer width={17} height={17} aria-hidden="true" />
          <span>{reprinting ? 'Printing…' : 'Reprint'}</span>
        </button>
        <button type="button" className={styles.cancelOrder} disabled={!canCancel || cancelling} onClick={() => setCancellationOpen(true)}>
          <RotateCcw width={17} height={17} aria-hidden="true" />
          <span>{cancelling ? 'Cancelling…' : 'Cancel'}</span>
        </button>
      </div>

      <div className={styles.stockNote} title={order.printError ?? printNote}>
        <InfoCircle width={13} height={13} aria-hidden="true" />
        <span>{printNote} · {syncStateNote}</span>
      </div>
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
