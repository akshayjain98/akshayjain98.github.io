'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import type { GraphEdge, GraphLayer, GraphNode, JourneyGraph } from '@/lib/types';

const LAYER_TITLES: Record<GraphLayer, string> = {
  year: 'Years',
  role: 'Roles',
  project: 'Projects',
  tech: 'Tech',
};
const LAYER_COLORS: Record<GraphLayer, string> = {
  year: '#1d1d1f',
  role: '#0071e3',
  project: '#8e44ec',
  tech: '#0a9396',
};
const BG = '#f5f5f7'; // section background, used as a halo behind labels
const EASE = [0.25, 0.1, 0.25, 1] as const;

type Orientation = 'horizontal' | 'vertical';
type Placed = GraphNode & { x: number; y: number; r: number };

interface Layout {
  width: number;
  height: number;
  nodes: Placed[];
  byId: Map<string, Placed>;
  headers: {
    layer: GraphLayer;
    x: number;
    y: number;
    anchor: 'start' | 'middle';
  }[];
}

function layout(graph: JourneyGraph, o: Orientation): Layout {
  const horizontal = o === 'horizontal';
  const width = horizontal ? 1200 : 400;
  const height = horizontal ? 620 : 820;
  // Horizontal: one column per layer. Vertical (phones): one row per layer.
  const cross = horizontal ? [80, 380, 740, 1060] : [70, 270, 480, 690];
  const [lo, hi] = horizontal ? [70, height - 20] : [16, width - 64]; // phones: room on the right for slanted labels

  const nodes: Placed[] = graph.layers.flatMap((layer, li) => {
    const maxW = Math.max(...layer.map((n) => n.weight), 1);
    const step = (hi - lo) / Math.max(layer.length, 1);
    return layer.map((n, i) => {
      const along = lo + (i + 0.5) * step;
      const r = 4.5 + 8 * Math.sqrt(n.weight / maxW);
      return horizontal ? { ...n, x: cross[li], y: along, r } : { ...n, x: along, y: cross[li], r };
    });
  });

  const headers = graph.layers.map((layer, li) => ({
    layer: layer[0]?.layer ?? (['year', 'role', 'project', 'tech'] as GraphLayer[])[li],
    x: horizontal ? cross[li] : 4,
    y: horizontal ? 28 : cross[li] - 42,
    anchor: (horizontal ? 'middle' : 'start') as 'start' | 'middle',
  }));

  return {
    width,
    height,
    nodes,
    byId: new Map(nodes.map((n) => [n.id, n])),
    headers,
  };
}

function edgePath(a: Placed, b: Placed, o: Orientation) {
  if (o === 'horizontal') {
    const mx = (a.x + b.x) / 2;
    return `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
  }
  const my = (a.y + b.y) / 2;
  return `M${a.x},${a.y} C${a.x},${my} ${b.x},${my} ${b.x},${b.y}`;
}

/** Everything reachable downstream and upstream of `id` — its full path through the network. */
function trace(id: string, edges: GraphEdge[]) {
  const nodes = new Set([id]);
  const lit = new Set<GraphEdge>();
  const walk = (dir: 'down' | 'up') => {
    const queue = [id];
    const seen = new Set([id]);
    while (queue.length) {
      const cur = queue.shift()!;
      edges.forEach((e) => {
        const [here, next] = dir === 'down' ? [e.from, e.to] : [e.to, e.from];
        if (here !== cur) return;
        lit.add(e);
        nodes.add(next);
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      });
    }
  };
  walk('down');
  walk('up');
  return { nodes, edges: lit };
}

const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

function Graph({
  graph,
  orientation,
  active,
  onHover,
  onPick,
  className,
}: {
  graph: JourneyGraph;
  orientation: Orientation;
  active: string | null;
  onHover: (id: string | null) => void;
  onPick: (id: string | null) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const L = useMemo(() => layout(graph, orientation), [graph, orientation]);
  const maxEdge = useMemo(() => Math.max(...graph.edges.map((e) => e.weight), 1), [graph.edges]);
  const traced = useMemo(() => (active ? trace(active, graph.edges) : null), [active, graph.edges]);
  const horizontal = orientation === 'horizontal';

  const labelProps = (n: Placed): React.SVGProps<SVGTextElement> => {
    if (horizontal) {
      return n.layer === 'year'
        ? { x: n.x - n.r - 8, y: n.y, textAnchor: 'end' }
        : { x: n.x + n.r + 8, y: n.y, textAnchor: 'start' };
    }
    if (n.layer === 'year') return { x: n.x, y: n.y - n.r - 8, textAnchor: 'middle' };
    // Phones: slanted labels so long names fit between rows.
    const x = n.x + 4;
    const y = n.y + n.r + 6;
    return { x, y, textAnchor: 'start', transform: `rotate(62 ${x} ${y})` };
  };

  return (
    <svg
      viewBox={`0 0 ${L.width} ${L.height}`}
      className={`w-full h-auto select-none ${className ?? ''}`}
      role="group"
      aria-label="Experience network: years connect to roles, roles to projects, projects to technologies"
      onClick={() => onPick(null)}
    >
      {L.headers.map((h) => (
        <text
          key={h.layer}
          x={h.x}
          y={h.y}
          textAnchor={h.anchor}
          className="fill-[#86868b] text-[13px] font-semibold uppercase tracking-[0.08em]"
        >
          {LAYER_TITLES[h.layer]}
        </text>
      ))}

      <motion.g
        fill="none"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px 0px' }}
        transition={{
          duration: reduce ? 0 : 1.2,
          ease: EASE,
          delay: reduce ? 0 : 0.3,
        }}
      >
        {graph.edges.map((e, i) => {
          const a = L.byId.get(e.from);
          const b = L.byId.get(e.to);
          if (!a || !b) return null;
          const d = edgePath(a, b, orientation);
          const on = traced?.edges.has(e) ?? false;
          const dim = traced && !on;
          const w = 0.8 + 3.2 * (e.weight / maxEdge);
          return (
            <g key={`${e.from}>${e.to}`}>
              <path
                d={d}
                stroke={on ? LAYER_COLORS[b.layer] : '#c7c7cc'}
                strokeWidth={on ? w + 0.6 : w}
                strokeLinecap="round"
                className="transition-[opacity,stroke] duration-300"
                style={{ opacity: dim ? 0.12 : on ? 0.9 : 0.55 }}
              />
              {/* Signal travelling along the edge: idle shimmer, bright along a traced path. */}
              {(!traced || on) && (
                <path
                  d={d}
                  pathLength={100}
                  className="nn-pulse"
                  stroke={LAYER_COLORS[b.layer]}
                  strokeWidth={on ? 3 : 2}
                  strokeLinecap="round"
                  style={{
                    opacity: on ? 1 : 0.35,
                    animationDuration: on ? '1.6s' : '3.2s',
                    animationDelay: `${((i * 0.37) % 3.2).toFixed(2)}s`,
                  }}
                />
              )}
            </g>
          );
        })}
      </motion.g>

      {L.nodes.map((n, i) => {
        const on = traced?.nodes.has(n.id) ?? false;
        const dim = traced && !on;
        const color = LAYER_COLORS[n.layer];
        const label = horizontal ? n.label : truncate(n.label, 20);
        return (
          <motion.g
            key={n.id}
            tabIndex={0}
            role="button"
            aria-pressed={active === n.id}
            aria-label={`${LAYER_TITLES[n.layer]}: ${n.label}, ${n.sublabel}`}
            className="cursor-pointer outline-none [&:focus-visible_circle.ring]:opacity-100"
            onMouseEnter={() => onHover(n.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(n.id)}
            onBlur={() => onHover(null)}
            onClick={(ev) => {
              ev.stopPropagation();
              onPick(n.id);
            }}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                onPick(n.id);
              }
            }}
            initial={reduce ? false : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px 0px' }}
            transition={{
              duration: reduce ? 0 : 0.5,
              ease: EASE,
              delay: reduce ? 0 : (i % 12) * 0.03,
            }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          >
            <g className="transition-opacity duration-300" style={{ opacity: dim ? 0.3 : 1 }}>
              {/* Larger invisible hit area for touch. */}
              <circle cx={n.x} cy={n.y} r={Math.max(n.r + 8, 16)} fill="transparent" />
              <circle
                className="ring opacity-0 transition-opacity"
                cx={n.x}
                cy={n.y}
                r={n.r + 6}
                fill="none"
                stroke={color}
                strokeWidth={2}
              />
              {n.current && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r + 3}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={2}
                  className="nn-breathe"
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={on || !traced ? color : '#fff'}
                stroke={color}
                strokeWidth={2}
                className="transition-[fill] duration-300"
              />
              <circle cx={n.x - n.r * 0.3} cy={n.y - n.r * 0.3} r={n.r * 0.3} fill="#fff" opacity={0.35} />
              <text
                {...labelProps(n)}
                dominantBaseline="middle"
                stroke={BG}
                strokeWidth={4}
                strokeLinejoin="round"
                paintOrder="stroke"
                className={`fill-[#1d1d1f] ${horizontal ? 'text-[15px]' : 'text-[12px]'} ${
                  active === n.id ? 'font-semibold' : 'font-medium'
                }`}
              >
                {label}
              </text>
            </g>
          </motion.g>
        );
      })}
    </svg>
  );
}

export const NeuralGraph: React.FC<{ graph: JourneyGraph }> = ({ graph }) => {
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const active = hover ?? picked;
  const pick = (id: string | null) => setPicked((p) => (id === null || p === id ? null : id));

  const nodes = useMemo(() => new Map(graph.layers.flat().map((n) => [n.id, n])), [graph]);
  const node = active ? nodes.get(active) : undefined;
  const neighbours = useMemo(() => {
    if (!active) return [];
    return graph.edges
      .filter((e) => e.from === active || e.to === active)
      .map((e) => nodes.get(e.from === active ? e.to : e.from)!)
      .filter(Boolean);
  }, [active, graph.edges, nodes]);

  const props = { graph, active, onHover: setHover, onPick: pick };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[28px] bg-white/0 -mx-2 sm:mx-0">
        <Graph {...props} orientation="horizontal" className="hidden lg:block" />
        <Graph {...props} orientation="vertical" className="lg:hidden mx-auto max-w-[560px]" />
      </div>

      <div
        aria-live="polite"
        className="min-h-[132px] rounded-[28px] bg-white p-5 sm:p-7 flex flex-col gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      >
        {node ? (
          <>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: LAYER_COLORS[node.layer] }}
              >
                {LAYER_TITLES[node.layer].replace(/s$/, '')}
              </span>
              <h3 className="text-[19px] sm:text-2xl font-semibold tracking-[-0.015em]">{node.label}</h3>
              {node.current && <span className="text-xs font-medium text-green-600">● Current</span>}
            </div>
            <p className="text-[#6e6e73]">{node.sublabel}</p>
            {neighbours.length > 0 && (
              <p className="text-sm text-[#86868b]">
                Connected to <span className="text-apple-ink">{neighbours.map((n) => n.label).join(' · ')}</span>
              </p>
            )}
          </>
        ) : (
          <>
            <h3 className="text-[19px] sm:text-2xl font-semibold tracking-[-0.015em]">Trace a path</h3>
            <p className="text-[#6e6e73]">
              Hover or tap any node to light up how it connects: which years fed a role, which projects that role
              shipped, and the stack behind them. Line thickness is months of overlap.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
