<template>
  <section id="lead-to-customer" ref="root" class="ltc" :class="{ in: seen, live }" aria-labelledby="ltc-title">
    <div class="head">
      <h2 id="ltc-title" class="title">
        <span>From lead to customer,</span>
        <span class="soft">without retyping</span>
      </h2>
      <p class="lead">When a lead is qualified, convert it into a contact, an account and a deal in one click. Quotations, invoices and service contracts then build on the same record.</p>
    </div>

    <div class="board">
      <!-- step 1: convert -->
      <div class="row">
        <div class="lcard" :class="{ done: phase >= 2 }">
          <span class="badge">{{ phase >= 2 ? 'Converted' : 'Qualified' }}</span>
          <b>Nimal Perera</b>
          <small>ABC Solar (Pvt) Ltd</small>
          <ul class="facts">
            <li><span>Phone</span>+94 77 123 4567</li>
            <li><span>Email</span>nimal@abcsolar.lk</li>
            <li><span>City</span>Kandy</li>
            <li><span>Interest</span>Solar quote</li>
          </ul>
        </div>

        <div class="mid">
          <button type="button" class="convert" :class="{ press: phase === 2, off: phase >= 2 }" :disabled="phase >= 2" @click="convert">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            Convert
          </button>
          <small>One click</small>
        </div>

        <ul class="recs">
          <li v-for="(r, i) in records" :key="r.kind" class="rec" :class="{ on: phase >= 3 }" :style="{ '--d': i * 0.16 + 's' }">
            <span class="ric" :class="r.kind">
              <svg v-if="r.kind === 'contact'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></svg>
              <svg v-else-if="r.kind === 'account'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V6l8-3 8 3v14" /><path d="M9 20v-5h6v5" /><path d="M9 9.5h.01M15 9.5h.01M12 9.5h.01" /></svg>
              <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16v12H4z" /><path d="M9 7V5h6v2" /><path d="M4 12h16" /></svg>
            </span>
            <span class="rt"><b>{{ r.title }}</b><small>{{ r.sub }}</small></span>
            <span class="tag">{{ r.tag }}</span>
          </li>
        </ul>
      </div>

      <!-- step 2: build on the same record -->
      <div class="sep">
        <span class="line"></span>
        <span class="rid" :class="{ on: phase >= 3 }">Same record · SAP-2041</span>
        <span class="line"></span>
      </div>

      <ol class="docs">
        <li v-for="(d, i) in docs" :key="d.name" class="doc" :class="{ on: phase >= 4 + i }">
          <span class="num">{{ i + 1 }}</span>
          <span class="dt">
            <b>{{ d.name }}</b>
            <small>{{ d.line }}</small>
          </span>
          <span class="amt">{{ d.amt }}</span>
          <span class="ok" aria-hidden="true">✓</span>
        </li>
      </ol>

      <p class="foot">Nothing is typed twice. The customer's details, products and prices carry through every step.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "LeadToCustomerSection" });

const records = [
  { kind: "contact", title: "Contact", sub: "Nimal Perera · +94 77 123 4567", tag: "Created" },
  { kind: "account", title: "Account", sub: "ABC Solar (Pvt) Ltd · Kandy", tag: "Created" },
  { kind: "deal", title: "Deal", sub: "Solar installation · Proposal", tag: "Rs 1.85M" },
];

const docs = [
  { name: "Quotation", line: "QT-1042 · built from the deal", amt: "Rs 1,850,000" },
  { name: "Invoice", line: "INV-2210 · built from the quotation", amt: "Rs 925,000 due" },
  { name: "Service contract", line: "Yearly maintenance · same account", amt: "12 visits" },
];

// 0-1 lead waiting, 2 button pressed, 3 records, 4-6 documents, 7-8 hold, then restart
const phase = ref(0);
let tick = 0;
function step() {
  tick += 1;
  const p = tick % 10;
  // phases: 0,1 wait · 2 press · 3 records · 4,5,6 docs · 7,8,9 hold
  phase.value = p <= 1 ? p : p >= 7 ? 7 : p;
}
function convert() {
  if (phase.value >= 2) return;
  // jump the demo clock so the rest of the sequence continues from here
  tick = Math.floor(tick / 10) * 10 + 2;
  phase.value = 2;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1200);
}
function stop() {
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
    phase.value = 7; // show the finished result, no animation
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
  st.fallback = window.setTimeout(() => {
    if (!seen.value) seen.value = true;
  }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  stop();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

.ltc {
  --orange: #ff6338;
  --orange-soft: #fff1ec;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #f1e7e2;
  --green: #1f9d63;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Inter", system-ui, sans-serif;
}
.ltc *, .ltc *::before, .ltc *::after { box-sizing: border-box; }
.ltc button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

/* left-aligned header: title left, copy right */
.head {
  width: min(1180px, calc(100% - 40px)); margin: 0 auto;
  display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: end;
}
.title { margin: 0; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

/* ---------- board ---------- */
.board {
  width: min(1180px, calc(100% - 40px)); margin: 56px auto 0; padding: 36px; border-radius: 32px;
  background:
    linear-gradient(rgba(20, 18, 15, 0.84), rgba(20, 18, 15, 0.84)),
    url("/images/features/threecolleagues-.jpg") center / cover;
  color: #fff;
}
.row { display: grid; grid-template-columns: 290px 150px minmax(0, 1fr); align-items: center; gap: 0; }

.lcard {
  display: grid; gap: 3px; padding: 22px; border-radius: 22px; background: #fff; color: var(--ink);
  transition: opacity 0.6s, transform 0.6s;
}
.lcard.done { opacity: 0.55; transform: scale(0.97); }
.badge { justify-self: start; margin-bottom: 8px; padding: 3px 11px; border-radius: 99px; background: var(--orange-soft); color: var(--orange); font-size: 11px; font-weight: 600; transition: background 0.4s, color 0.4s; }
.lcard.done .badge { background: #e4f5ec; color: var(--green); }
.lcard b { font-size: 18px; font-weight: 500; letter-spacing: -0.01em; }
.lcard > small { font-size: 12.5px; color: var(--muted); }
.facts { list-style: none; margin: 14px 0 0; padding: 12px 0 0; border-top: 1px dashed var(--line); display: grid; gap: 6px; }
.facts li { display: flex; justify-content: space-between; gap: 12px; font-size: 12.5px; }
.facts span { color: var(--muted); }

.mid { display: grid; justify-items: center; gap: 8px; }
.mid small { font-size: 11px; color: #9a948e; }
.convert {
  display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border: 0; border-radius: 99px; background: var(--orange); color: #fff; cursor: pointer;
  font: 500 14px "Poppins", system-ui, sans-serif; transition: transform 0.2s, background 0.3s, opacity 0.4s;
}
.convert:hover:not(:disabled) { transform: translateY(-1px); }
.convert.press { transform: scale(0.92); }
.convert.off { opacity: 0.45; cursor: default; }

.recs { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.rec {
  display: flex; align-items: center; gap: 14px; padding: 14px 18px; border: 1px solid #2c2824; border-radius: 18px; background: #1d1a16;
  opacity: 0.35; transform: translateX(-14px);
  transition: opacity 0.5s ease var(--d), transform 0.5s cubic-bezier(0.3, 1.2, 0.5, 1) var(--d), border-color 0.5s ease var(--d), background 0.5s ease var(--d);
}
.rec.on { opacity: 1; transform: none; border-color: rgba(255, 99, 56, 0.5); background: #241c17; }
.ric { flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: #2c2824; color: #9a948e; transition: background 0.4s ease var(--d), color 0.4s ease var(--d); }
.rec.on .ric { background: var(--orange); color: #fff; }
.rt { flex: 1; min-width: 0; }
.rt b { display: block; font-size: 14.5px; font-weight: 500; }
.rt small { display: block; font-size: 12px; color: #a39d97; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tag { flex: none; padding: 3px 10px; border-radius: 99px; background: #2c2824; color: #a39d97; font-size: 11px; font-weight: 500; transition: background 0.4s ease var(--d), color 0.4s ease var(--d); }
.rec.on .tag { background: rgba(31, 157, 99, 0.2); color: #5fd39a; }

/* separator with record id */
.sep { display: flex; align-items: center; gap: 16px; margin: 30px 0 24px; }
.line { flex: 1; height: 1px; background: #2c2824; }
.rid { padding: 6px 14px; border: 1px solid #2c2824; border-radius: 99px; font-size: 12px; font-weight: 500; color: #7d7771; transition: color 0.4s, border-color 0.4s; }
.rid.on { color: var(--orange); border-color: rgba(255, 99, 56, 0.5); }

/* documents */
.docs { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.doc {
  position: relative; display: grid; grid-template-columns: auto 1fr; gap: 4px 14px; align-items: center; padding: 18px; border: 1px solid #2c2824; border-radius: 18px; background: #1d1a16;
  opacity: 0.35; transform: translateY(10px); transition: opacity 0.5s, transform 0.5s cubic-bezier(0.3, 1.2, 0.5, 1), border-color 0.5s;
}
.doc.on { opacity: 1; transform: none; border-color: rgba(255, 99, 56, 0.5); }
.num { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: #2c2824; color: #9a948e; font-size: 12px; font-weight: 600; transition: background 0.4s, color 0.4s; }
.doc.on .num { background: var(--orange); color: #fff; }
.dt b { display: block; font-size: 15px; font-weight: 500; }
.dt small { display: block; font-size: 12px; color: #a39d97; }
.amt { grid-column: 2; font-size: 13px; font-weight: 500; color: #e8e3de; }
.ok { position: absolute; top: 16px; right: 16px; display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: var(--green); color: #fff; font-size: 11px; opacity: 0; transform: scale(0.5); transition: opacity 0.3s 0.2s, transform 0.4s cubic-bezier(0.3, 1.5, 0.5, 1) 0.2s; }
.doc.on .ok { opacity: 1; transform: none; }

.foot { margin: 24px 0 0; text-align: center; font-size: 13px; color: #a39d97; }

/* ---------- entrance (runs once) ---------- */
.ltc:not(.in) .head, .ltc:not(.in) .board { opacity: 0; }
.ltc.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.ltc.in .board { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .head { grid-template-columns: 1fr; gap: 20px; }
  .row { grid-template-columns: 1fr; gap: 18px; }
  .mid { grid-auto-flow: column; justify-content: center; align-items: center; gap: 12px; }
  .docs { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .ltc { padding: 72px 0; }
  .board { padding: 20px 16px; border-radius: 24px; }
  .rec { padding: 12px; gap: 10px; }
  .tag { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ltc *, .ltc *::before, .ltc *::after { animation: none !important; transition: none !important; }
  .ltc:not(.in) .head, .ltc:not(.in) .board { opacity: 1; }
}
</style>
