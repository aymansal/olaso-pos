import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Search, Receipt, X } from '@boxicons/react';
import { useState, type CSSProperties } from 'react';
import {
  ORDER_PAGE_SIZE,
  type OrderHistoryRecord,
} from '../../../../data/orderHistory';
import { OrdersTable } from '../OrdersTable/OrdersTable';
import { visiblePageIndexes } from '../../../../lib/pagination';
import styles from './OrdersListPanel.module.css';

const filters = ['All', 'Completed', 'Cancelled', 'Refunded'] as const;

export function OrdersListPanel({
  orders,
  selectedKey,
  onSelect,
  isLoading,
  message,
  lastSuccessAt,
  totalCount,
  page,
  pageCount,
  query,
  status,
  businessDate,
  onQueryChange,
  onStatusChange,
  onBusinessDateChange,
  onPageChange,
}: {
  orders: OrderHistoryRecord[];
  selectedKey?: string;
  onSelect: (key: string) => void;
  isLoading: boolean;
  message: string;
  lastSuccessAt?: number;
  totalCount: number;
  page: number;
  pageCount: number;
  query: string;
  status: (typeof filters)[number];
  businessDate: string;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: (typeof filters)[number]) => void;
  onBusinessDateChange: (businessDate: string) => void;
  onPageChange: (page: number) => void;
}) {
  const [dateOpen, setDateOpen] = useState(false);
  const start = orders.length === 0 ? 0 : page * ORDER_PAGE_SIZE + 1;
  const end = page * ORDER_PAGE_SIZE + orders.length;

  return (
    <section className={styles.panel} aria-labelledby="orders-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="orders-title">Orders</h1>
          <small>Track every sale from counter to completion</small>
        </span>
        <span className={styles.today}>
          <Receipt width={14} height={14} aria-hidden="true" />
          <strong>
            {lastSuccessAt
              ? `Last sync ${new Date(lastSuccessAt).toLocaleTimeString(
                  'en-GB',
                  { hour: '2-digit', minute: '2-digit' },
                )}`
              : `${totalCount} orders`}
          </strong>
        </span>
      </header>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search width={16} height={16} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search orders"
            placeholder="Search order or customer"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          {query !== '' ? (
            <button
              type="button"
              className={styles.clear}
              aria-label="Clear search"
              onClick={() => onQueryChange('')}
            >
              <X width={14} height={14} aria-hidden="true" />
            </button>
          ) : null}
        </label>

        <div
          className={styles.filters}
          style={{ '--count': filters.length, '--index': filters.indexOf(status) } as CSSProperties}
          aria-label="Order status"
        >
          <span className={styles.indicator} aria-hidden="true" />
          {filters.map((filter) => (
            <button
              type="button"
              className={filter === status ? styles.filterActive : styles.filter}
              aria-pressed={filter === status}
              onClick={() => onStatusChange(filter)}
              key={filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className={styles.dateWrap}>
          <button
            type="button"
            className={styles.date}
            aria-expanded={dateOpen}
            onClick={() => setDateOpen((open) => !open)}
          >
            <Calendar width={15} height={15} aria-hidden="true" />
            <span>{businessDate || 'All dates'}</span>
            <ChevronDown width={13} height={13} aria-hidden="true" />
          </button>
          {dateOpen ? (
            <div className={styles.dateMenu} aria-label="Order date">
              <span>
                <button
                  type="button"
                  onClick={() => {
                    onBusinessDateChange('');
                    setDateOpen(false);
                  }}
                >
                  All dates
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onBusinessDateChange(new Date().toISOString().slice(0, 10));
                    setDateOpen(false);
                  }}
                >
                  Today
                </button>
              </span>
              <input
                type="date"
                aria-label="Order date"
                value={businessDate}
                onChange={(event) => {
                  onBusinessDateChange(event.target.value);
                  setDateOpen(false);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <OrdersTable
        orders={orders}
        selectedKey={selectedKey}
        onSelect={onSelect}
        emptyMessage={isLoading ? 'Loading order history…' : 'No matching orders.'}
      />

      <footer className={styles.footer}>
        <span role={message ? 'alert' : undefined}>
          {message || `Showing ${start} to ${end} of ${totalCount} orders`}
        </span>
        <nav className={styles.pagination} aria-label="Orders pagination">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
            key="prev"
          >
            <ChevronLeft width={14} height={14} aria-hidden="true" />
          </button>
          {isLoading
            ? null
            : visiblePageIndexes(page, pageCount).map((index) => (
            <button
              type="button"
              className={index === page ? styles.current : undefined}
              aria-current={index === page ? 'page' : undefined}
              aria-label={`Page ${index + 1}`}
              onClick={() => onPageChange(index)}
              key={index}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={page >= pageCount - 1}
            onClick={() => onPageChange(page + 1)}
            key="next"
          >
            <ChevronRight width={14} height={14} aria-hidden="true" />
          </button>
        </nav>
      </footer>
    </section>
  );
}
