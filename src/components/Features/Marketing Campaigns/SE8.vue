<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "CampaignIdeasSection" });

const root = ref(null);
const shown = ref(false);
const act = ref(0);
const manual = ref(false);
const still = ref(false);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";

const ideas = [
  { t: "Welcome sequence for new leads from Facebook and your website", tone: "lav" },
  { t: "Win-back offer for customers who haven't bought in 90 days", tone: "sky" },
  { t: "AMC renewal reminders 60 and 30 days before expiry", tone: "mint" },
  { t: "VIP tier rewards and birthday offers for loyal shoppers", tone: "butter" },
  { t: "New product announcements to customers who bought related items", tone: "rose" },
  { t: "Seasonal service reminders, such as AC cleaning before the hot months", tone: "sky" },
];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function next() {
  act.value = (act.value + 1) % ideas.length;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 2800);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  act.value = i;
  manual.value = true;
  stop();
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    still.value = true;
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
  <section ref="root" class="ci" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Campaign ideas you can</span> <span class="l2">run from Saptivo</span></h2>
      </header>

      <ul class="grid">
        <li v-for="(it, i) in ideas" :key="i" class="cell" :style="{ transitionDelay: 0.06 * i + 's' }">
          <button type="button" class="cd" :class="[it.tone, { act: act === i || still }]" @click="pick(i)">
            <span class="no">{{ i + 1 }}</span>
            <span class="tx">{{ it.t }}</span>

            <span class="viz" aria-hidden="true">
              <!-- 1 welcome -->
              <template v-if="i === 0">
                <span class="src"><em>Facebook</em><em>Website</em></span>
                <span class="seq"><i></i><i></i><i></i><b>Day 0</b><b>Day 2</b><b>Day 5</b></span>
              </template>
              <!-- 2 win-back -->
              <template v-else-if="i === 1">
                <span class="lbl">No order in 90 days</span>
                <span class="meter"><i></i></span>
                <span class="offer">Offer sent</span>
              </template>
              <!-- 3 AMC -->
              <template v-else-if="i === 2">
                <span class="tl"><i></i><i></i><i></i></span>
                <span class="tll"><b>60 days</b><b>30 days</b><b>Expiry</b></span>
              </template>
              <!-- 4 VIP -->
              <template v-else-if="i === 3">
                <span class="av"><img v-if="ok" :src="photo" alt="" @error="ok = false" /><b v-else>V</b></span>
                <span class="tiers"><em>Silver</em><em class="g">Gold</em><em>Platinum</em></span>
                <span class="bd">Birthday offer</span>
              </template>
              <!-- 5 new product -->
              <template v-else-if="i === 4">
                <span class="pr"><em>Bought: AC filter</em><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg><em class="n">New: Air purifier</em></span>
              </template>
              <!-- 6 seasonal -->
              <template v-else>
                <span class="mo"><em v-for="(m, k) in months" :key="m" :class="{ hot: k >= 2 && k <= 4, send: k === 1 }">{{ m }}</em></span>
                <span class="lbl">AC cleaning reminder, sent early</span>
              </template>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.ci {
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
.ci *, .ci *::before, .ci *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 52px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ci h2 .l1 { color: #111111 !important; opacity: 1; }
.ci h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.head { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head { opacity: 1; transform: none; }

.grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.cell { opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s ease; display: flex; }
.in .cell { opacity: 1; transform: none; }

.cd { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 14px; border: 1.5px solid transparent; transition: border-color .3s, transform .3s; }
.cd:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.cd.lav { background: var(--lav); }
.cd.sky { background: var(--sky); }
.cd.mint { background: var(--mint); }
.cd.butter { background: var(--butter); }
.cd.rose { background: var(--rose); }
.cd.act { border-color: var(--ink); transform: translateY(-3px); }
.no { width: 28px; height: 28px; border-radius: 50%; background: #fff; display: grid; place-items: center; font-size: 12.5px; font-weight: 600; transition: all .3s; }
.act .no { background: var(--ink); color: #fff; }
.tx { font-size: 16px; font-weight: 500; line-height: 1.5; letter-spacing: -.01em; }

.viz { margin-top: auto; background: #fff; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; min-height: 92px; justify-content: center; font-size: 12px; color: var(--muted); }
.viz em { font-style: normal; }
.viz b { font-weight: 500; }

/* 1 */
.src { display: flex; gap: 6px; }
.src em { padding: 3px 10px; border-radius: 6px; background: var(--lav); color: var(--lav-i); font-weight: 600; font-size: 11.5px; }
.seq { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); row-gap: 6px; }
.seq i { height: 8px; border-radius: 4px; background: #e6e8ec; margin-right: 6px; transition: background .4s; }
.act .seq i { background: var(--lav-i); }
.act .seq i:nth-child(2) { transition-delay: .35s; }
.act .seq i:nth-child(3) { transition-delay: .7s; }
/* 2 */
.meter { height: 8px; border-radius: 4px; background: #e6e8ec; overflow: hidden; }
.meter i { display: block; height: 100%; width: 8%; background: var(--sky-i); transition: width 1.4s ease; }
.act .meter i { width: 100%; }
.offer { align-self: flex-start; padding: 3px 10px; border-radius: 6px; background: #f1f2f4; font-weight: 600; font-size: 11.5px; transition: all .4s 1.2s; }
.act .offer { background: var(--sky); color: var(--sky-i); }
.lbl { font-weight: 500; }
/* 3 */
.tl { display: flex; justify-content: space-between; position: relative; padding: 0 4px; }
.tl::before { content: ""; position: absolute; left: 4px; right: 4px; top: 6px; height: 1.5px; background: #e6e8ec; }
.tl i { width: 13px; height: 13px; border-radius: 50%; background: #fff; border: 1.5px solid #cfd2d8; position: relative; transition: all .4s; }
.act .tl i { background: var(--mint-i); border-color: var(--mint-i); }
.act .tl i:nth-child(2) { transition-delay: .4s; }
.act .tl i:nth-child(3) { transition-delay: .8s; }
.tll { display: flex; justify-content: space-between; }
/* 4 */
.av { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; background: var(--butter); color: var(--butter-i); display: grid; place-items: center; font-weight: 700; flex: none; position: absolute; }
.viz:has(.av) { position: relative; padding-left: 62px; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.av { left: 16px; top: 16px; }
.tiers { display: flex; gap: 6px; }
.tiers em { padding: 3px 10px; border-radius: 6px; background: #f1f2f4; font-weight: 600; font-size: 11.5px; transition: all .4s; }
.act .tiers em.g { background: var(--butter); color: var(--butter-i); }
.bd { font-weight: 500; }
/* 5 */
.pr { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pr em { padding: 4px 10px; border-radius: 6px; background: #f1f2f4; font-weight: 500; font-size: 11.5px; }
.pr em.n { background: #f1f2f4; transition: all .4s .5s; }
.act .pr em.n { background: var(--rose); color: var(--rose-i); font-weight: 600; }
.pr svg { color: var(--muted); }
/* 6 */
.mo { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; }
.mo em { text-align: center; padding: 5px 0; border-radius: 6px; background: #f1f2f4; font-size: 11px; font-weight: 500; transition: all .4s; }
.mo em.hot { background: #fde9d0; color: #94560a; }
.act .mo em.send { background: var(--sky-i); color: #fff; }

@media (max-width: 1000px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .ci { padding: 64px 16px; }
  .grid { grid-template-columns: 1fr; }
  .cd { padding: 18px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .cell { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
