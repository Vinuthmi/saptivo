<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AiComposerSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const manual = ref(-1);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";

const tones = [
  {
    k: "Professional",
    body: "Dear Dilani, thank you for your time on Tuesday. As discussed, I have attached the AMC renewal proposal for your review. Please let me know a suitable time to go through it.",
    subjects: ["Your AMC renewal proposal", "Following up on Tuesday's meeting", "AMC renewal: next steps"],
    reply: "Thank you, this looks good. Let's talk on Thursday.",
    sent: "Positive", lvl: 3,
  },
  {
    k: "Friendly",
    body: "Hi Dilani, great chatting on Tuesday! I've attached the AMC renewal proposal. Happy to walk you through it whenever suits you.",
    subjects: ["Great chatting, Dilani!", "Your AMC proposal is here", "Quick follow-up from Tuesday"],
    reply: "Lovely, thank you! Call me on Thursday.",
    sent: "Positive", lvl: 3,
  },
  {
    k: "Persuasive",
    body: "Hi Dilani, renewing your AMC before 30 Nov locks in this year's rate and priority visits. Shall I reserve your slot today?",
    subjects: ["Keep this year's AMC rate", "Priority visits end 30 Nov", "Reserve your AMC slot"],
    reply: "Can you hold the slot until Friday?",
    sent: "Neutral", lvl: 2,
  },
  {
    k: "Concise",
    body: "Hi Dilani, the AMC proposal is attached. Can we confirm by Friday?",
    subjects: ["AMC proposal, confirm by Friday", "Your AMC proposal", "Quick question on AMC"],
    reply: "Yes, confirmed.",
    sent: "Positive", lvl: 3,
  },
];

const tone = computed(() => (manual.value >= 0 ? manual.value : reduce ? 0 : Math.floor(n.value / 40) % 4));
const sub = computed(() => (reduce ? 38 : n.value % 40));
const cur = computed(() => tones[tone.value]);
const pressed = computed(() => sub.value >= 4 && sub.value < 7);
const chars = computed(() => {
  const len = cur.value.body.length;
  if (sub.value < 6) return 0;
  if (sub.value >= 26) return len;
  return Math.floor((len * (sub.value - 6)) / 20);
});
const typed = computed(() => cur.value.body.slice(0, chars.value));
const typing = computed(() => sub.value >= 6 && sub.value < 26);
const subjPicked = computed(() => sub.value >= 28);
const sendHot = computed(() => sub.value >= 31);
const replied = computed(() => sub.value >= 34);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 200);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manual.value = i;
  n.value = Math.ceil(n.value / 40) * 40;
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
  <section ref="root" class="ai" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">AI email and</span> <span class="l2">message composer</span></h2>
        <p>
          Generate a personalised email or follow-up in one click, using the contact's profile and deal history. Choose
          a tone (professional, friendly, persuasive or concise), get subject-line suggestions and see the sentiment of
          customer replies. Reps review and send; Saptivo learns from what works.
        </p>
      </header>

      <div class="stage">
        <!-- composer -->
        <article class="cp">
          <div class="ctx">
            <span class="av"><img v-if="ok" :src="photo" alt="" @error="ok = false" /><b v-else>D</b></span>
            <div class="ci"><strong>Dilani Perera</strong><small>Perera Holdings</small></div>
            <span class="ch">Profile</span>
            <span class="ch">Deal history · AMC renewal</span>
          </div>

          <div class="tn" role="tablist">
            <button v-for="(t, i) in tones" :key="t.k" type="button" role="tab" :aria-selected="i === tone" :class="{ on: i === tone }" @click="pick(i)">{{ t.k }}</button>
          </div>

          <div class="ed">
            <p v-if="chars === 0" class="ph">Press Generate to draft a reply from the contact's profile and deal history.</p>
            <p v-else>{{ typed }}<i v-if="typing" class="cur"></i></p>
          </div>

          <div class="bar">
            <span class="gen" :class="{ press: pressed }">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.900 5.100L19 10l-5.100 1.900L12 17l-1.900-5.100L5 10l5.100-1.900Z" /></svg>
              Generate
            </span>
            <span class="send" :class="{ hot: sendHot }">Review and send</span>
          </div>
        </article>

        <!-- side -->
        <div class="side">
          <article class="sj">
            <span class="lb">Subject-line suggestions</span>
            <ul>
              <li v-for="(s, i) in cur.subjects" :key="tone + s" :class="{ pick: subjPicked && i === 0, show: chars > 0 }">{{ s }}</li>
            </ul>
          </article>

          <article class="rp" :class="{ show: replied }">
            <div class="rh"><span class="lb">Customer reply</span><span class="sent" :class="cur.sent.toLowerCase()">{{ cur.sent }}</span></div>
            <p>{{ cur.reply }}</p>
            <div class="mt"><i v-for="k in 3" :key="k" :class="{ on: k <= cur.lvl }"></i></div>
          </article>

          <div class="lr"><i></i>Saptivo learns from what works</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ai {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.ai *, .ai *::before, .ai *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 840px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ai h2 .l1 { color: #111111 !important; opacity: 1; }
.ai h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }

.head, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .08s; }

.stage { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr); gap: 18px; align-items: stretch; }

.cp { background: var(--lav); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ctx { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.av { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: #fff; color: var(--lav-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.ci { display: flex; flex-direction: column; margin-right: 6px; }
.ci strong { font-size: 14.5px; font-weight: 600; }
.ci small { font-size: 12px; color: var(--muted); }
.ch { font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 99px; background: #fff; color: var(--lav-i); }

.tn { display: flex; flex-wrap: wrap; gap: 6px; }
.tn button { all: unset; cursor: pointer; font-size: 12.5px; font-weight: 500; padding: 7px 16px; border-radius: 99px; background: rgba(255, 255, 255, .65); color: var(--muted); transition: all .25s; }
.tn button.on { background: var(--ink); color: #fff; }
.tn button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.ed { flex: 1; min-height: 190px; background: #fff; border-radius: 18px; padding: 20px; }
.ed p { margin: 0; font-size: 15px; line-height: 1.75; }
.ed .ph { color: #a0a5ad; font-size: 14px; }
.cur { display: inline-block; width: 2px; height: 1.1em; background: var(--ink); vertical-align: text-bottom; margin-left: 2px; animation: bl 1s steps(1) infinite; }
@keyframes bl { 50% { opacity: 0; } }

.bar { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.gen { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 99px; background: #fff; font-size: 13px; font-weight: 600; transition: transform .2s, box-shadow .3s; }
.gen.press { transform: scale(.94); box-shadow: inset 0 0 0 1.5px var(--ink); }
.send { padding: 10px 22px; border-radius: 99px; background: rgba(20, 18, 15, .25); color: #fff; font-size: 13px; font-weight: 600; transition: background .4s; }
.send.hot { background: var(--ink); }

.side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.sj { background: var(--butter); border-radius: 26px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.sj ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.sj li { background: #fff; border-radius: 12px; padding: 10px 14px; font-size: 13.5px; opacity: .25; transform: translateY(4px); transition: all .4s ease; border: 1.5px solid transparent; }
.sj li.show { opacity: 1; transform: none; }
.sj li.pick { border-color: var(--ink); font-weight: 500; }

.rp { background: var(--mint); border-radius: 26px; padding: 20px; display: flex; flex-direction: column; gap: 12px; opacity: .3; transition: opacity .5s; }
.rp.show { opacity: 1; }
.rh { display: flex; justify-content: space-between; align-items: center; }
.sent { font-size: 11.5px; font-weight: 600; padding: 3px 12px; border-radius: 99px; background: #fff; }
.sent.positive { color: var(--mint-i); } .sent.neutral { color: var(--butter-i); }
.rp p { margin: 0; background: #fff; border-radius: 4px 16px 16px 16px; padding: 12px 16px; font-size: 14px; line-height: 1.55; min-height: 46px; }
.mt { display: flex; gap: 5px; }
.mt i { flex: 1; height: 6px; border-radius: 3px; background: rgba(255, 255, 255, .7); transition: background .4s; }
.mt i.on { background: var(--mint-i); }

.lr { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 16px; border: 1px solid var(--line); font-size: 13px; color: var(--muted); }
.lr i { width: 8px; height: 8px; border-radius: 2px; background: var(--ink); }

@media (max-width: 900px) {
  .stage { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .ai { padding: 64px 16px; }
  .cp, .sj, .rp { padding: 16px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .stage { opacity: 1; transform: none; transition: none; }
  .cur { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
