// Starting points for new topics.
const baseTheme = {
  fontsHref: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&display=swap",
  fonts: { display: '"Barlow Condensed", "Arial Narrow", sans-serif', body: '"Barlow", "Segoe UI", system-ui, sans-serif', mono: '"Barlow Condensed", "Arial Narrow", sans-serif' },
  light: {
    bg: "#F2F1EE", bgInk: "#1E2226", bgMuted: "#5F6368",
    card: "#FFFFFF", ink: "#1E2226", muted: "#5F6368", line: "#D9D7D2", field: "#FFFFFF",
    headerAccent: "#E0A458", header: "#2B2F36", headerInk: "#F5F4F1", headerMuted: "#C5C7CB", headerLine: "#4A4F58",
    accent: "#B5651D", accentInk: "#FFFFFF", accentSoft: "#F4E3D2",
    title: "#2B2F36", link: "#8A4B14", danger: "#9C2F2F", dangerSoft: "#F4DEDB", good: "#2F7A3D",
  },
  dark: null,
  logo: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M11 16.5l3.5 3.5L21 12.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  totalStyle: "bar",
};

const common = (name, slug) => ({
  slug, name, tagline: "", itemNoun: "entry", favicon: "⭐",
  theme: JSON.parse(JSON.stringify(baseTheme)),
  about: [{ heading: null, text: `${name}: a shared scorecard.` }],
});

export function slidersTemplate(name, slug) {
  return {
    ...common(name, slug),
    form: [
      { type: "text", bind: "item_name", label: "Name", placeholder: "What are you rating?", required: true },
      { type: "text", bind: "reviewer", label: "Reviewer", placeholder: "Your name", half: true },
      { type: "date", bind: "entry_date", label: "Date", half: true },
      { type: "photo", bind: "photo", label: "Photo" },
      { type: "location", label: "Location", placeholder: "Place or address" },
      { type: "sliders", bind: "answers.scores", min: 1, max: 10, default: 5, rows: [
        { key: "first", label: "First category", hint: "What this category judges." },
        { key: "second", label: "Second category", hint: "What this category judges." },
      ] },
      { type: "stamp" },
      { type: "textarea", bind: "comments", label: "Comments", placeholder: "Notes..." },
    ],
    bands: [
      { min: 16, label: "Excellent", color: "#2F7A3D" },
      { min: 10, label: "Solid", color: "#E8A33D" },
      { min: 0, label: "Rough", color: "#9C2F2F" },
    ],
    list: { defaultSort: "top", lines: [["place"], ["reviewer", "date"]], badges: [], commentsIn: "card", photoInDetail: false, detailExtras: [] },
  };
}

export function sheetTemplate(name, slug) {
  return {
    ...common(name, slug),
    form: [
      { type: "photo", bind: "photo", label: "Photo", layout: "beside-next" },
      { type: "text", bind: "item_name", label: "Name", placeholder: "What are you judging?", required: true, group: "photo" },
      { type: "text", bind: "maker", label: "Maker", placeholder: "Who made it", group: "photo" },
      { type: "location", label: "Where", placeholder: "Place" },
      { type: "sheet", bind: "answers.sections", flawsBind: "answers.flaws", requireAll: true, flawLevels: ["L", "M", "H"], descriptors: {},
        sections: [
          { key: "nose", label: "Nose", max: 10, tip: { what: "What you smell.", how: "" }, rows: [
            { key: "intensity", label: "Intensity", scale: ["None", "L", "M", "H"], tip: { what: "How strong the aroma is.", how: "" } },
          ] },
          { key: "overall", label: "Overall", max: 10, tip: { what: "Overall impression.", how: "" }, rows: [] },
        ],
        flaws: [] },
      { type: "textarea", bind: "comments", label: "Comments", placeholder: "Notes..." },
    ],
    bands: [
      { min: 16, label: "Excellent", color: "#2F7A3D" },
      { min: 10, label: "Good", color: "#E8A33D" },
      { min: 0, label: "Fair", color: "#9C2F2F" },
    ],
    list: { defaultSort: "recent", lines: [["maker"], ["place", "date"]], badges: [], commentsIn: "detail", photoInDetail: true, detailExtras: [] },
  };
}
