<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SharedInboxSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;
const LAST = 6;
const base = "/saptivo/images/features/";
const photos = [
  base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
  base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG",
];
const ok = ref([true, true]);

const items = [
  {
    k: "team",
    c: "lav",
    from: 0,
    t: "Assign each chat to an agent, transfer it when needed and add internal notes your customer never sees.",
  },
  {
    k: "reply",
    c: "mint",
    from: 4,
    t: "Saved replies answer common questions in one tap.",
  },
  {
    k: "media",
    c: "sky",
    from: 6,
    t: "Media attachments such as photos, PDFs and voice notes work just as they do on your phone.",
  },
];

const saved = [
  { id: 0, k: "/hours", t: "Opening hours" },
  { id: 1, k: "/delivery", t: "Delivery takes 1 to 2 working days within Colombo." },
  { id: 2, k: "/pay", t: "Payment options" },
];

const msgs = [
  { id: 1, at: 0, who: "c", text: "Hello, can I change my delivery address?", time: "09:14" },
  { id: 2, at: 1, who: "s", text: "Assigned to Nimali" },
  { id: 3, at: 2, who: "n", text: "Order #1042 ships from the Galle store. Check stock there first.", by: "Nimali" },
  { id: 4, at: 2, who: "a", agent: "Nimali", text: "Of course, one moment please.", time: "09:15" },
  { id: 5, at: 3, who: "s", text: "Transferred to Kasun · Dispatch" },
  { id: 6, at: 5, who: "a", agent: "Kasun", text: "Delivery takes 1 to 2 working days within Colombo.", time: "09:16", quick: true },
  { id: 7, at: 6, who: "m", kind: "photo", time: "09:17" },
  { id: 8, at: 6, who: "m", kind: "pdf", time: "09:17" },
  { id: 9, at: 6, who: "m", kind: "voice", time: "09:18" },
];

const visible = computed(() => msgs.filter((m) => m.at <= step.value));
const assignee = computed(() =>
  step.value < 1 ? null : step.value < 3 ? { n: "Nimali", c: "lav" } : { n: "Kasun", c: "sky" }
);
const photoIdx = computed(() => (step.value >= 3 ? 1 : 0));
const waiting = computed(() => (step.value === 0 ? 1 : 0));
const active = computed(() => (step.value >= 6 ? 2 : step.value >= 4 ? 1 : 0));
const bars = [6, 12, 8, 16, 10, 14, 7, 12, 18, 9, 13, 6, 10, 15, 8, 11];

function next() {
  step.value = (step.value + 1) % (LAST + 1);
}
function pick(i) {
  manual.value = true;
  stop();
  step.value = items[i].from;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 2600);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    step.value = LAST;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.3 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="si" :class="{ in: shown }">
    <div class="wrap">
      <div class="copy">
        <h2>One shared inbox for every team member</h2>

        <ul class="items">
          <li v-for="(it, i) in items" :key="it.k" :class="['t-' + it.c, { act: active === i }]">
            <button type="button" @click="pick(i)">
              <span class="dot"></span>
              <span class="tx">{{ it.t }}</span>
            </button>
          </li>
        </ul>

        <p class="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
          A shared WhatsApp inbox means no message waits because one person is busy.
        </p>
      </div>

      <div class="stage" role="img" aria-label="Shared inbox: a chat is assigned, noted, transferred, answered with a saved reply and media">
        <div class="ph" aria-hidden="true">
          <template v-for="(src, i) in photos" :key="src">
            <img v-if="ok[i]" :src="src" alt="" :class="{ on: photoIdx === i }" @error="ok[i] = false" />
          </template>
        </div>
        <div class="glass" aria-hidden="true">
          <b class="gd"></b>
          <span><strong>3 agents online</strong>{{ assignee ? assignee.n + " is on this chat" : "New chat in the inbox" }}</span>
        </div>

        <div class="win">
          <div class="top">
            <b class="pic rose">M</b>
            <div class="who">
              <strong>Malini Jayasuriya</strong>
              <span>+94 76 400 2211</span>
            </div>
            <Transition name="pop" mode="out-in">
              <span v-if="!assignee" key="u" class="tag un">Unassigned</span>
              <span v-else :key="assignee.n" class="tag" :class="assignee.c">
                <b>{{ assignee.n[0] }}</b>{{ assignee.n }}
              </span>
            </Transition>
          </div>

          <TransitionGroup name="msg" tag="div" class="msgs">
            <div v-for="m in visible" :key="m.id" class="m" :class="'k-' + m.who">
              <template v-if="m.who === 's'">
                <p class="sys">{{ m.text }}</p>
              </template>
              <template v-else-if="m.who === 'n'">
                <div class="note">
                  <span class="lock">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                    Internal note · only your team
                  </span>
                  <p>{{ m.text }}</p>
                  <small>{{ m.by }}</small>
                </div>
              </template>
              <template v-else-if="m.who === 'a'">
                <small class="ag" :class="m.agent === 'Nimali' ? 'lav' : 'sky'">{{ m.agent }}</small>
                <p>{{ m.text }}<i v-if="m.quick" class="qk">Saved reply</i></p>
                <time>{{ m.time }}</time>
              </template>
              <template v-else-if="m.who === 'm'">
                <div v-if="m.kind === 'photo'" class="photo"><span></span></div>
                <div v-else-if="m.kind === 'pdf'" class="pdf">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 3h8l4 4v14H7zM15 3v4h4" /></svg>
                  <div><strong>Address-change.pdf</strong><span>PDF · 84 KB</span></div>
                </div>
                <div v-else class="voice">
                  <b class="play"></b>
                  <span class="wave"><i v-for="(h, n) in bars" :key="n" :style="{ height: h + 'px', animationDelay: n * 60 + 'ms' }"></i></span>
                  <em>0:12</em>
                </div>
                <time>{{ m.time }}</time>
              </template>
              <template v-else>
                <p>{{ m.text }}</p>
                <time>{{ m.time }}</time>
              </template>
            </div>
          </TransitionGroup>

          <Transition name="up">
            <div v-if="step === 4" class="sr">
              <div v-for="s in saved" :key="s.id" class="sr-row" :class="{ pick: s.id === 1 }">
                <code>{{ s.k }}</code>
                <span>{{ s.t }}</span>
              </div>
            </div>
          </Transition>

          <div class="composer">
            <span class="field">{{ step === 4 ? "/delivery" : "Type a reply, or / for saved replies" }}</span>
            <b class="clip" :class="{ hot: step === 6 }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 11l-8 8a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8" /></svg>
            </b>
            <b class="send">Send</b>
          </div>
        </div>

        <div class="queue" :class="{ clear: waiting === 0 }">
          <span class="qd"></span>
          <strong>{{ waiting }}</strong> {{ waiting === 1 ? "chat waiting" : "chats waiting" }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.si {
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
.wrap { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.05fr; gap: 56px; align-items: center; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--lav); color: var(--lav-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { font-size: clamp(34px, 3.4vw, 56px); line-height: 1.08; font-weight: 500; margin: 0 0 28px; letter-spacing: -0.06em; font-family: "Inter", system-ui, sans-serif; text-wrap: balance; }

.copy, .stage { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .copy, .in .stage { opacity: 1; transform: none; }
.in .stage { transition-delay: .12s; }

.items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.items button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; display: flex; gap: 14px; padding: 16px 18px; border-radius: 16px; border: 1px solid var(--line); background: #fff; font-size: 15px; line-height: 1.55; transition: background .35s, border-color .35s, transform .35s; }
.items button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.dot { flex: none; width: 10px; height: 10px; border-radius: 50%; margin-top: 8px; background: #d9d6e4; transition: background .35s, transform .35s; }
.items li.act button { transform: translateX(6px); }
.items li.t-lav.act button { background: #f6f4ff; border-color: var(--lav-i); }
.items li.t-mint.act button { background: #f2fbf6; border-color: var(--mint-i); }
.items li.t-sky.act button { background: #f3f9ff; border-color: var(--sky-i); }
.items li.t-lav.act .dot { background: var(--lav-i); transform: scale(1.3); }
.items li.t-mint.act .dot { background: var(--mint-i); transform: scale(1.3); }
.items li.t-sky.act .dot { background: var(--sky-i); transform: scale(1.3); }
.close { display: flex; gap: 10px; align-items: flex-start; margin: 22px 0 0; font-size: 15px; font-weight: 600; line-height: 1.55; }
.close svg { flex: none; width: 22px; height: 22px; padding: 3px; border-radius: 50%; background: var(--mint); color: var(--mint-i); margin-top: 2px; }

/* stage */
.stage { background: linear-gradient(160deg, #f1eeff, #e9f5ff 55%, #e6f7ee); overflow: visible; border-radius: 28px; padding: 28px; position: relative; }
.ph { position: absolute; left: 0; right: 0; top: 0; height: 250px; border-radius: 28px 28px 0 0; overflow: hidden; background: linear-gradient(135deg, #e8e3ff, #dcecfb 55%, #d3f0e1); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; opacity: 0; transition: opacity .8s ease; }
.ph img.on { opacity: 1; }
.glass { position: absolute; z-index: 2; left: 40px; top: 22px; display: flex; align-items: center; gap: 10px; padding: 8px 14px; border-radius: 99px; background: rgba(255,255,255,.72); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); font-size: 11px; color: var(--muted); }
.glass span { display: flex; flex-direction: column; line-height: 1.3; }
.glass strong { font-size: 12px; color: var(--ink); }
.gd { width: 9px; height: 9px; border-radius: 50%; background: var(--mint-i); }
.win { margin-top: 130px; position: relative; z-index: 1; background: #fff; border-radius: 18px; box-shadow: 0 18px 44px rgba(60, 50, 120, .14); overflow: hidden; display: flex; flex-direction: column; height: 500px; position: relative; }
.top { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--line); }
.pic { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 600; }
.rose { background: var(--rose); color: var(--rose-i); }
.lav { background: var(--lav); color: var(--lav-i); }
.sky { background: var(--sky); color: var(--sky-i); }
.who { flex: 1; min-width: 0; }
.who strong { display: block; font-size: 13px; }
.who span { font-size: 11px; color: var(--muted); }
.tag { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 4px 12px 4px 5px; border-radius: 99px; }
.tag b { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-size: 10px; background: #fff; }
.tag.un { background: var(--rose); color: var(--rose-i); padding-left: 12px; }
.tag.lav { background: var(--lav); color: var(--lav-i); }
.tag.sky { background: var(--sky); color: var(--sky-i); }

.msgs { flex: 1; padding: 14px; display: flex; flex-direction: column; gap: 9px; overflow: hidden; position: relative; background: #fbfaff; justify-content: flex-end; }
.m { max-width: 76%; transition: all .45s ease; }
.m p { margin: 0; font-size: 13px; line-height: 1.45; padding: 8px 12px; border-radius: 14px; }
.m time { display: block; font-size: 10px; color: #a0a5ad; margin-top: 2px; }
.k-c { align-self: flex-start; }
.k-c p { background: #fff; border: 1px solid var(--line); border-top-left-radius: 4px; }
.k-a, .k-m { align-self: flex-end; }
.k-a time, .k-m time { text-align: right; }
.k-a p { background: var(--mint); border-top-right-radius: 4px; }
.ag { display: inline-block; font-size: 10px; font-weight: 600; padding: 1px 8px; border-radius: 99px; margin-bottom: 3px; }
.qk { display: inline-block; font-style: normal; font-size: 9px; font-weight: 600; margin-left: 8px; padding: 1px 7px; border-radius: 99px; background: #fff; color: var(--mint-i); vertical-align: 1px; }
.k-s { align-self: center; max-width: 100%; }
.sys { background: #efedf6; color: var(--muted); font-size: 11px !important; border-radius: 99px !important; padding: 4px 14px !important; }
.k-n { align-self: flex-end; max-width: 82%; }
.note { background: var(--butter); border: 1px dashed var(--butter-i); border-radius: 12px; padding: 8px 12px; }
.note .lock { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; color: var(--butter-i); }
.note .lock svg { width: 12px; height: 12px; }
.note p { padding: 3px 0 0; font-size: 12px; background: none; }
.note small { font-size: 10px; color: var(--butter-i); }

.photo { width: 150px; height: 96px; border-radius: 14px; background: linear-gradient(135deg, #cfe4f8, #e8e3ff 55%, #d3f0e1); position: relative; overflow: hidden; }
.photo span { position: absolute; left: 14px; bottom: 0; width: 60px; height: 44px; background: #fff7; border-radius: 40px 40px 0 0; }
.pdf { display: flex; gap: 10px; align-items: center; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 8px 14px 8px 10px; }
.pdf svg { width: 30px; height: 30px; padding: 6px; border-radius: 8px; background: var(--rose); color: var(--rose-i); }
.pdf strong { display: block; font-size: 12px; }
.pdf span { font-size: 11px; color: var(--muted); }
.voice { display: flex; align-items: center; gap: 10px; background: var(--mint); border-radius: 14px; padding: 8px 14px 8px 10px; }
.play { width: 26px; height: 26px; border-radius: 50%; background: var(--mint-i); position: relative; }
.play::after { content: ""; position: absolute; left: 10px; top: 7px; border-left: 8px solid #fff; border-top: 6px solid transparent; border-bottom: 6px solid transparent; }
.wave { display: flex; align-items: center; gap: 2px; height: 20px; }
.wave i { width: 3px; border-radius: 2px; background: var(--mint-i); opacity: .75; animation: wv 1.1s ease-in-out infinite alternate; }
.voice em { font-style: normal; font-size: 11px; color: var(--mint-i); font-weight: 600; }
@keyframes wv { to { transform: scaleY(.45); } }

.sr { position: absolute; left: 12px; right: 12px; bottom: 58px; background: #fff; border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 12px 30px rgba(60, 50, 120, .18); padding: 6px; z-index: 2; }
.sr-row { display: flex; gap: 10px; align-items: center; padding: 8px 10px; border-radius: 10px; font-size: 12px; transition: background .3s; }
.sr-row code { font-family: inherit; font-weight: 600; font-size: 11px; color: var(--mint-i); background: var(--mint); padding: 2px 8px; border-radius: 99px; }
.sr-row span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--muted); }
.sr-row.pick { background: #f2fbf6; }
.sr-row.pick span { color: var(--ink); }

.composer { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-top: 1px solid var(--line); background: #fff; }
.field { flex: 1; min-width: 0; font-size: 12px; color: #9a9fa8; background: #f5f4fa; border-radius: 99px; padding: 9px 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.clip { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; background: #f1f0f6; color: var(--muted); transition: all .3s; }
.clip svg { width: 16px; height: 16px; }
.clip.hot { background: var(--sky); color: var(--sky-i); transform: rotate(-12deg) scale(1.1); }
.send { font-size: 12px; font-weight: 600; background: var(--ink); color: #fff; padding: 8px 14px; border-radius: 99px; }

.queue { position: absolute; right: 14px; bottom: -14px; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; background: #fff; border: 1px solid var(--rose-i); color: var(--rose-i); padding: 8px 14px; border-radius: 99px; box-shadow: 0 8px 20px rgba(60, 50, 120, .12); transition: all .4s; }
.queue.clear { border-color: var(--mint-i); color: var(--mint-i); }
.qd { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

.msg-enter-from { opacity: 0; transform: translateY(12px); }
.msg-leave-active { position: absolute; }
.msg-leave-to { opacity: 0; }
.msg-move { transition: transform .45s ease; }
.pop-enter-active, .pop-leave-active { transition: all .25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(.85); }
.up-enter-active, .up-leave-active { transition: all .3s ease; }
.up-enter-from, .up-leave-to { opacity: 0; transform: translateY(10px); }

@media (max-width: 960px) {
  .wrap { grid-template-columns: 1fr; gap: 40px; }
}
@media (max-width: 560px) {
  .si { padding: 64px 16px; }
  .stage { padding: 14px 14px 26px; border-radius: 22px; }
  .ph { border-radius: 22px 22px 0 0; height: 210px; }
  .glass { left: 26px; }
  .win { margin-top: 110px; }
  .win { height: 480px; }
}
@media (prefers-reduced-motion: reduce) {
  .copy, .stage { opacity: 1; transform: none; transition: none; }
  .wave i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
