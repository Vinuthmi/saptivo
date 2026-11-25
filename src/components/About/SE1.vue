<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhyWeBuiltSection" });

const root = ref(null);
const shown = ref(false);
// one image for each pane, swap the paths if you like
const base = "/saptivo/images/features/";
const imgBefore = base + "supportive-friends-comforting-a-man-during-difficu-2026-09-25-08-51-33-utc (1).webp";
const imgAfter = base + "creative-team-collaborating-on-project-in-modern-o-2026-09-22-00-26-50-utc.webp";
const okB = ref(true);
const okA = ref(true);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const tools = [
  { k: "Sales", t: "Leads.xlsx", d: "A spreadsheet", c: "mint", r: -3 },
  { k: "Support", t: "Customer chat group", d: "A WhatsApp group", c: "sky", r: 2.5 },
  { k: "Service", t: "Paper job card", d: "Filed in a cabinet", c: "butter", r: -1.5 },
];
const rows = [
  { k: "Sales", t: "Deal · Proposal sent", c: "mint" },
  { k: "Support", t: "Ticket · Open", c: "sky" },
  { k: "Service", t: "AMC · Next visit booked", c: "butter" },
];
const chips = ["WhatsApp", "Local phone systems", "LKR invoicing"];

const sub = computed(() => (still.value ? 9 : n.value % 12));
const merged = computed(() => sub.value >= 4);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 900);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    still.value = true;
    shown.value = true;
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
  <section ref="root" class="wb" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Why we built</span> <span class="l2">Saptivo</span></h2>
        <p>
          We watched growing businesses run sales in spreadsheets, customer service in WhatsApp groups and after-sales
          service on paper job cards. International CRMs treated the channels those businesses depend on, such as
          WhatsApp, local phone systems and LKR invoicing, as expensive add-ons. So we built one platform that connects
          sales, support and service around a single customer record, with those channels built in.
        </p>
      </header>

      <div class="stage">
        <!-- before -->
        <div class="pane before">
          <span class="lb">Before</span>
          <div class="pic dim"><img v-if="okB" :src="imgBefore" alt="" @error="okB = false" /></div>
          <div class="pile">
            <div v-for="t in tools" :key="t.k" class="tool" :class="[t.c, { go: merged }]" :style="{ '--r': t.r + 'deg' }">
              <small>{{ t.k }}</small>
              <b>{{ t.t }}</b>
              <em>{{ t.d }}</em>
            </div>
          </div>
        </div>

        <div class="mid" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </div>

        <!-- after -->
        <div class="pane after" :class="{ on: merged }">
          <span class="lb">With Saptivo</span>
          <div class="pic"><img v-if="okA" :src="imgAfter" alt="" @error="okA = false" /></div>
          <div class="rec">
            <div class="rh"><span class="av">N</span><div><b>One customer record</b><small>Sales, support and service together</small></div></div>
            <ul>
              <li v-for="(r, i) in rows" :key="r.k" :class="{ vis: sub >= 5 + i }">
                <span class="tg" :class="r.c">{{ r.k }}</span><span>{{ r.t }}</span>
              </li>
            </ul>
            <div class="ch">
              <small>Built in</small>
              <span v-for="(c, i) in chips" :key="c" :class="{ vis: sub >= 8 + i * 0.5 }">{{ c }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wb {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wb *, .wb *::before, .wb *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 56px; align-items: end; margin-bottom: 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.wb h2 .l1 { color: #111111 !important; opacity: 1; }
.wb h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.8; color: var(--muted); }
.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .1s; }

.stage { display: grid; grid-template-columns: minmax(0, 1fr) 44px minmax(0, 1fr); gap: 10px; align-items: stretch; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.pane { border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.before { background: #f4f4f6; }
.after { background: var(--lav); }

.pic { position: relative; height: 190px; border-radius: 18px; overflow: hidden; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); flex: none; }
.pic img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 22%; display: block; transition: filter .6s; }
.pic.dim img { filter: grayscale(.85) contrast(.95); }
.pile { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 14px; padding: 6px 10px; }
.tool { background: #fff; border-radius: 16px; padding: 14px 18px; display: flex; flex-direction: column; gap: 2px; transform: rotate(var(--r)); box-shadow: 0 6px 18px -10px rgba(20, 18, 15, .3); border-left: 4px solid transparent; transition: all .6s ease; }
.tool.mint { border-left-color: var(--mint-i); } .tool.sky { border-left-color: var(--sky-i); } .tool.butter { border-left-color: #d8b13a; }
.tool small { font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.tool b { font-size: 15px; font-weight: 500; }
.tool em { font-style: normal; font-size: 12.5px; color: var(--muted); }
.tool.go { opacity: .3; transform: rotate(0) translateX(14px) scale(.97); }

.mid { display: grid; place-items: center; color: var(--muted); }

.rec { flex: 1; background: #fff; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 14px; opacity: .3; transform: translateY(8px); transition: all .55s ease; }
.after.on .rec { opacity: 1; transform: none; }
.rh { display: flex; align-items: center; gap: 12px; }
.rh div { display: flex; flex-direction: column; }
.rh b { font-size: 15px; font-weight: 600; }
.rh small { font-size: 12px; color: var(--muted); }
.av { width: 38px; height: 38px; border-radius: 50%; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 14px; flex: none; }
.rec ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.rec li { display: flex; align-items: center; gap: 12px; border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; font-size: 13px; opacity: .2; transform: translateX(-6px); transition: all .45s ease; }
.rec li.vis { opacity: 1; transform: none; }
.tg { font-size: 11px; font-weight: 600; padding: 2px 10px; border-radius: 6px; flex: none; min-width: 66px; text-align: center; }
.tg.mint { background: var(--mint); color: var(--mint-i); } .tg.sky { background: var(--sky); color: var(--sky-i); } .tg.butter { background: var(--butter); color: var(--butter-i); }
.ch { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: auto; }
.ch small { font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); margin-right: 4px; }
.ch span { font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 99px; background: var(--ink); color: #fff; opacity: .2; transform: translateY(4px); transition: all .4s ease; }
.ch span.vis { opacity: 1; transform: none; }

@media (max-width: 900px) {
  .head { grid-template-columns: 1fr; gap: 20px; }
  .stage { grid-template-columns: 1fr; }
  .mid { transform: rotate(90deg); height: 30px; }
}
@media (max-width: 640px) {
  .wb { padding: 64px 16px; }
  .pane { padding: 16px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
