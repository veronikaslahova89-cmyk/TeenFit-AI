import { CalendarDays, Check, Clock, Dumbbell, Share2, Trophy, X } from 'lucide-react';
import type { ChallengeProgress, WeeklyStats } from '../challenges';
import { countCompleted, plural } from '../challenges';

interface Props {
  challenges: ChallengeProgress[];
  stats: WeeklyStats;
  weekLabel: string;
  canShare: boolean;
  onClose: () => void;
  onShare: () => void;
}

export default function ChallengesModal({
  challenges,
  stats,
  weekLabel,
  canShare,
  onClose,
  onShare,
}: Props) {
  const completedCount = countCompleted(challenges);
  const allDone = completedCount === challenges.length;
  const workoutsLabel = plural(stats.workouts, 'тренування', 'тренування', 'тренувань');
  const minutesLabel = plural(stats.minutes, 'хвилина', 'хвилини', 'хвилин');
  const activeDaysLabel = plural(stats.activeDays, 'активний день', 'активні дні', 'активних днів');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-ink-600 bg-ink-800 p-5 shadow-card animate-pop-in sm:p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-ink-600 hover:text-white"
          aria-label="Закрити"
        >
          <X size={20} />
        </button>

        <div className="mb-5 flex items-start gap-3 pr-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lime/20 to-emerald-500/10 text-lime-neon">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Тижневі челенджі</h2>
            <p className="text-sm text-slate-400">{weekLabel}</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-ink-600 bg-ink-900/50 p-3 text-center">
            <Dumbbell size={16} className="mx-auto mb-1 text-lime-neon" />
            <p className="text-lg font-extrabold leading-none text-white">{stats.workouts}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">{workoutsLabel}</p>
          </div>
          <div className="rounded-2xl border border-ink-600 bg-ink-900/50 p-3 text-center">
            <Clock size={16} className="mx-auto mb-1 text-coral-neon" />
            <p className="text-lg font-extrabold leading-none text-white">{stats.minutes}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">{minutesLabel}</p>
          </div>
          <div className="rounded-2xl border border-ink-600 bg-ink-900/50 p-3 text-center">
            <CalendarDays size={16} className="mx-auto mb-1 text-sky-400" />
            <p className="text-lg font-extrabold leading-none text-white">{stats.activeDays}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">{activeDaysLabel}</p>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Твій прогрес</p>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            allDone ? 'bg-lime/20 text-lime-neon' : 'bg-ink-700 text-slate-300'
          }`}>
            {completedCount} з {challenges.length}
          </span>
        </div>

        <div className="space-y-2.5">
          {challenges.map((challenge) => {
            const percent = Math.round((challenge.current / challenge.target) * 100);
            return (
              <div
                key={challenge.id}
                className={`rounded-2xl border p-3.5 transition ${
                  challenge.completed
                    ? 'border-lime/35 bg-lime/10'
                    : 'border-ink-600 bg-ink-900/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-900/60 text-xl">
                    {challenge.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{challenge.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                          {challenge.description}
                        </p>
                      </div>
                      {challenge.completed ? (
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-ink-900">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-ink-700 px-2 py-1 text-xs font-bold text-slate-300">
                          {challenge.current}/{challenge.target}
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink-700">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          challenge.completed ? 'bg-lime' : 'bg-lime/60'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className={`mt-1.5 text-[11px] font-semibold ${
                      challenge.completed ? 'text-lime-neon' : 'text-slate-500'
                    }`}>
                      {challenge.completed
                        ? 'Виконано — так тримати!'
                        : `${challenge.current} з ${challenge.target} ${challenge.unit}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          {canShare ? (
            <button
              onClick={onShare}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime py-3 text-sm font-bold text-ink-900 shadow-neon transition hover:brightness-110 active:scale-[0.98]"
            >
              <Share2 size={17} />
              Поділитися результатом
            </button>
          ) : (
            <p className="rounded-xl border border-ink-600 bg-ink-900/40 px-4 py-3 text-center text-xs leading-relaxed text-slate-400">
              Заверши перше тренування — і зможеш поділитися своїм результатом з друзями.
            </p>
          )}
          <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
            Челенджі оновлюються щопонеділка. Прогрес зберігається на цьому пристрої.
          </p>
        </div>
      </div>
    </div>
  );
}
