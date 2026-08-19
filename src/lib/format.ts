/** All clinic times (availability windows, slots, preferred demo times) are in this timezone. */
export const APP_TIMEZONE = "Asia/Kolkata";
export const APP_UTC_OFFSET_MINUTES = 330;

/** Parses a `datetime-local` value ("2026-08-26T15:30") as clinic-local wall-clock time. */
export const parseAppDateTime = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return new Date(value);
  const [, year, month, day, hour, minute] = match.map(Number);
  return new Date(
    Date.UTC(year, month - 1, day, hour, minute) - APP_UTC_OFFSET_MINUTES * 60_000
  );
};

export const inr = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const dateTime = (value: Date | string) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: APP_TIMEZONE,
  });

export const dateOnly = (value: Date | string) =>
  new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: APP_TIMEZONE });

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
