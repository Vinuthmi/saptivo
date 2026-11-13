<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "StockSyncSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const photoOk = ref(true);
let timer = null;
let io = null;
let reduce = false;

const heroPhoto = "/saptivo/images/features/young.jpg";

const LOW = 15;
const sites = [
  { k: "ho", n: "Head office warehouse", s: "Main store", tone: "lav" },
  { k: "col", n: "Colombo", s: "Branch", tone: "mint" },
  { k: "gal", n: "Galle", s: "Branch", tone: "sky" },
  { k: "kan", n: "Kandy", s: "Branch", tone: "butter" },
];

// stock after each step (HO, Colombo, Galle, Kandy)
const timeline = [
  { ho: 120, col: 46, gal: 18, kan: 32 },
  { ho: 120, col: 46, gal: 14, kan: 32 },
  { ho: 120, col: 46, gal: 14, kan: 32 },
  { ho: 90, col: 46, gal: 44, kan: 32 },
  { ho: 90, col: 44, gal: 44, kan: 32 },
];
const logs = [
  { at: 1, t: "Sale", d: "Galle · Air purifier X2", q: "−4" },
  { at: 3, t: "Transfer", d: "Head office → Galle", q: "30" },
  { at: 4, t: "Sale", d: "Colombo · Air purifier X2", q: "−2" },
];

const cur = computed(() => timeline[Math.min(step.value, timeline.length - 1)]);
const stockOf = (k) => cur.value[k];
const isLow = (k) => stockOf(k) < LOW;
const pct = (k) => Math.min(100, Math.round((stockOf(k) / 130) * 100));
const total = computed(() => cur.value.ho + cur.value.col + cur.value.gal + cur.value.kan);
const suggest = computed(() => step.value === 2);
const shownLogs = computed(() => logs.filter((l) => l.at <= step.value).reverse());
const lowNow = computed(() => ["ho", "col", "gal", "kan"].filter((k) => isLow(k)).length);

function tick() {
  step.value = step.value >= 6 ? 0 : step.value + 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1900);
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
    step.value = 4;
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
        <h2><span class="l1">Stock synced across</span> <span class="l2">branches and warehouses</span></h2>
        <p>
          Stock levels update across locations in real time. Low stock at one branch triggers a transfer suggestion
          from head office or another branch, and every movement is recorded.
        </p>
      </header>

      <!-- full-width photo -->
      <div class="hero">
        <img v-if="photoOk" :src="heroPhoto" alt="" @error="photoOk = false" />
        <div class="shade"></div>

        <div class="hl">
          <span class="live"><i></i>Live stock</span>
          <strong>Air purifier X2</strong>
          <span class="tot">{{ total }} units across 4 locations</span>
        </div>

        <div class="hr">
          <div class="chip" :class="{ warn: lowNow > 0 }">
            <b>{{ lowNow }}</b>
            <span>{{ lowNow === 1 ? "location" : "locations" }} low</span>
          </div>
          <button type="button" class="replay" @click="replay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /></svg>
            Replay
          </button>
        </div>

        <!-- sites over the photo -->
        <div class="sites" role="img" aria-label="Stock levels at head office, Colombo, Galle and Kandy updating in real time">
          <div v-for="s in sites" :key="s.k" class="site" :class="['tone-' + s.tone, { low: isLow(s.k) }]">
            <div class="st">
              <strong>{{ s.n }}</strong>
              <small>{{ s.s }}</small>
            </div>
            <div class="num"><b>{{ stockOf(s.k) }}</b><span>in stock</span></div>
            <div class="bar"><i :style="{ width: pct(s.k) + '%' }"></i></div>
            <span v-if="isLow(s.k)" class="flag">Low stock</span>
            <span v-else class="flag okf">Healthy</span>
          </div>
        </div>
      </div>

      <div class="under">
        <!-- suggestion -->
        <div class="sug" :class="{ on: suggest, done: step >= 3 }">
          <div class="si">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h14M13 6l6 6-6 6" /></svg>
          </div>
          <div class="sb">
            <strong v-if="step < 2">No transfers needed</strong>
            <strong v-else-if="step === 2">Transfer suggestion</strong>
            <strong v-else>Transfer approved</strong>
            <span v-if="step < 2">All locations above the reorder level.</span>
            <span v-else-if="step === 2">Galle is low. Move 30 units from Head office warehouse.</span>
            <span v-else>30 units moved from Head office to Galle and recorded.</span>
          </div>
          <span class="pill" :class="{ ok: step >= 3 }">{{ step >= 3 ? "Done" : step === 2 ? "Pending" : "Idle" }}</span>
        </div>

        <!-- movements -->
        <div class="mov">
          <div class="mh"><strong>Stock movements</strong><span>Every movement is recorded</span></div>
          <TransitionGroup name="lg" tag="ul" class="lgs">
            <li v-for="l in shownLogs" :key="l.at">
              <span class="tp" :class="l.t === 'Sale' ? 'sale' : 'tr'">{{ l.t }}</span>
              <span class="d">{{ l.d }}</span>
              <b>{{ l.q }}</b>
            </li>
          </TransitionGroup>
          <p v-if="shownLogs.length === 0" class="empty">No movements yet</p>
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
  font-family: "Urbanist", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 44px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ss h2 .l1 { color: #111111 !important; opacity: 1; }
.ss h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .hero, .under { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .hero, .in .under { opacity: 1; transform: none; }
.in .hero { transition-delay: .1s; }
.in .under { transition-delay: .2s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }

/* hero */
.hero { position: relative; border-radius: 32px; overflow: hidden; min-height: 520px; background: linear-gradient(135deg, #cfc6f7, #bcdcf3 55%, #c6ecd8); display: flex; flex-direction: column; justify-content: space-between; padding: 26px; box-shadow: 0 30px 80px rgba(60, 50, 120, .16); }
.hero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, .55) 0%, rgba(20, 18, 15, .05) 45%, rgba(20, 18, 15, .55) 100%); }
.hl, .hr, .sites { position: relative; z-index: 1; }
.hl { display: flex; flex-direction: column; gap: 4px; color: #fff; max-width: 60%; }
.hl strong { font-size: clamp(22px, 2.4vw, 30px); font-weight: 600; letter-spacing: -.02em; }
.tot { font-size: 13.5px; opacity: .9; }
.live { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; font-size: 11.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 5px 12px; border-radius: 99px; background: rgba(255, 255, 255, .2); backdrop-filter: blur(8px); margin-bottom: 8px; }
.live i { width: 8px; height: 8px; border-radius: 50%; background: #7fe0b0; animation: beat 2s infinite; }
@keyframes beat { 0% { box-shadow: 0 0 0 0 rgba(127, 224, 176, .6); } 70% { box-shadow: 0 0 0 9px rgba(127, 224, 176, 0); } 100% { box-shadow: 0 0 0 0 rgba(127, 224, 176, 0); } }
.hr { position: absolute; top: 26px; right: 26px; display: flex; align-items: center; gap: 10px; z-index: 2; }
.chip { display: flex; align-items: baseline; gap: 6px; padding: 8px 16px; border-radius: 99px; background: rgba(255, 255, 255, .92); font-size: 12.5px; color: var(--mint-i); transition: all .4s; }
.chip b { font-size: 18px; }
.chip.warn { background: var(--rose); color: var(--rose-i); }
.replay { all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 10px 16px; border-radius: 99px; background: var(--ink); color: #fff; }
.replay:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.replay svg { width: 14px; height: 14px; }

.sites { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 240px; }
.site { background: rgba(255, 255, 255, .94); backdrop-filter: blur(10px); border-radius: 22px; padding: 16px; display: flex; flex-direction: column; gap: 10px; border: 2px solid transparent; transition: border-color .4s, background .4s, transform .4s; }
.site.low { border-color: var(--rose-i); background: #fff6f8; transform: translateY(-6px); }
.st { display: flex; flex-direction: column; }
.st strong { font-size: 13.5px; }
.st small { font-size: 11.5px; color: var(--muted); }
.num { display: flex; align-items: baseline; gap: 6px; }
.num b { font-size: 30px; font-weight: 600; letter-spacing: -.02em; font-variant-numeric: tabular-nums; color: var(--ti); }
.site.low .num b { color: var(--rose-i); }
.num span { font-size: 12px; color: var(--muted); }
.bar { height: 8px; border-radius: 99px; background: #eeecf5; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 99px; background: var(--ti); transition: width .8s ease, background .4s; }
.site.low .bar i { background: var(--rose-i); }
.flag { align-self: flex-start; font-size: 10.5px; font-weight: 700; padding: 3px 10px; border-radius: 99px; background: var(--rose); color: var(--rose-i); }
.flag.okf { background: var(--t); color: var(--ti); }

/* under */
.under { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
.sug { display: flex; align-items: center; gap: 14px; padding: 18px 20px; border-radius: 24px; background: #f8f7fc; border: 1px solid var(--line); transition: all .4s; }
.sug.on { background: var(--butter); border-color: var(--butter-i); }
.sug.done { background: #f2fbf6; border-color: var(--mint-i); }
.si { width: 44px; height: 44px; border-radius: 14px; background: #fff; display: grid; place-items: center; color: var(--muted); flex: none; }
.sug.on .si { color: var(--butter-i); }
.sug.done .si { color: var(--mint-i); }
.si svg { width: 22px; height: 22px; }
.sb { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.sb strong { font-size: 14.5px; }
.sb span { font-size: 12.5px; color: var(--muted); line-height: 1.5; }
.pill { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; background: #fff; color: var(--muted); flex: none; }
.sug.on .pill { color: var(--butter-i); }
.pill.ok { background: var(--mint); color: var(--mint-i); }

.mov { border-radius: 24px; padding: 18px 20px; background: #fff; border: 1px solid var(--line); min-height: 130px; }
.mh { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 10px; }
.mh strong { font-size: 14.5px; }
.mh span { font-size: 11.5px; color: var(--muted); }
.lgs { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; position: relative; }
.lgs li { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; padding: 8px 12px; border-radius: 12px; background: #f8f7fc; font-size: 12.5px; }
.tp { font-size: 10.5px; font-weight: 700; padding: 2px 9px; border-radius: 99px; }
.tp.sale { background: var(--sky); color: var(--sky-i); }
.tp.tr { background: var(--lav); color: var(--lav-i); }
.lgs b { font-variant-numeric: tabular-nums; }
.empty { margin: 8px 0 0; font-size: 12px; color: #aaa6b8; }
.lg-enter-active { transition: all .5s ease; }
.lg-leave-active { transition: all .3s ease; position: absolute; left: 0; right: 0; }
.lg-enter-from { opacity: 0; transform: translateY(-10px); }
.lg-leave-to { opacity: 0; }
.lg-move { transition: transform .4s ease; }

@media (max-width: 900px) {
  .sites { grid-template-columns: repeat(2, 1fr); margin-top: 160px; }
  .under { grid-template-columns: 1fr; }
  .hl { max-width: 100%; margin-top: 56px; }
}
@media (max-width: 640px) {
  .ss { padding: 64px 16px; }
  .hero { padding: 16px; border-radius: 26px; }
  .hr { top: 16px; right: 16px; }
  .sites { gap: 10px; margin-top: 120px; }
  .site { padding: 12px; }
  .num b { font-size: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .hero, .under { opacity: 1; transform: none; transition: none; }
  .live i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
