// Applies a topic's colors, fonts, title and favicon at startup.
const toVar = (k) => "--" + k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
const block = (vars) => Object.entries(vars).map(([k, v]) => `${toVar(k)}:${v};`).join("");

export function applyTheme(topic) {
  const t = topic.theme;
  const fonts = `--font-display:${t.fonts.display};--font-body:${t.fonts.body};--font-mono:${t.fonts.mono};`;
  let css = `:root{${block(t.light)}${fonts}color-scheme:light;}`;
  if (t.dark) {
    css += `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${block(t.dark)}color-scheme:dark;}}`;
    css += `:root[data-theme="dark"]{${block(t.dark)}color-scheme:dark;}`;
  }
  const style = document.createElement("style");
  style.id = "topic-theme";
  style.textContent = css;
  document.head.appendChild(style);

  if (t.fontsHref) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = t.fontsHref;
    document.head.appendChild(link);
  }
  document.title = topic.name;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t.light.header);
  const fav = document.querySelector('link[rel="icon"]');
  if (fav) fav.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${topic.favicon}</text></svg>`;
}
