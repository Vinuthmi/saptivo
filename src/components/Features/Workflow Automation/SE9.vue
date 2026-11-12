<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AcrossModulesSection" });

const root = ref(null);
const shown = ref(false);
const ev = ref(0);
const ph = ref(0); // 0 source fires, 1 packet travels, 2 target receives, 3 hold
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photos = [
  base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG",
  base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg",
  base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
  base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
  base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
];
const ok = ref([true, true, true, true, true]);

const mods = [
  { k: "mkt", n: "Marketing", d: "Nurture new leads", tone: "lav", ic: "M3 11l15-6v14L3 13zM7 14v5h3v-4" },
  { k: "sal", n: "Sales", d: "Where many automations start", tone: "mint", ic: "M4 20V10M10 20V4M16 20v-8M22 20H2" },
  { k: "sup", n: "Support", d: "Escalate tickets automatically", tone: "rose", ic: "M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4zM10 7v12" },
  { k: "srv", n: "Service", d: "Send visit reminders and renewal notices", tone: "sky", ic: "M14 7l3-3 3 3-3 3M3 21l9-9M12 12l5-5" },
  { k: "fin", n: "Finance", d: "Chase overdue invoices", tone: "butter", ic: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" },
];

const events = [
  { from: 0, to: 1, trig: "A new lead turns hot", act: "Assigned to Kasun", who: 1 },
  { from: 1, to: 4, trig: "A deal is marked Won", act: "Invoice created", who: 2 },
  { from: 2, to: 3, trig: "A ticket is escalated", act: "Service visit booked", who: 0 },
  { from: 3, to: 4, trig: "A service visit is completed", act: "Invoice sent to the customer", who: 3 },
  { from: 4, to: 1, trig: "An invoice is 3 days overdue", act: "Account owner reminded", who: 4 },
];

const cur = computed(() => events[ev.value]);
const pos = (i) => ((i + 0.5) / mods.length) * 100;
const packetLeft = computed(() => pos(ph.value >= 1 ? cur.value.to : cur.value.from));
const role = (i) => (cur.value.from === i ? "src" : cur.value.to === i ? "dst" : "");

function advance() {
  if (ph.value < 3) ph.value++;
  else {
    ev.value = (ev.value + 1) % events.length;
    ph.value = 0;
  }
}
function pick(i) {
  manual.value = true;
  stop();
  ev.value = i;
  ph.value = 2;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(advance, 1000);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    ph.value = 2;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.2 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="am" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <span class="eyebrow">Every module</span>
        <h2><span class="l1">Workflow automation</span> <span class="l2">across every module</span></h2>
        <p>
          Automations aren't limited to sales. Support teams escalate tickets automatically, service teams send visit
          reminders and renewal notices, finance chases overdue invoices and marketing nurtures new leads. Every
          module in Saptivo can trigger and receive automated actions.
        </p>
      </header>

      <div class="map" role="img" aria-label="Events in one Saptivo module trigger automated actions in another">
        <ul class="mods">
          <li v-for="(m, i) in mods" :key="m.k" class="mod" :class="['tone-' + m.tone, role(i), { hot: (role(i) === 'src' && ph <= 1) || (role(i) === 'dst' && ph >= 2) }]">
            <button type="button" @click="pick(events.findIndex((e) => e.from === i || e.to === i))">
              <span class="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="m.ic" /></svg>
              </span>
              <strong>{{ m.n }}</strong>
              <span class="d">{{ m.d }}</span>
              <span class="tags">
                <em class="t" :class="{ on: role(i) === 'src' && ph <= 1 }">Triggers</em>
                <em class="r" :class="{ on: role(i) === 'dst' && ph >= 2 }">Receives</em>
              </span>
            </button>
          </li>
        </ul>

        <div class="bus" aria-hidden="true">
          <i class="line"></i>
          <i v-for="(m, i) in mods" :key="m.k" class="stop" :style="{ left: pos(i) + '%' }"></i>
          <i class="packet" :class="{ snap: ph === 0, show: ph <= 2 }" :style="{ left: packetLeft + '%' }"></i>
        </div>

        <div class="banner" :class="'tone-' + mods[cur.to].tone">
          <div class="side">
            <small>When</small>
            <strong><b>{{ mods[cur.from].n }}</b>: {{ cur.trig }}</strong>
          </div>
          <svg class="go" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <Transition name="swap" mode="out-in">
            <div v-if="ph >= 2" :key="ev" class="side res">
              <span class="av">
                <img v-if="ok[cur.who]" :src="photos[cur.who]" alt="" @error="ok[cur.who] = false" />
                <b v-else>{{ mods[cur.to].n[0] }}</b>
              </span>
              <div><small>Then in {{ mods[cur.to].n }}</small><strong>{{ cur.act }}</strong></div>
            </div>
            <div v-else key="w" class="side wait"><small>Then</small><strong>Running the automation…</strong></div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.am {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #fff 0%, #f8f6ff 100%);
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 800px; margin: 0 auto 48px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--mint); color: var(--mint-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.am h2 .l1 { color: #111111 !important; opacity: 1; }
.am h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .map { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .map { opacity: 1; transform: none; }
.in .map { transition-delay: .12s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); --tb: #fff5f8; }

.map { background: #fff; border: 1px solid var(--line); border-radius: 30px; box-shadow: 0 24px 60px rgba(60, 50, 120, .1); padding: 22px 22px 22px; }
.mods { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.mod button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 16px; border-radius: 20px; background: var(--tb); border: 1px solid var(--line); transition: all .4s; }
.mod button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.mod.hot button { border-color: var(--ti); box-shadow: 0 0 0 4px var(--t), 0 16px 34px rgba(60, 50, 120, .14); transform: translateY(-4px); }
.ic svg { width: 38px; height: 38px; padding: 9px; border-radius: 12px; background: #fff; color: var(--ti); display: block; }
.mod strong { font-size: 16px; }
.mod .d { font-size: 12.5px; line-height: 1.5; color: var(--muted); flex: 1; }
.tags { display: flex; flex-wrap: wrap; gap: 5px; }
.tags em { font-style: normal; font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 99px; background: #fff; color: #9a9fa8; transition: all .35s; }
.tags em.on { background: var(--ink); color: #fff; }

/* bus */
.bus { position: relative; height: 46px; margin: 4px 0 6px; }
.line { position: absolute; left: calc(100% / 10); right: calc(100% / 10); top: 50%; height: 2px; transform: translateY(-50%); background: repeating-linear-gradient(90deg, #cfcbe0 0 6px, transparent 6px 12px); }
.stop { position: absolute; top: 0; width: 2px; height: 50%; transform: translateX(-50%); background: #cfcbe0; }
.packet { position: absolute; top: 50%; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%; background: var(--ink); box-shadow: 0 0 0 5px rgba(20, 18, 15, .12); opacity: 0; transition: left .8s ease, opacity .3s; }
.packet.show { opacity: 1; }
.packet.snap { transition: opacity .3s; }

/* banner */
.banner { display: flex; align-items: center; gap: 18px; background: var(--tb); border: 1px solid var(--line); border-radius: 22px; padding: 16px 20px; transition: background .4s; }
.side { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.side small { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.side strong { font-size: 15px; font-weight: 500; line-height: 1.4; }
.side strong b { font-weight: 700; }
.go { width: 28px; height: 28px; padding: 5px; border-radius: 50%; background: var(--ink); color: #fff; flex: none; }
.res { flex-direction: row; align-items: center; gap: 12px; }
.res > div { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.wait strong { color: var(--muted); }
.av { width: 42px; height: 42px; border-radius: 50%; overflow: hidden; background: var(--t); color: var(--ti); display: grid; place-items: center; font-weight: 700; flex: none; border: 3px solid #fff; box-sizing: border-box; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.swap-enter-active, .swap-leave-active { transition: all .25s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(6px); }

@media (max-width: 960px) {
  .mods { grid-template-columns: repeat(2, 1fr); }
  .mods li:last-child { grid-column: 1 / -1; }
  .bus { display: none; }
  .banner { margin-top: 14px; }
}
@media (max-width: 620px) {
  .am { padding: 64px 16px; }
  .map { padding: 14px; }
  .banner { flex-direction: column; align-items: stretch; gap: 10px; }
  .go { transform: rotate(90deg); align-self: center; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .map { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
