import React, { useEffect } from 'react';
import { COLORS } from '../../../utils/constants';

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ visible, message, type, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const getBackgroundColor = (): string => {
    const colors = {
      success: COLORS.green,
      error: COLORS.red,
      info: COLORS.blue,
    };
    return colors[type];
  };

  const getIcon = (): string => {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle',
    };
    return icons[type];
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '16px 28px',
        borderRadius: 12,
        backgroundColor: getBackgroundColor(),
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 5000,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        animation: 'slideIn 0.3s ease',
      }}
    >
      <i className={`fas ${getIcon()}`} />
      <span>{message}</span>
    </div>
  );
};
