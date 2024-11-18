import React from "react";

const Tag: React.FC = ({ className, children, variant }) => {
  return (
    <span className={`border-black cursor-pointer ${className} p-2 px-4 ${variant === 'outlined' ? 'border border-1' : ''} rounded-full`}>
      {children}
    </span>
  );
};

export default Tag;
