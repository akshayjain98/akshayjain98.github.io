'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/types';
import { Heading } from '../ui/Heading';
import Tag from '../ui/Tag';

const MAX_CARD_TECH = 6;

interface ProjectCardProps {
  project: Project;
  theme: 'dark' | 'light';
  onOpen: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, theme, onOpen }) => {
  const dark = theme === 'dark';
  const extra = project.tech.length - MAX_CARD_TECH;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={`group w-full text-left flex flex-col md:flex-row gap-4 md:gap-8 p-6 sm:p-10 lg:p-12 rounded-3xl transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 ${
        dark ? 'bg-black text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <div className="md:w-1/4 flex flex-col gap-2 text-sm">
        <p className="font-semibold">{project.period}</p>
        <p className={dark ? 'text-gray-400' : 'text-gray-500'}>{project.client}</p>
        {project.ongoing && (
          <span className="mt-1 w-fit rounded-full bg-green-500/15 text-green-600 px-3 py-1 text-xs font-semibold">Ongoing</span>
        )}
      </div>
      <div className="flex flex-col gap-5 flex-1 min-w-0">
        <div>
          <h3 className="text-2xl font-bold">{project.title}</h3>
          <p className={`mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{project.role}</p>
        </div>
        <p>{project.summary}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          {project.tech.slice(0, MAX_CARD_TECH).map((tech) => (
            <Tag key={tech} theme={theme}>
              {tech}
            </Tag>
          ))}
          {extra > 0 && (
            <Tag theme={theme} variant="outlined">
              +{extra} more
            </Tag>
          )}
        </div>
        <span className="font-semibold text-sm underline-offset-4 group-hover:underline">View full details →</span>
      </div>
    </button>
  );
};

const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

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
          <p className="text-sm font-semibold uppercase tracking-wide">Project details</p>
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

        <div className="px-6 sm:px-10 py-8 flex flex-col gap-10">
          <section className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 text-sm">
              <Tag variant="outlined">{project.period}</Tag>
              <Tag variant="outlined">{project.client}</Tag>
              {project.ongoing && <Tag className="!bg-green-500/15 !border-transparent text-green-700">Ongoing</Tag>}
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
                  <span aria-hidden className="text-green-600 font-bold">✓</span>
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
  const close = useCallback(() => setActive(null), []);

  return (
    <div className="flex flex-col py-20 lg:py-28 gap-12">
      <div className="flex flex-col gap-3">
        <Heading>My Projects</Heading>
        <p className="text-gray-500 max-w-2xl">
          A selection of client and product work. Select a project to see the full scope, my contributions and the numbers behind them.
        </p>
      </div>
      <div className="flex flex-col gap-6 lg:gap-10">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            theme={index % 2 === 0 ? 'dark' : 'light'}
            onOpen={() => setActive(project)}
          />
        ))}
      </div>
      <AnimatePresence>{active && <ProjectModal key={active.slug} project={active} onClose={close} />}</AnimatePresence>
    </div>
  );
};
