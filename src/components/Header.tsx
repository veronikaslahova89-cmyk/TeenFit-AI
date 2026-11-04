import { Flame, Dumbbell, WifiOff } from 'lucide-react';
import type { Language } from '../types';
import { useI18n } from '../i18n';

interface Props {
  streak: number;
  totalCompleted: number;
  onOpenSettings: () => void;
  hasApiKey: boolean;
  online: boolean;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const LANGUAGES: Language[] = ['uk', 'en'];

export default function Header({
  streak,
  totalCompleted,
  onOpenSettings,
  hasApiKey,
  online,
  language,
  onLanguageChange,
}: Props) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-600/60 bg-ink-900/80 backdrop-blur-xl">
      <div
        className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-6"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-emerald-500 text-ink-900 shadow-neon">
            <Dumbbell size={20} />
          </div>
          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-base font-extrabold tracking-tight text-white sm:text-lg">
              TeenFit <span className="text-lime-neon">AI</span>
            </h1>
            <p className="hidden truncate text-[11px] text-slate-400 sm:block">{t('app.subtitle')}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {!online && (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 sm:px-3">
              <WifiOff size={14} className="text-amber-400" />
              <span className="hidden text-xs font-bold text-amber-300 sm:inline">
                {t('app.offline')}
              </span>
            </div>
          )}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-coral/30 bg-coral/10 px-2.5 py-1.5 sm:px-3">
              <Flame size={16} className="text-coral-neon" />
              <span className="text-sm font-bold text-coral-neon">{streak}</span>
            </div>
          )}
          {totalCompleted > 0 && (
            <div className="hidden items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-3 py-1.5 sm:flex">
              <Dumbbell size={14} className="text-lime-neon" />
              <span className="text-sm font-bold text-lime-neon">{totalCompleted}</span>
            </div>
          )}

          <div
            role="group"
            aria-label={t('header.language')}
            className="flex items-center rounded-full border border-ink-600 bg-ink-700/60 p-0.5"
          >
            {LANGUAGES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onLanguageChange(code)}
                aria-pressed={language === code}
                className={`rounded-full px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide transition ${
                  language === code
                    ? 'bg-lime text-ink-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenSettings}
            aria-label={t('app.settings')}
            className="group flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-700/60 px-2.5 py-1.5 text-sm font-semibold text-slate-300 transition hover:border-lime/40 hover:text-lime-neon sm:px-3"
          >
            <span className="text-base">⚙️</span>
            <span className="hidden sm:inline">{t('app.settings')}</span>
            {!hasApiKey && (
              <span className="flex h-2 w-2 rounded-full bg-lime-neon animate-pulse-soft" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
