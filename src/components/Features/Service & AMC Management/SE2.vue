<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AnnualMaintenanceContractsSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref([]);
let io = null;
let cardIo = null;

/* Wording follows the feature list. All figures inside the cards are SAMPLE data. */
const items = [
  "Contracts linked to the customer, site and specific assets",
  "Comprehensive (parts and labour) or non-comprehensive (labour only) contracts",
  "Contract value and billing frequency: annual, quarterly or monthly",
  "Visits included per period, with a tracker such as “3 of 4 visits used”",
  "Renewal reminders at 60, 30 and 7 days before expiry",
  "One-click renewal with an optional price escalation",
  "Segmentation of AMC and non-AMC customers for upsell campaigns",
];

/* 2 · contract type */
const type = ref(0);
const types = ["Comprehensive", "Non-comprehensive"];

/* 3 · value and billing frequency */
const VALUE = 240000;
const freq = ref(0);
const freqs = [
  { n: "Annual", per: "year", div: 1 },
  { n: "Quarterly", per: "quarter", div: 4 },
  { n: "Monthly", per: "month", div: 12 },
];
const money = (v) => "LKR " + new Intl.NumberFormat("en-US").format(Math.round(v));
const perInvoice = computed(() => money(VALUE / freqs[freq.value].div));

/* 4 · visits */
const visits = [true, true, true, false];

/* 5 · reminders */
const reminders = [60, 30, 7];

/* 6 · renewal */
const ESC = 5;
const esc = ref(false);
const renewed = ref(false);
const renewal = computed(() => money(esc.value ? VALUE * (1 + ESC / 100) : VALUE));
function toggleEsc() {
  esc.value = !esc.value;
  renewed.value = false;
}

/* 7 · segmentation (sample split) */
const amcShare = 62;

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = root.value.querySelectorAll(".card");
  seen.value = items.map(() => reduce);
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
          const i = Number(e.target.dataset.i);
          seen.value[i] = true;
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
        <h2><span class="l1">Annual maintenance</span> <span class="l2">contracts</span></h2>
        <p class="sub">AMCs are the backbone of predictable service revenue. Saptivo manages them end to end.</p>
      </header>

      <div class="grid">
        <article
          v-for="(t, i) in items"
          :key="t"
          class="card"
          :class="['c' + (i + 1), { on: seen[i] }]"
          :data-i="i"
        >
          <div class="top">
            <span class="num">{{ i + 1 }}</span>
            <p class="tx">{{ t }}</p>
          </div>

          <!-- 1 linked records -->
          <div v-if="i === 0" class="v tree">
            <span class="tone-lav"><i>Customer</i><b>Acme Ltd</b></span>
            <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            <span class="tone-mint"><i>Site</i><b>Colombo 03</b></span>
            <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            <div class="assets">
              <span class="tone-butter"><i>Asset</i><b>Split AC · SN 4471</b></span>
              <span class="tone-butter"><i>Asset</i><b>Split AC · SN 4472</b></span>
            </div>
          </div>

          <!-- 2 contract type -->
          <div v-else-if="i === 1" class="v typ">
            <div class="seg" role="group" aria-label="Contract type">
              <button
                v-for="(n, k) in types"
                :key="n"
                type="button"
                :class="{ sel: type === k }"
                :aria-pressed="type === k"
                @click="type = k"
              >
                {{ n }}
              </button>
            </div>
            <div class="cov">
              <span class="tone-mint ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>Labour</span>
              <span v-if="type === 0" class="tone-mint ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>Parts</span>
              <span v-else class="tone-grey off"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>Parts</span>
              <em>{{ type === 0 ? "Parts and labour" : "Labour only" }}</em>
            </div>
          </div>

          <!-- 3 value + billing -->
          <div v-else-if="i === 2" class="v val">
            <div class="big"><b>{{ money(VALUE) }}</b><small>contract value / year</small></div>
            <div class="seg" role="group" aria-label="Billing frequency">
              <button
                v-for="(f, k) in freqs"
                :key="f.n"
                type="button"
                :class="{ sel: freq === k }"
                :aria-pressed="freq === k"
                @click="freq = k"
              >
                {{ f.n }}
              </button>
            </div>
            <p class="out">
              Billed <b>{{ perInvoice }}</b> per {{ freqs[freq].per }}
            </p>
          </div>

          <!-- 4 visits -->
          <div v-else-if="i === 3" class="v vis">
            <div class="dots">
              <span v-for="(u, k) in visits" :key="k" :class="{ used: u }" :style="{ '--d': k * 0.18 + 's' }">
                <svg v-if="u" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                <template v-else>4</template>
              </span>
            </div>
            <p class="cnt"><b>3 of 4</b> visits used</p>
          </div>

          <!-- 5 reminders -->
          <div v-else-if="i === 4" class="v rem">
            <div class="line">
              <span v-for="(d, k) in reminders" :key="d" :style="{ '--d': k * 0.35 + 's' }">
                <i class="pt"></i>
                <b>{{ d }}</b>
                <small>days before</small>
              </span>
              <span class="end"><i class="pt"></i><b>Expiry</b><small>contract ends</small></span>
            </div>
          </div>

          <!-- 6 renewal -->
          <div v-else-if="i === 5" class="v ren">
            <div class="row">
              <div class="was"><small>Current</small><b>{{ money(VALUE) }}</b></div>
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              <div class="now" :class="{ up: esc }"><small>Renewal</small><b>{{ renewal }}</b></div>
            </div>
            <label class="sw">
              <button type="button" role="switch" :aria-checked="esc" :class="{ on: esc }" @click="toggleEsc"><i></i></button>
              <span>Price escalation <b>+{{ ESC }}%</b> (optional)</span>
            </label>
            <button type="button" class="go" :class="{ done: renewed }" @click="renewed = true">
              {{ renewed ? "✓ Renewed for another year" : "Renew contract" }}
            </button>
          </div>

          <!-- 7 segmentation -->
          <div v-else class="v seg2">
            <div class="stack">
              <i class="a" :style="{ width: seen[6] ? amcShare + '%' : '0%' }"></i>
              <i class="n" :style="{ width: seen[6] ? 100 - amcShare + '%' : '0%' }"></i>
            </div>
            <ul class="lg">
              <li><i class="a"></i>AMC customers <b>{{ amcShare }}%</b></li>
              <li><i class="n"></i>Non-AMC customers <b>{{ 100 - amcShare }}%</b></li>
            </ul>
            <span class="camp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-7-7 18-2-8z" /></svg>
              Upsell campaign to non-AMC customers
            </span>
          </div>
        </article>
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
  --grey: #eceef2; --grey-i: #6c7084;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1040px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 56px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 46ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }
.tone-grey { --t: var(--grey); --ti: var(--grey-i); }

/* bento grid */
.grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 18px; }
.c1, .c2, .c6, .c7 { grid-column: span 3; }
.c3, .c4, .c5 { grid-column: span 2; }

.card { background: #faf9ff; border: 1.5px solid var(--line); border-radius: 26px; padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 16px; opacity: .35; transform: translateY(14px); transition: all .7s cubic-bezier(.3, .8, .3, 1); min-width: 0; }
.card.on { opacity: 1; transform: none; background: #fff; box-shadow: 0 20px 44px rgba(60, 50, 120, .1); }
.top { display: flex; gap: 12px; align-items: flex-start; }
.num { flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; background: #fff; color: #a29fb2; border: 2px solid #e3dff2; transition: all .5s; }
.card.on .num { border-color: var(--lav-i); color: var(--lav-i); }
.tx { margin: 3px 0 0; font-size: 15px; font-weight: 500; line-height: 1.6; }

.v { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: auto; }
.card.on .v > * { animation: up .5s ease both; }
.card.on .v > *:nth-child(2) { animation-delay: .1s; }
.card.on .v > *:nth-child(3) { animation-delay: .2s; }
.card.on .v > *:nth-child(4) { animation-delay: .3s; }
@keyframes up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.chev { width: 16px; height: 16px; flex: none; color: #b8b4cc; }

/* shared segmented control */
.seg { display: inline-flex; gap: 4px; padding: 4px; border-radius: 99px; background: #f1eff8; max-width: 100%; flex-wrap: wrap; }
.seg button { padding: 8px 14px; border: 0; border-radius: 99px; background: transparent; font: inherit; font-size: 12px; font-weight: 600; color: var(--muted); cursor: pointer; transition: background .3s, color .3s, box-shadow .3s; }
.seg button.sel { background: #fff; color: var(--ink); box-shadow: 0 4px 12px rgba(60, 50, 120, .14); }
.seg button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

/* 1 linked */
.tree { flex-wrap: wrap; gap: 6px; }
.tree > span, .assets > span { display: flex; flex-direction: column; padding: 8px 14px; border-radius: 14px; background: var(--t); color: var(--ti); min-width: 0; }
.tree i { font-style: normal; font-size: 11px; font-weight: 600; }
.tree b { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
.assets { display: flex; flex-direction: column; gap: 6px; }

/* 2 type */
.typ { flex-direction: column; align-items: flex-start; gap: 12px; }
.cov { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.cov span { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 99px; background: var(--t); color: var(--ti); font-size: 12.5px; font-weight: 600; }
.cov span svg { width: 14px; height: 14px; }
.cov .off { text-decoration: line-through; text-decoration-thickness: 1.5px; }
.cov em { font-style: normal; font-size: 12px; font-weight: 600; color: var(--muted); }

/* 3 value */
.val { flex-direction: column; align-items: flex-start; gap: 12px; }
.val .big { display: flex; flex-direction: column; }
.val .big b { font-size: 26px; font-weight: 600; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.val .big small { font-size: 11.5px; color: var(--muted); }
.val .out { margin: 0; font-size: 13px; color: var(--muted); }
.val .out b { color: var(--lav-i); font-weight: 700; font-variant-numeric: tabular-nums; }

/* 4 visits */
.vis { flex-direction: column; align-items: flex-start; gap: 12px; }
.dots { display: flex; gap: 10px; }
.dots span { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; background: #f1eff8; color: #a29fb2; border: 2px dashed #d9d4ee; }
.dots span svg { width: 18px; height: 18px; }
.dots span.used { background: var(--mint); color: var(--mint-i); border: 2px solid var(--mint-i); }
.card.on .dots span.used { animation: pop .5s cubic-bezier(.3, 1.6, .5, 1) both; animation-delay: calc(.3s + var(--d)); }
@keyframes pop { from { transform: scale(0); opacity: 0; } to { transform: none; opacity: 1; } }
.cnt { margin: 0; font-size: 14px; color: var(--muted); }
.cnt b { color: var(--ink); font-weight: 700; }

/* 5 reminders */
.rem { align-items: stretch; }
.line { position: relative; display: flex; justify-content: space-between; width: 100%; padding-top: 4px; }
.line::before { content: ""; position: absolute; left: 10px; right: 10px; top: 14px; height: 3px; border-radius: 3px; background: #e7e3f4; }
.line span { position: relative; display: flex; flex-direction: column; align-items: center; gap: 1px; flex: 1; text-align: center; }
.pt { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 3px solid #d9d4ee; margin-bottom: 6px; position: relative; z-index: 1; }
.line b { font-size: 15px; font-weight: 700; }
.line small { font-size: 10.5px; color: var(--muted); }
.card.on .line span:not(.end) .pt { animation: lit .5s ease both; animation-delay: calc(.4s + var(--d)); }
.card.on .line span:not(.end) b { animation: litb .5s ease both; animation-delay: calc(.4s + var(--d)); }
.line .end .pt { border-color: var(--rose-i); background: var(--rose); }
.line .end b { color: var(--rose-i); }
@keyframes lit { to { border-color: var(--lav-i); background: var(--lav-i); } }
@keyframes litb { to { color: var(--lav-i); } }

/* 6 renewal */
.ren { flex-direction: column; align-items: stretch; gap: 12px; }
.ren .row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.ren .row > div { display: flex; flex-direction: column; padding: 9px 16px; border-radius: 14px; background: #f6f4ff; }
.ren small { font-size: 10.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.ren .row b { font-size: 16px; font-variant-numeric: tabular-nums; }
.ren .now { background: var(--mint) !important; transition: background .4s; }
.ren .now small, .ren .now b { color: var(--mint-i); }
.ren .now.up { background: var(--butter) !important; }
.ren .now.up small, .ren .now.up b { color: var(--butter-i); }
.sw { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--muted); cursor: pointer; }
.sw b { color: var(--ink); }
.sw button { position: relative; flex: none; width: 40px; height: 24px; padding: 0; border: 0; border-radius: 99px; background: #d9d4ee; cursor: pointer; transition: background .3s; }
.sw button i { position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, .18); transition: transform .3s cubic-bezier(.3, 1.4, .5, 1); }
.sw button.on { background: var(--lav-i); }
.sw button.on i { transform: translateX(16px); }
.sw button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.go { align-self: flex-start; padding: 10px 20px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: transform .3s, background .3s; }
.go:hover { transform: translateY(-1px); }
.go:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 3px; }
.go.done { background: var(--mint-i); cursor: default; transform: none; }

/* 7 segmentation */
.seg2 { flex-direction: column; align-items: stretch; gap: 12px; }
.stack { display: flex; height: 14px; border-radius: 99px; overflow: hidden; background: #f1eff8; }
.stack i { display: block; height: 100%; transition: width 1.1s cubic-bezier(.3, .8, .3, 1) .2s; }
.stack .a, .lg .a { background: var(--lav-i); }
.stack .n, .lg .n { background: var(--butter-i); }
.lg { list-style: none; margin: 0; padding: 0; display: flex; gap: 18px; flex-wrap: wrap; font-size: 12.5px; color: var(--muted); }
.lg li { display: flex; align-items: center; gap: 7px; }
.lg li i { width: 10px; height: 10px; border-radius: 50%; }
.lg b { color: var(--ink); font-variant-numeric: tabular-nums; }
.camp { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 99px; background: var(--rose); color: var(--rose-i); font-size: 12.5px; font-weight: 600; }
.camp svg { width: 15px; height: 15px; }

.note { margin: 28px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 900px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .c1, .c2, .c3, .c4, .c5, .c6 { grid-column: span 1; }
  .c7 { grid-column: span 2; }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .grid { grid-template-columns: 1fr; }
  .c1, .c2, .c3, .c4, .c5, .c6, .c7 { grid-column: span 1; }
  .card { padding: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .card.on .v > *, .card.on .dots span.used, .card.on .line span .pt, .card.on .line span b { animation: none; }
  .card.on .line span:not(.end) .pt { border-color: var(--lav-i); background: var(--lav-i); }
  .card.on .line span:not(.end) b { color: var(--lav-i); }
  * { transition-duration: 0s !important; }
}
</style>
