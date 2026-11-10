<template>
  <section id="mapping" ref="root" class="tcx" :class="{ in: seen, live }" aria-labelledby="tcx-title">
    <header class="head">
      <h2 id="tcx-title" class="title">
        <span>How the 3CX</span>
        <span class="soft">mapping works</span>
      </h2>
      <p>
        Connect your 3CX system once, map your main DID, queues and extensions to Saptivo users, and calls start
        appearing in the journal immediately.
      </p>
    </header>

    <div class="stage">
      <!-- steps -->
      <ol class="steps" aria-label="Setup steps">
        <li v-for="(s, i) in steps" :key="s.t" :class="[s.tone, { on: step >= i + 1, cur: step === i + 1 }]">
          <span class="n">{{ i + 1 }}</span>
          <span class="sx"><b>{{ s.t }}</b><small>{{ s.d }}</small></span>
        </li>
      </ol>

      <!-- mapping -->
      <article class="doc mapc" aria-label="3CX mapping">
        <div class="photo-strip">
          <img v-if="mapImageOk" class="feature-image main" :src="mapPhoto" alt="" loading="lazy" decoding="async" @error="mapImageOk = false" />
          <img v-if="teamImageOk" class="feature-image side" :src="teamPhoto" alt="" loading="lazy" decoding="async" @error="teamImageOk = false" />
        </div>

        <div class="cols">
          <div class="ch a">
            <span class="badge">3CX</span>
            <span :key="connected" class="qs" :class="{ on: connected }">{{ connected ? "Connected" : "Not connected" }}</span>
          </div>
          <span></span>
          <div class="ch b">
            <span class="badge sb">Saptivo users</span>
            <span class="cnt mono">{{ m }} / {{ maps.length }} mapped</span>
          </div>
        </div>

        <ul class="rows">
          <li v-for="(r, i) in maps" :key="r.val" :class="{ mapped: i < m, cur: i === m - 1 }">
            <span class="src" :class="r.tone">
              <small>{{ r.kind }}</small>
              <b>{{ r.val }}</b>
            </span>
            <span class="wire" aria-hidden="true">
              <i></i>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
            </span>
            <span class="usr">
              <i class="av" :class="r.tone">{{ r.av }}</i>
              <span><b>{{ r.user }}</b><small>{{ r.sub }}</small></span>
            </span>
          </li>
        </ul>

        <div class="jr">
          <div class="jh">
            <b>Call journal</b>
            <span :key="jn" class="lv" :class="{ on: jn > 0 }"><em></em>{{ jn > 0 ? "Live" : "Waiting for calls" }}</span>
          </div>
          <ul class="jl">
            <li v-for="(j, i) in journal" :key="j.id" :class="[j.type, { shown: i < jn }]">
              <span class="ji">{{ j.type === "answered" ? "Answered" : "Missed" }}</span>
              <span class="jw"><b>{{ j.who }}</b><small>{{ j.route }}</small></span>
              <span class="jt mono">{{ j.dur }}</span>
            </li>
          </ul>
        </div>
      </article>

      <!-- integrations + scale -->
      <div class="lower">
        <article class="doc more" aria-label="Other telephony integrations">
          <div class="dh">
            <span class="badge pb">Also integrates with</span>
          </div>
          <div class="feature-mini-wrap">
            <img v-if="providerImageOk" class="feature-image mini" :src="providerPhoto" alt="" loading="lazy" decoding="async" @error="providerImageOk = false" />
          </div>
          <div class="provs">
            <span v-for="p in providers" :key="p.n" class="pv" :class="p.tone">
              <b>{{ p.n }}</b>
              <small>{{ p.d }}</small>
            </span>
          </div>
        </article>

        <article class="doc scale" aria-label="Works at any size">
          <div class="dh">
            <span class="badge sc">Any size</span>
          </div>
          <div class="sizes">
            <span class="sz">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" /></svg>
              One receptionist
            </span>
            <span class="sz">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.4" /><circle cx="17" cy="9" r="2.6" /><path d="M3 20c.9-3.2 3.2-4.6 6-4.6s5.1 1.4 6 4.6M16 14.8c2.4 0 4.2 1.2 5 4" /></svg>
              A full call centre
            </span>
          </div>
        </article>
      </div>
    </div>

    <p class="foot">This CRM telephony integration works for one receptionist or a full call centre.</p>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const mapPhoto = "/saptivo/images/features/10.jpg";
const teamPhoto = "/saptivo/images/features/12.jpg";
const providerPhoto = "/saptivo/images/features/13.jpg";
const mapImageOk = ref(true);
const teamImageOk = ref(true);
const providerImageOk = ref(true);

const steps = [
  { t: "Connect 3CX once", d: "One secure link", tone: "peach" },
  { t: "Map DID, queues, extensions", d: "To Saptivo users", tone: "butter" },
  { t: "Calls appear in the journal", d: "Immediately", tone: "mint" },
];

const maps = [
  { kind: "Main DID", val: "+94 11 234 5678", tone: "peach", user: "Reception", sub: "Amali Perera", av: "AP" },
  { kind: "Queue 800", val: "Sales", tone: "butter", user: "Sales team", sub: "3 agents", av: "ST" },
  { kind: "Queue 801", val: "Support", tone: "sky", user: "Support team", sub: "4 agents", av: "SU" },
  { kind: "Extension", val: "101", tone: "lav", user: "Ruwan Silva", sub: "Sales", av: "RS" },
  { kind: "Extension", val: "102", tone: "pink", user: "Nadeesha Jayasinghe", sub: "Support", av: "NJ" },
  { kind: "Extension", val: "103", tone: "mint", user: "Tharindu Gomes", sub: "Sales", av: "TG" },
];

const journal = [
  { id: 1, type: "answered", who: "Ceylon Motors", route: "Ext 101 → Ruwan Silva", dur: "02:14" },
  { id: 2, type: "missed", who: "Lanka Tea Traders", route: "Queue 800 → Sales team", dur: "—" },
];

const providers = [
  { n: "Vodia PBX", d: "Including Vodia's AI voice agents", tone: "lav" },
  { n: "Twilio", d: "VoIP provider", tone: "peach" },
  { n: "Vonage", d: "VoIP provider", tone: "mint" },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const step = ref(0);
const connected = ref(false);
const m = ref(0);
const jn = ref(0);

const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 17; // beats of 1.2 s

function reset() {
  step.value = 0;
  connected.value = false;
  m.value = 0;
  jn.value = 0;
}

function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b === 1) { step.value = 1; connected.value = true; }
  if (b === 3) { step.value = 2; m.value = 1; }
  if (b >= 4 && b <= 8) m.value = b - 2;
  if (b === 9) { step.value = 3; jn.value = 1; }
  if (b === 12) jn.value = 2;
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
    // static picture: everything mapped, calls in the journal
    seen.value = true;
    for (let k = 0; k < 13; k++) tick();
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

.tcx {
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
.tcx *, .tcx *::before, .tcx *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

/* ---------- heading ---------- */
.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.head p { margin: 0 auto; max-width: 60ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

/* ---------- stage ---------- */
.stage { width: min(1040px, calc(100% - 40px)); margin: 64px auto 0; display: grid; gap: 24px; }

.steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.steps li { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 22px; background: #faf8fc; opacity: 0.55; transition: opacity 0.4s, background 0.4s, transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1); }
.steps li.on { opacity: 1; }
.steps li.cur { transform: translateY(-3px); }
.steps li.on.peach { background: var(--peach); }
.steps li.on.butter { background: var(--butter); }
.steps li.on.mint { background: var(--mint); }
.n { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: #fff; font-size: 13px; font-weight: 600; }
.sx { display: grid; min-width: 0; }
.sx b { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
.sx small { color: var(--muted); font-size: 12px; }

.doc { position: relative; display: flex; flex-direction: column; gap: 16px; padding: 26px; border-radius: 30px; min-width: 0; }
.feature-image { display: block; width: 100%; height: 170px; object-fit: cover; border-radius: 18px; box-shadow: 0 18px 28px rgba(26, 24, 22, 0.08); }
.photo-strip { display: grid; grid-template-columns: 1.5fr 0.9fr; gap: 12px; }
.feature-image.side { height: 170px; }
.feature-mini-wrap { padding-top: 4px; }
.feature-image.mini { height: 110px; }
.mapc { background: var(--lav); }
.badge { flex: none; padding: 6px 12px; border-radius: 99px; background: #fff; color: #c2410c; font-size: 12px; font-weight: 600; }
.badge.sb { color: #15803d; }
.badge.pb { color: #5b45c9; }
.badge.sc { color: #8a5a00; }
.qs { flex: none; padding: 5px 11px; border-radius: 99px; background: #fff; color: #8a857f; font-size: 12px; font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.qs.on { background: #15803d; color: #fff; }
.cnt { color: var(--muted); font-size: 12px; font-weight: 600; }

.cols { display: grid; grid-template-columns: minmax(0, 1fr) 84px minmax(0, 1fr); align-items: center; gap: 0; }
.ch { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 0 4px; }

/* rows */
.rows { list-style: none; margin: 0; padding: 12px; border-radius: 22px; background: #fff; display: grid; gap: 6px; }
.rows li { display: grid; grid-template-columns: minmax(0, 1fr) 84px minmax(0, 1fr); align-items: center; }
.src, .usr { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 16px; min-width: 0; }
.src { flex-direction: column; align-items: flex-start; gap: 1px; }
.src small { color: var(--muted); font-size: 11px; font-weight: 600; }
.src b { font-size: 13.5px; font-weight: 600; }
.src.peach { background: var(--peach); }
.src.butter { background: var(--butter); }
.src.sky { background: var(--sky); }
.src.lav { background: var(--lav); }
.src.pink { background: var(--pink); }
.src.mint { background: var(--mint); }
.usr { background: #faf8fc; opacity: 0.4; transition: opacity 0.4s, background 0.4s; }
.mapped .usr { opacity: 1; background: var(--mint); }
.usr > span:last-child { display: grid; min-width: 0; font-size: 12.5px; }
.usr b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.usr small { color: var(--muted); font-size: 11.5px; }
.av { flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; font-size: 11px; font-style: normal; font-weight: 600; background: #fff; color: #5b45c9; }

.wire { position: relative; display: grid; place-items: center; height: 100%; }
.wire i { position: absolute; left: 6px; right: 6px; top: 50%; border-top: 2px dashed #ddd3f5; transition: border-color 0.4s; }
.wire svg { position: relative; display: grid; width: 24px; height: 24px; padding: 4px; border-radius: 50%; background: #fff; color: #fff; transition: background 0.35s, color 0.35s, transform 0.45s cubic-bezier(0.3, 1.8, 0.5, 1); transform: scale(0.6); }
.mapped .wire i { border-top: 2px solid #7fcfa0; }
.mapped .wire svg { background: #15803d; color: #fff; transform: scale(1); }

/* journal */
.jr { display: grid; gap: 8px; padding: 14px 16px; border-radius: 22px; background: #fff; }
.jh { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 13px; }
.lv { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 99px; background: #f5f3f8; color: #8a857f; font-size: 11.5px; font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.lv em { width: 7px; height: 7px; border-radius: 50%; background: #c9c3d6; }
.lv.on { background: var(--mint); color: #15803d; }
.lv.on em { background: #15803d; }
.jl { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; min-height: 108px; align-content: start; }
.jl li { display: grid; grid-template-columns: 78px minmax(0, 1fr) 48px; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 14px; font-size: 12.5px; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); }
.jl li.shown { opacity: 1; transform: none; }
.jl li.answered { background: var(--mint); }
.jl li.missed { background: var(--pink); }
.ji { padding: 3px 9px; border-radius: 99px; background: #fff; font-size: 11px; font-weight: 600; text-align: center; }
.answered .ji { color: #15803d; }
.missed .ji { color: #b0245a; }
.jw { display: grid; min-width: 0; }
.jw b { font-weight: 600; }
.jw small { color: var(--muted); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.jt { text-align: right; color: var(--muted); font-weight: 500; }

/* lower */
.lower { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: 24px; }
.more { background: var(--sky); }
.scale { background: var(--butter); }
.provs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.pv { display: grid; gap: 3px; padding: 16px; border-radius: 20px; align-content: start; }
.pv b { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.pv small { color: #6f6862; font-size: 11.5px; line-height: 1.45; }
.pv.lav { background: var(--lav); }
.pv.peach { background: var(--peach); }
.pv.mint { background: var(--mint); }
.sizes { display: grid; gap: 10px; }
.sz { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 20px; background: #fff; font-size: 14px; font-weight: 600; }
.sz svg { flex: none; color: #8a5a00; }

.foot { width: min(680px, calc(100% - 40px)); margin: 36px auto 0; text-align: center; font-size: 15.5px; line-height: 1.75; color: var(--muted); }

/* ---------- entrance ---------- */
.tcx:not(.in) .head, .tcx:not(.in) .stage, .tcx:not(.in) .foot { opacity: 0; }
.tcx.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.tcx.in .steps { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.tcx.in .mapc { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }
.tcx.in .lower { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.4s backwards; }
.tcx.in .foot { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.5s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: scale(1.18); opacity: 0.4; } to { transform: none; opacity: 1; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .steps { grid-template-columns: minmax(0, 1fr); }
  .lower { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 640px) {
  .tcx { padding: 72px 0; }
  .head p { font-size: 15.5px; }
  .stage { margin-top: 44px; width: calc(100% - 32px); }
  .doc { padding: 18px; border-radius: 24px; }
  .cols, .rows li { grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr); }
  .src, .usr { padding: 9px 10px; gap: 8px; }
  .usr small { display: none; }
  .av { width: 26px; height: 26px; font-size: 10px; }
  .cnt { display: none; }
  .provs { grid-template-columns: minmax(0, 1fr); }
  .jl li { grid-template-columns: 68px minmax(0, 1fr); }
  .jt { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .tcx *, .tcx *::before, .tcx *::after { animation: none !important; transition: none !important; }
  .tcx:not(.in) .head, .tcx:not(.in) .stage, .tcx:not(.in) .foot { opacity: 1; }
}
</style>
