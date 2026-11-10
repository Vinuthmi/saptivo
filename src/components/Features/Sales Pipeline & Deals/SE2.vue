<template>
  <section id="multiple-pipelines" ref="root" class="mp" :class="{ in: seen, live }" aria-labelledby="mp-title">
    <h2 id="mp-title" class="title">
      <span>Multiple pipelines for</span>
      <span class="soft">different sales processes</span>
    </h2>
    <p class="lead">New business, renewals and upsells rarely follow the same steps. Create as many pipelines as you need, each with its own stages, probabilities and automation rules.</p>

    <div class="wrap">
      <TransitionGroup name="pl" tag="div" class="list">
        <article v-for="(p, pi) in shown" :key="p.id" class="pipe" :class="[p.tone, { act: pi === active }]">
          <header>
            <span class="pn"><i class="sw"></i><b>{{ p.name }}</b></span>
            <span class="meta">{{ p.stages.length }} stages · own probabilities · own rules</span>
          </header>

          <ol class="chev">
            <li v-for="(s, si) in p.stages" :key="s.name" class="st" :class="{ got: si <= pos[p.id], here: pi === active && si === pos[p.id] }">
              <b>{{ s.name }}</b>
              <small>{{ s.pct }}%</small>
            </li>
          </ol>

          <p class="rule" aria-live="polite">
            <span class="bolt" aria-hidden="true">⚡</span>
            <Transition name="swap" mode="out-in">
              <span :key="p.id + ':' + pos[p.id]" class="rt">
                <template v-if="pos[p.id] >= 0"><em>When a deal reaches {{ p.stages[pos[p.id]].name }}</em> {{ p.stages[pos[p.id]].rule }}</template>
                <template v-else><em>Automation rules</em> run when a deal enters each stage</template>
              </span>
            </Transition>
          </p>
        </article>
      </TransitionGroup>

      <div class="foot">
        <button type="button" class="add" :class="{ on: extra }" @click="toggleExtra">
          <span class="plus" aria-hidden="true"></span>
          {{ extra ? 'Remove "Partner referrals"' : 'Add a pipeline' }}
        </button>
        <p>Each pipeline is independent, so a change in one never touches the others.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "MultiPipelineSection" });

const base = [
  {
    id: "nb", name: "New business", tone: "t-lav",
    stages: [
      { name: "Lead", pct: 10, rule: "assign by territory or round-robin" },
      { name: "Qualified", pct: 25, rule: "create a discovery call task" },
      { name: "Proposal", pct: 50, rule: "send the quotation template" },
      { name: "Negotiation", pct: 75, rule: "alert the sales manager on deals over Rs 1M" },
      { name: "Won", pct: 100, rule: "create the invoice and welcome email" },
    ],
  },
  {
    id: "rn", name: "Renewals", tone: "t-mint",
    stages: [
      { name: "Due soon", pct: 60, rule: "create a task 60 days before expiry" },
      { name: "Contacted", pct: 70, rule: "send the renewal reminder email" },
      { name: "Quote sent", pct: 85, rule: "generate the renewal quotation" },
      { name: "Renewed", pct: 100, rule: "extend the service contract by 12 months" },
    ],
  },
  {
    id: "up", name: "Upsells", tone: "t-sky",
    stages: [
      { name: "Idea", pct: 15, rule: "flag from usage or support tickets" },
      { name: "Offer", pct: 40, rule: "send the offer on WhatsApp" },
      { name: "Approved", pct: 80, rule: "notify the account owner" },
      { name: "Delivered", pct: 100, rule: "add the items to the existing contract" },
    ],
  },
];
const custom = {
  id: "pr", name: "Partner referrals", tone: "t-rose",
  stages: [
    { name: "Referred", pct: 20, rule: "thank the partner automatically" },
    { name: "Contacted", pct: 40, rule: "create a follow-up call task" },
    { name: "Quoted", pct: 65, rule: "share the partner price list" },
    { name: "Won", pct: 100, rule: "log the referral commission" },
  ],
};

const extra = ref(false);
const manual = ref(false);
const shown = computed(() => (extra.value ? [...base, custom] : base));
const pos = ref({ nb: -1, rn: -1, up: -1, pr: -1 });
const active = ref(0);

function toggleExtra() {
  manual.value = true;
  extra.value = !extra.value;
}

// walk a deal through the active pipeline, then move to the next one
function step() {
  const list = shown.value;
  if (active.value >= list.length) active.value = 0;
  const p = list[active.value];
  const next = pos.value[p.id] + 1;
  if (next < p.stages.length) {
    pos.value = { ...pos.value, [p.id]: next };
    return;
  }
  // this pipeline is complete: hand over to the next
  if (active.value + 1 < list.length) {
    active.value += 1;
    pos.value = { ...pos.value, [list[active.value].id]: -1 };
  } else {
    // the loop is done: reset, and (while the visitor hasn't taken over) show adding / removing a pipeline
    if (!manual.value) extra.value = !extra.value;
    pos.value = { nb: -1, rn: -1, up: -1, pr: -1 };
    active.value = 0;
  }
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1300);
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
    pos.value = { nb: 2, rn: 2, up: 1, pr: -1 };
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
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.mp {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.mp *, .mp *::before, .mp *::after { box-sizing: border-box; }
.mp button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

/* pastel tones: bg = card, mid = idle stage, deep = reached stage */
.t-lav  { --bg: #f1eeff; --mid: #e2dcff; --deep: #b9acff; --dot: #8a78f0; }
.t-mint { --bg: #eaf8f0; --mid: #d3f0e1; --deep: #9edcbc; --dot: #3fae7c; }
.t-sky  { --bg: #eaf4fd; --mid: #d4e8fa; --deep: #9fcbf0; --dot: #4a95d6; }
.t-rose { --bg: #fff0f4; --mid: #fddde7; --deep: #f5b3c8; --dot: #e0668c; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em;
}
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { width: min(640px, calc(100% - 40px)); margin: 26px auto 0; text-align: center; font-size: 16px; line-height: 1.75; color: var(--muted); }

.wrap { width: min(1100px, calc(100% - 40px)); margin: 56px auto 0; }
.list { position: relative; display: grid; gap: 16px; }

.pipe { padding: 22px 24px 20px; border-radius: 28px; background: var(--bg); border: 1px solid transparent; transition: border-color 0.4s, box-shadow 0.4s; }
.pipe.act { border-color: var(--deep); box-shadow: 0 14px 34px rgba(20, 18, 15, 0.06); }
.pipe header { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.pn { display: flex; align-items: center; gap: 12px; font-size: 18px; }
.pn b { font-weight: 500; letter-spacing: -0.01em; }
.sw { width: 12px; height: 12px; border-radius: 50%; background: var(--dot); }
.meta { font-size: 12.5px; color: var(--muted); }

/* chevron stages */
.chev { list-style: none; margin: 0; padding: 0; display: flex; }
.st {
  position: relative; flex: 1 1 0; min-width: 0; display: grid; gap: 1px; align-content: center; height: 62px; padding: 0 22px 0 30px; margin-left: -10px;
  background: var(--mid); color: var(--ink);
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%);
  transition: background 0.5s ease;
}
.st:first-child { margin-left: 0; padding-left: 20px; clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%); border-radius: 14px 0 0 14px; }
.st:last-child { padding-right: 18px; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 16px 50%); border-radius: 0 14px 14px 0; }
.st:first-child:last-child { clip-path: none; border-radius: 14px; }
.st b { font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st small { font-size: 11.5px; font-weight: 500; color: rgba(20, 18, 15, 0.55); font-variant-numeric: tabular-nums; }
.st.got { background: var(--deep); }
.st.here { background: var(--dot); color: #fff; }
.st.here small { color: rgba(255, 255, 255, 0.85); }

/* automation line */
.rule { display: flex; align-items: center; gap: 10px; margin: 16px 0 0; padding: 12px 16px; border-radius: 16px; background: rgba(255, 255, 255, 0.75); font-size: 13.5px; line-height: 1.5; min-height: 48px; }
.bolt { flex: none; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: var(--mid); font-size: 13px; }
.rt em { font-style: normal; font-weight: 500; margin-right: 4px; }
.rt { color: var(--muted); }
.rt em { color: var(--ink); }

.swap-enter-active, .swap-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to { opacity: 0; transform: translateY(-6px); }

.pl-enter-active { transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.3, 1.2, 0.5, 1); }
.pl-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; position: absolute; left: 0; right: 0; }
.pl-enter-from, .pl-leave-to { opacity: 0; transform: translateY(14px) scale(0.98); }
.pl-move { transition: transform 0.45s ease; }

.foot { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-top: 24px; }
.foot p { margin: 0; font-size: 13px; color: var(--muted); }
.add { display: inline-flex; align-items: center; gap: 10px; padding: 12px 22px; border: 1.5px dashed #c9c2bb; border-radius: 99px; background: #fff; cursor: pointer; font: 500 14px "Poppins", system-ui, sans-serif; color: var(--ink); transition: border-color 0.25s, background 0.25s; }
.add:hover { border-color: var(--ink); background: #faf8f6; }
.add.on { border-style: solid; border-color: var(--line); background: #faf8f6; }
.plus { position: relative; width: 18px; height: 18px; border-radius: 50%; background: var(--ink); transition: transform 0.4s; }
.plus::before, .plus::after { content: ""; position: absolute; left: 50%; top: 50%; width: 8px; height: 1.8px; margin: -0.9px 0 0 -4px; background: #fff; border-radius: 2px; }
.plus::after { transform: rotate(90deg); }
.add.on .plus { transform: rotate(45deg); }

/* entrance (runs once) */
.mp:not(.in) .lead, .mp:not(.in) .wrap { opacity: 0; }
.mp.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.mp.in .title .soft { animation-delay: 0.1s; }
.mp.in .lead { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.mp.in .wrap { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

/* small screens: stages stack */
@media (max-width: 720px) {
  .mp { padding: 72px 0; }
  .pipe { padding: 18px 16px 16px; border-radius: 22px; }
  .chev { flex-direction: column; gap: 6px; }
  .st, .st:first-child, .st:last-child { margin: 0; height: 48px; padding: 0 16px; clip-path: none; border-radius: 12px; grid-template-columns: 1fr auto; align-items: center; }
  .rule { align-items: flex-start; }
  .add { width: 100%; justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  .mp *, .mp *::before, .mp *::after { animation: none !important; transition: none !important; }
  .mp:not(.in) .lead, .mp:not(.in) .wrap { opacity: 1; }
}
</style>
