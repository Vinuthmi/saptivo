<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "TechnicianAppSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
const manual = ref(false);
const ok = ref({ b: true, a: true });
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
// Replace with real before / after photos of an installed unit.
const beforePhoto = base + "tech-before.jpg";
const afterPhoto = base + "tech-after.jpg";

const feats = [
  { t: "Today's jobs", d: "with a route map" },
  { t: "GPS check-in", d: "and check-out" },
  { t: "Digital checklist", d: "for each equipment type" },
  { t: "Before and after photos", d: "of the unit" },
  { t: "Readings", d: "gas pressure, voltage and output" },
  { t: "Parts used", d: "by barcode scan" },
  { t: "Customer signature", d: "captured on the phone" },
  { t: "Service report", d: "emailed instantly" },
];

const jobs = [
  { t: "10:30", c: "Dilani Perera", j: "AC service · Colombo showroom", now: true },
  { t: "12:15", c: "Hasitha Traders", j: "Gas top-up · Galle" },
  { t: "14:40", c: "Sewwandi K.", j: "Breakdown · Kandy road" },
];
const checks = ["Filters cleaned", "Gas leak test", "Drain line clear", "Outdoor unit cleaned"];
const reads = [
  { n: "Gas pressure", v: "118", u: "psi" },
  { n: "Voltage", v: "231", u: "V" },
  { n: "Output", v: "5.2", u: "kW" },
];

const net = computed(() => {
  if (idx.value >= 2 && idx.value <= 5) return { t: "Offline", c: "off", note: "Saved on the phone" };
  if (idx.value === 6) return { t: "Syncing", c: "sync", note: "Sending saved changes" };
  return { t: "Online", c: "on", note: "Up to date" };
});

function next() {
  idx.value = (idx.value + 1) % feats.length;
}
function pick(i) {
  manual.value = true;
  stop();
  idx.value = i;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 3000);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    idx.value = 7;
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
  <section ref="root" class="ta" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">The technician</span> <span class="l2">mobile app</span></h2>
        <p>
          Technicians work entirely from their phone: today's jobs with a route map, GPS check-in and check-out, a
          digital checklist for each equipment type, before and after photos, readings such as gas pressure, voltage
          and output, parts used by barcode scan and the customer's signature. A service report is emailed instantly.
          The app works fully offline and syncs when the signal returns.
        </p>
      </header>

      <div class="board">
        <!-- phone -->
        <div class="phcol">
          <div class="phone" role="img" aria-label="The technician app: jobs and route, check-in, checklist, photos, readings, barcode scan, signature and report">
            <div class="scr">
              <div class="sb">
                <span>10:24</span>
                <span class="net" :class="net.c"><i></i>{{ net.t }}</span>
              </div>

              <Transition name="sc" mode="out-in">
                <!-- 0 jobs -->
                <div v-if="idx === 0" key="0" class="pg">
                  <div class="bar"><strong>Today</strong><span>4 jobs · Galle route</span></div>
                  <svg viewBox="0 0 240 130" class="map" aria-hidden="true">
                    <rect width="240" height="130" fill="#e8ebe4" />
                    <path d="M150 0h60v50h-60z" fill="#d7e2cf" />
                    <path d="M0 96L88 78L150 88L240 52M58 0L76 130M172 0L152 130" class="rd" />
                    <path d="M0 34L240 26" class="rd s" />
                    <path d="M26 100L88 78L152 88L214 56" class="route" />
                    <g class="pin"><circle cx="26" cy="100" r="6.500" /><circle cx="88" cy="78" r="6.500" /><circle cx="152" cy="88" r="6.500" /><circle cx="214" cy="56" r="6.500" /></g>
                    <g class="pt"><text x="26" y="102.500">1</text><text x="88" y="80.500">2</text><text x="152" y="90.500">3</text><text x="214" y="58.500">4</text></g>
                  </svg>
                  <ul class="jl">
                    <li v-for="j in jobs" :key="j.t" :class="{ now: j.now }">
                      <time>{{ j.t }}</time>
                      <div><b>{{ j.c }}</b><small>{{ j.j }}</small></div>
                    </li>
                  </ul>
                </div>

                <!-- 1 gps -->
                <div v-else-if="idx === 1" key="1" class="pg">
                  <div class="bar"><strong>Colombo showroom</strong><span>JC-0873 · Dilani Perera</span></div>
                  <svg viewBox="0 0 240 130" class="map" aria-hidden="true">
                    <rect width="240" height="130" fill="#e8ebe4" />
                    <path d="M0 80L240 60M110 0L130 130" class="rd" />
                    <circle cx="120" cy="66" r="34" class="acc" />
                    <circle cx="120" cy="66" r="6" class="me" />
                  </svg>
                  <dl class="kv">
                    <div><dt>Distance to site</dt><dd>18 m</dd></div>
                    <div><dt>Check-in</dt><dd class="g">10:24</dd></div>
                    <div><dt>Check-out</dt><dd>Not yet</dd></div>
                  </dl>
                  <div class="btn">Check out</div>
                </div>

                <!-- 2 checklist -->
                <div v-else-if="idx === 2" key="2" class="pg">
                  <div class="bar"><strong>Inverter AC</strong><span>Service checklist</span></div>
                  <ul class="cl">
                    <li v-for="(c, k) in checks" :key="c" :style="{ '--d': k * 400 + 'ms' }">
                      <span class="bx"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg></span>{{ c }}
                    </li>
                  </ul>
                </div>

                <!-- 3 photos -->
                <div v-else-if="idx === 3" key="3" class="pg">
                  <div class="bar"><strong>Photos</strong><span>IV-AC-7710-0123</span></div>
                  <div class="pics">
                    <figure>
                      <div class="im"><img v-if="ok.b" :src="beforePhoto" alt="" @error="ok.b = false" /></div>
                      <figcaption>Before</figcaption>
                    </figure>
                    <figure>
                      <div class="im"><img v-if="ok.a" :src="afterPhoto" alt="" @error="ok.a = false" /></div>
                      <figcaption>After</figcaption>
                    </figure>
                  </div>
                </div>

                <!-- 4 readings -->
                <div v-else-if="idx === 4" key="4" class="pg">
                  <div class="bar"><strong>Readings</strong><span>Entered on site</span></div>
                  <ul class="rd2">
                    <li v-for="(r, k) in reads" :key="r.n" :style="{ '--d': k * 240 + 'ms' }">
                      <span>{{ r.n }}</span>
                      <b>{{ r.v }}<small>{{ r.u }}</small></b>
                      <em>In range</em>
                    </li>
                  </ul>
                </div>

                <!-- 5 barcode -->
                <div v-else-if="idx === 5" key="5" class="pg">
                  <div class="bar"><strong>Parts used</strong><span>Scan a barcode</span></div>
                  <div class="vf">
                    <div class="bars"><i v-for="k in 30" :key="k" :style="{ width: (k % 4 === 0 ? 4 : k % 3 === 0 ? 3 : 2) + 'px' }"></i></div>
                    <span class="ln"></span>
                    <u></u><u></u><u></u><u></u>
                  </div>
                  <dl class="kv">
                    <div><dt>Part</dt><dd>Capacitor 45 µF</dd></div>
                    <div><dt>Quantity</dt><dd>1</dd></div>
                    <div><dt>Taken from</dt><dd>Van 07</dd></div>
                  </dl>
                </div>

                <!-- 6 signature -->
                <div v-else-if="idx === 6" key="6" class="pg">
                  <div class="bar"><strong>Signature</strong><span>Dilani Perera</span></div>
                  <div class="sig">
                    <svg viewBox="0 0 220 90" aria-hidden="true"><path d="M12 62c20-48 30-48 22-6s12 8 26-24c-8 30 4 34 22 6 6-10 8 6 20 6s16-18 22-14-4 24 16 14 30-26 36-8" class="sg" /></svg>
                    <i></i>
                  </div>
                  <div class="btn">Confirm</div>
                </div>

                <!-- 7 report -->
                <div v-else key="7" class="pg">
                  <div class="bar"><strong>Service report</strong><span>JC-0873</span></div>
                  <div class="done">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                    <strong>Report emailed</strong>
                    <small>PDF · 2 pages · sent to the customer</small>
                  </div>
                  <dl class="kv">
                    <div><dt>Signed by</dt><dd>Dilani Perera</dd></div>
                    <div><dt>Parts used</dt><dd>1</dd></div>
                    <div><dt>Sync</dt><dd class="g">Complete</dd></div>
                  </dl>
                </div>
              </Transition>
            </div>
          </div>

          <p class="cap">
            <span class="cs" :class="net.c"><i></i>{{ net.t }}</span>
            <span>{{ net.note }}. Works fully offline and syncs when the signal returns.</span>
          </p>
        </div>

        <!-- list -->
        <ol class="feat" role="tablist">
          <li v-for="(f, i) in feats" :key="f.t">
            <button type="button" role="tab" :aria-selected="idx === i" :class="{ act: idx === i }" @click="pick(i)">
              <span class="n">{{ String(i + 1).padStart(2, "0") }}</span>
              <span class="tx"><b>{{ f.t }}</b><small>{{ f.d }}</small></span>
            </button>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ta {
  --ink: #14120f; --muted: #6b6f76; --line: #e4e2dc; --paper: #f6f5f1;
  --acc: #5b4bd0; --ok: #2c7a56; --warn: #9a6a00;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }

.head { display: grid; grid-template-columns: 1fr 1fr; gap: 40px 64px; align-items: end; margin-bottom: 56px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; }
h2 span { display: block; }
.ta h2 .l1 { color: #111111 !important; opacity: 1; }
.ta h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 15px; line-height: 1.75; color: var(--muted); }

.head, .board { opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .08s; }

.board { display: grid; grid-template-columns: 340px 1fr; gap: 72px; align-items: start; }

/* phone */
.phcol { display: flex; flex-direction: column; gap: 16px; }
.phone { width: 320px; height: 620px; padding: 9px; border-radius: 42px; background: #111; box-shadow: 0 24px 48px -20px rgba(0, 0, 0, .35); }
.scr { height: 100%; border-radius: 34px; overflow: hidden; background: #fff; display: flex; flex-direction: column; }
.sb { display: flex; justify-content: space-between; align-items: center; padding: 14px 22px 8px; font-size: 12px; font-weight: 600; }
.net { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; color: var(--muted); }
.net i, .cs i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.net.on, .cs.on { color: var(--ok); }
.net.off, .cs.off { color: var(--warn); }
.net.sync, .cs.sync { color: var(--acc); }

.pg { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.sc-enter-active, .sc-leave-active { transition: opacity .22s ease; }
.sc-enter-from, .sc-leave-to { opacity: 0; }
.bar { padding: 6px 20px 12px; border-bottom: 1px solid var(--line); display: flex; flex-direction: column; }
.bar strong { font-size: 18px; font-weight: 600; letter-spacing: -.01em; }
.bar span { font-size: 12px; color: var(--muted); }

.map { display: block; width: 100%; height: auto; }
.rd { fill: none; stroke: #fff; stroke-width: 6; stroke-linecap: round; }
.rd.s { stroke-width: 3.500; }
.route { fill: none; stroke: var(--ink); stroke-width: 2.500; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 260; stroke-dashoffset: 260; animation: draw 1.4s ease forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
.pin circle { fill: var(--ink); }
.pt text { font-size: 7.500px; font-weight: 600; fill: #fff; text-anchor: middle; font-family: inherit; }
.acc { fill: rgba(91, 75, 208, .1); stroke: var(--acc); stroke-width: 1; }
.me { fill: var(--acc); stroke: #fff; stroke-width: 2; }

.jl { list-style: none; margin: 0; padding: 0; }
.jl li { display: grid; grid-template-columns: 48px 1fr; gap: 10px; padding: 12px 20px; border-bottom: 1px solid var(--line); font-size: 13px; }
.jl time { font-weight: 600; font-variant-numeric: tabular-nums; color: var(--muted); }
.jl b { display: block; font-weight: 600; }
.jl small { font-size: 11.5px; color: var(--muted); }
.jl li.now time { color: var(--ink); }
.jl li.now { background: var(--paper); }

.kv { margin: 0; }
.kv div { display: flex; justify-content: space-between; gap: 10px; padding: 12px 20px; border-bottom: 1px solid var(--line); font-size: 13px; }
.kv dt { color: var(--muted); }
.kv dd { margin: 0; font-weight: 600; font-variant-numeric: tabular-nums; }
.kv dd.g { color: var(--ok); }
.btn { margin: 16px 20px 0; padding: 12px; text-align: center; font-size: 13px; font-weight: 600; border-radius: 10px; background: var(--ink); color: #fff; }

.cl { list-style: none; margin: 0; padding: 0; }
.cl li { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid var(--line); font-size: 13.5px; animation: fade .35s var(--d) both; }
.bx { width: 20px; height: 20px; border-radius: 5px; background: var(--ink); color: #fff; display: grid; place-items: center; flex: none; }
.bx svg { width: 12px; height: 12px; }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }

.pics { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 16px 20px; }
.pics figure { margin: 0; }
.im { position: relative; aspect-ratio: 3 / 4; border-radius: 8px; overflow: hidden; background: #e4e2dc; }
.im img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.pics figcaption { margin-top: 6px; font-size: 12px; font-weight: 600; }

.rd2 { list-style: none; margin: 0; padding: 0; }
.rd2 li { display: grid; grid-template-columns: 1fr auto; grid-template-areas: "n v" "e v"; gap: 2px 12px; padding: 14px 20px; border-bottom: 1px solid var(--line); animation: fade .35s var(--d) both; }
.rd2 span { grid-area: n; font-size: 13px; color: var(--muted); }
.rd2 b { grid-area: v; align-self: center; font-size: 28px; font-weight: 500; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.rd2 small { font-size: 12px; font-weight: 500; color: var(--muted); margin-left: 4px; }
.rd2 em { grid-area: e; font-style: normal; font-size: 11.5px; font-weight: 600; color: var(--ok); }

.vf { position: relative; margin: 16px 20px; height: 150px; border-radius: 10px; background: #1b1a1f; display: grid; place-items: center; overflow: hidden; }
.bars { display: flex; align-items: stretch; gap: 3px; height: 58px; }
.bars i { display: block; background: #eceae4; }
.ln { position: absolute; left: 18px; right: 18px; top: 28px; height: 1.5px; background: #ff5d4d; animation: sl 1.6s ease-in-out infinite; }
@keyframes sl { 0%, 100% { top: 28px; } 50% { top: calc(100% - 28px); } }
.vf u { position: absolute; width: 16px; height: 16px; border: 2px solid #fff; }
.vf u:nth-of-type(1) { top: 12px; left: 12px; border-right: 0; border-bottom: 0; }
.vf u:nth-of-type(2) { top: 12px; right: 12px; border-left: 0; border-bottom: 0; }
.vf u:nth-of-type(3) { bottom: 12px; left: 12px; border-right: 0; border-top: 0; }
.vf u:nth-of-type(4) { bottom: 12px; right: 12px; border-left: 0; border-top: 0; }

.sig { position: relative; margin: 16px 20px 0; height: 150px; border-radius: 10px; background: var(--paper); display: grid; place-items: center; }
.sig svg { width: 86%; }
.sig i { position: absolute; left: 16px; right: 16px; bottom: 26px; border-top: 1px solid #c9c6bd; }
.sg { fill: none; stroke: var(--ink); stroke-width: 2.500; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 420; stroke-dashoffset: 420; animation: draw 2s ease forwards; }

.done { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 22px 20px; border-bottom: 1px solid var(--line); }
.done svg { width: 28px; height: 28px; color: var(--ok); margin-bottom: 6px; }
.done strong { font-size: 18px; font-weight: 600; }
.done small { font-size: 12.5px; color: var(--muted); }

.cap { margin: 0; max-width: 320px; font-size: 12.5px; line-height: 1.6; color: var(--muted); }
.cs { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; margin-right: 8px; }

/* list */
.feat { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.feat li { border-bottom: 1px solid var(--line); }
.feat button { all: unset; box-sizing: border-box; cursor: pointer; position: relative; width: 100%; display: grid; grid-template-columns: 56px 1fr; align-items: baseline; padding: 20px 0; color: var(--muted); transition: color .25s; }
.feat button:hover { color: var(--ink); }
.feat button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.feat button::before { content: ""; position: absolute; left: -16px; top: 18px; bottom: 18px; width: 2px; background: var(--ink); transform: scaleY(0); transition: transform .3s ease; }
.feat button.act { color: var(--ink); }
.feat button.act::before { transform: scaleY(1); }
.n { font-size: 12.5px; font-weight: 500; font-variant-numeric: tabular-nums; }
.tx b { display: block; font-size: 20px; font-weight: 500; letter-spacing: -.015em; }
.tx small { display: block; margin-top: 2px; font-size: 13.5px; color: var(--muted); }

@media (max-width: 960px) {
  .head { grid-template-columns: 1fr; gap: 20px; }
  .board { grid-template-columns: 1fr; gap: 40px; justify-items: center; }
  .feat { width: 100%; }
  .feat button::before { left: -10px; }
}
@media (max-width: 640px) {
  .ta { padding: 64px 16px; }
  .phone { width: 300px; height: 590px; }
  .tx b { font-size: 17px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .route, .sg, .ln, .cl li, .rd2 li { animation: none; stroke-dashoffset: 0; }
  * { transition-duration: 0s !important; }
}
</style>
