import { useEffect, useState } from "react";
import { getAt, setAt } from "../lib/bind";
import { blankEntry, totalOf, maxOf, bandFor, validate } from "../lib/scoring";
import { STYLES } from "../data/bjcpStyles";
import { TextBlock, DateBlock, TextAreaBlock, PhotoBlock, LocationBlock, PillsBlock, HeatBlock, YesNoBlock, SlidersBlock, Stamp, NumberBlock, AgeBlock, MultiPillsBlock } from "../blocks/basic";
import WhiskeyPicker from "../blocks/WhiskeyPicker";
import { styleById } from "../data/whiskeyStyles";
import { contactHref } from "../config";
import StylePicker from "../blocks/StylePicker";
import Sheet from "../blocks/Sheet";
import FlawsDrawer from "../blocks/FlawsDrawer";

// Renders any topic's form from its config.
export default function ScoreForm({ topic, initial, onSave, onCancel }) {
  const [e, setE] = useState(() => initial || blankEntry(topic));
  const [flawsOpen, setFlawsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [tried, setTried] = useState(false);
  const editing = !!initial?.id;

  useEffect(() => { setE(initial || blankEntry(topic)); setTried(false); setMsg(""); }, [initial, topic]);

  const set = (path, v) => setE((cur) => setAt(cur, path, v));
  const patch = (obj) => setE((cur) => ({ ...cur, ...obj }));

  const total = totalOf(topic, e);
  const max = maxOf(topic);
  const band = bandFor(topic, total);
  const sheet = topic.form.find((b) => b.type === "sheet");
  const flawCount = sheet ? Object.keys(getAt(e, sheet.flawsBind) || {}).length : 0;
  const problems = validate(topic, e);
  const styleBlock = topic.form.find((b) => b.type === "stylePicker");
  const st = styleBlock ? STYLES.find((s) => s.n === getAt(e, styleBlock.numberBind))?.st : null;
  const srmRange = st?.srmmin != null ? [st.srmmin, st.srmmax] : null;
  const picker = topic.form.find((b) => b.type === "whiskeyPicker");
  const family = picker ? getAt(e, picker.familyBind) : null;
  const pickedStyle = picker ? styleById(getAt(e, picker.styleBind)) : null;
  const colorNote = pickedStyle ? (pickedStyle.coloring ? "Caramel coloring is allowed in this style, so color isn't a reliable sign of age." : "No coloring allowed in this style: the color is all barrel.") : null;
  const anyScored = sheet ? sheet.sections.some((s) => getAt(e, sheet.bind)?.[s.key]?.score != null) : true;

  async function save() {
    setTried(true);
    if (problems.length) {
      setMsg(problems.join(". ") + ".");
      if (sheet) {
        const first = sheet.sections.find((s) => getAt(e, sheet.bind)?.[s.key]?.score == null);
        const textMissing = topic.form.find((b) => b.required && !String(getAt(e, b.bind) || "").trim());
        if (textMissing) window.scrollTo({ top: 0, behavior: "smooth" });
        else if (first) document.getElementById(`section-${first.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setBusy(true); setMsg("");
    try {
      await onSave({ ...e, total });
      if (!editing) { setE(blankEntry(topic)); setTried(false); }
    } catch (x) { setMsg(x.message || "Couldn't save. Check the connection and try again."); }
    finally { setBusy(false); }
  }

  // Lay out blocks: grouped blocks sit beside a photo, "half" blocks pair up.
  const out = [];
  const blocks = topic.form;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.group) continue;
    if (b.type === "photo" && b.layout === "beside-next") {
      const grouped = blocks.filter((x) => x.group === "photo");
      out.push(
        <section key={i} className="block">
          <div className="photo-row">
            <PhotoBlock b={b} compact value={getAt(e, b.bind)} onChange={(v) => set(b.bind, v)} />
            <div className="photo-fields">{grouped.map((g, j) => <div key={j}>{renderField(g)}</div>)}</div>
          </div>
        </section>
      );
      continue;
    }
    if (b.half && blocks[i + 1]?.half) {
      out.push(<section key={i} className="block"><div className="halves"><div>{renderField(b)}</div><div>{renderField(blocks[i + 1])}</div></div></section>);
      i++;
      continue;
    }
    if (b.type === "sheet") {
      out.push(<Sheet key={i} b={b} value={getAt(e, b.bind)} srmRange={b.srmFromStyle ? srmRange : null} family={family} colorNote={colorNote} onChange={(v) => set(b.bind, v)} />);
      continue;
    }
    if (b.type === "stamp") {
      out.push(<section key={i} className="block center"><Stamp total={total} max={max} band={band} /></section>);
      continue;
    }
    out.push(<section key={i} className="block">{renderField(b)}</section>);
  }

  // Called as a function (not a component) so inputs keep focus while typing.
  function renderField(b) {
    const v = getAt(e, b.bind);
    switch (b.type) {
      case "text": return <TextBlock b={b} value={v} onChange={(x) => set(b.bind, x)} />;
      case "date": return <DateBlock b={b} value={v} onChange={(x) => set(b.bind, x)} />;
      case "textarea": return <TextAreaBlock b={b} value={v} onChange={(x) => set(b.bind, x)} />;
      case "photo": return <PhotoBlock b={b} value={v} onChange={(x) => set(b.bind, x)} />;
      case "location": return <LocationBlock b={b} entry={e} onPatch={patch} />;
      case "pills": return <PillsBlock b={b} value={v} otherValue={b.other ? getAt(e, b.other.bind) : undefined} onChange={(x) => set(b.bind, x)} onOther={b.other ? (x) => set(b.other.bind, x) : undefined} />;
      case "heat": return <HeatBlock b={b} value={v} onChange={(x) => set(b.bind, x)} />;
      case "yesno": return <YesNoBlock b={b} value={v} onChange={(x) => set(b.bind, x)} />;
      case "sliders": return <SlidersBlock b={b} value={v} onChange={(x) => set(b.bind, x)} />;
      case "number": return <NumberBlock b={b} value={v} onChange={(x) => set(b.bind, x)} />;
      case "age": return (
        <AgeBlock b={b} years={v} nas={getAt(e, "answers.nas")}
          onChange={({ years, nas, label }) => setE((cur) => setAt(setAt(setAt(cur, b.bind, years), "answers.nas", nas), "answers.age_label", label))} />
      );
      case "multipills": return (
        <MultiPillsBlock b={b} value={v} detailValue={b.detail ? getAt(e, b.detail.bind) : undefined}
          onChange={(x) => set(b.bind, x)} onDetail={(x) => set(b.detail.bind, x)} />
      );
      case "whiskeyPicker": return (
        <WhiskeyPicker b={b} family={getAt(e, b.familyBind)} styleId={getAt(e, b.styleBind)} region={getAt(e, b.regionBind)} country={getAt(e, b.countryBind)}
          correctionHref={topic.correctionLink ? contactHref(topic).replace(/subject=[^&]*/, "subject=" + encodeURIComponent(`${topic.name} correction: `)) : null}
          onChange={({ family: f, styleId, region, country }) => setE((cur) => {
            let next = setAt(cur, b.familyBind, f || null);
            next = setAt(next, b.styleBind, styleId || null);
            next = setAt(next, b.regionBind, region || null);
            next = setAt(next, b.countryBind, country || null);
            const st = styleById(styleId);
            const name = st ? (st.country && country ? `${st.name} (${country})` : st.name) : null;
            return setAt(next, b.bind, name);
          })} />
      );
      case "stylePicker": return (
        <div>
          <div className="lbl">{b.label}</div>
          <StylePicker value={getAt(e, b.numberBind)} variant={getAt(e, b.variantBind)}
            onChange={(n, variant) => setE((cur) => {
              let next = setAt(cur, b.numberBind, n);
              next = setAt(next, b.variantBind, variant);
              return setAt(next, b.bind, STYLES.find((s) => s.n === n)?.name || null);
            })} />
        </div>
      );
      default: return null;
    }
  }

  return (
    <div className="form">
      {editing && <p className="editing-note">Editing {e.item_name || "entry"}</p>}
      {out}
      {msg && <p className="msg" role="alert">{msg}</p>}
      {editing && <button type="button" className="link pad" onClick={onCancel}>Cancel editing</button>}

      <div className="scorebar">
        {sheet && (
          <button type="button" className={"flaw-btn" + (flawCount ? " has" : "")} onClick={() => setFlawsOpen(true)}>
            Flaws{flawCount ? ` · ${flawCount}` : ""}
          </button>
        )}
        <div className="tally" aria-live="polite">
          <span className="tally-num">{total}</span><span className="tally-max">/{max}</span>
          <span className="tally-band">{anyScored ? band.label : "Not scored"}</span>
        </div>
        <button type="button" className="btn" onClick={save} disabled={busy} aria-describedby={tried && problems.length ? "save-hint" : undefined}>
          {busy ? "Saving" : editing ? "Save changes" : "Save"}
        </button>
      </div>
      {tried && problems.length > 0 && <p id="save-hint" className="sr">{problems.join(". ")}</p>}

      {sheet && (
        <FlawsDrawer open={flawsOpen} flaws={getAt(e, sheet.flawsBind) || {}} list={sheet.flaws} levels={sheet.flawLevels}
          onChange={(f) => set(sheet.flawsBind, f)} onClose={() => setFlawsOpen(false)} />
      )}
    </div>
  );
}
