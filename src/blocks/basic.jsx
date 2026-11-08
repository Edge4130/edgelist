import { useRef, useState } from "react";
import { compressImage } from "../lib/image";
import { getPosition, reverseGeocode, searchPlace } from "../lib/geo";

export function TextBlock({ b, value, onChange }) {
  return (
    <label className="lbl">{b.label}
      <input className="field" value={value || ""} placeholder={b.placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function DateBlock({ b, value, onChange }) {
  return (
    <label className="lbl">{b.label}
      <input className="field mono" type="date" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function TextAreaBlock({ b, value, onChange }) {
  return (
    <label className="lbl">{b.label}
      <textarea className="field area" rows={4} value={value || ""} placeholder={b.placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

// Phone-friendly: a label wraps the input, and there is no "capture" attribute,
// so phones offer both the camera and the photo library.
export function PhotoBlock({ b, value, onChange, compact }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ref = useRef(null);
  async function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setErr("");
    try { onChange(await compressImage(f)); }
    catch (x) { setErr(x.message); }
    finally { setBusy(false); e.target.value = ""; }
  }
  return (
    <div className={compact ? "photo-compact" : "photo-wide"}>
      {!compact && <div className="lbl">{b.label}</div>}
      <label className={"photo" + (value ? " has" : "")}>
        {value ? <img src={value} alt="Your photo" /> : <span>{busy ? "Processing" : "Add photo"}</span>}
        <input ref={ref} className="file-input" type="file" accept="image/*,.heic,.heif" onChange={pick} />
      </label>
      {value && (
        <p className="small photo-actions">
          <button type="button" className="link" onClick={() => ref.current?.click()}>Replace</button>
          <button type="button" className="link" onClick={() => onChange(null)}>Remove</button>
        </p>
      )}
      {err && <p className="msg small">{err}</p>}
    </div>
  );
}

export function LocationBlock({ b, entry, onPatch }) {
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [hits, setHits] = useState([]);

  async function locate() {
    setBusy("gps"); setMsg("");
    try {
      const { lat, lng } = await getPosition();
      const { name, area, display } = await reverseGeocode(lat, lng);
      onPatch({ lat, lng, address: display || entry.address, place_name: entry.place_name || [name, area].filter(Boolean).join(", ") });
    } catch (x) { setMsg(x.message); }
    finally { setBusy(""); }
  }
  async function search(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy("search"); setMsg("");
    try {
      const h = await searchPlace(q);
      setHits(h);
      if (!h.length) setMsg(`No places found for "${q}". Try adding the city.`);
    } catch { setMsg("Place search isn't reachable right now. Type the name and save without a pin."); }
    finally { setBusy(""); }
  }
  return (
    <div className="location">
      <div className="lbl">{b.label}</div>
      <div className="where">
        <input className="field" value={entry.place_name || ""} placeholder={b.placeholder} aria-label={b.label} onChange={(e) => onPatch({ place_name: e.target.value })} />
        <button type="button" className="btn-quiet" onClick={locate} disabled={busy === "gps"}>{busy === "gps" ? "Locating" : "Use my location"}</button>
      </div>
      <form className="where-search" onSubmit={search}>
        <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Or search for a place or address" aria-label="Search for a place or address" />
        <button className="btn-quiet" disabled={busy === "search"}>{busy === "search" ? "Searching" : "Search"}</button>
      </form>
      {hits.length > 0 && (
        <ul className="hits">
          {hits.map((h, i) => (
            <li key={i}><button type="button" onClick={() => { onPatch({ lat: h.lat, lng: h.lng, address: h.label, place_name: entry.place_name || h.name }); setHits([]); setQ(""); }}>{h.label}</button></li>
          ))}
        </ul>
      )}
      {entry.address && <p className="small muted">{entry.address}</p>}
      <p className="small muted">
        {entry.lat != null ? `Pinned at ${Number(entry.lat).toFixed(4)}, ${Number(entry.lng).toFixed(4)}` : "No map pin yet"}
        {entry.lat != null && <> · <button type="button" className="link" onClick={() => onPatch({ lat: null, lng: null })}>clear pin</button></>}
      </p>
      {msg && <p className="msg small">{msg}</p>}
    </div>
  );
}

// Choice chips. "toggle" lets a second tap clear the choice. "other" adds a free-text option.
export function PillsBlock({ b, value, otherValue, onChange, onOther }) {
  const opts = b.options;
  const isOther = b.other && value != null && (!opts.includes(value) || value === b.other.option);
  const selected = value == null ? null : opts.includes(value) && value !== b.other?.option ? value : b.other ? b.other.option : value;
  const otherText = isOther ? (otherValue ?? (value === b.other.option ? "" : value)) : "";
  return (
    <div>
      <div className="lbl">{b.label}</div>
      <div className="pills" role="radiogroup" aria-label={b.label}>
        {opts.map((o) => (
          <button key={o} type="button" role="radio" aria-checked={selected === o} className={"pill" + (selected === o ? " on" : "")}
            onClick={() => {
              if (b.toggle && selected === o) return onChange(null);
              if (b.other && o === b.other.option) { onChange(otherText || o); onOther?.(otherText); }
              else { onChange(o); if (b.other) onOther?.(""); }
            }}>{o}</button>
        ))}
      </div>
      {isOther && (
        <input className="field other-input" value={otherText} placeholder={b.other.placeholder} aria-label={b.other.placeholder}
          onChange={(e) => { onOther?.(e.target.value); onChange(e.target.value || b.other.option); }} />
      )}
    </div>
  );
}

const FLAME = "M12 2.5c.6 3.2 3.9 5.1 3.9 9.2a3.9 3.9 0 0 1-7.8 0c0-1.9.9-3.2 1.6-4.5.6 1.1 1.4 1.8 2.2 2.2-.3-2.6-.4-4.8.1-6.9z";

export function HeatBlock({ b, value, onChange }) {
  const idx = b.levels.indexOf(value);
  return (
    <div>
      <div className="lbl">{b.label}</div>
      <div className="heat" role="radiogroup" aria-label={b.label}>
        {b.levels.map((lvl, i) => {
          const active = i <= idx;
          return (
            <button key={lvl} type="button" role="radio" aria-checked={value === lvl} className={"heat-btn" + (active ? " on" : "")} onClick={() => onChange(lvl)}>
              <span className="heat-col">
                {Array.from({ length: i + 1 }).map((_, f) => (
                  <svg key={f} viewBox="0 0 24 24" className="flame" aria-hidden="true"><path d={FLAME} /></svg>
                ))}
              </span>
              <span className="heat-lbl">{lvl}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function YesNoBlock({ b, value, onChange }) {
  return (
    <div>
      <div className="lbl">{b.label}</div>
      <div className="yesno">
        <button type="button" aria-pressed={value === true} className={"yn yes" + (value === true ? " on" : "")} onClick={() => onChange(value === true ? null : true)}>✓ Yes</button>
        <button type="button" aria-pressed={value === false} className={"yn no" + (value === false ? " on" : "")} onClick={() => onChange(value === false ? null : false)}>✕ No</button>
      </div>
    </div>
  );
}

export function SlidersBlock({ b, value = {}, onChange }) {
  return (
    <div className="sliders">
      {b.rows.map((r) => (
        <div key={r.key} className="slider-row">
          <div className="slider-top">
            <label htmlFor={`sl-${r.key}`} className="slider-label">{r.label}</label>
            <span className="slider-val">{value[r.key]}</span>
          </div>
          <p className="slider-hint">{r.hint}</p>
          <input id={`sl-${r.key}`} type="range" min={b.min} max={b.max} value={value[r.key] ?? b.default} onChange={(e) => onChange({ ...value, [r.key]: Number(e.target.value) })} />
        </div>
      ))}
    </div>
  );
}

export function Stamp({ total, max, band }) {
  return (
    <div className="stamp-wrap" aria-label={`Total ${total} of ${max}, ${band.label}`}>
      <div className="stamp" style={{ color: band.color, borderColor: band.color }}>
        <span className="stamp-num">{total}</span>
        <span className="stamp-max">/ {max}</span>
      </div>
      <span className="stamp-band" style={{ color: band.color }}>{band.label}</span>
    </div>
  );
}
