<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "CampaignPerformanceSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "hands-with-tattoos-using-laptop-viewing-live-musi-2026-09-25-07-57-49-utc.webp";

const camps = [
  { name: "Service reminder", ch: "Email", slug: "service-reminder", src: "email", sent: 4820, opened: 1530, clicked: 612, conv: 84, rev: 1.9 },
  { name: "AMC renewal", ch: "Email", slug: "amc-renewal", src: "email", sent: 2150, opened: 980, clicked: 410, conv: 96, rev: 3.2 },
  { name: "Festive offer", ch: "WhatsApp", slug: "festive-offer", src: "whatsapp", sent: 3600, opened: 3010, clicked: 1190, conv: 142, rev: 1.1 },
];
const referral = { name: "Referral", ch: "Direct", rev: 0.8 };
const maxRev = 3.2;

const idx = computed(() => (reduce ? 0 : Math.floor(n.value / 6) % 3));
const sub = computed(() => (reduce ? 5 : n.value % 6));
const cur = computed(() => camps[idx.value]);
const funnel = computed(() => {
  const c = cur.value;
  return [
    { l: "Sent", v: c.sent, p: 100 },
    { l: "Opened", v: c.opened, p: (c.opened / c.sent) * 100 },
    { l: "Clicked", v: c.clicked, p: (c.clicked / c.sent) * 100 },
    { l: "Converted", v: c.conv, p: (c.conv / c.sent) * 100 },
  ];
});
const sources = computed(() => [...camps, referral]);
const total = computed(() => camps.reduce((a, c) => a + c.rev, 0).toFixed(1));

function fmt(v) {
  return v.toLocaleString("en-US");
}
function pct(v) {
  return v >= 10 ? v.toFixed(1) : v.toFixed(1);
}
function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1000);
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
  <section ref="root" class="cp" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Campaign</span> <span class="l2">performance</span></h2>
        <p>
          See opens, clicks and conversions for every campaign, with UTM tracking so website visits and leads are
          attributed correctly. Lead-source reports show which campaigns turn into revenue.
        </p>
      </header>

      <div class="grid">
        <!-- funnel -->
        <article class="cd fn">
          <div class="ch">
            <span class="lb">Opens, clicks and conversions</span>
            <span class="pill">{{ cur.name }} · {{ cur.ch }}</span>
          </div>
          <div class="rows">
            <div v-for="f in funnel" :key="f.l" class="fr">
              <span class="fl">{{ f.l }}</span>
              <span class="tk"><i :style="{ width: (shown ? Math.max(f.p, 3) : 0) + '%' }"></i></span>
              <b>{{ fmt(f.v) }}</b>
              <small>{{ pct(f.p) }}%</small>
            </div>
          </div>
        </article>

        <!-- photo -->
        <figure class="ph">
          <img v-if="ok" :src="photo" alt="" @error="ok = false" />
          <figcaption>
            <small>Campaign revenue this quarter</small>
            <strong>LKR {{ total }}M</strong>
          </figcaption>
        </figure>

        <!-- utm -->
        <article class="cd ut">
          <div class="ch"><span class="lb">UTM tracking</span></div>
          <div class="url">
            <span class="d">saptivo.lk/quote</span>
            <span class="q" :class="{ on: sub >= 1 }">?utm_source=<b>{{ cur.src }}</b></span>
            <span class="q" :class="{ on: sub >= 2 }">&amp;utm_medium=<b>campaign</b></span>
            <span class="q" :class="{ on: sub >= 3 }">&amp;utm_campaign=<b>{{ cur.slug }}</b></span>
          </div>
          <div class="attr" :class="{ on: sub >= 4 }">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
            <span>Website visit and new lead attributed to <b>{{ cur.name }}</b></span>
          </div>
        </article>

        <!-- lead source -->
        <article class="cd ls">
          <div class="ch"><span class="lb">Lead-source report · revenue</span></div>
          <ul>
            <li v-for="s in sources" :key="s.name" :class="{ on: s.name === cur.name }">
              <span class="nm">{{ s.name }}</span>
              <span class="tk"><i :style="{ width: (shown ? (s.rev / maxRev) * 100 : 0) + '%' }"></i></span>
              <b>LKR {{ s.rev.toFixed(1) }}M</b>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cp {
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
.cp *, .cp *::before, .cp *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.cp h2 .l1 { color: #111111 !important; opacity: 1; }
.cp h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .08s; }

.grid { display: grid; grid-template-columns: 1fr 1fr 320px; grid-template-rows: auto auto; gap: 18px; }
.fn { grid-column: 1 / 3; }
.ph { grid-column: 3; grid-row: 1 / 3; }

.cd { border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.fn { background: var(--lav); }
.ut { background: var(--sky); }
.ls { background: var(--mint); }
.ch { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.pill { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #fff; color: var(--lav-i); }

.rows { display: flex; flex-direction: column; gap: 14px; background: #fff; border-radius: 18px; padding: 18px; }
.fr { display: grid; grid-template-columns: 76px 1fr 64px 48px; align-items: center; gap: 12px; font-size: 13px; }
.fl { color: var(--muted); font-weight: 500; }
.tk { height: 8px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.tk i { display: block; height: 100%; background: var(--lav-i); border-radius: 4px; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.fr b { font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }
.fr small { font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; text-align: right; }

.ph { position: relative; margin: 0; border-radius: 24px; overflow: hidden; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); min-height: 360px; }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.ph figcaption { position: absolute; left: 16px; right: 16px; bottom: 16px; background: #fff; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 2px; }
.ph small { font-size: 12px; color: var(--muted); }
.ph strong { font-size: 26px; font-weight: 500; letter-spacing: -.02em; }

.url { background: #fff; border-radius: 14px; padding: 14px 16px; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; line-height: 1.9; word-break: break-all; min-height: 118px; }
.url .d { color: var(--ink); font-weight: 600; }
.url .q { color: #b7bcc4; transition: color .4s; }
.url .q.on { color: var(--muted); }
.url .q b { font-weight: 600; }
.url .q.on b { color: var(--sky-i); }
.attr { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 12px; background: rgba(255, 255, 255, .6); color: var(--muted); font-size: 13px; opacity: .5; transition: all .4s; }
.attr.on { opacity: 1; background: var(--mint); color: var(--mint-i); }
.attr b { font-weight: 600; }

.ls ul { list-style: none; margin: 0; padding: 18px; background: #fff; border-radius: 18px; display: flex; flex-direction: column; gap: 14px; }
.ls li { display: grid; grid-template-columns: 104px 1fr 78px; align-items: center; gap: 12px; font-size: 13px; color: var(--muted); transition: color .3s; }
.ls li.on { color: var(--ink); font-weight: 600; }
.ls .tk i { background: #b9d7c7; }
.ls li.on .tk i { background: var(--mint-i); }
.ls li b { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--ink); }

@media (max-width: 1020px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .fn { grid-column: 1 / 3; }
  .ph { grid-column: 1 / 3; grid-row: auto; min-height: 300px; order: 5; }
}
@media (max-width: 760px) {
  .grid { grid-template-columns: 1fr; }
  .fn, .ph { grid-column: 1; }
}
@media (max-width: 640px) {
  .cp { padding: 64px 16px; }
  .cd { padding: 16px; border-radius: 22px; }
  .fr { grid-template-columns: 62px 1fr 52px; }
  .fr small { display: none; }
  .ls li { grid-template-columns: 92px 1fr 70px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
