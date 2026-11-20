<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "DashboardsSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const manual = ref(-1);
const ok = ref([true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photoA = base + "3C.webp";
const photoB = base + "10.jpg";

const roles = [
  {
    key: "rep", name: "Nimali", role: "Sales rep", scope: "Personal dashboard", photo: 0,
    order: ["tasks", "quota", "pipe", "fups"],
  },
  {
    key: "mgr", name: "Kasun", role: "Sales manager", scope: "Shared with Sales team", photo: 1,
    order: ["team", "funnel", "risk", "tquota"],
  },
  {
    key: "own", name: "Dilani", role: "Owner", scope: "Personal dashboard", photo: -1,
    order: ["rev", "branch", "amc", "cash"],
  },
];

const wide = { tasks: true, team: true, rev: true, branch: false };
const tasks = [
  { t: "Call Saman about the quotation", d: true },
  { t: "Send AMC proposal to Ayesha", d: false },
  { t: "Site visit at 3:00 pm, Kandy", d: false },
];
const team = [
  { n: "Nimali", v: 92 },
  { n: "Shanika", v: 74 },
  { n: "Ruwan", v: 51 },
];
const branches = [
  { n: "Colombo", v: 100, r: "8.9M" },
  { n: "Kandy", v: 62, r: "5.5M" },
  { n: "Galle", v: 44, r: "3.9M" },
];
const funnel = [100, 68, 41, 22];
const sparkPts = "0,26 20,22 40,24 60,15 80,12 100,5";

const idx = computed(() => {
  if (manual.value >= 0) return manual.value;
  return reduce ? 0 : Math.floor(n.value / 6) % 3;
});
const sub = computed(() => (manual.value >= 0 || reduce ? 5 : n.value % 6));
const cur = computed(() => roles[idx.value]);
// the user rearranges: after beat 3 the first two widgets swap places
const order = computed(() => {
  const o = cur.value.order.slice();
  if (sub.value >= 3 && !reduce) {
    const t = o[0];
    o[0] = o[1];
    o[1] = t;
  }
  return o;
});
const go = computed(() => sub.value >= 1);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce || manual.value >= 0) return;
  timer = setInterval(tick, 1000);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manual.value = i;
  stop();
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
  <section ref="root" class="db" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Personal and</span> <span class="l2">shared dashboards</span></h2>
        <p>
          Each user arranges a dashboard for their job, and managers share team dashboards. A rep sees today's tasks
          and their quota; an owner sees company revenue and branch performance.
        </p>
      </header>

      <div class="stage">
        <ul class="who" role="tablist">
          <li v-for="(r, i) in roles" :key="r.key">
            <button type="button" role="tab" :aria-selected="i === idx" :class="{ on: i === idx }" @click="pick(i)">
              <span class="av">
                <img v-if="r.photo === 0 && ok[0]" :src="photoA" alt="" @error="ok[0] = false" />
                <img v-else-if="r.photo === 1 && ok[1]" :src="photoB" alt="" @error="ok[1] = false" />
                <b v-else>{{ r.name.charAt(0) }}</b>
              </span>
              <span class="nm"><strong>{{ r.name }}</strong><small>{{ r.role }}</small></span>
            </button>
          </li>
        </ul>

        <div class="win">
          <div class="bar">
            <span class="ttl">{{ cur.role === "Owner" ? "Company overview" : cur.role === "Sales rep" ? "My day" : "Team overview" }}</span>
            <span class="scope" :class="{ sh: cur.key === 'mgr' }">{{ cur.scope }}</span>
          </div>

          <TransitionGroup :key="idx" name="wd" tag="div" class="gd">
            <div v-for="id in order" :key="id" class="wd" :class="[id, { w: wide[id] }]">
              <!-- rep -->
              <template v-if="id === 'tasks'">
                <small>Today's tasks</small>
                <ul class="tk"><li v-for="t in tasks" :key="t.t" :class="{ done: t.d }"><i></i>{{ t.t }}</li></ul>
              </template>
              <template v-else-if="id === 'quota'">
                <small>My quota</small>
                <div class="ring">
                  <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" class="bg" /><circle cx="20" cy="20" r="16" class="fg" :style="{ strokeDashoffset: go ? 32 : 100.5 }" /></svg>
                  <strong>68%</strong>
                </div>
                <em>LKR 1.36M of 2.0M</em>
              </template>
              <template v-else-if="id === 'pipe'">
                <small>My pipeline</small>
                <strong class="big">LKR 4.2M</strong>
                <em>12 open deals</em>
              </template>
              <template v-else-if="id === 'fups'">
                <small>Follow-ups due</small>
                <strong class="big">5</strong>
                <em>2 are overdue</em>
              </template>

              <!-- manager -->
              <template v-else-if="id === 'team'">
                <small>Team quota</small>
                <div v-for="r in team" :key="r.n" class="hb"><span>{{ r.n }}</span><span class="tr"><i :style="{ width: go ? r.v + '%' : '0%' }"></i></span><b>{{ r.v }}%</b></div>
              </template>
              <template v-else-if="id === 'funnel'">
                <small>Team pipeline</small>
                <div class="fn"><i v-for="(f, k) in funnel" :key="k" :style="{ width: go ? f + '%' : '0%' }"></i></div>
              </template>
              <template v-else-if="id === 'risk'">
                <small>Deals at risk</small>
                <strong class="big">2</strong>
                <em>No activity in 14 days</em>
              </template>
              <template v-else-if="id === 'tquota'">
                <small>Team total</small>
                <strong class="big">LKR 7.4M</strong>
                <em>Quota 10.0M</em>
              </template>

              <!-- owner -->
              <template v-else-if="id === 'rev'">
                <small>Company revenue</small>
                <div class="rv"><strong class="big">LKR 18.4M</strong><svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline :points="sparkPts" :class="{ go }" pathLength="1" /></svg></div>
              </template>
              <template v-else-if="id === 'branch'">
                <small>Branch performance</small>
                <div v-for="b in branches" :key="b.n" class="hb"><span>{{ b.n }}</span><span class="tr"><i :style="{ width: go ? b.v + '%' : '0%' }"></i></span><b>{{ b.r }}</b></div>
              </template>
              <template v-else-if="id === 'amc'">
                <small>AMC renewals due</small>
                <strong class="big">12</strong>
                <em>Next 30 days</em>
              </template>
              <template v-else>
                <small>Outstanding invoices</small>
                <strong class="big">LKR 2.1M</strong>
                <em>9 overdue</em>
              </template>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.db {
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
.db *, .db *::before, .db *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.db h2 .l1 { color: #111111 !important; opacity: 1; }
.db h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .08s; }

.stage { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 18px; align-items: stretch; }

.who { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.who li { flex: 1; display: flex; }
.who button { all: unset; box-sizing: border-box; cursor: pointer; flex: 1; display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 20px; border: 1px solid var(--line); transition: all .3s; }
.who button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.who button.on { background: var(--ink); border-color: var(--ink); color: #fff; }
.av { width: 46px; height: 46px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.nm { display: flex; flex-direction: column; }
.nm strong { font-size: 15px; font-weight: 600; }
.nm small { font-size: 12.5px; color: var(--muted); transition: color .3s; }
.on .nm small { color: rgba(255, 255, 255, .7); }

.win { background: var(--sky); border-radius: 28px; padding: 18px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.bar { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; padding: 2px 4px; }
.ttl { font-size: 15px; font-weight: 600; }
.scope { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #fff; color: var(--muted); }
.scope.sh { background: var(--mint); color: var(--mint-i); }

.gd { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; min-height: 340px; align-content: start; }
.wd { grid-column: span 1; background: #fff; border-radius: 18px; padding: 16px; display: flex; flex-direction: column; gap: 8px; min-width: 0; animation: rise .5s ease both; }
.wd.w { grid-column: span 2; }
.wd small { font-size: 11.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.wd em { font-style: normal; font-size: 12.5px; color: var(--muted); }
.big { font-size: 28px; font-weight: 500; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.wd-move { transition: transform .6s cubic-bezier(.2, .8, .2, 1); }
.wd-enter-active { animation: rise .5s ease both; }
.wd-leave-active { display: none; }
@keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

.tk { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; }
.tk li { display: flex; align-items: center; gap: 10px; }
.tk i { width: 16px; height: 16px; border-radius: 5px; border: 1.5px solid #cfd2d8; flex: none; position: relative; }
.tk .done { color: #a0a5ad; text-decoration: line-through; }
.tk .done i { background: var(--mint-i); border-color: var(--mint-i); }
.ring { position: relative; width: 84px; height: 84px; }
.ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring circle { fill: none; stroke-width: 4; }
.ring .bg { stroke: #eef1f4; }
.ring .fg { stroke: var(--lav-i); stroke-linecap: round; stroke-dasharray: 100.5; transition: stroke-dashoffset 1.2s cubic-bezier(.2, .8, .2, 1); }
.ring strong { position: absolute; inset: 0; display: grid; place-items: center; font-size: 18px; font-weight: 600; }

.hb { display: grid; grid-template-columns: 62px 1fr 44px; align-items: center; gap: 10px; font-size: 12.5px; margin-top: 4px; }
.hb b { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
.tr { height: 8px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.tr i { display: block; height: 100%; background: var(--sky-i); border-radius: 4px; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.fn { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-top: 6px; }
.fn i { display: block; height: 14px; background: var(--mint-i); border-radius: 6px; opacity: .85; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.rv { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.rv svg { width: 46%; height: 44px; overflow: visible; }
.rv polyline { fill: none; stroke: var(--ink); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease; }
.rv polyline.go { stroke-dashoffset: 0; }

@media (max-width: 960px) {
  .stage { grid-template-columns: 1fr; }
  .who { flex-direction: row; }
  .who button { flex-direction: column; text-align: center; padding: 12px 8px; gap: 8px; }
  .nm { align-items: center; }
  .gd { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .db { padding: 64px 16px; }
  .win { padding: 12px; border-radius: 22px; }
  .gd { grid-template-columns: 1fr; }
  .wd.w { grid-column: span 1; }
  .nm small { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; animation: none !important; }
}
</style>
