import { useState } from "react";
import { Field, Select } from "./fields";
import { slidersTemplate, sheetTemplate } from "./templates";

export default function NewTopic({ topics, onCreate, onClose }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [start, setStart] = useState("sliders");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const autoSlug = (n) => n.toLowerCase().replace(/list$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const s = slugTouched ? slug : autoSlug(name);

  async function create(e) {
    e.preventDefault();
    if (!name.trim()) return setErr("Give it a name.");
    if (!/^[a-z0-9][a-z0-9-]{1,30}$/.test(s)) return setErr("The key needs 2 to 31 lowercase letters, numbers or hyphens.");
    let config;
    if (start === "sliders") config = slidersTemplate(name.trim(), s);
    else if (start === "sheet") config = sheetTemplate(name.trim(), s);
    else {
      const src = topics.find((t) => t.slug === start);
      config = { ...JSON.parse(JSON.stringify(src.draft)), slug: s, name: name.trim() };
    }
    setBusy(true); setErr("");
    try { await onCreate(s, config); } catch (x) { setErr(x.message); setBusy(false); }
  }

  return (
    <div className="a-modal" role="dialog" aria-label="New topic" onClick={onClose}>
      <form className="a-modal-card" onClick={(e) => e.stopPropagation()} onSubmit={create}>
        <h2>New topic</h2>
        <Field label="Name" value={name} placeholder="e.g. WhiskeyList" onChange={setName} />
        <Field label="Topic key" value={s} onChange={(v) => { setSlug(v.toLowerCase()); setSlugTouched(true); }}
          help="Lowercase, no spaces. This becomes VITE_TOPIC in the new Vercel project, and can't change later." />
        <Select label="Start from" value={start} onChange={setStart} options={[
          ["sliders", "Blank sliders scorecard (like WingList)"],
          ["sheet", "Blank judging scoresheet (like BeerList)"],
          ...topics.map((t) => [t.slug, `A copy of ${t.draft.name}`]),
        ]} />
        {err && <p className="a-err">{err}</p>}
        <div className="a-actions">
          <button type="button" className="ab ab-quiet" onClick={onClose}>Cancel</button>
          <button className="ab" disabled={busy}>{busy ? "Creating" : "Create draft"}</button>
        </div>
      </form>
    </div>
  );
}
