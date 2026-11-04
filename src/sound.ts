let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioCtor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;

  if (!audioContext) audioContext = new AudioCtor();
  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }
  return audioContext;
}

function beep(
  ctx: AudioContext,
  frequency: number,
  startAt: number,
  duration: number,
  volume = 0.12,
): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration);
}

/** Short two-note signal when the exercise timer starts. */
export function playStartTone(): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  beep(ctx, 660, now, 0.12);
  beep(ctx, 990, now + 0.14, 0.16);
}

/** Three ascending notes when the exercise timer reaches zero. */
export function playCompleteTone(): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  beep(ctx, 660, now, 0.14);
  beep(ctx, 880, now + 0.16, 0.14);
  beep(ctx, 1320, now + 0.32, 0.28);
}
