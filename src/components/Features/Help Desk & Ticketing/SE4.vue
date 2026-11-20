<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "KnowledgeBaseSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const ok = ref([true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const agentPhoto = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";
const custPhoto = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const canned = [
  { t: "Filter indicator reset", k: "/filter" },
  { t: "Warranty check", k: "/warranty" },
  { t: "Technician visit times", k: "/visit" },
];
const query = "filter indicator";
const reply = "Hi Dilani, to reset the filter indicator, hold the Reset button for 5 seconds until the light blinks.";

const step = computed(() => (reduce ? 10 : n.value % 13));
const chars = computed(() => {
  if (step.value < 6) return 0;
  return Math.min(query.length, (step.value - 5) * 6);
});
const typed = computed(() => query.slice(0, chars.value));
const results = computed(() => step.value >= 9);
const solved = computed(() => step.value >= 10);
const listOpen = computed(() => step.value >= 2 && step.value <= 3);
const picked = computed(() => step.value >= 3);
const filled = computed(() => step.value >= 4);
const sent = computed(() => step.value >= 5);
const count = computed(() => (solved.value ? 129 : 128));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1300);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function replay() {
  stop();
  n.value = Math.floor(n.value / 13) * 13 + 13;
  start();
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    n.value = 10;
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
  <section ref="root" class="kb" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Faster answers with canned</span> <span class="l2">responses and a knowledge base</span></h2>
        <p>
          Save answers to common questions as canned responses. Publish help articles to a knowledge base that agents
          use internally and customers search in the self-service portal, reducing repeat tickets.
        </p>
      </header>

      <div class="board" role="img" aria-label="An agent replying with a canned response while a customer finds the same answer in the self-service portal knowledge base">
        <!-- agent -->
        <div class="pn ag">
          <div class="ph"><span class="lb">Agent inbox</span><button type="button" class="replay" @click="replay">Replay</button></div>

          <div class="tk" :class="{ on: step >= 1 }">
            <span class="av"><img v-if="ok[1]" :src="custPhoto" alt="" @error="ok[1] = false" /><b v-else>D</b></span>
            <div>
              <strong>Dilani Perera</strong>
              <p>How do I reset the filter indicator on my air conditioner?</p>
            </div>
          </div>

          <div class="cr">
            <div class="bx" :class="{ on: filled }">
              <span v-if="!filled" class="ph2">Type / for saved replies</span>
              <p v-else>{{ reply }}</p>
              <span v-if="filled" class="art">Article attached: Reset the filter indicator</span>
            </div>

            <Transition name="lst">
              <ul v-if="listOpen" class="lst">
                <li v-for="(c, i) in canned" :key="c.k" :class="{ sel: picked && i === 0 }">
                  <b>{{ c.t }}</b><code>{{ c.k }}</code>
                </li>
              </ul>
            </Transition>

            <div class="sd">
              <span class="av sm"><img v-if="ok[0]" :src="agentPhoto" alt="" @error="ok[0] = false" /><b v-else>N</b></span>
              <span class="who">Nimali · Support</span>
              <span class="btn" :class="{ done: sent }">{{ sent ? "Sent · answered in 40 s" : "Send" }}</span>
            </div>
          </div>
        </div>

        <!-- kb -->
        <div class="mid">
          <div class="art2" :class="{ hit: step >= 9 || (step >= 4 && step <= 5) }">
            <small>Knowledge base</small>
            <strong>Reset the filter indicator</strong>
            <span class="tg"><i></i>Published</span>
            <div class="uses"><span>Agents use it internally</span><span>Customers search it in the portal</span></div>
          </div>
        </div>

        <!-- portal -->
        <div class="pn pt">
          <div class="ph"><span class="lb">Self-service portal</span></div>

          <div class="se">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.500-3.500" /></svg>
            <span :class="{ q: chars > 0 }">{{ chars > 0 ? typed : "Search help articles" }}</span>
            <i v-if="chars > 0 && chars < query.length" class="cur"></i>
          </div>

          <ul class="res">
            <Transition name="r">
              <li v-if="results" class="top">
                <b>Reset the filter indicator</b>
                <small>Hold Reset for 5 seconds until the light blinks.</small>
              </li>
            </Transition>
            <Transition name="r">
              <li v-if="results" class="ot"><b>Cleaning the indoor unit filter</b></li>
            </Transition>
            <Transition name="r">
              <li v-if="results" class="ot"><b>Why does the filter light stay on?</b></li>
            </Transition>
          </ul>

          <div class="sv" :class="{ on: solved }">
            <span class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg></span>
            <div><b>Solved without a ticket</b><small>Tickets avoided this month</small></div>
            <strong>{{ count }}</strong>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.kb {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 52px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.kb h2 .l1 { color: #111111 !important; opacity: 1; }
.kb h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .board { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .08s; }

.board { display: grid; grid-template-columns: 1fr 230px 1fr; gap: 20px; align-items: stretch; }
.pn { border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ag { background: var(--lav); }
.pt { background: var(--sky); }
.ph { display: flex; justify-content: space-between; align-items: center; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.replay { all: unset; cursor: pointer; font-size: 11.5px; font-weight: 600; color: var(--muted); padding: 4px 12px; border-radius: 99px; background: rgba(255, 255, 255, .7); }
.replay:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.av { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; background: #fff; color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 13px; flex: none; }
.av.sm { width: 28px; height: 28px; font-size: 11px; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.tk { display: flex; gap: 12px; padding: 14px 16px; border-radius: 16px; background: #fff; opacity: .35; transform: translateY(6px); transition: all .5s ease; }
.tk.on { opacity: 1; transform: none; }
.tk strong { font-size: 13.5px; }
.tk p { margin: 2px 0 0; font-size: 13px; line-height: 1.55; color: var(--muted); }

.cr { position: relative; display: flex; flex-direction: column; gap: 10px; }
.bx { min-height: 108px; padding: 14px 16px; border-radius: 16px; background: #fff; border: 1px solid var(--line); display: flex; flex-direction: column; gap: 10px; transition: border-color .3s; }
.bx.on { border-color: var(--lav-i); }
.bx p { margin: 0; font-size: 13px; line-height: 1.6; }
.ph2 { font-size: 13px; color: #a6a3b3; }
.art { align-self: flex-start; font-size: 11.5px; font-weight: 600; color: var(--sky-i); background: var(--sky); padding: 4px 10px; border-radius: 6px; }

.lst { list-style: none; margin: 0; padding: 6px; position: absolute; left: 0; right: 0; top: 52px; z-index: 2; background: #fff; border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 14px 30px rgba(20, 18, 15, .12); }
.lst li { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; font-size: 13px; transition: background .25s; }
.lst li.sel { background: var(--lav); }
.lst code { font-size: 11.5px; color: var(--muted); font-family: inherit; }
.lst-enter-active, .lst-leave-active { transition: all .25s ease; }
.lst-enter-from, .lst-leave-to { opacity: 0; transform: translateY(-6px); }

.sd { display: flex; align-items: center; gap: 10px; }
.who { font-size: 12.5px; color: var(--muted); flex: 1; }
.btn { font-size: 12.5px; font-weight: 600; padding: 9px 18px; border-radius: 99px; background: var(--ink); color: #fff; transition: background .3s; }
.btn.done { background: var(--mint-i); }

/* kb */
.mid { display: grid; place-items: center; position: relative; }
.mid::before { content: ""; position: absolute; left: -20px; right: -20px; top: 50%; border-top: 1.5px dashed #cfcadf; }
.art2 { position: relative; z-index: 1; width: 100%; background: var(--butter); border-radius: 20px; padding: 18px 16px; display: flex; flex-direction: column; gap: 8px; border: 1.5px solid transparent; transition: all .4s; }
.art2.hit { border-color: var(--butter-i); transform: scale(1.03); }
.art2 small { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--butter-i); }
.art2 strong { font-size: 15px; line-height: 1.35; }
.tg { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--mint-i); }
.tg i { width: 7px; height: 7px; border-radius: 50%; background: var(--mint-i); }
.uses { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; border-top: 1px solid rgba(20, 18, 15, .1); font-size: 11.5px; color: var(--muted); }

/* portal */
.se { display: flex; align-items: center; gap: 10px; padding: 13px 16px; border-radius: 99px; background: #fff; font-size: 13.5px; color: #a6a3b3; }
.se svg { width: 18px; height: 18px; color: var(--muted); flex: none; }
.se .q { color: var(--ink); }
.cur { width: 1.5px; height: 16px; background: var(--ink); animation: bl 1s steps(1) infinite; }
@keyframes bl { 50% { opacity: 0; } }
.res { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; min-height: 176px; }
.res li { padding: 12px 16px; border-radius: 14px; background: #fff; display: flex; flex-direction: column; gap: 2px; }
.res b { font-size: 13.5px; font-weight: 600; }
.res small { font-size: 12px; color: var(--muted); line-height: 1.5; }
.res .top { border: 1.5px solid var(--sky-i); }
.res .ot b { font-weight: 500; color: var(--muted); font-size: 13px; }
.r-enter-active { transition: all .4s ease; }
.r-enter-from { opacity: 0; transform: translateY(8px); }

.sv { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 16px; background: rgba(255, 255, 255, .6); opacity: .5; transition: all .5s; margin-top: auto; }
.sv.on { opacity: 1; background: var(--mint); }
.ck { width: 26px; height: 26px; border-radius: 50%; background: #c9d6cf; color: #fff; display: grid; place-items: center; flex: none; transition: background .4s; }
.sv.on .ck { background: var(--mint-i); }
.ck svg { width: 14px; height: 14px; }
.sv div { flex: 1; display: flex; flex-direction: column; }
.sv b { font-size: 13px; }
.sv small { font-size: 11.5px; color: var(--muted); }
.sv strong { font-size: 24px; font-weight: 500; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }

@media (max-width: 1000px) {
  .board { grid-template-columns: 1fr; }
  .mid::before { display: none; }
  .art2 { max-width: 420px; margin: 0 auto; }
}
@media (max-width: 640px) {
  .kb { padding: 64px 16px; }
  .pn { padding: 16px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .cur { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
