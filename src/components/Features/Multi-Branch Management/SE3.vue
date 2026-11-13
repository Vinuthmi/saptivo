<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SharedCustomersSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const photoOk = ref(true);
let timer = null;
let io = null;
let reduce = false;

const photo = "/saptivo/images/features/smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";

const branches = [
  { k: "Colombo", tone: "mint", owner: true },
  { k: "Galle", tone: "sky", owner: false },
  { k: "Kandy", tone: "butter", owner: false },
];

const events = [
  { id: 1, b: "Colombo", kind: "Sale", t: "Air purifier X2", amt: 68500, v: "LKR 68,500", when: "12 Mar" },
  { id: 2, b: "Galle", kind: "Service", t: "Filter replacement visit", amt: 0, v: "Service visit", when: "02 Jun" },
  { id: 3, b: "Kandy", kind: "Sale", t: "Accessories bundle", amt: 9800, v: "LKR 9,800", when: "19 Aug" },
  { id: 4, b: "Galle", kind: "Sale", t: "Extended warranty", amt: 12000, v: "LKR 12,000", when: "30 Sep" },
];

const seen = computed(() => events.slice(0, step.value));
const lane = (b) => seen.value.filter((e) => e.b === b);
const total = computed(() => seen.value.reduce((s, e) => s + e.amt, 0));
const sales = computed(() => seen.value.filter((e) => e.kind === "Sale").length);
const active = computed(() => (step.value > 0 ? events[step.value - 1] : null));
const fmt = (n) => "LKR " + n.toLocaleString("en-US");

function tick() {
  if (step.value >= events.length + 2) {
    step.value = 0;
    return;
  }
  step.value += 1;
}
function replay() {
  step.value = 0;
  stop();
  start();
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1500);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    step.value = events.length;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.2 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="sc" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Customers shared,</span> <span class="l2">ownership clear</span></h2>
        <p>
          A customer who buys in Colombo and services in Galle is still one customer. Saptivo keeps one record across
          branches while recording which branch owns the relationship and which branch made each sale.
        </p>
      </header>

      <div class="stage">
        <!-- record card -->
        <div class="rec">
          <div class="who">
            <span class="av">
              <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
              <b v-else>D</b>
            </span>
            <div class="wt">
              <strong>Dilani Perera</strong>
              <small>Customer #1042 · one record</small>
            </div>
          </div>

          <div class="own">
            <span class="ol">Relationship owner</span>
            <span class="ob"><i></i>Colombo branch</span>
          </div>

          <div class="stats">
            <div><b>{{ sales }}</b><span>Sales</span></div>
            <div><b>{{ seen.length }}</b><span>Interactions</span></div>
            <div class="wide"><b>{{ fmt(total) }}</b><span>Lifetime value</span></div>
          </div>

          <button type="button" class="replay" @click="replay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /></svg>
            Replay
          </button>
        </div>

        <!-- connector -->
        <div class="link" aria-hidden="true">
          <span class="stem"></span>
          <span class="pulse" :key="step" :class="{ go: active }"></span>
        </div>

        <!-- lanes -->
        <div class="lanes" role="img" aria-label="Sales and service from Colombo, Galle and Kandy all landing on the same customer record">
          <div v-for="b in branches" :key="b.k" class="ln" :class="'tone-' + b.tone">
            <div class="lh">
              <strong>{{ b.k }}</strong>
              <span v-if="b.owner" class="tag own-t">Owner</span>
              <span v-else class="tag">Branch</span>
            </div>

            <TransitionGroup name="ev" tag="ul" class="evs">
              <li v-for="e in lane(b.k)" :key="e.id" :class="{ now: active && active.id === e.id }">
                <span class="k" :class="e.kind === 'Sale' ? 'sale' : 'svc'">{{ e.kind }}</span>
                <strong>{{ e.t }}</strong>
                <span class="m"><em>{{ e.when }}</em><em>{{ e.v }}</em></span>
                <span class="by">Made at {{ b.k }}</span>
              </li>
            </TransitionGroup>

            <p v-if="lane(b.k).length === 0" class="empty">Nothing yet</p>
          </div>
        </div>

        <p class="note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
          Every branch sees the same customer, and every sale keeps the branch that made it.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sc {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  font-family: "Urbanist", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--lav); color: var(--lav-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.sc h2 .l1 { color: #111111 !important; opacity: 1; }
.sc h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .1s; }

.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }

.stage { display: flex; flex-direction: column; align-items: center; }

/* record */
.rec { width: 100%; max-width: 760px; display: grid; grid-template-columns: 1.2fr 1fr auto; gap: 18px 24px; align-items: center; padding: 20px 24px; border-radius: 26px; background: #faf9ff; border: 1px solid var(--line); box-shadow: 0 24px 60px rgba(60, 50, 120, .12); position: relative; }
.who { display: flex; align-items: center; gap: 14px; min-width: 0; }
.av { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 20px; border: 3px solid #fff; box-sizing: border-box; box-shadow: 0 0 0 1px var(--line); flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.wt { display: flex; flex-direction: column; min-width: 0; }
.wt strong { font-size: 17px; }
.wt small { font-size: 12px; color: var(--muted); }
.own { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.ol { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.ob { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 99px; background: var(--mint); color: var(--mint-i); }
.ob i { width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); box-shadow: 0 0 0 0 rgba(47, 156, 107, .5); animation: beat 2s infinite; }
@keyframes beat { 70% { box-shadow: 0 0 0 8px rgba(47, 156, 107, 0); } 100% { box-shadow: 0 0 0 0 rgba(47, 156, 107, 0); } }
.replay { all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 8px 14px; border-radius: 99px; background: var(--ink); color: #fff; transition: transform .2s; }
.replay:hover { transform: translateY(-1px); }
.replay:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.replay svg { width: 14px; height: 14px; }
.stats { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr 1.6fr; gap: 10px; }
.stats div { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 10px 14px; display: flex; flex-direction: column; }
.stats b { font-size: 18px; font-variant-numeric: tabular-nums; }
.stats span { font-size: 11.5px; color: var(--muted); }

/* connector */
.link { position: relative; height: 44px; width: 2px; }
.stem { position: absolute; inset: 0; background: repeating-linear-gradient(to bottom, #c9c3e6 0 4px, transparent 4px 8px); }
.pulse { position: absolute; left: 50%; top: 100%; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; background: var(--lav-i); opacity: 0; }
.pulse.go { animation: up 1s ease-out forwards; }
@keyframes up { 0% { top: 100%; opacity: 1; } 100% { top: -6px; opacity: 0; } }

/* lanes */
.lanes { width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.ln { border-radius: 24px; padding: 16px; background: var(--tb); border: 1px solid var(--line); min-height: 280px; display: flex; flex-direction: column; gap: 12px; }
.lh { display: flex; align-items: center; justify-content: space-between; }
.lh strong { font-size: 15px; color: var(--ti); }
.tag { font-size: 10.5px; font-weight: 700; padding: 3px 10px; border-radius: 99px; background: #fff; color: var(--muted); border: 1px solid var(--line); }
.tag.own-t { background: var(--ti); color: #fff; border-color: var(--ti); }
.evs { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; position: relative; }
.evs li { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; transition: box-shadow .4s, border-color .4s; }
.evs li.now { border-color: var(--ti); box-shadow: 0 8px 22px rgba(60, 50, 120, .14); }
.evs strong { font-size: 13.5px; }
.k { align-self: flex-start; font-size: 10.5px; font-weight: 700; padding: 2px 9px; border-radius: 99px; }
.k.sale { background: var(--mint); color: var(--mint-i); }
.k.svc { background: var(--lav); color: var(--lav-i); }
.m { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); }
.m em { font-style: normal; }
.by { font-size: 11px; font-weight: 600; color: var(--ti); }
.empty { margin: auto; font-size: 12px; color: #aaa6b8; }

.note { margin: 26px 0 0; display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--muted); text-align: center; }
.note svg { width: 20px; height: 20px; padding: 3px; border-radius: 50%; background: var(--mint); color: var(--mint-i); flex: none; box-sizing: border-box; }

.ev-enter-active { transition: all .5s ease; }
.ev-enter-from { opacity: 0; transform: translateY(-14px) scale(.96); }

@media (max-width: 900px) {
  .lanes { grid-template-columns: 1fr; }
  .ln { min-height: 0; }
  .rec { grid-template-columns: 1fr; }
  .stats { grid-template-columns: 1fr 1fr; }
  .stats .wide { grid-column: 1 / -1; }
  .replay { justify-self: start; }
}
@media (max-width: 640px) {
  .sc { padding: 64px 16px; }
  .note { text-align: left; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  .ob i, .pulse.go { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
