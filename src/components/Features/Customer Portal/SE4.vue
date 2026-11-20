<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ProjectTrackingSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const steps = [
  { t: "Order confirmed", d: "12 Nov", p: 20 },
  { t: "Design approved", d: "16 Nov", p: 45 },
  { t: "Installation", d: "21 Nov", p: 70 },
  { t: "Testing", d: "25 Nov", p: 90 },
  { t: "Delivered", d: "28 Nov", p: 100 },
];
const files = [
  { n: "Site layout drawings.pdf", s: "2.4 MB", at: 1 },
  { n: "Installation photos.zip", s: "18 MB", at: 2 },
  { n: "Handover report.pdf", s: "1.1 MB", at: 4 },
];

const sub = computed(() => (still.value ? 11 : n.value % 12));
const stage = computed(() => Math.min(Math.floor(sub.value / 2), 4));
const pct = computed(() => steps[stage.value].p);
const C = 2 * Math.PI * 40;
const offset = computed(() => C * (1 - pct.value / 100));
const stars = computed(() => (sub.value >= 10 ? 5 : sub.value >= 9 ? 4 : 0));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 900);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    still.value = true;
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
  <section ref="root" class="pt" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Project and</span> <span class="l2">order tracking</span></h2>
        <p>
          For businesses that deliver projects or orders, customers follow a visual timeline with milestones,
          percentage complete and expected delivery date. They receive notifications at each milestone and can download
          deliverables or leave feedback.
        </p>
      </header>

      <div class="board">
        <!-- top: summary + rail -->
        <div class="top">
          <div class="ringbox">
            <svg viewBox="0 0 100 100" width="104" height="104" aria-hidden="true">
              <circle cx="50" cy="50" r="40" class="rb" />
              <circle cx="50" cy="50" r="40" class="rf" :stroke-dasharray="C" :stroke-dashoffset="offset" transform="rotate(-90 50 50)" />
            </svg>
            <b>{{ pct }}%</b>
            <small>complete</small>
          </div>

          <div class="mid">
            <div class="pn"><strong>Rooftop solar installation</strong><span class="pill">Expected delivery 28 Nov 2026</span></div>

            <ol class="rail">
              <li v-for="(s, i) in steps" :key="s.t" :class="{ done: i < stage, now: i === stage, last: i === steps.length - 1 }">
                <span class="nd">
                  <svg v-if="i < stage || (i === stage && stage === 4)" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
                </span>
                <span class="ln"><i></i></span>
                <b>{{ s.t }}</b>
                <small>{{ s.d }}</small>
              </li>
            </ol>
          </div>
        </div>

        <!-- bottom: three cards -->
        <div class="cards">
          <article class="c note">
            <span class="lb">Notification</span>
            <div class="toast" :key="stage">
              <span class="bell"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg></span>
              <div><b>{{ steps[stage].t }}</b><small>{{ stage === 4 ? "Your order is complete." : "Milestone reached. " + pct + "% complete." }}</small></div>
            </div>
          </article>

          <article class="c dl">
            <span class="lb">Deliverables</span>
            <ul>
              <li v-for="f in files" :key="f.n" :class="{ ready: stage >= f.at }">
                <span class="fn"><b>{{ f.n }}</b><small>{{ f.s }}</small></span>
                <span class="get">{{ stage >= f.at ? "Download" : "Locked" }}</span>
              </li>
            </ul>
          </article>

          <article class="c fb">
            <span class="lb">Feedback</span>
            <div class="st" aria-hidden="true"><i v-for="k in 5" :key="k" :class="{ on: k <= stars }"></i></div>
            <p class="cm" :class="{ vis: stars >= 5 }">"Smooth installation and clear updates at every step."</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pt {
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
.pt *, .pt *::before, .pt *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.pt h2 .l1 { color: #111111 !important; opacity: 1; }
.pt h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.head, .board { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .1s; }

.board { display: flex; flex-direction: column; gap: 14px; }
.top { background: var(--sky); border-radius: 28px; padding: 24px; display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 24px; align-items: center; }
.ringbox { position: relative; width: 104px; height: 104px; justify-self: center; }
.ringbox svg { display: block; }
.rb { fill: #fff; stroke: rgba(255, 255, 255, .0); stroke-width: 9; }
.rf { fill: none; stroke: var(--sky-i); stroke-width: 9; stroke-linecap: round; transition: stroke-dashoffset .9s cubic-bezier(.2, .8, .2, 1); }
.ringbox b { position: absolute; left: 0; right: 0; top: 30px; text-align: center; font-size: 22px; font-weight: 600; font-variant-numeric: tabular-nums; }
.ringbox small { position: absolute; left: 0; right: 0; top: 56px; text-align: center; font-size: 11px; color: var(--muted); }

.mid { min-width: 0; display: flex; flex-direction: column; gap: 20px; }
.pn { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.pn strong { font-size: 16px; font-weight: 600; }
.pill { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #fff; color: var(--sky-i); }

.rail { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); }
.rail li { position: relative; display: flex; flex-direction: column; gap: 2px; padding-top: 30px; padding-right: 8px; }
.nd { position: absolute; left: 0; top: 0; width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 2px solid rgba(20, 18, 15, .15); display: grid; place-items: center; color: #fff; z-index: 1; transition: all .4s; }
.ln { position: absolute; left: 22px; right: 0; top: 10px; height: 2px; background: rgba(255, 255, 255, .9); }
.ln i { display: block; height: 100%; width: 0; background: var(--ink); transition: width .6s ease; }
.rail li.done .ln i { width: 100%; }
.rail li.last .ln { display: none; }
.rail li.done .nd { background: var(--ink); border-color: var(--ink); }
.rail li.now .nd { border-color: var(--ink); background: #fff; box-shadow: 0 0 0 4px rgba(20, 18, 15, .08); }
.rail li.now.last .nd { background: var(--ink); }
.rail b { font-size: 13px; font-weight: 500; line-height: 1.35; }
.rail small { font-size: 11.5px; color: var(--muted); }
.rail li:not(.done):not(.now) b { color: var(--muted); }

.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.c { border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.note { background: var(--butter); } .dl { background: var(--mint); } .fb { background: var(--rose); }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

.toast { background: #fff; border-radius: 16px; padding: 14px; display: flex; align-items: center; gap: 12px; animation: tin .45s ease both; }
@keyframes tin { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.bell { width: 34px; height: 34px; border-radius: 10px; background: var(--butter); color: var(--butter-i); display: grid; place-items: center; flex: none; }
.toast div { display: flex; flex-direction: column; min-width: 0; }
.toast b { font-size: 13.5px; font-weight: 600; }
.toast small { font-size: 12px; color: var(--muted); }

.dl ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.dl li { background: #fff; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; opacity: .55; transition: opacity .4s; }
.dl li.ready { opacity: 1; }
.fn { display: flex; flex-direction: column; min-width: 0; }
.fn b { font-size: 12.5px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fn small { font-size: 11px; color: var(--muted); }
.get { font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 6px; background: #f1f2f4; color: var(--muted); flex: none; transition: all .3s; }
.dl li.ready .get { background: var(--ink); color: #fff; }

.st { display: flex; gap: 6px; background: #fff; border-radius: 14px; padding: 14px; }
.st i { width: 22px; height: 22px; background: #e6e8eb; clip-path: polygon(50% 0, 62% 35%, 98% 35%, 69% 57%, 80% 92%, 50% 71%, 20% 92%, 31% 57%, 2% 35%, 38% 35%); transition: background .3s; }
.st i.on { background: #d8b13a; }
.cm { margin: 0; background: #fff; border-radius: 14px; padding: 12px 14px; font-size: 13px; line-height: 1.6; color: var(--muted); opacity: .25; transition: opacity .4s; }
.cm.vis { opacity: 1; color: var(--ink); }

@media (max-width: 900px) {
  .cards { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .pt { padding: 64px 16px; }
  .top { grid-template-columns: 1fr; padding: 18px; border-radius: 22px; }
  .rail { grid-template-columns: 1fr; gap: 0; }
  .rail li { padding: 0 0 18px 34px; }
  .nd { top: 0; }
  .ln { left: 10px; right: auto; top: 22px; bottom: 0; width: 2px; height: auto; }
  .ln i { width: 100%; height: 0; transition: height .6s ease; }
  .rail li.done .ln i { width: 100%; height: 100%; }
  .c { border-radius: 22px; padding: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .toast { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
