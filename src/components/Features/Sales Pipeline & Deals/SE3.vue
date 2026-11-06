<template>
  <section id="follow-ups" ref="root" class="fu" :class="{ in: seen, live }" aria-labelledby="fu-title">
    <div class="head">
      <h2 id="fu-title" class="title">
        <span>Follow-ups that</span>
        <span class="soft">never slip</span>
      </h2>
      <div class="copy">
        <p class="strong">Most deals are lost to silence, not to competitors.</p>
        <p>Saptivo links every task, call, meeting, demo and follow-up to the right deal.</p>
      </div>
    </div>

    <div class="grid">
      <!-- calendar -->
      <article class="card cal">
        <header>
          <h3>Day, week and month calendar views</h3>
          <div class="seg" role="group" aria-label="Calendar view">
            <button v-for="v in views" :key="v" type="button" :class="{ on: view === v }" :aria-pressed="view === v" @click="setView(v)">{{ v }}</button>
          </div>
        </header>

        <div class="calbody">
          <Transition name="view" mode="out-in">
            <!-- week -->
            <div v-if="view === 'Week'" key="w" class="week">
              <div v-for="(d, di) in week" :key="d.d" class="wd" :class="{ today: di === 3 }">
                <p class="dn"><span>{{ d.d }}</span><b>{{ d.n }}</b></p>
                <span v-for="e in d.ev" :key="e.t" class="ev" :class="e.k"><small>{{ e.time }}</small>{{ e.t }}</span>
              </div>
            </div>

            <!-- day -->
            <ul v-else-if="view === 'Day'" key="d" class="day">
              <li v-for="e in dayList" :key="e.t" :class="e.k">
                <span class="tm">{{ e.time }}</span>
                <span class="ev"><b>{{ e.kind }}</b> {{ e.t }}</span>
              </li>
            </ul>

            <!-- month -->
            <div v-else key="m" class="month">
              <span v-for="(h, hi) in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="'h' + hi" class="mh">{{ h }}</span>
              <span v-for="b in 6" :key="'b' + b" class="mc blank"></span>
              <span v-for="n in 30" :key="n" class="mc" :class="{ today: n === 5 }">
                {{ n }}
                <i v-if="dots(n)" class="ds"><em v-for="k in dots(n)" :key="k" :class="dotKinds[(n + k) % 5]"></em></i>
              </span>
            </div>
          </Transition>

          <!-- reminder pop-up -->
          <Transition name="pop">
            <div v-if="reminder !== 'hidden'" class="toast" :class="reminder" role="status">
              <p class="cap">Pop-up reminders and snooze options</p>
              <template v-if="reminder === 'shown'">
                <p class="tt"><span class="bell">🔔</span><b>Call Nimal Perera</b> in 10 minutes</p>
                <div class="tb">
                  <button type="button" class="b dark" @click="snooze">Snooze 10 min</button>
                  <button type="button" class="b" @click="reminder = 'hidden'">Done</button>
                </div>
              </template>
              <p v-else class="tt"><span class="bell">💤</span>Snoozed · reminding again at 4:40 PM</p>
            </div>
          </Transition>
        </div>

        <p class="sync"><i></i>Reminders sync with Google Calendar, so your team sees them wherever they plan their day.</p>
      </article>

      <div class="col">
        <!-- tasks -->
        <article class="card tasks">
          <header><h3>Tasks with due dates, priority and owner</h3></header>
          <ul class="tl">
            <li v-for="(t, i) in tasks" :key="t.title" :class="{ late: i === 2 && overdue }">
              <span class="cb" aria-hidden="true"></span>
              <span class="tt2"><b>{{ t.title }}</b><small>{{ t.deal }}</small></span>
              <span class="pri" :class="t.pri">{{ t.pri }}</span>
              <span class="av">{{ t.owner }}</span>
              <span class="due">{{ i === 2 && overdue ? 'Overdue · 2 days' : t.due }}</span>
            </li>
          </ul>
          <Transition name="swap">
            <p v-if="overdue" class="esc"><span class="warn">!</span><span><b>Overdue task alert</b> · escalated to manager Kasun. <em>Overdue task alerts and escalation to managers</em></span></p>
          </Transition>
        </article>

        <!-- workload -->
        <article class="card load">
          <header><h3>A team workload view so no rep is overloaded</h3></header>
          <ul class="ld">
            <li v-for="(r, i) in reps" :key="r.name">
              <span class="av sm">{{ r.ini }}</span>
              <span class="rn">{{ r.name }}</span>
              <span class="trk"><i :class="{ hot: counts[i] > 10 }" :style="{ width: (counts[i] / 14) * 100 + '%' }"></i></span>
              <b :key="counts[i]" class="n">{{ counts[i] }}</b>
              <span class="fl" :class="{ show: counts[i] > 10 }">Overloaded</span>
            </li>
          </ul>
          <Transition name="swap">
            <p v-if="rebalanced" class="ok">✓ 3 tasks reassigned from Sanjeewa to Nadeesha</p>
          </Transition>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "FollowUpsSection" });

/* pastel types: call = sky, meeting = lavender, demo = rose, task = mint, follow = butter */
const views = ["Day", "Week", "Month"];
const view = ref("Week");
const viewManual = ref(false);
function setView(v) {
  viewManual.value = true;
  view.value = v;
}

const week = [
  { d: "Mon", n: 2, ev: [{ time: "9:30", t: "ABC Solar", k: "call" }, { time: "2:00", t: "Lanka Power", k: "demo" }] },
  { d: "Tue", n: 3, ev: [{ time: "11:00", t: "Ceylon Motors", k: "follow" }] },
  { d: "Wed", n: 4, ev: [{ time: "10:00", t: "Kandy Textiles", k: "meet" }, { time: "3:00", t: "Send quote", k: "task" }] },
  { d: "Thu", n: 5, ev: [{ time: "9:00", t: "Galle Hardware", k: "demo" }, { time: "4:30", t: "Call Nimal", k: "call" }] },
  { d: "Fri", n: 6, ev: [{ time: "1:30", t: "Negombo Foods", k: "follow" }] },
];
const dayList = [
  { time: "9:00", kind: "Demo", t: "Galle Hardware", k: "demo" },
  { time: "11:00", kind: "Task", t: "Prepare proposal for ABC Solar", k: "task" },
  { time: "1:30", kind: "Meeting", t: "Kandy Textiles contract review", k: "meet" },
  { time: "3:00", kind: "Follow-up", t: "Ceylon Motors pricing", k: "follow" },
  { time: "4:30", kind: "Call", t: "Nimal Perera", k: "call" },
];
const dotKinds = ["call", "meet", "demo", "task", "follow"];
const dots = (n) => ((n * 7) % 4 === 0 ? 0 : ((n * 7) % 4));

const tasks = [
  { title: "Send revised quotation", deal: "ABC Solar", pri: "High", owner: "IS", due: "Today 3:00 PM" },
  { title: "Book site visit", deal: "Lanka Power", pri: "Medium", owner: "CH", due: "Tomorrow" },
  { title: "Chase signed contract", deal: "Kandy Textiles", pri: "High", owner: "SA", due: "Wed 4 Nov" },
  { title: "Share product brochure", deal: "Galle Hardware", pri: "Low", owner: "NA", due: "Fri" },
];

const reps = [
  { name: "Chathura", ini: "CH" },
  { name: "Ishara", ini: "IS" },
  { name: "Sanjeewa", ini: "SA" },
  { name: "Nadeesha", ini: "NA" },
];
const start = [9, 5, 12, 4];
const counts = ref([...start]);
const rebalanced = ref(false);
const overdue = ref(false);
const reminder = ref("hidden");

function snooze() {
  reminder.value = "snoozed";
}

/* demo script, 14 ticks per loop */
let tick = 0;
function step() {
  const p = tick % 14;
  tick += 1;
  if (p === 0) {
    reminder.value = "hidden";
    overdue.value = false;
    rebalanced.value = false;
    counts.value = [...start];
    if (!viewManual.value && tick > 1) view.value = view.value === "Week" ? "Day" : view.value === "Day" ? "Month" : "Week";
  }
  if (p === 2) reminder.value = "shown";
  if (p === 4 && reminder.value === "shown") reminder.value = "snoozed";
  if (p === 6) { reminder.value = "hidden"; overdue.value = true; }
  if (p === 9) { counts.value = [9, 5, 9, 7]; rebalanced.value = true; }
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1300);
}
function halt() {
  live.value = false;
  if (st.timer !== null) {
    window.clearInterval(st.timer);
    st.timer = null;
  }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true;
    overdue.value = true;
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) begin();
      else halt();
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  st.fallback = window.setTimeout(() => {
    if (!seen.value) seen.value = true;
  }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  halt();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.fu {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  /* pastel set (no orange) */
  --sky: #dcecfb; --sky-d: #4a95d6;
  --lav: #e8e3ff; --lav-d: #8a78f0;
  --rose: #fde3ea; --rose-d: #d8567f;
  --mint: #d9f2e5; --mint-d: #35a572;
  --butter: #fff1c9; --butter-d: #b88a00;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.fu *, .fu *::before, .fu *::after { box-sizing: border-box; }
.fu button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

.head { width: min(1180px, calc(100% - 40px)); margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: end; }
.title { margin: 0; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.copy p { margin: 0 0 10px; font-size: 16px; line-height: 1.75; color: var(--muted); }
.copy p:last-child { margin: 0; }
.copy .strong { color: var(--ink); font-size: 20px; font-weight: 500; line-height: 1.5; letter-spacing: -0.01em; }

.grid { width: min(1180px, calc(100% - 40px)); margin: 52px auto 0; display: grid; grid-template-columns: 1.25fr 1fr; gap: 20px; align-items: start; }
.col { display: grid; gap: 20px; }
.card { padding: 24px; border-radius: 28px; background: #f8f7fb; border: 1px solid #efedf6; }
.card header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
.card h3 { margin: 0; font-size: 16px; font-weight: 500; letter-spacing: -0.01em; }
.tasks { background: #f3f9f6; border-color: #e3f1ea; }
.load { background: #f4f8fd; border-color: #e3edf8; }

.seg { display: flex; padding: 3px; border-radius: 10px; background: #fff; border: 1px solid var(--line); }
.seg button { padding: 6px 14px; border: 0; border-radius: 8px; background: none; cursor: pointer; font: 500 12.5px "Poppins", system-ui, sans-serif; color: #8a857f; transition: background 0.25s, color 0.25s; }
.seg button.on { background: var(--ink); color: #fff; }

/* calendar */
.calbody { position: relative; min-height: 300px; }
.week { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.wd { display: grid; gap: 6px; align-content: start; padding: 10px 8px; min-height: 250px; border-radius: 16px; background: #fff; border: 1px solid transparent; }
.wd.today { border-color: var(--lav-d); }
.dn { margin: 0 0 4px; display: flex; align-items: baseline; justify-content: space-between; font-size: 11.5px; color: var(--muted); }
.dn b { font-size: 16px; font-weight: 600; color: var(--ink); }
.today .dn b { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 13px; }
.ev { display: block; padding: 6px 8px; border-radius: 10px; font-size: 11.5px; font-weight: 500; line-height: 1.3; }
.ev small { display: block; font-size: 10px; font-weight: 400; opacity: 0.7; }
.call { background: var(--sky); }
.meet { background: var(--lav); }
.demo { background: var(--rose); }
.task { background: var(--mint); }
.follow { background: var(--butter); }

.day { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.day li { display: flex; align-items: center; gap: 14px; padding: 10px 12px; border-radius: 14px; background: #fff; }
.day li .tm { flex: none; width: 46px; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.day li .ev { flex: 1; padding: 8px 12px; font-size: 13px; }
.day li .ev b { font-weight: 600; margin-right: 4px; }
.day li.call .ev { background: var(--sky); } .day li.meet .ev { background: var(--lav); } .day li.demo .ev { background: var(--rose); } .day li.task .ev { background: var(--mint); } .day li.follow .ev { background: var(--butter); }
.day li.call, .day li.meet, .day li.demo, .day li.task, .day li.follow { background: #fff; }

.month { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.mh { text-align: center; font-size: 11px; font-weight: 600; color: #a39d97; padding-bottom: 2px; }
.mc { display: grid; align-content: space-between; justify-items: start; min-height: 42px; padding: 6px 8px; border-radius: 10px; background: #fff; font-size: 12px; }
.mc.blank { background: none; }
.mc.today { background: var(--ink); color: #fff; }
.ds { display: flex; gap: 3px; }
.ds em { width: 7px; height: 7px; border-radius: 50%; }
.ds em.call { background: var(--sky-d); } .ds em.meet { background: var(--lav-d); } .ds em.demo { background: var(--rose-d); } .ds em.task { background: var(--mint-d); } .ds em.follow { background: var(--butter-d); }

/* reminder toast */
.toast { position: absolute; right: 8px; bottom: 8px; z-index: 2; width: min(300px, calc(100% - 16px)); padding: 14px 16px; border-radius: 18px; background: #fff; border: 1px solid var(--line); box-shadow: 0 18px 40px rgba(20, 18, 15, 0.14); }
.toast.snoozed { background: var(--butter); border-color: transparent; }
.cap { margin: 0 0 8px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.tt { margin: 0; display: flex; align-items: center; gap: 8px; font-size: 13px; line-height: 1.4; }
.tt b { font-weight: 500; }
.bell { font-size: 15px; }
.tb { display: flex; gap: 8px; margin-top: 12px; }
.b { padding: 7px 14px; border: 1px solid var(--line); border-radius: 99px; background: #fff; cursor: pointer; font: 500 12px "Poppins", system-ui, sans-serif; color: var(--ink); }
.b.dark { background: var(--ink); border-color: var(--ink); color: #fff; }
.b:hover { opacity: 0.85; }

.sync { display: flex; align-items: center; gap: 10px; margin: 18px 0 0; padding-top: 16px; border-top: 1px dashed #ddd8ea; font-size: 13px; line-height: 1.5; color: var(--muted); }
.sync i { flex: none; width: 10px; height: 10px; border-radius: 50%; background: var(--mint-d); }

/* tasks */
.tl { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.tl li { display: grid; grid-template-columns: auto 1fr auto auto; grid-template-areas: "cb tt pri av" ". due due due"; align-items: center; gap: 4px 10px; padding: 11px 12px; border-radius: 14px; background: #fff; transition: background 0.4s; }
.tl li.late { background: var(--rose); }
.cb { grid-area: cb; width: 18px; height: 18px; border: 2px solid #cfd8d3; border-radius: 6px; }
.tt2 { grid-area: tt; min-width: 0; }
.tt2 b { display: block; font-size: 13px; font-weight: 500; }
.tt2 small { display: block; font-size: 11.5px; color: var(--muted); }
.pri { grid-area: pri; padding: 2px 10px; border-radius: 99px; font-size: 10.5px; font-weight: 600; }
.pri.High { background: var(--rose); color: var(--rose-d); }
.pri.Medium { background: var(--butter); color: var(--butter-d); }
.pri.Low { background: var(--mint); color: var(--mint-d); }
.late .pri.High { background: #fff; }
.av { grid-area: av; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--lav); font-size: 10px; font-weight: 600; }
.av.sm { grid-area: auto; }
.due { grid-area: due; font-size: 11.5px; color: var(--muted); padding-left: 28px; }
.late .due { color: var(--rose-d); font-weight: 500; }
.esc { display: flex; gap: 10px; align-items: flex-start; margin: 12px 0 0; padding: 12px 14px; border-radius: 14px; background: #fff; font-size: 12.5px; line-height: 1.5; color: var(--muted); }
.esc b { color: var(--ink); font-weight: 500; }
.esc em { display: block; font-style: normal; font-size: 11px; color: #a39d97; }
.warn { flex: none; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: var(--rose-d); color: #fff; font-size: 12px; font-weight: 700; }

/* workload */
.ld { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.ld li { display: grid; grid-template-columns: auto 80px 1fr 24px 84px; align-items: center; gap: 10px; font-size: 12.5px; }
.rn { color: var(--ink); }
.trk { height: 10px; border-radius: 99px; background: #fff; overflow: hidden; }
.trk i { display: block; height: 100%; border-radius: 99px; background: var(--sky-d); transition: width 0.8s cubic-bezier(0.3, 0.7, 0.2, 1), background 0.4s; }
.trk i.hot { background: var(--rose-d); }
.n { font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }
.fl { padding: 2px 8px; border-radius: 99px; background: var(--rose); color: var(--rose-d); font-size: 10.5px; font-weight: 600; text-align: center; opacity: 0; transition: opacity 0.3s; }
.fl.show { opacity: 1; }
.ok { margin: 12px 0 0; padding: 10px 14px; border-radius: 12px; background: var(--mint); font-size: 12.5px; }

/* transitions */
.view-enter-active, .view-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.view-enter-from { opacity: 0; transform: translateY(8px); }
.view-leave-to { opacity: 0; transform: translateY(-8px); }
.pop-enter-active { transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.3, 1.4, 0.5, 1); }
.pop-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(10px) scale(0.96); }
.swap-enter-active, .swap-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(6px); }
.n { animation: bump 0.5s ease; }

/* entrance (runs once) */
.fu:not(.in) .head, .fu:not(.in) .grid { opacity: 0; }
.fu.in .head { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.fu.in .grid { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bump { from { transform: translateY(-3px); } to { transform: none; } }

@media (max-width: 1000px) {
  .head { grid-template-columns: 1fr; gap: 20px; }
  .grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .fu { padding: 72px 0; }
  .card { padding: 18px; border-radius: 22px; }
  .week { grid-template-columns: repeat(5, minmax(96px, 1fr)); overflow-x: auto; }
  .ld li { grid-template-columns: auto 70px 1fr 22px; }
  .fl { display: none; }
  .toast { position: static; margin-top: 12px; width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .fu *, .fu *::before, .fu *::after { animation: none !important; transition: none !important; }
  .fu:not(.in) .head, .fu:not(.in) .grid { opacity: 1; }
}
</style>
