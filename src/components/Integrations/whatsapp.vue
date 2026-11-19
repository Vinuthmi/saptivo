<template>
  <section ref="root" class="isc" :class="{ 'isc-arm': armed, 'isc-in': shown }" aria-label="Saptivo integrations">
    <!-- shared icon sprite -->
    <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
      <symbol id="isc-check" viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></symbol>
      <symbol id="isc-wa" viewBox="0 0 24 24"><path d="M12 3.4a8.6 8.6 0 0 0-7.4 13L3.4 20.6l4.4-1.2A8.6 8.6 0 1 0 12 3.4Z" /><path d="M9 8.6c.2 3 2.3 5.4 5.9 6.2l1-1.5-2-1-.9.8a4.6 4.6 0 0 1-2-2l.8-.9-1-2Z" fill="currentColor" stroke="none" /></symbol>
      <symbol id="isc-phone" viewBox="0 0 24 24"><path d="M6.6 3.5h3l1.3 4-2 1.3a11 11 0 0 0 5.3 5.3l1.3-2 4 1.3v3a2 2 0 0 1-2.2 2A15.8 15.8 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" /></symbol>
      <symbol id="isc-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></symbol>
      <symbol id="isc-sync" viewBox="0 0 24 24"><path d="M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2M20 4v4h-4M4 20v-4h4" /></symbol>
    </svg>

    <!-- arrows: top right corner -->
    <div class="isc-arrows">
      <button type="button" class="isc-ar" aria-label="Previous integration" :disabled="atStart" @click="go(active - 1)">
        <svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6" /></svg>
      </button>
      <button type="button" class="isc-ar" aria-label="Next integration" :disabled="atEnd" @click="go(active + 1)">
        <svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" /></svg>
      </button>
    </div>

    <div
      ref="track"
      class="isc-track"
      :class="{ 'is-drag': dragging }"
      tabindex="0"
      role="region"
      aria-roledescription="carousel"
      aria-label="Saptivo integrations. Use the left and right arrow keys to move between cards."
      @scroll.passive="onScroll"
      @keydown="onKey"
      @pointerdown="pDown"
      @click.capture="onClickCapture"
      @dragstart.prevent
    >
      <article v-for="(c, i) in cards" :key="c.key" class="isc-card" :class="'k-' + c.key" :style="{ '--i': i }">
        <!-- ===================== visual composition ===================== -->
        <div class="visw"><div class="vis" aria-hidden="true">
          <span class="blob b1"></span>
          <span class="blob b2"></span>

          <!-- 01 · WordPress -->
          <template v-if="c.key === 'wordpress'">
            <div class="win w-wp">
              <div class="win-bar"><i></i><i></i><i></i><span class="url">yourwebsite.com/contact</span></div>
              <div class="win-body">
                <b class="f-title">Contact us</b>
                <div class="field"><small>Name</small><u></u></div>
                <div class="field"><small>Email</small><u></u></div>
                <div class="field"><small>Message</small><u class="tall"></u></div>
                <span class="btn-navy">Send message</span>
              </div>
            </div>
            <span class="mk mk-wp float" style="--d: 0s; right: 7%; top: 6%">W</span>
            <div class="glass g-wp-note float" style="--d: 1.2s">
              <div class="g-h"><img class="lg" :src="logoSrc" alt="" draggable="false" /><b>New inquiry</b><em class="chip ok">just now</em></div>
              <div class="chips"><span>Customer details</span><span>Message</span><span>Page they came from</span></div>
            </div>
            <div class="glass g-wp-side float" style="--d: 2.4s">
              <div class="rw"><small>Customer</small><u></u></div>
              <div class="rw"><small>Assigned to</small><span class="av"></span><b>Round-robin</b></div>
              <div class="rw"><small>Status</small><em class="chip wip">New</em></div>
            </div>
          </template>

          <!-- 02 · Facebook -->
          <template v-else-if="c.key === 'facebook'">
            <div class="photo"></div>
            <div class="phone ph-fb float" style="--d: 0s">
              <div class="ph-screen">
                <div class="fb-top"><i class="fbc">f</i><div><b>Your Facebook Page</b><small>Instant Form</small></div></div>
                <div class="field"><small>Full name</small><u></u></div>
                <div class="field"><small>Email</small><u></u></div>
                <div class="field"><small>Phone</small><u></u></div>
                <span class="btn-fb">Submit</span>
              </div>
            </div>
            <span class="mk mk-fb float" style="--d: 0.8s; right: 7%; top: 6%">f</span>
            <div class="glass g-fb-lead float" style="--d: 1.4s">
              <div class="g-h"><img class="lg" :src="logoSrc" alt="" draggable="false" /><b>New lead</b></div>
              <div class="rw"><small>Lead score</small><span class="meter"><i></i></span></div>
              <div class="rw"><small>Routed to</small><span class="av"></span><b>Salesperson</b></div>
            </div>
            <div class="glass g-fb-sent float" style="--d: 2.6s"><i class="dot"></i>WhatsApp or SMS acknowledgement</div>
          </template>

          <!-- 03 · WhatsApp -->
          <template v-else-if="c.key === 'whatsapp'">
            <div class="phone ph-wa float" style="--d: 0s">
              <div class="ph-screen wa">
                <div class="wa-top"><span class="av">NR</span><div><b>Nuwan R.</b><small>online</small></div></div>
                <div class="bub in"><span class="tx">Hi, is my quotation ready?</span></div>
                <div class="bub out"><span class="tag">Template</span><span class="tx">Quotation Q-1042 is ready to view</span></div>
                <div class="bub in media"><span class="thumb">PDF</span><span class="tx">Quote-1042.pdf</span></div>
                <div class="bub out"><span class="tx">Sent ✓✓</span></div>
                <div class="wa-in"><span class="tx ph">Type a message</span></div>
              </div>
            </div>
            <span class="brand float" style="--d: 0.6s; right: 8%; top: 6%" v-html="logos.wa"></span>
            <div class="glass g-wa-b1 float" style="--d: 1s"><b>New message</b><small>Hi, is my quotation ready?</small></div>
            <div class="glass g-wa-crm float" style="--d: 2s">
              <div class="g-h"><img class="lg" :src="logoSrc" alt="" draggable="false" /><b>Shared inbox</b><em class="chip ok">Synced</em></div>
              <div class="rw"><small>Assigned</small><span class="av">AS</span><b>Amal S.</b></div>
              <div class="rw"><small>Status</small><em class="chip ok">Open</em></div>
              <div class="rw"><small>Customer</small><b>Nuwan R.</b></div>
            </div>
          </template>

          <!-- 04 · 3CX -->
          <template v-else-if="c.key === '3cx'">
            <div class="deskphone">
              <div class="dp-screen"><small>Ext. 101</small><b>Ready</b></div>
              <div class="dp-keys"><i v-for="n in 12" :key="n"></i></div>
            </div>
            <span class="brand float" style="--d: 0.5s; right: 7%; top: 6%" v-html="logos.cx"></span>
            <div class="glass g-cx-call float" style="--d: 0s">
              <span class="av">KP</span>
              <div class="ic-t"><b>Incoming call</b><small>Kasun Perera</small></div>
              <span class="rb ok"><svg><use href="#isc-phone" /></svg></span>
              <span class="rb no"><svg><use href="#isc-phone" /></svg></span>
            </div>
            <div class="glass g-cx-rec float" style="--d: 1.6s">
              <div class="g-h"><img class="lg" :src="logoSrc" alt="" draggable="false" /><b>Caller record</b></div>
              <div class="rw"><small>Duration</small><b class="tm">{{ clock }}</b></div>
              <div class="rw"><small>Last call</small><b>4:12 · Resolved</b></div>
              <div class="rw"><small>Missed</small><b>Callback task</b></div>
            </div>
          </template>

          <!-- 05 · Vodia -->
          <template v-else-if="c.key === 'vodia'">
            <div class="photo ph-vo"><img :src="c.img" alt="" loading="lazy" draggable="false" @error="$event.target.style.display = 'none'" /></div>
            <span class="brand float" style="--d: 0.4s; right: 12%; top: 11%" v-html="logos.vo"></span>
            <div class="glass g-vo-ai float" style="--d: 0s">
              <span class="wave"><i v-for="n in 9" :key="n" :style="{ '--n': n }"></i></span>
              <div class="ic-t"><b>AI voice agent</b><small>Calling</small></div>
              <em class="chip wip">Live</em>
            </div>
            <div class="glass g-vo-act float" style="--d: 1.8s">
              <div class="g-h"><img class="lg" :src="logoSrc" alt="" draggable="false" /><b>Call activity</b></div>
              <div class="li"><i class="d1"></i>Appointment reminder</div>
              <div class="li"><i class="d2"></i>Payment reminder</div>
              <div class="li"><i class="d3"></i>Renewal reminder</div>
              <div class="li back"><svg><use href="#isc-check" /></svg>Outcome back in the CRM</div>
            </div>
          </template>

          <!-- 06 · Google Calendar -->
          <template v-else-if="c.key === 'calendar'">
            <div class="win w-cal">
              <div class="cal-h"><b>November 2026</b><span>‹ ›</span></div>
              <div class="cal-days"><small v-for="(d, di) in 'SMTWTFS'.split('')" :key="di">{{ d }}</small></div>
              <div class="cal-grid">
                <i v-for="(d, n) in calDays" :key="n" :class="[calClass(d), { today: d === 17, off: !d }]">{{ d || '' }}</i>
              </div>
            </div>
            <span class="brand float" style="--d: 0.3s; right: 8%; top: 6%" v-html="logos.gc"></span>
            <div class="glass g-cal-note float" style="--d: 1s">
              <span class="brand s" v-html="logos.gc"></span>
              <div class="ic-t"><b>Meeting booked</b><small>Demo · 10:30</small></div>
            </div>
            <div class="glass g-cal-task float" style="--d: 2.2s">
              <div class="g-h"><img class="lg" :src="logoSrc" alt="" draggable="false" /><b>Tasks</b><svg class="sy"><use href="#isc-sync" /></svg></div>
              <div class="li"><i class="d1"></i>Follow-up<span class="when">Today</span></div>
              <div class="li"><i class="d3"></i>Service visit<span class="when">Fri</span></div>
            </div>
          </template>

          <!-- 07 · REST API -->
          <template v-else>
            <div class="code">
              <div class="code-bar"><i></i><i></i><i></i><span>request.http</span></div>
              <pre><span class="k">POST</span> /leads
<span class="c">Authorization:</span> OAuth 2.0
{ <span class="s">"source"</span>: <span class="s">"webhook"</span> }
<span class="ok">→ 200 OK</span></pre>
            </div>
            <svg class="wires" viewBox="0 0 100 44" preserveAspectRatio="none">
              <path d="M50 22 L14 8" /><path d="M50 22 L14 36" /><path d="M50 22 L86 8" /><path d="M50 22 L86 36" />
            </svg>
            <span class="node n0 float" style="--d: 0s" v-html="logos.api"></span>
            <span class="node n1">Accounting</span>
            <span class="node n2">E-commerce</span>
            <span class="node n3">Zapier</span>
            <span class="node n4">Make</span>
            <div class="glass g-api float" style="--d: 1.4s">
              <div class="li"><svg><use href="#isc-check" /></svg>API connected</div>
              <div class="li"><svg><use href="#isc-check" /></svg>Webhook delivered</div>
              <div class="act"><i v-for="n in 12" :key="n" :style="{ '--n': n }"></i></div>
            </div>
          </template>
        </div></div>

        <!-- ===================== copy ===================== -->
        <div class="txt">
          <h3 class="t-h">{{ c.title }}</h3>
          <p class="t-p">{{ c.text }}</p>
          <ul v-if="c.points" class="t-ul">
            <li v-for="p in c.points" :key="p">{{ p }}</li>
          </ul>
        </div>
      </article>
      <span class="isc-end" aria-hidden="true"></span>
    </div>

    <!-- ===================== navigation: arrows + dots ===================== -->
    <div class="isc-nav">
      <div class="isc-dots" role="group" aria-label="Choose which integration to show">
        <button
          v-for="n in dotCount"
          :key="n"
          type="button"
          class="isc-dot"
          :class="{ on: active === n - 1 }"
          :aria-label="`Go to integration ${n}`"
          :aria-current="active === n - 1 ? 'true' : undefined"
          @click="go(n - 1)"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * IntegrationsShowcase.vue — premium integrations carousel (Vue 3, Composition API, <script setup>, scoped CSS)
 *
 * Seven portrait cards in a horizontal scroll-snap carousel. Exactly TWO cards fill the visible area on desktop and
 * tablet; phones show one card at a time. Navigation: previous / next buttons and a row of dots underneath (one dot per
 * reachable position, the active one stretches into a pill), drag-to-scroll with the mouse, native swipe on touch and
 * Left / Right / Home / End on the keyboard. No autoplay. The page never scrolls sideways: only the track scrolls.
 * Each card has one main composition and two or three floating frosted-glass UI elements (backdrop-filter blur),
 * drawn in CSS with no external animation library. Floating motion is gentle and switches off for
 * prefers-reduced-motion.
 *
 * Content: all seven blocks are in the `cards` array below, word for word. Card headings render as <h3> because
 * the section already has an <h2>. UI labels inside the mockups are illustrative; grey bars are placeholders and no
 * statistics are invented.
 * Brand marks (W, f, WhatsApp, 3CX, V, 31) are simple stand-ins; swap in the official, permitted assets before launch.
 * Photos on the Facebook and Vodia cards are Unsplash URLs in `img` (swap for your own); a soft colour shows if
 * they fail to load. The Vodia link target is a guess, change it in the data.
 * Place it directly after <HeroSection /> in the homepage view; nothing else has to change.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'IntegrationsShowcase' })

const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`

// brand marks drawn as SVG (own drawings; swap in the official, permitted assets before launch)
const logos = {
  wa: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="5.500" fill="#25d366"/><path transform="translate(3.800 3.800) scale(0.683)" fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.714.306 1.272.489 1.705.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
  cx: '<svg viewBox="0 0 48 48"><defs><linearGradient id="lc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b8ae0"/><stop offset="1" stop-color="#0b5aa8"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#lc)"/><text x="24" y="29.500" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="15.500" font-weight="700" letter-spacing="-0.800" fill="#fff">3CX</text></svg>',
  vo: '<svg viewBox="0 0 48 48"><defs><linearGradient id="lv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9b7cf0"/><stop offset="1" stop-color="#5b3fb8"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#lv)"/><path d="M12.500 14.500 24 34l11.500-19.500" fill="none" stroke="#fff" stroke-width="4.600" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gc: '<svg viewBox="0 0 48 48"><defs><clipPath id="gcc"><rect x="3" y="3" width="42" height="42" rx="8"/></clipPath></defs><g clip-path="url(#gcc)"><rect x="3" y="3" width="42" height="42" fill="#fff"/><path d="M3 3h31v9H12v22H3z" fill="#4285f4"/><path d="M34 3h11v9H34z" fill="#1967d2"/><path d="M36 12h9v22h-9z" fill="#fbbc04"/><path d="M3 34h9v11H3z" fill="#188038"/><path d="M12 36h22v9H12z" fill="#34a853"/><path d="M34 34h11l-11 11z" fill="#ea4335"/><path d="M34 34v11l11-11z" fill="#c5221f" opacity="0"/></g><text x="24" y="31.500" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="17" font-weight="600" fill="#4285f4">31</text></svg>',
  api: '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#14243a"/><path d="M19 16 11 24l8 8M29 16l8 8-8 8M26 14l-4 20" fill="none" stroke="#fff" stroke-width="3.200" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}

const cards = [
  {
    key: 'wordpress',
    title: 'WordPress website inquiry sync',
    text: "Your website is often the first place a customer reaches out. With Saptivo's WordPress CRM integration, every contact-form submission arrives in your CRM as a new inquiry within moments, with the customer's details, message and the page they came from.",
  },
  {
    key: 'facebook',
    title: 'Facebook Lead Ads integration',
    text: "Paid social campaigns only pay off if leads are called back quickly. Saptivo's Facebook Lead Ads CRM integration creates a lead the moment someone submits an Instant Form on your Facebook Page, scores it and routes it to a salesperson.",
  },
  {
    key: 'whatsapp',
    title: 'WhatsApp Business API',
    text: 'Connect your official WhatsApp Business number and turn it into a shared team inbox. Chats, media and templates sync both ways, and every conversation is logged on the customer timeline.',
    cta: { label: 'Learn more about WhatsApp CRM.', href: '/features/whatsapp-crm/' },
  },
  {
    key: '3cx',
    title: '3CX phone system',
    text: "Map your 3CX DID, queues and extensions to Saptivo. Incoming calls open the caller's record before you answer, every call is logged with duration and outcome, and missed calls turn into callback tasks.",
    cta: { label: 'Learn more about 3CX call integration.', href: '/features/3cx-crm-integration/' },
  },
  {
    key: 'vodia',
    title: 'Vodia PBX and AI voice agents',
    text: "Connect a Vodia phone system to log calls, pop up caller details and click to call, just as with 3CX. Vodia's AI voice agents can also call customers for appointment, payment and renewal reminders using Saptivo data, and the outcome of each call comes back into the CRM.",
    cta: { label: 'Learn more about Vodia integration and AI calls.', href: '/integrations/vodia/' },
    img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80&auto=format&fit=crop',
  },
  {
    key: 'calendar',
    title: 'Google Calendar two-way sync',
    text: 'CRM follow-ups, demos and service visits appear in Google Calendar, and meetings booked in Google Calendar appear in Saptivo. Your team keeps one schedule, wherever they look.',
  },
  {
    key: 'api',
    title: 'Open REST API and webhooks',
    text: "For everything else, Saptivo's RESTful API with OAuth 2.0 authentication and outbound webhooks connects accounting software, e-commerce platforms and in-house systems. Zapier and Make compatibility lets non-developers build connections too.",
  },
]

// decorative month grid for the calendar card: a few filled days
// November 2026 starts on a Sunday, so the 30 days fill five rows of a Sunday-first grid
const calDays = Array.from({ length: 35 }, (_, i) => (i < 30 ? i + 1 : 0))
const calEvents = { 4: 'e1', 6: 'e3', 10: 'e2', 13: 'e1', 17: 'e3', 19: 'e2', 20: 'e1', 25: 'e1', 27: 'e3' }
const calClass = (d) => (d ? calEvents[d] || '' : '')

/* ---------- carousel ---------- */
const root = ref(null)
const track = ref(null)
const armed = ref(false)
const shown = ref(false)
const active = ref(0) // index of the left-most visible card
const perView = ref(2) // cards visible at once (read from the CSS variable --show)
const atStart = ref(true)
const atEnd = ref(false)
const dragging = ref(false)
const clock = ref('00:00')

// one dot per reachable scroll position (7 cards, 2 visible → 6 dots; phones: 7 dots)
const dotCount = computed(() => Math.max(1, cards.length - perView.value + 1))
const lastIndex = () => Math.max(0, cards.length - perView.value)

let raf = 0
let io = null
let tClock = null
let sec = 0

function step() {
  const el = track.value
  const first = el?.querySelector('.isc-card')
  if (!el || !first) return 0
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0
  return first.getBoundingClientRect().width + gap
}
function measure() {
  const el = track.value
  const s = step()
  if (!el || !s) return
  perView.value = Math.max(1, Math.floor(parseFloat(getComputedStyle(el).getPropertyValue('--show')) || 1))
  const max = el.scrollWidth - el.clientWidth
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft >= max - 4
  active.value = atEnd.value ? lastIndex() : Math.min(lastIndex(), Math.round(el.scrollLeft / s))
}
function onScroll() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(measure)
}
function go(i) {
  const el = track.value
  if (!el) return
  const k = Math.max(0, Math.min(lastIndex(), i))
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollTo({ left: k * step(), behavior: reduce ? 'auto' : 'smooth' })
}
function onKey(e) {
  if (e.key === 'ArrowRight') go(active.value + 1)
  else if (e.key === 'ArrowLeft') go(active.value - 1)
  else if (e.key === 'Home') go(0)
  else if (e.key === 'End') go(lastIndex())
  else return
  e.preventDefault()
}

/* mouse drag-to-scroll (touch and trackpads already scroll natively) */
let down = false
let moved = false
let startX = 0
let startL = 0
function pDown(e) {
  if (e.pointerType !== 'mouse' || e.button !== 0) return
  down = true
  moved = false
  startX = e.clientX
  startL = track.value.scrollLeft
  window.addEventListener('pointermove', pMove)
  window.addEventListener('pointerup', pUp)
}
function pMove(e) {
  if (!down) return
  const dx = e.clientX - startX
  if (!moved && Math.abs(dx) > 5) {
    moved = true
    dragging.value = true
  }
  if (moved) track.value.scrollLeft = startL - dx
}
function pUp() {
  window.removeEventListener('pointermove', pMove)
  window.removeEventListener('pointerup', pUp)
  if (!down) return
  down = false
  if (moved) {
    dragging.value = false
    go(Math.round(track.value.scrollLeft / step()))
  }
}
function onClickCapture(e) {
  // a drag must not count as a click on a link
  if (moved) {
    e.preventDefault()
    e.stopPropagation()
    moved = false
  }
}

onMounted(() => {
  measure()
  window.addEventListener('resize', onScroll)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    shown.value = true
    return
  }
  armed.value = true
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true
        io.disconnect()
      }
    },
    { threshold: 0.1 },
  )
  io.observe(root.value)
  // tiny call timer for the 3CX mockup
  tClock = setInterval(() => {
    if (document.hidden) return
    sec = (sec + 1) % 60
    clock.value = `00:${String(sec).padStart(2, '0')}`
  }, 1000)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('pointermove', pMove)
  window.removeEventListener('pointerup', pUp)
  io?.disconnect()
  clearInterval(tClock)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Urbanist:wght@500;600&family=JetBrains+Mono:wght@400;500&display=swap');
</style>

<style scoped>
.isc {
  --navy: #14243a;
  --orange: #ff6b16;
  --ivory: #f9f8f4;
  --beige: #f4f1de;
  --grey: #d3c3b9;
  --sage: #d4dec9;
  --blue: #c5d9f1;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --gap: clamp(14px, 1.6vw, 22px);
  container-type: inline-size;
  width: 100%;
  padding: 0 0 clamp(28px, 3.4vw, 48px);
  background: #fff;
  color: var(--navy);
  font-family: 'Poppins', system-ui, sans-serif;
  overflow-x: clip; /* the page never scrolls sideways, only the track does */
}
.isc *,
.isc *::before,
.isc *::after {
  box-sizing: border-box;
}
.isc svg {
  display: block;
}
.isc use {
  pointer-events: none;
}

/* ---------- track: exactly two cards fit between the side paddings ---------- */
.isc-track {
  --show: 2; /* cards visible side by side */
  --pad: clamp(10px, 1.4vw, 20px);
  display: flex;
  gap: var(--gap);
  padding: 8px 0 8px var(--pad);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-left: var(--pad);
  scrollbar-width: none;
  cursor: grab;
  outline: none;
}
.isc-track::-webkit-scrollbar {
  display: none;
}
.isc-track.is-drag {
  cursor: grabbing;
  scroll-snap-type: none;
  user-select: none;
}
.isc-track:focus-visible {
  outline: 2px solid var(--navy);
  outline-offset: 3px;
}
/* right-hand breathing room: cancels the flex gap, then adds the same padding as the left side */
.isc-end {
  flex: 0 0 var(--pad);
  margin-left: calc(var(--gap) * -1);
}

/* ---------- arrows: top right corner ---------- */
.isc-arrows {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: clamp(8px, 1.2vw, 16px) var(--pad, 16px) clamp(10px, 1.4vw, 18px);
}
.isc-arrows .isc-ar { width: 44px; height: 44px; }

/* ---------- navigation: dots ---------- */
.isc-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(14px, 1.8vw, 22px);
  margin-top: clamp(20px, 2.4vw, 32px);
  padding: 0 var(--pad, 16px);
}
.isc-ar {
  display: grid;
  place-items: center;
  flex: none;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid rgba(20, 36, 58, 0.12);
  border-radius: 50%;
  background: #fff;
  color: var(--navy);
  box-shadow: 0 10px 22px -14px rgba(20, 36, 58, 0.55), 0 1px 2px rgba(20, 36, 58, 0.06);
  cursor: pointer;
  transition: background 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s var(--ease), opacity 0.3s;
}
.isc-ar svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.3s var(--ease);
}
.isc-ar:hover:not(:disabled) {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
  box-shadow: 0 16px 28px -14px rgba(20, 36, 58, 0.7);
  transform: translateY(-2px);
}
.isc-ar:first-child:hover:not(:disabled) svg {
  transform: translateX(-2px);
}
.isc-ar:last-child:hover:not(:disabled) svg {
  transform: translateX(2px);
}
.isc-ar:active:not(:disabled) {
  transform: scale(0.94);
}
.isc-ar:disabled {
  opacity: 0.38;
  cursor: default;
  box-shadow: none;
}
.isc-ar:focus-visible,
.isc-dot:focus-visible {
  outline: 2px solid var(--navy);
  outline-offset: 3px;
}

.isc-dots {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  height: 48px;
}
.isc-dot {
  position: relative;
  flex: none;
  width: 8px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: #c3c9d3;
  cursor: pointer;
  transition: width 0.45s var(--ease), background 0.3s;
}
.isc-dot::after {
  /* larger invisible tap area */
  content: '';
  position: absolute;
  inset: -12px -4px;
}
.isc-dot:hover {
  background: #8d97a6;
}
.isc-dot.on {
  width: 28px;
  background: var(--navy);
}

/* ---------- card ---------- */
.isc-card {
  position: relative;
  flex: 0 0 calc((100cqw - var(--pad) * 2 - var(--gap) * (var(--show) - 1)) / var(--show));
  min-width: 270px;
  display: flex;
  flex-direction: column;
  container-type: inline-size;
  border: 1px solid rgba(20, 36, 58, 0.08);
  border-radius: 22px;
  overflow: hidden;
  isolation: isolate;
  scroll-snap-align: start;
  background: var(--tone);
  transition: transform 0.5s var(--ease);
}
.isc-card:hover {
  transform: translateY(-6px);
}
.k-wordpress { --tone: #e8decb; }
.k-facebook { --tone: #d9e6fb; }
.k-whatsapp { --tone: #d4dec9; }
.k-3cx { --tone: #c5d9f1; }
.k-vodia { --tone: #dad4ee; }
.k-calendar { --tone: #dde3f6; }
.k-api { --tone: #d9d0c4; }

/* ---------- visual area (everything inside scales with the card width) ---------- */
.visw {
  position: relative;
  flex: none;
  container-type: inline-size;
}
.visw { --vpos: relative; --vhgt: 104cqw; }
.vis {
  position: var(--vpos);
  inset: 0;
  height: var(--vhgt);
  overflow: hidden;
}
/* the card switches to side-by-side only when the section is wide enough for 2 cards of 700px+ (the card cannot query its own width) */
@container (min-width: 1465px) {
  .isc-card { flex-direction: row; }
}
@container (min-width: 700px) {
  .visw { flex: 0 0 46%; min-height: 400px; }
  .visw { --vpos: absolute; --vhgt: 100%; }
  .txt { justify-content: flex-end; padding: 28px 30px 30px; }
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(26px);
  opacity: 0.8;
}
.b1 { left: -14%; bottom: -10%; width: 62%; aspect-ratio: 1; background: #fff; opacity: 0.4; }
.b2 { right: -16%; top: -10%; width: 58%; aspect-ratio: 1; background: var(--blob, #fff); opacity: 0.55; }
.k-wordpress { --blob: #d3c3b9; }
.k-facebook { --blob: #1877f2; }
.k-whatsapp { --blob: #f6f1e4; }
.k-3cx { --blob: #14243a; }
.k-vodia { --blob: #b9c6ee; }
.k-calendar { --blob: #c5d9f1; }
.k-api { --blob: #a9a094; }

.vis > * { position: absolute; }
.vis u {
  display: block;
  height: 1.8cqw;
  min-height: 5px;
  border-radius: 6px;
  background: #e6e8ee;
  text-decoration: none;
}
.vis u.s { width: 62%; margin-top: 1.4cqw; }
.vis u.tall { height: 5cqw; }
.vis small { font-size: clamp(8.5px, 2.4cqw, 10.5px); color: #8a93a1; }
.vis b { font-weight: 600; }

/* glass panels */
.glass {
  padding: 3cqw 3.4cqw;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: clamp(12px, 3.6cqw, 18px);
  background: rgba(255, 255, 255, 0.5);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 18px 38px -20px rgba(20, 36, 58, 0.4);
  font-size: clamp(9.5px, 2.7cqw, 12px);
  color: var(--navy);
}
.g-h { display: flex; align-items: center; gap: 2cqw; margin-bottom: 2.2cqw; }
.g-h b { flex: 1; min-width: 0; font-size: clamp(10px, 2.9cqw, 12.5px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lg { display: block; width: auto; height: clamp(9px, 2.6cqw, 12px); filter: brightness(0); }
.sy { width: clamp(12px, 3cqw, 15px); height: clamp(12px, 3cqw, 15px); fill: none; stroke: #556070; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.chip { display: inline-flex; align-items: center; padding: 0.5cqw 2cqw; border-radius: 7px; font-style: normal; font-size: clamp(8.5px, 2.3cqw, 10.5px); font-weight: 500; white-space: nowrap; }
.chip.ok { background: #e1f5ea; color: #16a05a; }
.chip.wip { background: #fff0d3; color: #b7740b; }
.chips { display: flex; flex-wrap: wrap; gap: 1.2cqw; }
.chips span { padding: 0.8cqw 2cqw; border-radius: 7px; background: rgba(255, 255, 255, 0.8); font-size: clamp(8.5px, 2.3cqw, 10.5px); color: #475569; }
.rw { display: flex; align-items: center; gap: 2cqw; padding: 1cqw 0; }
.rw small { flex: none; min-width: 15cqw; }
.rw u { flex: 1; }
.rw b { font-size: clamp(9.5px, 2.6cqw, 11.5px); }
.av { flex: none; display: grid; place-items: center; width: 6cqw; min-width: 20px; aspect-ratio: 1; border-radius: 50%; background: linear-gradient(145deg, #2a4263, #14243a); color: #fff; font-size: clamp(6.5px, 1.9cqw, 8.5px); font-weight: 600; letter-spacing: 0.02em; }
.li { display: flex; align-items: center; gap: 2cqw; padding: 1cqw 0; font-size: clamp(9.5px, 2.6cqw, 11.5px); font-weight: 500; }
.li i { flex: none; width: 2cqw; min-width: 7px; aspect-ratio: 1; border-radius: 50%; }
.li u { flex: 1; margin-left: 1cqw; }
.li svg { flex: none; width: 3.4cqw; min-width: 12px; aspect-ratio: 1; fill: none; stroke: #16a05a; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.d1 { background: #ff6b16; } .d2 { background: #7c5cd6; } .d3 { background: #16a05a; }
.ic-t { flex: 1; min-width: 0; display: grid; gap: 0.4cqw; }
.ic-t b { font-size: clamp(10px, 2.8cqw, 12px); white-space: nowrap; }
.tm { font-variant-numeric: tabular-nums; }

/* window mockups */
.win {
  overflow: hidden;
  border-radius: clamp(10px, 3cqw, 16px);
  background: #fff;
  box-shadow: 0 24px 46px -26px rgba(20, 36, 58, 0.5);
}
.win-bar { display: flex; align-items: center; gap: 1.2cqw; padding: 2.4cqw 3cqw; background: #f3f4f7; }
.win-bar i { width: 1.8cqw; min-width: 6px; aspect-ratio: 1; border-radius: 50%; background: #d5d9e1; }
.url { flex: 1; margin-left: 2cqw; padding: 0.7cqw 2.4cqw; border-radius: 6px; background: #fff; font-size: clamp(8px, 2.2cqw, 10px); color: #8a93a1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.win-body { padding: 3.4cqw; }
.f-title { display: block; margin-bottom: 2cqw; font-family: Urbanist, sans-serif; font-size: clamp(11px, 3.4cqw, 15px); letter-spacing: -0.02em; }
.field { margin-bottom: 2cqw; }
.field small { display: block; margin-bottom: 0.6cqw; }
.field u { border: 1px solid #e3e6ec; background: #fff; height: 4.4cqw; min-height: 14px; border-radius: 6px; }
.field u.tall { height: 8cqw; }
.btn-navy { display: inline-block; margin-top: 1cqw; padding: 1.6cqw 3.6cqw; border-radius: 7px; background: var(--navy); font-size: clamp(8.5px, 2.4cqw, 10.5px); font-weight: 500; color: #fff; }

/* brand marks (stand-ins) */
.mk {
  display: grid;
  place-items: center;
  width: 10.5cqw;
  min-width: 34px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 10px 22px -10px rgba(20, 36, 58, 0.45);
  font-weight: 700;
}
.mk.s { width: 8cqw; min-width: 26px; box-shadow: none; flex: none; position: static; }
.mk-wp { font-family: Georgia, serif; font-size: clamp(15px, 5cqw, 22px); color: #21759b; }
.mk-fb { font-family: Arial, sans-serif; font-size: clamp(17px, 6cqw, 26px); color: #fff; background: #1877f2; }
.mk-wa { background: #25d366; color: #fff; }
.mk-wa svg { width: 58%; height: 58%; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; }
.mk-cx { font-family: Poppins, sans-serif; font-size: clamp(9px, 2.8cqw, 12px); letter-spacing: -0.3px; color: #14243a; }
.mk-vo { font-family: Urbanist, sans-serif; font-size: clamp(15px, 5cqw, 22px); color: #6d4fc2; }
.mk-gc { border-radius: 22%; background: #fff; border-top: 0.9cqw solid #4285f4; }
.mk-gc b { font-family: Poppins, sans-serif; font-size: clamp(10px, 3.4cqw, 15px); color: #4285f4; }

/* brand logos */
.brand { display: block; width: 11cqw; min-width: 38px; aspect-ratio: 1; border-radius: 24%; filter: drop-shadow(0 12px 18px rgba(20, 36, 58, 0.3)); }
.brand.s { position: static; width: 8.4cqw; min-width: 28px; flex: none; filter: drop-shadow(0 4px 6px rgba(20, 36, 58, 0.2)); }
.brand :deep(svg), .mini :deep(svg), .n0 :deep(svg) { display: block; width: 100%; height: 100%; }
.mini { display: block; flex: none; width: 5.6cqw; min-width: 20px; aspect-ratio: 1; border-radius: 24%; }
.tx { display: block; font-size: clamp(8.5px, 2.4cqw, 10.5px); line-height: 1.35; color: #334155; }
.tx.ph { color: #9aa3b0; }
.when { margin-left: auto; font-size: clamp(8.5px, 2.3cqw, 10.5px); color: #6b7280; }
.glass small { display: block; }
.glass .rw small { color: #475569; }
.g-wa-b1 b { font-size: clamp(9.5px, 2.6cqw, 11.5px); }
.g-wa-b1 small { margin-top: 0.6cqw; }
.g-cx-call small, .g-cal-note small { color: #6b7280; }
/* floating animation */
.float { animation: isc-float 6s ease-in-out infinite; animation-delay: var(--d, 0s); }
@keyframes isc-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.6cqw); } }

/* phones */
.phone {
  padding: 1cqw;
  border-radius: 8cqw 8cqw 0 0;
  background: #111317;
  box-shadow: 0 30px 50px -26px rgba(20, 36, 58, 0.6);
}
.ph-screen { height: 100%; overflow: hidden; padding: 3.4cqw 3cqw; border-radius: 7cqw 7cqw 0 0; background: #fff; }
.fb-top { display: flex; align-items: center; gap: 2cqw; margin-bottom: 3cqw; }
.fb-top b { display: block; font-size: clamp(8.5px, 2.4cqw, 10.5px); line-height: 1.2; }
.fb-top small { display: block; font-size: clamp(7.5px, 2cqw, 9px); }
.fbc { display: grid; place-items: center; flex: none; width: 6cqw; min-width: 20px; aspect-ratio: 1; border-radius: 50%; background: #1877f2; font-style: normal; font-weight: 700; font-family: Arial, sans-serif; font-size: clamp(10px, 3.4cqw, 14px); color: #fff; }
.btn-fb { display: block; margin-top: 2cqw; padding: 1.8cqw 0; border-radius: 6px; background: #1877f2; text-align: center; font-size: clamp(8.5px, 2.4cqw, 10.5px); font-weight: 600; color: #fff; }

/* 01 WordPress */
.w-wp { left: 8%; top: 9%; width: 66%; }
.g-wp-note { left: 26%; top: 67%; width: 68%; }
.g-wp-side { right: 4%; top: 30%; width: 40%; }

/* 02 Facebook */
.photo { inset: 0; background: linear-gradient(160deg, #f0c9b8, #e6ad98); }
.photo img { width: 100%; height: 100%; object-fit: cover; object-position: 60% 25%; opacity: 0.92; }
.photo::after { content: ''; position: absolute; inset: 0; background: rgba(235, 211, 200, 0.28); }
.ph-fb { left: 7%; top: 12%; width: 40%; height: 76%; border-radius: 8cqw; }
.ph-fb .ph-screen { border-radius: 7cqw; }
.g-fb-lead { right: 4%; top: 24%; width: 46%; }
.g-fb-lead .rw small { min-width: 0; }
.g-fb-lead .rw b { white-space: nowrap; }
.g-fb-sent { right: 4%; top: 60%; width: 46%; display: flex; align-items: center; gap: 2cqw; font-weight: 500; line-height: 1.35; }
/* Facebook card: real photo under a Facebook-blue wash, white panels on top */
.k-facebook .photo { background: linear-gradient(170deg, #2a7ef0 0%, #0f4aa8 100%); }
.k-facebook .photo img { opacity: 1; object-position: 50% 30%; }
.k-facebook .blob { display: none; }
.k-facebook .glass { background: rgba(255, 255, 255, 0.93); border-color: rgba(255, 255, 255, 0.9); }
.k-facebook .mk-fb { background: #fff; color: #1877f2; box-shadow: 0 12px 24px -10px rgba(5, 30, 80, 0.55); }
.ph-fb .ph-screen { padding: 4cqw 3.6cqw; }
.ph-fb .field { margin-bottom: 3.4cqw; }
.ph-fb .field u { height: 6.4cqw; }
.ph-fb .btn-fb { margin-top: 4cqw; padding: 2.6cqw 0; }
.dot { width: 2.2cqw; min-width: 8px; aspect-ratio: 1; border-radius: 50%; background: #25d366; }
.meter { flex: 1; height: 1.8cqw; min-height: 6px; border-radius: 6px; background: rgba(20, 36, 58, 0.1); overflow: hidden; }
.meter i { display: block; width: 78%; height: 100%; border-radius: 6px; background: var(--orange); transform-origin: left; animation: isc-meter 4s ease-in-out infinite alternate; }
@keyframes isc-meter { from { transform: scaleX(0.55); } to { transform: scaleX(1); } }

/* 03 WhatsApp */
.ph-wa { left: 9%; top: 10%; width: 52%; height: 100%; }
.ph-screen.wa { background: #efeae2; padding: 0; }
.wa-top { display: flex; align-items: center; gap: 2cqw; padding: 3cqw; background: #1f8f5f; color: #fff; }
.wa-top b { display: block; font-size: clamp(8.5px, 2.5cqw, 11px); line-height: 1.2; }
.wa-top small { color: rgba(255, 255, 255, 0.8); }
.wa .bub { margin: 2cqw 3cqw 0; padding: 2cqw 2.4cqw; width: 66%; border-radius: 10px; background: #fff; }
.wa .bub.out { margin-left: auto; background: #d9f3dd; }
.wa .bub.media { display: flex; align-items: center; gap: 2cqw; width: 56%; }
.wa .bub u { background: #e6e8ee; }
.wa .bub.out u { background: #bfe3c7; }
.thumb { flex: none; display: grid; place-items: center; width: 8cqw; aspect-ratio: 1; border-radius: 6px; background: #e8564a; color: #fff; font-size: clamp(6px, 1.7cqw, 8px); font-weight: 700; }
.tag { display: inline-block; margin-bottom: 1.2cqw; padding: 0.4cqw 1.8cqw; border-radius: 5px; background: #fff; font-size: clamp(7.5px, 2cqw, 9px); color: #16a05a; }
.wa-in { margin: 3cqw; padding: 1.6cqw 2.4cqw; border-radius: 999px; background: #fff; }
.g-wa-b1 { right: 5%; top: 22%; width: 36%; border-radius: 16px 16px 16px 4px; }
.g-wa-crm { right: 4%; top: 50%; width: 50%; }

/* 04 3CX */
.deskphone { left: 14%; top: 38%; width: 72%; height: 70%; padding: 3.4cqw; border-radius: 5cqw 5cqw 0 0; background: #14243a; box-shadow: 0 30px 50px -26px rgba(20, 36, 58, 0.7); }
.dp-screen { padding: 2.4cqw 3cqw; border-radius: 8px; background: #263e5f; color: #cfe0f5; }
.dp-screen small { color: #8fa9c8; display: block; }
.dp-screen b { font-size: clamp(10px, 3cqw, 13px); }
.dp-keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2cqw; margin-top: 3cqw; padding: 0 12%; }
.dp-keys i { aspect-ratio: 2.2; border-radius: 6px; background: #31496c; }
.g-cx-call { left: 7%; top: 8%; width: 70%; display: flex; align-items: center; gap: 2.4cqw; }
.rb { display: grid; place-items: center; flex: none; width: 6.4cqw; min-width: 22px; aspect-ratio: 1; border-radius: 50%; color: #fff; }
.rb svg { width: 52%; height: 52%; fill: none; stroke: currentColor; stroke-width: 2; stroke-linejoin: round; }
.rb.ok { background: #16a05a; }
.rb.no { background: #e0483a; }
.rb.no svg { transform: rotate(135deg); }
.g-cx-rec { right: 5%; top: 40%; width: 58%; }
.mk-cx { background: rgba(255, 255, 255, 0.92); }

/* 05 Vodia */
.ph-vo { inset: auto; left: 8%; top: 8%; width: 84%; height: 48%; border-radius: clamp(12px, 3.6cqw, 18px); overflow: hidden; background: linear-gradient(160deg, #c5c0e6, #a9a4d6); }
.g-vo-ai { left: 14%; top: 36%; width: 72%; display: flex; align-items: center; gap: 2.6cqw; }
.wave { display: flex; align-items: center; gap: 0.7cqw; height: 6cqw; }
.wave i { width: 0.9cqw; min-width: 2px; height: 100%; border-radius: 2px; background: var(--navy); transform-origin: center; animation: isc-wave 1.1s ease-in-out infinite; animation-delay: calc(var(--n) * 0.09s); }
@keyframes isc-wave { 0%, 100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }
.ic-t small { color: #6b7280; }
.g-vo-act { left: 8%; top: 56%; width: 68%; }
.li.back { margin-top: 1cqw; padding-top: 2cqw; border-top: 1px solid rgba(20, 36, 58, 0.1); color: #16a05a; }

/* 06 Google Calendar */
.w-cal { left: 8%; top: 9%; width: 62%; padding: 3.4cqw; }
.cal-h { display: flex; justify-content: space-between; margin-bottom: 2cqw; font-size: clamp(9.5px, 2.8cqw, 12px); }
.cal-days, .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.8cqw; }
.cal-days small { text-align: center; }
.cal-grid { margin-top: 1.2cqw; }
.cal-grid i { position: relative; display: grid; place-items: center; aspect-ratio: 1; border-radius: 50%; background: #f4f6fa; font-style: normal; font-size: clamp(7px, 2cqw, 9.5px); color: #475569; }
.cal-grid i.off { background: transparent; }
.cal-grid i.e1::after, .cal-grid i.e2::after, .cal-grid i.e3::after { content: ''; position: absolute; bottom: 9%; width: 20%; aspect-ratio: 1; border-radius: 50%; }
.cal-grid i.e1::after { background: #4285f4; }
.cal-grid i.e2::after { background: #f5a193; }
.cal-grid i.e3::after { background: #16a05a; }
.cal-grid i.today { background: #14243a; color: #fff; font-weight: 600; }
.g-cal-note { right: 4%; top: 34%; width: 54%; display: flex; align-items: center; gap: 2.4cqw; }
.g-cal-task { left: 10%; top: 64%; width: 72%; }
.g-cal-task .li { gap: 2cqw; }

/* 07 REST API */
.code { left: 8%; top: 8%; width: 70%; overflow: hidden; border-radius: clamp(10px, 3cqw, 16px); background: #1f2328; box-shadow: 0 24px 46px -26px rgba(0, 0, 0, 0.6); }
.code-bar { display: flex; align-items: center; gap: 1.2cqw; padding: 2.4cqw 3cqw; background: #2a2f36; }
.code-bar i { width: 1.8cqw; min-width: 6px; aspect-ratio: 1; border-radius: 50%; background: #4a515b; }
.code-bar span { margin-left: 2cqw; font-size: clamp(8px, 2.2cqw, 10px); color: #8b95a3; }
.code pre { margin: 0; padding: 3cqw 3.4cqw 3.6cqw; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: clamp(8.5px, 2.35cqw, 11px); line-height: 1.75; color: #d6dae0; white-space: pre; overflow: hidden; }
.code .k { color: #c4a7ff; } .code .c { color: #8fb8e8; } .code .s { color: #e6b673; } .code .ok { color: #6fd3a1; }
.wires { left: 4%; top: 52%; width: 92%; height: 36%; overflow: visible; }
.wires path { fill: none; stroke: rgba(20, 36, 58, 0.35); stroke-width: 1.4; stroke-dasharray: 3 3; vector-effect: non-scaling-stroke; animation: isc-dash 2.4s linear infinite; }
@keyframes isc-dash { to { stroke-dashoffset: -12; } }
.node { padding: 1.4cqw 3cqw; border-radius: 999px; background: rgba(255, 255, 255, 0.85); box-shadow: 0 10px 20px -12px rgba(20, 36, 58, 0.45); font-size: clamp(8.5px, 2.5cqw, 11px); font-weight: 500; white-space: nowrap; }
.n0 { left: 50%; top: 70%; transform: translate(-50%, -50%); display: block; width: 16cqw; aspect-ratio: 1; padding: 0; border-radius: 26%; background: transparent; box-shadow: 0 14px 24px -10px rgba(20, 36, 58, 0.55); }
.n0.float { animation: none; }
.n1 { left: 3%; top: 56%; } .n2 { left: 3%; top: 84%; } .n3 { right: 3%; top: 56%; } .n4 { right: 3%; top: 84%; }
.g-api { right: 4%; top: 26%; width: 48%; }
.act { display: flex; align-items: flex-end; gap: 1cqw; height: 6cqw; margin-top: 1.6cqw; }
.act i { flex: 1; height: 100%; border-radius: 3px; background: rgba(20, 36, 58, 0.25); transform-origin: bottom; animation: isc-act 2.2s ease-in-out infinite; animation-delay: calc(var(--n) * 0.12s); }
@keyframes isc-act { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }

/* ---------- copy ---------- */
.txt { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 5.6cqw 6.4cqw 7cqw; }
.t-h {
  margin: 0 !important;
  font-family: Urbanist, 'Urbanist Placeholder', sans-serif !important;
  font-size: clamp(17px, 3.1cqw, 26px) !important;
  white-space: nowrap;
  font-weight: 600 !important;
  line-height: 1.1 !important;
  letter-spacing: -0.04em !important;
  color: var(--navy) !important;
}
.t-p { margin: 3cqw 0 0; font-size: clamp(13px, 3.8cqw, 14.5px); line-height: 1.65; color: #4b586a; }
.t-ul { margin: 4cqw 0 0; padding: 0; list-style: none; display: grid; gap: 2.2cqw; }
.t-ul li { display: flex; align-items: flex-start; gap: 2.6cqw; font-size: clamp(12.5px, 3.6cqw, 14px); font-weight: 500; line-height: 1.5; color: var(--navy); }
.t-ul i { flex: none; display: grid; place-items: center; width: 22px; aspect-ratio: 1; margin-top: 1px; border-radius: 50%; background: var(--navy); }
.t-ul svg { width: 60%; height: 60%; fill: none; stroke: #fff; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.t-cta { display: inline-block; margin-top: 4.4cqw; font-size: clamp(13px, 3.7cqw, 14.5px); font-weight: 600; color: var(--navy); text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 5px; transition: text-underline-offset 0.3s var(--ease), color 0.3s; }
.t-cta:hover { color: var(--orange); text-underline-offset: 8px; }
.t-cta:focus-visible { outline: 2px solid var(--navy); outline-offset: 4px; border-radius: 3px; }

/* ---------- entrance ---------- */
.isc-arm .isc-card { opacity: 0; transform: translateY(34px); }
.isc-arm.isc-in .isc-card {
  opacity: 1;
  transform: none;
  transition: opacity 0.9s ease, transform 1s var(--ease), box-shadow 0.5s var(--ease);
  transition-delay: calc(var(--i) * 0.08s);
}
.isc-arm.isc-in .isc-card:hover { transform: translateY(-6px); transition-delay: 0s; }
.isc-arm .isc-arrows { opacity: 0; transform: translateY(-8px); }
.isc-arm.isc-in .isc-arrows { opacity: 1; transform: none; transition: opacity 0.8s ease 0.3s, transform 0.9s var(--ease) 0.3s; }
.isc-arm .isc-nav { opacity: 0; transform: translateY(12px); }
.isc-arm.isc-in .isc-nav { opacity: 1; transform: none; transition: opacity 0.8s ease 0.5s, transform 0.9s var(--ease) 0.5s; }

/* ---------- responsive: two cards on desktop + tablet, one card on phones ---------- */
@container (max-width: 720px) {
  .isc-track { --show: 1; }
  .isc-arrows .isc-ar { width: 40px; height: 40px; }
  .isc-dots { height: 40px; padding: 0; gap: 7px; }
}
@media (prefers-reduced-motion: reduce) {
  .isc *, .isc *::before, .isc *::after { animation: none !important; transition: none !important; }
  .isc-arm .isc-card, .isc-arm .isc-nav, .isc-arm .isc-arrows { opacity: 1; transform: none; }
}
</style>  