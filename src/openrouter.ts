import type { Level, GoalId, Workout, WeeklyPlan, WorkoutHistoryEntry, Difficulty, SorenessId } from './types';
import { DEFAULT_MODEL, GOALS } from './types';
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

const SYSTEM_PROMPT = `Ти — дружній спортивний ментор для підлітків. Ти створюєш безпечні тренування з власною вагою.
Пиши українською. Відповідай ТІЛЬКИ валідним JSON без markdown-обгортки.
Будь підтримуючим, енергійним і теплим — не суворим.`;

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'легко',
  ok: 'в самий раз',
  hard: 'важко',
};

const SORE_LABELS: Record<SorenessId, string> = {
  back: 'спина',
  knees: 'коліна',
  shoulders: 'плечі',
  none: '',
};

function historySummary(history: WorkoutHistoryEntry[]): string {
  const recent = history.filter((h) => h.difficulty).slice(-4);
  if (!recent.length) return '';

  const lines = recent.map((h) => {
    const goal = GOALS.find((g) => g.id === h.goal)?.label ?? h.goal;
    const sore = h.soreness
      .filter((s) => s !== 'none')
      .map((s) => SORE_LABELS[s])
      .join(', ');
    const note = h.note ? `, коментар: ${h.note.replace(/\s+/g, ' ').trim().slice(0, 160)}` : '';
    return `- ${h.date}: ${goal}, ${h.minutes} хв, складність «${DIFFICULTY_LABELS[h.difficulty!]}»${sore ? `, турбувало: ${sore}` : ''}${note}`;
  });

  return `

Останні тренування (врахуй навантаження):
${lines.join('\n')}
Якщо було легко — трохи підвищ складність. Якщо важко — знизь. Не навантажуй зони, які турбували.`;
}

function workoutPrompt(
  level: Level,
  goal: GoalId,
  minutes: number,
  history: WorkoutHistoryEntry[],
): string {
  return `Створи тренування для рівня "${level}", ціль "${goal}", доступно ${minutes} хв.
Формат JSON:
{
  "title": "коротка назва",
  "warmup": "одне речення про розминку",
  "exercises": [
    {"name":"назва","reps":"час або повторення","tip":"короткий лайфхак техніки","duration":30}
  ],
  "motivation": "два речення дружньої підтримки підлітку"
}
Рівно 3 вправи. duration — секунди цілим числом.${historySummary(history)}`;
}

function weeklyPrompt(level: Level, history: WorkoutHistoryEntry[]): string {
  return `Створи план тренувань на 7 днів для рівня "${level}".
Формат JSON:
{
  "title":"назва плану",
  "days":[
    {"day":"Понеділок","focus":"фокус","duration":"10-15 хв","exercises":["вправа1 — повторення","вправа2 — повторення","вправа3 — повторення"],"motivation":"речення підтримки"}
  ]
}
7 елементів у days. Українською. Безпечно для підлітків.${historySummary(history)}`;
}

export async function generateWorkout(
  apiKey: string | null,
  model: string,
  level: Level,
  goal: GoalId,
  minutes: number,
  history: WorkoutHistoryEntry[] = [],
): Promise<Workout> {
  if (!apiKey || !navigator.onLine) return mockWorkout(level, goal, minutes, history);
  try {
    const raw = await callOpenRouter(
      apiKey,
      model,
      SYSTEM_PROMPT,
      workoutPrompt(level, goal, minutes, history),
    );
    const parsed = tryParse<Workout>(raw);
    if (!parsed || !parsed.exercises?.length) return mockWorkout(level, goal, minutes, history);
    return parsed;
  } catch {
    return mockWorkout(level, goal, minutes, history);
  }
}

export async function generateWeeklyPlan(
  apiKey: string | null,
  model: string,
  level: Level,
  history: WorkoutHistoryEntry[] = [],
): Promise<WeeklyPlan> {
  if (!apiKey || !navigator.onLine) return mockWeeklyPlan(level);
  try {
    const raw = await callOpenRouter(apiKey, model, SYSTEM_PROMPT, weeklyPrompt(level, history));
    const parsed = tryParse<WeeklyPlan>(raw);
    if (!parsed || !parsed.days?.length) return mockWeeklyPlan(level);
    return parsed;
  } catch {
    return mockWeeklyPlan(level);
  }
}
