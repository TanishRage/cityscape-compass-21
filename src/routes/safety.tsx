import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CityMap } from "@/components/CityMap";
import { hotspots, kindMeta, type ReportKind } from "@/lib/city-data";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety Map & Safer Routes — CityPulse" },
      { name: "description", content: "Unsafe areas, accident-prone zones, flooding and safer route suggestions." },
      { property: "og:title", content: "Safety Map — CityPulse" },
      { property: "og:description", content: "See reported hotspots and get a safer route across the city." },
    ],
  }),
  component: Safety,
});

const spots = {
  Colaba: [60, 90], Churchgate: [48, 76], Dadar: [46, 58], Bandra: [30, 46], Andheri: [34, 32], Kurla: [56, 44], Borivali: [48, 10],
} as Record<string, [number, number]>;

const routes: Record<string, { fast: [number, number][]; safe: [number, number][]; avoided: string[] }> = {
  "Andheri→Colaba": { fast: [[34,32],[46,36],[50,52],[48,59],[55,69],[60,90]], safe: [[34,32],[30,46],[40,58],[44,70],[48,76],[60,90]], avoided: ["Sion Circle flooding", "Hindmata waterlogging", "Grant Rd underpass"] },
};

function route(from: string, to: string) {
  const key = `${from}→${to}`;
  if (routes[key]) return routes[key];
  const a = spots[from], b = spots[to];
  const mid: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const near = hotspots.filter((h) => Math.hypot(h.x - mid[0], h.y - mid[1]) < 14);
  const offset: [number, number] = [mid[0] - 10, mid[1]];
  return { fast: [a, mid, b], safe: near.length ? [a, offset, b] : [a, mid, b], avoided: near.map((h) => `${h.area} (${kindMeta[h.kind].label})`) };
}

function Safety() {
  const [filter, setFilter] = useState<ReportKind | "all">("all");
  const [from, setFrom] = useState("Andheri");
  const [to, setTo] = useState("Colaba");
  const [sel, setSel] = useState<string | null>(null);
  const r = route(from, to);
  const shown = hotspots.filter((h) => filter === "all" || h.kind === filter);
  const s = hotspots.find((h) => h.id === sel);

  return (
    <div className="space-y-6">
      <header><h1 className="text-4xl font-extrabold">Safety & Safer Routes</h1><p className="mt-2 text-muted-foreground">Hotspots aggregated from citizen reports, police data and traffic feeds.</p></header>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter("all")} className={`chip ${filter === "all" ? "!bg-primary text-primary-foreground" : ""}`}>All</button>
            {(Object.keys(kindMeta) as ReportKind[]).map((k) => (
              <button key={k} onClick={() => setFilter(k)} className={`chip ${filter === k ? "!bg-primary text-primary-foreground" : ""}`}><span className="h-2 w-2 rounded-full" style={{ background: kindMeta[k].color }} />{kindMeta[k].label}</button>
            ))}
          </div>
          <CityMap selected={sel} onSelect={setSel}
            pins={shown.map((h) => ({ id: h.id, x: h.x, y: h.y, color: kindMeta[h.kind].color, size: 8 + h.severity * 5, pulse: h.severity === 3, label: h.area }))}
            route={[{ points: r.fast, color: "var(--destructive)", dashed: true }, { points: r.safe, color: "var(--success)" }]} />
        </div>
        <div className="space-y-4">
          <div className="panel p-5">
            <h2 className="text-xl font-bold">Plan a safer route</h2>
            <div className="mt-3 flex gap-2">
              {[{ v: from, s: setFrom }, { v: to, s: setTo }].map((f, i) => (
                <select key={i} value={f.v} onChange={(e) => f.s(e.target.value)} className="flex-1 rounded-md border border-input bg-secondary px-3 py-2 text-sm">
                  {Object.keys(spots).map((k) => <option key={k}>{k}</option>)}
                </select>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border p-3"><p className="text-destructive">- - Fastest</p><p className="text-muted-foreground">Passes {r.avoided.length} hotspot(s)</p></div>
              <div className="rounded-lg border border-success/40 bg-success/10 p-3"><p className="text-success">━ Safer</p><p className="text-muted-foreground">+~8 min, avoids all</p></div>
            </div>
            {r.avoided.length > 0 && <ul className="mt-3 space-y-1 text-sm">{r.avoided.map((a) => <li key={a}>⚠️ Avoids {a}</li>)}</ul>}
          </div>
          {s && <div className="panel p-4"><p className="text-xs" style={{ color: kindMeta[s.kind].color }}>{kindMeta[s.kind].label} · severity {s.severity}/3</p><h3 className="font-bold">{s.area}</h3><p className="text-sm text-muted-foreground">{s.note}</p><p className="mt-1 text-xs">{s.reports} citizen reports</p></div>}
          <div className="panel divide-y divide-border">
            {[...shown].sort((a, b) => b.reports - a.reports).map((h) => (
              <button key={h.id} onClick={() => setSel(h.id)} className="flex w-full items-center gap-3 p-3 text-left hover:bg-secondary">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: kindMeta[h.kind].color }} />
                <div className="flex-1"><p className="text-sm font-medium">{h.area}</p><p className="text-xs text-muted-foreground">{h.note}</p></div>
                <span className="text-xs text-muted-foreground">{h.reports}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
