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
  <div className="flex flex-col gap-8 sm:gap-10 py-16 sm:py-20 lg:py-28">
    <Heading>Contact</Heading>
    <p className="headline-apple max-w-4xl">
      Building something with AI, data or a demanding UI? Let&apos;s talk.
    </p>
    <ul className="flex flex-wrap gap-3">
      {(Object.keys(links) as (keyof Profile['links'])[]).map((key) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-apple-glass"
          >
            {linkLabels[key]} ↗
          </a>
        </li>
      ))}
    </ul>
    <p className="text-xs text-[#86868b] pt-8 border-t border-white/15">
      © {new Date().getFullYear()} {firstName} {lastName}
    </p>
  </div>
  );
};
