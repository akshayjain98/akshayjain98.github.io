'use client';

import React, { useState } from 'react';
import { Terminal } from '../Terminal';
import type { TerminalData } from '../Terminal/commands';

// Owns the terminal's expanded state. The left column reacts through `group-data-[expanded=true]:` classes,
// so it can stay server-rendered markup passed in as `left`.
export const HeroLayout: React.FC<{
  left: React.ReactNode;
  photo?: React.ReactNode;
  terminalData: TerminalData;
}> = ({ left, photo, terminalData }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      data-expanded={expanded}
      className="group flex flex-col lg:flex-row justify-between gap-10 sm:gap-12 lg:gap-12 xl:gap-20 data-[expanded=true]:xl:gap-12 py-10 sm:py-12 lg:py-14 items-center flex-1"
    >
      {left}
      <div
        className={`w-full ${expanded ? 'lg:w-[560px] xl:w-[680px]' : 'lg:w-[360px] xl:w-[420px]'} flex-shrink-0 flex flex-col gap-4 motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out ${photo ? 'md:grid md:grid-cols-2 lg:flex' : ''}`}
      >
        {photo}
        <Terminal data={terminalData} expanded={expanded} onToggleExpand={() => setExpanded((e) => !e)} />
      </div>
    </div>
  );
};
