<template>
  <section
    ref="rootEl"
    class="s2"
    :class="{ 's2-js': mounted, 's2-in': revealed }"
    aria-labelledby="s2-title"
  >
    <!-- shared gradients -->
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs>
        <linearGradient id="s2-ul" x1="0" x2="1"><stop offset="0" stop-color="#ffb27f" /><stop offset="1" stop-color="#f2540c" /></linearGradient>
        <linearGradient id="s2-pg" x1="0" x2="1"><stop offset="0" stop-color="#ff7a1a" stop-opacity="0" /><stop offset="1" stop-color="#f2540c" /></linearGradient>
        <linearGradient id="s2-d1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7a1a" /><stop offset="1" stop-color="#e8470a" /></linearGradient>
        <linearGradient id="s2-d2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffa468" /><stop offset="1" stop-color="#ff7a1a" /></linearGradient>
      </defs>
    </svg>

    <header class="s2-head">
      <span class="s2-eyebrow"><i></i>One platform · zero spreadsheets</span>
      <h2 id="s2-title" class="s2-title">
        Replace your
        <b>Messy Excel Sheets<svg viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 C 60 2, 110 12, 160 6 S 260 2, 298 7" /></svg></b>
      </h2>
      <p class="s2-sub">POS, CRM, inventory and every branch in one live workspace — built for fast-moving retail teams.</p>
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
          <p class="s2-p">Built for high-velocity sales and retail operations, Saptivo unifies fast POS checkouts, real-time inventory tracking, customer CRM, and instant quotation workflows into one responsive workstation.</p>
          <button ref="openBtn" class="s2-btn" type="button" aria-haspopup="dialog" @click="openModal">
            <span class="gl"><svg viewBox="0 0 12 12" fill="#fff"><circle v-for="p in dotGrid" :key="p" :cx="p[0]" :cy="p[1]" r="1.1" /></svg></span>
            Explore Workstation
            <svg class="ar" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
      </article>

      <!-- B · Real-time activity -->
      <article class="s2-card s2-b s2-dots tl">
        <h3 class="s2-h">Real-time activity &amp; instant alerts</h3>
        <div class="s2-donut-tip" :class="{ show: activeSeg >= 0 }">{{ activeSeg >= 0 ? segs[activeSeg].label : '' }}</div>
        <div class="s2-donut" :class="{ dim: activeSeg >= 0 }">
          <svg viewBox="0 0 200 200" role="img" aria-label="Alert channel breakdown">
            <g class="spin">
              <circle cx="100" cy="100" r="62" stroke="#ffeadc" pathLength="100" />
              <circle
                v-for="(s, i) in segs" :key="s.label"
                class="seg" :class="{ on: activeSeg === i }"
                cx="100" cy="100" r="62" :stroke="s.stroke" pathLength="100"
                :stroke-dasharray="donutReady ? `${s.len} ${100 - s.len}` : '0 100'"
                :style="{ strokeDashoffset: s.off, transition: `stroke-dasharray 1.3s ${0.2 + i * 0.25}s cubic-bezier(.2,.8,.2,1), stroke-width .35s, opacity .3s` }"
                @pointerenter="hoverSeg(i)" @pointerleave="hoverSeg(-1)"
              />
            </g>
          </svg>
        </div>
        <div class="s2-toast" aria-live="polite">
          <svg class="sl" viewBox="0 0 24 24"><rect x="3" y="9.5" width="9" height="4" rx="2" fill="#36c5f0" /><rect x="9.5" y="3" width="4" height="9" rx="2" fill="#2eb67d" /><rect x="12" y="10.5" width="9" height="4" rx="2" fill="#ecb22e" /><rect x="10.5" y="12" width="4" height="9" rx="2" fill="#e01e5a" /></svg>
          <div :key="msgIdx" class="msg"><small>notification</small><span>{{ messages[msgIdx][0] }}</span></div>
          <i :key="'bar' + msgIdx" class="bar"></i>
        </div>
      </article>

      <!-- C · Globe -->
      <article class="s2-card s2-c">
        <div ref="globeEl" class="s2-globe" :class="{ drag: dragging }"
          @pointerdown="gDown" @pointermove="gMove" @pointerup="gUp" @pointercancel="gUp">
          <canvas ref="cv"></canvas>
          <div class="s2-pins">
            <div v-for="(c, i) in cities" :key="c.n" :ref="el => (pinEls[i] = el)" class="s2-pin" :class="{ hq: c.hq }">
              <span class="s2-pin-av" v-html="c.avatar"></span><i></i><em>{{ c.n }}</em>
            </div>
          </div>
        </div>
        <div class="txt">
          <h3 class="s2-h">Multi-branch cloud sync &amp; HQ control</h3>
          <p class="s2-p">Synchronize 1 to 100+ stores and warehouses in real time with sub-50ms sync latency and 99.99% cloud uptime.</p>
        </div>
        <span class="s2-live"><i></i><span>Live · {{ latency }}ms</span></span>
      </article>

      <!-- D · WordPress -->
      <article class="s2-card s2-d">
        <h3 class="s2-h">Instant WordPress &amp; web inquiry sync</h3>
        <div class="s2-search">
          <svg class="g" viewBox="0 0 24 24" fill="none" stroke-width="4"><circle cx="12" cy="12" r="8.5" stroke="#ea4335" stroke-dasharray="14 60" stroke-dashoffset="-6" transform="rotate(-20 12 12)" /><circle cx="12" cy="12" r="8.5" stroke="#fbbc05" stroke-dasharray="13 60" stroke-dashoffset="-27" transform="rotate(-20 12 12)" /><circle cx="12" cy="12" r="8.5" stroke="#34a853" stroke-dasharray="14 60" stroke-dashoffset="-42" transform="rotate(-20 12 12)" /><circle cx="12" cy="12" r="8.5" stroke="#4285f4" stroke-dasharray="14 60" stroke-dashoffset="-1" transform="rotate(100 12 12)" /><path d="M12 12h8.5" stroke="#4285f4" stroke-linecap="butt" /></svg>
          <span class="q">{{ query }}</span>
          <svg class="mic" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z" /></svg>
        </div>
        <div class="s2-res">
          <div class="top">
            <svg class="wp" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.8" /><text x="12" y="16.5" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="12" fill="currentColor">W</text></svg>
            <div><div class="site">WordPress Site</div><div class="crumb">yourwebsite.com › inquiry › lead-capture</div></div>
            <span class="sync"><i></i><span>{{ syncText }}</span></span>
          </div>
          <h4 :key="resultTitle" class="s2-swap">{{ resultTitle }}</h4>
          <div class="s2-sk"></div><div class="s2-sk"></div>
        </div>
      </article>

      <!-- E · Hardware -->
      <article class="s2-card s2-e s2-dots">
        <div class="s2-stage" aria-hidden="true">
          <svg viewBox="0 0 280 212" preserveAspectRatio="none">
            <path v-for="t in traces" :key="'t' + t" class="s2-trace" :d="t" />
            <path v-for="(t, i) in traces" :key="'p' + t" class="s2-pulse" pathLength="100" :style="{ animationDelay: pulseDelays[i] }" :d="t" />
          </svg>
        </div>
        <h3 class="s2-h">Plug &amp; Play POS hardware &amp; peripherals</h3>
        <div class="s2-sq" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0V7zM12 17v5" /></svg></div>
        <div class="s2-chips"><span>Thermal printer</span><span>Barcode scanner</span><span>Cash drawer</span></div>
      </article>

      <!-- F · Reseller hub -->
      <article class="s2-card s2-f s2-dots tl">
        <a class="s2-arrow" href="#" aria-label="Open Reseller & Partner Hub" @click.prevent="$emit('open-partners')"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l6-6M4 3h5v5" /></svg></a>
        <div>
          <h3 class="s2-h">20+ Reseller &amp; Partner Hub</h3>
          <p class="s2-p">Provision client workspaces, track partner commissions, and manage accounts from one central hub.</p>
        </div>
        <div class="s2-partners">
          <div class="s2-stack">
            <span v-for="a in partnerAvatars" :key="a.id" class="av" v-html="a.svg"></span>
            <span class="plus">+</span>
          </div>
          <span class="s2-pill"><b>{{ partnerCount }}+</b> Active Partners</span>
        </div>
      </article>

      <!-- G · Integrations -->
      <article class="s2-card s2-g s2-dots tl">
        <h3 class="s2-h"><b>20+ Integrations</b> to the<br />tools you already use</h3>
        <div class="s2-chiprows" aria-label="Supported integrations">
          <div v-for="(row, r) in chipRows" :key="r" class="s2-cr">
            <span v-for="(c, i) in row" :key="i" class="s2-chip" :style="{ '--d': c[1] }"><i></i>{{ c[0] }}</span>
          </div>
        </div>
      </article>
    </div>

    <!-- ============ Trial modal ============ -->
    <Teleport to="body">
      <div ref="modalEl" class="s2-modal" :class="{ open: modalOpen }" role="dialog" aria-modal="true" aria-labelledby="s2-mt" :aria-hidden="!modalOpen">
        <div class="s2-scrim" @click="closeModal"></div>
        <div class="s2-dialog">
          <div v-show="status !== 'done'">
            <div class="s2-mh">
              <h3 id="s2-mt">Experience Saptivo CRM</h3>
              <p>Get instant access to cloud terminal simulator &amp; 14-day trial</p>
              <button class="s2-x" type="button" aria-label="Close" @click="closeModal"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
            </div>
            <form class="s2-form" novalidate @submit.prevent="submit">
              <div class="s2-fld" :class="{ err: errors.name }">
                <label for="s2-n">Your Full Name</label>
                <input id="s2-n" ref="nameInput" v-model.trim="form.name" placeholder="e.g. Alex Fernando" autocomplete="name" required @input="errors.name = false" />
                <span class="em">Please enter your name</span>
              </div>
              <div class="s2-fld" :class="{ err: errors.business }">
                <label for="s2-b">Business / Store Name</label>
                <input id="s2-b" v-model.trim="form.business" placeholder="e.g. Apex Hypermarket" autocomplete="organization" required @input="errors.business = false" />
                <span class="em">Please enter your business</span>
              </div>
              <div class="s2-fld" :class="{ err: errors.phone }">
                <label for="s2-p">WhatsApp / Phone Number</label>
                <input id="s2-p" v-model.trim="form.phone" type="tel" inputmode="tel" placeholder="+94 77 123 4567" autocomplete="tel" required @input="errors.phone = false" />
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5" /><path d="m8 12.5 2.8 2.8L16.5 9.5" /></svg>{{ p }}
                </li>
              </ul>
              <button class="s2-go" :class="{ loading: status === 'loading' }" type="submit"><span>Launch Free POS Sandbox</span></button>
              <p class="s2-fine">No credit card required · Ready in under 2 minutes</p>
            </form>
          </div>
          <div class="s2-ok" :class="{ show: status === 'done' }">
            <svg class="ring" viewBox="0 0 72 72"><circle cx="36" cy="36" r="30" /><path d="m23 37 9 9 17-19" /></svg>
            <h3>Your sandbox is on the way!</h3>
            <p>Thanks <b>{{ form.name.split(' ')[0] }}</b>. A setup specialist will message you on <b>{{ form.phone }}</b> within 10 minutes to unlock your 14-day trial.</p>
            <button type="button" @click="closeModal">Done</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
/**
 * SectionTwo.vue — "Replace your Messy Excel Sheets" (Vue 3, <script setup>)
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
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  /** async (payload) => void — call your API here. Throw to keep the form open. */
  submitTrial: { type: Function, default: null }
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
const bgs = [['#ffd9b8', '#ffb27f'], ['#c9dcff', '#8fb4ff'], ['#d8f0e3', '#8ad5b0'], ['#f4d6ff', '#cf9cf0'], ['#ffe9a8', '#f5c445']]
function avatar(seed0) {
  let seed = seed0
  const r = (n) => { seed = (seed * 9301 + 49297) % 233280; return Math.floor((seed / 233280) * n) }
  const sk = skins[r(5)], hr = hairs[r(6)], sh = shirts[r(6)], bg = bgs[r(5)], long = r(3) === 0, id = 'av' + seed0
  return `<svg viewBox="0 0 40 40"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs>
    <rect width="40" height="40" fill="url(#${id})"/>${long ? `<path d="M10 17c0-8 4-11 10-11s10 3 10 11v12H10z" fill="${hr}"/>` : ''}
    <path d="M5 41c0-9 6-13 15-13s15 4 15 13z" fill="${sh}"/><rect x="17" y="22" width="6" height="7" rx="2" fill="${sk}"/>
    <circle cx="20" cy="16.5" r="7.6" fill="${sk}"/><path d="M12.3 16c-.3-5.5 3.3-9 7.7-9s8 3.5 7.7 9c-1.2-3.2-3.7-4.6-7.7-4.6S13.5 12.8 12.3 16z" fill="${hr}"/></svg>`
}

/* ------------------------------------------------------------------ A · icon rails */
const dotGrid = [2, 6, 10].flatMap((y) => [2, 6, 10].map((x) => [x, y]))
const icons = {
  fb: { color: '#1877f2', svg: `<circle cx="12" cy="12" r="11" fill="currentColor"/><path fill="#ecebe8" d="M13.4 21v-7.2h2.5l.4-3h-2.9V9c0-.9.3-1.4 1.5-1.4h1.5V5c-.3 0-1.2-.1-2.2-.1-2.200 0-3.700 1.300-3.700 3.800v1.900H7.700v3h2.800V21z"/>` },
  wa: { color: '#25d366', svg: `<path fill="currentColor" d="M12 1.5a10.4 10.4 0 0 0-8.9 15.7L1.6 22.5l5.5-1.4A10.4 10.4 0 1 0 12 1.5z"/><path fill="#ecebe8" d="M8.4 6.9c-.4 0-.8.2-1 .6-.6 1.1-.2 2.6 1.3 4.3 1.6 1.9 3.200 2.800 4.700 2.900.8 0 1.500-.4 1.700-1.100l.1-.5-2-1-.8.900c-1.100-.4-2.100-1.400-2.700-2.500l.8-.8-.9-2.100c-.1-.3-.4-.7-1.200-.7z"/>` },
  ms: { color: '#a033ff', svg: `<path fill="currentColor" d="M12 1.5C6.200 1.500 1.700 5.900 1.700 11.400c0 3 1.400 5.700 3.700 7.500v3.600l3.400-1.900c1 .3 2 .4 3.200.4 5.800 0 10.300-4.400 10.300-9.600S17.800 1.500 12 1.500z"/><path fill="#ecebe8" d="m5.900 14.300 3.800-4 2.100 2.100 4.200-2.200-3.900 4.100-2.100-2.100z"/>` },
  cal: { color: '#1a73e8', svg: `<rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="currentColor"/><rect x="2.5" y="2.5" width="19" height="5.5" rx="2.5" fill="rgba(0,0,0,.18)"/><text x="12" y="18" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="700" font-size="9.5" fill="#ecebe8">31</text>` },
  wp: { color: '#21759b', svg: `<circle cx="12" cy="12" r="11" fill="currentColor"/><text x="12" y="16.8" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="14" fill="#ecebe8">W</text>` },
  cx: { color: '#1f3a8a', svg: `<text x="12" y="15.8" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="700" font-size="9.5" letter-spacing="-.2" fill="currentColor">3CX</text>` }
}
const x4 = (a) => [...a, ...a, ...a, ...a]
const railRows = [x4(['fb', 'wa', 'ms', 'cal', 'wp', 'cx']), x4(['cx', 'cal', 'wp', 'fb', 'ms', 'wa'])]

/* ------------------------------------------------------------------ B · donut + toast */
const segs = [
  { label: 'WhatsApp · 40%', len: 38, off: 0, stroke: 'url(#s2-d1)' },
  { label: 'Orders · 28%', len: 26, off: -40, stroke: 'url(#s2-d2)' },
  { label: 'Stock · 16%', len: 14, off: -68, stroke: '#ffd2b3' }
]
const messages = [
  ['WhatsApp Digital Receipt Dispatched', 0],
  ['Low Stock Alert · Basmati Rice 5kg', 2],
  ['New Order #1042 · Branch 03', 1],
  ['Day-End Report Ready · Colombo HQ', 0],
  ['Inquiry Synced from WordPress', 1]
]
const donutReady = ref(false)
const activeSeg = ref(-1)
const msgIdx = ref(0)
let hovering = false
function hoverSeg(i) { hovering = i >= 0; activeSeg.value = i }

/* ------------------------------------------------------------------ C · globe */
const LAND = [
  [[-168,66],[-156,71],[-141,70],[-125,70],[-110,73],[-95,72],[-82,69],[-80,63],[-93,60],[-94,57],[-82,55],[-79,52],[-78,62],[-70,60],[-62,57],[-56,52],[-60,47],[-66,45],[-70,42],[-74,40],[-76,35],[-81,31],[-80,26],[-82,27],[-84,30],[-90,30],[-95,29],[-97,26],[-97,21],[-95,18],[-91,19],[-90,21],[-87,21],[-88,16],[-84,15],[-83,10],[-79,9],[-77,8],[-80,7],[-85,10],[-87,13],[-92,15],[-96,16],[-105,20],[-106,23],[-110,27],[-113,31],[-115,30],[-110,23],[-112,25],[-115,29],[-117,33],[-121,35],[-124,40],[-124,47],[-128,51],[-133,56],[-140,60],[-148,60],[-152,58],[-158,57],[-164,55],[-158,58],[-162,60],[-166,62],[-165,65]],
  [[-73,78],[-60,82],[-30,83],[-20,78],[-20,70],[-30,68],[-42,60],[-50,62],[-55,68],[-60,76]],
  [[-77,8],[-72,12],[-62,10],[-52,5],[-50,0],[-44,-2],[-35,-5],[-39,-14],[-41,-22],[-48,-26],[-54,-34],[-58,-38],[-63,-41],[-65,-45],[-68,-50],[-69,-54],[-73,-52],[-75,-46],[-73,-38],[-71,-30],[-70,-18],[-76,-14],[-81,-5],[-80,0],[-78,2]],
  [[-9,37],[-9,43],[-2,44],[-4,48],[2,51],[5,53],[8,54],[9,57],[11,56],[13,54],[20,55],[24,59],[30,60],[23,60],[22,65],[25,66],[17,62],[19,60],[16,56],[12,56],[11,59],[5,59],[6,62],[14,67],[20,70],[30,71],[40,67],[44,68],[55,69],[68,69],[70,73],[80,73],[90,76],[105,78],[113,74],[130,72],[140,72],[160,70],[170,70],[180,68],[180,65],[172,64],[163,60],[156,57],[156,51],[150,59],[142,59],[137,54],[141,52],[140,48],[135,43],[130,42],[129,36],[126,35],[126,38],[122,40],[118,38],[122,37],[120,32],[122,30],[120,25],[110,21],[108,21],[106,18],[109,12],[105,9],[101,13],[100,8],[104,1],[101,3],[98,8],[98,16],[94,17],[92,22],[88,22],[80,15],[77,8],[73,17],[72,21],[67,25],[58,25],[56,27],[50,30],[48,29],[51,25],[56,26],[59,22],[52,17],[43,13],[39,22],[35,28],[34,31],[36,36],[30,36],[27,37],[24,38],[22,36],[20,40],[15,45],[12,44],[18,40],[16,38],[12,41],[9,44],[3,43],[-1,37]],
  [[-17,21],[-13,28],[-6,36],[10,37],[11,33],[20,31],[25,32],[32,31],[34,27],[38,20],[43,12],[51,12],[48,5],[40,-3],[40,-10],[35,-20],[33,-26],[27,-34],[20,-35],[18,-32],[14,-22],[12,-6],[9,-1],[9,4],[5,6],[-4,5],[-8,4],[-13,8],[-17,14]],
  [[114,-22],[122,-18],[130,-12],[136,-12],[137,-16],[142,-11],[146,-19],[153,-26],[151,-34],[147,-39],[141,-38],[135,-35],[130,-32],[123,-34],[115,-34]],
  [[-5,50],[1,51],[2,53],[-2,56],[-3,58],[-6,57],[-5,54],[-3,53]], [[-10,52],[-6,52],[-6,55],[-9,54]],
  [[130,31],[135,33],[140,35],[142,39],[142,43],[145,44],[141,45],[139,40],[136,36],[131,34]],
  [[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]], [[95,5],[106,-6],[103,-5],[98,0]], [[109,1],[117,7],[119,1],[116,-4],[110,-3]], [[105,-6],[114,-8],[106,-7]],
  [[172,-35],[178,-38],[175,-41],[172,-41]], [[167,-46],[174,-41],[171,-44]], [[-24,64],[-14,65],[-14,64],[-22,63]], [[-85,22],[-77,20],[-80,23]],
  [[80,9.800],[82,7],[81,6],[79.800,6.500]]
];
const cities = [
  { n: 'Dubai · HQ Hub', lat: 25.2, lon: 55.3, hq: true }, { n: 'London Branch', lat: 51.5, lon: -0.1 }, { n: 'Istanbul Branch', lat: 41, lon: 29 },
  { n: 'Mumbai Branch', lat: 19.1, lon: 72.9 }, { n: 'Delhi Branch', lat: 28.6, lon: 77.2 }, { n: 'New York Branch', lat: 40.7, lon: -74 },
  { n: 'Tokyo Branch', lat: 35.7, lon: 139.7 }, { n: 'Cairo Branch', lat: 30, lon: 31.2 }
].map((c, i) => ({ ...c, avatar: avatar(i * 977 + 31) }))
const globeEl = ref(null)
const cv = ref(null)
const pinEls = [] // plain array of DOM nodes (kept out of reactivity)
const dragging = ref(false)
const latency = ref(38)
let rot = -0.6, vel = 0, lastX = 0, globeVisible = true, raf = 0, destroyed = false, t0 = 0
let pts = null, arcs = null, W = 0, H = 0, ctx = null
const TILT = -0.42, DEG = Math.PI / 180

const inPoly = (x, y, p) => {
  let c = false
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
function buildLandDots() {
  const out = []
  for (let lat = -80; lat <= 84; lat += 2.4) {
    const n = Math.max(1, Math.round((360 * Math.cos(lat * DEG)) / 2.4))
    for (let i = 0; i < n; i++) {
      const lon = -180 + ((i + 0.5) * 360) / n
      if (LAND.some((p) => inPoly(lon, lat, p))) out.push(lat, lon)
    }
  }
  return out
}
const vec = (lat, lon, rad = 1) => {
  const f = lat * DEG, l = lon * DEG + rot
  const x = Math.cos(f) * Math.sin(l), y = Math.sin(f), z = Math.cos(f) * Math.cos(l)
  const c = Math.cos(TILT), s = Math.sin(TILT)
  return [x * rad, (y * c - z * s) * rad, (y * s + z * c) * rad]
}
function arcPts(a, b, n = 28) {
  const A = [Math.cos(a[0] * DEG) * Math.sin(a[1] * DEG), Math.sin(a[0] * DEG), Math.cos(a[0] * DEG) * Math.cos(a[1] * DEG)]
  const B = [Math.cos(b[0] * DEG) * Math.sin(b[1] * DEG), Math.sin(b[0] * DEG), Math.cos(b[0] * DEG) * Math.cos(b[1] * DEG)]
  const om = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2])), out = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, k1 = Math.sin((1 - t) * om) / Math.sin(om), k2 = Math.sin(t * om) / Math.sin(om)
    const v = [k1 * A[0] + k2 * B[0], k1 * A[1] + k2 * B[1], k1 * A[2] + k2 * B[2]]
    out.push([Math.asin(v[1]) / DEG, Math.atan2(v[0], v[2]) / DEG, 1 + 0.22 * Math.sin(Math.PI * t) * (om / 1.5)])
  }
  return out
}
function sizeCanvas() {
  if (!globeEl.value || !cv.value) return
  const r = globeEl.value.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2)
  W = r.width; H = r.height
  cv.value.width = W * dpr; cv.value.height = H * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}
function frame(now) {
  if (destroyed) return
  const dt = Math.min(48, now - t0); t0 = now
  if (!dragging.value) { rot += dt * 0.000058 + vel; vel *= 0.94 }
  const R = Math.max(170, W * 0.5), cx = W * 0.52, cy = H * 0.6 + R
  ctx.clearRect(0, 0, W, H)
  // atmosphere
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R + 2, 0, 7); ctx.strokeStyle = '#4aa3ff'; ctx.lineWidth = 5
  ctx.shadowColor = 'rgba(70,160,255,.9)'; ctx.shadowBlur = 26; ctx.stroke(); ctx.restore()
  // ocean
  const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.55, R * 0.1, cx, cy, R)
  g.addColorStop(0, '#2a74d6'); g.addColorStop(0.45, '#0f3f93'); g.addColorStop(1, '#061a47')
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = g; ctx.fill()
  ctx.save(); ctx.clip()
  // graticule
  ctx.strokeStyle = 'rgba(150,200,255,.12)'; ctx.lineWidth = 0.7
  for (let lat = -60; lat <= 60; lat += 30) {
    ctx.beginPath(); let on = false
    for (let lon = -180; lon <= 180; lon += 6) { const v = vec(lat, lon); if (v[2] > 0) { const x = cx + v[0] * R, y = cy - v[1] * R; on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true } else on = false }
    ctx.stroke()
  }
  for (let lon = -180; lon < 180; lon += 30) {
    ctx.beginPath(); let on = false
    for (let lat = -90; lat <= 90; lat += 6) { const v = vec(lat, lon); if (v[2] > 0) { const x = cx + v[0] * R, y = cy - v[1] * R; on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true } else on = false }
    ctx.stroke()
  }
  // land dots
  for (let i = 0; i < pts.length; i += 2) {
    const v = vec(pts[i], pts[i + 1]); if (v[2] <= 0.02) continue
    const x = cx + v[0] * R, y = cy - v[1] * R; if (y > H + 6 || y < -6) continue
    const a = Math.pow(v[2], 0.6)
    ctx.fillStyle = `rgba(${Math.round(150 + 90 * (1 - v[2]))},${Math.round(225 - 20 * (1 - v[2]))},${Math.round(190 + 40 * v[2])},${0.4 + 0.6 * a})`
    ctx.beginPath(); ctx.arc(x, y, 1 + 1.6 * v[2], 0, 7); ctx.fill()
  }
  // sync arcs + pulses
  arcs.forEach((a, k) => {
    ctx.beginPath(); let on = false
    a.forEach((p) => { const v = vec(p[0], p[1], p[2]); if (v[2] > 0) { const x = cx + v[0] * R, y = cy - v[1] * R; on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true } else on = false })
    ctx.strokeStyle = 'rgba(255,150,70,.55)'; ctx.lineWidth = 1.2; ctx.stroke()
    const t = (now / 2600 + k * 0.17) % 1, p = a[Math.min(a.length - 1, Math.floor(t * (a.length - 1)))], v = vec(p[0], p[1], p[2])
    if (v[2] > 0) { ctx.beginPath(); ctx.arc(cx + v[0] * R, cy - v[1] * R, 2.4, 0, 7); ctx.fillStyle = '#fff'; ctx.shadowColor = '#ff8a3d'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0 }
  })
  // shading
  const sh = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.5, R * 0.55, cx, cy, R * 1.02)
  sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(2,10,35,.55)')
  ctx.fillStyle = sh; ctx.fillRect(0, 0, W, H); ctx.restore()
  // pins (direct style writes: avoids re-rendering Vue 60×/s)
  cities.forEach((c, i) => {
    const el = pinEls[i]; if (!el) return
    const v = vec(c.lat, c.lon), x = cx + v[0] * R, y = cy - v[1] * R
    const show = v[2] > 0.18 && y < H - 10 && y > 6 && x > 4 && x < W - 4
    el.style.opacity = show ? 1 : 0; el.style.pointerEvents = show ? 'auto' : 'none'
    el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${(0.75 + 0.25 * v[2]).toFixed(2)})`
  })
  if (globeVisible && !reduceMotion) raf = requestAnimationFrame(frame)
}
const gDown = (e) => { dragging.value = true; lastX = e.clientX; e.currentTarget.setPointerCapture(e.pointerId) }
const gMove = (e) => { if (!dragging.value) return; const dx = e.clientX - lastX; lastX = e.clientX; rot += dx * 0.006; vel = dx * 0.0005 }
const gUp = () => { dragging.value = false }

/* ------------------------------------------------------------------ D · typing search */
const queries = [
  ['Incoming Inquiry • WordPress Webhook Sync', 'Incoming Inquiry from WordPress Site', 'Synced · 0.3s'],
  ['New Lead • Contact Form 7 → CRM', 'New Lead captured: Apex Hypermarket', 'Synced · 0.2s'],
  ['Quotation Request • WooCommerce Enquiry', 'Quotation request #Q-2087 received', 'Synced · 0.4s']
]
const query = ref(queries[0][0])
const resultTitle = ref(queries[0][1])
const syncText = ref(queries[0][2])

/* ------------------------------------------------------------------ E · hardware traces */
const traces = [
  'M0 92 H48 L70 114 H112 L130 128 H178',
  'M0 132 H40 L58 142 H178',
  'M30 212 V186 L52 164 H178',
  'M0 168 H34 L52 156 H178'
]
const pulseDelays = ['0s', '-1.1s', '-2.2s', '-.6s']

/* ------------------------------------------------------------------ F · partners */
const partnerAvatars = [11, 52, 93, 134].map((s) => ({ id: s, svg: avatar(s * 13) }))
const partnerCount = ref(20)

/* ------------------------------------------------------------------ G · integrations */
const integrations = [['Instagram Leads', '#e1306c'], ['WordPress', '#21759b'], ['3CX Telephony', '#1f3a8a'], ['WhatsApp', '#25d366'], ['Meta Lead Ads', '#1877f2'], ['Facebook Leads', '#1877f2'], ['PDF Invoicing', '#f2540c'], ['WooCommerce Sync', '#7f54b3'], ['Stripe & Payments', '#635bff'], ['Zapier Automation', '#ff4a00'], ['Google Calendar', '#1a73e8'], ['PDF Quotations', '#f59e0b'], ['POS Barcode Scanner', '#6d28d9'], ['Thermal Printers', '#64748b'], ['Cloud Inventory', '#0ea5e9'], ['REST API', '#16a34a'], ['Webhooks', '#9333ea'], ['Multi-Branch Sync', '#ef4444']]
const chipRows = [0, 1, 2].map((r) => x4(integrations.filter((_, i) => i % 3 === r)))

/* ------------------------------------------------------------------ modal */
const industries = ['Supermarket & Grocery', 'Pharmacy & Healthcare', 'Restaurant & Café', 'Fashion & Apparel', 'Electronics & Hardware', 'Wholesale & Distribution', 'Other']
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
function closeModal() { modalOpen.value = false; openBtn.value?.focus() }
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
    const f = [...modalEl.value.querySelectorAll('button,input,select')].filter((x) => x.offsetParent !== null)
    if (!f.length) return
    const a = f[0], z = f[f.length - 1]
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
  }
}

/* ------------------------------------------------------------------ misc */
function spotlight(e) {
  const c = e.target.closest?.('.s2-card'); if (!c) return
  const r = c.getBoundingClientRect()
  c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px')
}

let reduceMotion = false
const timers = new Set()
const observers = []
function every(fn, ms) { const id = setInterval(fn, ms); timers.add(id) }
const wait = (ms) => new Promise((r) => { const id = setTimeout(r, ms); timers.add(id) })

async function typeLoop() {
  await wait(3600)
  let qi = 0
  while (!destroyed) {
    qi = (qi + 1) % queries.length
    const [q, title, s] = queries[qi]
    while (query.value.length && !destroyed) { query.value = query.value.slice(0, -2); await wait(14) }
    for (let i = 1; i <= q.length && !destroyed; i++) { query.value = q.slice(0, i); await wait(32) }
    await wait(350); resultTitle.value = title; syncText.value = s
    await wait(3800)
  }
}
function countUp() {
  if (reduceMotion) return
  partnerCount.value = 0
  every(function tick() { if (partnerCount.value >= 20) return; partnerCount.value += 2 }, 70)
}

onMounted(() => {
  mounted.value = true
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('keydown', onKey)

  // reveal on scroll
  const io = new IntersectionObserver((es, o) => {
    if (es[0].isIntersecting) { revealed.value = true; donutReady.value = true; countUp(); o.disconnect() }
  }, { threshold: 0.12 })
  io.observe(rootEl.value); observers.push(io)

  // globe
  pts = buildLandDots()
  arcs = cities.slice(1).map((c) => arcPts([cities[0].lat, cities[0].lon], [c.lat, c.lon]))
  ctx = cv.value.getContext('2d')
  sizeCanvas()
  const ro = new ResizeObserver(sizeCanvas); ro.observe(globeEl.value); observers.push(ro)
  const vio = new IntersectionObserver((es) => {
    const v = es[0].isIntersecting
    if (v && !globeVisible) { t0 = performance.now(); raf = requestAnimationFrame(frame) }
    globeVisible = v
  }); vio.observe(globeEl.value); observers.push(vio)
  t0 = performance.now(); raf = requestAnimationFrame(frame)

  every(() => { latency.value = 31 + Math.floor(Math.random() * 18) }, 1800)

  if (!reduceMotion) {
    // rotate alert toasts + sync donut highlight
    every(() => {
      if (hovering) return
      msgIdx.value = (msgIdx.value + 1) % messages.length
      activeSeg.value = messages[msgIdx.value][1]
      const id = setTimeout(() => { if (!hovering) activeSeg.value = -1 }, 1800); timers.add(id)
    }, 3400)
    typeLoop()
  }
})

onBeforeUnmount(() => {
  destroyed = true
  cancelAnimationFrame(raf)
  window.removeEventListener('keydown', onKey)
  document.body.classList.remove('s2-lock')
  observers.forEach((o) => o.disconnect())
  timers.forEach((t) => { clearInterval(t); clearTimeout(t) })
})
</script>

<style>


  /* ============ tokens ============ */
  .s2{
    --ink:#14152b; --ink-2:#2b2d45; --muted:#6c7084; --line:rgba(20,21,43,.07);
    --o1:#ff7a1a; --o2:#f2540c; --o3:#ffb27f; --peach:#fff1e7; --peach-2:#ffe4d2;
    --card:#fbf9f7; --card-2:#f6f3f0; --page:#f2f1ee;
    --ease:cubic-bezier(.2,.8,.2,1);
    position:relative; isolation:isolate; overflow:hidden;
    padding:clamp(48px,7vw,96px) clamp(16px,4vw,40px) clamp(56px,8vw,110px);
    font-family:'Poppins',system-ui,sans-serif; color:var(--ink);
    background:
      radial-gradient(900px 420px at 12% -8%, rgba(255,122,26,.10), transparent 60%),
      radial-gradient(800px 420px at 92% 108%, rgba(255,122,26,.09), transparent 60%),
      var(--page);
  }
  .s2 *,.s2-modal,.s2-modal *{box-sizing:border-box}
  .s2 svg{display:block}

  /* ============ heading ============ */
  .s2-head{max-width:760px;margin:0 auto clamp(28px,4vw,48px);text-align:center}
  .s2-eyebrow{
    display:inline-flex;align-items:center;gap:8px;padding:6px 14px 6px 10px;border-radius:999px;
    background:rgba(255,255,255,.7);border:1px solid var(--line);backdrop-filter:blur(6px);
    font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);
    box-shadow:0 6px 18px -10px rgba(20,21,43,.25);
  }
  .s2-eyebrow i{width:7px;height:7px;border-radius:50%;background:var(--o1);box-shadow:0 0 0 0 rgba(255,122,26,.5);animation:s2-ping 2s infinite}
  .s2-title{margin:18px 0 0;font-weight:300;font-size:clamp(28px,4.4vw,46px);line-height:1.15;letter-spacing:-.02em;color:var(--ink)}
  .s2-title b{font-weight:500;position:relative;white-space:nowrap}
  .s2-title b svg{position:absolute;left:0;right:0;bottom:-10px;width:100%;height:12px;overflow:visible}
  .s2-title b path{fill:none;stroke:url(#s2-ul);stroke-width:3;stroke-linecap:round;stroke-dasharray:320;stroke-dashoffset:320;transition:stroke-dashoffset 1.4s .5s var(--ease)}
  .s2-in .s2-title b path{stroke-dashoffset:0}
  .s2-sub{margin:20px auto 0;max-width:520px;font-size:14px;line-height:1.7;color:var(--muted)}

  /* ============ grid ============ */
  .s2-grid{
    max-width:1180px;margin:0 auto;display:grid;gap:12px;
    grid-template-columns:repeat(12,minmax(0,1fr));
    grid-template-rows:212px 212px 170px;
  }
  .s2-a{grid-column:1/5;grid-row:1/3}
  .s2-b{grid-column:5/8;grid-row:1}
  .s2-c{grid-column:8/13;grid-row:1}
  .s2-d{grid-column:5/10;grid-row:2}
  .s2-e{grid-column:10/13;grid-row:2}
  .s2-f{grid-column:1/7;grid-row:3}
  .s2-g{grid-column:7/13;grid-row:3}

  .s2-card{
    position:relative;overflow:hidden;border-radius:22px;padding:20px 22px;
    background:linear-gradient(180deg,#fdfcfa 0%,var(--card-2) 100%);
    border:1px solid var(--line);
    box-shadow:0 1px 0 #fff inset,0 1px 2px rgba(20,21,43,.04),0 18px 40px -26px rgba(20,21,43,.28);
    transition:transform .6s var(--ease),box-shadow .6s var(--ease),border-color .4s;
  }
  .s2-card:hover{transform:translateY(-4px);border-color:rgba(255,122,26,.28);
    box-shadow:0 1px 0 #fff inset,0 2px 4px rgba(20,21,43,.04),0 30px 54px -26px rgba(242,84,12,.30)}
  /* mouse-follow spotlight */
  .s2-card::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;opacity:0;transition:opacity .4s;
    background:radial-gradient(360px circle at var(--mx,50%) var(--my,50%),rgba(255,122,26,.11),transparent 55%)}
  .s2-card:hover::before{opacity:1}
  .s2-card>*{position:relative;z-index:1}
  /* dotted texture */
  .s2-dots::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
    background-image:radial-gradient(rgba(20,21,43,.16) 1px,transparent 1.4px);background-size:9px 9px;
    -webkit-mask-image:radial-gradient(70% 90% at 100% 100%,#000,transparent 70%);mask-image:radial-gradient(70% 90% at 100% 100%,#000,transparent 70%);opacity:.55}
  .s2-dots.tl::after{-webkit-mask-image:radial-gradient(60% 80% at 100% 0,#000,transparent 70%);mask-image:radial-gradient(60% 80% at 100% 0,#000,transparent 70%)}

  .s2-h{margin:0;font-size:15px;line-height:1.3;font-weight:600;letter-spacing:-.01em;color:var(--ink)}
  .s2-p{margin:8px 0 0;font-size:12px;line-height:1.65;color:var(--muted)}

  /* reveal */
  .s2-js .s2-card{opacity:0;transform:translateY(26px) scale(.98)}
  .s2-js.s2-in .s2-card{opacity:1;transform:none;transition:opacity .8s var(--ease),transform .9s var(--ease),box-shadow .6s var(--ease),border-color .4s}
  .s2-js.s2-in .s2-card:hover{transform:translateY(-4px)}
  .s2-js.s2-in .s2-a{transition-delay:.05s,.05s,0s,0s}.s2-js.s2-in .s2-b{transition-delay:.15s,.15s,0s,0s}
  .s2-js.s2-in .s2-c{transition-delay:.25s,.25s,0s,0s}.s2-js.s2-in .s2-d{transition-delay:.35s,.35s,0s,0s}
  .s2-js.s2-in .s2-e{transition-delay:.45s,.45s,0s,0s}.s2-js.s2-in .s2-f{transition-delay:.55s,.55s,0s,0s}
  .s2-js.s2-in .s2-g{transition-delay:.65s,.65s,0s,0s}
  .s2-js.s2-in .s2-card:hover{transition-delay:0s}

  /* ============ A · POS workstation ============ */
  .s2-a{display:flex;flex-direction:column;padding:12px 12px 22px}
  .s2-rail{
    position:relative;flex:0 0 auto;height:176px;border-radius:14px;overflow:hidden;
    background:linear-gradient(180deg,#ecebe8,#e6e4e0);border:1px solid rgba(20,21,43,.06);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -14px 30px -20px rgba(20,21,43,.18);
    display:flex;flex-direction:column;justify-content:center;gap:18px;
    -webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);
  }
  .s2-rail::before,.s2-rail::after{content:"";position:absolute;left:0;right:0;height:1px;background:rgba(20,21,43,.12)}
  .s2-rail::before{top:10px}.s2-rail::after{bottom:10px}
  .s2-row{display:flex;gap:30px;width:max-content;animation:s2-mq 34s linear infinite}
  .s2-row.rev{animation-direction:reverse;animation-duration:40s}
  .s2-rail:hover .s2-row{animation-play-state:paused}
  .s2-ic{--c:#6f6f76;width:46px;height:46px;flex:none;display:grid;place-items:center;border-radius:14px;color:var(--c);
    transition:transform .35s var(--ease),color .3s,background .3s,box-shadow .3s}
  .s2-ic svg{width:34px;height:34px}
  .s2-ic:hover{transform:translateY(-4px) scale(1.14);color:var(--b);background:rgba(255,255,255,.85);box-shadow:0 12px 22px -10px rgba(20,21,43,.35)}
  .s2-a-body{padding:20px 12px 0;display:flex;flex-direction:column;flex:1}
  .s2-a-body .s2-h{font-size:16px}
  .s2-btn{
    margin-top:auto;align-self:flex-start;display:inline-flex;align-items:center;gap:9px;cursor:pointer;
    padding:7px 16px 7px 8px;border-radius:999px;border:1px solid rgba(20,21,43,.1);background:#fff;
    font:500 12.5px/1 'Poppins',sans-serif;color:var(--ink);
    box-shadow:0 6px 16px -10px rgba(20,21,43,.4);position:relative;overflow:hidden;transition:transform .3s var(--ease),box-shadow .3s,border-color .3s;
  }
  .s2-btn .gl{width:22px;height:22px;border-radius:7px;display:grid;place-items:center;background:linear-gradient(145deg,var(--o1),var(--o2));
    box-shadow:0 6px 12px -4px rgba(242,84,12,.6),inset 0 1px 0 rgba(255,255,255,.4)}
  .s2-btn .gl svg{width:12px;height:12px}
  .s2-btn .ar{width:0;opacity:0;transition:width .35s var(--ease),opacity .3s,margin .3s;margin-left:-4px;overflow:hidden;color:var(--o2)}
  .s2-btn:hover{transform:translateY(-2px);border-color:rgba(255,122,26,.5);box-shadow:0 14px 26px -12px rgba(242,84,12,.5)}
  .s2-btn:hover .ar{width:14px;opacity:1;margin-left:0}
  .s2-btn::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,150,70,.25) 50%,transparent 70%);transform:translateX(-120%);transition:transform .8s}
  .s2-btn:hover::after{transform:translateX(120%)}
  .s2-btn:focus-visible,.s2-arrow:focus-visible{outline:2px solid var(--o1);outline-offset:3px}

  /* ============ B · donut ============ */
  .s2-b .s2-h{max-width:150px}
  .s2-donut{position:absolute;left:50%;top:62px;width:172px;height:172px;margin-left:-86px;z-index:1}
  .s2-donut svg{width:100%;height:100%;overflow:visible;transform:rotate(-90deg)}
  .s2-donut circle{fill:none;stroke-width:34;transition:stroke-width .35s var(--ease),opacity .3s;cursor:pointer;transform-origin:50% 50%}
  .s2-donut .seg{stroke-dashoffset:0}
  .s2-donut .seg.on{stroke-width:40;filter:drop-shadow(0 6px 10px rgba(242,84,12,.4))}
  .s2-donut.dim .seg:not(.on){opacity:.55}
  .s2-donut .spin{transform-origin:100px 100px;animation:s2-spin 40s linear infinite}
  .s2-donut-tip{position:absolute;right:14px;top:14px;transform:translateY(-4px);padding:3px 9px;border-radius:999px;background:var(--ink);color:#fff;font-size:10px;font-weight:500;white-space:nowrap;opacity:0;transition:.3s var(--ease);z-index:3;pointer-events:none}
  .s2-donut-tip.show{opacity:1;transform:none}
  .s2-toast{
    position:absolute;left:16px;right:16px;bottom:14px;z-index:3;padding:9px 12px 10px;border-radius:12px;background:#fff;
    border:1px solid var(--line);box-shadow:0 14px 30px -14px rgba(20,21,43,.4),0 2px 6px rgba(20,21,43,.05);overflow:hidden;
  }
  .s2-toast small{display:block;font:400 9.5px 'JetBrains Mono',monospace;color:#9a9db0;letter-spacing:.02em}
  .s2-toast span{display:block;margin-top:2px;font-size:11.5px;font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:6px}
  .s2-toast .sl{position:absolute;right:11px;top:9px;width:12px;height:12px}
  .s2-toast .bar{position:absolute;left:0;bottom:0;height:2px;width:100%;background:linear-gradient(90deg,var(--o1),var(--o2));transform-origin:left;animation:s2-bar 3.4s linear infinite}
  .s2-toast .msg{animation:s2-in .5s var(--ease)}

  /* ============ C · globe ============ */
  .s2-c{background:linear-gradient(180deg,#fdfcfa,#f7f4f1)}
  .s2-c .txt{position:relative;z-index:3;max-width:290px}
  @media (max-width:720px){.s2-c .s2-h{padding-right:88px}.s2-b{min-height:240px}}
  .s2-globe{position:absolute;inset:0;z-index:1;cursor:grab;touch-action:pan-y}
  .s2-globe.drag{cursor:grabbing}
  .s2-globe canvas{position:absolute;inset:0;width:100%;height:100%}
  .s2-pins{position:absolute;inset:0;pointer-events:none}
  .s2-pin{position:absolute;left:0;top:0;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;pointer-events:auto;
    border:2px solid #fff;box-shadow:0 6px 14px -3px rgba(0,0,0,.55),0 0 0 3px rgba(80,160,255,.35);background:#223;transition:opacity .25s,box-shadow .3s;will-change:transform}
  .s2-pin svg{width:100%;height:100%;border-radius:50%}
  .s2-pin.hq{width:38px;height:38px;margin:-19px 0 0 -19px;box-shadow:0 8px 18px -3px rgba(0,0,0,.6),0 0 0 3px rgba(255,122,26,.75)}
  .s2-pin.hq::after{content:"HQ";position:absolute;right:-8px;bottom:-5px;font:700 8px/1 'Poppins';padding:3px 4px;border-radius:6px;background:linear-gradient(145deg,var(--o1),var(--o2));color:#fff;border:1.5px solid #fff}
  .s2-pin i{position:absolute;left:50%;top:50%;width:100%;height:100%;border-radius:50%;border:2px solid rgba(255,160,80,.9);transform:translate(-50%,-50%);animation:s2-ring 2.4s infinite;pointer-events:none}
  .s2-pin em{position:absolute;left:50%;bottom:calc(100% + 8px);transform:translate(-50%,4px);white-space:nowrap;font:500 10px 'Poppins';font-style:normal;padding:4px 9px;border-radius:8px;background:rgba(20,21,43,.92);color:#fff;opacity:0;transition:.25s var(--ease);pointer-events:none}
  .s2-pin:hover em{opacity:1;transform:translate(-50%,0)}
  .s2-live{position:absolute;right:14px;top:14px;z-index:3;display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.8);border:1px solid var(--line);font:500 10px 'Poppins';color:var(--ink-2);backdrop-filter:blur(6px)}
  .s2-live>span{display:inline}.s2-live i{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 0 rgba(34,197,94,.6);animation:s2-ping-g 1.8s infinite}

  /* ============ D · wordpress ============ */
  .s2-search{
    margin-top:14px;height:38px;border-radius:999px;background:#fff;border:1px solid rgba(20,21,43,.1);
    display:flex;align-items:center;gap:9px;padding:0 14px 0 12px;box-shadow:0 8px 18px -12px rgba(20,21,43,.35);
    transition:box-shadow .3s,border-color .3s;
  }
  .s2-d:hover .s2-search{border-color:rgba(66,133,244,.45);box-shadow:0 0 0 4px rgba(66,133,244,.1),0 12px 24px -12px rgba(20,21,43,.35)}
  .s2-search .g{width:16px;height:16px;flex:none}
  .s2-search .q{flex:1;font-size:11.5px;color:#4b4f63;white-space:nowrap;overflow:hidden}
  .s2-search .q::after{content:"";display:inline-block;width:1px;height:13px;background:var(--ink);margin-left:1px;vertical-align:-2px;animation:s2-blink 1s steps(1) infinite}
  .s2-search .mic{width:14px;height:14px;color:#4285f4;flex:none}
  .s2-res{
    margin-top:10px;border-radius:14px;background:#fff;border:1px solid var(--line);padding:11px 14px 12px;
    box-shadow:0 18px 30px -22px rgba(20,21,43,.45);transition:transform .5s var(--ease),box-shadow .5s;
  }
  .s2-d:hover .s2-res{transform:translateY(-2px);box-shadow:0 24px 38px -22px rgba(20,21,43,.5)}
  .s2-res .top{display:flex;align-items:center;gap:9px}
  .s2-res .wp{width:18px;height:18px;flex:none;color:#21759b}
  .s2-res .site{font-size:11px;font-weight:600;line-height:1.2}
  .s2-res .crumb{font-size:9.5px;color:#8a8ea1;line-height:1.3}
  .s2-res .sync{margin-left:auto;display:inline-flex;align-items:center;gap:5px;font:500 9.5px 'Poppins';color:#15803d;background:#ecfdf3;border:1px solid #c7f0d8;padding:2px 8px;border-radius:999px;white-space:nowrap}
  .s2-res .sync i{width:5px;height:5px;border-radius:50%;background:#22c55e}
  .s2-res h4{margin:9px 0 0;font-size:11.5px;font-weight:500;color:var(--ink)}
  .s2-sk{margin-top:8px;height:5px;border-radius:4px;background:linear-gradient(90deg,#eceae7 20%,#f8d9c5 40%,#eceae7 60%);background-size:220% 100%;animation:s2-shim 2s linear infinite}
  .s2-sk+.s2-sk{width:70%;margin-top:5px}
  .s2-swap{animation:s2-in .5s var(--ease)}

  /* ============ E · hardware ============ */
  .s2-e .s2-h{max-width:150px}
  .s2-stage{position:absolute;inset:0;z-index:0}
  .s2-stage svg{position:absolute;inset:0;width:100%;height:100%}
  .s2-trace{fill:none;stroke:rgba(242,84,12,.28);stroke-width:1.2;vector-effect:non-scaling-stroke}
  .s2-pulse{fill:none;stroke:url(#s2-pg);stroke-width:2.2;stroke-linecap:round;vector-effect:non-scaling-stroke;stroke-dasharray:9 91;stroke-dashoffset:9;animation:s2-run 3.2s linear infinite}
  .s2-e:hover .s2-pulse{animation-duration:1.4s}
  .s2-node{position:absolute;width:7px;height:7px;margin:-3.5px;border-radius:50%;background:#fff;border:1.5px solid var(--o2)}
  .s2-sq{
    position:absolute;left:66%;top:56%;width:64px;height:64px;margin:-32px 0 0 0;border-radius:22px;z-index:2;
    background:linear-gradient(150deg,#ffc29a 0%,#ff8a45 45%,#f4631c 100%);
    box-shadow:0 26px 40px -10px rgba(244,99,28,.55),inset 0 2px 0 rgba(255,255,255,.65),inset 0 -10px 18px rgba(190,60,0,.22);
    display:grid;place-items:center;transition:transform .6s var(--ease);animation:s2-float 5s ease-in-out infinite;
  }
  .s2-sq::before{content:"";position:absolute;inset:-34px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,138,69,.5),transparent);filter:blur(10px);z-index:-1;animation:s2-glow 3.4s ease-in-out infinite}
  .s2-sq svg{width:26px;height:26px;color:#fff;opacity:.0;transform:scale(.7);transition:.4s var(--ease)}
  .s2-e:hover .s2-sq{transform:rotate(-6deg) scale(1.1)}
  .s2-e:hover .s2-sq svg{opacity:.95;transform:none}
  .s2-chips{position:absolute;left:14px;bottom:14px;z-index:2;display:flex;flex-direction:column;gap:5px;align-items:flex-start;pointer-events:none}
  .s2-chips span{font:500 9.5px 'Poppins';padding:3px 8px;border-radius:999px;background:rgba(255,255,255,.9);border:1px solid var(--line);color:var(--ink-2);opacity:0;transform:translateX(-8px);transition:.45s var(--ease)}
  .s2-e:hover .s2-chips span{opacity:1;transform:none}
  .s2-e:hover .s2-chips span:nth-child(2){transition-delay:.08s}.s2-e:hover .s2-chips span:nth-child(3){transition-delay:.16s}

  /* ============ F · reseller ============ */
  .s2-f{display:flex;flex-direction:column;justify-content:space-between;padding:18px 22px}
  .s2-f .s2-h{font-size:17px}
  .s2-f .s2-p{max-width:360px}
  .s2-arrow{position:absolute;right:16px;top:16px;z-index:2;width:28px;height:28px;border-radius:9px;border:1px solid var(--line);background:#fff;display:grid;place-items:center;cursor:pointer;color:var(--ink);
    box-shadow:0 6px 14px -8px rgba(20,21,43,.4);transition:.35s var(--ease);text-decoration:none}
  .s2-arrow svg{width:11px;height:11px;transition:transform .35s var(--ease)}
  .s2-f:hover .s2-arrow{background:linear-gradient(145deg,var(--o1),var(--o2));color:#fff;border-color:transparent;box-shadow:0 10px 20px -8px rgba(242,84,12,.7)}
  .s2-f:hover .s2-arrow svg{transform:rotate(45deg)}
  .s2-partners{display:flex;align-items:center;gap:10px}
  .s2-stack{display:flex;padding:4px 8px 4px 5px;border-radius:999px;background:rgba(255,255,255,.85);border:1px solid var(--line);box-shadow:0 8px 16px -10px rgba(20,21,43,.4);align-items:center}
  .s2-stack .av{width:26px;height:26px;border-radius:50%;border:2px solid #fff;margin-left:-8px;overflow:hidden;transition:transform .35s var(--ease);box-shadow:0 2px 6px rgba(20,21,43,.2)}
  .s2-stack .av:first-child{margin-left:0}
  .s2-stack .av svg{width:100%;height:100%}
  .s2-stack .av:hover{transform:translateY(-5px) scale(1.12);z-index:3}
  .s2-stack .plus{width:22px;height:22px;margin-left:4px;border-radius:50%;display:grid;place-items:center;font-size:12px;color:var(--muted)}
  .s2-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:11px;color:var(--ink-2);box-shadow:0 8px 16px -10px rgba(20,21,43,.4)}
  .s2-pill b{color:var(--o2);font-weight:600}

  /* ============ G · integrations ============ */
  .s2-g{display:flex;flex-direction:column;padding:16px 0 10px 22px}
  .s2-g .s2-h{font-size:16px;font-weight:400}
  .s2-g .s2-h b{font-weight:600}
  .s2-chiprows{margin-top:10px;display:flex;flex-direction:column;gap:6px;flex:1;justify-content:center;
    -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 90%,transparent)}
  .s2-cr{display:flex;gap:8px;width:max-content;animation:s2-mq 46s linear infinite}
  .s2-cr:nth-child(2){animation-direction:reverse;animation-duration:52s}
  .s2-cr:nth-child(3){animation-duration:58s}
  .s2-chiprows:hover .s2-cr{animation-play-state:paused}
  .s2-chip{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:10px;font-weight:500;color:#4b4f63;white-space:nowrap;box-shadow:0 4px 10px -8px rgba(20,21,43,.5);transition:.3s var(--ease)}
  .s2-chip i{width:5px;height:5px;border-radius:50%;background:var(--d)}
  .s2-chip:hover{transform:translateY(-2px);color:var(--ink);border-color:var(--d);box-shadow:0 8px 16px -8px var(--d)}

  /* ============ modal ============ */
  .s2-modal{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;visibility:hidden;pointer-events:none;font-family:'Poppins',system-ui,sans-serif}
  .s2-modal.open{visibility:visible;pointer-events:auto}
  .s2-scrim{position:absolute;inset:0;background:rgba(18,20,40,.55);backdrop-filter:blur(0);opacity:0;transition:opacity .4s,backdrop-filter .4s}
  .s2-modal.open .s2-scrim{opacity:1;backdrop-filter:blur(9px) saturate(1.2)}
  .s2-dialog{
    position:relative;width:min(100%,460px);max-height:calc(100vh - 40px);overflow:auto;background:#fff;border-radius:24px;
    box-shadow:0 50px 100px -30px rgba(10,12,30,.65),0 0 0 1px rgba(255,255,255,.4) inset;
    transform:translateY(24px) scale(.94);opacity:0;transition:transform .5s var(--ease),opacity .35s;
  }
  .s2-modal.open .s2-dialog{transform:none;opacity:1}
  .s2-dialog::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,var(--o3),var(--o1),var(--o2))}
  .s2-mh{padding:28px 28px 18px;position:relative;border-bottom:1px solid #f0eeeb;
    background:radial-gradient(260px 120px at 0 0,rgba(255,122,26,.10),transparent 70%),#fff}
  .s2-mh h3{margin:0;font-size:18px;font-weight:600;letter-spacing:-.01em;color:var(--ink)}
  .s2-mh p{margin:6px 0 0;font-size:12px;color:var(--muted)}
  .s2-x{position:absolute;right:18px;top:20px;width:32px;height:32px;border-radius:10px;border:0;background:#f5f4f2;cursor:pointer;color:#6c7084;display:grid;place-items:center;transition:.3s var(--ease)}
  .s2-x:hover{background:var(--peach-2);color:var(--o2);transform:rotate(90deg)}
  .s2-x:focus-visible{outline:2px solid var(--o1)}
  .s2-form{padding:20px 28px 26px;display:grid;grid-template-columns:1fr 1fr;gap:14px 14px}
  .s2-fld{display:flex;flex-direction:column;gap:6px;min-width:0}
  .s2-fld label{font-size:11px;font-weight:600;color:var(--ink-2)}
  .s2-fld input,.s2-fld select{
    width:100%;height:40px;padding:0 12px;border-radius:10px;border:1px solid #e7e4e0;background:#f7f6f4;font:400 12.5px 'Poppins',sans-serif;color:var(--ink);outline:none;
    transition:border-color .25s,box-shadow .25s,background .25s;appearance:none;-webkit-appearance:none;
  }
  .s2-fld select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236c7084' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 11px center;padding-right:30px;cursor:pointer}
  .s2-fld input::placeholder{color:#a7a9b8}
  .s2-fld input:hover,.s2-fld select:hover{border-color:#d9d5cf}
  .s2-fld input:focus,.s2-fld select:focus{background:#fff;border-color:var(--o1);box-shadow:0 0 0 4px rgba(255,122,26,.15)}
  .s2-fld.err input{border-color:#ef4444;box-shadow:0 0 0 4px rgba(239,68,68,.12);animation:s2-shake .4s}
  .s2-fld .em{font-size:10px;color:#dc2626;min-height:0;display:none}
  .s2-fld.err .em{display:block}
  .s2-perks{grid-column:1/-1;margin:2px 0 0;padding:12px 14px;border-radius:14px;background:linear-gradient(135deg,#fff3ea,#ffeadb);border:1px solid #ffdcc3;display:grid;gap:8px;list-style:none}
  .s2-perks li{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:500;color:#5a2d0f}
  .s2-perks svg{width:17px;height:17px;flex:none;color:var(--o2)}
  .s2-go{
    grid-column:1/-1;height:46px;border:0;border-radius:999px;cursor:pointer;position:relative;overflow:hidden;
    font:600 13.5px 'Poppins',sans-serif;color:#fff;letter-spacing:.01em;
    background:linear-gradient(95deg,#ff7a1a,#f2540c 60%,#e04508);
    box-shadow:0 16px 28px -12px rgba(242,84,12,.75),inset 0 1px 0 rgba(255,255,255,.35);transition:transform .3s var(--ease),box-shadow .3s;
  }
  .s2-go:hover{transform:translateY(-2px);box-shadow:0 22px 34px -12px rgba(242,84,12,.85),inset 0 1px 0 rgba(255,255,255,.4)}
  .s2-go:active{transform:translateY(0) scale(.99)}
  .s2-go::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 35%,rgba(255,255,255,.4) 50%,transparent 65%);transform:translateX(-130%);animation:s2-sheen 3.4s 1s infinite}
  .s2-go:focus-visible{outline:3px solid rgba(255,122,26,.4);outline-offset:3px}
  .s2-go.loading{pointer-events:none;opacity:.9}
  .s2-go.loading span{opacity:0}
  .s2-go.loading::before{content:"";position:absolute;left:50%;top:50%;width:18px;height:18px;margin:-9px;border-radius:50%;border:2.5px solid rgba(255,255,255,.4);border-top-color:#fff;animation:s2-spin .7s linear infinite}
  .s2-fine{grid-column:1/-1;margin:-2px 0 0;text-align:center;font-size:10.5px;color:#9a9db0}
  .s2-ok{display:none;padding:38px 28px 30px;text-align:center}
  .s2-ok.show{display:block;animation:s2-in .6s var(--ease)}
  .s2-ok .ring{width:72px;height:72px;margin:0 auto 18px}
  .s2-ok .ring circle{fill:#fff3ea;stroke:var(--o1);stroke-width:3;stroke-dasharray:190;stroke-dashoffset:190;animation:s2-draw .8s .1s forwards}
  .s2-ok .ring path{fill:none;stroke:var(--o2);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:40;stroke-dashoffset:40;animation:s2-draw .5s .75s forwards}
  .s2-ok h3{margin:0;font-size:19px;font-weight:600}
  .s2-ok p{margin:8px auto 22px;max-width:320px;font-size:12.5px;line-height:1.7;color:var(--muted)}
  .s2-ok p b{color:var(--ink)}
  .s2-ok button{height:42px;padding:0 26px;border-radius:999px;border:1px solid var(--line);background:#fff;font:500 12.5px 'Poppins';cursor:pointer;color:var(--ink);transition:.3s var(--ease)}
  .s2-ok button:hover{border-color:var(--o1);color:var(--o2)}
  body.s2-lock{overflow:hidden}

  /* ============ keyframes ============ */
  @keyframes s2-mq{to{transform:translateX(-50%)}}
  @keyframes s2-spin{to{transform:rotate(360deg)}}
  @keyframes s2-ping{70%{box-shadow:0 0 0 8px rgba(255,122,26,0)}100%{box-shadow:0 0 0 0 rgba(255,122,26,0)}}
  @keyframes s2-ping-g{70%{box-shadow:0 0 0 7px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
  @keyframes s2-ring{0%{transform:translate(-50%,-50%) scale(1);opacity:.9}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}
  @keyframes s2-bar{from{transform:scaleX(1)}to{transform:scaleX(0)}}
  @keyframes s2-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes s2-blink{50%{opacity:0}}
  @keyframes s2-shim{to{background-position:-220% 0}}
  @keyframes s2-run{to{stroke-dashoffset:-91}}
  @keyframes s2-float{50%{translate:0 -6px}}
  @keyframes s2-glow{50%{opacity:.55;transform:scale(1.15)}}
  @keyframes s2-sheen{40%,100%{transform:translateX(130%)}}
  @keyframes s2-shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
  @keyframes s2-draw{to{stroke-dashoffset:0}}

  /* ============ responsive ============ */
  @media (max-width:1020px){
    .s2-grid{grid-template-columns:repeat(6,minmax(0,1fr));grid-template-rows:none;grid-auto-rows:minmax(212px,auto)}
    .s2-a{grid-column:1/4;grid-row:span 2}.s2-b{grid-column:4/7;grid-row:auto}.s2-c{grid-column:4/7;grid-row:auto}
    .s2-d{grid-column:1/5;grid-row:auto}.s2-e{grid-column:5/7;grid-row:auto}
    .s2-f{grid-column:1/7;grid-row:auto;min-height:150px}.s2-g{grid-column:1/7;grid-row:auto;min-height:150px}
  }
  @media (max-width:720px){
    .s2-grid{grid-template-columns:1fr}
    .s2-a,.s2-b,.s2-c,.s2-d,.s2-e,.s2-f,.s2-g{grid-column:1;grid-row:auto}
    .s2-a{min-height:420px}.s2-c{min-height:260px}.s2-e{min-height:210px}
    .s2-form{grid-template-columns:1fr}
    .s2-sq{left:70%}
  }
  @media (prefers-reduced-motion:reduce){
    .s2 *,.s2-modal *{animation-duration:.001s!important;animation-iteration-count:1!important;transition-duration:.001s!important}
    .s2-row,.s2-cr{animation:none!important}
  }

/* the Vue port renders each pin avatar inside a span */
.s2-pin-av{position:absolute;inset:0;border-radius:50%;overflow:hidden}
.s2-pin-av svg{width:100%;height:100%}
/* standalone background so the section looks right even if the parent has none is built into .s2 */
</style>