<template>
  <section
    ref="rootEl"
    class="hx"
    :class="{ 'hx-js': mounted, 'hx-in': revealed }"
    aria-labelledby="hx-title"
  >
    <div class="hx-wrap">
      <!-- ============ copy ============ -->
      <div class="hx-copy">

        <h2 id="hx-title" class="hx-title">
          <span class="l1">How Saptivo</span>
          <span class="l2">works.</span>
        </h2>

        <ol
          class="hx-list"
          aria-label="How Saptivo works"
          @pointerenter="paused = true"
          @pointerleave="paused = false"
          @focusin="paused = true"
          @focusout="paused = false"
        >
          <li v-for="(st, n) in steps" :key="st.k" class="hx-st" :class="{ on: active === n, done: n < active }">
            <button type="button" class="hx-sb" :aria-current="active === n ? 'step' : undefined" @click="select(n)">
              <i aria-hidden="true">
                <svg v-if="n < active" viewBox="0 0 24 24"><path d="m6.500 12.500 3.500 3.500 7.500-8" /></svg>
                <template v-else>{{ n + 1 }}</template>
              </i>
              <span><b>{{ st.k }}:</b> {{ st.t }}</span>
            </button>
            <span v-if="n < steps.length - 1" class="hx-ln" aria-hidden="true">
              <u :style="{ height: n < active ? '100%' : n === active ? progress * 100 + '%' : '0%' }"></u>
            </span>
          </li>
        </ol>
      </div>

      <!-- ============ isometric scene ============ -->
      <div class="hx-art" aria-hidden="true">
        <svg class="hx-svg" :class="{ dim: active !== 0 }" viewBox="0 0 780 600" focusable="false">
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
          <g v-if="!reduce" class="packets">
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
                  <circle r="22" fill="#14152b" />
                  <g transform="translate(-13 -13) scale(1.08)"><path :d="icons.phone" class="ph" /></g>
                </template>
                <template v-else-if="n.id === 'wp'">
                  <circle r="22" fill="#21759b" />
                  <circle r="17" fill="none" stroke="#fff" stroke-width="2" />
                  <text y="9" text-anchor="middle" class="bi wp">W</text>
                </template>
                <template v-else>
                  <circle r="22" fill="#25d366" />
                  <path d="M-10 11 -8 4a11 11 0 1 1 4 4z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" />
                  <path d="M-4 -4q0 6 7 8l2-2-3-2-1.500 1q-2-1-3-3l1-1.500-2-3z" fill="#fff" />
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
              <!-- process tracker -->
              <g v-for="(st, n) in steps" :key="`tr${st.k}`" :transform="`translate(${14 + n * 67} 12)`">
                <rect width="60" height="20" rx="10" class="trk" :class="{ on: active === n }" />
                <text x="30" y="13.500" text-anchor="middle" class="t s trk-t" :class="{ on: active === n }">{{ st.k }}</text>
              </g>

              <!-- 1 · Capture: enquiries from every channel land in one list -->
              <g v-if="active === 0" key="s0">
                <text x="14" y="55" class="t s hd">Leads · all channels</text>
                <g v-for="(l, k) in leads" :key="l.n" :transform="`translate(14 ${62 + k * 28})`">
                  <g class="rowin" :style="{ '--k': k }">
                    <rect width="262" height="24" rx="8" fill="#fff" stroke="#efe8e4" />
                    <circle cx="14" cy="12" r="4.500" :fill="l.c" />
                    <text x="26" y="15.500" class="t m2">{{ l.n }}</text>
                    <text x="122" y="15.500" class="t s">{{ l.s }}</text>
                    <rect x="212" y="6" width="38" height="13" rx="6.500" class="newp" :style="{ '--k': k }" />
                    <text x="231" y="15.500" text-anchor="middle" class="t s newt" :style="{ '--k': k }">NEW</text>
                  </g>
                </g>
              </g>

              <!-- 2 · Convert: a deal moves through the pipeline to Won -->
              <g v-else-if="active === 1" key="s1">
                <g v-for="(c, k) in cols" :key="c" :transform="`translate(${14 + k * 67} 46)`">
                  <text x="30" y="9" text-anchor="middle" class="t s hd">{{ c }}</text>
                  <rect y="16" width="60" height="122" rx="9" :class="k === 3 ? 'col won' : 'col'" />
                </g>
                <rect x="21" y="102" width="46" height="22" rx="6" class="ghost" />
                <rect x="21" y="130" width="46" height="22" rx="6" class="ghost" />
                <rect x="88" y="102" width="46" height="22" rx="6" class="ghost" />
                <g class="deal">
                  <rect x="19" y="68" width="50" height="30" rx="7" fill="#fff" stroke="#ff8a3a" stroke-width="1.500" filter="url(#hx-sh2)" />
                  <text x="26" y="80.500" class="t s">John S.</text>
                  <text x="26" y="92" class="t s amt">LKR 85k</text>
                </g>
                <g class="wonok">
                  <circle cx="244" cy="124" r="11" fill="#1fa971" />
                  <path d="M238.500 124.500l4 4 7-8" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" />
                  <text x="244" y="148" text-anchor="middle" class="t s okt">Deal won</text>
                </g>
              </g>

              <!-- 3 · Serve: invoice, ticket and visit sit on the same customer record -->
              <g v-else-if="active === 2" key="s2">
                <circle cx="28" cy="64" r="13" fill="url(#hx-or)" />
                <text x="28" y="68" text-anchor="middle" class="t s av">JS</text>
                <text x="50" y="60" class="t m2">John Smith</text>
                <text x="50" y="73" class="t s">Customer record · #C-204</text>
                <path d="M28 78V152" class="link" />
                <g v-for="(r, k) in serveRows" :key="r.n" :transform="`translate(40 ${88 + k * 30})`">
                  <g class="rowin" :style="{ '--k': k }">
                    <path d="M-12 12H0" class="link" />
                    <rect width="236" height="24" rx="8" fill="#fff" stroke="#efe8e4" />
                    <g :transform="`translate(9 5) scale(.6)`"><path :d="r.i" class="ri" /></g>
                    <text x="30" y="15.500" class="t m2">{{ r.n }}</text>
                    <g class="st-a" :style="{ '--k': k }">
                      <rect x="172" y="5" width="54" height="14" rx="7" fill="#fff3e8" />
                      <text x="199" y="15" text-anchor="middle" class="t s oo">{{ r.a }}</text>
                    </g>
                    <g class="st-b" :style="{ '--k': k }">
                      <rect x="172" y="5" width="54" height="14" rx="7" fill="#ecfdf3" />
                      <text x="199" y="15" text-anchor="middle" class="t s gg">{{ r.b }}</text>
                    </g>
                  </g>
                </g>
              </g>

              <!-- 4 · Grow: reports and AI show what drives revenue -->
              <g v-else key="s3">
                <text x="14" y="55" class="t s hd">Revenue · 6 months</text>
                <g v-for="(h, k) in bars" :key="k" :transform="`translate(${14 + k * 22} 150)`">
                  <rect :y="-h" width="14" :height="h" rx="4" :fill="k === 5 ? 'url(#hx-or)' : '#f6d9c6'" class="bar" :style="{ '--k': k }" />
                </g>
                <g class="uplift">
                  <rect x="102" y="58" width="42" height="15" rx="7.500" fill="#ecfdf3" />
                  <text x="123" y="68.500" text-anchor="middle" class="t s gg">+18%</text>
                </g>
                <text x="160" y="55" class="t s hd">By channel</text>
                <g v-for="(ch, k) in channels" :key="ch.n" :transform="`translate(160 ${64 + k * 27})`">
                  <text y="9" class="t s">{{ ch.n }}</text>
                  <text x="116" y="9" text-anchor="end" class="t s pct">{{ ch.p }}%</text>
                  <rect y="14" width="116" height="7" rx="3.500" fill="#f1ece8" />
                  <rect y="14" :width="ch.p * 2.6" height="7" rx="3.500" :fill="ch.c" class="fillx" :style="{ '--k': k }" />
                </g>
                <g class="ai">
                  <rect x="14" y="158" width="262" height="24" rx="12" fill="#fff1e8" stroke="#ffe0cc" />
                  <path d="M30 164l1.600 4.200 4.200 1.600-4.200 1.600L30 175.600l-1.600-4.200-4.200-1.600 4.200-1.600z" fill="#f2540c" />
                  <text x="42" y="173.500" class="t s oo">AI: WhatsApp drives the most revenue — invest there</text>
                </g>
              </g>
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
                <text :key="`l${active}`" x="46" y="27" class="t m swap">{{ scene[active].label }}</text>
              </g>
            </g>
          </g>

          <!-- floating toasts (change with the step) -->
          <g v-for="(t, i) in toasts[active]" :key="`${active}-${t.t}`" class="pop tin" :style="{ '--d': 1.1 + i * 0.15 + 's', '--i': i }">
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
 * Left: gradient headline, the four steps (Capture · Convert · Serve · Grow) and CTAs.
 * Right: an SVG isometric scene — website, Facebook, phone and WhatsApp feed glowing
 * circuit routes into the Saptivo cube, next to a CRM card showing a follow-up being prepared.
 * Everything is drawn from the small `P()` iso projection below, so positions are easy to tweak.
 *
 * The four steps auto-advance (click one to jump; pauses on hover) and the scene label follows.
 * Browser APIs are only used in onMounted (SSR / Nuxt safe). Respects prefers-reduced-motion (static scene, no auto-advance).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
const reduce = ref(false)
const active = ref(0)
const progress = ref(0)
const paused = ref(false)

const steps = [
  { k: 'Capture', t: 'enquiries from your website, Facebook, WhatsApp and phone land in one list automatically.' },
  { k: 'Convert', t: 'your team qualifies leads, sends quotations and moves deals through the pipeline.' },
  { k: 'Serve', t: 'invoices, support tickets and service visits build on the same customer record.' },
  { k: 'Grow', t: 'reports and AI show which channels, products and people drive revenue, so you invest where it pays.' },
]

/* label chip text for each step */
const scene = [
  { label: 'Capturing lead…' },
  { label: 'Moving deal forward…' },
  { label: 'Serving customer…' },
  { label: 'Analysing revenue…' },
]

const STEP_MS = 5000
const TICK = 80
function select(n) {
  if (n === active.value) return
  active.value = n
  progress.value = 0
}

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

/* per-step card content */
const leads = [
  { n: 'Kasun P.', s: 'Website form', c: '#21759b' },
  { n: 'Nisha F.', s: 'Facebook', c: '#1877f2' },
  { n: 'Ravi M.', s: 'WhatsApp', c: '#25d366' },
  { n: 'Unknown', s: 'Phone call · 1:40', c: '#14152b' },
]
const cols = ['New', 'Qualified', 'Quote', 'Won']
const serveRows = [
  { n: 'Invoice #INV-118', a: 'Sent', b: 'Paid', i: icons.doc },
  { n: 'Support ticket #T-42', a: 'Open', b: 'Resolved', i: icons.phone },
  { n: 'Service visit · 14 Nov', a: 'Booked', b: 'Done', i: icons.cal },
]
const bars = [28, 36, 34, 52, 62, 84]
const channels = [
  { n: 'WhatsApp', p: 42, c: '#25d366' },
  { n: 'Facebook', p: 31, c: '#1877f2' },
  { n: 'Website', p: 27, c: '#f2540c' },
]
const tw = (t) => Math.round(t.length * 6.1 + 46)
const T = (x, y, t, c) => ({ x, y, w: tw(t), t, c })
const toasts = [
  [T(548, 118, '+1 new lead', '#1fa971'), T(24, 268, 'Call logged · 1:40', '#25d366'), T(636, 262, 'Message received', '#25d366'), T(34, 492, 'Form submitted', '#f2540c')],
  [T(548, 118, 'Lead qualified', '#1fa971'), T(24, 268, 'Quote sent', '#f2540c'), T(636, 262, 'Deal moved to Won', '#1fa971'), T(34, 492, 'Follow-up booked', '#4285f4')],
  [T(548, 118, 'Invoice paid', '#1fa971'), T(24, 268, 'Ticket resolved', '#25d366'), T(636, 262, 'Visit completed', '#1fa971'), T(34, 492, 'Same customer record', '#f2540c')],
  [T(548, 118, 'Revenue +18%', '#1fa971'), T(24, 268, 'Top channel: WhatsApp', '#25d366'), T(636, 262, 'Report ready', '#4285f4'), T(34, 492, 'AI insight', '#f2540c')],
]

/* ------------------------------------------------------------------ lifecycle */
let timer = null
let io = null
let inView = false

onMounted(() => {
  mounted.value = true
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => (revealed.value = true))

  io = new IntersectionObserver((es) => (inView = es[0].isIntersecting), { threshold: 0.25 })
  io.observe(rootEl.value)

  if (!reduce.value) {
    // each step fills its connector, then hands over to the next one
    timer = setInterval(() => {
      if (paused.value || !inView || document.hidden) return
      progress.value = Math.min(1, progress.value + TICK / STEP_MS)
      if (progress.value >= 1) select((active.value + 1) % steps.length)
    }, TICK)
  }
})
onBeforeUnmount(() => {
  io?.disconnect()
  clearInterval(timer)
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
.hx-wrap {
  position: relative;
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px) clamp(20px, 4vw, 40px);
  display: grid;
  grid-template-columns: minmax(0, 450px) minmax(0, 1fr);
  gap: clamp(16px, 3vw, 40px);
  align-items: center;
}

/* ============ copy ============ */
.hx-copy {
  position: relative;
  z-index: 2;
  min-width: 0;
}

.hx-title {
  margin: 0;
  padding-bottom: 0.2em;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(46px, 3.5vw, 104px);
  color: #0f172a;
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.06em;
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
.hx-list {
  max-width: 450px;
  margin: 30px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0;
}
.hx-st {
  position: relative;
  padding-bottom: 20px;
}
.hx-st:last-child {
  padding-bottom: 0;
}
.hx-sb {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.55;
  color: var(--muted);
  opacity: 0.72;
  transition: opacity 0.4s, color 0.4s;
}
.hx-sb:focus-visible {
  outline: 2px solid var(--o2);
  outline-offset: 4px;
}
.hx-st.on .hx-sb,
.hx-sb:hover {
  opacity: 1;
}
.hx-sb b {
  color: var(--ink);
  font-weight: 600;
}
.hx-sb i {
  flex: none;
  width: 24px;
  height: 24px;
  margin-top: 1px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff1e8;
  border: 1px solid #ffe0cc;
  color: var(--o2);
  font-style: normal;
  font-size: 11.5px;
  font-weight: 600;
  transition: background 0.4s, color 0.4s, box-shadow 0.4s, transform 0.5s var(--ease);
}
.hx-sb i svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.hx-st.on .hx-sb i {
  background: linear-gradient(145deg, var(--o1), var(--o2));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 10px 18px -8px rgba(242, 84, 12, 0.7);
  transform: scale(1.1);
}
.hx-st.done .hx-sb i {
  background: #fff;
  border-color: var(--o2);
}
/* connector between steps, filled by the autoplay progress */
.hx-ln {
  position: absolute;
  left: 11px;
  top: 30px;
  bottom: 4px;
  width: 2px;
  border-radius: 2px;
  background: var(--line);
  overflow: hidden;
}
.hx-ln u {
  display: block;
  width: 100%;
  background: linear-gradient(180deg, var(--o1), var(--o2));
  transition: height 0.1s linear;
}

/* ============ art ============ */
.hx-art {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 780px;
  justify-self: end;
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
.routes,
.packets {
  transition: opacity 0.7s var(--ease);
}
.hx-svg.dim .routes {
  opacity: 0.45;
}
.hx-svg.dim .packets {
  opacity: 0.3;
}
.swap {
  animation: hx-swap 0.6s var(--ease) both;
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

/* process animation (one scene per step) */
.hd { font-weight: 600; fill: #9a9db0; letter-spacing: 0.04em; text-transform: uppercase; font-size: 8.5px; }
.t.m2 { font-size: 11px; font-weight: 500; fill: var(--ink); }
.trk { fill: #fff; stroke: #efe8e4; transition: fill 0.4s; }
.trk.on { fill: url(#hx-or); stroke: none; }
.trk-t.on { fill: #fff; }
.rowin { animation: hx-rowin 0.6s var(--ease) both; animation-delay: calc(0.2s + var(--k) * 0.55s); }
.newp { fill: #fff3e8; animation: hx-newp 1.2s ease both; animation-delay: calc(0.5s + var(--k) * 0.55s); }
.newt { fill: #b84a0a; animation: hx-newp 1.2s ease both; animation-delay: calc(0.5s + var(--k) * 0.55s); }
.col { fill: #f7f3f0; }
.col.won { fill: #f2fbf6; animation: hx-wonbg 0.6s ease 3.7s both; }
.ghost { fill: #fff; stroke: #efe8e4; opacity: 0.7; }
.amt { font-weight: 700; fill: #f2540c; }
.deal { animation: hx-deal 4.6s var(--ease) 0.4s both; }
.wonok { opacity: 0; animation: hx-swap 0.5s ease 3.9s both; }
.okt { fill: #15803d; font-weight: 700; }
.av { fill: #fff; font-weight: 700; }
.link { fill: none; stroke: #e7dfda; stroke-width: 1.5; stroke-linecap: round; stroke-dasharray: 3 4; }
.st-a { animation: hx-out 0.4s ease both; animation-delay: calc(2.2s + var(--k) * 0.5s); }
.st-b { opacity: 0; animation: hx-swap 0.5s ease both; animation-delay: calc(2.4s + var(--k) * 0.5s); }
.oo { fill: #b84a0a; font-weight: 600; }
.gg { fill: #15803d; font-weight: 700; }
.bar { transform-box: fill-box; transform-origin: bottom; animation: hx-growy 0.8s var(--ease) both; animation-delay: calc(0.2s + var(--k) * 0.12s); }
.fillx { transform-box: fill-box; transform-origin: left; animation: hx-growx 0.9s var(--ease) both; animation-delay: calc(0.7s + var(--k) * 0.25s); }
.pct { font-weight: 700; fill: var(--ink); }
.uplift { opacity: 0; animation: hx-swap 0.5s ease 1.1s both; }
.ai { opacity: 0; animation: hx-swap 0.7s ease 2s both; }
.tin { animation: hx-tin 0.6s var(--ease) both; animation-delay: calc(0.35s + var(--i) * 0.12s); }

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
.hx-js .hx-title,
.hx-js .hx-list {
  opacity: 0;
  transform: translateY(22px);
}
.hx-js.hx-in .hx-title,
.hx-js.hx-in .hx-list {
  opacity: 1;
  transform: none;
  transition: opacity 0.8s var(--ease), transform 0.9s var(--ease);
}
.hx-js.hx-in .hx-title { transition-delay: 0.08s; }
.hx-js.hx-in .hx-list { transition-delay: 0.32s; }

/* ============ keyframes ============ */
@keyframes hx-dash { to { stroke-dashoffset: -26; } }
@keyframes hx-bob { 50% { transform: translateY(-7px); } }
@keyframes hx-ring { 0% { opacity: 0.8; transform: scale(1); } 70%, 100% { opacity: 0; transform: scale(1.5); } }
@keyframes hx-pulse { 0% { opacity: 0.7; transform: scale(0.75); } 100% { opacity: 0; transform: scale(1.3); } }
@keyframes hx-hl { 0%, 100% { opacity: 0; } 8%, 26% { opacity: 0.14; } 34% { opacity: 0; } }
@keyframes hx-caret { 50% { opacity: 0; } }
@keyframes hx-swap { from { opacity: 0; } to { opacity: 1; } }
@keyframes hx-out { to { opacity: 0; } }
@keyframes hx-tin { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes hx-rowin { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: none; } }
@keyframes hx-newp { 0%, 100% { opacity: 1; } 40% { opacity: 0.35; } 70% { opacity: 1; } }
@keyframes hx-growy { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes hx-growx { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes hx-wonbg { from { opacity: 0.4; } to { opacity: 1; } }
@keyframes hx-deal {
  0%, 12% { transform: translateX(0); }
  30%, 44% { transform: translateX(67px); }
  62%, 76% { transform: translateX(134px); }
  92%, 100% { transform: translateX(201px); }
}

/* ============ responsive ============ */
@media (max-width: 900px) {
  .hx-wrap {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  .hx-art {
    max-width: 680px;
    justify-self: center;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hx *, .hx *::before, .hx *::after {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
    transition-delay: 0s !important;
  }
  .hx-js .pop, .hx-js .hx-title, .hx-js .hx-list {
    opacity: 1;
    transform: none;
  }
}
</style>