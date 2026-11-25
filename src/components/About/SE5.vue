<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhatMakesDifferentSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const points = [
  { k: "WhatsApp", t: "WhatsApp is a core channel, not an afterthought" },
  { k: "3CX", t: "Phone calls are logged through 3CX" },
  { k: "LKR and VAT", t: "Quotations and invoices handle LKR and VAT" },
  { k: "Service", t: "After-sales service sits alongside sales in the same system" },
];
const feed = [
  { tag: "WhatsApp", c: "mint", t: "Can you send the revised price?", m: "Customer message" },
  { tag: "Call", c: "sky", t: "Call logged through 3CX", m: "04:12 · notes added" },
  { tag: "Quotation", c: "butter", t: "QT-1042 sent", m: "LKR 150,000 + VAT" },
  { tag: "Service", c: "rose", t: "AMC technician visit booked", m: "Next week · Nimal" },
];

const sub = computed(() => (still.value ? 11 : n.value % 12));
const count = computed(() => Math.min(Math.floor((sub.value + 1) / 2.5), 4));
const cur = computed(() => Math.max(count.value - 1, 0));

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
  <section ref="root" class="wd" :class="{ in: shown }">
    <div class="wrap">
      <div class="left">
        <h2><span class="l1">What makes</span> <span class="l2">Saptivo different</span></h2>
        <p>
          Saptivo is built for the way businesses in Sri Lanka and fast-growing markets actually operate. WhatsApp is a
          core channel, not an afterthought. Phone calls are logged through 3CX. Quotations and invoices handle LKR and
          VAT. And after-sales service, from AMC contracts to technician visits, sits alongside sales in the same
          system.
        </p>

        <ul class="pts">
          <li v-for="(p, i) in points" :key="p.k" :class="{ on: i === cur && count > 0 }">
            <span class="no">{{ i + 1 }}</span>
            <span class="tx">{{ p.t }}</span>
          </li>
        </ul>
      </div>

      <div class="panel">
        <div class="rec">
          <div class="rh">
            <span class="av">C</span>
            <div><b>Colombo Hotels</b><small>One customer record</small></div>
            <span class="pill">Same system</span>
          </div>

          <ol class="feed">
            <li v-for="(f, i) in feed" :key="f.tag" :class="[f.c, { vis: count > i, now: count - 1 === i }]">
              <span class="tag">{{ f.tag }}</span>
              <span class="ev"><b>{{ f.t }}</b><small>{{ f.m }}</small></span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wd {
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
.wd *, .wd *::before, .wd *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; align-items: center; }
.left, .panel { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .left, .in .panel { opacity: 1; transform: none; }
.in .panel { transition-delay: .12s; }

h2 { margin: 0 0 20px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.wd h2 .l1 { color: #111111 !important; opacity: 1; }
.wd h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.left > p { margin: 0 0 28px; font-size: 16px; line-height: 1.8; color: var(--muted); max-width: 56ch; }

.pts { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.pts li { display: flex; align-items: center; gap: 14px; padding: 14px 4px; border-bottom: 1px solid var(--line); position: relative; }
.pts li::before { content: ""; position: absolute; left: 0; top: -1px; height: 2px; width: 0; background: var(--ink); transition: width .45s ease; }
.pts li.on::before { width: 100%; }
.no { width: 24px; height: 24px; border-radius: 50%; background: #f1f2f4; color: var(--muted); display: grid; place-items: center; font-size: 11.5px; font-weight: 600; flex: none; transition: all .3s; }
.tx { font-size: 14.5px; line-height: 1.5; color: var(--muted); transition: color .3s; }
.pts li.on .no { background: var(--ink); color: #fff; }
.pts li.on .tx { color: var(--ink); font-weight: 500; }

.panel { background: var(--ink); border-radius: 32px; padding: 18px; }
.rec { background: #fff; border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 18px; min-height: 440px; }
.rh { display: flex; align-items: center; gap: 12px; }
.rh div { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.rh b { font-size: 15px; font-weight: 600; }
.rh small { font-size: 12px; color: var(--muted); }
.av { width: 38px; height: 38px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 14px; flex: none; }
.pill { font-size: 11.5px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #f1f2f4; color: var(--ink); white-space: nowrap; }

.feed { list-style: none; margin: 0; padding: 0 0 0 4px; display: flex; flex-direction: column; gap: 14px; position: relative; }
.feed::before { content: ""; position: absolute; left: 15px; top: 8px; bottom: 8px; width: 2px; background: var(--line); }
.feed li { position: relative; display: flex; align-items: flex-start; gap: 14px; opacity: .15; transform: translateX(-6px); transition: all .5s ease; }
.feed li.vis { opacity: 1; transform: none; }
.tag { position: relative; z-index: 1; flex: none; width: 72px; text-align: center; font-size: 11px; font-weight: 600; padding: 4px 0; border-radius: 8px; border: 2px solid #fff; }
.feed li.mint .tag { background: var(--mint); color: var(--mint-i); }
.feed li.sky .tag { background: var(--sky); color: var(--sky-i); }
.feed li.butter .tag { background: var(--butter); color: var(--butter-i); }
.feed li.rose .tag { background: var(--rose); color: var(--rose-i); }
.ev { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; background: #f7f7f9; border-radius: 14px; padding: 12px 16px; border: 1.5px solid transparent; transition: border-color .3s; }
.feed li.now .ev { border-color: var(--ink); }
.ev b { font-size: 13.5px; font-weight: 500; }
.ev small { font-size: 12px; color: var(--muted); }

@media (max-width: 900px) {
  .wrap { grid-template-columns: 1fr; gap: 40px; }
  .left > p { max-width: none; }
}
@media (max-width: 640px) {
  .wd { padding: 64px 16px; }
  .panel { padding: 10px; border-radius: 24px; }
  .rec { padding: 16px; border-radius: 18px; min-height: 0; }
  .tag { width: 64px; }
}
@media (prefers-reduced-motion: reduce) {
  .left, .panel { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
