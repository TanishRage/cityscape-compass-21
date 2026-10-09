import type { ReactNode } from "react";

export interface MapPin { id: string; x: number; y: number; color: string; size?: number; label?: string; pulse?: boolean; }

export function CityMap({ pins, selected, onSelect, route, children }: {
  pins: MapPin[]; selected?: string | null; onSelect?: (id: string) => void;
  route?: { points: [number, number][]; color: string; dashed?: boolean }[]; children?: ReactNode;
}) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border" style={{ background: "var(--map-water)" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M30 0 L72 0 L74 20 L70 40 L66 60 L68 75 L66 95 L56 96 L52 84 L44 76 L40 64 L30 54 L22 40 L20 25 Z" fill="var(--map-land)" />
        <path d="M84 76 q6 -3 8 3 q-2 6 -8 4 z" fill="var(--map-land)" />
        {[[50,2,52,90],[30,20,64,20],[25,40,70,42],[35,60,66,62],[40,10,34,50],[60,15,62,80]].map((l, i) => (
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="var(--map-road)" strokeWidth="0.6" />
        ))}
        {route?.map((r, i) => (
          <polyline key={i} points={r.points.map((p) => p.join(",")).join(" ")} fill="none" stroke={r.color} strokeWidth="1.1" strokeDasharray={r.dashed ? "2 1.5" : undefined} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
      {pins.map((p) => (
        <button key={p.id} onClick={() => onSelect?.(p.id)} title={p.label}
          className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          {p.pulse && <span className="absolute inset-0 animate-ping rounded-full opacity-50" style={{ background: p.color }} />}
          <span className="relative block rounded-full border-2 border-background transition-transform group-hover:scale-125"
            style={{ background: p.color, width: p.size ?? 14, height: p.size ?? 14, transform: selected === p.id ? "scale(1.6)" : undefined }} />
          {p.label && <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-1.5 py-0.5 text-[10px] opacity-0 group-hover:opacity-100">{p.label}</span>}
        </button>
      ))}
      {children}
      <div className="absolute bottom-2 left-2 rounded bg-background/70 px-2 py-1 text-[10px] text-muted-foreground">Arabian Sea ← · → Thane Creek</div>
    </div>
  );
}

export function Score({ v, max = 10 }: { v: number; max?: number }) {
  const pct = (v / max) * 100;
  const color = pct >= 70 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--destructive)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} /></div>
      <span className="w-8 text-right text-xs tabular-nums">{v}</span>
    </div>
  );
}
