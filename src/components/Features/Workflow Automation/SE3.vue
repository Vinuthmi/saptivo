<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ActionsSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0); // 0..5 running, 6 all done
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;
const LAST = 8;

const base = "/saptivo/images/features/";
const photos = [
  base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
  base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
];
const ok = ref([true, true]);

const items = [
  { k: "msg", tone: "lav", short: "Message", t: "Send an email, WhatsApp template or SMS" },
  { k: "task", tone: "mint", short: "Task", t: "Create a task or follow-up for a user" },
  { k: "upd", tone: "butter", short: "Update", t: "Update a field or move a record" },
  { k: "note", tone: "rose", short: "Notify", t: "Notify a user or manager" },
  { k: "call", tone: "sky", short: "AI call", t: "Start an AI voice call through Vodia, such as a payment or visit reminder" },
  { k: "hook", tone: "mint", short: "Webhook", t: "Call a webhook to update another system" },
];

// 0 = waiting, 1 = running, 2 = done
const s = (i) => (step.value > i ? 2 : step.value === i ? 1 : 0);

function advance() {
  if (step.value < LAST - 1) step.value++;
  else if (!manual.value) step.value = 0;
}
function pick(i) {
  manual.value = true;
  step.value = i;
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
  <section ref="root" class="ac" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <span class="eyebrow">Automation</span>
        <h2><span class="l1">Actions</span></h2>
      </header>

      <!-- run bar -->
      <ol class="run" :style="{ '--p': Math.min(step, 5) / 5 }" aria-label="A workflow running its actions in order">
        <li v-for="(it, i) in items" :key="it.k" :class="['tone-' + it.tone, { act: s(i) === 1, done: s(i) === 2 }]">
          <button type="button" @click="pick(i)">
            <span class="dot">
              <svg v-if="s(i) === 2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
              <template v-else>{{ i + 1 }}</template>
            </span>
            <span class="lb">{{ it.short }}</span>
          </button>
        </li>
      </ol>

      <ul class="grid">
        <li v-for="(it, i) in items" :key="it.k" class="card" :class="['tone-' + it.tone, { act: s(i) === 1, done: s(i) === 2 }]" :style="{ '--d': i * 60 + 'ms' }">
          <div class="top">
            <span class="no">{{ i + 1 }}</span>
            <span class="st">{{ s(i) === 2 ? "Done" : s(i) === 1 ? "Running" : "Waiting" }}</span>
          </div>
          <h3>{{ it.t }}</h3>

          <div class="mini" aria-hidden="true">
            <!-- 1 message -->
            <template v-if="it.k === 'msg'">
              <div class="chs">
                <span class="ch" :class="{ on: s(i) >= 1 }">Email</span>
                <span class="ch" :class="{ on: s(i) >= 1 }">WhatsApp</span>
                <span class="ch" :class="{ on: s(i) >= 1 }">SMS</span>
              </div>
              <p class="ln" :class="{ ok: s(i) === 2 }">{{ s(i) === 2 ? "✓ Sent on all three channels" : s(i) === 1 ? "Sending…" : "Choose a channel" }}</p>
            </template>

            <!-- 2 task -->
            <template v-else-if="it.k === 'task'">
              <Transition name="pop" mode="out-in">
                <div v-if="s(i) >= 1" key="t" class="task">
                  <i :class="{ chk: s(i) === 2 }"></i>
                  <div><strong>Call Dilani about the quotation</strong><span>Due tomorrow</span></div>
                  <span class="av">
                    <img v-if="ok[0]" :src="photos[0]" alt="" @error="ok[0] = false" />
                    <b v-else>N</b>
                  </span>
                </div>
                <div v-else key="e" class="empty">No task yet</div>
              </Transition>
            </template>

            <!-- 3 update -->
            <template v-else-if="it.k === 'upd'">
              <div class="deal">
                <strong>Order #1042</strong>
                <Transition name="swap" mode="out-in">
                  <em :key="s(i) === 2" :class="{ moved: s(i) === 2 }">{{ s(i) === 2 ? "Negotiation" : "Proposal" }}</em>
                </Transition>
              </div>
              <p class="ln" :class="{ ok: s(i) === 2 }">{{ s(i) === 2 ? "✓ Stage moved · Priority set to High" : s(i) === 1 ? "Updating the record…" : "Stage: Proposal" }}</p>
            </template>

            <!-- 4 notify -->
            <template v-else-if="it.k === 'note'">
              <div class="bell" :class="{ ring: s(i) === 1, on: s(i) === 2 }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9M10 21h4" /></svg>
                <div>
                  <strong>{{ s(i) === 2 ? "Nimali and the manager were notified" : "No alerts" }}</strong>
                  <span>{{ s(i) === 2 ? "Deal moved to Negotiation" : s(i) === 1 ? "Sending notification…" : "Nothing to show yet" }}</span>
                </div>
              </div>
            </template>

            <!-- 5 AI call -->
            <template v-else-if="it.k === 'call'">
              <div class="vc">
                <span class="av big">
                  <img v-if="ok[1]" :src="photos[1]" alt="" @error="ok[1] = false" />
                  <b v-else>R</b>
                </span>
                <div>
                  <strong>Ravi Fernando</strong>
                  <span v-if="s(i) === 0">Payment reminder · ready</span>
                  <span v-else-if="s(i) === 1" class="live">Calling through Vodia…</span>
                  <span v-else class="ok2">Promise to pay · Friday</span>
                </div>
                <span class="wv" :class="{ on: s(i) === 1 }"><i></i><i></i><i></i><i></i><i></i></span>
              </div>
            </template>

            <!-- 6 webhook -->
            <template v-else>
              <code class="code">POST https://erp.example.com/orders</code>
              <p class="ln" :class="{ ok: s(i) === 2 }">{{ s(i) === 2 ? "✓ 200 OK · other system updated" : s(i) === 1 ? "Sending request…" : "Ready to send" }}</p>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.ac {
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
.head { text-align: center; margin: 0 auto 40px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--mint); color: var(--mint-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0; font-size: clamp(40px, 4.6vw, 64px); font-weight: 500; line-height: 1.08; letter-spacing: -0.035em; }
h2 span { display: block; }
.ac h2 .l1 { color: #111111 !important; opacity: 1; }

.head, .run, .card { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .run, .in .card { opacity: 1; transform: none; }
.in .run { transition-delay: .08s; }
.in .card { transition-delay: calc(.15s + var(--d)); }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); --tb: #fff5f8; }

/* run bar */
.run { list-style: none; margin: 0 0 28px; padding: 0; display: grid; grid-template-columns: repeat(6, 1fr); position: relative; }
.run::before { content: ""; position: absolute; left: calc(100% / 12); right: calc(100% / 12); top: 19px; height: 3px; border-radius: 3px; background: #e9e6f2; }
.run::after { content: ""; position: absolute; left: calc(100% / 12); top: 19px; height: 3px; border-radius: 3px; background: var(--ink); width: calc((100% - 100% / 6) * var(--p)); transition: width .7s ease; }
.run button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; z-index: 1; }
.run button:focus-visible .dot { outline: 2px solid var(--ink); outline-offset: 3px; }
.dot { width: 40px; height: 40px; border-radius: 50%; background: #fff; border: 3px solid #e9e6f2; color: var(--muted); display: grid; place-items: center; font-size: 14px; font-weight: 700; transition: all .4s; }
.dot svg { width: 16px; height: 16px; }
.run li.act .dot { background: var(--t); border-color: var(--ti); color: var(--ti); transform: scale(1.12); }
.run li.done .dot { background: var(--ink); border-color: var(--ink); color: #fff; }
.lb { font-size: 12px; font-weight: 600; color: var(--muted); transition: color .3s; }
.run li.act .lb, .run li.done .lb { color: var(--ink); }

/* cards */
.grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.card { background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 14px; transition: background .4s, border-color .4s, box-shadow .4s, opacity .6s ease, transform .6s ease; }
.card.act { background: var(--tb); border-color: var(--ti); box-shadow: 0 18px 44px rgba(60, 50, 120, .12); }
.in .card.act { transform: translateY(-4px); }
.top { display: flex; align-items: center; justify-content: space-between; }
.no { width: 28px; height: 28px; border-radius: 50%; background: var(--t); color: var(--ti); font-size: 12px; font-weight: 700; display: grid; place-items: center; }
.st { font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #f3f1fa; color: var(--muted); transition: all .3s; }
.card.act .st { background: var(--t); color: var(--ti); }
.card.done .st { background: var(--mint); color: var(--mint-i); }
h3 { margin: 0; font-size: 16px; line-height: 1.5; font-weight: 600; letter-spacing: -.01em; }

.mini { margin-top: auto; background: var(--tb); border-radius: 16px; padding: 14px; min-height: 110px; display: flex; flex-direction: column; gap: 10px; justify-content: center; transition: background .4s; }
.card.act .mini { background: #fff; }
.ln { margin: 0; font-size: 12px; color: var(--muted); font-weight: 500; transition: color .3s; }
.ln.ok { color: var(--mint-i); font-weight: 600; }
.chs { display: flex; gap: 6px; flex-wrap: wrap; }
.ch { font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 99px; background: #fff; color: var(--muted); transition: all .35s; }
.card.act .ch { background: #f3f1fa; }
.ch.on { background: var(--ink) !important; color: #fff; }

.empty { font-size: 12px; color: var(--muted); text-align: center; padding: 18px 0; border: 1.5px dashed #d9d6e8; border-radius: 12px; }
.task { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; }
.task i { width: 18px; height: 18px; border-radius: 6px; border: 2px solid var(--mint-i); flex: none; position: relative; transition: all .3s; }
.task i.chk { background: var(--mint-i); }
.task i.chk::after { content: ""; position: absolute; left: 4px; top: 0; width: 5px; height: 9px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.task div { flex: 1; min-width: 0; }
.task strong { display: block; font-size: 12px; }
.task span { font-size: 11px; color: var(--muted); }
.av { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-size: 11px; font-weight: 700; flex: none; }
.av.big { width: 42px; height: 42px; font-size: 14px; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

.deal { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; }
.deal strong { font-size: 13px; }
.deal em { font-style: normal; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #eceaf3; color: var(--muted); }
.deal em.moved { background: var(--butter); color: var(--butter-i); }

.bell { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; }
.bell svg { width: 32px; height: 32px; padding: 7px; border-radius: 10px; background: #eceaf3; color: #9a9fa8; flex: none; transition: all .3s; transform-origin: 50% 10%; }
.bell.ring svg { background: var(--rose); color: var(--rose-i); animation: ring .5s ease-in-out infinite; }
.bell.on svg { background: var(--rose); color: var(--rose-i); }
@keyframes ring { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(14deg); } 75% { transform: rotate(-14deg); } }
.bell strong { display: block; font-size: 12px; }
.bell span { font-size: 11px; color: var(--muted); }

.vc { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; }
.vc > div { flex: 1; min-width: 0; }
.vc strong { display: block; font-size: 13px; }
.vc span { font-size: 11px; color: var(--muted); }
.vc .live { color: var(--sky-i); font-weight: 600; }
.vc .ok2 { color: var(--mint-i); font-weight: 600; }
.wv { display: flex; align-items: center; gap: 2px; height: 20px; }
.wv i { width: 3px; height: 5px; border-radius: 2px; background: #d4d0e4; }
.wv.on i { background: var(--sky-i); animation: wv .6s ease-in-out infinite alternate; }
.wv.on i:nth-child(2) { animation-delay: .1s; }
.wv.on i:nth-child(3) { animation-delay: .2s; }
.wv.on i:nth-child(4) { animation-delay: .3s; }
.wv.on i:nth-child(5) { animation-delay: .4s; }
@keyframes wv { to { height: 18px; } }

.code { display: block; font-family: ui-monospace, "SF Mono", monospace; font-size: 11px; background: var(--ink); color: #d6f5e4; padding: 10px 12px; border-radius: 10px; overflow-wrap: anywhere; }

.pop-enter-active { transition: all .4s cubic-bezier(.2, 1.3, .4, 1); }
.pop-leave-active { transition: opacity .15s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(.94); }
.swap-enter-active, .swap-leave-active { transition: all .2s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(4px); }

@media (max-width: 960px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .ac { padding: 64px 16px; }
  .grid { grid-template-columns: 1fr; }
  .run { grid-template-columns: repeat(6, 1fr); }
  .lb { display: none; }
  .dot { width: 34px; height: 34px; font-size: 12px; }
  .run::before, .run::after { top: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .run, .card { opacity: 1; transform: none; transition: none; }
  .bell.ring svg, .wv.on i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
