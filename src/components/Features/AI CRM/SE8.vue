<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AiSalesForecastingSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref(false);
const deals = ref(0);
let io = null;
let timer = null;
let touched = false;

const imgs = { hero: "/saptivo/images/features/businesswoman-presents-finance-report-on-whiteboar-2026-09-21-13-35-17-utc.webp" };
const heroOk = ref(true);

/* All figures are SAMPLE data (LKR millions of closed revenue per month). */
const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const actual = [6.1, 6.8, 7.4];
const likely0 = [7.9, 8.6, 9.8];
const best0 = [8.5, 9.6, 11.4];
const worst0 = [7.3, 7.6, 8.4];
const team = [8.4, 9.4, 10.6];
const PER_DEAL = [0.1, 0.1, 0.15];

const likely = computed(() => likely0.map((v, i) => v + deals.value * PER_DEAL[i]));
const best = computed(() => best0.map((v, i) => v + deals.value * PER_DEAL[i]));
const worst = computed(() => worst0.map((v, i) => v + deals.value * PER_DEAL[i] * 0.5));
const sum = (a) => a.reduce((x, y) => x + y, 0);
const fm = (v) => "LKR " + v.toFixed(1) + "M";
const totals = computed(() => ({
  worst: sum(worst.value),
  likely: sum(likely.value),
  best: sum(best.value),
  team: sum(team),
}));
const gap = computed(() => totals.value.likely - totals.value.team);
const added = computed(() => deals.value * sum(PER_DEAL));

/* chart geometry */
const W = 560;
const H = 290;
const X0 = 52;
const X1 = 530;
const Y0 = 252;
const Y1 = 30;
const VMIN = 5;
const VMAX = 13;
const px = (i) => X0 + (i * (X1 - X0)) / (months.length - 1);
const py = (v) => Y0 - ((v - VMIN) / (VMAX - VMIN)) * (Y0 - Y1);
const line = (pts) => pts.map(([i, v], k) => `${k ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
const join = (f) => [[2, actual[2]], ...f.map((v, k) => [k + 3, v])];

const actualPath = line(actual.map((v, i) => [i, v]));
const likelyPath = computed(() => line(join(likely.value)));
const teamPath = line(join(team));
const bandPath = computed(() => {
  const up = join(best.value);
  const lo = join(worst.value).reverse();
  return line([...up, ...lo]) + " Z";
});
const grid = [6, 8, 10, 12];

function setDeals(v) {
  touched = true;
  clearInterval(timer);
  deals.value = v;
}

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    seen.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      shown.value = true;
      seen.value = true;
      io.disconnect();
      /* short auto-demo: add four deals, then leave the slider to the visitor */
      setTimeout(() => {
        if (touched) return;
        timer = setInterval(() => {
          if (touched || deals.value >= 4) return clearInterval(timer);
          deals.value += 1;
        }, 650);
      }, 2200);
    },
    { threshold: 0.3 }
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
        <h2><span class="l1">AI sales</span> <span class="l2">forecasting</span></h2>
        <p class="sub">
          Beyond weighted pipeline maths, AI sales forecasting analyses rep behaviour, deal velocity and seasonality to produce best, likely and worst-case forecasts, compared side by side with your team's own forecast. What-if modelling shows the effect of closing more deals.
        </p>
      </header>

      <div class="layout">
        <!-- image -->
        <figure class="hero" :class="{ on: seen }">
          <img v-if="heroOk" :src="imgs.hero" alt="Sales manager reviewing the quarterly forecast" loading="lazy" @error="heroOk = false" />
          <svg v-else class="fb" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="fc-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#e8e3ff" />
                <stop offset="1" stop-color="#dcecfb" />
              </linearGradient>
            </defs>
            <rect width="400" height="600" fill="url(#fc-g)" />
            <circle cx="320" cy="100" r="120" fill="#fff" opacity=".5" />
            <rect x="56" y="170" width="288" height="210" rx="28" fill="#fff" />
            <g fill="#e8e3ff"><rect x="86" y="300" width="30" height="50" rx="8" /><rect x="132" y="272" width="30" height="78" rx="8" /><rect x="178" y="248" width="30" height="102" rx="8" /></g>
            <g fill="#7d6be6"><rect x="224" y="226" width="30" height="124" rx="8" /><rect x="270" y="196" width="30" height="154" rx="8" /></g>
            <path d="M86 250c40-14 70-40 116-62s70-8 98-34" fill="none" stroke="#2f9c6b" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 12" />
          </svg>
          <div class="shade"></div>
          <figcaption>
            <span class="p1 tone-lav"><i></i>Rep behaviour analysed</span>
            <span class="p2 tone-sky"><i></i>Deal velocity tracked</span>
            <span class="p3 tone-mint"><i></i>Seasonality applied</span>
          </figcaption>
        </figure>

        <!-- forecast card -->
        <div class="card" :class="{ on: seen }">
          <div class="ch">
            <b>Next 3 months · closed revenue</b>
            <ul class="lg" aria-label="Chart key">
              <li><i class="a"></i>Actual</li>
              <li><i class="l"></i>AI likely</li>
              <li><i class="r"></i>AI range</li>
              <li><i class="t"></i>Team forecast</li>
            </ul>
          </div>

          <svg class="chart" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Chart comparing the AI forecast range with the team forecast">
            <defs>
              <clipPath id="fc-clip">
                <rect class="reveal" :class="{ go: seen }" x="0" y="0" :width="W" :height="H" />
              </clipPath>
            </defs>

            <g class="grid">
              <g v-for="g in grid" :key="g">
                <line :x1="X0" :x2="X1" :y1="py(g)" :y2="py(g)" />
                <text :x="X0 - 10" :y="py(g) + 4" text-anchor="end">{{ g }}M</text>
              </g>
              <text v-for="(m, i) in months" :key="m" :x="px(i)" :y="Y0 + 24" text-anchor="middle">{{ m }}</text>
            </g>

            <!-- today marker -->
            <line :x1="px(2)" :x2="px(2)" :y1="Y1 - 6" :y2="Y0" class="today" />
            <text :x="px(2)" :y="Y1 - 12" text-anchor="middle" class="todayt">Today</text>

            <g clip-path="url(#fc-clip)">
              <path :d="bandPath" class="band" />
              <path :d="teamPath" class="team" />
              <path :d="actualPath" class="act" />
              <path :d="likelyPath" class="lik" />
              <circle v-for="(v, k) in likely" :key="'l' + k" :cx="px(k + 3)" :cy="py(v)" r="5" class="ldot" />
              <rect v-for="(v, k) in team" :key="'t' + k" :x="px(k + 3) - 4" :y="py(v) - 4" width="8" height="8" rx="2" class="tdot" />
              <circle v-for="(v, k) in actual" :key="'a' + k" :cx="px(k)" :cy="py(v)" r="4.5" class="adot" />
            </g>
          </svg>

          <div class="tiles">
            <div class="t"><small>Worst case</small><b>{{ fm(totals.worst) }}</b></div>
            <div class="t hi"><small>AI likely</small><b>{{ fm(totals.likely) }}</b></div>
            <div class="t"><small>Best case</small><b>{{ fm(totals.best) }}</b></div>
            <div class="t tm"><small>Team forecast</small><b>{{ fm(totals.team) }}</b></div>
          </div>
          <p class="gap" :class="gap < 0 ? 'below' : 'above'">
            AI likely is <b>{{ fm(Math.abs(gap)) }}</b> {{ gap < 0 ? "below" : "above" }} your team's forecast.
          </p>

          <div class="wi">
            <label for="fc-rng">
              What if we close <b>{{ deals }} more {{ deals === 1 ? "deal" : "deals" }}</b>?
              <span v-if="deals">Likely +{{ fm(added) }}</span>
            </label>
            <input
              id="fc-rng"
              type="range"
              min="0"
              max="8"
              step="1"
              :value="deals"
              :style="{ '--p': (deals / 8) * 100 + '%' }"
              @input="setDeals(+$event.target.value)"
            />
            <small>Each extra deal adds about LKR 0.35M (sample).</small>
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
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 800px; margin: 0 auto 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 64ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }

.layout { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 18px; align-items: stretch; }

/* image */
.hero { position: relative; margin: 0; min-height: 560px; border-radius: 34px; overflow: hidden; background: #f1eefb; opacity: .35; transform: translateY(14px); transition: all .8s cubic-bezier(.3, .8, .3, 1); box-shadow: 0 24px 54px rgba(60, 50, 120, .12); }
.hero.on { opacity: 1; transform: none; }
.hero img, .hero .fb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; display: block; }
.hero .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, 0) 50%, rgba(20, 18, 15, .55) 100%); }
.hero figcaption { position: absolute; left: 18px; right: 18px; bottom: 18px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.hero figcaption span { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 99px; background: #fff; color: var(--ink); font-size: 12.5px; font-weight: 600; box-shadow: 0 10px 24px rgba(20, 18, 15, .18); opacity: 0; transform: translateY(12px); }
.hero figcaption i { width: 9px; height: 9px; border-radius: 50%; background: var(--ti); box-shadow: 0 0 0 4px color-mix(in srgb, var(--ti) 22%, transparent); }
.hero.on figcaption span { animation: chip .6s cubic-bezier(.3, 1.3, .5, 1) both; }
.hero.on .p1 { animation-delay: .5s; }
.hero.on .p2 { animation-delay: 1.1s; }
.hero.on .p3 { animation-delay: 1.7s; }
@keyframes chip { to { opacity: 1; transform: none; } }

/* forecast card */
.card { background: #faf9ff; border: 1.5px solid var(--line); border-radius: 30px; padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 14px; opacity: .35; transform: translateY(14px); transition: all .7s cubic-bezier(.3, .8, .3, 1); min-width: 0; }
.card.on { opacity: 1; transform: none; background: #fff; box-shadow: 0 20px 44px rgba(60, 50, 120, .1); }
.ch { display: flex; align-items: center; justify-content: space-between; gap: 10px 16px; flex-wrap: wrap; }
.ch b { font-size: 15px; }
.lg { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 11px; font-weight: 600; color: var(--muted); }
.lg li { display: flex; align-items: center; gap: 6px; }
.lg i { width: 12px; height: 12px; border-radius: 4px; }
.lg .a { background: var(--ink); border-radius: 50%; }
.lg .l { background: var(--lav-i); border-radius: 50%; }
.lg .r { background: var(--lav); }
.lg .t { background: var(--butter-i); }

.chart { display: block; width: 100%; height: auto; overflow: visible; }
.grid line { stroke: #efecf7; stroke-width: 1; }
.grid text { font-size: 10.5px; fill: #a3a6b4; font-family: "Poppins", system-ui, sans-serif; }
.today { stroke: #cfcae6; stroke-width: 1.5; stroke-dasharray: 4 5; }
.todayt { font-size: 10px; font-weight: 600; fill: var(--muted); font-family: "Poppins", system-ui, sans-serif; }
.band { fill: var(--lav); opacity: .85; }
.act { fill: none; stroke: var(--ink); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.lik { fill: none; stroke: var(--lav-i); stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 2 8; }
.team { fill: none; stroke: var(--butter-i); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.adot { fill: var(--ink); stroke: #fff; stroke-width: 2; }
.ldot { fill: var(--lav-i); stroke: #fff; stroke-width: 2.5; }
.tdot { fill: var(--butter-i); stroke: #fff; stroke-width: 2; }
.reveal { width: 0; }
.reveal.go { animation: wipe 1.6s cubic-bezier(.3, .8, .3, 1) .3s both; }
@keyframes wipe { to { width: 560px; } }

.tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.t { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 16px; background: #f6f4ff; }
.t small { font-size: 10.5px; font-weight: 600; letter-spacing: .04em; color: var(--muted); }
.t b { font-size: 15px; font-variant-numeric: tabular-nums; letter-spacing: -.01em; }
.t.hi { background: var(--lav); }
.t.hi small, .t.hi b { color: var(--lav-i); }
.t.tm { background: var(--butter); }
.t.tm small, .t.tm b { color: var(--butter-i); }
.gap { margin: 0; padding: 10px 14px; border-radius: 14px; font-size: 12.5px; }
.gap.below { background: #fff6f8; color: var(--rose-i); }
.gap.above { background: #f7fcf9; color: var(--mint-i); }
.gap b { font-variant-numeric: tabular-nums; }

.wi { padding: 14px 16px; border-radius: 20px; background: #faf9ff; border: 1.5px solid var(--line); display: flex; flex-direction: column; gap: 10px; }
.wi label { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; font-size: 13px; }
.wi label b { font-weight: 700; }
.wi label span { font-size: 12px; font-weight: 700; color: var(--mint-i); }
.wi small { font-size: 11px; color: #a3a6b4; }
.wi input[type="range"] { -webkit-appearance: none; appearance: none; display: block; width: 100%; height: 22px; margin: 0; background: none; cursor: pointer; }
.wi input[type="range"]::-webkit-slider-runnable-track { height: 6px; border-radius: 6px; background: linear-gradient(90deg, #a597ee, var(--lav-i)) 0 / var(--p) 100% no-repeat, #ece6e2; }
.wi input[type="range"]::-moz-range-track { height: 6px; border-radius: 6px; background: #ece6e2; }
.wi input[type="range"]::-moz-range-progress { height: 6px; border-radius: 6px; background: var(--lav-i); }
.wi input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; margin-top: -8px; border-radius: 50%; background: #fff; border: 2px solid var(--lav-i); box-shadow: 0 6px 12px -4px rgba(125, 107, 230, .6); }
.wi input[type="range"]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 2px solid var(--lav-i); }
.wi input[type="range"]:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 6px; border-radius: 8px; }

.note { margin: 26px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 960px) {
  .layout { grid-template-columns: minmax(0, 1fr); }
  .hero { min-height: 320px; }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .card { padding: 16px; }
  .tiles { grid-template-columns: repeat(2, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .reveal, .reveal.go { animation: none; width: 560px; }
  .hero.on figcaption span { animation: none; }
  .hero figcaption span { opacity: 1; transform: none; }
  * { transition-duration: 0s !important; }
}
</style>
