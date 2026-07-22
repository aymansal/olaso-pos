import { Card } from '@astryxdesign/core/Card';
import { americanoOrderImage } from '../../data/products';
import { LabeledField } from '../LabeledField/LabeledField';
import { OrderItemCard } from '../OrderItemCard/OrderItemCard';
import { PaymentSummary } from '../PaymentSummary/PaymentSummary';
import { PrimaryAction } from '../PrimaryAction/PrimaryAction';
import { ReceiptHeader } from '../ReceiptHeader/ReceiptHeader';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import styles from './ReceiptRail.module.css';

export function ReceiptRail() {
  return (
    <Card className={styles.rail} width={320} height={688} padding={0}>
      <ReceiptHeader />
      <SegmentedControl />
      <div className={styles.fields}>
        <LabeledField label="Customer name" value="Muadz" />
        <LabeledField label="Table" value="B12 - Indoor" isSelect />
      </div>
      <div className={styles.orderSection}>
        <span className={styles.sectionLabel}>Order list</span>
        <OrderItemCard image={americanoOrderImage} />
      </div>
      <PaymentSummary />
      <PrimaryAction />
    </Card>
  );
}
