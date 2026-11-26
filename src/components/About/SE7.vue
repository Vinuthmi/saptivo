<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "OurCommitmentSection" });

const root = ref(null);
const shown = ref(false);
const ok = ref(true);
// image of this section, swap the path if you like
const photo = "/saptivo/images/features/woman-working-on-laptop-at-wooden-desk-indoors-2026-09-23-06-34-55-utc (1).jpg";
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const cols = ["Customer idea", "In development", "Shipped"];
const ideas = [
  { t: "Idea from a customer", m: "Suggested by a Saptivo user", c: "lav" },
];

const sub = computed(() => (still.value ? 11 : n.value % 12));
const col = computed(() => Math.min(Math.floor(sub.value / 4), 2));

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
  <section ref="root" class="oc" :class="{ in: shown }">
    <div class="wrap">
      <div class="panel">
        <div class="copy">
          <h2><span class="l1">Our</span> <span class="l2">commitment</span></h2>
          <p>
            We're in this for the long term. Saptivo is actively developed by Weblook's in-house team in Colombo, with
            new features shaped by the businesses that use it every day.
          </p>
          <a href="#" class="cta">Talk to our team</a>
        </div>

        <figure class="ph">
          <img v-if="ok" :src="photo" alt="" @error="ok = false" />
        <div class="board" aria-hidden="true">
          <div class="top"><span class="lb">How Saptivo grows</span><span class="pill">Built in Colombo</span></div>
          <div class="cols">
            <div v-for="(c, i) in cols" :key="c" class="col" :class="{ on: i === col }">
              <small>{{ c }}</small>
              <div class="slot">
                <div v-if="i === col" class="idea" :class="{ done: i === 2 }">
                  <b>{{ ideas[0].t }}</b>
                  <span>{{ i === 2 ? "Now live for everyone" : ideas[0].m }}</span>
                  <em v-if="i === 2">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                    Shipped
                  </em>
                </div>
              </div>
            </div>
          </div>
          <div class="rail"><i :style="{ width: ((col + 1) / 3) * 100 + '%' }"></i></div>
        </div>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.oc {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #fff0df; --lav-i: #c87532;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.oc *, .oc *::before, .oc *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.panel { background: var(--lav); border-radius: 36px; padding: 56px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px; align-items: center; opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .panel { opacity: 1; transform: none; }

h2 { margin: 0 0 20px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.oc h2 .l1 { color: #111111 !important; opacity: 1; }
.oc h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.copy p { margin: 0 0 30px; font-size: 16px; line-height: 1.8; color: var(--muted); max-width: 48ch; }
.cta { display: inline-block; font-size: 15px; font-weight: 500; color: #fff; background: var(--ink); text-decoration: none; padding: 15px 30px; border-radius: 12px; transition: transform .2s ease, opacity .2s; }
.cta:hover { opacity: .88; transform: translateY(-1px); }
.cta:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

.ph { position: relative; margin: 0; border-radius: 28px; overflow: hidden; min-height: 560px; background: linear-gradient(160deg, #ffe8d1, #fff2e5); display: flex; align-items: flex-end; }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.board { position: relative; width: calc(100% - 28px); margin: 14px; background: #fff; border-radius: 22px; padding: 18px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 18px 40px -18px rgba(20, 18, 15, .4); }
.top { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.pill { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: var(--ink); color: #fff; }
.cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.col { background: #f6f6f8; border-radius: 16px; padding: 12px; display: flex; flex-direction: column; gap: 10px; min-height: 170px; transition: background .4s; }
.col.on { background: var(--lav); }
.col small { font-size: 11px; font-weight: 600; color: var(--muted); }
.slot { flex: 1; display: flex; }
.idea { flex: 1; align-self: flex-start; background: #fff; border: 1.5px solid var(--ink); border-radius: 12px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; animation: in .45s ease both; }
@keyframes in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.idea b { font-size: 12.5px; font-weight: 600; line-height: 1.35; }
.idea span { font-size: 11px; color: var(--muted); line-height: 1.4; }
.idea em { align-self: flex-start; margin-top: 4px; display: inline-flex; align-items: center; gap: 5px; font-style: normal; font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 6px; background: var(--mint); color: var(--mint-i); }
.idea.done { border-color: var(--mint-i); }
.rail { height: 3px; border-radius: 3px; background: #eef0f2; overflow: hidden; }
.rail i { display: block; height: 100%; background: var(--ink); transition: width .6s ease; }

@media (max-width: 900px) {
  .panel { grid-template-columns: 1fr; padding: 36px; gap: 36px; }
  .copy p { max-width: none; }
}
@media (max-width: 640px) {
  .oc { padding: 64px 16px; }
  .panel { padding: 24px 18px; border-radius: 26px; }
  .ph { min-height: 480px; border-radius: 22px; }
  .board { padding: 14px; border-radius: 18px; }
  .col { padding: 10px; min-height: 150px; }
  .cta { width: 100%; text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .panel { opacity: 1; transform: none; transition: none; }
  .idea { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
