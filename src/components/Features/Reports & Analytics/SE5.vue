<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ScheduledReportsSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
const manual = ref(false);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "woman-in-orange-sweater-working-from-home-office-2026-09-21-18-32-10-utc.webp";

const freqs = [
  { k: "Daily", file: "Daily sales summary.pdf", when: "Every day, 8:00 am" },
  { k: "Weekly", file: "Weekly pipeline report.pdf", when: "Every Monday, 8:00 am" },
  { k: "Monthly", file: "Monthly management pack.pdf", when: "1st of the month, 8:00 am" },
];
const cur = computed(() => freqs[idx.value]);

function next() {
  idx.value = (idx.value + 1) % freqs.length;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 2600);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  idx.value = i;
  manual.value = true;
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
  <section ref="root" class="sr" :class="{ in: shown }">
    <div class="wrap">
      <div class="hero">
        <img v-if="ok" class="bg" :src="photo" alt="" @error="ok = false" />

        <div class="panel">
          <h2><span class="l1">Scheduled</span> <span class="l2">report delivery</span></h2>
          <p>Have reports emailed as PDFs daily, weekly or monthly, to yourself or your management team.</p>
          <div class="pills" role="tablist">
            <button v-for="(f, i) in freqs" :key="f.k" type="button" role="tab" :aria-selected="i === idx" :class="{ on: i === idx }" @click="pick(i)">{{ f.k }}</button>
          </div>
        </div>

        <Transition name="mail" mode="out-in">
          <div :key="idx" class="mail">
            <span class="pdf">PDF</span>
            <div class="mi">
              <strong>{{ cur.file }}</strong>
              <small>{{ cur.when }} · to the management team</small>
            </div>
            <span class="sent"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>Sent</span>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sr {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.sr *, .sr *::before, .sr *::after { box-sizing: border-box; }
.wrap { max-width: 1240px; margin: 0 auto; }

.hero { position: relative; min-height: 640px; border-radius: 36px; overflow: hidden; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); opacity: 0; transform: translateY(16px); transition: opacity .7s ease, transform .7s ease; }
.in .hero { opacity: 1; transform: none; }
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }

.panel { position: absolute; left: 32px; top: 32px; width: min(470px, calc(100% - 64px)); background: #fff; border-radius: 28px; padding: 32px; }
h2 { margin: 0 0 14px; font-size: clamp(34px, 3.8vw, 52px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; }
h2 span { display: block; }
.sr h2 .l1 { color: #111111 !important; opacity: 1; }
.sr h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.panel p { margin: 0 0 22px; font-size: 16px; line-height: 1.7; color: var(--muted); }
.pills { display: flex; gap: 8px; flex-wrap: wrap; }
.pills button { all: unset; cursor: pointer; padding: 9px 20px; border-radius: 99px; background: #f1f2f4; color: var(--muted); font-size: 13.5px; font-weight: 500; transition: all .3s; }
.pills button.on { background: var(--ink); color: #fff; }
.pills button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.mail { position: absolute; right: 32px; bottom: 32px; width: min(400px, calc(100% - 64px)); background: #fff; border-radius: 20px; padding: 16px 18px; display: flex; align-items: center; gap: 14px; }
.pdf { width: 42px; height: 48px; border-radius: 8px; background: var(--rose); color: var(--rose-i); display: grid; place-items: center; font-size: 11.5px; font-weight: 700; flex: none; }
.mi { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.mi strong { font-size: 14px; font-weight: 600; }
.mi small { font-size: 12px; color: var(--muted); line-height: 1.4; }
.sent { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 99px; background: var(--mint); color: var(--mint-i); flex: none; }
.mail-enter-active, .mail-leave-active { transition: opacity .3s ease, transform .35s ease; }
.mail-enter-from { opacity: 0; transform: translateY(14px); }
.mail-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 820px) {
  .hero { min-height: 0; display: flex; flex-direction: column; background: transparent; border-radius: 0; overflow: visible; }
  .bg { position: relative; inset: auto; height: 340px; border-radius: 28px; }
  .panel { position: static; width: 100%; padding: 22px 4px 0; border-radius: 0; }
  .mail { position: absolute; top: 210px; bottom: auto; left: 16px; right: 16px; width: auto; }
}
@media (max-width: 640px) {
  .sr { padding: 64px 16px; }
  .bg { height: 300px; }
  .mail { top: 180px; }
}
@media (prefers-reduced-motion: reduce) {
  .hero { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
