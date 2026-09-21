import { useEffect, useRef, type RefObject } from 'react';

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useModalFocus<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
  restoreSelector?: string,
): RefObject<T | null> {
  const dialogRef = useRef<T>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const modal = dialog;

    const focusable = () =>
      [...dialog.querySelectorAll<HTMLElement>(focusableSelector)]
        .filter((element) => element.getClientRects().length);
    const first = focusable()[0] ?? modal;
    first.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        modal.focus();
        return;
      }
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && (currentIndex <= 0 || currentIndex === -1)) {
        event.preventDefault();
        items.at(-1)?.focus();
      } else if (!event.shiftKey && currentIndex === items.length - 1) {
        event.preventDefault();
        items[0]?.focus();
      }
    }

    modal.addEventListener('keydown', handleKeyDown);
    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
      if (previous?.isConnected && previous !== document.body && previous !== document.documentElement) {
        previous.focus();
      } else if (restoreSelector) {
        document.querySelector<HTMLElement>(restoreSelector)?.focus();
      }
    };
  }, [open, restoreSelector]);

  return dialogRef;
}
