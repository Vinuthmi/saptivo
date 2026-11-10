<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "TriggerAiCallsSection" });

const root = ref(null);
const shown = ref(false);
const wf = ref(0);
const ph = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;
const END = 7;

const base = "/saptivo/images/features/";
const photoOk = ref([true, true, true]);

const flows = [
  {
    tone: "lav",
    trigger: "Service visit due in 2 days",
    agent: "Visit reminder agent",
    count: 14,
    who: "Customers with a booked service visit",
    when: "2 days before the visit · 10 am to 5 pm",
    script: "Confirm, reschedule or request a callback",
    caller: "Dilani Perera",
    photo: base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
    result: "Visit confirmed",
  },
  {
    tone: "rose",
    trigger: "Invoice 3 days overdue",
    agent: "Payment reminder agent",
    count: 8,
    who: "Customers with an unpaid invoice",
    when: "3 days after the due date · weekdays 9 am to 6 pm",
    script: "Polite reminder, then send a payment link",
    caller: "Ravi Fernando",
    photo: base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
    result: "Promise to pay · Friday",
  },
  {
    tone: "sky",
    trigger: "AMC expiring in 30 days",
    agent: "Renewal agent",
    count: 5,
    who: "Customers with an active AMC contract",
    when: "30 days before expiry · weekdays 10 am to 4 pm",
    script: "Renewal offer and quote request",
    caller: "Hasitha Traders",
    photo: base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg",
    result: "Quote requested",
  },
];

const cur = computed(() => flows[wf.value]);

function advance() {
  if (ph.value < END) ph.value++;
  else if (!manual.value) {
    wf.value = (wf.value + 1) % flows.length;
    ph.value = 0;
  }
}
function pick(i) {
  manual.value = true;
  wf.value = i;
  ph.value = 0;
  start();
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(advance, 1500);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    ph.value = END;
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
  <section ref="root" class="tg" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <div class="head-copy">
          <h2><span class="l1">Trigger AI calls</span> <span class="l2">from Saptivo workflows</span></h2>
          <p>
            Outbound AI phone calls start from Saptivo's workflow automation. For example, a service visit due in two
            days, an invoice three days overdue or an AMC expiring in 30 days can each trigger a call from the right AI
            agent. You decide which customers are called, when and with which script.
          </p>
        </div>
        <img
          class="workflow-image"
          src="/images/features/smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG"
          alt="Customer support agent using a headset at a computer"
        />
      </header>

      <div class="board">
        <!-- workflows -->
        <ul class="flows">
          <li v-for="(f, i) in flows" :key="f.trigger" class="wf" :class="['tone-' + f.tone, { act: wf === i }]">
            <button type="button" @click="pick(i)">
              <div class="chain">
                <!-- trigger -->
                <span class="node trig" :class="{ fire: wf === i && ph >= 0 }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
                  <span><small>When</small>{{ f.trigger }}</span>
                </span>
                <i class="ln" :class="{ on: wf === i && ph >= 1 }"></i>
                <!-- agent -->
                <span class="node agent" :class="{ fire: wf === i && ph >= 3 }">
                  <b>AI</b>
                  <span><small>Then call with</small>{{ f.agent }}</span>
                </span>
              </div>

              <div class="live">
                <Transition name="fade" mode="out-in">
                  <div v-if="wf === i && ph >= 6" key="r" class="res">
                    <span class="av">
                      <img v-if="photoOk[i]" :src="f.photo" alt="" @error="photoOk[i] = false" />
                      <b v-else>{{ f.caller[0] }}</b>
                    </span>
                    <div><strong>{{ f.caller }}</strong><span class="ok">{{ f.result }}</span></div>
                  </div>
                  <div v-else-if="wf === i && ph >= 4" key="c" class="res">
                    <span class="av">
                      <img v-if="photoOk[i]" :src="f.photo" alt="" @error="photoOk[i] = false" />
                      <b v-else>{{ f.caller[0] }}</b>
                    </span>
                    <div><strong>{{ f.caller }}</strong><span class="calling">Calling<em>.</em><em>.</em><em>.</em></span></div>
                  </div>
                  <div v-else key="q" class="queue">
                    <span class="qn">{{ wf === i && ph >= 1 ? f.count : "–" }}</span>
                    <span>{{ wf === i && ph >= 1 ? "customers match this workflow" : "Waiting for the trigger" }}</span>
                  </div>
                </Transition>
              </div>
            </button>
          </li>
        </ul>

        <!-- you decide -->
        <aside class="edit" :class="'tone-' + cur.tone">
          <div class="eh">
            <strong>You decide</strong>
            <span>{{ cur.agent }}</span>
          </div>
          <Transition name="fade" mode="out-in">
            <div :key="wf" class="fields">
              <div class="fd" :class="{ hot: ph === 1 }">
                <span class="k"><i>1</i>Which customers</span>
                <p>{{ cur.who }}</p>
              </div>
              <div class="fd" :class="{ hot: ph === 2 }">
                <span class="k"><i>2</i>When</span>
                <p>{{ cur.when }}</p>
              </div>
              <div class="fd" :class="{ hot: ph === 3 }">
                <span class="k"><i>3</i>Which script</span>
                <p>{{ cur.script }}</p>
              </div>
            </div>
          </Transition>
          <div class="sw">
            <span>Workflow active</span>
            <i class="tog"></i>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tg {
  --ink: #14120f; --ash: #8a8f97; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #f8f6ff 0%, #fff 100%);
  padding: 88px 16px;
  scroll-margin-top: 88px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { display: grid; grid-template-columns: 1.1fr .9fr; align-items: center; gap: 36px; max-width: 1120px; margin: 0 auto 40px; }
.head-copy { text-align: left; }
.workflow-image { display: block; width: 100%; height: 280px; object-fit: cover; object-position: center 42%; border-radius: 24px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--lav); color: var(--lav-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 16px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.tg h2 .l1 { color: #111111 !important; opacity: 1; }
.tg h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.7; color: var(--muted); }

.head, .board { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .12s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); --tb: #fff5f8; }

.board { display: grid; grid-template-columns: 1.25fr 1fr; gap: 20px; align-items: stretch; }
.flows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.wf { flex: 1; }
.wf button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 18px; border-radius: 22px; background: #fff; border: 1px solid var(--line); transition: background .35s, border-color .35s, transform .35s; }
.wf button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.wf.act button { background: var(--tb); border-color: var(--ti); transform: translateX(4px); }

.chain { display: flex; align-items: center; gap: 0; }
.node { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 10px 14px; font-size: 13px; font-weight: 600; line-height: 1.35; min-width: 0; transition: all .35s; }
.node small { display: block; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.node svg { width: 28px; height: 28px; padding: 6px; border-radius: 9px; background: var(--t); color: var(--ti); flex: none; }
.node b { width: 28px; height: 28px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 11px; display: grid; place-items: center; flex: none; }
.node.trig { flex: 1.2; }
.node.agent { flex: 1; }
.node.fire { border-color: var(--ti); box-shadow: 0 0 0 3px var(--t); }
.ln { flex: 0 0 34px; height: 2px; background: repeating-linear-gradient(90deg, #cfcbe0 0 5px, transparent 5px 10px); position: relative; transition: background .3s; }
.ln.on { background: var(--ti); }
.ln.on::after { content: ""; position: absolute; right: -1px; top: -4px; border-left: 7px solid var(--ti); border-top: 5px solid transparent; border-bottom: 5px solid transparent; }

.live { min-height: 52px; display: flex; align-items: center; }
.queue { display: flex; align-items: center; gap: 12px; font-size: 12.5px; color: var(--muted); }
.qn { min-width: 38px; height: 34px; border-radius: 10px; background: var(--t); color: var(--ti); display: grid; place-items: center; font-weight: 700; font-size: 15px; padding: 0 8px; }
.res { display: flex; align-items: center; gap: 12px; }
.res strong { display: block; font-size: 13px; }
.av { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.calling { font-size: 12px; font-weight: 600; color: var(--ti); }
.calling em { font-style: normal; animation: dot 1.2s infinite; }
.calling em:nth-child(2) { animation-delay: .2s; }
.calling em:nth-child(3) { animation-delay: .4s; }
@keyframes dot { 0%, 60%, 100% { opacity: .2; } 30% { opacity: 1; } }
.ok { font-size: 12px; font-weight: 600; color: var(--mint-i); background: var(--mint); padding: 2px 10px; border-radius: 99px; display: inline-block; margin-top: 2px; }

/* editor */
.edit { background: var(--tb); border: 1px solid var(--line); border-radius: 26px; padding: 22px; display: flex; flex-direction: column; gap: 16px; transition: background .4s; }
.eh { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.eh strong { font-size: 20px; font-weight: 600; letter-spacing: -.01em; }
.eh span { font-size: 12px; font-weight: 600; color: var(--ti); background: #fff; padding: 4px 12px; border-radius: 99px; }
.fields { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.fd { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px; transition: all .35s; }
.fd.hot { border-color: var(--ti); box-shadow: 0 0 0 3px var(--t); transform: translateY(-2px); }
.k { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.k i { width: 20px; height: 20px; border-radius: 50%; background: var(--t); color: var(--ti); display: grid; place-items: center; font-style: normal; font-size: 11px; letter-spacing: 0; }
.fd p { margin: 6px 0 0; font-size: 14px; font-weight: 500; line-height: 1.5; }
.sw { display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 600; padding: 12px 16px; border-radius: 99px; background: var(--ink); color: #fff; }
.tog { width: 38px; height: 22px; border-radius: 99px; background: #5ee0a0; position: relative; }
.tog::after { content: ""; position: absolute; right: 3px; top: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; }

.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 960px) {
  .board { grid-template-columns: 1fr; }
  .head { gap: 24px; }
  .wf.act button { transform: none; }
}
@media (max-width: 560px) {
  .tg { padding: 64px 16px; }
  .head { grid-template-columns: 1fr; gap: 22px; }
  .head-copy { text-align: center; }
  .workflow-image { height: 220px; border-radius: 20px; }
  .chain { flex-direction: column; align-items: stretch; gap: 0; }
  .ln { flex: 0 0 18px; width: 2px; height: 18px; margin-left: 24px; background: repeating-linear-gradient(180deg, #cfcbe0 0 5px, transparent 5px 10px); }
  .ln.on::after { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .calling em { animation: none; opacity: 1; }
  * { transition-duration: 0s !important; }
}
</style>
