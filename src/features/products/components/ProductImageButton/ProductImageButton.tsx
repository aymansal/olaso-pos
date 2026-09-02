import { Plus } from '@boxicons/react';
import { type ReactNode, useRef } from 'react';
import { compressProductImage } from '../../../../lib/compressProductImage.ts';
import { useT } from '../../../../lib/locale';
import styles from './ProductImageButton.module.css';

export function ProductImageButton({
  previewUrl,
  onChange,
  onError,
  disabled,
  className,
  label,
  fallback,
}: {
  previewUrl?: string;
  onChange: (dataUrl: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  className?: string;
  label: string;
  fallback?: ReactNode;
}) {
  const t = useT();
  const input = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        className={`${styles.button}${className ? ` ${className}` : ''}`}
        aria-label={t(label)}
        disabled={disabled}
        onClick={() => input.current?.click()}
      >
        {previewUrl ? (
          <img className={styles.preview} src={previewUrl} alt="" />
        ) : (
          fallback ?? <Plus width={16} height={16} aria-hidden="true" />
        )}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (!file) return;
          void compressProductImage(file).then(onChange, (caught) => {
            onError?.(
              t(caught instanceof Error
                ? caught.message
                : 'Could not use that photo.'),
            );
          });
        }}
      />
    </>
  );
}
