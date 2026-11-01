/**
 * Deterministic date and time formatting utilities that produce identical outputs
 * on both server (SSR) and client (hydration) regardless of machine timezone or locale.
 */

export function formatUtcDateTime(ts?: string | number | Date | null): string {
  if (!ts) return "Just now";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return String(ts);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    const seconds = String(d.getUTCSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
  } catch {
    return String(ts);
  }
}

export function formatUtcTime(ts?: string | number | Date | null): string {
  if (!ts) return "00:00:00 UTC";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return String(ts);
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    const seconds = String(d.getUTCSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds} UTC`;
  } catch {
    return String(ts);
  }
}

export function formatUtcHourMinute(ts?: string | number | Date | null): string {
  if (!ts) return "00:00 UTC";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "00:00 UTC";
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes} UTC`;
  } catch {
    return "00:00 UTC";
  }
}

export function getUtcHourSlot(ts?: string | number | Date | null): string {
  if (!ts) return "00:00";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "00:00";
    const hours = String(d.getUTCHours()).padStart(2, "0");
    return `${hours}:00`;
  } catch {
    return "00:00";
  }
}

/**
 * Deterministic standard 8 hourly slots matching reference SIEM dashboard:
 * 23:00, 00:00, 01:00, 02:00, 03:00, 04:00, 05:00, 06:00
 */
export const DETERMINISTIC_HOURLY_SLOTS = [
  "23:00",
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
] as const;
