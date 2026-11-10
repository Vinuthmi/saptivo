<template>
  <section id="journey" ref="root" class="jny" :class="{ in: seen, live }" aria-labelledby="jny-title">
    <header class="head">
      <h2 id="jny-title" class="title">
        <span>From phone call</span>
        <span class="soft">to closed deal</span>
      </h2>
      <p>
        A new caller asks about a product. The call is logged automatically, the rep creates a lead from the pop-up,
        sends a quotation on WhatsApp straight after the call and sets a follow-up task. The whole journey, from first
        ring to signed invoice, sits on one timeline.
      </p>
    </header>

    <div class="stage">
      <!-- ============ the one timeline ============ -->
      <article class="doc tl" aria-label="One timeline">
        <div class="dh">
          <span class="badge">Timeline</span>
          <div class="dt"><b>{{ cur >= 2 ? "Kamal Jayawardena" : "New caller" }}</b><small>One customer record, one timeline</small></div>
          <span :key="cur >= 5" class="qs" :class="{ on: cur >= 5 }">{{ cur >= 5 ? "Closed" : cur >= 2 ? "Lead" : cur === 1 ? "New number" : "Waiting" }}</span>
        </div>

        <ol class="steps">
          <li v-for="(s, i) in steps" :key="s.t" :class="[s.tone, { shown: i < cur, cur: i === cur - 1 }]">
            <span class="ico" v-html="icons[s.icon]"></span>
            <span class="sx"><b>{{ s.t }}</b><small>{{ s.d }}</small></span>
            <span class="sw">{{ s.when }}</span>
          </li>
        </ol>
      </article>

      <!-- ============ what the rep sees ============ -->
      <article class="doc view" aria-label="What the rep sees">
        <div class="dh">
          <span class="badge vb">{{ cur ? steps[cur - 1].t : "First ring" }}</span>
          <div class="dt"><b>{{ cur ? steps[cur - 1].view : "Waiting for a call" }}</b><small>What the rep sees</small></div>
        </div>

        <div class="pane" :key="cur">
          <!-- 0 · idle -->
          <div v-if="cur === 0" class="idle">The phone is quiet.</div>

          <!-- 1 · call -->
          <div v-else-if="cur === 1" class="p call">
            <span class="av u"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4" /><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" /></svg></span>
            <b class="mono">+94 71 555 0198</b>
            <small>Asks about the fleet service plan</small>
            <span class="chip ok">Call logged · 02:48</span>
          </div>

          <!-- 2 · lead -->
          <div v-else-if="cur === 2" class="p lead">
            <span class="av k">KJ</span>
            <b>Kamal Jayawardena</b>
            <small>Interested · fleet service plan</small>
            <span class="chip lv">Lead created from the pop-up</span>
          </div>

          <!-- 3 · whatsapp -->
          <div v-else-if="cur === 3" class="p wa">
            <div class="bub">
              <p>Hello Kamal, here is your quotation for the fleet service plan.</p>
              <div class="file"><span class="pdf">PDF</span><span><b>QT-0142.pdf</b><small>84 KB</small></span></div>
              <span class="ticks">10:24 ✓✓</span>
            </div>
            <span class="chip ok">Sent by WhatsApp</span>
          </div>

          <!-- 4 · task -->
          <div v-else-if="cur === 4" class="p task">
            <span class="cb"></span>
            <b>Call back Kamal</b>
            <small>Thursday 10:00 · Ruwan Silva</small>
            <span class="chip bt">Follow-up task set</span>
          </div>

          <!-- 5 · invoice -->
          <div v-else class="p inv">
            <div class="ih"><b>INV-0087</b><span class="stamp">PAID</span></div>
            <ul>
              <li><span>Subtotal</span><b class="mono">Rs. 405,000</b></li>
              <li><span>VAT 18%</span><b class="mono">Rs. 72,900</b></li>
              <li class="tot"><span>Total</span><b class="mono">Rs. 477,900</b></li>
            </ul>
            <span class="chip ok">Quote converted in one click</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const icons = {
  phone: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>',
  user: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4" /><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" /></svg>',
  chat: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.5A8.4 8.4 0 1 1 21 11.5Z" /></svg>',
  task: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>',
  doc: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l4 4v14H7Z" /><path d="M10 12h5M10 16h5" /></svg>',
};

const steps = [
  { icon: "phone", tone: "peach", t: "First ring", d: "New caller asks about a product. Logged automatically.", when: "Mon 10:12", view: "Call logged" },
  { icon: "user", tone: "butter", t: "Lead created", d: "Saved from the pop-up in one click.", when: "Mon 10:19", view: "New lead" },
  { icon: "chat", tone: "mint", t: "Quotation on WhatsApp", d: "QT-0142 sent straight after the call.", when: "Mon 10:24", view: "Quotation sent" },
  { icon: "task", tone: "sky", t: "Follow-up task", d: "Call back Thursday at 10:00.", when: "Mon 10:25", view: "Task set" },
  { icon: "doc", tone: "pink", t: "Signed invoice", d: "INV-0087 · Rs. 477,900 · Paid.", when: "Fri 14:05", view: "Deal closed" },
];

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const cur = ref(0);

const st = { beat: 0, timer: null, io: null, fallback: null };
const LEN = 18; // beats of 1.2 s

function tick() {
  const b = st.beat;
  if (b === 0) cur.value = 0;
  if (b === 1) cur.value = 1;
  if (b === 4) cur.value = 2;
  if (b === 7) cur.value = 3;
  if (b === 10) cur.value = 4;
  if (b === 13) cur.value = 5;
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
    // static picture: the whole journey, signed invoice shown
    seen.value = true;
    for (let k = 0; k < 15; k++) tick();
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

.jny {
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
.jny *, .jny *::before, .jny *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }

/* ---------- heading ---------- */
.head { width: min(780px, calc(100% - 40px)); margin: 0 auto; text-align: center; }
.title { margin: 0 0 22px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.head p { margin: 0 auto; max-width: 60ch; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

/* ---------- stage ---------- */
.stage { width: min(1100px, calc(100% - 40px)); margin: 64px auto 0; display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 28px; align-items: stretch; }
.doc { position: relative; display: flex; flex-direction: column; gap: 16px; padding: 26px; border-radius: 30px; min-width: 0; }
.tl { background: var(--lav); }
.view { background: var(--mint); }
.dh { display: flex; align-items: center; gap: 12px; }
.badge { flex: none; padding: 6px 12px; border-radius: 99px; background: #fff; color: #5b45c9; font-size: 12px; font-weight: 600; }
.badge.vb { color: #15803d; animation: bump 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.dt { min-width: 0; flex: 1; }
.dt b { display: block; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dt small { display: block; color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qs { flex: none; padding: 5px 11px; border-radius: 99px; background: #fff; color: #8a857f; font-size: 12px; font-weight: 600; animation: bump 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both; }
.qs.on { background: #15803d; color: #fff; }

/* steps */
.steps { list-style: none; margin: 0; padding: 12px; border-radius: 22px; background: #fff; display: grid; gap: 4px; position: relative; flex: 1; align-content: start; }
.steps::before { content: ""; position: absolute; left: 33px; top: 36px; bottom: 36px; border-left: 2px dashed #e6defa; }
.steps li { position: relative; display: flex; align-items: center; gap: 14px; padding: 13px 10px; border-radius: 16px; opacity: 0.3; transform: translateY(6px); transition: opacity 0.45s, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.35s; }
.steps li.shown { opacity: 0.65; transform: none; }
.steps li.cur { opacity: 1; }
.steps li.cur.peach { background: var(--peach); }
.steps li.cur.butter { background: var(--butter); }
.steps li.cur.mint { background: var(--mint); }
.steps li.cur.sky { background: var(--sky); }
.steps li.cur.pink { background: var(--pink); }
.ico { position: relative; flex: none; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; box-shadow: 0 0 0 5px #fff; }
.peach .ico { background: var(--peach); color: #c2410c; }
.butter .ico { background: var(--butter); color: #8a5a00; }
.mint .ico { background: var(--mint); color: #15803d; }
.sky .ico { background: var(--sky); color: #3b82c4; }
.pink .ico { background: var(--pink); color: #b0245a; }
.sx { flex: 1; min-width: 0; display: grid; }
.sx b { font-size: 13.5px; font-weight: 600; letter-spacing: -0.01em; }
.sx small { color: var(--muted); font-size: 12px; line-height: 1.45; }
.sw { flex: none; color: var(--muted); font-size: 11.5px; font-weight: 500; }

/* preview pane */
.pane { flex: 1; min-height: 340px; display: grid; place-items: center; padding: 18px; border-radius: 22px; background: #fff; animation: pane 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.idle { color: var(--muted); font-size: 13.5px; }
.p { width: 100%; display: grid; justify-items: center; gap: 8px; text-align: center; }
.p b { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; }
.p small { color: var(--muted); font-size: 12.5px; }
.chip { margin-top: 6px; padding: 7px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; }
.chip.ok { background: var(--mint); color: #15803d; }
.chip.lv { background: var(--butter); color: #8a5a00; }
.chip.bt { background: var(--sky); color: #3b82c4; }
.av { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; font-size: 15px; font-weight: 600; }
.av.u { background: var(--peach); color: #c2410c; }
.av.k { background: var(--butter); color: #8a5a00; }

.bub { width: 100%; max-width: 280px; padding: 12px 14px; border-radius: 18px 18px 4px 18px; background: #d9f5df; text-align: left; display: grid; gap: 10px; }
.bub p { margin: 0; font-size: 12.5px; line-height: 1.55; }
.file { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 12px; background: #fff; }
.file b { font-size: 12.5px; }
.file small { display: block; font-size: 11px; }
.pdf { display: grid; place-items: center; width: 30px; height: 36px; border-radius: 7px; background: #ffc9dc; color: #b0245a; font-size: 9px; font-weight: 700; }
.ticks { justify-self: end; color: #3b82c4; font-size: 11px; font-weight: 600; }

.cb { width: 28px; height: 28px; border-radius: 9px; border: 2.5px solid #9ec8ee; background: var(--sky); }
.inv { gap: 12px; }
.ih { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.stamp { padding: 3px 12px; border: 2px solid #15803d; border-radius: 8px; color: #15803d; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; transform: rotate(-6deg); animation: stampIn 0.5s cubic-bezier(0.3, 1.8, 0.5, 1) 0.15s both; }
.inv ul { list-style: none; margin: 0; padding: 12px 14px; width: 100%; border-radius: 16px; background: #faf8fc; display: grid; gap: 7px; }
.inv li { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--muted); }
.inv li b { font-size: 12.5px; color: var(--ink); }
.inv .tot { padding-top: 8px; border-top: 1px solid #ece7f4; font-size: 14px; font-weight: 600; color: var(--ink); }

/* ---------- entrance ---------- */
.jny:not(.in) .head, .jny:not(.in) .stage { opacity: 0; }
.jny.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.jny.in .tl { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }
.jny.in .view { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s backwards; }

@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: scale(1.18); opacity: 0.4; } to { transform: none; opacity: 1; } }
@keyframes pane { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes stampIn { from { opacity: 0; transform: rotate(-6deg) scale(1.7); } to { opacity: 1; transform: rotate(-6deg) scale(1); } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .stage { grid-template-columns: minmax(0, 1fr); max-width: 640px; }
  .pane { min-height: 280px; }
}
@media (max-width: 640px) {
  .jny { padding: 72px 0; }
  .head p { font-size: 15.5px; }
  .stage { margin-top: 44px; width: calc(100% - 32px); gap: 22px; }
  .doc { padding: 18px; border-radius: 24px; }
  .dt small { display: none; }
  .sw { display: none; }
  .steps::before { left: 29px; }
}
@media (prefers-reduced-motion: reduce) {
  .jny *, .jny *::before, .jny *::after { animation: none !important; transition: none !important; }
  .jny:not(.in) .head, .jny:not(.in) .stage { opacity: 1; }
}
</style>
