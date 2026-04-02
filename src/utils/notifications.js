export const NOTIFICATION_STORAGE_KEY = "app_notifications";

export function readNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeNotifications(items) {
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("app-notifications-updated"));
}

export function pushNotification(notification) {
  const current = readNotifications();
  const next = [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      read: false,
      route: "/enrollmentForm",
      ...notification,
    },
    ...current,
  ];
  writeNotifications(next);
}

export function markNotificationRead(id) {
  const next = readNotifications().map((item) => (item.id === id ? { ...item, read: true } : item));
  writeNotifications(next);
}
