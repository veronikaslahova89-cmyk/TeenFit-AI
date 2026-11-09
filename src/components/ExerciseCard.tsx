import { Heart, Lightbulb, Timer as TimerIcon } from 'lucide-react';
import type { Exercise } from '../types';
import { useI18n } from '../i18n';

interface Props {
  exercise: Exercise;
  index: number;
  active: boolean;
  isFavorite: boolean;
  onToggleFavorite: (exercise: Exercise) => void;
}

export default function ExerciseCard({
  exercise,
  index,
  active,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const { t } = useI18n();

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        active
          ? 'border-lime/50 bg-ink-700/80 shadow-card'
          : 'border-ink-600 bg-ink-800/40 opacity-60'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime/15 text-xs font-bold text-lime-neon">
          {index + 1}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(exercise)}
            aria-label={t(isFavorite ? 'favorites.remove' : 'favorites.add')}
            aria-pressed={isFavorite}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${
              isFavorite
                ? 'text-rose-400 hover:bg-rose-400/10'
                : 'text-slate-400 hover:bg-ink-700 hover:text-rose-300'
            }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <span className="flex items-center gap-1 rounded-full bg-ink-900/60 px-2.5 py-1 text-xs font-semibold text-slate-300">
            <TimerIcon size={12} />
            {exercise.reps ?? `${exercise.duration}${t('common.secShort')}`}
          </span>
        </div>
      </div>
      <h4 className={`text-base font-bold ${active ? 'text-white' : 'text-slate-400'}`}>
        {exercise.name}
      </h4>
      <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-ink-900/50 p-2.5">
        <Lightbulb size={15} className="mt-0.5 shrink-0 text-amber-400" />
        <p className="text-xs leading-relaxed text-slate-400">
          <span className="font-semibold text-amber-300">{t('workout.techniqueTip')}</span>
          {exercise.tip}
        </p>
      </div>
    </div>
  );
}
