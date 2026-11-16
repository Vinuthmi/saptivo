<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhoUsesInventorySection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
const manual = ref(false);
const ok = ref([true, true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";

const who = [
  {
    n: "Retail chains",
    d: "Balancing stock between stores",
    tone: "mint",
    photo: base + "woman-checking-in-at-hotel-reception-desk-2026-09-23-00-07-03-utc.webp",
  },
  {
    n: "Distributors",
    d: "Holding goods in several warehouses",
    tone: "lav",
    photo: base + "smiling-couple-opening-a-cardboard-delivery-box-at-2026-11-02-15-44-20-utc.webp",
  },
  {
    n: "Service companies",
    d: "Tracking spare parts in technicians' vans",
    tone: "sky",
    photo: base + "smiling-business-team-in-modern-office-environment-2026-09-22-05-59-36-utc.webp",
  },
];

const wh = [
  { n: "Colombo WH", w: 88, q: 1240 },
  { n: "Kandy WH", w: 52, q: 730 },
  { n: "Galle WH", w: 30, q: 415 },
];
const van = [
  { n: "Compressor", q: 3 },
  { n: "Inverter board", q: 2 },
  { n: "HEPA filter", q: 24 },
];

function next() {
  idx.value = (idx.value + 1) % who.length;
}
function pick(i) {
  manual.value = true;
  stop();
  idx.value = i;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 4200);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.2 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="wu" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Who uses</span> <span class="l2">Saptivo inventory</span></h2>
        <p>
          Retail chains balancing stock between stores, distributors holding goods in several warehouses, and service
          companies tracking spare parts in technicians' vans. Each uses the same stock engine, set up for their
          locations and products.
        </p>
      </header>

      <div class="acc" role="tablist">
        <button
          v-for="(w, i) in who"
          :key="w.n"
          type="button"
          role="tab"
          :aria-selected="idx === i"
          class="pn"
          :class="['tone-' + w.tone, { act: idx === i }]"
          @click="pick(i)"
          @mouseenter="pick(i)"
          @focus="pick(i)"
        >
          <span class="bgc"></span>
          <img v-if="ok[i]" :src="w.photo" alt="" @error="ok[i] = false" />
          <span class="shade"></span>

          <span class="lab">
            <b>{{ w.n }}</b>
            <small>{{ w.d }}</small>
          </span>

          <span v-if="idx === i" class="card">
            <!-- retail -->
            <template v-if="i === 0">
              <span class="ct">Balancing between stores</span>
              <span class="st">
                <span class="s low"><small>Store A</small><b>4</b></span>
                <span class="mv"><em>Move 8</em><i>→</i></span>
                <span class="s"><small>Store B</small><b>22</b></span>
              </span>
            </template>
            <!-- distributor -->
            <template v-else-if="i === 1">
              <span class="ct">Goods across warehouses</span>
              <span v-for="(r, k) in wh" :key="r.n" class="rw" :style="{ '--d': k * 110 + 'ms' }">
                <small>{{ r.n }}</small>
                <span class="bar"><i :style="{ width: r.w + '%' }"></i></span>
                <b>{{ r.q }}</b>
              </span>
            </template>
            <!-- service -->
            <template v-else>
              <span class="ct">Van 07 · spare parts</span>
              <span v-for="(r, k) in van" :key="r.n" class="vr" :style="{ '--d': k * 110 + 'ms' }">
                <small>{{ r.n }}</small>
                <b>{{ r.q }}</b>
              </span>
            </template>
          </span>
        </button>
      </div>

      <div class="eng">
        <span class="chip">Your locations</span>
        <span class="plus">+</span>
        <span class="chip">Your products</span>
        <span class="plus">=</span>
        <span class="chip core"><i></i>One stock engine</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wu {
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
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 800px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.wu h2 .l1 { color: #111111 !important; opacity: 1; }
.wu h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .acc, .eng { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .acc, .in .eng { opacity: 1; transform: none; }
.in .acc { transition-delay: .1s; }
.in .eng { transition-delay: .2s; }

.tone-mint { --t: var(--mint); --ti: var(--mint-i); --g1: #3b8f6c; --g2: #1d4a43; }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); --g1: #7d6be6; --g2: #2a2447; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --g1: #3f87c7; --g2: #1f3a56; }

/* accordion */
.acc { display: flex; gap: 14px; height: 520px; }
.pn { all: unset; box-sizing: border-box; cursor: pointer; position: relative; overflow: hidden; border-radius: 32px; flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 22px; color: #fff; transition: flex .7s cubic-bezier(.3, .8, .3, 1); }
.pn.act { flex: 2.6; }
.pn:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }
.bgc { position: absolute; inset: 0; background: linear-gradient(150deg, var(--g1), var(--g2)); }
.pn > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; transition: transform 1.2s ease; transform: scale(1.06); }
.pn.act > img { transform: scale(1); }
.shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(14, 12, 24, .78), rgba(14, 12, 24, .1) 62%); transition: background .5s; }
.pn:not(.act) .shade { background: linear-gradient(0deg, rgba(14, 12, 24, .82), rgba(14, 12, 24, .3)); }

.lab { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 4px; margin-bottom: 0; }
.lab b { font-size: clamp(18px, 1.8vw, 24px); font-weight: 600; letter-spacing: -.02em; }
.lab small { font-size: 13px; opacity: .9; line-height: 1.5; max-width: 34ch; }
.pn:not(.act) .lab small { display: none; }

/* glass card */
.card { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 10px; margin-top: 16px; padding: 16px 18px; border-radius: 22px; background: rgba(255, 255, 255, .94); color: var(--ink); backdrop-filter: blur(16px); animation: up .6s .15s cubic-bezier(.3, .8, .3, 1) both; }
@keyframes up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.ct { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

.st { display: flex; align-items: center; gap: 10px; }
.s { flex: 1; display: flex; flex-direction: column; padding: 10px 14px; border-radius: 16px; background: var(--mint); color: var(--mint-i); }
.s small { font-size: 11px; font-weight: 600; }
.s b { font-size: 28px; font-weight: 600; letter-spacing: -.02em; line-height: 1.1; }
.s.low { background: var(--rose); color: var(--rose-i); }
.mv { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.mv em { font-style: normal; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 99px; background: var(--ink); color: #fff; white-space: nowrap; }
.mv i { font-style: normal; font-weight: 700; color: var(--lav-i); animation: nudge 1.2s ease-in-out infinite; }
@keyframes nudge { 50% { transform: translateX(5px); } }

.rw { display: grid; grid-template-columns: 78px 1fr auto; gap: 10px; align-items: center; animation: up .5s var(--d) both; }
.rw small, .vr small { font-size: 12px; color: var(--muted); font-weight: 500; }
.rw b, .vr b { font-size: 12.5px; font-variant-numeric: tabular-nums; }
.bar { height: 10px; border-radius: 99px; background: #f1eff8; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 99px; background: var(--lav-i); animation: grow 1s .3s cubic-bezier(.3, .8, .3, 1) both; transform-origin: left; }
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.vr { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 12px; background: var(--sky); animation: up .5s var(--d) both; }
.vr small { color: var(--sky-i); font-weight: 600; }
.vr b { color: var(--sky-i); font-size: 15px; }

/* engine strip */
.eng { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 26px; flex-wrap: wrap; }
.chip { font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 99px; background: #f4f2fa; color: var(--ink); }
.plus { font-size: 18px; font-weight: 600; color: var(--muted); }
.chip.core { display: inline-flex; align-items: center; gap: 8px; background: var(--ink); color: #fff; }
.chip.core i { width: 8px; height: 8px; border-radius: 50%; background: #7fe0b0; animation: beat 2s infinite; }
@keyframes beat { 0% { box-shadow: 0 0 0 0 rgba(127, 224, 176, .6); } 70% { box-shadow: 0 0 0 9px rgba(127, 224, 176, 0); } 100% { box-shadow: 0 0 0 0 rgba(127, 224, 176, 0); } }

@media (max-width: 860px) {
  .acc { flex-direction: column; height: auto; }
  .pn { flex: none; min-height: 96px; transition: min-height .6s cubic-bezier(.3, .8, .3, 1); }
  .pn.act { flex: none; min-height: 400px; }
  .pn:not(.act) .shade { background: linear-gradient(0deg, rgba(14, 12, 24, .7), rgba(14, 12, 24, .35)); }
}
@media (max-width: 640px) {
  .wu { padding: 64px 16px; }
  .pn { border-radius: 26px; padding: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .acc, .eng { opacity: 1; transform: none; transition: none; }
  .card, .rw, .vr, .bar i, .mv i, .chip.core i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
