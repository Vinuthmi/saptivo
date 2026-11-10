<template>
  <section id="stage-automation" ref="root" class="sa" :class="{ in: seen, live }" aria-labelledby="sa-title">
    <h2 id="sa-title" class="title">
      <span>Automate</span>
      <span class="soft">stage changes</span>
    </h2>
    <p class="lead">Trigger actions when a deal moves: send a quotation reminder, notify a manager when a big deal reaches negotiation, or create a handover task for operations when a deal is won. Assignment rules can rotate new deals across your team.</p>

    <div class="board">
      <!-- the deal moving through stages -->
      <div class="strip" role="group" aria-label="Move the deal to a stage">
        <p class="cap">Move the deal</p>
        <ol>
          <li v-for="(s, i) in stages" :key="s" :class="{ here: i === phase, past: i < phase }">
            <button type="button" :aria-pressed="i === phase" @click="go(i)">
              <span class="dot"></span>
              <b>{{ s }}</b>
            </button>
            <span v-if="i === phase" :key="'t' + phase" class="token"><i></i>ABC Solar · Rs 1.85M</span>
          </li>
        </ol>
      </div>

      <!-- rules -->
      <ul class="rules">
        <li v-for="(r, i) in rules" :key="r.id" class="rule" :class="[r.tone, state(r)]" :style="{ '--i': i }">
          <div class="when">
            <span class="tag">When</span>
            <b>{{ r.when }}</b>
            <small>{{ r.cond }}</small>
          </div>

          <span class="wire" aria-hidden="true"><i></i></span>

          <div class="then">
            <span class="tag">Then</span>
            <b>{{ r.then }}</b>
            <Transition name="swap" mode="out-in">
              <small :key="state(r)">
                <template v-if="state(r) === 'idle'">Waiting for the trigger</template>
                <template v-else-if="r.id === 'assign'">Assigned to <em>{{ reps[owner].name }}</em> · next in turn: {{ reps[(owner + 1) % reps.length].name }}</template>
                <template v-else>✓ {{ r.done }}</template>
              </small>
            </Transition>
          </div>
        </li>
      </ul>

      <!-- rotation -->
      <div class="rot" :class="{ on: phase >= 0 && state(rules[3]) !== 'idle' }">
        <p class="cap">Assignment rotation</p>
        <ul>
          <li v-for="(r, i) in reps" :key="r.name" :class="{ got: i === owner && state(rules[3]) === 'now', nxt: i === (owner + 1) % reps.length }">
            <span class="av">{{ r.ini }}</span>
            <b>{{ r.name }}</b>
            <small>{{ i === (owner + 1) % reps.length ? 'Next' : '' }}</small>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "StageAutomationSection" });

const stages = ["New", "Proposal", "Negotiation", "Won"];
const reps = [
  { name: "Chathura", ini: "CH" },
  { name: "Ishara", ini: "IS" },
  { name: "Sanjeewa", ini: "SA" },
  { name: "Nadeesha", ini: "NA" },
];

/* fire = the stage index at which the rule triggers */
const rules = [
  { id: "quote", tone: "butter", fire: 1, when: "Deal moves to Proposal", cond: "Any value", then: "Send a quotation reminder", done: "Reminder scheduled for 3 days after the quote" },
  { id: "manager", tone: "lav", fire: 2, when: "Deal reaches Negotiation", cond: "Value over Rs 1M", then: "Notify the sales manager", done: "Kasun notified · ABC Solar · Rs 1.85M" },
  { id: "handover", tone: "mint", fire: 3, when: "Deal is won", cond: "Any value", then: "Create a handover task for operations", done: "Task created for Operations · due in 2 days" },
  { id: "assign", tone: "sky", fire: 0, when: "A new deal is created", cond: "Assignment rule", then: "Rotate the deal across your team", done: "" },
];

const phase = ref(0);
const owner = ref(0);
const manual = ref(false);

// idle: not reached yet · now: fired at this stage · done: fired at an earlier stage
function state(r) {
  if (phase.value < r.fire) return "idle";
  return phase.value === r.fire ? "now" : "done";
}

function go(i) {
  manual.value = true;
  if (i === 0 && phase.value !== 0) owner.value = (owner.value + 1) % reps.length;
  phase.value = i;
}

/* demo loop: New → Proposal → Negotiation → Won → hold → restart with the next rep */
let tick = 0;
function step() {
  if (manual.value) return;
  tick += 1;
  const p = tick % 6;
  if (p === 0) {
    owner.value = (owner.value + 1) % reps.length;
    phase.value = 0;
  } else if (p <= 3) {
    phase.value = p;
  }
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1700);
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
    phase.value = 3;
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

.sa {
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
.sa *, .sa *::before, .sa *::after { box-sizing: border-box; }
.sa button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

/* pastel tones for each rule */
.butter { --bg: #fff6dc; --mid: #fde9a8; --deep: #b88a00; }
.lav { --bg: #f1eeff; --mid: #ddd6ff; --deep: #7d6be6; }
.mint { --bg: #eaf8f0; --mid: #c9ecd9; --deep: #2f9c6b; }
.sky { --bg: #eaf4fd; --mid: #cfe4f8; --deep: #3f87c7; }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { width: min(700px, calc(100% - 40px)); margin: 26px auto 0; text-align: center; font-size: 16px; line-height: 1.75; color: var(--muted); }

.board { width: min(1100px, calc(100% - 40px)); margin: 56px auto 0; display: grid; gap: 18px; }
.cap { margin: 0 0 14px; font-size: 11.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }

/* stage strip */
.strip { padding: 22px 24px 26px; border-radius: 28px; background: #f8f7fb; border: 1px solid #efedf6; }
.strip ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
.strip li { position: relative; display: grid; gap: 14px; justify-items: start; }
.strip li::before { content: ""; position: absolute; top: 9px; left: 22px; right: 0; height: 2px; background: #e4e0ee; }
.strip li.past::before { background: #8f80f0; }
.strip li:last-child::before { display: none; }
.strip button { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; padding: 0; border: 0; background: none; cursor: pointer; font: 500 14px "Poppins", system-ui, sans-serif; color: var(--muted); transition: color 0.3s; }
.dot { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 3px solid #d9d3ec; transition: background 0.4s, border-color 0.4s, transform 0.4s; }
.past .dot { background: #8f80f0; border-color: #8f80f0; }
.here .dot { background: var(--ink); border-color: var(--ink); transform: scale(1.2); }
.here button, .past button { color: var(--ink); }
.token { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 99px; background: var(--ink); color: #fff; font-size: 12px; font-weight: 500; animation: pop 0.5s cubic-bezier(0.3, 1.4, 0.5, 1); }
.token i { width: 7px; height: 7px; border-radius: 50%; background: #8fd6b4; }

/* rules */
.rules { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.rule { display: grid; grid-template-columns: 1fr 90px 1.1fr; align-items: stretch; gap: 0; }
.when, .then { display: grid; gap: 3px; align-content: center; padding: 18px 22px; border-radius: 22px; background: #fff; border: 1px solid var(--line); transition: background 0.5s, border-color 0.5s, box-shadow 0.5s; }
.then { min-height: 98px; }
.tag { justify-self: start; padding: 1px 9px; border-radius: 99px; background: #f3f0ec; color: #8a857f; font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; transition: background 0.4s, color 0.4s; }
.when b, .then b { font-size: 15.5px; font-weight: 500; letter-spacing: -0.01em; }
.when small, .then small { font-size: 12.5px; line-height: 1.5; color: var(--muted); }
.then small em { font-style: normal; font-weight: 500; color: var(--ink); }

.wire { position: relative; align-self: center; height: 2px; background: #e8e3de; overflow: hidden; }
.wire i { position: absolute; inset: 0; width: 40%; background: var(--deep); transform: translateX(-120%); }

.rule.now .when, .rule.now .then { background: var(--bg); border-color: var(--mid); }
.rule.now .then { box-shadow: 0 14px 30px rgba(20, 18, 15, 0.07); }
.rule.now .tag, .rule.done .tag { background: var(--mid); color: var(--ink); }
.rule.now .wire { background: var(--mid); }
.rule.now .wire i { animation: run 0.9s cubic-bezier(0.4, 0, 0.3, 1) forwards; }
.rule.done .when, .rule.done .then { background: var(--bg); border-color: transparent; }
.rule.done .wire { background: var(--mid); }
.rule.done .then small { color: var(--deep); font-weight: 500; }
.rule.now .then small { color: var(--deep); font-weight: 500; }
.rule.idle .when b, .rule.idle .then b { color: #7d7771; }

.swap-enter-active, .swap-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to { opacity: 0; transform: translateY(-6px); }

/* rotation */
.rot { padding: 20px 24px 22px; border-radius: 28px; background: #f4f8fd; border: 1px solid #e3edf8; }
.rot ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.rot li { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 16px; background: #fff; border: 1px solid transparent; transition: background 0.4s, border-color 0.4s, transform 0.4s; }
.rot li b { font-size: 13.5px; font-weight: 500; }
.rot li small { margin-left: auto; padding: 0; font-size: 10.5px; font-weight: 600; color: #3f87c7; }
.rot li.nxt { border-color: #bcd9f3; border-style: dashed; }
.rot li.got { background: #cfe4f8; transform: translateY(-3px); }
.av { display: grid; place-items: center; flex: none; width: 28px; height: 28px; border-radius: 50%; background: #e8e3ff; font-size: 10px; font-weight: 600; }

@keyframes pop { from { opacity: 0; transform: translateY(6px) scale(0.94); } to { opacity: 1; transform: none; } }
@keyframes run { from { transform: translateX(-120%); } to { transform: translateX(260%); } }

/* entrance (runs once) */
.sa:not(.in) .lead, .sa:not(.in) .board { opacity: 0; }
.sa.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.sa.in .title .soft { animation-delay: 0.1s; }
.sa.in .lead { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.sa.in .board { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 860px) {
  .rule { grid-template-columns: 1fr; }
  .wire { width: 2px; height: 22px; justify-self: center; }
  .wire i { width: 100%; height: 40%; transform: translateY(-120%); }
  .rule.now .wire i { animation-name: run-v; }
  .then { min-height: 0; }
  .rot ul { grid-template-columns: 1fr 1fr; }
}
@keyframes run-v { from { transform: translateY(-120%); } to { transform: translateY(260%); } }
@media (max-width: 560px) {
  .sa { padding: 72px 0; }
  .strip, .rot { padding: 18px 16px; border-radius: 22px; }
  .strip ol { grid-template-columns: 1fr 1fr; row-gap: 22px; }
  .strip li:nth-child(2)::before { display: none; }
  .when, .then { padding: 16px; border-radius: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .sa *, .sa *::before, .sa *::after { animation: none !important; transition: none !important; }
  .sa:not(.in) .lead, .sa:not(.in) .board { opacity: 1; }
}
</style>