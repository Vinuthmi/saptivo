<template>
  <section id="features" ref="root" class="wmc" :class="{ in: seen, live }" aria-labelledby="wmc-title">
    <h2 id="wmc-title" class="title">
      <span>Win more customers</span>
    </h2>

    <div class="grid">
      <!-- left: sliding visuals -->
      <div class="visual">
        <div class="track" :style="{ transform: `translateX(-${active * 100}%)` }">
          <div
            v-for="(t, i) in tabs"
            :key="t.title"
            class="slide"
            :class="{ on: i === active }"
            :style="slideStyle(t, i)"
            :aria-hidden="i !== active"
          >
            <img v-if="t.image" class="shot" :src="t.image" :alt="t.title" />
            <div v-else class="window" aria-hidden="true">
              <div class="bar"><i></i><i></i><i></i></div>
              <div class="mock" v-html="t.mock"></div>
            </div>

            <div class="floats" aria-hidden="true">
              <div v-for="(c, ci) in t.cards" :key="c.k" class="float" :class="'f' + (ci + 1)" :style="{ '--n': ci }">
                <span class="k">{{ c.k }}</span>
                <span class="v">{{ c.v }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- right: feature tabs -->
      <ul class="tabs" @mouseenter="paused = true" @mouseleave="paused = false" @focusin="paused = true" @focusout="paused = false">
        <li v-for="(t, i) in tabs" :key="t.title">
          <button
            type="button"
            class="tab"
            :class="{ on: i === active }"
            :aria-expanded="i === active"
            :aria-controls="'wmc-d' + i"
            @click="active = i"
          >
            <span class="head">
              <span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path v-for="(d, k) in t.icon" :key="k" :d="d" />
                </svg>
              </span>
              <span class="name">{{ t.title }}</span>
              <span class="num" aria-hidden="true">0{{ i + 1 }}</span>
            </span>
            <span :id="'wmc-d' + i" class="desc"><span><span class="desc-text">{{ t.text }}</span></span></span>
            <span class="line" aria-hidden="true">
              <span class="fill" :style="{ animationPlayState: running ? 'running' : 'paused' }" @animationend="next"></span>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "WinMoreCustomers" });

// Background photo behind every slide (set to "" for flat colour).
// Override per tab with `bg`, or replace the mockup with a screenshot using `image`.
const bgImage = "/images/features/win-bg.jpg";

const tabs = [
  {
    title: "Lead and contact management",
    text: "Capture leads from your website, Facebook and WhatsApp, score them and route them automatically.",
    icon: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M22 21v-2a4 4 0 0 0-3-3.9", "M16 3.1a4 4 0 0 1 0 7.8"],
    bg: "/saptivo/images/features/smiling.jpg",
    mock: `<div class="m-top rv" style="--i:0"><b>Leads</b><span class="pill live">+12 today</span></div>
<div class="m-row hot rv" style="--i:1"><i class="av" style="background:#ffd9c9"></i><div class="m-lines"><b>Nimal Perera</b><small>Asked for a CRM demo</small></div><span class="src wa">WhatsApp</span><span class="sc">86</span></div>
<div class="m-row rv" style="--i:2"><i class="av" style="background:#d9e6ff"></i><div class="m-lines"><b>Ayesha Fernando</b><small>Clicked a Facebook ad</small></div><span class="src fb">Facebook</span><span class="sc">72</span></div>
<div class="m-row rv" style="--i:3"><i class="av" style="background:#ffe9b8"></i><div class="m-lines"><b>Kasun Silva</b><small>Filled the website form</small></div><span class="src web">Website</span><span class="sc">64</span></div>
<div class="m-row rv" style="--i:4"><i class="av" style="background:#d4f2e0"></i><div class="m-lines"><b>Dilini Jayasinghe</b><small>Asked about pricing</small></div><span class="src wa">WhatsApp</span><span class="sc">58</span></div>`,
    cards: [{ k: "New lead", v: "Nimal P. · WhatsApp" }, { k: "Lead score", v: "86 · Hot" }, { k: "Routed to", v: "Sales team, Colombo" }],
  },
  {
    title: "Sales pipeline and deals",
    text: "Drag-and-drop pipelines, follow-up reminders and weighted forecasting.",
    icon: ["M3 17l6-6 4 4 8-8", "M14 7h7v7"],
    bg: "/saptivo/images/features/young.jpg",
    mock: `<div class="m-top rv" style="--i:0"><b>Sales pipeline</b><span class="pill live">Rs. 4.2M open</span></div>
<div class="m-cols">
<div class="m-col rv" style="--i:1"><h5>New</h5><div class="m-card"><b>ABC Traders</b><small>Rs. 450K</small></div><div class="m-card"><b>Lanka Foods</b><small>Rs. 220K</small></div></div>
<div class="m-col rv" style="--i:2"><h5>Proposal</h5><div class="m-card drag"><b>Ceylon Motors</b><small>Rs. 1.8M</small></div><div class="m-card"><b>Blue Wave</b><small>Rs. 640K</small></div></div>
<div class="m-col won rv" style="--i:3"><h5>Won</h5><div class="m-card"><b>Green Leaf</b><small>Rs. 385K</small></div><div class="m-card"><b>City Dental</b><small>Rs. 120K</small></div></div>
</div>`,
    cards: [{ k: "Deal stage", v: "Proposal sent" }, { k: "Follow-up", v: "Tomorrow, 10:00 AM" }, { k: "Weighted forecast", v: "Rs. 1.8M" }],
  },
  {
    title: "Quotations and invoicing",
    text: "Branded PDF quotes in seconds and one-click conversion to tax invoices.",
    icon: ["M6 3h9l4 4v14H6z", "M14 3v5h5", "M9 13h6", "M9 17h6"],
    bg: "/saptivo/images/features/employees.jpg",
    mock: `<div class="m-top rv" style="--i:0"><b>Quotation QT-0142</b><span class="pill">Accepted</span></div>
<div class="m-line rv" style="--i:1"><span>CRM licence · 10 users</span><b>Rs. 300,000</b></div>
<div class="m-line rv" style="--i:2"><span>WhatsApp integration</span><b>Rs. 60,000</b></div>
<div class="m-line rv" style="--i:3"><span>Onboarding and training</span><b>Rs. 25,000</b></div>
<div class="m-total rv" style="--i:4"><span>Total</span><span>Rs. 385,000</span></div>
<span class="m-btn rv" style="--i:5">Convert to tax invoice</span>`,
    cards: [{ k: "Quotation", v: "QT-0142 · PDF ready" }, { k: "Status", v: "Accepted" }, { k: "Tax invoice", v: "INV-0087 created" }],
  },
  {
    title: "Marketing campaigns",
    text: "Segmented email and WhatsApp campaigns, drip sequences and campaign analytics.",
    icon: ["M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z", "M16 8a5 5 0 0 1 0 8", "M19 5a9 9 0 0 1 0 14"],
    bg: "/saptivo/images/features/threecolleagues-.jpg",
    mock: `<div class="m-top rv" style="--i:0"><b>Festive offer</b><span class="pill live">Sending</span></div>
<div class="m-camp">
<div class="m-bubble rv" style="--i:1">Hi! Enjoy 15% off all plans this week. Reply YES to claim your offer.</div>
<div class="m-stats">
<div class="m-stat rv" style="--i:2"><span>Sent</span><b>1,240</b><i style="--w:100%"></i></div>
<div class="m-stat rv" style="--i:3"><span>Opened</span><b>64%</b><i style="--w:64%"></i></div>
<div class="m-stat rv" style="--i:4"><span>Replied</span><b>18%</b><i style="--w:18%"></i></div>
</div></div>`,
    cards: [{ k: "Campaign", v: "Festive offer · WhatsApp" }, { k: "Segment", v: "Active customers · 1,240" }, { k: "Open rate", v: "64%" }],
  },
];

const tints = ["#ffd9c2", "#ffe0c9", "#ffd3bd", "#fbdcc8"];
const slideStyle = (t, i) => {
  const bg = t.bg ?? bgImage;
  return {
    backgroundColor: tints[i % tints.length],
    ...(bg ? { backgroundImage: `url("${bg}")` } : {}),
  };
};

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const active = ref(0);
const paused = ref(false);
const running = computed(() => live.value && !paused.value);
const next = () => { active.value = (active.value + 1) % tabs.length; };

const st = { io: null, fallback: null };
onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true;
    live.value = !reduce; // no observer: keep autoplay on; reduced motion: no autoplay
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) { seen.value = true; live.value = true; }
      else live.value = false;
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
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.wmc {
  --orange: #ff6338;
  --orange-soft: #fff1ec;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #f1e7e2;
  --dur: 6s;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.wmc *, .wmc *::before, .wmc *::after { box-sizing: border-box; }
.wmc button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15;
  letter-spacing: -0.03em; color: var(--ink);
}
.title span { display: block; }
.title .soft { color: var(--muted); }

.grid {
  width: min(1180px, calc(100% - 40px)); margin: 64px auto 0;
  display: grid; grid-template-columns: 1.15fr 1fr; gap: 72px; align-items: center;
}

/* ---------- visual: sliding panels ---------- */
.visual { position: relative; aspect-ratio: 4 / 3.4; overflow: hidden; border-radius: 28px; min-width: 0; background: #ffd9c2; }
.track { display: flex; height: 100%; transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1); will-change: transform; }
.slide { position: relative; flex: none; width: 100%; height: 100%; background-size: cover; background-position: center; }

.window {
  position: absolute; right: 6%; top: 10%; width: 66%; height: 72%;
  padding: 14px; background: #fff; border-radius: 18px;
  box-shadow: 0 18px 40px rgba(120, 50, 20, 0.2);
  display: flex; flex-direction: column; gap: 12px; overflow: hidden;
}
.bar { display: flex; gap: 6px; flex: none; }
.bar i { width: 8px; height: 8px; border-radius: 50%; background: rgba(20, 18, 15, 0.14); }
.mock { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 8px; font-size: 11px; line-height: 1.35; text-align: left; }
.mock :deep(.m-top) { display: flex; justify-content: space-between; align-items: center; }
.mock :deep(.m-top b) { font-size: 13px; font-weight: 600; }
.mock :deep(.pill) { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 99px; background: var(--orange-soft); color: #f2531f; font-weight: 600; font-size: 11px; }
.mock :deep(.pill.live::before) { content: ""; width: 6px; height: 6px; margin-right: 6px; border-radius: 50%; background: currentColor; animation: blink 1.4s ease-in-out infinite; }
.mock :deep(.m-row) { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 10px; background: #faf8f6; }
.mock :deep(.m-row.hot) { animation: flash 2.8s ease-in-out 1.6s infinite; }
.mock :deep(.av) { flex: none; width: 26px; height: 26px; border-radius: 50%; }
.mock :deep(.m-lines) { flex: 1; min-width: 0; display: grid; }
.mock :deep(.m-lines b) { font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mock :deep(.m-lines small) { color: #5d6068; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mock :deep(.src) { padding: 2px 7px; border-radius: 99px; font-size: 10.5px; font-weight: 600; }
.mock :deep(.wa) { background: #e6f9ee; color: #128a47; }
.mock :deep(.fb) { background: #e7f0ff; color: #0b57d0; }
.mock :deep(.web) { background: #fff0e8; color: #c4400f; }
.mock :deep(.sc) { width: 26px; text-align: center; font-weight: 700; color: #f2531f; }
.mock :deep(.m-cols) { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.mock :deep(.m-col) { background: #faf8f6; border-radius: 10px; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
.mock :deep(.m-col h5) { margin: 0; font-size: 11px; color: #5d6068; font-weight: 600; }
.mock :deep(.m-card) { background: #fff; border-radius: 8px; padding: 7px; box-shadow: 0 1px 4px rgba(23, 25, 29, 0.08); display: grid; gap: 2px; }
.mock :deep(.m-card.drag) { position: relative; z-index: 2; animation: drag 3.2s ease-in-out 1.4s infinite; }
.mock :deep(.m-card b) { font-size: 11.5px; font-weight: 500; }
.mock :deep(.m-card small) { color: #f2531f; font-weight: 600; }
.mock :deep(.won .m-card) { border-left: 3px solid #25b865; }
.mock :deep(.m-line) { display: flex; justify-content: space-between; gap: 8px; padding: 7px 0; border-bottom: 1px solid rgba(23, 25, 29, 0.08); }
.mock :deep(.m-total) { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; margin-top: auto; }
.mock :deep(.m-btn) { align-self: flex-start; padding: 8px 13px; border-radius: 99px; color: #fff; font-weight: 600; background: var(--orange); animation: ring 2.2s ease-out 2s infinite; }
.mock :deep(.m-camp) { flex: 1; min-height: 0; display: grid; grid-template-columns: 1.1fr 1fr; gap: 10px; }
.mock :deep(.m-bubble) { align-self: start; background: #e6f9ee; border-radius: 12px 12px 12px 3px; padding: 10px; color: #17391f; }
.mock :deep(.m-stats) { display: grid; gap: 8px; align-content: start; }
.mock :deep(.m-stat) { background: #faf8f6; border-radius: 10px; padding: 8px; display: grid; gap: 4px; }
.mock :deep(.m-stat b) { font-size: 14px; font-weight: 600; }
.mock :deep(.m-stat i) { display: block; height: 4px; border-radius: 2px; background: rgba(136, 136, 136, 0.2); position: relative; overflow: hidden; }
.mock :deep(.m-stat i::after) { content: ""; position: absolute; inset: 0 auto 0 0; width: 0; background: var(--orange); border-radius: 2px; transition: width 0s linear 0.75s; }
.shot { position: absolute; right: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: right top; }

/* floating info cards */
.floats { position: absolute; inset: 0; pointer-events: none; }
.float {
  position: absolute; display: grid; gap: 1px; padding: 10px 14px; min-width: 160px;
  background: #fff; border-radius: 16px; box-shadow: 0 12px 28px rgba(120, 50, 20, 0.18);
}
.f1 { left: 5%; top: 12%; }
.f2 { left: 36%; top: 47%; }
.f3 { left: 6%; bottom: 9%; }
.k { font-size: 11px; color: var(--muted); }
.v { font-size: 13px; font-weight: 500; letter-spacing: -0.01em; }

/* ---------- live animation: plays each time a slide becomes active ---------- */
/* hidden state resets only after the slide has slid out of view (0.75s) */
.window, .float, .mock :deep(.rv) {
  opacity: 0; transform: translateY(14px);
  transition: opacity 0s linear 0.75s, transform 0s linear 0.75s;
}
.window, .float { transform: translateY(14px) scale(0.97); }
.wmc.in .slide.on .window {
  opacity: 1; transform: none;
  transition: opacity 0.6s ease 0.15s, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s;
}
.wmc.in .slide.on .float {
  opacity: 1; transform: none;
  transition: opacity 0.5s ease calc(0.7s + var(--n) * 0.2s), transform 0.7s cubic-bezier(0.3, 1.4, 0.5, 1) calc(0.7s + var(--n) * 0.2s);
  animation: bob 5s ease-in-out calc(1.6s + var(--n) * 0.3s) infinite;
}
.wmc.in .slide.on .mock :deep(.rv) {
  opacity: 1; transform: none;
  transition: opacity 0.5s ease calc(var(--i) * 0.12s + 0.3s), transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) calc(var(--i) * 0.12s + 0.3s);
}
.wmc.in .slide.on .mock :deep(.m-stat i::after) { width: var(--w); transition: width 1.1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.9s; }

/* ---------- tabs ---------- */
.tabs { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; min-width: 0; }
.tab {
  position: relative; display: block; width: 100%; overflow: hidden;
  padding: 20px 22px 24px; text-align: left; font: inherit; color: inherit;
  background: #fff; border: 1px solid var(--line); border-radius: 20px; cursor: pointer;
  transition: border-color 0.3s, background 0.3s, box-shadow 0.4s;
}
.tab:hover { border-color: rgba(255, 99, 56, 0.25); }
.tab.on { border-color: rgba(255, 99, 56, 0.35); background: #fff8f5; box-shadow: 0 16px 36px rgba(255, 99, 56, 0.1); }
.head { display: flex; align-items: center; gap: 14px; }
.icon {
  flex: none; display: grid; place-items: center; width: 42px; height: 42px;
  border-radius: 50%; color: #9a948d; background: #f4efec;
  transition: background 0.3s, color 0.3s, transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1);
}
.tab.on .icon { color: #fff; background: var(--orange); transform: scale(1.08); }
.name { flex: 1; min-width: 0; font-size: 17px; font-weight: 500; letter-spacing: -0.015em; line-height: 1.35; color: #8a857f; transition: color 0.3s; }
.tab:hover .name, .tab.on .name { color: var(--ink); }
.num { flex: none; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: #c9c2bc; transition: color 0.3s; }
.tab.on .num { color: var(--orange); }

.desc { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s cubic-bezier(0.2, 0.7, 0.2, 1); }
.desc > span { overflow: hidden; }
.desc-text { display: block; padding: 12px 0 0 56px; font-size: 14.5px; line-height: 1.7; color: var(--muted); }
.tab.on .desc { grid-template-rows: 1fr; }

.line { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(255, 99, 56, 0.12); overflow: hidden; opacity: 0; transition: opacity 0.3s; }
.tab.on .line { opacity: 1; }
.fill { position: absolute; inset: 0; width: 0; background: var(--orange); border-radius: 0 3px 3px 0; }
.tab.on .fill { animation: fill var(--dur) linear forwards; }

/* ---------- entrance (runs once) + pause loops when off screen ---------- */
.wmc:not(.in) .visual, .wmc:not(.in) .tabs { opacity: 0; }
.wmc.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.wmc.in .title .soft { animation-delay: 0.1s; }
.wmc.in .visual { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.wmc.in .tabs { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
.wmc:not(.live) .float,
.wmc:not(.live) .mock :deep(.m-row.hot),
.wmc:not(.live) .mock :deep(.m-card.drag),
.wmc:not(.live) .mock :deep(.m-btn),
.wmc:not(.live) .mock :deep(.pill.live::before) { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes fill { from { width: 0; } to { width: 100%; } }
@keyframes bob { 0%, 100% { translate: 0 0; } 50% { translate: 0 -7px; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes flash { 0%, 100% { background: #faf8f6; } 45% { background: #fff1ec; } }
@keyframes drag {
  0%, 18%, 100% { translate: 0 0; rotate: 0deg; box-shadow: 0 1px 4px rgba(23, 25, 29, 0.08); }
  50%, 68% { translate: 14px -6px; rotate: 2.5deg; box-shadow: 0 12px 22px rgba(255, 99, 56, 0.32); }
}
@keyframes ring { 0% { box-shadow: 0 0 0 0 rgba(255, 99, 56, 0.5); } 70%, 100% { box-shadow: 0 0 0 10px rgba(255, 99, 56, 0); } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .grid { grid-template-columns: minmax(0, 1fr); gap: 40px; }
}
@media (max-width: 760px) {
  .wmc { padding: 72px 0; }
  .grid { width: calc(100% - 32px); margin-top: 40px; }
  .visual { border-radius: 22px; }
  .window { width: 74%; }
  .float { min-width: 0; padding: 8px 12px; }
  .tab { padding: 16px 16px 20px; border-radius: 18px; }
  .name { font-size: 15.5px; }
  .desc-text { padding-left: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .wmc *, .wmc *::before, .wmc *::after { animation: none !important; transition: none !important; }
  .window, .float, .mock :deep(.rv) { opacity: 1; transform: none; }
  .mock :deep(.m-stat i::after) { width: var(--w); }
  .tab.on .fill { width: 100%; }
  .wmc:not(.in) .visual, .wmc:not(.in) .tabs { opacity: 1; }
}
</style>
