import React, { ReactNode } from 'react';
import { COLORS } from '../../../utils/constants';

interface ModalProps {
  isOpen?: boolean;
  visible?: boolean;
  title: string;
  icon?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning';
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  isOpen,
  title,
  icon,
  onClose,
  children,
  footer,
  variant = 'primary',
}) => {
  const isVisible = visible ?? isOpen ?? false;
  if (!isVisible) return null;

  const getHeaderColor = (): string => {
    const colors = {
      primary: COLORS.primary,
      success: COLORS.green,
      danger: COLORS.red,
      warning: COLORS.yellow,
    };
    return colors[variant];
  };

  const isLightVariant = variant === 'warning' || variant === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          width: '90%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflow: 'hidden',
          animation: 'slideIn 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '25px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--gray-200)',
            background: `linear-gradient(135deg, ${getHeaderColor()}, ${getHeaderColor()}dd)`,
            color: isLightVariant ? COLORS.gray900 : 'white',
          }}
        >
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12, fontSize: 20 }}>
            {icon && <i className={`fas ${icon}`} />}
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isLightVariant ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'inherit',
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <div style={{ padding: 30, maxHeight: '60vh', overflowY: 'auto' }}>
          {children}
        </div>
        {footer && (
          <div
            style={{
              padding: '20px 30px',
              backgroundColor: COLORS.gray50,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 15,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
