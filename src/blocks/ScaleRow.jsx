import { useState } from "react";
import Tip, { tipText } from "./Tip";
import TagBox from "./TagBox";

// One scoresheet characteristic: label (tap for the criteria), a segmented scale, an off-style flag,
// and optional descriptor tags.
export default function ScaleRow({ row, value, off, tags, srmRange, descriptors = {}, spotlight, note, onChange, onToggleOff, onTags }) {
  const [open, setOpen] = useState(false);
  const ends = row.ends;
  const inRange = (i) => srmRange && row.srm && row.srm[i] >= srmRange[0] - 1 && row.srm[i] <= srmRange[1] + 1;

  return (
    <div className={"row" + (row.wide ? " row-wide" : "") + (spotlight ? " row-spot" : "")}>
      <div className="row-main">
        <button type="button" className="row-label" title={tipText(row.tip)} aria-expanded={open} onClick={() => setOpen(!open)}>
          {row.label}
        </button>
        <div className={"seg" + (ends ? " seg-ends" : "") + (row.swatch ? " seg-swatch" : "")} role="radiogroup" aria-label={row.label}>
          {row.scale.map((opt, i) => {
            const active = value === i;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={opt ? (row.srm ? `${opt}, about SRM ${row.srm[i]}` : opt) : `${row.label} ${i + 1} of ${row.scale.length}`}
                title={row.srm ? `${opt}, SRM ~${row.srm[i]}` : undefined}
                className={"seg-btn" + (active ? " on" : "") + (inRange(i) ? " in-range" : "")}
                style={row.swatch ? { "--sw": row.swatch[i] } : undefined}
                onClick={() => onChange(active ? null : i)}
              >
                {row.swatch && <span className="swatch" />}
                {!ends && !row.swatch && <span className="seg-txt">{opt}</span>}
                {ends && <span className="dot" />}
              </button>
            );
          })}
        </div>
        <button type="button" className={"off" + (off ? " on" : "")} aria-pressed={!!off} title="Inappropriate for style" onClick={onToggleOff}>
          <span aria-hidden="true">✕</span>
          <span className="sr">Inappropriate for style</span>
        </button>
      </div>
      {row.swatch && (
        <div className="ends-labels">
          <span>{value != null ? (row.srm ? `${row.scale[value]}, SRM ~${row.srm[value]}` : row.scale[value]) : srmRange ? "Dots mark this style's color range" : ""}</span>
        </div>
      )}
      {ends && (
        <div className="ends-labels" aria-hidden="true">
          <span>{row.scale[0]}</span><span>{row.scale[row.scale.length - 1]}</span>
        </div>
      )}
      {note && <p className="small muted row-note">{note}</p>}
      {open && (
        <Tip tip={row.tip}>
          <p className="tip-off">✕ marks it inappropriate for the style.</p>
        </Tip>
      )}
      {row.tags && <TagBox label={row.label} value={tags || []} suggestions={descriptors[row.tags] || []} onChange={onTags} />}
    </div>
  );
}
