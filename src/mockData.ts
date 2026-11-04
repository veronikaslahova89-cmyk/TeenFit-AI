import type {
  DayPlan,
  GoalId,
  Language,
  Level,
  SorenessId,
  WeeklyPlan,
  Workout,
  WorkoutHistoryEntry,
} from './types';
import { WEEKDAYS } from './i18n';

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

type Localized = Record<Language, string>;

interface ExDef {
  name: Localized;
  reps: Localized;
  tip: Localized;
}

const ENERGY: ExDef[] = [
  {
    name: { uk: 'Стрибки з махами', en: 'Jumping jacks with arm swings' },
    reps: { uk: '40 секунд', en: '40 seconds' },
    tip: {
      uk: 'Легкі стрибки на носках, руки плавно догори — не блокуй лікті.',
      en: 'Light bounces on your toes, arms sweep overhead — don’t lock your elbows.',
    },
  },
  {
    name: { uk: 'Присідання', en: 'Squats' },
    reps: { uk: '15 разів', en: '15 reps' },
    tip: {
      uk: 'П’ятки на підлозі, коліна не виходять за носки, спина рівна.',
      en: 'Heels on the floor, knees track over your toes, back straight.',
    },
  },
  {
    name: { uk: 'Велосипед на спині', en: 'Bicycle crunch' },
    reps: { uk: '30 секунд', en: '30 seconds' },
    tip: {
      uk: 'Поясниця притиснута, рухи плавні без ривків.',
      en: 'Keep your lower back pressed down, move smoothly without jerking.',
    },
  },
  {
    name: { uk: 'Наклони з руками догори', en: 'Side bends with arms overhead' },
    reps: { uk: '10 разів', en: '10 reps' },
    tip: {
      uk: 'Тягнись уверх, а не вбік — груди розкриті.',
      en: 'Reach up rather than sideways — keep your chest open.',
    },
  },
  {
    name: { uk: 'Біг на місці', en: 'Jogging in place' },
    reps: { uk: '30 секунд', en: '30 seconds' },
    tip: {
      uk: 'Дихай ритмічно, не затримуй повітря.',
      en: 'Breathe rhythmically, don’t hold your breath.',
    },
  },
];

const BACK: ExDef[] = [
  {
    name: { uk: 'Кошеня-корова', en: 'Cat-cow' },
    reps: { uk: '8 циклів', en: '8 cycles' },
    tip: {
      uk: 'Рухи повільні, хребет рухається хвилеподібно.',
      en: 'Move slowly and let your spine move in a wave.',
    },
  },
  {
    name: { uk: 'Місток із положення лежачи', en: 'Glute bridge' },
    reps: { uk: '10 секунд × 3', en: '10 seconds × 3' },
    tip: {
      uk: 'Піднімай таз, стискаючи сідниці, шия розслаблена.',
      en: 'Lift your hips and squeeze your glutes, keep your neck relaxed.',
    },
  },
  {
    name: { uk: 'Собака мордою вниз', en: 'Downward-facing dog' },
    reps: { uk: '20 секунд', en: '20 seconds' },
    tip: {
      uk: 'Спина пряміша за ноги — можна зігнути коліна.',
      en: 'Keep your back straighter than your legs — bend your knees if needed.',
    },
  },
  {
    name: { uk: 'Розтяжка «Зірка»', en: 'Star stretch' },
    reps: { uk: '15 секунд на бік', en: '15 seconds per side' },
    tip: {
      uk: 'Тягнись кінчиками пальців, не закругляй спину.',
      en: 'Reach with your fingertips, don’t round your back.',
    },
  },
  {
    name: { uk: 'Лодочка', en: 'Superman' },
    reps: { uk: '10 секунд × 2', en: '10 seconds × 2' },
    tip: {
      uk: 'Піднімай груди й стегна, шия продовження спини.',
      en: 'Lift your chest and thighs, keep your neck in line with your spine.',
    },
  },
  {
    name: { uk: 'Обхват колін', en: 'Knee hug' },
    reps: { uk: '15 секунд', en: '15 seconds' },
    tip: {
      uk: 'Притягуй обидва коліна до живота — розслаб поясницю.',
      en: 'Pull both knees toward your belly — relax your lower back.',
    },
  },
];

const CORE: ExDef[] = [
  {
    name: { uk: 'Планка', en: 'Plank' },
    reps: { uk: '20 секунд', en: '20 seconds' },
    tip: {
      uk: 'Тіло в лінію, не провисай у попереку.',
      en: 'Body in a straight line, don’t let your lower back sag.',
    },
  },
  {
    name: { uk: 'Прес-велосипед', en: 'Bicycle crunch' },
    reps: { uk: '20 разів', en: '20 reps' },
    tip: {
      uk: 'Лікоть тягнеться до протилежного коліна.',
      en: 'Your elbow reaches toward the opposite knee.',
    },
  },
  {
    name: { uk: 'Гірські альпіністи', en: 'Mountain climbers' },
    reps: { uk: '30 секунд', en: '30 seconds' },
    tip: {
      uk: 'Таз стабільний, не стрибай уверх-вниз.',
      en: 'Keep your hips stable, don’t bounce up and down.',
    },
  },
  {
    name: { uk: 'Мертвий жук', en: 'Dead bug' },
    reps: { uk: '10 разів', en: '10 reps' },
    tip: {
      uk: 'Поясниця притиснута до підлоги весь час.',
      en: 'Keep your lower back pressed to the floor the whole time.',
    },
  },
  {
    name: { uk: 'Віджимання від колін', en: 'Knee push-ups' },
    reps: { uk: '8 разів', en: '8 reps' },
    tip: {
      uk: 'Тіло пряме від колін до голови, лікті під 45°.',
      en: 'Body straight from knees to head, elbows at 45°.',
    },
  },
  {
    name: { uk: 'Лодочка-пульс', en: 'Superman pulse' },
    reps: { uk: '12 секунд', en: '12 seconds' },
    tip: {
      uk: 'Невеликі пульсації уверх, без ривків.',
      en: 'Small pulses upward, no jerking.',
    },
  },
];

const MOTIVATION: Record<Language, string[]> = {
  uk: [
    'Ти крутіший, ніж здається! Зроби 10 присідань — і мозок перезавантажиться. Кожен рух наближає тебе до найкращої версії себе.',
    'Не думай про втому — думай про перемогу після. Ти вже тут, уже рухаєшся, і це понад 90% людей, які лише планували.',
    'Спорт — це не покарання, а подяка тілу. Кожна вправа — це інвестиція в енергію, настрій і впевненість.',
    'Ти не змагаєшся з іншими — ти сьогодні сильніший за вчорашнього себе. Збережи цей темп, і результат тебе здивує.',
    'Коли важко — уяви, як пишаєшся собою через 5 хвилин. Саме цей момент і робить тебе чемпіоном.',
  ],
  en: [
    'You’re stronger than you think! Do 10 squats and your brain gets a reset. Every move brings you closer to your best self.',
    'Don’t think about the fatigue — think about the win afterwards. You’re already here, already moving, and that’s more than 90% of people who only planned to.',
    'Exercise isn’t a punishment, it’s a thank-you to your body. Every move is an investment in energy, mood, and confidence.',
    'You’re not competing with others — you’re stronger today than yesterday. Keep this pace and the result will surprise you.',
    'When it gets hard, picture how proud you’ll be in 5 minutes. That moment is what makes you a champion.',
  ],
};

const WARMUP: Record<Language, Record<Level, string>> = {
  uk: {
    beginner: '3 хвилини легкої ходьби на місці + обертання плечима.',
    amateur: '2 хвилини бігу на місці + динамічна розтяжка шиї й плечей.',
    regular: '2 хвилини стрибків «зірка» + махи ногами + розігрів суглобів.',
  },
  en: {
    beginner: '3 minutes of easy walking in place + shoulder rolls.',
    amateur: '2 minutes of jogging in place + dynamic neck and shoulder stretches.',
    regular: '2 minutes of star jumps + leg swings + joint warm-up.',
  },
};

const ADAPTATION: Record<Language, Record<'easy' | 'ok' | 'hard', string>> = {
  uk: {
    easy: 'Ми трохи підвищили навантаження, бо минулого разу було легко.',
    hard: 'Ми знизили навантаження після складного тренування — бережи сили.',
    ok: 'Навантаження залишили на тому ж рівні — минулого разу було в самий раз.',
  },
  en: {
    easy: 'We bumped up the intensity a little because last time felt easy.',
    hard: 'We lowered the intensity after a hard workout — save your energy.',
    ok: 'We kept the same intensity — last time felt just right.',
  },
};

const SORE_LABELS: Record<Language, Record<Exclude<SorenessId, 'none'>, string>> = {
  uk: { back: 'спина', knees: 'коліна', shoulders: 'плечі' },
  en: { back: 'back', knees: 'knees', shoulders: 'shoulders' },
};

const AVOID_BY_ZONE: Record<Exclude<SorenessId, 'none'>, string[]> = {
  back: [
    'наклон',
    'лодоч',
    'міст',
    'собака',
    'кошеня',
    'обхват',
    'bend',
    'superman',
    'bridge',
    'dog',
    'cat',
    'knee hug',
  ],
  knees: ['присідан', 'стриб', 'випад', 'біг', 'squat', 'jump', 'lunge', 'jog', 'run'],
  shoulders: ['віджиман', 'планка', 'альпініст', 'push-up', 'plank', 'mountain climber'],
};

function filterPool(pool: ExDef[], soreness: SorenessId[]): ExDef[] {
  const zones = soreness.filter((s): s is Exclude<SorenessId, 'none'> => s !== 'none');
  if (!zones.length) return pool;

  const safe = pool.filter((e) => {
    const name = `${e.name.uk} ${e.name.en}`.toLowerCase();
    return !zones.some((zone) => AVOID_BY_ZONE[zone].some((word) => name.includes(word)));
  });
  // Keep a shortened but safe session when a sore zone rules out most exercises.
  return safe.length >= 2 ? safe : pool;
}

function scaleReps(reps: string, factor: number): string {
  if (factor === 1) return reps;
  return reps.replace(/\d+/, (n) => String(Math.max(1, Math.round(Number(n) * factor))));
}

export function mockWorkout(
  level: Level,
  goal: GoalId,
  _minutes: number,
  history: WorkoutHistoryEntry[] = [],
  lang: Language = 'uk',
): Workout {
  const last = [...history].reverse().find((h) => h.difficulty);
  const factor = last?.difficulty === 'easy' ? 1.25 : last?.difficulty === 'hard' ? 0.75 : 1;
  const soreness = last?.soreness ?? [];

  const basePool = goal === 'energy' ? ENERGY : goal === 'back' ? BACK : CORE;
  const pool = filterPool(basePool, soreness);
  const chosen = pick(pool, 3);
  const warmup = WARMUP[lang][level];
  const dur = goal === 'energy' ? 40 : goal === 'back' ? 25 : 30;
  const exercises = chosen.map((e) => ({
    name: e.name[lang],
    duration: Math.max(15, Math.round(dur * factor)),
    reps: scaleReps(e.reps[lang], factor),
    tip: e.tip[lang],
  }));

  let adaptation: string | undefined;
  if (last) {
    adaptation = ADAPTATION[lang][last.difficulty ?? 'ok'];
    const soreLabels = soreness
      .filter((s): s is Exclude<SorenessId, 'none'> => s !== 'none')
      .map((s) => SORE_LABELS[lang][s]);
    if (soreLabels.length) {
      adaptation +=
        lang === 'uk'
          ? ` Обережно з зонами: ${soreLabels.join(', ')}.`
          : ` Be careful with: ${soreLabels.join(', ')}.`;
    }
  }

  return {
    title: lang === 'uk' ? 'Твоє персональне тренування' : 'Your personal workout',
    exercises,
    motivation: MOTIVATION[lang][Math.floor(Math.random() * MOTIVATION[lang].length)],
    warmup,
    adaptation,
  };
}

const PLAN_TITLE: Record<Language, string> = {
  uk: 'Твій план на 7 днів',
  en: 'Your 7-day plan',
};

const FOCI: Record<Language, string[]> = {
  uk: [
    'Енергія',
    'Спина й осанка',
    'Прес і руки',
    'Активне відновлення',
    'Енергія',
    'Прес і руки',
    'Відпочинок',
  ],
  en: ['Energy', 'Back & posture', 'Core & arms', 'Active recovery', 'Energy', 'Core & arms', 'Rest'],
};

const PLAN_DURATION: Record<Language, Record<Level, string>> = {
  uk: {
    beginner: '10–12 хв',
    amateur: '10–15 хв',
    regular: '15–20 хв',
  },
  en: {
    beginner: '10–12 min',
    amateur: '10–15 min',
    regular: '15–20 min',
  },
};

function dailyPlan(day: string, focus: string, exercises: ExDef[], duration: string, lang: Language): DayPlan {
  return {
    day,
    focus,
    duration,
    exercises: exercises.map((e) => `${e.name[lang]} — ${e.reps[lang]}`),
    motivation: MOTIVATION[lang][Math.floor(Math.random() * MOTIVATION[lang].length)],
  };
}

export function mockWeeklyPlan(level: Level, lang: Language = 'uk'): WeeklyPlan {
  const days = WEEKDAYS[lang];
  const foci = FOCI[lang];
  const duration = PLAN_DURATION[lang][level];

  return {
    title: PLAN_TITLE[lang],
    days: days.map((day, i) => {
      const focus = foci[i];
      const lower = focus.toLowerCase();
      const isRest = lower.includes('відпочинок') || lower.includes('rest');
      const isEnergy = lower.includes('енергія') || lower.includes('energy');
      const isBack =
        lower.includes('спина') || lower.includes('осанка') || lower.includes('back');
      const isCore = lower.includes('прес') || lower.includes('core');
      const pool = isRest || isBack ? BACK : isCore ? CORE : isEnergy ? ENERGY : BACK;
      return dailyPlan(day, focus, pick(pool, 3), duration, lang);
    }),
  };
}
