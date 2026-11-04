import { X, KeyRound, Sparkles, Zap, Bell } from 'lucide-react';
import { useState } from 'react';
import type { Settings } from '../types';
import { DEFAULT_MODEL, DEFAULT_SETTINGS, AVAILABLE_MODELS } from '../types';
import { notificationSupported, requestNotificationPermission } from '../reminders';

interface Props {
  settings: Settings;
  onClose: () => void;
  onSave: (s: Settings) => void;
}

export default function SettingsModal({ settings, onClose, onSave }: Props) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model || DEFAULT_MODEL);
  const [show, setShow] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(settings.reminderEnabled);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime || DEFAULT_SETTINGS.reminderTime);
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);

  const handleToggleReminder = async () => {
    setReminderError(null);
    if (reminderEnabled) {
      setReminderEnabled(false);
      return;
    }
    if (!notificationSupported()) {
      setReminderError('Цей браузер не підтримує сповіщення.');
      return;
    }
    setRequesting(true);
    const permission = await requestNotificationPermission();
    setRequesting(false);
    if (permission !== 'granted') {
      setReminderError('Дозвіл на сповіщення не надано. Увімкни його в налаштуваннях браузера.');
      return;
    }
    setReminderEnabled(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-ink-600 bg-ink-800 p-6 shadow-card animate-pop-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-ink-600 hover:text-white"
          aria-label="Закрити"
        >
          <X size={20} />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime/15 text-lime-neon">
            <KeyRound size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Налаштування</h2>
            <p className="text-sm text-slate-400">Підключи OpenRouter для живого AI-ментора</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-300">OpenRouter API Key</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full rounded-xl border border-ink-600 bg-ink-900 px-4 py-3 pr-20 text-sm text-white placeholder-slate-500 outline-none transition focus:border-lime/50"
              />
              <button
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:text-lime-neon"
              >
                {show ? 'Сховати' : 'Показати'}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-300">Модель</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-ink-600 bg-ink-900 px-4 py-3 text-sm text-white outline-none transition focus:border-lime/50"
            >
              {!AVAILABLE_MODELS.some((m) => m.id === model) && (
                <option value={model}>{model}</option>
              )}
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · free
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-slate-500">
              {AVAILABLE_MODELS.find((m) => m.id === model)?.hint ?? 'Власна модель OpenRouter'}
            </p>
          </div>

          <div className="rounded-xl border border-ink-600 bg-ink-900/40 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Bell size={18} className="mt-0.5 shrink-0 text-lime-neon" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">Нагадування про тренування</p>
                  <p className="text-xs text-slate-500">Якщо сьогодні ще не тренувався</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={reminderEnabled}
                aria-label="Нагадування про тренування"
                onClick={handleToggleReminder}
                disabled={requesting}
                className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-60 ${
                  reminderEnabled ? 'bg-lime' : 'bg-ink-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    reminderEnabled ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {reminderEnabled && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-ink-900/70 px-3 py-2">
                <span className="text-xs font-semibold text-slate-400">Час нагадування</span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="rounded-lg border border-ink-600 bg-ink-800 px-2.5 py-1.5 text-sm font-semibold text-white outline-none transition focus:border-lime/50"
                />
              </div>
            )}

            {reminderError && <p className="mt-2 text-xs text-coral-neon">{reminderError}</p>}

            <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500">
              Працює, поки застосунок відкритий або встановлений на пристрій. Сповіщення надходить один раз на день.
            </p>
          </div>

          <div className="rounded-xl border border-ink-600 bg-ink-900/60 p-3.5">
            <div className="flex items-start gap-2.5">
              <Sparkles size={18} className="mt-0.5 shrink-0 text-lime-neon" />
              <p className="text-xs leading-relaxed text-slate-400">
                Без ключа застосунок працює у <span className="font-semibold text-lime-neon">Mock-режимі</span> —
                тренування та підтримка доступні завжди. Ключ зберігається лише у твоєму браузері.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => {
                setApiKey('');
                setModel(DEFAULT_MODEL);
                setReminderEnabled(false);
                setReminderTime(DEFAULT_SETTINGS.reminderTime);
                setReminderError(null);
              }}
              className="rounded-xl border border-ink-600 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-coral/40 hover:text-coral-neon"
            >
              Скинути
            </button>
            <button
              onClick={() =>
                onSave({
                  apiKey: apiKey.trim(),
                  model: model.trim() || DEFAULT_MODEL,
                  reminderEnabled,
                  reminderTime: reminderTime || DEFAULT_SETTINGS.reminderTime,
                })
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-ink-900 shadow-neon transition hover:brightness-110 active:scale-[0.98]"
            >
              <Zap size={18} />
              Зберегти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
