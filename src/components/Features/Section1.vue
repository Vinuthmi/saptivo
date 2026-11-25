<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WinMoreCustomersSection" });

const root = ref(null);
const shown = ref(false);
const ok = ref(true);
const photo = "/saptivo/images/features/team-selection-or-recruitment-process-concept-2026-09-24-05-18-17-utc.webp";
const still = ref(false);
const n = ref(0);
const manual = ref(-1);
let timer = null;
let io = null;

const items = [
  {
    t: "Lead and contact management",
    d: "Capture leads from your website, Facebook and WhatsApp, score them and route them automatically.",
    c: "lav",
  },
  {
    t: "Sales pipeline and deals",
    d: "Drag-and-drop pipelines, follow-up reminders and weighted forecasting.",
    c: "sky",
  },
  {
    t: "Quotations and invoicing",
    d: "Branded PDF quotes in seconds and one-click conversion to tax invoices.",
    c: "butter",
  },
  {
    t: "Marketing campaigns",
    d: "Segmented email and WhatsApp campaigns, drip sequences and campaign analytics.",
    c: "mint",
  },
];

const leads = [
  { n: "Dilani Perera", s: "Website", sc: 92, to: "Kasun" },
  { n: "Saman Silva", s: "Facebook", sc: 71, to: "Ayesha" },
  { n: "Nimal Fernando", s: "WhatsApp", sc: 48, to: "Kasun" },
];
const cols = ["Qualified", "Proposal", "Won"];
const stats = [
  { k: "Opened", v: 64 },
  { k: "Clicked", v: 31 },
  { k: "Replied", v: 12 },
];

const idx = computed(() => (manual.value >= 0 ? manual.value : still.value ? 0 : Math.floor(n.value / 6) % 4));
const sub = computed(() => (still.value ? 5 : n.value % 6));
const col = computed(() => (sub.value >= 3 ? 2 : 1));

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
function pick(i) {
  manual.value = i;
  n.value = 0;
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
  <section ref="root" class="wm" :class="{ in: shown }">
    <div class="wrap">
      <div class="left">
        <h2><span class="l1">Win More</span> <span class="l2">Customers</span></h2>
        <ul class="acc">
          <li v-for="(it, i) in items" :key="it.t" :class="[it.c, { on: i === idx }]">
            <button type="button" :aria-expanded="i === idx" @click="pick(i)">
              <span class="no">{{ i + 1 }}</span>
              <span class="ti">{{ it.t }}</span>
            </button>
            <div class="bd"><p>{{ it.d }}</p></div>
          </li>
        </ul>
      </div>

      <div class="stage" :class="items[idx].c">
        <img v-if="ok" class="photo" :src="photo" alt="" @error="ok = false" />
        <div class="view" :key="idx">
          <!-- 0 leads -->
          <div v-if="idx === 0" class="v">
            <div class="src"><span>Website</span><span>Facebook</span><span>WhatsApp</span></div>
            <div v-for="(l, i) in leads" :key="l.n" class="ld" :class="{ vis: sub >= i + 1 }">
              <span class="av">{{ l.n.charAt(0) }}</span>
              <span class="nm"><b>{{ l.n }}</b><small>{{ l.s }}</small></span>
              <span class="sc" :class="l.sc >= 70 ? 'hot' : 'warm'">{{ l.sc }}</span>
              <em :class="{ vis: sub >= i + 2 || sub >= 4 }">to {{ l.to }}</em>
            </div>
          </div>

          <!-- 1 pipeline -->
          <div v-else-if="idx === 1" class="v">
            <div class="kb">
              <div v-for="(c, i) in cols" :key="c" class="kc">
                <small>{{ c }}</small>
                <i v-if="i === 0" class="kd"></i>
                <i v-if="i === 1 && col !== 1" class="kd"></i>
                <i v-if="i === col" class="kd mv"><b>Colombo Hotels</b><em>LKR 1.8M</em></i>
              </div>
            </div>
            <div class="fc"><small>Weighted forecast</small><b>LKR 2.4M</b></div>
            <div class="rm" :class="{ vis: sub >= 4 }">Reminder: follow up with Dilani tomorrow</div>
          </div>

          <!-- 2 quote -->
          <div v-else-if="idx === 2" class="v">
            <div class="doc" :class="{ done: sub >= 3 }">
              <div class="dh"><b>{{ sub >= 3 ? "Tax invoice INV-2056" : "Quotation QT-1042" }}</b><span class="pdf">PDF</span></div>
              <div class="r"><span>AC servicing, 12 units</span><em>96,000</em></div>
              <div class="r"><span>Maintenance plan</span><em>54,000</em></div>
              <div class="r t"><span>Total (LKR)</span><em>150,000</em></div>
            </div>
            <div class="btn" :class="{ ok: sub >= 3 }">{{ sub >= 3 ? "Converted to tax invoice" : "Convert to invoice" }}</div>
          </div>

          <!-- 3 campaigns -->
          <div v-else class="v">
            <div class="seg"><span>Segment: VIP customers</span><span class="ch">Email</span><span class="ch">WhatsApp</span></div>
            <div class="an">
              <div v-for="s in stats" :key="s.k" class="ar">
                <span>{{ s.k }}</span>
                <span class="bar"><i :style="{ width: sub >= 1 ? s.v + '%' : '0%' }"></i></span>
                <b>{{ s.v }}%</b>
              </div>
            </div>
            <div class="dr"><span :class="{ on: sub >= 2 }">Day 0</span><i></i><span :class="{ on: sub >= 3 }">Day 3</span><i></i><span :class="{ on: sub >= 4 }">Day 7</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wm {
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
.wm *, .wm *::before, .wm *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; align-items: center; }
.left, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .left, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .1s; }

h2 { margin: 0 0 32px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.wm h2 .l1 { color: #111111 !important; opacity: 1; }
.wm h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.acc { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.acc li { border-bottom: 1px solid var(--line); position: relative; }
.acc li::before { content: ""; position: absolute; left: 0; top: -1px; height: 2px; width: 0; background: var(--ink); transition: width .45s ease; }
.acc li.on::before { width: 100%; }
.acc button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; display: flex; align-items: center; gap: 16px; padding: 20px 4px; }
.acc button:focus-visible { outline: 2px solid var(--ink); outline-offset: -2px; }
.no { width: 28px; height: 28px; border-radius: 50%; background: #f1f2f4; color: var(--muted); display: grid; place-items: center; font-size: 12.5px; font-weight: 600; flex: none; transition: all .3s; }
.ti { font-size: 17px; font-weight: 500; color: var(--muted); transition: color .3s; line-height: 1.4; }
.acc li.on .no { background: var(--ink); color: #fff; }
.acc li.on .ti { color: var(--ink); }
.bd { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .4s ease; }
.acc li.on .bd { grid-template-rows: 1fr; }
.bd > p { overflow: hidden; margin: 0; padding: 0 4px 0 48px; font-size: 15px; line-height: 1.75; color: var(--muted); }
.acc li.on .bd > p { padding-bottom: 22px; }

.stage { position: relative; overflow: hidden; isolation: isolate; border-radius: 28px; padding: 16px; min-height: 680px; display: flex; transition: background .5s; }
.photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 18%; z-index: -1; }
.stage.lav { background: var(--lav); } .stage.sky { background: var(--sky); } .stage.butter { background: var(--butter); } .stage.mint { background: var(--mint); }
.view { flex: 1; background: #fff; border-radius: 20px; padding: 20px; animation: vin .45s ease both; display: flex; margin-top: 220px; box-shadow: 0 18px 40px -18px rgba(20, 18, 15, .35); }
@keyframes vin { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.v { flex: 1; display: flex; flex-direction: column; gap: 10px; justify-content: center; min-width: 0; }

.src { display: flex; gap: 6px; margin-bottom: 4px; }
.src span { font-size: 11.5px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: var(--lav); color: var(--lav-i); }
.ld { display: grid; grid-template-columns: 34px minmax(0, 1fr) 36px auto; gap: 10px; align-items: center; border: 1px solid var(--line); border-radius: 14px; padding: 10px 12px; opacity: .2; transform: translateX(-6px); transition: all .4s ease; }
.ld.vis { opacity: 1; transform: none; }
.av { width: 34px; height: 34px; border-radius: 50%; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 13px; }
.nm { display: flex; flex-direction: column; min-width: 0; }
.nm b { font-size: 13px; font-weight: 500; }
.nm small { font-size: 11.5px; color: var(--muted); }
.sc { font-size: 13px; font-weight: 600; text-align: center; padding: 3px 0; border-radius: 8px; }
.sc.hot { background: var(--rose); color: var(--rose-i); } .sc.warm { background: var(--butter); color: var(--butter-i); }
.ld em { font-style: normal; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 6px; background: var(--mint); color: var(--mint-i); opacity: 0; transition: opacity .4s; white-space: nowrap; }
.ld em.vis { opacity: 1; }

.kb { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.kc { background: #f6f6f8; border-radius: 14px; padding: 10px; display: flex; flex-direction: column; gap: 8px; min-height: 160px; }
.kc small { font-size: 11px; font-weight: 600; color: var(--muted); }
.kd { display: block; height: 30px; border-radius: 8px; background: #fff; border: 1px solid var(--line); }
.kd.mv { height: auto; padding: 8px 10px; background: var(--ink); color: #fff; border-color: var(--ink); display: flex; flex-direction: column; gap: 1px; animation: vin .4s ease both; }
.kd.mv b { font-size: 11.5px; font-weight: 500; }
.kd.mv em { font-style: normal; font-size: 11px; color: rgba(255, 255, 255, .7); }
.fc { display: flex; align-items: center; justify-content: space-between; background: var(--sky); border-radius: 14px; padding: 12px 16px; }
.fc small { font-size: 12px; color: var(--muted); }
.fc b { font-size: 16px; font-weight: 600; }
.rm { font-size: 12.5px; padding: 10px 14px; border-radius: 12px; border: 1px dashed rgba(20, 18, 15, .25); color: var(--muted); opacity: .2; transition: opacity .4s; }
.rm.vis { opacity: 1; color: var(--ink); }

.doc { border: 1px solid var(--line); border-radius: 16px; overflow: hidden; transition: border-color .3s; }
.doc.done { border-color: var(--mint-i); }
.dh { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 12px 16px; background: #f6f6f8; }
.doc.done .dh { background: var(--mint); }
.dh b { font-size: 14px; font-weight: 600; }
.pdf { font-size: 11px; font-weight: 600; border: 1px solid var(--line); border-radius: 6px; padding: 2px 8px; background: #fff; }
.r { display: flex; justify-content: space-between; gap: 8px; padding: 11px 16px; border-top: 1px solid var(--line); font-size: 13px; }
.r span { color: var(--muted); } .r em { font-style: normal; font-weight: 600; }
.r.t { background: #fafafb; }
.btn { text-align: center; font-size: 13.5px; font-weight: 500; padding: 12px; border-radius: 12px; background: var(--ink); color: #fff; transition: all .35s; }
.btn.ok { background: var(--mint); color: var(--mint-i); }

.seg { display: flex; flex-wrap: wrap; gap: 6px; }
.seg span { font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 99px; background: #f1f2f4; }
.seg .ch { background: var(--mint); color: var(--mint-i); font-weight: 600; }
.an { border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 12px; }
.ar { display: grid; grid-template-columns: 64px minmax(0, 1fr) 36px; gap: 10px; align-items: center; font-size: 12.5px; color: var(--muted); }
.ar b { text-align: right; color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.bar { height: 8px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.bar i { display: block; height: 100%; background: var(--mint-i); border-radius: 4px; transition: width .9s cubic-bezier(.2, .8, .2, 1); }
.dr { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.dr span { padding: 5px 12px; border-radius: 99px; background: #f1f2f4; color: var(--muted); font-weight: 500; transition: all .3s; }
.dr span.on { background: var(--ink); color: #fff; }
.dr i { flex: 1; height: 1px; background: rgba(20, 18, 15, .2); }

@media (max-width: 900px) {
  .wrap { grid-template-columns: 1fr; gap: 36px; }
  .stage { min-height: 640px; }
}
@media (max-width: 640px) {
  .wm { padding: 64px 16px; }
  .stage { padding: 10px; border-radius: 22px; }
  .view { padding: 14px; margin-top: 160px; }
  .stage { min-height: 600px; }
  .bd > p { padding-left: 44px; }
  .ld { grid-template-columns: 34px minmax(0, 1fr) 36px; }
  .ld em { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .left, .stage { opacity: 1; transform: none; transition: none; }
  .view, .kd.mv { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
