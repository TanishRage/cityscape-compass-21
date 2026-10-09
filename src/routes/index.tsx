import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CityMap } from "@/components/CityMap";
import { categories, places, type Category } from "@/lib/city-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CityPulse — Explore Mumbai's food, sights & stays" },
      { name: "description", content: "Discover attractions, local food, hotels and budget spots on an interactive city map." },
      { property: "og:title", content: "CityPulse — Explore Mumbai" },
      { property: "og:description", content: "Attractions, food, hotels and budget spots on one smart map." },
    ],
  }),
  component: Explore,
});

const catColor: Record<Category, string> = { attraction: "var(--accent)", food: "var(--primary)", hotel: "var(--info)", heritage: "var(--warning)", budget: "var(--success)" };

function Explore() {
  const [active, setActive] = useState<Category | "all">("all");
  const [maxPrice, setMaxPrice] = useState(3);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);

  const list = useMemo(() => places.filter((p) =>
    (active === "all" || p.category === active) && p.price <= maxPrice &&
    (p.name + p.area + p.tags.join(" ")).toLowerCase().includes(q.toLowerCase())
  ).sort((a, b) => b.rating - a.rating), [active, maxPrice, q]);
  const selected = places.find((p) => p.id === sel);

  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-primary">Turn urban chaos into a better day</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-6xl">The city, decoded.</h1>
        <p className="mt-3 text-muted-foreground">Hidden food spots, landmarks, safe routes and live alerts — verified from citizen reports, traffic feeds and weather data.</p>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search places, areas, tags…" className="h-10 w-full rounded-full border border-input bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring md:w-72" />
        <button onClick={() => setActive("all")} className={`chip ${active === "all" ? "!bg-primary text-primary-foreground" : ""}`}>All</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActive(c.id)} className={`chip ${active === c.id ? "!bg-primary text-primary-foreground" : ""}`}>{c.emoji} {c.label}</button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">Budget
          <select value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="rounded-md border border-input bg-card px-2 py-1 text-foreground">
            <option value={1}>₹</option><option value={2}>₹₹</option><option value={3}>₹₹₹</option>
          </select>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          <CityMap selected={sel} onSelect={setSel} pins={list.map((p) => ({ id: p.id, x: p.x, y: p.y, color: catColor[p.category], label: p.name }))} />
          {selected && (
            <div className="panel p-4">
              <div className="flex items-start justify-between"><h3 className="text-lg font-bold">{selected.name}</h3><span className="text-primary">★ {selected.rating}</span></div>
              <p className="text-xs text-muted-foreground">{selected.area} · {"₹".repeat(selected.price)}</p>
              <p className="mt-2 text-sm">{selected.blurb}</p>
            </div>
          )}
        </div>
        <div className="grid content-start gap-3 sm:grid-cols-2">
          {list.length === 0 && <p className="text-muted-foreground">No places match — try widening your filters.</p>}
          {list.map((p) => (
            <button key={p.id} onClick={() => setSel(p.id)} className={`panel p-4 text-left transition hover:-translate-y-0.5 ${sel === p.id ? "ring-2 ring-primary" : ""}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium" style={{ color: catColor[p.category] }}>{categories.find((c) => c.id === p.category)?.label}</span>
                <span>★ {p.rating} · {"₹".repeat(p.price)}</span>
              </div>
              <h3 className="mt-1 font-bold">{p.name}</h3>
              <p className="text-xs text-muted-foreground">{p.area}</p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.blurb}</p>
              <div className="mt-2 flex flex-wrap gap-1">{p.tags.map((t) => <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{t}</span>)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
