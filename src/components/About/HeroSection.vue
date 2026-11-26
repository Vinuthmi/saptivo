<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AboutHeroSection" });

const root = ref(null);
const shown = ref(false);
const t = ref(0); // 0 to 1 count-up progress
let io = null;
let raf = 0;

const brands = computed(() => Math.round(1000 * ease(t.value)).toLocaleString("en-US"));
const products = computed(() => Math.round(10 * ease(t.value)));
function ease(x) {
  return 1 - Math.pow(1 - x, 3);
}

function run() {
  const t0 = performance.now();
  const dur = 1600;
  const loop = (now) => {
    t.value = Math.min((now - t0) / dur, 1);
    if (t.value < 1) raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    shown.value = true;
    t.value = 1;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      shown.value = true;
      io.disconnect();
      run();
    },
    { threshold: 0.25 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
  cancelAnimationFrame(raf);
});
</script>

<template>
  <section ref="root" class="ah" :class="{ in: shown }">
    <div class="wrap">
      <div class="copy">
        <h1><span class="l1">Built by a software house</span> <span class="l2">that has served 1,000+ brands since 1997</span></h1>
        <p>
          Saptivo is the customer relationship management platform from Weblook International (Pvt) Ltd., a technology
          company founded in 1997 and headquartered in Colombo, Sri Lanka. Weblook builds and supports 10 in-house
          software products used by more than 1,000 brands around the world. That makes the Saptivo CRM company a team
          with decades of experience building business software, not a start-up learning as it goes.
        </p>
      </div>

      <div class="strip">
        <div class="stat">
          <span class="dt lav"></span>
          <b>1997</b>
          <small>Year Weblook was founded</small>
        </div>
        <div class="stat">
          <span class="dt sky"></span>
          <b>{{ brands }}<span class="pl">+</span></b>
          <small>Brands around the world</small>
        </div>
        <div class="stat">
          <span class="dt mint"></span>
          <b>{{ products }}</b>
          <small>In-house software products</small>
        </div>
        <div class="stat">
          <span class="dt butter"></span>
          <b class="sm">Colombo</b>
          <small>Headquarters, Sri Lanka</small>
        </div>

        <div class="rail" aria-hidden="true">
          <span>1997</span>
          <i><u></u></i>
          <span>Weblook International (Pvt) Ltd.</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ah {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #faf9ff 0%, #fff 70%);
  padding: 184px 16px 96px;
  overflow-x: clip;
}
.ah *, .ah *::before, .ah *::after { box-sizing: border-box; }
.wrap { width: min(1100px, 100%); min-width: 0; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 56px; }
.copy, .strip { min-width: 0; width: 100%; opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .copy, .in .strip { opacity: 1; transform: none; }
.in .strip { transition-delay: .12s; }

.copy { text-align: center; max-width: 860px; }
.ah h1 { margin: 0 0 26px; font-size: clamp(38px, 5vw, 68px) !important; font-weight: 600; line-height: 1.08; letter-spacing: -0.025em; text-wrap: balance; }
h1 span { display: block; }
.ah h1 .l1 { color: #111111 !important; opacity: 1; }
.ah h1 .l2 { color: #8a8f97 !important; opacity: 1; }
.copy p { margin: 0 auto; font-size: 16px; line-height: 1.85; color: var(--muted); max-width: 70ch; }

.strip { background: #fff; border: 1px solid var(--line); border-radius: 32px; padding: 8px 8px 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); box-shadow: 0 24px 50px -30px rgba(20, 18, 15, .25); }
.stat { position: relative; padding: 30px 28px 28px; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.stat + .stat::before { content: ""; position: absolute; left: 0; top: 28px; bottom: 28px; width: 1px; background: var(--line); }
.dt { width: 10px; height: 10px; border-radius: 50%; margin-bottom: 6px; }
.dt.lav { background: var(--lav-i); } .dt.sky { background: var(--sky-i); } .dt.mint { background: var(--mint-i); } .dt.butter { background: #d8b13a; }
.stat b { font-size: clamp(34px, 3.4vw, 46px); font-weight: 500; letter-spacing: -.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.stat b.sm { font-size: clamp(26px, 2.6vw, 34px); letter-spacing: -.03em; padding-top: 4px; }
.stat b .pl { color: var(--sky-i); }
.stat small { font-size: 13.5px; line-height: 1.5; color: var(--muted); }

.rail { grid-column: 1 / -1; display: flex; align-items: center; gap: 16px; padding: 18px 26px 20px; border-top: 1px solid var(--line); font-size: 12.5px; font-weight: 500; color: var(--muted); }
.rail i { flex: 1; height: 2px; border-radius: 2px; background: var(--line); overflow: hidden; }
.rail u { display: block; height: 100%; width: 0; background: var(--ink); transition: width 1.8s cubic-bezier(.3, .8, .3, 1) .4s; }
.in .rail u { width: 100%; }
.rail span:last-child { color: var(--ink); }

@media (max-width: 900px) {
  .ah { padding-top: 184px; }
  .strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stat:nth-child(3)::before { display: none; }
  .stat:nth-child(n+3) { border-top: 1px solid var(--line); }
}
@media (max-width: 640px) {
  .ah { padding: 224px 16px 64px; }
  .ah h1 { font-size: clamp(34px, 9vw, 42px) !important; }
  .wrap { gap: 40px; }
  .strip { border-radius: 24px; }
  .stat { padding: 22px 18px; }
  .rail { padding: 14px 18px 16px; font-size: 11.5px; }
}
@media (prefers-reduced-motion: reduce) {
  .copy, .strip { opacity: 1; transform: none; transition: none; }
  .rail u { width: 100%; transition: none; }
}
</style>
