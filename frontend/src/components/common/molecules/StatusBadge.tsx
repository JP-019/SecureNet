import React from 'react';
import { COLORS } from '../../../utils/constants';
import type { UserStatus } from '../../../types';

interface StatusBadgeProps {
  status: UserStatus;
  showLabel?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showLabel = false }) => {
  const getColor = (): string => {
    const colors: Record<UserStatus, string> = {
      active: COLORS.green,
      busy: COLORS.red,
      offline: COLORS.gray400,
      inactive: COLORS.gray400,
    };
    return colors[status];
  };

  const getLabel = (): string => {
    const labels: Record<UserStatus, string> = {
      active: 'Activo',
      busy: 'Alerta',
      offline: 'Desconectado',
      inactive: 'Inactivo',
    };
    return labels[status];
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: getColor(),
          animation: status === 'busy' ? 'pulse 1s infinite' : 'none',
        }}
      />
      {showLabel && (
        <span style={{ fontSize: 12, color: COLORS.gray500 }}>{getLabel()}</span>
      )}
    </div>
  );
};
