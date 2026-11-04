import type {
  Difficulty,
  GoalId,
  Language,
  Level,
  SorenessId,
  WeeklyPlan,
  Workout,
  WorkoutHistoryEntry,
} from './types';
import { DEFAULT_MODEL, GOALS, LEVELS } from './types';
import { mockWorkout, mockWeeklyPlan } from './mockData';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

async function callOpenRouter(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'TeenFit AI',
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as OpenRouterResponse;
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content ?? '';
}

function tryParse<T>(raw: string): T | null {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

const SYSTEM_PROMPTS: Record<Language, string> = {
  uk: `Ти — дружній спортивний ментор для підлітків. Ти створюєш безпечні тренування з власною вагою.
Пиши українською. Відповідай ТІЛЬКИ валідним JSON без markdown-обгортки.
Будь підтримуючим, енергійним і теплим — не суворим.`,
  en: `You are a friendly fitness mentor for teenagers. You create safe bodyweight workouts.
Write in English. Reply with VALID JSON only, without markdown fences.
Be supportive, energetic, and warm — never strict.`,
};

const DIFFICULTY_LABELS: Record<Language, Record<Difficulty, string>> = {
  uk: { easy: 'легко', ok: 'в самий раз', hard: 'важко' },
  en: { easy: 'easy', ok: 'just right', hard: 'hard' },
};

const SORE_LABELS: Record<Language, Record<SorenessId, string>> = {
  uk: { back: 'спина', knees: 'коліна', shoulders: 'плечі', none: '' },
  en: { back: 'back', knees: 'knees', shoulders: 'shoulders', none: '' },
};

function historySummary(history: WorkoutHistoryEntry[], lang: Language): string {
  const recent = history.filter((h) => h.difficulty).slice(-4);
  if (!recent.length) return '';

  const lines = recent.map((h) => {
    const goal = GOALS.find((g) => g.id === h.goal)?.label[lang] ?? h.goal;
    const sore = h.soreness
      .filter((s) => s !== 'none')
      .map((s) => SORE_LABELS[lang][s])
      .join(', ');
    const note = h.note ? `, comment: ${h.note.replace(/\s+/g, ' ').trim().slice(0, 160)}` : '';

    if (lang === 'en') {
      return `- ${h.date}: ${goal}, ${h.minutes} min, difficulty “${DIFFICULTY_LABELS.en[h.difficulty!]}”${sore ? `, discomfort: ${sore}` : ''}${note}`;
    }
    return `- ${h.date}: ${goal}, ${h.minutes} хв, складність «${DIFFICULTY_LABELS.uk[h.difficulty!]}»${sore ? `, турбувало: ${sore}` : ''}${note.replace(', comment:', ', коментар:')}`;
  });

  return lang === 'en'
    ? `

Recent workouts (account for the load):
${lines.join('\n')}
If it felt easy — raise the difficulty a little. If it felt hard — lower it. Don’t load areas that felt uncomfortable.`
    : `

Останні тренування (врахуй навантаження):
${lines.join('\n')}
Якщо було легко — трохи підвищ складність. Якщо важко — знизь. Не навантажуй зони, які турбували.`;
}

function workoutPrompt(
  level: Level,
  goal: GoalId,
  minutes: number,
  history: WorkoutHistoryEntry[],
  lang: Language,
): string {
  const levelLabel = LEVELS.find((l) => l.id === level)?.label[lang] ?? level;
  const goalLabel = GOALS.find((g) => g.id === goal)?.label[lang] ?? goal;

  if (lang === 'en') {
    return `Create a workout for the level "${levelLabel}", goal "${goalLabel}", ${minutes} minutes available.
JSON format:
{
  "title": "short name",
  "warmup": "one sentence about the warm-up",
  "exercises": [
    {"name":"name","reps":"time or reps","tip":"short technique tip","duration":30}
  ],
  "motivation": "two sentences of friendly support for a teenager"
}
Exactly 3 exercises. duration is an integer number of seconds. Write all text in English.${historySummary(history, lang)}`;
  }

  return `Створи тренування для рівня "${levelLabel}", ціль "${goalLabel}", доступно ${minutes} хв.
Формат JSON:
{
  "title": "коротка назва",
  "warmup": "одне речення про розминку",
  "exercises": [
    {"name":"назва","reps":"час або повторення","tip":"короткий лайфхак техніки","duration":30}
  ],
  "motivation": "два речення дружньої підтримки підлітку"
}
Рівно 3 вправи. duration — секунди цілим числом. Пиши українською.${historySummary(history, lang)}`;
}

function weeklyPrompt(level: Level, history: WorkoutHistoryEntry[], lang: Language): string {
  const levelLabel = LEVELS.find((l) => l.id === level)?.label[lang] ?? level;

  if (lang === 'en') {
    return `Create a 7-day workout plan for the level "${levelLabel}".
JSON format:
{
  "title":"plan name",
  "days":[
    {"day":"Monday","focus":"focus","duration":"10-15 min","exercises":["exercise 1 — reps","exercise 2 — reps","exercise 3 — reps"],"motivation":"sentence of support"}
  ]
}
7 items in days. Write in English. Safe for teenagers.${historySummary(history, lang)}`;
  }

  return `Створи план тренувань на 7 днів для рівня "${levelLabel}".
Формат JSON:
{
  "title":"назва плану",
  "days":[
    {"day":"Понеділок","focus":"фокус","duration":"10-15 хв","exercises":["вправа1 — повторення","вправа2 — повторення","вправа3 — повторення"],"motivation":"речення підтримки"}
  ]
}
7 елементів у days. Українською. Безпечно для підлітків.${historySummary(history, lang)}`;
}

export async function generateWorkout(
  apiKey: string | null,
  model: string,
  level: Level,
  goal: GoalId,
  minutes: number,
  language: Language,
  history: WorkoutHistoryEntry[] = [],
): Promise<Workout> {
  if (!apiKey || !navigator.onLine) return mockWorkout(level, goal, minutes, history, language);
  try {
    const raw = await callOpenRouter(
      apiKey,
      model,
      SYSTEM_PROMPTS[language],
      workoutPrompt(level, goal, minutes, history, language),
    );
    const parsed = tryParse<Workout>(raw);
    if (!parsed || !parsed.exercises?.length) {
      return mockWorkout(level, goal, minutes, history, language);
    }
    return parsed;
  } catch {
    return mockWorkout(level, goal, minutes, history, language);
  }
}

export async function generateWeeklyPlan(
  apiKey: string | null,
  model: string,
  level: Level,
  language: Language,
  history: WorkoutHistoryEntry[] = [],
): Promise<WeeklyPlan> {
  if (!apiKey || !navigator.onLine) return mockWeeklyPlan(level, language);
  try {
    const raw = await callOpenRouter(
      apiKey,
      model,
      SYSTEM_PROMPTS[language],
      weeklyPrompt(level, history, language),
    );
    const parsed = tryParse<WeeklyPlan>(raw);
    if (!parsed || !parsed.days?.length) return mockWeeklyPlan(level, language);
    return parsed;
  } catch {
    return mockWeeklyPlan(level, language);
  }
}
