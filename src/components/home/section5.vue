<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

defineOptions({ name: 'HomeSection5' })

/* ---------- Data ---------- */
const engines = [
  { id: 'invoice', name: 'Invoices & Credit Notes', tag: 'Finance', accent: '#ff7a59', icon: 'M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2-1.5zM9 8h6M9 12h6', title: 'Send the invoice. Settle the credit. Done.', text: 'Create compliant tax invoices, apply customer credit balances, process adjustments and export branded PDFs.', hint: 'Toggle VAT and credit below' },
  { id: 'chat', name: 'WhatsApp CRM Inbox', tag: 'Messaging', accent: '#2fbf8f', icon: 'M4 5h16v11H9l-5 4z', title: 'One inbox for every WhatsApp conversation.', text: 'Two-way chats with bot triage, saved replies, media attachments and official templates, shared by the whole team.', hint: 'Tap a saved reply' },
  { id: 'cti', name: 'Incoming Call Popup', tag: 'Customer care', accent: '#4c8dff', icon: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z', title: 'Know who is calling before you answer.', text: 'Recognise the caller and see their contact history, customer details and open tickets while the phone is still ringing.', hint: 'Answer the call' },
  { id: 'estimate', name: 'Estimates Engine', tag: 'Sales', accent: '#9b7bff', icon: 'M5 20V10M12 20V4M19 20v-7', title: 'Rough numbers today. Polished proposal tomorrow.', text: 'Prepare preliminary costs and multi-tier estimates with version history, separate from final sales quotations.', hint: 'Switch tier and version' },
  { id: 'stock', name: 'Multi-Warehouse Stock', tag: 'Inventory', accent: '#f2a93b', icon: 'M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8', title: 'Every shelf, in every branch, at a glance.', text: 'Track stock across warehouses, set reorder points and keep every branch transfer recorded.', hint: 'Move stock to the low branch' },
  { id: 'routing', name: 'Inquiry Routing Rules', tag: 'Automation', accent: '#21b4b8', icon: 'M4 6h5a4 4 0 014 4v8m0 0l-3-3m3 3l3-3', title: 'Every enquiry lands with the right person.', text: 'Share incoming leads across your team by round-robin or territory rules, with no manual sorting.', hint: 'Add enquiries and switch rule' },
  { id: 'roles', name: 'Staff Roles & Permissions', tag: 'Access control', accent: '#5b9bff', icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', title: 'Give each role exactly the access it needs.', text: 'Set granular rights to view, edit and export, per role and per branch.', hint: 'Click any cell to change it' },
  { id: 'partner', name: 'Reseller / Partner Network', tag: 'Partners', accent: '#c06bd8', icon: 'M12 5a2 2 0 100 .01M5 19a2 2 0 100 .01M19 19a2 2 0 100 .01M12 7v5M12 12l-6 5M12 12l6 5', title: 'Grow through partners without losing track.', text: 'Run white-label resellers with tiered wholesale pricing, tenant provisioning and commission tracking.', hint: 'Drag the monthly sales' },
  { id: 'facebook', name: 'Facebook CRM Integration', tag: 'Social leads', accent: '#4a7cf0', icon: 'M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z', title: 'Turn Facebook enquiries into follow-ups.', text: 'Bring social enquiries into your CRM so your team can organise leads, assign owners and track next steps.', hint: 'Tap a lead to move it forward' },
]

const AUTOPLAY_MS = 9000
const active = ref(0)
const progress = ref(0)
const playing = ref(true)
const touched = ref(false)
const selected = computed(() => engines[active.value])
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const fmt = (n) => Math.round(n).toLocaleString('en-LK')
const pad = (n) => String(n).padStart(2, '0')

function useTween(source, ms = 550) {
  const v = ref(source.value)
  watch(source, (to) => {
    const from = v.value, t0 = performance.now()
    const step = (t) => {
      const k = Math.min((t - t0) / ms, 1)
      v.value = from + (to - from) * (1 - Math.pow(1 - k, 3))
      if (k < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
  return v
}

/* ---------- Demo state ---------- */
// Invoice
const items = [{ n: 'Site survey', q: 1, p: 12000 }, { n: 'Install kit', q: 2, p: 8500 }, { n: 'Annual support', q: 1, p: 24000 }]
const inv = reactive({ vat: true, credit: false, exported: false })
const subtotal = items.reduce((s, i) => s + i.q * i.p, 0)
const invTotal = computed(() => subtotal * (inv.vat ? 1.18 : 1) - (inv.credit ? 5000 : 0))
const invShown = useTween(invTotal)
let exportTimer
function exportPdf() { inv.exported = true; clearTimeout(exportTimer); exportTimer = setTimeout(() => (inv.exported = false), 2400) }

// Chat
const script = [
  { f: 'in', t: 'Hi! Do you install solar panels in Kandy?' },
  { f: 'bot', t: 'Yes, we do. Connecting you to a sales rep.' },
  { f: 'out', t: 'Hi, Nimali here. I can visit on Thursday.' },
]
const chatCount = ref(0)
const typing = ref(false)
const extra = ref([])
const replies = ['Sending the estimate now', 'Thursday 10 AM works', 'Sharing our brochure']
let chatTimers = []
function runChat() {
  chatTimers.forEach(clearTimeout); chatTimers = []
  chatCount.value = 0; extra.value = []; typing.value = false
  script.forEach((_, i) => {
    chatTimers.push(setTimeout(() => (typing.value = true), 500 + i * 1300))
    chatTimers.push(setTimeout(() => { typing.value = false; chatCount.value = i + 1 }, 1100 + i * 1300))
  })
}
const chatMsgs = computed(() => [...script.slice(0, chatCount.value), ...extra.value])
const sendReply = (t) => { if (chatCount.value >= script.length) extra.value.push({ f: 'out', t }) }

// CTI
const call = ref('ringing')

// Estimates
const tiers = [{ n: 'Essential', p: 180000 }, { n: 'Standard', p: 265000 }, { n: 'Premium', p: 390000 }]
const est = reactive({ tier: 1, ver: 1 })
const verDiscount = [0, 0.04, 0.07]
const estPrice = computed(() => tiers[est.tier].p * (1 - verDiscount[est.ver]))
const estShown = useTween(estPrice)

// Stock
const stock = reactive([{ n: 'Colombo', s: 46 }, { n: 'Kandy', s: 9 }, { n: 'Galle', s: 27 }])
const REORDER = 15
const lastMove = ref('')
function transfer() {
  const hi = stock.reduce((a, b) => (b.s > a.s ? b : a)), lo = stock.reduce((a, b) => (b.s < a.s ? b : a))
  if (hi === lo || hi.s < 10) return
  hi.s -= 10; lo.s += 10; lastMove.value = `10 units: ${hi.n} to ${lo.n}`
}
const resetStock = () => { stock[0].s = 46; stock[1].s = 9; stock[2].s = 27; lastMove.value = '' }

// Routing
const reps = ['Nimali', 'Kasun', 'Ishara']
const areas = ['Colombo', 'Kandy', 'Galle']
const territory = { Colombo: 'Kasun', Kandy: 'Nimali', Galle: 'Ishara' }
const route = reactive({ mode: 'rr', n: 0, list: [] })
function addLead() {
  const area = areas[Math.floor(Math.random() * areas.length)]
  const owner = route.mode === 'rr' ? reps[route.n % reps.length] : territory[area]
  route.n++
  route.list = [{ id: route.n, area, owner }, ...route.list].slice(0, 4)
}
const repCount = (r) => route.list.filter((l) => l.owner === r).length

// Roles
const roles = ['Admin', 'Sales', 'Support', 'Branch lead']
const perms = ['View', 'Edit', 'Export']
const matrix = reactive([[1, 1, 1], [1, 1, 0], [1, 0, 0], [1, 1, 0]])
const flip = (r, c) => { if (r > 0) matrix[r][c] = matrix[r][c] ? 0 : 1 }

// Partner
const sales = ref(900000)
const partnerTier = computed(() => (sales.value >= 1400000 ? { n: 'Gold', off: 25, c: 12 } : sales.value >= 800000 ? { n: 'Silver', off: 18, c: 8 } : { n: 'Bronze', off: 10, c: 5 }))
const commission = computed(() => (sales.value * partnerTier.value.c) / 100)
const commShown = useTween(commission)

// Facebook
const stages = ['New', 'Contacted', 'Follow-up']
const leads = reactive([{ n: 'Dilshan P.', m: 'Price for 3 units?', s: 0 }, { n: 'Sachini R.', m: 'Is delivery available?', s: 1 }, { n: 'Mahesh W.', m: 'Can I book a demo?', s: 0 }])
const advance = (l) => { l.s = (l.s + 1) % stages.length }

/* ---------- Navigation + autoplay ---------- */
function go(i) { active.value = (i + engines.length) % engines.length }
function onKey(e) {
  if (['ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); go(active.value + 1); touched.value = true }
  if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); go(active.value - 1); touched.value = true }
}
const pick = (i) => { go(i); touched.value = true }

watch(active, (i) => {
  progress.value = 0
  call.value = 'ringing'; inv.exported = false
  if (engines[i].id === 'chat') runChat()
}, { immediate: true })

let tick
onMounted(() => {
  if (reduced) { playing.value = false; return }
  tick = setInterval(() => {
    if (!playing.value || touched.value) return
    progress.value += (100 / AUTOPLAY_MS) * 100
    if (progress.value >= 100) go(active.value + 1)
  }, 100)
})
onBeforeUnmount(() => { clearInterval(tick); chatTimers.forEach(clearTimeout); clearTimeout(exportTimer) })
</script>

<template>
  <section id="workflow" class="eng" aria-labelledby="eng-h">
    <div class="eng-wrap">
      <header class="eng-head">
        <h2 id="eng-h">Engineered for your enterprise.<span> Built in.</span></h2>
        <p class="eng-sub">Beyond basic POS & CRM — discover the specialized controllers and automated engines powering your entire business.</p>
      </header>

      <div class="eng-grid">
        <!-- Tabs -->
        <nav class="tabs" role="tablist" aria-label="Business engines" aria-orientation="vertical" @keydown="onKey">
          <button
            v-for="(e, i) in engines" :key="e.id" role="tab" type="button"
            :aria-selected="i === active" :tabindex="i === active ? 0 : -1"
            :class="['tab', { on: i === active }]"
            @click="pick(i)"
          >
            <span class="tab-no">{{ pad(i + 1) }}</span>
            <span class="tab-tx"><small>{{ e.tag }}</small><b>{{ e.name }}</b></span>
            <span v-if="i === active && !touched" class="tab-bar" aria-hidden="true"><i :style="{ width: progress + '%' }"></i></span>
          </button>
          <button type="button" class="play" @click="touched ? ((touched = false), (playing = true)) : (playing = !playing)">
            {{ touched || !playing ? 'Resume tour' : 'Pause tour' }}
          </button>
        </nav>

        <!-- Stage -->
        <Transition name="swap" mode="out-in">
          <article :key="active" class="stage" role="tabpanel" @pointerdown="touched = true">
            <div class="stage-copy">
              <p class="stage-no"><b>{{ pad(active + 1) }}</b> / {{ pad(engines.length) }}<em>{{ selected.tag }}</em></p>
              <h3>{{ selected.title }}</h3>
              <p class="stage-text">{{ selected.text }}</p>
              <p class="stage-hint"><span></span>{{ selected.hint }}</p>
              <button type="button" class="next" @click="pick(active + 1)">Next: {{ engines[(active + 1) % engines.length].name }} →</button>
            </div>

            <div class="stage-view">
            <div class="win" aria-live="polite">
              <div class="win-bar"><i></i><i></i><i></i><span>{{ selected.name }}</span></div>

              <!-- 1 Invoice -->
              <div v-if="selected.id === 'invoice'" class="win-body">
                <table class="inv">
                  <tr v-for="i in items" :key="i.n"><td>{{ i.n }}</td><td>×{{ i.q }}</td><td>{{ fmt(i.q * i.p) }}</td></tr>
                </table>
                <div class="toggles">
                  <label><input type="checkbox" v-model="inv.vat" /> VAT 18%</label>
                  <label><input type="checkbox" v-model="inv.credit" /> Apply credit note (5,000)</label>
                </div>
                <div class="total"><span>Total due</span><b>LKR {{ fmt(invShown) }}</b></div>
                <button type="button" class="cta" @click="exportPdf">{{ inv.exported ? 'PDF ready ✓' : 'Export branded PDF' }}</button>
              </div>

              <!-- 2 Chat -->
              <div v-else-if="selected.id === 'chat'" class="win-body chat">
                <div class="msgs">
                  <TransitionGroup name="pop">
                    <p v-for="(m, i) in chatMsgs" :key="i" :class="['bub', m.f]"><em v-if="m.f === 'bot'">Bot</em>{{ m.t }}</p>
                  </TransitionGroup>
                  <p v-if="typing" class="bub in dots"><span></span><span></span><span></span></p>
                </div>
                <div class="chips"><button v-for="r in replies" :key="r" type="button" @click="sendReply(r)">{{ r }}</button></div>
              </div>

              <!-- 3 CTI -->
              <div v-else-if="selected.id === 'cti'" class="win-body cti">
                <div :class="['caller', call]">
                  <div class="avatar"><span></span>RP</div>
                  <div><b>Ruwan Perera</b><small>+94 77 555 0142</small></div>
                  <span class="badge">{{ call === 'ringing' ? 'Ringing…' : 'On call' }}</span>
                </div>
                <Transition name="pop"><ul v-if="call === 'answered'" class="facts">
                  <li><small>Customer since</small><b>2023</b></li>
                  <li><small>Last order</small><b>Invoice #1048</b></li>
                  <li><small>Open tickets</small><b>2</b></li>
                </ul></Transition>
                <p v-if="call === 'ringing'" class="muted">Contact matched. Details appear when you answer.</p>
                <button type="button" class="cta" @click="call = call === 'ringing' ? 'answered' : 'ringing'">{{ call === 'ringing' ? 'Answer call' : 'Reset call' }}</button>
              </div>

              <!-- 4 Estimates -->
              <div v-else-if="selected.id === 'estimate'" class="win-body">
                <div class="seg">
                  <button v-for="(t, i) in tiers" :key="t.n" type="button" :class="{ on: est.tier === i }" @click="est.tier = i">{{ t.n }}</button>
                </div>
                <div class="total"><span>Estimate</span><b>LKR {{ fmt(estShown) }}</b></div>
                <div class="seg small">
                  <button v-for="(v, i) in verDiscount" :key="i" type="button" :class="{ on: est.ver === i }" @click="est.ver = i">v{{ i + 1 }}</button>
                </div>
                <p class="muted">{{ est.ver === 0 ? 'First draft saved.' : `Revision ${est.ver + 1}: ${verDiscount[est.ver] * 100}% adjustment, previous versions kept.` }}</p>
              </div>

              <!-- 5 Stock -->
              <div v-else-if="selected.id === 'stock'" class="win-body">
                <div v-for="w in stock" :key="w.n" class="bar-row">
                  <span>{{ w.n }}</span>
                  <div class="bar"><i :style="{ width: Math.min(w.s / 60 * 100, 100) + '%' }" :class="{ low: w.s < REORDER }"></i><u :style="{ left: REORDER / 60 * 100 + '%' }"></u></div>
                  <b :class="{ low: w.s < REORDER }">{{ w.s }}</b>
                </div>
                <p class="muted">Line marks the reorder point ({{ REORDER }}). {{ stock.some(w => w.s < REORDER) ? 'Kandy is flagged for reorder.' : 'All branches healthy.' }}</p>
                <div class="row"><button type="button" class="cta" @click="transfer">Transfer 10 units</button><button type="button" class="ghost" @click="resetStock">Reset</button></div>
                <p v-if="lastMove" class="muted">Recorded: {{ lastMove }}</p>
              </div>

              <!-- 6 Routing -->
              <div v-else-if="selected.id === 'routing'" class="win-body">
                <div class="seg">
                  <button type="button" :class="{ on: route.mode === 'rr' }" @click="route.mode = 'rr'">Round-robin</button>
                  <button type="button" :class="{ on: route.mode === 'terr' }" @click="route.mode = 'terr'">Territory</button>
                </div>
                <div class="reps"><div v-for="r in reps" :key="r"><b>{{ repCount(r) }}</b><small>{{ r }}</small></div></div>
                <TransitionGroup name="pop" tag="ul" class="feed">
                  <li v-for="l in route.list" :key="l.id">Enquiry from {{ l.area }} <span>assigned to {{ l.owner }}</span></li>
                </TransitionGroup>
                <button type="button" class="cta" @click="addLead">Add new enquiry</button>
              </div>

              <!-- 7 Roles -->
              <div v-else-if="selected.id === 'roles'" class="win-body">
                <table class="matrix">
                  <thead><tr><th></th><th v-for="p in perms" :key="p">{{ p }}</th></tr></thead>
                  <tbody><tr v-for="(r, ri) in roles" :key="r"><th>{{ r }}</th>
                    <td v-for="(p, ci) in perms" :key="p"><button type="button" :class="['cell', { yes: matrix[ri][ci] }]" :disabled="ri === 0" :aria-label="`${r} ${p}: ${matrix[ri][ci] ? 'allowed' : 'blocked'}`" @click="flip(ri, ci)">{{ matrix[ri][ci] ? '✓' : '–' }}</button></td>
                  </tr></tbody>
                </table>
                <p class="muted">Admin always keeps full access.</p>
              </div>

              <!-- 8 Partner -->
              <div v-else-if="selected.id === 'partner'" class="win-body">
                <label class="range"><span>Monthly partner sales</span><b>LKR {{ fmt(sales) }}</b>
                  <input type="range" min="200000" max="2000000" step="50000" v-model.number="sales" />
                </label>
                <div class="reps"><div><b>{{ partnerTier.n }}</b><small>tier</small></div><div><b>{{ partnerTier.off }}%</b><small>wholesale discount</small></div><div><b>{{ partnerTier.c }}%</b><small>commission</small></div></div>
                <div class="total"><span>Commission this month</span><b>LKR {{ fmt(commShown) }}</b></div>
              </div>

              <!-- 9 Facebook -->
              <div v-else class="win-body">
                <ul class="leads">
                  <li v-for="l in leads" :key="l.n">
                    <button type="button" @click="advance(l)">
                      <span class="avatar sm">{{ l.n[0] }}</span>
                      <span class="lead-tx"><b>{{ l.n }}</b><small>{{ l.m }}</small></span>
                      <span :class="['stage-pill', 's' + l.s]">{{ stages[l.s] }}</span>
                    </button>
                  </li>
                </ul>
                <p class="muted">Each tap moves the lead to the next step in your follow-up flow.</p>
              </div>
            </div>
            </div>
          </article>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
</style>

<style scoped>
/* CHANGED: --ink is now a softer charcoal (was #17191d) */
.eng { --a: #f0642b; --ink: #2b2f38; --txt: #17191d; --mut: #6b6f78; --line: #e4e0d9; --fw: 500; position: relative; overflow: hidden; padding: clamp(64px, 9vw, 120px) clamp(16px, 5vw, 72px); color: var(--txt); background: #faf8f5; font-family: Inter, "Segoe UI", system-ui, sans-serif; }
.eng *, .eng *::before, .eng *::after { box-sizing: border-box; }
.eng button { font: inherit; color: inherit; cursor: pointer; }
.eng button:focus-visible, .eng input:focus-visible { outline: 2px solid var(--a); outline-offset: 3px; }
.eng-wrap { width: min(1280px, 100%); margin: auto; }

/* Heading */
.eng-head { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 22px 60px; align-items: end; margin-bottom: clamp(32px, 4vw, 64px); }

.eng-head h2 { margin: 0; font-family: Inter, sans-serif; font-size: clamp(46px, 3.5vw, 104px); color: #0f172a; font-weight: 500 ; line-height: 1.12; letter-spacing: -.06em; }
.eng-head h2 span { background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.eng-sub { justify-self: end; max-width: 380px; margin: 0; color: #475569; font-family: 'Inter Display', Inter, system-ui, sans-serif; font-size: clamp(15px, 1vw, 18px); font-weight: 500; line-height: 1.45; letter-spacing: -0.02em; }

/* Layout */
.eng-grid { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: clamp(20px, 3vw, 48px); align-items: start; }

/* Tabs: numbered list */
.tabs { display: grid; border-top: 1px solid var(--line); }
.tab { position: relative; display: grid; grid-template-columns: 38px minmax(0, 1fr); align-items: center; padding: 15px 0; border: 0; border-bottom: 1px solid var(--line); background: none; color: #9a9ea7; text-align: left; transition: color .2s, padding .25s ease; }
.tab::before { content: ''; position: absolute; left: 0; top: 14px; bottom: 14px; width: 3px; background: var(--a); transform: scaleY(0); transition: transform .25s ease; }
.tab:hover { color: var(--txt); }
.tab.on { padding-left: 16px; color: var(--txt); }
.tab.on::before { transform: scaleY(1); }
.tab-no { font: 600 12px Poppins, sans-serif; letter-spacing: .06em; }
.tab.on .tab-no { color: var(--a); }
.tab-tx small, .tab-tx b { display: block; }
.tab-tx small { margin-bottom: 3px; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; }
.tab-tx b { font: 500 15px/1.3 Poppins, sans-serif; }
.tab-bar { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: transparent; }
.tab-bar i { display: block; height: 100%; background: var(--a); transition: width .1s linear; }
.play { margin-top: 18px; padding: 0; border: 0; background: none; color: var(--mut); font: 500 13px Poppins, sans-serif; text-align: left; text-decoration: underline; text-underline-offset: 4px; }
.play:hover { color: var(--a); }

/* Stage: soft charcoal copy panel + soft peach view */
.stage { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); min-height: 620px; overflow: hidden; border-radius: 28px; color: #fff; background: var(--ink); box-shadow: 0 30px 70px #17191d26; }
.stage-copy { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: clamp(26px, 3.2vw, 52px); }
.stage-no { display: flex; align-items: center; margin: 0 0 30px; color: #8b8f98; font: 500 13px Poppins, sans-serif; letter-spacing: .08em; }
.stage-no b { margin-right: 6px; color: var(--a); font-weight: 600; }
.stage-no em { margin-left: 14px; padding: 4px 11px; border: 1px solid #4a4e57; border-radius: 99px; color: #c9ccd2; font-size: 11px; font-style: normal; letter-spacing: .08em; text-transform: uppercase; }
.stage-copy h3 { margin: 0 0 18px; font-family: Poppins, sans-serif; font-size: max(22px, 2.5vw); font-weight: var(--fw); line-height: 1.18; letter-spacing: -.025em; }
.stage-text { max-width: 380px; margin: 0; color: #b6bac2; font-size: 15px; line-height: 1.75; }
.stage-hint { display: flex; align-items: center; gap: 10px; margin: 30px 0 0; color: #fff; font: 500 13px Poppins, sans-serif; }
.stage-hint span { width: 8px; height: 8px; background: var(--a); }
.next { margin-top: 26px; padding: 0 0 5px; border: 0; border-bottom: 1px solid #5a5e67; background: none; color: #fff; font: 500 13px Poppins, sans-serif; text-align: left; transition: color .2s, border-color .2s; }
.next:hover { color: var(--a); border-color: var(--a); }

/* CHANGED: orange panel is now a soft peach (22% orange + white) */
.stage-view { display: grid; place-items: center; padding: clamp(22px, 3.2vw, 52px); background-color: color-mix(in srgb, var(--a) 22%, #fff); background-image: radial-gradient(color-mix(in srgb, var(--a) 35%, transparent) 1.2px, transparent 1.6px); background-size: 22px 22px; }

/* App window */
/* CHANGED: softer shadow instead of the hard black one */
.win { width: 100%; max-width: 520px; min-width: 0; overflow: hidden; border-radius: 14px; color: #1c2638; background: #f7f8fb; box-shadow: 9px 9px 0 color-mix(in srgb, var(--a) 45%, #fff); }
.win-bar { display: flex; align-items: center; gap: 6px; padding: 12px 14px; border-bottom: 1px solid #e4e8f0; background: #fff; }
.win-bar i { width: 10px; height: 10px; border-radius: 50%; background: #d8dde8; }
.win-bar span { margin-left: 10px; color: #6b778c; font-size: 12px; font-weight: 600; }
.win-body { display: grid; gap: 14px; min-height: 380px; padding: 20px; align-content: start; font-size: 14px; }
.win small { color: #7a869b; font-size: 12px; }
.muted { margin: 0; color: #7a869b; font-size: 13px; line-height: 1.5; }
.cta { padding: 12px 16px; border: 0; border-radius: 11px; color: #fff; background: var(--a); font-weight: 600; transition: filter .2s, transform .2s; }
.cta:hover { filter: brightness(1.08); transform: translateY(-1px); }
.ghost { padding: 12px 16px; border: 1px solid #d8dde8; border-radius: 11px; background: #fff; }
.row { display: flex; gap: 8px; }
.row .cta { flex: 1; }
.total { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 16px; border-radius: 13px; background: #fff; box-shadow: 0 0 0 1px #e4e8f0 inset; }
.total span { color: #6b778c; }
.total b { color: var(--a); font-size: clamp(22px, 2.6vw, 30px); font-variant-numeric: tabular-nums; letter-spacing: -.02em; }

.inv { width: 100%; border-collapse: collapse; }
.inv td { padding: 10px 4px; border-bottom: 1px solid #e8ebf2; }
.inv td:nth-child(2) { color: #7a869b; }
.inv td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
.toggles { display: grid; gap: 8px; }
.toggles label { display: flex; align-items: center; gap: 9px; cursor: pointer; }
.toggles input { width: 17px; height: 17px; accent-color: var(--a); }

.chat { grid-template-rows: 1fr auto; }
.msgs { display: flex; flex-direction: column; gap: 8px; min-height: 270px; }
.bub { max-width: 82%; margin: 0; padding: 10px 13px; border-radius: 14px; line-height: 1.45; }
.bub.in, .bub.bot { align-self: flex-start; border-bottom-left-radius: 4px; background: #fff; box-shadow: 0 0 0 1px #e4e8f0 inset; }
.bub.bot { background: #eaf8f2; }
.bub.out { align-self: flex-end; border-bottom-right-radius: 4px; color: #fff; background: var(--a); }
.bub em { display: block; margin-bottom: 2px; color: #2a9d77; font-size: 11px; font-style: normal; font-weight: 700; }
.dots { display: flex; gap: 4px; padding: 14px; }
.dots span { width: 6px; height: 6px; border-radius: 50%; background: #aab3c5; animation: bounce 1s infinite; }
.dots span:nth-child(2) { animation-delay: .15s; }
.dots span:nth-child(3) { animation-delay: .3s; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips button { padding: 7px 11px; border: 1px solid #d8dde8; border-radius: 99px; background: #fff; font-size: 12px; transition: border-color .2s; }
.chips button:hover { border-color: var(--a); }

.caller { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 14px; background: #fff; box-shadow: 0 0 0 1px #e4e8f0 inset; }
.caller.ringing { animation: ring 1.2s ease-in-out infinite; }
.caller b, .caller small { display: block; }
.badge { margin-left: auto; padding: 5px 10px; border-radius: 99px; color: var(--a); background: color-mix(in srgb, var(--a) 14%, white); font-size: 12px; font-weight: 600; }
.avatar { position: relative; display: grid; place-items: center; flex-shrink: 0; width: 46px; height: 46px; border-radius: 50%; color: #fff; background: var(--a); font-weight: 700; }
.avatar.sm { width: 34px; height: 34px; font-size: 13px; }
.avatar span { position: absolute; inset: -5px; border: 2px solid var(--a); border-radius: 50%; opacity: 0; animation: pulse-ring 1.4s ease-out infinite; }
.facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 0; padding: 0; list-style: none; }
.facts li { padding: 12px; border-radius: 12px; background: #fff; box-shadow: 0 0 0 1px #e4e8f0 inset; }
.facts small, .facts b { display: block; }
.facts b { margin-top: 4px; font-size: 13px; }

.seg { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 4px; padding: 4px; border-radius: 12px; background: #e9edf4; }
.seg button { padding: 10px 6px; border: 0; border-radius: 9px; background: none; font-size: 13px; font-weight: 600; transition: background .2s, color .2s; }
.seg button.on { color: #fff; background: var(--a); }
.seg.small { max-width: 220px; }

.bar-row { display: grid; grid-template-columns: 70px 1fr 30px; align-items: center; gap: 10px; }
.bar { position: relative; height: 12px; border-radius: 99px; background: #e4e8f0; }
.bar i { display: block; height: 100%; border-radius: 99px; background: var(--a); transition: width .5s cubic-bezier(.3, 1, .4, 1); }
.bar i.low, .bar-row b.low { background: #e5484d; color: #e5484d; }
.bar i.low { color: inherit; }
.bar u { position: absolute; top: -4px; bottom: -4px; width: 2px; background: #1c2638; }
.bar-row b { background: none !important; text-align: right; font-variant-numeric: tabular-nums; }

.reps { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 8px; }
.reps div { padding: 12px; border-radius: 12px; background: #fff; box-shadow: 0 0 0 1px #e4e8f0 inset; }
.reps b, .reps small { display: block; }
.reps b { font-size: 20px; }
.feed { display: grid; gap: 6px; min-height: 140px; margin: 0; padding: 0; list-style: none; align-content: start; }
.feed li { padding: 10px 12px; border-radius: 10px; background: #fff; box-shadow: 0 0 0 1px #e4e8f0 inset; font-size: 13px; }
.feed li span { color: var(--a); font-weight: 600; }

.matrix { width: 100%; border-collapse: collapse; text-align: center; }
.matrix th { padding: 9px 4px; font-size: 13px; font-weight: 600; }
.matrix tbody th { text-align: left; }
.matrix thead th { color: #7a869b; }
.cell { width: 38px; height: 34px; border: 1px solid #d8dde8; border-radius: 9px; color: #9aa4b6; background: #fff; transition: all .2s; }
.cell.yes { color: #fff; border-color: var(--a); background: var(--a); }
.cell:disabled { cursor: not-allowed; opacity: .6; }

.range { display: grid; grid-template-columns: 1fr auto; gap: 8px 10px; }
.range span { color: #6b778c; }
.range input { grid-column: 1 / -1; width: 100%; accent-color: var(--a); }

.leads { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.leads button { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px; border: 0; border-radius: 12px; background: #fff; box-shadow: 0 0 0 1px #e4e8f0 inset; text-align: left; transition: transform .2s, box-shadow .2s; }
.leads button:hover { transform: translateX(3px); box-shadow: 0 0 0 1px var(--a) inset; }
.lead-tx { min-width: 0; }
.lead-tx b, .lead-tx small { display: block; }
.stage-pill { margin-left: auto; padding: 5px 10px; border-radius: 99px; font-size: 12px; font-weight: 600; transition: all .25s; }
.s0 { color: #5a6a85; background: #e9edf4; }
.s1 { color: #1f7a5a; background: #dff4ea; }
.s2 { color: #fff; background: var(--a); }

/* Motion */
.swap-enter-active { transition: opacity .35s ease, transform .35s ease; }
.swap-leave-active { transition: opacity .15s ease; }
.swap-enter-from { opacity: 0; transform: translateY(10px); }
.swap-leave-to { opacity: 0; }
.pop-enter-active { transition: opacity .3s ease, transform .3s cubic-bezier(.3, 1.4, .5, 1); }
.pop-enter-from { opacity: 0; transform: translateY(8px) scale(.96); }
@keyframes bounce { 40% { transform: translateY(-4px); } }
@keyframes ring { 0%, 100% { transform: rotate(0); } 10%, 30% { transform: rotate(-1.2deg); } 20%, 40% { transform: rotate(1.2deg); } 50% { transform: rotate(0); } }
@keyframes pulse-ring { 0% { opacity: .7; transform: scale(.9); } 100% { opacity: 0; transform: scale(1.5); } }

@media (max-width: 1050px) {
  .eng-grid { grid-template-columns: 1fr; }
  .tabs { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; border-top: 0; border-bottom: 1px solid var(--line); }
  .tab { flex: 0 0 auto; width: 220px; padding: 14px 12px; border-bottom: 0; scroll-snap-align: start; }
  .tab.on { padding-left: 12px; }
  .tab::before { top: auto; bottom: 0; left: 0; right: 0; width: auto; height: 3px; transform: scaleX(0); }
  .tab.on::before { transform: scaleX(1); }
  .play { flex: 0 0 auto; margin: 0 14px; white-space: nowrap; }
}
@media (max-width: 900px) {
  .eng-head { grid-template-columns: 1fr; }
  .eng-sub { justify-self: start; }
}
@media (max-width: 800px) {
  .stage { grid-template-columns: 1fr; min-height: 0; }
}
@media (max-width: 480px) {
  .win-body { padding: 14px; }
  .facts { grid-template-columns: 1fr; }
  .win { box-shadow: 6px 6px 0 color-mix(in srgb, var(--a) 45%, #fff); }
}
@media (prefers-reduced-motion: reduce) {
  .eng *, .eng *::before, .eng *::after { animation: none !important; transition: none !important; }
}
</style>
