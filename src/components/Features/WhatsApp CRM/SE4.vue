<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "OfficialApiSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0); // 0 = start, 1..4 = tile n completes
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const avatar = base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg";
const avatarOk = ref(true);

const tiles = [
  { k: "tpl", tone: "lav", t: "Approved message templates for receipts, reminders and offers" },
  { k: "win", tone: "sky", t: "Messages to customers outside the 24-hour reply window using templates" },
  { k: "ver", tone: "mint", t: "Verified business profile" },
  { k: "del", tone: "butter", t: "Reliable delivery and read status" },
];

const done = (i) => step.value >= i + 1;
const act = (i) => step.value === i + 1;
function next() {
  step.value = (step.value + 1) % 5;
}
function pick(i) {
  manual.value = true;
  stop();
  step.value = i + 1;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 2400);
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
  <section ref="root" class="oa" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2>One secure WhatsApp connection</h2>
        <p>
          Saptivo connects to the official WhatsApp Business API, not an unofficial workaround that risks your
          number being banned. That gives you:
        </p>
      </header>

      <!-- connection routes -->
      <div class="routes" aria-hidden="true">
        <div class="route good">
          <div class="node ink"><b>S</b>Saptivo CRM</div>
          <div class="wire">
            <i></i><i></i><i></i>
          </div>
          <div class="node api">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
            Official WhatsApp Business API
          </div>
          <div class="wire">
            <i></i><i></i><i></i>
          </div>
          <div class="node wa">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 20l1.3-4.2A8 8 0 1 1 8.3 19z" /></svg>
            Customer's WhatsApp
          </div>
        </div>
        <div class="route bad">
          <div class="node ink"><b>S</b>Unofficial workaround</div>
          <div class="wire cut"><span>✕</span></div>
          <div class="node ban">Number banned</div>
        </div>
      </div>

      <!-- tiles -->
      <ul class="tiles">
        <li v-for="(it, i) in tiles" :key="it.k" class="tile" :class="['tone-' + it.tone, { act: act(i), done: done(i) }]" :style="{ '--d': i * 80 + 'ms' }">
          <button type="button" @click="pick(i)">
            <div class="mock">
              <!-- 1 templates -->
              <div v-if="it.k === 'tpl'" class="m-tpl">
                <div class="tpl-top">
                  <strong>receipt_ready</strong>
                  <Transition name="swap" mode="out-in">
                    <em v-if="!done(i)" key="p" class="st pend">Pending review</em>
                    <em v-else key="a" class="st ok">Approved</em>
                  </Transition>
                </div>
                <p>Hi {{ "{" }}{{ "1" }}{{ "}" }}, your receipt {{ "{" }}{{ "2" }}{{ "}" }} for {{ "{" }}{{ "3" }}{{ "}" }} is ready. Thank you for shopping with us.</p>
                <span class="btnx">View receipt</span>
              </div>

              <!-- 2 window -->
              <div v-else-if="it.k === 'win'" class="m-win">
                <div class="wtop">
                  <span>Last customer reply: 26 h ago</span>
                  <Transition name="swap" mode="out-in">
                    <em v-if="!done(i)" key="c" class="st bad">24h window closed</em>
                    <em v-else key="o" class="st ok">Template sent</em>
                  </Transition>
                </div>
                <div class="wbody">
                  <Transition name="swap" mode="out-in">
                    <div v-if="!done(i)" key="l" class="locked">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                      Free-text replies are locked
                    </div>
                    <div v-else key="s" class="bub">Hi Dilani, a reminder: your service visit is tomorrow at 10 am.</div>
                  </Transition>
                </div>
              </div>

              <!-- 3 verified -->
              <div v-else-if="it.k === 'ver'" class="m-ver">
                <div class="av">
                  <img v-if="avatarOk" :src="avatar" alt="" @error="avatarOk = false" />
                  <span v-else>S</span>
                </div>
                <div class="vt">
                  <strong>
                    Saptivo Store
                    <Transition name="pop">
                      <svg v-if="done(i)" class="vtick" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M7.5 12.5l3 3 6-7" /></svg>
                    </Transition>
                  </strong>
                  <span>Retail · saptivo.com</span>
                  <em class="st" :class="done(i) ? 'ok' : 'pend'">{{ done(i) ? "Verified business" : "Not verified" }}</em>
                </div>
              </div>

              <!-- 4 delivery -->
              <div v-else class="m-del">
                <div class="bub out">Your order is out for delivery.</div>
                <div class="ticks" :class="{ read: done(i) }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l4 4 7-9" /><path v-if="done(i)" d="M11 15l2 2 8-10" /></svg>
                  <span>{{ done(i) ? "Read · 09:18" : "Sent · 09:17" }}</span>
                </div>
              </div>
            </div>
            <span class="num">{{ i + 1 }}</span>
            <span class="tx">{{ it.t }}</span>
            <span class="prog"><i></i></span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.oa {
  --ink: #17191d; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #f8f6ff 0%, #fff 100%);
  padding: 88px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 740px; margin: 0 auto 40px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--mint); color: var(--mint-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { font-size: clamp(34px, 3.4vw, 56px); line-height: 1.08; font-weight: 500; margin: 0 0 16px; letter-spacing: -0.06em; font-family: "Inter", system-ui, sans-serif; text-wrap: balance; }
.head p { margin: 0; font-size: 16px; line-height: 1.65; color: var(--muted); }

.head, .routes, .tile { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .routes, .in .tile { opacity: 1; transform: none; }
.in .routes { transition-delay: .1s; }
.in .tile { transition-delay: calc(.25s + var(--d)); }

/* routes */
.routes { background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 22px; display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px; box-shadow: 0 14px 40px rgba(60, 50, 120, .07); }
.route { display: flex; align-items: center; gap: 0; }
.node { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; padding: 12px 18px; border-radius: 14px; white-space: nowrap; flex: none; }
.node svg { width: 18px; height: 18px; flex: none; }
.node.ink { background: var(--ink); color: #fff; }
.node.ink b { width: 22px; height: 22px; border-radius: 7px; background: #fff; color: var(--ink); display: grid; place-items: center; font-size: 12px; }
.node.api { background: var(--mint); color: var(--mint-i); box-shadow: 0 0 0 2px var(--mint-i) inset; }
.node.wa { background: var(--sky); color: var(--sky-i); }
.node.ban { background: var(--rose); color: var(--rose-i); }
.wire { position: relative; flex: 1; height: 2px; min-width: 40px; background: repeating-linear-gradient(90deg, #cfcbe0 0 6px, transparent 6px 12px); overflow: visible; }
.wire i { position: absolute; top: -3px; left: 0; width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); animation: go 2.4s linear infinite; }
.wire i:nth-child(2) { animation-delay: .8s; }
.wire i:nth-child(3) { animation-delay: 1.6s; }
@keyframes go { 0% { left: 0; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { left: calc(100% - 8px); opacity: 0; } }
.route.bad { opacity: .75; }
.wire.cut { background: repeating-linear-gradient(90deg, #e4c3cf 0 6px, transparent 6px 12px); }
.wire.cut span { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; border-radius: 50%; background: var(--rose); color: var(--rose-i); display: grid; place-items: center; font-size: 12px; font-weight: 700; }

/* tiles */
.tiles { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }
.tile button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 16px 16px 22px; border-radius: 20px; border: 1px solid var(--line); background: #fff; position: relative; overflow: hidden; transition: background .35s, border-color .35s, transform .35s; }
.tile button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.tile.act button { background: var(--tb); border-color: var(--ti); transform: translateY(-4px); }
.mock { background: var(--tb); border-radius: 14px; padding: 12px; height: 150px; display: flex; flex-direction: column; justify-content: center; gap: 8px; overflow: hidden; }
.num { position: absolute; top: 24px; right: 24px; width: 22px; height: 22px; border-radius: 50%; background: #fff; color: var(--ti); font-size: 11px; font-weight: 700; display: grid; place-items: center; }
.tx { font-size: 14px; font-weight: 500; line-height: 1.5; }
.st { font-style: normal; font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 99px; white-space: nowrap; }
.st.pend { background: var(--butter); color: var(--butter-i); }
.st.ok { background: var(--mint); color: var(--mint-i); }
.st.bad { background: var(--rose); color: var(--rose-i); }
.prog { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; }
.prog i { display: block; height: 100%; width: 0; background: var(--ink); }
.tile.act .prog i { width: 100%; }
.tile.act .prog i { animation: fill 2.4s linear; }
@keyframes fill { from { width: 0; } to { width: 100%; } }

.m-tpl { background: #fff; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 4px 14px rgba(60, 50, 120, .08); }
.tpl-top { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.tpl-top strong { font-size: 11px; font-family: ui-monospace, monospace; }
.m-tpl p { margin: 0; font-size: 11px; line-height: 1.45; color: var(--muted); }
.btnx { align-self: stretch; text-align: center; font-size: 11px; font-weight: 600; color: var(--sky-i); border-top: 1px solid var(--line); padding-top: 6px; }

.m-win { display: flex; flex-direction: column; gap: 8px; }
.wtop { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; font-size: 11px; color: var(--muted); }
.wbody { min-height: 64px; display: flex; align-items: center; }
.locked { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--muted); background: #fff; border: 1px dashed #cfcbe0; border-radius: 12px; padding: 10px 12px; width: 100%; }
.locked svg { width: 15px; height: 15px; flex: none; }
.bub { font-size: 11px; line-height: 1.45; background: var(--mint); padding: 9px 12px; border-radius: 12px; border-top-right-radius: 3px; }

.m-ver { display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 12px; padding: 12px; box-shadow: 0 4px 14px rgba(60, 50, 120, .08); }
.av { width: 52px; height: 52px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.vt { display: flex; flex-direction: column; gap: 3px; align-items: flex-start; min-width: 0; }
.vt strong { font-size: 13px; display: flex; align-items: center; gap: 5px; }
.vt > span { font-size: 11px; color: var(--muted); }
.vtick { width: 16px; height: 16px; fill: var(--sky-i); }
.vtick path { fill: none; stroke: #fff; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }

.m-del { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.bub.out { max-width: 90%; }
.ticks { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--muted); transition: color .35s; }
.ticks svg { width: 20px; height: 20px; }
.ticks.read { color: var(--sky-i); }

.swap-enter-active, .swap-leave-active { transition: all .25s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(5px); }
.pop-enter-active { transition: all .4s cubic-bezier(.2, 1.5, .4, 1); }
.pop-enter-from { opacity: 0; transform: scale(.3); }

@media (max-width: 1000px) {
  .tiles { grid-template-columns: repeat(2, 1fr); }
  .routes { overflow-x: auto; }
  .route { min-width: 640px; }
}
@media (max-width: 560px) {
  .oa { padding: 64px 16px; }
  .tiles { grid-template-columns: 1fr; }
  .routes { padding: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .routes, .tile { opacity: 1; transform: none; transition: none; }
  .wire i { animation: none; opacity: 1; left: 50%; }
  .tile.act .prog i { animation: none; width: 100%; }
  * { transition-duration: 0s !important; }
}
</style>
