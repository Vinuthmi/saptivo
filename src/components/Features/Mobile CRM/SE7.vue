<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "DayWithMobileSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
let timer = null;
let io = null;
let reduce = false;
let touched = false;

const steps = [
  {
    k: "On the train",
    t: "Your rep checks today's visits on the train.",
    c: "lav",
    rows: [["Colombo Hotels", "9:30"], ["Lanka Foods", "11:00"], ["Ceylon Print", "14:00"]],
    cap: "Today's visits",
  },
  {
    k: "Before the first meeting",
    t: "Before the first meeting, they open the customer's timeline and see last month's quotation.",
    c: "sky",
    rows: [["Quotation sent", "Last month"], ["Call · 4 min", "2 weeks ago"]],
    cap: "Colombo Hotels · timeline",
  },
  {
    k: "During the meeting",
    t: "During the meeting, they log notes and scan a new contact's business card.",
    c: "mint",
    rows: [["Note saved", "Wants a revised price"], ["Business card scanned", "Ayesha Raheem added"]],
    cap: "Meeting",
  },
  {
    k: "On the way out",
    t: "On the way out, they send an updated estimate from their phone.",
    c: "butter",
    rows: [["Updated estimate", "LKR 150,000"], ["Sent to customer", "Just now"]],
    cap: "Estimate",
  },
  {
    k: "At the office",
    t: "By the time they reach the office, the manager has already seen the deal move forward.",
    c: "rose",
    rows: [["Deal moved forward", "Proposal to Negotiation"], ["Seen by manager", "Already"]],
    cap: "Manager view",
  },
];

const prog = computed(() => ((idx.value + 1) / steps.length) * 100);

function start() {
  if (timer || reduce || touched) return;
  timer = setInterval(() => {
    idx.value = (idx.value + 1) % steps.length;
  }, 3200);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  touched = true;
  stop();
  idx.value = i;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    idx.value = steps.length - 1;
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
  <section ref="root" class="dm" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">A day with</span> <span class="l2">Saptivo mobile</span></h2>
      </header>

      <div class="rail" aria-hidden="true"><i :style="{ width: prog + '%' }"></i></div>

      <ol class="days">
        <li v-for="(s, i) in steps" :key="s.k">
          <button type="button" class="card" :class="[s.c, { act: i === idx, past: i < idx }]" :aria-current="i === idx" @click="pick(i)">
            <span class="no">{{ i + 1 }}</span>
            <span class="k">{{ s.k }}</span>
            <span class="t">{{ s.t }}</span>
            <span class="vis">
              <small>{{ s.cap }}</small>
              <span v-for="(r, j) in s.rows" :key="r[0]" class="row" :style="{ '--i': j }"><b>{{ r[0] }}</b><em>{{ r[1] }}</em></span>
            </span>
          </button>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.dm {
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
.dm *, .dm *::before, .dm *::after { box-sizing: border-box; }
.wrap { max-width: 1240px; margin: 0 auto; }
.head { text-align: center; margin: 0 auto 40px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.dm h2 .l1 { color: #111111 !important; opacity: 1; }
.dm h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head, .rail, .days { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .rail, .in .days { opacity: 1; transform: none; }
.in .days { transition-delay: .1s; }

.rail { height: 2px; background: var(--line); border-radius: 2px; margin: 0 0 20px; overflow: hidden; }
.rail i { display: block; height: 100%; background: var(--ink); transition: width .6s ease; }

.days { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; align-items: stretch; }
.days li { display: flex; }
.card { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; display: flex; flex-direction: column; gap: 10px; padding: 20px; border-radius: 24px; border: 1.5px solid transparent; background: #f6f6f8; transition: all .4s ease; }
.card:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.card.lav.act, .card.lav.past { background: var(--lav); }
.card.sky.act, .card.sky.past { background: var(--sky); }
.card.mint.act, .card.mint.past { background: var(--mint); }
.card.butter.act, .card.butter.past { background: var(--butter); }
.card.rose.act, .card.rose.past { background: var(--rose); }
.card.act { border-color: var(--ink); }
.no { width: 26px; height: 26px; border-radius: 50%; background: #fff; color: var(--muted); display: grid; place-items: center; font-size: 12px; font-weight: 600; transition: all .3s; }
.card.act .no { background: var(--ink); color: #fff; }
.k { font-size: 11.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.t { font-size: 14.5px; line-height: 1.65; color: var(--muted); transition: color .3s; }
.card.act .t, .card.past .t { color: var(--ink); }
.card.act .t { font-weight: 500; }

.vis { margin-top: auto; display: flex; flex-direction: column; gap: 6px; padding-top: 10px; min-height: 150px; opacity: .3; transition: opacity .4s; }
.card.act .vis { opacity: 1; }
.vis small { font-size: 11px; font-weight: 600; color: var(--muted); }
.row { display: flex; flex-direction: column; gap: 1px; background: #fff; border-radius: 12px; padding: 8px 12px; }
.row b { font-size: 12.5px; font-weight: 500; }
.row em { font-style: normal; font-size: 11.5px; color: var(--muted); }
.card.act .row { animation: rise .5s ease both; animation-delay: calc(var(--i) * .25s + .1s); }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

@media (max-width: 1100px) {
  .days { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .days li:last-child { grid-column: 1 / -1; }
  .rail { display: none; }
}
@media (max-width: 640px) {
  .dm { padding: 64px 16px; }
  .days { grid-template-columns: 1fr; }
  .card { padding: 16px; border-radius: 20px; }
  .vis { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .rail, .days { opacity: 1; transform: none; transition: none; }
  .card.act .row { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
