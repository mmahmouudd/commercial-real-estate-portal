import type { ReactElement } from "react";
import { logos, services, testimonial } from "@/data/properties";
import { BuildingIcon, ChartIcon, KeyIcon, LeafIcon, ShieldIcon, SparkIcon } from "./Icons";

const iconMap: Record<string, (p: { className?: string }) => ReactElement> = {
  building: BuildingIcon,
  key: KeyIcon,
  chart: ChartIcon,
  leaf: LeafIcon,
};

export default function Services() {
  return (
    <section id="services" className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300">
            <SparkIcon className="h-3.5 w-3.5" />
            What we run
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-ink-950 sm:text-4xl">
            One operating platform for every office park you own
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-600">
            From preventive maintenance to LP reporting, the portal gives asset managers, property
            teams and tenants the same source of truth.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => {
            const Icon = iconMap[s.icon];
            return (
              <li
                key={s.title}
                className="group relative flex flex-col rounded-2xl border border-ink-100 bg-gradient-to-b from-white to-ink-50/60 p-6 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-900 text-gold-300 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-950">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.body}</p>
              </li>
            );
          })}
        </ul>

        <div id="insights" className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <figure className="relative rounded-3xl border border-ink-100 bg-ink-50/70 p-8 sm:p-10">
            <span aria-hidden="true" className="absolute right-8 top-6 font-display text-7xl text-brand-200">
              &ldquo;
            </span>
            <blockquote className="relative font-display text-xl leading-relaxed text-ink-900 sm:text-2xl">
              {testimonial.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-ink-900 font-display text-sm font-semibold text-white">
                DW
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-900">{testimonial.name}</span>
                <span className="block text-xs text-ink-500">{testimonial.title}</span>
              </span>
            </figcaption>
          </figure>

          <div className="rounded-3xl bg-ink-900 p-8 text-white sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300 ring-1 ring-white/15">
              <ShieldIcon className="h-3.5 w-3.5" />
              Q3 market snapshot
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold">
              Metro office parks: absorption is back
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Class A campus product absorbed 1.2M sq ft this quarter while commodity suburban office
              stayed flat. Trophy amenities now drive a 24% rent premium.
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["1.2M", "sf absorbed"],
                ["$47.80", "avg. Class A rent"],
                ["24%", "amenity premium"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <dt className="font-display text-lg font-semibold text-white">{v}</dt>
                  <dd className="text-[11px] uppercase tracking-wide text-white/50">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
            Trusted by institutional owners &amp; REITs
          </p>
          <div className="marquee-mask mt-6 overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-12">
              {[...logos, ...logos].map((l, i) => (
                <span
                  key={`${l}-${i}`}
                  className="font-display text-lg font-semibold tracking-[0.18em] text-ink-300"
                  aria-hidden={i >= logos.length}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
