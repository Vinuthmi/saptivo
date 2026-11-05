<template>
  <section id="lead-scoring" ref="root" class="scr" :class="{ in: seen, live }" aria-labelledby="scr-title">
    <h2 id="scr-title" class="title">
      <span>Lead scoring</span>
      <span class="soft">and qualification</span>
    </h2>

    <div class="grid">
      <!-- left: text + scoring rules you can switch -->
      <div class="copy">
        <p>
          Not every enquiry deserves the same urgency. Set your own scoring rules based on source, budget, location, product
          interest or engagement, and Saptivo ranks leads so your team calls the hottest ones first.
        </p>
        <p>Add qualification stages that match your process, from New to Contacted to Qualified.</p>

        <div class="rules" role="group" aria-label="Scoring rules">
          <div class="rules-head"><span>Scoring rule</span><span>Points</span></div>
          <button
            v-for="r in rules"
            :key="r.key"
            type="button"
            class="rule"
            :class="{ on: r.on }"
            role="switch"
            :aria-checked="r.on"
            @click="flip(r)"
          >
            <span class="sw" aria-hidden="true"></span>
            <span class="rt">
              <b>{{ r.name }}</b>
              <small>{{ r.crit }}</small>
            </span>
            <span class="pts">+{{ r.pts }}</span>
          </button>
        </div>
      </div>

      <!-- right: ranked leads -->
      <div class="panel" :style="panelStyle">
        <div class="sheet">
          <div class="sh-head">
            <b>Leads</b>
            <span>Ranked by score</span>
          </div>

          <div class="cols" aria-hidden="true">
            <span></span><span>Lead</span><span>Score</span><span>Stage</span>
          </div>

          <TransitionGroup name="rank" tag="ol" class="rows">
            <li v-for="(l, i) in ranked" :key="l.id" class="row" :class="{ top: i === 0 }">
              <span class="rk">{{ i + 1 }}</span>
              <span class="who">
                <b>{{ l.name }}<em v-if="i === 0">Call first</em></b>
                <small>{{ l.source }} · {{ l.budget }} · {{ l.city }}</small>
              </span>
              <span class="sc">
                <span class="sc-top"><b>{{ l.score }}</b><i :class="level(l.score).cls">{{ level(l.score).label }}</i></span>
                <span class="meter"><i :class="level(l.score).cls" :style="{ width: (l.score / maxPts) * 100 + '%' }"></i></span>
              </span>
              <button type="button" class="stage" :class="'s' + l.stage" :aria-label="`${l.name}: ${stages[l.stage]}. Move to next stage`" @click="advance(l.id)">
                <span class="segs" aria-hidden="true"><i v-for="n in 3" :key="n" :class="{ on: n <= l.stage + 1 }"></i></span>
                {{ stages[l.stage] }}
              </button>
            </li>
          </TransitionGroup>

          <div class="flow" aria-label="Leads per stage">
            <div v-for="(s, i) in stages" :key="s" class="fs">
              <span class="fn">{{ stageCount[i] }}</span>
              <span class="fl">{{ s }}</span>
              <svg v-if="i < stages.length - 1" class="arr" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            </div>
          </div>
        </div>
        <p class="hint">Switch rules on the left and click a stage to move a lead.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "LeadScoringSection" });

// Optional background photo for the leads panel (set to "" for flat colour).
const bgImage = "/images/features/lead-scoring-bg.jpg";
const panelStyle = bgImage ? { backgroundImage: `url("${bgImage}")` } : {};

const stages = ["New", "Contacted", "Qualified"];

const rules = reactive([
  { key: "source", name: "Source", crit: "Facebook Lead Ads or WhatsApp", pts: 15, on: true },
  { key: "budget", name: "Budget", crit: "Above Rs. 250,000", pts: 25, on: true },
  { key: "location", name: "Location", crit: "Colombo and suburbs", pts: 10, on: true },
  { key: "interest", name: "Product interest", crit: "Asked for a demo", pts: 20, on: false },
  { key: "engage", name: "Engagement", crit: "Replied in the last 24 hours", pts: 15, on: false },
]);
const maxPts = rules.reduce((s, r) => s + r.pts, 0);

const leads = reactive([
  { id: 1, name: "Nimal Perera", source: "Facebook", budget: "Rs. 385K", city: "Colombo", stage: 1, m: { source: 1, budget: 1, location: 1, interest: 1, engage: 1 } },
  { id: 2, name: "Ayesha Fernando", source: "WhatsApp", budget: "Rs. 120K", city: "Kandy", stage: 0, m: { source: 1, budget: 0, location: 0, interest: 0, engage: 1 } },
  { id: 3, name: "Kasun Silva", source: "Website", budget: "Rs. 600K", city: "Galle", stage: 0, m: { source: 0, budget: 1, location: 0, interest: 1, engage: 0 } },
  { id: 4, name: "Dilini Jayasinghe", source: "Facebook", budget: "Rs. 90K", city: "Colombo", stage: 2, m: { source: 1, budget: 0, location: 1, interest: 0, engage: 0 } },
  { id: 5, name: "Ruwan Madushanka", source: "Import", budget: "Rs. 300K", city: "Jaffna", stage: 1, m: { source: 0, budget: 1, location: 0, interest: 0, engage: 1 } },
  { id: 6, name: "Tharindu Bandara", source: "Website", budget: "Rs. 50K", city: "Matara", stage: 0, m: { source: 0, budget: 0, location: 0, interest: 0, engage: 0 } },
]);

const ranked = computed(() =>
  leads
    .map((l) => ({ ...l, score: rules.reduce((s, r) => (r.on && l.m[r.key] ? s + r.pts : s), 0) }))
    .sort((a, b) => b.score - a.score || a.id - b.id)
);
const stageCount = computed(() => stages.map((_, i) => leads.filter((l) => l.stage === i).length));

function level(score) {
  if (score >= 60) return { label: "Hot", cls: "hot" };
  if (score >= 30) return { label: "Warm", cls: "warm" };
  return { label: "Cold", cls: "cold" };
}

const manual = ref(false); // once someone interacts, the demo stops
function flip(r) { manual.value = true; r.on = !r.on; }
function advance(id) {
  manual.value = true;
  const l = leads.find((x) => x.id === id);
  if (l) l.stage = (l.stage + 1) % stages.length;
}

// demo script: one rule flips per beat
const script = ["interest", "engage", "budget", "location", "budget", "location", "interest", "engage"];
let beat = 0;
function demo() {
  if (manual.value) return;
  const r = rules.find((x) => x.key === script[beat % script.length]);
  if (r) r.on = !r.on;
  beat += 1;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(demo, 2400);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true; // static state, no demo
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
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.scr {
  --orange: #ff6338;
  --orange-soft: #fff1ec;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #f1e7e2;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Inter", system-ui, sans-serif;
}
.scr *, .scr *::before, .scr *::after { box-sizing: border-box; }
.scr button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15;
  letter-spacing: -0.03em; color: var(--ink);
}
.title span { display: block; }
.title .soft { color: var(--muted); }

.grid {
  width: min(1180px, calc(100% - 40px)); margin: 64px auto 0;
  display: grid; grid-template-columns: 1.15fr 1fr; gap: 72px; align-items: center;
}

/* ---------- copy + rules ---------- */
.copy { min-width: 0; grid-column: 2; grid-row: 1; }
.copy > p { margin: 0 0 18px; font-size: 16px; line-height: 1.75; color: var(--muted); max-width: 54ch; }
.copy > p:nth-of-type(2) { color: var(--ink); font-weight: 500; }

.rules { margin-top: 28px; border-top: 1px solid var(--line); }
.rules-head { display: flex; justify-content: space-between; padding: 10px 0; font-size: 11.5px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; color: #a39d97; }
.rule {
  display: flex; align-items: center; gap: 14px; width: 100%; padding: 14px 0;
  background: none; border: 0; border-top: 1px solid var(--line); text-align: left; cursor: pointer;
  font-family: "Poppins", system-ui, sans-serif; color: #9a948d; transition: color 0.3s;
}
.rule.on { color: var(--ink); }
.sw { position: relative; flex: none; width: 34px; height: 20px; border-radius: 99px; background: #e6dcd7; transition: background 0.3s; }
.sw::after { content: ""; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25); transition: left 0.3s cubic-bezier(0.3, 1.4, 0.5, 1); }
.rule.on .sw { background: var(--orange); }
.rule.on .sw::after { left: 17px; }
.rt { flex: 1; min-width: 0; }
.rt b { display: block; font-size: 14.5px; font-weight: 500; }
.rt small { display: block; margin-top: 1px; font-size: 12.5px; color: var(--muted); }
.pts { flex: none; min-width: 40px; text-align: right; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; color: #c9c2bc; transition: color 0.3s; }
.rule.on .pts { color: var(--orange); }

/* ---------- panel ---------- */
.panel { position: relative; grid-column: 1; grid-row: 1; padding: 26px; border-radius: 28px; min-width: 0; background-color: #ffd9c2; background-size: cover; background-position: center; }
.sheet { padding: 16px 18px 14px; border-radius: 20px; background: #fff; box-shadow: 0 18px 40px rgba(120, 50, 20, 0.2); }
.sh-head { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 12px; }
.sh-head b { font-size: 14px; font-weight: 600; }
.sh-head span { font-size: 12px; color: var(--muted); }
.cols, .row { display: grid; grid-template-columns: 22px minmax(0, 1fr) 112px 112px; align-items: center; gap: 12px; }
.cols { padding: 8px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); font-size: 10.5px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }

.rows { position: relative; list-style: none; margin: 0; padding: 0; }
.row { position: relative; width: 100%; padding: 11px 0; border-bottom: 1px solid var(--line); background: #fff; }
.row.top::before { content: ""; position: absolute; left: -18px; top: 8px; bottom: 8px; width: 3px; border-radius: 3px; background: var(--orange); }
.rk { font-size: 12.5px; font-weight: 600; color: #b8b1ab; font-variant-numeric: tabular-nums; }
.row.top .rk { color: var(--orange); }
.who { min-width: 0; }
.who b { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 500; white-space: nowrap; }
.who em { font-style: normal; font-size: 10.5px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: var(--orange); }
.who small { display: block; margin-top: 1px; font-size: 11.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.sc { display: grid; gap: 5px; }
.sc-top { display: flex; align-items: baseline; gap: 8px; }
.sc-top b { min-width: 22px; font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums; }
.sc-top i { font-style: normal; font-size: 11px; font-weight: 500; }
.meter { display: block; height: 5px; border-radius: 3px; background: #f4efec; overflow: hidden; }
.meter i { display: block; height: 100%; border-radius: 3px; transition: width 0.7s cubic-bezier(0.2, 0.7, 0.2, 1), background 0.3s; }
.hot { color: #e5481c; } .meter .hot { background: var(--orange); }
.warm { color: #b8860b; } .meter .warm { background: #f0b34a; }
.cold { color: #8a857f; } .meter .cold { background: #cfc8c2; }

.stage {
  display: inline-flex; align-items: center; gap: 8px; justify-self: start; padding: 6px 10px;
  border: 1px solid var(--line); border-radius: 8px; background: #fff; cursor: pointer;
  font: 500 12px "Poppins", system-ui, sans-serif; color: var(--ink); transition: border-color 0.25s, background 0.25s;
}
.stage:hover { border-color: rgba(255, 99, 56, 0.5); background: #fff8f5; }
.segs { display: inline-flex; gap: 2px; }
.segs i { width: 6px; height: 12px; border-radius: 1.5px; background: #e6dcd7; transition: background 0.3s; }
.segs i.on { background: var(--orange); }
.stage.s2 .segs i.on { background: #22a55a; }

/* re-ranking: rows glide to their new position */
.rank-move { transition: transform 0.65s cubic-bezier(0.2, 0.7, 0.2, 1); }

.flow { display: flex; align-items: center; margin-top: 14px; padding: 12px 4px 2px; }
.fs { flex: 1; display: flex; align-items: baseline; gap: 8px; }
.fn { font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; }
.fl { font-size: 12px; color: var(--muted); }
.arr { margin-left: auto; margin-right: 14px; align-self: center; color: #cfc8c2; }
.hint { margin: 14px 0 0; text-align: center; font-size: 12px; color: #7a4a36; }

/* ---------- entrance (runs once) ---------- */
.scr:not(.in) .copy, .scr:not(.in) .panel { opacity: 0; }
.scr.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.scr.in .title .soft { animation-delay: 0.1s; }
.scr.in .copy { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.scr.in .panel { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .grid { grid-template-columns: minmax(0, 1fr); gap: 48px; }
  .copy, .panel { grid-column: 1; }
  .copy { grid-row: 1; }
  .panel { grid-row: 2; }
  .copy > p { max-width: none; }
}
@media (max-width: 760px) {
  .scr { padding: 72px 0; }
  .grid { width: calc(100% - 32px); margin-top: 40px; }
  .panel { padding: 14px; border-radius: 22px; }
  .sheet { padding: 14px 14px 12px; }
  .cols, .row { grid-template-columns: 18px minmax(0, 1fr) 84px; gap: 10px; }
  .cols span:nth-child(4) { display: none; }
  .row .stage { grid-column: 2 / -1; }
  .row.top::before { left: -14px; }
  .who small { font-size: 11px; }
}
@media (prefers-reduced-motion: reduce) {
  .scr *, .scr *::before, .scr *::after { animation: none !important; transition: none !important; }
  .scr:not(.in) .copy, .scr:not(.in) .panel { opacity: 1; }
}
</style>
