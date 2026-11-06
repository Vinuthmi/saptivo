<template>
  <section id="role-benefits" ref="root" class="rb" :class="{ in: seen, live }" aria-labelledby="rb-title">
    <h2 id="rb-title" class="title">
      <span>Benefits for</span>
      <span class="soft">every role</span>
    </h2>

    <div class="grid">
      <article v-for="(r, i) in roles" :key="r.id" class="card" :class="[r.tone, { act: i === active }]" :style="{ '--i': i }" tabindex="0" @click="pick(i)" @keydown.enter="pick(i)">
        <header>
          <span class="pill">{{ r.role }}</span>
          <span class="live-dot" aria-hidden="true"></span>
        </header>
        <p class="text">{{ r.text }}</p>

        <!-- sales reps -->
        <div v-if="r.id === 'rep'" :key="'rep' + (i === active)" class="w w-rep">
          <p class="cap">Next on your deals</p>
          <ul>
            <li style="--d: 0.2s"><span class="cb"></span><span class="tx"><b>Call Nimal Perera</b><small>ABC Solar · today 3:00 PM</small></span><em>Due</em></li>
            <li style="--d: 0.9s"><span class="cb"></span><span class="tx"><b>Send revised quotation</b><small>Lanka Power · tomorrow</small></span></li>
            <li style="--d: 1.6s"><span class="cb"></span><span class="tx"><b>Book site visit</b><small>Galle Hardware · Friday</small></span></li>
          </ul>
        </div>

        <!-- managers -->
        <div v-else-if="r.id === 'mgr'" class="w w-mgr">
          <p class="cap">Days in current stage</p>
          <ul>
            <li v-for="(d, k) in stuck" :key="d.n" :class="{ flag: d.days > 14 }">
              <span class="nm">{{ d.n }}</span>
              <span class="trk"><i :style="{ width: (d.days / 24) * 100 + '%', '--d': k * 0.2 + 's' }"></i></span>
              <b>{{ d.days }}d</b>
            </li>
          </ul>
          <p class="note"><span class="warn">!</span>Kandy Textiles has been stuck for 21 days. Time to coach.</p>
        </div>

        <!-- owners -->
        <div v-else-if="r.id === 'own'" class="w w-own">
          <p class="cap">Weighted forecast · this quarter</p>
          <p :key="'f' + (i === active)" class="big">Rs 18.4M</p>
          <div class="spark">
            <i v-for="(h, k) in spark" :key="k" :style="{ height: h + '%', '--d': k * 0.08 + 's' }"></i>
          </div>
          <p class="auto"><span class="ok">✓</span>Updated automatically. No chasing.</p>
        </div>

        <!-- operations -->
        <div v-else class="w w-ops">
          <p class="cap">About to close · plan delivery</p>
          <ul>
            <li v-for="(o, k) in ops" :key="o.n" :style="{ '--d': k * 0.35 + 's' }">
              <span class="day">{{ o.day }}</span>
              <span class="tx"><b>{{ o.n }}</b><small>{{ o.what }}</small></span>
              <span class="amt">{{ o.p }}%</span>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "RoleBenefitsSection" });

const roles = [
  { id: "rep", tone: "mint", role: "Sales reps", text: "Sales reps see exactly what to do next on each deal and never miss a follow-up." },
  { id: "mgr", tone: "lav", role: "Sales managers", text: "Sales managers spot stuck deals early and coach with real data." },
  { id: "own", tone: "butter", role: "Owners", text: "Owners get a reliable forecast without chasing updates." },
  { id: "ops", tone: "sky", role: "Operations", text: "Operations know what's about to close and can plan delivery." },
];
const stuck = [
  { n: "ABC Solar", days: 4 },
  { n: "Lanka Power", days: 9 },
  { n: "Ceylon Motors", days: 12 },
  { n: "Kandy Textiles", days: 21 },
];
const spark = [38, 44, 41, 55, 60, 58, 72, 80];
const ops = [
  { n: "ABC Solar", what: "5 kW system · install in 2 weeks", day: "Mon", p: 90 },
  { n: "Lanka Power", what: "Panels + inverter · order stock", day: "Wed", p: 75 },
  { n: "Galle Hardware", what: "Training day · book trainer", day: "Fri", p: 60 },
];

const active = ref(0);
const manual = ref(false);
function pick(i) {
  manual.value = true; // the visitor chose a role; stop rotating
  active.value = i;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function step() {
  if (manual.value) return;
  active.value = (active.value + 1) % roles.length;
}
function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 4200);
}
function halt() {
  live.value = false;
  if (st.timer !== null) {
    window.clearInterval(st.timer);
    st.timer = null;
  }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true;
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) begin();
      else halt();
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  st.fallback = window.setTimeout(() => {
    if (!seen.value) seen.value = true;
  }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  halt();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.rb {
  --ink: #14120f;
  --muted: #6a6560;
  --rose: #fde3ea; --rose-d: #d8567f;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.rb *, .rb *::before, .rb *::after { box-sizing: border-box; }
.rb .card:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

.mint { --bg: #eaf8f0; --mid: #c9ecd9; --deep: #2f9c6b; }
.lav { --bg: #f1eeff; --mid: #ddd6ff; --deep: #7d6be6; }
.butter { --bg: #fff6dc; --mid: #fde9a8; --deep: #a77d00; }
.sky { --bg: #eaf4fd; --mid: #cfe4f8; --deep: #3f87c7; }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }

.grid { width: min(1180px, calc(100% - 40px)); margin: 56px auto 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.card {
  display: flex; flex-direction: column; gap: 16px; padding: 28px; border-radius: 30px; background: var(--bg); border: 1px solid transparent; cursor: pointer;
  transition: border-color 0.4s, box-shadow 0.4s, transform 0.4s, opacity 0.4s;
}
.card:not(.act) { opacity: 0.82; }
.card:hover { opacity: 1; }
.card.act { border-color: var(--deep); box-shadow: 0 18px 40px rgba(20, 18, 15, 0.08); transform: translateY(-3px); opacity: 1; }
.card header { display: flex; align-items: center; justify-content: space-between; }
.pill { padding: 5px 14px; border-radius: 99px; background: var(--mid); font-size: 12.5px; font-weight: 600; }
.live-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--deep); opacity: 0; transition: opacity 0.3s; }
.act .live-dot { opacity: 1; animation: blink 1.6s ease-in-out infinite; }
.rb:not(.live) .live-dot { animation-play-state: paused; }
.text { margin: 0; font-size: 19px; font-weight: 500; line-height: 1.5; letter-spacing: -0.015em; }

.w { flex: 1; min-height: 210px; padding: 18px; border-radius: 22px; background: #fff; }
.cap { margin: 0 0 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.w ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.tx b { display: block; font-size: 13px; font-weight: 500; }
.tx small { display: block; font-size: 11.5px; color: var(--muted); }

/* reps */
.w-rep li { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; background: var(--bg); }
.cb { position: relative; flex: none; width: 20px; height: 20px; border: 2px solid var(--deep); border-radius: 6px; background: var(--deep); }
.cb::after { content: "✓"; position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-size: 11px; }
.w-rep li .tx { flex: 1; }
.w-rep em { padding: 2px 10px; border-radius: 99px; background: var(--rose); color: var(--rose-d); font-size: 10.5px; font-style: normal; font-weight: 600; }
.act .w-rep li .cb { animation: uncheck 0.01s backwards, check 0.4s cubic-bezier(0.3, 1.5, 0.5, 1) var(--d) both; }
.act .w-rep li { animation: pop 0.45s ease backwards; }
.act .w-rep li:nth-child(1) { animation-delay: 0s; }

/* managers */
.w-mgr li { display: grid; grid-template-columns: 96px 1fr 34px; align-items: center; gap: 10px; font-size: 12.5px; }
.nm { color: var(--muted); }
.trk { height: 10px; border-radius: 99px; background: var(--bg); overflow: hidden; }
.trk i { display: block; height: 100%; border-radius: 99px; background: var(--deep); }
.w-mgr b { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
.flag .trk { background: var(--rose); }
.flag .trk i { background: var(--rose-d); }
.flag b, .flag .nm { color: var(--rose-d); font-weight: 600; }
.act .trk i { animation: grow 0.9s cubic-bezier(0.3, 0.7, 0.2, 1) var(--d) backwards; }
.note { display: flex; align-items: center; gap: 10px; margin: 14px 0 0; padding: 10px 12px; border-radius: 12px; background: var(--rose); font-size: 12px; line-height: 1.5; }
.warn { flex: none; display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: var(--rose-d); color: #fff; font-size: 11px; font-weight: 700; }
.act .note { animation: pop 0.5s ease 1.1s backwards; }

/* owners */
.big { margin: 0; font-size: 40px; font-weight: 500; letter-spacing: -0.03em; }
.act .big { animation: pop 0.6s cubic-bezier(0.3, 1.3, 0.5, 1) backwards; }
.spark { display: flex; align-items: flex-end; gap: 7px; height: 72px; margin-top: 12px; }
.spark i { flex: 1; border-radius: 6px 6px 2px 2px; background: var(--mid); transform-origin: bottom; }
.spark i:last-child { background: var(--deep); }
.act .spark i { animation: rise-bar 0.7s cubic-bezier(0.3, 0.7, 0.2, 1) var(--d) backwards; }
.auto { display: flex; align-items: center; gap: 8px; margin: 14px 0 0; font-size: 12.5px; color: var(--muted); }
.ok { display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; background: #d3f0e1; color: #1d7a52; font-size: 10px; font-weight: 700; }

/* ops */
.w-ops li { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; background: var(--bg); }
.day { flex: none; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 12px; background: #fff; font-size: 12px; font-weight: 600; color: var(--deep); }
.w-ops li .tx { flex: 1; min-width: 0; }
.amt { font-size: 12px; font-weight: 600; color: var(--deep); }
.act .w-ops li { animation: pop 0.5s cubic-bezier(0.3, 1.3, 0.5, 1) var(--d) backwards; }

@keyframes pop { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes check { from { background: #fff; } to { background: var(--deep); } }
@keyframes uncheck { from { background: #fff; } to { background: #fff; } }
@keyframes grow { from { width: 0; } }
@keyframes rise-bar { from { transform: scaleY(0); } to { transform: none; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* entrance (runs once) */
.rb:not(.in) .grid { opacity: 0; }
.rb.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.rb.in .title .soft { animation-delay: 0.1s; }
.rb.in .card { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) calc(var(--i) * 0.12s + 0.2s) backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 860px) {
  .grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .rb { padding: 72px 0; }
  .card { padding: 20px; border-radius: 24px; }
  .text { font-size: 17px; }
  .w-mgr li { grid-template-columns: 84px 1fr 32px; }
}
@media (prefers-reduced-motion: reduce) {
  .rb *, .rb *::before, .rb *::after { animation: none !important; transition: none !important; }
  .rb:not(.in) .grid { opacity: 1; }
}
</style>
