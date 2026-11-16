<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SalesServiceStockSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const avOk = ref(true);
const stkOk = ref(true);
let timer = null;
let io = null;
let reduce = false;

const photo = "/saptivo/images/features/confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const stkPhoto = "/saptivo/images/features/10.jpg";

const hepa = computed(() => (step.value >= 2 ? 138 : 140));
const comp = computed(() => (step.value >= 4 ? 11 : 12));
const inv = computed(() => (step.value >= 7 ? 7 : 8));

const stock = computed(() => [
  { k: "hepa", n: "HEPA filter", q: hepa.value, flash: step.value === 2, serial: false },
  { k: "comp", n: "Compressor", q: comp.value, flash: step.value === 4, serial: true },
  { k: "inv", n: "Inverter board", q: inv.value, flash: step.value === 7, serial: true },
]);

const wf = computed(() => [
  { t: "Requested", d: "Chaminda", on: step.value >= 5 },
  { t: "Approved", d: "Saman · Store", on: step.value >= 6 },
  { t: "Issued", d: "From store", on: step.value >= 7 },
]);

const trail = computed(() => [
  { t: "Received", d: "Head office · 3 Mar", on: true },
  { t: "Transferred", d: "Galle store · 11 Mar", on: true },
  { t: "Issued", d: "To Chaminda · approved", on: step.value >= 7 },
  { t: "Installed", d: "Job JC-0873 · Dilani P.", on: step.value >= 10 },
]);

function tick() {
  step.value = step.value >= 12 ? 0 : step.value + 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1300);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function replay() {
  stop();
  step.value = 0;
  start();
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    step.value = 10;
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
  <section ref="root" class="ss" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Connected to</span> <span class="l2">sales and service</span></h2>
        <p>
          Stock deducts automatically when an invoice is issued or a part is used on a service job card. Technicians
          request parts from the store through an approval workflow, and high-value items such as compressors and
          inverters are tracked by serial number.
        </p>
      </header>

      <div class="board" role="img" aria-label="Invoices, service job cards and technician part requests all deducting from one stock record, with serial tracking">
        <div class="flows">
          <!-- sales -->
          <div class="fr tone-lav" :class="{ on: step >= 1 }">
            <span class="tag">Sales</span>
            <div class="fm">
              <strong>Invoice INV-2041 issued</strong>
              <small>2 × HEPA filter · Colombo customer</small>
            </div>
            <span class="res" :class="{ show: step >= 2 }">Stock −2</span>
          </div>

          <!-- service -->
          <div class="fr tone-sky" :class="{ on: step >= 3 }">
            <span class="tag">Service</span>
            <div class="fm">
              <strong>Job card JC-0873</strong>
              <small>Compressor used · serial CP-2291-0457</small>
            </div>
            <span class="res" :class="{ show: step >= 4 }">Stock −1</span>
          </div>

          <!-- store -->
          <div class="fr tone-butter st" :class="{ on: step >= 5 }">
            <div class="srow">
              <span class="tag">Store</span>
              <div class="fm">
                <strong class="who">
                  <span class="av">
                    <img v-if="avOk" :src="photo" alt="" @error="avOk = false" />
                    <b v-else>C</b>
                  </span>
                  Chaminda requests an inverter board
                </strong>
                <small>Approval workflow · serial tracked</small>
              </div>
              <span class="res" :class="{ show: step >= 7 }">Stock −1</span>
            </div>
            <ol class="wf">
              <li v-for="w in wf" :key="w.t" :class="{ on: w.on }">
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                </i>
                <span><b>{{ w.t }}</b><small>{{ w.d }}</small></span>
              </li>
            </ol>
          </div>
        </div>

        <!-- stock -->
        <div class="stk">
          <img v-if="stkOk" class="bg" :src="stkPhoto" alt="" @error="stkOk = false" />
          <span class="ov"></span>
          <div class="sh">
            <strong>Stock · Galle store</strong>
            <button type="button" class="replay" @click="replay">Replay</button>
          </div>
          <ul>
            <li v-for="s in stock" :key="s.k" :class="{ flash: s.flash }">
              <div class="sn">
                <b>{{ s.n }}</b>
                <small v-if="s.serial" class="sr">Serial tracked</small>
                <small v-else>Quantity tracked</small>
              </div>
              <span class="q">{{ s.q }}</span>
            </li>
          </ul>
          <p class="note">Updates the moment an invoice is issued or a part is used.</p>
        </div>

        <!-- serial trail -->
        <div class="trail">
          <div class="th">
            <strong>Serial IV-7710-0123</strong>
            <span>Inverter board · full history</span>
          </div>
          <ol>
            <li v-for="t in trail" :key="t.t" :class="{ on: t.on }">
              <i></i>
              <b>{{ t.t }}</b>
              <small>{{ t.d }}</small>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ss {
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
.ss h2 .l1 { color: #111111 !important; opacity: 1; }
.ss h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .board { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .1s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }

.board { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; align-items: stretch; }

/* flows */
.flows { display: flex; flex-direction: column; gap: 12px; }
.fr { display: flex; align-items: center; gap: 16px; padding: 18px 20px; border-radius: 26px; background: #faf9ff; border: 1.5px solid var(--line); opacity: .4; transform: translateX(-8px); transition: all .6s cubic-bezier(.3, .8, .3, 1); flex-wrap: wrap; }
.fr.on { opacity: 1; transform: none; border-color: var(--t); background: #fff; box-shadow: 0 16px 36px rgba(60, 50, 120, .09); }
.fr.st { flex-direction: column; align-items: stretch; gap: 14px; }
.srow { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.tag { font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 5px 14px; border-radius: 99px; background: var(--t); color: var(--ti); flex: none; }
.fm { flex: 1; min-width: 0; }
.fm strong { display: block; font-size: 14.5px; }
.fm small { font-size: 12px; color: var(--muted); }
.who { display: flex !important; align-items: center; gap: 10px; }
.av { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; background: var(--sky); color: var(--sky-i); display: grid; place-items: center; font-weight: 700; font-size: 12px; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.res { font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 99px; background: var(--ink); color: #fff; opacity: 0; transform: scale(.8); transition: all .4s cubic-bezier(.3, 1.4, .5, 1); flex: none; }
.res.show { opacity: 1; transform: none; }

.wf { list-style: none; margin: 0; padding: 14px 0 0; border-top: 1px dashed #ecdca0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.wf li { display: flex; align-items: center; gap: 10px; opacity: .4; transition: opacity .4s; }
.wf li.on { opacity: 1; }
.wf i { width: 26px; height: 26px; border-radius: 50%; background: #efe9d2; color: #fff; display: grid; place-items: center; flex: none; transition: background .4s; }
.wf li.on i { background: var(--butter-i); }
.wf svg { width: 13px; height: 13px; }
.wf b { display: block; font-size: 12.5px; }
.wf small { font-size: 11px; color: var(--muted); }

/* stock */
.stk { position: relative; overflow: hidden; background: #1d1a24; color: #f4eef7; border-radius: 30px; padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.stk .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.stk .ov { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(29, 26, 36, .55) 0%, rgba(29, 26, 36, .82) 55%, rgba(29, 26, 36, .94) 100%); }
.stk > :not(.bg):not(.ov) { position: relative; z-index: 1; }
.sh { display: flex; justify-content: space-between; align-items: center; }
.sh strong { font-size: 15px; }
.replay { all: unset; cursor: pointer; font-size: 11.5px; font-weight: 600; padding: 6px 14px; border-radius: 99px; background: rgba(255, 255, 255, .12); color: #fff; }
.replay:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.stk ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.stk li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 18px; background: rgba(255, 255, 255, .1); backdrop-filter: blur(6px); transition: background .4s; }
.stk li.flash { animation: fl 1.2s ease; }
@keyframes fl { 0% { background: rgba(127, 224, 176, .45); } 100% { background: rgba(255, 255, 255, .1); } }
.sn b { display: block; font-size: 14px; }
.sn small { font-size: 11px; color: #a79fb4; }
.sn small.sr { color: #ffd98a; }
.q { font-size: 34px; font-weight: 600; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.note { margin: 0; font-size: 12px; line-height: 1.6; color: #a79fb4; }

/* trail */
.trail { grid-column: 1 / -1; background: #faf9ff; border: 1px solid var(--line); border-radius: 28px; padding: 20px 24px; }
.th { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
.th strong { font-size: 15px; }
.th span { font-size: 12px; color: var(--muted); }
.trail ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.trail li { position: relative; display: flex; flex-direction: column; gap: 2px; padding-top: 22px; opacity: .4; transition: opacity .5s; }
.trail li::before { content: ""; position: absolute; top: 6px; left: 18px; right: -12px; height: 2px; background: #e3dff2; }
.trail li:last-child::before { display: none; }
.trail li i { position: absolute; top: 0; left: 0; width: 14px; height: 14px; border-radius: 50%; background: #d7d3e6; transition: all .5s; }
.trail li.on { opacity: 1; }
.trail li.on i { background: var(--mint-i); box-shadow: 0 0 0 5px rgba(47, 156, 107, .18); }
.trail li.on::before { background: var(--mint-i); }
.trail b { font-size: 13px; }
.trail small { font-size: 11.5px; color: var(--muted); }

@media (max-width: 900px) {
  .board { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .ss { padding: 64px 16px; }
  .fr { padding: 16px; }
  .wf { grid-template-columns: 1fr; }
  .trail ol { grid-template-columns: 1fr 1fr; row-gap: 18px; }
  .trail li::before { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .stk li.flash { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
