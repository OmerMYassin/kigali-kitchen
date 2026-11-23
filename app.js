/* Kigali Kitchen — app logic (vanilla JS, no build step) */
(() => {
  "use strict";

  // ---------- lookups ----------
  const ING = Object.fromEntries(INGREDIENTS.map(i => [i.id, i]));
  const REC = Object.fromEntries(RECIPES.map(r => [r.id, r]));
  const PLAN = buildPlan();

  // ---------- persisted state ----------
  const KEY = "kigali-kitchen-v1";
  const defaults = { tab: "plan", day: 1, today: 1, planView: "day", shop: "big", checks: {}, replaced: {}, prices: {}, budget: 250000, rtype: "all", q: "" };
  const S = Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || "{}"));
  const save = () => localStorage.setItem(KEY, JSON.stringify(S));

  // ---------- formatting ----------
  const rwf = n => Math.round(n).toLocaleString("en-US") + " RWF";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const price = id => (S.prices[id] != null ? S.prices[id] : ING[id].price);

  function frac(x) {
    const whole = Math.floor(x + 1e-9);
    const f = x - whole;
    const opts = [[0, ""], [0.25, "¼"], [1 / 3, "⅓"], [0.5, "½"], [2 / 3, "⅔"], [0.75, "¾"], [1, ""]];
    let best = opts[0];
    for (const o of opts) if (Math.abs(o[0] - f) < Math.abs(best[0] - f)) best = o;
    const w = best[0] === 1 ? whole + 1 : whole;
    if (w === 0 && !best[1]) return x > 0 ? "¼" : "0";
    return (w ? String(w) : "") + best[1];
  }
  function plural(n, word) { return n > 1.01 ? word + "s" : word; }

  function fmtQty(id, q) {
    const it = ING[id];
    if (it.unit === "pc") return frac(q);
    if (it.unit === "clove") return `${frac(q)} ${plural(q, "clove")}`;
    if (it.unit === "cube") return `${frac(q)} ${plural(q, "cube")}`;
    const u = it.unit;
    if (it.spoon && q < it.spoon * 9) {
      const tsp = q / it.spoon;
      if (tsp < 0.2) return "a pinch";
      const s = tsp >= 3 ? `${frac(tsp / 3)} tbsp` : `${frac(tsp)} tsp`;
      return q >= 10 ? `${s} (${Math.round(q)} ${u})` : s;
    }
    let s;
    if (q >= 1000) s = `${+(q / 1000).toFixed(2)} ${u === "g" ? "kg" : "L"}`;
    else s = `${q >= 50 ? Math.round(q / 5) * 5 : Math.round(q)} ${u}`;
    if (it.each) s += ` (≈${frac(q / it.each[0])} ${plural(q / it.each[0], it.each[1])})`;
    return s;
  }
  function fmtTotal(id, q) {
    const it = ING[id];
    if (it.unit === "g" || it.unit === "ml") return q >= 1000 ? `${+(q / 1000).toFixed(2)} ${it.unit === "g" ? "kg" : "L"}` : `${Math.round(q)} ${it.unit}`;
    return `${+q.toFixed(1)} ${it.unit === "pc" ? "pcs" : it.unit + "s"}`;
  }

  // ---------- shopping engine ----------
  const BUCKETS = {
    month: [[1, 30, "big"]],
    fortnight: [[1, 14, "big"], [15, 30, "t15"]],
    week: [[1, 7, "big"], [8, 14, "t8"], [15, 21, "t15"], [22, 30, "t22"]],
  };

  function mealEntries(day) {
    const list = [["Breakfast", day.breakfast], ["Lunch", day.lunch], ["Dinner", day.dinner]];
    day.snacks.forEach(s => list.push(["Snack", s]));
    return list;
  }

  function computeUsage() {
    const usage = {}, usedIn = {};
    for (const id in ING) { usage[id] = new Array(31).fill(0); usedIn[id] = Array.from({ length: 31 }, () => new Set()); }
    for (const day of PLAN) {
      for (const [, e] of mealEntries(day)) {
        if (!e.r) continue;
        const r = REC[e.r];
        for (const [id, q] of r.ing) {
          usage[id][day.day] += q * e.s / (r.yield || 1);
          usedIn[id][day.day].add(r.id);
        }
      }
    }
    return { usage, usedIn };
  }
  const { usage: USAGE, usedIn: USED_IN } = computeUsage();

  function computeShops() {
    const shops = { big: [], t8: [], t15: [], t22: [] };
    for (const it of INGREDIENTS) {
      if (it.fixed) {
        const packs = Math.ceil(it.fixed / it.pack);
        shops.big.push({ id: it.id, need: it.fixed, packs, cost: packs * price(it.id), recipes: [] });
        continue;
      }
      let left = 0;
      for (const [a, b, shop] of BUCKETS[it.buy]) {
        let need = 0; const recs = new Set();
        for (let d = a; d <= b; d++) { need += USAGE[it.id][d]; USED_IN[it.id][d].forEach(r => recs.add(r)); }
        if (it.noCarry) left = 0; // too perishable to carry over to the next week
        if (need <= 0) continue;
        const toBuy = need - left;
        let packs = 0;
        if (toBuy > 0) packs = Math.ceil(toBuy / it.pack - 1e-6);
        left = left + packs * it.pack - need;
        shops[shop].push({ id: it.id, need, packs, cost: packs * price(it.id), recipes: [...recs] });
      }
    }
    return shops;
  }

  // ---------- rendering helpers ----------
  const view = document.getElementById("view");
  const imgTag = (r, cls = "") => r.img
    ? `<img class="${cls}" src="images/${r.img}.jpg" alt="${esc(r.name)}" loading="lazy">`
    : `<div class="${cls} emoji">${r.emoji || "🍽️"}</div>`;

  function updateBudgetPill() {
    const shops = computeShops();
    const total = Object.values(shops).flat().reduce((s, x) => s + x.cost, 0);
    const pill = document.getElementById("budgetPill");
    pill.textContent = `≈ ${Math.round(total / 1000)}k / ${Math.round(S.budget / 1000)}k RWF`;
    pill.classList.toggle("over", total > S.budget);
    return { shops, total };
  }

  // ---------- PLAN ----------
  function defrostNotes(d) {
    if (d >= 30) return [];
    const next = REC[PLAN[d].dinner.r];
    const meats = next.ing.filter(([id]) => FREEZER_IDS.includes(id));
    return meats.map(([id, q]) => `🧊 Tonight: move ${Math.round(q * 2)} g ${ING[id].name.toLowerCase()} from the freezer to the fridge for tomorrow's ${next.name.toLowerCase()}.`);
  }

  function renderPlan() {
    const d = S.day;
    const day = PLAN[d - 1];
    const shopToday = SHOPS.find(s => s.day === d);
    let strip = `<div class="daystrip" id="daystrip">`;
    for (const x of PLAN) {
      const cls = ["daychip", x.weekend ? "weekend" : "", SHOPS.some(s => s.day === x.day) ? "shop" : "", x.day === d ? "active" : ""].join(" ");
      strip += `<button class="${cls}" data-day="${x.day}">Day<b>${x.day}</b>${x.day === S.today ? "📍" : SHOPS.some(s => s.day === x.day) ? "🛒" : "&nbsp;"}</button>`;
    }
    strip += `</div>`;

    const toggle = `<div class="row between no-print" style="margin-bottom:8px">
      <div class="filters" style="margin:0">
        <button class="chip ${S.planView === "day" ? "active" : ""}" data-pv="day">Day view</button>
        <button class="chip ${S.planView === "month" ? "active" : ""}" data-pv="month">Whole month</button>
      </div>
      <span class="small muted">📍 you're on day ${S.today}</span></div>`;

    if (S.planView === "month") {
      let html = toggle + `<div class="month">`;
      for (const x of PLAN) {
        html += `<button class="mcell" data-goto="${x.day}"><b>Day ${x.day}</b>${SHOPS.some(s => s.day === x.day) ? " 🛒" : ""}${x.day === S.today ? " 📍" : ""}
          <div>☀️ ${esc(REC[x.breakfast.r].name)}</div>
          <div>🥪 ${esc(x.lunch.r ? REC[x.lunch.r].name : "Leftover " + REC[x.lunch.lo].name)}</div>
          <div>🌙 ${esc(REC[x.dinner.r].name)}</div></button>`;
      }
      view.innerHTML = html + `</div>`;
      return;
    }

    const mealCard = (slot, e) => {
      const r = REC[e.r || e.lo || e.from];
      let meta = `${r.time ? r.time + " min · " : ""}${r.level}${r.cuisine ? " · " + r.cuisine : ""}`;
      let slotTxt = slot;
      if (e.lo) { slotTxt = "Lunch · leftovers"; meta = "Cooked last night: just reheat"; }
      if (e.from) { meta = "From this week's batch (2 pieces)"; }
      if (e.note) meta = `${e.note} · ${meta}`;
      if (slot === "Dinner") meta += " · cook for 2";
      const serv = e.lo || e.from ? 1 : e.s;
      return `<button class="meal" data-recipe="${r.id}" data-serv="${slot === "Snack" && r.yield ? r.yield : serv}">
        ${imgTag(r)}
        <div class="info"><span class="slot">${slotTxt}</span><h3>${esc(r.name)}</h3><span class="meta">${meta}</span></div></button>`;
    };

    const prep = [...day.prep, ...defrostNotes(d)];
    let html = toggle + strip + `
      <div class="day-head">
        <div><h2>Day ${d}</h2><span class="muted small">${day.weekend ? "Weekend day: longer recipes" : "Weekday"}${shopToday ? " · 🛒 " + shopToday.name : ""}</span></div>
        <div class="row no-print">
          <button class="btn" data-nav="-1" ${d === 1 ? "disabled" : ""}>‹ Prev</button>
          ${d !== S.today ? `<button class="btn primary" id="setToday">📍 I'm on this day</button>` : ""}
          <button class="btn" data-nav="1" ${d === 30 ? "disabled" : ""}>Next ›</button>
        </div>
      </div>`;
    if (prep.length) html += `<div class="card prep"><b>To do today</b><ul>${prep.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      ${shopToday ? `<button class="btn primary" style="margin-top:8px" data-goshop="${shopToday.id}">Open ${shopToday.name} list</button>` : ""}</div>`;
    html += `<div class="meals">
      ${mealCard("Breakfast", day.breakfast)}
      ${mealCard("Lunch", day.lunch)}
      ${mealCard("Dinner", day.dinner)}
      ${day.snacks.map(s => mealCard("Snack", s)).join("")}
    </div>`;
    view.innerHTML = html;
    const active = view.querySelector(".daychip.active");
    if (active) active.scrollIntoView({ inline: "center", block: "nearest" });
  }

  // ---------- RECIPE MODAL ----------
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  function openRecipe(id, servings) {
    const r = REC[id];
    const y = r.yield || 1;
    let serv = servings || (r.type === "dinner" ? 2 : y);
    const days = PLAN.filter(p => [p.breakfast, p.lunch, p.dinner, ...p.snacks].some(e => e.r === id)).map(p => p.day);
    const draw = () => {
      modalBody.innerHTML = `
        ${r.img ? `<img class="hero" src="images/${r.img}.jpg" alt="${esc(r.name)}">` : `<div class="hero emoji">${r.emoji || "🍽️"}</div>`}
        <div class="rbody">
          <h2>${esc(r.name)}</h2>
          <div>${r.cuisine ? `<span class="tag">${r.cuisine}</span>` : ""}<span class="tag amber">${r.level}</span>${r.time ? `<span class="tag">⏱ ${r.time} min</span>` : ""}</div>
          ${r.photoNote ? `<div class="photo-note">📷 ${esc(r.photoNote)}</div>` : ""}
          ${days.length ? `<div class="small muted" style="margin-top:6px">On the plan: day ${days.join(", ")}</div>` : `<div class="small muted" style="margin-top:6px">Extra recipe: swap it in whenever you like.</div>`}
          <div class="servings">
            <button data-s="-1" aria-label="fewer">−</button>
            <b>${serv} ${y > 1 ? "servings (batch)" : plural(serv, "serving")}</b>
            <button data-s="1" aria-label="more">+</button>
            ${r.type === "dinner" ? `<span class="small muted">2 = dinner + tomorrow's lunch</span>` : ""}
          </div>
          <h3 class="section-title" style="margin-top:6px">Ingredients</h3>
          <ul class="ing-list">
            ${r.ing.map(([iid, q, note], i) => `
              <li><span class="q">${fmtQty(iid, q * serv / y)}</span>
                <span class="n">${esc(ING[iid].name)}${note ? ` <span class="muted small">(${esc(note)})</span>` : ""}<br>
                <button class="subs-btn" data-subs="${i}">Can't find it?</button>
                <div class="subs" id="subs-${i}" hidden><b>Use instead:</b><ul>${ING[iid].subs.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div></span></li>`).join("")}
          </ul>
          <h3 class="section-title">Method</h3>
          <ol class="steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
          ${r.tip ? `<div class="tip">💡 ${esc(r.tip)}</div>` : ""}
        </div>`;
    };
    draw();
    modalBody.onclick = ev => {
      const b = ev.target.closest("button");
      if (!b) return;
      if (b.dataset.s) { serv = Math.max(1, serv + Number(b.dataset.s)); draw(); }
      if (b.dataset.subs != null) { const el = document.getElementById("subs-" + b.dataset.subs); el.hidden = !el.hidden; }
    };
    modal.hidden = false;
    modal.querySelector(".modal-card").scrollTop = 0;
  }
  document.getElementById("modalClose").onclick = () => (modal.hidden = true);
  modal.addEventListener("click", e => { if (e.target === modal) modal.hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") modal.hidden = true; });

  // ---------- RECIPES ----------
  function renderRecipes() {
    const types = [["all", "All"], ["breakfast", "Breakfast"], ["dinner", "Dinner"], ["lunch", "Quick lunch"], ["snack", "Snacks"]];
    const q = S.q.toLowerCase();
    const list = RECIPES.filter(r => (S.rtype === "all" || r.type === S.rtype) &&
      (!q || r.name.toLowerCase().includes(q) || (r.cuisine || "").toLowerCase().includes(q) || r.ing.some(([id]) => ING[id].name.toLowerCase().includes(q))));
    view.innerHTML = `
      <div class="filters">
        <input id="rsearch" type="search" placeholder="Search recipes or ingredients (e.g. chicken, lentils)" value="${esc(S.q)}">
      </div>
      <div class="filters">${types.map(([k, l]) => `<button class="chip ${S.rtype === k ? "active" : ""}" data-rtype="${k}">${l}</button>`).join("")}</div>
      <p class="small muted">${list.length} recipes · Dinners are cooked for 2 so the leftovers become tomorrow's lunch.</p>
      <div class="rgrid">
        ${list.map(r => `<button class="rcard" data-recipe="${r.id}">${imgTag(r)}
          <div class="body"><h4>${esc(r.name)}</h4><span class="small muted">${r.time ? r.time + " min · " : ""}${r.level}</span></div></button>`).join("")}
      </div>`;
    const inp = document.getElementById("rsearch");
    inp.oninput = () => { S.q = inp.value; save(); const pos = inp.selectionStart; renderRecipes(); const n = document.getElementById("rsearch"); n.focus(); n.setSelectionRange(pos, pos); };
  }

  // ---------- SHOPPING ----------
  function renderShop() {
    const { shops, total } = updateBudgetPill();
    const items = shops[S.shop].filter(x => x.packs > 0);
    const athome = shops[S.shop].filter(x => x.packs === 0);
    const shopInfo = SHOPS.find(s => s.id === S.shop);
    const shopTotal = items.reduce((s, x) => s + x.cost, 0);
    const done = items.filter(x => S.checks[S.shop + ":" + x.id]).length;

    let html = `
      <div class="shoptabs">${SHOPS.map(s => {
        const t = shops[s.id].reduce((a, x) => a + x.cost, 0);
        return `<button class="${S.shop === s.id ? "active" : ""}" data-shop="${s.id}">${s.name}<small>${Math.round(t / 1000)}k RWF</small></button>`;
      }).join("")}</div>
      <div class="card">
        <div class="row between"><h2 style="font-size:20px">${shopInfo.name}</h2><b>${rwf(shopTotal)}</b></div>
        <p class="small muted" style="margin:4px 0 0">${shopInfo.desc}</p>
        <div class="progress"><div style="width:${items.length ? (done / items.length) * 100 : 0}%"></div></div>
        <div class="row between small muted" style="margin-top:6px"><span>${done} of ${items.length} items in the trolley</span>
          <span class="no-print"><button class="btn" id="printList">🖨 Print</button> <button class="btn" id="resetTicks">Reset ticks</button></span></div>
      </div>`;

    if (S.shop === "big") {
      html += `<div class="card">
        <h3 style="margin-bottom:8px">Month budget</h3>
        <div class="summary-grid">
          <div class="stat"><b>${rwf(total)}</b><span>Whole month (big shop + 3 top-ups)</span></div>
          <div class="stat"><b>${rwf(S.budget)}</b><span>Your budget · <button class="btn" style="padding:0 6px;font-size:11px" id="editBudget">edit</button></span></div>
          <div class="stat"><b style="color:${total > S.budget ? "var(--red)" : "var(--green)"}">${rwf(Math.abs(S.budget - total))}</b><span>${total > S.budget ? "Over budget" : "Left for coffee, treats or price surprises"}</span></div>
          <div class="stat"><b>${rwf(total / 30)}</b><span>Per day for 3 meals + 2 snacks</span></div>
        </div>
        <p class="small muted" style="margin:8px 0 0">Prices are estimates for Kigali in late 2026. Tap <u>edit price</u> on any item to type in the real shelf price, and every total updates.</p>
      </div>`;
    }

    const byCat = {};
    for (const x of items) (byCat[ING[x.id].cat] ||= []).push(x);
    for (const cat of Object.keys(byCat).map(Number).sort((a, b) => a - b)) {
      const list = byCat[cat];
      const ct = list.reduce((s, x) => s + x.cost, 0);
      html += `<h3 class="section-title">${CATEGORIES[cat]} <span class="cat-total">· ${rwf(ct)}</span></h3><div class="card" style="padding:4px 14px">`;
      for (const x of list) {
        const it = ING[x.id];
        const key = S.shop + ":" + x.id;
        const checked = !!S.checks[key];
        const rep = S.replaced[key];
        const recNames = x.recipes.map(r => REC[r].name.replace(/\s*\(.*\)/, "")).slice(0, 5);
        html += `<div class="item ${checked ? "done" : ""}">
          <input type="checkbox" data-check="${key}" ${checked ? "checked" : ""} aria-label="${esc(it.name)}">
          <div class="main">
            <div class="name">${x.packs} × ${esc(it.name)}</div>
            <div class="detail">${esc(it.packLabel)} each · you need ${fmtTotal(x.id, x.need)}${it.fixed ? "" : ` for days ${bucketRange(it.buy, S.shop)}`}</div>
            <div class="detail">📍 ${esc(WHERE[it.where])}</div>
            ${it.keep ? `<div class="detail">🧊 ${esc(it.keep)}</div>` : ""}
            ${recNames.length ? `<div class="detail">🍳 ${esc(recNames.join(", "))}${x.recipes.length > 5 ? "…" : ""}</div>` : ""}
            ${rep ? `<div class="replaced">↺ Replaced with: ${esc(rep)} <button class="btn" style="padding:0 6px;font-size:11px" data-unrep="${key}">undo</button></div>` : ""}
            <div class="actions no-print"><button data-ssubs="${x.id}">Can't find it? See replacements</button></div>
            <div class="subs" id="ssubs-${x.id}" hidden><b>Replace with:</b><ul>${it.subs.map((s, i) => `<li>${esc(s)}<button class="use" data-use="${key}" data-i="${i}" data-id="${x.id}">use this</button></li>`).join("")}</ul></div>
          </div>
          <div class="price">${rwf(x.cost)}<br><span class="small muted" style="font-weight:400">${rwf(price(x.id))}/pack</span><br><button data-price="${x.id}">edit price</button></div>
        </div>`;
      }
      html += `</div>`;
    }
    if (athome.length) html += `<p class="small muted">✅ Already at home from the last shop (no need to buy): ${athome.map(x => esc(ING[x.id].name)).join(", ")}.</p>`;
    view.innerHTML = html;
  }
  function bucketRange(buy, shop) {
    const b = BUCKETS[buy].find(x => x[2] === shop);
    return b ? `${b[0]}–${b[1]}` : "";
  }

  // ---------- TIPS ----------
  function renderTips() {
    const meatUse = FREEZER_IDS.map(id => [id, USAGE[id].reduce((a, b) => a + b, 0)]);
    view.innerHTML = `<div class="tips">
      <div class="card"><h3>How this plan works</h3><ul>
        <li><b>1 big shop on day 1</b> (ideally a Saturday) at Simba or Spar, then a <b>small top-up on days 8, 15 and 22</b> for fresh veg, fruit, milk, yogurt and bread.</li>
        <li><b>Dinners are cooked for 2.</b> Eat one tonight and pack the other for tomorrow's lunch. Lunch is never extra work.</li>
        <li><b>Weekends</b> (days 1–2, 8–9, 15–16, 22–23, 29–30) get the longer recipes and the snack baking.</li>
        <li>All meat is <b>halal-friendly</b> (chicken and beef only). No pork, no alcohol, no fish.</li>
        <li>The 📍 marker on the Plan tab remembers which day you're on.</li>
      </ul></div>

      <div class="card"><h3>🧊 Freezer plan (do this on day 1)</h3>
        <table class="ft"><tr><th>Meat</th><th>Whole month</th><th>How to freeze</th></tr>
        ${meatUse.map(([id, q]) => `<tr><td>${esc(ING[id].name)}</td><td>${fmtTotal(id, q)}</td><td>${esc(ING[id].keep || "")}</td></tr>`).join("")}
        </table>
        <ul class="small"><li>Label every bag with a marker: what it is + weight.</li>
        <li>Defrost in the <b>fridge overnight</b>, never on the counter. The plan reminds you the night before.</li>
        <li>Freeze half of each bread loaf, grated cheese, over-ripe bananas, and leftover tomato paste (in ice-cube trays).</li></ul>
      </div>

      <div class="card"><h3>🥬 Make fresh food last</h3><ul>
        <li><b>Onions, garlic, potatoes:</b> cool, dark, dry place, not the fridge, and potatoes away from onions.</li>
        <li><b>Carrots, cabbage, peppers, cucumber:</b> fridge veg drawer, in a bag.</li>
        <li><b>Herbs:</b> stand in a glass of water in the fridge.</li>
        <li><b>Tomatoes:</b> ripen on the counter, then into the fridge.</li>
        <li><b>Cooked rice:</b> cool quickly, fridge within 1 hour, eat within 1 day (good for fried rice).</li>
        <li><b>Leftover lunches:</b> fridge in a sealed box, eat within 2 days, reheat until steaming hot.</li>
      </ul></div>

      <div class="card"><h3>🍳 Kitchen kit you'll use</h3>
        <p class="small muted">You have pots, pans, an oven and a cooker. These cheap extras make the plan much easier (not in the grocery budget):</p>
        <ul><li>Sharp knife + chopping board</li><li>Box grater (cheese, carrots, tomatoes)</li><li>Baking tray + an oven dish</li>
        <li>4–6 lunch boxes with lids</li><li>Wooden spoon, spatula, whisk/fork, colander/sieve</li><li>Rolling pin (or a clean bottle) for flatbreads and pizza</li><li>Measuring cup + spoons (a normal teaspoon and tablespoon are fine)</li></ul>
      </div>

      <div class="card"><h3>💰 Budget tips for Kigali</h3><ul>
        <li>Fresh veg and fruit are often <b>much cheaper at Kimironko or Nyabugogo market</b> than at Simba or Spar. Use the markets for top-ups if you can.</li>
        <li>Simba usually has the widest range of "international" items (soy sauce, couscous, ful, lentils, olive oil). Spar is handy for fresh produce, meat and dairy.</li>
        <li>Buy rice, oil and flour in big bags. Most of them carry over into month 2, so next month's big shop is cheaper.</li>
        <li>Over budget? Drop the olive oil (use sunflower), swap 1 kg chicken breast for thighs, and use dried Rwandan beans instead of tins.</li>
        <li>Check the halal sign at the meat counter, or ask the butcher. Many Kigali butchers are halal.</li>
      </ul></div>

      <div class="card no-print"><h3>⚙️ Settings</h3>
        <div class="row" style="flex-wrap:wrap;gap:8px;margin-top:6px">
          <button class="btn" id="editBudget2">Change budget (${rwf(S.budget)})</button>
          <button class="btn" id="resetPrices">Reset all prices to estimates</button>
          <button class="btn" id="resetAll">Reset everything</button>
        </div>
      </div>

      <p class="small muted">Recipe photos: <a href="https://www.themealdb.com" target="_blank" rel="noopener">TheMealDB</a>, for illustration (some show a close variation of the dish). Prices are estimates, not live supermarket data.</p>
    </div>`;
  }

  // ---------- router & events ----------
  function render() {
    document.querySelectorAll(".tabbar button").forEach(b => b.classList.toggle("active", b.dataset.tab === S.tab));
    updateBudgetPill();
    ({ plan: renderPlan, recipes: renderRecipes, shop: renderShop, tips: renderTips })[S.tab]();
  }
  function go(tab) { S.tab = tab; save(); render(); window.scrollTo(0, 0); }

  document.querySelector(".tabbar").addEventListener("click", e => {
    const b = e.target.closest("button[data-tab]"); if (b) go(b.dataset.tab);
  });
  document.getElementById("budgetPill").onclick = () => { S.shop = "big"; go("shop"); };

  function editBudget() {
    const v = prompt("Your monthly grocery budget in RWF:", S.budget);
    if (v && !isNaN(+v.replace(/[, ]/g, ""))) { S.budget = +v.replace(/[, ]/g, ""); save(); render(); }
  }

  view.addEventListener("click", e => {
    const b = e.target.closest("button, input");
    if (!b) return;
    const ds = b.dataset;
    if (ds.day) { S.day = +ds.day; save(); renderPlan(); }
    else if (ds.goto) { S.day = +ds.goto; S.planView = "day"; save(); renderPlan(); window.scrollTo(0, 0); }
    else if (ds.pv) { S.planView = ds.pv; save(); renderPlan(); }
    else if (ds.nav) { S.day = Math.min(30, Math.max(1, S.day + +ds.nav)); save(); renderPlan(); }
    else if (b.id === "setToday") { S.today = S.day; save(); renderPlan(); }
    else if (ds.goshop) { S.shop = ds.goshop; go("shop"); }
    else if (ds.recipe) openRecipe(ds.recipe, +ds.serv || undefined);
    else if (ds.rtype) { S.rtype = ds.rtype; save(); renderRecipes(); }
    else if (ds.shop) { S.shop = ds.shop; save(); renderShop(); }
    else if (ds.check) { S.checks[ds.check] = b.checked; save(); renderShop(); }
    else if (ds.ssubs) { const el = document.getElementById("ssubs-" + ds.ssubs); el.hidden = !el.hidden; }
    else if (ds.use) { S.replaced[ds.use] = ING[ds.id].subs[+ds.i]; S.checks[ds.use] = true; save(); renderShop(); }
    else if (ds.unrep) { delete S.replaced[ds.unrep]; save(); renderShop(); }
    else if (ds.price) {
      const it = ING[ds.price];
      const v = prompt(`Price in RWF for ${it.name} (${it.packLabel}):`, price(it.id));
      if (v && !isNaN(+v.replace(/[, ]/g, ""))) { S.prices[it.id] = +v.replace(/[, ]/g, ""); save(); renderShop(); }
    }
    else if (b.id === "printList") window.print();
    else if (b.id === "resetTicks") { if (confirm("Untick everything on this list?")) { for (const k in S.checks) if (k.startsWith(S.shop + ":")) delete S.checks[k]; for (const k in S.replaced) if (k.startsWith(S.shop + ":")) delete S.replaced[k]; save(); renderShop(); } }
    else if (b.id === "editBudget" || b.id === "editBudget2") editBudget();
    else if (b.id === "resetPrices") { if (confirm("Go back to the estimated prices?")) { S.prices = {}; save(); render(); } }
    else if (b.id === "resetAll") { if (confirm("Reset ticks, prices, budget and your current day?")) { localStorage.removeItem(KEY); location.reload(); } }
  });

  render();

  // offline support (works when served over http/https)
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
