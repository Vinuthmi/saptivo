<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhoUsesCrmSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
const manual = ref(false);
let timer = null;
let io = null;

const roles = [
  {
    t: "Sales teams",
    c: "lav",
    tools: ["Pipeline", "Quotations", "WhatsApp inbox"],
    rec: { h: "Deal won", s: "Quotation accepted by Acme Traders", tag: "LKR 1.2M" },
    from: "",
  },
  {
    t: "Support teams",
    c: "sky",
    tools: ["Help desk", "Customer portal"],
    rec: { h: "Ticket opened", s: "Acme Traders raised a request in the portal", tag: "High" },
    from: "from Sales",
  },
  {
    t: "Service managers",
    c: "mint",
    tools: ["Technicians", "Contracts"],
    rec: { h: "Visit scheduled", s: "Technician assigned, contract linked", tag: "Tue 10:00" },
    from: "from Support",
  },
  {
    t: "Owners and directors",
    c: "butter",
    tools: ["Reports", "HQ dashboard"],
    rec: { h: "Revenue updated", s: "The closed deal is already on the dashboard", tag: "Live" },
    from: "from Service",
  },
];

const cur = computed(() => (still.value && !manual.value ? -1 : n.value % roles.length));
const seen = computed(() => (still.value && !manual.value ? roles.length : cur.value + 1));

function start() {
  if (timer || still.value || manual.value) return;
  timer = setInterval(() => (n.value += 1), 2600);
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function pick(i) {
  manual.value = true;
  stop();
  n.value = i;
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    still.value = true;
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
  <section ref="root" class="wu" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Who uses</span> <span class="l2">Saptivo's CRM features</span></h2>
        <p>
          Sales teams use the pipeline, quotations and WhatsApp inbox every day. Support teams live in the help desk and
          customer portal. Service managers plan technicians and contracts. Owners and directors watch reports and the HQ
          dashboard. Because everyone works from the same system, handovers between teams happen in one click rather than
          one email at a time.
        </p>
      </header>

      <div class="board">
        <div class="lanes">
          <button
            v-for="(r, i) in roles"
            :key="r.t"
            type="button"
            class="lane"
            :class="[r.c, { on: i === cur, past: i < cur || cur === -1 }]"
            :aria-pressed="i === cur"
            @click="pick(i)"
          >
            <span class="top">
              <span class="num">{{ i + 1 }}</span>
              <b>{{ r.t }}</b>
            </span>
            <span class="tools">
              <em v-for="t in r.tools" :key="t">{{ t }}</em>
            </span>

            <span class="rec" :class="{ live: i === cur || cur === -1 }">
              <Transition name="pop" mode="out-in">
                <span v-if="i === cur || cur === -1" :key="'on' + n" class="in-rec">
                  <span class="hand" v-if="r.from">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    Handed over {{ r.from }}
                  </span>
                  <span class="hand start" v-else>New customer</span>
                  <strong>{{ r.rec.h }}</strong>
                  <span class="sub">{{ r.rec.s }}</span>
                  <i class="tag">{{ r.rec.tag }}</i>
                </span>
                <span v-else class="idle">Waiting for handover</span>
              </Transition>
            </span>
          </button>
        </div>

        <div class="rail" aria-hidden="true">
          <i class="line"><u :style="{ width: (Math.max(seen - 1, 0) / (roles.length - 1)) * 100 + '%' }"></u></i>
          <span class="cap"><b>1 click</b> per handover, no email in between</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wu {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wu *, .wu *::before, .wu *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 52px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.wu h2 .l1 { color: #111111 !important; opacity: 1; }
.wu h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.8; color: var(--muted); }
.head, .board { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .1s; }

.lanes { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.lane { all: unset; box-sizing: border-box; cursor: pointer; display: flex; flex-direction: column; gap: 14px; padding: 22px 20px 20px; border-radius: 26px; border: 1.5px solid transparent; min-height: 330px; position: relative; transition: border-color .35s, transform .35s, opacity .35s; opacity: .62; }
.lane.past, .lane.on { opacity: 1; }
.lane:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.lane.lav { background: var(--lav); } .lane.sky { background: var(--sky); } .lane.mint { background: var(--mint); } .lane.butter { background: var(--butter); }
.lane.on { border-color: var(--ink); transform: translateY(-6px); }
/* arrow between lanes */
.lane + .lane::before { content: ""; position: absolute; left: -11px; top: 38px; width: 8px; height: 8px; border-top: 2px solid rgba(20, 18, 15, .35); border-right: 2px solid rgba(20, 18, 15, .35); transform: rotate(45deg); }

.top { display: flex; align-items: center; gap: 10px; }
.num { width: 26px; height: 26px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 12px; font-weight: 600; display: grid; place-items: center; flex: none; }
.top b { font-size: 17px; font-weight: 600; letter-spacing: -.01em; line-height: 1.25; }
.tools { display: flex; flex-wrap: wrap; gap: 6px; }
.tools em { font-style: normal; font-size: 12px; font-weight: 500; padding: 5px 11px; border-radius: 99px; background: rgba(255, 255, 255, .78); color: var(--ink); }

.rec { margin-top: auto; background: #fff; border-radius: 18px; padding: 14px 15px; min-height: 134px; display: flex; border: 1px dashed rgba(20, 18, 15, .18); transition: border-color .3s; }
.rec.live { border: 1px solid var(--line); box-shadow: 0 14px 28px -18px rgba(20, 18, 15, .4); }
.in-rec { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; width: 100%; }
.hand { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 99px; background: var(--ink); color: #fff; }
.hand.start { background: #f0f1f3; color: var(--muted); }
.in-rec strong { font-size: 14.5px; font-weight: 600; letter-spacing: -.01em; }
.sub { font-size: 12.5px; line-height: 1.5; color: var(--muted); }
.tag { font-style: normal; margin-top: 2px; font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 6px; }
.lav .tag { background: var(--lav); color: var(--lav-i); } .sky .tag { background: var(--sky); color: var(--sky-i); } .mint .tag { background: var(--mint); color: var(--mint-i); } .butter .tag { background: var(--butter); color: var(--butter-i); }
.idle { margin: auto; font-size: 12.5px; color: #9a9fa6; }
.pop-enter-active { transition: opacity .4s ease, transform .4s ease; }
.pop-leave-active { transition: opacity .15s ease; }
.pop-enter-from { opacity: 0; transform: translateY(8px); }
.pop-leave-to { opacity: 0; }

.rail { margin-top: 26px; display: flex; align-items: center; gap: 18px; }
.line { flex: 1; height: 2px; border-radius: 2px; background: var(--line); overflow: hidden; }
.line u { display: block; height: 100%; background: var(--ink); transition: width .7s cubic-bezier(.3, .8, .3, 1); }
.cap { font-size: 13px; color: var(--muted); white-space: nowrap; }
.cap b { color: var(--ink); font-weight: 600; }

@media (max-width: 1000px) {
  .lanes { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .lane + .lane::before { display: none; }
  .lane { min-height: 300px; }
}
@media (max-width: 600px) {
  .wu { padding: 64px 16px; }
  .lanes { grid-template-columns: 1fr; gap: 12px; }
  .lane { min-height: 0; border-radius: 22px; padding: 18px 16px; }
  .lane.on { transform: none; }
  .rec { min-height: 120px; }
  .rail { flex-direction: column; align-items: stretch; gap: 10px; }
  .cap { white-space: normal; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .lane { opacity: 1; }
  * { transition-duration: 0s !important; }
  .pop-enter-active, .pop-leave-active { transition: none; }
}
</style>
