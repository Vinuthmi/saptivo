<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ComplaintManagementSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const avOk = ref(true);
let timer = null;
let io = null;
let reduce = false;

const photo = "/saptivo/images/features/confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const channels = [
  { k: "Phone", ic: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" },
  { k: "Portal", ic: "M3 5h18v12H3zM8 21h8M12 17v4" },
  { k: "WhatsApp", ic: "M4 20l1.3-4A8 8 0 1 1 8 18.7zM9 10c.5 2 2 3.500 4 4" },
];

const step = computed(() => (reduce ? 9 : n.value % 11));
const ch = computed(() => (reduce ? 0 : Math.floor(n.value / 11) % 3));

const months = [
  { m: "Jun", f: true },
  { m: "Jul", f: false },
  { m: "Aug", f: false },
  { m: "Sep", f: true },
  { m: "Oct", f: false },
  { m: "Nov", f: true, now: true },
];

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1400);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function replay() {
  stop();
  n.value = Math.floor(n.value / 11) * 11 + 11;
  start();
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    n.value = 9;
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
  <section ref="root" class="cm" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Breakdown and</span> <span class="l2">complaint management</span></h2>
        <p>
          When a customer reports a fault by phone, portal or WhatsApp, the complaint is logged against the exact
          asset, prioritised and dispatched within your SLA. Saptivo flags repeat faults ("this unit has failed three
          times in six months"), records root causes and corrective actions, and links covered faults to a
          manufacturer warranty claim.
        </p>
      </header>

      <div class="board" role="img" aria-label="A complaint arriving by phone, portal or WhatsApp, logged against an asset, dispatched within SLA, flagged as a repeat fault, with root cause and a warranty claim">
        <!-- left: flow -->
        <div class="flow">
          <div class="chs">
            <span v-for="(c, i) in channels" :key="c.k" class="chn" :class="{ act: ch === i && step >= 1 }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="c.ic" /></svg>
              {{ c.k }}
            </span>
          </div>

          <div class="tk" :class="{ on: step >= 1 }">
            <div class="th">
              <span class="tg">Complaint</span>
              <strong>Air conditioner not cooling</strong>
              <span class="pr" :class="{ show: step >= 2 }">High priority</span>
            </div>
            <div class="as">
              <small>Logged against asset</small>
              <b>IV-AC-7710-0123</b>
              <span>Dilani Perera · Colombo showroom</span>
            </div>

            <div class="dp" :class="{ on: step >= 3 }">
              <span class="av">
                <img v-if="avOk" :src="photo" alt="" @error="avOk = false" />
                <b v-else>C</b>
              </span>
              <div>
                <strong>Dispatched to Chaminda</strong>
                <small>18 min · within the 4 h SLA</small>
              </div>
              <span class="sla"><i :style="{ width: step >= 3 ? '14%' : '0%' }"></i></span>
            </div>
          </div>

          <div class="rc" :class="{ on: step >= 6 }">
            <div class="rr"><small>Root cause</small><b>Compressor capacitor failure</b></div>
            <div class="rr"><small>Corrective action</small><b>Capacitor replaced, 30 min test run</b></div>
          </div>
        </div>

        <!-- right: history -->
        <div class="side">
          <div class="hist">
            <div class="hh"><strong>Fault history</strong><span>IV-AC-7710-0123</span></div>
            <ol class="mo">
              <li v-for="m in months" :key="m.m" :class="{ f: m.f, now: m.now, lit: m.f && (m.now ? step >= 1 : step >= 4) }">
                <i></i><span>{{ m.m }}</span>
              </li>
            </ol>
            <div class="flag" :class="{ on: step >= 4 }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h12l-2 4 2 4H5" /></svg>
              This unit has failed three times in six months
            </div>
          </div>

          <div class="wc" :class="{ on: step >= 7 }">
            <div class="wh">
              <span class="ck">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
              </span>
              <strong>Covered by warranty</strong>
            </div>
            <p>Warranty claim WC-0091 linked and ready to send to the manufacturer.</p>
            <small>Warranty until 14 Dec 2026</small>
          </div>

          <button type="button" class="replay" @click="replay">Replay</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cm {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.cm h2 .l1 { color: #111111 !important; opacity: 1; }
.cm h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .board { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .1s; }

.board { display: grid; grid-template-columns: 1.15fr 1fr; gap: 20px; align-items: start; }
.flow, .side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }

.chs { display: flex; gap: 10px; flex-wrap: wrap; }
.chn { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 99px; background: #f4f2fa; color: var(--muted); transition: all .4s; }
.chn svg { width: 16px; height: 16px; }
.chn.act { background: var(--ink); color: #fff; transform: translateY(-2px); }

.tk { background: #faf9ff; border: 1.5px solid var(--line); border-radius: 28px; padding: 20px; display: flex; flex-direction: column; gap: 14px; opacity: .4; transform: translateY(10px); transition: all .6s cubic-bezier(.3, .8, .3, 1); }
.tk.on { opacity: 1; transform: none; background: #fff; border-color: var(--lav-i); box-shadow: 0 24px 54px rgba(60, 50, 120, .12); }
.th { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.th strong { font-size: 15.5px; flex: 1; min-width: 0; }
.tg { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 4px 12px; border-radius: 99px; background: var(--lav); color: var(--lav-i); }
.pr { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; background: var(--rose); color: var(--rose-i); opacity: 0; transform: scale(.8); transition: all .4s cubic-bezier(.3, 1.4, .5, 1); }
.pr.show { opacity: 1; transform: none; }
.as { display: flex; flex-direction: column; gap: 2px; padding: 12px 14px; border-radius: 16px; background: #f6f4ff; }
.as small { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--lav-i); }
.as b { font-size: 15px; letter-spacing: .02em; }
.as span { font-size: 12px; color: var(--muted); }

.dp { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center; padding: 12px 14px; border-radius: 16px; background: #f2fbf6; opacity: .3; transition: opacity .5s; }
.dp.on { opacity: 1; }
.dp strong { display: block; font-size: 13.5px; }
.dp small { font-size: 12px; color: var(--mint-i); font-weight: 600; }
.sla { grid-column: 1 / -1; height: 8px; border-radius: 99px; background: #d9eee3; overflow: hidden; }
.sla i { display: block; height: 100%; border-radius: 99px; background: var(--mint-i); transition: width 1s cubic-bezier(.3, .8, .3, 1); }
.av { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; background: var(--sky); color: var(--sky-i); display: grid; place-items: center; font-weight: 700; flex: none; border: 3px solid #fff; box-sizing: border-box; box-shadow: 0 0 0 1px var(--line); }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.rc { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; opacity: .3; transform: translateY(8px); transition: all .6s cubic-bezier(.3, .8, .3, 1); }
.rc.on { opacity: 1; transform: none; }
.rr { background: #fffaea; border-radius: 20px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
.rr small { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--butter-i); }
.rr b { font-size: 13px; line-height: 1.45; font-weight: 600; }

/* history */
.hist { background: #fff; border: 1px solid var(--line); border-radius: 28px; padding: 20px; box-shadow: 0 24px 54px rgba(60, 50, 120, .1); display: flex; flex-direction: column; gap: 16px; }
.hh { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.hh strong { font-size: 15px; }
.hh span { font-size: 12px; color: var(--muted); }
.mo { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(6, 1fr); position: relative; }
.mo::before { content: ""; position: absolute; left: 8%; right: 8%; top: 9px; height: 2px; background: #e7e3f4; }
.mo li { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 11px; color: var(--muted); }
.mo i { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 2px solid #ddd9ea; transition: all .5s; }
.mo li.f i { border-color: var(--rose-i); }
.mo li.lit i { background: var(--rose-i); box-shadow: 0 0 0 5px rgba(216, 86, 127, .18); }
.mo li.now.lit i { animation: beat 1.6s infinite; }
@keyframes beat { 0% { box-shadow: 0 0 0 0 rgba(216, 86, 127, .5); } 70% { box-shadow: 0 0 0 9px rgba(216, 86, 127, 0); } 100% { box-shadow: 0 0 0 0 rgba(216, 86, 127, 0); } }
.flag { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 16px; background: var(--rose); color: var(--rose-i); font-size: 12.5px; font-weight: 700; line-height: 1.45; opacity: 0; transform: translateY(8px); transition: all .6s cubic-bezier(.3, .8, .3, 1); }
.flag.on { opacity: 1; transform: none; }
.flag svg { width: 18px; height: 18px; flex: none; }

.wc { background: #1d1a24; color: #f4eef7; border-radius: 28px; padding: 20px; display: flex; flex-direction: column; gap: 8px; opacity: .35; transform: translateY(10px); transition: all .6s cubic-bezier(.3, .8, .3, 1); }
.wc.on { opacity: 1; transform: none; }
.wh { display: flex; align-items: center; gap: 10px; }
.wh strong { font-size: 14.5px; }
.ck { width: 24px; height: 24px; border-radius: 50%; background: var(--mint-i); display: grid; place-items: center; }
.ck svg { width: 13px; height: 13px; }
.wc p { margin: 0; font-size: 13px; line-height: 1.6; color: #d7cfe2; }
.wc small { font-size: 11.5px; color: #a79fb4; }

.replay { all: unset; cursor: pointer; align-self: flex-start; font-size: 12px; font-weight: 600; padding: 8px 18px; border-radius: 99px; border: 1px solid var(--line); color: var(--muted); }
.replay:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

@media (max-width: 900px) {
  .board { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .cm { padding: 64px 16px; }
  .rc { grid-template-columns: 1fr; }
  .tk, .hist, .wc { padding: 16px; border-radius: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .mo li.now.lit i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
