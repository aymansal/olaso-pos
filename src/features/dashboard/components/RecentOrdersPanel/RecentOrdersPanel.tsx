import { ArrowRight, Receipt } from '@boxicons/react';
import type { DashboardSnapshot } from '../../../../data/useDashboardData';
import { formatMoney } from '../../../../lib/money';
import styles from './RecentOrdersPanel.module.css';

function serviceLabel(service: 'dine-in' | 'take-away' | 'online') {
  if (service === 'dine-in') return 'Dine in';
  if (service === 'take-away') return 'Take away';
  return 'Order online';
}

export function RecentOrdersPanel({
  orders,
  isLoading,
  error,
  onViewAll,
}: {
  orders: DashboardSnapshot['recentOrders'];
  isLoading: boolean;
  error: string;
  onViewAll: () => void;
}) {
  return (
    <section className={styles.panel} aria-labelledby="recent-orders-title">
      <header className={styles.header}>
        <span>
          <h2 id="recent-orders-title">Recent orders</h2>
          <small>Latest activity from the counter</small>
        </span>
        <button type="button" className={styles.viewAll} onClick={onViewAll}>
          <span>View all</span>
          <ArrowRight width={13} height={13} aria-hidden="true" />
        </button>
      </header>

      <div className={styles.list}>
        {error || isLoading || orders.length === 0 ? (
          <p className={styles.state} role={error ? 'alert' : 'status'}>
            {error
              ? 'Recent orders are unavailable.'
              : isLoading
                ? 'Loading recent orders…'
                : 'No saved orders yet.'}
          </p>
        ) : orders.map((order, index) => (
          <article className={styles.row} key={order.id}>
            <span className={`${styles.icon} ${index === 0 ? styles.iconActive : ''}`}>
              <Receipt width={17} height={17} aria-hidden="true" />
            </span>
            <strong className={styles.number}>
              {order.receiptNumber.replace(/^[A-Z]+-/, '#')}
            </strong>
            <small className={styles.meta}>
              {serviceLabel(order.serviceMode)} · {order.itemCount}{' '}
              {order.itemCount === 1 ? 'item' : 'items'}
            </small>
            <strong className={styles.amount}>
              {formatMoney(order.totalCentimes)}
            </strong>
            <span
              className={`${styles.status} ${
                order.status === 'completed' ? '' : styles.statusAttention
              }`}
            >
              <span />
              <small>
                {order.status === 'completed'
                  ? 'Completed'
                  : 'Cancelled'}{' '}
                · {new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(order.completedAt))}
              </small>
            </span>
            {index < orders.length - 1 ? <span className={styles.divider} /> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
