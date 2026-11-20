<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "CsatSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const view = ref("agent");
const manual = ref(false);
const ok = ref([true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const custPhoto = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const agents = [
  { name: "Nimali", csat: 4.8, frt: "6 min", aht: "7m 10s", tag: "Celebrate" },
  { name: "Kasun", csat: 4.5, frt: "11 min", aht: "8m 40s", tag: "" },
  { name: "Ruwan", csat: 4.1, frt: "19 min", aht: "12m 05s", tag: "Coach" },
  { name: "Shanika", csat: 4.7, frt: "9 min", aht: "8m 15s", tag: "Celebrate" },
];
const cats = [
  { name: "Installation", csat: 4.7, frt: "8 min", aht: "9m 30s", tag: "Celebrate" },
  { name: "Breakdown", csat: 4.2, frt: "17 min", aht: "13m 10s", tag: "Coach" },
  { name: "Warranty claim", csat: 4.4, frt: "12 min", aht: "10m 45s", tag: "" },
  { name: "AMC renewal", csat: 4.9, frt: "5 min", aht: "6m 20s", tag: "Celebrate" },
];
const rows = computed(() => (view.value === "agent" ? agents : cats));

const step = computed(() => (reduce ? 6 : n.value % 10));
const rating = computed(() => (step.value >= 3 ? 5 : 0));
const surveyState = computed(() => {
  if (step.value < 1) return "closed";
  if (step.value < 2) return "sent";
  if (step.value < 5) return "open";
  return "thanks";
});
const csat = computed(() => (step.value >= 6 ? "4.7" : "4.6"));
const resp = computed(() => (step.value >= 6 ? 1285 : 1284));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(tick, 1400);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(v) {
  view.value = v;
  manual.value = true;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
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
  <section ref="root" class="cs" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Measure customer</span> <span class="l2">satisfaction</span></h2>
        <p>
          Every closed ticket can trigger a CSAT survey. Support dashboards show CSAT, first response time and average
          handling time by agent and category, so you know where to coach and where to celebrate.
        </p>
      </header>

      <div class="stage">
        <!-- survey -->
        <div class="sv">
          <div class="ticket">
            <span class="av"><img v-if="ok[1]" :src="custPhoto" alt="" @error="ok[1] = false" /><b v-else>D</b></span>
            <div>
              <strong>Ticket #4821 · Filter indicator</strong>
              <small :class="{ cl: step >= 0 }">Closed by Nimali</small>
            </div>
          </div>

          <div class="arrow" :class="{ on: step >= 1 }"><i></i><span>CSAT survey sent</span></div>

          <div class="card" :class="surveyState">
            <template v-if="surveyState === 'thanks'">
              <div class="ty"><b>Thank you, Dilani</b><span>Your feedback was recorded.</span></div>
            </template>
            <template v-else>
              <p class="q">How satisfied were you with the support you received?</p>
              <div class="stars" aria-hidden="true">
                <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" :class="{ f: i <= rating }">
                  <path d="M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z" />
                </svg>
              </div>
              <div class="cm" :class="{ on: step >= 4 }">
                <span v-if="step >= 4">Fixed in one reply, thank you!</span>
                <span v-else class="ph">Add a comment (optional)</span>
              </div>
            </template>
          </div>
        </div>

        <!-- dashboard -->
        <div class="db">
          <div class="bar">
            <span class="lb">Support dashboard</span>
            <div class="tabs" role="tablist">
              <button type="button" role="tab" :aria-selected="view === 'agent'" :class="{ on: view === 'agent' }" @click="pick('agent')">By agent</button>
              <button type="button" role="tab" :aria-selected="view === 'cat'" :class="{ on: view === 'cat' }" @click="pick('cat')">By category</button>
            </div>
          </div>

          <div class="kpis">
            <div class="k">
              <small>CSAT</small>
              <strong>{{ csat }}<em> / 5</em></strong>
              <span>{{ resp }} responses</span>
            </div>
            <div class="k">
              <small>First response</small>
              <strong>12<em> min</em></strong>
              <span>Median this month</span>
            </div>
            <div class="k">
              <small>Avg handling time</small>
              <strong>8m 40s</strong>
              <span>Per closed ticket</span>
            </div>
          </div>

          <div class="tbl">
            <div class="tr th"><span>{{ view === "agent" ? "Agent" : "Category" }}</span><span>CSAT</span><span class="hm">First resp.</span><span class="hm">Handling</span><span></span></div>
            <TransitionGroup name="row" tag="div" class="body">
              <div v-for="(r, i) in rows" :key="view + r.name" class="tr" :style="{ transitionDelay: i * 60 + 'ms' }">
                <span class="nm">{{ r.name }}</span>
                <span class="sc">
                  <span class="trk"><i :style="{ width: shown ? ((r.csat - 3) / 2) * 100 + '%' : '0%' }" :class="{ co: r.tag === 'Coach' }"></i></span>
                  <b>{{ r.csat.toFixed(1) }}</b>
                </span>
                <span class="hm">{{ r.frt }}</span>
                <span class="hm">{{ r.aht }}</span>
                <span class="tg"><em v-if="r.tag" :class="r.tag === 'Coach' ? 'coach' : 'cel'">{{ r.tag }}</em></span>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cs {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 52px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.cs h2 .l1 { color: #111111 !important; opacity: 1; }
.cs h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .08s; }

.stage { display: grid; grid-template-columns: 360px 1fr; gap: 20px; align-items: stretch; }

/* survey */
.sv { background: var(--lav); border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.ticket { display: flex; gap: 12px; align-items: center; background: #fff; border-radius: 16px; padding: 12px 14px; }
.ticket strong { display: block; font-size: 13px; }
.ticket small { font-size: 12px; color: var(--mint-i); font-weight: 500; }
.av { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 13px; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.arrow { display: flex; align-items: center; gap: 10px; padding-left: 18px; font-size: 12px; font-weight: 500; color: var(--muted); opacity: .35; transition: opacity .4s; }
.arrow.on { opacity: 1; }
.arrow i { width: 1.5px; height: 22px; background: var(--lav-i); opacity: .6; }

.card { background: #fff; border-radius: 18px; padding: 20px; min-height: 190px; display: flex; flex-direction: column; gap: 14px; justify-content: center; opacity: .45; transition: opacity .45s, transform .45s; transform: translateY(6px); }
.card.open, .card.thanks { opacity: 1; transform: none; }
.card.sent { opacity: .75; transform: none; }
.q { margin: 0; font-size: 14px; font-weight: 500; line-height: 1.55; }
.stars { display: flex; gap: 8px; }
.stars svg { width: 30px; height: 30px; fill: #fff; stroke: #cfc9e4; stroke-width: 1.5; stroke-linejoin: round; transition: fill .3s, stroke .3s; }
.stars svg.f { fill: #f2c94c; stroke: #d5a92a; }
.cm { border: 1px solid var(--line); border-radius: 12px; padding: 10px 14px; font-size: 13px; min-height: 40px; display: flex; align-items: center; transition: border-color .3s; }
.cm.on { border-color: var(--lav-i); }
.cm .ph { color: #a6a3b3; }
.ty { display: flex; flex-direction: column; gap: 4px; text-align: center; }
.ty b { font-size: 16px; font-weight: 600; color: var(--mint-i); }
.ty span { font-size: 13px; color: var(--muted); }

/* dashboard */
.db { background: var(--sky); border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.tabs { display: flex; gap: 4px; padding: 3px; background: rgba(255, 255, 255, .65); border-radius: 99px; }
.tabs button { all: unset; cursor: pointer; font-size: 12.5px; font-weight: 500; padding: 6px 14px; border-radius: 99px; color: var(--muted); transition: all .25s; }
.tabs button.on { background: var(--ink); color: #fff; }
.tabs button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.k { background: #fff; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.k small { font-size: 12px; color: var(--muted); }
.k strong { font-size: 26px; font-weight: 500; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.k em { font-style: normal; font-size: 13px; color: var(--muted); font-weight: 400; }
.k span { font-size: 11.5px; color: var(--muted); }

.tbl { background: #fff; border-radius: 16px; padding: 6px 16px; }
.tr { display: grid; grid-template-columns: 1.1fr 1.6fr .8fr .8fr 90px; gap: 12px; align-items: center; padding: 13px 0; border-top: 1px solid var(--line); font-size: 13px; }
.tr.th { border-top: 0; font-size: 11.5px; color: var(--muted); font-weight: 500; padding: 10px 0 8px; }
.nm { font-weight: 500; }
.sc { display: flex; align-items: center; gap: 10px; }
.trk { flex: 1; height: 6px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.trk i { display: block; height: 100%; background: var(--sky-i); border-radius: 4px; transition: width 1s cubic-bezier(.2, .7, .2, 1); }
.trk i.co { background: var(--rose-i); }
.sc b { font-weight: 600; font-variant-numeric: tabular-nums; min-width: 26px; }
.hm { color: var(--muted); }
.tg { text-align: right; }
.tg em { font-style: normal; font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 6px; }
.tg .cel { background: var(--mint); color: var(--mint-i); }
.tg .coach { background: var(--rose); color: var(--rose-i); }

.row-enter-active { transition: opacity .4s ease, transform .4s ease; }
.row-enter-from { opacity: 0; transform: translateY(8px); }
.row-leave-active { display: none; }

@media (max-width: 1000px) {
  .stage { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .cs { padding: 64px 16px; }
  .sv, .db { padding: 16px; border-radius: 22px; }
  .kpis { grid-template-columns: 1fr; }
  .tr { grid-template-columns: 1fr 1.4fr 80px; }
  .hm { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
