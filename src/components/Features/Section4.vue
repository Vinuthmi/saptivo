<template>
  <section id="automation" ref="root" class="wsm" :class="{ in: seen }" aria-labelledby="wsm-title">
    <h2 id="wsm-title" class="title">Work smarter</h2>

    <div class="top">
      <!-- workflow builder -->
      <div class="ill">
        <div class="back back-a" aria-hidden="true"></div>
        <div class="face tint-a">
          <span class="live-b" aria-hidden="true"><i></i>Automation running · <span class="cnt" style="--n:128"></span> runs today</span>
          <div class="flow" aria-hidden="true">
            <div class="flow-in">
              <div class="node" style="--d:.2s;--g:0s"><i class="n-ic">⚡</i>New lead<small>WhatsApp</small></div>
              <i class="wire" style="--p:1.2s"></i>
              <div class="node" style="--d:.5s;--g:1.2s"><i class="n-ic">?</i>Score is 70 or more<small>Condition</small></div>
              <i class="wire" style="--p:1.7s"></i>
              <div class="node" style="--d:.8s;--g:2.4s"><i class="n-ic">→</i>Assign to Sales, Colombo<small>Routing</small></div>
              <i class="wire" style="--p:2.2s"></i>
              <div class="node" style="--d:1.1s;--g:3.6s"><i class="n-ic">✓</i>Follow up in 1 hour<small>Reminder</small></div>
            </div>
          </div>
        </div>
      </div>

      <!-- reports + AI -->
      <div class="ill">
        <div class="back back-b" aria-hidden="true"></div>
        <div class="face tint-b">
          <div class="rep" aria-hidden="true">
            <div class="kpis">
              <div class="kpi" style="--d:.2s"><small>Revenue</small><b>Rs. <span class="cnt" style="--n:12"></span>.4M</b><span class="up">+18%</span></div>
              <div class="kpi" style="--d:.35s"><small>Win rate</small><b><span class="cnt" style="--n:34"></span>%</b><span class="up">+4%</span></div>
              <div class="kpi" style="--d:.5s"><small>First reply</small><b>2.1 h</b><span class="up">-22%</span></div>
            </div>
            <div class="chart">
              <svg viewBox="0 0 300 110" preserveAspectRatio="none">
                <path class="area" d="M0 90 L40 78 L80 84 L120 56 L160 62 L200 34 L240 40 L300 12 L300 110 L0 110 Z" />
                <path class="ln" pathLength="1" d="M0 90 L40 78 L80 84 L120 56 L160 62 L200 34 L240 40 L300 12" />
                <path class="ln-pulse" pathLength="1" d="M0 90 L40 78 L80 84 L120 56 L160 62 L200 34 L240 40 L300 12" />
              </svg>
              <i class="end"></i>
            </div>
            <div class="chips">
              <span class="chip g" style="--d:1.6s">Win probability 78%</span>
              <span class="chip" style="--d:1.9s">Lead score 86</span>
              <span class="chip" style="--d:2.2s">Churn risk: Low</span>
              <span class="chip" style="--d:2.5s">AI drafting reply<i class="dots"><b></b><b></b><b></b></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="feat" style="--f:0s">
        <span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h4v4H5z"/><path d="M15 15h4v4h-4z"/><path d="M9 7h4a2 2 0 0 1 2 2v6"/></svg></span>
        <h3>Workflow automation</h3>
        <p>A no-code builder for follow-ups, routing, approvals and escalations.</p>
      </div>
      <div class="feat" style="--f:.15s">
        <span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg></span>
        <h3>Reports and analytics</h3>
        <p>Real-time dashboards, custom reports and one-click exports.</p>
      </div>
      <div class="feat" style="--f:.3s">
        <span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg></span>
        <h3>AI CRM</h3>
        <p>Lead scoring, win probability, churn prediction, email drafting and call summaries.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "WorkSmarter" });

const root = ref(null);
const seen = ref(false);
let io = null;

// plays the entrance animations once, when the section scrolls into view
onMounted(() => {
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    seen.value = true;
    return;
  }
  io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { seen.value = true; io.disconnect(); }
  }, { threshold: 0.25 });
  io.observe(root.value);
});
onBeforeUnmount(() => io?.disconnect());
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.wsm {
  --orange: #33485d;
  --ink: #14120f;
  --muted: #6a6560;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Inter", system-ui, sans-serif;
}
.wsm *, .wsm *::before, .wsm *::after { box-sizing: border-box; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15;
  letter-spacing: -0.03em; color: var(--ink);
}

/* ---------- illustration cards ---------- */
.top {
  width: min(1180px, calc(100% - 40px)); margin: 72px auto 0;
  display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
}
.ill { position: relative; aspect-ratio: 4 / 3.1; }
.back {
  position: absolute; inset: 0; border-radius: 24px;
  transition: transform 1s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.back-a { background: var(--orange); }
.back-b { background: #dce5eb; }
.in .back-a { transform: rotate(-4deg) scale(0.95); animation: sway-a 7s ease-in-out 1.2s infinite alternate; }
.in .back-b { transform: rotate(3.5deg) scale(0.95); animation: sway-b 7s ease-in-out 1.2s infinite alternate; }
.face {
  position: absolute; inset: 0; overflow: hidden; border-radius: 24px;
  border: 1px solid rgba(20, 18, 15, 0.06);
}
.tint-a { background: #edf1f4; }
.tint-b { background: #fff6e8; }

/* workflow */
.flow { position: absolute; inset: 0; display: grid; place-items: center; }
.flow-in { width: min(80%, 370px); }
.node {
  display: flex; align-items: center; gap: 10px; padding: 11px 14px;
  background: #fff; border-radius: 14px; border: 1px solid rgba(20, 18, 15, 0.07);
  box-shadow: 0 8px 24px rgba(20, 18, 15, 0.07); font-size: 12.5px; font-weight: 500;
}
.node small { margin-left: auto; color: var(--muted); font-weight: 400; font-size: 11px; }
.n-ic { flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; background: #edf1f4; color: var(--orange); font-style: normal; font-size: 12px; font-weight: 600; }
.wire { display: block; position: relative; width: 2px; height: 22px; margin-left: 27px; background: rgba(20, 18, 15, 0.12); overflow: hidden; }
.wire::after { content: ""; position: absolute; left: 0; top: -100%; width: 100%; height: 100%; background: var(--orange); }
.in .node { animation: rise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) var(--d) both, glow 5.2s ease-in-out calc(1.8s + var(--g)) infinite; }
.in .wire::after { animation: wire 2.4s linear var(--p) infinite; }

/* reports */
.rep { position: absolute; inset: 0; padding: 8%; display: grid; grid-template-rows: auto 1fr auto; gap: 14px; }
.kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.kpi, .chart { background: #fff; border-radius: 14px; border: 1px solid rgba(20, 18, 15, 0.07); box-shadow: 0 8px 24px rgba(20, 18, 15, 0.06); }
.kpi { display: grid; gap: 1px; padding: 10px 12px; }
.kpi small { color: var(--muted); font-size: 11px; }
.kpi b { font-size: 15px; font-weight: 600; letter-spacing: -0.02em; }
.up { font-size: 11px; font-weight: 500; color: #128a47; }
.chart { position: relative; min-height: 0; padding: 14px; }
.chart svg { display: block; width: 100%; height: 100%; overflow: visible; }
.area { fill: rgba(51, 72, 93, 0.12); }
.ln { fill: none; stroke: var(--orange); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
.end { position: absolute; right: 9px; top: calc(9px + (100% - 28px) * 0.109); width: 10px; height: 10px; border-radius: 50%; background: var(--orange); box-shadow: 0 0 0 0 rgba(51, 72, 93, 0.5); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { padding: 6px 12px; border-radius: 99px; background: #fff; border: 1px solid rgba(20, 18, 15, 0.08); font-size: 11.5px; font-weight: 500; }
.chip.g { background: #e6f9ee; border-color: transparent; color: #128a47; }
.in .kpi { animation: rise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) var(--d) both; }
.in .ln { animation: draw 1.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both; }
.in .area { animation: fade 1s ease 1.4s both; }
.in .chip { animation: pop 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) var(--d) both, bob 3.6s ease-in-out calc(var(--d) + 0.6s) infinite alternate; }
.in .end { animation: ping 2s ease-out 2s infinite; }

/* ---------- feature cards ---------- */
.bottom {
  width: min(1180px, calc(100% - 40px)); margin: 80px auto 0;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px;
}
.feat { display: grid; justify-items: center; align-content: start; gap: 14px; text-align: center; }
.icon { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 12px; color: var(--orange); background: #edf1f4; transition: background 0.3s, color 0.3s; }
.feat:hover .icon { color: #fff; background: var(--orange); }
.feat h3 { margin: 6px 0 0; font-size: 19px; font-weight: 500; letter-spacing: -0.02em; }
.feat p { margin: 0; max-width: 320px; font-size: 15px; line-height: 1.7; color: var(--muted); }

@keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes pop { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes wire { 0% { top: -100%; } 60%, 100% { top: 100%; } }
@keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(51, 72, 93, 0.5); } 100% { box-shadow: 0 0 0 14px rgba(51, 72, 93, 0); } }

/* ---- more live motion (section 2) ---- */
@property --n { syntax: "<integer>"; initial-value: 0; inherits: false; }
.cnt { counter-reset: n var(--n); font-variant-numeric: tabular-nums; }
.cnt::before { content: counter(n); }
.in .cnt { animation: count 1.6s ease 0.4s both; }
.live-b { position: absolute; top: 14px; left: 16px; z-index: 1; display: inline-flex; align-items: center; gap: 7px; padding: 5px 11px; border-radius: 99px; background: #fff; border: 1px solid rgba(20, 18, 15, 0.07); font-size: 11px; font-weight: 500; }
.live-b i { width: 7px; height: 7px; border-radius: 50%; background: #25b865; animation: blink 1.4s ease-in-out infinite; }
.in .n-ic { animation: ic 5.2s ease-in-out calc(1.8s + var(--g)) infinite; }
.ln-pulse { fill: none; stroke: #fff; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 0.1 1; stroke-dashoffset: 0.1; opacity: 0; }
.in .ln-pulse { animation: travel 3.2s linear 2.2s infinite; }
.dots { display: inline-flex; gap: 3px; margin-left: 6px; }
.dots b { width: 4px; height: 4px; border-radius: 50%; background: var(--orange); animation: dot 0.9s ease-in-out infinite; }
.dots b:nth-child(2) { animation-delay: 0.15s; }
.dots b:nth-child(3) { animation-delay: 0.3s; }
.in .feat { animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) calc(0.8s + var(--f)) both; }
.in .feat:nth-child(3) .icon svg { animation: twinkle 2.6s ease-in-out 1.8s infinite; }

@keyframes count { from { --n: 0; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
@keyframes glow { 0%, 24%, 100% { box-shadow: 0 8px 24px rgba(20, 18, 15, 0.07); } 8%, 16% { box-shadow: 0 0 0 3px rgba(51, 72, 93, 0.35), 0 8px 24px rgba(20, 18, 15, 0.07); } }
@keyframes ic { 0%, 24%, 100% { background: #edf1f4; color: #33485d; } 8%, 16% { background: #33485d; color: #fff; } }
@keyframes travel { 0% { stroke-dashoffset: 0.1; opacity: 1; } 90% { opacity: 1; } 100% { stroke-dashoffset: -1; opacity: 0; } }
@keyframes bob { to { transform: translateY(-3px); } }
@keyframes dot { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@keyframes sway-a { from { transform: rotate(-4deg) scale(0.95); } to { transform: rotate(-2.6deg) scale(0.96); } }
@keyframes sway-b { from { transform: rotate(3.5deg) scale(0.95); } to { transform: rotate(2.2deg) scale(0.96); } }
@keyframes twinkle { 0%, 100% { transform: scale(1) rotate(0); } 50% { transform: scale(1.2) rotate(12deg); } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .top { grid-template-columns: 1fr; max-width: 640px; }
}
@media (max-width: 760px) {
  .wsm { padding: 72px 0; }
  .top { width: calc(100% - 40px); margin-top: 48px; gap: 36px; }
  .ill { aspect-ratio: 1 / 1.05; }
  .bottom { grid-template-columns: 1fr; gap: 40px; margin-top: 56px; }
}
@media (prefers-reduced-motion: reduce) {
  .back { transition: none; }
  .in .node, .in .n-ic, .in .kpi, .in .ln, .in .ln-pulse, .in .area, .in .chip, .in .dots b, .in .cnt, .in .end, .in .wire::after, .in .back-a, .in .back-b, .in .feat, .in .icon svg, .live-b i { animation: none; }
}
</style>
