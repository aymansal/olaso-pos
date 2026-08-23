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
  const rescaleAfterViewportSettles = () => {
    applyTabletScale();
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(applyTabletScale),
    );
    [250, 750, 1_500, 2_000].forEach((delay) =>
      window.setTimeout(applyTabletScale, delay),
    );
  };
  rescaleAfterViewportSettles();
  window.addEventListener('resize', applyTabletScale, { passive: true });
  window.screen.orientation.addEventListener('change', applyTabletScale);
  window.visualViewport?.addEventListener('resize', applyTabletScale, { passive: true });
  window.addEventListener('pageshow', rescaleAfterViewportSettles);
  window.addEventListener('focus', rescaleAfterViewportSettles);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) rescaleAfterViewportSettles();
  });
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
