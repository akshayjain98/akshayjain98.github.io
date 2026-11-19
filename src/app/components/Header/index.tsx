import { getProfile } from '@/lib/content';
import React from 'react';
import { NavBar } from './NavBar';

const Header: React.FC<{ containerClass: string }> = ({ containerClass }) => {
  const { firstName, lastName } = getProfile();
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/95 text-black backdrop-blur">
      <div className={containerClass}>
        <NavBar firstName={firstName} lastName={lastName} />
      </div>
    </header>
  );
};

export default Header;
