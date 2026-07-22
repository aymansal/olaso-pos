import { CaretRight, ListBullets } from '@phosphor-icons/react';
import { IconButton } from '../IconButton/IconButton';
import styles from './ReceiptHeader.module.css';

export function ReceiptHeader() {
  return (
    <div className={styles.header}>
      <IconButton label="Close receipt" icon={<CaretRight size={20} />} size={50} variant="green" />
      <div className={styles.title}>
        <span>Purchase Receipt</span>
        <strong>#27362</strong>
      </div>
      <IconButton label="Receipt menu" icon={<ListBullets size={20} />} size={50} variant="outlined" />
    </div>
  );
}
