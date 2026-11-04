import { Rocket, Calendar, AlertCircle, Clock } from 'lucide-react';
import type { Level, GoalId, TimeOption } from '../types';
import { LEVELS, GOALS, TIME_OPTIONS } from '../types';

interface Props {
  level: Level | null;
  goal: GoalId | null;
  minutes: TimeOption;
  onLevel: (l: Level) => void;
  onGoal: (g: GoalId) => void;
  onMinutes: (m: TimeOption) => void;
  onGenerate: () => void;
  onWeekly: () => void;
  error: string | null;
  compact?: boolean;
}

export default function InputPanel({
  level, goal, minutes, onLevel, onGoal, onMinutes, onGenerate, onWeekly, error, compact,
}: Props) {
  return (
    <div className={`mx-auto max-w-2xl px-4 sm:px-6 ${compact ? 'py-4' : 'py-6'}`}>
      <div className={`rounded-3xl border border-ink-600 bg-ink-800/80 p-5 shadow-card sm:p-6 ${compact ? '' : 'animate-fade-up'}`}>
        {/* Level */}
        <div className="mb-5">
          <p className="mb-2.5 text-sm font-bold text-white">Рівень підготовки</p>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => onLevel(l.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition active:scale-[0.97] ${
                  level === l.id
                    ? 'border-lime bg-lime/15 text-white shadow-neon'
                    : 'border-ink-600 bg-ink-900/40 text-slate-400 hover:border-ink-500 hover:text-slate-200'
                }`}
              >
                <span className="text-2xl">{l.emoji}</span>
                <span className="text-xs font-semibold leading-tight">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="mb-5">
          <p className="mb-2.5 text-sm font-bold text-white">Що ти хочеш сьогодні?</p>
          <div className="grid gap-2">
            {GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => onGoal(g.id)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition active:scale-[0.98] ${
                  goal === g.id
                    ? 'border-lime bg-lime/15 text-white'
                    : 'border-ink-600 bg-ink-900/40 text-slate-300 hover:border-ink-500'
                }`}
              >
                <span className="text-xl">{g.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{g.label}</p>
                  <p className="text-xs text-slate-500">{g.minutes} хв</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="mb-5">
          <p className="mb-2.5 flex items-center gap-1.5 text-sm font-bold text-white">
            <Clock size={16} className="text-lime-neon" />
            Скільки маєш вільного часу
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => onMinutes(t)}
                className={`rounded-xl border py-2.5 text-sm font-bold transition active:scale-[0.97] ${
                  minutes === t
                    ? 'border-lime bg-lime/15 text-lime-neon'
                    : 'border-ink-600 bg-ink-900/40 text-slate-400 hover:border-ink-500'
                }`}
              >
                {t} хв
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <AlertCircle size={18} className="shrink-0 text-amber-400" />
            <p className="text-sm font-medium text-amber-200">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={onGenerate}
            className="group flex items-center justify-center gap-2.5 rounded-2xl bg-lime px-5 py-4 text-base font-extrabold text-ink-900 shadow-neon transition hover:brightness-110 active:scale-[0.98]"
          >
            <Rocket size={20} className="transition group-hover:translate-x-0.5" />
            Підібрати тренування
          </button>
          <button
            onClick={onWeekly}
            className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-ink-500 bg-ink-900/40 px-5 py-4 text-base font-bold text-white transition hover:border-lime/40 active:scale-[0.98]"
          >
            <Calendar size={20} className="text-lime-neon" />
            План на тиждень
          </button>
        </div>
      </div>
    </div>
  );
}
