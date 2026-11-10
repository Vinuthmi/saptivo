<template>
  <section id="estimates" ref="root" class="est" :class="{ in: seen, live }" aria-labelledby="est-title">
    <header class="head">
      <h2 id="est-title" class="title">
        <span>Estimates first,</span>
        <span class="soft">quotations when you're ready</span>
      </h2>
      <p>
        Sometimes the customer needs rough numbers today and a final proposal next week. Saptivo's estimates engine prepares
        preliminary costs and multi-tier options with version history, kept separate from final sales quotations.
      </p>
    </header>

    <div class="stage">
      <!-- ============ the estimate ============ -->
      <article class="doc estimate" aria-label="Estimate">
        <div class="dh">
          <span class="badge">Estimate</span>
          <div class="dt"><b>Fleet service plan</b><small>Ceylon Motors · preliminary, not an offer</small></div>
          <span :key="version" class="ver">v{{ version }}</span>
        </div>

        <div class="tiers">
          <div v-for="(t, i) in tiers" :key="t.name" class="tier" :class="[t.tone, { pick: chosen && i === 1 }]">
            <span class="tick" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
            </span>
            <small>{{ t.name }}</small>
            <b :key="version" class="price"><span class="pre">≈ Rs. </span>{{ t.range[version - 1] }}K</b>
            <span class="tdesc">{{ t.desc }}</span>
          </div>
        </div>

        <ul class="hist" aria-label="Version history">
          <li v-for="(h, i) in history" :key="h.v" :class="{ cur: i === version - 1, shown: i < version }">
            <span class="hv">{{ h.v }}</span>
            <span class="ht">{{ h.text }}</span>
            <span class="hw">{{ h.when }}</span>
            <em v-if="i === version - 1" class="now">Current</em>
          </li>
        </ul>

        <div class="toast" :class="{ show: !!toast }" role="status">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
          {{ toast }}
        </div>
      </article>

      <!-- ============ the bridge ============ -->
      <div class="link" :class="{ flow, press }" aria-hidden="true">
        <span class="sep"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>Kept separate</span>
        <span class="dotp"></span>
        <span class="convert">
          Convert
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
        <small>when you're ready</small>
      </div>

      <!-- ============ the final quotation ============ -->
      <article class="doc quote" :class="{ final }" aria-label="Final quotation">
        <div class="dh">
          <span class="badge">Quotation</span>
          <div class="dt"><b>QT-0142</b><small>Ceylon Motors · sales document</small></div>
          <span :key="qstate" class="qs" :class="qstate">{{ qLabel }}</span>
        </div>

        <div class="qbody">
          <div class="empty" :class="{ hide: qLines > 0 }">
            No quotation yet.<br />Nothing has been sent to the customer.
          </div>
          <ul class="lines">
            <li v-for="(l, i) in lines" :key="l.name" :class="{ shown: i < qLines }">
              <span>{{ l.name }}</span><b class="mono">Rs. {{ l.amount }}</b>
            </li>
          </ul>
          <div class="total" :class="{ shown: qLines > 0 }">
            <span>Total</span>
            <b :key="final" class="mono">{{ final ? 'Rs. 405,000' : 'Rs. ···' }}</b>
          </div>
        </div>

        <div class="qfoot" :class="{ show: final }">
          <span class="send">Ready to send</span>
          <span class="stamp" aria-hidden="true">FINAL</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const tiers = [
  { name: "Basic", tone: "peach", desc: "10 users · email support", range: ["280–320", "285–315", "290–300"] },
  { name: "Standard", tone: "butter", desc: "10 users · WhatsApp CRM · onboarding", range: ["380–430", "390–420", "395–410"] },
  { name: "Premium", tone: "sky", desc: "25 users · AI calls · priority support", range: ["520–600", "540–580", "550–570"] },
];
const history = [
  { v: "v1", text: "Rough numbers", when: "Today 10:12" },
  { v: "v2", text: "After the site visit", when: "Today 14:40" },
  { v: "v3", text: "Ranges tightened", when: "Mon 09:05" },
];
const lines = [
  { name: "CRM licence · 10 users", amount: "300,000" },
  { name: "WhatsApp integration", amount: "60,000" },
  { name: "Onboarding and training", amount: "45,000" },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const version = ref(1);
const chosen = ref(false);
const press = ref(false);
const flow = ref(false);
const qLines = ref(0);
const final = ref(false);
const toast = ref("");

const qstate = computed(() => (qLines.value === 0 ? "none" : final.value ? "fin" : "draft"));
const qLabel = computed(() => (qLines.value === 0 ? "Not created" : final.value ? "Final" : "Drafting"));

// plain bookkeeping, kept out of the template
const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 17; // beats of 1.2 s

function reset() {
  version.value = 1;
  chosen.value = false;
  press.value = false;
  flow.value = false;
  qLines.value = 0;
  final.value = false;
  toast.value = "";
}

function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b === 2) { version.value = 2; toast.value = "Version 2 saved · v1 kept"; }
  if (b === 4) { version.value = 3; toast.value = "Version 3 saved · v2 kept"; }
  if (b === 6) { chosen.value = true; toast.value = "Customer picks Standard"; }
  if (b === 8) { press.value = true; flow.value = true; toast.value = ""; }
  if (b === 9) { press.value = false; qLines.value = 1; }
  if (b === 10) qLines.value = 2;
  if (b === 11) qLines.value = 3;
  if (b === 12) { final.value = true; flow.value = false; }
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
    // static picture: version 3 picked, the final quotation done
    seen.value = true;
    for (let k = 0; k < 13; k++) tick();
    toast.value = "";
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
  // safety net so the content can never stay invisible
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

.est {
  --ink: #14120f;
  --muted: #6a6560;
  --peach: #ffe9df;
  --butter: #fff3cf;
  --sky: #e0f0ff;
  --lav: #f0ecff;
  --mint: #e3f6ec;
  --pink: #ffe4ee;
  --orange: #ff6338;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.est *, .est *::before, .est *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

/* ---------- heading ---------- */
.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.head p { margin: 0 auto; max-width: 60ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

/* ---------- stage ---------- */
.stage {
  width: min(1180px, calc(100% - 40px)); margin: 64px auto 0;
  display: grid; grid-template-columns: minmax(0, 1.4fr) 136px minmax(0, 1fr); align-items: stretch;
}
.doc { position: relative; display: flex; flex-direction: column; gap: 18px; padding: 26px; border-radius: 30px; min-width: 0; }
.estimate { background: var(--lav); }
.quote { background: var(--mint); }
.dh { display: flex; align-items: center; gap: 12px; }
.badge { flex: none; padding: 6px 12px; border-radius: 99px; background: #fff; font-size: 12px; font-weight: 600; }
.estimate .badge { color: #5b45c9; }
.quote .badge { color: #15803d; }
.dt { min-width: 0; flex: 1; }
.dt b { display: block; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.dt small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ver { flex: none; padding: 5px 11px; border-radius: 99px; background: #5b45c9; color: #fff; font-size: 12px; font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }

/* tiers */
.tiers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.tier { position: relative; display: flex; flex-direction: column; gap: 3px; padding: 14px; border-radius: 20px; border: 2px solid transparent; transition: border-color 0.35s, transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1), box-shadow 0.4s; }
.tier.peach { background: var(--peach); }
.tier.butter { background: var(--butter); }
.tier.sky { background: var(--sky); }
.tier small { font-size: 11.5px; font-weight: 600; color: #6f5f58; }
.price { display: block; font-size: 17px; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.tdesc { font-size: 11px; line-height: 1.45; color: #6f6862; }
.tick { position: absolute; top: 10px; right: 10px; display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: #5b45c9; color: #fff; opacity: 0; transform: scale(0.4); transition: opacity 0.3s, transform 0.4s cubic-bezier(0.3, 1.8, 0.5, 1); }
.tier.pick { border-color: #5b45c9; transform: translateY(-3px); box-shadow: 0 16px 28px -16px rgba(91, 69, 201, 0.55); }
.tier.pick .tick { opacity: 1; transform: none; }

/* version history */
.hist { list-style: none; margin: 0; padding: 14px; border-radius: 20px; background: #fff; display: grid; gap: 4px; min-height: 142px; align-content: start; }
.hist li { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 12px; font-size: 12.5px; opacity: 0; transform: translateY(6px); transition: opacity 0.4s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.3s; }
.hist li.shown { opacity: 0.55; transform: none; }
.hist li.cur { opacity: 1; background: var(--lav); }
.hv { flex: none; width: 24px; font-weight: 600; color: #5b45c9; }
.ht { flex: 1; min-width: 0; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hw { flex: none; color: var(--muted); font-size: 11.5px; }
.now { flex: none; padding: 2px 8px; border-radius: 99px; background: #5b45c9; color: #fff; font-size: 10.5px; font-style: normal; font-weight: 600; }

.toast { position: absolute; left: 50%; bottom: -14px; display: inline-flex; align-items: center; gap: 7px; padding: 9px 15px; border-radius: 99px; background: #fff; color: #5b45c9; font-size: 12px; font-weight: 600; white-space: nowrap; box-shadow: 0 12px 26px -10px rgba(91, 69, 201, 0.5); opacity: 0; transform: translate(-50%, 10px) scale(0.94); transition: opacity 0.35s, transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1); pointer-events: none; }
.toast.show { opacity: 1; transform: translate(-50%, 0) scale(1); }

/* bridge */
.link { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 0 10px; }
.link::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 2px dashed #d9cdf7; }
.link > * { position: relative; }
.sep { display: inline-flex; align-items: center; gap: 6px; padding: 6px 11px; border-radius: 99px; background: #fff; border: 1px solid #ece4f9; color: #7a6c9e; font-size: 11px; font-weight: 600; white-space: nowrap; }
.convert { display: inline-flex; align-items: center; gap: 6px; padding: 11px 16px; border-radius: 99px; background: var(--pink); color: #b0245a; font-size: 13px; font-weight: 600; box-shadow: 0 0 0 5px #fff; transition: transform 0.25s, background 0.3s; }
.link.press .convert { transform: scale(0.9); background: #ffc9dc; }
.link small { padding: 2px 8px; background: #fff; color: var(--muted); font-size: 11px; border-radius: 99px; white-space: nowrap; }
.dotp { position: absolute; left: 0; top: calc(50% - 4px); width: 8px; height: 8px; border-radius: 50%; background: #b0245a; opacity: 0; }
.link.flow .dotp { animation: travel 1.1s ease-in-out infinite; }

/* quotation */
.qs { flex: none; padding: 5px 11px; border-radius: 99px; background: #fff; color: #8a857f; font-size: 12px; font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.qs.draft { color: #b45309; background: #fff3cf; }
.qs.fin { background: #15803d; color: #fff; }
.qbody { position: relative; flex: 1; display: flex; flex-direction: column; gap: 10px; padding: 16px; border-radius: 20px; background: #fff; min-height: 232px; }
.empty { position: absolute; inset: 16px; display: grid; place-items: center; border: 2px dashed #cfe9db; border-radius: 14px; text-align: center; font-size: 12.5px; line-height: 1.6; color: var(--muted); transition: opacity 0.35s; }
.empty.hide { opacity: 0; pointer-events: none; }
.lines { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.lines li { display: flex; justify-content: space-between; gap: 10px; padding-bottom: 8px; border-bottom: 1px solid #edf5f0; font-size: 12.5px; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); }
.lines li.shown { opacity: 1; transform: none; }
.lines b { font-weight: 600; white-space: nowrap; }
.total { display: flex; justify-content: space-between; margin-top: auto; font-size: 14px; font-weight: 600; opacity: 0; transition: opacity 0.4s; }
.total.shown { opacity: 1; }
.total b { animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.qfoot { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 36px; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.45s; }
.qfoot.show { opacity: 1; transform: none; }
.send { padding: 9px 16px; border-radius: 99px; background: #15803d; color: #fff; font-size: 12.5px; font-weight: 600; }
.stamp { padding: 4px 12px; border: 2px solid #15803d; border-radius: 8px; color: #15803d; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; transform: rotate(-7deg); }
.qfoot.show .stamp { animation: stampIn 0.5s cubic-bezier(0.3, 1.8, 0.5, 1) 0.15s both; }

/* ---------- entrance + pause ---------- */
.est:not(.in) .head, .est:not(.in) .stage { opacity: 0; }
.est.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.est.in .estimate { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.est.in .link { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }
.est.in .quote { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.4s backwards; }
.est:not(.live) .dotp { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: scale(1.18); opacity: 0.4; } to { transform: none; opacity: 1; } }
@keyframes travel { 0% { left: 0; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { left: calc(100% - 8px); opacity: 0; } }
@keyframes travelY { 0% { top: 0; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: calc(100% - 8px); opacity: 0; } }
@keyframes stampIn { from { opacity: 0; transform: rotate(-7deg) scale(1.7); } to { opacity: 1; transform: rotate(-7deg) scale(1); } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .stage { grid-template-columns: minmax(0, 1fr); max-width: 640px; }
  .link { flex-direction: row; justify-content: center; padding: 22px 0; gap: 8px; flex-wrap: wrap; }
  .link::before { left: 50%; right: auto; top: 0; bottom: 0; border-top: 0; border-left: 2px dashed #d9cdf7; }
  .dotp { left: calc(50% - 4px); top: 0; }
  .link.flow .dotp { animation-name: travelY; }
  .convert svg { transform: rotate(90deg); }
}
@media (max-width: 640px) {
  .est { padding: 72px 0; }
  .head p { font-size: 15.5px; }
  .stage { margin-top: 44px; width: calc(100% - 32px); }
  .doc { padding: 18px; border-radius: 24px; }
  .tiers { gap: 6px; }
  .tier { padding: 10px; border-radius: 16px; }
  .price { font-size: 13.5px; white-space: nowrap; }
  .pre { display: none; }
  .tdesc { display: none; }
  .hw { display: none; }
  .dt small { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .est *, .est *::before, .est *::after { animation: none !important; transition: none !important; }
  .est:not(.in) .head, .est:not(.in) .stage { opacity: 1; }
  .dotp { display: none; }
}
</style>
