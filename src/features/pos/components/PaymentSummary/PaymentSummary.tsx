import { formatMoney } from '../../posSession';
import styles from './PaymentSummary.module.css';

type PaymentSummaryProps = {
  subtotalCentimes: number;
  taxCentimes: number;
  totalCentimes: number;
};

export function PaymentSummary({
  subtotalCentimes,
  taxCentimes,
  totalCentimes,
}: PaymentSummaryProps) {
  return (
    <section className={styles.summary} aria-labelledby="payment-details">
      <h2 id="payment-details">Payment Details</h2>
      <dl>
        <div><dt>Subtotal</dt><dd>{formatMoney(subtotalCentimes)}</dd></div>
        <div><dt>Tax (temporary 0%)</dt><dd>{formatMoney(taxCentimes)}</dd></div>
        <div className={styles.total}><dt>Total</dt><dd>{formatMoney(totalCentimes)}</dd></div>
      </dl>
    </section>
  );
}
