import { useEffect, useMemo, useState } from "react";
import ScoreForm from "../components/ScoreForm";
import LogView from "../components/LogView";
import { themeVars, loadFonts } from "../lib/theme";
import { listEntries } from "../lib/store";

// Phone-sized live preview of the draft, using the topic's real entries for the Log.
export default function Preview({ topic }) {
  const [tab, setTab] = useState("score");
  const [entries, setEntries] = useState([]);
  const [dark, setDark] = useState(false);
  const [note, setNote] = useState("");
  const vars = useMemo(() => themeVars(topic, dark), [topic, dark]);

  useEffect(() => { loadFonts(topic.theme.fontsHref); }, [topic.theme.fontsHref]);
  useEffect(() => { listEntries(topic.slug).then(setEntries).catch(() => setEntries([])); }, [topic.slug]);
  useEffect(() => { if (!note) return; const t = setTimeout(() => setNote(""), 2500); return () => clearTimeout(t); }, [note]);

  return (
    <div className="preview">
      <div className="preview-bar">
        <span className="af-label">Preview (draft)</span>
        <span className="preview-tabs">
          {[["score", "Score"], ["log", "Log"]].map(([k, l]) => (
            <button key={k} type="button" className={"ab ab-sm" + (tab === k ? "" : " ab-quiet")} onClick={() => setTab(k)}>{l}</button>
          ))}
          {topic.theme.dark && <button type="button" className={"ab ab-sm" + (dark ? "" : " ab-quiet")} onClick={() => setDark(!dark)}>Dark</button>}
        </span>
      </div>
      <div className="phone" style={vars}>
        <div className="phone-scroll app-skin">
          <header className="top">
            <div className="brand">
              <span className="mark" dangerouslySetInnerHTML={{ __html: topic.theme.logo }} />
              <span className="brand-text"><span className="brand-name">{topic.name}</span><span className="brand-tag">{topic.tagline}</span></span>
            </div>
          </header>
          <nav className="tabs"><span className={"tab" + (tab === "score" ? " on" : "")}>Score</span><span className={"tab" + (tab === "log" ? " on" : "")}>Log</span><span className="tab">Map</span></nav>
          <main className="main">
            {tab === "score"
              ? <ScoreForm topic={topic} onSave={async () => { setNote("Preview only. Nothing was saved."); throw new Error("Preview only. Publish, then use the live app to save."); }} />
              : <LogView topic={topic} entries={entries} isOwner={false} onScore={() => setTab("score")} onEdit={() => {}} onDelete={() => {}} />}
          </main>
          {note && <div className="toast" role="status">{note}</div>}
        </div>
      </div>
    </div>
  );
}
