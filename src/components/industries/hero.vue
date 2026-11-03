<template>
  <section id="top" ref="hero" class="hero" aria-labelledby="hero-title">
    <div class="bg" aria-hidden="true"></div>

    <div class="top">
      <div class="content">
        <h1 id="hero-title">
          Tailor-made CRM workflows
          <span class="accent">for high-volume businesses</span>
        </h1>

        <p class="lead">
          Whether you operate a multi-branch supermarket chain, a bulk distribution hub or a fleet of service
          technicians, Saptivo adapts to your daily velocity. Generic CRMs make you bend your process to fit the
          software. Saptivo's industry-specific CRM workflows start from how your business already runs.
        </p>

        <div class="actions">
          <a :href="trialHref" class="btn btn-primary">Start free for 14 days</a>
          <a :href="demoHref" class="btn btn-outline">Book a demo</a>
        </div>
        <p class="support">No setup fee · No upgrade fees · No credit card required</p>
      </div>
    </div>

    <div ref="stage" class="stage">
      <!-- orbit lives BELOW the text, behind the dashboard card -->
      <div class="orbit" aria-hidden="true">
        <div class="ring ring-c" :style="{ '--rot': rotC + 'deg' }">
          <i v-for="(d, i) in dotsC" :key="'c' + i" class="dot" :style="{ '--a': d.a + 'deg', '--s': d.s + 'px' }"></i>
        </div>

        <div class="ring ring-b" :style="{ '--rot': rotB + 'deg' }">
          <i v-for="(d, i) in dotsB" :key="'b' + i" class="dot" :style="{ '--a': d.a + 'deg', '--s': d.s + 'px' }"></i>
        </div>

        <div class="ring ring-a" :style="{ '--rot': rot + 'deg' }">
          <span
            v-for="(s, i) in ringIcons"
            :key="s.name + i"
            class="node"
            :style="{ '--a': i * (360 / ringIcons.length) + 'deg' }"
          >
            <svg viewBox="0 0 24 24" :style="{ stroke: s.c }" v-html="s.p"></svg>
          </span>
        </div>
      </div>

      <!-- workflow card: scrolls up with the page, eases from full size to ~83% and fades out at the bottom -->
      <div
        ref="card"
        class="hero-card"
        :style="{ '--p': progress, '--pull': pull + 'px' }"
        @pointerenter="hover = true"
        @pointerleave="hover = false"
        @focusin="hover = true"
        @focusout="hover = false"
      >
        <img v-if="heroImage" class="hero-image" :src="heroImage" alt="Saptivo industry workflows" />

        <div v-else class="app" role="group" aria-label="Example industry workflows">
          <header class="app-bar">
            <span class="app-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <b>Saptivo · Industry workflows</b>
            <span class="app-live"><i></i>Live</span>
          </header>

          <div class="app-tabs" role="tablist" aria-label="Choose an industry">
            <button
              v-for="(t, i) in industries"
              :key="t.id"
              type="button"
              class="app-tab"
              :class="{ on: tab === i }"
              role="tab"
              :aria-selected="tab === i"
              @click="pick(i)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" v-html="t.p"></svg>
              <span>{{ t.name }}</span>
              <i v-if="tab === i" class="app-fill" aria-hidden="true"><b :style="{ width: progressTab * 100 + '%' }"></b></i>
            </button>
          </div>

          <div :key="tab" class="app-body">
            <div class="app-top">
              <div class="kpis">
                <div v-for="k in cur.kpis" :key="k[0]" class="kpi">
                  <small>{{ k[0] }}</small>
                  <b>{{ k[1] }}</b>
                </div>
              </div>
              <span class="ribbon"><i></i>Starts from how your business already runs</span>
            </div>

            <div class="board">
              <div v-for="(s, si) in cur.stages" :key="s.n" class="col" :style="{ '--c': si }">
                <div class="col-h">
                  <span class="col-n">{{ si + 1 }}</span>
                  <b>{{ s.n }}</b>
                  <em>{{ s.cards.length }}</em>
                </div>
                <div v-for="c in s.cards" :key="c.t" class="tcard">
                  <b>{{ c.t }}</b>
                  <small>{{ c.s }}</small>
                  <span class="tag" :class="c.k">{{ c.tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * IndustriesHero.vue — hero for the Industries page (Vue 3, <script setup>)
 *
 * The top (gradient background, centred H1 with the orange accent line, lead, buttons, support line) matches the
 * home hero. Below it, the orbit rings carry industry icons and the dashboard card is a workflow board that
 * switches between three example industries.
 * • Scroll motion is the same as the home hero: rings rotate with the page, the card eases down to ~83% and fades out.
 * • The board auto-advances every ~5.5s (pauses on hover/focus and when off-screen). Respects prefers-reduced-motion.
 * • To use a real screenshot instead of the board, pass `heroImage`.
 *
 * Board figures are sample data. Props: heroImage, trialHref, demoHref. SSR / Nuxt safe (browser APIs only in onMounted).
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'IndustriesHero' })

defineProps({
  heroImage: { type: String, default: '' },
  trialHref: { type: String, default: 'mailto:hello@saptivo.com?subject=Start%20my%2014-day%20free%20trial' },
  demoHref: { type: String, default: 'mailto:hello@saptivo.com?subject=Book%20a%20Saptivo%20demo' },
})

const hero = ref(null)
const stage = ref(null)
const card = ref(null)
const pull = ref(0)
const rot = ref(0)
const progress = ref(0)
const rotB = computed(() => -rot.value * 0.7)
const rotC = computed(() => rot.value * 0.45)

/* ------------------------------------------------------------------ industries (stroke icons, 24px grid) */
const P = {
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M3 4h2.5l2.2 11h10.6l2-8H6.4"/>',
  truck: '<path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  wrench: '<path d="M14.5 6a4 4 0 0 0 4.9 5L9.5 20.9a2 2 0 0 1-2.8-2.8L16.6 8.2A4 4 0 0 0 14.5 6z"/>',
  store: '<path d="M4 9l1.2-4.5h13.6L20 9"/><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9"/><path d="M5.5 11.5V20h13v-8.5M10 20v-4.5h4V20"/>',
  pharmacy: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>',
  car: '<path d="M5 16v-4l2-5h10l2 5v4"/><path d="M3.5 16h17M5.5 12h13"/><circle cx="7.5" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/>',
  hotel: '<path d="M3.5 18V7M3.5 14h17v4M20.5 14v-2.5a2.5 2.5 0 0 0-2.5-2.5H11v5"/><circle cx="7" cy="11" r="1.6"/>',
  hat: '<path d="M4 16a8 8 0 0 1 16 0z"/><path d="M12 8V5M9 16V9.5M15 16V9.5M3 19h18"/>',
}
const ringBase = [
  { name: 'Supermarkets', p: P.cart, c: '#f2540c' },
  { name: 'Distribution', p: P.truck, c: '#0f172a' },
  { name: 'Field service', p: P.wrench, c: '#6366f1' },
  { name: 'Retail', p: P.store, c: '#e11d74' },
  { name: 'Pharmacy', p: P.pharmacy, c: '#0ea5a4' },
  { name: 'Automotive', p: P.car, c: '#f2540c' },
  { name: 'Hospitality', p: P.hotel, c: '#0f172a' },
  { name: 'Construction', p: P.hat, c: '#d97706' },
]
const ringIcons = [...ringBase, ...ringBase]

// hollow circles riding the inner rings (a = angle, s = size in px)
const dotsB = [
  { a: 18, s: 14 }, { a: 88, s: 28 }, { a: 158, s: 12 },
  { a: 228, s: 22 }, { a: 300, s: 16 },
]
const dotsC = [
  { a: 52, s: 20 }, { a: 140, s: 10 }, { a: 214, s: 30 }, { a: 322, s: 14 },
]

/* ------------------------------------------------------------------ workflow board (sample data)
   tag keys: o = new · r = alert · b = in motion · g = done · i = queued */
const industries = [
  {
    id: 'super',
    name: 'Multi-branch supermarket',
    p: P.cart,
    kpis: [['Branches online', '12'], ['Orders today', '1,284'], ['Low-stock alerts', '7']],
    stages: [
      { n: 'Branch order', cards: [{ t: 'Fresh produce · Kandy', s: '142 lines', tag: 'New', k: 'o' }, { t: 'Dairy · Colombo 03', s: '88 lines', tag: 'New', k: 'o' }] },
      { n: 'Stock check', cards: [{ t: 'Rice 5 kg · Galle', s: 'Below reorder point', tag: 'Alert', k: 'r' }, { t: 'Cooking oil · Jaffna', s: 'Transfer proposed', tag: 'Queued', k: 'i' }] },
      { n: 'Dispatch', cards: [{ t: 'Route K-04', s: '3 branches · 1 driver', tag: 'On route', k: 'b' }] },
      { n: 'Received', cards: [{ t: 'Negombo branch', s: 'Signed by manager', tag: 'Done', k: 'g' }, { t: 'Galle branch', s: 'Signed by manager', tag: 'Done', k: 'g' }] },
    ],
  },
  {
    id: 'dist',
    name: 'Bulk distribution hub',
    p: P.truck,
    kpis: [['Open orders', '86'], ['Dispatched today', '54'], ['Overdue invoices', '3']],
    stages: [
      { n: 'Quote', cards: [{ t: 'Lanka Mart (Pvt) Ltd', s: '24 pallets · 5-day terms', tag: 'Sent', k: 'b' }] },
      { n: 'Order', cards: [{ t: 'ORD-2041 · Kandy Foods', s: 'Confirmed by phone', tag: 'New', k: 'o' }, { t: 'ORD-2042 · Harbor Stores', s: 'Awaiting stock', tag: 'Queued', k: 'i' }] },
      { n: 'Pick & dispatch', cards: [{ t: 'Truck T-07', s: '9 drops · 42 cartons', tag: 'On route', k: 'b' }, { t: 'Dock 3', s: 'Loading now', tag: 'Live', k: 'o' }] },
      { n: 'Invoice & collect', cards: [{ t: 'INV-001748', s: 'Bank transfer received', tag: 'Paid', k: 'g' }, { t: 'INV-001752', s: '3 days overdue', tag: 'Overdue', k: 'r' }] },
    ],
  },
  {
    id: 'service',
    name: 'Field service fleet',
    p: P.wrench,
    kpis: [['Technicians out', '18'], ['Visits today', '64'], ['Open tickets', '22']],
    stages: [
      { n: 'Ticket', cards: [{ t: 'Cold room fault · Kandy', s: 'Priority 1 · 09:12', tag: 'Urgent', k: 'r' }, { t: 'POS offline · Galle', s: 'Priority 2 · 09:40', tag: 'New', k: 'o' }] },
      { n: 'Assigned', cards: [{ t: 'Tech Dilan J.', s: 'Van 03 · 14 min away', tag: 'Assigned', k: 'b' }] },
      { n: 'On site', cards: [{ t: 'Visit 10:00 · Negombo', s: 'Checklist 4 of 6', tag: 'Live', k: 'o' }, { t: 'Visit 10:30 · Colombo', s: 'Parts in van', tag: 'Queued', k: 'i' }] },
      { n: 'Quote & invoice', cards: [{ t: 'QT-2026-000001', s: 'Approved on site', tag: 'Done', k: 'g' }] },
    ],
  },
]

const tab = ref(0)
const cur = computed(() => industries[tab.value])
const hover = ref(false)
const inView = ref(false)
const progressTab = ref(0)
const TAB_MS = 5500
const TICK = 80

function pick(i) {
  tab.value = i
  progressTab.value = 0
}

/* ------------------------------------------------------------------ scroll motion (same as the home hero) */
let ticking = false
let raf = null
let ap = null
let io = null
function update() {
  rot.value = window.scrollY * 0.12
  const el = card.value
  if (el) {
    // progress 0 → 1 while the card's top travels from 88% down the viewport to 8%
    const vh = window.innerHeight
    const top = el.getBoundingClientRect().top
    const p = (vh * 0.88 - top) / (vh * 0.8)
    progress.value = Math.min(Math.max(p, 0), 1)
    // the card scales from its top edge, so pull the content below it up by the space it frees
    pull.value = -Math.round(el.offsetHeight * 0.17 * progress.value)
  }
  ticking = false
}
function onScroll() {
  if (ticking) return
  ticking = true
  raf = requestAnimationFrame(update)
}

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    progressTab.value = 1
    return
  }
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  io = new IntersectionObserver((es) => (inView.value = es[0].isIntersecting), { threshold: 0.2 })
  io.observe(card.value)
  ap = setInterval(() => {
    if (hover.value || !inView.value || document.hidden) return
    progressTab.value = Math.min(1, progressTab.value + TICK / TAB_MS)
    if (progressTab.value >= 1) pick((tab.value + 1) % industries.length)
  }, TICK)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf !== null) cancelAnimationFrame(raf)
  clearInterval(ap)
  io?.disconnect()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.hero {
  --orange: #ff6338;
  --orange-deep: #f04b23;
  --ink: #17191d;
  --paper: #fff;
  --muted: #5d6068;
  --title: clamp(46px, 4.2vw, 104px);

  --ring: min(1560px, 175vw); /* outer orbit diameter */
  --step: 95px; /* gap between concentric rings */
  --crest: 54px; /* where the outer ring peaks inside the orbit strip */
  --top0: clamp(110px, 12vw, 160px); /* workflow card top offset (orbit strip height) */
  --w0: min(1180px, calc(100vw - 40px));

  position: relative;
  isolation: isolate;
  overflow: clip;
  padding-bottom: 56px;
  text-align: center;
  color: var(--ink);
  background: var(--paper);
  font-family: 'Inter', system-ui, sans-serif;
}
.hero *,
.hero *::before,
.hero *::after {
  box-sizing: border-box;
}
.hero a:focus-visible,
.hero button:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 4px;
}

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, #000 calc(100% - 80px), transparent 100%);
  mask-image: linear-gradient(180deg, #000 calc(100% - 80px), transparent 100%);
  background:
    radial-gradient(ellipse 52% 48% at 50% 38%, #fff 0%, rgba(255, 255, 255, 0.88) 44%, rgba(255, 255, 255, 0.5) 68%, transparent 100%),
    linear-gradient(180deg, transparent 0%, #fff clamp(240px, 32vh, 360px)),
    linear-gradient(90deg, #ffb29a 0%, #ff9a7c 25%, #ff967b 50%, #ff9a7c 75%, #ffb29a 100%);
}
.bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent 0px,
    transparent 34px,
    rgba(255, 255, 255, 0.025) 38px,
    rgba(255, 255, 255, 0.055) 41px,
    rgba(255, 255, 255, 0.08) 43px,
    rgba(255, 255, 255, 0.035) 46px,
    transparent 51px,
    transparent 82px
  );
  -webkit-mask-image: linear-gradient(90deg, #000 0%, transparent 30%, transparent 70%, #000 100%);
  mask-image: linear-gradient(90deg, #000 0%, transparent 30%, transparent 70%, #000 100%);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}

.top {
  position: relative;
  z-index: 1;
}

/* ---------- content ---------- */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(1040px, calc(100% - 40px));
  margin: 0 auto;
  padding: 112px 0 28px;
}
h1 {
  margin: 0;
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.06em;
  color: #0f172a;
  font-size: var(--title);
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.accent {
  display: block;
  width: fit-content;
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.lead {
  max-width: 760px;
  margin: 24px 0 0;
  font-size: 16px;
  line-height: 1.7;
  color: #4a4d55;
  animation: rise 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 36px;
  animation: rise 0.9s 0.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.support {
  margin: 18px 0 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: #5b5e66;
  animation: rise 0.9s 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 54px;
  padding: 0 24px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: transform 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.btn-primary {
  color: #fff;
  background: linear-gradient(180deg, #ff7a45, #f2531f);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 10px 24px rgba(240, 75, 35, 0.3);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4), 0 16px 32px rgba(240, 75, 35, 0.4);
}
.btn-outline {
  color: #fff;
  background: #0b0c0e;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14), 0 10px 24px rgba(0, 0, 0, 0.18);
}
.btn-outline:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28), 0 16px 32px rgba(0, 0, 0, 0.28);
}

/* ---------- stage ---------- */
.stage {
  position: relative;
  padding-top: var(--top0);
}
.stage::after {
  content: '';
  position: absolute;
  z-index: 0;
  top: 0;
  left: 50%;
  width: min(1320px, 100%);
  height: clamp(320px, 62vw, 760px);
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255, 112, 79, 0.3) 0%, rgba(255, 154, 124, 0.2) 38%, rgba(255, 227, 216, 0.08) 58%, transparent 74%);
  transform: translateX(-50%);
  pointer-events: none;
}

/* ---------- orbit (below the text, behind the card) ---------- */
.orbit {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  height: 700px;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 55%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 55%, transparent 100%);
}
.ring {
  position: absolute;
  left: 50%;
  width: var(--d);
  height: var(--d);
  top: var(--top);
  margin-left: calc(var(--d) / -2);
  border-radius: 50%;
  border: 1px solid rgba(23, 25, 29, 0.2);
  transform: rotate(var(--rot, 0deg));
  will-change: transform;
}
.ring-a { --d: var(--ring); --top: var(--crest); }
.ring-b { --d: calc(var(--ring) - var(--step) * 2); --top: calc(var(--crest) + var(--step)); border: 1px dashed rgba(23, 25, 29, 0.3); }
.ring-c { --d: calc(var(--ring) - var(--step) * 4); --top: calc(var(--crest) + var(--step) * 2); border-color: rgba(23, 25, 29, 0.12); }

.node {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  width: 66px;
  height: 66px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(23, 25, 29, 0.09), 0 1px 3px rgba(23, 25, 29, 0.06);
  transform:
    translate(-50%, -50%) rotate(var(--a))
    translateY(calc(var(--d) / -2))
    rotate(calc(var(--a) * -1 - var(--rot, 0deg)));
}
.node svg {
  display: block;
  width: 31px;
  height: 31px;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dot {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: var(--s);
  height: var(--s);
  background: #fff;
  border: 2px solid var(--orange);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(var(--a)) translateY(calc(var(--d) / -2));
}
.ring-c .dot {
  border-color: rgba(23, 25, 29, 0.55);
  border-width: 1.5px;
}

/* ---------- workflow card (normal scroll, scales down + fades as it leaves) ---------- */
.hero-card {
  --p: 0;
  --pull: 0px;
  position: relative;
  z-index: 1;
  isolation: isolate;
  overflow: hidden;
  width: var(--w0);
  margin: 0 auto var(--pull);
  background: #fff;
  border: 6px solid #fff;
  border-radius: 28px;
  box-shadow: 0 40px 90px rgba(23, 25, 29, 0.22);
  transform: scale(calc(1 - 0.17 * var(--p)));
  transform-origin: top center;
  will-change: transform;
  text-align: left;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 66%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 66%, transparent 100%);
}
.hero-image {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}

/* ---------- the example app inside the card ---------- */
.app {
  min-height: 560px;
  background: #fbf9f7;
}
.app-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #fff;
  border-bottom: 1px solid #f1ece8;
}
.app-dots {
  display: flex;
  gap: 6px;
}
.app-dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e9e3de;
}
.app-dots i:first-child { background: #ff8a6b; }
.app-dots i:nth-child(2) { background: #ffcf6b; }
.app-dots i:nth-child(3) { background: #6bd69a; }
.app-bar b {
  font-size: 13.5px;
  font-weight: 600;
  color: #0f172a;
}
.app-live {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #15803d;
  font-size: 11px;
  font-weight: 600;
}
.app-live i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: blink 1.6s ease-in-out infinite;
}

.app-tabs {
  display: flex;
  gap: 8px;
  padding: 16px 18px 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.app-tabs::-webkit-scrollbar { display: none; }
.app-tab {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 10px 16px 11px 13px;
  border: 1px solid #ece6e1;
  border-radius: 14px;
  background: #fff;
  color: #475569;
  font: 600 13px/1 'Inter', system-ui, sans-serif;
  cursor: pointer;
  overflow: hidden;
  transition: background 0.3s, color 0.3s, border-color 0.3s, transform 0.3s;
}
.app-tab svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.app-tab:hover { transform: translateY(-1px); border-color: #d9cfc8; }
.app-tab.on {
  background: #0f172a;
  border-color: #0f172a;
  color: #fff;
}
.app-fill {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.18);
}
.app-fill b {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #ff9a3d, #f2540c);
  transition: width 0.1s linear;
}

.app-body {
  padding: 18px;
  animation: swap 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.app-top {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.kpis {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.kpi {
  min-width: 150px;
  padding: 12px 16px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #f1ece8;
  box-shadow: 0 14px 24px -20px rgba(120, 50, 20, 0.35);
}
.kpi small {
  display: block;
  font-size: 11.5px;
  color: #94a3b8;
}
.kpi b {
  display: block;
  margin-top: 2px;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
}
.kpi:first-child b { color: var(--orange-deep); }
.ribbon {
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  background: #fff1e8;
  color: #b8480a;
  font-size: 12.5px;
  font-weight: 600;
}
.ribbon i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--orange);
}

.board {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}
.col {
  display: grid;
  align-content: start;
  gap: 9px;
  padding: 12px;
  border-radius: 20px;
  background: #f3efeb;
  animation: rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: calc(var(--c) * 0.08s + 0.1s);
}
.col-h {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 2px 4px;
}
.col-n {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #ff9a3d, #f2540c);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}
.col-h b {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}
.col-h em {
  font-style: normal;
  padding: 1px 8px;
  border-radius: 999px;
  background: #fff;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}
.tcard {
  display: grid;
  gap: 3px;
  padding: 11px 12px 12px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 12px 20px -16px rgba(60, 30, 15, 0.45);
}
.tcard b {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: #0f172a;
}
.tcard small {
  font-size: 11.5px;
  color: #94a3b8;
}
.tag {
  justify-self: start;
  margin-top: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #eef1f6;
  color: #475569;
  font-size: 10.5px;
  font-weight: 700;
}
.tag.o { background: #fff1e8; color: #c2500a; }
.tag.r { background: #fde4e4; color: #d33; }
.tag.b { background: #e4edff; color: #2f55c8; }
.tag.g { background: #e0f6ea; color: #1a8a55; }
.tag.i { background: #efe9ff; color: #6a45c8; }

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes swap { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes blink { 50% { opacity: 0.3; } }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .content { padding-top: 96px; }
  .board { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px) {
  .hero {
    --ring: min(1100px, 230vw);
    --step: 58px;
    --crest: 44px;
    --top0: 120px;
    --w0: calc(100vw - 24px);
    --title: clamp(38px, 10.5vw, 64px);
    padding-bottom: 40px;
  }
  .content { width: calc(100% - 32px); padding: 76px 0 24px; }
  .lead { font-size: 15px; margin-top: 22px; }
  .actions { width: 100%; gap: 10px; margin-top: 28px; }
  .btn { min-height: 50px; padding: 0 20px; font-size: 14px; }
  .node { width: 52px; height: 52px; border-radius: 16px; }
  .node svg { width: 25px; height: 25px; }
  .app-tabs { padding: 12px 12px 0; }
  .app-body { padding: 12px; }
  .kpi { min-width: 0; flex: 1 1 100px; padding: 10px 12px; }
  .kpi b { font-size: 21px; }
  .ribbon { font-size: 11.5px; }
}
@media (max-width: 380px) {
  .actions { flex-direction: column; align-items: stretch; }
  .board { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  h1, .lead, .actions, .support, .col, .app-body { animation: none; }
  .orbit { height: calc(var(--top0) + 160px); }
  .hero-card { transform: none; margin-bottom: 0; }
  .app-live i { animation: none; }
}
</style>