<template>
  <section
    ref="rootEl"
    class="s5"
    :class="{ 's5-js': mounted, 's5-in': revealed }"
    aria-labelledby="s5-title"
  >
    <!-- shared SVG defs: underline gradient + one "silk" lighting filter per slide (same recipe as the Authentication section) -->
    <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="s5-ul" x1="0" x2="1">
          <stop offset="0" stop-color="#ffb27f" />
          <stop offset="1" stop-color="#f2540c" />
        </linearGradient>
        <linearGradient id="s5-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ef4444" stop-opacity="0.38" />
          <stop offset="1" stop-color="#ef4444" stop-opacity="0" />
        </linearGradient>

        <filter
          v-for="(it, i) in items"
          :id="`s5-silk-${i}`"
          :key="`f${i}`"
          x="0"
          y="0"
          width="100%"
          height="100%"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence type="fractalNoise" :baseFrequency="`${it.silk[0]} ${it.silk[1]}`" numOctaves="2" :seed="it.silk[2]" result="a" />
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.014" numOctaves="2" :seed="it.silk[2] + 11" result="b" />
          <feDisplacementMap in="a" in2="b" scale="190" xChannelSelector="R" yChannelSelector="G" result="w" />
          <feDiffuseLighting in="w" surfaceScale="13" diffuseConstant="1.05" lighting-color="#ffffff" result="d">
            <feDistantLight :azimuth="it.silk[3]" elevation="40" />
          </feDiffuseLighting>
          <feSpecularLighting in="w" surfaceScale="13" specularConstant="0.6" specularExponent="24" lighting-color="#ffffff" result="s">
            <feDistantLight :azimuth="it.silk[3]" elevation="40" />
          </feSpecularLighting>
          <feComposite in="d" in2="s" operator="arithmetic" k1="0" k2="1" k3="0.75" k4="0" />
        </filter>
      </defs>
    </svg>

    <div class="s5-panel">
      <!-- ============ heading row ============ -->
      <header class="s5-head">
        <div class="s5-hl">
          <span class="s5-eyebrow"><i></i>02 · Network &amp; Infrastructure</span>
          <h2 id="s5-title" class="s5-title">
            Network &amp;
            <span>
              <b
                >Infrastructure<svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 11 C 30 3, 52 15, 84 8 S 146 3, 170 9 C 182 12, 192 8, 198 6" /></svg
              ></b>
            </span>
          </h2>
        </div>

        <div class="s5-hr">
          <p class="s5-sub">
            Traffic is filtered, absorbed and encrypted at the edge — before a single request reaches your Saptivo workspace.
          </p>
        </div>
      </header>

      <div class="s5-grid">
        <!-- ============ left: visual stage ============ -->
        <div class="s5-stage" @pointerenter="paused = true" @pointerleave="paused = false">
          <div
            v-for="(it, i) in items"
            :key="it.id"
            class="s5-layer"
            :class="{ on: active === i }"
            :style="{ '--i': i }"
            :aria-hidden="active === i ? undefined : 'true'"
          >
            <div class="s5-bg" :style="{ background: it.bg }" aria-hidden="true">
              <img v-if="it.img" class="s5-photo" :src="it.img" alt="" loading="lazy" draggable="false" />
              <svg class="s5-silk" viewBox="0 0 720 560" preserveAspectRatio="none">
                <rect width="720" height="560" fill="#000" :filter="`url(#s5-silk-${i})`" />
              </svg>
              <svg class="s5-deco" viewBox="0 0 24 24" v-html="icons[it.icon]"></svg>
            </div>
            <div class="s5-scrim" aria-hidden="true"></div>

            <div class="s5-top" aria-hidden="true">
              <span class="s5-tn">{{ it.num }}</span>
              <span class="s5-ti"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>
            </div>

            <!-- glass metric widget -->
            <div class="s5-w s5-w2" aria-hidden="true">
              <div class="g-top">
                <span class="g-ic"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>
                <span class="g-k">{{ it.metric[2] }}</span>
              </div>
              <div class="g-big">{{ it.metric[0] }}</div>
              <div class="g-l">{{ it.metric[1] }}</div>
              <div class="g-tags">
                <span v-for="t in it.tags" :key="t">{{ t }}</span>
              </div>
            </div>

            <!-- white "product UI" widget -->
            <div class="s5-w s5-w1" aria-hidden="true">
              <template v-if="it.id === 'waf'">
                <div class="n-h">
                  <svg viewBox="0 0 24 24" class="n-i" v-html="icons.shield"></svg>
                  Firewall · live requests
                  <span class="n-live"><i></i>Live</span>
                </div>
                <div class="n-log">
                  <div v-for="(r, k) in wafRows" :key="k" class="n-row" :style="{ '--k': k }">
                    <em>{{ r.m }}</em>
                    <code>{{ r.p }}</code>
                    <span class="n-tag" :class="r.ok ? 'g' : 'r'">{{ r.s }}</span>
                  </div>
                </div>
                <div class="n-foot"><i></i>Edge rules updated 2 min ago</div>
              </template>

              <template v-else-if="it.id === 'ddos'">
                <div class="n-h">
                  <svg viewBox="0 0 24 24" class="n-i" v-html="icons.pulse"></svg>
                  Traffic · last 60 s
                  <span class="n-live"><i></i>Live</span>
                </div>
                <div class="n-chart">
                  <svg viewBox="0 0 240 86" preserveAspectRatio="none">
                    <path class="gl" d="M0 22H240M0 44H240M0 66H240" />
                    <path class="area" d="M0 70 L38 68 L66 66 L88 16 L108 8 L130 20 L150 60 L180 68 L240 68 V86 H0Z" fill="url(#s5-area)" />
                    <path class="atk" pathLength="100" d="M0 70 L38 68 L66 66 L88 16 L108 8 L130 20 L150 60 L180 68 L240 68" />
                    <path class="clean" d="M0 72 H240" />
                    <line class="scan" x1="0" y1="0" x2="0" y2="86" />
                  </svg>
                  <span class="n-flag">Attack absorbed</span>
                </div>
                <div class="n-pills">
                  <span class="n-pill g"><i></i>Mitigated</span>
                  <span class="n-pill">L3</span>
                  <span class="n-pill">L4</span>
                  <span class="n-pill">L7</span>
                </div>
              </template>

              <template v-else>
                <div class="n-url">
                  <svg viewBox="0 0 24 24" v-html="icons.lock"></svg>
                  <span><b>https://</b>app.saptivo.com</span>
                  <em>TLS 1.3</em>
                </div>
                <ol class="n-steps">
                  <li v-for="(s, k) in handshake" :key="s" :style="{ '--k': k }">
                    <i><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg></i>
                    <span>{{ s }}</span>
                  </li>
                </ol>
                <div class="n-pills">
                  <span class="n-pill g"><i></i>HSTS enforced</span>
                  <span class="n-pill">Forward secrecy</span>
                </div>
              </template>
            </div>
          </div>

        </div>

        <!-- ============ right: list with progress ============ -->
        <ul
          ref="listEl"
          class="s5-list"
          role="group"
          aria-label="Network and infrastructure protections"
          @pointerenter="paused = true"
          @pointerleave="paused = false"
          @focusin="paused = true"
          @focusout="paused = false"
          @keydown="onKey"
        >
          <li v-for="(it, i) in items" :key="it.id" class="s5-item" :class="{ on: active === i }" :style="{ '--i': i }">
            <button
              type="button"
              class="s5-ib"
              :aria-expanded="active === i"
              :aria-controls="`s5-p-${it.id}`"
              @click="select(i)"
              @pointerenter="onEnter(i, $event)"
              @pointerleave="onLeave"
            >
              <span class="s5-ico"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>
              <span class="s5-it">{{ it.name }}</span>
              <span class="s5-num">{{ it.num }}</span>
            </button>
            <p class="s5-id">{{ it.desc }}</p>
            <div :id="`s5-p-${it.id}`" class="s5-more" role="region" :aria-label="it.name">
              <div>
                <ul class="s5-pts">
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
            <span class="s5-line" aria-hidden="true"><i :style="{ width: active === i ? progress * 100 + '%' : '0%' }"></i></span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * SectionNetwork.vue — "Network & Infrastructure" (part 02 of the security story, Vue 3, <script setup>)
 *
 * • Left: a silk-gradient stage whose floating product widgets cross-fade per protection.
 * • Right: three protections with an orange progress line. The active one opens its 3 proof points.
 * • Auto-plays every ~6.5s while in view (pauses on hover/focus). Click, hover (mouse), ← → ↑ ↓ or the notched arrow switch slides.
 * • Backgrounds are procedural "silk" (SVG lighting filters). For real photos set `img: '/path/photo.jpg'` on an item.
 *
 * No props. Browser APIs are only used in onMounted / handlers (SSR / Nuxt safe).
 * Everything is namespaced `.s5-` / `.n-` so it can sit on the same page as SectionAuth (`.s4-`).
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
  shield: '<path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.1 7.5 9.5 4.4-1.4 7.5-5.1 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  pulse: '<path d="M3 12h3.2l2.3-6 4 12 2.4-6H21"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14.5v2.5"/>',
}

/* silk: [baseFreqX, baseFreqY, seed, lightAzimuth]   metric: [big value, label, small caption] */
const items = [
  {
    id: 'waf',
    num: '08',
    icon: 'shield',
    img: '',
    name: 'Cloudflare WAF Protection',
    desc: 'Blocks SQLi, XSS, and web exploits.',
    bg: 'linear-gradient(135deg,#ffb27c 0%,#f2540c 50%,#7a2204 100%)',
    silk: [0.0042, 0.0105, 5, 235],
    metric: ['OWASP', 'Top 10 inspected on every request', 'Web firewall'],
    tags: ['SQLi', 'XSS'],
    points: [
      'Inspects inbound HTTP traffic against OWASP Top 10 vulnerabilities',
      'Blocks automated SQL injections, XSS, and malicious payloads',
      'Global edge rules updated continuously against zero-day exploits',
    ],
  },
  {
    id: 'ddos',
    num: '09',
    icon: 'pulse',
    img: '',
    name: 'DDoS Mitigation',
    desc: 'Cloudflare absorbs volumetric flood attacks.',
    bg: 'radial-gradient(60% 45% at 78% 12%, rgba(255,122,26,.45), transparent 62%), linear-gradient(135deg,#505377 0%,#25274a 55%,#0d0e22 100%)',
    silk: [0.0048, 0.0095, 17, 225],
    metric: ['320+ Tbps', 'Global Anycast edge capacity', 'Cloudflare'],
    tags: ['99.99% uptime', 'L3 · L4 · L7'],
    points: [
      "Backed by Cloudflare's 320+ Tbps global Anycast edge capacity",
      'Neutralizes Layer 3, 4, and 7 volumetric flood attacks instantly',
      'Maintains 99.99% application availability during cyber incidents',
    ],
  },
  {
    id: 'tls',
    num: '10',
    icon: 'lock',
    img: '',
    name: 'HTTPS / TLS 1.3',
    desc: 'End-to-end encryption on all data.',
    bg: 'linear-gradient(135deg,#86d6dc 0%,#2b8ca3 50%,#0e475f 100%)',
    silk: [0.0046, 0.0098, 33, 220],
    metric: ['TLS 1.3', 'Modern cryptographic standard in transit', 'Encryption'],
    tags: ['Forward secrecy', 'HSTS'],
    points: [
      'Encrypted in transit using modern TLS 1.3 cryptographic standard',
      'Perfect Forward Secrecy ensures past sessions remain uncompromised',
      'Strict Transport Security (HSTS) prevents SSL-strip downgrade attacks',
    ],
  },
]

/* mock data */
const wafRows = [
  { m: 'GET', p: "/products?id=1' OR 1=1", s: 'SQLi', ok: false },
  { m: 'POST', p: '/search?q=<script>', s: 'XSS', ok: false },
  { m: 'GET', p: '/api/inventory', s: 'Allowed', ok: true },
  { m: 'GET', p: '/../../etc/passwd', s: 'Exploit', ok: false },
]
const handshake = ['ClientHello · TLS 1.3', 'X25519 key exchange', 'Encrypted tunnel ready']

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
  if (!dir || !e.target.classList?.contains('s5-ib')) return
  e.preventDefault()
  const n = (active.value + dir + items.length) % items.length
  select(n)
  await nextTick()
  listEl.value?.querySelectorAll('.s5-ib')[n]?.focus()
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
/* ============ tokens (identical to the Authentication section) ============ */
.s5 {
  --ink: #14152b;
  --ink-2: #2b2d45;
  --muted: #6c7084;
  --line: rgba(20, 21, 43, 0.08);
  --o1: #ff7a1a;
  --o2: #f2540c;
  --peach: #fff1e7;
  --peach-2: #ffe4d2;
  --page: #f2f1ee;
  --surface: #fbfaf8; /* panel colour — the stage notch must match it exactly */
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(36px, 6vw, 84px) clamp(12px, 4vw, 40px);
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  background:
    radial-gradient(900px 420px at 0% 0%, rgba(255, 122, 26, 0.1), transparent 60%),
    radial-gradient(800px 420px at 100% 100%, rgba(255, 122, 26, 0.09), transparent 60%), var(--page);
}
.s5 *,
.s5 *::before,
.s5 *::after {
  box-sizing: border-box;
}
.s5 svg {
  display: block;
}

/* ============ panel ============ */
.s5-panel {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(22px, 3.6vw, 48px);
}
.s5-js .s5-panel {
  opacity: 0;
  transform: translateY(24px);
}
.s5-js.s5-in .s5-panel {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease),
    transform 0.9s var(--ease);
}

/* ============ heading row ============ */
.s5-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 360px);
  gap: 28px 48px;
  align-items: end;
}
.s5-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--line);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-2);
  box-shadow: 0 6px 18px -10px rgba(20, 21, 43, 0.25);
}
.s5-eyebrow i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--o1);
  animation: s5-ping 2s infinite;
}
.s5-title {
  margin: 22px 0 0;
  font-size: clamp(30px, 3.6vw, 42px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.025em;
}
.s5-title span {
  display: block;
  font-weight: 300;
}
.s5-title b {
  position: relative;
  font-weight: 500;
}
.s5-title b svg {
  position: absolute;
  left: -3%;
  bottom: -0.16em;
  width: 106%;
  height: 0.28em;
  overflow: visible;
}
.s5-title b path {
  fill: none;
  stroke: url(#s5-ul);
  stroke-width: 3.2;
  stroke-linecap: round;
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
  transition: stroke-dashoffset 1.3s 0.6s var(--ease);
}
.s5-in .s5-title b path {
  stroke-dashoffset: 0;
}
.s5-sub {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--muted);
}
/* ============ grid ============ */
.s5-grid {
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
.s5-stage {
  container-type: inline-size;
  position: relative;
  height: 470px;
  overflow: hidden;
  isolation: isolate;
  border-radius: 28px;
  background: #14152b;
  color: #fff;
}
.s5-js .s5-stage {
  opacity: 0;
  transform: translateY(26px);
}
.s5-js.s5-in .s5-stage {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease) 0.15s,
    transform 0.9s var(--ease) 0.15s;
}
.s5-stage::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 6;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
  pointer-events: none;
}
.s5-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.8s var(--ease),
    visibility 0s 0.8s;
}
.s5-layer.on {
  opacity: 1;
  visibility: visible;
  transition:
    opacity 0.8s var(--ease),
    visibility 0s;
}
.s5-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.s5-silk {
  /* fixed size + centred so the heavy filter is rasterised once */
  position: absolute;
  left: 50%;
  top: 0;
  width: 720px;
  height: 560px;
  transform: translateX(-50%);
  mix-blend-mode: soft-light;
  opacity: 0.95;
  pointer-events: none;
}
.s5-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.45;
  mix-blend-mode: luminosity;
}
.s5-deco {
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
.s5-layer.on .s5-deco {
  opacity: 0.16;
  transform: rotate(-4deg);
  transition-delay: 0.25s;
}
.s5-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(135deg, rgba(8, 10, 26, 0.5) 0%, rgba(8, 10, 26, 0) 55%),
    linear-gradient(0deg, rgba(8, 10, 26, 0.32), rgba(8, 10, 26, 0) 50%);
}

/* top-left badge row */
.s5-top {
  position: absolute;
  left: 24px;
  top: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.s5-tn {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.s5-ti {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
}
.s5-ti svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* widgets */
.s5-w {
  position: absolute;
  opacity: 0;
  transform: translateY(22px) scale(0.97);
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.s5-layer.on .s5-w {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.7s var(--ease),
    transform 0.9s var(--ease);
}
.s5-layer.on .s5-w1 {
  transition-delay: 0.2s;
}
.s5-layer.on .s5-w2 {
  transition-delay: 0.38s;
}
.s5-w1 {
  left: 24px;
  bottom: 24px;
  width: min(340px, calc(100% - 48px));
  padding: 15px 16px 14px;
  border-radius: 22px;
  background: #fff;
  color: var(--ink);
  box-shadow: 0 30px 50px -26px rgba(8, 10, 26, 0.75);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 3;
}
.s5-w2 {
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
  .s5-w2 {
    display: none;
  }
}
.g-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.g-ic {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.9);
}
.g-ic svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.g-k {
  font-size: 10.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}
.g-big {
  margin-top: auto;
  font-size: 28px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
  white-space: nowrap;
}
.g-l {
  margin-top: 5px;
  font-size: 10.5px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.82);
}
.g-tags {
  margin-top: 9px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.g-tags span {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 9.5px;
  font-weight: 500;
  white-space: nowrap;
}

/* ============ list (right) ============ */
.s5-list {
  margin: 0;
  padding: clamp(0px, 3vw, 34px) 0 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}
.s5-js .s5-item {
  opacity: 0;
  transform: translateY(22px);
}
.s5-js.s5-in .s5-item {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease),
    transform 0.9s var(--ease);
  transition-delay: calc(var(--i) * 0.09s + 0.25s);
}
.s5-item {
  position: relative;
  padding: 22px 0 24px;
}
.s5-item:first-child {
  padding-top: 0;
}
.s5-item:last-child {
  padding-bottom: 0;
}
.s5-ib {
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
.s5-ib:focus-visible {
  outline: 2px solid var(--o1);
  outline-offset: 4px;
}
.s5-ico {
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
.s5-ico svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.4s;
}
.s5-item.on .s5-ico {
  background: linear-gradient(145deg, var(--o1), var(--o2));
  border-color: transparent;
  box-shadow: 0 10px 18px -8px rgba(242, 84, 12, 0.7);
  transform: scale(1.06);
}
.s5-item.on .s5-ico svg {
  stroke: #fff;
}
.s5-it {
  flex: 1;
  min-width: 0;
  font-size: clamp(17px, 1.7vw, 20px);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--ink-2);
  transition: color 0.4s;
}
.s5-item.on .s5-it,
.s5-ib:hover .s5-it {
  color: var(--ink);
}
.s5-num {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(20, 21, 43, 0.06);
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  transition:
    background 0.4s,
    color 0.4s;
}
.s5-item.on .s5-num {
  background: var(--ink);
  color: #fff;
}
.s5-id {
  margin: 10px 0 0 46px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--muted);
}
.s5-more {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.6s var(--ease);
}
.s5-more > div {
  overflow: hidden;
  min-height: 0;
}
.s5-item.on .s5-more {
  grid-template-rows: 1fr;
}
.s5-pts {
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
.s5-item.on .s5-pts {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.6s var(--ease) 0.2s,
    transform 0.7s var(--ease) 0.2s;
}
.s5-pts li {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ink-2);
}
.s5-pts svg {
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
.s5-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--line);
  overflow: hidden;
}
.s5-item:last-child .s5-line {
  display: none;
}
.s5-line i {
  display: block;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--o1), var(--o2));
  transition: width 0.1s linear;
}

/* ============ widget internals ============ */
.n-h {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-2);
}
.n-i {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.n-live {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #ecfdf3;
  color: #15803d;
  font-size: 9.5px;
}
.n-live i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.s5-layer.on .n-live i,
.s5-layer.on .n-pill i,
.s5-layer.on .n-foot i {
  animation: s5-blink 1.6s ease-in-out infinite;
}

/* waf */
.n-log {
  display: grid;
  gap: 5px;
}
.n-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 9px;
  background: #f7f6f4;
  min-width: 0;
}
.n-row em {
  flex: none;
  width: 34px;
  font-style: normal;
  font-size: 9px;
  font-weight: 700;
  color: var(--muted);
}
.n-row code {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
  font-size: 10px;
  color: var(--ink);
}
.s5-layer.on .n-row {
  animation: s5-in 0.55s var(--ease) both;
  animation-delay: calc(0.55s + var(--k) * 0.14s);
}
.n-tag {
  flex: none;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 700;
}
.n-tag.r {
  background: #fff0f0;
  color: #c2262b;
}
.n-tag.g {
  background: #ecfdf3;
  color: #15803d;
}
.n-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9.5px;
  color: var(--muted);
}
.n-foot i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--o1);
}

/* pills */
.n-pills {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.n-pill {
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
.n-pill i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.n-pill.g {
  color: #15803d;
  background: #ecfdf3;
}

/* ddos chart */
.n-chart {
  position: relative;
  height: 96px;
  border-radius: 12px;
  background: #f7f6f4;
  overflow: hidden;
}
.n-chart svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.n-chart .gl {
  stroke: rgba(20, 21, 43, 0.07);
  stroke-width: 1;
  fill: none;
  vector-effect: non-scaling-stroke;
}
.n-chart .atk {
  fill: none;
  stroke: #ef4444;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  vector-effect: non-scaling-stroke;
}
.n-chart .area {
  opacity: 0;
}
.n-chart .clean {
  fill: none;
  stroke: var(--o2);
  stroke-width: 2.4;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
.n-chart .scan {
  stroke: rgba(20, 21, 43, 0.35);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  vector-effect: non-scaling-stroke;
}
.s5-layer.on .n-chart .atk {
  animation: s5-draw 2.2s 0.6s var(--ease) forwards;
}
.s5-layer.on .n-chart .area {
  animation: s5-fade 1s 1.6s forwards;
}
.s5-layer.on .n-chart .scan {
  animation: s5-scan 4.8s linear infinite;
}
.n-flag {
  position: absolute;
  right: 8px;
  top: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 10px -4px rgba(20, 21, 43, 0.3);
  font-size: 9px;
  font-weight: 700;
  color: #c2262b;
}

/* tls */
.n-url {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 8px 0 11px;
  border-radius: 999px;
  background: #f4f2ef;
  font-size: 11px;
  color: var(--ink);
}
.n-url svg {
  flex: none;
  width: 14px;
  height: 14px;
  fill: none;
  stroke: #15803d;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.n-url span {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.n-url b {
  font-weight: 500;
  color: #15803d;
}
.n-url em {
  font-style: normal;
  padding: 2px 8px;
  border-radius: 999px;
  background: linear-gradient(145deg, var(--o1), var(--o2));
  color: #fff;
  font-size: 9.5px;
  font-weight: 700;
}
.n-steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 7px;
}
.n-steps li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
  font-weight: 500;
}
.n-steps i {
  flex: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--peach);
  border: 1px solid var(--peach-2);
}
.n-steps svg {
  width: 10px;
  height: 10px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.s5-layer.on .n-steps li {
  animation: s5-in 0.55s var(--ease) both;
  animation-delay: calc(0.6s + var(--k) * 0.45s);
}
.s5-layer.on .n-steps i {
  animation: s5-pop 0.5s var(--ease) both;
  animation-delay: calc(0.75s + var(--k) * 0.45s);
}

/* ============ keyframes ============ */
@keyframes s5-ping {
  70% {
    box-shadow: 0 0 0 8px rgba(255, 122, 26, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 122, 26, 0);
  }
}
@keyframes s5-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes s5-pop {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes s5-blink {
  50% {
    opacity: 0.3;
  }
}
@keyframes s5-draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes s5-fade {
  to {
    opacity: 1;
  }
}
@keyframes s5-scan {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(240px);
  }
}

/* ============ responsive ============ */
@media (max-width: 960px) {
  .s5-head {
    grid-template-columns: minmax(0, 1fr) minmax(0, 300px);
    gap: 24px 28px;
  }
  .s5-grid {
    grid-template-columns: 1fr;
  }
  .s5-list {
    padding-top: 0;
  }
  .s5-stage {
    height: 440px;
  }
}
@media (max-width: 760px) {
  .s5-head {
    grid-template-columns: 1fr;
  }
  .s5-stage {
    height: 420px;
    border-radius: 24px;
  }
  .s5-w1 {
    left: 16px;
    bottom: 16px;
    width: calc(100% - 32px);
  }
  .s5-top {
    left: 16px;
    top: 16px;
  }
  .s5-deco {
    width: 200px;
    height: 200px;
  }
  .s5-id,
  .s5-pts {
    margin-left: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .s5 *,
  .s5 *::before,
  .s5 *::after {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
    transition-delay: 0s !important;
  }
  .s5-js .s5-stage,
  .s5-js .s5-item,
  .s5-js .s5-panel {
    opacity: 1;
    transform: none;
  }
}
</style>