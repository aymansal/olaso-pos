import type { OrderHistoryRecord } from '../../../../data/orderHistory';
import { formatMoney } from '../../../../lib/money';
import styles from './OrdersTable.module.css';

const columns = ['ORDER', 'CUSTOMER', 'SERVICE', 'ITEMS', 'TOTAL', 'STATUS'] as const;

function compactReceiptNumber(receiptNumber: string) {
  return receiptNumber.replace(/^[A-Z]+-/, '#');
}

function serviceLabel(order: OrderHistoryRecord) {
  const service = order.receipt.serviceType === 'dine-in'
    ? 'Dine in'
    : order.receipt.serviceType === 'take-away'
      ? 'Take away'
      : 'Order online';
  return order.receipt.tableLabel
    ? `${service} · ${order.receipt.tableLabel}`
    : service;
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
    return {
      label: order.status === 'cancelled' ? 'Cancelled' : 'Refunded',
      tone: 'failed',
    };
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
  return (
    <div className={styles.table} role="table" aria-label="Orders">
      <div className={styles.head} role="row">
        {columns.map((column) => (
          <span role="columnheader" key={column}>{column}</span>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className={styles.empty} role="status">{emptyMessage}</p>
      ) : orders.map((order) => {
        const status = statusPresentation(order);
        const selected = order.key === selectedKey;
        const itemCount = order.receipt.lines.reduce(
          (total, line) => total + line.quantity,
          0,
        );
        return (
        <button
          type="button"
          className={`${styles.row} ${selected ? styles.selected : ''}`}
          role="row"
          aria-selected={selected}
          onClick={() => onSelect(order.key)}
          key={order.key}
        >
          <span className={styles.identityCell} role="cell">
            {selected ? <span className={styles.selectedMark} /> : null}
            <span className={styles.identity}>
              <strong title={order.receipt.receiptNumber}>
                {compactReceiptNumber(order.receipt.receiptNumber)}
              </strong>
              <small>
                {new Date(order.receipt.completedAt).toLocaleTimeString(
                  'en-GB',
                  { hour: '2-digit', minute: '2-digit' },
                )}
              </small>
            </span>
          </span>
          <strong role="cell">{order.receipt.customerName ?? 'Walk-in'}</strong>
          <span className={styles.service} role="cell">{serviceLabel(order)}</span>
          <strong role="cell">{itemCount}</strong>
          <strong className={styles.total} role="cell">
            {formatMoney(order.receipt.totalCentimes)}
          </strong>
          <span role="cell">
            <span className={`${styles.status} ${styles[status.tone]}`}>
              <span />
              <strong>{status.label}</strong>
            </span>
          </span>
        </button>
      )})}
    </div>
  );
}
