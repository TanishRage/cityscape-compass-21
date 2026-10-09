// Places live in ./places (verified Pune dataset). Safety & feed data below are SIMULATED demo signals.
export * from "./places";

export type ReportKind = "unsafe" | "accident" | "flood" | "traffic";
export interface Hotspot { id: string; area: string; x: number; y: number; kind: ReportKind; severity: 1 | 2 | 3; note: string; reports: number; }

export const hotspots: Hotspot[] = [
  { id: "h1", area: "Hinjewadi Phase 1 junction", x: 14, y: 32, kind: "traffic", severity: 3, note: "Simulated: heavy peak-hour IT-park traffic.", reports: 40 },
  { id: "h2", area: "University Circle, Ganeshkhind Rd", x: 38, y: 36, kind: "flood", severity: 2, note: "Simulated: waterlogging after heavy rain.", reports: 31 },
  { id: "h3", area: "Swargate bus stand", x: 50, y: 62, kind: "unsafe", severity: 2, note: "Simulated: pickpocketing reports at peak hours.", reports: 22 },
  { id: "h4", area: "Katraj ghat road", x: 50, y: 84, kind: "accident", severity: 3, note: "Simulated: sharp curves, heavy vehicles.", reports: 27 },
  { id: "h5", area: "Hadapsar–Magarpatta stretch", x: 78, y: 62, kind: "traffic", severity: 2, note: "Simulated: slow-moving traffic evenings.", reports: 35 },
  { id: "h6", area: "Sinhagad Road, Vadgaon", x: 36, y: 74, kind: "flood", severity: 2, note: "Simulated: low-lying stretch near nala.", reports: 18 },
];

export const kindMeta: Record<ReportKind, { label: string; color: string }> = {
  unsafe: { label: "Unsafe area", color: "var(--destructive)" },
  accident: { label: "Accident-prone", color: "var(--warning)" },
  flood: { label: "Flooding", color: "var(--info)" },
  traffic: { label: "Heavy traffic", color: "var(--primary)" },
};

export type Source = "Citizen report" | "Voice note" | "Photo" | "Social media" | "Traffic feed" | "Weather alert";
export interface FeedItem { id: string; source: Source; text: string; area: string; minutesAgo: number; sentiment: "positive" | "neutral" | "negative"; verified: number; topic: string; }

// Simulated demo feed — not live data.
export const feed: FeedItem[] = [
  { id: "f1", source: "Weather alert", text: "Demo: rain expected this evening across Pune city and PCMC.", area: "Citywide", minutesAgo: 6, sentiment: "negative", verified: 90, topic: "Weather" },
  { id: "f2", source: "Traffic feed", text: "Demo: slow traffic on Hinjewadi–Wakad road towards the city.", area: "Hinjewadi", minutesAgo: 9, sentiment: "negative", verified: 85, topic: "Traffic" },
  { id: "f3", source: "Social media", text: "Demo: clear skies from Parvati Hill this morning, great view!", area: "Parvati", minutesAgo: 14, sentiment: "positive", verified: 60, topic: "Leisure" },
  { id: "f4", source: "Voice note", text: "(transcribed, demo) Water collecting near University Circle, use Senapati Bapat Road.", area: "Ganeshkhind", minutesAgo: 18, sentiment: "negative", verified: 75, topic: "Flooding" },
  { id: "f5", source: "Citizen report", text: "Demo: streetlights working again near Saras Baug.", area: "Sadashiv Peth", minutesAgo: 41, sentiment: "positive", verified: 55, topic: "Safety" },
];

export const trafficByHour = [
  { h: "6a", v: 25 }, { h: "8a", v: 78 }, { h: "10a", v: 90 }, { h: "12p", v: 55 },
  { h: "2p", v: 50 }, { h: "4p", v: 65 }, { h: "6p", v: 95 }, { h: "8p", v: 80 }, { h: "10p", v: 40 },
];
