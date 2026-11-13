import { useState } from "react";
import { FAMILIES, STYLES, SCOTCH_REGIONS, styleById } from "../data/whiskeyStyles";

// "What are you drinking?" Family first, then the style, then region (Scotch) or country (world).
export default function WhiskeyPicker({ b, family, styleId, region, country, onChange, correctionHref }) {
  const style = styleById(styleId);
  const [open, setOpen] = useState(false);
  const styles = STYLES.filter((s) => s.family === family);
  const set = (patch) => onChange({ family, styleId, region, country, ...patch });

  return (
    <div className="wp">
      <div className="lbl">{b.label}</div>
      <div className="wp-families" role="radiogroup" aria-label="Whiskey family">
        {FAMILIES.map((f) => (
          <button key={f.key} type="button" role="radio" aria-checked={family === f.key}
            className={"wp-family" + (family === f.key ? " on" : "")}
            onClick={() => (family === f.key ? null : set({ family: f.key, styleId: f.key === "world" ? "world" : null, region: null, country: f.key === "world" ? country : null }))}>
            <span className="wp-family-name">{f.label}</span>
            <span className="wp-family-hint">{f.hint}</span>
          </button>
        ))}
      </div>

      {family && family !== "world" && (
        <>
          <div className="lbl">Style</div>
          <div className="pills" role="radiogroup" aria-label="Style">
            {styles.map((s) => (
              <button key={s.id} type="button" role="radio" aria-checked={styleId === s.id}
                className={"pill" + (styleId === s.id ? " on" : "")}
                onClick={() => set({ styleId: styleId === s.id ? null : s.id, region: s.regions ? region : null })}>{s.name}</button>
            ))}
          </div>
        </>
      )}

      {style?.regions && (
        <>
          <div className="lbl">Region <span className="lbl-opt">(optional)</span></div>
          <div className="pills" role="radiogroup" aria-label="Scotch region">
            {SCOTCH_REGIONS.map((r) => (
              <button key={r.key} type="button" role="radio" aria-checked={region === r.key}
                className={"pill" + (region === r.key ? " on" : "")}
                onClick={() => set({ region: region === r.key ? null : r.key })}>{r.key}</button>
            ))}
          </div>
        </>
      )}

      {style?.country && (
        <label className="lbl">Country
          <input className="field" value={country || ""} placeholder="e.g. Taiwan, India, England" onChange={(e) => set({ country: e.target.value })} />
        </label>
      )}

      {style && (
        <div className="style-card">
          <button type="button" className="link" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? "Hide style guide" : "Show style guide"}
          </button>
          {open && (
            <div className="style-body">
              <p className="wp-card-title">{style.name}{region ? `, ${region}` : ""}</p>
              <p className="wp-sub">What the rules require</p>
              <ul className="wp-rules">{style.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
              <p className="wp-sub">What to expect</p>
              <p>{style.notes}</p>
              {region && <p>{SCOTCH_REGIONS.find((r) => r.key === region)?.notes}</p>}
              <p className="small muted">
                {style.coloring ? "Caramel coloring is allowed in this style, so color isn't a reliable sign of age." : "No added coloring is allowed in this style: the color all comes from the barrel."}
              </p>
              <p className="small">
                {style.source && <>Source: <a href={style.source.href} target="_blank" rel="noreferrer">{style.source.label}</a></>}
                {correctionHref && <>{style.source ? " · " : ""}<a href={`${correctionHref}${encodeURIComponent(`${style.name}${region ? `, ${region}` : ""}`)}`}>Suggest a correction</a></>}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
