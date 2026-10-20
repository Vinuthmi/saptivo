<template>
  <section
    ref="rootEl"
    class="s6"
    :class="{ 's6-js': mounted, 's6-in': revealed }"
    aria-labelledby="s6-title"
  >
    <!-- shared SVG defs: underline gradient + one "silk" lighting filter per slide (same recipe as the other security sections) -->
    <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="s6-ul" x1="0" x2="1">
          <stop offset="0" stop-color="#ffb27f" />
          <stop offset="1" stop-color="#f2540c" />
        </linearGradient>

        <filter
          v-for="(it, i) in items"
          :id="`s6-silk-${i}`"
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

    <div class="s6-panel">
      <!-- ============ heading row ============ -->
      <header class="s6-head">
        <div class="s6-hl">
          <span class="s6-eyebrow"><i></i>03 · Data Protection &amp; Audit</span>
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

      <div class="s6-card">
        <div class="s6-row">
          <article
            v-for="(it, i) in items"
            :id="`s6-p-${it.id}`"
            :key="it.id"
            class="s6-c s6-layer"
            :class="{ on: revealed }"
            :style="{ '--i': i }"
            :aria-label="it.name"
          >
            <div class="s6-bg" :style="{ background: it.bg }" aria-hidden="true">
              <img v-if="it.img" class="s6-photo" :src="it.img" alt="" loading="lazy" draggable="false" />
              <svg class="s6-silk" viewBox="0 0 720 560" preserveAspectRatio="none">
                <rect width="720" height="560" fill="#000" :filter="`url(#s6-silk-${i})`" />
              </svg>
              <svg class="s6-deco" viewBox="0 0 24 24" v-html="icons[it.icon]"></svg>
            </div>
            <div class="s6-scrim" aria-hidden="true"></div>

            <div class="s6-in2">
              <div class="s6-top">
                <span class="s6-tn" aria-hidden="true">{{ it.num }}</span>
                <span class="g-k s6-mk">{{ it.metric[0] }} · {{ it.metric[2] }}</span>
                <span class="s6-ti" aria-hidden="true"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>
              </div>

              <h3 class="s6-ct">{{ it.name }}</h3>
              <p class="s6-cd">{{ it.desc }}</p>
              <ul class="s6-pts">
                <li v-for="p in it.points" :key="p">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9.5" />
                    <path d="m8 12.5 2.8 2.8 5.2-5.6" />
                  </svg>
                  {{ p }}
                </li>
              </ul>

              <!-- product window -->
              <div class="s6-wrap" aria-hidden="true">
              <!-- ===== rate limiting ===== -->
              <div v-if="it.id === 'rate'" class="s6-win">
                <div class="d-bar">
                  <i></i><i></i><i></i>
                  <span><svg viewBox="0 0 24 24" v-html="icons.rate"></svg>POST /api/auth/login</span>
                  <em class="d-live"><b></b>Live</em>
                </div>
                <div class="d-stats">
                  <div v-for="s in rateStats" :key="s.l">
                    <b>{{ s.v }}</b>
                    <span>{{ s.l }}</span>
                  </div>
                </div>
                <div class="d-chart">
                  <span class="d-thr"><em>limit · 60 / min</em></span>
                  <div class="d-bars">
                    <i v-for="(h, k) in bars" :key="k" :class="{ hot: h > 60 }" :style="{ '--h': h + '%', '--k': k }"></i>
                  </div>
                </div>
                <div class="d-lab">
                  <svg viewBox="0 0 24 24" v-html="icons.lock"></svg>
                  Exponential lockout
                </div>
                <div class="d-steps">
                  <span v-for="(s, k) in lockSteps" :key="s.a" :style="{ '--k': k }">
                    <small>{{ s.a }}</small>
                    <b>{{ s.t }}</b>
                  </span>
                </div>
                <div class="d-toast"><i></i>429 · Too Many Requests</div>
              </div>

              <!-- ===== audit trail ===== -->
              <div v-else-if="it.id === 'audit'" class="s6-win">
                <div class="d-bar">
                  <i></i><i></i><i></i>
                  <span><svg viewBox="0 0 24 24" v-html="icons.audit"></svg>Audit trail</span>
                  <em class="d-imm"><svg viewBox="0 0 24 24" v-html="icons.lock"></svg>Immutable</em>
                </div>
                <div class="d-log">
                  <div v-for="(r, k) in auditRows" :key="k" class="d-ev" :style="{ '--k': k }">
                    <span class="d-av" :style="{ '--c': r.c }">{{ r.u }}</span>
                    <div class="d-evm">
                      <p>
                        <b>{{ r.n }}</b> {{ r.a }} <u>{{ r.t }}</u>
                      </p>
                      <span v-if="r.f" class="d-diff"
                        >{{ r.f }}: <s>{{ r.from }}</s> <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg> <strong>{{ r.to }}</strong></span
                      >
                      <span v-else class="d-diff mute">No field changes</span>
                    </div>
                    <div class="d-evt">
                      <code>{{ r.ip }}</code>
                      <span>{{ r.time }}</span>
                    </div>
                  </div>
                </div>
                <div class="d-foot">
                  <span><i></i>4 fields per event · user, action, IP, time</span>
                  <em class="d-export"><svg viewBox="0 0 24 24"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" /></svg>Export</em>
                </div>
                <div class="d-toast"><i></i>audit-log.csv exported</div>
              </div>

              <!-- ===== recycle bin ===== -->
              <div v-else class="s6-win">
                <div class="d-bar">
                  <i></i><i></i><i></i>
                  <span><svg viewBox="0 0 24 24" v-html="icons.bin"></svg>Recycle bin</span>
                  <em class="d-imm"><svg viewBox="0 0 24 24" v-html="icons.restore"></svg>90-day buffer</em>
                </div>
                <div class="d-bin">
                  <div v-for="(r, k) in binRows" :key="k" class="d-item" :class="{ first: k === 0 }" :style="{ '--k': k }">
                    <span class="d-kind">{{ r.kind }}</span>
                    <div class="d-evm">
                      <p>
                        <b>{{ r.n }}</b>
                      </p>
                      <span class="d-left"
                        >Deleted {{ r.ago }} · {{ r.left }} d left
                        <i><b :style="{ width: (r.left / 90) * 100 + '%' }"></b></i
                      ></span>
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
              </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * SectionData.vue — "Data Protection & Audit" (part 03 of the security story, Vue 3, <script setup>)
 *
 * • Three silk cards side by side; each has its copy on top and a live product window underneath.
 * • Widgets animate once when the section scrolls into view; cards lift on hover.
 * • Backgrounds are procedural "silk" (SVG lighting filters). For real photos set `img: '/path/photo.jpg'` on an item.
 *
 * No props. Browser APIs are only used in onMounted / handlers (SSR / Nuxt safe).
 * Everything is namespaced `.s6-` / `.d-` so it can sit on the same page as SectionAuth (`.s4-`) and SectionNetwork (`.s5-`).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)

/* stroke icons — 24px grid */
const icons = {
  rate: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-5"/><path d="M4 16h2M18 16h2"/>',
  audit: '<path d="M7 3.5h7.5l4.5 4.5v12.5H7z"/><path d="M14.5 3.5V8H19M10 12.5h6M10 16h6"/>',
  bin: '<path d="M4.5 7h15M9.5 7V4.5h5V7"/><path d="m6.5 7 .9 12.5h9.2L17.5 7"/><path d="M10 11v5M14 11v5"/>',
  restore: '<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4.5V9h4.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
}

/* silk: [baseFreqX, baseFreqY, seed, lightAzimuth]   metric: [big value, label, small caption] */
const items = [
  {
    id: 'rate',
    num: '11',
    icon: 'rate',
    img: '',
    name: 'Rate Limiting',
    desc: 'Auto-blocks brute-force sign-in attempts.',
    bg: 'linear-gradient(135deg,#ffa05a 0%,#c4480e 50%,#4a1a06 100%)',
    silk: [0.004, 0.0112, 6, 245],
    metric: ['Sliding window', 'Login and API endpoints', 'Throttle'],
    points: [
      'Sliding-window rate limiting on all login and API endpoints',
      'Exponential backoff lockouts upon repeated failed attempts',
      'Blocks distributed credential stuffing before database impact',
    ],
  },
  {
    id: 'audit',
    num: '12',
    icon: 'audit',
    img: '',
    name: 'Audit Trail Logs',
    desc: 'Immutable log of who changed what.',
    bg: 'linear-gradient(135deg,#6aa3e6 0%,#245aa6 50%,#0a1f45 100%)',
    silk: [0.005, 0.009, 19, 215],
    metric: ['Before / after', 'Tracked on leads and quotes', 'Field level'],
    points: [
      'Records user ID, exact action, IP address, and timestamp',
      'Tracks full before/after field changes on leads and quotes',
      'Exportable audit logs for security compliance and forensic review',
    ],
  },
  {
    id: 'bin',
    num: '13',
    icon: 'bin',
    img: '',
    name: 'Soft Delete / Recycle Bin',
    desc: 'One-click restore with zero data loss.',
    bg: 'linear-gradient(135deg,#f6b65a 0%,#d9821c 50%,#7c3a08 100%)',
    silk: [0.0039, 0.0108, 27, 240],
    metric: ['90 days', 'Recovery buffer', 'Zero data loss'],
    points: [
      '90-day recovery buffer for accidentally deleted leads and records',
      'Restores complete relational data trees with one click',
      'Permanent deletion restricted strictly to authorized Admin roles',
    ],
  },
]

/* mock data */
const rateStats = [
  { v: '1,284', l: 'requests / min' },
  { v: '312', l: 'blocked' },
  { v: '60 s', l: 'sliding window' },
]
const bars = [22, 30, 26, 38, 34, 44, 40, 52, 48, 92, 100, 96, 70, 46, 36, 30, 26, 24]
const lockSteps = [
  { a: '3 fails', t: '30 s' },
  { a: '5 fails', t: '5 min' },
  { a: '8 fails', t: '1 hour' },
]
const auditRows = [
  { u: 'NP', c: '#f2540c', n: 'Nimal P.', a: 'edited', t: 'Quote #Q-2041', f: 'Discount', from: '5%', to: '10%', ip: '192.168.4.21', time: '10:42:08' },
  { u: 'SK', c: '#245aa6', n: 'Sara K.', a: 'updated', t: 'Lead #L-318', f: 'Stage', from: 'New', to: 'Won', ip: '10.0.2.57', time: '10:39:51' },
  { u: 'AD', c: '#2b8ca3', n: 'Admin', a: 'exported', t: 'Invoice list', f: '', from: '', to: '', ip: '172.16.0.4', time: '10:31:20' },
  { u: 'RM', c: '#c26a16', n: 'Ravi M.', a: 'deleted', t: 'Lead #L-297', f: 'Status', from: 'Active', to: 'Deleted', ip: '192.168.4.33', time: '10:24:02' },
]
const binRows = [
  { kind: 'Lead', n: 'Kasun Perera', ago: '3 d ago', left: 87 },
  { kind: 'Quote', n: 'Quote #Q-1988', ago: '12 d ago', left: 78 },
  { kind: 'Client', n: 'Lanka Mart (Pvt) Ltd', ago: '41 d ago', left: 49 },
]

/* ------------------------------------------------------------------ lifecycle */
let ioReveal

onMounted(() => {
  mounted.value = true
  // all three cards animate their widgets once the section scrolls into view
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
})
onBeforeUnmount(() => {
  ioReveal?.disconnect()
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
  background:
    radial-gradient(900px 420px at 0% 0%, rgba(255, 122, 26, 0.1), transparent 60%),
    radial-gradient(800px 420px at 100% 100%, rgba(255, 122, 26, 0.09), transparent 60%), var(--page);
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
.s6-eyebrow i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--o1);
  animation: s6-ping 2s infinite;
}
.s6-title {
  margin: 22px 0 0;
  font-size: clamp(30px, 3.6vw, 42px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.025em;
}
.s6-title span {
  display: block;
  font-weight: 300;
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

/* ============ white card ============ */
.s6-card {
  margin-top: clamp(26px, 3.4vw, 40px);
  margin-inline: calc(-1 * clamp(22px, 3.6vw, 48px));
  padding: clamp(14px, 2vw, 22px);
  border-radius: 28px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow:
    0 1px 0 #fff inset,
    0 40px 80px -50px rgba(20, 21, 43, 0.45);
}
.s6-js .s6-card {
  opacity: 0;
  transform: translateY(26px);
}
.s6-js.s6-in .s6-card {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease) 0.15s,
    transform 0.9s var(--ease) 0.15s;
}

/* ============ body ============ */
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
.s6-silk {
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
  right: -34px;
  top: 40px;
  width: 270px;
  height: 270px;
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
    linear-gradient(135deg, rgba(8, 10, 26, 0.5) 0%, rgba(8, 10, 26, 0) 55%),
    linear-gradient(0deg, rgba(8, 10, 26, 0.32), rgba(8, 10, 26, 0) 50%);
}

/* copy content */
.s6-in2 {
  position: absolute;
  inset: 0;
  z-index: 3;
  padding: 24px 26px 22px;
  display: flex;
  flex-direction: column;
}
.s6-in2 > * {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.s6-layer.on .s6-in2 > * {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.6s var(--ease),
    transform 0.8s var(--ease);
}
.s6-layer.on .s6-in2 > :nth-child(2) {
  transition-delay: 0.12s;
}
.s6-layer.on .s6-in2 > :nth-child(3) {
  transition-delay: 0.18s;
}
.s6-layer.on .s6-in2 > :nth-child(4) {
  transition-delay: 0.26s;
}
.s6-layer.on .s6-in2 > :nth-child(5) {
  transition-delay: 0.38s;
}
.s6-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.s6-tn {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--ink);
  font-variant-numeric: tabular-nums;
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
.s6-ct {
  margin: 0;
  font-size: clamp(24px, 2.4vw, 30px);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.s6-cd {
  margin: 8px 0 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}
.s6-pts {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}
.s6-pts li {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  font-size: 12.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.93);
}
.s6-pts svg {
  flex: none;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  fill: rgba(255, 255, 255, 0.18);
  stroke: #fff;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.s6-g {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.34);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: 0 24px 40px -26px rgba(8, 10, 26, 0.6);
}
.g-ic {
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.92);
}
.g-ic svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.g-main {
  flex: 1;
  min-width: 0;
  display: grid;
}
.g-main b {
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.g-main em {
  font-style: normal;
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.82);
}
.g-k {
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 9.5px;
  font-weight: 500;
  white-space: nowrap;
}

/* ============ product window ============ */
.s6-win {
  position: relative;
  width: 100%;
  padding: 0 0 26px;
  border-radius: 20px;
  background: #fff;
  box-shadow:
    0 0 0 1px rgba(20, 21, 43, 0.05),
    0 40px 60px -34px rgba(20, 21, 43, 0.55);
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0;
  transform: translateY(22px) scale(0.97);
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.s6-layer.on .s6-win {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.7s var(--ease) 0.2s,
    transform 0.9s var(--ease) 0.2s;
}
.s6-win > :not(.d-bar):not(.d-toast) {
  margin-inline: 16px;
}
.d-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 42px;
  padding: 0 14px;
  border-bottom: 1px solid var(--line);
}
.d-bar > i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e6e3de;
}
.d-bar > span {
  margin-left: 8px;
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-2);
  white-space: nowrap;
}
.d-bar > span svg {
  flex: none;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.d-bar > em {
  margin-left: auto;
  font-style: normal;
}
.d-live,
.d-imm {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 9.5px;
  font-weight: 700;
}
.d-live {
  background: #ecfdf3;
  color: #15803d;
}
.d-live b {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.s6-layer.on .d-live b {
  animation: s6-blink 1.6s ease-in-out infinite;
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

/* toast (floats over the window corner) */
.d-toast {
  position: absolute;
  right: -10px;
  bottom: -14px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
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
.d-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.d-stats div {
  padding: 8px 10px;
  border-radius: 12px;
  background: #f7f6f4;
}
.d-stats b {
  display: block;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.d-stats div:nth-child(2) b {
  color: #c2262b;
}
.d-stats span {
  font-size: 9.5px;
  color: var(--muted);
}
.d-chart {
  position: relative;
  height: 100px;
  border-radius: 12px;
  background: #f7f6f4;
  padding: 8px 10px 0;
}
.d-thr {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(60% * 0.84 + 0px);
  border-top: 1.5px dashed rgba(194, 38, 43, 0.55);
}
.d-thr em {
  position: absolute;
  right: 8px;
  top: -16px;
  font-style: normal;
  font-size: 8.5px;
  font-weight: 700;
  color: #c2262b;
}
.d-bars {
  height: 100%;
  display: flex;
  align-items: flex-end;
  gap: 4px;
}
.d-bars i {
  flex: 1;
  height: calc(var(--h) * 0.84);
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
.d-lab {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--ink-2);
}
.d-lab svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.d-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.d-steps span {
  position: relative;
  display: grid;
  gap: 1px;
  padding: 8px 10px;
  border-radius: 12px;
  background: var(--peach);
  border: 1px solid var(--peach-2);
}
.d-steps small {
  font-size: 9.5px;
  color: #b84a0a;
}
.d-steps b {
  font-size: 14px;
  font-weight: 600;
  color: var(--o2);
}
.s6-layer.on .d-steps span {
  animation: s6-pop 0.55s var(--ease) both;
  animation-delay: calc(1.1s + var(--k) * 0.18s);
}

/* audit trail */
.d-log {
  display: grid;
  gap: 6px;
}
.d-ev {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
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
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--c);
  color: #fff;
  font-size: 9.5px;
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
  font-size: 11px;
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
  font-size: 9.5px;
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
.d-diff.mute {
  background: transparent;
  border-color: transparent;
  padding-left: 0;
}
.d-evt {
  flex: none;
  display: grid;
  gap: 2px;
  text-align: right;
}
.d-evt code {
  font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
  font-size: 9.5px;
  color: var(--ink-2);
}
.d-evt span {
  font-size: 9.5px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.d-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 10px;
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
  padding: 4px 11px;
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
.d-bin {
  display: grid;
  gap: 6px;
}
.d-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 12px;
  background: #f7f6f4;
  min-width: 0;
}
.d-kind {
  flex: none;
  min-width: 46px;
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
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9.5px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.d-left i {
  flex: 1;
  min-width: 24px;
  max-width: 70px;
  height: 3px;
  border-radius: 3px;
  background: rgba(20, 21, 43, 0.1);
  overflow: hidden;
}
.d-left i b {
  display: block;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--o1), var(--o2));
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
  padding: 5px 11px;
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
@keyframes s6-ping {
  70% {
    box-shadow: 0 0 0 8px rgba(255, 122, 26, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 122, 26, 0);
  }
}
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

/* ============ three-card row ============ */
.s6-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(10px, 1.4vw, 16px);
}
.s6-c.s6-layer {
  /* the shared layer rules are for stacked layers; here each layer is a normal grid cell */
  position: relative;
  inset: auto;
  opacity: 1;
  visibility: visible;
  min-width: 0;
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  border-radius: 24px;
  background: #14152b;
  color: #fff;
  transition:
    transform 0.6s var(--ease),
    box-shadow 0.6s var(--ease);
}
.s6-c::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 6;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
  pointer-events: none;
}
.s6-c.s6-layer:hover {
  transform: translateY(-4px);
  box-shadow: 0 34px 50px -30px rgba(20, 21, 43, 0.6);
}
.s6-js .s6-c.s6-layer {
  opacity: 0;
  transform: translateY(26px);
}
.s6-js.s6-in .s6-c.s6-layer {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease) calc(var(--i) * 0.09s + 0.2s),
    transform 0.9s var(--ease) calc(var(--i) * 0.09s + 0.2s),
    box-shadow 0.6s var(--ease);
}
.s6-js.s6-in .s6-c.s6-layer:hover {
  transform: translateY(-4px);
  transition-delay: 0s;
}
.s6-c .s6-in2 {
  position: relative;
  inset: auto;
  min-height: 640px;
  padding: 22px 22px 24px;
}
.s6-c .s6-top {
  gap: 8px;
  margin-bottom: 16px;
}
.s6-mk {
  margin-right: auto;
  margin-left: 4px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid rgba(255, 255, 255, 0.28);
}
.s6-c .s6-ct {
  font-size: clamp(22px, 2vw, 26px);
}
.s6-c .s6-cd {
  font-size: 13.5px;
}
.s6-c .s6-pts {
  margin-top: 14px;
  gap: 9px;
}
.s6-c .s6-pts li {
  font-size: 12px;
}
.s6-wrap {
  margin-top: auto;
  padding-top: 18px;
  display: flex;
  min-height: 252px;
}
.s6-wrap .s6-win {
  margin: 0;
  flex: 1;
}
/* compact windows */
.s6-c .d-stats,
.s6-c .d-lab,
.s6-c .d-foot,
.s6-c .d-ev:nth-child(n + 4),
.s6-c .d-evt code,
.s6-c .d-left i {
  display: none;
}
.s6-c .d-chart {
  height: 84px;
}
.s6-c .d-toast {
  right: 10px;
  bottom: -12px;
}

/* ============ responsive ============ */
@media (max-width: 1060px) {
  .s6-row {
    grid-template-columns: 1fr;
  }
  .s6-c.s6-layer,
  .s6-c .s6-in2 {
    min-height: 0;
  }
  .s6-c .s6-in2 {
    padding: 22px 22px 30px;
  }
  .s6-wrap {
    max-width: 520px;
  }
  .s6-head {
    grid-template-columns: minmax(0, 1fr) minmax(0, 300px);
    gap: 24px 28px;
  }
}
@media (max-width: 760px) {
  .s6-head {
    grid-template-columns: 1fr;
  }
  .s6-c .s6-in2 {
    padding: 20px 18px 28px;
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
  .s6-js .s6-card,
  .s6-js .s6-panel {
    opacity: 1;
    transform: none;
  }
}
</style>