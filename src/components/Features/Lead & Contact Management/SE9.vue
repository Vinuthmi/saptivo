<template>
  <section id="results" ref="root" class="rs" :class="{ in: seen, live }" aria-labelledby="rs-title">
    <h2 id="rs-title" class="title">
      <span>The results</span>
      <span class="soft">you can expect</span>
    </h2>

    <div class="cols">
      <!-- 1 · response time -->
      <article class="col" style="--i: 0">
        <p class="big"><span class="from">4 h</span><span class="arrow">→</span><span class="to">5 min</span></p>
        <h3>Faster response times</h3>
        <p class="why">Leads reach the right person immediately.</p>

        <div :key="'a' + run" class="chart c1">
          <div class="hb">
            <span class="hl">Shared inbox</span>
            <span class="track"><i class="before" style="--w: 100%"></i></span>
            <span class="hv">4 h</span>
          </div>
          <div class="hb">
            <span class="hl">With Saptivo</span>
            <span class="track"><i class="after" style="--w: 9%"></i></span>
            <span class="hv">5 min</span>
          </div>
          <p class="cap">Average time to first reply</p>
        </div>
      </article>

      <!-- 2 · lost enquiries -->
      <article class="col" style="--i: 1">
        <p class="big"><span class="from">7</span><span class="arrow">→</span><span class="to">1</span><small>lost per 20</small></p>
        <h3>Fewer lost enquiries</h3>
        <p class="why">Nothing lives only in a personal inbox or phone.</p>

        <div :key="'b' + run" class="chart c2">
          <p class="rowl">Before</p>
          <ul class="dots">
            <li v-for="n in 20" :key="'x' + n" :class="{ lost: lostBefore.includes(n) }" :style="{ '--d': n * 0.035 + 's' }"></li>
          </ul>
          <p class="rowl">With Saptivo</p>
          <ul class="dots">
            <li v-for="n in 20" :key="'y' + n" :class="{ lost: lostAfter.includes(n) }" :style="{ '--d': 0.8 + n * 0.035 + 's' }"></li>
          </ul>
          <p class="cap"><span class="key got"></span>Followed up <span class="key miss"></span>Lost</p>
        </div>
      </article>

      <!-- 3 · marketing decisions -->
      <article class="col" style="--i: 2">
        <p class="big"><span class="to">WhatsApp</span><small>top source</small></p>
        <h3>Clearer marketing decisions</h3>
        <p class="why">You can see which source brings paying customers.</p>

        <div :key="'c' + run" class="chart c3">
          <div v-for="(s, i) in sources" :key="s.name" class="vb" :class="{ top: s.top }" :style="{ '--h': s.v * 2.4 + 'px', '--d': i * 0.12 + 's' }">
            <b>{{ s.v }}</b>
            <i></i>
            <span>{{ s.name }}</span>
          </div>
          <p class="cap">Paying customers by source</p>
        </div>
      </article>
    </div>

    <p class="note">Illustrative example figures. Your results depend on your team and your data.</p>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "ResultsSection" });

const lostBefore = [3, 6, 9, 12, 15, 17, 20];
const lostAfter = [14];
const sources = [
  { name: "Website", v: 22 },
  { name: "WhatsApp", v: 31, top: true },
  { name: "Facebook", v: 14 },
  { name: "Calls", v: 9 },
];

// bumping this restarts the chart animations
const run = ref(0);

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(() => { run.value += 1; }, 7000);
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
  stop();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

.rs {
  --orange: #ff6338;
  --orange-soft: #fff1ec;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #f1e7e2;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fffaf7;
  font-family: "Inter", system-ui, sans-serif;
}
.rs *, .rs *::before, .rs *::after { box-sizing: border-box; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em;
}
.title span { display: block; }
.title .soft { color: var(--muted); }

/* three open columns split by hairlines, no boxes */
.cols { width: min(1180px, calc(100% - 40px)); margin: 64px auto 0; display: grid; grid-template-columns: repeat(3, 1fr); }
.col { display: flex; flex-direction: column; padding: 8px 40px 8px; border-left: 1px solid #ecdfd7; }
.col:first-child { padding-left: 0; border-left: 0; }
.col:last-child { padding-right: 0; }

.big { margin: 0; display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; font-size: clamp(34px, 3.4vw, 48px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.1; }
.big .from { color: #b8b1ab; text-decoration: line-through; text-decoration-thickness: 2px; }
.big .arrow { color: #c9c2bb; font-size: 0.6em; }
.big .to { color: var(--orange); }
.big small { font-size: 12.5px; font-weight: 400; letter-spacing: 0; color: var(--muted); }
.col h3 { margin: 18px 0 6px; font-size: 20px; font-weight: 500; letter-spacing: -0.01em; }
.why { margin: 0; font-size: 15px; line-height: 1.7; color: var(--muted); }

.chart { margin-top: 30px; padding-top: 22px; border-top: 1px dashed #e6d6cc; }
.cap { margin: 16px 0 0; display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: #a39d97; }

/* 1 · horizontal bars */
.c1 { display: grid; gap: 14px; }
.hb { display: grid; grid-template-columns: 92px 1fr 44px; align-items: center; gap: 10px; font-size: 12.5px; }
.hl { color: var(--muted); }
.hv { text-align: right; font-weight: 500; font-variant-numeric: tabular-nums; }
.track { height: 12px; border-radius: 99px; background: #f3ece8; overflow: hidden; }
.track i { display: block; height: 100%; width: var(--w); border-radius: 99px; animation: grow 1.1s cubic-bezier(0.3, 0.7, 0.2, 1) backwards; }
.track .before { background: #d9cfc7; }
.track .after { background: var(--orange); animation-delay: 0.5s; }

/* 2 · dots */
.rowl { margin: 0 0 8px; font-size: 12.5px; color: var(--muted); }
.dots { list-style: none; margin: 0 0 18px; padding: 0; display: grid; grid-template-columns: repeat(10, 1fr); gap: 8px; }
.dots li { aspect-ratio: 1; border-radius: 50%; background: var(--orange); animation: pop 0.45s cubic-bezier(0.3, 1.4, 0.5, 1) var(--d) backwards; }
.dots li.lost { background: transparent; border: 2px dashed #cfc5bc; }
.key { width: 10px; height: 10px; border-radius: 50%; }
.key.got { background: var(--orange); }
.key.miss { margin-left: 8px; border: 2px dashed #cfc5bc; }

/* 3 · vertical bars */
.c3 { display: grid; grid-template-columns: repeat(4, 1fr); align-items: end; gap: 14px; }
.vb { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 6px; min-height: 210px; }
.vb b { font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; }
.vb i { display: block; width: 100%; max-width: 54px; height: var(--h); border-radius: 10px 10px 4px 4px; background: #ffd9c9; transform-origin: bottom; animation: rise-bar 0.9s cubic-bezier(0.3, 0.7, 0.2, 1) var(--d) backwards; }
.vb.top i { background: var(--orange); }
.vb span { font-size: 11.5px; color: var(--muted); text-align: center; }
.c3 .cap { grid-column: 1 / -1; margin-top: 6px; }

.note { width: min(1180px, calc(100% - 40px)); margin: 52px auto 0; font-size: 12px; color: #a39d97; }

/* entrance (runs once) */
.rs:not(.in) .col, .rs:not(.in) .note { opacity: 0; }
.rs.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.rs.in .title .soft { animation-delay: 0.1s; }
.rs.in .col { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) calc(var(--i) * 0.14s + 0.2s) backwards; }
.rs.in .note { animation: rise 0.8s ease 0.8s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes grow { from { width: 0; } to { width: var(--w); } }
@keyframes pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
@keyframes rise-bar { from { transform: scaleY(0); } to { transform: none; } }

@media (max-width: 960px) {
  .cols { grid-template-columns: 1fr; gap: 44px; }
  .col, .col:first-child, .col:last-child { padding: 0; border-left: 0; }
  .col + .col { padding-top: 44px; border-top: 1px solid #ecdfd7; }
  .col { max-width: 560px; }
}
@media (max-width: 560px) {
  .rs { padding: 72px 0; }
  .hb { grid-template-columns: 82px 1fr 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .rs *, .rs *::before, .rs *::after { animation: none !important; transition: none !important; }
  .rs:not(.in) .col, .rs:not(.in) .note { opacity: 1; }
}
</style>
