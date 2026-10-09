import { useEffect, useRef } from "react";
import type * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CITY, categoryLabel, directionsUrl, type Place } from "@/lib/places";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function PlaceMap({ places, selected, onSelect, colors }: {
  places: Place[]; selected: string | null; onSelect: (id: string) => void; colors: Record<string, string>;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const lib = useRef<typeof L | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const markers = useRef<Map<string, L.CircleMarker>>(new Map());
  const ready = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let cancelled = false;
    ready.current = import("leaflet").then((mod) => {
      const Lf = (mod.default ?? mod) as typeof L;
      if (cancelled || !el.current) return;
      lib.current = Lf;
      map.current = Lf.map(el.current).setView(CITY.center, CITY.zoom);
      Lf.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map.current);
      layer.current = Lf.layerGroup().addTo(map.current);
    });
    return () => { cancelled = true; map.current?.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    ready.current?.then(() => {
      const Lf = lib.current, m = map.current, g = layer.current;
      if (!Lf || !m || !g) return;
      g.clearLayers(); markers.current.clear();
      places.forEach((p) => {
        const mk = Lf.circleMarker([p.lat, p.lng], { radius: 8, weight: 2, color: "#fff", fillColor: colors[p.category], fillOpacity: 0.95 })
          .bindPopup(`<b>${esc(p.name)}</b><br/><small>${esc(categoryLabel(p.category))} · ${esc(p.locality)}</small><br/>${esc(p.description)}<br/><small>${esc(p.price ?? "Price unavailable")}</small><br/><a href="${directionsUrl(p)}" target="_blank" rel="noopener">Directions ↗</a>`)
          .on("click", () => onSelect(p.id))
          .addTo(g);
        markers.current.set(p.id, mk);
      });
      if (places.length) m.fitBounds(Lf.latLngBounds(places.map((p) => [p.lat, p.lng])), { padding: [30, 30], maxZoom: 14 });
    });
  }, [places, colors, onSelect]);

  useEffect(() => {
    ready.current?.then(() => {
      markers.current.forEach((mk, id) => mk.setStyle({ radius: id === selected ? 13 : 8, weight: id === selected ? 4 : 2 }));
      const mk = selected ? markers.current.get(selected) : null;
      if (mk && map.current) { mk.bringToFront(); map.current.setView(mk.getLatLng(), Math.max(map.current.getZoom(), 14)); mk.openPopup(); }
    });
  }, [selected, places]);

  return <div ref={el} className="relative z-0 aspect-[4/5] w-full overflow-hidden rounded-xl border border-border" />;
}
