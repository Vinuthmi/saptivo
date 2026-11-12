<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "BuildWorkflowSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photos = [
  base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
  base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG",
];
const ok = ref([true, true]);

const steps = [
  { tone: "lav", t: "Choose a trigger, such as a new lead from Facebook" },
  { tone: "butter", t: "Add conditions, such as location equals Colombo" },
  { tone: "mint", t: "Add actions, such as assign to the Colombo team and send a WhatsApp welcome" },
  { tone: "sky", t: "Test it on a sample record, then switch it on" },
  { tone: "rose", t: "Review the run history to confirm it works as expected" },
];

const checks = ["Trigger matched: new Facebook lead", "Condition true: location is Colombo", "Assigned to the Colombo team", "WhatsApp welcome sent"];

function next() {
  step.value = (step.value + 1) % steps.length;
}
function pick(i) {
  manual.value = true;
  stop();
  step.value = i;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 4200);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    step.value = 4;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.25 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="bw" :class="{ in: shown }">
    <div class="wrap">
      <!-- steps -->
      <div class="copy">
        <span class="eyebrow">Step by step</span>
        <h2><span class="l1">How to build</span> <span class="l2">a workflow</span></h2>

        <ol class="steps" :style="{ '--p': step / (steps.length - 1) }">
          <li v-for="(s, i) in steps" :key="s.t" :class="['tone-' + s.tone, { act: step === i, done: step > i, run: step === i && !manual }]">
            <button type="button" @click="pick(i)">
              <span class="dot">
                <svg v-if="step > i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                <template v-else>{{ i + 1 }}</template>
              </span>
              <span class="tx">{{ s.t }}</span>
              <span class="prog"><i></i></span>
            </button>
          </li>
        </ol>
      </div>

      <!-- builder -->
      <div class="vis" role="img" aria-label="A workflow being built: trigger, condition, actions, test, switch on and run history">
        <div class="win">
          <div class="bar">
            <i></i><i></i><i></i>
            <span class="name">New Facebook lead: Colombo</span>
            <span class="state" :class="{ tested: step === 3, on: step >= 4 }">{{ step >= 4 ? "Active" : step === 3 ? "Tested" : "Draft" }}</span>
          </div>

          <div class="flow">
            <!-- trigger -->
            <div class="blk tone-lav" :class="{ fresh: step === 0 }">
              <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg></span>
              <div><small>Trigger</small><strong>New lead from Facebook</strong></div>
            </div>

            <!-- condition -->
            <Transition name="drop">
              <div v-if="step >= 1" class="join"><i></i></div>
            </Transition>
            <Transition name="drop">
              <div v-if="step >= 1" class="blk tone-butter" :class="{ fresh: step === 1 }">
                <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v6a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v4M6 3 3 6M6 3l3 3" /></svg></span>
                <div><small>If</small><strong>Location equals Colombo</strong></div>
              </div>
            </Transition>

            <!-- actions -->
            <Transition name="drop">
              <div v-if="step >= 2" class="join"><i></i></div>
            </Transition>
            <Transition name="drop">
              <div v-if="step >= 2" class="acts" :class="{ fresh: step === 2 }">
                <div class="blk tone-mint">
                  <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 11a4 4 0 1 0-8 0M4 20a8 8 0 0 1 16 0" /></svg></span>
                  <div class="grow"><small>Then</small><strong>Assign to the Colombo team</strong></div>
                  <span class="avs">
                    <span class="av"><img v-if="ok[0]" :src="photos[0]" alt="" @error="ok[0] = false" /><b v-else>D</b></span>
                    <span class="av"><img v-if="ok[1]" :src="photos[1]" alt="" @error="ok[1] = false" /><b v-else>K</b></span>
                  </span>
                </div>
                <div class="blk tone-mint">
                  <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.3-4.2A8 8 0 1 1 8.3 19z" /></svg></span>
                  <div class="grow"><small>And</small><strong>Send a WhatsApp welcome</strong></div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- test / live -->
          <Transition name="fade" mode="out-in">
            <div v-if="step === 3" key="test" class="panel test">
              <div class="ph"><strong>Test on a sample record</strong><span>Sample lead · Dilani Perera · Colombo</span></div>
              <ul>
                <li v-for="(c, i) in checks" :key="c" :style="{ '--i': i }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>{{ c }}
                </li>
              </ul>
            </div>
            <div v-else-if="step === 4" key="live" class="panel live">
              <div class="sw"><span>Workflow on</span><i class="tog"></i></div>
              <div class="ph"><strong>Run history</strong><span>Confirm it works as expected</span></div>
              <div class="runrow">
                <span class="d"></span>
                <div><strong>Run #4825 · New Facebook lead</strong><small>Colombo team assigned · WhatsApp welcome sent</small></div>
                <em>Success</em>
              </div>
            </div>
            <div v-else key="idle" class="panel idle">
              {{ step === 0 ? "Pick what starts the workflow." : step === 1 ? "Decide who it applies to." : "Choose what happens next." }}
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bw {
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
.wrap { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.05fr; gap: 56px; align-items: center; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--lav); color: var(--lav-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 30px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; }
h2 span { display: block; }
.bw h2 .l1 { color: #111111 !important; opacity: 1; }
.bw h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.copy, .vis { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .copy, .in .vis { opacity: 1; transform: none; }
.in .vis { transition-delay: .12s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); --tb: #fff5f8; }

/* steps */
.steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; position: relative; }
.steps::before { content: ""; position: absolute; left: 31px; top: 36px; bottom: 36px; width: 3px; border-radius: 3px; background: #e9e6f2; }
.steps::after { content: ""; position: absolute; left: 31px; top: 36px; width: 3px; border-radius: 3px; background: var(--ink); height: calc((100% - 72px) * var(--p)); transition: height .7s ease; }
.steps button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; display: flex; align-items: center; gap: 16px; padding: 14px 18px 14px 14px; border-radius: 20px; border: 1px solid var(--line); background: #fff; position: relative; z-index: 1; overflow: hidden; transition: background .35s, border-color .35s, transform .35s; }
.steps button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.dot { flex: none; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; font-size: 14px; font-weight: 700; background: #fff; color: var(--muted); border: 3px solid #e9e6f2; transition: all .4s; }
.dot svg { width: 16px; height: 16px; }
.tx { font-size: 15px; line-height: 1.5; font-weight: 500; color: var(--muted); transition: color .3s; }
.steps li.act button { background: var(--tb); border-color: var(--ti); transform: translateX(6px); }
.steps li.act .dot { background: var(--t); border-color: var(--ti); color: var(--ti); }
.steps li.act .tx { color: var(--ink); }
.steps li.done .dot { background: var(--ink); border-color: var(--ink); color: #fff; }
.steps li.done .tx { color: var(--ink); }
.prog { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; }
.prog i { display: block; width: 0; height: 100%; background: var(--ink); }
.steps li.act:not(.run) .prog i { width: 100%; }
.steps li.act.run .prog i { animation: fill 4.2s linear forwards; }
@keyframes fill { to { width: 100%; } }

/* builder */
.vis { position: relative; }
.vis::before { content: ""; position: absolute; inset: 22px -14px -14px 22px; background: linear-gradient(160deg, #ece7ff, #e1f0ff 60%, #def5e9); border-radius: 36px; }
.win { position: relative; background: #fff; border: 1px solid var(--line); border-radius: 26px; box-shadow: 0 28px 70px rgba(60, 50, 120, .16); overflow: hidden; }
.bar { display: flex; align-items: center; gap: 6px; padding: 12px 18px; background: #faf9ff; border-bottom: 1px solid var(--line); }
.bar > i { width: 10px; height: 10px; border-radius: 50%; background: #e3e0ee; }
.name { margin-left: 12px; font-size: 13px; font-weight: 600; }
.state { margin-left: auto; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 99px; background: var(--butter); color: var(--butter-i); transition: all .4s; }
.state.tested { background: var(--sky); color: var(--sky-i); }
.state.on { background: var(--mint); color: var(--mint-i); }

.flow { padding: 22px 20px 8px; display: flex; flex-direction: column; align-items: stretch; min-height: 330px; background-image: radial-gradient(circle, #e1deee 1px, transparent 1.4px); background-size: 20px 20px; }
.blk { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 11px 14px; box-shadow: 0 8px 22px rgba(60, 50, 120, .08); transition: border-color .35s, box-shadow .35s; }
.blk.fresh, .acts.fresh .blk { border-color: var(--ti); box-shadow: 0 0 0 3px var(--t), 0 12px 26px rgba(60, 50, 120, .12); }
.acts.fresh .blk { --ti: var(--mint-i); --t: var(--mint); }
.ic svg { width: 34px; height: 34px; padding: 8px; border-radius: 11px; background: var(--t); color: var(--ti); display: block; }
.blk small { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.blk strong { font-size: 13.5px; }
.grow { flex: 1; }
.acts { display: flex; flex-direction: column; gap: 8px; }
.join { align-self: center; width: 2px; height: 18px; background: repeating-linear-gradient(180deg, #b9b4d3 0 4px, transparent 4px 8px); }
.avs { display: flex; }
.av { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-size: 11px; font-weight: 700; border: 2px solid #fff; margin-left: -8px; }
.av:first-child { margin-left: 0; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.panel { margin: 12px 20px 20px; border-radius: 18px; padding: 14px 16px; min-height: 130px; }
.panel.idle { display: grid; place-items: center; text-align: center; font-size: 13px; color: var(--muted); background: #f8f7fc; border: 1.5px dashed #d9d6e8; }
.ph { display: flex; flex-direction: column; gap: 1px; margin-bottom: 10px; }
.ph strong { font-size: 13px; }
.ph span { font-size: 11.5px; color: var(--muted); }
.test { background: #f3f9ff; }
.test ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.test li { display: flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 500; opacity: 0; animation: rise .4s ease both; animation-delay: calc(.2s + var(--i) * .5s); }
.test li svg { width: 18px; height: 18px; padding: 3px; border-radius: 50%; background: var(--sky-i); color: #fff; flex: none; }
@keyframes rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.live { background: #f2fbf6; display: flex; flex-direction: column; gap: 4px; }
.sw { display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 600; background: var(--ink); color: #fff; padding: 9px 14px; border-radius: 99px; margin-bottom: 8px; }
.tog { width: 38px; height: 22px; border-radius: 99px; background: #5ee0a0; position: relative; }
.tog::after { content: ""; position: absolute; right: 3px; top: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; }
.runrow { display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 14px; padding: 10px 12px; animation: rise .45s ease .3s both; }
.runrow .d { width: 10px; height: 10px; border-radius: 50%; background: var(--mint-i); flex: none; }
.runrow div { flex: 1; min-width: 0; }
.runrow strong { display: block; font-size: 12.5px; }
.runrow small { font-size: 11px; color: var(--muted); }
.runrow em { font-style: normal; font-size: 11px; font-weight: 700; background: var(--mint); color: var(--mint-i); padding: 4px 11px; border-radius: 99px; }

.drop-enter-active { transition: all .5s cubic-bezier(.2, 1.4, .4, 1); }
.drop-enter-from { opacity: 0; transform: translateY(-14px) scale(.96); }
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 960px) {
  .wrap { grid-template-columns: 1fr; gap: 48px; }
  .steps li.act button { transform: none; }
}
@media (max-width: 560px) {
  .bw { padding: 64px 16px; }
  .steps::before, .steps::after { left: 29px; }
  .tx { font-size: 14px; }
  .vis::before { inset: 16px -8px -10px 12px; }
  .flow { padding: 16px 12px 6px; }
  .panel { margin: 10px 12px 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .copy, .vis { opacity: 1; transform: none; transition: none; }
  .test li, .runrow { animation: none; opacity: 1; }
  .steps li.act.run .prog i { animation: none; width: 100%; }
  * { transition-duration: 0s !important; }
}
</style>
