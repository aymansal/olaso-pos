import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Theme } from '@astryxdesign/core/theme';
import { OlasothemeTheme } from '../Olasotheme';
import { App } from './App';
import { AppDataProvider } from './data/AppDataProvider';
import './globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppDataProvider>
      <Theme theme={OlasothemeTheme} mode="light">
        <App />
      </Theme>
    </AppDataProvider>
  </StrictMode>,
);
