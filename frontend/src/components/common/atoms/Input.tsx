import { InputHTMLAttributes, forwardRef } from 'react';
import { COLORS } from '../../../utils/constants';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, style, ...props }, ref) => {
    return (
      <div style={{ marginBottom: 20 }}>
        {label && (
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: COLORS.gray300,
              marginBottom: 8,
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {icon && (
            <i
              className={`fas ${icon}`}
              style={{
                position: 'absolute',
                left: 15,
                top: '50%',
                transform: 'translateY(-50%)',
                color: COLORS.gray500,
                fontSize: 14,
              }}
            />
          )}
          <input
            ref={ref}
            style={{
              width: '100%',
              padding: '14px 14px 14px 45px',
              background: COLORS.gray700,
              border: `2px solid ${error ? COLORS.red : COLORS.gray600}`,
              borderRadius: 12,
              fontSize: 14,
              color: COLORS.gray50,
              outline: 'none',
              transition: 'all 0.3s',
              ...style,
            }}
            {...props}
          />
        </div>
        {error && (
          <span style={{ fontSize: 12, color: COLORS.red, marginTop: 4 }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
