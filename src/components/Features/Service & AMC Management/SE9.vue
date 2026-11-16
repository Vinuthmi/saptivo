<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ServiceAnalyticsSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
const manual = ref(false);
const photoOk = ref(true);
let timer = null;
let io = null;
let reduce = false;

const photo = "/saptivo/images/features/professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg";

const items = [
  "Technician productivity and first-time fix rate",
  "SLA compliance: met versus breached",
  "AMC renewal rate and churn",
  "Equipment reliability by brand and model",
  "Contract profitability: AMC revenue versus visit and parts cost",
  "Service revenue forecast from active contracts",
  "Customer satisfaction per technician and job type",
];

/* data */
const techs = [
  { n: "Chaminda", f: 92, j: 6.2 },
  { n: "Hiran", f: 88, j: 5.8 },
  { n: "Nuwan", f: 81, j: 5.1 },
  { n: "Ruwan", f: 76, j: 4.9 },
];
const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const met = [88, 90, 91, 89, 93, 94];
const renew = [78, 80, 79, 83, 85, 87];
const rel = [
  { n: "Aerofrost AC-18INV", v: 2.1 },
  { n: "Aerofrost AC-24INV", v: 3.4 },
  { n: "Coolwave CW-18", v: 4.2 },
  { n: "Coolwave CW-12", v: 5.8 },
];
const contracts = [
  { n: "AMC-131", rev: 96, vis: 28, par: 12 },
  { n: "AMC-112", rev: 74, vis: 21, par: 16.5 },
  { n: "AMC-087", rev: 52, vis: 24, par: 21 },
];
const fmonths = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const fc = [4.1, 4.2, 4.2, 4.4, 4.5, 4.6];
const sat = [
  { n: "Chaminda", v: [4.8, 4.7, 4.5] },
  { n: "Hiran", v: [4.6, 4.6, 4.2] },
  { n: "Nuwan", v: [4.4, 4.3, 3.9] },
];
const jobTypes = ["Install", "Service", "Breakdown"];

const relMax = Math.max(...rel.map((r) => r.v));
const cons = contracts.map((c) => {
  const cost = c.vis + c.par;
  return { ...c, cp: Math.round((c.vis / c.rev) * 100), pp: Math.round((c.par / c.rev) * 100), mp: Math.round(((c.rev - cost) / c.rev) * 100) };
});

/* line charts */
const W = 440;
const H = 190;
function line(vals, min, max) {
  const step = (W - 40) / (vals.length - 1);
  return vals.map((v, i) => [20 + i * step, 16 + (1 - (v - min) / (max - min)) * (H - 40)]);
}
const renewPts = line(renew, 70, 90);
const fcPts = line(fc, 3.8, 4.8);
const path = (p) => p.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
const area = (p) => path(p) + " L" + p[p.length - 1][0] + " " + (H - 20) + " L" + p[0][0] + " " + (H - 20) + " Z";

const heat = (v) => 0.15 + ((v - 3.8) / 1.1) * 0.7;

const title = computed(() => items[idx.value]);

function next() {
  idx.value = (idx.value + 1) % items.length;
}
function pick(i) {
  manual.value = true;
  stop();
  idx.value = i;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 4200);
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
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="sa" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Service</span> <span class="l2">analytics</span></h2>
      </header>

      <div class="board">
        <!-- left -->
        <div class="left">
          <figure class="ph">
            <div class="bg"></div>
            <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
          </figure>

          <ol class="list" role="tablist">
            <li v-for="(t, i) in items" :key="t">
              <button type="button" role="tab" :aria-selected="idx === i" :class="{ act: idx === i }" @click="pick(i)">
                <span class="n">{{ String(i + 1).padStart(2, "0") }}</span>
                <span class="t">{{ t }}</span>
              </button>
            </li>
          </ol>
        </div>

        <!-- right: report -->
        <div class="rep" role="img" aria-label="Service analytics report charts">
          <div class="rh"><strong>{{ title }}</strong></div>

          <Transition name="fd" mode="out-in">
            <!-- 1 -->
            <div v-if="idx === 0" key="0" class="pn">
              <div class="th"><span>Technician</span><span>First-time fix rate</span><span>Jobs a day</span></div>
              <div v-for="t in techs" :key="t.n" class="tr">
                <b>{{ t.n }}</b>
                <div class="bar"><i :style="{ width: t.f + '%' }"></i><em>{{ t.f }}%</em></div>
                <span>{{ t.j }}</span>
              </div>
            </div>

            <!-- 2 -->
            <div v-else-if="idx === 1" key="1" class="pn">
              <div class="key"><span class="k1"></span>Met<span class="k2"></span>Breached</div>
              <div class="cols">
                <div v-for="(m, i) in months" :key="m" class="col">
                  <b>{{ met[i] }}%</b>
                  <div class="stack">
                    <i class="br" :style="{ height: 100 - met[i] + '%' }"></i>
                    <i class="mt" :style="{ height: met[i] + '%' }"></i>
                  </div>
                  <span>{{ m }}</span>
                </div>
              </div>
            </div>

            <!-- 3 -->
            <div v-else-if="idx === 2" key="2" class="pn">
              <div class="big"><div><b>87%</b><span>Renewal rate</span></div><div><b class="bad">13%</b><span>Churn</span></div></div>
              <svg :viewBox="'0 0 ' + W + ' ' + H" class="ch">
                <line v-for="k in 4" :key="k" x1="20" :x2="W - 20" :y1="16 + (k - 1) * 45" :y2="16 + (k - 1) * 45" class="gr" />
                <path :d="area(renewPts)" class="ar" />
                <path :d="path(renewPts)" class="ln" />
                <circle v-for="(p, i) in renewPts" :key="i" :cx="p[0]" :cy="p[1]" r="3.500" class="dt" />
                <text v-for="(p, i) in renewPts" :key="'t' + i" :x="p[0]" :y="H - 4" class="ax">{{ months[i] }}</text>
              </svg>
            </div>

            <!-- 4 -->
            <div v-else-if="idx === 3" key="3" class="pn">
              <div class="th"><span>Brand and model</span><span>Failures per 100 units a year</span><span></span></div>
              <div v-for="r in rel" :key="r.n" class="tr">
                <b>{{ r.n }}</b>
                <div class="bar"><i :class="{ hot: r.v === relMax }" :style="{ width: (r.v / relMax) * 100 + '%' }"></i></div>
                <span :class="{ hotx: r.v === relMax }">{{ r.v.toFixed(1) }}</span>
              </div>
            </div>

            <!-- 5 -->
            <div v-else-if="idx === 4" key="4" class="pn">
              <div class="key"><span class="k3"></span>Visit cost<span class="k4"></span>Parts cost<span class="k5"></span>Margin</div>
              <div v-for="c in cons" :key="c.n" class="pr">
                <div class="ph2"><b>{{ c.n }}</b><span>AMC revenue LKR {{ c.rev }}k · margin <strong :class="{ hotx: c.mp < 20 }">{{ c.mp }}%</strong></span></div>
                <div class="st">
                  <i class="vv" :style="{ width: c.cp + '%' }"></i>
                  <i class="pp" :style="{ width: c.pp + '%' }"></i>
                  <i class="mm" :style="{ width: c.mp + '%' }"></i>
                </div>
              </div>
            </div>

            <!-- 6 -->
            <div v-else-if="idx === 5" key="5" class="pn">
              <div class="big"><div><b>LKR 26.0M</b><span>Next six months, from active contracts</span></div></div>
              <svg :viewBox="'0 0 ' + W + ' ' + H" class="ch">
                <line v-for="k in 4" :key="k" x1="20" :x2="W - 20" :y1="16 + (k - 1) * 45" :y2="16 + (k - 1) * 45" class="gr" />
                <path :d="area(fcPts)" class="ar" />
                <path :d="path(fcPts)" class="ln dash" />
                <circle v-for="(p, i) in fcPts" :key="i" :cx="p[0]" :cy="p[1]" r="3.500" class="dt" />
                <text v-for="(p, i) in fcPts" :key="'t' + i" :x="p[0]" :y="H - 4" class="ax">{{ fmonths[i] }}</text>
              </svg>
            </div>

            <!-- 7 -->
            <div v-else key="6" class="pn">
              <div class="hm">
                <span></span><b v-for="j in jobTypes" :key="j">{{ j }}</b>
                <template v-for="s in sat" :key="s.n">
                  <b class="rn">{{ s.n }}</b>
                  <span v-for="(v, k) in s.v" :key="k" class="cell" :style="{ background: 'rgba(91, 75, 208,' + heat(v).toFixed(2) + ')', color: heat(v) > 0.55 ? '#fff' : '#14120f' }">{{ v.toFixed(1) }}</span>
                </template>
              </div>
              <p class="note">Score out of 5, from post-job surveys.</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sa {
  --ink: #14120f; --muted: #6b6f76; --line: #e4e2dc; --paper: #f6f5f1;
  --acc: #5b4bd0; --ok: #2c7a56; --bad: #b3261e; --warn: #c27c00;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { margin-bottom: 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; }
h2 span { display: block; }
.sa h2 .l1 { color: #111111 !important; opacity: 1; }
.sa h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.head, .board { opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .08s; }

.board { display: grid; grid-template-columns: 1fr 1.25fr; gap: 56px; align-items: start; }

.left { display: flex; flex-direction: column; gap: 28px; }
.ph { margin: 0; position: relative; aspect-ratio: 16 / 10; border-radius: 14px; overflow: hidden; background: #25232b; }
.bg { position: absolute; inset: 0; background: linear-gradient(160deg, #3a3744, #1f1d25); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }

.list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.list li { border-bottom: 1px solid var(--line); }
.list button { all: unset; box-sizing: border-box; cursor: pointer; position: relative; width: 100%; display: grid; grid-template-columns: 40px 1fr; align-items: baseline; padding: 14px 0; color: var(--muted); transition: color .25s; }
.list button:hover { color: var(--ink); }
.list button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.list button::before { content: ""; position: absolute; left: -14px; top: 12px; bottom: 12px; width: 2px; background: var(--ink); transform: scaleY(0); transition: transform .3s ease; }
.list button.act { color: var(--ink); }
.list button.act::before { transform: scaleY(1); }
.n { font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; }
.t { font-size: 15px; font-weight: 500; line-height: 1.45; }

/* report */
.rep { border: 1px solid var(--line); border-radius: 14px; padding: 26px 28px 28px; min-height: 480px; display: flex; flex-direction: column; gap: 22px; min-width: 0; }
.rh strong { font-size: 18px; font-weight: 500; letter-spacing: -.01em; line-height: 1.4; }
.fd-enter-active, .fd-leave-active { transition: opacity .22s ease; }
.fd-enter-from, .fd-leave-to { opacity: 0; }
.pn { display: flex; flex-direction: column; gap: 14px; flex: 1; }

.th { display: grid; grid-template-columns: 120px 1fr 64px; gap: 16px; font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); padding-bottom: 10px; border-bottom: 1px solid var(--line); }
.th span:last-child { text-align: right; }
.tr { display: grid; grid-template-columns: 120px 1fr 64px; gap: 16px; align-items: center; padding: 8px 0; font-size: 13.5px; }
.tr b { font-weight: 500; }
.tr > span { text-align: right; font-variant-numeric: tabular-nums; color: var(--muted); }
.bar { position: relative; height: 22px; background: var(--paper); border-radius: 4px; overflow: hidden; }
.bar i { display: block; height: 100%; background: var(--ink); border-radius: 4px; transform-origin: left; animation: gx .8s cubic-bezier(.3, .8, .3, 1) both; }
.bar i.hot { background: var(--bad); }
.bar em { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-style: normal; font-size: 12px; font-weight: 600; color: #fff; mix-blend-mode: normal; }
.hotx { color: var(--bad) !important; font-weight: 600; }
@keyframes gx { from { transform: scaleX(0); } to { transform: none; } }

.key { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; color: var(--muted); }
.key span { width: 10px; height: 10px; border-radius: 2px; margin-left: 10px; }
.key span:first-child { margin-left: 0; }
.k1 { background: var(--ink); } .k2 { background: var(--bad); } .k3 { background: #b8b5ab; } .k4 { background: #8a8f97; } .k5 { background: var(--ok); }
.cols { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; align-items: end; min-height: 280px; }
.col { height: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.col b { font-size: 12.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
.col span { font-size: 12px; color: var(--muted); }
.stack { flex: 1; width: 100%; max-width: 46px; display: flex; flex-direction: column; border-radius: 4px; overflow: hidden; transform-origin: bottom; animation: gy .8s cubic-bezier(.3, .8, .3, 1) both; }
.stack .mt { background: var(--ink); }
.stack .br { background: var(--bad); }
@keyframes gy { from { transform: scaleY(0); } to { transform: none; } }

.big { display: flex; gap: 48px; }
.big b { display: block; font-size: 44px; font-weight: 500; letter-spacing: -.03em; line-height: 1.1; font-variant-numeric: tabular-nums; }
.big b.bad { color: var(--bad); }
.big span { font-size: 13px; color: var(--muted); }
.ch { width: 100%; height: auto; overflow: visible; }
.gr { stroke: var(--line); stroke-width: 1; }
.ar { fill: rgba(91, 75, 208, .08); }
.ln { fill: none; stroke: var(--acc); stroke-width: 2.500; stroke-linejoin: round; stroke-linecap: round; stroke-dasharray: 700; stroke-dashoffset: 700; animation: dr 1.4s ease forwards; }
.ln.dash { stroke-dasharray: 6 6; stroke-dashoffset: 0; animation: fadein 1s ease both; }
@keyframes dr { to { stroke-dashoffset: 0; } }
@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
.dt { fill: #fff; stroke: var(--acc); stroke-width: 2; }
.ax { font-size: 11px; fill: var(--muted); text-anchor: middle; font-family: inherit; }

.pr { display: flex; flex-direction: column; gap: 8px; padding: 10px 0; border-bottom: 1px solid var(--line); }
.pr:last-child { border-bottom: 0; }
.ph2 { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; font-size: 13.5px; }
.ph2 b { font-weight: 500; }
.ph2 span { font-size: 12px; color: var(--muted); }
.ph2 strong { color: var(--ok); font-weight: 600; }
.st { display: flex; height: 22px; border-radius: 4px; overflow: hidden; background: var(--paper); }
.st i { display: block; height: 100%; animation: gx .8s cubic-bezier(.3, .8, .3, 1) both; transform-origin: left; }
.vv { background: #b8b5ab; } .pp { background: #8a8f97; } .mm { background: var(--ok); }

.hm { display: grid; grid-template-columns: 110px repeat(3, 1fr); gap: 8px; align-items: center; }
.hm b { font-size: 12px; font-weight: 600; color: var(--muted); text-align: center; }
.hm .rn { text-align: left; color: var(--ink); font-weight: 500; font-size: 13.5px; }
.cell { display: grid; place-items: center; height: 56px; border-radius: 6px; font-size: 16px; font-weight: 500; font-variant-numeric: tabular-nums; animation: fadein .5s ease both; }
.note { margin: 4px 0 0; font-size: 12px; color: var(--muted); }

@media (max-width: 960px) {
  .board { grid-template-columns: 1fr; gap: 36px; }
  .list button::before { left: -10px; }
}
@media (max-width: 640px) {
  .sa { padding: 64px 16px; }
  .rep { padding: 20px; }
  .th, .tr { grid-template-columns: 84px 1fr 44px; gap: 10px; }
  .big { gap: 28px; }
  .big b { font-size: 34px; }
  .hm { grid-template-columns: 74px repeat(3, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .bar i, .stack, .ln, .st i, .cell { animation: none; }
  .ln { stroke-dashoffset: 0; }
  * { transition-duration: 0s !important; }
}
</style>
