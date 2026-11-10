<template>
  <section id="benefits" ref="root" class="ben" :class="{ in: seen, live }" aria-labelledby="ben-title">
    <header class="head">
      <h2 id="ben-title" class="title">
        <span>Benefits</span>
        <span class="soft">for your team</span>
      </h2>
    </header>

    <div class="stage">
      <!-- ============ 1 · receptionists ============ -->
      <article class="tile peach" :class="{ act: act === 1 }" aria-label="Receptionists">
        <div class="shot">
          <img v-if="photos[0] && oks[0]" :src="photos[0]" alt="" loading="lazy" decoding="async" @error="oks[0] = false" />
          <svg v-else class="ill" viewBox="0 0 320 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <circle cx="52" cy="50" r="44" fill="#fff3cf" /><circle cx="282" cy="150" r="52" fill="#ffe4ee" /><circle cx="270" cy="34" r="18" fill="#f0ecff" />
            <path d="M92 190c0-34 28-52 68-52s68 18 68 52Z" fill="#ffb59a" />
            <circle cx="160" cy="92" r="34" fill="#ffd9c7" />
            <path d="M126 88c0-26 16-40 34-40s34 14 34 40c-8-14-20-20-34-20s-26 6-34 20Z" fill="#8f6f63" />
            <path d="M122 96a38 38 0 0 1 76 0" fill="none" stroke="#14120f" stroke-width="5" stroke-linecap="round" />
            <rect x="114" y="92" width="14" height="24" rx="7" fill="#14120f" /><rect x="192" y="92" width="14" height="24" rx="7" fill="#14120f" />
          </svg>
        </div>
        <div class="ui">
          <div class="uh"><span class="chipb">Incoming</span><b>Nimal Perera</b><small>Ceylon Motors</small></div>
          <div class="urow">
            <span class="pill vip" :class="{ on: act >= 1 }">Key customer</span>
            <span class="pill rt" :class="{ on: act >= 1 }">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              Routed to Ruwan · Sales
            </span>
          </div>
        </div>
        <div class="tx">
          <h3>Receptionists</h3>
          <p>Receptionists route calls faster because they know who is calling.</p>
        </div>
      </article>

      <!-- ============ 2 · sales ============ -->
      <article class="tile butter" :class="{ act: act === 2 }" aria-label="Sales reps">
        <div class="shot">
          <img v-if="photos[1] && oks[1]" :src="photos[1]" alt="" loading="lazy" decoding="async" @error="oks[1] = false" />
          <svg v-else class="ill" viewBox="0 0 320 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <circle cx="268" cy="46" r="44" fill="#ffe9df" /><circle cx="44" cy="150" r="52" fill="#e3f6ec" /><circle cx="60" cy="40" r="18" fill="#e0f0ff" />
            <path d="M92 190c0-34 28-52 68-52s68 18 68 52Z" fill="#b9a8f0" />
            <circle cx="160" cy="92" r="34" fill="#f5cdb6" />
            <path d="M124 90c2-28 18-42 36-42s36 14 36 40c-4-10-10-14-16-16-10 6-26 8-40 4-6 4-12 8-16 14Z" fill="#3a2b27" />
          </svg>
        </div>
        <div class="ui">
          <div class="uh"><span class="chipb sb">Before hello</span><b>Ceylon Motors</b></div>
          <ul class="mini">
            <li :class="{ shown: act >= 2 }"><small>Last quote</small><b class="mono">QT-0142 · Rs. 405,000</b><em class="ok">Accepted</em></li>
            <li :class="{ shown: act >= 2 }"><small>Open tasks</small><b>2 · send site report</b></li>
          </ul>
        </div>
        <div class="tx">
          <h3>Sales reps</h3>
          <p>Sales reps see the last quote and open tasks before they say hello.</p>
        </div>
      </article>

      <!-- ============ 3 · support ============ -->
      <article class="tile sky" :class="{ act: act === 3 }" aria-label="Support agents">
        <div class="shot">
          <img v-if="photos[2] && oks[2]" :src="photos[2]" alt="" loading="lazy" decoding="async" @error="oks[2] = false" />
          <svg v-else class="ill" viewBox="0 0 320 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <circle cx="52" cy="46" r="44" fill="#f0ecff" /><circle cx="276" cy="148" r="52" fill="#fff3cf" /><circle cx="272" cy="36" r="18" fill="#ffe4ee" />
            <path d="M92 190c0-34 28-52 68-52s68 18 68 52Z" fill="#7fcfa0" />
            <circle cx="160" cy="92" r="34" fill="#ffd9c7" />
            <path d="M124 94c-4-30 12-46 36-46s40 16 36 46c-4-8-6-14-8-22-12 6-44 6-56 0-2 8-4 14-8 22Z" fill="#5c3b2e" />
            <path d="M124 98a36 36 0 0 1 72 0" fill="none" stroke="#14120f" stroke-width="5" stroke-linecap="round" />
            <path d="M200 100v10a10 10 0 0 1-10 10h-12" fill="none" stroke="#14120f" stroke-width="4" stroke-linecap="round" />
          </svg>
        </div>
        <div class="ui">
          <div class="uh"><span class="chipb ib">Instantly</span><b>Ceylon Motors</b></div>
          <ul class="mini">
            <li :class="{ shown: act >= 3 }"><small>Open tickets</small><b>2 · brake check, invoice query</b></li>
            <li :class="{ shown: act >= 3 }"><small>Recent purchases</small><b>Fleet service plan · 12 Oct</b></li>
          </ul>
        </div>
        <div class="tx">
          <h3>Support agents</h3>
          <p>Support agents see open tickets and recent purchases instantly.</p>
        </div>
      </article>

      <!-- ============ 4 · managers ============ -->
      <article class="tile lav" :class="{ act: act === 4 }" aria-label="Managers">
        <div class="shot">
          <img v-if="photos[3] && oks[3]" :src="photos[3]" alt="" loading="lazy" decoding="async" @error="oks[3] = false" />
          <svg v-else class="ill" viewBox="0 0 320 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <circle cx="266" cy="44" r="44" fill="#e0f0ff" /><circle cx="46" cy="148" r="52" fill="#ffe9df" /><circle cx="52" cy="38" r="18" fill="#e3f6ec" />
            <path d="M92 190c0-34 28-52 68-52s68 18 68 52Z" fill="#f5a8c4" />
            <circle cx="160" cy="92" r="34" fill="#f5cdb6" />
            <path d="M126 84c2-24 16-36 34-36s32 12 34 36c-8-8-18-12-34-12s-26 4-34 12Z" fill="#2c2420" />
            <path d="M150 140l10 14 10-14" fill="#fff" />
          </svg>
        </div>
        <div class="ui">
          <div class="uh"><span class="chipb mb">By extension</span><b>This week</b><small>calls · missed · callback</small></div>
          <ul class="ext">
            <li v-for="e in exts" :key="e.x" :class="{ shown: act >= 4 }">
              <span class="xn">Ext {{ e.x }}</span>
              <span class="bar"><i :style="{ width: (act >= 4 ? e.pct : 0) + '%' }"></i></span>
              <b class="mono">{{ e.calls }}</b>
              <em :class="e.miss > 4 ? 'bad' : 'ok'">{{ e.miss }} missed</em>
              <small class="mono">{{ e.cb }}</small>
            </li>
          </ul>
        </div>
        <div class="tx">
          <h3>Managers</h3>
          <p>Managers see call volumes, missed calls and callback times by extension.</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";

// Use the feature image set shipped in /public/images/features/.
const photos = [
  "/saptivo/images/features/10.jpg",
  "/saptivo/images/features/12.jpg",
  "/saptivo/images/features/13.jpg",
  "/saptivo/images/features/14.jpg",
];
const oks = reactive([true, true, true, true]);

const exts = [
  { x: "101", calls: 42, miss: 3, cb: "5 min", pct: 100 },
  { x: "102", calls: 35, miss: 6, cb: "9 min", pct: 83 },
  { x: "103", calls: 28, miss: 1, cb: "3 min", pct: 67 },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const act = ref(0);

const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 14; // beats of 1.2 s

function tick() {
  const b = st.beat;
  if (b === 0) act.value = 0;
  if (b === 1) act.value = 1;
  if (b === 3) act.value = 2;
  if (b === 5) act.value = 3;
  if (b === 7) act.value = 4;
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
    // static picture: every card filled in
    seen.value = true;
    for (let k = 0; k < 9; k++) tick();
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

.ben {
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
.ben *, .ben *::before, .ben *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

/* ---------- heading ---------- */
.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }

/* ---------- stage ---------- */
.stage { width: min(1080px, calc(100% - 40px)); margin: 64px auto 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.tile { position: relative; display: flex; flex-direction: column; padding: 14px 14px 26px; border-radius: 30px; min-width: 0; transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1), box-shadow 0.5s; }
.tile.act { transform: translateY(-4px); box-shadow: 0 26px 40px -28px rgba(20, 18, 15, 0.35); }
.tile.peach { background: var(--peach); }
.tile.butter { background: var(--butter); }
.tile.sky { background: var(--sky); }
.tile.lav { background: var(--lav); }

.shot { position: relative; height: 200px; border-radius: 22px; overflow: hidden; background: #fff; }
.shot img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ill { position: absolute; inset: 0; width: 100%; height: 100%; }

.ui { position: relative; z-index: 2; margin: -46px 14px 0; padding: 14px 16px; border-radius: 22px; background: #fff; box-shadow: 0 24px 40px -24px rgba(20, 18, 15, 0.35); display: grid; gap: 10px; }
.uh { display: flex; align-items: center; gap: 8px; min-width: 0; font-size: 12.5px; }
.uh b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.uh small { margin-left: auto; color: var(--muted); font-size: 11.5px; white-space: nowrap; }
.chipb { flex: none; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; background: var(--peach); color: #c2410c; }
.chipb.sb { background: var(--butter); color: #8a5a00; }
.chipb.ib { background: var(--sky); color: #3b82c4; }
.chipb.mb { background: var(--lav); color: #5b45c9; }

.urow { display: flex; flex-wrap: wrap; gap: 6px; }
.pill { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 99px; background: #f5f3f8; color: #8a857f; font-size: 12px; font-weight: 600; opacity: 0.5; transition: background 0.4s, color 0.4s, opacity 0.4s, transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1); }
.pill.on { opacity: 1; transform: scale(1.03); }
.pill.vip.on { background: var(--butter); color: #8a5a00; }
.pill.rt.on { background: #15803d; color: #fff; }

.mini { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.mini li { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 12px; background: #faf8fc; font-size: 12.5px; opacity: 0.4; transform: translateY(6px); transition: opacity 0.4s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.3s; }
.mini li.shown { opacity: 1; transform: none; }
.butter .mini li.shown { background: var(--butter); }
.sky .mini li.shown { background: var(--sky); }
.mini small { flex: none; width: 96px; color: var(--muted); font-size: 11.5px; font-weight: 500; }
.mini b { flex: 1; min-width: 0; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mini em, .ext em { flex: none; padding: 2px 9px; border-radius: 99px; font-size: 10.5px; font-style: normal; font-weight: 600; }
.ok { background: var(--mint); color: #15803d; }
.bad { background: var(--pink); color: #b0245a; }

.ext { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.ext li { display: grid; grid-template-columns: 46px minmax(0, 1fr) 26px 66px 44px; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 12px; background: #faf8fc; font-size: 12px; opacity: 0.4; transition: opacity 0.4s, background 0.3s; }
.ext li.shown { opacity: 1; background: var(--lav); }
.xn { font-weight: 600; color: #5b45c9; }
.bar { height: 8px; border-radius: 99px; background: #fff; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 99px; background: #9d8be0; transition: width 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ext b { text-align: right; font-weight: 600; }
.ext em { text-align: center; }
.ext small { text-align: right; color: var(--muted); font-size: 11.5px; }

.tx { padding: 22px 14px 0; }
.tx h3 { margin: 0 0 8px; font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
.tx p { margin: 0; font-size: 14px; line-height: 1.65; color: var(--muted); }

/* ---------- entrance ---------- */
.ben:not(.in) .head, .ben:not(.in) .stage { opacity: 0; }
.ben.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.ben.in .tile:nth-child(1) { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.ben.in .tile:nth-child(2) { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s backwards; }
.ben.in .tile:nth-child(3) { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
.ben.in .tile:nth-child(4) { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.4s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

/* ---------- responsive ---------- */
@media (max-width: 860px) {
  .stage { grid-template-columns: minmax(0, 1fr); max-width: 560px; }
}
@media (max-width: 640px) {
  .ben { padding: 72px 0; }
  .stage { margin-top: 44px; width: calc(100% - 32px); gap: 20px; }
  .tile { border-radius: 24px; }
  .shot { height: 180px; }
  .ui { margin-inline: 8px; padding: 12px; }
  .mini small { width: 78px; }
  .ext li { grid-template-columns: 44px minmax(0, 1fr) 24px 62px; }
  .ext small { display: none; }
  .uh small { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ben *, .ben *::before, .ben *::after { animation: none !important; transition: none !important; }
  .ben:not(.in) .head, .ben:not(.in) .stage { opacity: 1; }
}
</style>
