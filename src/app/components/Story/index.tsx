import { getProfile } from '@/lib/content';
import { Heading } from '../ui/Heading';

export const Story = () => {
  const { education, links, story } = getProfile();
  return (
    <div className="flex flex-col gap-12 sm:gap-16 py-16 sm:py-20 lg:py-28">
      <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 xl:gap-32">
        <div className="lg:w-80 xl:w-96 flex-shrink-0 flex flex-col gap-8">
          <p className="text-2xl sm:text-[28px] font-semibold leading-[1.14] tracking-[-0.02em]">{story.lead}</p>
          <div className="rounded-[28px] bg-[#1d1d1f] p-6 sm:p-7 flex flex-col gap-2">
            <p className="text-sm font-semibold text-[#86868b]">Education</p>
            <p className="text-lg font-semibold">{education.degree}</p>
            <p className="text-gray-400">{education.school}</p>
            <p className="text-gray-400">{education.period}</p>
            <p className="mt-2 text-white">{education.grade}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <Heading>My Story</Heading>
          <div className="text-[#a1a1a6] text-[17px] leading-[1.47] flex gap-6 flex-col">
            {story.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-apple w-fit"
            >
              View my LinkedIn profile
            </a>
          </div>
        </div>
      </div>
      <blockquote className="text-2xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-[-0.025em] text-center max-w-4xl mx-auto bg-gradient-to-r from-white via-white to-[#86868b] bg-clip-text text-transparent">“{story.quote}”</blockquote>
    </div>
  );
};
