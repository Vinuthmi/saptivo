<template>
  <section id="common-problems" ref="root" class="cp" :class="{ in: seen, live }" aria-labelledby="cp-title">
    <h2 id="cp-title" class="title">
      <span>Common problems</span>
      <span class="soft">Saptivo's pipeline solves</span>
    </h2>

    <div class="seg" role="group" aria-label="Show the pipeline without or with Saptivo">
      <button type="button" class="b" :class="{ on: !on }" :aria-pressed="!on" @click="set(false)">Without Saptivo</button>
      <button type="button" class="a" :class="{ on }" :aria-pressed="on" @click="set(true)">With Saptivo</button>
    </div>

    <ol class="list">
      <li v-for="(p, i) in problems" :key="p.id" class="row" :class="{ fixed: on }" :style="{ '--i': i }">
        <span class="n">{{ i + 1 }}</span>
        <p class="txt">{{ p.text }}</p>

        <div class="vis">
          <Transition name="flip" mode="out-in">
            <!-- before -->
            <div v-if="!on" :key="p.id + 'b'" class="pane bad">
              <template v-if="p.id === 'follow'">
                <span class="tag">In someone's head</span>
                <span class="q">Call Nimal back… when?</span>
                <span class="qq">? ? ?</span>
              </template>
              <template v-else-if="p.id === 'update'">
                <span class="bub l">Any update on ABC Solar?</span>
                <span class="bub r">Let me check…</span>
                <span class="bub l">And Lanka Power?</span>
              </template>
              <template v-else-if="p.id === 'forecast'">
                <span class="tag">Month-end guess</span>
                <span class="guess">Rs ?? M</span>
                <span class="wob"><i></i><i></i><i></i><i></i></span>
              </template>
              <template v-else>
                <span class="tag">Closed</span>
                <span class="q">Lost. Why? Nobody wrote it down.</span>
                <span class="rep">Same mistake, again</span>
              </template>
            </div>

            <!-- after -->
            <div v-else :key="p.id + 'a'" class="pane good">
              <template v-if="p.id === 'follow'">
                <span class="task"><span class="ck">✓</span><span><b>Call Nimal Perera</b><small>ABC Solar · today 3:00 PM</small></span></span>
                <span class="task"><span class="ck o"></span><span><b>Send revised quotation</b><small>Lanka Power · tomorrow</small></span></span>
              </template>
              <template v-else-if="p.id === 'update'">
                <span class="dash"><small>Open pipeline</small><b>Rs 12.4M</b></span>
                <span class="dash"><small>Stuck over 14 days</small><b>3 deals</b></span>
                <span class="dash"><small>Updated</small><b>Live</b></span>
              </template>
              <template v-else-if="p.id === 'forecast'">
                <span class="tag">Weighted forecast</span>
                <span class="guess ok">Rs 18.4M</span>
                <span class="sol"><i></i><i></i><i></i><i></i></span>
              </template>
              <template v-else>
                <span class="tag">Lost · recorded</span>
                <span class="q">Price too high</span>
                <span class="rep ok">Top loss reason this quarter: 12 deals</span>
              </template>
            </div>
          </Transition>
        </div>
      </li>
    </ol>

    <div class="photo-pair">
      <figure v-for="photo in photos" :key="photo.title" class="photo-card">
        <img :src="photo.src" :alt="photo.alt" loading="lazy" decoding="async" />
        <figcaption>
          <strong>{{ photo.title }}</strong>
          <span>{{ photo.caption }}</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "CommonProblemsSection" });

const photos = [
  {
    src: `${import.meta.env.BASE_URL}images/features/employees.jpg`,
    alt: "Sales colleagues reviewing a dashboard together",
    title: "One shared pipeline",
    caption: "Keep every deal and follow-up visible to the team.",
  },
  {
    src: `${import.meta.env.BASE_URL}images/features/threecolleagues-.jpg`,
    alt: "Colleagues collaborating around a laptop",
    title: "A team that follows through",
    caption: "Turn clear next steps into consistent progress.",
  },
];

const problems = [
  { id: "follow", text: "Deals forgotten because follow-ups lived in someone's head" },
  { id: "update", text: "Managers asking for updates instead of seeing them" },
  { id: "forecast", text: "Forecasts built on guesswork at the end of the month" },
  { id: "lost", text: "No record of why deals were lost, so the same mistakes repeat" },
];

const on = ref(false);
const manual = ref(false);
function set(v) {
  manual.value = true; // the visitor chose; stop flipping
  on.value = v;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function step() {
  if (manual.value) return;
  on.value = !on.value;
}
function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 3200);
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
    on.value = true; // show the solved state, no flipping
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
  halt();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.cp {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  --rose: #fde3ea; --rose-d: #d8567f;
  --mint: #d3f0e1; --mint-d: #2f9c6b;
  --lav: #e8e3ff; --lav-d: #7d6be6;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.cp *, .cp *::before, .cp *::after { box-sizing: border-box; }
.cp button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }

.seg { display: flex; width: fit-content; margin: 34px auto 0; padding: 4px; border-radius: 14px; background: #f6f3f0; }
.seg button { padding: 10px 22px; border: 0; border-radius: 11px; background: none; cursor: pointer; font: 500 14px "Poppins", system-ui, sans-serif; color: #8a857f; transition: background 0.3s, color 0.3s; }
.seg .b.on { background: var(--rose); color: var(--rose-d); }
.seg .a.on { background: var(--mint); color: #1d7a52; }

.list { list-style: none; width: min(1080px, calc(100% - 40px)); margin: 36px auto 0; padding: 0; display: grid; gap: 14px; }
.row { display: grid; grid-template-columns: 40px minmax(0, 1fr) minmax(0, 1.15fr); align-items: center; gap: 22px; padding: 18px 20px 18px 22px; border-radius: 26px; background: #faf8f6; border: 1px solid transparent; transition: background 0.5s; }
.row.fixed { background: #f4fbf7; }
.n { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: var(--lav); color: var(--lav-d); font-size: 14px; font-weight: 600; }
.txt { margin: 0; font-size: 18px; font-weight: 500; line-height: 1.5; letter-spacing: -0.01em; }

.photo-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; width: min(1080px, calc(100% - 40px)); margin: 22px auto 0; }
.photo-card { position: relative; min-height: 220px; margin: 0; overflow: hidden; border-radius: 26px; background: #27231f; isolation: isolate; }
.photo-card::after { position: absolute; z-index: -1; inset: 30% 0 0; background: linear-gradient(transparent, rgba(20, 18, 15, 0.78)); content: ""; }
.photo-card img { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.photo-card:hover img { transform: scale(1.04); }
.photo-card figcaption { position: absolute; right: 22px; bottom: 20px; left: 22px; display: grid; gap: 4px; color: #fff; }
.photo-card strong { font-size: 18px; font-weight: 500; }
.photo-card figcaption span { font-size: 13px; line-height: 1.5; color: rgba(255, 255, 255, 0.84); }

.vis { min-height: 112px; display: grid; }
.pane { display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 16px 18px; border-radius: 20px; min-height: 112px; }
.pane.bad { background: var(--rose); }
.pane.good { background: #fff; border: 1px solid #d9efe3; }
.tag { align-self: flex-start; padding: 2px 10px; border-radius: 99px; background: rgba(255, 255, 255, 0.75); font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--rose-d); }
.good .tag { background: var(--mint); color: #1d7a52; }
.q { font-size: 14px; font-weight: 500; }
.qq { font-size: 22px; font-weight: 600; letter-spacing: 0.2em; color: var(--rose-d); animation: blink 1.6s ease-in-out infinite; }
.cp:not(.live) .qq { animation-play-state: paused; }

.bub { max-width: 78%; padding: 7px 12px; border-radius: 14px; background: #fff; font-size: 12.5px; }
.bub.r { align-self: flex-end; background: rgba(255, 255, 255, 0.55); color: var(--muted); }

.guess { font-size: 28px; font-weight: 600; letter-spacing: -0.02em; color: var(--rose-d); }
.guess.ok { color: var(--ink); }
.wob, .sol { display: flex; align-items: flex-end; gap: 6px; height: 26px; }
.wob i { flex: 1; border: 1.5px dashed var(--rose-d); border-radius: 5px 5px 0 0; opacity: 0.7; }
.wob i:nth-child(1) { height: 60%; } .wob i:nth-child(2) { height: 90%; } .wob i:nth-child(3) { height: 40%; } .wob i:nth-child(4) { height: 75%; }
.sol i { flex: 1; border-radius: 5px 5px 0 0; background: #8fd6b4; transform-origin: bottom; animation: rise-bar 0.7s cubic-bezier(0.3, 0.7, 0.2, 1) backwards; }
.sol i:nth-child(1) { height: 45%; animation-delay: 0.05s; } .sol i:nth-child(2) { height: 60%; animation-delay: 0.12s; } .sol i:nth-child(3) { height: 78%; animation-delay: 0.19s; } .sol i:nth-child(4) { height: 100%; animation-delay: 0.26s; background: #2f9c6b; }
.rep { font-size: 12px; color: var(--rose-d); font-weight: 500; }
.rep.ok { color: #1d7a52; }

.task { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 12px; background: #f4fbf7; }
.task b { display: block; font-size: 13px; font-weight: 500; }
.task small { display: block; font-size: 11.5px; color: var(--muted); }
.ck { flex: none; display: grid; place-items: center; width: 20px; height: 20px; border-radius: 6px; background: var(--mint-d); color: #fff; font-size: 11px; }
.ck.o { background: #fff; border: 2px solid #b9dccb; }
.dash { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding: 7px 12px; border-radius: 12px; background: #f4fbf7; }
.dash small { font-size: 11.5px; color: var(--muted); }
.dash b { font-size: 14px; font-weight: 600; }

.flip-enter-active { transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.3, 1.2, 0.5, 1); }
.flip-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.flip-enter-from { opacity: 0; transform: translateY(10px) scale(0.98); }
.flip-leave-to { opacity: 0; transform: translateY(-8px) scale(0.98); }

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@keyframes rise-bar { from { transform: scaleY(0); } to { transform: none; } }

/* entrance (runs once) */
.cp:not(.in) .seg, .cp:not(.in) .row { opacity: 0; }
.cp.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.cp.in .title .soft { animation-delay: 0.1s; }
.cp.in .seg { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.cp.in .row { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) calc(var(--i) * 0.1s + 0.25s) backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 860px) {
  .row { grid-template-columns: 36px minmax(0, 1fr); }
  .vis { grid-column: 1 / -1; }
  .txt { font-size: 16.5px; }
}
@media (max-width: 560px) {
  .cp { padding: 72px 0; }
  .row { padding: 16px; border-radius: 22px; gap: 14px; }
  .seg button { padding: 9px 14px; font-size: 13px; }
  .photo-pair { grid-template-columns: 1fr; }
  .photo-card { min-height: 200px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .cp *, .cp *::before, .cp *::after { animation: none !important; transition: none !important; }
  .cp:not(.in) .seg, .cp:not(.in) .row { opacity: 1; }
}
</style>