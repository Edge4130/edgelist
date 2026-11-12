// Turns a topic's theme into CSS variables. Used for the live app (on :root)
// and for the builder's preview (scoped to the preview frame).
const toVar = (k) => "--" + k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

export function themeVars(topic, dark = false) {
  const t = topic.theme;
  const vars = {};
  for (const [k, v] of Object.entries(t.light || {})) vars[toVar(k)] = v;
  if (dark && t.dark) for (const [k, v] of Object.entries(t.dark)) vars[toVar(k)] = v;
  vars["--font-display"] = t.fonts?.display;
  vars["--font-body"] = t.fonts?.body;
  vars["--font-mono"] = t.fonts?.mono;
  return vars;
}

const block = (vars) => Object.entries(vars).map(([k, v]) => `${k}:${v};`).join("");

export function loadFonts(href) {
  if (!href || document.querySelector(`link[data-font="${CSS.escape(href)}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.font = href;
  document.head.appendChild(link);
}

export function applyTheme(topic) {
  const t = topic.theme;
  let css = `:root{${block(themeVars(topic))}color-scheme:light;}`;
  if (t.dark) {
    const dark = Object.fromEntries(Object.entries(t.dark).map(([k, v]) => [toVar(k), v]));
    css += `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${block(dark)}color-scheme:dark;}}`;
    css += `:root[data-theme="dark"]{${block(dark)}color-scheme:dark;}`;
  }
  let style = document.getElementById("topic-theme");
  if (!style) { style = document.createElement("style"); style.id = "topic-theme"; document.head.appendChild(style); }
  style.textContent = css;
  loadFonts(t.fontsHref);
  document.title = topic.name;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t.light.header);
  const fav = document.querySelector('link[rel="icon"]');
  if (fav) fav.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${topic.favicon || "★"}</text></svg>`;
}
