// Pure, deterministic itinerary validation. AI picks places & visit lengths; this code checks the math.
import { places, type Category, type Place } from "./places";

export interface PlanInput { budget: number; hours: number; interests: Category[] }
export interface AiStop { placeId: string; visitMinutes: number; reason: string }
export interface Stop { place: Place; visitMinutes: number; travelMinutes: number; startOffset: number; cost: number | null; reason: string }
export type PlanResult =
  | { ok: true; stops: Stop[]; totalMinutes: number; verifiedCost: number; unknownCostCount: number; summary: string; ai: true }
  | { ok: false; kind: "input" | "config" | "api" | "infeasible"; message: string };

// Assumptions (labelled in UI): road distance ≈ 1.3× straight line, 20 km/h city average, +10 min per leg.
export const TRAVEL_ASSUMPTION = "Travel time is an estimate: straight-line distance × 1.3 at 20 km/h city speed, plus 10 min per leg.";

export function validateInput(i: PlanInput): string | null {
  if (!Number.isFinite(i.budget) || i.budget < 0 || i.budget > 100000) return "Budget must be between ₹0 and ₹1,00,000.";
  if (!Number.isFinite(i.hours) || i.hours < 1 || i.hours > 14) return "Available time must be between 1 and 14 hours.";
  if (!i.interests.length) return "Pick at least one interest.";
  return null;
}

/** Verified price in ₹: 0 for free, null when unavailable. */
export const priceOf = (p: Place): number | null => (p.price && /^free/i.test(p.price) ? 0 : null);

/** Places the AI may choose from. A ₹0 budget is only verifiable with free places. */
export function candidates(i: PlanInput): Place[] {
  return places.filter((p) =>
    (i.interests.includes(p.category) || p.alsoIn?.some((c) => i.interests.includes(c))) &&
    (i.budget > 0 || priceOf(p) === 0));
}

function km(a: Place, b: Place) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
export const travelMinutes = (a: Place, b: Place) => Math.round((km(a, b) * 1.3 / 20) * 60 + 10);

export function validatePlan(i: PlanInput, ai: AiStop[], summary: string): PlanResult {
  const allowed = new Map(candidates(i).map((p) => [p.id, p]));
  const seen = new Set<string>();
  const stops: Stop[] = [];
  let t = 0;
  for (const s of ai) {
    const place = allowed.get(s.placeId);
    if (!place || seen.has(s.placeId)) continue; // drop unknown/duplicate places
    seen.add(s.placeId);
    const visit = Math.min(240, Math.max(20, Math.round(s.visitMinutes)));
    const travel = stops.length ? travelMinutes(stops[stops.length - 1]!.place, place) : 0;
    t += travel;
    stops.push({ place, visitMinutes: visit, travelMinutes: travel, startOffset: t, cost: priceOf(place), reason: s.reason });
    t += visit;
  }
  if (!stops.length) return { ok: false, kind: "infeasible", message: "No valid places from the dataset could be scheduled for these interests." };
  const verifiedCost = stops.reduce((a, s) => a + (s.cost ?? 0), 0);
  const unknownCostCount = stops.filter((s) => s.cost === null).length;
  const limit = i.hours * 60;
  if (t > limit) return { ok: false, kind: "infeasible", message: `Plan needs about ${Math.ceil(t / 6) / 10} h but you have ${i.hours} h. Try more time or fewer interests.` };
  if (verifiedCost > i.budget) return { ok: false, kind: "infeasible", message: `Verified cost ₹${verifiedCost} exceeds your ₹${i.budget} budget.` };
  return { ok: true, stops, totalMinutes: t, verifiedCost, unknownCostCount, summary, ai: true };
}
