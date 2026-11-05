<template>
  <section id="features" ref="rootEl" class="fx" :class="{ 'fx-in': revealed }" aria-labelledby="fx-title">
    <div class="fx-wrap">
      <header class="fx-head">
        <h2 id="fx-title" class="fx-title">
          Everything you need to
          <span>grow &amp; scale.</span>
        </h2>
      </header>

      <div class="fx-grid">
        <!-- ============ left: stays in view while you scroll ============ -->
        <aside class="fx-aside">
          <div class="fx-aside-in">
            <div class="fx-copy-box">
              <Transition name="fx-swap" mode="out-in">
                <div :key="cur.id" class="fx-copy">
                  <h3>{{ cur.title }}</h3>
                  <p>{{ cur.description }}</p>
                  <a class="fx-btn" href="#">
                    Explore {{ cur.tab }}
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" /></svg>
                  </a>
                </div>
              </Transition>
            </div>

            <ul class="fx-list" aria-label="Product features">
              <li v-for="(f, i) in features" :key="f.id">
                <button type="button" :class="{ on: active === i }" :aria-current="active === i ? 'true' : undefined" @click="goTo(i)">
                  {{ f.tab }}
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- ============ right: one card per feature ============ -->
        <div class="fx-cards">
          <article v-for="(f, i) in features" :key="f.id" :ref="(el) => (items[i] = el)" class="fx-item">
            <!-- phones: the text sits above each card instead of pinned on the left -->
            <div class="fx-mcopy">
              <h3>{{ f.title }}</h3>
              <p>{{ f.description }}</p>
              <a class="fx-btn" href="#">
                Explore {{ f.tab }}
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" /></svg>
              </a>
            </div>

            <div class="fx-card" :style="{ background: f.bg }" aria-hidden="true">
              <span class="fx-blob b1" :style="{ background: f.glow[0] }"></span>
              <span class="fx-blob b2" :style="{ background: f.glow[1] }"></span>

              <div class="fx-win">
                <!-- 1 · Leads -->
                <template v-if="f.id === 'leads'">
                  <div class="w-bar"><b>Lead inbox</b><span class="w-chip">All sources</span><span class="w-avs"><i>AS</i><i>NP</i><i>RK</i></span></div>
                  <div class="w-body">
                    <div class="w-pills"><i v-for="(p, n) in leadPills" :key="p" :class="{ on: n === 0 }">{{ p }}</i></div>
                    <div v-for="(r, n) in leadRows" :key="r[1]" class="w-row w-lead" :class="{ fresh: n === 0 }">
                      <i class="w-av">{{ r[0] }}</i>
                      <span class="w-nm"><b>{{ r[1] }}</b><small>{{ r[2] }}</small></span>
                      <i class="w-src" :class="r[3]">{{ r[3] }}</i>
                      <span class="w-sc"><b>{{ r[4] }}</b><i><u :style="{ width: r[4] + '%' }"></u></i></span>
                    </div>
                  </div>
                </template>

                <!-- 2 · Pipeline -->
                <template v-else-if="f.id === 'pipeline'">
                  <div class="w-bar"><b>Sales pipeline</b><span class="w-rev">Weighted forecast $86,900 <em>live</em></span></div>
                  <div class="w-body">
                    <div class="w-kan">
                      <div v-for="col in kanban" :key="col.t" class="w-col">
                        <div class="w-ch"><i :style="{ background: col.c }"></i>{{ col.t }}</div>
                        <div v-for="d in col.cards" :key="d[0]" class="w-dl">
                          <b>{{ d[0] }}</b><small>{{ d[1] }}</small>
                          <div class="w-ft"><span class="w-pr" :class="d[3]">{{ d[3] }}</span><strong>{{ d[2] }}</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 3 · Quotations -->
                <template v-else-if="f.id === 'quotes'">
                  <div class="w-bar"><b>New quotation</b><span class="w-chip">Preview PDF</span><span class="w-avs"><i>AS</i></span></div>
                  <div class="w-body">
                    <div class="w-bill"><small>BILL TO</small><b>Apex Motors Ltd</b><span>amal@apexmotors.lk</span></div>
                    <div class="w-doc">
                      <div class="w-dh"><span class="w-nm"><b>Line items</b><small>8% VAT · 5% discount · multicurrency</small></span><span class="w-stt">APPROVED</span></div>
                      <div v-for="l in lines" :key="l[0]" class="w-ln"><span>{{ l[0] }}</span><span>{{ l[1] }}</span><b>{{ l[2] }}</b></div>
                      <div class="w-tot"><span>Total</span><b>$7,420.00</b></div>
                      <div class="w-acts"><span class="w-btn o">Convert to invoice →</span><span class="w-btn">Send on WhatsApp</span></div>
                      <div class="w-flow"><span v-for="s in ['Sent', 'Viewed', 'Approved']" :key="s"><i>✓</i>{{ s }}</span></div>
                    </div>
                  </div>
                </template>

                <!-- 4 · WhatsApp -->
                <template v-else-if="f.id === 'whatsapp'">
                  <div class="w-bar"><b>WhatsApp inbox</b><span class="w-chip">All agents</span><span class="w-avs"><i>AS</i><i>NP</i><i>RK</i></span></div>
                  <div class="w-body">
                    <div class="w-chat-head"><i class="w-av dk">NR</i><span class="w-nm"><b>Nuwan Rathnayake</b><small>+94 77 412 8890 · Official WhatsApp API</small></span><span class="w-asg">Assigned · Amal S.</span></div>
                    <div class="w-msgs">
                      <div v-for="m in msgs" :key="m[1]" class="w-msg" :class="m[0]"><span>{{ m[1] }}</span><small v-if="m[2]">{{ m[2] }}</small></div>
                    </div>
                    <div class="w-tools"><span>/ Saved replies</span><span>Templates</span><span>Assign ▾</span></div>
                  </div>
                </template>

                <!-- 5 · Calls -->
                <template v-else-if="f.id === 'calls'">
                  <div class="w-bar"><b>Call journal</b><span class="w-chip">Today</span><span class="w-avs"><i>1001</i></span></div>
                  <div class="w-body">
                    <div class="w-pills"><i class="on">All</i><i>Missed</i><i>Answered</i><i>Outbound</i><i>Vodia AI</i></div>
                    <div v-for="(c, n) in calls" :key="c[1]" class="w-row w-call" :class="{ fresh: n === 0 }">
                      <i class="w-av dk">{{ c[0] }}</i>
                      <span class="w-nm"><b>{{ c[1] }}</b><small>{{ c[2] }}</small></span>
                      <i class="w-cp" :class="c[3]">{{ c[3] }}</i>
                      <span class="w-mu">{{ c[4] }}</span>
                    </div>
                    <div class="w-pop">
                      <small class="w-cap">INCOMING · EXT 1001</small>
                      <div class="w-who"><i class="w-av">DP</i><span class="w-nm"><b>Daniel Perera</b><small>Matched in &lt;1 s</small></span></div>
                      <div class="w-hist"><span>Last quote <b>QT-2031</b></span><span>Open tasks <b>2</b></span></div>
                    </div>
                  </div>
                </template>

                <!-- 6 · Service & AMC -->
                <template v-else>
                  <div class="w-bar"><b>Service &amp; AMC</b><span class="w-chip">This month</span><span class="w-avs"><i>NP</i><i>RK</i><i>TM</i></span></div>
                  <div class="w-body">
                    <div class="w-tiles">
                      <div v-for="t in amTiles" :key="t[0]" class="w-tile"><small>{{ t[0] }}</small><b>{{ t[1] }}</b><em :class="t[3]">{{ t[2] }}</em></div>
                    </div>
                    <div v-for="r in amRows" :key="r[0]" class="w-row w-am">
                      <span class="w-nm"><b>{{ r[0] }}</b><small>{{ r[1] }}</small></span>
                      <span class="w-nm"><b>{{ r[2] }}</b><small>{{ r[3] }}</small></span>
                      <i class="w-st" :class="r[4]">{{ r[5] }}</i>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'FeatureScroll' })
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/* Same six features as your tabbed section.
   `bg` is the colour behind each card and `glow` the two soft blobs on it.
   To use a photo instead, set  bg: "center / cover url('https://…')"  */
const features = [
  {
    id: 'leads',
    tab: 'Leads & Contacts',
    title: 'Lead and contact management',
    description:
      'Enquiries from your website, Facebook Lead Ads and WhatsApp arrive in Saptivo automatically, tagged with their source. Duplicates are merged, leads are scored and each one is assigned to the right salesperson within seconds.',
    bg: 'linear-gradient(145deg, #ffe3d0, #ffb98a 60%, #ff9456)',
    glow: ['#fff3ea', '#f2540c'],
  },
  {
    id: 'pipeline',
    tab: 'Sales Pipeline',
    title: 'Sales pipeline',
    description:
      'Drag deals across stages you define, set follow-up reminders and see weighted revenue forecasts in real time. Overdue deals are flagged before they go cold.',
    bg: 'linear-gradient(180deg, #2a8fb0 0%, #7ea4b8 38%, #e3a894 66%, #ff9a52 100%)',
    glow: ['#1b7fa6', '#ff7a12'],
  },
  {
    id: 'quotes',
    tab: 'Quotes & Invoicing',
    title: 'Quotations and invoicing',
    description:
      'Create branded PDF quotations from your product catalog in seconds, send them on WhatsApp or email, and convert approved quotes into tax invoices in one click. VAT, discounts and multicurrency are built in.',
    bg: 'linear-gradient(145deg, #ff8a2a, #f2540c 70%, #d9420a)',
    glow: ['#ffb36b', '#9a2f06'],
  },
  {
    id: 'whatsapp',
    tab: 'WhatsApp CRM',
    title: 'WhatsApp CRM',
    description:
      "Give your whole team one shared WhatsApp Business inbox on the official API. Assign chats, use saved replies and approved templates, and keep every conversation on the customer's timeline.",
    bg: 'linear-gradient(160deg, #ffe9da, #ffc9a3 55%, #8fb9d6)',
    glow: ['#ffffff', '#3e86b5'],
  },
  {
    id: 'calls',
    tab: '3CX & Vodia Calls',
    title: '3CX and Vodia call integration',
    description:
      "See who is calling before you answer. Saptivo connects to your 3CX or Vodia phone system, pops up the caller's profile and logs every inbound, outbound and missed call automatically. With Vodia, AI voice agents can also make reminder and follow-up calls using your CRM data.",
    bg: 'linear-gradient(135deg, #f5821f 0%, #c9531c 38%, #1d5a8a 78%, #0f3358 100%)',
    glow: ['#ffa24d', '#2f7fc0'],
  },
  {
    id: 'service',
    tab: 'Service & AMC',
    title: 'Service and AMC management',
    description:
      'For businesses that install and maintain equipment, Saptivo manages annual maintenance contracts, preventive service schedules, technician dispatch, spare parts and warranty billing.',
    bg: 'linear-gradient(180deg, #1e8cab 0%, #8f9fb3 34%, #e0a595 62%, #ffa670 82%, #ff8f1f 100%)',
    glow: ['#2fb6ec', '#ff7a12'],
  },
]

/* demo data for the artwork inside the cards */
const leadPills = ['All 48', 'Website 21', 'Facebook 14', 'WhatsApp 13']
const leadRows = [
  ['NR', 'Nuwan Rathnayake', 'Website form · 12 s ago', 'Website', 92],
  ['FR', 'Fathima Rizwan', 'Facebook Lead Ad · 1 min ago', 'Facebook', 84],
  ['PG', 'Pradeep Gunasekara', 'WhatsApp · 3 min ago', 'WhatsApp', 76],
  ['SD', 'Sachini Dias', 'Website form · 6 min ago', 'Website', 58],
  ['KP', 'Kasun Perera', 'WhatsApp · 9 min ago', 'WhatsApp', 51],
  ['TM', 'Thilina Mendis', 'Facebook Lead Ad · 12 min ago', 'Facebook', 47],
]
const kanban = [
  { t: 'Leads', c: '#94a3b8', cards: [['Lanka Traders', 'Inquiry via website', '$6,400', 'Medium'], ['Blue Wave Hotel', 'Facebook lead ad', '$12,900', 'High'], ['Ceylon Auto', 'WhatsApp inquiry', '$3,200', 'Low']] },
  { t: 'Quoted', c: '#f59e0b', cards: [['Metro Pharmacy', 'QT-2051 · viewed', '$8,750', 'High'], ['Green Leaf Café', 'Follow-up overdue', '$2,980', 'Overdue'], ['Pearl Retail', 'QT-2047 · viewed', '$5,300', 'Medium']] },
  { t: 'Approved', c: '#f2540c', cards: [['Apex Motors', 'QT-2048 · approved', '$7,420', 'High'], ['Sunrise Mart', 'QT-2044 · approved', '$4,100', 'Medium'], ['Silver Coast', 'QT-2042 · approved', '$6,050', 'Low']] },
]
const lines = [
  ['Premium service plan', '×1', '$4,200'],
  ['POS terminal bundle', '×2', '$2,600'],
  ['Onboarding & training', '×1', '$620'],
]
const msgs = [
  ['in', 'Hi! Do you have the POS bundle in stock?', '10:42'],
  ['out', 'Hi Nuwan, yes. Sending your quotation now.', '10:43 ✓✓'],
  ['tpl', 'Quotation QT-2048 is ready to view and approve', 'Delivered ✓✓'],
  ['note', "✓ Saved to Nuwan's customer timeline", ''],
]
const calls = [
  ['DP', 'Daniel Perera', '755 322 689', 'Missed', '0:56'],
  ['KP', 'Kasun Perera', '770 629 341', 'Answered', '1:40'],
  ['AI', 'Reminder call', 'Vodia AI voice agent', 'Vodia', '1:12'],
]
const amTiles = [
  ['Active AMC contracts', '126', '▲ 8 this month', 'up'],
  ['Services due this week', '18', '4 dispatched', 'up'],
  ['Spare parts low', '5', 'Reorder', 'mu'],
  ['Warranty claims', '7', 'Billing ready', 'up'],
]
const amRows = [
  ['Apex Motors', 'Lift L-204 · AMC-0192', 'Preventive service', 'Next visit · 02 Nov', 'sch', 'Scheduled'],
  ['Metro Pharmacy', 'Cold room CR-12', 'Compressor replacement', 'Spare part issued', 'prog', 'On site'],
  ['Blue Wave Hotel', 'Generator G-3', 'Warranty repair', 'Warranty billing ready', 'war', 'Warranty'],
  ['Island Books', 'Printer fleet · AMC-0175', 'Quarterly service', 'Overdue · 2 days', 'ovr', 'Overdue'],
]

/* ---------- scroll logic ---------- */
const rootEl = ref(null)
const active = ref(0)
const revealed = ref(false)
const cur = computed(() => features[active.value])

const items = [] // the six <article> elements
let cards = [] // their .fx-card children
let raf = 0
let io = null
let rootIo = null

/* the card closest to the middle of the screen is the active one;
   --p (-1 … 1) is how far a card is from the middle, used for a gentle parallax */
function update() {
  raf = 0
  const vh = window.innerHeight
  const mid = vh * 0.5
  let best = 0
  let bestD = Infinity
  cards.forEach((el, i) => {
    if (!el) return
    const r = el.getBoundingClientRect()
    const c = r.top + r.height / 2
    const d = Math.abs(c - mid)
    if (d < bestD) {
      bestD = d
      best = i
    }
    el.style.setProperty('--p', Math.max(-1, Math.min(1, (c - mid) / vh)).toFixed(3))
  })
  if (best !== active.value) active.value = best
}
function queue() {
  if (!raf) raf = requestAnimationFrame(update)
}
function goTo(i) {
  cards[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

onMounted(() => {
  cards = items.map((el) => el?.querySelector('.fx-card'))
  update()
  window.addEventListener('scroll', queue, { passive: true })
  window.addEventListener('resize', queue)

  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in')
          io.unobserve(en.target)
        }
      }),
    { threshold: 0.12 },
  )
  items.forEach((el) => el && io.observe(el))

  rootIo = new IntersectionObserver(([en]) => en.isIntersecting && (revealed.value = true), { threshold: 0.1 })
  rootIo.observe(rootEl.value)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', queue)
  window.removeEventListener('resize', queue)
  io?.disconnect()
  rootIo?.disconnect()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Urbanist:wght@500;600&display=swap');

/* NOTE: no `overflow: hidden` on .fx or its parents, it would stop the left column from staying pinned. */
.fx {
  --o: #f2540c;
  --og: linear-gradient(145deg, #ff7a1a, #f2540c);
  --o-soft: #fff1e8;
  --navy: #0f172a;
  --ink: #475569;
  --mute: #94a3b8;
  --line: #f1ece8;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  width: calc(100% - 2 * clamp(8px, 1.6vw, 24px));
  max-width: 1680px;
  margin: clamp(32px, 5vw, 64px) auto;
  padding: clamp(36px, 5vw, 72px) clamp(16px, 4vw, 64px) clamp(48px, 6vw, 88px);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: clamp(22px, 2.6vw, 36px);
  background: #fff;
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--navy);
}
.fx,
.fx *,
.fx *::before,
.fx *::after {
  box-sizing: border-box;
}
.fx svg {
  display: block;
}
.fx-wrap {
  max-width: 1120px;
  margin: 0 auto;
}

/* ---------- heading ---------- */
.fx-head {
  text-align: center;
  margin-bottom: clamp(36px, 6vw, 80px);
}
.fx-title {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 0.1em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(32px, 4.2vw, 62px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.05em;
  color: var(--navy);
}
.fx-title span {
  display: block;
  width: fit-content;
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.fx-head,
.fx-aside {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.7s ease, transform 0.8s var(--ease);
}
.fx-in .fx-head,
.fx-in .fx-aside {
  opacity: 1;
  transform: none;
}
.fx-in .fx-aside {
  transition-delay: 0.12s;
}

/* ---------- two columns ---------- */
.fx-grid {
  display: grid;
  grid-template-columns: minmax(300px, 480px) minmax(0, 560px);
  justify-content: center;
  gap: clamp(32px, 4.5vw, 64px);
  align-items: start;
}

/* ---------- left: pinned text ---------- */
.fx-aside {
  position: sticky;
  top: clamp(24px, calc(50vh - 354px), 110px);
}
.fx-copy-box {
  min-height: 430px;
}
.fx-copy h3,
.fx-mcopy h3 {
  margin: 0 0 18px;
  font-family: Urbanist, 'Urbanist Placeholder', sans-serif;
  font-size: 50px;
  font-weight: 600;
  line-height: 65px;
  letter-spacing: -1px;
  color: #0a0a0a;
}
.fx-copy p,
.fx-mcopy p {
  margin: 0 0 26px;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: 15.5px;
  font-weight: 500;
  line-height: 1.65;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.fx-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 999px;
  background: var(--navy);
  color: #fff;
  font: 500 14px/1 'Poppins', system-ui, sans-serif;
  text-decoration: none;
  transition: background 0.3s, gap 0.3s, transform 0.3s;
}
.fx-btn svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.fx-btn:hover {
  background: var(--o);
  gap: 14px;
  transform: translateY(-2px);
}
.fx-btn:focus-visible {
  outline: 2px solid var(--o);
  outline-offset: 3px;
}

/* swap animation when the active feature changes */
.fx-swap-enter-active {
  transition: opacity 0.5s ease 0.05s, transform 0.65s var(--ease), filter 0.5s ease;
}
.fx-swap-leave-active {
  transition: opacity 0.22s ease, transform 0.3s ease, filter 0.25s ease;
}
.fx-swap-enter-from {
  opacity: 0;
  transform: translateY(16px);
  filter: blur(3px);
}
.fx-swap-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  filter: blur(4px);
}

/* feature list */
.fx-list {
  margin: 28px 0 0;
  padding: 22px 0 0;
  list-style: none;
  border-top: 1px solid var(--line);
  display: grid;
  gap: 2px;
}
.fx-list button {
  display: block;
  width: 100%;
  padding: 5px 0;
  border: 0;
  background: none;
  font-family: Urbanist, 'Urbanist Placeholder', sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: #b9b2ac;
  text-align: left;
  cursor: pointer;
  transition: color 0.3s, transform 0.3s var(--ease);
}
.fx-list button:hover {
  color: var(--ink);
}
.fx-list button.on {
  color: #0a0a0a;
  font-weight: 600;
  transform: translateX(6px);
}
.fx-list button:focus-visible {
  outline: 2px solid var(--o);
  outline-offset: 3px;
  border-radius: 6px;
}

/* ---------- right: cards ---------- */
.fx-item {
  padding-bottom: clamp(56px, 12vh, 120px);
}
.fx-item:last-child {
  padding-bottom: 130px; /* keeps the left text pinned while the last card is in view */
}
.fx-mcopy {
  display: none;
}
.fx-card {
  --p: 0;
  position: relative;
  height: 480px;
  border-radius: 36px;
  overflow: hidden;
  isolation: isolate;
  opacity: 0;
  transform: translateY(44px) scale(0.97);
  transition: opacity 0.8s ease, transform 1s var(--ease), box-shadow 0.4s;
}
.fx-item.in .fx-card {
  opacity: 1;
  transform: none;
}
.fx-blob {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  z-index: -1;
  transform: translateY(calc(var(--p) * 40px));
}
.fx-blob.b1 {
  top: -120px;
  left: -90px;
}
.fx-blob.b2 {
  right: -110px;
  bottom: -120px;
  opacity: 0.55;
  transform: translateY(calc(var(--p) * -40px));
}

/* the product window, cropped by the card edge like a screenshot */
.fx-win {
  position: absolute;
  left: 34px;
  right: 34px;
  top: 52px;
  bottom: -70px;
  border-radius: 18px 18px 0 0;
  background: #fff;
  box-shadow: 0 30px 60px -20px rgba(15, 23, 42, 0.38);
  overflow: hidden;
  transform: translateY(calc(var(--p) * -26px));
  will-change: transform;
}

/* ---------- artwork inside the window ---------- */
.fx .w-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  padding: 0 16px;
  border-bottom: 1px solid var(--line);
}
.fx .w-bar > b {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}
.fx .w-chip {
  padding: 5px 11px;
  border: 1px solid #ebe5e0;
  border-radius: 8px;
  font-size: 11px;
  color: var(--ink);
  white-space: nowrap;
}
.fx .w-avs {
  display: flex;
}
.fx .w-avs i {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  margin-left: -6px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: var(--navy);
  color: #fff;
  font: 600 8.5px/1 'Poppins', sans-serif;
  font-style: normal;
}
.fx .w-avs i:nth-child(2) { background: var(--og); }
.fx .w-avs i:nth-child(3) { background: #6366f1; }
.fx .w-rev {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.fx .w-rev em {
  margin-left: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #15803d;
  font-size: 10px;
  font-style: normal;
}
.fx .w-body {
  position: relative;
  padding: 14px 16px;
}
.fx .w-body small {
  font-size: 10.5px;
  color: var(--mute);
}
.fx .w-nm {
  display: grid;
  min-width: 0;
  line-height: 1.3;
}
.fx .w-nm b {
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fx .w-nm small {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fx .w-av {
  display: grid;
  place-items: center;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--og);
  color: #fff;
  font: 600 10.5px/1 'Poppins', sans-serif;
  font-style: normal;
}
.fx .w-av.dk {
  background: var(--navy);
  box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px var(--o);
}
.fx .w-pills {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}
.fx .w-pills i {
  padding: 5px 11px;
  border: 1px solid #ebe5e0;
  border-radius: 8px;
  font-size: 11px;
  font-style: normal;
  color: var(--ink);
  white-space: nowrap;
}
.fx .w-pills i.on {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}
.fx .w-row {
  display: grid;
  align-items: center;
  gap: 10px;
  height: 52px;
  border-top: 1px solid var(--line);
  font-size: 11.5px;
}
.fx .w-row.fresh {
  background: linear-gradient(90deg, #fff6f0, #fff);
}

/* leads */
.fx .w-lead {
  grid-template-columns: 32px 1.5fr 0.8fr 0.8fr;
}
.fx .w-src,
.fx .w-cp,
.fx .w-st {
  display: inline-block;
  justify-self: start;
  padding: 3px 9px;
  border-radius: 7px;
  font-size: 10.5px;
  font-style: normal;
  font-weight: 600;
  white-space: nowrap;
}
.fx .w-src.Website { background: #e3edff; color: #1d4ed8; }
.fx .w-src.Facebook { background: #e7ecfb; color: #3b5bdb; }
.fx .w-src.WhatsApp { background: #e8f8ee; color: #15803d; }
.fx .w-sc {
  display: grid;
  gap: 4px;
}
.fx .w-sc b {
  font-size: 12.5px;
  font-weight: 500;
}
.fx .w-sc i {
  height: 5px;
  border-radius: 5px;
  background: #ffe9dd;
  overflow: hidden;
}
.fx .w-sc u {
  display: block;
  height: 100%;
  border-radius: 5px;
  background: linear-gradient(90deg, #ff9a3d, #f2540c);
}

/* pipeline */
.fx .w-kan {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.fx .w-ch {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 32px;
  padding: 0 10px;
  margin-bottom: 8px;
  border: 1px solid var(--line);
  border-radius: 9px;
  font-size: 12px;
  font-weight: 500;
}
.fx .w-ch i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.fx .w-dl {
  display: grid;
  gap: 1px;
  margin-bottom: 8px;
  padding: 10px 11px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: #fff;
  box-shadow: 0 10px 18px -16px rgba(150, 70, 30, 0.5);
}
.fx .w-dl b {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fx .w-dl small {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fx .w-ft {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}
.fx .w-ft strong {
  font-size: 12px;
  font-weight: 600;
}
.fx .w-pr {
  padding: 2px 7px;
  border-radius: 6px;
  font-size: 9.5px;
  font-weight: 500;
}
.fx .w-pr.High, .fx .w-pr.Overdue { background: #fee4e2; color: #b42318; }
.fx .w-pr.Medium { background: #fff3d6; color: #b45309; }
.fx .w-pr.Low { background: #e8f8ee; color: #15803d; }

/* quotation */
.fx .w-bill {
  display: grid;
  gap: 1px;
  margin-bottom: 10px;
  padding: 9px 12px;
  border: 1px solid #ffe0cf;
  border-radius: 11px;
  background: #fff7f2;
  font-size: 10.5px;
  color: var(--ink);
}
.fx .w-bill small {
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--o);
}
.fx .w-bill b {
  font-size: 12px;
  font-weight: 500;
  color: var(--navy);
}
.fx .w-doc {
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
}
.fx .w-dh {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fx .w-stt {
  padding: 3px 9px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #15803d;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.fx .w-ln {
  display: grid;
  grid-template-columns: 1fr auto 60px;
  gap: 10px;
  margin-top: 7px;
  padding: 8px 10px;
  border-radius: 9px;
  background: #faf7f4;
  font-size: 11px;
  color: var(--ink);
}
.fx .w-ln b {
  text-align: right;
  font-weight: 600;
  color: var(--navy);
}
.fx .w-tot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 4px 8px;
  font-size: 11.5px;
  color: var(--ink);
}
.fx .w-tot b {
  font-size: 18px;
  font-weight: 600;
  color: var(--navy);
}
.fx .w-acts {
  display: flex;
  gap: 8px;
}
.fx .w-btn {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 9px;
  background: var(--navy);
  color: #fff;
  font-size: 10.5px;
  font-weight: 500;
  white-space: nowrap;
}
.fx .w-btn.o {
  background: var(--og);
}
.fx .w-flow {
  display: flex;
  gap: 14px;
  margin-top: 11px;
}
.fx .w-flow span {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 500;
}
.fx .w-flow i {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--og);
  color: #fff;
  font-size: 9px;
  font-style: normal;
}

/* whatsapp */
.fx .w-chat-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}
.fx .w-chat-head .w-nm {
  flex: 1;
}
.fx .w-asg {
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff1e8;
  color: #c2410c;
  font-size: 10.5px;
  font-weight: 600;
  white-space: nowrap;
}
.fx .w-msgs {
  display: grid;
  gap: 9px;
  margin: 14px 0;
}
.fx .w-msg {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.4;
}
.fx .w-msg small {
  display: block;
  margin-top: 2px;
  font-size: 9.5px;
  color: var(--mute);
  text-align: right;
}
.fx .w-msg.in { justify-self: start; border: 1px solid var(--line); border-top-left-radius: 4px; background: #fff; }
.fx .w-msg.out { justify-self: end; border-top-right-radius: 4px; background: #e1f7d5; color: #14532d; }
.fx .w-msg.tpl { justify-self: end; display: grid; gap: 2px; border: 1px dashed #ffc9a8; background: #fff7f2; }
.fx .w-msg.tpl::before { content: 'APPROVED TEMPLATE'; font-size: 8.5px; font-weight: 600; letter-spacing: 0.08em; color: var(--o); }
.fx .w-msg.note { justify-self: center; max-width: none; padding: 4px 12px; border-radius: 999px; background: #f1f5f9; color: var(--ink); font-size: 10.5px; }
.fx .w-tools {
  display: flex;
  gap: 8px;
}
.fx .w-tools span {
  padding: 5px 10px;
  border: 1px solid #ebe5e0;
  border-radius: 8px;
  font-size: 10.5px;
  color: var(--ink);
}

/* calls */
.fx .w-call {
  grid-template-columns: 32px 1.6fr 0.9fr 0.4fr;
}
.fx .w-cp {
  display: inline-block;
  justify-self: start;
  padding: 3px 9px;
  border-radius: 7px;
  font-size: 10.5px;
  font-style: normal;
  font-weight: 600;
}
.fx .w-cp.Missed { background: #fee4e2; color: #b42318; }
.fx .w-cp.Answered { background: #e8f8ee; color: #15803d; }
.fx .w-cp.Outbound { background: #e3edff; color: #1d4ed8; }
.fx .w-cp.Vodia { background: #efe9ff; color: #6d28d9; }
.fx .w-mu {
  color: var(--ink);
}
.fx .w-pop {
  position: relative;
  width: 260px;
  max-width: 100%;
  margin: 14px 0 0 auto;
  display: grid;
  gap: 9px;
  padding: 13px;
  border: 1px solid #ffd2b8;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 26px 40px -20px rgba(150, 70, 30, 0.55);
  animation: fx-bob 4s ease-in-out infinite;
}
.fx .w-cap {
  font-size: 9.5px !important;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--o) !important;
}
.fx .w-who {
  display: flex;
  align-items: center;
  gap: 10px;
}
.fx .w-hist {
  display: flex;
  gap: 8px;
}
.fx .w-hist span {
  flex: 1;
  padding: 7px 9px;
  border-radius: 9px;
  background: #faf7f4;
  font-size: 10.5px;
  color: var(--ink);
}
.fx .w-hist b {
  display: block;
  font-size: 13px;
  color: var(--navy);
}

/* service & AMC */
.fx .w-tiles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}
.fx .w-tile {
  display: grid;
  gap: 2px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
}
.fx .w-tile b {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.1;
}
.fx .w-tile em {
  font-size: 10.5px;
  font-style: normal;
  color: var(--mute);
}
.fx .w-tile em.up {
  color: #15803d;
}
.fx .w-am {
  grid-template-columns: 1.2fr 1.3fr 0.8fr;
  height: 50px;
}
.fx .w-st.sch { background: #e3edff; color: #1d4ed8; }
.fx .w-st.prog { background: #fff3d6; color: #b45309; }
.fx .w-st.war { background: #e8f8ee; color: #15803d; }
.fx .w-st.ovr { background: #fee4e2; color: #b42318; }

@keyframes fx-bob {
  50% { transform: translateY(-6px); }
}

/* ---------- tablets / phones: text moves above each card ---------- */
@media (max-width: 900px) {
  .fx-grid {
    grid-template-columns: minmax(0, 1fr);
    max-width: 560px;
    margin: 0 auto;
    gap: 0;
  }
  .fx-aside {
    display: none;
  }
  .fx-mcopy {
    display: block;
    margin-bottom: 22px;
  }
  .fx-mcopy h3 {
    font-size: clamp(32px, 8vw, 44px);
    line-height: 1.2;
  }
  .fx-item,
  .fx-item:last-child {
    padding-bottom: 64px;
  }
  .fx-item:last-child {
    padding-bottom: 0;
  }
  .fx-card {
    height: 440px;
    border-radius: 28px;
  }
  .fx-win {
    left: 20px;
    right: 20px;
    top: 40px;
  }
}
@media (max-width: 480px) {
  .fx-copy h3,
  .fx-mcopy h3 {
    font-size: 34px;
    line-height: 44px;
    letter-spacing: -0.7px;
  }
  .fx .w-pills i:nth-child(n + 4) {
    display: none;
  }
  .fx .w-kan {
    grid-template-columns: repeat(2, 1fr);
  }
  .fx .w-col:nth-child(3) {
    display: none;
  }
  .fx .w-rev {
    font-size: 10.5px;
  }
  .fx .w-rev em {
    display: none;
  }
  .fx .w-chip {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fx *,
  .fx *::before {
    animation: none !important;
  }
  .fx-card,
  .fx-head,
  .fx-aside {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .fx-win,
  .fx-blob {
    transform: none !important;
  }
}
</style>