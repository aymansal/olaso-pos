import {
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Receipt,
} from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import type {
  OrderHistoryRecord,
  OrderStatus,
} from '../../../../data/orderHistory';
import { OrdersTable } from '../OrdersTable/OrdersTable';
import styles from './OrdersListPanel.module.css';

const filters = ['All', 'Completed', 'Cancelled', 'Refunded'] as const;
const PAGE_SIZE = 6;

export function OrdersListPanel({
  orders,
  selectedKey,
  onSelect,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  message,
  lastSuccessAt,
}: {
  orders: OrderHistoryRecord[];
  selectedKey?: string;
  onSelect: (key: string) => void;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => Promise<void>;
  message: string;
  lastSuccessAt?: number;
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof filters)[number]>('All');
  const [businessDate, setBusinessDate] = useState('');
  const [dateOpen, setDateOpen] = useState(false);
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return orders.filter((order) => {
      const matchesQuery =
        !normalized
        || order.receipt.receiptNumber.toLocaleLowerCase().includes(normalized)
        || order.receipt.customerName
          ?.toLocaleLowerCase()
          .includes(normalized);
      const matchesStatus =
        status === 'All'
        || order.status === (status.toLocaleLowerCase() as OrderStatus);
      const matchesDate = !businessDate || order.businessDate === businessDate;
      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [businessDate, orders, query, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const start = visible.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const end = page * PAGE_SIZE + visible.length;

  useEffect(() => {
    setPage(0);
  }, [businessDate, query, status]);

  useEffect(() => {
    if (page >= pageCount) setPage(pageCount - 1);
  }, [page, pageCount]);

  async function nextPage() {
    if (page + 1 < pageCount) {
      setPage((current) => current + 1);
      return;
    }
    if (hasMore) await onLoadMore();
  }

  return (
    <section className={styles.panel} aria-labelledby="orders-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="orders-title">Orders</h1>
          <small>Track every sale from counter to completion</small>
        </span>
        <span className={styles.today}>
          <Receipt size={14} weight="regular" aria-hidden="true" />
          <strong>
            {lastSuccessAt
              ? `Last sync ${new Date(lastSuccessAt).toLocaleTimeString(
                  'en-GB',
                  { hour: '2-digit', minute: '2-digit' },
                )}`
              : `${orders.length} loaded`}
          </strong>
        </span>
      </header>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <MagnifyingGlass size={16} weight="regular" aria-hidden="true" />
          <input
            aria-label="Search orders"
            placeholder="Search order or customer"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className={styles.filters} aria-label="Order status">
          {filters.map((filter) => (
            <button
              type="button"
              className={filter === status ? styles.filterActive : styles.filter}
              aria-pressed={filter === status}
              onClick={() => setStatus(filter)}
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
            <CalendarBlank size={15} weight="regular" aria-hidden="true" />
            <span>{businessDate || 'All dates'}</span>
            <CaretDown size={13} weight="regular" aria-hidden="true" />
          </button>
          {dateOpen ? (
            <div className={styles.dateMenu} aria-label="Order date">
              <span>
                <button
                  type="button"
                  onClick={() => {
                    setBusinessDate('');
                    setDateOpen(false);
                  }}
                >
                  All dates
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBusinessDate(new Date().toISOString().slice(0, 10));
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
                  setBusinessDate(event.target.value);
                  setDateOpen(false);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <OrdersTable
        orders={visible}
        selectedKey={selectedKey}
        onSelect={onSelect}
        emptyMessage={isLoading ? 'Loading order history…' : 'No matching orders.'}
      />

      <footer className={styles.footer}>
        <span role={message ? 'alert' : undefined}>
          {message || `Showing ${start} to ${end} of ${filtered.length} loaded orders`}
        </span>
        <nav className={styles.pagination} aria-label="Orders pagination">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
          >
            <CaretLeft size={14} weight="regular" aria-hidden="true" />
          </button>
          <button type="button" className={styles.current} aria-current="page">
            {page + 1}
          </button>
          <button
            type="button"
            aria-label={
              page + 1 < pageCount ? 'Next page' : 'Load more orders'
            }
            disabled={
              isLoadingMore || (page + 1 >= pageCount && !hasMore)
            }
            onClick={() => void nextPage()}
          >
            <CaretRight size={14} weight="regular" aria-hidden="true" />
          </button>
        </nav>
      </footer>
    </section>
  );
}
