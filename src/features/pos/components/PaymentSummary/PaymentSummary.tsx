import { formatMoney } from '../../../../lib/money';
import styles from './PaymentSummary.module.css';

type PaymentSummaryProps = {
  subtotalCentimes: number;
  offertCentimes: number;
  totalCentimes: number;
};

export function PaymentSummary({
  subtotalCentimes,
  offertCentimes,
  totalCentimes,
}: PaymentSummaryProps) {
  return (
    <section className={styles.summary} aria-labelledby="payment-details">
      <h2 id="payment-details">Payment Details</h2>
      <dl>
        {offertCentimes > 0 ? (
          <>
            <div><dt>Subtotal</dt><dd>{formatMoney(subtotalCentimes)}</dd></div>
            <div><dt>Offert</dt><dd>-{formatMoney(offertCentimes)}</dd></div>
          </>
        ) : null}
        <div className={styles.total}><dt>Total</dt><dd>{formatMoney(totalCentimes)}</dd></div>
      </dl>
    </section>
  );
}
