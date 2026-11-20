<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AdvancedAnalyticsSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
const manual = ref(false);
const still = ref(false);
const ok = ref([true, true, true, true, true]);
const okAv = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";

const man = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";
// one photo per card; swap any path (10.jpg, 13.jpg are your own files)
const photos = [man, base + "13.jpg", photo, base + "10.jpg", photo];
const pos = ["center 20%", "center", "center 20%", "center", "center 70%"];

const items = [
  { t: "Cohort and retention analysis", tone: "lav" },
  { t: "Multi-touch revenue attribution", tone: "sky" },
  { t: "Custom metric builder", tone: "mint" },
  { t: "Embedding for Power BI, Tableau or Looker Studio", tone: "butter" },
  { t: "Data warehouse export", tone: "rose" },
];
const cohorts = [
  { m: "Jun", v: [100, 82, 71, 64, 58] },
  { m: "Jul", v: [100, 80, 69, 61] },
  { m: "Aug", v: [100, 85, 74] },
  { m: "Sep", v: [100, 83] },
  { m: "Oct", v: [100] },
];
const touches = [
  { n: "Facebook ad", p: 20 },
  { n: "Email", p: 25 },
  { n: "WhatsApp", p: 30 },
  { n: "Sales call", p: 25 },
];
const tools = ["Power BI", "Tableau", "Looker Studio"];
const tables = ["contacts", "deals", "invoices", "tickets"];

function on(i) {
  return idx.value === i || still.value;
}
function next() {
  idx.value = (idx.value + 1) % items.length;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 3400);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  idx.value = i;
  manual.value = true;
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
  <section ref="root" class="aa" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Advanced</span> <span class="l2">analytics</span></h2>
        <p>
          For larger organisations, Saptivo adds cohort and retention analysis, multi-touch revenue attribution, a
          custom metric builder, embedding for Power BI, Tableau or Looker Studio, and data warehouse export.
        </p>
      </header>

      <div class="row">
        <button v-for="(it, i) in items" :key="it.t" type="button" class="pn" :class="[it.tone, { act: idx === i }]" :aria-expanded="idx === i" @click="pick(i)">
          <span class="ph">
            <img v-if="ok[i]" :src="photos[i]" :style="{ objectPosition: pos[i] }" alt="" @error="ok[i] = false" />
            <span class="no">{{ i + 1 }}</span>
            <span class="ti">{{ it.t }}</span>
          </span>
          <span class="tv">{{ it.t }}</span>

          <span class="body" :class="{ show: idx === i }">
            <!-- cohort -->
            <span v-if="i === 0" class="vz co">
              <span v-for="(c, r) in cohorts" :key="c.m" class="cr">
                <em>{{ c.m }}</em>
                <i v-for="(v, k) in c.v" :key="k" :style="{ background: 'rgba(106, 89, 214, ' + (v / 100) * 0.85 + ')', transitionDelay: (r + k) * 60 + 'ms' }"><b v-if="v < 100 && on(i)">{{ v }}</b></i>
              </span>
              <small>Share of customers still active, by month since first purchase</small>
            </span>

            <!-- attribution -->
            <span v-else-if="i === 1" class="vz at">
              <span class="ch">
                <span v-for="t in touches" :key="t.n" class="tc"><b>{{ t.n }}</b><em>{{ on(i) ? t.p + "%" : "0%" }}</em></span>
              </span>
              <span class="sp"><i v-for="(t, k) in touches" :key="t.n" :style="{ width: on(i) ? t.p + '%' : '0%', background: ['#9ec5e6', '#6fa8d6', '#3a7fbd', '#235f93'][k] }"></i></span>
              <small>Credit shared across every touch that led to the LKR 400,000 deal</small>
            </span>

            <!-- metric builder -->
            <span v-else-if="i === 2" class="vz mb">
              <span class="who"><span class="av"><img v-if="okAv" :src="photo" alt="" @error="okAv = false" /><b v-else>S</b></span>Shanika is building a metric</span>
              <span class="fm"><em>Revenue</em><u>÷</u><em>Customers</em><u>=</u><strong :class="{ rs: on(i) }">LKR 128k</strong></span>
              <small>Revenue per customer</small>
            </span>

            <!-- embed -->
            <span v-else-if="i === 3" class="vz em">
              <span class="tl"><em v-for="(t, k) in tools" :key="t" :class="{ hot: on(i) && k === 0 }">{{ t }}</em></span>
              <span class="fr">
                <span class="fb"><i v-for="h in [40, 62, 48, 78, 66]" :key="h" :style="{ height: on(i) ? h + '%' : '0%' }"></i></span>
              </span>
              <small>Saptivo data inside your own BI dashboards</small>
            </span>

            <!-- warehouse -->
            <span v-else class="vz wh">
              <span class="fl">
                <span class="src">Saptivo</span>
                <span class="ar" :class="{ go: on(i) }"></span>
                <span class="dst">Data warehouse</span>
              </span>
              <span class="tb"><em v-for="(t, k) in tables" :key="t" :style="{ transitionDelay: k * 120 + 'ms' }" :class="{ ok: on(i) }">{{ t }}</em></span>
              <small>Scheduled export, last sync 06:00</small>
            </span>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aa {
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
.aa *, .aa *::before, .aa *::after { box-sizing: border-box; }
.wrap { max-width: 1200px; margin: 0 auto; }
.head { text-align: center; max-width: 840px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.aa h2 .l1 { color: #111111 !important; opacity: 1; }
.aa h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .row { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .row { opacity: 1; transform: none; }
.in .row { transition-delay: .08s; }

.row { display: flex; gap: 12px; height: 580px; }
.pn { all: unset; box-sizing: border-box; cursor: pointer; flex: 1 1 0; min-width: 0; border-radius: 28px; padding: 0; display: flex; flex-direction: column; gap: 0; overflow: hidden; position: relative; transition: flex-grow .7s cubic-bezier(.3, .8, .2, 1); border: 1.5px solid transparent; }
.pn:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.pn.act { flex-grow: 5.2; border-color: var(--ink); cursor: default; }
.pn.lav { background: var(--lav); } .pn.sky { background: var(--sky); } .pn.mint { background: var(--mint); }
.pn.butter { background: var(--butter); } .pn.rose { background: var(--rose); }

.ph { position: relative; flex: 0 0 50%; overflow: hidden; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); display: block; }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.no { position: absolute; top: 14px; left: 14px; width: 28px; height: 28px; border-radius: 50%; background: #fff; display: grid; place-items: center; font-size: 12.5px; font-weight: 600; transition: all .3s; }
.act .no { background: var(--ink); color: #fff; }
.ti { position: absolute; left: 14px; right: 14px; bottom: 14px; background: #fff; border-radius: 14px; padding: 10px 14px; font-size: 15px; font-weight: 500; line-height: 1.35; letter-spacing: -.01em; opacity: 0; transform: translateY(8px); transition: opacity .4s .2s, transform .4s .2s; }
.act .ti { opacity: 1; transform: none; }
.tv { display: none; }
.pn:not(.act) .tv { display: block; writing-mode: vertical-rl; transform: rotate(180deg); font-size: 15px; font-weight: 500; white-space: nowrap; padding: 16px 0 0 0; align-self: center; flex: 1; }

.body { margin-top: 0; flex: 1; padding: 14px; opacity: 0; transform: translateY(12px); pointer-events: none; transition: opacity .4s ease, transform .5s ease; width: 100%; min-width: 0; display: none; }
.body.show { display: flex; flex-direction: column; justify-content: center; opacity: 1; transform: none; transition-delay: .25s; animation: pop .5s ease .25s both; }
@keyframes pop { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.vz { display: flex; flex-direction: column; gap: 12px; background: #fff; border-radius: 18px; padding: 14px; font-size: 12.5px; color: var(--muted); }
.vz small { font-size: 12px; color: var(--muted); line-height: 1.5; }

.co { gap: 6px; }
.cr { display: flex; gap: 6px; align-items: center; }
.cr em { width: 30px; font-style: normal; font-size: 11.5px; color: var(--muted); }
.cr i { flex: 1; height: 24px; border-radius: 8px; display: grid; place-items: center; transition: background .6s; }
.cr i b { font-size: 11px; font-weight: 600; color: #fff; }
.co small { margin-top: 4px; }

.ch { display: flex; flex-wrap: wrap; gap: 8px; }
.tc { display: flex; flex-direction: column; background: #f6f7f9; border-radius: 12px; padding: 10px 14px; flex: 1 1 100px; }
.tc b { font-size: 13px; font-weight: 500; color: var(--ink); }
.tc em { font-style: normal; font-size: 18px; font-weight: 600; color: var(--sky-i); font-variant-numeric: tabular-nums; }
.sp { display: flex; height: 12px; border-radius: 6px; overflow: hidden; gap: 2px; background: #eef1f4; }
.sp i { display: block; height: 100%; transition: width 1.1s cubic-bezier(.2, .8, .2, 1); }

.who { display: flex; align-items: center; gap: 10px; color: var(--ink); font-weight: 500; }
.av { width: 30px; height: 30px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-size: 12px; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.fm { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.fm em { font-style: normal; font-weight: 600; padding: 8px 14px; border-radius: 10px; background: var(--mint); color: var(--mint-i); }
.fm u { text-decoration: none; font-size: 18px; color: var(--muted); }
.fm strong { font-size: 22px; font-weight: 500; letter-spacing: -.02em; color: var(--ink); opacity: .3; transition: opacity .6s .5s; }
.fm strong.rs { opacity: 1; }

.tl { display: flex; flex-wrap: wrap; gap: 6px; }
.tl em { font-style: normal; font-weight: 600; padding: 5px 12px; border-radius: 8px; background: #f1f2f4; transition: all .4s; }
.tl em.hot { background: var(--butter); color: var(--butter-i); }
.fr { background: #f6f7f9; border-radius: 12px; padding: 12px; height: 110px; display: flex; align-items: flex-end; }
.fb { display: flex; align-items: flex-end; gap: 10px; width: 100%; height: 100%; }
.fb i { flex: 1; border-radius: 6px 6px 0 0; background: #d8b13a; transition: height 1s cubic-bezier(.2, .8, .2, 1); }

.fl { display: flex; align-items: center; gap: 12px; }
.src, .dst { padding: 10px 14px; border-radius: 12px; font-weight: 600; color: var(--ink); background: #f1f2f4; }
.dst { background: var(--rose); color: var(--rose-i); }
.ar { flex: 1; height: 2px; background: repeating-linear-gradient(90deg, #c9ccd2 0 6px, transparent 6px 10px); position: relative; overflow: hidden; }
.ar.go::after { content: ""; position: absolute; top: -2px; width: 22px; height: 6px; border-radius: 3px; background: var(--rose-i); animation: move 1.6s ease-in-out infinite; }
@keyframes move { from { left: -22px; } to { left: 100%; } }
.tb { display: flex; flex-wrap: wrap; gap: 6px; }
.tb em { font-style: normal; font-weight: 500; padding: 5px 12px; border-radius: 8px; background: #f1f2f4; transition: all .4s; }
.tb em.ok { background: var(--mint); color: var(--mint-i); }

@media (max-width: 900px) {
  .row { flex-direction: column; height: auto; }
  .pn { flex: none; border-radius: 22px; transition: none; }
  .pn.act { flex-grow: 0; }
  .ph { flex: none; height: 150px; }
  .pn:not(.act) .tv { writing-mode: horizontal-tb; transform: none; padding: 14px 18px; flex: none; align-self: stretch; font-size: 15.5px; white-space: normal; }
  .pn.act .ph { height: 190px; }
  .body { padding: 12px; }
}
@media (max-width: 640px) {
  .aa { padding: 64px 16px; }
  .cr i { height: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .row { opacity: 1; transform: none; transition: none; }
  .ar.go::after { animation: none; left: 40%; }
  * { transition-duration: 0s !important; animation: none !important; }
}
</style>
