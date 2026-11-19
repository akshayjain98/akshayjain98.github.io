import { getProfile } from '@/lib/content';
import type { Profile } from '@/lib/types';
import { Heading } from '../ui/Heading';

const linkLabels: Record<keyof Profile['links'], string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  stackoverflow: 'Stack Overflow',
  medium: 'Medium',
};

export const Contact = () => {
  const { links, firstName, lastName } = getProfile();
  return (
  <div className="flex flex-col gap-10 py-20 lg:py-28">
    <Heading>Contact</Heading>
    <p className="text-3xl sm:text-5xl font-medium max-w-4xl leading-tight">
      Building something with AI, data or a demanding UI? Let&apos;s talk.
    </p>
    <ul className="flex flex-wrap gap-3">
      {(Object.keys(links) as (keyof Profile['links'])[]).map((key) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-white px-6 py-3 font-semibold transition-colors hover:bg-white hover:text-black"
          >
            {linkLabels[key]} ↗
          </a>
        </li>
      ))}
    </ul>
    <p className="text-sm text-gray-500 pt-10 border-t border-gray-800">
      © {new Date().getFullYear()} {firstName} {lastName}
    </p>
  </div>
  );
};
