<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WorkflowBuilderSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;
const END = 8;

const base = "/saptivo/images/features/";
const photo = base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg";
const photoOk = ref(true);

const palette = [
  { k: "trigger", t: "Trigger", tone: "lav", ic: "M13 2L4 14h7l-1 8 9-12h-7z" },
  { k: "cond", t: "Condition (if / else)", tone: "butter", ic: "M6 3v6a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v4M6 3 3 6M6 3l3 3" },
  { k: "wait", t: "Wait", tone: "sky", ic: "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" },
  { k: "action", t: "Action", tone: "mint", ic: "M5 12l5 5 9-10" },
];

// at = the step in which the node is dropped onto the canvas
const nodes = [
  { id: "n1", at: 0, kind: "trigger", area: "t", title: "Invoice is overdue", sub: "3 days after the due date", settings: ["Trigger", "Invoice overdue by 3 days"] },
  { id: "n2", at: 1, kind: "cond", area: "c", title: "Amount above LKR 50,000?", sub: "If / else", settings: ["Condition", "Invoice amount is greater than LKR 50,000"] },
  { id: "n3", at: 2, kind: "action", area: "y1", branch: "Yes", title: "Send WhatsApp reminder", sub: "Template: payment_reminder", settings: ["Action", "Send WhatsApp message · payment_reminder"] },
  { id: "n4", at: 3, kind: "action", area: "n1", branch: "No", title: "Send email reminder", sub: "Template: Payment reminder", settings: ["Action", "Send email · Payment reminder"] },
  { id: "n5", at: 4, kind: "wait", area: "y2", title: "Wait 2 days", sub: "Then check the invoice again", settings: ["Wait", "Pause for 2 days, then continue"] },
  { id: "n6", at: 5, kind: "action", area: "y3", title: "Place an AI call", sub: "Payment reminder agent", settings: ["Action", "Call the customer with the payment reminder agent"] },
];

const toneOf = { trigger: "lav", cond: "butter", wait: "sky", action: "mint" };
const icOf = Object.fromEntries(palette.map((p) => [p.k, p.ic]));

const newest = computed(() => nodes.find((n) => n.at === step.value) || null);
const lastShown = computed(() => [...nodes].reverse().find((n) => n.at <= step.value));
const active = computed(() => newest.value || lastShown.value);
const testing = computed(() => step.value >= 6);
const tick = (n) => (step.value === 6 && ["n1", "n2", "n3"].includes(n.id)) || (step.value >= 7 && ["n1", "n2", "n3", "n5", "n6"].includes(n.id));

function advance() {
  if (step.value < END - 1) step.value++;
  else if (!manual.value) step.value = 0;
}
function replay() {
  manual.value = false;
  step.value = 0;
  start();
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(advance, 1400);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    step.value = 7;
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
  <section ref="root" class="wb" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">A visual, no-code</span> <span class="l2">automation flow</span></h2>
        <p>
          Build automations by dragging steps onto a canvas. Add conditions with if and else branches, wait steps and
          multiple actions. No developer needed, and no scripts to maintain.
        </p>
      </header>

      <div class="win" role="img" aria-label="A no-code workflow builder: steps are dragged onto a canvas with an if/else branch, a wait step and actions">
        <div class="bar">
          <i></i><i></i><i></i>
          <span class="name">Overdue invoice follow-up</span>
          <span class="who">
            <span class="av">
              <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
              <b v-else>N</b>
            </span>
            Edited by Nimali
          </span>
          <span class="state" :class="{ on: step >= 7 }">{{ step >= 7 ? "Active" : "Draft" }}</span>
        </div>

        <div class="body">
          <!-- palette -->
          <aside class="pal">
            <h4>Steps</h4>
            <div v-for="p in palette" :key="p.k" class="pi" :class="['tone-' + p.tone, { grab: newest && newest.kind === p.k }]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="p.ic" /></svg>
              {{ p.t }}
              <em class="dots"><i></i><i></i><i></i><i></i><i></i><i></i></em>
            </div>
            <p class="hint">Drag a step onto the canvas</p>
          </aside>

          <!-- canvas -->
          <div class="canvas">
            <div class="grid">
              <template v-for="n in nodes" :key="n.id">
                <Transition name="drop">
                  <div v-if="step >= n.at" class="node" :class="['a-' + n.area, 'tone-' + toneOf[n.kind], { fresh: newest && newest.id === n.id, done: tick(n) }]">
                    <span class="ni">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="icOf[n.kind]" /></svg>
                    </span>
                    <div class="nt">
                      <small v-if="n.branch" class="br" :class="n.branch === 'Yes' ? 'y' : 'no'">{{ n.branch }}</small>
                      <strong>{{ n.title }}</strong>
                      <span>{{ n.sub }}</span>
                    </div>
                    <span class="ck" :class="{ on: tick(n) }">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                    </span>
                    <span v-if="newest && newest.id === n.id" class="cursor">
                      <svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 2-2 6z" /></svg>
                    </span>
                  </div>
                </Transition>
              </template>

              <Transition name="fade">
                <div v-if="step >= 2" class="fork a-f" aria-hidden="true"><i></i></div>
              </Transition>
              <i v-if="step >= 1" class="link a-l1" aria-hidden="true"></i>
              <i v-if="step >= 4" class="link a-l2" aria-hidden="true"></i>
              <i v-if="step >= 5" class="link a-l3" aria-hidden="true"></i>
            </div>
          </div>

          <!-- inspector -->
          <aside class="insp">
            <h4>Step settings</h4>
            <Transition name="swap" mode="out-in">
              <div v-if="active" :key="active.id + (testing ? 't' : '')" class="card">
                <span class="tag" :class="'tone-' + toneOf[active.kind]">{{ active.settings[0] }}</span>
                <strong>{{ active.title }}</strong>
                <p>{{ active.settings[1] }}</p>
                <div class="field"><span>Name</span><b>{{ active.title }}</b></div>
              </div>
            </Transition>
            <Transition name="fade">
              <div v-if="testing" class="test">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                <div><strong>{{ step >= 7 ? "Test run passed" : "Running a test…" }}</strong><span>{{ step >= 7 ? "Workflow switched on" : "Checking each step" }}</span></div>
              </div>
            </Transition>
            <button v-if="manual" type="button" class="replay" @click="replay">Replay</button>
          </aside>
        </div>
      </div>

      <ul class="chips">
        <li>Drag steps onto a canvas</li>
        <li>If and else branches</li>
        <li>Wait steps</li>
        <li>Multiple actions</li>
        <li>No developer needed</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.wb {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #f8f6ff 0%, #fff 100%);
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 760px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--butter); color: var(--butter-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.wb h2 .l1 { color: #111111 !important; opacity: 1; }
.wb h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .win, .chips { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .win, .in .chips { opacity: 1; transform: none; }
.in .win { transition-delay: .1s; }
.in .chips { transition-delay: .2s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }

/* window */
.win { background: #fff; border: 1px solid var(--line); border-radius: 26px; box-shadow: 0 28px 70px rgba(60, 50, 120, .14); overflow: hidden; }
.bar { display: flex; align-items: center; gap: 6px; padding: 12px 18px; background: #faf9ff; border-bottom: 1px solid var(--line); }
.bar > i { width: 10px; height: 10px; border-radius: 50%; background: #e3e0ee; }
.name { margin-left: 12px; font-size: 13px; font-weight: 600; }
.who { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }
.av { width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-size: 11px; font-weight: 700; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.state { font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 99px; background: var(--butter); color: var(--butter-i); margin-left: 10px; transition: all .4s; }
.state.on { background: var(--mint); color: var(--mint-i); }

.body { display: grid; grid-template-columns: 200px 1fr 260px; min-height: 560px; }
.pal, .insp { padding: 18px; background: #fbfaff; display: flex; flex-direction: column; gap: 10px; }
.pal { border-right: 1px solid var(--line); }
.insp { border-left: 1px solid var(--line); }
h4 { margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.pi { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 10px 12px; font-size: 12.5px; font-weight: 600; position: relative; transition: all .3s; }
.pi svg { width: 26px; height: 26px; padding: 5px; border-radius: 8px; background: var(--t); color: var(--ti); flex: none; }
.dots { margin-left: auto; display: grid; grid-template-columns: repeat(2, 3px); gap: 2px; }
.dots i { width: 3px; height: 3px; border-radius: 50%; background: #cfcbe0; }
.pi.grab { border-color: var(--ti); background: var(--t); transform: scale(.97) translateX(6px); box-shadow: 0 10px 24px rgba(60, 50, 120, .14); }
.hint { margin: 6px 0 0; font-size: 11px; color: #9a9fa8; text-align: center; }

/* canvas */
.canvas { position: relative; padding: 26px 22px; background-color: #fff; background-image: radial-gradient(circle, #d9d6e8 1px, transparent 1.4px); background-size: 20px 20px; overflow: hidden; }
.grid { position: relative; display: grid; grid-template-columns: 1fr 1fr; grid-template-areas: "t t" "c c" "f f" "y1 n1" "l2 ." "y2 ." "l3 ." "y3 ."; row-gap: 22px; column-gap: 24px; max-width: 560px; margin: 0 auto; }
.a-t { grid-area: t; justify-self: center; width: min(320px, 100%); }
.a-c { grid-area: c; justify-self: center; width: min(320px, 100%); }
.a-y1 { grid-area: y1; }
.a-n1 { grid-area: n1; }
.a-y2 { grid-area: y2; }
.a-y3 { grid-area: y3; }
.a-f { grid-area: f; }
.a-l1 { grid-area: c; align-self: start; justify-self: center; transform: translateY(-100%); }
.a-l2 { grid-area: l2; }
.a-l3 { grid-area: l3; }

.node { position: relative; display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 12px 14px; box-shadow: 0 8px 22px rgba(60, 50, 120, .08); transition: border-color .35s, box-shadow .35s; min-width: 0; }
.node.fresh { border-color: var(--ti); box-shadow: 0 0 0 3px var(--t), 0 14px 30px rgba(60, 50, 120, .14); }
.ni svg { width: 34px; height: 34px; padding: 8px; border-radius: 11px; background: var(--t); color: var(--ti); display: block; }
.nt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.nt strong { font-size: 13px; line-height: 1.35; }
.nt span { font-size: 11px; color: var(--muted); }
.br { align-self: flex-start; font-size: 9.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; margin-bottom: 3px; }
.br.y { background: var(--mint); color: var(--mint-i); }
.br.no { background: var(--rose); color: var(--rose-i); }
.ck { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: #f1f0f6; color: transparent; flex: none; transition: all .35s; }
.ck svg { width: 12px; height: 12px; }
.ck.on { background: var(--mint-i); color: #fff; }
.cursor { position: absolute; right: -8px; bottom: -14px; animation: bob .9s ease-in-out infinite alternate; pointer-events: none; }
.cursor svg { width: 22px; height: 22px; fill: var(--ink); stroke: #fff; stroke-width: 1.5; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, .25)); }
@keyframes bob { to { transform: translate(-4px, -4px); } }

/* links and fork */
.link { justify-self: center; width: 2px; height: 22px; background: var(--ti, #cfcbe0); background: repeating-linear-gradient(180deg, #b9b4d3 0 5px, transparent 5px 9px); }
.a-l2, .a-l3 { grid-column: 1; }
.fork { position: relative; height: 22px; }
.fork i { position: absolute; left: 25%; right: 25%; top: 0; height: 100%; border: 2px dashed #b9b4d3; border-bottom: 0; border-radius: 12px 12px 0 0; }
.fork::before { content: ""; position: absolute; left: 50%; top: -22px; height: 22px; width: 0; border-left: 2px dashed #b9b4d3; }

/* inspector */
.card { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.tag { align-self: flex-start; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; padding: 4px 10px; border-radius: 99px; background: var(--t); color: var(--ti); }
.card > strong { font-size: 15px; line-height: 1.35; }
.card p { margin: 0; font-size: 12.5px; line-height: 1.6; color: var(--muted); }
.field { display: flex; flex-direction: column; gap: 3px; padding: 10px 12px; background: #f8f7fc; border-radius: 12px; }
.field span { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.field b { font-size: 12.5px; font-weight: 600; }
.test { display: flex; align-items: center; gap: 12px; background: var(--mint); border-radius: 14px; padding: 12px 14px; }
.test svg { width: 28px; height: 28px; padding: 6px; border-radius: 50%; background: var(--mint-i); color: #fff; flex: none; }
.test strong { display: block; font-size: 12.5px; color: var(--mint-i); }
.test span { font-size: 11px; color: var(--muted); }
.replay { all: unset; cursor: pointer; text-align: center; font-size: 12px; font-weight: 600; background: var(--ink); color: #fff; padding: 9px 14px; border-radius: 99px; }

.chips { list-style: none; margin: 28px 0 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.chips li { font-size: 13px; font-weight: 600; background: #fff; border: 1px solid var(--line); padding: 9px 18px; border-radius: 99px; display: inline-flex; align-items: center; gap: 8px; }
.chips li::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); }

.drop-enter-active { transition: all .55s cubic-bezier(.2, 1.4, .4, 1); }
.drop-enter-from { opacity: 0; transform: translate(-60px, -10px) scale(.9); }
.drop-leave-active { transition: opacity .2s ease; }
.drop-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.swap-enter-active, .swap-leave-active { transition: all .25s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(6px); }

@media (max-width: 1000px) {
  .body { grid-template-columns: 1fr; }
  .pal { flex-direction: row; flex-wrap: wrap; border-right: 0; border-bottom: 1px solid var(--line); }
  .pal h4, .hint { display: none; }
  .insp { border-left: 0; border-top: 1px solid var(--line); }
  .bar .who { display: none; }
  .state { margin-left: auto; }
}
@media (max-width: 560px) {
  .wb { padding: 64px 16px; }
  .canvas { padding: 20px 12px; }
  .grid { grid-template-columns: 1fr; grid-template-areas: "t" "c" "y1" "l2" "y2" "l3" "y3" "n1"; }
  .fork, .a-l1 { display: none; }
  .a-l2, .a-l3 { grid-column: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .win, .chips { opacity: 1; transform: none; transition: none; }
  .cursor { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>