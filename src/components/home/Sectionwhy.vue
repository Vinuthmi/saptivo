<template>
  <section class="wx" aria-labelledby="wx-title">
    <div class="wx-wrap">
      <!-- ============ isometric stack ============ -->
      <div class="wx-art" aria-hidden="true">
        <svg class="wx-svg" :class="{ 'wx-go': mounted }" viewBox="0 0 640 560" focusable="false">
          <defs>
            <linearGradient id="wx-cr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#f2540c" />
              <stop offset="1" stop-color="#d9490a" />
            </linearGradient>
            <radialGradient id="wx-fd" cx="0.5" cy="0.5" r="0.55">
              <stop offset="0" stop-color="#fff" />
              <stop offset="1" stop-color="#000" />
            </radialGradient>
            <radialGradient id="wx-gw" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stop-color="#ff8a3a" stop-opacity="0.42" />
              <stop offset="1" stop-color="#ff8a3a" stop-opacity="0" />
            </radialGradient>
            <mask id="wx-mk" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="560">
              <rect width="640" height="560" fill="url(#wx-fd)" />
            </mask>
            <filter id="wx-sh" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#14152b" flood-opacity="0.12" />
            </filter>
          </defs>

          <!-- floor -->
          <g mask="url(#wx-mk)" class="wx-grid">
            <polyline v-for="(g, i) in grid" :key="i" :points="g" />
          </g>
          <polygon :points="plate" class="wx-plate" />
          <ellipse :cx="glow[0]" :cy="glow[1] + 10" rx="210" ry="115" fill="url(#wx-gw)" />

          <!-- Weblook plinth -->
          <g class="wx-drop" style="--d: 0.1s">
            <g filter="url(#wx-sh)">
              <polygon :points="plinth.left" fill="#f3ece8" />
              <polygon :points="plinth.right" fill="#ebe3df" />
              <polygon :points="plinth.top" fill="#fbf8f6" stroke="#f0e9e5" stroke-width="1.5" />
            </g>
            <ellipse class="wx-ring" :cx="glow[0]" :cy="glow[1] + 6" rx="130" ry="72" />
            <g :transform="mtx(-140, -140, 16)">
              <text x="140" y="270" text-anchor="middle" class="wx-sm" style="font-size: 11px">Weblook International, since 1997</text>
            </g>
          </g>

          <!-- slabs, bottom first -->
          <g v-for="s in drawOrder" :key="s.i" class="wx-drop" :style="{ '--d': 0.3 + (N - 1 - s.i) * 0.16 + 's' }">
            <g
              class="wx-slab"
              :class="{ on: active === s.i }"
              @pointerenter="active = s.i"
              @click="active = s.i"
            >
              <g class="wx-lift">
                <g filter="url(#wx-sh)">
                  <polygon :points="s.b.left" class="f-l" />
                  <polygon :points="s.b.right" class="f-r" />
                  <polygon :points="s.b.top" class="f-t" />
                </g>

                <g :transform="mtx(-110, -110, s.z1)" class="wx-cnt">
                  <!-- 1 · fees -->
                  <template v-if="s.i === 0">
                    <text x="110" y="118" text-anchor="middle" class="wx-big">LKR 0</text>
                    <text x="110" y="138" text-anchor="middle" class="wx-sm">setup and upgrade fees</text>
                  </template>

                  <!-- 2 · WhatsApp + 3CX -->
                  <template v-else-if="s.i === 1">
                    <g transform="translate(70 112)">
                      <circle r="23" fill="#25d366" />
                      <path d="M-10 11 -8 4a11 11 0 1 1 4 4z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" transform="scale(1.05)" />
                      <path d="M-4 -4q0 6 7 8l2-2-3-2-1.5 1q-2-1-3-3l1-1.5-2-3z" fill="#fff" />
                    </g>
                    <text x="110" y="117" text-anchor="middle" class="wx-sm" style="font-size: 16px">+</text>
                    <g transform="translate(150 112)">
                      <circle r="23" fill="#14152b" />
                      <path :d="phone" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="translate(-12 -12)" />
                    </g>
                  </template>

                  <!-- 3 · currencies + VAT -->
                  <template v-else-if="s.i === 2">
                    <rect x="22" y="98" width="52" height="24" rx="12" fill="#fff" stroke="#e7dfda" />
                    <text x="48" y="114" text-anchor="middle" class="wx-pl">LKR</text>
                    <rect x="82" y="98" width="52" height="24" rx="12" fill="#fff" stroke="#e7dfda" />
                    <text x="108" y="114" text-anchor="middle" class="wx-pl">USD</text>
                    <rect x="142" y="98" width="56" height="24" rx="12" fill="#f2540c" />
                    <text x="170" y="114" text-anchor="middle" class="wx-pl" fill="#fff" style="fill: #fff">+ VAT</text>
                  </template>

                  <!-- 4 · local support -->
                  <template v-else>
                    <g transform="translate(62 112)">
                      <circle r="22" fill="#fff" stroke="#14152b" stroke-width="2.2" />
                      <path d="M0 -12V0l8 5" fill="none" stroke="#f2540c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <text x="98" y="110" class="wx-pl" style="font-size: 13px">Your</text>
                    <text x="98" y="126" class="wx-pl" style="font-size: 13px">time zone</text>
                  </template>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <!-- ============ copy ============ -->
      <div class="wx-copy">
        <h2 id="wx-title" class="wx-title">
          <span>Why businesses</span>
          <span class="wx-g">choose Saptivo.</span>
        </h2>

        <ul class="wx-list" aria-label="Why choose Saptivo">
          <li v-for="(it, n) in items" :key="it.k" :class="{ on: active === n }">
            <button
              type="button"
              :aria-expanded="active === n"
              @click="active = n"
              @pointerenter="active = n"
              @focus="active = n"
            >
              <span class="wx-k">{{ it.k }}</span>
              <span class="wx-d"><span>{{ it.d }}</span></span>
            </button>
          </li>
        </ul>

        <dl class="wx-facts">
          <p>Backed by <b>Weblook International</b></p>
          <div v-for="s in stats" :key="s.l">
            <dt>{{ s.n }}</dt>
            <dd>{{ s.l }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeWhySection' })
/**
 * SectionWhy.vue — "Why choose Saptivo" (companion to SectionHero / "How Saptivo works").
 * Same isometric projection, palette and Poppins type as the hero.
 * A stack of four slabs sits on a Weblook plinth; hover / click / focus a reason and its
 * slab lifts and lights up. One entrance (the stack drops in), no autoplay.
 * Browser APIs only in onMounted (SSR / Nuxt safe). Respects prefers-reduced-motion.
 */
import { ref, computed, onMounted } from 'vue'

const mounted = ref(false)
const active = ref(0)

const items = [
  { k: 'No setup fee, no upgrade fees', d: 'On every plan. Start without a setup fee and move up without an upgrade fee.' },
  { k: 'WhatsApp Business API and 3CX built in', d: 'Both are part of Saptivo from day one, not bolted on afterwards.' },
  { k: 'Quotations and invoices in your currency', d: 'Send quotes and invoices in LKR, USD and other currencies, with VAT included.' },
  { k: 'Local onboarding and support', d: 'Get set up and get help from a team in your time zone.' },
]
const stats = [
  { n: '1997', l: 'founded' },
  { n: '10', l: 'in-house products' },
  { n: '1,000+', l: 'brands worldwide' },
]
const N = items.length
const phone = 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'

/* ------------------------------------------------------------------ isometric projection (same as SectionHero) */
const S = 0.866
const H = 0.5
const OX = 320
const OY = 325
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
  }
}

const plinth = box(-140, -140, 280, 280, 16, 0)
const slabs = items.map((_, i) => {
  const z0 = 32 + (N - 1 - i) * 62
  return { i, z1: z0 + 24, b: box(-110, -110, 220, 220, 24, z0) }
})
const drawOrder = computed(() => slabs.slice().reverse()) // bottom slab first

const grid = []
for (let t = -300; t <= 300; t += 60) {
  grid.push(pts([[-300, t], [300, t]]))
  grid.push(pts([[t, -300], [t, 300]]))
}
const plate = pts([[-170, -170], [170, -170], [170, 170], [-170, 170]])
const glow = P(0, 0, 0).map(f)

onMounted(() => {
  mounted.value = true
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.wx {
  --ink: #14152b;
  --ink-2: #2b2d45;
  --mute: #6c7084;
  --line: rgba(20, 21, 43, 0.1);
  --o1: #ff8a3a;
  --o2: #f2540c;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  background:
    radial-gradient(700px 520px at 14% 70%, rgba(255, 138, 58, 0.12), transparent 62%),
    radial-gradient(560px 400px at 100% 0%, rgba(255, 138, 58, 0.05), transparent 60%), #fff;
}
.wx *,
.wx *::before,
.wx *::after {
  box-sizing: border-box;
}
.wx-wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px) clamp(20px, 4vw, 40px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 460px);
  gap: clamp(16px, 3vw, 48px);
  align-items: center;
}
.wx-art {
  max-width: 660px;
  width: 100%;
}
.wx-svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
.wx-svg text {
  font-family: 'Poppins', system-ui, sans-serif;
}

/* ---- copy ---- */
.wx-title {
  margin: 0;
  padding-bottom: 0.2em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(42px, 3.5vw, 104px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.06em;
  color: #0f172a;
}
.wx-title span {
  display: block;
}
.wx-g {
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  padding-bottom: 0.08em;
}
.wx-list {
  list-style: none;
  margin: 22px 0 0;
  padding: 0;
  border-top: 1px solid var(--line);
}
.wx-list li {
  border-bottom: 1px solid var(--line);
}
.wx-list button {
  position: relative;
  display: block;
  width: 100%;
  padding: 16px 8px 16px 24px;
  border: 0;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
  color: var(--mute);
}
.wx-list button::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: -1px;
  width: 3px;
  background: linear-gradient(180deg, var(--o1), var(--o2));
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.45s var(--ease);
}
.wx-list li.on button::before {
  transform: scaleY(1);
}
.wx-list button:focus-visible {
  outline: 2px solid var(--o2);
  outline-offset: -2px;
}
.wx-k {
  display: block;
  font-size: 16.5px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--ink-2);
}
.wx-list li.on .wx-k {
  color: var(--ink);
  font-weight: 600;
}
.wx-d {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s var(--ease);
}
.wx-d > span {
  overflow: hidden;
  font-size: 14.5px;
  line-height: 1.6;
  opacity: 0;
  transition: opacity 0.3s;
}
.wx-list li.on .wx-d {
  grid-template-rows: 1fr;
}
.wx-list li.on .wx-d > span {
  opacity: 1;
  padding-top: 6px;
  transition-delay: 0.12s;
}
.wx-facts {
  margin: 28px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 0;
}
.wx-facts p {
  flex: 0 0 100%;
  margin: 0 0 10px;
  font-size: 14px;
  color: var(--mute);
}
.wx-facts p b {
  color: var(--ink);
  font-weight: 600;
}
.wx-facts div {
  padding: 0 22px 0 0;
  margin-right: 22px;
  border-right: 1px solid var(--line);
}
.wx-facts div:last-child {
  border: 0;
  margin: 0;
  padding: 0;
}
.wx-facts dt {
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.wx-facts dd {
  margin: 3px 0 0;
  font-size: 12.5px;
  color: var(--mute);
  line-height: 1.35;
}

/* ---- scene ---- */
.wx-grid polyline {
  fill: none;
  stroke: #14152b;
  stroke-opacity: 0.07;
}
.wx-plate {
  fill: #fcfaf9;
  stroke: #f1eae6;
  stroke-width: 2;
  stroke-linejoin: round;
}
.wx-slab {
  cursor: pointer;
}
.wx-lift {
  transition: transform 0.55s var(--ease);
}
.wx-slab.on .wx-lift {
  transform: translateY(-22px);
}
.wx-svg .f-l { fill: #f3ece8; transition: fill 0.4s; }
.wx-svg .f-r { fill: #ebe3df; transition: fill 0.4s; }
.wx-svg .f-t { fill: #fff; stroke: #f3ece8; stroke-width: 1.2; transition: fill 0.4s; }
.wx-slab.on .f-l { fill: #ff8a3a; }
.wx-slab.on .f-r { fill: url(#wx-cr); }
.wx-slab.on .f-t { fill: #fff2e8; }
.wx-slab:not(.on):hover .f-t { fill: #fff8f3; }
.wx-cnt {
  opacity: 0.5;
  transition: opacity 0.4s;
}
.wx-slab.on .wx-cnt {
  opacity: 1;
}
.wx-ring {
  fill: none;
  stroke: #ff9a4c;
  stroke-width: 2;
  transform-box: fill-box;
  transform-origin: center;
  animation: wx-ring 2.4s ease-out infinite;
}
.wx-big { font-size: 32px; font-weight: 600; fill: #f2540c; letter-spacing: -0.03em; }
.wx-sm { font-size: 10.5px; font-weight: 500; fill: #6c7084; }
.wx-pl { font-size: 11.5px; font-weight: 600; fill: var(--ink); }

/* the one entrance: plinth, then slabs drop in from the top */
.wx-drop {
  opacity: 0;
}
.wx-go .wx-drop {
  animation: wx-drop 0.9s var(--ease) forwards;
  animation-delay: var(--d);
}

@keyframes wx-drop { from { opacity: 0; transform: translateY(-46px); } to { opacity: 1; transform: none; } }
@keyframes wx-ring { 0% { opacity: 0.7; transform: scale(0.8); } 100% { opacity: 0; transform: scale(1.35); } }

@media (max-width: 900px) {
  .wx-wrap {
    grid-template-columns: minmax(0, 1fr);
  }
  .wx-art {
    max-width: 540px;
    justify-self: center;
    order: 2;
  }
}
@media (prefers-reduced-motion: reduce) {
  .wx-go .wx-drop { animation: none; opacity: 1; }
  .wx-drop { opacity: 1; }
  .wx-ring { animation: none; opacity: 0; }
  .wx-lift, .wx-d { transition: none; }
}
</style>
