import type { CSSProperties, ReactNode } from 'react';
import type { OrderHistoryRecord } from '../../../../data/orderHistory';
import { useLanguage, useT } from '../../../../lib/locale';
import { formatDate, formatTime } from '../../../../lib/date';
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

function formatOrderWhen(completedAt: number, language: 'en' | 'fr') {
  return {
    date: formatDate(completedAt, language, { day: '2-digit', month: '2-digit', year: '2-digit' }),
    time: formatTime(completedAt, language),
  };
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
  emptyAction,
}: {
  orders: OrderHistoryRecord[];
  selectedKey?: string;
  onSelect: (key: string) => void;
  emptyMessage: ReactNode;
  emptyAction?: { label: string; onClick: () => void };
}) {
  const t = useT();
  const language = useLanguage();
  const selectedIndex = orders.findIndex((order) => order.key === selectedKey);

  return (
    <div className={styles.table} aria-label={t('Orders')}>
      <div className={styles.head}>
        {columns.map((column) => (
          <span key={column}>{t(column)}</span>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty} role="status">
          <span>{emptyMessage}</span>
          {emptyAction ? (
            <button type="button" className={styles.emptyAction} onClick={emptyAction.onClick}>
              {emptyAction.label}
            </button>
          ) : null}
        </div>
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
        const when = formatOrderWhen(order.receipt.completedAt, language);
        return (
        <button
          type="button"
          className={styles.row}
          aria-current={order.key === selectedKey ? 'true' : undefined}
          data-orders-selected-row={order.key === selectedKey ? 'true' : undefined}
          onClick={() => onSelect(order.key)}
          key={order.key}
        >
          <strong className={styles.order} title={order.receipt.receiptNumber}>
            {compactReceiptNumber(order.receipt.receiptNumber)}
          </strong>
          <span className={styles.service}>{t(serviceLabel(order))}</span>
          <strong className={styles.num}>{itemCount}</strong>
          <strong className={styles.total}>
            {formatMoney(order.receipt.totalCentimes)}
          </strong>
          <span className={styles.when}>
            <strong>{when.date}</strong>
            <span>{when.time}</span>
          </span>
          <span className={styles.statusCol}>
            <span className={`${styles.status} ${styles[status.tone]}`}>
              <span />
              <strong>{t(status.label)}</strong>
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
