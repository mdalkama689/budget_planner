import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '',
  padding = 'md',
  noPadding = false
}) => {
  const paddingClass = noPadding 
    ? 'p-0' 
    : padding === 'sm' 
      ? 'p-3' 
      : padding === 'md' 
        ? 'p-4' 
        : 'p-6';

  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg border border-gray-700 transition-all hover:shadow-xl ${paddingClass} ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;