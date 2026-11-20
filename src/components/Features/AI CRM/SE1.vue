<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "LeadScoringSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "woman-checking-in-at-hotel-reception-desk-2026-09-23-00-07-03-utc.webp";

const sub = computed(() => (reduce ? 8 : n.value % 10));
const reengaged = computed(() => sub.value >= 3);
const alertOn = computed(() => sub.value >= 4 && sub.value <= 8);

const leads = computed(() => {
  const list = [
    { id: "d", n: "Dilani Perera", s: "Website form", sc: 92 },
    { id: "k", n: "Kasun Jay", s: "Facebook", sc: 78 },
    { id: "a", n: "Ayesha Raheem", s: "Referral", sc: 55 },
    { id: "s", n: "Saman Silva", s: "Trade show", sc: reengaged.value ? 71 : 34, note: reengaged.value ? "Opened your email" : "" },
  ];
  return list.sort((x, y) => y.sc - x.sc);
});
function tag(sc) {
  return sc >= 70 ? "Hot" : sc >= 45 ? "Warm" : "Cold";
}

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1000);
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
  <section ref="root" class="ls" :class="{ in: shown }">
    <div class="wrap">
      <div class="copy">
        <h2><span class="l1">AI lead scoring</span> <span class="l2">and prioritisation</span></h2>
        <p>
          Every lead gets a score from 0 to 100 that reflects how likely it is to convert, updated in real time. Reps
          see a ranked to-do list each morning and a plain explanation of why a lead is hot. When a cold lead
          re-engages, for example by opening an email, the rep is alerted. AI lead scoring retrains on your own closed
          deals.
        </p>

        <div class="card">
          <div class="ch">
            <strong>Today's ranked to-do list</strong>
            <span class="live"><i></i>Updated in real time</span>
          </div>

          <TransitionGroup name="rk" tag="ul" class="list">
            <li v-for="(l, i) in leads" :key="l.id" :class="{ top: i === 0 }">
              <span class="no">{{ i + 1 }}</span>
              <span class="av">{{ l.n.charAt(0) }}</span>
              <span class="nm">
                <b>{{ l.n }}</b>
                <small>{{ l.note || l.s }}</small>
              </span>
              <span class="sc">
                <span class="bar"><i :class="tag(l.sc).toLowerCase()" :style="{ width: l.sc + '%' }"></i></span>
                <b>{{ l.sc }}</b>
              </span>
              <em :class="tag(l.sc).toLowerCase()">{{ tag(l.sc) }}</em>
            </li>
          </TransitionGroup>

          <div class="why">
            <small>Why Dilani is hot</small>
            <p>Opened 3 emails this week, visited the pricing page twice and asked about an AMC plan.</p>
          </div>

          <div class="ft"><i></i>Retrained on your own closed deals</div>
        </div>
      </div>

      <figure class="ph">
        <img v-if="ok" :src="photo" alt="" @error="ok = false" />
        <Transition name="al">
          <div v-if="alertOn" class="alert">
            <span class="bell">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.300 21a1.940 1.940 0 0 0 3.400 0" /></svg>
            </span>
            <div><strong>Saman opened your email</strong><small>Cold lead re-engaged. Score is now 71.</small></div>
          </div>
        </Transition>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.ls {
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
.ls *, .ls *::before, .ls *::after { box-sizing: border-box; }
.wrap { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr); gap: 48px; align-items: stretch; }

.copy, .ph { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .copy, .in .ph { opacity: 1; transform: none; }
.in .ph { transition-delay: .12s; }

h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.ls h2 .l1 { color: #111111 !important; opacity: 1; }
.ls h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.copy > p { margin: 0 0 28px; font-size: 16px; line-height: 1.75; color: var(--muted); }

.card { background: var(--lav); border-radius: 28px; padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.ch { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; padding: 4px 6px 0; }
.ch strong { font-size: 14.5px; font-weight: 600; }
.live { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 500; color: var(--muted); }
.live i { width: 8px; height: 8px; border-radius: 50%; background: var(--mint-i); }

.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; position: relative; }
.list li { display: grid; grid-template-columns: 22px 36px minmax(0, 1fr) 138px 54px; align-items: center; gap: 12px; background: #fff; border-radius: 16px; padding: 10px 14px; border: 1.5px solid transparent; }
.list li.top { border-color: var(--ink); }
.no { font-size: 12.5px; font-weight: 600; color: var(--muted); }
.av { width: 36px; height: 36px; border-radius: 50%; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-size: 13px; font-weight: 700; }
.nm { display: flex; flex-direction: column; min-width: 0; }
.nm b { font-size: 13.5px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nm small { font-size: 11.5px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sc { display: flex; align-items: center; gap: 8px; }
.sc b { width: 26px; text-align: right; font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums; }
.bar { flex: 1; height: 7px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 4px; transition: width .9s cubic-bezier(.2, .8, .2, 1), background .4s; }
.bar i.hot { background: var(--rose-i); } .bar i.warm { background: #d8b13a; } .bar i.cold { background: #9db4cc; }
em { font-style: normal; font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 6px; text-align: center; transition: all .4s; }
em.hot { background: var(--rose); color: var(--rose-i); } em.warm { background: var(--butter); color: var(--butter-i); } em.cold { background: var(--sky); color: var(--sky-i); }
.rk-move { transition: transform .7s cubic-bezier(.2, .8, .2, 1); }

.why { background: rgba(255, 255, 255, .6); border-radius: 16px; padding: 12px 16px; }
.why small { font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.why p { margin: 4px 0 0; font-size: 13.5px; line-height: 1.6; }
.ft { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--muted); padding: 0 6px 2px; }
.ft i { width: 8px; height: 8px; border-radius: 2px; background: var(--ink); }

/* single image */
.ph { position: relative; margin: 0; border-radius: 32px; overflow: hidden; min-height: 680px; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.alert { position: absolute; left: 20px; right: 20px; bottom: 20px; background: #fff; border-radius: 20px; padding: 16px 18px; display: flex; align-items: center; gap: 14px; }
.bell { width: 38px; height: 38px; border-radius: 12px; background: var(--rose); color: var(--rose-i); display: grid; place-items: center; flex: none; }
.alert div { display: flex; flex-direction: column; }
.alert strong { font-size: 14px; font-weight: 600; }
.alert small { font-size: 12.5px; color: var(--muted); }
.al-enter-active, .al-leave-active { transition: opacity .4s ease, transform .5s ease; }
.al-enter-from, .al-leave-to { opacity: 0; transform: translateY(14px); }

@media (max-width: 980px) {
  .wrap { grid-template-columns: 1fr; gap: 32px; }
  .ph { min-height: 420px; }
}
@media (max-width: 640px) {
  .ls { padding: 64px 16px; }
  .card { padding: 12px; border-radius: 22px; }
  .list li { grid-template-columns: 34px minmax(0, 1fr) 30px auto; gap: 10px; }
  .no, .sc .bar { display: none; }
  .sc { justify-content: flex-end; }
  .ph { min-height: 340px; border-radius: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .copy, .ph { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
