<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "PushNotificationsSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const ok = ref(true);
const n = ref(0);
let timer = null;
let io = null;

const base = "/saptivo/images/features/";
const photo = base + "smiling-woman-working-at-computer-in-office-2026-09-21-22-49-47-utc.webp";

// chronological order, newest ends up on top of the lock screen
const alerts = [
  { id: "ticket", app: "Tickets", t: "Ticket assigned to you", b: "#2041 AC unit not cooling, Galle branch", c: "rose" },
  { id: "deal", app: "Deals", t: "Deal moved to Negotiation", b: "Colombo Hotels · LKR 150,000", c: "sky" },
  { id: "task", app: "Tasks", t: "Task due in 30 minutes", b: "Call Dilani Perera about the AMC renewal", c: "butter" },
  { id: "lead", app: "Leads", t: "New lead", b: "Kasun Fernando at Lanka Textiles asked for a demo", c: "mint" },
];

// 7-step loop: 0 empty, 1-4 alerts arrive one by one, 5-6 hold
const count = computed(() => (still.value ? 4 : Math.min(n.value % 7, 4)));
const visible = computed(() => alerts.slice(0, count.value).reverse());

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 1100);
}
function stop() {
  clearInterval(timer);
  timer = null;
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
  <section ref="root" class="pn" :class="{ in: shown }">
    <div class="stage">
      <img v-if="ok" class="bg" :src="photo" alt="" @error="ok = false" />
      <div class="shade"></div>

      <div class="wrap">
        <div class="copy">
          <h2>Push notifications</h2>
          <p>Get alerted to new leads, task reminders, deal updates and assigned tickets, so nothing waits until you're back at the office.</p>
        </div>

        <div class="side">
          <!-- iPhone lock screen -->
          <div class="phone" aria-hidden="true">
            <i class="sb s1"></i><i class="sb s2"></i><i class="sb s3"></i><i class="sb s4"></i>
            <div class="screen">
              <div class="island"></div>
              <div class="status">
                <span class="time">9:41</span>
                <span class="ico">
                  <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1.5 4a9.5 9.5 0 0 1 13 0"/><path d="M4 6.8a6 6 0 0 1 8 0"/><circle cx="8" cy="9.4" r="1" fill="currentColor" stroke="none"/></svg>
                  <span class="bat"><b></b></span>
                </span>
              </div>

              <div class="clock">
                <small>Friday, 20 November</small>
                <b>9:41</b>
              </div>

              <TransitionGroup tag="ul" name="nt" class="feed">
                <li v-for="a in visible" :key="a.id" class="note">
                  <span class="ic" :class="a.c">S</span>
                  <span class="nb">
                    <span class="nh"><small>Saptivo · {{ a.app }}</small><small>now</small></span>
                    <b>{{ a.t }}</b>
                    <span class="nd">{{ a.b }}</span>
                  </span>
                </li>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pn {
  --ink: #14120f; --muted: #666b73;
  --sky-i: #3a7fbd; --mint-i: #2c7a56; --butter-i: #94700a; --rose-i: #c94b73;
  --sky: #e4f0fb; --mint: #dff3e8; --butter: #fff4d2; --rose: #fde7ed;
  font-family: "Urbanist", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.pn *, .pn *::before, .pn *::after { box-sizing: border-box; }

/* big full image */
.stage {
  position: relative;
  max-width: 1360px;
  margin: 0 auto;
  min-height: 720px;
  border-radius: 32px;
  overflow: hidden;
  background: linear-gradient(160deg, #ffffff 0%, #f7f8fc 55%, #eef1f7 100%);
  display: flex;
  align-items: stretch;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity .6s ease, transform .6s ease;
}
.in .stage { opacity: 1; transform: none; }
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255, 255, 255, .82) 0%, rgba(255, 255, 255, .58) 45%, rgba(255, 255, 255, .2) 100%); }

.wrap {
  position: relative;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
  gap: 48px;
  align-items: center;
}

h2 { margin: 0 0 20px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; color: var(--ink); }
.copy { padding: 64px 0; }
.copy p { margin: 0; max-width: 440px; font-size: 17px; line-height: 1.7; color: rgba(20, 18, 15, .72); }

.side { align-self: end; display: flex; justify-content: center; }

/* ---------- iPhone frame ---------- */
.phone {
  position: relative;
  width: 290px;
  height: 560px;
  margin-bottom: -2px;
  padding: 9px 9px 0;
  border-radius: 54px 54px 0 0;
  background: linear-gradient(145deg, #4a4a4f, #1c1c1e 40%, #2e2e32);
  box-shadow:
    0 0 0 1.5px #8e8e93 inset,
    0 -2px 0 1px rgba(255, 255, 255, .15) inset,
    0 30px 60px rgba(0, 0, 0, .45),
    0 10px 24px rgba(0, 0, 0, .3);
  transform: translateY(105%);
  opacity: 0;
  transition: transform 1.1s cubic-bezier(.22, 1, .36, 1) .35s, opacity .5s ease .35s;
  will-change: transform;
}
.in .phone { transform: translateY(0); opacity: 1; }

.sb { position: absolute; width: 3px; background: #3a3a3e; border-radius: 2px; }
.s1 { left: -3px; top: 74px; height: 22px; }
.s2 { left: -3px; top: 112px; height: 40px; }
.s3 { left: -3px; top: 162px; height: 40px; }
.s4 { right: -3px; top: 130px; height: 62px; }

/* lock screen wallpaper */
.screen {
  position: relative;
  height: 100%;
  border-radius: 45px 45px 0 0;
  overflow: hidden;
  padding: 0 12px;
  background: linear-gradient(170deg, #5b4bc4 0%, #2f5f9e 55%, #1b2c4f 100%);
  color: #fff;
}
.island { position: absolute; top: 9px; left: 50%; transform: translateX(-50%); width: 78px; height: 23px; border-radius: 20px; background: #000; z-index: 3; }
.status { height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 6px 12px 0; font-size: 12.5px; font-weight: 600; }
.status .ico { display: flex; align-items: center; gap: 5px; }
.status svg rect { fill: #fff; }
.bat { width: 24px; height: 11.5px; border: 1.5px solid rgba(255, 255, 255, .5); border-radius: 4px; padding: 1.5px; position: relative; }
.bat::after { content: ""; position: absolute; right: -4px; top: 3px; width: 2px; height: 4px; border-radius: 0 2px 2px 0; background: rgba(255, 255, 255, .5); }
.bat b { display: block; width: 78%; height: 100%; background: #fff; border-radius: 2px; }

.clock { text-align: center; padding: 10px 0 22px; display: flex; flex-direction: column; }
.clock small { font-size: 13px; font-weight: 500; opacity: .85; }
.clock b { font-size: 62px; font-weight: 500; line-height: 1.05; letter-spacing: -0.03em; }

/* notifications */
.feed { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; position: relative; }
.note {
  display: flex; gap: 10px; align-items: flex-start;
  padding: 10px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, .88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: var(--ink);
  box-shadow: 0 8px 20px rgba(0, 0, 0, .18);
}
.ic { width: 34px; height: 34px; border-radius: 9px; flex: none; display: grid; place-items: center; font-size: 15px; font-weight: 600; }
.ic.rose { background: var(--rose); color: var(--rose-i); }
.ic.sky { background: var(--sky); color: var(--sky-i); }
.ic.butter { background: var(--butter); color: var(--butter-i); }
.ic.mint { background: var(--mint); color: var(--mint-i); }
.nb { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.nh { display: flex; justify-content: space-between; gap: 8px; }
.nh small { font-size: 10.5px; color: var(--muted); }
.nb b { font-size: 12.5px; font-weight: 600; margin-top: 1px; }
.nd { font-size: 12px; line-height: 1.4; color: #3d4046; }

.nt-enter-active { transition: opacity .45s ease, transform .55s cubic-bezier(.22, 1, .36, 1); }
.nt-leave-active { transition: opacity .3s ease; position: absolute; left: 0; right: 0; }
.nt-move { transition: transform .5s cubic-bezier(.22, 1, .36, 1); }
.nt-enter-from { opacity: 0; transform: translateY(-24px) scale(.96); }
.nt-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .stage { min-height: 0; }
  .shade { background: linear-gradient(180deg, rgba(180, 180, 181, 0.8) 0%, rgba(11, 11, 11, 0.5) 100%); }
  .wrap { grid-template-columns: 1fr; gap: 0; padding: 0 24px; }
  .copy { padding: 48px 0 32px; }
}
@media (max-width: 640px) {
  .pn { padding: 64px 16px; }
  .stage { border-radius: 24px; }
  .phone { width: 260px; height: 520px; border-radius: 48px 48px 0 0; }
  .screen { border-radius: 40px 40px 0 0; }
  .clock b { font-size: 54px; }
}
@media (prefers-reduced-motion: reduce) {
  .stage { opacity: 1; transform: none; transition: none; }
  .phone { transform: none; opacity: 1; transition: none; }
  * { transition-duration: 0s !important; animation: none !important; }
}
</style>
