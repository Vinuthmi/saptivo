<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AiCallsUseCasesSection" });

const root = ref(null);
const shown = ref(false);
const live = ref(false);
let io = null;

const base = "/saptivo/images/features/";
const photos = [
  base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
  base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
  base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
  base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG",
  base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg",
  base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
];
const ok = ref([true, true, true, true, true, true]);

const cases = [
  { k: "appt", tone: "lav", who: "Dilani", head: "Appointment and service visit reminders", rest: ": confirm, reschedule or request a callback" },
  { k: "pay", tone: "rose", who: "Ravi", head: "Payment reminders before and after a due date,", rest: " including recurring payments that failed" },
  { k: "amc", tone: "sky", who: "Malini", head: "AMC renewal calls", rest: " ahead of contract expiry" },
  { k: "ord", tone: "mint", who: "Kasun", head: "Order and job status updates", rest: "" },
  { k: "lead", tone: "butter", who: "Hasitha", head: "Lead qualification calls for new enquiries", rest: " from your website or Facebook" },
  { k: "csat", tone: "lav", who: "Sewwandi", head: "Customer satisfaction surveys", rest: " after a ticket or service visit" },
];

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        live.value = true;
      } else live.value = false;
    },
    { threshold: 0.15 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="uc" :class="{ in: shown, live }">
    <div class="wrap">
      <header class="head">
        <h2><span>What AI calls</span> <span class="soft">can do with Saptivo</span></h2>
      </header>

      <ul class="grid">
        <li v-for="(c, i) in cases" :key="c.k" class="card" :class="'tone-' + c.tone" :style="{ '--d': i * 70 + 'ms' }">
          <div class="top">
            <span class="av">
              <img v-if="ok[i]" :src="photos[i]" alt="" @error="ok[i] = false" />
              <b v-else>{{ c.who[0] }}</b>
            </span>
            <span class="call"><i></i><i></i><i></i><i></i>AI call</span>
          </div>

          <h3>{{ c.head }}<span>{{ c.rest }}</span></h3>

          <div class="mini" aria-hidden="true">
            <!-- 1 appointment -->
            <template v-if="c.k === 'appt'">
              <p class="line">Tomorrow, 10:00 am · AC service</p>
              <div class="chips">
                <span class="ch a1">Confirm</span>
                <span class="ch a2">Reschedule</span>
                <span class="ch a3">Request callback</span>
              </div>
            </template>

            <!-- 2 payments -->
            <template v-else-if="c.k === 'pay'">
              <div class="time">
                <span class="tp b1">Before due</span>
                <span class="tp b2">Due date</span>
                <span class="tp b3">After due</span>
              </div>
              <p class="line retry"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5" /></svg>Failed recurring payment · retry</p>
            </template>

            <!-- 3 AMC -->
            <template v-else-if="c.k === 'amc'">
              <p class="line">Contract SC-204 · expires in 30 days</p>
              <div class="bar"><i class="grow"></i></div>
              <span class="pill pop">Renewal call placed</span>
            </template>

            <!-- 4 order status -->
            <template v-else-if="c.k === 'ord'">
              <div class="steps">
                <span class="sp s1">Packed</span>
                <span class="sp s2">Dispatched</span>
                <span class="sp s3">Delivered</span>
              </div>
              <p class="line">Order #1042 · status read out to the customer</p>
            </template>

            <!-- 5 lead -->
            <template v-else-if="c.k === 'lead'">
              <div class="chips">
                <span class="ch l1">Website</span>
                <span class="ch l2">Facebook</span>
              </div>
              <div class="bar"><i class="grow g2"></i></div>
              <span class="pill pop p2">Qualified · hot lead</span>
            </template>

            <!-- 6 csat -->
            <template v-else>
              <div class="stars">
                <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" :style="{ animationDelay: n * 0.3 + 's' }"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></svg>
              </div>
              <p class="line">“How was your service visit?”</p>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.uc {
  --ink: #17191d; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #fff 0%, #f8f6ff 100%);
  padding: 88px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 760px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--butter); color: var(--butter-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; color: #33485d; text-wrap: balance; }
h2 span { display: block; }
h2 span:first-child { color: #727a85; }

.head, .card { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .card { opacity: 1; transform: none; }
.in .card { transition-delay: calc(.1s + var(--d)); }

.grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); --tb: #fff5f8; }
.card { background: var(--tb); border: 1px solid var(--line); border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.top { display: flex; align-items: center; justify-content: space-between; }
.av { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; background: var(--t); color: var(--ti); display: grid; place-items: center; font-weight: 700; flex: none; border: 3px solid #fff; box-sizing: border-box; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.call { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 600; background: #fff; color: var(--ti); padding: 6px 12px 6px 10px; border-radius: 99px; }
.call i { width: 3px; border-radius: 2px; background: var(--ti); height: 6px; margin-right: 0; animation: eq .8s ease-in-out infinite alternate; animation-play-state: paused; }
.call i:nth-child(2) { animation-delay: .15s; }
.call i:nth-child(3) { animation-delay: .3s; }
.call i:nth-child(4) { animation-delay: .45s; margin-right: 6px; }
.live .call i { animation-play-state: running; }
@keyframes eq { from { height: 4px; } to { height: 13px; } }

h3 { margin: 0; font-size: 16.5px; line-height: 1.45; font-weight: 600; letter-spacing: -.01em; }
h3 span { font-weight: 400; color: var(--muted); }

.mini { margin-top: auto; background: #fff; border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 10px; min-height: 112px; justify-content: center; }
.mini * { animation-play-state: paused; }
.live .mini * { animation-play-state: running; }
.line { margin: 0; font-size: 12px; color: var(--muted); line-height: 1.5; }
.line.retry { display: flex; align-items: center; gap: 6px; color: var(--rose-i); font-weight: 600; }
.line.retry svg { width: 14px; height: 14px; flex: none; }

/* chips cycling (3 states, 6s loop) */
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.ch, .tp, .sp { font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 99px; background: #f3f1fa; color: var(--muted); animation: on3 6s infinite; }
.a2, .b2, .s2 { animation-delay: 2s; }
.a3, .b3, .s3 { animation-delay: 4s; }
@keyframes on3 {
  0%, 28% { background: var(--ti); color: #fff; }
  33%, 100% { background: #f3f1fa; color: #666b73; }
}
.l1, .l2 { animation: on2 4s infinite; }
.l2 { animation-delay: 2s; }
@keyframes on2 {
  0%, 45% { background: var(--ti); color: #fff; }
  50%, 100% { background: #f3f1fa; color: #666b73; }
}
.time, .steps { display: flex; flex-wrap: wrap; gap: 6px; }

/* progress */
.bar { height: 8px; border-radius: 99px; background: #f1f0f6; overflow: hidden; }
.grow { display: block; height: 100%; border-radius: 99px; background: var(--ti); animation: grow 5s ease-in-out infinite; }
.g2 { animation-duration: 4s; }
@keyframes grow { 0% { width: 8%; } 65%, 90% { width: 90%; } 100% { width: 8%; } }
.pill { align-self: flex-start; font-size: 11px; font-weight: 600; background: var(--t); color: var(--ti); padding: 5px 12px; border-radius: 99px; animation: pill 5s infinite; }
.p2 { animation-duration: 4s; }
@keyframes pill { 0%, 55% { opacity: 0; transform: translateY(4px); } 70%, 92% { opacity: 1; transform: none; } 100% { opacity: 0; } }

/* stars */
.stars { display: flex; gap: 4px; }
.stars svg { width: 24px; height: 24px; fill: #e6e3ee; animation: star 4.5s infinite; }
@keyframes star { 0%, 8% { fill: #e6e3ee; } 20%, 80% { fill: #f2b01e; } 95%, 100% { fill: #e6e3ee; } }

@media (max-width: 960px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 620px) {
  .uc { padding: 64px 16px; }
  .grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .card { opacity: 1; transform: none; transition: none; }
  .call i, .ch, .tp, .sp, .grow, .pill, .stars svg { animation: none; }
  .a1, .b1, .s1, .l1 { background: var(--ti); color: #fff; }
  .grow { width: 90%; }
  .pill { opacity: 1; }
  .stars svg { fill: #f2b01e; }
  * { transition-duration: 0s !important; }
}
</style>
