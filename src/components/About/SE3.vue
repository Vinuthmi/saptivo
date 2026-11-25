<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WeblookSuiteSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
let timer = null;
let io = null;
let reduce = false;
let touched = false;

// Product logos and category-matched photography.
const logos = `${import.meta.env.BASE_URL}images/clients/`;
const features = `${import.meta.env.BASE_URL}images/features/`;
const products = [
  { n: "Cartinno", d: "E-commerce and point of sale", logo: logos + "cartinno.webp", image: features + "Remove_words_and_high_quality_d416cd17.jpg" },
  { n: "Voxinnova", d: "Cloud phone systems built on 3CX", logo: logos + "voxinnova.png", image: features + "Remove_words_keep_mobile_letters_9242dbf9.jpg" },
  { n: "Smardove", d: "Secure business email", logo: logos + "smardove.png", image: features + "Remove_words_keep_mobile_letters_7cf84317.jpg" },
  { n: "Saptify", d: "Appointment booking", logo: logos + "saptify.png", image: features + "please_give_back_ground_image_9616f21e.jpg" },
  { n: "SaaSBeds", d: "Hotel reservations", logo: logos + "saasbeds.png", image: features + "Remove_words_for_background_image_e927841d_2K.jpg" },
];
// the Saptivo logo for the hub (dark logo on a white pill)
const hubLogo = `${import.meta.env.BASE_URL}images/clients/images.png`;
const hubOk = ref(true);
const bad = reactive({}); // products whose logo file did not load

function start() {
  if (timer || reduce || touched) return;
  timer = setInterval(() => {
    idx.value = (idx.value + 1) % products.length;
  }, 1700);
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
    idx.value = -1;
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
  <section ref="root" class="ws" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Part of the</span> <span class="l2">Weblook Business Suite</span></h2>
        <p>
          Saptivo works alongside Weblook's other products: Cartinno for e-commerce and POS, Voxinnova for cloud phone
          systems built on 3CX, Smardove for secure business email, Saptify for appointment booking and SaaSBeds for
          hotel reservations.
        </p>
      </header>

      <div class="tree">
        <div class="hub">
          <img v-if="hubOk" :src="hubLogo" alt="Saptivo" @error="hubOk = false" />
          <b v-else>Saptivo</b>
          <small>CRM</small>
        </div>
        <i class="stem" aria-hidden="true"></i>
        <i class="bus" aria-hidden="true"></i>

        <ul class="cols">
          <li v-for="(p, i) in products" :key="p.n" :class="{ on: i === idx }">
            <i class="drop" aria-hidden="true"><u></u></i>
            <button type="button" class="card" :aria-pressed="i === idx" @click="pick(i)">
              <img class="photo" :src="p.image" alt="" loading="lazy" decoding="async" />
              <span class="logo-badge">
                <img v-if="!bad[p.n]" :src="p.logo" :alt="`${p.n} logo`" @error="bad[p.n] = true" />
              </span>
              <span class="card-caption">
                <b class="nm">{{ p.n }}</b>
                <small class="description">{{ p.d }}</small>
              </span>
            </button>
          </li>
        </ul>
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
  padding: 96px 16px;
}
.ws *, .ws *::before, .ws *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 800px; margin: 0 auto 56px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ws h2 .l1 { color: #111111 !important; opacity: 1; }
.ws h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.8; color: var(--muted); }
.head, .tree { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .tree { opacity: 1; transform: none; }
.in .tree { transition-delay: .1s; }

.tree { position: relative; display: flex; flex-direction: column; align-items: center; }
.hub { display: inline-flex; align-items: center; gap: 12px; background: #fff; color: var(--ink); border: 1.5px solid var(--ink); border-radius: 99px; padding: 14px 30px; position: relative; z-index: 1; }
.hub img { height: 30px; width: auto; display: block; }
.hub b { font-size: 20px; font-weight: 600; letter-spacing: -.02em; }
.hub small { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 99px; background: var(--ink); color: #fff; }
.stem { display: block; width: 2px; height: 30px; background: rgba(20, 18, 15, .15); }
.bus { display: block; height: 2px; background: rgba(20, 18, 15, .15); width: 80%; }

.cols { list-style: none; margin: 0; padding: 0; width: 100%; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
.cols li { display: flex; flex-direction: column; align-items: center; }
.drop { position: relative; display: block; width: 2px; height: 28px; background: rgba(20, 18, 15, .15); overflow: hidden; }
.drop u { position: absolute; left: 0; top: 0; width: 100%; height: 0; background: var(--ink); transition: height .5s ease; }
.cols li.on .drop u { height: 100%; }

.card { all: unset; box-sizing: border-box; position: relative; isolation: isolate; display: block; overflow: hidden; cursor: pointer; width: 100%; min-width: 0; min-height: 220px; aspect-ratio: .9; flex: 1; border-radius: 22px; border: 1.5px solid transparent; background: transparent; transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
.card:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.card::after { content: ""; position: absolute; z-index: 0; inset: 0; background: linear-gradient(180deg, rgb(15 17 20 / 3%) 25%, rgb(15 17 20 / 12%) 48%, rgb(15 17 20 / 76%) 100%); pointer-events: none; }
.card .photo { position: absolute; z-index: -1; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .45s ease; }
.card:hover .photo, .cols li.on .card .photo { transform: scale(1.045); }
.cols li.on .card { border-color: #ff6818; transform: translateY(-4px); box-shadow: 0 14px 30px rgb(20 18 15 / 16%); }
.logo-badge { position: absolute; z-index: 1; top: 12px; left: 12px; display: grid; place-items: center; width: 132px; max-width: calc(100% - 24px); height: 46px; padding: 7px 12px; overflow: hidden; border-radius: 12px; background: rgb(255 255 255 / 96%); box-shadow: 0 5px 16px rgb(0 0 0 / 12%); }
.logo-badge img { display: block; max-width: 100%; max-height: 32px; width: auto; height: auto; object-fit: contain; object-position: center; }
.card-caption { position: absolute; z-index: 1; right: 16px; bottom: 16px; left: 16px; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.card .nm { color: #fff; font-size: 19px; font-weight: 700; letter-spacing: -.015em; line-height: 1.15; text-shadow: 0 2px 8px rgb(0 0 0 / 22%); }
.card .description { color: rgb(255 255 255 / 88%); font-size: 12px; font-weight: 500; line-height: 1.35; text-shadow: 0 2px 8px rgb(0 0 0 / 25%); }

@media (max-width: 960px) {
  .tree { align-items: stretch; }
  .hub { align-self: center; }
  .stem { align-self: center; }
  .bus { display: none; }
  .cols { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .drop { display: none; }
  .card { aspect-ratio: 1.3; }
}
@media (max-width: 560px) {
  .ws { padding: 64px 16px; }
  .cols { grid-template-columns: 1fr; }
  .card { min-height: 190px; aspect-ratio: 1.65; border-radius: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .tree { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
