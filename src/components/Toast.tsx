import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  message: string;
  onDone: () => void;
}

export default function Toast({ message, onDone }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2800);
    return () => window.clearTimeout(timer);
  }, [message, onDone]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className="flex max-w-md items-center gap-2.5 rounded-2xl border border-lime/40 bg-ink-800/95 px-4 py-3 text-sm font-semibold text-white shadow-card animate-fade-up"
      >
        <CheckCircle2 size={18} className="shrink-0 text-lime-neon" />
        {message}
      </div>
    </div>
  );
}
