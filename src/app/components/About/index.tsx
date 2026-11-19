import { getProfile } from '@/lib/content';
import React from 'react';
import Tag from '../ui/Tag';

const About: React.FC = () => {
  const { heroStats, headline, title, summary, summaryDetail } = getProfile();
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 py-12 lg:py-20 items-center flex-1">
      <div className="flex-1 flex flex-col justify-center gap-6">
        <Tag className="uppercase text-sm sm:text-base self-start" variant="outlined">
          {headline}
        </Tag>
        <h1 className="text-5xl sm:text-7xl xl:text-[96px] leading-[1.05] tracking-wide uppercase font-medium">
          {title}
        </h1>
        <div className="text-gray-500 grid md:grid-cols-2 gap-6 md:gap-12">
          <p>{summary}</p>
          <p>{summaryDetail}</p>
        </div>
      </div>

      <div className="w-full lg:w-[420px] flex-shrink-0">
        <div className="rounded-3xl bg-black text-white p-8 grid grid-cols-2 gap-x-6 gap-y-10">
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
