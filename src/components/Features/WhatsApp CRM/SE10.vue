<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "GetStartedSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const helpPhoto = base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG";
const photoOk = ref(true);

const steps = [
  { tone: "lav", t: "Apply for the WhatsApp Business API with help from the Saptivo team" },
  { tone: "sky", t: "Connect your business number to Saptivo" },
  { tone: "mint", t: "Add your team members and set routing rules" },
  { tone: "butter", t: "Create saved replies and submit message templates for approval" },
  { tone: "rose", t: "Start answering customers from one shared inbox" },
];

const team = [
  { n: "Nimali", c: "lav" },
  { n: "Kasun", c: "sky" },
  { n: "Hasitha", c: "mint" },
];

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
  timer = setInterval(next, 4800);
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
  <section ref="root" class="gs" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2>How to get started with WhatsApp CRM</h2>
      </header>

      <!-- stepper -->
      <ol class="stepper" :style="{ '--p': step / (steps.length - 1) }">
        <li
          v-for="(s, i) in steps"
          :key="s.t"
          class="st"
          :class="['tone-' + s.tone, { act: step === i, done: step > i, run: step === i && !manual }]"
        >
          <button type="button" @click="pick(i)">
            <span class="dot">
              <svg v-if="step > i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
              <template v-else>{{ i + 1 }}</template>
            </span>
            <span class="tx">{{ s.t }}</span>
          </button>
        </li>
      </ol>

      <!-- detail -->
      <div class="panel" :class="'tone-' + steps[step].tone" role="img" aria-label="Setup steps for WhatsApp CRM">
        <Transition name="swap" mode="out-in">
          <!-- 1 apply -->
          <div v-if="step === 0" key="a" class="s s1">
            <div class="who">
              <span class="av">
                <img v-if="photoOk" :src="helpPhoto" alt="" @error="photoOk = false" />
                <b v-else>K</b>
              </span>
              <div><strong>Saptivo team</strong><span>Helping with your application</span></div>
            </div>
            <ul class="track">
              <li class="a1"><i></i>Application submitted</li>
              <li class="a2"><i></i>Business documents checked</li>
              <li class="a3"><i></i>WhatsApp Business API approved</li>
            </ul>
          </div>

          <!-- 2 connect -->
          <div v-else-if="step === 1" key="b" class="s s2">
            <label>Business number</label>
            <div class="field"><span>+94 77 123 4567</span></div>
            <div class="code">
              <i class="c1">4</i><i class="c2">8</i><i class="c3">2</i><i class="c4">9</i><i class="c5">1</i><i class="c6">0</i>
            </div>
            <div class="conn"><i></i>Connected to Saptivo</div>
          </div>

          <!-- 3 team -->
          <div v-else-if="step === 2" key="c" class="s s3">
            <div class="mem">
              <div v-for="(m, i) in team" :key="m.n" class="mm" :style="{ '--i': i }">
                <b :class="'tn-' + m.c">{{ m.n[0] }}</b>{{ m.n }}<em>Added</em>
              </div>
            </div>
            <div class="rule">
              <span>When</span><b>Sales enquiry</b><span>assign to</span><b class="tn-lav">Nimali</b>
            </div>
            <div class="rule r2">
              <span>When</span><b>Complaint</b><span>assign to</span><b class="tn-sky">Kasun</b>
            </div>
          </div>

          <!-- 4 replies and templates -->
          <div v-else-if="step === 3" key="d" class="s s4">
            <div class="col">
              <h4>Saved replies</h4>
              <div class="sr x1"><code>/hours</code>We are open 8:30 am to 6 pm.</div>
              <div class="sr x2"><code>/delivery</code>Delivery takes 1 to 2 working days.</div>
            </div>
            <div class="col">
              <h4>Message templates</h4>
              <div class="tp x1">
                <strong>receipt_ready</strong>
                <span class="ts"><em class="p">Submitted</em><em class="k">Approved</em></span>
              </div>
              <div class="tp x2">
                <strong>visit_reminder</strong>
                <span class="ts"><em class="p">Submitted</em><em class="k">Approved</em></span>
              </div>
            </div>
          </div>

          <!-- 5 inbox -->
          <div v-else key="e" class="s s5">
            <div class="live"><i></i>You are live</div>
            <div class="ib i1"><b class="tn-lav">D</b><div><strong>Dilani Perera</strong><span>Can you send the quotation?</span></div><em>Nimali</em></div>
            <div class="ib i2"><b class="tn-mint">R</b><div><strong>Ravi Fernando</strong><span>Is the price still valid?</span></div><em>Hasitha</em></div>
            <div class="ib i3"><b class="tn-sky">S</b><div><strong>Sewwandi K.</strong><span>I need a service visit.</span></div><em>Kasun</em></div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gs {
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
.head { text-align: center; max-width: 720px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--rose); color: var(--rose-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { font-size: clamp(34px, 3.4vw, 56px); line-height: 1.08; font-weight: 500; margin: 0; letter-spacing: -0.06em; font-family: "Inter", system-ui, sans-serif; text-wrap: balance; }

.head, .stepper, .panel { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stepper, .in .panel { opacity: 1; transform: none; }
.in .stepper { transition-delay: .08s; }
.in .panel { transition-delay: .16s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); --tb: #fff5f8; }
.tn-lav { background: var(--lav); color: var(--lav-i); }
.tn-sky { background: var(--sky); color: var(--sky-i); }
.tn-mint { background: var(--mint); color: var(--mint-i); }

/* stepper */
.stepper { list-style: none; margin: 0 0 24px; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; position: relative; }
.stepper::before { content: ""; position: absolute; left: 10%; right: 10%; top: 21px; height: 3px; background: #e9e6f2; border-radius: 3px; }
.stepper::after { content: ""; position: absolute; left: 10%; top: 21px; height: 3px; width: calc(80% * var(--p)); background: var(--ink); border-radius: 3px; transition: width .7s ease; }
.st button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; position: relative; z-index: 1; }
.st button:focus-visible .dot { outline: 2px solid var(--ink); outline-offset: 3px; }
.dot { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font-size: 15px; font-weight: 700; background: #fff; color: var(--muted); border: 3px solid #e9e6f2; transition: all .4s; }
.dot svg { width: 18px; height: 18px; }
.st.act .dot { background: var(--t); color: var(--ti); border-color: var(--ti); transform: scale(1.12); }
.st.done .dot { background: var(--ink); color: #fff; border-color: var(--ink); }
.tx { font-size: 13.5px; line-height: 1.5; font-weight: 500; color: var(--muted); padding: 0 6px; transition: color .3s; }
.st.act .tx { color: var(--ink); }

/* panel */
.panel { background: var(--tb); border: 1px solid var(--line); border-radius: 26px; padding: 28px; min-height: 290px; display: flex; transition: background .5s, border-color .5s, opacity .6s ease, transform .6s ease; }
.s { width: 100%; max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; justify-content: center; }
.s > *, .col > *, .mem > * { animation: rise .5s ease both; }
@keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

/* 1 */
.who { display: flex; align-items: center; gap: 12px; }
.av { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.who strong { display: block; font-size: 14px; }
.who span { font-size: 12px; color: var(--muted); }
.track { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.track li { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 12px 16px; font-size: 14px; opacity: 0; animation: rise .5s ease both; }
.track i { width: 20px; height: 20px; border-radius: 50%; background: var(--lav-i); position: relative; flex: none; }
.track i::after { content: ""; position: absolute; left: 6px; top: 3px; width: 5px; height: 9px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.a1 { animation-delay: .3s; }
.a2 { animation-delay: 1.2s; }
.a3 { animation-delay: 2.1s; }

/* 2 */
.s2 label { font-size: 12px; font-weight: 600; color: var(--muted); }
.field { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; font-size: 15px; font-weight: 600; }
.code { display: flex; gap: 8px; }
.code i { flex: 1; max-width: 52px; height: 52px; border-radius: 12px; background: #fff; border: 1px solid var(--sky-i); display: grid; place-items: center; font-style: normal; font-size: 20px; font-weight: 700; color: var(--sky-i); opacity: 0; animation: rise .35s ease both; }
.c1 { animation-delay: .8s; } .c2 { animation-delay: 1s; } .c3 { animation-delay: 1.2s; } .c4 { animation-delay: 1.4s; } .c5 { animation-delay: 1.6s; } .c6 { animation-delay: 1.8s; }
.conn { display: flex; align-items: center; gap: 10px; align-self: flex-start; font-size: 13px; font-weight: 600; background: var(--mint); color: var(--mint-i); padding: 9px 16px; border-radius: 99px; opacity: 0; animation: rise .5s ease 2.5s both; }
.conn i { width: 9px; height: 9px; border-radius: 50%; background: var(--mint-i); }

/* 3 */
.mem { display: flex; flex-wrap: wrap; gap: 10px; }
.mm { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: 99px; padding: 6px 14px 6px 6px; font-size: 13px; font-weight: 600; animation-delay: calc(.2s + var(--i) * .35s); }
.mm b { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; }
.mm em { font-style: normal; font-size: 10px; background: var(--mint); color: var(--mint-i); padding: 2px 8px; border-radius: 99px; }
.rule { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 12px 16px; font-size: 13px; color: var(--muted); animation-delay: 1.4s; }
.rule.r2 { animation-delay: 2s; }
.rule b { font-weight: 600; color: var(--ink); background: #f3f1fa; padding: 4px 12px; border-radius: 99px; font-size: 12px; }
.rule b.tn-lav { background: var(--lav); color: var(--lav-i); }
.rule b.tn-sky { background: var(--sky); color: var(--sky-i); }

/* 4 */
.s4 { flex-direction: row; gap: 20px; }
.col { flex: 1; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.col h4 { margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--butter-i); }
.sr { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 10px 14px; font-size: 12px; line-height: 1.5; color: var(--muted); }
.sr code { display: block; font-family: inherit; font-weight: 700; color: var(--mint-i); margin-bottom: 2px; }
.tp { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.tp strong { font-size: 12px; font-family: ui-monospace, monospace; }
.ts { position: relative; height: 22px; }
.ts em { position: absolute; left: 0; top: 0; font-style: normal; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px; white-space: nowrap; }
.ts .p { background: var(--butter); color: var(--butter-i); animation: gone .3s ease 1.6s forwards; }
.ts .k { background: var(--mint); color: var(--mint-i); opacity: 0; animation: show .4s ease 1.7s forwards; }
.x2 .ts .p { animation-delay: 2.3s; }
.x2 .ts .k { animation-delay: 2.4s; }
.x2 { animation-delay: .2s; }
@keyframes gone { to { opacity: 0; } }
@keyframes show { to { opacity: 1; } }

/* 5 */
.live { display: flex; align-items: center; gap: 10px; align-self: flex-start; font-size: 13px; font-weight: 600; background: var(--ink); color: #fff; padding: 9px 18px; border-radius: 99px; }
.live i { width: 9px; height: 9px; border-radius: 50%; background: #5ee0a0; }
.ib { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 11px 14px; opacity: 0; animation: rise .5s ease both; }
.ib b { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; flex: none; }
.ib div { flex: 1; min-width: 0; }
.ib strong { display: block; font-size: 13px; }
.ib span { font-size: 12px; color: var(--muted); }
.ib em { font-style: normal; font-size: 11px; font-weight: 600; background: #f3f1fa; padding: 3px 10px; border-radius: 99px; }
.i1 { animation-delay: .5s; } .i2 { animation-delay: 1.2s; } .i3 { animation-delay: 1.9s; }

.swap-enter-active, .swap-leave-active { transition: opacity .25s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .stepper { grid-template-columns: 1fr; gap: 8px; }
  .stepper::before, .stepper::after { display: none; }
  .st button { flex-direction: row; text-align: left; gap: 14px; padding: 10px 14px; border-radius: 16px; background: #fff; border: 1px solid var(--line); }
  .st.act button { border-color: var(--ti); background: var(--tb); }
  .dot { width: 36px; height: 36px; flex: none; font-size: 13px; }
  .st.act .dot { transform: none; }
  .tx { padding: 0; }
  .s4 { flex-direction: column; }
}
@media (max-width: 560px) {
  .gs { padding: 64px 16px; }
  .panel { padding: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stepper, .panel { opacity: 1; transform: none; transition: none; }
  .s > *, .col > *, .mem > *, .track li, .code i, .conn, .ib, .ts .k { animation: none; opacity: 1; transform: none; }
  .ts .p { display: none; }
  * { transition-duration: 0s !important; }
}
</style>
