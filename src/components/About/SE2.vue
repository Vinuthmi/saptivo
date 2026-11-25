<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhatWeBelieveSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;
let touched = false;

const base = "/saptivo/images/features/";
const photo = base + "business-meeting-in-modern-co-working-space-2026-09-22-06-25-35-utc.webp";

const items = [
  "Software should fit the business, not the other way round",
  "Pricing should be clear: no setup fee and no upgrade fees",
  "Customers deserve support from people in their own time zone",
  "Your data belongs to you, protected at every layer",
];

function start() {
  if (timer || reduce || touched) return;
  timer = setInterval(() => {
    idx.value = (idx.value + 1) % items.length;
  }, 3200);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  touched = true;
  stop();
  idx.value = i;
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

const cur = computed(() => idx.value);
</script>

<template>
  <section ref="root" class="wbl" :class="{ in: shown }">
    <div class="wrap">
      <figure class="ph">
        <img v-if="ok" :src="photo" alt="" @error="ok = false" />

        <div class="float" :key="cur" aria-hidden="true">
          <!-- 0 fit -->
          <div v-if="cur === 0" class="f">
            <small>Your modules</small>
            <div class="sw"><span>Leads and contacts</span><i class="on"></i></div>
            <div class="sw"><span>Quotations and invoicing</span><i class="on"></i></div>
            <div class="sw"><span>Service and AMC</span><i></i></div>
          </div>
          <!-- 1 pricing -->
          <div v-else-if="cur === 1" class="f">
            <small>Pricing</small>
            <div class="pr"><span>Setup fee</span><b>None</b></div>
            <div class="pr"><span>Upgrade fees</span><b>None</b></div>
          </div>
          <!-- 2 support -->
          <div v-else-if="cur === 2" class="f">
            <small>Support</small>
            <div class="sp"><span class="live"></span><b>Support team, in your time zone</b></div>
            <div class="sp2">Online now</div>
          </div>
          <!-- 3 data -->
          <div v-else class="f">
            <small>Your data</small>
            <div class="ly"><span>Role-based permissions</span></div>
            <div class="ly"><span>Two-factor authentication</span></div>
            <div class="ly"><span>Audit logs</span></div>
          </div>
        </div>
      </figure>

      <div class="copy">
        <h2><span class="l1">What we</span> <span class="l2">believe</span></h2>
        <ol class="list">
          <li v-for="(t, i) in items" :key="i" :class="{ on: i === cur }">
            <button type="button" :aria-current="i === cur" @click="pick(i)">
              <span class="no">{{ i + 1 }}</span>
              <span class="tx">{{ t }}</span>
            </button>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wbl {
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
.wbl *, .wbl *::before, .wbl *::after { box-sizing: border-box; }
.wrap { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; align-items: center; }
.ph, .copy { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .ph, .in .copy { opacity: 1; transform: none; }
.in .copy { transition-delay: .12s; }

.ph { position: relative; margin: 0; border-radius: 32px; overflow: hidden; min-height: 640px; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); display: flex; align-items: flex-end; }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.float { position: relative; margin: 20px; width: calc(100% - 40px); background: #fff; border-radius: 22px; padding: 18px; box-shadow: 0 18px 40px -18px rgba(20, 18, 15, .4); animation: fin .45s ease both; }
@keyframes fin { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.f { display: flex; flex-direction: column; gap: 8px; }
.f > small { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
.sw, .pr, .ly { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #f6f6f8; border-radius: 12px; padding: 11px 14px; font-size: 13.5px; }
.sw i { width: 34px; height: 19px; border-radius: 10px; background: #d9dce0; position: relative; flex: none; }
.sw i::after { content: ""; position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; border-radius: 50%; background: #fff; }
.sw i.on { background: var(--ink); }
.sw i.on::after { left: 17px; }
.pr b { font-size: 12px; font-weight: 600; padding: 3px 12px; border-radius: 6px; background: var(--mint); color: var(--mint-i); }
.sp { display: flex; align-items: center; gap: 10px; background: var(--sky); border-radius: 12px; padding: 12px 14px; font-size: 13.5px; }
.sp b { font-weight: 500; }
.live { width: 9px; height: 9px; border-radius: 50%; background: var(--mint-i); flex: none; animation: bl 1.4s ease-in-out infinite; }
@keyframes bl { 50% { opacity: .25; } }
.sp2 { align-self: flex-start; font-size: 12px; font-weight: 600; padding: 4px 14px; border-radius: 99px; background: var(--mint); color: var(--mint-i); }
.ly { background: var(--lav); }
.ly::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--lav-i); }

h2 { margin: 0 0 32px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.wbl h2 .l1 { color: #111111 !important; opacity: 1; }
.wbl h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.list li { border-bottom: 1px solid var(--line); position: relative; }
.list li::before { content: ""; position: absolute; left: 0; top: -1px; height: 2px; width: 0; background: var(--ink); transition: width .45s ease; }
.list li.on::before { width: 100%; }
.list button { all: unset; box-sizing: border-box; cursor: pointer; display: flex; gap: 18px; align-items: flex-start; width: 100%; padding: 22px 4px; }
.list button:focus-visible { outline: 2px solid var(--ink); outline-offset: -2px; }
.no { width: 28px; height: 28px; border-radius: 50%; background: #f1f2f4; color: var(--muted); display: grid; place-items: center; font-size: 12.5px; font-weight: 600; flex: none; transition: all .3s; }
.tx { font-size: clamp(17px, 1.6vw, 21px); line-height: 1.5; letter-spacing: -.01em; color: var(--muted); transition: color .3s; }
.list li.on .no { background: var(--ink); color: #fff; }
.list li.on .tx { color: var(--ink); font-weight: 500; }

@media (max-width: 900px) {
  .wrap { grid-template-columns: 1fr; gap: 36px; }
  .ph { min-height: 520px; order: 2; }
}
@media (max-width: 640px) {
  .wbl { padding: 64px 16px; }
  .ph { min-height: 440px; border-radius: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .ph, .copy { opacity: 1; transform: none; transition: none; }
  .float, .live { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
