import {
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Receipt,
} from '@phosphor-icons/react';
import { OrdersTable } from '../OrdersTable/OrdersTable';
import styles from './OrdersListPanel.module.css';

const filters = ['All', 'Preparing', 'Ready', 'Completed'] as const;

export function OrdersListPanel() {
  return (
    <section className={styles.panel} aria-labelledby="orders-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="orders-title">Orders</h1>
          <small>Track every sale from counter to completion</small>
        </span>
        <span className={styles.today}>
          <Receipt size={14} weight="regular" aria-hidden="true" />
          <strong>126 today</strong>
        </span>
      </header>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <MagnifyingGlass size={16} weight="regular" aria-hidden="true" />
          <input aria-label="Search orders" placeholder="Search order or customer" />
        </label>

        <div className={styles.filters} aria-label="Order status">
          {filters.map((filter) => (
            <button
              type="button"
              className={filter === 'All' ? styles.filterActive : styles.filter}
              key={filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <button type="button" className={styles.date}>
          <CalendarBlank size={15} weight="regular" aria-hidden="true" />
          <span>Today, 24 Jul</span>
          <CaretDown size={13} weight="regular" aria-hidden="true" />
        </button>
      </div>

      <OrdersTable />

      <footer className={styles.footer}>
        <span>Showing 1 to 6 of 126 orders</span>
        <nav className={styles.pagination} aria-label="Orders pagination">
          <button type="button" aria-label="Previous page">
            <CaretLeft size={14} weight="regular" aria-hidden="true" />
          </button>
          <button type="button" className={styles.current} aria-current="page">1</button>
          <button type="button" aria-label="Next page">
            <CaretRight size={14} weight="regular" aria-hidden="true" />
          </button>
        </nav>
      </footer>
    </section>
  );
}
