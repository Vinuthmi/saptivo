<template>
  <section id="pricing" class="pc" aria-label="Pricing plans">
    <div class="pc-in">
      <!-- toggles -->
      <div class="pc-tools">
        <div class="pc-seg" role="group" aria-label="Billing period">
          <button type="button" :class="{ on: billing === 'monthly' }" :aria-pressed="billing === 'monthly'" @click="billing = 'monthly'">Monthly</button>
          <button type="button" :class="{ on: billing === 'yearly' }" :aria-pressed="billing === 'yearly'" @click="billing = 'yearly'">Yearly <em>2 months free</em></button>
        </div>
        <div class="pc-seg pc-cur" role="group" aria-label="Currency">
          <button type="button" :class="{ on: cur === 'usd' }" :aria-pressed="cur === 'usd'" @click="cur = 'usd'">USD</button>
          <button type="button" :class="{ on: cur === 'lkr' }" :aria-pressed="cur === 'lkr'" @click="cur = 'lkr'">LKR</button>
        </div>
      </div>

      <!-- plan cards -->
      <div class="pc-cards">
        <article v-for="(p, i) in plans" :key="p.name" class="pc-card" :class="{ hot: i === featured }">
          <span v-if="p.badge" class="pc-badge">{{ p.badge }}</span>
          <h3 class="pc-name">{{ p.name }}</h3>
          <p class="pc-for">{{ bestFor[i] }}</p>

          <p class="pc-price"><b>{{ shownPrice(i) }}</b><span>/ month</span></p>
          <p class="pc-note">{{ billing === 'yearly' ? `${yearTotal(i)} billed yearly` : 'Billed monthly' }} · No setup fee</p>

          <ul class="pc-list">
            <li v-for="t in highlights(i)" :key="t">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" /><path d="m7.3 12.4 3.2 3.2 6.2-6.4" /></svg>
              {{ t }}
            </li>
          </ul>

          <a class="pc-btn" :href="i === 3 ? salesTo : trialTo">{{ i === 3 ? 'Book a demo' : 'Start free trial' }}</a>
          <p class="pc-trial">{{ limits.trial[i] === 'Demo + pilot' ? 'Demo + pilot included' : `${limits.trial[i]} free trial` }}</p>
        </article>
      </div>

      <!-- comparison table -->
      <div class="pc-wrap" tabindex="0" role="region" aria-label="Compare plans">
        <table class="pc-tbl">
          <thead>
            <tr>
              <td class="blank"></td>
              <th v-for="p in plans" :key="p.name" scope="col">{{ p.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="grp"><th colspan="5" scope="colgroup">Plan limits</th></tr>
            <tr v-for="r in limitRows" :key="r.l">
              <th scope="row">{{ r.l }}</th>
              <td v-for="(v, i) in r.v" :key="i">{{ v }}</td>
            </tr>

            <template v-for="g in groups" :key="g.n">
              <tr class="grp"><th colspan="5" scope="colgroup">{{ g.n }}</th></tr>
              <tr v-for="r in g.r" :key="r[0]">
                <th scope="row">{{ r[0] }}</th>
                <td v-for="(c, i) in r[1]" :key="i">
                  <svg v-if="c === '1'" class="yes" viewBox="0 0 24 24" role="img" aria-label="Included"><circle cx="12" cy="12" r="11" /><path d="m7.3 12.4 3.2 3.2 6.2-6.4" /></svg>
                  <span v-else class="no" aria-label="Not included">—</span>
                </td>
              </tr>
            </template>

            <tr class="buy">
              <th scope="row"></th>
              <td v-for="(p, i) in plans" :key="p.name"><a class="pc-tbtn" :href="i === 3 ? salesTo : trialTo">{{ i === 3 ? 'Book a demo' : 'Start free trial' }}</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- add-ons -->
      <div class="pc-add">
        <h3 class="pc-addh">Add-ons for any plan</h3>
        <ul class="pc-addl">
          <li v-for="a in addons" :key="a.t"><span>{{ a.t }}</span><b>{{ a.p }}</b><small>{{ a.u }}</small></li>
        </ul>
        <p class="pc-fine">WhatsApp conversations are billed at Meta's rates and are not included in the package price. LKR prices use an assumed rate of Rs 335 per USD.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
defineOptions({ name: 'SectionPricingPlans' })
/**
 * SectionPricingPlans.vue — Saptivo plans: four cards (Personal, Startup, Corporate, Enterprise) with a
 * Monthly / Yearly and USD / LKR switch, then a full comparison table (limits + every feature by module) and add-ons.
 * Figures come from Saptivo_CRM_Packages_2026.xlsx ("Packages" and "Feature Matrix" sheets; Enterprise is $599/month).
 * Props: trialTo (default /demo/) and salesTo (default /contact/) for the buttons.
 */
const props = defineProps({
  trialTo: { type: String, default: '/demo/' },
  salesTo: { type: String, default: '/contact/' },
})

const featured = 1
const plans = [
  { name: 'Personal', badge: '' },
  { name: 'Startup', badge: 'Most popular' },
  { name: 'Corporate', badge: 'Best value' },
  { name: 'Enterprise', badge: 'Premium' },
]

const price = {"monthly": [15.0, 59.0, 199.0, 599.0], "yearly": [150, 590, 1990, 5990], "monthlyLkr": [5025, 19765, 66665, 200665], "yearlyLkr": [50250, 197650, 666650, 2006650]}

const bestFor = ["Freelancers, agents, solo sellers", "Small teams getting organised", "Growing teams with sales, support & call centre", "Multi-branch, multi-country organisations"]

const limits = {"branches": [1.0, 1.0, 3.0, 10.0], "xBranch": ["n/a", 29.0, 49.0, 39.0], "users": [1.0, 5.0, 15.0, 40.0], "xUser": ["n/a", 10.0, 12.0, 12.0], "records": [2500.0, 25000.0, 150000.0, "Unlimited"], "wa": ["—", 1.0, 3.0, "Unlimited"], "email": ["—", 5000.0, 25000.0, "100,000+"], "forms": [2.0, 10.0, "Unlimited", "Unlimited"], "fb": [1.0, 3.0, 10.0, "Unlimited"], "support": ["Email + help articles", "Email + live chat", "Chat + phone, guided onboarding", "24/7, SLA, account manager"], "trial": ["14 days", "14 days", "14 days", "Demo + pilot"]}

const groups = [
  { n: "Leads and inquiries", r: [
    ["Inquiries & Lead Inquiries with deal stages", "1111"],
    ["Manual leads", "1111"],
    ["Inquiry Forms (website forms)", "1111"],
    ["Facebook Lead Integration (auto-create leads)", "1111"],
    ["CRM Inquiry Fields (custom fields)", "0111"],
    ["Lead import from spreadsheets + import history", "0111"],
    ["Inquiry Routing (property, project, service, package, course, branch)", "0111"],
    ["WordPress Website integration (publish CRM forms)", "0011"],
  ] },
  { n: "Customers", r: [
    ["Customers", "1111"],
    ["My Customers (assign customers to staff)", "0111"],
    ["Contact Groups", "0111"],
    ["Tasks (personal)", "1111"],
    ["Team scheduled tasks", "0111"],
  ] },
  { n: "WhatsApp", r: [
    ["WhatsApp Business API inbox & replies", "0111"],
    ["Saved (canned) replies", "0111"],
    ["Multiple WhatsApp numbers", "0011"],
    ["WhatsApp automation", "0011"],
    ["WhatsApp campaigns + opt-in consent", "0011"],
  ] },
  { n: "Calls", r: [
    ["3CX integration (staff extensions, click-to-call)", "0011"],
    ["Vodia PBX integration", "0011"],
    ["Call logs: own calls / all calls", "0011"],
    ["Incoming-call ringtone & live notifications", "0011"],
  ] },
  { n: "Email", r: [
    ["Bulk Email (templates, send, cancel)", "0111"],
    ["Email preferences / unsubscribe handling", "0111"],
    ["Own SMTP sending + IMAP inbox sync", "0111"],
  ] },
  { n: "Support desk", r: [
    ["Support tickets", "0111"],
    ["Departments, saved replies, assignment, internal notes", "0011"],
    ["Customer support portal (+ log in as customer)", "0011"],
    ["Auto-close resolved tickets, email alerts", "0011"],
  ] },
  { n: "Sales and billing", r: [
    ["Products & Services", "1111"],
    ["Quotations & Estimates", "1111"],
    ["Invoices & Payments", "1111"],
    ["Credit Notes", "0111"],
  ] },
  { n: "Website and SEO", r: [
    ["Vendor website: themes, banners, About/Contact/Footer", "0011"],
    ["SEO settings, sitemap, robots, social share", "0011"],
    ["Google Search Console + GA4 connection", "0011"],
    ["Premium theme home-page customisation", "0001"],
  ] },
  { n: "Admin and control", r: [
    ["Dashboard & sales funnel", "1111"],
    ["Roles & Permissions", "0111"],
    ["Staff Members", "0111"],
    ["Notifications (real-time, email, task reminders)", "1111"],
    ["Recycle Bin", "1111"],
    ["Multi-branch", "0011"],
    ["Multi-country & multi-currency", "0001"],
    ["Integration API (forms, inquiries, pairing)", "0001"],
  ] },
  { n: "Services", r: [
    ["Guided onboarding & data import", "0011"],
    ["Custom development & dedicated server", "0001"],
    ["Dedicated account manager", "0001"],
  ] },
]

const addons = [
  { t: 'Extra WhatsApp number', p: '$15', u: 'per month · Startup and up' },
  { t: 'Extra 10,000 customer records', p: '$10', u: 'per month' },
  { t: 'Extra 10,000 bulk email sends', p: '$8', u: 'per month' },
  { t: 'WhatsApp conversations', p: 'At cost', u: 'Meta rates passed through' },
  { t: 'Voxinnova cloud phone (Vodia PBX)', p: 'Bundle discount', u: 'per extension' },
  { t: 'Smardove business email', p: 'Bundle discount', u: 'per mailbox' },
  { t: 'Custom development', p: 'Quoted', u: 'per project' },
]

const billing = ref('yearly')
const cur = ref('usd')

const nf = new Intl.NumberFormat('en-US')
const num = (v) => (typeof v === 'number' ? nf.format(v) : v)
const money = (n) => {
  if (cur.value === 'lkr') return `Rs ${nf.format(Math.round(n))}`
  return `$${Number.isInteger(n) ? nf.format(n) : n.toFixed(2)}`
}
const perMonth = (i) => {
  const usd = cur.value === 'usd'
  if (billing.value === 'monthly') return usd ? price.monthly[i] : price.monthlyLkr[i]
  return (usd ? price.yearly[i] : price.yearlyLkr[i]) / 12
}
const shownPrice = (i) => money(perMonth(i))
const yearTotal = (i) => money(cur.value === 'usd' ? price.yearly[i] : price.yearlyLkr[i])

const plural = (n, w) => `${num(n)} ${w}${n === 1 ? '' : 's'}`
const highlights = (i) => [
  plural(limits.users[i], 'user'),
  plural(limits.branches[i], 'branch').replace('branchs', 'branches').replace('branches es', 'branches'),
  `${num(limits.records[i])} customer records`.replace('Unlimited customer records', 'Unlimited customer records'),
  limits.wa[i] === '—' ? null : `${num(limits.wa[i])} WhatsApp API ${limits.wa[i] === 1 ? 'number' : 'numbers'}`,
  `${limits.support[i]}`,
].filter(Boolean)

const usd = (v) => (typeof v === 'number' ? `$${v}` : '—')
const limitRows = computed(() => [
  { l: 'Price per month, billed monthly', v: price.monthly.map((n, i) => money(cur.value === 'usd' ? n : price.monthlyLkr[i])) },
  { l: 'Price per month, billed yearly', v: price.yearly.map((n, i) => money((cur.value === 'usd' ? n : price.yearlyLkr[i]) / 12)) },
  { l: 'Setup fee', v: ['None', 'None', 'None', 'None'] },
  { l: 'Users included', v: limits.users.map(num) },
  { l: 'Extra user (per month)', v: limits.xUser.map(usd) },
  { l: 'Branches included', v: limits.branches.map(num) },
  { l: 'Extra branch (per month)', v: limits.xBranch.map(usd) },
  { l: 'Customer records', v: limits.records.map(num) },
  { l: 'WhatsApp Business API numbers', v: limits.wa.map(num) },
  { l: 'Bulk email sends per month', v: limits.email.map(num) },
  { l: 'Inquiry forms', v: limits.forms.map(num) },
  { l: 'Facebook lead pages', v: limits.fb.map(num) },
  { l: 'Support', v: limits.support },
  { l: 'Free trial', v: limits.trial },
])
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.pc {
  --ink: #121212;
  --card: #f4f4f5;
  --line: #e4e4e7;
  --mute: #6b6b72;
  background: #fff;
  padding: clamp(40px, 6vw, 96px) clamp(16px, 3vw, 32px);
  font-family: 'Urbanist', Arial, Helvetica, sans-serif;
  color: var(--ink);
}
.pc, .pc *, .pc *::before, .pc *::after { box-sizing: border-box; }
.pc-in { max-width: 1240px; margin: 0 auto; }

/* ---------- toggles ---------- */
.pc-tools { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: clamp(24px, 3vw, 40px); }
.pc-seg { display: inline-flex; padding: 4px; border-radius: 999px; background: var(--card); }
.pc-seg button { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: 0; border-radius: 999px; background: transparent; color: #3d4148; font: 600 14.5px 'Urbanist', sans-serif; letter-spacing: 0.012em; cursor: pointer; }
.pc-seg button.on { background: var(--ink); color: #fff; }
.pc-seg em { font-style: normal; font-size: 11.5px; font-weight: 600; padding: 3px 8px; border-radius: 999px; background: #e4e4e7; color: #3f3f46; }
.pc-seg button.on em { background: rgba(255, 255, 255, 0.18); color: #fff; }
.pc-seg button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

/* ---------- cards ---------- */
.pc-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; align-items: stretch; }
.pc-card { position: relative; display: flex; flex-direction: column; padding: clamp(22px, 2vw, 28px); border-radius: 20px; background: var(--card); }
.pc-card.hot { background: var(--ink); color: #fff; }
.pc-badge { position: absolute; top: 18px; right: 18px; padding: 5px 11px; border-radius: 999px; background: #e4e4e7; color: #27272a; font-size: 12px; font-weight: 600; letter-spacing: 0.012em; }
.pc-card.hot .pc-badge { background: #fff; color: var(--ink); }

.pc-name { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
.pc-for { margin: 8px 0 0; min-height: 3.1em; font-size: 14.5px; font-weight: 500; line-height: 1.55; letter-spacing: 0.012em; color: #3d4148; }
.pc-price { margin: 20px 0 0; display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px; }
.pc-price b { font-size: clamp(34px, 3vw, 42px); font-weight: 500; line-height: 1; letter-spacing: -0.04em; }
.pc-price span { font-size: 14px; font-weight: 500; color: var(--mute); }
.pc-note { margin: 10px 0 0; font-size: 13.5px; font-weight: 500; letter-spacing: 0.012em; color: var(--mute); }
.pc-card.hot .pc-for, .pc-card.hot .pc-price span, .pc-card.hot .pc-note, .pc-card.hot .pc-trial { color: #d4d4d8 !important; }
.pc-card.hot .pc-name, .pc-card.hot .pc-price b, .pc-card.hot .pc-list li { color: #fff !important; }

.pc-list { margin: 22px 0 26px; padding: 22px 0 0; border-top: 1px solid rgba(113, 113, 122, 0.3); list-style: none; display: grid; gap: 12px; }
.pc-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14.5px; font-weight: 500; line-height: 1.4; letter-spacing: 0.012em; }
.pc-list svg { flex: none; width: 18px; height: 18px; margin-top: 1px; }
.pc-list circle { fill: var(--ink); }
.pc-list path { fill: none; stroke: #fff; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.pc-card.hot .pc-list circle { fill: #fff; }
.pc-card.hot .pc-list path { stroke: var(--ink); }

.pc-btn { margin-top: auto; display: flex; align-items: center; justify-content: center; min-height: 48px; border-radius: 12px; background: var(--ink); color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; }
.pc-btn:hover { background: #3f3f46; }
.pc-card.hot .pc-btn { background: #fff; color: var(--ink) !important; }
.pc-card.hot .pc-btn:hover { background: #e4e4e7; }
.pc-trial { margin: 10px 0 0; text-align: center; font-size: 12.5px; font-weight: 500; color: var(--mute); }
.pc-btn:focus-visible, .pc-tbtn:focus-visible { outline: 2px solid #71717a; outline-offset: 3px; }

/* ---------- table ---------- */
.pc-wrap { margin-top: clamp(48px, 6vw, 88px); overflow-x: auto; -webkit-overflow-scrolling: touch; }
.pc-wrap:focus-visible { outline: 2px solid #71717a; outline-offset: 4px; }
.pc-tbl { width: 100%; min-width: 860px; border-collapse: separate; border-spacing: 0; table-layout: fixed; }
.pc-tbl .blank { width: 32%; background: var(--ink); border-top-left-radius: 16px; }
.pc-tbl thead th { padding: 20px 12px; background: var(--ink); color: #fff; font-size: 16px; font-weight: 600; letter-spacing: -0.01em; text-align: center; }
.pc-tbl thead th:last-child { border-top-right-radius: 16px; }

.pc-tbl tbody th, .pc-tbl tbody td { height: 52px; padding: 0 16px; border-bottom: 1px solid var(--line); border-right: 1px solid var(--line); font-size: 14.5px; font-weight: 500; letter-spacing: 0.012em; text-align: center; font-variant-numeric: tabular-nums; }
.pc-tbl tbody th { border-left: 1px solid var(--line); text-align: left; padding-left: 18px; background: #fff; }
.pc-tbl tbody tr.grp th { height: 46px; background: var(--card); font-size: 15px; font-weight: 700; letter-spacing: -0.01em; }
.pc-tbl .yes { width: 20px; height: 20px; vertical-align: middle; }
.pc-tbl .yes circle { fill: var(--ink); }
.pc-tbl .yes path { fill: none; stroke: #fff; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.pc-tbl .no { color: #a1a1aa; }
.pc-tbl tbody tr.buy th, .pc-tbl tbody tr.buy td { height: 78px; }
.pc-tbl tbody tr.buy th { border-bottom-left-radius: 16px; }
.pc-tbl tbody tr.buy td:last-child { border-bottom-right-radius: 16px; }
.pc-tbtn { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; padding: 0 16px; border-radius: 10px; background: var(--ink); color: #fff; font-size: 13.5px; font-weight: 600; text-decoration: none; white-space: nowrap; }
.pc-tbtn:hover { background: #3f3f46; }

/* ---------- add-ons ---------- */
.pc-add { margin-top: clamp(40px, 5vw, 72px); padding: clamp(22px, 3vw, 40px); border-radius: 24px; background: var(--card); }
.pc-addh { margin: 0; font-size: clamp(22px, 2.2vw, 30px); font-weight: 500; letter-spacing: -0.04em; }
.pc-addl { margin: 20px 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 40px; }
.pc-addl li { display: grid; grid-template-columns: 1fr auto; gap: 2px 16px; padding: 14px 0; border-bottom: 1px solid #d4d4d8; font-size: 15px; font-weight: 500; letter-spacing: 0.012em; }
.pc-addl b { font-weight: 600; text-align: right; }
.pc-addl small { grid-column: 1 / -1; font-size: 13px; color: var(--mute); }
.pc-fine { margin: 18px 0 0; font-size: 13.5px; font-weight: 500; line-height: 1.6; letter-spacing: 0.012em; color: #3d4148; }

@media (max-width: 1100px) { .pc-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } .pc-for { min-height: 0; } }
@media (max-width: 640px) {
  .pc-cards { grid-template-columns: minmax(0, 1fr); }
  .pc-addl { grid-template-columns: 1fr; }
  .pc-tbl tbody th { position: sticky; left: 0; z-index: 1; min-width: 150px; }
}
</style>