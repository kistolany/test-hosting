import { CURRENT_USER_STORAGE_KEY } from "./notifications";

export const AUDIT_LOG_STORAGE_KEY = "app_audit_logs";

function formatAuditTime(timestamp) {
  try {
    const date = new Date(timestamp);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.toLocaleString("en-US", { hour: "numeric", hour12: true });
    const minute = date.toLocaleString("en-US", { minute: "2-digit" });
    return `${month} ${day}, ${year} ${hour}:${minute}`;
  } catch {
    return "";
  }
}

function readCurrentActor() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    const user = raw ? JSON.parse(raw) : null;
    if (!user || typeof user !== "object") return "System";
    return String(user.username || "").trim() || "System";
  } catch {
    return "System";
  }
}

const seedLogs = [
  {
    id: 1,
    createdAt: new Date("2026-03-03T15:30:00").getTime(),
    when: "Mar 3, 2026 3:30 PM",
    who: "Admin User",
    action: "Create",
    module: "Orders",
    description: "Created manual order ORD-20260303-003.",
    ip: "192.168.1.10",
    before: null,
    after: '{"orderNumber":"ORD-20260303-003","totalAmount":134.40}',
  },
  {
    id: 2,
    createdAt: new Date("2026-03-02T18:30:00").getTime(),
    when: "Mar 2, 2026 6:30 PM",
    who: "Dara Sok",
    action: "Update",
    module: "Orders",
    description: "Updated order ORD-20260302-002 status to confirmed.",
    ip: "192.168.1.11",
    before: '{"orderStatus":"pending"}',
    after: '{"orderStatus":"confirmed"}',
  },
];

export function readAuditLogs() {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (!raw) return seedLogs;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedLogs;
  } catch {
    return seedLogs;
  }
}

export function writeAuditLogs(logs) {
  localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(logs));
  window.dispatchEvent(new CustomEvent("app-audit-logs-updated"));
}

export function pushAuditLog(log) {
  const now = Date.now();
  const nextLog = {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    when: formatAuditTime(now),
    who: readCurrentActor(),
    action: "Update",
    module: "System",
    description: "Action executed.",
    ip: "192.168.1.10",
    before: null,
    after: null,
    ...log,
  };

  const current = readAuditLogs();
  writeAuditLogs([nextLog, ...current]);
}
