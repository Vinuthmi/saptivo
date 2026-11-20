<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SecurityMobileSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const layers = [
  { k: "Role-based permissions", d: "A sales rep sees only the records their role allows.", r: "Limited access", c: "lav" },
  { k: "Two-factor authentication", d: "A new sign-in needs a code from the owner's second factor.", r: "Sign-in blocked", c: "sky" },
  { k: "Audit logs", d: "Every attempt is recorded for the admin to review.", r: "Attempt logged", c: "mint" },
];

const sub = computed(() => (still.value ? 11 : n.value % 12));
const cur = computed(() => Math.min(Math.floor(sub.value / 3), 3));
const done = (i) => sub.value >= (i + 1) * 3;
const act = (i) => cur.value === i;
const safe = computed(() => sub.value >= 9);
const digits = computed(() => (cur.value === 1 ? Math.min(sub.value - 2, 6) : cur.value > 1 ? 6 : 0));

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 900);
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
  <section ref="root" class="sm" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Security</span> <span class="l2">on mobile</span></h2>
        <p>
          The same role-based permissions, two-factor authentication and audit logs that protect Saptivo on the web
          apply on mobile, so a lost phone doesn't mean lost data.
        </p>
      </header>

      <div class="grid">
        <!-- lost phone -->
        <article class="lost">
          <span class="tag">Lost phone</span>
          <div class="phone" aria-hidden="true">
            <div class="notch"></div>
            <span class="lock">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            </span>
            <b>Saptivo</b>
            <small>Enter your code</small>
            <span class="pin"><i v-for="k in 6" :key="k" :class="{ on: k <= digits }"></i></span>
            <span class="st" :class="{ bad: cur >= 1 && sub >= 6 }">{{ cur >= 1 && sub >= 6 ? "Incorrect code" : "Locked" }}</span>
          </div>
        </article>

        <!-- layers -->
        <div class="layers">
          <article v-for="(l, i) in layers" :key="l.k" class="ly" :class="[l.c, { act: act(i), done: done(i) }]">
            <span class="no">
              <svg v-if="done(i)" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
              <template v-else>{{ i + 1 }}</template>
            </span>
            <div class="tx"><b>{{ l.k }}</b><small>{{ l.d }}</small></div>
            <em :class="{ vis: done(i) }">{{ l.r }}</em>
          </article>

          <div class="verdict" :class="{ ok: safe }"><i></i>{{ safe ? "Your data stays protected" : "Checking every layer" }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sm {
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
.sm *, .sm *::before, .sm *::after { box-sizing: border-box; }
.wrap { max-width: 1080px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 { white-space: nowrap; }
h2 span { display: inline; }
.sm h2 .l1 { color: #111111 !important; opacity: 1; }
.sm h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .1s; }

.grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 14px; align-items: stretch; }

.lost { background: linear-gradient(135deg, rgba(253, 231, 237, .88), rgba(255, 241, 246, .9)), url("/saptivo/images/features/data-security-and-encryption-technology-concept-2026-09-21-13-09-58-utc.webp") center / cover; border-radius: 28px; padding: 22px; display: flex; flex-direction: column; align-items: center; gap: 18px; }
.tag { align-self: flex-start; font-size: 12px; font-weight: 600; padding: 4px 14px; border-radius: 99px; background: #fff; color: var(--rose-i); }
.phone { position: relative; width: 210px; flex: 1; min-height: 340px; background: #fff; border: 6px solid var(--ink); border-radius: 30px; padding: 34px 18px 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; transform: rotate(-4deg); }
.notch { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 54px; height: 5px; border-radius: 4px; background: var(--ink); }
.lock { width: 52px; height: 52px; border-radius: 16px; background: var(--ink); color: #fff; display: grid; place-items: center; margin-bottom: 4px; }
.phone b { font-size: 15px; font-weight: 600; }
.phone small { font-size: 12px; color: var(--muted); }
.pin { display: flex; gap: 7px; margin: 8px 0 4px; }
.pin i { width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid #b9bdc4; transition: all .25s; }
.pin i.on { background: var(--ink); border-color: var(--ink); }
.st { font-size: 12px; font-weight: 600; color: var(--muted); padding: 4px 12px; border-radius: 99px; background: #f1f2f4; transition: all .3s; }
.st.bad { background: var(--rose); color: var(--rose-i); }

.layers { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.ly { display: grid; grid-template-columns: 30px minmax(0, 1fr) auto; gap: 14px; align-items: center; border-radius: 24px; padding: 20px 22px; border: 1.5px solid transparent; background: #f6f6f8; flex: 1; transition: all .4s; }
.ly.lav.act, .ly.lav.done { background: var(--lav); } .ly.sky.act, .ly.sky.done { background: var(--sky); } .ly.mint.act, .ly.mint.done { background: var(--mint); }
.ly.act { border-color: var(--ink); }
.no { width: 28px; height: 28px; border-radius: 50%; background: #fff; color: var(--muted); display: grid; place-items: center; font-size: 12.5px; font-weight: 600; transition: all .3s; }
.ly.act .no, .ly.done .no { background: var(--ink); color: #fff; }
.tx { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.tx b { font-size: 15px; font-weight: 600; }
.tx small { font-size: 13px; line-height: 1.55; color: var(--muted); }
.ly em { font-style: normal; font-size: 11.5px; font-weight: 600; padding: 4px 12px; border-radius: 6px; background: #fff; color: var(--ink); white-space: nowrap; opacity: 0; transition: opacity .4s; }
.ly em.vis { opacity: 1; }

.verdict { display: flex; align-items: center; justify-content: center; gap: 10px; border-radius: 18px; padding: 14px; font-size: 14px; font-weight: 500; background: #f1f2f4; color: var(--muted); transition: all .5s; }
.verdict i { width: 9px; height: 9px; border-radius: 50%; background: #b9bdc4; }
.verdict.ok { background: var(--ink); color: #fff; }
.verdict.ok i { background: #7be0ae; box-shadow: 0 0 0 4px rgba(123, 224, 174, .25); }

@media (max-width: 860px) {
  .grid { grid-template-columns: 1fr; }
  .phone { min-height: 300px; flex: none; }
}
@media (max-width: 640px) {
  .sm { padding: 64px 16px; }
  .lost { padding: 16px; border-radius: 22px; }
  .ly { grid-template-columns: 30px minmax(0, 1fr); padding: 16px; border-radius: 20px; }
  .ly em { grid-column: 2; justify-self: start; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  .phone { transform: none; }
  * { transition-duration: 0s !important; }
}
</style>
