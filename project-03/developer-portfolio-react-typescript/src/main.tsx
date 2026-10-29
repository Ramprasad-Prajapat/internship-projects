import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <StrictMode>
    <ThemeProvider>
      <LoadingProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </LoadingProvider>
    </ThemeProvider>
  </StrictMode>
);
