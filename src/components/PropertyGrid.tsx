import { useMemo, useState } from "react";
import { properties, type Property } from "@/data/properties";
import { cn } from "@/utils/cn";
import { fmtCurrency, fmtNumber, statusStyles } from "@/lib/format";
import { ArrowIcon, ClockIcon, DocumentIcon, SparkIcon } from "./Icons";

const tabs = ["All assets", "For Lease", "Investment Sale"] as const;

function PropertyCard({ p }: { p: Property }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_30px_60px_-30px_rgba(13,92,209,0.35)] focus-within:-translate-y-1">
      <div className="relative">
        <img
          src={p.image}
          alt={`Exterior view of ${p.name}, a ${p.floors}-story ${p.type.toLowerCase()} building in ${p.submarket}`}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 backdrop-blur",
            statusStyles[p.status]
          )}
        >
          {p.status}
        </span>
        {p.featured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink-950/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-300 backdrop-blur">
            <SparkIcon className="h-3 w-3" />
            Featured
          </span>
        )}
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between text-white">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/75">{p.submarket}</p>
          <p className="rounded-lg bg-white/15 px-2 py-1 text-xs font-semibold backdrop-blur">
            Built {p.yearBuilt}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-950">{p.name}</h3>
            <p className="mt-0.5 text-sm text-ink-500">{p.address}</p>
          </div>
          <span className="rounded-lg border border-ink-100 bg-ink-50 px-2 py-1 text-[11px] font-semibold text-ink-600">
            {p.type}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-3 divide-x divide-ink-100 rounded-xl border border-ink-100 bg-ink-50/50">
          <div className="px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Available</dt>
            <dd className="text-sm font-semibold text-ink-900">
              {p.availableSf > 0 ? `${fmtNumber(p.availableSf)} sf` : "—"}
            </dd>
          </div>
          <div className="px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Starting</dt>
            <dd className="text-sm font-semibold text-ink-900">${p.rentPsf.toFixed(2)}/sf</dd>
          </div>
          <div className="px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Occupancy</dt>
            <dd className="text-sm font-semibold text-ink-900">{p.occupancy}%</dd>
          </div>
        </dl>

        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-400"
              style={{ width: `${p.occupancy}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-ink-400">
            {p.occupancy}% of {fmtNumber(p.sf)} sq ft committed
          </p>
        </div>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {p.amenities.slice(0, 3).map((a) => (
            <li
              key={a}
              className="rounded-md bg-ink-50 px-2 py-1 text-[11px] font-medium text-ink-600"
            >
              {a}
            </li>
          ))}
          {p.amenities.length > 3 && (
            <li className="rounded-md px-1.5 py-1 text-[11px] font-medium text-ink-400">
              +{p.amenities.length - 3} more
            </li>
          )}
        </ul>

        <div className="mt-5 flex items-end justify-between border-t border-ink-100 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              {p.status === "Investment Sale" ? "Asking price" : "Asset value"}
            </p>
            <p className="font-display text-lg font-semibold text-ink-950">
              {fmtCurrency(p.salePrice ?? 0, 0).replace(/\.00$/, "")}
            </p>
            <p className="text-[11px] font-medium text-mint-500">
              {p.capRate?.toFixed(1)}% in-place cap
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="#portfolio"
              aria-label={`Download the offering memorandum for ${p.name}`}
              className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 text-ink-600 transition-colors hover:border-ink-300 hover:bg-ink-50"
            >
              <DocumentIcon className="h-4 w-4" />
            </a>
            <button
              type="button"
              aria-label={`Schedule a tour of ${p.name}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
            >
              Tour
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PropertyGrid() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All assets");

  const filtered = useMemo(
    () => properties.filter((p) => (tab === "All assets" ? true : p.status === tab)),
    [tab]
  );

  return (
    <section id="portfolio" className="bg-ink-50/60 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
              <ClockIcon className="h-3.5 w-3.5" />
              Updated hourly
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-ink-950 sm:text-4xl">
              Signature office park assets
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-600">
              Six of the 42 buildings we operate across the metro. Every listing includes stacked
              plans, TI allowances and 10-year operating history once you sign in.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Filter portfolio"
            className="flex shrink-0 gap-1 self-start rounded-xl border border-ink-200 bg-white p-1 md:self-auto"
          >
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                  tab === t ? "bg-ink-900 text-white" : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-ink-200 bg-white/70 p-6 sm:flex-row">
          <p className="text-sm text-ink-600">
            <span className="font-semibold text-ink-900">36 more assets</span> are visible to signed-in
            clients, including off-market dispositions.
          </p>
          <a
            href="#roi"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-colors hover:bg-brand-700"
          >
            Unlock full inventory
            <ArrowIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
