<template>
  <section id="top" ref="hero" class="hero" aria-labelledby="hero-title">
    <!-- dotted pattern at the top (same as the footer) -->
    <span class="dots" aria-hidden="true"></span>

    <div class="top">
    <div class="content">
      <h1 id="hero-title">
        Manage and automate your
        <span class="accent">CRM, your way.</span>
      </h1>

      <p class="lead">
        Saptivo is the all-in-one cloud CRM that brings your customers,
        conversations and team into one connected workspace. Capture every
        lead, answer every WhatsApp message, log every phone call and turn
        quotations into invoices in one click.<br> Built by a Colombo software
        house with more than 25 years of experience, Saptivo is the CRM
        software Sri Lanka businesses use to sell faster and serve customers
        better.
      </p>

      <div class="actions">
        <a href="mailto:hello@saptivo.com?subject=Start%20my%2014-day%20free%20trial" class="btn btn-primary">
          Start free for 14 days
        </a>
        <a href="mailto:hello@saptivo.com?subject=Book%20a%20Saptivo%20demo" class="btn btn-outline">Book a demo</a>
      </div>
      <p class="support">No setup fee · No upgrade fees · No credit card required</p>
    </div>
    </div>

    <!-- demo video: starts as a rounded card, grows to full width as you scroll -->
    <div ref="stage" class="stage">
      <div
        ref="card"
        class="hero-card"
        :class="{ hovering: hover }"
        :style="{ '--p': progress }"
        @pointerenter="onEnter"
        @pointermove="onMove"
        @pointerleave="hover = false"
      >
        <video
          ref="demoVideo"
          class="hero-video"
          :src="heroDemoVideo"
          :poster="heroDemoPoster"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          @play="playing = true"
          @pause="playing = false"
        ></video>
        <button
          type="button"
          class="vid-pill"
          :style="{ '--x': cx + 'px', '--y': cy + 'px' }"
          :aria-label="playing ? 'Pause video' : 'Play video'"
          @click="toggle"
        >
          <span class="vp-ic" aria-hidden="true">
            <svg v-if="playing" viewBox="0 0 24 24"><path d="M9 5v14M15 5v14" /></svg>
            <svg v-else viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" /></svg>
          </span>
          {{ playing ? "Pause Video" : "Play Video" }}
        </button>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "HeroSection" });

// Put your files in public/videos/ (or change these paths)
const heroDemoVideo = "https://public-assets.content-platform.envatousercontent.com/b988f3ac-00c7-49e0-947e-5f2743e6ea8d/d47db0a7-fe33-45c5-b831-412229fb0b2e/b988f3ac-00c7-49e0-947e-5f2743e6ea8d/preview_540p_crf22_higher_quality.mp4"; // demo video shown in the rounded card
const heroDemoPoster = `${import.meta.env.BASE_URL}images/hero-demo-poster.jpg`; // optional still shown until the video starts

const bgVideo = ref(null);
const demoVideo = ref(null);
const hero = ref(null);
const stage = ref(null);
const card = ref(null);
const pull = ref(0);
const progress = ref(0);
const playing = ref(true);
const videoOk = ref(true);

let userPaused = false;
function toggle() {
  const v = demoVideo.value;
  if (!v) return;
  if (v.paused) {
    userPaused = false;
    v.play().catch(() => {});
  } else {
    userPaused = true;
    v.pause();
  }
}

// custom "Pause Video" pill that follows the mouse over the card
const cx = ref(0);
const cy = ref(0);
const hover = ref(false);
let tx = 0;
let ty = 0;
let rafC = null;
function local(e) {
  const r = card.value.getBoundingClientRect();
  tx = e.clientX - r.left;
  ty = e.clientY - r.top;
}
function follow() {
  cx.value += (tx - cx.value) * 0.22;
  cy.value += (ty - cy.value) * 0.22;
  rafC = Math.abs(tx - cx.value) + Math.abs(ty - cy.value) > 0.5 ? requestAnimationFrame(follow) : null;
}
function onEnter(e) {
  if (e.pointerType !== "mouse") return;
  local(e);
  cx.value = tx;
  cy.value = ty;
  hover.value = true;
}
function onMove(e) {
  if (e.pointerType !== "mouse") return;
  local(e);
  hover.value = true;
  if (rafC === null) rafC = requestAnimationFrame(follow);
}

// scroll: 0 = rounded card inside the page, 1 = full width
let ticking = false;
let raf = null;
let io = null;
function update() {
  const el = card.value;
  if (el) {
    const vh = window.innerHeight;
    const top = el.getBoundingClientRect().top;
    const p = (vh * 0.92 - top) / (vh * 0.62);
    progress.value = Math.min(Math.max(p, 0), 1);
  }
  ticking = false;
}
function onScroll() {
  if (ticking) return;
  ticking = true;
  raf = requestAnimationFrame(update);
}

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    userPaused = true;
    bgVideo.value?.pause();
    demoVideo.value?.pause();
    return;
  }
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // play the demo only while it is on screen (saves battery / CPU)
  io = new IntersectionObserver(
    ([e]) => {
      const v = demoVideo.value;
      if (!v || userPaused) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    },
    { threshold: 0.15 }
  );
  if (card.value) io.observe(card.value);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  if (raf !== null) cancelAnimationFrame(raf);
  if (rafC !== null) cancelAnimationFrame(rafC);
  io?.disconnect();
});
</script>

<style scoped>
.hero {
  --orange: #ff6338;
  --orange-deep: #f04b23;
  --ink: #17191d;
  --paper: #fff;
  --muted: #5d6068;
  --title: clamp(46px, 4.2vw, 104px);

  --top0: clamp(20px, 3vw, 40px); /* gap between the buttons and the video */
  --w0: min(1180px, calc(100vw - 40px));

  position: relative;
  isolation: isolate;
  overflow: clip; /* "hidden" would break the sticky video */
  padding-bottom: 0;
  text-align: center;
  color: var(--ink);
  background: var(--paper);
  font-family: 'Urbanist', system-ui, sans-serif;
}
.hero *, .hero *::before, .hero *::after { box-sizing: border-box; }
.hero a:focus-visible, .hero button:focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }

.top { position: relative; z-index: 1; }

/* ---------- dotted top background (same pattern as the footer) ---------- */
.dots {
  position: absolute; top: 0; left: 0; right: 0; z-index: 0; pointer-events: none;
  height: min(100%, 680px);
  background-image: radial-gradient(circle, rgba(23, 25, 29, 0.42) 1px, transparent 1.4px);
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(ellipse 85% 100% at 50% 0%, #000 0%, rgba(0, 0, 0, 0.5) 55%, transparent 95%);
  mask-image: radial-gradient(ellipse 85% 100% at 50% 0%, #000 0%, rgba(0, 0, 0, 0.5) 55%, transparent 95%);
}


/* ---------- content ---------- */
.content {
  display: flex; flex-direction: column; align-items: center;
  width: min(1040px, calc(100% - 40px)); margin: 0 auto;
  padding: 112px 0 28px;
}
h1 {
  margin: 0;
  font-family: Urbanist, "Urbanist Placeholder", sans-serif;
  font-size: clamp(60px, 5vw, 72px);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -1px;
  color: #0a0a0a80;
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.accent {
  display: block;
  width: fit-content;
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em;
  color: #615f5a;
}
.lead {
  max-width: 760px; margin: 24px 0 0;
  font-size: 16px; line-height: 1.7; color: #4a4d55;
  animation: rise 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.actions {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 36px;
  animation: rise 0.9s 0.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.support {
  margin: 18px 0 0; font-size: 13.5px; line-height: 1.5; color: #5b5e66;
  animation: rise 0.9s 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 12px;
  min-height: 54px; padding: 0 24px; border-radius: 12px;
  text-decoration: none; font-size: 15px; font-weight: 600;
  transition: transform 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.btn-primary { color: #fff; background: linear-gradient(180deg, #ff7a45, #f2531f); box-shadow: inset 0 0 0 1px rgba(255,255,255,.35), 0 10px 24px rgba(240,75,35,.3); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px rgba(255,255,255,.4), 0 16px 32px rgba(240,75,35,.4); }
.hero .actions .btn-primary {
  color: #fff !important;
  background: #17191d !important;
  border: 1px solid #17191d !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18) !important;
}
.hero .actions .btn-primary:hover {
  background: #000 !important;
  border-color: #000 !important;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.24) !important;
}
.arrow { display: inline-block; transition: transform 0.25s; }
.btn-primary:hover .arrow { transform: rotate(45deg); }
.btn-outline { color: #fff; background: #0b0c0e; box-shadow: inset 0 0 0 1px rgba(255,255,255,.14), 0 10px 24px rgba(0,0,0,.18); }
.btn-outline:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px rgba(255,255,255,.28), 0 16px 32px rgba(0,0,0,.28); }
.hero .actions .btn-outline {
  color: #17191d !important;
  background: #fff !important;
  border: 1px solid #17191d !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08) !important;
}
.hero .actions .btn-outline:hover {
  color: #17191d !important;
  background: #f5f5f5 !important;
  border-color: #000 !important;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.14) !important;
}

/* ---------- stage ---------- */
.stage { position: relative; padding-top: var(--top0); }

/* ---------- demo video: rounded card -> full width while scrolling ---------- */
.hero-card {
  --p: 0;
  position: relative; z-index: 1; isolation: isolate; overflow: hidden;
  width: calc(var(--w0) + (100% - var(--w0)) * var(--p));
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  max-height: 92svh;
  background: linear-gradient(135deg, #1d2230, #0b0c0e); /* shows until the video loads (or if the file is missing) */
  border-radius: calc(44px - 12px * var(--p));
  will-change: width;
}
.hero-video { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; user-select: none; }

/* "Pause Video" pill: follows the mouse on desktop, sits bottom-right on touch / keyboard */
.vid-pill {
  position: absolute; left: 0; top: 0; z-index: 2;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 16px 9px 10px; border: 0; border-radius: 999px;
  background: rgba(255, 255, 255, 0.94); color: #17191d;
  font: 600 13px/1 'Urbanist', system-ui, sans-serif; white-space: nowrap;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transform: translate(calc(var(--x) - 50%), calc(var(--y) - 50%)) scale(0.8);
  opacity: 0; pointer-events: none;
  transition: opacity 0.25s, scale 0.25s;
}
.hero-card.hovering .vid-pill { opacity: 1; pointer-events: auto; transform: translate(calc(var(--x) - 50%), calc(var(--y) - 50%)) scale(1); }
.vp-ic { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #17191d; color: #fff; }
.vp-ic svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
@media (hover: hover) and (pointer: fine) { .hero-card.hovering { cursor: none; } .hero-card.hovering .vid-pill { cursor: none; } }
.vid-pill:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }
.hero-card:not(.hovering) .vid-pill:focus-visible,
.hero-card:not(.hovering) .vid-pill:focus {
  opacity: 1; pointer-events: auto; transform: none; left: auto; top: auto; right: 16px; bottom: 16px;
}
@media (hover: none), (pointer: coarse) {
  .vid-pill { opacity: 1; pointer-events: auto; transform: none; left: auto; top: auto; right: 12px; bottom: 12px; padding: 8px 14px 8px 8px; }
}

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .content { padding-top: 96px; }
}
@media (max-width: 760px) {
  .hero { --top0: 24px; --w0: calc(100vw - 24px); --title: clamp(38px, 10.5vw, 64px); padding-bottom: 0; }
  .content { width: calc(100% - 32px); padding: 76px 0 24px; }
  h1 { font-size: clamp(40px, 9vw, 58px); }
  .lead { font-size: 15px; margin-top: 22px; }
  .actions { width: 100%; gap: 10px; margin-top: 28px; }
  .dots { background-size: 20px 20px; }
  .btn { min-height: 50px; padding: 0 20px; font-size: 14px; }
  .hero-card { max-height: none; }
}
@media (max-width: 380px) {
  .actions { flex-direction: column; align-items: stretch; }
}
@media (prefers-reduced-motion: reduce) {
  h1, .lead, .actions, .support { animation: none; }
  .hero-card { width: var(--w0); }
}
</style>