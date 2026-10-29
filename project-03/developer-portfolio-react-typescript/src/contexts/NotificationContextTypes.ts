import { createContext } from 'react';

export type ToastVariant = 'default' | 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface NotificationContextProps {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);
