import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Theme } from '@astryxdesign/core/theme';
import { OlasothemeTheme } from '../Olasotheme';
import { App } from './App';
import { AppDataProvider } from './data/AppDataProvider';
import { ConnectionProvider } from './data/connectionContext';
import './globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConnectionProvider>
      <AppDataProvider>
        <Theme theme={OlasothemeTheme} mode="light">
          <App />
        </Theme>
      </AppDataProvider>
    </ConnectionProvider>
  </StrictMode>,
);
