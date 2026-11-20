<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "DocumentsEsignSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const docs = [
  { t: "Service Level Agreement", k: "SLA", v: "v3", id: 0 },
  { t: "Annual Maintenance Contract", k: "Contract", v: "v2" },
  { t: "Solar Installation Proposal", k: "Proposal", v: "v4" },
  { t: "Site Inspection Report", k: "Report", v: "v1" },
  { t: "Technical Specification", k: "Specification", v: "v2" },
];
const versions = [
  { v: "v3", w: "Today", cur: true },
  { v: "v2", w: "12 Nov" },
  { v: "v1", w: "30 Oct" },
];
const audit = [
  { t: "Document opened in the portal", w: "14:01:12" },
  { t: "Signed by Dilani Perera", w: "14:02:05" },
  { t: "Signed copy archived", w: "14:02:31" },
];

const sub = computed(() => (still.value ? 9 : n.value % 12));
const drawing = computed(() => sub.value >= 2);
const signed = computed(() => sub.value >= 5);
const rows = computed(() => (sub.value >= 8 ? 3 : sub.value >= 7 ? 2 : sub.value >= 6 ? 1 : 0));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 800);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
  <section ref="root" class="de" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Documents</span> <span class="l2">and e-signature</span></h2>
        <p>
          Contracts, proposals, reports, SLAs and specifications are shared in an organised library with version
          history. Customers sign documents directly in the portal, and signed copies are archived with a timestamp and
          audit record.
        </p>
      </header>

      <div class="win">
        <!-- library -->
        <aside class="lib">
          <span class="lb">Document library</span>
          <ul>
            <li v-for="(d, i) in docs" :key="d.t" :class="{ on: i === 0 }">
              <span class="ic"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg></span>
              <span class="nm"><b>{{ d.t }}</b><small>{{ d.k }} · {{ d.v }}</small></span>
              <em v-if="i === 0" :class="{ vis: signed }">Signed</em>
            </li>
          </ul>
        </aside>

        <!-- document -->
        <div class="doc">
          <div class="dh"><b>Service Level Agreement</b><span :class="['pill', signed ? 'mint' : 'butter']">{{ signed ? "Signed" : "Awaiting signature" }}</span></div>
          <div class="paper">
            <i class="ln w1"></i><i class="ln w2"></i><i class="ln w3"></i><i class="ln w2"></i><i class="ln w1"></i><i class="ln w3"></i>
            <div class="signrow">
              <div class="slot" :class="{ hi: sub >= 1 && !signed }">
                <small>Customer signature</small>
                <svg viewBox="0 0 220 56" class="sg" :class="{ draw: drawing }" aria-hidden="true"><path d="M8 38 C20 6 34 6 30 30 C28 46 44 14 56 22 C66 30 54 44 70 36 C86 28 90 22 100 30 C110 38 120 18 140 24 C156 30 170 34 210 20" pathLength="1" /></svg>
              </div>
              <div class="stamp" :class="{ vis: signed }"><b>SIGNED</b><small>19 Nov 2026 · 14:02</small></div>
            </div>
          </div>
        </div>

        <!-- history and audit -->
        <aside class="side">
          <div class="box vh">
            <span class="lb">Version history</span>
            <ul>
              <li v-for="x in versions" :key="x.v" :class="{ cur: x.cur }"><b>{{ x.v }}</b><span>{{ x.w }}</span><em v-if="x.cur">Current</em></li>
            </ul>
          </div>
          <div class="box au">
            <span class="lb">Audit record</span>
            <ol>
              <li v-for="(a, i) in audit" :key="a.t" :class="{ vis: rows > i }"><i></i><span>{{ a.t }}</span><small>{{ a.w }}</small></li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.de {
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
.de *, .de *::before, .de *::after { box-sizing: border-box; }
.wrap { max-width: 1200px; margin: 0 auto; }
.head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, .9fr); gap: 48px; align-items: end; margin-bottom: 44px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.de h2 .l1 { color: #111111 !important; opacity: 1; }
.de h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.head, .win { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .win { opacity: 1; transform: none; }
.in .win { transition-delay: .1s; }

.win { display: grid; grid-template-columns: 250px minmax(0, 1fr) 260px; gap: 14px; background: var(--lav); border-radius: 28px; padding: 14px; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

.lib { background: rgba(255, 255, 255, .6); border-radius: 20px; padding: 16px 12px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.lib .lb { padding: 0 6px; }
.lib ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.lib li { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 12px; border: 1px solid transparent; }
.lib li.on { background: #fff; border-color: var(--ink); }
.ic { width: 30px; height: 30px; border-radius: 9px; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; flex: none; }
.nm { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.nm b { font-size: 12.5px; font-weight: 500; line-height: 1.35; }
.nm small { font-size: 11px; color: var(--muted); }
.lib em { font-style: normal; font-size: 10.5px; font-weight: 600; padding: 2px 8px; border-radius: 6px; background: var(--mint); color: var(--mint-i); opacity: 0; transition: opacity .4s; }
.lib em.vis { opacity: 1; }

.doc { background: #fff; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.dh { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.dh b { font-size: 15px; font-weight: 600; }
.pill { font-size: 11.5px; font-weight: 600; padding: 3px 11px; border-radius: 99px; transition: all .3s; white-space: nowrap; }
.pill.mint { background: var(--mint); color: var(--mint-i); }
.pill.butter { background: var(--butter); color: var(--butter-i); }
.paper { flex: 1; border: 1px solid var(--line); border-radius: 14px; padding: 22px; display: flex; flex-direction: column; gap: 12px; background: #fcfcfd; min-height: 340px; }
.ln { display: block; height: 7px; border-radius: 4px; background: #e9ebee; }
.w1 { width: 92%; } .w2 { width: 78%; } .w3 { width: 64%; }
.signrow { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
.slot { flex: 1; min-width: 200px; border: 1px dashed rgba(20, 18, 15, .25); border-radius: 12px; padding: 8px 14px 4px; background: #fff; transition: border-color .3s; }
.slot.hi { border-color: var(--ink); }
.slot small { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); }
.sg { width: 100%; height: 56px; display: block; }
.sg path { fill: none; stroke: var(--ink); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
.sg.draw path { animation: dr 1.8s ease forwards; }
@keyframes dr { to { stroke-dashoffset: 0; } }
.stamp { border: 1.5px solid var(--mint-i); color: var(--mint-i); border-radius: 10px; padding: 6px 12px; display: flex; flex-direction: column; align-items: center; opacity: 0; transform: scale(.96); transition: all .4s ease; }
.stamp.vis { opacity: 1; transform: none; }
.stamp b { font-size: 12px; letter-spacing: .14em; font-weight: 700; }
.stamp small { font-size: 10.5px; }

.side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.box { background: #fff; border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.au { flex: 1; }
.vh ul { list-style: none; margin: 0; padding: 0; }
.vh li { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--line); font-size: 13px; }
.vh li:last-child { border-bottom: 0; }
.vh li b { font-weight: 600; width: 26px; }
.vh li span { color: var(--muted); flex: 1; }
.vh li em { font-style: normal; font-size: 10.5px; font-weight: 600; padding: 2px 8px; border-radius: 6px; background: var(--lav); color: var(--lav-i); }
.au ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; position: relative; }
.au li { display: grid; grid-template-columns: 10px minmax(0, 1fr); column-gap: 10px; row-gap: 2px; font-size: 13px; line-height: 1.45; opacity: .2; transform: translateX(-6px); transition: all .4s ease; }
.au li.vis { opacity: 1; transform: none; }
.au li i { width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); margin-top: 6px; }
.au li small { grid-column: 2; font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; }

@media (max-width: 1020px) {
  .win { grid-template-columns: 1fr 1fr; }
  .doc { grid-column: 1 / -1; order: -1; }
}
@media (max-width: 760px) {
  .head { grid-template-columns: 1fr; gap: 18px; margin-bottom: 32px; }
  .win { grid-template-columns: 1fr; border-radius: 22px; padding: 10px; }
  .doc { order: 0; padding: 14px; }
  .paper { min-height: 300px; padding: 16px; }
  .de { padding: 64px 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .win { opacity: 1; transform: none; transition: none; }
  .sg path { stroke-dashoffset: 0; animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
