// Shared education bubble. Accepts a string or { what, how }.
export default function Tip({ tip, children, tone }) {
  const t = typeof tip === "string" ? { what: tip } : tip || {};
  return (
    <div className={"tip" + (tone ? " tip-" + tone : "")}>
      {t.what && <p>{t.what}</p>}
      {t.how && <p className="tip-how"><span className="tip-k">How to tell:</span> {t.how}</p>}
      {children}
    </div>
  );
}

export function tipText(tip) {
  return typeof tip === "string" ? tip : [tip?.what, tip?.how].filter(Boolean).join(" ");
}
