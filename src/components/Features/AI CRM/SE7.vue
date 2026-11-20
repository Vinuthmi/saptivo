<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ChurnPredictionSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref(false);
const active = ref(0);
const started = ref(false);
let io = null;
let cycle = null;
let touched = false;

/* Images: put your files in /public/saptivo/images/features/ and change the names here.
   If a file is missing, an illustrated fallback (or the owner's initials) is shown instead. */
const imgs = {
  hero: "/saptivo/images/features/team-selection-or-recruitment-process-concept-2026-09-24-05-18-17-utc.webp",
  owner: "/saptivo/images/10.jpg",
};
const heroOk = ref(true);
const ownerOk = ref(true);

/* All accounts, signals and scores are SAMPLE data. */
const accounts = [
  {
    n: "Harbour Hotel",
    lvl: "High",
    score: 82,
    tone: "rose",
    sig: [
      { k: "Ticket volume", v: "Up 60% this quarter", d: "up", bad: true },
      { k: "Logins", v: "Down 45%", d: "down", bad: true },
      { k: "Email opens", v: "Down 30%", d: "down", bad: true },
      { k: "Purchase frequency", v: "Last order 4 months ago", d: "down", bad: true },
    ],
    alert: "Owner alerted: risk rose from Medium to High",
    pb: ["Call within 48 hours", "Offer a service review", "Involve the manager"],
  },
  {
    n: "Acme Ltd",
    lvl: "Medium",
    score: 54,
    tone: "butter",
    sig: [
      { k: "Ticket volume", v: "Steady", d: "flat", bad: false },
      { k: "Logins", v: "Down 20%", d: "down", bad: true },
      { k: "Email opens", v: "Down 15%", d: "down", bad: true },
      { k: "Purchase frequency", v: "Slower than usual", d: "down", bad: true },
    ],
    alert: "Owner alerted: engagement is slipping",
    pb: ["Send a check-in email", "Share a how-to article", "Book a review call"],
  },
  {
    n: "Metro Mall",
    lvl: "Low",
    score: 18,
    tone: "mint",
    sig: [
      { k: "Ticket volume", v: "Normal", d: "flat", bad: false },
      { k: "Logins", v: "Up 12%", d: "up", bad: false },
      { k: "Email opens", v: "Steady", d: "flat", bad: false },
      { k: "Purchase frequency", v: "Orders every month", d: "flat", bad: false },
    ],
    alert: "",
    pb: ["Keep nurturing with the quarterly newsletter"],
  },
];
const a = computed(() => accounts[active.value]);

/* risk gauge (half circle) */
const R = 70;
const L = Math.PI * R;
const offset = computed(() => L * (1 - a.value.score / 100));

function pick(k) {
  touched = true;
  clearInterval(cycle);
  active.value = k;
  started.value = false;
}
function start() {
  touched = true;
  clearInterval(cycle);
  started.value = true;
}

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    seen.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      shown.value = true;
      seen.value = true;
      io.disconnect();
      cycle = setInterval(() => {
        if (touched) return;
        active.value = (active.value + 1) % accounts.length;
        started.value = false;
      }, 6500);
    },
    { threshold: 0.3 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
  clearInterval(cycle);
});
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Churn</span> <span class="l2">prediction</span></h2>
        <p class="sub">
          Saptivo watches engagement signals such as ticket volume, logins, email opens and purchase frequency, and gives each account a churn risk level with the factors behind it. The account owner is alerted when risk rises, with a suggested retention playbook.
        </p>
      </header>

      <div class="layout">
        <!-- image -->
        <figure class="hero" :class="{ on: seen }">
          <img v-if="heroOk" :src="imgs.hero" alt="Account manager reviewing customer health" loading="lazy" @error="heroOk = false" />
          <svg v-else class="fb" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="ch-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#e8e3ff" />
                <stop offset="1" stop-color="#fde3ea" />
              </linearGradient>
            </defs>
            <rect width="400" height="600" fill="url(#ch-g)" />
            <circle cx="90" cy="110" r="120" fill="#fff" opacity=".5" />
            <rect x="60" y="170" width="280" height="200" rx="28" fill="#fff" />
            <path d="M92 230c40 4 56 26 82 38s54 4 84 50 " fill="none" stroke="#d8567f" stroke-width="7" stroke-linecap="round" />
            <path d="M92 330h216" stroke="#ece9f3" stroke-width="3" />
            <circle cx="258" cy="318" r="11" fill="#d8567f" />
            <circle cx="296" cy="168" r="26" fill="#fff1c9" />
            <path d="M296 156v14M296 178h.01" stroke="#a77d00" stroke-width="5" stroke-linecap="round" />
          </svg>
          <div class="shade"></div>
          <figcaption>
            <span class="p1 tone-sky"><i></i>Engagement drop spotted</span>
            <span class="p2 tone-rose"><i></i>Account owner alerted</span>
            <span class="p3 tone-mint"><i></i>Retention playbook started</span>
          </figcaption>
        </figure>

        <!-- risk card -->
        <div class="card" :class="{ on: seen }">
          <div class="tabs" role="group" aria-label="Account">
            <button
              v-for="(x, k) in accounts"
              :key="x.n"
              type="button"
              :class="[{ sel: active === k }, 'tone-' + x.tone]"
              :aria-pressed="active === k"
              @click="pick(k)"
            >
              <i></i>{{ x.n }}
            </button>
          </div>

          <div :key="active" class="body">
            <div class="top">
              <svg class="gauge" viewBox="0 0 180 104" role="img" :aria-label="`${a.lvl} churn risk, score ${a.score} out of 100`">
                <path d="M20 90a70 70 0 0 1 140 0" class="trk" />
                <path
                  d="M20 90a70 70 0 0 1 140 0"
                  class="arc"
                  :class="'tone-' + a.tone"
                  :stroke-dasharray="L"
                  :stroke-dashoffset="seen ? offset : L"
                />
                <text x="90" y="82" text-anchor="middle" class="gs">{{ a.score }}</text>
                <text x="90" y="100" text-anchor="middle" class="gl">out of 100</text>
              </svg>
              <div class="lvl" :class="'tone-' + a.tone">
                <small>Churn risk</small>
                <b>{{ a.lvl }}</b>
              </div>
            </div>

            <ul class="sig">
              <li v-for="s in a.sig" :key="s.k" :class="{ bad: s.bad }">
                <span class="dir">
                  <svg v-if="s.d === 'up'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
                  <svg v-else-if="s.d === 'down'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14" /></svg>
                </span>
                <b>{{ s.k }}</b>
                <em>{{ s.v }}</em>
              </li>
            </ul>

            <div class="alert" :class="{ calm: !a.alert }">
              <span class="av">
                <img v-if="ownerOk" :src="imgs.owner" alt="" @error="ownerOk = false" />
                <template v-else>NP</template>
              </span>
              <p>{{ a.alert || "No alert needed. Saptivo keeps watching." }}</p>
            </div>

            <div class="pb">
              <small>Suggested retention playbook</small>
              <ol>
                <li v-for="(p, k) in a.pb" :key="p"><i>{{ k + 1 }}</i>{{ p }}</li>
              </ol>
              <button v-if="a.alert" type="button" :class="{ done: started }" :disabled="started" @click="start">
                {{ started ? "✓ Playbook started" : "Start playbook" }}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.hw {
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
.wrap { max-width: 1080px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 62ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }

.layout { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 18px; align-items: stretch; }

/* image */
.hero { position: relative; margin: 0; min-height: 560px; border-radius: 34px; overflow: hidden; background: #f1eefb; opacity: .35; transform: translateY(14px); transition: all .8s cubic-bezier(.3, .8, .3, 1); box-shadow: 0 24px 54px rgba(60, 50, 120, .12); }
.hero.on { opacity: 1; transform: none; }
.hero img, .hero .fb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; display: block; }
.hero .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, 0) 50%, rgba(20, 18, 15, .55) 100%); }
.hero figcaption { position: absolute; left: 20px; right: 20px; bottom: 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.hero figcaption span { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 99px; background: #fff; color: var(--ink); font-size: 12.5px; font-weight: 600; box-shadow: 0 10px 24px rgba(20, 18, 15, .18); opacity: 0; transform: translateY(12px); }
.hero figcaption i { width: 9px; height: 9px; border-radius: 50%; background: var(--ti); box-shadow: 0 0 0 4px color-mix(in srgb, var(--ti) 22%, transparent); }
.hero.on figcaption span { animation: chip .6s cubic-bezier(.3, 1.3, .5, 1) both; }
.hero.on .p1 { animation-delay: .5s; }
.hero.on .p2 { animation-delay: 1.1s; }
.hero.on .p3 { animation-delay: 1.7s; }
@keyframes chip { to { opacity: 1; transform: none; } }

/* risk card */
.card { background: #faf9ff; border: 1.5px solid var(--line); border-radius: 30px; padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 16px; opacity: .35; transform: translateY(14px); transition: all .7s cubic-bezier(.3, .8, .3, 1); min-width: 0; }
.card.on { opacity: 1; transform: none; background: #fff; box-shadow: 0 20px 44px rgba(60, 50, 120, .1); }
.tabs { display: flex; flex-wrap: wrap; gap: 6px; }
.tabs button { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border: 1.5px solid var(--line); border-radius: 99px; background: #fff; font: inherit; font-size: 12px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .25s; }
.tabs button i { width: 8px; height: 8px; border-radius: 50%; background: var(--ti); }
.tabs button.sel { background: var(--ink); border-color: var(--ink); color: #fff; }
.tabs button:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 2px; }

.body { display: flex; flex-direction: column; gap: 14px; animation: up .45s ease both; }
@keyframes up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.top { display: flex; align-items: center; gap: 16px; }
.gauge { width: 168px; flex: none; }
.gauge .trk { fill: none; stroke: #f1eff8; stroke-width: 14; stroke-linecap: round; }
.gauge .arc { fill: none; stroke: var(--ti); stroke-width: 14; stroke-linecap: round; transition: stroke-dashoffset 1.1s cubic-bezier(.3, .8, .3, 1) .15s; }
.gs { font-size: 34px; font-weight: 700; fill: var(--ink); letter-spacing: -.03em; font-family: "Poppins", system-ui, sans-serif; }
.gl { font-size: 10px; fill: var(--muted); font-family: "Poppins", system-ui, sans-serif; }
.lvl { display: flex; flex-direction: column; padding: 12px 20px; border-radius: 18px; background: var(--t); color: var(--ti); }
.lvl small { font-size: 10.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; }
.lvl b { font-size: 24px; font-weight: 700; letter-spacing: -.02em; }

.sig { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.sig li { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 14px; background: #f6f4ff; font-size: 12.5px; }
.sig .dir { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; background: var(--mint); color: var(--mint-i); }
.sig .dir svg { width: 13px; height: 13px; }
.sig .bad .dir { background: var(--rose); color: var(--rose-i); }
.sig b { font-weight: 600; }
.sig em { font-style: normal; color: var(--muted); text-align: right; }
.sig .bad em { color: var(--rose-i); font-weight: 600; }

.alert { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 18px; background: #fff6f8; border: 1px solid var(--rose); }
.alert.calm { background: #f7fcf9; border-color: var(--mint); }
.alert p { margin: 0; font-size: 12.5px; font-weight: 500; line-height: 1.4; }
.av { flex: none; width: 34px; height: 34px; border-radius: 50%; overflow: hidden; display: grid; place-items: center; background: var(--ink); color: #fff; font-size: 10.5px; font-weight: 700; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }

.pb small { display: block; margin-bottom: 8px; font-size: 10.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.pb ol { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.pb li { display: inline-flex; align-items: center; gap: 8px; padding: 7px 13px 7px 8px; border-radius: 99px; background: var(--lav); color: var(--lav-i); font-size: 12px; font-weight: 600; }
.pb li i { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; background: #fff; font-style: normal; font-size: 10.5px; font-weight: 700; }
.pb button { margin-top: 12px; padding: 9px 20px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; transition: transform .25s, background .3s; }
.pb button:hover:not(:disabled) { transform: translateY(-1px); }
.pb button:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 3px; }
.pb button.done { background: var(--mint-i); cursor: default; }

.note { margin: 26px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 900px) {
  .layout { grid-template-columns: minmax(0, 1fr); }
  .hero { min-height: 340px; }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .card { padding: 18px; }
  .top { flex-direction: column; align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .body, .hero.on figcaption span { animation: none; }
  .hero figcaption span { opacity: 1; transform: none; }
  * { transition-duration: 0s !important; }
}
</style>
