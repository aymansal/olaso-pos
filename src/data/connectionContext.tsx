import { Capacitor } from '@capacitor/core';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  readSecureSessionNetworkStatus,
  watchSecureSessionNetworkStatus,
} from './secureSession';

type ConnectionState = {
  available: boolean | undefined;
  foreground: boolean;
};

const ConnectionContext = createContext<ConnectionState | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [available, setAvailable] = useState<boolean>();
  const [foreground, setForeground] = useState(
    () => document.visibilityState === 'visible',
  );

  useEffect(() => {
    let active = true;
    let removeNativeListener: (() => void) | undefined;
    const update = (next: boolean) => {
      if (active) setAvailable(next);
    };
    const refresh = async () => {
      if (!Capacitor.isNativePlatform()) {
        update(navigator.onLine);
        return;
      }
      try {
        update(await readSecureSessionNetworkStatus());
      } catch {
        if (active) setAvailable(undefined);
      }
    };
    const resume = () => {
      const visible = document.visibilityState === 'visible';
      setForeground(visible);
      if (visible) void refresh();
    };

    if (Capacitor.isNativePlatform()) {
      void watchSecureSessionNetworkStatus(update).then((remove) => {
        if (active) removeNativeListener = remove;
        else remove();
      }).catch(() => undefined);
    }
    void refresh();
    window.addEventListener('online', resume);
    window.addEventListener('offline', resume);
    window.addEventListener('focus', resume);
    window.addEventListener('pageshow', resume);
    document.addEventListener('visibilitychange', resume);
    return () => {
      active = false;
      removeNativeListener?.();
      window.removeEventListener('online', resume);
      window.removeEventListener('offline', resume);
      window.removeEventListener('focus', resume);
      window.removeEventListener('pageshow', resume);
      document.removeEventListener('visibilitychange', resume);
    };
  }, []);

  return (
    <ConnectionContext.Provider value={{ available, foreground }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionStatus() {
  const connection = useContext(ConnectionContext);
  if (!connection) throw new Error('Connection status is unavailable.');
  return connection;
}
