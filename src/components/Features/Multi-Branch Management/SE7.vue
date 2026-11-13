<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "MultiBranchSetupSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
const manual = ref(false);
const ok = ref([true, true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";

const steps = [
  { t: "Create each branch with its name, address and invoice details", tone: "lav" },
  { t: "Assign managers and staff to their branches with the right roles", tone: "mint" },
  { t: "Set up stock locations for each branch and warehouse", tone: "butter" },
  { t: "Choose which customers and reports are shared and which stay local", tone: "sky" },
  { t: "Watch every branch go live on your HQ dashboard", tone: "mint" },
];
const titles = ["New branch", "Branch staff", "Stock locations", "Sharing rules", "HQ dashboard"];

const fields = [
  { l: "Branch name", v: "Galle" },
  { l: "Address", v: "45 Main Street, Galle" },
  { l: "Invoice details", v: "Prefix GL- · VAT 114 482 903" },
];
const staff = [
  { n: "Nimali", r: "Branch manager", tone: "mint", photo: base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg" },
  { n: "Sachini", r: "Cashier", tone: "butter", photo: base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg" },
  { n: "Hiran", r: "Sales staff", tone: "sky", photo: base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg" },
];
const stock = [
  { n: "Galle shop floor", t: "Branch", q: "Selling stock" },
  { n: "Galle back store", t: "Branch", q: "Storage" },
  { n: "Head office warehouse", t: "Warehouse", q: "Main store" },
];
const share = [
  { n: "Customers", s: true },
  { n: "Price lists", s: true },
  { n: "Sales reports", s: false },
  { n: "Cash drawer", s: false },
];
const hq = [
  { n: "Colombo", s: "Live", fresh: false },
  { n: "Kandy", s: "Live", fresh: false },
  { n: "Matara", s: "Live", fresh: false },
  { n: "Galle", s: "Just went live", fresh: true },
];

function next() {
  idx.value = (idx.value + 1) % steps.length;
}
function pick(i) {
  manual.value = true;
  stop();
  idx.value = i;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 3400);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    idx.value = 4;
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
  <section ref="root" class="ms" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">How multi-branch</span> <span class="l2">setup works</span></h2>
      </header>

      <div class="board">
        <ol class="steps" role="tablist">
          <li v-for="(s, i) in steps" :key="s.t" :class="['tone-' + s.tone, { act: idx === i, done: idx > i, run: idx === i && !manual }]">
            <button type="button" role="tab" :aria-selected="idx === i" @click="pick(i)">
              <span class="n">
                <svg v-if="idx > i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                <template v-else>{{ i + 1 }}</template>
              </span>
              <span class="tx">{{ s.t }}</span>
              <span class="prog"><i></i></span>
            </button>
          </li>
        </ol>

        <div class="app" role="img" aria-label="Setup screens for creating a branch, assigning staff, stock locations, sharing rules and the HQ dashboard">
          <div class="bar">
            <i></i><i></i><i></i>
            <span class="ttl">{{ titles[idx] }}</span>
            <span class="of">Step {{ idx + 1 }} of {{ steps.length }}</span>
          </div>

          <Transition name="pn" mode="out-in">
            <div v-if="idx === 0" key="0" class="pn">
              <div v-for="(f, i) in fields" :key="f.l" class="fld" :style="{ '--i': i }">
                <label>{{ f.l }}</label>
                <div class="inp">{{ f.v }}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg></div>
              </div>
              <button type="button" class="cta" :style="{ '--i': 3 }" tabindex="-1">Create branch</button>
            </div>

            <div v-else-if="idx === 1" key="1" class="pn">
              <div v-for="(s, i) in staff" :key="s.n" class="row" :class="'tone-' + s.tone" :style="{ '--i': i }">
                <span class="av">
                  <img v-if="ok[i]" :src="s.photo" alt="" @error="ok[i] = false" />
                  <b v-else>{{ s.n[0] }}</b>
                </span>
                <strong>{{ s.n }}</strong>
                <span class="role">{{ s.r }}</span>
                <span class="br">Galle</span>
              </div>
            </div>

            <div v-else-if="idx === 2" key="2" class="pn">
              <div v-for="(s, i) in stock" :key="s.n" class="row loc" :style="{ '--i': i }">
                <span class="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10" /></svg>
                </span>
                <span class="lt"><strong>{{ s.n }}</strong><small>{{ s.t }} · {{ s.q }}</small></span>
                <span class="on">Active</span>
              </div>
            </div>

            <div v-else-if="idx === 3" key="3" class="pn">
              <div v-for="(s, i) in share" :key="s.n" class="row sh" :style="{ '--i': i }">
                <strong>{{ s.n }}</strong>
                <span class="tg" :class="s.s ? 'sh-on' : 'sh-off'">{{ s.s ? "Shared with all branches" : "Stays local" }}</span>
                <span class="sw" :class="{ on: s.s }"><i></i></span>
              </div>
            </div>

            <div v-else key="4" class="pn">
              <div class="tiles">
                <div v-for="(b, i) in hq" :key="b.n" class="tile" :class="{ fresh: b.fresh }" :style="{ '--i': i }">
                  <i></i>
                  <b>{{ b.n }}</b>
                  <small>{{ b.s }}</small>
                </div>
              </div>
              <div class="sum" :style="{ '--i': 4 }"><b>4</b> branches live · all reporting to head office</div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ms {
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
.head { text-align: center; max-width: 780px; margin: 0 auto 44px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ms h2 .l1 { color: #111111 !important; opacity: 1; }
.ms h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.head, .board { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .1s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }

.board { display: grid; grid-template-columns: 1fr 1.05fr; gap: 24px; align-items: stretch; }

/* steps */
.steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.steps li { flex: 1; }
.steps button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; height: 100%; display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 22px; border: 1px solid var(--line); background: #fff; position: relative; overflow: hidden; transition: all .35s; }
.steps button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.steps li.act button { background: var(--tb); border-color: var(--ti); transform: translateX(6px); }
.n { width: 38px; height: 38px; border-radius: 50%; background: #f1eff8; color: var(--muted); display: grid; place-items: center; font-weight: 700; font-size: 14px; flex: none; transition: all .35s; }
.n svg { width: 17px; height: 17px; }
.steps li.act .n { background: var(--ti); color: #fff; }
.steps li.done .n { background: var(--mint); color: var(--mint-i); }
.tx { font-size: 14.5px; line-height: 1.55; font-weight: 500; }
.prog { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; }
.prog i { display: block; width: 0; height: 100%; background: var(--ink); }
.steps li.act:not(.run) .prog i { width: 100%; }
.steps li.act.run .prog i { animation: fill 3.4s linear forwards; }
@keyframes fill { to { width: 100%; } }

/* app */
.app { background: #fff; border: 1px solid var(--line); border-radius: 28px; box-shadow: 0 28px 70px rgba(60, 50, 120, .14); overflow: hidden; display: flex; flex-direction: column; min-width: 0; }
.bar { display: flex; align-items: center; gap: 6px; padding: 12px 18px; background: #faf9ff; border-bottom: 1px solid var(--line); }
.bar > i { width: 10px; height: 10px; border-radius: 50%; background: #e3e0ee; }
.ttl { margin-left: 12px; font-size: 13px; font-weight: 600; }
.of { margin-left: auto; font-size: 11.5px; color: var(--muted); }

.pn { padding: 22px; display: flex; flex-direction: column; gap: 12px; flex: 1; min-height: 380px; }
.pn > * { animation: up .5s ease both; animation-delay: calc(var(--i, 0) * 110ms); }
@keyframes up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.pn-enter-active, .pn-leave-active { transition: opacity .25s ease; }
.pn-enter-from, .pn-leave-to { opacity: 0; }

.fld label { display: block; font-size: 11.5px; font-weight: 600; color: var(--muted); margin-bottom: 6px; }
.inp { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 16px; border-radius: 14px; border: 1px solid var(--line); background: #faf9ff; font-size: 14px; font-weight: 500; }
.inp svg { width: 16px; height: 16px; color: var(--mint-i); flex: none; }
.cta { all: unset; box-sizing: border-box; align-self: flex-start; margin-top: 8px; font-size: 13px; font-weight: 600; padding: 11px 22px; border-radius: 99px; background: var(--ink); color: #fff; }

.row { display: grid; grid-template-columns: auto 1fr auto auto; gap: 14px; align-items: center; padding: 12px 14px; border-radius: 18px; background: #f8f7fc; border: 1px solid var(--line); }
.av { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; background: var(--t); color: var(--ti); display: grid; place-items: center; font-weight: 700; border: 3px solid #fff; box-sizing: border-box; box-shadow: 0 0 0 1px var(--line); }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.row strong { font-size: 14px; }
.role { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; background: var(--t); color: var(--ti); }
.br { font-size: 11px; font-weight: 600; color: var(--muted); }

.row.loc { grid-template-columns: auto 1fr auto; }
.ic { width: 42px; height: 42px; border-radius: 14px; background: var(--butter); color: var(--butter-i); display: grid; place-items: center; }
.ic svg { width: 22px; height: 22px; }
.lt { display: flex; flex-direction: column; }
.lt small { font-size: 12px; color: var(--muted); }
.on { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; background: var(--mint); color: var(--mint-i); }

.row.sh { grid-template-columns: 1fr auto auto; }
.tg { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; }
.sh-on { background: var(--sky); color: var(--sky-i); }
.sh-off { background: var(--butter); color: var(--butter-i); }
.sw { width: 40px; height: 22px; border-radius: 99px; background: #d9d5e6; position: relative; }
.sw i { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .3s; }
.sw.on { background: var(--sky-i); }
.sw.on i { transform: translateX(18px); }

.tiles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.tile { position: relative; padding: 16px; border-radius: 20px; background: #f2fbf6; border: 1.5px solid var(--mint); display: flex; flex-direction: column; gap: 2px; }
.tile i { position: absolute; top: 16px; right: 16px; width: 9px; height: 9px; border-radius: 50%; background: var(--mint-i); }
.tile b { font-size: 15px; }
.tile small { font-size: 12px; color: var(--mint-i); font-weight: 600; }
.tile.fresh { background: var(--lav); border-color: var(--lav-i); }
.tile.fresh i { background: var(--lav-i); animation: beat 1.6s infinite; }
.tile.fresh small { color: var(--lav-i); }
@keyframes beat { 0% { box-shadow: 0 0 0 0 rgba(125, 107, 230, .5); } 70% { box-shadow: 0 0 0 9px rgba(125, 107, 230, 0); } 100% { box-shadow: 0 0 0 0 rgba(125, 107, 230, 0); } }
.sum { margin-top: auto; padding: 14px 16px; border-radius: 18px; background: #1d1a24; color: #f4eef7; font-size: 13px; }
.sum b { font-size: 20px; margin-right: 4px; color: #7fe0b0; }

@media (max-width: 960px) {
  .board { grid-template-columns: 1fr; }
  .steps li.act button { transform: none; }
  .pn { min-height: 0; }
}
@media (max-width: 640px) {
  .ms { padding: 64px 16px; }
  .steps button { padding: 14px; gap: 12px; }
  .tx { font-size: 13.5px; }
  .row { grid-template-columns: auto 1fr auto; }
  .br { display: none; }
  .row.sh { grid-template-columns: 1fr auto; }
  .row.sh .tg { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .steps li.act.run .prog i { animation: none; width: 100%; }
  .pn > *, .tile.fresh i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
