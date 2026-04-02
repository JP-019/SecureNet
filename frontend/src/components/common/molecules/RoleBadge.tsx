import React from 'react';
import { COLORS, ROLE_COLORS } from '../../../utils/constants';
import { capitalize } from '../../../utils/helpers';
import type { UserRole } from '../../../types';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'sm' }) => {
  const color = ROLE_COLORS[role] || COLORS.gray400;

  return (
    <span
      style={{
        fontSize: size === 'sm' ? 10 : 12,
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        borderRadius: 8,
        fontWeight: 600,
        backgroundColor: color,
        color: 'white',
      }}
    >
      {role === 'recepcion' ? 'Recep' : capitalize(role)}
    </span>
  );
};
