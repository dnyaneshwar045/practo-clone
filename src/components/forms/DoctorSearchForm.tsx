import { Field } from "@/components/ui";
import { input } from "@/components/forms/styles";

export function DoctorSearchForm({
  specialties,
  cities,
  current,
}: {
  specialties: string[];
  cities: string[];
  current: { q?: string; specialty?: string; city?: string };
}) {
  return (
    <form className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4 sm:items-end">
      <Field label="Doctor or clinic">
        <input name="q" defaultValue={current.q ?? ""} className={input} placeholder="Name, clinic…" />
      </Field>
      <Field label="Specialty">
        <select name="specialty" defaultValue={current.specialty ?? ""} className={input}>
          <option value="">All specialties</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      </Field>
      <Field label="City">
        <select name="city" defaultValue={current.city ?? ""} className={input}>
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </Field>
      <button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
        Search
      </button>
    </form>
  );
}
