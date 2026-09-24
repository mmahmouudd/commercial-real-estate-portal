import { useMemo, useState } from "react";
import { fmtCompact, fmtCurrency, fmtPct } from "@/lib/format";
import { cn } from "@/utils/cn";
import { ArrowIcon, ChartIcon, SparkIcon } from "./Icons";

interface Inputs {
  price: number;
  sf: number;
  rent: number;
  occupancy: number;
  opex: number;
  growth: number;
  exitCap: number;
  hold: number;
  ltv: number;
  rate: number;
}

const presets: Record<string, Inputs> = {
  "Meridian Ridge Center": {
    price: 74500000,
    sf: 268000,
    rent: 42.5,
    occupancy: 82,
    opex: 17.9,
    growth: 3,
    exitCap: 6.4,
    hold: 7,
    ltv: 60,
    rate: 6.25,
  },
  "Hartwell Vantage Park": {
    price: 121500000,
    sf: 412000,
    rent: 38.75,
    occupancy: 85,
    opex: 15.85,
    growth: 2.8,
    exitCap: 6,
    hold: 10,
    ltv: 55,
    rate: 6.5,
  },
  "Summit Verde Commons": {
    price: 41500000,
    sf: 186000,
    rent: 29.5,
    occupancy: 90,
    opex: 10.6,
    growth: 3.5,
    exitCap: 7.1,
    hold: 5,
    ltv: 65,
    rate: 6.75,
  },
};

const EXPENSE_GROWTH = 0.025;
const AMORT_YEARS = 25;
const SELLING_COSTS = 0.015;
const CLOSING_COSTS = 0.02;

function annualDebtService(loan: number, annualRate: number) {
  const r = annualRate / 100 / 12;
  const n = AMORT_YEARS * 12;
  if (loan <= 0) return 0;
  if (r === 0) return loan / AMORT_YEARS;
  return ((loan * r) / (1 - Math.pow(1 + r, -n))) * 12;
}

function remainingBalance(loan: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const p = annualDebtService(loan, annualRate) / 12;
  if (r === 0) return Math.max(loan - p * years * 12, 0);
  const n = years * 12;
  return Math.max(loan * Math.pow(1 + r, n) - p * ((Math.pow(1 + r, n) - 1) / r), 0);
}

function npv(rate: number, flows: number[]) {
  return flows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i), 0);
}

function irr(flows: number[]) {
  let lo = -0.9;
  let hi = 1.5;
  if (npv(lo, flows) < 0 || npv(hi, flows) > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(mid, flows) > 0) lo = mid;
    else hi = mid;
  }
  return ((lo + hi) / 2) * 100;
}

function model(i: Inputs) {
  const egi = (i.rent * i.sf * i.occupancy) / 100;
  const opexTotal = i.opex * i.sf;
  const noi = egi - opexTotal;

  const loan = (i.price * i.ltv) / 100;
  const equity = i.price * (1 + CLOSING_COSTS) - loan;
  const debt = annualDebtService(loan, i.rate);
  const cashFlow = noi - debt;

  const years: { year: number; noi: number; cashFlow: number; cumulative: number }[] = [];
  let cumulative = 0;
  for (let y = 1; y <= i.hold; y++) {
    const g = Math.pow(1 + i.growth / 100, y - 1);
    const eg = Math.pow(1 + EXPENSE_GROWTH, y - 1);
    const yNoi = egi * g - opexTotal * eg;
    const yCf = yNoi - debt;
    cumulative += yCf;
    years.push({ year: y, noi: yNoi, cashFlow: yCf, cumulative });
  }

  const exitNoi = (egi * Math.pow(1 + i.growth / 100, i.hold) - opexTotal * Math.pow(1 + EXPENSE_GROWTH, i.hold));
  const exitValue = exitNoi / (i.exitCap / 100);
  const balance = remainingBalance(loan, i.rate, i.hold);
  const netProceeds = exitValue * (1 - SELLING_COSTS) - balance;

  const flows = [-equity, ...years.slice(0, -1).map((y) => y.cashFlow)];
  flows.push(years[years.length - 1].cashFlow + netProceeds);

  const irrValue = irr(flows);
  const totalProfit = years.reduce((a, y) => a + y.cashFlow, 0) + netProceeds - equity;
  const multiple = (totalProfit + equity) / equity;

  return {
    egi,
    noi,
    loan,
    equity,
    debt,
    cashFlow,
    capRate: (noi / i.price) * 100,
    coc: (cashFlow / equity) * 100,
    dscr: debt > 0 ? noi / debt : 0,
    years,
    exitValue,
    netProceeds,
    irrValue,
    totalProfit,
    multiple,
    breakevenOccupancy: ((opexTotal + debt) / (i.rent * i.sf)) * 100,
  };
}

interface FieldProps {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  id: string;
}

function Field({ label, hint, value, min, max, step, onChange, prefix, suffix, id }: FieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-white/60">
          {label}
        </label>
        {hint && <span className="text-[11px] text-white/35">{hint}</span>}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="range-gold w-full"
          style={{ ["--fill" as string]: `${((value - min) / (max - min)) * 100}%` }}
          aria-describedby={`${id}-value`}
        />
        <div
          id={`${id}-value`}
          className="flex min-w-[132px] shrink-0 items-center justify-end gap-0.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm font-semibold tabular-nums text-white"
        >
          {prefix && <span className="text-white/50">{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={`${label} value`}
            className="w-[86px] bg-transparent text-right font-semibold tabular-nums text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {suffix && <span className="pl-0.5 text-white/50">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}

export default function RoiCalculator() {
  const [inputs, setInputs] = useState<Inputs>(presets["Meridian Ridge Center"]);
  const [preset, setPreset] = useState("Meridian Ridge Center");
  const r = useMemo(() => model(inputs), [inputs]);

  const set = (key: keyof Inputs) => (v: number) => {
    setInputs((prev) => ({ ...prev, [key]: v }));
    setPreset("Custom model");
  };

  const chartW = 720;
  const chartH = 220;
  const pad = { l: 44, r: 16, t: 16, b: 30 };
  const innerW = chartW - pad.l - pad.r;
  const innerH = chartH - pad.t - pad.b;
  const maxNoi = Math.max(...r.years.map((y) => y.noi), 1);
  const barW = Math.min(46, (innerW / r.years.length) * 0.62);

  const metrics = [
    { label: "Year-1 NOI", value: fmtCurrency(r.noi), sub: `${fmtPct(r.capRate)} in-place cap` },
    {
      label: "Annual cash flow",
      value: fmtCurrency(r.cashFlow),
      sub: `${fmtPct(r.coc)} cash-on-cash`,
    },
    {
      label: "Debt service coverage",
      value: r.dscr ? `${r.dscr.toFixed(2)}x` : "n/a",
      sub: `${fmtPct(inputs.ltv, 0)} LTV @ ${fmtPct(inputs.rate, 2)}`,
    },
    {
      label: "Projected IRR",
      value: r.irrValue === null ? "—" : fmtPct(r.irrValue),
      sub: `${r.multiple.toFixed(2)}x equity multiple`,
    },
  ];

  return (
    <section id="roi" className="relative overflow-hidden bg-ink-950 py-16 text-white lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_15%_10%,rgba(31,119,237,0.35),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(229,166,60,0.25),transparent_45%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300 ring-1 ring-white/15">
              <ChartIcon className="h-3.5 w-3.5" />
              Investment analytics
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">ROI &amp; underwriting engine</h2>
            <p className="mt-3 text-base leading-relaxed text-white/65">
              Stress-test an office park acquisition in seconds. Adjust rent, leverage and exit
              assumptions to see NOI growth, coverage ratios and levered IRR update live.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <label htmlFor="preset" className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Load asset model
            </label>
            <select
              id="preset"
              value={preset}
              onChange={(e) => {
                const key = e.target.value as keyof typeof presets;
                setPreset(key);
                if (presets[key]) setInputs(presets[key]);
              }}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-medium text-white outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-400/15"
            >
              {Object.keys(presets).map((k) => (
                <option key={k} className="text-ink-900">
                  {k}
                </option>
              ))}
              <option value="Custom model" className="text-ink-900">
                Custom model
              </option>
            </select>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="price"
                label="Purchase price"
                value={inputs.price}
                min={10000000}
                max={250000000}
                step={500000}
                onChange={set("price")}
                prefix="$"
              />
              <Field
                id="sf"
                label="Rentable area"
                value={inputs.sf}
                min={50000}
                max={600000}
                step={1000}
                onChange={set("sf")}
                suffix="sf"
              />
              <Field
                id="rent"
                label="Avg. rent"
                hint="NNN, annual"
                value={inputs.rent}
                min={15}
                max={80}
                step={0.25}
                onChange={set("rent")}
                prefix="$"
                suffix="/sf"
              />
              <Field
                id="occupancy"
                label="Occupancy"
                value={inputs.occupancy}
                min={40}
                max={100}
                step={1}
                onChange={set("occupancy")}
                suffix="%"
              />
              <Field
                id="opex"
                label="Operating expenses"
                value={inputs.opex}
                min={4}
                max={30}
                step={0.25}
                onChange={set("opex")}
                prefix="$"
                suffix="/sf"
              />
              <Field
                id="growth"
                label="Rent growth"
                hint="annual"
                value={inputs.growth}
                min={0}
                max={8}
                step={0.1}
                onChange={set("growth")}
                suffix="%"
              />
              <Field
                id="ltv"
                label="Loan-to-value"
                value={inputs.ltv}
                min={0}
                max={80}
                step={1}
                onChange={set("ltv")}
                suffix="%"
              />
              <Field
                id="rate"
                label="Interest rate"
                hint={`${AMORT_YEARS}-yr am.`}
                value={inputs.rate}
                min={3}
                max={12}
                step={0.05}
                onChange={set("rate")}
                suffix="%"
              />
              <Field
                id="exitCap"
                label="Exit cap rate"
                value={inputs.exitCap}
                min={4}
                max={10}
                step={0.05}
                onChange={set("exitCap")}
                suffix="%"
              />
              <Field
                id="hold"
                label="Hold period"
                value={inputs.hold}
                min={1}
                max={15}
                step={1}
                onChange={set("hold")}
                suffix="yrs"
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink-900/60 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-400/15 text-gold-300">
                  <SparkIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/50">Breakeven occupancy</p>
                  <p className="font-display text-lg font-semibold text-white">
                    {fmtPct(r.breakevenOccupancy)}
                  </p>
                </div>
              </div>
              <p className="max-w-[190px] text-right text-[11px] leading-snug text-white/45">
                Debt service covered at {fmtCompact(Math.round((inputs.rent * inputs.sf * r.breakevenOccupancy) / 100))}{" "}
                sq ft leased.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <dl className="grid grid-cols-2 gap-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-4"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/55">
                    {m.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-white">{m.value}</dd>
                  <dd className="mt-0.5 text-xs font-medium text-gold-300">{m.sub}</dd>
                </div>
              ))}
            </dl>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-white">
                  Net operating income · {inputs.hold}-year hold
                </h3>
                <div className="flex items-center gap-4 text-[11px] font-medium text-white/60">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-brand-400" /> NOI
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 rounded bg-gold-300" /> Cumulative cash flow
                  </span>
                </div>
              </div>

              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="mt-4 w-full"
                role="img"
                aria-label={`Bar chart of projected net operating income over ${inputs.hold} years, starting at ${fmtCurrency(r.years[0].noi)} and reaching ${fmtCurrency(r.years[r.years.length - 1].noi)}`}
              >
                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                  <g key={t}>
                    <line
                      x1={pad.l}
                      x2={chartW - pad.r}
                      y1={pad.t + innerH * (1 - t)}
                      y2={pad.t + innerH * (1 - t)}
                      stroke="rgba(255,255,255,0.09)"
                      strokeWidth="1"
                    />
                    <text
                      x={pad.l - 8}
                      y={pad.t + innerH * (1 - t) + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="rgba(255,255,255,0.4)"
                      fontFamily="Manrope, system-ui, sans-serif"
                    >
                      ${fmtCompact(maxNoi * t)}
                    </text>
                  </g>
                ))}

                {r.years.map((y, idx) => {
                  const slot = innerW / r.years.length;
                  const cx = pad.l + slot * (idx + 0.5);
                  const h = (y.noi / maxNoi) * innerH;
                  return (
                    <g key={y.year}>
                      <rect
                        x={cx - barW / 2}
                        y={pad.t + innerH - h}
                        width={barW}
                        height={Math.max(h, 2)}
                        rx="5"
                        fill="url(#barGrad)"
                      >
                        <title>{`Year ${y.year}: NOI ${fmtCurrency(y.noi)}, cash flow ${fmtCurrency(y.cashFlow)}`}</title>
                      </rect>
                      <text
                        x={cx}
                        y={chartH - 10}
                        textAnchor="middle"
                        fontSize="10"
                        fill="rgba(255,255,255,0.45)"
                        fontFamily="Manrope, system-ui, sans-serif"
                      >
                        Y{y.year}
                      </text>
                    </g>
                  );
                })}

                <path
                  d={r.years
                    .map((y, idx) => {
                      const slot = innerW / r.years.length;
                      const cx = pad.l + slot * (idx + 0.5);
                      const maxCum = Math.max(...r.years.map((v) => v.cumulative), 1);
                      const cy = pad.t + innerH - (y.cumulative / maxCum) * innerH * 0.9;
                      return `${idx === 0 ? "M" : "L"}${cx} ${cy}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#eec067"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="5 4"
                />
                {r.years.map((y, idx) => {
                  const slot = innerW / r.years.length;
                  const cx = pad.l + slot * (idx + 0.5);
                  const maxCum = Math.max(...r.years.map((v) => v.cumulative), 1);
                  const cy = pad.t + innerH - (y.cumulative / maxCum) * innerH * 0.9;
                  return <circle key={y.year} cx={cx} cy={cy} r="3" fill="#eec067" />;
                })}

                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4b9cff" />
                    <stop offset="100%" stopColor="#1f77ed" />
                  </linearGradient>
                </defs>
              </svg>

              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:grid-cols-4">
                {[
                  { l: "Equity required", v: fmtCurrency(r.equity) },
                  { l: `Exit value (Y${inputs.hold})`, v: fmtCurrency(r.exitValue) },
                  { l: "Net sale proceeds", v: fmtCurrency(r.netProceeds) },
                  {
                    l: "Total profit",
                    v: fmtCurrency(r.totalProfit),
                    tone: r.totalProfit >= 0 ? "text-mint-400" : "text-rose-300",
                  },
                ].map((m) => (
                  <div key={m.l}>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-white/45">{m.l}</dt>
                    <dd className={cn("text-sm font-semibold text-white", m.tone)}>{m.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-gold-300/25 bg-gold-400/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/75">
                Want this model with your actual rent roll? Our analysts will load it into the portal.
              </p>
              <a
                href="#contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gold-400 px-5 py-3 text-sm font-bold text-ink-950 transition-colors hover:bg-gold-300"
              >
                Request underwriting
                <ArrowIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-white/40">
          Illustrative model only. Assumes {fmtPct(EXPENSE_GROWTH * 100, 1)} annual expense growth,{" "}
          {AMORT_YEARS}-year amortization, {fmtPct(CLOSING_COSTS * 100, 1)} closing costs and{" "}
          {fmtPct(SELLING_COSTS * 100, 1)} disposition costs. Not investment advice.
        </p>
      </div>
    </section>
  );
}
