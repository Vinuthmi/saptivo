<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "MarketingInCrmSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const sub = computed(() => (reduce ? 9 : n.value % 12));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1000);
}
function stop() {
  clearInterval(timer);
  timer = null;
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
  <section ref="root" class="mc" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Why run marketing</span> <span class="l2">inside your CRM</span></h2>
        <p>
          Separate marketing tools need lists exported and re-imported, and they never know what happened after the
          click. Inside Saptivo, a campaign reply becomes a lead, a lead becomes a deal and the deal shows which
          campaign started it. Your marketing reports finally show revenue, not just opens.
        </p>
      </header>

      <div class="stage">
        <!-- separate tools -->
        <article class="side bad">
          <span class="lb">Separate marketing tools</span>
          <ul>
            <li :class="{ on: sub >= 0 }"><b>Campaign sent</b><small>In the email tool</small></li>
            <li :class="{ on: sub >= 1 }"><b>List exported</b><small>contacts.csv</small></li>
            <li :class="{ on: sub >= 2 }"><b>List re-imported</b><small>Into the CRM, by hand</small></li>
            <li class="gap" :class="{ on: sub >= 3 }"><b>What happened after the click?</b><small>Nobody knows</small></li>
          </ul>
          <div class="rep">
            <span>Report</span>
            <div class="bar"><i :style="{ width: sub >= 3 ? '70%' : '0%' }"></i></div>
            <small>Opens only</small>
          </div>
        </article>

        <!-- inside saptivo -->
        <article class="side good">
          <span class="lb">Inside Saptivo</span>
          <div class="chain">
            <div class="line"><i :style="{ height: Math.min(100, Math.max(0, sub - 3) * 25) + '%' }"></i></div>

            <div class="st" :class="{ on: sub >= 4 }">
              <span class="dot"></span>
              <div class="cd">
                <small>Campaign reply</small>
                <b>"Yes, please book it"</b>
                <em>Service reminder · WhatsApp</em>
              </div>
            </div>

            <div class="st" :class="{ on: sub >= 5 }">
              <span class="dot"></span>
              <div class="cd who">
                <span class="av"><img v-if="ok" :src="photo" alt="" @error="ok = false" /><b v-else>D</b></span>
                <div><small>Lead</small><b>Dilani Perera</b></div>
              </div>
            </div>

            <div class="st" :class="{ on: sub >= 6 }">
              <span class="dot"></span>
              <div class="cd">
                <small>Deal</small>
                <b>AMC renewal · LKR 85,000</b>
                <em class="src" :class="{ on: sub >= 7 }">Started by Service reminder</em>
              </div>
            </div>
          </div>

          <div class="rep" :class="{ on: sub >= 8 }">
            <div class="rw"><span>Opens</span><div class="bar"><i :style="{ width: sub >= 8 ? '32%' : '0%' }"></i></div><b>31.6%</b></div>
            <div class="rw"><span>Revenue</span><div class="bar r"><i :style="{ width: sub >= 8 ? '100%' : '0%' }"></i></div><b>LKR 1.9M</b></div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mc {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.mc *, .mc *::before, .mc *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 840px; margin: 0 auto 52px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.mc h2 .l1 { color: #111111 !important; opacity: 1; }
.mc h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .08s; }

.stage { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 20px; align-items: stretch; }
.side { border-radius: 28px; padding: 26px; display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.bad { background: #f4f5f7; }
.good { background: var(--lav); }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

/* separate tools */
.bad ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.bad li { display: flex; flex-direction: column; gap: 2px; padding: 14px 16px; border-radius: 14px; background: #fff; opacity: .3; transform: translateY(6px); transition: all .4s; }
.bad li.on { opacity: 1; transform: none; }
.bad li b { font-size: 14px; font-weight: 500; }
.bad li small { font-size: 12px; color: var(--muted); }
.bad li.gap { background: transparent; border: 1.5px dashed #c9ccd2; }
.bad li.gap b { color: var(--muted); }
.rep { margin-top: auto; display: flex; flex-direction: column; gap: 8px; background: #fff; border-radius: 16px; padding: 14px 16px; font-size: 12.5px; color: var(--muted); }
.bar { height: 8px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.bar i { display: block; height: 100%; background: #b9bec6; border-radius: 4px; transition: width 1s cubic-bezier(.2, .8, .2, 1); }

/* inside saptivo */
.chain { position: relative; display: flex; flex-direction: column; gap: 14px; padding-left: 30px; }
.line { position: absolute; left: 7px; top: 14px; bottom: 14px; width: 1.5px; background: rgba(20, 18, 15, .12); }
.line i { display: block; width: 100%; background: var(--ink); transition: height .8s ease; }
.st { position: relative; opacity: .3; transform: translateY(6px); transition: all .4s; }
.st.on { opacity: 1; transform: none; }
.dot { position: absolute; left: -30px; top: 18px; width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 1.5px solid #c8c3e3; transition: all .4s; }
.st.on .dot { background: var(--ink); border-color: var(--ink); }
.cd { background: #fff; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 3px; }
.cd small { font-size: 11.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.cd b { font-size: 14.5px; font-weight: 500; }
.cd em { align-self: flex-start; font-style: normal; font-size: 11.5px; font-weight: 600; color: var(--lav-i); background: var(--lav); padding: 3px 10px; border-radius: 6px; margin-top: 4px; }
.cd em.src { background: #f1f2f4; color: var(--muted); transition: all .4s; }
.cd em.src.on { background: var(--mint); color: var(--mint-i); }
.who { flex-direction: row; align-items: center; gap: 12px; }
.who div { display: flex; flex-direction: column; }
.av { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.good .rep { opacity: .35; transition: opacity .5s; gap: 12px; }
.good .rep.on { opacity: 1; }
.rw { display: grid; grid-template-columns: 64px 1fr 76px; align-items: center; gap: 12px; }
.rw b { text-align: right; color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.rw .bar i { background: #b8aef0; }
.rw .bar.r i { background: var(--mint-i); }

@media (max-width: 900px) {
  .stage { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .mc { padding: 64px 16px; }
  .side { padding: 18px; border-radius: 22px; }
  .rw { grid-template-columns: 56px 1fr 70px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
