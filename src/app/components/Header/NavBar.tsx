'use client';

import { AnimatePresence, motion } from 'framer-motion';
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

  // Mobile menu: lock page scroll while open; close on Escape or when the screen widens to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => mq.matches && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  return (
    <div className="relative flex h-12 items-center justify-between gap-4">
      <a href="#top" className="text-[15px] font-semibold tracking-[-0.01em]" aria-label="Back to top">
        {firstName} {lastName}
      </a>

      <nav aria-label="Primary" className="hidden lg:flex items-center gap-8 text-xs">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? 'true' : undefined}
            className={`transition-colors duration-200 ${
              active === item.id ? 'text-apple-ink' : 'text-apple-ink/70 hover:text-apple-ink'
            }`}
          >
            {item.label}
          </a>
        ))}
        <a href="/resume/" className="btn-apple-sm">
          Resume
        </a>
      </nav>

      <button
        type="button"
        className="lg:hidden -mr-2 grid h-11 w-11 place-items-center"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden className="relative block h-3 w-[18px]">
          <span
            className={`absolute left-0 h-[1.5px] w-full rounded bg-apple-ink transition-all duration-300 ${
              open ? 'top-[5px] rotate-45' : 'top-0'
            }`}
          />
          <span
            className={`absolute left-0 h-[1.5px] w-full rounded bg-apple-ink transition-all duration-300 ${
              open ? 'top-[5px] -rotate-45' : 'top-[10px]'
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden fixed inset-x-0 top-12 bottom-0 z-40 h-[calc(100dvh-3rem)] overflow-y-auto bg-[#fbfbfd] px-6 sm:px-8 pt-6 pb-10"
          >
            <ul className="flex flex-col">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.03 * i, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className="block py-2 text-[28px] font-semibold tracking-[-0.02em] text-[#333336] transition-colors hover:text-black"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href="/resume/" className="btn-apple mt-8 w-full sm:w-auto">
              Resume
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};
