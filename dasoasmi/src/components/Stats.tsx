import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Library, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import type { Shloka } from '../types';

interface StatsProps {
  shlokas: Shloka[];
}

type View =
  | { mode: 'dashboard' }
  | { mode: 'list'; type: 'source' | 'speaker' }
  | { mode: 'detail'; type: 'source' | 'speaker'; value: string };

// ─── Compact shloka card ───────────────────────────────────────────────────
function SlimCard({ shloka }: { shloka: Shloka }) {
  return (
    <div className="rounded-2xl border border-border bg-white/10 backdrop-blur-md p-5 shadow-sm">
      <p className="text-base font-serif italic font-semibold leading-relaxed mb-3 whitespace-pre-line">
        {shloka.shloka}
      </p>
      {shloka.meaning && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{shloka.meaning}</p>
      )}
      <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-t border-border pt-3">
        {shloka.source && <span>{shloka.source}</span>}
        {shloka.source && shloka.uvaca && <span>·</span>}
        {shloka.uvaca && <span>{shloka.uvaca}</span>}
        <span className="ml-auto">{new Date(shloka.date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

// ─── Clickable list row ────────────────────────────────────────────────────
function ListRow({ name, count, max, onClick }: {
  name: string; count: number; max: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left group rounded-xl border border-transparent hover:border-border hover:bg-primary/5 px-3 py-3 -mx-3 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground truncate max-w-[80%] group-hover:text-primary transition-colors">
          {name || '—'}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-muted-foreground">{count}</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-primary/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(count / max) * 100}%` }}
        />
      </div>
    </button>
  );
}

// ─── Clickable stat card ───────────────────────────────────────────────────
function ClickableStatCard({ icon, label, value, onClick }: {
  icon: React.ReactNode; label: string; value: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-sm flex items-center gap-3 hover:bg-primary/5 hover:border-border transition-all text-left w-full"
    >
      <div className="rounded-full bg-primary/10 p-2.5 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold font-serif text-primary">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export function Stats({ shlokas }: StatsProps) {
  const navigate = useNavigate();
  const [view, setView] = useState<View>({ mode: 'dashboard' });

  const bySource = Object.entries(
    shlokas.reduce<Record<string, number>>((acc, s) => {
      const key = s.source?.trim() || 'Unknown';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const byAuthor = Object.entries(
    shlokas.reduce<Record<string, number>>((acc, s) => {
      const key = s.uvaca?.trim() || 'Unknown';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  // ── Detail view: shlokas for selected source/speaker ──────────────────
  if (view.mode === 'detail') {
    const filtered = shlokas.filter((s) => {
      const val = view.type === 'source'
        ? (s.source?.trim() || 'Unknown')
        : (s.uvaca?.trim() || 'Unknown');
      return val === view.value;
    });

    return (
      <div className="relative z-10 mx-auto max-w-2xl px-4 pb-12 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button
          variant="ghost"
          onClick={() => setView({ mode: 'list', type: view.type })}
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {view.type === 'source' ? 'Sources' : 'Speakers'}
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {view.type === 'source' ? 'Source' : 'Speaker'}
          </div>
          <h2 className="text-xl font-bold font-serif text-foreground">{view.value}</h2>
          <span className="ml-auto text-sm text-muted-foreground shrink-0">
            {filtered.length} shloka{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {filtered.map((s) => <SlimCard key={s.id} shloka={s} />)}
        </div>
      </div>
    );
  }

  // ── List view: all sources or all speakers ─────────────────────────────
  if (view.mode === 'list') {
    const data = view.type === 'source' ? bySource : byAuthor;
    const max = data[0]?.[1] ?? 1;
    const title = view.type === 'source' ? 'Sources' : 'Speakers';

    return (
      <div className="relative z-10 mx-auto max-w-2xl px-4 pb-12 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button
          variant="ghost"
          onClick={() => setView({ mode: 'dashboard' })}
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>

        <h2 className="text-2xl font-bold font-serif text-primary mb-6">{title}</h2>

        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-sm flex flex-col">
          {data.map(([name, count]) => (
            <ListRow
              key={name}
              name={name}
              count={count}
              max={max}
              onClick={() => setView({ mode: 'detail', type: view.type, value: name })}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Dashboard: counts only ─────────────────────────────────────────────
  return (
    <div className="relative z-10 mx-auto max-w-2xl px-4 pb-12 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6 pl-0 hover:bg-transparent hover:text-primary gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Shlokas
      </Button>

      {/* Hero */}
      <div className="rounded-3xl border border-white/20 bg-primary/5 backdrop-blur-md p-8 text-center mb-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Total Collection</p>
        <p className="text-8xl font-bold font-serif text-primary leading-none mb-2">{shlokas.length}</p>
        <p className="text-sm text-muted-foreground">Shlokas preserved</p>
      </div>

      {shlokas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No shlokas in the collection yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <ClickableStatCard
            icon={<Library className="h-4 w-4" />}
            label="Unique Sources"
            value={bySource.length}
            onClick={() => setView({ mode: 'list', type: 'source' })}
          />
          <ClickableStatCard
            icon={<Users className="h-4 w-4" />}
            label="Unique Speakers"
            value={byAuthor.length}
            onClick={() => setView({ mode: 'list', type: 'speaker' })}
          />
        </div>
      )}
    </div>
  );
}
