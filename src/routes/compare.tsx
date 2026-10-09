import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Score } from "@/components/CityMap";
import { overallScore, places } from "@/lib/city-data";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Best vs Worst Places — CityPulse" },
      { name: "description", content: "Compare places on safety, cleanliness, affordability, ratings and accessibility." },
      { property: "og:title", content: "Best vs Worst Places — CityPulse" },
      { property: "og:description", content: "Side-by-side scores for safety, cleanliness, price and access." },
    ],
  }),
  component: Compare,
});

const metrics = ["safety", "cleanliness", "accessibility", "affordability", "rating"] as const;
type M = (typeof metrics)[number];
const val = (p: (typeof places)[number], m: M) => m === "affordability" ? +((4 - p.price) * 3.33).toFixed(1) : m === "rating" ? +(p.rating * 2).toFixed(1) : p[m];

function Compare() {
  const [weights, setWeights] = useState<Record<M, number>>({ safety: 3, cleanliness: 2, accessibility: 2, affordability: 2, rating: 2 });
  const [picked, setPicked] = useState<string[]>(["marine", "mohammed"]);
  const total = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const score = (p: (typeof places)[number]) => +(metrics.reduce((s, m) => s + val(p, m) * weights[m], 0) / total).toFixed(1);
  const ranked = [...places].sort((a, b) => score(b) - score(a));
  const toggle = (id: string) => setPicked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p.slice(-2), id]);

  return (
    <div className="space-y-8">
      <header><h1 className="text-4xl font-extrabold">Best vs Worst</h1><p className="mt-2 text-muted-foreground">Tune what matters to you — the ranking updates instantly.</p></header>
      <div className="panel grid gap-4 p-5 sm:grid-cols-5">
        {metrics.map((m) => (
          <label key={m} className="text-sm capitalize">{m} <span className="text-primary">×{weights[m]}</span>
            <input type="range" min={0} max={5} value={weights[m]} onChange={(e) => setWeights({ ...weights, [m]: +e.target.value })} className="mt-1 w-full accent-[var(--primary)]" />
          </label>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[{ t: "🏆 Best picks", l: ranked.slice(0, 4), c: "text-success" }, { t: "⚠️ Approach with care", l: ranked.slice(-4).reverse(), c: "text-destructive" }].map((g) => (
          <div key={g.t} className="panel p-5">
            <h2 className={`text-xl font-bold ${g.c}`}>{g.t}</h2>
            <ul className="mt-3 space-y-2">{g.l.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm"><span>{p.name} <span className="text-muted-foreground">· {p.area}</span></span><b className="font-display">{score(p)}</b></li>
            ))}</ul>
          </div>
        ))}
      </div>
      <section>
        <h2 className="mb-3 text-2xl font-bold">Head-to-head <span className="text-sm font-normal text-muted-foreground">(pick up to 3)</span></h2>
        <div className="mb-4 flex flex-wrap gap-2">{places.map((p) => (
          <button key={p.id} onClick={() => toggle(p.id)} className={`chip ${picked.includes(p.id) ? "!bg-primary text-primary-foreground" : ""}`}>{p.name}</button>
        ))}</div>
        <div className="grid gap-4 md:grid-cols-3">
          {picked.map((id) => { const p = places.find((x) => x.id === id)!; return (
            <div key={id} className="panel space-y-2 p-5">
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-xs text-muted-foreground">Overall {overallScore(p)} · Your score <b className="text-primary">{score(p)}</b></p>
              {metrics.map((m) => (<div key={m}><p className="text-xs capitalize text-muted-foreground">{m}</p><Score v={val(p, m)} /></div>))}
            </div>
          ); })}
        </div>
      </section>
    </div>
  );
}
