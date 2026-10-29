import { createContext } from 'react';

export interface LoadingContextProps {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);
