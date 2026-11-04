import type { AppData } from './types';
import type { ChallengeProgress, WeeklyStats } from './challenges';
import { plural } from './challenges';

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

export function buildShareText(
  data: AppData,
  stats: WeeklyStats,
  challenges: ChallengeProgress[],
): string {
  const lines: string[] = ['💪 Мій спортивний тиждень з TeenFit AI', ''];

  if (data.streak > 0) {
    lines.push(`🔥 Стрік: ${data.streak} ${plural(data.streak, 'день', 'дні', 'днів')}`);
  }
  if (data.totalCompleted > 0) {
    lines.push(`🏋️ Тренувань усього: ${data.totalCompleted}`);
  }

  const activeDays = `${stats.activeDays} ${plural(
    stats.activeDays,
    'активний день',
    'активні дні',
    'активних днів',
  )}`;
  lines.push(
    `📅 Цього тижня: ${stats.workouts} ${plural(
      stats.workouts,
      'тренування',
      'тренування',
      'тренувань',
    )} · ${stats.minutes} хв · ${activeDays}`,
  );

  const completed = challenges.filter((challenge) => challenge.completed);
  if (completed.length) {
    lines.push(`✅ Челленджі: ${completed.map((challenge) => challenge.title).join(' · ')}`);
  } else {
    const next = challenges.find((challenge) => !challenge.completed);
    if (next) {
      lines.push(`🎯 Челлендж тижня: ${next.current}/${next.target} — ${next.title}`);
    }
  }

  const link = typeof window !== 'undefined' ? `${window.location.origin}/` : '';
  lines.push('', 'Приєднуйся до TeenFit AI 💚', link);

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

export async function shareText(text: string, title = 'Мій результат у TeenFit AI'): Promise<ShareOutcome> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text });
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
