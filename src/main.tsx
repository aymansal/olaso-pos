import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { Theme } from '@astryxdesign/core/theme';
import { OlasothemeTheme } from '../Olasotheme';
import { App } from './App';
import { AppDataProvider } from './data/AppDataProvider';
import './globals.css';

if (Capacitor.isNativePlatform()) {
  const applyTabletScale = () => {
    document.documentElement.style.setProperty(
      'zoom',
      String(Math.max(window.outerWidth, window.outerHeight) / 1340),
    );
  };
  applyTabletScale();
  window.requestAnimationFrame(() =>
    window.requestAnimationFrame(applyTabletScale),
  );
  window.setTimeout(applyTabletScale, 250);
  window.addEventListener('resize', applyTabletScale, { passive: true });
  window.screen.orientation.addEventListener('change', applyTabletScale);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppDataProvider>
      <Theme theme={OlasothemeTheme} mode="light">
        <App />
      </Theme>
    </AppDataProvider>
  </StrictMode>,
);
