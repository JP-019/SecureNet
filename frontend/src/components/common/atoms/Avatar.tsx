import React from 'react';
import { COLORS } from '../../../utils/constants';

interface AvatarProps {
  name: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const getRoleColor = (role?: string): string => {
  const colors: Record<string, string> = {
    admin: COLORS.purple,
    recepcion: COLORS.blue,
    guardia: COLORS.green,
  };
  return colors[role || ''] || COLORS.gray400;
};

const sizeStyles = {
  sm: { width: 32, height: 32, fontSize: 12 },
  md: { width: 40, height: 40, fontSize: 14 },
  lg: { width: 50, height: 50, fontSize: 16 },
};

export const Avatar: React.FC<AvatarProps> = ({ name, role, size = 'md', className }) => {
  const sizeStyle = sizeStyles[size];

  return (
    <div
      className={className}
      style={{
        width: sizeStyle.width,
        height: sizeStyle.height,
        borderRadius: '50%',
        backgroundColor: getRoleColor(role),
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: sizeStyle.fontSize,
        flexShrink: 0,
      }}
    >
      {getInitials(name)}
    </div>
  );
};
