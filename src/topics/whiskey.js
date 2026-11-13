// WhiskeyList topic. All whiskey: American, Scotch, Irish, Japanese, Canadian and world.
import { DESCRIPTORS, SECTIONS, FLAWS, BANDS } from "../data/whiskeySheet";

export default {
  slug: "whiskey",
  name: "WhiskeyList",
  tagline: "Nose it. Taste it. Score it.",
  itemNoun: "pour",
  favicon: "🥃",
  beta: true,
  correctionLink: true,
  theme: {
    fontsHref: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Source+Sans+3:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap",
    fonts: {
      display: '"DM Serif Display", Georgia, serif',
      body: '"Source Sans 3", "Segoe UI", system-ui, sans-serif',
      mono: '"IBM Plex Mono", ui-monospace, Consolas, monospace',
    },
    light: {
      bg: "#EFE9E1", bgInk: "#24180F", bgMuted: "#6B5B4D",
      card: "#FFFFFF", ink: "#24180F", muted: "#6B5B4D", line: "#DDD3C6", field: "#FFFFFF",
      headerAccent: "#E2A653", header: "#3A2416", headerInk: "#F6EFE6", headerMuted: "#CBB8A3", headerLine: "#5E4330",
      accent: "#B8741F", accentInk: "#FFFFFF", accentSoft: "#F5E6D0",
      title: "#3A2416", link: "#8A4E12", danger: "#8E2B22", dangerSoft: "#F5DFDB", good: "#2F7A3D",
    },
    dark: {
      bg: "#17110C", bgInk: "#EFE6DA", bgMuted: "#A8988A",
      card: "#221913", ink: "#EFE6DA", muted: "#A8988A", line: "#3D2E22", field: "#17110C",
      accentSoft: "#3A2A17", title: "#F0D2A8", link: "#E2A653", dangerSoft: "#3A1C18",
    },
    logo: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M10 3h12c.6 4.5-.2 7.7-1.9 10.3-1.3 2-1.9 3.6-1.6 6.2l.3 3.5h3.2v3H10v-3h3.2l.3-3.5c.3-2.6-.3-4.2-1.6-6.2C10.2 10.7 9.4 7.5 10 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10.6 9.5h10.8c-.3 1.4-.8 2.6-1.5 3.6-.6 1-1.1 1.9-1.4 2.9h-5c-.3-1-.8-1.9-1.4-2.9-.7-1-1.2-2.2-1.5-3.6z" fill="#E2A653"/></svg>`,
    totalStyle: "bar",
  },
  form: [
    { type: "photo", bind: "photo", label: "Photo", layout: "beside-next" },
    { type: "text", bind: "item_name", label: "Whiskey", placeholder: "Name on the label", required: true, group: "photo" },
    { type: "text", bind: "maker", label: "Distillery or brand", placeholder: "Who made or bottled it", group: "photo" },
    { type: "whiskeyPicker", label: "What are you drinking?", bind: "style", familyBind: "answers.family", styleBind: "answers.style_id", regionBind: "answers.region", countryBind: "answers.country" },
    { type: "number", bind: "answers.proof", label: "Proof", placeholder: "e.g. 100", min: 40, max: 200, step: 0.1, half: true, showAbv: true },
    { type: "age", bind: "answers.age", label: "Age", half: true },
    { type: "multipills", bind: "answers.label_tags", label: "On the label", options: ["Wheated", "High-rye", "Cask strength", "Single barrel", "Small batch", "Bottled-in-bond", "Non-chill-filtered", "Finished"],
      detail: { option: "Finished", bind: "answers.finish_cask", placeholder: "Finished in what cask? e.g. sherry, port, wine" },
      tips: { "Bottled-in-bond": "US rule: one distilling season, one distiller at one distillery, at least 4 years in a bonded warehouse, bottled at exactly 100 proof.", "Cask strength": "Bottled at barrel proof, without being watered down.", "Finished": "Spent extra time in a second cask, often one that held wine, sherry or port." } },
    { type: "pills", bind: "answers.serving", label: "Served", options: ["Neat", "Few drops of water", "Splash", "On ice"], toggle: true,
      hint: "For judging, neat or with a few drops of water works best. Water can open up aromas, especially in high-proof whiskey. Ice numbs flavor." },
    { type: "location", label: "Where you drank it", placeholder: "Bar, distillery, home" },
    { type: "sheet", bind: "answers.sections", flawsBind: "answers.flaws", sections: SECTIONS, flaws: FLAWS, flawLevels: ["L", "M", "H"], descriptors: DESCRIPTORS, requireAll: true },
    { type: "textarea", bind: "comments", label: "Comments", placeholder: "What stood out? Would you buy the bottle?" },
  ],
  bands: BANDS,
  list: {
    defaultSort: "recent",
    lines: [["maker", "styleFull"], ["place", "date"]],
    badges: [{ bind: "answers.proof", tone: "plain", suffix: " proof" }, { bind: "answers.age_label", tone: "plain" }],
    commentsIn: "detail",
    photoInDetail: true,
    detailExtras: [{ bind: "answers.label_tags", label: "On the label" }, { bind: "answers.finish_cask", label: "Finished in" }, { bind: "answers.serving", label: "Served" }],
  },
  about: [
    { heading: null, text: "A shared scoresheet for judging whiskey: American, Scotch, Irish, Japanese, Canadian and beyond. WhiskeyList is in beta, so tell us what's missing or wrong." },
    { heading: "Where the style rules come from", text: "Style cards summarize each category's public rules: the US Standards of Identity (27 CFR 5.143), Tennessee Code 57-2-106, the Scotch Whisky Regulations 2009, the Irish Whiskey Technical File, Canada's Food and Drug Regulations, and the Japan Spirits & Liqueurs Makers Association's labeling standards. Each card links to its source. Flavor notes describe common tendencies, not rules." },
    { heading: null, text: "WhiskeyList isn't affiliated with any distillery or trade body. Please enjoy responsibly." },
  ],
};
