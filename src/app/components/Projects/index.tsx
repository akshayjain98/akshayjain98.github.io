'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Project, ProjectCategory } from '@/lib/types';
import { Heading } from '../ui/Heading';
import Tag from '../ui/Tag';

const MAX_CARD_TECH = 5;
const FILTERS: ('All' | ProjectCategory)[] = ['All', 'AI', 'Full-stack', 'Backend', 'Frontend', 'Data'];
const HASH_PREFIX = '#project=';

const EngagementBadge: React.FC<{ engagement: Project['engagement']; dark?: boolean }> = ({ engagement, dark }) => {
  const freelance = engagement !== 'Full-time';
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
        freelance
          ? 'bg-amber-400/20 text-amber-700'
          : dark
            ? 'bg-white/10 text-gray-200'
            : 'bg-apple-gray text-apple-muted'
      } ${freelance && dark ? '!text-amber-300' : ''}`}
    >
      {engagement}
    </span>
  );
};

const ProjectCard: React.FC<{ project: Project; dark: boolean; onOpen: () => void }> = ({ project, dark, onOpen }) => {
  const extra = project.tech.length - MAX_CARD_TECH;
  const muted = dark ? 'text-[#86868b]' : 'text-apple-muted';
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={`group h-full w-full text-left flex flex-col gap-4 sm:gap-5 p-5 sm:p-8 rounded-[28px] transition duration-500 ease-out hover:scale-[1.012] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] focus:outline-none focus-visible:ring-4 focus-visible:ring-apple-blue/40 ${
        dark ? 'bg-black text-white' : 'bg-white text-apple-ink'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold">{project.period}</span>
        <span className={muted}>· {project.client}</span>
        <span className="ml-auto flex gap-2">
          {project.ongoing && (
            <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[11px] font-medium text-green-600">Ongoing</span>
          )}
          <EngagementBadge engagement={project.engagement} dark={dark} />
        </span>
      </div>
      <div>
        <h3 className="text-xl sm:text-2xl xl:text-[28px] font-semibold tracking-[-0.02em]">{project.title}</h3>
        <p className={`mt-1 ${muted}`}>{project.role}</p>
      </div>
      <p className={`text-[17px] leading-[1.47] ${dark ? 'text-[#d2d2d7]' : 'text-apple-ink/80'}`}>{project.summary}</p>
      <div className="mt-auto flex flex-wrap gap-2 text-sm">
        {project.tech.slice(0, MAX_CARD_TECH).map((tech) => (
          <Tag key={tech} theme={dark ? 'dark' : 'light'}>
            {tech}
          </Tag>
        ))}
        {extra > 0 && (
          <Tag theme={dark ? 'dark' : 'light'} variant="outlined">
            +{extra} more
          </Tag>
        )}
      </div>
      <span className={`text-[17px] ${dark ? 'text-apple-link-dark' : 'text-apple-link'}`}>
        View case study <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">›</span>
      </span>
    </button>
  );
};

const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the URL bar already holds the link */
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="h-[100dvh] w-full max-w-3xl overflow-y-auto overscroll-contain bg-white text-black shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 sm:gap-4 bg-[rgba(251,251,253,0.8)] backdrop-blur-xl backdrop-saturate-[1.8] px-4 sm:px-10 py-3 sm:py-4 border-b border-black/[0.08]">
          <p className="text-sm sm:text-base font-semibold">Case study</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="rounded-full bg-apple-chip px-3 sm:px-4 py-1.5 text-xs sm:text-sm whitespace-nowrap text-apple-ink transition-colors hover:bg-apple-line"
            >
              {copied ? 'Link copied ✓' : 'Copy link'}
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="rounded-full bg-apple-blue px-3 sm:px-4 py-1.5 text-xs sm:text-sm whitespace-nowrap text-white transition-colors hover:bg-apple-blue-hover"
            >
              Close ✕
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-10 py-6 sm:py-8 flex flex-col gap-8 sm:gap-10">
          <section className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 text-sm">
              <Tag variant="outlined">{project.period}</Tag>
              <Tag variant="outlined">{project.client}</Tag>
              <span className="self-center">
                <EngagementBadge engagement={project.engagement} />
              </span>
              {project.ongoing && (
                <span className="self-center rounded-full bg-green-500/15 px-2 py-0.5 text-[11px] font-medium text-green-700">Ongoing</span>
              )}
            </div>
            <h2 id="project-modal-title" className="text-[28px] sm:text-[40px] font-semibold leading-[1.1] tracking-[-0.025em] mt-2">
              {project.title}
            </h2>
            <p className="text-[17px] sm:text-xl text-apple-muted">{project.tagline}</p>
            <p className="font-semibold">Role: {project.role}</p>
          </section>

          {project.stats && (
            <section className="flex flex-col gap-3">
              <Heading>Contribution in numbers</Heading>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.stats.map((s) => (
                  <div key={s.label} className="rounded-[18px] bg-apple-gray text-apple-ink p-4">
                    <p className="text-xl sm:text-2xl font-semibold break-words">{s.value}</p>
                    <p className="mt-1 text-xs text-apple-muted">{s.label}</p>
                    {s.note && <p className="mt-2 text-xs text-apple-muted">{s.note}</p>}
                  </div>
                ))}
              </div>
              {project.statsNote && <p className="text-xs text-gray-500">{project.statsNote}</p>}
            </section>
          )}

          {project.workSplit && (
            <section className="flex flex-col gap-3">
              <Heading>Work split</Heading>
              <div className="flex h-10 w-full overflow-hidden rounded-full text-xs sm:text-sm font-semibold">
                {project.workSplit.map((w, i) => (
                  <div
                    key={w.label}
                    style={{ width: `${w.percent}%` }}
                    title={`${w.label} ~${w.percent}%`}
                    className={`flex min-w-0 items-center justify-center px-2 ${i === 0 ? 'bg-apple-blue text-white' : 'bg-apple-chip text-apple-ink'}`}
                  >
                    <span className="truncate">
                      {w.label} ~{w.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <Heading>Overview</Heading>
            {project.overview.map((p) => (
              <p key={p.slice(0, 24)} className="text-[17px] leading-[1.47] text-apple-ink/80">
                {p}
              </p>
            ))}
          </section>

          <section className="flex flex-col gap-4">
            <Heading>Key contributions</Heading>
            <div className="flex flex-col gap-5">
              {project.contributions.map((c) => (
                <div key={c.area} className="rounded-[18px] bg-apple-gray p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{c.area}</h3>
                    {c.layer && (
                      <span className="rounded-full border border-gray-300 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-600">
                        {c.layer}
                      </span>
                    )}
                  </div>
                  <ul className="mt-2 list-disc pl-5 flex flex-col gap-1.5 text-apple-ink/80">
                    {c.points.map((pt) => (
                      <li key={pt.slice(0, 32)}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <Heading>Achievements</Heading>
            <ul className="flex flex-col gap-2">
              {project.achievements.map((a) => (
                <li key={a} className="flex gap-3">
                  <span aria-hidden className="text-apple-blue font-semibold">
                    ✓
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3 pb-6">
            <Heading>Tech stack</Heading>
            <div className="flex flex-wrap gap-2 text-sm">
              {project.tech.map((t) => (
                <Tag key={t} variant="outlined">
                  {t}
                </Tag>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const reduce = useReducedMotion();

  // Deep links: /#project=<slug> opens that case study, so a single project can be shared.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      const slug = hash.startsWith(HASH_PREFIX) ? decodeURIComponent(hash.slice(HASH_PREFIX.length)) : null;
      setActive(slug ? (projects.find((p) => p.slug === slug) ?? null) : null);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [projects]);

  const open = (p: Project) => {
    history.replaceState(null, '', `${HASH_PREFIX}${p.slug}`);
    setActive(p);
  };
  const close = useCallback(() => {
    history.replaceState(null, '', '#projects');
    setActive(null);
  }, []);

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter, projects],
  );

  return (
    <div className="flex flex-col py-16 sm:py-20 lg:py-28 gap-8 sm:gap-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Heading>My Projects</Heading>
          <p className="headline-apple max-w-3xl">Selected work, from first commit to production.</p>
          <p className="text-apple-muted text-[17px] sm:text-xl leading-[1.4] max-w-2xl">Open any project for the full case study: scope, my contributions and the numbers behind them.</p>
        </div>
        <div
          role="group"
          aria-label="Filter projects"
          className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-apple-chip p-1 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((f) => {
            const count = f === 'All' ? projects.length : projects.filter((p) => p.categories.includes(f)).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-[13px] transition duration-200 ${
                  filter === f ? 'bg-white text-apple-ink shadow-[0_1px_4px_rgba(0,0,0,0.12)]' : 'text-apple-muted hover:text-apple-ink'
                }`}
              >
                {f} <span className="text-apple-muted/70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div layout={!reduce} className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <motion.div
              key={project.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} dark={index % 4 === 0 || index % 4 === 3} onOpen={() => open(project)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>{active && <ProjectModal key={active.slug} project={active} onClose={close} />}</AnimatePresence>
    </div>
  );
};
