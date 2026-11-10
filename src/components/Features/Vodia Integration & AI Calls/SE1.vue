<template>
  <section id="vodia" ref="root" class="vod" :class="{ in: seen, live }" aria-labelledby="vod-title">
    <div class="wrap">
      <!-- ============ copy ============ -->
      <div class="copy">
        <h2 id="vod-title" class="title">
          <span>Every Vodia call</span>
          <span class="soft">on the customer timeline</span>
        </h2>
        <p class="lead">
          Inbound, outbound and missed calls from your Vodia PBX are matched to the right contact or account and logged
          with extension, duration and time. The caller's profile, open tickets and latest quotation appear on screen
          while the phone is ringing, and missed calls become callback tasks.
        </p>

        <ul class="feats">
          <li v-for="f in feats" :key="f.text">
            <span class="fi" :class="f.tone" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
            </span>
            <span>{{ f.text }}</span>
          </li>
        </ul>
      </div>

      <!-- ============ visual ============ -->
      <div class="visual">
        <!-- screen pop while ringing -->
        <article class="doc pop" :class="{ ring }" aria-label="Screen pop">
          <div class="dh">
            <span class="badge pb">{{ ring ? "Ringing" : "Screen pop" }}</span>
            <div class="dt"><b>{{ ring ? "Nimal Perera" : "No call ringing" }}</b><small>{{ ring ? "Ceylon Motors · Ext 101" : "The record opens as the phone rings" }}</small></div>
            <span class="wave" :class="{ on: ring }" aria-hidden="true"><i></i><i></i><i></i></span>
          </div>
          <div class="chips" :class="{ on: ring }">
            <span class="c k"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" /></svg>Customer since 2021</span>
            <span class="c t"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8v5M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>1 open ticket</span>
            <span class="c q"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7ZM10 12h5M10 16h5" /></svg>QT-0142 · Sent</span>
          </div>
        </article>

        <!-- the timeline -->
        <article class="doc tl" aria-label="Customer timeline">
          <div class="dh">
            <span class="badge">Timeline</span>
            <div class="dt"><b>Ceylon Motors</b><small>Calls from your Vodia PBX</small></div>
            <span class="vtag">Vodia PBX</span>
          </div>

          <ul class="list">
            <li v-for="(c, i) in calls" :key="c.id" class="row" :class="[c.type, { shown: i < rows }]">
              <span class="ico" aria-hidden="true">
                <svg v-if="c.type === 'in'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17 7 7 17M7 8v9h9" /></svg>
                <svg v-else-if="c.type === 'miss'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
              </span>
              <span class="who">
                <b>{{ c.label }}</b>
                <small>{{ c.who }} · Ext {{ c.ext }}</small>
                <span v-if="c.type === 'miss'" class="x task" :class="{ show: task }">Callback task created</span>
                <span v-if="c.type === 'in'" class="xs" :class="{ show: outcome }">
                  <span class="x rec">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7Z" /></svg>
                    Recording
                  </span>
                  <span class="x out">Quote requested</span>
                </span>
              </span>
              <span class="du mono">{{ c.dur }}</span>
              <span class="wh">{{ c.when }}</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const feats = [
  { text: "Caller identification and screen pop", tone: "peach" },
  { text: "Automatic call logging against contacts, accounts and deals", tone: "lav" },
  { text: "Click-to-call from any record through your Vodia extension", tone: "sky" },
  { text: "Call recordings and outcomes stored on the timeline", tone: "butter" },
  { text: "Queues, extensions and departments mapped to Saptivo users and teams", tone: "mint" },
];

const calls = [
  { id: 1, type: "out", label: "Outbound · answered", who: "Nimal Perera", ext: "103", dur: "01:47", when: "Fri 15:40" },
  { id: 2, type: "miss", label: "Missed call", who: "Nimal Perera", ext: "102", dur: "—", when: "Fri 16:55" },
  { id: 3, type: "in", label: "Inbound · answered", who: "Nimal Perera", ext: "101", dur: "04:32", when: "Mon 10:12" },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const ring = ref(false);
const rows = ref(0);
const task = ref(false);
const outcome = ref(false);

const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 15; // beats of 1.2 s

function reset() {
  ring.value = false;
  rows.value = 0;
  task.value = false;
  outcome.value = false;
}

function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b === 1) rows.value = 1;
  if (b === 3) rows.value = 2;
  if (b === 4) task.value = true;
  if (b === 6) ring.value = true;
  if (b === 9) { ring.value = false; rows.value = 3; }
  if (b === 10) outcome.value = true;
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
    // static picture: all three calls logged, recording and outcome on the last one
    seen.value = true;
    for (let k = 0; k < 12; k++) tick();
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

.vod {
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
.vod *, .vod *::before, .vod *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

.wrap { width: min(1180px, calc(100% - 40px)); margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 72px; align-items: center; }

/* ---------- copy ---------- */
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { margin: 0 0 28px; max-width: 54ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }
.feats { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.feats li { display: flex; align-items: center; gap: 14px; font-size: 15.5px; font-weight: 500; line-height: 1.45; }
.fi { flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; color: var(--ink); }
.fi.peach { background: var(--peach); }
.fi.lav { background: var(--lav); }
.fi.sky { background: var(--sky); }
.fi.butter { background: var(--butter); }
.fi.mint { background: var(--mint); }

/* ---------- visual ---------- */
.visual { display: grid; gap: 20px; min-width: 0; }
.doc { position: relative; display: flex; flex-direction: column; gap: 14px; padding: 22px; border-radius: 30px; min-width: 0; }
.pop { background: var(--sky); opacity: 0.6; transition: opacity 0.5s, transform 0.6s cubic-bezier(0.3, 1.4, 0.5, 1); }
.pop.ring { opacity: 1; transform: translateY(-3px); }
.tl { background: var(--lav); }
.dh { display: flex; align-items: center; gap: 12px; }
.badge { flex: none; padding: 6px 12px; border-radius: 99px; background: #fff; color: #5b45c9; font-size: 12px; font-weight: 600; }
.badge.pb { color: #3b82c4; }
.dt { min-width: 0; flex: 1; }
.dt b { display: block; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dt small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vtag { flex: none; padding: 5px 11px; border-radius: 99px; background: #5b45c9; color: #fff; font-size: 12px; font-weight: 600; }

.wave { flex: none; display: flex; align-items: center; gap: 3px; height: 22px; opacity: 0.35; }
.wave i { width: 4px; border-radius: 2px; background: #3b82c4; }
.wave i:nth-child(1) { height: 10px; }
.wave i:nth-child(2) { height: 20px; }
.wave i:nth-child(3) { height: 14px; }
.wave.on { opacity: 1; }
.wave.on i { animation: bar 0.8s ease-in-out infinite alternate; }
.wave.on i:nth-child(2) { animation-delay: 0.2s; }
.wave.on i:nth-child(3) { animation-delay: 0.4s; }
.vod:not(.live) .wave i { animation-play-state: paused; }

.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.c { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 99px; background: rgba(255, 255, 255, 0.6); color: #8a9bb0; font-size: 12px; font-weight: 600; transition: background 0.4s, color 0.4s, transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1); }
.chips.on .c { background: #fff; transform: scale(1.03); }
.chips.on .k { color: #5b45c9; }
.chips.on .t { color: #b0245a; }
.chips.on .q { color: #15803d; }

/* timeline rows */
.list { list-style: none; margin: 0; padding: 10px; border-radius: 22px; background: #fff; display: grid; gap: 6px; align-content: start; min-height: 278px; }
.row { display: grid; grid-template-columns: 32px minmax(0, 1fr) 46px 78px; align-items: start; gap: 12px; padding: 12px 12px; border-radius: 16px; font-size: 12.5px; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); }
.row.shown { opacity: 1; transform: none; }
.row.out.shown { background: var(--sky); }
.row.miss.shown { background: var(--pink); }
.row.in.shown { background: var(--mint); }
.ico { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: #fff; }
.out .ico { color: #3b82c4; }
.miss .ico { color: #b0245a; }
.in .ico { color: #15803d; }
.who { display: grid; gap: 1px; min-width: 0; }
.who b { font-weight: 600; }
.who small { color: var(--muted); font-size: 11.5px; }
.du { padding-top: 2px; text-align: right; font-weight: 500; }
.wh { padding-top: 2px; text-align: right; color: var(--muted); font-size: 11.5px; white-space: nowrap; }

.x { display: inline-flex; align-items: center; gap: 5px; width: max-content; padding: 3px 10px; border-radius: 99px; background: #fff; font-size: 11px; font-weight: 600; opacity: 0; transform: scale(0.85); transition: opacity 0.35s, transform 0.45s cubic-bezier(0.3, 1.8, 0.5, 1); }
.x.task { margin-top: 6px; color: #b0245a; }
.x.task.show { opacity: 1; transform: none; }
.xs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.xs .x { margin: 0; }
.xs.show .x { opacity: 1; transform: none; }
.x.rec { color: #c2410c; }
.x.out { color: #15803d; }

/* ---------- entrance ---------- */
.vod:not(.in) .wrap { opacity: 0; }
.vod.in .copy { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.vod.in .pop { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.vod.in .tl { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bar { to { transform: scaleY(0.4); } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .wrap { grid-template-columns: minmax(0, 1fr); gap: 52px; max-width: 640px; }
}
@media (max-width: 640px) {
  .vod { padding: 72px 0; }
  .wrap { width: calc(100% - 32px); }
  .lead { font-size: 15.5px; }
  .feats li { font-size: 14.5px; }
  .doc { padding: 18px; border-radius: 24px; }
  .dt small { display: none; }
  .row { grid-template-columns: 32px minmax(0, 1fr) 44px; gap: 10px; }
  .wh { display: none; }
  .list { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .vod *, .vod *::before, .vod *::after { animation: none !important; transition: none !important; }
  .vod:not(.in) .wrap { opacity: 1; }
}
</style>
