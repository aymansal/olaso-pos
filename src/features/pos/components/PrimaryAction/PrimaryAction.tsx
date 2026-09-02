import { useEffect, useRef, useState } from 'react';
import { CheckCircle, ChevronsRight } from '@boxicons/react';
import { formatMoney } from '../../../../lib/money';
import { useT } from '../../../../lib/locale';
import styles from './PrimaryAction.module.css';

const THUMB = 42;
const INSET = 4;
const SNAP = '280ms cubic-bezier(0.22, 1, 0.36, 1)';
const SNAP_MS = 280;
const FADE_PX = 36;

type PrimaryActionProps = {
  totalCentimes: number;
  disabled: boolean;
  processing: boolean;
  onPlaceOrder: () => Promise<void>;
};

export function PrimaryAction({
  totalCentimes,
  disabled,
  processing,
  onPlaceOrder,
}: PrimaryActionProps) {
  const t = useT();
  const amount = formatMoney(totalCentimes);
  const trackRef = useRef<HTMLDivElement>(null);
  const originX = useRef(0);
  const offsetRef = useRef(0);
  const dragging = useRef(false);
  const committing = useRef(false);
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  function maxX() {
    return Math.max(0, (trackRef.current?.clientWidth ?? 296) - INSET * 2 - THUMB);
  }

  function moveTo(next: number, withAnimate: boolean) {
    const clamped = Math.max(0, Math.min(next, maxX()));
    offsetRef.current = clamped;
    setAnimate(withAnimate);
    setOffset(clamped);
  }

  useEffect(() => {
    if (processing || dragging.current || committing.current) return;
    if (offsetRef.current <= 0) return;
    moveTo(0, true);
    const timer = window.setTimeout(() => setConfirmed(false), SNAP_MS);
    return () => window.clearTimeout(timer);
  }, [disabled, processing]);

  async function commit() {
    if (committing.current || disabled) return;
    committing.current = true;
    moveTo(maxX(), true);
    setConfirmed(true);
    await new Promise((resolve) => window.setTimeout(resolve, SNAP_MS));
    try {
      await onPlaceOrder();
    } finally {
      committing.current = false;
      moveTo(0, true);
      window.setTimeout(() => setConfirmed(false), SNAP_MS);
    }
  }

  function onPointerDown(event: React.PointerEvent<HTMLSpanElement>) {
    if (disabled || processing || committing.current) return;
    dragging.current = true;
    originX.current = event.clientX - offsetRef.current;
    moveTo(offsetRef.current, false);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLSpanElement>) {
    if (!dragging.current) return;
    moveTo(event.clientX - originX.current, false);
  }

  function onPointerUp(event: React.PointerEvent<HTMLSpanElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // already released
    }
    if (offsetRef.current >= maxX() * 0.86) {
      void commit();
      return;
    }
    moveTo(0, true);
  }

  const travel = Math.max(maxX(), 1);
  const labelHidden = confirmed || processing;
  const labelOpacity = labelHidden
    ? 0
    : Math.max(0, 1 - offset / FADE_PX);

  return (
    <div
      ref={trackRef}
      className={`${styles.track} ${
        disabled || processing ? styles.locked : ''
      } ${disabled && offset === 0 ? styles.faded : ''}`}
      role="slider"
      aria-label={t('Slide to place order, {amount}', { amount })}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round((offset / travel) * 100)}
      aria-disabled={disabled || processing}
    >
      <span
        className={styles.label}
        style={{
          clipPath: `inset(0 0 0 ${offset}px)`,
          opacity: labelOpacity,
          transition: animate ? `clip-path ${SNAP}, opacity ${SNAP}` : 'none',
        }}
      >
        {t('Place Order')}&nbsp;&nbsp;&nbsp; {amount}
      </span>
      <span
        className={styles.thumb}
        style={{
          transform: `translate3d(${offset}px,0,0)`,
          transition: animate ? `transform ${SNAP}` : 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {confirmed || processing ? (
          <span className={styles.check}>
            <CheckCircle width={22} height={22} aria-hidden="true" />
          </span>
        ) : (
          <span className={offset === 0 ? styles.nudge : undefined}>
            <ChevronsRight width={22} height={22} aria-hidden="true" />
          </span>
        )}
      </span>
    </div>
  );
}
