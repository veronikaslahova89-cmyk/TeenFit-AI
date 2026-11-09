import { Rocket, Calendar, Heart, Trophy, ChevronRight } from 'lucide-react';
import type { ChallengeProgress } from '../challenges';
import { countCompleted, nextChallenge } from '../challenges';
import { useI18n } from '../i18n';

interface Props {
  onQuickStart: () => void;
  onWeeklyPlan: () => void;
  challenges: ChallengeProgress[];
  onChallenges: () => void;
  favoritesCount: number;
  onFavorites: () => void;
}

export default function EmptyState({
  onQuickStart,
  onWeeklyPlan,
  challenges,
  onChallenges,
  favoritesCount,
  onFavorites,
}: Props) {
  const { t } = useI18n();
  const completedCount = countCompleted(challenges);
  const next = nextChallenge(challenges);

  const tags = [
    t('empty.tagFree'),
    t('empty.tagEquipment'),
    t('empty.tagTime'),
    t('empty.tagTeens'),
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="animate-fade-up rounded-3xl border border-ink-600 bg-gradient-to-br from-ink-800 to-ink-700/60 p-6 shadow-card sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-coral/20 to-lime/20 text-3xl">
            🏃
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-lime-neon">
              {t('empty.greeting')}
            </p>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">{t('empty.title')}</h2>
          </div>
        </div>

        <p className="mb-6 text-base leading-relaxed text-slate-300">{t('empty.intro')}</p>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ink-600 bg-ink-900/60 px-3 py-1 text-xs font-semibold text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={onQuickStart}
            className="group flex items-center gap-3 rounded-2xl bg-lime px-5 py-4 text-ink-900 shadow-neon transition hover:brightness-110 active:scale-[0.98]"
          >
            <Rocket size={22} className="transition group-hover:translate-x-0.5" />
            <div className="text-left">
              <p className="text-sm font-extrabold">{t('empty.quickStart')}</p>
              <p className="text-xs font-semibold text-ink-900/70">{t('empty.quickStartSub')}</p>
            </div>
          </button>
          <button
            onClick={onWeeklyPlan}
            className="group flex items-center gap-3 rounded-2xl border-2 border-ink-500 bg-ink-900/40 px-5 py-4 text-white transition hover:border-lime/40 hover:bg-ink-800 active:scale-[0.98]"
          >
            <Calendar size={22} className="text-lime-neon transition group-hover:scale-110" />
            <div className="text-left">
              <p className="text-sm font-extrabold">{t('empty.weekly')}</p>
              <p className="text-xs font-semibold text-slate-400">{t('empty.weeklySub')}</p>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={onFavorites}
          className="mt-3 flex min-h-12 w-full items-center gap-3 rounded-2xl border border-ink-600 bg-ink-900/40 px-4 py-3 text-left transition hover:border-coral/40 hover:bg-ink-800 active:scale-[0.99]"
        >
          <Heart size={20} className="shrink-0 text-rose-400" />
          <span className="flex-1 text-sm font-extrabold text-white">{t('favorites.saved')}</span>
          <span className="rounded-full bg-ink-700 px-2.5 py-1 text-xs font-bold text-slate-300">
            {favoritesCount}
          </span>
          <ChevronRight size={18} className="shrink-0 text-slate-500" />
        </button>

        <button
          onClick={onChallenges}
          className="group mt-3 flex w-full items-center gap-3 rounded-2xl border border-ink-600 bg-ink-900/40 px-4 py-3.5 text-left transition hover:border-lime/40 hover:bg-ink-800 active:scale-[0.99]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime/15 text-lime-neon">
            <Trophy size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-extrabold text-white">{t('empty.challenges')}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  completedCount === challenges.length && challenges.length > 0
                    ? 'bg-lime/20 text-lime-neon'
                    : 'bg-ink-700 text-slate-300'
                }`}
              >
                {completedCount}/{challenges.length}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {next ? t('empty.next', { title: next.title }) : t('empty.allDone')}
            </p>
          </div>
          <ChevronRight
            size={18}
            className="shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-lime-neon"
          />
        </button>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
          <Heart size={14} className="text-coral-neon" />
          <span>{t('empty.footer')}</span>
        </div>
      </div>
    </div>
  );
}
