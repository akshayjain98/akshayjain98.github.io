import { getExperience, getProfile, getSkills } from '@/lib/content';
import { Heading } from '../ui/Heading';
import Tag from '../ui/Tag';

export const Experience = () => {
  const experience = getExperience();
  return (
  <div className="flex flex-col gap-10 py-20 lg:py-28">
    <Heading>Experience</Heading>
    <div className="flex flex-col gap-2">
      <h3 className="text-3xl sm:text-4xl font-bold">{experience.company}</h3>
      <p className="text-gray-400">
        {experience.period} · {experience.roles.length} roles, from intern to technical lead
      </p>
    </div>

    <ol className="relative flex flex-col gap-12 border-l border-gray-700 ml-2 pl-6 sm:pl-10">
      {experience.roles.map((role, i) => (
        <li key={role.period} className="relative">
          <span
            aria-hidden
            className={`absolute -left-[31px] sm:-left-[47px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-black ${
              i === 0 ? 'bg-green-500' : 'bg-white'
            }`}
          />
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
        </li>
      ))}
    </ol>
  </div>
  );
};

export const Skills = () => {
  const skills = getSkills();
  const { achievements } = getProfile();
  return (
  <div className="flex flex-col gap-10 py-20 lg:py-28">
    <Heading>Skills</Heading>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((s) => (
        <div key={s.group} className="rounded-3xl bg-gray-100 p-6 flex flex-col gap-4">
          <h3 className="font-semibold">{s.group}</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {s.items.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
        </div>
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
