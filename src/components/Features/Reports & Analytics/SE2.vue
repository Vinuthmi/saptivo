<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ReadyMadeReportsV2Section" });

const root = ref(null);
const shown = ref(false);
const act = ref(0);
const manual = ref(false);
const still = ref(false);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "man-reviews-data-analytics-on-screen-at-desk-2026-09-21-15-22-10-utc.webp";

const reports = [
  { t: "Sales by rep, branch and product", tone: "lav" },
  { t: "Pipeline by stage and pipeline velocity", tone: "sky" },
  { t: "Lead-source ROI", tone: "mint" },
  { t: "Forecast versus actual", tone: "butter" },
  { t: "Won and lost reasons", tone: "rose" },
  { t: "Service revenue: AMC versus ad hoc", tone: "sky" },
  { t: "Support metrics: response time, handling time and CSAT", tone: "lav" },
];
const activeTitle = computed(() => reports[act.value].t);

function next() {
  act.value = (act.value + 1) % reports.length;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 2400);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  act.value = i;
  manual.value = true;
  stop();
}
function on(i) {
  return act.value === i || still.value;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    still.value = true;
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
  <section ref="root" class="r2" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Ready-made</span> <span class="l2">reports</span></h2>
        <p>Start with reports most businesses need from day one:</p>
      </header>

      <div class="grid">
        <figure class="ph">
          <img v-if="ok" :src="photo" alt="" @error="ok = false" />
          <figcaption>
            <small>Open report</small>
            <strong>{{ activeTitle }}</strong>
          </figcaption>
        </figure>

        <button v-for="(r, i) in reports" :key="r.t" type="button" class="tile" :class="['t' + i, r.tone, { act: on(i) }]" @click="pick(i)">
          <span class="no">{{ i + 1 }}</span>
          <span class="tx">{{ r.t }}</span>

          <span class="viz" aria-hidden="true">
            <template v-if="i === 0">
              <span class="hb"><i style="--w: 92%"></i></span><span class="hb"><i style="--w: 74%"></i></span><span class="hb"><i style="--w: 52%"></i></span>
            </template>
            <template v-else-if="i === 1">
              <span class="hb"><i style="--w: 100%"></i></span><span class="hb"><i style="--w: 66%"></i></span><span class="hb"><i style="--w: 38%"></i></span>
              <em class="chip">18 days to close</em>
            </template>
            <template v-else-if="i === 2">
              <span class="rx"><em>Referral 9.0x</em><em>WhatsApp 8.1x</em><em>Email 6.4x</em></span>
            </template>
            <template v-else-if="i === 3">
              <svg viewBox="0 0 120 40" preserveAspectRatio="none"><polyline class="f" points="0,32 24,27 48,22 72,16 96,11 120,6" /><polyline class="a" points="0,34 24,24 48,25 72,13 96,10 120,3" /></svg>
            </template>
            <template v-else-if="i === 4">
              <span class="wl"><i class="w"></i><i class="l"></i></span>
              <span class="wlt"><em>Won</em><em>Lost</em></span>
            </template>
            <template v-else-if="i === 5">
              <span class="sk"><i class="am"></i><i class="ah"></i></span>
              <span class="wlt"><em>AMC</em><em>Ad hoc</em></span>
            </template>
            <template v-else>
              <span class="kp"><em>12 min</em><em>8m 40s</em><em>4.7</em></span>
            </template>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.r2 {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.r2 *, .r2 *::before, .r2 *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.r2 h2 .l1 { color: #111111 !important; opacity: 1; }
.r2 h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .ph, .tile { opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s ease, border-color .3s; }
.in .head, .in .ph, .in .tile { opacity: 1; transform: none; }
.in .tile.act { transform: translateY(-3px); }

.grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
.ph { grid-column: 1 / 7; grid-row: 1 / 3; margin: 0; position: relative; border-radius: 28px; overflow: hidden; min-height: 460px; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.ph figcaption { position: absolute; left: 18px; right: 18px; bottom: 18px; background: #fff; border-radius: 18px; padding: 14px 18px; display: flex; flex-direction: column; gap: 2px; }
.ph small { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.ph strong { font-size: 15px; font-weight: 600; line-height: 1.4; }

.tile { all: unset; box-sizing: border-box; cursor: pointer; border-radius: 24px; padding: 18px; display: flex; flex-direction: column; gap: 10px; border: 1.5px solid transparent; transition: opacity .6s ease, transform .6s ease, border-color .3s; min-width: 0; }
.tile:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.tile.act { border-color: var(--ink); }
.tile.lav { background: var(--lav); }
.tile.sky { background: var(--sky); }
.tile.mint { background: var(--mint); }
.tile.butter { background: var(--butter); }
.tile.rose { background: var(--rose); }
.t0 { grid-column: 7 / 10; } .t1 { grid-column: 10 / 13; }
.t2 { grid-column: 7 / 10; } .t3 { grid-column: 10 / 13; }
.t4 { grid-column: 1 / 5; } .t5 { grid-column: 5 / 9; } .t6 { grid-column: 9 / 13; }

.no { width: 24px; height: 24px; border-radius: 50%; background: #fff; display: grid; place-items: center; font-size: 11.5px; font-weight: 600; transition: all .3s; }
.act .no { background: var(--ink); color: #fff; }
.tx { font-size: 14.5px; font-weight: 500; line-height: 1.45; letter-spacing: -.01em; }

.viz { margin-top: auto; background: #fff; border-radius: 14px; padding: 12px; display: flex; flex-direction: column; gap: 7px; min-height: 74px; justify-content: center; font-size: 11.5px; color: var(--muted); }
.hb { height: 7px; border-radius: 4px; background: #eef1f4; overflow: hidden; display: block; }
.hb i { display: block; height: 100%; width: 14%; background: var(--lav-i); border-radius: 4px; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.sky .hb i { background: var(--sky-i); }
.act .hb i { width: var(--w); }
.chip { font-style: normal; font-weight: 600; color: var(--sky-i); }
.rx, .kp { display: flex; flex-wrap: wrap; gap: 5px; }
.rx em, .kp em { font-style: normal; font-weight: 600; padding: 3px 9px; border-radius: 6px; background: #f1f2f4; color: var(--muted); transition: all .4s; }
.act .rx em { background: var(--mint); color: var(--mint-i); }
.act .kp em { background: var(--lav); color: var(--lav-i); }
.viz svg { width: 100%; height: 40px; overflow: visible; }
.viz polyline { fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease; }
.viz .f { stroke: #c4ae4a; }
.viz .a { stroke: var(--ink); }
.act .viz polyline { stroke-dashoffset: 0; }
.wl, .sk { display: flex; height: 12px; border-radius: 6px; overflow: hidden; gap: 2px; background: #eef1f4; }
.wl i, .sk i { display: block; height: 100%; width: 50%; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.wl .w { background: var(--mint-i); } .wl .l { background: var(--rose-i); }
.act .wl .w { width: 62%; } .act .wl .l { width: 38%; }
.sk .am { background: var(--sky-i); } .sk .ah { background: #b9d4ec; }
.act .sk .am { width: 68%; } .act .sk .ah { width: 32%; }
.wlt { display: flex; gap: 12px; }
.wlt em { font-style: normal; font-weight: 500; }

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .ph { grid-column: 1 / 3; grid-row: auto; min-height: 340px; }
  .t0, .t1, .t2, .t3, .t4, .t5 { grid-column: auto; }
  .t6 { grid-column: 1 / 3; }
}
@media (max-width: 640px) {
  .r2 { padding: 64px 16px; }
  .grid { grid-template-columns: 1fr; }
  .ph { grid-column: 1; min-height: 300px; border-radius: 22px; }
  .t6 { grid-column: 1; }
  .tile { padding: 16px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .ph, .tile { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
