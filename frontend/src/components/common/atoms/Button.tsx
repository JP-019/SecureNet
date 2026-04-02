import React from 'react';
import { COLORS } from '../../../utils/constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  disabled,
  style,
  ...props
}) => {
  const getBackgroundColor = (): string => {
    const colors = {
      primary: COLORS.primary,
      secondary: COLORS.gray200,
      success: COLORS.green,
      danger: COLORS.red,
    };
    return colors[variant];
  };

  const getColor = (): string => {
    return variant === 'secondary' ? COLORS.gray700 : 'white';
  };

  const getPadding = (): { padding: string; fontSize: string } => {
    const sizes = {
      sm: { padding: '8px 16px', fontSize: '13px' },
      md: { padding: '12px 24px', fontSize: '14px' },
      lg: { padding: '16px 32px', fontSize: '16px' },
    };
    return sizes[size];
  }

  const paddingStyle = getPadding();

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        padding: paddingStyle.padding,
        borderRadius: 12,
        border: 'none',
        backgroundColor: getBackgroundColor(),
        color: getColor(),
        fontSize: paddingStyle.fontSize,
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {loading ? (
        <i className="fas fa-spinner fa-spin" />
      ) : (
        <>
          {icon && <i className={`fas ${icon}`} />}
          {children}
        </>
      )}
    </button>
  );
};
