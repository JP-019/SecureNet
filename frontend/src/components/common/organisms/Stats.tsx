import React from 'react';
import { COLORS } from '../../../utils/constants';

interface StatCardProps {
  icon: string;
  value: number | string;
  label: string;
  variant?: 'default' | 'green' | 'blue' | 'red';
}

const variantColors = {
  default: COLORS.purple,
  green: COLORS.green,
  blue: COLORS.blue,
  red: COLORS.red,
};

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, variant = 'default' }) => {
  const color = variantColors[variant];

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        color: 'white',
        padding: 20,
        borderRadius: 12,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 8 }}>
        <i className={`fas ${icon}`} />
      </div>
      <div style={{ fontSize: 32, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 12, opacity: 0.9 }}>{label}</div>
    </div>
  );
};

interface MetricBarProps {
  label: string;
  value: number;
  max: number;
  percentage: number;
  unit?: string;
}

export const MetricBar: React.FC<MetricBarProps> = ({ label, value, max, percentage, unit }) => {
  const getBarColor = (): string => {
    if (percentage > 80) return COLORS.red;
    if (percentage > 60) return COLORS.yellow;
    return COLORS.green;
  };

  return (
    <div style={{ padding: '10px 0', borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{value}{unit ? `/${max} ${unit}` : `/${max}`}</span>
      </div>
      <div
        style={{
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: getBarColor(),
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC = () => (
  <div style={{ textAlign: 'center', padding: 40 }}>
    <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: COLORS.primary }} />
    <p style={{ marginTop: 16, color: COLORS.gray500 }}>Cargando...</p>
  </div>
);

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div style={{ textAlign: 'center', padding: 40 }}>
    <i className="fas fa-exclamation-circle" style={{ fontSize: 48, color: COLORS.red }} />
    <p style={{ marginTop: 16, color: COLORS.gray600 }}>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          marginTop: 16,
          padding: '10px 20px',
          backgroundColor: COLORS.primary,
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Reintentar
      </button>
    )}
  </div>
);
