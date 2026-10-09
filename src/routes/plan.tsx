import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useMemo, useState } from "react";
import { PlaceMap } from "@/components/PlaceMap";
import { planItinerary } from "@/lib/itinerary.functions";
import { TRAVEL_ASSUMPTION, validateInput, type PlanResult } from "@/lib/itinerary";
import { categories, categoryLabel, directionsUrl, type Category } from "@/lib/places";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "AI Day Planner for Pune — CityPulse" },
      { name: "description", content: "Get a practical Pune itinerary for your budget, time and interests, checked for cost and duration." },
      { property: "og:title", content: "AI Day Planner for Pune — CityPulse" },
      { property: "og:description", content: "AI-picked Pune stops, validated for time and budget, on a live map." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Plan,
});

const catColor: Record<Category, string> = { attraction: "#e76f51", food: "#f4a261", hotel: "#457b9d", heritage: "#c9a227", park: "#2a9d8f", budget: "#6a994e" };
const fmt = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
const clock = (start: string, off: number) => { const [h = 9, m = 0] = start.split(":").map(Number); const t = h * 60 + m + off; return `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };

function Plan() {
  const run = useServerFn(planItinerary);
  const [budget, setBudget] = useState(1000);
  const [hours, setHours] = useState(6);
  const [start, setStart] = useState("09:00");
  const [interests, setInterests] = useState<Category[]>(["heritage", "food"]);
  const [res, setRes] = useState<PlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const onSelect = useCallback((id: string) => setSel(id), []);
  const shown = useMemo(() => (res?.ok ? res.stops.map((s) => s.place) : []), [res]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bad = validateInput({ budget, hours, interests });
    if (bad) return setRes({ ok: false, kind: "input", message: bad });
    setLoading(true); setRes(null); setSel(null);
    try { setRes(await run({ data: { budget, hours, interests } })); }
    catch { setRes({ ok: false, kind: "api", message: "Something went wrong reaching the planner. Please try again." }); }
    finally { setLoading(false); }
  };
  const toggle = (c: Category) => setInterests((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]));

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-primary">AI day planner</p>
        <h1 className="mt-2 text-4xl font-extrabold">Plan your Pune day</h1>
        <p className="mt-2 text-muted-foreground">AI picks stops from our Pune list; the app then checks the timing and budget itself.</p>
      </header>

      <form onSubmit={submit} className="panel grid gap-4 p-5 md:grid-cols-4">
        <label className="text-sm">Budget (₹)
          <input type="number" min={0} max={100000} value={budget} onChange={(e) => setBudget(+e.target.value)} className="mt-1 h-10 w-full rounded-md border border-input bg-card px-3" />
        </label>
        <label className="text-sm">Available time (hours)
          <input type="number" min={1} max={14} step={0.5} value={hours} onChange={(e) => setHours(+e.target.value)} className="mt-1 h-10 w-full rounded-md border border-input bg-card px-3" />
        </label>
        <label className="text-sm">Start time
          <input type="time" value={start} onChange={(e) => setStart(e.target.value || "09:00")} className="mt-1 h-10 w-full rounded-md border border-input bg-card px-3" />
        </label>
        <button disabled={loading} className="h-10 self-end rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-60">{loading ? "Planning…" : "Plan my day"}</button>
        <div className="flex flex-wrap gap-2 md:col-span-4">
          <span className="self-center text-sm text-muted-foreground">Interests:</span>
          {categories.map((c) => (
            <button type="button" key={c.id} onClick={() => toggle(c.id)} className={`chip ${interests.includes(c.id) ? "!bg-primary text-primary-foreground" : ""}`}>{c.emoji} {c.label}</button>
          ))}
        </div>
      </form>

      {res && !res.ok && (
        <div role="alert" className="panel border-destructive/50 p-4 text-sm">
          <b className="text-destructive">{{ input: "Check your input", config: "Setup problem", api: "AI error", infeasible: "Plan not feasible" }[res.kind]}:</b> {res.message}
        </div>
      )}

      {res?.ok && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <PlaceMap places={shown} selected={sel} onSelect={onSelect} colors={catColor} />
          </div>
          <div className="space-y-3">
            <div className="panel p-4 text-sm">
              <p>{res.summary}</p>
              <p className="mt-2"><b>{res.stops.length} stops</b> · total ≈ <b>{fmt(res.totalMinutes)}</b> of {hours}h · verified cost <b>₹{res.verifiedCost}</b>
                {res.unknownCostCount > 0 && <> · <span className="text-warning">{res.unknownCostCount} stop(s) with price unavailable — check before you go</span></>}</p>
              <p className="mt-1 text-xs text-muted-foreground">Places chosen by AI · times and costs checked by the app. {TRAVEL_ASSUMPTION} Opening hours not verified.</p>
            </div>
            {res.stops.map((s, i) => (
              <article key={s.place.id} onClick={() => setSel(s.place.id)} className={`panel cursor-pointer p-4 ${sel === s.place.id ? "ring-2 ring-primary" : ""}`}>
                {s.travelMinutes > 0 && <p className="mb-2 text-xs text-muted-foreground">↓ ~{s.travelMinutes} min travel (estimate)</p>}
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-bold">{i + 1}. {s.place.name}</h3>
                  <span className="font-display text-sm text-primary">{clock(start, s.startOffset)}–{clock(start, s.startOffset + s.visitMinutes)}</span>
                </div>
                <p className="text-xs" style={{ color: catColor[s.place.category] }}>{categoryLabel(s.place.category)} · <span className="text-muted-foreground">📍 {s.place.locality}</span></p>
                <p className="mt-1 text-sm text-muted-foreground">{s.reason}</p>
                <div className="mt-2 flex justify-between text-xs">
                  <span className={s.place.price ? "" : "italic text-muted-foreground"}>{s.place.price ?? "Price unavailable"}</span>
                  <a href={directionsUrl(s.place)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-medium text-primary hover:underline">Directions ↗</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
