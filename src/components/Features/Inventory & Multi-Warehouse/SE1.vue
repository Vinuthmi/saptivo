<template>
  <section class="sk" aria-labelledby="sk-title">
    <div class="sk-wrap">
      <!-- ============ copy + ledger ============ -->
      <div class="sk-copy">
        <h2 id="sk-title" class="sk-title">
          <span>Stock by</span>
          <span class="sk-g">location</span>
        </h2>
        <p class="sk-lead">
          Track quantities separately for each warehouse, branch and technician van. See where every item is, how many are available and how many are reserved for open orders.
        </p>

        <div class="sk-tabs" role="group" aria-label="Choose a location">
          <button v-for="(l, i) in locs" :key="l.n" type="button" :aria-pressed="active === i" @click="active = i">
            {{ l.n }}
          </button>
        </div>

        <div class="sk-led" aria-live="polite">
          <small>Sample item · figures for illustration</small>
          <div class="sk-nums">
            <div>
              <b>{{ cur.av }}</b>
              <span>available</span>
            </div>
            <div class="r">
              <b>{{ cur.rs }}</b>
              <span>reserved for open orders</span>
            </div>
          </div>
          <div class="sk-bar" aria-hidden="true"><i :style="{ width: share + '%' }"></i></div>
          <p class="sk-all">All locations: <b>{{ totAv }}</b> available, <b>{{ totRs }}</b> reserved</p>
        </div>
      </div>

      <!-- ============ isometric stock map ============ -->
      <div class="sk-scene" :class="{ 'sk-in': mounted }" aria-hidden="true">
        <svg viewBox="170 10 720 500" focusable="false">
          <defs>
            <linearGradient id="sk-og" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ff9a4c" />
              <stop offset="1" stop-color="#f2540c" />
            </linearGradient>
            <radialGradient id="sk-fd" cx="0.5" cy="0.5" r="0.55">
              <stop offset="0" stop-color="#fff" />
              <stop offset="1" stop-color="#000" />
            </radialGradient>
            <mask id="sk-mk" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="620">
              <rect width="1000" height="620" fill="url(#sk-fd)" />
            </mask>
          </defs>

          <g mask="url(#sk-mk)" class="sk-gr">
            <polyline v-for="(g, i) in grid" :key="i" :points="g" />
          </g>
          <polygon :points="plate" class="sk-plate" />

          <!-- roads -->
          <g v-for="r in routes" :key="r.id">
            <path :d="r.d" class="sk-road" />
            <path :d="r.d" class="sk-flow" />
          </g>

          <!-- Warehouse -->
          <g class="sk-loc" :class="{ on: active === 0 }" @pointerenter="active = 0" @click="active = 0">
            <g class="sk-lf">
              <ellipse :cx="rings[0].x" :cy="rings[0].y" :rx="rings[0].rx" :ry="rings[0].rx * 0.56" class="sk-ring" />
              <polygon :points="warehouse.left" :fill="SLAB[0]" />
              <polygon :points="warehouse.right" :fill="SLAB[1]" />
              <polygon :points="warehouse.top" :fill="SLAB[2]" />
              <g v-for="(c, k) in warehouseCrates" :key="`w${k}`">
                <polygon :points="c.b.left" :fill="c.f[0]" />
                <polygon :points="c.b.right" :fill="c.f[1]" />
                <polygon :points="c.b.top" :fill="c.f[2]" />
              </g>
            </g>
          </g>

          <!-- Branch -->
          <g class="sk-loc" :class="{ on: active === 1 }" @pointerenter="active = 1" @click="active = 1">
            <g class="sk-lf">
              <ellipse :cx="rings[1].x" :cy="rings[1].y" :rx="rings[1].rx" :ry="rings[1].rx * 0.56" class="sk-ring" />
              <polygon :points="branch.left" :fill="SLAB[0]" />
              <polygon :points="branch.right" :fill="SLAB[1]" />
              <polygon :points="branch.top" :fill="SLAB[2]" />
              <g v-for="(c, k) in branchCrates" :key="`b${k}`">
                <polygon :points="c.b.left" :fill="c.f[0]" />
                <polygon :points="c.b.right" :fill="c.f[1]" />
                <polygon :points="c.b.top" :fill="c.f[2]" />
              </g>
            </g>
          </g>

          <!-- Technician van -->
          <g class="sk-loc" :class="{ on: active === 2 }" @pointerenter="active = 2" @click="active = 2">
            <g class="sk-lf">
              <ellipse :cx="rings[2].x" :cy="rings[2].y" :rx="rings[2].rx" :ry="rings[2].rx * 0.56" class="sk-ring" />
              <g v-for="(p, k) in vanParts" :key="`v${k}`">
                <polygon :points="p.b.left" :fill="p.f[0]" />
                <polygon :points="p.b.right" :fill="p.f[1]" />
                <polygon :points="p.b.top" :fill="p.f[2]" />
              </g>
              <g v-for="(w, k) in wheels" :key="`wh${k}`">
                <circle :cx="w[0]" :cy="w[1]" r="9" fill="#0b0c1c" />
                <circle :cx="w[0]" :cy="w[1]" r="3.5" fill="#7b80ad" />
              </g>
              <g v-for="(c, k) in vanCrates" :key="`vc${k}`">
                <polygon :points="c.b.left" :fill="c.f[0]" />
                <polygon :points="c.b.right" :fill="c.f[1]" />
                <polygon :points="c.b.top" :fill="c.f[2]" />
              </g>
            </g>
          </g>

          <!-- crates travelling between locations -->
          <g v-if="!reduce">
            <g v-for="(r, i) in routes" :key="`m${r.id}`">
              <polygon points="0,-7 10,-2 0,3 -10,-2" fill="#ffb27a" />
              <polygon points="-10,-2 0,3 0,13 -10,8" fill="#f2540c" />
              <polygon points="10,-2 0,3 0,13 10,8" fill="#c43f06" />
              <animateMotion :path="r.d" :dur="`${5 + i}s`" :begin="`${i * 1.3}s`" repeatCount="indefinite" />
            </g>
          </g>

          <!-- tags -->
          <g
            v-for="(l, i) in locs"
            :key="`t${l.n}`"
            class="sk-loc"
            :class="{ on: active === i }"
            @pointerenter="active = i"
            @click="active = i"
          >
            <g :transform="`translate(${tags[i][0] - 88} ${tags[i][1] - 44})`">
              <path d="M88 40v16" stroke="#ff8a3a" stroke-opacity="0.6" />
              <rect class="sk-tagbg" width="176" height="42" rx="12" />
              <text x="14" y="18" class="sk-tn">{{ l.n }}</text>
              <text x="14" y="33" class="sk-tv">{{ l.av }} available · {{ l.rs }} reserved</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeStockSection' })
/**
 * SectionStock.vue — "Stock by location": a light, full-bleed isometric stock map.
 * Blue-grey crates = available, orange crates = reserved for open orders.
 * Hover / click a location (or use the tabs) to lift it and update the ledger.
 * The figures below are SAMPLE data — replace `locs` with real numbers.
 * Browser APIs only in onMounted (SSR / Nuxt safe). Respects prefers-reduced-motion.
 */
import { ref, computed, onMounted } from 'vue'

const mounted = ref(false)
const reduce = ref(false)
const active = ref(0)

onMounted(() => {
  mounted.value = true
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

/* sample data */
const locs = [
  { n: 'Warehouse', av: 120, rs: 18 },
  { n: 'Branch', av: 34, rs: 6 },
  { n: 'Technician van', av: 8, rs: 2 },
]
const cur = computed(() => locs[active.value])
const share = computed(() => (cur.value.rs / (cur.value.av + cur.value.rs)) * 100)
const totAv = locs.reduce((a, l) => a + l.av, 0)
const totRs = locs.reduce((a, l) => a + l.rs, 0)

/* ------------------------------------------------------------------ isometric projection */
const S = 0.866
const H = 0.5
const OX = 520
const OY = 300
const P = (x, y, z = 0) => [OX + S * (x - y), OY + H * (x + y) - z]
const f = (n) => +n.toFixed(1)
const pts = (arr) => arr.map(([x, y, z = 0]) => P(x, y, z).map(f).join(',')).join(' ')
function box(x, y, w, d, h, z0 = 0) {
  const z1 = z0 + h
  return {
    top: pts([[x, y, z1], [x + w, y, z1], [x + w, y + d, z1], [x, y + d, z1]]),
    right: pts([[x + w, y, z0], [x + w, y + d, z0], [x + w, y + d, z1], [x + w, y, z1]]),
    left: pts([[x, y + d, z0], [x + w, y + d, z0], [x + w, y + d, z1], [x, y + d, z1]]),
  }
}
function rounded(world, r = 16) {
  const s = world.map(([x, y]) => P(x, y))
  let d = `M${f(s[0][0])},${f(s[0][1])}`
  for (let i = 1; i < s.length - 1; i++) {
    const [px, py] = s[i - 1]
    const [cx, cy] = s[i]
    const [nx, ny] = s[i + 1]
    const l1 = Math.hypot(cx - px, cy - py)
    const l2 = Math.hypot(nx - cx, ny - cy)
    const rr = Math.min(r, l1 / 2, l2 / 2)
    d += ` L${f(cx + ((px - cx) / l1) * rr)},${f(cy + ((py - cy) / l1) * rr)} Q${f(cx)},${f(cy)} ${f(cx + ((nx - cx) / l2) * rr)},${f(cy + ((ny - cy) / l2) * rr)}`
  }
  const e = s[s.length - 1]
  return d + ` L${f(e[0])},${f(e[1])}`
}

/* colours: [left, right, top] */
const SLAB = ['#f3ece8', '#ebe3df', '#fbf8f6']
const AV = ['#b9c0e0', '#8f98c4', '#dfe3f6']
const RS = ['#f2540c', '#c43f06', '#ffb27a']

/* crates on a grid; `res` = indexes drawn as reserved (orange); sorted back-to-front */
function crates(x0, y0, cols, rows, sz, gap, z, res) {
  const out = []
  let k = 0
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++, k++) out.push({ x: x0 + c * (sz + gap), y: y0 + r * (sz + gap), r: res.includes(k) })
  return out
    .sort((a, b) => a.x + a.y - (b.x + b.y))
    .map((c) => ({ b: box(c.x, c.y, sz, sz, sz * 0.8, z), f: c.r ? RS : AV }))
}

const warehouse = box(-300, -140, 200, 160, 10, 0)
const branch = box(-20, -260, 140, 110, 10, 0)
const warehouseCrates = crates(-285, -122, 4, 3, 28, 12, 10, [2, 9])
const branchCrates = crates(-4, -238, 3, 2, 26, 12, 10, [4])

const vanParts = [
  { b: box(40, 28, 190, 76, 6, 0), f: SLAB },
  { b: box(70, 40, 100, 52, 36, 14), f: ['#2b2d45', '#14152b', '#3b3e66'] },
  { b: box(170, 40, 40, 52, 26, 14), f: ['#ff8a3a', '#d9490a', '#ffb27a'] },
]
const wheels = [85, 150, 192].map((x) => P(x, 92, 10).map(f))
const vanCrates = crates(80, 48, 2, 2, 20, 10, 50, [1])

/* location markers */
const rings = [
  { x: f(P(-200, -60, 10)[0]), y: f(P(-200, -60, 10)[1]), rx: 150 },
  { x: f(P(50, -205, 10)[0]), y: f(P(50, -205, 10)[1]), rx: 110 },
  { x: f(P(130, 66, 6)[0]), y: f(P(130, 66, 6)[1]), rx: 120 },
]
const tags = [P(-200, -60, 84), P(50, -205, 74), P(130, 66, 96)].map((p) => p.map(f))

const routeDefs = [
  [[-100, -60], [-60, -60], [-60, -205], [-20, -205]],
  [[-200, 25], [-200, 80], [40, 80]],
  [[50, -150], [50, 40]],
]
const routes = routeDefs.map((r, i) => ({ id: `r${i}`, d: rounded(r) }))

const grid = []
for (let t = -340; t <= 340; t += 68) {
  grid.push(pts([[-340, t], [340, t]]))
  grid.push(pts([[t, -340], [t, 340]]))
}
const plate = pts([[-340, -340], [340, -340], [340, 340], [-340, 340]])
</script>

<style>
.sk {
  --ink: #14152b;
  --mute: #6c7084;
  --line: rgba(20, 21, 43, 0.12);
  --o1: #ff8a3a;
  --o2: #f2540c;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-family: 'Urbanist', system-ui, sans-serif;
  color: var(--ink);
  background:
    radial-gradient(900px 600px at 72% 55%, rgba(255, 138, 58, 0.14), transparent 62%),
    radial-gradient(520px 420px at 0% 0%, rgba(255, 138, 58, 0.06), transparent 60%), #fff;
}
.sk *,
.sk *::before,
.sk *::after {
  box-sizing: border-box;
}
.sk-wrap {
  position: relative;
  max-width: 1360px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px) clamp(20px, 4vw, 40px);
  display: grid;
  grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
  gap: clamp(16px, 3vw, 40px);
  align-items: center;
}
.sk-copy {
  position: relative;
  z-index: 2;
}
.sk-title {
  margin: 0;
  padding-bottom: 0.2em;
  font-family: inherit;
  font-size: clamp(40px, 3.2vw, 64px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.06em;
  color: #0f172a;
}
.sk-title span {
  display: block;
}
.sk-title .sk-g {
  color: #8f94a3 !important;
  -webkit-text-fill-color: #8f94a3 !important;
  background: none !important;
}
.sk-lead {
  margin: 14px 0 0;
  max-width: 42ch;
  font-size: 16px;
  line-height: 1.7;
  color: var(--mute);
}
.sk-tabs {
  display: flex;
  gap: 4px;
  margin-top: 30px;
  border-bottom: 1px solid var(--line);
}
.sk-tabs button {
  position: relative;
  padding: 10px 14px 12px;
  border: 0;
  background: none;
  font: inherit;
  font-size: 14.5px;
  font-weight: 500;
  color: var(--mute);
  cursor: pointer;
  transition: color 0.3s;
}
.sk-tabs button::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: -1px;
  height: 2px;
  background: var(--o1);
  transform: scaleX(0);
  transition: transform 0.4s var(--ease);
}
.sk-tabs button[aria-pressed='true'] {
  color: var(--ink);
}
.sk-tabs button[aria-pressed='true']::after {
  transform: scaleX(1);
}
.sk-tabs button:focus-visible {
  outline: 2px solid var(--o1);
  outline-offset: 2px;
}
.sk-led {
  margin-top: 22px;
}
.sk-led small {
  display: block;
  font-size: 12px;
  color: #8a8ea3;
  letter-spacing: 0.02em;
}
.sk-nums {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 10px;
}
.sk-nums b {
  display: block;
  font-size: clamp(44px, 3.4vw, 58px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.05em;
  font-variant-numeric: tabular-nums;
}
.sk-nums .r b {
  color: var(--o1);
}
.sk-nums span {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.4;
  color: var(--mute);
}
.sk-bar {
  height: 6px;
  margin-top: 20px;
  border-radius: 6px;
  background: #ece6e2;
  overflow: hidden;
}
.sk-bar i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--o1), var(--o2));
  transition: width 0.6s var(--ease);
}
.sk-all {
  margin: 16px 0 0;
  font-size: 13px;
  color: var(--mute);
}
.sk-all b {
  color: var(--ink);
  font-weight: 500;
}

/* ---- scene ---- */
.sk-scene {
  position: relative;
  width: 100%;
  max-width: 540px;
  justify-self: center;
  opacity: 0;
}
.sk-scene.sk-in {
  animation: sk-in 1.1s var(--ease) both;
}
.sk-scene svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
.sk-scene text {
  font-family: inherit;
}
.sk-gr polyline {
  fill: none;
  stroke: #14152b;
  stroke-opacity: 0.07;
}
.sk-plate {
  fill: #fcfaf9;
  stroke: #f1eae6;
  stroke-width: 2;
  stroke-linejoin: round;
}
.sk-road {
  fill: none;
  stroke: #efe8e4;
  stroke-width: 22;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.sk-flow {
  fill: none;
  stroke: #ff8a3a;
  stroke-opacity: 0.75;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-dasharray: 3 11;
  animation: sk-dash 1.3s linear infinite;
}
.sk-loc {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.4s;
}
.sk-loc.on {
  opacity: 1;
}
.sk-lf {
  filter: drop-shadow(0 10px 10px rgba(20, 21, 43, 0.12));
  transition: transform 0.55s var(--ease);
}
.sk-loc.on .sk-lf {
  transform: translateY(-10px);
}
.sk-ring {
  fill: none;
  stroke: #ff8a3a;
  stroke-width: 2;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}
.sk-loc.on .sk-ring {
  animation: sk-ring 2.2s ease-out infinite;
}
.sk-tagbg {
  fill: #fff;
  stroke: #eadfd8;
  transition: fill 0.4s, stroke 0.4s;
}
.sk-loc.on .sk-tagbg {
  fill: url(#sk-og);
  stroke: none;
}
.sk-tn { font-size: 13px; font-weight: 600; fill: var(--ink); }
.sk-tv { font-size: 10.5px; fill: var(--mute); }
.sk-loc.on .sk-tn,
.sk-loc.on .sk-tv { fill: #fff; }

@keyframes sk-in { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: none; } }
@keyframes sk-dash { to { stroke-dashoffset: -28; } }
@keyframes sk-ring { 0% { opacity: 0.8; transform: scale(0.85); } 100% { opacity: 0; transform: scale(1.25); } }

@media (max-width: 960px) {
  .sk-wrap {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
  }
  .sk-scene {
    margin: 0 auto;
    max-width: 480px;
    justify-self: center;
    order: 2;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sk-scene { opacity: 1; }
  .sk-scene.sk-in { animation: none; }
  .sk-flow,
  .sk-loc.on .sk-ring { animation: none; }
  .sk-lf,
  .sk-bar i { transition: none; }
}
</style>
