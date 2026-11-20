import type { Experience, Profile, Project, Skills } from '@/lib/types';

// The hero terminal's commands. Pure functions over build-time content: no network, works on any static host.

export interface TerminalData {
  profile: Pick<Profile, 'firstName' | 'lastName' | 'title' | 'headline' | 'location' | 'openTo' | 'summary' | 'links' | 'heroStats' | 'education' | 'achievements'>;
  projects: Pick<Project, 'slug' | 'title' | 'client' | 'tagline' | 'period' | 'role' | 'tech' | 'achievements'>[];
  experience: { company: string; period: string; roles: { title: string; period: string }[] }[];
  skills: Skills;
}

export function toTerminalData(profile: Profile, projects: Project[], experience: Experience, skills: Skills): TerminalData {
  const { firstName, lastName, title, headline, location, openTo, summary, links, heroStats, education, achievements } = profile;
  return {
    profile: { firstName, lastName, title, headline, location, openTo, summary, links, heroStats, education, achievements },
    projects: projects.map(({ slug, title, client, tagline, period, role, tech, achievements }) => ({ slug, title, client, tagline, period, role, tech, achievements })),
    experience: experience.map((e) => ({ company: e.company, period: e.period, roles: e.roles.map((r) => ({ title: r.title, period: r.period })) })),
    skills,
  };
}

export type Tone = 'default' | 'muted' | 'accent' | 'error' | 'success';
export interface Line {
  text: string;
  tone?: Tone;
  href?: string;
  /** Indent level, for nested lists. */
  indent?: number;
}
export type Effect = { type: 'clear' } | { type: 'scroll'; id: string };
export interface Result {
  lines: Line[];
  effect?: Effect;
}

export const SECTIONS = ['top', 'story', 'projects', 'experience', 'journey', 'skills', 'contact'] as const;

export interface CommandSpec {
  name: string;
  args?: string;
  description: string;
  /** Values offered as suggestions after "/name ". */
  argValues?: (d: TerminalData) => { value: string; hint?: string }[];
}

export const COMMANDS: CommandSpec[] = [
  { name: 'help', description: 'List all commands' },
  { name: 'about', description: 'Who I am, in short' },
  { name: 'stats', description: 'Numbers at a glance' },
  { name: 'projects', description: 'All projects' },
  {
    name: 'project',
    args: '<name|#>',
    description: 'Details of one project',
    argValues: (d) => d.projects.map((p, i) => ({ value: p.slug, hint: `${i + 1}. ${p.title}` })),
  },
  { name: 'experience', description: 'Work timeline' },
  {
    name: 'skills',
    args: '[group]',
    description: 'Tech stack, optionally one group',
    argValues: (d) => d.skills.map((s) => ({ value: slugify(s.group), hint: s.group })),
  },
  { name: 'education', description: 'Degree and school' },
  { name: 'achievements', description: 'Awards and recognition' },
  { name: 'contact', description: 'Where to reach me' },
  { name: 'resume', description: 'Open the printable resume' },
  {
    name: 'goto',
    args: '<section>',
    description: 'Scroll to a section of this page',
    argValues: () => SECTIONS.map((s) => ({ value: s })),
  },
  { name: 'clear', description: 'Clear the terminal' },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const blank: Line = { text: '' };

export function run(input: string, d: TerminalData): Result {
  const [rawName = '', ...rest] = input.trim().replace(/^\//, '').split(/\s+/);
  const name = rawName.toLowerCase();
  const arg = rest.join(' ').trim();
  const p = d.profile;

  switch (name) {
    case '':
      return { lines: [] };

    case 'help':
      return {
        lines: [
          { text: 'Available commands:', tone: 'muted' },
          ...COMMANDS.map((c) => ({ text: `/${c.name}${c.args ? ' ' + c.args : ''}  ·  ${c.description}`, indent: 1 })),
          blank,
          { text: 'Tip: Tab completes, ↑/↓ moves through suggestions and history.', tone: 'muted' },
        ],
      };

    case 'about':
    case 'whoami':
      return {
        lines: [
          { text: `${p.firstName} ${p.lastName}`, tone: 'accent' },
          { text: p.title },
          { text: p.headline, tone: 'muted' },
          blank,
          { text: p.summary },
          ...(p.location ? [blank, { text: `📍 ${p.location}`, tone: 'muted' as Tone }] : []),
          ...(p.openTo ? [{ text: `● ${p.openTo}`, tone: 'success' as Tone }] : []),
        ],
      };

    case 'stats':
      return { lines: p.heroStats.map((s) => ({ text: `${s.value.padEnd(7)} ${s.label}` })) };

    case 'projects':
      return {
        lines: [
          ...d.projects.flatMap((pr, i) => [
            { text: `${i + 1}. ${pr.title}`, tone: 'accent' as Tone },
            { text: `${pr.client} · ${pr.tagline}`, tone: 'muted' as Tone, indent: 1 },
          ]),
          blank,
          { text: 'Run /project <#> for details, e.g. /project 1', tone: 'muted' },
        ],
      };

    case 'project': {
      if (!arg) return { lines: [{ text: 'Usage: /project <name|#>. Try /projects to list them.', tone: 'error' }] };
      const q = arg.toLowerCase();
      const idx = Number(q);
      const pr =
        (Number.isInteger(idx) && d.projects[idx - 1]) ||
        d.projects.find((x) => x.slug === q) ||
        d.projects.find((x) => x.slug.includes(q) || x.title.toLowerCase().includes(q));
      if (!pr) return { lines: [{ text: `No project matches "${arg}". Try /projects.`, tone: 'error' }] };
      return {
        lines: [
          { text: pr.title, tone: 'accent' },
          { text: `${pr.client} · ${pr.period}`, tone: 'muted' },
          { text: `Role: ${pr.role}` },
          { text: `Tech: ${pr.tech.join(', ')}` },
          blank,
          ...pr.achievements.slice(0, 3).map((a) => ({ text: `• ${a}`, indent: 1 })),
          blank,
          { text: '→ Open full case study', href: `#project=${pr.slug}` },
        ],
      };
    }

    case 'experience':
      return {
        lines: d.experience.flatMap((e) => [
          { text: e.company, tone: 'accent' as Tone },
          { text: e.period, tone: 'muted' as Tone },
          ...e.roles.map((r) => ({ text: `• ${r.title} (${r.period})`, indent: 1 })),
          blank,
        ]),
      };

    case 'skills': {
      const groups = arg ? d.skills.filter((s) => slugify(s.group).includes(slugify(arg))) : d.skills;
      if (!groups.length) return { lines: [{ text: `No skill group "${arg}". Groups: ${d.skills.map((s) => slugify(s.group)).join(', ')}`, tone: 'error' }] };
      return {
        lines: groups.flatMap((s) => [
          { text: s.group, tone: 'accent' as Tone },
          { text: s.items.join(' · '), indent: 1 },
        ]),
      };
    }

    case 'education': {
      const e = p.education;
      return { lines: [{ text: e.degree, tone: 'accent' }, { text: e.school }, { text: `${e.period} · ${e.grade}`, tone: 'muted' }] };
    }

    case 'achievements':
      return { lines: p.achievements.map((a) => ({ text: `🏆 ${a}` })) };

    case 'contact': {
      const l = p.links;
      return {
        lines: [
          { text: 'LinkedIn', tone: 'muted' },
          { text: l.linkedin, href: l.linkedin, indent: 1 },
          { text: 'GitHub', tone: 'muted' },
          { text: l.github, href: l.github, indent: 1 },
          { text: 'Stack Overflow', tone: 'muted' },
          { text: l.stackoverflow, href: l.stackoverflow, indent: 1 },
          { text: 'Medium', tone: 'muted' },
          { text: l.medium, href: l.medium, indent: 1 },
        ],
      };
    }

    case 'resume':
      return { lines: [{ text: '→ Open resume (print or save as PDF)', href: '/resume/' }] };

    case 'goto': {
      const id = SECTIONS.find((s) => s === arg.toLowerCase());
      if (!id) return { lines: [{ text: `Usage: /goto <${SECTIONS.join('|')}>`, tone: 'error' }] };
      return { lines: [{ text: `Scrolling to #${id}…`, tone: 'muted' }], effect: { type: 'scroll', id } };
    }

    case 'clear':
    case 'cls':
      return { lines: [], effect: { type: 'clear' } };

    default:
      return { lines: [{ text: `command not found: ${rawName}. Try /help`, tone: 'error' }] };
  }
}

/** Suggestions for the current input: command names, or argument values once a command is typed. */
export function suggest(input: string, d: TerminalData): { value: string; label: string; hint?: string }[] {
  if (!input.startsWith('/')) return [];
  const body = input.slice(1);
  const space = body.indexOf(' ');

  if (space === -1) {
    const q = body.toLowerCase();
    const prefix = COMMANDS.filter((c) => c.name.startsWith(q));
    const contains = COMMANDS.filter((c) => !c.name.startsWith(q) && c.name.includes(q));
    return [...prefix, ...contains].map((c) => ({
      value: `/${c.name}${c.args ? ' ' : ''}`,
      label: `/${c.name}${c.args ? ' ' + c.args : ''}`,
      hint: c.description,
    }));
  }

  const cmd = COMMANDS.find((c) => c.name === body.slice(0, space).toLowerCase());
  if (!cmd?.argValues) return [];
  const q = body.slice(space + 1).toLowerCase();
  return cmd
    .argValues(d)
    .filter((v) => v.value.includes(q) || v.hint?.toLowerCase().includes(q))
    .filter((v) => v.value !== q)
    .sort((a, b) => Number(!a.value.startsWith(q)) - Number(!b.value.startsWith(q)))
    .map((v) => ({ value: `/${cmd.name} ${v.value}`, label: v.value, hint: v.hint }));
}
