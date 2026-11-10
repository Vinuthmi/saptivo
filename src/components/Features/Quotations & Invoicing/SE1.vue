<template>
  <section id="quote-builder" ref="root" class="qb" :class="{ in: seen, live }" aria-labelledby="qb-title">
    <h2 id="qb-title" class="title">
      <span>A quote builder your</span>
      <span class="soft">sales team will actually use</span>
    </h2>
    <p class="lead">Every quotation is a polished PDF with your logo, colours and company details.</p>

    <div class="grid">
      <!-- left: photo + what it does -->
      <div class="left">
        <div class="photo">
          <template v-for="(src, i) in photos" :key="src">
            <img v-if="ok[i]" :src="src" alt="" loading="lazy" :class="{ on: i === photoIdx }" @error="ok[i] = false" />
          </template>
          <span class="glass">
            <i :class="{ done: step >= 9 }"></i>
            <span><b>Quotation QT-1042</b><small>{{ step >= 9 ? 'PDF ready to send' : 'Draft · ABC Solar' }}</small></span>
          </span>
        </div>

        <ul class="feat" role="list">
          <li v-for="(f, i) in features" :key="f" :class="{ act: i === activeFeat, past: step > lastStep[i] }">
            <button type="button" :aria-current="i === activeFeat ? 'true' : undefined" @click="jump(i)">
              <span class="tk" aria-hidden="true">✓</span>
              <span class="tx">{{ f }}</span>
            </button>
          </li>
        </ul>
      </div>

      <!-- right: builder -->
      <article class="card" aria-label="Quote builder example">
        <header>
          <div class="hd"><b>New quotation</b><small>ABC Solar (Pvt) Ltd · Nimal Perera</small></div>
          <div class="cur" role="group" aria-label="Currency">
            <span :class="{ on: cur === 'LKR' }">LKR</span>
            <span :class="{ on: cur === 'USD' }">USD</span>
          </div>
        </header>

        <div class="catalog">
          <p class="cap">Catalog · correct prices</p>
          <ul>
            <li v-for="(c, i) in catalog" :key="c.name" :class="{ added: step > i }">{{ c.name }}<em>{{ c.kind }}</em></li>
          </ul>
        </div>

        <TransitionGroup name="line" tag="ul" class="lines">
          <li v-for="c in lines" :key="c.name">
            <span class="ln"><b>{{ c.name }}</b><small>{{ c.kind }} · qty 1</small></span>
            <span class="lp">{{ fmt(c.price) }}</span>
          </li>
        </TransitionGroup>
        <p v-if="!lines.length" class="empty">Add products and services from your catalog</p>

        <dl class="tot">
          <div><dt>Subtotal</dt><dd>{{ fmt(sub) }}</dd></div>
          <div class="disc" :class="{ on: pct > 0 }">
            <dt>Discount <b>{{ Math.round(pct * 100) }}%</b></dt>
            <dd>−{{ fmt(discount) }}</dd>
          </div>
          <div v-if="approval" class="appr" :class="approval">
            <span class="dot"></span>
            <template v-if="approval === 'pending'">Over 10%: waiting for manager approval</template>
            <template v-else>Approved by Kasun (Sales manager)</template>
          </div>
          <div class="tax" :class="{ flash: step === 4 }"><dt>VAT 18%</dt><dd>{{ fmt(vat) }}</dd></div>
          <div class="grand"><dt>Total</dt><dd :key="total + cur">{{ cur }} {{ fmt(total) }}</dd></div>
        </dl>

        <p class="terms" :class="{ on: step >= 9 }">
          <span class="pdf">PDF</span>
          Valid for 14 days · 50% advance, balance on delivery · your logo and colours
        </p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "QuoteBuilderSection" });

// Photos live in public/images/features/ (file names are case sensitive).
// A missing file just shows the pastel gradient.
const base = "/saptivo/images/features/";
const photos = [
  base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
  base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
];
const ok = ref(photos.map(() => true));

const features = [
  "Add products and services from your catalog with correct prices",
  "Apply line or total discounts, with approval rules for large discounts",
  "VAT and other taxes calculated automatically",
  "Quote in LKR, USD or any configured currency",
  "Terms, validity period and payment conditions set by default",
];
// the demo step at which each feature is shown, and where it ends
const firstStep = [1, 5, 4, 8, 9];
const lastStep = [3, 7, 4, 8, 10];

const catalog = [
  { name: "5 kW solar system", kind: "Product", price: 1450000 },
  { name: "Hybrid inverter", kind: "Product", price: 380000 },
  { name: "Installation", kind: "Service", price: 250000 },
];

// the whole builder is derived from one step number (0 to 10), so it can never get out of sync
const step = ref(0);
const manual = ref(false);

const lines = computed(() => catalog.slice(0, Math.min(step.value, 3)));
const pct = computed(() => (step.value >= 6 ? 0.15 : step.value >= 5 ? 0.05 : 0));
const approval = computed(() => (step.value === 6 ? "pending" : step.value >= 7 ? "ok" : ""));
const cur = computed(() => (step.value === 8 || step.value === 9 ? "USD" : "LKR"));
const RATE = 300; // example rate only
const sub = computed(() => lines.value.reduce((s, c) => s + c.price, 0));
const discount = computed(() => sub.value * pct.value);
const vat = computed(() => (sub.value - discount.value) * 0.18);
const total = computed(() => sub.value - discount.value + vat.value);

function fmt(v) {
  const x = cur.value === "USD" ? v / RATE : v;
  return Math.round(x).toLocaleString("en-US");
}

const activeFeat = computed(() => {
  const s = step.value;
  if (s >= 9) return 4;
  if (s === 8) return 3;
  if (s >= 5) return 1;
  if (s === 4) return 2;
  if (s >= 1) return 0;
  return -1;
});
const photoIdx = computed(() => (step.value >= 5 ? 1 : 0));

function jump(i) {
  manual.value = true;
  step.value = firstStep[i];
}

/* demo loop: 11 steps */
let tick = 0;
function advance() {
  if (manual.value) return;
  tick += 1;
  step.value = tick % 11;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(advance, 1500);
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
    step.value = 7; // a finished quote, no animation
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
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600&display=swap");

.qb {
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
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Urbanist", system-ui, sans-serif;
}
.qb *, .qb *::before, .qb *::after { box-sizing: border-box; }
.qb button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { width: min(620px, calc(100% - 40px)); margin: 26px auto 0; text-align: center; font-size: 16px; line-height: 1.75; color: var(--muted); }

.grid { width: min(1180px, calc(100% - 40px)); margin: 52px auto 0; display: grid; grid-template-columns: 0.92fr 1.08fr; gap: 28px; align-items: start; }
.left { display: grid; gap: 18px; }

/* photo */
.photo { position: relative; height: 290px; border-radius: 28px; overflow: hidden; background: linear-gradient(135deg, #e8e3ff 0%, #dcecfb 55%, #d3f0e1 100%); }
.photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; opacity: 0; transition: opacity 0.9s ease; }
.photo img.on { opacity: 1; }
.photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(232, 227, 255, 0.3) 0%, rgba(232, 227, 255, 0) 40%, rgba(20, 18, 15, 0.28) 100%); pointer-events: none; }
.glass { position: absolute; z-index: 1; left: 16px; bottom: 16px; display: flex; align-items: center; gap: 12px; padding: 11px 18px 11px 14px; border-radius: 18px; background: rgba(255, 255, 255, 0.86); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 14px 30px -12px rgba(20, 18, 15, 0.4); }
.glass i { flex: none; width: 10px; height: 10px; border-radius: 50%; background: var(--butter-d); transition: background 0.4s; }
.glass i.done { background: var(--mint-d); }
.glass b { display: block; font-size: 13px; font-weight: 600; }
.glass small { display: block; font-size: 11.5px; color: var(--muted); }

/* feature list */
.feat { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.feat button { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; border: 1px solid transparent; border-radius: 16px; background: #f8f7fb; cursor: pointer; text-align: left; font: 500 14px/1.45 "Poppins", system-ui, sans-serif; color: var(--muted); transition: background 0.35s, border-color 0.35s, color 0.35s; }
.tk { flex: none; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #fff; color: #c9c2bb; font-size: 11px; transition: background 0.35s, color 0.35s; }
.feat li.past button { color: var(--ink); }
.feat li.past .tk { background: var(--mint); color: #1d7a52; }
.feat li.act button { background: #fff; border-color: var(--lav-d); color: var(--ink); box-shadow: 0 10px 24px -14px rgba(125, 107, 230, 0.5); }
.feat li.act .tk { background: var(--ink); color: #fff; }

/* builder card */
.card { padding: 24px; border-radius: 30px; background: #f4f8fd; border: 1px solid #e3edf8; }
.card header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.hd b { display: block; font-size: 16px; font-weight: 500; }
.hd small { font-size: 12px; color: var(--muted); }
.cur { display: flex; padding: 3px; border-radius: 10px; background: #fff; border: 1px solid var(--line); }
.cur span { padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; color: #8a857f; transition: background 0.3s, color 0.3s; }
.cur span.on { background: var(--ink); color: #fff; }

.cap { margin: 0 0 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.catalog ul { list-style: none; margin: 0 0 16px; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.catalog li { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 99px; background: #fff; border: 1px solid var(--line); font-size: 12.5px; transition: background 0.4s, border-color 0.4s, color 0.4s; }
.catalog em { font-style: normal; font-size: 10px; font-weight: 600; color: var(--sky-d); }
.catalog li.added { background: var(--sky); border-color: transparent; }

.lines { position: relative; list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; min-height: 60px; }
.lines li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 14px; border-radius: 14px; background: #fff; }
.ln b { display: block; font-size: 13.5px; font-weight: 500; }
.ln small { font-size: 11.5px; color: var(--muted); }
.lp { font-size: 13.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
.empty { margin: 0; padding: 14px; border: 1.5px dashed #cfe0f1; border-radius: 14px; text-align: center; font-size: 12.5px; color: #8a9db3; }
.line-enter-active { transition: opacity 0.4s, transform 0.45s cubic-bezier(0.3, 1.3, 0.5, 1); }
.line-leave-active { position: absolute; left: 0; right: 0; transition: opacity 0.25s; }
.line-enter-from { opacity: 0; transform: translateX(-16px); }
.line-leave-to { opacity: 0; }

.tot { margin: 16px 0 0; padding: 14px 16px; border-radius: 18px; background: #fff; display: grid; gap: 8px; }
.tot > div { display: flex; justify-content: space-between; gap: 12px; align-items: center; font-size: 13px; }
.tot dt { color: var(--muted); }
.tot dd { margin: 0; font-weight: 500; font-variant-numeric: tabular-nums; }
.tot dt b { margin-left: 6px; padding: 1px 8px; border-radius: 99px; background: #f3f0ec; font-size: 11px; transition: background 0.3s, color 0.3s; }
.disc.on dt b { background: var(--butter); color: var(--butter-d); }
.disc.on dd { color: var(--rose-d); }
.appr { justify-content: flex-start !important; gap: 10px !important; padding: 8px 12px; border-radius: 12px; font-size: 12px !important; font-weight: 500; animation: pop 0.45s ease; }
.appr .dot { width: 8px; height: 8px; border-radius: 50%; }
.appr.pending { background: var(--butter); color: var(--butter-d); }
.appr.pending .dot { background: var(--butter-d); animation: blink 1.2s ease-in-out infinite; }
.appr.ok { background: var(--mint); color: #1d7a52; }
.appr.ok .dot { background: var(--mint-d); }
.qb:not(.live) .appr .dot { animation-play-state: paused; }
.tax { padding: 4px 0; border-radius: 8px; transition: background 0.4s; }
.tax.flash { background: var(--lav); animation: pop 0.5s ease; margin: 0 -8px; padding: 4px 8px; }
.grand { padding-top: 10px; border-top: 1px dashed var(--line); font-size: 15px !important; }
.grand dt { color: var(--ink); font-weight: 500; }
.grand dd { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; animation: bump 0.45s ease; }

.terms { display: flex; align-items: center; gap: 10px; margin: 14px 0 0; padding: 10px 14px; border-radius: 14px; background: rgba(255, 255, 255, 0.6); font-size: 12px; line-height: 1.5; color: var(--muted); transition: background 0.4s, color 0.4s; }
.terms.on { background: var(--mint); color: #1d5f43; }
.pdf { flex: none; padding: 3px 8px; border-radius: 7px; background: var(--rose); color: var(--rose-d); font-size: 10.5px; font-weight: 700; }

@keyframes pop { from { opacity: 0; transform: translateY(6px) scale(0.97); } to { opacity: 1; transform: none; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes bump { from { transform: translateY(-3px); opacity: 0.5; } to { transform: none; opacity: 1; } }

/* entrance (runs once) */
.qb:not(.in) .lead, .qb:not(.in) .grid { opacity: 0; }
.qb.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.qb.in .title .soft { animation-delay: 0.1s; }
.qb.in .lead { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.qb.in .grid { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr; }
  .photo { height: 240px; }
}
@media (max-width: 560px) {
  .qb { padding: 72px 0; }
  .card { padding: 16px; border-radius: 24px; }
  .photo { border-radius: 24px; }
  .feat button { padding: 11px 12px; font-size: 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .qb *, .qb *::before, .qb *::after { animation: none !important; transition: none !important; }
  .qb:not(.in) .lead, .qb:not(.in) .grid { opacity: 1; }
}
</style>
