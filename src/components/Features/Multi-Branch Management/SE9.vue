<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "CommonProblemsSection" });

const root = ref(null);
const shown = ref(false);
const on = ref(false);
const manual = ref(false);
const ok = ref([true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photos = [
  base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
  base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
];

const problems = [
  "Each branch keeps its own customer list, so customers are duplicated",
  "Stock is available in one branch but out of stock in another",
  "Head office waits days for sales figures",
  "Staff access to sensitive data is hard to control",
];
const fixes = ["One shared database", "Live stock sync", "Real-time reporting", "Branch-level permissions"];

function flip() {
  on.value = !on.value;
}
function toggle(v) {
  manual.value = true;
  stop();
  on.value = v;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(flip, 3800);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    on.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.25 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="cp" :class="{ in: shown, solved: on }">
    <div class="wrap">
      <header class="head">
        <span class="eyebrow">The problem</span>
        <h2><span class="l1">Common problems</span> <span class="l2">multi-branch businesses face</span></h2>
      </header>

      <div class="sw" role="tablist">
        <button type="button" role="tab" :aria-selected="!on" :class="{ act: !on }" @click="toggle(false)">Without Saptivo</button>
        <button type="button" role="tab" :aria-selected="on" :class="{ act: on }" @click="toggle(true)">With Saptivo</button>
        <span class="thumb" :class="{ r: on }"></span>
      </div>

      <div class="grid" role="img" aria-label="Four common multi-branch problems and how Saptivo resolves each one">
        <!-- 1 -->
        <article class="c" :class="on ? 'good' : 'bad'">
          <span class="num">1</span>
          <h3>{{ problems[0] }}</h3>
          <div class="vis">
            <Transition name="sw" mode="out-in">
              <div v-if="!on" key="a" class="dups">
                <span><small>Colombo</small>Dilani Perera</span>
                <span><small>Galle</small>Dilani P.</span>
                <span><small>Kandy</small>D. Perera</span>
                <em>3 records, 1 customer</em>
              </div>
              <div v-else key="b" class="one">
                <span class="av">
                  <img v-if="ok[0]" :src="photos[0]" alt="" @error="ok[0] = false" />
                  <b v-else>D</b>
                </span>
                <div><strong>Dilani Perera</strong><small>1 record · all branches</small></div>
              </div>
            </Transition>
          </div>
        </article>

        <!-- 2 -->
        <article class="c" :class="on ? 'good' : 'bad'">
          <span class="num">2</span>
          <h3>{{ problems[1] }}</h3>
          <div class="vis">
            <Transition name="sw" mode="out-in">
              <div v-if="!on" key="a" class="stk">
                <div class="bx out"><small>Colombo</small><b>0</b><em>Out of stock</em></div>
                <div class="bx hi"><small>Galle</small><b>24</b><em>Sitting idle</em></div>
              </div>
              <div v-else key="b" class="stk">
                <div class="bx okb"><small>Colombo</small><b>12</b><em>Transferred in</em></div>
                <div class="arr">⇄</div>
                <div class="bx okb"><small>Galle</small><b>12</b><em>In sync</em></div>
              </div>
            </Transition>
          </div>
        </article>

        <!-- 3 -->
        <article class="c" :class="on ? 'good' : 'bad'">
          <span class="num">3</span>
          <h3>{{ problems[2] }}</h3>
          <div class="vis">
            <Transition name="sw" mode="out-in">
              <div v-if="!on" key="a" class="wait">
                <span class="clk">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                </span>
                <div><strong>Sales figures</strong><small>Waiting for branches · 3 days</small></div>
              </div>
              <div v-else key="b" class="wait live">
                <span class="av">
                  <img v-if="ok[1]" :src="photos[1]" alt="" @error="ok[1] = false" />
                  <b v-else>H</b>
                </span>
                <div><strong>LKR 1.28M today</strong><small><i></i>Live from every branch</small></div>
              </div>
            </Transition>
          </div>
        </article>

        <!-- 4 -->
        <article class="c" :class="on ? 'good' : 'bad'">
          <span class="num">4</span>
          <h3>{{ problems[3] }}</h3>
          <div class="vis">
            <Transition name="sw" mode="out-in">
              <div v-if="!on" key="a" class="acc">
                <span class="who">Cashier can open</span>
                <span class="pl open">Customers</span>
                <span class="pl open">Reports</span>
                <span class="pl open">Audit log</span>
              </div>
              <div v-else key="b" class="acc">
                <span class="who">Cashier can open</span>
                <span class="pl open">Customers</span>
                <span class="pl lock">Reports
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                </span>
                <span class="pl lock">Audit log
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                </span>
              </div>
            </Transition>
          </div>
        </article>
      </div>

      <div class="fix">
        <ul>
          <li v-for="(f, i) in fixes" :key="f" :class="{ lit: on }" :style="{ transitionDelay: on ? i * 120 + 'ms' : '0ms' }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
            {{ f }}
          </li>
        </ul>
        <p>Saptivo solves each of these with one shared database, live stock sync, real-time reporting and branch-level permissions.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cp {
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
.head { text-align: center; max-width: 780px; margin: 0 auto 28px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--rose); color: var(--rose-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; transition: all .4s; }
.solved .eyebrow { background: var(--mint); color: var(--mint-i); }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.cp h2 .l1 { color: #111111 !important; opacity: 1; }
.cp h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.head, .sw, .grid, .fix { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .sw, .in .grid, .in .fix { opacity: 1; transform: none; }
.in .sw { transition-delay: .05s; }
.in .grid { transition-delay: .12s; }
.in .fix { transition-delay: .2s; }

/* switch */
.sw { position: relative; display: flex; width: max-content; margin: 0 auto 28px; padding: 5px; border-radius: 99px; background: #f1eff8; }
.sw button { all: unset; cursor: pointer; position: relative; z-index: 1; padding: 10px 22px; font-size: 13.5px; font-weight: 600; color: var(--muted); border-radius: 99px; transition: color .3s; }
.sw button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.sw button.act { color: #fff; }
.thumb { position: absolute; top: 5px; bottom: 5px; left: 5px; width: calc(50% - 5px); border-radius: 99px; background: var(--rose-i); transition: transform .4s cubic-bezier(.3, .8, .3, 1), background .4s; }
.thumb.r { transform: translateX(100%); background: var(--mint-i); }

/* cards */
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.c { position: relative; border-radius: 28px; padding: 24px; display: flex; flex-direction: column; gap: 16px; border: 1.5px solid transparent; transition: background .5s, border-color .5s; }
.c.bad { background: #fff6f8; border-color: var(--rose); }
.c.good { background: #f2fbf6; border-color: var(--mint); }
.num { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; background: var(--rose); color: var(--rose-i); transition: all .4s; }
.good .num { background: var(--mint); color: var(--mint-i); }
.c h3 { margin: 0; font-size: 16.5px; font-weight: 600; line-height: 1.5; max-width: 90%; }
.vis { min-height: 112px; display: flex; align-items: center; }
.vis > div { width: 100%; }
.sw-enter-active, .sw-leave-active { transition: all .3s ease; }
.sw-enter-from { opacity: 0; transform: translateY(8px); }
.sw-leave-to { opacity: 0; transform: translateY(-8px); }

.dups { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.dups span { display: flex; flex-direction: column; font-size: 12.5px; font-weight: 600; padding: 8px 14px; border-radius: 14px; background: #fff; border: 1px dashed var(--rose-i); }
.dups small { font-size: 10.5px; color: var(--rose-i); }
.dups em { font-style: normal; font-size: 12px; font-weight: 700; color: var(--rose-i); width: 100%; }
.one, .wait { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 18px; background: #fff; border: 1px solid var(--mint); }
.one strong, .wait strong { display: block; font-size: 14.5px; }
.one small, .wait small { font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 6px; }
.av { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-weight: 700; flex: none; border: 3px solid #fff; box-sizing: border-box; box-shadow: 0 0 0 1px var(--line); }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.stk { display: flex; align-items: center; gap: 12px; }
.bx { flex: 1; display: flex; flex-direction: column; padding: 12px 16px; border-radius: 18px; background: #fff; border: 1.5px solid var(--line); }
.bx small { font-size: 11.5px; color: var(--muted); }
.bx b { font-size: 26px; font-weight: 600; line-height: 1.2; }
.bx em { font-style: normal; font-size: 11.5px; font-weight: 700; }
.bx.out { border-color: var(--rose-i); } .bx.out b, .bx.out em { color: var(--rose-i); }
.bx.hi { border-color: var(--butter-i); } .bx.hi em { color: var(--butter-i); }
.bx.okb { border-color: var(--mint-i); } .bx.okb em { color: var(--mint-i); }
.arr { font-size: 22px; font-weight: 700; color: var(--mint-i); }

.clk { width: 48px; height: 48px; border-radius: 50%; background: var(--rose); color: var(--rose-i); display: grid; place-items: center; flex: none; }
.clk svg { width: 24px; height: 24px; }
.wait { border-color: var(--rose); }
.wait.live { border-color: var(--mint); }
.wait.live small i { width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); animation: beat 1.8s infinite; }
@keyframes beat { 0% { box-shadow: 0 0 0 0 rgba(47, 156, 107, .5); } 70% { box-shadow: 0 0 0 8px rgba(47, 156, 107, 0); } 100% { box-shadow: 0 0 0 0 rgba(47, 156, 107, 0); } }

.acc { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.who { width: 100%; font-size: 11.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.pl { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; padding: 8px 16px; border-radius: 99px; }
.pl svg { width: 13px; height: 13px; }
.bad .pl.open { background: #fff; border: 1px solid var(--rose-i); color: var(--rose-i); }
.good .pl.open { background: #fff; border: 1px solid var(--mint-i); color: var(--mint-i); }
.pl.lock { background: rgba(0, 0, 0, .05); color: #9a97a8; }

/* fix strip */
.fix { margin-top: 22px; border-radius: 28px; padding: 22px 24px; background: #1d1a24; color: #f4eef7; display: flex; flex-direction: column; gap: 14px; }
.fix ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
.fix li { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 99px; background: rgba(255, 255, 255, .08); color: #9d96aa; transition: all .5s ease; }
.fix li svg { width: 14px; height: 14px; opacity: 0; transition: opacity .4s; }
.fix li.lit { background: var(--mint); color: var(--mint-i); }
.fix li.lit svg { opacity: 1; }
.fix p { margin: 0; font-size: 14.5px; line-height: 1.7; color: #d7cfe2; }

@media (max-width: 800px) {
  .grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .cp { padding: 64px 16px; }
  .c { padding: 20px; }
  .c h3 { max-width: 100%; }
  .stk { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .sw, .grid, .fix { opacity: 1; transform: none; transition: none; }
  .wait.live small i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
