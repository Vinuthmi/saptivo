<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "VodiaOr3cxSection" });

const root = ref(null);
const shown = ref(false);
const tick = ref(0);
let timer = null;
let io = null;
let reduce = false;
const CYCLE = 12;

const base = "/saptivo/images/features/";
const photos = [
  base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
  base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG",
];
const ok = ref([true, true]);

const pool = [
  { s: "v", t: "Inbound · Dilani Perera", d: "Answered by the AI voice agent · 02:14" },
  { s: "3", t: "Outbound · Ravi Fernando", d: "Ext 103 · 01:47" },
  { s: "v", t: "Outbound AI call · Malini Jayasuriya", d: "Visit confirmed · 00:38" },
  { s: "3", t: "Missed call · Hasitha Traders", d: "Callback task created" },
  { s: "v", t: "Inbound · Sewwandi K.", d: "Transferred to Nimali · 03:05" },
  { s: "3", t: "Inbound · Kasun Silva", d: "Ext 101 · 04:32" },
];

const seq = computed(() => tick.value % CYCLE);
const cycle = computed(() => Math.floor(tick.value / CYCLE));
const feed = computed(() => {
  const from = Math.max(0, seq.value - 3);
  const out = [];
  for (let i = seq.value; i >= from; i--) out.push({ id: cycle.value * 100 + i, ...pool[i % pool.length] });
  return out;
});
const counts = computed(() => {
  let v = 0;
  let t = 0;
  for (let i = 0; i <= seq.value; i++) {
    if (pool[i % pool.length].s === "v") v++;
    else t++;
  }
  return { v, t };
});
const latest = computed(() => pool[seq.value % pool.length].s);
const vPct = computed(() => Math.round((counts.value.v / (counts.value.v + counts.value.t)) * 100));

function start() {
  if (timer || reduce) return;
  timer = setInterval(() => (tick.value += 1), 1500);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    tick.value = 5;
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
  <section ref="root" class="vx" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Vodia</span> <span class="l2">or 3CX?</span></h2>
        <p>
          Saptivo works with both. Choose Vodia if you want a multi-tenant PBX with built-in AI voice agents, or 3CX
          if that is your existing phone system. Either way, calls land on the same customer timeline and in the same
          reports.
        </p>
      </header>

      <div class="choices">
        <!-- Vodia -->
        <article class="opt tone-lav" :class="{ hot: latest === 'v' }">
          <div class="ph">
            <img v-if="ok[0]" :src="photos[0]" alt="" @error="ok[0] = false" />
            <span class="glass">Vodia</span>
          </div>
          <div class="ob">
            <h3>Choose Vodia</h3>
            <p>if you want a multi-tenant PBX with built-in AI voice agents.</p>
            <ul>
              <li>Multi-tenant PBX</li>
              <li>Built-in AI voice agents</li>
            </ul>
          </div>
        </article>

        <!-- 3CX -->
        <article class="opt tone-sky" :class="{ hot: latest === '3' }">
          <div class="ph">
            <img v-if="ok[1]" :src="photos[1]" alt="" @error="ok[1] = false" />
            <span class="glass">3CX</span>
          </div>
          <div class="ob">
            <h3>Choose 3CX</h3>
            <p>if that is your existing phone system.</p>
            <ul>
              <li>Keep the phone system you already use</li>
            </ul>
          </div>
        </article>

        <!-- pipes -->
        <div class="pipe pv"><i :key="'v' + tick" :class="{ go: latest === 'v' }"></i></div>
        <div class="pipe p3"><i :key="'t' + tick" :class="{ go: latest === '3' }"></i></div>
      </div>

      <!-- shared -->
      <div class="shared" role="img" aria-label="Calls from Vodia and 3CX land on the same customer timeline and in the same reports">
        <div class="join"><span>Either way, the same</span></div>

        <div class="col tlc">
          <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" /></svg>Customer timeline</h4>
          <TransitionGroup name="row" tag="ul" class="feed">
            <li v-for="e in feed" :key="e.id" class="ev" :class="e.s === 'v' ? 'v' : 't'">
              <em>{{ e.s === "v" ? "Vodia" : "3CX" }}</em>
              <div><strong>{{ e.t }}</strong><span>{{ e.d }}</span></div>
            </li>
          </TransitionGroup>
        </div>

        <div class="col rp">
          <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></svg>Reports</h4>
          <div class="big"><strong>{{ counts.v + counts.t }}</strong><span>calls in one report</span></div>
          <div class="stack">
            <i class="sv" :style="{ width: vPct + '%' }"></i>
            <i class="s3" :style="{ width: 100 - vPct + '%' }"></i>
          </div>
          <div class="legend">
            <span><b class="d v"></b>Vodia · {{ counts.v }}</span>
            <span><b class="d t"></b>3CX · {{ counts.t }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.vx {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #fff 0%, #f8f6ff 100%);
  padding: 96px 16px;
}
.wrap { max-width: 1040px; margin: 0 auto; }
.head { text-align: center; max-width: 760px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--lav); color: var(--lav-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 18px; font-size: clamp(40px, 4.6vw, 64px); font-weight: 500; line-height: 1.08; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.vx h2 .l1 { color: #111111 !important; opacity: 1; }
.vx h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .choices, .shared { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .choices, .in .shared { opacity: 1; transform: none; }
.in .choices { transition-delay: .1s; }
.in .shared { transition-delay: .2s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }

/* choices */
.choices { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding-bottom: 44px; }
.opt { background: var(--tb); border: 1px solid var(--line); border-radius: 28px; overflow: hidden; display: flex; flex-direction: column; transition: border-color .4s, box-shadow .4s, transform .4s; }
.opt.hot { border-color: var(--ti); box-shadow: 0 18px 44px rgba(60, 50, 120, .12); transform: translateY(-3px); }
.ph { position: relative; height: 190px; background: linear-gradient(135deg, var(--t), #fff); overflow: hidden; }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.glass { position: absolute; left: 16px; top: 16px; font-size: 14px; font-weight: 700; letter-spacing: .02em; padding: 8px 18px; border-radius: 99px; background: rgba(255, 255, 255, .8); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); color: var(--ti); }
.ob { padding: 22px 24px 26px; }
.ob h3 { margin: 0 0 6px; font-size: 24px; font-weight: 600; letter-spacing: -.02em; }
.ob p { margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: var(--muted); }
.ob ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.ob li { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; background: #fff; padding: 8px 14px; border-radius: 99px; }
.ob li::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--ti); }

/* pipes */
.pipe { position: absolute; bottom: 0; width: 2px; height: 44px; background: repeating-linear-gradient(180deg, #cfcbe0 0 5px, transparent 5px 10px); }
.pv { left: 25%; }
.p3 { left: 75%; }
.pipe i { position: absolute; left: -4px; top: 0; width: 10px; height: 10px; border-radius: 50%; opacity: 0; }
.pv i { background: var(--lav-i); }
.p3 i { background: var(--sky-i); }
.pipe i.go { animation: drop 1s ease-in forwards; }
@keyframes drop { 0% { top: 0; opacity: 1; } 100% { top: 36px; opacity: 0; } }

/* shared */
.shared { position: relative; display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; background: #fff; border: 1px solid var(--line); border-radius: 28px; padding: 36px 20px 20px; box-shadow: 0 24px 60px rgba(60, 50, 120, .1); }
.join { position: absolute; left: 50%; top: -14px; transform: translateX(-50%); }
.join span { display: inline-block; font-size: 12px; font-weight: 600; background: var(--ink); color: #fff; padding: 7px 18px; border-radius: 99px; white-space: nowrap; }
.col { background: #f8f7fc; border-radius: 20px; padding: 16px; min-width: 0; }
.col h4 { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; font-size: 13px; font-weight: 600; }
.col h4 svg { width: 24px; height: 24px; padding: 5px; border-radius: 8px; background: var(--mint); color: var(--mint-i); }
.feed { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; position: relative; min-height: 236px; }
.ev { display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 14px; padding: 10px 12px; transition: all .45s ease; }
.ev em { font-style: normal; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 99px; flex: none; min-width: 46px; text-align: center; }
.ev.v em { background: var(--lav); color: var(--lav-i); }
.ev.t em { background: var(--sky); color: var(--sky-i); }
.ev strong { display: block; font-size: 12.5px; }
.ev span { font-size: 11px; color: var(--muted); }

.rp { display: flex; flex-direction: column; }
.big { display: flex; align-items: baseline; gap: 8px; margin-bottom: 14px; }
.big strong { font-size: 44px; font-weight: 600; letter-spacing: -.03em; line-height: 1; }
.big span { font-size: 12px; color: var(--muted); }
.stack { display: flex; height: 14px; border-radius: 99px; overflow: hidden; background: #eceaf3; }
.stack i { display: block; height: 100%; transition: width .6s ease; }
.sv { background: var(--lav-i); }
.s3 { background: var(--sky-i); }
.legend { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-top: 12px; font-size: 12px; font-weight: 600; }
.legend span { display: inline-flex; align-items: center; gap: 7px; }
.d { width: 9px; height: 9px; border-radius: 50%; }
.d.v { background: var(--lav-i); }
.d.t { background: var(--sky-i); }

.row-enter-from { opacity: 0; transform: translateY(-12px); }
.row-leave-active { position: absolute; left: 0; right: 0; }
.row-leave-to { opacity: 0; transform: translateY(12px); }
.row-move { transition: transform .45s ease; }

@media (max-width: 860px) {
  .choices { grid-template-columns: 1fr; padding-bottom: 0; }
  .pipe { display: none; }
  .shared { grid-template-columns: 1fr; margin-top: 36px; }
}
@media (max-width: 560px) {
  .vx { padding: 64px 16px; }
  .ph { height: 170px; }
  .ob { padding: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .choices, .shared { opacity: 1; transform: none; transition: none; }
  .pipe i.go { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
