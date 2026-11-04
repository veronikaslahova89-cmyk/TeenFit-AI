import type { WorkoutHistoryEntry } from './types';

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

export const CHALLENGES: ChallengeDef[] = [
  {
    id: 'workouts3',
    emoji: '🏋️',
    title: '3 тренування за тиждень',
    description: 'Тримай ритм: три сесії до неділі.',
    target: 3,
    unit: 'тренувань',
  },
  {
    id: 'minutes30',
    emoji: '⏱️',
    title: '30 хвилин руху',
    description: 'Сумарно 30 хвилин активності за тиждень.',
    target: 30,
    unit: 'хв',
  },
  {
    id: 'days4',
    emoji: '📅',
    title: '4 активні дні',
    description: 'Тренуйся в різні дні — так звичка міцніша.',
    target: 4,
    unit: 'днів',
  },
  {
    id: 'streak3',
    emoji: '🔥',
    title: 'Серія 3 дні',
    description: 'Три дні поспіль без пропусків.',
    target: 3,
    unit: 'днів',
  },
];

export function plural(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

const MONTHS_GENITIVE = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
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
export function getWeekLabel(now = new Date()): string {
  const start = startOfWeek(now);
  const end = endOfWeek(now);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const yearSuffix = start.getFullYear() !== end.getFullYear() ? ` ${end.getFullYear()}` : '';

  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${MONTHS_GENITIVE[start.getMonth()]}`;
  }
  return `${start.getDate()} ${MONTHS_GENITIVE[start.getMonth()]} – ${end.getDate()} ${MONTHS_GENITIVE[end.getMonth()]}${yearSuffix}`;
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
  now = new Date(),
): ChallengeProgress[] {
  const stats = getWeeklyStats(history, streak, now);
  const currentById: Record<ChallengeId, number> = {
    workouts3: stats.workouts,
    minutes30: stats.minutes,
    days4: stats.activeDays,
    streak3: stats.streak,
  };

  return CHALLENGES.map((def) => {
    const raw = Math.max(0, currentById[def.id]);
    return {
      ...def,
      current: Math.min(raw, def.target),
      completed: raw >= def.target,
    };
  });
}

export function countCompleted(challenges: ChallengeProgress[]): number {
  return challenges.filter((challenge) => challenge.completed).length;
}

export function nextChallenge(challenges: ChallengeProgress[]): ChallengeProgress | undefined {
  return challenges.find((challenge) => !challenge.completed);
}
