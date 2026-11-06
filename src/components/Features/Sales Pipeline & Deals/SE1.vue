<template>
  <section id="kanban-list" ref="root" class="kb" :class="{ in: seen, live }" aria-labelledby="kb-title">
    <div class="head">
      <h2 id="kb-title" class="title">
        <span>Visual Kanban</span>
        <span class="soft">and list views</span>
      </h2>
      <div class="copy">
        <p>See your pipeline as Kanban columns or a sortable list. Each card shows the customer, deal value, expected close date and next step.</p>
        <p class="strong">Stage totals update as deals move, so you always know how much revenue is waiting at each step.</p>
      </div>
    </div>

    <div class="app">
      <div class="bar">
        <div class="seg" role="group" aria-label="Pipeline view">
          <button type="button" :class="{ on: view === 'kanban' }" :aria-pressed="view === 'kanban'" @click="setView('kanban')">Kanban</button>
          <button type="button" :class="{ on: view === 'list' }" :aria-pressed="view === 'list'" @click="setView('list')">List</button>
        </div>
        <p class="sum">Open pipeline <b :key="openTotal">{{ money(openTotal) }}</b></p>
      </div>

      <Transition name="view" mode="out-in">
        <!-- Kanban -->
        <div v-if="view === 'kanban'" key="k" class="board">
          <section v-for="(st, si) in stages" :key="st.name" class="lane" :class="{ won: si === 3 }">
            <header>
              <span class="sn"><i class="sd" :style="{ background: st.color }"></i>{{ st.name }}</span>
              <span class="cnt">{{ laneDeals(si).length }}</span>
            </header>
            <p class="tot"><b :key="laneTotal(si)">{{ money(laneTotal(si)) }}</b></p>
            <TransitionGroup name="card" tag="div" class="cards">
              <article v-for="d in laneDeals(si)" :key="d.id" class="deal" :class="{ just: d.id === justMoved }">
                <div class="r1"><b>{{ d.name }}</b><span class="val">{{ money(d.value) }}</span></div>
                <p class="r2"><span class="cal" aria-hidden="true"></span>Close {{ d.close }}</p>
                <p class="r3"><span class="nx">Next</span>{{ d.next }}</p>
                <button v-if="si < 3" type="button" class="adv" :aria-label="`Move ${d.name} to ${stages[si + 1].name}`" @click="advance(d.id, true)">Move →</button>
              </article>
            </TransitionGroup>
          </section>
        </div>

        <!-- List -->
        <div v-else key="l" class="table-wrap">
          <div class="table" role="table" aria-label="Deals">
            <div class="tr th" role="row">
              <button v-for="c in cols" :key="c.key" type="button" role="columnheader" class="thb" :class="{ on: sortKey === c.key, right: c.right }" :aria-sort="sortKey === c.key ? (sortDir === 1 ? 'ascending' : 'descending') : 'none'" @click="sortBy(c.key)">
                {{ c.label }}<i class="car" :class="{ up: sortKey === c.key && sortDir === 1 }"></i>
              </button>
              <span class="thb static">Next step</span>
            </div>
            <TransitionGroup name="row" tag="div" class="tbody">
              <div v-for="d in sorted" :key="d.id" class="tr" role="row">
                <span class="c1" role="cell"><b>{{ d.name }}</b></span>
                <span role="cell" class="stagecell"><i class="sd" :style="{ background: stages[d.stage].color }"></i>{{ stages[d.stage].name }}</span>
                <span role="cell" class="right val">{{ money(d.value) }}</span>
                <span role="cell">{{ d.close }}</span>
                <span role="cell" class="mut">{{ d.next }}</span>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "KanbanListSection" });

/* Colours follow the Saptivo logo: warm orange accent, near-black ink, soft peach paper. */
const stages = [
  { name: "New", color: "#c9b8ad" },
  { name: "Proposal", color: "#f9a37d" },
  { name: "Negotiation", color: "#f6642f" },
  { name: "Won", color: "#1f9d63" },
];

const initial = () => [
  { id: 1, name: "ABC Solar", value: 1850000, close: "12 Dec", n: 12, next: "Send quotation", stage: 0, order: 1 },
  { id: 2, name: "Lanka Power", value: 920000, close: "20 Dec", n: 20, next: "Site visit Tue", stage: 0, order: 2 },
  { id: 3, name: "Ceylon Motors", value: 640000, close: "05 Dec", n: 5, next: "Call Friday", stage: 1, order: 3 },
  { id: 4, name: "Galle Hardware", value: 380000, close: "18 Dec", n: 18, next: "Revise pricing", stage: 1, order: 4 },
  { id: 5, name: "Kandy Textiles", value: 2400000, close: "30 Nov", n: -1, next: "Contract review", stage: 2, order: 5 },
  { id: 6, name: "Negombo Foods", value: 510000, close: "28 Nov", n: -3, next: "Final approval", stage: 2, order: 6 },
  { id: 7, name: "Jaffna Agro", value: 760000, close: "02 Nov", n: -29, next: "Invoice sent", stage: 3, order: 7 },
];
const deals = ref(initial());

const cols = [
  { key: "name", label: "Customer" },
  { key: "stage", label: "Stage" },
  { key: "value", label: "Value", right: true },
  { key: "n", label: "Close date" },
];

function money(v) {
  if (v >= 1000000) return "Rs " + (v / 1000000).toFixed(2).replace(/\.?0+$/, "") + "M";
  return "Rs " + Math.round(v / 1000) + "K";
}
const laneDeals = (si) => deals.value.filter((d) => d.stage === si).sort((a, b) => a.order - b.order);
const laneTotal = (si) => laneDeals(si).reduce((s, d) => s + d.value, 0);
const openTotal = computed(() => deals.value.filter((d) => d.stage < 3).reduce((s, d) => s + d.value, 0));

/* view + sorting */
const view = ref("kanban");
const viewManual = ref(false);
function setView(v) {
  viewManual.value = true;
  view.value = v;
}
const sortKey = ref("value");
const sortDir = ref(-1);
function sortBy(k) {
  viewManual.value = true;
  if (sortKey.value === k) sortDir.value = -sortDir.value;
  else {
    sortKey.value = k;
    sortDir.value = k === "value" ? -1 : 1;
  }
}
const sorted = computed(() => {
  const k = sortKey.value;
  return [...deals.value].sort((a, b) => {
    const x = a[k];
    const y = b[k];
    const r = typeof x === "string" ? x.localeCompare(y) : x - y;
    return (r || a.id - b.id) * sortDir.value;
  });
});

/* moving deals */
const justMoved = ref(-1);
let justTimer = null;
let orderCounter = 100;
function advance(id, byUser) {
  const d = deals.value.find((x) => x.id === id);
  if (!d || d.stage >= 3) return;
  if (byUser) viewManual.value = true;
  d.stage += 1;
  orderCounter += 1;
  d.order = orderCounter;
  justMoved.value = id;
  if (justTimer !== null) window.clearTimeout(justTimer);
  justTimer = window.setTimeout(() => { justMoved.value = -1; justTimer = null; }, 1300);
}

let tick = 0;
let cursor = 0;
function step() {
  tick += 1;
  if (!viewManual.value && tick % 14 === 0) view.value = view.value === "kanban" ? "list" : "kanban";
  if (tick % 2 !== 0) return;
  const open = deals.value.filter((d) => d.stage < 3);
  if (!open.length) {
    deals.value = initial(); // start the demo over
    return;
  }
  advance(open[cursor % open.length].id, false);
  cursor += 1;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1300);
}
function stop() {
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
      if (e && e.isIntersecting) start();
      else stop();
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
  if (justTimer !== null) window.clearTimeout(justTimer);
  stop();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.kb {
  /* palette sampled from the Saptivo logo */
  --orange: #f6642f;
  --orange-soft: #ffeee5;
  --ink: #0b0c0e;
  --muted: #6a6560;
  --paper: #fff9f7;
  --line: #f1e3dc;
  --green: #1f9d63;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.kb *, .kb *::before, .kb *::after { box-sizing: border-box; }
.kb button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.head { width: min(1180px, calc(100% - 40px)); margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: end; }
.title { margin: 0; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.copy p { margin: 0 0 12px; font-size: 16px; line-height: 1.75; color: var(--muted); }
.copy p:last-child { margin: 0; }
.copy .strong { color: var(--ink); font-weight: 500; }

/* ---------- app window ---------- */
.app { width: min(1180px, calc(100% - 40px)); margin: 52px auto 0; padding: 22px; border: 1px solid var(--line); border-radius: 30px; background: var(--paper); }
.bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.seg { display: flex; padding: 4px; border-radius: 12px; background: #f6ece7; }
.seg button { padding: 8px 18px; border: 0; border-radius: 9px; background: none; cursor: pointer; font: 500 13.5px "Poppins", system-ui, sans-serif; color: #8a857f; transition: background 0.3s, color 0.3s, box-shadow 0.3s; }
.seg button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgba(11, 12, 14, 0.14); }
.sum { margin: 0; font-size: 13px; color: var(--muted); }
.sum b { margin-left: 6px; font-size: 18px; font-weight: 600; color: var(--ink); display: inline-block; animation: bump 0.5s ease; }

.sd { display: inline-block; width: 9px; height: 9px; border-radius: 50%; flex: none; }

/* ---------- kanban ---------- */
.board { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; align-items: start; }
.lane { padding: 14px; border-radius: 20px; background: #fff; border: 1px solid var(--line); min-height: 420px; }
.lane.won { background: #f6fbf8; border-color: #d9efe3; }
.lane header { display: flex; align-items: center; justify-content: space-between; }
.sn { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 500; }
.cnt { min-width: 24px; padding: 1px 8px; border-radius: 99px; background: #f6ece7; font-size: 11.5px; font-weight: 600; text-align: center; color: var(--muted); }
.tot { margin: 6px 0 14px; padding-bottom: 12px; border-bottom: 1px dashed var(--line); }
.tot b { display: inline-block; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; animation: bump 0.5s ease; }
.lane.won .tot b { color: var(--green); }

.cards { position: relative; display: grid; gap: 10px; }
.deal { position: relative; display: grid; gap: 6px; padding: 13px 14px; border: 1px solid var(--line); border-radius: 14px; background: var(--paper); transition: border-color 0.4s, box-shadow 0.4s, background 0.4s; }
.deal.just { border-color: rgba(246, 100, 47, 0.6); background: #fff; box-shadow: 0 10px 24px rgba(246, 100, 47, 0.14); }
.r1 { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.r1 b { font-size: 14px; font-weight: 500; }
.val { font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }
.r2, .r3 { margin: 0; display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--muted); }
.cal { width: 11px; height: 11px; border: 1.5px solid #c4b8af; border-radius: 3px; border-top-width: 3px; }
.nx { padding: 1px 8px; border-radius: 99px; background: var(--orange-soft); color: var(--orange); font-size: 10.5px; font-weight: 600; }
.adv { justify-self: start; margin-top: 2px; padding: 4px 11px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; cursor: pointer; font: 500 11px "Poppins", system-ui, sans-serif; transition: background 0.25s; }
.adv:hover { background: var(--orange); }

.card-move { transition: transform 0.55s cubic-bezier(0.3, 0.8, 0.3, 1); }
.card-enter-active { transition: opacity 0.5s ease 0.25s, transform 0.55s cubic-bezier(0.3, 1.2, 0.5, 1) 0.25s; }
.card-leave-active { position: absolute; left: 0; right: 0; transition: opacity 0.3s ease, transform 0.3s ease; }
.card-enter-from { opacity: 0; transform: translateX(-18px); }
.card-leave-to { opacity: 0; transform: translateX(18px); }

/* ---------- list ---------- */
.table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 20px; background: #fff; }
.table { min-width: 760px; }
.tr { display: grid; grid-template-columns: 1.5fr 1.1fr 1fr 1fr 1.5fr; align-items: center; gap: 12px; padding: 13px 20px; border-bottom: 1px solid #f7efeb; font-size: 13.5px; }
.tr.th { padding-top: 10px; padding-bottom: 10px; background: #fdf6f2; border-bottom: 1px solid var(--line); }
.tbody { position: relative; }
.tbody .tr:last-child { border-bottom: 0; }
.thb { display: inline-flex; align-items: center; gap: 6px; padding: 4px 0; border: 0; background: none; cursor: pointer; font: 600 11.5px "Poppins", system-ui, sans-serif; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; text-align: left; transition: color 0.25s; }
.thb.static { cursor: default; }
.thb:hover, .thb.on { color: var(--ink); }
.thb.right, .right { justify-content: flex-end; text-align: right; }
.car { width: 0; height: 0; border: 4px solid transparent; border-top: 5px solid #d3c9c1; border-bottom: 0; transition: transform 0.3s, border-top-color 0.3s; }
.thb.on .car { border-top-color: var(--orange); }
.car.up { transform: rotate(180deg); }
.c1 b { font-weight: 500; }
.stagecell { display: flex; align-items: center; gap: 8px; }
.mut { color: var(--muted); }
.row-move { transition: transform 0.5s cubic-bezier(0.3, 0.8, 0.3, 1); }
.row-enter-active, .row-leave-active { transition: opacity 0.3s; }
.row-enter-from, .row-leave-to { opacity: 0; }

.view-enter-active, .view-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.view-enter-from { opacity: 0; transform: translateY(8px); }
.view-leave-to { opacity: 0; transform: translateY(-8px); }

/* entrance (runs once) */
.kb:not(.in) .head, .kb:not(.in) .app { opacity: 0; }
.kb.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.kb.in .app { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { color: var(--orange); transform: translateY(-3px); } to { color: inherit; transform: none; } }

@media (max-width: 1000px) {
  .head { grid-template-columns: 1fr; gap: 20px; }
  .board { grid-template-columns: repeat(4, 260px); overflow-x: auto; padding-bottom: 8px; scroll-snap-type: x proximity; }
  .lane { scroll-snap-align: start; }
}
@media (max-width: 560px) {
  .kb { padding: 72px 0; }
  .app { padding: 14px; border-radius: 24px; }
  .bar { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .kb *, .kb *::before, .kb *::after { animation: none !important; transition: none !important; }
  .kb:not(.in) .head, .kb:not(.in) .app { opacity: 1; }
}
</style>
