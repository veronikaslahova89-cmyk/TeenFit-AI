import { ArrowLeft, Calendar, Sparkles, Clock, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import type { WeeklyPlan } from '../types';

interface Props {
  plan: WeeklyPlan;
  onBack: () => void;
}

export default function WeeklyPlanView({ plan, onBack }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Назад до вибору
      </button>

      <div className="mb-5 animate-fade-up rounded-2xl border border-ink-600 bg-ink-800/80 p-5 shadow-card">
        <div className="flex items-center gap-2">
          <Calendar size={22} className="text-lime-neon" />
          <h2 className="text-xl font-extrabold text-white">{plan.title}</h2>
        </div>
        <p className="mt-1.5 text-sm text-slate-400">
          7 днів збалансованого навантаження — чергуй енергію, спину й прес для максимального результату.
        </p>
      </div>

      <div className="space-y-2.5">
        {plan.days.map((day, i) => {
          const open = openIdx === i;
          const isRest = day.focus.toLowerCase().includes('відпочинок') || day.focus.toLowerCase().includes('відновлення');
          return (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border transition-all ${
                open ? 'border-lime/40 bg-ink-700/80' : 'border-ink-600 bg-ink-800/50'
              }`}
            >
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                  isRest ? 'bg-slate-700 text-slate-300' : 'bg-lime/15 text-lime-neon'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{day.day}</p>
                  <p className="text-xs text-slate-400">{day.focus}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-ink-900/60 px-2.5 py-1 text-xs font-semibold text-slate-300">
                  <Clock size={11} />
                  {day.duration}
                </span>
              </button>

              {open && (
                <div className="border-t border-ink-600 px-4 py-3.5 animate-fade-up">
                  <div className="mb-2.5 flex items-center gap-1.5">
                    <Dumbbell size={14} className="text-lime-neon" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Вправи</p>
                  </div>
                  <ul className="mb-3 space-y-1.5">
                    {day.exercises.map((ex, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-0.5 text-lime-neon">•</span>
                        {ex}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-start gap-2 rounded-xl bg-lime/5 p-2.5">
                    <Sparkles size={14} className="mt-0.5 shrink-0 text-lime-neon" />
                    <p className="text-xs leading-relaxed text-slate-300">{day.motivation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
