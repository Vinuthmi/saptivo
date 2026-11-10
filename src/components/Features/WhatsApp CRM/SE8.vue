<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "EmailSmsCentreSection" });

const root = ref(null);
const shown = ref(false);
const step = ref(0);
const manual = ref(false);
const scope = ref("contact");
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const avatar = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";
const avatarOk = ref(true);

const points = [
  { tone: "lav", t: "Two-way email sync with Gmail, Outlook and IMAP/SMTP" },
  { tone: "butter", t: "Email templates with merge fields and open and click tracking" },
  { tone: "mint", t: "SMS gateway for reminders and OTPs" },
  { tone: "sky", t: "Conversation threading per contact and deal" },
];

const channels = [
  { k: "wa", t: "WhatsApp", sub: "the heart", on: [3] },
  { k: "email", t: "Email", sub: "", on: [0, 1, 3] },
  { k: "sms", t: "SMS", sub: "", on: [2, 3] },
];

const providers = [
  { n: "Gmail", c: "#d8567f" },
  { n: "Outlook", c: "#3f87c7" },
  { n: "IMAP / SMTP", c: "#7d6be6" },
];

const thread = [
  { id: 1, ch: "wa", t: "WhatsApp", x: "Dilani: Can you send the quotation by email too?", d: "Mon 09:02", deal: true },
  { id: 2, ch: "email", t: "Email", x: "Quotation Q-1042 sent · opened 2 times", d: "Mon 09:10", deal: true },
  { id: 3, ch: "sms", t: "SMS", x: "Reminder: your service visit is tomorrow, 10:00 am", d: "Mon 15:30", deal: false },
  { id: 4, ch: "email", t: "Email", x: "Re: Quotation Q-1042, please go ahead", d: "Tue 08:41", deal: true },
  { id: 5, ch: "wa", t: "WhatsApp", x: "Invoice INV-3021 shared in chat", d: "Tue 09:20", deal: true },
];
const shownThread = computed(() => (scope.value === "deal" ? thread.filter((e) => e.deal) : thread));
const isOn = (c) => c.on.includes(step.value);

function next() {
  step.value = (step.value + 1) % points.length;
}
function pick(i) {
  manual.value = true;
  stop();
  step.value = i;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 4600);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
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
  <section ref="root" class="ec" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2>Email and SMS in the same communication centre</h2>
        <p>WhatsApp is the heart of Saptivo's communication centre, but it isn't alone:</p>
      </header>

      <div class="grid">
        <ul class="pts">
          <li v-for="(p, i) in points" :key="p.t" class="pt" :class="['tone-' + p.tone, { act: step === i, run: step === i && !manual }]">
            <button type="button" @click="pick(i)">
              <span class="n">{{ i + 1 }}</span>
              <span class="tx">{{ p.t }}</span>
              <span class="prog"><i></i></span>
            </button>
          </li>
        </ul>

        <div class="panel" role="img" aria-label="Email, SMS and WhatsApp in one communication centre">
          <div class="strip">
            <span v-for="c in channels" :key="c.k" class="ch" :class="[c.k, { on: isOn(c), heart: c.k === 'wa' }]">
              <i></i>{{ c.t }}<small v-if="c.sub">· {{ c.sub }}</small>
            </span>
          </div>

          <div class="stage">
            <Transition name="swap" mode="out-in">
              <!-- 1 email sync -->
              <div v-if="step === 0" key="a" class="s s-sync">
                <div class="prov">
                  <div v-for="(p, i) in providers" :key="p.n" class="pr" :style="{ '--dl': 0.5 + i * 0.7 + 's' }">
                    <b :style="{ background: p.c }">{{ p.n[0] }}</b>
                    <strong>{{ p.n }}</strong>
                    <span class="state">
                      <em class="st-p">Connecting…</em>
                      <em class="st-d">Synced</em>
                    </span>
                  </div>
                </div>
                <div class="two"><span>↓ inbox</span><i></i><span>sent ↑</span></div>
                <div class="mail inb">
                  <b>D</b>
                  <div><strong>Re: Quotation Q-1042</strong><span>Dilani Perera · added to her timeline</span></div>
                </div>
              </div>

              <!-- 2 templates -->
              <div v-else-if="step === 1" key="b" class="s s-tpl">
                <div class="mailcard">
                  <div class="mh"><span>Template</span><strong>Quotation follow-up</strong></div>
                  <p class="subj">Your quotation, <u v-pre>{{first_name}}</u><span class="fill">Dilani</span></p>
                  <p class="body">
                    Hi <u v-pre>{{first_name}}</u><span class="fill">Dilani</span>, here is quotation <u v-pre>{{quote_no}}</u><span class="fill">Q-1042</span> for
                    <u v-pre>{{deal_name}}</u><span class="fill">Order #1042</span>.
                  </p>
                  <span class="cta">View quotation</span>
                </div>
                <div class="track">
                  <span class="tk t1">Sent</span>
                  <span class="tk t2">Opened · 2 times</span>
                  <span class="tk t3">Clicked “View quotation”</span>
                </div>
              </div>

              <!-- 3 sms -->
              <div v-else-if="step === 2" key="c" class="s s-sms">
                <div class="sid"><b>SAPTIVO</b><span>Sender ID · SMS gateway</span></div>
                <div class="bub b1"><small>Reminder</small>Reminder: your service visit is tomorrow at 10:00 am. Reply C to confirm.</div>
                <div class="bub b2 otp"><small>OTP</small><b>482910</b> is your Saptivo verification code. It expires in 5 minutes.</div>
                <div class="dl"><span class="d1">✓ Sent</span><span class="d2">✓✓ Delivered</span></div>
              </div>

              <!-- 4 threading -->
              <div v-else key="d" class="s s-thr">
                <div class="th">
                  <span class="ava">
                    <img v-if="avatarOk" :src="avatar" alt="" @error="avatarOk = false" />
                    <b v-else>D</b>
                  </span>
                  <div><strong>Dilani Perera</strong><span>Deal: Order #1042</span></div>
                  <div class="seg" @click.stop>
                    <button type="button" :class="{ a: scope === 'contact' }" @click="scope = 'contact'">Contact</button>
                    <button type="button" :class="{ a: scope === 'deal' }" @click="scope = 'deal'">Deal</button>
                  </div>
                </div>
                <TransitionGroup name="row" tag="ol" class="tlist">
                  <li v-for="(e, i) in shownThread" :key="e.id" :class="'k-' + e.ch" :style="{ '--i': i }">
                    <em>{{ e.t }}</em>
                    <span>{{ e.x }}</span>
                    <time>{{ e.d }}</time>
                  </li>
                </TransitionGroup>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ec {
  --ink: #17191d; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, #f8f6ff 0%, #fff 100%);
  padding: 88px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 720px; margin: 0 auto 40px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--lav); color: var(--lav-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { font-size: clamp(34px, 3.4vw, 56px); line-height: 1.08; font-weight: 500; margin: 0 0 14px; letter-spacing: -0.06em; font-family: "Inter", system-ui, sans-serif; text-wrap: balance; }
.head p { margin: 0; font-size: 16px; line-height: 1.65; color: var(--muted); }

.head, .pts, .panel { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .pts, .in .panel { opacity: 1; transform: none; }
.in .panel { transition-delay: .12s; }

.grid { display: grid; grid-template-columns: 380px 1fr; gap: 28px; align-items: stretch; }
.pts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.pt { flex: 1; }
.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.pt button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; height: 100%; display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 18px; border: 1px solid var(--line); background: #fff; position: relative; overflow: hidden; transition: background .35s, border-color .35s, transform .35s; }
.pt button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.n { flex: none; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; background: var(--t); color: var(--ti); }
.tx { font-size: 14.5px; line-height: 1.5; font-weight: 500; }
.pt.act button { background: var(--tb); border-color: var(--ti); transform: translateX(6px); }
.prog { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; }
.prog i { display: block; width: 0; height: 100%; background: var(--ink); }
.pt.act:not(.run) .prog i { width: 100%; }
.pt.act.run .prog i { animation: fill 4.6s linear forwards; }
@keyframes fill { to { width: 100%; } }

/* panel */
.panel { background: linear-gradient(160deg, #f1eeff, #e9f5ff 55%, #e6f7ee); border-radius: 26px; padding: 22px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.strip { display: flex; gap: 8px; flex-wrap: wrap; }
.ch { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; padding: 8px 14px; border-radius: 99px; background: rgba(255, 255, 255, .6); color: var(--muted); transition: all .35s; }
.ch i { width: 8px; height: 8px; border-radius: 50%; background: #c9c5d8; transition: background .35s; }
.ch small { font-weight: 500; font-size: 11px; }
.ch.on { background: #fff; color: var(--ink); box-shadow: 0 6px 16px rgba(60, 50, 120, .1); }
.ch.wa.on i, .ch.wa i { background: var(--mint-i); }
.ch.email.on i { background: var(--lav-i); }
.ch.sms.on i { background: var(--butter-i); }
.ch.heart { background: var(--mint); color: var(--mint-i); }

.stage { background: #fff; border-radius: 18px; box-shadow: 0 18px 44px rgba(60, 50, 120, .12); padding: 20px; flex: 1; min-height: 400px; position: relative; overflow: hidden; }
.s { height: 100%; display: flex; flex-direction: column; gap: 14px; }

/* shared fade-ins driven by CSS (re-run each time the view mounts) */
.pr, .mail, .mailcard, .bub, .sid, .tk, .dl span, .th, .tlist li { animation: rise .5s ease both; }
@keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

/* 1 sync */
.prov { display: flex; flex-direction: column; gap: 10px; }
.pr { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 14px; }
.pr:nth-child(2) { animation-delay: .15s; }
.pr:nth-child(3) { animation-delay: .3s; }
.pr b { width: 30px; height: 30px; border-radius: 9px; color: #fff; display: grid; place-items: center; font-size: 13px; flex: none; }
.pr strong { font-size: 13px; flex: 1; }
.state { position: relative; width: 104px; height: 24px; }
.state em { position: absolute; right: 0; top: 0; font-style: normal; font-size: 11px; font-weight: 600; padding: 4px 11px; border-radius: 99px; white-space: nowrap; }
.st-p { background: var(--butter); color: var(--butter-i); animation: out .3s ease var(--dl) forwards; }
.st-d { background: var(--mint); color: var(--mint-i); opacity: 0; animation: inn .4s ease var(--dl) forwards; }
@keyframes out { to { opacity: 0; } }
@keyframes inn { to { opacity: 1; } }
.two { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 600; color: var(--lav-i); }
.two i { flex: 1; height: 2px; background: repeating-linear-gradient(90deg, #cfcbe0 0 6px, transparent 6px 12px); }
.mail { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; background: #f6f4ff; animation-delay: 2.6s; }
.mail b { width: 34px; height: 34px; border-radius: 50%; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-size: 13px; }
.mail strong { display: block; font-size: 13px; }
.mail span { font-size: 11px; color: var(--muted); }

/* 2 templates */
.mailcard { border: 1px solid var(--line); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.mh { display: flex; align-items: center; gap: 10px; font-size: 11px; color: var(--muted); }
.mh strong { color: var(--ink); font-size: 12px; }
.mh span { background: var(--butter); color: var(--butter-i); font-weight: 600; padding: 2px 9px; border-radius: 99px; }
.subj { margin: 0; font-size: 14px; font-weight: 600; }
.body { margin: 0; font-size: 13px; line-height: 1.9; color: var(--muted); }
u { text-decoration: none; font-family: ui-monospace, monospace; font-size: 11px; background: var(--butter); color: var(--butter-i); padding: 2px 7px; border-radius: 6px; animation: swapout .4s ease 1.2s forwards; }
.fill { display: inline-block; color: var(--ink); font-weight: 600; background: var(--mint); padding: 1px 8px; border-radius: 6px; margin-left: -2px; opacity: 0; animation: inn .4s ease 1.3s forwards; }
@keyframes swapout { to { opacity: 0; font-size: 0; padding: 0; margin: 0; } }
.cta { align-self: flex-start; font-size: 12px; font-weight: 600; background: var(--ink); color: #fff; padding: 8px 16px; border-radius: 99px; }
.track { display: flex; flex-wrap: wrap; gap: 8px; }
.tk { font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 99px; }
.t1 { background: #f1f0f6; color: var(--muted); animation-delay: 1.6s; }
.t2 { background: var(--sky); color: var(--sky-i); animation-delay: 2.2s; }
.t3 { background: var(--mint); color: var(--mint-i); animation-delay: 2.8s; }

/* 3 sms */
.sid { display: flex; align-items: center; gap: 10px; }
.sid b { font-size: 11px; letter-spacing: .08em; background: var(--ink); color: #fff; padding: 5px 12px; border-radius: 99px; }
.sid span { font-size: 11px; color: var(--muted); }
.bub { max-width: 78%; font-size: 13px; line-height: 1.5; padding: 10px 14px; border-radius: 16px; border-top-left-radius: 4px; background: #f3f1fa; align-self: flex-start; }
.bub small { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--butter-i); margin-bottom: 2px; }
.b1 { animation-delay: .5s; }
.b2 { animation-delay: 1.5s; }
.otp { background: var(--butter); }
.otp b { font-size: 16px; letter-spacing: .12em; }
.dl { display: flex; gap: 8px; align-self: flex-start; font-size: 11px; font-weight: 600; }
.dl span { padding: 4px 10px; border-radius: 99px; }
.d1 { background: #f1f0f6; color: var(--muted); animation-delay: 2.1s; }
.d2 { background: var(--mint); color: var(--mint-i); animation-delay: 2.8s; }

/* 4 threading */
.th { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
.th > div:nth-child(2) { flex: 1; min-width: 0; }
.th strong { display: block; font-size: 14px; }
.th span { font-size: 11px; color: var(--muted); }
.ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-weight: 700; flex: none; }
.ava img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.seg { display: flex; background: #f3f1fa; border-radius: 99px; padding: 3px; }
.seg button { all: unset; cursor: pointer; font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 99px; color: var(--muted); transition: all .3s; }
.seg button.a { background: var(--ink); color: #fff; }
.seg button:focus-visible { outline: 2px solid var(--ink); }
.tlist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; position: relative; }
.tlist li { display: grid; grid-template-columns: 78px 1fr auto; gap: 12px; align-items: center; padding: 10px 12px; border-radius: 12px; background: #fbfaff; font-size: 12px; animation-delay: calc(.2s + var(--i) * .2s); }
.tlist em { font-style: normal; font-size: 10px; font-weight: 700; text-align: center; padding: 3px 0; border-radius: 99px; }
.k-wa em { background: var(--mint); color: var(--mint-i); }
.k-email em { background: var(--lav); color: var(--lav-i); }
.k-sms em { background: var(--butter); color: var(--butter-i); }
.tlist time { font-size: 10px; color: #9a9fa8; white-space: nowrap; }

.swap-enter-active, .swap-leave-active { transition: opacity .25s ease; }
.swap-enter-from, .swap-leave-to { opacity: 0; }
.row-enter-active, .row-leave-active { transition: all .3s ease; }
.row-enter-from, .row-leave-to { opacity: 0; transform: translateX(-10px); }
.row-leave-active { position: absolute; left: 0; right: 0; }
.row-move { transition: transform .3s ease; }

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr; }
  .pt.act button { transform: none; }
}
@media (max-width: 560px) {
  .ec { padding: 64px 16px; }
  .panel { padding: 14px; }
  .stage { padding: 14px; min-height: 420px; }
  .tlist li { grid-template-columns: 1fr; gap: 4px; }
  .tlist em { justify-self: start; padding: 3px 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .pts, .panel { opacity: 1; transform: none; transition: none; }
  .pr, .mail, .mailcard, .bub, .sid, .tk, .dl span, .th, .tlist li, .fill, .st-d { animation: none; opacity: 1; }
  .st-p, u { animation: none; display: none; }
  .pt.act.run .prog i { animation: none; width: 100%; }
  * { transition-duration: 0s !important; }
}
</style>
