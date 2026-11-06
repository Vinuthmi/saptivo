<template>
  <section id="catalog" ref="root" class="cg" :class="{ in: seen, live }" aria-labelledby="cg-title">
    <h2 id="cg-title" class="title">
      <span>Product and</span>
      <span class="soft">service catalog</span>
    </h2>
    <p class="lead">A central catalog keeps prices and descriptions consistent across every document.</p>

    <div class="grid">
      <!-- catalog UI -->
      <article class="card" aria-label="Catalog example">
        <header>
          <div class="cats" role="group" aria-label="Category">
            <button v-for="c in cats" :key="c" type="button" :class="{ on: cat === c }" :aria-pressed="cat === c" @click="pickCat(c)">{{ c }}</button>
          </div>
          <div class="book" role="group" aria-label="Price book">
            <button type="button" :class="{ on: book === 'Retail' }" :aria-pressed="book === 'Retail'" @click="pickBook('Retail')">Retail</button>
            <button type="button" :class="{ on: book === 'Wholesale' }" :aria-pressed="book === 'Wholesale'" @click="pickBook('Wholesale')">Wholesale</button>
          </div>
        </header>

        <div class="body">
          <TransitionGroup name="pc" tag="ul" class="prods">
            <li v-for="p in shown" :key="p.sku">
              <button type="button" class="prod" :class="[p.tone, { sel: p.sku === sel.sku }]" :aria-pressed="p.sku === sel.sku" @click="pick(p)">
                <span class="th">
                  <img v-if="p.img && p.ok" :src="p.img" alt="" loading="lazy" @error="p.ok = false" />
                  <span v-else class="ini">{{ p.name.slice(0, 1) }}</span>
                </span>
                <span class="pn"><b>{{ p.name }}</b><small>{{ p.sku }}</small></span>
                <span class="pp">{{ money(unit(p, 1)) }}</span>
                <span v-if="stockOn" class="stk" :class="{ low: p.stock !== null && p.stock < 10, none: p.stock === null }">{{ p.stock === null ? 'Service' : p.stock + ' in stock' }}</span>
              </button>
            </li>
          </TransitionGroup>

          <!-- detail -->
          <div :key="sel.sku" class="detail" :class="sel.tone">
            <div class="dh">
              <span class="th big">
                <img v-if="sel.img && sel.ok" :src="sel.img" alt="" />
                <span v-else class="ini">{{ sel.name.slice(0, 1) }}</span>
              </span>
              <span class="dn">
                <b>{{ sel.name }}</b>
                <small>SKU {{ sel.sku }} · {{ sel.cat }}</small>
              </span>
            </div>
            <p class="desc">{{ sel.desc }}</p>
            <p class="tags"><span v-for="t in sel.tags" :key="t">{{ t }}</span></p>

            <p class="cap">Volume pricing · {{ book }} price book</p>
            <ul class="tiers">
              <li v-for="(t, i) in tiers" :key="t.from" :class="{ on: i === tierIdx }">
                <span>{{ t.label }}</span>
                <b>{{ money(unit(sel, t.from)) }}</b>
                <em v-if="t.off">−{{ t.off }}%</em>
              </li>
            </ul>

            <div class="qty">
              <span>Quantity</span>
              <span class="step">
                <button type="button" aria-label="Decrease quantity" @click="setQty(qty - (qty > 10 ? 10 : qty > 1 ? 1 : 0))">−</button>
                <b>{{ qty }}</b>
                <button type="button" aria-label="Increase quantity" @click="setQty(qty + (qty >= 10 ? 10 : 1))">+</button>
              </span>
              <span class="line">Unit <b :key="unitNow">{{ money(unitNow) }}</b></span>
            </div>
          </div>
        </div>
      </article>

      <!-- photo + what it does -->
      <aside class="side">
        <div class="photo">
          <img v-if="photoOk" :src="photo" alt="" loading="lazy" @error="photoOk = false" />
          <span class="glass">
            <i></i>
            <span><b>{{ sel.name }}</b><small>One price, every quote and invoice</small></span>
          </span>
        </div>
        <ul class="feat" role="list">
          <li v-for="(f, i) in features" :key="f" :class="{ act: i === actFeat }">
            <span class="no">{{ i + 1 }}</span>{{ f }}
          </li>
        </ul>
        <button type="button" class="inv" :class="{ on: stockOn }" role="switch" :aria-checked="stockOn" @click="toggleStock">
          <span class="sw"><i></i></span>Show inventory availability
        </button>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "CatalogSection" });


const photo = "/saptivo/images/features/woman-in-yellow-sitting-in-shopping-cart-2026-01-08-02-01-06-utc (1).jpg";
const photoOk = ref(true);

const features = [
  "Products and services with SKU, description and images",
  "Categories, tags and price books",
  "Volume pricing tiers for wholesale customers",
  "Optional stock availability from the inventory module",
];

const products = reactive([
  { sku: "SOL-5K", name: "5 kW solar system", cat: "Solar", tone: "lav", price: 1450000, stock: 12, tags: ["Best seller", "On-grid"], desc: "Complete 5 kW rooftop system with panels, mounting and monitoring.", img: "", ok: true },
  { sku: "INV-HY5", name: "Hybrid inverter 5 kW", cat: "Solar", tone: "sky", price: 380000, stock: 24, tags: ["Hybrid", "5-year warranty"], desc: "Hybrid inverter with battery-ready input and a mobile app.", img: "", ok: true },
  { sku: "BAT-10", name: "Battery 10 kWh", cat: "Solar", tone: "mint", price: 690000, stock: 6, tags: ["Storage"], desc: "Lithium battery for night-time use and power cuts.", img: "", ok: true },
  { sku: "SRV-INS", name: "Installation", cat: "Services", tone: "butter", price: 250000, stock: null, tags: ["Service", "On site"], desc: "Site survey, installation and commissioning by our technicians.", img: "", ok: true },
  { sku: "SRV-AMC", name: "Annual maintenance", cat: "Services", tone: "rose", price: 150000, stock: null, tags: ["Contract", "12 visits"], desc: "Yearly service contract with scheduled visits and priority support.", img: "", ok: true },
  { sku: "MNT-RF", name: "Roof mounting kit", cat: "Accessories", tone: "sky", price: 45000, stock: 80, tags: ["Accessory"], desc: "Rails, clamps and fixings for tile and sheet roofs.", img: "", ok: true },
]);
const cats = ["All", "Solar", "Services", "Accessories"];

const cat = ref("All");
const book = ref("Retail");
const sel = ref(products[0]);
const qty = ref(1);
const stockOn = ref(false);
const manual = ref(false);

const shown = computed(() => (cat.value === "All" ? products : products.filter((p) => p.cat === cat.value)));

const tiers = [
  { from: 1, off: 0, label: "1 – 9" },
  { from: 10, off: 5, label: "10 – 49" },
  { from: 50, off: 10, label: "50 +" },
];
const tierIdx = computed(() => (qty.value >= 50 ? 2 : qty.value >= 10 ? 1 : 0));
// wholesale price book is 8% below retail; volume tiers come on top
function unit(p, q) {
  const bookPrice = book.value === "Wholesale" ? p.price * 0.92 : p.price;
  const t = q >= 50 ? tiers[2] : q >= 10 ? tiers[1] : tiers[0];
  return Math.round(bookPrice * (1 - t.off / 100));
}
const unitNow = computed(() => unit(sel.value, qty.value));
const money = (v) => "Rs " + v.toLocaleString("en-US");

const actFeat = computed(() => (stockOn.value ? 3 : qty.value > 1 ? 2 : book.value === "Wholesale" || cat.value !== "All" ? 1 : 0));

function pick(p) {
  manual.value = true;
  sel.value = p;
}
function pickCat(c) {
  manual.value = true;
  cat.value = c;
  if (!shown.value.includes(sel.value)) sel.value = shown.value[0];
}
function pickBook(b) {
  manual.value = true;
  book.value = b;
}
function setQty(v) {
  manual.value = true;
  qty.value = Math.max(1, Math.min(200, v));
}
function toggleStock() {
  manual.value = true;
  stockOn.value = !stockOn.value;
}

/* demo loop: walk through products, price books, tiers and stock */
let tick = 0;
function step() {
  if (manual.value) return;
  tick += 1;
  const p = tick % 12;
  if (p === 0) { cat.value = "All"; book.value = "Retail"; qty.value = 1; stockOn.value = false; sel.value = products[0]; }
  if (p === 2) sel.value = products[1];
  if (p === 3) cat.value = "Solar";
  if (p === 4) { sel.value = products[2]; }
  if (p === 5) { cat.value = "All"; sel.value = products[3]; }
  if (p === 6) { book.value = "Wholesale"; sel.value = products[0]; }
  if (p === 7) qty.value = 10;
  if (p === 8) qty.value = 50;
  if (p === 9) stockOn.value = true;
  if (p === 10) { sel.value = products[2]; qty.value = 1; }
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1600);
}
function halt() {
  live.value = false;
  if (st.timer !== null) {
    window.clearInterval(st.timer);
    st.timer = null;
  }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true;
    stockOn.value = true;
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) begin();
      else halt();
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  st.fallback = window.setTimeout(() => {
    if (!seen.value) seen.value = true;
  }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  halt();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.cg {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  --lav: #e8e3ff; --lav-d: #7d6be6;
  --sky: #dcecfb; --sky-d: #3f87c7;
  --butter: #fff1c9; --butter-d: #a77d00;
  --mint: #d3f0e1; --mint-d: #2f9c6b;
  --rose: #fde3ea; --rose-d: #d8567f;
  position: relative;
  overflow: clip;
  scroll-margin-top: 120px;
  padding: 140px 0 112px;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.cg *, .cg *::before, .cg *::after { box-sizing: border-box; }
.cg button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.lav { --t: var(--lav); --td: var(--lav-d); }
.sky { --t: var(--sky); --td: var(--sky-d); }
.mint { --t: var(--mint); --td: var(--mint-d); }
.butter { --t: var(--butter); --td: var(--butter-d); }
.rose { --t: var(--rose); --td: var(--rose-d); }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { width: min(620px, calc(100% - 40px)); margin: 26px auto 0; text-align: center; font-size: 16px; line-height: 1.75; color: var(--muted); }

.grid { width: min(1180px, calc(100% - 40px)); margin: 52px auto 0; display: grid; grid-template-columns: 1.4fr 0.8fr; gap: 24px; align-items: start; }

/* catalog card */
.card { padding: 22px; border-radius: 30px; background: #f8f7fb; border: 1px solid #efedf6; }
.card header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
.cats, .book { display: flex; padding: 3px; border-radius: 12px; background: #fff; border: 1px solid var(--line); flex-wrap: wrap; }
.cats button, .book button { padding: 7px 14px; border: 0; border-radius: 9px; background: none; cursor: pointer; font: 500 12.5px "Poppins", system-ui, sans-serif; color: #8a857f; transition: background 0.25s, color 0.25s; }
.cats button.on, .book button.on { background: var(--ink); color: #fff; }

.body { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
.prods { position: relative; list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.prod { position: relative; display: grid; grid-template-columns: auto 1fr auto; grid-template-areas: "th pn pp" "th stk stk"; align-items: center; gap: 2px 12px; width: 100%; padding: 10px 12px; border: 1px solid transparent; border-radius: 16px; background: #fff; cursor: pointer; text-align: left; font-family: inherit; color: var(--ink); transition: border-color 0.3s, box-shadow 0.3s; }
.prod:hover { border-color: #ddd6f2; }
.prod.sel { border-color: var(--td); box-shadow: 0 10px 24px -14px var(--td); }
.th { grid-area: th; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 13px; background: var(--t); overflow: hidden; }
.th img { width: 100%; height: 100%; object-fit: cover; }
.th.big { width: 54px; height: 54px; border-radius: 16px; }
.ini { font-size: 17px; font-weight: 600; color: var(--td); }
.pn { grid-area: pn; min-width: 0; }
.pn b { display: block; font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pn small { font-size: 11px; color: #a39d97; }
.pp { grid-area: pp; font-size: 12.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
.stk { grid-area: stk; justify-self: start; padding: 1px 8px; border-radius: 99px; background: var(--mint); color: #1d7a52; font-size: 10.5px; font-weight: 600; animation: pop 0.4s ease; }
.stk.low { background: var(--butter); color: var(--butter-d); }
.stk.none { background: #eeeae6; color: var(--muted); }
.pc-enter-active { transition: opacity 0.4s, transform 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
.pc-leave-active { position: absolute; left: 0; right: 0; transition: opacity 0.2s; }
.pc-enter-from { opacity: 0; transform: translateY(10px); }
.pc-leave-to { opacity: 0; }
.pc-move { transition: transform 0.45s ease; }

/* detail */
.detail { padding: 16px; border-radius: 22px; background: #fff; animation: pop 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
.dh { display: flex; align-items: center; gap: 12px; }
.dn b { display: block; font-size: 15px; font-weight: 500; }
.dn small { font-size: 11.5px; color: var(--muted); }
.desc { margin: 12px 0 8px; font-size: 12.5px; line-height: 1.6; color: var(--muted); }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 14px; }
.tags span { padding: 2px 10px; border-radius: 99px; background: var(--t); color: var(--ink); font-size: 10.5px; font-weight: 600; }
.cap { margin: 0 0 8px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.tiers { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.tiers li { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 11px; background: #f8f7fb; font-size: 12px; transition: background 0.3s; }
.tiers li b { font-weight: 600; font-variant-numeric: tabular-nums; }
.tiers li em { font-style: normal; font-size: 10.5px; font-weight: 600; color: var(--mint-d); min-width: 34px; text-align: right; }
.tiers li:not(:has(em)) { grid-template-columns: 1fr auto; }
.tiers li.on { background: var(--t); }
.qty { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--line); font-size: 12px; color: var(--muted); }
.step { display: inline-flex; align-items: center; gap: 8px; }
.step b { min-width: 28px; text-align: center; font-size: 14px; color: var(--ink); font-variant-numeric: tabular-nums; }
.step button { display: grid; place-items: center; width: 26px; height: 26px; border: 1px solid var(--line); border-radius: 50%; background: #fff; cursor: pointer; font: 500 14px "Poppins", system-ui, sans-serif; color: var(--ink); }
.step button:hover { background: #f3f0ec; }
.line b { display: inline-block; color: var(--ink); font-weight: 600; animation: bump 0.4s ease; }

/* side */
.side { display: grid; gap: 14px; }
.photo { position: relative; height: 260px; border-radius: 28px; overflow: hidden; background: linear-gradient(135deg, #e8e3ff 0%, #dcecfb 55%, #d3f0e1 100%); }
.photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 12%; }
.photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(232, 227, 255, 0.25) 0%, rgba(232, 227, 255, 0) 45%, rgba(20, 18, 15, 0.3) 100%); pointer-events: none; }
.glass { position: absolute; z-index: 1; left: 14px; right: 14px; bottom: 14px; display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-radius: 16px; background: rgba(255, 255, 255, 0.86); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 14px 30px -12px rgba(20, 18, 15, 0.4); }
.glass i { flex: none; width: 9px; height: 9px; border-radius: 50%; background: var(--mint-d); animation: blink 1.8s ease-in-out infinite; }
.cg:not(.live) .glass i { animation-play-state: paused; }
.glass b { display: block; font-size: 13px; font-weight: 600; }
.glass small { display: block; font-size: 11.5px; color: var(--muted); }
.feat { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.feat li { display: flex; align-items: flex-start; gap: 12px; padding: 11px 14px; border-radius: 16px; background: #f8f7fb; border: 1px solid transparent; font-size: 13.5px; line-height: 1.45; color: var(--muted); transition: background 0.35s, border-color 0.35s, color 0.35s; }
.no { flex: none; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #fff; font-size: 11px; font-weight: 600; transition: background 0.35s, color 0.35s; }
.feat li.act { background: #fff; border-color: var(--lav-d); color: var(--ink); }
.feat li.act .no { background: var(--ink); color: #fff; }
.inv { display: inline-flex; align-items: center; gap: 10px; justify-self: start; padding: 8px 16px 8px 9px; border: 1px solid var(--line); border-radius: 99px; background: #fff; cursor: pointer; font: 500 12.5px "Poppins", system-ui, sans-serif; color: var(--ink); transition: background 0.3s; }
.inv.on { background: var(--mint); border-color: transparent; }
.sw { position: relative; width: 30px; height: 18px; border-radius: 99px; background: #ddd8d3; transition: background 0.3s; }
.sw i { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform 0.3s; }
.inv.on .sw { background: var(--mint-d); }
.inv.on .sw i { transform: translateX(12px); }

@keyframes pop { from { opacity: 0; transform: translateY(6px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes bump { from { transform: translateY(-3px); opacity: 0.4; } to { transform: none; opacity: 1; } }

/* entrance (runs once) */
.cg:not(.in) .lead, .cg:not(.in) .grid { opacity: 0; }
.cg.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.cg.in .title .soft { animation-delay: 0.1s; }
.cg.in .lead { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.cg.in .grid { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 1000px) {
  .grid { grid-template-columns: 1fr; }
  .photo { height: 240px; }
}
@media (max-width: 640px) {
  .cg { padding: 92px 0 72px; }
  .card { padding: 14px; border-radius: 24px; }
  .body { grid-template-columns: 1fr; }
  .photo { border-radius: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .cg *, .cg *::before, .cg *::after { animation: none !important; transition: none !important; }
  .cg:not(.in) .lead, .cg:not(.in) .grid { opacity: 1; }
}
</style>
