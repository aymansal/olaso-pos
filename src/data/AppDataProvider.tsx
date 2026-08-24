import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { openLocalDatabase } from './localDatabase';
import { useConnectionStatus } from './connectionContext.tsx';
import styles from './AppDataProvider.module.css';

function createConvexClient() {
  return new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { available, foreground } = useConnectionStatus();
  const [convexClient, setConvexClient] = useState(createConvexClient);
  const convexClientRef = useRef(convexClient);
  const retiredForOutage = useRef(false);
  const [localState, setLocalState] =
    useState<'loading' | 'ready' | 'error'>('loading');

  const retireConvexClient = useCallback(() => {
    if (retiredForOutage.current) return;
    retiredForOutage.current = true;
    const previous = convexClientRef.current;
    const next = createConvexClient();
    convexClientRef.current = next;
    setConvexClient(next);
    void previous.close();
  }, []);

  useEffect(() => {
    if (available === true && foreground) retiredForOutage.current = false;
    else if (available === false || !foreground) retireConvexClient();
  }, [available, foreground, retireConvexClient]);

  useEffect(() => {
    window.addEventListener('offline', retireConvexClient);
    return () => window.removeEventListener('offline', retireConvexClient);
  }, [retireConvexClient]);

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
