import { useState, useCallback, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type {
  Achievement,
  AppData,
  Exercise,
  GoalId,
  Language,
  Level,
  Screen,
  Settings,
  TimeOption,
  WeeklyPlan,
  Workout,
  WorkoutFeedback,
} from './types';
import { GOALS } from './types';
import { generateWorkout, generateWeeklyPlan } from './openrouter';
import {
  completeWorkout,
  isSameExercise,
  loadData,
  loadFavoriteExercises,
  loadSettings,
  saveFavoriteExercises,
  saveSettings,
} from './storage';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import EmptyState from './components/EmptyState';
import InputPanel from './components/InputPanel';
import WorkoutView from './components/WorkoutView';
import WeeklyPlanView from './components/WeeklyPlanView';
import AchievementModal from './components/AchievementModal';
import FeedbackModal from './components/FeedbackModal';
import ChallengesModal from './components/ChallengesModal';
import FavoritesView from './components/FavoritesView';
import Toast from './components/Toast';
import { getChallenges, getWeekLabel, getWeeklyStats } from './challenges';
import { buildShareText, shareText } from './share';
import { startReminderLoop } from './reminders';
import { I18nContext, translate, type TFunction } from './i18n';

export default function App() {
  const [screen, setScreen] = useState<Screen>('empty');
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [data, setData] = useState<AppData>(() => loadData());
  const [favoriteExercises, setFavoriteExercises] = useState<Exercise[]>(() =>
    loadFavoriteExercises(),
  );
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

  const t = useMemo<TFunction>(
    () => (key, params) => translate(settings.language, key, params),
    [settings.language],
  );
  const i18n = useMemo(() => ({ lang: settings.language, t }), [settings.language, t]);

  const challenges = useMemo(
    () => getChallenges(data.history, data.streak, settings.language),
    [data.history, data.streak, settings.language],
  );
  const weeklyStats = useMemo(
    () => getWeeklyStats(data.history, data.streak),
    [data.history, data.streak],
  );
  const weekLabel = getWeekLabel(settings.language);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveFavoriteExercises(favoriteExercises);
  }, [favoriteExercises]);

  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

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

  const handleSaveSettings = useCallback((next: Settings) => {
    setSettings(next);
    setShowSettings(false);
  }, []);

  const goToInputs = useCallback(() => {
    setError(null);
    setScreen('inputs');
  }, []);

  const openWeeklySchedule = useCallback(
    async (planLevel: Level, languageOverride?: Language) => {
      const language = languageOverride ?? settings.language;
      setError(null);
      setLevel(planLevel);
      setScreen('loading');
      const result = await generateWeeklyPlan(
        settings.apiKey,
        settings.model,
        planLevel,
        language,
        data.history,
      );
      setWeeklyPlan(result);
      setScreen('weekly');
    },
    [settings.apiKey, settings.model, settings.language, data.history],
  );

  const startWeeklyFromEmpty = useCallback(() => {
    const lastLevel = [...data.history].reverse().find((entry) => entry.level)?.level;
    void openWeeklySchedule(level ?? lastLevel ?? 'amateur');
  }, [data.history, level, openWeeklySchedule]);

  const handleWeeklyLevel = useCallback(
    (nextLevel: Level) => {
      void openWeeklySchedule(nextLevel);
    },
    [openWeeklySchedule],
  );

  const handleLanguageChange = useCallback(
    (language: Language) => {
      setSettings((prev) => (prev.language === language ? prev : { ...prev, language }));
      if (screen === 'weekly' && level) {
        void openWeeklySchedule(level, language);
      }
    },
    [screen, level, openWeeklySchedule],
  );

  const clearToast = useCallback(() => setToast(null), []);

  const handleToggleFavorite = useCallback((exercise: Exercise) => {
    setFavoriteExercises((current) =>
      current.some((favorite) => isSameExercise(favorite, exercise))
        ? current.filter((favorite) => !isSameExercise(favorite, exercise))
        : [...current, exercise],
    );
  }, []);

  const handleShare = useCallback(async () => {
    const outcome = await shareText(
      buildShareText(data, weeklyStats, challenges, settings.language),
      settings.language,
    );
    if (outcome === 'copied') setToast(t('toast.copied'));
    else if (outcome === 'failed') setToast(t('toast.shareFailed'));
  }, [data, weeklyStats, challenges, settings.language, t]);

  const handleGenerate = useCallback(async () => {
    if (!level || !goal) {
      setError(t('input.errorLevelGoal'));
      return;
    }
    setError(null);
    setScreen('loading');
    const result = await generateWorkout(
      settings.apiKey,
      settings.model,
      level,
      goal,
      minutes,
      settings.language,
      data.history,
    );
    setWorkout(result);
    setScreen('workout');
  }, [level, goal, minutes, settings, data.history, t]);

  const handleWeekly = useCallback(async () => {
    if (!level) {
      setError(t('input.errorLevelWeekly'));
      return;
    }
    void openWeeklySchedule(level);
  }, [level, openWeeklySchedule, t]);

  const handleComplete = useCallback(() => {
    setShowFeedback(true);
  }, []);

  const handleFeedback = useCallback(
    (feedback: WorkoutFeedback | null) => {
      const completedBefore = new Set(
        getChallenges(data.history, data.streak, settings.language)
          .filter((challenge) => challenge.completed)
          .map((challenge) => challenge.id),
      );

      const { data: updated, newBadges: badges } = completeWorkout(
        data,
        {
          level: level ?? 'beginner',
          goal: goal ?? 'energy',
          minutes,
          workoutTitle:
            workout?.title ?? (settings.language === 'uk' ? 'Тренування' : 'Workout'),
          difficulty: feedback?.difficulty ?? null,
          soreness: feedback?.soreness ?? [],
          note: feedback?.note,
        },
        settings.language,
      );

      const newlyCompleted = getChallenges(
        updated.history,
        updated.streak,
        settings.language,
      ).filter((challenge) => challenge.completed && !completedBefore.has(challenge.id));

      setData(updated);
      if (badges.length) setNewBadges(badges);
      if (newlyCompleted.length) {
        setToast(t('challenges.toast', { title: newlyCompleted[0].title }));
      }
      setShowFeedback(false);
      setWorkout(null);
      setWeeklyPlan(null);
      setScreen('empty');
    },
    [data, level, goal, minutes, workout, settings.language, t],
  );

  const handleGoalSelect = useCallback((nextGoal: GoalId) => {
    setGoal(nextGoal);
    const found = GOALS.find((item) => item.id === nextGoal);
    if (found) setMinutes(found.minutes as TimeOption);
  }, []);

  const handleBack = useCallback(() => {
    setWorkout(null);
    setWeeklyPlan(null);
    setScreen('inputs');
  }, []);

  return (
    <I18nContext.Provider value={i18n}>
      <div className="min-h-screen bg-ink-900">
        <Header
          streak={data.streak}
          totalCompleted={data.totalCompleted}
          onOpenSettings={() => setShowSettings(true)}
          hasApiKey={!!settings.apiKey}
          online={online}
          language={settings.language}
          onLanguageChange={handleLanguageChange}
        />

        <main className="pb-12">
          {screen === 'empty' && (
            <EmptyState
              onQuickStart={goToInputs}
              onWeeklyPlan={startWeeklyFromEmpty}
              challenges={challenges}
              onChallenges={() => setShowChallenges(true)}
              favoritesCount={favoriteExercises.length}
              onFavorites={() => setScreen('favorites')}
            />
          )}

          {screen === 'favorites' && (
            <FavoritesView
              exercises={favoriteExercises}
              onBack={() => setScreen('empty')}
              onToggleFavorite={handleToggleFavorite}
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
                {settings.apiKey && online ? t('app.loadingAI') : t('app.loadingMock')}
              </p>
            </div>
          )}

          {screen === 'workout' && workout && (
            <WorkoutView
              workout={workout}
              onBack={handleBack}
              onComplete={handleComplete}
              soundEnabled={settings.soundEnabled}
              favoriteExercises={favoriteExercises}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {screen === 'weekly' && weeklyPlan && (
            <WeeklyPlanView
              plan={weeklyPlan}
              level={level}
              onBack={handleBack}
              onLevelChange={handleWeeklyLevel}
            />
          )}
        </main>

        {showSettings && (
          <SettingsModal
            settings={settings}
            onClose={() => setShowSettings(false)}
            onSave={handleSaveSettings}
            onLanguageChange={handleLanguageChange}
          />
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
    </I18nContext.Provider>
  );
}
