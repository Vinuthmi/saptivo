<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ReportBuilderSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const manual = ref(-1);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";

const modules = ["Sales", "Leads", "Service", "Support", "Inventory"];
const fields = ["Revenue", "Deals won", "Branch", "Sales rep", "Deal stage", "Lead source", "Close date"];
const types = ["KPI tiles", "Bar", "Line", "Pie", "Funnel"];

const reps = [
  { n: "Nimali", v: 2.4 },
  { n: "Kasun", v: 1.8 },
  { n: "Shanika", v: 1.3 },
  { n: "Ruwan", v: 0.7 },
];
const shades = ["#14120f", "#6a59d6", "#3a7fbd", "#9ad0b4"];
const stages = [
  { n: "Lead", v: 100 },
  { n: "Qualified", v: 70 },
  { n: "Proposal", v: 44 },
  { n: "Won", v: 24 },
];
const lineVals = [30, 38, 36, 52, 61, 74];
const linePts = lineVals.map((v, i) => i * 56 + "," + (120 - v * 1.3)).join(" ");
const total = reps.reduce((a, r) => a + r.v, 0);
const pieBg = (() => {
  let acc = 0;
  const parts = reps.map((r, i) => {
    const from = (acc / total) * 100;
    acc += r.v;
    const to = (acc / total) * 100;
    return shades[i] + " " + from + "% " + to + "%";
  });
  return "conic-gradient(" + parts.join(", ") + ")";
})();

const sub = computed(() => (reduce ? 13 : manual.value >= 0 ? Math.max(4, n.value % 14) : n.value % 14));
const typeIdx = computed(() => {
  if (manual.value >= 0) return manual.value;
  if (reduce) return 1;
  return Math.floor((Math.max(sub.value, 4) - 4) / 2) % 5;
});
const hasPreview = computed(() => sub.value >= 4 || manual.value >= 0 || reduce);
const inFields = computed(() => sub.value >= 1);
const inFilters = computed(() => sub.value >= 2);
const inGroup = computed(() => sub.value >= 3);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1000);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manual.value = i;
  if (n.value % 14 < 4) n.value = 4;
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
  <section ref="root" class="rb" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Drag-and-drop custom</span> <span class="l2">report builder</span></h2>
        <p>
          Build your own reports from any module. Choose fields, filters and groupings, and display results as KPI
          tiles, bar, line, pie or funnel charts.
        </p>
      </header>

      <div class="stage">
        <!-- palette -->
        <aside class="pal">
          <small class="lb">Module</small>
          <div class="mods"><span v-for="(m, i) in modules" :key="m" :class="{ on: i === 0 }">{{ m }}</span></div>
          <small class="lb">Fields</small>
          <div class="fl">
            <span v-for="f in fields" :key="f" class="fc" :class="{ used: (f === 'Revenue' && inFields) || (f === 'Branch' && inFilters) || (f === 'Sales rep' && inGroup), pick: (f === 'Revenue' && sub === 0) || (f === 'Branch' && sub === 1) || (f === 'Sales rep' && sub === 2) }">{{ f }}</span>
          </div>
        </aside>

        <!-- canvas -->
        <div class="cv">
          <div class="zone">
            <small>Fields</small>
            <div class="zb"><Transition name="ch"><span v-if="inFields" class="ck lav">Revenue · Sum</span></Transition><em v-if="!inFields">Drop fields here</em></div>
          </div>
          <div class="zone">
            <small>Filters</small>
            <div class="zb"><Transition name="ch"><span v-if="inFilters" class="ck sky">Branch is Colombo</span></Transition><em v-if="!inFilters">Drop a filter here</em></div>
          </div>
          <div class="zone">
            <small>Group by</small>
            <div class="zb"><Transition name="ch"><span v-if="inGroup" class="ck mint">Sales rep</span></Transition><em v-if="!inGroup">Drop a grouping here</em></div>
          </div>
          <div class="who">
            <span class="av"><img v-if="ok" :src="photo" alt="" @error="ok = false" /><b v-else>N</b></span>
            <span>Revenue by sales rep</span>
            <span class="save" :class="{ on: hasPreview }">{{ hasPreview ? "Saved" : "Save report" }}</span>
          </div>
        </div>

        <!-- preview -->
        <div class="pv">
          <div class="tp" role="tablist">
            <button v-for="(t, i) in types" :key="t" type="button" role="tab" :aria-selected="i === typeIdx && hasPreview" :class="{ on: hasPreview && i === typeIdx }" @click="pick(i)">{{ t }}</button>
          </div>

          <div class="ch">
            <Transition name="sw" mode="out-in">
              <div v-if="!hasPreview" key="empty" class="empty">Your chart appears here</div>

              <div v-else-if="typeIdx === 0" key="kpi" class="kpis">
                <div><small>Revenue</small><strong>LKR 6.2M</strong></div>
                <div><small>Deals won</small><strong>84</strong></div>
                <div><small>Average deal</small><strong>74k</strong></div>
              </div>

              <div v-else-if="typeIdx === 1" key="bar" class="bars">
                <div v-for="(r, i) in reps" :key="r.n" class="hb" :style="{ animationDelay: i * 0.1 + 's' }">
                  <span>{{ r.n }}</span><span class="tk"><i :style="{ width: (r.v / 2.4) * 100 + '%' }"></i></span><b>{{ r.v.toFixed(1) }}M</b>
                </div>
              </div>

              <div v-else-if="typeIdx === 2" key="line" class="lnw">
                <svg viewBox="0 0 280 130" aria-hidden="true">
                  <line v-for="g in 3" :key="g" x1="0" x2="280" :y1="g * 32" :y2="g * 32" class="gr" />
                  <polyline :points="linePts" class="ln" pathLength="1" />
                </svg>
                <div class="mo"><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span></div>
              </div>

              <div v-else-if="typeIdx === 3" key="pie" class="pie">
                <div class="pc" :style="{ background: pieBg }"></div>
                <ul><li v-for="(r, i) in reps" :key="r.n"><i :style="{ background: shades[i] }"></i>{{ r.n }}<b>{{ Math.round((r.v / total) * 100) }}%</b></li></ul>
              </div>

              <div v-else key="fun" class="fun">
                <div v-for="(s, i) in stages" :key="s.n" class="fs" :style="{ width: s.v + '%', animationDelay: i * 0.12 + 's' }"><span>{{ s.n }}</span><b>{{ s.v }}</b></div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rb {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.rb *, .rb *::before, .rb *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.rb h2 .l1 { color: #111111 !important; opacity: 1; }
.rb h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .08s; }

.stage { display: grid; grid-template-columns: 220px minmax(0, .9fr) minmax(0, 1.2fr); gap: 16px; align-items: stretch; }
.lb { display: block; font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }

.pal { border: 1px solid var(--line); border-radius: 26px; padding: 20px; display: flex; flex-direction: column; }
.mods { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 22px; }
.mods span { font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 99px; background: #f1f2f4; color: var(--muted); }
.mods .on { background: var(--ink); color: #fff; }
.fl { display: flex; flex-direction: column; gap: 8px; }
.fc { font-size: 13px; font-weight: 500; padding: 9px 14px; border-radius: 12px; background: #f6f7f9; transition: all .3s; }
.fc.pick { background: var(--butter); box-shadow: inset 0 0 0 1.5px var(--butter-i); transform: translateX(6px); }
.fc.used { background: #fff; color: #a0a5ad; box-shadow: inset 0 0 0 1px var(--line); }

.cv { background: var(--lav); border-radius: 26px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
.zone small { display: block; font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.zb { min-height: 54px; border-radius: 14px; border: 1.5px dashed #cfc7ea; background: rgba(255, 255, 255, .55); display: flex; align-items: center; padding: 0 12px; }
.zb em { font-style: normal; font-size: 12.5px; color: #9a8fc0; }
.ck { font-size: 13px; font-weight: 600; padding: 7px 14px; border-radius: 10px; background: #fff; }
.ck.lav { color: var(--lav-i); } .ck.sky { color: var(--sky-i); } .ck.mint { color: var(--mint-i); }
.ch-enter-active { transition: opacity .4s ease, transform .4s ease; }
.ch-enter-from { opacity: 0; transform: translateX(-30px); }
.who { margin-top: auto; display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 14px; padding: 10px 12px; font-size: 12.5px; font-weight: 500; }
.who > span:nth-child(2) { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.av { width: 30px; height: 30px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 12px; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.save { padding: 6px 14px; border-radius: 99px; background: #f1f2f4; color: var(--muted); font-weight: 600; font-size: 12px; transition: all .3s; }
.save.on { background: var(--ink); color: #fff; }

.pv { background: var(--sky); border-radius: 26px; padding: 18px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.tp { display: flex; flex-wrap: wrap; gap: 4px; padding: 3px; background: rgba(255, 255, 255, .65); border-radius: 99px; align-self: flex-start; }
.tp button { all: unset; cursor: pointer; font-size: 12.5px; font-weight: 500; padding: 6px 14px; border-radius: 99px; color: var(--muted); transition: all .25s; }
.tp button.on { background: var(--ink); color: #fff; }
.tp button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.ch { flex: 1; background: #fff; border-radius: 18px; padding: 20px; display: grid; min-height: 300px; align-items: center; }
.sw-enter-active, .sw-leave-active { transition: opacity .25s ease, transform .25s ease; }
.sw-enter-from { opacity: 0; transform: translateY(8px); }
.sw-leave-to { opacity: 0; }
.empty { text-align: center; font-size: 13px; color: #a0a5ad; }

.kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.kpis div { background: #f6f7f9; border-radius: 14px; padding: 16px 14px; display: flex; flex-direction: column; gap: 4px; animation: rise .5s ease both; }
.kpis div:nth-child(2) { animation-delay: .1s; } .kpis div:nth-child(3) { animation-delay: .2s; }
.kpis small { font-size: 12px; color: var(--muted); }
.kpis strong { font-size: 22px; font-weight: 500; letter-spacing: -.02em; }

.bars { display: flex; flex-direction: column; gap: 16px; }
.hb { display: grid; grid-template-columns: 70px 1fr 48px; align-items: center; gap: 12px; font-size: 13px; animation: rise .4s ease both; }
.hb b { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
.tk { height: 10px; border-radius: 5px; background: #eef1f4; overflow: hidden; }
.tk i { display: block; height: 100%; background: var(--lav-i); border-radius: 5px; animation: grow 1s cubic-bezier(.2, .8, .2, 1) both; }

.lnw svg { width: 100%; height: 150px; overflow: visible; }
.gr { stroke: #eef1f4; stroke-width: 1; }
.ln { fill: none; stroke: var(--ink); stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.2s ease forwards; }
.mo { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--muted); margin-top: 6px; }

.pie { display: flex; align-items: center; justify-content: center; gap: 28px; flex-wrap: wrap; }
.pc { width: 150px; height: 150px; border-radius: 50%; animation: spin .9s cubic-bezier(.2, .8, .2, 1) both; -webkit-mask: radial-gradient(circle 46px at center, transparent 98%, #000 100%); mask: radial-gradient(circle 46px at center, transparent 98%, #000 100%); }
.pie ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; }
.pie li { display: flex; align-items: center; gap: 10px; }
.pie li i { width: 10px; height: 10px; border-radius: 3px; }
.pie li b { margin-left: auto; padding-left: 14px; font-weight: 600; }

.fun { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.fs { background: var(--mint); color: var(--mint-i); border-radius: 12px; padding: 11px 16px; display: flex; justify-content: space-between; font-size: 13px; font-weight: 500; animation: rise .5s ease both; }
.fs:last-child { background: var(--mint-i); color: #fff; }

@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes grow { from { width: 0; } }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes spin { from { opacity: 0; transform: rotate(-40deg) scale(.9); } to { opacity: 1; transform: none; } }

@media (max-width: 1040px) {
  .stage { grid-template-columns: 1fr 1fr; }
  .pal { grid-column: 1; } .cv { grid-column: 2; }
  .pv { grid-column: 1 / 3; }
}
@media (max-width: 700px) {
  .stage { grid-template-columns: 1fr; }
  .pal, .cv, .pv { grid-column: 1; }
  .fl { flex-direction: row; flex-wrap: wrap; }
}
@media (max-width: 640px) {
  .rb { padding: 64px 16px; }
  .pal, .cv, .pv { padding: 16px; border-radius: 22px; }
  .kpis { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; animation: none !important; }
  .ln { stroke-dashoffset: 0; }
}
</style>
