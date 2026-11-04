import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Check } from 'lucide-react';

interface Props {
  duration: number; // seconds
  label: string;
  onComplete: () => void;
  onNext: () => void;
  isLast: boolean;
}

export default function ExerciseTimer({ duration, label, onComplete, onNext, isLast }: Props) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemaining(duration);
    setDone(false);
    setRunning(false);
  }, [duration, label]);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setDone(true);
            onComplete();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining, onComplete]);

  const reset = useCallback(() => {
    setRemaining(duration);
    setDone(false);
    setRunning(false);
  }, [duration]);

  const progress = done ? 1 : 1 - remaining / duration;
  const radius = 80;
  const circ = 2 * Math.PI * radius;
  const dash = circ * progress;

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[200px] w-[200px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#1e293b" strokeWidth="12" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={done ? '#84cc16' : '#f43f5e'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className="transition-all duration-1000 ease-linear"
            style={done ? {} : { filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.5))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tabular-nums text-white">{timeStr}</span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {done ? 'Готово!' : running ? 'Йде виконання' : 'Натисни старт'}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={reset}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-600 bg-ink-700 text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-95"
          aria-label="Скинути"
        >
          <RotateCcw size={20} />
        </button>

        {done ? (
          <button
            onClick={onNext}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-lime text-ink-900 shadow-neon transition hover:brightness-110 active:scale-95"
            aria-label={isLast ? 'Завершити' : 'Далі'}
          >
            {isLast ? <Check size={28} /> : <SkipForward size={28} />}
          </button>
        ) : (
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-coral text-white shadow-coral transition hover:brightness-110 active:scale-95"
            aria-label={running ? 'Пауза' : 'Старт'}
          >
            {running ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
        )}

        {!done && (
          <button
            onClick={onNext}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-600 bg-ink-700 text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-95"
            aria-label="Пропустити"
          >
            <SkipForward size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
