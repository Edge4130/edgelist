import { useEffect, useRef, useState } from "react";

export function Field({ label, value, onChange, placeholder, type = "text", help, readOnly, width }) {
  return (
    <label className="af" style={width ? { maxWidth: width } : undefined}>
      <span className="af-label">{label}</span>
      <input className="af-input" type={type} value={value ?? ""} placeholder={placeholder} readOnly={readOnly}
        onChange={(e) => onChange?.(type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)} />
      {help && <span className="af-help">{help}</span>}
    </label>
  );
}

export function Area({ label, value, onChange, placeholder, rows = 3, help, mono }) {
  return (
    <label className="af">
      <span className="af-label">{label}</span>
      <textarea className={"af-input" + (mono ? " af-mono" : "")} rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {help && <span className="af-help">{help}</span>}
    </label>
  );
}

export function Toggle({ label, value, onChange, help }) {
  return (
    <label className="af af-toggle">
      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      <span><span className="af-label">{label}</span>{help && <span className="af-help">{help}</span>}</span>
    </label>
  );
}

export function Select({ label, value, onChange, options, help }) {
  return (
    <label className="af">
      <span className="af-label">{label}</span>
      <select className="af-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      {help && <span className="af-help">{help}</span>}
    </label>
  );
}

// Comma-separated list editor. keepBlanks keeps empty slots (used for two-ended scales).
export function ListField({ label, value = [], onChange, help, keepBlanks }) {
  const [text, setText] = useState(value.join(", "));
  const focused = useRef(false);
  const joined = value.join(", ");
  useEffect(() => { if (!focused.current) setText(joined); }, [joined]);
  return (
    <label className="af">
      <span className="af-label">{label}</span>
      <input className="af-input" value={text} onFocus={() => { focused.current = true; }}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          focused.current = false;
          const parts = text.split(",").map((s) => s.trim());
          onChange(keepBlanks ? parts : parts.filter(Boolean));
        }} />
      <span className="af-help">{help || "Separate with commas."}</span>
    </label>
  );
}

const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v || "");

export function ColorField({ label, value, onChange }) {
  return (
    <label className="af af-color">
      <span className="af-label">{label}</span>
      <span className="af-color-row">
        <input type="color" value={isHex(value) ? value : "#000000"} onChange={(e) => onChange(e.target.value.toUpperCase())} aria-label={`${label} color picker`} />
        <input className="af-input af-mono" value={value ?? ""} onChange={(e) => onChange(e.target.value)} aria-label={`${label} value`} />
      </span>
    </label>
  );
}

// Reorderable list of items, each collapsible.
export function ListEditor({ items = [], onChange, title, render, newItem, addLabel = "Add", canRemove = () => true, removeWarning, startOpen = false }) {
  const [open, setOpen] = useState(() => (startOpen ? new Set(items.map((_, i) => i)) : new Set()));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(new Set([...open].map((x) => (x === i ? j : x === j ? i : x))));
  };
  const update = (i, item) => onChange(items.map((x, k) => (k === i ? item : x)));
  const remove = (i) => {
    if (removeWarning && !window.confirm(removeWarning(items[i]))) return;
    onChange(items.filter((_, k) => k !== i));
    setOpen(new Set());
  };
  return (
    <div className="le">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className={"le-item" + (isOpen ? " open" : "")}>
            <div className="le-head">
              <button type="button" className="le-title" aria-expanded={isOpen} onClick={() => { const n = new Set(open); isOpen ? n.delete(i) : n.add(i); setOpen(n); }}>
                <span className="le-caret" aria-hidden="true">{isOpen ? "▾" : "▸"}</span>{title(item, i)}
              </button>
              <span className="le-tools">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</button>
                {canRemove(item) && <button type="button" className="le-del" onClick={() => remove(i)} aria-label="Remove">✕</button>}
              </span>
            </div>
            {isOpen && <div className="le-body">{render(item, (x) => update(i, x), i)}</div>}
          </div>
        );
      })}
      {newItem && (
        <button type="button" className="ab ab-quiet le-add" onClick={() => { onChange([...items, newItem()]); setOpen(new Set([...open, items.length])); }}>+ {addLabel}</button>
      )}
    </div>
  );
}

export const slugify = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "field";

export function uniqueKey(base, taken) {
  let k = slugify(base), n = 2;
  while (taken.includes(k)) k = `${slugify(base)}_${n++}`;
  return k;
}
