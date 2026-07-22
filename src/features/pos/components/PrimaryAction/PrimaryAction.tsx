import { Button } from '@astryxdesign/core/Button';
import { ArrowRight, CaretDoubleRight } from '@phosphor-icons/react';
import styles from './PrimaryAction.module.css';

export function PrimaryAction() {
  return (
    <Button
      className={styles.button}
      label="Place order, $26.4"
      width={296}
      variant="primary"
      icon={<ArrowRight size={18} />}
      endContent={<CaretDoubleRight size={22} />}
    >
      <span className={styles.label}>Place Order&nbsp;&nbsp;&nbsp; $26.4</span>
    </Button>
  );
}
