'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { run, suggest, type Line, type TerminalData, type Tone } from './commands';

// A small "/"-command terminal for the hero. Everything runs in the browser from build-time data.

interface Entry {
  id: number;
  input?: string;
  lines: Line[];
}

const QUICK = ['/projects', '/skills', '/contact'];

interface Stream {
  id: number;
  total: number;
  shown: number;
}

// Streaming feel: a short "thinking" pause, then text types out. Long answers speed up so nothing takes over ~1.5s.
const THINK_MS = 380;
const MS_PER_CHAR = 7;
const MIN_MS = 300;
const MAX_MS = 1500;

/** Each line counts one extra "character" for its line break, so blank lines take a beat too. */
const totalChars = (lines: Line[]) => lines.reduce((n, l) => n + l.text.length + 1, 0);

const toneClass: Record<Tone, string> = {
  default: 'text-white/90',
  muted: 'text-[#86868b]',
  accent: 'text-[#2997ff] font-semibold',
  error: 'text-[#ff6961]',
  success: 'text-[#30d158]',
};

export const Terminal: React.FC<{ data: TerminalData }> = ({ data }) => {
  const welcome: Entry = useMemo(
    () => ({
      id: 0,
      lines: [
        { text: `Hi, I'm ${data.profile.firstName} 👋`, tone: 'accent' },
        { text: 'Ask me anything from this terminal.', tone: 'muted' },
        { text: 'Type / to see commands, or tap one below.', tone: 'muted' },
      ],
    }),
    [data.profile.firstName],
  );

  const [entries, setEntries] = useState<Entry[]>([welcome]);
  // The entry currently "streaming" in: shown < 0 means the thinking pulse, otherwise how many characters are visible.
  const [stream, setStream] = useState<Stream | null>(() => ({ id: welcome.id, total: totalChars(welcome.lines), shown: -1 }));
  const [input, setInput] = useState('');
  const [sel, setSel] = useState(0);
  const [menuOpen, setMenuOpen] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const listId = useId();

  const suggestions = useMemo(() => (menuOpen ? suggest(input, data) : []), [input, data, menuOpen]);
  const showMenu = suggestions.length > 0;

  useEffect(() => setSel(0), [input]);

  // Drive the stream with requestAnimationFrame. Time-based, so it stays smooth on slow devices.
  const streamId = stream?.id;
  const streamTotal = stream?.total ?? 0;
  useEffect(() => {
    if (streamId === undefined) return;
    if (!streamTotal || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStream(null);
      return;
    }
    const duration = Math.min(MAX_MS, Math.max(MIN_MS, streamTotal * MS_PER_CHAR));
    const start = performance.now() + THINK_MS;
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      if (t >= duration) return setStream(null);
      // Ease out: starts quick, settles at the end, like tokens arriving.
      const p = t < 0 ? -1 : Math.floor((1 - Math.pow(1 - t / duration, 2)) * streamTotal);
      setStream((s) => (s && s.id === streamId && s.shown !== p ? { ...s, shown: p } : s));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [streamId, streamTotal]);

  const skipStream = () => setStream(null);

  // Keep the newest output in view, inside the terminal only (never scroll the page).
  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, stream?.shown]);

  // Press "/" anywhere on the page to jump into the terminal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
      e.preventDefault();
      inputRef.current?.focus({ preventScroll: true });
      setInput('/');
      setMenuOpen(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const execute = (raw: string) => {
    const cmd = raw.trim();
    setInput('');
    setHistIdx(null);
    setMenuOpen(true);
    if (!cmd) return;
    setHistory((h) => (h[h.length - 1] === cmd ? h : [...h, cmd]));
    const result = run(cmd, data);
    if (result.effect?.type === 'clear') {
      setEntries([]);
      return;
    }
    if (result.effect?.type === 'scroll') {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById(result.effect.id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }
    const id = nextId.current++;
    setEntries((es) => [...es, { id, input: cmd.startsWith('/') ? cmd : `/${cmd}`, lines: result.lines }]);
    // A new command replaces any stream in progress, so the previous answer just shows in full.
    setStream({ id, total: totalChars(result.lines), shown: -1 });
  };

  const complete = (value: string) => {
    setInput(value);
    setMenuOpen(true);
    inputRef.current?.focus();
  };

  // Picking a suggestion: commands that take an argument get completed, the rest run straight away.
  const pick = (value: string) => (value.endsWith(' ') ? complete(value) : execute(value));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSel((s) => (s + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSel((s) => (s - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        complete(suggestions[sel].value);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        // If the typed text is already a complete command, run it rather than the highlighted suggestion.
        const typed = input.trim();
        const exact = suggestions.find((s) => s.value.trim() === typed);
        pick(exact && !exact.value.endsWith(' ') ? exact.value : suggestions[sel].value);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
    }

    if (e.key === 'Escape' && stream) {
      e.preventDefault();
      skipStream();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      execute(input);
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      const i = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(i);
      setInput(history[i]);
      setMenuOpen(false);
    } else if (e.key === 'ArrowDown' && histIdx !== null) {
      e.preventDefault();
      const i = histIdx + 1;
      if (i >= history.length) {
        setHistIdx(null);
        setInput('');
      } else {
        setHistIdx(i);
        setInput(history[i]);
      }
      setMenuOpen(false);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  const prompt = (
    <span className="select-none">
      <span className="text-[#30d158]">~/{data.profile.firstName.toLowerCase()}</span>
      <span className="text-[#86868b]"> $ </span>
    </span>
  );

  return (
    <div
      className="w-full rounded-[28px] bg-black text-white overflow-hidden font-mono text-[13px] leading-[1.55] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]"
      onClick={(e) => {
        // Focus the prompt when clicking empty terminal space, but not when selecting text or clicking links.
        if (!(e.target as HTMLElement).closest('a,button') && !window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
      }}
    >
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-[#86868b] truncate">
          {data.profile.firstName.toLowerCase()}@portfolio: ~
        </span>
      </div>

      <div className="relative">
        <div ref={outRef} aria-live="polite" className="h-[300px] sm:h-[340px] overflow-y-auto overscroll-contain px-5 pt-4 pb-2 break-words">
          {entries.map((entry) => (
            <div key={entry.id} className="mb-3">
              {entry.input && (
                <p>
                  {prompt}
                  <span className="text-white">{entry.input}</span>
                </p>
              )}
              {entry.lines.map((l, i) => (
                <p key={i} className={`${toneClass[l.tone ?? 'default']} whitespace-pre-wrap min-h-[1.55em]`} style={l.indent ? { paddingLeft: `${l.indent * 1.25}em` } : undefined}>
                  {l.href ? (
                    <a
                      href={l.href}
                      className="text-[#2997ff] underline underline-offset-2 hover:text-white break-all"
                      {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {l.text}
                    </a>
                  ) : (
                    l.text
                  )}
                </p>
              ))}
            </div>
          ))}
        </div>

        {showMenu && (
          <ul
            id={listId}
            role="listbox"
            aria-label="Command suggestions"
            className="absolute inset-x-3 bottom-1 max-h-[220px] overflow-y-auto rounded-2xl border border-white/10 bg-[#1c1c1e]/95 backdrop-blur p-1.5 shadow-2xl"
          >
            {suggestions.map((s, i) => (
              <li
                key={s.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === sel}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setSel(i)}
                onClick={() => pick(s.value)}
                className={`flex items-baseline justify-between gap-3 rounded-xl px-3 py-1.5 cursor-pointer ${i === sel ? 'bg-white/10' : ''}`}
              >
                <span className="text-white whitespace-nowrap">{s.label}</span>
                {s.hint && <span className="text-[#86868b] text-xs truncate">{s.hint}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center px-5 py-3 border-t border-white/10">
        {prompt}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setMenuOpen(true);
            setHistIdx(null);
          }}
          onKeyDown={onKeyDown}
          placeholder="type / for commands"
          aria-label="Terminal command"
          role="combobox"
          aria-expanded={showMenu}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showMenu ? `${listId}-${sel}` : undefined}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="flex-1 min-w-0 bg-transparent text-white placeholder:text-white/30 outline-none caret-[#30d158]"
        />
      </div>

      <div className="flex flex-wrap gap-2 px-5 pb-4">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => execute(q)}
            className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            {q}
          </button>
        ))}
        <button
          type="button"
          onClick={() => execute('/help')}
          className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          /help
        </button>
      </div>
    </div>
  );
};
