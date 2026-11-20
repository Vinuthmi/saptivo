<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ExportSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const manual = ref(-1);
const ok = ref(true);
const still = ref(false);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const formats = [
  { k: "Excel", ext: "xlsx", tone: "mint" },
  { k: "CSV", ext: "csv", tone: "sky" },
  { k: "PDF", ext: "pdf", tone: "rose" },
];
const rows = [
  { m: "Sales", a: "LKR 18.4M", b: "LKR 2.76M", c: "31%" },
  { m: "Services", a: "LKR 6.2M", b: "LKR 0.93M", c: "44%" },
  { m: "Spare parts", a: "LKR 3.1M", b: "LKR 0.47M", c: "27%" },
];

const idx = computed(() => {
  if (manual.value >= 0) return manual.value;
  return reduce ? 0 : Math.floor(n.value / 6) % 3;
});
const sub = computed(() => (manual.value >= 0 || reduce ? 5 : n.value % 6));

function state(i) {
  if (still.value) return "done";
  if (i < idx.value) return "done";
  if (i > idx.value) return "idle";
  if (sub.value >= 4) return "done";
  if (sub.value >= 2) return "run";
  if (sub.value === 1) return "press";
  return "idle";
}
function pct(i) {
  const s = state(i);
  if (s === "done") return 100;
  if (s === "run") return sub.value === 2 ? 55 : 100;
  return 0;
}

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce || manual.value >= 0) return;
  timer = setInterval(tick, 800);
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
  <section ref="root" class="ex" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Export for</span> <span class="l2">tax and audit</span></h2>
        <p>
          Export any report to Excel, CSV or PDF in one click, including tax and margin reports your accountant needs.
        </p>
      </header>

      <div class="stage">
        <!-- report -->
        <article class="rp">
          <div class="rh"><strong>Tax and margin report</strong><span class="pill">November 2026</span></div>
          <table>
            <thead><tr><th>Category</th><th>Sales</th><th>Tax</th><th>Margin</th></tr></thead>
            <tbody>
              <tr v-for="r in rows" :key="r.m"><td>{{ r.m }}</td><td>{{ r.a }}</td><td>{{ r.b }}</td><td><b>{{ r.c }}</b></td></tr>
            </tbody>
          </table>
          <div class="acct">
            <span class="av"><img v-if="ok" :src="photo" alt="" @error="ok = false" /><b v-else>A</b></span>
            <span>Ready for your accountant</span>
          </div>
        </article>

        <!-- export -->
        <div class="xp">
          <ul>
            <li v-for="(f, i) in formats" :key="f.k" :class="[f.tone, state(i)]">
              <div class="top">
                <span class="ic">{{ f.ext }}</span>
                <span class="nm"><strong>{{ f.k }}</strong><small>{{ state(i) === "done" ? "tax-report-nov-2026." + f.ext : "One click" }}</small></span>
                <button type="button" class="btn" :class="{ ok: state(i) === 'done' }" @click="pick(i)">
                  <template v-if="state(i) === 'done'"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>Downloaded</template>
                  <template v-else>Export</template>
                </button>
              </div>
              <div class="trk"><i :style="{ width: pct(i) + '%' }"></i></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ex {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.ex *, .ex *::before, .ex *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ex h2 .l1 { color: #111111 !important; opacity: 1; }
.ex h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .08s; }

.stage { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 18px; align-items: stretch; }

.rp { background: var(--lav); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.rh { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.rh strong { font-size: 15px; font-weight: 600; }
.pill { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #fff; color: var(--lav-i); }
table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 16px; overflow: hidden; font-size: 13px; }
th { text-align: left; font-size: 11.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); padding: 12px 14px; border-bottom: 1px solid var(--line); }
td { padding: 14px; border-bottom: 1px solid var(--line); font-variant-numeric: tabular-nums; white-space: nowrap; }
tr:last-child td { border-bottom: 0; }
td:first-child { font-weight: 500; }
td b { color: var(--mint-i); font-weight: 600; }
.acct { margin-top: auto; display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 14px; padding: 10px 14px; font-size: 13px; font-weight: 500; }
.av { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 12px; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.xp { display: flex; }
.xp ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; width: 100%; }
.xp li { flex: 1; border-radius: 24px; padding: 18px 20px; display: flex; flex-direction: column; justify-content: center; gap: 14px; border: 1.5px solid transparent; transition: border-color .3s; }
.xp li.mint { background: var(--mint); }
.xp li.sky { background: var(--sky); }
.xp li.rose { background: var(--rose); }
.xp li.press, .xp li.run { border-color: var(--ink); }
.top { display: flex; align-items: center; gap: 14px; }
.ic { width: 46px; height: 46px; border-radius: 14px; background: #fff; display: grid; place-items: center; font-size: 11.5px; font-weight: 700; text-transform: uppercase; flex: none; }
.mint .ic { color: var(--mint-i); } .sky .ic { color: var(--sky-i); } .rose .ic { color: var(--rose-i); }
.nm { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.nm strong { font-size: 15px; font-weight: 600; }
.nm small { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.btn { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 99px; background: var(--ink); color: #fff; font-size: 12.5px; font-weight: 600; transition: transform .2s, background .3s; flex: none; }
.btn:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.press .btn { transform: scale(.94); }
.btn.ok { background: #fff; color: var(--mint-i); }
.trk { height: 6px; border-radius: 4px; background: rgba(255, 255, 255, .7); overflow: hidden; }
.trk i { display: block; height: 100%; background: var(--ink); border-radius: 4px; transition: width .7s ease; }

@media (max-width: 900px) {
  .stage { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .ex { padding: 64px 16px; }
  .rp { padding: 16px; border-radius: 22px; overflow-x: auto; }
  table { min-width: 420px; }
  .xp li { padding: 16px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
