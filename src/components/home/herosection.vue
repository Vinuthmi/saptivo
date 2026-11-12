<template>
  <section id="top" ref="hero" class="hero" aria-labelledby="hero-title" @click="onHeroClick">
    <!-- background video -->
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
      aria-hidden="true"
      tabindex="-1"
      @play="playing = true"
      @pause="playing = false"
    ></video>
    <span class="shade" aria-hidden="true"></span>
    <!-- dotted pattern on the left and right sides -->
    <span class="dots" aria-hidden="true"></span>

    <div class="content">
      <h1 id="hero-title">
        Manage and automate your
        <span class="accent">CRM, your way.</span>
      </h1>

      <p class="lead">
        Saptivo is the all-in-one cloud CRM that brings your customers,
        conversations and team into one connected workspace. Capture every
        lead, answer every WhatsApp message, log every phone call and turn
        quotations into invoices in one click. Built by a Colombo software
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

  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "HeroSection" });

// Put your files in public/videos/ (or change these paths)
const heroDemoVideo = "https://public-assets.content-platform.envatousercontent.com/b988f3ac-00c7-49e0-947e-5f2743e6ea8d/d47db0a7-fe33-45c5-b831-412229fb0b2e/b988f3ac-00c7-49e0-947e-5f2743e6ea8d/preview_540p_crf22_higher_quality.mp4"; // background video
const heroDemoPoster = `${import.meta.env.BASE_URL}images/hero-demo-poster.jpg`; // optional still shown until the video starts

const hero = ref(null);
const demoVideo = ref(null);
const playing = ref(true);

let userPaused = false;
let io = null;
let raf = 0;
let onScroll = null;

// click the video (anywhere on the hero except links / buttons) to pause or play it
function onHeroClick(e) {
  if (e.target.closest("a, button")) return;
  toggle();
}

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

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // round the bottom corners of the video as the page scrolls down
  const el = hero.value;
  const maxR = () => parseFloat(getComputedStyle(el).getPropertyValue("--r-max")) || 48;
  const setRadius = () => {
    raf = 0;
    const p = Math.min(Math.max(window.scrollY / (el.offsetHeight * 0.45), 0), 1);
    el.style.setProperty("--r", `${(reduce ? 1 : p) * maxR()}px`);
  };
  onScroll = () => { if (!raf) raf = requestAnimationFrame(setRadius); };
  setRadius();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  if (reduce) {
    userPaused = true;
    demoVideo.value?.pause();
    return;
  }

  // play only while the hero is on screen (saves battery / CPU)
  io = new IntersectionObserver(
    ([e]) => {
      const v = demoVideo.value;
      if (!v || userPaused) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    },
    { threshold: 0.1 }
  );
  if (hero.value) io.observe(hero.value);
});
onBeforeUnmount(() => {
  io?.disconnect();
  if (onScroll) {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  }
  cancelAnimationFrame(raf);
});
</script>

<style scoped>
.hero {
  --orange: #ff6338;
  --ink: #17191d;
  --r-max: clamp(28px, 4.2vw, 64px);

  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: max(640px, 100svh);
  padding: 120px 0 96px;
  text-align: center;
  color: #fff;
  background: #0b0c0e; /* shows until the video loads */
  /* bottom corners round off as you scroll down (--r is set from the script) */
  border-radius: 0 0 var(--r, 0px) var(--r, 0px);
  font-family: 'Urbanist', system-ui, sans-serif;
  cursor: pointer; /* click to pause / play the video */
}
.hero *, .hero *::before, .hero *::after { box-sizing: border-box; }
.hero a { cursor: pointer; }
.hero a:focus-visible, .hero button:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }

/* ---------- background video ---------- */
.hero-video {
  position: absolute; inset: 0; z-index: 0;
  display: block; width: 100%; height: 100%;
  object-fit: cover; user-select: none; pointer-events: none;
}
/* dark wash so the text stays readable on any frame */
.shade {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background:
    linear-gradient(180deg, rgba(8, 10, 14, 0.44) 0%, rgba(8, 10, 14, 0.32) 45%, rgba(8, 10, 14, 0.52) 100%);
}

/* ---------- dotted pattern on the sides (the middle stays clear) ---------- */
.dots {
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.36) 1px, transparent 1.4px);
  background-size: 22px 22px;
  -webkit-mask-image: linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.55) 14%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.55) 86%, #000 100%);
  mask-image: linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.55) 14%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.55) 86%, #000 100%);
}

/* ---------- content ---------- */
.content {
  position: relative; z-index: 3;
  display: flex; flex-direction: column; align-items: center;
  width: min(1040px, calc(100% - 40px)); margin: 0 auto;
}
h1 {
  margin: 0;
  font-family: Urbanist, "Urbanist Placeholder", sans-serif;
  font-size: clamp(60px, 5vw, 72px);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -1px;
  color: #fff;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35);
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
/* force white even if a global heading style exists */
.hero h1#hero-title {
  color: #fff !important;
  background: none !important;
  -webkit-text-fill-color: #fff !important;
  text-shadow: none;
  opacity: 1 !important;
}
.hero h1#hero-title .accent {
  color: #fff !important;
  background: none !important;
  -webkit-text-fill-color: #fff !important;
}
.accent {
  color: #fff !important;
  background: none !important;
  -webkit-text-fill-color: #fff !important;
  text-shadow: none;
  opacity: 1 !important;
}
.accent {
  display: block;
  width: fit-content;
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em;
  color: inherit;
}
.lead {
  max-width: 760px; margin: 24px 0 0;
  font-size: 16px; line-height: 1.7; color: #fff;
  text-shadow: 0 1px 14px rgba(0, 0, 0, 0.4);
  animation: rise 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.actions {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 36px;
  animation: rise 0.9s 0.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.support {
  margin: 18px 0 0; font-size: 13.5px; line-height: 1.5; color: #fff;
  animation: rise 0.9s 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 12px;
  min-height: 54px; padding: 0 24px; border-radius: 12px;
  text-decoration: none; font-size: 15px; font-weight: 600;
  transition: transform 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s, color 0.2s;
}
.btn:hover { transform: translateY(-2px); }
.hero .actions .btn-primary {
  color: #fff !important;
  background: linear-gradient(135deg, #f26a1b 0%, #cf440a 100%) !important;
  border: 1px solid transparent !important;
  box-shadow: none !important;
}
.hero .actions .btn-primary:hover {
  background: linear-gradient(135deg, #f97b2d 0%, #dc4c0d 100%) !important;
  box-shadow: none !important;
}
.hero .actions .btn-outline {
  color: #fff !important;
  background: #000 !important;
  border: 1px solid #000 !important;
  box-shadow: none !important;
}
.hero .actions .btn-outline:hover {
  background: #1a1a1a !important;
  border-color: #1a1a1a !important;
  box-shadow: none !important;
}

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .hero { padding: 104px 0 88px; }
}
@media (max-width: 760px) {
  .dots { background-size: 20px 20px; }
  .hero { min-height: max(600px, 92svh); padding: 92px 0 84px; }
  .content { width: calc(100% - 32px); }
  h1 { font-size: clamp(40px, 9vw, 58px); }
  .lead { font-size: 15px; margin-top: 22px; }
  .actions { width: 100%; gap: 10px; margin-top: 28px; }
  .btn { min-height: 50px; padding: 0 20px; font-size: 14px; }
}
@media (max-width: 380px) {
  .actions { flex-direction: column; align-items: stretch; }
}
@media (prefers-reduced-motion: reduce) {
  h1, .lead, .actions, .support { animation: none; }
  .btn { transition: none; }
}
</style>