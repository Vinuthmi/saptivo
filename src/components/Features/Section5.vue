<template>
  <section id="one-system" ref="root" class="one" :class="{ in: seen, live }" aria-labelledby="one-title">
    <h2 id="one-title" class="title">
      <span>Why all these CRM modules</span>
      <span class="soft">live in one system</span>
    </h2>

    <div class="grid">
      <!-- text + module switches -->
      <div class="copy">
        <p>
          Most growing businesses stitch together a contact list, a WhatsApp phone, an invoicing tool and a spreadsheet of
          service dates. Each tool holds part of the story. Saptivo's CRM modules are built on one database, so a lead captured
          on Facebook becomes a deal, a quotation, an invoice and, months later, a service contract, without anyone retyping a thing.
        </p>
        <p>You only switch on the modules you need today. Add more later at no upgrade fee.</p>

        <div class="mods" role="group" aria-label="CRM modules">
          <button
            v-for="m in modules"
            :key="m.name"
            type="button"
            class="mod"
            :class="{ on: m.on }"
            role="switch"
            :aria-checked="m.on"
            @click="flip(m)"
          >
            <span class="mname">{{ m.name }}</span>
            <span class="sw" aria-hidden="true"></span>
          </button>
        </div>

        <div class="fee" :class="{ show: allOn }" aria-live="polite">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
          Every module added later: no upgrade fee
        </div>
      </div>

      <!-- animated journey of one customer record -->
      <div class="panel" :style="panelStyle">
        <div class="rec">
          <div class="rec-head">
            <span class="av" aria-hidden="true">NP</span>
            <div class="who">
              <b>Nimal Perera</b>
              <small>One customer record · #C-2041</small>
            </div>
            <span class="zero"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>0 fields retyped</span>
          </div>
          <div class="layers" aria-live="polite">
            <div v-for="(s, i) in stages" :key="s.label" class="layer" :class="{ show: i === stage }" :aria-hidden="i !== stage">
              <span class="tag">{{ s.tag }}</span>
              <div>
                <b>{{ s.title }}</b>
                <small>{{ s.meta }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="journey" :class="{ snap }" :style="{ '--p': stage / 4 }">
          <div class="track" aria-hidden="true"><i class="fill"></i><i class="dot"></i></div>
          <ol class="nodes">
            <li v-for="(s, i) in stages" :key="s.label" class="node" :class="{ on: i === stage, done: i < stage }">
              <span class="ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path v-for="(d, k) in s.icon" :key="k" :d="d" /></svg>
              </span>
              <b>{{ s.label }}</b>
            </li>
          </ol>
        </div>

        <div class="links" aria-hidden="true">
          <i v-for="(s, i) in stages" :key="s.label" class="vl" :class="{ on: i === stage, done: i < stage }"><b></b></i>
        </div>

        <div class="db">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="8" ry="3" /><path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /><path d="M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>
          One database
          <i :key="stage" class="ripple" :style="{ '--k': stage }"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "FeaturesSection5" });

// Optional background photo for the animated panel. Put a picture in public/images/one-system/
// and change the path, or set it to "" to use a flat colour.
const bgImage = "/images/one-system/bg.jpg";
const panelStyle = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

const stages = [
  { label: "Lead", tag: "Lead", title: "Facebook ad enquiry", meta: "Score 86 · routed to Sales, Colombo", icon: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"] },
  { label: "Deal", tag: "Deal", title: "DL-0412 · Proposal sent", meta: "Rs. 385,000 · expected close 30 Nov", icon: ["M3 17l6-6 4 4 8-8", "M14 7h7v7"] },
  { label: "Quote", tag: "Quotation", title: "QT-0142 · PDF sent", meta: "Accepted by Nimal Perera", icon: ["M6 3h9l4 4v14H6z", "M14 3v5h5", "M9 13h6", "M9 17h6"] },
  { label: "Invoice", tag: "Invoice", title: "INV-0087 · Tax invoice", meta: "Rs. 385,000 · paid in full", icon: ["M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z", "M9 8h6", "M9 12h6"] },
  { label: "Service", tag: "Service contract", title: "AMC-2041 · 12 months", meta: "First visit 14 Mar 2027", icon: ["M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.1-.5-.5-2.1z"] },
];

const modules = reactive([
  { name: "Leads and contacts", on: true },
  { name: "WhatsApp CRM", on: true },
  { name: "Quotations and invoicing", on: true },
  { name: "Service and AMC", on: false },
  { name: "Inventory", on: false },
  { name: "Marketing campaigns", on: false },
]);
const allOn = computed(() => modules.every((m) => m.on));

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const stage = ref(0);
const snap = ref(false);
const manual = ref(false); // once someone clicks a switch, the demo stops flipping them

function flip(m) {
  manual.value = true;
  m.on = !m.on;
}
function resetModules() {
  modules.forEach((m, i) => { m.on = i < 3; });
}

// plain bookkeeping, kept out of the template
const st = { beat: 0, timer: null, io: null, fallback: null };
const CYCLE = 18; // 18 beats x 0.8 s = 14.4 s per loop

function step() {
  st.beat = (st.beat + 1) % CYCLE;
  const b = st.beat;
  stage.value = Math.min(4, Math.floor(b / 3));
  if (b === 0) {
    snap.value = true; // let the dot jump back to the start without sliding
    window.setTimeout(() => { snap.value = false; }, 80);
    if (!manual.value) resetModules();
  }
  if (!manual.value) {
    if (b === 4) modules[3].on = true;
    if (b === 7) modules[4].on = true;
    if (b === 10) modules[5].on = true;
  }
}
function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 800);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    // static final state: journey complete, every module on
    seen.value = true;
    stage.value = 4;
    modules.forEach((m) => { m.on = true; });
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

.one {
  --orange: #33485d;
  --orange-soft: #edf1f4;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #e4e9ed;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Inter", system-ui, sans-serif;
}
.one *, .one *::before, .one *::after { box-sizing: border-box; }
.one button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15;
  letter-spacing: -0.03em; color: var(--ink);
}
.title span { display: block; }
.title .soft { color: var(--muted); }

.grid {
  width: min(1180px, calc(100% - 40px)); margin: 64px auto 0;
  display: grid; grid-template-columns: 1fr 1.1fr; gap: 72px; align-items: center;
}

/* ---------- copy ---------- */
.copy p { margin: 0 0 18px; font-size: 16px; line-height: 1.75; color: var(--muted); max-width: 56ch; }
.copy p:nth-of-type(2) { color: var(--ink); font-weight: 500; }
.mods { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 26px; }
.mod {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 13px 14px; border: 1px solid var(--line); border-radius: 14px; background: #fff;
  font: 500 13.5px "Poppins", system-ui, sans-serif; color: #8a857f; text-align: left; cursor: pointer;
  transition: border-color 0.3s, background 0.3s, color 0.3s;
}
.mod.on { color: var(--ink); border-color: rgba(51, 72, 93, 0.35); background: #f5f7f8; }
.sw { position: relative; flex: none; width: 34px; height: 20px; border-radius: 99px; background: #e6dcd7; transition: background 0.3s; }
.sw::after { content: ""; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25); transition: left 0.3s cubic-bezier(0.3, 1.4, 0.5, 1); }
.mod.on .sw { background: var(--orange); }
.mod.on .sw::after { left: 17px; }
.fee {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; padding: 9px 14px;
  border-radius: 99px; background: #e6f6ec; color: #15803d; font-size: 13px; font-weight: 500;
  opacity: 0; transform: translateY(8px) scale(0.96);
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.fee.show { opacity: 1; transform: none; }

/* ---------- animated panel ---------- */
.panel {
  position: relative; display: flex; flex-direction: column; gap: 0; padding: 26px;
  border-radius: 28px; background-color: #dce5eb; background-size: cover; background-position: center;
  overflow: hidden; min-width: 0;
}
.rec { padding: 14px 16px 16px; border-radius: 18px; background: #fff; box-shadow: 0 18px 40px rgba(120, 50, 20, 0.2); }
.rec-head { display: flex; align-items: center; gap: 12px; }
.av { flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: var(--orange-soft); color: var(--orange); font-size: 13px; font-weight: 600; }
.who { min-width: 0; flex: 1; }
.who b { display: block; font-size: 14px; font-weight: 600; }
.who small { display: block; color: var(--muted); font-size: 11.5px; }
.zero { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 99px; background: #e6f6ec; color: #15803d; font-size: 11px; font-weight: 600; white-space: nowrap; }
.layers { position: relative; height: 52px; margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--line); }
.layer { position: absolute; inset: 12px 0 0 0; display: flex; align-items: center; gap: 12px; opacity: 0; transform: translateY(8px); transition: opacity 0.45s ease, transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1); }
.layer.show { opacity: 1; transform: none; }
.tag { flex: none; padding: 5px 10px; border-radius: 99px; background: var(--orange); color: #fff; font-size: 11px; font-weight: 600; white-space: nowrap; }
.layer b { display: block; font-size: 13px; font-weight: 500; }
.layer small { display: block; color: var(--muted); font-size: 11.5px; }

.journey { position: relative; margin-top: 30px; }
.track { position: absolute; left: 10%; right: 10%; top: 19px; height: 3px; border-radius: 3px; background: rgba(255, 255, 255, 0.75); }
.fill { position: absolute; inset: 0 auto 0 0; width: calc(var(--p) * 100%); border-radius: 3px; background: var(--orange); transition: width 0.8s cubic-bezier(0.3, 0.9, 0.3, 1); }
.dot { position: absolute; top: 50%; left: calc(var(--p) * 100%); width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 3px solid var(--orange); transform: translate(-50%, -50%); transition: left 0.8s cubic-bezier(0.3, 0.9, 0.3, 1); }
.snap .fill, .snap .dot { transition: none; }
.nodes { position: relative; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); }
.node { display: grid; justify-items: center; gap: 7px; }
.node b { font-size: 11.5px; font-weight: 500; color: #7a4a36; transition: color 0.3s; }
.ic { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: #fff; color: #9a948d; box-shadow: 0 6px 16px rgba(120, 50, 20, 0.15); transition: background 0.35s, color 0.35s, transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1); }
.node.done .ic { color: var(--orange); }
.node.on .ic { background: var(--orange); color: #fff; transform: scale(1.14); animation: ping 1.6s ease-out infinite; }
.node.on b { color: var(--ink); }

.links { display: grid; grid-template-columns: repeat(5, 1fr); margin-top: 6px; }
.vl { position: relative; justify-self: center; width: 2px; height: 26px; border-radius: 2px; overflow: hidden; background: rgba(255, 255, 255, 0.7); transition: background 0.4s; }
.vl.done { background: var(--orange); }
.vl b { position: absolute; left: 0; top: -45%; width: 100%; height: 45%; border-radius: 2px; background: var(--orange); opacity: 0; }
.vl.on b { opacity: 1; animation: drop 0.8s ease-in infinite; }

.db {
  position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 15px; border-radius: 16px; background: var(--ink); color: #fff; font-size: 13.5px; font-weight: 500;
  box-shadow: 0 14px 30px rgba(20, 18, 15, 0.3);
}
.db svg { color: var(--orange); }
.db::after { content: ""; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%); transform: translateX(-100%); animation: sheen 3.2s ease-in-out infinite; }
.ripple { position: absolute; top: 50%; left: calc(10% + var(--k) * 20%); width: 12px; height: 12px; border-radius: 50%; background: var(--orange); transform: translate(-50%, -50%); animation: ripple 1s ease-out both; }

/* ---------- entrance (runs once) + pause when off screen ---------- */
.one:not(.in) .copy, .one:not(.in) .panel { opacity: 0; }
.one.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.one.in .title .soft { animation-delay: 0.1s; }
.one.in .copy { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.one.in .panel { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
.one:not(.live) .node.on .ic, .one:not(.live) .vl.on b, .one:not(.live) .db::after, .one:not(.live) .ripple { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(51, 72, 93, 0.5), 0 6px 16px rgba(23, 25, 29, 0.15); } 100% { box-shadow: 0 0 0 14px rgba(51, 72, 93, 0), 0 6px 16px rgba(23, 25, 29, 0.15); } }
@keyframes drop { from { top: -45%; } to { top: 100%; } }
@keyframes sheen { 0%, 40% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes ripple { from { opacity: 0.9; transform: translate(-50%, -50%) scale(1); } to { opacity: 0; transform: translate(-50%, -50%) scale(14); } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .grid { grid-template-columns: minmax(0, 1fr); gap: 48px; }
  .copy p { max-width: none; }
}
@media (max-width: 760px) {
  .one { padding: 72px 0; }
  .grid { width: calc(100% - 32px); margin-top: 40px; }
  .panel { padding: 16px; border-radius: 22px; }
  .mods { grid-template-columns: minmax(0, 1fr); }
  .node b { font-size: 10.5px; }
  .ic { width: 34px; height: 34px; }
  .track { top: 17px; }
  .zero { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .one *, .one *::before, .one *::after { animation: none !important; transition: none !important; }
  .one:not(.in) .copy, .one:not(.in) .panel { opacity: 1; }
}
</style>
