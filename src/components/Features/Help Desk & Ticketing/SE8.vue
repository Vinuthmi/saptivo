<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SupportBenefitsSection" });

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

const history = [
  "Asset: Split AC · ACX-5521",
  "Warranty valid until Mar 2027",
  "Last ticket: filter indicator, resolved",
];
const queues = [
  { name: "Appliance support", a: 62, b: 48, risk: false },
  { name: "Installations", a: 35, b: 41, risk: false },
  { name: "Billing", a: 80, b: 88, risk: true },
];

const sub = computed(() => (reduce ? 4 : n.value % 6));
const flip = computed(() => sub.value >= 3);
const csat = computed(() => (sub.value >= 3 ? "4.7" : "4.6"));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1200);
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
  <section ref="root" class="sb" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Benefits for</span> <span class="l2">support teams</span></h2>
      </header>

      <div class="grid">
        <!-- agents -->
        <article class="cd lav c1">
          <figure class="ph">
            <img v-if="ok[0]" :src="agentPhoto" alt="" @error="ok[0] = false" />
            <span v-else class="fb">A</span>
          </figure>
          <h3>Agents</h3>
          <p>Agents spend less time searching for information and more time solving problems.</p>
          <div class="ui">
            <div class="ctx">
              <small>Customer context, in the ticket</small>
              <ul>
                <li v-for="(h, i) in history" :key="h" :class="{ on: sub >= i + 1 }"><i></i>{{ h }}</li>
              </ul>
            </div>
          </div>
        </article>

        <!-- managers -->
        <article class="cd sky c2">
          <h3>Managers</h3>
          <p>Managers see queues, SLA risks and satisfaction scores in real time.</p>
          <div class="ui">
            <div class="qs">
              <div v-for="q in queues" :key="q.name" class="q">
                <div class="qh">
                  <span>{{ q.name }}</span>
                  <em v-if="q.risk" class="risk">SLA risk</em>
                </div>
                <div class="trk"><i :class="{ r: q.risk }" :style="{ width: (flip ? q.b : q.a) + '%' }"></i></div>
              </div>
              <div class="cs"><small>CSAT today</small><strong>{{ csat }}</strong></div>
            </div>
          </div>
        </article>

        <!-- customers -->
        <article class="cd mint c3">
          <figure class="ph">
            <img v-if="ok[1]" :src="custPhoto" alt="" @error="ok[1] = false" />
            <span v-else class="fb">C</span>
          </figure>
          <h3>Customers</h3>
          <p>Customers get faster answers and fewer repeat explanations, which builds loyalty.</p>
          <div class="ui">
            <div class="chat">
              <div class="b me" :class="{ on: sub >= 1 }">My AC is still not cooling.</div>
              <div class="b ag" :class="{ on: sub >= 2 }">Hi Dilani, I can see your visit on Tuesday. A technician is on the way.</div>
              <span class="note" :class="{ on: sub >= 3 }">No need to explain again</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sb {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 56px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.sb h2 .l1 { color: #111111 !important; opacity: 1; }
.sb h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.head, .cd { opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .cd { opacity: 1; transform: none; }
.in .c1 { transition-delay: .08s; }
.in .c2 { transition-delay: .18s; }
.in .c3 { transition-delay: .28s; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: start; }
.c2 { margin-top: 48px; }
.cd { border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 12px; }
.cd.lav { background: var(--lav); }
.cd.sky { background: var(--sky); }
.cd.mint { background: var(--mint); }
.cd h3 { margin: 6px 0 0; font-size: 22px; font-weight: 500; letter-spacing: -.02em; }
.cd p { margin: 0; font-size: 15px; line-height: 1.7; color: #3a3f47; }

.ph { margin: 0; height: 180px; border-radius: 16px; overflow: hidden; background: rgba(255, 255, 255, .55); }
.ph img { width: 100%; height: 100%; object-fit: cover; object-position: center 25%; display: block; }
.fb { width: 100%; height: 100%; display: grid; place-items: center; font-size: 44px; font-weight: 500; color: var(--muted); }

.ui { margin-top: 10px; background: #fff; border-radius: 18px; padding: 16px; min-height: 168px; }

/* agents */
.ctx small { font-size: 11.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.ctx ul { list-style: none; margin: 12px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.ctx li { display: flex; align-items: center; gap: 10px; font-size: 13px; opacity: .3; transform: translateX(-6px); transition: all .4s; }
.ctx li.on { opacity: 1; transform: none; }
.ctx li i { width: 8px; height: 8px; border-radius: 50%; background: var(--lav-i); flex: none; }

/* managers */
.qs { display: flex; flex-direction: column; gap: 14px; }
.qh { display: flex; justify-content: space-between; align-items: center; font-size: 13px; margin-bottom: 6px; }
.risk { font-style: normal; font-size: 11px; font-weight: 600; color: var(--rose-i); background: #fde7ed; padding: 2px 8px; border-radius: 6px; }
.trk { height: 6px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.trk i { display: block; height: 100%; background: var(--sky-i); border-radius: 4px; transition: width 1s cubic-bezier(.2, .7, .2, 1); }
.trk i.r { background: var(--rose-i); }
.cs { display: flex; justify-content: space-between; align-items: baseline; padding-top: 12px; border-top: 1px solid var(--line); }
.cs small { font-size: 12px; color: var(--muted); }
.cs strong { font-size: 24px; font-weight: 500; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }

/* customers */
.chat { display: flex; flex-direction: column; gap: 10px; }
.b { font-size: 13px; line-height: 1.55; padding: 9px 14px; max-width: 88%; opacity: 0; transform: translateY(6px); transition: all .4s; }
.b.on { opacity: 1; transform: none; }
.b.me { align-self: flex-end; background: var(--mint); border-radius: 16px 16px 4px 16px; }
.b.ag { align-self: flex-start; background: #f1f2f4; border-radius: 16px 16px 16px 4px; }
.note { align-self: flex-start; font-size: 11.5px; font-weight: 600; color: var(--mint-i); opacity: 0; transition: opacity .4s; }
.note.on { opacity: 1; }

@media (max-width: 1000px) {
  .grid { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }
  .c2 { margin-top: 0; }
}
@media (max-width: 640px) {
  .sb { padding: 64px 16px; }
  .cd { padding: 18px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .cd { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
