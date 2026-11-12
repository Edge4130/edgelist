import { supabase } from "./supabaseClient";
import { TOPICS } from "../topics";

// Topic configs live in the database. In preview mode (no Supabase) they live in this browser.
const LOCAL_KEY = "edgelist:topics";
const clone = (x) => JSON.parse(JSON.stringify(x));

function readLocal() {
  let db = null;
  try { db = JSON.parse(localStorage.getItem(LOCAL_KEY) || "null"); } catch { /* ignore */ }
  if (!db) {
    db = {};
    for (const t of Object.values(TOPICS)) {
      db[t.slug] = { slug: t.slug, draft: clone(t), published: clone(t), published_version: 1, archived: false, updated_at: new Date().toISOString(), versions: [{ version: 1, config: clone(t), published_at: new Date().toISOString() }] };
    }
    writeLocal(db);
  }
  return db;
}
function writeLocal(db) { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(db)); } catch { /* ignore */ } }

function withTimeout(p, ms) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
}

// For the live apps: the published config, or null if unavailable.
export async function fetchPublished(slug) {
  if (!supabase) {
    const t = readLocal()[slug];
    return t && !t.archived ? t.published : null;
  }
  try {
    const { data, error } = await withTimeout(supabase.rpc("get_published_topic", { p_slug: slug }), 5000);
    if (error) return null;
    return data || null;
  } catch { return null; }
}

// Builder functions below. The database only allows these for the owner.
export async function listTopics() {
  if (!supabase) return Object.values(readLocal()).map(({ versions, ...t }) => t).sort((a, b) => a.slug.localeCompare(b.slug));
  const { data, error } = await supabase.from("topics").select("slug, draft, published, published_version, archived, updated_at, published_at").order("slug");
  if (error) throw error;
  return data;
}

export async function saveDraft(slug, draft) {
  if (!supabase) { const db = readLocal(); db[slug].draft = clone(draft); db[slug].updated_at = new Date().toISOString(); writeLocal(db); return; }
  const { data, error } = await supabase.from("topics").update({ draft, updated_at: new Date().toISOString() }).eq("slug", slug).select("slug");
  if (error) throw error;
  if (!data?.length) throw new Error("Not saved. Make sure you're signed in as the owner.");
}

export async function publishTopic(slug) {
  if (!supabase) {
    const db = readLocal(); const t = db[slug];
    t.published = clone(t.draft); t.published_version += 1; t.published_at = new Date().toISOString();
    t.versions.push({ version: t.published_version, config: clone(t.draft), published_at: t.published_at });
    writeLocal(db); return t.published_version;
  }
  const { data, error } = await supabase.rpc("publish_topic", { p_slug: slug });
  if (error) throw error;
  return data;
}

export async function listVersions(slug) {
  if (!supabase) return [...readLocal()[slug].versions].reverse().map(({ version, published_at, config }) => ({ version, published_at, name: config.name }));
  const { data, error } = await supabase.from("topic_versions").select("version, published_at, config->>name").eq("slug", slug).order("version", { ascending: false });
  if (error) throw error;
  return data;
}

export async function restoreVersion(slug, version) {
  if (!supabase) { const db = readLocal(); const v = db[slug].versions.find((x) => x.version === version); db[slug].draft = clone(v.config); writeLocal(db); return; }
  const { error } = await supabase.rpc("restore_topic_version", { p_slug: slug, p_version: version });
  if (error) throw error;
}

export async function createTopic(slug, config) {
  if (!supabase) {
    const db = readLocal();
    if (db[slug]) throw new Error(`A topic called "${slug}" already exists.`);
    db[slug] = { slug, draft: clone(config), published: null, published_version: 0, archived: false, updated_at: new Date().toISOString(), versions: [] };
    writeLocal(db); return;
  }
  const { error } = await supabase.from("topics").insert({ slug, draft: config });
  if (error) throw new Error(error.code === "23505" ? `A topic called "${slug}" already exists.` : error.message);
}

export async function setArchived(slug, archived) {
  if (!supabase) { const db = readLocal(); db[slug].archived = archived; writeLocal(db); return; }
  const { error } = await supabase.from("topics").update({ archived }).eq("slug", slug);
  if (error) throw error;
}
