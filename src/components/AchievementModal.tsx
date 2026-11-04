import { Share2, X } from 'lucide-react';
import type { Achievement } from '../types';

interface Props {
  badges: Achievement[];
  onClose: () => void;
  onShare?: () => void;
}

const CONFETTI_COLORS = ['#84cc16', '#f43f5e', '#a3e635', '#fb7185', '#fbbf24', '#38bdf8'];

export default function AchievementModal({ badges, onClose, onShare }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute top-0 h-3 w-3 animate-confetti-fall"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            borderRadius: i % 2 ? '50%' : '2px',
            animationDelay: `${Math.random() * 0.6}s`,
          }}
        />
      ))}
      <div className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl border border-lime/30 bg-gradient-to-br from-ink-800 to-ink-700 p-6 text-center shadow-card animate-pop-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-ink-600 hover:text-white"
        >
          <X size={20} />
        </button>
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-lime-neon">Ти зробив це!</p>
        <h2 className="mb-4 text-2xl font-extrabold text-white">Нові досягнення 🎉</h2>
        <div className="space-y-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-2xl border border-lime/30 bg-lime/10 p-3.5 animate-pop-in"
            >
              <span className="text-3xl">{b.emoji}</span>
              <div className="text-left">
                <p className="text-sm font-bold text-white">{b.title}</p>
                <p className="text-xs text-slate-400">Розблоковано сьогодні</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-lime py-3 text-sm font-bold text-ink-900 shadow-neon transition hover:brightness-110 active:scale-[0.98]"
        >
          Продовжити круту звичку 💪
        </button>
        {onShare && (
          <button
            onClick={onShare}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-ink-500 py-3 text-sm font-bold text-slate-300 transition hover:border-lime/40 hover:text-lime-neon active:scale-[0.98]"
          >
            <Share2 size={16} />
            Поділитися результатом
          </button>
        )}
      </div>
    </div>
  );
}
