<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "GrowingChainsSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const ok = ref([true, true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";

const who = [
  {
    n: "Retail chains",
    d: "Open store after store with the same products, prices and staff roles.",
    c: "2 to 200 stores",
    tone: "mint",
    photo: base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
  },
  {
    n: "Distributors",
    d: "Run depots and sales teams from one stock and customer base.",
    c: "Depots and routes",
    tone: "sky",
    photo: base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg",
  },
  {
    n: "Franchises",
    d: "Give every franchisee their own branch while head office keeps the overview.",
    c: "Owner and franchisee",
    tone: "lav",
    photo: base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
  },
];

const existing = ["Head office", "Colombo", "Galle", "Kandy"];
const staff = [
  { n: "Nimali", r: "Manager", tone: "mint" },
  { n: "Sachini", r: "Cashier", tone: "butter" },
  { n: "Hiran", r: "Sales", tone: "sky" },
];
const steps = [
  { t: "Add a branch", d: "Name it and pick its location." },
  { t: "Assign its staff", d: "Roles decide which screens they see." },
  { t: "It's live", d: "Stock, sales and reports start flowing." },
];

const count = computed(() => 4 + (step.value >= 3 ? 1 : 0));
const phase = computed(() => Math.min(step.value, 3));

function tick() {
  step.value = step.value >= 5 ? 0 : step.value + 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1600);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function replay() {
  stop();
  step.value = 0;
  start();
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    step.value = 3;
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
  <section ref="root" class="gc" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Built for growing retail chains,</span> <span class="l2">distributors and franchises</span></h2>
        <p>
          Whether you are opening your second store or managing a national network, Saptivo's multi-store management
          software scales without new setup costs. Add a branch, assign its staff and it's live.
        </p>
      </header>

      <!-- who -->
      <ul class="who">
        <li v-for="(w, i) in who" :key="w.n" :class="'tone-' + w.tone">
          <div class="ph">
            <img v-if="ok[i]" :src="w.photo" alt="" @error="ok[i] = false" />
            <b v-else>{{ w.n[0] }}</b>
            <span class="chip">{{ w.c }}</span>
          </div>
          <strong>{{ w.n }}</strong>
          <p>{{ w.d }}</p>
        </li>
      </ul>

      <!-- add a branch -->
      <div class="grow" role="img" aria-label="Adding a branch, assigning its staff and going live">
        <div class="gl">
          <div class="gh">
            <strong>Add a branch, it's live</strong>
            <span class="free">No new setup costs</span>
          </div>

          <ol class="steps">
            <li v-for="(s, i) in steps" :key="s.t" :class="{ done: phase > i + 1 || (phase === 3 && i === 2), act: phase === i + 1 }">
              <span class="dot">
                <svg v-if="phase > i + 1 || (phase === 3 && i === 2)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                <template v-else>{{ i + 1 }}</template>
              </span>
              <span class="tx"><b>{{ s.t }}</b><small>{{ s.d }}</small></span>
            </li>
          </ol>

          <button type="button" class="replay" @click="replay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /></svg>
            Replay
          </button>
        </div>

        <div class="gr">
          <div class="net">
            <div class="nh"><strong>Your network</strong><span class="cnt"><b>{{ count }}</b> locations</span></div>
            <div class="tiles">
              <div v-for="e in existing" :key="e" class="tile live">
                <i></i><b>{{ e }}</b><small>Live</small>
              </div>

              <div class="tile nw" :class="{ ghost: phase === 0, build: phase === 1 || phase === 2, live: phase === 3 }">
                <i></i>
                <b>Matara</b>
                <small v-if="phase === 0">+ New branch</small>
                <small v-else-if="phase === 1">Setting up</small>
                <small v-else-if="phase === 2">Adding staff</small>
                <small v-else>Live</small>
              </div>
            </div>
          </div>

          <div class="stf">
            <div class="nh"><strong>Matara staff</strong><span>Roles assigned</span></div>
            <TransitionGroup name="st" tag="ul" class="sl">
              <li v-for="(s, i) in staff" v-show="phase >= 2" :key="s.n" :class="'tone-' + s.tone" :style="{ transitionDelay: i * 120 + 'ms' }">
                <span class="av">{{ s.n[0] }}</span>
                <b>{{ s.n }}</b>
                <em>{{ s.r }}</em>
              </li>
            </TransitionGroup>
            <p v-if="phase < 2" class="empty">No staff yet</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gc {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 44px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.gc h2 .l1 { color: #111111 !important; opacity: 1; }
.gc h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .who, .grow { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .who, .in .grow { opacity: 1; transform: none; }
.in .who { transition-delay: .1s; }
.in .grow { transition-delay: .2s; }

.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }

/* who */
.who { list-style: none; margin: 0 0 20px; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.who li { background: #faf9ff; border: 1px solid var(--line); border-radius: 28px; padding: 12px 12px 22px; display: flex; flex-direction: column; gap: 6px; transition: transform .35s, box-shadow .35s; }
.who li:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(60, 50, 120, .12); }
.ph { position: relative; height: 200px; border-radius: 20px; overflow: hidden; background: var(--t); color: var(--ti); display: grid; place-items: center; font-size: 42px; margin-bottom: 10px; }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.chip { position: absolute; left: 12px; bottom: 12px; font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 99px; background: rgba(255, 255, 255, .94); color: var(--ti); }
.who strong { font-size: 17px; padding: 0 10px; }
.who p { margin: 0; padding: 0 10px; font-size: 13.5px; line-height: 1.65; color: var(--muted); }

/* grow */
.grow { display: grid; grid-template-columns: 1fr 1.35fr; gap: 16px; background: #fff; border: 1px solid var(--line); border-radius: 32px; padding: 20px; box-shadow: 0 28px 70px rgba(60, 50, 120, .12); }
.gl { background: #1d1a24; color: #f4eef7; border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 18px; }
.gh { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.gh strong { font-size: 16px; }
.free { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; background: var(--mint); color: var(--mint-i); }
.steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; flex: 1; }
.steps li { display: flex; align-items: center; gap: 14px; opacity: .45; transition: opacity .4s; }
.steps li.act, .steps li.done { opacity: 1; }
.dot { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; background: #342f40; flex: none; transition: all .4s; }
.dot svg { width: 16px; height: 16px; }
.steps li.act .dot { background: var(--lav-i); box-shadow: 0 0 0 6px rgba(125, 107, 230, .25); }
.steps li.done .dot { background: var(--mint-i); }
.tx { display: flex; flex-direction: column; }
.tx b { font-size: 14px; }
.tx small { font-size: 12px; color: #a79fb4; }
.replay { all: unset; box-sizing: border-box; cursor: pointer; align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 8px 16px; border-radius: 99px; background: #fff; color: var(--ink); }
.replay:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.replay svg { width: 14px; height: 14px; }

.gr { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.net, .stf { background: #faf9ff; border: 1px solid var(--line); border-radius: 24px; padding: 16px; }
.nh { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 12px; }
.nh strong { font-size: 14.5px; }
.nh span { font-size: 12px; color: var(--muted); }
.cnt b { color: var(--ink); font-size: 18px; }
.tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 10px; }
.tile { position: relative; background: #fff; border: 1.5px solid var(--line); border-radius: 18px; padding: 12px; display: flex; flex-direction: column; gap: 2px; transition: all .5s ease; }
.tile i { position: absolute; top: 12px; right: 12px; width: 8px; height: 8px; border-radius: 50%; background: #d3cfe0; transition: background .4s; }
.tile b { font-size: 13px; }
.tile small { font-size: 11.5px; color: var(--muted); }
.tile.live i { background: var(--mint-i); }
.tile.live small { color: var(--mint-i); font-weight: 600; }
.tile.nw.ghost { border-style: dashed; border-color: #c9c3e6; background: transparent; color: #a79fb4; }
.tile.nw.build { border-color: var(--lav-i); background: #f6f4ff; }
.tile.nw.build i { background: var(--lav-i); animation: beat 1s infinite; }
.tile.nw.live { border-color: var(--mint-i); background: #f2fbf6; transform: scale(1.04); }
@keyframes beat { 50% { opacity: .25; } }

.sl { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; min-height: 0; }
.sl li { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; padding: 8px 12px; border-radius: 14px; background: #fff; border: 1px solid var(--line); transition: all .45s ease; }
.av { width: 30px; height: 30px; border-radius: 50%; background: var(--t); color: var(--ti); display: grid; place-items: center; font-weight: 700; font-size: 13px; }
.sl b { font-size: 13px; }
.sl em { font-style: normal; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 99px; background: var(--t); color: var(--ti); }
.st-enter-from, .st-leave-to { opacity: 0; transform: translateX(-12px); }
.empty { margin: 4px 0 0; font-size: 12px; color: #aaa6b8; }

@media (max-width: 960px) {
  .who { grid-template-columns: 1fr; }
  .ph { height: 220px; }
  .grow { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .gc { padding: 64px 16px; }
  .grow { padding: 12px; border-radius: 26px; }
  .tiles { grid-template-columns: repeat(2, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .head, .who, .grow { opacity: 1; transform: none; transition: none; }
  .tile.nw.build i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
