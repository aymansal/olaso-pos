import { ChevronDown } from '@boxicons/react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useT } from '../../lib/locale';
import styles from './MenuSelect.module.css';

export type MenuOption = {
  id: string;
  label: string;
  disabled?: boolean;
};

export function MenuSelect({
  options,
  value,
  onChange,
  labelledBy,
  ariaLabel,
  placeholder = 'Select',
  disabled,
  size = 'compact',
  className,
}: {
  options: MenuOption[];
  value: string;
  onChange: (id: string) => void;
  labelledBy?: string;
  ariaLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'lock' | 'compact' | 'field';
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLUListElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>();
  const t = useT();
  const selected = options.find((option) => option.id === value);

  useLayoutEffect(() => {
    if (!open || !root.current || !menu.current) return;
    const box = root.current.getBoundingClientRect();
    const below = window.innerHeight - box.bottom - 14;
    const above = box.top - 14;
    const maximum = size === 'lock' ? 240 : size === 'field' ? 220 : 200;
    const upwards = below < maximum && above > below;
    setMenuStyle({
      ...(upwards ? { bottom: window.innerHeight - box.top + 6 } : { top: box.bottom + 6 }),
      left: Math.max(8, Math.min(box.left, window.innerWidth - box.width - 8)),
      width: Math.min(box.width, window.innerWidth - 16),
      maxHeight: Math.max(0, Math.min(maximum, upwards ? above : below)),
    });
    menu.current.showPopover();
    return () => { if (menu.current?.matches(':popover-open')) menu.current.hidePopover(); };
  }, [open, size]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const closeOnScroll = (event: Event) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('scroll', closeOnScroll, true);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('scroll', closeOnScroll, true);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <div
      className={`${styles.wrap} ${size === 'lock' ? styles.lock : size === 'field' ? styles.field : styles.compact}${className ? ` ${className}` : ''}`}
      ref={root}
    >
      <button
        className={styles.trigger}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel ? t(ariaLabel) : undefined}
        aria-labelledby={labelledBy}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected ? t(selected.label) : t(placeholder)}</span>
        <ChevronDown
          className={open ? styles.caretOpen : undefined}
          width={size === 'lock' ? 18 : 14}
          height={size === 'lock' ? 18 : 14}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <ul ref={menu} popover="auto" onToggle={(event) => {
          if (event.newState === 'closed') setOpen(false);
        }} className={styles.menu} id={listId} role="listbox" style={menuStyle}>
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                disabled={option.disabled}
                aria-selected={option.id === value}
                className={option.id === value ? styles.selected : undefined}
                onClick={() => {
                  if (option.disabled) return;
                  onChange(option.id);
                  setOpen(false);
                }}
              >
                {t(option.label)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
