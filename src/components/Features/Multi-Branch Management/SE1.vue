<template>
  <section id="hq-dashboard" ref="root" class="hq" :class="{ in: seen, live }" aria-labelledby="hq-title">
    <header class="head">
      <h2 id="hq-title" class="title">
        <span>One head-office</span>
        <span class="soft">dashboard</span>
      </h2>
      <p>
        See sales today, staff on duty and sync status for every branch side by side. Drill into any branch to see its customers,
        pipeline, stock and invoices, or compare branches by revenue and margin.
      </p>
    </header>

    <div class="app" role="img" aria-label="A head-office dashboard showing every branch side by side, a branch drill-down and a revenue and margin comparison">
      <div class="bar">
        <div class="brand"><span class="logo">HQ</span><div><b>Head office</b><small>All {{ branches.length }} branches</small></div></div>
        <div class="seg" :style="{ '--i': modeIdx }">
          <i class="thumb"></i>
          <button v-for="m in modes" :key="m.key" type="button" class="segb" :class="{ on: m.key === mode }" @click="choose(m.key)">{{ m.label }}</button>
        </div>
        <span class="clock"><i></i><b class="mono">{{ clock }}</b></span>
      </div>

      <div class="body">
        <!-- ============ TODAY: every branch side by side ============ -->
        <div class="view" :class="{ on: mode === 'today' }">
          <div class="kpis">
            <div class="kpi"><small>Sales today</small><b :key="totalSales" class="mono bump">Rs. {{ money(totalSales) }}</b><span class="d up">+12% vs yesterday</span></div>
            <div class="kpi"><small>Staff on duty</small><b :key="staffOn" class="mono bump">{{ staffOn }} <em>of {{ staffAll }}</em></b><span class="d">across {{ branches.length }} branches</span></div>
            <div class="kpi"><small>Sync status</small><b :key="syncedN" class="mono bump">{{ syncedN }} <em>of {{ branches.length }} synced</em></b><span class="d" :class="syncedN < branches.length ? 'warn' : 'up'">{{ syncedN < branches.length ? 'Catching up' : 'All up to date' }}</span></div>
          </div>
          <div class="cards">
            <article v-for="(b, i) in branches" :key="b.name" class="bc" :class="[b.tint, { hot: hot === i }]">
              <div class="bt">
                <b>{{ b.name }}</b>
                <span class="sy" :class="b.sync">
                  <i></i>{{ b.sync === 'ok' ? 'Synced' : b.sync === 'sync' ? 'Syncing' : 'Offline' }}
                </span>
              </div>
              <div class="sales"><small>Sales today</small><b :key="b.sales" class="mono bump">Rs. {{ money(b.sales) }}</b></div>
              <i class="meter"><u :style="{ width: (b.sales / maxSales) * 100 + '%' }"></u></i>
              <div class="bf">
                <span class="staff"><i v-for="n in Math.min(b.on, 5)" :key="n"></i><em class="mono">{{ b.on }}/{{ b.all }} on duty</em></span>
                <small class="when">{{ b.sync === 'ok' ? 'updated ' + b.ago : b.sync === 'sync' ? 'uploading…' : 'offline ' + b.ago }}</small>
              </div>
            </article>
          </div>
        </div>

        <!-- ============ DRILL: one branch in depth ============ -->
        <div class="view drill" :class="{ on: mode === 'drill' }">
          <ul class="bl">
            <li v-for="(b, i) in branches" :key="b.name"><button type="button" :class="{ on: i === drillIdx }" @click="pickBranch(i)"><i :class="b.tint"></i>{{ b.name }}</button></li>
          </ul>
          <div :key="drillIdx" class="dg">
            <div class="dc c1">
              <div class="dh"><b>Customers</b><span class="pl">+{{ dv.cust.today }} today</span></div>
              <div class="big"><span class="cnt" :style="{ '--n': dv.cust.n }"></span></div>
              <ul class="mini"><li v-for="c in dv.cust.recent" :key="c"><i>{{ c.charAt(0) }}</i>{{ c }}</li></ul>
            </div>
            <div class="dc c2">
              <div class="dh"><b>Pipeline</b><span class="pl">{{ dv.pipe.deals }} deals</span></div>
              <div class="big sm">Rs. {{ dv.pipe.value }}</div>
              <ul class="stg"><li v-for="(s, k) in dv.pipe.stages" :key="s.n"><span>{{ s.n }}</span><i><u :style="{ width: s.w + '%', '--k': k }"></u></i><em class="mono">{{ s.w }}%</em></li></ul>
            </div>
            <div class="dc c3">
              <div class="dh"><b>Stock</b><span class="pl warn">{{ dv.stock.low }} low</span></div>
              <ul class="stg stock"><li v-for="(s, k) in dv.stock.rows" :key="s.n"><span>{{ s.n }}</span><i :class="{ low: s.q < 6 }"><u :style="{ width: (s.q / 24) * 100 + '%', '--k': k }"></u></i><em class="mono">{{ s.q }}</em></li></ul>
            </div>
            <div class="dc c4">
              <div class="dh"><b>Invoices</b><span class="pl">Rs. {{ dv.inv.out }} due</span></div>
              <ul class="inv"><li v-for="r in dv.inv.rows" :key="r.no"><span class="mono">{{ r.no }}</span><em class="st" :class="r.st.toLowerCase()">{{ r.st }}</em></li></ul>
            </div>
          </div>
        </div>

        <!-- ============ COMPARE: revenue and margin ============ -->
        <div class="view cmp" :class="{ on: mode === 'cmp' }">
          <div v-if="mode === 'cmp'" class="cw">
            <div class="ch"><b>Revenue and margin</b><small>This month · all branches</small></div>
            <ul class="rows">
              <li v-for="(r, i) in ranked" :key="r.name" :style="{ '--i': i }">
                <span class="rn"><i :class="r.tint"></i>{{ r.name }}</span>
                <span class="rb"><u :style="{ width: (r.rev / ranked[0].rev) * 100 + '%' }"></u><em class="mono">Rs. {{ r.rev.toFixed(1) }}M</em></span>
                <span class="mg" :class="{ best: r.margin === bestMargin }">{{ r.margin }}%<small v-if="r.margin === bestMargin">best</small></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

const modes = [
  { key: "today", label: "Today" },
  { key: "drill", label: "Drill into a branch" },
  { key: "cmp", label: "Compare" },
];

const branches = reactive([
  { name: "Colombo", tint: "peach", sales: 3820, on: 14, all: 16, sync: "ok", ago: "1m ago", rev: 18.4, margin: 24 },
  { name: "Kandy", tint: "mint", sales: 2140, on: 9, all: 10, sync: "ok", ago: "2m ago", rev: 9.8, margin: 27 },
  { name: "Galle", tint: "sky", sales: 1460, on: 7, all: 8, sync: "ok", ago: "1m ago", rev: 7.1, margin: 22 },
  { name: "Jaffna", tint: "lav", sales: 980, on: 5, all: 6, sync: "ok", ago: "3m ago", rev: 5.2, margin: 29 },
  { name: "Negombo", tint: "butter", sales: 1310, on: 6, all: 7, sync: "ok", ago: "2m ago", rev: 6.3, margin: 21 },
  { name: "Matara", tint: "pink", sales: 760, on: 4, all: 5, sync: "off", ago: "14m", rev: 4.4, margin: 26 },
]);

const drill = [
  { cust: { n: 1284, today: 6, recent: ["Nimal Perera", "Sachini Wijesekara", "Lanka Foods"] }, pipe: { deals: 38, value: "14.2M", stages: [{ n: "Lead", w: 82 }, { n: "Proposal", w: 61 }, { n: "Negotiation", w: 34 }, { n: "Won", w: 18 }] }, stock: { low: 3, rows: [{ n: "Compressor 1.5T", q: 4 }, { n: "Filter kit", q: 18 }, { n: "Remote", q: 11 }] }, inv: { out: "2.1M", rows: [{ no: "INV-0087", st: "Paid" }, { no: "INV-0091", st: "Due" }, { no: "INV-0079", st: "Overdue" }] } },
  { cust: { n: 742, today: 3, recent: ["Chaminda Rathnayake", "Kandy City Hotel", "Dilini Jayasinghe"] }, pipe: { deals: 21, value: "7.6M", stages: [{ n: "Lead", w: 74 }, { n: "Proposal", w: 52 }, { n: "Negotiation", w: 30 }, { n: "Won", w: 22 }] }, stock: { low: 1, rows: [{ n: "Compressor 1.5T", q: 12 }, { n: "Filter kit", q: 5 }, { n: "Remote", q: 20 }] }, inv: { out: "1.2M", rows: [{ no: "INV-0102", st: "Paid" }, { no: "INV-0104", st: "Due" }, { no: "INV-0098", st: "Paid" }] } },
  { cust: { n: 506, today: 2, recent: ["Farhan Ahamed", "Galle Fort Villas", "Ruwan Dias"] }, pipe: { deals: 14, value: "5.1M", stages: [{ n: "Lead", w: 68 }, { n: "Proposal", w: 47 }, { n: "Negotiation", w: 28 }, { n: "Won", w: 16 }] }, stock: { low: 2, rows: [{ n: "Compressor 1.5T", q: 7 }, { n: "Filter kit", q: 3 }, { n: "Remote", q: 15 }] }, inv: { out: "0.9M", rows: [{ no: "INV-0110", st: "Due" }, { no: "INV-0108", st: "Paid" }, { no: "INV-0101", st: "Overdue" }] } },
  { cust: { n: 318, today: 1, recent: ["Jaffna Traders", "Thushari K.", "North Cold Chain"] }, pipe: { deals: 9, value: "3.4M", stages: [{ n: "Lead", w: 64 }, { n: "Proposal", w: 44 }, { n: "Negotiation", w: 26 }, { n: "Won", w: 21 }] }, stock: { low: 0, rows: [{ n: "Compressor 1.5T", q: 14 }, { n: "Filter kit", q: 16 }, { n: "Remote", q: 9 }] }, inv: { out: "0.4M", rows: [{ no: "INV-0115", st: "Paid" }, { no: "INV-0113", st: "Paid" }, { no: "INV-0117", st: "Due" }] } },
  { cust: { n: 421, today: 2, recent: ["Negombo Beach Hotel", "Anura S.", "Sea Breeze Foods"] }, pipe: { deals: 11, value: "4.0M", stages: [{ n: "Lead", w: 70 }, { n: "Proposal", w: 49 }, { n: "Negotiation", w: 27 }, { n: "Won", w: 15 }] }, stock: { low: 2, rows: [{ n: "Compressor 1.5T", q: 5 }, { n: "Filter kit", q: 9 }, { n: "Remote", q: 4 }] }, inv: { out: "0.7M", rows: [{ no: "INV-0120", st: "Due" }, { no: "INV-0118", st: "Paid" }, { no: "INV-0112", st: "Overdue" }] } },
  { cust: { n: 264, today: 1, recent: ["Matara Motors", "Sandun P.", "Southern Dental"] }, pipe: { deals: 7, value: "2.2M", stages: [{ n: "Lead", w: 58 }, { n: "Proposal", w: 40 }, { n: "Negotiation", w: 24 }, { n: "Won", w: 19 }] }, stock: { low: 1, rows: [{ n: "Compressor 1.5T", q: 8 }, { n: "Filter kit", q: 4 }, { n: "Remote", q: 13 }] }, inv: { out: "0.3M", rows: [{ no: "INV-0124", st: "Paid" }, { no: "INV-0122", st: "Due" }, { no: "INV-0119", st: "Paid" }] } },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const mode = ref("today");
const drillIdx = ref(0);
const hot = ref(-1);
const clockS = ref(10 * 3600 + 42 * 60);

const modeIdx = computed(() => modes.findIndex((m) => m.key === mode.value));
const totalSales = computed(() => branches.reduce((t, b) => t + b.sales, 0));
const maxSales = computed(() => Math.max(...branches.map((b) => b.sales)));
const staffOn = computed(() => branches.reduce((t, b) => t + b.on, 0));
const staffAll = computed(() => branches.reduce((t, b) => t + b.all, 0));
const syncedN = computed(() => branches.filter((b) => b.sync === "ok").length);
const dv = computed(() => drill[drillIdx.value]);
const ranked = computed(() => [...branches].sort((a, b) => b.rev - a.rev));
const bestMargin = computed(() => Math.max(...branches.map((b) => b.margin)));
const pad = (x) => String(x).padStart(2, "0");
const clock = computed(() => `${pad(Math.floor(clockS.value / 3600))}:${pad(Math.floor((clockS.value % 3600) / 60))}:${pad(clockS.value % 60)}`);
const money = (k) => (k >= 10000 ? (k / 1000).toFixed(2) + "M" : k.toLocaleString("en-US") + "K");
const pickBranch = (i) => { st.manual = true; drillIdx.value = i; };

// plain bookkeeping, kept out of the template
const st = { beat: 0, manual: false, timer: null, io: null, fallback: null };
const RANGE = { today: [0, 8], drill: [8, 16], cmp: [16, 22] };

function setMode(key) {
  mode.value = key;
  st.beat = RANGE[key][0];
  if (key === "drill") drillIdx.value = 0;
}
function choose(key) {
  st.manual = true; // once someone picks a view, stay on it
  setMode(key);
}

function tick() {
  const b = st.beat;
  clockS.value += 1;
  if (mode.value === "today") {
    const i = (b * 5 + 2) % branches.length;
    branches[i].sales += 24 + ((b * 37) % 70);
    hot.value = i;
    if (b === 2) branches[5].sync = "sync";
    if (b === 4) { branches[5].sync = "ok"; branches[5].ago = "just now"; }
    if (b === 5) branches[3].on = Math.max(1, branches[3].on - 1);
    if (b === 6) branches[3].sync = "sync";
    if (b === 7) { branches[3].sync = "ok"; branches[3].ago = "just now"; }
  }
  if (mode.value === "drill" && (b - 8) % 2 === 0 && b > 8) drillIdx.value = Math.min(branches.length - 1, drillIdx.value + 1);
  st.beat = b + 1;
  const [from, to] = RANGE[mode.value];
  if (st.beat >= to) {
    if (st.manual) { st.beat = from; if (mode.value === "drill") drillIdx.value = 0; if (mode.value === "today") resetToday(); }
    else setMode(modes[(modeIdx.value + 1) % modes.length].key);
  }
}
function resetToday() {
  branches[5].sync = "off"; branches[5].ago = "14m";
  branches[3].on = 5; branches[3].ago = "3m ago";
}

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(tick, 1100);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true; // static: the "Today" view
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) start();
      else stop();
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  // safety net so the content can never stay invisible
  st.fallback = window.setTimeout(() => { if (!seen.value) seen.value = true; }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  stop();
});
</script>

<style scoped>


.hq {
  --orange: #ff6338;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #efe4de;
  --peach: #ffe9df; --mint: #e3f6ec; --sky: #e0f0ff; --lav: #f0ecff; --butter: #fff3cf; --pink: #ffe4ee;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Urbanist", system-ui, sans-serif;
}
.hq *, .hq *::before, .hq *::after { box-sizing: border-box; }
.hq button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }
.mono { font-variant-numeric: tabular-nums; }

.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0 0 22px; font-size: clamp(36px, 4.6vw, 66px); font-weight: 500; line-height: 1.1; letter-spacing: -0.04em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.head p { margin: 0 auto; max-width: 62ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

/* ---------- window ---------- */
.app { width: min(1180px, calc(100% - 40px)); margin: 56px auto 0; background: #fff; border: 1px solid var(--line); border-radius: 30px; overflow: hidden; box-shadow: 0 1px 2px rgba(80, 40, 20, 0.04), 0 40px 80px -40px rgba(80, 40, 20, 0.35); }
.bar { display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-bottom: 1px solid var(--line); background: #fcfaf8; }
.brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
.logo { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: var(--ink); color: #fff; font-size: 12px; font-weight: 600; }
.brand b { display: block; font-size: 14px; font-weight: 600; }
.brand small { display: block; color: var(--muted); font-size: 11.5px; }
.seg { position: relative; display: grid; grid-template-columns: repeat(3, auto); margin-left: auto; padding: 4px; border-radius: 14px; background: #f4efec; }
.thumb { position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc((100% - 8px) / 3); border-radius: 10px; background: #fff; box-shadow: 0 1px 2px rgba(20, 18, 15, 0.08), 0 6px 14px rgba(20, 18, 15, 0.08); transform: translateX(calc(var(--i) * 100%)); transition: transform 0.5s cubic-bezier(0.3, 1.2, 0.4, 1); }
.segb { position: relative; z-index: 1; padding: 9px 16px; border: 0; background: none; border-radius: 10px; font: 500 13px "Poppins", system-ui, sans-serif; color: #8a857f; cursor: pointer; white-space: nowrap; transition: color 0.3s; }
.segb.on { color: var(--ink); }
.clock { display: inline-flex; align-items: center; gap: 8px; padding: 7px 13px; border-radius: 99px; background: #e3f6ec; color: #15803d; font-size: 12px; font-weight: 600; }
.clock i { width: 7px; height: 7px; border-radius: 50%; background: #16a34a; animation: blink 1.4s ease-in-out infinite; }

.body { display: grid; padding: 22px; background: #fcfaf8; }
.view { grid-area: 1 / 1; min-width: 0; opacity: 0; visibility: hidden; transform: translateY(10px); transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1), visibility 0.45s; }
.view.on { opacity: 1; visibility: visible; transform: none; }

/* today */
.kpis { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-bottom: 14px; }
.kpi { display: grid; gap: 3px; padding: 18px 20px; border-radius: 22px; background: #fff; border: 1px solid var(--line); }
.kpi small { color: var(--muted); font-size: 12px; }
.kpi b { font-size: 26px; font-weight: 600; letter-spacing: -0.03em; }
.kpi b em { font-size: 13px; font-style: normal; font-weight: 500; color: var(--muted); letter-spacing: 0; }
.d { font-size: 11.5px; font-weight: 500; color: var(--muted); }
.d.up { color: #15803d; }
.d.warn { color: #b45309; }
.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.bc { --t: var(--peach); display: grid; gap: 10px; padding: 18px; border-radius: 24px; background: var(--t); transition: transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1), box-shadow 0.4s; }
.bc.peach { --t: var(--peach); } .bc.mint { --t: var(--mint); } .bc.sky { --t: var(--sky); } .bc.lav { --t: var(--lav); } .bc.butter { --t: var(--butter); } .bc.pink { --t: var(--pink); }
.bc.hot { transform: translateY(-3px); box-shadow: 0 18px 30px -18px rgba(20, 18, 15, 0.4); }
.bt { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.bt b { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.sy { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 99px; background: #fff; font-size: 11px; font-weight: 600; }
.sy i { width: 7px; height: 7px; border-radius: 50%; background: #16a34a; }
.sy.ok { color: #15803d; }
.sy.sync { color: #0b57d0; }
.sy.sync i { background: #0b57d0; animation: blink 0.8s ease-in-out infinite; }
.sy.off { color: #b45309; }
.sy.off i { background: #f59e0b; }
.sales small { display: block; color: #6f6862; font-size: 11.5px; }
.sales b { font-size: 21px; font-weight: 600; letter-spacing: -0.03em; }
.meter { display: block; height: 6px; border-radius: 3px; background: rgba(255, 255, 255, 0.75); overflow: hidden; }
.meter u { display: block; height: 100%; border-radius: 3px; background: var(--ink); text-decoration: none; transition: width 0.8s cubic-bezier(0.3, 0.9, 0.3, 1); }
.bf { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.staff { display: inline-flex; align-items: center; gap: 4px; }
.staff i { width: 9px; height: 9px; border-radius: 50%; background: var(--ink); opacity: 0.8; }
.staff em { margin-left: 6px; font-size: 11.5px; font-style: normal; color: #5d5651; }
.when { color: #6f6862; font-size: 11px; }

/* drill */
.drill { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 16px; align-items: start; }
.bl { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.bl button { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border: 0; border-radius: 14px; background: none; font: 500 13.5px "Poppins", system-ui, sans-serif; color: #8a857f; text-align: left; cursor: pointer; transition: background 0.3s, color 0.3s; }
.bl button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 2px rgba(80, 40, 20, 0.06), 0 8px 16px -10px rgba(80, 40, 20, 0.3); }
.bl i { width: 10px; height: 10px; border-radius: 50%; background: var(--peach); }
.bl i.mint { background: #b8e6cc; } .bl i.sky { background: #b7d9f7; } .bl i.lav { background: #d4c8fa; } .bl i.butter { background: #f7dd8a; } .bl i.pink { background: #fbbdd2; } .bl i.peach { background: #ffc7ad; }
.dg { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; animation: rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.dc { display: grid; gap: 12px; align-content: start; padding: 18px; border-radius: 24px; }
.c1 { background: var(--sky); } .c2 { background: var(--lav); } .c3 { background: var(--butter); } .c4 { background: var(--mint); }
.dh { display: flex; align-items: center; justify-content: space-between; }
.dh b { font-size: 14px; font-weight: 600; }
.pl { padding: 3px 10px; border-radius: 99px; background: #fff; font-size: 11px; font-weight: 600; color: #15803d; }
.pl.warn { color: #b45309; }
.big { font-size: 34px; font-weight: 600; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
.big.sm { font-size: 28px; }
.mini, .stg, .inv { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.mini li { display: flex; align-items: center; gap: 9px; padding: 7px 10px; border-radius: 12px; background: #fff; font-size: 12.5px; font-weight: 500; }
.mini i { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: var(--sky); color: #0b57d0; font-size: 10px; font-style: normal; font-weight: 700; }
.stg li { display: grid; grid-template-columns: 82px 1fr 36px; align-items: center; gap: 10px; font-size: 12px; }
.stg i { display: block; height: 8px; border-radius: 4px; background: rgba(255, 255, 255, 0.8); overflow: hidden; }
.stg u { display: block; height: 100%; border-radius: 4px; background: #5b45c9; text-decoration: none; animation: grow 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) calc(0.15s + var(--k) * 0.1s) both; }
.stock i u { background: #b45309; } .stock i.low u { background: #dc2626; }
.stg em { font-style: normal; color: #6f6862; text-align: right; }
.inv li { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border-radius: 12px; background: #fff; font-size: 12.5px; font-weight: 500; }
.st { padding: 3px 10px; border-radius: 99px; font-size: 11px; font-style: normal; font-weight: 600; }
.st.paid { background: #e3f6ec; color: #15803d; } .st.due { background: #fff3cf; color: #b45309; } .st.overdue { background: #fde8e8; color: #dc2626; }

/* compare */
.cw { padding: 22px; border-radius: 24px; background: #fff; border: 1px solid var(--line); }
.ch { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
.ch b { font-size: 16px; font-weight: 600; }
.ch small { color: var(--muted); font-size: 12px; }
.rows { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.rows li { display: grid; grid-template-columns: 110px 1fr 78px; align-items: center; gap: 14px; animation: rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) calc(var(--i) * 0.07s) both; }
.rn { display: inline-flex; align-items: center; gap: 9px; font-size: 13.5px; font-weight: 500; }
.rn i { width: 10px; height: 10px; border-radius: 50%; background: #ffc7ad; }
.rn i.mint { background: #b8e6cc; } .rn i.sky { background: #b7d9f7; } .rn i.lav { background: #d4c8fa; } .rn i.butter { background: #f7dd8a; } .rn i.pink { background: #fbbdd2; }
.rb { position: relative; display: block; height: 32px; border-radius: 10px; background: #f6f1ee; overflow: hidden; }
.rb u { position: absolute; inset: 0 auto 0 0; border-radius: 10px; background: linear-gradient(90deg, #ffd3bd, #ff9e7a); text-decoration: none; transform-origin: left; animation: growX 1s cubic-bezier(0.2, 0.7, 0.2, 1) calc(0.1s + var(--i) * 0.07s) both; }
.rb em { position: absolute; left: 12px; top: 0; bottom: 0; display: flex; align-items: center; font-size: 12.5px; font-style: normal; font-weight: 600; }
.mg { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 6px 10px; border-radius: 99px; background: var(--lav); color: #5b45c9; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }
.mg.best { background: #e3f6ec; color: #15803d; }
.mg small { font-size: 9.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

/* counters */
@property --n { syntax: "<integer>"; initial-value: 0; inherits: false; }
.cnt { counter-reset: n var(--n); animation: count 1.1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s both; }
.cnt::before { content: counter(n); }
.bump { display: inline-block; animation: bump 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) both; }

/* ---------- entrance + pause ---------- */
.hq:not(.in) .head, .hq:not(.in) .app { opacity: 0; }
.hq.in .head { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.hq.in .app { animation: rise 1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.hq:not(.live) .clock i, .hq:not(.live) .sy.sync i { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: translateY(5px); opacity: 0.4; } to { transform: none; opacity: 1; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes grow { from { width: 0; } }
@keyframes growX { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes count { from { --n: 0; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .kpis, .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .kpis .kpi:last-child { grid-column: 1 / -1; }
  .drill { grid-template-columns: minmax(0, 1fr); }
  .bl { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .hq { padding: 72px 0; }
  .app { width: calc(100% - 32px); margin-top: 40px; border-radius: 24px; }
  .bar { flex-wrap: wrap; gap: 10px; padding: 12px 14px; }
  .seg { order: 3; width: 100%; margin-left: 0; grid-template-columns: repeat(3, 1fr); }
  .segb { padding: 9px 4px; font-size: 12px; }
  .clock { margin-left: auto; }
  .body { padding: 12px; }
  .cards { grid-template-columns: minmax(0, 1fr); }
  .dg { grid-template-columns: minmax(0, 1fr); }
  .bl { grid-template-columns: repeat(2, 1fr); }
  .rows li { grid-template-columns: 78px 1fr 62px; gap: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .hq *, .hq *::before, .hq *::after { animation: none !important; transition: none !important; }
  .hq:not(.in) .head, .hq:not(.in) .app { opacity: 1; }
}
</style>
