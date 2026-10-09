import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { categoryLabel, directionsUrl, places } from "@/lib/places";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Pune Places — CityPulse" },
      { name: "description", content: "Compare Pune places side by side: category, area, entry price and directions." },
      { property: "og:title", content: "Compare Pune Places — CityPulse" },
      { property: "og:description", content: "Side-by-side view of Pune places using only verified details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Compare,
});

function Compare() {
  const [picked, setPicked] = useState<string[]>(["shaniwar-wada", "aga-khan-palace"]);
  const toggle = (id: string) => setPicked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p.slice(-2), id]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold">Compare places</h1>
        <p className="mt-2 text-muted-foreground">Pick up to 3. Safety, cleanliness and rating scores are not shown until verified data is available.</p>
      </header>
      <div className="flex flex-wrap gap-2">{places.map((p) => (
        <button key={p.id} onClick={() => toggle(p.id)} className={`chip ${picked.includes(p.id) ? "!bg-primary text-primary-foreground" : ""}`}>{p.name}</button>
      ))}</div>
      <div className="grid gap-4 md:grid-cols-3">
        {picked.map((id) => { const p = places.find((x) => x.id === id)!; return (
          <div key={id} className="panel space-y-2 p-5 text-sm">
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p><span className="text-muted-foreground">Category:</span> {categoryLabel(p.category)}</p>
            <p><span className="text-muted-foreground">Area:</span> {p.locality}</p>
            <p><span className="text-muted-foreground">Price:</span> {p.price ?? <i className="text-muted-foreground">unavailable</i>}</p>
            <p className="text-muted-foreground">{p.description}</p>
            <a href={directionsUrl(p)} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Directions ↗</a>
          </div>
        ); })}
      </div>
    </div>
  );
}
