import { useState, useCallback, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type { Level, GoalId, TimeOption, Screen, Workout, WeeklyPlan, Settings, AppData, Achievement, WorkoutFeedback } from './types';
import { GOALS } from './types';
import { generateWorkout, generateWeeklyPlan } from './openrouter';
import { loadData, loadSettings, saveSettings, completeWorkout } from './storage';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import EmptyState from './components/EmptyState';
import InputPanel from './components/InputPanel';
import WorkoutView from './components/WorkoutView';
import WeeklyPlanView from './components/WeeklyPlanView';
import AchievementModal from './components/AchievementModal';
import FeedbackModal from './components/FeedbackModal';
import ChallengesModal from './components/ChallengesModal';
import Toast from './components/Toast';
import { getChallenges, getWeekLabel, getWeeklyStats } from './challenges';
import { buildShareText, shareText } from './share';
import { startReminderLoop } from './reminders';

export default function App() {
  const [screen, setScreen] = useState<Screen>('empty');
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [data, setData] = useState<AppData>(() => loadData());
  const [showSettings, setShowSettings] = useState(false);
  const [level, setLevel] = useState<Level | null>(null);
  const [goal, setGoal] = useState<GoalId | null>(null);
  const [minutes, setMinutes] = useState<TimeOption>(10);
  const [error, setError] = useState<string | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [newBadges, setNewBadges] = useState<Achievement[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [online, setOnline] = useState(() => navigator.onLine);

  const challenges = useMemo(
    () => getChallenges(data.history, data.streak),
    [data.history, data.streak],
  );
  const weeklyStats = useMemo(
    () => getWeeklyStats(data.history, data.streak),
    [data.history, data.streak],
  );
  const weekLabel = getWeekLabel();

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => startReminderLoop(settings, data), [settings, data]);

  const handleSaveSettings = useCallback((s: Settings) => {
    setSettings(s);
    setShowSettings(false);
  }, []);

  const goToInputs = useCallback(() => {
    setError(null);
    setScreen('inputs');
  }, []);

  const startWeeklyFromEmpty = useCallback(async () => {
    setError(null);
    setScreen('inputs');
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  const handleShare = useCallback(async () => {
    const outcome = await shareText(buildShareText(data, weeklyStats, challenges));
    if (outcome === 'copied') setToast('Результат скопійовано — встав у сторіс!');
    else if (outcome === 'failed') setToast('Не вдалося поділитися. Спробуй ще раз.');
  }, [data, weeklyStats, challenges]);

  const handleGenerate = useCallback(async () => {
    if (!level || !goal) {
      setError('Обери свій рівень і ціль, щоб отримати план тренування');
      return;
    }
    setError(null);
    setScreen('loading');
    const result = await generateWorkout(settings.apiKey, settings.model, level, goal, minutes, data.history);
    setWorkout(result);
    setScreen('workout');
  }, [level, goal, minutes, settings, data.history]);

  const handleWeekly = useCallback(async () => {
    if (!level) {
      setError('Обери свій рівень підготовки для плану на тиждень');
      return;
    }
    setError(null);
    setScreen('loading');
    const result = await generateWeeklyPlan(settings.apiKey, settings.model, level, data.history);
    setWeeklyPlan(result);
    setScreen('weekly');
  }, [level, settings, data.history]);

  const handleComplete = useCallback(() => {
    setShowFeedback(true);
  }, []);

  const handleFeedback = useCallback((feedback: WorkoutFeedback | null) => {
    const completedBefore = new Set(
      getChallenges(data.history, data.streak)
        .filter((challenge) => challenge.completed)
        .map((challenge) => challenge.id),
    );

    const { data: updated, newBadges: badges } = completeWorkout(data, {
      level: level ?? 'beginner',
      goal: goal ?? 'energy',
      minutes,
      workoutTitle: workout?.title ?? 'Тренування',
      difficulty: feedback?.difficulty ?? null,
      soreness: feedback?.soreness ?? [],
      note: feedback?.note,
    });

    const newlyCompleted = getChallenges(updated.history, updated.streak).filter(
      (challenge) => challenge.completed && !completedBefore.has(challenge.id),
    );

    setData(updated);
    if (badges.length) setNewBadges(badges);
    if (newlyCompleted.length) {
      setToast(`Челендж виконано: ${newlyCompleted[0].title} ✅`);
    }
    setShowFeedback(false);
    setWorkout(null);
    setWeeklyPlan(null);
    setScreen('empty');
  }, [data, level, goal, minutes, workout]);

  const handleGoalSelect = useCallback((g: GoalId) => {
    setGoal(g);
    const found = GOALS.find((x) => x.id === g);
    if (found) setMinutes(found.minutes as TimeOption);
  }, []);

  const handleBack = useCallback(() => {
    setWorkout(null);
    setWeeklyPlan(null);
    setScreen('inputs');
  }, []);

  return (
    <div className="min-h-screen bg-ink-900">
      <Header
        streak={data.streak}
        totalCompleted={data.totalCompleted}
        onOpenSettings={() => setShowSettings(true)}
        hasApiKey={!!settings.apiKey}
        online={online}
      />

      <main className="pb-12">
        {screen === 'empty' && (
          <EmptyState
            onQuickStart={goToInputs}
            onWeeklyPlan={startWeeklyFromEmpty}
            challenges={challenges}
            onChallenges={() => setShowChallenges(true)}
          />
        )}

        {screen === 'inputs' && (
          <InputPanel
            level={level}
            goal={goal}
            minutes={minutes}
            onLevel={setLevel}
            onGoal={handleGoalSelect}
            onMinutes={setMinutes}
            onGenerate={handleGenerate}
            onWeekly={handleWeekly}
            error={error}
          />
        )}

        {screen === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={48} className="animate-spin text-lime-neon" />
            <p className="mt-4 text-sm font-semibold text-slate-400">
              {settings.apiKey && online ? 'AI-ментор думає...' : 'Готую тренування...'}
            </p>
          </div>
        )}

        {screen === 'workout' && workout && (
          <WorkoutView workout={workout} onBack={handleBack} onComplete={handleComplete} />
        )}

        {screen === 'weekly' && weeklyPlan && (
          <WeeklyPlanView plan={weeklyPlan} onBack={handleBack} />
        )}
      </main>

      {showSettings && (
        <SettingsModal settings={settings} onClose={() => setShowSettings(false)} onSave={handleSaveSettings} />
      )}

      {showFeedback && <FeedbackModal onSubmit={handleFeedback} />}

      {showChallenges && (
        <ChallengesModal
          challenges={challenges}
          stats={weeklyStats}
          weekLabel={weekLabel}
          canShare={data.totalCompleted > 0}
          onClose={() => setShowChallenges(false)}
          onShare={handleShare}
        />
      )}

      {newBadges.length > 0 && (
        <AchievementModal
          badges={newBadges}
          onClose={() => setNewBadges([])}
          onShare={handleShare}
        />
      )}

      {toast && <Toast message={toast} onDone={clearToast} />}
    </div>
  );
}
