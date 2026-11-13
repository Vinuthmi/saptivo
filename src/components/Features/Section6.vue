<template>
  <section id="choose-modules" ref="root" class="cm" :class="{ in: seen, live }">
    <!-- ============ Part A: replace the pile of tools ============ -->
    <div class="a">
      <h2 class="title">
        Replace your spreadsheets, WhatsApp groups and invoicing tool with
        <span class="soft">one system</span>
      </h2>

      <div class="merge" aria-hidden="true">
        <div class="tool t1">
          <span class="ti"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z" /><path d="M4 10h16M4 15h16M10 4v16" /></svg></span>
          <div><b>Spreadsheet</b><small>leads_final_v7.xlsx</small></div>
          <i class="bad">v7?</i>
        </div>
        <div class="tool t2">
          <span class="ti wa"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg></span>
          <div><b>WhatsApp groups</b><small>14 groups · 300+ unread</small></div>
          <i class="bad">300</i>
        </div>
        <div class="tool t3">
          <span class="ti"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" /><path d="M9 8h6M9 12h6" /></svg></span>
          <div><b>Invoicing tool</b><small>3 invoices not sent</small></div>
          <i class="bad">3</i>
        </div>

        <div class="one-card">
          <div class="oc-head">
            <div class="brand-lockup" aria-label="Saptivo brand">
              <img :src="logoSrc" alt="Saptivo logo" class="oc-logo" />

            </div>
            <span class="oc-badge">One system</span>
          </div>
          <div class="oc-chips">
            <span style="--i: 0">Leads</span>
            <span style="--i: 1">WhatsApp</span>
            <span style="--i: 2">Quotes</span>
            <span style="--i: 3">Invoices</span>
            <span style="--i: 4">Service</span>
          </div>
          <small>One database · one customer record</small>
        </div>
      </div>
    </div>

    <!-- ============ Part B: how to choose ============ -->
    <div class="b">
      <div class="b-copy">
        <h2 class="h2b">How to choose the right modules</h2>
        <p>
          Start with the problem that costs you the most today. If enquiries go unanswered, begin with lead management and
          WhatsApp CRM. If quotes are slow, start with quotations and invoicing. If you install and maintain equipment,
          service and AMC management will pay for itself quickly. Every module can be switched on later without migrating data.
        </p>

        <div class="later" aria-hidden="true">
          <div class="later-row">
            <span class="lc on"><span class="tk">✓</span>Leads</span>
            <span class="lc on"><span class="tk">✓</span>WhatsApp CRM</span>
            <span class="lc new"><span class="plus">+</span><span class="tk2">✓</span>Service and AMC</span>
          </div>
          <div class="data">
            <span>Your data stays put</span>
            <i class="data-bar"><b></b></i>
            <em class="zero">0 records migrated</em>
          </div>
        </div>
      </div>

      <div class="picker">
        <div class="plabel">What costs you the most today?</div>
        <ul class="plist" role="tablist" @mouseenter="paused = true" @mouseleave="paused = false" @focusin="paused = true" @focusout="paused = false">
          <li v-for="(p, i) in picks" :key="p.problem">
            <button type="button" class="ptab" :class="{ on: i === pick }" role="tab" :aria-selected="i === pick" @click="pick = i">
              <span class="pic" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path v-for="(d, k) in p.icon" :key="k" :d="d" /></svg>
              </span>
              <span class="pname">{{ p.problem }}</span>
              <span class="pline" aria-hidden="true"><span class="pfill" :style="{ animationPlayState: paused ? 'paused' : 'running' }" @animationend="next"></span></span>
            </button>
          </li>
        </ul>

        <div :key="pick" class="result" role="tabpanel" aria-live="polite">
          <div class="r-top">
            <small>Start with</small>
            <div class="chips">
              <span v-for="(c, i) in current.start" :key="c" class="chip" :style="{ '--i': i }">{{ c }}</span>
            </div>
          </div>
          <div class="stats">
            <div v-for="s in current.stats" :key="s.label" class="stat">
              <small>{{ s.label }}</small>
              <b><span class="cnt" :style="{ '--n': s.to, '--from': s.from }"></span><span class="unit">{{ s.unit }}</span></b>
            </div>
          </div>
          <div class="r-foot">
            <span class="note">{{ current.note }}</span>
            <span class="ill">Illustrative figures</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "FeaturesSection6" });

const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`;

const picks = [
  {
    problem: "Enquiries go unanswered",
    icon: ["M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"],
    start: ["Lead management", "WhatsApp CRM"],
    note: "Begin here when enquiries slip through.",
    stats: [
      { label: "Unanswered enquiries", from: 12, to: 0, unit: "" },
      { label: "First reply", from: 180, to: 2, unit: " min" },
    ],
  },
  {
    problem: "Quotes are slow",
    icon: ["M6 3h9l4 4v14H6z", "M14 3v5h5", "M9 13h6", "M9 17h6"],
    start: ["Quotations and invoicing"],
    note: "Begin here when quotes take too long.",
    stats: [
      { label: "Quotes sent per week", from: 3, to: 18, unit: "" },
      { label: "Time to send a quote", from: 240, to: 12, unit: " min" },
    ],
  },
  {
    problem: "You install and maintain equipment",
    icon: ["M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.1-.5-.5-2.1z"],
    start: ["Service and AMC management"],
    note: "Pays for itself quickly.",
    stats: [
      { label: "Missed AMC renewals", from: 7, to: 0, unit: "" },
      { label: "Preventive visits booked", from: 4, to: 21, unit: "" },
    ],
  },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const pick = ref(0);
const paused = ref(false);
const current = computed(() => picks[pick.value]);
const next = () => { pick.value = (pick.value + 1) % picks.length; };

const st = { io: null, fallback: null };

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true; // static: everything visible, nothing moves
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) { seen.value = true; live.value = true; }
      else live.value = false; // pauses every loop while off screen
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
});
</script>

<style scoped>
.cm {
  --orange: #33485d;
  --orange-soft: #edf1f4;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #e4e9ed;
  --dur: 5s;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
}
.cm *, .cm *::before, .cm *::after { box-sizing: border-box; }
.cm button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

/* ================= Part A ================= */
.title {
  margin: 0 auto; width: min(960px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(32px, 3.6vw, 54px); font-weight: 500; line-height: 1.18; letter-spacing: -0.03em; color: var(--ink);
}
.title span { display: block; }

.merge { position: relative; width: min(980px, calc(100% - 40px)); height: 340px; margin: 56px auto 0; }
.tool {
  --x: 0px; --y: 0px; --r: 0deg;
  position: absolute; left: 50%; top: 50%; z-index: 1; width: 214px;
  display: flex; align-items: center; gap: 12px; padding: 12px 14px;
  background: #fff; border: 1px solid var(--line); border-radius: 14px;
  box-shadow: 0 12px 28px rgba(80, 40, 20, 0.1);
  transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--r));
  animation: tool 9s ease-in-out infinite;
}
.t1 { --x: -310px; --y: -50px; --r: -6deg; }
.t2 { --x: 310px; --y: -62px; --r: 5deg; animation-delay: -0.2s; }
.t3 { --x: 0px; --y: 138px; --r: 2deg; animation-delay: -0.4s; }
.ti { flex: none; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; background: #f4efec; color: #6a6560; }
.ti.wa { background: #e6f6ec; color: #15803d; }
.tool b { display: block; font-size: 13px; font-weight: 600; }
.tool small { display: block; color: var(--muted); font-size: 11.5px; }
.bad { flex: none; margin-left: auto; padding: 3px 7px; border-radius: 99px; background: #fde8e8; color: #dc2626; font-size: 10.5px; font-style: normal; font-weight: 600; }

.one-card {
  position: absolute; left: 50%; top: 50%; z-index: 2; width: min(390px, 92%);
  padding: 20px; border-radius: 22px; background: #fff; border: 1px solid var(--line);
  transform: translate(-50%, -50%);
  box-shadow: 0 22px 50px rgba(51, 72, 93, 0.2), 0 0 0 4px rgba(51, 72, 93, 0.08);
}
.oc-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.brand-lockup { display: inline-flex; align-items: center; gap: 10px; }
.oc-logo { width: 72px; height: 42px; border-radius: 12px; object-fit: contain; box-shadow: 0 8px 16px rgba(51, 72, 93, 0.12); }
.oc-brand-name { font-size: 1.2rem; font-weight: 700; letter-spacing: -0.03em; }
.oc-head b { font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
.oc-badge { padding: 5px 11px; border-radius: 99px; background: var(--orange); color: #fff; font-size: 11.5px; font-weight: 600; }
.oc-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
.oc-chips span { padding: 6px 12px; border-radius: 99px; background: var(--orange-soft); color: #c4400f; font-size: 12px; font-weight: 500; }
.one-card small { display: block; color: var(--muted); font-size: 12px; }

/* ================= Part B ================= */
.b {
  width: min(1180px, calc(100% - 40px)); margin: 120px auto 0;
  display: grid; grid-template-columns: 1fr 1.05fr; gap: 72px; align-items: center;
}
.h2b { margin: 0 0 20px; font-size: clamp(30px, 3vw, 44px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; text-wrap: balance; }
.b-copy p { margin: 0; max-width: 56ch; font-size: 16px; line-height: 1.75; color: var(--muted); }

.later { margin-top: 28px; padding: 18px; border: 1px solid var(--line); border-radius: 18px; background: #f5f7f8; }
.later-row { display: flex; flex-wrap: wrap; gap: 8px; }
.lc { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 99px; background: #fff; border: 1px solid rgba(51, 72, 93, 0.35); font-size: 12.5px; font-weight: 500; }
.lc .tk { color: #15803d; font-weight: 700; }
.lc.new { position: relative; border: 1px dashed #c9bfb9; color: #9a948d; background: transparent; animation: later 7s ease-in-out infinite; }
.lc.new .plus, .lc.new .tk2 { display: inline-block; width: 10px; text-align: center; font-weight: 700; }
.lc.new .plus { animation: plusOut 7s ease-in-out infinite; }
.lc.new .tk2 { position: absolute; left: 14px; color: #15803d; opacity: 0; animation: tkIn 7s ease-in-out infinite; }
.data { display: flex; align-items: center; gap: 10px; margin-top: 14px; font-size: 12px; color: var(--muted); }
.data-bar { position: relative; flex: 1; height: 6px; border-radius: 3px; background: rgba(20, 18, 15, 0.08); overflow: hidden; }
.data-bar b { position: absolute; inset: 0; background: #25b865; opacity: 0.55; }
.data-bar b::after { content: ""; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.7) 50%, transparent 70%); transform: translateX(-100%); animation: sheen 2.6s ease-in-out infinite; }
.zero { padding: 4px 9px; border-radius: 99px; background: #e6f6ec; color: #15803d; font-size: 11px; font-style: normal; font-weight: 600; white-space: nowrap; opacity: 0; animation: zeroIn 7s ease-in-out infinite; }

/* picker */
.picker { padding: 24px; border: 1px solid var(--line); border-radius: 26px; background: #fff; box-shadow: 0 1px 2px rgba(23, 25, 29, 0.04), 0 24px 50px -22px rgba(51, 72, 93, 0.22); min-width: 0; }
.plabel { margin-bottom: 6px; font-size: 12.5px; font-weight: 500; color: var(--muted); }
.plist { list-style: none; margin: 0; padding: 0; }
.ptab { position: relative; display: flex; align-items: center; gap: 14px; width: 100%; padding: 16px 0 18px; background: none; border: 0; text-align: left; font: inherit; color: inherit; cursor: pointer; }
.pic { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: var(--orange-soft); color: var(--orange); transition: background 0.3s, color 0.3s; }
.pname { font-size: 16.5px; font-weight: 500; letter-spacing: -0.01em; color: #8a857f; transition: color 0.3s; }
.ptab:hover .pname, .ptab.on .pname { color: var(--ink); }
.ptab.on .pic { background: var(--orange); color: #fff; }
.pline { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: rgba(20, 18, 15, 0.08); overflow: hidden; }
.pfill { position: absolute; inset: 0; width: 0; background: var(--orange); }
.ptab.on .pfill { animation: fill var(--dur) linear forwards; }

.result { margin-top: 14px; padding: 18px; border-radius: 18px; background: #f5f7f8; border: 1px solid var(--line); animation: rise 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
.r-top small, .stat small { display: block; font-size: 11.5px; color: var(--muted); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.chip { padding: 7px 13px; border-radius: 99px; background: var(--orange); color: #fff; font-size: 12.5px; font-weight: 600; animation: pop 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) calc(0.15s + var(--i) * 0.12s) both; }
.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
.stat { padding: 12px 14px; border-radius: 14px; background: #fff; border: 1px solid var(--line); }
.stat b { display: block; margin-top: 2px; font-size: 26px; font-weight: 600; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.unit { font-size: 13px; font-weight: 500; color: var(--muted); letter-spacing: 0; }
.r-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 14px; font-size: 12.5px; }
.note { font-weight: 500; }
.ill { color: #9a948d; font-size: 11px; }

/* counters */
@property --n { syntax: "<integer>"; initial-value: 0; inherits: false; }
.cnt { counter-reset: n var(--n); }
.cnt::before { content: counter(n); }
.result .cnt { animation: count 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s both; }

/* ================= entrance + pause when off screen ================= */
.cm:not(.in) .a, .cm:not(.in) .b { opacity: 0; }
.cm.in .merge { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s backwards; }
.cm.in .b-copy { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.cm.in .picker { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.cm:not(.live) .tool,
.cm:not(.live) .lc.new, .cm:not(.live) .lc.new .plus, .cm:not(.live) .lc.new .tk2, .cm:not(.live) .zero,
.cm:not(.live) .data-bar b::after { animation-play-state: paused; }
.cm:not(.live) .pfill { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
@keyframes fill { from { width: 0; } to { width: 100%; } }
@keyframes count { from { --n: var(--from); } }
@keyframes sheen { 0%, 30% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes tool {
  0%, 30% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--r)); opacity: 1; }
  8% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y) - 5px)) rotate(calc(var(--r) + 2deg)); }
  18% { transform: translate(calc(-50% + var(--x) + 4px), calc(-50% + var(--y) + 4px)) rotate(calc(var(--r) - 2deg)); }
  52% { transform: translate(-50%, -50%) rotate(0deg) scale(0.35); opacity: 0; }
  90% { transform: translate(-50%, -50%) rotate(0deg) scale(0.35); opacity: 0; }
  100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--r)); opacity: 1; }
}
@keyframes later {
  0%, 40% { border-style: dashed; border-color: #c9bfb9; color: #9a948d; background: transparent; transform: scale(1); }
  46% { transform: scale(1.08); }
  50%, 92% { border-style: solid; border-color: rgba(51, 72, 93, 0.5); color: var(--ink); background: #fff; transform: scale(1); }
  100% { border-style: dashed; border-color: #c9bfb9; color: #9a948d; background: transparent; transform: scale(1); }
}
@keyframes plusOut { 0%, 44% { opacity: 1; } 50%, 92% { opacity: 0; } 100% { opacity: 1; } }
@keyframes tkIn { 0%, 44% { opacity: 0; } 50%, 92% { opacity: 1; } 100% { opacity: 0; } }
@keyframes zeroIn { 0%, 52% { opacity: 0; transform: scale(0.8); } 58%, 92% { opacity: 1; transform: none; } 100% { opacity: 0; transform: scale(0.8); } }

/* ================= responsive ================= */
@media (max-width: 960px) {
  .b { grid-template-columns: minmax(0, 1fr); gap: 48px; margin-top: 88px; }
  .b-copy p { max-width: none; }
}
@media (max-width: 760px) {
  .cm { padding: 72px 0; }
  .merge { height: 410px; margin-top: 40px; }
  .tool { width: 156px; padding: 10px; gap: 8px; }
  .tool small { font-size: 10.5px; }
  .ti { width: 30px; height: 30px; }
  .t1 { --x: -78px; --y: -158px; }
  .t2 { --x: 78px; --y: -146px; }
  .t3 { --x: 0px; --y: 160px; }
  .b { width: calc(100% - 32px); }
  .picker { padding: 16px; border-radius: 22px; }
  .pname { font-size: 15px; }
  .stats { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .cm *, .cm *::before, .cm *::after { animation: none !important; transition: none !important; }
  .cm:not(.in) .a, .cm:not(.in) .b { opacity: 1; }
  .tool { display: none; }
  .one-card { opacity: 1; filter: none; transform: translate(-50%, -50%); box-shadow: 0 26px 60px rgba(51, 72, 93, 0.24); }
  .oc-chips span { background: var(--orange-soft); color: #c4400f; }
  .lc.new { border-style: solid; border-color: rgba(51, 72, 93, 0.5); color: var(--ink); background: #fff; }
  .lc.new .plus { opacity: 0; }
  .lc.new .tk2, .zero { opacity: 1; }
  .ptab.on .pfill { width: 100%; }
}
</style>
