<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "BotTriageSection" });

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
const lanes = [
  { k: "sales", t: "Sales", tone: "lav", n: 3, who: "Hasitha", photo: base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg", old: ["Quote for 8 laptops", "Price list request"] },
  { k: "support", t: "Support", tone: "rose", n: 2, who: "Nimali", photo: base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG", old: ["Refund status", "Wrong item sent"] },
  { k: "service", t: "Service desk", tone: "mint", n: 4, who: "Kasun", photo: base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg", old: ["AC repair visit", "Warranty check"] },
];
const photoOk = ref([true, true, true]);

const scenarios = [
  { tab: "Sales enquiry", lane: 0, time: "10:15 am", open: true, ask: "Hi, I'd like a quote for 20 units.", tag: "Sales enquiry", route: "Connecting you with our sales team.", card: "Quote for 20 units" },
  { tab: "Complaint", lane: 1, time: "11:40 am", open: true, ask: "My order arrived damaged.", tag: "Complaint", route: "So sorry about that. Passing you to support.", card: "Damaged order" },
  { tab: "Service request", lane: 2, time: "2:05 pm", open: true, ask: "I need to book a service visit.", tag: "Service request", route: "Sending this to our service desk.", card: "Book service visit" },
  { tab: "Out of hours", lane: -1, time: "9:42 pm", open: false, ask: "Hi, are you open tomorrow?", tag: "After hours", route: "Thanks for messaging us! We're closed now and will reply from 8:30 am.", card: "" },
];

const cur = computed(() => scenarios[sc.value]);
const landed = (i) => ph.value >= 5 && cur.value.lane === i;
const routing = (i) => ph.value >= 4 && cur.value.lane === i;

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
  <section ref="root" class="bt" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2>One inbox that routes messages automatically</h2>
        <p>
          An auto-responder greets customers, asks what they need and routes the chat: sales enquiries to sales,
          complaints to support, service requests to the service desk. Out-of-hours messages get an instant
          acknowledgement.
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

      <div class="board" role="img" aria-label="A chat is greeted by a bot and routed to sales, support or the service desk">
        <!-- phone / chat -->
        <div class="chat">
          <div class="ctop">
            <b class="logo">S</b>
            <div>
              <strong>Saptivo Store</strong>
              <span>Auto-responder</span>
            </div>
            <span class="clock" :class="cur.open ? 'open' : 'closed'">
              <i></i>{{ cur.time }} · {{ cur.open ? "Open" : "Closed" }}
            </span>
          </div>

          <div class="msgs">
            <Transition name="msg">
              <div v-if="cur.open && ph >= 0" :key="'g' + sc" class="m bot">
                <small>Bot</small>
                <p>Hi! Welcome to Saptivo Store. What do you need today?</p>
              </div>
            </Transition>
            <Transition name="msg">
              <div v-if="cur.open && ph >= 1" :key="'q' + sc" class="m bot quick">
                <span class="qr">Sales</span><span class="qr">Support</span><span class="qr">Service</span>
              </div>
            </Transition>
            <Transition name="msg">
              <div v-if="ph >= 2" :key="'c' + sc" class="m cus"><p>{{ cur.ask }}</p></div>
            </Transition>
            <Transition name="msg">
              <div v-if="ph >= 3" :key="'t' + sc" class="m bot">
                <small>Bot</small>
                <span class="tag" :class="cur.open ? 'detect' : 'late'">{{ cur.open ? "Detected: " : "" }}{{ cur.tag }}</span>
                <p>{{ cur.route }}</p>
              </div>
            </Transition>
          </div>

          <div class="composer">
            <span>Type a message</span><b>Send</b>
          </div>
        </div>

        <!-- bot router + lanes -->
        <div class="routing">
          <div class="rows">
            <div v-for="(l, i) in lanes" :key="l.k" class="row" :class="['tone-' + l.tone, { hot: routing(i), land: landed(i) }]">
              <div class="arrow">
                <i></i>
              </div>
              <div class="lane">
                <div class="lh">
                  <span class="ava">
                    <img v-if="photoOk[i]" :src="l.photo" alt="" @error="photoOk[i] = false" />
                    <b v-else>{{ l.who[0] }}</b>
                  </span>
                  <div>
                    <strong>{{ l.t }}</strong>
                    <span>{{ l.who }} on shift</span>
                  </div>
                  <em class="cnt">{{ l.n + (landed(i) ? 1 : 0) }}</em>
                </div>
                <div class="cards">
                  <Transition name="drop">
                    <div v-if="landed(i)" class="card fresh">{{ cur.card }}<small>Just now · routed by bot</small></div>
                  </Transition>
                  <div v-for="o in l.old" :key="o" class="card">{{ o }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="bot-chip" :class="{ late: !cur.open && ph >= 3 }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 8V5M9 13h.01M15 13h.01M9 16h6" /></svg>
            <span v-if="cur.open">Bot reads the message and picks a queue</span>
            <span v-else-if="ph >= 3">Acknowledged instantly · queued for opening time</span>
            <span v-else>Bot reads the message</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bt {
  --ink: #17191d; --muted: #666b73; --line: #ece9f3;
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
.head { text-align: center; max-width: 760px; margin: 0 auto 32px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--sky); color: var(--sky-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { font-size: clamp(34px, 3.4vw, 56px); line-height: 1.08; font-weight: 500; margin: 0 0 16px; letter-spacing: -0.06em; font-family: "Inter", system-ui, sans-serif; text-wrap: balance; }
.head p { margin: 0; font-size: 16px; line-height: 1.65; color: var(--muted); }

.head, .tabs, .board { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .tabs, .in .board { opacity: 1; transform: none; }
.in .tabs { transition-delay: .08s; }
.in .board { transition-delay: .16s; }

.tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 24px; }
.tab { all: unset; box-sizing: border-box; cursor: pointer; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 99px; background: #f3f1fa; color: var(--muted); transition: background .3s, color .3s; }
.tab:hover { background: #e9e6f5; }
.tab.act { background: var(--ink); color: #fff; }
.tab:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.board { display: grid; grid-template-columns: 340px 1fr; gap: 28px; background: linear-gradient(160deg, #f6f4ff, #eef6ff 60%, #eefaf3); border-radius: 28px; padding: 28px; align-items: stretch; }

/* chat */
.chat { background: #fff; border-radius: 20px; box-shadow: 0 18px 44px rgba(60, 50, 120, .12); display: flex; flex-direction: column; min-height: 470px; overflow: hidden; }
.ctop { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--line); }
.logo { width: 34px; height: 34px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; font-size: 13px; }
.ctop strong { display: block; font-size: 13px; }
.ctop > div span { font-size: 11px; color: var(--muted); }
.clock { margin-left: auto; display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 99px; white-space: nowrap; transition: all .4s; }
.clock i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.clock.open { background: var(--mint); color: var(--mint-i); }
.clock.closed { background: var(--butter); color: var(--butter-i); }

.msgs { flex: 1; padding: 14px; display: flex; flex-direction: column; gap: 9px; background: #fbfaff; }
.m { max-width: 82%; }
.m p { margin: 0; font-size: 13px; line-height: 1.45; padding: 9px 12px; border-radius: 14px; }
.m small { display: block; font-size: 10px; font-weight: 600; color: var(--muted); margin-bottom: 3px; }
.bot { align-self: flex-start; }
.bot p { background: #fff; border: 1px solid var(--line); border-top-left-radius: 4px; }
.cus { align-self: flex-end; }
.cus p { background: var(--mint); border-top-right-radius: 4px; }
.quick { display: flex; gap: 6px; flex-wrap: wrap; }
.qr { font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 99px; border: 1px solid var(--lav-i); color: var(--lav-i); background: #fff; }
.tag { display: inline-block; font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 99px; margin-bottom: 4px; }
.tag.detect { background: var(--lav); color: var(--lav-i); }
.tag.late { background: var(--butter); color: var(--butter-i); }
.composer { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-top: 1px solid var(--line); }
.composer span { flex: 1; font-size: 12px; color: #9a9fa8; background: #f5f4fa; border-radius: 99px; padding: 9px 14px; }
.composer b { font-size: 12px; background: var(--ink); color: #fff; padding: 8px 14px; border-radius: 99px; }

/* routing */
.routing { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.rows { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.row { flex: 1; display: grid; grid-template-columns: 90px 1fr; align-items: center; min-height: 130px; }
.arrow { position: relative; height: 2px; margin: 0 8px 0 0; background: repeating-linear-gradient(90deg, #cfcbe0 0 6px, transparent 6px 12px); transition: background .3s; }
.arrow::after { content: ""; position: absolute; right: -2px; top: -4px; border-left: 8px solid #cfcbe0; border-top: 5px solid transparent; border-bottom: 5px solid transparent; transition: border-color .3s; }
.arrow i { position: absolute; top: -4px; left: 0; width: 10px; height: 10px; border-radius: 50%; background: var(--ti); opacity: 0; }
.row.hot .arrow { background: var(--ti); }
.row.hot .arrow::after { border-left-color: var(--ti); }
.row.hot .arrow i { animation: go 1.1s ease-out forwards; }
.row.land .arrow i { animation: none; opacity: 0; }
@keyframes go { 0% { left: 0; opacity: 1; } 100% { left: calc(100% - 10px); opacity: 0; } }

.lane { background: #fff; border-radius: 18px; border: 1px solid var(--line); padding: 14px; transition: border-color .35s, box-shadow .35s; height: 100%; box-sizing: border-box; }
.row.hot .lane { border-color: var(--ti); box-shadow: 0 10px 28px rgba(60, 50, 120, .1); }
.lh { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.lh strong { display: block; font-size: 14px; }
.lh > div span { font-size: 11px; color: var(--muted); }
.ava { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; background: var(--t); color: var(--ti); display: grid; place-items: center; flex: none; font-weight: 700; font-size: 13px; }
.ava img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.cnt { margin-left: auto; font-style: normal; font-size: 12px; font-weight: 700; min-width: 26px; text-align: center; padding: 3px 8px; border-radius: 99px; background: var(--t); color: var(--ti); }
.cards { display: flex; flex-direction: column; gap: 6px; position: relative; }
.card { font-size: 12px; padding: 8px 12px; border-radius: 10px; background: #f6f5fb; color: var(--muted); }
.card.fresh { background: var(--t); color: var(--ink); font-weight: 600; box-shadow: 0 0 0 1.5px var(--ti) inset; }
.card small { display: block; font-size: 10px; font-weight: 500; color: var(--ti); margin-top: 1px; }

.bot-chip { display: flex; align-items: center; gap: 10px; align-self: flex-start; font-size: 12px; font-weight: 500; background: var(--ink); color: #fff; padding: 9px 16px; border-radius: 99px; transition: background .4s, color .4s; }
.bot-chip svg { width: 18px; height: 18px; flex: none; }
.bot-chip.late { background: var(--butter); color: var(--butter-i); }

.msg-enter-active { transition: all .4s ease; }
.msg-enter-from { opacity: 0; transform: translateY(10px); }
.drop-enter-active { transition: all .5s cubic-bezier(.2, 1.2, .4, 1); }
.drop-enter-from { opacity: 0; transform: translateY(-14px) scale(.96); }

@media (max-width: 900px) {
  .board { grid-template-columns: 1fr; padding: 18px; }
  .chat { min-height: 420px; }
  .row { grid-template-columns: 40px 1fr; min-height: 0; }
}
@media (max-width: 560px) {
  .bt { padding: 64px 16px; }
  .clock { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .tabs, .board { opacity: 1; transform: none; transition: none; }
  .row.hot .arrow i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
