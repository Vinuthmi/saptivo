<template>
  <section id="switch-from-excel" ref="root" class="sw" :class="{ in: seen, live }" aria-labelledby="sw-title">
    <h2 id="sw-title" class="title">
      <span>Why sales teams switch from</span>
      <span class="soft">Word and Excel quotes</span>
    </h2>
    <p class="lead">Spreadsheets don't know your latest prices, don't calculate tax consistently and don't tell you when the customer opened the file. Every quote is a fresh chance for a mistake.</p>

    <div class="grid">
      <!-- before / after slider -->
      <div class="cmp" :style="{ '--p': pos + '%' }">
        <div class="layer old" aria-label="A quote in Excel">
          <span class="tagl">Word / Excel</span>
          <div class="xl">
            <p class="bar"><i></i><i></i><i></i><b>Quote_ABC_v7_FINAL_final.xlsx</b></p>
            <div class="sheet">
              <div class="r h"><span>Item</span><span>Qty</span><span>Price</span><span>Total</span></div>
              <div class="r"><span>5 kW system</span><span>1</span><span class="bad">1,380,000<em>last year's price</em></span><span>1,380,000</span></div>
              <div class="r"><span>Inverter</span><span>1</span><span>380,000</span><span class="err">#REF!</span></div>
              <div class="r"><span>Installation</span><span>1</span><span>250,000</span><span>250,000</span></div>
              <div class="r t"><span>VAT</span><span></span><span class="bad">15%<em>wrong rate</em></span><span>312,000</span></div>
              <div class="r t"><span>Total</span><span></span><span></span><span>=SUM(D2:D?)</span></div>
            </div>
            <p class="unk">Did the customer open it? <b>No idea.</b></p>
          </div>
          <span class="time bad2">Example: about 2 hours</span>
        </div>

        <div class="layer new" aria-label="The same quote in Saptivo">
          <span class="tagr">Saptivo</span>
          <div class="sq">
            <div class="sh"><span class="logo">Your logo</span><span class="no"><b>Quotation QT-1042</b><small>ABC Solar · valid 14 days</small></span></div>
            <ul class="items">
              <li><span>5 kW solar system</span><b>1,450,000</b></li>
              <li><span>Hybrid inverter</span><b>380,000</b></li>
              <li><span>Installation</span><b>250,000</b></li>
              <li class="v"><span>VAT 18% <em>automatic</em></span><b>374,400</b></li>
              <li class="tot"><span>Total (LKR)</span><b>2,454,400</b></li>
            </ul>
            <p class="ok"><span class="eye"></span>Opened by Nimal · 2 minutes ago</p>
            <p class="ok2">✓ Stored on the ABC Solar record</p>
          </div>
          <span class="time good2">Example: about 5 minutes</span>
        </div>

        <span class="handle" aria-hidden="true"><i><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6-6 6 6 6M15 6l6 6-6 6" /></svg></i></span>
        <input class="range" type="range" min="6" max="94" step="1" :value="pos" aria-label="Compare an Excel quote with a Saptivo quote" @input="onInput($event.target.value)" />
      </div>

      <!-- side: fixes + photo -->
      <div class="side">
        <ul class="fix" role="list">
          <li v-for="(f, i) in fixes" :key="f.bad" :style="{ '--i': i }">
            <span class="b">{{ f.bad }}</span>
            <span class="arr" aria-hidden="true">→</span>
            <span class="g">{{ f.good }}</span>
          </li>
        </ul>

        <div class="photo">
          <img v-if="photoOk" :src="photo" alt="" loading="lazy" @error="photoOk = false" />
          <span class="glass"><i></i><span><b>Minutes instead of hours</b><small>Prices always correct</small></span></span>
        </div>
      </div>
    </div>

    <p class="close">With Saptivo, quotes take minutes instead of hours, prices are always correct, and every document is stored against the customer for next time.</p>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "SwitchFromExcelSection" });

// Photo lives in public/images/features/ (file name is case sensitive). Missing file = pastel gradient.
const photo = "/saptivo/images/features/13.jpg";
const photoOk = ref(true);

const fixes = [
  { bad: "Doesn't know your latest prices", good: "Prices are always correct" },
  { bad: "Doesn't calculate tax consistently", good: "VAT calculated automatically" },
  { bad: "Doesn't tell you when it's opened", good: "Open tracking on every quote" },
  { bad: "A fresh chance for a mistake each time", good: "Quotes take minutes, not hours" },
];

const pos = ref(50);
const manual = ref(false);
function onInput(v) {
  manual.value = true; // the visitor took over; stop the automatic sweep
  pos.value = Number(v);
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null, t: 0 };

// slow back-and-forth sweep until the visitor drags
function sweep() {
  if (manual.value) return;
  st.t += 0.035;
  pos.value = Math.round((50 + 30 * Math.sin(st.t)) * 10) / 10;
}
function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(sweep, 50);
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
    seen.value = true; // static, still draggable
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

.sw {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  --rose: #fde3ea; --rose-d: #d8567f;
  --mint: #d3f0e1; --mint-d: #2f9c6b;
  --butter: #fff1c9; --butter-d: #a77d00;
  --lav: #e8e3ff; --lav-d: #7d6be6;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.sw *, .sw *::before, .sw *::after { box-sizing: border-box; }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { width: min(700px, calc(100% - 40px)); margin: 26px auto 0; text-align: center; font-size: 16px; line-height: 1.75; color: var(--muted); }

.grid { width: min(1180px, calc(100% - 40px)); margin: 52px auto 0; display: grid; grid-template-columns: 1.25fr 0.85fr; gap: 24px; align-items: stretch; }

/* ---------- compare ---------- */
.cmp { --p: 50%; position: relative; min-height: 470px; border-radius: 30px; overflow: hidden; background: #f3f1ee; user-select: none; touch-action: pan-y; }
.layer { position: absolute; inset: 0; padding: 56px 28px 28px; }
.old { background: #eef1ee; }
.new { background: #f4f8fd; clip-path: inset(0 0 0 var(--p)); }
.tagl, .tagr { position: absolute; top: 18px; z-index: 1; padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; }
.tagl { left: 18px; background: #fff; color: var(--muted); }
.tagr { right: 18px; background: var(--ink); color: #fff; }

.xl { border-radius: 14px; background: #fff; border: 1px solid #d8ddd8; overflow: hidden; font-family: "Poppins", system-ui, sans-serif; max-width: 430px; }
.bar { display: flex; align-items: center; gap: 6px; margin: 0; padding: 9px 12px; background: #e2e8e2; font-size: 11.5px; color: #4d5a4d; }
.bar i { width: 9px; height: 9px; border-radius: 50%; background: #b9c4b9; }
.bar b { margin-left: 8px; font-weight: 500; }
.sheet { display: grid; }
.r { display: grid; grid-template-columns: 1.4fr 0.4fr 1fr 1fr; border-top: 1px solid #e6ebe6; font-size: 12px; }
.r span { position: relative; padding: 8px 10px; border-left: 1px solid #e6ebe6; }
.r span:first-child { border-left: 0; }
.r.h { background: #f1f5f1; font-weight: 600; color: #4d5a4d; border-top: 0; }
.r.t span { background: #fafcfa; }
.bad { background: #ffe9e9 !important; color: #b3261e; }
.bad em { display: block; font-style: normal; font-size: 9.5px; font-weight: 600; }
.err { background: #ffe9e9; color: #b3261e; font-weight: 600; }
.unk { margin: 14px 0 0; font-size: 13px; color: var(--muted); }
.unk b { color: #b3261e; font-weight: 600; }

.sq { max-width: 430px; margin-left: auto; padding: 18px; border-radius: 20px; background: #fff; box-shadow: 0 14px 34px -16px rgba(20, 18, 15, 0.25); }
.sh { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.logo { display: grid; place-items: center; width: 74px; height: 30px; border-radius: 9px; background: var(--lav); color: var(--lav-d); font-size: 11px; font-weight: 600; }
.no { text-align: right; }
.no b { display: block; font-size: 13px; font-weight: 500; }
.no small { font-size: 11px; color: var(--muted); }
.items { list-style: none; margin: 14px 0 0; padding: 0; }
.items li { display: flex; justify-content: space-between; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3efec; font-size: 12.5px; }
.items li b { font-weight: 500; font-variant-numeric: tabular-nums; }
.items .v em { font-style: normal; margin-left: 6px; padding: 1px 8px; border-radius: 99px; background: var(--mint); color: #1d7a52; font-size: 10px; font-weight: 600; }
.items .tot { border-bottom: 0; padding-top: 12px; font-size: 14px; font-weight: 600; }
.items .tot b { font-weight: 600; }
.ok { display: flex; align-items: center; gap: 10px; margin: 12px 0 0; padding: 9px 12px; border-radius: 12px; background: var(--butter); font-size: 12px; font-weight: 500; }
.ok2 { margin: 8px 0 0; padding: 9px 12px; border-radius: 12px; background: var(--mint); color: #1d5f43; font-size: 12px; font-weight: 500; }
.eye { position: relative; width: 14px; height: 9px; border: 2px solid var(--butter-d); border-radius: 60% / 100%; }
.eye::after { content: ""; position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%; background: var(--butter-d); }

.time { position: absolute; bottom: 18px; padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; }
.bad2 { left: 18px; background: var(--rose); color: var(--rose-d); }
.good2 { right: 18px; background: var(--mint); color: #1d7a52; }

.handle { position: absolute; z-index: 2; top: 0; bottom: 0; left: var(--p); width: 2px; margin-left: -1px; background: #fff; box-shadow: 0 0 0 1px rgba(20, 18, 15, 0.08); pointer-events: none; }
.handle i { position: absolute; top: 50%; left: 50%; display: grid; place-items: center; width: 42px; height: 42px; transform: translate(-50%, -50%); border-radius: 50%; background: var(--ink); color: #fff; box-shadow: 0 10px 24px rgba(20, 18, 15, 0.3); }
.range { position: absolute; z-index: 3; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; }
.range:focus-visible ~ .handle i { outline: 3px solid var(--lav-d); outline-offset: 3px; }

/* ---------- side ---------- */
.side { display: grid; gap: 16px; grid-template-rows: auto 1fr; }
.fix { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.fix li { display: grid; gap: 6px; padding: 12px 14px; border-radius: 18px; background: #f8f7fb; }
.b { font-size: 12.5px; color: var(--rose-d); font-weight: 500; text-decoration: line-through; text-decoration-color: rgba(216, 86, 127, 0.5); }
.arr { display: none; }
.g { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 500; }
.g::before { content: "✓"; display: grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 50%; background: var(--mint); color: #1d7a52; font-size: 11px; }
.photo { position: relative; min-height: 170px; border-radius: 24px; overflow: hidden; background: linear-gradient(135deg, #e8e3ff 0%, #dcecfb 55%, #d3f0e1 100%); }
.photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 28%; }
.photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(232, 227, 255, 0.2) 0%, rgba(232, 227, 255, 0) 45%, rgba(20, 18, 15, 0.3) 100%); pointer-events: none; }
.glass { position: absolute; z-index: 1; left: 12px; right: 12px; bottom: 12px; display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 16px; background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 14px 30px -12px rgba(20, 18, 15, 0.4); }
.glass i { flex: none; width: 9px; height: 9px; border-radius: 50%; background: var(--mint-d); animation: blink 1.8s ease-in-out infinite; }
.sw:not(.live) .glass i { animation-play-state: paused; }
.glass b { display: block; font-size: 13px; font-weight: 600; }
.glass small { display: block; font-size: 11.5px; color: var(--muted); }

.close { width: min(760px, calc(100% - 40px)); margin: 36px auto 0; text-align: center; font-size: 17px; font-weight: 500; line-height: 1.65; letter-spacing: -0.01em; }

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* entrance (runs once) */
.sw:not(.in) .lead, .sw:not(.in) .grid, .sw:not(.in) .close { opacity: 0; }
.sw.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.sw.in .title .soft { animation-delay: 0.1s; }
.sw.in .lead { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.sw.in .grid { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
.sw.in .fix li { animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) calc(var(--i) * 0.1s + 0.5s) backwards; }
.sw.in .close { animation: rise 0.8s ease 0.8s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 1000px) {
  .grid { grid-template-columns: 1fr; }
  .cmp { min-height: 480px; }
}
@media (max-width: 560px) {
  .sw { padding: 72px 0; }
  .cmp { min-height: 520px; border-radius: 24px; }
  .layer { padding: 54px 14px 64px; }
  .r { font-size: 10.5px; }
  .r span { padding: 7px 6px; }
  .sq { padding: 14px; }
  .close { font-size: 15.5px; }
}
@media (prefers-reduced-motion: reduce) {
  .sw *, .sw *::before, .sw *::after { animation: none !important; transition: none !important; }
  .sw:not(.in) .lead, .sw:not(.in) .grid, .sw:not(.in) .close { opacity: 1; }
}
</style>
