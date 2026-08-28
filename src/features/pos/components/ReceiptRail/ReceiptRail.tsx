import { Card } from '@astryxdesign/core/Card';
import { Trash } from '@boxicons/react';
import type { Product } from '../../data/products';
import type { PaymentMethod, ServiceMode } from '../../posSession';
import { OrderItemCard } from '../OrderItemCard/OrderItemCard';
import { PaymentMethodControl } from '../PaymentMethodControl/PaymentMethodControl';
import { PaymentSummary } from '../PaymentSummary/PaymentSummary';
import { PrimaryAction } from '../PrimaryAction/PrimaryAction';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import styles from './ReceiptRail.module.css';

type ReceiptLine = {
  id: string;
  product: Product;
  quantity: number;
  modifierSummary: string;
};

type ReceiptRailProps = {
  lines: ReceiptLine[];
  subtotalCentimes: number;
  taxCentimes: number;
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
  onClearCart: () => void;
  onServiceModeChange: (serviceMode: ServiceMode) => void;
  onPaymentMethodChange: (paymentMethod: PaymentMethod) => void;
  onPlaceOrder: () => Promise<void>;
};

export function ReceiptRail({
  lines,
  subtotalCentimes,
  taxCentimes,
  totalCentimes,
  serviceMode,
  paymentMethod,
  checkoutFeedback,
  checkoutDisabled,
  checkoutProcessing,
  onDecrement,
  onIncrement,
  onRemove,
  onClearCart,
  onServiceModeChange,
  onPaymentMethodChange,
  onPlaceOrder,
}: ReceiptRailProps) {
  return (
    <Card className={styles.rail} width={320} height={688} padding={0}>
      <SegmentedControl value={serviceMode} onChange={onServiceModeChange} />
      <PaymentMethodControl value={paymentMethod} onChange={onPaymentMethodChange} />
      <div className={styles.orderSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>Order list</span>
          {lines.length > 0 ? (
            <button
              className={styles.clearCart}
              type="button"
              aria-label="Clear cart"
              disabled={checkoutProcessing}
              onClick={onClearCart}
            >
              <Trash width={18} height={18} aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <div className={styles.orderList}>
          {lines.length > 0
            ? lines.map(({ id, product, quantity, modifierSummary }) => (
                <OrderItemCard
                  key={id}
                  product={product}
                  quantity={quantity}
                  modifierSummary={modifierSummary}
                  onDecrement={() => onDecrement(id)}
                  onIncrement={() => onIncrement(id)}
                  onRemove={() => onRemove(id)}
                />
              ))
            : <p className={styles.emptyOrder} role="status">Add a product to start the order.</p>}
        </div>
      </div>
      <PaymentSummary
        subtotalCentimes={subtotalCentimes}
        taxCentimes={taxCentimes}
        totalCentimes={totalCentimes}
      />
      <p
        className={`${styles.feedback} ${styles[checkoutFeedback.kind]}`}
        role={checkoutFeedback.kind === 'error' ? 'alert' : 'status'}
      >
        {checkoutFeedback.message}
      </p>
      <PrimaryAction
        totalCentimes={totalCentimes}
        disabled={checkoutDisabled}
        processing={checkoutProcessing}
        onPlaceOrder={onPlaceOrder}
      />
    </Card>
  );
}
