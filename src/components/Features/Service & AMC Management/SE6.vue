<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SparePartsVanStockSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const avOk = ref(true);
let timer = null;
let io = null;
let reduce = false;

const photo = "/saptivo/images/features/confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const step = computed(() => n.value % 11);
const van = computed(() => (step.value >= 5 ? 10 : step.value >= 2 ? 4 : step.value >= 1 ? 5 : 6));
const main = computed(() => (step.value >= 5 ? 74 : 80));
const low = computed(() => van.value < 5);
const flash = computed(() => [1, 2, 5].includes(step.value));
const serialOn = computed(() => step.value >= 7 && step.value <= 9);

const bins = computed(() => [
  { k: "cap", n: "Capacitor", q: van.value, hero: true },
  { k: "hepa", n: "HEPA filter", q: 24 },
  { k: "gas", n: "Gas valve", q: 9 },
  { k: "comp", n: "Compressor", q: 1, serial: true },
  { k: "inv", n: "Inverter board", q: 2, serial: true },
  { k: "fan", n: "Fan motor", q: 3 },
]);

const status = computed(() => {
  if (step.value >= 5) return { t: "Restocked", c: "mint" };
  if (step.value === 4) return { t: "Approved", c: "sky" };
  if (step.value === 3) return { t: "Awaiting approval", c: "butter" };
  if (low.value) return { t: "Below minimum", c: "rose" };
  return { t: "Stock healthy", c: "mint" };
});

const logs = [
  { at: 1, t: "Job", d: "JC-0873 · 1 × Capacitor used", w: "Deducted automatically" },
  { at: 2, t: "Job", d: "JC-0881 · 1 × Capacitor used", w: "Van 07 below minimum" },
  { at: 3, t: "Request", d: "Chaminda requests 6 × Capacitor", w: "Approval workflow" },
  { at: 4, t: "Approved", d: "Saman approved the request", w: "Main store" },
  { at: 5, t: "Restock", d: "6 × Capacitor to Van 07", w: "Recorded" },
  { at: 7, t: "Serial", d: "Compressor CP-2291-0457 to Van 07", w: "Tracked by serial number" },
];
const shownLogs = computed(() => logs.filter((l) => l.at <= step.value).reverse().slice(0, 4));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1350);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function replay() {
  stop();
  n.value = Math.floor(n.value / 11) * 11 + 11;
  start();
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    n.value = 8;
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
  <section ref="root" class="sp" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Spare parts and</span> <span class="l2">van stock</span></h2>
        <p>
          Stock levels are tracked in the main store, each branch and each technician's van. Parts used on a job are
          deducted automatically, technicians request parts through an approval workflow, and high-value parts are
          tracked by serial number
        </p>
      </header>

      <div class="board" role="img" aria-label="A technician van with tracked spare parts, parts deducted on jobs, a restock request approved, and serial-tracked high-value parts">
        <!-- van -->
        <div class="vancard">
          <div class="vh">
            <div class="who">
              <span class="av">
                <img v-if="avOk" :src="photo" alt="" @error="avOk = false" />
                <b v-else>C</b>
              </span>
              <div><strong>Van 07</strong><small>Chaminda · Galle route</small></div>
            </div>
            <span class="st" :class="'t-' + status.c"><i></i>{{ status.t }}</span>
          </div>

          <div class="van">
            <svg viewBox="0 0 520 250" class="vs" aria-hidden="true">
              <path d="M18 196V60a22 22 0 0 1 22-22h300a22 22 0 0 1 22 22v136z" class="body" />
              <path d="M362 82h74a22 22 0 0 1 18 9l40 52a22 22 0 0 1 4.500 13V196H362z" class="cab" />
              <path d="M378 98h56l32 40h-88z" class="win" />
              <rect x="18" y="196" width="488" height="14" rx="6" class="bump" />
              <circle cx="120" cy="214" r="30" class="tyre" /><circle cx="120" cy="214" r="12" class="hub" />
              <circle cx="400" cy="214" r="30" class="tyre" /><circle cx="400" cy="214" r="12" class="hub" />
            </svg>

            <div class="shelf">
              <div v-for="b in bins" :key="b.k" class="bin" :class="{ hero: b.hero, low: b.hero && low, fl: b.hero && flash, ser: b.serial, pulse: b.serial && serialOn }">
                <small>{{ b.n }}</small>
                <b>{{ b.q }}</b>
                <em v-if="b.serial">Serial</em>
              </div>
            </div>
          </div>
        </div>

        <!-- levels + log -->
        <div class="side">
          <div class="lv">
            <div class="lt"><strong>Capacitor stock</strong><span>at every level</span></div>
            <div class="chain">
              <div class="lvl"><small>Main store</small><b>{{ main }}</b></div>
              <i>→</i>
              <div class="lvl"><small>Colombo branch</small><b>24</b></div>
              <i>→</i>
              <div class="lvl" :class="{ low: low }"><small>Van 07</small><b>{{ van }}</b></div>
            </div>
          </div>

          <div class="log">
            <div class="lt"><strong>Activity</strong><button type="button" class="replay" @click="replay">Replay</button></div>
            <TransitionGroup name="lg" tag="ul">
              <li v-for="l in shownLogs" :key="l.at">
                <span class="tp" :class="'k-' + l.t.toLowerCase()">{{ l.t }}</span>
                <span class="d"><b>{{ l.d }}</b><small>{{ l.w }}</small></span>
              </li>
            </TransitionGroup>
            <p v-if="shownLogs.length === 0" class="empty">No activity yet</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sp {
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
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 800px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.sp h2 .l1 { color: #111111 !important; opacity: 1; }
.sp h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .board { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .1s; }

.board { display: grid; grid-template-columns: 1.25fr 1fr; gap: 20px; align-items: stretch; }

.vancard { background: #faf9ff; border: 1px solid var(--line); border-radius: 32px; padding: 22px; box-shadow: 0 30px 70px rgba(60, 50, 120, .12); display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.vh { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.who { display: flex; align-items: center; gap: 12px; }
.who strong { display: block; font-size: 16px; }
.who small { font-size: 12px; color: var(--muted); }
.av { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; background: var(--sky); color: var(--sky-i); display: grid; place-items: center; font-weight: 700; flex: none; border: 3px solid #fff; box-sizing: border-box; box-shadow: 0 0 0 1px var(--line); }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.st { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; padding: 7px 16px; border-radius: 99px; transition: all .4s; }
.st i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.t-mint { background: var(--mint); color: var(--mint-i); }
.t-rose { background: var(--rose); color: var(--rose-i); }
.t-butter { background: var(--butter); color: var(--butter-i); }
.t-sky { background: var(--sky); color: var(--sky-i); }

.van { position: relative; aspect-ratio: 520 / 250; width: 100%; }
.vs { position: absolute; inset: 0; width: 100%; height: 100%; }
.body { fill: #fff; stroke: #d9d4ee; stroke-width: 2.5; }
.cab { fill: #e8e3ff; stroke: #cfc7f0; stroke-width: 2.5; }
.win { fill: #dcecfb; stroke: #bcd6ee; stroke-width: 2; }
.bump { fill: #cfc7f0; }
.tyre { fill: #2a2447; }
.hub { fill: #e8e3ff; }
.shelf { position: absolute; left: 6.5%; top: 17%; width: 63%; height: 56%; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; gap: 8px; }
.bin { position: relative; border-radius: 14px; background: #f6f4ff; border: 1.5px solid #e3dff2; padding: 6px 10px; display: flex; flex-direction: column; justify-content: center; min-width: 0; transition: all .4s; }
.bin small { font-size: clamp(8.5px, 1.1vw, 11px); font-weight: 600; color: var(--muted); line-height: 1.2; }
.bin b { font-size: clamp(15px, 2.1vw, 24px); font-weight: 600; letter-spacing: -.02em; line-height: 1.1; font-variant-numeric: tabular-nums; }
.bin em { position: absolute; top: 5px; right: 6px; font-style: normal; font-size: 8px; font-weight: 700; padding: 1px 6px; border-radius: 99px; background: var(--butter); color: var(--butter-i); }
.bin.hero { background: var(--mint); border-color: var(--mint-i); }
.bin.hero b { color: var(--mint-i); }
.bin.hero.low { background: var(--rose); border-color: var(--rose-i); }
.bin.hero.low b { color: var(--rose-i); }
.bin.fl { animation: fl 1s ease; }
@keyframes fl { 0% { transform: scale(1.08); box-shadow: 0 0 0 6px rgba(125, 107, 230, .3); } 100% { transform: none; box-shadow: 0 0 0 0 rgba(125, 107, 230, 0); } }
.bin.pulse { border-color: var(--butter-i); background: #fffaea; animation: pl 1.2s ease-in-out infinite; }
@keyframes pl { 50% { box-shadow: 0 0 0 6px rgba(167, 125, 0, .18); } }

.side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.lv, .log { background: #fff; border: 1px solid var(--line); border-radius: 28px; padding: 20px; }
.lt { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 14px; }
.lt strong { font-size: 15px; }
.lt span { font-size: 12px; color: var(--muted); }
.chain { display: flex; align-items: center; gap: 8px; }
.chain i { font-style: normal; font-weight: 700; color: var(--lav-i); }
.lvl { flex: 1; display: flex; flex-direction: column; padding: 12px 14px; border-radius: 18px; background: #f6f4ff; transition: all .4s; min-width: 0; }
.lvl small { font-size: 11px; font-weight: 600; color: var(--muted); }
.lvl b { font-size: 28px; font-weight: 600; letter-spacing: -.03em; font-variant-numeric: tabular-nums; line-height: 1.15; }
.lvl.low { background: var(--rose); }
.lvl.low b { color: var(--rose-i); }

.log { flex: 1; }
.log ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; position: relative; min-height: 220px; align-content: flex-start; }
.log li { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 16px; background: #f8f7fc; }
.tp { font-size: 10.5px; font-weight: 700; padding: 3px 11px; border-radius: 99px; flex: none; min-width: 66px; text-align: center; }
.k-job { background: var(--sky); color: var(--sky-i); }
.k-request { background: var(--butter); color: var(--butter-i); }
.k-approved { background: var(--lav); color: var(--lav-i); }
.k-restock { background: var(--mint); color: var(--mint-i); }
.k-serial { background: var(--rose); color: var(--rose-i); }
.d b { display: block; font-size: 12.5px; font-weight: 600; line-height: 1.35; }
.d small { font-size: 11px; color: var(--muted); }
.empty { margin: 6px 0 0; font-size: 12px; color: #aaa6b8; }
.replay { all: unset; cursor: pointer; font-size: 11.5px; font-weight: 600; padding: 5px 14px; border-radius: 99px; border: 1px solid var(--line); color: var(--muted); }
.replay:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.lg-enter-active { transition: all .5s ease; }
.lg-leave-active { transition: all .3s ease; position: absolute; left: 0; right: 0; }
.lg-enter-from { opacity: 0; transform: translateY(-12px); }
.lg-leave-to { opacity: 0; }
.lg-move { transition: transform .45s ease; }

@media (max-width: 900px) {
  .board { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .sp { padding: 64px 16px; }
  .vancard, .lv, .log { padding: 16px; border-radius: 24px; }
  .shelf { gap: 5px; }
  .bin { padding: 4px 6px; border-radius: 10px; }
  .bin em { display: none; }
  .chain { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .bin.fl, .bin.pulse { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
