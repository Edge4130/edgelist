import { useCallback, useEffect, useMemo, useState } from "react";
import "./admin.css";
import { useOwner, signOut } from "../lib/auth";
import { storageMode } from "../lib/store";
import { listTopics, saveDraft, publishTopic, createTopic, setArchived } from "../lib/topicsApi";
import { validateConfig } from "./validateConfig";
import { BasicsTab, BrandTab, FormTab, ScoringTab, BandsTab, LogTab, AboutTab } from "./editors";
import VersionsTab from "./VersionsTab";
import Preview from "./Preview";
import NewTopic from "./NewTopic";
import SignIn from "../components/SignIn";

const TABS = [["basics", "Basics"], ["brand", "Brand"], ["form", "Form"], ["scoring", "Scoring"], ["bands", "Bands"], ["log", "Log card"], ["about", "About"], ["versions", "Versions"]];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default function AdminApp() {
  const owner = useOwner();
  if (!owner.ready) return <p className="boot">Checking sign-in</p>;
  if (!owner.isOwner) return <Gate owner={owner} />;
  return <Builder owner={owner} />;
}

function Gate({ owner }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="admin gate">
      <h1>EdgeList Builder</h1>
      {owner.email
        ? <><p>You're signed in as {owner.email}, which isn't the owner account.</p><button className="ab" onClick={() => signOut()}>Sign out</button></>
        : <><p>Sign in with the owner account to edit topics.</p><button className="ab" onClick={() => setOpen(true)}>Owner sign in</button></>}
      {open && !owner.email && <SignIn onClose={() => setOpen(false)} onDone={() => setOpen(false)} />}
    </div>
  );
}

function Builder({ owner }) {
  const [topics, setTopics] = useState(null);
  const [slug, setSlug] = useState(null);
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState("basics");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState(null);
  const [creating, setCreating] = useState(false);
  const [reload, setReload] = useState(0);
  const [showArchived, setShowArchived] = useState(false);

  const load = useCallback(async (keepSlug) => {
    const list = await listTopics();
    setTopics(list);
    const pick = list.find((t) => t.slug === keepSlug) || list.find((t) => !t.archived) || list[0];
    if (pick) { setSlug(pick.slug); setDraft(pick.draft); }
    setReload((r) => r + 1);
  }, []);
  useEffect(() => { load().catch((e) => setMsg({ err: true, text: e.message })); }, [load]);
  useEffect(() => { if (!msg || msg.err) return; const t = setTimeout(() => setMsg(null), 3500); return () => clearTimeout(t); }, [msg]);

  const current = topics?.find((t) => t.slug === slug);
  const dirty = current && draft && !same(draft, current.draft);
  const unpublished = current && !same(current.draft, current.published);
  const problems = useMemo(() => (draft ? validateConfig(draft) : []), [draft]);

  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function pickTopic(s) {
    if (dirty && !window.confirm("You have unsaved changes. Switch topics and lose them?")) return;
    const t = topics.find((x) => x.slug === s);
    setSlug(s); setDraft(t.draft); setReload((r) => r + 1);
  }

  async function save() {
    setBusy("save");
    try { await saveDraft(slug, draft); await load(slug); setMsg({ text: "Draft saved. The live app hasn't changed." }); }
    catch (e) { setMsg({ err: true, text: e.message }); }
    finally { setBusy(""); }
  }

  async function publish() {
    if (problems.length) { setMsg({ err: true, text: "Fix these before publishing: " + problems.join(" ") }); return; }
    if (!window.confirm(`Publish ${draft.name}? Anyone opening the app gets this version.`)) return;
    setBusy("publish");
    try {
      if (dirty) await saveDraft(slug, draft);
      const v = await publishTopic(slug);
      await load(slug);
      setMsg({ text: `Published as version ${v}. It's live for anyone who opens the app now.` });
    } catch (e) { setMsg({ err: true, text: e.message }); }
    finally { setBusy(""); }
  }

  function discard() {
    if (!window.confirm("Throw away unsaved changes?")) return;
    setDraft(current.draft); setReload((r) => r + 1);
  }

  if (!topics) return <p className="boot">Loading topics</p>;
  const visible = topics.filter((t) => showArchived || !t.archived);

  return (
    <div className="admin">
      <header className="a-top">
        <h1>EdgeList Builder</h1>
        {storageMode === "local" && <span className="a-chip">Preview mode: changes stay in this browser</span>}
        <span className="a-spacer" />
        <span className="a-who">{owner.email || "Owner"}</span>
        {storageMode === "cloud" && <button className="ab ab-quiet ab-sm" onClick={() => signOut()}>Sign out</button>}
      </header>

      <div className="a-grid">
        <aside className="a-side">
          <div className="a-side-head">
            <span className="af-label">Topics</span>
            <button className="ab ab-sm" onClick={() => setCreating(true)}>+ New</button>
          </div>
          {visible.map((t) => (
            <button key={t.slug} className={"a-topic" + (t.slug === slug ? " on" : "")} onClick={() => pickTopic(t.slug)}>
              <span className="a-topic-name">{t.draft.favicon} {t.draft.name}</span>
              <span className="a-topic-meta">
                {t.slug} · {t.published_version ? `v${t.published_version} live` : "not published"}
                {t.archived && " · archived"}
                {t.published_version > 0 && !same(t.draft, t.published) && " · draft changes"}
              </span>
            </button>
          ))}
          <label className="a-archived"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show archived</label>
        </aside>

        {draft && current && (
          <section className="a-main">
            <div className="a-status">
              <div>
                <h2>{draft.name}</h2>
                <p className="af-help">
                  {current.published_version ? `Live: version ${current.published_version}.` : "Not published yet."}{" "}
                  {dirty ? "You have unsaved changes." : unpublished ? "Saved draft has changes that aren't live yet." : "Draft matches the live version."}
                </p>
              </div>
              <div className="a-actions">
                {dirty && <button className="ab ab-quiet" onClick={discard}>Discard</button>}
                <button className="ab ab-quiet" onClick={save} disabled={!dirty || busy}>{busy === "save" ? "Saving" : "Save draft"}</button>
                <button className="ab" onClick={publish} disabled={busy || (!dirty && !unpublished)}>{busy === "publish" ? "Publishing" : "Publish"}</button>
              </div>
            </div>
            {msg && <p className={msg.err ? "a-err" : "a-ok"} role="status">{msg.text}</p>}
            {problems.length > 0 && <div className="a-warn"><b>Needs fixing before it can publish:</b><ul>{problems.map((p, i) => <li key={i}>{p}</li>)}</ul></div>}
            {!current.published_version && (
              <p className="a-note">To put this topic online: publish it, then create a Vercel project from the edgelist repo with <code>VITE_TOPIC={slug}</code> plus the two Supabase variables.</p>
            )}

            <nav className="a-tabs" aria-label="Editor sections">
              {TABS.map(([k, l]) => <button key={k} className={"a-tab" + (tab === k ? " on" : "")} aria-current={tab === k ? "page" : undefined} onClick={() => setTab(k)}>{l}</button>)}
            </nav>

            <div key={`${slug}-${reload}`}>
              {tab === "basics" && <BasicsTab t={draft} set={setDraft} />}
              {tab === "brand" && <BrandTab t={draft} set={setDraft} />}
              {tab === "form" && <FormTab t={draft} set={setDraft} />}
              {tab === "scoring" && <ScoringTab t={draft} set={setDraft} />}
              {tab === "bands" && <BandsTab t={draft} set={setDraft} />}
              {tab === "log" && <LogTab t={draft} set={setDraft} />}
              {tab === "about" && <AboutTab t={draft} set={setDraft} />}
              {tab === "versions" && <VersionsTab slug={slug} liveVersion={current.published_version}
                onRestored={async (v) => { await load(slug); setMsg({ text: `Version ${v} loaded into the draft. Check the preview, then publish to make it live.` }); }} />}
            </div>

            <div className="a-danger">
              <button className="ab ab-quiet ab-sm" onClick={async () => {
                const on = !current.archived;
                if (on && !window.confirm(`Archive ${draft.name}? Its app will stop loading the database version and fall back to the built-in copy, if there is one.`)) return;
                await setArchived(slug, on); await load(slug);
              }}>{current.archived ? "Unarchive topic" : "Archive topic"}</button>
            </div>
          </section>
        )}

        {draft && <aside className="a-preview"><Preview topic={draft} /></aside>}
      </div>

      {creating && <NewTopic topics={topics} onClose={() => setCreating(false)}
        onCreate={async (s, config) => { await createTopic(s, config); setCreating(false); await load(s); setTab("basics"); setMsg({ text: `${config.name} created as a draft.` }); }} />}
    </div>
  );
}
