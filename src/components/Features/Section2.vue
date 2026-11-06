<template>
  <section id="channels" ref="root" class="ch" :class="{ in: seen, live }" aria-labelledby="ch-title">
    <h2 id="ch-title" class="title">
      <span>Talk to customers</span>
      <span class="soft">on every channel</span>
    </h2>

    <div class="panels" @mouseenter="hover = true" @mouseleave="hover = false">
      <article v-for="(c, i) in channels" :key="c.name" class="p" :class="{ on: i === active }">
        <div class="ph" aria-hidden="true">
          <img v-if="ok[i]" :src="c.img" alt="" loading="lazy" @error="ok[i] = false" />
        </div>
        <button type="button" class="head" :aria-expanded="i === active" :aria-controls="`ch-body-${i}`" @click="pick(i)">
          <span class="num">{{ i + 1 }}</span>
          <span class="nm">{{ c.name }}</span>
        </button>

        <div :id="`ch-body-${i}`" class="body" :aria-hidden="i !== active">
          <div class="in-body">
            <h3>{{ c.name }}</h3>
            <p>{{ c.text }}</p>

            <!-- 1 · WhatsApp -->
            <div v-if="i === 0" class="mock m-wa">
              <div class="bub them">Hi, is the 5 kW solar package still available?</div>
              <div class="bub bot"><em>Bot triage</em>Thanks! Let me get you to our solar team.</div>
              <div class="bub me"><em>Template</em>Quote follow-up · sent by Ishara</div>
              <p class="hist">Full chat history stays on the lead</p>
            </div>

            <!-- 2 · 3CX -->
            <div v-else-if="i === 1" class="mock m-call">
              <div class="ring">
                <span class="cid">NP</span>
                <span class="who"><b>Nimal Perera</b><small>ABC Solar · Hot lead · Kandy</small></span>
                <span class="pill">Incoming</span>
              </div>
              <ul class="ticks">
                <li>Caller ID pop-up with the full record</li>
                <li>Call logged automatically · 3 min 12 s</li>
                <li>Click-to-call from any contact</li>
              </ul>
            </div>

            <!-- 3 · Vodia + AI -->
            <div v-else-if="i === 2" class="mock m-ai">
              <div class="row"><span class="tg">PBX</span><span>Call logged · Vodia · 2 min 40 s</span></div>
              <div class="agent">
                <span class="tg ai">AI agent</span>
                <p>“Hello Mr Perera, this is a reminder about your site visit tomorrow at 10 am. Reply 1 to confirm.”</p>
                <small>Reminder · follow-up · logged to the lead</small>
              </div>
            </div>

            <!-- 4 · Portal -->
            <div v-else-if="i === 3" class="mock m-portal">
              <div class="brand"><span class="lg">ABC</span><b>Customer portal</b><small>yourcompany.saptivo.com</small></div>
              <ul class="tiles">
                <li><b>3</b><small>Tickets</small></li>
                <li><b>2</b><small>Quotes</small></li>
                <li><b>5</b><small>Invoices</small></li>
                <li><b>12</b><small>Documents</small></li>
              </ul>
            </div>

            <!-- 5 · Mobile -->
            <div v-else class="mock m-mob">
              <div class="phone">
                <span class="off">Offline mode</span>
                <div class="card"><b>Dilini Jayasinghe</b><small>Director · Lanka Power</small></div>
                <span class="scan">Business card scanned ✓</span>
              </div>
              <ul class="ticks">
                <li>iOS and Android apps</li>
                <li>Works offline, syncs later</li>
                <li>Scan a card, get a contact</li>
              </ul>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "ChannelsPanels" });

// Photos live in public/images/features/. File names are case sensitive (note the .JPG on the headset photo).
// A missing file just shows the navy gradient, nothing breaks.
const base = "/saptivo/images/features/";
const channels = [
  { name: "WhatsApp CRM", text: "A shared WhatsApp Business inbox with templates, bot triage and full chat history.", img: base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg" },
  { name: "3CX call integration", text: "Caller ID pop-ups, automatic call logs and click-to-call.", img: base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG" },
  { name: "Vodia integration and AI calls", text: "Vodia PBX call logging plus AI voice agents for reminders and follow-ups.", img: base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg" },
  { name: "Customer portal", text: "A branded self-service portal for tickets, quotes, invoices and documents.", img: base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg" },
  { name: "Mobile CRM", text: "iOS and Android access with offline mode and a business card scanner.", img: base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg" },
];
const ok = ref(channels.map(() => true));

const active = ref(0);
const hover = ref(false);
const manual = ref(false);
function pick(i) {
  manual.value = true; // the visitor chose; stop rotating
  active.value = i;
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function step() {
  if (manual.value || hover.value) return;
  active.value = (active.value + 1) % channels.length;
}
function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 4200);
}
function stop() {
  live.value = false;
  if (st.timer !== null) {
    window.clearInterval(st.timer);
    st.timer = null;
  }
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
  st.fallback = window.setTimeout(() => {
    if (!seen.value) seen.value = true;
  }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  stop();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.ch {
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
.ch *, .ch *::before, .ch *::after { box-sizing: border-box; }
.ch button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em;
}
.title span { display: block; }
.title .soft { color: var(--ink); }

/* ---------- expanding panels ---------- */
.panels { display: flex; gap: 14px; width: min(1000px, calc(100% - 40px)); height: 560px; margin: 56px auto 0; }
.p {
  position: relative; flex: 1 1 0; min-width: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 28px; background: #fffaf7;
  transition: flex-grow 0.7s cubic-bezier(0.5, 0, 0.2, 1), border-color 0.4s, background 0.4s;
}
.p.on { flex-grow: 6.4; border-color: rgba(51, 72, 93, 0.4); background: #fff; }

/* photo layer: fills a collapsed panel, shrinks to a header strip when the panel opens */
.ph { position: absolute; left: 0; right: 0; top: 0; height: 100%; overflow: hidden; background: linear-gradient(135deg, #33485d 0%, #6f879b 100%); transition: height 0.7s cubic-bezier(0.5, 0, 0.2, 1); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.ph::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, 0.3) 0%, rgba(20, 18, 15, 0.72) 100%); transition: opacity 0.5s; }
.ph::before { content: ""; position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(255, 255, 255, 0) 40%, #fff 100%); opacity: 0; transition: opacity 0.5s; }
.p.on .ph { height: 205px; }
.p.on .ph::after { opacity: 0.3; }
.p.on .ph::before { opacity: 1; }
.p:not(.on):hover .ph img { transform: scale(1.05); }
.ph img { transition: transform 0.8s ease; }

.head {
  position: absolute; inset: 0; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 18px; padding: 22px 0;
  border: 0; background: none; cursor: pointer; font-family: inherit; color: #fff; transition: opacity 0.35s;
}
.p.on .head { opacity: 0; pointer-events: none; }
.num { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: rgba(255, 255, 255, 0.92); color: var(--orange); font-size: 13px; font-weight: 600; }
.nm { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 14px; font-weight: 500; white-space: nowrap; }
.p:hover:not(.on) { border-color: rgba(51, 72, 93, 0.4); }
.p:hover:not(.on) .head { color: #fff; }

.body { position: absolute; inset: 0; opacity: 0; pointer-events: none; transition: opacity 0.25s; }
.p.on .body { opacity: 1; pointer-events: auto; transition: opacity 0.5s 0.3s; }
.in-body { width: 640px; max-width: 100%; min-width: 0; height: 100%; display: flex; flex-direction: column; padding: 222px 36px 28px; }
.in-body h3 { margin: 0 0 8px; font-size: 24px; font-weight: 500; letter-spacing: -0.02em; }
.in-body > p { margin: 0; max-width: 460px; font-size: 15px; line-height: 1.7; color: var(--muted); }
.p.on .in-body h3, .p.on .in-body > p { animation: rise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) 0.35s backwards; }

/* ---------- mocks ---------- */
.mock { min-width: 0; flex: 1; margin-top: 18px; padding: 16px; border: 1px solid var(--line); border-radius: 20px; background: #fffaf7; display: grid; gap: 10px; align-content: center; }
.p.on .mock > * { animation: pop 0.55s cubic-bezier(0.3, 1.3, 0.5, 1) backwards; }
.p.on .mock > *:nth-child(1) { animation-delay: 0.5s; }
.p.on .mock > *:nth-child(2) { animation-delay: 0.8s; }
.p.on .mock > *:nth-child(3) { animation-delay: 1.1s; }
.p.on .mock > *:nth-child(4) { animation-delay: 1.4s; }

.bub { max-width: 78%; padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.5; background: #fff; border: 1px solid var(--line); }
.bub em { display: block; font-style: normal; font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--orange); margin-bottom: 2px; }
.bub.me { justify-self: end; background: var(--orange-soft); border-color: rgba(51, 72, 93, 0.2); }
.bub.me em { color: var(--orange); }
.hist { margin: 4px 0 0; font-size: 12px; color: #a39d97; text-align: center; }

.ring { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 16px; background: var(--ink); color: #fff; }
.cid { display: grid; place-items: center; flex: none; width: 42px; height: 42px; border-radius: 50%; background: var(--orange); font-weight: 600; font-size: 13px; }
.who { flex: 1; min-width: 0; }
.who b { display: block; font-size: 14.5px; font-weight: 500; }
.who small { display: block; font-size: 12px; color: #b8b1ab; }
.pill { padding: 3px 11px; border-radius: 99px; background: rgba(51, 72, 93, 0.18); color: #6f879b; font-size: 11px; font-weight: 600; animation: blink 1.4s ease-in-out infinite; }
.ticks { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.ticks li { position: relative; padding-left: 26px; font-size: 13px; }
.ticks li::before { content: "✓"; position: absolute; left: 0; top: 1px; display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; background: var(--orange-soft); color: var(--orange); font-size: 10px; font-weight: 600; }

.row { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 14px; background: #fff; font-size: 13px; }
.tg { flex: none; padding: 2px 10px; border-radius: 99px; background: var(--orange-soft); color: var(--orange); font-size: 10.5px; font-weight: 600; }
.tg.ai { background: var(--ink); color: #fff; }
.agent { display: grid; gap: 8px; justify-items: start; padding: 14px; border: 1px solid rgba(51, 72, 93, 0.35); border-radius: 16px; background: #fff; }
.agent p { margin: 0; font-size: 13.5px; line-height: 1.6; }
.agent small { font-size: 11.5px; color: var(--muted); }

.brand { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 14px; background: #fff; border: 1px solid var(--line); }
.lg { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 9px; background: var(--orange); color: #fff; font-size: 11px; font-weight: 600; }
.brand b { font-size: 14px; font-weight: 500; }
.brand small { margin-left: auto; font-size: 11.5px; color: #a39d97; }
.tiles { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.tiles li { display: grid; gap: 2px; padding: 14px; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
.tiles b { font-size: 22px; font-weight: 500; color: var(--orange); }
.tiles small { font-size: 12px; color: var(--muted); }

.m-mob { grid-template-columns: minmax(0, auto) minmax(0, 1fr); align-items: center; gap: 22px; }
.phone { display: grid; gap: 10px; width: 200px; padding: 22px 14px 16px; border: 6px solid var(--ink); border-radius: 28px; background: #fff; }
.off { justify-self: center; padding: 3px 10px; border-radius: 99px; background: #fff3cf; color: #9a6b00; font-size: 10.5px; font-weight: 600; }
.card { display: grid; gap: 2px; padding: 12px; border: 1px dashed #d9cfc7; border-radius: 12px; }
.card b { font-size: 13px; font-weight: 500; }
.card small { font-size: 11px; color: var(--muted); }
.scan { font-size: 11.5px; font-weight: 500; color: var(--orange); text-align: center; }

/* entrance (runs once) */
.ch:not(.in) .panels { opacity: 0; }
.ch.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.ch.in .title .soft { animation-delay: 0.1s; }
.ch.in .panels { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }
.ch:not(.live) .pill { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes pop { from { opacity: 0; transform: translateY(8px) scale(0.97); } to { opacity: 1; transform: none; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }

/* ---------- small screens: vertical accordion ---------- */
@media (max-width: 1024px) {
  .panels { flex-direction: column; height: auto; gap: 12px; }
  .p, .p.on { flex: none; min-width: 0; }
  .ph, .p.on .ph { height: 68px; transition: none; }
  .ph::before, .p.on .ph::before { display: none; }
  .p.on .ph::after { opacity: 1; }
  .head { position: relative; flex-direction: row; justify-content: flex-start; align-items: center; width: 100%; min-height: 68px; padding: 16px 18px; opacity: 1 !important; pointer-events: auto !important; }
  .nm { writing-mode: horizontal-tb; transform: none; font-size: 15px; color: #fff; }
  .body { position: static; display: grid; grid-template-rows: 0fr; opacity: 1; transition: grid-template-rows 0.5s ease; }
  .p.on .body { grid-template-rows: 1fr; transition: grid-template-rows 0.5s ease; }
  .in-body { width: auto; height: auto; min-width: 0; min-height: 0; overflow: hidden; padding: 0 20px; }
  .mock { width: 100%; }
  .in-body { padding-top: 0; }
  .p.on .in-body { padding: 16px 20px 22px; }
  .in-body h3 { display: none; }
  .tiles { grid-template-columns: repeat(2, 1fr); }
  .m-mob { grid-template-columns: 1fr; }
  .phone { width: 100%; max-width: 220px; justify-self: center; }
}
@media (prefers-reduced-motion: reduce) {
  .ch *, .ch *::before, .ch *::after { animation: none !important; transition: none !important; }
  .ch:not(.in) .panels { opacity: 1; }
}
</style>
