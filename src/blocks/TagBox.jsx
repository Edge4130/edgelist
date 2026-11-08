import { useState } from "react";

// Optional descriptor tags under a characteristic row. Suggestions plus free typing.
export default function TagBox({ label, value = [], suggestions = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const has = (t) => value.some((v) => v.toLowerCase() === t.toLowerCase());
  const add = (t) => { const v = t.trim(); if (v && !has(v)) onChange([...value, v]); };
  const remove = (t) => onChange(value.filter((v) => v !== t));

  return (
    <div className="tagbox">
      {(value.length > 0 || !open) && (
        <div className="tags">
          {value.map((t) => (
            <button key={t} type="button" className="tag on" onClick={() => remove(t)} aria-label={`Remove ${t}`}>
              {t} <span aria-hidden="true">×</span>
            </button>
          ))}
          {!open && (
            <button type="button" className="tag add" onClick={() => setOpen(true)} aria-expanded="false">
              + {value.length ? "More" : `${label} descriptors`}
            </button>
          )}
        </div>
      )}
      {open && (
        <div className="tag-panel">
          <div className="tags">
            {suggestions.filter((s) => !has(s)).map((s) => (
              <button key={s} type="button" className="tag" onClick={() => add(s)}>{s}</button>
            ))}
          </div>
          <form className="tag-own" onSubmit={(e) => { e.preventDefault(); add(text); setText(""); }}>
            <input className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add your own" aria-label={`Add your own ${label.toLowerCase()} descriptor`} />
            <button className="btn-quiet" disabled={!text.trim()}>Add</button>
            <button type="button" className="btn-quiet" onClick={() => { if (text.trim()) add(text); setText(""); setOpen(false); }}>Done</button>
          </form>
        </div>
      )}
    </div>
  );
}
