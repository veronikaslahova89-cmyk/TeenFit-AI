export type Level = 'beginner' | 'amateur' | 'regular';

export type GoalId = 'energy' | 'back' | 'core';

export type Screen = 'empty' | 'inputs' | 'loading' | 'workout' | 'weekly';

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

export const DIFFICULTY_OPTIONS: { id: Difficulty; label: string; emoji: string; hint: string }[] = [
  { id: 'easy', label: 'Легко', emoji: '😌', hint: 'Наступного разу трохи складніше' },
  { id: 'ok', label: 'В самий раз', emoji: '💪', hint: 'Ідеальне навантаження' },
  { id: 'hard', label: 'Важко', emoji: '🥵', hint: 'Наступного разу легше' },
];

export const SORENESS_OPTIONS: { id: SorenessId; label: string }[] = [
  { id: 'back', label: 'Спина' },
  { id: 'knees', label: 'Коліна' },
  { id: 'shoulders', label: 'Плечі' },
  { id: 'none', label: 'Нічого' },
];

export const LEVELS: { id: Level; label: string; emoji: string }[] = [
  { id: 'beginner', label: 'Тільки починаю', emoji: '🐣' },
  { id: 'amateur', label: 'Любитель', emoji: '⚡' },
  { id: 'regular', label: 'Займаюся регулярно', emoji: '🔥' },
];

export const GOALS: { id: GoalId; label: string; emoji: string; minutes: number }[] = [
  { id: 'energy', label: 'Швидкий заряд енергії', emoji: '⚡', minutes: 10 },
  { id: 'back', label: 'Зняти напругу в спині після уроків', emoji: '🧘', minutes: 15 },
  { id: 'core', label: 'Потужний прес і руки', emoji: '💪', minutes: 15 },
];

export const TIME_OPTIONS = [10, 15, 20] as const;
export type TimeOption = (typeof TIME_OPTIONS)[number];

export interface ModelOption {
  id: string;
  name: string;
  hint: string;
}

/** Free OpenRouter models verified to return the JSON shape used by the app. */
export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'nvidia/nemotron-3.5-super-vl:free',
    name: 'NVIDIA Nemotron 3.5 Super VL',
    hint: 'Універсальна · контекст 1M',
  },
  {
    id: 'dots-studio/dots-3-note-preview:free',
    name: 'Dots3-Note Preview',
    hint: 'Найстабільніший JSON · контекст 512K',
  },
  {
    id: 'nvidia/nemotron-3.5-lightning:free',
    name: 'NVIDIA Nemotron 3.5 Lightning',
    hint: 'Компактна · довші reasoning-відповіді',
  },
  {
    id: 'xingchen-agi/xing4.0-29b-a4b:free',
    name: 'Xing4.0 29B A4B',
    hint: 'Контекст 262K · можливі upstream-ліміти',
  },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0].id;

export const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  model: DEFAULT_MODEL,
  reminderEnabled: false,
  reminderTime: '18:00',
};

/** Models that are no longer served by OpenRouter and must be migrated. */
export const DEPRECATED_MODELS = new Set(['google/gemini-2.0-flash-exp:free']);
