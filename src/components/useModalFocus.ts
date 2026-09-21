import { useEffect, useRef, type RefObject } from 'react';

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function canRestore(element: HTMLElement | null): element is HTMLElement {
  return Boolean(
    element
      && element.isConnected
      && element !== document.body
      && element !== document.documentElement
      && !element.matches(':disabled,[aria-hidden="true"]'),
  );
}

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
    const dialogElement = dialog;

    const focusable = () =>
      [...dialog.querySelectorAll<HTMLElement>(focusableSelector)]
        .filter((element) => element.getClientRects().length);
    const first = focusable()[0] ?? dialog;
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
        dialogElement.focus();
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

    dialogElement.addEventListener('keydown', handleKeyDown);
    return () => {
      dialogElement.removeEventListener('keydown', handleKeyDown);
      if (canRestore(previous)) {
        previous.focus();
      } else if (restoreSelector) {
        const fallback = document.querySelector<HTMLElement>(restoreSelector);
        if (canRestore(fallback)) fallback.focus();
      }
    };
  }, [open, restoreSelector]);

  return dialogRef;
}
