import { storageMode } from "../lib/store";
import { contactHref, ENGINE } from "../config";

export default function About({ topic, owner, onSignIn, onSignOut, onClose }) {
  return (
    <div className="modal" role="dialog" aria-label={`About ${topic.name}`} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>About {topic.name}</h2>
        {topic.about.map((a, i) => (
          <div key={i}>
            {a.heading && <h3>{a.heading}</h3>}
            <p>{a.link ? <>{a.text.split(a.link.label)[0]}<a href={a.link.href} target="_blank" rel="noreferrer">{a.link.label}</a>{a.text.split(a.link.label)[1]}</> : a.text}</p>
          </div>
        ))}
        <p className="small muted">Maps use OpenStreetMap data. Entries are stored {storageMode === "cloud" ? "in the shared database" : "in this browser only"}. Built on EdgeList.</p>
        <h3>Contact</h3>
        <p>Questions, ideas, or something not working? <a href={contactHref(topic)}>Email {topic.contactEmail || ENGINE.contactEmail}</a>.</p>
        <div className="modal-actions">
          {storageMode === "cloud" && (owner.isOwner || owner.email
            ? <button type="button" className="btn-quiet" onClick={onSignOut}>Sign out{owner.email ? ` (${owner.email})` : ""}</button>
            : <button type="button" className="btn-quiet" onClick={onSignIn}>Owner sign in</button>)}
          <button type="button" className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
