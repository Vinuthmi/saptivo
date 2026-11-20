<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "HelpCentreSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const ok = ref(true);
const n = ref(0);
let timer = null;
let io = null;

const base = "/saptivo/images/features/";
// the big image of this section, swap the path if you like
const photo = base + "smiling-woman-working-at-computer-in-office-2026-09-21-22-49-47-utc.webp";

const query = "how to reset my password";
const typed = [0, 3, 10, 17, query.length];
const results = [
  { t: "How to reset your password", k: "Article", c: "lav" },
  { t: "Account security in 3 minutes", k: "Video", c: "sky" },
  { t: "Can I change my login email?", k: "FAQ", c: "mint" },
];
const tiles = [
  { t: "Articles", d: "Step by step answers", c: "lav" },
  { t: "Guides", d: "Setup and how-tos", c: "sky" },
  { t: "Videos", d: "Short walkthroughs", c: "mint" },
  { t: "FAQs", d: "Quick common answers", c: "butter" },
];

const sub = computed(() => (still.value ? 9 : n.value % 12));
const text = computed(() => query.slice(0, typed[Math.min(sub.value, 4)] ?? query.length));
const listOn = computed(() => sub.value >= 5);
const rated = computed(() => sub.value >= 7);
const pub = computed(() => sub.value >= 9);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 700);
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
  <section ref="root" class="kb" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Knowledge base</span> <span class="l2">and help centre</span></h2>
        <p>
          A searchable library of articles, guides, videos and FAQs answers common questions without a ticket.
          Customers rate articles, and your team publishes from the Saptivo admin.
        </p>
      </header>

      <div class="hero">
        <img v-if="ok" :src="photo" alt="" @error="ok = false" />

        <div class="panel">
          <div class="search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.500-3.500" /></svg>
            <span :class="{ ph: !text }">{{ text || "Search the help centre" }}<i v-if="sub < 5" class="caret"></i></span>
          </div>

          <ul class="res" :class="{ show: listOn }">
            <li v-for="(r, i) in results" :key="r.t" :class="{ top: i === 0 }">
              <span class="tg" :class="r.c">{{ r.k }}</span>
              <b>{{ r.t }}</b>
            </li>
          </ul>

          <div class="rate" :class="{ show: listOn }">
            <small>Was this article helpful?</small>
            <span class="btns"><i :class="{ on: rated }">Yes</i><i>No</i></span>
          </div>
        </div>

        <div class="chip" :class="{ show: rated }"><b>94%</b><small>found this helpful</small></div>
        <div class="toast" :class="{ show: pub }"><span class="dot"></span><div><b>Published from Saptivo admin</b><small>New article is live</small></div></div>
      </div>

      <div class="tiles">
        <div v-for="t in tiles" :key="t.t" class="tile" :class="t.c"><b>{{ t.t }}</b><small>{{ t.d }}</small></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.kb {
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
.kb *, .kb *::before, .kb *::after { box-sizing: border-box; }
.wrap { max-width: 1200px; margin: 0 auto; }
.head { max-width: 780px; margin: 0 0 40px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.kb h2 .l1 { color: #111111 !important; opacity: 1; }
.kb h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.head, .hero, .tiles { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .hero, .in .tiles { opacity: 1; transform: none; }
.in .hero { transition-delay: .1s; }
.in .tiles { transition-delay: .18s; }

.hero { position: relative; border-radius: 32px; overflow: hidden; min-height: 560px; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); }
.hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }

.panel { position: absolute; left: 28px; bottom: 28px; width: min(400px, calc(100% - 56px)); background: #fff; border-radius: 22px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.search { display: flex; align-items: center; gap: 10px; border: 1.5px solid var(--ink); border-radius: 14px; padding: 11px 14px; font-size: 14px; }
.search svg { flex: none; color: var(--muted); }
.search .ph { color: #9aa0a8; }
.caret { display: inline-block; width: 1.5px; height: 15px; background: var(--ink); margin-left: 2px; vertical-align: -2px; animation: bk 1s steps(1) infinite; }
@keyframes bk { 50% { opacity: 0; } }
.res { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; opacity: .15; transform: translateY(6px); transition: all .45s ease; }
.res.show { opacity: 1; transform: none; }
.res li { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 12px; border: 1px solid var(--line); font-size: 13px; }
.res li.top { background: #f7f7f9; border-color: var(--ink); }
.res b { font-weight: 500; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tg { font-size: 10.5px; font-weight: 600; padding: 2px 8px; border-radius: 6px; flex: none; }
.tg.lav { background: var(--lav); color: var(--lav-i); } .tg.sky { background: var(--sky); color: var(--sky-i); } .tg.mint { background: var(--mint); color: var(--mint-i); }
.rate { display: flex; align-items: center; justify-content: space-between; gap: 10px; opacity: .15; transition: opacity .45s; }
.rate.show { opacity: 1; }
.rate small { font-size: 12px; color: var(--muted); }
.btns { display: flex; gap: 6px; }
.btns i { font-style: normal; font-size: 12px; font-weight: 500; padding: 4px 14px; border-radius: 99px; border: 1px solid var(--line); transition: all .3s; }
.btns i.on { background: var(--mint); color: var(--mint-i); border-color: transparent; font-weight: 600; }

.chip { position: absolute; right: 24px; top: 24px; background: #fff; border-radius: 16px; padding: 12px 16px; display: flex; flex-direction: column; opacity: 0; transform: translateY(-8px); transition: all .45s ease; }
.chip.show { opacity: 1; transform: none; }
.chip b { font-size: 22px; font-weight: 600; }
.chip small { font-size: 11.5px; color: var(--muted); }
.toast { position: absolute; right: 24px; bottom: 28px; background: #fff; border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; opacity: 0; transform: translateY(10px); transition: all .45s ease; }
.toast.show { opacity: 1; transform: none; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: var(--mint-i); flex: none; }
.toast div { display: flex; flex-direction: column; }
.toast b { font-size: 13px; font-weight: 600; }
.toast small { font-size: 11.5px; color: var(--muted); }

.tiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
.tile { border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 4px; }
.tile b { font-size: 16px; font-weight: 600; }
.tile small { font-size: 12.5px; color: var(--muted); }
.tile.lav { background: var(--lav); } .tile.sky { background: var(--sky); } .tile.mint { background: var(--mint); } .tile.butter { background: var(--butter); }

@media (max-width: 900px) {
  .hero { min-height: 640px; }
  .toast { right: auto; left: 28px; bottom: auto; top: 24px; }
  .chip { top: auto; bottom: 28px; right: 24px; display: none; }
  .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .kb { padding: 64px 16px; }
  .hero { border-radius: 24px; min-height: 600px; }
  .panel { left: 12px; right: 12px; bottom: 12px; width: auto; padding: 12px; }
  .toast { left: 12px; top: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .hero, .tiles { opacity: 1; transform: none; transition: none; }
  .caret { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
