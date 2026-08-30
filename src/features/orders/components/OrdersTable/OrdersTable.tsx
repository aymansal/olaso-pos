import type { CSSProperties } from 'react';
import type { OrderHistoryRecord } from '../../../../data/orderHistory';
import { formatMoney } from '../../../../lib/money';
import styles from './OrdersTable.module.css';

const columns = [
  'ORDER',
  'SERVICE',
  'ITEMS',
  'TOTAL',
  'DATE',
  'STATUS',
] as const;

function compactReceiptNumber(receiptNumber: string) {
  return receiptNumber.replace(/^[A-Z]+-/, '#');
}

function formatOrderWhen(completedAt: number) {
  const date = new Date(completedAt);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return { date: `${dd}/${mm}/${yy}`, time };
}

function serviceLabel(order: OrderHistoryRecord) {
  if (order.receipt.serviceType === 'dine-in') return 'Dine in';
  if (order.receipt.serviceType === 'take-away') return 'Take away';
  return 'Order online';
}

function statusPresentation(
  order: OrderHistoryRecord,
): { label: string; tone: 'failed' | 'preparing' | 'completed' } {
  if (order.syncState === 'failed') {
    return { label: 'Needs sync', tone: 'failed' };
  }
  if (order.syncState === 'pending') {
    return { label: 'Waiting to sync', tone: 'preparing' };
  }
  if (order.status === 'cancelled' || order.status === 'refunded') {
    return { label: 'Cancelled', tone: 'failed' };
  }
  return { label: 'Completed · Synced', tone: 'completed' };
}

export function OrdersTable({
  orders,
  selectedKey,
  onSelect,
  emptyMessage,
}: {
  orders: OrderHistoryRecord[];
  selectedKey?: string;
  onSelect: (key: string) => void;
  emptyMessage: string;
}) {
  const selectedIndex = orders.findIndex((order) => order.key === selectedKey);

  return (
    <div className={styles.table} role="table" aria-label="Orders">
      <div className={styles.head} role="row">
        {columns.map((column) => (
          <span role="columnheader" key={column}>{column}</span>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className={styles.empty} role="status">{emptyMessage}</p>
      ) : (
      <div
        className={styles.body}
        style={{ '--index': Math.max(0, selectedIndex) } as CSSProperties}
      >
        {selectedIndex >= 0 ? (
          <span className={styles.indicator} aria-hidden="true" />
        ) : null}
        {orders.map((order) => {
        const status = statusPresentation(order);
        const itemCount = order.receipt.lines.reduce(
          (total, line) => total + line.quantity,
          0,
        );
        const when = formatOrderWhen(order.receipt.completedAt);
        return (
        <button
          type="button"
          className={styles.row}
          role="row"
          aria-selected={order.key === selectedKey}
          onClick={() => onSelect(order.key)}
          key={order.key}
        >
          <strong className={styles.order} role="cell" title={order.receipt.receiptNumber}>
            {compactReceiptNumber(order.receipt.receiptNumber)}
          </strong>
          <span className={styles.service} role="cell">{serviceLabel(order)}</span>
          <strong className={styles.num} role="cell">{itemCount}</strong>
          <strong className={styles.total} role="cell">
            {formatMoney(order.receipt.totalCentimes)}
          </strong>
          <span className={styles.when} role="cell">
            <strong>{when.date}</strong>
            <span>{when.time}</span>
          </span>
          <span className={styles.statusCol} role="cell">
            <span className={`${styles.status} ${styles[status.tone]}`}>
              <span />
              <strong>{status.label}</strong>
            </span>
          </span>
        </button>
        );
        })}
      </div>
      )}
    </div>
  );
}
