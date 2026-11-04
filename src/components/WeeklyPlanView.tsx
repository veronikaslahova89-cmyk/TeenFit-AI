import { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Coffee, Dumbbell, Sparkles } from 'lucide-react';
import type { Level, WeeklyPlan } from '../types';
import { LEVELS } from '../types';
import { WEEKDAYS_SHORT, useI18n } from '../i18n';
import { getWeekLabel } from '../challenges';

interface Props {
  plan: WeeklyPlan;
  level: Level | null;
  onBack: () => void;
  onLevelChange: (level: Level) => void;
}

function isRestDay(focus: string): boolean {
  const lower = focus.toLowerCase();
  return (
    lower.includes('відпочинок') ||
    lower === 'rest' ||
    lower.includes('rest day') ||
    lower.includes('day off')
  );
}

function startOfCurrentWeek(): Date {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

export default function WeeklyPlanView({ plan, level, onBack, onLevelChange }: Props) {
  const { lang, t } = useI18n();
  const todayIndex = (new Date().getDay() + 6) % 7;
  const [openIdx, setOpenIdx] = useState(() =>
    Math.min(todayIndex, Math.max(0, plan.days.length - 1)),
  );

  const weekDates = useMemo(() => {
    const monday = startOfCurrentWeek();
    return plan.days.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }, [plan.days]);

  const selected = plan.days[openIdx] ?? plan.days[0];
  if (!selected) return null;

  const selectedRest = isRestDay(selected.focus);
  const selectedIsToday = openIdx === todayIndex;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        {t('common.back')}
      </button>

      {/* Plan header */}
      <div className="mb-4 animate-fade-up rounded-3xl border border-ink-600 bg-gradient-to-br from-ink-800 to-ink-700/60 p-5 shadow-card sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime/15 text-lime-neon">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-lime-neon">
              {getWeekLabel(lang)}
            </p>
            <h2 className="mt-0.5 text-xl font-extrabold text-white">{plan.title}</h2>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{t('weekly.intro')}</p>
      </div>

      {/* Level selector */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          {t('weekly.level')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((item) => (
            <button
              key={item.id}
              onClick={() => onLevelChange(item.id)}
              aria-pressed={level === item.id}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold transition active:scale-[0.97] ${
                level === item.id
                  ? 'border-lime bg-lime/15 text-lime-neon'
                  : 'border-ink-600 bg-ink-900/40 text-slate-400 hover:border-ink-500'
              }`}
            >
              <span className="text-base">{item.emoji}</span>
              {item.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Week strip */}
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-7 sm:px-0">
        {plan.days.map((day, index) => {
          const open = openIdx === index;
          const today = index === todayIndex;
          const rest = isRestDay(day.focus);
          const date = weekDates[index];

          return (
            <button
              key={`${day.day}-${index}`}
              onClick={() => setOpenIdx(index)}
              aria-pressed={open}
              aria-label={`${day.day}, ${day.focus}`}
              className={`min-w-[74px] flex-1 rounded-2xl border px-2 py-2.5 text-center transition active:scale-[0.97] sm:min-w-0 ${
                open
                  ? 'border-lime bg-lime/15 shadow-neon'
                  : 'border-ink-600 bg-ink-800/60 hover:border-ink-500'
              }`}
            >
              <span
                className={`block text-[10px] font-extrabold uppercase tracking-wide ${
                  open ? 'text-lime-neon' : 'text-slate-400'
                }`}
              >
                {WEEKDAYS_SHORT[lang][index] ?? day.day.slice(0, 3)}
              </span>
              <span className="mt-0.5 block text-lg font-extrabold leading-none text-white">
                {date.getDate()}
              </span>
              <span
                className={`mt-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                  rest ? 'bg-slate-500' : open ? 'bg-lime-neon' : 'bg-slate-500'
                }`}
              />
              {today && (
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-wide text-lime-neon">
                  {t('weekly.today')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day */}
      <div className="rounded-3xl border border-ink-600 bg-ink-800/80 p-5 shadow-card animate-fade-up">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">{selected.day}</h3>
              {selectedIsToday && (
                <span className="rounded-full bg-lime/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-lime-neon">
                  {t('weekly.today')}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-semibold text-slate-400">{selected.focus}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-ink-900/60 px-2.5 py-1 text-xs font-semibold text-slate-300">
            <Clock size={11} />
            {selected.duration}
          </span>
        </div>

        {selectedRest ? (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-ink-600 bg-ink-900/40 p-3.5">
            <Coffee size={18} className="mt-0.5 shrink-0 text-slate-400" />
            <p className="text-sm leading-relaxed text-slate-300">{t('weekly.restDay')}</p>
          </div>
        ) : (
          <>
            <div className="mb-2.5 mt-4 flex items-center gap-1.5">
              <Dumbbell size={14} className="text-lime-neon" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('weekly.exercises')}
              </p>
            </div>
            <ul className="space-y-2">
              {selected.exercises.map((exercise, index) => (
                <li
                  key={`${exercise}-${index}`}
                  className="flex items-start gap-2 rounded-xl bg-ink-900/40 px-3 py-2 text-sm text-slate-300"
                >
                  <span className="mt-0.5 text-lime-neon">•</span>
                  {exercise}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-lime/5 p-3">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-lime-neon" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-lime-neon">
              {t('weekly.motivation')}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-300">{selected.motivation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
