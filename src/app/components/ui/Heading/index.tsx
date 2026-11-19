import React, { ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ children, className = '' }) => {
  return <h2 className={`text-sm uppercase font-semibold tracking-wide ${className}`}>{children}</h2>;
};
