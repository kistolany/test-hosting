export const NOTIFICATION_STORAGE_KEY = "app_notifications";
export const CURRENT_USER_STORAGE_KEY = "app_current_user";

function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

function readStoredNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      username: String(parsed.username || "").trim(),
      role: normalizeRole(parsed.role),
    };
  } catch {
    return null;
  }
}

export function writeCurrentUser(user) {
  if (!user) return;
  const normalized = {
    username: String(user.username || "").trim(),
    role: normalizeRole(user.role),
  };
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(normalized));
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

function canUserSeeNotification(item, user) {
  const username = String(user?.username || "").trim();
  const role = normalizeRole(user?.role);

  const audienceRoles = Array.isArray(item.audienceRoles) ? item.audienceRoles.map(normalizeRole) : [];
  if (audienceRoles.length && !audienceRoles.includes(role)) return false;

  const audienceUsers = Array.isArray(item.audienceUsers) ? item.audienceUsers.map((x) => String(x || "").trim()) : [];
  if (audienceUsers.length && !audienceUsers.includes(username)) return false;

  const excludeUsers = Array.isArray(item.excludeUsers) ? item.excludeUsers.map((x) => String(x || "").trim()) : [];
  if (excludeUsers.length && excludeUsers.includes(username)) return false;

  return true;
}

export function readNotifications() {
  const user = readCurrentUser();
  return readStoredNotifications().filter((item) => canUserSeeNotification(item, user));
}

export function writeNotifications(items) {
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("app-notifications-updated"));
}

export function writeVisibleNotifications(items, user = readCurrentUser()) {
  const all = readStoredNotifications();
  const visibleIds = new Set(all.filter((item) => canUserSeeNotification(item, user)).map((item) => item.id));
  const hidden = all.filter((item) => !visibleIds.has(item.id));
  const merged = [...items, ...hidden].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  writeNotifications(merged);
}

export function pushNotification(notification) {
  const current = readStoredNotifications();
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
  const next = readStoredNotifications().map((item) => (item.id === id ? { ...item, read: true } : item));
  writeNotifications(next);
}
