<template>
  <section id="top" ref="hero" class="hero" aria-labelledby="hero-title">
    <div class="bg" aria-hidden="true">
      <video
        ref="bgVideo"
        class="bg-video"
        :src="heroVideo"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
      ></video>
    </div>
    <!-- dotted pattern on the top left / right sides -->
    <span class="dots dots-l" aria-hidden="true"></span>
    <span class="dots dots-r" aria-hidden="true"></span>

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

    <!-- 5 feature cards -->
    <div class="cards">
      <article class="hc hc-dark">
        <h3>Capture every lead.</h3>
        <svg class="hc-path" viewBox="0 0 120 150" aria-hidden="true">
          <path d="M20 4 C 20 40, 100 40, 100 76 S 20 100, 20 146" />
        </svg>
        <span class="hc-dot d1"></span><span class="hc-dot d2"></span>
      </article>

      <article class="hc hc-photo p1">
        <img :src="cardImg1" alt="" loading="lazy" decoding="async" />
        <p class="hc-cap"><span class="hc-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg></span>Log every phone call.</p>
      </article>

      <article class="hc hc-mint">
        <span class="hc-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.7 7L4 20l1.1-4.6A8 8 0 1 1 21 12z" /></svg></span>
        <p>Answer every WhatsApp message.</p>
      </article>

      <article class="hc hc-light">
        <h3>Turn quotations into invoices in one click.</h3>
        <div class="hc-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      </article>

      <article class="hc hc-photo p2">
        <img :src="cardImg2" alt="" loading="lazy" decoding="async" />
        <p class="hc-cap">Built by a Colombo software house with more than 25 years of experience.</p>
      </article>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "HeroSection" });

// Put your files in public/videos/ (or change these paths)
const heroVideo = `${import.meta.env.BASE_URL}videos/hero-bg.mp4`; // full-width background video
const heroDemoVideo = `${import.meta.env.BASE_URL}videos/hero-demo.mp4`; // video that replaces the dashboard photo
const heroDemoPoster = `${import.meta.env.BASE_URL}images/hero-demo-poster.jpg`; // optional still shown until the video starts

const cardImg1 = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop";
const cardImg2 = "https://images.unsplash.com/photo-1789724920013-b88079687da2?q=80&w=900&auto=format&fit=crop";

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

let ticking = false;
let raf = null;
let io = null;
function update() {
  const el = card.value;
  if (el) {
    // progress 0 → 1 while the card's top travels from 88% down the viewport to 8%
    const vh = window.innerHeight;
    const top = el.getBoundingClientRect().top;
    const p = (vh * 0.88 - top) / (vh * 0.8);
    progress.value = Math.min(Math.max(p, 0), 1);
    // the card scales from its top edge, so pull the content below it up by the space it frees
    pull.value = -Math.round(el.offsetHeight * 0.17 * progress.value);
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
  padding-bottom: 56px;
  text-align: center;
  color: var(--ink);
  background: var(--paper);
  font-family: 'Urbanist', system-ui, sans-serif;
}
.hero *, .hero *::before, .hero *::after { box-sizing: border-box; }
.hero a:focus-visible, .hero button:focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background: #fff;
}
.bg-video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* light veil so the dark text stays readable over any video; lower the alpha to show more video */
.bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.55);
}

.top { position: relative; z-index: 1; }

/* ---------- dotted top corners ---------- */
.dots {
  position: absolute; top: 0; z-index: 0; pointer-events: none;
  width: min(34vw, 520px); height: clamp(260px, 34vw, 460px);
  background-image: radial-gradient(circle, rgba(10, 10, 10, 0.55) 1.6px, transparent 2px);
  background-size: 24px 24px;
}
.dots-l {
  left: 0;
  -webkit-mask-image: radial-gradient(ellipse 100% 100% at 0 0, #000 0%, transparent 72%);
  mask-image: radial-gradient(ellipse 100% 100% at 0 0, #000 0%, transparent 72%);
}
.dots-r {
  right: 0;
  -webkit-mask-image: radial-gradient(ellipse 100% 100% at 100% 0, #000 0%, transparent 72%);
  mask-image: radial-gradient(ellipse 100% 100% at 100% 0, #000 0%, transparent 72%);
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
  width: fit-content; /* gradient spans the text itself */
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em; /* keeps the "g" descender inside the clipped background */
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
.arrow { display: inline-block; transition: transform 0.25s; }
.btn-primary:hover .arrow { transform: rotate(45deg); }
.btn-outline { color: #fff; background: #0b0c0e; box-shadow: inset 0 0 0 1px rgba(255,255,255,.14), 0 10px 24px rgba(0,0,0,.18); }
.btn-outline:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px rgba(255,255,255,.28), 0 16px 32px rgba(0,0,0,.28); }

/* ---------- stage ---------- */
.stage { position: relative; padding-top: var(--top0); }

/* ---------- demo video (normal scroll, scales down as it leaves) ---------- */
.hero-card {
  --p: 0;
  --pull: 0px;
  position: relative; z-index: 1; isolation: isolate; overflow: hidden;
  width: var(--w0); margin: 0 auto var(--pull);
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #1d2230, #0b0c0e); /* shows until the video loads (or if the file is missing) */
  border: 6px solid #fff; border-radius: 28px;
  box-shadow: 0 40px 90px rgba(23, 25, 29, 0.22);
  transform: scale(calc(1 - 0.17 * var(--p)));
  transform-origin: top center;
  will-change: transform;
}
.hero-video { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; user-select: none; }

/* pause / play */
.vid-toggle {
  position: absolute; right: 16px; bottom: 16px; z-index: 2;
  display: grid; place-items: center;
  width: 44px; height: 44px; padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.35); border-radius: 50%;
  background: rgba(15, 17, 23, 0.5);
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  color: #fff; cursor: pointer;
  transition: background 0.25s, transform 0.25s;
}
.vid-toggle:hover { background: rgba(240, 75, 35, 0.9); transform: scale(1.06); }
.vid-toggle svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

/* ---------- 5 cards ---------- */
.cards {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: repeat(5, 1fr); align-items: stretch; gap: 14px;
  width: calc(100% - 2 * clamp(12px, 1.6vw, 28px)); margin: 8px auto 0;
}
.hc { height: 400px; position: relative; overflow: hidden; border-radius: 24px; text-align: left; isolation: isolate; transition: transform .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s; }
.hc:hover { transform: translateY(-6px); }
.hc h3 { margin: 0; font-size: 22px; line-height: 1.15; font-weight: 600; letter-spacing: -0.035em; }
.hc p { margin: 0; font-size: 14px; line-height: 1.5; }
.hc-ic { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: #0f172a; box-shadow: 0 8px 18px rgba(15,23,42,.22); }
.hc-ic svg { width: 20px; height: 20px; fill: none; stroke: #fff; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

/* dark */
.hc-dark { padding: 26px 22px; color: #fff; background: radial-gradient(120% 70% at 85% 105%, rgba(148,176,168,.35), transparent 60%), linear-gradient(170deg, #1b2230, #0a0d14); box-shadow: 0 24px 50px rgba(11,16,32,.28); }
.hc-dark h3 { color: #fff !important; }
.hc-path { position: absolute; left: 14px; right: 14px; bottom: 18px; width: calc(100% - 28px); height: 150px; fill: none; stroke: rgba(255,255,255,.28); stroke-width: 1.3; stroke-dasharray: 2 6; stroke-linecap: round; }
.hc-dot { position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 6px rgba(255,255,255,.12); }
.hc-dot.d1 { left: 22px; bottom: 100px; background: #b9d4cb; box-shadow: 0 0 0 6px rgba(185,212,203,.22), 0 0 18px rgba(185,212,203,.6); }
.hc-dot.d2 { right: 26px; bottom: 62px; }

/* photos */
.hc-photo { background: linear-gradient(135deg, #dfe6e3, #c4d0cb); box-shadow: 0 18px 40px rgba(23,25,29,.16); }
.hc-photo img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.7,.2,1); }
.hc-photo:hover img { transform: scale(1.05); }
.hc-photo::after { content: ""; position: absolute; inset: 0; z-index: 0; background: linear-gradient(180deg, transparent 45%, rgba(8,12,24,.78)); pointer-events: none; }
.hc-photo.p1 { }
.hc-photo.p2 { }
.hc-cap { position: absolute; left: 18px; right: 18px; bottom: 18px; z-index: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; color: #fff; font-size: 15px; font-weight: 500; line-height: 1.35; letter-spacing: -0.01em; }

/* cream */
.hc-mint { padding: 20px; display: flex; flex-direction: column; justify-content: space-between; color: #17191d; background: #e4efe9; box-shadow: 0 18px 40px rgba(23,25,29,.08); }
.hc-mint p { font-size: 16px; font-weight: 600; line-height: 1.3; letter-spacing: -0.02em; }

/* white */
.hc-light { padding: 24px 22px; color: #17191d; background: #fff; box-shadow: inset 0 0 0 1px rgba(23,25,29,.07), 0 18px 40px rgba(23,25,29,.1); }
.hc-bars { position: absolute; left: 22px; right: 22px; bottom: 22px; display: flex; align-items: flex-end; gap: 8px; height: 110px; }
.hc-bars i { flex: 1; border-radius: 10px; background: #f1f2f4; }
.hc-bars i:last-child { background: linear-gradient(180deg, #2b3550, #0f172a); box-shadow: 0 10px 20px rgba(15,23,42,.25); }
.hc-bars i:nth-child(1) { height: 35%; } .hc-bars i:nth-child(2) { height: 55%; } .hc-bars i:nth-child(3) { height: 78%; } .hc-bars i:nth-child(4) { height: 100%; }
@media (max-width: 900px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
  .hc { height: 220px; }
  .hc-photo.p2 { grid-column: span 2; }
}


/* desktop: whole hero fits the visible screen */
@media (min-width: 901px) {
  .hero { --ch: clamp(200px, 38svh, 420px); min-height: 100svh; display: flex; flex-direction: column; padding-bottom: clamp(14px, 2.4svh, 28px); }
  .content { padding: clamp(84px, 13svh, 120px) 0 clamp(12px, 2.4svh, 28px); }
  h1 { font-size: clamp(38px, min(5vw, 7.6svh), 72px); }
  .lead { margin-top: clamp(10px, 2svh, 24px); font-size: clamp(13.5px, 1.9svh, 16px); line-height: 1.6; }
  .actions { margin-top: clamp(14px, 3svh, 36px); }
  .btn { min-height: clamp(44px, 6svh, 54px); }
  .support { margin-top: clamp(8px, 1.6svh, 18px); }
  .cards { margin-top: auto; }
  .hc { height: var(--ch); }
  .hc h3 { font-size: clamp(17px, 2.4svh, 22px); }
  .hc-bars { height: 34%; }
}

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .content { padding-top: 96px; }
}
@media (max-width: 760px) {
  .hero { --top0: 24px; --w0: calc(100vw - 24px); --title: clamp(38px, 10.5vw, 64px); padding-bottom: 40px; }
  .content { width: calc(100% - 32px); padding: 76px 0 24px; }
  h1 { font-size: clamp(40px, 9vw, 58px); }
  .lead { font-size: 15px; margin-top: 22px; }
  .actions { width: 100%; gap: 10px; margin-top: 28px; }
  .dots { opacity: .7; background-size: 20px 20px; }
  .btn { min-height: 50px; padding: 0 20px; font-size: 14px; }
  .hero-card { border-width: 4px; border-radius: 22px; }
  .vid-toggle { right: 10px; bottom: 10px; width: 40px; height: 40px; }
}
@media (max-width: 380px) {
  .actions { flex-direction: column; align-items: stretch; }
}
@media (prefers-reduced-motion: reduce) {
  h1, .lead, .actions, .support { animation: none; }
  .hero-card { transform: none; margin-bottom: 0; }
}
</style>