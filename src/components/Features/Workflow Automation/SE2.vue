<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "TriggersSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const sub = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG";
const photoOk = ref(true);

const items = [
  { tone: "lav", t: "A record is created or updated", ic: "M12 5v14M5 12h14", toast: "New contact created" },
  { tone: "mint", t: "A field changes to a specific value, such as deal stage set to Won", ic: "M4 12h6m4 0h6M10 8l4 4-4 4", toast: "Deal stage set to Won" },
  { tone: "butter", t: "A date arrives, such as three days before a quotation expires", ic: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4", toast: "3 days before the quotation expires" },
  { tone: "rose", t: "A user takes an action, such as closing a ticket", ic: "M5 12l5 5 9-10", toast: "Ticket closed by a user" },
];

const left = computed(() => 5 - Math.min(sub.value, 2)); // 5, 4, 3 days
const toast = computed(() => sub.value >= 3);

function tickFn() {
  if (sub.value < 3) sub.value++;
  else if (!manual.value) {
    step.value = (step.value + 1) % items.length;
    sub.value = 0;
  }
}
function pick(i) {
  manual.value = true;
  step.value = i;
  sub.value = 0;
  start();
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tickFn, 1250);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    sub.value = 3;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.25 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="tr" :class="{ in: shown }">
    <div class="wrap">
      <!-- photo -->
      <div class="pic">
        <div class="frame">
          <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
          <div class="shade"></div>

          <span class="glass top"><i></i>Workflow trigger</span>

          <Transition name="toast" mode="out-in">
            <div v-if="toast" :key="step" class="toastc">
              <span class="bolt">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
              </span>
              <div><strong>Workflow started</strong><span>{{ items[step].toast }}</span></div>
            </div>
            <div v-else key="idle" class="toastc idle">
              <span class="bolt off">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
              </span>
              <div><strong>Watching for a trigger</strong><span>{{ items[step].toast }}</span></div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- list -->
      <div class="copy">
        <h2><span class="l1">Triggers</span></h2>

        <ul class="list">
          <li v-for="(it, i) in items" :key="it.t" class="it" :class="['tone-' + it.tone, { act: step === i }]">
            <button type="button" class="hd" :aria-expanded="step === i" @click="pick(i)">
              <span class="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="it.ic" /></svg>
              </span>
              <span class="tx">{{ it.t }}</span>
              <span class="no">{{ i + 1 }}</span>
            </button>

            <div class="drawer">
              <div class="inner">
                <div v-if="step === i" class="mini" aria-hidden="true">
                  <!-- 1 -->
                  <template v-if="i === 0">
                    <Transition name="pop" mode="out-in">
                      <div v-if="sub >= 1" key="r" class="rec">
                        <b>D</b>
                        <div><strong>Dilani Perera</strong><span>Contact</span></div>
                        <em :class="sub >= 2 ? 'up' : 'cr'">{{ sub >= 2 ? "Updated · phone" : "Created" }}</em>
                      </div>
                      <div v-else key="w" class="wait">Waiting for a record…</div>
                    </Transition>
                  </template>
                  <!-- 2 -->
                  <template v-else-if="i === 1">
                    <div class="fld">
                      <span>Deal stage</span>
                      <Transition name="swap" mode="out-in">
                        <b :key="sub >= 1" :class="{ won: sub >= 1 }">{{ sub >= 1 ? "Won" : "Negotiation" }}</b>
                      </Transition>
                    </div>
                    <div class="cond" :class="{ on: sub >= 2 }">Condition: Deal stage is Won</div>
                  </template>
                  <!-- 3 -->
                  <template v-else-if="i === 2">
                    <div class="qt">
                      <div><strong>Quotation Q-1051</strong><span>Expires 12 Nov</span></div>
                      <span class="days" :class="{ hit: sub >= 2 }"><b>{{ left }}</b> days left</span>
                    </div>
                    <div class="cond" :class="{ on: sub >= 2 }">Date rule: 3 days before expiry</div>
                  </template>
                  <!-- 4 -->
                  <template v-else>
                    <div class="tk">
                      <div><strong>Ticket #204</strong><span>Delivery delay</span></div>
                      <span class="stt" :class="{ closed: sub >= 2 }">{{ sub >= 2 ? "Closed" : "Open" }}</span>
                    </div>
                    <span class="btn" :class="{ press: sub === 1 }">Close ticket</span>
                  </template>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tr {
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
  overflow: hidden;
}
.wrap { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.05fr; gap: 56px; align-items: center; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--rose); color: var(--rose-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 28px; font-size: clamp(40px, 4.6vw, 64px); font-weight: 500; line-height: 1.08; letter-spacing: -0.035em; }
h2 span { display: block; }
.tr h2 .l1 { color: #111111 !important; opacity: 1; }

.pic, .copy { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .pic, .in .copy { opacity: 1; transform: none; }
.in .copy { transition-delay: .12s; }

/* photo */
.pic { position: relative; }
.pic::before { content: ""; position: absolute; inset: 22px 22px -18px -18px; background: linear-gradient(160deg, #ece7ff, #e1f0ff 60%, #def5e9); border-radius: 36px; }
.frame { position: relative; height: 560px; border-radius: 30px; overflow: hidden; background: linear-gradient(135deg, #e8e3ff, #dcecfb 55%, #d3f0e1); }
.frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 55% 30%; }
.shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, 0) 50%, rgba(20, 18, 15, .5) 100%); }
.glass { position: absolute; display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; padding: 8px 15px; border-radius: 99px; background: rgba(255, 255, 255, .78); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
.glass.top { left: 18px; top: 18px; }
.glass i { width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); }
.toastc { position: absolute; left: 18px; right: 18px; bottom: 18px; display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 20px; background: rgba(255, 255, 255, .88); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); box-shadow: 0 14px 34px rgba(0, 0, 0, .18); }
.toastc strong { display: block; font-size: 14px; }
.toastc span { font-size: 12px; color: var(--muted); }
.bolt { width: 38px; height: 38px; border-radius: 12px; background: var(--ink); color: #ffd84d; display: grid; place-items: center; flex: none; }
.bolt svg { width: 20px; height: 20px; }
.bolt.off { background: #eceaf3; color: #9a9fa8; }

/* list */
.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); --tb: #fff5f8; }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.it { background: #fff; border: 1px solid var(--line); border-radius: 20px; transition: background .35s, border-color .35s; overflow: hidden; }
.it.act { background: var(--tb); border-color: var(--ti); }
.hd { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; display: flex; align-items: center; gap: 14px; padding: 14px 16px; }
.hd:focus-visible { outline: 2px solid var(--ink); outline-offset: -2px; border-radius: 20px; }
.ic svg { width: 36px; height: 36px; padding: 9px; border-radius: 12px; background: var(--t); color: var(--ti); display: block; }
.tx { flex: 1; font-size: 15px; line-height: 1.5; font-weight: 500; }
.no { width: 24px; height: 24px; border-radius: 50%; background: #f3f1fa; color: var(--muted); font-size: 11px; font-weight: 700; display: grid; place-items: center; transition: all .3s; flex: none; }
.it.act .no { background: var(--ink); color: #fff; }

.drawer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s ease; }
.it.act .drawer { grid-template-rows: 1fr; }
.inner { overflow: hidden; min-height: 0; }
.mini { margin: 0 16px 16px; background: #fff; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 10px; min-height: 96px; justify-content: center; position: relative; }
.wait { font-size: 12px; color: var(--muted); text-align: center; }
.rec { display: flex; align-items: center; gap: 12px; }
.rec b { width: 34px; height: 34px; border-radius: 50%; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-size: 13px; }
.rec strong { display: block; font-size: 13px; }
.rec span { font-size: 11px; color: var(--muted); }
.rec em { margin-left: auto; font-style: normal; font-size: 11px; font-weight: 600; padding: 4px 11px; border-radius: 99px; }
.rec em.cr { background: var(--mint); color: var(--mint-i); }
.rec em.up { background: var(--butter); color: var(--butter-i); }
.fld { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #f8f7fc; border-radius: 12px; font-size: 12px; color: var(--muted); }
.fld b { font-size: 12.5px; padding: 4px 12px; border-radius: 99px; background: #eceaf3; color: var(--ink); }
.fld b.won { background: var(--mint); color: var(--mint-i); }
.cond { align-self: flex-start; font-size: 11px; font-weight: 600; color: var(--muted); background: #f3f1fa; padding: 6px 12px; border-radius: 99px; transition: all .35s; }
.cond.on { background: var(--ink); color: #fff; }
.qt, .tk { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; background: #f8f7fc; border-radius: 12px; }
.qt strong, .tk strong { display: block; font-size: 13px; }
.qt span, .tk span { font-size: 11px; color: var(--muted); }
.days { text-align: center; font-size: 11px; background: #fff; padding: 6px 12px; border-radius: 12px; transition: all .35s; }
.days b { font-size: 20px; display: block; line-height: 1.1; color: var(--ink); }
.days.hit { background: var(--butter); }
.days.hit b { color: var(--butter-i); }
.stt { font-size: 11px; font-weight: 600; padding: 4px 11px; border-radius: 99px; background: var(--butter); color: var(--butter-i) !important; transition: all .35s; }
.stt.closed { background: var(--mint); color: var(--mint-i) !important; }
.btn { align-self: flex-start; font-size: 12px; font-weight: 600; background: var(--ink); color: #fff; padding: 8px 16px; border-radius: 99px; transition: all .25s; }
.btn.press { transform: scale(.94); box-shadow: 0 0 0 4px var(--rose); }

.toast-enter-active, .toast-leave-active { transition: all .4s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
.pop-enter-active { transition: all .4s cubic-bezier(.2, 1.3, .4, 1); }
.pop-enter-from { opacity: 0; transform: scale(.92); }
.swap-enter-active, .swap-leave-active { transition: all .2s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(4px); }

@media (max-width: 960px) {
  .wrap { grid-template-columns: 1fr; gap: 48px; }
  .frame { height: 420px; }
  .copy { order: -1; }
}
@media (max-width: 560px) {
  .tr { padding: 64px 16px; }
  .frame { height: 340px; }
  .pic::before { inset: 16px 12px -12px -8px; }
}
@media (prefers-reduced-motion: reduce) {
  .pic, .copy { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
