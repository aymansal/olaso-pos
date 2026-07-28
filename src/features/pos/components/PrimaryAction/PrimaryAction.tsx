import { Button } from '@astryxdesign/core/Button';
import { ArrowRight, CaretDoubleRight } from '@phosphor-icons/react';
import { formatMoney } from '../../posSession';
import styles from './PrimaryAction.module.css';

type PrimaryActionProps = {
  totalCentimes: number;
  disabled: boolean;
  processing: boolean;
  onCheckOrder: () => Promise<void>;
};

export function PrimaryAction({
  totalCentimes,
  disabled,
  processing,
  onCheckOrder,
}: PrimaryActionProps) {
  const amount = formatMoney(totalCentimes);

  return (
    <Button
      className={styles.button}
      label={`Check order, ${amount}`}
      width={296}
      variant="primary"
      icon={<ArrowRight size={18} />}
      endContent={<CaretDoubleRight size={22} />}
      isDisabled={disabled}
      isLoading={processing}
      clickAction={onCheckOrder}
    >
      <span className={styles.label}>Check Order&nbsp;&nbsp;&nbsp; {amount}</span>
    </Button>
  );
}
