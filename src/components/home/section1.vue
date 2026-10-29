<template>
  <section ref="rootEl" class="fs" :class="{ 'fs-in': revealed }" aria-labelledby="fs-title">
    <div class="fs-wrap">
      <header class="fs-head">
        <h2 id="fs-title" class="fs-title">
          Everything you need to
          <span>grow &amp; scale.</span>
        </h2>
        
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
        </button>
      </div>

      <div
        id="fs-panel"
        class="fs-show"
        :style="{ '--k': scale }"
        role="tabpanel"
        :aria-labelledby="`fs-tab-${cur.id}`"
        @pointerenter="paused = true"
        @pointerleave="paused = false"
        @focusin="paused = true"
        @focusout="paused = false"
      >
        <!-- stacked frames + window -->
        <div ref="stageEl" class="fs-stage" aria-hidden="true">
          <div ref="fitEl" class="fs-fit" :style="fitH ? { height: fitH + 'px' } : undefined">
            <div class="fs-scene" :style="{ transform: `translateX(-50%) scale(${scale})` }">
              <div class="fs-stack">
                <!-- ================= 1 · Leads ================= -->
                <div class="fs-card" :class="{ front: active === 0, out: prev === 0 && active !== 0 }" :style="{ '--d': depth(0) }">
                  <div class="sc" :class="{ on: active === 0 }">
                  <div class="bar"><b>Lead inbox</b><span class="srch">⌕ Search leads…</span><span class="flt">All sources</span><span class="avs"><i>AS</i><i>NP</i><i>RK</i></span></div>
                  <div class="body">
                    <div class="pills"><i v-for="(p, n) in leadPills" :key="p" :class="{ on: n === 0 }">{{ p }}</i></div>
                    <div class="tbl ld">
                      <div class="th"><span>LEAD</span><span>SOURCE</span><span>SCORE</span><span>ASSIGNED TO</span></div>
                      <div v-for="(r, n) in leadRows" :key="r[1]" class="tr" :class="{ fresh: n === 0 }" :style="{ '--n': n }">
                        <span class="who"><i class="av dk">{{ r[0] }}</i><span class="nm"><b>{{ r[1] }}</b><small>{{ r[2] }}</small></span><em v-if="r[7]" class="ld-mrg">{{ r[7] }}</em></span>
                        <span><i class="ld-src" :class="r[3]">{{ r[3] }}</i></span>
                        <span class="rv"><b>{{ r[4] }}</b><i><u :style="{ width: r[4] + '%' }"></u></i></span>
                        <span class="ld-asg"><i>{{ r[5] }}</i>{{ r[6] }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                <!-- ================= 2 · Pipeline ================= -->
                <div class="fs-card" :class="{ front: active === 1, out: prev === 1 && active !== 1 }" :style="{ '--d': depth(1) }">
                  <div class="sc" :class="{ on: active === 1 }">
                  <div class="bar"><b>Sales pipeline</b><span class="srch">⌕ Search deals…</span><span class="flt">Filter</span><span class="rev">Weighted forecast $86,900 <em>live</em></span></div>
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

                <!-- ================= 3 · Quotations ================= -->
                <div class="fs-card" :class="{ front: active === 2, out: prev === 2 && active !== 2 }" :style="{ '--d': depth(2) }">
                  <div class="sc" :class="{ on: active === 2 }">
                  <div class="bar"><b>New quotation</b><span class="srch">⌕ QT-2048</span><span class="flt">Preview PDF</span><span class="avs"><i>AS</i></span></div>
                  <div class="body qt">
                    <div class="steps">
                      <div v-for="(s, n) in steps" :key="s[0]" class="stp" :class="{ cur: n === 1, done: n === 0 }" :style="{ '--n': n }"><small>Step {{ n + 1 }}</small><b>{{ s[0] }}</b></div>
                      <div class="bill"><small>BILL TO</small><b>Apex Motors Ltd</b><span>amal@apexmotors.lk</span></div>
                    </div>
                    <div class="doc">
                      <div class="dh"><span class="nm"><b>Line items</b><small>8% VAT · 5% discount · multicurrency</small></span><span class="stt">APPROVED</span></div>
                      <div v-for="(l, n) in lines" :key="l[0]" class="ln" :style="{ '--n': n }"><span>{{ l[0] }}</span><span>{{ l[1] }}</span><b>{{ l[2] }}</b></div>
                      <div class="tot"><span>Total</span><b>$7,420.00</b></div>
                      <div class="acts"><span class="btn o">Convert to invoice →</span><span class="btn">Send on WhatsApp</span><span class="btn">Email</span></div>
                      <div class="flow"><span v-for="(s, n) in ['Sent', 'Viewed', 'Approved']" :key="s" :style="{ '--n': n }"><i>✓</i>{{ s }}</span></div>
                    </div>
                  </div>
                </div>
                </div>

                <!-- ================= 4 · WhatsApp CRM ================= -->
                <div class="fs-card" :class="{ front: active === 3, out: prev === 3 && active !== 3 }" :style="{ '--d': depth(3) }">
                  <div class="sc" :class="{ on: active === 3 }">
                  <div class="bar"><b>WhatsApp inbox</b><span class="srch">⌕ Search chats…</span><span class="flt">All agents</span><span class="avs"><i>AS</i><i>NP</i><i>RK</i></span></div>
                  <div class="body wa">
                    <div class="wa-list">
                      <div v-for="(c, n) in chats" :key="c[1]" class="wa-chat" :class="{ sel: n === 0 }" :style="{ '--n': n }">
                        <i class="av" :style="{ background: c[4] }">{{ c[0] }}</i>
                        <span class="nm"><b>{{ c[1] }}</b><small>{{ c[2] }}</small></span>
                        <span class="wa-meta"><small>{{ c[3] }}</small><em v-if="c[5]">{{ c[5] }}</em></span>
                      </div>
                    </div>
                    <div class="wa-conv">
                      <div class="wa-head"><i class="av dk">NR</i><span class="nm"><b>Nuwan Rathnayake</b><small>+94 77 412 8890 · Official WhatsApp API</small></span><span class="wa-asg">Assigned · Amal S.</span></div>
                      <div class="wa-msgs">
                        <div v-for="(m, n) in msgs" :key="m[1]" class="wa-msg" :class="m[0]" :style="{ '--n': n + 2 }"><span>{{ m[1] }}</span><small v-if="m[2]">{{ m[2] }}</small></div>
                      </div>
                      <div class="wa-tools"><span>/ Saved replies</span><span>Templates</span><span>Assign ▾</span></div>
                    </div>
                  </div>
                </div>
                </div>

                <!-- ================= 5 · Calls (3CX + Vodia) ================= -->
                <div class="fs-card" :class="{ front: active === 4, out: prev === 4 && active !== 4 }" :style="{ '--d': depth(4) }">
                  <div class="sc" :class="{ on: active === 4 }">
                  <div class="bar"><b>Call journal</b><span class="srch">⌕ Search calls…</span><span class="flt">Today</span><span class="avs"><i>1001</i></span></div>
                  <div class="body">
                    <div class="pills"><i class="on">All</i><i>Missed</i><i>Answered</i><i>Outbound</i><i>Vodia AI</i></div>
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

                <!-- ================= 6 · Service & AMC ================= -->
                <div class="fs-card" :class="{ front: active === 5, out: prev === 5 && active !== 5 }" :style="{ '--d': depth(5) }">
                  <div class="sc" :class="{ on: active === 5 }">
                  <div class="bar"><b>Service &amp; AMC</b><span class="srch">⌕ Search contracts…</span><span class="flt">This month</span><span class="avs"><i>NP</i><i>RK</i><i>TM</i></span></div>
                  <div class="body">
                    <div class="tiles">
                      <div v-for="(t, n) in amTiles" :key="t[0]" class="tile" :style="{ '--n': n }"><small>{{ t[0] }}</small><b>{{ t[1] }}</b><em :class="t[3]">{{ t[2] }}</em></div>
                    </div>
                    <div class="tbl am">
                      <div class="th"><span>CONTRACT</span><span>SERVICE</span><span>TECHNICIAN</span><span>STATUS</span></div>
                      <div v-for="(r, n) in amRows" :key="r[0]" class="tr" :style="{ '--n': n }">
                        <span class="nm"><b>{{ r[0] }}</b><small>{{ r[1] }}</small></span>
                        <span class="nm"><b>{{ r[2] }}</b><small>{{ r[3] }}</small></span>
                        <span class="ld-asg"><i>{{ r[4] }}</i>{{ r[5] }}</span>
                        <span><i class="am-st" :class="r[6]">{{ r[7] }}</i></span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- caption -->
        <div class="fs-cap" :style="capW ? { maxWidth: capW + 'px' } : undefined">
          <div class="fs-cap-in">
          <Transition name="fs-swap">
          <div :key="cur.id" class="fs-cap-swap">
            <div class="cp1">
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
          </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeSection1' })
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const features = [
  {
    id: 'leads',
    icon: ['M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M2 21v-2a7 7 0 0 1 14 0v2', 'M19 8a4 4 0 0 1 0 8M22 21v-2a5 5 0 0 0-3-4.58'],
    tab: 'Leads & Contacts',
    label: 'Lead capture',
    title: 'Lead and contact management',
    description: 'Enquiries from your website, Facebook Lead Ads and WhatsApp arrive in Saptivo automatically, tagged with their source. Duplicates are merged, leads are scored and each one is assigned to the right salesperson within seconds.',
    points: ['Website, Facebook Lead Ads and WhatsApp enquiries captured automatically', 'Every lead tagged with its source, duplicates merged', 'Leads scored and assigned to the right salesperson in seconds'],
    metrics: [{ value: '3 sources', label: 'Auto-Captured' }, { value: 'Auto', label: 'Duplicate Merge' }, { value: 'Seconds', label: 'To Assign' }],
  },
  {
    id: 'pipeline',
    icon: ['M3 4h18l-7 8v6l-4 2v-8L3 4Z'],
    tab: 'Sales Pipeline',
    label: 'Pipeline',
    title: 'Sales pipeline',
    description: 'Drag deals across stages you define, set follow-up reminders and see weighted revenue forecasts in real time. Overdue deals are flagged before they go cold.',
    points: ['Drag deals across stages you define', 'Follow-up reminders on every deal', 'Overdue deals flagged before they go cold'],
    metrics: [{ value: 'Real-time', label: 'Weighted Forecast' }, { value: 'Custom', label: 'Pipeline Stages' }, { value: 'Early', label: 'Overdue Alerts' }],
  },
  {
    id: 'quotes',
    icon: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z', 'M14 2v6h6M8 13h8M8 17h8'],
    tab: 'Quotes & Invoicing',
    label: 'Billing',
    title: 'Quotations and invoicing',
    description: 'Create branded PDF quotations from your product catalog in seconds, send them on WhatsApp or email, and convert approved quotes into tax invoices in one click. VAT, discounts and multicurrency are built in.',
    points: ['Branded PDF quotations from your product catalog', 'Send on WhatsApp or email', 'VAT, discounts and multicurrency built in'],
    metrics: [{ value: '1-Click', label: 'Quote to Invoice' }, { value: 'PDF', label: 'Branded Quotes' }, { value: 'Multi', label: 'Currency & VAT' }],
  },
  {
    id: 'whatsapp',
    icon: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
    tab: 'WhatsApp CRM',
    label: 'Messaging',
    title: 'WhatsApp CRM',
    description: "Give your whole team one shared WhatsApp Business inbox on the official API. Assign chats, use saved replies and approved templates, and keep every conversation on the customer's timeline.",
    points: ['One shared WhatsApp Business inbox for the whole team', 'Assign chats, with saved replies and approved templates', "Every conversation kept on the customer's timeline"],
    metrics: [{ value: '1 inbox', label: 'Team Inbox' }, { value: 'Official', label: 'Business API' }, { value: 'Full', label: 'Timeline' }],
  },
  {
    id: 'calls',
    icon: ['M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.2 18.8a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.2 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.05 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69a2 2 0 0 1 1.77 2.05Z'],
    tab: '3CX & Vodia Calls',
    label: 'Telephony',
    title: '3CX and Vodia call integration',
    description: "See who is calling before you answer. Saptivo connects to your 3CX or Vodia phone system, pops up the caller's profile and logs every inbound, outbound and missed call automatically. With Vodia, AI voice agents can also make reminder and follow-up calls using your CRM data.",
    points: ["Caller's profile pops up before you answer", 'Every inbound, outbound and missed call logged automatically', 'Vodia AI voice agents make reminder and follow-up calls'],
    metrics: [{ value: '3CX/Vodia', label: 'Phone Systems' }, { value: 'Auto', label: 'Calls Logged' }, { value: 'AI', label: 'Voice Agents' }],
  },
  {
    id: 'service',
    icon: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'],
    tab: 'Service & AMC',
    label: 'Field service',
    title: 'Service and AMC management',
    description: 'For businesses that install and maintain equipment, Saptivo manages annual maintenance contracts, preventive service schedules, technician dispatch, spare parts and warranty billing.',
    points: ['Annual maintenance contracts and preventive service schedules', 'Technician dispatch and spare parts', 'Warranty billing in the same place'],
    metrics: [{ value: 'AMC', label: 'Contracts' }, { value: 'Preventive', label: 'Service Schedules' }, { value: 'Warranty', label: 'Billing Built In' }],
  },
]

/* demo data for the artwork */
const leadPills = ['All 48', 'Website 21', 'Facebook Lead Ads 14', 'WhatsApp 13']
const leadRows = [
  ['NR', 'Nuwan Rathnayake', 'Website form · 12 s ago', 'Website', 92, 'AS', 'Amal S.', ''],
  ['FR', 'Fathima Rizwan', 'Facebook Lead Ad · 1 min ago', 'Facebook', 84, 'NP', 'Nadeesha P.', ''],
  ['PG', 'Pradeep Gunasekara', 'WhatsApp · 3 min ago', 'WhatsApp', 76, 'AS', 'Amal S.', 'Merged ×2'],
  ['SD', 'Sachini Dias', 'Website form · 6 min ago', 'Website', 58, 'RK', 'Ruwan K.', ''],
]
const chats = [
  ['NR', 'Nuwan Rathnayake', 'Do you have the POS bundle in stock?', '10:42', '#0f172a', '2'],
  ['FR', 'Fathima Rizwan', 'Thanks! Payment sent ✓', '10:31', '#f2540c', ''],
  ['PG', 'Pradeep Gunasekara', 'Can we reschedule the demo?', '09:58', '#6366f1', '1'],
  ['SD', 'Sachini Dias', 'Template · Order confirmation', '09:20', '#0ea5a4', ''],
]
const msgs = [
  ['in', 'Hi! Do you have the POS bundle in stock?', '10:42'],
  ['out', 'Hi Nuwan, yes. Sending your quotation now.', '10:43 ✓✓'],
  ['tpl', 'Quotation QT-2048 is ready to view and approve', 'Delivered ✓✓'],
  ['note', "✓ Saved to Nuwan's customer timeline", ''],
]
const amTiles = [
  ['Active AMC contracts', '126', '▲ 8 this month', 'up'],
  ['Services due this week', '18', '4 dispatched', 'up'],
  ['Spare parts low', '5', 'Reorder', 'mu'],
  ['Warranty claims', '7', 'Billing ready', 'up'],
]
const amRows = [
  ['Apex Motors', 'Lift L-204 · AMC-0192', 'Preventive service', 'Next visit · 02 Nov', 'NP', 'Nadeesha P.', 'sch', 'Scheduled'],
  ['Metro Pharmacy', 'Cold room CR-12 · AMC-0188', 'Compressor replacement', 'Spare part issued', 'RK', 'Ruwan K.', 'prog', 'On site'],
  ['Blue Wave Hotel', 'Generator G-3', 'Warranty repair', 'Warranty billing ready', 'TM', 'Thilina M.', 'war', 'Warranty'],
  ['Island Books', 'Printer fleet · AMC-0175', 'Quarterly service', 'Overdue · 2 days', 'AS', 'Amal S.', 'ovr', 'Overdue'],
]
const steps = [['Client details'], ['Line items'], ['Taxes & terms'], ['Send & track']]
const lines = [
  ['Premium service plan', '×1', '$4,200'],
  ['POS terminal bundle', '×2', '$2,600'],
  ['Onboarding & training', '×1', '$620'],
]
const kanban = [
  { t: 'Leads', n: 24, c: '#94a3b8', cards: [['Lanka Traders', 'Inquiry via website', '$6,400', 'Medium'], ['Blue Wave Hotel', 'Facebook lead ad', '$12,900', 'High'], ['Ceylon Auto', 'WhatsApp inquiry', '$3,200', 'Low']] },
  { t: 'Quoted', n: 18, c: '#f59e0b', cards: [['Metro Pharmacy', 'QT-2051 · viewed', '$8,750', 'High'], ['Green Leaf Café', 'Follow-up overdue · 3 d', '$2,980', 'Overdue'], ['Pearl Retail', 'QT-2047 · viewed', '$5,300', 'Medium']] },
  { t: 'Approved', n: 11, c: '#f2540c', cards: [['Apex Motors', 'QT-2048 · approved', '$7,420', 'High'], ['Sunrise Mart', 'QT-2044 · approved', '$4,100', 'Medium'], ['Silver Coast', 'QT-2042 · approved', '$6,050', 'Low']] },
  { t: 'Paid', n: 9, c: '#10b981', cards: [['Island Books', 'INV-3380 · paid', '$3,640', 'Low'], ['Coral Dental', 'INV-3377 · paid', '$9,210', 'High'], ['Zen Studio', 'INV-3370 · paid', '$2,480', 'Low']] },
]
const calls = [
  ['DP', 'Daniel Perera', '755 322 689', 'Missed', '8001', '0:56', '2026-10-21 08:49'],
  ['KP', 'Kasun Perera', '770 629 341', 'Answered', '1032', '1:40', '2026-10-21 08:12'],
  ['YA', 'Yasasi Alwis', '947 039 708', 'Outbound', '1001', '4:05', '2026-10-20 16:39'],
  ['NF', 'Nimali Fernando', '771 880 214', 'Answered', '1008', '2:31', '2026-10-20 15:02'],
  ['AI', 'Reminder call', 'Vodia AI voice agent', 'Vodia', '1001', '1:12', '2026-10-20 11:27'],
]

/* Preview geometry. The scene is authored at SW × SH (the 4 strips of the cards behind + one 480px window)
   and scaled uniformly, so proportions never change. */
const SW = 960 + 56 // window + beige frame
const STACK = 100 // 5 strips × 20px of the cards behind the front one
const SH = STACK + 380

const rootEl = ref(null)
const stageEl = ref(null)
const capW = ref(0) // caption is exactly as wide as the stacked window above it
const fitEl = ref(null)
const active = ref(0)
const prev = ref(-1)
const order = ref([0, 1, 2, 3, 4, 5]) // front → back
const paused = ref(false)
const revealed = ref(false)
const scale = ref(1)
const fitH = ref(0)
const motion = ref(true)
const cur = computed(() => features[active.value])

let ro, io, raf

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
/* Scale the full preview to its available width; let the page scroll to show its full height. */
function fit() {
  const stage = stageEl.value
  const box = fitEl.value
  if (!stage || !box) return
  const k = Math.min(0.86, stage.clientWidth / SW) || 1
  scale.value = +k.toFixed(3)
  capW.value = Math.round(SW * k)
  fitH.value = Math.round(SH * k)
}
function queueFit() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(fit)
}

onMounted(() => {
  motion.value = !(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  fit()
  ro = new ResizeObserver(queueFit) // width changes and caption height changes (each tab has different copy)
  ro.observe(rootEl.value)
  window.addEventListener('resize', queueFit) // viewport height changes do not resize the section itself
  window.visualViewport?.addEventListener('resize', queueFit)
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
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', queueFit)
  window.visualViewport?.removeEventListener('resize', queueFit)
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
  width: calc(100% - 2 * clamp(8px, 1.6vw, 24px));
  max-width: 1680px;
  margin: clamp(32px, 5vw, 64px) auto clamp(48px, 7vw, 96px);
  padding: clamp(18px, 3vh, 40px) clamp(14px, 4vw, 64px) clamp(64px, 6vw, 84px);
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: clamp(22px, 2.6vw, 36px);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.16), 0 1px 0 #fff inset;
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
  padding-bottom: 0.4em;
  padding-top: 0.8em;
  color: #0f172a;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(46px, 3.5vw, 104px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.06em;
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
  margin: clamp(6px, 1.2vh, 12px) auto 0;
  max-width: 600px;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: var(--ink);
}

/* pills */
.fs-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: clamp(12px, 2.2vh, 20px) auto 0;
}
.fs-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid #f0e3d8;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.85);
  color: #1f2937;
  font: 600 13.5px/1.2 'Poppins', system-ui, sans-serif;
  white-space: nowrap;
  cursor: pointer;
  overflow: hidden;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}
.fs-tab .ti {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #fde6d8;
  transition: background 0.3s;
}
.fs-tab .ti svg {
  width: 15px;
  height: 15px;
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
.fs-tab:focus-visible {
  outline: 2px solid var(--o);
  outline-offset: 3px;
}

/* ================= stage ================= */
.fs-show {
  margin-top: clamp(8px, 1.4vh, 14px);
}
.fs-stage {
  position: relative;
  max-width: 1040px;
  margin: 0 auto;
  overflow: hidden;
  isolation: isolate;
}
.fs-fit {
  position: relative;
  overflow: hidden;
  height: 580px;
}
.fs-scene {
  position: absolute;
  left: 50%;
  top: 0;
  width: 1016px; /* 960 + frame */
  max-width: none;
  flex: none;
  height: 580px; /* = STACK + window, see the script */
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
  top: 100px;
  left: 0;
  right: 0;
  height: 480px;
  padding: 10px 10px 0;
  border-radius: 26px 26px 0 0;
  background: linear-gradient(180deg, #fde8da, var(--frame));
  border-top: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 -10px 24px -16px rgba(150, 70, 30, 0.35);
  z-index: calc(10 - var(--d));
  transform-origin: 50% 0;
  transform: translateY(calc(var(--d) * -20px)) scale(calc(1 - var(--d) * 0.03));
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
  inset: 10px 10px 0;
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
/* staggered row entrance */
.sc .wa-chat, .sc .wa-msg, .sc .tile, .sc .tr, .sc .stp, .sc .ln, .sc .dl, .sc .flow span {
  opacity: 0;
  translate: 0 10px;
}
.sc.on .wa-chat, .sc.on .wa-msg, .sc.on .tile, .sc.on .tr, .sc.on .stp, .sc.on .ln, .sc.on .dl, .sc.on .flow span {
  opacity: 1;
  translate: 0 0;
  transition: opacity 0.4s ease, translate 0.55s var(--ease);
  transition-delay: calc(0.35s + var(--n, 0) * 0.08s);
}

/* shared tiles + table */
.tiles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.tiles .tile {
  display: grid;
  place-items: stretch;
  gap: 3px;
  height: auto;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
}
.tiles .tile b {
  font-size: 22px;
  font-weight: 500;
  line-height: 1.15;
}
.tiles .tile em {
  position: static;
  width: auto;
  height: auto;
  border: 0;
  border-radius: 0;
  background: none;
  transform: none;
  animation: none;
  display: block;
  font-style: normal;
  font-size: 11.5px;
  color: var(--mute);
}
.tiles .tile em.up {
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
  padding: 10px 12px;
  border: 1px solid #ffe0cf;
  border-radius: 12px;
  background: #fff7f2;
  font-size: 10.5px;
  color: var(--ink);
}
.qt .bill small {
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--o);
}
.qt .bill b {
  font-size: 12px;
  font-weight: 500;
  color: var(--navy);
}
.qt .stp b {
  display: block;
  font-size: 13px;
  font-weight: 500;
}
.qt .stp.cur b {
  color: var(--o);
}
.stp.done b::after {
  content: ' ✓';
  color: #15803d;
}
.doc {
  padding: 16px;
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
.qt .dh .nm b {
  font-size: 14px;
}
.stt {
  padding: 3px 10px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #15803d;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.ln {
  display: grid;
  grid-template-columns: 1fr auto 70px;
  gap: 12px;
  margin-top: 8px;
  padding: 9px 12px;
  border-radius: 10px;
  background: #faf7f4;
  font-size: 11.5px;
  color: var(--ink);
}
.qt .ln b {
  text-align: right;
  font-size: 12px;
  color: var(--navy);
  font-weight: 600;
}
.tot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 4px 10px;
  font-size: 12px;
  color: var(--ink);
}
.qt .tot b {
  font-size: 20px;
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
  height: 34px;
  padding: 0 16px;
  border-radius: 10px;
  background: var(--navy);
  color: #fff;
  font-size: 11.5px;
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
  font-size: 11px;
  font-weight: 500;
}
.flow i {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
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
.pr.High, .pr.Overdue { background: #fee4e2; color: #b42318; }
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
.cp.Vodia { background: #efe9ff; color: #6d28d9; }
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

/* 1 · lead inbox */
.tbl.ld .th, .tbl.ld .tr { grid-template-columns: 1.8fr 0.9fr 0.9fr 1.1fr; }
.tbl.ld .tr.fresh { background: linear-gradient(90deg, #fff6f0, #fff); }
.ld-src { display: inline-block; padding: 3px 10px; border-radius: 7px; font-size: 11px; font-style: normal; font-weight: 600; }
.ld-src.Website { background: #e3edff; color: #1d4ed8; }
.ld-src.Facebook { background: #e7ecfb; color: #3b5bdb; }
.ld-src.WhatsApp { background: #e8f8ee; color: #15803d; }
.ld-mrg { margin-left: 6px; padding: 2px 8px; border-radius: 999px; background: #fff1e8; color: #c2410c; font-size: 10px; font-style: normal; font-weight: 600; white-space: nowrap; }
.ld-asg { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--navy); }
.ld-asg i { display: grid; place-items: center; flex: none; width: 24px; height: 24px; border-radius: 50%; background: var(--og); color: #fff; font: 600 9px/1 'Poppins', sans-serif; font-style: normal; }

/* 4 · WhatsApp inbox */
.wa { display: grid; grid-template-columns: 290px 1fr; gap: 20px; }
.wa-list { display: grid; gap: 4px; align-content: start; }
.wa-chat { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid transparent; border-radius: 12px; }
.wa-chat.sel { border-color: #ffd2b8; background: linear-gradient(90deg, #fff6f0, #fff); }
.wa-chat .nm { flex: 1; }
.wa-chat .nm small { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 150px; }
.wa-meta { display: grid; justify-items: end; gap: 4px; }
.wa-meta em { min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: #16a34a; color: #fff; font: 600 10px/18px 'Poppins', sans-serif; font-style: normal; text-align: center; }
.wa-conv { display: grid; gap: 10px; align-content: start; padding: 12px; border: 1px solid var(--line); border-radius: 14px; background: #fcfaf8; }
.wa-head { display: flex; align-items: center; gap: 10px; }
.wa-head .nm { flex: 1; }
.wa-asg { padding: 4px 10px; border-radius: 999px; background: #fff1e8; color: #c2410c; font-size: 11px; font-weight: 600; }
.wa-msgs { display: grid; gap: 8px; }
.wa-msg { max-width: 78%; padding: 8px 12px; border-radius: 12px; font-size: 12px; line-height: 1.4; }
.wa-msg small { display: block; margin-top: 2px; font-size: 10px; color: var(--mute); text-align: right; }
.wa-msg.in { justify-self: start; border: 1px solid var(--line); border-top-left-radius: 4px; background: #fff; }
.wa-msg.out { justify-self: end; border-top-right-radius: 4px; background: #e1f7d5; color: #14532d; }
.wa-msg.tpl { justify-self: end; display: grid; gap: 2px; border: 1px dashed #ffc9a8; background: #fff7f2; }
.wa-msg.tpl::before { content: 'APPROVED TEMPLATE'; font-size: 9px; font-weight: 600; letter-spacing: 0.08em; color: var(--o); }
.wa-msg.note { justify-self: center; max-width: none; padding: 4px 12px; border-radius: 999px; background: #f1f5f9; color: var(--ink); font-size: 11px; }
.wa-tools { display: flex; gap: 8px; }
.wa-tools span { padding: 5px 10px; border: 1px solid #ebe5e0; border-radius: 8px; background: #fff; font-size: 11px; color: var(--ink); }

/* 6 · service & AMC */
.tbl.am .th, .tbl.am .tr { grid-template-columns: 1.5fr 1.4fr 1.1fr 0.9fr; }
.am-st { display: inline-block; padding: 3px 10px; border-radius: 7px; font-size: 11px; font-style: normal; font-weight: 600; }
.am-st.sch { background: #e3edff; color: #1d4ed8; }
.am-st.prog { background: #fff3d6; color: #b45309; }
.am-st.war { background: #e8f8ee; color: #15803d; }
.am-st.ovr { background: #fee4e2; color: #b42318; }

/* ================= caption ================= */
/* description: plain text under the window, exactly as wide as the window above it */
.fs-cap {
  position: relative;
  z-index: 2;
  max-width: 1040px; /* replaced at runtime by the width of the stacked window */
  margin: 0 auto;
  padding: clamp(16px, 2.4vh, 26px) 0 0;
}
.fs-cap-in {
  position: relative;
}
.fs-cap-swap {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  grid-template-areas: 'a b' 'a c';
  gap: clamp(6px, 1.1vh, 12px) clamp(20px, 3vw, 40px);
}
/* same easing and timing as the screen that comes to the front, so text and window change together */
.fs-swap-enter-active {
  transition: opacity 0.7s ease 0.12s, transform 0.95s cubic-bezier(0.16, 0.84, 0.3, 1), filter 0.8s ease 0.06s;
}
.fs-swap-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 0.84, 0.3, 1), filter 0.45s ease;
}
.fs-swap-enter-from { opacity: 0; transform: translateY(16px); filter: blur(3px); }
.fs-swap-leave-to { opacity: 0; transform: translateY(-8px); filter: blur(5px); }
.cp1 { grid-area: a; }
.cp2 { grid-area: b; align-self: end; }
.cp3 { grid-area: c; align-self: start; }
.cp1 h3 {
  margin: 0;
  max-width: 560px;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(18px, min(1.9vw, 3.2vh), 26px);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.05em;
}
.cp1 p {
  margin: 4px 0 0;
  max-width: 580px;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(13px, 1.1vw, 15px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.cp2 {
  display: grid;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cp2 li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 12.5px;
  line-height: 1.45;
  color: #334155;
}
.cp2 i {
  display: grid;
  place-items: center;
  flex: none;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  border-radius: 50%;
  background: var(--og);
}
.cp2 svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cp3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.cp3 div {
  padding: 7px 10px;
  border: 1px solid #f3e6dc;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.8);
}
.cp3 strong {
  display: block;
  color: var(--o);
  font-size: clamp(14px, 1.2vw, 17px);
  font-weight: 500;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
.cp3 span {
  font-size: 11px;
  color: var(--ink);
}

/* motion */
@keyframes fs-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
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
  .fs-cap-swap {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'a' 'b' 'c';
  }
  .cp2 { align-self: start; }
  .fs-tab {
    font-size: 12.5px;
    padding-right: 11px;
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