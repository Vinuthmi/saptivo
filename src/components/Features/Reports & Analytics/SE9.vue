<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "DecisionsSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const manual = ref(-1);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const qs = [
  {
    q: "Which lead source deserves more of your marketing budget?",
    tone: "lav",
    a: "WhatsApp", s: "8.1x return on spend", pct: 90,
    cols: ["Campaign", "Source", "Revenue"],
    rows: [["Festive offer", "WhatsApp", "LKR 1.1M"], ["Service reminder", "Email", "LKR 1.9M"], ["Facebook launch", "Facebook", "LKR 0.6M"]],
    cnt: 142,
  },
  {
    q: "Which product has the best margin?",
    tone: "sky",
    a: "AMC contracts", s: "44% margin", pct: 44,
    cols: ["Product", "Revenue", "Margin"],
    rows: [["AMC contracts", "LKR 6.2M", "44%"], ["Spare parts", "LKR 3.1M", "27%"], ["New units", "LKR 18.4M", "31%"]],
    cnt: 318,
  },
  {
    q: "Which branch needs support?",
    tone: "mint",
    a: "Galle", s: "44% of monthly target", pct: 44,
    cols: ["Branch", "Sales", "Target"],
    rows: [["Galle", "LKR 3.9M", "8.9M"], ["Kandy", "LKR 5.5M", "7.0M"], ["Colombo", "LKR 8.9M", "9.5M"]],
    cnt: 96,
  },
  {
    q: "Which salesperson needs coaching on follow-ups?",
    tone: "rose",
    a: "Ruwan", s: "5 overdue follow-ups", pct: 62,
    cols: ["Rep", "Overdue", "Avg. reply"],
    rows: [["Ruwan", "5", "2d 4h"], ["Shanika", "1", "7h"], ["Nimali", "0", "3h"]],
    cnt: 27,
  },
];

const idx = computed(() => {
  if (manual.value >= 0) return manual.value;
  return reduce ? 0 : Math.floor(n.value / 5) % 4;
});
const sub = computed(() => (manual.value >= 0 || reduce ? 4 : n.value % 5));
const cur = computed(() => qs[idx.value]);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce || manual.value >= 0) return;
  timer = setInterval(tick, 900);
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
  <section ref="root" class="dc" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Decisions you can make</span> <span class="l2">with Saptivo reports</span></h2>
        <p>
          Which lead source deserves more of your marketing budget? Which product has the best margin? Which branch
          needs support? Which salesperson needs coaching on follow-ups? Saptivo answers these questions with live data
          instead of guesswork, and every number can be traced back to the records behind it.
        </p>
      </header>

      <div class="grid">
        <button v-for="(x, i) in qs" :key="x.q" type="button" class="qc" :class="[x.tone, { act: idx === i }]" @click="pick(i)">
          <span class="no">{{ i + 1 }}</span>
          <span class="q">{{ x.q }}</span>
          <span class="ans" :class="{ show: idx === i && sub >= 1 }">
            <small>Answer from live data</small>
            <strong>{{ x.a }}</strong>
            <span class="bar"><i :style="{ width: idx === i && sub >= 1 ? x.pct + '%' : '0%' }"></i></span>
            <em>{{ x.s }}</em>
          </span>
        </button>
      </div>

      <div class="drill">
        <div class="dh">
          <span class="av"><img v-if="ok" :src="photo" alt="" @error="ok = false" /><b v-else>D</b></span>
          <div class="dt"><strong>Behind the number</strong><small>{{ cur.q }}</small></div>
          <span class="tr" :class="{ on: sub >= 2 }">Traced to {{ cur.cnt }} records</span>
        </div>
        <table>
          <thead><tr><th v-for="c in cur.cols" :key="c">{{ c }}</th></tr></thead>
          <tbody>
            <tr v-for="(r, k) in cur.rows" :key="idx + '-' + k" :class="{ vis: sub >= 3 || (sub >= 2 && k === 0), top: k === 0 }" :style="{ transitionDelay: k * 100 + 'ms' }">
              <td v-for="(c, j) in r" :key="j">{{ c }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dc {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.dc *, .dc *::before, .dc *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 860px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.dc h2 .l1 { color: #111111 !important; opacity: 1; }
.dc h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .grid, .drill { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid, .in .drill { opacity: 1; transform: none; }
.in .grid { transition-delay: .08s; }
.in .drill { transition-delay: .16s; }

.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
.qc { all: unset; box-sizing: border-box; cursor: pointer; border-radius: 26px; padding: 20px; display: flex; flex-direction: column; gap: 14px; min-height: 290px; border: 1.5px solid transparent; transition: border-color .3s, transform .3s; }
.qc:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.qc.act { border-color: var(--ink); transform: translateY(-3px); }
.qc.lav { background: var(--lav); } .qc.sky { background: var(--sky); } .qc.mint { background: var(--mint); } .qc.rose { background: var(--rose); }
.no { width: 26px; height: 26px; border-radius: 50%; background: #fff; display: grid; place-items: center; font-size: 12px; font-weight: 600; transition: all .3s; }
.act .no { background: var(--ink); color: #fff; }
.q { font-size: 17px; font-weight: 500; line-height: 1.45; letter-spacing: -.01em; }

.ans { margin-top: auto; background: #fff; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; opacity: .35; transform: translateY(6px); transition: all .45s ease; }
.ans.show { opacity: 1; transform: none; }
.ans small { font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.ans strong { font-size: 22px; font-weight: 500; letter-spacing: -.02em; }
.ans em { font-style: normal; font-size: 12.5px; color: var(--muted); }
.bar { height: 6px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.bar i { display: block; height: 100%; background: var(--ink); border-radius: 4px; transition: width 1s cubic-bezier(.2, .8, .2, 1); }

.drill { border: 1px solid var(--line); border-radius: 28px; padding: 20px 24px 12px; }
.dh { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding-bottom: 14px; }
.av { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.dt { flex: 1; min-width: 200px; display: flex; flex-direction: column; }
.dt strong { font-size: 15px; font-weight: 600; }
.dt small { font-size: 12.5px; color: var(--muted); }
.tr { font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 99px; background: #f1f2f4; color: var(--muted); transition: all .4s; }
.tr.on { background: var(--mint); color: var(--mint-i); }

table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
th { text-align: left; font-size: 11.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); padding: 10px 6px; border-top: 1px solid var(--line); }
td { padding: 14px 6px; border-top: 1px solid var(--line); font-variant-numeric: tabular-nums; }
tbody tr { opacity: .2; transition: opacity .4s ease; }
tbody tr.vis { opacity: 1; }
tbody tr.top td:first-child { font-weight: 600; }

@media (max-width: 1000px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .qc { min-height: 260px; }
}
@media (max-width: 640px) {
  .dc { padding: 64px 16px; }
  .grid { grid-template-columns: 1fr; }
  .qc { min-height: 0; border-radius: 22px; }
  .drill { padding: 16px 14px 8px; border-radius: 22px; overflow-x: auto; }
  table { min-width: 380px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid, .drill { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
