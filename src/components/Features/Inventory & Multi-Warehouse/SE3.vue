<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "BranchTransfersSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const avOk = ref(true);
let timer = null;
let io = null;
let reduce = false;

const photo = "/saptivo/images/features/smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";

const old = [
  { id: "a", who: "Sachini", tone: "butter", what: "HEPA filter", q: 40, from: "Head office", to: "Colombo", when: "Yesterday 16:20" },
  { id: "b", who: "Chaminda", tone: "sky", what: "Compressor kit", q: 4, from: "Colombo", to: "Van 07", when: "Yesterday 09:05" },
  { id: "c", who: "Nimali", tone: "mint", what: "Remote controller", q: 20, from: "Head office", to: "Kandy", when: "Mon 14:32" },
];
const fresh = { id: "n", who: "Nimali", tone: "mint", what: "Air purifier X2", q: 30, from: "Head office", to: "Galle", when: "Today 10:42", fresh: true };

const moved = computed(() => step.value >= 4);
const ho = computed(() => (moved.value ? 90 : 120));
const gl = computed(() => (moved.value ? 44 : 14));
const rows = computed(() => (step.value >= 5 ? [fresh, ...old] : old));
const btn = computed(() => (step.value >= 4 ? "Transfer recorded" : step.value === 3 ? "Recording…" : "Move stock"));

function tick() {
  step.value = step.value >= 9 ? 0 : step.value + 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1250);
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
    step.value = 6;
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
  <section ref="root" class="bt" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Recorded</span> <span class="l2">branch transfers</span></h2>
        <p>
          Move stock between locations with a few clicks. Every transfer is recorded with who moved what, from where
          and when, keeping your stock counts and audit trail accurate.
        </p>
      </header>

      <div class="board" role="img" aria-label="A stock transfer being created, and the recorded transfer history with who, what, from where and when">
        <!-- composer -->
        <div class="comp">
          <div class="ct"><strong>New transfer</strong><button type="button" class="replay" @click="replay">Replay</button></div>

          <div class="locs">
            <div class="loc from" :class="{ ch: moved }">
              <small>From</small>
              <strong>Head office</strong>
              <div class="cn"><b>{{ ho }}</b><span>Air purifier X2</span></div>
            </div>

            <div class="track" aria-hidden="true">
              <i class="ln"></i>
              <span v-if="step === 4" class="pk"></span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </div>

            <div class="loc to" :class="{ ch: moved }">
              <small>To</small>
              <strong>Galle branch</strong>
              <div class="cn"><b>{{ gl }}</b><span>Air purifier X2</span></div>
            </div>
          </div>

          <div class="form">
            <div class="fl">
              <label>Item</label>
              <div class="inp" :class="{ fil: step >= 1 }">{{ step >= 1 ? "Air purifier X2" : "Choose an item" }}</div>
            </div>
            <div class="fl q">
              <label>Quantity</label>
              <div class="inp" :class="{ fil: step >= 2 }">{{ step >= 2 ? "30" : "0" }}</div>
            </div>
            <div class="fl w">
              <label>Moved by</label>
              <div class="inp fil who">
                <span class="av">
                  <img v-if="avOk" :src="photo" alt="" @error="avOk = false" />
                  <b v-else>N</b>
                </span>
                Nimali · Branch manager
              </div>
            </div>
          </div>

          <div class="cta" :class="{ busy: step === 3, done: step >= 4 }">
            <svg v-if="step >= 4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
            {{ btn }}
          </div>
        </div>

        <!-- ledger -->
        <div class="led">
          <div class="lh">
            <strong>Transfer history</strong>
            <span>Who · What · From · When</span>
          </div>
          <TransitionGroup name="rw" tag="ul" class="rows">
            <li v-for="r in rows" :key="r.id" :class="{ new: r.fresh }">
              <span class="av" :class="'tone-' + r.tone">
                <img v-if="r.who === 'Nimali' && avOk" :src="photo" alt="" @error="avOk = false" />
                <b v-else>{{ r.who[0] }}</b>
              </span>
              <div class="m">
                <div class="l1r"><strong>{{ r.who }}</strong> moved <b>{{ r.q }} × {{ r.what }}</b></div>
                <div class="l2r"><span>{{ r.from }}</span><i>→</i><span>{{ r.to }}</span></div>
              </div>
              <time>{{ r.when }}</time>
              <em v-if="r.fresh">Just now</em>
            </li>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bt {
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
.head { text-align: center; max-width: 760px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.bt h2 .l1 { color: #111111 !important; opacity: 1; }
.bt h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .board { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .1s; }

.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }

.board { display: grid; grid-template-columns: 1fr 1.1fr; gap: 20px; align-items: stretch; }

/* composer */
.comp { background: #faf9ff; border: 1px solid var(--line); border-radius: 32px; padding: 24px; display: flex; flex-direction: column; gap: 18px; box-shadow: 0 28px 70px rgba(60, 50, 120, .1); min-width: 0; }
.ct { display: flex; align-items: center; justify-content: space-between; }
.ct strong { font-size: 16px; }
.replay { all: unset; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--muted); padding: 6px 14px; border-radius: 99px; border: 1px solid var(--line); background: #fff; }
.replay:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.locs { display: grid; grid-template-columns: 1fr 52px 1fr; align-items: center; gap: 6px; }
.loc { background: #fff; border: 1.5px solid var(--line); border-radius: 22px; padding: 14px 16px; transition: border-color .5s, background .5s; }
.loc small { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.loc strong { display: block; font-size: 15px; margin-top: 2px; }
.cn { display: flex; align-items: baseline; gap: 8px; margin-top: 10px; }
.cn b { font-size: 34px; font-weight: 600; letter-spacing: -.03em; font-variant-numeric: tabular-nums; line-height: 1; transition: color .4s; }
.cn span { font-size: 11.5px; color: var(--muted); }
.loc.from.ch { border-color: var(--butter-i); background: #fffaea; }
.loc.from.ch b { color: var(--butter-i); }
.loc.to.ch { border-color: var(--mint-i); background: #f2fbf6; }
.loc.to.ch b { color: var(--mint-i); }

.track { position: relative; height: 40px; display: grid; place-items: center; color: var(--lav-i); }
.track svg { width: 22px; height: 22px; position: relative; z-index: 1; background: #faf9ff; }
.ln { position: absolute; left: 0; right: 0; top: 50%; border-top: 2px dashed #cfc9ec; }
.pk { position: absolute; top: 50%; left: 0; width: 18px; height: 18px; margin-top: -9px; border-radius: 5px; background: var(--ink); z-index: 2; animation: fly 1s cubic-bezier(.5, 0, .3, 1) forwards; }
@keyframes fly { 0% { left: -8px; opacity: 1; } 80% { opacity: 1; } 100% { left: calc(100% - 10px); opacity: 0; } }

.form { display: grid; grid-template-columns: 1.4fr .6fr; gap: 12px; }
.fl label { display: block; font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 5px; }
.fl.w { grid-column: 1 / -1; }
.inp { padding: 11px 14px; border-radius: 14px; border: 1px solid var(--line); background: #fff; font-size: 13.5px; color: #a29fb2; transition: all .35s; min-height: 44px; display: flex; align-items: center; gap: 10px; }
.inp.fil { color: var(--ink); font-weight: 600; border-color: #d8d2f4; }
.inp.who { font-weight: 500; font-size: 13px; }
.av { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; background: var(--t, var(--mint)); color: var(--ti, var(--mint-i)); display: grid; place-items: center; font-weight: 700; font-size: 12px; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.cta { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-radius: 99px; background: var(--ink); color: #fff; font-size: 14px; font-weight: 600; transition: all .4s; }
.cta svg { width: 16px; height: 16px; }
.cta.busy { background: var(--lav-i); }
.cta.done { background: var(--mint-i); }

/* ledger */
.led { background: #fff; border: 1px solid var(--line); border-radius: 32px; padding: 22px 22px 14px; min-width: 0; }
.lh { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
.lh strong { font-size: 16px; }
.lh span { font-size: 11.5px; color: var(--muted); }
.rows { list-style: none; margin: 0; padding: 0; position: relative; }
.rows li { position: relative; display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 14px 8px; border-bottom: 1px solid #f1eff8; transition: background .5s; border-radius: 14px; }
.rows li:last-child { border-bottom: 0; }
.rows li.new { background: #f2fbf6; }
.m { min-width: 0; }
.l1r { font-size: 13.5px; line-height: 1.45; }
.l1r b { font-weight: 600; }
.l1r strong { font-weight: 600; }
.l2r { display: flex; align-items: center; gap: 8px; margin-top: 4px; font-size: 12px; color: var(--muted); }
.l2r span { padding: 2px 10px; border-radius: 99px; background: #f1eff8; font-weight: 600; font-size: 11px; color: var(--ink); }
.l2r i { font-style: normal; color: var(--lav-i); font-weight: 700; }
.rows li time { font-size: 11.5px; color: var(--muted); white-space: nowrap; text-align: right; }
.rows li em { position: absolute; top: 8px; right: 10px; font-style: normal; font-size: 10px; font-weight: 700; padding: 2px 9px; border-radius: 99px; background: var(--mint-i); color: #fff; }
.rows li.new time { margin-top: 18px; }
.rw-enter-active { transition: all .6s cubic-bezier(.3, .8, .3, 1); }
.rw-leave-active { transition: all .3s ease; position: absolute; left: 0; right: 0; }
.rw-enter-from { opacity: 0; transform: translateY(-18px); }
.rw-leave-to { opacity: 0; }
.rw-move { transition: transform .5s ease; }

@media (max-width: 900px) {
  .board { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .bt { padding: 64px 16px; }
  .comp, .led { padding: 18px; border-radius: 26px; }
  .locs { grid-template-columns: 1fr; }
  .track { height: 28px; transform: rotate(90deg); }
  .rows li { grid-template-columns: auto 1fr; }
  .rows li time { grid-column: 2; text-align: left; }
  .rows li.new time { margin-top: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .pk { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
