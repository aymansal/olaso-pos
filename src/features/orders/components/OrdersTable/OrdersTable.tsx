import { orders } from '../../data/ordersData';
import styles from './OrdersTable.module.css';

const columns = ['ORDER', 'CUSTOMER', 'SERVICE', 'ITEMS', 'TOTAL', 'STATUS'] as const;

export function OrdersTable() {
  return (
    <div className={styles.table} role="table" aria-label="Orders">
      <div className={styles.head} role="row">
        {columns.map((column) => (
          <span role="columnheader" key={column}>{column}</span>
        ))}
      </div>

      {orders.map((order, index) => (
        <div
          className={`${styles.row} ${index === 0 ? styles.selected : ''}`}
          role="row"
          aria-selected={index === 0}
          key={order.number}
        >
          <span className={styles.identityCell} role="cell">
            {index === 0 ? <span className={styles.selectedMark} /> : null}
            <span className={styles.identity}>
              <strong>{order.number}</strong>
              <small>{order.time}</small>
            </span>
          </span>
          <strong role="cell">{order.customer}</strong>
          <span className={styles.service} role="cell">{order.service}</span>
          <strong role="cell">{order.items}</strong>
          <strong className={styles.total} role="cell">{order.total}</strong>
          <span role="cell">
            <span className={`${styles.status} ${styles[order.tone]}`}>
              <span />
              <strong>{order.status}</strong>
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
