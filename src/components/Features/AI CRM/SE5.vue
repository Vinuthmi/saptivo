<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AskSaptivoSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
const manual = ref(-1);
let timer = null;
let io = null;

const scenes = [
  {
    chip: "Deals this month",
    q: "Which deals close this month above LKR 1 million?",
    a: "3 deals match, worth LKR 5.4 million in total.",
    kind: "deals",
    rows: [
      { n: "Colombo Hotels AMC", v: "LKR 2.1M", d: "28 Nov" },
      { n: "Lanka Foods", v: "LKR 1.8M", d: "30 Nov" },
      { n: "Ceylon Print", v: "LKR 1.5M", d: "25 Nov" },
    ],
  },
  {
    chip: "Top rep",
    q: "Which rep closed the most deals last quarter?",
    a: "Kasun Jay closed 14 deals, the most in the team.",
    kind: "reps",
    rows: [
      { n: "Kasun Jay", c: 14 },
      { n: "Ayesha Raheem", c: 11 },
      { n: "Saman Silva", c: 8 },
    ],
  },
  {
    chip: "Create a task",
    q: "Create a task for Kasun to call Dilani tomorrow",
    a: "Done. I created the task and linked it to Dilani's open deal.",
    kind: "task",
    rows: [],
  },
];
const acts = ["Create tasks", "Update fields", "Draft emails"];

const idx = computed(() => (manual.value >= 0 ? manual.value : still.value ? 0 : Math.floor(n.value / 11) % 3));
const sub = computed(() => (still.value ? 9 : n.value % 11));
const cur = computed(() => scenes[idx.value]);
const sentOn = computed(() => sub.value >= 1);
const thinking = computed(() => sub.value >= 2 && sub.value < 4);
const answered = computed(() => sub.value >= 4);
const detail = computed(() => sub.value >= 5);
const maxC = 14;

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 700);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manual.value = i;
  n.value = 0;
  if (still.value) return;
  start();
}
// when a chip is picked manually the sub step restarts and plays once

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
  <section ref="root" class="as" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Ask Saptivo,</span> <span class="l2">your CRM assistant</span></h2>
        <p>
          Ask questions in plain language: "Which deals close this month above LKR 1 million?" or "Which rep closed the
          most deals last quarter?" The assistant can also act: create tasks, update fields or draft emails. A weekly AI
          briefing lands in your inbox every Monday.
        </p>
      </header>

      <div class="grid">
        <!-- chat -->
        <article class="chat">
          <div class="top">
            <span class="logo">S</span>
            <div><strong>Ask Saptivo</strong><small>Reads your CRM data</small></div>
            <span class="dot"><i></i>Online</span>
          </div>

          <div class="chips" role="tablist">
            <button v-for="(s, i) in scenes" :key="s.chip" type="button" role="tab" :aria-selected="i === idx" :class="{ on: i === idx }" @click="pick(i)">{{ s.chip }}</button>
          </div>

          <div class="msgs">
            <div class="me" :class="{ show: sentOn }" :key="'q' + idx"><p>{{ cur.q }}</p></div>

            <div class="bot think" :class="{ show: thinking }" aria-hidden="true"><span class="sp">S</span><p class="dots"><i></i><i></i><i></i></p></div>

            <div class="bot" :class="{ show: answered }" :key="'a' + idx">
              <span class="sp">S</span>
              <div class="bub">
                <p>{{ cur.a }}</p>

                <div v-if="cur.kind === 'deals'" class="res" :class="{ show: detail }">
                  <div v-for="r in cur.rows" :key="r.n" class="row"><b>{{ r.n }}</b><span>{{ r.d }}</span><em>{{ r.v }}</em></div>
                </div>

                <div v-else-if="cur.kind === 'reps'" class="res" :class="{ show: detail }">
                  <div v-for="r in cur.rows" :key="r.n" class="row rp">
                    <b>{{ r.n }}</b>
                    <span class="bar"><i :style="{ width: detail ? (r.c / maxC) * 100 + '%' : '0%' }"></i></span>
                    <em>{{ r.c }}</em>
                  </div>
                </div>

                <div v-else class="res task" :class="{ show: detail }">
                  <span class="ck"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg></span>
                  <div><b>Call Dilani Perera</b><small>Kasun Jay · Tomorrow 10:00</small></div>
                  <em>Task</em>
                </div>
              </div>
            </div>
          </div>

          <div class="input" aria-hidden="true"><span>Ask anything about your pipeline…</span><i><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></i></div>
        </article>

        <!-- right -->
        <div class="side">
          <article class="act">
            <span class="lb">It can also act</span>
            <ul>
              <li v-for="(a, i) in acts" :key="a" :class="['a' + i]"><i></i>{{ a }}</li>
            </ul>
          </article>

          <article class="mail">
            <div class="mh">
              <span class="lb">Every Monday, 8:00</span>
              <span class="pill">AI briefing</span>
            </div>
            <strong>Your week in Saptivo</strong>
            <ul>
              <li><b>5 deals</b> are expected to close this week.</li>
              <li><b>2 leads</b> went cold and need a follow-up.</li>
              <li><b>LKR 3.2M</b> of AMC renewals are due in 30 days.</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.as {
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
.as *, .as *::before, .as *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { max-width: 760px; margin: 0 0 44px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.as h2 .l1 { color: #111111 !important; opacity: 1; }
.as h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .08s; }

.grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, .75fr); gap: 18px; align-items: stretch; }

.chat { background: var(--lav); border-radius: 28px; padding: 18px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.top { display: flex; align-items: center; gap: 12px; padding: 2px 4px; }
.top div { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.top strong { font-size: 15px; font-weight: 600; }
.top small { font-size: 12px; color: var(--muted); }
.logo, .sp { width: 36px; height: 36px; border-radius: 12px; background: var(--ink); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 15px; flex: none; }
.sp { width: 28px; height: 28px; border-radius: 9px; font-size: 12px; }
.dot { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--mint-i); font-weight: 500; }
.dot i { width: 7px; height: 7px; border-radius: 50%; background: var(--mint-i); }

.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips button { all: unset; cursor: pointer; font-size: 12.5px; font-weight: 500; padding: 6px 14px; border-radius: 99px; background: rgba(255, 255, 255, .7); color: var(--muted); transition: all .25s; }
.chips button.on { background: var(--ink); color: #fff; }
.chips button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.msgs { background: #fff; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 14px; min-height: 330px; }
.me, .bot { opacity: 0; transform: translateY(8px); transition: opacity .4s ease, transform .4s ease; }
.me.show, .bot.show { opacity: 1; transform: none; }
.me { align-self: flex-end; max-width: 82%; }
.me p { margin: 0; background: var(--ink); color: #fff; border-radius: 16px 16px 4px 16px; padding: 10px 16px; font-size: 14px; line-height: 1.6; }
.bot { display: flex; gap: 10px; align-items: flex-start; }
.bot.think { display: none; }
.bot.think.show { display: flex; }
.bub { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
.bub > p { margin: 0; font-size: 14px; line-height: 1.65; background: #f6f6f8; border-radius: 4px 16px 16px 16px; padding: 10px 16px; align-self: flex-start; }
.dots { margin: 0; display: flex; gap: 4px; background: #f6f6f8; border-radius: 4px 16px 16px 16px; padding: 14px 16px; }
.dots i { width: 6px; height: 6px; border-radius: 50%; background: #9aa0a8; animation: bl 1s ease-in-out infinite; }
.dots i:nth-child(2) { animation-delay: .15s; } .dots i:nth-child(3) { animation-delay: .3s; }
@keyframes bl { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }

.res { border: 1px solid var(--line); border-radius: 16px; overflow: hidden; opacity: 0; transform: translateY(6px); transition: all .45s ease; }
.res.show { opacity: 1; transform: none; }
.row { display: grid; grid-template-columns: minmax(0, 1fr) 64px 92px; gap: 10px; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--line); font-size: 13px; }
.row:last-child { border-bottom: 0; }
.row b { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row span { color: var(--muted); font-size: 12px; }
.row em { font-style: normal; font-weight: 600; text-align: right; color: var(--mint-i); }
.row.rp { grid-template-columns: 110px minmax(0, 1fr) 30px; }
.row.rp em { color: var(--ink); }
.bar { height: 7px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.bar i { display: block; height: 100%; background: var(--lav-i); border-radius: 4px; transition: width .9s cubic-bezier(.2, .8, .2, 1); }
.res.task { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--mint); border-color: transparent; }
.ck { width: 26px; height: 26px; border-radius: 50%; background: var(--mint-i); color: #fff; display: grid; place-items: center; flex: none; }
.task div { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.task b { font-size: 13.5px; font-weight: 500; }
.task small { font-size: 12px; color: var(--muted); }
.task em { font-style: normal; font-size: 11.5px; font-weight: 600; background: #fff; color: var(--mint-i); padding: 3px 10px; border-radius: 6px; }

.input { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #fff; border-radius: 99px; padding: 8px 8px 8px 20px; font-size: 13px; color: #9aa0a8; }
.input i { width: 32px; height: 32px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; flex: none; }

.side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.act { background: var(--sky); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.act ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.act li { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 14px; padding: 12px 16px; font-size: 14px; font-weight: 500; }
.act li i { width: 8px; height: 8px; border-radius: 50%; background: var(--sky-i); }
.act li.a1 i { background: var(--lav-i); } .act li.a2 i { background: var(--rose-i); }

.mail { background: var(--butter); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
.mh { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
.pill { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #fff; color: var(--butter-i); }
.mail strong { font-size: 17px; font-weight: 600; letter-spacing: -.01em; }
.mail ul { list-style: none; margin: 0; padding: 4px 16px; background: #fff; border-radius: 16px; }
.mail li { padding: 11px 0; border-bottom: 1px solid var(--line); font-size: 13.5px; line-height: 1.55; color: var(--muted); }
.mail li:last-child { border-bottom: 0; }
.mail li b { color: var(--ink); font-weight: 600; }

@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .as { padding: 64px 16px; }
  .chat, .act, .mail { padding: 14px; border-radius: 22px; }
  .msgs { padding: 14px; min-height: 300px; }
  .me { max-width: 94%; }
  .row { grid-template-columns: minmax(0, 1fr) 84px; }
  .row span { display: none; }
  .row.rp { grid-template-columns: 90px minmax(0, 1fr) 26px; }
  .row.rp span { display: block; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  .dots i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
