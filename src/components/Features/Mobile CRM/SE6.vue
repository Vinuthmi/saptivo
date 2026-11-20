<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AvailableMobileSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const cards = [
  { k: "iOS", d: "Native-quality app", c: "lav", a: ["Get the app", "Installing…", "Open"] },
  { k: "Android", d: "Native-quality app", c: "mint", a: ["Get the app", "Installing…", "Open"] },
  { k: "Any phone browser", d: "Progressive web app", c: "sky", a: ["Add to Home Screen", "Adding…", "Added"] },
];

// dark Saptivo logo, shown as the app icon. Change the path if the file lives elsewhere.
const logo = encodeURI("/saptivo/images/features/images.png");
const logoOk = ref(true);
// one background photo per card, swap the paths if you like
const base = "/saptivo/images/features/";
const imgs = [
  base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
  base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg",
  base + "10.jpg",
];
const imgOk = ref([true, true, true]);

const sub = computed(() => (still.value ? 11 : n.value % 12));
const stage = (i) => {
  const s = sub.value - i * 4;
  return s < 0 ? 0 : s >= 3 ? 2 : s === 0 ? 0 : s === 1 ? 1 : 2;
};
const prog = (i) => (sub.value - i * 4 === 1 ? 62 : sub.value - i * 4 >= 2 ? 100 : 0);
const isAct = (i) => !still.value && Math.floor(sub.value / 4) === i;

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
  <section ref="root" class="am" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Available on</span> <span class="l2">iOS and Android</span></h2>
        <p>
          Use Saptivo as a native-quality app on iOS and Android, or as a progressive web app on any modern phone
          browser. Field technicians use the dedicated technician app described on the
          <a href="#">service management page</a>.
        </p>
      </header>

      <div class="grid">
        <article v-for="(c, i) in cards" :key="c.k" class="card" :class="[c.c, { act: isAct(i) }]">
          <div class="cbg" aria-hidden="true">
            <img v-if="imgOk[i]" :src="imgs[i]" alt="" @error="imgOk[i] = false" />
          </div>
          <div class="ct"><b>{{ c.k }}</b><small>{{ c.d }}</small></div>

          <div class="phone" aria-hidden="true">
            <div class="notch"></div>
            <div v-if="i === 2" class="url">app.yourcompany.com</div>
            <div class="app">
              <span class="ic"><img v-if="logoOk" :src="logo" alt="Saptivo" @error="logoOk = false" /><b v-else>Saptivo</b></span>
            </div>
            <div class="act-btn" :class="{ run: stage(i) === 1, ok: stage(i) === 2 }">
              <span class="fill" :style="{ width: prog(i) + '%' }"></span>
              <span class="lbl">{{ c.a[stage(i)] }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.am {
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
.am *, .am *::before, .am *::after { box-sizing: border-box; }
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 52px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.am h2 .l1 { color: #111111 !important; opacity: 1; }
.am h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.head a { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(20, 18, 15, .35); }
.head a:hover { text-decoration-color: var(--ink); }
.head a:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; border-radius: 3px; }
.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .1s; }

.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.card { position: relative; overflow: hidden; isolation: isolate; border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 18px; border: 1.5px solid transparent; transition: border-color .3s; }
.card.act { border-color: var(--ink); }
.card.lav { background: var(--lav); --o: 238, 234, 253; } .card.mint { background: var(--mint); --o: 223, 243, 232; } .card.sky { background: var(--sky); --o: 228, 240, 251; }
.cbg { position: absolute; inset: 0; z-index: -1; }
.cbg img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cbg::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(var(--o), .92), rgba(var(--o), .62) 55%, rgba(var(--o), .8)); }
.ct { display: flex; flex-direction: column; }
.ct b { font-size: 17px; font-weight: 600; letter-spacing: -.01em; }
.ct small { font-size: 12.5px; color: var(--muted); }

.phone { position: relative; background: #fff; border: 6px solid var(--ink); border-radius: 30px; min-height: 320px; padding: 30px 18px 22px; display: flex; flex-direction: column; align-items: center; gap: 18px; }
.notch { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 56px; height: 5px; border-radius: 4px; background: var(--ink); }
.url { align-self: stretch; text-align: center; background: #f4f4f6; border-radius: 99px; padding: 6px 12px; font-size: 11.5px; color: var(--muted); }
.app { margin: auto 0; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.ic { width: 140px; height: 84px; border-radius: 20px; background: #fff; border: 1px solid var(--line); color: var(--ink); display: grid; place-items: center; font-size: 16px; padding: 14px 18px; overflow: hidden; }
.ic img { width: 100%; height: 100%; object-fit: contain; display: block; }
.app b { font-size: 15px; font-weight: 600; }
.app small { font-size: 12px; color: var(--muted); }

.act-btn { position: relative; align-self: stretch; overflow: hidden; border-radius: 12px; background: var(--ink); color: #fff; text-align: center; font-size: 13.5px; font-weight: 500; padding: 11px 10px; transition: background .35s, color .35s; }
.act-btn .fill { position: absolute; left: 0; top: 0; bottom: 0; background: rgba(255, 255, 255, .18); transition: width .7s ease; }
.act-btn .lbl { position: relative; }
.act-btn.ok { background: var(--mint); color: var(--mint-i); }

@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
  .phone { min-height: 280px; }
}
@media (max-width: 640px) {
  .am { padding: 64px 16px; }
  .card { padding: 16px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
