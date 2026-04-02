import React from 'react';
import { COLORS } from '../../../utils/constants';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'success' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  const getColors = () => {
    switch (type) {
      case 'danger':
        return { bg: COLORS.red, icon: 'fa-exclamation-triangle' };
      case 'warning':
        return { bg: COLORS.yellow, icon: 'fa-exclamation-circle' };
      case 'success':
        return { bg: COLORS.green, icon: 'fa-check-circle' };
      default:
        return { bg: COLORS.blue, icon: 'fa-info-circle' };
    }
  };

  const colors = getColors();

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
        zIndex: 3000,
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          width: '90%',
          maxWidth: 400,
          overflow: 'hidden',
          animation: 'slideIn 0.3s ease',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: 30,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: `${colors.bg}20`,
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className={`fas ${colors.icon}`} style={{ fontSize: 24, color: colors.bg }} />
          </div>
          <h3 style={{ marginBottom: 10, fontSize: 18 }}>{title}</h3>
          <p style={{ color: COLORS.gray600, fontSize: 14, lineHeight: 1.5 }}>{message}</p>
        </div>
        <div
          style={{
            display: 'flex',
            borderTop: `1px solid ${COLORS.gray200}`,
          }}
        >
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 15,
              border: 'none',
              background: 'transparent',
              color: COLORS.gray700,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: 15,
              border: 'none',
              background: colors.bg,
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};