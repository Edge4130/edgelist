// WhiskeyList scoresheet: 100 points. Tip text written for this app.
const NLMH = ["None", "L", "M", "H"];

export const DESCRIPTORS = {
  sweet: ["Caramel", "Vanilla", "Toffee", "Brown sugar", "Honey", "Maple", "Butterscotch", "Molasses", "Chocolate", "Marzipan"],
  fruit: ["Cherry", "Orange peel", "Lemon", "Apple", "Pear", "Banana", "Raisin", "Dried fig", "Stone fruit", "Tropical", "Berry", "Sherry"],
  spice: ["Cinnamon", "Clove", "Nutmeg", "Black pepper", "Rye spice", "Ginger", "Mint", "Anise", "Baking spice"],
  oak: ["Toasted oak", "Char", "Cedar", "Sawdust", "Leather", "Tobacco", "Coconut", "Dill", "Tannic"],
  grain: ["Corn", "Bread", "Cereal", "Biscuit", "Malt", "Nutty", "Porridge"],
  smoke: ["Campfire", "Peat", "Ash", "Iodine", "Medicinal", "Seaweed", "Brine", "Bacon"],
  finish: ["Warm", "Dry", "Sweet", "Spicy", "Oaky", "Smoky", "Bitter", "Clean", "Lingering"],
};

const flavorRows = (where) => [
  { key: "sweet", label: "Sweet", scale: NLMH, tags: "sweet",
    tip: { what: `Sweet ${where}: caramel, vanilla, toffee, honey. Much of it comes from the barrel's toasted and charred wood.`,
      how: "Think dessert aisle. Bourbon in new charred oak is usually sweet; many Scotches are less so." } },
  { key: "fruit", label: "Fruit", scale: NLMH, tags: "fruit",
    tip: { what: `Fruit ${where}: fresh fruit (apple, pear, citrus) from fermentation, or dried fruit (raisin, fig) often from sherry casks.`,
      how: "Fresh and bright points to the spirit itself; jammy and dried often points to the cask." } },
  { key: "spice", label: "Spice", scale: NLMH, tags: "spice",
    tip: { what: `Spice ${where}: pepper, cinnamon, clove, mint. Rye grain and oak are the usual sources.`,
      how: "Rye whiskeys lead with spice. A peppery tingle is spice; a burn is alcohol heat." } },
  { key: "oak", label: "Oak", scale: NLMH, tags: "oak",
    tip: { what: `Wood ${where}: toasted oak, char, leather, tobacco, coconut. Stronger with age and with new barrels.`,
      how: "Pleasant oak tastes like a cigar box or a lumber yard. Too much turns bitter and drying." } },
  { key: "grain", label: "Grain", scale: NLMH, tags: "grain",
    tip: { what: `Grain ${where}: corn, bread, cereal, malt. Strongest in young whiskeys and those with less barrel influence.`,
      how: "Breakfast cereal and bread crust. Corn whiskey and young craft whiskeys show it most." } },
  { key: "smoke", label: "Smoke", scale: NLMH, tags: "smoke", spotlight: ["scotch"], spotlightNote: "Peat smoke is common in Scotch, especially from Islay.",
    tip: { what: `Smoke ${where}: usually peat, from malted barley dried over peat fires. Can read as campfire, ash, iodine, seaweed or medicinal.`,
      how: "Many Scotches, especially from Islay, are peated. Most bourbon has none: char from the barrel is different and reads as toasty rather than smoky." } },
];

export const SECTIONS = [
  {
    key: "appearance", label: "Appearance", max: 10,
    tip: { what: "Color, clarity and how the whiskey moves in the glass. Only 10 points; it sets expectations more than it decides scores.",
      how: "Tilt the glass against a white background. Look at color, clarity, then swirl and watch the legs." },
    rows: [
      { key: "color", label: "Color", wide: true,
        scale: ["Pale straw", "Straw", "Gold", "Amber", "Copper", "Mahogany", "Deep brown"],
        swatch: ["#F3E7A6", "#EBCF6A", "#DDAA3A", "#C47F22", "#A85A1E", "#7A3519", "#4A2212"],
        tip: { what: "Color comes from the barrel. Longer aging, new charred oak and wine or sherry casks all darken whiskey.",
          how: "In styles that allow caramel coloring, color is a weak guide to age. Bourbon and straight whiskeys can't add any, so their color is all barrel." } },
      { key: "clarity", label: "Clarity", scale: ["Brilliant", "Clear", "Hazy"],
        tip: { what: "Most whiskey is clear. Haze can appear in non-chill-filtered whiskey, especially after adding water or ice.",
          how: "That haze is natural oils and fatty acids, not a flaw. Bottles labeled non-chill-filtered often show it." } },
      { key: "legs", label: "Legs", scale: ["Thin", "Medium", "Thick"],
        tip: { what: "The streaks that run down the glass after a swirl.",
          how: "Legs reflect alcohol strength and texture, not quality. High-proof whiskeys show slow, thick legs." } },
    ],
  },
  {
    key: "nose", label: "Nose", max: 25,
    tip: { what: "What you smell. A quarter of the score, because most of what we call taste happens in the nose.",
      how: "Keep your mouth slightly open and sniff gently at the rim. Don't bury your nose: alcohol numbs it fast. Move around the glass, take a break, come back. A few drops of water often open it up." },
    rows: [...flavorRows("aromas"),
      { key: "heat", label: "Alcohol heat", scale: NLMH,
        tip: { what: "The prickle of ethanol in the nose.",
          how: "Some heat is expected, more so at high proof. A sharp sting that hides everything else counts against the whiskey." } }],
  },
  {
    key: "palate", label: "Palate", max: 30,
    tip: { what: "What you taste, the biggest section. Includes flavor, weight and how it develops in your mouth.",
      how: "Take a small first sip to adjust to the alcohol, then a real sip held for a few seconds. Notice the start, the middle and how it changes." },
    rows: [...flavorRows("flavors"),
      { key: "body", label: "Body", scale: ["Thin", "Medium", "Oily"],
        tip: { what: "The whiskey's weight and texture.",
          how: "Thin feels watery. Oily coats your tongue. Pot still and non-chill-filtered whiskeys often feel richer." } }],
  },
  {
    key: "finish", label: "Finish", max: 20,
    tip: { what: "What stays after you swallow. A long, pleasant finish is one of the marks of a great whiskey.",
      how: "After swallowing, breathe out slowly through your nose and count how long the flavor lasts." },
    rows: [
      { key: "length", label: "Length", scale: ["Short", "Medium", "Long"],
        tip: { what: "How long the flavor lasts after swallowing.",
          how: "Short fades in a few seconds. Long lingers for a minute or more." } },
      { key: "heat", label: "Heat", scale: NLMH,
        tip: { what: "Warmth from alcohol as it goes down.",
          how: "A gentle warmth down the chest is the classic 'Kentucky hug.' A harsh burn is a fault." } },
      { key: "character", label: "Character", scale: ["Dry", "", "Even", "", "Sweet"], ends: true, tags: "finish",
        tip: { what: "How the finish leans: dry and drying, or sweet and lingering.",
          how: "Tag what stays with you: oak, spice, smoke, sweetness." } },
    ],
  },
  {
    key: "overall", label: "Overall", max: 15,
    tip: { what: "Your overall judgment: how well it all fits together and how much you'd want another pour.",
      how: "Step back from the parts. Would you buy this bottle? Recommend it?" },
    rows: [
      { key: "balance", label: "Balance", scale: ["Integrated", "", "", "", "Disjointed"], ends: true,
        tip: { what: "Whether sweetness, spice, oak, fruit and alcohol work together.",
          how: "Disjointed whiskey has one element sticking out, like raw alcohol or heavy oak." } },
      { key: "complexity", label: "Complexity", scale: ["Layered", "", "", "", "Simple"], ends: true,
        tip: { what: "How many distinct things you can find, and whether they change as you sip.",
          how: "Simple isn't bad, especially at a low price. Layered whiskeys reveal more with time and water." } },
      { key: "intangibles", label: "Intangibles", scale: ["Memorable", "", "", "", "Forgettable"], ends: true,
        tip: { what: "Drinkability, character, the part a checklist misses.",
          how: "Would you remember this pour next week?" } },
    ],
  },
];

export const FLAWS = [
  { key: "hot", label: "Too hot", tip: "Burning, sharp alcohol that hides the flavor.", cause: "Very young whiskey, or high proof without enough flavor to carry it." },
  { key: "solvent", label: "Solvent", tip: "Nail polish remover, paint thinner.", cause: "Heavy fusel alcohols from a rushed or poorly cut distillation." },
  { key: "overoaked", label: "Over-oaked", tip: "Bitter, tannic, drying wood, like chewing a pencil.", cause: "Too long in an active barrel, or small barrels used to force age quickly." },
  { key: "young", label: "Young / grainy", tip: "Raw grain, wet cardboard, new-make spirit character.", cause: "Not enough time in the barrel to round off the spirit." },
  { key: "sulfur", label: "Sulfur", tip: "Struck match, rubber, cooked cabbage.", cause: "From distillation, or from sulfur candles used to clean wine casks before filling." },
  { key: "musty", label: "Musty / cork", tip: "Damp cardboard, wet basement, moldy.", cause: "Cork taint (TCA) from a bad cork, or a musty cask." },
  { key: "metallic", label: "Metallic", tip: "Tinny, coin-like.", cause: "Equipment or water contamination." },
  { key: "soapy", label: "Soapy", tip: "Soap or detergent.", cause: "Fatty acids, or a glass with soap residue. Rinse the glass and try again first." },
  { key: "sour", label: "Sour", tip: "Vinegar or sour milk.", cause: "Bacterial problems during fermentation." },
];

export const BANDS = [
  { min: 90, label: "Exceptional", color: "#2F7A3D", note: "A standout pour" },
  { min: 80, label: "Excellent", color: "#4E8A3A", note: "Excellent, with minor quibbles" },
  { min: 70, label: "Very good", color: "#C8862B", note: "Very good, worth buying" },
  { min: 60, label: "Good", color: "#B26A1F", note: "Good, but unremarkable" },
  { min: 50, label: "Fair", color: "#8E3B1F", note: "Noticeable problems" },
  { min: 0, label: "Problematic", color: "#7A2020", note: "Major flaws" },
];
