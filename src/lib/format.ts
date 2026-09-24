export const fmtCurrency = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);

export const fmtCompact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const fmtNumber = (value: number) => new Intl.NumberFormat("en-US").format(Math.round(value));

export const fmtPct = (value: number, digits = 1) => `${value.toFixed(digits)}%`;

export const statusStyles: Record<string, string> = {
  "For Lease": "bg-brand-50 text-brand-700 ring-brand-200",
  "Investment Sale": "bg-gold-50 text-gold-700 ring-gold-200",
  "Fully Leased": "bg-emerald-50 text-emerald-700 ring-emerald-200",
};
