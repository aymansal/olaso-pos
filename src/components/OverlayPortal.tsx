import { type PointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

function isTextEntry(node: EventTarget | null): node is HTMLElement {
  if (!(node instanceof HTMLElement)) return false;
  if (node.isContentEditable) return true;
  if (node.tagName === 'TEXTAREA') return true;
  if (node.tagName !== 'INPUT') return false;
  const type = (node as HTMLInputElement).type;
  return type !== 'button' && type !== 'submit' && type !== 'checkbox'
    && type !== 'radio' && type !== 'file' && type !== 'hidden';
}

function keyboardOpen() {
  const viewport = window.visualViewport;
  return Boolean(viewport && window.innerHeight - viewport.height > 80);
}

function dismissKeyboard() {
  const active = document.activeElement;
  if (isTextEntry(active)) {
    active.blur();
    return true;
  }
  if (!keyboardOpen()) return false;
  if (active instanceof HTMLElement) active.blur();
  return true;
}

export function closeOnBackdrop(
  event: PointerEvent<HTMLElement>,
  onClose: () => void,
) {
  if (event.target !== event.currentTarget) return;
  if (dismissKeyboard()) return;
  onClose();
}

export function OverlayPortal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body);
}
