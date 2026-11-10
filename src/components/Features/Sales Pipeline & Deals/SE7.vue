<template>
  <section id="pipeline-quotation" ref="root" class="pq" :class="{ in: seen, live }" aria-labelledby="pq-title">
    <h2 id="pq-title" class="title">
      <span>Pipeline and quotation,</span>
      <span class="soft">side by side</span>
    </h2>
    <p class="lead">Create a branded quotation directly from a deal, track whether the customer has opened it and convert it to an invoice when they accept. <b>The deal moves to Won automatically.</b></p>

    <div class="board">
      <!-- left: pipeline -->
      <article class="panel left">
        <p class="cap">Pipeline</p>
        <div class="lanes">
          <section v-for="l in lanes" :key="l" class="lane" :class="{ won: l === 'Won' }">
            <header><span>{{ l }}</span></header>
            <Transition name="card">
              <div v-if="stage === l" class="deal" :class="{ moved: l === 'Won' }">
                <div class="r1"><b>ABC Solar</b><span>Rs 1.85M</span></div>
                <p>Nimal Perera · close 12 Dec</p>
                <button v-if="phase === 0" type="button" class="btn" @click="go(1)">Create quotation</button>
                <span v-else-if="l === 'Won'" class="auto">Moved automatically</span>
                <span v-else class="qt"><i></i>{{ phase >= 5 ? 'INV-2210' : 'QT-1042' }} attached</span>
              </div>
            </Transition>
          </section>
        </div>

        <p class="cap sp">Deal activity</p>
        <TransitionGroup name="ev" tag="ul" class="events">
          <li v-for="e in events" :key="e.id">
            <span class="dt" :class="e.tone"></span>{{ e.text }}
          </li>
        </TransitionGroup>
      </article>

      <span class="link" aria-hidden="true"><i></i></span>

      <!-- right: quotation -->
      <article class="panel right">
        <header class="bar">
          <p class="cap">{{ phase >= 5 ? 'Invoice' : 'Quotation' }}</p>
          <span class="status" :class="statusTone">{{ statusText }}</span>
        </header>

        <div class="paper" :class="{ blank: phase === 0 }">
          <div v-if="phase === 0" class="empty">No quotation yet. Create one from the deal.</div>
          <template v-else>
            <div class="ph">
              <span class="logo">Your logo</span>
              <span class="no"><b>{{ phase >= 5 ? 'Invoice INV-2210' : 'Quotation QT-1042' }}</b><small>{{ phase >= 5 ? 'Due in 14 days' : 'Valid for 14 days' }}</small></span>
            </div>
            <p class="to">To <b>Nimal Perera</b> · ABC Solar (Pvt) Ltd</p>
            <ul class="items">
              <li><span>5 kW solar system</span><b>Rs 1,450,000</b></li>
              <li><span>Installation</span><b>Rs 250,000</b></li>
              <li><span>1-year maintenance</span><b>Rs 150,000</b></li>
              <li class="tot"><span>Total</span><b>Rs 1,850,000</b></li>
            </ul>
            <Transition name="stamp">
              <span v-if="phase >= 4" class="stamp">Accepted</span>
            </Transition>
          </template>
        </div>

        <ol class="track" aria-label="Quotation progress">
          <li v-for="(t, i) in track" :key="t" :class="{ on: phase >= i + 1 }">
            <span class="tk"></span>{{ t }}
          </li>
        </ol>

        <Transition name="fade">
          <p v-if="phase >= 3" class="seen"><span class="eye"></span>Opened by Nimal · {{ phase >= 4 ? 'viewed 3 times' : '2 minutes ago' }}</p>
        </Transition>
      </article>
    </div>

    <ol class="steps" aria-label="Show a step">
      <li v-for="(s, i) in stepNames" :key="s">
        <button type="button" :class="{ on: phase === i, past: phase > i }" :aria-current="phase === i ? 'step' : undefined" @click="go(i)">
          <span>{{ i + 1 }}</span>{{ s }}
        </button>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "PipelineQuotationSection" });

const lanes = ["Proposal", "Negotiation", "Won"];
const track = ["Draft", "Sent", "Opened", "Accepted", "Invoiced"];
const stepNames = ["Deal", "Create", "Send", "Opened", "Accepted", "Invoice", "Won"];

const log = [
  { text: "Deal ready in Proposal", tone: "n" },
  { text: "Quotation QT-1042 created from this deal", tone: "lav" },
  { text: "Sent to nimal@abcsolar.lk", tone: "sky" },
  { text: "Customer opened the quotation", tone: "butter" },
  { text: "Customer accepted the quotation", tone: "mint" },
  { text: "Invoice INV-2210 created from the quotation", tone: "mint" },
  { text: "Deal moved to Won automatically", tone: "won" },
];

const phase = ref(0);
const manual = ref(false);

const stage = computed(() => (phase.value >= 6 ? "Won" : "Proposal"));
const events = computed(() => log.slice(0, phase.value + 1).map((e, i) => ({ ...e, id: i })).reverse().slice(0, 4));
const statusText = computed(() => ["No quotation", "Draft", "Sent", "Opened", "Accepted", "Invoiced", "Invoiced · deal won"][phase.value]);
const statusTone = computed(() => ["none", "lav", "sky", "butter", "mint", "mint", "mint"][phase.value]);

function go(i) {
  manual.value = true;
  phase.value = i;
}

/* demo loop: 7 steps, then a short hold */
let tick = 0;
function step() {
  if (manual.value) return;
  tick += 1;
  const p = tick % 9;
  phase.value = p <= 6 ? p : 6;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1500);
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
    phase.value = 6;
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

.pq {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  --lav: #e8e3ff; --lav-d: #7d6be6;
  --sky: #dcecfb; --sky-d: #3f87c7;
  --butter: #fff1c9; --butter-d: #a77d00;
  --mint: #d3f0e1; --mint-d: #2f9c6b;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.pq *, .pq *::before, .pq *::after { box-sizing: border-box; }
.pq button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { width: min(680px, calc(100% - 40px)); margin: 26px auto 0; text-align: center; font-size: 16px; line-height: 1.75; color: var(--muted); }
.lead b { color: var(--ink); font-weight: 500; }

.board { width: min(1180px, calc(100% - 40px)); margin: 56px auto 0; display: grid; grid-template-columns: minmax(0, 1fr) 56px minmax(0, 1fr); align-items: stretch; }
.panel { padding: 24px; border-radius: 30px; }
.left { background: #f8f7fb; border: 1px solid #efedf6; }
.right { background: #f4f8fd; border: 1px solid #e3edf8; }
.cap { margin: 0 0 14px; font-size: 11.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.cap.sp { margin-top: 22px; }

.link { position: relative; align-self: center; height: 2px; background: #ddd8ea; }
.link::after { content: ""; position: absolute; right: -1px; top: -4px; border: 5px solid transparent; border-left: 8px solid #b9b2d6; border-right: 0; }
.link i { position: absolute; top: -2px; left: 0; width: 8px; height: 6px; border-radius: 4px; background: var(--lav-d); animation: flow 1.8s linear infinite; }
.pq:not(.live) .link i { animation-play-state: paused; }

/* lanes */
.lanes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.lane { min-height: 168px; padding: 10px; border-radius: 18px; background: #fff; }
.lane.won { background: #f1fbf6; }
.lane header { margin-bottom: 10px; font-size: 12.5px; font-weight: 500; color: var(--muted); }
.deal { position: relative; display: grid; gap: 4px; padding: 11px 12px; border-radius: 14px; background: var(--lav); }
.deal.moved { background: var(--mint); }
.r1 { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; }
.r1 b { font-weight: 500; }
.r1 span { font-weight: 600; font-size: 12px; }
.deal p { margin: 0; font-size: 11px; color: rgba(20, 18, 15, 0.6); }
.btn { justify-self: start; margin-top: 4px; padding: 6px 12px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; cursor: pointer; font: 500 11.5px "Poppins", system-ui, sans-serif; animation: nudge 1.6s ease-in-out infinite; }
.pq:not(.live) .btn { animation: none; }
.qt, .auto { margin-top: 4px; display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; }
.qt i { width: 8px; height: 8px; border-radius: 2px; background: var(--lav-d); }
.auto { color: #1d7a52; }

.card-enter-active { transition: opacity 0.5s ease 0.15s, transform 0.55s cubic-bezier(0.3, 1.3, 0.5, 1) 0.15s; }
.card-leave-active { position: absolute; left: 10px; right: 10px; transition: opacity 0.25s ease, transform 0.3s ease; }
.card-enter-from { opacity: 0; transform: translateX(-16px) scale(0.96); }
.card-leave-to { opacity: 0; transform: translateX(16px); }
.lane { position: relative; }

/* activity */
.events { position: relative; list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; min-height: 160px; align-content: start; }
.events li { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 12px; background: #fff; font-size: 12.5px; }
.dt { flex: none; width: 9px; height: 9px; border-radius: 50%; background: #d9d3ce; }
.dt.lav { background: var(--lav-d); } .dt.sky { background: var(--sky-d); } .dt.butter { background: #e0b200; } .dt.mint, .dt.won { background: var(--mint-d); }
.ev-enter-active { transition: opacity 0.4s, transform 0.4s cubic-bezier(0.3, 1.2, 0.5, 1); }
.ev-leave-active { transition: opacity 0.25s; position: absolute; left: 0; right: 0; }
.ev-enter-from { opacity: 0; transform: translateY(-10px); }
.ev-leave-to { opacity: 0; }
.ev-move { transition: transform 0.4s ease; }

/* quotation */
.bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.bar .cap { margin: 0; }
.status { padding: 3px 12px; border-radius: 99px; font-size: 11.5px; font-weight: 600; transition: background 0.4s, color 0.4s; }
.status.none { background: #eeeae6; color: var(--muted); }
.status.lav { background: var(--lav); color: var(--lav-d); }
.status.sky { background: var(--sky); color: var(--sky-d); }
.status.butter { background: var(--butter); color: var(--butter-d); }
.status.mint { background: var(--mint); color: #1d7a52; }

.paper { position: relative; min-height: 262px; padding: 20px 22px; border-radius: 18px; background: #fff; box-shadow: 0 10px 28px rgba(20, 18, 15, 0.06); overflow: hidden; }
.paper.blank { display: grid; place-items: center; background: transparent; border: 2px dashed #cfe0f1; box-shadow: none; }
.empty { font-size: 13px; color: #8a9db3; text-align: center; }
.paper > * { animation: pop 0.45s ease backwards; }
.ph { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.logo { display: grid; place-items: center; width: 74px; height: 32px; border-radius: 9px; background: var(--lav); color: var(--lav-d); font-size: 11px; font-weight: 600; }
.no { text-align: right; }
.no b { display: block; font-size: 13.5px; font-weight: 500; }
.no small { font-size: 11px; color: var(--muted); }
.to { margin: 14px 0 12px; font-size: 12px; color: var(--muted); }
.to b { color: var(--ink); font-weight: 500; }
.items { list-style: none; margin: 0; padding: 0; }
.items li { display: flex; justify-content: space-between; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3efec; font-size: 12.5px; }
.items li b { font-weight: 500; font-variant-numeric: tabular-nums; }
.items .tot { border-bottom: 0; padding-top: 12px; font-size: 14px; font-weight: 600; }
.items .tot b { font-weight: 600; }
.stamp { position: absolute; right: 18px; bottom: 54px; padding: 4px 16px; border: 2.5px solid var(--mint-d); border-radius: 10px; color: var(--mint-d); font-size: 15px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; transform: rotate(-9deg); background: rgba(255, 255, 255, 0.7); }
.stamp-enter-active { transition: opacity 0.3s, transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1); }
.stamp-enter-from { opacity: 0; transform: rotate(-9deg) scale(1.8); }

.track { list-style: none; margin: 16px 0 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.track li { display: grid; gap: 6px; font-size: 11px; color: #a39d97; transition: color 0.3s; }
.tk { height: 6px; border-radius: 99px; background: #e0e9f3; transition: background 0.5s; }
.track li.on { color: var(--ink); }
.track li.on .tk { background: var(--sky-d); }
.seen { display: flex; align-items: center; gap: 10px; margin: 14px 0 0; padding: 10px 14px; border-radius: 14px; background: var(--butter); font-size: 12.5px; font-weight: 500; }
.eye { width: 14px; height: 9px; border: 2px solid var(--butter-d); border-radius: 60% / 100%; position: relative; }
.eye::after { content: ""; position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%; background: var(--butter-d); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.35s, transform 0.35s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(6px); }

/* step tabs */
.steps { list-style: none; width: min(1180px, calc(100% - 40px)); margin: 26px auto 0; padding: 0; display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; }
.steps button { display: flex; align-items: center; gap: 8px; padding: 6px 14px 6px 6px; border: 1px solid var(--line); border-radius: 99px; background: #fff; cursor: pointer; font: 500 12.5px "Poppins", system-ui, sans-serif; color: var(--muted); transition: background 0.3s, color 0.3s, border-color 0.3s; }
.steps button span { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #f3f0ec; font-size: 11px; font-weight: 600; transition: background 0.3s, color 0.3s; }
.steps button.past span { background: var(--mint); color: #1d7a52; }
.steps button.on { background: var(--ink); border-color: var(--ink); color: #fff; }
.steps button.on span { background: #fff; color: var(--ink); }

@keyframes pop { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes nudge { 0%, 100% { transform: none; } 50% { transform: translateY(-2px); } }
@keyframes flow { from { transform: translateX(0); } to { transform: translateX(48px); } }

/* entrance (runs once) */
.pq:not(.in) .lead, .pq:not(.in) .board, .pq:not(.in) .steps { opacity: 0; }
.pq.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.pq.in .title .soft { animation-delay: 0.1s; }
.pq.in .lead { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.pq.in .board { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
.pq.in .steps { animation: rise 0.8s ease 0.5s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 960px) {
  .board { grid-template-columns: 1fr; gap: 16px; }
  .link { width: 2px; height: 32px; justify-self: center; }
  .link::after { right: auto; left: -4px; top: auto; bottom: -1px; border: 5px solid transparent; border-top: 8px solid #b9b2d6; border-bottom: 0; }
  .link i { display: none; }
}
@media (max-width: 560px) {
  .pq { padding: 72px 0; }
  .panel { padding: 16px; border-radius: 24px; }
  .lanes { grid-template-columns: 1fr; }
  .lane { min-height: 0; }
  .track { font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .pq *, .pq *::before, .pq *::after { animation: none !important; transition: none !important; }
  .pq:not(.in) .lead, .pq:not(.in) .board, .pq:not(.in) .steps { opacity: 1; }
}
</style>
