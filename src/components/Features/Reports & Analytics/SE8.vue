<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "RoleReportsSection" });

const root = ref(null);
const track = ref(null);
const shown = ref(false);
const idx = ref(0);
const manual = ref(false);
const still = ref(false);
const ok = ref([true, true, true, true, true]);
let timer = null;
let io = null;
let reduce = false;
let lock = 0;

const base = "/saptivo/images/features/";
const man = base + "professional-man-reviewing-financial-pie-charts-on-2026-11-02-15-56-21-utc.webp";
const woman = base + "business-professionals-working-with-laptops-in-off-2026-09-21-05-32-47-utc.webp";
const photos = [woman, base + "smiling-coworkers-reviewing-photos-on-computer-scr-2026-09-21-14-07-13-utc.webp", base + "business-women-in-casual-meeting-at-work-cafe-2026-09-23-22-08-41-utc.webp", base + "smiling-women-discussing-documents-on-staircase-in-2026-09-24-06-33-04-utc.webp", man];
const pos = ["center 20%", "center 20%", "center", "center", "center 65%"];

const roles = [
  { r: "Sales reps", t: "My pipeline, my tasks today and my progress against quota", tone: "lav" },
  { r: "Sales managers", t: "Team pipeline, conversion by stage and activity by rep", tone: "sky" },
  { r: "Branch managers", t: "Sales, stock and staff performance for their branch", tone: "mint" },
  { r: "Service managers", t: "Jobs completed, SLA compliance and first-time fix rate", tone: "butter" },
  { r: "Owners and directors", t: "Company revenue, margin, forecast and branch comparison", tone: "rose" },
];

function step() {
  const el = track.value;
  const c = el && el.children[0];
  return c ? c.offsetWidth + 18 : 0;
}
function go(i, user) {
  const n = roles.length;
  const k = (i + n) % n;
  idx.value = k;
  if (user) {
    manual.value = true;
    stopAuto();
  }
  const el = track.value;
  if (!el) return;
  lock = Date.now() + 800;
  el.scrollTo({ left: k * step(), behavior: reduce ? "auto" : "smooth" });
}
function onScroll() {
  if (Date.now() < lock) return;
  const s = step();
  if (!s) return;
  const k = Math.max(0, Math.min(roles.length - 1, Math.round(track.value.scrollLeft / s)));
  if (k !== idx.value) idx.value = k;
  if (!manual.value) {
    manual.value = true;
    stopAuto();
  }
}
function startAuto() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(() => go(idx.value + 1, false), 3400);
}
function stopAuto() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    still.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        startAuto();
      } else stopAuto();
    },
    { threshold: 0.25 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stopAuto();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="rr" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Reports for</span> <span class="l2">every role</span></h2>
      </header>
    </div>

    <div ref="track" class="track" @scroll.passive="onScroll">
      <article v-for="(r, i) in roles" :key="r.r" class="cd" :class="[r.tone, { act: idx === i || still }]">
        <figure class="ph">
          <img v-if="ok[i]" :src="photos[i]" :style="{ objectPosition: pos[i] }" alt="" @error="ok[i] = false" />
          <span class="no">{{ i + 1 }}</span>
        </figure>

        <div class="tx">
          <h3>{{ r.r }}</h3>
          <p>{{ r.t }}</p>
        </div>

        <div class="viz" aria-hidden="true">
          <!-- reps -->
          <template v-if="i === 0">
            <div class="ring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" class="bg" /><circle cx="20" cy="20" r="16" class="fg" /></svg><b>68%</b></div>
            <div class="ls"><span><i class="d"></i>Call Saman</span><span><i></i>Send AMC proposal</span><span><i></i>Site visit, Kandy</span></div>
          </template>
          <!-- sales managers -->
          <template v-else-if="i === 1">
            <div class="fn"><i style="--w: 100%"></i><i style="--w: 68%"></i><i style="--w: 41%"></i><i style="--w: 22%"></i></div>
            <div class="lb"><span>Lead</span><span>Qualified</span><span>Proposal</span><span>Won</span></div>
          </template>
          <!-- branch -->
          <template v-else-if="i === 2">
            <div class="tl"><span><small>Sales</small><b>8.9M</b></span><span><small>Stock</small><b>1,240</b></span><span><small>Staff</small><b>92%</b></span></div>
          </template>
          <!-- service -->
          <template v-else-if="i === 3">
            <div class="mt"><span>SLA compliance</span><span class="tk"><i style="--w: 96%"></i></span><b>96%</b></div>
            <div class="mt"><span>First-time fix</span><span class="tk"><i style="--w: 88%"></i></span><b>88%</b></div>
          </template>
          <!-- owner -->
          <template v-else>
            <svg class="sp" viewBox="0 0 100 30" preserveAspectRatio="none"><polyline points="0,26 20,22 40,24 60,15 80,12 100,4" /></svg>
            <div class="br"><i style="--w: 100%"></i><i style="--w: 62%"></i><i style="--w: 44%"></i></div>
          </template>
        </div>
      </article>
    </div>

    <div class="wrap">
      <div class="ctl">
        <div class="dots"><button v-for="(r, i) in roles" :key="r.r" type="button" :aria-label="r.r" :class="{ on: i === idx }" @click="go(i, true)"></button></div>
        <div class="arrows">
          <button type="button" aria-label="Previous role" @click="go(idx - 1, true)"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg></button>
          <button type="button" aria-label="Next role" @click="go(idx + 1, true)"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg></button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rr {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  --pad: max(16px, calc((100vw - 1160px) / 2));
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 0;
  overflow: hidden;
}
.rr *, .rr *::before, .rr *::after { box-sizing: border-box; }
.wrap { max-width: 1160px; margin: 0 auto; padding: 0 16px; }
.head { text-align: center; max-width: 820px; margin: 0 auto 44px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.rr h2 .l1 { color: #111111 !important; opacity: 1; }
.rr h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.head, .track, .ctl { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .track, .in .ctl { opacity: 1; transform: none; }
.in .track { transition-delay: .08s; }

.track { display: flex; gap: 18px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 4px var(--pad) 8px; scroll-padding-left: var(--pad); scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.track::-webkit-scrollbar { display: none; }

.cd { flex: 0 0 min(390px, 82vw); scroll-snap-align: start; border-radius: 30px; padding: 12px; display: flex; flex-direction: column; gap: 16px; border: 1.5px solid transparent; transition: border-color .3s; }
.cd.act { border-color: var(--ink); }
.cd.lav { background: var(--lav); } .cd.sky { background: var(--sky); } .cd.mint { background: var(--mint); }
.cd.butter { background: var(--butter); } .cd.rose { background: var(--rose); }

.ph { position: relative; margin: 0; height: 200px; border-radius: 20px; overflow: hidden; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.no { position: absolute; top: 12px; left: 12px; width: 28px; height: 28px; border-radius: 50%; background: #fff; display: grid; place-items: center; font-size: 12.5px; font-weight: 600; transition: all .3s; }
.act .no { background: var(--ink); color: #fff; }

.tx { padding: 0 10px; }
h3 { margin: 0 0 6px; font-size: 21px; font-weight: 500; letter-spacing: -.02em; }
.tx p { margin: 0; font-size: 14.5px; line-height: 1.65; color: #3a3f47; }

.viz { margin: auto 0 0; background: #fff; border-radius: 18px; padding: 14px 16px; min-height: 108px; display: flex; flex-direction: column; justify-content: center; gap: 10px; font-size: 12.5px; color: var(--muted); }

.rr .viz:has(.ring) { flex-direction: row; align-items: center; gap: 16px; }
.ring { position: relative; width: 70px; height: 70px; flex: none; }
.ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring circle { fill: none; stroke-width: 4; }
.ring .bg { stroke: #eef1f4; }
.ring .fg { stroke: var(--lav-i); stroke-linecap: round; stroke-dasharray: 100.5; stroke-dashoffset: 100.5; transition: stroke-dashoffset 1.2s cubic-bezier(.2, .8, .2, 1); }
.act .ring .fg { stroke-dashoffset: 32; }
.ring b { position: absolute; inset: 0; display: grid; place-items: center; font-size: 15px; font-weight: 600; color: var(--ink); }
.ls { display: flex; flex-direction: column; gap: 6px; }
.ls span { display: flex; align-items: center; gap: 8px; color: var(--ink); }
.ls i { width: 13px; height: 13px; border-radius: 4px; border: 1.5px solid #cfd2d8; flex: none; }
.ls i.d { background: var(--mint-i); border-color: var(--mint-i); }

.fn { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.fn i { display: block; height: 12px; width: 20%; border-radius: 6px; background: var(--sky-i); opacity: .85; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.act .fn i { width: var(--w); }
.lb { display: flex; justify-content: space-between; font-size: 11px; }

.tl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.tl span { background: #f6f7f9; border-radius: 12px; padding: 10px 12px; display: flex; flex-direction: column; }
.tl small { font-size: 11.5px; color: var(--muted); }
.tl b { font-size: 18px; font-weight: 600; color: var(--ink); }

.mt { display: grid; grid-template-columns: 100px 1fr 38px; gap: 10px; align-items: center; }
.mt b { text-align: right; color: var(--ink); font-weight: 600; }
.tk { height: 8px; border-radius: 4px; background: #eef1f4; overflow: hidden; }
.tk i { display: block; height: 100%; width: 0; background: #d8b13a; border-radius: 4px; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.act .tk i { width: var(--w); }

.sp { width: 100%; height: 34px; overflow: visible; }
.sp polyline { fill: none; stroke: var(--ink); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease; }
.act .sp polyline { stroke-dashoffset: 0; }
.br { display: flex; flex-direction: column; gap: 5px; }
.br i { display: block; height: 7px; width: 10%; border-radius: 4px; background: var(--rose-i); opacity: .8; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.act .br i { width: var(--w); }

.ctl { max-width: 1160px; margin: 24px auto 0; padding: 0 0; display: flex; justify-content: space-between; align-items: center; }
.wrap .ctl { padding: 0; }
.dots { display: flex; gap: 8px; }
.dots button { all: unset; cursor: pointer; width: 8px; height: 8px; border-radius: 99px; background: #d3d6db; transition: all .3s; }
.dots button.on { width: 28px; background: var(--ink); }
.dots button:focus-visible, .arrows button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.arrows { display: flex; gap: 8px; }
.arrows button { all: unset; cursor: pointer; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; transition: all .2s; }
.arrows button:hover { background: var(--ink); color: #fff; border-color: var(--ink); }

@media (max-width: 640px) {
  .rr { padding: 64px 0; }
  .ph { height: 170px; }
  .cd { border-radius: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .track, .ctl { opacity: 1; transform: none; transition: none; }
  .track { scroll-behavior: auto; }
  * { transition-duration: 0s !important; }
}
</style>
