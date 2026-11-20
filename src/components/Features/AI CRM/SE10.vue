<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "HowSaptivoAiLearnsSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref(false);
const months = ref(0);
let io = null;
let timer = null;
let touched = false;

/* All accuracy figures are SAMPLE data. */
const MAX = 12;
const lo = 60;
const hi = 92;
const acc = (m) => lo + ((hi - lo) * (1 - Math.exp(-m / 4.5))) / (1 - Math.exp(-MAX / 4.5));
const current = computed(() => Math.round(acc(months.value)));

const sources = [
  { n: "Leads that became customers", at: 3, tone: "lav", icon: "M5 12l5 5 9-10" },
  { n: "Deals won", at: 6, tone: "mint", icon: "M7 4h10v5a5 5 0 0 1-10 0zM12 14v4M8 20h8M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" },
  { n: "Accounts that churned", at: 9, tone: "rose", icon: "M10 4H5v16h5M15 8l4 4-4 4M19 12H9" },
];

/* chart */
const X0 = 28;
const X1 = 340;
const Y0 = 190;
const Y1 = 38;
const px = (m) => X0 + (m / MAX) * (X1 - X0);
const py = (a) => Y0 - ((a - 55) / 45) * (Y0 - Y1);
const pts = Array.from({ length: MAX * 2 + 1 }, (_, i) => [i / 2, acc(i / 2)]);
const curve = pts.map(([m, a], i) => `${i ? "L" : "M"}${px(m).toFixed(1)} ${py(a).toFixed(1)}`).join(" ");
const area = `${curve} L${px(MAX)} ${Y0} L${px(0)} ${Y0} Z`;
const dot = computed(() => ({ x: px(months.value), y: py(acc(months.value)) }));
const clipW = computed(() => px(months.value) - X0 + 4);

function setMonths(v) {
  touched = true;
  clearInterval(timer);
  months.value = v;
}

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    seen.value = true;
    months.value = MAX;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      shown.value = true;
      seen.value = true;
      io.disconnect();
      setTimeout(() => {
        if (touched) return;
        timer = setInterval(() => {
          if (touched || months.value >= MAX) return clearInterval(timer);
          months.value += 1;
        }, 520);
      }, 900);
    },
    { threshold: 0.35 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
  clearInterval(timer);
});
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">How Saptivo AI</span> <span class="l2">learns</span></h2>
        <p class="sub">
          Saptivo's models start from general patterns and then retrain on your own history: which leads became customers, which deals were won and which accounts churned. The more you use Saptivo, the more accurate its scores and forecasts become for your business.
        </p>
      </header>

      <div class="board" :class="{ on: seen }">
        <!-- what it learns from -->
        <div class="left">
          <div class="step base"><i></i>General patterns</div>
          <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
          <p class="cap">Retrained on your history</p>
          <ul class="src">
            <li v-for="s in sources" :key="s.n" :class="['tone-' + s.tone, { lit: months >= s.at }]">
              <span class="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path :d="s.icon" /></svg>
              </span>
              <b>{{ s.n }}</b>
            </li>
          </ul>
          <div class="result" :class="{ done: months >= MAX }">
            <i></i>{{ months >= MAX ? "Tuned to your business" : "Getting to know your business" }}
          </div>
        </div>

        <!-- accuracy curve -->
        <div class="right">
          <div class="num">
            <b>{{ current }}<span>%</span></b>
            <small>Sample accuracy of scores and forecasts</small>
          </div>

          <svg class="chart" viewBox="0 0 360 220" role="img" :aria-label="`Accuracy rises to ${current} percent as Saptivo learns from your history`">
            <defs>
              <linearGradient id="ai-a" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#7d6be6" stop-opacity=".28" />
                <stop offset="1" stop-color="#7d6be6" stop-opacity="0" />
              </linearGradient>
              <clipPath id="ai-clip"><rect x="0" y="0" :width="clipW" height="220" class="clip" /></clipPath>
            </defs>
            <line :x1="X0" :x2="X1" :y1="Y0" :y2="Y0" class="base-l" />
            <path :d="curve" class="ghost" />
            <g clip-path="url(#ai-clip)">
              <path :d="area" fill="url(#ai-a)" />
              <path :d="curve" class="line" />
            </g>
            <line :x1="dot.x" :x2="dot.x" :y1="dot.y" :y2="Y0" class="guide" />
            <circle :cx="dot.x" :cy="dot.y" r="14" class="halo" />
            <circle :cx="dot.x" :cy="dot.y" r="7" class="dot" />
            <text :x="X0" :y="Y0 + 22" class="axis">General model</text>
            <text :x="X1" :y="Y0 + 22" text-anchor="end" class="axis">Tuned to you</text>
          </svg>

          <div class="ctl">
            <label for="ai-rng">Months of your history <b>{{ months }}</b></label>
            <input
              id="ai-rng"
              type="range"
              :min="0"
              :max="MAX"
              step="1"
              :value="months"
              :style="{ '--p': (months / MAX) * 100 + '%' }"
              @input="setMonths(+$event.target.value)"
            />
          </div>
        </div>
      </div>

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
.head { text-align: center; max-width: 800px; margin: 0 auto 52px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 64ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }

.board { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 18px; padding: 18px; border-radius: 36px; background: #faf9ff; border: 1.5px solid var(--line); opacity: .35; transform: translateY(16px); transition: all .8s cubic-bezier(.3, .8, .3, 1); }
.board.on { opacity: 1; transform: none; box-shadow: 0 26px 56px rgba(60, 50, 120, .11); }
.left, .right { background: #fff; border-radius: 28px; padding: 24px; min-width: 0; }

/* left */
.left { display: flex; flex-direction: column; align-items: stretch; gap: 12px; }
.step.base { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; padding: 10px 18px; border-radius: 99px; background: #eceef2; color: #6c7084; font-size: 13px; font-weight: 600; }
.step.base i { width: 9px; height: 9px; border-radius: 50%; background: #9a9db0; }
.arr { width: 22px; height: 22px; align-self: flex-start; margin-left: 18px; color: #c9c5df; }
.cap { margin: 0; font-size: 10.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.src { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.src li { display: flex; align-items: center; gap: 12px; padding: 10px 14px 10px 10px; border-radius: 20px; border: 1.5px dashed #ddd8f2; color: #a29fb2; transition: all .5s cubic-bezier(.3, .8, .3, 1); }
.src .ic { flex: none; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; background: #f1eff8; transition: all .5s; }
.src .ic svg { width: 16px; height: 16px; }
.src b { font-size: 13px; font-weight: 600; }
.src li.lit { border: 1.5px solid transparent; background: var(--t); color: var(--ti); transform: translateX(6px); }
.src li.lit .ic { background: #fff; }
.result { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; margin-top: 6px; padding: 10px 18px; border-radius: 99px; background: #f1eff8; color: var(--muted); font-size: 12.5px; font-weight: 600; transition: all .5s; }
.result i { width: 9px; height: 9px; border-radius: 50%; background: #b8b4cc; }
.result.done { background: var(--ink); color: #fff; }
.result.done i { background: #7be0ae; box-shadow: 0 0 0 4px rgba(123, 224, 174, .25); }

/* right */
.right { display: flex; flex-direction: column; gap: 10px; }
.num b { font-size: clamp(54px, 6vw, 76px); font-weight: 600; letter-spacing: -.05em; line-height: 1; font-variant-numeric: tabular-nums; color: var(--lav-i); }
.num b span { font-size: .5em; letter-spacing: 0; margin-left: 2px; }
.num small { display: block; margin-top: 4px; font-size: 12px; color: var(--muted); }
.chart { display: block; width: 100%; height: auto; overflow: visible; }
.base-l { stroke: #ece9f3; stroke-width: 1.5; }
.ghost { fill: none; stroke: #e3dff2; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 2 7; }
.line { fill: none; stroke: var(--lav-i); stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
.guide { stroke: #cfcae6; stroke-width: 1.5; stroke-dasharray: 3 4; }
.halo { fill: rgba(125, 107, 230, .18); }
.dot { fill: var(--lav-i); stroke: #fff; stroke-width: 3; }
.axis { font-size: 10.5px; font-weight: 600; fill: #a3a6b4; font-family: "Poppins", system-ui, sans-serif; }
.clip { transition: width .45s cubic-bezier(.3, .8, .3, 1); }
.halo, .dot, .guide { transition: all .45s cubic-bezier(.3, .8, .3, 1); }

.ctl { display: flex; flex-direction: column; gap: 8px; padding-top: 6px; }
.ctl label { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--muted); }
.ctl label b { color: var(--ink); font-variant-numeric: tabular-nums; }
.ctl input[type="range"] { -webkit-appearance: none; appearance: none; display: block; width: 100%; height: 22px; margin: 0; background: none; cursor: pointer; }
.ctl input[type="range"]::-webkit-slider-runnable-track { height: 6px; border-radius: 6px; background: linear-gradient(90deg, #a597ee, var(--lav-i)) 0 / var(--p) 100% no-repeat, #ece6e2; }
.ctl input[type="range"]::-moz-range-track { height: 6px; border-radius: 6px; background: #ece6e2; }
.ctl input[type="range"]::-moz-range-progress { height: 6px; border-radius: 6px; background: var(--lav-i); }
.ctl input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; margin-top: -8px; border-radius: 50%; background: #fff; border: 2px solid var(--lav-i); box-shadow: 0 6px 12px -4px rgba(125, 107, 230, .6); }
.ctl input[type="range"]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 2px solid var(--lav-i); }
.ctl input[type="range"]:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 6px; border-radius: 8px; }

.note { margin: 28px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 860px) {
  .board { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .board { padding: 12px; border-radius: 28px; }
  .left, .right { padding: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
