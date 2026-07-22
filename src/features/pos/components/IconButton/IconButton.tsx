import { Button } from '@astryxdesign/core/Button';
import type { ReactNode } from 'react';
import styles from './IconButton.module.css';

type IconButtonProps = {
  label: string;
  icon: ReactNode;
  size?: 44 | 46 | 50;
  variant?: 'white' | 'green' | 'outlined';
};

export function IconButton({
  label,
  icon,
  size = 46,
  variant = 'white',
}: IconButtonProps) {
  return (
    <Button
      label={label}
      icon={icon}
      isIconOnly
      className={`${styles.button} ${styles[variant]}`}
      style={{ width: size, height: size }}
    />
  );
}
