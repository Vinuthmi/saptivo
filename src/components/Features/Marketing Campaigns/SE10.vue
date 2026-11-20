<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "EmailWhatsAppSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const manual = ref(-1);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const segs = [
  { t: "Newsletter subscribers", c: "1,820 contacts", ch: ["Email"], note: "Detailed offer, read at leisure" },
  { t: "Service visit tomorrow", c: "64 contacts", ch: ["WhatsApp"], note: "Short and time-sensitive" },
  { t: "Kasun · opted out of WhatsApp", c: "1 contact", ch: ["Email"], block: "WhatsApp", note: "Opt-in choice respected" },
];

const idx = computed(() => {
  if (manual.value >= 0) return manual.value;
  return reduce ? 1 : Math.floor(n.value / 4) % 3;
});
const sub = computed(() => (manual.value >= 0 || reduce ? 3 : n.value % 4));
const cur = computed(() => segs[idx.value]);
const emailOn = computed(() => idx.value !== 1);
const waOn = computed(() => idx.value === 1);
const waBlocked = computed(() => idx.value === 2);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce || manual.value >= 0) return;
  timer = setInterval(tick, 1000);
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
  <section ref="root" class="ew" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Email and WhatsApp</span> <span class="l2">working together</span></h2>
        <p>
          Use email for newsletters and detailed offers, and WhatsApp templates for short, time-sensitive messages
          customers read within minutes. Saptivo lets you choose the right channel for each segment and respects every
          customer's opt-in choices.
        </p>
      </header>

      <div class="stage">
        <!-- email -->
        <article class="ch email" :class="{ dim: !emailOn }">
          <div class="ct"><span class="badge">Email</span><small>Newsletters and detailed offers</small></div>
          <div class="mail">
            <template v-if="idx === 0">
              <h4>November offers for fleet owners</h4>
              <p>Save on service plans, spare parts and annual contracts. See every offer in one place, with prices and terms.</p>
              <ul><li>AMC renewal, 10% off</li><li>Genuine filter pack</li><li>Priority visit slots</li></ul>
              <span class="cta">See all offers</span>
            </template>
            <template v-else-if="idx === 2">
              <h4>Your service visit is tomorrow</h4>
              <p>Hi Kasun, a technician will visit between 10:00 and 12:00. Reply to this email to reschedule.</p>
              <span class="cta">Reschedule</span>
            </template>
            <template v-else>
              <h4>Newsletter, offers, detailed updates</h4>
              <p>Longer content stays on email.</p>
            </template>
          </div>
        </article>

        <!-- router -->
        <div class="rt">
          <small class="lb">Choose the channel for each segment</small>
          <ul>
            <li v-for="(s, i) in segs" :key="s.t">
              <button type="button" :class="{ on: i === idx }" @click="pick(i)">
                <span class="tt"><b>{{ s.t }}</b><small>{{ s.c }}</small></span>
                <span class="chs">
                  <em v-for="c in s.ch" :key="c" :class="c.toLowerCase()">{{ c }}</em>
                  <em v-if="s.block" class="blk">{{ s.block }} ✕</em>
                </span>
              </button>
            </li>
          </ul>
          <div class="note"><i></i>{{ cur.note }}</div>
        </div>

        <!-- whatsapp -->
        <article class="ch wa" :class="{ dim: !waOn && !waBlocked }">
          <div class="ct"><span class="badge g">WhatsApp</span><small>Short, time-sensitive</small></div>
          <div class="chat">
            <template v-if="waOn">
              <div class="bub" :class="{ show: sub >= 1 }">
                <p>Hi <b>Dilani</b>, your service visit is tomorrow at <b>10:00</b>. Reply YES to confirm.</p>
                <span class="tm">10:24</span>
              </div>
              <div class="reply" :class="{ show: sub >= 2 }">
                <span class="av"><img v-if="ok" :src="photo" alt="" @error="ok = false" /><b v-else>D</b></span>
                <span class="rb">Yes</span>
              </div>
              <span class="read" :class="{ show: sub >= 3 }">Read within 2 minutes</span>
            </template>
            <template v-else-if="waBlocked">
              <div class="lock" :class="{ show: sub >= 1 }">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                <b>Not sent</b>
                <small>Kasun has not opted in to WhatsApp</small>
              </div>
            </template>
            <template v-else>
              <p class="idle">Short templates for time-sensitive messages.</p>
            </template>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ew {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.ew *, .ew *::before, .ew *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 840px; margin: 0 auto 52px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ew h2 .l1 { color: #111111 !important; opacity: 1; }
.ew h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .08s; }

.stage { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) minmax(0, 1fr); gap: 18px; align-items: stretch; }

.ch { border-radius: 26px; padding: 20px; display: flex; flex-direction: column; gap: 16px; transition: opacity .4s; }
.ch.email { background: var(--lav); }
.ch.wa { background: var(--mint); }
.ch.dim { opacity: .4; }
.ct { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.ct small { font-size: 12px; color: var(--muted); }
.badge { padding: 5px 12px; border-radius: 99px; background: #fff; color: var(--lav-i); font-size: 12px; font-weight: 600; }
.badge.g { color: var(--mint-i); }

.mail { flex: 1; background: #fff; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; min-height: 260px; }
.mail h4 { margin: 0; font-size: 16px; font-weight: 600; line-height: 1.35; letter-spacing: -.01em; }
.mail p { margin: 0; font-size: 13px; line-height: 1.6; color: var(--muted); }
.mail ul { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.8; }
.cta { margin-top: auto; padding: 10px 20px; border-radius: 99px; background: var(--ink); color: #fff; font-size: 12.5px; font-weight: 600; }

.chat { flex: 1; background: #efeae2; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 10px; min-height: 260px; }
.bub { max-width: 92%; padding: 10px 12px 6px; border-radius: 4px 14px 14px 14px; background: #fff; font-size: 13px; line-height: 1.55; opacity: 0; transform: translateY(8px); transition: all .4s; }
.bub.show { opacity: 1; transform: none; }
.bub p { margin: 0; }
.tm { display: block; text-align: right; font-size: 10px; color: #7a8a80; }
.reply { align-self: flex-end; display: flex; align-items: center; gap: 8px; opacity: 0; transform: translateY(6px); transition: all .4s; }
.reply.show { opacity: 1; transform: none; }
.rb { background: #d9f2c9; padding: 8px 16px; border-radius: 14px 14px 4px 14px; font-size: 13px; font-weight: 500; }
.av { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-size: 11px; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.read { align-self: flex-end; font-size: 11.5px; font-weight: 600; color: var(--mint-i); background: #fff; padding: 4px 10px; border-radius: 6px; opacity: 0; transition: opacity .4s; }
.read.show { opacity: 1; }
.lock { margin: auto; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; color: var(--rose-i); opacity: 0; transition: opacity .4s; }
.lock.show { opacity: 1; }
.lock small { color: var(--muted); font-size: 12.5px; }
.idle { margin: auto; font-size: 13px; color: var(--muted); text-align: center; }

/* router */
.rt { border: 1px solid var(--line); border-radius: 26px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.rt ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.rt li { display: flex; flex: 1; }
.rt button { all: unset; box-sizing: border-box; cursor: pointer; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 14px 16px; border-radius: 16px; border: 1.5px solid var(--line); transition: all .3s; }
.rt button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.rt button.on { border-color: var(--ink); background: #fafafa; }
.tt { display: flex; flex-direction: column; }
.tt b { font-size: 14px; font-weight: 500; }
.tt small { font-size: 12px; color: var(--muted); }
.chs { display: flex; gap: 6px; flex-wrap: wrap; }
.chs em { font-style: normal; font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 6px; }
.chs .email { background: var(--lav); color: var(--lav-i); }
.chs .whatsapp { background: var(--mint); color: var(--mint-i); }
.chs .blk { background: var(--rose); color: var(--rose-i); }
.note { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 12px; background: #f6f7f9; font-size: 12.5px; color: var(--muted); }
.note i { width: 8px; height: 8px; border-radius: 50%; background: var(--ink); flex: none; }

@media (max-width: 1000px) {
  .stage { grid-template-columns: 1fr; max-width: 560px; margin-left: auto; margin-right: auto; }
  .rt { order: -1; }
}
@media (max-width: 640px) {
  .ew { padding: 64px 16px; }
  .ch, .rt { padding: 16px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>