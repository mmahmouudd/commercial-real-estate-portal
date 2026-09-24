import { useMemo, useState } from "react";
import { properties, propertyTypes, submarkets, type Property } from "@/data/properties";
import MapCanvas from "./MapCanvas";
import { cn } from "@/utils/cn";
import { fmtCompact, fmtNumber, statusStyles } from "@/lib/format";
import { ArrowIcon, MapIcon, PinIcon, SlidersIcon } from "./Icons";

const sizeOptions = [
  { label: "Any size", value: 0 },
  { label: "10,000+ sf", value: 10000 },
  { label: "25,000+ sf", value: 25000 },
  { label: "50,000+ sf", value: 50000 },
];

const amenityFilters = ["Fitness center", "On-site café", "EV charging", "Conference hub", "Daycare"];

export default function MapSearch() {
  const [submarket, setSubmarket] = useState("All submarkets");
  const [type, setType] = useState<(typeof propertyTypes)[number]>("All types");
  const [minSf, setMinSf] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(properties[0].id);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo<Property[]>(
    () =>
      properties.filter((p) => {
        if (submarket !== "All submarkets" && p.submarket !== submarket) return false;
        if (type !== "All types" && p.type !== type) return false;
        if (p.availableSf < minSf) return false;
        if (amenities.length && !amenities.every((a) => p.amenities.includes(a))) return false;
        if (
          query.trim() &&
          !`${p.name} ${p.address} ${p.submarket} ${p.id}`.toLowerCase().includes(query.toLowerCase())
        )
          return false;
        return true;
      }),
    [submarket, type, minSf, amenities, query]
  );

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const reset = () => {
    setSubmarket("All submarkets");
    setType("All types");
    setMinSf(0);
    setAmenities([]);
    setQuery("");
  };

  const activeFilters = [
    submarket !== "All submarkets" ? submarket : null,
    type !== "All types" ? type : null,
    minSf ? `${fmtCompact(minSf)}+ sf` : null,
    ...amenities,
  ].filter(Boolean) as string[];

  return (
    <section id="search" className="relative border-y border-ink-100 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
              <MapIcon className="h-3.5 w-3.5" />
              Interactive map search
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-ink-950 sm:text-4xl">
              Find space the way tenants actually tour it
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-600">
              Filter the portfolio by submarket, suite size and building amenities, then jump straight
              into a stacked plan or a same-day tour request.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="advanced-filters"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-300 hover:bg-ink-50 lg:self-auto"
          >
            <SlidersIcon className="h-4 w-4" />
            {showFilters ? "Hide filters" : "Advanced filters"}
            <span className="rounded-md bg-ink-900 px-1.5 py-0.5 text-[11px] font-bold text-white">
              {activeFilters.length}
            </span>
          </button>
        </div>

        <div
          id="advanced-filters"
          hidden={!showFilters}
          className="mt-6 grid gap-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label htmlFor="f-submarket" className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Submarket
            </label>
            <select
              id="f-submarket"
              value={submarket}
              onChange={(e) => setSubmarket(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            >
              {submarkets.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-size" className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Minimum contiguous
            </label>
            <select
              id="f-size"
              value={minSf}
              onChange={(e) => setMinSf(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            >
              {sizeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">Amenities</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {amenityFilters.map((a) => {
                const on = amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    aria-pressed={on}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                      on
                        ? "bg-ink-900 text-white"
                        : "border border-ink-200 bg-white text-ink-600 hover:border-ink-300"
                    )}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.65fr_1fr]">
          <div className="flex min-h-[420px] flex-col gap-3 lg:min-h-[560px]">
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
                    type === t
                      ? "border-transparent bg-brand-600 text-white shadow-sm"
                      : "border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative min-h-[380px] flex-1">
              <MapCanvas properties={results} activeId={activeId} onSelect={setActiveId} />
              {results.length === 0 && (
                <div className="absolute inset-0 grid place-items-center rounded-2xl bg-white/80 backdrop-blur">
                  <div className="max-w-xs rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-card">
                    <p className="font-display text-lg font-semibold text-ink-900">No exact matches</p>
                    <p className="mt-1 text-sm text-ink-500">
                      Adjust your filters — or ask our leasing team about upcoming availabilities.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-4 w-full rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Reset filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-[420px] flex-col rounded-2xl border border-ink-100 bg-white shadow-card lg:min-h-[560px]">
            <div className="border-b border-ink-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-900">{results.length} assets</h3>
                  <p className="text-xs text-ink-500">Sorted by availability</p>
                </div>
                {activeFilters.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    Clear
                  </button>
                )}
              </div>
              <label htmlFor="map-search" className="sr-only">
                Search assets
              </label>
              <input
                id="map-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, address or ID"
                className="mt-3 w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              />
            </div>

            <ul className="max-h-[440px] flex-1 divide-y divide-ink-100 overflow-y-auto lg:max-h-none">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(p.id)}
                    onMouseEnter={() => setActiveId(p.id)}
                    aria-current={activeId === p.id}
                    className={cn(
                      "flex w-full items-start gap-3 p-4 text-left transition-colors",
                      activeId === p.id ? "bg-brand-50/70" : "hover:bg-ink-50/70"
                    )}
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="h-16 w-20 shrink-0 rounded-lg object-cover ring-1 ring-ink-900/5"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-ink-900">{p.name}</span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1",
                            statusStyles[p.status]
                          )}
                        >
                          {p.status}
                        </span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
                        <PinIcon className="h-3.5 w-3.5 text-ink-400" />
                        {p.submarket}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-600">
                        <span className="font-semibold text-ink-900">
                          {p.availableSf > 0 ? `${fmtNumber(p.availableSf)} sf` : "Waitlist"}
                        </span>
                        <span>${p.rentPsf.toFixed(2)}/sf</span>
                        <span>{p.occupancy}% occ.</span>
                      </span>
                    </span>
                    <ArrowIcon
                      className={cn(
                        "mt-1 h-4 w-4 shrink-0 transition-transform",
                        activeId === p.id ? "translate-x-0 text-brand-600" : "-translate-x-1 text-ink-300"
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink-100 p-4">
              <a
                href="#roi"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
              >
                Model returns for these assets
                <ArrowIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
