import { useMemo, useState } from "react";
import { getAt } from "../lib/bind";
import { scoringBlock, maxOf, bandFor } from "../lib/scoring";

const SORTS = [["top", "Top rated"], ["recent", "Most recent"], ["name", "Name"]];

function fmtDate(p) {
  const d = p.entry_date || p.created_at;
  if (!d) return "";
  const dt = new Date(d.length === 10 ? d + "T12:00:00" : d);
  return isNaN(dt) ? "" : dt.toLocaleDateString();
}

function token(p, t) {
  switch (t) {
    case "maker": return p.maker;
    case "place": return p.place_name || p.address;
    case "reviewer": return p.reviewer;
    case "date": return fmtDate(p);
    case "styleFull": {
      const n = p.answers?.style_number;
      const v = p.answers?.style_variant;
      return p.style ? `${n ? n + " " : ""}${p.style}${v ? `, ${v}` : ""}` : "";
    }
    default: return getAt(p, t);
  }
}

export default function LogView({ topic, entries, isOwner, onEdit, onDelete, onScore }) {
  const [sort, setSort] = useState(topic.list.defaultSort || "recent");
  const [openId, setOpenId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const max = maxOf(topic);

  const list = useMemo(() => {
    const l = [...entries];
    if (sort === "top") l.sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
    else if (sort === "name") l.sort((a, b) => (a.item_name || "").localeCompare(b.item_name || ""));
    else l.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
    return l;
  }, [entries, sort]);

  if (!entries.length) {
    return (
      <div className="empty">
        <p>No {topic.itemNoun}s yet.</p>
        <button type="button" className="btn" onClick={onScore}>Score your first one</button>
      </div>
    );
  }

  const swatchRow = topic.list.swatch && topic.form.find((b) => b.type === "sheet")?.sections
    .find((s) => s.key === topic.list.swatch.section)?.rows.find((r) => r.key === topic.list.swatch.row);

  return (
    <div className="log">
      <div className="log-tools">
        <span className="small on-bg-muted">{entries.length} {entries.length === 1 ? topic.itemNoun : topic.itemNoun + "s"}</span>
        <div className="pills">
          {SORTS.map(([k, label]) => (
            <button key={k} type="button" className={"pill pill-bg" + (sort === k ? " on" : "")} aria-pressed={sort === k} onClick={() => setSort(k)}>{label}</button>
          ))}
        </div>
      </div>
      {list.map((p) => {
        const band = bandFor(topic, p.total ?? 0);
        const open = openId === p.id;
        const swatchIdx = swatchRow ? getAt(p, topic.list.swatch.sections)?.[topic.list.swatch.section]?.rows?.[topic.list.swatch.row] : null;
        return (
          <article key={p.id} className={"entry" + (open ? " open" : "")}>
            <div className="entry-head">
              {swatchRow && <span className="entry-glass" style={{ background: swatchIdx != null ? swatchRow.swatch[swatchIdx] : "var(--line)" }} aria-hidden="true" />}
              {p.photo ? (
                <button type="button" className="entry-thumb-btn" onClick={() => setPhoto(p.photo)} aria-label={`Enlarge photo of ${p.item_name}`}>
                  <img className="entry-thumb" src={p.photo} alt="" />
                </button>
              ) : (
                <span className="ring-wrap"><span className="ring" style={{ borderColor: band.color, color: band.color }}><b>{p.total ?? 0}</b><small>/{max}</small></span><small className="ring-band" style={{ color: band.color }}>{band.label}</small></span>
              )}
              <button type="button" className="entry-main" aria-expanded={open} onClick={() => setOpenId(open ? null : p.id)}>
                <span className="entry-name">{p.item_name}</span>
                {topic.list.lines.map((line, i) => {
                  const txt = line.map((t) => token(p, t)).filter(Boolean).join(" · ");
                  return txt ? <span key={i} className="entry-meta">{txt}</span> : null;
                })}
                {topic.list.badges.length > 0 && (
                  <span className="badges">
                    {topic.list.badges.map((bd, i) => {
                      const v = getAt(p, bd.bind);
                      if (bd.kind === "yesno") return v == null ? null : <span key={i} className={"badge " + (v ? "good" : "bad")}>{v ? "✓" : "✕"} {bd.label}</span>;
                      return v ? <span key={i} className={"badge " + bd.tone}>{v}</span> : null;
                    })}
                  </span>
                )}
                {topic.list.commentsIn === "card" && p.comments && <span className="entry-quote">“{p.comments}”</span>}
              </button>
              {p.photo && <span className="entry-score" style={{ color: band.color }}><b>{p.total ?? 0}</b><small>{band.label}</small></span>}
            </div>
            {open && <Detail topic={topic} p={p} isOwner={isOwner} onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} onPhoto={() => setPhoto(p.photo)} />}
          </article>
        );
      })}
      {photo && (
        <div className="lightbox" role="dialog" aria-label="Photo" onClick={() => setPhoto(null)}>
          <img src={photo} alt="Full size" />
          <button type="button" className="btn-quiet light" onClick={() => setPhoto(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

function Detail({ topic, p, isOwner, onEdit, onDelete, onPhoto }) {
  const sb = scoringBlock(topic);
  const max = maxOf(topic);
  return (
    <div className="detail">
      {topic.list.photoInDetail && p.photo && <button type="button" className="detail-photo" onClick={onPhoto}><img src={p.photo} alt="Photo" /></button>}
      {topic.list.detailExtras.map((x, i) => {
        const v = getAt(p, x.bind);
        return v ? <p key={i} className="small muted">{x.label}: {v}</p> : null;
      })}
      {sb?.type === "sliders" && (
        <div className="bars">
          {sb.rows.map((r) => {
            const v = getAt(p, sb.bind)?.[r.key] ?? 0;
            return (
              <div key={r.key} className="bar-row">
                <span className="bar-label">{r.label}</span>
                <span className="bar-track"><span className="bar-fill" style={{ width: `${(v / sb.max) * 100}%` }} /></span>
                <span className="bar-val">{v}</span>
              </div>
            );
          })}
        </div>
      )}
      {sb?.type === "sheet" && <SheetDetail sb={sb} p={p} max={max} topic={topic} />}
      {topic.list.commentsIn === "detail" && p.comments && <p className="detail-comments">{p.comments}</p>}
      {isOwner && (
        <div className="detail-actions">
          <button type="button" className="btn-quiet" onClick={onEdit}>Edit</button>
          <button type="button" className="btn-quiet danger" onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

function SheetDetail({ sb, p, max, topic }) {
  const sections = getAt(p, sb.bind) || {};
  const flaws = Object.entries(getAt(p, sb.flawsBind) || {});
  return (
    <>
      <table className="detail-table">
        <tbody>
          {sb.sections.map((s) => {
            const sec = sections[s.key] || {};
            const notes = s.rows
              .filter((r) => sec.rows?.[r.key] != null || sec.off?.[r.key] || sec.tags?.[r.key]?.length)
              .map((r) => {
                const v = sec.rows?.[r.key];
                const txt = v == null ? "" : r.ends ? `${v + 1}/${r.scale.length}` : r.scale[v];
                const tags = sec.tags?.[r.key];
                return `${r.label} ${txt}${tags?.length ? ` (${tags.join(", ").toLowerCase()})` : ""}${sec.off?.[r.key] ? ", off-style" : ""}`.trim();
              });
            return (
              <tr key={s.key}>
                <th>{s.label}</th>
                <td className="detail-notes">{notes.join(", ") || <span className="muted">No marks</span>}</td>
                <td className="num">{sec.score ?? "–"}/{s.max}</td>
              </tr>
            );
          })}
          <tr className="detail-total"><th>Total</th><td>{bandFor(topic, p.total ?? 0).label}</td><td className="num">{p.total ?? 0}/{max}</td></tr>
        </tbody>
      </table>
      {flaws.length > 0 && <p className="small"><b>Flaws:</b> {flaws.map(([k, l]) => `${sb.flaws.find((f) => f.key === k)?.label || k} (${l})`).join(", ")}</p>}
    </>
  );
}
