// Scoresheet structure, modeled on the BJCP Beer Scoresheet (structured version).
// Scoresheet format Copyright 2019, Beer Judge Certification Program, Inc.
// All tip and education text is written for this app.
//
// Tips: { what, how } where "what" explains the term and "how" says how to find it in the glass.

const NLMH = ["None", "L", "M", "H"];

// Descriptor suggestions for the optional tag boxes. Custom tags are allowed too.
export const DESCRIPTORS = {
  malt: [
    "Grainy", "Crackery", "Biscuit", "Bready", "Fresh bread crust", "Toasty", "Nutty", "Honey",
    "Caramel", "Toffee", "Molasses", "Raisin", "Dark fruit", "Chocolate", "Coffee", "Roasty",
    "Burnt", "Smoky", "Sweet", "Doughy",
  ],
  hops: [
    "Citrus", "Grapefruit", "Lemon", "Orange", "Tropical", "Mango", "Pineapple", "Passion fruit",
    "Stone fruit", "Melon", "Berry", "Pine", "Resin", "Dank", "Herbal", "Grassy", "Floral",
    "Spicy", "Earthy", "Woody", "Minty",
  ],
  ferm: [
    "Clean", "Crisp", "Banana", "Bubblegum", "Pear", "Apple", "Stone fruit", "Citrus", "Berry",
    "Clove", "Peppery", "Bready yeast", "Cidery", "Wine-like", "Tart", "Lemony", "Funky",
    "Barnyard", "Earthy", "Sulfur", "Struck match",
  ],
};

export const SECTIONS = [
  {
    key: "aroma", label: "Aroma", max: 12,
    tip: {
      what: "What you smell before you sip. Worth 12 of the 50 points, because aroma carries most of what we call flavor.",
      how: "Swirl, then take a few short sniffs right away. Aroma fades fast as the beer warms and the foam settles, so judge it first. Smell again later; some notes open up as it warms.",
    },
    rows: [
      { key: "malt", label: "Malt", scale: NLMH, tags: "malt",
        tip: { what: "Smells from the grain. Pale malts read like crackers or bread dough, kilned malts like toast or caramel, roasted malts like coffee or dark chocolate.",
          how: "Think bakery. If it smells like a bread aisle, a caramel candy, or a coffee shop, that's malt." } },
      { key: "hops", label: "Hops", scale: NLMH, tags: "hops",
        tip: { what: "Smells from the hops, a flower used like a spice. American hops lean citrus, pine, and tropical fruit. European hops lean floral, herbal, spicy, earthy.",
          how: "Think produce section and garden. Grapefruit peel, mango, pine needles, fresh-cut flowers, or black pepper usually point to hops." } },
      { key: "ferm", label: "Fermentation", scale: NLMH, tags: "ferm",
        tip: { what: "Smells made by the yeast. Ale yeast can add fruit (banana, pear, apple) or spice (clove, pepper). Lager yeast should smell clean, letting malt and hops show.",
          how: "If a fruit or spice note isn't explained by malt or hops, it's probably yeast. A German hefeweizen smelling like banana and clove is the classic example." } },
    ],
  },
  {
    key: "appearance", label: "Appearance", max: 3,
    tip: {
      what: "Color, clarity, and foam. Only 3 points, so it rarely decides a score, but it tells you what to expect.",
      how: "Hold the glass up to a light or a white background. Note the color, whether you can see through it, and how the foam looks and lasts.",
    },
    rows: [
      { key: "color", label: "Color", wide: true,
        scale: ["Pale straw", "Straw", "Gold", "Deep gold", "Pale amber", "Amber", "Copper", "Brown", "Dark brown", "Black"],
        srm: [2, 3, 5, 7, 9, 12, 15, 20, 30, 40],
        swatch: ["#F6EFA0", "#F2DE6B", "#E8C33C", "#D9A42A", "#C9862A", "#B86E1F", "#9E521C", "#6A3418", "#3F2014", "#1B0E09"],
        tip: { what: "Beer color is measured in SRM, from about 2 for the palest lagers to 40 and up for stouts. Light lagers sit near 2 to 4, pale ales and IPAs 5 to 10, ambers and Oktoberfests 10 to 17, browns and porters 18 to 30.",
          how: "Judge in the glass, not the can. Swatches marked with a dot fall inside your selected style's SRM range." } },
      { key: "clarity", label: "Clarity", scale: ["Brilliant", "Hazy", "Opaque"],
        tip: { what: "Brilliant means you could read through it. Haze comes from yeast, proteins, or hops left in suspension.",
          how: "Haze is a flaw in a pilsner and expected in a hazy IPA or hefeweizen. Opaque usually just means the beer is too dark to see through." } },
      { key: "head", label: "Head", wide: true, scale: ["Rocky", "Small", "Effervescent", "Mixed"],
        tip: { what: "The foam's texture. Rocky: thick, uneven peaks that stand up, common in Belgian ales and wheat beers. Small: fine, tight bubbles that look creamy. Effervescent: big, fizzy bubbles that pop quickly, like soda. Mixed: a blend of bubble sizes.",
          how: "Look right after the pour, then again a minute later. Foam is built from malt proteins and hop compounds, so a beer with no head at all may be undercarbonated or poured into a greasy glass." } },
      { key: "retention", label: "Retention", scale: ["Quick", "Medium", "Lasting"],
        tip: { what: "How long the foam holds before it collapses.",
          how: "Check after a minute or two. Lasting foam often leaves lacing, rings of foam stuck to the glass as you drink." } },
      { key: "headColor", label: "Head color", scale: ["White", "Ivory", "Beige", "Tan"],
        tip: { what: "Foam color follows the malt. Pale beers have white heads, darker beers move toward beige and tan.",
          how: "A stout with a white head, or a pilsner with a tan one, is worth a second look." } },
    ],
  },
  {
    key: "flavor", label: "Flavor", max: 20,
    tip: {
      what: "What you taste. The biggest section at 20 points, covering malt, hops, bitterness, yeast, balance, and finish.",
      how: "Take a real sip and let it cover your whole tongue. Notice the first impression, the middle, and what's left after you swallow. Many aroma notes come back here, sometimes stronger.",
    },
    rows: [
      { key: "malt", label: "Malt", scale: NLMH, tags: "malt",
        tip: { what: "Malt flavor is the sweet, bready backbone. It ranges from cracker and white bread to caramel, toffee, dark fruit, chocolate, and coffee.",
          how: "Malt sits in the middle of the sip and feels round. Graham crackers, toast, caramel candy, or espresso are all malt flavors." } },
      { key: "hops", label: "Hops", scale: NLMH, tags: "hops",
        tip: { what: "Hop flavor is the taste of the hop itself, separate from bitterness: citrus, tropical fruit, pine, herbs, flowers, spice.",
          how: "A hazy IPA can taste intensely of mango with low bitterness. That's lots of hop flavor, not much bitterness." } },
      { key: "bitterness", label: "Bitterness",scale: NLMH,
        tip: { what: "Bitterness comes mostly from hops boiled in the beer. It's the drying, slightly sharp sensation that balances malt sweetness, measured in IBU.",
          how: "Feel for it at the back of your tongue and in the aftertaste. Think black coffee, grapefruit pith, or dark chocolate. A light lager sits near 10 IBU, a West Coast IPA can pass 60." } },
      { key: "ferm", label: "Fermentation", scale: NLMH, tags: "ferm",
        tip: { what: "Yeast flavors: fruity esters like banana, pear, or apple, spicy phenols like clove or pepper, tartness from souring bacteria, or a clean, crisp lager profile.",
          how: "Clean is a real answer. In a lager, tasting nothing from the yeast means it did its job." } },
      { key: "balance", label: "Balance", scale: ["Hoppy", "", "Even", "", "Malty"], ends: true,
        tip: { what: "Whether hops (bitterness and hop flavor) or malt (sweetness and grain) leads. Hoppy-leaning beers taste sharp, dry, and bright. Malty-leaning beers taste round, sweet, and bready.",
          how: "Compare an IPA (hoppy) with a German bock (malty). Judge the balance against the style; a malty IPA or a bitter bock is off target." } },
      { key: "finish", label: "Finish", scale: ["Dry", "", "Med", "", "Sweet"], ends: true,
        tip: { what: "How the beer ends after you swallow. Dry beers leave your mouth clean and ready for the next sip. Sweet beers linger, sometimes sticky.",
          how: "Wait a few seconds after swallowing. Notice what stays: bitterness, sweetness, roast, alcohol, or nothing." } },
    ],
  },
  {
    key: "mouthfeel", label: "Mouthfeel", max: 5,
    tip: {
      what: "How the beer feels, not how it tastes: weight, fizz, warmth, smoothness.",
      how: "Hold a sip and move it around. Is it watery or chewy, prickly or soft, warming or harsh?",
    },
    rows: [
      { key: "body", label: "Body", scale: ["Thin", "M", "Full"],
        tip: { what: "The beer's weight on your tongue. Leftover sugars, proteins, and oats or wheat add body.",
          how: "Think skim milk to whole milk. A light lager is thin, an imperial stout is full." } },
      { key: "carbonation", label: "Carbonation", scale: NLMH,
        tip: { what: "The fizz level.",
          how: "Low feels soft and still, like cask ale. High feels prickly and lively, like Champagne or a Belgian tripel." } },
      { key: "warmth", label: "Warmth", scale: NLMH,
        tip: { what: "The warming sensation from alcohol.",
          how: "Pleasant and gentle in strong styles like barleywine. In a normal-strength beer, or when it burns like a shot, it's a problem." } },
      { key: "creaminess", label: "Creaminess", scale: NLMH,
        tip: { what: "A soft, smooth, velvety texture.",
          how: "Oatmeal stouts, nitro pours, and hazy IPAs are often creamy. Think of the feel of a milkshake versus a soda." } },
      { key: "astringency", label: "Astringency", scale: NLMH,
        tip: { what: "A puckering, drying, rough feeling, like over-steeped black tea or a dry red wine. Not the same as bitterness.",
          how: "Rub your tongue on the roof of your mouth after a sip. A sandpapery feel is astringency. Usually a flaw." } },
    ],
  },
  {
    key: "overall", label: "Overall", max: 10,
    tip: {
      what: "Your overall impression of the beer as an example of its style, plus how much you enjoyed it.",
      how: "Step back. Would you serve this as an example of the style? Would you order another?",
    },
    rows: [
      { key: "style", label: "Style", scale: ["Classic", "", "", "", "Not to style"], ends: true,
        tip: { what: "Stylistic accuracy: how well the beer represents the style you picked.",
          how: "Open the style guide above and compare. A great beer can still miss its style." } },
      { key: "merit", label: "Technical", scale: ["Flawless", "", "", "", "Flawed"], ends: true,
        tip: { what: "Technical merit: whether the beer was brewed and handled well, free of off-flavors.",
          how: "Anything marked in the Flaws panel belongs here." } },
      { key: "intangibles", label: "Intangibles", scale: ["Wonderful", "", "", "", "Lifeless"], ends: true,
        tip: { what: "The part a checklist can't capture: drinkability, character, whether it's memorable.",
          how: "Two technically clean beers can feel very different. This is where that goes." } },
    ],
  },
];

export const TOTAL_MAX = SECTIONS.reduce((a, s) => a + s.max, 0); // 50

// Flaws: what it tastes like, plus the usual cause. Dirty draft lines are named where they're a common source.
export const FLAWS = [
  { key: "acetaldehyde", label: "Acetaldehyde", tip: "Green apple, fresh-cut pumpkin, or latex paint.", cause: "Beer pulled off the yeast too early, or oxygen exposure. Also a sign of dirty draft lines." },
  { key: "alcoholic", label: "Alcoholic / Hot", tip: "Harsh, burning alcohol rather than gentle warmth.", cause: "Fermentation ran too warm or the yeast was stressed." },
  { key: "astringent", label: "Astringent", tip: "Puckering, drying, tannic, like over-steeped tea.", cause: "Grain husk tannins from over-sparging or very hard water. Sometimes harsh roasted malt." },
  { key: "brett", label: "Brettanomyces", tip: "Barnyard, horse blanket, leather, smoky clove.", cause: "Wild Brett yeast. Expected in some sours and saisons, a flaw elsewhere." },
  { key: "diacetyl", label: "Diacetyl", tip: "Butter or butterscotch, often with a slick feel on the tongue.", cause: "Yeast byproduct not cleaned up before packaging, or bacteria. Dirty draft lines are a frequent culprit at bars." },
  { key: "dms", label: "DMS", tip: "Cooked corn, canned corn, or cooked cabbage.", cause: "From pale malts when the boil is too short or too gentle, or the wort cooled slowly." },
  { key: "estery", label: "Estery", tip: "Fruity notes like banana, pear, or apple beyond what the style allows.", cause: "Warm fermentation or the yeast strain. A feature in many ales, a flaw in lagers." },
  { key: "grassy", label: "Grassy", tip: "Fresh-cut grass, hay, or green leaves.", cause: "Old or poorly stored hops or malt, or heavy dry hopping left too long." },
  { key: "lightstruck", label: "Light-struck", tip: "Skunky.", cause: "Light hitting hop compounds, most often in clear or green bottles. It can happen within minutes in sunlight." },
  { key: "medicinal", label: "Medicinal", tip: "Band-aid, antiseptic, chlorine.", cause: "Chlorine or chloramine in brewing water, or sanitizer left behind." },
  { key: "metallic", label: "Metallic", tip: "Tinny, coin-like, or blood-like.", cause: "Exposed metal in brewing equipment, or water high in iron." },
  { key: "musty", label: "Musty", tip: "Stale, moldy, damp cellar or wet basement.", cause: "Mold, sometimes from cork or wood, or very poor storage." },
  { key: "oxidized", label: "Oxidized", tip: "Wet cardboard, stale paper, or sherry.", cause: "Oxygen exposure plus age and heat. Common in old or warm-stored beer, and why fresh IPAs matter." },
  { key: "plastic", label: "Plastic", tip: "Plastic, burnt plastic, or chemical.", cause: "Wild yeast or bacteria, or sanitizer and water issues." },
  { key: "solvent", label: "Solvent / Fusel", tip: "Nail polish remover, paint thinner, sharp hot alcohol.", cause: "Fermentation far too warm, or stressed yeast." },
  { key: "sour", label: "Sour / Acidic", tip: "Tart, lemony, or vinegar.", cause: "Bacteria where they weren't invited. Expected in sour styles. Vinegar notes point to acetic bacteria and oxygen." },
  { key: "smoky", label: "Smoky", tip: "Smoke, campfire, or ash.", cause: "Smoked malt outside smoked styles, or phenols from wild yeast." },
  { key: "spicy", label: "Spicy", tip: "Clove or black pepper.", cause: "Phenols from certain yeasts. Right in hefeweizen and many Belgian ales, wrong in most other styles." },
  { key: "sulfur", label: "Sulfur", tip: "Rotten egg, struck match, or burnt rubber.", cause: "Yeast byproduct, common in young lagers. Often fades with age." },
  { key: "vegetal", label: "Vegetal", tip: "Cooked or rotting vegetables, celery, cabbage.", cause: "Bacterial contamination or DMS gone further." },
];

export const FLAW_LEVELS = ["L", "M", "H"];

export const BANDS = [
  { min: 45, label: "Outstanding", note: "World-class example of style" },
  { min: 38, label: "Excellent", note: "Exemplifies style well, needs minor fine-tuning" },
  { min: 30, label: "Very good", note: "Generally within style, minor flaws" },
  { min: 21, label: "Good", note: "Misses the mark on style or has moderate flaws" },
  { min: 14, label: "Fair", note: "Off-flavors or major style deficiencies" },
  { min: 0, label: "Problematic", note: "Major off-flavors dominate" },
];

