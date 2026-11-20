<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SlaPoliciesBreachAlertsSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref(false);
let io = null;
let timer = null;
let restart = null;
let inView = false;

const imgs = { hero: "/saptivo/images/features/ddd.webp" };
const heroOk = ref(true);

/* All targets, tickets and names are SAMPLE data. */
const byPriority = [
  { k: "Critical", fr: 15, rs: 240, tone: "rose" },
  { k: "High", fr: 60, rs: 480, tone: "butter" },
  { k: "Medium", fr: 240, rs: 1440, tone: "sky" },
  { k: "Low", fr: 480, rs: 4320, tone: "mint" },
];
const byTier = [
  { k: "Platinum", fr: 30, rs: 240, tone: "lav" },
  { k: "Gold", fr: 120, rs: 720, tone: "butter" },
  { k: "Standard", fr: 480, rs: 2880, tone: "sky" },
];
const mode = ref(0); // 0 = by priority, 1 = by customer tier
const phase = ref(0); // 0 = first response, 1 = resolution
const policy = computed(() => (mode.value === 0 ? byPriority : byTier));

/* tickets: `period` = seconds the demo takes to run a full target, `auto` = when someone responds */
const tickets = reactive([
  { id: "TK-3190", t: "Air conditioner not cooling", pri: "Critical", tier: "Platinum", period: 10, auto: 0.42, p: 0, met: false, alerted: false, esc: false },
  { id: "TK-3191", t: "Generator will not start", pri: "High", tier: "Gold", period: 14, auto: 0.95, p: 0, met: false, alerted: false, esc: false },
  { id: "TK-3192", t: "Billing question on invoice", pri: "Medium", tier: "Standard", period: 22, auto: 0.5, p: 0, met: false, alerted: false, esc: false },
]);
const feed = ref([]);

const rowOf = (t) => policy.value.find((r) => r.k === (mode.value === 0 ? t.pri : t.tier));
const target = (t) => (phase.value === 0 ? rowOf(t).fr : rowOf(t).rs);
const inUse = (k) => tickets.some((t) => (mode.value === 0 ? t.pri : t.tier) === k);

function fmt(m) {
  if (m < 1) return "under 1 min";
  if (m < 60) return `${Math.round(m)} min`;
  if (m < 1440) {
    const h = Math.floor(m / 60);
    const mm = Math.round(m % 60);
    return mm ? `${h} h ${mm} min` : `${h} h`;
  }
  const d = m / 1440;
  return Number.isInteger(d) ? `${d} days` : `${d.toFixed(1)} days`;
}
function stateOf(t) {
  if (t.met) return { n: "Met", tone: "mint" };
  if (t.p >= 1) return { n: "Breached", tone: "rose" };
  if (t.p >= 0.9) return { n: "Escalated", tone: "rose" };
  if (t.p >= 0.75) return { n: "Alert sent", tone: "butter" };
  return { n: "On track", tone: "mint" };
}
const left = (t) => (t.met ? "Stopped in time" : t.p >= 1 ? "Target missed" : fmt(target(t) * (1 - t.p)) + " left");

function log(text, tone) {
  feed.value = [{ text, tone, k: Math.random() }, ...feed.value].slice(0, 5);
}
function respond(t) {
  if (t.met || t.p >= 1) return;
  t.met = true;
  log(`${t.id} ${phase.value === 0 ? "responded" : "resolved"} before the target`, "mint");
}
function reset() {
  tickets.forEach((t) => Object.assign(t, { p: 0, met: false, alerted: false, esc: false }));
  feed.value = [];
}
function tick() {
  if (!inView || document.hidden) return;
  tickets.forEach((t) => {
    if (t.met || t.p >= 1) return;
    t.p = Math.min(1, t.p + 0.1 / t.period);
    if (t.p >= 0.75 && !t.alerted) {
      t.alerted = true;
      log(`Agent alerted · ${t.id} at 75% of target`, "butter");
    }
    if (t.p >= 0.9 && !t.esc) {
      t.esc = true;
      log(`Escalated to the service manager · ${t.id}`, "rose");
    }
    if (t.p >= t.auto && !t.met) respond(t);
  });
  if (tickets.every((t) => t.met || t.p >= 1)) {
    clearInterval(timer);
    restart = setTimeout(() => {
      reset();
      timer = setInterval(tick, 100);
    }, 4500);
  }
}

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    seen.value = true;
    Object.assign(tickets[0], { p: 0.4, met: true });
    Object.assign(tickets[1], { p: 0.8, alerted: true });
    Object.assign(tickets[2], { p: 0.3 });
    feed.value = [{ text: "Agent alerted · TK-3191 at 75% of target", tone: "butter", k: 1 }];
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      inView = e.isIntersecting;
      if (e.isIntersecting) {
        shown.value = true;
        seen.value = true;
        if (!timer) timer = setInterval(tick, 100);
      }
    },
    { threshold: 0.25 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
  clearInterval(timer);
  clearTimeout(restart);
});
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">SLA policies and</span> <span class="l2">breach alerts</span></h2>
        <p class="sub">
          Set first-response and resolution targets by priority or customer tier. Timers run on every ticket, and Saptivo alerts and escalates before a target is missed.
        </p>
      </header>

      <div class="layout">
        <!-- left image -->
        <figure class="hero" :class="{ on: seen }">
          <img v-if="heroOk" :src="imgs.hero" alt="Support team working through customer tickets" loading="lazy" @error="heroOk = false" />
          <svg v-else class="fb" viewBox="0 0 400 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="sla-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#e8e3ff" />
                <stop offset="1" stop-color="#fde3ea" />
              </linearGradient>
            </defs>
            <rect width="400" height="560" fill="url(#sla-g)" />
            <circle cx="200" cy="230" r="112" fill="#fff" />
            <circle cx="200" cy="230" r="112" fill="none" stroke="#e3dff2" stroke-width="14" />
            <path d="M200 118a112 112 0 0 1 106 76" fill="none" stroke="#7d6be6" stroke-width="14" stroke-linecap="round" />
            <path d="M200 230V170M200 230l38 22" stroke="#14120f" stroke-width="9" stroke-linecap="round" />
            <circle cx="200" cy="230" r="10" fill="#14120f" />
            <rect x="188" y="92" width="24" height="16" rx="6" fill="#14120f" />
            <rect x="84" y="400" width="232" height="46" rx="23" fill="#fff" />
            <circle cx="112" cy="423" r="9" fill="#2f9c6b" />
            <rect x="132" y="416" width="140" height="14" rx="7" fill="#ece9f3" />
          </svg>
          <div class="shade"></div>
          <figcaption>
            <span class="p1 tone-mint"><i></i>SLA timer running</span>
            <span class="p2 tone-butter"><i></i>Alert sent at 75%</span>
            <span class="p3 tone-rose"><i></i>Escalated before breach</span>
          </figcaption>
        </figure>

      <div class="board" :class="{ on: seen }">
        <!-- policy -->
        <div class="pol">
          <div class="bh">
            <b>SLA policy</b>
            <div class="seg" role="group" aria-label="Targets set by">
              <button type="button" :class="{ sel: mode === 0 }" :aria-pressed="mode === 0" @click="mode = 0">By priority</button>
              <button type="button" :class="{ sel: mode === 1 }" :aria-pressed="mode === 1" @click="mode = 1">By customer tier</button>
            </div>
          </div>

          <div class="tbl" role="table" aria-label="SLA targets">
            <div class="tr th" role="row">
              <span role="columnheader">{{ mode === 0 ? "Priority" : "Tier" }}</span>
              <span role="columnheader">First response</span>
              <span role="columnheader">Resolution</span>
            </div>
            <div v-for="r in policy" :key="r.k" class="tr" :class="{ use: inUse(r.k) }" role="row">
              <span role="cell" class="nm" :class="'tone-' + r.tone"><i></i>{{ r.k }}</span>
              <b role="cell" :class="{ act: phase === 0 }">{{ fmt(r.fr) }}</b>
              <b role="cell" :class="{ act: phase === 1 }">{{ fmt(r.rs) }}</b>
            </div>
          </div>
          <p class="hint">Highlighted rows are applied to the tickets on the right.</p>
        </div>

        <!-- live timers -->
        <div class="live">
          <div class="bh">
            <b><i class="dot"></i>Live timers</b>
            <div class="seg" role="group" aria-label="Timer">
              <button type="button" :class="{ sel: phase === 0 }" :aria-pressed="phase === 0" @click="phase = 0">First response</button>
              <button type="button" :class="{ sel: phase === 1 }" :aria-pressed="phase === 1" @click="phase = 1">Resolution</button>
            </div>
          </div>

          <ul class="tks">
            <li v-for="t in tickets" :key="t.id" class="tk" :class="'st-' + stateOf(t).tone">
              <div class="r1">
                <div>
                  <small>{{ t.id }} · {{ mode === 0 ? t.pri : t.tier }}</small>
                  <b>{{ t.t }}</b>
                </div>
                <span class="chip" :class="'tone-' + stateOf(t).tone">
                  <svg v-if="t.met" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                  {{ stateOf(t).n }}
                </span>
              </div>
              <div class="bar" role="progressbar" :aria-valuenow="Math.round(t.p * 100)" aria-valuemin="0" aria-valuemax="100" :aria-label="t.id + ' SLA timer'">
                <i :style="{ width: t.p * 100 + '%' }"></i>
                <u class="m75"></u>
                <u class="m90"></u>
              </div>
              <div class="r2">
                <span>Target {{ fmt(target(t)) }}</span>
                <em>{{ left(t) }}</em>
                <button type="button" :disabled="t.met || t.p >= 1" @click="respond(t)">
                  {{ phase === 0 ? "Respond" : "Resolve" }}
                </button>
              </div>
            </li>
          </ul>

          <div class="feed" aria-live="polite">
            <small class="cap">Alerts and escalations</small>
            <p v-if="!feed.length" class="empty">Nothing to flag yet. Timers are running.</p>
            <TransitionGroup name="m" tag="ul">
              <li v-for="f in feed" :key="f.k" :class="'tone-' + f.tone">
                <span class="bell">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10.3 20a1.94 1.94 0 0 0 3.4 0" /></svg>
                </span>
                {{ f.text }}
              </li>
            </TransitionGroup>
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hw {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1080px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 58ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }

.layout { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 18px; align-items: start; }
.hero { position: sticky; top: 96px; margin: 0; height: min(640px, calc(100vh - 140px)); min-height: 440px; border-radius: 30px; overflow: hidden; background: #f1eefb; opacity: .35; transform: translateY(14px); transition: all .8s cubic-bezier(.3, .8, .3, 1); box-shadow: 0 20px 44px rgba(60, 50, 120, .1); }
.hero.on { opacity: 1; transform: none; }
.hero img, .hero .fb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; display: block; }
.hero .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, 0) 45%, rgba(20, 18, 15, .55) 100%); }
.hero figcaption { position: absolute; left: 18px; right: 18px; bottom: 18px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.hero figcaption span { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 99px; background: #fff; color: var(--ink); font-size: 12.5px; font-weight: 600; box-shadow: 0 10px 24px rgba(20, 18, 15, .18); opacity: 0; transform: translateY(12px); }
.hero figcaption i { width: 9px; height: 9px; border-radius: 50%; background: var(--ti); box-shadow: 0 0 0 4px color-mix(in srgb, var(--ti) 22%, transparent); }
.hero.on figcaption span { animation: chip .6s cubic-bezier(.3, 1.3, .5, 1) both; }
.hero.on .p1 { animation-delay: .5s; }
.hero.on .p2 { animation-delay: 1.1s; }
.hero.on .p3 { animation-delay: 1.7s; }
@keyframes chip { to { opacity: 1; transform: none; } }

.board { display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px; padding: 18px; border-radius: 34px; background: #faf9ff; border: 1.5px solid var(--line); opacity: .35; transform: translateY(14px); transition: all .8s cubic-bezier(.3, .8, .3, 1); }
.board.on { opacity: 1; transform: none; box-shadow: 0 24px 54px rgba(60, 50, 120, .1); }
.pol, .live { background: #fff; border-radius: 26px; padding: 18px; min-width: 0; }
.bh { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.bh > b { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: var(--mint-i); box-shadow: 0 0 0 4px rgba(47, 156, 107, .18); animation: blink 1.6s ease infinite; }
@keyframes blink { 50% { box-shadow: 0 0 0 7px rgba(47, 156, 107, 0); } }

.seg { display: inline-flex; gap: 4px; padding: 4px; border-radius: 99px; background: #f1eff8; }
.seg button { padding: 7px 13px; border: 0; border-radius: 99px; background: transparent; font: inherit; font-size: 11.5px; font-weight: 600; color: var(--muted); cursor: pointer; transition: background .3s, color .3s, box-shadow .3s; }
.seg button.sel { background: #fff; color: var(--ink); box-shadow: 0 4px 12px rgba(60, 50, 120, .14); }
.seg button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

/* policy table */
.tbl { display: flex; flex-direction: column; gap: 6px; }
.tr { display: grid; grid-template-columns: 1.1fr 1fr 1fr; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 14px; border: 1.5px solid transparent; font-size: 12.5px; transition: background .3s, border-color .3s; }
.tr.th { padding-top: 2px; padding-bottom: 2px; font-size: 10.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.tr.use { background: #f6f4ff; border-color: var(--lav); }
.nm { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; }
.nm i { width: 9px; height: 9px; border-radius: 50%; background: var(--ti); }
.tr b { font-weight: 600; font-variant-numeric: tabular-nums; color: var(--muted); transition: color .3s; }
.tr b.act { color: var(--ink); }
.hint { margin: 12px 2px 0; font-size: 11.5px; color: #a3a6b4; }

/* live timers */
.tks { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.tk { padding: 12px 14px; border-radius: 18px; background: #faf9ff; border: 1.5px solid var(--line); transition: border-color .4s, background .4s; }
.tk.st-butter { border-color: var(--butter-i); background: #fffaf0; }
.tk.st-rose { border-color: var(--rose-i); background: #fff6f8; }
.r1 { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.r1 small { display: block; font-size: 10.5px; font-weight: 600; letter-spacing: .04em; color: var(--muted); }
.r1 b { font-size: 13.5px; }
.chip { flex: none; display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; border-radius: 99px; background: var(--t); color: var(--ti); font-size: 11px; font-weight: 700; transition: background .3s, color .3s; }
.chip svg { width: 11px; height: 11px; }
.bar { position: relative; height: 9px; margin: 11px 0 9px; border-radius: 99px; background: #eeebf8; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 99px; background: var(--mint-i); transition: width .12s linear, background .4s; }
.st-butter .bar i { background: var(--butter-i); }
.st-rose .bar i { background: var(--rose-i); }
.bar u { position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(255, 255, 255, .85); }
.m75 { left: 75%; }
.m90 { left: 90%; }
.r2 { display: flex; align-items: center; gap: 10px; font-size: 11.5px; color: var(--muted); }
.r2 em { font-style: normal; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; }
.r2 button { margin-left: auto; padding: 6px 14px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; font: inherit; font-size: 11.5px; font-weight: 600; cursor: pointer; transition: opacity .3s, transform .25s; }
.r2 button:hover:not(:disabled) { transform: translateY(-1px); }
.r2 button:disabled { opacity: .28; cursor: default; }
.r2 button:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 2px; }

/* feed */
.feed { margin-top: 14px; min-height: 128px; }
.cap { display: block; margin: 0 0 8px; font-size: 10.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.feed ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.feed li { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 14px; background: var(--t); color: var(--ti); font-size: 12px; font-weight: 600; }
.bell { flex: none; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; background: #fff; }
.bell svg { width: 13px; height: 13px; }
.empty { margin: 0; padding: 14px; border-radius: 14px; border: 1.5px dashed #ddd8f2; text-align: center; font-size: 12px; color: #b3b0c4; }
.m-enter-active { transition: all .45s cubic-bezier(.3, .8, .3, 1); }
.m-enter-from { opacity: 0; transform: translateY(-10px); }
.m-leave-active { position: absolute; opacity: 0; }
.m-move { transition: transform .45s cubic-bezier(.3, .8, .3, 1); }

.note { margin: 26px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 900px) {
  .layout { grid-template-columns: minmax(0, 1fr); }
  .hero { position: relative; top: 0; height: 320px; min-height: 0; }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .board { padding: 12px; border-radius: 28px; }
  .pol, .live { padding: 14px; }
  .tr { grid-template-columns: 1fr 1fr 1fr; padding: 9px 8px; font-size: 11.5px; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .dot, .hero.on figcaption span { animation: none; }
  .hero figcaption span { opacity: 1; transform: none; }
  .m-enter-active, .m-move { transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
