<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhatsAppCrmBeatsSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;

const points = [
  { t: "Several team members answer from one business number", c: "lav", ic: "M16 11a4 4 0 1 0-8 0M4 20a8 8 0 0 1 16 0" },
  { t: "Every chat is saved to the customer's history permanently", c: "sky", ic: "M5 4h14v16H5zM9 9h6M9 13h6" },
  { t: "Managers see response times and unanswered chats", c: "mint", ic: "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" },
  { t: "Leads from WhatsApp enter your pipeline automatically", c: "butter", ic: "M4 6h16M7 12h10M10 18h4" },
  { t: "Quotes, invoices and receipts are sent from the same screen", c: "rose", ic: "M7 3h8l4 4v14H7zM15 3v4h4M10 13h6M10 17h4" },
];

const chats = [
  { n: "Dilani Perera", m: "Yes please, Colombo 05", id: 0 },
  { n: "Hasitha Traders", m: "Can you resend the invoice?", id: 1 },
  { n: "Ravi Fernando", m: "Is the price still valid?", id: 2 },
  { n: "Sewwandi K.", m: "Thank you!", id: 3 },
];

const msgs = [
  { id: 1, at: 0, who: "c", text: "Hi, do you have the 12kg gas cylinder in stock?", time: "10:02" },
  { id: 2, at: 0, who: "a", agent: "Nimali", col: "lav", text: "Hi Dilani! Yes, we do. Want it delivered today?", time: "10:03" },
  { id: 3, at: 0, who: "c", text: "Yes please, Colombo 05", time: "10:04" },
  { id: 4, at: 0, who: "a", agent: "Kasun", col: "sky", text: "Kasun here from dispatch. On its way by 2 pm.", time: "10:06" },
  { id: 5, at: 3, who: "n", text: "Lead created from WhatsApp · Pipeline: New enquiry", time: "10:06" },
  { id: 6, at: 4, who: "d", doc: "Quotation Q-1042", sub: "LKR 18,500 · PDF", time: "10:08" },
  { id: 7, at: 4, who: "d", doc: "Receipt R-2210", sub: "Paid · LKR 18,500", time: "10:31" },
];

const history = [
  { id: 1, at: 0, d: "12 Mar", t: "Order #881 chat", s: "6 messages" },
  { id: 2, at: 0, d: "03 Jan", t: "First enquiry", s: "3 messages" },
  { id: 3, at: 1, d: "Today", t: "Chat saved to history", s: "4 messages · Nimali, Kasun" },
];

const visibleMsgs = computed(() => msgs.filter((m) => m.at <= step.value));
const visibleHistory = computed(() => history.filter((h) => h.at <= step.value));
const gridHL = computed(() => step.value);

function next() {
  step.value = (step.value + 1) % points.length;
}
function pick(i) {
  manual.value = true;
  stop();
  step.value = i;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 3400);
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
  <section ref="root" class="wa" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2>One shared inbox for every WhatsApp conversation</h2>
      </header>

      <div class="app" role="img" aria-label="Shared WhatsApp inbox with customer history and team stats">
        <div class="bar">
          <i></i><i></i><i></i>
          <span class="num">Saptivo Store · +94 77 123 4567</span>
          <span class="agents">
            <b class="av lav" :class="{ on: step === 0 }">N</b>
            <b class="av sky" :class="{ on: step === 0 }">K</b>
            <b class="av mint">R</b>
            <em>3 online</em>
          </span>
        </div>

        <div class="cols">
          <!-- chat list -->
          <aside class="list">
            <div class="search">Search chats</div>
            <div
              v-for="c in chats"
              :key="c.id"
              class="row"
              :class="{ sel: c.id === 0, warn: c.id === 2 && step === 2 }"
            >
              <b class="pic" :class="['lav', 'sky', 'rose', 'mint'][c.id]">{{ c.n[0] }}</b>
              <div class="rt">
                <strong>{{ c.n }}</strong>
                <span>{{ c.m }}</span>
              </div>
              <Transition name="pop">
                <u v-if="c.id === 2 && step === 2" class="unans">Unanswered 14m</u>
              </Transition>
            </div>
          </aside>

          <!-- conversation -->
          <div class="conv">
            <div class="chead">
              <b class="pic lav">D</b>
              <div>
                <strong>Dilani Perera</strong>
                <span>+94 71 555 0198</span>
              </div>
            </div>
            <TransitionGroup name="msg" tag="div" class="msgs">
              <div v-for="m in visibleMsgs" :key="m.id" class="m" :class="'k-' + m.who">
                <template v-if="m.who === 'a'">
                  <small :class="m.col">{{ m.agent }}</small>
                  <p>{{ m.text }}</p>
                </template>
                <template v-else-if="m.who === 'd'">
                  <div class="doc">
                    <svg viewBox="0 0 24 24"><path d="M7 3h8l4 4v14H7zM15 3v4h4" /></svg>
                    <div>
                      <strong>{{ m.doc }}</strong>
                      <span>{{ m.sub }}</span>
                    </div>
                  </div>
                </template>
                <template v-else-if="m.who === 'n'">
                  <p class="note">{{ m.text }}</p>
                </template>
                <template v-else>
                  <p>{{ m.text }}</p>
                </template>
                <time v-if="m.who !== 'n'">{{ m.time }}</time>
              </div>
            </TransitionGroup>
            <div class="composer">
              <span>Type a reply</span>
              <i class="chip" :class="{ hot: step === 4 }">Quote</i>
              <i class="chip" :class="{ hot: step === 4 }">Invoice</i>
              <i class="chip" :class="{ hot: step === 4 }">Receipt</i>
              <b class="send">Send</b>
            </div>
          </div>

          <!-- customer panel -->
          <aside class="side">
            <div class="stats" :class="{ hl: step === 2 }">
              <div>
                <span>First response</span>
                <strong>2m 14s</strong>
              </div>
              <div>
                <span>Unanswered</span>
                <strong :class="{ red: step === 2 }">{{ step === 2 ? 1 : 0 }}</strong>
              </div>
            </div>

            <Transition name="pop">
              <div v-if="step >= 3" class="lead" :class="{ fresh: step === 3 }">
                <span>Pipeline</span>
                <strong>New enquiry</strong>
                <small>Source: WhatsApp</small>
              </div>
            </Transition>

            <div class="hist" :class="{ hl: step === 1 }">
              <h4>History</h4>
              <TransitionGroup name="msg" tag="ul">
                <li v-for="h in visibleHistory" :key="h.id">
                  <time>{{ h.d }}</time>
                  <div>
                    <strong>{{ h.t }}</strong>
                    <span>{{ h.s }}</span>
                  </div>
                </li>
              </TransitionGroup>
            </div>
          </aside>
        </div>
      </div>

      <ul class="pts">
        <li
          v-for="(p, i) in points"
          :key="p.t"
          class="pt"
          :class="['t-' + p.c, { act: gridHL === i, run: gridHL === i && !manual }]"
          :style="{ '--d': i * 70 + 'ms' }"
        >
          <button type="button" @click="pick(i)">
            <span class="ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="p.ic" /></svg>
            </span>
            <span class="tx">{{ p.t }}</span>
            <span class="prog"><i></i></span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.wa {
  --ink: #17191d;
  --muted: #666b73;
  --line: #ece9f3;
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
.eyebrow {
  display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
  background: var(--mint); color: var(--mint-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px;
}
h2 { font-size: clamp(34px, 3.4vw, 56px); line-height: 1.08; font-weight: 500; margin: 0; letter-spacing: -0.06em; font-family: "Inter", system-ui, sans-serif; text-wrap: balance; }

.head, .app, .pt { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .app, .in .pt { opacity: 1; transform: none; }
.in .app { transition-delay: .1s; }
.in .pt { transition-delay: calc(.25s + var(--d)); }

/* app window */
.app { background: #fff; border: 1px solid var(--line); border-radius: 20px; box-shadow: 0 24px 60px rgba(60, 50, 120, .1); overflow: hidden; }
.bar { display: flex; align-items: center; gap: 6px; padding: 12px 16px; background: #faf9ff; border-bottom: 1px solid var(--line); }
.bar > i { width: 10px; height: 10px; border-radius: 50%; background: #e3e0ee; }
.num { margin-left: 12px; font-size: 13px; font-weight: 600; }
.agents { margin-left: auto; display: flex; align-items: center; }
.agents em { font-style: normal; font-size: 12px; color: var(--muted); margin-left: 10px; }
.av, .pic {
  display: grid; place-items: center; font-size: 12px; font-weight: 600; border-radius: 50%;
}
.av { width: 26px; height: 26px; margin-left: -6px; border: 2px solid #fff; transition: transform .3s; }
.av.on { transform: translateY(-3px); }
.pic { width: 34px; height: 34px; flex: none; }
.lav { background: var(--lav); color: var(--lav-i); }
.sky { background: var(--sky); color: var(--sky-i); }
.mint { background: var(--mint); color: var(--mint-i); }
.rose { background: var(--rose); color: var(--rose-i); }
.butter { background: var(--butter); color: var(--butter-i); }

.cols { display: grid; grid-template-columns: 250px 1fr 260px; height: 460px; }
.list { border-right: 1px solid var(--line); padding: 12px; overflow: hidden; }
.search { font-size: 12px; color: #9a9fa8; background: #f5f4fa; border-radius: 10px; padding: 9px 12px; margin-bottom: 8px; }
.row { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 12px; position: relative; transition: background .3s; }
.row.sel { background: #f1eeff; }
.row.warn { background: #ffeef2; }
.rt { min-width: 0; display: flex; flex-direction: column; }
.rt strong { font-size: 13px; font-weight: 600; }
.rt span { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.unans { position: absolute; right: 6px; top: 6px; font-size: 10px; font-weight: 600; text-decoration: none; background: var(--rose); color: var(--rose-i); padding: 2px 7px; border-radius: 99px; }

.conv { display: flex; flex-direction: column; background: #fbfaff; min-width: 0; }
.chead { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #fff; border-bottom: 1px solid var(--line); }
.chead strong { display: block; font-size: 13px; }
.chead span { font-size: 11px; color: var(--muted); }
.msgs { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; position: relative; }
.m { max-width: 72%; position: relative; transition: all .45s ease; }
.m p { margin: 0; font-size: 13px; line-height: 1.45; padding: 9px 12px; border-radius: 14px; }
.m time { display: block; font-size: 10px; color: #a0a5ad; margin-top: 3px; }
.k-c { align-self: flex-start; }
.k-c p { background: #fff; border: 1px solid var(--line); border-top-left-radius: 4px; }
.k-a { align-self: flex-end; text-align: left; }
.k-a p { background: var(--mint); border-top-right-radius: 4px; }
.k-a time { text-align: right; }
.k-a small { display: inline-block; font-size: 10px; font-weight: 600; padding: 1px 8px; border-radius: 99px; margin-bottom: 3px; }
.k-n { align-self: center; max-width: 100%; }
.k-n .note { background: var(--butter); color: var(--butter-i); font-size: 11px; font-weight: 500; border-radius: 99px; padding: 5px 14px; }
.k-d { align-self: flex-end; }
.doc { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 9px 14px 9px 10px; }
.doc svg { width: 28px; height: 28px; padding: 5px; border-radius: 8px; background: var(--rose); stroke: var(--rose-i); fill: none; stroke-width: 1.8; stroke-linejoin: round; }
.doc strong { display: block; font-size: 12px; }
.doc span { font-size: 11px; color: var(--muted); }
.k-d time { text-align: right; }

.composer { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #fff; border-top: 1px solid var(--line); }
.composer > span { flex: 1; font-size: 12px; color: #9a9fa8; background: #f5f4fa; border-radius: 99px; padding: 8px 14px; }
.chip { font-style: normal; font-size: 11px; font-weight: 600; padding: 6px 11px; border-radius: 99px; background: #f1f0f6; color: var(--muted); transition: all .3s; }
.chip.hot { background: var(--rose); color: var(--rose-i); transform: translateY(-2px); }
.send { font-size: 12px; font-weight: 600; background: var(--ink); color: #fff; padding: 7px 14px; border-radius: 99px; }

.side { border-left: 1px solid var(--line); padding: 14px; display: flex; flex-direction: column; gap: 12px; overflow: hidden; }
.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px; border-radius: 14px; background: #f7f6fb; transition: background .4s, box-shadow .4s; }
.stats.hl { background: var(--mint); box-shadow: 0 0 0 2px var(--mint-i) inset; }
.stats span { display: block; font-size: 10px; color: var(--muted); }
.stats strong { font-size: 18px; font-weight: 700; transition: color .3s; }
.stats strong.red { color: var(--rose-i); }
.lead { padding: 10px 12px; border-radius: 14px; background: var(--butter); display: flex; flex-direction: column; }
.lead span { font-size: 10px; color: var(--butter-i); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
.lead strong { font-size: 14px; }
.lead small { font-size: 11px; color: var(--muted); }
.lead.fresh { box-shadow: 0 0 0 2px var(--butter-i) inset; }
.hist { padding: 10px; border-radius: 14px; border: 1px solid transparent; transition: all .4s; flex: 1; min-height: 0; }
.hist.hl { background: var(--sky); border-color: var(--sky-i); }
.hist h4 { margin: 0 0 8px; font-size: 12px; }
.hist ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; position: relative; }
.hist li { display: flex; gap: 10px; transition: all .45s ease; }
.hist time { font-size: 10px; font-weight: 600; color: var(--sky-i); min-width: 42px; padding-top: 2px; }
.hist li strong { display: block; font-size: 12px; }
.hist li span { font-size: 11px; color: var(--muted); }

/* points */
.pts { list-style: none; margin: 28px 0 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.pt button {
  all: unset; box-sizing: border-box; cursor: pointer; width: 100%; height: 100%; display: flex; flex-direction: column; gap: 12px;
  padding: 16px 16px 20px; border-radius: 18px; background: #fff; border: 1px solid var(--line); position: relative; overflow: hidden;
  transition: background .35s, border-color .35s, transform .35s;
}
.pt button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.ico { width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; }
.ico svg { width: 20px; height: 20px; }
.tx { font-size: 13.5px; line-height: 1.45; font-weight: 500; }
.pt.t-lav .ico { background: var(--lav); color: var(--lav-i); }
.pt.t-sky .ico { background: var(--sky); color: var(--sky-i); }
.pt.t-mint .ico { background: var(--mint); color: var(--mint-i); }
.pt.t-butter .ico { background: var(--butter); color: var(--butter-i); }
.pt.t-rose .ico { background: var(--rose); color: var(--rose-i); }
.pt.act.t-lav button { background: #f6f4ff; border-color: var(--lav-i); }
.pt.act.t-sky button { background: #f3f9ff; border-color: var(--sky-i); }
.pt.act.t-mint button { background: #f2fbf6; border-color: var(--mint-i); }
.pt.act.t-butter button { background: #fffaea; border-color: var(--butter-i); }
.pt.act.t-rose button { background: #fff5f8; border-color: var(--rose-i); }
.pt.act button { transform: translateY(-3px); }
.prog { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; }
.prog i { display: block; height: 100%; width: 0; background: var(--ink); }
.pt.act:not(.run) .prog i { width: 100%; }
.pt.act.run .prog i { animation: fill 3.4s linear forwards; }
@keyframes fill { to { width: 100%; } }

/* transitions */
.msg-enter-from { opacity: 0; transform: translateY(12px); }
.msg-leave-active { position: absolute; }
.msg-leave-to { opacity: 0; transform: translateY(-8px); }
.msg-move { transition: transform .45s ease; }
.pop-enter-active { transition: all .4s cubic-bezier(.2, 1.4, .4, 1); }
.pop-leave-active { transition: all .25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(.85); }

@media (max-width: 1000px) {
  .pts { grid-template-columns: repeat(2, 1fr); }
  .pt:last-child { grid-column: 1 / -1; }
  .cols { grid-template-columns: 1fr 240px; }
  .list { display: none; }
}
@media (max-width: 640px) {
  .wa { padding: 64px 16px; }
  .cols { grid-template-columns: 1fr; height: auto; }
  .side { display: none; }
  .msgs { min-height: 340px; }
  .pts { grid-template-columns: 1fr; }
  .agents em, .num { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .app, .pt { opacity: 1; transform: none; transition: none; }
  .pt.act.run .prog i { animation: none; width: 100%; }
  * { transition-duration: 0s !important; }
}
</style>
