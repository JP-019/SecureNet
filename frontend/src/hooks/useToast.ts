import { useState, useCallback } from 'react';

interface UseToastOptions {
  duration?: number;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useToast = (options?: UseToastOptions) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ visible: true, message, type });
      setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, options?.duration || 3000);
    },
    [options?.duration]
  );

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
};
