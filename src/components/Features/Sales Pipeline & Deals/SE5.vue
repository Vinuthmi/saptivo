<template>
  <section id="deal-tracking" ref="root" class="dt" :class="{ in: seen, live }" aria-labelledby="dt-title">
    <h2 id="dt-title" class="title">
      <span>Deal tracking CRM</span>
      <span class="soft">with won and lost reasons</span>
    </h2>
    <div class="intro">
      <p>When a deal closes, Saptivo asks why. Over time, won and lost reasons show which products, prices and competitors matter most, and where your process needs work.</p>
      <p class="dark">As a deal tracking CRM, Saptivo keeps the history of every stage change for coaching and review.</p>
    </div>

    <div class="grid">
      <!-- the question -->
      <article class="card ask">
        <p class="cap">When a deal closes</p>
        <div class="dealrow">
          <span class="dn"><b>{{ deal.name }}</b><small>{{ deal.value }} · {{ deal.owner }}</small></span>
          <span class="state" :class="outcome || 'open'">{{ outcome === 'won' ? 'Won' : outcome === 'lost' ? 'Lost' : 'Open' }}</span>
        </div>

        <h3>Why was this deal {{ outcome === 'lost' ? 'lost' : outcome === 'won' ? 'won' : 'closed' }}?</h3>

        <div class="seg" role="group" aria-label="Outcome">
          <button type="button" class="won" :class="{ on: outcome === 'won' }" :aria-pressed="outcome === 'won'" @click="chooseOutcome('won')">Won</button>
          <button type="button" class="lost" :class="{ on: outcome === 'lost' }" :aria-pressed="outcome === 'lost'" @click="chooseOutcome('lost')">Lost</button>
        </div>

        <div class="chips" :class="{ idle: !outcome }">
          <p v-if="!outcome" class="hint">Pick an outcome to see the reasons</p>
          <button v-for="(r, i) in activeReasons" :key="outcome + r.name" type="button" class="chip" :class="[outcome, { on: picked === i }]" :aria-pressed="picked === i" @click="chooseReason(i)">{{ r.name }}</button>
        </div>

        <div class="foot">
          <button type="button" class="save" :disabled="!outcome || picked < 0" @click="save(true)">Save reason</button>
          <Transition name="fade">
            <span v-if="saved" class="ok">✓ Reason saved to the deal</span>
          </Transition>
        </div>
      </article>

      <!-- what it adds up to -->
      <article class="card sum">
        <p class="cap">Over time</p>
        <div class="two">
          <div>
            <h3><i class="d won"></i>Why deals are won</h3>
            <TransitionGroup name="rk" tag="ul" class="rank">
              <li v-for="r in wonSorted" :key="r.name" :class="{ hit: r.name === lastHit }">
                <span class="rn">{{ r.name }}<em :class="r.cat">{{ r.cat }}</em></span>
                <span class="trk"><i class="won" :style="{ width: (r.n / maxN) * 100 + '%' }"></i></span>
                <b>{{ r.n }}</b>
              </li>
            </TransitionGroup>
          </div>
          <div>
            <h3><i class="d lost"></i>Why deals are lost</h3>
            <TransitionGroup name="rk" tag="ul" class="rank">
              <li v-for="r in lostSorted" :key="r.name" :class="{ hit: r.name === lastHit }">
                <span class="rn">{{ r.name }}<em :class="r.cat">{{ r.cat }}</em></span>
                <span class="trk"><i class="lost" :style="{ width: (r.n / maxN) * 100 + '%' }"></i></span>
                <b>{{ r.n }}</b>
              </li>
            </TransitionGroup>
          </div>
        </div>
        <p class="insight"><span class="bulb">✦</span>Biggest loss: <b>{{ lostSorted[0].name }}</b> ({{ lostSorted[0].cat }}). Biggest win: <b>{{ wonSorted[0].name }}</b> ({{ wonSorted[0].cat }}).</p>
      </article>

      <!-- history -->
      <article class="card hist">
        <header>
          <p class="cap">Stage history · {{ deal.name }}</p>
          <span class="coach">For coaching and review · longest stage <b>{{ longest.name }}</b>, {{ longest.days }} days</span>
        </header>
        <ol class="tl">
          <li v-for="(s, i) in history" :key="deal.name + s.name" :class="{ last: i === history.length - 1, [s.kind || '']: true }" :style="{ '--i': i }">
            <span class="node"></span>
            <b>{{ s.name }}</b>
            <small>{{ s.date }}</small>
            <span v-if="s.days" class="days">{{ s.days }} days</span>
          </li>
        </ol>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "DealTrackingSection" });

/* pastel set: won = mint, lost = rose, categories lavender / butter / sky / grey */
const wonR = ref([
  { name: "Product fit", cat: "Product", n: 14 },
  { name: "Competitive price", cat: "Price", n: 11 },
  { name: "Fast response", cat: "Process", n: 9 },
  { name: "Good relationship", cat: "Process", n: 7 },
  { name: "Local support", cat: "Process", n: 5 },
]);
const lostR = ref([
  { name: "Price too high", cat: "Price", n: 12 },
  { name: "Chose a competitor", cat: "Competitor", n: 9 },
  { name: "Feature missing", cat: "Product", n: 8 },
  { name: "No response", cat: "Process", n: 6 },
  { name: "Bad timing", cat: "Process", n: 4 },
]);

const wonSorted = computed(() => [...wonR.value].sort((a, b) => b.n - a.n));
const lostSorted = computed(() => [...lostR.value].sort((a, b) => b.n - a.n));
const maxN = computed(() => Math.max(...wonR.value.map((r) => r.n), ...lostR.value.map((r) => r.n)));

const deals = [
  { name: "Kandy Textiles", value: "Rs 2.4M", owner: "Chathura", out: "lost", why: 0,
    h: [["New", "3 Oct", 0], ["Qualified", "9 Oct", 6], ["Proposal", "18 Oct", 9], ["Negotiation", "29 Oct", 11]], end: "4 Nov" },
  { name: "ABC Solar", value: "Rs 1.85M", owner: "Ishara", out: "won", why: 0,
    h: [["New", "12 Oct", 0], ["Qualified", "14 Oct", 2], ["Proposal", "19 Oct", 5], ["Negotiation", "26 Oct", 7]], end: "2 Nov" },
  { name: "Galle Hardware", value: "Rs 380K", owner: "Nadeesha", out: "lost", why: 1,
    h: [["New", "6 Oct", 0], ["Qualified", "15 Oct", 9], ["Proposal", "27 Oct", 12], ["Negotiation", "1 Nov", 5]], end: "5 Nov" },
  { name: "Lanka Power", value: "Rs 920K", owner: "Sanjeewa", out: "won", why: 2,
    h: [["New", "8 Oct", 0], ["Qualified", "10 Oct", 2], ["Proposal", "13 Oct", 3], ["Negotiation", "20 Oct", 7]], end: "28 Oct" },
];

const di = ref(0);
const deal = computed(() => deals[di.value]);
const outcome = ref(null); // null | 'won' | 'lost'
const picked = ref(-1);
const saved = ref(false);
const lastHit = ref("");
const manual = ref(false);

const activeReasons = computed(() => (outcome.value === "won" ? wonR.value : outcome.value === "lost" ? lostR.value : []));

const history = computed(() => {
  const d = deal.value;
  const steps = d.h.map(([name, date, days]) => ({ name, date, days }));
  const end = outcome.value === "won" ? { name: "Won", kind: "won" } : outcome.value === "lost" ? { name: "Lost", kind: "lost" } : { name: "Closing", kind: "open" };
  steps.push({ ...end, date: outcome.value ? d.end : "—", days: 0 });
  return steps;
});
const longest = computed(() => history.value.reduce((m, s) => (s.days > m.days ? s : m), { name: "", days: 0 }));

function chooseOutcome(o) {
  manual.value = true;
  outcome.value = o;
  picked.value = -1;
  saved.value = false;
}
function chooseReason(i) {
  manual.value = true;
  picked.value = i;
  saved.value = false;
}
let hitTimer = null;
function save() {
  if (!outcome.value || picked.value < 0) return;
  const list = outcome.value === "won" ? wonR : lostR;
  const r = list.value[picked.value];
  r.n += 1;
  lastHit.value = r.name;
  saved.value = true;
  if (hitTimer !== null) window.clearTimeout(hitTimer);
  hitTimer = window.setTimeout(() => { lastHit.value = ""; hitTimer = null; }, 1500);
}

/* demo script: a new deal every 8 ticks */
let tick = 0;
function step() {
  if (manual.value) return;
  const p = tick % 8;
  tick += 1;
  if (p === 0) {
    di.value = Math.floor(tick / 8) % deals.length;
    outcome.value = null;
    picked.value = -1;
    saved.value = false;
  }
  if (p === 1) outcome.value = deal.value.out;
  if (p === 3) picked.value = deal.value.why;
  if (p === 5) save();
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1000);
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
    outcome.value = deal.value.out;
    picked.value = deal.value.why;
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
  if (hitTimer !== null) window.clearTimeout(hitTimer);
  halt();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.dt {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  --mint: #d3f0e1; --mint-d: #35a572;
  --rose: #fde3ea; --rose-d: #d8567f;
  --lav: #e8e3ff; --lav-d: #7d6be6;
  --butter: #fff1c9; --butter-d: #a77d00;
  --sky: #dcecfb; --sky-d: #3f87c7;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.dt *, .dt *::before, .dt *::after { box-sizing: border-box; }
.dt button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.intro { width: min(680px, calc(100% - 40px)); margin: 26px auto 0; text-align: center; }
.intro p { margin: 0 0 10px; font-size: 16px; line-height: 1.75; color: var(--muted); }
.intro .dark { color: var(--ink); font-weight: 500; }

.grid { width: min(1180px, calc(100% - 40px)); margin: 52px auto 0; display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 20px; }
.card { padding: 26px; border-radius: 28px; background: #f8f7fb; border: 1px solid #efedf6; }
.sum { background: #f4f8fd; border-color: #e3edf8; }
.hist { grid-column: 1 / -1; background: #fdf7ee; border-color: #f6ead6; }
.cap { margin: 0 0 14px; font-size: 11.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.card h3 { margin: 0; font-size: 17px; font-weight: 500; letter-spacing: -0.01em; }

/* question card */
.dealrow { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; border-radius: 16px; background: #fff; }
.dn b { display: block; font-size: 14.5px; font-weight: 500; }
.dn small { font-size: 12px; color: var(--muted); }
.state { padding: 3px 12px; border-radius: 99px; font-size: 11.5px; font-weight: 600; transition: background 0.3s, color 0.3s; }
.state.open { background: var(--butter); color: var(--butter-d); }
.state.won { background: var(--mint); color: #1d7a52; }
.state.lost { background: var(--rose); color: var(--rose-d); }
.ask h3 { margin: 20px 0 14px; }
.seg { display: inline-flex; padding: 3px; border-radius: 12px; background: #fff; border: 1px solid var(--line); }
.seg button { padding: 8px 22px; border: 0; border-radius: 9px; background: none; cursor: pointer; font: 500 13px "Poppins", system-ui, sans-serif; color: #8a857f; transition: background 0.25s, color 0.25s; }
.seg .won.on { background: var(--mint); color: #1d7a52; }
.seg .lost.on { background: var(--rose); color: var(--rose-d); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; min-height: 96px; margin-top: 16px; align-content: flex-start; }
.hint { margin: 6px 0; font-size: 13px; color: #a39d97; }
.chip { padding: 8px 14px; border: 1px solid var(--line); border-radius: 99px; background: #fff; cursor: pointer; font: 500 12.5px "Poppins", system-ui, sans-serif; color: var(--ink); transition: background 0.25s, border-color 0.25s; animation: pop 0.4s cubic-bezier(0.3, 1.3, 0.5, 1) backwards; }
.chip:hover { border-color: #cfc8c1; }
.chip.won.on { background: var(--mint); border-color: var(--mint-d); }
.chip.lost.on { background: var(--rose); border-color: var(--rose-d); }
.foot { display: flex; align-items: center; gap: 14px; margin-top: 12px; flex-wrap: wrap; }
.save { padding: 10px 20px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; cursor: pointer; font: 500 13px "Poppins", system-ui, sans-serif; transition: opacity 0.25s; }
.save:disabled { opacity: 0.3; cursor: default; }
.ok { font-size: 12.5px; font-weight: 500; color: #1d7a52; }

/* ranked lists */
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; }
.sum h3 { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; font-size: 15px; }
.d { width: 10px; height: 10px; border-radius: 50%; }
.d.won { background: var(--mint-d); } .d.lost { background: var(--rose-d); }
.rank { position: relative; list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.rank li { display: grid; grid-template-columns: 1fr 26px; grid-template-areas: "rn n" "trk trk"; gap: 5px 8px; align-items: center; padding: 8px 10px; margin: -8px -10px; border-radius: 12px; transition: background 0.4s; }
.rank li.hit { background: #fff; }
.rn { grid-area: rn; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12.5px; }
.rn em { padding: 0 8px; border-radius: 99px; font-size: 10px; font-style: normal; font-weight: 600; }
.rn em.Product { background: var(--lav); color: var(--lav-d); }
.rn em.Price { background: var(--butter); color: var(--butter-d); }
.rn em.Competitor { background: var(--sky); color: var(--sky-d); }
.rn em.Process { background: #eeeae6; color: var(--muted); }
.rank b { grid-area: n; text-align: right; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }
.trk { grid-area: trk; height: 9px; border-radius: 99px; background: #fff; overflow: hidden; }
.trk i { display: block; height: 100%; border-radius: 99px; transition: width 0.7s cubic-bezier(0.3, 0.7, 0.2, 1); }
.trk i.won { background: #8fd6b4; } .trk i.lost { background: #f2a6bc; }
.insight { display: flex; gap: 10px; align-items: flex-start; margin: 22px 0 0; padding: 12px 14px; border-radius: 14px; background: #fff; font-size: 12.5px; line-height: 1.55; color: var(--muted); }
.insight b { color: var(--ink); font-weight: 500; }
.bulb { color: var(--lav-d); }

.rk-move { transition: transform 0.55s cubic-bezier(0.3, 0.8, 0.3, 1); }

/* history */
.hist header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.hist .cap { margin: 0; }
.coach { font-size: 12.5px; color: var(--muted); }
.coach b { color: var(--ink); font-weight: 500; }
.tl { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); }
.tl li { position: relative; display: grid; gap: 2px; justify-items: start; padding-top: 28px; }
.tl li::before { content: ""; position: absolute; top: 8px; left: 0; right: 0; height: 2px; background: #eadfc9; }
.tl li:last-child::before { right: 50%; }
.node { position: absolute; top: 0; left: 0; width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 3px solid #e0b96b; }
.tl li b { font-size: 14px; font-weight: 500; }
.tl li small { font-size: 12px; color: var(--muted); }
.days { margin-top: 4px; padding: 2px 10px; border-radius: 99px; background: #fff; font-size: 11px; color: var(--muted); }
.tl li.won .node { background: var(--mint-d); border-color: var(--mint-d); }
.tl li.lost .node { background: var(--rose-d); border-color: var(--rose-d); }
.tl li.won b { color: #1d7a52; } .tl li.lost b { color: var(--rose-d); }
.tl li { animation: pop 0.5s cubic-bezier(0.3, 1.3, 0.5, 1) calc(var(--i) * 0.07s) backwards; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes pop { from { opacity: 0; transform: translateY(8px) scale(0.97); } to { opacity: 1; transform: none; } }

/* entrance (runs once) */
.dt:not(.in) .intro, .dt:not(.in) .grid { opacity: 0; }
.dt.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.dt.in .title .soft { animation-delay: 0.1s; }
.dt.in .intro { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.dt.in .grid { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr; }
  .tl { grid-template-columns: 1fr; gap: 0; }
  .tl li { padding: 0 0 22px 32px; }
  .tl li::before { top: 18px; bottom: 0; left: 8px; right: auto; width: 2px; height: auto; }
  .tl li:last-child::before { display: none; }
}
@media (max-width: 640px) {
  .dt { padding: 72px 0; }
  .card { padding: 18px; border-radius: 22px; }
  .two { grid-template-columns: 1fr; gap: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .dt *, .dt *::before, .dt *::after { animation: none !important; transition: none !important; }
  .dt:not(.in) .intro, .dt:not(.in) .grid { opacity: 1; }
}
</style>
