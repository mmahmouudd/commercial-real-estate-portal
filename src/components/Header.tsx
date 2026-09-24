import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { CloseIcon, LockIcon, ShieldIcon } from "./Icons";

const links = [
  { label: "Property search", href: "#search" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "ROI calculator", href: "#roi" },
  { label: "Services", href: "#services" },
  { label: "Insights", href: "#insights" },
];

interface HeaderProps {
  onLogin: () => void;
}

export default function Header({ onLogin }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        !panelRef.current?.contains(e.target as Node) &&
        !toggleRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-ink-100/80 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-all duration-300 lg:px-8",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <a href="#top" className="group flex items-center gap-3 rounded-lg">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-ink-900 to-brand-700 text-white shadow-lg shadow-brand-900/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 20V8l5-4 5 4v12" />
              <path d="M14 12h6v8" />
              <path d="M2 20h20" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "font-display text-lg font-semibold tracking-tight transition-colors",
                scrolled ? "text-ink-900" : "text-ink-900"
              )}
            >
              Meridian
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              Office Park Partners
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 md:inline-flex">
            <ShieldIcon className="h-3.5 w-3.5" />
            SOC 2 Type II
          </span>
          <button
            type="button"
            onClick={onLogin}
            className="group inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ink-900/20 transition-all hover:-translate-y-0.5 hover:bg-ink-800 focus-visible:-translate-y-0.5"
          >
            <LockIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Client login</span>
            <span className="sm:hidden">Login</span>
          </button>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 bg-white text-ink-700 lg:hidden"
          >
            {open ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-100 bg-white/95 px-5 pb-5 pt-3 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-ink-700 hover:bg-ink-50"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#roi"
          onClick={() => setOpen(false)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
        >
          Request a portfolio review
        </a>
      </div>
    </header>
  );
}
