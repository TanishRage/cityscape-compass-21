import { createFileRoute } from "@tanstack/react-router";
import { directionsUrl, inCategory, places } from "@/lib/places";

export const Route = createFileRoute("/heritage")({
  head: () => ({
    meta: [
      { title: "Pune History & Culture — CityPulse" },
      { name: "description", content: "Peshwa-era wadas, forts, temples and living traditions of Pune." },
      { property: "og:title", content: "Pune History & Culture — CityPulse" },
      { property: "og:description", content: "Explore Pune's heritage sites, history timeline and local traditions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Heritage,
});

const timeline = [
  { y: "8th c.", t: "Pataleshwar rock-cut temple carved" },
  { y: "1630s", t: "Young Shivaji and Jijabai live at Lal Mahal" },
  { y: "1670", t: "Tanaji Malusare captures Sinhagad (Kondhana)" },
  { y: "1732", t: "Shaniwar Wada completed for Peshwa Bajirao I" },
  { y: "1818", t: "Battle of Koregaon; Peshwa rule ends, British take Pune" },
  { y: "1892", t: "Aga Khan Palace built" },
  { y: "1893", t: "Lokmanya Tilak popularises public Ganeshotsav" },
];

const traditions = [
  { n: "Ganeshotsav", d: "Public Ganesh festival with the five 'manache' Ganpatis led by Kasba Ganpati.", e: "🪔" },
  { n: "Palkhi procession", d: "Warkaris pass through Pune each year on the pilgrimage to Pandharpur.", e: "🚩" },
  { n: "Sawai Gandharva festival", d: "Long-running Hindustani classical music festival held in Pune.", e: "🎶" },
  { n: "Misal & bakarwadi", d: "Spicy misal pav and Chitale's bakarwadi are the city's signature bites.", e: "🌶️" },
];

function Heritage() {
  const sites = places.filter((p) => inCategory(p, "heritage"));
  return (
    <div className="space-y-10">
      <header><h1 className="text-4xl font-extrabold">History & Culture</h1><p className="mt-2 text-muted-foreground">From rock-cut temples to the Peshwa capital.</p></header>
      <section className="grid gap-4 md:grid-cols-3">
        {sites.map((s) => (
          <article key={s.id} className="panel p-5">
            <p className="text-xs text-warning">{s.locality}</p>
            <h3 className="mt-1 text-xl font-bold">{s.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
            <a href={directionsUrl(s)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-medium text-primary hover:underline">Directions ↗</a>
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
