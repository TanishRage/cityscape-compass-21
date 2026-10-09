import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { feed as seed, trafficByHour, type FeedItem, type Source } from "@/lib/city-data";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Live City Insights — CityPulse" },
      { name: "description", content: "Traffic, weather alerts, citizen reports, photos, voice notes and social posts in one verified feed." },
      { property: "og:title", content: "Live City Insights — CityPulse" },
      { property: "og:description", content: "Verified, real-time city signals turned into action." },
    ],
  }),
  component: Insights,
});

const icon: Record<Source, string> = { "Citizen report": "📝", "Voice note": "🎙️", Photo: "📷", "Social media": "💬", "Traffic feed": "🚦", "Weather alert": "🌧️" };
const sentColor = { positive: "var(--success)", neutral: "var(--muted-foreground)", negative: "var(--destructive)" };

// Lightweight keyword NLP: sentiment + topic tagging
function analyze(text: string): Pick<FeedItem, "sentiment" | "topic"> {
  const t = text.toLowerCase();
  const neg = ["flood", "water", "accident", "jam", "slow", "unsafe", "theft", "late", "blocked", "fire", "dark"].filter((w) => t.includes(w)).length;
  const pos = ["great", "safe", "clean", "beautiful", "love", "open", "new", "amazing"].filter((w) => t.includes(w)).length;
  const topics: [string, string[]][] = [["Flooding", ["flood", "water", "rain"]], ["Traffic", ["traffic", "jam", "slow", "road"]], ["Safety", ["unsafe", "theft", "dark", "light"]], ["Food", ["food", "eat", "stall", "cafe"]]];
  return { sentiment: neg > pos ? "negative" : pos > neg ? "positive" : "neutral", topic: topics.find(([, ws]) => ws.some((w) => t.includes(w)))?.[0] ?? "General" };
}

function Insights() {
  const [items, setItems] = useState(seed);
  const [text, setText] = useState("");
  const [area, setArea] = useState("");
  const [src, setSrc] = useState<Source>("Citizen report");
  const neg = items.filter((i) => i.sentiment === "negative").length;
  const mood = Math.round(100 - (neg / items.length) * 100);
  const topics = Object.entries(items.reduce<Record<string, number>>((a, i) => ({ ...a, [i.topic]: (a[i.topic] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setItems([{ id: crypto.randomUUID(), source: src, text: text.trim().slice(0, 300), area: area || "Unknown", minutesAgo: 0, verified: 35, ...analyze(text) }, ...items]);
    setText(""); setArea("");
  };

  return (
    <div className="space-y-6">
      <header><h1 className="text-4xl font-extrabold">Live City Insights</h1><p className="mt-2 text-muted-foreground">Scattered signals → verified, actionable insights.</p></header>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Weather" value="🌧️ 27°C" sub="Orange alert 4–9 PM" tone="var(--info)" />
        <Stat label="Traffic index" value="78 / 100" sub="Heavy, peak at 6 PM" tone="var(--warning)" />
        <Stat label="City mood" value={`${mood}%`} sub="from sentiment analysis" tone="var(--success)" />
        <Stat label="Signals today" value={`${items.length * 137}`} sub="across 6 sources" tone="var(--primary)" />
      </div>
      <div className="panel border-primary/40 bg-primary/10 p-4 text-sm"><b className="text-primary">Smart recommendation:</b> Rain + Sion flooding expected — head out before 3:30 PM, take the Western line, and swap outdoor plans for CST & Britannia & Co. indoors.</div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <form onSubmit={submit} className="panel space-y-3 p-4">
            <h2 className="font-bold">Report something</h2>
            <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={300} placeholder="e.g. Road blocked by waterlogging near Andheri subway" className="h-20 w-full rounded-md border border-input bg-secondary p-3 text-sm" />
            <div className="flex flex-wrap gap-2">
              <input value={area} onChange={(e) => setArea(e.target.value)} maxLength={60} placeholder="Area" className="flex-1 rounded-md border border-input bg-secondary px-3 py-2 text-sm" />
              <select value={src} onChange={(e) => setSrc(e.target.value as Source)} className="rounded-md border border-input bg-secondary px-3 py-2 text-sm">
                {(["Citizen report", "Voice note", "Photo"] as Source[]).map((s) => <option key={s}>{s}</option>)}
              </select>
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Submit</button>
            </div>
          </form>
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.id} className="panel p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{icon[i.source]} {i.source}</span>·<span>{i.area}</span>·<span>{i.minutesAgo ? `${i.minutesAgo}m ago` : "just now"}</span>
                  <span className="ml-auto rounded px-1.5 py-0.5" style={{ color: sentColor[i.sentiment], border: `1px solid ${sentColor[i.sentiment]}` }}>{i.topic}</span>
                </div>
                <p className="mt-2 text-sm">{i.text}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">Verification
                  <div className="h-1.5 w-24 rounded-full bg-muted"><div className="h-full rounded-full bg-accent" style={{ width: `${i.verified}%` }} /></div>{i.verified}%
                </div>
              </li>
            ))}
          </ul>
        </div>
        <aside className="space-y-4">
          <div className="panel p-5">
            <h3 className="font-bold">Traffic through the day</h3>
            <div className="mt-4 flex h-40 items-end gap-2">
              {trafficByHour.map((t) => (
                <div key={t.h} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t" style={{ height: `${t.v}%`, background: t.v > 75 ? "var(--destructive)" : t.v > 50 ? "var(--warning)" : "var(--success)" }} />
                  <span className="text-[10px] text-muted-foreground">{t.h}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-5">
            <h3 className="font-bold">Trending topics</h3>
            <ul className="mt-3 space-y-2">{topics.map(([t, n]) => (
              <li key={t} className="flex justify-between text-sm"><span>#{t}</span><span className="text-muted-foreground">{n}</span></li>
            ))}</ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: string }) {
  return (<div className="panel p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="font-display text-2xl font-bold" style={{ color: tone }}>{value}</p><p className="text-xs text-muted-foreground">{sub}</p></div>);
}
