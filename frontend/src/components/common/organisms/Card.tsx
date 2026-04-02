import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, onClick, hoverable }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        ...(hoverable && {
          ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          },
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
