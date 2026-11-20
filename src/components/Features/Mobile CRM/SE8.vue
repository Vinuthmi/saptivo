<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "FieldBenefitsSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const items = [
  "Reps spend less time on admin and more time with customers",
  "Information is captured while it's fresh, not hours later",
  "Managers see field activity as it happens",
  "Customers get faster quotations and answers",
];
const feed = [
  { w: "Kasun", t: "logged a call", c: "sky" },
  { w: "Ayesha", t: "won a deal", c: "mint" },
  { w: "Saman", t: "sent a quotation", c: "butter" },
];

const sub = computed(() => (still.value ? 7 : n.value % 10));
const better = computed(() => sub.value >= 4);
const admin = computed(() => (better.value ? 22 : 62));

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
  <section ref="root" class="fb" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Benefits for field</span> <span class="l2">teams and managers</span></h2>
      </header>

      <div class="grid">
        <!-- 1 admin vs customers -->
        <article class="c c1">
          <h3>{{ items[0] }}</h3>
          <div class="v">
            <div class="split">
              <span class="ad" :style="{ width: admin + '%' }">Admin</span>
              <span class="cu">Customers</span>
            </div>
            <div class="tg"><span :class="{ on: !better }">Before</span><span :class="{ on: better }">With Saptivo</span></div>
          </div>
        </article>

        <!-- 2 fresh -->
        <article class="c c2">
          <h3>{{ items[1] }}</h3>
          <div class="v">
            <div class="ln"><i class="d a"></i><span>Visit ends</span></div>
            <div class="ln" :class="{ vis: sub >= 2 }"><i class="d b"></i><span>Note logged on the spot</span><em>Fresh</em></div>
            <div class="ln late" :class="{ vis: sub >= 5 }"><i class="d c"></i><span>Typed up hours later</span><em>Details lost</em></div>
          </div>
        </article>

        <!-- 3 managers -->
        <article class="c c3">
          <h3>{{ items[2] }}</h3>
          <div class="v">
            <div v-for="(f, i) in feed" :key="f.w" class="fd" :class="{ vis: sub >= 1 + i * 2 }">
              <i :class="f.c"></i><span><b>{{ f.w }}</b> {{ f.t }}</span><em>Live</em>
            </div>
          </div>
        </article>

        <!-- 4 customers -->
        <article class="c c4">
          <h3>{{ items[3] }}</h3>
          <div class="v">
            <div class="q" :class="{ off: better }"><small>Without mobile</small><b>Quotation sent from the office, next day</b></div>
            <div class="q on" :class="{ vis: better }"><small>With Saptivo mobile</small><b>Quotation sent from the field, same visit</b></div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fb {
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
.fb *, .fb *::before, .fb *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; margin: 0 auto 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.fb h2 .l1 { color: #111111 !important; opacity: 1; }
.fb h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .1s; }

.grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 14px; }
.c { border-radius: 28px; padding: 26px; display: flex; flex-direction: column; gap: 22px; min-width: 0; }
.c1 { grid-column: span 7; background: var(--lav); }
.c2 { grid-column: span 5; background: var(--mint); }
.c3 { grid-column: span 5; background: var(--sky); }
.c4 { grid-column: span 7; background: var(--butter); }
h3 { margin: 0; font-size: clamp(18px, 1.6vw, 22px); font-weight: 500; line-height: 1.4; letter-spacing: -.01em; max-width: 30ch; }
.v { margin-top: auto; display: flex; flex-direction: column; gap: 8px; }

.split { display: flex; height: 54px; border-radius: 14px; overflow: hidden; background: #fff; padding: 5px; gap: 4px; }
.split span { display: grid; place-items: center; font-size: 13px; font-weight: 500; border-radius: 10px; white-space: nowrap; overflow: hidden; }
.ad { background: #e3e5e9; color: var(--muted); transition: width .9s cubic-bezier(.2, .8, .2, 1); }
.cu { flex: 1; background: var(--ink); color: #fff; }
.tg { display: flex; gap: 6px; }
.tg span { font-size: 12px; font-weight: 500; padding: 5px 14px; border-radius: 99px; background: rgba(255, 255, 255, .6); color: var(--muted); transition: all .3s; }
.tg span.on { background: var(--ink); color: #fff; }

.ln { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 14px; padding: 11px 14px; font-size: 13px; }
.ln:not(:first-child) { opacity: .2; transform: translateY(6px); transition: all .45s ease; }
.ln.vis { opacity: 1 !important; transform: none !important; }
.ln span { flex: 1; }
.ln em { font-style: normal; font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 6px; background: var(--mint); color: var(--mint-i); }
.ln.late em { background: var(--rose); color: var(--rose-i); }
.d { width: 9px; height: 9px; border-radius: 50%; flex: none; }
.d.a { background: #9aa0a8; } .d.b { background: var(--mint-i); } .d.c { background: var(--rose-i); }
.ln.late { color: var(--muted); }

.fd { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 14px; padding: 11px 14px; font-size: 13px; opacity: .2; transform: translateX(-6px); transition: all .45s ease; }
.fd.vis { opacity: 1; transform: none; }
.fd i { width: 9px; height: 9px; border-radius: 50%; flex: none; }
.fd i.sky { background: var(--sky-i); } .fd i.mint { background: var(--mint-i); } .fd i.butter { background: #d8b13a; }
.fd span { flex: 1; }
.fd b { font-weight: 600; }
.fd em { font-style: normal; font-size: 11px; font-weight: 600; color: var(--sky-i); }

.q { background: #fff; border-radius: 14px; padding: 12px 16px; display: flex; flex-direction: column; gap: 2px; transition: all .45s ease; }
.q small { font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.q b { font-size: 14px; font-weight: 500; }
.q.off { opacity: .45; }
.q.on { opacity: .25; transform: translateY(6px); }
.q.on.vis { opacity: 1; transform: none; border: 1.5px solid var(--ink); }

@media (max-width: 900px) {
  .c1, .c2, .c3, .c4 { grid-column: 1 / -1; }
  h3 { max-width: none; }
}
@media (max-width: 640px) {
  .fb { padding: 64px 16px; }
  .c { padding: 18px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
