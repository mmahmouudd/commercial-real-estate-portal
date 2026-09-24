import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { CheckIcon, CloseIcon, LockIcon, MailIcon, ShieldIcon } from "./Icons";

type Step = "credentials" | "mfa" | "done";

const CODE_LENGTH = 6;

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => emailRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(t);
      prev?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (step === "mfa") {
      const t = window.setTimeout(() => codeRefs.current[0]?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const reset = () => {
    setStep("credentials");
    setError(null);
    setCode(Array(CODE_LENGTH).fill(""));
    setPassword("");
  };

  const close = () => {
    onClose();
    window.setTimeout(reset, 250);
  };

  const submitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Enter the work email associated with your account.");
      return;
    }
    if (password.length < 8) {
      setError("Passwords are at least 8 characters.");
      return;
    }
    setError(null);
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setStep("mfa");
    }, 650);
  };

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.join("").length !== CODE_LENGTH) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setError(null);
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setStep("done");
    }, 700);
  };

  const setDigit = (value: string, index: number) => {
    const digits = value.replace(/\D/g, "").split("");
    setCode((prev) => {
      const next = [...prev];
      if (digits.length === 0) next[index] = "";
      else if (digits.length === 1) {
        next[index] = digits[0];
        if (index < CODE_LENGTH - 1) codeRefs.current[index + 1]?.focus();
      } else {
        for (let i = 0; i < digits.length && index + i < CODE_LENGTH; i++) next[index + i] = digits[i];
      }
      return next;
    });
  };

  const onCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      e.preventDefault();
      codeRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) codeRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) codeRefs.current[index + 1]?.focus();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        aria-describedby="login-desc"
        className="relative w-full max-w-md animate-rise overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="relative bg-ink-900 px-6 pb-8 pt-6 text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_0%,rgba(31,119,237,0.5),transparent_55%)]"
          />
          <div className="relative flex items-start justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <LockIcon className="h-5 w-5" />
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close sign in dialog"
              className="grid h-9 w-9 place-items-center rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <h2 id="login-title" className="relative mt-4 font-display text-2xl font-semibold">
            {step === "done" ? "You're signed in" : "Client portal"}
          </h2>
          <p id="login-desc" className="relative mt-1 text-sm text-white/65">
            {step === "credentials" &&
              "Secure access to statements, work orders and rent rolls."}
            {step === "mfa" && `We sent a 6-digit code to ${email || "your device"}.`}
            {step === "done" && "Redirecting you to your portfolio dashboard."}
          </p>
          <div className="relative mt-4 flex items-center gap-4 text-[11px] font-medium text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <ShieldIcon className="h-3.5 w-3.5 text-mint-400" />
              TLS 1.3
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldIcon className="h-3.5 w-3.5 text-mint-400" />
              SAML 2.0 / SSO
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldIcon className="h-3.5 w-3.5 text-mint-400" />
              SOC 2 Type II
            </span>
          </div>
        </div>

        <div className="px-6 py-6">
          {step === "credentials" && (
            <form onSubmit={submitCredentials} noValidate>
              <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Work email
              </label>
              <div className="relative mt-1.5">
                <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  ref={emailRef}
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-ink-200 py-3 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Password
                  </label>
                  <a href="#contact" className="text-xs font-semibold text-brand-700 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-ink-200 px-3 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                />
              </div>

              <label className="mt-4 flex items-center gap-2.5 text-sm text-ink-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 accent-brand-600"
                />
                Keep me signed in on this device
              </label>

              {error && (
                <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
              >
                {pending && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {pending ? "Verifying…" : "Continue"}
              </button>

              <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                <span className="h-px flex-1 bg-ink-100" />
                or continue with SSO
                <span className="h-px flex-1 bg-ink-100" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {["Microsoft Entra", "Okta"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-300 hover:bg-ink-50"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <p className="mt-5 text-center text-xs text-ink-500">
                Need access?{" "}
                <a href="#contact" className="font-semibold text-brand-700 hover:underline">
                  Request credentials
                </a>
              </p>
            </form>
          )}

          {step === "mfa" && (
            <form onSubmit={submitCode} noValidate>
              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Two-factor code
                </legend>
                <div className="mt-3 flex justify-between gap-2">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        codeRefs.current[i] = el;
                      }}
                      value={digit}
                      onChange={(e) => setDigit(e.target.value, i)}
                      onKeyDown={(e) => onCodeKeyDown(e, i)}
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      maxLength={CODE_LENGTH}
                      aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
                      className="h-14 w-full rounded-xl border border-ink-200 text-center font-display text-xl font-semibold text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                    />
                  ))}
                </div>
              </fieldset>

              {error && (
                <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
              >
                {pending && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {pending ? "Confirming…" : "Verify and sign in"}
              </button>

              <div className="mt-4 flex items-center justify-between text-xs">
                <button type="button" onClick={reset} className="font-semibold text-ink-500 hover:text-ink-800">
                  Use a different email
                </button>
                <button type="button" className="font-semibold text-brand-700 hover:underline">
                  Resend code
                </button>
              </div>
            </form>
          )}

          {step === "done" && (
            <div className="text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                <CheckIcon className="h-7 w-7" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-ink-900">
                Welcome back, {email.split("@")[0] || "client"}
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Session secured with device-bound keys. This demo stops here — no data leaves your browser.
              </p>
              <button
                type="button"
                onClick={close}
                className={cn("mt-6 w-full rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-white")}
              >
                Back to site
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
