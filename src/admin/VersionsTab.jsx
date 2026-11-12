import { useEffect, useState } from "react";
import { listVersions, restoreVersion } from "../lib/topicsApi";

export default function VersionsTab({ slug, liveVersion, onRestored }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => { listVersions(slug).then(setRows).catch((e) => setErr(e.message)); }, [slug, liveVersion]);
  async function restore(v) {
    if (!window.confirm(`Load version ${v} into the draft? Your current unpublished draft will be replaced. The live app doesn't change until you publish.`)) return;
    try { await restoreVersion(slug, v); onRestored(v); } catch (e) { setErr(e.message); }
  }
  return (
    <div className="tab-body">
      <p className="af-help">Every publish is saved here. Loading an old version puts it in the draft so you can check it in the preview before publishing it again.</p>
      {err && <p className="a-err">{err}</p>}
      {!rows ? <p>Loading</p> : !rows.length ? <p>Not published yet.</p> : (
        <table className="vtable">
          <thead><tr><th>Version</th><th>Published</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.version}>
                <td>{r.version}{r.version === liveVersion && <span className="live-chip">Live</span>}</td>
                <td>{new Date(r.published_at).toLocaleString()}</td>
                <td><button type="button" className="ab ab-quiet ab-sm" onClick={() => restore(r.version)}>Load into draft</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
