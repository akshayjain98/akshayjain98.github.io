// Shapes of the JSON files in /content. Edit content there, not here.

export interface ProjectStat {
  label: string;
  value: string;
  note?: string;
}

export interface ContributionArea {
  area: string;
  layer?: 'Backend' | 'Frontend' | 'Full-stack';
  points: string[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  client: string;
  period: string;
  ongoing?: boolean;
  role: string;
  summary: string;
  overview: string[];
  tech: string[];
  stats?: ProjectStat[];
  statsNote?: string;
  workSplit?: { label: string; percent: number }[];
  contributions: ContributionArea[];
  achievements: string[];
}

export interface Profile {
  firstName: string;
  lastName: string;
  title: string;
  headline: string;
  location: string;
  links: { linkedin: string; github: string; stackoverflow: string; medium: string };
  summary: string;
  summaryDetail: string;
  heroStats: { value: string; label: string }[];
  story: { lead: string; paragraphs: string[]; quote: string };
  education: { degree: string; school: string; period: string; grade: string };
  achievements: string[];
}

export interface Role {
  title: string;
  period: string;
  summary: string;
  points: string[];
  keyProjects: string[];
}

export interface Experience {
  company: string;
  period: string;
  roles: Role[];
}

export type Skills = { group: string; items: string[] }[];
