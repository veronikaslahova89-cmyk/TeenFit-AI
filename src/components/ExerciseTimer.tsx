import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Check } from 'lucide-react';
import { useI18n } from '../i18n';
import { playCompleteTone, playStartTone } from '../sound';

interface Props {
  duration: number; // seconds
  label: string;
  onComplete: () => void;
  onNext: () => void;
  isLast: boolean;
  soundEnabled: boolean;
}

export default function ExerciseTimer({
  duration,
  label,
  onComplete,
  onNext,
  isLast,
  soundEnabled,
}: Props) {
  const { t } = useI18n();
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
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (remaining > 0 || done) return;

    setRunning(false);
    setDone(true);
    if (soundEnabled) playCompleteTone();
    onComplete();
  }, [remaining, done, soundEnabled, onComplete]);

  const reset = useCallback(() => {
    setRemaining(duration);
    setDone(false);
    setRunning(false);
  }, [duration]);

  const toggleRunning = () => {
    const next = !running;
    if (next && remaining === duration && soundEnabled) playStartTone();
    setRunning(next);
  };

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
            {done ? t('timer.done') : running ? t('timer.running') : t('timer.ready')}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={reset}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-600 bg-ink-700 text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-95"
          aria-label={t('timer.reset')}
        >
          <RotateCcw size={20} />
        </button>

        {done ? (
          <button
            onClick={onNext}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-lime text-ink-900 shadow-neon transition hover:brightness-110 active:scale-95"
            aria-label={isLast ? t('timer.finish') : t('timer.skip')}
          >
            {isLast ? <Check size={28} /> : <SkipForward size={28} />}
          </button>
        ) : (
          <button
            onClick={toggleRunning}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-coral text-white shadow-coral transition hover:brightness-110 active:scale-95"
            aria-label={running ? t('timer.pause') : t('timer.start')}
          >
            {running ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
        )}

        {!done && (
          <button
            onClick={onNext}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-600 bg-ink-700 text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-95"
            aria-label={t('timer.skip')}
          >
            <SkipForward size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
