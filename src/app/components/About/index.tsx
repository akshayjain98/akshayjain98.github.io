import { getProfile } from '@/lib/content';
import Image from 'next/image';
import React from 'react';
import Tag from '../ui/Tag';

const About: React.FC = () => {
  const { heroStats, headline, title, summary, summaryDetail, openTo, location, photo, firstName, lastName } = getProfile();
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-10 sm:gap-12 lg:gap-12 xl:gap-20 py-10 sm:py-12 lg:py-20 items-center flex-1">
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Tag className="text-xs sm:text-sm !whitespace-normal" variant="outlined">
            {headline}
          </Tag>
          {openTo && (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-xs sm:text-sm font-semibold text-green-700">
              <span aria-hidden className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {openTo}
            </span>
          )}
        </div>
        <h1 className="text-4xl min-[400px]:text-5xl sm:text-6xl xl:text-[80px] leading-[1.05] tracking-[-0.035em] font-semibold break-words">{title}</h1>
        <div className="text-apple-muted text-[17px] leading-[1.47] grid md:grid-cols-2 gap-6 md:gap-12">
          <p>{summary}</p>
          <p>{summaryDetail}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 pt-2">
          <a href="#projects" className="btn-apple">
            View projects
          </a>
          <a href="/resume" className="btn-apple-outline">
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
        <div className="rounded-[28px] bg-black text-white p-6 sm:p-8 grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8 content-center">
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] break-words">{stat.value}</p>
              <p className="mt-2 text-sm text-[#86868b]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
