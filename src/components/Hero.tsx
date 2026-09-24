import { useState } from "react";
import heroImg from "@/assets/hero.jpg";
import { stats } from "@/data/properties";
import { ArrowIcon, SearchIcon, SlidersIcon, SparkIcon } from "./Icons";
import { cn } from "@/utils/cn";

const tabs = ["Lease space", "Acquire asset"] as const;

export default function Hero({ onExplore }: { onExplore: () => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Lease space");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-ink-50 via-white to-white pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-gold-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 shadow-sm">
            <SparkIcon className="h-3.5 w-3.5" />
            18.4M sq ft under management
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] text-ink-950 sm:text-5xl lg:text-6xl">
            Operate, lease and grow your{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">office park</span>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-1.5 -z-0 h-3.5 rounded-full bg-gold-300/70" />
            </span>{" "}
            portfolio.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            Meridian is the operating system for corporate office parks — live availability, tenant
            work orders, CAM reconciliation and institutional-grade reporting behind one secure
            client portal.
          </p>

          <div className="mt-8 rounded-2xl border border-ink-100 bg-white/90 p-3 shadow-[0_30px_60px_-40px_rgba(6,13,22,0.5)] backdrop-blur">
            <div className="flex flex-wrap gap-1" role="tablist" aria-label="Search mode">
              {tabs.map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                    tab === t ? "bg-ink-900 text-white shadow-sm" : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
                  )}
                >
                  {t}
                </button>
              ))}
              <span className="ml-auto hidden items-center gap-1.5 self-center pr-2 text-xs font-medium text-ink-400 sm:flex">
                <SlidersIcon className="h-4 w-4" />
                {tab === "Lease space" ? "Live availabilities" : "Off-market inventory"}
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                onExplore();
              }}
              className="mt-3 grid gap-2 sm:grid-cols-[1.4fr_1fr_auto]"
            >
              <div className="relative">
                <label htmlFor="hero-location" className="sr-only">
                  Submarket or address
                </label>
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="hero-location"
                  type="search"
                  placeholder="Submarket, city or building name"
                  className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-9 pr-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                />
              </div>
              <div>
                <label htmlFor="hero-size" className="sr-only">
                  Minimum square feet
                </label>
                <select
                  id="hero-size"
                  defaultValue=""
                  className="w-full appearance-none rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm text-ink-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                >
                  <option value="" disabled>
                    Minimum size
                  </option>
                  <option>5,000+ sq ft</option>
                  <option>20,000+ sq ft</option>
                  <option>50,000+ sq ft</option>
                  <option>100,000+ sq ft</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 focus-visible:ring-4 focus-visible:ring-brand-500/30"
              >
                Search
                <ArrowIcon className="h-4 w-4" />
              </button>
            </form>
            <p aria-live="polite" className="mt-2 px-1 text-xs text-ink-400">
              {submitted
                ? "Loading the interactive map canvas…"
                : "6 assets match current filters across 6 submarkets."}
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">{s.label}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink-900">
                  {s.value}
                  <span className="ml-1 text-sm font-medium text-brand-600">{s.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-rise [animation-delay:150ms]">
          <div className="relative overflow-hidden rounded-[28px] border border-white/60 shadow-[0_50px_90px_-50px_rgba(6,13,22,0.65)]">
            <img
              src={heroImg}
              alt="Aerial view of a corporate office park campus with glass office buildings, lawns and reflecting ponds at golden hour"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/5] lg:aspect-[4/4.6]"
              loading="eager"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />

            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-white/12 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">Northlake Corridor</p>
                  <p className="font-display text-lg font-semibold">Meridian Ridge Center</p>
                </div>
                <span className="rounded-full bg-mint-400 px-2.5 py-1 text-xs font-bold text-ink-900">
                  82% leased
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-white">
                {[
                  ["48,200", "sq ft avail."],
                  ["$42.50", "per sq ft"],
                  ["6", "floors"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-xl bg-white/12 px-2 py-2">
                    <p className="text-sm font-semibold">{v}</p>
                    <p className="text-[10px] uppercase tracking-wide text-white/70">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="animate-drift absolute -left-4 top-8 hidden rounded-2xl border border-ink-100 bg-white p-3 shadow-xl sm:block lg:-left-10">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Portfolio NOI</p>
            <p className="font-display text-xl font-semibold text-ink-900">$412.8M</p>
            <p className="text-xs font-medium text-emerald-600">+6.4% YoY</p>
          </div>

          <div className="animate-drift absolute -right-3 bottom-24 hidden rounded-2xl border border-ink-100 bg-white p-3 shadow-xl [animation-delay:1.2s] sm:block lg:-right-8">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600">
                <SparkIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-ink-900">Work order #4821</p>
                <p className="text-[11px] text-ink-500">Resolved in 2h 14m</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
