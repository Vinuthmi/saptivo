<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AssignmentEscalationSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref(false);
let io = null;
let cycle = null;
let escTimer = null;
let touched = false;

/* Images: put your files in /public/saptivo/images/features/ and change the names here.
   If a file is missing, the person's initials are shown instead. */
const imgs = {
  agents: [
    "/saptivo/images/features/agent-1.webp",
    "/saptivo/images/features/agent-2.webp",
    "/saptivo/images/features/agent-3.webp",
    "/saptivo/images/features/agent-4.webp",
    "/saptivo/images/features/agent-5.webp",
  ],
};
const ok = reactive([true, true, true, true, true]);

/* All names, tickets and rules are SAMPLE data. */
const agents = [
  { n: "Nimal P.", i: "NP" },
  { n: "Kasun R.", i: "KR" },
  { n: "Dilani S.", i: "DS" },
  { n: "Ishara W.", i: "IW" },
  { n: "Ruwan M.", i: "RM" }, // supervisor
];
const SUP = 4;
const CAP = 4;
const keyAccounts = ["Acme Ltd", "Harbour Hotel"];

const modes = [
  {
    n: "By category",
    note: "Breakdowns, installations and billing go to their own teams.",
    attr: (t) => t.cat,
    teams: [
      { n: "Service desk", tone: "lav", ag: [0, 1], match: (t) => t.cat === "Breakdown" },
      { n: "Installations", tone: "mint", ag: [2], match: (t) => t.cat === "Installation" },
      { n: "Billing", tone: "butter", ag: [3], match: (t) => t.cat === "Billing" },
    ],
  },
  {
    n: "By product",
    note: "Each product line has its own specialist team.",
    attr: (t) => t.prod,
    teams: [
      { n: "Cooling team", tone: "sky", ag: [0, 2], match: (t) => t.prod === "Air conditioner" },
      { n: "Power team", tone: "butter", ag: [1], match: (t) => t.prod === "Generator" },
      { n: "Solar team", tone: "mint", ag: [3], match: (t) => t.prod === "Solar" },
    ],
  },
  {
    n: "By customer",
    note: "Key accounts get a dedicated team.",
    attr: (t) => t.cust,
    teams: [
      { n: "Key accounts", tone: "lav", ag: [0, 1], match: (t) => keyAccounts.includes(t.cust) },
      { n: "General support", tone: "sky", ag: [2, 3], match: () => true },
    ],
  },
];
const mode = ref(0);

const tickets = reactive([
  { id: "TK-3201", t: "AC not cooling", cat: "Breakdown", prod: "Air conditioner", cust: "Acme Ltd", esc: false },
  { id: "TK-3202", t: "Generator will not start", cat: "Breakdown", prod: "Generator", cust: "Harbour Hotel", esc: false },
  { id: "TK-3203", t: "Quote for a new AC install", cat: "Installation", prod: "Air conditioner", cust: "Lanka Foods", esc: false },
  { id: "TK-3204", t: "Solar inverter alarm", cat: "Breakdown", prod: "Solar", cust: "City Clinic", esc: false },
  { id: "TK-3205", t: "Invoice query", cat: "Billing", prod: "Generator", cust: "Acme Ltd", esc: false },
  { id: "TK-3206", t: "Install a 20 kW solar array", cat: "Installation", prod: "Solar", cust: "Metro Mall", esc: false },
  { id: "TK-3207", t: "Noisy outdoor unit", cat: "Breakdown", prod: "Air conditioner", cust: "Harbour Hotel", esc: false },
]);

const lanes = computed(() => [...modes[mode.value].teams, { n: "Supervisor", tone: "rose" }]);

/* route every ticket to a team, then to that team's least-loaded agent */
const routed = computed(() => {
  const L = lanes.value;
  const load = agents.map(() => 0);
  const pos = L.map(() => 0);
  return tickets.map((t) => {
    let lane = L.length - 1;
    let agent = SUP;
    if (!t.esc) {
      lane = L.findIndex((x, k) => k < L.length - 1 && x.match(t));
      agent = L[lane].ag.reduce((b, a) => (load[a] < load[b] ? a : b), L[lane].ag[0]);
    }
    load[agent] += 1;
    pos[lane] += 1;
    return { t, lane, agent, row: pos[lane] + 1 };
  });
});
const load = computed(() => {
  const l = agents.map(() => 0);
  routed.value.forEach((r) => (l[r.agent] += 1));
  return l;
});
const rows = computed(() => Math.max(3, ...lanes.value.map((_, k) => routed.value.filter((r) => r.lane === k).length)));
const count = (k) => routed.value.filter((r) => r.lane === k).length;
const teamOf = (a) => {
  if (a === SUP) return "Supervisor";
  const x = modes[mode.value].teams.find((m) => m.ag.includes(a));
  return x ? x.n : "No tickets in this view";
};

function stop() {
  touched = true;
  clearInterval(cycle);
  clearTimeout(escTimer);
}
function pick(k) {
  stop();
  mode.value = k;
}
function toggleEsc(t) {
  stop();
  t.esc = !t.esc;
}

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    seen.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      shown.value = true;
      seen.value = true;
      io.disconnect();
      /* gentle auto-demo until the visitor takes over */
      cycle = setInterval(() => {
        if (!touched) mode.value = (mode.value + 1) % modes.length;
      }, 5500);
      escTimer = setTimeout(() => {
        if (!touched) tickets[3].esc = true;
      }, 2600);
    },
    { threshold: 0.3 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
  clearInterval(cycle);
  clearTimeout(escTimer);
});
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Assignment and</span> <span class="l2">escalation</span></h2>
        <p class="sub">
          Route tickets to the right team automatically by category, product or customer, and escalate to a supervisor when needed. Managers see every agent's queue at a glance.
        </p>
      </header>

      <div class="board" :class="{ on: seen }">
        <!-- rule picker -->
        <div class="bh">
          <div class="seg" role="group" aria-label="Route tickets">
            <button
              v-for="(m, k) in modes"
              :key="m.n"
              type="button"
              :class="{ sel: mode === k }"
              :aria-pressed="mode === k"
              @click="pick(k)"
            >
              {{ m.n }}
            </button>
          </div>
          <p>{{ modes[mode].note }} Escalated tickets go to the supervisor.</p>
        </div>

        <!-- lanes -->
        <div class="scroll">
          <TransitionGroup
            name="mv"
            tag="div"
            class="lanes"
            :style="{
              gridTemplateColumns: `repeat(${lanes.length}, minmax(0, 1fr))`,
              gridTemplateRows: `auto repeat(${rows}, auto)`,
            }"
          >
            <template v-for="(l, k) in lanes" :key="'lane-' + l.n">
              <div
                class="lane"
                :class="'tone-' + l.tone"
                :style="{ gridColumn: k + 1, gridRow: '1 / -1' }"
              ></div>
              <div
                class="lh"
                :class="'tone-' + l.tone"
                :style="{ gridColumn: k + 1, gridRow: 1 }"
              >
                <b>{{ l.n }}</b>
                <span>{{ count(k) }}</span>
              </div>
            </template>

            <article
              v-for="r in routed"
              :key="r.t.id"
              class="tk"
              :class="[{ esc: r.t.esc }, 'tone-' + lanes[r.lane].tone]"
              :style="{ gridColumn: r.lane + 1, gridRow: r.row }"
            >
              <div class="r1">
                <small>{{ r.t.id }}</small>
                <span class="tag">{{ modes[mode].attr(r.t) }}</span>
              </div>
              <b>{{ r.t.t }}</b>
              <div class="ft">
                <span class="av">
                  <img v-if="ok[r.agent]" :src="imgs.agents[r.agent]" alt="" @error="ok[r.agent] = false" />
                  <template v-else>{{ agents[r.agent].i }}</template>
                </span>
                <em>{{ agents[r.agent].n }}</em>
                <button type="button" :aria-label="r.t.esc ? `Return ${r.t.id} to the team` : `Escalate ${r.t.id} to the supervisor`" @click="toggleEsc(r.t)">
                  {{ r.t.esc ? "Return" : "Escalate" }}
                </button>
              </div>
            </article>
          </TransitionGroup>
        </div>

        <!-- manager view -->
        <div class="mgr">
          <div class="mh">
            <b>Manager view</b>
            <small>Every agent's queue at a glance</small>
          </div>
          <ul>
            <li v-for="(a, k) in agents" :key="a.n">
              <span class="av">
                <img v-if="ok[k]" :src="imgs.agents[k]" alt="" @error="ok[k] = false" />
                <template v-else>{{ a.i }}</template>
              </span>
              <div class="who">
                <b>{{ a.n }}</b>
                <small>{{ teamOf(k) }}</small>
              </div>
              <div class="bar" :class="{ full: load[k] >= CAP }">
                <i :style="{ width: Math.min(100, (load[k] / CAP) * 100) + '%' }"></i>
              </div>
              <em>{{ load[k] }}<span> / {{ CAP }}</span></em>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hw {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1080px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 58ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }

.board { padding: 18px; border-radius: 34px; background: #faf9ff; border: 1.5px solid var(--line); display: flex; flex-direction: column; gap: 16px; opacity: .35; transform: translateY(14px); transition: all .8s cubic-bezier(.3, .8, .3, 1); }
.board.on { opacity: 1; transform: none; box-shadow: 0 24px 54px rgba(60, 50, 120, .1); }
.bh { display: flex; align-items: center; gap: 14px 18px; flex-wrap: wrap; padding: 2px 4px; }
.bh p { margin: 0; font-size: 12.5px; color: var(--muted); }
.seg { display: inline-flex; gap: 4px; padding: 4px; border-radius: 99px; background: #fff; border: 1.5px solid var(--line); }
.seg button { padding: 8px 15px; border: 0; border-radius: 99px; background: transparent; font: inherit; font-size: 12px; font-weight: 600; color: var(--muted); cursor: pointer; transition: background .3s, color .3s; }
.seg button.sel { background: var(--ink); color: #fff; }
.seg button:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 2px; }

/* lanes (one grid: every ticket is placed by column and row, so it can glide between teams) */
.scroll { overflow-x: auto; }
.lanes { display: grid; gap: 10px; min-width: 700px; align-items: start; }
.lane { background: #fff; border-radius: 22px; z-index: 0; align-self: stretch; transition: background .4s; }
.lane.tone-rose { background: #fff6f8; }
.lh { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 8px; height: 50px; padding: 14px 16px 0; }
.lh b { font-size: 13px; padding: 5px 12px; border-radius: 99px; background: var(--t); color: var(--ti); }
.lh span { font-size: 12px; font-weight: 700; color: var(--muted); font-variant-numeric: tabular-nums; }

.tk { position: relative; z-index: 1; margin: 0 12px 6px; padding: 10px 12px; border-radius: 16px; background: #f6f4ff; border: 1.5px solid var(--line); display: flex; flex-direction: column; gap: 6px; }
.tk.esc { background: #fff1f4; border-color: var(--rose-i); }
.r1 { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
.r1 small { font-size: 10.5px; font-weight: 600; letter-spacing: .04em; color: var(--muted); }
.tag { padding: 2px 9px; border-radius: 99px; background: var(--t); color: var(--ti); font-size: 10px; font-weight: 700; white-space: nowrap; }
.tk > b { font-size: 12.5px; line-height: 1.35; }
.ft { display: flex; align-items: center; gap: 7px; margin-top: 2px; }
.ft em { flex: 1; min-width: 0; font-style: normal; font-size: 11px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ft button { padding: 4px 10px; border: 1.5px solid var(--line); border-radius: 99px; background: #fff; font: inherit; font-size: 10.5px; font-weight: 700; color: var(--muted); cursor: pointer; transition: border-color .25s, color .25s; }
.ft button:hover { border-color: var(--rose-i); color: var(--rose-i); }
.ft button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.esc .ft button { background: var(--ink); border-color: var(--ink); color: #fff; }

.av { flex: none; width: 24px; height: 24px; border-radius: 50%; overflow: hidden; display: grid; place-items: center; background: var(--ink); color: #fff; font-size: 8.5px; font-weight: 700; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }

.mv-move { transition: transform .6s cubic-bezier(.3, .8, .3, 1); }

/* manager view */
.mgr { background: #fff; border-radius: 26px; padding: 18px; }
.mh { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
.mh b { font-size: 15px; }
.mh small { font-size: 11.5px; color: var(--muted); }
.mgr ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 22px; }
.mgr li { display: grid; grid-template-columns: 34px minmax(0, 1fr) 90px 44px; align-items: center; gap: 10px; }
.mgr .av { width: 34px; height: 34px; font-size: 10.5px; }
.who b { display: block; font-size: 12.5px; }
.who small { display: block; font-size: 10.5px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bar { height: 8px; border-radius: 99px; background: #f1eff8; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 99px; background: var(--lav-i); transition: width .7s cubic-bezier(.3, .8, .3, 1), background .4s; }
.bar.full i { background: var(--rose-i); }
.mgr em { font-style: normal; font-size: 13px; font-weight: 700; text-align: right; font-variant-numeric: tabular-nums; }
.mgr em span { font-weight: 500; color: #a3a6b4; font-size: 11px; }

.note { margin: 26px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 760px) {
  .hw { padding: 64px 16px; }
  .board { padding: 12px; border-radius: 28px; }
  .mgr ul { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .mv-move { transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
