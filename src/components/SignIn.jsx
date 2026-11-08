import { useState } from "react";
import { signIn } from "../lib/auth";

export default function SignIn({ onDone, onClose }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try { await signIn(email.trim(), pw); onDone(); }
    catch (x) { setErr(x.message); }
    finally { setBusy(false); }
  }
  return (
    <div className="modal" role="dialog" aria-label="Owner sign in" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Owner sign in</h2>
        <p className="small muted">Signing in unlocks edit and delete.</p>
        <label className="lbl">Email<input className="field" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="lbl">Password<input className="field" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required /></label>
        {err && <p className="msg small" role="alert">{err}</p>}
        <div className="modal-actions">
          <button type="button" className="btn-quiet" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={busy}>{busy ? "Signing in" : "Sign in"}</button>
        </div>
      </form>
    </div>
  );
}
