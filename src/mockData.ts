import type { Level, GoalId, Workout, WeeklyPlan, DayPlan, WorkoutHistoryEntry, SorenessId } from './types';

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

interface ExDef {
  name: string;
  reps: string;
  tip: string;
}

const ENERGY: ExDef[] = [
  { name: 'Стрибки з махами', reps: '40 секунд', tip: 'Легкі стрибки на носках, руки плавно догори — не блокуй лікті.' },
  { name: 'Присідання', reps: '15 разів', tip: 'П’ятки на підлозі, коліна не виходять за носки, спина рівна.' },
  { name: 'Велосипед на спині', reps: '30 секунд', tip: 'Поясниця притиснута, рухи плавні без ривків.' },
  { name: 'Наклони з руками догори', reps: '10 разів', tip: 'Тягнись уверх, а не вбік — груди розкриті.' },
  { name: 'Біг на місці', reps: '30 секунд', tip: 'Дихай ритмічно, не затримуй повітря.' },
];

const BACK: ExDef[] = [
  { name: 'Кошеня-корова', reps: '8 циклів', tip: 'Рухи повільні, хребет рухається хвилеподібно.' },
  { name: 'Місток із положення лежачи', reps: '10 секунд × 3', tip: 'Піднімай таз, стискаючи сідниці, шия розслаблена.' },
  { name: 'Собака мордою вниз', reps: '20 секунд', tip: 'Спина пряміша за ноги — можна зігнути коліна.' },
  { name: 'Розтяжка «Зоря»', reps: '15 секунд на бік', tip: 'Тягнись кінчиками пальців, не закругляй спину.' },
  { name: 'Лодочка', reps: '10 секунд × 2', tip: 'Піднімай груди й стегна, шия продовження спини.' },
  { name: 'Обхват колін', reps: '15 секунд', tip: 'Притягуй обидва коліна до живота — розслаб поясницю.' },
];

const CORE: ExDef[] = [
  { name: 'Планка', reps: '20 секунд', tip: 'Тісто в лінію, не провисай у попереку.' },
  { name: 'Прес-велосипед', reps: '20 разів', tip: 'Локоть тягнеться до протилежного коліна.' },
  { name: 'Гірські альпіністи', reps: '30 секунд', tip: 'Таз стабільний, не стрибай уверх-вниз.' },
  { name: 'Мертвий жук', reps: '10 разів', tip: 'Поясниця притиснута до підлоги весь час.' },
  { name: 'Віджимання від колін', reps: '8 разів', tip: 'Тіло пряме від колін до голови, лікті під 45°.' },
  { name: 'Лодочка-пульс', reps: '12 секунд', tip: 'Невеликі пульсації уверх, без ривків.' },
];

const MOTIVATION: string[] = [
  'Ти крутіший, ніж здається! Зроби 10 присідань — і мозок перезавантажиться. Кожен рух наближає тебе до найкращої версії себе.',
  'Не думай про втому — думай про перемогу після. Ти вже тут, уже рухаєшся, і це понад 90% людей, які лише планували.',
  'Спорт — це не покарання, а подяка тілу. Кожна вправа — це інвестиція в енергію, настрій і впевненість.',
  'Ти не змагаєшся з іншими — ти сьогодні сильніший за вчорашнього себе. Збережи цей темп, і результат тебе здивує.',
  'Коли важко — уяви, як пишаєшся собою через 5 хвилин. Саме цей момент і робить тебе чемпіоном.',
];

function dailyPlan(day: string, focus: string, exercises: ExDef[], duration: string): DayPlan {
  return {
    day,
    focus,
    duration,
    exercises: exercises.map((e) => `${e.name} — ${e.reps}`),
    motivation: MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)],
  };
}

const SORE_LABELS: Record<Exclude<SorenessId, 'none'>, string> = {
  back: 'спина',
  knees: 'коліна',
  shoulders: 'плечі',
};

const AVOID_BY_ZONE: Record<Exclude<SorenessId, 'none'>, string[]> = {
  back: ['наклон', 'лодоч', 'міст', 'собака', 'кошеня', 'обхват'],
  knees: ['присідан', 'стриб', 'випад', 'біг'],
  shoulders: ['віджиман', 'планка', 'альпініст'],
};

function filterPool(pool: ExDef[], soreness: SorenessId[]): ExDef[] {
  const zones = soreness.filter((s): s is Exclude<SorenessId, 'none'> => s !== 'none');
  if (!zones.length) return pool;

  const safe = pool.filter((e) => {
    const name = e.name.toLowerCase();
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
): Workout {
  const last = [...history].reverse().find((h) => h.difficulty);
  const factor = last?.difficulty === 'easy' ? 1.25 : last?.difficulty === 'hard' ? 0.75 : 1;
  const soreness = last?.soreness ?? [];

  const basePool = goal === 'energy' ? ENERGY : goal === 'back' ? BACK : CORE;
  const pool = filterPool(basePool, soreness);
  const chosen = pick(pool, 3);
  const warmup = level === 'beginner'
    ? '3 хвилини легкої ходьби на місці + обертання плечима.'
    : level === 'amateur'
    ? '2 хвилини бігу на місці + динамічна розтяжка шиї й плечей.'
    : '2 хвилини стрибків «зірка» + махи ногами + прогрев суглобів.';
  const dur = goal === 'energy' ? 40 : goal === 'back' ? 25 : 30;
  const exercises = chosen.map((e) => ({
    name: e.name,
    duration: Math.max(15, Math.round(dur * factor)),
    reps: scaleReps(e.reps, factor),
    tip: e.tip,
  }));

  let adaptation: string | undefined;
  if (last) {
    if (last.difficulty === 'easy') {
      adaptation = 'Ми трохи підвищили навантаження, бо минулого разу було легко.';
    } else if (last.difficulty === 'hard') {
      adaptation = 'Ми знизили навантаження після складного тренування — бережи сили.';
    } else {
      adaptation = 'Навантаження залишили на тому ж рівні — минулого разу було в самий раз.';
    }
    const soreLabels = soreness
      .filter((s): s is Exclude<SorenessId, 'none'> => s !== 'none')
      .map((s) => SORE_LABELS[s]);
    if (soreLabels.length) {
      adaptation += ` Обережно з зонами: ${soreLabels.join(', ')}.`;
    }
  }

  return {
    title: 'Твоє персональне тренування',
    exercises,
    motivation: MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)],
    warmup,
    adaptation,
  };
}

export function mockWeeklyPlan(level: Level): WeeklyPlan {
  const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя'];
  const foci = ['Енергія', 'Спина й осанка', 'Прес і руки', 'Активне відновлення', 'Енергія', 'Прес і руки', 'Відпочинок'];
  const duration = level === 'beginner' ? '10–12 хв' : level === 'regular' ? '15–20 хв' : '10–15 хв';
  return {
    title: 'Твій план на 7 днів',
    days: days.map((d, i) => {
      const pool = foci[i].includes('Енергія') ? ENERGY : foci[i].includes('Спина') ? BACK : foci[i].includes('Прес') ? CORE : ENERGY;
      return dailyPlan(d, foci[i], pick(pool, 3), duration);
    }),
  };
}
