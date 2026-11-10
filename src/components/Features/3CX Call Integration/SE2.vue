<template>
  <section id="journal" ref="root" class="jrn" :class="{ in: seen, live }" aria-labelledby="jrn-title">
    <header class="head">
      <h2 id="jrn-title" class="title">
        <span>An automatic</span>
        <span class="soft">call journal</span>
      </h2>
      <p>
        Every inbound, outbound and missed call is logged with extension, duration, date and time, and matched to the
        right customer. Filter the journal by answered, missed or outbound calls, by extension or by date. No more asking
        reps to type up call notes they never write.
      </p>
    </header>

    <div class="stage">
      <!-- ============ the journal ============ -->
      <article class="doc journal" aria-label="Call journal">
        <div class="dh">
          <span class="badge">Call journal</span>
          <div class="dt"><b>Front desk line</b><small>Logged automatically, no typing</small></div>
          <span class="qs on">Auto-logged</span>
        </div>

        <div class="filters" aria-label="Filters">
          <span v-for="t in types" :key="t.k" class="fl" :class="[t.k, { on: type === t.k }]">{{ t.label }}</span>
          <span class="sp" aria-hidden="true"></span>
          <span class="fl ext" :class="{ on: ext === '101' }">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
            Ext 101
          </span>
          <span class="fl day" :class="{ on: today }">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>
            Today
          </span>
        </div>

        <ul class="list" aria-label="Calls">
          <li v-for="c in calls" :key="c.id" class="row" :class="{ off: !visible(c) }">
            <span class="ico" :class="c.type" aria-hidden="true">
              <svg v-if="c.type === 'answered'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17 7 7 17M7 8v9h9" /></svg>
              <svg v-else-if="c.type === 'missed'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
            </span>
            <span class="who">
              <b>{{ c.name }}</b>
              <small>{{ c.sub }}</small>
            </span>
            <span class="xe">Ext {{ c.ext }}</span>
            <span class="du mono">{{ dur(c.secs) }}</span>
            <span class="wh">{{ c.when }}</span>
          </li>
        </ul>
      </article>

      <!-- ============ the summary ============ -->
      <article class="doc sum" aria-label="Summary of the calls in view">
        <div class="dh">
          <span class="badge">In view</span>
          <div class="dt"><b>{{ label }}</b><small>Updates with every filter</small></div>
        </div>

        <div class="big">
          <b :key="shown.length" class="mono">{{ shown.length }}</b>
          <span>{{ shown.length === 1 ? "call" : "calls" }}</span>
        </div>

        <div class="counts">
          <div class="ct a"><small>Answered</small><b :key="n.answered" class="mono">{{ n.answered }}</b></div>
          <div class="ct m"><small>Missed</small><b :key="n.missed" class="mono">{{ n.missed }}</b></div>
          <div class="ct o"><small>Outbound</small><b :key="n.out" class="mono">{{ n.out }}</b></div>
        </div>

        <div class="match">
          <div class="mh"><span>Matched to a customer</span><b class="mono">{{ n.matched }} of {{ shown.length }}</b></div>
          <div class="bar"><i :style="{ width: matchPct + '%' }"></i></div>
          <small>Talk time <b :key="talk" class="mono">{{ talk }}</b></small>
        </div>

        <span class="nonote">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
          No call notes to type up
        </span>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const types = [
  { k: "all", label: "All" },
  { k: "answered", label: "Answered" },
  { k: "missed", label: "Missed" },
  { k: "out", label: "Outbound" },
];

// day: 0 = today
const calls = [
  { id: 1, type: "answered", name: "Nimal Perera", sub: "Ceylon Motors", ext: "101", secs: 272, when: "Today 10:12", day: 0, matched: true },
  { id: 2, type: "missed", name: "Dilani Fernando", sub: "Lanka Tea Traders", ext: "102", secs: 0, when: "Today 09:48", day: 0, matched: true },
  { id: 3, type: "out", name: "Ruwan Silva", sub: "Colombo Hardware", ext: "101", secs: 135, when: "Today 09:20", day: 0, matched: true },
  { id: 4, type: "answered", name: "Kasun Wijesinghe", sub: "Island Logistics", ext: "103", secs: 428, when: "Yesterday 16:41", day: 1, matched: true },
  { id: 5, type: "missed", name: "+94 71 555 0198", sub: "New number", ext: "102", secs: 0, when: "Yesterday 15:03", day: 1, matched: false },
  { id: 6, type: "out", name: "Nimal Perera", sub: "Ceylon Motors", ext: "103", secs: 107, when: "Yesterday 11:30", day: 1, matched: true },
  { id: 7, type: "answered", name: "Amali Perera", sub: "Galle Spices", ext: "101", secs: 201, when: "Sat 7 Nov 14:05", day: 2, matched: true },
  { id: 8, type: "out", name: "Sanjaya Dias", sub: "Kandy Fabrics", ext: "102", secs: 356, when: "Sat 7 Nov 10:22", day: 2, matched: true },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const type = ref("all");
const ext = ref(null);
const today = ref(false);

function visible(c) {
  if (type.value !== "all" && c.type !== type.value) return false;
  if (ext.value && c.ext !== ext.value) return false;
  if (today.value && c.day !== 0) return false;
  return true;
}
function dur(s) {
  if (!s) return "—";
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}

const shown = computed(() => calls.filter(visible));
const n = computed(() => ({
  answered: shown.value.filter((c) => c.type === "answered").length,
  missed: shown.value.filter((c) => c.type === "missed").length,
  out: shown.value.filter((c) => c.type === "out").length,
  matched: shown.value.filter((c) => c.matched).length,
}));
const matchPct = computed(() => (shown.value.length ? (n.value.matched / shown.value.length) * 100 : 0));
const talk = computed(() => {
  const s = shown.value.reduce((a, c) => a + c.secs, 0);
  const m = Math.floor(s / 60);
  return m + " min " + String(s % 60).padStart(2, "0") + " s";
});
const label = computed(() => {
  const parts = [];
  parts.push(type.value === "all" ? "All calls" : { answered: "Answered", missed: "Missed", out: "Outbound" }[type.value]);
  if (ext.value) parts.push("ext " + ext.value);
  if (today.value) parts.push("today");
  return parts.join(" · ");
});

const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 17; // beats of 1.2 s

function reset() {
  type.value = "all";
  ext.value = null;
  today.value = false;
}

function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b === 3) type.value = "missed";
  if (b === 6) type.value = "out";
  if (b === 9) { type.value = "all"; ext.value = "101"; }
  if (b === 12) { ext.value = null; today.value = true; }
  if (b === 15) today.value = false;
  st.beat = (b + 1) % LEN;
}

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(tick, 1200);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    // static picture: the full journal, no filter applied
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
  st.fallback = window.setTimeout(() => { if (!seen.value) seen.value = true; }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  stop();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.jrn {
  --ink: #14120f;
  --muted: #6a6560;
  --peach: #ffe9df;
  --butter: #fff3cf;
  --sky: #e0f0ff;
  --lav: #f0ecff;
  --mint: #e3f6ec;
  --pink: #ffe4ee;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.jrn *, .jrn *::before, .jrn *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

/* ---------- heading ---------- */
.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.head p { margin: 0 auto; max-width: 60ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

/* ---------- stage ---------- */
.stage { width: min(1120px, calc(100% - 40px)); margin: 64px auto 0; display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 28px; align-items: stretch; }
.doc { position: relative; display: flex; flex-direction: column; gap: 16px; padding: 26px; border-radius: 30px; min-width: 0; }
.journal { background: var(--lav); }
.sum { background: var(--butter); }
.dh { display: flex; align-items: center; gap: 12px; }
.badge { flex: none; padding: 6px 12px; border-radius: 99px; background: #fff; font-size: 12px; font-weight: 600; }
.journal .badge { color: #5b45c9; }
.sum .badge { color: #8a5a00; }
.dt { min-width: 0; flex: 1; }
.dt b { display: block; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dt small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qs { flex: none; padding: 5px 11px; border-radius: 99px; background: #fff; color: #8a857f; font-size: 12px; font-weight: 600; }
.qs.on { background: #5b45c9; color: #fff; }

/* filters */
.filters { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.fl { display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; border-radius: 99px; background: rgba(255, 255, 255, 0.65); color: #7a6c9e; font-size: 12.5px; font-weight: 600; transition: background 0.35s, color 0.35s, transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1); }
.fl.on { background: #5b45c9; color: #fff; transform: scale(1.06); }
.fl.answered.on { background: #15803d; }
.fl.missed.on { background: #b0245a; }
.fl.out.on { background: #3b82c4; }
.sp { flex: 1; min-width: 4px; }

/* rows */
.list { list-style: none; margin: 0; padding: 12px; border-radius: 20px; background: #fff; display: grid; align-content: start; min-height: 436px; }
.row { display: grid; grid-template-columns: 30px minmax(0, 1fr) 62px 52px 118px; align-items: center; gap: 12px; padding: 0 8px; height: 52px; max-height: 52px; overflow: hidden; border-bottom: 1px solid #f3effa; font-size: 12.5px; transition: max-height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.4s; }
.row.off { max-height: 0; height: 0; opacity: 0; transform: translateX(14px); border-color: transparent; }
.ico { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; }
.ico.answered { background: var(--mint); color: #15803d; }
.ico.missed { background: var(--pink); color: #b0245a; }
.ico.out { background: var(--sky); color: #3b82c4; }
.who { min-width: 0; display: grid; }
.who b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.who small { color: var(--muted); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.xe { padding: 3px 9px; border-radius: 99px; background: var(--lav); color: #5b45c9; font-size: 11px; font-weight: 600; text-align: center; white-space: nowrap; }
.du { color: var(--ink); font-weight: 500; text-align: right; }
.wh { color: var(--muted); font-size: 11.5px; text-align: right; white-space: nowrap; }

/* summary */
.big { display: flex; align-items: baseline; gap: 10px; padding: 18px 20px; border-radius: 20px; background: #fff; }
.big b { font-size: 54px; font-weight: 500; line-height: 1; letter-spacing: -0.04em; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.big span { color: var(--muted); font-size: 15px; font-weight: 500; }
.counts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.ct { display: grid; gap: 2px; padding: 12px; border-radius: 16px; }
.ct small { font-size: 11.5px; font-weight: 600; }
.ct b { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.ct.a { background: var(--mint); color: #15803d; }
.ct.m { background: var(--pink); color: #b0245a; }
.ct.o { background: var(--sky); color: #3b82c4; }
.match { display: grid; gap: 8px; padding: 14px 16px; border-radius: 20px; background: #fff; }
.mh { display: flex; justify-content: space-between; gap: 10px; font-size: 12.5px; font-weight: 500; }
.mh b { font-weight: 600; }
.bar { height: 8px; border-radius: 99px; background: var(--butter); overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 99px; background: #7fcfa0; transition: width 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); }
.match small { color: var(--muted); font-size: 12px; }
.match small b { color: var(--ink); font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; display: inline-block; }
.nonote { align-self: flex-start; margin-top: auto; display: inline-flex; align-items: center; gap: 7px; padding: 9px 15px; border-radius: 99px; background: #fff; color: #15803d; font-size: 12.5px; font-weight: 600; }

/* ---------- entrance ---------- */
.jrn:not(.in) .head, .jrn:not(.in) .stage { opacity: 0; }
.jrn.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.jrn.in .journal { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.jrn.in .sum { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: scale(1.18); opacity: 0.4; } to { transform: none; opacity: 1; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .stage { grid-template-columns: minmax(0, 1fr); max-width: 640px; }
  .list { min-height: 0; }
}
@media (max-width: 640px) {
  .jrn { padding: 72px 0; }
  .head p { font-size: 15.5px; }
  .stage { margin-top: 44px; width: calc(100% - 32px); gap: 22px; }
  .doc { padding: 18px; border-radius: 24px; }
  .dt small { display: none; }
  .row { grid-template-columns: 30px minmax(0, 1fr) 52px; gap: 10px; }
  .xe, .wh { display: none; }
  .big b { font-size: 44px; }
}
@media (prefers-reduced-motion: reduce) {
  .jrn *, .jrn *::before, .jrn *::after { animation: none !important; transition: none !important; }
  .jrn:not(.in) .head, .jrn:not(.in) .stage { opacity: 1; }
}
</style>
