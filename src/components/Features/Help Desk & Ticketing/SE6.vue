<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SupportConnectedSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const manualIdx = ref(-1);
const ok = ref([true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const custPhoto = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";
const techPhoto = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";

const actions = [
  { key: "job", label: "Create service job", tone: "sky" },
  { key: "claim", label: "Start warranty claim", tone: "mint" },
  { key: "up", label: "Create opportunity", tone: "lav" },
];

const idx = computed(() => {
  if (manualIdx.value >= 0) return manualIdx.value;
  return reduce ? 0 : Math.floor((n.value % 12) / 4);
});
const sub = computed(() => {
  if (manualIdx.value >= 0 || reduce) return 2;
  return n.value % 4;
});
const pressed = computed(() => sub.value === 0);
const created = computed(() => sub.value >= 1);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce || manualIdx.value >= 0) return;
  timer = setInterval(tick, 1300);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manualIdx.value = i;
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
  <section ref="root" class="sc" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Customer support software</span> <span class="l2">connected to sales and service</span></h2>
        <p>
          Because Saptivo's customer support software shares one database with sales and field service, a ticket can
          become a service job, a warranty claim or an upsell opportunity in one click.
        </p>
      </header>

      <div class="stage">
        <!-- ticket -->
        <div class="tk">
          <div class="top">
            <span class="av"><img v-if="ok[0]" :src="custPhoto" alt="" @error="ok[0] = false" /><b v-else>D</b></span>
            <div class="who">
              <strong>Dilani Perera</strong>
              <small>Ticket #4821 · Open</small>
            </div>
            <span class="rec">Customer record</span>
          </div>
          <p class="msg">My air conditioner is not cooling since yesterday. It is still under warranty, can someone visit?</p>
          <div class="facts">
            <span><small>Asset</small>Split AC · ACX-5521</span>
            <span><small>Warranty</small>Until Mar 2027</span>
            <span><small>Contract</small>No AMC</span>
          </div>
          <div class="acts">
            <button
              v-for="(a, i) in actions"
              :key="a.key"
              type="button"
              class="ab"
              :class="[a.tone, { on: idx === i, press: idx === i && pressed }]"
              @click="pick(i)"
            >
              {{ a.label }}
            </button>
          </div>
          <div class="db"><i></i>One database shared by support, sales and service</div>
        </div>

        <!-- connector -->
        <div class="link" aria-hidden="true">
          <svg viewBox="0 0 60 300" preserveAspectRatio="none">
            <path d="M0 150 C 30 150, 30 50, 60 50" :class="{ on: idx === 0 && created }" />
            <path d="M0 150 L 60 150" :class="{ on: idx === 1 && created }" />
            <path d="M0 150 C 30 150, 30 250, 60 250" :class="{ on: idx === 2 && created }" />
          </svg>
        </div>

        <!-- outcomes -->
        <div class="out">
          <div class="oc sky" :class="{ live: idx === 0 && created }">
            <div class="oh"><b>Field service</b><em v-if="idx === 0 && created">Linked to #4821</em></div>
            <template v-if="idx === 0 && created">
              <strong>Job SJ-2207 · AC not cooling</strong>
              <div class="ln">
                <span class="av sm"><img v-if="ok[1]" :src="techPhoto" alt="" @error="ok[1] = false" /><b v-else>N</b></span>
                <span>Nimali assigned</span>
                <span class="chip">Tomorrow 10:00</span>
              </div>
            </template>
            <span v-else class="idle">Service job</span>
          </div>

          <div class="oc mint" :class="{ live: idx === 1 && created }">
            <div class="oh"><b>Warranty</b><em v-if="idx === 1 && created">Linked to #4821</em></div>
            <template v-if="idx === 1 && created">
              <strong>Claim WC-310 · ACX-5521</strong>
              <div class="ln">
                <span>Covered until Mar 2027</span>
                <span class="chip">Sent to manufacturer</span>
              </div>
            </template>
            <span v-else class="idle">Warranty claim</span>
          </div>

          <div class="oc lav" :class="{ live: idx === 2 && created }">
            <div class="oh"><b>Sales</b><em v-if="idx === 2 && created">Linked to #4821</em></div>
            <template v-if="idx === 2 && created">
              <strong>AMC renewal opportunity</strong>
              <div class="ln">
                <span>LKR 85,000</span>
                <span class="chip">Proposal stage</span>
              </div>
            </template>
            <span v-else class="idle">Upsell opportunity</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sc {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 52px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.sc h2 .l1 { color: #111111 !important; opacity: 1; }
.sc h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .08s; }

.stage { display: grid; grid-template-columns: minmax(0, 1.15fr) 60px minmax(0, 1fr); align-items: stretch; }

/* ticket */
.tk { border: 1px solid var(--line); border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 16px; background: #fff; }
.top { display: flex; align-items: center; gap: 12px; }
.av { width: 42px; height: 42px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 13px; flex: none; }
.av.sm { width: 26px; height: 26px; font-size: 10.5px; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.who { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.who strong { font-size: 14.5px; }
.who small { font-size: 12px; color: var(--muted); }
.rec { font-size: 11.5px; font-weight: 600; color: var(--sky-i); background: var(--sky); padding: 4px 10px; border-radius: 6px; white-space: nowrap; }
.msg { margin: 0; font-size: 14px; line-height: 1.65; color: #3a3f47; }
.facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.facts span { background: #f6f7f9; border-radius: 12px; padding: 10px 12px; font-size: 12.5px; font-weight: 500; display: flex; flex-direction: column; gap: 2px; }
.facts small { font-size: 11px; color: var(--muted); font-weight: 400; }
.acts { display: flex; flex-wrap: wrap; gap: 8px; }
.ab { all: unset; cursor: pointer; font-size: 13px; font-weight: 500; padding: 10px 18px; border-radius: 99px; background: #f1f2f4; color: var(--ink); transition: background .3s, color .3s, transform .2s; }
.ab:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.ab.on { background: var(--ink); color: #fff; }
.ab.press { transform: scale(.96); }
.db { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); padding-top: 14px; border-top: 1px solid var(--line); margin-top: auto; }
.db i { width: 8px; height: 8px; border-radius: 2px; background: var(--ink); }

/* connector */
.link svg { width: 100%; height: 100%; min-height: 300px; display: block; }
.link path { fill: none; stroke: #d9dce1; stroke-width: 1.5; vector-effect: non-scaling-stroke; transition: stroke .4s; }
.link path.on { stroke: var(--ink); }

/* outcomes */
.out { display: flex; flex-direction: column; gap: 14px; }
.oc { flex: 1; border-radius: 20px; padding: 16px 20px; display: flex; flex-direction: column; gap: 8px; justify-content: center; min-height: 104px; opacity: .55; transition: opacity .4s, transform .4s; }
.oc.sky { background: var(--sky); }
.oc.mint { background: var(--mint); }
.oc.lav { background: var(--lav); }
.oc.live { opacity: 1; transform: translateX(4px); }
.oh { display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.oh b { font-weight: 600; }
.oh em { font-style: normal; text-transform: none; letter-spacing: 0; font-size: 11.5px; font-weight: 500; color: var(--ink); background: rgba(255, 255, 255, .75); padding: 2px 8px; border-radius: 6px; }
.oc strong { font-size: 14.5px; font-weight: 600; }
.ln { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 12.5px; color: #3a3f47; }
.chip { background: #fff; border-radius: 6px; padding: 3px 10px; font-weight: 500; font-size: 12px; }
.idle { font-size: 13.5px; color: var(--muted); }

@media (max-width: 900px) {
  .stage { grid-template-columns: 1fr; }
  .link { display: none; }
  .out { margin-top: 14px; }
}
@media (max-width: 640px) {
  .sc { padding: 64px 16px; }
  .tk { padding: 16px; border-radius: 22px; }
  .facts { grid-template-columns: 1fr; }
  .top { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
