import React, { ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ children, className = '' }) => {
  return <h2 className={`text-base sm:text-lg font-semibold tracking-[-0.01em] text-[#86868b] ${className}`}>{children}</h2>;
};
