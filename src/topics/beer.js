// BeerList topic. Everything that makes BeerList "BeerList" lives here as data.
import { DESCRIPTORS, SECTIONS, FLAWS, FLAW_LEVELS, BANDS } from "../data/beerSheet";

export default {
  slug: "beer",
  name: "BeerList",
  tagline: "Judge beer against style.",
  itemNoun: "beer",
  favicon: "🍺",
  theme: {
    fontsHref: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&display=swap",
    fonts: {
      display: '"Barlow Condensed", "Arial Narrow", sans-serif',
      body: '"Barlow", "Segoe UI", system-ui, sans-serif',
      mono: '"Barlow Condensed", "Arial Narrow", sans-serif',
    },
    light: {
      bg: "#F4F6F2", bgInk: "#1F2428", bgMuted: "#5D6660",
      card: "#FFFFFF", ink: "#1F2428", muted: "#5D6660", line: "#D6DAD2", field: "#FFFFFF",
      headerAccent: "#E3A24A", header: "#1E3A2F", headerInk: "#F4F6F2", headerMuted: "#C9D3CC", headerLine: "#4A6A5B",
      accent: "#C27A1A", accentInk: "#1B1204", accentSoft: "#F3E3C7",
      title: "#1E3A2F", link: "#2C5242", danger: "#9C2F2F", dangerSoft: "#F4DEDB", good: "#2F7A3D",
    },
    dark: {
      bg: "#141A17", bgInk: "#E8ECE7", bgMuted: "#9BA59E",
      card: "#1C2420", ink: "#E8ECE7", muted: "#9BA59E", line: "#33403A", field: "#141A17",
      accentSoft: "#3A2C16", title: "#CFE0D6", link: "#7FB59C", dangerSoft: "#3A1E1C",
    },
    logo: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 4h14c0 7-1.6 11-4.5 13.2V24h3.5v3H10v-3h3.5v-6.8C10.6 15 9 11 9 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10.2 9h11.6c-.4 3.6-1.6 6-3.6 7.2h-4.4c-2-1.2-3.2-3.6-3.6-7.2z" fill="#C27A1A"/></svg>`,
    totalStyle: "bar",
  },
  form: [
    { type: "photo", bind: "photo", label: "Photo", layout: "beside-next" },
    { type: "text", bind: "item_name", label: "Beer", placeholder: "Name on the tap list", required: true, group: "photo" },
    { type: "text", bind: "maker", label: "Brewery", placeholder: "Who brewed it", group: "photo" },
    { type: "stylePicker", dataset: "bjcp2021", bind: "style", numberBind: "answers.style_number", variantBind: "answers.style_variant", label: "Style" },
    { type: "pills", bind: "answers.serving", label: "Served", options: ["Draft", "Can", "Bottle", "Glass", "Cask", "Crowler / growler"], toggle: true },
    { type: "location", label: "Where you drank it", placeholder: "Bar, taproom, home" },
    { type: "sheet", bind: "answers.sections", flawsBind: "answers.flaws", sections: SECTIONS, flaws: FLAWS, flawLevels: FLAW_LEVELS, descriptors: DESCRIPTORS, requireAll: true, srmFromStyle: true },
    { type: "textarea", bind: "comments", label: "Comments", placeholder: "Style fit, what stood out, what you'd tell the brewer" },
  ],
  bands: BANDS.map((b) => ({ ...b, color: b.min >= 38 ? "#2F7A3D" : b.min >= 21 ? "#C27A1A" : "#9C2F2F" })),
  list: {
    defaultSort: "recent",
    lines: [["maker", "styleFull"], ["place", "date"]],
    badges: [],
    swatch: { sections: "answers.sections", section: "appearance", row: "color" },
    commentsIn: "detail",
    photoInDetail: true,
    detailExtras: [{ bind: "answers.serving", label: "Served" }],
  },
  about: [
    { heading: null, text: "A personal scoresheet for judging beer against style." },
    { heading: "BJCP credit", text: "Style names, numbering, parameters and overall impressions come from the 2021 BJCP Beer Style Guidelines, used with the permission of the BJCP. Copyright 2021, Beer Judge Certification Program, Inc." },
    { heading: null, text: "The scoresheet layout is adapted from the BJCP Beer Scoresheet, Copyright 2019, Beer Judge Certification Program, Inc." },
    { heading: null, text: "The most current guidelines are at www.bjcp.org.", link: { href: "https://www.bjcp.org", label: "www.bjcp.org" } },
  ],
};
