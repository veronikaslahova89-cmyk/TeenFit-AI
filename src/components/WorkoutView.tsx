import { useState, useCallback } from 'react';
import { ArrowLeft, Sparkles, Flame, Check, Heart, Dumbbell } from 'lucide-react';
import type { Exercise, Workout } from '../types';
import { useI18n } from '../i18n';
import ExerciseTimer from './ExerciseTimer';
import ExerciseCard from './ExerciseCard';
import { isSameExercise } from '../storage';

interface Props {
  workout: Workout;
  onBack: () => void;
  onComplete: () => void;
  soundEnabled: boolean;
  favoriteExercises: Exercise[];
  onToggleFavorite: (exercise: Exercise) => void;
}

export default function WorkoutView({
  workout,
  onBack,
  onComplete,
  soundEnabled,
  favoriteExercises,
  onToggleFavorite,
}: Props) {
  const { t } = useI18n();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());
  const [showFavorites, setShowFavorites] = useState(false);

  const current = workout.exercises[currentIdx];
  const isLast = currentIdx === workout.exercises.length - 1;
  const allDone = completedSet.size === workout.exercises.length;
  const visibleExercises = workout.exercises
    .map((exercise, index) => ({ exercise, index }))
    .filter(
      ({ exercise }) =>
        !showFavorites || favoriteExercises.some((favorite) => isSameExercise(favorite, exercise)),
    );

  const handleComplete = useCallback(() => {
    setCompletedSet((s) => new Set(s).add(currentIdx));
  }, [currentIdx]);

  const handleNext = useCallback(() => {
    setCompletedSet((s) => new Set(s).add(currentIdx));
    if (isLast) {
      onComplete();
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }, [currentIdx, isLast, onComplete]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        {t('common.back')}
      </button>

      {/* Title + warmup */}
      <div className="mb-5 animate-fade-up rounded-2xl border border-ink-600 bg-ink-800/80 p-5 shadow-card">
        <div className="mb-2 flex items-center gap-2">
          <Dumbbell size={20} className="text-lime-neon" />
          <h2 className="text-xl font-extrabold text-white">{workout.title}</h2>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-ink-900/50 p-3">
          <Flame size={16} className="mt-0.5 shrink-0 text-coral-neon" />
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-coral-neon">{t('workout.warmup')}</span>
            {workout.warmup}
          </p>
        </div>
      </div>

      {/* Adaptation note */}
      {workout.adaptation && (
        <div className="mb-5 flex items-start gap-2 rounded-2xl border border-lime/25 bg-lime/10 p-3.5 animate-fade-up">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-lime-neon" />
          <p className="text-sm leading-relaxed text-slate-200">{workout.adaptation}</p>
        </div>
      )}

      {/* Exercise list */}
      <div className="mb-5">
        <div className="mb-3 grid grid-cols-2 gap-2" role="group" aria-label={t('favorites.filterLabel')}>
          <button
            type="button"
            onClick={() => setShowFavorites(false)}
            aria-pressed={!showFavorites}
            className={`min-h-11 rounded-xl px-3 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${
              !showFavorites ? 'bg-lime text-ink-900' : 'bg-ink-700 text-slate-300 hover:bg-ink-600'
            }`}
          >
            {t('favorites.all')}
          </button>
          <button
            type="button"
            onClick={() => setShowFavorites(true)}
            aria-pressed={showFavorites}
            className={`min-h-11 rounded-xl px-3 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${
              showFavorites ? 'bg-lime text-ink-900' : 'bg-ink-700 text-slate-300 hover:bg-ink-600'
            }`}
          >
            {t('favorites.saved')}
          </button>
        </div>
        {visibleExercises.length ? (
          <div className="space-y-2.5">
            {visibleExercises.map(({ exercise, index }) => (
              <ExerciseCard
                key={`${exercise.name}-${index}`}
                exercise={exercise}
                index={index}
                active={index === currentIdx}
                isFavorite={favoriteExercises.some((favorite) =>
                  isSameExercise(favorite, exercise),
                )}
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

      {/* Timer */}
      <div className="mb-5 rounded-3xl border border-ink-600 bg-gradient-to-br from-ink-800 to-ink-700/60 p-6 shadow-card">
        <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-coral-neon">
          {t('workout.exerciseOf', {
            current: currentIdx + 1,
            total: workout.exercises.length,
          })}
        </p>
        <p className="mb-5 text-center text-lg font-bold text-white">{current.name}</p>
        <ExerciseTimer
          key={currentIdx}
          duration={current.duration}
          label={current.name}
          onComplete={handleComplete}
          onNext={handleNext}
          isLast={isLast}
          soundEnabled={soundEnabled}
        />
      </div>

      {/* Motivation */}
      <div className="mb-5 animate-fade-up rounded-2xl border border-lime/20 bg-gradient-to-br from-lime/10 to-emerald-500/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={18} className="text-lime-neon" />
          <p className="text-sm font-bold text-lime-neon">{t('workout.motivation')}</p>
        </div>
        <p className="text-base leading-relaxed text-slate-200">{workout.motivation}</p>
      </div>

      {/* Complete button */}
      <button
        onClick={onComplete}
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-lime py-4 text-base font-extrabold text-ink-900 shadow-neon transition hover:brightness-110 active:scale-[0.98]"
      >
        <Check size={22} />
        {t('workout.complete')}
      </button>

      {allDone && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-lime-neon">
          <Heart size={14} className="text-coral-neon" />
          {t('workout.allDone')}
        </p>
      )}
    </div>
  );
}
