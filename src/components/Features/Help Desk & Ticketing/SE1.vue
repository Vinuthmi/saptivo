<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "TicketsFromEveryChannelSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref(false);
let io = null;
const timers = [];

/* Images: put your files in /public/saptivo/images/features/ and change the names here.
   If a file is missing, the person's initials are shown instead. */
const imgs = {
  owners: [
    "/saptivo/images/features/owner-1.webp",
    "/saptivo/images/features/owner-2.webp",
    "/saptivo/images/features/owner-3.webp",
  ],
};
const ownerOk = reactive([true, true, true]);

/* All names, messages and times are SAMPLE data. */
const icons = {
  email: "M4 6h16v12H4zM4 7l8 6 8-6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  wa: "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z",
  portal: "M3 5h18v11H3zM8 20h8M12 16v4",
};
const channels = [
  { k: "email", n: "Email", who: "Mr. Perera, Acme Ltd", text: "AC not cooling at our Colombo 03 branch.", t: "9:02", tone: "sky" },
  { k: "phone", n: "Phone", who: "Call logged · 2:14", text: "“Still not cooling, please send someone.”", t: "9:40", tone: "lav" },
  { k: "wa", n: "WhatsApp", who: "Acme Ltd", text: "Our AC stopped working this morning. Photo attached.", t: "9:12", tone: "mint" },
  { k: "portal", n: "Customer portal", who: "Request updated", text: "Outdoor unit not starting.", t: "9:55", tone: "butter" },
];

/* ticket fields */
const categories = ["Breakdown", "Installation", "Billing", "Enquiry"];
const category = ref(0);
const priorities = [
  { n: "Low", tone: "mint" },
  { n: "Medium", tone: "sky" },
  { n: "High", tone: "butter" },
  { n: "Critical", tone: "rose" },
];
const priority = ref(2);
const owners = [
  { n: "Nimal P.", i: "NP" },
  { n: "Kasun R.", i: "KR" },
  { n: "Dilani S.", i: "DS" },
];
const owner = ref(0);

/* the thread: customer messages (in the order they arrive) + one agent reply */
const arrived = ref([]);
const thread = computed(() =>
  channels
    .filter((c) => arrived.value.includes(c.k))
    .sort((a, b) => a.t.localeCompare(b.t, undefined, { numeric: true }))
);
const last = ref("");
function send(k) {
  if (!arrived.value.includes(k)) arrived.value.push(k);
  last.value = k;
}
function replay() {
  timers.forEach(clearTimeout);
  timers.length = 0;
  arrived.value = [];
  last.value = "";
  ["email", "wa", "phone", "portal"].forEach((k, i) => timers.push(setTimeout(() => send(k), 500 + i * 1300)));
}

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    seen.value = true;
    arrived.value = channels.map((c) => c.k);
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        seen.value = true;
        io.disconnect();
        replay();
      }
    },
    { threshold: 0.25 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
  timers.forEach(clearTimeout);
});
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Tickets from</span> <span class="l2">every channel</span></h2>
        <p class="sub">
          Customers reach you by email, phone, WhatsApp and the customer portal. Saptivo turns each request into a ticket with a category, priority (low, medium, high or critical) and owner, and keeps the whole conversation threaded inside it.
        </p>
      </header>

      <div class="board" :class="{ on: seen }">
        <!-- channels -->
        <div class="chs">
          <small class="cap">Incoming requests</small>
          <button
            v-for="c in channels"
            :key="c.k"
            type="button"
            class="ch"
            :class="['tone-' + c.tone, { sent: arrived.includes(c.k), pulse: last === c.k }]"
            :aria-label="`Send a sample ${c.n} request`"
            @click="send(c.k)"
          >
            <span class="ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="icons[c.k]" /></svg>
            </span>
            <span class="tt">
              <b>{{ c.n }}</b>
              <em>{{ c.text }}</em>
            </span>
            <i class="st">{{ arrived.includes(c.k) ? "In ticket" : "Tap to send" }}</i>
          </button>
        </div>

        <!-- ticket -->
        <div class="tk">
          <div class="th">
            <div>
              <small>TK-3187</small>
              <b>Air conditioner not cooling</b>
            </div>
            <button type="button" class="rp" @click="replay">Replay</button>
          </div>

          <div class="fields">
            <div class="f">
              <small>Category</small>
              <div class="opts" role="group" aria-label="Category">
                <button
                  v-for="(c, k) in categories"
                  :key="c"
                  type="button"
                  :class="{ sel: category === k }"
                  :aria-pressed="category === k"
                  @click="category = k"
                >
                  {{ c }}
                </button>
              </div>
            </div>

            <div class="f">
              <small>Priority</small>
              <div class="opts pr" role="group" aria-label="Priority">
                <button
                  v-for="(p, k) in priorities"
                  :key="p.n"
                  type="button"
                  :class="['tone-' + p.tone, { sel: priority === k }]"
                  :aria-pressed="priority === k"
                  @click="priority = k"
                >
                  {{ p.n }}
                </button>
              </div>
            </div>

            <div class="f">
              <small>Owner</small>
              <div class="opts ow" role="group" aria-label="Owner">
                <button
                  v-for="(o, k) in owners"
                  :key="o.n"
                  type="button"
                  :class="{ sel: owner === k }"
                  :aria-pressed="owner === k"
                  @click="owner = k"
                >
                  <span class="av">
                    <img v-if="ownerOk[k]" :src="imgs.owners[k]" alt="" @error="ownerOk[k] = false" />
                    <template v-else>{{ o.i }}</template>
                  </span>
                  {{ o.n }}
                </button>
              </div>
            </div>
          </div>

          <div class="thread" aria-live="polite">
            <small class="cap">Conversation</small>
            <p v-if="!thread.length" class="empty">Waiting for the first request…</p>

            <TransitionGroup name="m" tag="ul">
              <li v-for="m in thread" :key="m.k" class="msg" :class="'tone-' + m.tone">
                <span class="ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="icons[m.k]" /></svg>
                </span>
                <div>
                  <small>{{ m.n }} · {{ m.who }}</small>
                  <p>{{ m.text }}</p>
                </div>
                <time>{{ m.t }}</time>
              </li>
              <li v-if="thread.length" key="reply" class="msg me">
                <div>
                  <small>{{ owners[owner].n }} · Saptivo ticket</small>
                  <p>We have scheduled a technician visit for tomorrow, 10 am.</p>
                </div>
                <time>10:05</time>
              </li>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hw {
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
.wrap { max-width: 1080px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 62ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }

.board { display: grid; grid-template-columns: minmax(0, 360px) minmax(0, 1fr); gap: 40px; padding: 20px; border-radius: 34px; background: #faf9ff; border: 1.5px solid var(--line); opacity: .35; transform: translateY(14px); transition: all .8s cubic-bezier(.3, .8, .3, 1); }
.board.on { opacity: 1; transform: none; box-shadow: 0 24px 54px rgba(60, 50, 120, .1); }
.cap { display: block; margin: 0 0 10px; font-size: 10.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

/* channels */
.chs { display: flex; flex-direction: column; gap: 10px; justify-content: center; }
.ch { position: relative; display: grid; grid-template-columns: 40px 1fr; gap: 12px; align-items: center; padding: 12px 14px; border: 1.5px solid var(--line); border-radius: 20px; background: #fff; font: inherit; text-align: left; color: var(--ink); cursor: pointer; transition: border-color .3s, box-shadow .3s, transform .3s; }
.ch:hover { transform: translateY(-1px); }
.ch:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.ch .ico { width: 40px; height: 40px; border-radius: 13px; display: grid; place-items: center; background: var(--t); color: var(--ti); }
.ch .ico svg { width: 19px; height: 19px; }
.ch .tt { min-width: 0; }
.ch b { display: block; font-size: 13.5px; }
.ch em { display: block; font-style: normal; font-size: 11.5px; line-height: 1.4; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ch .st { grid-column: 2; font-style: normal; font-size: 10.5px; font-weight: 600; color: #a29fb2; }
.ch.sent { border-color: var(--ti); box-shadow: 0 10px 24px color-mix(in srgb, var(--ti) 16%, transparent); }
.ch.sent .st { color: var(--ti); }
.ch.pulse { animation: pulse .7s ease; }
@keyframes pulse { 40% { transform: scale(1.025); } }
/* connector from each channel to the ticket */
.ch::after { content: ""; position: absolute; left: 100%; top: 50%; width: 41px; height: 3px; margin-top: -1.5px; border-radius: 3px; background: #e3dff2; transition: background .5s; }
.ch.sent::after { background: linear-gradient(90deg, var(--ti), var(--lav-i)); }

/* ticket */
.tk { background: #fff; border-radius: 26px; padding: 20px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.th { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.th small { display: block; font-size: 11px; font-weight: 600; letter-spacing: .05em; color: var(--muted); }
.th b { display: block; font-size: 17px; letter-spacing: -.01em; }
.rp { padding: 7px 14px; border: 1.5px solid var(--line); border-radius: 99px; background: #fff; font: inherit; font-size: 11.5px; font-weight: 600; color: var(--muted); cursor: pointer; transition: border-color .3s, color .3s; }
.rp:hover { border-color: var(--lav-i); color: var(--lav-i); }
.rp:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.fields { display: grid; gap: 12px; padding: 14px; border-radius: 18px; background: #faf9ff; }
.f { display: grid; grid-template-columns: 78px 1fr; gap: 10px; align-items: center; }
.f small { font-size: 11.5px; font-weight: 600; color: var(--muted); }
.opts { display: flex; flex-wrap: wrap; gap: 6px; }
.opts button { display: inline-flex; align-items: center; gap: 7px; padding: 7px 13px; border: 1.5px solid transparent; border-radius: 99px; background: #fff; font: inherit; font-size: 12px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .25s; }
.opts button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.opts button.sel { background: var(--ink); border-color: var(--ink); color: #fff; }
.opts.pr button { background: var(--t); color: var(--ti); }
.opts.pr button.sel { border-color: var(--ti); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ti) 20%, transparent); background: var(--t); color: var(--ti); }
.opts.ow button { padding: 4px 13px 4px 4px; }
.opts.ow button.sel { background: var(--ink); color: #fff; }
.av { width: 24px; height: 24px; border-radius: 50%; overflow: hidden; display: grid; place-items: center; background: var(--lav); color: var(--lav-i); font-size: 9px; font-weight: 700; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }

.thread ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.empty { margin: 0; padding: 18px; border-radius: 16px; border: 1.5px dashed #ddd8f2; text-align: center; font-size: 12.5px; color: #b3b0c4; }
.msg { display: flex; gap: 10px; align-items: flex-start; padding: 10px 12px; border-radius: 18px; background: #f6f4ff; }
.msg .ico { flex: none; width: 30px; height: 30px; border-radius: 10px; display: grid; place-items: center; background: var(--t); color: var(--ti); }
.msg .ico svg { width: 15px; height: 15px; }
.msg > div { flex: 1; min-width: 0; }
.msg small { display: block; font-size: 10.5px; font-weight: 600; color: var(--muted); }
.msg p { margin: 2px 0 0; font-size: 12.5px; line-height: 1.5; }
.msg time { flex: none; font-size: 10.5px; color: #a29fb2; font-variant-numeric: tabular-nums; }
.msg.me { margin-left: 34px; background: var(--ink); color: #fff; }
.msg.me small, .msg.me time { color: rgba(255, 255, 255, .6); }

.m-enter-active { transition: all .5s cubic-bezier(.3, .8, .3, 1); }
.m-enter-from { opacity: 0; transform: translateY(12px); }
.m-move { transition: transform .5s cubic-bezier(.3, .8, .3, 1); }

.note { margin: 26px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 900px) {
  .board { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .ch::after { display: none; }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .board { padding: 12px; border-radius: 28px; }
  .tk { padding: 16px; }
  .f { grid-template-columns: 1fr; gap: 6px; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .ch.pulse { animation: none; }
  .m-enter-active, .m-move { transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
