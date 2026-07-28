import {
  CheckCircle,
  Clock,
  Coffee,
  DotsThree,
  Info,
  Leaf,
  MapPin,
  Package,
  Printer,
  Storefront,
  User,
} from '@phosphor-icons/react';
import { selectedOrderItems } from '../../data/ordersData';
import styles from './OrderDetailPanel.module.css';

const itemIcons = {
  coffee: Coffee,
  leaf: Leaf,
  package: Package,
};

const metadata = [
  { icon: Storefront, value: 'Dine in', label: 'Service' },
  { icon: MapPin, value: 'B12', label: 'Table' },
  { icon: Clock, value: '10:42', label: 'Created' },
] as const;

export function OrderDetailPanel() {
  return (
    <aside className={styles.panel} aria-labelledby="selected-order-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <small>SELECTED ORDER</small>
          <h2 id="selected-order-title">#27362</h2>
        </span>
        <span className={styles.headerActions}>
          <span className={styles.preparing}>
            <span />
            <strong>Preparing</strong>
          </span>
          <button type="button" aria-label="More order actions">
            <DotsThree size={16} weight="regular" aria-hidden="true" />
          </button>
        </span>
      </header>

      <div className={styles.metadata}>
        {metadata.map(({ icon: Icon, value, label }) => (
          <span className={styles.metaItem} key={label}>
            <Icon size={16} weight="regular" aria-hidden="true" />
            <span>
              <strong>{value}</strong>
              <small>{label}</small>
            </span>
          </span>
        ))}
      </div>

      <div className={styles.customer}>
        <span className={styles.customerIdentity}>
          <span className={styles.customerIcon}>
            <User size={16} weight="regular" aria-hidden="true" />
          </span>
          <span>
            <small>Customer</small>
            <strong>Muadz</strong>
          </span>
        </span>
        <small>No order note</small>
      </div>

      <div className={`${styles.divider} ${styles.customerDivider}`} />

      <div className={styles.itemsHeader}>
        <strong>Order items</strong>
        <small>4 items</small>
      </div>

      <div className={styles.items}>
        {selectedOrderItems.map((item, index) => {
          const Icon = itemIcons[item.icon];

          return (
            <article className={styles.item} key={item.name}>
              <span className={`${styles.itemIcon} ${item.active ? styles.itemIconActive : ''}`}>
                <Icon size={17} weight="regular" aria-hidden="true" />
              </span>
              <span className={styles.itemCopy}>
                <strong>{item.name}</strong>
                <small>{item.quantity}</small>
              </span>
              <strong className={styles.itemTotal}>{item.total}</strong>
              {index < selectedOrderItems.length - 1 ? <span className={styles.itemDivider} /> : null}
            </article>
          );
        })}
      </div>

      <div className={`${styles.divider} ${styles.itemsDivider}`} />

      <div className={styles.paymentHeader}>
        <strong>Payment</strong>
        <span>
          <span />
          <small>Paid in cash</small>
        </span>
      </div>

      <dl className={styles.payment}>
        <div><dt>Subtotal</dt><dd>151 MAD</dd></div>
        <div><dt>Tax</dt><dd>13 MAD</dd></div>
        <div className={styles.total}><dt>Total</dt><dd>164 MAD</dd></div>
      </dl>

      <div className={`${styles.divider} ${styles.actionsDivider}`} />

      <div className={styles.actions}>
        <button type="button" className={styles.print}>
          <Printer size={17} weight="regular" aria-hidden="true" />
          <span>Print receipt</span>
        </button>
        <button type="button" className={styles.ready}>
          <CheckCircle size={18} weight="regular" aria-hidden="true" />
          <span>Mark as ready</span>
        </button>
      </div>

      <div className={styles.stockNote}>
        <Info size={13} weight="regular" aria-hidden="true" />
        <span>Stock deductions were recorded with this sale</span>
      </div>
    </aside>
  );
}
