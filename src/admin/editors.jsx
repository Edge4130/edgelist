import { Field, Area, Toggle, Select, ListField, ColorField, ListEditor, slugify, uniqueKey } from "./fields";

const COLOR_LABELS = [
  ["header", "Header background"], ["headerInk", "Header text"], ["headerMuted", "Header muted text"], ["headerLine", "Header borders"],
  ["headerAccent", "Header highlight (score, active tab)"],
  ["bg", "Page background"], ["bgInk", "Text on page"], ["bgMuted", "Muted text on page"],
  ["card", "Card background"], ["ink", "Card text"], ["muted", "Muted card text"], ["line", "Lines and borders"], ["field", "Input background"],
  ["accent", "Accent (buttons, selected)"], ["accentInk", "Text on accent"], ["accentSoft", "Soft accent (tips, tags)"],
  ["title", "Section titles"], ["link", "Links"], ["danger", "Danger and flaws"], ["dangerSoft", "Soft danger"], ["good", "Positive (yes, good scores)"],
];

export function BasicsTab({ t, set }) {
  return (
    <div className="tab-body">
      <Field label="App name" value={t.name} onChange={(v) => set({ ...t, name: v })} />
      <Field label="Tagline" value={t.tagline} onChange={(v) => set({ ...t, tagline: v })} help="Shown under the name in the header." />
      <Field label="What one entry is called" value={t.itemNoun} onChange={(v) => set({ ...t, itemNoun: v })} help={`Used in the log, like "3 ${t.itemNoun || "entry"}s".`} width="320px" />
      <Field label="Favicon emoji" value={t.favicon} onChange={(v) => set({ ...t, favicon: v })} width="160px" />
      <Field label="Contact email" value={t.contactEmail} placeholder="Daniel.Edgerton@gmail.com (default)" onChange={(v) => set({ ...t, contactEmail: v || undefined })} help="Leave blank to use the EdgeList default." />
      <Field label="Topic key" value={t.slug} readOnly help="Fixed. The Vercel project for this app uses VITE_TOPIC with this value." width="320px" />
    </div>
  );
}

export function BrandTab({ t, set }) {
  const th = t.theme;
  const setTheme = (patch) => set({ ...t, theme: { ...th, ...patch } });
  return (
    <div className="tab-body">
      <h3>Logo</h3>
      <div className="logo-row">
        <span className="logo-preview" style={{ background: th.light.header, color: th.light.headerInk }} dangerouslySetInnerHTML={{ __html: th.logo }} />
        <Area label="Logo SVG" mono rows={4} value={th.logo} onChange={(v) => setTheme({ logo: v })} help="Paste SVG code. It sits on the header color." />
      </div>
      <Select label="Total score style" value={th.totalStyle} onChange={(v) => setTheme({ totalStyle: v })} options={[["bar", "Score bar only"], ["stamp", "Stamp (also add a Stamp block to the form)"]]} />
      <h3>Fonts</h3>
      <Field label="Headings font" value={th.fonts.display} onChange={(v) => setTheme({ fonts: { ...th.fonts, display: v } })} />
      <Field label="Body font" value={th.fonts.body} onChange={(v) => setTheme({ fonts: { ...th.fonts, body: v } })} />
      <Field label="Numbers font" value={th.fonts.mono} onChange={(v) => setTheme({ fonts: { ...th.fonts, mono: v } })} />
      <Area label="Google Fonts link" mono rows={2} value={th.fontsHref} onChange={(v) => setTheme({ fontsHref: v })} help="The stylesheet URL from fonts.google.com that loads the fonts above." />
      <h3>Colors</h3>
      <div className="color-grid">
        {COLOR_LABELS.map(([k, label]) => (
          <ColorField key={k} label={label} value={th.light[k]} onChange={(v) => setTheme({ light: { ...th.light, [k]: v } })} />
        ))}
      </div>
      <h3>Dark mode</h3>
      <Toggle label="Use different colors when the phone is in dark mode" value={!!th.dark}
        onChange={(on) => setTheme({ dark: on ? { bg: "#141A17", bgInk: "#E8ECE7", bgMuted: "#9BA59E", card: "#1C2420", ink: "#E8ECE7", muted: "#9BA59E", line: "#33403A", field: "#141A17" } : null })} />
      {th.dark && (
        <div className="color-grid">
          {COLOR_LABELS.filter(([k]) => !k.startsWith("header")).map(([k, label]) => (
            <ColorField key={k} label={`${label} (dark)`} value={th.dark[k] ?? ""} onChange={(v) => setTheme({ dark: { ...th.dark, [k]: v || undefined } })} />
          ))}
        </div>
      )}
    </div>
  );
}

const TYPE_LABELS = { text: "Text", date: "Date", photo: "Photo", location: "Location", pills: "Choices", heat: "Heat gauge", yesno: "Yes / No", textarea: "Long text", stamp: "Score stamp", stylePicker: "Style picker", sliders: "Scoring", sheet: "Scoring" };
const COLUMNS = { text: [["maker", "Maker (brewery, distillery...)"], ["reviewer", "Reviewer name"]], textarea: [["comments", "Comments"]], pills: [["style", "Style"]] };

function customKeys(form) {
  return form.map((b) => b.bind).filter((x) => x?.startsWith("answers.")).map((x) => x.slice(8));
}

function newBlock(type, form) {
  const taken = customKeys(form);
  const label = { text: "New field", date: "Date", photo: "Photo", location: "Location", pills: "New choice", heat: "Heat", yesno: "New question?", textarea: "Notes" }[type];
  const custom = (l) => `answers.${uniqueKey(l, taken)}`;
  switch (type) {
    case "text": return { type, label, bind: custom(label), placeholder: "" };
    case "date": return { type, label, bind: "entry_date" };
    case "photo": return { type, label, bind: "photo" };
    case "location": return { type, label, placeholder: "Place or address" };
    case "pills": return { type, label, bind: custom(label), options: ["Option A", "Option B"], toggle: true };
    case "heat": return { type, label, bind: custom("heat"), levels: ["Mild", "Medium", "Hot", "Very Hot"], default: "Medium" };
    case "yesno": return { type, label, bind: custom(label) };
    case "textarea": return { type, label, bind: custom(label), placeholder: "" };
    case "stamp": return { type };
    default: return null;
  }
}

function SavedAs({ b, form, onChange }) {
  const cols = COLUMNS[b.type];
  if (!cols) return b.bind ? <p className="af-help">Saved as <code>{b.bind}</code></p> : null;
  const used = form.filter((x) => x !== b).map((x) => x.bind);
  const isCustom = b.bind?.startsWith("answers.");
  const opts = [...cols.filter(([c]) => !used.includes(c) || c === b.bind), ["__custom", "Its own field"]];
  return (
    <Select label="Saved as" value={isCustom ? "__custom" : b.bind}
      help="Changing this on a live topic hides answers already saved under the old setting."
      onChange={(v) => onChange({ ...b, bind: v === "__custom" ? `answers.${uniqueKey(b.label, customKeys(form))}` : v })}
      options={opts} />
  );
}

export function FormTab({ t, set }) {
  const form = t.form;
  const hasBesidePhoto = form.some((b) => b.type === "photo" && b.layout === "beside-next");
  const setForm = (f) => set({ ...t, form: f });
  return (
    <div className="tab-body">
      <p className="af-help">The fields on the Score screen, top to bottom. Scoring rows are edited in the Scoring tab.</p>
      <ListEditor items={form} onChange={setForm}
        title={(b) => <>{TYPE_LABELS[b.type] || b.type}<span className="le-sub">{b.type === "sliders" || b.type === "sheet" ? "edit in the Scoring tab" : b.label || ""}{b.bind === "item_name" ? " · item name" : ""}{b.required ? " · required" : ""}</span></>}
        canRemove={(b) => b.bind !== "item_name" && b.type !== "sliders" && b.type !== "sheet"}
        removeWarning={(b) => `Remove "${b.label || TYPE_LABELS[b.type]}"? Answers already saved stay in the database; they just stop showing.`}
        render={(b, up) => <BlockEditor b={b} up={up} form={form} hasBesidePhoto={hasBesidePhoto} />} />
      <div className="add-row">
        <span className="af-label">Add a field:</span>
        {["text", "textarea", "pills", "yesno", "heat", "date", "photo", "location", "stamp"].map((type) => (
          <button key={type} type="button" className="ab ab-quiet ab-sm" onClick={() => setForm([...form, newBlock(type, form)])}>{TYPE_LABELS[type]}</button>
        ))}
      </div>
    </div>
  );
}

function BlockEditor({ b, up, form, hasBesidePhoto }) {
  if (b.type === "sliders" || b.type === "sheet") return <p className="af-help">Edit rows and points in the Scoring tab.</p>;
  if (b.type === "stamp") return <p className="af-help">Shows the running total as a rotated stamp at this spot in the form.</p>;
  return (
    <>
      <Field label="Label" value={b.label} onChange={(v) => up({ ...b, label: v })} />
      {["text", "textarea", "location"].includes(b.type) && <Field label="Placeholder" value={b.placeholder} onChange={(v) => up({ ...b, placeholder: v })} />}
      {b.bind === "item_name" ? <p className="af-help">This is the item's name. It's always required and can't be removed.</p>
        : b.type === "text" && <Toggle label="Required to save" value={b.required} onChange={(v) => up({ ...b, required: v || undefined })} />}
      {["text", "date"].includes(b.type) && <Toggle label="Half width (pairs with the next half-width field)" value={b.half} onChange={(v) => up({ ...b, half: v || undefined })} />}
      {b.type === "text" && hasBesidePhoto && <Toggle label="Sit beside the photo" value={b.group === "photo"} onChange={(v) => up({ ...b, group: v ? "photo" : undefined })} />}
      {b.type === "photo" && <Select label="Layout" value={b.layout || "wide"} onChange={(v) => up({ ...b, layout: v === "wide" ? undefined : v })} options={[["wide", "Full width"], ["beside-next", "Small, with fields beside it"]]} />}
      {b.type === "pills" && (
        <>
          <ListField label="Options" value={b.options} onChange={(v) => up({ ...b, options: v })} />
          <Toggle label="Tap again to clear" value={b.toggle} onChange={(v) => up({ ...b, toggle: v || undefined })} />
          <Select label="Starts on" value={b.default ?? ""} onChange={(v) => up({ ...b, default: v || undefined })} options={[["", "Nothing selected"], ...b.options.map((o) => [o, o])]} />
          <Toggle label='Include an "Other" option with a text box' value={!!b.other}
            onChange={(v) => up({ ...b, other: v ? { option: "Other", bind: `answers.${slugify(b.label)}_other`, placeholder: "Describe it" } : undefined, options: v ? [...b.options.filter((o) => o !== "Other"), "Other"] : b.options.filter((o) => o !== "Other") })} />
          {b.other && <Field label='"Other" text box placeholder' value={b.other.placeholder} onChange={(v) => up({ ...b, other: { ...b.other, placeholder: v } })} />}
        </>
      )}
      {b.type === "heat" && (
        <>
          <ListField label="Levels, mildest first" value={b.levels} onChange={(v) => up({ ...b, levels: v })} />
          <Select label="Starts on" value={b.default ?? ""} onChange={(v) => up({ ...b, default: v || undefined })} options={[["", "Nothing selected"], ...b.levels.map((o) => [o, o])]} />
        </>
      )}
      {b.type === "stylePicker" && <p className="af-help">Uses the {b.dataset === "bjcp2021" ? "BJCP 2021" : b.dataset} style list.</p>}
      {b.bind !== "item_name" && <SavedAs b={b} form={form} onChange={up} />}
    </>
  );
}

export function ScoringTab({ t, set }) {
  const idx = t.form.findIndex((b) => b.type === "sliders" || b.type === "sheet");
  const s = t.form[idx];
  const up = (next) => set({ ...t, form: t.form.map((b, i) => (i === idx ? next : b)) });
  if (!s) return <div className="tab-body"><p>This topic has no scoring block.</p></div>;

  if (s.type === "sliders") {
    const max = s.rows.length * s.max;
    return (
      <div className="tab-body">
        <p className="af-help">Sliders, like WingList. Total possible: <b>{max}</b>. Check the Bands tab if you change this.</p>
        <div className="row3">
          <Field label="Lowest" type="number" value={s.min} onChange={(v) => up({ ...s, min: v })} />
          <Field label="Highest" type="number" value={s.max} onChange={(v) => up({ ...s, max: v })} />
          <Field label="Starts at" type="number" value={s.default} onChange={(v) => up({ ...s, default: v })} />
        </div>
        <h3>Categories</h3>
        <ListEditor items={s.rows} onChange={(rows) => up({ ...s, rows })}
          title={(r) => r.label}
          removeWarning={(r) => `Remove "${r.label}"? Scores already saved for it stay in the database but stop counting toward totals shown.`}
          newItem={() => ({ key: uniqueKey("category", s.rows.map((r) => r.key)), label: "New category", hint: "" })} addLabel="Add category"
          render={(r, upr) => (
            <>
              <Field label="Name" value={r.label} onChange={(v) => upr({ ...r, label: v })} />
              <Area label="Hint" rows={2} value={r.hint} onChange={(v) => upr({ ...r, hint: v })} />
              <p className="af-help">Saved as <code>{r.key}</code></p>
            </>
          )} />
      </div>
    );
  }

  const groups = Object.keys(s.descriptors || {});
  const total = s.sections.reduce((a, x) => a + (Number(x.max) || 0), 0);
  return (
    <div className="tab-body">
      <p className="af-help">Judging scoresheet, like BeerList. Total possible: <b>{total}</b>. Check the Bands tab if you change this.</p>
      <Toggle label="Every section must be scored before saving" value={s.requireAll} onChange={(v) => up({ ...s, requireAll: v })} />
      <h3>Sections</h3>
      <ListEditor items={s.sections} onChange={(sections) => up({ ...s, sections })}
        title={(sec) => <>{sec.label}<span className="le-sub">{sec.max} points · {sec.rows.length} rows</span></>}
        removeWarning={(sec) => `Remove the "${sec.label}" section? Saved scores stay in the database but stop showing.`}
        newItem={() => ({ key: uniqueKey("section", s.sections.map((x) => x.key)), label: "New section", max: 5, tip: { what: "", how: "" }, rows: [] })} addLabel="Add section"
        render={(sec, ups) => (
          <>
            <div className="row2">
              <Field label="Name" value={sec.label} onChange={(v) => ups({ ...sec, label: v })} />
              <Field label="Points" type="number" value={sec.max} onChange={(v) => ups({ ...sec, max: v })} />
            </div>
            <Area label="Tip: what it means" rows={2} value={sec.tip?.what} onChange={(v) => ups({ ...sec, tip: { ...sec.tip, what: v } })} />
            <Area label="Tip: how to tell" rows={2} value={sec.tip?.how} onChange={(v) => ups({ ...sec, tip: { ...sec.tip, how: v } })} />
            <h4>Rows</h4>
            <ListEditor items={sec.rows} onChange={(rows) => ups({ ...sec, rows })}
              title={(r) => <>{r.label}<span className="le-sub">{r.swatch ? "color swatches" : r.scale.filter(Boolean).join(" / ")}</span></>}
              newItem={() => ({ key: uniqueKey("row", sec.rows.map((x) => x.key)), label: "New row", scale: ["None", "L", "M", "H"], tip: { what: "", how: "" } })} addLabel="Add row"
              render={(r, upr) => (
                <>
                  <Field label="Name" value={r.label} onChange={(v) => upr({ ...r, label: v })} />
                  {r.swatch ? <p className="af-help">Color swatch row ({r.scale.length} colors). Edit swatches in code for now.</p> : (
                    <>
                      <ListField label="Scale" keepBlanks={r.ends} value={r.scale} onChange={(v) => upr({ ...r, scale: v })}
                        help={r.ends ? "Two-ended: only the first and last labels show; leave blanks between for the in-between dots." : "Separate with commas, lowest first."} />
                      <Toggle label="Two-ended scale (dots between two labels)" value={r.ends} onChange={(v) => upr({ ...r, ends: v || undefined })} />
                    </>
                  )}
                  <Select label="Descriptor tags" value={r.tags || ""} onChange={(v) => upr({ ...r, tags: v || undefined })} options={[["", "None"], ...groups.map((g) => [g, g])]} />
                  <Area label="Tip: what it means" rows={2} value={r.tip?.what} onChange={(v) => upr({ ...r, tip: { ...r.tip, what: v } })} />
                  <Area label="Tip: how to tell" rows={2} value={r.tip?.how} onChange={(v) => upr({ ...r, tip: { ...r.tip, how: v } })} />
                </>
              )} />
          </>
        )} />
      <h3>Descriptor tag lists</h3>
      <ListEditor items={groups.map((g) => ({ name: g, list: s.descriptors[g] }))}
        onChange={(arr) => up({ ...s, descriptors: Object.fromEntries(arr.map((x) => [x.name, x.list])) })}
        title={(g) => <>{g.name}<span className="le-sub">{g.list.length} tags</span></>}
        newItem={() => ({ name: uniqueKey("tags", groups), list: [] })} addLabel="Add tag list"
        render={(g, upg) => (
          <>
            <Field label="List name" value={g.name} onChange={(v) => upg({ ...g, name: slugify(v) })} help="Rows pick a list by this name." />
            <ListField label="Tags" value={g.list} onChange={(v) => upg({ ...g, list: v })} />
          </>
        )} />
      <h3>Flaws</h3>
      <ListEditor items={s.flaws} onChange={(flaws) => up({ ...s, flaws })}
        title={(f) => f.label}
        newItem={() => ({ key: uniqueKey("flaw", s.flaws.map((x) => x.key)), label: "New flaw", tip: "", cause: "" })} addLabel="Add flaw"
        render={(f, upf) => (
          <>
            <Field label="Name" value={f.label} onChange={(v) => upf({ ...f, label: v })} />
            <Area label="What it tastes like" rows={2} value={f.tip} onChange={(v) => upf({ ...f, tip: v })} />
            <Area label="Usual cause" rows={2} value={f.cause} onChange={(v) => upf({ ...f, cause: v })} />
          </>
        )} />
    </div>
  );
}

export function BandsTab({ t, set }) {
  const sorted = (bands) => [...bands].sort((a, b) => Number(b.min) - Number(a.min));
  return (
    <div className="tab-body">
      <p className="af-help">Labels for score ranges. Each band starts at its minimum and runs up to the next band. One must start at 0.</p>
      <ListEditor items={t.bands} onChange={(bands) => set({ ...t, bands })} startOpen
        title={(b) => <><span className="band-dot" style={{ background: b.color }} />{b.label}<span className="le-sub">from {b.min}</span></>}
        newItem={() => ({ min: 0, label: "New band", color: "#888888" })} addLabel="Add band"
        render={(b, upb) => (
          <>
            <div className="row2">
              <Field label="Label" value={b.label} onChange={(v) => upb({ ...b, label: v })} />
              <Field label="Starts at" type="number" value={b.min} onChange={(v) => upb({ ...b, min: v })} />
            </div>
            <ColorField label="Color" value={b.color} onChange={(v) => upb({ ...b, color: v })} />
            <Field label="Note (optional)" value={b.note} onChange={(v) => upb({ ...b, note: v || undefined })} />
          </>
        )} />
      <button type="button" className="ab ab-quiet ab-sm" onClick={() => set({ ...t, bands: sorted(t.bands) })}>Sort highest first</button>
    </div>
  );
}

const TOKENS = [["maker", "Maker"], ["styleFull", "Style"], ["place", "Place"], ["reviewer", "Reviewer"], ["date", "Date"]];

export function LogTab({ t, set }) {
  const L = t.list;
  const setL = (patch) => set({ ...t, list: { ...L, ...patch } });
  const fieldOptions = t.form.filter((b) => ["pills", "heat", "yesno", "text"].includes(b.type) && b.bind && !["item_name", "maker", "reviewer"].includes(b.bind)).map((b) => [b.bind, b.label]);
  const kindOf = (bind) => (t.form.find((b) => b.bind === bind)?.type === "yesno" ? "yesno" : undefined);
  return (
    <div className="tab-body">
      <Select label="Log sorts by default" value={L.defaultSort} onChange={(v) => setL({ defaultSort: v })} options={[["top", "Top rated"], ["recent", "Most recent"], ["name", "Name"]]} />
      <h3>Card lines</h3>
      <p className="af-help">Each line under the name shows the details you tick, joined with dots.</p>
      {L.lines.map((line, i) => (
        <div key={i} className="token-line">
          <span className="af-label">Line {i + 1}</span>
          {TOKENS.map(([k, label]) => (
            <label key={k} className="token">
              <input type="checkbox" checked={line.includes(k)} onChange={(e) => setL({ lines: L.lines.map((ln, j) => (j !== i ? ln : e.target.checked ? [...ln, k] : ln.filter((x) => x !== k))) })} />{label}
            </label>
          ))}
          <button type="button" className="ab ab-quiet ab-sm" onClick={() => setL({ lines: L.lines.filter((_, j) => j !== i) })}>Remove line</button>
        </div>
      ))}
      <button type="button" className="ab ab-quiet ab-sm" onClick={() => setL({ lines: [...L.lines, []] })}>+ Add line</button>
      <h3>Badges</h3>
      <ListEditor items={L.badges} onChange={(badges) => setL({ badges })}
        title={(b) => fieldOptions.find(([k]) => k === b.bind)?.[1] || b.bind}
        newItem={fieldOptions.length ? () => ({ bind: fieldOptions[0][0], tone: "plain", ...(kindOf(fieldOptions[0][0]) ? { kind: "yesno", label: "Yes" } : {}) }) : undefined} addLabel="Add badge"
        render={(b, upb) => (
          <>
            <Select label="Shows" value={b.bind} options={fieldOptions} onChange={(v) => upb(kindOf(v) ? { bind: v, kind: "yesno", label: b.label || "Yes" } : { bind: v, tone: b.tone || "plain" })} />
            {b.kind === "yesno" ? <Field label="Badge word" value={b.label} onChange={(v) => upb({ ...b, label: v })} help='Shown as "✓ word" or "✕ word".' />
              : <Select label="Look" value={b.tone || "plain"} onChange={(v) => upb({ ...b, tone: v })} options={[["plain", "Plain"], ["accent", "Accent color"]]} />}
          </>
        )} />
      <h3>Expanded card</h3>
      <Select label="Comments show" value={L.commentsIn} onChange={(v) => setL({ commentsIn: v })} options={[["card", "On the card, as a quote"], ["detail", "When the card is opened"]]} />
      <Toggle label="Show the full photo when a card is opened" value={L.photoInDetail} onChange={(v) => setL({ photoInDetail: v })} />
      <ListEditor items={L.detailExtras || []} onChange={(detailExtras) => setL({ detailExtras })}
        title={(x) => x.label}
        newItem={fieldOptions.length ? () => ({ bind: fieldOptions[0][0], label: fieldOptions[0][1] }) : undefined} addLabel="Add extra detail line"
        render={(x, upx) => (
          <>
            <Select label="Shows" value={x.bind} options={fieldOptions} onChange={(v) => upx({ ...x, bind: v })} />
            <Field label="Label" value={x.label} onChange={(v) => upx({ ...x, label: v })} />
          </>
        )} />
    </div>
  );
}

export function AboutTab({ t, set }) {
  return (
    <div className="tab-body">
      <p className="af-help">Paragraphs in the About box. A Contact section and the sign-in button are added automatically.</p>
      <ListEditor items={t.about} onChange={(about) => set({ ...t, about })} startOpen
        title={(a) => a.heading || (a.text || "").slice(0, 50) || "Paragraph"}
        newItem={() => ({ heading: null, text: "" })} addLabel="Add paragraph"
        render={(a, upa) => (
          <>
            <Field label="Heading (optional)" value={a.heading} onChange={(v) => upa({ ...a, heading: v || null })} />
            <Area label="Text" rows={3} value={a.text} onChange={(v) => upa({ ...a, text: v })} />
            <div className="row2">
              <Field label="Link text (must appear in the text)" value={a.link?.label} onChange={(v) => upa({ ...a, link: v ? { href: a.link?.href || "https://", label: v } : undefined })} />
              <Field label="Link address" value={a.link?.href} onChange={(v) => upa({ ...a, link: a.link ? { ...a.link, href: v } : undefined })} />
            </div>
          </>
        )} />
    </div>
  );
}
