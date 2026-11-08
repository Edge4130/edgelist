import { getAt, setAt } from "./bind";

export function scoringBlock(topic) {
  return topic.form.find((b) => b.type === "sliders" || b.type === "sheet");
}

export function maxOf(topic) {
  const b = scoringBlock(topic);
  if (!b) return 0;
  if (b.type === "sliders") return b.rows.length * b.max;
  return b.sections.reduce((a, s) => a + s.max, 0);
}

export function totalOf(topic, entry) {
  const b = scoringBlock(topic);
  if (!b) return 0;
  const v = getAt(entry, b.bind) || {};
  if (b.type === "sliders") return b.rows.reduce((a, r) => a + (Number(v[r.key]) || 0), 0);
  return b.sections.reduce((a, s) => a + (Number(v[s.key]?.score) || 0), 0);
}

export function bandFor(topic, total) {
  return topic.bands.find((b) => total >= b.min) || topic.bands[topic.bands.length - 1];
}

export function blankEntry(topic) {
  let e = { item_name: "", maker: "", reviewer: "", entry_date: new Date().toISOString().slice(0, 10), place_name: "", address: "", lat: null, lng: null, photo: null, style: null, comments: "", answers: {} };
  for (const b of topic.form) {
    if (b.type === "sliders") {
      const scores = {};
      for (const r of b.rows) scores[r.key] = b.default ?? b.min;
      e = setAt(e, b.bind, scores);
    } else if (b.type === "sheet") {
      const sections = {};
      for (const s of b.sections) sections[s.key] = { score: null, rows: {}, off: {}, tags: {} };
      e = setAt(e, b.bind, sections);
      e = setAt(e, b.flawsBind, {});
    } else if (b.default !== undefined && b.bind) {
      e = setAt(e, b.bind, b.default);
    }
  }
  return e;
}

// Problems that block saving, in plain words.
export function validate(topic, entry) {
  const problems = [];
  for (const b of topic.form) {
    if (b.required && !String(getAt(entry, b.bind) || "").trim()) problems.push(`Add ${b.label.toLowerCase()}`);
    if (b.type === "sheet" && b.requireAll) {
      const v = getAt(entry, b.bind) || {};
      const missing = b.sections.filter((s) => v[s.key]?.score == null);
      if (missing.length) problems.push(`Score ${missing.length === 1 ? missing[0].label : `${missing.length} more sections`}`);
    }
  }
  return problems;
}
