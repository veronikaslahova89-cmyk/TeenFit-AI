import type { AppData, Settings } from './types';

const LAST_REMINDER_KEY = 'teenfit_last_reminder';

function todayStr(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function notificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission(): NotificationPermission {
  if (!notificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationSupported()) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export function reminderDue(settings: Settings, data: AppData, now = new Date()): boolean {
  if (!settings.reminderEnabled) return false;
  if (data.lastCompleted === todayStr()) return false;
  if (notificationPermission() !== 'granted') return false;

  const [hours, minutes] = settings.reminderTime.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;

  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);
  if (now < target) return false;

  return localStorage.getItem(LAST_REMINDER_KEY) !== todayStr();
}

export async function showReminder(): Promise<void> {
  const title = 'Час тренуватися! 💪';
  const options: NotificationOptions = {
    body: '10 хвилин — і ти зробиш крок до кращої форми. Твій AI-ментор уже чекає.',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'teenfit-reminder',
  };

  const registration = await navigator.serviceWorker?.getRegistration();
  if (registration) {
    await registration.showNotification(title, options);
  } else {
    new Notification(title, options);
  }
  localStorage.setItem(LAST_REMINDER_KEY, todayStr());
}

/** Checks the reminder every minute while the app is open. Returns a cleanup function. */
export function startReminderLoop(settings: Settings, data: AppData): () => void {
  if (!settings.reminderEnabled || notificationPermission() !== 'granted') {
    return () => {};
  }

  const tick = () => {
    if (reminderDue(settings, data)) {
      showReminder().catch(() => {
        // Notifications can fail silently when the OS blocks them.
      });
    }
  };

  tick();
  const timer = window.setInterval(tick, 60_000);
  return () => window.clearInterval(timer);
}
