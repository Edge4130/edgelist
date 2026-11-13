// WhiskeyList style data. Legal rules are paraphrased from public sources, cited per style.
// Flavor notes are deliberately general: they describe common tendencies, not rules.
// Soft-launch data: the app's "Suggest a correction" link exists so drinkers can flag anything off.

const SRC = {
  cfr: { label: "US Standards of Identity, 27 CFR 5.143", href: "https://www.law.cornell.edu/cfr/text/27/5.143" },
  bib: { label: "US Bottled-in-Bond rule, 27 CFR 5.88", href: "https://www.law.cornell.edu/cfr/text/27/5.88" },
  tn: { label: "Tennessee Code 57-2-106", href: "https://law.justia.com/codes/tennessee/2019/title-57/chapter-2/section-57-2-106/" },
  swr: { label: "Scotch Whisky Regulations 2009", href: "https://www.legislation.gov.uk/uksi/2009/2890/contents" },
  irish: { label: "Irish Whiskey Technical File", href: "https://assets.publishing.service.gov.uk/media/5fd34980d3bf7f305ffa7ed2/irish-whiskey-spec.pdf" },
  canada: { label: "Canada Food and Drug Regulations, Division 2", href: "https://laws-lois.justice.gc.ca/eng/regulations/C.R.C.,_c._870/page-19.html" },
  japan: { label: "JSLMA Japanese whisky labeling standards (2021)", href: "https://nikka.com/eng/topics/topic_001/" },
};

export const FAMILIES = [
  { key: "american", label: "American", hint: "Bourbon, rye, Tennessee and more" },
  { key: "scotch", label: "Scotch", hint: "Single malts, blends, and the five regions" },
  { key: "irish", label: "Irish", hint: "Pot still, malt, grain, blended" },
  { key: "japanese", label: "Japanese", hint: "Single malt, blended, grain" },
  { key: "canadian", label: "Canadian", hint: "Canadian whisky and Canadian rye" },
  { key: "world", label: "World / other", hint: "Whisky from anywhere else" },
];

const usBourbonProcess = [
  "Distilled to 160 proof (80% ABV) or less.",
  "Aged in new charred oak barrels, entering the barrel at 125 proof or less.",
  "Bottled at 80 proof (40% ABV) or more.",
];

const scotchCore = [
  "Made in Scotland from water and malted barley, with other whole cereal grains allowed in grain whisky.",
  "Distilled to less than 94.8% ABV.",
  "Matured in Scotland in oak casks of 700 liters or less for at least 3 years.",
  "Bottled at 40% ABV or more. Only water and plain caramel coloring may be added.",
];

const irishCore = [
  "Distilled and matured on the island of Ireland (Republic of Ireland or Northern Ireland).",
  "Distilled to less than 94.8% ABV.",
  "Matured at least 3 years in wooden casks (oak or other woods) of 700 liters or less.",
  "Bottled at 40% ABV or more. Only water and plain caramel coloring may be added.",
];

const japanCore = [
  "Made with malted grains (other cereal grains allowed) and water drawn in Japan.",
  "Mashed, fermented and distilled at a distillery in Japan, to less than 95% ABV.",
  "Matured in Japan at least 3 years in wooden casks of 700 liters or less.",
  "Bottled in Japan at 40% ABV or more. Plain caramel coloring is allowed.",
  "This is a voluntary industry standard binding members of the Japan Spirits & Liqueurs Makers Association, not a law. Full compliance began in 2024.",
];

export const STYLES = [
  // American (27 CFR 5.143 unless noted)
  { id: "us-bourbon", family: "american", name: "Bourbon", coloring: false, source: SRC.cfr,
    rules: ["At least 51% corn in the mash.", ...usBourbonProcess, "No added coloring or flavoring.", "Must be made in the United States."],
    notes: "Often sweet up front: caramel, vanilla and toasted oak from the new charred barrel. Wheated bourbons tend softer; high-rye bourbons spicier." },
  { id: "us-straight-bourbon", family: "american", name: "Straight bourbon", coloring: false, source: SRC.cfr,
    rules: ["Everything required of bourbon.", "Aged at least 2 years in new charred oak.", "No added coloring, flavoring or blending materials.", "If younger than 4 years, the label must state its age."],
    notes: "The bourbon most people buy. Age and barrel strongly shape it." },
  { id: "us-tennessee", family: "american", name: "Tennessee whiskey", coloring: false, source: SRC.tn,
    rules: ["Made in Tennessee from at least 51% corn.", "Distilled to 160 proof or less.", "Filtered through maple charcoal before aging (the Lincoln County Process).", "Aged in new charred oak in Tennessee, entering the barrel at 125 proof or less.", "Bottled at 80 proof or more.", "One distillery (Prichard's) is exempt from the charcoal step under a grandfather clause."],
    notes: "Bourbon-like, with the charcoal step often credited with a softer, rounder spirit." },
  { id: "us-rye", family: "american", name: "Rye whiskey", coloring: true, source: SRC.cfr,
    rules: ["At least 51% rye in the mash.", ...usBourbonProcess, "Coloring and flavoring are allowed unless it's labeled straight."],
    notes: "Usually spicier and drier than bourbon: black pepper, baking spice, herbal and minty notes." },
  { id: "us-straight-rye", family: "american", name: "Straight rye", coloring: false, source: SRC.cfr,
    rules: ["At least 51% rye.", ...usBourbonProcess, "Aged at least 2 years in new charred oak.", "No added coloring or flavoring."],
    notes: "Rye spice with more oak structure from required aging." },
  { id: "us-wheat", family: "american", name: "Wheat whiskey", coloring: true, source: SRC.cfr,
    rules: ["At least 51% wheat in the mash.", ...usBourbonProcess, "Straight wheat whiskey adds at least 2 years of aging and no additives."],
    notes: "Typically soft, bready and gentle." },
  { id: "us-corn", family: "american", name: "Corn whiskey", coloring: true, source: SRC.cfr,
    rules: ["At least 80% corn in the mash.", "Distilled to 160 proof or less.", "Aging is optional. If aged, it goes into used or uncharred new oak at 125 proof or less.", "Straight corn whiskey is aged at least 2 years."],
    notes: "Often young and light: sweet corn and grain, with less oak than bourbon." },
  { id: "us-malt", family: "american", name: "Malt whiskey (American)", coloring: true, source: SRC.cfr,
    rules: ["At least 51% malted barley.", ...usBourbonProcess],
    notes: "Malty and bready, shaped heavily by the new charred oak." },
  { id: "us-single-malt", family: "american", name: "American single malt", coloring: true, source: SRC.cfr,
    rules: ["100% malted barley, distilled at one US distillery to 160 proof or less.", "Aged only in the US, in oak barrels of 700 liters or less (new or used, charred or not).", "No additives except caramel coloring, and only if the label says so.", "A newer category: the rule took effect in 2025, with a transition period to 2030."],
    notes: "Varies widely by distillery and cask. Often malty and fruity." },
  { id: "us-blended", family: "american", name: "Blended American whiskey", coloring: true, source: SRC.cfr,
    rules: ["At least 20% straight whiskey.", "The rest can be other whiskey or neutral spirits.", "Coloring and flavoring are allowed."],
    notes: "Usually light and mixable." },
  { id: "us-other", family: "american", name: "Other American whiskey", coloring: true, source: SRC.cfr,
    rules: ["Distilled from grain to less than 190 proof.", "Stored in oak (no minimum time).", "Bottled at 80 proof or more.", "Covers craft whiskeys that don't fit a specific type."],
    notes: "Anything goes: judge it on its own merits." },

  // Scotch (Scotch Whisky Regulations 2009)
  { id: "sc-single-malt", family: "scotch", name: "Single malt Scotch", coloring: true, source: SRC.swr, regions: true,
    rules: ["Distilled in Scotland at a single distillery, from only water and malted barley, in pot stills.", ...scotchCore.slice(1)],
    notes: "The widest range in whisky. Region, cask and peat make the biggest differences." },
  { id: "sc-blended-malt", family: "scotch", name: "Blended malt Scotch", coloring: true, source: SRC.swr, regions: true,
    rules: ["A blend of single malt Scotch whiskies from more than one distillery.", ...scotchCore.slice(1)],
    notes: "Malt character without a single distillery's signature." },
  { id: "sc-blended", family: "scotch", name: "Blended Scotch", coloring: true, source: SRC.swr,
    rules: ["A blend of one or more single malts with one or more single grains.", ...scotchCore],
    notes: "Most Scotch sold is blended. Often lighter and smoother, built for consistency." },
  { id: "sc-single-grain", family: "scotch", name: "Single grain Scotch", coloring: true, source: SRC.swr,
    rules: ["Distilled in Scotland at a single distillery, but not a single malt: other cereals are used, often in column stills.", ...scotchCore.slice(1)],
    notes: "Typically light, sweet and grainy, often showing vanilla from the cask." },
  { id: "sc-blended-grain", family: "scotch", name: "Blended grain Scotch", coloring: true, source: SRC.swr,
    rules: ["A blend of single grain Scotch whiskies from more than one distillery.", ...scotchCore.slice(1)],
    notes: "Light and sweet. A small category." },

  // Irish (Irish Whiskey Technical File)
  { id: "ie-pot-still", family: "irish", name: "Pot still Irish whiskey", coloring: true, source: SRC.irish,
    rules: ["At least 30% malted barley and at least 30% unmalted barley, with up to 5% other cereals.", "Distilled in pot stills. 'Single pot still' means from one distillery.", ...irishCore],
    notes: "The uniquely Irish style. Unmalted barley often gives a creamy texture and spicy edge." },
  { id: "ie-malt", family: "irish", name: "Malt Irish whiskey", coloring: true, source: SRC.irish,
    rules: ["100% malted barley, distilled in pot stills. 'Single malt' means from one distillery.", ...irishCore],
    notes: "Often fruity and malty, frequently triple distilled for a lighter spirit." },
  { id: "ie-grain", family: "irish", name: "Grain Irish whiskey", coloring: true, source: SRC.irish,
    rules: ["No more than 30% malted barley, the rest unmalted cereals such as corn, wheat or barley.", "Distilled in column stills.", ...irishCore],
    notes: "Light, sweet and smooth." },
  { id: "ie-blended", family: "irish", name: "Blended Irish whiskey", coloring: true, source: SRC.irish,
    rules: ["A blend of two or more of the other styles: pot still, malt and grain.", ...irishCore],
    notes: "Most Irish whiskey sold is blended. Usually smooth and approachable." },

  // Japanese (JSLMA standard; style names are common label terms)
  { id: "jp-single-malt", family: "japanese", name: "Japanese single malt", coloring: true, source: SRC.japan,
    rules: ["Commonly means malted barley from a single distillery.", ...japanCore],
    notes: "Often precise and balanced. Some use Japanese oak (mizunara), associated with incense and sandalwood notes." },
  { id: "jp-blended", family: "japanese", name: "Japanese blended", coloring: true, source: SRC.japan,
    rules: ["Commonly a blend of malt and grain whiskies.", ...japanCore],
    notes: "Built for harmony and smoothness." },
  { id: "jp-grain", family: "japanese", name: "Japanese grain", coloring: true, source: SRC.japan,
    rules: ["Commonly made mostly from grains such as corn, in column stills.", ...japanCore],
    notes: "Light and sweet." },
  { id: "jp-other", family: "japanese", name: "Whisky from Japan (outside the standard)", coloring: true, source: SRC.japan,
    rules: ["Bottles that don't meet the industry standard above, for example blends using imported whisky or rice-based spirits.", "Some still say 'Product of Japan' on the label."],
    notes: "Judge it on its own merits." },

  // Canadian
  { id: "ca-whisky", family: "canadian", name: "Canadian whisky", coloring: true, source: SRC.canada,
    rules: ["Made from a mash of cereal grains, then mashed, distilled and aged in Canada.", "Aged at least 3 years in 'small wood' (casks of 700 liters or less).", "Bottled at 40% ABV or more.", "Caramel and flavoring are allowed. Up to 9.09% may be other spirits aged at least 2 years, or wine."],
    notes: "Often light and smooth, usually built by blending separately distilled grains." },
  { id: "ca-rye", family: "canadian", name: "Canadian rye", coloring: true, source: SRC.canada,
    rules: ["Canadian rules treat 'Canadian rye whisky' the same as Canadian whisky.", "Unlike US rye, it doesn't need a rye-majority mash. Many are mostly corn with rye for flavor.", "Aged at least 3 years in small wood, bottled at 40% ABV or more."],
    notes: "Ranges from light and smooth to genuinely rye-forward and spicy." },

  // World
  { id: "world", family: "world", name: "Whisky from another country", coloring: true, source: null, country: true,
    rules: ["Rules depend on the country. Many follow Scotch-style rules: grain, oak or wood aging, and 40% ABV or more.", "Add the country below."],
    notes: "Taiwan, India, England, Australia and many others make serious whisky." },
];

// Scotch regions protected by the 2009 regulations, plus the informal Islands grouping.
export const SCOTCH_REGIONS = [
  { key: "Speyside", notes: "Often fruity and honeyed, frequently with sherry cask influence." },
  { key: "Highland", notes: "The broadest region: from light and floral to rich, with occasional light smoke." },
  { key: "Lowland", notes: "Often light, grassy and floral." },
  { key: "Islay", notes: "Known for heavily peated whiskies: smoke, brine, iodine. Not every Islay is peated." },
  { key: "Campbeltown", notes: "A small region, often briny and oily with some smoke." },
  { key: "Islands", notes: "Not a legal region (part of the Highlands), but a common label term. Often maritime." },
];

export const WHISKEY_SOURCES = Object.values(SRC);
export const styleById = (id) => STYLES.find((s) => s.id === id);
