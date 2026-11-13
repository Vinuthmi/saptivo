<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ConsolidatedReportingSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
const manual = ref(false);
const photoOk = ref(true);
const exp = ref({ tax: "idle", audit: "idle" });
let timer = null;
let io = null;
let reduce = false;
const timeouts = [];

const photo = "/saptivo/images/features/confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const data = {
  Colombo: { rev: [12.4, 13.1, 12.8, 14.2, 15.0, 15.9], margin: 31, pipe: 38.5 },
  Galle: { rev: [5.2, 5.6, 5.4, 6.1, 6.3, 6.8], margin: 27, pipe: 16.2 },
  Kandy: { rev: [4.1, 4.4, 4.8, 4.6, 5.2, 5.5], margin: 29, pipe: 12.8 },
};
const filters = ["All branches", "Colombo", "Galle", "Kandy"];

const sel = computed(() => filters[idx.value]);
const series = computed(() => {
  if (idx.value === 0) {
    return months.map((_, i) => data.Colombo.rev[i] + data.Galle.rev[i] + data.Kandy.rev[i]);
  }
  return data[sel.value].rev;
});
const sum = (a) => a.reduce((s, n) => s + n, 0);
const revenue = computed(() => sum(series.value));
const margin = computed(() => {
  if (idx.value > 0) return data[sel.value].margin;
  const tot = ["Colombo", "Galle", "Kandy"].reduce((s, k) => s + sum(data[k].rev), 0);
  const w = ["Colombo", "Galle", "Kandy"].reduce((s, k) => s + sum(data[k].rev) * data[k].margin, 0);
  return Math.round(w / tot);
});
const pipeline = computed(() => (idx.value === 0 ? data.Colombo.pipe + data.Galle.pipe + data.Kandy.pipe : data[sel.value].pipe));
const maxV = computed(() => Math.max(...series.value));
const bars = computed(() => series.value.map((v, i) => ({ m: months[i], v, h: Math.round((v / maxV.value) * 100) })));

const kpis = computed(() => [
  { k: "Revenue", v: "LKR " + revenue.value.toFixed(1) + "M", s: "Last 6 months", tone: "mint" },
  { k: "Margin", v: margin.value + "%", s: "Gross margin", tone: "lav" },
  { k: "Pipeline", v: "LKR " + pipeline.value.toFixed(1) + "M", s: "Open deals", tone: "sky" },
]);

function runExport(k) {
  if (exp.value[k] !== "idle") return;
  exp.value[k] = "busy";
  timeouts.push(setTimeout(() => (exp.value[k] = "done"), 1100));
  timeouts.push(setTimeout(() => (exp.value[k] = "idle"), 3000));
}
function next() {
  idx.value = (idx.value + 1) % filters.length;
  if (idx.value === 0) runExport("tax");
  if (idx.value === 2) runExport("audit");
}
function pick(i) {
  manual.value = true;
  stop();
  idx.value = i;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 3200);
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
  <section ref="root" class="cr" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Consolidated</span> <span class="l2">reporting</span></h2>
        <p>
          Company-wide revenue, margin and pipeline reports with a branch filter. Export tax and audit reports in one
          click instead of collecting files from every location.
        </p>
      </header>

      <div class="board">
        <!-- side: photo + export -->
        <aside class="side">
          <div class="ph">
            <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
            <div class="shade"></div>
            <span class="pc"><i></i>Collected from 3 branches</span>
          </div>

          <div class="ex">
            <strong>Export in one click</strong>
            <button
              v-for="b in [{ k: 'tax', n: 'Tax report', f: 'PDF · Excel' }, { k: 'audit', n: 'Audit report', f: 'PDF · CSV' }]"
              :key="b.k"
              type="button"
              class="eb"
              :class="exp[b.k]"
              @click="runExport(b.k)"
            >
              <span class="ei">
                <svg v-if="exp[b.k] === 'done'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                <svg v-else-if="exp[b.k] === 'busy'" class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9" /></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
              </span>
              <span class="et">
                <b>{{ b.n }}</b>
                <small v-if="exp[b.k] === 'busy'">Combining all branches…</small>
                <small v-else-if="exp[b.k] === 'done'">Ready · {{ b.f }}</small>
                <small v-else>{{ sel }} · {{ b.f }}</small>
              </span>
            </button>
          </div>
        </aside>

        <!-- dashboard -->
        <div class="dash" role="img" aria-label="Revenue, margin and pipeline report that changes with the branch filter">
          <div class="bar">
            <i></i><i></i><i></i>
            <span class="ttl">Company report</span>
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

          <div class="kp">
            <div v-for="k in kpis" :key="k.k" class="kc" :class="'tone-' + k.tone">
              <span class="kl">{{ k.k }}</span>
              <Transition name="num" mode="out-in">
                <b :key="k.v">{{ k.v }}</b>
              </Transition>
              <small>{{ k.s }}</small>
            </div>
          </div>

          <div class="chart">
            <div class="ch">
              <strong>Monthly revenue</strong>
              <span>{{ sel }} · LKR millions</span>
            </div>
            <div class="bars">
              <div v-for="b in bars" :key="b.m" class="bc">
                <span class="bv">{{ b.v.toFixed(1) }}</span>
                <div class="bt"><i :style="{ height: b.h + '%' }"></i></div>
                <span class="bm">{{ b.m }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cr {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 44px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.cr h2 .l1 { color: #111111 !important; opacity: 1; }
.cr h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .board { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .1s; }

.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }

.board { display: grid; grid-template-columns: 300px 1fr; gap: 20px; align-items: stretch; }

/* side */
.side { display: flex; flex-direction: column; gap: 16px; }
.ph { position: relative; flex: 1; min-height: 260px; border-radius: 28px; overflow: hidden; background: linear-gradient(135deg, #cfc6f7, #bcdcf3 55%, #c6ecd8); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.shade { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(20, 18, 15, .45)); }
.pc { position: absolute; left: 14px; bottom: 14px; display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; padding: 7px 14px; border-radius: 99px; background: rgba(255, 255, 255, .94); }
.pc i { width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); animation: beat 2s infinite; }
@keyframes beat { 0% { box-shadow: 0 0 0 0 rgba(47, 156, 107, .5); } 70% { box-shadow: 0 0 0 8px rgba(47, 156, 107, 0); } 100% { box-shadow: 0 0 0 0 rgba(47, 156, 107, 0); } }

.ex { background: #faf9ff; border: 1px solid var(--line); border-radius: 26px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.ex > strong { font-size: 14px; padding: 0 4px; }
.eb { all: unset; box-sizing: border-box; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 18px; background: #fff; border: 1px solid var(--line); transition: all .35s; }
.eb:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.eb:hover { transform: translateY(-1px); }
.ei { width: 40px; height: 40px; border-radius: 13px; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; flex: none; transition: all .35s; }
.ei svg { width: 20px; height: 20px; }
.spin { animation: sp .8s linear infinite; }
@keyframes sp { to { transform: rotate(360deg); } }
.et { display: flex; flex-direction: column; min-width: 0; }
.et b { font-size: 13.5px; }
.et small { font-size: 11.5px; color: var(--muted); }
.eb.busy { border-color: var(--lav-i); }
.eb.done { background: #f2fbf6; border-color: var(--mint-i); }
.eb.done .ei { background: var(--mint); color: var(--mint-i); }

/* dashboard */
.dash { background: #fff; border: 1px solid var(--line); border-radius: 28px; box-shadow: 0 28px 70px rgba(60, 50, 120, .14); overflow: hidden; min-width: 0; display: flex; flex-direction: column; }
.bar { display: flex; align-items: center; gap: 6px; padding: 12px 18px; background: #faf9ff; border-bottom: 1px solid var(--line); }
.bar > i { width: 10px; height: 10px; border-radius: 50%; background: #e3e0ee; }
.ttl { margin-left: 12px; font-size: 12.5px; color: var(--muted); }

.fl { display: flex; gap: 8px; flex-wrap: wrap; padding: 18px 20px 0; }
.fl button { all: unset; box-sizing: border-box; cursor: pointer; font-size: 12.5px; font-weight: 600; padding: 8px 16px; border-radius: 99px; border: 1px solid var(--line); color: var(--muted); transition: all .3s; }
.fl button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.fl button.act { background: var(--ink); color: #fff; border-color: var(--ink); }

.kp { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px 20px 0; }
.kc { background: var(--t); border-radius: 20px; padding: 14px 16px; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.kl { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--ti); }
.kc b { font-size: clamp(18px, 2vw, 24px); font-weight: 600; letter-spacing: -.02em; font-variant-numeric: tabular-nums; white-space: nowrap; }
.kc small { font-size: 11.5px; color: var(--muted); }
.num-enter-active, .num-leave-active { transition: all .25s ease; }
.num-enter-from { opacity: 0; transform: translateY(6px); }
.num-leave-to { opacity: 0; transform: translateY(-6px); }

.chart { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.ch { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 14px; }
.ch strong { font-size: 14.5px; }
.ch span { font-size: 11.5px; color: var(--muted); }
.bars { flex: 1; min-height: 210px; display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; align-items: stretch; }
.bc { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.bv { font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
.bt { flex: 1; width: 100%; max-width: 54px; display: flex; align-items: flex-end; background: #f4f2fa; border-radius: 14px; overflow: hidden; }
.bt i { display: block; width: 100%; border-radius: 14px; background: linear-gradient(180deg, var(--lav-i), #a79bf0); transition: height .8s cubic-bezier(.3, .8, .3, 1); }
.bm { font-size: 11.5px; color: var(--muted); }

@media (max-width: 960px) {
  .board { grid-template-columns: 1fr; }
  .side { display: grid; grid-template-columns: 1fr 1fr; }
  .ph { min-height: 220px; }
}
@media (max-width: 640px) {
  .cr { padding: 64px 16px; }
  .side { grid-template-columns: 1fr; }
  .kp { grid-template-columns: 1fr; }
  .bars { gap: 6px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .pc i, .spin { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
