<script setup>
defineOptions({ name: 'HomeSection3' })
import { ref } from 'vue'

const active = ref(0)
const paused = ref(false)
const next = () => { active.value = (active.value + 1) % tabs.length }

const tabs = [
  { title: 'Capture & Manage Leads', text: 'Organize buyer profiles, track customer frequency, and auto-dispatch instant WhatsApp digital receipts and VIP rewards',
    icon: 'M9 11.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M16 4.5a3.5 3.5 0 010 7M18 14.8c2 .6 3.3 2.4 3.5 5' },
  { title: 'Instant Smart Quotations', text: 'Build branded PDF quotations in seconds, track client approvals, and convert won deals into invoices in 1 click',
    icon: 'M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5M9 13h6M9 17h4' },
  { title: 'Multi-Store Inventory Sync', text: 'Manage 1 to 100+ retail branches from a single HQ dashboard with real-time stock sync and role-based staff permissions',
    icon: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5' },
  { title: 'Automated Customer Calls', text: 'Connect 3CX telephony to automatically log inbound, outbound, and missed calls with instant caller ID matching',
    icon: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z' },
  { title: 'Revenue Analytics & Audit', text: 'Monitor live sales pipeline velocity, audit net profit margins, and export one-click tax and financial reports',
    icon: 'M4 20V10M10 20V4M16 20v-8M22 20H2' },
]

const leads = [
  { i: 'AP', c: '#e8501a', n: 'Amal Perera', s: '14 visits · last seen today', t: 'VIP', k: '' },
  { i: 'NF', c: '#3f63d8', n: 'Nadia Fernando', s: '6 visits · Rs. 182,400 lifetime', t: 'Returning', k: 'g' },
  { i: 'KS', c: '#1fa971', n: 'Kasun Silva', s: 'New lead · from website', t: 'New', k: 'b' },
  { i: 'SR', c: '#8b5cf6', n: 'Shanika Rajapaksa', s: '9 visits · VIP reward due', t: 'VIP', k: '' },
  { i: 'DJ', c: '#0ea5b7', n: 'Dilan Jayawardena', s: '2 visits · quotation sent', t: 'Returning', k: 'g' },
]
const branches = [
  { n: 'Colombo Fort', r: 'Manager · full access', p: 86, q: 1240 },
  { n: 'Kandy City Centre', r: 'Staff · view & sell', p: 58, q: 830 },
  { n: 'Galle', r: 'Staff · view & sell', p: 34, q: 412 },
  { n: 'Negombo', r: 'Manager · full access', p: 12, q: 96, low: true },
  { n: 'Jaffna', r: 'Staff · view & sell', p: 71, q: 975 },
]
const calls = [
  { a: '↙', c: '#1fa971', n: 'Amal Perera', s: 'Inbound · 4:12', t: 'Answered', k: 'g' },
  { a: '↗', c: '#3f63d8', n: 'Acme Holdings', s: 'Outbound · 1:48', t: 'Completed', k: 'b' },
  { a: '✕', c: '#d64545', n: '+94 77 123 4567', s: 'Missed · 10:42 AM', t: 'Missed', k: 'r' },
  { a: '↙', c: '#1fa971', n: 'Nadia Fernando', s: 'Inbound · 2:31', t: 'Answered', k: 'g' },
]
const bars = [50, 64, 56, 82, 74, 100, 92, 124]
const kpis = [
  { l: 'Net revenue', v: '$184k', d: '▲ 12.4%' },
  { l: 'Profit margin', v: '31.8%', d: '▲ 2.1%' },
  { l: 'Deals won', v: '86', d: '▲ 9' },
]
</script>

<template>
  <section class="hiw" :class="{ paused }">
    <header class="head">
      <small>How it works</small>
      <h2>Integrates <b>easily</b></h2>
      <p>We empower sales, retail, and operations teams to streamline customer pipelines, instant quotations, and multi-store workflows visually</p>
    </header>

    <div class="wrap" @mouseenter="paused = true" @mouseleave="paused = false">
      <div class="tabs" role="tablist">
        <button v-for="(t, i) in tabs" :key="t.title" class="tab" :class="{ on: active === i }"
          role="tab" :aria-selected="active === i" @click="active = i">
          <span class="ic"><svg viewBox="0 0 24 24"><path :d="t.icon" /></svg></span>
          <span><h3>{{ t.title }}</h3><p>{{ t.text }}</p></span>
          <i v-if="active === i" class="bar" @animationend="next"></i>
        </button>
      </div>

      <div class="stage">
        <!-- 1 Leads -->
        <div class="panel" :class="{ on: active === 0 }"><div class="ui">
          <h4>Customers <span>248 active this month</span></h4>
          <div v-for="l in leads" :key="l.n" class="row">
            <div class="av" :style="{ background: l.c }">{{ l.i }}</div>
            <div class="m"><b>{{ l.n }}</b><i>{{ l.s }}</i></div>
            <span class="tag" :class="l.k">{{ l.t }}</span>
          </div>
        </div>
          <div class="chip" style="right:-6px;bottom:34px"><div class="dot" style="background:#25d366">✓</div><div><b>Receipt sent on WhatsApp</b><span>Amal · Rs. 12,500 · just now</span></div></div>
          <div class="chip" style="left:-10px;bottom:-4px;animation-delay:-2s"><div class="dot">★</div><div><b>VIP reward unlocked</b><span>10% off next visit</span></div></div>
        </div>

        <!-- 2 Quotations -->
        <div class="panel" :class="{ on: active === 1 }"><div class="ui">
          <h4>Quotation <span>Issued Apr 24 · Valid till May 24</span></h4>
          <div class="qhead"><div><b>QT-2048</b><small>Acme Holdings</small></div><span class="tag g big">● Approved</span></div>
          <small class="lbl">Total amount</small><div class="amount">$24,850</div>
          <div class="flow">
            <div class="step d"><i>✎</i>Draft</div><u></u><div class="step d"><i>➤</i>Sent</div><u></u><div class="step d"><i>✓</i>Approved</div>
          </div>
          <div class="row file"><div class="av sq" style="background:#d64545">PDF</div><div class="m"><b>Quotation_QT-2048.pdf</b><i>Branded · 3 pages</i></div><span class="btn">Convert to invoice</span></div>
        </div>
          <div class="chip" style="right:-6px;top:6px"><div class="dot" style="background:var(--ok)">✓</div><div><b>Client approved</b><span>2 min ago</span></div></div>
        </div>

        <!-- 3 Inventory -->
        <div class="panel" :class="{ on: active === 2 }"><div class="ui">
          <h4>All branches <span>HQ dashboard · live</span></h4>
          <div v-for="b in branches" :key="b.n" class="row">
            <div class="m"><b>{{ b.n }}</b><i>{{ b.r }}</i></div>
            <div class="stock"><u :style="{ width: b.p + '%' }" :class="{ low: b.low }"></u></div>
            <b :style="{ color: b.low ? '#d64545' : '' }">{{ b.q }}</b>
          </div>
        </div>
          <div class="chip" style="right:-6px;bottom:30px"><div class="dot" style="background:#d64545">!</div><div><b>Low stock · Negombo</b><span>Transfer 200 from HQ</span></div></div>
          <div class="chip" style="left:-10px;top:-6px;animation-delay:-2s"><div class="dot">⟳</div><div><b>Synced</b><span>12 branches · 3 sec ago</span></div></div>
        </div>

        <!-- 4 Calls -->
        <div class="panel" :class="{ on: active === 3 }"><div class="ui">
          <h4>Call log <span>Connected to 3CX</span></h4>
          <div v-for="c in calls" :key="c.n + c.s" class="row">
            <div class="av" :style="{ background: c.c }">{{ c.a }}</div>
            <div class="m"><b>{{ c.n }}</b><i>{{ c.s }}</i></div>
            <span class="tag" :class="c.k">{{ c.t }}</span>
          </div>
        </div>
          <div class="chip" style="right:-6px;top:18px;padding:14px 18px"><div class="dot" style="background:var(--ok)">☎</div><div><b>Incoming · Amal Perera</b><span>VIP · 14 visits · matched</span></div></div>
        </div>

        <!-- 5 Analytics -->
        <div class="panel" :class="{ on: active === 4 }"><div class="ui">
          <h4>Revenue <span>Last 8 weeks</span></h4>
          <div class="kpis"><div v-for="k in kpis" :key="k.l" class="kpi"><small>{{ k.l }}</small><b>{{ k.v }}</b><em>{{ k.d }}</em></div></div>
          <svg viewBox="0 0 400 150" class="chart">
            <defs><linearGradient id="hiwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a4c" /><stop offset="1" stop-color="#e8501a" /></linearGradient></defs>
            <rect v-for="(h, i) in bars" :key="i" :x="12 + i * 46" :y="140 - h" width="34" :height="h" rx="6" fill="url(#hiwg)" />
            <path d="M29 80L75 64 121 72 167 46 213 54 259 28 305 36 351 8" fill="none" stroke="#14162b" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 5" />
          </svg>
        </div>
          <div class="chip" style="right:-6px;bottom:26px"><div class="dot">⇩</div><div><b>Tax report ready</b><span>Export PDF or Excel</span></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
</style>

<style scoped>
.hiw{--o:#e8501a;--o2:#ff8a4c;--ink:#14162b;--mut:#6b6f80;--bg:#f1efec;--line:#e9e6e1;--ok:#1fa971;
  font-family:Poppins,system-ui,sans-serif;background:var(--bg);color:var(--ink);padding:72px 20px}
.hiw *{box-sizing:border-box;margin:0}
.head{text-align:center;max-width:620px;margin:0 auto 44px}
.head small{color:var(--o);font-size:14px}
.head h2{font-size:clamp(32px,5vw,46px);font-weight:500;margin:6px 0 14px}
.head h2 b{color:var(--o);font-weight:500}
.head p{color:var(--mut);font-size:14px;line-height:1.7}
.wrap{max-width:1180px;margin:auto;display:grid;grid-template-columns:420px 1fr;gap:24px}
.tabs{display:flex;flex-direction:column;gap:10px}
.tab{all:unset;cursor:pointer;position:relative;display:flex;gap:14px;padding:16px 18px;border-radius:16px;background:#fff;border:1px solid var(--line);overflow:hidden;transition:transform .25s,box-shadow .25s,border-color .25s}
.tab:focus-visible{outline:2px solid var(--o);outline-offset:2px}
.ic{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--bg);color:var(--mut);transition:.25s}
.tab svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.tab h3{font-size:15px;font-weight:600;margin-bottom:3px}
.tab p{font-size:12px;line-height:1.6;color:var(--mut)}
.bar{position:absolute;left:0;bottom:0;height:3px;width:0;background:linear-gradient(90deg,var(--o),var(--o2));animation:fill 6s linear forwards}
.paused .bar{animation-play-state:paused}
@keyframes fill{to{width:100%}}
.tab.on{transform:translateX(6px);box-shadow:0 14px 32px -14px rgba(232,80,26,.4);border-color:rgba(232,80,26,.45)}
.tab.on .ic{background:linear-gradient(135deg,var(--o),var(--o2));color:#fff}
.tab.on h3{color:var(--o)}

/* light stage */
.stage{position:relative;min-height:560px;border-radius:24px;padding:34px;border:1px solid var(--line);
  background:radial-gradient(circle at 85% 10%,rgba(255,138,76,.28),transparent 45%),radial-gradient(circle at 8% 95%,rgba(232,80,26,.14),transparent 45%),linear-gradient(160deg,#fff,#faf6f2)}
.stage::before{content:"";position:absolute;inset:0;border-radius:inherit;background-image:radial-gradient(rgba(20,22,43,.08) 1px,transparent 1px);background-size:22px 22px}
.panel{position:absolute;inset:34px;opacity:0;transform:translateY(14px) scale(.985);transition:opacity .5s,transform .5s;pointer-events:none}
.panel.on{opacity:1;transform:none;pointer-events:auto}
.ui{background:#fff;color:var(--ink);border-radius:18px;padding:20px;height:100%;border:1px solid var(--line);box-shadow:0 24px 50px -24px rgba(20,22,43,.28)}
.ui h4{font-size:13px;font-weight:600;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}
.ui h4 span{font-weight:400;color:#8a8ea0;font-size:11px}
.row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #f0ece8;font-size:12px}
.row:last-child{border:0}
.av{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:600;font-size:12px;flex:none}
.av.sq{border-radius:9px}
.m{flex:1;min-width:0}.m b{display:block;font-weight:600}.m i{font-style:normal;color:#8a8ea0;font-size:11px}
.tag{font-size:10px;padding:3px 9px;border-radius:99px;background:#fff1ea;color:var(--o);font-weight:500}
.tag.g{background:#e6f7ef;color:var(--ok)}.tag.r{background:#fdecec;color:#d64545}.tag.b{background:#e9efff;color:#3f63d8}
.tag.big{font-size:12px;padding:6px 14px}
.chip{position:absolute;background:#fff;color:var(--ink);border:1px solid var(--line);border-radius:14px;padding:11px 14px;font-size:11px;box-shadow:0 16px 34px -14px rgba(20,22,43,.3);display:flex;gap:10px;align-items:center;animation:bob 5s ease-in-out infinite}
.dot{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;background:var(--o);color:#fff;font-size:14px}
.chip b{display:block;font-size:12px}.chip span{color:#8a8ea0}
@keyframes bob{50%{transform:translateY(-7px)}}
.btn{background:linear-gradient(135deg,var(--o),var(--o2));color:#fff;border-radius:10px;padding:10px 16px;font-size:12px;font-weight:500}

.qhead{display:flex;justify-content:space-between;align-items:flex-start}
.qhead b{font-size:22px;font-weight:600;display:block}.qhead small{font-size:12px;color:#8a8ea0}
.lbl{display:block;margin:22px 0 4px;color:#8a8ea0;font-size:11px}
.amount{font-size:36px;font-weight:600}
.flow{display:flex;align-items:center;gap:8px;margin:20px 0}
.flow u{flex:1;height:2px;background:repeating-linear-gradient(90deg,#d9d4cf 0 5px,transparent 5px 9px)}
.step{text-align:center;font-size:10px;color:#8a8ea0}
.step i{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#f1efec;margin:0 auto 5px;font-style:normal;font-size:14px}
.step.d i{background:var(--o);color:#fff}
.file{background:#f7f5f2;border-radius:12px;padding:12px;border:0}
.stock{height:7px;border-radius:9px;background:#eee;flex:1;overflow:hidden}
.stock u{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,var(--o),var(--o2))}
.stock u.low{background:#d64545}
.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}
.kpi{background:#f7f5f2;border-radius:12px;padding:12px}
.kpi small{color:#8a8ea0;font-size:10px}.kpi b{display:block;font-size:18px;font-weight:600}.kpi em{font-style:normal;font-size:10px;color:var(--ok)}
.chart{width:100%;height:auto}

@media(max-width:900px){.wrap{grid-template-columns:1fr}.stage{min-height:520px;order:-1}.tab.on{transform:none}}
@media(max-width:520px){.chip{display:none}.stage{padding:16px}.panel{inset:16px}}
@media(prefers-reduced-motion:reduce){.chip{animation:none}.panel,.tab{transition:none}}
</style>