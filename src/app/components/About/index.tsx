import { getProfile } from '@/lib/content';
import Image from 'next/image';
import React from 'react';
import Tag from '../ui/Tag';

const About: React.FC = () => {
  const { heroStats, headline, title, summary, summaryDetail, openTo, location, photo, firstName, lastName } = getProfile();
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20 py-12 lg:py-20 items-center flex-1">
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Tag className="uppercase text-xs sm:text-sm" variant="outlined">
            {headline}
          </Tag>
          {openTo && (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-xs sm:text-sm font-semibold text-green-700">
              <span aria-hidden className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {openTo}
            </span>
          )}
        </div>
        <h1 className="text-5xl sm:text-7xl xl:text-[96px] leading-[1.02] tracking-tight uppercase font-semibold">{title}</h1>
        <div className="text-gray-600 grid md:grid-cols-2 gap-6 md:gap-12">
          <p>{summary}</p>
          <p>{summaryDetail}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a href="#projects" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">
            View projects
          </a>
          <a href="/resume" className="rounded-full border border-black px-6 py-3 text-sm font-semibold hover:bg-black hover:text-white">
            Download resume
          </a>
          {location && <span className="text-sm text-gray-500">Based in {location}</span>}
        </div>
      </div>

      <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-4">
        {photo && (
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gray-200">
            <Image src={photo} alt={`${firstName} ${lastName}`} fill priority sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="rounded-3xl bg-black text-white p-8 grid grid-cols-2 gap-x-6 gap-y-8">
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl sm:text-5xl font-semibold">{stat.value}</p>
              <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
