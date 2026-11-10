<template>
  <section id="recordings" ref="root" class="rcd" :class="{ in: seen, live }" aria-labelledby="rcd-title">
    <header class="head">
      <h2 id="rcd-title" class="title">
        <span>Call recordings</span>
        <span class="soft">and outcomes</span>
      </h2>
      <p>
        Store call recordings against the customer and play them back from the timeline. After each call, reps capture
        an outcome such as interested, quote requested or call back later. Add Saptivo AI to transcribe and summarise
        calls automatically.
      </p>
    </header>

    <div class="stage">
      <!-- ============ 1 · recordings ============ -->
      <article class="tile peach" aria-label="Call recordings">
        <div class="shot">
          <img v-if="oks[0]" :src="photos[0]" alt="" loading="lazy" decoding="async" @error="oks[0] = false" />
          <span class="blob b1"></span><span class="blob b2"></span>
        </div>

        <div class="ui player">
          <div class="uh">
            <span class="chipb">Recording</span>
            <b>Ceylon Motors</b>
            <small>Today 10:12</small>
          </div>
          <div class="pl">
            <span class="play" :class="{ on: playing }">
              <svg v-if="!playing" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7Z" /></svg>
              <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
            </span>
            <div class="wave" aria-hidden="true">
              <i v-for="(h, i) in bars" :key="i" :class="{ done: (i + 1) / bars.length <= prog / 100 }" :style="{ height: h + 'px' }"></i>
            </div>
          </div>
          <div class="tm mono"><span>{{ elapsed }}</span><span>04:32</span></div>
        </div>

        <div class="tx">
          <h3>Recordings on the timeline</h3>
          <p>Stored against the customer and played back right from their timeline.</p>
        </div>
      </article>

      <!-- ============ 2 · outcomes ============ -->
      <article class="tile lav" aria-label="Call outcomes">
        <div class="shot">
          <img v-if="oks[1]" :src="photos[1]" alt="" loading="lazy" decoding="async" @error="oks[1] = false" />
          <span class="blob b1"></span><span class="blob b2"></span>
        </div>

        <div class="ui outc">
          <div class="uh">
            <span class="chipb">Outcome</span>
            <b>How did the call go?</b>
          </div>
          <div class="opts">
            <span v-for="(o, i) in outcomes" :key="o.t" class="op" :class="[o.tone, { on: oc === i }]">
              <svg v-if="oc === i" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
              {{ o.t }}
            </span>
          </div>
          <p :key="oc" class="saved" :class="{ show: oc >= 0 }">{{ oc >= 0 ? "Saved to the timeline · " + outcomes[oc].t : "Waiting for the rep…" }}</p>
        </div>

        <div class="tx">
          <h3>An outcome after every call</h3>
          <p>Reps capture interested, quote requested, call back later and more, in one tap.</p>
        </div>
      </article>

      <!-- ============ 3 · Saptivo AI ============ -->
      <article class="tile sky" aria-label="Saptivo AI call summary">
        <div class="shot">
          <img v-if="oks[2]" :src="photos[2]" alt="" loading="lazy" decoding="async" @error="oks[2] = false" />
          <span class="blob b1"></span><span class="blob b2"></span>
        </div>

        <div class="ui ai">
          <div class="uh">
            <span class="chipb aib">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9ZM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9Z" /></svg>
              Saptivo AI
            </span>
            <b>{{ al >= 3 ? "Summary ready" : "Transcribing…" }}</b>
          </div>
          <ul class="sumr">
            <li v-for="(s, i) in summary" :key="s" :class="{ shown: i < al }"><i></i><span>{{ s }}</span></li>
          </ul>
        </div>

        <div class="tx">
          <h3>Transcribed and summarised</h3>
          <p>Add Saptivo AI to transcribe and summarise every call automatically.</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

// Use the actual feature images shipped in /public/images/features/.
const photos = [
  "/saptivo/images/features/10.jpg",
  "/saptivo/images/features/12.jpg",
  "/saptivo/images/features/13.jpg",
].map((p) => encodeURI(p));
const oks = reactive([true, true, true]);

const bars = [10, 18, 12, 24, 16, 30, 20, 12, 26, 34, 18, 28, 14, 22, 32, 16, 26, 12, 20, 30, 18, 24, 14, 28, 20, 12, 22, 16];
const outcomes = [
  { t: "Interested", tone: "mint" },
  { t: "Quote requested", tone: "butter" },
  { t: "Call back later", tone: "pink" },
];
const summary = [
  "Wants a quote for 10 vehicles",
  "Asked about WhatsApp integration",
  "Follow up on Thursday",
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const playing = ref(false);
const prog = ref(0);
const oc = ref(-1);
const al = ref(0);

const elapsed = computed(() => {
  const s = Math.round((prog.value / 100) * 272);
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
});

const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 14; // beats of 1.2 s

function reset() {
  playing.value = false;
  prog.value = 0;
  oc.value = -1;
  al.value = 0;
}

function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b >= 1 && b <= 11) { playing.value = true; prog.value = Math.min(100, (b - 1) * 10); }
  if (b === 12) playing.value = false;
  if (b === 2) { oc.value = 0; al.value = 1; }
  if (b === 4) al.value = 2;
  if (b === 5) oc.value = 1;
  if (b === 7) al.value = 3;
  if (b === 8) oc.value = 2;
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
    // static picture: part-played recording, outcome chosen, summary ready
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

.rcd {
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
.rcd *, .rcd *::before, .rcd *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

/* ---------- heading ---------- */
.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.head p { margin: 0 auto; max-width: 60ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

/* ---------- stage ---------- */
.stage { width: min(1180px, calc(100% - 40px)); margin: 64px auto 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: stretch; }
.tile { position: relative; display: flex; flex-direction: column; padding: 14px 14px 26px; border-radius: 30px; min-width: 0; }
.tile.peach { background: var(--peach); }
.tile.lav { background: var(--lav); }
.tile.sky { background: var(--sky); }

.shot { position: relative; height: 230px; border-radius: 22px; overflow: hidden; background: #fff7f1; }
.lav .shot { background: #f7f5ff; }
.sky .shot { background: #f1f8ff; }
.shot img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.blob { position: absolute; border-radius: 50%; }
.b1 { width: 150px; height: 150px; right: -30px; top: -30px; background: var(--butter); opacity: 0.9; }
.b2 { width: 130px; height: 130px; left: -30px; bottom: -30px; background: var(--pink); opacity: 0.8; }
.lav .b1 { background: var(--sky); }
.lav .b2 { background: var(--peach); }
.sky .b1 { background: var(--mint); }
.sky .b2 { background: var(--lav); }

.ui { position: relative; z-index: 2; margin: -52px 12px 0; padding: 14px 16px; border-radius: 22px; background: #fff; box-shadow: 0 24px 40px -24px rgba(20, 18, 15, 0.35); display: grid; gap: 12px; }
.uh { display: flex; align-items: center; gap: 8px; min-width: 0; font-size: 12.5px; }
.uh b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.uh small { margin-left: auto; color: var(--muted); font-size: 11.5px; white-space: nowrap; }
.chipb { flex: none; display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; background: var(--peach); color: #c2410c; }
.outc .chipb { background: var(--lav); color: #5b45c9; }
.aib { background: var(--sky); color: #3b82c4; }

/* player */
.pl { display: flex; align-items: center; gap: 12px; }
.play { flex: none; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: var(--peach); color: #c2410c; transition: background 0.3s, color 0.3s; }
.play.on { background: #c2410c; color: #fff; }
.wave { flex: 1; min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 2px; height: 36px; }
.wave i { flex: 1; min-width: 2px; border-radius: 99px; background: #f3d9cc; transition: background 0.3s; }
.wave i.done { background: #c2410c; }
.tm { display: flex; justify-content: space-between; color: var(--muted); font-size: 11.5px; }

/* outcomes */
.opts { display: flex; flex-wrap: wrap; gap: 6px; }
.op { display: inline-flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; background: #f5f3f8; color: #7a6c9e; transition: background 0.35s, color 0.35s, transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1); }
.op.on { transform: scale(1.06); }
.op.mint.on { background: #15803d; color: #fff; }
.op.butter.on { background: #b45309; color: #fff; }
.op.pink.on { background: #b0245a; color: #fff; }
.saved { margin: 0; padding: 8px 12px; border-radius: 12px; background: #f5f3f8; color: var(--muted); font-size: 12px; font-weight: 500; animation: bump 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.saved.show { background: var(--mint); color: #15803d; }

/* AI */
.sumr { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; min-height: 96px; align-content: start; }
.sumr li { display: flex; align-items: center; gap: 10px; padding: 9px 11px; border-radius: 12px; background: var(--sky); font-size: 12.5px; font-weight: 500; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sumr li.shown { opacity: 1; transform: none; }
.sumr i { flex: none; width: 8px; height: 8px; border-radius: 50%; background: #3b82c4; }

/* text */
.tx { padding: 22px 14px 0; }
.tx h3 { margin: 0 0 8px; font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
.tx p { margin: 0; font-size: 14px; line-height: 1.65; color: var(--muted); }

/* ---------- entrance ---------- */
.rcd:not(.in) .head, .rcd:not(.in) .stage { opacity: 0; }
.rcd.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.rcd.in .tile:nth-child(1) { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.rcd.in .tile:nth-child(2) { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }
.rcd.in .tile:nth-child(3) { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.4s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: scale(1.06); opacity: 0.5; } to { transform: none; opacity: 1; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .stage { grid-template-columns: minmax(0, 1fr); max-width: 560px; }
}
@media (max-width: 640px) {
  .rcd { padding: 72px 0; }
  .head p { font-size: 15.5px; }
  .stage { margin-top: 44px; width: calc(100% - 32px); gap: 20px; }
  .tile { border-radius: 24px; }
  .shot { height: 200px; }
}
@media (prefers-reduced-motion: reduce) {
  .rcd *, .rcd *::before, .rcd *::after { animation: none !important; transition: none !important; }
  .rcd:not(.in) .head, .rcd:not(.in) .stage { opacity: 1; }
}
</style>
