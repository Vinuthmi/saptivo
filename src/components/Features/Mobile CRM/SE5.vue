<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "MobileDashboardsSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const ok = ref(true);
const n = ref(0);
let timer = null;
let io = null;

const base = "/saptivo/images/features/";
// the big image of this section, swap the path if you like
const photo = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";

const stages = [
  { n: "Leads", v: 42, c: "lav" },
  { n: "Proposal", v: 18, c: "sky" },
  { n: "Negotiation", v: 9, c: "butter" },
  { n: "Won", v: 5, c: "mint" },
];
const feed = [
  { w: "Kasun", t: "logged a call", d: "Colombo Hotels", c: "sky" },
  { w: "Ayesha", t: "won a deal", d: "Lanka Foods · LKR 1.8M", c: "mint" },
  { w: "Saman", t: "sent a quotation", d: "Ceylon Print", c: "butter" },
];
const steps = [0, 0, 85, 85, 210, 210, 340, 340, 450, 450, 450, 450];
const spark = [18, 26, 22, 38, 44, 56, 70, 86];

const sub = computed(() => (still.value ? 11 : n.value % 12));
const sales = computed(() => steps[sub.value] * 1000);
const fmt = computed(() => sales.value.toLocaleString("en-US"));
const grown = computed(() => sub.value >= 1);
const bars = computed(() => Math.min(Math.ceil((steps[sub.value] / 450) * spark.length), spark.length));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 800);
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
  <section ref="root" class="md" :class="{ in: shown }">
    <div class="wrap">
      <figure class="ph">
        <img v-if="ok" :src="photo" alt="" @error="ok = false" />
      </figure>

      <div class="copy">
        <h2><span class="l1">Mobile</span> <span class="l2">dashboards</span></h2>
        <p>Managers see pipeline, sales today and team activity on a phone-sized dashboard.</p>

        <div class="dash">
          <article class="w pipe">
            <span class="lb">Pipeline</span>
            <ul>
              <li v-for="s in stages" :key="s.n">
                <span class="nm">{{ s.n }}</span>
                <span class="bar"><i :class="s.c" :style="{ width: grown ? (s.v / 42) * 100 + '%' : '0%' }"></i></span>
                <b>{{ s.v }}</b>
              </li>
            </ul>
          </article>

          <article class="w sale">
            <span class="lb">Sales today</span>
            <b class="big">LKR {{ fmt }}</b>
            <span class="sp" aria-hidden="true"><i v-for="(h, i) in spark" :key="i" :class="{ on: i < bars }" :style="{ height: h + '%' }"></i></span>
          </article>

          <article class="w act">
            <span class="lb">Team activity</span>
            <ul>
              <li v-for="(f, i) in feed" :key="f.w" :class="{ vis: sub >= 3 + i * 2 }">
                <i :class="f.c"></i>
                <span><b>{{ f.w }}</b> {{ f.t }}<small>{{ f.d }}</small></span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.md {
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
.md *, .md *::before, .md *::after { box-sizing: border-box; }
.wrap { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; align-items: stretch; }
.ph, .copy { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .ph, .in .copy { opacity: 1; transform: none; }
.in .copy { transition-delay: .12s; }

.ph { position: relative; margin: 0; border-radius: 32px; overflow: hidden; min-height: 700px; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.copy { display: flex; flex-direction: column; justify-content: center; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.md h2 .l1 { color: #111111 !important; opacity: 1; }
.md h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.copy > p { margin: 0 0 28px; font-size: 16px; line-height: 1.75; color: var(--muted); max-width: 52ch; }

.dash { background: var(--lav); border-radius: 28px; padding: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 520px; }
.w { background: #fff; border-radius: 18px; padding: 16px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.pipe, .act { grid-column: 1 / -1; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

.pipe ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.pipe li { display: grid; grid-template-columns: 88px minmax(0, 1fr) 26px; gap: 10px; align-items: center; font-size: 12.5px; }
.nm { color: var(--muted); }
.bar { height: 8px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 4px; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.bar i.lav { background: var(--lav-i); } .bar i.sky { background: var(--sky-i); } .bar i.butter { background: #d8b13a; } .bar i.mint { background: var(--mint-i); }
.pipe b { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }

.sale { grid-column: 1 / -1; }
.big { font-size: clamp(26px, 3vw, 34px); font-weight: 600; letter-spacing: -.03em; font-variant-numeric: tabular-nums; line-height: 1; }
.sp { display: flex; align-items: flex-end; gap: 5px; height: 44px; }
.sp i { flex: 1; border-radius: 3px; background: #e9ebee; transition: background .4s; }
.sp i.on { background: var(--mint-i); }

.act ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.act li { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; line-height: 1.5; opacity: .2; transform: translateX(-6px); transition: all .45s ease; }
.act li.vis { opacity: 1; transform: none; }
.act li i { width: 8px; height: 8px; border-radius: 50%; margin-top: 7px; flex: none; }
.act li i.sky { background: var(--sky-i); } .act li i.mint { background: var(--mint-i); } .act li i.butter { background: #d8b13a; }
.act li small { display: block; font-size: 11.5px; color: var(--muted); }
.act li b { font-weight: 600; }

@media (max-width: 900px) {
  .wrap { grid-template-columns: 1fr; gap: 36px; }
  .ph { min-height: 440px; }
  .dash { max-width: none; }
}
@media (max-width: 640px) {
  .md { padding: 64px 16px; }
  .ph { min-height: 340px; border-radius: 24px; }
  .dash { padding: 10px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .ph, .copy { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
