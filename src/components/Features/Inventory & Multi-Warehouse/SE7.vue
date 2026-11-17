<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "InventoryBenefitsSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const photoOk = ref(true);
const avOk = ref([true, true]);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "woman-in-yellow-sitting-in-shopping-cart-2026-01-08-02-01-06-utc (1).jpg";
const avs = [
  base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
  base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg",
];

const checking = computed(() => n.value % 4 === 0);
const filled = computed(() => [6, 5, 4, 3, 2, 6][n.value % 6]);
const lowShelf = computed(() => filled.value <= 2);
const slowVal = computed(() => [4.2, 3.6, 2.8, 2.0, 1.4, 1.1][n.value % 6]);
const released = computed(() => (4.2 - slowVal.value).toFixed(1));
const avail = computed(() => (n.value % 8 >= 4 ? 11 : 12));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1500);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    n.value = 5;
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
  <section ref="root" class="ib" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Benefits for</span> <span class="l2">your business</span></h2>
        <p>
          Accurate stock means you never promise a customer an item you don't have. Reorder alerts prevent lost sales
          from empty shelves, and stock reports stop cash being tied up in slow movers. Because inventory is part of
          the CRM, sales and service teams see availability while they quote.
        </p>
      </header>

      <div class="grid" role="img" aria-label="Four benefits: accurate stock when quoting, reorder alerts, less cash tied up in slow movers, and one shared view for sales and service">
        <!-- photo + quote -->
        <div class="ph">
          <div class="shelves"></div>
          <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
          <div class="shade"></div>

          <div class="qt">
            <div class="qh"><strong>Quotation QT-0412</strong><span>Dilani Perera</span></div>
            <ul>
              <li>
                <span>2 × Air purifier X2</span>
                <em :class="checking ? 'wait' : 'ok'">{{ checking ? "Checking…" : "12 available · Colombo" }}</em>
              </li>
              <li>
                <span>4 × HEPA filter</span>
                <em class="ok">138 available</em>
              </li>
            </ul>
            <div class="qf">Sales sees availability while quoting</div>
          </div>
        </div>

        <!-- A -->
        <article class="c">
          <span class="num">1</span>
          <h3>Never promise what you don't have</h3>
          <p>Accurate stock on every quote.</p>
          <div class="v">
            <div class="chip" :class="checking ? 'wait' : 'ok'">
              <i></i>{{ checking ? "Checking stock" : "In stock · safe to promise" }}
            </div>
          </div>
        </article>

        <!-- B -->
        <article class="c">
          <span class="num">2</span>
          <h3>No lost sales from empty shelves</h3>
          <p>Reorder alerts fire before it runs out.</p>
          <div class="v">
            <div class="shelf">
              <i v-for="k in 6" :key="k" :class="{ on: k <= filled, low: lowShelf }"></i>
            </div>
            <span class="tg" :class="lowShelf ? 'bad' : 'good'">{{ lowShelf ? "Reorder alert sent" : "Healthy" }}</span>
          </div>
        </article>

        <!-- C -->
        <article class="c">
          <span class="num">3</span>
          <h3>Less cash tied up in slow movers</h3>
          <p>Stock reports show what is not selling.</p>
          <div class="v col">
            <div class="cash"><i :style="{ width: Math.round((slowVal / 4.2) * 100) + '%' }"></i></div>
            <div class="cr"><span>Slow movers LKR {{ slowVal.toFixed(1) }}M</span><b>Released {{ released }}M</b></div>
          </div>
        </article>

        <!-- D -->
        <article class="c">
          <span class="num">4</span>
          <h3>Part of the CRM</h3>
          <p>Sales and service see the same stock.</p>
          <div class="v">
            <div class="two">
              <span class="who">
                <span class="av"><img v-if="avOk[0]" :src="avs[0]" alt="" @error="avOk[0] = false" /><b v-else>S</b></span>
                <small>Sales</small>
              </span>
              <b class="q">{{ avail }}</b>
              <span class="who">
                <span class="av"><img v-if="avOk[1]" :src="avs[1]" alt="" @error="avOk[1] = false" /><b v-else>T</b></span>
                <small>Service</small>
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ib {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 800px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ib h2 .l1 { color: #111111 !important; opacity: 1; }
.ib h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .grid { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .1s; }

.grid { display: grid; grid-template-columns: 1.05fr 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 16px; }

/* photo card */
.ph { position: relative; grid-row: 1 / 3; border-radius: 32px; overflow: hidden; min-height: 520px; background: #231f33; display: flex; align-items: flex-end; padding: 16px; box-shadow: 0 30px 70px rgba(40, 30, 90, .2); }
.ph > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.shelves { position: absolute; inset: 0; background:
  repeating-linear-gradient(90deg, rgba(255, 255, 255, .05) 0 2px, transparent 2px 90px),
  repeating-linear-gradient(0deg, rgba(255, 255, 255, .07) 0 3px, transparent 3px 100px),
  linear-gradient(140deg, #2a2447 0%, #1f3a56 55%, #1d4a43 100%); }
.shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(14, 12, 24, .65), rgba(14, 12, 24, 0) 60%); }
.qt { position: relative; z-index: 1; width: 100%; background: rgba(255, 255, 255, .94); backdrop-filter: blur(16px); border-radius: 22px; padding: 16px 18px; box-shadow: 0 18px 40px rgba(0, 0, 0, .25); }
.qh { display: flex; justify-content: space-between; gap: 8px; align-items: baseline; margin-bottom: 10px; }
.qh strong { font-size: 13.5px; }
.qh span { font-size: 11.5px; color: var(--muted); }
.qt ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.qt li { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 12.5px; padding: 8px 10px; border-radius: 12px; background: #f6f4ff; flex-wrap: wrap; }
.qt em { font-style: normal; font-size: 10.5px; font-weight: 700; padding: 3px 10px; border-radius: 99px; transition: all .35s; }
.qt em.ok { background: var(--mint); color: var(--mint-i); }
.qt em.wait { background: var(--butter); color: var(--butter-i); }
.qf { margin-top: 10px; font-size: 11.5px; font-weight: 600; color: var(--mint-i); }

/* cards */
.c { position: relative; background: #faf9ff; border: 1px solid var(--line); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 6px; min-width: 0; transition: transform .35s, box-shadow .35s; }
.c:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(60, 50, 120, .12); }
.num { width: 28px; height: 28px; border-radius: 50%; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-size: 12.5px; font-weight: 700; margin-bottom: 8px; }
.c h3 { margin: 0; font-size: 16px; font-weight: 600; line-height: 1.4; }
.c p { margin: 0; font-size: 12.5px; color: var(--muted); line-height: 1.55; }
.v { margin-top: auto; padding-top: 16px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.v.col { flex-direction: column; align-items: stretch; gap: 8px; }

.chip { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; padding: 9px 16px; border-radius: 99px; transition: all .35s; }
.chip i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.chip.ok { background: var(--mint); color: var(--mint-i); }
.chip.wait { background: var(--butter); color: var(--butter-i); }

.shelf { display: flex; gap: 6px; align-items: flex-end; height: 44px; }
.shelf i { display: block; width: 18px; height: 100%; border-radius: 6px; background: #e8e5f2; transition: all .5s; }
.shelf i.on { background: var(--lav-i); }
.shelf i.on.low { background: var(--rose-i); }
.tg { font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 99px; transition: all .35s; }
.tg.good { background: var(--mint); color: var(--mint-i); }
.tg.bad { background: var(--rose); color: var(--rose-i); }

.cash { height: 14px; border-radius: 99px; background: #f1eff8; overflow: hidden; }
.cash i { display: block; height: 100%; border-radius: 99px; background: #e3b43a; transition: width .9s cubic-bezier(.3, .8, .3, 1); }
.cr { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--muted); flex-wrap: wrap; }
.cr b { color: var(--mint-i); font-weight: 700; }

.two { display: flex; align-items: center; gap: 14px; }
.who { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.who small { font-size: 10.5px; font-weight: 600; color: var(--muted); }
.av { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-weight: 700; font-size: 13px; border: 3px solid #fff; box-sizing: border-box; box-shadow: 0 0 0 1px var(--line); }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.q { font-size: 36px; font-weight: 600; letter-spacing: -.03em; font-variant-numeric: tabular-nums; min-width: 52px; text-align: center; }

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
  .ph { grid-column: 1 / -1; grid-row: auto; min-height: 380px; }
}
@media (max-width: 640px) {
  .ib { padding: 64px 16px; }
  .grid { grid-template-columns: 1fr; }
  .ph { border-radius: 26px; min-height: 340px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
