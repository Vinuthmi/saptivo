<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "NotificationsSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const types = [
  { id: "t", k: "Ticket replies", t: "Support replied to your ticket", d: "Re: Compressor not cooling", w: "2 min ago", c: "lav" },
  { id: "i", k: "New invoices", t: "New invoice INV-2056", d: "LKR 45,000 · due 30 Nov", w: "1 hr ago", c: "butter" },
  { id: "q", k: "Quotes awaiting action", t: "Quotation QT-1042 awaits your signature", d: "Solar installation", w: "3 hr ago", c: "sky" },
  { id: "d", k: "Shared documents", t: "A document was shared with you", d: "Service Level Agreement v3", w: "Yesterday", c: "rose" },
  { id: "m", k: "Milestones", t: "Milestone reached: Installation", d: "70% complete", w: "Yesterday", c: "mint" },
];
const freqs = ["Instantly", "Daily", "Weekly"];

const sub = computed(() => (still.value ? 10 : n.value % 13));
const count = computed(() => Math.min(sub.value, 5));
const list = computed(() => types.slice(0, count.value).reverse());
const mileOn = computed(() => sub.value < 8);
const freq = computed(() => (sub.value >= 10 ? 1 : 0));
const mail = computed(() => sub.value >= 3);

function on(i) {
  return i < 4 ? true : mileOn.value;
}

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
  <section ref="root" class="nt" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Notifications</span></h2>
        <p>
          An in-portal notification centre and email alerts tell customers about ticket replies, new invoices, quotes
          awaiting action, shared documents and milestones. Customers choose which alerts they want, and how often.
        </p>
      </header>

      <div class="grid">
        <!-- centre -->
        <article class="centre">
          <div class="ch">
            <span class="bell">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
              <em v-if="count" :key="count">{{ count }}</em>
            </span>
            <div><strong>Notification centre</strong><small>In your customer portal</small></div>
          </div>

          <TransitionGroup name="nl" tag="ul" class="list">
            <li v-for="x in list" :key="x.id">
              <i :class="x.c"></i>
              <span class="tx"><b>{{ x.t }}</b><small>{{ x.d }}</small></span>
              <time>{{ x.w }}</time>
            </li>
          </TransitionGroup>
          <p v-if="!list.length" class="empty">You are all caught up</p>
        </article>

        <!-- right -->
        <div class="side">
          <article class="prefs">
            <span class="lb">Choose your alerts</span>
            <ul>
              <li v-for="(t, i) in types" :key="t.id">
                <span>{{ t.k }}</span>
                <span class="sw" :class="{ on: on(i) }"><i></i></span>
              </li>
            </ul>
            <div class="fq">
              <small>How often</small>
              <div class="seg"><span v-for="(f, i) in freqs" :key="f" :class="{ on: i === freq }">{{ f }}</span></div>
            </div>
          </article>

          <article class="mail" :class="{ show: mail }">
            <span class="lb">Email alert</span>
            <div class="em">
              <b>Saptivo · New invoice INV-2056</b>
              <small>Your invoice for LKR 45,000 is ready. Pay online in the portal.</small>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nt {
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
.nt *, .nt *::before, .nt *::after { box-sizing: border-box; }
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.nt h2 .l1 { color: #111111 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .1s; }

.grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr); gap: 14px; align-items: stretch; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

.centre { background: var(--lav); border-radius: 28px; padding: 20px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ch { display: flex; align-items: center; gap: 14px; }
.ch div { display: flex; flex-direction: column; }
.ch strong { font-size: 15px; font-weight: 600; }
.ch small { font-size: 12px; color: var(--muted); }
.bell { position: relative; width: 40px; height: 40px; border-radius: 13px; background: var(--ink); color: #fff; display: grid; place-items: center; flex: none; }
.bell em { position: absolute; top: -6px; right: -6px; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 10px; background: var(--rose-i); color: #fff; font-style: normal; font-size: 11px; font-weight: 600; display: grid; place-items: center; border: 2px solid var(--lav); animation: pop .3s ease both; }
@keyframes pop { from { transform: scale(.7); opacity: 0; } to { transform: none; opacity: 1; } }

.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; position: relative; min-height: 340px; align-content: start; }
.list li { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; gap: 12px; align-items: center; background: #fff; border-radius: 16px; padding: 13px 16px; }
.list i { width: 9px; height: 9px; border-radius: 50%; }
.list i.lav { background: var(--lav-i); } .list i.butter { background: #d8b13a; } .list i.sky { background: var(--sky-i); } .list i.rose { background: var(--rose-i); } .list i.mint { background: var(--mint-i); }
.tx { display: flex; flex-direction: column; min-width: 0; }
.tx b { font-size: 13.5px; font-weight: 500; line-height: 1.4; }
.tx small { font-size: 12px; color: var(--muted); }
.list time { font-size: 11.5px; color: var(--muted); white-space: nowrap; }
.nl-enter-active { transition: all .5s cubic-bezier(.2, .8, .2, 1); }
.nl-leave-active { transition: opacity .2s; position: absolute; left: 0; right: 0; }
.nl-move { transition: transform .5s cubic-bezier(.2, .8, .2, 1); }
.nl-enter-from { opacity: 0; transform: translateY(-14px); }
.nl-leave-to { opacity: 0; }
.empty { margin: 0; text-align: center; font-size: 13px; color: var(--muted); padding: 10px; }

.side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.prefs { background: var(--sky); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.prefs ul { list-style: none; margin: 0; padding: 4px 16px; background: #fff; border-radius: 18px; }
.prefs li { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 11px 0; border-bottom: 1px solid var(--line); font-size: 13.5px; }
.prefs li:last-child { border-bottom: 0; }
.sw { width: 36px; height: 20px; border-radius: 10px; background: #d9dce0; position: relative; flex: none; transition: background .3s; }
.sw i { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .3s; }
.sw.on { background: var(--ink); }
.sw.on i { transform: translateX(16px); }
.fq { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.fq small { font-size: 12.5px; color: var(--muted); }
.seg { display: flex; gap: 3px; padding: 3px; background: rgba(255, 255, 255, .7); border-radius: 99px; }
.seg span { font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 99px; color: var(--muted); transition: all .3s; }
.seg span.on { background: var(--ink); color: #fff; }

.mail { background: var(--butter); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 12px; flex: 1; opacity: .35; transform: translateY(8px); transition: all .5s ease; }
.mail.show { opacity: 1; transform: none; }
.em { background: #fff; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
.em b { font-size: 13.5px; font-weight: 600; }
.em small { font-size: 12.5px; line-height: 1.6; color: var(--muted); }

@media (max-width: 860px) {
  .grid { grid-template-columns: 1fr; }
  .list { min-height: 0; }
}
@media (max-width: 640px) {
  .nt { padding: 64px 16px; }
  .centre, .prefs, .mail { padding: 14px; border-radius: 22px; }
  .list li { grid-template-columns: 10px minmax(0, 1fr); }
  .list time { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  .bell em { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
