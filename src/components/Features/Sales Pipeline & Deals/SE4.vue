<template>
  <section id="forecasting" ref="root" class="fc" :class="{ in: seen, live }" aria-labelledby="fc-title">
    <div class="wrap">
      <div class="left">
        <h2 id="fc-title" class="title">
          <span>Accurate</span>
          <span class="soft">sales forecasting</span>
        </h2>
        <p class="lead">Every deal carries a value, probability and expected close date. Saptivo rolls these up into weighted and best-case forecasts by rep, team, branch and month.</p>
        <p class="lead dark">Compare forecasts with actual results to see how accurate your team really is.</p>
        <p class="lead">Add Saptivo AI for machine-learning win probabilities.</p>

        <div class="visual">
        <div class="photos" aria-hidden="true">
          <template v-for="(src, i) in photos" :key="src">
            <img v-if="ok[i]" :src="src" alt="" loading="lazy" :class="{ on: i === photoIdx }" @error="ok[i] = false" />
          </template>
          <span class="acc">
            <small>Forecast accuracy</small>
            <b :key="accuracy + String(ai)">{{ accuracy }}%</b>
            <em v-if="ai">with Saptivo AI</em>
          </span>
          <span class="mini"><i></i>Updated live</span>
        </div>
        <div class="deal" aria-label="How a deal is weighted">
          <p class="cap">One deal, rolled up</p>
          <div class="eq">
            <span class="chip"><small>Value</small><b>Rs 1.85M</b></span>
            <span class="op">×</span>
            <span class="chip lav"><small>Probability</small><b>50%</b></span>
            <span class="op">=</span>
            <span class="chip mint"><small>Weighted</small><b>Rs 925K</b></span>
          </div>
          <p class="when">Expected close <b>12 Dec</b> · lands in the December forecast</p>
        </div>
        </div>
      </div>

      <div class="card">
        <header>
          <div class="seg" role="group" aria-label="Forecast by">
            <button v-for="v in viewKeys" :key="v" type="button" :class="{ on: view === v }" :aria-pressed="view === v" @click="pickView(v)">By {{ v }}</button>
          </div>
          <button type="button" class="ai" :class="{ on: ai }" role="switch" :aria-checked="ai" @click="toggleAi">
            <span class="sw"><i></i></span>Saptivo AI
          </button>
        </header>

        <div class="chart">
          <div class="grid" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          <div v-for="g in groups" :key="view + g.name" class="grp">
            <div class="bars" :title="`${g.name}: best case ${g.best}M, weighted ${g.wtd}M, actual ${g.act}M`">
              <i class="bar best" :style="{ height: h(g.best) }"></i>
              <i class="bar wtd" :style="{ height: h(g.wtd) }"></i>
              <i class="bar act" :style="{ height: h(g.act) }"></i>
              <span class="mark" :class="{ on: ai }" :style="{ bottom: h(g.ai) }"><em>AI</em></span>
            </div>
            <span class="gn">{{ g.name }}</span>
          </div>
        </div>

        <ul class="legend">
          <li><i class="k best"></i>Best case</li>
          <li><i class="k wtd"></i>Weighted</li>
          <li><i class="k act"></i>Actual</li>
          <li :class="{ dim: !ai }"><i class="k aik"></i>AI win probability</li>
        </ul>

        <div class="stats">
          <div class="st">
            <small>Forecast accuracy</small>
            <p><b :key="accuracy + String(ai)">{{ accuracy }}%</b><span v-if="ai" class="up">+{{ gain }} pts with AI</span></p>
          </div>
          <div class="st">
            <small>Weighted forecast</small>
            <p><b :key="view + 'w'">{{ money(sum('wtd')) }}</b></p>
          </div>
          <div class="st">
            <small>Actual so far</small>
            <p><b :key="view + 'a'">{{ money(sum('act')) }}</b></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "ForecastingSection" });

/* values in Rs millions: best case, weighted, actual, and weighted with AI win probabilities */
const data = {
  rep: [
    { name: "Chathura", best: 6.2, wtd: 4.1, act: 3.6, ai: 3.7 },
    { name: "Ishara", best: 5.4, wtd: 3.6, act: 3.9, ai: 3.8 },
    { name: "Sanjeewa", best: 7.8, wtd: 5.4, act: 4.6, ai: 4.8 },
    { name: "Nadeesha", best: 3.9, wtd: 2.4, act: 2.6, ai: 2.6 },
  ],
  team: [
    { name: "Sales", best: 7.6, wtd: 5.2, act: 4.7, ai: 4.8 },
    { name: "Service", best: 4.8, wtd: 3.1, act: 3.4, ai: 3.3 },
    { name: "Renewals", best: 6.4, wtd: 5.0, act: 4.9, ai: 4.9 },
    { name: "Partners", best: 3.2, wtd: 1.9, act: 1.6, ai: 1.7 },
  ],
  branch: [
    { name: "Colombo", best: 7.9, wtd: 5.6, act: 5.0, ai: 5.1 },
    { name: "Kandy", best: 5.1, wtd: 3.4, act: 3.7, ai: 3.6 },
    { name: "Galle", best: 3.6, wtd: 2.3, act: 2.0, ai: 2.1 },
    { name: "Jaffna", best: 2.8, wtd: 1.7, act: 1.8, ai: 1.8 },
  ],
  month: [
    { name: "Aug", best: 5.8, wtd: 3.9, act: 3.4, ai: 3.5 },
    { name: "Sep", best: 6.4, wtd: 4.4, act: 4.7, ai: 4.6 },
    { name: "Oct", best: 7.2, wtd: 5.1, act: 4.5, ai: 4.7 },
    { name: "Nov", best: 7.9, wtd: 5.7, act: 5.5, ai: 5.6 },
  ],
};
const viewKeys = ["rep", "team", "branch", "month"];

const photos = [
  "/saptivo/images/features/SE4.jpg",
  "/saptivo/images/features/threecolleagues-.jpg",
];
const ok = ref(photos.map(() => true));
const view = ref("rep");
const ai = ref(false);
const manual = ref(false);

const groups = computed(() => data[view.value]);
const photoIdx = computed(() => viewKeys.indexOf(view.value) % photos.length);
const MAX = 8.5;
const h = (v) => (v / MAX) * 100 + "%";
const sum = (k) => groups.value.reduce((s, g) => s + g[k], 0);
const money = (v) => "Rs " + v.toFixed(1) + "M";

// accuracy = 100 minus the average gap between forecast and actual
function accOf(key) {
  const gaps = groups.value.map((g) => Math.abs(g[key] - g.act) / g.act);
  return Math.round(100 - (gaps.reduce((s, x) => s + x, 0) / gaps.length) * 100);
}
const base = computed(() => accOf("wtd"));
const withAi = computed(() => accOf("ai"));
const accuracy = computed(() => (ai.value ? withAi.value : base.value));
const gain = computed(() => withAi.value - base.value);

function pickView(v) {
  manual.value = true;
  view.value = v;
}
function toggleAi() {
  manual.value = true;
  ai.value = !ai.value;
}

/* demo: for each view, show the plain forecast first, then switch AI on */
let n = 0;
function step() {
  if (manual.value) return;
  n += 1;
  const p = n % 4;
  if (p === 0) {
    ai.value = false;
    view.value = viewKeys[(viewKeys.indexOf(view.value) + 1) % viewKeys.length];
  }
  if (p === 2) ai.value = true;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1500);
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
    ai.value = true;
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

.fc {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  --sky: #cfe4f8; --sky-d: #4a95d6;
  --lav: #ddd6ff; --lav-d: #8a78f0;
  --mint: #cdeedd; --mint-d: #35a572;
  --rose: #fde3ea; --rose-d: #d8567f;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.fc *, .fc *::before, .fc *::after { box-sizing: border-box; }
.fc button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

.wrap { width: min(1180px, calc(100% - 40px)); margin: 0 auto; display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 56px; align-items: start; }
.title { margin: 0; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { margin: 22px 0 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.lead.dark { color: var(--ink); font-weight: 500; margin-top: 12px; }
.lead:nth-of-type(3) { margin-top: 12px; }

.deal { margin-top: 32px; padding: 20px; border-radius: 24px; background: #f4f8fd; border: 1px solid #e3edf8; }
.cap { margin: 0 0 12px; font-size: 11.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.eq { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.chip { display: grid; gap: 1px; padding: 10px 14px; border-radius: 14px; background: var(--sky); }
.chip.lav { background: var(--lav); }
.chip.mint { background: var(--mint); }
.chip small { font-size: 10.5px; color: rgba(20, 18, 15, 0.6); }
.chip b { font-size: 15px; font-weight: 600; }
.op { font-size: 16px; color: #a39d97; }
.when { margin: 14px 0 0; font-size: 12.5px; color: var(--muted); }
.when b { color: var(--ink); font-weight: 500; }

/* photo visual */
.visual { margin-top: 32px; }
.photos { position: relative; height: 300px; border-radius: 28px; overflow: hidden; background: linear-gradient(135deg, #e8e3ff 0%, #dcecfb 55%, #d9f2e5 100%); }
.photos img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; opacity: 0; transition: opacity 0.9s ease; }
.photos img.on { opacity: 1; }
.photos::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(232, 227, 255, 0.35) 0%, rgba(232, 227, 255, 0) 40%, rgba(220, 236, 251, 0.45) 100%); pointer-events: none; }
.acc { position: absolute; z-index: 1; top: 16px; right: 16px; display: grid; gap: 1px; min-width: 130px; padding: 10px 16px; border-radius: 16px; background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 12px 28px -10px rgba(20, 18, 15, 0.3); animation: bob 5s ease-in-out infinite; }
.fc:not(.live) .acc { animation-play-state: paused; }
.acc small { font-size: 11px; color: var(--muted); }
.acc b { font-size: 26px; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; animation: bump 0.5s ease; }
.acc em { font-style: normal; font-size: 10.5px; font-weight: 600; color: #b3365f; }
.mini { position: absolute; z-index: 1; top: 16px; left: 16px; display: inline-flex; align-items: center; gap: 8px; padding: 6px 13px 6px 10px; border-radius: 99px; background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); font-size: 12px; font-weight: 600; }
.mini i { width: 8px; height: 8px; border-radius: 50%; background: #35a572; animation: blink 1.8s ease-in-out infinite; }
.fc:not(.live) .mini i { animation-play-state: paused; }
.visual .deal { position: relative; z-index: 1; margin: -84px 16px 0; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 0; box-shadow: 0 18px 40px -16px rgba(20, 18, 15, 0.35); }

/* ---------- chart card ---------- */
.card { padding: 24px; border-radius: 30px; background: #f8f7fb; border: 1px solid #efedf6; }
.card header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 22px; }
.seg { display: flex; padding: 3px; border-radius: 12px; background: #fff; border: 1px solid var(--line); flex-wrap: wrap; }
.seg button { padding: 7px 13px; border: 0; border-radius: 9px; background: none; cursor: pointer; font: 500 12.5px "Poppins", system-ui, sans-serif; color: #8a857f; transition: background 0.25s, color 0.25s; }
.seg button.on { background: var(--ink); color: #fff; }

.ai { display: inline-flex; align-items: center; gap: 10px; padding: 7px 14px 7px 8px; border: 1px solid var(--line); border-radius: 99px; background: #fff; cursor: pointer; font: 500 12.5px "Poppins", system-ui, sans-serif; color: var(--ink); transition: background 0.3s, border-color 0.3s; }
.ai.on { background: var(--rose); border-color: transparent; }
.sw { position: relative; width: 30px; height: 18px; border-radius: 99px; background: #ddd8d3; transition: background 0.3s; }
.sw i { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform 0.3s; }
.ai.on .sw { background: var(--rose-d); }
.ai.on .sw i { transform: translateX(12px); }

.chart { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; height: 270px; padding-bottom: 30px; }
.grid { position: absolute; inset: 0 0 30px 0; display: grid; grid-template-rows: repeat(4, 1fr); pointer-events: none; }
.grid i { border-top: 1px dashed #e3deed; }
.grp { position: relative; z-index: 1; display: grid; grid-template-rows: 1fr auto; }
.bars { position: relative; display: flex; align-items: flex-end; justify-content: center; gap: 5px; height: 100%; }
.bar { display: block; width: 22%; max-width: 30px; border-radius: 8px 8px 3px 3px; transition: height 0.9s cubic-bezier(0.3, 0.7, 0.2, 1); }
.bar.best { background: var(--lav); }
.bar.wtd { background: var(--sky); }
.bar.act { background: var(--mint-d); }
.gn { margin-top: 10px; text-align: center; font-size: 12.5px; color: var(--muted); }

/* AI marker */
.mark { position: absolute; left: 6%; right: 6%; height: 0; border-top: 2px dashed var(--rose-d); opacity: 0; transition: bottom 0.9s cubic-bezier(0.3, 0.7, 0.2, 1), opacity 0.4s; }
.mark.on { opacity: 1; }
.mark em { position: absolute; right: -2px; top: -20px; padding: 1px 7px; border-radius: 99px; background: var(--rose-d); color: #fff; font-size: 10px; font-style: normal; font-weight: 600; }

.legend { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 12px; color: var(--muted); }
.legend li { display: flex; align-items: center; gap: 8px; transition: opacity 0.3s; }
.legend li.dim { opacity: 0.4; }
.k { width: 12px; height: 12px; border-radius: 4px; }
.k.best { background: var(--lav); } .k.wtd { background: var(--sky); } .k.act { background: var(--mint-d); }
.k.aik { height: 0; width: 16px; border-radius: 0; border-top: 2px dashed var(--rose-d); }

.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px; }
.st { padding: 14px 16px; border-radius: 18px; background: #fff; }
.st small { font-size: 11.5px; color: var(--muted); }
.st p { margin: 4px 0 0; display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 8px; }
.st b { display: inline-block; font-size: 22px; font-weight: 600; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; animation: bump 0.5s ease; }
.up { padding: 1px 8px; border-radius: 99px; background: var(--mint); color: #1d7a52; font-size: 10.5px; font-weight: 600; }

@keyframes bob { 0%, 100% { translate: 0 0; } 50% { translate: 0 -5px; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@keyframes bump { from { transform: translateY(-4px); opacity: 0.4; } to { transform: none; opacity: 1; } }

/* entrance (runs once) */
.fc:not(.in) .left, .fc:not(.in) .card { opacity: 0; }
.fc.in .left { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.fc.in .card { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 1000px) {
  .wrap { grid-template-columns: 1fr; gap: 40px; }
}
@media (max-width: 560px) {
  .fc { padding: 72px 0; }
  .card { padding: 16px; border-radius: 24px; }
  .chart { height: 230px; gap: 8px; }
  .photos { height: 240px; border-radius: 24px; }
  .visual .deal { margin: -70px 10px 0; padding: 16px; }
  .stats { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .fc *, .fc *::before, .fc *::after { animation: none !important; transition: none !important; }
  .fc:not(.in) .left, .fc:not(.in) .card { opacity: 1; }
}
</style>
