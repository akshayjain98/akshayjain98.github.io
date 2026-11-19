import { getProfile } from '@/lib/content';
import React from 'react';
import { NavBar } from './NavBar';

const Header: React.FC<{ containerClass: string }> = ({ containerClass }) => {
  const { firstName, lastName } = getProfile();
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-[rgba(251,251,253,0.8)] text-apple-ink backdrop-blur-xl backdrop-saturate-[1.8]">
      <div className={containerClass}>
        <NavBar firstName={firstName} lastName={lastName} />
      </div>
    </header>
  );
};

export default Header;
