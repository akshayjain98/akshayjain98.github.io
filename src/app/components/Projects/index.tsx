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
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        freelance
          ? 'bg-amber-400/20 text-amber-700'
          : dark
            ? 'bg-white/10 text-gray-200'
            : 'bg-black/5 text-gray-700'
      } ${freelance && dark ? '!text-amber-300' : ''}`}
    >
      {engagement}
    </span>
  );
};

const ProjectCard: React.FC<{ project: Project; dark: boolean; onOpen: () => void }> = ({ project, dark, onOpen }) => {
  const extra = project.tech.length - MAX_CARD_TECH;
  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={`group h-full w-full text-left flex flex-col gap-5 p-6 sm:p-8 rounded-3xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 ${
        dark ? 'bg-black text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold">{project.period}</span>
        <span className={muted}>· {project.client}</span>
        <span className="ml-auto flex gap-2">
          {project.ongoing && (
            <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-600">Ongoing</span>
          )}
          <EngagementBadge engagement={project.engagement} dark={dark} />
        </span>
      </div>
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold">{project.title}</h3>
        <p className={`mt-1 ${muted}`}>{project.role}</p>
      </div>
      <p className={dark ? 'text-gray-200' : 'text-gray-700'}>{project.summary}</p>
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
      <span className="font-semibold text-sm">
        View case study <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
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
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="h-full w-full max-w-3xl overflow-y-auto bg-white text-black shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white/95 backdrop-blur px-6 sm:px-10 py-4 border-b border-gray-200">
          <p className="text-sm font-semibold uppercase tracking-wide">Case study</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold hover:border-black"
            >
              {copied ? 'Link copied ✓' : 'Copy link'}
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold hover:bg-black hover:text-white"
            >
              Close ✕
            </button>
          </div>
        </div>

        <div className="px-6 sm:px-10 py-8 flex flex-col gap-10">
          <section className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 text-sm">
              <Tag variant="outlined">{project.period}</Tag>
              <Tag variant="outlined">{project.client}</Tag>
              <span className="self-center">
                <EngagementBadge engagement={project.engagement} />
              </span>
              {project.ongoing && (
                <span className="self-center rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-700">Ongoing</span>
              )}
            </div>
            <h2 id="project-modal-title" className="text-3xl sm:text-4xl font-bold mt-2">
              {project.title}
            </h2>
            <p className="text-gray-500">{project.tagline}</p>
            <p className="font-semibold">Role: {project.role}</p>
          </section>

          {project.stats && (
            <section className="flex flex-col gap-3">
              <Heading>Contribution in numbers</Heading>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.stats.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-black text-white p-4">
                    <p className="text-2xl font-semibold">{s.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">{s.label}</p>
                    {s.note && <p className="mt-2 text-xs text-gray-400">{s.note}</p>}
                  </div>
                ))}
              </div>
              {project.statsNote && <p className="text-xs text-gray-500">{project.statsNote}</p>}
            </section>
          )}

          {project.workSplit && (
            <section className="flex flex-col gap-3">
              <Heading>Work split</Heading>
              <div className="flex h-10 w-full overflow-hidden rounded-full text-sm font-semibold">
                {project.workSplit.map((w, i) => (
                  <div
                    key={w.label}
                    style={{ width: `${w.percent}%` }}
                    className={`flex items-center justify-center ${i === 0 ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                  >
                    {w.label} ~{w.percent}%
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <Heading>Overview</Heading>
            {project.overview.map((p) => (
              <p key={p.slice(0, 24)} className="text-gray-700">
                {p}
              </p>
            ))}
          </section>

          <section className="flex flex-col gap-4">
            <Heading>Key contributions</Heading>
            <div className="flex flex-col gap-5">
              {project.contributions.map((c) => (
                <div key={c.area} className="rounded-2xl bg-gray-100 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{c.area}</h3>
                    {c.layer && (
                      <span className="rounded-full border border-gray-300 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        {c.layer}
                      </span>
                    )}
                  </div>
                  <ul className="mt-2 list-disc pl-5 flex flex-col gap-1.5 text-gray-700">
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
                  <span aria-hidden className="text-green-600 font-bold">
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
    <div className="flex flex-col py-20 lg:py-28 gap-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Heading>My Projects</Heading>
          <p className="text-3xl sm:text-4xl font-semibold max-w-2xl leading-tight">Selected work, from first commit to production.</p>
          <p className="text-gray-500 max-w-2xl">Open any project for the full case study: scope, my contributions and the numbers behind them.</p>
        </div>
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2 text-sm font-semibold">
          {FILTERS.map((f) => {
            const count = f === 'All' ? projects.length : projects.filter((p) => p.categories.includes(f)).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 transition-colors ${
                  filter === f ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'
                }`}
              >
                {f} <span className="text-gray-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div layout={!reduce} className="grid gap-6 lg:grid-cols-2">
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
