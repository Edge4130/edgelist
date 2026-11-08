import { supabase } from "./supabaseClient";

const TABLE = "entries";
export const storageMode = supabase ? "cloud" : "local";
const localKey = (slug) => `edgelist:${slug}`;

function readLocal(slug) {
  try { return JSON.parse(localStorage.getItem(localKey(slug)) || "[]"); } catch { return []; }
}
function writeLocal(slug, rows) {
  try { localStorage.setItem(localKey(slug), JSON.stringify(rows)); return true; } catch { return false; }
}

const COLUMNS = ["id", "topic", "created_at", "updated_at", "item_name", "maker", "reviewer", "entry_date", "place_name", "address", "lat", "lng", "photo", "style", "total", "comments", "answers", "config_version"];
const clean = (row) => Object.fromEntries(COLUMNS.filter((k) => row[k] !== undefined).map((k) => [k, row[k]]));

export async function listEntries(slug) {
  if (!supabase) return readLocal(slug).sort((a, b) => b.created_at.localeCompare(a.created_at));
  const { data, error } = await supabase.from(TABLE).select("*").eq("topic", slug).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveEntry(slug, entry) {
  const now = new Date().toISOString();
  const row = clean({ ...entry, topic: slug, updated_at: now, entry_date: entry.entry_date || null });
  if (!supabase) {
    const rows = readLocal(slug);
    if (!row.id) { row.id = crypto.randomUUID(); row.created_at = now; }
    const next = rows.filter((r) => r.id !== row.id).concat(row);
    if (!writeLocal(slug, next)) throw new Error("This browser is out of storage space.");
    return row;
  }
  if (!row.id) {
    row.id = crypto.randomUUID();
    const { error } = await supabase.from(TABLE).insert(row);
    if (error) throw error;
    return row;
  }
  // Editing goes through update, which the database only allows for the signed-in owner.
  const { data, error } = await supabase.from(TABLE).update(row).eq("id", row.id).select();
  if (error) throw error;
  if (!data || !data.length) throw new Error("Not saved. Sign in as the owner to edit entries.");
  return data[0];
}

export async function deleteEntry(slug, id) {
  if (!supabase) { writeLocal(slug, readLocal(slug).filter((r) => r.id !== id)); return; }
  const { data, error } = await supabase.from(TABLE).delete().eq("id", id).select();
  if (error) throw error;
  if (!data || !data.length) throw new Error("Not deleted. Sign in as the owner to delete entries.");
}
