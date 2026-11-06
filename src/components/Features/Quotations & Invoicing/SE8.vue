<template>
  <section id="quote-to-cash" ref="root" class="qc" :class="{ in: seen, live }" aria-labelledby="qc-title">
    <h2 id="qc-title" class="title">
      <span>How quote-to-cash</span>
      <span class="soft">works in Saptivo</span>
    </h2>

    <!-- step rail -->
    <ol class="rail" aria-label="Quote-to-cash steps">
      <li v-for="(s, i) in steps" :key="s.short" :class="[s.tone, { act: i === step, past: i < step }]">
        <button type="button" :aria-current="i === step ? 'step' : undefined" @click="go(i)">
          <span class="n">{{ i < step ? '✓' : i + 1 }}</span>
          <span class="t">{{ s.short }}</span>
        </button>
      </li>
    </ol>

    <div class="stage" :class="cur.tone">
      <!-- photo -->
      <div class="photo">
        <template v-for="(src, i) in photos" :key="src">
          <img v-if="ok[i]" :src="src" alt="" loading="lazy" :class="{ on: i === photoIdx }" @error="ok[i] = false" />
        </template>
        <span class="glass">
          <i></i>
          <span><b>Step {{ step + 1 }} of 5</b><small>{{ cur.short }}</small></span>
        </span>
      </div>

      <!-- mock + text -->
      <div class="side">
        <Transition name="swap" mode="out-in">
          <div :key="step" class="mock">
            <!-- 1 build -->
            <template v-if="step === 0">
              <div class="mh"><b>Quotation QT-1042</b><span class="chip">Draft</span></div>
              <ul class="lines">
                <li><span>5 kW solar system</span><b>Rs 1,450,000</b></li>
                <li><span>Hybrid inverter</span><b>Rs 380,000</b></li>
                <li><span>Installation</span><b>Rs 250,000</b></li>
                <li class="tot"><span>Total · inside the deal</span><b>Rs 2,080,000</b></li>
              </ul>
              <p class="note">Built from the catalog, so every price is right.</p>
            </template>

            <!-- 2 send -->
            <template v-else-if="step === 1">
              <div class="mh"><b>Send quotation</b><span class="chip">Sent</span></div>
              <div class="chan"><span class="on">WhatsApp</span><span>Email</span></div>
              <div class="bub">Hi Nimal, here is your quotation QT-1042. <u>Quotation.pdf</u></div>
              <div class="track"><span class="eye"></span><b>Opened</b> 2 minutes ago · viewed 3 times</div>
            </template>

            <!-- 3 approve -->
            <template v-else-if="step === 2">
              <div class="mh"><b>Special discount</b><span class="chip warn">15% · needs approval</span></div>
              <div class="appr">
                <span class="av">KS</span>
                <span class="who"><b>Kasun · Sales manager</b><small>Asked to approve 15% on QT-1042</small></span>
                <span class="decision"><span class="no">Reject</span><span class="yes">Approve</span></span>
              </div>
              <p class="note ok">✓ Approved. The rep can send the final quote.</p>
            </template>

            <!-- 4 convert -->
            <template v-else-if="step === 3">
              <div class="mh"><b>Customer accepted</b><span class="chip ok">Accepted</span></div>
              <div class="conv">
                <span class="doc"><small>Quotation</small><b>QT-1042</b></span>
                <span class="btn">Convert to invoice</span>
                <span class="doc big"><small>Tax invoice</small><b>INV-2210</b><em>VAT 18% included</em></span>
              </div>
              <p class="note">One click. Lines, prices and customer details carry over.</p>
            </template>

            <!-- 5 pay -->
            <template v-else>
              <div class="mh"><b>Invoice INV-2210</b><span class="chip ok">Paid</span></div>
              <ul class="lines">
                <li><span>Payment recorded · bank transfer</span><b>Rs 1,250,000</b></li>
                <li><span>Receipt sent by email</span><b class="g">✓ Sent</b></li>
              </ul>
              <div class="bar"><i></i></div>
              <p class="won"><span>Won</span>Deal marked as won automatically</p>
            </template>
          </div>
        </Transition>

        <p class="what">{{ cur.text }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "QuoteToCashSection" });


const base = "/saptivo/images/features/";
const photos = [
  base + "10.jpg",
  base + "13.jpg",
  base + "14.jpg",
];
const ok = ref(photos.map(() => true));

const steps = [
  { short: "Build the quote", tone: "lav", text: "Build the quotation from your catalog inside the deal." },
  { short: "Send and track", tone: "sky", text: "Send it by WhatsApp or email and track when it's opened." },
  { short: "Get approval", tone: "butter", text: "Get approval for any special discount from a manager." },
  { short: "Convert to invoice", tone: "rose", text: "Convert the accepted quote to a tax invoice in one click." },
  { short: "Get paid", tone: "mint", text: "Record payments and send receipts, with the deal marked as won." },
];

const step = ref(0);
const manual = ref(false);
const cur = computed(() => steps[step.value]);
const photoIdx = computed(() => (step.value <= 1 ? 0 : step.value <= 3 ? 1 : 2));

function go(i) {
  manual.value = true; // the visitor chose; stop rotating
  step.value = i;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function advance() {
  if (manual.value) return;
  step.value = (step.value + 1) % steps.length;
}
function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(advance, 3400);
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

.qc {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  --mint-d: #2f9c6b;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.qc *, .qc *::before, .qc *::after { box-sizing: border-box; }
.qc button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

.lav { --bg: #f1eeff; --mid: #ddd6ff; --deep: #7d6be6; }
.sky { --bg: #eaf4fd; --mid: #cfe4f8; --deep: #3f87c7; }
.butter { --bg: #fff6dc; --mid: #fde9a8; --deep: #a77d00; }
.rose { --bg: #fff0f4; --mid: #fddde7; --deep: #d8567f; }
.mint { --bg: #eaf8f0; --mid: #c9ecd9; --deep: #2f9c6b; }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }

/* rail */
.rail { list-style: none; width: min(1100px, calc(100% - 40px)); margin: 48px auto 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.rail li { position: relative; }
.rail li::before { content: ""; position: absolute; top: 22px; left: calc(50% + 26px); right: calc(-50% + 26px); height: 2px; background: #ece8e4; }
.rail li.past::before { background: var(--deep); }
.rail li:last-child::before { display: none; }
.rail button { position: relative; z-index: 1; width: 100%; display: grid; justify-items: center; gap: 8px; padding: 0; border: 0; background: none; cursor: pointer; font-family: inherit; color: var(--muted); }
.n { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: #fff; border: 2px solid #e4dfd9; font-size: 15px; font-weight: 600; color: #b8b1ab; transition: background 0.4s, border-color 0.4s, color 0.4s, transform 0.4s; }
.t { font-size: 13px; font-weight: 500; text-align: center; line-height: 1.3; transition: color 0.3s; }
.past .n { background: var(--mid); border-color: var(--mid); color: var(--ink); }
.past .t { color: var(--ink); }
.act .n { background: var(--deep); border-color: var(--deep); color: #fff; transform: scale(1.12); }
.act .t { color: var(--ink); font-weight: 600; }

/* stage */
.stage { width: min(1100px, calc(100% - 40px)); margin: 30px auto 0; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 22px; padding: 20px; border-radius: 32px; background: var(--bg); transition: background 0.6s; }
.photo { position: relative; min-height: 380px; border-radius: 24px; overflow: hidden; background: linear-gradient(135deg, #e8e3ff 0%, #dcecfb 55%, #d3f0e1 100%); }
.photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 28%; opacity: 0; transition: opacity 0.9s ease; }
.photo img.on { opacity: 1; }
.photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 45%, rgba(20, 18, 15, 0.35) 100%); pointer-events: none; }
.glass { position: absolute; z-index: 1; left: 16px; bottom: 16px; display: flex; align-items: center; gap: 12px; padding: 11px 18px 11px 14px; border-radius: 16px; background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 14px 30px -12px rgba(20, 18, 15, 0.4); }
.glass i { flex: none; width: 10px; height: 10px; border-radius: 50%; background: var(--deep); transition: background 0.5s; animation: blink 1.8s ease-in-out infinite; }
.qc:not(.live) .glass i { animation-play-state: paused; }
.glass b { display: block; font-size: 13px; font-weight: 600; }
.glass small { display: block; font-size: 11.5px; color: var(--muted); }

.side { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.mock { flex: 1; display: grid; gap: 12px; align-content: start; padding: 20px; border-radius: 24px; background: #fff; }
.what { margin: 0; padding: 4px 6px; font-size: 17px; font-weight: 500; line-height: 1.5; letter-spacing: -0.01em; }

.swap-enter-active { transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
.swap-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.swap-enter-from { opacity: 0; transform: translateY(12px); }
.swap-leave-to { opacity: 0; transform: translateY(-8px); }

.mh { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.mh b { font-size: 15px; font-weight: 500; }
.chip { padding: 3px 12px; border-radius: 99px; background: var(--mid); font-size: 11px; font-weight: 600; }
.chip.warn { background: #fff1c9; color: #a77d00; }
.chip.ok { background: #d3f0e1; color: #1d7a52; }
.lines { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.lines li { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border-radius: 12px; background: var(--bg); font-size: 13px; animation: pop 0.45s ease backwards; }
.lines li:nth-child(2) { animation-delay: 0.1s; } .lines li:nth-child(3) { animation-delay: 0.2s; } .lines li:nth-child(4) { animation-delay: 0.3s; }
.lines li b { font-weight: 600; font-variant-numeric: tabular-nums; }
.lines li .g { color: #1d7a52; }
.lines .tot { background: var(--mid); font-weight: 500; }
.note { margin: 0; font-size: 12.5px; color: var(--muted); }
.note.ok { padding: 8px 12px; border-radius: 12px; background: #d3f0e1; color: #1d5f43; font-weight: 500; animation: pop 0.5s ease 0.9s backwards; }

.chan { display: flex; gap: 8px; }
.chan span { padding: 6px 14px; border-radius: 99px; background: #f3f0ec; font-size: 12.5px; font-weight: 500; color: var(--muted); }
.chan span.on { background: #d6f5e0; color: #1d6b3f; }
.bub { max-width: 86%; padding: 11px 14px; border-radius: 16px 16px 16px 4px; background: #eaf8f0; font-size: 13px; line-height: 1.5; animation: pop 0.5s ease 0.15s backwards; }
.bub u { text-decoration: none; font-weight: 600; color: #1d6b3f; }
.track { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 14px; background: #fff1c9; font-size: 12.5px; animation: pop 0.5s ease 0.8s backwards; }
.track b { font-weight: 600; }
.eye { position: relative; width: 14px; height: 9px; border: 2px solid #a77d00; border-radius: 60% / 100%; }
.eye::after { content: ""; position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%; background: #a77d00; }

.appr { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 16px; background: var(--bg); animation: pop 0.45s ease backwards; }
.av { display: grid; place-items: center; flex: none; width: 36px; height: 36px; border-radius: 50%; background: var(--mid); font-size: 11px; font-weight: 600; }
.who { flex: 1; min-width: 0; }
.who b { display: block; font-size: 13px; font-weight: 500; }
.who small { font-size: 11.5px; color: var(--muted); }
.decision { display: flex; gap: 6px; }
.decision span { padding: 5px 12px; border-radius: 99px; font-size: 11.5px; font-weight: 600; }
.no { background: #fff; color: var(--muted); }
.yes { background: var(--ink); color: #fff; animation: press 0.5s ease 0.7s backwards; }

.conv { display: grid; grid-template-columns: 1fr auto 1.1fr; align-items: center; gap: 10px; }
.doc { display: grid; gap: 2px; padding: 12px 14px; border-radius: 14px; background: #f3f0ec; }
.doc.big { background: var(--mid); animation: pop 0.5s cubic-bezier(0.3, 1.4, 0.5, 1) 0.7s backwards; }
.doc small { font-size: 11px; color: var(--muted); }
.doc b { font-size: 14px; font-weight: 600; }
.doc em { font-style: normal; font-size: 11px; color: var(--deep); font-weight: 500; }
.btn { padding: 9px 14px; border-radius: 99px; background: var(--ink); color: #fff; font-size: 12px; font-weight: 500; white-space: nowrap; animation: press 0.6s ease 0.4s backwards; }

.bar { height: 10px; border-radius: 99px; background: var(--bg); overflow: hidden; }
.bar i { display: block; height: 100%; width: 100%; border-radius: 99px; background: var(--mint-d); animation: grow 1s cubic-bezier(0.3, 0.7, 0.2, 1) 0.2s backwards; }
.won { display: flex; align-items: center; gap: 10px; margin: 0; padding: 10px 14px; border-radius: 14px; background: #d3f0e1; font-size: 13px; font-weight: 500; animation: pop 0.5s ease 0.9s backwards; }
.won span { padding: 2px 12px; border-radius: 99px; background: var(--mint-d); color: #fff; font-size: 11px; font-weight: 700; }

@keyframes pop { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes press { 0%, 100% { transform: none; } 45% { transform: scale(0.92); } }
@keyframes grow { from { width: 0; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* entrance (runs once) */
.qc:not(.in) .rail, .qc:not(.in) .stage { opacity: 0; }
.qc.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.qc.in .title .soft { animation-delay: 0.1s; }
.qc.in .rail { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.qc.in .stage { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 900px) {
  .stage { grid-template-columns: 1fr; }
  .photo { min-height: 240px; }
}
@media (max-width: 640px) {
  .qc { padding: 72px 0; }
  .rail { grid-template-columns: repeat(5, 1fr); gap: 4px; }
  .rail li::before { left: calc(50% + 18px); right: calc(-50% + 18px); top: 16px; }
  .n { width: 32px; height: 32px; font-size: 12px; }
  .t { font-size: 10.5px; }
  .stage { padding: 12px; border-radius: 24px; }
  .conv { grid-template-columns: 1fr; justify-items: stretch; }
  .btn { text-align: center; }
  .what { font-size: 15.5px; }
}
@media (prefers-reduced-motion: reduce) {
  .qc *, .qc *::before, .qc *::after { animation: none !important; transition: none !important; }
  .qc:not(.in) .rail, .qc:not(.in) .stage { opacity: 1; }
}
</style>
