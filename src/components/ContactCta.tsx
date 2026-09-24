import { useState } from "react";
import { ArrowIcon, CheckIcon, ClockIcon, MailIcon, PhoneIcon, ShieldIcon } from "./Icons";

const points = [
  "Portfolio review within 2 business days",
  "Operating expense benchmark by submarket",
  "No obligation, NDA on request",
];

export default function ContactCta() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative overflow-hidden bg-ink-50 py-16 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,#dbe4ef_1px,transparent_1px),linear-gradient(to_bottom,#dbe4ef_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
            <ClockIcon className="h-3.5 w-3.5" />
            Talk to an asset team
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-ink-950 sm:text-4xl">
            Let&rsquo;s benchmark your office park
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-600">
            Send us a rent roll or a building address. We&rsquo;ll return an operating plan with
            leasing velocity, CAM savings and a five-year value model.
          </p>

          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span className="text-sm font-medium text-ink-700">{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href="tel:+15550142300"
              className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 transition-colors hover:border-brand-200"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wider text-ink-400">Leasing desk</span>
                <span className="block text-sm font-semibold text-ink-900">(555) 014-2300</span>
              </span>
            </a>
            <a
              href="mailto:leasing@meridianopp.com"
              className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 transition-colors hover:border-brand-200"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-50 text-gold-700">
                <MailIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wider text-ink-400">Email</span>
                <span className="block text-sm font-semibold text-ink-900">leasing@meridianopp.com</span>
              </span>
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
          {sent ? (
            <div className="grid h-full place-items-center py-10 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                <CheckIcon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink-950">Request received</h3>
              <p className="mt-2 max-w-sm text-sm text-ink-600">
                A senior asset manager will reach out within one business day. Check your inbox for a
                calendar link.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="grid gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Full name
                  </label>
                  <input
                    id="c-name"
                    required
                    autoComplete="name"
                    className="mt-1.5 w-full rounded-xl border border-ink-200 px-3 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
                <div>
                  <label htmlFor="c-company" className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Company
                  </label>
                  <input
                    id="c-company"
                    autoComplete="organization"
                    className="mt-1.5 w-full rounded-xl border border-ink-200 px-3 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="c-email" className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Work email
                </label>
                <input
                  id="c-email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-1.5 w-full rounded-xl border border-ink-200 px-3 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-type" className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    I need help with
                  </label>
                  <select
                    id="c-type"
                    className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  >
                    <option>Property management</option>
                    <option>Leasing / tenant rep</option>
                    <option>Acquisition or disposition</option>
                    <option>Portal access</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="c-size" className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Portfolio size
                  </label>
                  <select
                    id="c-size"
                    className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  >
                    <option>Under 100,000 sf</option>
                    <option>100,000 – 500,000 sf</option>
                    <option>500,000 sf – 2M sf</option>
                    <option>2M sf+</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="c-notes" className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Notes
                </label>
                <textarea
                  id="c-notes"
                  rows={3}
                  placeholder="Tell us about the asset or submarket"
                  className="mt-1.5 w-full resize-none rounded-xl border border-ink-200 px-3 py-3 text-sm placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
              >
                Request a consultation
                <ArrowIcon className="h-4 w-4" />
              </button>
              <p className="flex items-center gap-2 text-[11px] text-ink-400">
                <ShieldIcon className="h-3.5 w-3.5" />
                Your information is encrypted and never shared with third parties.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
