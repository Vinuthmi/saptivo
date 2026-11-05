<template>
  <section id="lead-routing" ref="root" class="lr" :class="{ in: seen, live }" aria-labelledby="lr-title">
    <div class="wrap">
      <!-- ============ copy + method switch ============ -->
      <div class="copy">
        <h2 id="lr-title" class="title">Smart lead routing</h2>
        <p>
          Share incoming leads across your team by round-robin or by territory rules, with no manual sorting. A lead from Kandy
          goes to your Kandy rep; a lead for a solar quote goes to your solar team. Managers can reassign at any time.
        </p>

        <div class="seg" role="tablist" aria-label="Routing method" :style="{ '--i': modeIndex }">
          <i class="thumb" aria-hidden="true"></i>
          <button
            v-for="m in modes"
            :key="m.key"
            type="button"
            role="tab"
            class="segb"
            :class="{ on: m.key === mode }"
            :aria-selected="m.key === mode"
            @click="choose(m.key)"
          >{{ m.label }}</button>
        </div>
        <p :key="mode" class="mdesc" aria-live="polite">{{ modeDesc }}</p>
      </div>

      <!-- ============ live routing board ============ -->
      <div class="panel" :style="panelStyle">
        <div class="board" :class="mode">
          <!-- incoming lead / manager -->
          <div class="top">
            <div v-if="mode !== 'man'" :key="incoming ? incoming.id : 'none'" class="card lead-in" :class="{ idle: !incoming }">
              <template v-if="incoming">
                <span class="src" :class="incoming.src.toLowerCase()" aria-hidden="true">{{ incoming.src.charAt(0) }}</span>
                <div class="who">
                  <b>{{ incoming.name }}</b>
                  <small>New lead · {{ incoming.src }}</small>
                </div>
                <div class="tags"><span>{{ incoming.place }}</span><span>{{ incoming.topic }}</span></div>
              </template>
              <template v-else>
                <span class="src wait" aria-hidden="true"></span>
                <div class="who"><b>Waiting for the next lead</b><small>Website · Facebook · WhatsApp</small></div>
              </template>
            </div>
            <div v-else class="card lead-in mgr">
              <span class="src mg" aria-hidden="true">MD</span>
              <div class="who">
                <b>Maya · Sales manager</b>
                <small :key="mgrMsg">{{ mgrMsg }}</small>
              </div>
              <span class="tags"><span>Reassign</span></span>
            </div>
          </div>

          <!-- engine -->
          <div class="engine">
            <span class="eic" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h10l-3-3M20 17H10l3 3" /><path d="M4 17h3M17 7h3" /></svg>
            </span>
            <div class="elabel">
              <b>{{ modeTitle }}</b>
              <small :key="rule">{{ rule || 'Ready' }}</small>
            </div>
            <div v-if="mode === 'rr'" class="rrdots" aria-hidden="true"><i v-for="n in 3" :key="n" :class="{ next: nextRep === n - 1 }"></i></div>
            <span class="unas">Unassigned <b>0</b></span>
          </div>

          <!-- connectors -->
          <div class="links" aria-hidden="true">
            <i v-for="(r, i) in reps" :key="'ln' + i + '-' + lineKey" class="ln" :class="{ on: activeRep === i }"><b></b></i>
          </div>

          <!-- reps -->
          <div class="reps">
            <div v-for="(r, i) in reps" :key="r.name" class="rep" :class="{ active: activeRep === i, target: targetRep === i }">
              <div class="rh">
                <span class="av" :style="{ background: r.bg, color: r.fg }">{{ r.ini }}</span>
                <div class="rn">
                  <b>{{ r.name }}</b>
                  <small>{{ r.role }}</small>
                </div>
                <span :key="r.count" class="count">{{ r.count }}</span>
              </div>
              <ul class="rl">
                <li v-for="l in r.list" :key="l.id" :class="{ fresh: l.id === freshId, lift: l.id === liftId }">
                  <b>{{ l.name }}</b>
                  <small>{{ l.place }} · {{ l.topic }}</small>
                </li>
              </ul>
            </div>
          </div>

          <div class="toast" :class="{ show: toast }" role="status">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
            Reassigned by Maya
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

// Optional background photo behind the board. Put a picture in public/images/ and set the path,
// or leave "" for the flat tinted panel.
const bgImage = "";
const panelStyle = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

const modes = [
  { key: "rr", label: "Round-robin", title: "Round-robin", desc: "Leads are shared evenly, one rep after another, with no manual sorting." },
  { key: "terr", label: "Territory rules", title: "Territory rules", desc: "Rules match the place and the product: Kandy to the Kandy rep, solar quotes to the solar team." },
  { key: "man", label: "Reassign", title: "Manager override", desc: "Managers can reassign at any time." },
];

const reps = reactive([
  { name: "Nuwan Silva", role: "Kandy rep", ini: "NS", bg: "#ffe3d6", fg: "#c4400f", list: [], count: 0 },
  { name: "Ishara Perera", role: "Colombo rep", ini: "IP", bg: "#e3efff", fg: "#0b57d0", list: [], count: 0 },
  { name: "Dilani Fernando", role: "Solar team", ini: "DF", bg: "#e6f6ec", fg: "#15803d", list: [], count: 0 },
]);

const feed = [
  { name: "Chaminda R.", place: "Kandy", topic: "CRM demo", src: "Facebook" },
  { name: "Sachini W.", place: "Colombo", topic: "Service contract", src: "WhatsApp" },
  { name: "Farhan A.", place: "Galle", topic: "Solar quote", src: "Website" },
  { name: "Tharindu M.", place: "Kandy", topic: "Quotation", src: "Facebook" },
  { name: "Nadeesha K.", place: "Colombo", topic: "Solar quote", src: "Website" },
  { name: "Ruwan D.", place: "Matara", topic: "CRM demo", src: "WhatsApp" },
];
const LEN = { rr: 12, terr: 12, man: 10 }; // beats per method (1 beat = 1.2 s)

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const mode = ref("rr");
const incoming = ref(null);
const activeRep = ref(-1);
const targetRep = ref(-1);
const nextRep = ref(0);
const rule = ref("");
const lineKey = ref(0);
const freshId = ref(0);
const liftId = ref(0);
const toast = ref(false);
const mgrMsg = ref("Opens the team board");

const modeIndex = computed(() => modes.findIndex((m) => m.key === mode.value));
const modeDesc = computed(() => modes[modeIndex.value].desc);
const modeTitle = computed(() => modes[modeIndex.value].title);

// plain bookkeeping, kept out of the template
const st = { beat: 0, id: 100, i: 0, rr: 0, manual: false, timer: null, io: null, fallback: null };

function clearBoard() {
  reps.forEach((r) => { r.list = []; r.count = 0; });
  incoming.value = null;
  activeRep.value = -1;
  targetRep.value = -1;
  freshId.value = 0;
  liftId.value = 0;
  toast.value = false;
  rule.value = "";
  st.i = 0;
  st.rr = 0;
  nextRep.value = 0;
}

function seedManagerBoard() {
  const mk = (k) => ({ ...feed[k], id: ++st.id });
  reps[0].list = [mk(0), mk(3)]; reps[0].count = 2;
  reps[1].list = [mk(1)]; reps[1].count = 1;
  reps[2].list = [mk(2)]; reps[2].count = 1;
  mgrMsg.value = "Opens the team board";
}

function setMode(key) {
  mode.value = key;
  st.beat = 0;
  clearBoard();
  if (key === "man") seedManagerBoard();
}
function choose(key) {
  st.manual = true; // once someone picks a method, stay on it
  setMode(key);
}

function route(lead) {
  if (mode.value === "terr") {
    if (lead.topic === "Solar quote") return { idx: 2, why: "Solar quote → Solar team" };
    if (lead.place === "Kandy") return { idx: 0, why: "Kandy → Kandy rep" };
    if (lead.place === "Colombo") return { idx: 1, why: "Colombo → Colombo rep" };
    const idx = st.rr++ % 3;
    nextRep.value = st.rr % 3;
    return { idx, why: "No rule matched → round-robin" };
  }
  const idx = st.rr++ % 3;
  nextRep.value = st.rr % 3;
  return { idx, why: "Next in line → " + reps[idx].name.split(" ")[0] };
}

function leadStep(b) {
  if (b % 2 === 0) {
    incoming.value = { ...feed[st.i % feed.length], id: ++st.id };
    st.i += 1;
    activeRep.value = -1;
    rule.value = "Routing…";
  } else if (incoming.value) {
    const { idx, why } = route(incoming.value);
    const r = reps[idx];
    r.list.unshift({ ...incoming.value });
    if (r.list.length > 3) r.list.pop();
    r.count += 1;
    freshId.value = incoming.value.id;
    activeRep.value = idx;
    lineKey.value += 1;
    rule.value = why;
  }
}

function managerStep(b) {
  if (b === 2) { liftId.value = reps[0].list[0].id; mgrMsg.value = "Selects " + reps[0].list[0].name; }
  if (b === 4) { targetRep.value = 1; mgrMsg.value = "Reassign to Ishara Perera"; }
  if (b === 6) {
    const lead = reps[0].list.shift();
    reps[0].count -= 1;
    reps[1].list.unshift(lead);
    reps[1].count += 1;
    freshId.value = lead.id;
    liftId.value = 0;
    targetRep.value = -1;
    activeRep.value = 1;
    lineKey.value += 1;
    toast.value = true;
    mgrMsg.value = "Reassigned";
    rule.value = "Reassigned by a manager";
  }
  if (b === 8) toast.value = false;
}

function tick() {
  const b = st.beat;
  if (mode.value === "man") managerStep(b);
  else leadStep(b);
  st.beat += 1;
  if (st.beat >= LEN[mode.value]) {
    if (st.manual) setMode(mode.value);
    else setMode(modes[(modeIndex.value + 1) % modes.length].key);
  }
}

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(tick, 1200);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    // static picture: territory rules, five leads already routed
    seen.value = true;
    st.manual = true;
    setMode("terr");
    for (let k = 0; k < 11; k++) tick();
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
.lr {
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
  font-family: 'Urbanist', system-ui, sans-serif;
}
.lr *, .lr *::before, .lr *::after { box-sizing: border-box; }
.lr button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.wrap {
  width: min(1180px, calc(100% - 40px)); margin: 0 auto;
  display: grid; grid-template-columns: 0.92fr 1.18fr; gap: 64px; align-items: center;
}

/* ---------- copy ---------- */
.title { margin: 0 0 20px; font-size: clamp(36px, 4vw, 60px); font-weight: 500; line-height: 1.1; letter-spacing: -0.035em; text-wrap: balance; }
.copy > p { margin: 0; max-width: 52ch; font-size: 16px; line-height: 1.75; color: var(--muted); }

.seg { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 32px; padding: 4px; border-radius: 16px; background: #f4efec; }
.thumb {
  position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc((100% - 8px) / 3);
  border-radius: 12px; background: #fff; box-shadow: 0 1px 2px rgba(20, 18, 15, 0.08), 0 6px 16px rgba(20, 18, 15, 0.08);
  transform: translateX(calc(var(--i) * 100%)); transition: transform 0.5s cubic-bezier(0.3, 1.2, 0.4, 1);
}
.segb { position: relative; z-index: 1; padding: 11px 6px; border: 0; background: none; border-radius: 12px; font: 500 13.5px "Poppins", system-ui, sans-serif; color: #8a857f; cursor: pointer; transition: color 0.3s; }
.segb.on { color: var(--ink); }
.mdesc { margin: 18px 0 0; min-height: 3.2em; max-width: 46ch; font-size: 15px; line-height: 1.65; color: var(--ink); font-weight: 500; animation: rise 0.45s ease both; }

/* ---------- board ---------- */
.panel { min-width: 0; padding: 22px; border-radius: 30px; background-color: #fbf3ee; background-size: cover; background-position: center; border: 1px solid var(--line); }
.board { position: relative; display: flex; flex-direction: column; }
.card { background: #fff; border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 1px 2px rgba(80, 40, 20, 0.04), 0 10px 24px -14px rgba(80, 40, 20, 0.3); }

.top { min-height: 72px; }
.lead-in { display: flex; align-items: center; gap: 12px; padding: 13px 14px; animation: slideIn 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.lead-in.idle { opacity: 0.7; }
.src { flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; color: #fff; font-size: 14px; font-weight: 600; }
.src.facebook { background: #0866ff; }
.src.whatsapp { background: #25b865; }
.src.website { background: var(--orange); }
.src.mg { background: #14120f; font-size: 12px; }
.src.wait { background: #ece4df; }
.who { min-width: 0; flex: 1; }
.who b { display: block; font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.who small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; animation: rise 0.4s ease both; }
.tags { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
.tags span { padding: 4px 9px; border-radius: 99px; background: #f4efec; color: #5d5651; font-size: 11px; font-weight: 500; white-space: nowrap; }

.engine { display: flex; align-items: center; gap: 12px; margin-top: 14px; padding: 12px 14px; border-radius: 16px; background: var(--ink); color: #fff; }
.eic { flex: none; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: var(--orange); }
.live .eic { animation: ping 1.8s ease-out infinite; }
.elabel { min-width: 0; flex: 1; }
.elabel b { display: block; font-size: 13px; font-weight: 600; }
.elabel small { display: block; font-size: 12px; color: rgba(255, 255, 255, 0.72); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; animation: rise 0.4s ease both; }
.rrdots { display: flex; gap: 6px; }
.rrdots i { width: 9px; height: 9px; border-radius: 50%; background: rgba(255, 255, 255, 0.25); transition: background 0.3s, transform 0.3s; }
.rrdots i.next { background: var(--orange); transform: scale(1.3); }
.unas { flex: none; padding: 5px 10px; border-radius: 99px; background: rgba(255, 255, 255, 0.12); font-size: 11px; color: rgba(255, 255, 255, 0.8); white-space: nowrap; }
.unas b { color: #7dffb0; font-weight: 600; }

.links { display: grid; grid-template-columns: repeat(3, 1fr); height: 30px; }
.ln { position: relative; justify-self: center; width: 2px; height: 100%; border-radius: 2px; background: #eadfd8; overflow: hidden; }
.ln b { position: absolute; left: 0; top: -45%; width: 100%; height: 45%; border-radius: 2px; background: var(--orange); opacity: 0; }
.ln.on { background: rgba(255, 99, 56, 0.35); }
.ln.on b { opacity: 1; animation: drop 0.7s ease-in both; }

.reps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.rep { min-width: 0; padding: 12px; border-radius: 16px; background: #fff; border: 1px solid var(--line); transition: border-color 0.3s, box-shadow 0.4s, transform 0.4s; }
.rep.active { border-color: var(--orange); box-shadow: 0 0 0 4px rgba(255, 99, 56, 0.14), 0 14px 28px -14px rgba(255, 99, 56, 0.5); transform: translateY(-2px); }
.rep.target { border-color: var(--orange); border-style: dashed; background: #fff8f5; }
.rh { display: flex; align-items: center; gap: 8px; }
.av { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; font-size: 11px; font-weight: 600; }
.rn { min-width: 0; flex: 1; }
.rn b { display: block; font-size: 12.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rn small { display: block; font-size: 11px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.count { flex: none; min-width: 24px; padding: 3px 7px; border-radius: 99px; background: var(--orange-soft); color: var(--orange); font-size: 12px; font-weight: 600; text-align: center; font-variant-numeric: tabular-nums; animation: bump 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.rl { list-style: none; margin: 10px 0 0; padding: 0; display: grid; gap: 6px; min-height: 150px; align-content: start; }
.rl li { padding: 8px 10px; border-radius: 10px; background: #faf6f3; border: 1px solid transparent; }
.rl li b { display: block; font-size: 12px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rl li small { display: block; font-size: 10.5px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rl li.fresh { animation: enter 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both, flash 1.6s ease 0.1s both; }
.rl li.lift { background: #fff; border-color: var(--orange); box-shadow: 0 10px 22px -10px rgba(255, 99, 56, 0.55); transform: translateY(-3px) scale(1.03); transition: transform 0.3s, box-shadow 0.3s; }

.toast {
  position: absolute; left: 50%; bottom: -14px; display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 14px; border-radius: 99px; background: #15803d; color: #fff; font-size: 12px; font-weight: 600;
  box-shadow: 0 12px 26px -8px rgba(21, 128, 61, 0.6); white-space: nowrap;
  opacity: 0; transform: translate(-50%, 10px) scale(0.92); transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1); pointer-events: none;
}
.toast.show { opacity: 1; transform: translate(-50%, 0) scale(1); }

/* ---------- entrance + pause when off screen ---------- */
.lr:not(.in) .copy, .lr:not(.in) .panel { opacity: 0; }
.lr.in .copy { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.lr.in .panel { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes slideIn { from { opacity: 0; transform: translateY(-14px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes enter { from { opacity: 0; transform: translateY(-12px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes flash { from { background: #ffe9df; border-color: rgba(255, 99, 56, 0.5); } to { background: #faf6f3; border-color: transparent; } }
@keyframes bump { from { transform: scale(1.5); background: var(--orange); color: #fff; } to { transform: none; } }
@keyframes drop { from { top: -45%; } to { top: 100%; } }
@keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(255, 99, 56, 0.55); } 100% { box-shadow: 0 0 0 12px rgba(255, 99, 56, 0); } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .wrap { grid-template-columns: minmax(0, 1fr); gap: 48px; }
  .copy > p, .mdesc { max-width: none; }
}
@media (max-width: 700px) {
  .lr { padding: 72px 0; }
  .wrap { width: calc(100% - 32px); }
  .panel { padding: 14px; border-radius: 24px; }
  .links { display: none; }
  .reps { grid-template-columns: minmax(0, 1fr); margin-top: 12px; }
  .rl { min-height: 0; }
  .tags span:nth-child(2) { display: none; }
  .segb { font-size: 12.5px; padding: 10px 2px; }
}
@media (prefers-reduced-motion: reduce) {
  .lr *, .lr *::before, .lr *::after { animation: none !important; transition: none !important; }
  .lr:not(.in) .copy, .lr:not(.in) .panel { opacity: 1; }
}
</style>
