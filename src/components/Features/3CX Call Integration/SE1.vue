<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "IncomingCallPopupSection" });

const root = ref(null);
const shown = ref(false);
const sc = ref(0);
const ph = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;
const END = 6;

const base = "/saptivo/images/features/";
const photo = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";
const photoOk = ref(true);

const tabs = ["Known customer", "New number"];

const fields = [
  { l: "Company", v: "Jayasuriya Textiles", at: 1 },
  { l: "Customer since", v: "March 2022", at: 2 },
  { l: "Last order", v: "#1042 · 12 Oct · LKR 42,000", at: 2 },
  { l: "Open tickets", v: "1 · Delivery delay", at: 3, warn: true },
  { l: "Latest quotation", v: "Q-1051 · LKR 68,500 · Sent", at: 3 },
];

// the six things the pop-up shows, lit up as they appear in the demo
const tiles = [
  { l: "Name", v: "Malini Jayasuriya", at: 1, tone: "lav", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c1.2-3.6 4-5 7-5s5.8 1.4 7 5" },
  { l: "Company", v: "Jayasuriya Textiles", at: 1, tone: "sky", d: "M4 20V6l8-3 8 3v14M9 20v-5h6v5M8 9h.01M12 9h.01M16 9h.01" },
  { l: "Customer since", v: "March 2022", at: 2, tone: "mint", d: "M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1ZM8 3v4M16 3v4M4 10h16" },
  { l: "Last order", v: "#1042 · LKR 42,000", at: 2, tone: "butter", d: "M5 8h14l-1 12H6ZM9 8V6a3 3 0 0 1 6 0v2" },
  { l: "Open tickets", v: "1 · Delivery delay", at: 3, tone: "rose", d: "M12 8v5M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" },
  { l: "Latest quotation", v: "Q-1051 · LKR 68,500", at: 3, tone: "peach", d: "M7 3h7l4 4v14H7ZM10 12h5M10 16h5" },
];

const known = computed(() => sc.value === 0);
const visible = computed(() => fields.filter((f) => f.at <= ph.value));
const popup = computed(() => ph.value >= 1);
const ringing = computed(() => ph.value === 0);
const answered = computed(() => known.value && ph.value >= 4);
const saved = computed(() => !known.value && ph.value >= 5);
const pressing = computed(() => !known.value && ph.value === 4);

// the three benefits light up in step with the demo
const trio = computed(() => [
  { t: "Greet customers by name", p: "Name and company are on screen before you answer.", tone: "mint", lit: known.value && ph.value >= 1, d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c1.2-3.6 4-5 7-5s5.8 1.4 7 5" },
  { t: "Pick up where you left off", p: "Last order, open tickets and latest quotation at a glance.", tone: "butter", lit: known.value && ph.value >= 3, d: "M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.5A8.4 8.4 0 1 1 21 11.5Z" },
  { t: "New numbers become leads", p: "Save an unknown caller as a lead in one click.", tone: "lav", lit: saved.value, d: "M12 5v14M5 12h14" },
]);

function advance() {
  if (ph.value < END) ph.value++;
  else if (!manual.value) {
    sc.value = (sc.value + 1) % tabs.length;
    ph.value = 0;
  }
}
function pick(i) {
  manual.value = true;
  sc.value = i;
  ph.value = 0;
  start();
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(advance, 1500);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    ph.value = 5;
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
  <section ref="root" id="call-popup" class="cp" :class="{ in: shown }" aria-labelledby="cp-title">
    <div class="wrap">
      <header class="head">
        <h2 id="cp-title">Incoming call pop-up</h2>
        <p>
          When the phone rings, Saptivo opens the caller's record on screen: name, company, customer since, last
          order, open tickets and latest quotation. Your team greets customers by name and picks up where the last
          conversation ended. New numbers can be saved as leads in one click.
        </p>
      </header>

      <div class="tabs" role="tablist" aria-label="Call scenario">
        <button
          v-for="(t, i) in tabs"
          :key="t"
          type="button"
          role="tab"
          :aria-selected="sc === i"
          class="tab"
          :class="{ act: sc === i }"
          @click="pick(i)"
        >{{ t }}</button>
      </div>

      <div class="screen" role="img" aria-label="Saptivo CRM showing a pop-up with the caller's record when the phone rings">
        <div class="bar">
          <i></i><i></i><i></i>
          <span class="url">app.saptivo.com / dashboard</span>
          <span class="ring" :class="{ on: ringing }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
            {{ ringing ? "Incoming call…" : answered ? "On call" : "Phone" }}
          </span>
        </div>

        <!-- page behind -->
        <div class="app" :class="{ dim: popup }">
          <aside>
            <b></b><i></i><i></i><i></i><i></i><i></i>
          </aside>
          <main>
            <div class="sk h"></div>
            <div class="cards3"><div class="sk"></div><div class="sk"></div><div class="sk"></div></div>
            <div class="sk row"></div><div class="sk row"></div><div class="sk row"></div><div class="sk row"></div>
          </main>
        </div>

        <!-- ringing banner -->
        <Transition name="drop">
          <div v-if="ringing" class="banner">
            <span class="wave"><i></i><i></i><i></i></span>
            <div>
              <strong>{{ known ? "+94 76 400 2211" : "+94 71 889 4520" }}</strong>
              <span>Incoming call · looking up the number…</span>
            </div>
          </div>
        </Transition>

        <!-- pop-up -->
        <Transition name="pop">
          <div v-if="popup" :key="sc" class="pop">
            <div class="ph">
              <span class="av" :class="{ un: !known }">
                <template v-if="known">
                  <img v-if="photoOk" :src="photo" alt="" @error="photoOk = false" />
                  <b v-else>M</b>
                </template>
                <b v-else>?</b>
              </span>
              <div class="id">
                <strong>{{ known ? "Malini Jayasuriya" : "Unknown number" }}</strong>
                <span>{{ known ? "+94 76 400 2211" : "+94 71 889 4520" }}</span>
              </div>
              <span class="tag" :class="known ? 'cust' : 'newn'">{{ known ? "Customer" : "New number" }}</span>
            </div>

            <!-- known -->
            <template v-if="known">
              <TransitionGroup name="fld" tag="dl" class="dl">
                <div v-for="f in visible" :key="f.l" class="f" :class="{ warn: f.warn }">
                  <dt>{{ f.l }}</dt>
                  <dd>{{ f.v }}</dd>
                </div>
              </TransitionGroup>
              <Transition name="fld">
                <div v-if="answered" class="hint">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                  <span>Greet her by name: “Hello Ms. Jayasuriya!”<br /><em>Last call: asked for a delivery update on #1042.</em></span>
                </div>
              </Transition>
            </template>

            <!-- new -->
            <template v-else>
              <Transition name="fld">
                <p v-if="ph >= 2" class="none">No matching contact, lead or account found.</p>
              </Transition>
              <Transition name="fld">
                <div v-if="saved" class="done">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                  <div><strong>Saved as a lead</strong><span>Pipeline: New enquiry · Source: Phone</span></div>
                </div>
              </Transition>
            </template>

            <div class="act">
              <template v-if="known">
                <span class="btn ghost">Decline</span>
                <span class="btn" :class="{ live: answered }">{{ answered ? "On call · 00:12" : "Answer" }}</span>
              </template>
              <template v-else>
                <span class="btn ghost">Decline</span>
                <span class="btn" :class="{ press: pressing, off: saved }">{{ saved ? "Lead saved" : "Save as lead" }}</span>
              </template>
            </div>
          </div>
        </Transition>
      </div>

      <!-- what the pop-up shows -->
      <ul class="strip" aria-label="What the pop-up shows">
        <li v-for="t in tiles" :key="t.l" :class="[t.tone, { lit: known && ph >= t.at }]">
          <span class="ti">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="t.d" /></svg>
          </span>
          <span class="tt"><small>{{ t.l }}</small><b>{{ t.v }}</b></span>
        </li>
      </ul>

      <!-- why it matters -->
      <ul class="trio">
        <li v-for="c in trio" :key="c.t" :class="[c.tone, { lit: c.lit }]">
          <span class="ci">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="c.d" /></svg>
          </span>
          <h3>{{ c.t }}</h3>
          <p>{{ c.p }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");

.cp {
  --ink: #17191d; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  --peach: #ffe9df; --peach-i: #d9623a;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 88px 16px;
  scroll-margin-top: 100px;
}
.cp *, .cp *::before, .cp *::after { box-sizing: border-box; }
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 32px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--sky); color: var(--sky-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { font-size: clamp(28px, 4vw, 42px); line-height: 1.15; font-weight: 700; margin: 0 0 16px; letter-spacing: -.01em; }
.head p { margin: 0; font-size: 16px; line-height: 1.7; color: var(--muted); }

.head, .tabs, .screen, .strip, .trio { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .tabs, .in .screen, .in .strip, .in .trio { opacity: 1; transform: none; }
.in .tabs { transition-delay: .08s; }
.in .screen { transition-delay: .16s; }
.in .strip { transition-delay: .26s; }
.in .trio { transition-delay: .36s; }

.tabs { display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.tab { all: unset; box-sizing: border-box; cursor: pointer; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 99px; background: #f3f1fa; color: var(--muted); transition: all .3s; }
.tab:hover { background: #e9e6f5; }
.tab.act { background: var(--ink); color: #fff; }
.tab:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

/* screen */
.screen { position: relative; border: 1px solid var(--line); border-radius: 22px; box-shadow: 0 24px 60px rgba(60, 50, 120, .12); overflow: hidden; min-height: 520px; background-image: linear-gradient(160deg, #f6f4ff, #eef6ff 60%, #eefaf3); }
.bar { display: flex; align-items: center; gap: 6px; padding: 12px 16px; background: #faf9ff; border-bottom: 1px solid var(--line); position: relative; z-index: 3; }
.bar > i { width: 10px; height: 10px; border-radius: 50%; background: #e3e0ee; }
.url { margin-left: 12px; font-size: 12px; color: var(--muted); background: #f1effa; padding: 5px 14px; border-radius: 99px; }
.ring { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--muted); background: #f1effa; padding: 6px 14px; border-radius: 99px; transition: all .3s; }
.ring svg { width: 14px; height: 14px; }
.ring.on { background: var(--mint); color: var(--mint-i); animation: shake .6s ease-in-out infinite; }
@keyframes shake { 0%, 100% { transform: rotate(0); } 20% { transform: rotate(-4deg); } 40% { transform: rotate(4deg); } 60% { transform: rotate(-3deg); } 80% { transform: rotate(3deg); } }

.app { display: grid; grid-template-columns: 180px 1fr; height: 470px; transition: filter .5s, opacity .5s; }
.app.dim { filter: blur(1.5px); opacity: .55; }
.app aside { background: #fff; border-right: 1px solid var(--line); padding: 18px 14px; display: flex; flex-direction: column; gap: 12px; }
.app aside b { height: 26px; width: 90px; background: var(--ink); border-radius: 8px; margin-bottom: 8px; }
.app aside i { height: 12px; border-radius: 6px; background: #ece9f3; }
.app aside i:nth-child(3) { width: 70%; }
.app aside i:nth-child(5) { width: 80%; }
.app main { padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.sk { background: #fff; border-radius: 12px; border: 1px solid var(--line); }
.sk.h { height: 22px; width: 220px; background: #ece9f3; border: 0; }
.cards3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.cards3 .sk { height: 86px; }
.sk.row { height: 46px; }

/* ringing banner */
.banner { position: absolute; z-index: 4; top: 64px; right: 22px; display: flex; align-items: center; gap: 14px; background: var(--ink); color: #fff; padding: 12px 18px; border-radius: 16px; box-shadow: 0 18px 40px rgba(0, 0, 0, .25); }
.banner strong { display: block; font-size: 14px; }
.banner span { font-size: 11px; opacity: .75; }
.wave { display: flex; align-items: center; gap: 3px; height: 22px; }
.wave i { width: 4px; border-radius: 2px; background: #5ee0a0; animation: bar .8s ease-in-out infinite alternate; }
.wave i:nth-child(1) { height: 10px; }
.wave i:nth-child(2) { height: 20px; animation-delay: .2s; }
.wave i:nth-child(3) { height: 14px; animation-delay: .4s; }
@keyframes bar { to { transform: scaleY(.4); } }

/* pop-up */
.pop { position: absolute; z-index: 5; top: 64px; right: 22px; width: 380px; max-width: calc(100% - 44px); background: #fff; border-radius: 22px; border: 1px solid var(--line); box-shadow: 0 30px 70px rgba(40, 30, 90, .28); padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.ph { display: flex; align-items: center; gap: 12px; }
.av { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; background: var(--mint); color: var(--mint-i); display: grid; place-items: center; font-size: 18px; font-weight: 700; flex: none; }
.av.un { background: var(--butter); color: var(--butter-i); }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.id { flex: 1; min-width: 0; }
.id strong { display: block; font-size: 16px; }
.id span { font-size: 12px; color: var(--muted); }
.tag { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 99px; white-space: nowrap; }
.tag.cust { background: var(--mint); color: var(--mint-i); }
.tag.newn { background: var(--butter); color: var(--butter-i); }

.dl { margin: 0; display: flex; flex-direction: column; gap: 8px; position: relative; min-height: 20px; }
.f { display: flex; justify-content: space-between; gap: 12px; padding: 9px 12px; border-radius: 12px; background: #f8f7fc; font-size: 12px; }
.f dt { color: var(--muted); flex: none; }
.f dd { margin: 0; font-weight: 600; text-align: right; }
.f.warn { background: var(--rose); }
.f.warn dd { color: var(--rose-i); }
.hint { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; font-weight: 600; line-height: 1.5; background: var(--mint); color: var(--mint-i); padding: 10px 12px; border-radius: 12px; }
.hint svg { width: 14px; height: 14px; flex: none; margin-top: 3px; }
.hint em { font-style: normal; font-weight: 500; color: #4d7a66; }
.none { margin: 0; font-size: 13px; color: var(--muted); background: #f8f7fc; padding: 12px 14px; border-radius: 12px; line-height: 1.5; }
.done { display: flex; align-items: center; gap: 12px; background: var(--mint); padding: 12px 14px; border-radius: 12px; }
.done svg { width: 28px; height: 28px; padding: 6px; border-radius: 50%; background: var(--mint-i); color: #fff; flex: none; }
.done strong { display: block; font-size: 13px; color: var(--mint-i); }
.done span { font-size: 11px; color: var(--muted); }

.act { display: flex; gap: 8px; }
.btn { flex: 1; text-align: center; font-size: 13px; font-weight: 600; padding: 11px 16px; border-radius: 99px; background: var(--ink); color: #fff; transition: all .3s; }
.btn.ghost { flex: 0 0 auto; background: #fff; color: var(--ink); border: 1px solid var(--ink); }
.btn.live { background: var(--mint-i); }
.btn.press { transform: scale(.95); background: #000; box-shadow: 0 0 0 4px var(--lav); }
.btn.off { background: #f1effa; color: var(--muted); }

.drop-enter-active, .drop-leave-active { transition: all .4s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-14px); }
.pop-enter-active { transition: all .5s cubic-bezier(.2, 1.2, .4, 1); }
.pop-leave-active { transition: all .25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(-14px) scale(.96); }
.fld-enter-active { transition: all .45s ease; }
.fld-enter-from { opacity: 0; transform: translateY(8px); }

/* the six things the pop-up shows */
.strip { list-style: none; margin: 24px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.strip li { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 20px; background: #f8f7fc; opacity: .6; transition: opacity .45s, background .45s, transform .5s cubic-bezier(.3, 1.5, .5, 1); }
.strip li.lit { opacity: 1; transform: translateY(-2px); }
.strip .lav.lit { background: var(--lav); }
.strip .sky.lit { background: var(--sky); }
.strip .mint.lit { background: var(--mint); }
.strip .butter.lit { background: var(--butter); }
.strip .rose.lit { background: var(--rose); }
.strip .peach.lit { background: var(--peach); }
.ti { flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: #fff; color: var(--muted); transition: color .4s; }
.ti svg { width: 18px; height: 18px; }
.strip .lav.lit .ti { color: var(--lav-i); }
.strip .sky.lit .ti { color: var(--sky-i); }
.strip .mint.lit .ti { color: var(--mint-i); }
.strip .butter.lit .ti { color: var(--butter-i); }
.strip .rose.lit .ti { color: var(--rose-i); }
.strip .peach.lit .ti { color: var(--peach-i); }
.tt { display: grid; min-width: 0; }
.tt small { color: var(--muted); font-size: 11.5px; font-weight: 600; }
.tt b { font-size: 13px; font-weight: 600; letter-spacing: -.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* why it matters */
.trio { list-style: none; margin: 16px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.trio li { padding: 24px; border-radius: 26px; background: #faf9fd; border: 1px solid var(--line); transition: background .5s, border-color .5s, transform .5s cubic-bezier(.3, 1.5, .5, 1); }
.trio li.lit { transform: translateY(-3px); border-color: transparent; }
.trio .mint.lit { background: var(--mint); }
.trio .butter.lit { background: var(--butter); }
.trio .lav.lit { background: var(--lav); }
.ci { display: grid; place-items: center; width: 40px; height: 40px; margin-bottom: 16px; border-radius: 50%; background: #fff; color: var(--muted); border: 1px solid var(--line); transition: color .4s, border-color .4s; }
.ci svg { width: 18px; height: 18px; }
.trio li.lit .ci { border-color: transparent; }
.trio .mint.lit .ci { color: var(--mint-i); }
.trio .butter.lit .ci { color: var(--butter-i); }
.trio .lav.lit .ci { color: var(--lav-i); }
.trio h3 { margin: 0 0 6px; font-size: 16px; font-weight: 600; letter-spacing: -.01em; }
.trio p { margin: 0; font-size: 13.5px; line-height: 1.65; color: var(--muted); }

@media (max-width: 960px) {
  .strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .trio { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 820px) {
  .app { grid-template-columns: 1fr; }
  .app aside { display: none; }
  .pop, .banner { right: 50%; transform: translateX(50%); }
  .pop-enter-from, .pop-leave-to { transform: translateX(50%) translateY(-14px) scale(.96); }
  .drop-enter-from, .drop-leave-to { transform: translateX(50%) translateY(-14px); }
}
@media (max-width: 560px) {
  .cp { padding: 64px 16px; }
  .url { display: none; }
  .screen { min-height: 560px; }
  .strip { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .head, .tabs, .screen, .strip, .trio { opacity: 1; transform: none; transition: none; }
  .ring.on, .wave i { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
