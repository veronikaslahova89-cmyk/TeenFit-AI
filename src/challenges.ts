import type { Language, WorkoutHistoryEntry } from './types';
import { MONTHS } from './i18n';

export type ChallengeId = 'workouts3' | 'minutes30' | 'days4' | 'streak3';

export interface ChallengeDef {
  id: ChallengeId;
  emoji: string;
  title: string;
  description: string;
  target: number;
  unit: string;
}

export interface ChallengeProgress extends ChallengeDef {
  current: number;
  completed: boolean;
}

export interface WeeklyStats {
  workouts: number;
  minutes: number;
  activeDays: number;
  streak: number;
}

const CHALLENGE_CONTENT: Record<
  ChallengeId,
  Record<Language, { title: string; description: string; unit: string }>
> = {
  workouts3: {
    uk: {
      title: '3 тренування за тиждень',
      description: 'Тримай ритм: три сесії до неділі.',
      unit: 'тренувань',
    },
    en: {
      title: '3 workouts this week',
      description: 'Keep the rhythm: three sessions by Sunday.',
      unit: 'workouts',
    },
  },
  minutes30: {
    uk: {
      title: '30 хвилин руху',
      description: 'Сумарно 30 хвилин активності за тиждень.',
      unit: 'хв',
    },
    en: {
      title: '30 minutes of movement',
      description: 'A total of 30 active minutes this week.',
      unit: 'min',
    },
  },
  days4: {
    uk: {
      title: '4 активні дні',
      description: 'Тренуйся в різні дні — так звичка міцніша.',
      unit: 'днів',
    },
    en: {
      title: '4 active days',
      description: 'Work out on different days — habits stick better that way.',
      unit: 'days',
    },
  },
  streak3: {
    uk: {
      title: 'Серія 3 дні',
      description: 'Три дні поспіль без пропусків.',
      unit: 'днів',
    },
    en: {
      title: '3-day streak',
      description: 'Three days in a row without skipping.',
      unit: 'days',
    },
  },
};

const CHALLENGE_META: { id: ChallengeId; emoji: string; target: number }[] = [
  { id: 'workouts3', emoji: '🏋️', target: 3 },
  { id: 'minutes30', emoji: '⏱️', target: 30 },
  { id: 'days4', emoji: '📅', target: 4 },
  { id: 'streak3', emoji: '🔥', target: 3 },
];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfWeek(now: Date): Date {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const mondayOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayOffset);
  return start;
}

function endOfWeek(now: Date): Date {
  const end = startOfWeek(now);
  end.setDate(end.getDate() + 6);
  return end;
}

/** Human-readable range of the current Monday–Sunday week, e.g. «3–9 листопада». */
export function getWeekLabel(lang: Language, now = new Date()): string {
  const start = startOfWeek(now);
  const end = endOfWeek(now);
  const months = MONTHS[lang];
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const yearSuffix = start.getFullYear() !== end.getFullYear() ? ` ${end.getFullYear()}` : '';

  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${months[start.getMonth()]}`;
  }
  return `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]}${yearSuffix}`;
}

export function getWeeklyStats(
  history: WorkoutHistoryEntry[],
  streak: number,
  now = new Date(),
): WeeklyStats {
  const start = formatDate(startOfWeek(now));
  const end = formatDate(endOfWeek(now));
  const entries = history.filter((entry) => entry.date >= start && entry.date <= end);
  const activeDays = new Set(entries.map((entry) => entry.date)).size;
  const minutes = entries.reduce(
    (sum, entry) => sum + (Number.isFinite(entry.minutes) ? entry.minutes : 0),
    0,
  );

  return { workouts: entries.length, minutes, activeDays, streak };
}

export function getChallenges(
  history: WorkoutHistoryEntry[],
  streak: number,
  lang: Language,
  now = new Date(),
): ChallengeProgress[] {
  const stats = getWeeklyStats(history, streak, now);
  const currentById: Record<ChallengeId, number> = {
    workouts3: stats.workouts,
    minutes30: stats.minutes,
    days4: stats.activeDays,
    streak3: stats.streak,
  };

  return CHALLENGE_META.map((meta) => {
    const content = CHALLENGE_CONTENT[meta.id][lang];
    const raw = Math.max(0, currentById[meta.id]);
    return {
      id: meta.id,
      emoji: meta.emoji,
      title: content.title,
      description: content.description,
      target: meta.target,
      unit: content.unit,
      current: Math.min(raw, meta.target),
      completed: raw >= meta.target,
    };
  });
}

export function countCompleted(challenges: ChallengeProgress[]): number {
  return challenges.filter((challenge) => challenge.completed).length;
}

export function nextChallenge(challenges: ChallengeProgress[]): ChallengeProgress | undefined {
  return challenges.find((challenge) => !challenge.completed);
}
