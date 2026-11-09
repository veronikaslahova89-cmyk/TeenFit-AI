export type Level = 'beginner' | 'amateur' | 'regular';

export type GoalId = 'energy' | 'back' | 'core';

export type Screen = 'empty' | 'inputs' | 'loading' | 'workout' | 'weekly' | 'favorites';

export type Language = 'uk' | 'en';

export interface Exercise {
  name: string;
  duration: number; // seconds
  reps?: string;
  tip: string;
}

export interface Workout {
  title: string;
  exercises: Exercise[];
  motivation: string;
  warmup: string;
  /** Shown when the workout was adjusted based on the previous feedback. */
  adaptation?: string;
}

export interface DayPlan {
  day: string;
  focus: string;
  duration: string;
  exercises: string[];
  motivation: string;
}

export interface WeeklyPlan {
  title: string;
  days: DayPlan[];
}

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  unlockedAt: string;
}

export interface Settings {
  apiKey: string;
  model: string;
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM
  language: Language;
  soundEnabled: boolean;
}

export type Difficulty = 'easy' | 'ok' | 'hard';
export type SorenessId = 'back' | 'knees' | 'shoulders' | 'none';

export interface WorkoutFeedback {
  difficulty: Difficulty;
  soreness: SorenessId[];
  note?: string;
}

export interface WorkoutHistoryEntry {
  date: string; // YYYY-MM-DD
  level: Level;
  goal: GoalId;
  minutes: number;
  workoutTitle: string;
  difficulty: Difficulty | null;
  soreness: SorenessId[];
  note?: string;
}

export interface AppData {
  streak: number;
  lastCompleted: string | null; // YYYY-MM-DD
  totalCompleted: number;
  achievements: Achievement[];
  history: WorkoutHistoryEntry[];
}

export const DIFFICULTY_OPTIONS: {
  id: Difficulty;
  label: Record<Language, string>;
  emoji: string;
  hint: Record<Language, string>;
}[] = [
  {
    id: 'easy',
    label: { uk: 'Легко', en: 'Easy' },
    emoji: '😌',
    hint: { uk: 'Наступного разу трохи складніше', en: 'A bit harder next time' },
  },
  {
    id: 'ok',
    label: { uk: 'В самий раз', en: 'Just right' },
    emoji: '💪',
    hint: { uk: 'Ідеальне навантаження', en: 'Perfect intensity' },
  },
  {
    id: 'hard',
    label: { uk: 'Важко', en: 'Hard' },
    emoji: '🥵',
    hint: { uk: 'Наступного разу легше', en: 'A bit easier next time' },
  },
];

export const SORENESS_OPTIONS: { id: SorenessId; label: Record<Language, string> }[] = [
  { id: 'back', label: { uk: 'Спина', en: 'Back' } },
  { id: 'knees', label: { uk: 'Коліна', en: 'Knees' } },
  { id: 'shoulders', label: { uk: 'Плечі', en: 'Shoulders' } },
  { id: 'none', label: { uk: 'Нічого', en: 'Nothing' } },
];

export const LEVELS: { id: Level; label: Record<Language, string>; emoji: string }[] = [
  { id: 'beginner', label: { uk: 'Тільки починаю', en: 'Just starting' }, emoji: '🐣' },
  { id: 'amateur', label: { uk: 'Любитель', en: 'Amateur' }, emoji: '⚡' },
  { id: 'regular', label: { uk: 'Займаюся регулярно', en: 'I train regularly' }, emoji: '🔥' },
];

export const GOALS: {
  id: GoalId;
  label: Record<Language, string>;
  emoji: string;
  minutes: number;
}[] = [
  {
    id: 'energy',
    label: { uk: 'Швидкий заряд енергії', en: 'Quick energy boost' },
    emoji: '⚡',
    minutes: 10,
  },
  {
    id: 'back',
    label: { uk: 'Зняти напругу в спині після уроків', en: 'Release back tension after school' },
    emoji: '🧘',
    minutes: 15,
  },
  {
    id: 'core',
    label: { uk: 'Потужний прес і руки', en: 'Strong core and arms' },
    emoji: '💪',
    minutes: 15,
  },
];

export const TIME_OPTIONS = [10, 15, 20] as const;
export type TimeOption = (typeof TIME_OPTIONS)[number];

export interface ModelOption {
  id: string;
  name: string;
  hint: Record<Language, string>;
}

/** Free OpenRouter models verified to return the JSON shape used by the app. */
export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'nvidia/nemotron-3.5-super-vl:free',
    name: 'NVIDIA Nemotron 3.5 Super VL',
    hint: { uk: 'Універсальна · контекст 1M', en: 'Universal · 1M context' },
  },
  {
    id: 'dots-studio/dots-3-note-preview:free',
    name: 'Dots3-Note Preview',
    hint: { uk: 'Найстабільніший JSON · контекст 512K', en: 'Most stable JSON · 512K context' },
  },
  {
    id: 'nvidia/nemotron-3.5-lightning:free',
    name: 'NVIDIA Nemotron 3.5 Lightning',
    hint: { uk: 'Компактна · довші reasoning-відповіді', en: 'Compact · longer reasoning answers' },
  },
  {
    id: 'xingchen-agi/xing4.0-29b-a4b:free',
    name: 'Xing4.0 29B A4B',
    hint: { uk: 'Контекст 262K · можливі upstream-ліміти', en: '262K context · possible upstream limits' },
  },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0].id;

export const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  model: DEFAULT_MODEL,
  reminderEnabled: false,
  reminderTime: '18:00',
  language: 'uk',
  soundEnabled: true,
};

/** Models that are no longer served by OpenRouter and must be migrated. */
export const DEPRECATED_MODELS = new Set(['google/gemini-2.0-flash-exp:free']);
