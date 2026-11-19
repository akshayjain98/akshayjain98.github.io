import { getExperience, getProfile, getProjects, getSkills } from '@/lib/content';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PrintButton } from './PrintButton';

// A print-ready resume generated from /content, so it never drifts from the site.
// "Download PDF" opens the browser's print dialog (Save as PDF).

export function generateMetadata(): Metadata {
  const { firstName, lastName, title } = getProfile();
  return { title: 'Resume', description: `${firstName} ${lastName}, ${title}` };
}

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-6 mb-2 border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-widest text-gray-700 break-after-avoid">
    {children}
  </h2>
);

const MAX_ROLE_POINTS = 4;

export default function ResumePage() {
  const profile = getProfile();
  const experience = getExperience();
  const projects = getProjects();
  const skills = getSkills();
  const linkText = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-6 flex max-w-[210mm] items-center justify-between px-4 print:hidden">
        <Link href="/" className="text-sm font-semibold hover:underline">
          ← Back to portfolio
        </Link>
        <PrintButton />
      </div>

      <article className="mx-auto max-w-[210mm] bg-white px-6 py-8 text-[13px] leading-relaxed text-gray-900 shadow-lg sm:px-12 sm:py-12 print:max-w-none print:p-0 print:shadow-none">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="mt-1 text-base font-semibold text-gray-700">
            {profile.title} · {profile.headline}
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-gray-600">
            {profile.location && <span>{profile.location}</span>}
            {Object.values(profile.links).map((url) => (
              <a key={url} href={url} className="hover:underline">
                {linkText(url)}
              </a>
            ))}
          </p>
        </header>

        <H>Summary</H>
        <p>
          {profile.summary} {profile.summaryDetail}
        </p>

        <H>Skills</H>
        <ul className="grid gap-1 sm:grid-cols-2 print:grid-cols-2">
          {skills.map((s) => (
            <li key={s.group}>
              <span className="font-semibold">{s.group}:</span> {s.items.join(', ')}
            </li>
          ))}
        </ul>

        <H>Experience</H>
        {experience.map((e) => (
          <section key={e.company} className="mb-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-bold">
                {e.company} <span className="font-normal text-gray-500">({e.type})</span>
              </h3>
              <span className="text-gray-600">{e.period}</span>
            </div>
            {e.roles.map((r) => (
              <div key={r.title} className="mt-2 break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{r.title}</p>
                  <span className="text-gray-600">{r.period}</span>
                </div>
                <ul className="mt-1 list-disc pl-5">
                  {r.points.slice(0, MAX_ROLE_POINTS).map((p) => (
                    <li key={p.slice(0, 40)}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}

        <H>Projects</H>
        {projects.map((p) => (
          <section key={p.slug} className="mb-3 break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-bold">
                {p.title} <span className="font-normal text-gray-500">· {p.role}</span>
              </h3>
              <span className="text-gray-600">
                {p.period}
                {p.engagement !== 'Full-time' && ' · Part-time'}
              </span>
            </div>
            <p>{p.summary}</p>
            <p className="text-gray-600">
              <span className="font-semibold">Tech:</span> {p.tech.join(', ')}
            </p>
          </section>
        ))}

        <H>Education</H>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p>
            <span className="font-semibold">{profile.education.degree}</span>, {profile.education.school} · {profile.education.grade}
          </p>
          <span className="text-gray-600">{profile.education.period}</span>
        </div>

        <H>Achievements</H>
        <ul className="list-disc pl-5">
          {profile.achievements.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </article>
    </div>
  );
}
