import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { PlaceMap } from "@/components/PlaceMap";
import { categories, categoryLabel, directionsUrl, inCategory, places, type Category } from "@/lib/places";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CityPulse — Explore Pune's sights, food & heritage" },
      { name: "description", content: "Discover Pune attractions, heritage, local food, parks and budget spots on an interactive map." },
      { property: "og:title", content: "CityPulse — Explore Pune" },
      { property: "og:description", content: "Pune's attractions, heritage, food and parks on one interactive map." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Explore,
});

const catColor: Record<Category, string> = { attraction: "#e76f51", food: "#f4a261", hotel: "#457b9d", heritage: "#c9a227", park: "#2a9d8f", budget: "#6a994e" };
const emoji = (c: Category) => categories.find((x) => x.id === c)?.emoji;

function Explore() {
  const [active, setActive] = useState<Category | "all">("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return places.filter((p) =>
      (active === "all" || inCategory(p, active)) &&
      (!s || [p.name, p.locality, categoryLabel(p.category), ...(p.alsoIn ?? []).map(categoryLabel), ...p.tags].join(" ").toLowerCase().includes(s)));
  }, [active, q]);
  const onSelect = useCallback((id: string) => setSel(id), []);

  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-primary">Pune, Maharashtra</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-6xl">Pune, decoded.</h1>
        <p className="mt-3 text-muted-foreground">{places.length} hand-picked places — Peshwa-era wadas, misal joints, hill views and gardens — on a live street map.</p>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, area or category…" className="h-10 w-full rounded-full border border-input bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring md:w-72" />
        <button onClick={() => setActive("all")} className={`chip ${active === "all" ? "!bg-primary text-primary-foreground" : ""}`}>All</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActive(c.id)} className={`chip ${active === c.id ? "!bg-primary text-primary-foreground" : ""}`}>{c.emoji} {c.label}</button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="lg:sticky lg:top-4 lg:self-start">
          <PlaceMap places={list} selected={sel} onSelect={onSelect} colors={catColor} />
          <p className="mt-2 text-xs text-muted-foreground">Showing {list.length} of {places.length} places. Positions are approximate — use Directions to confirm.</p>
        </div>
        <div className="grid content-start gap-3 sm:grid-cols-2">
          {list.length === 0 && (
            <div className="panel col-span-full p-8 text-center">
              <p className="text-3xl">🔍</p>
              <p className="mt-2 font-bold">No places match</p>
              <p className="text-sm text-muted-foreground">Try another search or pick a different filter.</p>
              <button onClick={() => { setQ(""); setActive("all"); }} className="chip mt-3">Clear filters</button>
            </div>
          )}
          {list.map((p) => (
            <article key={p.id} onClick={() => setSel(p.id)} className={`panel cursor-pointer overflow-hidden transition hover:-translate-y-0.5 ${sel === p.id ? "ring-2 ring-primary" : ""}`}>
              {p.image ? (
                <img src={p.image} alt={p.name} loading="lazy" className="h-28 w-full object-cover" />
              ) : (
                <div className="flex h-28 items-center justify-center text-4xl" style={{ background: `${catColor[p.category]}33` }} aria-label="No photo available">{emoji(p.category)}</div>
              )}
              <div className="p-4">
                <span className="text-xs font-medium" style={{ color: catColor[p.category] }}>{categoryLabel(p.category)}</span>
                <h3 className="mt-0.5 font-bold leading-tight">{p.name}</h3>
                <p className="text-xs text-muted-foreground">📍 {p.locality}</p>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className={p.price ? "" : "text-muted-foreground italic"}>{p.price ?? "Price unavailable"}</span>
                  <a href={directionsUrl(p)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-medium text-primary hover:underline">Directions ↗</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
