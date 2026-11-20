<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "DripSequencesSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const manual = ref(-1);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "woman-with-digital-code-projection-on-face-2026-09-24-06-56-53-utc.webp";

const seqs = [
  {
    tab: "Follow up new leads",
    who: "Dilani Perera",
    role: "New lead",
    stop: 2,
    ev: "Replied to the WhatsApp message",
    steps: [
      { d: "Day 0", ch: "Email", t: "Thanks for your enquiry" },
      { d: "Day 2", ch: "WhatsApp", t: "A quick question about your needs" },
      { d: "Day 5", ch: "Email", t: "How a similar business uses Saptivo" },
      { d: "Day 8", ch: "Task", t: "Call the lead" },
    ],
  },
  {
    tab: "Onboard new customers",
    who: "Saman Silva",
    role: "New customer",
    stop: 3,
    ev: "Replied to the check-in email",
    steps: [
      { d: "Day 0", ch: "Email", t: "Welcome, here is your plan" },
      { d: "Day 1", ch: "WhatsApp", t: "How to get started" },
      { d: "Day 4", ch: "Email", t: "Set up your first branch" },
      { d: "Day 10", ch: "Email", t: "How are we doing?" },
    ],
  },
  {
    tab: "Win back quiet ones",
    who: "Ayesha Raheem",
    role: "No order in 90 days",
    stop: 1,
    ev: "Placed a new order",
    steps: [
      { d: "Day 0", ch: "Email", t: "It has been a while" },
      { d: "Day 3", ch: "WhatsApp", t: "Anything we can help with?" },
      { d: "Day 7", ch: "Email", t: "A thank-you offer" },
      { d: "Day 14", ch: "Email", t: "One last note" },
    ],
  },
];

const tab = computed(() => {
  if (manual.value >= 0) return manual.value;
  return reduce ? 0 : Math.floor(n.value / 10) % 3;
});
const sub = computed(() => (manual.value >= 0 || reduce ? 9 : n.value % 10));
const cur = computed(() => seqs[tab.value]);
// token advances one node every 2 ticks, up to the node where the contact acts
const pos = computed(() => Math.min(Math.floor(sub.value / 2), cur.value.stop));
const stopped = computed(() => sub.value >= cur.value.stop * 2 + 2 || sub.value >= 9);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce || manual.value >= 0) return;
  timer = setInterval(tick, 1100);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manual.value = i;
  stop();
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
  <section ref="root" class="dr" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Drip and nurture</span> <span class="l2">sequences</span></h2>
        <p>
          Set up automated sequences that follow up with new leads, onboard new customers or win back quiet ones.
          Sequences stop automatically when the contact replies or buys.
        </p>
      </header>

      <div class="tabs" role="tablist">
        <button v-for="(s, i) in seqs" :key="s.tab" type="button" role="tab" :aria-selected="i === tab" class="tb" :class="{ on: i === tab }" @click="pick(i)">{{ s.tab }}</button>
      </div>

      <div class="stage">
        <!-- contact -->
        <aside class="ct">
          <figure class="ph">
            <img v-if="ok" :src="photo" alt="" @error="ok = false" />
            <span v-else class="fb">{{ cur.who.charAt(0) }}</span>
          </figure>
          <div class="ci">
            <strong>{{ cur.who }}</strong>
            <small>{{ cur.role }}</small>
          </div>
          <span class="st" :class="{ stopped }">
            <i></i>{{ stopped ? "Sequence stopped automatically" : "In sequence · step " + (pos + 1) + " of 4" }}
          </span>
        </aside>

        <!-- flow -->
        <div class="flow">
          <Transition name="sw" mode="out-in">
            <div :key="tab" class="rail">
              <div class="line"><i :style="{ width: (pos / 3) * 100 + '%' }"></i></div>
              <div v-for="(s, i) in cur.steps" :key="s.t" class="node" :class="{ done: i <= pos, cut: stopped && i > cur.stop, here: i === pos }">
                <span class="dd">{{ s.d }}</span>
                <span class="dot"></span>
                <div class="nc" :class="s.ch.toLowerCase()">
                  <em>{{ s.ch }}</em>
                  <b>{{ s.t }}</b>
                </div>
              </div>
            </div>
          </Transition>

          <div class="ev" :class="{ on: stopped }">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
            <span v-if="stopped"><b>{{ cur.who.split(" ")[0] }}</b> {{ cur.ev.charAt(0).toLowerCase() + cur.ev.slice(1) }}. The remaining steps were cancelled.</span>
            <span v-else>Waiting for the contact to reply or buy.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dr {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.dr *, .dr *::before, .dr *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 40px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.dr h2 .l1 { color: #111111 !important; opacity: 1; }
.dr h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .tabs, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .tabs, .in .stage { opacity: 1; transform: none; }
.in .tabs { transition-delay: .06s; }
.in .stage { transition-delay: .12s; }

.tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 22px; }
.tb { all: unset; cursor: pointer; padding: 10px 20px; border-radius: 99px; border: 1px solid var(--line); font-size: 13.5px; font-weight: 500; color: var(--muted); transition: all .3s; }
.tb:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.tb.on { background: var(--ink); border-color: var(--ink); color: #fff; }

.stage { display: grid; grid-template-columns: 290px minmax(0, 1fr); gap: 20px; align-items: stretch; }

/* contact */
.ct { background: var(--lav); border-radius: 28px; padding: 14px; display: flex; flex-direction: column; gap: 14px; }
.ph { margin: 0; height: 280px; border-radius: 20px; overflow: hidden; background: linear-gradient(160deg, #fff, #d6e8f8); }
.ph img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }
.fb { width: 100%; height: 100%; display: grid; place-items: center; font-size: 56px; font-weight: 500; color: var(--lav-i); }
.ci { padding: 0 8px; display: flex; flex-direction: column; }
.ci strong { font-size: 16px; font-weight: 600; }
.ci small { font-size: 12.5px; color: var(--muted); }
.st { margin: auto 8px 8px; display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 12px; background: #fff; font-size: 12.5px; font-weight: 500; transition: all .4s; }
.st i { width: 8px; height: 8px; border-radius: 50%; background: var(--lav-i); flex: none; }
.st.stopped { background: var(--mint); color: var(--mint-i); }
.st.stopped i { background: var(--mint-i); }

/* flow */
.flow { border: 1px solid var(--line); border-radius: 28px; padding: 28px; display: flex; flex-direction: column; gap: 24px; justify-content: space-between; min-width: 0; background-image: radial-gradient(rgba(20, 18, 15, .08) 1px, transparent 1px); background-size: 18px 18px; }
.rail { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; padding-top: 6px; }
.line { position: absolute; left: 12%; right: 12%; top: 40px; height: 1.5px; background: var(--line); }
.line i { display: block; height: 100%; background: var(--ink); transition: width .7s ease; }
.node { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; opacity: .45; transition: opacity .4s; }
.node.done { opacity: 1; }
.node.cut { opacity: .3; }
.dd { font-size: 12px; font-weight: 600; color: var(--muted); }
.dot { width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 1.5px solid #cfd2d8; z-index: 1; transition: all .35s; }
.node.done .dot { background: var(--ink); border-color: var(--ink); }
.node.here .dot { transform: scale(1.25); }
.nc { width: 100%; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 8px; min-height: 118px; }
.nc em { align-self: flex-start; font-style: normal; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 6px; }
.nc.email em { background: var(--lav); color: var(--lav-i); }
.nc.whatsapp em { background: var(--mint); color: var(--mint-i); }
.nc.task em { background: var(--butter); color: var(--butter-i); }
.nc b { font-size: 13.5px; font-weight: 500; line-height: 1.45; }
.node.cut .nc { border-style: dashed; }
.node.cut .nc b { text-decoration: line-through; text-decoration-color: rgba(20, 18, 15, .35); }

.sw-enter-active, .sw-leave-active { transition: opacity .3s ease, transform .3s ease; }
.sw-enter-from { opacity: 0; transform: translateY(8px); }
.sw-leave-to { opacity: 0; transform: translateY(-6px); }

.ev { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-radius: 16px; background: #f6f7f9; font-size: 13.5px; color: var(--muted); background-color: #f6f7f9; transition: all .4s; }
.ev.on { background: var(--mint); color: var(--mint-i); }
.ev b { font-weight: 600; }

@media (max-width: 980px) {
  .stage { grid-template-columns: 1fr; }
  .ct { flex-direction: row; align-items: center; flex-wrap: wrap; }
  .ph { width: 140px; height: 140px; flex: none; }
  .ci { flex: 1; }
  .st { margin: 0 8px 4px; width: 100%; }
}
@media (max-width: 760px) {
  .rail { grid-template-columns: 1fr; gap: 12px; }
  .line { display: none; }
  .node { flex-direction: row; align-items: stretch; gap: 12px; }
  .dd { width: 48px; padding-top: 14px; flex: none; }
  .dot { display: none; }
  .nc { min-height: 0; }
}
@media (max-width: 640px) {
  .dr { padding: 64px 16px; }
  .flow { padding: 16px; border-radius: 22px; }
  .ct { border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .tabs, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
