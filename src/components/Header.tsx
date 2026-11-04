import { Flame, Dumbbell, WifiOff } from 'lucide-react';

interface Props {
  streak: number;
  totalCompleted: number;
  onOpenSettings: () => void;
  hasApiKey: boolean;
  online: boolean;
}

export default function Header({ streak, totalCompleted, onOpenSettings, hasApiKey, online }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-600/60 bg-ink-900/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-emerald-500 text-ink-900 shadow-neon">
            <Dumbbell size={20} />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
              TeenFit <span className="text-lime-neon">AI</span>
            </h1>
            <p className="hidden text-[11px] text-slate-400 sm:block">Твій кишеньковий спортивний ментор</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!online && (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
              <WifiOff size={14} className="text-amber-400" />
              <span className="hidden text-xs font-bold text-amber-300 sm:inline">Офлайн</span>
            </div>
          )}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-coral/30 bg-coral/10 px-3 py-1.5">
              <Flame size={16} className="text-coral-neon" />
              <span className="text-sm font-bold text-coral-neon">{streak}</span>
            </div>
          )}
          {totalCompleted > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-3 py-1.5">
              <Dumbbell size={14} className="text-lime-neon" />
              <span className="text-sm font-bold text-lime-neon">{totalCompleted}</span>
            </div>
          )}

          <button
            onClick={onOpenSettings}
            className="group flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-700/60 px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:border-lime/40 hover:text-lime-neon"
          >
            <span className="text-base">⚙️</span>
            <span className="hidden sm:inline">AI Налаштування</span>
            {!hasApiKey && (
              <span className="flex h-2 w-2 rounded-full bg-lime-neon animate-pulse-soft" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
