<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "CampaignBuilderV2Section" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const manual = ref(-1);
const ok = ref([true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photoA = base + "smiling-woman-working-at-desk-with-tablet-2026-09-22-03-02-47-utc.webp";
const photoB = base + "smiling-coworkers-reviewing-photos-on-computer-scr-2026-09-21-14-07-13-utc.webp";

// merge-field text lives in script so the template never holds a literal double brace
const rawName = "{{first_name}}";
const rawSlot = "{{1}}";
const merges = ["{{first_name}}", "{{company}}", "{{last_order}}"];

const tabs = ["Drag-and-drop or HTML editor", "Merge fields", "A/B testing", "WhatsApp template campaigns"];
const variants = [
  { k: "A", s: "Your service plan is ready", pct: 52, rate: "24.1%" },
  { k: "B", s: "Nimal, your service plan is ready", pct: 68, rate: "31.6%", win: true },
];

const tab = computed(() => {
  if (manual.value >= 0) return manual.value;
  return reduce ? 0 : Math.floor(n.value / 4) % 4;
});
const sub = computed(() => (manual.value >= 0 || reduce ? 3 : n.value % 4));
const photoOnB = computed(() => tab.value === 3);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce || manual.value >= 0) return;
  timer = setInterval(tick, 1200);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manual.value = i;
  stop();
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
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
  <section ref="root" class="c2" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Campaign</span> <span class="l2">builder</span></h2>
        <p>
          Design emails with a drag-and-drop or HTML editor, personalise them with merge fields, and test subject lines
          and content with A/B testing. WhatsApp template campaigns reach customers on the channel they read most.
        </p>
      </header>

      <div class="tabs" role="tablist">
        <button v-for="(t, i) in tabs" :key="t" type="button" role="tab" :aria-selected="i === tab" class="tb" :class="{ on: i === tab }" @click="pick(i)">
          <span class="no">{{ i + 1 }}</span>{{ t }}
        </button>
      </div>

      <div class="stage">
        <figure class="ph">
          <img v-if="ok[0]" class="im" :class="{ off: photoOnB }" :src="photoA" alt="" @error="ok[0] = false" />
          <img v-if="ok[1]" class="im" :class="{ off: !photoOnB }" :src="photoB" alt="" @error="ok[1] = false" />
        </figure>

        <div class="panel">
          <Transition name="sw" mode="out-in">
            <!-- editor -->
            <div v-if="tab === 0" key="t0" class="pn lav">
              <div class="bar">
                <span>Service reminder · Email</span>
                <span class="seg"><i :class="{ on: sub < 3 }">Drag and drop</i><i :class="{ on: sub >= 3 }">HTML</i></span>
              </div>
              <div v-if="sub < 3" class="mail">
                <h4>Hi Nimal,</h4>
                <p>Your fleet service plan is ready for review.</p>
                <div class="slot" :class="{ over: sub === 1, filled: sub === 2 }">
                  <span class="cta" :class="{ shown: sub >= 2 }">View my quotation</span>
                  <em v-if="sub < 2">{{ sub === 1 ? "Button" : "Drop a block here" }}</em>
                </div>
              </div>
              <pre v-else class="code"><code><span class="k">&lt;h1&gt;</span>Hi Nimal,<span class="k">&lt;/h1&gt;</span>
<span class="k">&lt;p&gt;</span>Your fleet service plan is ready.<span class="k">&lt;/p&gt;</span>
<span class="k">&lt;a</span> <span class="a">class</span>=<span class="s">"btn"</span><span class="k">&gt;</span>View my quotation<span class="k">&lt;/a&gt;</span></code></pre>
            </div>

            <!-- merge -->
            <div v-else-if="tab === 1" key="t1" class="pn sky">
              <div class="chips">
                <span v-for="(m, i) in merges" :key="m" class="mc" :class="{ on: sub >= 1 && i === 0 }">{{ m }}</span>
              </div>
              <div class="mail">
                <h4>Hi <span class="m" :class="{ hl: sub === 1 || sub === 2, res: sub >= 3 }">{{ sub >= 3 ? "Nimal" : rawName }}</span>,</h4>
                <p>Your fleet service plan is ready for review. Everything is in the quotation below.</p>
                <span class="cta static">View my quotation</span>
              </div>
            </div>

            <!-- A/B -->
            <div v-else-if="tab === 2" key="t2" class="pn butter">
              <div class="ab">
                <span class="badge">Subject line · 50 / 50 split</span>
                <div v-for="v in variants" :key="v.k" class="vr" :class="{ win: sub >= 3 && v.win }">
                  <div class="vh"><b>{{ v.k }}</b><span>{{ v.s }}</span><em v-if="sub >= 3 && v.win">Winner</em></div>
                  <div class="track"><i :style="{ width: (sub >= 1 ? v.pct : 0) + '%' }"></i></div>
                  <small>{{ sub >= 1 ? v.rate : "—" }} opened</small>
                </div>
              </div>
            </div>

            <!-- WhatsApp -->
            <div v-else key="t3" class="pn mint">
              <div class="chat">
                <div class="bub" :class="{ show: sub >= 1 }">
                  <p>Hi <b>Nimal</b>, your fleet service is due on <b>14 Nov</b>. Reply YES to book a slot.</p>
                  <span class="tm">10:24</span>
                </div>
                <div class="qr" :class="{ show: sub >= 2 }"><span>Yes, book it</span><span>Later</span></div>
              </div>
              <span class="appr" :class="{ show: sub >= 3 }">Template approved</span>
              <span class="slotname">{{ rawSlot }} filled from customer data</span>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.c2 {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.c2 *, .c2 *::before, .c2 *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 40px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.c2 h2 .l1 { color: #111111 !important; opacity: 1; }
.c2 h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .tabs, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .tabs, .in .stage { opacity: 1; transform: none; }
.in .tabs { transition-delay: .06s; }
.in .stage { transition-delay: .12s; }

.tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 22px; }
.tb { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; padding: 10px 18px 10px 10px; border-radius: 99px; border: 1px solid var(--line); font-size: 13.5px; font-weight: 500; color: var(--muted); transition: all .3s; }
.tb:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.tb .no { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-size: 11.5px; font-weight: 600; background: #f1f2f4; transition: all .3s; }
.tb.on { background: var(--ink); border-color: var(--ink); color: #fff; }
.tb.on .no { background: rgba(255, 255, 255, .18); }

.stage { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; min-height: 480px; }
.ph { position: relative; margin: 0; border-radius: 28px; overflow: hidden; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); min-height: 420px; }
.im { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; transition: opacity .7s ease; }
.im.off { opacity: 0; }

.panel { display: grid; min-width: 0; }
.pn { border-radius: 28px; padding: 28px; display: flex; flex-direction: column; justify-content: center; gap: 16px; min-width: 0; }
.pn.lav { background: var(--lav); }
.pn.sky { background: var(--sky); }
.pn.butter { background: var(--butter); }
.pn.mint { background: var(--mint); }
.sw-enter-active, .sw-leave-active { transition: opacity .3s ease, transform .3s ease; }
.sw-enter-from { opacity: 0; transform: translateY(10px); }
.sw-leave-to { opacity: 0; transform: translateY(-6px); }

.bar { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 600; color: var(--lav-i); }
.seg { display: inline-flex; padding: 3px; border-radius: 99px; background: #fff; }
.seg i { font-style: normal; font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 99px; color: var(--muted); transition: all .3s; }
.seg i.on { background: var(--ink); color: #fff; }

.mail { background: #fff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.mail h4 { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -.02em; }
.mail p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--muted); }
.slot { position: relative; width: 100%; height: 64px; display: grid; place-items: center; border-radius: 12px; border: 1.5px dashed #cfc7ea; transition: all .3s; }
.slot em { font-size: 12.5px; font-style: normal; color: #9a8fc0; }
.slot.over { border-color: var(--butter-i); background: var(--butter); }
.slot.over em { color: var(--butter-i); font-weight: 600; }
.slot.filled { border-color: transparent; }
.cta { padding: 11px 22px; border-radius: 99px; background: var(--ink); color: #fff; font-size: 13px; font-weight: 600; }
.slot .cta { position: absolute; opacity: 0; transform: scale(.92); transition: all .35s; }
.slot .cta.shown { opacity: 1; transform: none; }
.cta.static { margin-top: 4px; }
.code { margin: 0; padding: 20px; border-radius: 16px; background: #1b1830; color: #e8e4ff; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; line-height: 1.9; overflow: auto; }
.code .k { color: #8fb4ff; } .code .a { color: #c9a8ff; } .code .s { color: #8fe3b5; }

.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.mc { padding: 6px 12px; border-radius: 8px; background: rgba(255, 255, 255, .7); color: var(--muted); font-size: 12px; font-weight: 500; font-family: ui-monospace, Menlo, monospace; transition: all .3s; }
.mc.on { background: var(--ink); color: #fff; }
.m { padding: 1px 6px; border-radius: 6px; transition: all .3s; }
.m.hl { background: var(--sky); color: var(--sky-i); font-family: ui-monospace, Menlo, monospace; font-size: 14px; }
.m.res { padding: 0; }

.ab { display: flex; flex-direction: column; gap: 12px; }
.badge { align-self: flex-start; padding: 5px 12px; border-radius: 99px; background: #fff; color: var(--butter-i); font-size: 12px; font-weight: 600; }
.vr { display: grid; gap: 8px; padding: 14px 16px; border-radius: 16px; background: #fff; transition: box-shadow .4s; }
.vr.win { box-shadow: inset 0 0 0 1.5px var(--mint-i); }
.vh { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.vh b { display: grid; place-items: center; flex: none; width: 24px; height: 24px; border-radius: 8px; background: var(--butter); color: var(--butter-i); font-size: 12px; }
.vh span { flex: 1; min-width: 0; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vh em { padding: 2px 9px; border-radius: 6px; background: var(--mint); color: var(--mint-i); font-size: 11px; font-style: normal; font-weight: 600; }
.track { height: 6px; border-radius: 4px; background: #f5efdc; overflow: hidden; }
.track i { display: block; height: 100%; background: #d8b13a; border-radius: 4px; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.vr.win .track i { background: var(--mint-i); }
.vr small { font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }

.chat { display: flex; flex-direction: column; gap: 10px; padding: 18px; border-radius: 18px; background: #efeae2; min-height: 170px; }
.bub { max-width: 90%; padding: 10px 14px 6px; border-radius: 4px 16px 16px 16px; background: #fff; font-size: 13px; line-height: 1.55; opacity: 0; transform: translateY(8px); transition: all .4s; }
.bub.show { opacity: 1; transform: none; }
.bub p { margin: 0; }
.tm { display: block; text-align: right; font-size: 10px; color: #7a8a80; }
.qr { display: flex; gap: 8px; opacity: 0; transform: translateY(6px); transition: all .4s; }
.qr.show { opacity: 1; transform: none; }
.qr span { flex: 1; padding: 9px; border-radius: 12px; background: #fff; color: var(--mint-i); font-size: 12.5px; font-weight: 600; text-align: center; }
.appr { align-self: flex-start; padding: 6px 14px; border-radius: 99px; background: #fff; color: var(--mint-i); font-size: 12px; font-weight: 600; opacity: 0; transition: opacity .4s; }
.appr.show { opacity: 1; }
.slotname { font-size: 12px; color: var(--muted); }

@media (max-width: 900px) {
  .stage { grid-template-columns: 1fr; }
  .ph { min-height: 320px; }
}
@media (max-width: 640px) {
  .c2 { padding: 64px 16px; }
  .tb { font-size: 12.5px; }
  .pn { padding: 18px; border-radius: 22px; }
  .ph { border-radius: 22px; min-height: 280px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .tabs, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
