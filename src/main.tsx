import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { Theme } from '@astryxdesign/core/theme';
import { OlasothemeTheme } from '../Olasotheme';
import { App } from './App';
import { AppDataProvider } from './data/AppDataProvider';
import './globals.css';

if (Capacitor.isNativePlatform()) {
  document.documentElement.style.setProperty(
    'zoom',
    String(Math.max(window.screen.width, window.screen.height) / 1340),
  );
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
