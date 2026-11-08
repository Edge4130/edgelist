import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAt } from "../lib/bind";
import { bandFor, maxOf } from "../lib/scoring";

// Pins colored by score band; entries at the same spot share one pin.
export default function MapView({ topic, entries }) {
  const el = useRef(null);
  const map = useRef(null);
  const pinned = entries.filter((p) => p.lat != null && p.lng != null);
  const max = maxOf(topic);

  useEffect(() => {
    if (!el.current) return;
    map.current = L.map(el.current).setView([44.9778, -93.265], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(map.current);
    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const layer = L.layerGroup().addTo(m);
    const spots = new Map();
    for (const p of pinned) {
      const k = `${Number(p.lat).toFixed(4)},${Number(p.lng).toFixed(4)}`;
      if (!spots.has(k)) spots.set(k, []);
      spots.get(k).push(p);
    }
    const pts = [];
    for (const list of spots.values()) {
      const lat = Number(list[0].lat), lng = Number(list[0].lng);
      pts.push([lat, lng]);
      const best = Math.max(...list.map((p) => p.total ?? 0));
      const color = bandFor(topic, best).color;
      const icon = L.divIcon({ className: "pin", html: `<span style="border-color:${color}">${best}</span>`, iconSize: [34, 34], iconAnchor: [17, 17] });
      const div = document.createElement("div");
      div.className = "pop";
      const h = document.createElement("strong");
      h.textContent = list[0].place_name || list[0].address || "Unnamed place";
      div.appendChild(h);
      for (const p of list) {
        const row = document.createElement("div");
        row.className = "pop-row";
        const extra = topic.list.badges.filter((b) => !b.kind).map((b) => getAt(p, b.bind)).filter(Boolean)[0];
        row.textContent = `${p.item_name}${p.maker ? ", " + p.maker : ""}: ${p.total ?? 0}/${max} ${bandFor(topic, p.total ?? 0).label}${extra ? " · " + extra : ""}`;
        div.appendChild(row);
        const who = [p.reviewer, p.entry_date].filter(Boolean).join(" · ");
        if (who) { const w = document.createElement("div"); w.className = "pop-sub"; w.textContent = who; div.appendChild(w); }
        if (p.photo) { const img = document.createElement("img"); img.src = p.photo; img.alt = ""; img.className = "pop-img"; div.appendChild(img); }
      }
      L.marker([lat, lng], { icon }).bindPopup(div).addTo(layer);
    }
    if (pts.length === 1) m.setView(pts[0], 14);
    else if (pts.length > 1) m.fitBounds(pts, { padding: [40, 40] });
    return () => layer.remove();
  }, [entries]);

  return (
    <div className="mapwrap">
      <div ref={el} className="map" />
      {!pinned.length && <p className="map-empty">Entries with a location show up here, grouped by place.</p>}
    </div>
  );
}
