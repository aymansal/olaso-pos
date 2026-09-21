import { ChevronRight, Receipt } from '@boxicons/react';
import type { DashboardSnapshot } from '../../../../data/useDashboardData';
import { formatMoney } from '../../../../lib/money';
import { useT } from '../../../../lib/locale';
import { useLanguage } from '../../../../lib/locale';
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
  const t = useT();
  const language = useLanguage();
  return (
    <section className={styles.panel} aria-labelledby="recent-orders-title" aria-busy={isLoading}>
      <header className={styles.header}>
        <span>
          <h2 id="recent-orders-title">{t('Recent orders')}</h2>
          <small>{t('Latest activity from the counter')}</small>
        </span>
        <button type="button" className={styles.viewAll} onClick={onViewAll} aria-label={`${t('View all')}: ${t('Orders')}`}>
          <span>{t('View all')}</span>
          <ChevronRight width={16} height={16} aria-hidden="true" />
        </button>
      </header>

      <div className={styles.list}>
        <div role="status">
        {error || isLoading || orders.length === 0 ? (
          <p className={styles.state}>
            {error
              ? t('Recent orders are unavailable. Select Retry summary.')
              : isLoading
                ? t('Loading recent orders…')
                : t('No saved orders yet.')}
          </p>
        ) : null}
        </div>
        {!error && !isLoading && orders.map((order, index) => (
          <article className={styles.row} key={order.id}>
            <span className={`${styles.icon} ${index === 0 ? styles.iconActive : ''}`}>
              <Receipt width={17} height={17} aria-hidden="true" />
            </span>
            <strong className={styles.number}>
              {order.receiptNumber.replace(/^[A-Z]+-/, '#')}
            </strong>
            <small className={styles.meta}>
              <time dateTime={new Date(order.completedAt).toISOString()}
                title={new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-GB', {
                  dateStyle: 'medium', timeStyle: 'short',
                }).format(new Date(order.completedAt))}>
                {new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-GB', {
                  hour: '2-digit', minute: '2-digit',
                }).format(new Date(order.completedAt))}
              </time>
              {' · '}{t(serviceLabel(order.serviceMode))}
            </small>
            <strong className={styles.amount}>
              {formatMoney(order.totalCentimes)}
            </strong>
            {order.status !== 'completed' ? (
              <small className={styles.statusAttention}>{t('Cancelled')}</small>
            ) : null}
            {index < orders.length - 1 ? <span className={styles.divider} /> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
