import { createServerFn } from "@tanstack/react-start";
import { candidates, validateInput, validatePlan, type AiStop, type PlanInput, type PlanResult } from "./itinerary";
import type { Category } from "./places";

const CATS: Category[] = ["attraction", "food", "hotel", "heritage", "park", "budget"];

const schema = {
  type: "object", additionalProperties: false, required: ["summary", "stops"],
  properties: {
    summary: { type: "string" },
    stops: { type: "array", items: { type: "object", additionalProperties: false, required: ["placeId", "visitMinutes", "reason"],
      properties: { placeId: { type: "string" }, visitMinutes: { type: "integer" }, reason: { type: "string" } } } },
  },
};

export const planItinerary = createServerFn({ method: "POST" })
  .inputValidator((d: PlanInput) => ({
    budget: Number(d?.budget), hours: Number(d?.hours),
    interests: Array.isArray(d?.interests) ? d.interests.filter((c): c is Category => CATS.includes(c)) : [],
  }))
  .handler(async ({ data }): Promise<PlanResult> => {
    const bad = validateInput(data);
    if (bad) return { ok: false, kind: "input", message: bad };
    const pool = candidates(data);
    if (!pool.length) return { ok: false, kind: "infeasible", message: data.budget === 0 ? "No places with verified free entry match these interests. Raise the budget or add Heritage/Parks." : "No places match these interests." };
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { ok: false, kind: "config", message: "AI is not configured (missing API key)." };

    const list = pool.map((p) => ({ id: p.id, name: p.name, category: p.category, locality: p.locality, lat: p.lat, lng: p.lng, price: p.price ?? "unavailable", about: p.description }));
    const prompt = `Plan a practical one-day Pune itinerary. Budget ₹${data.budget}, available time ${data.hours} hours, interests: ${data.interests.join(", ")}.
Use ONLY placeIds from this list. Order stops to minimise back-and-forth using the coordinates. Leave roughly 30% of the time for travel. Give a realistic visitMinutes (20-240) per stop and a one-sentence reason. Do not state prices, ratings, opening hours or travel times. summary: 1-2 sentences.
PLACES: ${JSON.stringify(list)}`;

    let res: Response;
    try {
      res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
        body: JSON.stringify({ model: "openai/gpt-6-astra", stream: true, store: false, reasoning: { effort: "low" }, input: prompt,
          text: { format: { type: "json_schema", name: "itinerary", strict: true, schema } } }),
      });
    } catch {
      return { ok: false, kind: "api", message: "Could not reach the AI service. Please try again." };
    }
    if (!res.ok || !res.body) {
      const msg = res.status === 401 ? "AI key is invalid — configuration error." : res.status === 402 ? "AI credits are used up. Add credits to keep planning." : res.status === 429 ? "AI is busy (rate limited). Wait a moment and try again." : res.status === 403 ? "AI access is blocked for this workspace." : `AI service error (${res.status}).`;
      return { ok: false, kind: res.status === 401 ? "config" : "api", message: msg };
    }

    // Read SSE stream, collect final text.
    const reader = res.body.getReader(); const dec = new TextDecoder();
    let buf = "", text = "", failed = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n"); buf = lines.pop() ?? "";
      for (const l of lines) {
        if (!l.startsWith("data: ")) continue;
        try {
          const ev = JSON.parse(l.slice(6));
          if (ev.type === "response.output_text.delta") text += ev.delta;
          else if (ev.type === "response.failed" || ev.type === "error") failed = ev.response?.error?.message ?? ev.message ?? "AI request failed.";
          else if (ev.type === "response.refusal.done") failed = "The AI declined this request.";
        } catch { /* partial line */ }
      }
    }
    if (failed) return { ok: false, kind: "api", message: failed };
    let parsed: { summary: string; stops: AiStop[] };
    try { parsed = JSON.parse(text); } catch { return { ok: false, kind: "api", message: "AI returned an unreadable plan. Please try again." }; }
    return validatePlan(data, parsed.stops ?? [], parsed.summary ?? "");
  });
