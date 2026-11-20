<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "MeasuringSection" });

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

const stats = [
  { l: "Opens", v: "1,530", tone: "lav" },
  { l: "Clicks", v: "612", tone: "sky" },
  { l: "Replies", v: "148", tone: "mint" },
  { l: "Leads created", v: "96", tone: "butter" },
  { l: "Deals created", v: "31", tone: "rose" },
];

const groups = [
  {
    tab: "Messages",
    rows: [
      { n: "AMC expires in 30 days", r: 3.2 },
      { n: "Your service plan is ready", r: 1.9 },
      { n: "Festive offer, 15% off", r: 1.1 },
      { n: "We miss you", r: 0.6 },
    ],
  },
  {
    tab: "Segments",
    rows: [
      { n: "Gold customers", r: 3.4 },
      { n: "AMC active", r: 2.6 },
      { n: "New leads", r: 1.2 },
      { n: "Quiet for 90 days", r: 0.7 },
    ],
  },
  {
    tab: "Channels",
    rows: [
      { n: "WhatsApp", r: 3.8 },
      { n: "Email", r: 2.9 },
    ],
  },
];
const shades = ["#14120f", "#6a59d6", "#3a7fbd", "#b9bec6"];

const tab = computed(() => {
  if (manual.value >= 0) return manual.value;
  return reduce ? 0 : Math.floor(n.value / 4) % 3;
});
const sub = computed(() => (manual.value >= 0 || reduce ? 3 : n.value % 4));
const rows = computed(() => groups[tab.value].rows);
const max = computed(() => rows.value[0].r);
const sum = computed(() => rows.value.reduce((a, x) => a + x.r, 0));
const even = computed(() => 100 / rows.value.length);
const split = computed(() => rows.value.map((x) => (sub.value >= 2 ? (x.r / sum.value) * 100 : even.value)));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce || manual.value >= 0) return;
  timer = setInterval(tick, 1000);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manual.value = i;
  stop();
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
  <section ref="root" class="ms" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Measuring</span> <span class="l2">what matters</span></h2>
        <p>
          Every campaign shows opens, clicks, replies and the leads and deals it created. Over time, you'll see which
          messages, segments and channels bring revenue, and you can focus your budget there.
        </p>
      </header>

      <ul class="stats">
        <li v-for="(s, i) in stats" :key="s.l" :class="s.tone" :style="{ transitionDelay: 0.06 * i + 's' }">
          <small>{{ s.l }}</small>
          <strong>{{ s.v }}</strong>
        </li>
      </ul>

      <div class="stage">
        <article class="rk">
          <div class="bar">
            <span class="lb">Revenue by</span>
            <div class="tabs" role="tablist">
              <button v-for="(g, i) in groups" :key="g.tab" type="button" role="tab" :aria-selected="i === tab" :class="{ on: i === tab }" @click="pick(i)">{{ g.tab }}</button>
            </div>
          </div>

          <TransitionGroup name="rw" tag="ul" class="list">
            <li v-for="(r, i) in rows" :key="tab + r.n" :class="{ top: i === 0 }">
              <span class="no">{{ i + 1 }}</span>
              <span class="nm">{{ r.n }}</span>
              <span class="tk"><i :style="{ width: (shown ? (r.r / max) * 100 : 0) + '%' }"></i></span>
              <b>LKR {{ r.r.toFixed(1) }}M</b>
            </li>
          </TransitionGroup>
        </article>

        <article class="bg">
          <div class="who">
            <span class="av"><img v-if="ok" :src="photo" alt="" @error="ok = false" /><b v-else>N</b></span>
            <div><strong>Focus your budget</strong><small>Where the revenue comes from</small></div>
          </div>

          <div class="split">
            <small>{{ sub >= 2 ? "Suggested split" : "Even split today" }}</small>
            <div class="sb">
              <i v-for="(x, i) in rows" :key="tab + x.n" :style="{ width: split[i] + '%', background: shades[i] }"></i>
            </div>
          </div>

          <ul class="lg">
            <li v-for="(x, i) in rows" :key="tab + x.n"><i :style="{ background: shades[i] }"></i><span>{{ x.n }}</span><b>{{ Math.round(split[i]) }}%</b></li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ms {
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
.ms *, .ms *::before, .ms *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 44px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ms h2 .l1 { color: #111111 !important; opacity: 1; }
.ms h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .2s; }

.stats { list-style: none; margin: 0 0 18px; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
.stats li { border-radius: 20px; padding: 18px 20px; display: flex; flex-direction: column; gap: 4px; opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .stats li { opacity: 1; transform: none; }
.stats .lav { background: var(--lav); }
.stats .sky { background: var(--sky); }
.stats .mint { background: var(--mint); }
.stats .butter { background: var(--butter); }
.stats .rose { background: var(--rose); }
.stats small { font-size: 12.5px; color: var(--muted); }
.stats strong { font-size: 32px; font-weight: 500; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }

.stage { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 18px; align-items: stretch; }
.rk, .bg { border-radius: 26px; padding: 24px; display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.rk { border: 1px solid var(--line); }
.bg { background: #f6f7f9; }

.bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.tabs { display: flex; gap: 4px; padding: 3px; background: #f1f2f4; border-radius: 99px; }
.tabs button { all: unset; cursor: pointer; font-size: 12.5px; font-weight: 500; padding: 6px 16px; border-radius: 99px; color: var(--muted); transition: all .25s; }
.tabs button.on { background: var(--ink); color: #fff; }
.tabs button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; min-height: 200px; }
.list li { display: grid; grid-template-columns: 26px minmax(0, 1.2fr) minmax(0, 1fr) 84px; align-items: center; gap: 14px; font-size: 13.5px; }
.no { width: 24px; height: 24px; border-radius: 50%; background: #f1f2f4; display: grid; place-items: center; font-size: 11.5px; font-weight: 600; color: var(--muted); }
.top .no { background: var(--ink); color: #fff; }
.nm { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tk { height: 8px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.tk i { display: block; height: 100%; background: #c9c3ee; border-radius: 4px; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.top .tk i { background: var(--mint-i); }
.list b { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
.rw-enter-active { transition: opacity .4s ease, transform .4s ease; }
.rw-enter-from { opacity: 0; transform: translateY(8px); }
.rw-leave-active { display: none; }

.who { display: flex; align-items: center; gap: 12px; }
.who strong { display: block; font-size: 15px; font-weight: 600; }
.who small { font-size: 12.5px; color: var(--muted); }
.av { width: 42px; height: 42px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.split { display: flex; flex-direction: column; gap: 10px; }
.split small { font-size: 12.5px; font-weight: 500; color: var(--muted); }
.sb { display: flex; height: 16px; border-radius: 8px; overflow: hidden; gap: 2px; background: #fff; }
.sb i { display: block; height: 100%; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.lg { list-style: none; margin: 0; padding: 14px 16px; background: #fff; border-radius: 16px; display: flex; flex-direction: column; gap: 10px; }
.lg li { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.lg li i { width: 10px; height: 10px; border-radius: 3px; flex: none; }
.lg li span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); }
.lg li b { font-weight: 600; font-variant-numeric: tabular-nums; }

@media (max-width: 1000px) {
  .stats { grid-template-columns: repeat(3, 1fr); }
  .stage { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .ms { padding: 64px 16px; }
  .stats { grid-template-columns: 1fr 1fr; }
  .rk, .bg { padding: 18px; border-radius: 22px; }
  .list li { grid-template-columns: 24px minmax(0, 1fr) 78px; }
  .tk { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage, .stats li { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
