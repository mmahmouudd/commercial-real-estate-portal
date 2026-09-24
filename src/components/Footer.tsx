import { LockIcon, MailIcon, MapIcon, PhoneIcon } from "./Icons";

const columns = [
  {
    title: "Platform",
    links: ["Property search", "Portfolio dashboard", "Work order desk", "CAM reconciliation", "Reporting suite"],
  },
  {
    title: "Solutions",
    links: ["Asset management", "Leasing & tenant rep", "Capital markets", "ESG reporting", "Advisory"],
  },
  {
    title: "Company",
    links: ["About Meridian", "Leadership", "Careers", "Newsroom", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy policy", "Terms of service", "Accessibility statement", "Security", "Responsible disclosure"],
  },
];

export default function Footer({ onLogin }: { onLogin: () => void }) {
  return (
    <footer className="bg-ink-950 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2.7fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-white/20 to-white/5 text-white ring-1 ring-white/15">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 20V8l5-4 5 4v12" />
                  <path d="M14 12h6v8" />
                  <path d="M2 20h20" />
                </svg>
              </span>
              <span className="font-display text-lg font-semibold">Meridian Office Park Partners</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Institutional-grade management for corporate office parks. 18.4 million square feet,
              42 buildings, one secure portal.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/70">
              <p className="flex items-center gap-2.5">
                <MapIcon className="h-4 w-4 text-gold-300" />
                1042 Meridian Pkwy, Suite 200, Northlake
              </p>
              <p className="flex items-center gap-2.5">
                <PhoneIcon className="h-4 w-4 text-gold-300" />
                (555) 014-2300
              </p>
              <p className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 text-gold-300" />
                leasing@meridianopp.com
              </p>
            </div>
            <button
              type="button"
              onClick={onLogin}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-white/85"
            >
              <LockIcon className="h-4 w-4" />
              Client login
            </button>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#top" className="text-sm text-white/65 transition-colors hover:text-white">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Meridian Office Park Partners, LLC. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Equal Housing Opportunity</span>
            <span aria-hidden="true">·</span>
            <span>Real Estate License #01948372</span>
            <span aria-hidden="true">·</span>
            <span>WCAG 2.2 AA</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
