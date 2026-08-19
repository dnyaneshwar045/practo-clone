"use client";

import { useMemo, useState } from "react";
import type { Slot, SlotPeriod } from "@/lib/slots";

const PERIODS: { key: SlotPeriod; icon: string; hint: string }[] = [
  { key: "Morning", icon: "☀️", hint: "before 12 pm" },
  { key: "Afternoon", icon: "🌤️", hint: "12 – 5 pm" },
  { key: "Evening", icon: "🌙", hint: "after 5 pm" },
];

type Day = { key: string; dayLabel: string; dateLabel: string; slots: Slot[] };

/** Date strip + period-grouped time chips; writes the chosen slot into a hidden input. */
export function SlotPicker({ slots, name = "slot" }: { slots: Slot[]; name?: string }) {
  const days = useMemo<Day[]>(() => {
    const grouped = new Map<string, Day>();
    for (const slot of slots) {
      const day =
        grouped.get(slot.dateKey) ??
        { key: slot.dateKey, dayLabel: slot.dayLabel, dateLabel: slot.dateLabel, slots: [] };
      day.slots.push(slot);
      grouped.set(slot.dateKey, day);
    }
    return [...grouped.values()];
  }, [slots]);

  const [activeDay, setActiveDay] = useState(days[0]?.key ?? "");
  const [selected, setSelected] = useState(days[0]?.slots[0]?.iso ?? "");

  const day = days.find((d) => d.key === activeDay) ?? days[0];
  const selectedSlot = slots.find((slot) => slot.iso === selected);

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={selected} />

      <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
        {days.map((entry) => {
          const active = entry.key === day?.key;
          return (
            <button
              key={entry.key}
              type="button"
              onClick={() => setActiveDay(entry.key)}
              className={`snap-start rounded-xl border px-3.5 py-2.5 text-center transition ${
                active
                  ? "border-sky-500 bg-sky-600 text-white shadow-lg shadow-sky-600/25"
                  : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-sky-300"
              }`}
            >
              <span className="block text-[11px] font-medium uppercase tracking-wide opacity-80">
                {entry.dayLabel}
              </span>
              <span className="block whitespace-nowrap text-sm font-semibold">{entry.dateLabel}</span>
              <span className={`block text-[11px] ${active ? "text-sky-100" : "text-emerald-600"}`}>
                {entry.slots.length} slots
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {PERIODS.map(({ key, icon, hint }) => {
          const periodSlots = (day?.slots ?? []).filter((slot) => slot.period === key);
          if (periodSlots.length === 0) return null;
          return (
            <div key={key} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span aria-hidden>{icon}</span>
                {key}
                <span className="font-normal normal-case tracking-normal text-slate-400">({hint})</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {periodSlots.map((slot) => (
                  <button
                    key={slot.iso}
                    type="button"
                    onClick={() => setSelected(slot.iso)}
                    aria-pressed={slot.iso === selected}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                      slot.iso === selected
                        ? "border-sky-600 bg-sky-600 text-white shadow-md shadow-sky-600/30"
                        : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-sky-400 hover:text-sky-700"
                    }`}
                  >
                    {slot.timeLabel}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-800">
        {selectedSlot ? (
          <>
            Selected: <strong>{selectedSlot.label}</strong>
          </>
        ) : (
          "Pick a time slot to continue"
        )}
      </p>
    </div>
  );
}
