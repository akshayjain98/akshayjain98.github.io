'use client';

import React, { useState } from 'react';
import { Terminal } from '../Terminal';
import type { TerminalData } from '../Terminal/commands';

// Owns the terminal's expanded state. The text columns react through `group-data-[expanded=true]:` classes,
// so they can stay server-rendered markup passed in as `intro` / `details`.
//
// Order is CSS-only, so the DOM (and what screen readers / crawlers see) stays: intro → details → photo → terminal.
//   Phone:   intro → terminal → details → photo
//   Tablet:  intro → terminal (full width) → details | photo
//   Desktop: [intro + details] | [photo + terminal]
// Below lg the two column wrappers are `display: contents`, so their children join the outer grid directly.
export const HeroLayout: React.FC<{
  intro: React.ReactNode;
  details: React.ReactNode;
  photo?: React.ReactNode;
  terminalData: TerminalData;
}> = ({ intro, details, photo, terminalData }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      data-expanded={expanded}
      className={`group grid grid-cols-1 content-start gap-6 sm:gap-8 ${photo ? 'md:grid-cols-[minmax(0,1fr)_280px] md:gap-x-10' : ''} lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-12 xl:gap-20 data-[expanded=true]:xl:gap-12 py-6 sm:py-10 lg:py-14 flex-1`}
    >
      <div className="contents lg:flex lg:flex-1 lg:min-w-0 lg:flex-col lg:justify-center lg:gap-5">
        <div className="order-1 md:col-span-2 lg:order-none">{intro}</div>
        <div className={`order-3 lg:order-none ${photo ? '' : 'md:col-span-2'}`}>{details}</div>
      </div>
      <div
        className={`contents lg:flex lg:flex-col lg:gap-4 lg:flex-shrink-0 ${expanded ? 'lg:w-[560px] xl:w-[680px]' : 'lg:w-[360px] xl:w-[420px]'} motion-safe:lg:transition-[width] motion-safe:lg:duration-300 motion-safe:lg:ease-out`}
      >
        {photo && <div className="order-4 lg:order-none">{photo}</div>}
        <div className="order-2 min-w-0 md:col-span-2 lg:order-none">
          <Terminal data={terminalData} expanded={expanded} onToggleExpand={() => setExpanded((e) => !e)} />
        </div>
      </div>
    </div>
  );
};
