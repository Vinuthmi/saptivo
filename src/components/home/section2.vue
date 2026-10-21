<template> 
  <section
    ref="rootEl"
    class="s2"
    :class="{ 's2-js': mounted, 's2-in': revealed, 's2-preview': preview }"
    aria-labelledby="s2-title"
  >
    <!-- shared gradients -->
    <svg width="0" height="0" style="position: absolute" aria-hidden="true">
      <defs>
        <linearGradient id="s2-ul" x1="0" x2="1">
          <stop offset="0" stop-color="#ffb27f" />
          <stop offset="1" stop-color="#f2540c" />
        </linearGradient>
        <linearGradient id="s2-pg" x1="0" x2="1">
          <stop offset="0" stop-color="#ff7a1a" stop-opacity="0" />
          <stop offset="1" stop-color="#f2540c" />
        </linearGradient>
        <linearGradient id="s2-d1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ff7a1a" />
          <stop offset="1" stop-color="#e8470a" />
        </linearGradient>
        <linearGradient id="s2-d2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffa468" />
          <stop offset="1" stop-color="#ff7a1a" />
        </linearGradient>
      </defs>
    </svg>

    <header class="s2-head">
      <span class="s2-eyebrow"><i></i>One platform · zero spreadsheets</span>
      <h2 id="s2-title" class="s2-title">
        Replace your
        <b
          >Messy Excel Sheets<svg
            viewBox="0 0 300 12"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M2 8 C 60 2, 110 12, 160 6 S 260 2, 298 7" /></svg
        ></b>
      </h2>
      <p class="s2-sub">
        POS, CRM, inventory and every branch in one live workspace — built for fast-moving retail
        teams.
      </p>
    </header>

    <div class="s2-grid" @pointermove="spotlight">
      <!-- A · Cloud POS & Sales Workstation -->
      <article class="s2-card s2-a s2-dots">
        <div class="s2-rail" aria-hidden="true">
          <div v-for="(row, r) in railRows" :key="r" class="s2-row" :class="{ rev: r === 1 }">
            <span v-for="(k, i) in row" :key="i" class="s2-ic" :style="{ '--b': icons[k].color }">
              <svg viewBox="0 0 24 24" v-html="icons[k].svg"></svg>
            </span>
          </div>
        </div>
        <div class="s2-a-body">
          <h3 class="s2-h">Cloud POS &amp; Sales Workstation</h3>
          <p class="s2-p">
            Built for high-velocity sales and retail operations, Saptivo unifies fast POS checkouts,
            real-time inventory tracking, customer CRM, and instant quotation workflows into one
            responsive workstation.
          </p>
          <button
            ref="openBtn"
            class="s2-btn"
            type="button"
            aria-haspopup="dialog"
            @click="openModal"
          >
            <span class="gl"
              ><svg viewBox="0 0 12 12" fill="#fff">
                <circle v-for="p in dotGrid" :key="p" :cx="p[0]" :cy="p[1]" r="1.1" /></svg
            ></span>
            Explore Workstation
            <svg
              class="ar"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </article>

      <!-- B · Real-time activity & instant alerts -->
      <article class="s2-card s2-b s2-dots tl">
        <h3 class="s2-h">Real-time activity &amp; instant alerts</h3>

        <div class="s2-donut" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <defs>
              <linearGradient id="s2-donut-a" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#f69a5c" />
                <stop offset="1" stop-color="#f27a30" />
              </linearGradient>
              <linearGradient id="s2-donut-b" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#f26a0f" />
                <stop offset="1" stop-color="#e8530a" />
              </linearGradient>
            </defs>
            <g transform="rotate(-90 50 50)" fill="none" stroke-width="22">
              <circle class="s2-seg s2-seg-pale" cx="50" cy="50" r="34" pathLength="100" />
              <circle class="s2-seg s2-seg-dark" cx="50" cy="50" r="34" pathLength="100" />
              <circle class="s2-seg s2-seg-light" cx="50" cy="50" r="34" pathLength="100" />
            </g>
          </svg>
          <div class="s2-donut-center">
            <b>{{ alertCount.toLocaleString() }}</b>
            <small>alerts this week</small>
          </div>
        </div>

        <div class="s2-toast-stack" role="status" aria-live="polite">
          <Transition name="s2-toast" mode="out-in">
            <div :key="toastIndex" class="s2-toast">
              <div class="s2-toast-head">
                <span>notification</span>
                <svg class="s2-slack" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#36c5f0" d="M9.5 2a2 2 0 0 0 0 4H11V4a2 2 0 0 0-1.5-2zM9.5 7.5h-5a2 2 0 0 0 0 4h5a2 2 0 0 0 0-4z" />
                  <path fill="#2eb67d" d="M22 9.5a2 2 0 0 0-4 0V11h2a2 2 0 0 0 2-1.5zM16.5 9.5v-5a2 2 0 0 0-4 0v5a2 2 0 0 0 4 0z" />
                  <path fill="#ecb22e" d="M14.5 22a2 2 0 0 0 0-4H13v2a2 2 0 0 0 1.5 2zM14.5 16.5h5a2 2 0 0 0 0-4h-5a2 2 0 0 0 0 4z" />
                  <path fill="#e01e5a" d="M2 14.5a2 2 0 0 0 4 0V13H4a2 2 0 0 0-2 1.5zM7.5 14.5v5a2 2 0 0 0 4 0v-5a2 2 0 0 0-4 0z" />
                </svg>
              </div>
              <p>{{ notifications[toastIndex] }}</p>
            </div>
          </Transition>
        </div>
      </article>

      <!-- C · Multi-branch cloud sync & HQ control -->
      <article class="s2-card s2-c">
        <div class="txt">
          <h3 class="s2-h">Multi-branch cloud sync &amp; HQ control</h3>
          <p class="s2-p">
            Synchronize 1 to 100+ stores and warehouses in real time with sub-50ms sync latency and
            99.99% cloud uptime.
          </p>
        </div>
        <canvas
          ref="globeEl"
          class="s2-globe-canvas"
          role="img"
          aria-label="Rotating globe showing branches syncing with headquarters"
          @pointerdown="onGlobeDown"
          @pointermove="onGlobeMove"
          @pointerup="onGlobeUp"
          @pointercancel="onGlobeUp"
        ></canvas>
      </article>

      <!-- D · WordPress -->
      <article class="s2-card s2-d">
        <h3 class="s2-h">Instant WordPress &amp; web inquiry sync</h3>
        <div class="s2-search">
          <svg class="g" viewBox="0 0 24 24" fill="none" stroke-width="4">
            <circle
              cx="12"
              cy="12"
              r="8.5"
              stroke="#ea4335"
              stroke-dasharray="14 60"
              stroke-dashoffset="-6"
              transform="rotate(-20 12 12)"
            />
            <circle
              cx="12"
              cy="12"
              r="8.5"
              stroke="#fbbc05"
              stroke-dasharray="13 60"
              stroke-dashoffset="-27"
              transform="rotate(-20 12 12)"
            />
            <circle
              cx="12"
              cy="12"
              r="8.5"
              stroke="#34a853"
              stroke-dasharray="14 60"
              stroke-dashoffset="-42"
              transform="rotate(-20 12 12)"
            />
            <circle
              cx="12"
              cy="12"
              r="8.5"
              stroke="#4285f4"
              stroke-dasharray="14 60"
              stroke-dashoffset="-1"
              transform="rotate(100 12 12)"
            />
            <path d="M12 12h8.5" stroke="#4285f4" stroke-linecap="butt" />
          </svg>
          <span class="q">{{ query }}</span>
          <svg class="mic" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z"
            />
          </svg>
        </div>
        <div class="s2-res">
          <div class="top">
            <svg class="wp" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.8" />
              <text
                x="12"
                y="16.5"
                text-anchor="middle"
                font-family="Georgia,serif"
                font-weight="700"
                font-size="12"
                fill="currentColor"
              >
                W
              </text>
            </svg>
            <div>
              <div class="site">WordPress Site</div>
              <div class="crumb">yourwebsite.com › inquiry › lead-capture</div>
            </div>
            <span class="sync"
              ><i></i><span>{{ syncText }}</span></span
            >
          </div>
          <h4 :key="resultTitle" class="s2-swap">{{ resultTitle }}</h4>
          <div class="s2-sk"></div>
          <div class="s2-sk"></div>
        </div>
      </article>

      <!-- E · Plug & Play POS hardware & peripherals -->
      <article class="s2-card s2-e s2-dots">
        <h3 class="s2-h">Plug &amp; Play POS hardware &amp; peripherals</h3>
        <svg class="s2-circuit" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g>
            <path v-for="(d, i) in circuitPaths" :key="`b${i}`" :d="d" class="s2-trace" />
          </g>
          <g>
            <path
              v-for="(d, i) in circuitPaths"
              :key="`p${i}`"
              :d="d"
              class="s2-pulse"
              :style="{ animationDelay: `${i * -0.9}s` }"
            />
          </g>
          <circle v-for="(n, i) in circuitNodes" :key="`n${i}`" :cx="n[0]" :cy="n[1]" r="2.6" class="s2-node" />
        </svg>
        <div class="s2-core" aria-hidden="true"><span></span></div>
      </article>

      <!-- F · Reseller hub -->
      <article class="s2-card s2-f s2-dots tl">
        <a
          class="s2-arrow"
          href="#"
          aria-label="Open Reseller & Partner Hub"
          @click.prevent="$emit('open-partners')"
          ><svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 9l6-6M4 3h5v5" /></svg
        ></a>
        <div>
          <h3 class="s2-h">20+ Reseller &amp; Partner Hub</h3>
          <p class="s2-p">
            Provision client workspaces, track partner commissions, and manage accounts from one
            central hub.
          </p>
        </div>
        <div class="s2-partners">
          <div class="s2-stack">
            <span v-for="a in partnerAvatars" :key="a.id" class="av" v-html="a.svg"></span>
            <span class="plus">+</span>
          </div>
          <span class="s2-pill"
            ><b>{{ partnerCount }}+</b> Active Partners</span
          >
        </div>
      </article>

      <!-- G · Integrations -->
      <article class="s2-card s2-g s2-dots tl">
        <h3 class="s2-h"><b>20+ Integrations</b> to the<br />tools you already use</h3>
        <div class="s2-chiprows" aria-label="Supported integrations">
          <div v-for="(row, r) in chipRows" :key="r" class="s2-cr">
            <span v-for="(c, i) in row" :key="i" class="s2-chip" :style="{ '--d': c[1] }"
              ><i></i>{{ c[0] }}</span
            >
          </div>
        </div>
      </article>
    </div>

    <!-- ============ Trial modal ============ -->
    <Teleport to="body">
      <div
        ref="modalEl"
        class="s2-modal"
        :class="{ open: modalOpen }"
        role="dialog"
        aria-modal="true"
        aria-labelledby="s2-mt"
        :aria-hidden="!modalOpen"
      >
        <div class="s2-scrim" @click="closeModal"></div>
        <div class="s2-dialog">
          <div v-show="status !== 'done'">
            <div class="s2-mh">
              <h3 id="s2-mt">Experience Saptivo CRM</h3>
              <p>Get instant access to cloud terminal simulator &amp; 14-day trial</p>
              <button class="s2-x" type="button" aria-label="Close" @click="closeModal">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <form class="s2-form" novalidate @submit.prevent="submit">
              <div class="s2-fld" :class="{ err: errors.name }">
                <label for="s2-n">Your Full Name</label>
                <input
                  id="s2-n"
                  ref="nameInput"
                  v-model.trim="form.name"
                  placeholder="e.g. Alex Fernando"
                  autocomplete="name"
                  required
                  @input="errors.name = false"
                />
                <span class="em">Please enter your name</span>
              </div>
              <div class="s2-fld" :class="{ err: errors.business }">
                <label for="s2-b">Business / Store Name</label>
                <input
                  id="s2-b"
                  v-model.trim="form.business"
                  placeholder="e.g. Apex Hypermarket"
                  autocomplete="organization"
                  required
                  @input="errors.business = false"
                />
                <span class="em">Please enter your business</span>
              </div>
              <div class="s2-fld" :class="{ err: errors.phone }">
                <label for="s2-p">WhatsApp / Phone Number</label>
                <input
                  id="s2-p"
                  v-model.trim="form.phone"
                  type="tel"
                  inputmode="tel"
                  placeholder="+94 77 123 4567"
                  autocomplete="tel"
                  required
                  @input="errors.phone = false"
                />
                <span class="em">Enter a valid phone number</span>
              </div>
              <div class="s2-fld">
                <label for="s2-i">Industry Type</label>
                <select id="s2-i" v-model="form.industry">
                  <option v-for="o in industries" :key="o">{{ o }}</option>
                </select>
              </div>
              <ul class="s2-perks">
                <li v-for="p in perks" :key="p">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="9.5" />
                    <path d="m8 12.5 2.8 2.8L16.5 9.5" /></svg
                  >{{ p }}
                </li>
              </ul>
              <button class="s2-go" :class="{ loading: status === 'loading' }" type="submit">
                <span>Launch Free POS Sandbox</span>
              </button>
              <p class="s2-fine">No credit card required · Ready in under 2 minutes</p>
            </form>
          </div>
          <div class="s2-ok" :class="{ show: status === 'done' }">
            <svg class="ring" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" />
              <path d="m23 37 9 9 17-19" />
            </svg>
            <h3>Your sandbox is on the way!</h3>
            <p>
              Thanks <b>{{ form.name.split(' ')[0] }}</b
              >. A setup specialist will message you on <b>{{ form.phone }}</b> within 10 minutes to
              unlock your 14-day trial.
            </p>
            <button type="button" @click="closeModal">Done</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeSection2' })
/**
 * SectionTwo.vue — "Replace your Messy Excel Sheets" (Vue 3, <script setup>
defineOptions({ name: 'HomeSection2' })
)
 *
 * Props:
 *   :submit-trial="async (payload) => { await api.post('/trial', payload) }"
 *     payload = { name, business, phone, industry }. The success screen shows after it resolves;
 *     if it throws, the form stays open.
 * Events:
 *   @trial-request="payload => ..."   fired after a successful submit (good for analytics)
 *   @open-partners                    fired by the arrow on the Reseller card
 *
 * SSR/Nuxt: all browser APIs live inside onMounted, so it is safe to render on the server
 * (wrap in <ClientOnly> if you prefer to skip the SSR markup of the animated parts).
 */
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  /** async (payload) => void — call your API here. Throw to keep the form open. */
  submitTrial: { type: Function, default: null },
  preview: { type: Boolean, default: false },
})
const emit = defineEmits(['trial-request', 'open-partners'])

/* ------------------------------------------------------------------ state */
const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)

/* ------------------------------------------------------------------ avatars (inline SVG, deterministic) */
const skins = ['#f3cfae', '#e0a97c', '#b9794c', '#8a5632', '#f6dcc5']
const hairs = ['#25180f', '#4b2e1b', '#16161a', '#8b5a2b', '#caa25a', '#6b2e1e']
const shirts = ['#1f2a5a', '#e2552b', '#2f6f5e', '#3b3f5c', '#7a3b8f', '#c9972c']
const bgs = [
  ['#ffd9b8', '#ffb27f'],
  ['#c9dcff', '#8fb4ff'],
  ['#d8f0e3', '#8ad5b0'],
  ['#f4d6ff', '#cf9cf0'],
  ['#ffe9a8', '#f5c445'],
]
function avatar(seed0) {
  let seed = seed0
  const r = (n) => {
    seed = (seed * 9301 + 49297) % 233280
    return Math.floor((seed / 233280) * n)
  }
  const sk = skins[r(5)],
    hr = hairs[r(6)],
    sh = shirts[r(6)],
    bg = bgs[r(5)],
    long = r(3) === 0,
    id = 'av' + seed0
  return `<svg viewBox="0 0 40 40"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs>
    <rect width="40" height="40" fill="url(#${id})"/>${long ? `<path d="M10 17c0-8 4-11 10-11s10 3 10 11v12H10z" fill="${hr}"/>` : ''}
    <path d="M5 41c0-9 6-13 15-13s15 4 15 13z" fill="${sh}"/><rect x="17" y="22" width="6" height="7" rx="2" fill="${sk}"/>
    <circle cx="20" cy="16.5" r="7.6" fill="${sk}"/><path d="M12.3 16c-.3-5.5 3.3-9 7.7-9s8 3.5 7.7 9c-1.2-3.2-3.7-4.6-7.7-4.6S13.5 12.8 12.3 16z" fill="${hr}"/></svg>`
}

/* ------------------------------------------------------------------ A · icon rails */
const dotGrid = [2, 6, 10].flatMap((y) => [2, 6, 10].map((x) => [x, y]))
const icons = {
  fb: {
    color: '#1877f2',
    svg: `<circle cx="12" cy="12" r="11" fill="currentColor"/><path fill="#ecebe8" d="M13.4 21v-7.2h2.5l.4-3h-2.9V9c0-.9.3-1.4 1.5-1.4h1.5V5c-.3 0-1.2-.1-2.2-.1-2.200 0-3.700 1.300-3.700 3.800v1.900H7.700v3h2.800V21z"/>`,
  },
  wa: {
    color: '#25d366',
    svg: `<path fill="currentColor" d="M12 1.5a10.4 10.4 0 0 0-8.9 15.7L1.6 22.5l5.5-1.4A10.4 10.4 0 1 0 12 1.5z"/><path fill="#ecebe8" d="M8.4 6.9c-.4 0-.8.2-1 .6-.6 1.1-.2 2.6 1.3 4.3 1.6 1.9 3.200 2.800 4.700 2.900.8 0 1.500-.4 1.700-1.100l.1-.5-2-1-.8.900c-1.100-.4-2.100-1.400-2.700-2.500l.8-.8-.9-2.100c-.1-.3-.4-.7-1.200-.7z"/>`,
  },
  ms: {
    color: '#a033ff',
    svg: `<path fill="currentColor" d="M12 1.5C6.200 1.500 1.700 5.900 1.700 11.400c0 3 1.400 5.700 3.700 7.500v3.600l3.400-1.900c1 .3 2 .4 3.200.4 5.800 0 10.300-4.400 10.300-9.600S17.800 1.500 12 1.500z"/><path fill="#ecebe8" d="m5.900 14.300 3.800-4 2.100 2.100 4.200-2.200-3.900 4.100-2.100-2.100z"/>`,
  },
  cal: {
    color: '#1a73e8',
    svg: `<rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="currentColor"/><rect x="2.5" y="2.5" width="19" height="5.5" rx="2.5" fill="rgba(0,0,0,.18)"/><text x="12" y="18" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="700" font-size="9.5" fill="#ecebe8">31</text>`,
  },
  wp: {
    color: '#21759b',
    svg: `<circle cx="12" cy="12" r="11" fill="currentColor"/><text x="12" y="16.8" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="14" fill="#ecebe8">W</text>`,
  },
  cx: {
    color: '#1f3a8a',
    svg: `<text x="12" y="15.8" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="700" font-size="9.5" letter-spacing="-.2" fill="currentColor">3CX</text>`,
  },
}
const x4 = (a) => [...a, ...a, ...a, ...a]
const railRows = [
  x4(['fb', 'wa', 'ms', 'cal', 'wp', 'cx']),
  x4(['cx', 'cal', 'wp', 'fb', 'ms', 'wa']),
]

/* ------------------------------------------------------------------ B · alerts (donut + toast) */
/* Notifications mirror real CRM events (inquiries, 3CX calls, tasks, receipts). */
const notifications = [
  'WhatsApp Digital Receipt Dispatched',
  'New inquiry from John Smith · Inquiry #28',
  'Missed call logged · 3CX · 755322689',
  '3 team tasks are overdue',
  'Quotation approved · Invoice created',
]
const alertCount = ref(0)
const toastIndex = ref(0)
let countRaf = 0

function countAlerts(to = 1284, ms = 1400) {
  if (reduceMotion) {
    alertCount.value = to
    return
  }
  const start = performance.now()
  const tick = (now) => {
    const t = Math.min(1, (now - start) / ms)
    alertCount.value = Math.round(to * (1 - Math.pow(1 - t, 3)))
    if (t < 1) countRaf = requestAnimationFrame(tick)
  }
  countRaf = requestAnimationFrame(tick)
}

/* ------------------------------------------------------------------ C · globe */

/* The globe is drawn on a <canvas> (see template ref="globeEl"). */
const globeEl = ref(null)

/* Dotted land mask: [latitude, cells per ring, [start, length, …]] */
const LAND = [[-30,164,[49,10,90,6,134,18]],[-28.1,167,[51,10,91,8,136,19]],[-26.2,170,[52,10,92,9,139,18]],[-24.3,173,[53,11,93,10,108,1,141,18]],[-22.4,175,[53,14,94,11,109,2,143,18]],[-20.5,177,[54,15,95,11,110,2,146,16,169,1]],[-18.6,180,[55,15,96,12,112,3,151,12]],[-16.7,181,[54,17,96,14,113,3,153,7,161,3,180,1]],[-14.8,183,[53,19,98,14,116,1,155,5,163,2]],[-12.9,185,[53,20,99,14,159,4,165,1]],[-11,186,[53,21,100,14,166,1]],[-9.1,187,[53,22,100,14,158,1,167,1,170,1]],[-7.2,188,[52,24,101,14,150,3,166,5]],[-5.3,189,[52,24,101,14,149,1,157,1,167,4]],[-3.4,189,[52,22,100,16,148,2,154,2,157,2,164,6,174,1]],[-1.5,189,[52,19,99,17,147,2,152,4,157,2,163,2]],[0.4,189,[52,16,99,18,147,2,152,4,157,1,159,1,161,1]],[2.3,189,[53,15,100,19,146,1,148,1,153,3]],[4.2,189,[54,13,99,21,145,1,147,2,154,2]],[6.1,188,[54,10,88,7,96,24,146,1,159,1]],[8,188,[51,1,53,10,87,33,134,1,136,1,158,2]],[9.9,187,[49,1,54,2,57,4,86,34,133,2,148,1,157,1]],[11.8,185,[48,1,55,2,84,31,118,1,131,3,143,1,145,4]],[13.7,184,[46,3,83,30,114,2,130,3,142,6,154,1]],[15.6,182,[44,5,83,28,113,4,128,4,140,6]],[17.5,181,[40,6,82,28,112,6,127,5,138,6,151,1]],[19.4,179,[37,5,44,2,53,2,81,27,110,8,126,6,136,6,144,1]],[21.3,177,[37,4,45,1,50,1,80,27,108,10,123,8,134,7,142,1]],[23.2,174,[36,4,79,25,106,10,120,23,145,1]],[25.1,172,[32,1,34,5,79,24,104,7,112,1,118,25]],[27,169,[31,1,33,6,46,1,78,22,101,7,109,32]],[28.9,166,[30,9,45,1,78,27,106,33]],[30.8,163,[29,16,77,60]],[32.7,159,[28,16,75,11,95,38,137,1]],[34.6,156,[26,19,75,8,94,36,135,2]],[36.5,152,[25,19,73,1,76,5,85,1,88,39,129,2,134,1]],[38.4,148,[23,20,70,4,80,1,83,1,85,9,96,26,125,2,131,1]],[40.3,145,[22,21,69,4,80,2,83,10,94,27,122,2,129,1]],[42.2,140,[22,20,66,5,73,3,77,4,86,3,90,31,124,1]],[44.1,136,[21,21,43,1,67,4,72,1,74,5,83,3,87,32,121,1]],[46,132,[21,23,66,11,78,1,80,4,85,32]],[47.9,127,[20,21,43,2,62,51]],[49.8,122,[18,20,39,1,41,1,61,49]],[51.7,117,[17,15,33,7,57,2,60,44,109,1]],[53.6,112,[16,14,31,8,53,1,55,1,58,42,104,2]],[55.5,107,[5,1,14,14,30,6,52,1,57,1,60,34,100,2]],[57.4,102,[6,2,13,12,29,4,49,1,54,2,58,33,95,2]],[59.3,97,[5,2,11,12,27,3,50,3,55,35]],[61.2,91,[4,18,26,1,33,2,47,3,51,34,87,2]],[63.1,86,[2,1,4,17,26,2,31,2,45,2,48,38]],[65,80,[1,1,3,18,23,2,28,3,35,2,42,3,46,2,49,31]],[66.9,74,[0,2,3,17,22,2,26,4,40,5,47,27]],[68.8,69,[3,9,13,1,16,3,20,1,25,4,38,4,46,1,49,20]],[70.7,63,[4,1,11,2,16,3,22,6,36,1,41,1,43,1,45,14]],[72.6,57,[9,7,20,5,39,1,41,8]],[74.5,51,[9,1,13,1,17,6,33,1,38,3]],[76.4,45,[7,1,12,1,14,6,30,1,35,2]],[78.3,38,[9,8,20,1]],[80.2,32,[7,7,24,1]]]

const RAD = Math.PI / 180
const landDots = []
for (const [lat, n, runs] of LAND) {
  for (let k = 0; k < runs.length; k += 2) {
    for (let i = runs[k]; i < runs[k] + runs[k + 1]; i++) {
      const lon = -180 + ((i + 0.5) * 360) / n
      const a = Math.abs(lat)
      landDots.push({
        x: Math.cos(lat * RAD) * Math.sin(lon * RAD),
        y: Math.sin(lat * RAD),
        z: Math.cos(lat * RAD) * Math.cos(lon * RAD),
        rgb: a < 24 ? [226, 184, 112] : a < 52 ? [112, 178, 108] : [226, 238, 246],
      })
    }
  }
}

/* faces drawn on the globe pins */
const people = [
  { bg: '#f7d9c4', skin: '#f0bd98', hair: '#2b1d16', shirt: '#26304a' },
  { bg: '#d8e6f5', skin: '#d99d76', hair: '#14110f', shirt: '#6b7280' },
  { bg: '#fbe3d1', skin: '#f6d2b5', hair: '#7a4a2a', shirt: '#f26a0f' },
  { bg: '#dcebe4', skin: '#b87a56', hair: '#1c1512', shirt: '#14162b' },
  { bg: '#e6def5', skin: '#e8b48c', hair: '#3b2418', shirt: '#2f7a6b' },
  { bg: '#fde8c8', skin: '#c58a63', hair: '#0f0d0c', shirt: '#4f46e5' },
  { bg: '#e0eef5', skin: '#f2c9a5', hair: '#a66b3a', shirt: '#be3d2a' },
  { bg: '#e9e1d6', skin: '#8f5a3c', hair: '#0c0a09', shirt: '#0f766e' },
]

const vec = (lat, lon) => ({
  x: Math.cos(lat * RAD) * Math.sin(lon * RAD),
  y: Math.sin(lat * RAD),
  z: Math.cos(lat * RAD) * Math.cos(lon * RAD),
})

const cities = [
  { lat: 6.93, lon: 79.85, hq: true, p: 0 }, // Colombo — HQ
  { lat: 51.5, lon: -0.12, p: 1 },
  { lat: 40.7, lon: -74, p: 2 },
  { lat: 25.2, lon: 55.3, p: 3 },
  { lat: 28.6, lon: 77.2, p: 4 },
  { lat: 39.9, lon: 116.4, p: 5 },
  { lat: 35.7, lon: 139.7, p: 6 },
  { lat: 41, lon: 28.9, p: 7 },
  { lat: 55.7, lon: 37.6, p: 1 },
  { lat: 43.7, lon: -79.4, p: 3 },
  { lat: 52.5, lon: 13.4, p: 2 },
  { lat: 1.35, lon: 103.8, p: 4 },
].map((c) => ({ ...c, v: vec(c.lat, c.lon) }))

let destroyed = false
let globeRaf = 0
let globeVisible = false
let lon0 = 20
let dragging = false
let dragX = 0
let lastT = 0

function drawFace(ctx, x, y, r, p) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.clip()
  ctx.fillStyle = p.bg
  ctx.fillRect(x - r, y - r, r * 2, r * 2)
  ctx.fillStyle = p.shirt
  ctx.beginPath()
  ctx.ellipse(x, y + r * 0.95, r * 0.95, r * 0.62, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = p.skin
  ctx.beginPath()
  ctx.arc(x, y - r * 0.12, r * 0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = p.hair
  ctx.beginPath()
  ctx.arc(x, y - r * 0.18, r * 0.42, Math.PI * 1.02, Math.PI * 1.98)
  ctx.fill()
  ctx.restore()
}

function renderGlobe(t) {
  const canvas = globeEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = canvas.width / canvas.clientWidth
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (!w || !h) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const R = Math.min(w * 0.34, 190)
  const cx = w * 0.62 // nudged right so the copy on the left stays clear
  const peek = Math.round(h * 0.44) // how much of the globe peeks into the card
  const cy = h - peek + R
  const tilt = 12 * RAD
  const cl = Math.cos(lon0 * RAD)
  const sl = Math.sin(lon0 * RAD)
  const ct = Math.cos(tilt)
  const st = Math.sin(tilt)

  // world vector → view space (rotate about Y by lon0, then tilt about X)
  const view = (v, s = 1) => {
    const x1 = v.x * cl - v.z * sl
    const z1 = v.z * cl + v.x * sl
    return { x: cx + x1 * R * s, y: cy - (v.y * ct - z1 * st) * R * s, z: v.y * st + z1 * ct }
  }

  // atmosphere
  let g = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.22)
  g.addColorStop(0, 'rgba(70,160,255,.45)')
  g.addColorStop(1, 'rgba(70,160,255,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2)
  ctx.fill()

  // ocean
  g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.45, R * 0.1, cx, cy, R)
  g.addColorStop(0, '#2a67b0')
  g.addColorStop(0.55, '#0e2d5c')
  g.addColorStop(1, '#050f24')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.clip()

  // graticule
  ctx.strokeStyle = 'rgba(140,200,255,.12)'
  ctx.lineWidth = 0.7
  for (let lo = -180; lo < 180; lo += 30) {
    ctx.beginPath()
    let pen = false
    for (let la = -80; la <= 80; la += 5) {
      const p = view(vec(la, lo))
      if (p.z > 0) {
        if (pen) ctx.lineTo(p.x, p.y)
        else ctx.moveTo(p.x, p.y)
        pen = true
      } else pen = false
    }
    ctx.stroke()
  }
  for (let la = -60; la <= 60; la += 30) {
    ctx.beginPath()
    let pen = false
    for (let lo = -180; lo <= 180; lo += 5) {
      const p = view(vec(la, lo))
      if (p.z > 0) {
        if (pen) ctx.lineTo(p.x, p.y)
        else ctx.moveTo(p.x, p.y)
        pen = true
      } else pen = false
    }
    ctx.stroke()
  }

  // land
  for (const d of landDots) {
    const p = view(d)
    if (p.z <= 0.02) continue
    const k = Math.pow(p.z, 0.55)
    ctx.fillStyle = `rgba(${d.rgb[0]},${d.rgb[1]},${d.rgb[2]},${0.3 + 0.7 * k})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, 0.8 + 1.35 * k, 0, Math.PI * 2)
    ctx.fill()
  }

  // limb darkening
  g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.5, cx, cy, R * 1.02)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(2,8,22,.55)')
  ctx.fillStyle = g
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2)
  ctx.restore()

  // rim
  ctx.save()
  ctx.lineWidth = 4
  ctx.strokeStyle = '#3d9bff'
  ctx.shadowColor = 'rgba(70,160,255,.9)'
  ctx.shadowBlur = 16
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // sync arcs HQ → branches
  const hq = cities[0]
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineWidth = 1.6
  ctx.setLineDash([3, 7])
  ctx.lineDashOffset = -(t / 1000) * 26
  for (let i = 1; i < cities.length; i++) {
    const c = cities[i]
    const dot = Math.max(-1, Math.min(1, hq.v.x * c.v.x + hq.v.y * c.v.y + hq.v.z * c.v.z))
    const om = Math.acos(dot)
    if (om < 0.01) continue
    ctx.beginPath()
    let pen = false
    for (let s = 0; s <= 1.0001; s += 0.04) {
      const a = Math.sin((1 - s) * om) / Math.sin(om)
      const b = Math.sin(s * om) / Math.sin(om)
      const lift = 1 + 0.2 * Math.sin(Math.PI * s)
      const v = {
        x: (hq.v.x * a + c.v.x * b) * lift,
        y: (hq.v.y * a + c.v.y * b) * lift,
        z: (hq.v.z * a + c.v.z * b) * lift,
      }
      const p = view(v)
      if (p.z > 0.02) {
        if (pen) ctx.lineTo(p.x, p.y)
        else ctx.moveTo(p.x, p.y)
        pen = true
      } else pen = false
    }
    ctx.strokeStyle = 'rgba(255,140,70,.8)'
    ctx.shadowColor = 'rgba(255,120,50,.9)'
    ctx.shadowBlur = 6
    ctx.stroke()
  }
  ctx.restore()

  // pins
  const pins = cities.map((c) => ({ c, s: view(c.v), top: view(c.v, 1.16) })).sort((a, b) => a.s.z - b.s.z)
  for (const { c, s, top } of pins) {
    if (s.z <= 0.05) continue
    const al = Math.min(1, (s.z - 0.05) / 0.25)
    ctx.save()
    ctx.globalAlpha = al
    ctx.strokeStyle = 'rgba(255,255,255,.65)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(top.x, top.y)
    ctx.stroke()
    ctx.fillStyle = '#ff7a30'
    ctx.beginPath()
    ctx.arc(s.x, s.y, 2.6, 0, Math.PI * 2)
    ctx.fill()
    if (c.hq) {
      const ph = ((t / 1400) % 1)
      ctx.strokeStyle = `rgba(255,122,48,${0.7 * (1 - ph)})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(s.x, s.y, 4 + ph * 22, 0, Math.PI * 2)
      ctx.stroke()
    }
    const r = c.hq ? 15 : 12
    ctx.shadowColor = 'rgba(15,23,42,.45)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetY = 3
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(top.x, top.y, r + 2.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowColor = 'transparent'
    drawFace(ctx, top.x, top.y, r, people[c.p])
    if (c.hq) {
      ctx.strokeStyle = '#ff6a1a'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(top.x, top.y, r + 2.5, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.restore()
  }
}

function sizeGlobe() {
  const canvas = globeEl.value
  if (!canvas) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const r = canvas.getBoundingClientRect()
  canvas.width = Math.round(r.width * dpr)
  canvas.height = Math.round(r.height * dpr)
  renderGlobe(performance.now())
}

function globeLoop(t) {
  if (!globeVisible) return
  const dt = lastT ? Math.min(64, t - lastT) : 16
  lastT = t
  if (!dragging) lon0 += dt * 0.006
  renderGlobe(t)
  globeRaf = requestAnimationFrame(globeLoop)
}

function startGlobe() {
  if (reduceMotion || globeRaf) return
  lastT = 0
  globeRaf = requestAnimationFrame(globeLoop)
}
function stopGlobe() {
  cancelAnimationFrame(globeRaf)
  globeRaf = 0
}

function onGlobeDown(e) {
  dragging = true
  dragX = e.clientX
  globeEl.value?.setPointerCapture?.(e.pointerId)
}
function onGlobeMove(e) {
  if (!dragging) return
  lon0 -= (e.clientX - dragX) * 0.4
  dragX = e.clientX
  if (reduceMotion) renderGlobe(performance.now())
}
function onGlobeUp() {
  dragging = false
}
/* ------------------------------------------------------------------ D · typing search */
const queries = [
  [
    'Incoming Inquiry • WordPress Webhook Sync',
    'Incoming Inquiry from WordPress Site',
    'Synced · 0.3s',
  ],
  ['New Lead • Contact Form 7 → CRM', 'New Lead captured: Apex Hypermarket', 'Synced · 0.2s'],
  [
    'Quotation Request • WooCommerce Enquiry',
    'Quotation request #Q-2087 received',
    'Synced · 0.4s',
  ],
]
const query = ref(queries[0][0])
const resultTitle = ref(queries[0][1])
const syncText = ref(queries[0][2])

/* ------------------------------------------------------------------ E · hardware circuit */
const circuitPaths = [
  'M8 96 H92 l22 22 H246',
  'M30 166 H170 l16 16 H246',
  'M16 226 H118 l22 -22 H246',
  'M348 150 H372 l14 -14 V52',
  'M297 112 V74 l12 -12 H376',
  'M297 214 V250 l-14 14 H176',
]
const circuitNodes = [
  [8, 96],
  [30, 166],
  [16, 226],
  [386, 52],
  [376, 62],
  [176, 264],
]

/* ------------------------------------------------------------------ F · partners */
const partnerAvatars = [11, 52, 93, 134].map((s) => ({ id: s, svg: avatar(s * 13) }))
const partnerCount = ref(20)

/* ------------------------------------------------------------------ G · integrations */
const integrations = [
  ['Instagram Leads', '#e1306c'],
  ['WordPress', '#21759b'],
  ['3CX Telephony', '#1f3a8a'],
  ['WhatsApp', '#25d366'],
  ['Meta Lead Ads', '#1877f2'],
  ['Facebook Leads', '#1877f2'],
  ['PDF Invoicing', '#f2540c'],
  ['WooCommerce Sync', '#7f54b3'],
  ['Stripe & Payments', '#635bff'],
  ['Zapier Automation', '#ff4a00'],
  ['Google Calendar', '#1a73e8'],
  ['PDF Quotations', '#f59e0b'],
  ['POS Barcode Scanner', '#6d28d9'],
  ['Thermal Printers', '#64748b'],
  ['Cloud Inventory', '#0ea5e9'],
  ['REST API', '#16a34a'],
  ['Webhooks', '#9333ea'],
  ['Multi-Branch Sync', '#ef4444'],
]
const chipRows = [0, 1, 2].map((r) => x4(integrations.filter((_, i) => i % 3 === r)))

/* ------------------------------------------------------------------ modal */
const industries = [
  'Supermarket & Grocery',
  'Pharmacy & Healthcare',
  'Restaurant & Café',
  'Fashion & Apparel',
  'Electronics & Hardware',
  'Wholesale & Distribution',
  'Other',
]
const perks = ['Instant 14-Day Cloud Sandbox', 'Dedicated Setup Specialist']
const modalOpen = ref(false)
const modalEl = ref(null)
const nameInput = ref(null)
const openBtn = ref(null)
const status = ref('idle') // idle | loading | done
const form = reactive({ name: '', business: '', phone: '', industry: industries[0] })
const errors = reactive({ name: false, business: false, phone: false })

function openModal() {
  Object.assign(form, { name: '', business: '', phone: '', industry: industries[0] })
  Object.assign(errors, { name: false, business: false, phone: false })
  status.value = 'idle'
  modalOpen.value = true
  nextTick(() => setTimeout(() => nameInput.value?.focus(), 120))
}
function closeModal() {
  modalOpen.value = false
  openBtn.value?.focus()
}
watch(modalOpen, (o) => document.body.classList.toggle('s2-lock', o))

async function submit() {
  errors.name = form.name.length < 2
  errors.business = form.business.length < 2
  errors.phone = form.phone.replace(/\D/g, '').length < 9
  if (errors.name || errors.business || errors.phone) return
  status.value = 'loading'
  const payload = { ...form }
  try {
    await Promise.all([props.submitTrial?.(payload), new Promise((r) => setTimeout(r, 900))])
    emit('trial-request', payload)
    status.value = 'done'
  } catch (e) {
    status.value = 'idle'
    console.error('[SectionTwo] trial request failed', e)
  }
}
function onKey(e) {
  if (!modalOpen.value) return
  if (e.key === 'Escape') return closeModal()
  if (e.key === 'Tab') {
    const f = [...modalEl.value.querySelectorAll('button,input,select')].filter(
      (x) => x.offsetParent !== null,
    )
    if (!f.length) return
    const a = f[0],
      z = f[f.length - 1]
    if (e.shiftKey && document.activeElement === a) {
      e.preventDefault()
      z.focus()
    } else if (!e.shiftKey && document.activeElement === z) {
      e.preventDefault()
      a.focus()
    }
  }
}

/* ------------------------------------------------------------------ misc */
function spotlight(e) {
  const c = e.target.closest?.('.s2-card')
  if (!c) return
  const r = c.getBoundingClientRect()
  c.style.setProperty('--mx', e.clientX - r.left + 'px')
  c.style.setProperty('--my', e.clientY - r.top + 'px')
}

let reduceMotion = false
const timers = new Set()
const observers = []
function every(fn, ms) {
  const id = setInterval(fn, ms)
  timers.add(id)
}
const wait = (ms) =>
  new Promise((r) => {
    const id = setTimeout(r, ms)
    timers.add(id)
  })

async function typeLoop() {
  await wait(3600)
  let qi = 0
  while (!destroyed) {
    qi = (qi + 1) % queries.length
    const [q, title, s] = queries[qi]
    while (query.value.length && !destroyed) {
      query.value = query.value.slice(0, -2)
      await wait(14)
    }
    for (let i = 1; i <= q.length && !destroyed; i++) {
      query.value = q.slice(0, i)
      await wait(32)
    }
    await wait(350)
    resultTitle.value = title
    syncText.value = s
    await wait(3800)
  }
}
function countUp() {
  if (reduceMotion) return
  partnerCount.value = 0
  every(function tick() {
    if (partnerCount.value >= 20) return
    partnerCount.value += 2
  }, 70)
}

onMounted(() => {
  mounted.value = true
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('keydown', onKey)

  // reveal on scroll
  const io = new IntersectionObserver(
    (es, o) => {
      if (es[0].isIntersecting) {
        revealed.value = true
        countAlerts()
        countUp()
        o.disconnect()
      }
    },
    { threshold: 0.12 },
  )
  io.observe(rootEl.value)
  observers.push(io)

  // globe: size + draw once, then spin only while on screen
  sizeGlobe()
  const ro = new ResizeObserver(sizeGlobe)
  ro.observe(globeEl.value)
  observers.push(ro)
  const gio = new IntersectionObserver(
    (es) => {
      globeVisible = es.some((e) => e.isIntersecting)
      if (globeVisible) startGlobe()
      else stopGlobe()
    },
    { threshold: 0.12 },
  )
  gio.observe(globeEl.value)
  observers.push(gio)

  if (reduceMotion) return

  // rotate alert toasts, run the search typewriter
  every(() => {
    toastIndex.value = (toastIndex.value + 1) % notifications.length
  }, 3400) 
  typeLoop()
})

onBeforeUnmount(() => {
  destroyed = true
  stopGlobe()
  cancelAnimationFrame(countRaf)
  window.removeEventListener('keydown', onKey)
  document.body.classList.remove('s2-lock')
  observers.forEach((o) => o.disconnect())
  timers.forEach((t) => {
    clearInterval(t)
    clearTimeout(t)
  })
})
</script>

<style>
/* ============ tokens ============ */
.s2 {
  --ink: #14152b;
  --ink-2: #2b2d45;
  --muted: #6c7084;
  --line: rgba(20, 21, 43, 0.07);
  --o1: #ff7a1a;
  --o2: #f2540c;
  --o3: #ffb27f;
  --peach: #fff1e7;
  --peach-2: #ffe4d2;
  --card: #fbf9f7;
  --card-2: #f6f3f0;
  --page: #f2f1ee;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(48px, 7vw, 96px) clamp(16px, 4vw, 40px) clamp(56px, 8vw, 110px);
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  background:
    radial-gradient(900px 420px at 12% -8%, rgba(255, 122, 26, 0.1), transparent 60%),
    radial-gradient(800px 420px at 92% 108%, rgba(255, 122, 26, 0.09), transparent 60%), var(--page);
}
.s2 *,
.s2-modal,
.s2-modal * {
  box-sizing: border-box;
}
.s2 svg {
  display: block;
}

/* ============ heading ============ */
.s2-head {
  max-width: 760px;
  margin: 0 auto clamp(28px, 4vw, 48px);
  text-align: center;
}
.s2-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--line);
  backdrop-filter: blur(6px);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-2);
  box-shadow: 0 6px 18px -10px rgba(20, 21, 43, 0.25);
}
.s2-eyebrow i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--o1);
  box-shadow: 0 0 0 0 rgba(255, 122, 26, 0.5);
  animation: s2-ping 2s infinite;
}
.s2-title {
  margin: 18px 0 0;
  font-weight: 300;
  font-size: clamp(28px, 4.4vw, 46px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.s2-title b {
  font-weight: 500;
  position: relative;
  white-space: nowrap;
}
.s2-title b svg {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  width: 100%;
  height: 12px;
  overflow: visible;
}
.s2-title b path {
  fill: none;
  stroke: url(#s2-ul);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 320;
  stroke-dashoffset: 320;
  transition: stroke-dashoffset 1.4s 0.5s var(--ease);
}
.s2-in .s2-title b path {
  stroke-dashoffset: 0;
}
.s2-sub {
  margin: 20px auto 0;
  max-width: 520px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}

/* ============ grid ============ */
.s2-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: 212px 212px 170px;
}
.s2-a {
  grid-column: 1/5;
  grid-row: 1/3;
}
.s2-b {
  grid-column: 5/8;
  grid-row: 1;
}
.s2-c {
  grid-column: 8/13;
  grid-row: 1;
}
.s2-d {
  grid-column: 5/10;
  grid-row: 2;
}
.s2-e {
  grid-column: 10/13;
  grid-row: 2;
}
.s2-f {
  grid-column: 1/7;
  grid-row: 3;
}
.s2-g {
  grid-column: 7/13;
  grid-row: 3;
}

.s2-card {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  padding: 20px 22px;
  background: linear-gradient(180deg, #fdfcfa 0%, var(--card-2) 100%);
  border: 1px solid var(--line);
  box-shadow:
    0 1px 0 #fff inset,
    0 1px 2px rgba(20, 21, 43, 0.04),
    0 18px 40px -26px rgba(20, 21, 43, 0.28);
  transition:
    transform 0.6s var(--ease),
    box-shadow 0.6s var(--ease),
    border-color 0.4s;
}
.s2-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 122, 26, 0.28);
  box-shadow:
    0 1px 0 #fff inset,
    0 2px 4px rgba(20, 21, 43, 0.04),
    0 30px 54px -26px rgba(242, 84, 12, 0.3);
}
/* mouse-follow spotlight */
.s2-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.4s;
  background: radial-gradient(
    360px circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 122, 26, 0.11),
    transparent 55%
  );
}
.s2-card:hover::before {
  opacity: 1;
}
.s2-card > * {
  position: relative;
  z-index: 1;
}
/* dotted texture */
.s2-dots::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: radial-gradient(rgba(20, 21, 43, 0.16) 1px, transparent 1.4px);
  background-size: 9px 9px;
  -webkit-mask-image: radial-gradient(70% 90% at 100% 100%, #000, transparent 70%);
  mask-image: radial-gradient(70% 90% at 100% 100%, #000, transparent 70%);
  opacity: 0.55;
}
.s2-dots.tl::after {
  -webkit-mask-image: radial-gradient(60% 80% at 100% 0, #000, transparent 70%);
  mask-image: radial-gradient(60% 80% at 100% 0, #000, transparent 70%);
}

.s2-h {
  margin: 0;
  font-size: 15px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.s2-p {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.65;
  color: var(--muted);
}

/* reveal */
.s2-js .s2-card {
  opacity: 0;
  transform: translateY(26px) scale(0.98);
}
.s2-js.s2-in .s2-card {
  opacity: 1;
  transform: none;
  transition:
    opacity 0.8s var(--ease),
    transform 0.9s var(--ease),
    box-shadow 0.6s var(--ease),
    border-color 0.4s;
}
.s2-preview .s2-card {
  opacity: 1;
  transform: none;
  transition: none;
}
.s2-js.s2-in .s2-card:hover {
  transform: translateY(-4px);
}
.s2-js.s2-in .s2-a {
  transition-delay: 0.05s, 0.05s, 0s, 0s;
}
.s2-js.s2-in .s2-b {
  transition-delay: 0.15s, 0.15s, 0s, 0s;
}
.s2-js.s2-in .s2-c {
  transition-delay: 0.25s, 0.25s, 0s, 0s;
}
.s2-js.s2-in .s2-d {
  transition-delay: 0.35s, 0.35s, 0s, 0s;
}
.s2-js.s2-in .s2-e {
  transition-delay: 0.45s, 0.45s, 0s, 0s;
}
.s2-js.s2-in .s2-f {
  transition-delay: 0.55s, 0.55s, 0s, 0s;
}
.s2-js.s2-in .s2-g {
  transition-delay: 0.65s, 0.65s, 0s, 0s;
}
.s2-js.s2-in .s2-card:hover {
  transition-delay: 0s;
}

/* ============ A · POS workstation ============ */
.s2-a {
  display: flex;
  flex-direction: column;
  padding: 12px 12px 22px;
}
.s2-rail {
  position: relative;
  flex: 0 0 auto;
  height: 176px;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, #ecebe8, #e6e4e0);
  border: 1px solid rgba(20, 21, 43, 0.06);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    inset 0 -14px 30px -20px rgba(20, 21, 43, 0.18);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.s2-rail::before,
.s2-rail::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(20, 21, 43, 0.12);
}
.s2-rail::before {
  top: 10px;
}
.s2-rail::after {
  bottom: 10px;
}
.s2-row {
  display: flex;
  gap: 30px;
  width: max-content;
  animation: s2-mq 34s linear infinite;
}
.s2-row.rev {
  animation-direction: reverse;
  animation-duration: 40s;
}
.s2-rail:hover .s2-row {
  animation-play-state: paused;
}
.s2-ic {
  --c: #6f6f76;
  width: 46px;
  height: 46px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: var(--c);
  transition:
    transform 0.35s var(--ease),
    color 0.3s,
    background 0.3s,
    box-shadow 0.3s;
}
.s2-ic svg {
  width: 34px;
  height: 34px;
}
.s2-ic:hover {
  transform: translateY(-4px) scale(1.14);
  color: var(--b);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 12px 22px -10px rgba(20, 21, 43, 0.35);
}
.s2-a-body {
  padding: 20px 12px 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.s2-a-body .s2-h {
  font-size: 16px;
}
.s2-btn {
  margin-top: auto;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  padding: 7px 16px 7px 8px;
  border-radius: 999px;
  border: 1px solid rgba(20, 21, 43, 0.1);
  background: #fff;
  font:
    500 12.5px/1 'Poppins',
    sans-serif;
  color: var(--ink);
  box-shadow: 0 6px 16px -10px rgba(20, 21, 43, 0.4);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.3s var(--ease),
    box-shadow 0.3s,
    border-color 0.3s;
}
.s2-btn .gl {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, var(--o1), var(--o2));
  box-shadow:
    0 6px 12px -4px rgba(242, 84, 12, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.s2-btn .gl svg {
  width: 12px;
  height: 12px;
}
.s2-btn .ar {
  width: 0;
  opacity: 0;
  transition:
    width 0.35s var(--ease),
    opacity 0.3s,
    margin 0.3s;
  margin-left: -4px;
  overflow: hidden;
  color: var(--o2);
}
.s2-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 122, 26, 0.5);
  box-shadow: 0 14px 26px -12px rgba(242, 84, 12, 0.5);
}
.s2-btn:hover .ar {
  width: 14px;
  opacity: 1;
  margin-left: 0;
}
.s2-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    transparent 30%,
    rgba(255, 150, 70, 0.25) 50%,
    transparent 70%
  );
  transform: translateX(-120%);
  transition: transform 0.8s;
}
.s2-btn:hover::after {
  transform: translateX(120%);
}
.s2-btn:focus-visible,
.s2-arrow:focus-visible {
  outline: 2px solid var(--o1);
  outline-offset: 3px;
}

/* ============ B · alerts (donut + toast) ============ */
.s2-b .s2-h {
  position: relative;
  z-index: 2;
  max-width: 190px;
}
.s2-donut {
  position: absolute;
  left: 50%;
  top: 54px;
  width: 150px;
  height: 150px;
  margin-left: -75px;
  z-index: 1;
  filter: drop-shadow(0 18px 20px rgb(242 106 15 / 18%));
}
.s2-donut svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.s2-seg {
  stroke-dashoffset: 0;
  transition: stroke-width 0.3s ease;
}
.s2-seg-pale {
  stroke: #fdebe2;
  stroke-dasharray: 16.4 100;
}
.s2-seg-dark {
  stroke: url(#s2-donut-b);
  stroke-dasharray: 24.4 100;
  stroke-dashoffset: -17;
}
.s2-seg-light {
  stroke: url(#s2-donut-a);
  stroke-dasharray: 57.4 100;
  stroke-dashoffset: -42;
}
.s2-in .s2-seg {
  animation: s2-seg-draw 1.1s cubic-bezier(0.3, 0.8, 0.2, 1) both;
}
.s2-in .s2-seg-dark {
  animation-delay: 0.15s;
}
.s2-in .s2-seg-pale {
  animation-delay: 0.3s;
}
@keyframes s2-seg-draw {
  from {
    stroke-dasharray: 0 100;
  }
}
.s2-b:hover .s2-seg-dark {
  stroke-width: 25;
}
.s2-donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 26px;
  text-align: center;
}
.s2-donut-center b {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.s2-donut-center small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 0.6rem;
}
.s2-toast-stack {
  position: absolute;
  left: 50%;
  bottom: 9px;
  width: calc(100% - 56px);
  margin-left: calc((100% - 56px) / -2);
  z-index: 3;
}
/* faint sheets stacked behind the toast */
.s2-toast-stack::before,
.s2-toast-stack::after {
  content: '';
  position: absolute;
  left: 8px;
  right: 8px;
  top: -9px;
  height: 30px;
  border-radius: 14px;
  background: rgb(255 255 255 / 70%);
  box-shadow: 0 6px 16px -10px rgb(15 23 42 / 25%);
}
.s2-toast-stack::after {
  left: 18px;
  right: 18px;
  top: -16px;
  background: rgb(255 255 255 / 45%);
}
.s2-toast {
  position: relative;
  z-index: 1;
  padding: 11px 16px 12px;
  border: 1px solid #f1ede9;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 18px 32px -16px rgb(15 23 42 / 35%);
}
.s2-toast-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #9ca3af;
  font-family: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 0.66rem;
}
.s2-slack {
  width: 14px;
  height: 14px;
}
.s2-toast p {
  margin: 8px 0 0;
  overflow: hidden;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.s2-toast-enter-active,
.s2-toast-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.s2-toast-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.97);
}
.s2-toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* ============ C · multi-branch globe ============ */
.s2-c {
  border-color: #f3d6c7;
  background:
    radial-gradient(60% 70% at 50% 100%, rgb(61 155 255 / 10%), transparent 70%),
    radial-gradient(120% 90% at 0% 0%, #fff 0%, transparent 55%),
    linear-gradient(160deg, #fffdfc, #fbf8f6);
}
.s2-c .txt {
  position: relative;
  z-index: 2;
  max-width: 350px;
}
.s2-c .s2-h {
  font-size: 1rem;
}
.s2-c .s2-p {
  font-size: 0.8rem;
  line-height: 1.55;
}
.s2-globe-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: pan-y;
}
.s2-globe-canvas:active {
  cursor: grabbing;
}

/* ============ D · wordpress ============ */
.s2-search {
  margin-top: 14px;
  height: 38px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(20, 21, 43, 0.1);
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 14px 0 12px;
  box-shadow: 0 8px 18px -12px rgba(20, 21, 43, 0.35);
  transition:
    box-shadow 0.3s,
    border-color 0.3s;
}
.s2-d:hover .s2-search {
  border-color: rgba(66, 133, 244, 0.45);
  box-shadow:
    0 0 0 4px rgba(66, 133, 244, 0.1),
    0 12px 24px -12px rgba(20, 21, 43, 0.35);
}
.s2-search .g {
  width: 16px;
  height: 16px;
  flex: none;
}
.s2-search .q {
  flex: 1;
  font-size: 11.5px;
  color: #4b4f63;
  white-space: nowrap;
  overflow: hidden;
}
.s2-search .q::after {
  content: '';
  display: inline-block;
  width: 1px;
  height: 13px;
  background: var(--ink);
  margin-left: 1px;
  vertical-align: -2px;
  animation: s2-blink 1s steps(1) infinite;
}
.s2-search .mic {
  width: 14px;
  height: 14px;
  color: #4285f4;
  flex: none;
}
.s2-res {
  margin-top: 10px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--line);
  padding: 11px 14px 12px;
  box-shadow: 0 18px 30px -22px rgba(20, 21, 43, 0.45);
  transition:
    transform 0.5s var(--ease),
    box-shadow 0.5s;
}
.s2-d:hover .s2-res {
  transform: translateY(-2px);
  box-shadow: 0 24px 38px -22px rgba(20, 21, 43, 0.5);
}
.s2-res .top {
  display: flex;
  align-items: center;
  gap: 9px;
}
.s2-res .wp {
  width: 18px;
  height: 18px;
  flex: none;
  color: #21759b;
}
.s2-res .site {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
}
.s2-res .crumb {
  font-size: 9.5px;
  color: #8a8ea1;
  line-height: 1.3;
}
.s2-res .sync {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font: 500 9.5px 'Poppins';
  color: #15803d;
  background: #ecfdf3;
  border: 1px solid #c7f0d8;
  padding: 2px 8px;
  border-radius: 999px;
  white-space: nowrap;
}
.s2-res .sync i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22c55e;
}
.s2-res h4 {
  margin: 9px 0 0;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ink);
}
.s2-sk {
  margin-top: 8px;
  height: 5px;
  border-radius: 4px;
  background: linear-gradient(90deg, #eceae7 20%, #f8d9c5 40%, #eceae7 60%);
  background-size: 220% 100%;
  animation: s2-shim 2s linear infinite;
}
.s2-sk + .s2-sk {
  width: 70%;
  margin-top: 5px;
}
.s2-swap {
  animation: s2-in 0.5s var(--ease);
}

/* ============ E · hardware circuit ============ */
.s2-e .s2-h {
  position: relative;
  z-index: 2;
  max-width: 230px;
}
.s2-circuit {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.s2-trace {
  fill: none;
  stroke: #e6e1dc;
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.s2-pulse {
  fill: none;
  stroke: #f26a0f;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 22 400;
  filter: drop-shadow(0 0 4px rgb(255 122 48 / 85%));
  animation: s2-travel 3.6s linear infinite;
}
@keyframes s2-travel {
  from {
    stroke-dashoffset: 40;
  }
  to {
    stroke-dashoffset: -380;
  }
}
.s2-node {
  fill: #fff;
  stroke: #e0dad4;
  stroke-width: 1.2;
}
.s2-core {
  position: absolute;
  left: 75%;
  top: 58%;
  z-index: 1;
  width: 102px;
  height: 102px;
  margin: -51px 0 0 -51px;
  border-radius: 28px;
  background: linear-gradient(150deg, #ffb27c 0%, #f9894c 55%, #f27a3c 100%);
  box-shadow:
    inset 0 2px 0 rgb(255 255 255 / 55%),
    inset 0 -10px 18px rgb(214 80 20 / 30%),
    0 22px 40px -12px rgb(242 106 15 / 55%),
    0 0 70px 6px rgb(255 140 80 / 35%);
  animation: s2-breathe 4.2s ease-in-out infinite;
}
.s2-core span {
  position: absolute;
  inset: 14px;
  border: 1px solid rgb(255 255 255 / 40%);
  border-radius: 18px;
  background: radial-gradient(circle at 30% 25%, rgb(255 255 255 / 45%), transparent 60%);
}
.s2-e:hover .s2-core {
  animation-duration: 1.8s;
}
.s2-e:hover .s2-pulse {
  animation-duration: 1.8s;
}
@keyframes s2-breathe {
  50% {
    transform: scale(1.04);
    box-shadow:
      inset 0 2px 0 rgb(255 255 255 / 55%),
      inset 0 -10px 18px rgb(214 80 20 / 30%),
      0 28px 48px -12px rgb(242 106 15 / 65%),
      0 0 90px 12px rgb(255 140 80 / 45%);
  }
}

/* ============ F · reseller ============ */
.s2-f {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px 22px;
}
.s2-f .s2-h {
  font-size: 17px;
}
.s2-f .s2-p {
  max-width: 360px;
}
.s2-arrow {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  border: 1px solid var(--line);
  background: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--ink);
  box-shadow: 0 6px 14px -8px rgba(20, 21, 43, 0.4);
  transition: 0.35s var(--ease);
  text-decoration: none;
}
.s2-arrow svg {
  width: 11px;
  height: 11px;
  transition: transform 0.35s var(--ease);
}
.s2-f:hover .s2-arrow {
  background: linear-gradient(145deg, var(--o1), var(--o2));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 20px -8px rgba(242, 84, 12, 0.7);
}
.s2-f:hover .s2-arrow svg {
  transform: rotate(45deg);
}
.s2-partners {
  display: flex;
  align-items: center;
  gap: 10px;
}
.s2-stack {
  display: flex;
  padding: 4px 8px 4px 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--line);
  box-shadow: 0 8px 16px -10px rgba(20, 21, 43, 0.4);
  align-items: center;
}
.s2-stack .av {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -8px;
  overflow: hidden;
  transition: transform 0.35s var(--ease);
  box-shadow: 0 2px 6px rgba(20, 21, 43, 0.2);
}
.s2-stack .av:first-child {
  margin-left: 0;
}
.s2-stack .av svg {
  width: 100%;
  height: 100%;
}
.s2-stack .av:hover {
  transform: translateY(-5px) scale(1.12);
  z-index: 3;
}
.s2-stack .plus {
  width: 22px;
  height: 22px;
  margin-left: 4px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 12px;
  color: var(--muted);
}
.s2-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 11px;
  color: var(--ink-2);
  box-shadow: 0 8px 16px -10px rgba(20, 21, 43, 0.4);
}
.s2-pill b {
  color: var(--o2);
  font-weight: 600;
}

/* ============ G · integrations ============ */
.s2-g {
  display: flex;
  flex-direction: column;
  padding: 16px 0 10px 22px;
}
.s2-g .s2-h {
  font-size: 16px;
  font-weight: 400;
}
.s2-g .s2-h b {
  font-weight: 600;
}
.s2-chiprows {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  justify-content: center;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 90%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 90%, transparent);
}
.s2-cr {
  display: flex;
  gap: 8px;
  width: max-content;
  animation: s2-mq 46s linear infinite;
}
.s2-cr:nth-child(2) {
  animation-direction: reverse;
  animation-duration: 52s;
}
.s2-cr:nth-child(3) {
  animation-duration: 58s;
}
.s2-chiprows:hover .s2-cr {
  animation-play-state: paused;
}
.s2-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 10px;
  font-weight: 500;
  color: #4b4f63;
  white-space: nowrap;
  box-shadow: 0 4px 10px -8px rgba(20, 21, 43, 0.5);
  transition: 0.3s var(--ease);
}
.s2-chip i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--d);
}
.s2-chip:hover {
  transform: translateY(-2px);
  color: var(--ink);
  border-color: var(--d);
  box-shadow: 0 8px 16px -8px var(--d);
}

/* ============ modal ============ */
.s2-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 20px;
  visibility: hidden;
  pointer-events: none;
  font-family: 'Poppins', system-ui, sans-serif;
}
.s2-modal.open {
  visibility: visible;
  pointer-events: auto;
}
.s2-scrim {
  position: absolute;
  inset: 0;
  background: rgba(18, 20, 40, 0.55);
  backdrop-filter: blur(0);
  opacity: 0;
  transition:
    opacity 0.4s,
    backdrop-filter 0.4s;
}
.s2-modal.open .s2-scrim {
  opacity: 1;
  backdrop-filter: blur(9px) saturate(1.2);
}
.s2-dialog {
  position: relative;
  width: min(100%, 460px);
  max-height: calc(100vh - 40px);
  overflow: auto;
  background: #fff;
  border-radius: 24px;
  box-shadow:
    0 50px 100px -30px rgba(10, 12, 30, 0.65),
    0 0 0 1px rgba(255, 255, 255, 0.4) inset;
  transform: translateY(24px) scale(0.94);
  opacity: 0;
  transition:
    transform 0.5s var(--ease),
    opacity 0.35s;
}
.s2-modal.open .s2-dialog {
  transform: none;
  opacity: 1;
}
.s2-dialog::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--o3), var(--o1), var(--o2));
}
.s2-mh {
  padding: 28px 28px 18px;
  position: relative;
  border-bottom: 1px solid #f0eeeb;
  background: radial-gradient(260px 120px at 0 0, rgba(255, 122, 26, 0.1), transparent 70%), #fff;
}
.s2-mh h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.s2-mh p {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--muted);
}
.s2-x {
  position: absolute;
  right: 18px;
  top: 20px;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 0;
  background: #f5f4f2;
  cursor: pointer;
  color: #6c7084;
  display: grid;
  place-items: center;
  transition: 0.3s var(--ease);
}
.s2-x:hover {
  background: var(--peach-2);
  color: var(--o2);
  transform: rotate(90deg);
}
.s2-x:focus-visible {
  outline: 2px solid var(--o1);
}
.s2-form {
  padding: 20px 28px 26px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 14px;
}
.s2-fld {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.s2-fld label {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-2);
}
.s2-fld input,
.s2-fld select {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e7e4e0;
  background: #f7f6f4;
  font:
    400 12.5px 'Poppins',
    sans-serif;
  color: var(--ink);
  outline: none;
  transition:
    border-color 0.25s,
    box-shadow 0.25s,
    background 0.25s;
  appearance: none;
  -webkit-appearance: none;
}
.s2-fld select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236c7084' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 11px center;
  padding-right: 30px;
  cursor: pointer;
}
.s2-fld input::placeholder {
  color: #a7a9b8;
}
.s2-fld input:hover,
.s2-fld select:hover {
  border-color: #d9d5cf;
}
.s2-fld input:focus,
.s2-fld select:focus {
  background: #fff;
  border-color: var(--o1);
  box-shadow: 0 0 0 4px rgba(255, 122, 26, 0.15);
}
.s2-fld.err input {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
  animation: s2-shake 0.4s;
}
.s2-fld .em {
  font-size: 10px;
  color: #dc2626;
  min-height: 0;
  display: none;
}
.s2-fld.err .em {
  display: block;
}
.s2-perks {
  grid-column: 1/-1;
  margin: 2px 0 0;
  padding: 12px 14px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fff3ea, #ffeadb);
  border: 1px solid #ffdcc3;
  display: grid;
  gap: 8px;
  list-style: none;
}
.s2-perks li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  font-weight: 500;
  color: #5a2d0f;
}
.s2-perks svg {
  width: 17px;
  height: 17px;
  flex: none;
  color: var(--o2);
}
.s2-go {
  grid-column: 1/-1;
  height: 46px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font:
    600 13.5px 'Poppins',
    sans-serif;
  color: #fff;
  letter-spacing: 0.01em;
  background: linear-gradient(95deg, #ff7a1a, #f2540c 60%, #e04508);
  box-shadow:
    0 16px 28px -12px rgba(242, 84, 12, 0.75),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition:
    transform 0.3s var(--ease),
    box-shadow 0.3s;
}
.s2-go:hover {
  transform: translateY(-2px);
  box-shadow:
    0 22px 34px -12px rgba(242, 84, 12, 0.85),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.s2-go:active {
  transform: translateY(0) scale(0.99);
}
.s2-go::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    transparent 35%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 65%
  );
  transform: translateX(-130%);
  animation: s2-sheen 3.4s 1s infinite;
}
.s2-go:focus-visible {
  outline: 3px solid rgba(255, 122, 26, 0.4);
  outline-offset: 3px;
}
.s2-go.loading {
  pointer-events: none;
  opacity: 0.9;
}
.s2-go.loading span {
  opacity: 0;
}
.s2-go.loading::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 18px;
  height: 18px;
  margin: -9px;
  border-radius: 50%;
  border: 2.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  animation: s2-spin 0.7s linear infinite;
}
.s2-fine {
  grid-column: 1/-1;
  margin: -2px 0 0;
  text-align: center;
  font-size: 10.5px;
  color: #9a9db0;
}
.s2-ok {
  display: none;
  padding: 38px 28px 30px;
  text-align: center;
}
.s2-ok.show {
  display: block;
  animation: s2-in 0.6s var(--ease);
}
.s2-ok .ring {
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
}
.s2-ok .ring circle {
  fill: #fff3ea;
  stroke: var(--o1);
  stroke-width: 3;
  stroke-dasharray: 190;
  stroke-dashoffset: 190;
  animation: s2-draw 0.8s 0.1s forwards;
}
.s2-ok .ring path {
  fill: none;
  stroke: var(--o2);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: s2-draw 0.5s 0.75s forwards;
}
.s2-ok h3 {
  margin: 0;
  font-size: 19px;
  font-weight: 600;
}
.s2-ok p {
  margin: 8px auto 22px;
  max-width: 320px;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--muted);
}
.s2-ok p b {
  color: var(--ink);
}
.s2-ok button {
  height: 42px;
  padding: 0 26px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  font: 500 12.5px 'Poppins';
  cursor: pointer;
  color: var(--ink);
  transition: 0.3s var(--ease);
}
.s2-ok button:hover {
  border-color: var(--o1);
  color: var(--o2);
}
body.s2-lock {
  overflow: hidden;
}

/* ============ keyframes ============ */
@keyframes s2-mq {
  to {
    transform: translateX(-50%);
  }
}
@keyframes s2-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes s2-ping {
  70% {
    box-shadow: 0 0 0 8px rgba(255, 122, 26, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 122, 26, 0);
  }
}
@keyframes s2-ping-g {
  70% {
    box-shadow: 0 0 0 7px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}
@keyframes s2-ring {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.2);
    opacity: 0;
  }
}
@keyframes s2-bar {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
@keyframes s2-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes s2-blink {
  50% {
    opacity: 0;
  }
}
@keyframes s2-shim {
  to {
    background-position: -220% 0;
  }
}
@keyframes s2-run {
  to {
    stroke-dashoffset: -91;
  }
}
@keyframes s2-float {
  50% {
    translate: 0 -6px;
  }
}
@keyframes s2-glow {
  50% {
    opacity: 0.55;
    transform: scale(1.15);
  }
}
@keyframes s2-sheen {
  40%,
  100% {
    transform: translateX(130%);
  }
}
@keyframes s2-shake {
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
@keyframes s2-draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* ============ responsive ============ */
@media (max-width: 1020px) {
  .s2-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: none;
    grid-auto-rows: minmax(212px, auto);
  }
  .s2-a {
    grid-column: 1/4;
    grid-row: span 2;
  }
  .s2-b {
    grid-column: 4/7;
    grid-row: auto;
  }
  .s2-c {
    grid-column: 4/7;
    grid-row: auto;
  }
  .s2-d {
    grid-column: 1/5;
    grid-row: auto;
  }
  .s2-e {
    grid-column: 5/7;
    grid-row: auto;
  }
  .s2-f {
    grid-column: 1/7;
    grid-row: auto;
    min-height: 150px;
  }
  .s2-g {
    grid-column: 1/7;
    grid-row: auto;
    min-height: 150px;
  }
}
@media (max-width: 720px) {
  .s2-grid {
    grid-template-columns: 1fr;
  }
  .s2-a,
  .s2-b,
  .s2-c,
  .s2-d,
  .s2-e,
  .s2-f,
  .s2-g {
    grid-column: 1;
    grid-row: auto;
  }
  .s2-a {
    min-height: 420px;
  }
  .s2-c {
    min-height: 260px;
  }
  .s2-e {
    min-height: 210px;
  }
  .s2-form {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  .s2 *,
  .s2-modal * {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
  }
  .s2-row,
  .s2-cr,
  .s2-pulse,
  .s2-core,
  .s2-in .s2-seg {
    animation: none !important;
  }
}

/* the Vue port renders each pin avatar inside a span */
.s2-pin-av {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
}
.s2-pin-av svg {
  width: 100%;
  height: 100%;
}
/* standalone background so the section looks right even if the parent has none is built into .s2 */
</style>
