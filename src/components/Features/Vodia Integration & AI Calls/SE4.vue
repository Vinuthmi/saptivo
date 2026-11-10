<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ResultsBackToCrmSection" });

const root = ref(null);
const shown = ref(false);
const sc = ref(0);
const ph = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;
const END = 6;

const base = "/saptivo/images/features/";
const photoOk = ref([true, true, true]);

const scenarios = [
  {
    tab: "Confirms a visit",
    name: "Dilani Perera",
    num: "+94 71 555 0198",
    photo: base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
    agent: "Your AC service is tomorrow at 10 am. Does that still work?",
    cust: "Yes, I'll be home.",
    code: '{ "call": "VC-2291", "outcome": "visit_confirmed" }',
    from: "Scheduled",
    to: "Confirmed",
    tone: "mint",
    log: "AI call · Visit confirmed",
    task: null,
    human: false,
  },
  {
    tab: "Asks to reschedule",
    name: "Ravi Fernando",
    num: "+94 77 210 8843",
    photo: base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
    agent: "Your AC service is tomorrow at 10 am. Does that still work?",
    cust: "Can we do Thursday afternoon?",
    code: '{ "call": "VC-2292", "outcome": "reschedule_requested", "preferred": "Thu PM" }',
    from: "Scheduled",
    to: "Reschedule requested",
    tone: "butter",
    log: "AI call · Asked to reschedule (Thu PM)",
    task: "Reschedule visit to Thursday afternoon · Nimali",
    human: false,
  },
  {
    tab: "Asks for a human",
    name: "Malini Jayasuriya",
    num: "+94 76 400 2211",
    photo: base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
    agent: "Your AC service is tomorrow at 10 am. Does that still work?",
    cust: "Can I speak to a person, please?",
    code: '{ "call": "VC-2293", "outcome": "transfer_requested" }',
    from: "Scheduled",
    to: "Needs a person",
    tone: "rose",
    log: "AI call · Transferred to Nimali (ext 102)",
    task: "Follow up after transferred call · Nimali",
    human: true,
  },
];

const cur = computed(() => scenarios[sc.value]);
const sent = computed(() => ph.value >= 1);
const statusNow = computed(() => (ph.value >= 2 ? cur.value.to : cur.value.from));

function advance() {
  if (ph.value < END) ph.value++;
  else if (!manual.value) {
    sc.value = (sc.value + 1) % scenarios.length;
    ph.value = 0;
  }
}
function pick(i) {
  manual.value = true;
  sc.value = i;
  ph.value = 0;
  start();
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(advance, 1600);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    ph.value = 5;
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
  <section ref="root" class="rb" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Results flow straight</span> <span class="l2">back into the CRM</span></h2>
        <p>
          When the AI agent completes an action, such as a customer confirming a visit or asking to reschedule, Vodia
          sends the result back to Saptivo in real time. Saptivo updates the record, logs the call outcome on the
          timeline and creates a follow-up task where a person needs to step in. If the customer asks for a human,
          the agent transfers the call to your team.
        </p>
      </header>

      <div class="tabs" role="tablist">
        <button
          v-for="(s, i) in scenarios"
          :key="s.tab"
          type="button"
          role="tab"
          :aria-selected="sc === i"
          class="tab"
          :class="{ act: sc === i }"
          @click="pick(i)"
        >{{ s.tab }}</button>
      </div>

      <div class="board" role="img" aria-label="Vodia sends the call result back to Saptivo, which updates the record, logs the outcome and creates a task">
        <!-- call -->
        <div class="card call">
          <div class="ch">
            <span class="av">
              <img v-if="photoOk[sc]" :src="cur.photo" alt="" @error="photoOk[sc] = false" />
              <b v-else>{{ cur.name[0] }}</b>
            </span>
            <div class="ci"><strong>{{ cur.name }}</strong><span>{{ cur.num }}</span></div>
            <span class="tag vod">Vodia AI agent</span>
          </div>
          <div class="msgs">
            <div class="m ag"><small>AI agent</small><p>{{ cur.agent }}</p></div>
            <Transition name="msg">
              <div v-if="ph >= 0" :key="'c' + sc" class="m cu"><small>{{ cur.name.split(" ")[0] }}</small><p>{{ cur.cust }}</p></div>
            </Transition>
            <Transition name="msg">
              <div v-if="cur.human && ph >= 1" :key="'h' + sc" class="m ag"><small>AI agent</small><p>Of course, connecting you to our team now.</p></div>
            </Transition>
          </div>
          <div v-if="cur.human" class="xfer" :class="{ on: ph >= 2 }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            {{ ph >= 2 ? "Call transferred to Nimali" : "Transfer ready" }}
          </div>
        </div>

        <!-- link -->
        <div class="link" :class="{ on: sent }">
          <div class="pipe"><i></i><i></i><i></i></div>
          <Transition name="pop">
            <code v-if="sent" :key="sc" class="payload">{{ cur.code }}</code>
          </Transition>
          <span class="rt">{{ sent ? "Sent to Saptivo in real time" : "Waiting for the result" }}</span>
        </div>

        <!-- crm -->
        <div class="card crm">
          <div class="ch">
            <b class="logo">S</b>
            <div class="ci"><strong>Saptivo CRM</strong><span>Service visit · {{ cur.name }}</span></div>
          </div>

          <div class="row">
            <span class="k">Visit status</span>
            <Transition name="swap" mode="out-in">
              <span :key="statusNow" class="st" :class="ph >= 2 ? 'tn-' + cur.tone : 'tn-grey'">{{ statusNow }}</span>
            </Transition>
          </div>

          <div class="tl">
            <span class="k">Timeline</span>
            <Transition name="msg">
              <div v-if="ph >= 3" :key="'l' + sc" class="log">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
                <div><strong>{{ cur.log }}</strong><span>Just now · 0:21</span></div>
              </div>
            </Transition>
          </div>

          <div class="tk">
            <span class="k">Follow-up</span>
            <Transition name="msg">
              <div v-if="ph >= 4 && cur.task" :key="'t' + sc" class="task">
                <i></i>{{ cur.task }}
              </div>
              <div v-else-if="ph >= 4" :key="'n' + sc" class="none">No follow-up needed</div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rb {
  --ink: #14120f; --ash: #8a8f97; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 88px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 800px; margin: 0 auto 32px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--mint); color: var(--mint-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 16px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.rb h2 .l1 { color: #111111 !important; -webkit-text-fill-color: #111111 !important; opacity: 1; }
.rb h2 .l2 { color: #8a8f97 !important; -webkit-text-fill-color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.7; color: var(--muted); }

.head, .tabs, .board { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .tabs, .in .board { opacity: 1; transform: none; }
.in .tabs { transition-delay: .08s; }
.in .board { transition-delay: .16s; }

.tabs { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.tab { all: unset; box-sizing: border-box; cursor: pointer; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 99px; background: #f3f1fa; color: var(--muted); transition: all .3s; }
.tab:hover { background: #e9e6f5; }
.tab.act { background: var(--ink); color: #fff; }
.tab:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.board { display: grid; grid-template-columns: 1fr 150px 1fr; align-items: stretch; background: linear-gradient(160deg, #f6f4ff, #eef6ff 60%, #eefaf3); border-radius: 28px; padding: 24px; }
.card { background: #fff; border-radius: 20px; box-shadow: 0 18px 44px rgba(60, 50, 120, .1); padding: 18px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.ch { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
.av { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.logo { width: 38px; height: 38px; border-radius: 11px; background: var(--ink); color: #fff; display: grid; place-items: center; font-size: 14px; flex: none; }
.ci { flex: 1; min-width: 0; }
.ci strong { display: block; font-size: 14px; }
.ci span { font-size: 12px; color: var(--muted); }
.tag.vod { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 99px; background: var(--lav); color: var(--lav-i); white-space: nowrap; }

.msgs { display: flex; flex-direction: column; gap: 10px; flex: 1; min-height: 200px; }
.m { max-width: 88%; display: flex; flex-direction: column; gap: 3px; }
.m small { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.m p { margin: 0; font-size: 13px; line-height: 1.55; padding: 10px 14px; border-radius: 16px; }
.ag p { background: #f3f1fa; border-top-left-radius: 4px; }
.cu { align-self: flex-end; align-items: flex-end; }
.cu p { background: var(--mint); border-top-right-radius: 4px; }
.xfer { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; padding: 10px 14px; border-radius: 12px; background: #f3f1fa; color: var(--muted); transition: all .4s; }
.xfer svg { width: 14px; height: 14px; flex: none; }
.xfer.on { background: var(--rose); color: var(--rose-i); }

/* link */
.link { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 0 8px; min-width: 0; }
.pipe { display: flex; align-items: center; gap: 6px; }
.pipe i { width: 8px; height: 8px; border-radius: 50%; background: #cfcbe0; transition: background .3s; }
.link.on .pipe i { background: var(--mint-i); animation: hop 1s ease-in-out infinite; }
.link.on .pipe i:nth-child(2) { animation-delay: .15s; }
.link.on .pipe i:nth-child(3) { animation-delay: .3s; }
@keyframes hop { 50% { transform: translateY(-5px); } }
.payload { font-family: ui-monospace, "SF Mono", monospace; font-size: 10px; line-height: 1.5; background: var(--ink); color: #d6f5e4; padding: 8px 10px; border-radius: 10px; word-break: break-word; text-align: left; max-width: 100%; }
.rt { font-size: 11px; font-weight: 600; color: var(--muted); text-align: center; line-height: 1.4; }
.link.on .rt { color: var(--mint-i); }

/* crm */
.row { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #f8f7fc; border-radius: 12px; padding: 10px 12px; }
.k { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.st { font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 99px; white-space: nowrap; }
.tn-grey { background: #eceaf3; color: var(--muted); }
.tn-mint { background: var(--mint); color: var(--mint-i); }
.tn-butter { background: var(--butter); color: var(--butter-i); }
.tn-rose { background: var(--rose); color: var(--rose-i); }
.tl, .tk { display: flex; flex-direction: column; gap: 8px; min-height: 66px; }
.log { display: flex; align-items: center; gap: 12px; background: var(--sky); padding: 10px 12px; border-radius: 12px; }
.log svg { width: 28px; height: 28px; padding: 6px; border-radius: 50%; background: #fff; color: var(--sky-i); flex: none; }
.log strong { display: block; font-size: 12px; }
.log span { font-size: 11px; color: var(--muted); }
.task { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 600; background: var(--butter); color: var(--ink); padding: 10px 12px; border-radius: 12px; }
.task i { width: 16px; height: 16px; border-radius: 5px; border: 2px solid var(--butter-i); flex: none; }
.none { font-size: 12px; color: var(--muted); background: #f8f7fc; padding: 10px 12px; border-radius: 12px; }

.msg-enter-active { transition: all .45s ease; }
.msg-enter-from { opacity: 0; transform: translateY(10px); }
.pop-enter-active { transition: all .45s cubic-bezier(.2, 1.3, .4, 1); }
.pop-enter-from { opacity: 0; transform: scale(.85); }
.swap-enter-active, .swap-leave-active { transition: all .25s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(5px); }

@media (max-width: 900px) {
  .board { grid-template-columns: 1fr; gap: 14px; padding: 16px; }
  .link { flex-direction: row; flex-wrap: wrap; justify-content: center; padding: 4px 0; }
  .pipe { transform: rotate(90deg); }
  .msgs { min-height: 0; }
}
@media (max-width: 560px) {
  .rb { padding: 64px 16px; }
  .tag.vod { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .tabs, .board { opacity: 1; transform: none; transition: none; }
  .link.on .pipe i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
