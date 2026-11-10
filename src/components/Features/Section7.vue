<template>
  <section id="who-uses" ref="root" class="who" :class="{ in: seen, live }" aria-labelledby="who-title">
    <h2 id="who-title" class="title">
      <span>Who uses</span>
      <span class="soft">Saptivo's CRM features</span>
    </h2>

    <div class="grid">
      <!-- animated panel: what each team sees + one-click handover -->
      <div class="panel" :style="panelStyle">
        <div class="win">
          <div class="win-head">
            <span class="badge">{{ roles[active].name }}</span>
            <span class="same"><i class="pulse" aria-hidden="true"></i>Same system</span>
          </div>
          <div class="rows" aria-live="polite">
            <ul v-for="(r, i) in roles" :key="r.key" class="list" :class="{ show: i === active }" :aria-hidden="i !== active">
              <li v-for="row in r.rows" :key="row.t">
                <span class="dotk" aria-hidden="true"></span>
                <div>
                  <b>{{ row.t }}</b>
                  <small>{{ row.m }}</small>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="hand" :key="active">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
          <span>Handover to <b>{{ roles[(active + 1) % roles.length].name }}</b></span>
          <em>1 click</em>
        </div>

        <div class="chain" :class="{ snap }" :style="{ '--p': active / 3 }">
          <div class="track" aria-hidden="true"><i class="fill"></i><i class="dot"></i></div>
          <ol class="nodes">
            <li v-for="(r, i) in roles" :key="r.key" class="node" :class="{ on: i === active, done: i < active }">
              <span class="ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path v-for="(d, k) in r.icon" :key="k" :d="d" /></svg>
              </span>
              <b>{{ r.short }}</b>
            </li>
          </ol>
        </div>

        <div class="db">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="8" ry="3" /><path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /><path d="M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>
          Everyone works from one system
        </div>
      </div>

      <!-- text + role picker -->
      <div class="copy">
        <p>
          Sales teams use the pipeline, quotations and WhatsApp inbox every day. Support teams live in the help desk and
          customer portal. Service managers plan technicians and contracts. Owners and directors watch reports and the HQ dashboard.
        </p>
        <p>Because everyone works from the same system, handovers between teams happen in one click rather than one email at a time.</p>

        <div class="roles" role="group" aria-label="Teams that use Saptivo CRM">
          <button
            v-for="(r, i) in roles"
            :key="r.key"
            type="button"
            class="role"
            :class="{ on: i === active }"
            :aria-pressed="i === active"
            @click="pick(i)"
          >
            <span class="rico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path v-for="(d, k) in r.icon" :key="k" :d="d" /></svg>
            </span>
            <span class="rtxt">
              <b>{{ r.name }}</b>
              <small>{{ r.uses }}</small>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "FeaturesSection6" });

// Optional background photo for the animated panel. Put a picture in public/images/who-uses/
// and change the path, or set it to "" to use a flat colour.
const bgImage = "/images/who-uses/bg.jpg";
const panelStyle = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

const roles = [
  {
    key: "sales", name: "Sales teams", short: "Sales", uses: "Pipeline · Quotations · WhatsApp inbox",
    icon: ["M3 17l6-6 4 4 8-8", "M14 7h7v7"],
    rows: [
      { t: "DL-0412 · Proposal sent", m: "Rs. 385,000 · expected close 30 Nov" },
      { t: "QT-0142 · Quotation PDF", m: "Sent on WhatsApp, awaiting reply" },
      { t: "WhatsApp · Nimal Perera", m: "Asked about the installation date" },
    ],
  },
  {
    key: "support", name: "Support teams", short: "Support", uses: "Help desk · Customer portal",
    icon: ["M4 14v-2a8 8 0 0 1 16 0v2", "M4 14h3v5H5a1 1 0 0 1-1-1z", "M20 14h-3v5h2a1 1 0 0 0 1-1z"],
    rows: [
      { t: "TK-318 · Inverter not starting", m: "Priority high · due today" },
      { t: "Portal request · Kamal S.", m: "Warranty claim submitted" },
      { t: "TK-321 · Reply sent", m: "Waiting on customer" },
    ],
  },
  {
    key: "service", name: "Service managers", short: "Service", uses: "Technician planning · Contracts",
    icon: ["M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.1-.5-.5-2.1z"],
    rows: [
      { t: "AMC-2041 · First visit", m: "14 Mar 2027 · technician Ruwan" },
      { t: "Job J-118 · Assigned", m: "Kandy route · 10:30" },
      { t: "AMC-1987 · Renewal due", m: "In 12 days" },
    ],
  },
  {
    key: "owners", name: "Owners and directors", short: "Owners", uses: "Reports · HQ dashboard",
    icon: ["M4 20V10", "M10 20V4", "M16 20v-7", "M22 20H2"],
    rows: [
      { t: "Revenue this month", m: "Rs. 4.2M · up 12%" },
      { t: "Open deals", m: "38 deals · Rs. 9.6M in pipeline" },
      { t: "Branch performance", m: "Colombo leads · 5 branches" },
    ],
  },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const active = ref(0);
const snap = ref(false);
const manual = ref(false); // once someone clicks a team, the demo stops rotating

function pick(i) {
  manual.value = true;
  active.value = i;
}

const st = { timer: null, io: null, fallback: null };

function step() {
  if (manual.value) return;
  const next = (active.value + 1) % roles.length;
  if (next === 0) {
    snap.value = true; // let the dot jump back without sliding
    window.setTimeout(() => { snap.value = false; }, 80);
  }
  active.value = next;
}
function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 3200);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true;
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
.who {
  --orange: #33485d;
  --orange-soft: #edf1f4;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #e4e9ed;
  position: relative;
  overflow: clip;
  display: flex;
  flex-direction: column;
  align-items: center;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
}
.who *, .who *::before, .who *::after { box-sizing: border-box; }
.who button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.title {
  display: flex; flex-direction: column; align-items: center;
  margin: 0 auto; width: min(960px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15;
  letter-spacing: -0.03em; color: var(--ink);
}
.title span { display: block; }
.title .soft { color: var(--muted); }

.grid {
  width: min(1000px, calc(100% - 40px)); margin: 64px auto 0;
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 48px; align-items: start;
  justify-items: center;
}
.panel { order: -1; width: 100%; max-width: 460px; }

/* ---------- copy ---------- */
.copy { width: 100%; max-width: 460px; }
.copy p { margin: 0 0 18px; font-size: 16px; line-height: 1.75; color: var(--muted); max-width: 56ch; }
.copy p:nth-of-type(2) { color: var(--ink); font-weight: 500; }
.roles { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 26px; }
.role {
  display: flex; align-items: center; gap: 12px; min-width: 0;
  padding: 13px 14px; border: 1px solid var(--line); border-radius: 14px; background: #fff;
  font-family: "Poppins", system-ui, sans-serif; color: #8a857f; text-align: left; cursor: pointer;
  transition: border-color 0.3s, background 0.3s, color 0.3s;
}
.role.on { color: var(--ink); border-color: rgba(51, 72, 93, 0.35); background: #f5f7f8; }
.rico { flex: none; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: #f4efec; color: #9a948d; transition: background 0.3s, color 0.3s; }
.role.on .rico { background: var(--orange); color: #fff; }
.rtxt { min-width: 0; }
.rtxt b { display: block; font-size: 13.5px; font-weight: 500; }
.rtxt small { display: block; margin-top: 2px; font-size: 11.5px; line-height: 1.4; color: var(--muted); }

/* ---------- animated panel ---------- */
.panel {
  position: relative; display: flex; flex-direction: column; padding: 26px;
  border-radius: 28px; background-color: #dce5eb; background-size: cover; background-position: center;
  overflow: hidden; min-width: 0;
}
.win { padding: 14px 16px 16px; border-radius: 18px; background: #fff; box-shadow: 0 18px 40px rgba(120, 50, 20, 0.2); }
.win-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.badge { padding: 5px 12px; border-radius: 99px; background: var(--orange); color: #fff; font-size: 12px; font-weight: 600; white-space: nowrap; }
.same { display: inline-flex; align-items: center; gap: 7px; padding: 5px 10px; border-radius: 99px; background: #e6f6ec; color: #15803d; font-size: 11px; font-weight: 600; white-space: nowrap; }
.pulse { flex: none; width: 8px; height: 8px; border-radius: 50%; background: #22a55a; box-shadow: 0 0 0 3px rgba(34, 165, 90, 0.16); }
.rows { position: relative; height: 170px; margin-top: 12px; padding-top: 6px; border-top: 1px dashed var(--line); }
.list { position: absolute; inset: 6px 0 0 0; margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; align-content: start; opacity: 0; transform: translateY(8px); transition: opacity 0.45s ease, transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1); pointer-events: none; }
.list.show { opacity: 1; transform: none; pointer-events: auto; }
.list li { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px; background: #f5f7f8; }
.dotk { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--orange); }
.list b { display: block; font-size: 13px; font-weight: 500; }
.list small { display: block; color: var(--muted); font-size: 11.5px; }

.hand {
  align-self: center; display: inline-flex; align-items: center; gap: 9px; margin-top: 18px; padding: 9px 16px;
  border-radius: 99px; background: #fff; color: var(--ink); font-size: 12.5px; box-shadow: 0 10px 24px rgba(120, 50, 20, 0.18);
  animation: press 0.9s cubic-bezier(0.3, 1.4, 0.5, 1) both;
}
.hand svg { color: var(--orange); }
.hand b { font-weight: 600; }
.hand em { font-style: normal; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 99px; background: var(--orange-soft); color: var(--orange); }

.chain { position: relative; margin-top: 22px; }
.track { position: absolute; left: 12.5%; right: 12.5%; top: 19px; height: 3px; border-radius: 3px; background: rgba(255, 255, 255, 0.75); }
.fill { position: absolute; inset: 0 auto 0 0; width: calc(var(--p) * 100%); border-radius: 3px; background: var(--orange); transition: width 0.8s cubic-bezier(0.3, 0.9, 0.3, 1); }
.dot { position: absolute; top: 50%; left: calc(var(--p) * 100%); width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 3px solid var(--orange); transform: translate(-50%, -50%); transition: left 0.8s cubic-bezier(0.3, 0.9, 0.3, 1); }
.snap .fill, .snap .dot { transition: none; }
.nodes { position: relative; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
.node { display: grid; justify-items: center; gap: 7px; }
.node b { font-size: 11.5px; font-weight: 500; color: #7a4a36; transition: color 0.3s; }
.ic { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: #fff; color: #9a948d; box-shadow: 0 6px 16px rgba(120, 50, 20, 0.15); transition: background 0.35s, color 0.35s, transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1); }
.node.done .ic { color: var(--orange); }
.node.on .ic { background: var(--orange); color: #fff; transform: scale(1.14); animation: ping 1.6s ease-out infinite; }
.node.on b { color: var(--ink); }

.db {
  position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; gap: 10px;
  margin-top: 20px; padding: 15px; border-radius: 16px; background: var(--ink); color: #fff; font-size: 13.5px; font-weight: 500;
  box-shadow: 0 14px 30px rgba(20, 18, 15, 0.3);
}
.db svg { color: var(--orange); }
.db::after { content: ""; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%); transform: translateX(-100%); animation: sheen 3.2s ease-in-out infinite; }

/* ---------- entrance (runs once) + pause when off screen ---------- */
.who:not(.in) .copy, .who:not(.in) .panel { opacity: 0; }
.who.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.who.in .title .soft { animation-delay: 0.1s; }
.who.in .copy { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.who.in .panel { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
.who:not(.live) .node.on .ic, .who:not(.live) .db::after, .who:not(.live) .pulse { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(51, 72, 93, 0.5), 0 6px 16px rgba(23, 25, 29, 0.15); } 100% { box-shadow: 0 0 0 14px rgba(51, 72, 93, 0), 0 6px 16px rgba(23, 25, 29, 0.15); } }
@keyframes sheen { 0%, 40% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@keyframes press { 0% { opacity: 0; transform: translateY(10px) scale(0.94); } 60% { opacity: 1; transform: scale(1.04); } 100% { opacity: 1; transform: none; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .grid { grid-template-columns: minmax(0, 1fr); gap: 48px; }
  .panel, .copy { max-width: 560px; }
  .panel { order: 0; }
  .copy p { max-width: none; }
}
@media (max-width: 760px) {
  .who { padding: 72px 0; }
  .grid { width: calc(100% - 32px); margin-top: 40px; }
  .panel { padding: 16px; border-radius: 22px; }
  .roles { grid-template-columns: minmax(0, 1fr); }
  .node b { font-size: 10.5px; }
  .ic { width: 34px; height: 34px; }
  .track { top: 17px; }
  .same { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .who *, .who *::before, .who *::after { animation: none !important; transition: none !important; }
  .who:not(.in) .copy, .who:not(.in) .panel { opacity: 1; }
}
</style>
