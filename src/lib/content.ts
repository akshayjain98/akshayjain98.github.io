import fs from 'node:fs';
import path from 'node:path';
import type { Experience, Profile, Project, Skills } from './types';

// Reads the portfolio content from /content at build time.
// A missing or misspelled field fails the build with the file name, instead of rendering a broken page.

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readJson(file: string): Record<string, unknown> {
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

export function getProfile(): Profile {
  const data = readJson('profile.json');
  requireFields('profile.json', data, ['firstName', 'lastName', 'title', 'summary', 'links', 'heroStats', 'story', 'education', 'achievements']);
  return data as unknown as Profile;
}

export function getExperience(): Experience {
  const data = readJson('experience.json');
  requireFields('experience.json', data, ['company', 'period', 'roles']);
  (data.roles as Record<string, unknown>[]).forEach((r, i) =>
    requireFields(`experience.json (roles[${i}])`, r, ['title', 'period', 'summary', 'points', 'keyProjects']),
  );
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
      requireFields(file, data, ['slug', 'title', 'tagline', 'client', 'period', 'role', 'summary', 'overview', 'tech', 'contributions', 'achievements']);
      return data as unknown as Project;
    });
}
