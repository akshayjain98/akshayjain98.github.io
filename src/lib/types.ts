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

export type ProjectCategory = 'AI' | 'Full-stack' | 'Backend' | 'Frontend' | 'Data';

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  client: string;
  period: string;
  engagement: 'Full-time' | 'Part-time · Freelance' | 'Hourly · Freelance';
  categories: ProjectCategory[];
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
  /** Path under /public, e.g. "/profile.jpg". Empty = show the stats card only. */
  photo?: string;
  /** Short availability line shown in the hero. Empty = hidden. */
  openTo?: string;
  /** Public URL of the deployed site, used for link previews. */
  siteUrl?: string;
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

export interface Employer {
  company: string;
  type: 'Full-time' | 'Part-time';
  period: string;
  roles: Role[];
}

export type Experience = Employer[];

export type Skills = { group: string; items: string[] }[];

// Derived at build time from experience.json + projects (see getJourneyGraph).
export type GraphLayer = 'year' | 'role' | 'project' | 'tech';

export interface GraphNode {
  id: string;
  layer: GraphLayer;
  label: string;
  sublabel: string;
  /** Relative size: months for years/roles/projects, project count for tech. */
  weight: number;
  current?: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

export interface JourneyGraph {
  layers: GraphNode[][];
  edges: GraphEdge[];
}
