import type { AppData, Language } from './types';
import type { ChallengeProgress, WeeklyStats } from './challenges';
import { pluralize, translate } from './i18n';

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

export function buildShareText(
  data: AppData,
  stats: WeeklyStats,
  challenges: ChallengeProgress[],
  lang: Language,
): string {
  const lines: string[] = [translate(lang, 'share.heading'), ''];

  if (data.streak > 0) {
    lines.push(
      translate(lang, 'share.streak', {
        count: data.streak,
        days: pluralize(lang, data.streak, 'days'),
      }),
    );
  }
  if (data.totalCompleted > 0) {
    lines.push(translate(lang, 'share.total', { count: data.totalCompleted }));
  }

  const activeDays = `${stats.activeDays} ${pluralize(lang, stats.activeDays, 'activeDays')}`;
  const workouts = `${stats.workouts} ${pluralize(lang, stats.workouts, 'workouts')}`;
  lines.push(
    translate(lang, 'share.thisWeek', {
      workouts,
      minutes: stats.minutes,
      days: activeDays,
    }),
  );

  const completed = challenges.filter((challenge) => challenge.completed);
  if (completed.length) {
    lines.push(
      translate(lang, 'share.challenges', {
        list: completed.map((challenge) => challenge.title).join(' · '),
      }),
    );
  } else {
    const next = challenges.find((challenge) => !challenge.completed);
    if (next) {
      lines.push(
        translate(lang, 'share.next', {
          current: next.current,
          target: next.target,
          title: next.title,
        }),
      );
    }
  }

  const link = typeof window !== 'undefined' ? `${window.location.origin}/` : '';
  lines.push('', translate(lang, 'share.join'), link);

  return lines.join('\n');
}

function copyWithFallback(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export async function shareText(text: string, lang: Language): Promise<ShareOutcome> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: translate(lang, 'share.windowTitle'), text });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
      // Some browsers expose share but reject it (no targets, permissions, etc.).
      // Fall through to copying the text instead.
    }
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return 'copied';
    }
  } catch {
    // Clipboard API can be blocked; try the legacy path below.
  }

  return copyWithFallback(text) ? 'copied' : 'failed';
}
