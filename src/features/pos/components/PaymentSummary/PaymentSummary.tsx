import styles from './PaymentSummary.module.css';

export function PaymentSummary() {
  return (
    <section className={styles.summary} aria-labelledby="payment-details">
      <h2 id="payment-details">Payment Details</h2>
      <dl>
        <div><dt>Subtotal</dt><dd>$59</dd></div>
        <div><dt>Tax</dt><dd>$5.9</dd></div>
        <div className={styles.total}><dt>Total</dt><dd>$64.8</dd></div>
      </dl>
    </section>
  );
}
