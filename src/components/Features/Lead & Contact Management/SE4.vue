<template>
  <section id="contact-timeline" ref="root" class="ct" :class="{ in: seen, live }" aria-labelledby="ct-title">
    <div class="wrap">
      <!-- ============ live 360° contact panel ============ -->
      <div class="panel" :style="panelStyle">
        <div class="board">
          <!-- profile -->
          <div class="card pc">
            <div class="ringbox">
              <svg class="ring" :class="{ spin: done }" viewBox="0 0 120 120" aria-hidden="true">
                <g transform="rotate(-90 60 60)">
                  <circle
                    v-for="a in arcs"
                    :key="a.k"
                    class="arc"
                    :class="{ hot: a.hot }"
                    cx="60" cy="60" r="50" fill="none"
                    :stroke="a.lit ? a.color : '#eadfd8'"
                    stroke-width="7" stroke-linecap="round"
                    :stroke-dasharray="a.dash" :stroke-dashoffset="a.off"
                  />
                </g>
              </svg>
              <span class="avatar" aria-hidden="true">NP</span>
              <span class="deg" :class="{ on: done }">360°</span>
            </div>

            <div class="pinfo">
              <b class="pname">Nimal Perera</b>
              <small class="prole">Operations Manager · Ceylon Motors</small>
              <div class="owner">
                <span>Owner</span>
                <span :key="owner" class="ochip"><i class="oav">{{ owners[owner].ini }}</i>{{ owners[owner].name }}</span>
              </div>
            </div>

            <dl class="fields">
              <div><dt>Phone</dt><dd class="mono">+94 77 123 4567</dd></div>
              <div><dt>Email</dt><dd>nimal@ceylonmotors.lk</dd></div>
              <div>
                <dt>Social</dt>
                <dd class="social"><i>in</i><i>f</i><i>w</i></dd>
              </div>
              <div>
                <dt>Custom fields</dt>
                <dd class="cf"><span>Language: Sinhala</span><span>Fleet: 24 vehicles</span><span class="add">+ Add field</span></dd>
              </div>
            </dl>
          </div>

          <!-- legend / counts -->
          <ul class="chips" aria-label="Activity types">
            <li v-for="k in typeKeys" :key="k" class="chip" :class="{ lit: counts[k] > 0, hot: lastType === k }" :style="{ '--c': types[k].color }">
              <i class="dot"></i>{{ types[k].label }}
              <b :key="counts[k]" class="n">{{ counts[k] }}</b>
            </li>
          </ul>

          <!-- timeline -->
          <div class="tlwrap">
            <ul class="tl" aria-live="polite" aria-label="Activity timeline">
              <li v-for="e in events" :key="e.id" class="ev" :class="{ fresh: e.id === freshId }" :style="{ '--c': types[e.type].color }">
                <span class="eic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path v-for="(d, i) in types[e.type].icon" :key="i" :d="d" /></svg>
                </span>
                <div class="ebody">
                  <b>{{ e.title }}</b>
                  <small>{{ e.text }}</small>
                </div>
                <time class="mono">{{ e.time }}</time>
              </li>
            </ul>
            <span v-if="glowKey > 0" :key="glowKey" class="halo" aria-hidden="true"></span>
            <div class="toast" :class="{ show: toast }" role="status">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
              Ishara picked this up. The full history was already there.
            </div>
          </div>
        </div>
      </div>

      <!-- ============ copy ============ -->
      <div class="copy">
        <h2 id="ct-title" class="title">
          <span>Contact management CRM</span>
          <span class="soft">with a full 360° timeline</span>
        </h2>
        <p>
          Every contact gets a complete profile: name, company, role, phone, email, social links and any custom fields you need.
          The activity timeline shows every call, WhatsApp chat, email, meeting, quotation, invoice and note in one place.
        </p>
        <p class="strong">
          Saptivo's contact management CRM means anyone who picks up the relationship knows its full history.
        </p>
        <ul class="pills" aria-label="What a contact profile holds">
          <li v-for="(f, i) in fieldPills" :key="f" :style="{ '--i': i }">{{ f }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

// Optional background photo behind the panel. Put a picture in public/images/ and set the path,
// or leave "" for the flat tinted panel.
const bgImage = "";
const panelStyle = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

const fieldPills = ["Name", "Company", "Role", "Phone", "Email", "Social links", "Custom fields"];

const types = {
  call: { label: "Calls", color: "#ff6338", icon: ["M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"] },
  whatsapp: { label: "WhatsApp", color: "#25b865", icon: ["M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"] },
  email: { label: "Email", color: "#0b57d0", icon: ["M3 6h18v12H3z", "m3 7 9 6 9-6"] },
  meeting: { label: "Meetings", color: "#f59e0b", icon: ["M4 5h16v15H4z", "M4 10h16", "M8 3v4M16 3v4"] },
  quotation: { label: "Quotes", color: "#0d9488", icon: ["M6 3h9l4 4v14H6z", "M14 3v5h5", "M9 13h6", "M9 17h6"] },
  invoice: { label: "Invoices", color: "#7c3aed", icon: ["M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z", "M9 8h6", "M9 12h6"] },
  note: { label: "Notes", color: "#78716c", icon: ["M4 4h16v12l-4 4H4z", "M16 20v-4h4", "M8 9h8M8 13h5"] },
};
const typeKeys = Object.keys(types);

const pool = [
  { type: "call", title: "Outgoing call · 4 min", text: "Discussed the fleet service contract" },
  { type: "whatsapp", title: "WhatsApp chat", text: "Shared the brochure, asked for a site visit" },
  { type: "email", title: "Email sent", text: "Service plan proposal, version 2" },
  { type: "meeting", title: "Meeting · Kandy office", text: "Walkthrough with the workshop manager" },
  { type: "quotation", title: "Quotation QT-0142", text: "Rs. 385,000 · accepted" },
  { type: "invoice", title: "Invoice INV-0087", text: "Rs. 385,000 · paid in full" },
  { type: "note", title: "Note by Nuwan", text: "Prefers calls after 4 pm" },
];

const owners = [
  { name: "Nuwan Silva", ini: "NS" },
  { name: "Ishara Perera", ini: "IP" },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const events = ref([]);
const counts = reactive(Object.fromEntries(typeKeys.map((k) => [k, 0])));
const lastType = ref("");
const freshId = ref(0);
const owner = ref(0);
const done = ref(false);
const toast = ref(false);
const glowKey = ref(0);

// ring geometry: 7 arcs around a circle of radius 50
const C = 2 * Math.PI * 50;
const STEP = C / typeKeys.length;
const arcs = computed(() =>
  typeKeys.map((k, i) => ({
    k,
    color: types[k].color,
    lit: counts[k] > 0,
    hot: lastType.value === k,
    dash: `${(STEP - 11).toFixed(2)} ${(C - STEP + 11).toFixed(2)}`,
    off: (-i * STEP).toFixed(2),
  }))
);

// plain bookkeeping, kept out of the template
const st = { beat: 0, id: 0, clock: 10 * 60 + 24, timer: null, io: null, fallback: null };
const pad = (x) => String(x).padStart(2, "0");
const stamp = () => pad(Math.floor(st.clock / 60)) + ":" + pad(st.clock % 60);

function resetBoard() {
  events.value = [];
  typeKeys.forEach((k) => { counts[k] = 0; });
  lastType.value = "";
  freshId.value = 0;
  owner.value = 0;
  done.value = false;
  toast.value = false;
  glowKey.value = 0;
  st.clock = 10 * 60 + 24;
}

function addEvent(k) {
  const p = pool[k];
  st.clock += 5 + (k % 3) * 2;
  const e = { ...p, id: ++st.id, time: stamp() };
  events.value = [e, ...events.value].slice(0, 4);
  counts[p.type] += 1;
  lastType.value = p.type;
  freshId.value = e.id;
}

// 14 beats x 1.5 s: seven events arrive, the ring completes, the contact is handed over
function tick() {
  const b = st.beat;
  if (b === 0) resetBoard();
  if (b < pool.length) addEvent(b);
  if (b === 7) { done.value = true; lastType.value = ""; }
  if (b === 9) { owner.value = 1; toast.value = true; glowKey.value += 1; }
  if (b === 12) toast.value = false;
  st.beat = (b + 1) % 14;
}

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(tick, 1500);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    // static picture: all seven channels on the ring, the timeline filled
    seen.value = true;
    for (let k = 0; k < 8; k++) tick();
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
.ct {
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
.ct *, .ct *::before, .ct *::after { box-sizing: border-box; }

.wrap {
  width: min(1180px, calc(100% - 40px)); margin: 0 auto;
  display: grid; grid-template-columns: 1.15fr 0.95fr; gap: 64px; align-items: center;
}
.mono { font-variant-numeric: tabular-nums; }

/* ---------- copy ---------- */
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.copy p { margin: 0 0 16px; max-width: 52ch; font-size: 16px; line-height: 1.75; color: var(--muted); }
.copy p.strong { color: var(--ink); font-weight: 500; }
.pills { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin: 26px 0 0; padding: 0; }
.pills li { padding: 7px 14px; border-radius: 99px; border: 1px solid var(--line); background: #fff; font-size: 13px; font-weight: 500; color: #5d5651; }

/* ---------- panel ---------- */
.panel { min-width: 0; padding: 22px; border-radius: 30px; background-color: #fbf3ee; background-size: cover; background-position: center; border: 1px solid var(--line); }
.board { display: flex; flex-direction: column; gap: 14px; }
.card { background: #fff; border: 1px solid var(--line); border-radius: 18px; box-shadow: 0 1px 2px rgba(80, 40, 20, 0.04), 0 10px 24px -14px rgba(80, 40, 20, 0.3); }

.pc { display: grid; grid-template-columns: 118px 1fr; gap: 6px 18px; align-items: center; padding: 18px; }
.ringbox { position: relative; width: 118px; height: 118px; }
.ring { width: 100%; height: 100%; }
.arc { transition: stroke 0.5s ease; }
.arc.hot { animation: arcPop 0.8s ease-out both; }
.ring.spin { animation: spin 1.3s cubic-bezier(0.6, 0, 0.2, 1) both; }
.avatar { position: absolute; inset: 22px; display: grid; place-items: center; border-radius: 50%; background: var(--orange-soft); color: var(--orange); font-size: 22px; font-weight: 600; }
.deg { position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%); padding: 3px 9px; border-radius: 99px; background: #fff; border: 1px solid var(--line); color: #8a857f; font-size: 11px; font-weight: 600; transition: background 0.4s, color 0.4s, border-color 0.4s; }
.deg.on { background: var(--orange); border-color: var(--orange); color: #fff; }
.pname { display: block; font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
.prole { display: block; margin-top: 2px; color: var(--muted); font-size: 12.5px; }
.owner { display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 11.5px; color: var(--muted); }
.ochip { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 4px; border-radius: 99px; background: #f4efec; color: var(--ink); font-weight: 500; animation: swap 0.5s cubic-bezier(0.3, 1.4, 0.5, 1) both; }
.oav { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: var(--orange); color: #fff; font-size: 9px; font-style: normal; font-weight: 600; }

.fields { grid-column: 1 / -1; margin: 10px 0 0; padding-top: 14px; border-top: 1px dashed var(--line); display: grid; grid-template-columns: 1fr 1fr; gap: 10px 18px; }
.fields > div { min-width: 0; }
.fields dt { font-size: 10.5px; color: #9a948d; text-transform: uppercase; letter-spacing: 0.06em; }
.fields dd { margin: 2px 0 0; font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fields > div:nth-child(4) { grid-column: 1 / -1; }
.social { display: flex; gap: 6px; }
.social i { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 8px; background: #f4efec; color: #5d5651; font-size: 11px; font-style: normal; font-weight: 600; }
.cf { display: flex; flex-wrap: wrap; gap: 6px; overflow: visible; white-space: normal; }
.cf span { padding: 4px 10px; border-radius: 99px; background: #f4efec; font-size: 11.5px; font-weight: 500; color: #5d5651; }
.cf .add { background: none; border: 1px dashed #d8cdc6; color: #9a948d; }

.chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.chip { --c: #9a948d; display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px 6px 9px; border-radius: 99px; background: #fff; border: 1px solid var(--line); font-size: 11.5px; font-weight: 500; color: #9a948d; transition: color 0.3s, border-color 0.3s, background 0.3s; }
.chip .dot { width: 8px; height: 8px; border-radius: 50%; background: #d8cdc6; transition: background 0.3s; }
.chip.lit { color: var(--ink); }
.chip.lit .dot { background: var(--c); }
.chip.hot { border-color: var(--c); background: #fff; box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 18%, transparent); }
.n { min-width: 16px; padding: 1px 5px; border-radius: 99px; background: #f4efec; font-size: 11px; font-weight: 600; text-align: center; font-variant-numeric: tabular-nums; animation: bump 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) both; }

.tlwrap { position: relative; }
.tl { position: relative; list-style: none; margin: 0; padding: 0; min-height: 316px; display: flex; flex-direction: column; gap: 8px; }
.tl::before { content: ""; position: absolute; left: 31px; top: 20px; bottom: 20px; width: 2px; border-radius: 2px; background: #eadfd8; }
.halo { position: absolute; inset: 0; border-radius: 18px; pointer-events: none; animation: glow 1.4s ease-out both; }
.ev { --c: var(--orange); position: relative; display: flex; align-items: center; gap: 12px; min-height: 70px; padding: 12px 14px; background: #fff; border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 1px 2px rgba(80, 40, 20, 0.04); }
.eic { flex: none; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 12px; color: #fff; background: var(--c); }
.ebody { min-width: 0; flex: 1; }
.ebody b { display: block; font-size: 13.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ebody small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ev time { flex: none; color: #9a948d; font-size: 11.5px; }
.ev.fresh { animation: enter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both, flash 1.6s ease 0.1s both; }

.toast {
  position: absolute; left: 50%; bottom: -12px; display: inline-flex; align-items: center; gap: 7px; max-width: calc(100% - 20px);
  padding: 9px 14px; border-radius: 99px; background: #15803d; color: #fff; font-size: 12px; font-weight: 600;
  box-shadow: 0 12px 26px -8px rgba(21, 128, 61, 0.6);
  opacity: 0; transform: translate(-50%, 10px) scale(0.94); transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1); pointer-events: none;
}
.toast svg { flex: none; }
.toast.show { opacity: 1; transform: translate(-50%, 0) scale(1); }

/* ---------- entrance + pause ---------- */
.ct:not(.in) .copy, .ct:not(.in) .panel { opacity: 0; }
.ct.in .panel { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.ct.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.ct.in .title .soft { animation-delay: 0.2s; }
.ct.in .copy p { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
.ct.in .copy { opacity: 1; }
.ct.in .pills li { animation: pop 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) calc(0.5s + var(--i) * 0.07s) backwards; }
.ct.in .add { animation: blink 2.2s ease-in-out 1.5s infinite; }
.ct:not(.live) .add { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes pop { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: none; } }
@keyframes enter { from { opacity: 0; transform: translateY(-14px) scale(0.97); } to { opacity: 1; transform: none; } }
@keyframes flash { from { background: #fff4ee; border-color: rgba(255, 99, 56, 0.5); } to { background: #fff; border-color: var(--line); } }
@keyframes bump { from { transform: scale(1.6); background: var(--orange); color: #fff; } to { transform: none; } }
@keyframes arcPop { 0% { stroke-width: 7; } 35% { stroke-width: 13; } 100% { stroke-width: 7; } }
@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes swap { from { opacity: 0; transform: translateY(6px) scale(0.9); } to { opacity: 1; transform: none; } }
@keyframes glow { 0% { box-shadow: 0 0 0 0 rgba(255, 99, 56, 0.35); } 100% { box-shadow: 0 0 0 22px rgba(255, 99, 56, 0); } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .wrap { grid-template-columns: minmax(0, 1fr); gap: 48px; }
  .copy { order: -1; }
  .copy p { max-width: none; }
}
@media (max-width: 640px) {
  .ct { padding: 72px 0; }
  .wrap { width: calc(100% - 32px); }
  .panel { padding: 14px; border-radius: 24px; }
  .pc { grid-template-columns: 96px 1fr; padding: 14px; }
  .ringbox { width: 96px; height: 96px; }
  .avatar { inset: 18px; font-size: 18px; }
  .fields { grid-template-columns: minmax(0, 1fr); }
  .chip { padding: 5px 8px; }
  .ev time { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ct *, .ct *::before, .ct *::after { animation: none !important; transition: none !important; }
  .ct:not(.in) .copy, .ct:not(.in) .panel { opacity: 1; }
}
</style>
