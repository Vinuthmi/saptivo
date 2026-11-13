<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "OwnerManagerBenefitsSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const ok = ref([true, true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photos = [
  base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
  base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
  base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
];

const incs = [4200, 6800, 2500, 9100, 3300, 5400];
const revenue = computed(() => {
  let s = 1284500;
  for (let i = 0; i < n.value; i++) s += incs[i % incs.length];
  return s;
});
const fmt = (v) => v.toLocaleString("en-US");
const branchBars = computed(() => [
  { k: "Colombo", w: 58 + ((n.value * 3) % 14), tone: "mint" },
  { k: "Galle", w: 32 + ((n.value * 5) % 12), tone: "sky" },
  { k: "Kandy", w: 26 + ((n.value * 7) % 14), tone: "butter" },
]);

const tools = ["Approve discounts", "Manage staff roles", "Order and transfer stock", "Branch reports"];
const lit = computed(() => (reduce ? tools.length : n.value % (tools.length + 1)));

const menu = [
  { t: "POS", on: true },
  { t: "Customers", on: true },
  { t: "Stock", on: false },
  { t: "Audit log", on: false },
  { t: "All branches", on: false },
];

const events = [
  { t: "Sale", d: "Colombo · Invoice CO-2041", w: "LKR 68,500" },
  { t: "Transfer", d: "Head office → Galle", w: "30 units" },
  { t: "Change", d: "Kandy · Price list edited", w: "Nimali" },
  { t: "Sale", d: "Galle · Invoice GL-0187", w: "LKR 12,000" },
  { t: "Change", d: "Colombo · Staff role updated", w: "Kasun" },
  { t: "Transfer", d: "Colombo → Kandy", w: "12 units" },
];
const feed = computed(() => {
  const out = [];
  for (let k = n.value; k > n.value - 4 && k >= 0; k--) out.push({ id: k, ...events[k % events.length] });
  return out;
});

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1500);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    n.value = 5;
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
  <section ref="root" class="ob" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <span class="eyebrow">Why it matters</span>
        <h2><span class="l1">Benefits for</span> <span class="l2">owners and managers</span></h2>
        <p>
          Owners see the whole business in real time, without waiting for reports from each branch. Branch managers
          get the tools to run their location independently, and staff only see what they need. Audits are simpler
          because every sale, transfer and change is recorded in one system.
        </p>
      </header>

      <div class="bento" role="img" aria-label="Live owner overview, manager tools, staff access and an audit feed">
        <!-- owners -->
        <article class="c own">
          <div class="ph">
            <img v-if="ok[0]" :src="photos[0]" alt="" @error="ok[0] = false" />
            <b v-else>O</b>
            <span class="live"><i></i>Live</span>
          </div>
          <div class="cb">
            <span class="tag lav">Owners</span>
            <small>Revenue today, all branches</small>
            <div class="big">LKR {{ fmt(revenue) }}</div>
            <ul class="bars">
              <li v-for="b in branchBars" :key="b.k" :class="'tone-' + b.tone">
                <span>{{ b.k }}</span>
                <div><i :style="{ width: b.w + '%' }"></i></div>
              </li>
            </ul>
          </div>
        </article>

        <!-- managers -->
        <article class="c mgr">
          <div class="ph">
            <img v-if="ok[1]" :src="photos[1]" alt="" @error="ok[1] = false" />
            <b v-else>M</b>
          </div>
          <div class="cb">
            <span class="tag mint">Branch managers</span>
            <small>Run their location independently</small>
            <ul class="tl">
              <li v-for="(t, i) in tools" :key="t" :class="{ on: i < lit }">
                <span class="ck">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                </span>
                {{ t }}
              </li>
            </ul>
          </div>
        </article>

        <!-- staff -->
        <article class="c stf">
          <div class="ph">
            <img v-if="ok[2]" :src="photos[2]" alt="" @error="ok[2] = false" />
            <b v-else>S</b>
          </div>
          <div class="cb">
            <span class="tag butter">Staff</span>
            <small>Only see what they need</small>
            <ul class="mn">
              <li v-for="m in menu" :key="m.t" :class="m.on ? 'on' : 'off'">
                {{ m.t }}
                <svg v-if="!m.on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              </li>
            </ul>
          </div>
        </article>

        <!-- audit -->
        <article class="c aud">
          <div class="ah">
            <span class="tag dark">Audits</span>
            <small>Every sale, transfer and change in one system</small>
          </div>
          <TransitionGroup name="fd" tag="ul" class="fd">
            <li v-for="e in feed" :key="e.id">
              <span class="tp" :class="e.t.toLowerCase()">{{ e.t }}</span>
              <span class="d">{{ e.d }}</span>
              <em>{{ e.w }}</em>
            </li>
          </TransitionGroup>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ob {
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
.head { text-align: center; max-width: 800px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--lav); color: var(--lav-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ob h2 .l1 { color: #111111 !important; opacity: 1; }
.ob h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .bento { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .bento { opacity: 1; transform: none; }
.in .bento { transition-delay: .1s; }

.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }

.bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
.c { background: #faf9ff; border: 1px solid var(--line); border-radius: 30px; padding: 12px; display: flex; flex-direction: column; gap: 14px; min-width: 0; transition: transform .35s, box-shadow .35s; }
.c:hover { transform: translateY(-4px); box-shadow: 0 22px 48px rgba(60, 50, 120, .12); }
.own { grid-column: span 4; flex-direction: row; background: #f6f4ff; }
.mgr { grid-column: span 2; background: #f2fbf6; }
.stf { grid-column: span 2; background: #fffaea; }
.aud { grid-column: span 4; background: #1d1a24; color: #f4eef7; border-color: #1d1a24; padding: 22px; }

.ph { position: relative; height: 170px; border-radius: 22px; overflow: hidden; background: linear-gradient(135deg, #cfc6f7, #bcdcf3 55%, #c6ecd8); display: grid; place-items: center; font-size: 36px; font-weight: 700; color: var(--lav-i); flex: none; }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 22%; }
.own .ph { width: 42%; height: auto; min-height: 260px; }
.live { position: absolute; left: 12px; top: 12px; display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 99px; background: rgba(255, 255, 255, .94); color: var(--mint-i); }
.live i { width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); animation: beat 1.8s infinite; }
@keyframes beat { 0% { box-shadow: 0 0 0 0 rgba(47, 156, 107, .5); } 70% { box-shadow: 0 0 0 8px rgba(47, 156, 107, 0); } 100% { box-shadow: 0 0 0 0 rgba(47, 156, 107, 0); } }

.cb { padding: 4px 10px 10px; display: flex; flex-direction: column; gap: 8px; min-width: 0; flex: 1; justify-content: center; }
.cb small, .ah small { font-size: 12.5px; color: var(--muted); }
.tag { align-self: flex-start; font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 4px 12px; border-radius: 99px; }
.tag.lav { background: var(--lav); color: var(--lav-i); }
.tag.mint { background: var(--mint); color: var(--mint-i); }
.tag.butter { background: var(--butter); color: var(--butter-i); }
.tag.dark { background: rgba(255, 255, 255, .14); color: #fff; }

.big { font-size: clamp(24px, 2.8vw, 34px); font-weight: 600; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.bars { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.bars li { display: grid; grid-template-columns: 64px 1fr; gap: 12px; align-items: center; font-size: 12px; color: var(--muted); }
.bars div { height: 10px; border-radius: 99px; background: #e7e3f6; overflow: hidden; }
.bars i { display: block; height: 100%; border-radius: 99px; background: var(--ti); transition: width 1s ease; }

.tl { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.tl li { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; color: #9a97a8; transition: color .4s; }
.tl li.on { color: var(--ink); }
.ck { width: 22px; height: 22px; border-radius: 50%; background: #e4e1ee; color: #fff; display: grid; place-items: center; flex: none; transition: background .4s; }
.ck svg { width: 12px; height: 12px; }
.tl li.on .ck { background: var(--mint-i); }

.mn { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.mn li { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 99px; }
.mn li.on { background: #fff; color: var(--ink); border: 1px solid #f0e3b0; }
.mn li.off { background: rgba(0, 0, 0, .04); color: #b4ad96; }
.mn svg { width: 12px; height: 12px; }

.ah { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.ah small { color: #a79fb4; }
.fd { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; position: relative; min-height: 190px; }
.fd li { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 10px 14px; border-radius: 14px; background: rgba(255, 255, 255, .07); font-size: 13px; }
.tp { font-size: 10.5px; font-weight: 700; padding: 3px 10px; border-radius: 99px; }
.tp.sale { background: var(--mint); color: var(--mint-i); }
.tp.transfer { background: var(--sky); color: var(--sky-i); }
.tp.change { background: var(--butter); color: var(--butter-i); }
.fd em { font-style: normal; font-size: 12px; color: #a79fb4; white-space: nowrap; }
.fd-enter-active, .fd-leave-active { transition: all .5s ease; }
.fd-enter-from { opacity: 0; transform: translateY(-14px); }
.fd-leave-to { opacity: 0; transform: translateY(14px); }
.fd-leave-active { position: absolute; left: 0; right: 0; }
.fd-move { transition: transform .5s ease; }

@media (max-width: 960px) {
  .own, .aud { grid-column: span 6; }
  .mgr, .stf { grid-column: span 3; }
}
@media (max-width: 640px) {
  .ob { padding: 64px 16px; }
  .own { flex-direction: column; }
  .own .ph { width: 100%; height: 190px; min-height: 0; }
  .mgr, .stf { grid-column: span 6; }
  .fd li { grid-template-columns: auto 1fr; }
  .fd em { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .bento { opacity: 1; transform: none; transition: none; }
  .live i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
