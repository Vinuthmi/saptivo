<template>
  <section ref="rootEl" class="ra" aria-labelledby="ra-title">
    <div class="ra-wrap">
      <!-- ============ scene + alert card ============ -->
      <div class="ra-scene" :class="{ 'ra-in': revealed }">
        <svg class="ra-svg" :class="{ low }" viewBox="40 20 560 470" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="ra-fd" cx="0.5" cy="0.5" r="0.55">
              <stop offset="0" stop-color="#fff" />
              <stop offset="1" stop-color="#000" />
            </radialGradient>
            <mask id="ra-mk" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="560">
              <rect width="640" height="560" fill="url(#ra-fd)" />
            </mask>
            <filter id="ra-sh" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#14152b" flood-opacity="0.12" />
            </filter>
          </defs>

          <g mask="url(#ra-mk)" class="ra-gr">
            <polyline v-for="(g, i) in grid" :key="i" :points="g" />
          </g>
          <polygon :points="plate" class="ra-plate" />

          <!-- neighbouring items (healthy stock) -->
          <g filter="url(#ra-sh)">
            <g v-for="(p, k) in neighbourA" :key="`a${k}`">
              <polygon :points="p.b.left" :fill="p.f[0]" />
              <polygon :points="p.b.right" :fill="p.f[1]" />
              <polygon :points="p.b.top" :fill="p.f[2]" />
            </g>
          </g>

          <!-- the item being watched -->
          <ellipse class="ra-ring" :cx="c0[0]" :cy="c0[1]" rx="120" ry="66" />
          <g filter="url(#ra-sh)">
            <polygon :points="base.left" :fill="SLAB[0]" />
            <polygon :points="base.right" :fill="SLAB[1]" />
            <polygon :points="base.top" :fill="SLAB[2]" />
          </g>

          <g class="ra-frame">
            <polyline v-for="(p, k) in posts" :key="`po${k}`" :points="p" />
            <polygon :points="frameTop" />
          </g>

          <g v-for="(b, i) in crates" :key="`c${i}`" class="ra-cr" :class="{ gone: i >= n }">
            <polygon class="l" :points="b.left" />
            <polygon class="r" :points="b.right" />
            <polygon class="t" :points="b.top" />
          </g>

          <!-- reorder level plane + label -->
          <polygon class="ra-plane" :points="planePts" />
          <path :d="`M${lp[0]} ${lp[1]}h26`" stroke="#ff8a3a" stroke-width="1.5" />
          <g :transform="`translate(${lp[0] + 26} ${lp[1] - 14})`">
            <rect class="ra-pill" width="136" height="28" rx="14" />
            <text x="68" y="18" text-anchor="middle" class="ra-pt">Reorder level · {{ LEVEL }}</text>
          </g>

          <!-- floating counter -->
          <g class="ra-cnt" :style="{ transform: `translate(${topPt[0]}px, ${topPt[1]}px)` }">
            <g transform="translate(-34 -16)">
              <rect class="ra-cb" width="68" height="26" rx="13" />
              <text x="34" y="17.5" text-anchor="middle" class="ra-ct">{{ n }} on hand</text>
            </g>
          </g>

          <g filter="url(#ra-sh)">
            <g v-for="(p, k) in neighbourB" :key="`b${k}`">
              <polygon :points="p.b.left" :fill="p.f[0]" />
              <polygon :points="p.b.right" :fill="p.f[1]" />
              <polygon :points="p.b.top" :fill="p.f[2]" />
            </g>
          </g>
        </svg>

        <div class="ra-alert" :class="{ 'is-low': low }" aria-live="polite">
          <div class="ra-pane ra-ok">
            <i class="ra-dot"></i>
            <div>
              <b>Above the reorder level</b>
              No alert needed. Saptivo keeps watching.
            </div>
          </div>
          <div class="ra-pane ra-lowp">
            <div class="ra-hd">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10.3 20a1.94 1.94 0 0 0 3.4 0" /></svg>
              <b>Low stock</b>
              <em>Wall bracket kit</em>
            </div>
            <p><b>{{ n }}</b> left, below the reorder level of {{ LEVEL }}.</p>
            <div class="ra-to"><span class="ra-av">PM</span><span>Alert sent to <b>Purchasing</b></span></div>
            <div class="ra-sg" :class="{ chosen }">
              <small>Suggested</small>
              <button
                v-for="s in suggestions"
                :key="s.k"
                type="button"
                :class="{ done: chosen === s.k }"
                @click="chosen = s.k"
              >
                {{ chosen === s.k ? '✓ ' + s.done : s.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ copy + controls ============ -->
      <div class="ra-copy">
        <h2 id="ra-title" class="ra-title">
          <span>Reorder points and</span>
          <span class="ra-g">low-stock alerts</span>
        </h2>
        <p class="ra-lead">
          Set a reorder level for each item. When stock falls below it, Saptivo alerts the right person and suggests a purchase or transfer, so you reorder before customers notice.
        </p>

        <div class="ra-try">
          <label for="ra-rng">
            Try it: drag the stock on hand
            <b>{{ n }} on hand</b>
          </label>
          <div class="ra-rg">
            <input
              id="ra-rng"
              v-model.number="n"
              type="range"
              min="0"
              :max="MAX"
              step="1"
              :style="{ '--p': (n / MAX) * 100 + '%' }"
              @input="stopDemo"
            />
            <span class="ra-tick">reorder level</span>
          </div>

          <ul class="ra-rail">
            <li class="on"><span><b>Reorder level set</b> for this item: {{ LEVEL }}</span></li>
            <li :class="{ on: low }"><span><b>Alert</b> goes to the right person</span></li>
            <li :class="{ on: low }"><span><b>Suggestion:</b> a purchase or a transfer</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeReorderSection' })
/**
 * SectionReorder.vue — "Reorder points and low-stock alerts".
 * An interactive demo: drag the stock on hand; below the reorder level the crates turn orange,
 * an alert card appears and a purchase / transfer is suggested.
 * Item name, level (4) and suggested amounts (20 / 12) are SAMPLE data — replace with real figures.
 * Browser APIs only in onMounted (SSR / Nuxt safe). Respects prefers-reduced-motion.
 */
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const LEVEL = 4
const MAX = 10
const CH = 24

const rootEl = ref(null)
const revealed = ref(false)
const n = ref(7)
const chosen = ref(null)
const low = computed(() => n.value < LEVEL)
watch(low, (v) => {
  if (!v) chosen.value = null
})

const suggestions = [
  { k: 'po', label: 'Purchase order · 20 units', done: 'Purchase order created' },
  { k: 'tr', label: 'Transfer 12 from Warehouse', done: 'Transfer requested' },
]

/* ------------------------------------------------------------------ demo: stock drains 7 → 3 once, in view */
let timer = null
let io = null
function stopDemo() {
  clearInterval(timer)
}
onMounted(() => {
  io = new IntersectionObserver(
    (es) => {
      if (!es[0].isIntersecting) return
      io.disconnect()
      revealed.value = true
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      setTimeout(() => {
        timer = setInterval(() => {
          n.value -= 1
          if (n.value <= 3) clearInterval(timer)
        }, 700)
      }, 1100)
    },
    { threshold: 0.3 },
  )
  io.observe(rootEl.value)
})
onBeforeUnmount(() => {
  io?.disconnect()
  clearInterval(timer)
})

/* ------------------------------------------------------------------ isometric projection */
const S = 0.866
const H = 0.5
const OX = 320
const OY = 390
const P = (x, y, z = 0) => [OX + S * (x - y), OY + H * (x + y) - z]
const f = (v) => +v.toFixed(1)
const pts = (arr) => arr.map(([x, y, z = 0]) => P(x, y, z).map(f).join(',')).join(' ')
function box(x, y, w, d, h, z0 = 0) {
  const z1 = z0 + h
  return {
    top: pts([[x, y, z1], [x + w, y, z1], [x + w, y + d, z1], [x, y + d, z1]]),
    right: pts([[x + w, y, z0], [x + w, y + d, z0], [x + w, y + d, z1], [x + w, y, z1]]),
    left: pts([[x, y + d, z0], [x + w, y + d, z0], [x + w, y + d, z1], [x, y + d, z1]]),
  }
}

const SLAB = ['#f3ece8', '#ebe3df', '#fbf8f6']
const AV = ['#c9d0ec', '#aab2d8', '#e6e9f8']

const grid = []
for (let t = -300; t <= 300; t += 60) {
  grid.push(pts([[-300, t], [300, t]]))
  grid.push(pts([[t, -300], [t, 300]]))
}
const plate = pts([[-250, -250], [250, -250], [250, 250], [-250, 250]])

/* neighbouring items: a pad plus a few crates */
function neighbour(px, py, pw, cx, cy, count, sz) {
  const out = [{ b: box(px, py, pw, pw, 8, 0), f: SLAB }]
  for (let i = 0; i < count; i++) out.push({ b: box(cx, cy, sz, sz, sz * 0.8, 10 + i * (sz * 0.8 + 2)), f: AV })
  return out
}
const neighbourA = neighbour(-205, -45, 60, -195, -35, 5, 38)
const neighbourB = neighbour(120, -25, 56, 129, -16, 3, 38)

/* the watched item: base, glass frame, stack of crates, level plane */
const base = box(-70, -70, 140, 140, 10, 0)
const c0 = P(0, 0, 10).map(f)
const FT = 10 + MAX * CH + 14
const corners = [[-50, -50], [50, -50], [50, 50], [-50, 50]]
const posts = corners.map(([x, y]) => pts([[x, y, 10], [x, y, FT]]))
const frameTop = pts(corners.map(([x, y]) => [x, y, FT]))
const crates = Array.from({ length: MAX }, (_, i) => box(-28, -28, 56, 56, CH - 3, 10 + i * CH))
const pz = 10 + LEVEL * CH - 1
const planePts = pts([[-54, -54, pz], [54, -54, pz], [54, 54, pz], [-54, 54, pz]])
const lp = P(54, 0, pz).map(f)

const topPt = computed(() => P(0, 0, 10 + n.value * CH + 30).map(f))
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.ra {
  --ink: #14152b;
  --mute: #6c7084;
  --line: rgba(20, 21, 43, 0.12);
  --o1: #ff8a3a;
  --o2: #f2540c;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  background:
    radial-gradient(700px 520px at 18% 62%, rgba(255, 138, 58, 0.13), transparent 62%),
    radial-gradient(520px 420px at 100% 0%, rgba(255, 138, 58, 0.05), transparent 60%), #fff;
}
.ra *,
.ra *::before,
.ra *::after {
  box-sizing: border-box;
}
.ra-wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px) clamp(20px, 4vw, 40px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 440px);
  gap: clamp(16px, 3vw, 48px);
  align-items: center;
}

/* ---- copy ---- */
.ra-title {
  margin: 0;
  padding-bottom: 0.2em;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(38px, 3.2vw, 60px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.06em;
  color: #0f172a;
}
.ra-title span {
  display: block;
}
.ra-title .ra-g {
  color: #8f94a3 !important;
  -webkit-text-fill-color: #8f94a3 !important;
  background: none !important;
}
.ra-lead {
  margin: 12px 0 0;
  max-width: 44ch;
  font-size: 16px;
  line-height: 1.7;
  color: var(--mute);
}
.ra-try {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}
.ra-try label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 13px;
  color: var(--mute);
}
.ra-try label b {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.ra-rg {
  position: relative;
  margin-top: 14px;
}
.ra-rg input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  display: block;
  width: 100%;
  height: 22px;
  margin: 0;
  background: none;
  cursor: pointer;
}
.ra-rg input[type='range']::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--o1), var(--o2)) 0 / var(--p) 100% no-repeat, #ece6e2;
}
.ra-rg input[type='range']::-moz-range-track {
  height: 6px;
  border-radius: 6px;
  background: #ece6e2;
}
.ra-rg input[type='range']::-moz-range-progress {
  height: 6px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--o1), var(--o2));
}
.ra-rg input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  margin-top: -8px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--o2);
  box-shadow: 0 6px 12px -4px rgba(242, 84, 12, 0.5);
}
.ra-rg input[type='range']::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--o2);
}
.ra-rg input[type='range']:focus-visible {
  outline: 2px solid var(--o2);
  outline-offset: 6px;
  border-radius: 8px;
}
.ra-tick {
  position: absolute;
  top: 30px;
  left: calc(0.4 * (100% - 22px) + 11px);
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 500;
  color: var(--o2);
  white-space: nowrap;
}
.ra-tick::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -12px;
  width: 1.5px;
  height: 9px;
  background: var(--o2);
  transform: translateX(-50%);
}
.ra-rail {
  list-style: none;
  margin: 38px 0 0;
  padding: 0;
}
.ra-rail li {
  position: relative;
  display: flex;
  gap: 14px;
  padding: 0 0 16px;
  font-size: 14.5px;
  line-height: 1.5;
  color: #a3a6b4;
  transition: color 0.4s;
}
.ra-rail li:last-child {
  padding-bottom: 0;
}
.ra-rail li::before {
  content: '';
  flex: none;
  width: 12px;
  height: 12px;
  margin-top: 5px;
  border-radius: 50%;
  border: 2px solid #d7d9e2;
  background: #fff;
  transition: all 0.4s;
}
.ra-rail li:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 20px;
  bottom: 2px;
  width: 2px;
  background: #ece6e2;
}
.ra-rail li.on {
  color: var(--ink);
}
.ra-rail li.on::before {
  border-color: var(--o2);
  background: var(--o2);
  box-shadow: 0 0 0 4px rgba(242, 84, 12, 0.15);
}
.ra-rail b {
  font-weight: 600;
}

/* ---- scene ---- */
.ra-scene {
  position: relative;
  width: 100%;
  max-width: 420px;
  justify-self: center;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.9s var(--ease), transform 1s var(--ease);
}
.ra-scene.ra-in {
  opacity: 1;
  transform: none;
}
.ra-svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  --cl: #b9c0e0;
  --cr: #8f98c4;
  --ct: #dfe3f6;
}
.ra-svg.low {
  --cl: #f2540c;
  --cr: #c43f06;
  --ct: #ffb27a;
}
.ra-svg text {
  font-family: 'Poppins', system-ui, sans-serif;
}
.ra-gr polyline {
  fill: none;
  stroke: #14152b;
  stroke-opacity: 0.07;
}
.ra-plate {
  fill: #fcfaf9;
  stroke: #f1eae6;
  stroke-width: 2;
  stroke-linejoin: round;
}
.ra-frame {
  fill: none;
  stroke: #e3d9d2;
  stroke-width: 1.5;
  stroke-linejoin: round;
}
.ra-cr {
  transition: opacity 0.35s, transform 0.5s var(--ease);
}
.ra-cr.gone {
  opacity: 0;
  transform: translateY(-34px);
}
.ra-cr .l { fill: var(--cl); }
.ra-cr .r { fill: var(--cr); }
.ra-cr .t { fill: var(--ct); }
.ra-cr .l,
.ra-cr .r,
.ra-cr .t {
  transition: fill 0.5s;
}
.ra-plane {
  fill: rgba(255, 138, 58, 0.14);
  stroke: #ff8a3a;
  stroke-width: 1.5;
  stroke-dasharray: 6 5;
}
.ra-pill { fill: #fff; stroke: #ffd9bf; }
.ra-pt { font-size: 11.5px; font-weight: 600; fill: #b84a0a; }
.ra-cnt { transition: transform 0.5s var(--ease); }
.ra-cb { fill: #14152b; transition: fill 0.4s; }
.ra-svg.low .ra-cb { fill: #f2540c; }
.ra-ct { font-size: 12px; font-weight: 600; fill: #fff; }
.ra-ring {
  fill: none;
  stroke: #ff8a3a;
  stroke-width: 2;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}
.ra-svg.low .ra-ring {
  animation: ra-ring 2s ease-out infinite;
}

/* ---- alert card ---- */
.ra-alert {
  position: relative;
  z-index: 1;
  width: min(300px, 100%);
  margin: -6px auto 0;
  display: grid;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #f0e6df;
  box-shadow: 0 24px 40px -22px rgba(20, 21, 43, 0.35), 0 2px 6px rgba(20, 21, 43, 0.06);
}
.ra-pane {
  grid-area: 1 / 1;
  padding: 16px 16px 14px;
  transition: opacity 0.4s, transform 0.5s var(--ease);
}
.ra-pane.ra-lowp {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}
.ra-alert.is-low .ra-lowp {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.ra-alert.is-low .ra-ok {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}
.ra-ok {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13px;
  line-height: 1.45;
  color: var(--mute);
}
.ra-ok b {
  display: block;
  color: var(--ink);
  font-weight: 600;
  font-size: 13.5px;
}
.ra-dot {
  flex: none;
  width: 9px;
  height: 9px;
  margin-top: 5px;
  border-radius: 50%;
  background: #1fa971;
  box-shadow: 0 0 0 4px rgba(31, 169, 113, 0.15);
}
.ra-hd {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.ra-hd svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform-origin: 50% 10%;
}
.ra-alert.is-low .ra-hd svg {
  animation: ra-bell 1.2s 0.2s ease 2;
}
.ra-hd b {
  padding: 2px 8px;
  border-radius: 999px;
  background: #fff1e8;
  color: #b84a0a;
  font-weight: 600;
}
.ra-hd em {
  margin-left: auto;
  font-style: normal;
  color: var(--mute);
}
.ra-lowp p {
  margin: 10px 0 0;
  font-size: 13.5px;
  line-height: 1.45;
}
.ra-lowp p b {
  font-weight: 600;
}
.ra-to {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 12.5px;
  color: var(--mute);
}
.ra-to b {
  color: var(--ink);
  font-weight: 600;
}
.ra-av {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--ink);
  color: #fff;
  font-size: 9.5px;
  font-weight: 600;
}
.ra-sg {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0e6df;
  display: grid;
  gap: 6px;
}
.ra-sg small {
  font-size: 11px;
  color: #8a8ea3;
}
.ra-sg button {
  padding: 9px 12px;
  border: 1px solid #ffd9bf;
  border-radius: 10px;
  background: #fff8f3;
  font: inherit;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  transition: background 0.25s, border-color 0.25s, opacity 0.3s;
}
.ra-sg button:hover {
  background: #fff1e8;
  border-color: var(--o1);
}
.ra-sg button:focus-visible {
  outline: 2px solid var(--o2);
  outline-offset: 2px;
}
.ra-sg button.done {
  background: #ecfdf3;
  border-color: #bdeccd;
  color: #15803d;
  cursor: default;
}
.ra-sg.chosen button:not(.done) {
  opacity: 0.45;
  pointer-events: none;
}

@keyframes ra-ring { 0% { opacity: 0.8; transform: scale(0.8); } 100% { opacity: 0; transform: scale(1.35); } }
@keyframes ra-bell {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(14deg); }
  40% { transform: rotate(-12deg); }
  60% { transform: rotate(8deg); }
  80% { transform: rotate(-4deg); }
}

@media (max-width: 900px) {
  .ra-wrap {
    grid-template-columns: minmax(0, 1fr);
  }
  .ra-copy {
    order: -1;
  }
  .ra-scene {
    max-width: 360px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ra-scene {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .ra-svg.low .ra-ring,
  .ra-alert.is-low .ra-hd svg {
    animation: none;
  }
  .ra-cr,
  .ra-cnt,
  .ra-pane {
    transition: none;
  }
}
</style>
