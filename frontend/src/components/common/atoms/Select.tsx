import React from 'react';
import { COLORS } from '../../../utils/constants';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, icon, options, style, ...props }) => {
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
              zIndex: 1,
              fontSize: 14,
            }}
          />
        )}
        <select
          style={{
            width: '100%',
            padding: '14px 14px 14px 45px',
            border: `2px solid ${COLORS.gray600}`,
            borderRadius: 12,
            fontSize: 14,
            outline: 'none',
            backgroundColor: COLORS.gray700,
            color: COLORS.gray50,
            cursor: 'pointer',
            ...style,
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} style={{ background: COLORS.gray700 }}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
