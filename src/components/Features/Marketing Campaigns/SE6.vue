<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ComplianceSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "professional-man-working-on-laptop-in-modern-offic-2026-09-24-00-16-46-utc.webp";

const checks = [
  "Unsubscribe link included in every message",
  "Consent verified for 4,820 contacts",
  "GDPR-ready controls switched on",
  "Suppression list applied",
];
const consent = [
  { k: "Source", v: "Website form" },
  { k: "Consent given", v: "12 Mar 2026, 10:42" },
  { k: "Channel", v: "Email and WhatsApp" },
  { k: "Wording shown", v: "Version 3" },
];

const sub = computed(() => (reduce ? 9 : n.value % 12));
const ready = computed(() => sub.value >= 5);
const clicked = computed(() => sub.value >= 7);
const suppressed = computed(() => sub.value >= 8);
const count = computed(() => (suppressed.value ? 215 : 214));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1000);
}
function stop() {
  clearInterval(timer);
  timer = null;
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
  <section ref="root" class="cm" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Compliance</span> <span class="l2">built in</span></h2>
        <p>Unsubscribe handling, consent records and GDPR-ready controls are part of every campaign.</p>
      </header>

      <div class="grid">
        <!-- pre-send check -->
        <article class="cd chk">
          <div class="ch">
            <span class="lb">Service reminder · Email</span>
            <span class="pill">Compliance check</span>
          </div>
          <ul>
            <li v-for="(c, i) in checks" :key="c" :class="{ on: sub >= i + 1 }">
              <span class="tick">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
              </span>
              {{ c }}
            </li>
          </ul>
          <span class="send" :class="{ on: ready }">{{ ready ? "Ready to send" : "Checking compliance…" }}</span>
        </article>

        <!-- photo -->
        <figure class="ph">
          <img v-if="ok" :src="photo" alt="" @error="ok = false" />
          <figcaption>
            <span class="sh"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.500-3.200 8-8 9-4.800-1-8-4.500-8-9V6Z" /><path d="m9 12 2 2 4-4" /></svg></span>
            <div><strong>Consent on record</strong><small>Every contact, every channel</small></div>
          </figcaption>
        </figure>

        <!-- unsubscribe -->
        <article class="cd un">
          <div class="ch"><span class="lb">Unsubscribe handling</span></div>
          <div class="mail">
            <p>Your fleet service plan is ready for review.</p>
            <small class="ft">Unsubscribe · Saptivo</small>
          </div>
          <div class="ev" :class="{ on: clicked }">
            <span>Kasun clicked Unsubscribe</span>
          </div>
          <div class="ev sup" :class="{ on: suppressed }">
            <span>Added to the suppression list. No future sends.</span>
            <b>{{ count }}</b>
          </div>
        </article>

        <!-- consent -->
        <article class="cd cn">
          <div class="ch"><span class="lb">Consent record · Dilani Perera</span></div>
          <dl>
            <div v-for="(c, i) in consent" :key="c.k" :class="{ on: sub >= i + 1 }">
              <dt>{{ c.k }}</dt>
              <dd>{{ c.v }}</dd>
            </div>
          </dl>
          <span class="tag">GDPR export and delete ready</span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cm {
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
.cm *, .cm *::before, .cm *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.cm h2 .l1 { color: #111111 !important; opacity: 1; }
.cm h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .08s; }

.grid { display: grid; grid-template-columns: 1fr 1fr 330px; gap: 18px; }
.chk { grid-column: 1 / 3; }
.ph { grid-column: 3; grid-row: 1 / 3; }

.cd { border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.chk { background: var(--mint); }
.un { background: var(--sky); }
.cn { background: var(--lav); }
.ch { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.pill { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #fff; color: var(--mint-i); }

.chk ul { list-style: none; margin: 0; padding: 18px; background: #fff; border-radius: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; }
.chk li { display: flex; align-items: flex-start; gap: 12px; font-size: 13.5px; line-height: 1.5; color: #a0a5ad; transition: color .4s; }
.chk li.on { color: var(--ink); }
.tick { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; flex: none; background: #eef1f4; color: transparent; transition: all .4s; }
.tick svg { width: 12px; height: 12px; }
.chk li.on .tick { background: var(--mint-i); color: #fff; }
.send { align-self: flex-start; padding: 11px 24px; border-radius: 99px; background: rgba(255, 255, 255, .7); color: var(--muted); font-size: 13px; font-weight: 600; transition: all .4s; }
.send.on { background: var(--ink); color: #fff; }

.ph { position: relative; margin: 0; border-radius: 24px; overflow: hidden; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); min-height: 400px; }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.ph figcaption { position: absolute; left: 16px; right: 16px; bottom: 16px; background: #fff; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
.sh { width: 36px; height: 36px; border-radius: 12px; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; flex: none; }
.ph strong { display: block; font-size: 14px; font-weight: 600; }
.ph small { font-size: 12px; color: var(--muted); }

.mail { background: #fff; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
.mail p { margin: 0; font-size: 13px; color: var(--muted); line-height: 1.6; }
.ft { font-size: 11.5px; color: var(--sky-i); text-decoration: underline; padding-top: 8px; border-top: 1px solid var(--line); }
.ev { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 12px; background: rgba(255, 255, 255, .5); font-size: 13px; color: #98a3ae; transition: all .4s; }
.ev.on { background: #fff; color: var(--ink); }
.ev.sup.on { background: var(--mint); color: var(--mint-i); font-weight: 500; }
.ev b { font-size: 18px; font-weight: 600; font-variant-numeric: tabular-nums; }

.cn dl { margin: 0; padding: 6px 16px; background: #fff; border-radius: 16px; }
.cn dl div { display: flex; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--line); font-size: 13px; opacity: .35; transition: opacity .4s; }
.cn dl div:last-child { border-bottom: 0; }
.cn dl div.on { opacity: 1; }
.cn dt { color: var(--muted); }
.cn dd { margin: 0; font-weight: 500; text-align: right; }
.tag { align-self: flex-start; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 99px; background: #fff; color: var(--lav-i); }

@media (max-width: 1020px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .chk { grid-column: 1 / 3; }
  .ph { grid-column: 1 / 3; grid-row: auto; min-height: 300px; order: 5; }
}
@media (max-width: 760px) {
  .grid { grid-template-columns: 1fr; }
  .chk, .ph { grid-column: 1; }
  .chk ul { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .cm { padding: 64px 16px; }
  .cd { padding: 16px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
