import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Search, Receipt, X } from '@boxicons/react';
import { useState, type CSSProperties } from 'react';
import {
  PeriodCalendar,
  type PeriodPreset,
} from '../../../../components/PeriodCalendar/PeriodCalendar';
import {
  ORDER_PAGE_SIZE,
  type OrderHistoryRecord,
} from '../../../../data/orderHistory';
import { formatCompactPeriodLabel, formatTime } from '../../../../lib/date';
import { useLanguage, useT } from '../../../../lib/locale';
import { OrdersTable } from '../OrdersTable/OrdersTable';
import { visiblePageIndexes } from '../../../../lib/pagination';
import styles from './OrdersListPanel.module.css';

const filters = ['All', 'Completed', 'Cancelled'] as const;

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
  fromDate,
  toDate,
  preset,
  onQueryChange,
  onStatusChange,
  onRangeChange,
  onClearFilters,
  onRetry,
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
  fromDate: string;
  toDate: string;
  preset?: PeriodPreset;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: (typeof filters)[number]) => void;
  onRangeChange: (range: {
    fromDate: string;
    toDate: string;
    preset?: PeriodPreset;
  }) => void;
  onClearFilters: () => void;
  onRetry: () => void;
  onPageChange: (page: number) => void;
}) {
  const t = useT();
  const language = useLanguage();
  const [dateAnchor, setDateAnchor] = useState<DOMRect>();
  const start = orders.length === 0 ? 0 : page * ORDER_PAGE_SIZE + 1;
  const end = page * ORDER_PAGE_SIZE + orders.length;
  const hasFilters = query !== '' || status !== 'All' || fromDate !== '' || toDate !== '';
  const canRetry = message.includes('unavailable');

  return (
    <section className={styles.panel} aria-labelledby="orders-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="orders-title">{t('Orders')}</h1>
          <small>{t('Track every sale from counter to completion')}</small>
        </span>
        <span className={styles.today}>
          <Receipt width={14} height={14} aria-hidden="true" />
          <strong>
            {lastSuccessAt
              ? t('Last sync {time}', {
                  time: formatTime(lastSuccessAt, language),
                })
              : t('{count} orders', { count: totalCount })}
          </strong>
        </span>
      </header>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search width={16} height={16} aria-hidden="true" />
          <input
            type="search"
            aria-label={t('Search orders')}
            placeholder={t('Search order')}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          {query !== '' ? (
            <button
              type="button"
              className={styles.clear}
              aria-label={t('Clear search')}
              onClick={() => onQueryChange('')}
            >
              <X width={14} height={14} aria-hidden="true" />
            </button>
          ) : null}
        </label>

        <div
          className={styles.filters}
          style={{ '--count': filters.length, '--index': filters.indexOf(status) } as CSSProperties}
          role="group"
          aria-label={t('Order status')}
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
              {t(filter)}
            </button>
          ))}
        </div>

        <div className={styles.dateWrap}>
          <button
            type="button"
            className={styles.date}
            aria-expanded={Boolean(dateAnchor)}
            onClick={(event) => {
              if (dateAnchor) {
                setDateAnchor(undefined);
                return;
              }
              setDateAnchor(event.currentTarget.getBoundingClientRect());
            }}
          >
            <Calendar width={15} height={15} aria-hidden="true" />
            <span>{formatCompactPeriodLabel(fromDate, toDate, language)}</span>
            <ChevronDown width={13} height={13} aria-hidden="true" />
          </button>
          {dateAnchor ? (
            <PeriodCalendar
              mode="range"
              fromDate={fromDate}
              toDate={toDate}
              presets={[
                'today',
                'yesterday',
                'thisWeek',
                'lastWeek',
                'thisMonth',
                'lastMonth',
                'all',
              ]}
              allowEmpty
              activePreset={preset}
              anchor={dateAnchor}
              onChange={(next, nextPreset) => {
                onRangeChange({ ...next, preset: nextPreset });
              }}
              onClose={() => setDateAnchor(undefined)}
            />
          ) : null}
        </div>
      </div>

      <OrdersTable
        orders={orders}
        selectedKey={selectedKey}
        onSelect={onSelect}
        emptyMessage={isLoading ? t('Loading order history…') : t('No matching orders.')}
        emptyAction={isLoading || !hasFilters ? undefined : {
          label: t('Clear filters'),
          onClick: onClearFilters,
        }}
      />

      <footer className={styles.footer}>
        <span role={message ? 'alert' : undefined}>
          {message ? (
            <>
              <span>{t(message)}</span>
              {canRetry ? (
                <button type="button" className={styles.retry} onClick={onRetry}>
                  {t('Retry')}
                </button>
              ) : null}
            </>
          ) : t('Showing {from} to {to} of {total} orders', {
            from: start,
            to: end,
            total: totalCount,
          })}
        </span>
        <nav className={styles.pagination} aria-label={t('Orders pagination')}>
          <button
            type="button"
            aria-label={t('Previous page')}
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
              aria-label={t('Page {n}', { n: index + 1 })}
              onClick={() => onPageChange(index)}
              key={index}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label={t('Next page')}
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
