import { getProfile } from '@/lib/content';
import React from 'react';

const navItems = [
  { label: 'Story', href: '#story' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

const Header: React.FC = () => {
  const { firstName, lastName } = getProfile();
  return (
    <header className="flex flex-wrap justify-between items-center gap-4 py-5 uppercase">
      <a href="#top" className="text-sm font-bold leading-tight">
        <span className="block">{firstName}</span>
        <span className="block">{lastName}</span>
      </a>
      <nav aria-label="Primary">
        <ul className="text-xs sm:text-sm flex flex-wrap gap-2 font-semibold">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-block rounded-full border border-gray-300 px-3 sm:px-4 py-2 transition-colors hover:bg-black hover:text-white hover:border-black"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
