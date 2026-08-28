import { Button } from '@astryxdesign/core/Button';
import { ArrowRight, ChevronsRight } from '@boxicons/react';
import { formatMoney } from '../../../../lib/money';
import styles from './PrimaryAction.module.css';

type PrimaryActionProps = {
  totalCentimes: number;
  disabled: boolean;
  processing: boolean;
  onPlaceOrder: () => Promise<void>;
};

export function PrimaryAction({
  totalCentimes,
  disabled,
  processing,
  onPlaceOrder,
}: PrimaryActionProps) {
  const amount = formatMoney(totalCentimes);

  return (
    <Button
      className={styles.button}
      label={`Place order, ${amount}`}
      width={296}
      variant="primary"
      icon={<ArrowRight width={18} height={18} />}
      endContent={<ChevronsRight width={22} height={22} />}
      isDisabled={disabled}
      isLoading={processing}
      clickAction={onPlaceOrder}
    >
      <span className={styles.label}>Place Order&nbsp;&nbsp;&nbsp; {amount}</span>
    </Button>
  );
}
