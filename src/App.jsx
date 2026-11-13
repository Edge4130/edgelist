import { useCallback, useEffect, useState } from "react";
import { listEntries, saveEntry, deleteEntry, storageMode } from "./lib/store";
import { useOwner, signOut } from "./lib/auth";
import ScoreForm from "./components/ScoreForm";
import LogView from "./components/LogView";
import MapView from "./components/MapView";
import About from "./components/About";
import SignIn from "./components/SignIn";
import { contactHref } from "./config";

const TABS = [["score", "Score"], ["log", "Log"], ["map", "Map"]];

export default function App({ topic }) {
  const [tab, setTab] = useState("score");
  const [entries, setEntries] = useState([]);
  const [loadErr, setLoadErr] = useState("");
  const [editing, setEditing] = useState(null);
  const [about, setAbout] = useState(false);
  const [signing, setSigning] = useState(false);
  const [toast, setToast] = useState("");
  const owner = useOwner();

  const refresh = useCallback(async () => {
    try { setEntries(await listEntries(topic.slug)); setLoadErr(""); }
    catch { setLoadErr("Couldn't load the log. Check the connection, then reload."); }
  }, [topic.slug]);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2600); return () => clearTimeout(t); }, [toast]);

  async function handleSave(e) {
    await saveEntry(topic.slug, e);
    await refresh();
    setToast(editing ? "Changes saved" : "Saved to the log");
    setEditing(null);
    setTab("log");
    window.scrollTo({ top: 0 });
  }

  async function handleDelete(p) {
    if (!window.confirm(`Delete ${p.item_name}? This can't be undone.`)) return;
    try { await deleteEntry(topic.slug, p.id); await refresh(); setToast("Deleted"); }
    catch (x) { setToast(x.message || "Couldn't delete. Try again."); }
  }

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="mark" dangerouslySetInnerHTML={{ __html: topic.theme.logo }} />
          <span className="brand-text">
            <span className="brand-name">{topic.name}{topic.beta && <span className="beta-chip">Beta</span>}</span>
            <span className="brand-tag">{topic.tagline}</span>
          </span>
        </div>
        <div className="top-actions">
          {owner.isOwner && storageMode === "cloud" && <span className="owner-chip">Owner</span>}
          <a className="icon-btn on-dark" href={contactHref(topic)} aria-label="Contact" title="Contact">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5 12 13l8.5-6.5" /></svg>
          </a>
          <button type="button" className="btn-quiet on-dark" onClick={() => setAbout(true)}>About</button>
        </div>
      </header>
      <nav className="tabs" aria-label="Views">
        {TABS.map(([k, label]) => (
          <button key={k} type="button" className={"tab" + (tab === k ? " on" : "")} aria-current={tab === k ? "page" : undefined}
            onClick={() => { setTab(k); if (k !== "score") setEditing(null); }}>
            {k === "score" && editing ? "Editing" : label}
          </button>
        ))}
      </nav>
      {storageMode === "local" && <p className="banner">Preview mode: entries are saved in this browser only.</p>}
      {loadErr && <p className="msg pad">{loadErr}</p>}

      <main className="main">
        {tab === "score" && <ScoreForm topic={topic} initial={editing} onSave={handleSave} onCancel={() => { setEditing(null); setTab("log"); }} />}
        {tab === "log" && <LogView topic={topic} entries={entries} isOwner={owner.isOwner} onScore={() => setTab("score")}
          onEdit={(p) => { setEditing(p); setTab("score"); window.scrollTo({ top: 0 }); }} onDelete={handleDelete} />}
        {tab === "map" && <MapView topic={topic} entries={entries} />}
      </main>

      {about && <About topic={topic} owner={owner} onClose={() => setAbout(false)}
        onSignIn={() => { setAbout(false); setSigning(true); }}
        onSignOut={async () => { await signOut(); setAbout(false); setToast("Signed out"); }} />}
      {signing && <SignIn onClose={() => setSigning(false)} onDone={() => { setSigning(false); setToast("Signed in"); }} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
