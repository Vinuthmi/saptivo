<template>
  <section id="suite" ref="root" class="sui" :class="{ in: seen, live }" aria-labelledby="sui-title">
    <header class="head">
      <h2 id="sui-title" class="title">
        <span>Part of the</span>
        <span class="soft">Weblook Business Suite</span>
      </h2>
      <p>
        Don't have a phone system yet? Voxinnova, Weblook's cloud phone system built on 3CX, works with Saptivo out of
        the box.
      </p>
    </header>

    <div class="stage">
      <!-- ============ Voxinnova ============ -->
      <article class="doc vox" aria-label="Voxinnova cloud phone system">
        <div class="dh">
          <span class="badge">Voxinnova</span>
          <div class="dt"><b>Cloud phone system</b><small>By Weblook</small></div>
          <span :key="conn" class="qs" :class="{ on: conn }">{{ conn ? "Connected" : "Ready" }}</span>
        </div>

        <div class="face">
          <img v-if="voxImageOk" class="feature-image" :src="voxPhoto" alt="" loading="lazy" decoding="async" @error="voxImageOk = false" />
          <span v-else class="hs">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
          </span>
          <b>Calls, queues, extensions</b>
          <span class="built">Built on 3CX</span>
        </div>
      </article>

      <!-- ============ the bridge ============ -->
      <div class="link" :class="{ flow: conn }" aria-hidden="true">
        <span class="dotp"></span>
        <span class="convert">
          Out of the box
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
        <small>no extra setup</small>
      </div>

      <!-- ============ Saptivo ============ -->
      <article class="doc sap" aria-label="Saptivo">
        <div class="dh">
          <span class="badge sb">Saptivo</span>
          <div class="dt"><b>Call journal</b><small>Matched to customers</small></div>
          <span :key="calls" class="qs" :class="{ on: calls > 0 }">{{ calls > 0 ? "Live" : "Waiting" }}</span>
        </div>

        <div class="mini-panel">
          <img v-if="sapImageOk" class="feature-image" :src="sapPhoto" alt="" loading="lazy" decoding="async" @error="sapImageOk = false" />
        </div>
        <ul class="jl">
          <li v-for="(j, i) in journal" :key="j.who" :class="[j.type, { shown: i < calls }]">
            <span class="ji">{{ j.type === "answered" ? "Answered" : "Outbound" }}</span>
            <span class="jw"><b>{{ j.who }}</b><small>{{ j.route }}</small></span>
            <span class="jt mono">{{ j.dur }}</span>
          </li>
        </ul>
      </article>
    </div>

    <div class="suite" aria-label="Weblook Business Suite">
      <span class="sl">Weblook Business Suite</span>
      <span class="sp"><i class="d1"></i>Saptivo · CRM, quotes and invoices</span>
      <span class="sp"><i class="d2"></i>Voxinnova · Cloud phone system</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const voxPhoto = "/saptivo/images/features/12.jpg";
const sapPhoto = "/saptivo/images/features/13.jpg";
const voxImageOk = ref(true);
const sapImageOk = ref(true);

const journal = [
  { type: "answered", who: "Ceylon Motors", route: "Ext 101 · Ruwan Silva", dur: "02:14" },
  { type: "out", who: "Lanka Tea Traders", route: "Ext 102 · Nadeesha J.", dur: "01:36" },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const conn = ref(false);
const calls = ref(0);

const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 11; // beats of 1.2 s

function reset() {
  conn.value = false;
  calls.value = 0;
}

function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b === 1) conn.value = true;
  if (b === 3) calls.value = 1;
  if (b === 5) calls.value = 2;
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
    // static picture: connected, both calls in the journal
    seen.value = true;
    for (let k = 0; k < 7; k++) tick();
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

.sui {
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
.sui *, .sui *::before, .sui *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

/* ---------- heading ---------- */
.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.head p { margin: 0 auto; max-width: 60ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

/* ---------- stage ---------- */
.stage { width: min(980px, calc(100% - 40px)); margin: 64px auto 0; display: grid; grid-template-columns: minmax(0, 1fr) 150px minmax(0, 1fr); align-items: stretch; }
.doc { position: relative; display: flex; flex-direction: column; gap: 16px; padding: 26px; border-radius: 30px; min-width: 0; }
.vox { background: var(--peach); }
.sap { background: var(--mint); }
.dh { display: flex; align-items: center; gap: 12px; }
.badge { flex: none; padding: 6px 12px; border-radius: 99px; background: #fff; color: #c2410c; font-size: 12px; font-weight: 600; }
.badge.sb { color: #15803d; }
.dt { min-width: 0; flex: 1; }
.dt b { display: block; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.dt small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qs { flex: none; padding: 5px 11px; border-radius: 99px; background: #fff; color: #8a857f; font-size: 12px; font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.qs.on { background: #15803d; color: #fff; }

/* Voxinnova */
.face { flex: 1; display: grid; place-items: center; align-content: center; gap: 12px; padding: 24px 16px; border-radius: 20px; background: #fff; text-align: center; min-height: 190px; }
.feature-image { width: 100%; height: 170px; object-fit: cover; border-radius: 18px; display: block; box-shadow: 0 18px 28px rgba(36, 24, 16, 0.1); }
.mini-panel { padding: 10px 10px 0; }
.mini-panel .feature-image { height: 128px; }
.hs { display: grid; place-items: center; width: 68px; height: 68px; border-radius: 50%; background: var(--peach); color: #c2410c; }
.face b { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.built { padding: 5px 13px; border-radius: 99px; background: var(--butter); color: #8a5a00; font-size: 12px; font-weight: 700; letter-spacing: 0.02em; }

/* bridge */
.link { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 0 10px; }
.link::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 2px dashed #d9cdf7; }
.link > * { position: relative; }
.convert { display: inline-flex; align-items: center; gap: 6px; padding: 11px 15px; border-radius: 99px; background: var(--pink); color: #b0245a; font-size: 12.5px; font-weight: 600; white-space: nowrap; box-shadow: 0 0 0 5px #fff; }
.link small { padding: 2px 8px; background: #fff; color: var(--muted); font-size: 11px; border-radius: 99px; white-space: nowrap; }
.dotp { position: absolute; left: 0; top: calc(50% - 4px); width: 8px; height: 8px; border-radius: 50%; background: #b0245a; opacity: 0; }
.link.flow .dotp { animation: travel 1.1s ease-in-out infinite; }
.sui:not(.live) .dotp { animation-play-state: paused; }

/* Saptivo */
.jl { list-style: none; margin: 0; padding: 12px; border-radius: 20px; background: #fff; display: grid; gap: 6px; align-content: start; flex: 1; min-height: 190px; }
.jl li { display: grid; grid-template-columns: 76px minmax(0, 1fr) 44px; align-items: center; gap: 10px; padding: 11px 12px; border-radius: 14px; font-size: 12.5px; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); }
.jl li.shown { opacity: 1; transform: none; }
.jl li.answered { background: var(--mint); }
.jl li.out { background: var(--sky); }
.ji { padding: 3px 9px; border-radius: 99px; background: #fff; font-size: 11px; font-weight: 600; text-align: center; }
.answered .ji { color: #15803d; }
.out .ji { color: #3b82c4; }
.jw { display: grid; min-width: 0; }
.jw b { font-weight: 600; }
.jw small { color: var(--muted); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.jt { text-align: right; color: var(--muted); font-weight: 500; }

/* suite strip */
.suite { width: min(980px, calc(100% - 40px)); margin: 28px auto 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; padding: 16px 20px; border-radius: 99px; background: var(--lav); }
.sl { padding: 7px 14px; border-radius: 99px; background: #5b45c9; color: #fff; font-size: 12.5px; font-weight: 600; }
.sp { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 99px; background: #fff; font-size: 12.5px; font-weight: 500; }
.sp i { width: 9px; height: 9px; border-radius: 50%; }
.d1 { background: #7fcfa0; }
.d2 { background: #ffb59a; }

/* ---------- entrance + pause ---------- */
.sui:not(.in) .head, .sui:not(.in) .stage, .sui:not(.in) .suite { opacity: 0; }
.sui.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.sui.in .vox { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.sui.in .link { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }
.sui.in .sap { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.4s backwards; }
.sui.in .suite { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.5s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: scale(1.18); opacity: 0.4; } to { transform: none; opacity: 1; } }
@keyframes travel { 0% { left: 0; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { left: calc(100% - 8px); opacity: 0; } }
@keyframes travelY { 0% { top: 0; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: calc(100% - 8px); opacity: 0; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .stage { grid-template-columns: minmax(0, 1fr); max-width: 560px; }
  .link { flex-direction: row; justify-content: center; padding: 22px 0; gap: 8px; flex-wrap: wrap; }
  .link::before { left: 50%; right: auto; top: 0; bottom: 0; border-top: 0; border-left: 2px dashed #d9cdf7; }
  .dotp { left: calc(50% - 4px); top: 0; }
  .link.flow .dotp { animation-name: travelY; }
  .convert svg { transform: rotate(90deg); }
}
@media (max-width: 640px) {
  .sui { padding: 72px 0; }
  .head p { font-size: 15.5px; }
  .stage { margin-top: 44px; width: calc(100% - 32px); }
  .doc { padding: 18px; border-radius: 24px; }
  .dt small { display: none; }
  .face, .jl { min-height: 0; }
  .jt { display: none; }
  .jl li { grid-template-columns: 76px minmax(0, 1fr); }
  .suite { width: calc(100% - 32px); border-radius: 28px; }
}
@media (prefers-reduced-motion: reduce) {
  .sui *, .sui *::before, .sui *::after { animation: none !important; transition: none !important; }
  .sui:not(.in) .head, .sui:not(.in) .stage, .sui:not(.in) .suite { opacity: 1; }
  .dotp { display: none; }
}
</style>
