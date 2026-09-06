import { X } from '@boxicons/react';
import { useState } from 'react';
import { OverlayPortal, closeOnBackdrop } from '../../../../components/OverlayPortal';
import { useT } from '../../../../lib/locale';
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
  startSplit?: boolean;
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
  const t = useT();
  if (lines.length === 0) return <p className={styles.shareEmpty}>{t(empty)}</p>;
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
              {labels[line.id]?.name ?? t('Product')}
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
  startSplit,
  processing,
  onCancel,
  onConfirm,
}: PaymentDialogProps) {
  const t = useT();
  const split = canSplit && startSplit === true;
  const [remaining, setRemaining] = useState(() => payableCart(cart));
  const [pick, setPick] = useState<CartLine[]>([]);
  const [recorded, setRecorded] = useState<PaymentTender[]>([]);
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>(paymentMethod);
  const [customText, setCustomText] = useState('');
  const [tendered, setTendered] = useState<number | undefined>(
    paymentMethod === 'Card' ? chargedCentimes(cart, sizes, choiceValues) : undefined,
  );

  const locked = recorded.length > 0;
  const cash = activeMethod === 'Cash';
  const activeCart = split ? pick : cart;
  const due = chargedCentimes(activeCart, sizes, choiceValues);
  const received = cash ? (tendered ?? (due === 0 ? 0 : undefined)) : due;
  const change = received === undefined ? undefined : changeCentimes(due, received);
  const canPay = activeCart.length > 0 && change !== undefined;
  const lastSplit = split && remaining.length === 0;
  const confirmLabel = !split || lastSplit ? 'Place order' : 'Take payment';

  function setAmount(centimes: number) {
    setTendered(centimes);
    setCustomText('');
  }

  function resetCashAmount() {
    setTendered(undefined);
    setCustomText('');
  }

  async function takePayment() {
    if (!canPay || received === undefined || change === undefined || processing) {
      return;
    }
    const tender: PaymentTender = {
      paymentMethod: activeMethod,
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
      <div
        className={styles.overlay}
        role="presentation"
        onPointerDown={(event) => {
          if (!locked && !processing) closeOnBackdrop(event, onCancel);
        }}
      >
        <section
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-dialog-title"
        >
          <header>
            <span>
              <small>{t('PAYMENT')}</small>
              <h2 id="payment-dialog-title">{formatMoney(due)}</h2>
            </span>
            {locked || processing ? null : (
              <button type="button" onClick={onCancel} aria-label={t('Close payment')}>
                <X width={18} height={18} aria-hidden="true" />
              </button>
            )}
          </header>

          <div className={styles.body}>
            {recorded.length > 0 ? (
              <p className={styles.paid}>
                {recorded.map((tender, index) => (
                  <span key={`${tender.dueCentimes}-${index}`}>
                    {index + 1} · {t(tender.paymentMethod)} · {formatMoney(tender.dueCentimes)}
                  </span>
                ))}
              </p>
            ) : null}

            {split ? (
              <div className={styles.shares}>
                <div>
                  <p className={styles.shareHead}>
                    {t('Remaining')}
                    <span>{t('Tap to add')}</span>
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
                    {t('This payment')}
                    <span>{t('Tap to return')}</span>
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

            {split ? (
              <div className={styles.methods} role="group" aria-label={t('Payment method')}>
                {(['Cash', 'Card'] as const).map((method) => (
                  <button
                    type="button"
                    aria-pressed={activeMethod === method}
                    disabled={processing}
                    onClick={() => {
                      setActiveMethod(method);
                      resetCashAmount();
                    }}
                    key={method}
                  >
                    {t(method)}
                  </button>
                ))}
              </div>
            ) : null}

            {cash ? (
              <>
                <div className={styles.quick} role="group" aria-label={t('Quick amounts')}>
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
                  <span>{t('Custom')}</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    disabled={processing}
                    value={customText}
                    placeholder={t('Amount given')}
                    onChange={(event) => {
                      const next = event.target.value;
                      setCustomText(next);
                      setTendered(parseDirhamsToCentimes(next));
                    }}
                  />
                </label>
              </>
            ) : (
              <p className={styles.cardNote}>{t('Card · exact amount')}</p>
            )}
          </div>

          {cash ? <dl className={styles.change}>
            <div>
              <dt>{t('Given')}</dt>
              <dd>{received === undefined ? '—' : formatMoney(received)}</dd>
            </div>
            <div>
              <dt>
                {received !== undefined && received < due ? t('Need') : t('Change')}
              </dt>
              <dd>
                {received === undefined
                  ? '—'
                  : received < due
                    ? formatMoney(due - received)
                    : formatMoney(change ?? 0)}
              </dd>
            </div>
          </dl> : null}

          <footer>
            {locked || processing ? null : (
              <button type="button" className={styles.cancel} onClick={onCancel}>
                {t('Cancel')}
              </button>
            )}
            <button
              type="button"
              className={styles.confirm}
              disabled={!canPay || processing}
              onClick={() => void takePayment()}
            >
              {processing ? t('Saving…') : t(confirmLabel)}
            </button>
          </footer>
        </section>
      </div>
    </OverlayPortal>
  );
}
