<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "HowInventoryWorksSection" });

const root = ref(null);
const shown = ref(false);
const active = ref(-1);
const avOk = ref(true);
let io = null;
let reduce = false;

const photo = "/saptivo/images/features/smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";

const steps = [
  "Add products to the catalog with SKU, price and reorder level",
  "Set opening stock for each warehouse, branch and van",
  "Sell, transfer or use stock on jobs, and Saptivo updates quantities automatically",
  "Receive alerts when items fall below their reorder level",
  "Review stock reports by location before each purchase run",
];

const stock = [
  { n: "Head office", q: 120, tone: "lav" },
  { n: "Colombo", q: 46, tone: "mint" },
  { n: "Van 07", q: 3, tone: "butter" },
];
const bars = [
  { n: "Head office", w: 92 },
  { n: "Colombo", w: 48 },
  { n: "Galle", w: 22 },
];

/* Scroll-driven: the step is decided by where each card sits in the viewport.
   Scrolling down advances the steps, scrolling up steps back. */
let ticking = false;
function update() {
  if (!root.value) return;
  const items = root.value.querySelectorAll(".tl > li");
  if (!items.length) return;
  const h = window.innerHeight;
  let a = -1;
  items.forEach((el, i) => {
    if (el.getBoundingClientRect().top < h * 0.62) a = i;
  });
  const last = items[items.length - 1].getBoundingClientRect();
  if (last.bottom < h * 0.6) a = items.length;
  active.value = a;
}
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    update();
  });
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    active.value = steps.length;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) shown.value = true;
    },
    { threshold: 0.1 }
  );
  io.observe(root.value);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">How inventory works</span> <span class="l2">in Saptivo</span></h2>
      </header>

      <ol class="tl" role="list">
        <li
          v-for="(s, i) in steps"
          :key="s"
          :class="[i % 2 ? 'r' : 'l', { on: active >= i, done: active > i, cur: active === i }]"
        >
          <span class="node">
            <svg v-if="active > i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
            <template v-else>{{ i + 1 }}</template>
          </span>

          <div class="card">
            <p class="tx">{{ s }}</p>

            <!-- 1 catalog -->
            <div v-if="i === 0" class="v cat">
              <div><small>SKU</small><b>AP-X2</b></div>
              <div><small>Price</small><b>LKR 68,500</b></div>
              <div class="hl"><small>Reorder level</small><b>20</b></div>
            </div>

            <!-- 2 opening stock -->
            <div v-else-if="i === 1" class="v ops">
              <span v-for="l in stock" :key="l.n" :class="'tone-' + l.tone"><i>{{ l.n }}</i><b>{{ l.q }}</b></span>
            </div>

            <!-- 3 movements -->
            <div v-else-if="i === 2" class="v mov">
              <span class="m1"><i>Sold</i><b>−1</b></span>
              <span class="m2"><i>Transferred</i><b>30</b></span>
              <span class="m3"><i>Used on job</i><b>−1</b></span>
              <em>Quantities update automatically</em>
            </div>

            <!-- 4 alert -->
            <div v-else-if="i === 3" class="v alr">
              <span class="av">
                <img v-if="avOk" :src="photo" alt="" @error="avOk = false" />
                <b v-else>N</b>
              </span>
              <div>
                <strong>Low stock · Air purifier X2</strong>
                <small>17 left, below the reorder level of 20</small>
              </div>
              <span class="bell">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10.3 20a1.94 1.94 0 0 0 3.4 0" /></svg>
              </span>
            </div>

            <!-- 5 report -->
            <div v-else class="v rep">
              <ul>
                <li v-for="b in bars" :key="b.n">
                  <span>{{ b.n }}</span>
                  <div><i :style="{ width: active >= 4 ? b.w + '%' : '0%' }"></i></div>
                </li>
              </ul>
              <span class="run">Purchase run</span>
            </div>
          </div>
        </li>
      </ol>

    </div>
  </section>
</template>

<style scoped>
.hw {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1040px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 56px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }

.tl { list-style: none; margin: 0; padding: 0; }
.tl li { position: relative; display: grid; grid-template-columns: 1fr 64px 1fr; padding: 14px 0; }
.tl li::before { content: ""; position: absolute; left: 50%; top: 0; bottom: 0; width: 3px; margin-left: -1.5px; background: #e7e3f4; transition: background .6s; }
.tl li:first-child::before { top: 38px; }
.tl li:last-child::before { bottom: auto; height: 38px; }
.tl li.done::before { background: var(--mint-i); }

.node { grid-column: 2; grid-row: 1; justify-self: center; position: relative; z-index: 1; width: 44px; height: 44px; margin-top: 4px; border-radius: 50%; display: grid; place-items: center; font-size: 15px; font-weight: 700; background: #fff; color: #a29fb2; border: 2px solid #e3dff2; transition: all .5s; }
.node svg { width: 20px; height: 20px; }
.tl li.on .node { border-color: var(--lav-i); color: var(--lav-i); }
.tl li.cur .node { background: var(--ink); border-color: var(--ink); color: #fff; box-shadow: 0 0 0 7px rgba(20, 18, 15, .1); }
.tl li.done .node { background: var(--mint-i); border-color: var(--mint-i); color: #fff; }

.card { grid-row: 1; background: #faf9ff; border: 1.5px solid var(--line); border-radius: 26px; padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; opacity: .35; transform: translateY(14px); transition: all .7s cubic-bezier(.3, .8, .3, 1); min-width: 0; }
.tl li.l .card { grid-column: 1; margin-right: 22px; }
.tl li.r .card { grid-column: 3; margin-left: 22px; }
.tl li.on .card { opacity: 1; transform: none; background: #fff; box-shadow: 0 20px 44px rgba(60, 50, 120, .1); }
.tl li.cur .card { border-color: var(--lav-i); }
.tx { margin: 0; font-size: 15px; font-weight: 500; line-height: 1.6; }

.v { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.tl li.on .v > * { animation: up .5s ease both; }
.tl li.on .v > *:nth-child(2) { animation-delay: .1s; }
.tl li.on .v > *:nth-child(3) { animation-delay: .2s; }
.tl li.on .v > *:nth-child(4) { animation-delay: .3s; }
@keyframes up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.cat > div { background: #f6f4ff; border-radius: 14px; padding: 8px 14px; display: flex; flex-direction: column; }
.cat small { font-size: 10.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.cat b { font-size: 14px; }
.cat .hl { background: var(--rose); }
.cat .hl small { color: var(--rose-i); }
.cat .hl b { color: var(--rose-i); }

.ops span { display: flex; flex-direction: column; padding: 8px 16px; border-radius: 14px; background: var(--t); color: var(--ti); }
.ops i { font-style: normal; font-size: 11px; font-weight: 600; }
.ops b { font-size: 22px; font-weight: 600; letter-spacing: -.02em; }

.mov span { display: flex; align-items: baseline; gap: 8px; padding: 8px 14px; border-radius: 99px; font-size: 12px; }
.mov i { font-style: normal; font-weight: 600; }
.mov b { font-variant-numeric: tabular-nums; }
.m1 { background: var(--sky); color: var(--sky-i); }
.m2 { background: var(--lav); color: var(--lav-i); }
.m3 { background: var(--butter); color: var(--butter-i); }
.mov em { width: 100%; font-style: normal; font-size: 12px; color: var(--mint-i); font-weight: 600; }

.alr { flex-wrap: nowrap; background: #fff6f8; border: 1px solid var(--rose); border-radius: 18px; padding: 12px 14px; }
.alr > div { flex: 1; min-width: 0; }
.alr strong { display: block; font-size: 13px; }
.alr small { font-size: 11.5px; color: var(--muted); }
.av { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.bell { width: 32px; height: 32px; border-radius: 50%; background: var(--rose); color: var(--rose-i); display: grid; place-items: center; flex: none; }
.tl li.cur .bell { animation: ring 1.2s ease 2; }
.bell svg { width: 16px; height: 16px; }
@keyframes ring { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(16deg); } 50% { transform: rotate(-14deg); } 75% { transform: rotate(8deg); } }

.rep { flex-wrap: nowrap; gap: 16px; align-items: flex-end; }
.rep ul { list-style: none; margin: 0; padding: 0; flex: 1; display: flex; flex-direction: column; gap: 8px; }
.rep li { display: grid; grid-template-columns: 76px 1fr; gap: 10px; align-items: center; font-size: 11.5px; color: var(--muted); }
.rep li div { height: 10px; border-radius: 99px; background: #f1eff8; overflow: hidden; }
.rep li i { display: block; height: 100%; border-radius: 99px; background: var(--lav-i); transition: width 1s cubic-bezier(.3, .8, .3, 1) .2s; }
.run { flex: none; font-size: 12px; font-weight: 600; padding: 9px 16px; border-radius: 99px; background: var(--ink); color: #fff; }

@media (max-width: 760px) {
  .tl li { grid-template-columns: 48px 1fr; }
  .tl li::before { left: 22px; }
  .node { grid-column: 1; justify-self: start; }
  .tl li.l .card, .tl li.r .card { grid-column: 2; margin: 0 0 0 12px; }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .card { padding: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .tl li.on .v > *, .tl li.cur .bell { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
