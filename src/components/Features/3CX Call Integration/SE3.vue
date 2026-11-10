<template>
  <section id="missed" ref="root" class="mis" :class="{ in: seen, live }" aria-labelledby="mis-title">
    <header class="head">
      <h2 id="mis-title" class="title">
        <span>Never lose</span>
        <span class="soft">a missed call again</span>
      </h2>
      <p>
        A missed call is often a lost enquiry. Saptivo turns missed calls into callback tasks and alerts the right
        person. Click-to-call lets reps dial any customer straight from their record through 3CX.
      </p>
    </header>

    <div class="stage">
      <!-- ============ the missed call ============ -->
      <article class="doc miss" aria-label="Missed call">
        <div class="dh">
          <span class="badge">Missed call</span>
          <div class="dt"><b>Front desk line</b><small>Nobody was free to pick up</small></div>
          <span :key="missed" class="qs" :class="{ bad: missed && !done }">{{ done ? "Handled" : missed ? "1 missed" : "No missed calls" }}</span>
        </div>

        <!-- pastel illustration (optional photo replaces it when `photo` is set) -->
        <div class="art" aria-hidden="true">
          <img v-if="photo && imgOk" :src="photo" alt="" loading="lazy" decoding="async" @error="imgOk = false" />
          <svg v-else viewBox="0 0 360 220" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="70" cy="66" r="48" fill="#ffe9df" />
            <circle cx="304" cy="156" r="54" fill="#f0ecff" />
            <circle cx="318" cy="46" r="22" fill="#fff3cf" />
            <circle cx="56" cy="184" r="22" fill="#e3f6ec" />

            <!-- desk phone -->
            <rect x="110" y="120" width="140" height="70" rx="20" fill="#fff" stroke="#f3d3c4" stroke-width="2" />
            <rect x="128" y="138" width="104" height="14" rx="7" fill="#ffe4ee" />
            <g fill="#ffe9df">
              <circle cx="140" cy="168" r="6" /><circle cx="162" cy="168" r="6" /><circle cx="184" cy="168" r="6" /><circle cx="206" cy="168" r="6" />
            </g>
            <path d="M118 120c4-22 30-34 62-34s58 12 62 34" fill="none" stroke="#f3d3c4" stroke-width="12" stroke-linecap="round" />

            <!-- ringing arcs -->
            <g class="arcs" :class="{ on: missed && !done }" fill="none" stroke="#f5a8c4" stroke-width="3" stroke-linecap="round">
              <path d="M148 60c10-10 14-10 24 0" />
              <path d="M138 46c18-18 26-18 44 0" />
              <path d="M188 60c10-10 14-10 24 0" />
              <path d="M178 46c18-18 26-18 44 0" />
            </g>

            <!-- missed badge -->
            <g class="pop" :class="{ show: missed }">
              <circle cx="260" cy="92" r="26" fill="#ffe4ee" stroke="#fff" stroke-width="4" />
              <path d="M251 83 269 101M269 83 251 101" stroke="#b0245a" stroke-width="3.4" stroke-linecap="round" />
            </g>

            <!-- callback arrow chip -->
            <g class="pop" :class="{ show: task }">
              <rect x="40" y="94" width="94" height="34" rx="17" fill="#fff" stroke="#fbe3a6" stroke-width="1.5" />
              <circle cx="60" cy="111" r="9" fill="#fff3cf" />
              <path d="m55 111 4 4 7-8" fill="none" stroke="#8a5a00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              <text x="75" y="115" font-size="11" font-weight="600" fill="#8a5a00">Task</text>
            </g>
          </svg>
        </div>

        <ul class="callrow" aria-label="Missed call">
          <li :class="{ shown: missed }">
            <span class="ico"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg></span>
            <span class="who"><b>Dilani Fernando</b><small>Lanka Tea Traders · +94 77 234 5678</small></span>
            <span class="tm">10:42</span>
          </li>
        </ul>
      </article>

      <div class="col">
        <!-- ============ the callback task ============ -->
        <article class="doc taskc" :class="{ show: task }" aria-label="Callback task">
          <div class="dh">
            <span class="badge">Callback task</span>
            <div class="dt"><b>Call back Dilani Fernando</b><small>Created automatically</small></div>
            <span :key="done" class="qs" :class="{ ok: done }">{{ done ? "Done" : "Open" }}</span>
          </div>
          <div class="trow">
            <span class="who2"><i class="av">RS</i><span><b>Ruwan Silva</b><small>Sales · due before 12:00</small></span></span>
            <span class="alert" :class="{ show: alert }">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 17c1.2-1.2 2-2.4 2-6a4 4 0 0 1 8 0c0 3.6.8 4.8 2 6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
              Alert sent
            </span>
          </div>
        </article>

        <!-- ============ click to call ============ -->
        <article class="doc ctc" aria-label="Click-to-call">
          <div class="dh">
            <span class="badge">Customer record</span>
            <div class="dt"><b>Dilani Fernando</b><small>Lanka Tea Traders</small></div>
            <span class="tcx">3CX</span>
          </div>
          <div class="crow">
            <span class="no mono">+94 77 234 5678</span>
            <span class="call" :class="{ press, dial: dial === 1, on: dial === 2 }">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
              {{ dial === 0 ? "Call" : dial === 1 ? "Dialling…" : "On call" }}
            </span>
          </div>
          <p class="note">{{ dial === 0 ? "One click dials through 3CX from the record." : dial === 1 ? "Ringing your extension first, then the customer." : "Connected · the call will be logged automatically." }}</p>
        </article>

        <div class="toast" :class="{ show: !!toast }" role="status">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
          {{ toast }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// Photo lives in public/images/features/ (file name is case sensitive).
const photo = "/saptivo/images/features/13.jpg";
const root = ref(null);const seen = ref(false);
const live = ref(false);
const imgOk = ref(true);
const missed = ref(false);
const task = ref(false);
const alert = ref(false);
const press = ref(false);
const dial = ref(0); // 0 idle, 1 dialling, 2 connected
const done = ref(false);
const toast = ref("");

const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 16; // beats of 1.2 s

function reset() {
  missed.value = false;
  task.value = false;
  alert.value = false;
  press.value = false;
  dial.value = 0;
  done.value = false;
  toast.value = "";
}

function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b === 1) missed.value = true;
  if (b === 3) { task.value = true; toast.value = "Callback task created"; }
  if (b === 4) { alert.value = true; toast.value = "Ruwan Silva alerted"; }
  if (b === 6) toast.value = "";
  if (b === 7) press.value = true;
  if (b === 8) { press.value = false; dial.value = 1; }
  if (b === 10) dial.value = 2;
  if (b === 12) { done.value = true; toast.value = "Callback done · logged"; }
  if (b === 14) toast.value = "";
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
    // static picture: task created, alert sent, call connected
    seen.value = true;
    for (let k = 0; k < 11; k++) tick();
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
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.mis {
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
  font-family: "Poppins", system-ui, sans-serif;
}
.mis *, .mis *::before, .mis *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

/* ---------- heading ---------- */
.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.head p { margin: 0 auto; max-width: 60ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

/* ---------- stage ---------- */
.stage { width: min(1120px, calc(100% - 40px)); margin: 64px auto 0; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 28px; align-items: stretch; }
.col { position: relative; display: grid; grid-template-rows: auto 1fr; gap: 28px; min-width: 0; }
.doc { position: relative; display: flex; flex-direction: column; gap: 16px; padding: 26px; border-radius: 30px; min-width: 0; }
.miss { background: var(--pink); }
.taskc { background: var(--butter); opacity: 0.45; transform: scale(0.97); transition: opacity 0.5s, transform 0.6s cubic-bezier(0.3, 1.4, 0.5, 1); }
.taskc.show { opacity: 1; transform: none; }
.ctc { background: var(--sky); }
.dh { display: flex; align-items: center; gap: 12px; }
.badge { flex: none; padding: 6px 12px; border-radius: 99px; background: #fff; font-size: 12px; font-weight: 600; }
.miss .badge { color: #b0245a; }
.taskc .badge { color: #8a5a00; }
.ctc .badge { color: #3b82c4; }
.dt { min-width: 0; flex: 1; }
.dt b { display: block; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dt small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qs { flex: none; padding: 5px 11px; border-radius: 99px; background: #fff; color: #8a857f; font-size: 12px; font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.qs.bad { background: #b0245a; color: #fff; }
.qs.ok { background: #15803d; color: #fff; }
.tcx { flex: none; padding: 5px 11px; border-radius: 99px; background: #fff; color: #3b82c4; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; }

/* illustration */
.art { position: relative; flex: 1; min-height: 230px; border-radius: 20px; background: #fff; overflow: hidden; padding: 6px; }
.art img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.arcs { opacity: 0; }
.arcs.on { animation: pulse 1.3s ease-in-out infinite; }
.mis:not(.live) .arcs.on { animation-play-state: paused; }
.pop { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(0.6); transition: opacity 0.4s, transform 0.5s cubic-bezier(0.3, 1.8, 0.5, 1); }
.pop.show { opacity: 1; transform: none; }

.callrow { list-style: none; margin: 0; padding: 10px; border-radius: 20px; background: #fff; }
.callrow li { display: flex; align-items: center; gap: 12px; padding: 8px 8px; border-radius: 14px; opacity: 0.35; transition: opacity 0.4s, background 0.3s; }
.callrow li.shown { opacity: 1; background: var(--pink); }
.ico { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--pink); color: #b0245a; }
.callrow li.shown .ico { background: #fff; }
.who { flex: 1; min-width: 0; display: grid; font-size: 12.5px; }
.who b { font-weight: 600; }
.who small { color: var(--muted); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tm { flex: none; color: var(--muted); font-size: 12px; font-weight: 500; }

/* task */
.trow { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; border-radius: 20px; background: #fff; }
.who2 { display: flex; align-items: center; gap: 10px; min-width: 0; font-size: 12.5px; }
.who2 > span { display: grid; min-width: 0; }
.who2 b { font-weight: 600; }
.who2 small { color: var(--muted); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.av { flex: none; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--lav); color: #5b45c9; font-size: 12px; font-style: normal; font-weight: 600; }
.alert { flex: none; display: inline-flex; align-items: center; gap: 6px; padding: 6px 11px; border-radius: 99px; background: var(--pink); color: #b0245a; font-size: 11.5px; font-weight: 600; opacity: 0; transform: scale(0.85); transition: opacity 0.35s, transform 0.45s cubic-bezier(0.3, 1.8, 0.5, 1); }
.alert.show { opacity: 1; transform: none; }

/* click-to-call */
.crow { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; border-radius: 20px; background: #fff; }
.no { font-size: 17px; font-weight: 600; letter-spacing: -0.02em; }
.call { flex: none; display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 99px; background: #3b82c4; color: #fff; font-size: 13px; font-weight: 600; box-shadow: 0 0 0 4px var(--sky); transition: transform 0.25s, background 0.35s; }
.call.press { transform: scale(0.92); background: #2c6aa6; }
.call.dial { background: #8a5a00; }
.call.on { background: #15803d; }
.note { margin: 0; padding: 0 4px; font-size: 12.5px; line-height: 1.55; color: #4f6a85; }

.toast { position: absolute; left: 50%; bottom: -14px; display: inline-flex; align-items: center; gap: 7px; padding: 9px 15px; border-radius: 99px; background: #fff; color: #15803d; font-size: 12px; font-weight: 600; white-space: nowrap; box-shadow: 0 12px 26px -10px rgba(21, 128, 61, 0.5); opacity: 0; transform: translate(-50%, 10px) scale(0.94); transition: opacity 0.35s, transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1); pointer-events: none; }
.toast.show { opacity: 1; transform: translate(-50%, 0) scale(1); }

/* ---------- entrance ---------- */
.mis:not(.in) .head, .mis:not(.in) .stage { opacity: 0; }
.mis.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.mis.in .miss { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.mis.in .col { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: scale(1.18); opacity: 0.4; } to { transform: none; opacity: 1; } }
@keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .stage { grid-template-columns: minmax(0, 1fr); max-width: 640px; }
}
@media (max-width: 640px) {
  .mis { padding: 72px 0; }
  .head p { font-size: 15.5px; }
  .stage { margin-top: 44px; width: calc(100% - 32px); gap: 22px; }
  .col { gap: 22px; }
  .doc { padding: 18px; border-radius: 24px; }
  .art { min-height: 190px; }
  .dt small { display: none; }
  .no { font-size: 15px; }
}
@media (prefers-reduced-motion: reduce) {
  .mis *, .mis *::before, .mis *::after { animation: none !important; transition: none !important; }
  .mis:not(.in) .head, .mis:not(.in) .stage { opacity: 1; }
  .arcs.on { opacity: 1; }
}
</style>
