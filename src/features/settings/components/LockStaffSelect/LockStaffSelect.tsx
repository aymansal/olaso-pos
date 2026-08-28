import { ChevronDown } from '@boxicons/react';
import { useEffect, useId, useRef, useState } from 'react';
import styles from './LockStaffSelect.module.css';

export function LockStaffSelect({
  staff,
  value,
  disabled,
  labelledBy,
  onChange,
}: {
  staff: { id: string; name: string }[];
  value: string;
  disabled?: boolean;
  labelledBy: string;
  onChange: (id: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const selected = staff.find((member) => member.id === value);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <div className={styles.wrap} ref={root}>
      <button
        className={styles.trigger}
        type="button"
        disabled={disabled}
        aria-labelledby={labelledBy}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.name ?? 'Select staff'}</span>
        <ChevronDown className={open ? styles.caretOpen : undefined} width={18} height={18} aria-hidden="true" />
      </button>
      {open ? (
        <ul className={styles.menu} id={listId} role="listbox">
          {staff.map((member) => (
            <li key={member.id}>
              <button
                type="button"
                role="option"
                aria-selected={member.id === value}
                className={member.id === value ? styles.selected : undefined}
                onClick={() => {
                  onChange(member.id);
                  setOpen(false);
                }}
              >
                {member.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
