<template>
  <section
    ref="rootEl"
    class="hiw"
    :class="{ 'hiw-js': mounted, 'hiw-in': revealed }"
    aria-labelledby="hiw-title"
  >
    <header class="hiw-head">
      <span class="hiw-eyebrow">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l1.6 4.4L15 10l-4.4 1.6L9 16l-1.6-4.4L3 10l4.4-1.6zM17.5 12l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9zM17 3.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" /></svg>
        <span>How it works</span>
      </span>
      <h2 id="hiw-title" class="hiw-title">Integrates <b>easily</b></h2>
      <p>
        We empower sales, retail, and operations teams to streamline customer pipelines, instant
        quotations, and multi-store workflows visually
      </p>
    </header>

    <div
      class="hiw-wrap"
      @pointerenter="paused = true"
      @pointerleave="paused = false"
      @focusin="paused = true"
      @focusout="paused = false"
    >
      <!-- ============ left: accordion list ============ -->
      <ul class="hiw-list" role="tablist" aria-orientation="vertical" @keydown="onKey">
        <li v-for="(t, i) in tabs" :key="t.title" class="hiw-item" :class="{ on: active === i }">
          <button
            :id="`hiw-tab-${i}`"
            type="button"
            role="tab"
            class="hiw-row"
            :aria-selected="active === i"
            :aria-controls="`hiw-panel-${i}`"
            :tabindex="active === i ? 0 : -1"
            @click="select(i)"
            @pointerenter="onEnter(i, $event)"
            @pointerleave="onLeave"
          >
            <span class="hiw-rt">{{ t.title }}</span>
            <svg class="hiw-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          <div class="hiw-more">
            <p>{{ t.text }}</p>
          </div>
          <span class="hiw-bar" aria-hidden="true">
            <i v-if="active === i" :key="`${active}-${cycle}`" @animationend="next"></i>
          </span>
        </li>
      </ul>

      <!-- ============ right: stage ============ -->
      <div class="hiw-stage">
        <!-- 1 · Leads -->
        <div
          id="hiw-panel-0"
          class="hiw-panel"
          :class="{ on: active === 0 }"
          role="tabpanel"
          aria-labelledby="hiw-tab-0"
          :aria-hidden="active === 0 ? undefined : 'true'"
        >
          <span class="pl-top"><svg viewBox="0 0 24 24" v-html="ic.user"></svg>New lead captured</span>
          <div class="pl-card">
            <h4>Customers <span>248 active this month</span></h4>
            <div v-for="(l, k) in leads.slice(0, 3)" :key="l.n" class="pl-row" :class="{ hot: k === 0, dim: k > 0 }" :style="{ '--k': k }">
              <i class="av" :style="{ background: l.c }">{{ l.i }}</i>
              <span class="m"><b>{{ l.n }}</b><small>{{ l.s }}</small></span>
              <em class="tag" :class="l.k">{{ l.t }}</em>
            </div>
          </div>
          <span class="pl-bot"><i class="dot wa"></i>Receipt sent on WhatsApp</span>
          <span class="nt nt-l"><svg viewBox="0 0 12 14"><path d="M1 1l9 4.5-4 1.4L4.6 11z" /></svg>Amal Perera</span>
          <span class="nt nt-r dark"><svg viewBox="0 0 12 14"><path d="M1 1l9 4.5-4 1.4L4.6 11z" /></svg>VIP reward · 10% off</span>
        </div>

        <!-- 2 · Quotations -->
        <div
          id="hiw-panel-1"
          class="hiw-panel"
          :class="{ on: active === 1 }"
          role="tabpanel"
          aria-labelledby="hiw-tab-1"
          :aria-hidden="active === 1 ? undefined : 'true'"
        >
          <span class="pl-top"><svg viewBox="0 0 24 24" v-html="ic.send"></svg>Quotation sent</span>
          <div class="pl-card">
            <h4>QT-2048 <span>Acme Holdings</span></h4>
            <div class="qt">
              <div><small>Total amount</small><b>$24,850</b></div>
              <em class="tag g big"><i class="dot"></i>Approved</em>
            </div>
            <div class="flow">
              <div v-for="(s, k) in ['Draft', 'Sent', 'Approved']" :key="s" class="step" :style="{ '--k': k }">
                <i><svg viewBox="0 0 24 24" v-html="ic[['edit', 'send', 'check'][k]]"></svg></i>{{ s }}
              </div>
              <u></u><u></u>
            </div>
            <div class="pl-row file">
              <i class="av sq" style="background: #d64545">PDF</i>
              <span class="m"><b>QT-2048.pdf</b><small>Branded · 3 pages</small></span>
              <em class="btn">Convert to invoice</em>
            </div>
          </div>
          <span class="pl-bot"><i class="dot"></i>Converted to invoice in 1 click</span>
          <span class="nt nt-r dark"><svg viewBox="0 0 12 14"><path d="M1 1l9 4.5-4 1.4L4.6 11z" /></svg>Client approved · 2 min</span>
        </div>

        <!-- 3 · Inventory -->
        <div
          id="hiw-panel-2"
          class="hiw-panel"
          :class="{ on: active === 2 }"
          role="tabpanel"
          aria-labelledby="hiw-tab-2"
          :aria-hidden="active === 2 ? undefined : 'true'"
        >
          <span class="pl-top"><svg viewBox="0 0 24 24" v-html="ic.sync"></svg>Synced · 12 branches</span>
          <div class="stack">
            <div v-for="(b, k) in branches.slice(0, 4)" :key="b.n" class="sk" :class="{ low: b.low, tilt: k === 3 }" :style="{ '--k': k }">
              <span class="m"><b>{{ b.n }}</b><small>{{ b.r }}</small></span>
              <span class="stock"><u :style="{ width: b.p + '%' }"></u></span>
              <b class="q">{{ b.q.toLocaleString('en-US') }}</b>
            </div>
          </div>
          <span class="pl-bot"><i class="dot r"></i>Low stock · Transfer 200 from HQ</span>
          <span class="nt nt-l"><svg viewBox="0 0 12 14"><path d="M1 1l9 4.5-4 1.4L4.6 11z" /></svg>Kandy · Manager</span>
        </div>

        <!-- 4 · Calls -->
        <div
          id="hiw-panel-3"
          class="hiw-panel"
          :class="{ on: active === 3 }"
          role="tabpanel"
          aria-labelledby="hiw-tab-3"
          :aria-hidden="active === 3 ? undefined : 'true'"
        >
          <span class="pl-top"><svg viewBox="0 0 24 24" v-html="ic.phone"></svg>Incoming · Amal Perera</span>
          <div class="pl-card">
            <h4>Call log <span>Connected to 3CX</span></h4>
            <div v-for="(c, k) in calls.slice(0, 3)" :key="c.n + c.s" class="pl-row" :class="{ hot: k === 0, dim: k > 1 }" :style="{ '--k': k }">
              <i class="av" :style="{ background: c.c }">{{ c.a }}</i>
              <span class="m"><b>{{ c.n }}</b><small>{{ c.s }}</small></span>
              <em class="tag" :class="c.k">{{ c.t }}</em>
            </div>
          </div>
          <span class="pl-bot"><i class="dot"></i>Matched to VIP · 14 visits</span>
          <span class="nt nt-r dark"><svg viewBox="0 0 12 14"><path d="M1 1l9 4.5-4 1.4L4.6 11z" /></svg>Caller ID matched</span>
        </div>

        <!-- 5 · Analytics -->
        <div
          id="hiw-panel-4"
          class="hiw-panel"
          :class="{ on: active === 4 }"
          role="tabpanel"
          aria-labelledby="hiw-tab-4"
          :aria-hidden="active === 4 ? undefined : 'true'"
        >
          <span class="pl-top"><svg viewBox="0 0 24 24" v-html="ic.chart"></svg>Live pipeline</span>
          <div class="pl-card">
            <h4>Revenue <span>Last 8 weeks</span></h4>
            <div class="kpis">
              <div v-for="k in kpis" :key="k.l" class="kpi"><small>{{ k.l }}</small><b>{{ k.v }}</b><em>{{ k.d }}</em></div>
            </div>
            <svg viewBox="0 0 400 150" class="chart" aria-hidden="true">
              <defs>
                <linearGradient id="hiw-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#ff8a4c" />
                  <stop offset="1" stop-color="#e8501a" />
                </linearGradient>
              </defs>
              <rect v-for="(h, k) in bars" :key="k" class="bar-r" :style="{ '--k': k }" :x="12 + k * 46" :y="140 - h" width="34" :height="h" rx="6" fill="url(#hiw-g)" />
              <path d="M29 80L75 64 121 72 167 46 213 54 259 28 305 36 351 8" fill="none" stroke="#14162b" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 5" />
            </svg>
          </div>
          <span class="pl-bot"><i class="dot"></i>Tax report ready · Export PDF or Excel</span>
          <span class="nt nt-l"><svg viewBox="0 0 12 14"><path d="M1 1l9 4.5-4 1.4L4.6 11z" /></svg>Net margin 31.8%</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * HowItWorks.vue — "How it works · Integrates easily" (Vue 3, <script setup>)
 *
 * • Left: minimal accordion — the active row opens its description and shows an arrow + a thin progress line.
 * • Right: gradient stage with a dotted backdrop; each tab shows a small product mock (top pill → card → bottom pill).
 * • Switch by hover (mouse), click/tap, Tab or ↑ ↓. Auto-plays every ~6s while in view, pausing on hover/focus.
 * • Respects prefers-reduced-motion. Pure HTML/CSS/SVG, no image files, no props.
 * Everything is namespaced `.hiw-` so it can live next to the other sections.
 */
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
const active = ref(0)
const paused = ref(false)
const cycle = ref(0)

const ic = {
  user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.5-3.600 3.300-5.500 7-5.500s6.500 1.900 7 5.500"/>',
  send: '<path d="m4 12 16-8-5.500 16-3-6.500z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  check: '<path d="m5 12.500 4.500 4.500L19 7.500"/>',
  sync: '<path d="M19 11a7 7 0 0 0-12.500-3.800L5 9"/><path d="M5 4.500V9h4.500"/><path d="M5 13a7 7 0 0 0 12.500 3.800L19 15"/><path d="M19 19.500V15h-4.500"/>',
  phone: '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
}

const tabs = [
  { title: 'Capture & Manage Leads', text: 'Organize buyer profiles, track customer frequency, and auto-dispatch instant WhatsApp digital receipts and VIP rewards' },
  { title: 'Instant Smart Quotations', text: 'Build branded PDF quotations in seconds, track client approvals, and convert won deals into invoices in 1 click' },
  { title: 'Multi-Store Inventory Sync', text: 'Manage 1 to 100+ retail branches from a single HQ dashboard with real-time stock sync and role-based staff permissions' },
  { title: 'Automated Customer Calls', text: 'Connect 3CX telephony to automatically log inbound, outbound, and missed calls with instant caller ID matching' },
  { title: 'Revenue Analytics & Audit', text: 'Monitor live sales pipeline velocity, audit net profit margins, and export one-click tax and financial reports' },
]

const leads = [
  { i: 'AP', c: '#e8501a', n: 'Amal Perera', s: '14 visits · last seen today', t: 'VIP', k: '' },
  { i: 'NF', c: '#3f63d8', n: 'Nadia Fernando', s: '6 visits · Rs. 182,400 lifetime', t: 'Returning', k: 'g' },
  { i: 'KS', c: '#1fa971', n: 'Kasun Silva', s: 'New lead · from website', t: 'New', k: 'b' },
]
const branches = [
  { n: 'Colombo Fort', r: 'Manager · full access', p: 86, q: 1240 },
  { n: 'Kandy City Centre', r: 'Staff · view & sell', p: 58, q: 830 },
  { n: 'Galle', r: 'Staff · view & sell', p: 34, q: 412 },
  { n: 'Negombo', r: 'Manager · full access', p: 12, q: 96, low: true },
]
const calls = [
  { a: '↙', c: '#1fa971', n: 'Amal Perera', s: 'Inbound · 4:12', t: 'Answered', k: 'g' },
  { a: '↗', c: '#3f63d8', n: 'Acme Holdings', s: 'Outbound · 1:48', t: 'Completed', k: 'b' },
  { a: '✕', c: '#d64545', n: '+94 77 123 4567', s: 'Missed · 10:42 AM', t: 'Missed', k: 'r' },
]
const bars = [50, 64, 56, 82, 74, 100, 92, 124]
const kpis = [
  { l: 'Net revenue', v: '$184k', d: '▲ 12.4%' },
  { l: 'Profit margin', v: '31.8%', d: '▲ 2.1%' },
  { l: 'Deals won', v: '86', d: '▲ 9' },
]

/* ------------------------------------------------------------------ interaction */
let hoverTimer = 0
let reduce = false
let io

function select(i) {
  if (i === active.value) return
  active.value = i
  cycle.value++
}
function next() {
  if (paused.value) return
  select((active.value + 1) % tabs.length)
}
function onEnter(i, e) {
  if (e.pointerType !== 'mouse' || i === active.value) return
  clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => select(i), 110)
}
function onLeave() {
  clearTimeout(hoverTimer)
}
async function onKey(e) {
  const dir = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0
  if (!dir) return
  e.preventDefault()
  const n = (active.value + dir + tabs.length) % tabs.length
  select(n)
  await nextTick()
  rootEl.value?.querySelectorAll('.hiw-row')[n]?.focus()
}

onMounted(() => {
  mounted.value = true
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) rootEl.value.classList.add('hiw-still')
  io = new IntersectionObserver(
    (es) => {
      const vis = es[0].isIntersecting
      if (vis) revealed.value = true
      rootEl.value.classList.toggle('hiw-off', !vis) // pauses the progress line off-screen
    },
    { threshold: 0.2 },
  )
  io.observe(rootEl.value)
})
onBeforeUnmount(() => {
  io?.disconnect()
  clearTimeout(hoverTimer)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.hiw {
  --o: #ff5722;
  --o1: #e8501a;
  --o2: #ff8a4c;
  --ink: #14162b;
  --mut: #6b6f80;
  --line: #e7e5e4;
  --ok: #1fa971;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  padding: clamp(48px, 7vw, 96px) clamp(16px, 4vw, 40px);
  font-family: Poppins, system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
}
.hiw,
.hiw *,
.hiw *::before,
.hiw *::after {
  box-sizing: border-box;
}
.hiw svg {
  display: block;
}

/* ============ heading ============ */
.hiw-head {
  max-width: 640px;
  margin: 0 auto clamp(32px, 5vw, 64px);
  text-align: center;
}
.hiw-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px 8px 11px;
  border: 1.5px solid transparent;
  border-radius: 999px;
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(90deg, #ff9a3d, #e0407a) border-box;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: transform 0.4s var(--ease), box-shadow 0.4s;
}
.hiw-eyebrow span {
  background: linear-gradient(90deg, #f2540c, #d6336c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hiw-eyebrow svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #f2540c;
  stroke-width: 1.7;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.hiw-eyebrow:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 24px -14px rgba(242, 84, 12, 0.6);
}
.hiw-title {
  margin: 8px 0 16px;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: 3.5vw;
  line-height: 1.15;
  font-weight: 500;
  letter-spacing: -0.025em;
}
.hiw-title b {
  font-weight: 500;

  color: var(--o);
}
.hiw-head p {
  margin: 0;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 34px;
  letter-spacing: -0.72px;
  color: var(--mut);
}
.hiw-js .hiw-head,
.hiw-js .hiw-wrap {
  opacity: 0;
  transform: translateY(22px);
}
.hiw-in .hiw-head,
.hiw-in .hiw-wrap {
  opacity: 1;
  transform: none;
  transition: opacity 0.8s var(--ease), transform 0.9s var(--ease);
}
.hiw-in .hiw-wrap {
  transition-delay: 0.12s;
}

/* ============ layout ============ */
.hiw-wrap {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 435fr) minmax(0, 625fr);
  gap: clamp(28px, 4.8vw, 56px);
  align-items: center;
}

/* ============ list ============ */
.hiw-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}
.hiw-item {
  position: relative;
  border-bottom: 1px solid var(--line);
}
.hiw-row {
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 0;
  cursor: pointer;
  transition: padding 0.5s var(--ease);
}
.hiw-row:focus-visible {
  outline: 2px solid var(--o);
  outline-offset: -2px;
  border-radius: 6px;
}
.hiw-rt {
  font-family: Inter, system-ui, sans-serif;
  font-size: clamp(1vw, 1.8vw, 22px);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: #3b3d52;
  transition: color 0.3s, transform 0.5s var(--ease);
}
.hiw-row:hover .hiw-rt,
.hiw-item.on .hiw-rt {
  color: var(--ink);
}
.hiw-arrow {
  flex: none;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--o);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.3s, transform 0.5s var(--ease);
}
.hiw-item.on .hiw-arrow {
  opacity: 1;
  transform: none;
}
.hiw-more {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.55s var(--ease);
}
.hiw-more p {
  min-height: 0;
  overflow: hidden;
  margin: 0;
  max-width: 400px;
  font-size: 15px;
  line-height: 1.75;
  color: var(--mut);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.25s, transform 0.25s;
}
.hiw-item.on .hiw-more {
  grid-template-rows: 1fr;
}
.hiw-item.on .hiw-more p {
  padding-bottom: 28px;
  opacity: 1;
  transform: none;
  transition: opacity 0.5s var(--ease) 0.15s, transform 0.6s var(--ease) 0.15s;
}
.hiw-item.on .hiw-row {
  padding-bottom: 12px;
}
.hiw-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  overflow: hidden;
  pointer-events: none;
}
.hiw-bar i {
  display: block;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, var(--o1), var(--o2));
  animation: hiw-fill 6s linear forwards;
}
.hiw-wrap:hover .hiw-bar i,
.hiw-wrap:focus-within .hiw-bar i,
.hiw-off .hiw-bar i {
  animation-play-state: paused;
}
@keyframes hiw-fill {
  to {
    width: 100%;
  }
}

/* ============ stage ============ */
.hiw-stage {
  position: relative;
  aspect-ratio: 625 / 471;
  min-height: 400px;
  border-radius: 28px;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(70% 80% at 0% 0%, #ffc9a6 0%, transparent 62%),
    radial-gradient(60% 70% at 100% 100%, #ffe3e0 0%, transparent 65%),
    linear-gradient(135deg, #ffd8bf 0%, #ffe9dc 48%, #fff3ee 100%);
}
.hiw-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.95) 2px, transparent 2.6px);
  background-size: 75px 75px;
  background-position: 30px 30px;
  pointer-events: none;
}
.hiw-panel {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: 24px;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.97);
  transition: opacity 0.45s ease, transform 0.6s var(--ease), visibility 0s 0.45s;
}
.hiw-panel.on {
  opacity: 1;
  visibility: visible;
  transform: none;
  transition: opacity 0.5s ease 0.08s, transform 0.7s var(--ease) 0.08s, visibility 0s;
}

/* pills */
.pl-top,
.pl-bot {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 17px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 500;
  white-space: nowrap;
}
.pl-top {
  background: linear-gradient(135deg, #ff7a3d, var(--o));
  color: #fff;
  box-shadow: 0 12px 22px -10px rgba(255, 87, 34, 0.7);
}
.pl-top svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.pl-bot {
  background: rgba(255, 255, 255, 0.78);
  color: #4b4e60;
  box-shadow: 0 8px 18px -12px rgba(20, 22, 43, 0.35);
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ok);
}
.dot.wa {
  background: #25d366;
}
.dot.r {
  background: #d64545;
}

/* card */
.pl-card {
  width: min(350px, 100%);
  padding: 14px 14px 10px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 1px 0 #fff inset, 0 26px 44px -24px rgba(150, 70, 30, 0.45), 0 3px 8px rgba(150, 70, 30, 0.06);
}
.pl-card h4 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 600;
}
.pl-card h4 span {
  font-size: 11px;
  font-weight: 400;
  color: #8a8ea0;
}
.pl-row {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 10px;
  margin-bottom: 4px;
  border-radius: 11px;
  font-size: 12px;
}
.pl-row.hot {
  background: #fff;
  box-shadow: 0 0 0 1px #f0ece8, 0 10px 18px -10px rgba(20, 22, 43, 0.3);
}
.pl-row.dim {
  opacity: 0.55;
}
.av {
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 11.5px;
  font-weight: 600;
  font-style: normal;
}
.av.sq {
  border-radius: 9px;
  font-size: 10px;
}
.m {
  flex: 1;
  min-width: 0;
}
.m b {
  display: block;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.m small {
  display: block;
  font-size: 10.5px;
  color: #8a8ea0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag {
  flex: none;
  padding: 3px 10px;
  border-radius: 999px;
  background: #fff1ea;
  color: var(--o1);
  font-size: 10px;
  font-weight: 500;
  font-style: normal;
}
.tag.g {
  background: #e6f7ef;
  color: var(--ok);
}
.tag.r {
  background: #fdecec;
  color: #d64545;
}
.tag.b {
  background: #e9efff;
  color: #3f63d8;
}
.tag.big {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  font-size: 12px;
}

/* quotation */
.qt {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 4px 4px 0;
}
.qt small {
  display: block;
  font-size: 10.5px;
  color: #8a8ea0;
}
.qt b {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.flow {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 14px 18px 14px;
}
.flow u {
  position: absolute;
  top: 16px;
  height: 2px;
  width: calc(50% - 38px);
  background: repeating-linear-gradient(90deg, #d9d4cf 0 5px, transparent 5px 9px);
}
.flow u:nth-of-type(1) {
  left: 36px;
}
.flow u:nth-of-type(2) {
  right: 36px;
}
.step {
  position: relative;
  z-index: 1;
  text-align: center;
  font-size: 10px;
  color: var(--mut);
}
.step i {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  margin: 0 auto 5px;
  border-radius: 50%;
  background: var(--o);
}
.step svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: #fff;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.pl-row.file {
  background: #f7f5f2;
  margin-bottom: 4px;
}
.btn {
  flex: none;
  padding: 8px 12px;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--o1), var(--o2));
  color: #fff;
  font-size: 10.5px;
  font-weight: 500;
  font-style: normal;
}

/* inventory stack */
.stack {
  width: min(340px, 100%);
  display: grid;
  gap: 8px;
}
.sk {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 14px 24px -16px rgba(150, 70, 30, 0.5), 0 2px 5px rgba(150, 70, 30, 0.06);
}
.sk.tilt {
  transform: rotate(-2.2deg) translateY(4px);
  box-shadow: 0 18px 28px -14px rgba(150, 70, 30, 0.6), 0 2px 5px rgba(150, 70, 30, 0.08), 0 7px 0 -2px rgba(255, 255, 255, 0.7);
}
.sk .m {
  flex: 1.1;
}
.sk .stock {
  flex: 1;
  height: 7px;
  border-radius: 9px;
  background: #f0ece8;
  overflow: hidden;
}
.sk .stock u {
  display: block;
  height: 100%;
  border-radius: 9px;
  background: linear-gradient(90deg, var(--o1), var(--o2));
}
.sk.low .stock u {
  background: #d64545;
}
.sk .q {
  min-width: 42px;
  text-align: right;
  font-size: 12.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.sk.low .q {
  color: #d64545;
}

/* analytics */
.kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  margin-bottom: 8px;
}
.kpi {
  padding: 9px 10px;
  border-radius: 11px;
  background: #f7f5f2;
}
.kpi small {
  display: block;
  font-size: 9.5px;
  color: #8a8ea0;
}
.kpi b {
  display: block;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.25;
}
.kpi em {
  font-style: normal;
  font-size: 9.5px;
  color: var(--ok);
}
.chart {
  width: 100%;
  height: auto;
  margin-bottom: 2px;
}

/* cursor name tags */
.nt {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px 5px 8px;
  border-radius: 999px;
  background: #fff;
  color: var(--ink);
  font-size: 10.5px;
  font-weight: 500;
  box-shadow: 0 8px 18px -8px rgba(20, 22, 43, 0.4);
  white-space: nowrap;
}
.nt svg {
  width: 11px;
  height: 13px;
  fill: currentColor;
  stroke: #fff;
  stroke-width: 1;
}
.nt.dark {
  background: #1b1630;
  color: #fff;
}
.nt-l {
  left: 5%;
  top: 77%;
}
.nt-r {
  right: 5%;
  top: 21%;
}

/* ============ entrance choreography ============ */
.hiw-panel .pl-top,
.hiw-panel .pl-card,
.hiw-panel .stack,
.hiw-panel .pl-bot,
.hiw-panel .nt {
  opacity: 0;
  transform: translateY(14px);
}
.hiw-panel.on .pl-top,
.hiw-panel.on .pl-card,
.hiw-panel.on .stack,
.hiw-panel.on .pl-bot,
.hiw-panel.on .nt {
  opacity: 1;
  transform: none;
  transition: opacity 0.6s var(--ease), transform 0.8s var(--ease);
}
.hiw-panel.on .pl-top {
  transition-delay: 0.12s;
}
.hiw-panel.on .pl-card,
.hiw-panel.on .stack {
  transition-delay: 0.22s;
}
.hiw-panel.on .pl-bot {
  transition-delay: 0.34s;
}
.hiw-panel.on .nt {
  transition-delay: 0.5s;
  animation: hiw-bob 5s ease-in-out 1.2s infinite;
}
.hiw-panel.on .nt-r {
  animation-delay: 2.4s;
}
.hiw-panel.on .pl-row,
.hiw-panel.on .sk,
.hiw-panel.on .step {
  animation: hiw-in 0.6s var(--ease) both;
  animation-delay: calc(0.4s + var(--k, 0) * 0.12s);
}
.hiw-panel.on .sk.tilt {
  animation-name: hiw-tilt;
}
.hiw-panel.on .stock u,
.hiw-panel.on .bar-r {
  transform-origin: left;
  animation: hiw-grow 0.9s var(--ease) 0.5s both;
}
.hiw-panel.on .bar-r {
  transform-origin: bottom;
  transform-box: fill-box;
  animation: hiw-up 0.8s var(--ease) both;
  animation-delay: calc(0.45s + var(--k) * 0.05s);
}
@keyframes hiw-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
@keyframes hiw-tilt {
  from { opacity: 0; transform: rotate(0) translateY(14px); }
  to { opacity: 1; transform: rotate(-2.2deg) translateY(4px); }
}
@keyframes hiw-grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes hiw-up {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
@keyframes hiw-bob {
  50% { translate: 0 -6px; }
}

/* ============ responsive ============ */
@media (max-width: 900px) {
  .hiw-wrap {
    grid-template-columns: 1fr;
  }
  .hiw-stage {
    order: -1;
    aspect-ratio: auto;
    min-height: 460px;
  }
}
@media (max-width: 520px) {
  .nt {
    display: none;
  }
  .hiw-panel {
    gap: 16px;
    padding: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hiw *,
  .hiw *::before,
  .hiw *::after {
    animation: none !important;
    transition-duration: 0.001s !important;
    transition-delay: 0s !important;
  }
  .hiw-js .hiw-head,
  .hiw-js .hiw-wrap {
    opacity: 1;
    transform: none;
  }
  .hiw-bar i {
    display: none;
  }
}
</style>