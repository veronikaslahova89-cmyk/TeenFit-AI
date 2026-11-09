import type {
  AppData,
  Achievement,
  Exercise,
  Language,
  Settings,
  WorkoutHistoryEntry,
} from './types';
import { DEFAULT_MODEL, DEFAULT_SETTINGS, DEPRECATED_MODELS } from './types';

const DATA_KEY = 'teenfit_data';
const SETTINGS_KEY = 'teenfit_settings';
const FAVORITES_KEY = 'visualsport_favorite_exercises';

export function isSameExercise(a: Exercise, b: Exercise): boolean {
  return a.name === b.name && a.duration === b.duration && a.reps === b.reps && a.tip === b.tip;
}

function isExercise(value: unknown): value is Exercise {
  if (!value || typeof value !== 'object') return false;
  const exercise = value as Partial<Exercise>;
  return (
    typeof exercise.name === 'string' &&
    typeof exercise.duration === 'number' &&
    Number.isFinite(exercise.duration) &&
    typeof exercise.tip === 'string' &&
    (exercise.reps === undefined || typeof exercise.reps === 'string')
  );
}

export function loadFavoriteExercises(): Exercise[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isExercise) : [];
  } catch {
    return [];
  }
}

export function saveFavoriteExercises(exercises: Exercise[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(exercises));
  } catch {
    // ignore
  }
}

export const DEFAULT_DATA: AppData = {
  streak: 0,
  lastCompleted: null,
  totalCompleted: 0,
  achievements: [],
  history: [],
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      ...DEFAULT_DATA,
      ...parsed,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function normalizeModel(model: string | undefined): string {
  if (!model || DEPRECATED_MODELS.has(model)) return DEFAULT_MODEL;
  return model;
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      apiKey: parsed.apiKey ?? '',
      model: normalizeModel(parsed.model),
      reminderEnabled: parsed.reminderEnabled === true,
      reminderTime:
        typeof parsed.reminderTime === 'string' && /^\d{2}:\d{2}$/.test(parsed.reminderTime)
          ? parsed.reminderTime
          : DEFAULT_SETTINGS.reminderTime,
      language: parsed.language === 'en' ? 'en' : 'uk',
      soundEnabled: parsed.soundEnabled !== false,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

const ACHIEVEMENT_DEFS: {
  id: string;
  emoji: string;
  title: Record<Language, string>;
  threshold: number;
}[] = [
  {
    id: 'first',
    emoji: '🏆',
    title: { uk: 'Перший крок зроблено', en: 'First step taken' },
    threshold: 1,
  },
  {
    id: 'streak1',
    emoji: '🔥',
    title: { uk: 'Стрік 1 день', en: '1-day streak' },
    threshold: 1,
  },
  {
    id: 'streak3',
    emoji: '⚡',
    title: { uk: 'Стрік 3 дні', en: '3-day streak' },
    threshold: 3,
  },
  {
    id: 'streak7',
    emoji: '💎',
    title: { uk: 'Стрік 7 днів', en: '7-day streak' },
    threshold: 7,
  },
  {
    id: 'streak14',
    emoji: '👑',
    title: { uk: 'Стрік 14 днів', en: '14-day streak' },
    threshold: 14,
  },
  {
    id: 'total5',
    emoji: '🚀',
    title: { uk: '5 тренувань', en: '5 workouts' },
    threshold: 5,
  },
  {
    id: 'total10',
    emoji: '🌟',
    title: { uk: '10 тренувань', en: '10 workouts' },
    threshold: 10,
  },
];

export function getAchievementTitle(lang: Language, id: string, fallback: string): string {
  return ACHIEVEMENT_DEFS.find((def) => def.id === id)?.title[lang] ?? fallback;
}

function todayStr(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a + 'T00:00:00');
  const d2 = new Date(b + 'T00:00:00');
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}

export function completeWorkout(
  data: AppData,
  entry?: Omit<WorkoutHistoryEntry, 'date'>,
  language: Language = 'uk',
): { data: AppData; newBadges: Achievement[] } {
  const today = todayStr();
  let streak = data.streak;
  if (data.lastCompleted) {
    const diff = daysBetween(data.lastCompleted, today);
    if (diff === 1) streak = data.streak + 1;
    else if (diff === 0) streak = Math.max(data.streak, 1);
    else streak = 1;
  } else {
    streak = 1;
  }

  const totalCompleted = data.totalCompleted + 1;
  const newBadges: Achievement[] = [];

  const existingIds = new Set(data.achievements.map((a) => a.id));
  for (const def of ACHIEVEMENT_DEFS) {
    const met =
      (def.id.startsWith('streak') && streak >= def.threshold) ||
      (def.id.startsWith('total') && totalCompleted >= def.threshold) ||
      (def.id === 'first' && totalCompleted >= 1);
    if (met && !existingIds.has(def.id)) {
      newBadges.push({
        id: def.id,
        emoji: def.emoji,
        title: def.title[language],
        unlockedAt: today,
      });
    }
  }

  const updated: AppData = {
    streak,
    lastCompleted: today,
    totalCompleted,
    achievements: [...data.achievements, ...newBadges],
    history: entry
      ? [...(data.history ?? []), { date: today, ...entry }].slice(-30)
      : (data.history ?? []),
  };
  saveData(updated);
  return { data: updated, newBadges };
}
