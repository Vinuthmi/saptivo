<template>
  <section
    ref="rootEl"
    class="hx"
    :class="{ 'hx-js': mounted, 'hx-in': revealed }"
    aria-labelledby="hx-title"
  >
    <div class="hx-frame" aria-hidden="true"></div>

    <div class="hx-wrap">
      <!-- ============ copy ============ -->
      <div class="hx-copy">
        <a class="hx-badge" :href="badgeHref">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l1.6 4.4L15 10l-4.4 1.6L9 16l-1.6-4.4L3 10l4.4-1.6zM17.500 12l.9 2.600 2.600.9-2.600.9-.9 2.600-.9-2.600-2.600-.9 2.600-.9zM17 3.500l.7 1.800 1.800.7-1.800.7-.7 1.800-.7-1.800-1.800-.7 1.800-.7z" /></svg>
          <span>Saptivo CRM · Google Calendar sync is live</span>
        </a>

        <h1 id="hx-title" class="hx-title">
          <span class="l1">Turn every inquiry</span>
          <span class="l2">into a closed deal.</span>
        </h1>

        <p class="hx-sub">
          When leads, calls and quotes live in five different tools, deals slip away. Saptivo puts them in one pipeline.
        </p>

        <div class="hx-cta">
          <a class="hx-btn pri" :href="ctaHref">
            <span>Try Free for 14 Days</span>
            <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></i>
          </a>
          <a class="hx-btn sec" :href="demoHref">Book a Demo</a>
        </div>

        <ul class="hx-list">
          <li v-for="t in points" :key="t">
            <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6.500 12.500 3.500 3.500 7.500-8" /></svg></i>
            {{ t }}
          </li>
        </ul>
      </div>

      <!-- ============ isometric scene ============ -->
      <div class="hx-art" aria-hidden="true">
        <svg class="hx-svg" viewBox="0 0 780 600" focusable="false">
          <defs>
            <linearGradient id="hx-or" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ff9a4c" />
              <stop offset="1" stop-color="#f2540c" />
            </linearGradient>
            <linearGradient id="hx-cr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#f2540c" />
              <stop offset="1" stop-color="#d9490a" />
            </linearGradient>
            <radialGradient id="hx-fade" cx="0.5" cy="0.5" r="0.55">
              <stop offset="0" stop-color="#fff" />
              <stop offset="1" stop-color="#000" />
            </radialGradient>
            <radialGradient id="hx-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stop-color="#ff8a3a" stop-opacity="0.45" />
              <stop offset="1" stop-color="#ff8a3a" stop-opacity="0" />
            </radialGradient>
            <mask id="hx-m" maskUnits="userSpaceOnUse" x="0" y="0" width="780" height="600">
              <rect width="780" height="600" fill="url(#hx-fade)" />
            </mask>
            <filter id="hx-sh" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#14152b" flood-opacity="0.13" />
            </filter>
            <filter id="hx-sh2" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#14152b" flood-opacity="0.12" />
            </filter>
            <filter id="hx-gl" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <!-- floor grid, faded at the edges -->
          <g mask="url(#hx-m)" class="grid">
            <polyline v-for="(g, i) in grid" :key="i" :points="g" />
          </g>
          <polygon :points="plate" class="plate" />

          <!-- circuit routes -->
          <g class="routes">
            <g v-for="n in nodes" :key="n.id" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path :d="n.d" class="r-out" />
              <path :d="n.d" class="r-in" />
              <path :d="n.d" class="r-fl" />
            </g>
          </g>

          <!-- data packets flowing into Saptivo -->
          <g v-if="!reduce">
            <g v-for="(n, i) in nodes" :key="`p${n.id}`">
              <circle r="9" class="pk-h">
                <animateMotion :path="n.rev" dur="4s" :begin="`${i}s`" repeatCount="indefinite" />
              </circle>
              <circle r="4.500" class="pk">
                <animateMotion :path="n.rev" dur="4s" :begin="`${i}s`" repeatCount="indefinite" />
              </circle>
            </g>
          </g>

          <!-- integration pucks -->
          <g v-for="(n, i) in nodes" :key="`n${n.id}`" class="pop" :style="{ '--d': 0.5 + i * 0.12 + 's' }">
            <g class="float" :style="{ '--f': i * 0.7 + 's' }">
              <ellipse :cx="n.end[0]" :cy="n.end[1] + 12" rx="50" ry="29" class="puck-sh" />
              <ellipse :cx="n.end[0]" :cy="n.end[1] + 8" rx="44" ry="26" class="puck-side" />
              <ellipse :cx="n.end[0]" :cy="n.end[1]" rx="44" ry="26" class="puck-top" />
              <ellipse :cx="n.end[0]" :cy="n.end[1]" rx="44" ry="26" class="puck-ring" :style="{ '--f': i * 0.5 + 's' }" />
              <g :transform="`translate(${n.end[0]} ${n.end[1] - 1}) scale(1 .66)`">
                <template v-if="n.id === 'fb'">
                  <circle r="22" fill="#1877f2" />
                  <text y="10" text-anchor="middle" class="bi fb">f</text>
                </template>
                <template v-else-if="n.id === 'cal'">
                  <rect x="-21" y="-21" width="42" height="42" rx="11" fill="#fff" stroke="#dfe3ee" stroke-width="1.500" />
                  <path d="M-21 -9h42v-1a10 10 0 0 0-10-10h-22a10 10 0 0 0-10 10z" fill="#4285f4" />
                  <text y="14" text-anchor="middle" class="bi gc">31</text>
                </template>
                <template v-else-if="n.id === 'wp'">
                  <circle r="22" fill="#21759b" />
                  <circle r="17" fill="none" stroke="#fff" stroke-width="2" />
                  <text y="9" text-anchor="middle" class="bi wp">W</text>
                </template>
                <template v-else>
                  <circle r="22" fill="#25d366" />
                  <g transform="translate(-13 -13) scale(1.08)"><path :d="icons.phone" class="ph" /></g>
                </template>
              </g>
            </g>
          </g>

          <!-- Saptivo pedestal -->
          <g class="pop" style="--d: 0.25s">
            <ellipse :cx="cube[0]" :cy="cube[1] + 6" rx="150" ry="84" fill="url(#hx-glow)" />
            <g filter="url(#hx-sh)">
              <polygon :points="base.left" fill="#f3ece8" />
              <polygon :points="base.right" fill="#ebe3df" />
              <polygon :points="base.top" fill="#fbf8f6" stroke="#f0e9e5" stroke-width="1.500" />
            </g>
            <polygon :points="tile.left" fill="#f6f1ee" />
            <polygon :points="tile.right" fill="#efe8e4" />
            <polygon :points="tile.top" fill="#fff" stroke="#f3ece8" stroke-width="1.200" />
            <ellipse :cx="cube[0]" :cy="cube[1] + 12" rx="104" ry="60" class="pulse" />
          </g>

          <!-- floating Saptivo cube -->
          <g class="pop" style="--d: 0.45s">
            <g class="float big">
              <ellipse :cx="ring[0]" :cy="ring[1]" rx="64" ry="36" class="orbit" />
              <polygon :points="cb.left" fill="#ff8a3a" opacity="0.96" />
              <polygon :points="cb.right" fill="url(#hx-cr)" opacity="0.96" />
              <polygon :points="cb.top" fill="#ffd2b0" />
              <polyline :points="cb.edge" fill="none" stroke="#fff" stroke-width="1.500" stroke-opacity="0.8" stroke-linejoin="round" />
              <g :transform="mtx(-24, -24, 114)">
                <g transform="translate(5 5) scale(1.6)">
                  <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.500l9 5 9-5" class="logo" />
                </g>
              </g>
            </g>
          </g>

          <!-- CRM card (isometric plane) -->
          <g class="pop" style="--d: 0.7s">
            <g filter="url(#hx-sh)">
              <polygon :points="card.left" fill="#f3ece8" />
              <polygon :points="card.right" fill="#ebe3df" />
              <polygon :points="card.top" fill="#fff" />
            </g>
            <g :transform="mtx(80, -60, 8)">
              <!-- prompt box -->
              <rect x="14" y="14" width="262" height="64" rx="12" fill="#fff" stroke="#efe8e4" />
              <rect x="22" y="22" width="150" height="20" rx="10" fill="#f6f2ef" />
              <circle cx="34" cy="32" r="6" fill="#14152b" />
              <text x="46" y="35.500" class="t s">Inquiry_#28.pdf</text>
              <text x="158" y="35.500" class="t s">×</text>
              <text x="22" y="64" class="t m">Follow up with John Smith</text>
              <rect x="192" y="53" width="1.600" height="14" fill="#f2540c" class="caret" />
              <!-- chips -->
              <g transform="translate(14 88)">
                <rect width="66" height="20" rx="10" fill="#fff" stroke="#efe8e4" />
                <circle cx="13" cy="10" r="4" fill="#25d366" />
                <text x="22" y="13.500" class="t s">WhatsApp</text>
              </g>
              <g transform="translate(88 88)">
                <rect width="56" height="20" rx="10" fill="#fff" stroke="#efe8e4" />
                <circle cx="13" cy="10" r="4" fill="#f2540c" />
                <text x="22" y="13.500" class="t s">Quote</text>
              </g>
              <!-- suggestions -->
              <g v-for="(r, k) in rows" :key="r.t" :opacity="1 - k * 0.27">
                <rect x="10" :y="r.y - 12" width="232" height="18" rx="9" class="hl" :style="{ '--k': k }" />
                <g :transform="`translate(20 ${r.y - 9}) scale(.55)`"><path :d="r.i" class="ri" /></g>
                <text x="40" :y="r.y + 1.500" class="t r">{{ r.t }}</text>
              </g>
              <!-- send -->
              <circle cx="260" cy="162" r="12" fill="url(#hx-or)" />
              <path d="M255 162h10M261 157l5 5-5 5" class="arrow" />
            </g>
          </g>

          <!-- "Capturing lead…" label -->
          <g class="pop" style="--d: 0.9s">
            <g class="float" style="--f: 1.2s">
              <g filter="url(#hx-sh2)">
                <polygon :points="lab.left" fill="#f3ece8" />
                <polygon :points="lab.right" fill="#ebe3df" />
                <polygon :points="lab.top" fill="#fff" />
              </g>
              <g :transform="mtx(110, 150, 6)">
                <g transform="translate(26 22)">
                  <g v-if="!reduce">
                    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2.400s" repeatCount="indefinite" />
                    <line v-for="k in 8" :key="k" x1="0" y1="-10" x2="0" y2="-5" stroke="#f2540c" stroke-width="2.200" stroke-linecap="round" :opacity="0.15 + k * 0.1" :transform="`rotate(${k * 45})`" />
                  </g>
                  <g v-else>
                    <line v-for="k in 8" :key="k" x1="0" y1="-10" x2="0" y2="-5" stroke="#f2540c" stroke-width="2.200" stroke-linecap="round" :opacity="0.15 + k * 0.1" :transform="`rotate(${k * 45})`" />
                  </g>
                </g>
                <text x="46" y="27" class="t m">Capturing lead…</text>
              </g>
            </g>
          </g>

          <!-- floating toasts -->
          <g v-for="(t, i) in toasts" :key="t.t" class="pop" :style="{ '--d': 1.1 + i * 0.15 + 's' }">
            <g class="float" :style="{ '--f': i * 0.9 + 's' }">
              <g :transform="`translate(${t.x} ${t.y})`" filter="url(#hx-sh2)">
                <rect :width="t.w" height="30" rx="15" fill="#fff" stroke="#f0e9e5" />
                <circle cx="16" cy="15" r="5" :fill="t.c" />
                <text x="28" y="19" class="t toast">{{ t.t }}</text>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeHeroSection' })
/**
 * SectionHero.vue — Saptivo hero with an isometric "integrations → one pipeline" scene (Vue 3, <script setup>)
 *
 * Left: badge, gradient headline, copy, CTAs and a checklist.
 * Right: an SVG isometric scene — WordPress, Facebook, Google Calendar and Phone/WhatsApp feed glowing
 * circuit routes into the Saptivo cube, next to a CRM card showing a follow-up being prepared.
 * Everything is drawn from the small `P()` iso projection below, so positions are easy to tweak.
 *
 * Props: ctaHref, demoHref, badgeHref. Browser APIs are only used in onMounted (SSR / Nuxt safe).
 * Respects prefers-reduced-motion (the scene is drawn static, no travelling packets or spinner).
 */
import { ref, onMounted } from 'vue'

defineProps({
  ctaHref: { type: String, default: '#signup' },
  demoHref: { type: String, default: '#demo' },
  badgeHref: { type: String, default: '#integrations' },
})

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
const reduce = ref(false)

const points = [
  'Capture leads from web, social and calls',
  'Quote, invoice and follow up in one place',
  'Manage your whole team easily',
]

/* ------------------------------------------------------------------ isometric projection
   world x → down-right, world y → down-left, z → up.  World (0,0,0) sits at screen (OX, OY). */
const S = 0.866
const H = 0.5
const OX = 360
const OY = 272
const P = (x, y, z = 0) => [OX + S * (x - y), OY + H * (x + y) - z]
const f = (n) => +n.toFixed(1)
const pts = (arr) => arr.map(([x, y, z = 0]) => P(x, y, z).map(f).join(',')).join(' ')
const mtx = (x, y, z = 0) => {
  const [tx, ty] = P(x, y, z)
  return `matrix(${S} ${H} ${-S} ${H} ${f(tx)} ${f(ty)})`
}
function box(x, y, w, d, h, z0 = 0) {
  const z1 = z0 + h
  return {
    top: pts([[x, y, z1], [x + w, y, z1], [x + w, y + d, z1], [x, y + d, z1]]),
    right: pts([[x + w, y, z0], [x + w, y + d, z0], [x + w, y + d, z1], [x + w, y, z1]]),
    left: pts([[x, y + d, z0], [x + w, y + d, z0], [x + w, y + d, z1], [x, y + d, z1]]),
    edge: pts([[x, y + d, z1], [x + w, y + d, z1], [x + w, y, z1], [x + w, y + d, z1], [x + w, y + d, z0]]),
  }
}
/* path with softly rounded corners (in screen space) */
function rounded(world, r = 18) {
  const s = world.map(([x, y]) => P(x, y))
  let d = `M${f(s[0][0])},${f(s[0][1])}`
  for (let i = 1; i < s.length - 1; i++) {
    const [px, py] = s[i - 1]
    const [cx, cy] = s[i]
    const [nx, ny] = s[i + 1]
    const l1 = Math.hypot(cx - px, cy - py)
    const l2 = Math.hypot(nx - cx, ny - cy)
    const rr = Math.min(r, l1 / 2, l2 / 2)
    const ax = cx + ((px - cx) / l1) * rr
    const ay = cy + ((py - cy) / l1) * rr
    const bx = cx + ((nx - cx) / l2) * rr
    const by = cy + ((ny - cy) / l2) * rr
    d += ` L${f(ax)},${f(ay)} Q${f(cx)},${f(cy)} ${f(bx)},${f(by)}`
  }
  const e = s[s.length - 1]
  return d + ` L${f(e[0])},${f(e[1])}`
}

/* ------------------------------------------------------------------ scene data */
const icons = {
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4',
  cal: 'M6 5h12a2.500 2.500 0 0 1 2.500 2.500v11A2.500 2.500 0 0 1 18 21H6a2.500 2.500 0 0 1-2.500-2.500v-11A2.500 2.500 0 0 1 6 5zM3.500 10h17M8 3v4M16 3v4',
}

const routeDefs = [
  { id: 'fb', pts: [[-30, -40], [-30, -150], [-100, -150], [-100, -290]] },
  { id: 'cal', pts: [[40, -20], [260, -20], [260, -150]] },
  { id: 'wp', pts: [[-20, 40], [-20, 270], [90, 270]] },
  { id: 'ph', pts: [[-40, -20], [-200, -20], [-200, 90]] },
]
const nodes = routeDefs.map((r) => ({
  id: r.id,
  d: rounded(r.pts),
  rev: rounded([...r.pts].reverse()),
  end: P(...r.pts[r.pts.length - 1]).map(f),
}))

const grid = []
for (let t = -320; t <= 320; t += 64) {
  grid.push(pts([[-320, t], [320, t]]))
  grid.push(pts([[t, -320], [t, 320]]))
}
const plate = pts([[-150, -150], [150, -150], [150, 150], [-150, 150]])
const base = box(-65, -65, 130, 130, 34, 0)
const tile = box(-54, -54, 108, 108, 10, 34)
const cb = box(-24, -24, 48, 48, 48, 66)
const card = box(80, -60, 290, 190, 8, 0)
const lab = box(110, 150, 200, 44, 6, 0)
const cube = P(0, 0, 0).map(f)
const ring = P(0, 0, 56).map(f)

const rows = [
  { t: 'Send quotation', y: 128, i: icons.doc },
  { t: 'Call back customer', y: 148, i: icons.phone },
  { t: 'Book appointment', y: 168, i: icons.cal },
]
const toasts = [
  { x: 548, y: 118, w: 112, t: '+1 new lead', c: '#1fa971' },
  { x: 24, y: 268, w: 148, t: 'Call logged · 1:40', c: '#25d366' },
  { x: 636, y: 262, w: 118, t: 'Event synced', c: '#4285f4' },
  { x: 34, y: 492, w: 140, t: 'Form submitted', c: '#f2540c' },
]

/* ------------------------------------------------------------------ lifecycle */
onMounted(() => {
  mounted.value = true
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => (revealed.value = true))
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

/* ============ tokens ============ */
.hx {
  --ink: #14152b;
  --ink-2: #2b2d45;
  --muted: #6c7084;
  --line: rgba(20, 21, 43, 0.08);
  --o1: #ff8a3a;
  --o2: #f2540c;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  background:
    radial-gradient(760px 520px at 88% 72%, rgba(255, 138, 58, 0.1), transparent 62%),
    radial-gradient(600px 420px at 0% 0%, rgba(255, 138, 58, 0.06), transparent 60%), #fff;
}
.hx *,
.hx *::before,
.hx *::after {
  box-sizing: border-box;
}
.hx svg {
  display: block;
}
.hx-frame {
  position: absolute;
  inset: 0;
  z-index: -1;
  max-width: 1376px;
  margin: 0 auto;
  border-inline: 1px solid var(--line);
  pointer-events: none;
}
.hx-wrap {
  position: relative;
  max-width: 1280px;
  min-height: 740px;
  margin: 0 auto;
  padding: clamp(28px, 3.6vw, 48px) clamp(20px, 3.6vw, 40px) clamp(36px, 5vw, 80px);
}

/* ============ copy ============ */
.hx-copy {
  position: relative;
  z-index: 2;
  max-width: 720px;
}
.hx-badge {
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
}
.hx-badge span {
  background: linear-gradient(90deg, #f2540c, #d6336c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hx-badge svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #f2540c;
  stroke-width: 1.7;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.hx-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 24px -14px rgba(242, 84, 12, 0.6);
}
.hx-badge:focus-visible {
  outline: 2px solid var(--o2);
  outline-offset: 4px;
}
.hx-title {
  margin: 26px 0 0;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: 3.5vw;
  font-weight: 500;
  line-height: 1.16;
  letter-spacing: -0.045em;
}
.hx-title span {
  display: block;
}
.hx-title .l2 {
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  opacity: 1;
  padding-bottom: 0.08em;
}
.hx-sub {
  max-width: 520px;
  margin: 22px 0 0;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: #475569;
}
.hx-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
}
.hx-btn {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  height: 52px;
  padding: 0 22px;
  border-radius: 14px;
  font-size: 15.5px;
  font-weight: 500;
  text-decoration: none;
  transition: transform 0.4s var(--ease), box-shadow 0.4s, background 0.3s;
}
.hx-btn:hover {
  transform: translateY(-2px);
}
.hx-btn:focus-visible {
  outline: 2px solid var(--o2);
  outline-offset: 4px;
}
.hx-btn.pri {
  padding: 0 7px 0 22px;
  color: #fff;
  background: linear-gradient(180deg, #ff8f4a, #f2540c);
  box-shadow: 0 18px 30px -16px rgba(242, 84, 12, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.35);
}
.hx-btn.pri i {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.22);
  transition: transform 0.4s var(--ease), background 0.3s;
}
.hx-btn.pri:hover i {
  transform: translateX(3px);
  background: rgba(255, 255, 255, 0.32);
}
.hx-btn.pri svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #fff;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.hx-btn.sec {
  color: var(--ink);
  background: #fff;
  border: 1px solid rgba(20, 21, 43, 0.14);
}
.hx-btn.sec:hover {
  border-color: var(--o2);
  box-shadow: 0 14px 24px -16px rgba(242, 84, 12, 0.6);
}
.hx-list {
  margin: 34px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 14px;
}
.hx-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15.5px;
  font-weight: 500;
  color: var(--ink-2);
}
.hx-list i {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff1e8;
  border: 1px solid #ffe0cc;
}
.hx-list svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ============ art ============ */
.hx-art {
  position: absolute;
  right: -2%;
  bottom: -2%;
  z-index: 1;
  width: min(800px, 64vw);
  pointer-events: none;
}
.hx-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}
.hx-svg text {
  font-family: 'Poppins', system-ui, sans-serif;
}
.grid polyline {
  fill: none;
  stroke: #14152b;
  stroke-opacity: 0.07;
  stroke-width: 1;
}
.plate {
  fill: #fcfaf9;
  stroke: #f1eae6;
  stroke-width: 2;
  stroke-linejoin: round;
}
.r-out {
  stroke: #efe8e4;
  stroke-width: 17;
}
.r-in {
  stroke: #fff;
  stroke-width: 12;
}
.r-fl {
  stroke: #ffb48a;
  stroke-width: 2.4;
  stroke-dasharray: 3 10;
  animation: hx-dash 1.2s linear infinite;
}
.pk-h {
  fill: #ff8a3a;
  opacity: 0.3;
}
.pk {
  fill: #f2540c;
  stroke: #fff;
  stroke-width: 1.5;
  filter: url(#hx-gl);
}

/* pucks */
.puck-sh {
  fill: #14152b;
  opacity: 0.08;
  filter: blur(5px);
}
.puck-side {
  fill: #ebe3df;
}
.puck-top {
  fill: #fff;
  stroke: #f1eae6;
  stroke-width: 1.5;
}
.puck-ring {
  fill: none;
  stroke: #ff9a4c;
  stroke-width: 1.5;
  transform-box: fill-box;
  transform-origin: center;
  animation: hx-ring 3.6s ease-out infinite;
  animation-delay: var(--f, 0s);
}
.bi {
  font-weight: 700;
}
.bi.fb {
  font-size: 32px;
  fill: #fff;
}
.bi.gc {
  font-size: 19px;
  fill: #1a73e8;
}
.bi.wp {
  font-family: Georgia, serif;
  font-size: 26px;
  fill: #fff;
}
.ph {
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* pedestal + cube */
.pulse {
  fill: none;
  stroke: #ff8a3a;
  stroke-width: 2;
  transform-box: fill-box;
  transform-origin: center;
  animation: hx-pulse 2s ease-out infinite;
}
.orbit {
  fill: none;
  stroke: #f2540c;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 5 12;
  animation: hx-dash 1.6s linear infinite;
}
.logo {
  fill: none;
  stroke: #fff;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* card contents */
.t {
  fill: var(--ink-2);
}
.t.s {
  font-size: 9.5px;
  font-weight: 500;
}
.t.m {
  font-size: 13px;
  font-weight: 500;
}
.t.r {
  font-size: 11.5px;
  font-weight: 500;
  fill: #6c7084;
}
.t.toast {
  font-size: 11.5px;
  font-weight: 500;
  fill: var(--ink);
}
.ri {
  fill: none;
  stroke: #9a9db0;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.arrow {
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.hl {
  fill: #ff8a3a;
  opacity: 0;
  animation: hx-hl 6s ease-in-out infinite;
  animation-delay: calc(var(--k) * 2s);
}
.caret {
  animation: hx-caret 1s steps(1) infinite;
}

/* motion helpers */
.float {
  animation: hx-bob 5s ease-in-out infinite;
  animation-delay: var(--f, 0s);
}
.float.big {
  animation-duration: 6s;
}
.hx-js .pop {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: 50% 70%;
  transform: translateY(26px) scale(0.94);
}
.hx-js.hx-in .pop {
  opacity: 1;
  transform: none;
  transition: opacity 0.9s var(--ease) var(--d, 0s), transform 1.1s var(--ease) var(--d, 0s);
}

/* copy entrance */
.hx-js .hx-badge,
.hx-js .hx-title,
.hx-js .hx-sub,
.hx-js .hx-cta,
.hx-js .hx-list {
  opacity: 0;
  transform: translateY(22px);
}
.hx-js.hx-in .hx-badge,
.hx-js.hx-in .hx-title,
.hx-js.hx-in .hx-sub,
.hx-js.hx-in .hx-cta,
.hx-js.hx-in .hx-list {
  opacity: 1;
  transform: none;
  transition: opacity 0.8s var(--ease), transform 0.9s var(--ease);
}
.hx-js.hx-in .hx-title { transition-delay: 0.08s; }
.hx-js.hx-in .hx-sub { transition-delay: 0.16s; }
.hx-js.hx-in .hx-cta { transition-delay: 0.24s; }
.hx-js.hx-in .hx-list { transition-delay: 0.32s; }

/* ============ keyframes ============ */
@keyframes hx-dash { to { stroke-dashoffset: -26; } }
@keyframes hx-bob { 50% { transform: translateY(-7px); } }
@keyframes hx-ring { 0% { opacity: 0.8; transform: scale(1); } 70%, 100% { opacity: 0; transform: scale(1.5); } }
@keyframes hx-pulse { 0% { opacity: 0.7; transform: scale(0.75); } 100% { opacity: 0; transform: scale(1.3); } }
@keyframes hx-hl { 0%, 100% { opacity: 0; } 8%, 26% { opacity: 0.14; } 34% { opacity: 0; } }
@keyframes hx-caret { 50% { opacity: 0; } }

/* ============ responsive ============ */
@media (max-width: 1100px) {
  .hx-art { width: min(720px, 62vw); right: -4%; }
}
@media (max-width: 900px) {
  .hx-wrap { min-height: 0; padding-bottom: 20px; }
  .hx-art {
    position: relative;
    right: auto;
    bottom: auto;
    width: min(680px, 100%);
    margin: 18px auto 0;
  }
}
@media (max-width: 480px) {
  .hx-btn { width: 100%; justify-content: space-between; }
  .hx-btn.sec { justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  .hx *, .hx *::before, .hx *::after {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
    transition-delay: 0s !important;
  }
  .hx-js .pop, .hx-js .hx-badge, .hx-js .hx-title, .hx-js .hx-sub, .hx-js .hx-cta, .hx-js .hx-list {
    opacity: 1;
    transform: none;
  }
}
</style>
