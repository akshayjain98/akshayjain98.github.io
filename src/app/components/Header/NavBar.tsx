'use client';

import React, { useEffect, useState } from 'react';

const navItems = [
  { label: 'Story', id: 'story' },
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Skills', id: 'skills' },
  { label: 'Contact', id: 'contact' },
];

export const NavBar: React.FC<{ firstName: string; lastName: string }> = ({ firstName, lastName }) => {
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  // Highlight the section that is currently in the middle of the viewport.
  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const link = (item: (typeof navItems)[number], mobile = false) => (
    <a
      href={`#${item.id}`}
      onClick={() => setOpen(false)}
      aria-current={active === item.id ? 'true' : undefined}
      className={`rounded-full border px-4 py-2 transition-colors ${mobile ? 'block text-center' : 'inline-block'} ${
        active === item.id ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'
      }`}
    >
      {item.label}
    </a>
  );

  return (
    <div className="relative flex justify-between items-center gap-4 py-4 uppercase">
      <a href="#top" className="text-sm font-bold leading-tight" aria-label="Back to top">
        <span className="block">{firstName}</span>
        <span className="block">{lastName}</span>
      </a>

      <nav aria-label="Primary" className="hidden md:flex items-center gap-2 text-sm font-semibold">
        {navItems.map((item) => (
          <React.Fragment key={item.id}>{link(item)}</React.Fragment>
        ))}
        <a href="/resume" className="ml-2 rounded-full bg-black text-white px-4 py-2 hover:bg-gray-800">
          Resume
        </a>
      </nav>

      <button
        type="button"
        className="md:hidden rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="md:hidden absolute top-full left-0 right-0 flex flex-col gap-2 rounded-3xl border border-gray-200 bg-white p-4 text-sm font-semibold shadow-xl"
        >
          {navItems.map((item) => (
            <React.Fragment key={item.id}>{link(item, true)}</React.Fragment>
          ))}
          <a href="/resume" className="block text-center rounded-full bg-black text-white px-4 py-2">
            Resume
          </a>
        </nav>
      )}
    </div>
  );
};
