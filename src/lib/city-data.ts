export type Category = "attraction" | "food" | "hotel" | "heritage" | "budget";

export interface Place {
  id: string;
  name: string;
  category: Category;
  area: string;
  x: number; // 0-100 map position
  y: number;
  rating: number;
  price: 1 | 2 | 3;
  safety: number; // 0-10
  cleanliness: number;
  accessibility: number;
  blurb: string;
  tags: string[];
}

export const CITY = "Mumbai";

export const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "attraction", label: "Attractions", emoji: "🎡" },
  { id: "food", label: "Local food", emoji: "🍛" },
  { id: "hotel", label: "Hotels", emoji: "🏨" },
  { id: "heritage", label: "Heritage", emoji: "🏛️" },
  { id: "budget", label: "Budget-friendly", emoji: "💸" },
];

export const places: Place[] = [
  { id: "gateway", name: "Gateway of India", category: "heritage", area: "Colaba", x: 62, y: 88, rating: 4.6, price: 1, safety: 7.5, cleanliness: 6.5, accessibility: 8, blurb: "1924 basalt arch overlooking the harbour, built to mark the visit of King George V.", tags: ["Indo-Saracenic", "Sea view", "Ferries to Elephanta"] },
  { id: "cst", name: "Chhatrapati Shivaji Terminus", category: "heritage", area: "Fort", x: 60, y: 78, rating: 4.7, price: 1, safety: 7, cleanliness: 6, accessibility: 7, blurb: "UNESCO World Heritage Victorian Gothic railway station, still the city's busiest hub.", tags: ["UNESCO", "Architecture"] },
  { id: "elephanta", name: "Elephanta Caves", category: "heritage", area: "Harbour", x: 88, y: 80, rating: 4.4, price: 2, safety: 8, cleanliness: 7.5, accessibility: 4, blurb: "5th–8th century rock-cut temples dedicated to Shiva, one hour by ferry.", tags: ["UNESCO", "Ferry ride"] },
  { id: "marine", name: "Marine Drive", category: "attraction", area: "Churchgate", x: 48, y: 76, rating: 4.7, price: 1, safety: 8.5, cleanliness: 7.5, accessibility: 9, blurb: "The 'Queen's Necklace' — a 3.6 km promenade best at sunset.", tags: ["Sunset", "Walk", "Free"] },
  { id: "bandstand", name: "Bandstand & Bandra Fort", category: "attraction", area: "Bandra", x: 30, y: 46, rating: 4.4, price: 1, safety: 8, cleanliness: 7, accessibility: 7, blurb: "Seaside walk with sea-link views, street art and a 1640 Portuguese fort.", tags: ["Street art", "Sea link"] },
  { id: "sgnp", name: "Sanjay Gandhi National Park", category: "attraction", area: "Borivali", x: 50, y: 10, rating: 4.3, price: 1, safety: 7, cleanliness: 8.5, accessibility: 5, blurb: "A forest inside the city, home to the 2,000-year-old Kanheri Caves.", tags: ["Nature", "Caves", "Trek"] },
  { id: "mohammed", name: "Mohammed Ali Road", category: "food", area: "Bhendi Bazaar", x: 58, y: 70, rating: 4.5, price: 1, safety: 5.5, cleanliness: 4, accessibility: 4.5, blurb: "Legendary late-night street food lane — malpua, kebabs, nalli nihari.", tags: ["Late night", "Non-veg", "Crowded"] },
  { id: "britannia", name: "Britannia & Co.", category: "food", area: "Ballard Estate", x: 63, y: 80, rating: 4.6, price: 2, safety: 8, cleanliness: 7.5, accessibility: 6, blurb: "1923 Irani café famous for berry pulao and caramel custard.", tags: ["Parsi", "Iconic"] },
  { id: "juhu", name: "Juhu Beach Chowpatty", category: "budget", area: "Juhu", x: 24, y: 36, rating: 4.1, price: 1, safety: 6.5, cleanliness: 4.5, accessibility: 7, blurb: "Pav bhaji, pani puri and gola stalls on the sand.", tags: ["Street food", "Beach"] },
  { id: "vadapav", name: "Ashok Vada Pav", category: "budget", area: "Dadar", x: 46, y: 56, rating: 4.6, price: 1, safety: 7, cleanliness: 5.5, accessibility: 6, blurb: "Arguably the city's most loved ₹20 vada pav, near Kirti College.", tags: ["Under ₹50", "Veg"] },
  { id: "taj", name: "Taj Mahal Palace", category: "hotel", area: "Colaba", x: 61, y: 90, rating: 4.8, price: 3, safety: 9.5, cleanliness: 9.5, accessibility: 9, blurb: "1903 heritage luxury hotel facing the Gateway of India.", tags: ["Luxury", "Heritage"] },
  { id: "zostel", name: "Backpacker Hostel Colaba", category: "hotel", area: "Colaba", x: 58, y: 92, rating: 4.2, price: 1, safety: 7.5, cleanliness: 7, accessibility: 6, blurb: "Dorm beds near Colaba Causeway for budget travellers.", tags: ["Hostel", "Budget"] },
  { id: "crawford", name: "Crawford Market", category: "budget", area: "Fort", x: 59, y: 74, rating: 4.0, price: 1, safety: 6, cleanliness: 5, accessibility: 5, blurb: "1869 market for fruit, spices and household bargains.", tags: ["Shopping", "Bargain"] },
  { id: "dharavi", name: "Dharavi Craft Walk", category: "attraction", area: "Dharavi", x: 44, y: 50, rating: 4.5, price: 2, safety: 6.5, cleanliness: 4, accessibility: 4, blurb: "Guided walk through leather, pottery and recycling workshops.", tags: ["Guided", "Culture"] },
];

export type ReportKind = "unsafe" | "accident" | "flood" | "traffic";
export interface Hotspot { id: string; area: string; x: number; y: number; kind: ReportKind; severity: 1 | 2 | 3; note: string; reports: number; }

export const hotspots: Hotspot[] = [
  { id: "h1", area: "Western Express Hwy, Andheri", x: 34, y: 34, kind: "accident", severity: 3, note: "Frequent two-wheeler accidents near flyover exit.", reports: 42 },
  { id: "h2", area: "Sion Circle", x: 50, y: 52, kind: "flood", severity: 3, note: "Waterlogging after 50mm+ rainfall.", reports: 58 },
  { id: "h3", area: "Kurla Station West", x: 54, y: 44, kind: "unsafe", severity: 2, note: "Pickpocketing reports during peak hours.", reports: 27 },
  { id: "h4", area: "Hindmata, Dadar", x: 48, y: 59, kind: "flood", severity: 2, note: "Low-lying junction floods quickly.", reports: 33 },
  { id: "h5", area: "Ghatkopar–Andheri Link Rd", x: 46, y: 36, kind: "traffic", severity: 3, note: "Metro work; 40+ min delays at peak.", reports: 61 },
  { id: "h6", area: "Grant Road underpass", x: 55, y: 69, kind: "unsafe", severity: 1, note: "Poorly lit after 11 PM.", reports: 12 },
  { id: "h7", area: "Eastern Express Hwy, Vikhroli", x: 62, y: 30, kind: "accident", severity: 2, note: "Speeding trucks at night.", reports: 19 },
];

export const kindMeta: Record<ReportKind, { label: string; color: string }> = {
  unsafe: { label: "Unsafe area", color: "var(--destructive)" },
  accident: { label: "Accident-prone", color: "var(--warning)" },
  flood: { label: "Flooding", color: "var(--info)" },
  traffic: { label: "Heavy traffic", color: "var(--primary)" },
};

export type Source = "Citizen report" | "Voice note" | "Photo" | "Social media" | "Traffic feed" | "Weather alert";
export interface FeedItem { id: string; source: Source; text: string; area: string; minutesAgo: number; sentiment: "positive" | "neutral" | "negative"; verified: number; topic: string; }

export const feed: FeedItem[] = [
  { id: "f1", source: "Weather alert", text: "IMD orange alert: heavy rain expected 4–9 PM across island city and western suburbs.", area: "Citywide", minutesAgo: 6, sentiment: "negative", verified: 98, topic: "Weather" },
  { id: "f2", source: "Traffic feed", text: "Slow traffic on Western Express Hwy southbound from Andheri to Bandra, avg 12 km/h.", area: "Andheri", minutesAgo: 9, sentiment: "negative", verified: 92, topic: "Traffic" },
  { id: "f3", source: "Social media", text: "Sunset at Marine Drive tonight is unreal 🌅 crowd is light, perfect for a walk", area: "Churchgate", minutesAgo: 14, sentiment: "positive", verified: 71, topic: "Leisure" },
  { id: "f4", source: "Voice note", text: "(transcribed) Water up to ankle near Sion circle, autos refusing to go, take the flyover instead.", area: "Sion", minutesAgo: 18, sentiment: "negative", verified: 84, topic: "Flooding" },
  { id: "f5", source: "Photo", text: "Photo of fallen tree blocking one lane on Linking Road near Bandra.", area: "Bandra", minutesAgo: 25, sentiment: "negative", verified: 88, topic: "Roads" },
  { id: "f6", source: "Citizen report", text: "New streetlights installed at Grant Road underpass — much safer now.", area: "Grant Road", minutesAgo: 41, sentiment: "positive", verified: 63, topic: "Safety" },
  { id: "f7", source: "Social media", text: "Mohammed Ali Road stalls open till 2 AM this week, try the malpua!", area: "Bhendi Bazaar", minutesAgo: 55, sentiment: "positive", verified: 58, topic: "Food" },
  { id: "f8", source: "Traffic feed", text: "Local trains on Central line running 10–15 min late due to signal failure at Thane.", area: "Central line", minutesAgo: 62, sentiment: "negative", verified: 95, topic: "Transit" },
];

export const trafficByHour = [
  { h: "6a", v: 25 }, { h: "8a", v: 78 }, { h: "10a", v: 90 }, { h: "12p", v: 55 },
  { h: "2p", v: 50 }, { h: "4p", v: 65 }, { h: "6p", v: 95 }, { h: "8p", v: 80 }, { h: "10p", v: 40 },
];

export function overallScore(p: Place) {
  const afford = (4 - p.price) * 3.33;
  return +((p.safety + p.cleanliness + p.accessibility + afford + p.rating * 2) / 5).toFixed(1);
}
