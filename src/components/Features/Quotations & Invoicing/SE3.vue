<template>
  <section id="send" ref="root" class="snd" :class="{ in: seen, live }" aria-labelledby="snd-title">
    <header class="head">
      <h2 id="snd-title" class="title">
        <span>Send by WhatsApp or email,</span>
        <span class="soft">and know when it's opened</span>
      </h2>
      <p>
        Send the PDF straight from Saptivo by WhatsApp or email. You'll see when the customer views it,
        so your follow-up call lands at the right moment.
      </p>
    </header>

    <div class="stage">
      <!-- ============ compose ============ -->
      <article class="doc compose" aria-label="Send quotation">
        <div class="dh">
          <span class="badge">Send</span>
          <div class="dt"><b>QT-0142</b><small>Ceylon Motors · Rs. 405,000</small></div>
          <span :key="stage > 0" class="qs" :class="{ sent: stage > 0 }">{{ stage > 0 ? "Sent" : "Ready" }}</span>
        </div>

        <div class="chan" role="tablist" aria-label="Channel">
          <span class="ch" :class="{ on: channel === 'wa' }" role="tab" :aria-selected="channel === 'wa'">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.5A8.4 8.4 0 1 1 21 11.5Z" /></svg>
            WhatsApp
          </span>
          <span class="ch" :class="{ on: channel === 'em' }" role="tab" :aria-selected="channel === 'em'">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>
            Email
          </span>
        </div>

        <div class="panel">
          <div class="to"><small>To</small><b>{{ channel === "wa" ? "+94 77 123 4567" : "buying@ceylonmotors.lk" }}</b></div>
          <p class="msg">Hello, here is your quotation for the fleet service plan. Please let us know if you have any questions.</p>
          <div class="file">
            <span class="pdf">PDF</span>
            <span class="fn"><b>QT-0142.pdf</b><small>84 KB · Final</small></span>
          </div>
        </div>

        <button type="button" class="send" :class="{ press, done: stage > 0 }" tabindex="-1">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          {{ stage > 0 ? "Sent" : "Send PDF" }}
        </button>
      </article>

      <!-- ============ tracking ============ -->
      <article class="doc track" aria-label="Open tracking">
        <div class="dh">
          <span class="badge">Tracking</span>
          <div class="dt"><b>{{ stateTitle }}</b><small>Updates as the customer acts</small></div>
          <span :key="stage" class="qs" :class="{ seen: stage === 3 }">{{ stateLabel }}</span>
        </div>

        <!-- pastel illustration -->
        <div class="art" aria-hidden="true">
          <svg viewBox="0 0 360 230" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="78" cy="62" r="46" fill="#ffe9df" />
            <circle cx="296" cy="168" r="52" fill="#f0ecff" />
            <circle cx="312" cy="44" r="22" fill="#fff3cf" />
            <circle cx="52" cy="190" r="20" fill="#ffe4ee" />

            <!-- phone -->
            <rect x="124" y="14" width="112" height="204" rx="22" fill="#fff" stroke="#e3dbf7" stroke-width="2" />
            <rect x="136" y="26" width="88" height="26" rx="12" fill="#e3f6ec" />
            <circle cx="150" cy="39" r="7" fill="#fff" />
            <rect x="162" y="33" width="42" height="5" rx="2.5" fill="#b6e2c8" />
            <rect x="162" y="42" width="28" height="4" rx="2" fill="#d3eedf" />

            <rect x="136" y="64" width="54" height="22" rx="10" fill="#f0ecff" />
            <rect x="144" y="72" width="36" height="5" rx="2.5" fill="#d9cdf7" />

            <g class="bub" :class="{ show: stage >= 1 }">
              <rect x="146" y="96" width="78" height="52" rx="12" fill="#fff3cf" />
              <rect x="154" y="104" width="22" height="26" rx="5" fill="#ffc9dc" />
              <text x="165" y="121" text-anchor="middle" font-size="8" font-weight="700" fill="#b0245a">PDF</text>
              <rect x="182" y="106" width="34" height="5" rx="2.5" fill="#f1dd9d" />
              <rect x="182" y="116" width="24" height="4" rx="2" fill="#f6e8b8" />
              <g class="tk" :class="{ d: stage >= 2, o: stage >= 3 }" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m196 138 3.5 3.5 7-8" />
                <path d="m203 138 3.5 3.5 7-8" />
              </g>
            </g>

            <rect x="136" y="162" width="88" height="40" rx="12" fill="#e0f0ff" class="mi" :class="{ show: stage >= 3 }" />
            <g class="mi" :class="{ show: stage >= 3 }" fill="none" stroke="#3b82c4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M150 182c5-8 17-8 22 0-5 8-17 8-22 0Z" />
              <circle cx="161" cy="182" r="2.6" />
            </g>
            <rect class="mi" :class="{ show: stage >= 3 }" x="182" y="176" width="32" height="5" rx="2.5" fill="#a9d2f4" />
            <rect class="mi" :class="{ show: stage >= 3 }" x="182" y="185" width="20" height="4" rx="2" fill="#c8e2f7" />

            <!-- floating badges -->
            <g class="fl" :class="{ show: stage >= 3 }">
              <rect x="22" y="104" width="86" height="34" rx="17" fill="#fff" stroke="#cfe6fb" stroke-width="1.5" />
              <circle cx="42" cy="121" r="9" fill="#e0f0ff" />
              <path d="M37 121c3-5 7-5 10 0-3 5-7 5-10 0Z" fill="none" stroke="#3b82c4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <text x="58" y="125" font-size="11" font-weight="600" fill="#3b82c4">Opened</text>
            </g>
            <g class="fl" :class="{ show: nudge }">
              <rect x="252" y="76" width="92" height="34" rx="17" fill="#fff" stroke="#f6d3e1" stroke-width="1.5" />
              <circle cx="272" cy="93" r="9" fill="#ffe4ee" />
              <path d="M268 97c1-1 2-2 2-5a4 4 0 0 1 8 0c0 3 1 4 2 5Z" fill="none" stroke="#b0245a" stroke-width="1.8" stroke-linejoin="round" />
              <text x="288" y="97" font-size="11" font-weight="600" fill="#b0245a">Call now</text>
            </g>
          </svg>
        </div>

        <ul class="steps" aria-label="Delivery status">
          <li v-for="(s, i) in steps" :key="s.k" :class="{ shown: stage > i, cur: stage === i + 1 }">
            <span class="dot"></span>
            <span class="st">{{ s.k === "sent" ? (channel === "wa" ? "Sent by WhatsApp" : "Sent by email") : s.text }}</span>
            <span class="sw">{{ s.when }}</span>
          </li>
        </ul>

        <div class="toast" :class="{ show: !!toast }" role="status">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
          {{ toast }}
        </div>
      </article>
    </div>

    <figure class="send-photo">
      <img
        :src="photoSrc"
        alt="Colleagues reviewing business documents together"
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <span>Quotes that keep business moving</span>
        <b>Send, track and follow up from one place.</b>
      </figcaption>
    </figure>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const photoSrc = `${import.meta.env.BASE_URL}images/features/email-security-verification-with-padlock-on-green-2026-09-24-16-41-10-utc (1).jpg`;

const steps = [
  { k: "sent", text: "Sent", when: "2:10 PM" },
  { k: "delivered", text: "Delivered", when: "2:10 PM" },
  { k: "opened", text: "Opened by the customer", when: "2:14 PM" },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const channel = ref("wa");
const press = ref(false);
const stage = ref(0); // 0 ready, 1 sent, 2 delivered, 3 opened
const nudge = ref(false);
const toast = ref("");

const stateTitle = computed(() => (stage.value === 0 ? "Waiting to send" : stage.value === 3 ? "Customer is reading" : "On its way"));
const stateLabel = computed(() => ["Not sent", "Sent", "Delivered", "Opened"][stage.value]);

const st = { beat: 0, run: 0, timer: null, io: null, fallback: null };
const LEN = 14; // beats of 1.2 s

function reset() {
  channel.value = st.run++ % 2 === 0 ? "wa" : "em";
  press.value = false;
  stage.value = 0;
  nudge.value = false;
  toast.value = "";
}

function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b === 2) press.value = true;
  if (b === 3) { press.value = false; stage.value = 1; toast.value = channel.value === "wa" ? "Sent by WhatsApp" : "Sent by email"; }
  if (b === 5) { stage.value = 2; toast.value = "Delivered"; }
  if (b === 7) { stage.value = 3; toast.value = "Opened · 2:14 PM"; }
  if (b === 9) { nudge.value = true; toast.value = ""; }
  st.beat = (b + 1) % LEN;
}

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(tick, 1200);
}
function stop() {
  live.value = false;
  if (st.timer !== null) { window.clearInterval(st.timer); st.timer = null; }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    // static picture: opened, with the call-now nudge showing
    seen.value = true;
    for (let k = 0; k < 10; k++) tick();
    toast.value = "";
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) start();
      else stop();
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  st.fallback = window.setTimeout(() => { if (!seen.value) seen.value = true; }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  stop();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=urbanist:wght@400;500;600&display=swap");

.snd {
  --ink: #14120f;
  --muted: #6a6560;
  --peach: #ffe9df;
  --butter: #fff3cf;
  --sky: #e0f0ff;
  --lav: #f0ecff;
  --mint: #e3f6ec;
  --pink: #ffe4ee;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Urbanist", system-ui, sans-serif;
}
.snd *, .snd *::before, .snd *::after { box-sizing: border-box; }

/* ---------- heading ---------- */
.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.head p { margin: 0 auto; max-width: 60ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

/* ---------- stage ---------- */
.stage {
  width: min(1080px, calc(100% - 40px)); margin: 64px auto 0;
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 28px; align-items: stretch;
}
.send-photo { position: relative; width: min(1080px, calc(100% - 40px)); height: clamp(190px, 26vw, 300px); margin: 34px auto 0; overflow: hidden; border-radius: 28px; background: #dce5eb; isolation: isolate; }
.send-photo::after { position: absolute; z-index: -1; inset: 30% 0 0; background: linear-gradient(transparent, rgba(20, 18, 15, 0.72)); content: ""; }
.send-photo img { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 42%; }
.send-photo figcaption { position: absolute; right: 28px; bottom: 24px; left: 28px; display: grid; gap: 4px; color: #fff; }
.send-photo figcaption span { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.send-photo figcaption b { font-size: clamp(18px, 2.2vw, 26px); font-weight: 500; }
.doc { position: relative; display: flex; flex-direction: column; gap: 18px; padding: 26px; border-radius: 30px; min-width: 0; }
.compose { background: var(--pink); }
.track { background: var(--sky); }
.dh { display: flex; align-items: center; gap: 12px; }
.badge { flex: none; padding: 6px 12px; border-radius: 99px; background: #fff; font-size: 12px; font-weight: 600; }
.compose .badge { color: #b0245a; }
.track .badge { color: #3b82c4; }
.dt { min-width: 0; flex: 1; }
.dt b { display: block; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.dt small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qs { flex: none; padding: 5px 11px; border-radius: 99px; background: #fff; color: #8a857f; font-size: 12px; font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.qs.sent { background: #b0245a; color: #fff; }
.qs.seen { background: #3b82c4; color: #fff; }

/* channel */
.chan { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 5px; border-radius: 99px; background: rgba(255, 255, 255, 0.6); }
.ch { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 9px 10px; border-radius: 99px; font-size: 13px; font-weight: 600; color: #8a6a77; transition: background 0.35s, color 0.35s, box-shadow 0.35s; }
.ch.on { background: #fff; color: #b0245a; box-shadow: 0 8px 18px -10px rgba(176, 36, 90, 0.5); }

/* message panel */
.panel { display: grid; gap: 12px; padding: 16px; border-radius: 20px; background: #fff; flex: 1; align-content: start; }
.to { display: flex; align-items: baseline; gap: 10px; padding-bottom: 10px; border-bottom: 1px solid #f6e6ec; font-size: 13px; }
.to small { color: var(--muted); font-size: 12px; }
.to b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.msg { margin: 0; font-size: 12.5px; line-height: 1.65; color: #4a4540; }
.file { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; background: var(--butter); }
.pdf { flex: none; display: grid; place-items: center; width: 34px; height: 40px; border-radius: 8px; background: #ffc9dc; color: #b0245a; font-size: 10px; font-weight: 700; }
.fn b { display: block; font-size: 13px; font-weight: 600; }
.fn small { color: #7a6f4a; font-size: 11.5px; }

.send { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 18px; border: 0; border-radius: 99px; background: #b0245a; color: #fff; font: inherit; font-size: 14px; font-weight: 600; pointer-events: none; transition: transform 0.25s, background 0.35s; }
.send.press { transform: scale(0.94); background: #8f1c49; }
.send.done { background: #15803d; }

/* illustration */
.art { height: 210px; border-radius: 20px; background: #fff; overflow: hidden; padding: 6px; }
.bub, .mi, .fl { opacity: 0; transform-box: fill-box; transform-origin: center; transform: translateY(8px); transition: opacity 0.45s, transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1); }
.bub.show, .mi.show, .fl.show { opacity: 1; transform: none; }
.tk { stroke: #c9bfa3; transition: stroke 0.4s; }
.tk.d { stroke: #9d8f5f; }
.tk.o { stroke: #3b82c4; }

/* steps */
.steps { list-style: none; margin: 0; padding: 14px; border-radius: 20px; background: #fff; display: grid; gap: 4px; min-height: 142px; align-content: start; }
.steps li { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 12px; font-size: 12.5px; opacity: 0.25; transition: opacity 0.4s, background 0.3s; }
.steps li.shown { opacity: 0.6; }
.steps li.cur { opacity: 1; background: var(--sky); }
.dot { flex: none; width: 10px; height: 10px; border-radius: 50%; background: #c9d9e8; transition: background 0.3s; }
.steps li.shown .dot { background: #3b82c4; }
.st { flex: 1; min-width: 0; font-weight: 500; }
.sw { flex: none; color: var(--muted); font-size: 11.5px; }

.toast { position: absolute; left: 50%; bottom: -14px; display: inline-flex; align-items: center; gap: 7px; padding: 9px 15px; border-radius: 99px; background: #fff; color: #3b82c4; font-size: 12px; font-weight: 600; white-space: nowrap; box-shadow: 0 12px 26px -10px rgba(59, 130, 196, 0.5); opacity: 0; transform: translate(-50%, 10px) scale(0.94); transition: opacity 0.35s, transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1); pointer-events: none; }
.toast.show { opacity: 1; transform: translate(-50%, 0) scale(1); }

/* ---------- entrance ---------- */
.snd:not(.in) .head, .snd:not(.in) .stage, .snd:not(.in) .send-photo { opacity: 0; }
.snd.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.snd.in .compose { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.snd.in .track { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }
.snd.in .send-photo { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.35s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: scale(1.18); opacity: 0.4; } to { transform: none; opacity: 1; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .stage { grid-template-columns: minmax(0, 1fr); max-width: 640px; }
}
@media (max-width: 640px) {
  .snd { padding: 72px 0; }
  .head p { font-size: 15.5px; }
  .stage { margin-top: 44px; width: calc(100% - 32px); gap: 22px; }
  .send-photo { width: calc(100% - 32px); height: 190px; margin-top: 24px; border-radius: 22px; }
  .send-photo figcaption { right: 18px; bottom: 18px; left: 18px; }
  .doc { padding: 18px; border-radius: 24px; }
  .art { height: 180px; }
  .dt small { display: none; }
  .sw { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .snd *, .snd *::before, .snd *::after { animation: none !important; transition: none !important; }
  .snd:not(.in) .head, .snd:not(.in) .stage, .snd:not(.in) .send-photo { opacity: 1; }
}
</style>
