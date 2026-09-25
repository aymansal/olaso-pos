import type { CSSProperties } from 'react';
import styles from './CometSpinner.module.css';

/**
 * Must match --olaso-comet-duration in CometSpinner.module.css and the
 * pre-render rule in index.html.
 */
const COMET_CYCLE_MS = 3400;

type CometSpinnerProps = {
  headScale?: number;
  radiusScale?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Every startup stage mounts its own comet, and a newly mounted CSS animation
 * restarts from 0 degrees. Offsetting the delay by how long the page has been
 * running keeps the rotation phase continuous, so the sweep never jumps back
 * when the pre-render hands over to the React startup stages. This is a single
 * read at render time, not a timer.
 */
function phaseOffset() {
  const elapsed = typeof performance === 'undefined' ? 0 : performance.now();
  return `-${Math.round(elapsed % COMET_CYCLE_MS)}ms`;
}

/**
 * Decorative startup comet. The surrounding startup region already carries
 * role="status" and its aria-label, so the spinner stays hidden from assistive
 * technology and keeps one loading announcement per startup stage.
 * Its size comes from --olaso-comet-size on the startup surface.
 */
export function CometSpinner({ headScale = 0.2, radiusScale = 0.83 }: CometSpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={styles.spinner}
      style={
        {
          '--olaso-comet-head-scale': clamp(headScale, 0.08, 0.35),
          '--olaso-comet-radius-scale': clamp(radiusScale, 0.3, 1.1),
        } as CSSProperties
      }
    >
      <span className={styles.comet} style={{ animationDelay: phaseOffset() }} />
    </span>
  );
}
