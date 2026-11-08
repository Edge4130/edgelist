// Device GPS plus OpenStreetMap Nominatim for place names (no API key).
export function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("This device doesn't share location."));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => reject(new Error("Location was blocked. Allow location for this site, or search for the place instead.")),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  });
}

export async function reverseGeocode(lat, lng) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&lat=${lat}&lon=${lng}`);
    const j = await r.json();
    const a = j.address || {};
    const name = j.name || a.amenity || a.pub || a.bar || a.restaurant || "";
    const area = a.city || a.town || a.village || a.suburb || "";
    return { name, area, display: j.display_name || "" };
  } catch { return { name: "", area: "", display: "" }; }
}

export async function searchPlace(q) {
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(q)}`);
  const j = await r.json();
  return j.map((x) => ({ label: x.display_name, lat: Number(x.lat), lng: Number(x.lon), name: x.name || x.display_name.split(",")[0] }));
}
