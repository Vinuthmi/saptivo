<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "RunHistorySection" });

const root = ref(null);
const shown = ref(false);
const manual = ref(false);
const filter = ref("all");
const selId = ref(null);
let timer = null;
let io = null;
let reduce = false;
let counter = 4820;
let cursor = 0;

const base = "/saptivo/images/features/";
const photo = base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg";
const photoOk = ref(true);
const banner = base + "smiling-man-with-headset-working-on-computer-2026-09-23-21-05-06-utc.JPG";
const bannerOk = ref(true);
const total = ref(124);
const failedToday = ref(2);

const pool = [
  {
    wf: "Invoice reminder",
    trig: "Invoice 3 days overdue",
    dur: "1.8 s",
    steps: [
      { t: "Condition: amount above LKR 50,000", ok: true },
      { t: "Send WhatsApp template", ok: true },
      { t: "Create follow-up task for Kasun", ok: true },
    ],
  },
  {
    wf: "Visit reminder call",
    trig: "Service visit due in 2 days",
    dur: "42 s",
    steps: [
      { t: "Check the customer's phone number", ok: true },
      { t: "Start AI voice call through Vodia", ok: true },
    ],
  },
  {
    wf: "Won deal sync",
    trig: "Deal stage set to Won",
    dur: "3.1 s",
    steps: [
      { t: "Update field: Order status", ok: true },
      { t: "Call webhook: erp.example.com/orders", ok: false },
    ],
    err: { code: "HTTP 500", msg: "The other system returned an error after 3 attempts.", fix: "Check the endpoint, then retry the run." },
  },
  {
    wf: "AMC renewal",
    trig: "AMC expiring in 30 days",
    dur: "1.1 s",
    steps: [
      { t: "Notify the manager", ok: true },
      { t: "Send renewal email", ok: true },
    ],
  },
  {
    wf: "Ticket survey",
    trig: "Ticket closed by a user",
    dur: "0.9 s",
    steps: [
      { t: "Wait 1 hour", ok: true },
      { t: "Send SMS survey", ok: false },
    ],
    err: { code: "Invalid number", msg: "The mobile number +94 77 12 is incomplete.", fix: "Update the contact's number, then retry." },
  },
  {
    wf: "New lead routing",
    trig: "A record is created",
    dur: "0.6 s",
    steps: [
      { t: "Apply routing rules", ok: true },
      { t: "Assign owner and notify them", ok: true },
    ],
  },
];

const runs = ref([]);
const times = ["Just now", "2 min ago", "5 min ago", "9 min ago", "14 min ago"];

function make() {
  const p = pool[cursor % pool.length];
  cursor++;
  counter++;
  return { uid: counter, ...p, failed: p.steps.some((s) => !s.ok), fixed: false };
}

const list = computed(() => (filter.value === "failed" ? runs.value.filter((r) => r.failed && !r.fixed) : runs.value));
const sel = computed(() => runs.value.find((r) => r.uid === selId.value) || runs.value[0] || null);
const failedCount = computed(() => runs.value.filter((r) => r.failed && !r.fixed).length);
const status = (r) => (r.failed && !r.fixed ? "failed" : "success");

function addRun() {
  const r = make();
  runs.value = [r, ...runs.value].slice(0, 5);
  selId.value = r.uid;
  total.value++;
  if (r.failed) failedToday.value++;
}
function select(r) {
  manual.value = true;
  stop();
  selId.value = r.uid;
}
function setFilter(k) {
  manual.value = true;
  stop();
  filter.value = k;
  const first = list.value[0];
  if (first) selId.value = first.uid;
}
function retry(r) {
  r.fixed = true;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(addRun, 2600);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  for (let i = 0; i < 4; i++) {
    const r = make();
    runs.value = [r, ...runs.value];
  }
  selId.value = runs.value.find((r) => r.failed)?.uid ?? runs.value[0].uid;
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
  <section ref="root" class="rh" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <span class="eyebrow">Transparency</span>
        <h2><span class="l1">Full run history</span> <span class="l2">and error log</span></h2>
        <p>
          Every workflow run is logged with what triggered it and what it did. If an action fails, the error log
          shows why, so you can fix it quickly. As sales automation software, Saptivo keeps automation transparent
          rather than a black box.
        </p>
      </header>

      <div class="banner">
        <img v-if="bannerOk" :src="banner" alt="" @error="bannerOk = false" />
        <div class="shade"></div>
        <div class="stats">
          <span class="stat"><b>{{ total }}</b>runs today</span>
          <span class="stat bad"><b>{{ failedToday }}</b>failed, with the reason logged</span>
          <span class="stat"><b>1.4 s</b>average run</span>
        </div>
      </div>

      <div class="board">
        <!-- history -->
        <div class="hist">
          <div class="ht">
            <strong>Run history</strong>
            <span class="live" :class="{ off: manual }"><i></i>{{ manual ? "Paused" : "Live" }}</span>
            <div class="seg">
              <button type="button" :class="{ a: filter === 'all' }" @click="setFilter('all')">All</button>
              <button type="button" :class="{ a: filter === 'failed' }" @click="setFilter('failed')">Failed <em v-if="failedCount">{{ failedCount }}</em></button>
            </div>
          </div>

          <TransitionGroup name="row" tag="ul" class="rows">
            <li v-for="(r, i) in list" :key="r.uid">
              <button type="button" class="run" :class="[status(r), { sel: sel && sel.uid === r.uid }]" @click="select(r)">
                <span class="dot"></span>
                <span class="meta">
                  <strong>{{ r.wf }}</strong>
                  <small>{{ r.trig }}</small>
                </span>
                <span class="num">#{{ r.uid }}</span>
                <span class="tm">{{ times[i] || "Earlier" }} · {{ r.dur }}</span>
                <span class="chip">{{ status(r) === "failed" ? "Failed" : "Success" }}</span>
              </button>
            </li>
          </TransitionGroup>
          <p v-if="!list.length" class="none">No failed runs.</p>
        </div>

        <!-- detail -->
        <aside class="det" role="img" aria-label="Details of the selected workflow run, including the error log">
          <Transition name="swap" mode="out-in">
            <div v-if="sel" :key="sel.uid + (sel.fixed ? 'f' : '')" class="card">
              <div class="dh">
                <div>
                  <strong>{{ sel.wf }}</strong>
                  <span>Run #{{ sel.uid }} · {{ sel.dur }}</span>
                </div>
                <span class="chip" :class="status(sel)">{{ status(sel) === "failed" ? "Failed" : sel.fixed ? "Fixed" : "Success" }}</span>
              </div>

              <div class="trg">
                <span>Triggered by</span>
                <b>{{ sel.trig }}</b>
              </div>

              <ol class="steps">
                <li v-for="(s, i) in sel.steps" :key="s.t" :class="[s.ok || sel.fixed ? 'ok' : 'bad']" :style="{ '--i': i }">
                  <span class="mk">
                    <svg v-if="s.ok || sel.fixed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </span>
                  {{ s.t }}
                </li>
              </ol>

              <div v-if="sel.failed && !sel.fixed" class="err" :style="{ '--i': sel.steps.length }">
                <div class="eh"><b>{{ sel.err.code }}</b><span>Error log</span></div>
                <p>{{ sel.err.msg }}</p>
                <p class="fix"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>{{ sel.err.fix }}</p>
                <div class="act">
                  <span class="who">
                    <span class="av">
                      <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
                      <b v-else>N</b>
                    </span>
                    Assigned to Nimali
                  </span>
                  <button type="button" class="retry" @click="retry(sel)">Retry run</button>
                </div>
              </div>
              <div v-else-if="sel.fixed" class="good">Re-run succeeded. Everything is logged on the record.</div>
            </div>
          </Transition>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rh {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #f8f6ff 0%, #fff 100%);
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--sky); color: var(--sky-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.rh h2 .l1 { color: #111111 !important; opacity: 1; }
.rh h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .banner, .board { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .banner, .in .board { opacity: 1; transform: none; }
.in .banner { transition-delay: .06s; }
.in .board { transition-delay: .12s; }

.banner { position: relative; height: 240px; border-radius: 28px; overflow: hidden; margin-bottom: 18px; background: linear-gradient(135deg, #e8e3ff, #dcecfb 55%, #d3f0e1); }
.banner img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 28%; }
.banner .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20, 18, 15, 0) 40%, rgba(20, 18, 15, .6) 100%); }
.stats { position: absolute; left: 18px; right: 18px; bottom: 18px; display: flex; flex-wrap: wrap; gap: 8px; }
.stat { display: inline-flex; align-items: baseline; gap: 8px; font-size: 12px; font-weight: 500; color: var(--muted); padding: 9px 16px; border-radius: 99px; background: rgba(255, 255, 255, .85); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
.stat b { font-size: 18px; font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }
.stat.bad b { color: var(--rose-i); }

.board { display: grid; grid-template-columns: 1.25fr 1fr; gap: 18px; align-items: start; }
.hist, .det { background: #fff; border: 1px solid var(--line); border-radius: 26px; box-shadow: 0 24px 60px rgba(60, 50, 120, .1); }
.hist { padding: 18px; }
.ht { display: flex; align-items: center; gap: 12px; padding: 2px 4px 14px; }
.ht strong { font-size: 15px; }
.live { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: var(--mint-i); background: var(--mint); padding: 4px 10px; border-radius: 99px; }
.live i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: blink 1.2s infinite; }
.live.off { color: var(--muted); background: #f1f0f6; }
.live.off i { animation: none; }
@keyframes blink { 50% { opacity: .3; } }
.seg { margin-left: auto; display: flex; background: #f3f1fa; border-radius: 99px; padding: 3px; }
.seg button { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 99px; color: var(--muted); transition: all .3s; }
.seg button.a { background: var(--ink); color: #fff; }
.seg button:focus-visible { outline: 2px solid var(--ink); }
.seg em { font-style: normal; font-size: 10px; background: var(--rose); color: var(--rose-i); padding: 1px 7px; border-radius: 99px; }

.rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; position: relative; min-height: 340px; }
.run { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; display: grid; grid-template-columns: 12px minmax(0, 1fr) auto auto auto; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 16px; border: 1px solid var(--line); background: #fff; transition: all .3s; }
.run:hover { background: #fbfaff; }
.run:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.run.sel { background: #f6f4ff; border-color: var(--lav-i); }
.run.failed.sel { background: #fff5f8; border-color: var(--rose-i); }
.dot { width: 10px; height: 10px; border-radius: 50%; background: var(--mint-i); }
.failed .dot { background: var(--rose-i); }
.meta { min-width: 0; display: flex; flex-direction: column; }
.meta strong { font-size: 13px; }
.meta small { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.num { font-size: 11px; font-weight: 600; color: var(--muted); font-variant-numeric: tabular-nums; }
.tm { font-size: 11px; color: #9a9fa8; white-space: nowrap; }
.chip { font-size: 11px; font-weight: 700; padding: 4px 11px; border-radius: 99px; background: var(--mint); color: var(--mint-i); white-space: nowrap; }
.failed .chip, .chip.failed { background: var(--rose); color: var(--rose-i); }
.none { text-align: center; font-size: 13px; color: var(--muted); padding: 40px 0; margin: 0; }

/* detail */
.det { padding: 18px; min-height: 420px; position: sticky; top: 20px; }
.card { display: flex; flex-direction: column; gap: 14px; }
.dh { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.dh strong { display: block; font-size: 16px; }
.dh span:not(.chip) { font-size: 12px; color: var(--muted); }
.trg { display: flex; flex-direction: column; gap: 2px; background: #f8f7fc; border-radius: 14px; padding: 10px 14px; }
.trg span { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.trg b { font-size: 13px; }
.steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.steps li { display: flex; align-items: center; gap: 12px; font-size: 13px; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--line); animation: rise .45s ease both; animation-delay: calc(var(--i) * .25s); }
.steps li.bad { border-color: var(--rose-i); background: #fff5f8; }
.mk { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; flex: none; }
.ok .mk { background: var(--mint-i); color: #fff; }
.bad .mk { background: var(--rose-i); color: #fff; }
.mk svg { width: 12px; height: 12px; }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.err { background: #1d1a24; color: #f4eef7; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; animation: rise .45s ease both; animation-delay: calc(var(--i) * .25s); }
.eh { display: flex; align-items: center; justify-content: space-between; }
.eh b { font-family: ui-monospace, "SF Mono", monospace; font-size: 12px; color: #ff9db8; }
.eh span { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #a79fb4; }
.err p { margin: 0; font-size: 12.5px; line-height: 1.55; }
.err .fix { display: flex; gap: 8px; color: #ffe08a; }
.err .fix svg { width: 16px; height: 16px; flex: none; margin-top: 2px; }
.act { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 4px; }
.who { display: inline-flex; align-items: center; gap: 8px; font-size: 11.5px; color: #cfc7da; }
.av { width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background: var(--rose); color: var(--rose-i); display: grid; place-items: center; font-size: 10px; font-weight: 700; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.retry { all: unset; cursor: pointer; font-size: 12px; font-weight: 700; background: #fff; color: var(--ink); padding: 8px 16px; border-radius: 99px; transition: transform .2s; }
.retry:hover { transform: translateY(-1px); }
.retry:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.good { background: var(--mint); color: var(--mint-i); font-size: 13px; font-weight: 600; padding: 12px 14px; border-radius: 14px; animation: rise .45s ease both; }

.row-enter-active, .row-leave-active { transition: all .4s ease; }
.row-enter-from { opacity: 0; transform: translateY(-14px); }
.row-leave-to { opacity: 0; transform: translateY(14px); }
.row-leave-active { position: absolute; left: 0; right: 0; }
.row-move { transition: transform .4s ease; }
.swap-enter-active, .swap-leave-active { transition: all .2s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; transform: translateY(6px); }

@media (max-width: 960px) {
  .board { grid-template-columns: 1fr; }
  .det { position: static; min-height: 0; }
}
@media (max-width: 600px) {
  .rh { padding: 64px 16px; }
  .banner { height: 200px; }
  .stat { padding: 7px 12px; font-size: 11px; }
  .stat b { font-size: 15px; }
  .run { grid-template-columns: 12px minmax(0, 1fr) auto; }
  .num, .tm { display: none; }
  .ht { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .banner, .board { opacity: 1; transform: none; transition: none; }
  .live i { animation: none; }
  .steps li, .err, .good { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
