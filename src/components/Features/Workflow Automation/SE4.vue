<template>
  <section id="automations" ref="root" class="aut" :class="{ in: seen, live }" aria-labelledby="aut-title">
    <header class="head">
      <h2 id="aut-title" class="title">
        <span>Automations</span>
        <span class="soft">our customers set up first</span>
      </h2>
    </header>

    <div class="wrap">
      <!-- ============ the five recipes ============ -->
      <ul class="list" role="tablist" aria-label="Automations" @mouseenter="paused = true" @mouseleave="paused = false" @focusin="paused = true" @focusout="paused = false">
        <li v-for="(r, i) in recipes" :key="r.title">
          <button type="button" class="item" :class="{ on: i === idx }" role="tab" :aria-selected="i === idx" :style="{ '--c': r.c, '--b': r.b }" @click="choose(i)">
            <span class="ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path v-for="(d, k) in r.icon" :key="k" :d="d" /></svg>
            </span>
            <span class="tx"><b>{{ r.title }}</b><small>{{ r.does }}</small></span>
            <span class="line" aria-hidden="true">
              <span class="fill" :style="{ animationPlayState: paused || !live ? 'paused' : 'running' }" @animationend="next"></span>
            </span>
          </button>
        </li>
      </ul>

      <!-- ============ live run ============ -->
      <div class="panel" :style="{ '--c': cur.c, '--b': cur.b }">
        <div :key="idx" class="run" :style="{ '--sw': swapAt }" aria-live="polite">
          <!-- the record the automation works on -->
          <div class="subject">
            <span class="sav" aria-hidden="true">{{ cur.subject.ini }}</span>
            <div class="sn"><b>{{ cur.subject.name }}</b><small>{{ cur.subject.sub }}</small></div>
            <span class="chips">
              <em class="chip before" :class="cur.subject.tone">{{ cur.subject.before }}</em>
              <em class="chip after">{{ cur.subject.after }}</em>
            </span>
          </div>

          <!-- trigger + steps -->
          <div class="trig">
            <span class="tb"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg></span>
            <div><small>When</small><b>{{ cur.trigger }}</b></div>
          </div>
          <ol class="steps">
            <li v-for="(s, k) in cur.steps" :key="s.t" class="step" :style="{ '--s': 0.9 + k * 1.9 }">
              <span class="sic" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path v-for="(d, j) in s.icon" :key="j" :d="d" /></svg>
              </span>
              <div class="st"><b>{{ s.t }}</b><small>{{ s.d }}</small></div>
              <span class="stat">
                <em class="q">Queued</em>
                <em class="r"><i></i>Running</em>
                <em class="d"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>Done</em>
              </span>
            </li>
          </ol>

          <div class="foot"><i></i><span>Ran <b class="mono cnt" :style="{ '--n': cur.runs }"></b> times this month</span><small>Example figures</small></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const I = {
  user: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  chat: ["M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"],
  task: ["M9 11l3 3 8-8", "M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9"],
  bell: ["M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9", "M10.3 21a1.9 1.9 0 0 0 3.4 0"],
  pin: ["M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z", "M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"],
  doc: ["M6 3h9l4 4v14H6z", "M14 3v5h5", "M9 13h6", "M9 17h6"],
  up: ["M12 19V5", "M5 12l7-7 7 7"],
  rocket: ["M5 15c-1.5 1.2-2 4-2 6 2 0 4.8-.5 6-2", "M12 15l-3-3a22 22 0 0 1 2-4 12 12 0 0 1 9-5 12 12 0 0 1-5 9 22 22 0 0 1-4 2z"],
  send: ["M22 2 11 13", "M22 2l-7 20-4-9-9-4z"],
  clock: ["M12 6v6l4 2", "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],
  repeat: ["M17 2l4 4-4 4", "M3 11V9a3 3 0 0 1 3-3h15", "M7 22l-4-4 4-4", "M21 13v2a3 3 0 0 1-3 3H3"],
};

const recipes = [
  {
    title: "New Facebook lead", does: "Assign by territory, send a WhatsApp welcome and create a call task for today",
    trigger: "A new Facebook lead arrives", runs: 1284, c: "#0b57d0", b: "#e0f0ff", icon: I.user,
    subject: { ini: "CR", name: "Chaminda Rathnayake", sub: "Kandy · Facebook lead · 10:14", before: "Unassigned", after: "Assigned · Nuwan, Kandy", tone: "warn" },
    steps: [
      { t: "Assign by territory", d: "Kandy → Nuwan Silva", icon: I.pin },
      { t: "Send a WhatsApp welcome", d: "Template · welcome_lead", icon: I.chat },
      { t: "Create a call task for today", d: "Call Chaminda by 5 pm", icon: I.task },
    ],
  },
  {
    title: "Quote sent and not opened in two days", does: "Remind the rep",
    trigger: "A quote is sent and not opened in two days", runs: 436, c: "#b45309", b: "#fff3cf", icon: I.doc,
    subject: { ini: "Q", name: "QT-0142 · Ceylon Foods", sub: "Sent 2 days ago · Rs. 405,000", before: "Not opened", after: "Rep reminded", tone: "warn" },
    steps: [{ t: "Remind the rep", d: "Nuwan Silva · QT-0142 is still unopened", icon: I.bell }],
  },
  {
    title: "Deal won", does: "Create an onboarding task and notify operations",
    trigger: "A deal is marked won", runs: 212, c: "#15803d", b: "#e3f6ec", icon: I.up,
    subject: { ini: "D", name: "Ceylon Foods · Rs. 405,000", sub: "Fleet service plan", before: "Won today", after: "Onboarding started", tone: "ok" },
    steps: [
      { t: "Create an onboarding task", d: "Assigned to the onboarding team", icon: I.rocket },
      { t: "Notify operations", d: "Operations team notified", icon: I.bell },
    ],
  },
  {
    title: "Ticket breaching its SLA", does: "Escalate to the support manager",
    trigger: "A ticket is breaching its SLA", runs: 87, c: "#b0245a", b: "#ffe4ee", icon: I.clock,
    subject: { ini: "T", name: "#T-1827 · Unit 4471 not cooling", sub: "Priority: high", before: "SLA breaching", after: "Escalated to Maya", tone: "crit" },
    steps: [{ t: "Escalate to the support manager", d: "Maya notified · ticket flagged", icon: I.up }],
  },
  {
    title: "AMC expiring in 30 days", does: "Send a renewal reminder to the customer",
    trigger: "An AMC is expiring in 30 days", runs: 143, c: "#5b45c9", b: "#f0ecff", icon: I.repeat,
    subject: { ini: "A", name: "AMC-2041 · Ceylon Motors", sub: "Split AC 2.0T · Unit 4471", before: "Expires in 30 days", after: "Reminder sent", tone: "warn" },
    steps: [{ t: "Send a renewal reminder to the customer", d: "Reminder delivered to Ceylon Motors", icon: I.send }],
  },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const idx = ref(0);
const paused = ref(false);
const cur = computed(() => recipes[idx.value]);
const swapAt = computed(() => 0.9 + cur.value.steps.length * 1.9 - 0.3); // when the record's status flips
const next = () => { idx.value = (idx.value + 1) % recipes.length; };
const choose = (i) => { idx.value = i; };

const st = { io: null, fallback: null };

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true; // static: first automation, finished
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) { seen.value = true; live.value = true; }
      else live.value = false; // pauses every loop while off screen
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  // safety net so the content can never stay invisible
  st.fallback = window.setTimeout(() => { if (!seen.value) seen.value = true; }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.aut {
  --orange: #ff6338;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #efe4de;
  --dur: 9s;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.aut *, .aut *::before, .aut *::after { box-sizing: border-box; }
.aut button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }
.mono { font-variant-numeric: tabular-nums; }

.head { width: min(900px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0; font-size: clamp(36px, 4.6vw, 66px); font-weight: 500; line-height: 1.1; letter-spacing: -0.04em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }

.wrap { width: min(1180px, calc(100% - 40px)); margin: 56px auto 0; display: grid; grid-template-columns: 0.95fr 1.05fr; gap: 56px; align-items: center; }

/* ---------- list ---------- */
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.item { --c: #8a857f; --b: #f4efec; position: relative; display: flex; align-items: center; gap: 14px; width: 100%; padding: 16px 18px 18px 14px; border: 0; border-radius: 22px; background: none; text-align: left; font: inherit; color: inherit; cursor: pointer; transition: background 0.4s; }
.item:hover { background: #faf6f3; }
.item.on { background: var(--b); }
.ic { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 14px; background: var(--b); color: var(--c); transition: background 0.35s, color 0.35s, transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1); }
.item.on .ic { background: var(--c); color: #fff; transform: scale(1.06) rotate(-4deg); }
.tx { min-width: 0; flex: 1; }
.tx b { display: block; font-size: 15.5px; font-weight: 500; line-height: 1.4; letter-spacing: -0.01em; color: #6f6862; transition: color 0.3s; }
.item.on .tx b, .item:hover .tx b { color: var(--ink); }
.tx small { display: block; max-height: 0; overflow: hidden; opacity: 0; color: var(--muted); font-size: 12.5px; line-height: 1.5; transition: max-height 0.4s ease, margin 0.4s ease, opacity 0.4s; }
.item.on .tx small { max-height: 60px; margin-top: 3px; opacity: 1; }
.line { position: absolute; left: 14px; right: 14px; bottom: 6px; height: 2px; border-radius: 2px; overflow: hidden; }
.item.on .line { background: rgba(20, 18, 15, 0.08); }
.fill { position: absolute; inset: 0; width: 0; background: var(--c); }
.item.on .fill { animation: fill var(--dur) linear forwards; }

/* ---------- live run ---------- */
.panel { --c: #0b57d0; --b: #e0f0ff; min-width: 0; padding: 18px; border-radius: 34px; background: var(--b); transition: background 0.6s ease; }
.run { display: grid; gap: 12px; animation: rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.subject, .trig, .step, .foot { background: #fff; border-radius: 22px; box-shadow: 0 1px 2px rgba(80, 40, 20, 0.04), 0 12px 24px -16px rgba(20, 18, 15, 0.3); }
.subject { display: flex; align-items: center; gap: 12px; padding: 16px; }
.sav { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 14px; background: var(--b); color: var(--c); font-size: 14px; font-weight: 600; }
.sn { min-width: 0; flex: 1; }
.sn b { display: block; font-size: 14.5px; font-weight: 600; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sn small { display: block; color: var(--muted); font-size: 12px; }
.chips { position: relative; display: grid; flex: none; }
.chip { grid-area: 1 / 1; justify-self: end; padding: 6px 12px; border-radius: 99px; font-size: 11.5px; font-style: normal; font-weight: 600; white-space: nowrap; }
.chip.before.warn { background: #fff3cf; color: #b45309; }
.chip.before.crit { background: #fde8e8; color: #dc2626; }
.chip.before.ok { background: #e3f6ec; color: #15803d; }
.chip.after { background: #e3f6ec; color: #15803d; opacity: 0; }

.trig { display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin-top: 2px; }
.tb { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 11px; background: var(--c); color: #fff; animation: pop 0.5s cubic-bezier(0.3, 1.7, 0.5, 1) 0.2s both; }
.trig small { display: block; color: var(--c); font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.trig b { display: block; font-size: 13.5px; font-weight: 600; line-height: 1.35; }

.steps { list-style: none; margin: 0; padding: 0 0 0 22px; display: grid; gap: 12px; }
.step { --s: 1; position: relative; display: flex; align-items: center; gap: 12px; padding: 13px 14px; animation: stepOn 0.45s ease calc(var(--s) * 1s) both; }
.step::before { content: ""; position: absolute; left: -17px; top: -13px; width: 2px; height: calc(50% + 13px); border-radius: 2px; background: var(--c); transform: scaleY(0); transform-origin: top; animation: seg 0.45s ease calc((var(--s) - 0.4) * 1s) both; }
.step::after { content: ""; position: absolute; left: -17px; top: 50%; width: 17px; height: 2px; border-radius: 2px; background: var(--c); transform: scaleX(0); transform-origin: left; animation: segx 0.3s ease calc((var(--s) - 0.1) * 1s) both; }
.sic { flex: none; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 12px; background: var(--b); color: var(--c); }
.st { min-width: 0; flex: 1; }
.st b { display: block; font-size: 13.5px; font-weight: 600; line-height: 1.35; }
.st small { display: block; color: var(--muted); font-size: 12px; }
.stat { position: relative; flex: none; display: grid; justify-items: end; }
.stat em { grid-area: 1 / 1; display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 99px; font-size: 11px; font-style: normal; font-weight: 600; white-space: nowrap; }
.q { background: #f4efec; color: #8a857f; animation: fadeOut 0.25s ease calc(var(--s) * 1s) both; }
.r { background: var(--b); color: var(--c); opacity: 0; animation: runShow 1.4s ease calc(var(--s) * 1s) both; }
.r i { width: 11px; height: 11px; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; animation: spin 0.7s linear infinite; }
.d { background: #e3f6ec; color: #15803d; opacity: 0; animation: fadeIn 0.4s cubic-bezier(0.3, 1.6, 0.5, 1) calc((var(--s) + 1.2) * 1s) both; }
.before { animation: fadeOut 0.3s ease calc(var(--sw) * 1s) both; }
.after { animation: fadeIn 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) calc(var(--sw) * 1s) both; }

.foot { display: flex; align-items: center; gap: 10px; padding: 12px 16px; font-size: 12.5px; color: var(--muted); }
.foot i { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; animation: blink 1.4s ease-in-out infinite; }
.foot b { color: var(--ink); font-weight: 600; }
.foot small { margin-left: auto; color: #b3aca5; font-size: 11px; }
@property --n { syntax: "<integer>"; initial-value: 0; inherits: false; }
.cnt { counter-reset: n var(--n); }
.cnt::before { content: counter(n); }
.run .cnt { animation: count 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s both; }

/* ---------- entrance + pause ---------- */
.aut:not(.in) .head, .aut:not(.in) .wrap { opacity: 0; }
.aut.in .head { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.aut.in .wrap { animation: rise 1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.aut:not(.live) .run *, .aut:not(.live) .foot i { animation-play-state: paused; }

@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
@keyframes fill { from { width: 0; } to { width: 100%; } }
@keyframes stepOn { from { opacity: 0.45; transform: translateX(-6px) scale(0.985); } to { opacity: 1; transform: none; } }
@keyframes seg { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes segx { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes fadeOut { to { opacity: 0; transform: scale(0.85); } }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
@keyframes runShow { 0% { opacity: 0; } 12%, 80% { opacity: 1; } 100% { opacity: 0; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes count { from { --n: 0; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .wrap { grid-template-columns: minmax(0, 1fr); gap: 36px; max-width: 640px; }
}
@media (max-width: 640px) {
  .aut { padding: 72px 0; }
  .wrap { width: calc(100% - 32px); margin-top: 36px; }
  .panel { padding: 12px; border-radius: 26px; }
  .subject { flex-wrap: wrap; }
  .chips { margin-left: 56px; }
  .steps { padding-left: 14px; }
  .step::before { left: -9px; }
  .step::after { left: -9px; width: 9px; }
  .stat .q, .stat .r { font-size: 10.5px; }
}
@media (prefers-reduced-motion: reduce) {
  .aut *, .aut *::before, .aut *::after { animation: none !important; transition: none !important; }
  .aut:not(.in) .head, .aut:not(.in) .wrap { opacity: 1; }
  .item.on .fill { width: 100%; }
  .q, .r, .chip.before { display: none; }
  .d, .chip.after { opacity: 1; }
  .step::before { transform: scaleY(1); }
  .step::after { transform: scaleX(1); }
}
</style>
