import type { Availability } from "@prisma/client";
import { APP_TIMEZONE, APP_UTC_OFFSET_MINUTES } from "@/lib/format";

export type SlotPeriod = "Morning" | "Afternoon" | "Evening";

export type Slot = {
  iso: string;
  /** Full "Thu, 20 Aug, 10:00 am" label. */
  label: string;
  /** Clinic-local calendar day ("2026-08-20"), used to group slots per date. */
  dateKey: string;
  dayLabel: string;
  dateLabel: string;
  timeLabel: string;
  period: SlotPeriod;
};

const periodOf = (minutes: number): SlotPeriod =>
  minutes < 12 * 60 ? "Morning" : minutes < 17 * 60 ? "Afternoon" : "Evening";

const pad = (value: number) => String(value).padStart(2, "0");

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
};

/** Clinic-local (APP_TIMEZONE) calendar parts of an instant. */
const localParts = (instant: Date) => {
  const shifted = new Date(instant.getTime() + APP_UTC_OFFSET_MINUTES * 60_000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(),
  };
};

/** The instant at `minutes` past midnight of a clinic-local calendar day. */
const localInstant = (year: number, month: number, day: number, minutes: number) =>
  new Date(Date.UTC(year, month, day) + (minutes - APP_UTC_OFFSET_MINUTES) * 60_000);

/**
 * Builds bookable slots for the next `days` days from a doctor's weekly availability.
 * Availability windows are clinic-local times, so all arithmetic happens in APP_TIMEZONE
 * regardless of the server's own timezone.
 */
export function buildSlots(
  availabilities: Availability[],
  taken: Date[],
  days = 7,
  now = new Date()
): Slot[] {
  const takenKeys = new Set(taken.map((d) => d.toISOString()));
  const slots: Slot[] = [];
  const today = localParts(now);

  for (let offset = 0; offset < days; offset++) {
    const midnight = localInstant(today.year, today.month, today.day + offset, 0);
    const { year, month, day, weekday } = localParts(midnight);
    const weekly = availabilities.filter((a) => a.dayOfWeek === weekday);

    for (const window of weekly) {
      const end = toMinutes(window.endTime);
      for (let minute = toMinutes(window.startTime); minute + window.slotMinutes <= end; minute += window.slotMinutes) {
        const start = localInstant(year, month, day, minute);
        if (start.getTime() <= now.getTime()) continue;
        if (takenKeys.has(start.toISOString())) continue;
        slots.push({
          iso: start.toISOString(),
          label: start.toLocaleString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
            timeZone: APP_TIMEZONE,
          }),
          dateKey: `${year}-${pad(month + 1)}-${pad(day)}`,
          dayLabel: start.toLocaleString("en-IN", { weekday: "short", timeZone: APP_TIMEZONE }),
          dateLabel: start.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            timeZone: APP_TIMEZONE,
          }),
          timeLabel: start.toLocaleString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            timeZone: APP_TIMEZONE,
          }),
          period: periodOf(minute),
        });
      }
    }
  }

  return slots.sort((a, b) => a.iso.localeCompare(b.iso)).slice(0, 140);
}
