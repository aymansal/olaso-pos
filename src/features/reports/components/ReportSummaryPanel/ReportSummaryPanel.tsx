import { formatMoney } from '../../../../lib/money';
import { formatStockQuantity } from '../../../../lib/stock';
import type { useCostManagement } from '../../../../data/useCostManagement';
import type { ReportsSnapshot } from '../../../../data/useReportsData';
import { useT } from '../../../../lib/locale';
import { buildPeriodProfit } from '../../reportProfit';
import type { ReportTab } from '../../reportTypes';
import styles from './ReportSummaryPanel.module.css';

export function ReportSummaryPanel({
  tab,
  snapshot,
  fromDate,
  toDate,
  isRefreshing,
  costManagement,
  showCompensation,
}: {
  tab: ReportTab;
  snapshot?: ReportsSnapshot;
  fromDate: string;
  toDate: string;
  isRefreshing: boolean;
  costManagement: ReturnType<typeof useCostManagement>;
  showCompensation: boolean;
}) {
  const t = useT();
  const stale = isRefreshing ? 'true' : 'false';
  const current = snapshot?.current;
  const previous = snapshot?.previous;
  const profit = buildPeriodProfit(
    snapshot,
    costManagement.saved,
    snapshot?.range.from ?? fromDate,
    snapshot?.range.to ?? toDate,
    showCompensation,
    Boolean(costManagement.saved) && !costManagement.error && !costManagement.isLoading,
  );
  const difference = fromDate || toDate ? previous?.netCentimes
    ? ((current?.netCentimes ?? 0) - previous.netCentimes) / previous.netCentimes * 100
    : undefined : undefined;
  const average = current?.orderCount
    ? Math.round(current.netCentimes / current.orderCount)
    : 0;
  const categories = current?.categoryTotals.slice(0, 4) ?? [];
  const products = current?.productTotals.slice(0, 6) ?? [];
  const ingredients = current?.ingredientTotals ?? [];
  const costValue = (value: number) => profit.costsAvailable
    ? formatMoney(value)
    : t(costManagement.error ? 'Unavailable' : 'Loading…');
  const profiles = current?.profileTotals ?? [];

  if (tab === 'products') {
    return (
      <>
        <aside className={`${styles.railCard} ${styles.railTop}`} aria-labelledby="report-category-title">
          <header className={styles.railHeader}>
            <span>
              <h2 id="report-category-title">{t('By category')}</h2>
              <small>{t('Share of period sales')}</small>
            </span>
            <strong className={styles.railChip}>{categories.length}</strong>
          </header>
          <div className={`${styles.railList} ${styles.data}`} data-stale={stale}>
            {categories.length === 0 ? (
              <p className={styles.railEmpty}>{t('No category sales.')}</p>
            ) : categories.map((category, index) => {
              const share = current?.netCentimes
                ? category.totalCentimes / current.netCentimes * 100
                : 0;
              return (
                <article className={styles.railRow} key={category.categoryId}>
                  <span className={styles.railRank} aria-hidden="true">{index + 1}</span>
                  <span className={styles.railCopy}>
                    <strong>{category.categoryName}</strong>
                    <small>{formatMoney(category.totalCentimes)}</small>
                  </span>
                  <b>{share.toFixed(0)}%</b>
                  {index < categories.length - 1 ? <span className={styles.railDivider} /> : null}
                </article>
              );
            })}
          </div>
        </aside>
        <aside className={`${styles.railCard} ${styles.railBottom}`} aria-label={t('Products')}>
          <header className={styles.railHeader}>
            <span>
              <h2>{t('Products')}</h2>
              <small>{t('Units and share of sales')}</small>
            </span>
            <strong className={styles.railChip}>{products.length}</strong>
          </header>
          <div className={`${styles.railList} ${styles.data}`} data-stale={stale}>
            {products.length === 0 ? (
              <p className={styles.railEmpty}>{t('No product sales.')}</p>
            ) : products.map((product, index) => {
              const share = current?.netCentimes
                ? product.totalCentimes / current.netCentimes * 100
                : 0;
              return (
                <article className={styles.railRow} key={product.productId}>
                  <span className={styles.railRank} aria-hidden="true">{index + 1}</span>
                  <span className={styles.railCopy}>
                    <strong>{product.productName}</strong>
                    <small>
                      {product.quantity}
                      {' · '}
                      {formatMoney(product.totalCentimes)}
                    </small>
                  </span>
                  <b>{share.toFixed(0)}%</b>
                  {index < products.length - 1 ? <span className={styles.railDivider} /> : null}
                </article>
              );
            })}
          </div>
        </aside>
      </>
    );
  }

  if (tab === 'stock') {
    return (
      <aside className={styles.panel} aria-labelledby="report-summary-title">
        <header className={styles.header}>
          <h2 id="report-summary-title">{t('Used ingredients')}</h2>
        </header>
        {ingredients.length === 0 ? (
          <p className={`${styles.empty} ${styles.data}`} data-stale={stale}>{t('No recipe usage.')}</p>
        ) : (
        <div className={`${styles.stack} ${styles.full} ${styles.data}`} data-stale={stale}>
          {ingredients.map((ingredient) => {
            const onHand = ingredient.currentStockQuantity ?? 0;
            const used = ingredient.quantity;
            const share = used / Math.max(used + onHand, 1);
            return (
            <article className={styles.used} key={ingredient.ingredientId}>
              <span>
                <strong>{ingredient.ingredientName}</strong>
                <i className={styles.track}>
                  <i
                    className={styles.primary}
                    style={{ width: `${share * 100}%` }}
                  />
                </i>
              </span>
              <b>
                {formatStockQuantity(ingredient.quantity, ingredient.baseUnit)}
              </b>
            </article>
            );
          })}
        </div>
        )}
      </aside>
    );
  }

  if (tab === 'costs') {
    return (
      <aside className={styles.panel} aria-labelledby="report-summary-title">
        <header className={styles.header}>
          <h2 id="report-summary-title">{t('This period')}</h2>
        </header>
        <p className={`${styles.hint} ${styles.data}`} data-stale={stale}>
          {t('Wages and monthly bills are split across the days in each month. One-time costs count on the day they were recorded.')}
        </p>
        <div className={`${styles.profitList} ${styles.costsFacts} ${styles.data}`} data-stale={stale}>
          <article>
            <small>{t('Ingredient cost')}</small>
            <strong>{formatMoney(profit.ingredientCostCentimes)}</strong>
          </article>
          {showCompensation ? (
            <article>
              <small>{t('Wages')}</small>
              <strong>{costValue(profit.compensationCentimes)}</strong>
            </article>
          ) : null}
          <article>
            <small>{t('Other expenses')}</small>
            <strong>{costValue(profit.otherExpenseCentimes)}</strong>
          </article>
        </div>
      </aside>
    );
  }

  const rows = [
    ['Sales', profit.revenueCentimes],
    ['Ingredient cost', -profit.ingredientCostCentimes],
    ['Gross profit', profit.grossProfitCentimes],
    ...(showCompensation
      ? [['Wages', -profit.compensationCentimes] as const]
      : []),
    ['Expenses', -profit.otherExpenseCentimes],
  ] as const;

  return (
    <aside className={styles.panel} aria-labelledby="report-summary-title">
      <header className={styles.header}>
        <h2 id="report-summary-title">{t('Profit')}</h2>
        {fromDate || toDate ? (
          <strong className={`${styles.chip} ${difference !== undefined && difference < 0 ? styles.down : ''}`}>
            {difference === undefined
              ? t('No prior period')
              : `${difference >= 0 ? '+' : '−'}${Math.abs(difference).toFixed(1)}%`}
          </strong>
        ) : null}
      </header>
      <div className={`${styles.facts} ${styles.data}`} data-stale={stale}>
        <article>
          <small>{t('Stock value')}</small>
          <strong>{costValue(costManagement.saved?.inventoryValueCentimes ?? 0)}</strong>
        </article>
        <article>
          <small>{t('Orders')}</small>
          <strong>{current?.orderCount ?? 0}</strong>
        </article>
        <article>
          <small>{t('Average')}</small>
          <strong>{formatMoney(average)}</strong>
        </article>
      </div>
      <div className={`${styles.profitList} ${styles.data}`} data-stale={stale}>
        {rows.map(([label, value]) => (
          <article key={label}>
            <small>{t(label)}</small>
            <strong className={label === 'Gross profit' ? styles.emphasis : ''}>
              {label === 'Wages' || label === 'Expenses' ? costValue(value) : formatMoney(value)}
            </strong>
          </article>
        ))}
      </div>
      <section className={`${styles.profilePerformance} ${styles.data}`} data-stale={stale} aria-labelledby="profile-performance-title">
        <h3 id="profile-performance-title">{t('Profile performance')}</h3>
        <div className={styles.profileList}>
          {profiles.length === 0 ? (
            <p>{t('No profile sales.')}</p>
          ) : profiles.map((profile) => (
            <article key={profile.staffProfileId ?? 'unattributed'}>
              <span>
                <strong>{profile.staffProfileId ? profile.profileName : t('Unattributed')}</strong>
                <small>{t('{orders} orders · {items} items', {
                  orders: profile.orderCount,
                  items: profile.itemCount,
                })}</small>
              </span>
              <b>{formatMoney(profile.netCentimes)}</b>
            </article>
          ))}
        </div>
      </section>
      <div className={`${styles.result} ${styles.data}`} data-stale={stale}>
        <small>{t(showCompensation ? 'Operating profit' : 'Gross profit')}</small>
        <strong className={
          (showCompensation ? profit.operatingProfitCentimes : profit.grossProfitCentimes) < 0
            ? styles.loss
            : ''
        }>
          {showCompensation
            ? costValue(profit.operatingProfitCentimes)
            : formatMoney(profit.grossProfitCentimes)}
        </strong>
        {showCompensation && !profit.ingredientCostsComplete ? (
          <small>{t('Some sales are missing ingredient cost.')}</small>
        ) : null}
      </div>
    </aside>
  );
}
