<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "PreventiveMaintenanceSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref([]);
let io = null;
let cardIo = null;

/* Images: put your files in /public/saptivo/images/features/ (e.g. 15.webp and 3C.webp) and
   change the names here. If a file is missing, an illustrated fallback is shown instead. */
const imgs = {
  hero: "/saptivo/images/features/15.webp",
  route: "/saptivo/images/features/3C.webp",
};
const ok = ref({ hero: true, route: true });

/* Wording follows the feature list. All figures inside the cards are SAMPLE data. */
const items = [
  "Recurring rules per asset type, such as AC service every three months",
  "Usage-based triggers such as running hours, kWh generated or cycles completed",
  "Seasonal schedules, such as an AC deep clean before the hot season",
  "Jobs created ahead of the due date and grouped by area into efficient technician routes",
  "SMS or email reminders to customers before the visit",
  "Overdue visits escalated to the service manager",
];

/* 1 · recurring rules */
const rules = [
  { a: "Air conditioner", r: "Service every 3 months", tone: "lav" },
  { a: "Generator", r: "Service every 6 months", tone: "mint" },
  { a: "Water heater", r: "Service every 12 months", tone: "butter" },
];

/* 2 · usage-based triggers */
const meters = [
  { n: "Running hours", v: 480, max: 500, u: "h" },
  { n: "kWh generated", v: 8200, max: 10000, u: "kWh" },
  { n: "Cycles completed", v: 2000, max: 2000, u: "cycles" },
];
const pct = (m) => Math.min(100, Math.round((m.v / m.max) * 100));
const fmt = (v) => new Intl.NumberFormat("en-US").format(v);

/* 3 · seasons */
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const hot = [2, 3, 4]; // Mar–May
const clean = 1; // Feb

/* 4 · route stops (in a 240 × 120 box) */
const stops = [
  { x: 28, y: 88 },
  { x: 92, y: 40 },
  { x: 158, y: 76 },
  { x: 214, y: 28 },
];
const routePath = computed(() => {
  const p = stops;
  return `M${p[0].x} ${p[0].y} C ${p[0].x + 30} ${p[0].y - 50}, ${p[1].x - 30} ${p[1].y + 30}, ${p[1].x} ${p[1].y} S ${p[2].x - 30} ${p[2].y - 40}, ${p[2].x} ${p[2].y} S ${p[3].x - 30} ${p[3].y + 40}, ${p[3].x} ${p[3].y}`;
});

/* 5 · reminders */
const ch = ref(0);
const channels = ["SMS", "Email"];

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = root.value.querySelectorAll("[data-i]");
  seen.value = [reduce, ...items.map(() => reduce)]; // index 0 = hero image card
  if (reduce) {
    shown.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) shown.value = true;
    },
    { threshold: 0.1 }
  );
  io.observe(root.value);
  cardIo = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          seen.value[Number(e.target.dataset.i)] = true;
          cardIo.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  cards.forEach((c) => cardIo.observe(c));
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
  if (cardIo) cardIo.disconnect();
});
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Preventive maintenance</span> <span class="l2">scheduling</span></h2>
        <p class="sub">
          Saptivo's preventive maintenance software generates service jobs automatically, so visits happen without anyone remembering to book them.
        </p>
      </header>

      <div class="layout">
        <!-- hero image -->
        <figure class="hero" :class="{ on: seen[0] }" data-i="0">
          <img v-if="ok.hero" :src="imgs.hero" alt="Technician carrying out a scheduled service visit" loading="lazy" @error="ok.hero = false" />
          <svg v-else class="fb" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="pm-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#e8e3ff" />
                <stop offset="1" stop-color="#dcecfb" />
              </linearGradient>
            </defs>
            <rect width="400" height="520" fill="url(#pm-g)" />
            <rect x="64" y="90" width="272" height="224" rx="26" fill="#fff" />
            <rect x="64" y="90" width="272" height="56" rx="26" fill="#7d6be6" />
            <rect x="64" y="120" width="272" height="26" fill="#7d6be6" />
            <g v-for="r in 4" :key="r">
              <rect v-for="c in 6" :key="c" :x="82 + (c - 1) * 40" :y="162 + (r - 1) * 36" width="28" height="24" rx="8" :fill="(r * c) % 5 === 0 ? '#d3f0e1' : (r + c) % 7 === 0 ? '#fff1c9' : '#f1eefb'" />
            </g>
            <circle cx="296" cy="330" r="26" fill="#2f9c6b" />
            <path d="M284 330l9 9 17-19" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="shade"></div>
          <figcaption>
            <span class="p1 tone-mint"><i></i>Job created · 14 days ahead</span>
            <span class="p2 tone-sky"><i></i>Route planned · 6 stops</span>
            <span class="p3 tone-butter"><i></i>Customer reminded</span>
          </figcaption>
        </figure>

        <div class="right">
          <article
            v-for="(t, i) in items"
            :key="t"
            class="card"
            :class="['c' + (i + 1), { on: seen[i + 1] }]"
            :data-i="i + 1"
          >
            <div class="top">
              <span class="num">{{ i + 1 }}</span>
              <p class="tx">{{ t }}</p>
            </div>

            <!-- 1 recurring rules -->
            <ul v-if="i === 0" class="v rul">
              <li v-for="r in rules" :key="r.a" :class="'tone-' + r.tone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" /></svg>
                <b>{{ r.a }}</b>
                <span>{{ r.r }}</span>
              </li>
            </ul>

            <!-- 2 usage triggers -->
            <ul v-else-if="i === 1" class="v mtr">
              <li v-for="m in meters" :key="m.n" :class="{ hit: pct(m) >= 100 }">
                <div class="r"><span>{{ m.n }}</span><b>{{ fmt(m.v) }} / {{ fmt(m.max) }} {{ m.u }}</b></div>
                <div class="bar"><i :style="{ width: seen[2] ? pct(m) + '%' : '0%' }"></i></div>
                <em v-if="pct(m) >= 100">✓ Service job created</em>
              </li>
            </ul>

            <!-- 3 seasonal -->
            <div v-else-if="i === 2" class="v sea">
              <div class="yr">
                <span
                  v-for="(m, k) in months"
                  :key="m"
                  :class="{ hot: hot.includes(k), clean: k === clean }"
                  :style="{ '--d': k * 0.04 + 's' }"
                >
                  {{ m }}
                </span>
              </div>
              <ul class="lg">
                <li><i class="c"></i>AC deep clean</li>
                <li><i class="h"></i>Hot season</li>
              </ul>
            </div>

            <!-- 4 routes -->
            <div v-else-if="i === 3" class="v rte">
              <div class="map">
                <img v-if="ok.route" :src="imgs.route" alt="" loading="lazy" @error="ok.route = false" />
                <svg v-else class="fb" viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="240" height="120" fill="#dcecfb" />
                  <g stroke="#fff" stroke-width="6" stroke-linecap="round">
                    <path d="M-10 30 L250 22" /><path d="M-10 84 L250 96" /><path d="M60 -10 L72 130" /><path d="M170 -10 L160 130" />
                  </g>
                  <rect x="86" y="50" width="34" height="22" rx="6" fill="#d3f0e1" />
                  <rect x="176" y="40" width="28" height="30" rx="6" fill="#fff1c9" />
                  <rect x="14" y="40" width="30" height="26" rx="6" fill="#e8e3ff" />
                </svg>
                <svg class="path" viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <path :d="routePath" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" />
                  <path :d="routePath" class="dash" fill="none" stroke="#7d6be6" stroke-width="2.6" stroke-linecap="round" />
                  <g v-for="(s, k) in stops" :key="k">
                    <circle :cx="s.x" :cy="s.y" r="10" fill="#14120f" stroke="#fff" stroke-width="2" />
                    <text :x="s.x" :y="s.y + 3.6" text-anchor="middle">{{ k + 1 }}</text>
                  </g>
                </svg>
                <span class="tag">Colombo 03 · 6 jobs, 1 route</span>
              </div>
              <span class="tone-lav ahead"><i>Created</i><b>14 days before due</b></span>
            </div>

            <!-- 5 reminders -->
            <div v-else-if="i === 4" class="v rmd">
              <div class="seg" role="group" aria-label="Reminder channel">
                <button
                  v-for="(n, k) in channels"
                  :key="n"
                  type="button"
                  :class="{ sel: ch === k }"
                  :aria-pressed="ch === k"
                  @click="ch = k"
                >
                  {{ n }}
                </button>
              </div>
              <div v-if="ch === 0" key="sms" class="msg sms">
                <small>SMS · 2 days before</small>
                <p>Reminder: your AC service is scheduled for Tue, 10:00 am. Reply to reschedule.</p>
              </div>
              <div v-else key="mail" class="msg mail">
                <small>Email · 2 days before</small>
                <b>Your AC service visit is coming up</b>
                <p>Our technician will visit on Tuesday at 10:00 am.</p>
              </div>
            </div>

            <!-- 6 escalation -->
            <div v-else class="v esc">
              <span class="tone-butter due"><i>Visit due</i><b>12 Nov</b></span>
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              <span class="tone-rose due"><i>Status</i><b>Overdue · 2 days</b></span>
              <div class="alr">
                <span class="av">SM</span>
                <div>
                  <strong>Service manager notified</strong>
                  <small>Escalated automatically</small>
                </div>
                <span class="bell">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10.3 20a1.94 1.94 0 0 0 3.4 0" /></svg>
                </span>
              </div>
            </div>
          </article>
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
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 56px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 52ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }

.layout { display: grid; grid-template-columns: 5fr 7fr; gap: 18px; align-items: start; }

/* hero image (stays in view while the cards scroll past) */
.hero { position: sticky; top: 96px; margin: 0; height: min(620px, calc(100vh - 140px)); min-height: 440px; border-radius: 30px; overflow: hidden; background: #f1eefb; opacity: .35; transform: translateY(14px); transition: all .8s cubic-bezier(.3, .8, .3, 1); box-shadow: 0 20px 44px rgba(60, 50, 120, .1); }
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

.right { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; min-width: 0; }
.c3, .c4 { grid-column: span 2; }

.card { background: #faf9ff; border: 1.5px solid var(--line); border-radius: 26px; padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 16px; opacity: .35; transform: translateY(14px); transition: all .7s cubic-bezier(.3, .8, .3, 1); min-width: 0; }
.card.on { opacity: 1; transform: none; background: #fff; box-shadow: 0 20px 44px rgba(60, 50, 120, .1); }
.top { display: flex; gap: 12px; align-items: flex-start; }
.num { flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; background: #fff; color: #a29fb2; border: 2px solid #e3dff2; transition: all .5s; }
.card.on .num { border-color: var(--lav-i); color: var(--lav-i); }
.tx { margin: 3px 0 0; font-size: 15px; font-weight: 500; line-height: 1.6; }

.v { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: auto; }
ul.v { list-style: none; padding: 0; margin-bottom: 0; }
.card.on .v > * { animation: up .5s ease both; }
.card.on .v > *:nth-child(2) { animation-delay: .1s; }
.card.on .v > *:nth-child(3) { animation-delay: .2s; }
@keyframes up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.chev { width: 16px; height: 16px; flex: none; color: #b8b4cc; }

/* 1 rules */
.rul { flex-direction: column; align-items: stretch; gap: 8px; }
.rul li { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 14px; background: var(--t); color: var(--ti); font-size: 12.5px; }
.rul svg { width: 16px; height: 16px; flex: none; }
.rul b { font-weight: 600; }
.rul span { margin-left: auto; font-weight: 600; opacity: .85; text-align: right; }

/* 2 meters */
.mtr { flex-direction: column; align-items: stretch; gap: 12px; }
.mtr .r { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--muted); }
.mtr .r b { color: var(--ink); font-variant-numeric: tabular-nums; }
.mtr .bar { height: 8px; margin-top: 6px; border-radius: 99px; background: #f1eff8; overflow: hidden; }
.mtr .bar i { display: block; height: 100%; border-radius: 99px; background: var(--lav-i); transition: width 1.1s cubic-bezier(.3, .8, .3, 1) .2s; }
.mtr .hit .bar i { background: var(--mint-i); }
.mtr em { display: block; margin-top: 5px; font-style: normal; font-size: 11.5px; font-weight: 600; color: var(--mint-i); }

/* 3 seasons */
.sea { flex-direction: column; align-items: stretch; gap: 12px; }
.yr { display: grid; grid-template-columns: repeat(12, 1fr); gap: 6px; }
.yr span { padding: 10px 0; border-radius: 12px; background: #f1eff8; color: var(--muted); font-size: 11.5px; font-weight: 600; text-align: center; }
.yr .hot { background: var(--butter); color: var(--butter-i); }
.yr .clean { background: var(--lav-i); color: #fff; }
.card.on .yr span { animation: pop .45s cubic-bezier(.3, 1.5, .5, 1) both; animation-delay: var(--d); }
@keyframes pop { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: none; } }
.lg { list-style: none; margin: 0; padding: 0; display: flex; gap: 18px; font-size: 12px; color: var(--muted); }
.lg li { display: flex; align-items: center; gap: 7px; }
.lg i { width: 10px; height: 10px; border-radius: 50%; }
.lg .c { background: var(--lav-i); }
.lg .h { background: var(--butter-i); }

/* 4 routes */
.rte { align-items: stretch; flex-wrap: nowrap; gap: 14px; }
.map { position: relative; flex: 1; min-width: 0; aspect-ratio: 2 / 1; border-radius: 18px; overflow: hidden; background: var(--sky); }
.map img, .map .fb, .map .path { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.map .path text { font-size: 10px; font-weight: 700; fill: #fff; font-family: "Poppins", system-ui, sans-serif; }
.map .dash { stroke-dasharray: 4 7; animation: march 1.2s linear infinite; }
@keyframes march { to { stroke-dashoffset: -22; } }
.map .tag { position: absolute; left: 10px; bottom: 10px; padding: 6px 12px; border-radius: 99px; background: #fff; font-size: 11px; font-weight: 600; box-shadow: 0 6px 16px rgba(20, 18, 15, .15); }
.ahead { flex: none; align-self: center; display: flex; flex-direction: column; padding: 10px 16px; border-radius: 14px; background: var(--t); color: var(--ti); }
.ahead i { font-style: normal; font-size: 11px; font-weight: 600; }
.ahead b { font-size: 14px; font-weight: 600; }

/* 5 reminders */
.rmd { flex-direction: column; align-items: flex-start; gap: 12px; }
.seg { display: inline-flex; gap: 4px; padding: 4px; border-radius: 99px; background: #f1eff8; }
.seg button { padding: 8px 16px; border: 0; border-radius: 99px; background: transparent; font: inherit; font-size: 12px; font-weight: 600; color: var(--muted); cursor: pointer; transition: background .3s, color .3s, box-shadow .3s; }
.seg button.sel { background: #fff; color: var(--ink); box-shadow: 0 4px 12px rgba(60, 50, 120, .14); }
.seg button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.msg { align-self: stretch; padding: 12px 16px; border-radius: 18px; animation: up .4s ease both; }
.msg small { display: block; font-size: 10.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); }
.msg p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; }
.msg b { display: block; margin-top: 4px; font-size: 13px; }
.sms { background: var(--mint); border-bottom-left-radius: 6px; }
.sms p { color: #1f6b48; }
.mail { background: #f6f4ff; border: 1px solid var(--line); }

/* 6 escalation */
.esc { gap: 8px; }
.due { display: flex; flex-direction: column; padding: 8px 14px; border-radius: 14px; background: var(--t); color: var(--ti); }
.due i { font-style: normal; font-size: 11px; font-weight: 600; }
.due b { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
.alr { flex-basis: 100%; display: flex; align-items: center; gap: 12px; margin-top: 4px; background: #fff6f8; border: 1px solid var(--rose); border-radius: 18px; padding: 10px 14px; }
.alr > div { flex: 1; min-width: 0; }
.alr strong { display: block; font-size: 13px; }
.alr small { font-size: 11.5px; color: var(--muted); }
.av { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: var(--ink); color: #fff; font-size: 11px; font-weight: 700; flex: none; }
.bell { width: 32px; height: 32px; border-radius: 50%; background: var(--rose); color: var(--rose-i); display: grid; place-items: center; flex: none; }
.bell svg { width: 16px; height: 16px; }
.card.on .bell { animation: ring 1.2s ease 2 .8s; }
@keyframes ring { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(16deg); } 50% { transform: rotate(-14deg); } 75% { transform: rotate(8deg); } }

.note { margin: 28px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .hero { position: relative; top: 0; height: 340px; min-height: 0; }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .right { grid-template-columns: 1fr; }
  .c3, .c4 { grid-column: span 1; }
  .card { padding: 18px; }
  .rte { flex-direction: column; }
  .ahead { align-self: flex-start; }
  .yr { grid-template-columns: repeat(6, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .card.on .v > *, .card.on .yr span, .card.on .bell, .hero.on figcaption span, .map .dash, .msg { animation: none; }
  .hero figcaption span { opacity: 1; transform: none; }
  * { transition-duration: 0s !important; }
}
</style>
