import { useMemo, useRef, useState } from "react";
import { STYLES, SPECIALTY_IPA_VARIANTS } from "../data/bjcpStyles";

// One searchable list grouped by category. "21" jumps to category 21, "21c" to the style, words match names.
export default function StylePicker({ value, variant, onChange }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const selected = STYLES.find((s) => s.n === value);

  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    let list = STYLES;
    if (t) {
      const numQ = /^\d{1,2}[a-z]?$/.test(t);
      list = STYLES.filter((s) =>
        numQ
          ? (/[a-z]$/.test(t) ? s.n.toLowerCase() === t : String(s.c) === t)
          : s.name.toLowerCase().includes(t) || s.cat.toLowerCase().includes(t)
      );
    }
    const g = [];
    for (const s of list) {
      let last = g[g.length - 1];
      if (!last || last.c !== s.c) g.push((last = { c: s.c, cat: s.cat, items: [] }));
      last.items.push(s);
    }
    return g;
  }, [q]);

  function pick(s) {
    onChange(s.n, s.n === "21B" ? variant || null : null);
    setOpen(false);
    setQ("");
  }

  if (selected && !open) {
    return (
      <div className="style-picked">
        <button type="button" className="style-chip" onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); }}>
          <span className="style-num">{selected.n}</span>
          <span className="style-name">{selected.name}</span>
          <span className="style-change">Change</span>
        </button>
        {selected.n === "21B" && (
          <div className="variants" role="radiogroup" aria-label="Specialty IPA variant">
            {SPECIALTY_IPA_VARIANTS.map((v) => (
              <button key={v} type="button" role="radio" aria-checked={variant === v}
                className={"pill" + (variant === v ? " on" : "")}
                onClick={() => onChange("21B", variant === v ? null : v)}>{v}</button>
            ))}
          </div>
        )}
        <StyleCard s={selected} variant={variant} />
      </div>
    );
  }

  return (
    <div className="picker">
      <input
        ref={inputRef}
        className="field"
        placeholder="Type a number like 21, or a name like hazy"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setOpen(true)}
        aria-label="BJCP style"
      />
      {open && (
        <div className="picker-list" role="listbox">
          {groups.length === 0 && <p className="muted pad">No style matches "{q}". Try a category number from 1 to 34.</p>}
          {groups.map((g) => (
            <div key={g.c}>
              <div className="picker-cat">{g.c}. {g.cat}</div>
              {g.items.map((s) => (
                <button key={s.n} type="button" role="option" aria-selected={value === s.n} className="picker-item" onClick={() => pick(s)}>
                  <span className="style-num">{s.n}</span> {s.name}
                </button>
              ))}
            </div>
          ))}
          {selected && <button type="button" className="link pad" onClick={() => setOpen(false)}>Keep {selected.n} {selected.name}</button>}
        </div>
      )}
    </div>
  );
}

function range(a, b, d = 0) {
  if (a == null || b == null) return null;
  return `${a.toFixed(d)} to ${b.toFixed(d)}`;
}

function StyleCard({ s, variant }) {
  const [open, setOpen] = useState(false);
  const st = s.st;
  return (
    <div className="style-card">
      <button type="button" className="link" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Hide style guide" : "Show style guide"}
      </button>
      {open && (
        <div className="style-body">
          {s.oi ? <p>{s.oi}</p> : <p className="muted">Parameters and descriptions differ by variant{variant ? ` (${variant})` : ""}. See the full guidelines at bjcp.org.</p>}
          {st && (
            <dl className="stats">
              <div><dt>OG</dt><dd>{range(st.ogmin, st.ogmax, 3)}</dd></div>
              <div><dt>FG</dt><dd>{range(st.fgmin, st.fgmax, 3)}</dd></div>
              <div><dt>IBU</dt><dd>{range(st.ibumin, st.ibumax)}</dd></div>
              <div><dt>SRM</dt><dd>{range(st.srmmin, st.srmmax)}</dd></div>
              <div><dt>ABV</dt><dd>{range(st.abvmin, st.abvmax, 1)}%</dd></div>
            </dl>
          )}
          {!st && s.oi && <p className="muted small">Parameters vary with the base style.</p>}
          <a className="small" href={`https://www.bjcp.org/style/2021/${s.c}`} target="_blank" rel="noreferrer">Full description at bjcp.org</a>
        </div>
      )}
    </div>
  );
}
