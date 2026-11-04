import { useEffect, useState } from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import type { Difficulty, SorenessId, WorkoutFeedback } from '../types';
import { DIFFICULTY_OPTIONS, SORENESS_OPTIONS } from '../types';
import { useI18n } from '../i18n';

interface Props {
  onSubmit: (feedback: WorkoutFeedback | null) => void;
}

export default function FeedbackModal({ onSubmit }: Props) {
  const { lang, t } = useI18n();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [soreness, setSoreness] = useState<SorenessId[]>([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSubmit(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSubmit]);

  const toggleSoreness = (id: SorenessId) => {
    setSoreness((prev) => {
      if (id === 'none') return prev.includes('none') ? [] : ['none'];
      const withoutNone = prev.filter((x) => x !== 'none');
      return withoutNone.includes(id)
        ? withoutNone.filter((x) => x !== id)
        : [...withoutNone, id];
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => onSubmit(null)} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-ink-600 bg-ink-800 p-6 shadow-card animate-pop-in">
        <button
          onClick={() => onSubmit(null)}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-ink-600 hover:text-white"
          aria-label={t('common.close')}
        >
          <X size={20} />
        </button>

        <div className="mb-5 flex items-center gap-3 pr-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime/15 text-lime-neon">
            <Heart size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t('feedback.title')}</h2>
            <p className="text-sm text-slate-400">{t('feedback.subtitle')}</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!difficulty) return;
            onSubmit({ difficulty, soreness, note: note.trim() || undefined });
          }}
        >
          <div className="mb-5">
            <p className="mb-2.5 text-sm font-bold text-white">{t('feedback.load')}</p>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition active:scale-[0.97] ${
                    difficulty === d.id
                      ? 'border-lime bg-lime/15 text-white shadow-neon'
                      : 'border-ink-600 bg-ink-900/40 text-slate-400 hover:border-ink-500 hover:text-slate-200'
                  }`}
                >
                  <span className="text-2xl">{d.emoji}</span>
                  <span className="text-xs font-semibold leading-tight">{d.label[lang]}</span>
                </button>
              ))}
            </div>
            {difficulty && (
              <p className="mt-2 text-xs text-slate-500">
                {DIFFICULTY_OPTIONS.find((d) => d.id === difficulty)?.hint[lang]}
              </p>
            )}
          </div>

          <div className="mb-5">
            <p className="mb-2.5 text-sm font-bold text-white">{t('feedback.soreness')}</p>
            <div className="flex flex-wrap gap-2">
              {SORENESS_OPTIONS.map((s) => {
                const active = soreness.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSoreness(s.id)}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-[0.97] ${
                      active
                        ? 'border-lime bg-lime/15 text-lime-neon'
                        : 'border-ink-600 bg-ink-900/40 text-slate-400 hover:border-ink-500'
                    }`}
                  >
                    {s.label[lang]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="feedback-note" className="mb-1.5 block text-sm font-bold text-white">
              {t('feedback.note')}{' '}
              <span className="font-normal text-slate-500">{t('feedback.optional')}</span>
            </label>
            <textarea
              id="feedback-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder={t('feedback.placeholder')}
              className="w-full resize-none rounded-xl border border-ink-600 bg-ink-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-lime/50"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onSubmit(null)}
              className="rounded-xl border border-ink-600 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-coral/40 hover:text-coral-neon"
            >
              {t('common.skip')}
            </button>
            <button
              type="submit"
              disabled={!difficulty}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-ink-900 shadow-neon transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles size={18} />
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
