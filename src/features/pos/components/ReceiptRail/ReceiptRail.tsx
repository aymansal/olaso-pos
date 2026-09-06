import { Card } from '@astryxdesign/core/Card';
import { Trash } from '@boxicons/react';
import { useT } from '../../../../lib/locale';
import type { Product } from '../../data/products';
import type { PaymentMethod, ServiceMode } from '../../posSession';
import { OrderItemCard } from '../OrderItemCard/OrderItemCard';
import { PaymentMethodControl } from '../PaymentMethodControl/PaymentMethodControl';
import { PaymentSummary } from '../PaymentSummary/PaymentSummary';
import { PrimaryAction } from '../PrimaryAction/PrimaryAction';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import styles from './ReceiptRail.module.css';

function localizeCheckout(
  t: (english: string, vars?: Record<string, string | number>) => string,
  text: string,
) {
  if (text.startsWith('Sale saved. ') && text.endsWith(' Reprint remains available.')) {
    const detail = text.slice('Sale saved. '.length, -' Reprint remains available.'.length);
    return `${t('Sale saved.')} ${t(detail)} ${t('Reprint remains available.')}`;
  }
  return t(text);
}

type ReceiptLine = {
  id: string;
  product: Product;
  quantity: number;
  modifierSummary: string;
  complimentary: boolean;
};

type ReceiptRailProps = {
  lines: ReceiptLine[];
  subtotalCentimes: number;
  offertCentimes: number;
  totalCentimes: number;
  serviceMode: ServiceMode;
  paymentMethod: PaymentMethod;
  checkoutFeedback: {
    kind: 'neutral' | 'error' | 'success';
    message: string;
  };
  checkoutDisabled: boolean;
  checkoutProcessing: boolean;
  onDecrement: (lineId: string) => void;
  onIncrement: (lineId: string) => void;
  onRemove: (lineId: string) => void;
  onToggleOffert: (lineId: string) => void;
  onClearCart: () => void;
  onServiceModeChange: (serviceMode: ServiceMode) => void;
  onPaymentMethodChange: (paymentMethod: PaymentMethod) => void;
  onPlaceOrder: () => Promise<void>;
  canSplit: boolean;
  onSplit: () => void;
};

export function ReceiptRail({
  lines,
  subtotalCentimes,
  offertCentimes,
  totalCentimes,
  serviceMode,
  paymentMethod,
  checkoutFeedback,
  checkoutDisabled,
  checkoutProcessing,
  onDecrement,
  onIncrement,
  onRemove,
  onToggleOffert,
  onClearCart,
  onServiceModeChange,
  onPaymentMethodChange,
  onPlaceOrder,
  canSplit,
  onSplit,
}: ReceiptRailProps) {
  const t = useT();
  return (
    <Card className={styles.rail} width={320} height={688} padding={0}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{t('Current order')}</h2>
        <button
          className={styles.clearCart}
          type="button"
          aria-label={t('Clear cart')}
          disabled={lines.length === 0 || checkoutProcessing}
          onClick={onClearCart}
        >
          <Trash width={18} height={18} aria-hidden="true" />
        </button>
      </div>
      <SegmentedControl value={serviceMode} onChange={onServiceModeChange} />
      <PaymentMethodControl value={paymentMethod} onChange={onPaymentMethodChange} />
      <div
        className={styles.orderSection}
        data-offert={offertCentimes > 0 ? '' : undefined}
        role="region"
        aria-label={t('Cart')}
      >
        <div className={styles.orderList}>
          {lines.map(({ id, product, quantity, modifierSummary, complimentary }) => (
            <OrderItemCard
              key={id}
              product={product}
              quantity={quantity}
              modifierSummary={modifierSummary}
              complimentary={complimentary}
              onDecrement={() => onDecrement(id)}
              onIncrement={() => onIncrement(id)}
              onRemove={() => onRemove(id)}
              onToggleOffert={() => onToggleOffert(id)}
            />
          ))}
        </div>
      </div>
      <PaymentSummary
        subtotalCentimes={subtotalCentimes}
        offertCentimes={offertCentimes}
        totalCentimes={totalCentimes}
      />
      <p
        className={`${styles.feedback} ${styles[checkoutFeedback.kind]}`}
        role={checkoutFeedback.kind === 'error' ? 'alert' : 'status'}
      >
        {localizeCheckout(t, checkoutFeedback.message)}
      </p>
      <PrimaryAction
        totalCentimes={totalCentimes}
        disabled={checkoutDisabled}
        processing={checkoutProcessing}
        onPlaceOrder={onPlaceOrder}
        canSplit={canSplit}
        onSplit={onSplit}
      />
    </Card>
  );
}
