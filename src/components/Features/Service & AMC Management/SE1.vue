<script setup>
import { ref, h, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AssetRegistrySection" });

const root = ref(null);
const shown = ref(false);
const active = ref(-1);
const status = ref(0);
let io = null;
let reduce = false;

/* The steps use the same wording as the feature list. All figures in the cards are SAMPLE data. */
const steps = [
  "Serial number, model, brand, capacity and installation date",
  "Site and location mapping for customers with many sites and many units",
  "Photos of the unit and its nameplate",
  "Warranty start and end dates with automatic expiry alerts",
  "Links to the original deal, quotation and invoice",
  "A QR code or barcode technicians scan on site to open the record",
  "Status: active, under repair, replaced or decommissioned",
];

const specs = [
  { k: "Serial number", v: "SN 4471-0928", tone: "lav" },
  { k: "Model", v: "NF-24X", tone: "lav" },
  { k: "Brand", v: "Northfield", tone: "lav" },
  { k: "Capacity", v: "24,000 BTU", tone: "lav" },
  { k: "Installed", v: "14 Mar 2025", tone: "rose" },
];
const links = [
  { n: "Deal", r: "D-0231", tone: "lav" },
  { n: "Quotation", r: "Q-1187", tone: "sky" },
  { n: "Invoice", r: "INV-1186", tone: "mint" },
];
const statuses = [
  { n: "Active", tone: "mint" },
  { n: "Under repair", tone: "butter" },
  { n: "Replaced", tone: "sky" },
  { n: "Decommissioned", tone: "grey" },
];

/* A small deterministic QR-style mark, drawn as SVG (viewBox 0 0 9 9). */
function buildQr() {
  const n = 9;
  let seed = 11;
  const r = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const out = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder = (x < 3 && y < 3) || (x >= n - 3 && y < 3) || (x < 3 && y >= n - 3);
      if (!inFinder && r() > 0.5) out.push(h("rect", { x, y, width: 1.02, height: 1.02, fill: "#14120f" }));
    }
  }
  [[0, 0], [6, 0], [0, 6]].forEach(([fx, fy]) =>
    out.push(
      h("g", { transform: `translate(${fx} ${fy})` }, [
        h("rect", { width: 3, height: 3, fill: "#14120f" }),
        h("rect", { x: 0.6, y: 0.6, width: 1.8, height: 1.8, fill: "#fff" }),
        h("rect", { x: 1.1, y: 1.1, width: 0.8, height: 0.8, fill: "#14120f" }),
      ])
    )
  );
  return out;
}
const QrMark = () => h("g", buildQr());

/* Scroll-driven: the step is decided by where each card sits in the viewport.
   Scrolling down advances the steps, scrolling up steps back. */
let ticking = false;
function update() {
  if (!root.value) return;
  const items = root.value.querySelectorAll(".tl > li");
  if (!items.length) return;
  const hgt = window.innerHeight;
  let a = -1;
  items.forEach((el, i) => {
    if (el.getBoundingClientRect().top < hgt * 0.62) a = i;
  });
  const last = items[items.length - 1].getBoundingClientRect();
  if (last.bottom < hgt * 0.6) a = items.length;
  active.value = a;
}
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    update();
  });
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    active.value = steps.length;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) shown.value = true;
    },
    { threshold: 0.1 }
  );
  io.observe(root.value);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Installed asset and</span> <span class="l2">equipment registry</span></h2>
        <p class="sub">Every unit you install becomes its own record, not just a line on an old invoice.</p>
      </header>

      <ol class="tl" role="list">
        <li
          v-for="(s, i) in steps"
          :key="s"
          :class="[i % 2 ? 'r' : 'l', { on: active >= i, done: active > i, cur: active === i }]"
        >
          <span class="node">
            <svg v-if="active > i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
            <template v-else>{{ i + 1 }}</template>
          </span>

          <div class="card">
            <p class="tx">{{ s }}</p>

            <!-- 1 specs -->
            <div v-if="i === 0" class="v cat">
              <div v-for="p in specs" :key="p.k" :class="'tone-' + p.tone">
                <small>{{ p.k }}</small><b>{{ p.v }}</b>
              </div>
            </div>

            <!-- 2 site mapping -->
            <div v-else-if="i === 1" class="v tree">
              <span class="tone-lav"><i>Customer</i><b>Acme Ltd</b></span>
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              <span class="tone-mint"><i>Site</i><b>Colombo 03</b></span>
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              <span class="tone-butter"><i>Unit</i><b>3 of 6</b></span>
            </div>

            <!-- 3 photos -->
            <div v-else-if="i === 2" class="v ph">
              <div>
                <svg viewBox="0 0 120 90" aria-hidden="true">
                  <rect width="120" height="90" fill="#f1eefb" />
                  <polygon points="14,70 60,86 106,70 60,54" fill="#e3def3" />
                  <polygon points="34,40 34,66 60,78 60,52" fill="#d6d0ee" />
                  <polygon points="60,52 60,78 86,66 86,40" fill="#b9b0e4" />
                  <polygon points="34,40 60,52 86,40 60,28" fill="#ece8fa" />
                  <ellipse cx="60" cy="40" rx="20" ry="9" fill="#2b2548" />
                  <polygon points="34,62 60,74 60,78 34,66" fill="#7d6be6" />
                </svg>
                <em>Unit</em>
              </div>
              <div>
                <svg viewBox="0 0 120 90" aria-hidden="true">
                  <rect width="120" height="90" fill="#dcecfb" />
                  <rect x="14" y="16" width="92" height="58" rx="6" fill="#fff" />
                  <g transform="translate(22 24) scale(4.6)"><QrMark /></g>
                  <rect x="68" y="26" width="30" height="5" rx="2.5" fill="#cfd3dc" />
                  <rect x="68" y="38" width="22" height="5" rx="2.5" fill="#e1e4ea" />
                  <rect x="68" y="50" width="30" height="5" rx="2.5" fill="#cfd3dc" />
                </svg>
                <em>Nameplate</em>
              </div>
            </div>

            <!-- 4 warranty -->
            <div v-else-if="i === 3" class="v war">
              <div class="dates">
                <span><small>Start</small><b>14 Mar 2025</b></span>
                <span><small>End</small><b>14 Mar 2027</b></span>
              </div>
              <div class="bar"><i :style="{ width: active >= 3 ? '83%' : '0%' }"></i></div>
              <div class="alr">
                <span class="bell">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10.3 20a1.94 1.94 0 0 0 3.4 0" /></svg>
                </span>
                <div>
                  <strong>Expiry alert</strong>
                  <small>Sent automatically before the warranty ends</small>
                </div>
              </div>
            </div>

            <!-- 5 linked documents -->
            <div v-else-if="i === 4" class="v lnk">
              <span v-for="l in links" :key="l.n" :class="'tone-' + l.tone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
                <i>{{ l.n }}</i><b>{{ l.r }}</b>
              </span>
            </div>

            <!-- 6 QR scan -->
            <div v-else-if="i === 5" class="v qr">
              <span class="tile">
                <svg viewBox="0 0 9 9" aria-hidden="true"><QrMark /></svg>
                <u></u>
              </span>
              <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              <span class="open"><i>Scan on site</i><b>Record opens</b></span>
            </div>

            <!-- 7 status -->
            <div v-else class="v sts">
              <button
                v-for="(s, k) in statuses"
                :key="s.n"
                type="button"
                :class="['tone-' + s.tone, { sel: status === k }]"
                :aria-pressed="status === k"
                @click="status = k"
              >
                {{ s.n }}
              </button>
            </div>
          </div>
        </li>
      </ol>

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

.tl { list-style: none; margin: 0; padding: 0; }
.tl li { position: relative; display: grid; grid-template-columns: 1fr 64px 1fr; padding: 14px 0; }
.tl li::before { content: ""; position: absolute; left: 50%; top: 0; bottom: 0; width: 3px; margin-left: -1.5px; background: #e7e3f4; transition: background .6s; }
.tl li:first-child::before { top: 38px; }
.tl li:last-child::before { bottom: auto; height: 38px; }
.tl li.done::before { background: var(--mint-i); }

.node { grid-column: 2; grid-row: 1; justify-self: center; position: relative; z-index: 1; width: 44px; height: 44px; margin-top: 4px; border-radius: 50%; display: grid; place-items: center; font-size: 15px; font-weight: 700; background: #fff; color: #a29fb2; border: 2px solid #e3dff2; transition: all .5s; }
.node svg { width: 20px; height: 20px; }
.tl li.on .node { border-color: var(--lav-i); color: var(--lav-i); }
.tl li.cur .node { background: var(--ink); border-color: var(--ink); color: #fff; box-shadow: 0 0 0 7px rgba(20, 18, 15, .1); }
.tl li.done .node { background: var(--mint-i); border-color: var(--mint-i); color: #fff; }

.card { grid-row: 1; background: #faf9ff; border: 1.5px solid var(--line); border-radius: 26px; padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; opacity: .35; transform: translateY(14px); transition: all .7s cubic-bezier(.3, .8, .3, 1); min-width: 0; }
.tl li.l .card { grid-column: 1; margin-right: 22px; }
.tl li.r .card { grid-column: 3; margin-left: 22px; }
.tl li.on .card { opacity: 1; transform: none; background: #fff; box-shadow: 0 20px 44px rgba(60, 50, 120, .1); }
.tl li.cur .card { border-color: var(--lav-i); }
.tx { margin: 0; font-size: 15px; font-weight: 500; line-height: 1.6; }

.v { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.tl li.on .v > * { animation: up .5s ease both; }
.tl li.on .v > *:nth-child(2) { animation-delay: .1s; }
.tl li.on .v > *:nth-child(3) { animation-delay: .2s; }
.tl li.on .v > *:nth-child(4) { animation-delay: .3s; }
.tl li.on .v > *:nth-child(5) { animation-delay: .4s; }
@keyframes up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

/* 1 specs */
.cat > div { background: var(--t); border-radius: 14px; padding: 8px 14px; display: flex; flex-direction: column; }
.cat small { font-size: 10.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.cat b { font-size: 14px; font-variant-numeric: tabular-nums; }
.cat .tone-rose small, .cat .tone-rose b { color: var(--rose-i); }

/* 2 site mapping */
.tree { flex-wrap: nowrap; gap: 6px; }
.tree span { display: flex; flex-direction: column; padding: 8px 14px; border-radius: 14px; background: var(--t); color: var(--ti); min-width: 0; }
.tree i { font-style: normal; font-size: 11px; font-weight: 600; }
.tree b { font-size: 14px; font-weight: 600; white-space: nowrap; }
.chev { width: 16px; height: 16px; flex: none; color: #b8b4cc; }

/* 3 photos */
.ph { gap: 12px; }
.ph div { position: relative; width: 132px; aspect-ratio: 4 / 3; border-radius: 16px; overflow: hidden; background: #f1eefb; }
.ph svg { display: block; width: 100%; height: 100%; }
.ph em { position: absolute; left: 8px; bottom: 7px; padding: 2px 9px; border-radius: 99px; background: rgba(255, 255, 255, .92); font-style: normal; font-size: 10.5px; font-weight: 600; }

/* 4 warranty */
.war { flex-direction: column; align-items: stretch; gap: 12px; }
.war .dates { display: flex; justify-content: space-between; gap: 10px; }
.war .dates span { display: flex; flex-direction: column; background: #f6f4ff; border-radius: 14px; padding: 8px 14px; }
.war .dates small { font-size: 10.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.war .dates b { font-size: 14px; font-variant-numeric: tabular-nums; }
.war .bar { height: 10px; border-radius: 99px; background: #f1eff8; overflow: hidden; }
.war .bar i { display: block; height: 100%; border-radius: 99px; background: var(--lav-i); transition: width 1s cubic-bezier(.3, .8, .3, 1) .2s; }
.alr { display: flex; align-items: center; gap: 12px; background: #fff6f8; border: 1px solid var(--rose); border-radius: 18px; padding: 10px 14px; }
.alr > div { flex: 1; min-width: 0; }
.alr strong { display: block; font-size: 13px; }
.alr small { font-size: 11.5px; color: var(--muted); }
.bell { width: 32px; height: 32px; border-radius: 50%; background: var(--rose); color: var(--rose-i); display: grid; place-items: center; flex: none; }
.bell svg { width: 16px; height: 16px; }
.tl li.cur .bell { animation: ring 1.2s ease 2; }
@keyframes ring { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(16deg); } 50% { transform: rotate(-14deg); } 75% { transform: rotate(8deg); } }

/* 5 links */
.lnk span { display: flex; align-items: center; gap: 7px; padding: 9px 14px; border-radius: 99px; background: var(--t); color: var(--ti); font-size: 12px; }
.lnk svg { width: 14px; height: 14px; flex: none; }
.lnk i { font-style: normal; font-weight: 600; }
.lnk b { font-variant-numeric: tabular-nums; }

/* 6 QR */
.qr { flex-wrap: nowrap; gap: 14px; }
.qr .tile { position: relative; flex: none; width: 76px; height: 76px; padding: 9px; border-radius: 18px; background: #fff; border: 1.5px solid var(--line); overflow: hidden; }
.qr .tile svg { display: block; width: 100%; height: 100%; }
.qr .tile u { position: absolute; left: 6px; right: 6px; top: 8px; height: 3px; border-radius: 3px; background: var(--rose-i); opacity: 0; }
.tl li.cur .qr .tile u { animation: scan 1.8s ease-in-out infinite; }
@keyframes scan { 0%, 100% { opacity: 0; transform: translateY(0); } 15%, 85% { opacity: 1; } 50% { transform: translateY(56px); } }
.qr .arr { width: 22px; height: 22px; flex: none; color: #b8b4cc; }
.qr .open { display: flex; flex-direction: column; padding: 10px 16px; border-radius: 14px; background: var(--mint); color: var(--mint-i); }
.qr .open i { font-style: normal; font-size: 11px; font-weight: 600; }
.qr .open b { font-size: 16px; font-weight: 600; letter-spacing: -.01em; }

/* 7 status */
.sts button { padding: 9px 16px; border: 1.5px solid transparent; border-radius: 99px; background: var(--t); color: var(--ti); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; transition: box-shadow .3s, transform .3s; }
.sts button:hover { transform: translateY(-1px); }
.sts button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.sts button.sel { border-color: var(--ti); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ti) 18%, transparent); }

.note { margin: 28px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 760px) {
  .tl li { grid-template-columns: 48px 1fr; }
  .tl li::before { left: 22px; }
  .node { grid-column: 1; justify-self: start; }
  .tl li.l .card, .tl li.r .card { grid-column: 2; margin: 0 0 0 12px; }
  .tree { flex-wrap: wrap; }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .card { padding: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .tl li.on .v > *, .tl li.cur .bell, .tl li.cur .qr .tile u { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
