<template>

  <section

    ref="rootEl"

    class="s4"

    :class="{ 's4-js': mounted, 's4-in': revealed }"

    aria-labelledby="s4-title"

  >

    <!-- shared SVG defs: underline gradient, timer ring gradient and one "silk" lighting filter per card -->

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

        <filter

          v-for="(it, i) in items"

          :id="`s4-silk-${i}`"

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

    <div class="s4-wrap">

      <!-- ============ left: heading ============ -->

      <header class="s4-head">

        <span class="s4-eyebrow"><i></i>01 · Enterprise-grade security</span>

        <h2 id="s4-title" class="s4-title">

          Authentication

          <span>&amp; <b>Access<svg viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 C 24 2, 46 12, 68 6 S 106 3, 118 7" /></svg></b></span>

        </h2>

        <p class="s4-sub">

          Every sign-in is checked in layers — one-time codes, bot-proof challenges and strict role

          boundaries — before anyone touches your business data.

        </p>

      </header>

      <!-- ============ right: expanding silk cards ============ -->

      <div class="s4-stage">

        <div

          ref="scroller"

          class="s4-track"

          :class="{ dragging }"

          tabindex="0"

          role="group"

          aria-label="Authentication and access controls — scroll sideways"

          @scroll.passive="update"

          @keydown="onKey"

          @pointerdown="onDown"

          @pointermove="onMove"

          @pointerup="onUp"

          @pointercancel="onUp"

          @pointerleave="onUp"

        >

          <article v-for="(it, i) in items" :key="it.id" class="s4-card" :data-id="it.id" :style="{ '--i': i }">

            <!-- background: gradient + silk lighting (+ optional photo) -->

            <div class="s4-bg" :style="{ background: it.bg }" aria-hidden="true">

              <img v-if="it.img" class="s4-photo" :src="it.img" alt="" loading="lazy" draggable="false" />

              <svg class="s4-silk" viewBox="0 0 720 560" preserveAspectRatio="none">

                <rect width="720" height="560" fill="#000" :filter="`url(#s4-silk-${i})`" />

              </svg>

              <svg class="s4-deco" viewBox="0 0 24 24" v-html="icons[it.icon]"></svg>

            </div>

            <div class="s4-scrim" aria-hidden="true"></div>

            <!-- expanded content (fixed width so text never reflows while the card animates) -->

            <div class="s4-inner" role="region" :aria-label="it.name">

              <div class="s4-top" aria-hidden="true">

                <span class="s4-tn">{{ it.num }}</span>

                <span class="s4-ti"><svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg></span>

              </div>

              <div class="s4-copy">

                <h3 class="s4-ct">{{ it.name }}</h3>

                <p class="s4-cd">{{ it.desc }}</p>

                <ul class="s4-pts">

                  <li v-for="p in it.points" :key="p">

                    <svg viewBox="0 0 24 24" aria-hidden="true">

                      <circle cx="12" cy="12" r="9.5" />

                      <path d="m8 12.5 2.8 2.8 5.2-5.6" />

                    </svg>

                    {{ p }}

                  </li>

                </ul>

              </div>

              <div class="s4-widgets" aria-hidden="true">

                <!-- white "product UI" widget -->

                <div class="s4-w s4-w1" :class="{ wrong: wrong && it.id === 'math' }">

                  <template v-if="it.id === 'sms'">

                    <div class="m-h"><i class="m-dot"></i>Saptivo · SMS</div>

                    <p class="m-t">Your login code is</p>

                    <div class="m-code">

                      <span v-for="(d, k) in ['4', '8', '2', '9', '1', '7']" :key="k" :style="{ '--k': k }">{{ d }}</span>

                    </div>

                    <span class="m-pill g"><i></i>Delivered &lt; 3s</span>

                  </template>

                  <template v-else-if="it.id === 'email'">

                    <div class="m-h">

                      <svg viewBox="0 0 24 24" class="m-i" v-html="icons.mail"></svg>

                      Verify your change

                    </div>

                    <p class="m-t">Enter the 6-digit code</p>

                    <div class="m-code">

                      <span v-for="(d, k) in ['3', '0', '6', '5', '8', '1']" :key="k" :style="{ '--k': k }">{{ d }}</span>

                    </div>

                    <span class="m-pill o"><i></i>Expires in 10 min</span>

                  </template>

                  <template v-else-if="it.id === 'image'">

                    <p class="m-t b">Select all circles</p>

                    <div class="m-tiles">

                      <span v-for="(t, k) in tiles" :key="k" class="tile" :class="{ on: t === 'c' }" :style="{ '--k': k }">

                        <svg viewBox="0 0 24 24">

                          <circle v-if="t === 'c'" cx="12" cy="12" r="6.5" />

                          <rect v-else-if="t === 's'" x="6" y="6" width="12" height="12" rx="2" />

                          <path v-else d="M12 5.5 19 18H5z" />

                        </svg>

                        <em v-if="t === 'c'"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg></em>

                      </span>

                    </div>

                  </template>

                  <template v-else-if="it.id === 'math'">

                    <p class="m-t b">Prove you're human</p>

                    <div class="m-eq">

                      <b :key="eqIdx">{{ equations[eqIdx] }} =</b>

                      <span class="m-box"><i class="m-caret"></i></span>

                    </div>

                    <span class="m-btn">Verify</span>

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

                <!-- glass metric widget -->

                <div class="s4-w s4-w2">

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

              </div>

            </div>

          </article>

        </div>

        <div class="s4-nav">

          <button type="button" class="s4-btn" aria-label="Previous" :disabled="!canPrev" @click="go(-1)">

            <svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6" /></svg>

          </button>

          <button type="button" class="s4-btn dark" aria-label="Next" :disabled="!canNext" @click="go(1)">

            <svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" /></svg>

          </button>

        </div>

      </div>

    </div>

    <NetworkSection />
    <DataProtectionSection />

  </section>

</template>

<script setup>

import NetworkSection from './section7.vue'
import DataProtectionSection from './section8.vue'

/**

 * SectionAuth.vue — "Authentication & Access" (Vue 3, <script setup>)

 *

 * Layout: sticky heading + counter on the left, scrolling silk cards (slides) on the right.

 * • Scroll sideways with trackpad / touch swipe, mouse drag, the ‹ › buttons, ← → keys,

 *   or the notched arrow on each card (the last card's arrow loops back to the first).

 * • Cards animate their widgets when they slide into view.

 * • Card backgrounds are procedural "silk" (SVG lighting filters). For real photos set `img` on an item.

 *

 * No props. Browser APIs are only used in onMounted / handlers (SSR / Nuxt safe).

 */

import { ref, onMounted, onBeforeUnmount } from 'vue'

const rootEl = ref(null)

const scroller = ref(null)

const mounted = ref(false)

const revealed = ref(false)

const active = ref(0)

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

   silk: [baseFreqX, baseFreqY, seed, lightAzimuth]

   metric: [big value, label, small caption]                                              */

const items = [

  {

    id: 'sms', num: '01', icon: 'sms', img: '',

    name: 'SMS OTP Login',

    desc: 'One-time SMS code on every login.',

    bg: 'linear-gradient(135deg,#ffc79e 0%,#f58a4b 45%,#d9490a 100%)',

    silk: [0.0042, 0.0105, 3, 235],

    metric: ['< 3s', 'Carrier-grade gateway delivery', 'SMS route'],

    tags: ['Auto failover', '3-min expiry'],

    points: [

      'Carrier-grade SMS gateway delivery in under 3 seconds',

      'Automatic carrier failover to secondary backup SMS route',

      'Strict 3-minute expiration with attempt rate limiting',

    ],

  },

  {

    id: 'email', num: '02', icon: 'mail', img: '',

    name: 'Email OTP Verification',

    desc: 'Email verification code for sensitive changes.',

    bg: 'linear-gradient(135deg,#6aa3e6 0%,#245aa6 50%,#0a1f45 100%)',

    silk: [0.005, 0.009, 8, 215],

    metric: ['6-digit', 'Cryptographically random code', 'Email OTP'],

    tags: ['Single-use', '10-min timeout'],

    points: [

      'Required for password resets, email, and banking updates',

      'Cryptographically random 6-digit one-time passcode',

      'Single-use token with automatic 10-minute timeout',

    ],

  },

  {

    id: 'image', num: '03', icon: 'image', img: '',

    name: 'Image Captcha',

    desc: 'Bot-proof image challenge at sign-in.',

    bg: 'linear-gradient(135deg,#f6c3a8 0%,#d9806a 50%,#a24b3b 100%)',

    silk: [0.0036, 0.0115, 14, 250],

    metric: ['0', 'Third-party ad trackers', 'Privacy-first'],

    tags: ['Blocks bots', 'No scrapers'],

    points: [

      'Dynamic visual pattern challenge blocking credential stuffing',

      'Eliminates headless bot scrapers and brute-force tools',

      'Privacy-first challenge with zero third-party ad tracking',

    ],

  },

  {

    id: 'math', num: '04', icon: 'math', img: '',

    name: 'Text / Math Captcha',

    desc: 'Quick human-verification math challenge.',

    bg: 'radial-gradient(60% 45% at 78% 12%, rgba(255,122,26,.45), transparent 62%), linear-gradient(135deg,#505377 0%,#25274a 55%,#0d0e22 100%)',

    silk: [0.0048, 0.0095, 21, 225],

    metric: ['0 ms', 'External CDN latency', 'Self-hosted'],

    tags: ['No dependency', 'Auto-rotates'],

    points: [

      'Instant arithmetic verification challenge at sign-in',

      'Zero external CDN latency or third-party service dependency',

      'Auto-rotates mathematical equations upon invalid entry',

    ],

  },

  {

    id: 'rbac', num: '05', icon: 'roles', img: '',

    name: 'Role-Based Access Control',

    desc: 'Granular role-based permissions for staff.',

    bg: 'linear-gradient(135deg,#ffd886 0%,#f2a33a 50%,#c26a16 100%)',

    silk: [0.0039, 0.0108, 30, 240],

    metric: ['3 roles', 'SuperAdmin · Manager · Staff', 'Permissions'],

    tags: ['Per-module', 'PII restricted'],

    points: [

      'Dedicated role boundaries for SuperAdmin, Manager & Staff',

      'Granular read, edit, delete, and export permissions per module',

      'Restricts financial and customer PII data to authorized tiers',

    ],

  },

  {

    id: 'timeout', num: '06', icon: 'timer', img: '',

    name: 'Session Timeout Lock',

    desc: 'Auto-logout after periods of inactivity.',

    bg: 'linear-gradient(135deg,#86d6dc 0%,#2b8ca3 50%,#0e475f 100%)',

    silk: [0.0046, 0.0098, 37, 220],

    metric: ['15 min', 'Default inactivity timer', 'Configurable'],

    tags: ['Warning modal', 'Token revoke'],

    points: [

      'Configurable inactivity timer (default 15 minutes)',

      'Warning modal with countdown before session termination',

      'Immediately invalidates auth tokens on unattended screens',

    ],

  },

  {

    id: 'device', num: '07', icon: 'finger', img: '',

    name: 'Device Fingerprinting',

    desc: 'Flags logins from unknown devices.',

    bg: 'linear-gradient(135deg,#ffa05a 0%,#c4480e 50%,#4a1a06 100%)',

    silk: [0.004, 0.0112, 44, 245],

    metric: ['3 signals', 'Hardware · canvas · OS', 'Fingerprint'],

    tags: ['Admin alerts', 'Instant challenge'],

    points: [

      'Fingerprints device hardware, browser canvas, and OS profile',

      'Instantly challenges and flags unrecognized device logins',

      'Notifies account administrators of suspicious machine access',

    ],

  },

]

/* mock data */

const tiles = ['c', 's', 'c', 't', 'c', 's', 't', 's', 'c']

const roles = [

  { n: 'SuperAdmin', p: [1, 1, 1, 1] },

  { n: 'Manager', p: [1, 1, 0, 1] },

  { n: 'Staff', p: [1, 0, 0, 0] },

]

const equations = ['7 + 4', '12 − 5', '3 × 6', '9 + 8']

const eqIdx = ref(0)

const wrong = ref(false)

/* ------------------------------------------------------------------ carousel */

const canPrev = ref(false)

const canNext = ref(true)

const dragging = ref(false)

const mathOn = ref(false)

let reduceMotion = false

function stepSize() {

  const el = scroller.value

  const card = el?.querySelector('.s4-card')

  if (!el || !card) return 1

  const gap = parseFloat(getComputedStyle(el).columnGap) || 14

  return card.offsetWidth + gap

}

function update() {

  const el = scroller.value

  if (!el) return

  canPrev.value = el.scrollLeft > 4

  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4

  const i = Math.round(el.scrollLeft / stepSize())

  active.value = canNext.value ? Math.max(0, Math.min(items.length - 1, i)) : items.length - 1

}

function go(dir) {

  scroller.value?.scrollBy({ left: dir * stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' })

}

function goTo(i) {

  const n = ((i % items.length) + items.length) % items.length

  scroller.value?.scrollTo({ left: n * stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' })

}

function onKey(e) {

  if (e.key === 'ArrowRight') {

    e.preventDefault()

    go(1)

  } else if (e.key === 'ArrowLeft') {

    e.preventDefault()

    go(-1)

  }

}

/* mouse drag-to-scroll (touch / trackpad use native scrolling) */

let drag = null

function onDown(e) {

  if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button')) return

  drag = { x: e.clientX, left: scroller.value.scrollLeft }

  dragging.value = true

}

function onMove(e) {

  if (!drag) return

  scroller.value.scrollLeft = drag.left - (e.clientX - drag.x)

}

function onUp() {

  drag = null

  dragging.value = false

}

/* ------------------------------------------------------------------ lifecycle */

const timers = new Set()

let ioReveal, ioCards, ro

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

  // a card is "on" (its widgets animate) while it is mostly inside the scroller

  ioCards = new IntersectionObserver(

    (es) => {

      es.forEach((en) => {

        en.target.classList.toggle('on', en.isIntersecting)

        if (en.target.dataset.id === 'math') mathOn.value = en.isIntersecting

      })

    },

    { root: scroller.value, threshold: 0.55 },

  )

  scroller.value.querySelectorAll('.s4-card').forEach((c) => ioCards.observe(c))

  ro = new ResizeObserver(update)

  ro.observe(scroller.value)

  update()

  if (!reduceMotion) {

    // math captcha demo: wrong entry → equation rotates (only while that card is visible)

    const mc = setInterval(() => {

      if (!mathOn.value) return

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

  ioCards?.disconnect()

  ro?.disconnect()

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

  --surface: #fbfaf8; /* stage colour — the card notch must match it exactly */

  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);

  --gap: 14px;

  position: relative;

  isolation: isolate;

  overflow: hidden;

  padding: clamp(72px, 8vw, 112px) clamp(18px, 4vw, 40px) clamp(76px, 8.5vw, 120px);

  font-family: 'Poppins', system-ui, sans-serif;

  color: var(--ink);

  background:

    radial-gradient(900px 420px at 0% 0%, rgba(255, 122, 26, 0.09), transparent 60%),

    radial-gradient(800px 420px at 100% 100%, rgba(255, 122, 26, 0.08), transparent 60%), var(--page);

}

.s4 *,

.s4 *::before,

.s4 *::after {

  box-sizing: border-box;

}

.s4 svg {

  display: block;

}

/* embedded Network & Infrastructure section: share this section's background and width */
.s4 > .s5 {

  max-width: 1240px;

  margin: clamp(56px, 7vw, 96px) auto 0;

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

.s4 > .s6 .s6-card {

  margin-inline: 0;

}

.s4-wrap {

  max-width: 1240px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: minmax(270px, 300px) minmax(0, 1fr);

  /* Keep a clear gutter between the intro column and the card carousel. */
  gap: clamp(28px, 1.8vw, 28px);

  align-items: stretch;

}

/* ============ heading (left) ============ */

.s4-head {

  position: sticky;

  top: 40px;

  /* Heading stays at the top; description and slide counter sit near the bottom. */
  display: flex;

  flex-direction: column;

  align-self: stretch;

  min-height: 620px;

  min-width: 0;

}

.s4-eyebrow {

  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 6px 12px 6px 10px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.7);

  border: 1px solid var(--line);

  backdrop-filter: blur(6px);

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  color: var(--ink-2);

  box-shadow: 0 6px 18px -10px rgba(20, 21, 43, 0.25);

}

.s4-eyebrow i {

  width: 7px;

  height: 7px;

  border-radius: 50%;

  background: var(--o1);

  animation: s4-ping 2s infinite;

}

.s4-title {

  margin: 22px 0 0;

  font-size: clamp(30px, 3.6vw, 42px);

  font-weight: 500;

  line-height: 1.12;

  letter-spacing: -0.025em;

}

.s4-title span {

  display: block;

  font-weight: 300;

}

.s4-title b {

  position: relative;

  font-weight: 500;

}

.s4-title b svg {

  position: absolute;

  left: 0;

  bottom: -9px;

  width: 100%;

  height: 11px;

  overflow: visible;

}

.s4-title b path {

  fill: none;

  stroke: url(#s4-ul);

  stroke-width: 3;

  stroke-linecap: round;

  stroke-dasharray: 160;

  stroke-dashoffset: 160;

  transition: stroke-dashoffset 1.2s 0.5s var(--ease);

}

.s4-in .s4-title b path {

  stroke-dashoffset: 0;

}

.s4-sub {

  margin: auto 0 0;

  font-size: 13px;

  line-height: 1.8;

  color: var(--muted);

}

.s4-tip {

  margin: 22px 0 0;

  display: flex;

  align-items: center;

  gap: 8px;

  font-size: 11px;

  color: var(--muted);

}

.s4-tip svg {

  width: 16px;

  height: 16px;

  fill: none;

  stroke: var(--o2);

  stroke-width: 1.8;

  stroke-linecap: round;

  stroke-linejoin: round;

}

/* ============ stage (right) — surface colour so the card notch blends in ============ */

.s4-stage {

  --pad: clamp(10px, 1.6vw, 18px);

  min-width: 0;

  overflow: hidden;

  padding: var(--pad);

  border-radius: 30px;

  background: var(--surface);

  border: 1px solid var(--line);

  box-shadow:

    0 1px 0 #fff inset,

    0 40px 80px -50px rgba(20, 21, 43, 0.45);

}

.s4-js .s4-stage {

  opacity: 0;

  transform: translateY(24px);

}

.s4-js.s4-in .s4-stage {

  opacity: 1;

  transform: none;

  transition:

    opacity 0.8s var(--ease),

    transform 0.9s var(--ease);

}

/* ============ scrolling slides ============ */

.s4-track {

  display: flex;

  gap: var(--gap);

  margin: 0;

  padding: 8px 0 18px;

  overflow-x: auto;

  scroll-snap-type: x mandatory;

  scroll-padding-left: 0;

  scrollbar-width: none;

  cursor: grab;

  outline: none;

}

.s4-track::-webkit-scrollbar {

  display: none;

}

.s4-track.dragging {

  scroll-snap-type: none;

  cursor: grabbing;

  user-select: none;

}

.s4-track:focus-visible {

  outline: 2px solid var(--o1);

  outline-offset: -4px;

  border-radius: 26px;

}

.s4-card {

  position: relative;

  flex: 0 0 min(430px, 72vw);

  height: 520px;

  scroll-snap-align: start;

  overflow: hidden;

  isolation: isolate;

  border-radius: 26px;

  background: #14152b;

  color: #fff;

  -webkit-tap-highlight-color: transparent;

}

.s4-js .s4-card {

  opacity: 0;

  transform: translateY(26px);

}

.s4-js.s4-in .s4-card {

  opacity: 1;

  transform: none;

  transition:

    opacity 0.8s var(--ease),

    transform 0.9s var(--ease);

  transition-delay: calc(var(--i) * 0.07s + 0.15s);

}

/* background layers */

.s4-bg {

  position: absolute;

  inset: 0;

  z-index: 0;

  overflow: hidden;

  transition: filter 0.5s;

}

.s4-card:not(.on):hover .s4-bg {

  filter: brightness(1.1) saturate(1.1);

}

.s4-silk {

  /* fixed size + centred, so the heavy filter is rasterised once and never re-computed

     while the card width animates */

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

.s4-photo {

  position: absolute;

  inset: 0;

  width: 100%;

  height: 100%;

  object-fit: cover;

  opacity: 0.45;

  mix-blend-mode: luminosity;

}

.s4-deco {

  position: absolute;

  right: -26px;

  top: 34px;

  width: 230px;

  height: 230px;

  fill: none;

  stroke: #fff;

  stroke-width: 0.6;

  stroke-linecap: round;

  stroke-linejoin: round;

  opacity: 0;

  transform: rotate(-10deg) scale(0.9);

  transition:

    opacity 0.6s,

    transform 1.2s var(--ease);

}

.s4-card.on .s4-deco {

  opacity: 0.2;

  transform: rotate(-4deg);

  transition-delay: 0.3s;

}

.s4-scrim {

  position: absolute;

  inset: 0;

  z-index: 1;

  pointer-events: none;

  background:

    linear-gradient(135deg, rgba(8, 10, 26, 0.5) 0%, rgba(8, 10, 26, 0) 55%),

    linear-gradient(0deg, rgba(8, 10, 26, 0.28), rgba(8, 10, 26, 0) 45%);

}

.s4-card::after {

  content: '';

  position: absolute;

  inset: 0;

  z-index: 6;

  border-radius: inherit;

  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);

  pointer-events: none;

}

/* ---------- top row: number + icon ---------- */

.s4-top {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 16px;

}

.s4-tn {

  font-size: 11px;

  font-weight: 600;

  padding: 3px 8px;

  border-radius: 6px;

  background: rgba(255, 255, 255, 0.9);

  color: var(--ink);

  font-variant-numeric: tabular-nums;

}

.s4-ti {

  width: 34px;

  height: 34px;

  border-radius: 10px;

  display: grid;

  place-items: center;

  background: rgba(255, 255, 255, 0.18);

  border: 1px solid rgba(255, 255, 255, 0.35);

  backdrop-filter: blur(8px);

}

.s4-ti svg {

  width: 17px;

  height: 17px;

  fill: none;

  stroke: #fff;

  stroke-width: 1.8;

  stroke-linecap: round;

  stroke-linejoin: round;

}

/* ---------- expanded content ---------- */

.s4-inner {

  container-type: inline-size;

  position: absolute;

  inset: 0;

  z-index: 3;

  padding: 24px 28px 22px;

  display: flex;

  flex-direction: column;

}

.s4-js .s4-inner > * {

  opacity: 0;

  transform: translateY(14px);

  transition:

    opacity 0.25s,

    transform 0.25s;

}

.s4-js .s4-card.on .s4-inner > * {

  opacity: 1;

  transform: none;

  transition:

    opacity 0.6s var(--ease),

    transform 0.8s var(--ease);

}

.s4-card.on .s4-copy {

  transition-delay: 0.12s;

}

.s4-card.on .s4-widgets {

  transition-delay: 0.26s;

}

.s4-ct {

  margin: 0;

  font-size: clamp(23px, 2.2vw, 28px);

  font-weight: 500;

  letter-spacing: -0.02em;

  line-height: 1.15;

}

.s4-cd {

  margin: 8px 0 0;

  font-size: 13.5px;

  color: rgba(255, 255, 255, 0.85);

}

.s4-pts {

  margin: 16px 0 0;

  padding: 0;

  list-style: none;

  display: grid;

  gap: 9px;

  max-width: 340px;

}

.s4-pts li {

  display: flex;

  gap: 9px;

  align-items: flex-start;

  font-size: 12.2px;

  line-height: 1.5;

  color: rgba(255, 255, 255, 0.92);

}

.s4-pts svg {

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

/* widgets row */

.s4-widgets {

  margin-top: auto;

  display: flex;

  gap: 12px;

  align-items: stretch;

}

.s4-w {

  height: 152px;

  border-radius: 22px;

}

.s4-w1 {

  width: 226px;

  flex: none;

  padding: 13px 14px;

  background: #fff;

  color: var(--ink);

  box-shadow: 0 24px 40px -22px rgba(8, 10, 26, 0.7);

  display: flex;

  flex-direction: column;

  justify-content: center;

  gap: 7px;

}

.s4-w2 {

  display: none;

  width: 190px;

  flex: none;

  padding: 14px 16px;

  color: #fff;

  background: rgba(255, 255, 255, 0.14);

  border: 1px solid rgba(255, 255, 255, 0.34);

  backdrop-filter: blur(14px) saturate(1.2);

  -webkit-backdrop-filter: blur(14px) saturate(1.2);

  box-shadow: 0 24px 40px -26px rgba(8, 10, 26, 0.6);

  display: flex;

  flex-direction: column;

}

@container (max-width: 430px) {

  .s4-w2 {

    display: none;

  }

}

@container (max-width: 280px) {

  .s4-w1 {

    width: calc(100% - 24px);

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

  font-size: 32px;

  font-weight: 500;

  line-height: 1;

  letter-spacing: -0.03em;

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

/* ---------- notched arrow button ---------- */

.s4-notch {

  position: absolute;

  right: 0;

  bottom: 0;

  z-index: 5;

  width: 76px;

  height: 76px;

  display: grid;

  place-items: center;

  background: var(--surface);

  border-top-left-radius: 26px;

  opacity: 0;

  transform: scale(0.5);

  transform-origin: 100% 100%;

  transition:

    opacity 0.25s,

    transform 0.3s;

}

.s4-notch::before,

.s4-notch::after {

  /* concave "ears" where the notch meets the card edges */

  content: '';

  position: absolute;

  width: 24px;

  height: 24px;

  background: radial-gradient(circle at 0 0, transparent 23.5px, var(--surface) 24px);

}

.s4-notch::before {

  left: -24px;

  bottom: 0;

}

.s4-notch::after {

  right: 0;

  top: -24px;

}

.s4-card.on .s4-notch {

  opacity: 1;

  transform: none;

  transition:

    opacity 0.5s var(--ease) 0.45s,

    transform 0.7s var(--ease) 0.45s;

}

.s4-go {

  width: 50px;

  height: 50px;

  border: 0;

  border-radius: 50%;

  display: grid;

  place-items: center;

  cursor: pointer;

  background: linear-gradient(180deg, #2c2d3f, #14152b);

  color: #fff;

  box-shadow: 0 14px 22px -10px rgba(20, 21, 43, 0.7);

  transition:

    background 0.3s,

    transform 0.4s var(--ease);

}

.s4-go svg {

  width: 19px;

  height: 19px;

  fill: none;

  stroke: currentColor;

  stroke-width: 2.2;

  stroke-linecap: round;

  stroke-linejoin: round;

  transition: transform 0.4s var(--ease);

}

.s4-go:hover {

  background: linear-gradient(145deg, var(--o1), var(--o2));

  transform: scale(1.06);

}

.s4-go:hover svg {

  transform: translateX(2px);

}

.s4-go:focus-visible {

  outline: 2px solid var(--o1);

  outline-offset: 3px;

}

/* ---------- prev / next ---------- */

.s4-nav {

  display: flex;

  justify-content: flex-end;

  gap: 12px;

}

.s4-btn {

  width: 40px;

  height: 40px;

  border-radius: 50%;

  display: grid;

  place-items: center;

  cursor: pointer;

  background: #fff;

  border: 1px solid rgba(20, 21, 43, 0.18);

  color: var(--ink);

  transition: 0.3s var(--ease);

}

.s4-btn svg {

  width: 16px;

  height: 16px;

  fill: none;

  stroke: currentColor;

  stroke-width: 2.2;

  stroke-linecap: round;

  stroke-linejoin: round;

}

.s4-btn.dark {

  background: var(--ink);

  border-color: var(--ink);

  color: #fff;

}

.s4-btn:hover:not(:disabled) {

  transform: translateY(-2px);

  border-color: var(--o1);

  box-shadow: 0 12px 20px -10px rgba(242, 84, 12, 0.55);

}

.s4-btn.dark:hover:not(:disabled) {

  background: linear-gradient(145deg, var(--o1), var(--o2));

  border-color: transparent;

}

.s4-btn:disabled {

  opacity: 0.35;

  cursor: default;

}

.s4-btn:focus-visible {

  outline: 2px solid var(--o1);

  outline-offset: 3px;

}

/* ============ widget internals ============ */

.m-h {

  display: flex;

  align-items: center;

  gap: 7px;

  font-size: 10px;

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

  width: 14px;

  height: 14px;

  fill: none;

  stroke: var(--o2);

  stroke-width: 2;

  stroke-linecap: round;

  stroke-linejoin: round;

}

.m-t {

  margin: 0;

  font-size: 10.5px;

  line-height: 1.35;

  color: var(--muted);

}

.m-t.b {

  color: var(--ink);

  font-weight: 600;

  font-size: 11.5px;

}

.m-code {

  display: flex;

  gap: 5px;

}

.m-code span {

  flex: 1;

  height: 34px;

  border-radius: 8px;

  display: grid;

  place-items: center;

  background: var(--peach);

  border: 1px solid var(--peach-2);

  color: var(--o2);

  font-size: 15px;

  font-weight: 600;

  font-variant-numeric: tabular-nums;

}

.s4-card.on .m-code span {

  animation: s4-pop 0.5s var(--ease) both;

  animation-delay: calc(0.65s + var(--k) * 0.08s);

}

.m-pill {

  align-self: flex-start;

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

.m-pill i {

  width: 5px;

  height: 5px;

  border-radius: 50%;

  background: currentColor;

}

.s4-card.on .m-pill i {

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

  gap: 5px;

}

.tile {

  position: relative;

  height: 28px;

  border-radius: 7px;

  display: grid;

  place-items: center;

  background: #f4f2ef;

  border: 1.5px solid transparent;

}

.tile svg {

  width: 17px;

  height: 17px;

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

  width: 14px;

  height: 14px;

  border-radius: 50%;

  display: grid;

  place-items: center;

  background: var(--o2);

  border: 1.5px solid #fff;

  transform: scale(0);

}

.s4-card.on .tile em {

  animation: s4-pop 0.45s var(--ease) both;

  animation-delay: calc(0.8s + var(--k) * 0.1s);

}

.tile em svg {

  width: 8px;

  height: 8px;

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

  font-size: 19px;

  font-weight: 600;

  letter-spacing: -0.01em;

  white-space: nowrap;

  animation: s4-in 0.5s var(--ease);

}

.m-box {

  flex: 1;

  height: 30px;

  border-radius: 8px;

  display: flex;

  align-items: center;

  padding: 0 9px;

  background: #f7f6f4;

  border: 1.5px solid var(--o1);

  box-shadow: 0 0 0 3px rgba(255, 122, 26, 0.15);

  transition: 0.3s;

}

.m-caret {

  width: 1.5px;

  height: 14px;

  background: var(--ink);

  animation: s4-blink-c 1s steps(1) infinite;

}

.m-btn {

  height: 26px;

  border-radius: 999px;

  display: grid;

  place-items: center;

  background: linear-gradient(95deg, var(--o1), var(--o2));

  color: #fff;

  font-size: 10.5px;

  font-weight: 600;

}

.s4-w1.wrong {

  animation: s4-shake 0.45s;

}

.s4-w1.wrong .m-box {

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

  font-size: 11px;

  font-weight: 600;

}

.m-perms {

  display: flex;

  gap: 4px;

}

.m-perms em {

  width: 22px;

  height: 22px;

  border-radius: 6px;

  display: grid;

  place-items: center;

  font-style: normal;

  font-size: 9.5px;

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

  gap: 12px;

}

.m-col {

  display: grid;

  gap: 4px;

  min-width: 0;

}

.m-ring {

  position: relative;

  flex: none;

  width: 92px;

  height: 92px;

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

.s4-card.on .m-ring .fg {

  animation: s4-drain 7s linear infinite;

}

.m-ring b {

  font-size: 18px;

  font-weight: 600;

  font-variant-numeric: tabular-nums;

}

/* fingerprint */

.m-fp {

  flex: none;

  width: 60px;

  height: 60px;

  padding: 3px;

  border-radius: 14px;

  background: var(--peach);

}

.m-fp circle {

  fill: none;

  stroke: var(--o2);

  stroke-width: 1.7;

  stroke-linecap: round;

  transform-origin: 32px 32px;

}

.s4-card.on .m-fp circle {

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

@keyframes s4-ping {

  70% {

    box-shadow: 0 0 0 8px rgba(255, 122, 26, 0);

  }

  100% {

    box-shadow: 0 0 0 0 rgba(255, 122, 26, 0);

  }

}

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

@media (max-width: 1060px) {

  .s4-track {

    height: 450px;

  }

}

@media (max-width: 900px) {

  .s4-wrap {

    grid-template-columns: 1fr;

    gap: 34px;

  }

  .s4-head {

    position: static;

    min-height: 0;

  }

  .s4-sub {

    max-width: 520px;

    margin: 32px 0 0;

  }

}

@media (hover: none) {

  .s4-tip {

    visibility: hidden; /* hover hint is irrelevant on touch; cards open on tap */

  }

}

@media (max-width: 760px) {

  .s4-card {

    height: 500px;

  }

  .s4-inner {

    padding: 20px 20px 18px;

  }

  .s4-pts {

    max-width: none;

  }

  .s4-deco {

    width: 170px;

    height: 170px;

    top: 14px;

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

  .s4-js .s4-card,

  .s4-js .s4-stage {

    opacity: 1;

    transform: none;

  }

  .tile em {

    transform: none;

  }

}

</style>
