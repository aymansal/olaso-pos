import { ArrowRight, Receipt } from '@phosphor-icons/react';
import { recentOrders } from '../../data/dashboardData';
import styles from './RecentOrdersPanel.module.css';

export function RecentOrdersPanel() {
  return (
    <section className={styles.panel} aria-labelledby="recent-orders-title">
      <header className={styles.header}>
        <span>
          <h2 id="recent-orders-title">Recent orders</h2>
          <small>Latest activity from the counter</small>
        </span>
        <button type="button" className={styles.viewAll}>
          <span>View all</span>
          <ArrowRight size={13} weight="regular" aria-hidden="true" />
        </button>
      </header>

      <div className={styles.list}>
        {recentOrders.map((order, index) => (
          <article className={styles.row} key={order.number}>
            <span className={`${styles.icon} ${index === 0 ? styles.iconActive : ''}`}>
              <Receipt size={17} weight="regular" aria-hidden="true" />
            </span>
            <strong className={styles.number}>{order.number}</strong>
            <small className={styles.meta}>{order.meta}</small>
            <strong className={styles.amount}>{order.amount}</strong>
            <span className={styles.status}>
              <span />
              <small>Paid · {order.time}</small>
            </span>
            {index < recentOrders.length - 1 ? <span className={styles.divider} /> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
