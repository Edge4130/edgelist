// Checks a topic before publishing, so a broken config never reaches a live app.
export function validateConfig(t) {
  const errs = [];
  if (!t.name?.trim()) errs.push("The topic needs a name.");
  const form = t.form || [];
  if (!form.some((b) => b.type === "text" && b.bind === "item_name")) errs.push("The form needs a text field saved as the item name.");
  const scoring = form.filter((b) => b.type === "sliders" || b.type === "sheet");
  if (scoring.length !== 1) errs.push("The form needs exactly one scoring block.");
  const s = scoring[0];
  if (s?.type === "sliders") {
    if (!s.rows?.length) errs.push("Add at least one slider row.");
    if (!(s.max > s.min)) errs.push("Slider max must be bigger than min.");
    if (s.default < s.min || s.default > s.max) errs.push("Slider default must be between min and max.");
    const keys = s.rows.map((r) => r.key);
    if (new Set(keys).size !== keys.length) errs.push("Two slider rows share the same key.");
  }
  if (s?.type === "sheet") {
    if (!s.sections?.length) errs.push("Add at least one scoresheet section.");
    for (const sec of s.sections || []) if (!(sec.max > 0)) errs.push(`Section "${sec.label}" needs a points value above 0.`);
  }
  for (const b of form) {
    if ((b.type === "pills") && !b.options?.length) errs.push(`"${b.label}" needs at least one option.`);
    if (b.type === "heat" && !b.levels?.length) errs.push(`"${b.label}" needs heat levels.`);
  }
  if (!t.bands?.length) errs.push("Add at least one score band.");
  else if (!t.bands.some((b) => Number(b.min) <= 0)) errs.push("One score band must start at 0 so every score has a label.");
  return errs;
}
