<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SendDocsInChatSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
let timer = null;
let io = null;
let reduce = false;
const LAST = 7;

const base = "/saptivo/images/features/";
const cards = [
  { k: "docs", tone: "lav", tag: "Quotations and invoices", photo: base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg" },
  { k: "retail", tone: "mint", tag: "Retailers", photo: base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg" },
  { k: "service", tone: "sky", tag: "Service companies", photo: base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg" },
];
const ok = ref([true, true, true]);

function next() {
  step.value = (step.value + 1) % (LAST + 1);
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(next, 1500);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    step.value = 5;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.25 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="sd" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2>Send quotations, invoices and digital receipts</h2>
        <p>
          Share PDF quotations and invoices directly in the chat. Retailers can send digital receipts and loyalty
          updates after every purchase, and service companies can send visit reminders.
        </p>
      </header>

      <div class="grid">
        <article v-for="(c, i) in cards" :key="c.k" class="card" :class="'tone-' + c.tone" :style="{ '--d': i * 110 + 'ms' }">
          <div class="ph">
            <img v-if="ok[i]" :src="c.photo" alt="" @error="ok[i] = false" />
            <span class="tag">{{ c.tag }}</span>
          </div>

          <div class="chat" role="img" :aria-label="c.tag + ' example chat'">
            <!-- quotations and invoices -->
            <template v-if="c.k === 'docs'">
              <Transition name="msg">
                <div v-if="step >= 1" class="m out"><p>Hi Dilani, here is your quotation.</p></div>
              </Transition>
              <Transition name="msg">
                <div v-if="step >= 2" class="m out">
                  <div class="pdf">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 3h8l4 4v14H7zM15 3v4h4" /></svg>
                    <div><strong>Quotation Q-1042.pdf</strong><span>PDF · LKR 42,000</span></div>
                  </div>
                </div>
              </Transition>
              <Transition name="msg">
                <div v-if="step >= 3" class="m in"><p>Looks good, please go ahead!</p></div>
              </Transition>
              <Transition name="msg">
                <div v-if="step >= 4" class="m out">
                  <div class="pdf">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" /></svg>
                    <div><strong>Invoice INV-3021.pdf</strong><span>PDF · due in 14 days</span></div>
                  </div>
                  <span class="ticks" :class="{ read: step >= 5 }">{{ step >= 5 ? "✓✓ Read" : "✓ Sent" }}</span>
                </div>
              </Transition>
            </template>

            <!-- retail -->
            <template v-else-if="c.k === 'retail'">
              <Transition name="msg">
                <div v-if="step >= 1" class="m out">
                  <div class="rcpt">
                    <div class="rh"><strong>Digital receipt</strong><span>R-2210 · 09:17</span></div>
                    <div class="ri"><span>Rice 5 kg</span><b>1,450</b></div>
                    <div class="ri"><span>Coconut oil 1 L</span><b>980</b></div>
                    <div class="ri"><span>Tea 400 g</span><b>720</b></div>
                    <div class="rt"><span>Total</span><b>LKR 3,150</b></div>
                    <em class="paid">Paid by card</em>
                  </div>
                </div>
              </Transition>
              <Transition name="msg">
                <div v-if="step >= 3" class="m out">
                  <div class="loy">
                    <div class="lt"><strong>Loyalty update</strong><span>+120 points</span></div>
                    <div class="bar"><i :class="{ go: step >= 4 }"></i></div>
                    <small>Gold member in 80 points</small>
                  </div>
                </div>
              </Transition>
            </template>

            <!-- service -->
            <template v-else>
              <Transition name="msg">
                <div v-if="step >= 1" class="m out">
                  <div class="rem">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>
                    <div>
                      <strong>Visit reminder</strong>
                      <span>Tomorrow, 10:00 am · AC service</span>
                      <span>Technician: Kasun</span>
                    </div>
                  </div>
                </div>
              </Transition>
              <Transition name="msg">
                <div v-if="step >= 3 && step < 5" class="m out qrs">
                  <span class="qr" :class="{ pick: step >= 4 }">Confirm</span>
                  <span class="qr">Reschedule</span>
                </div>
              </Transition>
              <Transition name="msg">
                <div v-if="step >= 4" class="m in"><p>Confirm</p></div>
              </Transition>
              <Transition name="msg">
                <div v-if="step >= 5" class="m out"><p class="okp">Confirmed. See you tomorrow!</p></div>
              </Transition>
            </template>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sd {
  --ink: #17191d; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 88px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 760px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--rose); color: var(--rose-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { font-size: clamp(34px, 3.4vw, 56px); line-height: 1.08; font-weight: 500; margin: 0 0 16px; letter-spacing: -0.06em; font-family: "Inter", system-ui, sans-serif; text-wrap: balance; }
.head p { margin: 0; font-size: 16px; line-height: 1.65; color: var(--muted); }

.head, .card { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .card { opacity: 1; transform: none; }
.in .card { transition-delay: calc(.12s + var(--d)); }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.card { background: var(--tb); border: 1px solid var(--line); border-radius: 24px; overflow: hidden; display: flex; flex-direction: column; }
.ph { height: 150px; position: relative; background: linear-gradient(135deg, var(--t), #fff); overflow: hidden; }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.tag { position: absolute; left: 14px; bottom: 14px; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 99px; background: rgba(255, 255, 255, .78); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); color: var(--ink); }

.chat { flex: 1; min-height: 330px; padding: 16px; display: flex; flex-direction: column; justify-content: flex-start; gap: 10px; }
.m { max-width: 88%; display: flex; flex-direction: column; gap: 3px; }
.m p { margin: 0; font-size: 13px; line-height: 1.45; padding: 9px 12px; border-radius: 14px; }
.out { align-self: flex-end; align-items: flex-end; }
.out p { background: #fff; border: 1px solid var(--line); border-top-right-radius: 4px; }
.in { align-self: flex-start; }
.in p { background: var(--mint); border-top-left-radius: 4px; }
.okp { background: var(--mint) !important; border: 0 !important; }
.ticks { font-size: 10px; font-weight: 600; color: var(--muted); transition: color .3s; }
.ticks.read { color: var(--sky-i); }

.pdf { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 9px 14px 9px 10px; }
.pdf svg { width: 30px; height: 30px; padding: 6px; border-radius: 8px; background: var(--rose); color: var(--rose-i); flex: none; }
.pdf strong { display: block; font-size: 12px; }
.pdf span { font-size: 11px; color: var(--muted); }

.rcpt { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; width: 220px; display: flex; flex-direction: column; gap: 5px; }
.rh { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px dashed #d9d6e4; padding-bottom: 6px; margin-bottom: 2px; }
.rh strong { font-size: 12px; }
.rh span { font-size: 10px; color: var(--muted); }
.ri, .rt { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); }
.ri b { font-weight: 500; color: var(--ink); }
.rt { border-top: 1px dashed #d9d6e4; padding-top: 6px; margin-top: 2px; color: var(--ink); font-weight: 600; }
.paid { align-self: flex-start; font-style: normal; font-size: 10px; font-weight: 600; background: var(--mint); color: var(--mint-i); padding: 2px 9px; border-radius: 99px; margin-top: 2px; }
.loy { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; width: 220px; display: flex; flex-direction: column; gap: 7px; }
.lt { display: flex; justify-content: space-between; align-items: center; }
.lt strong { font-size: 12px; }
.lt span { font-size: 11px; font-weight: 700; color: var(--butter-i); background: var(--butter); padding: 2px 9px; border-radius: 99px; }
.bar { height: 7px; border-radius: 99px; background: #f1f0f6; overflow: hidden; }
.bar i { display: block; height: 100%; width: 40%; border-radius: 99px; background: var(--butter-i); transition: width 1s ease; }
.bar i.go { width: 84%; }
.loy small { font-size: 11px; color: var(--muted); }

.rem { display: flex; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; width: 230px; }
.rem svg { width: 34px; height: 34px; padding: 7px; border-radius: 10px; background: var(--sky); color: var(--sky-i); flex: none; }
.rem strong { display: block; font-size: 12px; margin-bottom: 2px; }
.rem span { display: block; font-size: 11px; color: var(--muted); line-height: 1.5; }
.qrs { flex-direction: row; gap: 6px; }
.qr { font-size: 12px; font-weight: 600; padding: 7px 14px; border-radius: 99px; border: 1px solid var(--sky-i); color: var(--sky-i); background: #fff; transition: all .3s; }
.qr.pick { background: var(--ink); border-color: var(--ink); color: #fff; }

.msg-enter-active { transition: all .45s ease; }
.msg-enter-from { opacity: 0; transform: translateY(12px); }
.msg-leave-active { transition: all .25s ease; }
.msg-leave-to { opacity: 0; }

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
  .chat { min-height: 300px; }
}
@media (max-width: 560px) {
  .sd { padding: 64px 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .card { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
