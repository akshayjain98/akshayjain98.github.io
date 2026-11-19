import { getExperience, getProfile, getProjects, getSkills } from '@/lib/content';
import Image from 'next/image';
import React from 'react';
import { Terminal } from '../Terminal';
import { toTerminalData } from '../Terminal/commands';
import Tag from '../ui/Tag';

const About: React.FC = () => {
  const profile = getProfile();
  const { heroStats, headline, title, summary, summaryDetail, openTo, location, photo, firstName, lastName } = profile;
  const terminalData = toTerminalData(profile, getProjects(), getExperience(), getSkills());
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-10 sm:gap-12 lg:gap-12 xl:gap-20 py-10 sm:py-12 lg:py-14 items-center flex-1">
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
        <h1 className="text-4xl min-[400px]:text-5xl sm:text-6xl xl:text-[80px] leading-[1.05] tracking-[-0.035em] font-semibold break-words">{title}</h1>
        <div className="text-apple-muted text-[17px] leading-[1.47] grid md:grid-cols-2 gap-6 md:gap-12">
          <p>{summary}</p>
          <p>{summaryDetail}</p>
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 border-t border-apple-line pt-6">
          {heroStats.map((stat, i) => (
            <div key={stat.label} className={`flex flex-col-reverse pr-4 ${i ? 'sm:border-l sm:border-apple-line sm:pl-6' : ''}`}>
              <dt className="mt-1 text-xs sm:text-[13px] leading-snug text-apple-muted">{stat.label}</dt>
              <dd className="text-3xl xl:text-4xl font-semibold tracking-[-0.02em] text-apple-ink break-words">{stat.value}</dd>
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

      <div className={`w-full lg:w-[360px] xl:w-[420px] flex-shrink-0 flex flex-col gap-4 ${photo ? 'md:grid md:grid-cols-2 lg:flex' : ''}`}>
        {photo && (
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-apple-gray">
            <Image src={photo} alt={`${firstName} ${lastName}`} fill priority sizes="(min-width: 1280px) 420px, (min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
        <Terminal data={terminalData} />
      </div>
    </div>
  );
};

export default About;
