/* Kigali Kitchen — base data (v2, local-first)
   Prices are ESTIMATES in Rwandan francs (RWF), late 2026. The app updates them from your receipts.

   buy: "month"     -> keeps all month (pantry, freezer, onions...)
        "fortnight" -> big shop covers days 1-14, day-15 top-up covers 15-30
        "week"      -> fresh: bought at each weekly shop
   origin: local (made/grown in Rwanda) | regional (East Africa) | imported
   aka: other names used on receipts / at the market (English, French, Kinyarwanda)
*/

const SECTIONS = [
  "Fruit & vegetables",
  "Meat",
  "Dairy & eggs",
  "Bread",
  "Rice, flour & pasta",
  "Beans & dried peas",
  "Oil, sauces & spreads",
  "Spices & seasoning",
  "Baking",
  "Snacks & drinks",
  "Household",
];

const WHERE = {
  any: "Simba or Spar",
  fresh: "Simba / Spar, or cheaper at Kimironko market",
  butcher: "Butchery counter (ask for halal)",
};

const INGREDIENTS = [
  // ---------- Fruit & vegetables ----------
  { id: "tomato", name: "Tomatoes", sec: 0, origin: "local", unit: "g", pack: 1000, packLabel: "1 kg", price: 1200, buy: "week", where: "fresh", each: [120, "tomato"],
    aka: ["tomato", "tomate", "inyanya"], keep: "Ripen on the counter, then fridge.",
    subs: ["Tomato paste: 1 sachet + 100 ml water replaces about 300 g tomatoes in sauces.", "Cherry tomatoes for salads."] },
  { id: "onion", name: "Onions", sec: 0, origin: "local", unit: "g", pack: 1000, packLabel: "1 kg", price: 1000, buy: "month", where: "fresh", each: [150, "onion"],
    aka: ["onion", "oignon", "igitunguru", "ibitunguru"], keep: "Cool, dark, dry place, not the fridge. 4+ weeks.",
    subs: ["Spring onions (4 per onion).", "Leeks."] },
  { id: "garlic", name: "Garlic", sec: 0, origin: "local", unit: "clove", pack: 40, packLabel: "bag ~200 g (≈40 cloves)", price: 1500, buy: "month", where: "fresh",
    aka: ["garlic", "ail", "tungurusumu"], keep: "Dry place. A month.",
    subs: ["Garlic paste (1 tsp = 1 clove)."] },
  { id: "ginger", name: "Fresh ginger", sec: 0, origin: "local", unit: "g", pack: 250, packLabel: "250 g", price: 600, buy: "month", where: "fresh",
    aka: ["ginger", "gingembre", "tangawizi"], keep: "Freeze it whole and grate from frozen.",
    subs: ["Leave out: the dish is milder but fine."] },
  { id: "potato", name: "Potatoes (Irish)", sec: 0, origin: "local", unit: "g", pack: 2000, packLabel: "2 kg", price: 1500, buy: "fortnight", where: "fresh", each: [170, "potato"],
    aka: ["potato", "pomme de terre", "pommes", "ibirayi", "irish"], keep: "Dark, airy place away from onions.",
    subs: ["Sweet potatoes."] },
  { id: "sweetpot", name: "Sweet potatoes", sec: 0, origin: "local", unit: "g", pack: 2000, packLabel: "2 kg", price: 1400, buy: "fortnight", where: "fresh", each: [250, "sweet potato"],
    aka: ["sweet potato", "patate douce", "ibijumba"], keep: "Cool dark place, not the fridge. 2–3 weeks.",
    subs: ["Irish potatoes.", "Butternut / pumpkin (igihaza)."] },
  { id: "carrot", name: "Carrots", sec: 0, origin: "local", unit: "g", pack: 1000, packLabel: "1 kg", price: 900, buy: "fortnight", where: "fresh", each: [80, "carrot"],
    aka: ["carrot", "carotte", "karoti"], keep: "Fridge drawer in a bag. 3 weeks.",
    subs: ["Butternut or pumpkin.", "Extra cabbage."] },
  { id: "cabbage", name: "Cabbage", sec: 0, origin: "local", unit: "g", pack: 1500, packLabel: "1 head (~1.5 kg)", price: 800, buy: "fortnight", where: "fresh",
    aka: ["cabbage", "chou", "amashu"], keep: "Fridge, whole. 2–3 weeks.",
    subs: ["Chinese cabbage.", "Lettuce (salads only)."] },
  { id: "pepperg", name: "Green / bell peppers", sec: 0, origin: "local", unit: "g", pack: 500, packLabel: "500 g (~3)", price: 1200, buy: "week", where: "fresh", each: [150, "pepper"],
    aka: ["pepper", "poivron", "poivrons", "capsicum", "pilipili hoho"], keep: "Fridge. 1 week.",
    subs: ["Courgette.", "Extra onion + carrot."] },
  { id: "cucumber", name: "Cucumber", sec: 0, origin: "local", unit: "pc", pack: 1, packLabel: "1 cucumber", price: 450, buy: "week", noCarry: true, where: "fresh",
    aka: ["cucumber", "concombre"], keep: "Fridge. 1 week.", subs: ["Shredded cabbage.", "Extra tomato."] },
  { id: "spinach", name: "Spinach / dodo leaves", sec: 0, origin: "local", unit: "g", pack: 300, packLabel: "1 bunch (~300 g)", price: 500, buy: "week", noCarry: true, where: "fresh",
    aka: ["spinach", "epinard", "épinard", "dodo", "amaranth", "imbwija"], keep: "Fridge in a dry towel. 4–5 days.",
    subs: ["Sukuma (kale), shredded fine.", "Cabbage."] },
  { id: "gbeans", name: "Green beans", sec: 0, origin: "local", unit: "g", pack: 500, packLabel: "500 g", price: 1000, buy: "week", where: "fresh",
    aka: ["green bean", "haricot vert", "haricots verts", "imiteja"], keep: "Fridge in a bag. 1 week.",
    subs: ["Cabbage + carrot.", "Fresh peas."] },
  { id: "peas", name: "Fresh green peas (shelled)", sec: 0, origin: "local", unit: "g", pack: 500, packLabel: "500 g", price: 1500, buy: "week", where: "fresh",
    aka: ["peas", "petit pois", "petits pois", "amashaza mabisi"], keep: "Fridge 3–4 days, or blanch 2 min and freeze.",
    subs: ["Green beans, chopped small.", "Diced carrot."] },
  { id: "parsley", name: "Parsley or coriander", sec: 0, origin: "local", unit: "g", pack: 50, packLabel: "1 bunch", price: 400, buy: "week", noCarry: true, where: "fresh",
    aka: ["parsley", "persil", "coriander", "coriandre", "dhania"], keep: "Stand in a glass of water in the fridge.",
    subs: ["Leave out: it's mostly garnish."] },
  { id: "lemon", name: "Lemons / limes", sec: 0, origin: "local", unit: "pc", pack: 4, packLabel: "4 pieces", price: 1000, buy: "week", where: "fresh",
    aka: ["lemon", "citron", "lime", "indimu"], keep: "Fridge. 2 weeks.", subs: ["Passion fruit juice for sweet dishes."] },
  { id: "banana", name: "Sweet bananas", sec: 0, origin: "local", unit: "g", pack: 1000, packLabel: "1 kg (~8)", price: 1000, buy: "week", noCarry: true, where: "fresh", each: [120, "banana"],
    aka: ["banana", "banane", "imineke", "kamaramasenge"], keep: "Counter. Freeze over-ripe ones for pancakes.",
    subs: ["Mango.", "Any other fruit."] },
  { id: "avocado", name: "Avocados", sec: 0, origin: "local", unit: "pc", pack: 1, packLabel: "1 piece", price: 400, buy: "week", noCarry: true, where: "fresh",
    aka: ["avocado", "avocat", "avoka"], keep: "Buy firm; ripens on the counter in 2–3 days.", subs: ["A boiled egg."] },
  { id: "pineapple", name: "Pineapple", sec: 0, origin: "local", unit: "pc", pack: 1, packLabel: "1 whole", price: 1200, buy: "week", noCarry: true, where: "fresh",
    aka: ["pineapple", "ananas", "inanasi"], keep: "Counter 2 days; cut pieces in the fridge 5 days.", subs: ["Mango."] },
  { id: "mango", name: "Mangoes", sec: 0, origin: "local", unit: "pc", pack: 1, packLabel: "1 piece", price: 500, buy: "week", noCarry: true, where: "fresh",
    aka: ["mango", "mangue", "umwembe"], keep: "Ripen on the counter, then fridge.", subs: ["Pineapple or banana."] },
  { id: "passion", name: "Passion fruit", sec: 0, origin: "local", unit: "pc", pack: 6, packLabel: "6 pieces", price: 1000, buy: "week", where: "fresh",
    aka: ["passion", "maracuja", "marakuja", "fruit de la passion"], keep: "Counter. Wrinkly skin = sweeter.", subs: ["A squeeze of lemon + honey."] },

  // ---------- Meat ----------
  { id: "chthigh", name: "Chicken thighs & drumsticks", sec: 1, origin: "local", unit: "g", pack: 500, packLabel: "500 g, by weight", price: 3250, buy: "month", where: "butcher",
    aka: ["chicken", "poulet", "inkoko", "cuisse", "thigh", "drumstick", "kuku"], keep: "Freeze in 500 g bags on day 1.",
    subs: ["A whole chicken cut into 8 pieces (often cheaper per kg).", "Chicken breast (10 min less in the oven)."] },
  { id: "chbreast", name: "Chicken breast", sec: 1, origin: "local", unit: "g", pack: 500, packLabel: "500 g, by weight", price: 4500, buy: "month", where: "butcher",
    aka: ["chicken breast", "breast", "blanc de poulet", "filet de poulet", "fillet"], keep: "Cut into strips, then freeze in 250 g bags.",
    subs: ["Boneless thighs.", "Beef strips."] },
  { id: "mince", name: "Beef mince", sec: 1, origin: "local", unit: "g", pack: 500, packLabel: "500 g, by weight", price: 3250, buy: "month", where: "butcher",
    aka: ["mince", "minced", "hach", "haché", "ground beef", "viande hachee"], keep: "Flatten in 250 g freezer bags (thaws fast).",
    subs: ["Ask the butcher to mince stewing beef.", "Goat mince.", "Cooked beans (100 g dried per 250 g mince)."] },
  { id: "beef", name: "Beef steak / strips", sec: 1, origin: "local", unit: "g", pack: 500, packLabel: "500 g, by weight", price: 3500, buy: "month", where: "butcher",
    aka: ["beef", "boeuf", "bœuf", "steak", "inyama", "filet de boeuf"], keep: "Slice thin while half-frozen; 250 g bags.",
    subs: ["Chicken breast strips."] },

  // ---------- Dairy & eggs ----------
  { id: "eggs", name: "Eggs", sec: 2, origin: "local", unit: "pc", pack: 30, packLabel: "tray of 30", price: 3900, buy: "fortnight", where: "any",
    aka: ["egg", "eggs", "oeuf", "œufs", "amagi"], keep: "Fridge. 3–4 weeks.", subs: ["Half trays (15)."] },
  { id: "milk", name: "Fresh milk (Inyange)", sec: 2, origin: "local", unit: "ml", pack: 1000, packLabel: "1 L", price: 1100, buy: "week", noCarry: true, where: "any",
    aka: ["milk", "lait", "amata", "inyange"], keep: "Fridge. 5 days once opened.", subs: ["Long-life (UHT) milk.", "Powdered milk."] },
  { id: "yog", name: "Plain yogurt / ikivuguto", sec: 2, origin: "local", unit: "ml", pack: 1000, packLabel: "1 L", price: 2300, buy: "week", where: "any",
    aka: ["yogurt", "yoghurt", "yaourt", "ikivuguto", "mala"], keep: "Fridge. 1 week.",
    subs: ["Ikivuguto (fermented milk) is a perfect swap.", "Milk + 1 tbsp lemon juice (marinades only)."] },
  { id: "cheese", name: "Mozzarella (local dairy)", sec: 2, origin: "local", unit: "g", pack: 250, packLabel: "250 g", price: 3500, buy: "month", where: "any",
    aka: ["cheese", "fromage", "mozzarella", "foromaje"], keep: "Fridge 3 weeks, or grate and freeze.",
    subs: ["Any local melting cheese you like.", "Leave out (most recipes still work)."] },
  { id: "butter", name: "Butter (local)", sec: 2, origin: "local", unit: "g", pack: 250, packLabel: "250 g", price: 2500, buy: "month", where: "any", spoon: 5,
    aka: ["butter", "beurre", "amavuta y'inka"], keep: "Fridge.", subs: ["Sunflower oil (use 3/4 of the amount)."] },

  // ---------- Bread ----------
  { id: "bread", name: "Bread loaf", sec: 3, origin: "local", unit: "g", pack: 600, packLabel: "~600 g loaf", price: 1400, buy: "week", where: "any",
    aka: ["bread", "pain", "umugati", "loaf"], keep: "Freeze half the loaf the day you buy it.", subs: ["Homemade yogurt flatbreads."] },

  // ---------- Rice, flour & pasta ----------
  { id: "rice", name: "Rwandan rice", sec: 4, origin: "local", unit: "g", pack: 2000, packLabel: "2 kg", price: 3600, buy: "month", where: "any",
    aka: ["rice", "riz", "umuceri"], keep: "Airtight tub.", subs: ["Any long-grain rice (rinse local rice well)."] },
  { id: "spag", name: "Spaghetti", sec: 4, origin: "regional", unit: "g", pack: 500, packLabel: "500 g", price: 1200, buy: "month", where: "any",
    aka: ["spaghetti", "spagetti", "pasta"], subs: ["Any pasta."] },
  { id: "penne", name: "Penne / macaroni", sec: 4, origin: "regional", unit: "g", pack: 500, packLabel: "500 g", price: 1200, buy: "month", where: "any",
    aka: ["penne", "macaroni", "makaroni"], subs: ["Spaghetti."] },
  { id: "flour", name: "Wheat flour", sec: 4, origin: "regional", unit: "g", pack: 2000, packLabel: "2 kg", price: 2900, buy: "month", where: "any", spoon: 3,
    aka: ["flour", "farine", "ifu", "wheat", "azam"], subs: ["Self-raising flour (skip baking powder)."] },
  { id: "sorghum", name: "Sorghum porridge flour (or sosoma)", sec: 4, origin: "local", unit: "g", pack: 1000, packLabel: "1 kg", price: 1500, buy: "month", where: "any",
    aka: ["sorghum", "sorgho", "amasaka", "sosoma", "porridge"], subs: ["Maize porridge flour.", "Oats (imported, pricier)."] },

  // ---------- Beans & dried peas ----------
  { id: "beans", name: "Dried Rwandan beans", sec: 5, origin: "local", unit: "g", pack: 1000, packLabel: "1 kg", price: 1300, buy: "month", where: "fresh",
    aka: ["beans", "haricot", "haricots", "ibishyimbo", "bean"], keep: "Soak overnight, boil 1–1.5 h, freeze in portions (see Plan).",
    subs: ["Any dried beans: red, white or mixed.", "Tinned beans (imported, 1 tin ≈ 100 g dried)."] },
  { id: "dpeas", name: "Dried peas", sec: 5, origin: "local", unit: "g", pack: 1000, packLabel: "1 kg", price: 1800, buy: "month", where: "fresh",
    aka: ["dried peas", "split peas", "pois casses", "pois cassés", "amashaza"], keep: "Airtight tub.",
    subs: ["Dried beans (soup becomes thicker and darker).", "Red lentils (imported, cook only 20 min)."] },

  // ---------- Oil, sauces & spreads ----------
  { id: "oil", name: "Sunflower oil", sec: 6, origin: "regional", unit: "ml", pack: 2000, packLabel: "2 L", price: 7200, buy: "month", where: "any", spoon: 5,
    aka: ["oil", "huile", "amavuta", "sunflower", "golden fry", "mukwano"], subs: ["Any vegetable oil."] },
  { id: "tpaste", name: "Tomato paste", sec: 6, origin: "imported", unit: "g", pack: 70, packLabel: "70 g sachet", price: 350, buy: "month", where: "any", spoon: 5,
    aka: ["tomato paste", "concentre", "concentré", "paste"], keep: "Freeze leftovers in an ice-cube tray.",
    subs: ["300 g extra fresh tomatoes, cooked down."] },
  { id: "soy", name: "Soy sauce", sec: 6, origin: "imported", unit: "ml", pack: 250, packLabel: "250 ml", price: 2500, buy: "month", where: "any", spoon: 5,
    aka: ["soy", "soja", "sauce soja"], subs: ["Per 2 tbsp: ½ stock cube in 2 tbsp hot water + 1 tsp sugar."] },
  { id: "honey", name: "Honey (Rwandan)", sec: 6, origin: "local", unit: "g", pack: 250, packLabel: "250 g jar", price: 2500, buy: "month", where: "any", spoon: 7,
    aka: ["honey", "miel", "ubuki"], subs: ["Sugar."] },
  { id: "pb", name: "Peanut butter (local)", sec: 6, origin: "local", unit: "g", pack: 400, packLabel: "400 g jar", price: 3000, buy: "month", where: "any", spoon: 8,
    aka: ["peanut butter", "beurre d'arachide", "beurre de cacahuete"], subs: ["Roasted groundnuts blended with a splash of oil."] },

  // ---------- Spices ----------
  { id: "salt", name: "Salt", sec: 7, origin: "regional", unit: "g", pack: 1000, packLabel: "1 kg", price: 500, buy: "month", where: "any", spoon: 6,
    aka: ["salt", "sel", "umunyu"], subs: ["Any salt."] },
  { id: "pepper", name: "Black pepper", sec: 7, origin: "imported", unit: "g", pack: 50, packLabel: "50 g", price: 1500, buy: "month", where: "any", spoon: 2.5,
    aka: ["pepper black", "poivre", "black pepper"], subs: ["Leave out."] },
  { id: "chili", name: "Dried chili / pili-pili (local)", sec: 7, origin: "local", unit: "g", pack: 50, packLabel: "50 g", price: 800, buy: "month", where: "any", spoon: 2,
    aka: ["chili", "chilli", "piment", "pilipili", "urusenda", "akabanga"], subs: ["Akabanga chili oil (a few drops; very hot)."] },
  { id: "cumin", name: "Ground cumin", sec: 7, origin: "imported", unit: "g", pack: 50, packLabel: "50 g", price: 1800, buy: "month", where: "any", spoon: 2.5,
    aka: ["cumin", "jeera"], subs: ["Ground coriander.", "Shawarma spice mix."] },
  { id: "paprika", name: "Paprika", sec: 7, origin: "imported", unit: "g", pack: 50, packLabel: "50 g", price: 1800, buy: "month", where: "any", spoon: 2.5,
    aka: ["paprika"], subs: ["Half the amount of chili + pinch of sugar."] },
  { id: "herbs", name: "Dried oregano / mixed herbs", sec: 7, origin: "imported", unit: "g", pack: 20, packLabel: "~20 g jar", price: 1500, buy: "month", where: "any", spoon: 1,
    aka: ["oregano", "herbs", "herbes", "thyme", "thym"], subs: ["Fresh parsley, chopped."] },
  { id: "cinn", name: "Ground cinnamon", sec: 7, origin: "imported", unit: "g", pack: 50, packLabel: "50 g", price: 1500, buy: "month", where: "any", spoon: 2.5,
    aka: ["cinnamon", "cannelle", "mdalasini"], subs: ["Leave out."] },
  { id: "stock", name: "Chicken stock cubes (halal)", sec: 7, origin: "regional", unit: "cube", pack: 24, packLabel: "box of 24", price: 1800, buy: "month", where: "any",
    aka: ["stock", "cube", "royco", "maggi", "bouillon"], subs: ["½ tsp salt + the dish's spices."] },

  // ---------- Baking ----------
  { id: "sugar", name: "Sugar (Kabuye)", sec: 8, origin: "local", unit: "g", pack: 1000, packLabel: "1 kg", price: 1600, buy: "month", where: "any", spoon: 4,
    aka: ["sugar", "sucre", "isukari", "kabuye"], subs: ["Honey."] },
  { id: "bpowder", name: "Baking powder", sec: 8, origin: "imported", unit: "g", pack: 100, packLabel: "100 g", price: 1000, buy: "month", where: "any", spoon: 4,
    aka: ["baking powder", "levure chimique", "poudre a lever"], subs: ["Self-raising flour."] },
  { id: "yeast", name: "Instant yeast", sec: 8, origin: "imported", unit: "g", pack: 22, packLabel: "2 × 11 g sachets", price: 1000, buy: "month", where: "any", spoon: 3,
    aka: ["yeast", "levure", "instant"], subs: ["Baking powder dough: 2 tsp per 250 g flour, no rising (scone-like crust)."] },

  // ---------- Snacks & drinks ----------
  { id: "nuts", name: "Groundnuts (raw)", sec: 9, origin: "local", unit: "g", pack: 500, packLabel: "500 g", price: 1600, buy: "month", where: "fresh",
    aka: ["groundnut", "peanut", "arachide", "cacahuete", "ubunyobwa"], subs: ["Roasted salted peanuts."] },
  { id: "popcorn", name: "Popcorn kernels", sec: 9, origin: "local", unit: "g", pack: 500, packLabel: "500 g", price: 1500, buy: "month", where: "any",
    aka: ["popcorn", "pop corn", "mais"], subs: ["Groundnuts."] },
  { id: "tea", name: "Rwandan tea bags", sec: 9, origin: "local", unit: "pc", pack: 100, packLabel: "box of 100", price: 2500, buy: "month", where: "any", fixed: 100,
    aka: ["tea", "the", "thé", "icyayi"], subs: ["Rwandan ground coffee."] },

  // ---------- Household ----------
  { id: "fbags", name: "Freezer / zip bags", sec: 10, origin: "imported", unit: "pc", pack: 50, packLabel: "pack of 50", price: 2500, buy: "month", where: "any", fixed: 50,
    aka: ["freezer bag", "zip", "sachet"], subs: ["Food boxes with lids."] },
  { id: "foil", name: "Aluminium foil", sec: 10, origin: "imported", unit: "pc", pack: 1, packLabel: "1 roll", price: 2500, buy: "month", where: "any", fixed: 1,
    aka: ["foil", "aluminium", "papier alu"], subs: ["Grease the tray well."] },
];

/* ---------------- RECIPES ----------------
   ing: [ingredientId, quantity PER SERVING (or per batch when yield > 1), optional note]
   Dinners are cooked for 2 (dinner + tomorrow's lunch).
*/
const FLATBREAD_STEPS = [
  "Flatbreads: mix the flour, baking powder, a pinch of salt and the yogurt into a soft dough. Knead 1 min and rest 10 min.",
  "Roll into thin rounds (1 per serving) and dry-fry in a hot pan 1–2 min per side until puffed with brown spots.",
];

const RECIPES = [
  // ===== Breakfast =====
  { id: "shakshuka", name: "Shakshuka", type: "breakfast", cuisine: "Middle Eastern", time: 25, level: "Easy", img: "shakshuka",
    ing: [["oil", 10], ["onion", 75], ["pepperg", 75], ["garlic", 1], ["cumin", 1], ["paprika", 1], ["tomato", 240, "chopped"], ["salt", 1], ["pepper", 0.3], ["eggs", 2], ["parsley", 3], ["bread", 80, "to dip"]],
    steps: ["Soften the sliced onion and pepper in oil for 5 min.", "Stir in the garlic, cumin and paprika for 30 seconds.", "Add the tomatoes, salt and pepper. Simmer 8–10 min until thick.", "Make 2 hollows, crack in the eggs, cover and cook 4–6 min until the whites set.", "Top with parsley and eat with bread."] },
  { id: "porridge", name: "Sorghum porridge with banana & peanut butter", type: "breakfast", cuisine: "Breakfast", time: 15, level: "Easy", img: "porridge",
    ing: [["sorghum", 50], ["milk", 200], ["sugar", 5], ["cinn", 0.5], ["banana", 120], ["pb", 15], ["honey", 10]],
    steps: ["Whisk the flour into 150 ml cold water until smooth (no lumps).", "Bring the milk to a simmer, pour in the flour mix, and stir constantly.", "Simmer 8–10 min, stirring, until thick and creamy. Add the sugar and cinnamon.", "Top with sliced banana, peanut butter and honey."], tip: "Like it thinner? Add more milk at the end." },
  { id: "pancakes", name: "Banana pancakes with passion fruit", type: "breakfast", cuisine: "Western", time: 25, level: "Easy", img: "pancakes",
    ing: [["flour", 70], ["bpowder", 3], ["sugar", 8], ["salt", 0.5], ["eggs", 1], ["milk", 100], ["banana", 120], ["butter", 5], ["honey", 10], ["passion", 1]],
    steps: ["Mash half the banana. Whisk in the egg and milk.", "Stir in the flour, baking powder, sugar and salt (small lumps are fine).", "Cook small rounds in a buttered pan on medium-low; flip when bubbles appear.", "Top with sliced banana, honey and passion fruit pulp."] },
  { id: "omelette", name: "Veggie omelette & avocado toast", type: "breakfast", cuisine: "Western", time: 15, level: "Easy", img: "omelette",
    ing: [["eggs", 2], ["onion", 40], ["pepperg", 40], ["tomato", 60], ["spinach", 30], ["butter", 5], ["salt", 0.5], ["pepper", 0.3], ["bread", 80], ["avocado", 0.5]],
    steps: ["Chop the onion, pepper, tomato and spinach.", "Soften the onion and pepper in butter for 3 min, then add the spinach.", "Pour in the beaten, seasoned eggs. When almost set, add tomato, fold and cook 1 min.", "Serve with toast topped with mashed avocado and salt."] },
  { id: "ful", name: "Ful-style spiced beans with egg", type: "breakfast", cuisine: "Middle Eastern", time: 15, level: "Easy", img: "ful",
    ing: [["beans", 50, "dried weight, already cooked"], ["garlic", 1], ["cumin", 1], ["salt", 0.5], ["lemon", 0.5], ["oil", 10], ["tomato", 60], ["onion", 30], ["parsley", 3], ["eggs", 1, "boiled"], ["bread", 80]],
    steps: ["Boil the egg 9 min.", "Warm the cooked beans with a splash of water for 5 min and mash about half.", "Stir in crushed garlic, cumin, salt and lemon juice.", "Top with chopped tomato, onion, parsley, a drizzle of oil and the egg. Scoop up with bread."] },
  { id: "bpotatoes", name: "Sweet potato hash & fried eggs", type: "breakfast", cuisine: "Western", time: 30, level: "Easy", img: "bpotatoes",
    ing: [["sweetpot", 150], ["potato", 100], ["oil", 15], ["onion", 50], ["pepperg", 50], ["paprika", 1], ["salt", 1], ["pepper", 0.3], ["eggs", 2]],
    steps: ["Dice both potatoes (1.5 cm). Boil 5 min and drain well.", "Fry in hot oil 10–12 min, turning, until golden.", "Add the onion, pepper, paprika, salt and pepper; fry 5 min.", "Push aside and fry the eggs in the same pan."], tip: "Boil the potatoes the night before to save time." },
  { id: "tomtoast", name: "Tomato-garlic toast, eggs & avocado", type: "breakfast", cuisine: "Mediterranean", time: 15, level: "Easy", img: "tomtoast",
    ing: [["bread", 100], ["garlic", 1], ["tomato", 120], ["oil", 10], ["salt", 0.5], ["eggs", 2, "boiled"], ["avocado", 0.5]],
    steps: ["Boil the eggs 8 min.", "Toast the bread and rub it with a cut garlic clove.", "Grate the tomato onto the toast, add salt and a drizzle of oil.", "Serve with sliced avocado and eggs."] },
  { id: "torrijas", name: "Spanish torrijas (French toast) with fruit", type: "breakfast", cuisine: "Mediterranean", time: 15, level: "Easy", img: "torrijas",
    ing: [["bread", 100, "3 slices"], ["milk", 100], ["eggs", 1], ["sugar", 8], ["cinn", 0.5], ["butter", 10], ["banana", 120], ["passion", 1]],
    steps: ["Whisk the egg, milk, half the sugar and cinnamon in a flat dish.", "Soak each slice 10 seconds per side.", "Fry in butter 2–3 min per side until golden.", "Sprinkle the rest of the sugar; top with banana and passion fruit."] },
  { id: "smoothie", name: "Mango-banana smoothie & peanut toast", type: "breakfast", cuisine: "Breakfast", time: 10, level: "Easy", img: "smoothie",
    ing: [["mango", 0.5], ["banana", 120], ["yog", 150], ["honey", 5], ["bread", 60], ["pb", 15]],
    steps: ["Blend (or mash and whisk hard) the mango, banana, yogurt, honey and a splash of water.", "Toast the bread and spread with peanut butter."], tip: "No blender? Chop the fruit small and eat it as a yogurt bowl." },

  // ===== Dinner =====
  { id: "roastchicken", name: "Lemon-garlic chicken & sweet potato tray bake", type: "dinner", cuisine: "Mediterranean", time: 70, level: "Easy", img: "roastchicken",
    ing: [["chthigh", 250], ["sweetpot", 150], ["potato", 150], ["onion", 75], ["carrot", 60], ["garlic", 2], ["lemon", 0.5], ["oil", 20], ["cumin", 1.5], ["paprika", 1.5], ["herbs", 0.5], ["salt", 1.5], ["pepper", 0.5]],
    steps: ["Heat the oven to 200°C. Cut the potatoes into wedges, the onion into quarters and the carrots into sticks.", "Mix the oil, lemon juice, crushed garlic, spices, salt and pepper in a big bowl.", "Toss the chicken and vegetables in the mix. Spread on a foil-lined tray.", "Roast 50–55 min, turning the potatoes halfway, until the chicken is golden and the juices run clear.", "Pack half for tomorrow's lunch."] },
  { id: "bolognese", name: "Spaghetti bolognese", type: "dinner", cuisine: "Italian", time: 50, level: "Easy", img: "bolognese",
    ing: [["oil", 10], ["onion", 75], ["carrot", 50], ["garlic", 1], ["mince", 125], ["tpaste", 20], ["tomato", 250, "grated"], ["herbs", 1], ["stock", 0.5], ["sugar", 2], ["salt", 1], ["pepper", 0.3], ["spag", 100], ["cheese", 15]],
    steps: ["Fry the chopped onion and grated carrot in oil for 6 min.", "Add the garlic and mince and brown it, breaking it up (6–8 min).", "Stir in the tomato paste for 1 min. Add the grated tomatoes, herbs, stock cube, sugar and 150 ml water.", "Simmer half-covered 25 min. Season.", "Boil the spaghetti and serve with the sauce and grated cheese."] },
  { id: "friedrice", name: "Chicken egg fried rice", type: "dinner", cuisine: "Chinese", time: 35, level: "Easy", img: "friedrice",
    ing: [["rice", 90], ["chbreast", 120], ["oil", 15], ["eggs", 1], ["onion", 50], ["carrot", 40], ["garlic", 1], ["ginger", 5], ["peas", 60], ["soy", 20], ["salt", 0.3], ["pepper", 0.3]],
    steps: ["Cook the rice (1 rice : 2 water, lid on, 15 min) and spread it out to cool.", "Fry the cubed, seasoned chicken in half the oil for 5 min. Remove.", "Scramble the eggs and remove.", "Stir-fry the onion, diced carrot, garlic, ginger and peas in the rest of the oil for 4 min.", "Add the rice and fry 3–4 min, then the chicken, eggs and soy sauce."] },
  { id: "fajitas", name: "Smoky bean fajitas with avocado", type: "dinner", cuisine: "Mexican", time: 40, level: "Easy", img: "fajitas",
    ing: [["beans", 60, "dried weight, already cooked"], ["oil", 15], ["onion", 75], ["pepperg", 100], ["paprika", 1.5], ["cumin", 1.5], ["chili", 0.5], ["salt", 1], ["lemon", 0.25], ["flour", 80], ["bpowder", 2], ["yog", 110, "80 ml dough + 30 ml to serve"], ["avocado", 0.5], ["tomato", 60]],
    steps: [...FLATBREAD_STEPS, "Fry the sliced onion and peppers in hot oil 6–8 min until charred.", "Add the cooked beans, spices and salt; fry 5 min. Squeeze over lemon.", "Fill the flatbreads with beans, avocado, tomato and yogurt."], photoNote: "Photo shows the chickpea version." },
  { id: "peasoup", name: "Split pea & vegetable soup", type: "dinner", cuisine: "Middle Eastern", time: 60, level: "Easy", img: "lentilsoup",
    ing: [["dpeas", 80, "soaked 2 h or overnight"], ["butter", 10], ["onion", 60], ["carrot", 60], ["potato", 60], ["garlic", 1], ["tpaste", 10], ["cumin", 1.5], ["paprika", 1], ["stock", 0.5], ["salt", 0.5], ["lemon", 0.25], ["bread", 80]],
    steps: ["Fry the chopped onion, carrot and potato in butter for 5 min.", "Add garlic, tomato paste, cumin and paprika for 1 min.", "Add the drained peas, stock cube and 500 ml water per serving. Simmer 45–60 min until the peas fall apart.", "Mash hard or blend; add water if thick. Season.", "Serve with lemon and bread."] },
  { id: "shawarma", name: "Chicken shawarma bowl & garlic yogurt", type: "dinner", cuisine: "Middle Eastern", time: 60, level: "Medium", img: "shawarma",
    ing: [["chthigh", 200], ["yog", 80, "half marinade, half sauce"], ["garlic", 2], ["lemon", 0.5], ["cumin", 2], ["paprika", 2], ["cinn", 0.3], ["oil", 15], ["salt", 1.5], ["pepper", 0.5], ["rice", 80], ["tomato", 80], ["cucumber", 0.33], ["onion", 30]],
    steps: ["Marinade: half the yogurt, 1 garlic clove, half the lemon, the spices, oil, salt and pepper. Coat the chicken; 30 min or overnight.", "Roast at 220°C on a foil-lined tray for 35 min.", "Cook the rice; chop a tomato-cucumber-onion salad.", "Sauce: the rest of the yogurt + garlic + lemon + salt.", "Slice the chicken off the bone and serve over rice with salad and sauce."] },
  { id: "arrabbiata", name: "Penne arrabbiata", type: "dinner", cuisine: "Italian", time: 25, level: "Easy", img: "arrabbiata",
    ing: [["oil", 15], ["garlic", 2], ["chili", 0.7], ["tomato", 250, "grated"], ["tpaste", 10], ["herbs", 0.5], ["sugar", 1], ["salt", 1], ["penne", 110], ["parsley", 3], ["cheese", 15]],
    steps: ["Warm the oil with sliced garlic and chili on low for 2 min.", "Add the grated tomatoes, paste, herbs, sugar and salt. Simmer 15 min.", "Cook the penne; keep a cup of pasta water.", "Toss the pasta in the sauce with a splash of water. Top with parsley and cheese."] },
  { id: "pizza", name: "Homemade pizza with pineapple & peppers", type: "dinner", cuisine: "Italian", time: 90, level: "Medium", img: "pizza",
    ing: [["flour", 125], ["yeast", 2], ["sugar", 2], ["salt", 1], ["oil", 10], ["tpaste", 20], ["tomato", 100], ["garlic", 1], ["herbs", 1], ["cheese", 60], ["pepperg", 50], ["onion", 30], ["pineapple", 0.15]],
    steps: ["Dough: mix flour, yeast, sugar, salt, oil and ~80 ml warm water per serving. Knead 8 min.", "Cover and leave 1 hour in a warm place.", "Sauce: simmer grated tomato, paste, garlic and herbs 10 min until thick.", "Heat the oven as hot as it goes with the tray inside.", "Stretch the dough onto oiled foil; add sauce, cheese, pepper, onion and pineapple.", "Bake 10–14 min until bubbling."] },
  { id: "moussaka", name: "Potato & beef moussaka bake", type: "dinner", cuisine: "Greek", time: 80, level: "Medium", img: "moussaka",
    ing: [["potato", 250], ["oil", 15], ["onion", 60], ["garlic", 1], ["mince", 120], ["tomato", 200], ["tpaste", 10], ["cinn", 0.5], ["herbs", 0.5], ["salt", 1], ["pepper", 0.3], ["butter", 15], ["flour", 15], ["milk", 150], ["eggs", 0.5], ["cheese", 20]],
    steps: ["Slice the potatoes 0.5 cm, boil 6 min, drain.", "Fry the onion 5 min, then brown the garlic and mince. Add tomatoes, paste, cinnamon, herbs, salt, pepper; simmer 15 min.", "White sauce: melt butter, stir in flour 1 min, whisk in milk until thick. Off the heat whisk in egg and half the cheese.", "Layer potatoes, meat, potatoes; pour over the sauce and the rest of the cheese.", "Bake at 190°C for 35 min. Rest 10 min."] },
  { id: "beefstir", name: "Beef & green bean stir-fry", type: "dinner", cuisine: "Chinese", time: 30, level: "Easy", img: "beefstir",
    ing: [["beef", 130], ["flour", 5], ["soy", 20], ["honey", 5], ["oil", 15], ["garlic", 1], ["ginger", 5], ["gbeans", 120], ["carrot", 40], ["rice", 80]],
    steps: ["Slice the beef thin and toss with the flour and 1 tbsp soy sauce.", "Start the rice.", "Sear the beef in very hot oil, 2 batches of 2 min. Remove.", "Stir-fry the beans, carrot, garlic and ginger 4 min with 2 tbsp water.", "Add the beef, the rest of the soy, the honey and 3 tbsp water; toss until glossy."], photoNote: "Photo shows the broccoli version." },
  { id: "tomegg", name: "Chinese tomato & egg stir-fry", type: "dinner", cuisine: "Chinese", time: 20, level: "Easy", img: "tomegg",
    ing: [["eggs", 2.5], ["salt", 1], ["oil", 15], ["garlic", 1], ["tomato", 250], ["tpaste", 5], ["sugar", 6], ["soy", 5], ["flour", 3], ["rice", 80]],
    steps: ["Start the rice. Beat the eggs with salt; cut the tomatoes into wedges.", "Softly scramble the eggs in half the oil. Remove.", "Fry garlic and tomatoes in the rest of the oil 3–4 min.", "Add paste, sugar, soy and the flour mixed with 3 tbsp water. Simmer 1 min.", "Fold the eggs back in and serve over rice."] },
  { id: "chili", name: "Chili con carne with Rwandan beans", type: "dinner", cuisine: "Mexican", time: 50, level: "Easy", img: "chili",
    ing: [["oil", 10], ["onion", 75], ["pepperg", 50], ["garlic", 1], ["mince", 110], ["cumin", 1.5], ["paprika", 1.5], ["chili", 0.5], ["tpaste", 15], ["tomato", 250], ["beans", 50, "dried weight, already cooked"], ["stock", 0.5], ["salt", 1], ["rice", 80]],
    steps: ["Fry the onion and pepper 5 min. Add garlic and mince; brown 6 min.", "Stir in the spices and paste for 1 min.", "Add the grated tomatoes, cooked beans, stock cube and 150 ml water. Simmer 25 min.", "Serve with rice."] },
  { id: "tomsoup", name: "Creamy tomato soup & cheese toasties", type: "dinner", cuisine: "Western", time: 40, level: "Easy", img: "tomsoup",
    ing: [["butter", 15], ["onion", 60], ["carrot", 40], ["garlic", 1], ["tomato", 400], ["tpaste", 10], ["stock", 0.5], ["sugar", 3], ["herbs", 0.3], ["milk", 60], ["salt", 0.5], ["bread", 100], ["cheese", 40]],
    steps: ["Soften the onion, carrot and garlic in half the butter for 6 min.", "Add chopped tomatoes, paste, stock cube, sugar, herbs and 200 ml water per serving. Simmer 20 min.", "Mash or blend smooth; stir in the milk. Season.", "Toasties: cheese between bread, butter the outside, fry 2–3 min per side."] },
  { id: "sweetsour", name: "Sweet & sour pineapple chicken", type: "dinner", cuisine: "Chinese", time: 40, level: "Medium", img: "sweetsour",
    ing: [["chbreast", 130], ["eggs", 0.5], ["flour", 20], ["salt", 0.5], ["oil", 25], ["onion", 50], ["pepperg", 75], ["pineapple", 0.2], ["garlic", 1], ["tpaste", 15], ["sugar", 12], ["lemon", 0.5], ["soy", 10], ["rice", 80]],
    steps: ["Start the rice. Dip the chicken pieces in egg, then in most of the flour with salt.", "Shallow-fry 5–6 min until crisp.", "Sauce: paste, sugar, lemon juice, soy, the rest of the flour and 5 tbsp water.", "Stir-fry onion, pepper and garlic 3 min; add pineapple and sauce, bubble 1 min.", "Toss in the chicken and serve."] },
  { id: "couscous", name: "Moroccan chicken & sweet potato stew", type: "dinner", cuisine: "Moroccan", time: 60, level: "Medium", img: "couscous",
    ing: [["oil", 10], ["chthigh", 200], ["salt", 1], ["onion", 75], ["garlic", 1], ["ginger", 3], ["cumin", 1], ["paprika", 1], ["cinn", 0.5], ["tpaste", 10], ["carrot", 60], ["sweetpot", 150], ["stock", 0.5], ["rice", 80], ["parsley", 3]],
    steps: ["Brown the salted chicken in oil, 5 min per side. Remove.", "Fry the onion 5 min; add garlic, ginger, spices and paste for 1 min.", "Return the chicken with carrot and sweet potato chunks, the stock cube and 300 ml water. Cover and simmer 30 min.", "Serve over rice with parsley."], photoNote: "Photo shows it with couscous; you'll serve it with local rice." },
  { id: "falafel", name: "Spiced bean patties in flatbread", type: "dinner", cuisine: "Middle Eastern", time: 50, level: "Medium", img: "falafel",
    ing: [["beans", 70, "dried weight, cooked & drained"], ["onion", 40], ["garlic", 2], ["parsley", 10], ["cumin", 2], ["paprika", 1], ["salt", 1.5], ["flour", 100, "20 g patties + 80 g bread"], ["bpowder", 2], ["oil", 25], ["yog", 120, "80 ml dough + 40 ml sauce"], ["tomato", 80], ["cucumber", 0.33], ["cabbage", 50], ["lemon", 0.25]],
    steps: ["Mash the cooked beans with grated onion, 1 garlic clove, parsley, spices, salt and 20 g flour until it holds together.", "Shape into small patties and pan-fry in oil 3 min per side until crisp.", ...FLATBREAD_STEPS, "Garlic yogurt: yogurt + crushed garlic + lemon + salt.", "Fill the flatbreads with patties, cabbage, tomato, cucumber and sauce."], photoNote: "Photo shows chickpea falafel; these are made with local beans." },
  { id: "shepherd", name: "Sweet potato shepherd's pie", type: "dinner", cuisine: "British", time: 60, level: "Easy", img: "shepherd",
    ing: [["oil", 10], ["onion", 60], ["carrot", 60], ["garlic", 1], ["mince", 120], ["tpaste", 15], ["peas", 50], ["stock", 0.5], ["herbs", 0.5], ["salt", 1], ["pepper", 0.3], ["sweetpot", 300], ["butter", 10], ["milk", 30], ["cheese", 15]],
    steps: ["Boil the peeled sweet potatoes 15 min, then mash with butter, milk and salt.", "Fry onion and carrot 5 min, then brown the garlic and mince.", "Add the paste, peas, stock cube, herbs and 150 ml water; simmer 10 min.", "Put the mince in an oven dish, top with the mash and cheese.", "Bake at 200°C for 20 min until golden."], photoNote: "Photo shows a vegetable version." },
  { id: "alfredo", name: "Creamy chicken & spinach pasta", type: "dinner", cuisine: "Italian", time: 35, level: "Easy", img: "alfredo",
    ing: [["penne", 100], ["chbreast", 120], ["salt", 1], ["pepper", 0.5], ["oil", 5], ["butter", 15], ["garlic", 2], ["flour", 10], ["milk", 180], ["cheese", 30], ["spinach", 60]],
    steps: ["Boil the pasta.", "Fry the sliced, seasoned chicken in oil 5–6 min. Remove.", "Melt the butter, add garlic 30 s, then flour 1 min.", "Whisk in the milk slowly; simmer until creamy. Stir in the cheese.", "Add spinach until wilted, then the chicken and pasta."] },
  { id: "cabbagebeef", name: "Paprika beef & cabbage with mash", type: "dinner", cuisine: "Eastern European", time: 40, level: "Easy", img: "cabbagebeef",
    ing: [["potato", 250], ["butter", 10], ["milk", 40], ["salt", 1.5], ["oil", 10], ["onion", 60], ["garlic", 1], ["mince", 100], ["paprika", 1], ["tpaste", 10], ["cabbage", 250], ["pepper", 0.3]],
    steps: ["Boil the potatoes 15 min; mash with butter, warm milk and salt.", "Brown the onion, garlic and mince in oil 7 min.", "Add paprika and paste 1 min.", "Add the shredded cabbage and 4 tbsp water; cover and cook 10 min. Season.", "Serve on the mash."] },
  { id: "beansoup", name: "Tuscan-style bean & vegetable soup", type: "dinner", cuisine: "Italian", time: 40, level: "Easy", img: "beansoup",
    ing: [["oil", 10], ["onion", 60], ["carrot", 60], ["potato", 100], ["garlic", 1], ["tomato", 120], ["beans", 60, "dried weight, already cooked"], ["stock", 0.5], ["herbs", 0.5], ["spinach", 50], ["salt", 0.5], ["pepper", 0.3], ["bread", 80], ["cheese", 10]],
    steps: ["Soften the diced onion, carrot and potato in oil 6 min.", "Add garlic, chopped tomato, cooked beans, stock cube, herbs and 400 ml water per serving.", "Simmer 20 min; mash some beans to thicken.", "Stir in spinach 2 min. Serve with bread and cheese."] },
  { id: "kungpao", name: "Kung pao chicken with groundnuts", type: "dinner", cuisine: "Chinese", time: 30, level: "Medium", img: "kungpao",
    ing: [["chbreast", 130], ["flour", 10], ["soy", 20], ["lemon", 0.25], ["sugar", 6], ["oil", 20], ["nuts", 30], ["chili", 1], ["garlic", 1], ["ginger", 5], ["onion", 40], ["pepperg", 50], ["rice", 80]],
    steps: ["Start the rice. Dice the chicken; toss with half the flour and 1 tsp soy.", "Sauce: the rest of the soy, lemon juice, sugar, the rest of the flour and 4 tbsp water.", "Fry the groundnuts in the oil until golden. Remove.", "Fry the chicken 5 min; add chili, garlic, ginger, onion and pepper for 2 min.", "Add the sauce, toss until glossy, add the nuts."] },
  { id: "syrianrice", name: "Syrian spiced rice with beef", type: "dinner", cuisine: "Middle Eastern", time: 45, level: "Easy", img: "syrianrice",
    ing: [["butter", 10], ["oil", 10], ["onion", 60], ["mince", 100], ["cinn", 0.7], ["cumin", 0.7], ["salt", 1.5], ["pepper", 0.5], ["rice", 90], ["stock", 0.5], ["nuts", 15], ["parsley", 3], ["yog", 80], ["cucumber", 0.25]],
    steps: ["Fry the onion in butter and oil 5 min; add the mince and brown well.", "Add the spices, then stir in the rinsed rice for 1 min.", "Add 180 ml boiling water per serving and the stock cube. Cover on the lowest heat 15 min; rest 5 min.", "Toast the groundnuts in a dry pan.", "Top with nuts and parsley; serve with cucumber-yogurt salad."] },
  { id: "kofta", name: "Beef kofta burgers in flatbread", type: "dinner", cuisine: "Turkish", time: 50, level: "Medium", img: "kofta",
    ing: [["mince", 125], ["onion", 40, "grated"], ["garlic", 1], ["cumin", 1.5], ["paprika", 1], ["parsley", 5], ["salt", 1.5], ["flour", 80], ["bpowder", 2], ["yog", 120, "80 ml dough + 40 ml sauce"], ["oil", 10], ["tomato", 60], ["cucumber", 0.25], ["cabbage", 50]],
    steps: ["Mix the mince with onion, garlic, spices, parsley and salt. Shape 2 flat patties per serving.", ...FLATBREAD_STEPS, "Fry the patties 4 min per side.", "Fill the flatbreads with kofta, cabbage, tomato, cucumber and garlic yogurt."] },
  { id: "lomein", name: "Beef & cabbage spaghetti stir-fry", type: "dinner", cuisine: "Chinese", time: 30, level: "Easy", img: "lomein",
    ing: [["spag", 90], ["beef", 110], ["soy", 25], ["honey", 5], ["oil", 15], ["garlic", 1], ["ginger", 4], ["onion", 40], ["carrot", 50], ["cabbage", 100]],
    steps: ["Boil the spaghetti 1 min less than the packet says; drain and toss with a drop of oil.", "Sear the thin-sliced beef with 1 tsp soy in half the oil, 2 min. Remove.", "Stir-fry onion, carrot, cabbage, garlic and ginger 4 min.", "Add the spaghetti, beef, the rest of the soy and the honey; toss 2 min."] },
  { id: "tortilla", name: "Spanish potato tortilla & salad", type: "dinner", cuisine: "Spanish", time: 45, level: "Medium", img: "tortilla",
    ing: [["potato", 250], ["onion", 75], ["oil", 40], ["salt", 1.5], ["eggs", 3], ["tomato", 100], ["cucumber", 0.33], ["lemon", 0.25]],
    steps: ["Cook thin-sliced potato and onion gently in the oil, covered, 20 min until soft.", "Drain (keep the oil), mix with the beaten, salted eggs, rest 5 min.", "Cook in 1 tbsp of the oil on low 8 min.", "Flip using a plate; cook 3–4 min more.", "Serve with tomato-cucumber salad dressed with lemon, oil and salt."] },

  // ===== Quick lunches =====
  { id: "shopska", name: "Chopped salad with bread & egg", type: "lunch", cuisine: "Mediterranean", time: 15, level: "Easy", img: "shopska",
    ing: [["tomato", 150], ["cucumber", 0.5], ["pepperg", 50], ["onion", 30], ["avocado", 0.5], ["oil", 10], ["lemon", 0.25], ["salt", 0.5], ["eggs", 1, "boiled"], ["bread", 80]],
    steps: ["Boil the egg 9 min.", "Chop the tomato, cucumber, pepper, onion and avocado into chunks.", "Dress with oil, lemon and salt. Serve with bread and the egg."] },
  { id: "beanwrap", name: "Bean dip & avocado wrap", type: "lunch", cuisine: "Middle Eastern", time: 20, level: "Easy", img: "hummus",
    ing: [["beans", 40, "dried weight, cooked"], ["garlic", 1], ["lemon", 0.25], ["oil", 10], ["cumin", 0.5], ["salt", 0.5], ["flour", 80], ["bpowder", 2], ["yog", 80], ["avocado", 0.5], ["tomato", 60], ["cabbage", 40]],
    steps: ["Mash the warm cooked beans with garlic, lemon, oil, cumin, salt and 2–3 tbsp water until smooth.", ...FLATBREAD_STEPS, "Spread the dip on the flatbread, add avocado and salad, and roll up."], photoNote: "Photo shows hummus; this dip is made with local beans." },
  { id: "potsalad", name: "Potato, egg & yogurt salad", type: "lunch", cuisine: "Western", time: 25, level: "Easy", img: "potsalad",
    ing: [["potato", 250], ["eggs", 2], ["yog", 60], ["lemon", 0.25], ["onion", 20], ["carrot", 30], ["parsley", 3], ["salt", 1], ["pepper", 0.3]],
    steps: ["Boil potato chunks 12 min and eggs 9 min. Cool.", "Mix yogurt, lemon, salt and pepper.", "Toss in the potatoes, chopped eggs, onion, grated carrot and parsley."] },
  { id: "flatbread", name: "2-ingredient yogurt flatbreads", type: "lunch", cuisine: "Middle Eastern", time: 20, level: "Easy", img: "flatbread",
    ing: [["flour", 80], ["bpowder", 2], ["yog", 80], ["salt", 0.3]],
    steps: [...FLATBREAD_STEPS, "Wrap in a towel to keep soft. Freeze extras."] },

  // ===== Snacks =====
  { id: "pbcookies", name: "Peanut butter cookies (batch)", type: "snack", cuisine: "Baking", time: 25, level: "Easy", img: "pbcookies", yield: 7,
    ing: [["pb", 125], ["sugar", 90], ["eggs", 1], ["flour", 30], ["bpowder", 2]],
    steps: ["Heat the oven to 180°C.", "Mix everything into a dough. Roll 12 balls and press flat with a fork on a foil-lined tray.", "Bake 10–12 min; they firm up as they cool.", "Keep in a jar: 1–2 per snack."] },
  { id: "rockcakes", name: "Banana & groundnut rock cakes (batch)", type: "snack", cuisine: "Baking", time: 35, level: "Easy", img: "rockcakes", yield: 7,
    ing: [["flour", 200], ["bpowder", 8], ["sugar", 60], ["cinn", 2], ["butter", 80], ["nuts", 60, "roasted, chopped"], ["eggs", 1], ["banana", 120, "mashed"], ["milk", 20]],
    steps: ["Heat the oven to 190°C.", "Rub the butter into the flour, baking powder and cinnamon until crumbly.", "Stir in sugar and nuts, then the egg, mashed banana and milk to a stiff dough.", "Drop 14 rough heaps on a foil-lined tray; bake 15–18 min.", "Keep in a jar: 2 per snack."] },
  { id: "s_banana", name: "Banana", type: "snack", emoji: "🍌", time: 0, level: "Easy", ing: [["banana", 120]], steps: ["Peel and enjoy."] },
  { id: "s_nuts", name: "Roasted groundnuts", type: "snack", emoji: "🥜", time: 15, level: "Easy", ing: [["nuts", 30], ["salt", 0.3]],
    steps: ["Roast a batch in a dry pan or at 180°C for 12–15 min. Salt while warm. One handful = 1 snack."] },
  { id: "s_yog", name: "Yogurt with honey & passion fruit", type: "snack", emoji: "🍯", time: 2, level: "Easy", ing: [["yog", 150], ["honey", 10], ["passion", 1]], steps: ["Top the yogurt with honey and passion fruit pulp."] },
  { id: "s_popcorn", name: "Stovetop popcorn", type: "snack", emoji: "🍿", time: 8, level: "Easy", ing: [["popcorn", 30], ["oil", 5], ["salt", 0.5]],
    steps: ["Heat oil with 3 kernels; when they pop, add the rest, cover and shake.", "Off the heat when pops are 2 seconds apart. Salt."] },
  { id: "s_pineapple", name: "Fresh pineapple", type: "snack", emoji: "🍍", time: 5, level: "Easy", ing: [["pineapple", 0.25]], steps: ["Cut a quarter into chunks."] },
  { id: "s_mango", name: "Fresh mango", type: "snack", emoji: "🥭", time: 3, level: "Easy", ing: [["mango", 0.5]], steps: ["Slice half a mango."] },
  { id: "s_passion", name: "Passion fruit", type: "snack", emoji: "💛", time: 1, level: "Easy", ing: [["passion", 2]], steps: ["Cut in half and scoop."] },
  { id: "s_carrotpb", name: "Carrot sticks & peanut butter", type: "snack", emoji: "🥕", time: 5, level: "Easy", ing: [["carrot", 80], ["pb", 15]], steps: ["Cut sticks and dip."] },
  { id: "s_avotoast", name: "Avocado toast", type: "snack", emoji: "🥑", time: 5, level: "Easy", ing: [["bread", 40], ["avocado", 0.5], ["lemon", 0.1], ["salt", 0.3], ["chili", 0.1]], steps: ["Mash avocado on toast with lemon, salt and a pinch of chili."] },
  { id: "s_egg", name: "Boiled egg & cucumber", type: "snack", emoji: "🥚", time: 10, level: "Easy", ing: [["eggs", 1], ["cucumber", 0.25], ["salt", 0.2]], steps: ["Boil 9 min; eat with cucumber and salt."] },
];

/* ---------------- 30-DAY PLAN ----------------
   Day 1 = shopping day (ideally a Saturday). Top-ups on days 8, 15, 22.
*/
const BREAKFASTS = ["tomtoast","shakshuka","porridge","ful","smoothie","omelette","pancakes",
  "bpotatoes","shakshuka","porridge","tomtoast","ful","torrijas","smoothie",
  "pancakes","shakshuka","porridge","bpotatoes","ful","torrijas","tomtoast",
  "omelette","pancakes","smoothie","ful","torrijas","bpotatoes","porridge","shakshuka","pancakes"];
const DINNERS = ["roastchicken","bolognese","friedrice","fajitas","peasoup","shawarma","arrabbiata",
  "pizza","moussaka","beefstir","tomegg","chili","tomsoup","sweetsour",
  "couscous","falafel","shepherd","alfredo","cabbagebeef","beansoup","kungpao",
  "syrianrice","kofta","lomein","tortilla","friedrice","fajitas","peasoup","roastchicken","bolognese"];
const BATCH_DAYS = { 2: "pbcookies", 9: "rockcakes", 16: "pbcookies", 23: "rockcakes" };
const SNACK_ROTATION = ["s_banana","s_nuts","s_yog","s_popcorn","s_pineapple","s_mango","s_carrotpb","s_avotoast","s_passion","s_egg"];
const WEEKENDS = [1, 2, 8, 9, 15, 16, 22, 23, 29, 30];

function buildBasePlan() {
  const days = [];
  for (let d = 1; d <= 30; d++) {
    let batchFrom = null;
    for (const bd of Object.keys(BATCH_DAYS).map(Number)) if (d >= bd && d < bd + 7) batchFrom = bd;
    const snack0 = batchFrom === d ? { r: BATCH_DAYS[d], s: 7, note: "Bake the batch today" }
      : batchFrom ? { from: BATCH_DAYS[batchFrom] } : { r: "s_popcorn", s: 1 };
    days.push({
      day: d, weekend: WEEKENDS.includes(d),
      breakfast: BREAKFASTS[d - 1], dinner: DINNERS[d - 1],
      snacks: [snack0, { r: SNACK_ROTATION[(d - 1) % SNACK_ROTATION.length], s: 1 }],
    });
  }
  return days;
}

const SHOPS = [
  { id: "big", name: "Big shop", day: 1, desc: "Pantry, spices, freezer meat and the first week of fresh food." },
  { id: "t8", name: "Top-up", day: 8, desc: "Fresh food for days 8–14, plus anything running low." },
  { id: "t15", name: "Top-up", day: 15, desc: "Fresh food for days 15–21, eggs, potatoes and veg for the rest of the month." },
  { id: "t22", name: "Top-up", day: 22, desc: "Fresh food for days 22–30." },
];

const FREEZER_IDS = ["chthigh", "chbreast", "mince", "beef"];
