<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SlaEscalationsSection" });

const root = ref(null);
const shown = ref(false);
const pct = ref(0);
let timer = null;
let io = null;
let reduce = false;
const HOLD = 135; // pct value where the loop restarts (shows the end state for a moment)

const base = "/saptivo/images/features/";
const ownerPhoto = base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG";
const mgrPhoto = base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg";
const ok = ref([true, true]);

const cards = [
  { k: "ticket", type: "Ticket", title: "#204 · Delivery delay", sub: "Ceylon Motors", target: "Response within 1 hour", speed: 1, ic: "M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4zM10 7v12" },
  { k: "job", type: "Service job", title: "J-118 · AC repair", sub: "Colombo 05", target: "Resolution within 24 hours", speed: 1.18, ic: "M14 7l3-3 3 3-3 3M3 21l9-9M12 12l5-5" },
  { k: "deal", type: "Deal", title: "Hasitha Traders · LKR 450,000", sub: "Proposal sent", target: "Follow up within 2 days", speed: 0.88, ic: "M4 20V10M10 20V4M16 20v-8M22 20H2" },
];

const rules = [
  { at: 75, t: "Remind the owner", tone: "butter" },
  { at: 90, t: "Notify the manager", tone: "rose" },
  { at: 100, t: "Reassign and log it", tone: "mint" },
];

function prog(c) {
  return Math.min(100, pct.value * c.speed);
}
function state(c) {
  const p = prog(c);
  if (p >= 100) return "done";
  if (p >= 90) return "esc";
  if (p >= 75) return "risk";
  return "ok";
}
const label = { ok: "On track", risk: "At risk", esc: "Escalated", done: "Handled by manager" };
function left(c) {
  const p = prog(c);
  return Math.max(0, Math.round(60 * (1 - p / 100)));
}
const lead = computed(() => prog(cards[0]));

function tickFn() {
  pct.value = pct.value >= HOLD ? 0 : pct.value + 1.1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tickFn, 90);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    pct.value = 92;
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
  <section ref="root" class="sla" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <span class="eyebrow">Service levels</span>
        <h2><span class="l1">SLA-based</span> <span class="l2">escalations</span></h2>
        <p>
          Set response and resolution targets for tickets, service jobs and deals. When a target is about to be
          missed, Saptivo escalates automatically, so nothing waits on someone remembering.
        </p>
      </header>

      <ul class="cards" role="img" aria-label="Tickets, service jobs and deals with SLA timers that escalate automatically before a target is missed">
        <li v-for="(c, i) in cards" :key="c.k" class="card" :class="['st-' + state(c)]" :style="{ '--d': i * 80 + 'ms' }">
          <div class="top">
            <span class="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="c.ic" /></svg>
            </span>
            <span class="ty">{{ c.type }}</span>
            <span class="badge">{{ label[state(c)] }}</span>
          </div>

          <div class="ttl">
            <strong>{{ c.title }}</strong>
            <span>{{ c.sub }}</span>
          </div>

          <div class="tgt">
            <span>Target</span>
            <b>{{ c.target }}</b>
          </div>

          <div class="meter">
            <div class="bar">
              <i :style="{ width: prog(c) + '%' }"></i>
              <u class="m75"></u>
              <u class="m90"></u>
            </div>
            <div class="mr">
              <span>{{ state(c) === "done" ? "Target protected" : left(c) + " min left" }}</span>
              <span>{{ Math.round(prog(c)) }}% used</span>
            </div>
          </div>

          <div class="evt">
            <Transition name="fade" mode="out-in">
              <div v-if="state(c) === 'ok'" key="ok" class="line muted">Watching the clock</div>
              <div v-else-if="state(c) === 'risk'" key="r" class="line">
                <span class="av a1">
                  <img v-if="ok[0]" :src="ownerPhoto" alt="" @error="ok[0] = false" />
                  <b v-else>K</b>
                </span>
                Reminder sent to Kasun
              </div>
              <div v-else-if="state(c) === 'esc'" key="e" class="line">
                <span class="av a2">
                  <img v-if="ok[1]" :src="mgrPhoto" alt="" @error="ok[1] = false" />
                  <b v-else>N</b>
                </span>
                Nimali (manager) notified
              </div>
              <div v-else key="d" class="line">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                Reassigned and logged on the record
              </div>
            </Transition>
          </div>
        </li>
      </ul>

      <div class="ladder">
        <span class="lt">Example escalation rules</span>
        <ol>
          <li v-for="r in rules" :key="r.at" :class="['tone-' + r.tone, { on: lead >= r.at }]">
            <b>{{ r.at }}%</b>
            <span>{{ r.t }}</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sla {
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
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 760px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--rose); color: var(--rose-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.sla h2 .l1 { color: #111111 !important; opacity: 1; }
.sla h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .card, .ladder { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .card, .in .ladder { opacity: 1; transform: none; }
.in .card { transition-delay: calc(.1s + var(--d)); }
.in .ladder { transition-delay: .35s; }

.cards { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.card { --c: var(--mint-i); --cb: #f2fbf6; --cs: var(--mint); background: var(--cb); border: 1px solid var(--line); border-radius: 26px; padding: 20px; display: flex; flex-direction: column; gap: 16px; transition: background .5s, border-color .5s, box-shadow .5s, opacity .6s ease, transform .6s ease; }
.card.st-risk { --c: var(--butter-i); --cb: #fffaea; --cs: var(--butter); border-color: var(--butter-i); }
.card.st-esc { --c: var(--rose-i); --cb: #fff5f8; --cs: var(--rose); border-color: var(--rose-i); box-shadow: 0 18px 44px rgba(216, 86, 127, .14); }
.card.st-done { --c: var(--mint-i); --cb: #f2fbf6; --cs: var(--mint); }

.top { display: flex; align-items: center; gap: 10px; }
.ic svg { width: 34px; height: 34px; padding: 8px; border-radius: 11px; background: var(--cs); color: var(--c); display: block; transition: all .4s; }
.ty { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.badge { margin-left: auto; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 99px; background: var(--cs); color: var(--c); transition: all .4s; white-space: nowrap; }
.ttl strong { display: block; font-size: 16px; line-height: 1.4; }
.ttl span { font-size: 12.5px; color: var(--muted); }
.tgt { display: flex; flex-direction: column; gap: 2px; background: #fff; border-radius: 14px; padding: 10px 14px; }
.tgt span { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.tgt b { font-size: 13px; font-weight: 600; }

.meter .bar { position: relative; height: 12px; border-radius: 99px; background: #fff; overflow: hidden; }
.meter .bar i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 99px; background: var(--c); transition: background .4s; }
.meter u { position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(20, 18, 15, .28); }
.m75 { left: 75%; }
.m90 { left: 90%; }
.mr { display: flex; justify-content: space-between; margin-top: 8px; font-size: 11.5px; font-weight: 600; color: var(--muted); }

.evt { margin-top: auto; min-height: 44px; display: flex; }
.line { display: flex; align-items: center; gap: 10px; width: 100%; font-size: 12.5px; font-weight: 600; background: #fff; border-radius: 14px; padding: 9px 12px; }
.line.muted { color: var(--muted); font-weight: 500; }
.line svg { width: 24px; height: 24px; padding: 5px; border-radius: 50%; background: var(--mint-i); color: #fff; flex: none; }
.av { width: 26px; height: 26px; border-radius: 50%; overflow: hidden; display: grid; place-items: center; font-size: 11px; font-weight: 700; flex: none; }
.a1 { background: var(--butter); color: var(--butter-i); }
.a2 { background: var(--rose); color: var(--rose-i); }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

/* ladder */
.ladder { margin-top: 20px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; justify-content: center; background: #f8f7fc; border-radius: 22px; padding: 14px 18px; }
.lt { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.ladder ol { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.ladder li { display: inline-flex; align-items: center; gap: 10px; padding: 7px 16px 7px 8px; border-radius: 99px; background: #fff; font-size: 13px; font-weight: 600; color: var(--muted); transition: all .4s; }
.ladder li b { font-size: 11px; padding: 3px 9px; border-radius: 99px; background: #f1f0f6; transition: all .4s; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.ladder li.on { color: var(--ink); box-shadow: 0 6px 16px rgba(60, 50, 120, .1); }
.ladder li.on b { background: var(--t); color: var(--ti); }

.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 960px) {
  .cards { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }
}
@media (max-width: 560px) {
  .sla { padding: 64px 16px; }
  .ladder { justify-content: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .card, .ladder { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
