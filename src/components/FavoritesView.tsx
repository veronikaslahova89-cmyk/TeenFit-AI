import { ArrowLeft, Heart } from 'lucide-react';
import type { Exercise } from '../types';
import { useI18n } from '../i18n';
import ExerciseCard from './ExerciseCard';

interface Props {
  exercises: Exercise[];
  onBack: () => void;
  onToggleFavorite: (exercise: Exercise) => void;
}

export default function FavoritesView({ exercises, onBack, onToggleFavorite }: Props) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
      >
        <ArrowLeft size={18} />
        {t('favorites.back')}
      </button>

      <div className="mb-5 flex items-center gap-2">
        <Heart size={20} className="text-rose-400" fill="currentColor" />
        <h2 className="text-xl font-extrabold text-white">{t('favorites.saved')}</h2>
      </div>

      {exercises.length ? (
        <div className="space-y-2.5">
          {exercises.map((exercise, index) => (
            <ExerciseCard
              key={`${exercise.name}-${index}`}
              exercise={exercise}
              index={index}
              active
              isFavorite
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-ink-600 bg-ink-800/60 px-4 py-6 text-center text-sm font-semibold text-slate-300">
          {t('favorites.empty')}
        </p>
      )}
    </div>
  );
}