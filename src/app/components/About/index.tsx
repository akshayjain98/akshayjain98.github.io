import { getExperience, getProfile, getProjects, getSkills } from '@/lib/content';
import Image from 'next/image';
import React from 'react';
import { toTerminalData } from '../Terminal/commands';
import Tag from '../ui/Tag';
import { HeroLayout } from './HeroLayout';

const About: React.FC = () => {
  const profile = getProfile();
  const { heroStats, headline, title, summary, summaryDetail, openTo, location, photo, firstName, lastName } = profile;
  const terminalData = toTerminalData(profile, getProjects(), getExperience(), getSkills());
  // `group-data-[expanded=true]:` classes condense this column on desktop while the terminal is expanded.
  const left = (
    <div className="flex-1 min-w-0 flex flex-col justify-center gap-6 lg:gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Tag className="!whitespace-normal" variant="outlined">
          {headline}
        </Tag>
        {openTo && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            {openTo}
          </span>
        )}
      </div>
      <h1 className="text-4xl min-[400px]:text-5xl sm:text-6xl xl:text-[80px] group-data-[expanded=true]:lg:text-5xl group-data-[expanded=true]:xl:text-6xl leading-[1.05] tracking-[-0.035em] font-semibold break-words">
        {title}
      </h1>
      <div className="text-apple-muted text-[17px] leading-[1.47] grid md:grid-cols-2 group-data-[expanded=true]:lg:grid-cols-1 gap-6 md:gap-12">
        <p>{summary}</p>
        <p className="group-data-[expanded=true]:lg:hidden">{summaryDetail}</p>
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-4 group-data-[expanded=true]:lg:grid-cols-2 gap-y-6 border-t border-apple-line pt-6">
        {heroStats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col-reverse pr-4 ${i ? 'sm:border-l sm:border-apple-line sm:pl-6' : ''} ${i % 2 === 0 ? 'group-data-[expanded=true]:lg:border-l-0 group-data-[expanded=true]:lg:pl-0' : ''}`}
          >
            <dt className="mt-1 text-xs sm:text-[13px] leading-snug text-apple-muted">{stat.label}</dt>
            <dd className="text-3xl xl:text-4xl group-data-[expanded=true]:xl:text-3xl font-semibold tracking-[-0.02em] text-apple-ink break-words">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 pt-2">
        <a href="#projects" className="btn-apple">
          View projects
        </a>
        <a href="/resume/" className="btn-apple-outline">
          Download resume
        </a>
        {location && <span className="text-sm text-apple-muted">Based in {location}</span>}
      </div>
    </div>
  );
  const photoEl = photo ? (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-apple-gray">
      <Image src={photo} alt={`${firstName} ${lastName}`} fill priority sizes="(min-width: 1280px) 420px, (min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
    </div>
  ) : null;
  return <HeroLayout left={left} photo={photoEl} terminalData={terminalData} />;
};

export default About;
