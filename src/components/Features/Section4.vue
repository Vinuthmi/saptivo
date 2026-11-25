<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WorkSmarter" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const nodes = [
  { t: "New lead", s: "WhatsApp", c: "lav" },
  { t: "Score is 70 or more", s: "Condition", c: "sky" },
  { t: "Assign to Sales, Colombo", s: "Routing", c: "mint" },
  { t: "Follow up in 1 hour", s: "Reminder", c: "butter" },
];
const kpis = [
  { k: "Revenue", v: "Rs. 12.4M", d: "+18%" },
  { k: "Win rate", v: "34%", d: "+4%" },
  { k: "First reply", v: "2.1 h", d: "-22%" },
];
const chips = [
  { t: "Win probability 78%", g: true },
  { t: "Lead score 86" },
  { t: "Churn risk: Low" },
];

const step = computed(() => (still.value ? 3 : n.value % 6));
const lit = computed(() => Math.min(step.value, 3));
const runs = computed(() => 128 + (still.value ? 0 : Math.floor(n.value / 6)));
const sub = computed(() => (still.value ? 9 : n.value % 12));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 900);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    still.value = true;
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
  <section id="automation" ref="root" class="ws" :class="{ in: shown }" aria-labelledby="ws-title">
    <div class="wrap">
      <header class="head">
        <h2 id="ws-title"><span class="l1">Work</span> <span class="l2">smarter</span></h2>
      </header>

      <div class="grid">
        <!-- workflow -->
        <article class="card wf">
          <div class="live"><i></i>Automation running · {{ runs }} runs today</div>
          <div class="flow" aria-hidden="true">
            <template v-for="(nd, i) in nodes" :key="nd.t">
              <div class="node" :class="[nd.c, { on: i <= lit && !(step >= 4) || (still && i <= 3) }]">
                <span class="dot"></span>
                <b>{{ nd.t }}</b>
                <small>{{ nd.s }}</small>
              </div>
              <i v-if="i < nodes.length - 1" class="wire"><u :class="{ f: (i < lit && step < 4) || still }"></u></i>
            </template>
          </div>
          <div class="txt">
            <h3>Workflow automation</h3>
            <p>A no-code builder for follow-ups, routing, approvals and escalations.</p>
          </div>
        </article>

        <!-- reports -->
        <article class="card rp">
          <div class="vis" aria-hidden="true">
            <div class="kpis">
              <div v-for="k in kpis" :key="k.k" class="kpi"><small>{{ k.k }}</small><b>{{ k.v }}</b><em>{{ k.d }}</em></div>
            </div>
            <div class="chart">
              <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                <path class="area" d="M0 82 L40 70 L80 76 L120 50 L160 56 L200 30 L240 36 L300 10 L300 100 L0 100 Z" />
                <path class="ln" pathLength="1" d="M0 82 L40 70 L80 76 L120 50 L160 56 L200 30 L240 36 L300 10" />
              </svg>
              <i class="end"></i>
            </div>
          </div>
          <div class="txt">
            <h3>Reports and analytics</h3>
            <p>Real-time dashboards, custom reports and one-click exports.</p>
          </div>
        </article>

        <!-- AI -->
        <article class="card ai">
          <div class="vis" aria-hidden="true">
            <div class="chips">
              <span v-for="(c, i) in chips" :key="c.t" class="chip" :class="{ g: c.g, vis: sub >= i + 1 }">{{ c.t }}</span>
              <span class="chip dr" :class="{ vis: sub >= 4 }">AI drafting reply<i class="dots"><b></b><b></b><b></b></i></span>
            </div>
          </div>
          <div class="txt">
            <h3>AI CRM</h3>
            <p>Lead scoring, win probability, churn prediction, email drafting and call summaries.</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ws {
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
  scroll-margin-top: 100px;
}
.ws *, .ws *::before, .ws *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; margin: 0 auto 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ws h2 .l1 { color: #111111 !important; opacity: 1; }
.ws h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .1s; }

.grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-rows: auto auto; gap: 14px; }
.card { border-radius: 28px; padding: 26px; display: flex; flex-direction: column; gap: 22px; min-width: 0; }
.wf { grid-row: span 2; background: var(--lav); }
.rp { background: var(--sky); }
.ai { background: var(--mint); }
.txt { margin-top: auto; }
h3 { margin: 0 0 6px; font-size: 20px; font-weight: 500; letter-spacing: -.02em; }
.txt p { margin: 0; font-size: 14.5px; line-height: 1.7; color: var(--muted); max-width: 44ch; }

/* workflow */
.live { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 99px; background: #fff; font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; }
.live i { width: 7px; height: 7px; border-radius: 50%; background: var(--mint-i); animation: bl 1.4s ease-in-out infinite; }
@keyframes bl { 50% { opacity: .25; } }
.flow { display: flex; flex-direction: column; align-items: stretch; padding: 6px 0; max-width: 400px; width: 100%; margin: 0 auto; }
.node { display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 16px; padding: 14px 16px; border: 1.5px solid transparent; opacity: .55; transition: all .4s ease; }
.node.on { opacity: 1; border-color: var(--ink); }
.node .dot { width: 10px; height: 10px; border-radius: 50%; background: #c9ccd2; flex: none; transition: background .3s; }
.node.on.lav .dot { background: var(--lav-i); } .node.on.sky .dot { background: var(--sky-i); } .node.on.mint .dot { background: var(--mint-i); } .node.on.butter .dot { background: #d8b13a; }
.node b { font-size: 13.5px; font-weight: 500; flex: 1; }
.node small { font-size: 11.5px; color: var(--muted); }
.wire { display: block; position: relative; width: 2px; height: 22px; margin-left: 21px; background: rgba(20, 18, 15, .12); overflow: hidden; }
.wire u { position: absolute; left: 0; top: 0; width: 100%; height: 0; background: var(--ink); transition: height .45s ease; }
.wire u.f { height: 100%; }

/* reports */
.kpis { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.kpi { background: #fff; border-radius: 14px; padding: 10px 12px; display: grid; gap: 1px; }
.kpi small { font-size: 11px; color: var(--muted); }
.kpi b { font-size: 15px; font-weight: 600; letter-spacing: -.02em; }
.kpi em { font-style: normal; font-size: 11px; font-weight: 600; color: var(--mint-i); }
.chart { position: relative; background: #fff; border-radius: 14px; padding: 14px; margin-top: 8px; height: 120px; }
.chart svg { display: block; width: 100%; height: 100%; overflow: visible; }
.area { fill: rgba(58, 127, 189, .12); opacity: 0; transition: opacity 1s ease 1.2s; }
.ln { fill: none; stroke: var(--sky-i); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s cubic-bezier(.4, 0, .2, 1) .3s; vector-effect: non-scaling-stroke; }
.in .ln { stroke-dashoffset: 0; }
.in .area { opacity: 1; }
.end { position: absolute; right: 9px; top: calc(14px + 92px * .1 - 5px); width: 10px; height: 10px; border-radius: 50%; background: var(--sky-i); animation: pg 2s ease-out infinite; }
@keyframes pg { 0% { box-shadow: 0 0 0 0 rgba(58, 127, 189, .45); } 100% { box-shadow: 0 0 0 12px rgba(58, 127, 189, 0); } }

/* AI */
.chips { display: flex; flex-wrap: wrap; gap: 8px; min-height: 84px; align-content: flex-start; }
.chip { padding: 8px 16px; border-radius: 99px; background: #fff; font-size: 12.5px; font-weight: 500; opacity: .2; transform: translateY(6px); transition: all .45s ease; display: inline-flex; align-items: center; }
.chip.vis { opacity: 1; transform: none; }
.chip.g { background: var(--ink); color: #fff; }
.dots { display: inline-flex; gap: 3px; margin-left: 8px; }
.dots b { width: 4px; height: 4px; border-radius: 50%; background: var(--mint-i); animation: dt .9s ease-in-out infinite; }
.dots b:nth-child(2) { animation-delay: .15s; } .dots b:nth-child(3) { animation-delay: .3s; }
@keyframes dt { 50% { transform: translateY(-3px); } }

@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
  .wf { grid-row: auto; }
}
@media (max-width: 640px) {
  .ws { padding: 64px 16px; }
  .card { padding: 18px; border-radius: 22px; }
  .kpis { gap: 6px; }
  .kpi { padding: 8px 10px; }
  .kpi b { font-size: 13.5px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  .ln { stroke-dashoffset: 0; transition: none; }
  .area { opacity: 1; transition: none; }
  .live i, .end, .dots b { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
