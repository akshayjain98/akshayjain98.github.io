import fs from 'node:fs';
import path from 'node:path';
import type { Experience, Profile, Project, Skills } from './types';

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
  const starts = getExperience().map((e, i) => {
    const m = /^([A-Za-z]{3})\w*\s+(\d{4})/.exec(e.period);
    const month = m ? MONTHS.indexOf(m[1]) : -1;
    if (!m || month < 0) throw new Error(`content/experience.json [${i}]: period must start with "Mon YYYY", got "${e.period}"`);
    return Number(m[2]) * 12 + month;
  });
  const months = now.getFullYear() * 12 + now.getMonth() - Math.min(...starts) + 1;
  return Math.floor(months / 12);
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
