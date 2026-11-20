import fs from 'node:fs';
import path from 'node:path';
import type { Experience, GraphEdge, GraphNode, JourneyGraph, Profile, Project, Skills } from './types';

// Reads the portfolio content from /content at build time.
// A missing or misspelled field fails the build with the file name, instead of rendering a broken page.

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readJson(file: string): Record<string, unknown> {
  // JSON files may hold an object or a list; callers cast to the expected shape.
  const full = path.join(CONTENT_DIR, file);
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (err) {
    throw new Error(`content/${file}: could not read or parse JSON (${(err as Error).message})`);
  }
}

function requireFields(file: string, obj: Record<string, unknown>, fields: string[]) {
  const missing = fields.filter((f) => obj[f] === undefined || obj[f] === '');
  if (missing.length) throw new Error(`content/${file}: missing required field(s): ${missing.join(', ')}`);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Whole years since the earliest start date in experience.json (e.g. "Dec 2019 – Present"),
 * counting the start month and the current month. Evaluated at build time.
 */
export function getYearsOfExperience(now = new Date()): number {
  const starts = getExperience().map((e, i) => parsePeriod(e.period, `experience.json [${i}]`, now).start);
  const months = toMonth(now) - Math.min(...starts) + 1;
  return Math.floor(months / 12);
}

const toMonth = (d: Date) => d.getFullYear() * 12 + d.getMonth();

function parseMonth(text: string, where: string, full: string): number {
  const m = /^([A-Za-z]{3})\w*\s+(\d{4})$/.exec(text.trim());
  const month = m ? MONTHS.indexOf(m[1]) : -1;
  if (!m || month < 0) throw new Error(`content/${where}: period must look like "Mon YYYY – Mon YYYY|Present", got "${full}"`);
  return Number(m[2]) * 12 + month;
}

/** "Dec 2019 – Present" → absolute month indexes (year*12+month), both ends inclusive. */
export function parsePeriod(period: string, where: string, now = new Date()): { start: number; end: number } {
  const [from, to] = period.split(/\s+[–—-]\s+/);
  const start = parseMonth(from ?? '', where, period);
  const end = !to || /present/i.test(to) ? toMonth(now) : parseMonth(to, where, period);
  return { start, end };
}

const overlap = (a: { start: number; end: number }, b: { start: number; end: number }) =>
  Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start) + 1);

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

/** Short tech name for grouping: "Django / DRF" → "Django", "GraphQL (Apollo Client)" → "GraphQL". */
const normalizeTech = (t: string) => t.replace(/\s*\(.*?\)\s*/g, '').split(' / ')[0].replace(/\s+\d+$/, '').trim();

/**
 * Experience as a layered network: Years → Roles → Projects → Tech.
 * Edge weights are overlapping months (tech edges are 1). Computed at build time.
 */
export function getJourneyGraph(now = new Date(), maxTech = 12): JourneyGraph {
  const experience = getExperience();
  const projects = getProjects();

  const roles = experience.flatMap((e, i) =>
    e.roles.map((r, j) => ({
      id: `role-${i}-${j}`,
      label: r.title.split(' | ')[0],
      freelance: e.type === 'Part-time',
      current: /present/i.test(r.period),
      span: parsePeriod(r.period, `experience.json [${i}].roles[${j}]`, now),
      period: r.period,
    })),
  );
  // Oldest first, so the network reads chronologically top → bottom.
  roles.sort((a, b) => a.span.start - b.span.start || Number(a.freelance) - Number(b.freelance));

  const projs = projects
    .map((p) => ({ p, span: parsePeriod(p.period, `projects/${p.slug}`, now) }))
    .sort((a, b) => a.span.start - b.span.start);

  const firstYear = Math.floor(Math.min(...roles.map((r) => r.span.start)) / 12);
  const lastYear = now.getFullYear();
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, k) => firstYear + k);
  const yearSpan = (y: number) => ({ start: y * 12, end: y * 12 + 11 });

  const edges: GraphEdge[] = [];

  const yearNodes: GraphNode[] = years.map((y) => {
    const months = new Set<number>();
    roles.forEach((r) => {
      for (let m = Math.max(r.span.start, y * 12); m <= Math.min(r.span.end, y * 12 + 11); m++) months.add(m);
    });
    return { id: `year-${y}`, layer: 'year', label: String(y), sublabel: `${plural(months.size, 'month')} worked`, weight: months.size };
  });

  const roleNodes: GraphNode[] = roles.map((r) => {
    const months = r.span.end - r.span.start + 1;
    years.forEach((y) => {
      const w = overlap(r.span, yearSpan(y));
      if (w) edges.push({ from: `year-${y}`, to: r.id, weight: w });
    });
    return { id: r.id, layer: 'role', label: r.label, sublabel: `${r.period} · ${plural(months, 'month')}`, weight: months, current: r.current };
  });

  const projectNodes: GraphNode[] = projs.map(({ p, span }) => {
    const freelance = p.engagement.includes('Freelance');
    roles
      .filter((r) => r.freelance === freelance)
      .forEach((r) => {
        const w = overlap(r.span, span);
        if (w) edges.push({ from: r.id, to: p.slug, weight: w });
      });
    const months = span.end - span.start + 1;
    return { id: p.slug, layer: 'project', label: p.title, sublabel: `${p.period} · ${plural(months, 'month')}`, weight: months, current: p.ongoing };
  });

  const techCount = new Map<string, Set<string>>();
  projs.forEach(({ p }) =>
    p.tech.forEach((t) => {
      const name = normalizeTech(t);
      if (!name) return;
      if (!techCount.has(name)) techCount.set(name, new Set());
      techCount.get(name)!.add(p.slug);
    }),
  );
  const topTech = [...techCount.entries()]
    .filter(([, s]) => s.size >= 2)
    .sort((a, b) => b[1].size - a[1].size || a[0].localeCompare(b[0]))
    .slice(0, maxTech);
  const techNodes: GraphNode[] = topTech.map(([name, slugs]) => {
    const id = `tech-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    slugs.forEach((slug) => edges.push({ from: slug, to: id, weight: 1 }));
    return { id, layer: 'tech', label: name, sublabel: `Used in ${plural(slugs.size, 'project')}`, weight: slugs.size };
  });

  return { layers: [yearNodes, roleNodes, projectNodes, techNodes], edges };
}

export function getProfile(): Profile {
  // "{years}" anywhere in profile.json is replaced with the computed years of experience.
  const years = String(getYearsOfExperience());
  const data = JSON.parse(JSON.stringify(readJson('profile.json')).replaceAll('{years}', years));
  requireFields('profile.json', data, ['firstName', 'lastName', 'title', 'summary', 'links', 'heroStats', 'story', 'education', 'achievements']);
  return data as unknown as Profile;
}

export function getExperience(): Experience {
  const data = readJson('experience.json') as unknown as Record<string, unknown>[];
  if (!Array.isArray(data)) throw new Error('content/experience.json: expected a list of employers');
  data.forEach((e, i) => {
    requireFields(`experience.json [${i}]`, e, ['company', 'type', 'period', 'roles']);
    (e.roles as Record<string, unknown>[]).forEach((r, j) =>
      requireFields(`experience.json [${i}].roles[${j}]`, r, ['title', 'period', 'summary', 'points', 'keyProjects']),
    );
  });
  return data as unknown as Experience;
}

export function getSkills(): Skills {
  return readJson('skills.json') as unknown as Skills;
}

/** One file per project in content/projects. Files are shown in filename order (01-, 02-, ...). */
export function getProjects(): Project[] {
  const dir = path.join(CONTENT_DIR, 'projects');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => {
      const file = `projects/${f}`;
      const data = readJson(file);
      requireFields(file, data, ['slug', 'title', 'tagline', 'client', 'period', 'engagement', 'categories', 'role', 'summary', 'overview', 'tech', 'contributions', 'achievements']);
      return data as unknown as Project;
    });
}
