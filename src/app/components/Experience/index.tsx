import { getExperience, getProfile, getSkills } from '@/lib/content';
import type { Employer } from '@/lib/types';
import { Heading } from '../ui/Heading';
import { Reveal } from '../ui/Reveal';
import Tag from '../ui/Tag';

const EmployerBlock = ({ employer, current }: { employer: Employer; current: boolean }) => (
  <div className="flex flex-col gap-8">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h3 className="text-3xl sm:text-4xl font-bold">{employer.company}</h3>
        <p className="mt-2 text-gray-400">
          {employer.period}
          {employer.roles.length > 1 && ` · ${employer.roles.length} roles`}
        </p>
      </div>
      <span
        className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
          employer.type === 'Full-time' ? 'bg-white text-black' : 'bg-amber-400/20 text-amber-300'
        }`}
      >
        {employer.type}
      </span>
    </div>

    <ol className="relative flex flex-col gap-12 border-l border-gray-700 ml-2 pl-6 sm:pl-10">
      {employer.roles.map((role, i) => (
        <li key={role.period + role.title} className="relative">
          <span
            aria-hidden
            className={`absolute -left-[31px] sm:-left-[47px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-black ${
              current && i === 0 ? 'bg-green-500' : 'bg-white'
            }`}
          />
          <Reveal>
            <div className="grid md:grid-cols-[1fr_3fr] gap-4 md:gap-8">
              <p className="text-sm font-semibold">{role.period}</p>
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold">{role.title}</h4>
                  <p className="mt-2 text-gray-300">{role.summary}</p>
                </div>
                <ul className="list-disc pl-5 flex flex-col gap-1.5 text-gray-400">
                  {role.points.map((p) => (
                    <li key={p.slice(0, 40)}>{p}</li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Key projects</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {role.keyProjects.map((kp) => (
                      <Tag key={kp} theme="dark">
                        {kp}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  </div>
);

export const Experience = () => {
  const employers = getExperience();
  return (
    <div className="flex flex-col gap-10 py-20 lg:py-28">
      <div className="flex flex-col gap-3">
        <Heading>Experience</Heading>
        <p className="text-3xl sm:text-4xl font-semibold max-w-2xl leading-tight">
          From intern to technical lead, plus part-time freelance work.
        </p>
      </div>
      <div className="flex flex-col gap-20">
        {employers.map((e, i) => (
          <EmployerBlock key={e.company} employer={e} current={i === 0} />
        ))}
      </div>
    </div>
  );
};

export const Skills = () => {
  const skills = getSkills();
  const { achievements } = getProfile();
  return (
    <div className="flex flex-col gap-10 py-20 lg:py-28">
      <Heading>Skills</Heading>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((s, i) => (
          <Reveal key={s.group} delay={(i % 4) * 0.05} className="h-full">
            <div className="h-full rounded-3xl bg-gray-100 p-6 flex flex-col gap-4">
              <h3 className="font-semibold">{s.group}</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                {s.items.map((item) => (
                  <Tag key={item} className="!whitespace-normal">
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="flex flex-col gap-4 pt-6">
        <Heading>Achievements</Heading>
        <ul className="grid md:grid-cols-3 gap-6">
          {achievements.map((a) => (
            <li key={a} className="rounded-3xl bg-black text-white p-6">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
