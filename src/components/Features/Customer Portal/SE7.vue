<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhiteLabelSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const themes = [
  { c: "#14120f", t: "#eeeafd" },
  { c: "#3a7fbd", t: "#e4f0fb" },
  { c: "#2c7a56", t: "#dff3e8" },
];
const langs = [
  { k: "English", m: "Welcome back, Dilani. Your projects and invoices are here." },
  { k: "සිංහල", m: "ආයුබෝවන් දිලානි. ඔබගේ ව්‍යාපෘති සහ ඉන්වොයිස් මෙහි ඇත." },
  { k: "தமிழ்", m: "மீண்டும் வரவேற்கிறோம் திலானி. உங்கள் திட்டங்களும் விலைப்பட்டியல்களும் இங்கே உள்ளன." },
];
const mods = ["Quotations", "Invoices", "Tickets", "Documents", "Projects"];
const tiers = [
  { k: "Basic", m: [1, 2, 3] },
  { k: "Premium", m: [0, 1, 2, 3, 4] },
];
const domain = "portal.yourcompany.com";

const th = computed(() => (still.value ? 0 : Math.floor(n.value / 4) % 3));
const lg = computed(() => (still.value ? 0 : Math.floor(n.value / 3) % 3));
const tr = computed(() => (still.value ? 1 : Math.floor(n.value / 6) % 2));
const theme = computed(() => themes[th.value]);
const lang = computed(() => langs[lg.value]);
const tier = computed(() => tiers[tr.value]);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 1000);
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
  <section ref="root" class="wl" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">White-label</span> <span class="l2">customisation</span></h2>
        <p>
          Set your logo, colours, fonts and welcome message, map a custom domain such as portal.yourcompany.com, choose
          which modules each customer tier sees, and offer the portal in English, Sinhala or Tamil. As client portal
          software, Saptivo needs no developer for standard customisation.
        </p>
      </header>

      <div class="grid">
        <!-- settings -->
        <article class="set">
          <span class="lb">Portal settings</span>

          <div class="f">
            <small>Logo</small>
            <div class="logo"><span class="lg" :style="{ background: theme.c }">Y</span><b>YourCompany</b><em>Change</em></div>
          </div>

          <div class="f">
            <small>Colours</small>
            <div class="sw"><i v-for="(t, i) in themes" :key="t.c" :style="{ background: t.c }" :class="{ on: i === th }"></i></div>
          </div>

          <div class="f two">
            <div><small>Font</small><div class="fi">Poppins</div></div>
            <div><small>Language</small><div class="seg"><span v-for="(l, i) in langs" :key="l.k" :class="{ on: i === lg }">{{ l.k }}</span></div></div>
          </div>

          <div class="f">
            <small>Custom domain</small>
            <div class="fi dm"><span>{{ domain }}</span><em>Connected</em></div>
          </div>

          <div class="f">
            <small>Modules for tier</small>
            <div class="seg wide"><span v-for="(t, i) in tiers" :key="t.k" :class="{ on: i === tr }">{{ t.k }}</span></div>
          </div>
        </article>

        <!-- live preview -->
        <div class="pv" :style="{ '--pc': theme.c, '--pt': theme.t }">
          <div class="bar">
            <span class="dots"><i></i><i></i><i></i></span>
            <span class="url">{{ domain }}</span>
          </div>
          <div class="screen">
            <div class="nav">
              <span class="lg" :style="{ background: theme.c }">Y</span>
              <b>YourCompany</b>
            </div>
            <div class="body">
              <ul class="mn">
                <li v-for="(m, i) in mods" :key="m" :class="{ off: !tier.m.includes(i) }">{{ m }}</li>
              </ul>
              <div class="main">
                <div class="wc">
                  <p :key="lg">{{ lang.m }}</p>
                  <span class="cta">{{ lg === 1 ? "විවෘත කරන්න" : lg === 2 ? "திற" : "Open portal" }}</span>
                </div>
                <div class="cards"><i></i><i></i><i></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wl {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", "Noto Sans Sinhala", "Noto Sans Tamil", "Iskoola Pota", "Nirmala UI", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wl *, .wl *::before, .wl *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { max-width: 800px; margin: 0 0 44px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.wl h2 .l1 { color: #111111 !important; opacity: 1; }
.wl h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .1s; }

.grid { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); gap: 16px; align-items: stretch; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

.set { background: var(--butter); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.f { display: flex; flex-direction: column; gap: 6px; }
.f small { font-size: 12px; color: var(--muted); font-weight: 500; }
.f.two { display: grid; grid-template-columns: 1fr 1.4fr; gap: 10px; }
.f.two > div { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.logo, .fi { background: #fff; border-radius: 12px; padding: 9px 12px; font-size: 13.5px; display: flex; align-items: center; gap: 10px; }
.logo b { font-weight: 500; flex: 1; }
.logo em, .dm em { font-style: normal; font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 6px; background: #f1f2f4; color: var(--muted); }
.dm { justify-content: space-between; }
.dm span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dm em { background: var(--mint); color: var(--mint-i); }
.lg { width: 26px; height: 26px; border-radius: 8px; color: #fff; display: grid; place-items: center; font-size: 13px; font-weight: 700; flex: none; transition: background .4s; }
.sw { display: flex; gap: 10px; background: #fff; border-radius: 12px; padding: 10px 12px; }
.sw i { width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 0 0 2px #fff; transition: box-shadow .3s; }
.sw i.on { box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--ink); }
.seg { display: flex; gap: 3px; padding: 3px; background: #fff; border-radius: 12px; }
.seg span { flex: 1; text-align: center; font-size: 12px; font-weight: 500; padding: 6px 6px; border-radius: 9px; color: var(--muted); transition: all .3s; white-space: nowrap; }
.seg span.on { background: var(--ink); color: #fff; }

.pv { background: var(--pt); border-radius: 28px; padding: 14px; transition: background .5s; display: flex; flex-direction: column; min-width: 0; }
.bar { display: flex; align-items: center; gap: 12px; padding: 4px 6px 12px; }
.dots { display: flex; gap: 5px; }
.dots i { width: 8px; height: 8px; border-radius: 50%; background: rgba(20, 18, 15, .18); }
.url { flex: 1; background: rgba(255, 255, 255, .75); border-radius: 99px; padding: 5px 14px; font-size: 11.5px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.screen { background: #fff; border-radius: 20px; flex: 1; display: flex; flex-direction: column; min-height: 400px; overflow: hidden; }
.nav { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid var(--line); }
.nav b { font-size: 14px; font-weight: 600; }
.body { display: grid; grid-template-columns: 150px minmax(0, 1fr); flex: 1; }
.mn { list-style: none; margin: 0; padding: 14px 12px; border-right: 1px solid var(--line); display: flex; flex-direction: column; gap: 4px; }
.mn li { font-size: 13px; padding: 8px 12px; border-radius: 9px; color: var(--ink); transition: all .4s; max-height: 40px; overflow: hidden; }
.mn li:first-child { background: var(--pt); font-weight: 500; }
.mn li.off { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
.main { padding: 18px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.wc { background: var(--pt); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 14px; align-items: flex-start; transition: background .5s; }
.wc p { margin: 0; font-size: 15px; line-height: 1.7; font-weight: 500; animation: fi .45s ease both; }
@keyframes fi { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
.cta { font-size: 13px; font-weight: 500; color: #fff; background: var(--pc); padding: 8px 18px; border-radius: 10px; transition: background .5s; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.cards i { height: 64px; border-radius: 12px; border: 1px solid var(--line); background: #fafafb; }

@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .wl { padding: 64px 16px; }
  .set, .pv { padding: 12px; border-radius: 22px; }
  .set { padding: 16px; }
  .f.two { grid-template-columns: 1fr; }
  .body { grid-template-columns: 1fr; }
  .mn { flex-direction: row; flex-wrap: wrap; border-right: 0; border-bottom: 1px solid var(--line); }
  .screen { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  .wc p { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
