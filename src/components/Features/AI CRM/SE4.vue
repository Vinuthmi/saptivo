<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "CallSummariesSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const manual = ref(-1);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

// segment kinds: p = price, c = competitor, d = discount or cancel keyword
const langs = [
  {
    k: "Sinhala",
    lines: [
      { who: "Rep", s: [{ t: "සම්බන්ධ වුණාට ස්තූතියි දිලානි. මෙන්න ප්‍රස්තාවය." }] },
      { who: "Customer", s: [{ t: "" }, { t: "රු. 850,000", k: "p" }, { t: " මිල ටිකක් වැඩියි. " }, { t: "Brand X", k: "c" }, { t: " ඊට අඩුවට දුන්නා." }] },
      { who: "Customer", s: [{ t: "" }, { t: "වට්ටමක්", k: "d" }, { t: " දෙන්න පුළුවන්ද? නැත්නම් මට " }, { t: "අවලංගු", k: "d" }, { t: " කරන්න වෙයි." }] },
    ],
  },
  {
    k: "Tamil",
    lines: [
      { who: "Rep", s: [{ t: "இணைந்ததற்கு நன்றி திலானி. இதோ முன்மொழிவு." }] },
      { who: "Customer", s: [{ t: "" }, { t: "ரூ. 850,000", k: "p" }, { t: " விலை கொஞ்சம் அதிகம். " }, { t: "Brand X", k: "c" }, { t: " குறைவாகக் கொடுத்தது." }] },
      { who: "Customer", s: [{ t: "" }, { t: "தள்ளுபடி", k: "d" }, { t: " தர முடியுமா? இல்லையென்றால் " }, { t: "ரத்து", k: "d" }, { t: " செய்ய வேண்டியிருக்கும்." }] },
    ],
  },
  {
    k: "English",
    lines: [
      { who: "Rep", s: [{ t: "Thanks for joining, Dilani. Here is the proposal." }] },
      { who: "Customer", s: [{ t: "The price of " }, { t: "LKR 850,000", k: "p" }, { t: " is high. " }, { t: "Brand X", k: "c" }, { t: " quoted less." }] },
      { who: "Customer", s: [{ t: "Can you give a " }, { t: "discount", k: "d" }, { t: "? Otherwise I may " }, { t: "cancel", k: "d" }, { t: "." }] },
    ],
  },
];
const bars = Array.from({ length: 44 }, (_, i) => 18 + Math.round(Math.abs(Math.sin(i * 1.7) * 60 + Math.cos(i * 0.6) * 20)));

const lang = computed(() => (manual.value >= 0 ? manual.value : reduce ? 2 : Math.floor(n.value / 9) % 3));
const sub = computed(() => (manual.value >= 0 ? Math.max(n.value % 9, 0) : reduce ? 8 : n.value % 9));
const cur = computed(() => langs[lang.value]);
const hot = computed(() => sub.value >= 4);
const posted = computed(() => sub.value >= 5);
const coach = computed(() => sub.value >= 7);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 650);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manual.value = i;
  n.value = 0;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
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
  <section ref="root" class="cs" :class="{ in: shown, live: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Call and</span> <span class="l2">meeting summaries</span></h2>
        <p>
          Recorded calls and meetings are transcribed in Sinhala, Tamil and English. Saptivo extracts action items,
          objections, prices mentioned and competitor names, then posts a short summary to the deal. Managers can spot
          coaching moments when keywords such as discount or cancel come up.
        </p>
      </header>

      <div class="stage">
        <!-- call -->
        <article class="call">
          <div class="ch">
            <div><strong>Call with Dilani Perera</strong><small>AMC renewal · 12:48</small></div>
            <div class="lg" role="tablist">
              <button v-for="(l, i) in langs" :key="l.k" type="button" role="tab" :aria-selected="i === lang" :class="{ on: i === lang }" @click="pick(i)">{{ l.k }}</button>
            </div>
          </div>

          <div class="wave" aria-hidden="true">
            <span class="play"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7Z" /></svg></span>
            <span class="bars"><i v-for="(h, i) in bars" :key="i" :style="{ height: h + '%', animationDelay: (i % 9) * 0.09 + 's' }"></i></span>
            <small>Transcribed in {{ cur.k }}</small>
          </div>

          <ul class="tr">
            <li v-for="(l, i) in cur.lines" :key="lang + '-' + i" :class="{ show: sub >= i + 1, cu: l.who === 'Customer' }">
              <b>{{ l.who }}</b>
              <p><template v-for="(g, k) in l.s" :key="k"><mark v-if="g.k" :class="[g.k, { hot }]">{{ g.t }}</mark><template v-else>{{ g.t }}</template></template></p>
            </li>
          </ul>

          <div class="key"><span><i class="p"></i>Price</span><span><i class="c"></i>Competitor</span><span><i class="d"></i>Discount or cancel</span></div>
        </article>

        <!-- summary -->
        <div class="side">
          <article class="sum" :class="{ show: posted }">
            <div class="sh"><span class="lb">Summary posted to the deal</span><span class="pill">AMC renewal</span></div>
            <dl>
              <div><dt>Action items</dt><dd>Send the revised proposal by Friday<br />Bring the finance head into the next call</dd></div>
              <div><dt>Objection</dt><dd>Price is higher than expected</dd></div>
              <div><dt>Price mentioned</dt><dd>LKR 850,000</dd></div>
              <div><dt>Competitor</dt><dd>Brand X</dd></div>
            </dl>
          </article>

          <article class="coach" :class="{ show: coach }">
            <span class="av"><img v-if="ok" :src="photo" alt="" @error="ok = false" /><b v-else>M</b></span>
            <div>
              <small>Coaching moment for the manager</small>
              <p>"Discount" and "cancel" came up in this call at 08:14.</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cs {
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
.cs *, .cs *::before, .cs *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 840px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.cs h2 .l1 { color: #111111 !important; opacity: 1; }
.cs h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .08s; }

.stage { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr); gap: 18px; align-items: stretch; }

.call { background: var(--lav); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ch { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
.ch div:first-child { display: flex; flex-direction: column; }
.ch strong { font-size: 15px; font-weight: 600; }
.ch small { font-size: 12.5px; color: var(--muted); }
.lg { display: flex; gap: 4px; padding: 3px; background: rgba(255, 255, 255, .65); border-radius: 99px; }
.lg button { all: unset; cursor: pointer; font-size: 12.5px; font-weight: 500; padding: 6px 14px; border-radius: 99px; color: var(--muted); transition: all .25s; }
.lg button.on { background: var(--ink); color: #fff; }
.lg button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.wave { display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 16px; padding: 12px 16px; }
.play { width: 30px; height: 30px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; flex: none; }
.bars { flex: 1; height: 34px; display: flex; align-items: center; gap: 2px; min-width: 0; }
.bars i { flex: 1; min-width: 2px; border-radius: 2px; background: #cfc7ea; transform-origin: center; animation: wv 1.1s ease-in-out infinite alternate; animation-play-state: paused; }
.live .bars i { animation-play-state: running; }
@keyframes wv { from { transform: scaleY(.55); } to { transform: scaleY(1); } }
.wave small { font-size: 11.5px; color: var(--muted); white-space: nowrap; }

.tr { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; min-height: 230px; }
.tr li { display: flex; flex-direction: column; gap: 3px; opacity: 0; transform: translateY(6px); transition: all .4s ease; }
.tr li.show { opacity: 1; transform: none; }
.tr li b { font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.tr li p { margin: 0; background: #fff; border-radius: 4px 14px 14px 14px; padding: 11px 14px; font-size: 14.5px; line-height: 1.75; }
.tr li.cu p { background: #fff; border-radius: 14px 4px 14px 14px; }
mark { background: transparent; color: inherit; border-radius: 5px; padding: 1px 4px; transition: background .4s, color .4s; }
mark.hot.p { background: var(--sky); color: var(--sky-i); font-weight: 600; }
mark.hot.c { background: var(--butter); color: var(--butter-i); font-weight: 600; }
mark.hot.d { background: var(--rose); color: var(--rose-i); font-weight: 600; }
.key { display: flex; flex-wrap: wrap; gap: 14px; font-size: 12px; color: var(--muted); }
.key span { display: inline-flex; align-items: center; gap: 7px; }
.key i { width: 10px; height: 10px; border-radius: 3px; }
.key .p { background: var(--sky-i); } .key .c { background: #d8b13a; } .key .d { background: var(--rose-i); }

.side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.sum { background: var(--mint); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 14px; flex: 1; opacity: .35; transform: translateY(8px); transition: all .5s ease; }
.sum.show { opacity: 1; transform: none; }
.sh { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.pill { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #fff; color: var(--mint-i); }
dl { margin: 0; background: #fff; border-radius: 18px; padding: 4px 16px; }
dl div { display: grid; grid-template-columns: 112px 1fr; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--line); font-size: 13.5px; line-height: 1.6; }
dl div:last-child { border-bottom: 0; }
dt { color: var(--muted); font-size: 12.5px; }
dd { margin: 0; font-weight: 500; }

.coach { display: flex; align-items: center; gap: 14px; background: var(--rose); border-radius: 22px; padding: 16px 18px; opacity: .3; transform: translateY(8px); transition: all .5s ease; }
.coach.show { opacity: 1; transform: none; }
.av { width: 42px; height: 42px; border-radius: 50%; overflow: hidden; background: #fff; color: var(--rose-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.coach small { font-size: 11.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--rose-i); }
.coach p { margin: 3px 0 0; font-size: 13.5px; line-height: 1.55; }

@media (max-width: 900px) {
  .stage { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .cs { padding: 64px 16px; }
  .call, .sum { padding: 16px; border-radius: 22px; }
  .tr { min-height: 0; }
  dl div { grid-template-columns: 1fr; gap: 2px; }
  .wave small { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  .bars i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
