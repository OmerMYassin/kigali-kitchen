/* Kigali Kitchen v2 — interactive meal plan, pantry, shopping & spending (vanilla JS) */
(() => {
  "use strict";

  /* =====================================================================
     STATE
     ===================================================================== */
  const KEY = "kigali-kitchen-v2";
  const DEF = {
    tab: "plan", day: 1, today: 1, planView: "day", shopSel: null, budget: 250000,
    prices: {}, customIngs: {}, ingRules: {}, customRecipes: {}, hidden: {},
    plan: {}, cooked: {}, stock: {}, restock: {}, shops: {}, shopAdds: {}, receipts: [],
    rtype: "all", q: "", hideTicked: false,
  };
  let S;
  try { S = Object.assign(JSON.parse(JSON.stringify(DEF)), JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch { S = JSON.parse(JSON.stringify(DEF)); }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch { toast("Couldn't save. Your phone storage may be full (custom photos take space)."); }
  }

  /* =====================================================================
     INGREDIENTS & RECIPES (base data + your edits)
     ===================================================================== */
  const BASE_ING = Object.fromEntries(INGREDIENTS.map(i => [i.id, i]));
  const BASE_REC = Object.fromEntries(RECIPES.map(r => [r.id, r]));
  const BASE_PLAN = buildBasePlan();
  const ING = id => S.customIngs[id] || BASE_ING[id];
  const allIngs = () => [...INGREDIENTS, ...Object.values(S.customIngs)];
  const price = id => (S.prices[id] != null ? S.prices[id] : (ING(id) ? ING(id).price : 0));
  const SPICE_SECS = [7];
  const MINOR = new Set(["salt", "pepper", "oil", "sugar", "flour", "bpowder", "stock", "tpaste", "garlic", "parsley", "lemon"]);

  function toGrams(it, q) {
    if (it.unit === "g" || it.unit === "ml") return q;
    if (it.each) return q * it.each[0];
    if (it.unit === "clove") return q * 5;
    if (it.unit === "cube") return q * 10;
    return q * 100;
  }
  function convertQty(from, to, q) {
    const a = ING(from), b = ING(to);
    if (a.unit === b.unit) return q;
    const g = toGrams(a, q);
    if (b.unit === "g" || b.unit === "ml") return g;
    if (b.each) return g / b.each[0];
    return Math.max(0.25, Math.round((g / 100) * 4) / 4);
  }
  const rawRecipe = id => S.customRecipes[id] || BASE_REC[id];
  function R(id) {
    const r = rawRecipe(id);
    if (!r) return null;
    const ing = [];
    for (const [iid, q, note] of r.ing) {
      if (!ING(iid)) continue;
      const rule = S.ingRules[iid];
      if (rule && rule.mode === "remove") continue;
      if (rule && rule.mode === "replace" && ING(rule.to)) { ing.push([rule.to, convertQty(iid, rule.to, q), `instead of ${ING(iid).name.toLowerCase()}`]); continue; }
      ing.push([iid, q, note]);
    }
    return Object.assign({}, r, { ing, edited: !!(S.customRecipes[id] && BASE_REC[id]), custom: !BASE_REC[id] });
  }
  const recipeIds = () => [...new Set([...RECIPES.map(r => r.id), ...Object.keys(S.customRecipes)])];
  const recipeList = () => recipeIds().filter(id => !S.hidden[id]).map(R).filter(Boolean);
  const imgSrc = r => r.photo || (r.img ? `images/${r.img}.jpg` : null);

  /* =====================================================================
     FORMATTING
     ===================================================================== */
  const rwf = n => Math.round(n).toLocaleString("en-US") + " RWF";
  const k = n => (Math.round(n / 100) / 10).toLocaleString("en-US") + "k";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function frac(x) {
    const whole = Math.floor(x + 1e-9), f = x - whole;
    const opts = [[0, ""], [0.25, "¼"], [1 / 3, "⅓"], [0.5, "½"], [2 / 3, "⅔"], [0.75, "¾"], [1, ""]];
    let best = opts[0];
    for (const o of opts) if (Math.abs(o[0] - f) < Math.abs(best[0] - f)) best = o;
    const w = best[0] === 1 ? whole + 1 : whole;
    if (w === 0 && !best[1]) return x > 0 ? "¼" : "0";
    return (w ? String(w) : "") + best[1];
  }
  const plural = (n, w) => (n > 1.01 ? w + "s" : w);
  function fmtQty(id, q) {
    const it = ING(id);
    if (it.unit === "pc") return frac(q);
    if (it.unit === "clove") return `${frac(q)} ${plural(q, "clove")}`;
    if (it.unit === "cube") return `${frac(q)} ${plural(q, "cube")}`;
    if (it.spoon && q < it.spoon * 9) {
      const tsp = q / it.spoon;
      if (tsp < 0.2) return "a pinch";
      const s = tsp >= 3 ? `${frac(tsp / 3)} tbsp` : `${frac(tsp)} tsp`;
      return q >= 10 ? `${s} (${Math.round(q)} ${it.unit})` : s;
    }
    let s = q >= 1000 ? `${+(q / 1000).toFixed(2)} ${it.unit === "g" ? "kg" : "L"}` : `${q >= 50 ? Math.round(q / 5) * 5 : Math.round(q)} ${it.unit}`;
    if (it.each) s += ` · ${frac(q / it.each[0])} ${plural(q / it.each[0], it.each[1])}`;
    return s;
  }
  function fmtAmt(id, q) {
    const it = ING(id);
    if (!it) return String(q);
    if (it.unit === "g" || it.unit === "ml") return q >= 1000 ? `${+(q / 1000).toFixed(2)} ${it.unit === "g" ? "kg" : "L"}` : `${Math.round(q)} ${it.unit}`;
    const n = Math.round(q * 10) / 10;
    return `${n} ${it.unit === "pc" ? (n === 1 ? "piece" : "pieces") : plural(n, it.unit)}`;
  }
  const originChip = o => `<span class="chip ${o}">${o === "local" ? "Local" : o === "regional" ? "East Africa" : "Imported"}</span>`;

  /* =====================================================================
     PLAN (base + your swaps)
     ===================================================================== */
  function fallback(type, d, salt) {
    const c = recipeList().filter(r => r.type === type && !(r.yield > 1));
    if (!c.length) return null;
    return c[(d * 7 + salt) % c.length].id;
  }
  const valid = id => id && !S.hidden[id] && R(id);
  function dinnerId(d) {
    const o = S.plan[d] || {};
    const id = o.dinner || BASE_PLAN[d - 1].dinner;
    return valid(id) ? id : fallback("dinner", d, 1);
  }
  function getDay(d) {
    const b = BASE_PLAN[d - 1], o = S.plan[d] || {};
    const bf = valid(o.breakfast || b.breakfast) ? (o.breakfast || b.breakfast) : fallback("breakfast", d, 2);
    let lunch;
    if (o.lunch && o.lunch !== "lo" && valid(o.lunch)) lunch = { r: o.lunch, s: 1 };
    else if (d === 1) lunch = { r: valid("shopska") ? "shopska" : fallback("lunch", d, 3), s: 1 };
    else lunch = { lo: dinnerId(d - 1) };
    const snacks = b.snacks.map((s, i) => {
      const ov = o.snacks && o.snacks[i];
      if (ov && valid(ov)) return { r: ov, s: 1 };
      if (s.r) return valid(s.r) ? s : { r: fallback("snack", d, 4 + i), s: 1 };
      if (s.from) return valid(s.from) ? s : { r: fallback("snack", d, 4 + i), s: 1 };
      return s;
    });
    return { day: d, weekend: b.weekend, breakfast: bf, lunch, dinner: dinnerId(d), snacks };
  }
  function entries(d) {
    const day = getDay(d);
    return [
      { slot: "breakfast", label: "Breakfast", key: `${d}|breakfast`, r: day.breakfast, s: 1, d },
      Object.assign({ slot: "lunch", label: "Lunch", key: `${d}|lunch`, d }, day.lunch),
      { slot: "dinner", label: "Dinner", key: `${d}|dinner`, r: day.dinner, s: 2, d },
      ...day.snacks.map((s, i) => Object.assign({ slot: "snack", idx: i, label: "Snack", key: `${d}|snack${i}`, d }, s)),
    ];
  }
  function setSlot(d, slot, id) {
    S.plan[d] = S.plan[d] || {};
    if (slot.startsWith("snack")) { const i = +slot.slice(5); S.plan[d].snacks = S.plan[d].snacks || []; S.plan[d].snacks[i] = id; }
    else S.plan[d][slot] = id;
  }

  /* =====================================================================
     USAGE, STOCK SCORE, SHOPPING SIMULATION
     ===================================================================== */
  function usageMap(includeCooked) {
    const U = {}, used = {};
    for (let d = 1; d <= 30; d++) {
      for (const e of entries(d)) {
        if (!e.r || (!includeCooked && S.cooked[e.key])) continue;
        const r = R(e.r);
        if (!r) continue;
        for (const [id, q] of r.ing) {
          (U[id] = U[id] || new Array(31).fill(0))[d] += (q * e.s) / (r.yield || 1);
          ((used[id] = used[id] || {})[d] = used[id][d] || new Set()).add(r.name);
        }
      }
    }
    return { U, used };
  }
  function stockScore(r) {
    const main = r.ing.filter(([id]) => !MINOR.has(id) && !SPICE_SECS.includes(ING(id).sec));
    if (!main.length) return { pct: 1, missing: [] };
    const missing = main.filter(([id, q]) => (S.stock[id] || 0) + 1e-9 < q * (r.type === "dinner" ? 2 : 1) / (r.yield || 1)).map(([id]) => ING(id).name);
    return { pct: 1 - missing.length / main.length, missing };
  }
  const hasStock = () => Object.values(S.stock).some(v => v > 0);

  const shopStatus = id => (S.shops[id] && S.shops[id].status) || "planned";
  const effDay = s => Math.max(s.day, S.today);
  function coverEnd(it, d) {
    if (it.buy === "month") return 30;
    if (it.buy === "fortnight") return d < 15 ? 14 : 30;
    const nx = SHOPS.filter(s => shopStatus(s.id) !== "done").map(effDay).filter(x => x > d);
    return nx.length ? Math.min(...nx) - 1 : 30;
  }
  function itemCost(it) {
    if (it.id && ING(it.id)) return it.packs * price(it.id);
    return (it.price || 0) * (it.packs || 1);
  }
  function computeShops() {
    const { U, used } = usageMap(false);
    const real = {}, virt = {};
    for (const it of allIngs()) { real[it.id] = Math.max(0, S.stock[it.id] || 0); virt[it.id] = 0; }
    const lists = {};
    const firstOpen = SHOPS.find(s => shopStatus(s.id) !== "done");
    for (let d = S.today; d <= 30; d++) {
      for (const s of SHOPS) {
        if (effDay(s) !== d) continue;
        const st = shopStatus(s.id);
        if (st === "done") continue;
        if (st === "shopping") {
          const sh = S.shops[s.id];
          for (const it of sh.items) if (!(it.key in sh.ticks) && it.id && ING(it.id)) virt[it.id] += it.packs * ING(it.id).pack;
          lists[s.id] = { status: st, items: sh.items };
          continue;
        }
        const items = [];
        for (const it of allIngs()) {
          if (it.noCarry) virt[it.id] = 0;
          let need = 0; const recs = new Set();
          if (it.fixed) need = firstOpen && s.id === firstOpen.id ? it.fixed : 0;
          else {
            const end = coverEnd(it, d);
            for (let x = d; x <= end; x++) {
              need += (U[it.id] && U[it.id][x]) || 0;
              if (used[it.id] && used[it.id][x]) used[it.id][x].forEach(n => recs.add(n));
            }
          }
          const have = real[it.id] + virt[it.id];
          let packs = need > have + 1e-9 ? Math.ceil((need - have) / it.pack - 1e-6) : 0;
          const restock = !!S.restock[it.id] && firstOpen && s.id === firstOpen.id;
          if (restock && packs === 0) packs = 1;
          if (packs > 0) {
            virt[it.id] += packs * it.pack;
            items.push({ key: it.id, id: it.id, packs, need, have, recipes: [...recs], restock });
          }
        }
        for (const a of S.shopAdds[s.id] || []) items.push(Object.assign({ manual: true }, a));
        lists[s.id] = { status: "planned", items };
      }
      for (const id in U) {
        let q = U[id][d] || 0;
        if (!q) continue;
        const r = Math.min(real[id] || 0, q);
        real[id] = (real[id] || 0) - r; q -= r;
        virt[id] = Math.max(0, (virt[id] || 0) - q);
      }
    }
    for (const s of SHOPS) if (shopStatus(s.id) === "done") lists[s.id] = { status: "done", items: S.shops[s.id].items };
    for (const s of SHOPS) if (!lists[s.id]) lists[s.id] = { status: "planned", items: [] };
    return lists;
  }
  function moneySummary(lists) {
    lists = lists || computeShops();
    let planned = 0, estimateAll = 0;
    for (const s of SHOPS) {
      const L = lists[s.id], sh = S.shops[s.id];
      for (const it of L.items) {
        const c = itemCost(it);
        if (L.status === "planned") { planned += c; estimateAll += c; }
        else if (L.status === "shopping") { estimateAll += c; if (!(it.key in sh.ticks)) planned += c; }
        else if (it.key in (sh.ticks || {})) estimateAll += c;
      }
    }
    const spent = S.receipts.reduce((a, r) => a + (+r.total || 0), 0);
    const projected = S.receipts.length ? spent + planned : estimateAll;
    return { planned, spent, projected, estimateAll };
  }

  /* =====================================================================
     ACTIONS ON STOCK
     ===================================================================== */
  function toggleCooked(e) {
    const key = e.key;
    if (S.cooked[key]) {
      for (const [id, q] of Object.entries(S.cooked[key].ded || {})) S.stock[id] = (S.stock[id] || 0) + q;
      delete S.cooked[key];
      return null;
    }
    const ded = {}, ranOut = [];
    if (e.r) {
      const r = R(e.r);
      for (const [id, q] of r.ing) {
        const amt = (q * e.s) / (r.yield || 1);
        const have = S.stock[id] || 0;
        const take = Math.min(have, amt);
        if (take > 0) { S.stock[id] = have - take; ded[id] = (ded[id] || 0) + take; if (S.stock[id] < 1e-6 && have > 0) ranOut.push(ING(id).name); }
      }
    }
    S.cooked[key] = { ded };
    return ranOut;
  }
  function ensureStarted(shopId, lists) {
    if (shopStatus(shopId) !== "planned") return;
    lists = lists || computeShops();
    S.shops[shopId] = { status: "shopping", items: lists[shopId].items.map(i => Object.assign({}, i)), ticks: {}, replaced: {} };
    delete S.shopAdds[shopId];
  }
  function tickItem(shopId, key) {
    ensureStarted(shopId);
    const sh = S.shops[shopId];
    const it = sh.items.find(i => i.key === key);
    if (!it) return;
    if (key in sh.ticks) {
      if (it.id) S.stock[it.id] = Math.max(0, (S.stock[it.id] || 0) - sh.ticks[key]);
      delete sh.ticks[key];
    } else {
      const add = it.id && ING(it.id) ? it.packs * ING(it.id).pack : 0;
      if (it.id) { S.stock[it.id] = (S.stock[it.id] || 0) + add; delete S.restock[it.id]; }
      sh.ticks[key] = add;
    }
  }

  /* =====================================================================
     UI HELPERS
     ===================================================================== */
  const view = document.getElementById("view");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  let toastTimer;
  function toast(msg, undo) {
    const t = document.getElementById("toast");
    t.innerHTML = esc(msg) + (undo ? ` <button class="link" id="toastUndo" style="margin-left:10px">Undo</button>` : "");
    t.hidden = false;
    if (undo) document.getElementById("toastUndo").onclick = () => { undo(); t.hidden = true; save(); render(); };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), undo ? 6000 : 3200);
  }
  const thumb = (r, cls = "") => imgSrc(r) ? `<img class="${cls}" src="${esc(imgSrc(r))}" alt="" loading="lazy">` : `<div class="${cls} emoji">${r.emoji || "🍽️"}</div>`;
  function openModal(html) { modalBody.innerHTML = html; modal.hidden = false; modal.querySelector(".modal-card").scrollTop = 0; }
  function closeModal() { modal.hidden = true; modalBody.innerHTML = ""; modalCtx = null; }
  let modalCtx = null;

  function header(lists) {
    const m = moneySummary(lists);
    const pill = document.getElementById("budgetPill");
    pill.innerHTML = `<b>${k(m.projected)}</b> / ${k(S.budget)} RWF`;
    pill.classList.toggle("over", m.projected > S.budget);
    const cooked = Object.keys(S.cooked).length;
    document.getElementById("subline").textContent = `Day ${S.today} of 30 · ${cooked} done`;
  }

  /* =====================================================================
     PLAN VIEW
     ===================================================================== */
  function prepNotes(d) {
    const n = [];
    const shop = SHOPS.find(s => s.day === d);
    if (shop && shopStatus(shop.id) !== "done") n.push(`🛒 Shopping day: ${shop.name.toLowerCase()} (see the Shop tab).`);
    if (d === 1) n.push("Unpack: split all meat into 250–500 g freezer bags, label and freeze. Keep tonight's chicken in the fridge.", "Freeze half the bread loaf.");
    const { U } = usageMap(true);
    const sum = (id, a, b) => { let t = 0; for (let x = a; x <= b; x++) t += (U[id] && U[id][x]) || 0; return t; };
    if (d === 1 && sum("beans", 2, 14) > 0) n.push(`Tonight: soak ${Math.round(sum("beans", 2, 14))} g dried beans in lots of water (for days 2–14).`);
    if (d === 2 && sum("beans", 2, 14) > 0) n.push("Boil the soaked beans 1–1.5 h until soft (salt only at the end). Cool, bag in meal-size portions and freeze.");
    if (d === 14 && sum("beans", 15, 30) > 0) n.push(`Tonight: soak ${Math.round(sum("beans", 15, 30))} g dried beans (for days 15–30).`);
    if (d === 15 && sum("beans", 15, 30) > 0) n.push("Boil the soaked beans 1–1.5 h, cool, bag in portions and freeze.");
    if (d < 30 && sum("dpeas", d + 1, d + 1) > 0) n.push(`Tonight: soak ${Math.round(sum("dpeas", d + 1, d + 1))} g dried peas for tomorrow's soup.`);
    const day = getDay(d);
    if (day.snacks[0].r && R(day.snacks[0].r).yield > 1) n.push(`Bake the ${R(day.snacks[0].r).name.replace(/\s*\(batch\)/, "").toLowerCase()}: snacks for the week.`);
    if (d < 30) {
      const nx = R(dinnerId(d + 1));
      for (const [id, q] of nx.ing) if (FREEZER_IDS.includes(id)) n.push(`Tonight: move ${Math.round(q * 2)} g ${ING(id).name.toLowerCase()} from the freezer to the fridge for tomorrow.`);
    }
    if (d === 30) n.push("Tonight's dinner makes 2: freeze the extra portion for next month.");
    return n;
  }

  function renderPlan(lists) {
    const d = S.day;
    const toggle = `<div class="row between" style="margin-bottom:10px">
      <div class="seg" style="flex:0 1 auto"><button class="${S.planView === "day" ? "active" : ""}" data-act="pv" data-v="day">Day</button><button class="${S.planView === "month" ? "active" : ""}" data-act="pv" data-v="month">Month</button></div>
      ${S.day !== S.today ? `<button class="link" data-act="gotoDay" data-d="${S.today}">Back to today (day ${S.today})</button>` : ""}</div>`;
    if (S.planView === "month") {
      let html = toggle + `<div class="month">`;
      for (let x = 1; x <= 30; x++) {
        const day = getDay(x);
        const done = entries(x).filter(e => S.cooked[e.key]).length;
        html += `<button class="mcell ${x === S.today ? "today" : ""}" data-act="gotoDay" data-d="${x}">
          <div class="row between"><b>Day ${x}</b><span class="tiny">${SHOPS.some(s => s.day === x) ? "🛒 " : ""}${done ? done + "/5 ✓" : ""}</span></div>
          <div>☀ ${esc(R(day.breakfast).name)}</div><div>◐ ${esc(day.lunch.r ? R(day.lunch.r).name : "Leftovers")}</div><div>☾ ${esc(R(day.dinner).name)}</div></button>`;
      }
      view.innerHTML = html + `</div>`;
      return;
    }
    let strip = `<div class="daystrip">`;
    for (let x = 1; x <= 30; x++) {
      const cls = ["daychip", SHOPS.some(s => s.day === x) ? "shopday" : "", x === S.today ? "today" : "", x === d ? "active" : ""].join(" ");
      strip += `<button class="${cls}" data-act="gotoDay" data-d="${x}">${x === S.today ? "Today" : "Day"}<b>${x}</b><span class="dot"></span></button>`;
    }
    strip += `</div>`;
    const day = getDay(d);
    const notes = prepNotes(d);
    let html = toggle + strip + `
      <div class="day-head">
        <div><div class="h2">Day ${d}</div><div class="small muted">${day.weekend ? "Weekend: longer recipes" : "Weekday"}</div></div>
        <div class="row">
          ${d !== S.today ? `<button class="btn sm" data-act="setToday">I'm on this day</button>` : ""}
          <button class="btn sm" data-act="shuffleDay" title="Pick new breakfast, dinner and snack for this day">⟳ Shuffle day</button>
          ${S.plan[d] ? `<button class="btn sm ghost" data-act="resetDay">Reset</button>` : ""}
        </div>
      </div>`;
    if (notes.length) html += `<div class="card todo"><b>To do today</b><ul>${notes.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
    html += `<div class="meals">${entries(d).map(mealCard).join("")}</div>
      <p class="small muted" style="margin-top:12px">Tick <b>Cooked</b> and the ingredients come off your pantry stock. Swap any meal; changing a dinner also changes the next day's lunch (its leftovers).</p>`;
    view.innerHTML = html;
    const a = view.querySelector(".daychip.active");
    if (a) a.scrollIntoView({ inline: "center", block: "nearest" });
  }

  function mealCard(e) {
    const id = e.r || e.lo || e.from;
    const r = id && R(id);
    if (!r) return "";
    let meta = `${r.time ? r.time + " min · " : ""}${r.level}`;
    let label = e.label;
    if (e.lo) { label = "Lunch · leftovers"; meta = "From last night: just reheat"; }
    if (e.from) meta = "From this week's batch";
    if (e.note) meta = `${e.note} · ${meta}`;
    if (e.slot === "dinner") meta += " · cook for 2";
    const done = !!S.cooked[e.key];
    let stockTag = "";
    if (e.r && hasStock() && !done) {
      const sc = stockScore(r);
      stockTag = sc.missing.length ? `<span class="chip">Missing ${sc.missing.length}</span>` : `<span class="chip local">All in stock</span>`;
    }
    const serv = e.lo || e.from ? 1 : e.s;
    const slotKey = e.slot === "snack" ? "snack" + e.idx : e.slot;
    const canSwap = !(e.slot === "snack" && (e.from || (r.yield > 1)));
    return `<div class="meal ${done ? "done" : ""}">
      <button class="thumb" data-act="openRecipe" data-id="${r.id}" data-s="${serv}" aria-label="Open ${esc(r.name)}">${thumb(r)}</button>
      <div class="info">
        <span class="slot">${label}</span>
        <button class="title" data-act="openRecipe" data-id="${r.id}" data-s="${serv}">${esc(r.name)}</button>
        <span class="meta">${meta} ${stockTag}</span>
        <div class="actions">
          <button class="cooked-toggle ${done ? "on" : ""}" data-act="cook" data-key="${e.key}"><span class="box">${done ? "✓" : ""}</span>${e.lo || e.from ? "Eaten" : "Cooked"}</button>
          ${canSwap ? `<button class="btn sm" data-act="swap" data-d="${e.d}" data-slot="${slotKey}">Swap</button>` : ""}
        </div>
      </div></div>`;
  }

  function openSwap(d, slot) {
    const type = slot.startsWith("snack") ? "snack" : slot;
    const cur = entries(d).find(e => (e.slot === "snack" ? "snack" + e.idx : e.slot) === slot);
    const curId = cur && (cur.r || cur.lo);
    const near = new Set();
    for (let x = Math.max(1, d - 3); x <= Math.min(30, d + 3); x++) if (x !== d) { const dd = getDay(x); near.add(dd.breakfast); near.add(dd.dinner); }
    let cands = recipeList().filter(r => r.type === type && !(r.yield > 1));
    cands = cands.map(r => ({ r, sc: stockScore(r), near: near.has(r.id) }))
      .sort((a, b) => (b.sc.pct - a.sc.pct) || (a.near - b.near) || a.r.name.localeCompare(b.r.name));
    const showStock = hasStock();
    const item = ({ r, sc, near: nr }) => `<button class="pick ${r.id === curId ? "current" : ""}" data-act="pickSwap" data-d="${d}" data-slot="${slot}" data-id="${r.id}">
        ${thumb(r)}<div class="grow"><div style="font-weight:600">${esc(r.name)}</div>
        <div class="tiny muted">${r.time ? r.time + " min · " : ""}${r.level}${nr ? " · also on a nearby day" : ""}</div>
        ${showStock ? (sc.missing.length ? `<div class="tiny muted">Need: ${esc(sc.missing.slice(0, 3).join(", "))}${sc.missing.length > 3 ? "…" : ""}</div>` : `<span class="chip local">All in stock</span>`) : ""}</div></button>`;
    let html = `<div class="mbody"><div class="h2">Swap day ${d} ${type}</div>
      <p class="small muted" style="margin:0">${showStock ? "Meals you can cook with what's in your pantry are listed first." : "Pick any meal. Once you've shopped, meals you have the ingredients for are listed first."}${type === "dinner" ? " Tomorrow's lunch becomes this dinner's leftovers." : ""}</p>
      <div class="pick-list">`;
    if (type === "lunch" && d > 1) html += `<button class="pick ${cur && cur.lo ? "current" : ""}" data-act="pickSwap" data-d="${d}" data-slot="lunch" data-id="lo"><div class="emoji">♻️</div><div class="grow"><div style="font-weight:600">Leftovers from last night</div><div class="tiny muted">${esc(R(dinnerId(d - 1)).name)}</div></div></button>`;
    html += cands.map(item).join("") + `</div></div>`;
    openModal(html);
  }

  function shuffleDay(d) {
    const near = new Set();
    for (let x = Math.max(1, d - 3); x <= Math.min(30, d + 3); x++) if (x !== d) { const dd = getDay(x); near.add(dd.breakfast); near.add(dd.dinner); }
    const cur = getDay(d);
    const pick = (type, curId) => {
      const c = recipeList().filter(r => r.type === type && !(r.yield > 1) && r.id !== curId && !near.has(r.id));
      if (!c.length) return curId;
      const scored = c.map(r => ({ id: r.id, s: stockScore(r).pct * 2 + Math.random() })).sort((a, b) => b.s - a.s);
      return scored[0].id;
    };
    const before = JSON.parse(JSON.stringify(S.plan[d] || null));
    setSlot(d, "breakfast", pick("breakfast", cur.breakfast));
    setSlot(d, "dinner", pick("dinner", cur.dinner));
    if (cur.snacks[1].r) setSlot(d, "snack1", pick("snack", cur.snacks[1].r));
    return () => { if (before) S.plan[d] = before; else delete S.plan[d]; };
  }

  /* =====================================================================
     RECIPE VIEW & EDITOR
     ===================================================================== */
  function openRecipe(id, serv) {
    const r = R(id);
    if (!r) return;
    const y = r.yield || 1;
    modalCtx = { kind: "recipe", id, serv: serv || (r.type === "dinner" ? 2 : y), openIdx: null, mode: null };
    drawRecipe();
  }
  function drawRecipe() {
    const c = modalCtx, r = R(c.id), y = r.yield || 1;
    const days = [];
    for (let d = 1; d <= 30; d++) if (entries(d).some(e => e.r === r.id)) days.push(d);
    const src = imgSrc(r);
    const ingOpts = allIngs().slice().sort((a, b) => a.name.localeCompare(b.name));
    openModal(`
      ${src ? `<img class="hero" src="${esc(src)}" alt="${esc(r.name)}">` : `<div class="hero emoji">${r.emoji || "🍽️"}</div>`}
      <div class="mbody">
        <div class="h2">${esc(r.name)}</div>
        <div class="row">${r.cuisine ? `<span class="chip">${esc(r.cuisine)}</span>` : ""}<span class="chip mango">${esc(r.level)}</span>${r.time ? `<span class="chip">${r.time} min</span>` : ""}${r.edited ? `<span class="chip mango">Edited by you</span>` : ""}${r.custom ? `<span class="chip mango">Your recipe</span>` : ""}</div>
        ${r.photoNote && !r.photo ? `<div class="photo-note">${esc(r.photoNote)}</div>` : ""}
        <div class="small muted">${days.length ? "On your plan: day " + days.join(", ") : "Not on your plan right now. Use Swap on any day to add it."}</div>
        <div class="row">
          <button class="btn sm" data-act="editRecipe" data-id="${r.id}">✎ Edit recipe</button>
          <button class="btn sm" data-act="hideRecipe" data-id="${r.id}">I don't like this</button>
          ${r.edited ? `<button class="btn sm ghost" data-act="restoreRecipe" data-id="${r.id}">Restore original</button>` : ""}
        </div>
        <div class="row between"><h3 class="section-title" style="margin:6px 2px 0">Ingredients</h3>
          <div class="stepper"><button data-act="serv" data-v="-1" aria-label="Fewer servings">−</button><b>${c.serv} ${y > 1 ? "servings (batch)" : plural(c.serv, "serving")}</b><button data-act="serv" data-v="1" aria-label="More servings">+</button></div></div>
        <ul class="ing-list">
          ${r.ing.map(([iid, q, note], i) => {
            const it = ING(iid);
            const open = c.openIdx === i;
            return `<li><span class="q">${fmtQty(iid, (q * c.serv) / y)}</span>
              <div><div>${esc(it.name)} ${originChip(it.origin || "local")}${note ? ` <span class="small muted">· ${esc(note)}</span>` : ""}</div>
                <div class="acts"><button class="link" data-act="ingPanel" data-i="${i}" data-m="subs">Can't find it?</button><button class="link" data-act="ingPanel" data-i="${i}" data-m="dislike">Don't like it</button></div>
                ${open && c.mode === "subs" ? `<div class="panel"><b>Use instead:</b><ul>${(it.subs || []).map(s => `<li>${esc(s)}</li>`).join("") || "<li>No suggestions saved.</li>"}</ul></div>` : ""}
                ${open && c.mode === "dislike" ? `<div class="panel stack">
                    <button class="btn sm" data-act="ingRemoveHere" data-ing="${iid}">Remove from this recipe only</button>
                    <button class="btn sm" data-act="ingRule" data-ing="${iid}" data-mode="remove">Remove from ALL recipes</button>
                    <label class="field">Or replace it in ALL recipes with:<select id="replTo">${ingOpts.filter(o => o.id !== iid).map(o => `<option value="${o.id}">${esc(o.name)}</option>`).join("")}</select></label>
                    <button class="btn sm primary" data-act="ingRule" data-ing="${iid}" data-mode="replace">Replace everywhere</button></div>` : ""}
              </div></li>`;
          }).join("")}
        </ul>
        <h3 class="section-title" style="margin:6px 2px 0">Method</h3>
        <ol class="steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
        ${r.tip ? `<div class="tip">${esc(r.tip)}</div>` : ""}
      </div>`);
  }

  function openEditor(id, isNew) {
    const base = isNew ? { id: "c_" + Date.now().toString(36), name: "", type: "dinner", cuisine: "", time: 30, level: "Easy", ing: [["onion", 50], ["oil", 10], ["salt", 1]], steps: [], tip: "" } : rawRecipe(id);
    modalCtx = { kind: "editor", draft: JSON.parse(JSON.stringify(base)), isNew, newIng: false };
    drawEditor();
  }
  function drawEditor() {
    const dr = modalCtx.draft, y = dr.yield || 1;
    const opts = allIngs().slice().sort((a, b) => a.name.localeCompare(b.name));
    const src = imgSrc(dr);
    openModal(`<div class="mbody">
      <div class="h2">${modalCtx.isNew ? "New recipe" : "Edit recipe"}</div>
      <label class="field">Name<input type="text" id="ed_name" value="${esc(dr.name)}" placeholder="e.g. Chicken & avocado salad"></label>
      <div class="row" style="align-items:flex-end">
        <label class="field grow">Meal<select id="ed_type">${["breakfast", "lunch", "dinner", "snack"].map(t => `<option ${dr.type === t ? "selected" : ""}>${t}</option>`).join("")}</select></label>
        <label class="field" style="width:90px">Minutes<input type="number" id="ed_time" value="${dr.time || ""}" min="0"></label>
        <label class="field grow">Difficulty<select id="ed_level">${["Easy", "Medium", "Hard"].map(t => `<option ${dr.level === t ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      </div>
      <div class="row">
        ${src ? `<img src="${esc(src)}" alt="" style="width:90px;height:68px;object-fit:cover;border-radius:10px">` : ""}
        <label class="btn sm">📷 ${src ? "Change photo" : "Add photo"}<input type="file" accept="image/*" id="ed_photo" hidden></label>
      </div>
      <h3 class="section-title" style="margin:4px 2px 0">Ingredients ${y > 1 ? "(whole batch)" : "(for 1 serving)"}</h3>
      <div id="ed_ings">${dr.ing.map(([iid, q], i) => {
        const it = ING(iid) || { unit: "g" };
        return `<div class="edit-ing"><select data-ei="${i}" class="ed_ing">${opts.map(o => `<option value="${o.id}" ${o.id === iid ? "selected" : ""}>${esc(o.name)}</option>`).join("")}</select>
          <input type="number" step="any" min="0" class="ed_q" data-ei="${i}" value="${+q}"><button class="btn sm ghost" data-act="edDelIng" data-i="${i}" aria-label="Remove">✕</button>
          <span class="unit">${it.unit === "pc" ? "pieces" : it.unit}</span></div>`;
      }).join("")}</div>
      <div class="row"><button class="btn sm" data-act="edAddIng">+ Add ingredient</button><button class="btn sm ghost" data-act="edNewIng">+ Ingredient not in the list</button></div>
      ${modalCtx.newIng ? `<div class="panel stack">
          <b>New ingredient</b>
          <label class="field">Name<input type="text" id="ni_name" placeholder="e.g. Oyster mushrooms"></label>
          <div class="row" style="align-items:flex-end">
            <label class="field grow">Measured in<select id="ni_unit"><option value="g">grams</option><option value="ml">millilitres</option><option value="pc">pieces</option></select></label>
            <label class="field grow">Pack size<input type="number" id="ni_pack" value="500"></label>
            <label class="field grow">Pack price (RWF)<input type="number" id="ni_price" value="1000"></label>
          </div>
          <div class="row" style="align-items:flex-end">
            <label class="field grow">Aisle<select id="ni_sec">${SECTIONS.map((s, i) => `<option value="${i}">${s}</option>`).join("")}</select></label>
            <label class="field grow">Keeps for<select id="ni_buy"><option value="week">About a week (fresh)</option><option value="fortnight">2 weeks</option><option value="month">A month or more</option></select></label>
          </div>
          <button class="btn sm primary" data-act="niSave">Add ingredient</button></div>` : ""}
      <label class="field">Method (one step per line)<textarea id="ed_steps">${esc((dr.steps || []).join("\n"))}</textarea></label>
      <label class="field">Tip (optional)<input type="text" id="ed_tip" value="${esc(dr.tip || "")}"></label>
      <div class="row between"><button class="btn ghost" data-act="${modalCtx.isNew ? "closeModal" : "edCancel"}">Cancel</button>
        <div class="row">${modalCtx.draft.id && S.customRecipes[modalCtx.draft.id] && !BASE_REC[modalCtx.draft.id] ? `<button class="btn danger" data-act="edDelete">Delete</button>` : ""}<button class="btn primary" data-act="edSave">Save recipe</button></div></div>
    </div>`);
    const ph = document.getElementById("ed_photo");
    ph.onchange = () => { syncEditor(); const f = ph.files[0]; if (f) shrinkImage(f, 640, 0.72).then(url => { modalCtx.draft.photo = url; drawEditor(); }); };
  }
  function syncEditor() {
    const dr = modalCtx.draft;
    const v = id => document.getElementById(id);
    if (!v("ed_name")) return;
    dr.name = v("ed_name").value.trim();
    dr.type = v("ed_type").value; dr.time = +v("ed_time").value || 0; dr.level = v("ed_level").value;
    dr.steps = v("ed_steps").value.split("\n").map(s => s.trim()).filter(Boolean);
    dr.tip = v("ed_tip").value.trim();
    document.querySelectorAll(".ed_ing").forEach(sel => { dr.ing[+sel.dataset.ei][0] = sel.value; });
    document.querySelectorAll(".ed_q").forEach(inp => { dr.ing[+inp.dataset.ei][1] = +inp.value || 0; });
  }
  function shrinkImage(file, max, q) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const sc = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", q));
        URL.revokeObjectURL(img.src);
      };
      img.onerror = rej;
      img.src = URL.createObjectURL(file);
    });
  }

  /* =====================================================================
     RECIPES TAB
     ===================================================================== */
  function renderRecipes() {
    const types = [["all", "All"], ["breakfast", "Breakfast"], ["dinner", "Dinner"], ["lunch", "Lunch"], ["snack", "Snacks"]];
    const q = S.q.toLowerCase();
    const list = recipeList().filter(r => (S.rtype === "all" || r.type === S.rtype) &&
      (!q || r.name.toLowerCase().includes(q) || (r.cuisine || "").toLowerCase().includes(q) || r.ing.some(([id]) => ING(id).name.toLowerCase().includes(q))));
    const hiddenN = Object.keys(S.hidden).filter(id => S.hidden[id]).length;
    view.innerHTML = `
      <div class="row" style="margin-bottom:10px"><input id="rsearch" type="search" class="grow" placeholder="Search recipes or ingredients" value="${esc(S.q)}" style="flex:1 1 200px">
        <button class="btn primary" data-act="newRecipe">+ New recipe</button></div>
      <div class="seg" style="margin-bottom:12px">${types.map(([t, l]) => `<button class="${S.rtype === t ? "active" : ""}" data-act="rtype" data-v="${t}">${l}</button>`).join("")}</div>
      <p class="small muted">${list.length} recipes. Open one to edit it, swap an ingredient you don't like, or remove it from your plan.</p>
      <div class="rgrid">${list.map(r => `<button class="rcard" data-act="openRecipe" data-id="${r.id}">${thumb(r)}
        <div class="body"><h4>${esc(r.name)}</h4><span class="tiny muted">${r.time ? r.time + " min · " : ""}${r.level}${r.edited || r.custom ? " · ✎ yours" : ""}</span></div></button>`).join("")}</div>
      ${hiddenN ? `<div class="card" style="margin-top:14px"><b>Recipes you removed (${hiddenN})</b><div class="stack" style="margin-top:8px">${Object.keys(S.hidden).filter(id => S.hidden[id] && rawRecipe(id)).map(id => `<div class="row between"><span>${esc(rawRecipe(id).name)}</span><button class="btn sm" data-act="unhide" data-id="${id}">Bring back</button></div>`).join("")}</div></div>` : ""}`;
    const inp = document.getElementById("rsearch");
    inp.oninput = () => { S.q = inp.value; save(); const pos = inp.selectionStart; renderRecipes(); const n = document.getElementById("rsearch"); n.focus(); n.setSelectionRange(pos, pos); };
  }

  /* =====================================================================
     SHOP TAB
     ===================================================================== */
  let openItem = null;
  function renderShop(lists) {
    if (!S.shopSel || !SHOPS.find(s => s.id === S.shopSel)) S.shopSel = (SHOPS.find(s => shopStatus(s.id) !== "done") || SHOPS[0]).id;
    const s = SHOPS.find(x => x.id === S.shopSel);
    const L = lists[s.id], sh = S.shops[s.id] || { ticks: {}, replaced: {} };
    const items = L.items;
    const total = items.reduce((a, it) => a + itemCost(it), 0);
    const ticked = items.filter(it => it.key in (sh.ticks || {}));
    const status = L.status;
    const statusLabel = { planned: "Not started", shopping: "Shopping now", done: "Done" }[status];

    let html = `<div class="seg" style="margin-bottom:12px">${SHOPS.map(x => {
      const t = lists[x.id].items.reduce((a, it) => a + itemCost(it), 0);
      const st = lists[x.id].status;
      return `<button class="${x.id === s.id ? "active" : ""}" data-act="shopSel" data-v="${x.id}">${st === "done" ? "✓ " : ""}Day ${x.day}<small>${x.name} · ${k(t)}</small></button>`;
    }).join("")}</div>
    <div class="card">
      <div class="shop-summary">
        <div><div class="small muted">${esc(s.name)} · day ${s.day} · ${statusLabel}</div><div class="total">${rwf(total)}</div></div>
        <div class="small muted" style="text-align:right">${ticked.length} of ${items.length}<br>in the trolley</div>
        <div class="progress"><div style="width:${items.length ? (ticked.length / items.length) * 100 : 0}%"></div></div>
      </div>
      <p class="small muted" style="margin:10px 0 0">${esc(s.desc)} Quantities already take your pantry into account.</p>
      <div class="row" style="margin-top:10px">
        ${status === "planned" ? `<button class="btn primary" data-act="startShop">Start shopping</button>` : ""}
        ${status === "shopping" ? `<button class="btn primary" data-act="finishShop">Finish shop</button>` : ""}
        ${status === "done" ? `<button class="btn" data-act="reopenShop">Reopen</button><button class="btn primary" data-act="tab" data-v="money">Scan the receipt</button>` : ""}
        <label class="row small muted" style="gap:6px"><input type="checkbox" data-act="hideTicked" ${S.hideTicked ? "checked" : ""}> Hide ticked</label>
      </div>
    </div>`;

    if (!items.length) html += `<div class="card empty">${status === "planned" && s.day > S.today ? "Nothing needed yet. This list fills in as the shop gets closer and your pantry runs down." : "Nothing on this list."}</div>`;

    const bySec = {};
    for (const it of items) {
      if (S.hideTicked && it.key in (sh.ticks || {})) continue;
      const sec = it.id && ING(it.id) ? ING(it.id).sec : 99;
      (bySec[sec] = bySec[sec] || []).push(it);
    }
    for (const sec of Object.keys(bySec).map(Number).sort((a, b) => a - b)) {
      const arr = bySec[sec];
      html += `<div class="sec-head"><h3>${sec === 99 ? "Other" : SECTIONS[sec]}</h3><span class="small muted num">${rwf(arr.reduce((a, it) => a + itemCost(it), 0))}</span></div><div class="list">`;
      for (const it of arr) html += shopLine(s.id, it, sh, status);
      html += `</div>`;
    }
    if (status !== "done") html += `<div class="card" style="margin-top:14px"><b>Add something else</b>
      <div class="row" style="margin-top:8px"><select id="addIng" class="grow"><option value="">Choose an ingredient…</option>${allIngs().slice().sort((a, b) => a.name.localeCompare(b.name)).map(o => `<option value="${o.id}">${esc(o.name)}</option>`).join("")}</select>
      <input type="number" id="addPacks" value="1" min="1" style="width:70px" aria-label="Packs"><button class="btn" data-act="addItem">Add</button></div>
      <div class="row" style="margin-top:8px"><input type="text" id="addFree" class="grow" placeholder="…or type anything (e.g. washing-up liquid)"><input type="number" id="addFreePrice" placeholder="RWF" style="width:90px"><button class="btn" data-act="addFree">Add</button></div></div>`;
    view.innerHTML = html;
  }
  function shopLine(shopId, it, sh, status) {
    const ingr = it.id && ING(it.id);
    const isT = it.key in (sh.ticks || {});
    const open = openItem === shopId + ":" + it.key;
    const rep = sh.replaced && sh.replaced[it.key];
    const name = ingr ? ingr.name : it.name;
    const qty = ingr ? `<b>${it.packs} × ${esc(ingr.packLabel)}</b>` : `<b>${it.packs || 1}</b>`;
    let detail = "";
    if (open) {
      detail = `<div class="sdetail">
        ${ingr ? `<div>${originChip(ingr.origin || "local")} ${esc(WHERE[ingr.where] || "")}</div>` : ""}
        ${it.restock ? `<div>You marked this as finished in the pantry.</div>` : ""}
        ${ingr && it.need != null && !ingr.fixed ? `<div>Needed: ${fmtAmt(it.id, it.need)}${it.have > 0 ? ` · you still have ${fmtAmt(it.id, it.have)}` : ""}</div>` : ""}
        ${it.recipes && it.recipes.length ? `<div>For: ${esc(it.recipes.slice(0, 6).join(", "))}${it.recipes.length > 6 ? "…" : ""}</div>` : ""}
        ${ingr && ingr.keep ? `<div>Storage: ${esc(ingr.keep)}</div>` : ""}
        ${ingr ? `<div class="price-edit">Price per pack <input type="number" id="pe_${it.id}" value="${price(it.id)}"><button class="btn sm" data-act="setPrice" data-id="${it.id}">Save</button></div>` : ""}
        ${status !== "done" ? `<div class="row"><span>Packs:</span><button class="btn sm" data-act="packs" data-key="${it.key}" data-v="-1">−</button><b>${it.packs}</b><button class="btn sm" data-act="packs" data-key="${it.key}" data-v="1">+</button><button class="btn sm ghost danger" data-act="removeItem" data-key="${it.key}">Remove</button></div>` : ""}
        ${ingr && ingr.subs && ingr.subs.length && status !== "done" ? `<div class="panel"><b>Can't find it? Buy instead:</b><ul>${ingr.subs.map((x, i) => `<li>${esc(x)} <button class="link" data-act="useSub" data-key="${it.key}" data-i="${i}">use this</button></li>`).join("")}</ul></div>` : ""}
      </div>`;
    }
    return `<div class="sitem ${isT ? "ticked" : ""}">
      <div class="sline">
        <input type="checkbox" data-act="tick" data-key="${it.key}" ${isT ? "checked" : ""} ${status === "done" ? "disabled" : ""} aria-label="${esc(name)}">
        <button class="what" data-act="openItem" data-key="${shopId}:${it.key}">
          <span class="nm">${esc(name)}${it.restock ? ' <span class="chip mango">restock</span>' : ""}</span>
          <span class="qty">${qty}${rep ? ` · <span class="replaced">↺ ${esc(rep)}</span>` : ""}</span></button>
        <span class="pr">${rwf(itemCost(it))}</span>
      </div>${detail}</div>`;
  }

  /* =====================================================================
     PANTRY TAB
     ===================================================================== */
  function renderPantry() {
    const { U } = usageMap(false);
    const needFrom = (id, a, b) => { let t = 0; for (let x = a; x <= b; x++) t += (U[id] && U[id][x]) || 0; return t; };
    const ings = allIngs();
    const inStock = ings.filter(it => (S.stock[it.id] || 0) > 1e-6);
    const low = ings.filter(it => !it.fixed && needFrom(it.id, S.today, Math.min(30, S.today + 6)) > (S.stock[it.id] || 0) + 1e-6 && (S.stock[it.id] || 0) > 0);
    const restock = ings.filter(it => S.restock[it.id]);
    const rules = Object.entries(S.ingRules);

    let html = `<div class="stats">
      <div class="stat"><b>${inStock.length}</b><span>items at home</span></div>
      <div class="stat"><b style="color:var(--warn)">${low.length}</b><span>running low this week</span></div>
      <div class="stat"><b style="color:var(--mango)">${restock.length}</b><span>marked finished</span></div></div>
      <p class="small muted">Stock goes up when you tick items while shopping or save a receipt, and down when you tick a meal as <b>Cooked</b>. Tap <b>Finished</b> when something runs out and it goes on your next shopping list.</p>`;

    if (!inStock.length && !restock.length) html += `<div class="card empty"><b>Your pantry is empty</b><br>Do the big shop first: tick items in the Shop tab as they go in your trolley, or scan the receipt afterwards. You can also add items you already have below.</div>`;

    if (low.length) html += `<div class="sec-head"><h3>Running low (next 7 days)</h3></div><div class="list">${low.map(it => pantryLine(it, needFrom(it.id, S.today, 30), needFrom(it.id, S.today, Math.min(30, S.today + 6)))).join("")}</div>`;
    if (restock.length) html += `<div class="sec-head"><h3>Finished: on your next shopping list</h3></div><div class="list">${restock.map(it => `<div class="pitem"><div>${esc(it.name)}</div><button class="btn sm" data-act="unrestock" data-id="${it.id}">Undo</button></div>`).join("")}</div>`;

    const bySec = {};
    for (const it of inStock) if (!low.includes(it)) (bySec[it.sec] = bySec[it.sec] || []).push(it);
    for (const sec of Object.keys(bySec).map(Number).sort((a, b) => a - b)) {
      html += `<div class="sec-head"><h3>${SECTIONS[sec]}</h3></div><div class="list">${bySec[sec].map(it => pantryLine(it, needFrom(it.id, S.today, 30))).join("")}</div>`;
    }

    html += `<div class="card" style="margin-top:16px"><b>Add something you already have</b>
      <div class="row" style="margin-top:8px"><select id="pAddIng" class="grow">${ings.slice().sort((a, b) => a.name.localeCompare(b.name)).map(o => `<option value="${o.id}">${esc(o.name)} (${o.unit === "pc" ? "pieces" : o.unit})</option>`).join("")}</select>
      <input type="number" id="pAddQty" placeholder="Amount" style="width:100px"><button class="btn" data-act="pAdd">Add</button></div></div>`;

    html += `<div class="card"><b>Foods you don't eat</b>
      <p class="small muted" style="margin:4px 0 8px">These changes apply to every recipe. Add one from any recipe: open it and tap <b>Don't like it</b> next to an ingredient.</p>
      ${rules.length ? rules.map(([id, r]) => `<div class="row between" style="padding:6px 0;border-top:1px solid var(--line)"><span>${esc(ING(id) ? ING(id).name : id)} → ${r.mode === "remove" ? "removed" : "replaced with " + esc(ING(r.to) ? ING(r.to).name : r.to)}</span><button class="btn sm" data-act="delRule" data-id="${id}">Undo</button></div>`).join("") : `<div class="small faint">None yet.</div>`}
      <div class="row" style="margin-top:8px"><select id="ruleIng" class="grow">${ings.slice().sort((a, b) => a.name.localeCompare(b.name)).map(o => `<option value="${o.id}">${esc(o.name)}</option>`).join("")}</select><button class="btn sm" data-act="ruleQuick">Remove everywhere</button></div></div>`;
    view.innerHTML = html;
  }
  function pantryLine(it, needMonth, needWeek) {
    const have = S.stock[it.id] || 0;
    const pct = needMonth > 0 ? Math.min(1, have / needMonth) : 1;
    const color = needWeek != null ? "var(--warn)" : pct >= 1 ? "var(--good)" : "var(--mango)";
    const shown = it.unit === "g" || it.unit === "ml" ? Math.round(have) : Math.round(have * 10) / 10;
    return `<div class="pitem">
      <div class="grow"><div style="font-weight:600">${esc(it.name)}</div>
        <div class="tiny muted">${needMonth > 0 ? `Plan needs ${fmtAmt(it.id, needMonth)} more this month${needWeek != null ? ` · ${fmtAmt(it.id, needWeek)} this week` : ""}` : "Not needed again this month"}</div></div>
      <div class="ctrl"><input type="number" step="any" value="${shown}" data-act="setStock" data-id="${it.id}" aria-label="Amount of ${esc(it.name)}"><span class="tiny muted">${it.unit === "pc" ? "pcs" : it.unit}</span>
        <button class="btn sm" data-act="finished" data-id="${it.id}">Finished</button></div>
      <div class="bar"><div style="width:${pct * 100}%;background:${color}"></div></div></div>`;
  }

  /* =====================================================================
     SPENDING TAB + RECEIPT SCANNER
     ===================================================================== */
  function renderMoney(lists) {
    const m = moneySummary(lists);
    const spentPct = Math.min(100, (m.spent / S.budget) * 100);
    const planPct = Math.max(0, Math.min(100 - spentPct, (m.planned / S.budget) * 100));
    const left = S.budget - m.projected;
    let html = `<div class="card">
      <div class="small muted">This month</div>
      <div class="row between" style="align-items:baseline"><div class="big-num">${rwf(m.spent)}</div><div class="small muted">of ${rwf(S.budget)} budget · <button class="link" data-act="editBudget">edit</button></div></div>
      <div class="meter"><div class="spent" style="width:${spentPct}%"></div><div class="planned" style="width:${planPct}%"></div></div>
      <div class="legend"><span><i style="background:var(--mango)"></i>Spent (from receipts)</span><span><i style="background:rgba(246,168,35,.35)"></i>Still to buy ≈ ${rwf(m.planned)}</span></div>
      <p class="small" style="margin:10px 0 0;color:${left < 0 ? "var(--bad)" : "var(--good)"}">${left < 0 ? `Heading ${rwf(-left)} over budget.` : `About ${rwf(left)} left at the end of the month.`}</p>
      ${!S.receipts.length ? `<p class="small muted" style="margin:6px 0 0">Before your first receipt, the month estimate is ${rwf(m.estimateAll)}.</p>` : ""}
    </div>
    <div class="row" style="margin-bottom:6px">
      <label class="btn primary">📷 Scan a receipt<input type="file" accept="image/*" capture="environment" id="rxFile" hidden></label>
      <button class="btn" data-act="rxManual">Type a receipt</button>
    </div>
    <p class="small muted">The app reads the photo on your phone, matches each line to an ingredient, and lets you fix it before saving. Saving updates your prices and pantry.</p>`;

    html += `<div class="sec-head"><h3>Receipts</h3><span class="small muted">${S.receipts.length}</span></div>`;
    if (!S.receipts.length) html += `<div class="card empty">No receipts yet. After your big shop, scan the receipt to track what you really spent.</div>`;
    else html += `<div class="list">${S.receipts.slice().reverse().map(r => `<div class="sitem"><div class="sline">
        <button class="what" data-act="openItem" data-key="rx:${r.id}"><span class="nm">${esc(r.store)} · ${esc(r.date)}</span><span class="qty">${r.lines.length} items</span></button>
        <span class="pr">${rwf(r.total)}</span></div>
        ${openItem === "rx:" + r.id ? `<div class="sdetail">${r.lines.map(l => `<div class="row between"><span>${esc(l.name)}${l.ing && ING(l.ing) ? ` → ${esc(ING(l.ing).name)}` : ""}</span><span class="num">${rwf(l.price)}</span></div>`).join("")}<button class="btn sm danger" data-act="delReceipt" data-id="${r.id}">Delete receipt</button></div>` : ""}</div>`).join("")}</div>`;

    const changed = Object.keys(S.prices).filter(id => ING(id));
    html += `<div class="sec-head"><h3>Your prices</h3><button class="link" data-act="openItem" data-key="prices">${openItem === "prices" ? "Hide" : "Show all"}</button></div>
      <div class="card small muted">${changed.length ? `${changed.length} prices updated from your receipts or edits.` : "All prices are still the app's estimates."} Local items are usually cheapest; imported ones are marked in red.</div>`;
    if (openItem === "prices") html += `<div class="list">${allIngs().slice().sort((a, b) => a.sec - b.sec || a.name.localeCompare(b.name)).map(it => `<div class="pitem"><div class="grow"><div style="font-weight:600">${esc(it.name)} ${originChip(it.origin || "local")}</div><div class="tiny muted">${esc(it.packLabel)}${S.prices[it.id] != null ? ` · estimate was ${rwf(it.price)}` : ""}</div></div>
        <div class="ctrl"><input type="number" value="${price(it.id)}" data-act="setPriceInline" data-id="${it.id}" aria-label="Price of ${esc(it.name)}"><span class="tiny muted">RWF</span></div></div>`).join("")}</div>`;
    view.innerHTML = html;
    const f = document.getElementById("rxFile");
    f.onchange = () => { if (f.files[0]) startScan(f.files[0]); f.value = ""; };
  }

  let rx = null;
  function loadTesseract() {
    if (window.Tesseract) return Promise.resolve();
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
      s.onload = res;
      s.onerror = () => rej(new Error("Couldn't load the receipt reader. Check your internet connection and try again."));
      document.head.appendChild(s);
    });
  }
  function prepCanvas(file) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const sc = Math.min(2, 1800 / img.width);
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
        const g = c.getContext("2d");
        g.drawImage(img, 0, 0, c.width, c.height);
        const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
        let min = 255, max = 0;
        for (let i = 0; i < p.length; i += 4) { const v = 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2]; p[i] = v; if (v < min) min = v; if (v > max) max = v; }
        const span = Math.max(1, max - min);
        for (let i = 0; i < p.length; i += 4) { let v = ((p[i] - min) / span) * 255; v = v < 140 ? v * 0.6 : Math.min(255, v * 1.15); p[i] = p[i + 1] = p[i + 2] = v; }
        g.putImageData(d, 0, 0);
        res({ canvas: c, preview: c.toDataURL("image/jpeg", 0.5) });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => rej(new Error("That file isn't a photo the app can read."));
      img.src = URL.createObjectURL(file);
    });
  }
  async function startScan(file) {
    rx = { status: "reading", progress: 0, msg: "Preparing photo…", lines: [], total: 0, store: "Simba", date: new Date().toISOString().slice(0, 10), addStock: true, updatePrices: true };
    drawRx();
    try {
      const { canvas, preview } = await prepCanvas(file);
      rx.preview = preview; rx.msg = "Loading the text reader (first time takes a moment)…"; drawRx();
      await loadTesseract();
      const res = await window.Tesseract.recognize(canvas, "eng", {
        logger: m => { if (m.status === "recognizing text") { rx.progress = m.progress; rx.msg = "Reading the receipt…"; const b = document.getElementById("ocrBar"); if (b) b.style.width = Math.round(m.progress * 100) + "%"; } },
      });
      const parsed = parseReceipt(res.data.text);
      rx.lines = parsed.lines; rx.total = parsed.total || parsed.lines.reduce((a, l) => a + l.price, 0);
      if (/spar/i.test(res.data.text)) rx.store = "Spar"; else if (/simba/i.test(res.data.text)) rx.store = "Simba";
      rx.status = "review";
      if (!rx.lines.length) rx.msg = "I couldn't find item lines in that photo. Add them below, or try again with a flatter, brighter photo.";
      else rx.msg = `Found ${rx.lines.length} lines. Check names, prices and matches, then save.`;
    } catch (err) {
      rx.status = "review"; rx.msg = err.message || "Reading failed. You can type the receipt in below.";
    }
    drawRx();
  }
  function parseReceipt(text) {
    const lines = text.split(/\n/).map(l => l.replace(/\s+/g, " ").trim()).filter(Boolean);
    const skip = /(VAT|TAX|CASH|CHANGE|TIN\b|SDC|MRC|BALANCE|TENDER|CARD|MOMO|MOBILE|RECEIPT|INVOICE|TEL|PHONE|DATE|TIME|CASHIER|THANK|WELCOME|ITEMS?\s*(COUNT|SOLD)?:?$|QTY|DISCOUNT|ROUNDING|PAID|KIGALI|RWANDA|www|@)/i;
    let total = 0;
    const out = [];
    for (const l of lines) {
      const nums = [...l.matchAll(/\d{1,3}(?:[,.]\d{3}(?!\d))+(?:[.,]\d{1,2}(?!\d))?|\d+(?:[.,]\d{1,2}(?!\d))?/g)].map(m => m[0]);
      if (!nums.length) continue;
      const amount = toAmount(nums[nums.length - 1]);
      if (/TOTAL|AMOUNT DUE|NET PAY|GRAND/i.test(l) && !/SUB/i.test(l)) { if (amount > total) total = amount; continue; }
      if (skip.test(l)) continue;
      if (!(amount >= 50 && amount <= 2000000)) continue;
      const firstDigit = l.search(/\d/);
      let name = (firstDigit > 2 ? l.slice(0, firstDigit) : l.replace(/[\d,.x*@]+/gi, " ")).replace(/[^A-Za-zÀ-ÿ' ]/g, " ").replace(/\s+/g, " ").trim();
      if (name.replace(/\s/g, "").length < 3) continue;
      let qty = 1;
      const qm = l.match(/(\d+(?:[.,]\d+)?)\s*(?:x|X|\*|@)\s*\d/);
      if (qm) qty = parseFloat(qm[1].replace(",", ".")) || 1;
      let kg = null;
      const km = l.match(/(\d+(?:[.,]\d+)?)\s*KG/i);
      if (km) kg = parseFloat(km[1].replace(",", "."));
      const ing = matchIng(name);
      let packs = qty;
      if (ing && kg && (ING(ing).unit === "g")) packs = Math.round(((kg * 1000) / ING(ing).pack) * 100) / 100;
      out.push({ name: titleCase(name), price: amount, packs, ing, on: true });
    }
    return { lines: out, total };
  }
  function toAmount(s) {
    s = s.replace(/\s/g, "");
    s = s.replace(/[.,](\d{2})$/, "");
    return parseInt(s.replace(/[.,]/g, ""), 10) || 0;
  }
  const titleCase = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
  function matchIng(name) {
    const n = norm(name), toks = n.split(" ").filter(t => t.length >= 3);
    let best = null, bs = 0;
    for (const it of allIngs()) {
      for (const w of [it.name, ...(it.aka || [])]) {
        const wn = norm(w);
        if (!wn) continue;
        let s = 0;
        if (n.includes(wn)) s = 0.7 + wn.length / 50;
        else {
          const wt = wn.split(" ").filter(t => t.length >= 3);
          const hit = wt.filter(t => toks.some(x => x.startsWith(t.slice(0, Math.max(4, t.length - 2))) || t.startsWith(x.slice(0, Math.max(4, x.length - 2)))));
          if (wt.length) s = (hit.length / wt.length) * 0.65;
        }
        if (s > bs) { bs = s; best = it.id; }
      }
    }
    return bs >= 0.5 ? best : null;
  }
  function drawRx() {
    if (!rx) return;
    modalCtx = { kind: "rx" };
    const opts = allIngs().slice().sort((a, b) => a.name.localeCompare(b.name));
    let html = `<div class="mbody"><div class="h2">${rx.manual ? "Type a receipt" : "Scan a receipt"}</div>`;
    if (rx.preview) html += `<img class="receipt-img" src="${rx.preview}" alt="Your receipt">`;
    if (rx.status === "reading") {
      html += `<div class="small muted">${esc(rx.msg)}</div><div class="ocr-bar"><div id="ocrBar" style="width:${Math.round(rx.progress * 100)}%"></div></div></div>`;
      openModal(html); return;
    }
    html += `${rx.msg ? `<div class="small muted">${esc(rx.msg)}</div>` : ""}
      <div class="row" style="align-items:flex-end">
        <label class="field grow">Shop<select id="rx_store">${["Simba", "Spar", "Kimironko market", "Other"].map(s => `<option ${rx.store === s ? "selected" : ""}>${s}</option>`).join("")}</select></label>
        <label class="field grow">Date<input type="date" id="rx_date" value="${rx.date}"></label>
        <label class="field grow">Receipt total (RWF)<input type="number" id="rx_total" value="${rx.total || ""}"></label>
      </div>
      <div class="small muted">Each line: name · price · matching ingredient · how many packs.</div>
      <div id="rx_lines">${rx.lines.map((l, i) => `<div class="rline ${l.on ? "" : "off"}">
        <input type="checkbox" class="rx_on" data-i="${i}" ${l.on ? "checked" : ""} aria-label="Include line">
        <input type="text" class="rx_name" data-i="${i}" value="${esc(l.name)}">
        <input type="number" class="rx_price" data-i="${i}" value="${l.price}">
        <div class="sub2"><select class="rx_ing" data-i="${i}"><option value="">Not a recipe ingredient</option>${opts.map(o => `<option value="${o.id}" ${o.id === l.ing ? "selected" : ""}>${esc(o.name)} (${esc(o.packLabel)})</option>`).join("")}</select>
        <input type="number" step="any" class="rx_packs" data-i="${i}" value="${l.packs}" title="Packs"></div></div>`).join("")}</div>
      <button class="btn sm" data-act="rxAddLine">+ Add line</button>
      <label class="row small"><input type="checkbox" id="rx_prices" ${rx.updatePrices ? "checked" : ""}> Update my prices from this receipt</label>
      <label class="row small"><input type="checkbox" id="rx_stock" ${rx.addStock ? "checked" : ""}> Add matched items to my pantry <span class="muted">(turn off if you already ticked them in the shopping list)</span></label>
      <div class="row between"><button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn primary" data-act="rxSave">Save receipt</button></div></div>`;
    openModal(html);
  }
  function syncRx() {
    if (!rx || !document.getElementById("rx_store")) return;
    rx.store = document.getElementById("rx_store").value;
    rx.date = document.getElementById("rx_date").value;
    rx.total = +document.getElementById("rx_total").value || 0;
    rx.updatePrices = document.getElementById("rx_prices").checked;
    rx.addStock = document.getElementById("rx_stock").checked;
    const q = cls => document.querySelectorAll(cls);
    q(".rx_on").forEach(e => (rx.lines[+e.dataset.i].on = e.checked));
    q(".rx_name").forEach(e => (rx.lines[+e.dataset.i].name = e.value));
    q(".rx_price").forEach(e => (rx.lines[+e.dataset.i].price = +e.value || 0));
    q(".rx_ing").forEach(e => (rx.lines[+e.dataset.i].ing = e.value || null));
    q(".rx_packs").forEach(e => (rx.lines[+e.dataset.i].packs = +e.value || 1));
  }
  function saveRx() {
    syncRx();
    const lines = rx.lines.filter(l => l.on && l.name);
    const total = rx.total || lines.reduce((a, l) => a + l.price, 0);
    let priced = 0, stocked = 0;
    for (const l of lines) {
      if (!l.ing || !ING(l.ing)) continue;
      if (rx.updatePrices && l.packs > 0 && l.price > 0) { S.prices[l.ing] = Math.round(l.price / l.packs); priced++; }
      if (rx.addStock) { S.stock[l.ing] = (S.stock[l.ing] || 0) + l.packs * ING(l.ing).pack; delete S.restock[l.ing]; stocked++; }
    }
    S.receipts.push({ id: Date.now().toString(36), store: rx.store, date: rx.date, total, lines: lines.map(l => ({ name: l.name, price: l.price, ing: l.ing, packs: l.packs })) });
    rx = null;
    closeModal();
    toast(`Receipt saved: ${rwf(total)}. ${priced} prices updated, ${stocked} items added to the pantry.`);
  }

  /* =====================================================================
     GUIDE
     ===================================================================== */
  function openGuide() {
    const { U } = usageMap(true);
    const tot = id => (U[id] || []).reduce((a, b) => a + b, 0);
    openModal(`<div class="mbody guide">
      <div class="h2">Guide & settings</div>
      <div class="card"><b>How it works</b><ul>
        <li><b>Plan:</b> 3 meals + 2 snacks a day. Dinners are cooked for 2, so the leftovers are tomorrow's lunch. Swap any meal or shuffle a whole day.</li>
        <li><b>Cooked:</b> tick it and the ingredients come off your pantry.</li>
        <li><b>Shop:</b> 1 big shop on day 1, then small top-ups on days 8, 15 and 22. Lists are recalculated from your plan minus what you already have.</li>
        <li><b>Pantry:</b> fix amounts any time; tap <b>Finished</b> to put something on the next list.</li>
        <li><b>Spending:</b> scan receipts to track real spending and keep prices accurate.</li></ul></div>
      <div class="card"><b>Freezer plan (day 1)</b>
        <table class="ft"><tr><th>Meat</th><th>This month</th><th>How</th></tr>
        ${FREEZER_IDS.map(id => `<tr><td>${esc(ING(id).name)}</td><td>${fmtAmt(id, tot(id))}</td><td>${esc(ING(id).keep)}</td></tr>`).join("")}</table>
        <ul class="small"><li>Defrost in the fridge overnight; the plan reminds you.</li><li>Cooked beans freeze for 3 months in meal-size bags.</li></ul></div>
      <div class="card"><b>Eat local, spend less</b><ul>
        <li>Fresh veg, fruit, beans and groundnuts are cheapest at Kimironko or Nyabugogo market.</li>
        <li>Rwandan rice, beans, dried peas, sorghum flour, sweet potatoes, honey, Kabuye sugar and Inyange dairy are all local.</li>
        <li>The few imports left (soy sauce, spices, tomato paste, baking powder, yeast) are small and last for months.</li></ul></div>
      <div class="card"><b>Kitchen kit worth having</b><ul class="small"><li>Sharp knife, chopping board, box grater</li><li>Baking tray and oven dish</li><li>4–6 lunch boxes with lids</li><li>Sieve, whisk, rolling pin (a bottle works)</li></ul></div>
      <div class="card stack"><b>Settings</b>
        <div class="row"><label class="field grow">Monthly budget (RWF)<input type="number" id="setBudget" value="${S.budget}"></label><button class="btn" data-act="saveBudget">Save</button></div>
        <div class="row"><button class="btn sm" data-act="resetPlan">Reset all meal swaps</button><button class="btn sm" data-act="resetPrices">Reset prices</button><button class="btn sm danger" data-act="resetAll">Reset everything</button></div></div>
      <p class="tiny muted">Recipe photos: <a href="https://www.themealdb.com" target="_blank" rel="noopener">TheMealDB</a> (some show a close variation). Receipt reading: Tesseract.js. Prices are estimates until you scan receipts.</p>
    </div>`);
  }

  /* =====================================================================
     RENDER + EVENTS
     ===================================================================== */
  function render() {
    document.querySelectorAll(".tabbar button").forEach(b => b.classList.toggle("active", b.dataset.tab === S.tab));
    const lists = computeShops();
    header(lists);
    ({ plan: renderPlan, recipes: renderRecipes, shop: renderShop, pantry: renderPantry, money: renderMoney })[S.tab](lists);
  }
  const refresh = () => { save(); render(); };

  document.querySelector(".tabbar").addEventListener("click", e => {
    const b = e.target.closest("button[data-tab]");
    if (b) { S.tab = b.dataset.tab; openItem = null; refresh(); window.scrollTo(0, 0); }
  });
  document.getElementById("budgetPill").onclick = () => { S.tab = "money"; refresh(); };
  document.getElementById("guideBtn").onclick = openGuide;
  document.getElementById("modalClose").onclick = closeModal;
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  const ACT = {
    // navigation
    tab: d => { S.tab = d.v; openItem = null; closeModal(); refresh(); },
    pv: d => { S.planView = d.v; refresh(); },
    gotoDay: d => { S.day = +d.d; S.planView = "day"; refresh(); },
    setToday: () => { S.today = S.day; S.shopSel = null; refresh(); toast(`You're on day ${S.day}. Shopping lists now start from today.`); },
    closeModal: () => closeModal(),
    // plan
    cook: d => {
      const [dd] = d.key.split("|");
      const e = entries(+dd).find(x => x.key === d.key);
      const was = !!S.cooked[d.key];
      const ranOut = toggleCooked(e);
      refresh();
      if (!was) toast(ranOut && ranOut.length ? `Used up: ${ranOut.join(", ")}.` : "Nice! Ingredients taken off your pantry.", () => toggleCooked(e));
    },
    swap: d => openSwap(+d.d, d.slot),
    pickSwap: d => {
      const day = +d.d;
      const before = JSON.parse(JSON.stringify(S.plan[day] || null));
      setSlot(day, d.slot, d.id);
      closeModal(); refresh();
      toast(d.slot === "dinner" && day < 30 ? "Swapped. Tomorrow's lunch is now its leftovers." : "Swapped.", () => { if (before) S.plan[day] = before; else delete S.plan[day]; });
    },
    shuffleDay: () => { const undo = shuffleDay(S.day); refresh(); toast("New meals picked for this day.", undo); },
    resetDay: () => { const before = S.plan[S.day]; delete S.plan[S.day]; refresh(); toast("Day reset to the original plan.", () => (S.plan[S.day] = before)); },
    // recipe modal
    openRecipe: d => openRecipe(d.id, +d.s || undefined),
    serv: d => { modalCtx.serv = Math.max(1, modalCtx.serv + +d.v); drawRecipe(); },
    ingPanel: d => { const i = +d.i; if (modalCtx.openIdx === i && modalCtx.mode === d.m) modalCtx.openIdx = null; else { modalCtx.openIdx = i; modalCtx.mode = d.m; } drawRecipe(); },
    ingRemoveHere: d => {
      const id = modalCtx.id;
      const copy = JSON.parse(JSON.stringify(rawRecipe(id)));
      copy.ing = copy.ing.filter(x => x[0] !== d.ing);
      S.customRecipes[id] = copy; save(); modalCtx.openIdx = null; drawRecipe(); render();
      toast(`${ING(d.ing).name} removed from this recipe.`);
    },
    ingRule: d => {
      if (d.mode === "replace") { const to = document.getElementById("replTo").value; S.ingRules[d.ing] = { mode: "replace", to }; toast(`${ING(d.ing).name} replaced with ${ING(to).name} in every recipe.`, () => delete S.ingRules[d.ing]); }
      else { S.ingRules[d.ing] = { mode: "remove" }; toast(`${ING(d.ing).name} removed from every recipe.`, () => delete S.ingRules[d.ing]); }
      save(); modalCtx.openIdx = null; drawRecipe(); render();
    },
    hideRecipe: d => { S.hidden[d.id] = true; closeModal(); refresh(); toast(`Removed. Your plan now uses other meals instead.`, () => delete S.hidden[d.id]); },
    unhide: d => { delete S.hidden[d.id]; refresh(); },
    restoreRecipe: d => { const old = S.customRecipes[d.id]; delete S.customRecipes[d.id]; save(); drawRecipe(); render(); toast("Original recipe restored.", () => (S.customRecipes[d.id] = old)); },
    editRecipe: d => openEditor(d.id, false),
    newRecipe: () => openEditor(null, true),
    edAddIng: () => { syncEditor(); modalCtx.draft.ing.push(["tomato", 100]); drawEditor(); },
    edDelIng: d => { syncEditor(); modalCtx.draft.ing.splice(+d.i, 1); drawEditor(); },
    edNewIng: () => { syncEditor(); modalCtx.newIng = !modalCtx.newIng; drawEditor(); },
    niSave: () => {
      syncEditor();
      const name = document.getElementById("ni_name").value.trim();
      if (!name) { toast("Give the ingredient a name."); return; }
      const unit = document.getElementById("ni_unit").value, pack = +document.getElementById("ni_pack").value || 1;
      const id = "ci_" + Date.now().toString(36);
      S.customIngs[id] = { id, name, sec: +document.getElementById("ni_sec").value, origin: "local", unit, pack, packLabel: `${pack} ${unit === "pc" ? "pieces" : unit}`, price: +document.getElementById("ni_price").value || 0, buy: document.getElementById("ni_buy").value, where: "any", aka: [name], subs: [], custom: true };
      modalCtx.draft.ing.push([id, unit === "pc" ? 1 : 100]);
      modalCtx.newIng = false; save(); drawEditor();
    },
    edCancel: () => openRecipe(modalCtx.draft.id),
    edSave: () => {
      syncEditor();
      const dr = modalCtx.draft;
      if (!dr.name) { toast("Give the recipe a name."); return; }
      if (!dr.steps.length) dr.steps = ["Cook and enjoy."];
      dr.ing = dr.ing.filter(([id, q]) => ING(id) && q > 0);
      S.customRecipes[dr.id] = dr;
      delete S.hidden[dr.id];
      save(); render(); openRecipe(dr.id);
      toast(modalCtx && modalCtx.kind === "recipe" ? "Recipe saved." : "Saved.");
    },
    edDelete: () => { const id = modalCtx.draft.id; const old = S.customRecipes[id]; delete S.customRecipes[id]; closeModal(); refresh(); toast("Recipe deleted.", () => (S.customRecipes[id] = old)); },
    rtype: d => { S.rtype = d.v; refresh(); },
    // shop
    shopSel: d => { S.shopSel = d.v; openItem = null; refresh(); },
    startShop: () => { ensureStarted(S.shopSel); refresh(); toast("List locked in. Tick items as they go in the trolley."); },
    finishShop: () => { S.shops[S.shopSel].status = "done"; S.shopSel = null; refresh(); toast("Shop finished. Scan the receipt in Spending to record what you paid."); },
    reopenShop: () => { S.shops[S.shopSel].status = "shopping"; refresh(); },
    tick: d => { tickItem(S.shopSel, d.key); refresh(); },
    hideTicked: (d, el) => { S.hideTicked = el.checked; refresh(); },
    openItem: d => { openItem = openItem === d.key ? null : d.key; render(); },
    setPrice: d => { const v = +document.getElementById("pe_" + d.id).value; if (v >= 0) { S.prices[d.id] = v; refresh(); toast("Price saved."); } },
    packs: d => { ensureStarted(S.shopSel); const it = S.shops[S.shopSel].items.find(i => i.key === d.key); if (it) { const wasT = d.key in S.shops[S.shopSel].ticks; if (wasT) tickItem(S.shopSel, d.key); it.packs = Math.max(1, it.packs + +d.v); if (wasT) tickItem(S.shopSel, d.key); } refresh(); },
    removeItem: d => { ensureStarted(S.shopSel); const sh = S.shops[S.shopSel]; if (d.key in sh.ticks) tickItem(S.shopSel, d.key); sh.items = sh.items.filter(i => i.key !== d.key); openItem = null; refresh(); },
    useSub: d => { ensureStarted(S.shopSel); const sh = S.shops[S.shopSel]; const it = sh.items.find(i => i.key === d.key); sh.replaced[d.key] = ING(it.id).subs[+d.i]; if (!(d.key in sh.ticks)) tickItem(S.shopSel, d.key); openItem = null; refresh(); },
    addItem: () => {
      const id = document.getElementById("addIng").value; const packs = Math.max(1, +document.getElementById("addPacks").value || 1);
      if (!id) { toast("Choose an ingredient first."); return; }
      const item = { key: "m_" + Date.now().toString(36), id, packs, recipes: [] };
      if (shopStatus(S.shopSel) === "shopping") S.shops[S.shopSel].items.push(item); else (S.shopAdds[S.shopSel] = S.shopAdds[S.shopSel] || []).push(item);
      refresh();
    },
    addFree: () => {
      const name = document.getElementById("addFree").value.trim(); if (!name) return;
      const item = { key: "m_" + Date.now().toString(36), id: null, name, packs: 1, price: +document.getElementById("addFreePrice").value || 0 };
      if (shopStatus(S.shopSel) === "shopping") S.shops[S.shopSel].items.push(item); else (S.shopAdds[S.shopSel] = S.shopAdds[S.shopSel] || []).push(item);
      refresh();
    },
    // pantry
    finished: d => { const old = S.stock[d.id]; S.stock[d.id] = 0; S.restock[d.id] = true; refresh(); toast(`${ING(d.id).name} added to your next shopping list.`, () => { S.stock[d.id] = old; delete S.restock[d.id]; }); },
    unrestock: d => { delete S.restock[d.id]; refresh(); },
    pAdd: () => { const id = document.getElementById("pAddIng").value, q = +document.getElementById("pAddQty").value; if (!(q > 0)) { toast("Type an amount first."); return; } S.stock[id] = (S.stock[id] || 0) + q; refresh(); toast(`Added ${fmtAmt(id, q)} ${ING(id).name.toLowerCase()}.`); },
    delRule: d => { delete S.ingRules[d.id]; refresh(); },
    ruleQuick: () => { const id = document.getElementById("ruleIng").value; S.ingRules[id] = { mode: "remove" }; refresh(); toast(`${ING(id).name} removed from every recipe.`, () => delete S.ingRules[id]); },
    // money
    editBudget: () => openGuide(),
    saveBudget: () => { const v = +document.getElementById("setBudget").value; if (v > 0) { S.budget = v; save(); render(); toast("Budget saved."); } },
    rxManual: () => { rx = { status: "review", manual: true, msg: "", lines: [{ name: "", price: 0, packs: 1, ing: null, on: true }], total: 0, store: "Simba", date: new Date().toISOString().slice(0, 10), addStock: true, updatePrices: true }; drawRx(); },
    rxAddLine: () => { syncRx(); rx.lines.push({ name: "", price: 0, packs: 1, ing: null, on: true }); drawRx(); },
    rxSave: () => { saveRx(); refresh(); },
    delReceipt: d => { const i = S.receipts.findIndex(r => r.id === d.id); const old = S.receipts[i]; S.receipts.splice(i, 1); refresh(); toast("Receipt deleted.", () => S.receipts.splice(i, 0, old)); },
    // settings
    resetPlan: () => { if (confirm("Undo all your meal swaps and go back to the original 30-day plan?")) { S.plan = {}; closeModal(); refresh(); } },
    resetPrices: () => { if (confirm("Go back to the estimated prices?")) { S.prices = {}; closeModal(); refresh(); } },
    resetAll: () => { if (confirm("Delete everything (swaps, pantry, receipts, recipes you added) and start fresh?")) { try { localStorage.removeItem(KEY); } catch {} location.reload(); } },
  };

  function dispatch(e) {
    const el = e.target.closest("[data-act]");
    if (!el || el.tagName === "INPUT" && el.type !== "checkbox" && e.type === "click") return;
    const fn = ACT[el.dataset.act];
    if (fn) { e.preventDefault && el.type !== "checkbox" && e.preventDefault(); fn(el.dataset, el); }
  }
  view.addEventListener("click", dispatch);
  modalBody.addEventListener("click", dispatch);
  view.addEventListener("change", e => {
    const el = e.target;
    if (el.dataset.act === "setStock") { const v = Math.max(0, +el.value || 0); S.stock[el.dataset.id] = v; if (v > 0) delete S.restock[el.dataset.id]; refresh(); }
    if (el.dataset.act === "setPriceInline") { const v = +el.value; if (v >= 0) { S.prices[el.dataset.id] = v; save(); header(computeShops()); toast("Price saved."); } }
  });
  modalBody.addEventListener("change", e => {
    if (e.target.classList.contains("rx_on")) { syncRx(); drawRx(); }
    if (e.target.classList.contains("ed_ing")) { syncEditor(); drawEditor(); }
  });

  render();
  window.__kk = { parseReceipt, matchIng, computeShops, state: () => S }; // for testing
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
