import {
  Calculator,
  CurrencyCircleDollar,
  Receipt,
  ShoppingBag,
} from '@phosphor-icons/react';
import { reportKpis } from '../../data/reportsData';
import styles from './ReportsKpiStrip.module.css';

const kpiIcons = {
  currency: CurrencyCircleDollar,
  receipt: Receipt,
  calculator: Calculator,
  bag: ShoppingBag,
} as const;

export function ReportsKpiStrip() {
  return (
    <section className={styles.strip} aria-label="Report summary metrics">
      {reportKpis.map(({ icon, value, label, change, tone }, index) => {
        const Icon = kpiIcons[icon];

        return (
          <article className={styles.kpi} key={label}>
            {index > 0 ? <span className={styles.divider} aria-hidden="true" /> : null}
            <span className={styles.icon}><Icon size={14} aria-hidden="true" /></span>
            <span className={styles.copy}>
              <strong>{value}</strong>
              <span>
                <small>{label}</small>
                <small className={styles[tone]}>{change}</small>
              </span>
            </span>
          </article>
        );
      })}
    </section>
  );
}
