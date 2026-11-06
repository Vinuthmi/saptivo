<template>
  <section id="recurring" ref="root" class="rec" :class="{ in: seen, live }" aria-labelledby="rec-title">
    <header class="head">
      <h2 id="rec-title" class="title">
        <span>Recurring invoices</span>
        <span class="soft">and automatic payments</span>
      </h2>
      <p>
        Subscriptions, retainers, rentals, support plans and maintenance contracts shouldn't need a new invoice typed
        every month. Saptivo's recurring billing software creates invoices on a schedule and can collect payment
        automatically.
      </p>
    </header>

    <div class="stage">
      <!-- ============ the plan ============ -->
      <article class="doc plan" aria-label="Recurring plan">
        <div class="dh">
          <span class="badge">Plan</span>
          <div class="dt"><b>Support plan</b><small>Ceylon Motors · Rs. 25,000 per period</small></div>
          <span class="qs on">Active</span>
        </div>

        <div class="panel">
          <small class="lab">Repeats</small>
          <div class="freqs" role="list">
            <span v-for="(f, i) in freqs" :key="f.name" class="fq" :class="{ on: i === fi }" role="listitem">{{ f.name }}</span>
          </div>
          <p :key="fi" class="next">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>
            {{ freqs[fi].next }}
          </p>
        </div>

        <div class="two">
          <div class="mini">
            <small class="lab">Term</small>
            <b>Ongoing until cancelled</b>
            <span>Starts 1 Dec 2026 · no end date</span>
          </div>
          <div class="mini">
            <small class="lab">Autopay</small>
            <b>Card on file</b>
            <span>Authorised once</span>
          </div>
        </div>

        <div class="gw">
          <span v-for="g in gateways" :key="g">{{ g }}</span>
        </div>

        <div class="acts" aria-hidden="true">
          <span>Pause</span><span>Change</span><span class="x">Cancel</span>
        </div>
      </article>

      <!-- ============ timeline + report ============ -->
      <article class="doc tl" aria-label="Customer timeline and recurring revenue report">
        <div class="dh">
          <span class="badge">Timeline</span>
          <div class="dt"><b>Ceylon Motors</b><small>Every invoice and payment, logged</small></div>
          <span :key="ev >= 5" class="qs" :class="{ warn: ev === 5, on: ev !== 5 && ev > 0 }">{{ ev === 5 ? "Payment failed" : ev === 0 ? "Scheduled" : "Up to date" }}</span>
        </div>

        <ul class="evs" aria-label="Customer timeline">
          <li v-for="(e, i) in events" :key="e.text" :class="[e.tone, { shown: i < ev, cur: i === ev - 1 }]">
            <span class="ico" v-html="icons[e.icon]"></span>
            <span class="et">{{ e.text }}</span>
            <span class="ew">{{ e.when }}</span>
          </li>
        </ul>

        <div class="rep">
          <div class="rh"><b>Recurring revenue · December</b></div>
          <div class="stack" aria-hidden="true">
            <i class="s1" :style="{ flexGrow: rep.col }"></i>
            <i class="s2" :style="{ flexGrow: rep.due }"></i>
            <i class="s3" :style="{ flexGrow: rep.over }"></i>
          </div>
          <div class="rn">
            <span><em class="d d1"></em>Collected<b :key="rep.col" class="mono">Rs. {{ rep.col }}K</b></span>
            <span><em class="d d2"></em>Due<b :key="rep.due" class="mono">Rs. {{ rep.due }}K</b></span>
            <span><em class="d d3"></em>Overdue<b :key="rep.over" class="mono">Rs. {{ rep.over }}K</b></span>
          </div>
        </div>
      </article>
    </div>

    <ul class="feats">
      <li v-for="f in feats" :key="f.text">
        <span class="fi" :class="f.tone" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
        </span>
        <span>{{ f.text }}</span>
      </li>
    </ul>

    <p class="foot">
      Every recurring invoice and payment is logged on the customer's timeline, and a recurring revenue report shows
      what is due, collected and overdue each month.
    </p>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const freqs = [
  { name: "Weekly", next: "Next invoice every Monday" },
  { name: "Monthly", next: "Next invoice on the 1st of each month" },
  { name: "Quarterly", next: "Next invoice every 3 months" },
  { name: "Yearly", next: "Next invoice every 1 January" },
  { name: "Custom", next: "Next invoice every 45 days" },
];
const gateways = ["PayHere", "Stripe", "PayPal"];

const feats = [
  { text: "Recurring invoice schedules: weekly, monthly, quarterly, yearly or a custom interval", tone: "peach" },
  { text: "Fixed term or ongoing until cancelled, with start and end dates", tone: "butter" },
  { text: "Automatic card payments: the customer authorises once and is charged each period through gateways that support recurring billing, such as PayHere, Stripe and PayPal", tone: "sky" },
  { text: "Instalment plans that split a large invoice into scheduled payments", tone: "lav" },
  { text: "Payment reminders before each due date, and alerts when a recurring payment fails", tone: "pink" },
  { text: "Pause, change or cancel a recurring plan from the customer record", tone: "mint" },
];

const icons = {
  bell: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17c1.2-1.2 2-2.4 2-6a4 4 0 0 1 8 0c0 3.6.8 4.8 2 6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>',
  doc: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l4 4v14H7Z" /><path d="M10 12h5M10 16h5" /></svg>',
  card: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 11h18" /></svg>',
  alert: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v8M12 18h.01" /></svg>',
  tick: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>',
};

const events = [
  { icon: "bell", tone: "butter", text: "Reminder sent · due in 3 days", when: "28 Nov" },
  { icon: "doc", tone: "lav", text: "INV-0112 created · Rs. 25,000", when: "1 Dec" },
  { icon: "card", tone: "mint", text: "Card charged · Rs. 25,000", when: "1 Dec" },
  { icon: "alert", tone: "pink", text: "Payment failed · alert sent", when: "1 Jan" },
  { icon: "tick", tone: "mint", text: "Retry succeeded · Rs. 25,000", when: "3 Jan" },
];
const reports = [
  { col: 120, due: 80, over: 0 },
  { col: 120, due: 80, over: 0 },
  { col: 120, due: 105, over: 0 },
  { col: 145, due: 80, over: 0 },
  { col: 145, due: 55, over: 25 },
  { col: 170, due: 55, over: 0 },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const fi = ref(1);
const ev = ref(0);

const rep = computed(() => reports[ev.value]);

const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 16; // beats of 1.2 s

function reset() {
  fi.value = 1;
  ev.value = 0;
}

function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b === 1) fi.value = 2;
  if (b === 2) { fi.value = 3; ev.value = 1; }
  if (b === 3) fi.value = 4;
  if (b === 4) { fi.value = 1; ev.value = 2; }
  if (b === 6) ev.value = 3;
  if (b === 8) ev.value = 4;
  if (b === 11) ev.value = 5;
  st.beat = (b + 1) % LEN;
}

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(tick, 1200);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    // static picture: monthly plan, full timeline including the recovered payment
    seen.value = true;
    for (let k = 0; k < 13; k++) tick();
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) start();
      else stop();
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  st.fallback = window.setTimeout(() => { if (!seen.value) seen.value = true; }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  stop();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.rec {
  --ink: #14120f;
  --muted: #6a6560;
  --peach: #ffe9df;
  --butter: #fff3cf;
  --sky: #e0f0ff;
  --lav: #f0ecff;
  --mint: #e3f6ec;
  --pink: #ffe4ee;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.rec *, .rec *::before, .rec *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

/* ---------- heading ---------- */
.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.head p { margin: 0 auto; max-width: 60ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

/* ---------- stage ---------- */
.stage { width: min(1120px, calc(100% - 40px)); margin: 64px auto 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 28px; align-items: stretch; }
.doc { position: relative; display: flex; flex-direction: column; gap: 16px; padding: 26px; border-radius: 30px; min-width: 0; }
.plan { background: var(--lav); }
.tl { background: var(--mint); }
.dh { display: flex; align-items: center; gap: 12px; }
.badge { flex: none; padding: 6px 12px; border-radius: 99px; background: #fff; font-size: 12px; font-weight: 600; }
.plan .badge { color: #5b45c9; }
.tl .badge { color: #15803d; }
.dt { min-width: 0; flex: 1; }
.dt b { display: block; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.dt small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qs { flex: none; padding: 5px 11px; border-radius: 99px; background: #fff; color: #8a857f; font-size: 12px; font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.qs.on { background: #15803d; color: #fff; }
.qs.warn { background: var(--pink); color: #b0245a; }
.lab { display: block; font-size: 11.5px; font-weight: 600; color: var(--muted); }

/* plan */
.panel { display: grid; gap: 12px; padding: 16px; border-radius: 20px; background: #fff; }
.freqs { display: flex; flex-wrap: wrap; gap: 6px; }
.fq { padding: 7px 13px; border-radius: 99px; background: var(--lav); color: #7a6c9e; font-size: 12.5px; font-weight: 600; transition: background 0.35s, color 0.35s, transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1); }
.fq.on { background: #5b45c9; color: #fff; transform: scale(1.06); }
.next { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 13px; font-weight: 500; animation: bump 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.next svg { flex: none; color: #5b45c9; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.mini { display: grid; gap: 3px; padding: 14px; border-radius: 18px; background: #fff; align-content: start; }
.mini b { font-size: 13.5px; font-weight: 600; }
.mini span { font-size: 11.5px; line-height: 1.45; color: var(--muted); }
.gw { display: flex; flex-wrap: wrap; gap: 8px; }
.gw span { padding: 7px 14px; border-radius: 99px; background: var(--butter); color: #8a5a00; font-size: 12.5px; font-weight: 600; }
.acts { display: flex; gap: 8px; margin-top: auto; }
.acts span { padding: 9px 16px; border-radius: 99px; background: #fff; color: #5b45c9; font-size: 12.5px; font-weight: 600; }
.acts .x { color: #b0245a; }

/* timeline */
.evs { list-style: none; margin: 0; padding: 12px; border-radius: 20px; background: #fff; display: grid; gap: 4px; align-content: start; min-height: 258px; }
.evs li { display: flex; align-items: center; gap: 12px; padding: 9px 10px; border-radius: 14px; font-size: 12.5px; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.3s; }
.evs li.shown { opacity: 0.6; transform: none; }
.evs li.cur { opacity: 1; }
.evs li.cur.butter { background: var(--butter); }
.evs li.cur.lav { background: var(--lav); }
.evs li.cur.mint { background: var(--mint); }
.evs li.cur.pink { background: var(--pink); }
.ico { flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; }
.butter .ico { background: var(--butter); color: #8a5a00; }
.lav .ico { background: var(--lav); color: #5b45c9; }
.mint .ico { background: var(--mint); color: #15803d; }
.pink .ico { background: var(--pink); color: #b0245a; }
.et { flex: 1; min-width: 0; font-weight: 500; }
.ew { flex: none; color: var(--muted); font-size: 11.5px; }

.rep { display: grid; gap: 10px; padding: 14px 16px; border-radius: 20px; background: #fff; }
.rh b { font-size: 12.5px; font-weight: 600; }
.stack { display: flex; height: 10px; gap: 3px; }
.stack i { flex-basis: 0; min-width: 0; border-radius: 99px; transition: flex-grow 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
.stack .s1 { background: #7fcfa0; }
.stack .s2 { background: #f4d98a; }
.stack .s3 { background: #f5a8c4; }
.rn { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; font-size: 11.5px; color: var(--muted); }
.rn span { display: grid; gap: 2px; }
.rn b { font-size: 14px; font-weight: 600; color: var(--ink); animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.d { display: inline-block; width: 8px; height: 8px; margin-right: 6px; border-radius: 50%; }
.d1 { background: #7fcfa0; }
.d2 { background: #f4d98a; }
.d3 { background: #f5a8c4; }

/* features */
.feats { width: min(1120px, calc(100% - 40px)); margin: 48px auto 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.feats li { display: flex; align-items: flex-start; gap: 12px; padding: 18px; border-radius: 22px; background: #faf8fc; font-size: 13.5px; font-weight: 500; line-height: 1.55; }
.fi { flex: none; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; }
.fi.peach { background: var(--peach); }
.fi.butter { background: var(--butter); }
.fi.sky { background: var(--sky); }
.fi.lav { background: var(--lav); }
.fi.pink { background: var(--pink); }
.fi.mint { background: var(--mint); }
.foot { width: min(680px, calc(100% - 40px)); margin: 36px auto 0; text-align: center; font-size: 15.5px; line-height: 1.75; color: var(--muted); }

/* ---------- entrance ---------- */
.rec:not(.in) .head, .rec:not(.in) .stage, .rec:not(.in) .feats, .rec:not(.in) .foot { opacity: 0; }
.rec.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.rec.in .plan { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.rec.in .tl { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }
.rec.in .feats { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.4s backwards; }
.rec.in .foot { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.5s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: scale(1.18); opacity: 0.4; } to { transform: none; opacity: 1; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .stage { grid-template-columns: minmax(0, 1fr); max-width: 640px; }
  .feats { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 640px; }
}
@media (max-width: 640px) {
  .rec { padding: 72px 0; }
  .head p { font-size: 15.5px; }
  .stage { margin-top: 44px; width: calc(100% - 32px); gap: 22px; }
  .doc { padding: 18px; border-radius: 24px; }
  .feats { grid-template-columns: minmax(0, 1fr); width: calc(100% - 32px); }
  .dt small { display: none; }
  .ew { display: none; }
  .evs { min-height: 0; }
  .two { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .rec *, .rec *::before, .rec *::after { animation: none !important; transition: none !important; }
  .rec:not(.in) .head, .rec:not(.in) .stage, .rec:not(.in) .feats, .rec:not(.in) .foot { opacity: 1; }
}
</style>
