import { Button } from '@astryxdesign/core/Button';
import { ArrowRight, CaretDoubleRight } from '@phosphor-icons/react';
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
      icon={<ArrowRight size={18} />}
      endContent={<CaretDoubleRight size={22} />}
      isDisabled={disabled}
      isLoading={processing}
      clickAction={onPlaceOrder}
    >
      <span className={styles.label}>Place Order&nbsp;&nbsp;&nbsp; {amount}</span>
    </Button>
  );
}
