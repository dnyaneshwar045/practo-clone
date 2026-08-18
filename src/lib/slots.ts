import type { Availability } from "@prisma/client";

export type Slot = { iso: string; label: string };

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
};

/** Builds bookable slots for the next `days` days from a doctor's weekly availability. */
export function buildSlots(
  availabilities: Availability[],
  taken: Date[],
  days = 7,
  now = new Date()
): Slot[] {
  const takenKeys = new Set(taken.map((d) => d.toISOString()));
  const slots: Slot[] = [];

  for (let offset = 0; offset < days; offset++) {
    const day = new Date(now);
    day.setDate(day.getDate() + offset);
    const weekly = availabilities.filter((a) => a.dayOfWeek === day.getDay());

    for (const window of weekly) {
      const end = toMinutes(window.endTime);
      for (let minute = toMinutes(window.startTime); minute + window.slotMinutes <= end; minute += window.slotMinutes) {
        const start = new Date(day);
        start.setHours(Math.floor(minute / 60), minute % 60, 0, 0);
        if (start.getTime() <= now.getTime()) continue;
        if (takenKeys.has(start.toISOString())) continue;
        slots.push({
          iso: start.toISOString(),
          label: start.toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }),
        });
      }
    }
  }

  return slots.sort((a, b) => a.iso.localeCompare(b.iso)).slice(0, 60);
}
