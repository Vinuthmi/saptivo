<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "InventoryReportingSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
const manual = ref(false);
const photoOk = ref(true);
const exp = ref({ take: "idle", audit: "idle" });
let timer = null;
let io = null;
let reduce = false;
const timeouts = [];

const photo = "/saptivo/images/features/12.jpg";

const filters = ["All locations", "Head office", "Colombo", "Galle"];
const locs = [
  { n: "Head office", v: 28.4, tone: "lav" },
  { n: "Colombo", v: 11.2, tone: "mint" },
  { n: "Galle", v: 6.9, tone: "sky" },
  { n: "Vans", v: 2.1, tone: "butter" },
];
const data = [
  {
    total: 48.6,
    fast: [["HEPA filter", 5], ["Remote controller", 8]],
    slow: [["Compressor kit", 94], ["Fan motor", 121]],
    cost: [["Compressor", 1.82], ["Inverter board", 1.34], ["Fan motor", 0.62], ["Control PCB", 0.41]],
  },
  {
    total: 28.4,
    fast: [["HEPA filter", 4], ["Air purifier X2", 7]],
    slow: [["Fan motor", 140], ["Control PCB", 168]],
    cost: [["Compressor", 0.96], ["Inverter board", 0.71], ["Fan motor", 0.3], ["Control PCB", 0.22]],
  },
  {
    total: 11.2,
    fast: [["Remote controller", 6], ["HEPA filter", 8]],
    slow: [["Compressor kit", 88], ["Wall bracket kit", 102]],
    cost: [["Compressor", 0.58], ["Inverter board", 0.41], ["Fan motor", 0.19], ["Control PCB", 0.1]],
  },
  {
    total: 6.9,
    fast: [["Gas refill kit", 5], ["HEPA filter", 9]],
    slow: [["Inverter board", 110], ["Compressor kit", 97]],
    cost: [["Compressor", 0.28], ["Inverter board", 0.22], ["Fan motor", 0.13], ["Control PCB", 0.09]],
  },
];

const d = computed(() => data[idx.value]);
const sel = computed(() => (idx.value === 0 ? null : filters[idx.value]));
const maxLoc = Math.max(...locs.map((l) => l.v));
const maxCost = computed(() => Math.max(...d.value.cost.map((c) => c[1])));
const fast = computed(() => d.value.fast.map(([n, v]) => ({ n, v, w: Math.round((v / 150) * 100) + 8 })));
const slow = computed(() => d.value.slow.map(([n, v]) => ({ n, v, w: Math.round((v / 180) * 100) })));
const cost = computed(() => d.value.cost.map(([n, v]) => ({ n, v, w: Math.round((v / maxCost.value) * 100) })));

function runExport(k) {
  if (exp.value[k] !== "idle") return;
  exp.value[k] = "busy";
  timeouts.push(setTimeout(() => (exp.value[k] = "done"), 1000));
  timeouts.push(setTimeout(() => (exp.value[k] = "idle"), 2800));
}
function next() {
  idx.value = (idx.value + 1) % filters.length;
  if (idx.value === 0) runExport("take");
  if (idx.value === 2) runExport("audit");
}
function pick(i) {
  manual.value = true;
  stop();
  idx.value = i;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 3600);
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
  timeouts.forEach((t) => clearTimeout(t));
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="ir" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Multi-warehouse</span> <span class="l2">inventory reporting</span></h2>
        <p>
          See stock value by location, fast and slow movers, and which parts cost the most across service jobs. Export
          for stock takes and audits. Saptivo's multi-warehouse inventory reports give purchasing the facts it needs.
        </p>
      </header>

      <div class="stage" role="img" aria-label="Inventory reports for stock value by location, fast and slow movers and part costs, with a location filter and export buttons">
        <!-- photo banner -->
        <div class="ban">
          <div class="shelves"></div>
          <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
          <div class="shade"></div>

          <div class="bl">
            <span class="live"><i></i>Purchasing view</span>
            <small>Total stock value</small>
            <Transition name="nm" mode="out-in">
              <b :key="idx">LKR {{ d.total.toFixed(1) }}M</b>
            </Transition>
          </div>

          <div class="fl" role="tablist">
            <button
              v-for="(f, i) in filters"
              :key="f"
              type="button"
              role="tab"
              :aria-selected="idx === i"
              :class="{ act: idx === i }"
              @click="pick(i)"
            >{{ f }}</button>
          </div>
        </div>

        <!-- report cards -->
        <div class="cards">
          <article class="c">
            <h3>Stock value by location</h3>
            <ul class="vb">
              <li v-for="l in locs" :key="l.n" :class="['tone-' + l.tone, { dim: sel && sel !== l.n }]">
                <span>{{ l.n }}</span>
                <div><i :style="{ width: Math.round((l.v / maxLoc) * 100) + '%' }"></i></div>
                <b>{{ l.v.toFixed(1) }}M</b>
              </li>
            </ul>
          </article>

          <article class="c">
            <h3>Fast and slow movers</h3>
            <div class="mv">
              <span class="lab f">Fast · days to sell through</span>
              <ul>
                <li v-for="(m, i) in fast" :key="'f' + i">
                  <span>{{ m.n }}</span>
                  <div><i class="g" :style="{ width: m.w + '%' }"></i></div>
                  <b>{{ m.v }}d</b>
                </li>
              </ul>
              <span class="lab s">Slow</span>
              <ul>
                <li v-for="(m, i) in slow" :key="'s' + i">
                  <span>{{ m.n }}</span>
                  <div><i class="r" :style="{ width: m.w + '%' }"></i></div>
                  <b>{{ m.v }}d</b>
                </li>
              </ul>
            </div>
          </article>

          <article class="c">
            <h3>Part cost across service jobs</h3>
            <ul class="vb cs">
              <li v-for="(c, i) in cost" :key="i" :class="i === 0 ? 'tone-rose' : 'tone-lav'">
                <span>{{ c.n }}</span>
                <div><i :style="{ width: c.w + '%' }"></i></div>
                <b>{{ c.v.toFixed(2) }}M</b>
              </li>
            </ul>
          </article>
        </div>

        <!-- export -->
        <div class="ex">
          <span class="et">Export for stock takes and audits</span>
          <button type="button" class="eb" :class="exp.take" @click="runExport('take')">
            <svg v-if="exp.take === 'done'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
            <svg v-else-if="exp.take === 'busy'" class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9" /></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
            {{ exp.take === "done" ? "Stock take sheet ready" : exp.take === "busy" ? "Preparing…" : "Stock take sheet" }}
          </button>
          <button type="button" class="eb" :class="exp.audit" @click="runExport('audit')">
            <svg v-if="exp.audit === 'done'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
            <svg v-else-if="exp.audit === 'busy'" class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9" /></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
            {{ exp.audit === "done" ? "Audit report ready" : exp.audit === "busy" ? "Preparing…" : "Audit report" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ir {
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
.ir h2 .l1 { color: #111111 !important; opacity: 1; }
.ir h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(18px); transition: opacity .8s ease, transform .8s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .1s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }

/* banner */
.ban { position: relative; border-radius: 36px; overflow: hidden; min-height: 400px; background: #231f33; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; padding: 32px 32px 110px; flex-wrap: wrap; box-shadow: 0 36px 80px rgba(40, 30, 90, .25); }
.ban > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.shelves { position: absolute; inset: 0; background:
  repeating-linear-gradient(90deg, rgba(255, 255, 255, .05) 0 2px, transparent 2px 110px),
  repeating-linear-gradient(0deg, rgba(255, 255, 255, .07) 0 3px, transparent 3px 120px),
  linear-gradient(120deg, #2a2447 0%, #1f3a56 55%, #1d4a43 100%); }
.shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(14, 12, 24, .78), rgba(14, 12, 24, .12) 65%); }
.bl, .fl { position: relative; z-index: 1; }
.bl { color: #fff; display: flex; flex-direction: column; gap: 2px; }
.bl small { font-size: 13px; opacity: .85; margin-top: 8px; }
.bl b { font-size: clamp(34px, 4.4vw, 56px); font-weight: 600; letter-spacing: -.03em; line-height: 1.05; font-variant-numeric: tabular-nums; }
.live { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; font-size: 11.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 6px 14px; border-radius: 99px; background: rgba(255, 255, 255, .16); backdrop-filter: blur(10px); }
.live i { width: 8px; height: 8px; border-radius: 50%; background: #7fe0b0; animation: beat 2s infinite; }
@keyframes beat { 0% { box-shadow: 0 0 0 0 rgba(127, 224, 176, .6); } 70% { box-shadow: 0 0 0 9px rgba(127, 224, 176, 0); } 100% { box-shadow: 0 0 0 0 rgba(127, 224, 176, 0); } }
.nm-enter-active, .nm-leave-active { transition: all .25s ease; }
.nm-enter-from { opacity: 0; transform: translateY(8px); }
.nm-leave-to { opacity: 0; transform: translateY(-8px); }

.fl { display: flex; gap: 8px; flex-wrap: wrap; padding: 5px; border-radius: 99px; background: rgba(255, 255, 255, .14); backdrop-filter: blur(12px); }
.fl button { all: unset; cursor: pointer; font-size: 12.5px; font-weight: 600; padding: 9px 18px; border-radius: 99px; color: #fff; transition: all .3s; }
.fl button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.fl button.act { background: #fff; color: var(--ink); }

/* cards overlap banner */
.cards { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: -76px 24px 0; }
.c { background: #fff; border: 1px solid var(--line); border-radius: 28px; padding: 22px; box-shadow: 0 24px 54px rgba(40, 30, 90, .14); min-width: 0; }
.c h3 { margin: 0 0 16px; font-size: 15px; font-weight: 600; }

.vb { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.vb li { display: grid; grid-template-columns: 92px 1fr auto; gap: 12px; align-items: center; font-size: 12.5px; transition: opacity .4s; }
.vb li.dim { opacity: .3; }
.vb span { color: var(--muted); font-weight: 500; }
.vb div { height: 12px; border-radius: 99px; background: #f1eff8; overflow: hidden; }
.vb i { display: block; height: 100%; border-radius: 99px; background: var(--ti); transition: width .9s cubic-bezier(.3, .8, .3, 1); }
.vb b { font-variant-numeric: tabular-nums; font-size: 12.5px; min-width: 46px; text-align: right; }
.vb.cs li { grid-template-columns: 104px 1fr auto; }

.mv { display: flex; flex-direction: column; gap: 10px; }
.mv ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.mv li { display: grid; grid-template-columns: 104px 1fr auto; gap: 12px; align-items: center; font-size: 12.5px; }
.mv li span { color: var(--muted); font-weight: 500; }
.mv li div { height: 12px; border-radius: 99px; background: #f1eff8; overflow: hidden; }
.mv li i { display: block; height: 100%; border-radius: 99px; transition: width .9s cubic-bezier(.3, .8, .3, 1); }
.mv .g { background: var(--mint-i); }
.mv .r { background: #e3b43a; }
.mv li b { font-size: 12.5px; min-width: 40px; text-align: right; font-variant-numeric: tabular-nums; }
.lab { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.lab.f { color: var(--mint-i); }
.lab.s { color: var(--butter-i); margin-top: 8px; }

/* export */
.ex { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 22px; flex-wrap: wrap; }
.et { font-size: 13.5px; color: var(--muted); margin-right: 6px; }
.eb { all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; padding: 11px 22px; border-radius: 99px; background: var(--ink); color: #fff; transition: all .35s; }
.eb:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.eb svg { width: 16px; height: 16px; }
.eb.busy { background: var(--lav-i); }
.eb.done { background: var(--mint-i); }
.spin { animation: sp .8s linear infinite; }
@keyframes sp { to { transform: rotate(360deg); } }

@media (max-width: 960px) {
  .cards { grid-template-columns: 1fr; margin: -60px 14px 0; }
  .ban { padding-bottom: 90px; }
}
@media (max-width: 640px) {
  .ir { padding: 64px 16px; }
  .ban { border-radius: 28px; min-height: 360px; padding: 22px 20px 90px; }
  .fl button { padding: 8px 12px; font-size: 11.5px; }
  .vb li, .vb.cs li, .mv li { grid-template-columns: 84px 1fr auto; gap: 8px; }
  .cards { margin: -56px 8px 0; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  .live i, .spin { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
