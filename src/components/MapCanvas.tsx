import { useId } from "react";
import type { Property } from "@/data/properties";
import { cn } from "@/utils/cn";
import { fmtCompact } from "@/lib/format";

interface MapCanvasProps {
  properties: Property[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

/** Roads are drawn in a 1000x700 viewBox coordinate space. */
const roads = [
  "M0 120 H1000",
  "M0 300 H1000",
  "M0 470 H1000",
  "M0 640 H1000",
  "M150 0 V700",
  "M380 0 V700",
  "M620 0 V700",
  "M860 0 V700",
];

const blocks = [
  { x: 30, y: 40, w: 100, h: 60 },
  { x: 170, y: 40, w: 180, h: 60 },
  { x: 400, y: 40, w: 190, h: 60 },
  { x: 650, y: 40, w: 180, h: 60 },
  { x: 30, y: 150, w: 100, h: 120 },
  { x: 400, y: 150, w: 190, h: 120 },
  { x: 650, y: 150, w: 180, h: 120 },
  { x: 30, y: 330, w: 320, h: 110 },
  { x: 400, y: 330, w: 190, h: 110 },
  { x: 650, y: 330, w: 180, h: 110 },
  { x: 30, y: 500, w: 320, h: 110 },
  { x: 400, y: 500, w: 190, h: 110 },
  { x: 650, y: 500, w: 180, h: 110 },
];

export default function MapCanvas({ properties, activeId, onSelect }: MapCanvasProps) {
  const uid = useId().replace(/[:]/g, "");

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#eaeff6]">
      <svg
        viewBox="0 0 1000 700"
        className="h-full w-full"
        role="img"
        aria-label={`Interactive map placeholder showing ${properties.length} office park assets. Detailed basemap tiles load once you sign in.`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bcd7f2" />
            <stop offset="100%" stopColor="#9fc4ea" />
          </linearGradient>
          <pattern id={`${uid}-grid`} width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M50 0H0V50" fill="none" stroke="#dbe4ef" strokeWidth="1" />
          </pattern>
          <filter id={`${uid}-shadow`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0c1826" floodOpacity="0.25" />
          </filter>
        </defs>

        <rect width="1000" height="700" fill="#f2f6fa" />
        <rect width="1000" height="700" fill={`url(#${uid}-grid)`} />

        {/* green belts */}
        <path d="M170 150 h180 v120 h-180 z" fill="#d9eadb" />
        <path d="M870 330 h120 v290 h-120 z" fill="#d9eadb" />
        <circle cx="200" cy="210" r="26" fill="#c9e3cd" />
        <circle cx="300" cy="185" r="18" fill="#c9e3cd" />

        {/* river */}
        <path
          d="M-20 420 C 180 380, 300 500, 520 470 S 820 540, 1020 500"
          stroke={`url(#${uid}-water)`}
          strokeWidth="46"
          fill="none"
          strokeLinecap="round"
        />

        {/* highway */}
        <path d="M-20 250 C 260 210, 520 330, 1020 230" stroke="#f8d9a0" strokeWidth="22" fill="none" />
        <path d="M-20 250 C 260 210, 520 330, 1020 230" stroke="#ffffff" strokeWidth="3" strokeDasharray="14 16" fill="none" />

        {/* building blocks */}
        {blocks.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="6" fill="#dde5f0" stroke="#cfdae8" strokeWidth="1.5" />
        ))}

        {/* street grid */}
        {roads.map((d, i) => (
          <path key={i} d={d} stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
        ))}
        {roads.map((d, i) => (
          <path key={i} d={d} stroke="#e6edf6" strokeWidth="2" strokeDasharray="6 10" />
        ))}

        {/* markers */}
        {properties.map((p) => {
          const cx = (p.x / 100) * 1000;
          const cy = (p.y / 100) * 700;
          const active = p.id === activeId;
          return (
            <g
              key={p.id}
              transform={`translate(${cx} ${cy})`}
              className="cursor-pointer"
              onClick={() => onSelect(p.id)}
              role="button"
              tabIndex={0}
              aria-label={`${p.name}, ${p.availableSf.toLocaleString()} square feet available`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(p.id);
                }
              }}
            >
              {active && (
                <circle cy="-4" r="22" fill="#1f77ed" opacity="0.18" className="animate-pulse-ring" />
              )}
              <g filter={`url(#${uid}-shadow)`}>
                <rect
                  x="-54"
                  y="-72"
                  width="108"
                  height="36"
                  rx="18"
                  fill={active ? "#0c1826" : "#ffffff"}
                />
                <text
                  x="0"
                  y="-48"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="700"
                  fill={active ? "#ffffff" : "#0c1826"}
                  fontFamily="Manrope, system-ui, sans-serif"
                >
                  {p.availableSf > 0 ? `${fmtCompact(p.availableSf)} sf` : "Leased"}
                </text>
              </g>
              <g filter={`url(#${uid}-shadow)`}>
                <path
                  d="M0 0 C -3 -9, -12 -13, -12 -23 A 12 12 0 1 1 12 -23 C 12 -13, 3 -9, 0 0 Z"
                  fill={active ? "#0d5cd1" : "#152438"}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
              </g>
              <circle cx="0" cy="-23" r="5" fill="#e5a63c" />
            </g>
          );
        })}
      </svg>

      {/* map chrome */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-ink-900/10" />

      <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-600 shadow-sm ring-1 ring-ink-900/5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
          </span>
          Live inventory · {properties.length} assets
        </span>
      </div>

      <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm">
        {["+", "−"].map((s) => (
          <button
            key={s}
            type="button"
            aria-label={s === "+" ? "Zoom in" : "Zoom out"}
            className="grid h-9 w-9 place-items-center text-lg font-semibold text-ink-600 transition-colors hover:bg-ink-50 first:border-b first:border-ink-200"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="absolute bottom-3 left-3 rounded-xl border border-ink-200 bg-white/95 px-3 py-2 text-[11px] font-medium text-ink-500 shadow-sm">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-ink-900" />
          Available suite
          <span className="mx-1 text-ink-300">|</span>
          <span className="h-2.5 w-2.5 rounded-full bg-gold-400" />
          Anchor tenant
        </span>
      </div>

      <div
        className={cn(
          "absolute bottom-3 right-3 rounded-xl border border-dashed border-brand-300 bg-white/90 px-3 py-2 text-[11px] font-medium text-brand-700 shadow-sm"
        )}
      >
        Basemap tiles · Mapbox GL placeholder
      </div>
    </div>
  );
}
