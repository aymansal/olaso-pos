import { useEffect, useState, type ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { openLocalDatabase } from './localDatabase';
import styles from './AppDataProvider.module.css';

const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [localState, setLocalState] =
    useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    openLocalDatabase().then(
      () => active && setLocalState('ready'),
      () => active && setLocalState('error'),
    );
    return () => {
      active = false;
    };
  }, []);

  if (localState !== 'ready') {
    return (
      <main
        className={styles.startup}
        aria-live="polite"
        role={localState === 'error' ? 'alert' : 'status'}
      >
        <strong>
          {localState === 'error'
            ? 'Local data unavailable'
            : 'Starting Olaso…'}
        </strong>
        <span>
          {localState === 'error'
            ? 'Restart the app before taking orders.'
            : 'Preparing the offline workspace.'}
        </span>
      </main>
    );
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
