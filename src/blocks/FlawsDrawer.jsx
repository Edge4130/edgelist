import { useEffect, useRef, useState } from "react";
import Tip from "./Tip";

// Slide-over panel. Marks L/M/H per flaw; closing returns to the same spot on the form.
export default function FlawsDrawer({ open, flaws, list, levels, onChange, onClose }) {
  const [tip, setTip] = useState(null);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const count = Object.keys(flaws).length;
  return (
    <>
      <div className={"scrim" + (open ? " show" : "")} onClick={onClose} aria-hidden="true" />
      <aside className={"drawer" + (open ? " show" : "")} aria-label="Flaws for style" aria-hidden={!open} inert={!open}>
        <header className="drawer-head">
          <h2>Flaws</h2>
          <span className="muted small">{count ? `${count} marked` : "Mark any that apply"}</span>
          <button ref={closeRef} type="button" className="btn-quiet" onClick={onClose}>Back to sheet</button>
        </header>
        <div className="drawer-body">
          {list.map((f) => {
            const v = flaws[f.key];
            return (
              <div key={f.key} className="flaw">
                <div className="flaw-main">
                  <button type="button" className="row-label" title={`${f.tip} ${f.cause}`} aria-expanded={tip === f.key} onClick={() => setTip(tip === f.key ? null : f.key)}>
                    {f.label}
                  </button>
                  <div className="seg seg-flaw" role="radiogroup" aria-label={f.label}>
                    {levels.map((l) => (
                      <button key={l} type="button" role="radio" aria-checked={v === l}
                        className={"seg-btn" + (v === l ? " on" : "")}
                        onClick={() => {
                          const next = { ...flaws };
                          if (v === l) delete next[f.key]; else next[f.key] = l;
                          onChange(next);
                        }}>
                        <span className="seg-txt">{l}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {tip === f.key && <Tip tip={f.tip} tone="flaw"><p className="tip-how"><span className="tip-k">Usual cause:</span> {f.cause}</p></Tip>}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
