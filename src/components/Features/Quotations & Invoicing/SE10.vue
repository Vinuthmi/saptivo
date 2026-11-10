<template>
  <section id="who-uses-quotes" ref="root" class="wq" :class="{ in: seen, live }" aria-labelledby="wq-title">
    <h2 id="wq-title" class="title">
      <span>Who uses quotation and</span>
      <span class="soft">invoice software in Saptivo</span>
    </h2>

    <div class="grid">
      <!-- audiences -->
      <div class="tabs" role="tablist" aria-label="Who uses it" aria-orientation="vertical">
        <button v-for="(a, i) in audiences" :key="a.id" type="button" role="tab" class="tab" :class="[a.tone, { act: i === active, run: !manual }]" :aria-selected="i === active" :tabindex="i === active ? 0 : -1" @click="pick(i)" @keydown.down.prevent="pick((i + 1) % audiences.length)" @keydown.up.prevent="pick((i + audiences.length - 1) % audiences.length)">
          <span class="th">
            <img v-if="ok[i]" :src="a.photo" alt="" loading="lazy" @error="ok[i] = false" />
            <span v-else class="ini">{{ a.name.slice(0, 1) }}</span>
          </span>
          <span class="tx"><b>{{ a.name }}</b><small>{{ a.blurb }}</small></span>
          <span class="bar"><i :key="active + String(i === active)"></i></span>
        </button>
      </div>

      <!-- the same builder, configured -->
      <div class="panel" :class="cur.tone" role="tabpanel">
        <div class="head">
          <template v-for="(a, i) in audiences" :key="a.id">
            <img v-if="ok[i]" :src="a.photo" alt="" :class="{ on: i === active }" />
          </template>
          <span class="glass"><i></i><span><b>{{ cur.doc.title }}</b><small>Same quote builder</small></span></span>
        </div>

        <Transition name="swap" mode="out-in">
          <div :key="cur.id" class="doc">
            <div class="dh">
              <b>{{ cur.doc.customer }}</b>
              <span class="tag">{{ cur.doc.tag }}</span>
            </div>

            <ul class="lines">
              <li v-for="(l, k) in cur.doc.lines" :key="l.n" :style="{ '--k': k }">
                <span class="ln"><b>{{ l.n }}</b><small>{{ l.sub }}</small></span>
                <span class="amt">{{ money(l.amt) }}</span>
              </li>
            </ul>

            <dl class="tot">
              <div><dt>Subtotal</dt><dd>{{ money(sub) }}</dd></div>
              <div><dt>{{ cur.doc.tax }}</dt><dd>{{ money(vat) }}</dd></div>
              <div class="g"><dt>Total</dt><dd>{{ money(sub + vat) }}</dd></div>
            </dl>
          </div>
        </Transition>

        <div class="cfg">
          <p class="cap">The same builder, configured for their</p>
          <ul>
            <li><small>Products</small><b>{{ cur.cfg.products }}</b></li>
            <li><small>Taxes</small><b>{{ cur.cfg.taxes }}</b></li>
            <li><small>Terms</small><b>{{ cur.cfg.terms }}</b></li>
          </ul>
        </div>
      </div>
    </div>

    <p class="close">Each uses the same quote builder, configured for their products, taxes and terms.</p>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "WhoUsesQuotesSection" });

// Photos live in public/images/features/ (file names are case sensitive). Missing file = pastel tile.
const base = "/saptivo/images/features/";

const audiences = [
  {
    id: "dist", tone: "lav", name: "Distributors", blurb: "Quoting large orders from price books",
    photo: base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg",
    doc: { title: "Distributor order", customer: "Lanka Hardware Wholesale", tag: "Wholesale price book", tax: "VAT 18%",
      lines: [
        { n: "Cement 50 kg", sub: "500 bags · volume tier −10%", amt: 832500 },
        { n: "Roofing sheets", sub: "200 sheets · volume tier −8%", amt: 772800 },
        { n: "Steel bars 12 mm", sub: "120 pcs · wholesale price", amt: 540000 },
      ] },
    cfg: { products: "Price books and volume tiers", taxes: "VAT 18%", terms: "Net 30 days" },
  },
  {
    id: "con", tone: "mint", name: "Contractors", blurb: "Quoting projects with milestones",
    photo: base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
    doc: { title: "Project quotation", customer: "Kandy Textiles · new warehouse roof", tag: "Milestone billing", tax: "VAT 18%",
      lines: [
        { n: "Milestone 1 · Advance", sub: "30% on acceptance", amt: 960000 },
        { n: "Milestone 2 · Roof frame done", sub: "40% on completion", amt: 1280000 },
        { n: "Milestone 3 · Handover", sub: "30% after inspection", amt: 960000 },
      ] },
    cfg: { products: "Project items and labour", taxes: "VAT 18%", terms: "Pay by milestone" },
  },
  {
    id: "svc", tone: "butter", name: "Service companies", blurb: "Billing jobs and AMC contracts",
    photo: base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG",
    doc: { title: "Job and AMC invoice", customer: "ABC Solar · job J-0418", tag: "Job + AMC contract", tax: "VAT 18%",
      lines: [
        { n: "Inverter repair", sub: "Labour 3 h + parts", amt: 68000 },
        { n: "Site call-out", sub: "Kandy · technician visit", amt: 12000 },
        { n: "Annual maintenance (AMC)", sub: "12 visits · billed yearly", amt: 150000 },
      ] },
    cfg: { products: "Labour, parts and AMC plans", taxes: "VAT 18%", terms: "Bill on job completion" },
  },
  {
    id: "ret", tone: "sky", name: "Retailers", blurb: "Issuing invoices for corporate customers",
    photo: base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
    doc: { title: "Corporate invoice", customer: "Ceylon Motors (Pvt) Ltd · PO 5521", tag: "Tax invoice", tax: "VAT 18%",
      lines: [
        { n: "Office chairs", sub: "24 units · corporate price", amt: 312000 },
        { n: "Standing desks", sub: "12 units", amt: 420000 },
        { n: "Delivery and set-up", sub: "Colombo office", amt: 25000 },
      ] },
    cfg: { products: "Retail catalog, corporate prices", taxes: "VAT 18%", terms: "Net 14 days, PO number" },
  },
];
const ok = ref(audiences.map(() => true));

const active = ref(0);
const manual = ref(false);
const cur = computed(() => audiences[active.value]);
const sub = computed(() => cur.value.doc.lines.reduce((s, l) => s + l.amt, 0));
const vat = computed(() => Math.round(sub.value * 0.18));
const money = (v) => "Rs " + v.toLocaleString("en-US");

function pick(i) {
  manual.value = true; // the visitor chose; stop rotating
  active.value = i;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function step() {
  if (manual.value) return;
  active.value = (active.value + 1) % audiences.length;
}
function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 4400);
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

.wq {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.wq *, .wq *::before, .wq *::after { box-sizing: border-box; }
.wq button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

.lav { --bg: #f1eeff; --mid: #ddd6ff; --deep: #7d6be6; }
.mint { --bg: #eaf8f0; --mid: #c9ecd9; --deep: #2f9c6b; }
.butter { --bg: #fff6dc; --mid: #fde9a8; --deep: #a77d00; }
.sky { --bg: #eaf4fd; --mid: #cfe4f8; --deep: #3f87c7; }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }

.grid { width: min(1180px, calc(100% - 40px)); margin: 52px auto 0; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 24px; align-items: stretch; }

/* tabs */
.tabs { display: grid; gap: 12px; align-content: start; }
.tab { position: relative; overflow: hidden; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 16px; padding: 16px 18px; border: 1px solid transparent; border-radius: 24px; background: var(--bg); cursor: pointer; text-align: left; font-family: inherit; color: var(--ink); opacity: 0.78; transition: opacity 0.35s, border-color 0.35s, box-shadow 0.35s, transform 0.35s; }
.tab:hover { opacity: 1; }
.tab.act { opacity: 1; border-color: var(--deep); box-shadow: 0 16px 34px -18px var(--deep); transform: translateX(4px); }
.th { display: grid; place-items: center; width: 58px; height: 58px; border-radius: 18px; background: var(--mid); overflow: hidden; }
.th img { width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.ini { font-size: 20px; font-weight: 600; color: var(--deep); }
.tx b { display: block; font-size: 16px; font-weight: 500; letter-spacing: -0.01em; }
.tx small { display: block; margin-top: 2px; font-size: 13px; line-height: 1.45; color: var(--muted); }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; }
.bar i { display: block; height: 100%; width: 0; background: var(--deep); }
.tab.act .bar i { width: 100%; }
.tab.act.run .bar i { animation: fill 4.4s linear; }
.wq:not(.live) .tab.act.run .bar i { animation-play-state: paused; }

/* panel */
.panel { display: flex; flex-direction: column; gap: 14px; padding: 16px; border-radius: 32px; background: var(--bg); transition: background 0.6s; }
.head { position: relative; height: 190px; border-radius: 22px; overflow: hidden; background: linear-gradient(135deg, #e8e3ff 0%, #dcecfb 55%, #d3f0e1 100%); }
.head img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 28%; opacity: 0; transition: opacity 0.9s ease; }
.head img.on { opacity: 1; }
.head::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 45%, rgba(20, 18, 15, 0.35) 100%); pointer-events: none; }
.glass { position: absolute; z-index: 1; left: 14px; bottom: 14px; display: flex; align-items: center; gap: 12px; padding: 10px 16px 10px 13px; border-radius: 16px; background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 14px 30px -12px rgba(20, 18, 15, 0.4); }
.glass i { flex: none; width: 9px; height: 9px; border-radius: 50%; background: var(--deep); animation: blink 1.8s ease-in-out infinite; }
.wq:not(.live) .glass i { animation-play-state: paused; }
.glass b { display: block; font-size: 13px; font-weight: 600; }
.glass small { display: block; font-size: 11.5px; color: var(--muted); }

.doc { padding: 18px; border-radius: 22px; background: #fff; min-height: 250px; }
.dh { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
.dh b { font-size: 14.5px; font-weight: 500; }
.tag { padding: 3px 12px; border-radius: 99px; background: var(--mid); font-size: 11px; font-weight: 600; }
.lines { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.lines li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 9px 12px; border-radius: 12px; background: var(--bg); animation: pop 0.45s ease calc(var(--k) * 0.1s) backwards; }
.ln b { display: block; font-size: 13px; font-weight: 500; }
.ln small { font-size: 11.5px; color: var(--muted); }
.amt { font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
.tot { margin: 12px 0 0; display: grid; gap: 6px; }
.tot > div { display: flex; justify-content: space-between; font-size: 12.5px; }
.tot dt { color: var(--muted); }
.tot dd { margin: 0; font-weight: 500; font-variant-numeric: tabular-nums; }
.tot .g { padding-top: 8px; border-top: 1px dashed var(--line); font-size: 15px; }
.tot .g dt { color: var(--ink); font-weight: 500; }
.tot .g dd { font-weight: 600; }

.cfg { padding: 14px 16px; border-radius: 20px; background: rgba(255, 255, 255, 0.7); }
.cap { margin: 0 0 10px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.cfg ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.cfg li { display: grid; gap: 2px; padding: 10px 12px; border-radius: 14px; background: #fff; }
.cfg small { font-size: 10.5px; color: #a39d97; }
.cfg b { font-size: 12.5px; font-weight: 500; line-height: 1.35; }

.swap-enter-active { transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
.swap-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.swap-enter-from { opacity: 0; transform: translateY(12px); }
.swap-leave-to { opacity: 0; transform: translateY(-8px); }

.close { width: min(760px, calc(100% - 40px)); margin: 36px auto 0; text-align: center; font-size: 17px; font-weight: 500; line-height: 1.65; letter-spacing: -0.01em; }

@keyframes fill { from { width: 0; } to { width: 100%; } }
@keyframes pop { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* entrance (runs once) */
.wq:not(.in) .grid, .wq:not(.in) .close { opacity: 0; }
.wq.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.wq.in .title .soft { animation-delay: 0.1s; }
.wq.in .grid { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s backwards; }
.wq.in .close { animation: rise 0.8s ease 0.6s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr; }
  .tabs { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .wq { padding: 72px 0; }
  .tabs { grid-template-columns: 1fr; }
  .tab.act { transform: none; }
  .panel { padding: 12px; border-radius: 24px; }
  .head { height: 160px; }
  .cfg ul { grid-template-columns: 1fr; }
  .close { font-size: 15.5px; }
}
@media (prefers-reduced-motion: reduce) {
  .wq *, .wq *::before, .wq *::after { animation: none !important; transition: none !important; }
  .wq:not(.in) .grid, .wq:not(.in) .close { opacity: 1; }
}
</style>
