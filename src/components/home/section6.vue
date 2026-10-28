<template>
  <section
    ref="rootEl"
    class="s4"
    :class="{ 's4-js': mounted, 's4-in': revealed }"
    aria-labelledby="s4-security-title"
  >
    <!-- shared SVG defs: underline and timer ring gradients -->
    <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="s4-ul" x1="0" x2="1">
          <stop offset="0" stop-color="#ffb27f" />
          <stop offset="1" stop-color="#f2540c" />
        </linearGradient>
        <linearGradient id="s4-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffb27c" />
          <stop offset="1" stop-color="#f2540c" />
        </linearGradient>
      </defs>
    </svg>

    <header class="s4-security-intro">
      <h2 id="s4-security-title" class="s4-security-title">
        Your data is protected. <span>Period.</span>
      </h2>
      <p class="s4-security-sub">
        Every layer of Saptivo is hardened with multi-factor authentication, real-time threat detection, and enterprise infrastructure security — so your business data never sleeps unguarded.
      </p>
    </header>

    <NetworkSection />

    <!-- ============ Authentication & Access — same design as Network & Infrastructure ============ -->
    <div ref="authEl" class="s4a" :class="{ 's4a-in': authIn }" aria-labelledby="s4-title">
      <div class="s4a-panel">
        <!-- heading row -->
        <header class="s4a-head">
          <div class="s4a-hl">
            <h2 id="s4-title" class="s4a-title">
              Authentication
              <span>
                &amp;
                <b
                  >Access<svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 11 C 30 3, 52 15, 84 8 S 146 3, 170 9 C 182 12, 192 8, 198 6" /></svg
                ></b>
              </span>
            </h2>
          </div>
        </header>

        <div class="s4a-grid">
          <!-- ============ left: visual stage ============ -->
          <div class="s4a-stage" @pointerenter="paused = true" @pointerleave="paused = false">
            <div
              v-for="(it, i) in items"
              :key="it.id"
              class="s4a-layer"
              :class="{ on: active === i }"
              :style="{ '--i': i }"
              :aria-hidden="active === i ? undefined : 'true'"
            >
              <div class="s4a-bg" :style="{ background: it.bg }" aria-hidden="true">
                <img v-if="it.img" class="s4a-photo" :src="it.img" alt="" loading="lazy" draggable="false" />
                <svg class="s4a-deco" viewBox="0 0 24 24" v-html="icons[it.icon]"></svg>
              </div>
              <div class="s4a-scrim" aria-hidden="true"></div>

              <div class="s4a-top" aria-hidden="true">
                <span class="s4a-ti"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>
              </div>

              <!-- glass metric widget -->
              <div class="s4a-w s4a-w2" aria-hidden="true">
                <div class="ag-top">
                  <span class="ag-ic"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>
                  <span class="ag-k">{{ it.metric[2] }}</span>
                </div>
                <div class="ag-big">{{ it.metric[0] }}</div>
                <div class="ag-l">{{ it.metric[1] }}</div>
                <div class="ag-tags">
                  <span v-for="t in it.tags" :key="t">{{ t }}</span>
                </div>
              </div>

              <!-- white "product UI" widget -->
              <div class="s4a-w s4a-w1" :class="{ wrong: wrong && it.id === 'captcha' }" aria-hidden="true">
                <template v-if="it.id === 'otp'">
                  <div class="m-h"><i class="m-dot"></i>Saptivo · SMS<em class="m-sep">Your login code</em></div>
                  <div class="m-code sm">
                    <span v-for="(d, k) in ['4', '8', '2', '9', '1', '7']" :key="k" :style="{ '--k': k }">{{ d }}</span>
                  </div>
                  <span class="m-pill g"><i></i>Delivered &lt; 3s</span>
                  <hr class="m-hr" />
                  <div class="m-h">
                    <svg viewBox="0 0 24 24" class="m-i" v-html="icons.mail"></svg>
                    Verify your change<em class="m-sep">Email code</em>
                  </div>
                  <div class="m-code sm">
                    <span v-for="(d, k) in ['3', '0', '6', '5', '8', '1']" :key="k" :style="{ '--k': k + 6 }">{{ d }}</span>
                  </div>
                  <span class="m-pill o"><i></i>Expires in 10 min</span>
                </template>

                <template v-else-if="it.id === 'captcha'">
                  <p class="m-t b">Select all circles</p>
                  <div class="m-tiles six">
                    <span v-for="(t, k) in tiles" :key="k" class="tile" :class="{ on: t === 'c' }" :style="{ '--k': k }">
                      <svg viewBox="0 0 24 24">
                        <circle v-if="t === 'c'" cx="12" cy="12" r="6.5" />
                        <rect v-else-if="t === 's'" x="6" y="6" width="12" height="12" rx="2" />
                        <path v-else d="M12 5.5 19 18H5z" />
                      </svg>
                      <em v-if="t === 'c'"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg></em>
                    </span>
                  </div>
                  <hr class="m-hr" />
                  <p class="m-t b">Or prove you're human</p>
                  <div class="m-eq">
                    <b :key="eqIdx">{{ equations[eqIdx] }} =</b>
                    <span class="m-box"><i class="m-caret"></i></span>
                    <span class="m-btn">Verify</span>
                  </div>
                  <span class="m-pill" :class="wrong ? 'r' : 'g'">
                    <i></i>{{ wrong ? 'Invalid · new equation' : 'No third-party CDN' }}
                  </span>
                </template>

                <template v-else-if="it.id === 'rbac'">
                  <div v-for="r in roles" :key="r.n" class="m-role">
                    <b>{{ r.n }}</b>
                    <span class="m-perms">
                      <em v-for="(p, k) in ['R', 'E', 'D', 'X']" :key="p" :class="{ on: r.p[k] }">{{ p }}</em>
                    </span>
                  </div>
                  <span class="m-pill">Read · Edit · Delete · Export</span>
                </template>

                <template v-else-if="it.id === 'timeout'">
                  <div class="m-row">
                    <div class="m-ring">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" class="bg" />
                        <circle cx="50" cy="50" r="42" class="fg" stroke="url(#s4-ring)" />
                      </svg>
                      <b>15:00</b>
                    </div>
                    <div class="m-col">
                      <p class="m-t b">Still there?</p>
                      <p class="m-t">Session ends in 0:30</p>
                      <span class="m-pill o"><i></i>Auto logout</span>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div class="m-row">
                    <svg viewBox="0 0 64 64" class="m-fp">
                      <circle v-for="(r, k) in [6, 11, 16, 21, 26]" :key="r" cx="32" cy="32" :r="r" :style="{ '--k': k }" :stroke-dasharray="k % 2 ? '14 6 30 8' : '22 5 12 7'" />
                      <circle cx="32" cy="32" r="2.2" class="core" />
                    </svg>
                    <div class="m-col">
                      <p class="m-t b">New device detected</p>
                      <p class="m-t">Windows · Chrome</p>
                    </div>
                  </div>
                  <div class="m-pills">
                    <span class="m-pill r"><i></i>Challenged</span>
                    <span class="m-pill">Admin notified</span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- ============ right: list with progress ============ -->
          <ul
            ref="listEl"
            class="s4a-list"
            role="group"
            aria-label="Authentication and access controls"
            @pointerenter="paused = true"
            @pointerleave="paused = false"
            @focusin="paused = true"
            @focusout="paused = false"
            @keydown="onKey"
          >
            <li v-for="(it, i) in items" :key="it.id" class="s4a-item" :class="{ on: active === i }" :style="{ '--i': i }">
              <button
                type="button"
                class="s4a-ib"
                :aria-expanded="active === i"
                :aria-controls="`s4a-p-${it.id}`"
                @click="select(i)"
              >
                <span class="s4a-ico"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>
                <span class="s4a-it">{{ it.name }}</span>
              </button>
              <p class="s4a-id">{{ it.desc }}</p>
              <div :id="`s4a-p-${it.id}`" class="s4a-more" role="region" :aria-label="it.name">
                <div>
                  <ul class="s4a-pts">
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
              <span class="s4a-line" aria-hidden="true"><i :style="{ width: active === i ? progress * 100 + '%' : '0%' }"></i></span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <DataProtectionSection />
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeSecuritySection' })

import NetworkSection from './section7.vue'
import DataProtectionSection from './section8.vue'

/**
 * SectionSecurity.vue — "Your data is protected. Period." (Vue 3, <script setup>)
 *
 * Contains the Network & Infrastructure section, the Authentication & Access section and the
 * Data Protection & Audit section.
 *
 * Authentication & Access now uses the same design as Network & Infrastructure:
 * • Left: a gradient stage whose floating product widgets cross-fade per protection.
 * • Right: five protections with an orange progress line. The active one opens its description and 3 proof points.
 * • Auto-plays every ~6.5s while in view (pauses on hover/focus). Click a row, or use ← → ↑ ↓, to switch.
 * • Backgrounds use layered gradients. For real photos set `img: '/path/photo.jpg'` on an item.
 *
 * No props. Browser APIs are only used in onMounted / handlers (SSR / Nuxt safe).
 */
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const rootEl = ref(null)
const authEl = ref(null)
const listEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
const authIn = ref(false)
const active = ref(0)
const progress = ref(0)
const paused = ref(false)

/* stroke icons — 24px grid */
const icons = {
  sms: '<path d="M4 5h16v11H9.5L5 20v-4H4z"/><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.7"/><path d="m4 17 5-4.5 3.5 3 3-2.5 4.5 4"/>',
  math: '<rect x="3.5" y="3" width="17" height="18" rx="3"/><path d="M12 7v6M9 10h6M9 17h6"/>',
  roles: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16.5 6.2a3 3 0 0 1 0 5.6M18 14c2 .6 3.2 2.4 3.2 5"/>',
  timer: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4l2.5 1.5M9.5 3h5"/>',
  finger: '<path d="M12 3.5a7.5 7.5 0 0 0-7.5 7.5v2"/><path d="M12 7.5A3.5 3.5 0 0 0 8.5 11v3a7 7 0 0 1-1.8 4.7"/><path d="M12 11v3.5a10 10 0 0 1-2.2 6.2"/><path d="M15.5 20.5A12 12 0 0 0 17.5 14v-3a5.5 5.5 0 0 0-1-3.1"/><path d="M15 11v3a9 9 0 0 1-.9 4"/><path d="M19.5 12.5V11A7.5 7.5 0 0 0 17 5.4"/>',
}

/* ------------------------------------------------------------------ content
   metric: [big value, label, small caption] */
const cardPalette = 'radial-gradient(60% 55% at 96% 4%,rgba(252,222,224,.95) 0%,transparent 70%),radial-gradient(60% 50% at 6% 96%,rgba(252,236,210,.95) 0%,transparent 72%),linear-gradient(140deg,#fff7ef 0%,#fdeee6 50%,#fce9e6 100%)'

const items = [
  {
    id: 'otp', icon: 'sms', img: '',
    name: 'SMS & Email OTP',
    desc: 'One-time codes by SMS on every login and by email for sensitive changes.',
    bg: cardPalette,
    metric: ['< 3s', 'SMS gateway delivery', 'Dual OTP'],
    tags: ['Auto failover', 'Single-use'],
    points: [
      'SMS code arrives in under 3 seconds, with a backup route',
      'Email code for password, email and banking changes',
      'Single-use codes that expire in minutes',
    ],
  },
  {
    id: 'captcha', icon: 'image', img: '',
    name: 'Image & Math Captcha',
    desc: 'Image and math challenges that keep bots out.',
    bg: cardPalette,
    metric: ['0 ms', 'External CDN latency', 'Self-hosted'],
    tags: ['Blocks bots', 'Auto-rotates'],
    points: [
      'Picture challenge blocks automated sign-ins',
      'Simple math check with no third-party service',
      'New equation after every wrong answer',
    ],
  },
  {
    id: 'rbac', icon: 'roles', img: '',
    name: 'Role-Based Access Control',
    desc: 'Each staff member sees only what their role allows.',
    bg: cardPalette,
    metric: ['3 roles', 'SuperAdmin · Manager · Staff', 'Permissions'],
    tags: ['Per-module', 'PII restricted'],
    points: [
      'Roles for SuperAdmin, Manager and Staff',
      'Read, edit, delete and export set per module',
      'Financial and customer data kept to approved roles',
    ],
  },
  {
    id: 'timeout', icon: 'timer', img: '',
    name: 'Session Timeout Lock',
    desc: 'Idle sessions log out automatically.',
    bg: cardPalette,
    metric: ['15 min', 'Default inactivity timer', 'Configurable'],
    tags: ['Warning modal', 'Token revoke'],
    points: [
      'Inactivity timer, 15 minutes by default',
      'Countdown warning before logout',
      'Access is revoked on unattended screens',
    ],
  },
  {
    id: 'device', icon: 'finger', img: '',
    name: 'Device Fingerprinting',
    desc: 'Unknown devices are flagged and challenged.',
    bg: cardPalette,
    metric: ['3 signals', 'Hardware · canvas · OS', 'Fingerprint'],
    tags: ['Admin alerts', 'Instant challenge'],
    points: [
      'Recognises each device by its hardware, browser and OS',
      'Asks for extra verification on new devices',
      'Alerts your administrators',
    ],
  },
]

/* mock data */
const tiles = ['c', 's', 'c', 't', 'c', 's']
const roles = [
  { n: 'SuperAdmin', p: [1, 1, 1, 1] },
  { n: 'Manager', p: [1, 1, 0, 1] },
  { n: 'Staff', p: [1, 0, 0, 0] },
]
const equations = ['7 + 4', '12 − 5', '3 × 6', '9 + 8']
const eqIdx = ref(0)
const wrong = ref(false)

/* ------------------------------------------------------------------ interaction */
const AUTOPLAY_MS = 6500
const TICK = 80
let inView = false

function select(i) {
  if (i === active.value) return
  active.value = i
  progress.value = 0
}
function next() {
  select((active.value + 1) % items.length)
}
async function onKey(e) {
  const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
  if (!dir || !e.target.classList?.contains('s4a-ib')) return
  e.preventDefault()
  const n = (active.value + dir + items.length) % items.length
  select(n)
  await nextTick()
  listEl.value?.querySelectorAll('.s4a-ib')[n]?.focus()
}

/* ------------------------------------------------------------------ lifecycle */
const timers = new Set()
let ioReveal, ioAuth

onMounted(() => {
  mounted.value = true
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ioReveal = new IntersectionObserver(
    (es, o) => {
      if (es[0].isIntersecting) {
        revealed.value = true
        o.disconnect()
      }
    },
    { threshold: 0.05 },
  )
  ioReveal.observe(rootEl.value)

  // the Authentication block reveals (and plays) only when it is itself on screen
  ioAuth = new IntersectionObserver(
    (es) => {
      inView = es[0].isIntersecting
      if (inView) authIn.value = true
    },
    { threshold: 0.12 },
  )
  ioAuth.observe(authEl.value)

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

    // math captcha demo: wrong entry → equation rotates (only while that item is active)
    const mc = setInterval(() => {
      if (items[active.value].id !== 'captcha' || !inView) return
      wrong.value = true
      const t = setTimeout(() => {
        eqIdx.value = (eqIdx.value + 1) % equations.length
        wrong.value = false
      }, 900)
      timers.add(t)
    }, 3600)
    timers.add(mc)
  }
})
onBeforeUnmount(() => {
  ioReveal?.disconnect()
  ioAuth?.disconnect()
  timers.forEach((t) => {
    clearInterval(t)
    clearTimeout(t)
  })
})
</script>

<style>
/* ============ tokens ============ */
.s4 {
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
  padding: clamp(72px, 8vw, 112px) clamp(18px, 4vw, 40px) clamp(76px, 8.5vw, 120px);
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
}
.s4 *,
.s4 *::before,
.s4 *::after {
  box-sizing: border-box;
}
.s4 svg {
  display: block;
}

/* embedded sections: share this section's background and width */
.s4 > .s5 {
  max-width: 1240px;
  margin: clamp(30px, 4vw, 48px) auto clamp(56px, 7vw, 96px);
  padding: 0;
  background: none;
  overflow: visible;
}
.s4 > .s5 .s5-panel {
  max-width: none;
  padding: 0;
}
.s4 > .s5 .s5-grid {
  margin-inline: 0;
  padding: 24px;
}
.s4 > .s6 {
  max-width: 1240px;
  margin: clamp(56px, 7vw, 96px) auto 0;
  padding: 0;
  background: none;
  overflow: visible;
}
.s4 > .s6 .s6-panel {
  max-width: none;
  padding: 0;
}
.s4 > .s6 .s6-grid {
  margin-inline: 0;
  padding: 24px;
}

/* ============ "Your data is protected" intro ============ */
.s4-security-intro {
  max-width: 1240px;
  margin: 0 auto;
  text-align: center;
}
.s4-security-title {
  margin: 18px 0 0;
  padding-bottom: 0.2em;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(46px, 3.5vw, 104px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.06em;
  color: #0f172a;
}
.s4-security-title span {
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.s4-security-sub {
  max-width: 820px;
  margin: 14px auto 0;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: #475569;
}

/* =====================================================================
   Authentication & Access — same design as Network & Infrastructure
   (namespaced .s4a- / .ag- ; the widget internals keep their .m- names)
   ===================================================================== */
.s4a {
  max-width: 1240px;
  margin: 0 auto;
}
.s4a-panel {
  padding: 0;
}
.s4-js .s4a-panel {
  opacity: 0;
  transform: translateY(24px);
}
.s4-js .s4a-in .s4a-panel {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease),
    transform 0.9s var(--ease);
}

/* ---------- heading row ---------- */
.s4a-head {
  display: block;
}
.s4a-title {
  margin: 22px 0 0;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(20px, 2vw, 42px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.025em;
  white-space: nowrap;
}
.s4a-title span {
  display: inline;
  font-weight: 500;
}
.s4a-title b {
  position: relative;
  font-weight: 500;
}
.s4a-title b svg {
  position: absolute;
  left: -3%;
  bottom: -0.16em;
  width: 106%;
  height: 0.28em;
  overflow: visible;
}
.s4a-title b path {
  fill: none;
  stroke: url(#s4-ul);
  stroke-width: 3.2;
  stroke-linecap: round;
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
  transition: stroke-dashoffset 1.3s 0.6s var(--ease);
}
.s4a-in .s4a-title b path {
  stroke-dashoffset: 0;
}
/* ---------- grid ---------- */
.s4a-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(0, 1fr);
  gap: clamp(26px, 4vw, 56px);
  align-items: start;
  margin-top: clamp(26px, 3.4vw, 40px);
  padding: 24px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow:
    0 1px 0 #fff inset,
    0 40px 80px -50px rgba(20, 21, 43, 0.45);
}

/* ---------- stage (left) ---------- */
.s4a-stage {
  container-type: inline-size;
  position: relative;
  height: 560px;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 30px;
  background: #f4f6f7;
  color: #fff;
  box-shadow: 0 30px 64px -38px rgba(217, 42, 71, 0.55), 0 1px 0 #fff inset;
}
.s4-js .s4a-stage {
  opacity: 0;
  transform: translateY(26px);
}
.s4-js .s4a-in .s4a-stage {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease) 0.15s,
    transform 0.9s var(--ease) 0.15s;
}
.s4a-stage::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 6;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
  pointer-events: none;
}
.s4a-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.8s var(--ease),
    visibility 0s 0.8s;
}
.s4a-layer.on {
  opacity: 1;
  visibility: visible;
  transition:
    opacity 0.8s var(--ease),
    visibility 0s;
}
.s4a-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.s4a-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.45;
  mix-blend-mode: luminosity;
}
.s4a-deco {
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
.s4a-layer.on .s4a-deco {
  opacity: 0.18;
  transform: rotate(-4deg);
  transition-delay: 0.25s;
}
.s4a-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(120, 28, 0, 0.26), transparent 42%, rgba(110, 0, 24, 0.2));
}

/* top-left icon */
.s4a-top {
  position: absolute;
  left: 24px;
  top: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.s4a-ti {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
}
.s4a-ti svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* widgets */
.s4a-w {
  position: absolute;
  opacity: 0;
  transform: translateY(22px) scale(0.97);
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.s4a-layer.on .s4a-w {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.7s var(--ease),
    transform 0.9s var(--ease);
}
.s4a-layer.on .s4a-w1 {
  transition-delay: 0.2s;
}
.s4a-layer.on .s4a-w2 {
  transition-delay: 0.38s;
}
.s4a-w1 {
  left: 24px;
  bottom: 24px;
  width: min(360px, calc(100% - 48px));
  padding: 16px 18px 16px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.96);
  color: var(--ink);
  backdrop-filter: blur(16px) saturate(1.08);
  -webkit-backdrop-filter: blur(16px) saturate(1.08);
  box-shadow: 0 30px 50px -26px rgba(120, 20, 10, 0.5);
  display: flex;
  flex-direction: column;
  gap: 11px;
  z-index: 3;
}
.s4a-w2 {
  right: 24px;
  top: 24px;
  width: 190px;
  height: 152px;
  padding: 14px 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: 0 24px 40px -26px rgba(110, 0, 24, 0.55);
  display: flex;
  flex-direction: column;
  z-index: 2;
}
@container (max-width: 520px) {
  .s4a-w2 {
    display: none;
  }
}
.ag-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ag-ic {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.9);
}
.ag-ic svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ag-k {
  font-size: 10.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}
.ag-big {
  margin-top: auto;
  font-size: 28px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
  white-space: nowrap;
  text-shadow: 0 1px 14px rgba(120, 30, 0, 0.3);
}
.ag-l {
  margin-top: 5px;
  font-size: 10.5px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.88);
}
.ag-tags {
  margin-top: 9px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.ag-tags span {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 9.5px;
  font-weight: 500;
  white-space: nowrap;
}

/* ---------- list (right) ---------- */
.s4a-list {
  margin: 0;
  padding: 6px 0 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}
.s4-js .s4a-item {
  opacity: 0;
  transform: translateY(22px);
}
.s4-js .s4a-in .s4a-item {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease),
    transform 0.9s var(--ease);
  transition-delay: calc(var(--i) * 0.07s + 0.25s);
}
.s4a-item {
  position: relative;
  padding: 15px 0 17px;
}
.s4a-item:first-child {
  padding-top: 0;
}
.s4a-item:last-child {
  padding-bottom: 0;
}
.s4a-ib {
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
.s4a-ib:focus-visible {
  outline: 2px solid var(--o1);
  outline-offset: 4px;
}
.s4a-ico {
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
.s4a-ico svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.4s;
}
.s4a-item.on .s4a-ico {
  background: linear-gradient(145deg, var(--o1), var(--o2));
  border-color: transparent;
  box-shadow: 0 10px 18px -8px rgba(242, 84, 12, 0.7);
  transform: scale(1.06);
}
.s4a-item.on .s4a-ico svg {
  stroke: #fff;
}
.s4a-it {
  flex: 1;
  min-width: 0;
  font-size: clamp(17px, 1.7vw, 20px);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--ink-2);
  transition: color 0.4s;
}
.s4a-item.on .s4a-it,
.s4a-ib:hover .s4a-it {
  color: var(--ink);
}
.s4a-more {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.6s var(--ease);
}
.s4a-more > div {
  overflow: hidden;
  min-height: 0;
}
.s4a-item.on .s4a-more {
  grid-template-rows: 1fr;
}
.s4a-id {
  margin: 8px 0 0 46px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--muted);
}
.s4a-pts {
  margin: 12px 0 4px 46px;
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
.s4a-item.on .s4a-pts {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.6s var(--ease) 0.2s,
    transform 0.7s var(--ease) 0.2s;
}
.s4a-pts li {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ink-2);
}
.s4a-pts svg {
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
.s4a-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--line);
  overflow: hidden;
}
.s4a-item:last-child .s4a-line {
  display: none;
}
.s4a-line i {
  display: block;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--o1), var(--o2));
  transition: width 0.1s linear;
}

/* ============ widget internals (inside the white widget) ============ */
.m-h {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-2);
}
.m-dot {
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background: linear-gradient(145deg, var(--o1), var(--o2));
}
.m-i {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--o2);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.m-t {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.35;
  color: var(--muted);
}
.m-t.b {
  color: var(--ink);
  font-weight: 600;
  font-size: 12.5px;
}
.m-code {
  display: flex;
  gap: 6px;
}
.m-code span {
  flex: 1;
  height: 40px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: var(--peach);
  border: 1px solid var(--peach-2);
  color: var(--o2);
  font-size: 18px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.s4a-layer.on .m-code span {
  animation: s4-pop 0.5s var(--ease) both;
  animation-delay: calc(0.65s + var(--k) * 0.08s);
}
.m-pill {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #f3f1ee;
  color: var(--ink-2);
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}
.m-pill i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.s4a-layer.on .m-pill i {
  animation: s4-blink 1.6s ease-in-out infinite;
}
.m-pill.g {
  color: #15803d;
  background: #ecfdf3;
}
.m-pill.o {
  color: #b84a0a;
  background: #fff3e8;
}
.m-pill.r {
  color: #c2262b;
  background: #fff0f0;
}
.m-pills {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

/* image captcha */
.m-tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.tile {
  position: relative;
  height: 34px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #f4f2ef;
  border: 1.5px solid transparent;
}
.tile svg {
  width: 19px;
  height: 19px;
  fill: #b9bccb;
}
.tile.on {
  background: var(--peach);
  border-color: var(--o1);
}
.tile.on > svg {
  fill: var(--o2);
}
.tile em {
  position: absolute;
  right: -4px;
  top: -4px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--o2);
  border: 1.5px solid #fff;
  transform: scale(0);
}
.s4a-layer.on .tile em {
  animation: s4-pop 0.45s var(--ease) both;
  animation-delay: calc(0.8s + var(--k) * 0.1s);
}
.tile em svg {
  width: 9px;
  height: 9px;
  fill: none;
  stroke: #fff;
  stroke-width: 3.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* math captcha */
.m-eq {
  display: flex;
  align-items: center;
  gap: 8px;
}
.m-eq b {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  animation: s4-in 0.5s var(--ease);
}
.m-box {
  flex: 1;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: #f7f6f4;
  border: 1.5px solid var(--o1);
  box-shadow: 0 0 0 3px rgba(255, 122, 26, 0.15);
  transition: 0.3s;
}
.m-caret {
  width: 1.5px;
  height: 16px;
  background: var(--ink);
  animation: s4-blink-c 1s steps(1) infinite;
}
.m-btn {
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(95deg, var(--o1), var(--o2));
  color: #fff;
  font-size: 11.5px;
  font-weight: 600;
}
.s4a-w1.wrong {
  animation: s4-shake 0.45s;
}
.s4a-w1.wrong .m-box {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.14);
  background: #fff7f7;
}

/* roles */
.m-role {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.m-role b {
  font-size: 12.5px;
  font-weight: 600;
}
.m-perms {
  display: flex;
  gap: 5px;
}
.m-perms em {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  font-style: normal;
  font-size: 10.5px;
  font-weight: 700;
  background: #f1efec;
  color: #b3b5c3;
}
.m-perms em.on {
  background: linear-gradient(145deg, var(--o1), var(--o2));
  color: #fff;
  box-shadow: 0 6px 10px -5px rgba(242, 84, 12, 0.7);
}

/* shared row layout (timer + fingerprint) */
.m-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.m-col {
  display: grid;
  gap: 5px;
  min-width: 0;
}
.m-ring {
  position: relative;
  flex: none;
  width: 108px;
  height: 108px;
  display: grid;
  place-items: center;
}
.m-ring svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.m-ring circle {
  fill: none;
  stroke-width: 8;
}
.m-ring .bg {
  stroke: var(--peach-2);
}
.m-ring .fg {
  stroke-linecap: round;
  stroke-dasharray: 264;
}
.s4a-layer.on .m-ring .fg {
  animation: s4-drain 7s linear infinite;
}
.m-ring b {
  font-size: 21px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* fingerprint */
.m-fp {
  flex: none;
  width: 72px;
  height: 72px;
  padding: 4px;
  border-radius: 16px;
  background: var(--peach);
}
.m-fp circle {
  fill: none;
  stroke: var(--o2);
  stroke-width: 1.7;
  stroke-linecap: round;
  transform-origin: 32px 32px;
}
.s4a-layer.on .m-fp circle {
  animation: s4-spin 14s linear infinite;
  animation-delay: calc(var(--k) * -2s);
}
.m-fp circle:nth-child(even) {
  animation-direction: reverse;
}
.m-fp .core {
  fill: var(--o2);
  stroke: none;
  animation: none !important;
}

/* ============ keyframes ============ */
@keyframes s4-pop {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes s4-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes s4-blink {
  50% {
    opacity: 0.3;
  }
}
@keyframes s4-blink-c {
  50% {
    opacity: 0;
  }
}
@keyframes s4-shake {
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
@keyframes s4-drain {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 264;
  }
}
@keyframes s4-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ============ responsive ============ */
@media (max-width: 960px) {
  .s4a-grid {
    grid-template-columns: 1fr;
  }
  .s4a-list {
    padding-top: 0;
  }
  .s4a-stage {
    height: 500px;
  }
}
@media (max-width: 760px) {
  .s4a-grid {
    padding: 16px;
  }
  .s4a-stage {
    height: 480px;
    border-radius: 24px;
  }
  .s4a-w1 {
    left: 16px;
    bottom: 16px;
    width: calc(100% - 32px);
  }
  .s4a-top {
    left: 16px;
    top: 16px;
  }
  .s4a-deco {
    width: 200px;
    height: 200px;
  }
  .s4a-id,
  .s4a-pts {
    margin-left: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .s4 *,
  .s4 *::before,
  .s4 *::after {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
    transition-delay: 0s !important;
  }
  .s4-js .s4a-panel,
  .s4-js .s4a-stage,
  .s4-js .s4a-item {
    opacity: 1;
    transform: none;
  }
  .tile em {
    transform: none;
  }
}

/* ===== combined widgets ===== */
.m-sep {
  margin-left: auto;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  color: var(--muted);
}
.m-hr {
  width: 100%;
  height: 1px;
  margin: 1px 0;
  border: 0;
  background: var(--line);
}
.m-code.sm span {
  height: 30px;
  font-size: 15px;
}
.m-tiles.six {
  grid-template-columns: repeat(6, 1fr);
}
.m-tiles.six .tile {
  height: 32px;
}
.m-eq b {
  font-size: 18px;
}
.m-eq .m-box {
  height: 32px;
}
.m-eq .m-btn {
  flex: none;
  height: 32px;
  padding: 0 14px;
}
.s4a-w1 {
  gap: 8px;
}

/* ===== palette: Marfil (ivory) — dark ink instead of white on the light card ===== */
.s4a-stage {
  color: var(--ink);
  border-color: rgba(20, 21, 43, 0.08);
  box-shadow: 0 30px 64px -40px rgba(150, 70, 30, 0.4), 0 1px 0 #fff inset;
}
.s4a-stage::after {
  box-shadow: inset 0 0 0 1px rgba(20, 21, 43, 0.05);
}
.s4a-scrim {
  background: radial-gradient(ellipse at 92% 0%, rgba(255, 196, 160, 0.3), transparent 60%) !important;
}
.s4a-ti {
  background: rgba(20, 21, 43, 0.05);
  border-color: rgba(20, 21, 43, 0.12);
}
.s4a-ti svg {
  stroke: var(--ink);
}
.s4a-deco {
  stroke: var(--o2);
}
.s4a-layer.on .s4a-deco {
  opacity: 0.2;
}
.s4a-w1 {
  border-color: rgba(20, 21, 43, 0.06);
  box-shadow: 0 26px 46px -26px rgba(150, 70, 30, 0.4);
}
.s4a-w2 {
  background: rgba(255, 255, 255, 0.62);
  border-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 24px 40px -28px rgba(150, 70, 30, 0.35);
}
.ag-k,
.ag-l {
  color: rgba(20, 21, 43, 0.62);
}
.ag-big {
  color: var(--ink);
  text-shadow: none;
}
.ag-tags span {
  background: rgba(20, 21, 43, 0.07);
  color: var(--ink-2);
}
.ag-ic {
  background: #fff;
  box-shadow: 0 4px 10px -4px rgba(20, 21, 43, 0.25);
}

/* stage stretches to the height of the list */
.s4a-grid {
  align-items: stretch;
}
.s4a-stage {
  height: auto;
  min-height: 560px;
}
@media (max-width: 960px) {
  .s4a-stage {
    height: 500px;
    min-height: 0;
  }
}
@media (max-width: 760px) {
  .s4a-stage {
    height: 480px;
  }
}

/* cards (stage) on the RIGHT, list on the LEFT */
.s4a-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.04fr);
}
.s4a-list {
  order: 1;
}
.s4a-stage {
  order: 2;
}
@media (max-width: 960px) {
  .s4a-grid {
    grid-template-columns: 1fr;
  }
  .s4a-stage {
    order: 0;
  }
  .s4a-list {
    order: 1;
  }
}
</style>