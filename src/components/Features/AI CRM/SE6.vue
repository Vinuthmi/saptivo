<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AiVoiceCallsVodiaSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref(false);
const active = ref(0);
let io = null;
let cycle = null;


const imgs = { hero: "/saptivo/images/features/man-listens-with-earphones-through-torn-paper-2026-09-23-18-16-37-utc.webp" };
const heroOk = ref(true);

/* All customers, lines and outcomes are SAMPLE data. */
const calls = [
  {
    n: "Reminders",
    data: "Service due 12 Nov",
    ai: "Hello Mr. Perera, your AC service is due on 12 November. Shall I book Tuesday at 10 am?",
    me: "Yes, please.",
    out: "Visit booked · Tue 10:00",
  },
  {
    n: "Renewals",
    data: "AMC ends in 30 days",
    ai: "Your maintenance contract ends next month. Would you like to renew it for another year?",
    me: "Yes, go ahead.",
    out: "Renewal confirmed",
  },
  {
    n: "Surveys",
    data: "Job closed yesterday",
    ai: "How would you rate yesterday's visit, from one to five?",
    me: "A five, thank you.",
    out: "Survey score 5 saved",
  },
  {
    n: "Lead qualification",
    data: "New solar enquiry",
    ai: "Thanks for your solar enquiry. Are you hoping to install within the next three months?",
    me: "Yes, within two months.",
    out: "Lead qualified · hot",
  },
];

let touched = false;
function pick(k) {
  touched = true;
  clearInterval(cycle);
  active.value = k;
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
        if (!touched) active.value = (active.value + 1) % calls.length;
      }, 7500);
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
        <h2><span class="l1">AI voice calls</span> <span class="l2">with Vodia</span></h2>
        <p class="sub">
          With Saptivo's Vodia integration, AI voice agents can phone customers for reminders, renewals, surveys and lead qualification using CRM data, and log each outcome back to the record.
        </p>
      </header>

      <div class="stage" :class="{ on: seen }">
        <!-- big image -->
        <figure class="hero">
          <img v-if="heroOk" :src="imgs.hero" alt="Customer taking a phone call" loading="lazy" @error="heroOk = false" />
          <svg v-else class="fb" viewBox="0 0 1100 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="vd-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#e8e3ff" />
                <stop offset="1" stop-color="#d3f0e1" />
              </linearGradient>
            </defs>
            <rect width="1100" height="520" fill="url(#vd-g)" />
            <circle cx="220" cy="120" r="190" fill="#fff" opacity=".5" />
            <circle cx="900" cy="470" r="220" fill="#fff" opacity=".4" />
            <g fill="none" stroke="#7d6be6" stroke-width="10" stroke-linecap="round">
              <path d="M170 250c0-62 40-100 100-100s100 38 100 100" />
              <rect x="150" y="240" width="40" height="86" rx="20" fill="#7d6be6" stroke="none" />
              <rect x="350" y="240" width="40" height="86" rx="20" fill="#7d6be6" stroke="none" />
              <path d="M370 326c0 40-34 60-84 60" />
            </g>
            <g fill="#fff" opacity=".9">
              <rect x="470" y="236" width="12" height="40" rx="6" /><rect x="494" y="214" width="12" height="84" rx="6" /><rect x="518" y="196" width="12" height="120" rx="6" />
              <rect x="542" y="224" width="12" height="64" rx="6" /><rect x="566" y="206" width="12" height="100" rx="6" /><rect x="590" y="240" width="12" height="32" rx="6" />
            </g>
          </svg>
          <div class="shade"></div>
          <span class="badge"><i></i>Calls placed through Vodia</span>
        </figure>

        <!-- use-case tabs -->
        <div class="tabs" role="group" aria-label="Call type">
          <button
            v-for="(c, k) in calls"
            :key="c.n"
            type="button"
            :class="{ sel: active === k }"
            :aria-pressed="active === k"
            @click="pick(k)"
          >
            {{ c.n }}
          </button>
        </div>

        <!-- live call card -->
        <div class="call" aria-live="polite">
          <div :key="active" class="inner">
            <div class="ch">
              <span class="live"><i></i>AI voice agent</span>
              <span class="wave" aria-hidden="true"><u></u><u></u><u></u><u></u><u></u></span>
            </div>

            <p class="data"><small>CRM data used</small><b>{{ calls[active].data }}</b></p>

            <div class="line ai"><small>AI agent</small><p>{{ calls[active].ai }}</p></div>
            <div class="line me"><small>Customer</small><p>{{ calls[active].me }}</p></div>

            <div class="out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
              <span><small>Logged to the customer record</small><b>{{ calls[active].out }}</b></span>
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
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 58ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

/* big image stage */
.stage { position: relative; opacity: .35; transform: translateY(14px); transition: all .8s cubic-bezier(.3, .8, .3, 1); }
.stage.on { opacity: 1; transform: none; }
.hero { position: relative; margin: 0; height: clamp(420px, 46vw, 540px); border-radius: 36px; overflow: hidden; background: #f1eefb; box-shadow: 0 28px 60px rgba(60, 50, 120, .14); }
.hero img, .hero .fb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block; }
.hero .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, .12) 0%, rgba(20, 18, 15, 0) 35%, rgba(20, 18, 15, .5) 100%); }
.badge { position: absolute; left: 22px; top: 22px; display: inline-flex; align-items: center; gap: 8px; padding: 8px 15px; border-radius: 99px; background: #fff; font-size: 12px; font-weight: 600; box-shadow: 0 10px 24px rgba(20, 18, 15, .16); }
.badge i { width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); box-shadow: 0 0 0 4px rgba(47, 156, 107, .2); }

.tabs { position: absolute; left: 22px; bottom: 22px; display: flex; flex-wrap: wrap; gap: 8px; max-width: calc(100% - 44px - 380px); }
.tabs button { padding: 10px 18px; border: 0; border-radius: 99px; background: #fff; font: inherit; font-size: 13px; font-weight: 600; color: var(--ink); cursor: pointer; box-shadow: 0 8px 20px rgba(20, 18, 15, .16); transition: background .3s, color .3s, transform .25s; }
.tabs button:hover { transform: translateY(-1px); }
.tabs button.sel { background: var(--ink); color: #fff; }
.tabs button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

.call { position: absolute; left: 22px; top: 50%; transform: translateY(-50%); width: min(360px, 42%); background: #fff; border-radius: 26px; padding: 18px; box-shadow: 0 30px 60px rgba(20, 18, 15, .28); }
.inner { display: flex; flex-direction: column; gap: 10px; }
.ch { display: flex; align-items: center; justify-content: space-between; }
.live { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--mint-i); }
.live i { width: 9px; height: 9px; border-radius: 50%; background: var(--mint-i); animation: blink 1.4s ease infinite; }
@keyframes blink { 50% { opacity: .35; } }
.wave { display: inline-flex; align-items: center; gap: 3px; height: 22px; }
.wave u { display: block; width: 4px; border-radius: 4px; background: var(--lav-i); animation: wv 1s ease-in-out infinite; }
.wave u:nth-child(1) { height: 8px; animation-delay: -.2s; }
.wave u:nth-child(2) { height: 18px; animation-delay: -.5s; }
.wave u:nth-child(3) { height: 12px; animation-delay: -.1s; }
.wave u:nth-child(4) { height: 20px; animation-delay: -.7s; }
.wave u:nth-child(5) { height: 10px; animation-delay: -.35s; }
@keyframes wv { 50% { transform: scaleY(.35); } }

.data { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.data small, .line small, .out small { font-size: 10px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.data b { padding: 4px 12px; border-radius: 99px; background: var(--sky); color: var(--sky-i); font-size: 11.5px; }

.line { padding: 10px 14px; border-radius: 18px; max-width: 92%; }
.line p { margin: 3px 0 0; font-size: 12.5px; line-height: 1.5; }
.line.ai { background: var(--lav); border-top-left-radius: 6px; }
.line.me { align-self: flex-end; background: var(--mint); border-top-right-radius: 6px; }
.line.me small { color: #4d8b6b; }
.out { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 18px; background: var(--butter); color: var(--butter-i); }
.out svg { flex: none; width: 26px; height: 26px; padding: 6px; border-radius: 50%; background: #fff; }
.out small { display: block; color: var(--butter-i); }
.out b { font-size: 13px; }

/* the call plays out line by line */
.on .line, .on .out, .on .data { animation: up .55s cubic-bezier(.3, .8, .3, 1) both; }
.on .data { animation-delay: .1s; }
.on .ai { animation-delay: .5s; }
.on .me { animation-delay: 1.8s; }
.on .out { animation-delay: 3s; }
@keyframes up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

.note { margin: 26px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 900px) {
  .hero { height: 320px; }
  .tabs { position: static; max-width: none; margin-top: 14px; justify-content: center; }
  .tabs button { box-shadow: none; background: #f1eff8; }
  .tabs button.sel { background: var(--ink); }
  .call { position: relative; inset-inline: auto; right: auto; top: auto; left: auto; transform: none; width: min(420px, 100%); margin: -64px auto 0; }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .hero { border-radius: 28px; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .on .line, .on .out, .on .data, .live i, .wave u { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
