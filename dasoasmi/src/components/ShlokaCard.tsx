import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import type { Shloka } from '../types';
import { cn } from '../lib/utils';
import { useAdmin } from '../context/AdminContext';
import tornParchmentBg from '../assets/torn_parchment_full.png';

interface ShlokaCardProps {
  shloka: Shloka;
  className?: string;
  onEdit?: (updated: Shloka) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function ShlokaCard({ shloka, className, onEdit, onDelete }: ShlokaCardProps) {
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<Shloka>(shloka);

  const handleSave = async () => {
    if (!onEdit) return;
    setIsSaving(true);
    try {
      await onEdit(draft);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(shloka);
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    await onDelete(shloka.id);
  };

  const inputClass = "w-full bg-white/60 border border-black/20 rounded-lg px-3 py-2 text-black font-sans text-sm focus:outline-none focus:border-primary focus:bg-white/80 resize-none";

  return (
    <div className={cn("relative flex flex-col p-12 sm:p-16 transition-all hover:scale-[1.01]", className)}>
      <img
        src={tornParchmentBg}
        alt=""
        className="absolute inset-0 h-full w-full object-fill bg-blend-multiply dark:opacity-80 drop-shadow-xl"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Admin action buttons */}
      {isAdmin && !isEditing && (
        <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
          {confirmDelete ? (
            <div className="flex items-center gap-2 bg-white/90 rounded-xl px-3 py-1.5 shadow-md border border-black/10">
              <span className="text-xs font-medium text-black/70">Delete?</span>
              <button onClick={handleDeleteConfirm} className="text-destructive hover:text-destructive/80 transition-colors">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-black/50 hover:text-black transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-white/70 hover:bg-white/90 border border-black/10 p-1.5 text-black/60 hover:text-primary transition-all shadow-sm"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded-lg bg-white/70 hover:bg-white/90 border border-black/10 p-1.5 text-black/60 hover:text-destructive transition-all shadow-sm"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )}

      {isEditing ? (
        <div className="relative z-10 flex flex-col gap-4">
          <textarea
            rows={4}
            className={cn(inputClass, "text-center text-xl font-serif italic font-semibold")}
            value={draft.shloka}
            onChange={(e) => setDraft({ ...draft, shloka: e.target.value })}
            placeholder="Shloka text"
          />
          <textarea
            rows={3}
            className={cn(inputClass, "text-center font-semibold")}
            value={draft.meaning}
            onChange={(e) => setDraft({ ...draft, meaning: e.target.value })}
            placeholder="Meaning"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              value={draft.source}
              onChange={(e) => setDraft({ ...draft, source: e.target.value })}
              placeholder="Source"
            />
            <input
              className={inputClass}
              value={draft.uvaca}
              onChange={(e) => setDraft({ ...draft, uvaca: e.target.value })}
              placeholder="Speaker (uvaca)"
            />
          </div>
          <textarea
            rows={2}
            className={inputClass}
            value={draft.comment || ''}
            onChange={(e) => setDraft({ ...draft, comment: e.target.value })}
            placeholder="Comment (optional)"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 rounded-lg border border-black/20 bg-white/60 text-sm text-black/70 hover:bg-white/80 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <blockquote className="mb-8 relative z-10 text-center">
            <p className="text-2xl sm:text-3xl font-medium leading-relaxed italic font-semibold font-serif drop-shadow-sm whitespace-pre-line">
              {shloka.shloka}
            </p>
          </blockquote>
          <p className="font-sans leading-relaxed font-semibold opacity-90 text-center">@dasoasmi</p>

          <div className="mb-8 space-y-3 relative z-10 text-center">
            <p className="text-lg sm:text-xl text-black font-sans leading-relaxed font-semibold opacity-90">
              {shloka.meaning}
            </p>
          </div>

          {shloka.comment && (
            <div className="mb-6 relative z-10 mx-auto max-w-[85%]">
              <div className="rounded-lg bg-black/5 p-4 text-base italic text-black backdrop-blur-[1px] border border-black/10 text-center">
                {shloka.comment}
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-center gap-6 text-sm sm:text-base font-bold text-black/80 uppercase tracking-widest relative z-10 border-t border-black/20 pt-6 w-full">
            <span>{shloka.source}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-black/50" />
            <span>{shloka.uvaca}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-black/50" />
            <span>{new Date(shloka.date).toLocaleDateString()}</span>
          </div>
        </>
      )}
    </div>
  );
}
