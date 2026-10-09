import { createFileRoute } from "@tanstack/react-router";
import { places } from "@/lib/city-data";

export const Route = createFileRoute("/heritage")({
  head: () => ({
    meta: [
      { title: "History & Culture — CityPulse Mumbai" },
      { name: "description", content: "Heritage sites, landmarks and living traditions of Mumbai." },
      { property: "og:title", content: "History & Culture — CityPulse" },
      { property: "og:description", content: "Explore Mumbai's landmarks, UNESCO sites and local traditions." },
    ],
  }),
  component: Heritage,
});

const timeline = [
  { y: "250 BCE", t: "Kanheri Caves carved by Buddhist monks" },
  { y: "1534", t: "Portuguese take the seven islands" },
  { y: "1661", t: "Islands gifted to Britain as dowry" },
  { y: "1887", t: "Victoria Terminus (CST) completed" },
  { y: "1924", t: "Gateway of India opened" },
  { y: "1995", t: "City renamed Mumbai" },
];

const traditions = [
  { n: "Ganesh Chaturthi", d: "10-day festival with massive idols and sea immersions (Aug–Sep).", e: "🪔" },
  { n: "Dabbawalas", d: "130-year-old lunchbox network delivering 200,000 meals a day.", e: "🍱" },
  { n: "Irani cafés", d: "Bun maska and chai in bentwood-chair cafés from the 1900s.", e: "☕" },
  { n: "Koli fishing culture", d: "The city's original inhabitants, still fishing from Worli & Versova.", e: "🎣" },
];

function Heritage() {
  const sites = places.filter((p) => p.category === "heritage");
  return (
    <div className="space-y-10">
      <header><h1 className="text-4xl font-extrabold">History & Culture</h1><p className="mt-2 text-muted-foreground">Two millennia on seven islands.</p></header>
      <section className="grid gap-4 md:grid-cols-3">
        {sites.map((s) => (
          <article key={s.id} className="panel p-5">
            <p className="text-xs text-warning">{s.area}</p>
            <h3 className="mt-1 text-xl font-bold">{s.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
            <div className="mt-3 flex gap-1">{s.tags.map((t) => <span key={t} className="chip !py-0.5 !text-[10px]">{t}</span>)}</div>
          </article>
        ))}
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-bold">Timeline</h2>
        <ol className="relative border-l border-border pl-6">
          {timeline.map((i) => (
            <li key={i.y} className="mb-5"><span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
              <p className="font-display font-bold text-primary">{i.y}</p><p className="text-sm">{i.t}</p></li>
          ))}
        </ol>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-bold">Local traditions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {traditions.map((t) => (<div key={t.n} className="panel p-5"><div className="text-3xl">{t.e}</div><h3 className="mt-2 font-bold">{t.n}</h3><p className="text-sm text-muted-foreground">{t.d}</p></div>))}
        </div>
      </section>
    </div>
  );
}
