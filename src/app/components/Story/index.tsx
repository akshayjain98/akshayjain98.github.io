import { getProfile } from '@/lib/content';
import { Heading } from '../ui/Heading';

export const Story = () => {
  const { education, links, story } = getProfile();
  return (
    <div className="flex flex-col gap-16 py-20 lg:py-28">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-32">
        <div className="lg:w-96 flex flex-col gap-8">
          <p className="text-2xl">{story.lead}</p>
          <div className="rounded-3xl border border-gray-700 p-6 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wide text-gray-400">Education</p>
            <p className="text-lg font-semibold">{education.degree}</p>
            <p className="text-gray-400">{education.school}</p>
            <p className="text-gray-400">{education.period}</p>
            <p className="mt-2 text-white">{education.grade}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <Heading>My Story</Heading>
          <div className="text-gray-400 flex gap-6 flex-col">
            {story.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-full font-semibold text-sm px-6 py-2 border border-white text-white transition-colors hover:bg-white hover:text-black"
            >
              View my LinkedIn profile
            </a>
          </div>
        </div>
      </div>
      <blockquote className="text-2xl sm:text-4xl text-center max-w-4xl mx-auto">“{story.quote}”</blockquote>
    </div>
  );
};
