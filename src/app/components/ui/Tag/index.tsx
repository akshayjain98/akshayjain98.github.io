import React from 'react';

interface TagProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'outlined' | 'contained';
  theme?: 'light' | 'dark';
}

const Tag: React.FC<TagProps> = ({ className = '', children, variant = 'contained', theme = 'light' }) => {
  const themeVariantClasses =
    theme === 'dark'
      ? variant === 'outlined'
        ? 'bg-transparent text-white border-white/25'
        : 'bg-white/10 text-white border-transparent'
      : variant === 'outlined'
        ? 'bg-transparent text-apple-ink border-apple-line'
        : 'bg-apple-gray text-apple-ink border-transparent';

  return (
    <span className={`inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border px-3.5 py-1.5 ${themeVariantClasses} ${className}`}>
      {children}
    </span>
  );
};

export default Tag;
