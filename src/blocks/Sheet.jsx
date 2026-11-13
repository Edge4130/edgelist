import { useState } from "react";
import ScaleRow from "./ScaleRow";
import Tip from "./Tip";

// Judging scoresheet: sections with a point box, characteristic rows, optional descriptor tags.
export default function Sheet({ b, value = {}, srmRange, family, colorNote, onChange }) {
  const setSection = (key, patch) => onChange({ ...value, [key]: { ...(value[key] || { rows: {}, off: {}, tags: {} }), ...patch } });
  return b.sections.map((s) => (
    <SheetSection key={s.key} s={s} sec={value[s.key] || { score: null, rows: {}, off: {}, tags: {} }} srmRange={srmRange}
      descriptors={b.descriptors} family={family} colorNote={colorNote} onChange={(patch) => setSection(s.key, patch)} />
  ));
}

function SheetSection({ s, sec, srmRange, descriptors, family, colorNote, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="block sheet" id={`section-${s.key}`}>
      <header className="sheet-head">
        <h2><button type="button" className="sheet-title" aria-expanded={open} onClick={() => setOpen(!open)}>{s.label}</button></h2>
        <ScoreBox max={s.max} value={sec.score} label={s.label} onChange={(score) => onChange({ score })} />
      </header>
      {open && s.tip && <Tip tip={s.tip} />}
      {s.rows.map((r) => (
        <ScaleRow key={r.key} row={r} value={sec.rows?.[r.key] ?? null} off={sec.off?.[r.key]} tags={sec.tags?.[r.key]}
          srmRange={r.key === "color" ? srmRange : null} descriptors={descriptors}
          spotlight={!!(family && r.spotlight?.includes(family))}
          note={r.key === "color" ? colorNote : family && r.spotlight?.includes(family) ? r.spotlightNote : null}
          onChange={(v) => { const rows = { ...(sec.rows || {}) }; if (v == null) delete rows[r.key]; else rows[r.key] = v; onChange({ rows }); }}
          onToggleOff={() => { const off = { ...(sec.off || {}) }; if (off[r.key]) delete off[r.key]; else off[r.key] = true; onChange({ off }); }}
          onTags={(list) => { const tags = { ...(sec.tags || {}) }; if (list.length) tags[r.key] = list; else delete tags[r.key]; onChange({ tags }); }} />
      ))}
    </section>
  );
}

function ScoreBox({ max, value, label, onChange }) {
  const v = value ?? null;
  const bump = (d) => onChange(Math.max(0, Math.min(max, (v ?? Math.round(max * 0.6)) + (v == null ? 0 : d))));
  return (
    <div className="scorebox">
      <button type="button" aria-label={`Lower ${label} score`} onClick={() => bump(-1)}>−</button>
      <input inputMode="numeric" aria-label={`${label} score out of ${max}`} value={v ?? ""} placeholder="–"
        onChange={(e) => { const t = e.target.value.replace(/\D/g, ""); onChange(t === "" ? null : Math.min(max, Number(t))); }} />
      <span className="scorebox-max">/{max}</span>
      <button type="button" aria-label={`Raise ${label} score`} onClick={() => bump(1)}>+</button>
    </div>
  );
}
