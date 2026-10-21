<template>
  <section ref="rootEl" class="fs" :class="{ 'fs-in': revealed }" aria-labelledby="fs-title">
    <div class="fs-wrap">
      <header class="fs-head">
        <h2 id="fs-title" class="fs-title">
          Everything you need to
          <span>grow &amp; scale.</span>
        </h2>
        <p>Customer relationships, multi-store sync, and automated sales in one platform.</p>
      </header>

      <div class="fs-tabs" role="tablist" aria-label="Product features">
        <button
          v-for="(f, i) in features"
          :id="`fs-tab-${f.id}`"
          :key="f.id"
          type="button"
          role="tab"
          class="fs-tab"
          :class="{ on: active === i }"
          :aria-selected="active === i"
          aria-controls="fs-panel"
          :tabindex="active === i ? 0 : -1"
          @click="goTo(i)"
          @keydown.right.prevent="step(1)"
          @keydown.left.prevent="step(-1)"
        >
          <span class="ti"><svg viewBox="0 0 24 24" aria-hidden="true"><path v-for="d in f.icon" :key="d" :d="d" /></svg></span>
          {{ f.tab }}
          <i v-if="active === i && motion" class="pg" :class="{ hold: paused }" @animationend="step(1)"></i>
        </button>
      </div>

      <div
        id="fs-panel"
        class="fs-show"
        role="tabpanel"
        :aria-labelledby="`fs-tab-${cur.id}`"
        @pointerenter="paused = true"
        @pointerleave="paused = false"
        @focusin="paused = true"
        @focusout="paused = false"
      >
        <!-- stacked frames + window -->
        <div ref="stageEl" class="fs-stage" aria-hidden="true">
          <div class="fs-fit" :style="{ height: (SH + 84) * scale + 'px' }">
            <div class="fs-scene" :style="{ transform: `translateX(-50%) scale(${scale})` }">
              <div class="fs-stack">
                <!-- ================= 1 · CRM ================= -->
                <div class="fs-card" :class="{ front: active === 0, out: prev === 0 && active !== 0 }" :style="{ '--d': depth(0) }">
                  <div class="sc" :class="{ on: active === 0 }">
                  <div class="bar"><b>Customers</b><span class="srch">⌕ Search customers…</span><span class="flt">Filter</span><span class="avs"><i>KP</i><i>NF</i><i>RS</i></span></div>
                  <div class="body crm">
                    <div class="list">
                      <div v-for="(c, n) in customers" :key="c[1]" class="li" :class="{ sel: n === 0 }" :style="{ '--n': n }">
                        <i class="av" :style="{ background: c[4] }">{{ c[0] }}</i>
                        <span class="nm"><b>{{ c[1] }}</b><small>{{ c[2] }}</small></span>
                        <span class="tier" :class="c[3]">{{ c[3] }}</span>
                      </div>
                    </div>
                    <div class="det">
                      <div class="pf">
                        <i class="av lg">KP</i>
                        <span class="nm"><b>Kasun Perera</b><small>Customer since Mar 2025 · 18 visits</small></span>
                        <span class="tier Gold">★ VIP Gold</span>
                      </div>
                      <div class="kv">
                        <span><small>LIFETIME VALUE</small><b>$4,820</b></span>
                        <span><small>REPEAT PURCHASES</small><b>+46%</b></span>
                        <span><small>LAST BUY</small><b>2 days ago</b></span>
                      </div>
                      <div class="prog"><div class="pl"><span>Gold</span><span>Platinum · 180 pts to go</span></div><div class="pb"><i style="--w: 78%"></i></div></div>
                      <div class="tl">
                        <div v-for="(t, n) in timeline" :key="t[0]" class="ev" :style="{ '--n': n }"><i :class="t[2]"></i><span><b>{{ t[0] }}</b><small>{{ t[1] }}</small></span></div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                <!-- ================= 2 · Stores ================= -->
                <div class="fs-card" :class="{ front: active === 1, out: prev === 1 && active !== 1 }" :style="{ '--d': depth(1) }">
                  <div class="sc" :class="{ on: active === 1 }">
                  <div class="bar"><b>HQ Dashboard</b><span class="srch">⌕ Search branches…</span><span class="flt">Today</span><span class="avs"><i>HQ</i></span></div>
                  <div class="body">
                    <div class="tiles">
                      <div v-for="(t, n) in storeTiles" :key="t[0]" class="tile" :style="{ '--n': n }"><small>{{ t[0] }}</small><b>{{ t[1] }}</b><em :class="t[3]">{{ t[2] }}</em></div>
                    </div>
                    <div class="tbl">
                      <div class="th"><span>BRANCH</span><span>SALES TODAY</span><span>STAFF ROLES</span><span>SYNC</span></div>
                      <div v-for="(b, n) in branches" :key="b[0]" class="tr" :style="{ '--n': n }">
                        <span class="nm"><b>{{ b[0] }}</b><small>{{ b[1] }}</small></span>
                        <span class="rv"><b>{{ b[2] }}</b><i><u :style="{ width: b[3] + '%' }"></u></i></span>
                        <span class="chips"><i>Manager</i><i>Cashier ×{{ b[4] }}</i></span>
                        <span class="ok"><i></i>{{ b[5] }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                <!-- ================= 3 · Quotes ================= -->
                <div class="fs-card" :class="{ front: active === 2, out: prev === 2 && active !== 2 }" :style="{ '--d': depth(2) }">
                  <div class="sc" :class="{ on: active === 2 }">
                  <div class="bar"><b>New quotation</b><span class="srch">⌕ QT-2048</span><span class="flt">Preview PDF</span><span class="avs"><i>AS</i></span></div>
                  <div class="body qt">
                    <div class="steps">
                      <div v-for="(s, n) in steps" :key="s[0]" class="stp" :class="{ cur: n === 1, done: n === 0 }" :style="{ '--n': n }"><small>Step {{ n + 1 }}</small><b>{{ s[0] }}</b></div>
                      <div class="bill"><small>BILL TO</small><b>Apex Motors Ltd</b><span>amal@apexmotors.lk</span></div>
                    </div>
                    <div class="doc">
                      <div class="dh"><span class="nm"><b>Line items</b><small>Prices include 8% VAT · valid for 14 days</small></span><span class="stt">APPROVED</span></div>
                      <div v-for="(l, n) in lines" :key="l[0]" class="ln" :style="{ '--n': n }"><span>{{ l[0] }}</span><span>{{ l[1] }}</span><b>{{ l[2] }}</b></div>
                      <div class="tot"><span>Total</span><b>$7,420.00</b></div>
                      <div class="acts"><span class="btn o">Convert to invoice →</span><span class="btn">Send on WhatsApp</span></div>
                      <div class="flow"><span v-for="(s, n) in ['Sent', 'Viewed', 'Approved']" :key="s" :style="{ '--n': n }"><i>✓</i>{{ s }}</span></div>
                    </div>
                  </div>
                </div>
                </div>

                <!-- ================= 4 · Analytics ================= -->
                <div class="fs-card" :class="{ front: active === 3, out: prev === 3 && active !== 3 }" :style="{ '--d': depth(3) }">
                  <div class="sc" :class="{ on: active === 3 }">
                  <div class="bar"><b>Sales pipeline</b><span class="srch">⌕ Search deals…</span><span class="flt">Filter</span><span class="rev">$128,400 <em>▲ 38.4%</em></span></div>
                  <div class="body">
                    <div class="kan">
                      <div v-for="(col, c) in kanban" :key="col.t" class="col" :style="{ '--c': c }">
                        <div class="ch"><i :style="{ background: col.c }"></i>{{ col.t }}<em>{{ col.n }}</em></div>
                        <div v-for="(d, n) in col.cards" :key="d[0]" class="dl" :style="{ '--n': n + c }">
                          <b>{{ d[0] }}</b><small>{{ d[1] }}</small>
                          <div class="ft"><span class="pr" :class="d[3]">{{ d[3] }}</span><strong>{{ d[2] }}</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                <!-- ================= 5 · Calls ================= -->
                <div class="fs-card" :class="{ front: active === 4, out: prev === 4 && active !== 4 }" :style="{ '--d': depth(4) }">
                  <div class="sc" :class="{ on: active === 4 }">
                  <div class="bar"><b>Call journal</b><span class="srch">⌕ Search calls…</span><span class="flt">Today</span><span class="avs"><i>1001</i></span></div>
                  <div class="body">
                    <div class="pills"><i class="on">All</i><i>Missed</i><i>Answered</i><i>Outbound</i></div>
                    <div class="tbl calls">
                      <div class="th"><span>CUSTOMER</span><span>TYPE</span><span>EXT</span><span>DURATION</span><span>DATE / TIME</span></div>
                      <div v-for="(c, n) in calls" :key="c[1]" class="tr" :class="{ fresh: n === 0 }" :style="{ '--n': n }">
                        <span class="who"><i class="av dk">{{ c[0] }}</i><span class="nm"><b>{{ c[1] }}</b><small>{{ c[2] }}</small></span></span>
                        <span><i class="cp" :class="c[3]">{{ c[3] }}</i></span>
                        <span class="mu">{{ c[4] }}</span><span class="mu">{{ c[5] }}</span><span class="mu">{{ c[6] }}</span>
                      </div>
                    </div>
                    <div class="pop">
                      <small class="cap">INCOMING · EXT 1001</small>
                      <div class="who"><i class="av">DP</i><span class="nm"><b>Daniel Perera</b><small>Matched in &lt;1 s</small></span></div>
                      <div class="hist"><span>Last quote <b>QT-2031</b></span><span>Open tasks <b>2</b></span></div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fs-fade"></div>
        </div>

        <!-- caption -->
        <div :key="cur.id" class="fs-cap">
          <div class="cp1">
            <span class="lbl">{{ cur.label }}</span>
            <h3>{{ cur.title }}</h3>
            <p>{{ cur.description }}</p>
          </div>
          <ul class="cp2">
            <li v-for="pt in cur.points" :key="pt">
              <i><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 8 2.500 2.500L12 5" /></svg></i>{{ pt }}
            </li>
          </ul>
          <div class="cp3">
            <div v-for="m in cur.metrics" :key="m.label"><strong>{{ m.value }}</strong><span>{{ m.label }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeSection1' })
import { ref, computed, onMounted, onUnmounted } from 'vue'

const ROTATION_INTERVAL_MS = 6000

const features = [
  {
    id: 'crm',
    icon: ['M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M2 21v-2a7 7 0 0 1 14 0v2', 'M19 8a4 4 0 0 1 0 8M22 21v-2a5 5 0 0 0-3-4.58'],
    tab: 'Omnichannel CRM',
    label: 'CRM & Customer Intelligence',
    title: 'Build customer loyalty that drives repeat growth.',
    description: 'Capture buyer history, track VIP reward tiers, and auto-dispatch personalized WhatsApp follow-ups.',
    points: ['Real-time customer frequency & lifetime value', 'Automated loyalty tiers & VIP reward triggers', 'Instant WhatsApp digital receipts & offers'],
    metrics: [{ value: '+46%', label: 'Repeat Buyers' }, { value: '98.4%', label: 'Retention Rate' }, { value: '0-Click', label: 'WhatsApp Receipts' }],
  },
  {
    id: 'stores',
    icon: ['m12 3 9 5-9 5-9-5 9-5Z', 'm3 12 9 5 9-5M3 16l9 5 9-5'],
    tab: 'Multi-Store Sync',
    label: 'Multi-Branch Management',
    title: 'Manage 1 to 100+ stores from a single HQ dashboard.',
    description: 'Centralized control over branch operations, staff permissions, customer assignments, and consolidated company financials.',
    points: ['Instant multi-branch operations & centralized control', 'Granular staff role permissions & audit trails', 'Global catalog & pricing updates in under 50ms'],
    metrics: [{ value: '100+', label: 'Stores Scalable' }, { value: '<50ms', label: 'Sync Latency' }, { value: '100%', label: 'HQ Audit Control' }],
  },
  {
    id: 'quotes',
    icon: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z', 'M14 2v6h6M8 13h8M8 17h8'],
    tab: 'Smart Quotes',
    label: 'Fast Proposals & Automated Invoicing',
    title: 'Instant professional quotations. Faster approvals.',
    description: 'Generate branded PDF estimates in seconds, track client views, and convert approved quotes into invoices in 1 click.',
    points: ['Instant branded PDF quotation & estimate generation', 'Real-time client view tracking & WhatsApp dispatch', '1-Click quote-to-invoice conversion & payment logs'],
    metrics: [{ value: '3x Faster', label: 'Quote Turnaround' }, { value: '1-Click', label: 'Invoice Conversion' }, { value: '100%', label: 'Tax & Audit Ready' }],
  },
  {
    id: 'analytics',
    icon: ['M3 3v18h18M8 16V9M13 16V5M18 16v-4'],
    tab: 'Sales Analytics',
    label: 'Revenue & Pipeline Intelligence',
    title: 'Real-time visibility into revenue & pipeline velocity.',
    description: 'Track deal conversion velocity, won revenue, sales rep quotas, and generate exportable tax and audit reports with 1 click.',
    points: ['Live deal pipeline stages & conversion tracking', 'Net profit margins & commission audit trails', 'One-click tax & financial summary exports'],
    metrics: [{ value: '+38.4%', label: 'Pipeline Velocity' }, { value: 'Real-time', label: 'Margin Reports' }, { value: '1-Click', label: 'Tax & CSV Export' }],
  },
  {
    id: 'calls',
    icon: ['M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.2 18.8a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.2 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.05 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69a2 2 0 0 1 1.77 2.05Z'],
    tab: '3CX Call Journal',
    label: '3CX Call Journal & Telephony',
    title: 'Inbound & outbound customer calls, logged automatically.',
    description: 'Track every customer call, missed inquiry, and callback in one unified journal. Connect phone numbers directly to buyer history with instant caller ID matching.',
    points: ['Automated 3CX inbound, outbound & missed call logging', 'Instant caller ID lookup & customer history popup', 'Quick callback queues to eliminate missed customer leads'],
    metrics: [{ value: '100%', label: 'Calls Logged' }, { value: '<1s', label: 'Caller Matching' }, { value: '0', label: 'Lost Inquiries' }],
  },
]

/* demo data for the artwork */
const customers = [
  ['KP', 'Kasun Perera', 'Colombo · $4,820', 'Gold', '#0f172a'],
  ['NF', 'Nimali Fernando', 'Kandy · $3,140', 'Silver', '#f2540c'],
  ['RS', 'Ravindu Silva', 'Galle · $2,960', 'Silver', '#6366f1'],
  ['IJ', 'Ishara Jayasuriya', 'Colombo · $1,720', 'Bronze', '#0ea5a4'],
  ['DW', 'Dilan Wickrama', 'Jaffna · $980', 'Bronze', '#e11d74'],
  ['TM', 'Tharushi M.', 'Kandy · $640', 'New', '#f59e0b'],
]
const timeline = [
  ['Receipt sent on WhatsApp', 'Invoice #INV-3391 · $186.00 · 2 min ago', 'wa'],
  ['Reward unlocked: 10% off', 'Triggered at 3,800 pts · automatic', 'gift'],
  ['Purchase completed', 'Colombo branch · 6 items · 2 days ago', 'bag'],
]
const storeTiles = [
  ['Total sales today', '$106.2k', '▲ 12.4%', 'up'],
  ['Active branches', '12', 'All online', 'up'],
  ['Catalog sync', '38 ms', 'Under 50 ms', 'up'],
  ['Staff on shift', '148', '9 roles', 'mu'],
]
const branches = [
  ['Colombo HQ', '214 sales · 41 customers', '$42.1k', 92, 12, 'Synced'],
  ['Kandy', '139 sales · 27 customers', '$28.6k', 64, 8, 'Synced'],
  ['Galle', '96 sales · 18 customers', '$19.4k', 44, 6, 'Synced'],
  ['Jaffna', '71 sales · 12 customers', '$15.8k', 36, 5, 'Syncing'],
  ['Negombo', '58 sales · 9 customers', '$11.3k', 28, 4, 'Synced'],
]
const steps = [['Client details'], ['Line items'], ['Taxes & terms'], ['Send & track']]
const lines = [
  ['Premium service plan', '×1', '$4,200'],
  ['POS terminal bundle', '×2', '$2,600'],
  ['Onboarding & training', '×1', '$620'],
]
const kanban = [
  { t: 'Leads', n: 24, c: '#94a3b8', cards: [['Lanka Traders', 'Inquiry via website', '$6,400', 'Medium'], ['Blue Wave Hotel', 'Facebook lead ad', '$12,900', 'High'], ['Ceylon Auto', 'WhatsApp inquiry', '$3,200', 'Low']] },
  { t: 'Quoted', n: 18, c: '#f59e0b', cards: [['Metro Pharmacy', 'QT-2051 · viewed', '$8,750', 'High'], ['Green Leaf Café', 'QT-2049 · sent', '$2,980', 'Low'], ['Pearl Retail', 'QT-2047 · viewed', '$5,300', 'Medium']] },
  { t: 'Approved', n: 11, c: '#f2540c', cards: [['Apex Motors', 'QT-2048 · approved', '$7,420', 'High'], ['Sunrise Mart', 'QT-2044 · approved', '$4,100', 'Medium'], ['Silver Coast', 'QT-2042 · approved', '$6,050', 'Low']] },
  { t: 'Paid', n: 9, c: '#10b981', cards: [['Island Books', 'INV-3380 · paid', '$3,640', 'Low'], ['Coral Dental', 'INV-3377 · paid', '$9,210', 'High'], ['Zen Studio', 'INV-3370 · paid', '$2,480', 'Low']] },
]
const calls = [
  ['DP', 'Daniel Perera', '755 322 689', 'Missed', '8001', '0:56', '2026-10-21 08:49'],
  ['KP', 'Kasun Perera', '770 629 341', 'Answered', '1032', '1:40', '2026-10-21 08:12'],
  ['YA', 'Yasasi Alwis', '947 039 708', 'Outbound', '1001', '4:05', '2026-10-20 16:39'],
  ['NF', 'Nimali Fernando', '771 880 214', 'Answered', '1008', '2:31', '2026-10-20 15:02'],
  ['UC', 'Unknown customer', '112 457 803', 'Missed', '8001', '0:18', '2026-10-20 11:27'],
]

const rootEl = ref(null)
const stageEl = ref(null)
const active = ref(0)
const prev = ref(-1)
const order = ref([0, 1, 2, 3, 4]) // front → back
const paused = ref(false)
const revealed = ref(false)
const scale = ref(1)
const motion = ref(true)
const cur = computed(() => features[active.value])

let ro, io

function goTo(i) {
  const n = (i + features.length) % features.length
  if (n === active.value) return
  prev.value = active.value
  active.value = n
  // the chosen screen moves to the front, everything else keeps its relative order behind it
  order.value = [n, ...order.value.filter((x) => x !== n)]
}
const depth = (i) => order.value.indexOf(i)
const step = (d) => goTo(active.value + d)
function fit() {
  if (!stageEl.value) return
  scale.value = Math.min(1.08, +(stageEl.value.clientWidth / (SW + 56)).toFixed(3)) || 1
}

onMounted(() => {
  motion.value = !(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  fit()
  ro = new ResizeObserver(fit)
  ro.observe(stageEl.value)
  io = new IntersectionObserver(
    ([en]) => {
      if (en.isIntersecting) revealed.value = true
      paused.value = !en.isIntersecting
    },
    { threshold: 0.2 },
  )
  io.observe(rootEl.value)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  io?.disconnect()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

.fs {
  --o: #f2540c;
  --og: linear-gradient(145deg, #ff7a1a, #f2540c);
  --o-soft: #fff1e8;
  --navy: #0f172a;
  --ink: #475569;
  --mute: #94a3b8;
  --line: #f1ece8;
  --frame: #fbe3d3;
  --bg: #fff;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  width: calc(100% - 2 * clamp(12px, 3vw, 40px));
  max-width: 1680px;
  margin: clamp(16px, 3vw, 40px) auto;
  padding: clamp(40px, 6vw, 84px) clamp(14px, 4vw, 64px) clamp(28px, 4vw, 52px);
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: clamp(22px, 2.6vw, 36px);
  box-shadow: 0 30px 60px -36px rgba(150, 70, 30, 0.35), 0 1px 0 #fff inset;
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--navy);
  background: #fff;
}
.fs,
.fs *,
.fs *::before,
.fs *::after {
  box-sizing: border-box;
}
.fs svg {
  display: block;
}
.fs::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: radial-gradient(rgba(190, 120, 90, 0.13) 1px, transparent 1.2px);
  background-size: 26px 26px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 85%);
}
.fs-wrap {
  max-width: 1120px;
  margin: 0 auto;
}

/* heading — two-tone like the reference */
.fs-head {
  text-align: center;
}
.fs-title {
  max-width: 900px;
  margin: 0 auto;
  color: #0f172a;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: 3.5vw;
  font-weight: 500;
  line-height: 1.16;
  letter-spacing: -0.05em;
}
.fs-title span {
  display: block;
  width: fit-content; /* gradient spans the text itself */
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em; /* keeps the "g" descender inside the clipped background */
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.fs-head p {
  margin: 14px auto 0;
  max-width: 520px;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 34px;
  letter-spacing: -0.72px;
  color: var(--ink);
}

/* pills */
.fs-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  max-width: 820px;
  margin: 30px auto 0;
}
.fs-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 16px 5px 5px;
  border: 1px solid #f0e3d8;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.85);
  color: #1f2937;
  font: 700 16px/1.2 'Poppins', system-ui, sans-serif;
  cursor: pointer;
  overflow: hidden;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}
.fs-tab .ti {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #fde6d8;
  transition: background 0.3s;
}
.fs-tab .ti svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--o);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.fs-tab:hover {
  background: #fff;
  transform: translateY(-1px);
}
.fs-tab.on {
  background: #ffe7da;
  border-color: #ffd0b6;
  box-shadow: 0 10px 20px -12px rgba(242, 84, 12, 0.55);
}
.fs-tab.on .ti {
  background: #fff;
}
.fs-tab .pg {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2.5px;
  width: 100%;
  background: var(--og);
  transform-origin: left;
  animation: fs-fill 6s linear forwards;
}
.fs-tab .pg.hold {
  animation-play-state: paused;
}
.fs-tab:focus-visible {
  outline: 2px solid var(--o);
  outline-offset: 3px;
}

/* ================= stage ================= */
.fs-show {
  margin-top: 34px;
}
.fs-stage {
  position: relative;
  max-width: 1040px;
  margin: 0 auto;
  overflow: hidden;
}
.fs-fit {
  position: relative;
  overflow: hidden;
}
.fs-scene {
  position: absolute;
  left: 50%;
  top: 0;
  width: 1016px; /* 960 + frame */
  max-width: none;
  flex: none;
  height: 744px;
  transform-origin: 50% 0;
}
.fs .fs-stack {
  position: absolute;
  inset: 0;
  width: auto;
  max-width: none;
  margin: 0;
  padding: 0;
  display: block;
}
/* every screen is its own beige frame + white window; --d is its place in the stack (0 = front) */
.fs .fs-card {
  --d: 0;
  position: absolute;
  width: auto;
  max-width: none;
  min-width: 0;
  margin: 0;
  display: block;
  top: 136px;
  left: 0;
  right: 0;
  height: 620px;
  padding: 18px 18px 0;
  border-radius: 30px 30px 0 0;
  background: linear-gradient(180deg, #fde8da, var(--frame));
  border-top: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 -10px 24px -16px rgba(150, 70, 30, 0.35);
  z-index: calc(10 - var(--d));
  transform-origin: 50% 0;
  transform: translateY(calc(var(--d) * -34px)) scale(calc(1 - var(--d) * 0.032));
  transition: transform 0.95s cubic-bezier(0.16, 0.84, 0.3, 1), filter 0.7s ease;
  filter: saturate(calc(1 - var(--d) * 0.12));
}
.fs .fs-card.front {
  box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.8) inset, 0 40px 60px -30px rgba(150, 70, 30, 0.35);
}
/* the window that just left the front dips a little before it slides back */
.fs .fs-card.out {
  transition-duration: 0.8s, 0.7s;
}
.sc {
  position: absolute;
  inset: 18px 18px 0;
  border-radius: 14px 14px 0 0;
  background: #fff;
  overflow: hidden;
  /* behind the front: only a faded header strip shows */
  opacity: calc(0.62 - var(--d) * 0.12);
  filter: blur(1.6px);
  transition: opacity 0.7s ease, filter 0.8s ease;
}
.fs .fs-card.front .sc {
  opacity: 1;
  filter: none;
  transition: opacity 0.7s ease 0.15s, filter 0.85s ease 0.1s;
}
.fs .fs-card.out .sc {
  filter: blur(6px);
  transition: opacity 0.5s ease, filter 0.5s ease;
}
.sc small {
  font-size: 11px;
  color: var(--mute);
}
.sc .nm {
  display: grid;
  line-height: 1.3;
  min-width: 0;
}
.sc .nm b {
  font-size: 13.5px;
  font-weight: 500;
}
.sc .bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 58px;
  padding: 0 22px;
  border-bottom: 1px solid var(--line);
}
.bar > b {
  flex: 1;
  font-size: 17px;
  font-weight: 500;
}
.srch {
  width: 220px;
  padding: 7px 12px;
  border: 1px solid #ebe5e0;
  border-radius: 9px;
  font-size: 12px;
  color: var(--mute);
}
.flt {
  padding: 7px 14px;
  border: 1px solid #ebe5e0;
  border-radius: 9px;
  font-size: 12px;
  color: var(--ink);
}
.avs {
  display: flex;
}
.avs i {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-left: -6px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: var(--navy);
  color: #fff;
  font: 600 9px/1 'Poppins', sans-serif;
  font-style: normal;
}
.avs i:nth-child(2) { background: var(--og); }
.avs i:nth-child(3) { background: #6366f1; }
.rev {
  font-size: 15px;
  font-weight: 600;
}
.rev em {
  margin-left: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #15803d;
  font-size: 11px;
  font-style: normal;
}
.sc .body {
  position: relative;
  padding: 18px 22px;
}
.sc .av {
  display: grid;
  place-items: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--og);
  color: #fff;
  font: 600 11.5px/1 'Poppins', sans-serif;
  font-style: normal;
}
.sc .av.lg {
  width: 54px;
  height: 54px;
  font-size: 16px;
  background: var(--navy);
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--o);
}
.sc .av.dk {
  background: var(--navy);
  box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px var(--o);
}
.tier {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
}
.tier.Gold { background: #fff3d6; color: #b45309; }
.tier.Silver { background: #eef2f7; color: #475569; }
.tier.Bronze { background: #fbe9dd; color: #9a4a1d; }
.tier.New { background: #e3edff; color: #1d4ed8; }

/* staggered row entrance */
.sc .li, .sc .tile, .sc .tr, .sc .ev, .sc .stp, .sc .ln, .sc .dl, .sc .flow span {
  opacity: 0;
  translate: 0 10px;
}
.sc.on .li, .sc.on .tile, .sc.on .tr, .sc.on .ev, .sc.on .stp, .sc.on .ln, .sc.on .dl, .sc.on .flow span {
  opacity: 1;
  translate: 0 0;
  transition: opacity 0.4s ease, translate 0.55s var(--ease);
  transition-delay: calc(0.35s + var(--n, 0) * 0.08s);
}

/* 1 · CRM */
.crm {
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 22px;
}
.list {
  display: grid;
  gap: 4px;
  align-content: start;
}
.li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: 12px;
}
.li .nm {
  flex: 1;
}
.li.sel {
  border-color: #ffd2b8;
  background: linear-gradient(90deg, #fff6f0, #fff);
}
.det {
  min-width: 0;
}
.pf {
  display: flex;
  align-items: center;
  gap: 14px;
}
.pf .nm {
  flex: 1;
}
.pf .nm b {
  font-size: 18px;
}
.kv {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
}
.kv span {
  display: grid;
  gap: 2px;
  padding: 9px 14px;
  border-radius: 12px;
  background: #faf7f4;
}
.kv small {
  font-size: 9.5px;
  letter-spacing: 0.06em;
}
.kv b {
  font-size: 20px;
  font-weight: 500;
}
.prog {
  margin-top: 12px;
}
.pl {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
  font-size: 12px;
  color: var(--ink);
}
.pb {
  height: 9px;
  border-radius: 9px;
  background: #ffe9dd;
  overflow: hidden;
}
.pb i {
  display: block;
  width: 0;
  height: 100%;
  border-radius: 9px;
  background: linear-gradient(90deg, #ff9a3d, #f2540c);
}
.sc.on .pb i {
  width: var(--w);
  transition: width 1.3s var(--ease) 0.8s;
}
.tl {
  display: grid;
  gap: 7px;
  margin-top: 12px;
}
.ev {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
}
.ev > i {
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 10px;
  background: #fff1e8;
  position: relative;
}
.ev > i::after {
  content: '';
  position: absolute;
  inset: 9px;
  border-radius: 50%;
  background: var(--og);
}
.ev > i.wa { background: #e6f9ee; }
.ev > i.wa::after { background: #16a34a; }
.ev b {
  display: block;
  font-size: 13px;
  font-weight: 500;
}

/* 2 · stores + shared table */
.tiles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.tile {
  display: grid;
  gap: 3px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
}
.tile b {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.15;
}
.tile em {
  font-style: normal;
  font-size: 11.5px;
  color: var(--mute);
}
.tile em.up {
  color: #15803d;
}
.tbl {
  margin-top: 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
}
.th,
.tr {
  display: grid;
  grid-template-columns: 1.3fr 1.2fr 1.3fr 0.7fr;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
}
.th {
  height: 34px;
  background: #faf7f4;
  font-size: 10px;
  letter-spacing: 0.07em;
  color: var(--mute);
}
.tr {
  height: 54px;
  border-top: 1px solid var(--line);
  font-size: 12px;
}
.rv {
  display: grid;
  gap: 6px;
}
.rv b {
  font-size: 14px;
  font-weight: 500;
}
.rv i {
  height: 6px;
  border-radius: 6px;
  background: #ffe9dd;
  overflow: hidden;
}
.rv u {
  display: block;
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, #ff9a3d, #f2540c);
}
.chips {
  display: flex;
  gap: 6px;
}
.chips i {
  padding: 4px 9px;
  border: 1px solid #ebe5e0;
  border-radius: 8px;
  font-style: normal;
  font-size: 11px;
  color: var(--ink);
}
.ok {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #15803d;
}
.ok i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px #dcfce7;
}

/* 3 · quotes */
.qt {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 24px;
}
.steps {
  display: grid;
  gap: 14px;
  align-content: start;
  padding-top: 6px;
}
.bill {
  display: grid;
  gap: 1px;
  margin-top: 6px;
  padding: 12px 14px;
  border: 1px solid #ffe0cf;
  border-radius: 12px;
  background: #fff7f2;
  font-size: 12px;
  color: var(--ink);
}
.bill small {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--o);
}
.bill b {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--navy);
}
.stp b {
  display: block;
  font-size: 15px;
  font-weight: 500;
}
.stp.cur b {
  color: var(--o);
}
.stp.done b::after {
  content: ' ✓';
  color: #15803d;
}
.doc {
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 16px 30px -22px rgba(150, 70, 30, 0.4);
}
.dh {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.dh .nm b {
  font-size: 16px;
}
.stt {
  padding: 4px 11px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #15803d;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.ln {
  display: grid;
  grid-template-columns: 1fr auto 70px;
  gap: 12px;
  margin-top: 8px;
  padding: 11px 12px;
  border-radius: 10px;
  background: #faf7f4;
  font-size: 13px;
  color: var(--ink);
}
.ln b {
  text-align: right;
  color: var(--navy);
  font-weight: 600;
}
.tot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 14px 4px 12px;
  font-size: 13px;
  color: var(--ink);
}
.tot b {
  font-size: 24px;
  font-weight: 600;
  color: var(--navy);
}
.acts {
  display: flex;
  gap: 10px;
}
.btn {
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 18px;
  border-radius: 10px;
  background: var(--navy);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}
.btn.o {
  background: var(--og);
}
.sc.on .btn.o {
  animation: fs-ring 2.6s ease-out 1.6s infinite;
}
.flow {
  display: flex;
  gap: 16px;
  margin-top: 14px;
}
.flow span {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 500;
}
.flow i {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--og);
  color: #fff;
  font-size: 10px;
  font-style: normal;
}

/* 4 · kanban */
.kan {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.ch {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  margin-bottom: 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
}
.ch i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
.ch em {
  margin-left: auto;
  padding: 1px 8px;
  border-radius: 999px;
  background: #f1ece8;
  font-size: 11px;
  font-style: normal;
}
.dl {
  display: grid;
  gap: 2px;
  margin-bottom: 10px;
  padding: 12px 13px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 10px 18px -16px rgba(150, 70, 30, 0.5);
}
.dl b {
  font-size: 13.5px;
  font-weight: 500;
}
.ft {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.ft strong {
  font-size: 14px;
  font-weight: 600;
}
.pr {
  padding: 2px 9px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 500;
}
.pr.High { background: #fee4e2; color: #b42318; }
.pr.Medium { background: #fff3d6; color: #b45309; }
.pr.Low { background: #e8f8ee; color: #15803d; }

/* 5 · calls */
.pills {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.pills i {
  padding: 6px 14px;
  border: 1px solid #ebe5e0;
  border-radius: 9px;
  font-style: normal;
  font-size: 12px;
  color: var(--ink);
}
.pills .on {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}
.calls {
  margin-top: 0;
  margin-right: 292px;
}
.calls .th,
.calls .tr {
  grid-template-columns: 1.7fr 0.9fr 0.5fr 0.6fr;
}
.calls .th span:nth-child(5),
.calls .tr > span:nth-child(5) {
  display: none;
}
.calls .tr.fresh {
  background: linear-gradient(90deg, #fff6f0, #fff);
}
.who {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.mu {
  color: var(--ink);
}
.cp {
  padding: 3px 10px;
  border-radius: 7px;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
}
.cp.Missed { background: #fee4e2; color: #b42318; }
.cp.Answered { background: #e8f8ee; color: #15803d; }
.cp.Outbound { background: #e3edff; color: #1d4ed8; }
.pop {
  position: absolute;
  right: 22px;
  top: 70px;
  width: 270px;
  display: grid;
  gap: 10px;
  padding: 14px;
  border: 1px solid #ffd2b8;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 26px 40px -20px rgba(150, 70, 30, 0.5);
  opacity: 0;
  translate: 0 16px;
}
.sc.on .pop {
  opacity: 1;
  translate: 0 0;
  transition: opacity 0.5s ease 0.9s, translate 0.7s var(--ease) 0.9s;
  animation: fs-bob 4s ease-in-out 1.8s infinite;
}
.cap {
  color: var(--o) !important;
  font-size: 10px !important;
  font-weight: 600;
  letter-spacing: 0.08em;
}
.hist {
  display: flex;
  gap: 8px;
}
.hist span {
  flex: 1;
  padding: 8px 10px;
  border-radius: 10px;
  background: #faf7f4;
  font-size: 11.5px;
  color: var(--ink);
}
.hist b {
  display: block;
  font-size: 14px;
  color: var(--navy);
}

/* ================= caption ================= */
.fs-cap {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  grid-template-areas: 'a b' 'c c';
  gap: 22px clamp(20px, 4vw, 56px);
  max-width: 1040px;
  margin: -18px auto 0;
  padding: 0 clamp(4px, 2vw, 24px);
  animation: fs-in 0.6s var(--ease) both;
}
.cp1 { grid-area: a; }
.cp2 { grid-area: b; align-self: center; }
.cp3 { grid-area: c; }
.lbl {
  display: inline-block;
  padding: 6px 13px;
  border: 1px solid #ffe0cf;
  border-radius: 999px;
  background: var(--o-soft);
  color: #c2410c;
  font-size: 12px;
  font-weight: 500;
}
.cp1 h3 {
  margin: 14px 0 0;
  max-width: 520px;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.05em;
}
.cp1 p {
  margin: 10px 0 0;
  max-width: 520px;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 34px;
  letter-spacing: -0.72px;
  color: var(--ink);
}
.cp2 {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cp2 li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13.5px;
  line-height: 1.5;
  color: #334155;
}
.cp2 i {
  display: grid;
  place-items: center;
  flex: none;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  border-radius: 50%;
  background: var(--og);
}
.cp2 svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cp3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.cp3 div {
  padding: 14px 16px;
  border: 1px solid #f3e6dc;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
}
.cp3 strong {
  display: block;
  color: var(--o);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.3;
  overflow-wrap: anywhere;
}
.cp3 span {
  font-size: 12px;
  color: var(--ink);
}

/* motion */
@keyframes fs-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}
@keyframes fs-fill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes fs-ring {
  0% { box-shadow: 0 0 0 0 rgba(242, 84, 12, 0.45); }
  70%, 100% { box-shadow: 0 0 0 10px rgba(242, 84, 12, 0); }
}
@keyframes fs-bob {
  50% { translate: 0 -6px; }
}
.fs-head,
.fs-tabs,
.fs-show {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.7s ease, transform 0.8s var(--ease);
}
.fs-tabs { transition-delay: 0.08s; }
.fs-show { transition-delay: 0.16s; }
.fs-in .fs-head,
.fs-in .fs-tabs,
.fs-in .fs-show {
  opacity: 1;
  transform: none;
}

/* responsive */
@media (max-width: 760px) {
  .fs-cap {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'a' 'b' 'c';
    margin-top: -10px;
  }
  .fs-tabs {
    gap: 8px;
  }
  .fs-tab {
    font-size: 13px;
    padding-right: 12px;
  }
  .fs-tab .ti {
    width: 30px;
    height: 30px;
  }
}
@media (max-width: 520px) {
  .cp3 { gap: 6px; }
  .cp3 div { padding: 10px; }
  .cp3 strong { font-size: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .fs *,
  .fs *::before { animation: none !important; }
  .fs *,
  .fs *::before,
  .fs *::after { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>