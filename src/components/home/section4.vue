<template>
  <section ref="rootEl" class="bento-section" aria-labelledby="bento-title">
    <div class="bento-container">
      <h2 id="bento-title" class="bento-title">Replace your Messy Excel Sheets</h2>

      <div class="bento" :class="{ 'is-ready': ready }" @pointermove="trackPointer">
        <!-- ───────────── 1 · Cloud POS & Sales Workstation ───────────── -->
        <article class="card card-pos" style="--d: 0">
          <div class="pos-stage" aria-hidden="true">
            <div v-for="(row, r) in brandRows" :key="r" class="brand-row" :class="{ reverse: r === 1 }">
              <div class="brand-track">
                <span
                  v-for="(b, i) in [...row, ...row]"
                  :key="`${b.id}-${i}`"
                  class="brand-cell"
                  :style="{ '--c': b.color }"
                >
                  <svg v-if="b.id === '3cx'" class="brand-icon wide" viewBox="0 0 54 24">
                    <text x="27" y="18" text-anchor="middle">3CX</text>
                  </svg>
                  <svg v-else class="brand-icon" viewBox="0 0 24 24">
                    <g v-html="brandSvg[b.id]"></g>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div class="pos-copy">
            <h3>Cloud POS &amp; Sales Workstation</h3>
            <p>
              Built for high-velocity sales and retail operations, Saptivo unifies fast POS checkouts, real-time
              inventory tracking, customer CRM, and instant quotation workflows into one responsive workstation.
            </p>
            <button ref="triggerEl" type="button" class="pill-btn" @click="openModal">
              <span class="pill-btn-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <circle v-for="n in 9" :key="n" :cx="4 + ((n - 1) % 3) * 4" :cy="4 + Math.floor((n - 1) / 3) * 4" r="1.15" />
                </svg>
              </span>
              Explore Workstation
            </button>
          </div>
          <span class="dot-field dot-field-br" aria-hidden="true"></span>
        </article>

        <!-- ───────────── 2 · Real-time activity & instant alerts ───────────── -->
        <article class="card card-alerts" style="--d: 1">
          <h3 class="card-title">Real-time activity &amp; instant alerts</h3>
          <span class="dot-field dot-field-tr" aria-hidden="true"></span>

          <div class="donut" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <defs>
                <linearGradient id="donut-a" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#f69a5c" />
                  <stop offset="1" stop-color="#f27a30" />
                </linearGradient>
                <linearGradient id="donut-b" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#f26a0f" />
                  <stop offset="1" stop-color="#e8530a" />
                </linearGradient>
              </defs>
              <g transform="rotate(-90 50 50)" fill="none" stroke-width="22">
                <circle class="seg seg-pale" cx="50" cy="50" r="34" pathLength="100" />
                <circle class="seg seg-dark" cx="50" cy="50" r="34" pathLength="100" />
                <circle class="seg seg-light" cx="50" cy="50" r="34" pathLength="100" />
              </g>
            </svg>
            <div class="donut-center">
              <b>{{ alertCount.toLocaleString() }}</b>
              <small>alerts this week</small>
            </div>
          </div>

          <div class="toast-stack" role="status" aria-live="polite">
            <Transition name="toast" mode="out-in">
              <div :key="toastIndex" class="toast">
                <div class="toast-head">
                  <span>notification</span>
                  <svg class="slack" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#36c5f0" d="M9.5 2a2 2 0 0 0 0 4H11V4a2 2 0 0 0-1.500-2zM9.500 7.500h-5a2 2 0 0 0 0 4h5a2 2 0 0 0 0-4z" />
                    <path fill="#2eb67d" d="M22 9.500a2 2 0 0 0-4 0V11h2a2 2 0 0 0 2-1.500zM16.500 9.500v-5a2 2 0 0 0-4 0v5a2 2 0 0 0 4 0z" />
                    <path fill="#ecb22e" d="M14.500 22a2 2 0 0 0 0-4H13v2a2 2 0 0 0 1.500 2zM14.500 16.500h5a2 2 0 0 0 0-4h-5a2 2 0 0 0 0 4z" />
                    <path fill="#e01e5a" d="M2 14.500a2 2 0 0 0 4 0V13H4a2 2 0 0 0-2 1.500zM7.500 14.500v5a2 2 0 0 0 4 0v-5a2 2 0 0 0-4 0z" />
                  </svg>
                </div>
                <p>{{ notifications[toastIndex] }}</p>
              </div>
            </Transition>
          </div>
        </article>

        <!-- ───────────── 3 · Multi-branch cloud sync & HQ control ───────────── -->
        <article class="card card-globe" style="--d: 2">
          <div class="globe-copy">
            <h3 class="card-title">Multi-branch cloud sync &amp; HQ control</h3>
            <p>Synchronize 1 to 100+ stores and warehouses in real time with sub-50ms sync latency and 99.99% cloud uptime.</p>
          </div>
          <canvas
            ref="globeEl"
            class="globe-canvas"
            role="img"
            aria-label="Rotating globe showing branches syncing with headquarters"
          ></canvas>
        </article>

        <!-- ───────────── 4 · Instant WordPress & web inquiry sync ───────────── -->
        <article class="card card-inquiry" style="--d: 3">
          <h3 class="card-title">Instant WordPress &amp; web inquiry sync</h3>

          <div class="search" aria-hidden="true">
            <svg class="g-logo" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M21.600 12.230c0-.71-.06-1.400-.18-2.050H12v3.870h5.380a4.600 4.600 0 0 1-2 3.020v2.500h3.230c1.890-1.740 2.990-4.300 2.990-7.340z" />
              <path fill="#34a853" d="M12 22c2.700 0 4.960-.9 6.620-2.420l-3.230-2.500c-.9.600-2.040.95-3.390.95-2.600 0-4.800-1.760-5.590-4.120H3.070v2.580A10 10 0 0 0 12 22z" />
              <path fill="#fbbc05" d="M6.410 13.910a6 6 0 0 1 0-3.820V7.510H3.070a10 10 0 0 0 0 8.980z" />
              <path fill="#ea4335" d="M12 5.980c1.470 0 2.790.5 3.820 1.500l2.870-2.870C16.960 2.990 14.700 2 12 2a10 10 0 0 0-8.930 5.510l3.340 2.580C7.200 7.740 9.400 5.980 12 5.980z" />
            </svg>
            <span class="search-text">{{ typed }}<i class="caret"></i></span>
            <svg class="mic" viewBox="0 0 24 24">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.920V21h2v-3.080A7 7 0 0 0 19 11z" />
            </svg>
          </div>

          <div class="result" :class="{ 'is-synced': synced }">
            <div class="result-head">
              <span class="wp-logo" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M3 9.500c1.500-1 3-1 4 .5l3 6 2-5.500M11 11l3 6 4-10.500" /></svg>
              </span>
              <span class="result-site">
                <b>WordPress Site</b>
                <small>yourwebsite.com <i>›</i> inquiry <i>›</i> lead-capture</small>
              </span>
              <span class="synced-badge"><i></i>Synced</span>
            </div>
            <p>Incoming Inquiry from WordPress Site</p>
            <span class="skeleton s1"></span>
            <span class="skeleton s2"></span>
          </div>
        </article>

        <!-- ───────────── 5 · Plug & Play POS hardware & peripherals ───────────── -->
        <article class="card card-hardware" style="--d: 4">
          <h3 class="card-title">Plug &amp; Play POS hardware &amp; peripherals</h3>
          <svg class="circuit" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g class="traces">
              <path v-for="(d, i) in circuitPaths" :key="`b${i}`" :d="d" class="trace" />
            </g>
            <g class="pulses">
              <path
                v-for="(d, i) in circuitPaths"
                :key="`p${i}`"
                :d="d"
                class="pulse"
                :style="{ animationDelay: `${i * -0.9}s` }"
              />
            </g>
            <circle v-for="(n, i) in circuitNodes" :key="`n${i}`" :cx="n[0]" :cy="n[1]" r="2.6" class="node" />
          </svg>
          <div class="chip" aria-hidden="true"><span></span></div>
        </article>

        <!-- ───────────── 6 · 20+ Reseller & Partner Hub ───────────── -->
        <article class="card card-partners" style="--d: 5">
          <span class="dot-field dot-field-all" aria-hidden="true"></span>
          <a class="corner-btn" :href="partnerHubUrl" aria-label="Open the partner hub">
            <svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9" /></svg>
          </a>
          <h3 class="partners-title">20+ Reseller &amp; Partner Hub</h3>
          <p>Provision client workspaces, track partner commissions, and manage accounts from one central hub.</p>
          <div class="partners-row">
            <div class="avatars">
              <span v-for="(p, i) in people.slice(0, 4)" :key="i" class="avatar" :style="{ zIndex: 5 - i }">
                <svg viewBox="0 0 40 40" aria-hidden="true">
                  <rect width="40" height="40" :fill="p.bg" />
                  <path d="M3 40c0-10 7-14 17-14s17 4 17 14z" :fill="p.shirt" />
                  <circle cx="20" cy="17" r="8.500" :fill="p.skin" />
                  <path d="M11 17c-.5-7 4-10.500 9-10.500S29.500 10 29 17c-1.500-3.500-4.500-5-9-5s-7.500 1.500-9 5z" :fill="p.hair" />
                </svg>
              </span>
              <span class="avatar avatar-plus" aria-hidden="true">+</span>
            </div>
            <span class="active-pill"><b>20+</b> Active Partners</span>
          </div>
        </article>

        <!-- ───────────── 7 · 20+ Integrations ───────────── -->
        <article class="card card-integrations" style="--d: 6">
          <span class="glow-pink" aria-hidden="true"></span>
          <h3 class="int-title"><b>20+ Integrations</b> to the tools you already use</h3>
          <div class="chip-rows" aria-label="Supported integrations">
            <div v-for="(row, r) in integrationRows" :key="r" class="chip-row" :class="{ reverse: r === 1 }" :style="{ '--speed': `${44 + r * 6}s` }">
              <div class="chip-track">
                <span v-for="(c, i) in [...row, ...row]" :key="`${c[0]}-${i}`" class="int-chip" :aria-hidden="i >= row.length">
                  <i :style="{ background: c[1] }"></i>{{ c[0] }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- ───────────── Sandbox modal ───────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalOpen" class="modal-backdrop bento-modal" @mousedown.self="closeModal">
          <div
            ref="dialogEl"
            class="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sandbox-title"
            aria-describedby="sandbox-sub"
            @keydown="trapFocus"
          >
            <header class="modal-head">
              <div>
                <h3 id="sandbox-title">Experience Saptivo CRM</h3>
                <p id="sandbox-sub">Get instant access to cloud terminal simulator &amp; 14-day trial</p>
              </div>
              <button type="button" class="modal-close" aria-label="Close" @click="closeModal">
                <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </header>

            <form v-if="!submitted" class="modal-body" novalidate @submit.prevent="submitForm">
              <div class="field-grid">
                <label class="field">
                  <span>Your Full Name</span>
                  <input ref="firstInput" v-model.trim="form.name" type="text" name="name" autocomplete="name" placeholder="e.g. Alex Fernando" :aria-invalid="!!errors.name" />
                  <em v-if="errors.name">{{ errors.name }}</em>
                </label>
                <label class="field">
                  <span>Business / Store Name</span>
                  <input v-model.trim="form.business" type="text" name="business" autocomplete="organization" placeholder="e.g. Apex Hypermarket" :aria-invalid="!!errors.business" />
                  <em v-if="errors.business">{{ errors.business }}</em>
                </label>
                <label class="field">
                  <span>WhatsApp / Phone Number</span>
                  <input v-model.trim="form.phone" type="tel" name="phone" autocomplete="tel" placeholder="+94 77 123 4567" :aria-invalid="!!errors.phone" />
                  <em v-if="errors.phone">{{ errors.phone }}</em>
                </label>
                <label class="field">
                  <span>Industry Type</span>
                  <select v-model="form.industry" name="industry">
                    <option v-for="o in industries" :key="o" :value="o">{{ o }}</option>
                  </select>
                </label>
              </div>

              <ul class="perks">
                <li v-for="p in perks" :key="p">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m7.500 12.200 3 3 6-6.200" /></svg>
                  {{ p }}
                </li>
              </ul>

              <button type="submit" class="launch-btn">Launch Free POS Sandbox</button>
            </form>

            <div v-else class="modal-body success" role="status">
              <span class="success-icon">
                <svg viewBox="0 0 24 24"><path d="m5 12.500 4.500 4.500L19 7.500" /></svg>
              </span>
              <h4>Your sandbox is on its way</h4>
              <p>
                Thanks {{ firstName }} — our setup specialist will message you on WhatsApp shortly with the login for
                {{ form.business }}.
              </p>
              <button type="button" class="launch-btn" @click="closeModal">Done</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeSection4' })
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  /** Where the arrow button on the partner card should link to. */
  partnerHubUrl: { type: String, default: '#' },
})
const emit = defineEmits(['launch'])

/* ──────────────────────────── static content ──────────────────────────── */

const brandSvg = {
  facebook:
    '<circle cx="12" cy="12" r="11" fill="currentColor"/><path fill="var(--cut)" d="M13.200 19v-6.200h2.100l.4-2.500h-2.500V8.700c0-.7.3-1.200 1.300-1.200h1.300V5.300c-.2 0-1-.1-1.900-.1-1.900 0-3.200 1.200-3.200 3.300v1.800H8.600v2.500h2.100V19z"/>',
  whatsapp:
    '<path fill="currentColor" d="M12 2.200a9.800 9.800 0 0 0-8.400 14.800L2.200 21.800l5-1.300A9.800 9.800 0 1 0 12 2.200z"/><path fill="var(--cut)" d="M8.700 7.200c.3-.5.600-.5.900-.5h.5l.9 2c.1.300 0 .5-.2.700l-.6.700c.8 1.500 1.900 2.500 3.500 3.200l.8-.9c.2-.2.4-.3.7-.2l2 .9c.3.1.4.3.3.6-.2 1-1.100 1.700-2.200 1.600-3.100-.4-5.900-3-6.300-6.100-.1-.6 0-1.400.5-2.400z"/>',
  messenger:
    '<path fill="currentColor" d="M12 2C6.500 2 2 6.200 2 11.400c0 2.900 1.400 5.500 3.600 7.200V22l3.300-1.800c1 .3 2 .4 3.100.4 5.500 0 10-4.200 10-9.400S17.500 2 12 2z"/><path fill="var(--cut)" d="M5.800 14.200l4.300-4.600 2.600 2.300 4.300-2.300-4.300 4.700-2.600-2.400z"/>',
  calendar:
    '<path fill="currentColor" d="M5 3h11l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><text x="12" y="17" text-anchor="middle" font-size="9.500" font-weight="700" font-family="Poppins,sans-serif" fill="var(--cut)">31</text>',
  wordpress:
    '<circle cx="12" cy="12" r="10.400" fill="none" stroke="currentColor" stroke-width="1.700"/><path d="M5.800 8.400l3.100 8.800 2.100-5.600 2.200 5.600 3.200-8.800" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
}

const brandRows = [
  [
    { id: 'facebook', color: '#1877f2' },
    { id: 'whatsapp', color: '#25d366' },
    { id: 'messenger', color: '#a259ff' },
    { id: 'calendar', color: '#4285f4' },
    { id: 'wordpress', color: '#21759b' },
    { id: '3cx', color: '#0b8ed8' },
  ],
  [
    { id: '3cx', color: '#0b8ed8' },
    { id: 'calendar', color: '#4285f4' },
    { id: 'wordpress', color: '#21759b' },
    { id: 'facebook', color: '#1877f2' },
    { id: 'messenger', color: '#a259ff' },
    { id: 'whatsapp', color: '#25d366' },
  ],
]

/* Notifications mirror real CRM events (inquiries, 3CX calls, tasks, receipts). */
const notifications = [
  'WhatsApp Digital Receipt Dispatched',
  'New inquiry from John Smith · Inquiry #28',
  'Missed call logged · 3CX · 755322689',
  '3 team tasks are overdue',
  'Quotation approved · Invoice created',
]

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

const integrationRows = [
  [['WordPress', '#21759b'], ['3CX Telephony', '#0b8ed8'], ['WhatsApp', '#25d366'], ['Meta Lead Ads', '#3b82f6'], ['Facebook Leads', '#2563eb'], ['Instagram Leads', '#d6249f']],
  [['Google Calendar', '#4285f4'], ['PDF Quotations', '#f26a0f'], ['PDF Invoicing', '#f26a0f'], ['WooCommerce Sync', '#7f54b3'], ['Stripe & Payments', '#635bff'], ['Zapier Automation', '#ff4a00']],
  [['POS Barcode Scanner', '#0ea5e9'], ['Thermal Printers', '#475569'], ['Cloud Inventory', '#10b981'], ['REST API', '#a855f7'], ['Webhooks', '#6366f1'], ['Multi-Branch Sync', '#0891b2']],
]

const industries = [
  'Supermarket & Grocery',
  'Pharmacy & Healthcare',
  'Fashion & Apparel',
  'Electronics & Mobile',
  'Restaurant & Café',
  'Hardware & Construction',
  'Other',
]
const perks = ['Instant 14-Day Cloud Sandbox', 'Dedicated Setup Specialist']

/* ──────────────────────────── shared state ──────────────────────────── */

const rootEl = ref(null)
const ready = ref(false)
const reducedMotion = ref(false)
let io

/** Spotlight: expose the pointer position to the hovered card via CSS variables. */
function trackPointer(e) {
  const card = e.target.closest?.('.card')
  if (!card) return
  const r = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${e.clientX - r.left}px`)
  card.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/* ──────────────────────────── alerts card ──────────────────────────── */

const alertCount = ref(0)
const toastIndex = ref(0)
let toastTimer
let countRaf

function countUp(to = 1284, ms = 1400) {
  const start = performance.now()
  const tick = (now) => {
    const t = Math.min(1, (now - start) / ms)
    alertCount.value = Math.round(to * (1 - Math.pow(1 - t, 3)))
    if (t < 1) countRaf = requestAnimationFrame(tick)
  }
  countRaf = requestAnimationFrame(tick)
}

/* ──────────────────────────── inquiry card (typewriter) ──────────────────────────── */

const FULL_QUERY = 'Incoming Inquiry • WordPress Webhook Sync'
const typed = ref(FULL_QUERY)
const synced = ref(true)
let typeTimer
let typingStopped = false

function runTypewriter() {
  if (reducedMotion.value) return
  let i = 0
  typed.value = ''
  synced.value = false
  const step = () => {
    if (typingStopped) return
    if (i < FULL_QUERY.length) {
      typed.value = FULL_QUERY.slice(0, ++i)
      typeTimer = setTimeout(step, 42 + Math.random() * 50)
    } else {
      typeTimer = setTimeout(() => {
        synced.value = true
        typeTimer = setTimeout(runTypewriter, 4200)
      }, 450)
    }
  }
  typeTimer = setTimeout(step, 600)
}

/* ──────────────────────────── globe card ──────────────────────────── */

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
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const R = Math.min(w * 0.32, 190)
  const cx = w / 2
  const cy = h - 160 + R // only the top ~160px of the globe peeks into the card
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
  if (reducedMotion.value || globeRaf) return
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
  if (reducedMotion.value) renderGlobe(performance.now())
}
function onGlobeUp() {
  dragging = false
}

/* ──────────────────────────── modal ──────────────────────────── */

const modalOpen = ref(false)
const submitted = ref(false)
const triggerEl = ref(null)
const dialogEl = ref(null)
const firstInput = ref(null)
const form = reactive({ name: '', business: '', phone: '', industry: industries[0] })
const errors = reactive({ name: '', business: '', phone: '' })
const firstName = computed(() => form.name.split(' ')[0] || 'there')

function openModal() {
  submitted.value = false
  modalOpen.value = true
}
function closeModal() {
  modalOpen.value = false
}

function validate() {
  errors.name = form.name.length >= 2 ? '' : 'Please enter your name'
  errors.business = form.business.length >= 2 ? '' : 'Please enter your business name'
  errors.phone = /^\+?[\d\s-]{7,16}$/.test(form.phone) ? '' : 'Enter a valid phone number'
  return !errors.name && !errors.business && !errors.phone
}

function submitForm() {
  if (!validate()) return
  emit('launch', { ...form })
  submitted.value = true
}

function trapFocus(e) {
  if (e.key !== 'Tab') return
  const items = [...dialogEl.value.querySelectorAll('button, input, select, a[href]')].filter((el) => !el.disabled)
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

function onKey(e) {
  if (e.key === 'Escape' && modalOpen.value) closeModal()
}

watch(modalOpen, async (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    await nextTick()
    firstInput.value?.focus()
  } else {
    Object.assign(form, { name: '', business: '', phone: '', industry: industries[0] })
    Object.assign(errors, { name: '', business: '', phone: '' })
    triggerEl.value?.focus()
  }
})

/* ──────────────────────────── lifecycle ──────────────────────────── */

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.addEventListener('keydown', onKey)
  window.addEventListener('resize', sizeGlobe)

  const canvas = globeEl.value
  canvas.addEventListener('pointerdown', onGlobeDown)
  canvas.addEventListener('pointermove', onGlobeMove)
  canvas.addEventListener('pointerup', onGlobeUp)
  canvas.addEventListener('pointercancel', onGlobeUp)
  sizeGlobe()

  if (reducedMotion.value) {
    alertCount.value = 1284
    ready.value = true
    return
  }

  toastTimer = setInterval(() => {
    toastIndex.value = (toastIndex.value + 1) % notifications.length
  }, 3400)

  io = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((e) => e.isIntersecting)
      if (visible && !ready.value) {
        ready.value = true
        countUp()
        typingStopped = false
        runTypewriter()
      }
      globeVisible = visible
      if (visible) startGlobe()
      else stopGlobe()
    },
    { threshold: 0.12 },
  )
  io.observe(rootEl.value)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', sizeGlobe)
  document.body.style.overflow = ''
  io?.disconnect()
  stopGlobe()
  clearInterval(toastTimer)
  clearTimeout(typeTimer)
  cancelAnimationFrame(countRaf)
  typingStopped = true
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ------------------------------------------------------------------ */
/* Tokens & base                                                       */
/* ------------------------------------------------------------------ */

.bento-section {
  --orange: #ff5722;
  --orange-deep: #f26a0f;
  --navy: #0f172a;
  --ink: #334155;
  --muted: #64748b;
  --page: #f1efec;
  --card: #fbfaf8;
  --card-line: #f3efeb;
  --radius: 12px;

  position: relative;
  width: 100%;
  padding: 72px 16px 80px;
  background: var(--page);
  color: var(--navy);
  font-family: Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

.bento-section,
.bento-section *,
.bento-section *::before,
.bento-section *::after,
.modal-backdrop,
.modal-backdrop *,
.modal-backdrop *::before,
.modal-backdrop *::after {
  box-sizing: border-box;
}

.bento-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.bento-title {
  margin: 0 0 56px;
  padding: 0 16px;
  text-align: center;
  color: var(--navy);
  font-size: clamp(26px, 5vw, 46px);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

/* ------------------------------------------------------------------ */
/* Bento grid                                                          */
/* ------------------------------------------------------------------ */

.bento {
  display: grid;
  /* five tracks so the top rows (3 + 2 cards) and the bottom row (2 cards) can split differently */
  grid-template-columns: minmax(0, 371fr) minmax(0, 191fr) minmax(0, 121fr) minmax(0, 156fr) minmax(0, 317fr);
  grid-template-rows: 280px 280px 185px;
  gap: 6px;
}

.card-pos { grid-column: 1; grid-row: 1 / 3; }
.card-alerts { grid-column: 2 / 4; grid-row: 1; }
.card-globe { grid-column: 4 / 6; grid-row: 1; }
.card-inquiry { grid-column: 2 / 5; grid-row: 2; }
.card-hardware { grid-column: 5; grid-row: 2; }
.card-partners { grid-column: 1 / 3; grid-row: 3; }
.card-integrations { grid-column: 3 / 6; grid-row: 3; }

.card {
  --mx: 50%;
  --my: 50%;

  position: relative;
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--card-line);
  border-radius: var(--radius);
  background:
    radial-gradient(120% 90% at 0% 0%, #fff 0%, transparent 55%),
    linear-gradient(160deg, #fdfcfb, var(--card));
  box-shadow:
    0 1px 0 #fff inset,
    0 1px 2px rgb(15 23 42 / 4%),
    0 18px 40px -26px rgb(15 23 42 / 22%);
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

/* cursor spotlight */
.card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(260px circle at var(--mx) var(--my), rgb(255 122 48 / 12%), transparent 70%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.card:hover {
  transform: translateY(-3px);
  border-color: #f6dccb;
  box-shadow:
    0 1px 0 #fff inset,
    0 2px 4px rgb(15 23 42 / 5%),
    0 28px 50px -24px rgb(242 106 15 / 30%);
}

.card:hover::after {
  opacity: 1;
}

/* staggered entrance */
.bento:not(.is-ready) .card {
  opacity: 0;
  transform: translateY(18px);
}

.bento.is-ready .card {
  animation: card-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: calc(var(--d) * 80ms);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
}

.card-title,
.partners-title {
  margin: 0;
  font-weight: 500;
  color: var(--navy);
}

.card-title {
  font-size: 1.03rem;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

/* decorative dot grids */
.dot-field {
  position: absolute;
  background-image: radial-gradient(rgb(15 23 42 / 16%) 1px, transparent 1.3px);
  background-size: 12px 12px;
  pointer-events: none;
}

.dot-field-br {
  right: 0;
  bottom: 0;
  width: 62%;
  height: 46%;
  -webkit-mask-image: radial-gradient(circle at 100% 100%, #000, transparent 72%);
  mask-image: radial-gradient(circle at 100% 100%, #000, transparent 72%);
}

.dot-field-tr {
  top: 0;
  right: 0;
  width: 48%;
  height: 40%;
  -webkit-mask-image: radial-gradient(circle at 100% 0, #000, transparent 70%);
  mask-image: radial-gradient(circle at 100% 0, #000, transparent 70%);
}

.dot-field-all {
  inset: 0;
  -webkit-mask-image: linear-gradient(100deg, transparent 5%, #000 55%, #000);
  mask-image: linear-gradient(100deg, transparent 5%, #000 55%, #000);
  opacity: 0.8;
}

/* ------------------------------------------------------------------ */
/* 1 · POS workstation                                                 */
/* ------------------------------------------------------------------ */

.card-pos {
  display: flex;
  flex-direction: column;
  padding: 14px;
}

.pos-stage {
  --cut: #efede9;

  position: relative;
  padding-block: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  height: 217px;
  border-block: 1px solid #e0ddd8;
  border-radius: 10px;
  background: linear-gradient(180deg, #f1efeb, #ebe8e3);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 70%);
  overflow: hidden;
}

.brand-row {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.brand-track {
  display: flex;
  width: max-content;
  animation: marquee 46s linear infinite;
}

.brand-row.reverse .brand-track {
  animation-direction: reverse;
  animation-duration: 54s;
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

.brand-cell {
  --c: #888;

  display: grid;
  flex: none;
  place-items: center;
  width: 67px;
  height: 67px;
  color: #8d8c88;
  transition: color 0.45s ease, transform 0.45s ease;
}

.brand-icon {
  width: 38px;
  height: 38px;
}

.brand-icon.wide {
  width: 50px;
  fill: currentColor;
  font-family: Poppins, sans-serif;
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -1px;
}

.card-pos:hover .brand-cell {
  color: var(--c);
}

.brand-cell:hover {
  transform: scale(1.18);
}

.pos-copy {
  padding: 16px 14px 0;
}

.pos-copy h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.pos-copy p {
  margin: 12px 0 22px;
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.55;
}

.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px 6px 7px;
  border: 1px solid #e9e4df;
  border-radius: 999px;
  background: #fff;
  color: var(--navy);
  box-shadow: 0 6px 16px -10px rgb(15 23 42 / 35%);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.pill-btn:hover {
  transform: translateY(-1px);
  border-color: #ffc9b3;
  box-shadow: 0 12px 22px -12px rgb(242 106 15 / 55%);
}

.pill-btn-icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: linear-gradient(145deg, #ff7a3d, #f2500d);
  box-shadow: 0 4px 10px -3px rgb(242 80 13 / 60%);
}

.pill-btn-icon svg {
  width: 14px;
  height: 14px;
  fill: #fff;
}

/* ------------------------------------------------------------------ */
/* 2 · Alerts                                                          */
/* ------------------------------------------------------------------ */

.card-alerts .card-title {
  position: relative;
  z-index: 2;
  max-width: 190px;
}

.donut {
  position: absolute;
  left: 50%;
  top: 70px;
  width: 168px;
  height: 168px;
  margin-left: -84px;
  filter: drop-shadow(0 18px 20px rgb(242 106 15 / 18%));
}

.donut svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.seg {
  stroke-dashoffset: 0;
  transition: stroke-width 0.3s ease;
}

.seg-pale {
  stroke: #fdebe2;
  stroke-dasharray: 16.4 100;
}

.seg-dark {
  stroke: url(#donut-b);
  stroke-dasharray: 24.4 100;
  stroke-dashoffset: -17;
}

.seg-light {
  stroke: url(#donut-a);
  stroke-dasharray: 57.4 100;
  stroke-dashoffset: -42;
}

.bento.is-ready .seg {
  animation: seg-draw 1.1s cubic-bezier(0.3, 0.8, 0.2, 1) both;
}

.bento.is-ready .seg-dark { animation-delay: 0.15s; }
.bento.is-ready .seg-pale { animation-delay: 0.3s; }

@keyframes seg-draw {
  from {
    stroke-dasharray: 0 100;
  }
}

.card-alerts:hover .seg-dark {
  stroke-width: 25;
}

.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 26px;
  text-align: center;
}

.donut-center b {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.donut-center small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 0.6rem;
}

.toast-stack {
  position: absolute;
  left: 50%;
  bottom: 9px;
  width: calc(100% - 56px);
  margin-left: calc((100% - 56px) / -2);
  z-index: 3;
}

/* faint sheets stacked behind the toast */
.toast-stack::before,
.toast-stack::after {
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

.toast-stack::after {
  left: 18px;
  right: 18px;
  top: -16px;
  background: rgb(255 255 255 / 45%);
}

.toast {
  position: relative;
  z-index: 1;
  padding: 11px 16px 12px;
  border: 1px solid #f1ede9;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 18px 32px -16px rgb(15 23 42 / 35%);
}

.toast-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #9ca3af;
  font-family: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 0.66rem;
}

.slack {
  width: 14px;
  height: 14px;
}

.toast p {
  margin: 8px 0 0;
  overflow: hidden;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.97);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* ------------------------------------------------------------------ */
/* 3 · Globe                                                           */
/* ------------------------------------------------------------------ */

.card-globe {
  border-color: #f3d6c7;
  background:
    radial-gradient(60% 70% at 50% 100%, rgb(61 155 255 / 10%), transparent 70%),
    radial-gradient(120% 90% at 0% 0%, #fff 0%, transparent 55%),
    linear-gradient(160deg, #fffdfc, #fbf8f6);
}

.globe-copy {
  position: relative;
  z-index: 2;
}

.globe-copy .card-title {
  font-size: 1.1rem;
}

.globe-copy p {
  max-width: 420px;
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.55;
}

.globe-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: pan-y;
}

.globe-canvas:active {
  cursor: grabbing;
}

/* ------------------------------------------------------------------ */
/* 4 · Inquiry sync                                                    */
/* ------------------------------------------------------------------ */

.card-inquiry {
  background:
    radial-gradient(70% 60% at 50% 120%, rgb(242 106 15 / 7%), transparent 70%),
    radial-gradient(120% 90% at 0% 0%, #fff 0%, transparent 55%),
    linear-gradient(160deg, #fdfcfb, var(--card));
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 42px;
  margin-top: 14px;
  padding: 0 16px;
  border: 1px solid #ebe7e3;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 8px 20px -14px rgb(15 23 42 / 30%);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.card-inquiry:hover .search {
  border-color: #cfe0ff;
  box-shadow: 0 10px 24px -12px rgb(66 133 244 / 45%);
}

.g-logo {
  flex: none;
  width: 18px;
  height: 18px;
}

.search-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: #5f6673;
  font-size: 0.84rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.caret {
  display: inline-block;
  width: 1.5px;
  height: 1em;
  margin-left: 1px;
  vertical-align: -2px;
  background: #4285f4;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.mic {
  flex: none;
  width: 16px;
  height: 16px;
  fill: #5f7bb5;
}

.result {
  position: relative;
  margin-top: 14px;
  padding: 14px 16px 16px;
  border: 1px solid #ece8e4;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 14px 28px -20px rgb(15 23 42 / 35%);
  transition: box-shadow 0.5s ease, border-color 0.5s ease;
}

.result.is-synced {
  border-color: #f4e1d4;
  animation: result-pulse 1.1s ease-out 1;
}

@keyframes result-pulse {
  0% {
    box-shadow: 0 0 0 0 rgb(242 106 15 / 35%), 0 14px 28px -20px rgb(15 23 42 / 35%);
  }
  100% {
    box-shadow: 0 0 0 14px rgb(242 106 15 / 0%), 0 14px 28px -20px rgb(15 23 42 / 35%);
  }
}

.result-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wp-logo {
  display: grid;
  flex: none;
  place-items: center;
  width: 22px;
  height: 22px;
  border: 1.6px solid #21759b;
  border-radius: 50%;
  background: #fff;
}

.wp-logo svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: #21759b;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.result-site {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.result-site b {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.3;
}

.result-site small {
  overflow: hidden;
  color: #8a93a3;
  font-size: 0.66rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.result-site small i {
  font-style: normal;
  opacity: 0.7;
}

.synced-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 999px;
  background: #e0f6ea;
  color: #1a8a55;
  font-size: 0.62rem;
  font-weight: 600;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.synced-badge i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #1a8a55;
  animation: ping 1.6s ease-in-out infinite;
}

.is-synced .synced-badge {
  opacity: 1;
  transform: none;
}

@keyframes ping {
  50% {
    opacity: 0.35;
    transform: scale(0.7);
  }
}

.result p {
  margin: 14px 0 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.skeleton {
  position: relative;
  display: block;
  height: 5px;
  margin-top: 6px;
  border-radius: 99px;
  background: #eef0f6;
  overflow: hidden;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 90%), transparent);
  transform: translateX(-100%);
  animation: shimmer 2.4s ease-in-out infinite;
}

.s1 { width: 82%; }
.s2 { width: 56%; }
.s2::after { animation-delay: 0.3s; }

@keyframes shimmer {
  60%,
  100% {
    transform: translateX(100%);
  }
}

/* ------------------------------------------------------------------ */
/* 5 · Hardware                                                        */
/* ------------------------------------------------------------------ */

.card-hardware .card-title {
  position: relative;
  z-index: 2;
  max-width: 230px;
}

.circuit {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.trace {
  fill: none;
  stroke: #e6e1dc;
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pulse {
  fill: none;
  stroke: #f26a0f;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 22 400;
  filter: drop-shadow(0 0 4px rgb(255 122 48 / 85%));
  animation: travel 3.6s linear infinite;
}

@keyframes travel {
  from {
    stroke-dashoffset: 40;
  }
  to {
    stroke-dashoffset: -380;
  }
}

.node {
  fill: #fff;
  stroke: #e0dad4;
  stroke-width: 1.2;
}

.chip {
  position: absolute;
  left: 75%;
  top: 58%;
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
  animation: breathe 4.2s ease-in-out infinite;
}

.chip span {
  position: absolute;
  inset: 14px;
  border: 1px solid rgb(255 255 255 / 40%);
  border-radius: 18px;
  background: radial-gradient(circle at 30% 25%, rgb(255 255 255 / 45%), transparent 60%);
}

.card-hardware:hover .chip {
  animation-duration: 1.8s;
}

@keyframes breathe {
  50% {
    transform: scale(1.04);
    box-shadow:
      inset 0 2px 0 rgb(255 255 255 / 55%),
      inset 0 -10px 18px rgb(214 80 20 / 30%),
      0 28px 48px -12px rgb(242 106 15 / 65%),
      0 0 90px 12px rgb(255 140 80 / 45%);
  }
}

/* ------------------------------------------------------------------ */
/* 6 · Partners                                                        */
/* ------------------------------------------------------------------ */

.card-partners {
  padding: 22px 25px;
}

.partners-title {
  position: relative;
  font-size: 1.25rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.card-partners p {
  position: relative;
  max-width: 440px;
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 0.84rem;
  line-height: 1.6;
}

.corner-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid #e6e1dc;
  border-radius: 7px;
  background: #fff;
  color: var(--navy);
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.corner-btn svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.25s ease;
}

.corner-btn:hover,
.corner-btn:focus-visible {
  background: var(--orange);
  border-color: var(--orange);
  color: #fff;
  box-shadow: 0 8px 16px -6px rgb(255 87 34 / 60%);
  outline: none;
}

.corner-btn:hover svg {
  transform: translate(1px, -1px);
}

.partners-row {
  position: absolute;
  left: 25px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatars {
  display: flex;
  align-items: center;
  padding: 5px 10px 5px 5px;
  border-radius: 999px;
  background: rgb(255 255 255 / 85%);
  box-shadow: 0 8px 20px -12px rgb(15 23 42 / 35%);
}

.avatar {
  position: relative;
  display: block;
  width: 30px;
  height: 30px;
  margin-left: -7px;
  border: 2px solid #fff;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.25s ease;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar svg {
  display: block;
  width: 100%;
  height: 100%;
}

.avatars:hover .avatar {
  transform: translateY(-2px);
}

.avatar-plus {
  display: grid;
  place-items: center;
  margin-left: 6px;
  border-color: #e6e1dc;
  background: #fff;
  color: var(--muted);
  font-size: 0.8rem;
}

.active-pill {
  padding: 6px 14px;
  border: 1px solid #ebe6e1;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 8px 18px -12px rgb(15 23 42 / 30%);
  font-size: 0.72rem;
  font-weight: 500;
  white-space: nowrap;
}

.active-pill b {
  margin-right: 4px;
  color: var(--orange);
  font-weight: 600;
}

/* ------------------------------------------------------------------ */
/* 7 · Integrations                                                    */
/* ------------------------------------------------------------------ */

.card-integrations {
  padding: 22px 0 0 25px;
}

.glow-pink {
  position: absolute;
  top: -40px;
  right: -30px;
  width: 340px;
  height: 260px;
  background: radial-gradient(closest-side, rgb(255 190 160 / 45%), transparent);
  pointer-events: none;
}

.int-title {
  position: relative;
  max-width: 235px;
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
}

.int-title b {
  font-weight: 600;
}

.chip-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 14px;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 5%, #000 92%, transparent);
}

.chip-row {
  overflow: hidden;
}

.chip-track {
  display: flex;
  gap: 8px;
  width: max-content;
  padding-right: 8px;
  animation: marquee var(--speed, 44s) linear infinite;
}

.chip-row.reverse .chip-track {
  animation-direction: reverse;
}

.card-integrations:hover .chip-track {
  animation-play-state: paused;
}

.int-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 11px 0 9px;
  border: 1px solid #ebe6e1;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 10px -8px rgb(15 23 42 / 40%);
  color: #3b4558;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.int-chip:hover {
  transform: translateY(-1px);
  border-color: #ffc9b3;
}

.int-chip i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgb(24 28 44 / 58%);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  font-family: Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #0f172a;
}

.modal {
  width: min(100%, 520px);
  max-height: calc(100dvh - 32px);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 40px 90px -30px rgb(0 0 0 / 55%);
  overflow: auto;
}

.modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 26px 26px 18px;
  border-bottom: 1px solid #f1f3f7;
}

.modal-head h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.modal-head p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 0.75rem;
}

.modal-close {
  display: grid;
  flex: none;
  place-items: center;
  width: 34px;
  height: 34px;
  margin: -4px -6px 0 0;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.modal-close:hover {
  background: #f1f3f7;
  color: #0f172a;
  transform: rotate(90deg);
}

.modal-close svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.modal-body {
  padding: 22px 26px 26px;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.field span {
  font-size: 0.72rem;
  font-weight: 600;
}

.field input,
.field select {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e3e7ef;
  border-radius: 8px;
  background: #f6f7fb;
  color: #0f172a;
  font: inherit;
  font-size: 0.8rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.field input::placeholder {
  color: #94a3b8;
}

.field input:focus,
.field select:focus {
  outline: none;
  border-color: #ff7a3d;
  background: #fff;
  box-shadow: 0 0 0 3px rgb(255 122 61 / 18%);
}

.field input[aria-invalid='true'] {
  border-color: #e5484d;
  background: #fff7f7;
}

.field em {
  color: #d33;
  font-size: 0.66rem;
  font-style: normal;
}

.perks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 18px 0 16px;
  padding: 13px 16px;
  border: 1px solid #ffd9bd;
  border-radius: 8px;
  background: #fff1e6;
  list-style: none;
}

.perks li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
}

.perks svg {
  flex: none;
  width: 19px;
  height: 19px;
  fill: none;
  stroke: #0f172a;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.launch-btn {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(100deg, #f7660c, #e5481d);
  box-shadow: 0 14px 26px -12px rgb(229 72 29 / 70%), inset 0 1px 0 rgb(255 255 255 / 30%);
  color: #fff;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.launch-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 18px 30px -12px rgb(229 72 29 / 80%), inset 0 1px 0 rgb(255 255 255 / 30%);
}

.launch-btn:focus-visible,
.pill-btn:focus-visible,
.modal-close:focus-visible {
  outline: 2px solid #ff5722;
  outline-offset: 3px;
}

.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: 34px 28px;
  text-align: center;
}

.success-icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #e0f6ea;
  animation: pop-in 0.5s cubic-bezier(0.2, 1.4, 0.4, 1) both;
}

.success-icon svg {
  width: 26px;
  height: 26px;
  fill: none;
  stroke: #1a8a55;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@keyframes pop-in {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
}

.success h4 {
  margin: 16px 0 6px;
  font-size: 1.05rem;
  font-weight: 600;
}

.success p {
  max-width: 340px;
  margin: 0 0 22px;
  color: #64748b;
  font-size: 0.8rem;
  line-height: 1.6;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.1), opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  opacity: 0;
  transform: translateY(14px) scale(0.96);
}

/* ------------------------------------------------------------------ */
/* Responsive                                                          */
/* ------------------------------------------------------------------ */

@media (max-width: 1100px) {
  .bento {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: auto;
    grid-auto-rows: minmax(280px, auto);
  }

  .card-pos,
  .card-alerts,
  .card-globe,
  .card-inquiry,
  .card-hardware,
  .card-partners,
  .card-integrations {
    grid-column: auto;
    grid-row: auto;
  }

  .card-pos,
  .card-globe,
  .card-inquiry {
    grid-column: 1 / -1;
  }

  .card-partners,
  .card-integrations {
    min-height: 200px;
  }

  .card-partners {
    padding-bottom: 80px;
  }

  /* pair the small cards so no row is left half-empty */
  .card-pos { order: 0; }
  .card-alerts { order: 1; }
  .card-hardware { order: 2; }
  .card-globe { order: 3; }
  .card-inquiry { order: 4; }
  .card-partners { order: 5; }
  .card-integrations { order: 6; }
}

@media (max-width: 680px) {
  .bento-section {
    padding: 48px 12px 56px;
  }

  .bento-title {
    margin-bottom: 32px;
  }

  .bento {
    grid-template-columns: minmax(0, 1fr);
  }

  .card-alerts,
  .card-hardware,
  .card-partners,
  .card-integrations {
    grid-column: 1 / -1;
  }

  .card-integrations {
    min-height: 0;
    padding-bottom: 22px;
  }

  .card-globe {
    min-height: 330px;
  }

  .partners-row {
    flex-wrap: wrap;
    right: 25px;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .modal-head,
  .modal-body {
    padding-inline: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .brand-track,
  .chip-track,
  .pulse,
  .chip,
  .caret,
  .skeleton::after,
  .synced-badge i,
  .bento.is-ready .seg,
  .bento.is-ready .card {
    animation: none !important;
  }

  .bento:not(.is-ready) .card {
    opacity: 1;
    transform: none;
  }

  .card,
  .card::after {
    transition: none;
  }
}
</style>
