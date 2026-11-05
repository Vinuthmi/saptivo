<template>
  <section id="accounts" ref="root" class="ac" :class="{ in: seen, live }" aria-labelledby="ac-title">
    <div class="wrap">
      <!-- ============ copy ============ -->
      <div class="copy">
        <h2 id="ac-title" class="title">Accounts and company hierarchies</h2>
        <p>Link multiple contacts to a company account, and link accounts to each other in parent and subsidiary hierarchies.</p>
        <p class="strong">
          See every deal, ticket and document for an organisation together, and track an account health score, stage
          (prospect, active, at risk, churned) and renewal reminders.
        </p>
        <ul class="stages" aria-label="Account stages">
          <li v-for="(m, k) in stageMeta" :key="k" :class="{ on: sel.stage === k }" :style="{ '--sc': m.c, '--sb': m.b }">
            <i class="sd"></i>{{ m.label }}
          </li>
        </ul>
      </div>

      <!-- ============ live account panel ============ -->
      <div class="panel" :style="panelStyle">
        <div class="board">
          <!-- hierarchy tree -->
          <div class="tree" role="group" aria-label="Account hierarchy">
            <button type="button" class="node top" :class="nodeClass(0)" :style="nodeVars(0)" :aria-pressed="idx === 0" @click="choose(0)">
              <span class="logo">{{ accounts[0].ini }}</span>
              <span class="nm"><b>{{ accounts[0].name }}</b><small>{{ stageMeta[accounts[0].stage].label }} · {{ accounts[0].contacts }} contacts</small></span>
            </button>
            <i class="stem" :class="{ hot: idx !== 0 }"></i>

            <div class="cols">
              <div v-for="i in [1, 2, 3]" :key="accounts[i].id" class="col" :style="{ '--k': i }">
                <i class="drop" :class="{ hot: idx === i || (i === 2 && idx === 4) }"></i>
                <button type="button" class="node" :class="nodeClass(i)" :style="nodeVars(i)" :aria-pressed="idx === i" @click="choose(i)">
                  <span class="logo">{{ accounts[i].ini }}</span>
                  <span class="nm"><b>{{ accounts[i].name }}</b><small>{{ stageMeta[accounts[i].stage].label }} · {{ accounts[i].contacts }}</small></span>
                </button>
                <template v-if="i === 2">
                  <i class="drop low" :class="{ hot: idx === 4 }"></i>
                  <button type="button" class="node" :class="nodeClass(4)" :style="nodeVars(4)" :aria-pressed="idx === 4" @click="choose(4)">
                    <span class="logo">{{ accounts[4].ini }}</span>
                    <span class="nm"><b>{{ accounts[4].name }}</b><small>{{ stageMeta[accounts[4].stage].label }} · {{ accounts[4].contacts }}</small></span>
                  </button>
                </template>
              </div>
            </div>
          </div>

          <!-- selected account -->
          <div :key="idx" class="card detail" aria-live="polite">
            <div class="dh">
              <span class="logo big" :style="{ '--sc': meta.c, '--sb': meta.b }">{{ sel.ini }}</span>
              <div class="dn">
                <b>{{ sel.name }}</b>
                <small>{{ sel.sub }}</small>
              </div>
              <span class="spill" :style="{ '--sc': meta.c, '--sb': meta.b }"><i class="sd"></i>{{ meta.label }}</span>
            </div>

            <div class="dm">
              <div class="health">
                <svg viewBox="0 0 84 84" aria-hidden="true">
                  <circle cx="42" cy="42" r="34" fill="none" stroke="#efe4de" stroke-width="8" />
                  <circle class="rfg" cx="42" cy="42" r="34" fill="none" :stroke="healthColor" stroke-width="8" stroke-linecap="round" transform="rotate(-90 42 42)" :stroke-dasharray="CIRC" :stroke-dashoffset="dashOff" :style="{ '--C': CIRC }" />
                </svg>
                <span class="score"><span class="cnt" :style="{ '--n': sel.health }"></span></span>
                <small class="hl">Health score</small>
              </div>

              <div class="stats">
                <div class="stat" v-for="s in statList" :key="s.label">
                  <small>{{ s.label }}</small>
                  <b><span class="cnt" :style="{ '--n': s.value }"></span></b>
                </div>
                <div class="roll" :class="{ show: sel.level === 0 }">Rolled up from 4 subsidiaries</div>
              </div>
            </div>

            <div class="drow">
              <div class="avs" aria-hidden="true">
                <i v-for="(a, k) in avatars" :key="a.ini" class="av" :style="{ background: a.bg, color: a.fg, '--j': k }">{{ a.ini }}</i>
                <i v-if="extra > 0" class="av more" :style="{ '--j': avatars.length }">+{{ extra }}</i>
              </div>
              <span class="dtxt">{{ sel.contacts }} contact{{ sel.contacts === 1 ? '' : 's' }} linked to this account</span>
            </div>

            <div class="renew" :class="{ soon: sel.renew.soon }">
              <span class="bell" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></svg>
              </span>
              <div class="rt">
                <b>{{ sel.renew.text }}</b>
                <i class="rbar"><u :style="{ width: sel.renew.pct + '%' }"></u></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// Optional background photo behind the panel. Put a picture in public/images/ and set the path,
// or leave "" for the flat tinted panel.
const bgImage = "";
const panelStyle = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

const stageMeta = {
  prospect: { label: "Prospect", c: "#0b57d0", b: "#e7f0ff" },
  active: { label: "Active", c: "#15803d", b: "#e6f6ec" },
  risk: { label: "At risk", c: "#b45309", b: "#fff3d9" },
  churned: { label: "Churned", c: "#dc2626", b: "#fde8e8" },
};

const pool = [
  { ini: "NP", bg: "#ffe3d6", fg: "#c4400f" },
  { ini: "IP", bg: "#e3efff", fg: "#0b57d0" },
  { ini: "DF", bg: "#e6f6ec", fg: "#15803d" },
  { ini: "CR", bg: "#fff3d9", fg: "#b45309" },
  { ini: "SW", bg: "#f1e6ff", fg: "#7c3aed" },
  { ini: "FA", bg: "#fde8e8", fg: "#dc2626" },
];

// index 0 = parent, 1-3 = subsidiaries, 4 = sub-subsidiary under index 2
const accounts = [
  { id: "grp", name: "Ceylon Group", ini: "CG", level: 0, stage: "active", health: 88, contacts: 6, deals: 2, tickets: 1, docs: 6, sub: "Parent account", renew: { text: "Renews 12 Mar 2027 · in 128 days", pct: 30, soon: false } },
  { id: "mot", name: "Ceylon Motors", ini: "CM", level: 1, stage: "active", health: 92, contacts: 4, deals: 3, tickets: 1, docs: 9, sub: "Subsidiary of Ceylon Group", renew: { text: "Renews in 74 days", pct: 58, soon: false } },
  { id: "log", name: "Ceylon Logistics", ini: "CL", level: 1, stage: "risk", health: 54, contacts: 3, deals: 1, tickets: 7, docs: 6, sub: "Subsidiary of Ceylon Group", renew: { text: "Renews in 29 days · reminder sent", pct: 84, soon: true } },
  { id: "foo", name: "Ceylon Foods", ini: "CF", level: 1, stage: "prospect", health: 71, contacts: 2, deals: 1, tickets: 0, docs: 2, sub: "Subsidiary of Ceylon Group", renew: { text: "Trial ends in 14 days", pct: 60, soon: false } },
  { id: "cold", name: "Ceylon Cold Chain", ini: "CC", level: 2, stage: "churned", health: 18, contacts: 1, deals: 0, tickets: 3, docs: 5, sub: "Subsidiary of Ceylon Logistics", renew: { text: "Lapsed 30 Sep 2026", pct: 100, soon: true } },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const idx = ref(0);

const sel = computed(() => accounts[idx.value]);
const meta = computed(() => stageMeta[sel.value.stage]);

// the parent shows everything rolled up from its subsidiaries
const totals = computed(() => {
  const a = sel.value;
  if (a.level !== 0) return { deals: a.deals, tickets: a.tickets, docs: a.docs };
  return accounts.reduce((t, x) => ({ deals: t.deals + x.deals, tickets: t.tickets + x.tickets, docs: t.docs + x.docs }), { deals: 0, tickets: 0, docs: 0 });
});
const statList = computed(() => [
  { label: "Deals", value: totals.value.deals },
  { label: "Tickets", value: totals.value.tickets },
  { label: "Documents", value: totals.value.docs },
]);

const avatars = computed(() => Array.from({ length: Math.min(sel.value.contacts, 5) }, (_, k) => pool[(k + idx.value) % pool.length]));
const extra = computed(() => Math.max(0, sel.value.contacts - 5));

const CIRC = 2 * Math.PI * 34;
const dashOff = computed(() => CIRC * (1 - sel.value.health / 100));
const healthColor = computed(() => (sel.value.health >= 80 ? "#15803d" : sel.value.health >= 50 ? "#f59e0b" : "#dc2626"));

const nodeClass = (i) => ({ on: idx.value === i });
const nodeVars = (i) => ({ "--sc": stageMeta[accounts[i].stage].c, "--sb": stageMeta[accounts[i].stage].b, "--i": i });

// plain bookkeeping, kept out of the template
const st = { manual: false, timer: null, io: null, fallback: null };
const next = () => { idx.value = (idx.value + 1) % accounts.length; };
function choose(i) {
  st.manual = true; // once someone clicks an account, stop auto-cycling
  idx.value = i;
}

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(() => { if (!st.manual) next(); }, 3400);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true;
    st.manual = true;
    idx.value = 2; // static picture: the at-risk subsidiary with its renewal reminder
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
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

.ac {
  --orange: #ff6338;
  --orange-soft: #fff1ec;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #efe4de;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Inter", system-ui, sans-serif;
}
.ac *, .ac *::before, .ac *::after { box-sizing: border-box; }
.ac button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.wrap {
  width: min(1180px, calc(100% - 40px)); margin: 0 auto;
  display: grid; grid-template-columns: 0.95fr 1.1fr; gap: 64px; align-items: center;
}

/* ---------- copy ---------- */
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.copy p { margin: 0 0 16px; max-width: 52ch; font-size: 16px; line-height: 1.75; color: var(--muted); }
.copy p.strong { color: var(--ink); font-weight: 500; }
.stages { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin: 26px 0 0; padding: 0; }
.stages li { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 99px; border: 1px solid var(--line); background: #fff; font-size: 13px; font-weight: 500; color: #8a857f; transition: background 0.35s, color 0.35s, border-color 0.35s, transform 0.4s cubic-bezier(0.3, 1.5, 0.5, 1); }
.stages li.on { background: var(--sb); color: var(--sc); border-color: transparent; transform: scale(1.06); }
.sd { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--sc, #d8cdc6); }
.stages li:not(.on) .sd { background: #d8cdc6; }

/* ---------- panel ---------- */
.panel { min-width: 0; padding: 22px; border-radius: 30px; background-color: #fbf3ee; background-size: cover; background-position: center; border: 1px solid var(--line); }
.board { display: flex; flex-direction: column; gap: 16px; }
.card { background: #fff; border: 1px solid var(--line); border-radius: 18px; box-shadow: 0 1px 2px rgba(80, 40, 20, 0.04), 0 10px 24px -14px rgba(80, 40, 20, 0.3); }

/* tree */
.tree { display: flex; flex-direction: column; align-items: center; }
.node {
  --sc: #8a857f; --sb: #f4efec;
  display: flex; align-items: center; gap: 9px; width: 100%; max-width: 168px; padding: 9px 10px;
  background: #fff; border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 1px 2px rgba(80, 40, 20, 0.05), 0 8px 18px -12px rgba(80, 40, 20, 0.3);
  font: inherit; color: inherit; text-align: left; cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.4s, transform 0.4s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.node.top { max-width: 210px; }
.node:hover { transform: translateY(-2px); }
.node.on { border-color: var(--orange); box-shadow: 0 0 0 4px rgba(255, 99, 56, 0.14), 0 14px 26px -14px rgba(255, 99, 56, 0.55); transform: translateY(-2px); }
.logo { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; background: var(--sb); color: var(--sc); font-size: 11px; font-weight: 600; transition: background 0.3s, color 0.3s; }
.logo.big { width: 42px; height: 42px; border-radius: 12px; font-size: 14px; }
.nm { min-width: 0; }
.nm b { display: block; font-size: 12.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nm small { display: block; font-size: 10.5px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.stem, .drop { display: block; width: 2px; height: 22px; border-radius: 2px; background: #eadfd8; transform-origin: top; transition: background 0.4s; }
.stem.hot, .drop.hot { background: var(--orange); }
.cols { position: relative; width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.cols::before { content: ""; position: absolute; top: 0; left: 16.666%; right: 16.666%; height: 2px; border-radius: 2px; background: #eadfd8; transform-origin: center; }
.col { display: flex; flex-direction: column; align-items: center; min-width: 0; padding: 0 4px; }

/* detail */
.detail { padding: 16px; animation: rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.dh { display: flex; align-items: center; gap: 12px; }
.dn { min-width: 0; flex: 1; }
.dn b { display: block; font-size: 16px; font-weight: 600; letter-spacing: -0.02em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dn small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.spill { display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px; border-radius: 99px; background: var(--sb); color: var(--sc); font-size: 12px; font-weight: 600; white-space: nowrap; animation: pop 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) 0.1s both; }

.dm { display: grid; grid-template-columns: 96px 1fr; gap: 18px; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--line); }
.health { position: relative; display: grid; justify-items: center; }
.health svg { width: 96px; height: 96px; }
.rfg { animation: ringfill 1.1s cubic-bezier(0.3, 0.9, 0.3, 1) both; }
.score { position: absolute; top: 0; left: 0; width: 96px; height: 96px; display: grid; place-items: center; font-size: 24px; font-weight: 600; letter-spacing: -0.03em; }
.hl { margin-top: 2px; color: var(--muted); font-size: 11px; }
.stats { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.stat { padding: 10px 12px; border-radius: 12px; background: #faf6f3; }
.stat small { display: block; color: var(--muted); font-size: 11px; }
.stat b { display: block; margin-top: 2px; font-size: 22px; font-weight: 600; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.roll { grid-column: 1 / -1; font-size: 11.5px; font-weight: 500; color: var(--orange); opacity: 0; transform: translateY(4px); transition: opacity 0.4s, transform 0.4s; }
.roll.show { opacity: 1; transform: none; }

.drow { display: flex; align-items: center; gap: 12px; margin-top: 14px; }
.avs { display: flex; }
.av { display: grid; place-items: center; width: 30px; height: 30px; margin-left: -8px; border-radius: 50%; border: 2px solid #fff; font-size: 10px; font-style: normal; font-weight: 600; animation: pop 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) calc(0.15s + var(--j) * 0.07s) both; }
.av:first-child { margin-left: 0; }
.av.more { background: #f4efec; color: #6a6560; }
.dtxt { font-size: 12.5px; color: var(--muted); }

.renew { display: flex; align-items: center; gap: 12px; margin-top: 14px; padding: 11px 12px; border-radius: 14px; background: #faf6f3; }
.renew.soon { background: #fff3d9; }
.bell { flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: #fff; color: var(--muted); }
.renew.soon .bell { color: #b45309; }
.renew.soon .bell svg { animation: ring 2.2s ease-in-out 0.6s infinite; transform-origin: 50% 10%; }
.rt { min-width: 0; flex: 1; }
.rt b { display: block; font-size: 12.5px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rbar { display: block; height: 5px; margin-top: 7px; border-radius: 3px; background: rgba(20, 18, 15, 0.08); overflow: hidden; }
.rbar u { display: block; height: 100%; border-radius: 3px; background: var(--orange); text-decoration: none; animation: grow 1s cubic-bezier(0.3, 0.9, 0.3, 1) 0.2s both; }
.renew.soon .rbar u { background: #f59e0b; }

/* counters */
@property --n { syntax: "<integer>"; initial-value: 0; inherits: false; }
.cnt { counter-reset: n var(--n); animation: count 1.1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s both; }
.cnt::before { content: counter(n); }

/* ---------- entrance (runs once) + pause ---------- */
.ac:not(.in) .copy, .ac:not(.in) .panel { opacity: 0; }
.ac.in .copy { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.ac.in .panel { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.ac.in .stages li { animation: pop 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) calc(0.4s + var(--n, 0) * 0.07s) backwards; }
.ac.in .node { animation: pop 0.55s cubic-bezier(0.3, 1.5, 0.5, 1) calc(0.35s + var(--i) * 0.1s) backwards; }
.ac.in .stem, .ac.in .drop { animation: draw 0.5s ease calc(0.5s) backwards; }
.ac.in .cols::before { animation: drawX 0.6s ease 0.7s backwards; }
.node { position: relative; }
.node.on::after { content: ""; position: absolute; inset: -1px; border-radius: 14px; border: 2px solid var(--orange); opacity: 0; pointer-events: none; animation: ringOut 2.4s ease-out infinite; }
.ac:not(.live) .node.on::after, .ac:not(.live) .renew.soon .bell svg { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes pop { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: none; } }
@keyframes draw { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes drawX { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes ringOut { 0% { opacity: 0.7; transform: scale(1); } 100% { opacity: 0; transform: scale(1.16, 1.3); } }
@keyframes ringfill { from { stroke-dashoffset: var(--C); } }
@keyframes grow { from { width: 0; } }
@keyframes count { from { --n: 0; } }
@keyframes ring { 0%, 40%, 100% { transform: rotate(0); } 8%, 24% { transform: rotate(14deg); } 16%, 32% { transform: rotate(-14deg); } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .wrap { grid-template-columns: minmax(0, 1fr); gap: 48px; }
  .copy p { max-width: none; }
}
@media (max-width: 640px) {
  .ac { padding: 72px 0; }
  .wrap { width: calc(100% - 32px); }
  .panel { padding: 14px; border-radius: 24px; }
  .node { padding: 8px; gap: 6px; }
  .node .logo { width: 24px; height: 24px; font-size: 9.5px; }
  .nm b { font-size: 11px; }
  .nm small { display: none; }
  .dm { grid-template-columns: 1fr; justify-items: center; }
  .stats { width: 100%; }
  .dtxt { font-size: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .ac *, .ac *::before, .ac *::after { animation: none !important; transition: none !important; }
  .ac:not(.in) .copy, .ac:not(.in) .panel { opacity: 1; }
}
</style>
