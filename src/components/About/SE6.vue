<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhoWeServeSection" });

const root = ref(null);
const shown = ref(false);
let io = null;

// Customer logos. Put the files in public/images/customers/ (or change the paths below).
const dir = "/saptivo/images/features/";
const customers = [
  { n: "Tree of Life Nature Resort", logo: dir + "treeoflife.png" },
  { n: "Nilkamal", logo: dir + "Nilkamal.webp" },
  { n: "Nastars", logo: dir + "nastars.jpg" },
  { n: "Be Waxed Sri Lanka", logo: dir + "bewaxed-logo-final.png" },
  { n: "Paint House by Nadeeka", logo: dir + "nadeeka.png" },
  { n: "Tera Computers", logo: dir + "tera.jpg" },
  { n: "Lanka Grills", logo: dir + "lanka_grills.png_db0a06f9.jpg" },
];
const segments = [
  { t: "Retailers", c: "lav" },
  { t: "Distributors", c: "sky" },
  { t: "Contractors", c: "mint" },
  { t: "Field service companies", c: "butter" },
  { t: "Hospitality businesses", c: "rose" },
  { t: "Startups", c: "lav" },
];
const bad = reactive({}); // logos whose file did not load

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    shown.value = true;
    return;
  }
  io = new IntersectionObserver(([e]) => (shown.value = e.isIntersecting), { threshold: 0.15 });
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="ws" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Who we</span> <span class="l2">serve</span></h2>
        <p>
          Saptivo supports retailers, distributors, contractors, field service companies, hospitality businesses and
          startups. Customers include Tree of Life Nature Resort, Nilkamal, Nastars, Be Waxed Sri Lanka, Paint House by
          Nadeeka, Tera Computers and Lanka Grills.
        </p>
      </header>

      <ul class="seg">
        <li v-for="(s, i) in segments" :key="s.t" :class="s.c" :style="{ '--i': i }">{{ s.t }}</li>
      </ul>
    </div>

    <div class="belt" role="list" aria-label="Customers">
      <div class="track">
        <div v-for="c in customers" :key="c.n" class="logo" role="listitem">
          <img v-if="!bad[c.n]" :src="c.logo" :alt="c.n" loading="lazy" @error="bad[c.n] = true" />
          <b v-else>{{ c.n }}</b>
        </div>
        <div v-for="c in customers" :key="'d' + c.n" class="logo dup" aria-hidden="true">
          <img v-if="!bad[c.n]" :src="c.logo" alt="" loading="lazy" />
          <b v-else>{{ c.n }}</b>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ws {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 0;
  overflow: hidden;
}
.ws *, .ws *::before, .ws *::after { box-sizing: border-box; }
.wrap { max-width: 980px; margin: 0 auto; padding: 0 16px; }
.head { text-align: center; max-width: 800px; margin: 0 auto 32px; }
.ws h2 { margin: 0 0 18px; font-size: clamp(30px, 4.5vw, 52px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; white-space: nowrap; }
.ws h2 span { display: inline; }
.ws h2 .l1 { color: #111111 !important; opacity: 1; }
.ws h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.8; color: var(--muted); }
.head { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head { opacity: 1; transform: none; }

.seg { list-style: none; margin: 0 auto 56px; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.seg li { font-size: 14px; font-weight: 500; padding: 10px 20px; border-radius: 99px; opacity: 0; transform: translateY(8px); transition: opacity .5s ease, transform .5s ease; transition-delay: calc(.1s + var(--i) * .07s); }
.in .seg li { opacity: 1; transform: none; }
.seg .lav { background: var(--lav); color: var(--lav-i); } .seg .sky { background: var(--sky); color: var(--sky-i); } .seg .mint { background: var(--mint); color: var(--mint-i); } .seg .butter { background: var(--butter); color: var(--butter-i); } .seg .rose { background: var(--rose); color: var(--rose-i); }

.belt { position: relative; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.track { display: flex; gap: 16px; width: max-content; animation: slide 36s linear infinite; animation-play-state: paused; padding: 4px 0; }
.in .track { animation-play-state: running; }
.belt:hover .track { animation-play-state: paused; }
@keyframes slide { to { transform: translateX(calc(-50% - 8px)); } }

.logo { flex: none; width: 220px; height: 96px; border: 1px solid var(--line); border-radius: 22px; background: #fff; display: grid; place-items: center; padding: 18px 26px; }
.logo img { max-width: 100%; max-height: 52px; width: auto; height: auto; object-fit: contain; display: block; filter: grayscale(1); opacity: .8; transition: filter .3s, opacity .3s; }
.logo:hover img { filter: none; opacity: 1; }
.logo b { font-size: 14.5px; font-weight: 600; text-align: center; line-height: 1.35; letter-spacing: -.01em; }

@media (max-width: 640px) {
  .ws { padding: 64px 0; }
  .logo { width: 180px; height: 84px; border-radius: 18px; padding: 14px 20px; }
  .seg li { font-size: 13px; padding: 8px 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .seg li { opacity: 1; transform: none; transition: none; }
  .belt { -webkit-mask-image: none; mask-image: none; }
  .track { animation: none; width: auto; flex-wrap: wrap; justify-content: center; max-width: 980px; margin: 0 auto; padding: 4px 16px; }
  .dup { display: none; }
}
</style>
