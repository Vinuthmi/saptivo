<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ConversationalAiSection" });

const root = ref(null);
const shown = ref(false);
const tick = ref(0);
const tabPick = ref(null);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG";
const photoOk = ref(true);

const tabs = [
  { k: "prompts", t: "Prompts", tone: "lav" },
  { k: "voices", t: "Voices", tone: "mint" },
  { k: "transfer", t: "Transfer rules", tone: "butter" },
];

// illustrative greetings: the voice side supports many languages
const greets = [
  { l: "English", t: "Hello, this is Saptivo Store calling about your visit." },
  { l: "Español", t: "Hola, le llamamos de Saptivo Store sobre su visita." },
  { l: "Français", t: "Bonjour, ici Saptivo Store au sujet de votre visite." },
  { l: "हिन्दी", t: "नमस्ते, Saptivo Store की ओर से आपकी विज़िट के बारे में कॉल है।" },
  { l: "Deutsch", t: "Guten Tag, hier ist Saptivo Store wegen Ihres Termins." },
];

const voices = [
  { n: "Calm", d: "Female · steady" },
  { n: "Warm", d: "Male · friendly" },
  { n: "Bright", d: "Female · upbeat" },
];
const rules = [
  { w: "Customer asks for a person", a: "Transfer to Nimali, ext 102" },
  { w: "Complaint detected", a: "Transfer to the Support queue" },
  { w: "Two unclear answers in a row", a: "Create a callback task" },
];

const tab = computed(() => (tabPick.value !== null ? tabPick.value : Math.floor(tick.value / 3) % tabs.length));
const greet = computed(() => greets[tick.value % greets.length]);
const voice = computed(() => Math.floor(tick.value / 2) % voices.length);
const ruleOn = computed(() => tick.value % 3);
const typed = computed(() => (tick.value % 3) + 1);

function pick(i) {
  tabPick.value = i;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(() => (tick.value += 1), 1600);
}
function stop() {
  clearInterval(timer);
  timer = null;
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
  <section ref="root" class="ca" :class="{ in: shown }">
    <div class="wrap">
      <!-- copy -->
      <div class="copy">
        <h2><span class="l1">Built on modern</span> <span class="l2">conversational AI</span></h2>
        <p>
          Vodia's outbound voice agents run on OpenAI's Realtime API, and Vodia also connects to ElevenLabs
          Conversational AI for natural-sounding voices in many languages. Prompts, voices and transfer rules are
          configured for your business, and every AI call is logged in Saptivo like any other call.
        </p>

        <ul class="tabs" role="tablist">
          <li v-for="(t, i) in tabs" :key="t.k" :class="'tone-' + t.tone">
            <button type="button" role="tab" :aria-selected="tab === i" class="tb" :class="{ act: tab === i }" @click="pick(i)">
              <span class="n">{{ i + 1 }}</span>{{ t.t }}
            </button>
          </li>
        </ul>

        <div class="engines">
          <span class="eng"><i></i>OpenAI Realtime API</span>
          <span class="eng e2"><i></i>ElevenLabs Conversational AI</span>
        </div>
      </div>

      <!-- visual -->
      <div class="vis" role="img" aria-label="A live AI voice call with its prompt, voice and transfer rules, logged in Saptivo">
        <div class="ph">
          <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
          <div class="shade"></div>

          <span class="glass live"><i></i>Live AI call · 0:{{ 18 + (tick % 20) }}</span>
          <span class="glass lang">{{ greet.l }}</span>

          <div class="cap">
            <div class="wave"><i v-for="n in 26" :key="n" :style="{ animationDelay: n * 45 + 'ms' }"></i></div>
            <Transition name="swap" mode="out-in">
              <p :key="greet.l">{{ greet.t }}</p>
            </Transition>
          </div>
        </div>

        <div class="panel">
          <div class="ptop">
            <span class="logo">S</span>
            <strong>Agent settings</strong>
            <em>{{ tabs[tab].t }}</em>
          </div>

          <Transition name="swap" mode="out-in">
            <!-- prompts -->
            <div v-if="tab === 0" key="p" class="body">
              <div class="prompt">
                <p>You are the visit reminder assistant for Saptivo Store.</p>
                <p :class="{ dim: typed < 2 }">Confirm the appointment, offer to reschedule and stay polite and brief.</p>
                <p :class="{ dim: typed < 3 }">If the customer asks for a person, transfer the call.<span class="caret"></span></p>
              </div>
            </div>

            <!-- voices -->
            <div v-else-if="tab === 1" key="v" class="body">
              <div v-for="(v, i) in voices" :key="v.n" class="voice" :class="{ sel: voice === i }">
                <span class="play"></span>
                <div><strong>{{ v.n }}</strong><span>{{ v.d }}</span></div>
                <span class="mini"><i v-for="n in 12" :key="n" :style="{ animationDelay: n * 60 + 'ms' }"></i></span>
                <em v-if="voice === i">Selected</em>
              </div>
            </div>

            <!-- transfer -->
            <div v-else key="t" class="body">
              <div v-for="(r, i) in rules" :key="r.w" class="rule" :class="{ hot: ruleOn === i }">
                <span class="when">{{ r.w }}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                <span class="then">{{ r.a }}</span>
              </div>
            </div>
          </Transition>

          <div class="log">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
            <div><strong>AI call logged in Saptivo</strong><span>On the customer timeline, like any other call</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ca {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", "Noto Sans Devanagari", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
  overflow: hidden;
}
.wrap { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.05fr; gap: 60px; align-items: center; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--sky); color: var(--sky-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 18px; }
h2 { margin: 0 0 20px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ca h2 .l1 { color: #111111 !important; opacity: 1; }
.ca h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.copy > p { margin: 0 0 26px; font-size: 16.5px; line-height: 1.75; color: var(--muted); max-width: 54ch; }

.copy, .vis { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .copy, .in .vis { opacity: 1; transform: none; }
.in .vis { transition-delay: .14s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tabs { list-style: none; margin: 0 0 22px; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.tb { all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; padding: 8px 18px 8px 8px; border-radius: 99px; background: #f6f5fb; color: var(--muted); transition: all .3s; }
.tb .n { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; background: var(--t); color: var(--ti); transition: all .3s; }
.tb:hover { background: #eeecf7; }
.tb.act { background: var(--ink); color: #fff; }
.tb.act .n { background: #fff; color: var(--ink); }
.tb:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.engines { display: flex; flex-wrap: wrap; gap: 8px; }
.eng { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; padding: 8px 14px; border: 1px solid var(--line); border-radius: 99px; color: var(--ink); background: #fff; }
.eng i { width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); }
.eng.e2 i { background: var(--lav-i); }

/* visual */
.vis { position: relative; padding: 0 0 0 0; }
.vis::before { content: ""; position: absolute; inset: 24px -16px -16px 24px; background: linear-gradient(160deg, #ece7ff, #e1f0ff 60%, #def5e9); border-radius: 36px; z-index: 0; }
.ph { position: relative; z-index: 1; height: 300px; border-radius: 28px; overflow: hidden; background: linear-gradient(135deg, #e8e3ff, #dcecfb 55%, #d3f0e1); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, 0) 35%, rgba(20, 18, 15, .62) 100%); }
.glass { position: absolute; top: 16px; display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; padding: 7px 14px; border-radius: 99px; background: rgba(255, 255, 255, .78); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); color: var(--ink); }
.live { left: 16px; }
.live i { width: 8px; height: 8px; border-radius: 50%; background: #e5484d; animation: blink 1.2s infinite; }
.lang { right: 16px; }
@keyframes blink { 50% { opacity: .3; } }
.cap { position: absolute; left: 16px; right: 16px; bottom: 16px; color: #fff; }
.wave { display: flex; align-items: center; gap: 3px; height: 30px; margin-bottom: 8px; }
.wave i { flex: 1; max-width: 5px; height: 4px; border-radius: 3px; background: rgba(255, 255, 255, .9); animation: wv .7s ease-in-out infinite alternate; }
@keyframes wv { to { height: 28px; } }
.cap p { margin: 0; font-size: 14px; line-height: 1.5; font-weight: 500; }

.panel { position: relative; z-index: 2; margin: -34px 18px 0; background: #fff; border: 1px solid var(--line); border-radius: 24px; box-shadow: 0 24px 60px rgba(60, 50, 120, .16); padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.ptop { display: flex; align-items: center; gap: 10px; }
.logo { width: 30px; height: 30px; border-radius: 9px; background: var(--ink); color: #fff; display: grid; place-items: center; font-size: 12px; font-weight: 700; }
.ptop strong { font-size: 14px; }
.ptop em { margin-left: auto; font-style: normal; font-size: 11px; font-weight: 600; background: var(--lav); color: var(--lav-i); padding: 4px 12px; border-radius: 99px; }
.body { display: flex; flex-direction: column; gap: 8px; min-height: 168px; justify-content: center; }

.prompt { background: #f8f7fc; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
.prompt p { margin: 0; font-size: 13px; line-height: 1.55; transition: opacity .4s; }
.prompt p.dim { opacity: .18; }
.caret { display: inline-block; width: 2px; height: 14px; background: var(--ink); margin-left: 3px; vertical-align: -2px; animation: blink 1s step-end infinite; }

.voice { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 1px solid var(--line); border-radius: 14px; transition: all .35s; }
.voice strong { display: block; font-size: 13px; }
.voice > div span { font-size: 11px; color: var(--muted); }
.voice.sel { border-color: var(--mint-i); background: #f2fbf6; }
.play { width: 28px; height: 28px; border-radius: 50%; background: var(--ink); position: relative; flex: none; }
.play::after { content: ""; position: absolute; left: 11px; top: 8px; border-left: 8px solid #fff; border-top: 6px solid transparent; border-bottom: 6px solid transparent; }
.mini { margin-left: auto; display: flex; align-items: center; gap: 2px; height: 20px; }
.mini i { width: 3px; height: 4px; border-radius: 2px; background: #d4d0e4; }
.voice.sel .mini i { background: var(--mint-i); animation: wv2 .6s ease-in-out infinite alternate; }
@keyframes wv2 { to { height: 18px; } }
.voice em { font-style: normal; font-size: 10px; font-weight: 700; background: var(--mint); color: var(--mint-i); padding: 3px 9px; border-radius: 99px; }

.rule { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border: 1px solid var(--line); border-radius: 14px; font-size: 12.5px; transition: all .35s; }
.rule svg { width: 16px; height: 16px; flex: none; color: #9a9fa8; }
.when { font-weight: 600; flex: 1; }
.then { color: var(--muted); flex: 1; text-align: right; }
.rule.hot { border-color: var(--butter-i); background: #fffaea; }
.rule.hot svg { color: var(--butter-i); }
.rule.hot .then { color: var(--ink); font-weight: 500; }

.log { display: flex; align-items: center; gap: 12px; background: var(--mint); border-radius: 14px; padding: 11px 14px; }
.log svg { width: 28px; height: 28px; padding: 6px; border-radius: 50%; background: #fff; color: var(--mint-i); flex: none; }
.log strong { display: block; font-size: 12.5px; color: var(--mint-i); }
.log span { font-size: 11px; color: var(--muted); }

.swap-enter-active, .swap-leave-active { transition: opacity .25s ease, transform .25s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(6px); }

@media (max-width: 960px) {
  .wrap { grid-template-columns: 1fr; gap: 52px; }
  .vis { max-width: 560px; }
  .vis::before { inset: 20px -10px -12px 12px; }
}
@media (max-width: 560px) {
  .ca { padding: 64px 16px; }
  .ph { height: 260px; }
  .panel { margin: -28px 8px 0; padding: 14px; }
  .when, .then { flex: none; }
  .rule { flex-wrap: wrap; }
  .then { text-align: left; }
  .rule svg { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .copy, .vis { opacity: 1; transform: none; transition: none; }
  .live i, .wave i, .voice.sel .mini i, .caret { animation: none; }
  .wave i { height: 14px; }
  * { transition-duration: 0s !important; }
}
</style>
