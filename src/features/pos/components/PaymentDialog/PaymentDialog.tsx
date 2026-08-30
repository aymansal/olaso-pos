import { X } from '@boxicons/react';
import { useEffect, useState } from 'react';
import { OverlayPortal } from '../../../../components/OverlayPortal';
import { formatMoney } from '../../../../lib/money';
import {
  changeCentimes,
  chargedCentimes,
  moveCartUnit,
  parseDirhamsToCentimes,
  payableCart,
  QUICK_TENDER_CENTIMES,
  type CartLine,
  type PaymentMethod,
  type PaymentTender,
} from '../../posSession';
import styles from './PaymentDialog.module.css';

export type PaymentLineCopy = {
  name: string;
  detail?: string;
  unitPriceCentimes: number;
};

type PricedSize = { id: string; priceCentimes: number };
type PricedChoiceValue = {
  id: string;
  priceDeltaCentimes: number;
  sizeId?: string;
};

type PaymentDialogProps = {
  cart: CartLine[];
  labels: Record<string, PaymentLineCopy>;
  paymentMethod: PaymentMethod;
  sizes: readonly PricedSize[];
  choiceValues: readonly PricedChoiceValue[];
  canSplit: boolean;
  processing: boolean;
  onCancel: () => void;
  onConfirm: (tenders: PaymentTender[]) => Promise<void>;
};

function lineCharged(
  line: CartLine,
  labels: Record<string, PaymentLineCopy>,
) {
  if (line.complimentary === true) return 0;
  return (labels[line.id]?.unitPriceCentimes ?? 0) * line.quantity;
}

function ShareRows({
  lines,
  labels,
  empty,
  disabled,
  onPick,
}: {
  lines: CartLine[];
  labels: Record<string, PaymentLineCopy>;
  empty: string;
  disabled: boolean;
  onPick: (lineId: string) => void;
}) {
  if (lines.length === 0) return <p className={styles.shareEmpty}>{empty}</p>;
  return (
    <>
      {lines.map((line) => (
        <button
          key={line.id}
          type="button"
          className={styles.shareRow}
          disabled={disabled}
          onClick={() => onPick(line.id)}
        >
          <span className={styles.shareCopy}>
            <span className={styles.shareName}>
              {labels[line.id]?.name ?? 'Product'}
            </span>
            {labels[line.id]?.detail ? (
              <small>{labels[line.id]?.detail}</small>
            ) : null}
          </span>
          <span className={styles.shareQty}>{line.quantity}</span>
          <span className={styles.sharePrice}>
            {formatMoney(lineCharged(line, labels))}
          </span>
        </button>
      ))}
    </>
  );
}

export function PaymentDialog({
  cart,
  labels,
  paymentMethod,
  sizes,
  choiceValues,
  canSplit,
  processing,
  onCancel,
  onConfirm,
}: PaymentDialogProps) {
  const [split, setSplit] = useState(false);
  const [splitFade, setSplitFade] = useState<'idle' | 'prepare' | 'run'>('idle');
  const [remaining, setRemaining] = useState(() => payableCart(cart));
  const [pick, setPick] = useState<CartLine[]>([]);
  const [recorded, setRecorded] = useState<PaymentTender[]>([]);
  const [customText, setCustomText] = useState('');
  const [tendered, setTendered] = useState<number | undefined>(
    paymentMethod === 'Card' ? chargedCentimes(cart, sizes, choiceValues) : undefined,
  );

  const locked = recorded.length > 0;
  const cash = paymentMethod === 'Cash';
  const activeCart = split ? pick : cart;
  const due = chargedCentimes(activeCart, sizes, choiceValues);
  const received = cash ? (tendered ?? (due === 0 ? 0 : undefined)) : due;
  const change = received === undefined ? undefined : changeCentimes(due, received);
  const canPay = activeCart.length > 0 && change !== undefined;
  const lastSplit = split && remaining.length === 0;
  const confirmLabel = !split || lastSplit ? 'Place order' : 'Take payment';

  useEffect(() => {
    if (splitFade !== 'prepare') return;
    const frame = requestAnimationFrame(() => setSplitFade('run'));
    return () => cancelAnimationFrame(frame);
  }, [splitFade]);

  function setAmount(centimes: number) {
    setTendered(centimes);
    setCustomText('');
  }

  function resetCashAmount() {
    setTendered(undefined);
    setCustomText('');
  }

  function toggleSplit() {
    if (locked || processing || !canSplit) return;
    if (split) {
      setSplit(false);
      setSplitFade('idle');
      setRemaining(payableCart(cart));
      setPick([]);
      return;
    }
    setSplit(true);
    setRemaining(payableCart(cart));
    setPick([]);
    resetCashAmount();
    setSplitFade('prepare');
  }

  async function takePayment() {
    if (!canPay || received === undefined || change === undefined || processing) {
      return;
    }
    const tender: PaymentTender = {
      dueCentimes: due,
      amountCentimes: received,
      changeCentimes: change,
    };
    if (!split || lastSplit) {
      await onConfirm([...recorded, tender]);
      return;
    }
    setRecorded((current) => [...current, tender]);
    setPick([]);
    resetCashAmount();
  }

  return (
    <OverlayPortal>
      <div className={styles.overlay} role="presentation">
        <section
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-dialog-title"
        >
          <header>
            <span>
              <small>PAYMENT</small>
              <h2 id="payment-dialog-title">{formatMoney(due)}</h2>
            </span>
            {locked || processing ? null : (
              <button type="button" onClick={onCancel} aria-label="Close payment">
                <X width={18} height={18} aria-hidden="true" />
              </button>
            )}
          </header>

          <div className={styles.body}>
            {canSplit ? (
              <button
                type="button"
                className={styles.split}
                aria-pressed={split}
                disabled={locked || processing}
                onClick={toggleSplit}
              >
                Split
              </button>
            ) : null}

            {recorded.length > 0 ? (
              <p className={styles.paid}>
                {recorded.map((tender, index) => (
                  <span key={`${tender.dueCentimes}-${index}`}>
                    {index + 1} · {formatMoney(tender.amountCentimes)}
                  </span>
                ))}
              </p>
            ) : null}

            {split ? (
              <div className={styles.shares} data-fade={splitFade}>
                <div>
                  <p className={styles.shareHead}>
                    Remaining
                    <span>Tap to add</span>
                  </p>
                  <ShareRows
                    lines={remaining}
                    labels={labels}
                    empty="Nothing left."
                    disabled={processing}
                    onPick={(lineId) => {
                      const next = moveCartUnit(remaining, pick, lineId);
                      setRemaining(next.from);
                      setPick(next.to);
                    }}
                  />
                </div>
                <div>
                  <p className={styles.shareHead}>
                    This payment
                    <span>Tap to return</span>
                  </p>
                  <ShareRows
                    lines={pick}
                    labels={labels}
                    empty="Select products."
                    disabled={processing}
                    onPick={(lineId) => {
                      const next = moveCartUnit(pick, remaining, lineId);
                      setPick(next.from);
                      setRemaining(next.to);
                    }}
                  />
                </div>
              </div>
            ) : null}

            {cash ? (
              <>
                <div className={styles.quick} role="group" aria-label="Quick amounts">
                  {QUICK_TENDER_CENTIMES.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      aria-pressed={tendered === amount && customText === ''}
                      disabled={processing}
                      onClick={() => setAmount(amount)}
                    >
                      {amount / 100}
                    </button>
                  ))}
                </div>
                <label className={styles.custom}>
                  <span>Custom</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    disabled={processing}
                    value={customText}
                    placeholder="Amount given"
                    onChange={(event) => {
                      const next = event.target.value;
                      setCustomText(next);
                      setTendered(parseDirhamsToCentimes(next));
                    }}
                  />
                </label>
              </>
            ) : (
              <p className={styles.cardNote}>Card · exact amount</p>
            )}
          </div>

          <dl className={styles.change}>
            <div>
              <dt>Given</dt>
              <dd>{received === undefined ? '—' : formatMoney(received)}</dd>
            </div>
            <div>
              <dt>
                {received !== undefined && received < due ? 'Need' : 'Change'}
              </dt>
              <dd>
                {received === undefined
                  ? '—'
                  : received < due
                    ? formatMoney(due - received)
                    : formatMoney(change ?? 0)}
              </dd>
            </div>
          </dl>

          <footer>
            {locked || processing ? null : (
              <button type="button" className={styles.cancel} onClick={onCancel}>
                Cancel
              </button>
            )}
            <button
              type="button"
              className={styles.confirm}
              disabled={!canPay || processing}
              onClick={() => void takePayment()}
            >
              {processing ? 'Saving…' : confirmLabel}
            </button>
          </footer>
        </section>
      </div>
    </OverlayPortal>
  );
}
