<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhyAutomateSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0); // 0..4 reveal each day, 5 outcomes, 6 hold
let timer = null;
let io = null;
let reduce = false;
const LAST = 8;

const base = "/saptivo/images/features/";
const photo = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";
const photoOk = ref(true);

const days = [
  { d: "Mon", why: "Busy", res: "Follow-up missed", ok: false },
  { d: "Tue", why: "On leave", res: "Lead waits", ok: false },
  { d: "Wed", why: "New to the job", res: "Step skipped", ok: false },
  { d: "Thu", why: "Busy", res: "Reply 2 days late", ok: false },
  { d: "Fri", why: "Catching up", res: "Done, but late", ok: false },
];

const msgs = ["Enquiry received", "Quotation sent", "Visit reminder", "Thank-you note"];

function advance() {
  step.value = step.value < LAST - 1 ? step.value + 1 : 0;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(advance, 1100);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    step.value = 6;
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
  <section ref="root" class="wa" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <span class="eyebrow">Benefits</span>
        <h2><span class="l1">Why automate</span> <span class="l2">your CRM workflows</span></h2>
        <p>
          Manual processes break when people are busy, on leave or new to the job. Automations run the same way every
          time. They make response times faster, keep customers informed and free your team to spend their time on
          conversations instead of admin.
        </p>
      </header>

      <!-- week -->
      <div class="weekwrap">
        <div class="week" role="img" aria-label="A week of follow-ups: done by hand they slip when people are busy, on leave or new; automated they run the same way every day">
          <div class="cols">
            <span class="corner"></span>
            <span v-for="(c, i) in days" :key="c.d" class="dh" :class="{ now: step === i }">{{ c.d }}</span>
          </div>

          <!-- manual lane -->
          <div class="lane manual">
            <div class="lb"><b>By hand</b><span>Depends on who is free</span></div>
            <div v-for="(c, i) in days" :key="c.d" class="cell">
              <Transition name="pop">
                <div v-if="step >= i" class="box bad">
                  <em>{{ c.why }}</em>
                  <strong>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    {{ c.res }}
                  </strong>
                </div>
              </Transition>
            </div>
          </div>

          <!-- automated lane -->
          <div class="lane auto">
            <div class="lb"><b>Automated</b><span>Same steps every time</span></div>
            <div v-for="(c, i) in days" :key="c.d" class="cell">
              <Transition name="pop">
                <div v-if="step >= i" class="box good">
                  <em>{{ c.why }}? No problem</em>
                  <strong>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                    Ran on time
                  </strong>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <!-- outcomes -->
      <ul class="out" :class="{ go: step >= 5 }">
        <li class="oc tone-sky">
          <span class="no">1</span>
          <h3>Response times get faster</h3>
          <div class="cmp">
            <div class="rowc">
              <span>By hand</span>
              <div class="track"><i class="slow"></i></div>
              <b>2 days</b>
            </div>
            <div class="rowc">
              <span>Automated</span>
              <div class="track"><i class="fast"></i></div>
              <b>2 min</b>
            </div>
          </div>
          <small>Example figures</small>
        </li>

        <li class="oc tone-mint">
          <span class="no">2</span>
          <h3>Customers are kept informed</h3>
          <ul class="ms">
            <li v-for="(m, i) in msgs" :key="m" :style="{ '--i': i }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>{{ m }}
            </li>
          </ul>
        </li>

        <li class="oc photo">
          <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
          <div class="shade"></div>
          <span class="no w">3</span>
          <div class="cap">
            <h3>Your team spends time on conversations, not admin</h3>
            <span class="glass">Admin handled by automation</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.wa {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #fff 0%, #f8f6ff 100%);
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--butter); color: var(--butter-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.wa h2 .l1 { color: #111111 !important; opacity: 1; }
.wa h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .weekwrap, .out { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .weekwrap, .in .out { opacity: 1; transform: none; }
.in .weekwrap { transition-delay: .1s; }
.in .out { transition-delay: .2s; }

/* week */
.weekwrap { overflow-x: auto; padding-bottom: 6px; }
.week { min-width: 760px; background: #fff; border: 1px solid var(--line); border-radius: 28px; box-shadow: 0 24px 60px rgba(60, 50, 120, .1); padding: 18px; display: flex; flex-direction: column; gap: 12px; }
.cols, .lane { display: grid; grid-template-columns: 150px repeat(5, 1fr); gap: 10px; align-items: stretch; }
.dh { text-align: center; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); padding: 8px 0; border-radius: 12px; background: #f8f7fc; transition: all .35s; }
.dh.now { background: var(--ink); color: #fff; }
.lane { padding: 10px; border-radius: 20px; }
.lane.manual { background: #fff7f9; }
.lane.auto { background: #f2fbf6; }
.lb { display: flex; flex-direction: column; justify-content: center; gap: 2px; }
.lb b { font-size: 15px; }
.lb span { font-size: 11.5px; color: var(--muted); line-height: 1.4; }
.cell { min-height: 84px; display: flex; }
.box { flex: 1; border-radius: 16px; padding: 10px 12px; display: flex; flex-direction: column; justify-content: center; gap: 6px; background: #fff; border: 1px solid var(--line); }
.box em { font-style: normal; font-size: 11px; font-weight: 600; color: var(--muted); }
.box strong { display: flex; align-items: center; gap: 7px; font-size: 12.5px; line-height: 1.3; }
.box svg { width: 20px; height: 20px; padding: 4px; border-radius: 50%; flex: none; color: #fff; }
.bad { border-color: #f4c9d6; }
.bad strong { color: var(--rose-i); }
.bad svg { background: var(--rose-i); }
.good { border-color: #bfe6d1; }
.good strong { color: var(--mint-i); }
.good svg { background: var(--mint-i); }

/* outcomes */
.out { list-style: none; margin: 22px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.oc { position: relative; border-radius: 26px; padding: 22px; display: flex; flex-direction: column; gap: 14px; min-height: 280px; border: 1px solid var(--line); overflow: hidden; }
.tone-sky { background: #f3f9ff; --ti: var(--sky-i); --t: var(--sky); }
.tone-mint { background: #f2fbf6; --ti: var(--mint-i); --t: var(--mint); }
.no { width: 28px; height: 28px; border-radius: 50%; background: var(--t); color: var(--ti); font-size: 12px; font-weight: 700; display: grid; place-items: center; }
.no.w { background: rgba(255, 255, 255, .85); color: var(--ink); position: absolute; top: 22px; left: 22px; z-index: 2; }
.oc h3 { margin: 0; font-size: 18px; line-height: 1.4; font-weight: 600; letter-spacing: -.01em; }
.oc small { margin-top: auto; font-size: 11px; color: var(--muted); }

.cmp { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }
.rowc { display: grid; grid-template-columns: 74px 1fr auto; align-items: center; gap: 10px; font-size: 12px; }
.rowc span { color: var(--muted); font-weight: 500; }
.rowc b { font-size: 13px; min-width: 52px; text-align: right; }
.track { height: 12px; border-radius: 99px; background: #fff; overflow: hidden; }
.track i { display: block; height: 100%; width: 0; border-radius: 99px; transition: width 1.2s ease; }
.slow { background: var(--rose-i); }
.fast { background: var(--mint-i); }
.out.go .slow { width: 92%; }
.out.go .fast { width: 6%; }

.ms { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.ms li { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 14px; padding: 10px 12px; font-size: 13px; font-weight: 500; opacity: .35; transform: translateX(-6px); transition: all .45s ease; transition-delay: calc(var(--i) * .25s); }
.ms svg { width: 20px; height: 20px; padding: 4px; border-radius: 50%; background: var(--mint-i); color: #fff; flex: none; }
.out.go .ms li { opacity: 1; transform: none; }

.photo { padding: 0; background: linear-gradient(135deg, #e8e3ff, #dcecfb 55%, #d3f0e1); justify-content: flex-end; }
.photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 22%; }
.photo .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, 0) 35%, rgba(20, 18, 15, .68) 100%); }
.cap { position: relative; z-index: 1; padding: 22px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.cap h3 { color: #fff; }
.glass { font-size: 12px; font-weight: 600; padding: 7px 14px; border-radius: 99px; background: rgba(255, 255, 255, .85); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }

.pop-enter-active { transition: all .45s cubic-bezier(.2, 1.3, .4, 1); }
.pop-enter-from { opacity: 0; transform: scale(.9) translateY(8px); }

@media (max-width: 960px) {
  .out { grid-template-columns: 1fr; max-width: 520px; margin-left: auto; margin-right: auto; }
  .oc { min-height: 0; }
  .photo { min-height: 300px; }
}
@media (max-width: 560px) {
  .wa { padding: 64px 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .weekwrap, .out { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
