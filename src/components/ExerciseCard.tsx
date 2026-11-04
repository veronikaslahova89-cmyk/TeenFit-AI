import { Lightbulb, Timer as TimerIcon } from 'lucide-react';
import type { Exercise } from '../types';

interface Props {
  exercise: Exercise;
  index: number;
  active: boolean;
}

export default function ExerciseCard({ exercise, index, active }: Props) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        active
          ? 'border-lime/50 bg-ink-700/80 shadow-card'
          : 'border-ink-600 bg-ink-800/40 opacity-60'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime/15 text-xs font-bold text-lime-neon">
          {index + 1}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-ink-900/60 px-2.5 py-1 text-xs font-semibold text-slate-300">
          <TimerIcon size={12} />
          {exercise.reps ?? `${exercise.duration}с`}
        </span>
      </div>
      <h4 className={`text-base font-bold ${active ? 'text-white' : 'text-slate-400'}`}>{exercise.name}</h4>
      <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-ink-900/50 p-2.5">
        <Lightbulb size={15} className="mt-0.5 shrink-0 text-amber-400" />
        <p className="text-xs leading-relaxed text-slate-400">
          <span className="font-semibold text-amber-300">Лайфхак техніки: </span>
          {exercise.tip}
        </p>
      </div>
    </div>
  );
}
