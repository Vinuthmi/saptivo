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

      <div class="tiles">
        <div class="tile lav">
          <b>1997</b>
          <small>Year Weblook was founded</small>
        </div>
        <div class="tile sky">
          <b>{{ brands }}<span>+</span></b>
          <small>Brands around the world</small>
        </div>
        <div class="tile mint">
          <b>{{ products }}</b>
          <small>In-house software products</small>
        </div>
        <div class="tile butter">
          <b class="sm">Colombo</b>
          <small>Headquarters, Sri Lanka</small>
        </div>
        <div class="tile ink">
          <span class="dot"></span>
          <b class="sm">Weblook International (Pvt) Ltd.</b>
          <small>The company behind Saptivo</small>
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
  background: #fff;
  padding: 120px 16px 96px;
  overflow-x: clip;
}
.ah *, .ah *::before, .ah *::after { box-sizing: border-box; }
.wrap { width: min(1200px, 100%); min-width: 0; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr); gap: 56px; align-items: center; }
.copy, .tiles { min-width: 0; }
.copy, .tiles { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .copy, .in .tiles { opacity: 1; transform: none; }
.in .tiles { transition-delay: .12s; }

.ah h1 { margin: 0 0 24px; font-size: clamp(40px, 3.8vw, 54px) !important; font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h1 span { display: block; }
.ah h1 .l1 { color: #111111 !important; opacity: 1; }
.ah h1 .l2 { color: #8a8f97 !important; opacity: 1; }
.copy p { margin: 0; font-size: 16px; line-height: 1.8; color: var(--muted); max-width: 60ch; }

.tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.tile { border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 6px; min-height: 150px; justify-content: flex-end; }
.tile b { font-size: clamp(34px, 3.6vw, 48px); font-weight: 500; letter-spacing: -.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.tile b span { color: var(--sky-i); }
.tile b.sm { font-size: clamp(22px, 2.2vw, 28px); letter-spacing: -.02em; line-height: 1.2; }
.tile small { font-size: 13px; color: var(--muted); line-height: 1.5; }
.tile.lav { background: var(--lav); } .tile.sky { background: var(--sky); } .tile.mint { background: var(--mint); } .tile.butter { background: var(--butter); }
.tile.ink { grid-column: 1 / -1; background: var(--ink); color: #fff; min-height: 0; position: relative; }
.tile.ink small { color: rgba(255, 255, 255, .65); }
.tile.ink b.sm { font-size: 20px; }
.dot { position: absolute; top: 22px; right: 22px; width: 9px; height: 9px; border-radius: 50%; background: #7be0ae; box-shadow: 0 0 0 4px rgba(123, 224, 174, .25); }

@media (max-width: 900px) {
  .wrap { grid-template-columns: 1fr; gap: 40px; }
  .ah { padding-top: 120px; }
}
@media (max-width: 640px) {
  .ah { padding: 160px 16px 64px; }
  .ah h1 { font-size: clamp(34px, 9vw, 42px) !important; }
  .tile { padding: 16px; min-height: 120px; border-radius: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .copy, .tiles { opacity: 1; transform: none; transition: none; }
}
</style>
