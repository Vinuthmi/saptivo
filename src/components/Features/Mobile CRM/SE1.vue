<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "FieldSalesRepSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const ok = ref(true);
const n = ref(0);
const manual = ref(-1);
let timer = null;
let io = null;

const base = "/saptivo/images/features/";
const photo = base + "enthusiastic-man-talking-on-phone-in-office-2026-09-22-05-25-14-utc.webp";

const items = [
  "Open any customer's full timeline before a meeting",
  "Log meeting notes and call outcomes on the spot",
  "Create and send estimates and quotations from the field",
  "Update deal stages and next steps",
  "Click-to-call with automatic call logging",
];
const titles = ["Customer timeline", "Meeting notes", "Quotation", "Deal stage", "Click-to-call"];

const idx = computed(() => (manual.value >= 0 ? manual.value : Math.floor(n.value / 5) % 5));
const sub = computed(() => (still.value ? 4 : n.value % 5));

const timeline = [
  { t: "Quotation sent", w: "Yesterday", c: "sky" },
  { t: "Call · 4 min", w: "Mon", c: "mint" },
  { t: "AMC renewal due", w: "30 Nov", c: "butter" },
];
const outcomes = ["Interested", "Follow up", "No answer"];
const stages = ["Qualified", "Proposal", "Negotiation"];

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
  <section ref="root" class="fs" :class="{ in: shown }">
    <div class="wrap">
      <div class="left">
        <h2><span class="l1">Everything a</span> <span class="l2">field sales rep needs</span></h2>
        <ol class="list">
          <li v-for="(t, i) in items" :key="i" :class="{ on: i === idx }">
            <button type="button" :aria-current="i === idx" @click="pick(i)">
              <span class="no">{{ i + 1 }}</span>
              <span class="tx">{{ t }}</span>
            </button>
          </li>
        </ol>
      </div>

      <figure class="ph">
        <img v-if="ok" :src="photo" alt="" @error="ok = false" />

        <!-- iPhone -->
        <div class="phone" aria-hidden="true">
          <i class="sb s1"></i><i class="sb s2"></i><i class="sb s3"></i><i class="sb s4"></i>
          <div class="screen">
            <div class="island"></div>
            <div class="status">
              <span class="time">9:41</span>
              <span class="ico">
                <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1.5 4a9.5 9.5 0 0 1 13 0"/><path d="M4 6.8a6 6 0 0 1 8 0"/><circle cx="8" cy="9.4" r="1" fill="currentColor" stroke="none"/></svg>
                <span class="bat"><b></b></span>
              </span>
            </div>

            <div class="scr" :key="idx">
              <div class="sh"><b>{{ titles[idx] }}</b><small>Colombo Hotels</small></div>

              <!-- 0 timeline -->
              <ul v-if="idx === 0" class="tl">
                <li v-for="(x, i) in timeline" :key="x.t" :class="{ vis: sub >= i + 1 }"><i :class="x.c"></i><span><b>{{ x.t }}</b><small>{{ x.w }}</small></span></li>
              </ul>

              <!-- 1 notes -->
              <div v-else-if="idx === 1" class="nt">
                <p :class="{ vis: sub >= 1 }">Wants a revised AMC price before month end.</p>
                <div class="oc"><span v-for="(o, i) in outcomes" :key="o" :class="{ on: sub >= 3 && i === 1 }">{{ o }}</span></div>
                <div class="btn" :class="{ ok: sub >= 4 }">{{ sub >= 4 ? "Saved to timeline" : "Save note" }}</div>
              </div>

              <!-- 2 quotation -->
              <div v-else-if="idx === 2" class="qt">
                <div class="r"><span>AC servicing, 12 units</span><em>96,000</em></div>
                <div class="r" :class="{ vis: sub >= 1 }"><span>Maintenance plan</span><em>54,000</em></div>
                <div class="r t" :class="{ vis: sub >= 2 }"><span>Total (LKR)</span><em>150,000</em></div>
                <div class="btn" :class="{ ok: sub >= 4 }">{{ sub >= 4 ? "Quotation sent" : "Send quotation" }}</div>
              </div>

              <!-- 3 stage -->
              <div v-else-if="idx === 3" class="sg">
                <div class="pl"><span v-for="(s, i) in stages" :key="s" :class="{ on: sub >= 2 ? i === 2 : i === 1, past: sub >= 2 && i === 1 }">{{ s }}</span></div>
                <div class="nx"><small>Next step</small><b>{{ sub >= 3 ? "Send final price, Fri" : "Present proposal" }}</b></div>
              </div>

              <!-- 4 call -->
              <div v-else class="cl">
                <span class="cav">D</span>
                <b>Dilani Perera</b>
                <small>{{ sub >= 3 ? "Call ended · 02:14" : "Calling…" }}</small>
                <span class="lg" :class="{ vis: sub >= 4 }">Call logged automatically</span>
              </div>
            </div>
          </div>
        </div>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.fs {
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
.fs *, .fs *::before, .fs *::after { box-sizing: border-box; }
.wrap { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr); gap: 56px; align-items: center; }
.left, .ph { opacity: 0; transform: translateY(56px); transition: opacity .75s ease, transform .75s cubic-bezier(.22, 1, .36, 1); }
.in .left, .in .ph { opacity: 1; transform: none; }
.in .ph { transition-delay: .1s; }

h2 { margin: 0 0 32px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.fs h2 .l1 { color: #111111 !important; opacity: 1; }
.fs h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.list li { border-bottom: 1px solid var(--line); position: relative; }
.list li::before { content: ""; position: absolute; left: 0; top: -1px; height: 2px; width: 0; background: var(--ink); transition: width .45s ease; }
.list li.on::before { width: 100%; }
.list button { all: unset; box-sizing: border-box; cursor: pointer; display: flex; gap: 16px; align-items: flex-start; width: 100%; padding: 16px 4px; }
.list button:focus-visible { outline: 2px solid var(--ink); outline-offset: -2px; }
.no { width: 26px; height: 26px; border-radius: 50%; background: #f1f2f4; color: var(--muted); display: grid; place-items: center; font-size: 12px; font-weight: 600; flex: none; transition: all .3s; }
.tx { font-size: 15px; line-height: 1.6; color: var(--muted); transition: color .3s; padding-top: 1px; }
.list li.on .no { background: var(--ink); color: #fff; }
.list li.on .tx { color: var(--ink); font-weight: 500; }

.ph { position: relative; margin: 0; border-radius: 32px; overflow: hidden; min-height: 660px; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); display: flex; align-items: flex-end; justify-content: center; }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

/* ---------- iPhone frame ---------- */
.phone {
  position: relative;
  width: 270px;
  height: 470px;
  margin-bottom: -2px;
  padding: 9px 9px 0;
  border-radius: 54px 54px 0 0;
  background: linear-gradient(145deg, #4a4a4f, #1c1c1e 40%, #2e2e32);
  box-shadow:
    0 0 0 1.5px #8e8e93 inset,
    0 -2px 0 1px rgba(255, 255, 255, .15) inset,
    0 30px 60px rgba(20, 18, 15, .35),
    0 10px 24px rgba(20, 18, 15, .25);

  /* rises from the bottom of the section */
  transform: translateY(105%);
  opacity: 0;
  transition: transform 1.1s cubic-bezier(.22, 1, .36, 1) .35s, opacity .5s ease .35s;
  will-change: transform;
}
.in .phone { transform: translateY(0); opacity: 1; }

/* side buttons */
.sb { position: absolute; width: 3px; background: #3a3a3e; border-radius: 2px; }
.s1 { left: -3px; top: 74px; height: 22px; }   /* action */
.s2 { left: -3px; top: 112px; height: 40px; }  /* volume up */
.s3 { left: -3px; top: 162px; height: 40px; }  /* volume down */
.s4 { right: -3px; top: 130px; height: 62px; } /* power */

.screen {
  position: relative;
  height: 100%;
  background: #fff;
  border-radius: 45px 45px 0 0;
  overflow: hidden;
  padding: 0 14px;
}
.island {
  position: absolute; top: 9px; left: 50%; transform: translateX(-50%);
  width: 78px; height: 23px; border-radius: 20px; background: #000; z-index: 3;
}
.status {
  height: 44px; display: flex; align-items: center; justify-content: space-between;
  padding: 6px 10px 0; font-size: 12.5px; font-weight: 600; color: var(--ink);
}
.status .ico { display: flex; align-items: center; gap: 5px; }
.status svg rect { fill: var(--ink); }
.status svg { color: var(--ink); }
.bat { width: 24px; height: 11.5px; border: 1.5px solid rgba(20, 18, 15, .4); border-radius: 4px; padding: 1.5px; position: relative; }
.bat::after { content: ""; position: absolute; right: -4px; top: 3px; width: 2px; height: 4px; border-radius: 0 2px 2px 0; background: rgba(20, 18, 15, .4); }
.bat b { display: block; width: 78%; height: 100%; background: var(--ink); border-radius: 2px; }

/* ---------- app screen ---------- */
.scr { padding-top: 4px; display: flex; flex-direction: column; gap: 12px; animation: sin .4s ease both; }
@keyframes sin { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.sh { display: flex; flex-direction: column; }
.sh b { font-size: 14px; font-weight: 600; }
.sh small { font-size: 11.5px; color: var(--muted); }

.tl { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.tl li { display: flex; align-items: center; gap: 10px; background: #f6f6f8; border-radius: 12px; padding: 10px 12px; opacity: .2; transition: opacity .4s; }
.tl li.vis { opacity: 1; }
.tl i { width: 8px; height: 8px; border-radius: 50%; flex: none; }
.tl i.sky { background: var(--sky-i); } .tl i.mint { background: var(--mint-i); } .tl i.butter { background: #d8b13a; }
.tl span { display: flex; flex-direction: column; }
.tl b { font-size: 12.5px; font-weight: 500; }
.tl small { font-size: 11px; color: var(--muted); }

.nt p { margin: 0; background: #f6f6f8; border-radius: 12px; padding: 10px 12px; font-size: 12.5px; line-height: 1.6; opacity: .2; transition: opacity .4s; }
.nt p.vis { opacity: 1; }
.nt { display: flex; flex-direction: column; gap: 12px; }
.oc { display: flex; flex-wrap: wrap; gap: 6px; }
.oc span { font-size: 11.5px; font-weight: 500; padding: 5px 12px; border-radius: 99px; border: 1px solid var(--line); color: var(--muted); transition: all .3s; }
.oc span.on { background: var(--ink); color: #fff; border-color: var(--ink); }

.qt { display: flex; flex-direction: column; gap: 8px; }
.r { display: flex; justify-content: space-between; gap: 8px; background: #f6f6f8; border-radius: 12px; padding: 10px 12px; font-size: 12.5px; }
.r em { font-style: normal; font-weight: 600; }
.qt .r:nth-child(n+2) { opacity: .2; transition: opacity .4s; }
.qt .r.vis { opacity: 1; }
.r.t { background: var(--butter); }

.btn { text-align: center; font-size: 13px; font-weight: 500; padding: 10px; border-radius: 11px; background: var(--ink); color: #fff; transition: all .35s; }
.btn.ok { background: var(--mint); color: var(--mint-i); }

.pl { display: flex; flex-direction: column; gap: 6px; }
.pl span { font-size: 12.5px; padding: 9px 12px; border-radius: 11px; border: 1px solid var(--line); color: var(--muted); transition: all .35s; }
.pl span.past { background: var(--mint); color: var(--mint-i); border-color: transparent; }
.pl span.on:not(.past) { background: var(--lav); color: var(--lav-i); border-color: transparent; font-weight: 600; }
.sg { display: flex; flex-direction: column; gap: 14px; }
.nx { background: #f6f6f8; border-radius: 12px; padding: 10px 12px; display: flex; flex-direction: column; }
.nx small { font-size: 11px; color: var(--muted); }
.nx b { font-size: 12.5px; font-weight: 500; }

.cl { display: flex; flex-direction: column; align-items: center; gap: 4px; padding-top: 14px; }
.cav { width: 64px; height: 64px; border-radius: 50%; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-size: 24px; font-weight: 600; margin-bottom: 6px; }
.cl b { font-size: 15px; font-weight: 600; }
.cl small { font-size: 12px; color: var(--muted); }
.lg { margin-top: 12px; font-size: 11.5px; font-weight: 600; padding: 5px 14px; border-radius: 99px; background: var(--mint); color: var(--mint-i); opacity: 0; transition: opacity .4s; }
.lg.vis { opacity: 1; }

@media (max-width: 900px) {
  .wrap { grid-template-columns: 1fr; gap: 36px; }
  .ph { min-height: 560px; }
}
@media (max-width: 640px) {
  .fs { padding: 64px 16px; }
  .ph { min-height: 500px; border-radius: 24px; }
  .phone { width: 244px; height: 420px; border-radius: 48px 48px 0 0; }
  .screen { border-radius: 40px 40px 0 0; }
}
@media (prefers-reduced-motion: reduce) {
  .left, .ph { opacity: 1; transform: none; transition: none; }
  .phone { transform: none; opacity: 1; transition: none; }
  .scr { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
