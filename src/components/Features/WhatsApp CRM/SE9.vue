<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SriLankaSection" });

const root = ref(null);
const shown = ref(false);
const tick = ref(0);
const langPick = ref(null); // set when the visitor clicks a language
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const custPhoto = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";
const helpPhoto = base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG";
const ok = ref([true, true]);

const langs = [
  { k: "si", n: "සිංහල", q: "මිල ගණන් එවන්න පුළුවන්ද?", a: "ස්තූතියි! ඔබේ ඇණවුම හෙට ලැබෙනු ඇත." },
  { k: "ta", n: "தமிழ்", q: "விலைப்பட்டியல் அனுப்ப முடியுமா?", a: "நன்றி! உங்கள் ஆர்டர் நாளை வந்து சேரும்." },
  { k: "en", n: "English", q: "Can you send me a quotation?", a: "Thank you! Your order will arrive tomorrow." },
];

const lines = [
  { n: "Office chair × 4", p: "74,000" },
  { n: "Standing desk × 2", p: "125,000" },
  { n: "VAT 18%", p: "35,820" },
];

const steps = [
  "WhatsApp Business account verified",
  "Phone number registered",
  "Message templates approved",
  "Ready to go live",
];

const lang = computed(() => (langPick.value !== null ? langPick.value : Math.floor(tick.value / 2) % 3));
const flip = computed(() => tick.value % 2 === 1 || langPick.value !== null);
const rows = computed(() => Math.min(lines.length, tick.value % 6));
const total = computed(() => tick.value % 6 >= 3);
const doneSteps = computed(() => Math.min(steps.length, tick.value % 7));

function pickLang(i) {
  langPick.value = i;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(() => (tick.value += 1), 1400);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    tick.value = 5;
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
  <section ref="root" class="sl" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2>WhatsApp CRM for Sri Lankan businesses</h2>
        <p>
          WhatsApp is the main customer channel for many businesses in Sri Lanka. Saptivo was built with that in
          mind: Sinhala, Tamil and English conversations, LKR quotations sent in the chat, and local help setting up
          your WhatsApp Business API account.
        </p>
      </header>

      <div class="bento">
        <!-- languages -->
        <article class="tile big tone-lav" style="--d: 0ms">
          <div class="th">
            <span class="num">1</span>
            <h3>Sinhala, Tamil and English conversations</h3>
          </div>
          <div class="pills" role="tablist">
            <button
              v-for="(l, i) in langs"
              :key="l.k"
              type="button"
              role="tab"
              :aria-selected="lang === i"
              class="pill"
              :class="{ act: lang === i }"
              @click="pickLang(i)"
            >{{ l.n }}</button>
          </div>
          <div class="chat">
            <Transition name="swap" mode="out-in">
              <div :key="lang" class="conv" :lang="langs[lang].k">
                <div class="m cus">
                  <span class="av">
                    <img v-if="ok[0]" :src="custPhoto" alt="" @error="ok[0] = false" />
                    <b v-else>D</b>
                  </span>
                  <p>{{ langs[lang].q }}</p>
                </div>
                <Transition name="msg">
                  <div v-if="flip" class="m us"><p>{{ langs[lang].a }}</p></div>
                </Transition>
              </div>
            </Transition>
          </div>
        </article>

        <!-- LKR quotation -->
        <article class="tile tone-butter" style="--d: 100ms">
          <div class="th">
            <span class="num">2</span>
            <h3>LKR quotations sent in the chat</h3>
          </div>
          <div class="quote">
            <div class="qh">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 3h8l4 4v14H7zM15 3v4h4" /></svg>
              <div><strong>Quotation Q-1042.pdf</strong><span>Sent in WhatsApp</span></div>
            </div>
            <ul>
              <TransitionGroup name="line">
                <li v-for="(l, i) in lines.slice(0, rows)" :key="l.n">
                  <span>{{ l.n }}</span><b>Rs. {{ l.p }}</b>
                </li>
              </TransitionGroup>
            </ul>
            <Transition name="msg">
              <div v-if="total" class="tot"><span>Total</span><strong>LKR 234,820</strong></div>
            </Transition>
          </div>
        </article>

        <!-- local help -->
        <article class="tile tone-mint" style="--d: 200ms">
          <div class="th">
            <span class="num">3</span>
            <h3>Local help setting up your WhatsApp Business API account</h3>
          </div>
          <div class="help">
            <div class="agent">
              <span class="av lg">
                <img v-if="ok[1]" :src="helpPhoto" alt="" @error="ok[1] = false" />
                <b v-else>K</b>
              </span>
              <div><strong>Kasun · Setup team</strong><span>Colombo, here to help</span></div>
            </div>
            <ol>
              <li v-for="(s, i) in steps" :key="s" :class="{ done: doneSteps > i, now: doneSteps === i }">
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                </i>
                {{ s }}
              </li>
            </ol>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sl {
  --ink: #17191d; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", "Noto Sans Sinhala", "Noto Sans Tamil", "Iskoola Pota", "Nirmala UI", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 88px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--mint); color: var(--mint-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { font-size: clamp(34px, 3.4vw, 56px); line-height: 1.08; font-weight: 500; margin: 0 0 16px; letter-spacing: -0.06em; font-family: "Inter", system-ui, sans-serif; text-wrap: balance; }
.head p { margin: 0; font-size: 16px; line-height: 1.7; color: var(--muted); }

.head, .tile { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .tile { opacity: 1; transform: none; }
.in .tile { transition-delay: calc(.12s + var(--d)); }

.bento { display: grid; grid-template-columns: 1.15fr 1fr; grid-template-rows: auto auto; gap: 16px; }
.tile { border-radius: 26px; padding: 24px; border: 1px solid var(--line); background: var(--tb); display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.big { grid-row: span 2; }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.th { display: flex; gap: 12px; align-items: flex-start; }
.num { flex: none; width: 30px; height: 30px; border-radius: 50%; background: var(--t); color: var(--ti); font-size: 13px; font-weight: 700; display: grid; place-items: center; }
.th h3 { margin: 0; font-size: 17px; line-height: 1.4; font-weight: 600; }

/* languages */
.pills { display: flex; gap: 8px; flex-wrap: wrap; }
.pill { all: unset; box-sizing: border-box; cursor: pointer; font-size: 14px; font-weight: 600; padding: 9px 18px; border-radius: 99px; background: #fff; color: var(--muted); border: 1px solid var(--line); transition: all .3s; }
.pill:hover { border-color: var(--lav-i); }
.pill.act { background: var(--ink); color: #fff; border-color: var(--ink); }
.pill:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.chat { flex: 1; background: #fff; border-radius: 20px; padding: 20px; min-height: 300px; box-shadow: 0 14px 36px rgba(60, 50, 120, .08); display: flex; }
.conv { display: flex; flex-direction: column; gap: 14px; width: 100%; justify-content: center; }
.m { display: flex; align-items: flex-end; gap: 10px; max-width: 88%; }
.m p { margin: 0; font-size: 16px; line-height: 1.6; padding: 12px 16px; border-radius: 18px; }
.cus p { background: #f3f1fa; border-bottom-left-radius: 4px; }
.us { align-self: flex-end; }
.us p { background: var(--mint); border-bottom-right-radius: 4px; }
.av { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; flex: none; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-size: 13px; font-weight: 700; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.av.lg { width: 48px; height: 48px; }

/* quote */
.quote { background: #fff; border-radius: 18px; padding: 16px; box-shadow: 0 14px 36px rgba(60, 50, 120, .08); display: flex; flex-direction: column; gap: 10px; min-height: 196px; }
.qh { display: flex; align-items: center; gap: 10px; padding-bottom: 10px; border-bottom: 1px dashed #e2dfed; }
.qh svg { width: 32px; height: 32px; padding: 7px; border-radius: 9px; background: var(--rose); color: var(--rose-i); flex: none; }
.qh strong { display: block; font-size: 13px; }
.qh span { font-size: 11px; color: var(--muted); }
.quote ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; position: relative; min-height: 70px; }
.quote li { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); }
.quote li b { font-weight: 500; color: var(--ink); }
.tot { display: flex; justify-content: space-between; align-items: center; background: var(--butter); padding: 9px 14px; border-radius: 12px; font-size: 13px; font-weight: 600; }
.tot strong { font-size: 16px; color: var(--ink); }

/* help */
.help { display: flex; flex-direction: column; gap: 16px; background: #fff; border-radius: 18px; padding: 16px; box-shadow: 0 14px 36px rgba(60, 50, 120, .08); }
.agent { display: flex; align-items: center; gap: 12px; }
.agent strong { display: block; font-size: 14px; }
.agent span { font-size: 12px; color: var(--muted); }
.help ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.help li { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #9a9fa8; transition: color .4s; }
.help li i { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #e2dfed; display: grid; place-items: center; color: transparent; transition: all .4s; flex: none; }
.help li i svg { width: 12px; height: 12px; }
.help li.now { color: var(--ink); }
.help li.now i { border-color: var(--mint-i); }
.help li.done { color: var(--ink); }
.help li.done i { background: var(--mint-i); border-color: var(--mint-i); color: #fff; }

.swap-enter-active, .swap-leave-active { transition: all .3s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(8px); }
.msg-enter-active { transition: all .45s ease; }
.msg-enter-from { opacity: 0; transform: translateY(10px); }
.line-enter-active { transition: all .4s ease; }
.line-enter-from { opacity: 0; transform: translateX(-8px); }

@media (max-width: 900px) {
  .bento { grid-template-columns: 1fr; }
  .big { grid-row: auto; }
  .chat { min-height: 260px; }
}
@media (max-width: 560px) {
  .sl { padding: 64px 16px; }
  .tile { padding: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .tile { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>