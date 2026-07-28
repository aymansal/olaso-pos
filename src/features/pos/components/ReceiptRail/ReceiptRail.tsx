import { Card } from '@astryxdesign/core/Card';
import type { Product } from '../../data/products';
import type { ServiceMode } from '../../posSession';
import { LabeledField } from '../LabeledField/LabeledField';
import { OrderItemCard } from '../OrderItemCard/OrderItemCard';
import { PaymentSummary } from '../PaymentSummary/PaymentSummary';
import { PrimaryAction } from '../PrimaryAction/PrimaryAction';
import { ReceiptHeader } from '../ReceiptHeader/ReceiptHeader';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import styles from './ReceiptRail.module.css';

type ReceiptLine = {
  product: Product;
  quantity: number;
};

type ReceiptRailProps = {
  lines: ReceiptLine[];
  subtotalCentimes: number;
  taxCentimes: number;
  totalCentimes: number;
  serviceMode: ServiceMode;
  customerName: string;
  table: string;
  checkoutFeedback: {
    kind: 'neutral' | 'error' | 'success';
    message: string;
  };
  checkoutDisabled: boolean;
  checkoutProcessing: boolean;
  onDecrement: (productId: string) => void;
  onIncrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  onServiceModeChange: (serviceMode: ServiceMode) => void;
  onCustomerNameChange: (customerName: string) => void;
  onTableChange: (table: string) => void;
  onCheckOrder: () => Promise<void>;
};

export function ReceiptRail({
  lines,
  subtotalCentimes,
  taxCentimes,
  totalCentimes,
  serviceMode,
  customerName,
  table,
  checkoutFeedback,
  checkoutDisabled,
  checkoutProcessing,
  onDecrement,
  onIncrement,
  onRemove,
  onServiceModeChange,
  onCustomerNameChange,
  onTableChange,
  onCheckOrder,
}: ReceiptRailProps) {
  return (
    <Card className={styles.rail} width={320} height={688} padding={0}>
      <ReceiptHeader />
      <SegmentedControl value={serviceMode} onChange={onServiceModeChange} />
      <div className={styles.fields}>
        <LabeledField
          label="Customer name"
          placeholder="Optional"
          value={customerName}
          onChange={onCustomerNameChange}
        />
        <LabeledField
          label="Table"
          placeholder="Required for dine in"
          value={table}
          onChange={onTableChange}
        />
      </div>
      <div className={styles.orderSection}>
        <span className={styles.sectionLabel}>Order list</span>
        <div className={styles.orderList}>
          {lines.length > 0
            ? lines.map(({ product, quantity }) => (
                <OrderItemCard
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  onDecrement={() => onDecrement(product.id)}
                  onIncrement={() => onIncrement(product.id)}
                  onRemove={() => onRemove(product.id)}
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
        onCheckOrder={onCheckOrder}
      />
    </Card>
  );
}
