<template>
  <section
    ref="rootEl"
    class="s6"
    :class="{ 's6-js': mounted, 's6-in': revealed }"
    aria-labelledby="s6-title"
  >
    <!-- shared SVG defs: underline gradient -->
    <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="s6-ul" x1="0" x2="1">
          <stop offset="0" stop-color="#ffb27f" />
          <stop offset="1" stop-color="#f2540c" />
        </linearGradient>

      </defs>
    </svg>

    <div class="s6-panel">
      <!-- ============ heading row ============ -->
      <header class="s6-head">
        <div class="s6-hl">
          <span class="s6-eyebrow">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l1.6 4.4L15 10l-4.4 1.6L9 16l-1.6-4.4L3 10l4.4-1.6zM17.5 12l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9zM17 3.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" /></svg>
          </span>
          <h2 id="s6-title" class="s6-title">
            Data Protection
            <span>
              &amp;
              <b
                >Audit<svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 11 C 30 3, 52 15, 84 8 S 146 3, 170 9 C 182 12, 192 8, 198 6" /></svg
              ></b>
            </span>
          </h2>
        </div>

        <div class="s6-hr">
          <p class="s6-sub">
            Every sign-in attempt is throttled, every change is recorded and every deletion can be undone — your data always stays accountable.
          </p>
        </div>
      </header>

      <div class="s6-grid">
        <!-- ============ left: visual stage ============ -->
        <div class="s6-stage" @pointerenter="paused = true" @pointerleave="paused = false">
          <div
            v-for="(it, i) in items"
            :key="it.id"
            class="s6-layer"
            :class="{ on: active === i }"
            :style="{ '--i': i }"
            :aria-hidden="active === i ? undefined : 'true'"
          >
            <div class="s6-bg" :style="{ background: it.bg }" aria-hidden="true">
              <img v-if="it.img" class="s6-photo" :src="it.img" alt="" loading="lazy" draggable="false" />
              <svg class="s6-deco" viewBox="0 0 24 24" v-html="icons[it.icon]"></svg>
            </div>
            <div class="s6-scrim" aria-hidden="true"></div>

            <div class="s6-top" aria-hidden="true">
              <span class="s6-ti"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>
            </div>

            <!-- glass metric widget -->
            <div class="s6-w s6-w2" aria-hidden="true">
              <div class="dg-top">
                <span class="dg-ic"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>
                <span class="dg-k">{{ it.metric[2] }}</span>
              </div>
              <div class="dg-big">{{ it.metric[0] }}</div>
              <div class="dg-l">{{ it.metric[1] }}</div>
              <div class="dg-tags">
                <span v-for="t in it.tags" :key="t">{{ t }}</span>
              </div>
            </div>

            <!-- white "product UI" widget -->
            <div class="s6-w s6-w1" aria-hidden="true">
              <!-- ===== rate limiting ===== -->
              <template v-if="it.id === 'rate'">
                <div class="d-h">
                  <svg viewBox="0 0 24 24" class="d-i" v-html="icons.rate"></svg>
                  POST /api/auth/login
                  <span class="d-live"><i></i>Live</span>
                </div>
                <div class="d-pills">
                  <span v-for="s in rateStats" :key="s.l" class="d-pill" :class="s.k"><i v-if="s.k"></i>{{ s.v }} {{ s.l }}</span>
                </div>
                <div class="d-chart">
                  <span class="d-thr"><em>limit · 60 / min</em></span>
                  <div class="d-bars">
                    <i v-for="(h, k) in bars" :key="k" :class="{ hot: h > 60 }" :style="{ '--h': h + '%', '--k': k }"></i>
                  </div>
                </div>
                <div class="d-steps">
                  <span v-for="(s, k) in lockSteps" :key="s.a" :style="{ '--k': k }">
                    <small>{{ s.a }}</small>
                    <b>{{ s.t }}</b>
                  </span>
                </div>
                <div class="d-toast"><i></i>429 · Too Many Requests</div>
              </template>

              <!-- ===== audit trail ===== -->
              <template v-else-if="it.id === 'audit'">
                <div class="d-h">
                  <svg viewBox="0 0 24 24" class="d-i" v-html="icons.audit"></svg>
                  Audit trail
                  <span class="d-imm"><svg viewBox="0 0 24 24" v-html="icons.lock"></svg>Immutable</span>
                </div>
                <div class="d-log">
                  <div v-for="(r, k) in auditRows" :key="k" class="d-ev" :style="{ '--k': k }">
                    <span class="d-av" :style="{ '--c': r.c }">{{ r.u }}</span>
                    <div class="d-evm">
                      <p>
                        <b>{{ r.n }}</b> {{ r.a }} <u>{{ r.t }}</u>
                      </p>
                      <span class="d-diff"
                        >{{ r.f }}: <s>{{ r.from }}</s>
                        <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        <strong>{{ r.to }}</strong></span
                      >
                    </div>
                    <span class="d-time">{{ r.time }}</span>
                  </div>
                </div>
                <div class="d-foot">
                  <span><i></i>user · action · IP · time</span>
                  <em class="d-export"><svg viewBox="0 0 24 24"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" /></svg>Export</em>
                </div>
                <div class="d-toast"><i></i>audit-log.csv exported</div>
              </template>

              <!-- ===== recycle bin ===== -->
              <template v-else>
                <div class="d-h">
                  <svg viewBox="0 0 24 24" class="d-i" v-html="icons.bin"></svg>
                  Recycle bin
                  <span class="d-imm"><svg viewBox="0 0 24 24" v-html="icons.restore"></svg>90-day buffer</span>
                </div>
                <div class="d-bin">
                  <div v-for="(r, k) in binRows" :key="k" class="d-item" :class="{ first: k === 0 }" :style="{ '--k': k }">
                    <span class="d-kind">{{ r.kind }}</span>
                    <div class="d-evm">
                      <p>
                        <b>{{ r.n }}</b>
                      </p>
                      <span class="d-left">Deleted {{ r.ago }} · {{ r.left }} d left</span>
                    </div>
                    <span class="d-btnwrap">
                      <em class="d-btn"><svg viewBox="0 0 24 24" v-html="icons.restore"></svg>Restore</em>
                      <em v-if="k === 0" class="d-btn done"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg>Restored</em>
                    </span>
                  </div>
                </div>
                <div class="d-foot">
                  <span><svg viewBox="0 0 24 24" v-html="icons.lock"></svg>Permanent delete · Admin only</span>
                </div>
                <div class="d-toast"><i></i>Restored with 12 linked records</div>
              </template>
            </div>
          </div>
        </div>

        <!-- ============ right: list with progress ============ -->
        <ul
          ref="listEl"
          class="s6-list"
          role="group"
          aria-label="Data protection and audit controls"
          @pointerenter="paused = true"
          @pointerleave="paused = false"
          @focusin="paused = true"
          @focusout="paused = false"
          @keydown="onKey"
        >
          <li v-for="(it, i) in items" :key="it.id" class="s6-item" :class="{ on: active === i }" :style="{ '--i': i }">
            <button
              type="button"
              class="s6-ib"
              :aria-expanded="active === i"
              :aria-controls="`s6-p-${it.id}`"
              @click="select(i)"
              @pointerenter="onEnter(i, $event)"
              @pointerleave="onLeave"
            >
              <span class="s6-ico"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>
              <span class="s6-it">{{ it.name }}</span>
            </button>
            <p class="s6-id">{{ it.desc }}</p>
            <div :id="`s6-p-${it.id}`" class="s6-more" role="region" :aria-label="it.name">
              <div>
                <ul class="s6-pts">
                  <li v-for="p in it.points" :key="p">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9.5" />
                      <path d="m8 12.5 2.8 2.8 5.2-5.6" />
                    </svg>
                    {{ p }}
                  </li>
                </ul>
              </div>
            </div>
            <span class="s6-line" aria-hidden="true"><i :style="{ width: active === i ? progress * 100 + '%' : '0%' }"></i></span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * SectionData.vue — "Data Protection & Audit" (part 03 of the security story, Vue 3, <script setup>)
 *
 * Same design as SectionNetwork (part 02):
 * • Left: a gradient stage whose floating product widgets cross-fade per protection.
 * • Right: three protections with an orange progress line. The active one opens its 3 proof points.
 * • Auto-plays every ~6.5s while in view (pauses on hover/focus). Click, hover (mouse) or ← → ↑ ↓ switch slides.
 * • Backgrounds use layered gradients. For real photos set `img: '/path/photo.jpg'` on an item.
 *
 * No props. Browser APIs are only used in onMounted / handlers (SSR / Nuxt safe).
 * Everything is namespaced `.s6-` / `.d-` / `.dg-` so it can sit on the same page as SectionAuth (`.s4-`) and SectionNetwork (`.s5-`).
 */
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const rootEl = ref(null)
const listEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
const active = ref(0)
const progress = ref(0)
const paused = ref(false)

/* stroke icons — 24px grid */
const icons = {
  rate: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-5"/><path d="M4 16h2M18 16h2"/>',
  audit: '<path d="M7 3.5h7.5l4.5 4.5v12.5H7z"/><path d="M14.5 3.5V8H19M10 12.5h6M10 16h6"/>',
  bin: '<path d="M4.5 7h15M9.5 7V4.5h5V7"/><path d="m6.5 7 .9 12.5h9.2L17.5 7"/><path d="M10 11v5M14 11v5"/>',
  restore: '<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4.5V9h4.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
}

/* metric: [big value, label, small caption] */
const cardPalette = 'radial-gradient(82% 76% at 88% 4%,rgba(255,143,38,.98) 0%,rgba(239,91,21,.84) 42%,transparent 78%),radial-gradient(88% 78% at 2% 92%,#10385f 0%,#1b5275 42%,transparent 79%),radial-gradient(55% 42% at 54% 72%,rgba(220,226,228,.88) 0%,rgba(180,190,193,.46) 48%,transparent 78%),linear-gradient(135deg,#78311f 0%,#b95735 38%,#7a8b92 100%)'

const items = [
  {
    id: 'rate',
    icon: 'rate',
    img: '',
    name: 'Rate Limiting',
    desc: 'Auto-blocks brute-force sign-in attempts.',
    bg: cardPalette,
    metric: ['60 s', 'Sliding window on login and API endpoints', 'Throttle'],
    tags: ['Lockout', '429 reply'],
    points: [
      'Sliding-window rate limiting on all login and API endpoints',
      'Exponential backoff lockouts upon repeated failed attempts',
      'Blocks distributed credential stuffing before database impact',
    ],
  },
  {
    id: 'audit',
    icon: 'audit',
    img: '',
    name: 'Audit Trail Logs',
    desc: 'Immutable log of who changed what.',
    bg: cardPalette,
    metric: ['4 fields', 'User, action, IP and timestamp on every event', 'Immutable'],
    tags: ['Before / after', 'CSV export'],
    points: [
      'Records user ID, exact action, IP address, and timestamp',
      'Tracks full before/after field changes on leads and quotes',
      'Exportable audit logs for security compliance and forensic review',
    ],
  },
  {
    id: 'bin',
    icon: 'bin',
    img: '',
    name: 'Soft Delete / Recycle Bin',
    desc: 'One-click restore with zero data loss.',
    bg: cardPalette,
    metric: ['90 days', 'Recovery buffer for deleted records', 'Zero data loss'],
    tags: ['1-click restore', ],
    points: [
      '90-day recovery buffer for accidentally deleted leads and records',
      'Restores complete relational data trees with one click',
      'Permanent deletion restricted strictly to authorized Admin roles',
    ],
  },
]

/* mock data */
const rateStats = [
  { v: '1,284', l: 'req / min', k: '' },
  { v: '312', l: 'blocked', k: 'r' },
  { v: '60 s', l: 'window', k: '' },
]
const bars = [22, 30, 26, 38, 34, 44, 40, 52, 48, 92, 100, 96, 70, 46, 36, 30, 26, 24]
const lockSteps = [
  { a: '3 fails', t: '30 s' },
  { a: '5 fails', t: '5 min' },
  { a: '8 fails', t: '1 hour' },
]
const auditRows = [
  { u: 'NP', c: '#f2540c', n: 'Nimal P.', a: 'edited', t: 'Quote #Q-2041', f: 'Discount', from: '5%', to: '10%', time: '10:42' },
  { u: 'SK', c: '#245aa6', n: 'Sara K.', a: 'updated', t: 'Lead #L-318', f: 'Stage', from: 'New', to: 'Won', time: '10:39' },
  { u: 'RM', c: '#c26a16', n: 'Ravi M.', a: 'deleted', t: 'Lead #L-297', f: 'Status', from: 'Active', to: 'Deleted', time: '10:24' },
]
const binRows = [
  { kind: 'Lead', n: 'Kasun Perera', ago: '3 d ago', left: 87 },
  { kind: 'Quote', n: 'Quote #Q-1988', ago: '12 d ago', left: 78 },
  { kind: 'Client', n: 'Lanka Mart (Pvt) Ltd', ago: '41 d ago', left: 49 },
]

/* ------------------------------------------------------------------ interaction */
const AUTOPLAY_MS = 6500
const TICK = 80
let hoverTimer = 0
let reduceMotion = false
let inView = false

function select(i) {
  if (i === active.value) return
  active.value = i
  progress.value = 0
}
function next() {
  select((active.value + 1) % items.length)
}
function onEnter(i, e) {
  if (e.pointerType !== 'mouse' || i === active.value) return
  clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => select(i), 120)
}
function onLeave() {
  clearTimeout(hoverTimer)
}
async function onKey(e) {
  const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
  if (!dir || !e.target.classList?.contains('s6-ib')) return
  e.preventDefault()
  const n = (active.value + dir + items.length) % items.length
  select(n)
  await nextTick()
  listEl.value?.querySelectorAll('.s6-ib')[n]?.focus()
}

/* ------------------------------------------------------------------ lifecycle */
const timers = new Set()
let ioReveal, ioView

onMounted(() => {
  mounted.value = true
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ioReveal = new IntersectionObserver(
    (es, o) => {
      if (es[0].isIntersecting) {
        revealed.value = true
        o.disconnect()
      }
    },
    { threshold: 0.12 },
  )
  ioReveal.observe(rootEl.value)

  ioView = new IntersectionObserver((es) => {
    inView = es[0].isIntersecting
  })
  ioView.observe(rootEl.value)

  if (reduceMotion) {
    progress.value = 1
  } else {
    // auto-advance with a visible progress line under the active item
    const ap = setInterval(() => {
      if (paused.value || !inView || document.hidden) return
      progress.value = Math.min(1, progress.value + TICK / AUTOPLAY_MS)
      if (progress.value >= 1) next()
    }, TICK)
    timers.add(ap)
  }
})
onBeforeUnmount(() => {
  ioReveal?.disconnect()
  ioView?.disconnect()
  clearTimeout(hoverTimer)
  timers.forEach((t) => {
    clearInterval(t)
    clearTimeout(t)
  })
})
</script>

<style>
/* ============ tokens (identical to the other security sections) ============ */
.s6 {
  --ink: #14152b;
  --ink-2: #2b2d45;
  --muted: #6c7084;
  --line: rgba(20, 21, 43, 0.08);
  --o1: #ff7a1a;
  --o2: #f2540c;
  --peach: #fff1e7;
  --peach-2: #ffe4d2;
  --page: #f2f1ee;
  --surface: #fbfaf8;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(36px, 6vw, 84px) clamp(12px, 4vw, 40px);
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
}
.s6 *,
.s6 *::before,
.s6 *::after {
  box-sizing: border-box;
}
.s6 svg {
  display: block;
}

/* ============ panel ============ */
.s6-panel {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(22px, 3.6vw, 48px);
}
.s6-js .s6-panel {
  opacity: 0;
  transform: translateY(24px);
}
.s6-js.s6-in .s6-panel {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease),
    transform 0.9s var(--ease);
}

/* ============ heading row ============ */
.s6-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 360px);
  gap: 28px 48px;
  align-items: end;
}
.s6-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px 8px 11px;
  border-radius: 999px;
  border: 1.5px solid transparent;
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(90deg, #ff9a3d, #e0407a) border-box;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: transform 0.4s var(--ease), box-shadow 0.4s;
  display: none;
}
.s6-eyebrow span {
  background: linear-gradient(90deg, #f2540c, #d6336c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.s6-eyebrow svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #f2540c;
  stroke-width: 1.7;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.s6-eyebrow:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 24px -14px rgba(242, 84, 12, 0.6);
}
.s6-title {
  margin: 22px 0 0;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: 2vw;
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.025em;
}
.s6-title span {
  display: block;
  font-weight: 500;
}
.s6-title b {
  position: relative;
  font-weight: 500;
}
.s6-title b svg {
  position: absolute;
  left: -3%;
  bottom: -0.16em;
  width: 106%;
  height: 0.28em;
  overflow: visible;
}
.s6-title b path {
  fill: none;
  stroke: url(#s6-ul);
  stroke-width: 3.2;
  stroke-linecap: round;
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
  transition: stroke-dashoffset 1.3s 0.6s var(--ease);
}
.s6-in .s6-title b path {
  stroke-dashoffset: 0;
}
.s6-sub {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--muted);
}

/* ============ grid ============ */
.s6-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(0, 1fr);
  gap: clamp(26px, 4vw, 56px);
  align-items: start;
  margin-top: clamp(26px, 3.4vw, 40px);
  margin-inline: calc(-1 * clamp(22px, 3.6vw, 48px));
  padding: 14px clamp(22px, 3.6vw, 48px) clamp(22px, 3.6vw, 48px);
  border-radius: 24px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow:
    0 1px 0 #fff inset,
    0 40px 80px -50px rgba(20, 21, 43, 0.45);
}

/* ============ stage (left) ============ */
.s6-stage {
  container-type: inline-size;
  position: relative;
  height: 470px;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 30px;
  background: #f4f6f7;
  color: #fff;
  box-shadow: 0 30px 64px -38px rgba(16, 42, 64, 0.55), 0 1px 0 #fff inset;
}
.s6-js .s6-stage {
  opacity: 0;
  transform: translateY(26px);
}
.s6-js.s6-in .s6-stage {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease) 0.15s,
    transform 0.9s var(--ease) 0.15s;
}
.s6-stage::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 6;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
  pointer-events: none;
}
.s6-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.8s var(--ease),
    visibility 0s 0.8s;
}
.s6-layer.on {
  opacity: 1;
  visibility: visible;
  transition:
    opacity 0.8s var(--ease),
    visibility 0s;
}
.s6-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.s6-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.45;
  mix-blend-mode: luminosity;
}
.s6-deco {
  position: absolute;
  right: -30px;
  bottom: -20px;
  width: 300px;
  height: 300px;
  fill: none;
  stroke: #fff;
  stroke-width: 0.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transform: rotate(-10deg) scale(0.9);
  transition:
    opacity 0.6s,
    transform 1.4s var(--ease);
}
.s6-layer.on .s6-deco {
  opacity: 0.16;
  transform: rotate(-4deg);
  transition-delay: 0.25s;
}
.s6-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 4% 96%, rgba(8, 28, 50, 0.36), transparent 62%),
    linear-gradient(180deg, rgba(28, 27, 35, 0.08), transparent 48%, rgba(8, 20, 34, 0.16));
}

/* top-left icon */
.s6-top {
  position: absolute;
  left: 24px;
  top: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.s6-ti {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
}
.s6-ti svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* widgets */
.s6-w {
  position: absolute;
  opacity: 0;
  transform: translateY(22px) scale(0.97);
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.s6-layer.on .s6-w {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.7s var(--ease),
    transform 0.9s var(--ease);
}
.s6-layer.on .s6-w1 {
  transition-delay: 0.2s;
}
.s6-layer.on .s6-w2 {
  transition-delay: 0.38s;
}
.s6-w1 {
  left: 24px;
  bottom: 24px;
  width: min(340px, calc(100% - 48px));
  padding: 15px 16px 14px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.96);
  color: var(--ink);
  backdrop-filter: blur(16px) saturate(1.08);
  -webkit-backdrop-filter: blur(16px) saturate(1.08);
  box-shadow: 0 30px 50px -26px rgba(8, 27, 48, 0.56);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 3;
}
.s6-w2 {
  right: 24px;
  top: 24px;
  width: 190px;
  height: 152px;
  padding: 14px 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.34);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: 0 24px 40px -26px rgba(8, 10, 26, 0.6);
  display: flex;
  flex-direction: column;
  z-index: 2;
}
@container (max-width: 520px) {
  .s6-w2 {
    display: none;
  }
}
.dg-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dg-ic {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.9);
}
.dg-ic svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.dg-k {
  font-size: 10.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}
.dg-big {
  margin-top: auto;
  font-size: 28px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
  white-space: nowrap;
}
.dg-l {
  margin-top: 5px;
  font-size: 10.5px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.82);
}
.dg-tags {
  margin-top: 9px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.dg-tags span {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 9.5px;
  font-weight: 500;
  white-space: nowrap;
}

/* ============ list (right) ============ */
.s6-list {
  margin: 0;
  padding: clamp(0px, 3vw, 34px) 0 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}
.s6-js .s6-item {
  opacity: 0;
  transform: translateY(22px);
}
.s6-js.s6-in .s6-item {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease),
    transform 0.9s var(--ease);
  transition-delay: calc(var(--i) * 0.09s + 0.25s);
}
.s6-item {
  position: relative;
  padding: 22px 0 24px;
}
.s6-item:first-child {
  padding-top: 0;
}
.s6-item:last-child {
  padding-bottom: 0;
}
.s6-ib {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  border-radius: 12px;
}
.s6-ib:focus-visible {
  outline: 2px solid var(--o1);
  outline-offset: 4px;
}
.s6-ico {
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--peach);
  border: 1px solid var(--peach-2);
  transition:
    background 0.4s,
    box-shadow 0.4s,
    transform 0.5s var(--ease);
}
.s6-ico svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.4s;
}
.s6-item.on .s6-ico {
  background: linear-gradient(145deg, var(--o1), var(--o2));
  border-color: transparent;
  box-shadow: 0 10px 18px -8px rgba(242, 84, 12, 0.7);
  transform: scale(1.06);
}
.s6-item.on .s6-ico svg {
  stroke: #fff;
}
.s6-it {
  flex: 1;
  min-width: 0;
  font-size: clamp(17px, 1.7vw, 20px);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--ink-2);
  transition: color 0.4s;
}
.s6-item.on .s6-it,
.s6-ib:hover .s6-it {
  color: var(--ink);
}
.s6-id {
  margin: 10px 0 0 46px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--muted);
}
.s6-more {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.6s var(--ease);
}
.s6-more > div {
  overflow: hidden;
  min-height: 0;
}
.s6-item.on .s6-more {
  grid-template-rows: 1fr;
}
.s6-pts {
  margin: 14px 0 2px 46px;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 9px;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.s6-item.on .s6-pts {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.6s var(--ease) 0.2s,
    transform 0.7s var(--ease) 0.2s;
}
.s6-pts li {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ink-2);
}
.s6-pts svg {
  flex: none;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  fill: var(--peach);
  stroke: var(--o2);
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* divider + progress */
.s6-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--line);
  overflow: hidden;
}
.s6-item:last-child .s6-line {
  display: none;
}
.s6-line i {
  display: block;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--o1), var(--o2));
  transition: width 0.1s linear;
}

/* ============ widget internals ============ */
.d-h {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-2);
  white-space: nowrap;
}
.d-i {
  flex: none;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.d-live,
.d-imm {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 9.5px;
  font-weight: 700;
}
.d-live {
  background: #ecfdf3;
  color: #15803d;
}
.d-live i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.d-imm {
  background: var(--peach);
  color: #b84a0a;
}
.d-imm svg {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.s6-layer.on .d-live i,
.s6-layer.on .d-pill i,
.s6-layer.on .d-foot span i {
  animation: s6-blink 1.6s ease-in-out infinite;
}

/* pills */
.d-pills {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.d-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 999px;
  background: #f3f1ee;
  color: var(--ink-2);
  font-size: 9.5px;
  font-weight: 600;
  white-space: nowrap;
}
.d-pill i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.d-pill.r {
  color: #c2262b;
  background: #fff0f0;
}

/* toast (floats over the widget corner) */
.d-toast {
  position: absolute;
  right: -8px;
  bottom: -12px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 16px 26px -12px rgba(20, 21, 43, 0.7);
  opacity: 0;
  transform: translateY(8px) scale(0.9);
}
.d-toast i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
}
.s6-layer.on .d-toast {
  animation: s6-toast 0.7s var(--ease) 1.5s both;
}

/* rate limiting */
.d-chart {
  position: relative;
  height: 80px;
  padding: 8px 10px 0;
  border-radius: 12px;
  background: #f7f6f4;
  overflow: hidden;
}
.d-thr {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 43px; /* 60% of the 72px bar area */
  border-top: 1.5px dashed rgba(194, 38, 43, 0.55);
}
.d-thr em {
  position: absolute;
  right: 8px;
  top: -14px;
  font-style: normal;
  font-size: 8.5px;
  font-weight: 700;
  color: #c2262b;
}
.d-bars {
  height: 72px;
  display: flex;
  align-items: flex-end;
  gap: 4px;
}
.d-bars i {
  flex: 1;
  height: var(--h);
  border-radius: 4px 4px 0 0;
  background: linear-gradient(180deg, #ffb27c, #ff7a1a);
  transform-origin: bottom;
  transform: scaleY(0);
}
.d-bars i.hot {
  background: linear-gradient(180deg, #f87171, #c2262b);
}
.s6-layer.on .d-bars i {
  animation: s6-grow 0.7s var(--ease) both;
  animation-delay: calc(0.45s + var(--k) * 0.04s);
}
.d-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.d-steps span {
  display: grid;
  gap: 1px;
  padding: 6px 9px;
  border-radius: 11px;
  background: var(--peach);
  border: 1px solid var(--peach-2);
}
.d-steps small {
  font-size: 9px;
  color: #b84a0a;
}
.d-steps b {
  font-size: 13px;
  font-weight: 600;
  color: var(--o2);
}
.s6-layer.on .d-steps span {
  animation: s6-pop 0.55s var(--ease) both;
  animation-delay: calc(1.1s + var(--k) * 0.18s);
}

/* audit trail */
.d-log,
.d-bin {
  display: grid;
  gap: 5px;
}
.d-ev,
.d-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 9px;
  border-radius: 11px;
  background: #f7f6f4;
  min-width: 0;
}
.s6-layer.on .d-ev,
.s6-layer.on .d-item {
  animation: s6-in 0.55s var(--ease) both;
  animation-delay: calc(0.5s + var(--k) * 0.14s);
}
.d-av {
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--c);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
}
.d-evm {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 3px;
}
.d-evm p {
  margin: 0;
  font-size: 10.5px;
  line-height: 1.3;
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.d-evm p b {
  color: var(--ink);
  font-weight: 600;
}
.d-evm p u {
  text-decoration: none;
  color: var(--o2);
  font-weight: 600;
}
.d-diff {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  justify-self: start;
  padding: 1px 8px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 9px;
  color: var(--muted);
  white-space: nowrap;
}
.d-diff s {
  color: #c2262b;
}
.d-diff strong {
  color: #15803d;
  font-weight: 700;
}
.d-diff svg {
  width: 9px;
  height: 9px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.d-time {
  flex: none;
  font-size: 9.5px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.d-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 9.5px;
  color: var(--muted);
}
.d-foot span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.d-foot span i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--o1);
}
.d-foot span svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.d-export {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-style: normal;
  font-size: 9.5px;
  font-weight: 600;
}
.d-export svg {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* recycle bin */
.d-kind {
  flex: none;
  min-width: 44px;
  padding: 4px 0;
  text-align: center;
  border-radius: 8px;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 9.5px;
  font-weight: 700;
  color: var(--ink-2);
}
.d-left {
  font-size: 9.5px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.d-btnwrap {
  position: relative;
  flex: none;
  display: grid;
}
.d-btn {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(20, 21, 43, 0.14);
  color: var(--ink);
  font-style: normal;
  font-size: 9.5px;
  font-weight: 700;
}
.d-btn svg {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.d-btn.done {
  background: #ecfdf3;
  border-color: #bbf0cf;
  color: #15803d;
  opacity: 0;
}
.s6-layer.on .d-item.first .d-btn:not(.done) {
  animation: s6-out 0.4s 1.5s forwards;
}
.s6-layer.on .d-item.first .d-btn.done {
  animation: s6-fade 0.5s 1.5s forwards;
}
.s6-layer.on .d-item.first {
  animation:
    s6-in 0.55s var(--ease) 0.5s both,
    s6-glow 1.6s ease 1.5s forwards;
}

/* ============ keyframes ============ */
@keyframes s6-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes s6-pop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes s6-blink {
  50% {
    opacity: 0.3;
  }
}
@keyframes s6-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
@keyframes s6-toast {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes s6-out {
  to {
    opacity: 0;
  }
}
@keyframes s6-fade {
  to {
    opacity: 1;
  }
}
@keyframes s6-glow {
  to {
    background: #f0fdf5;
  }
}

/* ============ responsive ============ */
@media (max-width: 960px) {
  .s6-head {
    grid-template-columns: minmax(0, 1fr) minmax(0, 300px);
    gap: 24px 28px;
  }
  .s6-grid {
    grid-template-columns: 1fr;
  }
  .s6-list {
    padding-top: 0;
  }
  .s6-stage {
    height: 440px;
  }
}
@media (max-width: 760px) {
  .s6-head {
    grid-template-columns: 1fr;
  }
  .s6-stage {
    height: 420px;
    border-radius: 24px;
  }
  .s6-w1 {
    left: 16px;
    bottom: 16px;
    width: calc(100% - 32px);
  }
  .s6-top {
    left: 16px;
    top: 16px;
  }
  .s6-deco {
    width: 200px;
    height: 200px;
  }
  .s6-id,
  .s6-pts {
    margin-left: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .s6 *,
  .s6 *::before,
  .s6 *::after {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
    transition-delay: 0s !important;
  }
  .s6-js .s6-stage,
  .s6-js .s6-item,
  .s6-js .s6-panel {
    opacity: 1;
    transform: none;
  }
}
</style>