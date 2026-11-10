<template>
  <section id="pipeline-stages" ref="root" class="ps" :class="{ in: seen, live }" aria-labelledby="ps-title">
    <h2 id="ps-title" class="title">
      <span>Typical</span>
      <span class="soft">pipeline stages</span>
    </h2>
    <p class="lead">Every business is different, but many Saptivo customers start with: New enquiry, Contacted, Site visit or demo, Quotation sent, Negotiation, Won and Lost. You can rename, add or remove stages at any time, and set a default win probability for each.</p>

    <div class="grid">
      <!-- editor -->
      <article class="card ed">
        <header>
          <p class="cap">Stage settings</p>
          <button type="button" class="reset" @click="reset">Reset to typical</button>
        </header>

        <TransitionGroup name="row" tag="ul" class="rows">
          <li v-for="(s, i) in stages" :key="s.id" class="row" :class="[s.kind, { flash: s.id === flashId }]">
            <span class="ix">{{ i + 1 }}</span>
            <input class="nm" type="text" :value="s.name" :aria-label="`Stage ${i + 1} name`" maxlength="28" @input="rename(s, $event.target.value)" />
            <label class="pr">
              <span class="sr">Win probability for {{ s.name }}</span>
              <input type="range" min="0" max="100" step="5" :value="s.p" :disabled="s.kind !== 'open'" @input="setP(s, $event.target.value)" />
            </label>
            <b class="pv">{{ s.p }}%</b>
            <button type="button" class="rm" :aria-label="`Remove ${s.name}`" @click="remove(s.id)">×</button>
          </li>
        </TransitionGroup>

        <button type="button" class="add" @click="add"><span class="plus" aria-hidden="true"></span>Add a stage</button>
      </article>

      <!-- preview -->
      <article class="card pv-card">
        <p class="cap">Your pipeline</p>
        <TransitionGroup name="col" tag="ol" class="cols">
          <li v-for="(s, i) in stages" :key="s.id" class="col" :class="[s.kind, 't' + (i % 3), { flash: s.id === flashId }]">
            <span class="cn">{{ s.name || 'Untitled' }}</span>
            <span class="gauge"><i :style="{ height: s.p + '%' }"></i></span>
            <b class="cp">{{ s.p }}%</b>
          </li>
        </TransitionGroup>
        <p class="foot">Default win probability for each stage. It feeds the weighted forecast.</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "PipelineStagesSection" });

const typical = () => [
  { id: 1, name: "New enquiry", p: 10, kind: "open" },
  { id: 2, name: "Contacted", p: 20, kind: "open" },
  { id: 3, name: "Site visit or demo", p: 40, kind: "open" },
  { id: 4, name: "Quotation sent", p: 60, kind: "open" },
  { id: 5, name: "Negotiation", p: 80, kind: "open" },
  { id: 6, name: "Won", p: 100, kind: "won" },
  { id: 7, name: "Lost", p: 0, kind: "lost" },
];
const stages = ref(typical());
let uid = 100;
const manual = ref(false);
const flashId = ref(0);
let flashTimer = null;

function flash(id) {
  flashId.value = id;
  if (flashTimer !== null) window.clearTimeout(flashTimer);
  flashTimer = window.setTimeout(() => { flashId.value = 0; flashTimer = null; }, 1100);
}
function find(id) {
  return stages.value.find((s) => s.id === id);
}

/* actions shared by the visitor and the demo script */
function rename(s, v) {
  manual.value = true;
  s.name = v;
}
function setP(s, v) {
  manual.value = true;
  s.p = Number(v);
}
function remove(id) {
  manual.value = true;
  stages.value = stages.value.filter((s) => s.id !== id);
}
function add() {
  manual.value = true;
  insertStage("New stage", 50);
}
function insertStage(name, p) {
  uid += 1;
  const at = stages.value.findIndex((s) => s.kind !== "open");
  const item = { id: uid, name, p, kind: "open" };
  const list = [...stages.value];
  list.splice(at === -1 ? list.length : at, 0, item); // new stages go before Won / Lost
  stages.value = list;
  flash(uid);
}
function reset() {
  manual.value = true;
  stages.value = typical();
}

/* demo script: rename, re-weight, add, remove, then start over */
const script = [
  () => { stages.value = typical(); },
  () => { const s = find(3); if (s) { s.name = "Site survey"; flash(3); } },
  () => { const s = find(4); if (s) { s.p = 65; flash(4); } },
  () => {
    uid += 1;
    const at = stages.value.findIndex((s) => s.id === 5);
    const list = [...stages.value];
    list.splice(at === -1 ? list.length : at, 0, { id: uid, name: "Contract review", p: 70, kind: "open" });
    stages.value = list;
    flash(uid);
  },
  () => { const s = find(2); if (s) { s.p = 15; flash(2); } },
  () => { stages.value = stages.value.filter((s) => s.id !== 2); },
  () => { const s = find(1); if (s) { s.name = "New lead"; flash(1); } },
  () => {},
  () => {},
];
let tick = 0;
function step() {
  if (manual.value) return;
  script[tick % script.length]();
  tick += 1;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1600);
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
  if (flashTimer !== null) window.clearTimeout(flashTimer);
  halt();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.ps {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  --mint: #d3f0e1; --mint-d: #2f9c6b;
  --rose: #fde3ea; --rose-d: #d8567f;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.ps *, .ps *::before, .ps *::after { box-sizing: border-box; }
.ps button:focus-visible, .ps input:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { width: min(720px, calc(100% - 40px)); margin: 26px auto 0; text-align: center; font-size: 16px; line-height: 1.75; color: var(--muted); }

.grid { width: min(1180px, calc(100% - 40px)); margin: 52px auto 0; display: grid; grid-template-columns: 1fr 1.05fr; gap: 20px; align-items: start; }
.card { padding: 24px; border-radius: 30px; }
.ed { background: #f8f7fb; border: 1px solid #efedf6; }
.pv-card { background: #f4f8fd; border: 1px solid #e3edf8; }
.cap { margin: 0; font-size: 11.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.ed header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.reset { padding: 5px 12px; border: 1px solid var(--line); border-radius: 99px; background: #fff; cursor: pointer; font: 500 11.5px "Poppins", system-ui, sans-serif; color: var(--muted); }
.reset:hover { color: var(--ink); border-color: #cfc8c1; }

/* editor rows */
.rows { position: relative; list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.row { display: grid; grid-template-columns: 22px minmax(0, 1.2fr) minmax(0, 1fr) 40px 26px; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 14px; background: #fff; border: 1px solid transparent; transition: border-color 0.4s, background 0.4s; }
.row.flash { border-color: #bcaef5; background: #faf8ff; }
.ix { text-align: center; font-size: 11px; font-weight: 600; color: #b8b1ab; }
.nm { width: 100%; padding: 7px 10px; border: 1px solid transparent; border-radius: 9px; background: #f8f7fb; font: 500 13.5px "Poppins", system-ui, sans-serif; color: var(--ink); transition: background 0.25s, border-color 0.25s; }
.nm:hover { border-color: #e2dcf5; }
.nm:focus { background: #fff; border-color: #bcaef5; outline: 0; }
.pr { display: block; }
.pr input { width: 100%; accent-color: #8a78f0; }
.pr input:disabled { opacity: 0.35; }
.pv { text-align: right; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }
.row.won .pv { color: var(--mint-d); } .row.lost .pv { color: var(--rose-d); }
.rm { display: grid; place-items: center; width: 24px; height: 24px; border: 0; border-radius: 50%; background: #f3f0ec; color: #8a857f; cursor: pointer; font-size: 15px; line-height: 1; transition: background 0.25s, color 0.25s; }
.rm:hover { background: var(--rose); color: var(--rose-d); }
.add { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; margin-top: 12px; padding: 11px; border: 1.5px dashed #cfc8e6; border-radius: 14px; background: none; cursor: pointer; font: 500 13.5px "Poppins", system-ui, sans-serif; color: var(--ink); transition: background 0.25s, border-color 0.25s; }
.add:hover { background: #fff; border-color: #8a78f0; }
.plus { position: relative; width: 18px; height: 18px; border-radius: 50%; background: var(--ink); }
.plus::before, .plus::after { content: ""; position: absolute; left: 50%; top: 50%; width: 8px; height: 1.8px; margin: -0.9px 0 0 -4px; background: #fff; border-radius: 2px; }
.plus::after { transform: rotate(90deg); }

.row-enter-active { transition: opacity 0.4s, transform 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
.row-leave-active { position: absolute; left: 0; right: 0; transition: opacity 0.25s, transform 0.3s; }
.row-enter-from { opacity: 0; transform: translateX(-14px); }
.row-leave-to { opacity: 0; transform: translateX(14px); }
.row-move { transition: transform 0.45s ease; }

/* preview columns */
.pv-card .cap { margin-bottom: 16px; }
.cols { position: relative; list-style: none; margin: 0; padding: 0; display: flex; gap: 8px; align-items: stretch; overflow-x: auto; padding-bottom: 4px; }
.col { flex: 1 1 0; min-width: 70px; display: grid; grid-template-rows: 44px 190px auto; gap: 8px; justify-items: center; align-items: end; padding: 12px 6px 12px; border-radius: 18px; background: var(--bg); transition: background 0.4s, box-shadow 0.4s; }
.col.flash { box-shadow: 0 0 0 2px #bcaef5; }
.t0 { --bg: #f1eeff; --fill: #b9acff; }
.t1 { --bg: #dcecfb; --fill: #8fc2ee; }
.t2 { --bg: #fff1c9; --fill: #f0d27a; }
.col.won { --bg: #d3f0e1; --fill: #7fcfa8; }
.col.lost { --bg: #fde3ea; --fill: #f2a6bc; }
.cn { align-self: start; text-align: center; font-size: 11.5px; font-weight: 500; line-height: 1.3; word-break: break-word; }
.gauge { position: relative; width: 22px; height: 100%; border-radius: 99px; background: rgba(255, 255, 255, 0.75); overflow: hidden; }
.gauge i { position: absolute; left: 0; right: 0; bottom: 0; border-radius: 99px; background: var(--fill); transition: height 0.7s cubic-bezier(0.3, 0.7, 0.2, 1); }
.cp { font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; }
.foot { margin: 16px 0 0; font-size: 12.5px; color: var(--muted); }

.col-enter-active { transition: opacity 0.4s, transform 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
.col-leave-active { position: absolute; transition: opacity 0.25s, transform 0.3s; }
.col-enter-from { opacity: 0; transform: translateY(14px) scale(0.94); }
.col-leave-to { opacity: 0; transform: scale(0.9); }
.col-move { transition: transform 0.45s ease; }

/* entrance (runs once) */
.ps:not(.in) .lead, .ps:not(.in) .grid { opacity: 0; }
.ps.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.ps.in .title .soft { animation-delay: 0.1s; }
.ps.in .lead { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.ps.in .grid { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 1000px) {
  .grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .ps { padding: 72px 0; }
  .card { padding: 16px; border-radius: 24px; }
  .row { grid-template-columns: 18px minmax(0, 1fr) 36px 24px; }
  .pr { grid-column: 2 / 4; grid-row: 2; }
  .pv { grid-row: 1; grid-column: 3; }
  .rm { grid-column: 4; grid-row: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ps *, .ps *::before, .ps *::after { animation: none !important; transition: none !important; }
  .ps:not(.in) .lead, .ps:not(.in) .grid { opacity: 1; }
}
</style>
