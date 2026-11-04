import { createContext, useContext } from 'react';
import type { Language } from './types';

const UK = {
  'app.subtitle': 'Твій кишеньковий спортивний ментор',
  'app.settings': 'AI Налаштування',
  'app.offline': 'Офлайн',
  'app.loadingAI': 'AI-ментор думає...',
  'app.loadingMock': 'Готую тренування...',
  'common.back': 'Назад до вибору',
  'common.close': 'Закрити',
  'common.save': 'Зберегти',
  'common.reset': 'Скинути',
  'common.skip': 'Пропустити',
  'common.share': 'Поділитися результатом',
  'common.min': 'хв',
  'common.secShort': 'с',
  'common.today': 'Сьогодні',
  'common.of': 'з',
  'common.exercise': 'Вправа',
  'common.exercises': 'Вправи',
  'header.language': 'Мова',
  'empty.greeting': 'Привіт від Вероніки',
  'empty.title': 'Твій безкоштовний спортивний асистент',
  'empty.intro':
    'Привіт! Я твій безкоштовний спортивний асистент. Допоможу підібрати тренування відповідно до твого рівня та цілей. Разом зробимо спорт простим, цікавим і регулярним!',
  'empty.tagFree': 'Безкоштовно',
  'empty.tagEquipment': 'Без обладнання',
  'empty.tagTime': '10–20 хв',
  'empty.tagTeens': 'Для підлітків',
  'empty.quickStart': 'Підібрати тренування',
  'empty.quickStartSub': 'За 10 хвилин до результату',
  'empty.weekly': 'План на тиждень',
  'empty.weeklySub': '7 днів спортивної звички',
  'empty.challenges': 'Челенджі тижня',
  'empty.next': 'Наступний: {title}',
  'empty.allDone': 'Усі челенджі виконано — ти зірка!',
  'empty.footer': 'Дружня підтримка замість жорсткого крику тренерів',
  'input.level': 'Рівень підготовки',
  'input.goal': 'Що ти хочеш сьогодні?',
  'input.time': 'Скільки маєш вільного часу',
  'input.generate': 'Підібрати тренування',
  'input.weekly': 'План на тиждень',
  'input.errorLevelGoal': 'Обери свій рівень і ціль, щоб отримати план тренування',
  'input.errorLevelWeekly': 'Обери свій рівень підготовки для плану на тиждень',
  'workout.warmup': 'Розминка: ',
  'workout.exerciseOf': 'Вправа {current} з {total}',
  'workout.motivation': 'Мотивація від твого AI-ментора',
  'workout.complete': 'Я виконав тренування!',
  'workout.allDone': 'Усі вправи виконано — ти молодець!',
  'workout.techniqueTip': 'Лайфхак техніки: ',
  'timer.ready': 'Натисни старт',
  'timer.running': 'Йде виконання',
  'timer.done': 'Готово!',
  'timer.reset': 'Скинути',
  'timer.start': 'Старт',
  'timer.pause': 'Пауза',
  'timer.skip': 'Пропустити',
  'timer.finish': 'Завершити',
  'weekly.intro':
    '7 днів збалансованого навантаження — чергуй енергію, спину й прес для максимального результату.',
  'weekly.exercises': 'Вправи',
  'weekly.motivation': 'Мотивація',
  'weekly.today': 'Сьогодні',
  'weekly.restDay': 'День відпочинку — відновлення теж частина прогресу.',
  'weekly.level': 'Рівень',
  'feedback.title': 'Як пройшло тренування?',
  'feedback.subtitle': 'Допоможи AI підібрати наступне',
  'feedback.load': 'Навантаження',
  'feedback.soreness': 'Що турбувало?',
  'feedback.note': 'Коментар',
  'feedback.optional': '(необов’язково)',
  'feedback.placeholder': 'Наприклад: було важко робити присідання',
  'challenges.title': 'Тижневі челенджі',
  'challenges.progress': 'Твій прогрес',
  'challenges.count': '{done} з {total}',
  'challenges.completed': 'Виконано — так тримати!',
  'challenges.current': '{current} з {target} {unit}',
  'challenges.noShare':
    'Заверши перше тренування — і зможеш поділитися своїм результатом з друзями.',
  'challenges.footer':
    'Челенджі оновлюються щопонеділка. Прогрес зберігається на цьому пристрої.',
  'challenges.toast': 'Челендж виконано: {title} ✅',
  'achievements.eyebrow': 'Ти зробив це!',
  'achievements.title': 'Нові досягнення 🎉',
  'achievements.unlocked': 'Розблоковано сьогодні',
  'achievements.continue': 'Продовжити круту звичку 💪',
  'settings.title': 'AI Налаштування',
  'settings.subtitle': 'Підключи OpenRouter для живого AI-ментора',
  'settings.apiKey': 'OpenRouter API Key',
  'settings.show': 'Показати',
  'settings.hide': 'Сховати',
  'settings.model': 'Модель',
  'settings.customModel': 'Власна модель OpenRouter',
  'settings.reminder': 'Нагадування про тренування',
  'settings.reminderSub': 'Якщо сьогодні ще не тренувався',
  'settings.reminderTime': 'Час нагадування',
  'settings.reminderUnsupported': 'Цей браузер не підтримує сповіщення.',
  'settings.reminderDenied':
    'Дозвіл на сповіщення не надано. Увімкни його в налаштуваннях браузера.',
  'settings.reminderNote':
    'Працює, поки застосунок відкритий або встановлений на пристрій. Сповіщення надходить один раз на день.',
  'settings.sound': 'Звукові сигнали таймера',
  'settings.soundSub': 'Короткий сигнал на старті та в кінці вправи',
  'settings.language': 'Мова інтерфейсу',
  'settings.languageSub': 'Застосунок і тренування оновляться одразу',
  'settings.mockNote':
    'Без ключа застосунок працює у Mock-режимі — тренування та підтримка доступні завжди. Ключ зберігається лише у твоєму браузері.',
  'settings.reset': 'Скинути',
  'settings.save': 'Зберегти',
  'toast.copied': 'Результат скопійовано — встав у сторіс!',
  'toast.shareFailed': 'Не вдалося поділитися. Спробуй ще раз.',
  'share.windowTitle': 'Мій результат у TeenFit AI',
  'share.heading': '💪 Мій спортивний тиждень з TeenFit AI',
  'share.streak': '🔥 Стрік: {count} {days}',
  'share.total': '🏋️ Тренувань усього: {count}',
  'share.thisWeek': '📅 Цього тижня: {workouts} · {minutes} хв · {days}',
  'share.challenges': '✅ Челленджі: {list}',
  'share.next': '🎯 Челлендж тижня: {current}/{target} — {title}',
  'share.join': 'Приєднуйся до TeenFit AI 💚',
  'reminder.title': 'Час тренуватися! 💪',
  'reminder.body':
    '10 хвилин — і ти зробиш крок до кращої форми. Твій AI-ментор уже чекає.',
} as const;

export type TKey = keyof typeof UK;

const EN: Record<TKey, string> = {
  'app.subtitle': 'Your pocket fitness mentor',
  'app.settings': 'AI settings',
  'app.offline': 'Offline',
  'app.loadingAI': 'AI mentor is thinking...',
  'app.loadingMock': 'Preparing your workout...',
  'common.back': 'Back to selection',
  'common.close': 'Close',
  'common.save': 'Save',
  'common.reset': 'Reset',
  'common.skip': 'Skip',
  'common.share': 'Share result',
  'common.min': 'min',
  'common.secShort': 's',
  'common.today': 'Today',
  'common.of': 'of',
  'common.exercise': 'Exercise',
  'common.exercises': 'Exercises',
  'header.language': 'Language',
  'empty.greeting': 'A hello from Veronika',
  'empty.title': 'Your free fitness assistant',
  'empty.intro':
    'Hi! I’m your free fitness assistant. I’ll help you pick a workout that matches your level and goals. Together we’ll make movement simple, fun, and regular!',
  'empty.tagFree': 'Free',
  'empty.tagEquipment': 'No equipment',
  'empty.tagTime': '10–20 min',
  'empty.tagTeens': 'For teens',
  'empty.quickStart': 'Pick a workout',
  'empty.quickStartSub': 'Results in 10 minutes',
  'empty.weekly': 'Weekly plan',
  'empty.weeklySub': '7 days of a fitness habit',
  'empty.challenges': 'Weekly challenges',
  'empty.next': 'Next: {title}',
  'empty.allDone': 'All challenges done — you’re a star!',
  'empty.footer': 'Friendly support instead of a coach yelling at you',
  'input.level': 'Fitness level',
  'input.goal': 'What do you want today?',
  'input.time': 'How much free time do you have?',
  'input.generate': 'Pick a workout',
  'input.weekly': 'Weekly plan',
  'input.errorLevelGoal': 'Choose your level and goal to get a workout plan',
  'input.errorLevelWeekly': 'Choose your fitness level for the weekly plan',
  'workout.warmup': 'Warm-up: ',
  'workout.exerciseOf': 'Exercise {current} of {total}',
  'workout.motivation': 'Motivation from your AI mentor',
  'workout.complete': 'I finished the workout!',
  'workout.allDone': 'All exercises done — great job!',
  'workout.techniqueTip': 'Technique tip: ',
  'timer.ready': 'Press start',
  'timer.running': 'In progress',
  'timer.done': 'Done!',
  'timer.reset': 'Reset',
  'timer.start': 'Start',
  'timer.pause': 'Pause',
  'timer.skip': 'Skip',
  'timer.finish': 'Finish',
  'weekly.intro':
    '7 days of balanced training — alternate energy, back, and core sessions for the best results.',
  'weekly.exercises': 'Exercises',
  'weekly.motivation': 'Motivation',
  'weekly.today': 'Today',
  'weekly.restDay': 'Rest day — recovery is part of progress too.',
  'weekly.level': 'Level',
  'feedback.title': 'How did the workout go?',
  'feedback.subtitle': 'Help the AI choose your next one',
  'feedback.load': 'Intensity',
  'feedback.soreness': 'What felt uncomfortable?',
  'feedback.note': 'Comment',
  'feedback.optional': '(optional)',
  'feedback.placeholder': 'For example: squats felt hard',
  'challenges.title': 'Weekly challenges',
  'challenges.progress': 'Your progress',
  'challenges.count': '{done} of {total}',
  'challenges.completed': 'Completed — keep it up!',
  'challenges.current': '{current} of {target} {unit}',
  'challenges.noShare': 'Finish your first workout to share your result with friends.',
  'challenges.footer': 'Challenges reset every Monday. Progress is stored on this device.',
  'challenges.toast': 'Challenge completed: {title} ✅',
  'achievements.eyebrow': 'You did it!',
  'achievements.title': 'New achievements 🎉',
  'achievements.unlocked': 'Unlocked today',
  'achievements.continue': 'Keep the streak going 💪',
  'settings.title': 'AI settings',
  'settings.subtitle': 'Connect OpenRouter for a live AI mentor',
  'settings.apiKey': 'OpenRouter API key',
  'settings.show': 'Show',
  'settings.hide': 'Hide',
  'settings.model': 'Model',
  'settings.customModel': 'Custom OpenRouter model',
  'settings.reminder': 'Workout reminder',
  'settings.reminderSub': 'If you haven’t trained today yet',
  'settings.reminderTime': 'Reminder time',
  'settings.reminderUnsupported': 'This browser does not support notifications.',
  'settings.reminderDenied':
    'Notification permission was not granted. Enable it in your browser settings.',
  'settings.reminderNote':
    'Works while the app is open or installed on your device. You’ll get one notification per day.',
  'settings.sound': 'Timer sounds',
  'settings.soundSub': 'A short signal at the start and end of each exercise',
  'settings.language': 'Interface language',
  'settings.languageSub': 'The app and workouts update immediately',
  'settings.mockNote':
    'Without a key, the app runs in Mock mode — workouts and support are always available. The key is stored only in your browser.',
  'settings.reset': 'Reset',
  'settings.save': 'Save',
  'toast.copied': 'Result copied — paste it into your story!',
  'toast.shareFailed': 'Could not share. Please try again.',
  'share.windowTitle': 'My TeenFit AI result',
  'share.heading': '💪 My fitness week with TeenFit AI',
  'share.streak': '🔥 Streak: {count} {days}',
  'share.total': '🏋️ Total workouts: {count}',
  'share.thisWeek': '📅 This week: {workouts} · {minutes} min · {days}',
  'share.challenges': '✅ Challenges: {list}',
  'share.next': '🎯 Weekly challenge: {current}/{target} — {title}',
  'share.join': 'Join TeenFit AI 💚',
  'reminder.title': 'Time to work out! 💪',
  'reminder.body':
    '10 minutes and you’re one step closer to feeling better. Your AI mentor is waiting.',
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}

export function translate(
  lang: Language,
  key: TKey,
  params?: Record<string, string | number>,
): string {
  return interpolate(lang === 'en' ? EN[key] : UK[key], params);
}

export type TFunction = (key: TKey, params?: Record<string, string | number>) => string;

export interface I18nValue {
  lang: Language;
  t: TFunction;
}

export const I18nContext = createContext<I18nValue>({
  lang: 'uk',
  t: (key, params) => translate('uk', key, params),
});

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  uk: 'Українська',
  en: 'English',
};

export type PluralKind = 'workouts' | 'minutes' | 'activeDays' | 'days';

const PLURALS: Record<PluralKind, Record<Language, string[]>> = {
  workouts: {
    uk: ['тренування', 'тренування', 'тренувань'],
    en: ['workout', 'workouts'],
  },
  minutes: {
    uk: ['хвилина', 'хвилини', 'хвилин'],
    en: ['minute', 'minutes'],
  },
  activeDays: {
    uk: ['активний день', 'активні дні', 'активних днів'],
    en: ['active day', 'active days'],
  },
  days: {
    uk: ['день', 'дні', 'днів'],
    en: ['day', 'days'],
  },
};

export function pluralize(lang: Language, count: number, kind: PluralKind): string {
  const forms = PLURALS[kind][lang];
  if (lang === 'en') return count === 1 ? forms[0] : forms[1];

  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2] ?? forms[1];
}

export const MONTHS: Record<Language, string[]> = {
  uk: [
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
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

export const WEEKDAYS: Record<Language, string[]> = {
  uk: ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота', 'Неділя'],
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
};

export const WEEKDAYS_SHORT: Record<Language, string[]> = {
  uk: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};
