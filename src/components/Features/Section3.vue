<template>
  <section id="operations" class="ops" aria-labelledby="ops-title">
    <h2 id="ops-title" class="title">
      <span>Run operations</span>
      <span class="soft">and after-sales service</span>
    </h2>

    <div class="grid">
      <!-- 1. Service and AMC management -->
      <article class="card wide">
        <header class="head">
          <div class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.1-.5-.5-2.1z" /></svg>
          </div>
          <div>
            <h3>Service and AMC management</h3>
            <p>Track installed assets, maintenance contracts and preventive schedules, then send the right technician to each visit.</p>
          </div>
        </header>

        <div class="svc">
          <div class="panel">
            <div class="panel-title"><b>Installed assets</b><span class="mono">128</span></div>
            <ul class="list">
              <li v-for="a in assets" :key="a.name" class="item row">
                <div class="grow">
                  <div class="t1">{{ a.name }}</div>
                  <div class="t2 mono">{{ a.meta }}</div>
                </div>
                <span class="pill" :class="a.tone">{{ a.label }}</span>
              </li>
            </ul>
          </div>

          <div class="panel">
            <div class="panel-title"><b>Preventive schedule</b><span>November 2026</span></div>
            <div class="week">
              <div v-for="d in week" :key="d.date" :class="{ on: d.active }">
                {{ d.day }}<b>{{ d.date }}</b>
              </div>
            </div>
            <ul class="list">
              <li v-for="v in visits" :key="v.time" class="item visit">
                <time class="mono">{{ v.time }}</time>
                <div class="grow">
                  <div class="t1">{{ v.title }}</div>
                  <div class="t2">{{ v.note }}</div>
                </div>
                <span class="pill" :class="v.tone">{{ v.label }}</span>
              </li>
            </ul>
          </div>

          <div class="panel dispatch-panel">
            <div class="panel-title"><b>Technician dispatch</b><span class="pill ok">3 free</span></div>
            <div class="dispatch">
              <div class="route" aria-hidden="true">
                <svg viewBox="0 0 240 92" preserveAspectRatio="none">
                  <path d="M18 70 C 60 70, 70 24, 118 28 S 190 66, 222 22" fill="none" stroke="#ff6338" stroke-width="2.5" stroke-dasharray="5 5" stroke-linecap="round" />
                  <circle cx="18" cy="70" r="6" fill="#ff6338" />
                  <circle cx="222" cy="22" r="6" fill="#fff" stroke="#ff6338" stroke-width="3" />
                </svg>
              </div>
              <div class="row">
                <div class="avatar">RK</div>
                <div class="grow">
                  <div class="t1">R. Karunaratne</div>
                  <div class="t2">Nearest · 12 min · AC certified</div>
                </div>
              </div>
              <button type="button" class="btn">Assign to visit</button>
            </div>
          </div>
        </div>
      </article>

      <!-- 2. Help desk and ticketing -->
      <article class="card">
        <header class="head">
          <div class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 16 0" /><rect x="3" y="12" width="4" height="6" rx="1.5" /><rect x="17" y="12" width="4" height="6" rx="1.5" /><path d="M19 18c0 2-2 3-5 3" /></svg>
          </div>
          <div>
            <h3>Help desk and ticketing</h3>
            <p>Every email, call, chat and web request lands in one queue, with SLA timers on each ticket and a CSAT survey when it closes.</p>
          </div>
        </header>

        <div class="panel">
          <div class="panel-title"><b>Open tickets</b><span class="mono">42</span></div>
          <ul class="list">
            <li v-for="t in tickets" :key="t.id" class="item ticket">
              <div class="grow">
                <div class="t1">{{ t.id }} · {{ t.title }}</div>
                <div class="t2">{{ t.meta }}</div>
              </div>
              <div class="sla mono" :class="t.tone">{{ t.left }}</div>
              <div class="bar" :class="t.tone"><i :style="{ width: t.pct + '%' }"></i></div>
            </li>
          </ul>
          <div class="csat">
            <div class="score mono">4.7</div>
            <div class="grow">
              <div class="stars" aria-hidden="true">
                <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" fill="currentColor" :opacity="n === 5 ? 0.35 : 1"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.2l1.4-7L2 9.4l7-.8z" /></svg>
              </div>
              <div class="t2">CSAT this month · 96 responses</div>
            </div>
            <span class="pill ok">94% in SLA</span>
          </div>
        </div>
      </article>

      <!-- 3. Inventory and multi-warehouse -->
      <article class="card">
        <header class="head">
          <div class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></svg>
          </div>
          <div>
            <h3>Inventory and multi-warehouse</h3>
            <p>See stock by location, get reorder alerts before a part runs out, and record every transfer between warehouses.</p>
          </div>
        </header>

        <div class="panel">
          <div class="panel-title"><b>Compressor 1.5T · SKU CP-150</b><span>Reorder level 10</span></div>
          <div class="stock">
            <div v-for="w in warehouses" :key="w.name" class="wh">
              <div class="t1">{{ w.name }}</div>
              <div class="bar marked" :class="w.tone"><i :style="{ width: w.pct + '%' }"></i></div>
              <span class="mono t1" :class="{ 'text-crit': w.tone === 'crit' }">{{ w.qty }}</span>
            </div>
          </div>
          <div class="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20z" /><path d="M12 10v4M12 17v.01" /></svg>
            <div>
              <div class="t1">North WH is below its reorder level</div>
              <div class="t2">4 left, minimum 10. Transfer from Main WH or raise a purchase order.</div>
            </div>
          </div>
          <div class="item xfer">
            <span class="mono t1">TRF-0318</span>
            <span class="t2">Main WH</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            <span class="t2">South WH · 24 units</span>
            <span class="pill ok push">Received</span>
          </div>
        </div>
      </article>

      <!-- 4. Multi-branch management -->
      <article class="card wide">
        <header class="head">
          <div class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><path d="M14 17.5h7M17.5 14v7" /></svg>
          </div>
          <div>
            <h3>Multi-branch management</h3>
            <p>Run from one HQ dashboard whether you have 1 branch or 100+, and decide what each branch team can see and change.</p>
          </div>
        </header>

        <div class="hq">
          <div class="panel">
            <div class="panel-title"><b>HQ overview</b><span>All branches · today</span></div>
            <div class="kpis">
              <div v-for="k in kpis" :key="k.label" class="kpi">
                <small>{{ k.label }}</small>
                <b>{{ k.value }}</b>
              </div>
            </div>
            <div class="tiles" role="img" aria-label="Branch status grid: most branches on track, a few need attention">
              <i v-for="t in tiles" :key="t.id" :class="[t.tone, { sel: t.selected }]"></i>
              <i class="more">+76 more</i>
            </div>
            <div class="legend">
              <span><i class="dot ok"></i>On track</span>
              <span><i class="dot warn"></i>Needs attention</span>
              <span><i class="dot crit"></i>Behind SLA</span>
            </div>
          </div>

          <div class="panel">
            <div class="panel-title"><b>Branch permissions</b><span>North Branch</span></div>
            <div class="perm">
              <div class="h">Access</div>
              <div v-for="r in roles" :key="r" class="h">{{ r }}</div>
              <template v-for="row in permissions" :key="row.name">
                <div>{{ row.name }}</div>
                <button
                  v-for="(on, i) in row.allow"
                  :key="i"
                  type="button"
                  role="switch"
                  class="sw"
                  :class="{ on }"
                  :aria-checked="on"
                  :aria-label="row.name + ' for ' + roles[i]"
                  @click="toggle(row, i)"
                ></button>
              </template>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { reactive } from "vue";
defineOptions({ name: "OpsFeaturesSection" });

const assets = [
  { name: "Split AC 2.0T · Unit 4471", meta: "AMC-2041 · ends 14 Mar 2027", label: "Active", tone: "ok" },
  { name: "Water Purifier RO-60", meta: "AMC-2038 · ends 02 Dec 2026", label: "Renew in 29d", tone: "warn" },
  { name: "Generator 25 kVA", meta: "Warranty ended 30 Sep 2026", label: "No contract", tone: "crit" },
];

const week = [
  { day: "Mon", date: 2 },
  { day: "Tue", date: 3, active: true },
  { day: "Wed", date: 4 },
  { day: "Thu", date: 5 },
  { day: "Fri", date: 6 },
];

const visits = [
  { time: "09:00", title: "Quarterly service · Unit 4471", note: "Filter clean, gas check", label: "Due", tone: "brand" },
  { time: "11:30", title: "Annual overhaul · RO-60", note: "Membrane and UV lamp", label: "Planned", tone: "mute" },
  { time: "14:00", title: "Breakdown visit · Gen 25 kVA", note: "Reported 08:12 today", label: "Urgent", tone: "crit" },
];

const tickets = [
  { id: "#T-1827", title: "Unit 4471 not cooling", meta: "WhatsApp · R. Karunaratne", left: "00:38 left", pct: 92, tone: "crit" },
  { id: "#T-1824", title: "Invoice copy request", meta: "Email · Unassigned", left: "03:15 left", pct: 64, tone: "warn" },
  { id: "#T-1819", title: "Filter replacement quote", meta: "Web form · M. Perera", left: "19:40 left", pct: 22, tone: "ok" },
];

const warehouses = [
  { name: "Main WH", qty: 46, pct: 78, tone: "ok" },
  { name: "North WH", qty: 4, pct: 14, tone: "crit" },
  { name: "South WH", qty: 12, pct: 30, tone: "warn" },
];

const kpis = [
  { label: "Open tickets", value: 186 },
  { label: "Visits today", value: 74 },
  { label: "Low stock", value: 9 },
];

// 29 branch tiles: most on track, a few need attention
const warnTiles = [5, 19, 23];
const critTiles = [15];
const selectedTile = 13;
const tiles = Array.from({ length: 29 }, (_, i) => ({
  id: i,
  tone: critTiles.includes(i) ? "crit" : warnTiles.includes(i) ? "warn" : "ok",
  selected: i === selectedTile,
}));

const roles = ["Admin", "Lead", "Tech"];
const permissions = reactive([
  { name: "View tickets", allow: [true, true, true] },
  { name: "Edit contracts", allow: [true, true, false] },
  { name: "Move stock", allow: [true, true, false] },
  { name: "See other branches", allow: [true, false, false] },
]);
const toggle = (row, i) => {
  row.allow = row.allow.map((value, index) => (index === i ? !value : value));
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.ops {
  --orange: #ff6338;
  --orange-hover: #f0501f;
  --orange-soft: #fff1ec;
  --tint: #fff8f5;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #f1e7e2;
  --ok: #15803d;
  --ok-soft: #e6f6ec;
  --warn: #b45309;
  --warn-soft: #fff3d9;
  --crit: #dc2626;
  --crit-soft: #fde8e8;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Inter", system-ui, sans-serif;
}
.ops *, .ops *::before, .ops *::after { box-sizing: border-box; }
.ops button:focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15;
  letter-spacing: -0.03em; color: var(--ink);
}
.title span { display: block; }
.title .soft { color: var(--muted); }

.grid {
  width: min(1180px, calc(100% - 40px)); margin: 64px auto 0;
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px;
}
.card {
  position: relative; overflow: hidden; isolation: isolate; min-width: 0;
  display: flex; flex-direction: column; gap: 28px; padding: 32px;
  background: #fff; border: 1px solid var(--line); border-radius: 28px;
  box-shadow: 0 1px 2px rgba(80, 40, 20, 0.04), 0 16px 36px -16px rgba(255, 99, 56, 0.18);
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.card::before {
  content: ""; position: absolute; z-index: -1; right: -180px; top: -260px;
  width: 520px; height: 520px; border-radius: 50%;
  background: radial-gradient(closest-side, var(--orange-soft), transparent 72%);
}
.card:hover { transform: translateY(-3px); border-color: rgba(255, 99, 56, 0.4); }
.card.wide { grid-column: 1 / -1; }

.head { display: flex; flex-direction: column; gap: 14px; max-width: 560px; }
.card.wide .head { flex-direction: row; align-items: flex-start; gap: 18px; max-width: 720px; }
.head h3 { margin: 0 0 6px; font-size: 1.4rem; font-weight: 500; letter-spacing: -0.02em; line-height: 1.2; text-wrap: balance; }
.head p { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.7; max-width: 56ch; }
.icon { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; color: var(--orange); background: var(--orange-soft); }
.icon svg { width: 22px; height: 22px; }

/* shared mockup parts */
.panel { min-width: 0; background: var(--tint); border: 1px solid var(--line); border-radius: 18px; padding: 16px; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; font-size: 12px; font-weight: 500; color: var(--muted); }
.panel-title b { color: var(--ink); font-size: 13px; font-weight: 600; }
.mono { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.item { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; }
.row { display: flex; align-items: center; gap: 10px; min-width: 0; }
.grow { flex: 1; min-width: 0; }
.t1 { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.t2 { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text-crit { color: var(--crit); }

.pill { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; line-height: 1; padding: 5px 9px; border-radius: 999px; white-space: nowrap; background: var(--orange-soft); color: var(--orange-hover); }
.pill.brand { background: var(--orange-soft); color: var(--orange-hover); }
.pill.ok { background: var(--ok-soft); color: var(--ok); }
.pill.warn { background: var(--warn-soft); color: var(--warn); }
.pill.crit { background: var(--crit-soft); color: var(--crit); }
.pill.mute { background: #fff; color: var(--muted); border: 1px solid var(--line); }
.pill.push { margin-left: auto; }

.bar { position: relative; height: 6px; border-radius: 99px; background: var(--line); overflow: hidden; }
.bar i { position: absolute; inset: 0 auto 0 0; border-radius: 99px; background: var(--orange); }
.bar.brand i { background: var(--orange); }
.bar.ok i { background: var(--ok); }
.bar.warn i { background: #f59e0b; }
.bar.crit i { background: var(--crit); }

.avatar { flex: none; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; font-size: 11px; font-weight: 600; background: var(--orange-soft); color: var(--orange-hover); }
.btn { font: 600 13px "Inter", sans-serif; padding: 10px 14px; border: 0; border-radius: 12px; background: var(--orange); color: #fff; cursor: pointer; transition: background 0.2s ease; }
.btn:hover { background: var(--orange-hover); }

/* 1. service */
.svc { display: grid; grid-template-columns: 1.15fr 1.25fr 1fr; gap: 14px; }
.week { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; margin-bottom: 10px; }
.week div { text-align: center; font-size: 11px; color: var(--muted); padding: 6px 0; border-radius: 10px; background: #fff; border: 1px solid var(--line); }
.week div b { display: block; font-size: 14px; font-weight: 600; color: var(--ink); }
.week div.on { background: var(--orange); border-color: var(--orange); color: #fff; }
.week div.on b { color: #fff; }
.visit { display: grid; grid-template-columns: 48px 1fr auto; gap: 10px; align-items: center; }
.visit time { font-size: 12px; color: var(--muted); }
.dispatch { display: flex; flex-direction: column; gap: 12px; }
.route { position: relative; height: 92px; border-radius: 12px; background: #fff; border: 1px solid var(--line); overflow: hidden; }
.route svg { position: absolute; inset: 0; width: 100%; height: 100%; }

/* 2. tickets */
.ticket { display: grid; grid-template-columns: 1fr auto; gap: 6px 10px; }
.ticket .bar { grid-column: 1 / -1; }
.sla { font-size: 12px; font-weight: 500; }
.sla.crit { color: var(--crit); }
.sla.warn { color: var(--warn); }
.sla.ok { color: var(--ok); }
.csat { display: flex; align-items: center; gap: 14px; margin-top: 10px; padding: 10px 12px; background: #fff; border: 1px solid var(--line); border-radius: 12px; }
.score { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
.stars { display: flex; gap: 2px; color: var(--orange); }
.stars svg { width: 14px; height: 14px; }

/* 3. inventory */
.stock { display: flex; flex-direction: column; gap: 12px; }
.wh { display: grid; grid-template-columns: 76px 1fr auto; gap: 10px; align-items: center; }
.bar.marked { overflow: visible; }
.bar.marked::after { content: ""; position: absolute; left: 28%; top: -3px; bottom: -3px; width: 2px; border-radius: 2px; background: var(--ink); opacity: 0.4; }
.alert { display: flex; gap: 10px; align-items: flex-start; margin-top: 14px; padding: 10px 12px; border-radius: 12px; background: var(--warn-soft); color: var(--warn); }
.alert svg { flex: none; width: 18px; height: 18px; margin-top: 1px; }
.alert .t1, .alert .t2 { color: inherit; white-space: normal; }
.alert .t2 { opacity: 0.85; }
.xfer { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.xfer svg { width: 16px; height: 16px; color: var(--muted); }

/* 4. multi-branch */
.hq { display: grid; grid-template-columns: 1.3fr 1fr; gap: 14px; }
.kpis { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-bottom: 14px; }
.kpi { padding: 10px 12px; background: #fff; border: 1px solid var(--line); border-radius: 12px; }
.kpi small { display: block; font-size: 11px; color: var(--muted); }
.kpi b { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(34px, 1fr)); gap: 6px; }
.tiles i { aspect-ratio: 1; border-radius: 9px; background: var(--ok-soft); border: 1px solid rgba(21, 128, 61, 0.22); }
.tiles i.warn { background: var(--warn-soft); border-color: rgba(180, 83, 9, 0.3); }
.tiles i.crit { background: var(--crit-soft); border-color: rgba(220, 38, 38, 0.3); }
.tiles i.sel { outline: 2px solid var(--orange); outline-offset: 1px; }
.tiles i.more { grid-column: span 3; aspect-ratio: auto; display: grid; place-items: center; font-style: normal; font-size: 11px; font-weight: 500; color: var(--muted); background: transparent; border: 1px dashed var(--line); }
.legend { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 12px; font-size: 12px; color: var(--muted); }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); }
.dot.warn { background: #f59e0b; }
.dot.crit { background: var(--crit); }
.perm { display: grid; grid-template-columns: 1fr repeat(3, 40px); gap: 10px 6px; align-items: center; font-size: 12px; }
.perm .h { text-align: center; font-size: 11px; color: var(--muted); }
.perm .h:first-child { text-align: left; }
.sw { position: relative; justify-self: center; width: 32px; height: 18px; padding: 0; border: 0; border-radius: 99px; background: #e6dcd7; cursor: pointer; transition: background 0.2s ease; }
.sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25); transition: left 0.2s ease; }
.sw.on { background: var(--orange); }
.sw.on::after { left: 16px; }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .svc { grid-template-columns: 1fr 1fr; }
  .dispatch-panel { grid-column: 1 / -1; }
  .hq { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 760px) {
  .ops { padding: 72px 0; }
  .grid { width: calc(100% - 32px); margin-top: 40px; grid-template-columns: minmax(0, 1fr); }
  .card { padding: 22px; border-radius: 24px; gap: 22px; }
  .card.wide .head { flex-direction: column; }
  .svc { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .card, .btn, .sw, .sw::after { transition: none; }
  .card:hover { transform: none; }
}
</style>
