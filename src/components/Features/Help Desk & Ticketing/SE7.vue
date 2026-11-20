<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "TicketFlowSection" });

const root = ref(null);
const shown = ref(false);
const prog = ref(0);
const manual = ref(-1);
let raf = 0;
const ok = ref([true, true]);
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const custPhoto = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";
const agentPhoto = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";

const steps = [
  "The customer emails, calls, messages on WhatsApp or uses the portal",
  "Saptivo creates a ticket, sets priority and starts the SLA timer",
  "The ticket is assigned to the right agent or team automatically",
  "The agent replies from the ticket, using canned responses where helpful",
  "The customer receives updates at every step and rates the service when it's resolved",
];
const channels = ["Email", "Phone", "WhatsApp", "Portal"];
const teams = ["Appliance support", "Installations", "Billing"];
const updates = ["Ticket received", "Assigned to Nimali", "Reply sent", "Resolved"];

const scaled = computed(() => prog.value * 5);
const step = computed(() => {
  if (reduce || manual.value >= 0) return manual.value >= 0 ? manual.value : 1;
  return Math.min(4, Math.floor(scaled.value));
});
const sub = computed(() => {
  if (reduce || manual.value >= 0) return 3;
  return Math.min(3, Math.floor((scaled.value - step.value) * 4));
});

function measure() {
  raf = 0;
  const el = root.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const total = r.height - window.innerHeight;
  if (total <= 0) return;
  prog.value = Math.max(0, Math.min(0.9999, -r.top / total));
}
function onScroll() {
  if (manual.value >= 0) manual.value = -1;
  if (!raf) raf = requestAnimationFrame(measure);
}
function pick(i) {
  if (reduce) {
    manual.value = i;
    return;
  }
  const el = root.value;
  const total = el.offsetHeight - window.innerHeight;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + total * ((i + 0.15) / 5), behavior: "smooth" });
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) shown.value = true;
    },
    { threshold: 0.05 }
  );
  io.observe(root.value);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  measure();
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  if (raf) cancelAnimationFrame(raf);
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="tf" :class="{ in: shown }">
    <div class="pin"><div class="wrap">
      <header class="head">
        <h2><span class="l1">How a ticket flows</span> <span class="l2">through Saptivo</span></h2>
      </header>

      <div class="rail">
        <div class="trk"><i :style="{ width: (step / 4) * 100 + '%' }"></i></div>
        <button
          v-for="(s, i) in steps"
          :key="i"
          type="button"
          class="st"
          :class="{ on: i === step, done: i < step }"
          @click="pick(i)"
        >
          <span class="no">{{ i + 1 }}</span>
          <span class="tx">{{ s }}</span>
        </button>
      </div>

      <div class="stage">
        <Transition name="sw" mode="out-in">
          <!-- 1 channels -->
          <div v-if="step === 0" key="s0" class="pane lav">
            <div class="chs">
              <span v-for="(c, i) in channels" :key="c" class="ch" :class="{ on: sub === i }">{{ c }}</span>
            </div>
            <div class="msgrow">
              <span class="av"><img v-if="ok[0]" :src="custPhoto" alt="" @error="ok[0] = false" /><b v-else>D</b></span>
              <div class="bub">
                <small>Dilani Perera · via {{ channels[sub] }}</small>
                My air conditioner is not cooling since yesterday.
              </div>
            </div>
          </div>

          <!-- 2 ticket -->
          <div v-else-if="step === 1" key="s1" class="pane sky">
            <div class="tkt">
              <div class="th"><strong>Ticket #4821</strong><span class="pri">High priority</span></div>
              <p>Air conditioner not cooling</p>
              <div class="sla">
                <div class="sl"><span>SLA timer started</span><b>3h 59m left</b></div>
                <div class="bar"><i></i></div>
              </div>
              <div class="meta"><span>Customer: Dilani Perera</span><span>Asset: Split AC · ACX-5521</span></div>
            </div>
          </div>

          <!-- 3 assign -->
          <div v-else-if="step === 2" key="s2" class="pane mint">
            <div class="asg">
              <div class="lanes">
                <span v-for="(t, i) in teams" :key="t" class="ln" :class="{ on: i === 0 && sub >= 1 }">{{ t }}</span>
              </div>
              <div class="tkm" :class="{ moved: sub >= 1 }">Ticket #4821</div>
              <div class="ag" :class="{ on: sub >= 2 }">
                <span class="av"><img v-if="ok[1]" :src="agentPhoto" alt="" @error="ok[1] = false" /><b v-else>N</b></span>
                <div><strong>Nimali</strong><small>Assigned automatically</small></div>
              </div>
            </div>
          </div>

          <!-- 4 reply -->
          <div v-else-if="step === 3" key="s3" class="pane butter">
            <div class="rp">
              <div class="rb">
                <p>Hi Dilani, to reset the filter indicator, hold the Reset button for 5 seconds until the light blinks.</p>
                <span class="cn">Canned response: Filter indicator reset</span>
              </div>
              <div class="rf"><span>Replying from ticket #4821</span><span class="btn">Send reply</span></div>
            </div>
          </div>

          <!-- 5 updates -->
          <div v-else key="s4" class="pane rose">
            <div class="upd">
              <ul>
                <li v-for="(u, i) in updates" :key="u" :class="{ on: sub >= i }"><i></i>{{ u }}</li>
              </ul>
              <div class="rate" :class="{ on: sub >= 3 }">
                <small>How was our service?</small>
                <div class="stars">
                  <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" :class="{ f: sub >= 3 }">
                    <path d="M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div></div>
  </section>
</template>

<style scoped>
.tf {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  height: 480vh;
}
.pin { position: sticky; top: 0; min-height: 100vh; display: flex; align-items: center; padding: 72px 16px 32px; box-sizing: border-box; }
.wrap { width: 100%; max-width: 1160px; margin: 0 auto; }
.head { text-align: center; max-width: 820px; margin: 0 auto 32px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.tf h2 .l1 { color: #111111 !important; opacity: 1; }
.tf h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.head, .rail, .stage { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .rail, .in .stage { opacity: 1; transform: none; }
.in .rail { transition-delay: .06s; }
.in .stage { transition-delay: .12s; }

/* rail */
.rail { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 28px; }
.trk { position: absolute; left: 16px; right: 16px; top: 15px; height: 1.5px; background: var(--line); }
.trk i { display: block; height: 100%; background: var(--ink); transition: width .6s ease; }
.st { all: unset; cursor: pointer; position: relative; display: flex; flex-direction: column; gap: 14px; }
.st:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; border-radius: 8px; }
.no { width: 32px; height: 32px; border-radius: 50%; background: #fff; border: 1.5px solid #d3d6db; display: grid; place-items: center; font-size: 13px; font-weight: 600; color: var(--muted); transition: all .3s; }
.st.done .no { border-color: var(--ink); color: var(--ink); }
.st.on .no { background: var(--ink); border-color: var(--ink); color: #fff; }
.tx { font-size: 13.5px; line-height: 1.55; color: var(--muted); transition: color .3s; padding-right: 6px; }
.st.on .tx { color: var(--ink); }

/* stage */
.stage { min-height: 300px; display: grid; }
.pane { border-radius: 24px; padding: 32px; display: flex; align-items: center; justify-content: center; min-height: 300px; }
.pane.lav { background: var(--lav); }
.pane.sky { background: var(--sky); }
.pane.mint { background: var(--mint); }
.pane.butter { background: var(--butter); }
.pane.rose { background: var(--rose); }
.sw-enter-active, .sw-leave-active { transition: opacity .3s ease, transform .3s ease; }
.sw-enter-from { opacity: 0; transform: translateY(10px); }
.sw-leave-to { opacity: 0; transform: translateY(-6px); }

.av { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: #fff; color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 13px; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }

/* 1 */
.chs { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 22px; }
.pane.lav { flex-direction: column; }
.ch { font-size: 13px; font-weight: 500; padding: 8px 18px; border-radius: 99px; background: rgba(255, 255, 255, .6); color: var(--muted); transition: all .3s; }
.ch.on { background: var(--ink); color: #fff; }
.msgrow { display: flex; gap: 12px; align-items: flex-start; max-width: 460px; }
.bub { background: #fff; border-radius: 6px 18px 18px 18px; padding: 12px 16px; font-size: 14px; line-height: 1.6; }
.bub small { display: block; font-size: 11.5px; color: var(--muted); margin-bottom: 2px; }

/* 2 */
.tkt { background: #fff; border-radius: 20px; padding: 22px; width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 14px; }
.th { display: flex; justify-content: space-between; align-items: center; }
.th strong { font-size: 15px; }
.pri { font-size: 11.5px; font-weight: 600; color: var(--rose-i); background: var(--rose); padding: 3px 10px; border-radius: 6px; }
.tkt p { margin: 0; font-size: 14px; color: #3a3f47; }
.sl { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--muted); margin-bottom: 8px; }
.sl b { color: var(--ink); font-weight: 600; }
.bar { height: 6px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.bar i { display: block; height: 100%; width: 18%; background: var(--sky-i); border-radius: 4px; animation: grow 1.4s ease-out forwards; }
@keyframes grow { from { width: 0; } to { width: 18%; } }
.meta { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 12px; color: var(--muted); }

/* 3 */
.asg { width: 100%; max-width: 520px; display: flex; flex-direction: column; gap: 16px; align-items: center; }
.lanes { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.ln { font-size: 13px; font-weight: 500; padding: 10px 18px; border-radius: 12px; background: rgba(255, 255, 255, .55); color: var(--muted); transition: all .35s; }
.ln.on { background: #fff; color: var(--ink); box-shadow: inset 0 0 0 1.5px var(--mint-i); }
.tkm { font-size: 13px; font-weight: 600; background: var(--ink); color: #fff; padding: 8px 16px; border-radius: 10px; transform: translateY(0); transition: transform .5s ease; }
.tkm.moved { transform: translateY(-48px); }
.ag { display: flex; gap: 12px; align-items: center; background: #fff; border-radius: 16px; padding: 10px 18px 10px 10px; opacity: 0; transform: translateY(8px); transition: all .4s; margin-top: -30px; }
.ag.on { opacity: 1; transform: none; }
.ag strong { display: block; font-size: 14px; }
.ag small { font-size: 12px; color: var(--mint-i); }

/* 4 */
.rp { background: #fff; border-radius: 20px; padding: 20px; width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 14px; }
.rb { display: flex; flex-direction: column; gap: 10px; }
.rb p { margin: 0; font-size: 14px; line-height: 1.65; }
.cn { align-self: flex-start; font-size: 11.5px; font-weight: 600; color: var(--butter-i); background: var(--butter); padding: 4px 10px; border-radius: 6px; }
.rf { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }
.btn { font-size: 12.5px; font-weight: 600; background: var(--ink); color: #fff; padding: 8px 18px; border-radius: 99px; }

/* 5 */
.upd { display: flex; gap: 40px; align-items: center; flex-wrap: wrap; justify-content: center; }
.upd ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.upd li { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #a99aa1; transition: color .3s; }
.upd li i { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid #d9bcc6; transition: all .3s; }
.upd li.on { color: var(--ink); }
.upd li.on i { background: var(--rose-i); border-color: var(--rose-i); }
.rate { background: #fff; border-radius: 18px; padding: 18px 22px; display: flex; flex-direction: column; gap: 10px; opacity: .5; transition: opacity .4s; }
.rate.on { opacity: 1; }
.rate small { font-size: 12.5px; color: var(--muted); }
.stars { display: flex; gap: 6px; }
.stars svg { width: 26px; height: 26px; fill: #fff; stroke: #e0c7cf; stroke-width: 1.5; stroke-linejoin: round; transition: fill .3s, stroke .3s; }
.stars svg.f { fill: #f2c94c; stroke: #d5a92a; }

@media (max-width: 900px) {
  .rail { grid-template-columns: 1fr; gap: 6px; }
  .trk { display: none; }
  .st { flex-direction: row; align-items: flex-start; gap: 14px; padding: 8px 0; }
  .no { flex: none; }
  .tx { padding-top: 5px; }
}
@media (max-width: 640px) {
  .pin { padding: 56px 16px 20px; }
  .pane { padding: 22px 16px; border-radius: 22px; min-height: 240px; }
  .stage { min-height: 240px; }
  .head { margin-bottom: 18px; }
  .tx { font-size: 12.5px; }
}
@media (prefers-reduced-motion: reduce) {
  .tf { height: auto; }
  .pin { position: static; padding: 96px 16px; }
  .head, .rail, .stage { opacity: 1; transform: none; transition: none; }
  .bar i { animation: none; width: 18%; }
  * { transition-duration: 0s !important; }
}
</style>
