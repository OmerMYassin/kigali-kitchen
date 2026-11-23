/* Kigali Kitchen — data
   Prices are ESTIMATES in Rwandan francs (RWF) for Simba / Spar, late 2026.
   Edit them in the app (Shopping tab -> tap a price) after your first shop.

   buy: "month"     -> bought once in the big shop (keeps all month: pantry, freezer, onions...)
        "fortnight" -> big shop covers days 1-14, top-up on day 15 covers days 15-30
        "week"      -> fresh: big shop covers days 1-7, then top-ups on days 8, 15 and 22
*/

const CATEGORIES = [
  "Meat & poultry (freeze on day 1)",
  "Dairy & eggs",
  "Fresh vegetables",
  "Fresh fruit",
  "Bread",
  "Rice, pasta & grains",
  "Beans, lentils & tins",
  "Oils, sauces & spreads",
  "Spices & seasoning",
  "Baking",
  "Snacks & drinks",
  "Kitchen supplies",
];

const WHERE = {
  any: "Simba or Spar",
  simba: "Simba (best for international aisle items)",
  fresh: "Simba / Spar, or cheaper at Kimironko market",
  butcher: "Simba / Spar butchery counter or freezer",
};

// unit: g | ml | pc | clove | cube
const INGREDIENTS = [
  // ---- Meat ----
  { id: "chthigh", name: "Chicken thighs & drumsticks", cat: 0, unit: "g", pack: 500, packLabel: "500 g (by weight at the counter)", price: 3250, buy: "month", where: "butcher",
    keep: "Split into 500 g freezer bags on day 1. Freezer: 3 months.",
    subs: ["A whole chicken (about 1.2–1.5 kg), cut into 8 pieces. Often cheaper per kg.", "Chicken breast. Reduce oven time by 10 min.", "Chicken wings for the tray bake."] },
  { id: "chbreast", name: "Chicken breast fillets", cat: 0, unit: "g", pack: 500, packLabel: "500 g (by weight at the counter)", price: 4500, buy: "month", where: "butcher",
    keep: "Cut into strips before freezing (250 g bags), so it defrosts fast.",
    subs: ["Boneless thighs (cut the bone out yourself, juicier).", "Breast meat cut from a whole chicken.", "Beef stir-fry strips (same weight)."] },
  { id: "mince", name: "Beef mince (lean)", cat: 0, unit: "g", pack: 500, packLabel: "500 g (by weight at the counter)", price: 3250, buy: "month", where: "butcher",
    keep: "Flatten in freezer bags, 250 g each (thaws in 3–4 h).",
    subs: ["Ask the butcher to mince stewing beef for you.", "Goat mince (halal butchers).", "Meatless: 1 tin of beans or 100 g dried lentils per 250 g mince (chili, bolognese)."] },
  { id: "beef", name: "Beef steak / stir-fry strips", cat: 0, unit: "g", pack: 500, packLabel: "500 g (by weight at the counter)", price: 3500, buy: "month", where: "butcher",
    keep: "Slice thin across the grain while half-frozen. Bag in 250 g portions.",
    subs: ["Beef fillet (more tender, pricier).", "Any lean beef, sliced paper-thin.", "Chicken breast strips."] },

  // ---- Dairy & eggs ----
  { id: "eggs", name: "Eggs", cat: 1, unit: "pc", pack: 30, packLabel: "tray of 30", price: 3900, buy: "fortnight", where: "any",
    keep: "Fridge, pointy end down. Good 3–4 weeks.",
    subs: ["Buy 2 trays of 15 if 30 is not available.", "Kimironko market trays are often cheaper."] },
  { id: "milk", name: "Fresh milk (Inyange)", cat: 1, unit: "ml", pack: 1000, packLabel: "1 L", price: 1100, buy: "week", noCarry: true, where: "any",
    keep: "Fridge. Use within 5 days of opening.",
    subs: ["UHT long-life milk (keeps unopened for months).", "Powdered milk: 1 tbsp per 100 ml water."] },
  { id: "yog", name: "Plain yogurt (unsweetened)", cat: 1, unit: "ml", pack: 1000, packLabel: "1 L tub", price: 2300, buy: "week", where: "any",
    keep: "Fridge. Use within a week.",
    subs: ["Ikivuguto (Rwandan fermented milk): great in marinades and flatbreads.", "Greek yogurt (thicker, pricier).", "For marinades: milk + 1 tbsp lemon juice."] },
  { id: "cheese", name: "Gouda cheese (local block)", cat: 1, unit: "g", pack: 250, packLabel: "250 g block", price: 3400, buy: "month", where: "any",
    keep: "Wrap tightly. Fridge 4 weeks, or grate half and freeze.",
    subs: ["Mozzarella (best on pizza).", "Cheddar or any hard cheese.", "Processed cheese slices (for toasties only)."] },
  { id: "butter", name: "Butter / Blue Band margarine", cat: 1, unit: "g", pack: 500, packLabel: "500 g", price: 3200, buy: "month", where: "any", spoon: 5,
    keep: "Fridge.",
    subs: ["Margarine instead of butter (or the other way).", "Oil for frying; for baking use 3/4 of the amount in oil."] },

  // ---- Fresh vegetables ----
  { id: "tomato", name: "Tomatoes", cat: 2, unit: "g", pack: 1000, packLabel: "1 kg", price: 1200, buy: "week", where: "fresh", each: [120, "tomato"],
    keep: "Counter until ripe, then fridge.",
    subs: ["Tinned chopped tomatoes for cooking (1 tin ≈ 4 tomatoes).", "Cherry tomatoes for salads."] },
  { id: "onion", name: "Onions (red or white)", cat: 2, unit: "g", pack: 1000, packLabel: "1 kg", price: 1000, buy: "month", where: "fresh", each: [150, "onion"],
    keep: "Cool, dark, dry place, NOT the fridge. Keeps 4+ weeks.",
    subs: ["Spring onions (use 4 per onion).", "Leeks."] },
  { id: "garlic", name: "Garlic", cat: 2, unit: "clove", pack: 40, packLabel: "bag ~200 g (≈40 cloves)", price: 1500, buy: "month", where: "fresh",
    keep: "Dry place. Keeps a month.",
    subs: ["Garlic paste in a jar (1 tsp = 1 clove).", "Garlic powder (1/4 tsp = 1 clove)."] },
  { id: "ginger", name: "Fresh ginger", cat: 2, unit: "g", pack: 250, packLabel: "250 g", price: 600, buy: "month", where: "fresh",
    keep: "Freeze whole and grate it frozen (lasts months).",
    subs: ["Ground ginger: 1/4 tsp per 5 g fresh.", "Ginger-garlic paste."] },
  { id: "potato", name: "Potatoes (Irish)", cat: 2, unit: "g", pack: 2000, packLabel: "2 kg", price: 1500, buy: "fortnight", where: "fresh", each: [170, "potato"],
    keep: "Dark, airy place away from onions. 2–3 weeks.",
    subs: ["Sweet potatoes (roast 10 min less).", "Rice or bread on the side instead."] },
  { id: "carrot", name: "Carrots", cat: 2, unit: "g", pack: 1000, packLabel: "1 kg", price: 900, buy: "fortnight", where: "fresh", each: [80, "carrot"],
    keep: "Fridge veg drawer in a bag. 3 weeks.",
    subs: ["Frozen mixed vegetables.", "Butternut or pumpkin in soups."] },
  { id: "cabbage", name: "Cabbage", cat: 2, unit: "g", pack: 1500, packLabel: "1 head (~1.5 kg)", price: 800, buy: "fortnight", where: "fresh",
    keep: "Fridge, whole. Cut only what you need. 2–3 weeks.",
    subs: ["Chinese cabbage.", "Lettuce (for salads and wraps only)."] },
  { id: "pepperg", name: "Green / bell peppers", cat: 2, unit: "g", pack: 500, packLabel: "500 g (~3)", price: 1200, buy: "week", where: "fresh", each: [150, "pepper"],
    keep: "Fridge. 1 week.",
    subs: ["Any colour of pepper.", "Courgette (zucchini).", "Extra onion + carrot in stir-fries."] },
  { id: "cucumber", name: "Cucumber", cat: 2, unit: "pc", pack: 1, packLabel: "1 cucumber", price: 450, buy: "week", noCarry: true, where: "fresh",
    keep: "Fridge. 1 week.",
    subs: ["Thinly sliced cabbage.", "Extra tomato and onion salad."] },
  { id: "spinach", name: "Spinach (bunch)", cat: 2, unit: "g", pack: 300, packLabel: "1 bunch (~300 g)", price: 500, buy: "week", noCarry: true, where: "fresh",
    keep: "Fridge, wrapped in a dry towel. 4–5 days.",
    subs: ["Dodo / amaranth leaves (local).", "Sukuma (kale), shredded fine.", "Frozen spinach."] },
  { id: "gbeans", name: "Green beans", cat: 2, unit: "g", pack: 500, packLabel: "500 g", price: 1000, buy: "week", where: "fresh",
    keep: "Fridge in a bag. 1 week.",
    subs: ["Broccoli (as in the photo).", "Sliced cabbage + carrot.", "Frozen mixed vegetables."] },
  { id: "parsley", name: "Fresh parsley or coriander", cat: 2, unit: "g", pack: 50, packLabel: "1 bunch", price: 400, buy: "week", noCarry: true, where: "fresh",
    keep: "Stand in a glass of water in the fridge.",
    subs: ["Dried parsley or mixed herbs (use 1/3 the amount).", "Leave out. It's garnish, except in falafel."] },

  { id: "peas", name: "Frozen peas / mixed vegetables", cat: 2, unit: "g", pack: 500, packLabel: "500 g bag (freezer aisle)", price: 2400, buy: "month", where: "any",
    keep: "Freezer. Take out only what you need and reseal the bag.",
    subs: ["Fresh carrots + green beans, finely diced.", "Tinned peas or tinned sweetcorn, drained.", "Half the amount of shredded cabbage."] },

  // ---- Fruit ----
  { id: "lemon", name: "Lemons / limes", cat: 3, unit: "pc", pack: 4, packLabel: "4 pieces", price: 1000, buy: "week", where: "fresh",
    keep: "Fridge. 2 weeks.",
    subs: ["White vinegar (use half the amount).", "Bottled lemon juice (1 lemon ≈ 2 tbsp)."] },
  { id: "banana", name: "Sweet bananas", cat: 3, unit: "g", pack: 1000, packLabel: "1 kg (~8)", price: 1000, buy: "week", noCarry: true, where: "fresh", each: [120, "banana"],
    keep: "Counter. Freeze over-ripe ones for pancakes.",
    subs: ["Apple, mango or passion fruit as snacks.", "In pancakes: leave out, add 1 extra tbsp milk."] },
  { id: "avocado", name: "Avocado", cat: 3, unit: "pc", pack: 1, packLabel: "1 piece", price: 400, buy: "week", noCarry: true, where: "fresh",
    keep: "Buy firm; ripens on the counter in 2–3 days.",
    subs: ["Sliced cheese or a boiled egg."] },
  { id: "pineapple", name: "Pineapple", cat: 3, unit: "pc", pack: 1, packLabel: "1 whole", price: 1200, buy: "week", noCarry: true, where: "fresh",
    keep: "Counter 2 days, cut pieces in the fridge 5 days.",
    subs: ["Tinned pineapple chunks (for sweet & sour).", "Mango, passion fruit or tree tomato as snacks."] },

  // ---- Bread ----
  { id: "bread", name: "Bread loaf (sliced)", cat: 4, unit: "g", pack: 600, packLabel: "~600 g loaf", price: 1400, buy: "week", where: "any",
    keep: "Freeze half the loaf on the day you buy it. Toast slices straight from frozen.",
    subs: ["Homemade yogurt flatbreads (see recipe).", "Brown bread or baguette."] },

  // ---- Grains ----
  { id: "rice", name: "Long-grain rice", cat: 5, unit: "g", pack: 2000, packLabel: "2 kg bag", price: 3800, buy: "month", where: "any",
    keep: "Airtight tub.",
    subs: ["Basmati (nicer, pricier).", "Local Rwandan rice (cheaper; rinse well)."] },
  { id: "spag", name: "Spaghetti", cat: 5, unit: "g", pack: 500, packLabel: "500 g", price: 1200, buy: "month", where: "any",
    subs: ["Any long or short pasta."] },
  { id: "penne", name: "Penne / macaroni", cat: 5, unit: "g", pack: 500, packLabel: "500 g", price: 1200, buy: "month", where: "any",
    subs: ["Spaghetti or any other pasta shape."] },
  { id: "noodles", name: "Egg noodles", cat: 5, unit: "g", pack: 400, packLabel: "400 g", price: 2000, buy: "month", where: "simba",
    subs: ["Spaghetti, boiled 1 min less than the packet says.", "Instant noodles (throw away the flavour sachet)."] },
  { id: "cous", name: "Couscous", cat: 5, unit: "g", pack: 500, packLabel: "500 g", price: 3000, buy: "month", where: "simba",
    subs: ["Rice.", "Bulgur wheat.", "Small pasta (orzo / broken spaghetti)."] },
  { id: "flour", name: "Wheat flour (all-purpose)", cat: 5, unit: "g", pack: 2000, packLabel: "2 kg", price: 2900, buy: "month", where: "any", spoon: 3,
    subs: ["Self-raising flour (then skip baking powder).", "Any brand, e.g. Azam or Pembe."] },
  { id: "oats", name: "Rolled oats", cat: 5, unit: "g", pack: 500, packLabel: "500 g", price: 2800, buy: "month", where: "any",
    subs: ["Quick oats.", "Sosoma / maize porridge flour (cook 10 min, stirring)."] },

  // ---- Beans, lentils, tins ----
  { id: "lentil", name: "Red lentils", cat: 6, unit: "g", pack: 500, packLabel: "500 g", price: 1700, buy: "month", where: "simba",
    subs: ["Yellow split peas (soak 1 h, cook 40 min).", "Brown lentils (soup will be chunkier)."] },
  { id: "blentil", name: "Brown / green lentils", cat: 6, unit: "g", pack: 500, packLabel: "500 g", price: 2000, buy: "month", where: "simba",
    subs: ["Red lentils, cooked only 8–10 min so they hold shape.", "Tinned lentils, drained."] },
  { id: "chick", name: "Dried chickpeas", cat: 6, unit: "g", pack: 500, packLabel: "500 g", price: 1900, buy: "month", where: "simba",
    keep: "Batch-cook and freeze in 1-cup bags (see Prep tab).",
    subs: ["Tinned chickpeas: 1 tin (400 g) ≈ 100 g dried. NOT for falafel (falafel needs soaked raw chickpeas).", "Tinned white beans."] },
  { id: "ful", name: "Ful medames (tinned fava beans)", cat: 6, unit: "g", pack: 400, packLabel: "400 g tin", price: 1800, buy: "month", where: "simba",
    subs: ["Tinned red kidney beans or chickpeas.", "Rwandan beans you boiled yourself."] },
  { id: "kbeans", name: "Red kidney beans (tin)", cat: 6, unit: "g", pack: 400, packLabel: "400 g tin", price: 1500, buy: "month", where: "any",
    subs: ["Dried Rwandan red beans: 100 g dried ≈ 250 g cooked (soak overnight, boil 1–1.5 h).", "Baked beans, rinsed."] },
  { id: "wbeans", name: "White / butter beans (tin)", cat: 6, unit: "g", pack: 400, packLabel: "400 g tin", price: 1600, buy: "month", where: "simba",
    subs: ["Kidney beans or chickpeas.", "Dried white beans, soaked and boiled."] },
  { id: "ttom", name: "Chopped tomatoes (tin)", cat: 6, unit: "g", pack: 400, packLabel: "400 g tin", price: 1500, buy: "month", where: "any",
    subs: ["4 fresh tomatoes (500 g), grated, + 1 tbsp tomato paste per tin.", "Tomato passata / sauce."] },
  { id: "tpaste", name: "Tomato paste", cat: 6, unit: "g", pack: 400, packLabel: "400 g tin", price: 2200, buy: "month", where: "any", spoon: 5,
    keep: "Once opened, spoon into an ice-cube tray and freeze.",
    subs: ["70 g sachets (buy 6).", "Extra tinned tomatoes, simmered down."] },

  // ---- Oils & sauces ----
  { id: "oil", name: "Sunflower / vegetable oil", cat: 7, unit: "ml", pack: 2000, packLabel: "2 L bottle", price: 7200, buy: "month", where: "any", spoon: 5,
    subs: ["Any vegetable oil (e.g. Golden Fry, Mukwano)."] },
  { id: "olive", name: "Olive oil", cat: 7, unit: "ml", pack: 250, packLabel: "250 ml", price: 4000, buy: "month", where: "simba", spoon: 5,
    subs: ["Sunflower oil works fine everywhere it's used."] },
  { id: "soy", name: "Soy sauce", cat: 7, unit: "ml", pack: 250, packLabel: "250 ml", price: 2500, buy: "month", where: "simba", spoon: 5,
    subs: ["Per 2 tbsp: 1/2 stock cube in 2 tbsp hot water + 1 tsp sugar + pinch of salt (milder taste).", "Oyster sauce (thicker, sweeter)."] },
  { id: "vinegar", name: "White vinegar", cat: 7, unit: "ml", pack: 500, packLabel: "500 ml", price: 1000, buy: "month", where: "any", spoon: 5,
    subs: ["Lemon juice (use double).", "Apple cider vinegar."] },
  { id: "ketchup", name: "Tomato ketchup", cat: 7, unit: "g", pack: 500, packLabel: "500 g", price: 2200, buy: "month", where: "any", spoon: 6,
    subs: ["Per 2 tbsp: 1 tbsp tomato paste + 1 tsp sugar + 1 tsp vinegar."] },
  { id: "honey", name: "Honey (Rwandan)", cat: 7, unit: "g", pack: 250, packLabel: "250 g jar", price: 2500, buy: "month", where: "any", spoon: 7,
    subs: ["Sugar (same amount)."] },
  { id: "pb", name: "Peanut butter", cat: 7, unit: "g", pack: 400, packLabel: "400 g jar", price: 3200, buy: "month", where: "any", spoon: 8,
    subs: ["Roasted groundnuts blended with a splash of oil.", "Any nut butter."] },

  // ---- Spices ----
  { id: "salt", name: "Salt", cat: 8, unit: "g", pack: 1000, packLabel: "1 kg", price: 500, buy: "month", where: "any", spoon: 6, subs: ["Any table salt."] },
  { id: "pepper", name: "Black pepper (ground)", cat: 8, unit: "g", pack: 50, packLabel: "50 g", price: 1500, buy: "month", where: "any", spoon: 2.5, subs: ["White pepper.", "Leave out."] },
  { id: "cumin", name: "Ground cumin", cat: 8, unit: "g", pack: 50, packLabel: "50 g", price: 1800, buy: "month", where: "simba", spoon: 2.5,
    subs: ["Ground coriander.", "Shawarma / baharat spice mix (has cumin in it)."] },
  { id: "paprika", name: "Paprika", cat: 8, unit: "g", pack: 50, packLabel: "50 g", price: 1800, buy: "month", where: "simba", spoon: 2.5,
    subs: ["Mild chili powder (use half) + pinch of sugar."] },
  { id: "herbs", name: "Dried oregano / mixed herbs", cat: 8, unit: "g", pack: 20, packLabel: "jar ~20 g", price: 1500, buy: "month", where: "any", spoon: 1,
    subs: ["Dried thyme or basil.", "Italian seasoning."] },
  { id: "chili", name: "Chili flakes / powder", cat: 8, unit: "g", pack: 50, packLabel: "50 g", price: 1200, buy: "month", where: "any", spoon: 2,
    subs: ["Akabanga chili oil (a few drops: it's very hot!).", "Fresh pili-pili chili, chopped."] },
  { id: "cinn", name: "Ground cinnamon", cat: 8, unit: "g", pack: 50, packLabel: "50 g", price: 1500, buy: "month", where: "any", spoon: 2.5,
    subs: ["Mixed spice.", "Leave out (sweet dishes just taste plainer)."] },
  { id: "stock", name: "Chicken stock cubes (halal)", cat: 8, unit: "cube", pack: 24, packLabel: "box of 24 (Royco/Maggi)", price: 1800, buy: "month", where: "any",
    subs: ["Vegetable stock cubes.", "1/2 tsp salt + a pinch of each spice in the dish."] },

  // ---- Baking ----
  { id: "sugar", name: "Sugar", cat: 9, unit: "g", pack: 1000, packLabel: "1 kg", price: 1700, buy: "month", where: "any", spoon: 4, subs: ["Brown sugar.", "Honey (in drinks/porridge)."] },
  { id: "bpowder", name: "Baking powder", cat: 9, unit: "g", pack: 100, packLabel: "100 g", price: 1000, buy: "month", where: "any", spoon: 4,
    subs: ["Self-raising flour instead of plain flour + baking powder.", "1/4 tsp baking soda + 1/2 tsp lemon juice per tsp."] },
  { id: "yeast", name: "Instant dry yeast", cat: 9, unit: "g", pack: 22, packLabel: "2 × 11 g sachets", price: 1000, buy: "month", where: "any", spoon: 3,
    subs: ["Quick pizza dough: 2 tsp baking powder per 250 g flour, no rising time (crust is more like a scone)."] },
  { id: "cflour", name: "Cornflour (corn starch)", cat: 9, unit: "g", pack: 400, packLabel: "400 g", price: 1500, buy: "month", where: "any", spoon: 3,
    subs: ["Plain wheat flour (use double).", "Potato starch."] },
  { id: "raisins", name: "Raisins", cat: 9, unit: "g", pack: 250, packLabel: "250 g", price: 2500, buy: "month", where: "any",
    subs: ["Chopped dates.", "Chopped dried mango.", "Leave out."] },

  // ---- Snacks & drinks ----
  { id: "nuts", name: "Groundnuts (peanuts), raw", cat: 10, unit: "g", pack: 500, packLabel: "500 g", price: 1600, buy: "month", where: "fresh",
    subs: ["Already-roasted salted peanuts.", "Cashews (pricier)."] },
  { id: "popcorn", name: "Popcorn kernels", cat: 10, unit: "g", pack: 500, packLabel: "500 g", price: 1500, buy: "month", where: "any",
    subs: ["Roasted groundnuts.", "Rice cakes."] },
  { id: "tea", name: "Tea bags (Rwandan tea)", cat: 10, unit: "pc", pack: 100, packLabel: "box of 100", price: 2500, buy: "month", where: "any", fixed: 100,
    subs: ["Loose leaf tea.", "Rwandan ground coffee (~250 g ≈ 4,500 RWF)."] },

  // ---- Kitchen supplies ----
  { id: "fbags", name: "Freezer / zip bags", cat: 11, unit: "pc", pack: 50, packLabel: "pack of 50", price: 2500, buy: "month", where: "any", fixed: 50,
    subs: ["Plastic food containers with lids.", "Cling film + foil."] },
  { id: "foil", name: "Aluminium foil", cat: 11, unit: "pc", pack: 1, packLabel: "1 roll", price: 2500, buy: "month", where: "any", fixed: 1,
    subs: ["Baking paper.", "Grease the tray well with oil instead."] },
];

/* ---------------- RECIPES ----------------
   ing: [ingredientId, quantity per serving (or per batch if yield > 1), optional note]
   yield: how many servings the ingredient list makes (default 1)
*/
const FLATBREAD_STEPS = [
  "Flatbreads: mix the flour, baking powder, a pinch of salt and the yogurt into a soft dough. Knead 1 min and rest 10 min.",
  "Split into balls (1 per serving), roll thin, and dry-fry in a hot pan 1–2 min per side until puffed with brown spots.",
];

const RECIPES = [
  // ========== BREAKFASTS ==========
  { id: "shakshuka", name: "Shakshuka (eggs in spiced tomato sauce)", type: "breakfast", cuisine: "Middle Eastern", time: 25, level: "Easy", img: "shakshuka",
    ing: [["oil", 10], ["onion", 75], ["pepperg", 75], ["garlic", 1], ["cumin", 1], ["paprika", 1], ["tomato", 240, "chopped"], ["salt", 1], ["pepper", 0.3], ["eggs", 2], ["parsley", 3], ["bread", 80, "to dip"]],
    steps: [
      "Heat the oil in a frying pan on medium. Fry the sliced onion and pepper for 5 min until soft.",
      "Add the garlic, cumin and paprika and stir for 30 seconds.",
      "Add the chopped tomatoes, salt and pepper. Simmer 8–10 min, squashing them, until thick.",
      "Make 2 hollows in the sauce and crack an egg into each. Cover and cook 4–6 min until the whites are set.",
      "Sprinkle parsley and eat from the pan with bread.",
    ], tip: "Make it faster with half a tin of chopped tomatoes instead of fresh." },

  { id: "porridge", name: "Banana & peanut-butter oat porridge", type: "breakfast", cuisine: "Western", time: 10, level: "Easy", img: "porridge",
    ing: [["oats", 60], ["milk", 200], ["salt", 0.3], ["cinn", 0.5], ["banana", 120], ["pb", 15], ["honey", 10]],
    steps: [
      "Put the oats, milk, 100 ml water, salt and cinnamon in a pot.",
      "Bring to a simmer and stir for 4–5 min until creamy.",
      "Top with sliced banana, a spoon of peanut butter and a drizzle of honey.",
    ], tip: "Out of milk? Use all water plus 1 tbsp peanut butter stirred in." },

  { id: "pancakes", name: "Fluffy banana pancakes", type: "breakfast", cuisine: "Western", time: 25, level: "Easy", img: "pancakes",
    ing: [["flour", 70], ["bpowder", 3], ["sugar", 8], ["salt", 0.5], ["eggs", 1], ["milk", 100], ["banana", 120, "half mashed, half sliced"], ["butter", 5], ["honey", 15]],
    steps: [
      "Mash half the banana in a bowl. Whisk in the egg and milk.",
      "Stir in the flour, baking powder, sugar and salt until just combined (small lumps are fine).",
      "Heat a non-stick pan on medium-low with a little butter. Pour in small circles of batter.",
      "Flip when bubbles appear on top (about 2 min). Cook 1 more minute.",
      "Serve with sliced banana and honey.",
    ], tip: "Cook all the batter. Extra pancakes freeze well; toast them from frozen." },

  { id: "omelette", name: "Cheesy veggie omelette & toast", type: "breakfast", cuisine: "Western", time: 15, level: "Easy", img: "omelette",
    ing: [["eggs", 2], ["onion", 40], ["pepperg", 40], ["tomato", 60], ["cheese", 25], ["butter", 5], ["salt", 0.5], ["pepper", 0.3], ["bread", 80]],
    steps: [
      "Finely chop the onion, pepper and tomato. Grate the cheese.",
      "Melt the butter in a pan and soften the onion and pepper for 3 min.",
      "Beat the eggs with salt and pepper and pour over the veg. Tilt the pan so it spreads.",
      "When almost set, add the tomato and cheese on one half, fold, and cook 1 more minute.",
      "Serve with toast.",
    ] },

  { id: "ful", name: "Ful medames (Egyptian beans) with egg", type: "breakfast", cuisine: "Middle Eastern", time: 15, level: "Easy", img: "ful",
    ing: [["ful", 200, "half a tin"], ["garlic", 1], ["cumin", 1], ["salt", 0.5], ["lemon", 0.5], ["olive", 10], ["tomato", 60], ["onion", 30], ["parsley", 3], ["eggs", 1, "boiled"], ["bread", 80]],
    steps: [
      "Boil the egg for 9 min, then cool it in cold water.",
      "Warm the beans with their liquid in a small pot for 5 min. Mash about half with a fork.",
      "Stir in the crushed garlic, cumin, salt and lemon juice.",
      "Put in a bowl. Top with chopped tomato, onion and parsley, a drizzle of olive oil and the egg in halves.",
      "Scoop it up with bread.",
    ], tip: "Store the other half tin in a covered container in the fridge (3 days)." },

  { id: "bpotatoes", name: "Crispy breakfast potatoes & fried eggs", type: "breakfast", cuisine: "Western", time: 30, level: "Easy", img: "bpotatoes",
    ing: [["potato", 250], ["oil", 15], ["onion", 50], ["pepperg", 50], ["paprika", 1], ["salt", 1], ["pepper", 0.3], ["eggs", 2]],
    steps: [
      "Dice the potatoes into 1.5 cm cubes. Boil 5 min, then drain well.",
      "Fry in hot oil for 10–12 min, turning now and then, until golden.",
      "Add the diced onion and pepper, paprika, salt and pepper, and fry 5 min more.",
      "Push to one side and fry the eggs in the same pan.",
    ], tip: "Boil the potatoes the night before to save 10 min in the morning." },

  { id: "tomtoast", name: "Tomato-garlic toast, eggs & avocado", type: "breakfast", cuisine: "Mediterranean", time: 15, level: "Easy", img: "tomtoast",
    ing: [["bread", 100], ["garlic", 1], ["tomato", 120], ["olive", 10], ["salt", 0.5], ["eggs", 2, "boiled"], ["avocado", 0.5]],
    steps: [
      "Boil the eggs for 8 min, then cool them in cold water.",
      "Toast the bread. Rub each slice with a cut garlic clove.",
      "Grate the tomato on a box grater (skin stays behind). Spoon it onto the toast, add salt and olive oil.",
      "Serve with sliced avocado and the eggs.",
    ], tip: "Use the other avocado half tomorrow. Leave the stone in, press cling film on, and keep it in the fridge." },

  { id: "torrijas", name: "Spanish torrijas (French toast) with banana", type: "breakfast", cuisine: "Mediterranean", time: 15, level: "Easy", img: "torrijas",
    ing: [["bread", 100, "3 slices, day-old is best"], ["milk", 100], ["eggs", 1], ["sugar", 8], ["cinn", 0.5], ["butter", 10], ["honey", 10], ["banana", 120]],
    steps: [
      "Whisk the egg, milk, half the sugar and the cinnamon in a flat dish.",
      "Soak each slice of bread 10 seconds per side.",
      "Fry in butter on medium for 2–3 min per side until golden.",
      "Sprinkle the remaining sugar and drizzle honey. Serve with banana.",
    ] },

  // ========== DINNERS (cook 2 servings: dinner + tomorrow's lunch) ==========
  { id: "roastchicken", name: "Lemon-garlic chicken & potato tray bake", type: "dinner", cuisine: "Mediterranean", time: 70, level: "Easy", img: "roastchicken",
    photoNote: "Photo shows a whole roast chicken; you'll use pieces.",
    ing: [["chthigh", 250], ["potato", 300], ["onion", 75], ["carrot", 60], ["garlic", 2], ["lemon", 0.5], ["oil", 20], ["cumin", 1.5], ["paprika", 1.5], ["herbs", 0.5], ["salt", 1.5], ["pepper", 0.5]],
    steps: [
      "Heat the oven to 200°C. Cut the potatoes into wedges, the onion into quarters and the carrots into sticks.",
      "In a big bowl, mix the oil, lemon juice, crushed garlic, cumin, paprika, herbs, salt and pepper.",
      "Toss the chicken and vegetables in the mix until coated. Spread on a tray (line it with foil to save washing).",
      "Roast 50–55 min, turning the potatoes halfway, until the chicken is golden and its juices run clear.",
      "Put half in a container for tomorrow's lunch before you eat.",
    ], tip: "Chicken is cooked when it reaches 75°C, or when no pink juice comes out when you pierce it by the bone." },

  { id: "bolognese", name: "Spaghetti bolognese", type: "dinner", cuisine: "Italian", time: 50, level: "Easy", img: "bolognese",
    ing: [["oil", 10], ["onion", 75], ["carrot", 50], ["garlic", 1], ["mince", 125], ["tpaste", 15], ["ttom", 200], ["herbs", 1], ["stock", 0.5], ["sugar", 2], ["salt", 1], ["pepper", 0.3], ["spag", 100], ["cheese", 15]],
    steps: [
      "Finely chop the onion and grate the carrot. Fry in the oil for 6 min until soft.",
      "Add the garlic and mince. Turn up the heat and break the mince up as it browns (6–8 min).",
      "Stir in the tomato paste for 1 min. Add the tinned tomatoes, herbs, crumbled stock cube, sugar and 100 ml water.",
      "Simmer with the lid half on for 25 min, stirring sometimes. Season with salt and pepper.",
      "Meanwhile boil the spaghetti in salted water according to the packet. Drain and serve topped with sauce and grated cheese.",
    ], tip: "Keep the lunch portion's sauce and pasta separate so the pasta doesn't go soggy." },

  { id: "friedrice", name: "Chicken egg fried rice", type: "dinner", cuisine: "Chinese", time: 35, level: "Easy", img: "friedrice",
    ing: [["rice", 90], ["chbreast", 120], ["oil", 15], ["eggs", 1], ["onion", 50], ["carrot", 40], ["garlic", 1], ["ginger", 5], ["peas", 70], ["soy", 20], ["salt", 0.3], ["pepper", 0.3]],
    steps: [
      "Cook the rice (1 part rice : 2 parts water, lid on, 15 min), then spread it on a plate to cool. Rice from the day before is even better.",
      "Cut the chicken into small cubes and season with salt and pepper. Fry in half the oil in a very hot pan for 5 min. Remove.",
      "Scramble the eggs in the pan, then remove them.",
      "Add the rest of the oil. Stir-fry the onion, diced carrot, garlic and ginger for 3 min, then add the frozen peas for 2 min.",
      "Add the rice and fry 3–4 min. Add the chicken, eggs and soy sauce, and toss everything together.",
    ] },

  { id: "fajitas", name: "Smoky chickpea fajitas with flatbreads", type: "dinner", cuisine: "Mexican", time: 40, level: "Easy", img: "fajitas",
    ing: [["chick", 60, "dried weight, already cooked (≈150 g cooked)"], ["oil", 15], ["onion", 75], ["pepperg", 100], ["paprika", 1.5], ["cumin", 1.5], ["chili", 0.5], ["salt", 1], ["lemon", 0.25], ["flour", 80], ["bpowder", 2], ["yog", 110, "80 ml for the dough + 30 ml to serve"], ["avocado", 0.5], ["tomato", 60]],
    steps: [
      ...FLATBREAD_STEPS,
      "Slice the onion and peppers into strips. Fry in hot oil for 6–8 min until slightly charred.",
      "Add the cooked chickpeas, paprika, cumin, chili and salt. Fry 5 min until the chickpeas crisp a little. Squeeze over lemon.",
      "Fill the flatbreads with the chickpea mix, sliced avocado, chopped tomato and a spoon of yogurt.",
    ], tip: "For lunch, pack the filling and the flatbread separately and warm the flatbread in a dry pan." },

  { id: "lentilsoup", name: "Turkish red lentil soup", type: "dinner", cuisine: "Middle Eastern", time: 40, level: "Easy", img: "lentilsoup",
    photoNote: "Similar-looking soup shown.",
    ing: [["butter", 10], ["onion", 60], ["carrot", 60], ["potato", 60], ["garlic", 1], ["tpaste", 10], ["cumin", 1.5], ["paprika", 1], ["lentil", 80], ["stock", 0.5], ["salt", 0.5], ["lemon", 0.25], ["bread", 80]],
    steps: [
      "Melt the butter in a pot. Fry the chopped onion, carrot and potato for 5 min.",
      "Add the garlic, tomato paste, cumin and paprika and stir 1 min.",
      "Add the rinsed lentils, stock cube and 500 ml water per serving. Simmer 25 min until everything is very soft.",
      "Blend, or mash hard with a potato masher, until smooth. Add more water if it's too thick and season.",
      "Serve with a squeeze of lemon and bread. Optional: drizzle with oil warmed with a pinch of paprika.",
    ] },

  { id: "shawarma", name: "Chicken shawarma bowl & garlic yogurt", type: "dinner", cuisine: "Middle Eastern", time: 60, level: "Medium", img: "shawarma",
    ing: [["chthigh", 200], ["yog", 80, "half for the marinade, half for the sauce"], ["garlic", 2], ["lemon", 0.5], ["cumin", 2], ["paprika", 2], ["cinn", 0.3], ["oil", 15], ["salt", 1.5], ["pepper", 0.5], ["rice", 80], ["tomato", 80], ["cucumber", 0.33], ["onion", 30]],
    steps: [
      "Marinade: mix half the yogurt, 1 garlic clove, half the lemon juice, the cumin, paprika, cinnamon, oil, salt and pepper. Coat the chicken and leave 30 min (or overnight in the fridge).",
      "Heat the oven to 220°C. Roast the chicken on a foil-lined tray for 35 min until charred at the edges.",
      "Meanwhile cook the rice. Make a salad of chopped tomato, cucumber and onion with a pinch of salt.",
      "Garlic sauce: the rest of the yogurt + 1 crushed garlic clove + the rest of the lemon juice + salt.",
      "Pull the chicken off the bones and slice. Serve over rice with salad and lots of garlic sauce.",
    ], tip: "Marinate the night before, so on the day it's just oven time." },

  { id: "arrabbiata", name: "Penne arrabbiata (spicy tomato pasta)", type: "dinner", cuisine: "Italian", time: 25, level: "Easy", img: "arrabbiata",
    ing: [["olive", 15], ["garlic", 2], ["chili", 0.7], ["ttom", 200], ["herbs", 0.5], ["sugar", 1], ["salt", 1], ["penne", 110], ["parsley", 3], ["cheese", 15]],
    steps: [
      "Boil salted water for the pasta.",
      "Warm the olive oil with sliced garlic and chili flakes on low heat for 2 min. Don't let the garlic brown.",
      "Add the tinned tomatoes, herbs, sugar and salt. Simmer 12 min.",
      "Cook the penne, keep a cup of the pasta water, then drain.",
      "Toss the pasta in the sauce with a splash of pasta water. Top with parsley and cheese.",
    ] },

  { id: "pizza", name: "Homemade pizza (veggie or chicken)", type: "dinner", cuisine: "Italian", time: 90, level: "Medium", img: "pizza",
    ing: [["flour", 125], ["yeast", 2], ["sugar", 2], ["salt", 1], ["oil", 10], ["tpaste", 20], ["ttom", 60], ["garlic", 1], ["herbs", 1], ["cheese", 70], ["pepperg", 50], ["onion", 30]],
    steps: [
      "Dough: mix the flour, yeast, sugar and salt. Add the oil and about 80 ml warm water per serving. Knead 8 min until smooth.",
      "Cover and leave somewhere warm for 1 hour until doubled.",
      "Sauce: simmer the tinned tomatoes, tomato paste, garlic and herbs for 10 min until thick.",
      "Heat the oven as high as it goes (220–250°C) with the tray inside.",
      "Stretch each dough ball thin onto oiled foil. Spread the sauce, then add the cheese, sliced pepper and onion.",
      "Slide onto the hot tray and bake 10–14 min until bubbling and golden.",
    ], tip: "Have leftover chicken from the tray bake? Shred it on top." },

  { id: "moussaka", name: "Potato & beef moussaka bake", type: "dinner", cuisine: "Greek", time: 80, level: "Medium", img: "moussaka",
    ing: [["potato", 250], ["oil", 15], ["onion", 60], ["garlic", 1], ["mince", 120], ["ttom", 150], ["cinn", 0.5], ["herbs", 0.5], ["salt", 1], ["pepper", 0.3], ["butter", 15], ["flour", 15], ["milk", 150], ["eggs", 0.5], ["cheese", 25]],
    steps: [
      "Slice the potatoes 0.5 cm thick, boil 6 min and drain.",
      "Fry the onion in oil for 5 min. Add the garlic and mince and brown it. Add the tinned tomatoes, cinnamon, herbs, salt and pepper and simmer 15 min.",
      "White sauce: melt the butter, stir in the flour for 1 min, then whisk in the milk slowly. Stir until thick (5 min). Off the heat, whisk in the egg and half the cheese.",
      "In an oven dish layer half the potatoes, all the meat, then the rest of the potatoes. Pour the white sauce over and add the rest of the cheese.",
      "Bake at 190°C for 35 min until golden. Rest 10 min before cutting.",
    ], tip: "It tastes even better reheated, so tomorrow's lunch wins." },

  { id: "beefstir", name: "Beef & green bean stir-fry with rice", type: "dinner", cuisine: "Chinese", time: 30, level: "Easy", img: "beefstir",
    photoNote: "Photo shows the broccoli version.",
    ing: [["beef", 130], ["cflour", 5], ["soy", 20], ["honey", 5], ["oil", 15], ["garlic", 1], ["ginger", 5], ["gbeans", 120], ["carrot", 40], ["rice", 80]],
    steps: [
      "Slice the beef very thin. Toss it with the cornflour and 1 tbsp of the soy sauce.",
      "Start the rice cooking.",
      "Fry the beef in very hot oil in 2 batches for 2 min each. Remove.",
      "Stir-fry the trimmed green beans and sliced carrot with the garlic and ginger for 4 min. Add 2 tbsp water to steam them.",
      "Return the beef. Add the rest of the soy sauce, the honey and 3 tbsp water. Toss until glossy, then serve with rice.",
    ] },

  { id: "tomegg", name: "Chinese tomato & egg stir-fry with rice", type: "dinner", cuisine: "Chinese", time: 20, level: "Easy", img: "tomegg",
    photoNote: "Similar stir-fry shown.",
    ing: [["eggs", 2.5], ["salt", 1], ["oil", 15], ["garlic", 1], ["tomato", 250], ["ketchup", 10], ["sugar", 5], ["soy", 5], ["cflour", 3], ["rice", 80]],
    steps: [
      "Start the rice. Beat the eggs with a pinch of salt. Cut the tomatoes into wedges.",
      "Scramble the eggs in half the oil until just set and still soft. Remove.",
      "Fry the garlic and tomatoes in the rest of the oil for 3–4 min until juicy.",
      "Add the ketchup, sugar and soy sauce, plus the cornflour mixed with 3 tbsp water. Simmer 1 min until glossy.",
      "Fold the eggs back in and serve over rice.",
    ], tip: "The cheapest dinner in the plan, and ready in 20 min." },

  { id: "chili", name: "Chili con carne with rice", type: "dinner", cuisine: "Mexican", time: 50, level: "Easy", img: "chili",
    ing: [["oil", 10], ["onion", 75], ["pepperg", 50], ["garlic", 1], ["mince", 110], ["cumin", 1.5], ["paprika", 1.5], ["chili", 0.5], ["tpaste", 10], ["ttom", 200], ["kbeans", 120], ["stock", 0.5], ["salt", 1], ["rice", 80]],
    steps: [
      "Fry the chopped onion and pepper in oil for 5 min. Add the garlic and mince and brown 6 min.",
      "Add the cumin, paprika, chili and tomato paste and stir 1 min.",
      "Add the tinned tomatoes, drained beans, stock cube and 100 ml water. Simmer 25 min until thick.",
      "Cook the rice. Taste and season the chili, then serve.",
    ], tip: "Leftover beans? Freeze them in a bag for the next chili." },

  { id: "tomsoup", name: "Creamy tomato soup & cheese toasties", type: "dinner", cuisine: "Western", time: 40, level: "Easy", img: "tomsoup",
    ing: [["butter", 15], ["onion", 60], ["carrot", 40], ["garlic", 1], ["tomato", 120], ["ttom", 200], ["stock", 0.5], ["sugar", 2], ["herbs", 0.3], ["milk", 60], ["salt", 0.5], ["bread", 100], ["cheese", 40]],
    steps: [
      "Melt half the butter and soften the chopped onion, carrot and garlic for 6 min.",
      "Add the chopped fresh tomatoes, tinned tomatoes, stock cube, sugar, herbs and 200 ml water per serving. Simmer 20 min.",
      "Blend or mash until smooth. Stir in the milk and warm through without boiling. Season.",
      "Toasties: put cheese between 2 slices of bread, butter the outsides, and fry in a pan 2–3 min per side.",
    ], tip: "Make the toastie fresh for lunch tomorrow and reheat only the soup." },

  { id: "sweetsour", name: "Sweet & sour chicken with rice", type: "dinner", cuisine: "Chinese", time: 40, level: "Medium", img: "sweetsour",
    ing: [["chbreast", 130], ["eggs", 0.5], ["cflour", 15], ["salt", 0.5], ["oil", 25], ["onion", 50], ["pepperg", 75], ["pineapple", 0.15], ["garlic", 1], ["ketchup", 30], ["vinegar", 15], ["sugar", 10], ["soy", 10], ["rice", 80]],
    steps: [
      "Start the rice. Cut the chicken into bite-size pieces. Dip in beaten egg, then toss in most of the cornflour with salt.",
      "Shallow-fry in oil for 5–6 min, turning, until crisp and golden. Drain on paper.",
      "Sauce: mix the ketchup, vinegar, sugar, soy sauce, the rest of the cornflour and 4 tbsp water.",
      "In a clean pan, stir-fry the onion and pepper chunks with the garlic for 3 min. Add the pineapple chunks and the sauce and bubble 1 min.",
      "Toss in the chicken and serve straight away with rice.",
    ], tip: "Eat the rest of the pineapple as snacks this week." },

  { id: "couscous", name: "Moroccan chicken & chickpea couscous", type: "dinner", cuisine: "Moroccan", time: 60, level: "Medium", img: "couscous",
    ing: [["oil", 10], ["chthigh", 200], ["salt", 1], ["onion", 75], ["garlic", 1], ["ginger", 3], ["cumin", 1], ["paprika", 1], ["cinn", 0.5], ["tpaste", 10], ["carrot", 80], ["chick", 40, "dried weight, cooked"], ["stock", 0.5], ["raisins", 10], ["cous", 80], ["butter", 5], ["parsley", 3]],
    steps: [
      "Season the chicken with salt and brown it in oil in a big pot, 5 min per side. Remove.",
      "Fry the onion 5 min. Add the garlic, ginger, cumin, paprika, cinnamon and tomato paste and stir 1 min.",
      "Return the chicken. Add the carrot chunks, chickpeas, stock cube, raisins and 300 ml water. Cover and simmer 30 min.",
      "Couscous: pour 100 ml boiling salted water per 80 g couscous over it, add the butter, cover 5 min, then fluff with a fork.",
      "Serve the chicken and sauce over the couscous with parsley.",
    ] },

  { id: "falafel", name: "Baked falafel pittas with garlic yogurt", type: "dinner", cuisine: "Middle Eastern", time: 60, level: "Medium", img: "falafel",
    photoNote: "Needs dried chickpeas soaked overnight (NOT cooked).",
    ing: [["chick", 70, "dried, soaked overnight, uncooked"], ["onion", 40], ["garlic", 2], ["parsley", 10], ["cumin", 2], ["salt", 1.5], ["flour", 90, "10 g in falafel + 80 g flatbread"], ["bpowder", 3], ["oil", 20], ["yog", 120, "80 ml dough + 40 ml sauce"], ["tomato", 80], ["cucumber", 0.33], ["cabbage", 50], ["lemon", 0.25]],
    steps: [
      "Drain the soaked chickpeas well. Mash or blend them with the onion, 1 garlic clove, parsley, cumin, salt, 10 g flour and 1 g baking powder until it holds together (finely chopped, not a paste).",
      "Shape into small patties. Brush a tray and the falafel with oil and bake at 200°C for 25 min, flipping halfway.",
      ...FLATBREAD_STEPS,
      "Garlic yogurt: yogurt + crushed garlic + lemon + salt.",
      "Stuff the flatbreads with falafel, shredded cabbage, tomato, cucumber and sauce.",
    ], tip: "No blender? Chop very finely with a knife, or crush in a bag with a bottle. Tinned chickpeas will NOT work." },

  { id: "koshari", name: "Egyptian koshari (lentils, rice & pasta)", type: "dinner", cuisine: "Middle Eastern", time: 60, level: "Medium", img: "koshari",
    ing: [["blentil", 50], ["rice", 50], ["spag", 40, "broken into short pieces"], ["salt", 1.5], ["oil", 30], ["onion", 120, "thinly sliced"], ["garlic", 2], ["cumin", 1.5], ["chili", 0.5], ["ttom", 150], ["tpaste", 10], ["vinegar", 10], ["sugar", 2]],
    steps: [
      "Boil the lentils in plenty of water for 15 min (still firm). Drain.",
      "Crispy onions: fry the sliced onions in the oil on medium for 15 min, stirring, until deep brown. Lift out and keep the oil.",
      "In 1 tbsp of the onion oil, toast the broken spaghetti until golden. Add the rice, lentils, salt and 220 ml water per serving. Cover and cook on low for 15 min.",
      "Sauce: fry the garlic in a little onion oil, then add the cumin, chili, tinned tomatoes, tomato paste and sugar. Simmer 10 min and stir in the vinegar.",
      "Serve the rice mix with spicy tomato sauce on top and a pile of crispy onions.",
    ], tip: "Very cheap and filling. Keep the crispy onions in a separate box so they stay crunchy." },

  { id: "alfredo", name: "Creamy chicken & spinach pasta", type: "dinner", cuisine: "Italian", time: 35, level: "Easy", img: "alfredo",
    ing: [["penne", 100], ["chbreast", 120], ["salt", 1], ["pepper", 0.5], ["oil", 5], ["butter", 15], ["garlic", 2], ["flour", 10], ["milk", 180], ["cheese", 35], ["spinach", 60]],
    steps: [
      "Boil the pasta in salted water.",
      "Slice the chicken thin, season it, and fry in oil for 5–6 min until cooked. Remove.",
      "Melt the butter in the same pan, add the garlic for 30 seconds, then the flour for 1 min.",
      "Whisk in the milk a little at a time and simmer until creamy (3–4 min). Stir in the grated cheese.",
      "Add the chopped spinach until wilted, then the chicken and drained pasta. Loosen with pasta water if needed.",
    ], tip: "Reheat lunch with a splash of milk so the sauce comes back creamy." },

  { id: "cabbagebeef", name: "Paprika beef & cabbage with mashed potatoes", type: "dinner", cuisine: "Eastern European", time: 40, level: "Easy", img: "cabbagebeef",
    ing: [["potato", 250], ["butter", 10], ["milk", 40], ["salt", 1.5], ["oil", 10], ["onion", 60], ["garlic", 1], ["mince", 100], ["paprika", 1], ["tpaste", 10], ["cabbage", 250], ["pepper", 0.3]],
    steps: [
      "Boil the peeled, chopped potatoes for 15 min until soft. Mash with the butter, warm milk and salt.",
      "Meanwhile brown the onion, garlic and mince in oil for 7 min.",
      "Add the paprika and tomato paste and stir 1 min.",
      "Add the shredded cabbage and 4 tbsp water. Cover and cook 10 min, stirring, until tender. Season with salt and pepper.",
      "Serve on the mash.",
    ] },

  { id: "beansoup", name: "Tuscan white bean & vegetable soup", type: "dinner", cuisine: "Italian", time: 40, level: "Easy", img: "beansoup",
    ing: [["olive", 10], ["onion", 60], ["carrot", 60], ["potato", 100], ["garlic", 1], ["ttom", 100], ["wbeans", 200, "half a tin, drained"], ["stock", 0.5], ["herbs", 0.5], ["spinach", 50], ["salt", 0.5], ["pepper", 0.3], ["bread", 80], ["cheese", 10]],
    steps: [
      "Soften the diced onion, carrot and potato in olive oil for 6 min.",
      "Add the garlic, tinned tomatoes, beans, stock cube, herbs and 400 ml water per serving.",
      "Simmer 20 min. Mash a few beans against the pot to thicken it.",
      "Stir in the spinach for 2 min. Season and serve with bread and grated cheese.",
    ] },

  { id: "kungpao", name: "Kung pao chicken with peanuts", type: "dinner", cuisine: "Chinese", time: 30, level: "Medium", img: "kungpao",
    ing: [["chbreast", 130], ["cflour", 8], ["soy", 20], ["vinegar", 10], ["sugar", 6], ["oil", 20], ["nuts", 30], ["chili", 1], ["garlic", 1], ["ginger", 5], ["onion", 40], ["pepperg", 50], ["rice", 80]],
    steps: [
      "Start the rice. Dice the chicken and toss it with half the cornflour and 1 tsp soy sauce.",
      "Sauce: the rest of the soy sauce, the vinegar, sugar, the rest of the cornflour and 3 tbsp water.",
      "Fry the peanuts in the oil until golden. Remove.",
      "Fry the chicken in the hot oil for 5 min. Add the chili, garlic, ginger, onion and pepper and stir-fry 2 min.",
      "Pour in the sauce, toss until thick and glossy, add the peanuts, and serve.",
    ] },

  { id: "syrianrice", name: "Syrian spiced rice with beef (hashweh)", type: "dinner", cuisine: "Middle Eastern", time: 45, level: "Easy", img: "syrianrice",
    ing: [["butter", 10], ["oil", 10], ["onion", 60], ["mince", 100], ["cinn", 0.7], ["cumin", 0.7], ["salt", 1.5], ["pepper", 0.5], ["rice", 90], ["stock", 0.5], ["nuts", 15, "toasted"], ["parsley", 3], ["yog", 80], ["cucumber", 0.25]],
    steps: [
      "Melt the butter with the oil and fry the chopped onion 5 min. Add the mince and brown it well.",
      "Add the cinnamon, cumin, salt and pepper, then stir in the rinsed rice for 1 min.",
      "Add 180 ml boiling water per serving and the stock cube. Cover and cook on the lowest heat for 15 min, then rest 5 min.",
      "Toast the peanuts in a dry pan.",
      "Fluff the rice. Top with nuts and parsley and serve with a cucumber-yogurt salad (yogurt + chopped cucumber + salt).",
    ] },

  { id: "kofta", name: "Beef kofta burgers in flatbread", type: "dinner", cuisine: "Turkish", time: 50, level: "Medium", img: "kofta",
    ing: [["mince", 125], ["onion", 40, "grated"], ["garlic", 1], ["cumin", 1.5], ["paprika", 1], ["parsley", 5], ["salt", 1.5], ["flour", 80], ["bpowder", 2], ["yog", 120, "80 ml dough + 40 ml sauce"], ["oil", 10], ["tomato", 60], ["cucumber", 0.25], ["cabbage", 50]],
    steps: [
      "Mix the mince with the grated onion, garlic, cumin, paprika, chopped parsley and salt. Shape into flat patties (2 per serving).",
      ...FLATBREAD_STEPS,
      "Fry the patties in a little oil for 4 min per side until cooked through.",
      "Stir a pinch of salt and garlic into the yogurt for the sauce.",
      "Fill the flatbreads with kofta, shredded cabbage, tomato, cucumber and yogurt sauce.",
    ] },

  { id: "lomein", name: "Beef lo mein (noodle stir-fry)", type: "dinner", cuisine: "Chinese", time: 30, level: "Easy", img: "lomein",
    ing: [["noodles", 90], ["beef", 110], ["soy", 25], ["honey", 5], ["oil", 15], ["garlic", 1], ["ginger", 4], ["onion", 40], ["carrot", 50], ["cabbage", 100]],
    steps: [
      "Cook the noodles by the packet, drain, and toss with a drop of oil.",
      "Slice the beef thin and toss it with 1 tsp soy sauce.",
      "Sear the beef in a very hot pan with half the oil for 2 min. Remove.",
      "Stir-fry the onion, carrot strips, shredded cabbage, garlic and ginger in the rest of the oil for 4 min.",
      "Add the noodles, beef, the rest of the soy sauce and the honey, and toss everything together for 2 min.",
    ] },

  { id: "tortilla", name: "Spanish tortilla (potato omelette) & salad", type: "dinner", cuisine: "Spanish", time: 45, level: "Medium", img: "tortilla",
    ing: [["potato", 250], ["onion", 75], ["oil", 40], ["salt", 1.5], ["eggs", 3], ["tomato", 100], ["cucumber", 0.33], ["vinegar", 5]],
    steps: [
      "Slice the potatoes and onion thinly. Cook gently in the oil in a covered frying pan on low for 20 min until soft but not brown.",
      "Beat the eggs with salt. Tip the potatoes in (drain off the oil and keep it) and mix. Leave 5 min.",
      "Heat 1 tbsp of the kept oil in the pan. Pour in the mix and cook on low for 8 min.",
      "Put a plate on top, flip, slide the tortilla back in, and cook 3–4 min more.",
      "Serve warm or cold with a tomato-cucumber salad dressed with vinegar, oil and salt.",
    ], tip: "Great cold for lunch the next day." },

  // ========== QUICK LUNCHES (Day 1, or swap in any time) ==========
  { id: "shopska", name: "Shopska-style salad with bread & egg", type: "lunch", cuisine: "Mediterranean", time: 15, level: "Easy", img: "shopska",
    ing: [["tomato", 150], ["cucumber", 0.5], ["pepperg", 50], ["onion", 30], ["cheese", 40], ["olive", 10], ["vinegar", 5], ["salt", 0.5], ["eggs", 1, "boiled"], ["bread", 80]],
    steps: ["Boil the egg for 9 min.", "Chop the tomato, cucumber, pepper and onion into chunks.", "Dress with olive oil, vinegar and salt. Grate the cheese over the top.", "Serve with bread and the egg."] },
  { id: "hummuswrap", name: "Hummus & veggie wrap", type: "lunch", cuisine: "Middle Eastern", time: 20, level: "Easy", img: "hummus",
    ing: [["chick", 40, "dried weight, cooked"], ["garlic", 1], ["lemon", 0.25], ["olive", 10], ["cumin", 0.5], ["salt", 0.5], ["flour", 80], ["bpowder", 2], ["yog", 80], ["cucumber", 0.25], ["tomato", 60], ["cabbage", 40]],
    steps: ["Mash the warm cooked chickpeas with garlic, lemon, olive oil, cumin, salt and 2–3 tbsp water until smooth.", ...FLATBREAD_STEPS, "Spread the hummus on the flatbread, add the salad, and roll up."] },
  { id: "potsalad", name: "Potato, egg & yogurt salad", type: "lunch", cuisine: "Western", time: 25, level: "Easy", img: "potsalad",
    ing: [["potato", 250], ["eggs", 2], ["yog", 60], ["lemon", 0.25], ["onion", 20], ["carrot", 30], ["parsley", 3], ["salt", 1], ["pepper", 0.3]],
    steps: ["Boil the potato chunks for 12 min and the eggs for 9 min. Cool both.", "Mix the yogurt, lemon, salt and pepper.", "Toss in the potatoes, chopped eggs, finely chopped onion, grated carrot and parsley."] },
  { id: "flatbread", name: "2-ingredient yogurt flatbreads", type: "lunch", cuisine: "Middle Eastern", time: 20, level: "Easy", img: "flatbread",
    ing: [["flour", 80], ["bpowder", 2], ["yog", 80], ["salt", 0.3]],
    steps: [...FLATBREAD_STEPS, "Wrap in a towel to keep soft. Freeze extras between baking paper."], tip: "Use instead of bread whenever you run out." },

  // ========== SNACKS ==========
  { id: "pbcookies", name: "Easy peanut butter cookies (batch)", type: "snack", cuisine: "Western", time: 25, level: "Easy", img: "pbcookies", yield: 7,
    ing: [["pb", 125], ["sugar", 90], ["eggs", 1], ["flour", 30], ["bpowder", 2]],
    steps: ["Heat the oven to 180°C.", "Mix everything into a dough. Roll into 12 balls and press each flat with a fork in a cross pattern on a foil-lined tray.", "Bake 10–12 min. They firm up as they cool.", "Keep in a sealed jar for the week: 1–2 cookies per snack."] },
  { id: "rockcakes", name: "Banana-raisin rock cakes (batch)", type: "snack", cuisine: "British", time: 35, level: "Easy", img: "rockcakes", yield: 7,
    ing: [["flour", 200], ["bpowder", 8], ["sugar", 60], ["cinn", 2], ["butter", 80], ["raisins", 60], ["eggs", 1], ["banana", 120, "mashed"], ["milk", 20]],
    steps: ["Heat the oven to 190°C.", "Rub the butter into the flour, baking powder and cinnamon with your fingertips until it looks like crumbs.", "Stir in the sugar and raisins, then the egg, mashed banana and milk, to make a stiff, rough dough.", "Drop 14 rough heaps onto a foil-lined tray. Bake 15–18 min until golden.", "Keep in a sealed jar: 2 per snack."] },
  { id: "s_banana", name: "Banana", type: "snack", emoji: "🍌", time: 0, level: "Easy", ing: [["banana", 120]], steps: ["Peel and enjoy."] },
  { id: "s_nuts", name: "Roasted groundnuts", type: "snack", emoji: "🥜", time: 15, level: "Easy", ing: [["nuts", 30], ["salt", 0.3]],
    steps: ["Roast a big batch in a dry pan (stirring) or in the oven at 180°C for 12–15 min. Salt while warm, cool, and store in a jar. One small handful = 1 snack."] },
  { id: "s_yog", name: "Yogurt with honey", type: "snack", emoji: "🍯", time: 1, level: "Easy", ing: [["yog", 150], ["honey", 10]], steps: ["Spoon the yogurt into a bowl and drizzle honey over it."] },
  { id: "s_popcorn", name: "Stovetop popcorn", type: "snack", emoji: "🍿", time: 8, level: "Easy", ing: [["popcorn", 30], ["oil", 5], ["salt", 0.5]],
    steps: ["Heat the oil in a pot with 3 kernels. When they pop, add the rest, put the lid on, and shake now and then.", "When the popping slows to 2 seconds apart, take it off the heat. Salt it."] },
  { id: "s_pineapple", name: "Fresh pineapple", type: "snack", emoji: "🍍", time: 5, level: "Easy", ing: [["pineapple", 0.25]], steps: ["Cut a quarter of the pineapple into chunks."] },
  { id: "s_carrotpb", name: "Carrot sticks with peanut butter", type: "snack", emoji: "🥕", time: 5, level: "Easy", ing: [["carrot", 80], ["pb", 15]], steps: ["Cut the carrot into sticks and dip them in peanut butter."] },
  { id: "s_avotoast", name: "Avocado toast", type: "snack", emoji: "🥑", time: 5, level: "Easy", ing: [["bread", 40], ["avocado", 0.5], ["lemon", 0.1], ["salt", 0.3], ["chili", 0.1]], steps: ["Toast 1 slice of bread. Mash the avocado on it with lemon, salt and a pinch of chili."] },
  { id: "s_egg", name: "Boiled egg & cucumber", type: "snack", emoji: "🥚", time: 10, level: "Easy", ing: [["eggs", 1], ["cucumber", 0.25], ["salt", 0.2]], steps: ["Boil the egg for 9 min. Eat it with cucumber slices and salt."] },
];

/* ---------------- 30-DAY PLAN ----------------
   Day 1 = shopping day (ideally a Saturday). Top-ups on days 8, 15 and 22.
   Dinners are cooked for 2: you eat 1 tonight and take 1 for lunch tomorrow.
*/
const BREAKFASTS = ["tomtoast","shakshuka","porridge","ful","torrijas","omelette","pancakes",
  "bpotatoes","shakshuka","porridge","tomtoast","ful","torrijas","omelette",
  "pancakes","shakshuka","porridge","bpotatoes","ful","torrijas","tomtoast",
  "omelette","pancakes","porridge","ful","torrijas","bpotatoes","tomtoast","shakshuka","pancakes"];
const DINNERS = ["roastchicken","bolognese","friedrice","fajitas","lentilsoup","shawarma","arrabbiata",
  "pizza","moussaka","beefstir","tomegg","chili","tomsoup","sweetsour",
  "couscous","falafel","koshari","alfredo","cabbagebeef","beansoup","kungpao",
  "syrianrice","kofta","lomein","tortilla","friedrice","fajitas","lentilsoup","roastchicken","bolognese"];
const BATCH_DAYS = { 2: "pbcookies", 9: "rockcakes", 16: "pbcookies", 23: "rockcakes" };
const SNACK_ROTATION = ["s_banana","s_nuts","s_yog","s_popcorn","s_pineapple","s_carrotpb","s_avotoast","s_egg"];

const PREP_NOTES = {
  1: ["🧊 Unpack: split all meat into freezer bags (250–500 g each), label, and freeze. Keep the chicken thighs for tonight in the fridge.",
      "🍞 Freeze half the bread loaf.",
      "🫘 Tonight: soak 240 g dried chickpeas in plenty of water (for fajitas on days 4 and 27)."],
  2: ["🫘 Boil the soaked chickpeas 60–75 min until soft. Cool, then freeze in 2 bags (days 4 and 27).",
      "🍪 Bake the peanut butter cookies (snacks for days 2–8).",
      "🥜 Roast a batch of groundnuts for snacks."],
  5: ["🍗 Tonight: start the shawarma marinade for tomorrow (optional but tastier)."],
  8: ["🛒 Top-up shop #1: see Shopping → Top-up Day 8.", "🍞 Freeze half the new loaf."],
  9: ["🧁 Bake the rock cakes (snacks for days 9–15)."],
  14: ["🫘 Tonight: soak 80 g chickpeas for the couscous and 140 g for the falafel (2 separate bowls)."],
  15: ["🛒 Top-up shop #2 (biggest top-up: eggs, potatoes, carrots, cabbage too).", "🫘 Boil only the couscous chickpeas (80 g) for 60 min. Keep the falafel chickpeas soaking raw: change their water, and keep them in the fridge."],
  16: ["🍪 Bake the peanut butter cookies (snacks for days 16–22).", "🧆 The falafel chickpeas must stay RAW (soaked only)."],
  22: ["🛒 Top-up shop #3 (covers days 22–30).", "🍞 Freeze half the new loaf."],
  23: ["🧁 Bake the rock cakes (snacks for days 23–29)."],
  26: ["🫘 Take the second bag of cooked chickpeas out of the freezer for tomorrow's fajitas."],
  30: ["🍝 You cook bolognese for 2: freeze the extra portion as a free meal for next month.", "📝 Check the pantry: much of the rice, flour, oil, spices and sauces is left for month 2!"],
};

function buildPlan() {
  const days = [];
  for (let d = 1; d <= 30; d++) {
    const lunch = d === 1 ? { r: "shopska", s: 1 } : { lo: DINNERS[d - 2] };
    const snacks = [];
    // batch bake (counts ingredients on the bake day only)
    let batchFrom = null;
    for (const bd of Object.keys(BATCH_DAYS).map(Number)) if (d >= bd && d < bd + 7) batchFrom = bd;
    if (batchFrom === d) snacks.push({ r: BATCH_DAYS[d], s: 7, note: "bake the batch" });
    else if (batchFrom) snacks.push({ from: BATCH_DAYS[batchFrom] });
    else snacks.push({ r: "s_popcorn", s: 1 });
    snacks.push({ r: SNACK_ROTATION[(d - 1) % SNACK_ROTATION.length], s: 1 });
    days.push({
      day: d,
      weekend: [1, 2, 8, 9, 15, 16, 22, 23, 29, 30].includes(d),
      breakfast: { r: BREAKFASTS[d - 1], s: 1 },
      lunch,
      dinner: { r: DINNERS[d - 1], s: 2 },
      snacks,
      prep: PREP_NOTES[d] || [],
    });
  }
  return days;
}

const SHOPS = [
  { id: "big", name: "Big shop", day: 1, desc: "Day 1: pantry, freezer meat and the first week of fresh food." },
  { id: "t8", name: "Top-up Day 8", day: 8, desc: "Fresh veg, fruit, dairy and bread for days 8–14." },
  { id: "t15", name: "Top-up Day 15", day: 15, desc: "Fresh food for days 15–21, plus eggs, potatoes, carrots and cabbage for the rest of the month." },
  { id: "t22", name: "Top-up Day 22", day: 22, desc: "Fresh food for days 22–30." },
];

const FREEZER_IDS = ["chthigh", "chbreast", "mince", "beef"];
