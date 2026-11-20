<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "DealIntelligenceSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const ok = ref([true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photoA = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";
const photoB = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Won"];
const sub = computed(() => (reduce ? 7 : n.value % 10));
const fixed = computed(() => sub.value >= 6);

const prob = computed(() => {
  const s = sub.value;
  if (s >= 6) return 68;
  if (s >= 3) return 41;
  if (s >= 2) return 47;
  if (s >= 1) return 54;
  return 62;
});
const flags = computed(() => [
  { k: "stall", t: "No activity for 12 days", at: 1 },
  { k: "who", t: "No finance stakeholder on the deal", at: 2 },
  { k: "stage", t: "21 days in Proposal, longer than usual", at: 3 },
]);
const arc = computed(() => 157.08 * (1 - prob.value / 100));
const eng = computed(() => (fixed.value ? 78 : sub.value >= 1 ? 40 : 72));
const sent = computed(() => (sub.value >= 3 && !fixed.value ? "Neutral" : "Positive"));
const cover = computed(() => (fixed.value ? 3 : 2));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1000);
}
function stop() {
  clearInterval(timer);
  timer = null;
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
  <section ref="root" class="di" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Deal intelligence and</span> <span class="l2">win probability</span></h2>
        <p>
          Each open deal gets a live win probability. Saptivo detects stalled deals with no activity, missing
          stakeholders and risky stages, and suggests a next-best action. A deal health view shows engagement,
          sentiment and stakeholder coverage at a glance.
        </p>
      </header>

      <div class="stage">
        <!-- deal -->
        <article class="deal">
          <div class="dh">
            <div><strong>AMC renewal, Perera Holdings</strong><small>LKR 850,000 · closes 30 Nov</small></div>
            <span class="owner">Nimali</span>
          </div>

          <ol class="stg">
            <li v-for="(s, i) in stages" :key="s" :class="{ on: i === 2, past: i < 2 }">{{ s }}</li>
          </ol>

          <div class="gz">
            <svg viewBox="0 0 120 70" aria-hidden="true">
              <path d="M10 60 A50 50 0 0 1 110 60" class="tr" />
              <path d="M10 60 A50 50 0 0 1 110 60" class="fg" :class="{ ok: fixed }" :style="{ strokeDashoffset: arc }" />
            </svg>
            <div class="gv"><strong>{{ prob }}%</strong><small>Win probability</small></div>
          </div>

          <ul class="flags">
            <li v-for="f in flags" :key="f.k" :class="{ show: sub >= f.at, res: fixed }">
              <i></i>{{ f.t }}<em v-if="fixed">Resolved</em>
            </li>
          </ul>

          <div class="nba" :class="{ show: sub >= 4 && !fixed, done: fixed }">
            <small>{{ fixed ? "Next-best action completed" : "Next-best action" }}</small>
            <p>Call Dilani and invite the finance head to a demo this week.</p>
          </div>
        </article>

        <!-- health -->
        <aside class="health">
          <span class="lb">Deal health</span>

          <div class="m">
            <div class="mh"><span>Engagement</span><b>{{ eng }}%</b></div>
            <div class="tk"><i :class="{ lo: eng < 50 }" :style="{ width: eng + '%' }"></i></div>
          </div>

          <div class="m">
            <div class="mh"><span>Sentiment</span><b :class="{ neu: sent === 'Neutral' }">{{ sent }}</b></div>
            <div class="sg"><i :class="{ on: true }"></i><i :class="{ on: true }"></i><i :class="{ on: sent === 'Positive' }"></i></div>
          </div>

          <div class="m">
            <div class="mh"><span>Stakeholder coverage</span><b>{{ cover }} of 4 roles</b></div>
            <div class="who">
              <span class="p"><span class="av"><img v-if="ok[0]" :src="photoA" alt="" @error="ok[0] = false" /><b v-else>D</b></span><small>Buyer</small></span>
              <span class="p"><span class="av"><img v-if="ok[1]" :src="photoB" alt="" @error="ok[1] = false" /><b v-else>K</b></span><small>Owner</small></span>
              <span class="p" :class="{ gap: !fixed }"><span class="av f"><b>{{ fixed ? "F" : "+" }}</b></span><small>{{ fixed ? "Finance" : "Finance missing" }}</small></span>
              <span class="p gap"><span class="av f"><b>+</b></span><small>IT missing</small></span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.di {
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
.di *, .di *::before, .di *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 840px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.di h2 .l1 { color: #111111 !important; opacity: 1; }
.di h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .08s; }

.stage { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr); gap: 18px; align-items: stretch; }

.deal { border: 1px solid var(--line); border-radius: 28px; padding: 24px; display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.dh { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.dh div { display: flex; flex-direction: column; }
.dh strong { font-size: 16px; font-weight: 600; }
.dh small { font-size: 12.5px; color: var(--muted); }
.owner { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #f1f2f4; color: var(--muted); }

.stg { list-style: none; margin: 0; padding: 0; display: flex; gap: 6px; }
.stg li { flex: 1; text-align: center; font-size: 12px; font-weight: 500; padding: 8px 4px; border-radius: 10px; background: #f1f2f4; color: var(--muted); }
.stg li.past { background: #e4e6ea; color: var(--ink); }
.stg li.on { background: var(--ink); color: #fff; }

.gz { position: relative; align-self: center; width: 240px; }
.gz svg { width: 100%; display: block; overflow: visible; }
.gz path { fill: none; stroke-width: 9; stroke-linecap: round; }
.gz .tr { stroke: #eef1f4; }
.gz .fg { stroke: var(--rose-i); stroke-dasharray: 157.08; transition: stroke-dashoffset 1s cubic-bezier(.2, .8, .2, 1), stroke .5s; }
.gz .fg.ok { stroke: var(--mint-i); }
.gv { position: absolute; left: 0; right: 0; bottom: 2px; display: flex; flex-direction: column; align-items: center; }
.gv strong { font-size: 38px; font-weight: 500; letter-spacing: -.03em; line-height: 1; font-variant-numeric: tabular-nums; }
.gv small { font-size: 12px; color: var(--muted); margin-top: 4px; }

.flags { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; min-height: 116px; }
.flags li { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; background: var(--rose); color: var(--rose-i); font-size: 13px; font-weight: 500; opacity: 0; transform: translateY(6px); transition: all .45s ease; }
.flags li.show { opacity: 1; transform: none; }
.flags li.res { background: #f1f2f4; color: #a0a5ad; }
.flags i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; flex: none; }
.flags em { margin-left: auto; text-decoration: none; font-style: normal; font-size: 11.5px; font-weight: 600; color: var(--mint-i); padding: 2px 9px; border-radius: 6px; background: var(--mint); }

.nba { margin-top: auto; background: var(--lav); border-radius: 16px; padding: 14px 18px; opacity: .3; transition: all .45s ease; }
.nba.show { opacity: 1; }
.nba.done { opacity: 1; background: var(--mint); }
.nba small { font-size: 11.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--lav-i); }
.nba.done small { color: var(--mint-i); }
.nba p { margin: 4px 0 0; font-size: 14px; line-height: 1.55; }

.health { background: var(--sky); border-radius: 28px; padding: 24px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.m { background: #fff; border-radius: 18px; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }
.mh { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--muted); gap: 8px; }
.mh b { font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }
.mh b.neu { color: var(--butter-i); }
.tk { height: 8px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.tk i { display: block; height: 100%; background: var(--sky-i); border-radius: 4px; transition: width 1s cubic-bezier(.2, .8, .2, 1), background .4s; }
.tk i.lo { background: var(--rose-i); }
.sg { display: flex; gap: 6px; }
.sg i { flex: 1; height: 8px; border-radius: 4px; background: #eef1f4; transition: background .4s; }
.sg i.on { background: var(--mint-i); }
.who { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.p { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; }
.p small { font-size: 11px; color: var(--muted); text-align: center; line-height: 1.3; }
.p.gap small { color: var(--rose-i); }
.av { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-size: 13px; font-weight: 700; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.av.f { background: #fff; border: 1.5px dashed #cdd1d8; color: #a0a5ad; transition: all .4s; }
.p:not(.gap) .av.f { background: var(--mint); border: 1.5px solid var(--mint-i); color: var(--mint-i); }

@media (max-width: 900px) {
  .stage { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .di { padding: 64px 16px; }
  .deal, .health { padding: 16px; border-radius: 22px; }
  .stg { overflow-x: auto; }
  .stg li { flex: none; padding: 8px 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
