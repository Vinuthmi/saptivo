<template>
  <section class="ih" aria-labelledby="hh-title">
    <div ref="root" class="card">
      <!-- Background video -->
      <video
        ref="vid"
        class="bg-video"
        :src="videoSrc"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        @loadeddata="onLoaded"
        @canplay="onCanPlay"
        aria-hidden="true"
        tabindex="-1"
      ></video>
      <span class="shade" aria-hidden="true"></span>

      <div class="wrap">
        <div class="hero-copy">
          <h1 id="hh-title">
            Manage and automate your
            <span class="accent">CRM, your way.</span>
          </h1>

          <p class="lead">
            Saptivo is an all-in-one cloud CRM and reliable CRM software Sri Lanka businesses use to manage customers, conversations and sales in one connected workspace.
          </p>

          <div class="actions">
            <a href="mailto:hello@saptivo.com?subject=Start%20my%2014-day%20free%20trial" class="btn btn-primary">Start free for 14 days</a>
            <a href="mailto:hello@saptivo.com?subject=Book%20a%20Saptivo%20demo" class="btn btn-outline">Book a demo</a>
          </div>
          <p class="support">No setup fee · No upgrade fees · No credit card required</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
defineOptions({ name: 'HomeHeroSimple' });

const videoSrc = 'https://public-assets.content-platform.envatousercontent.com/b988f3ac-00c7-49e0-947e-5f2743e6ea8d/d47db0a7-fe33-45c5-b831-412229fb0b2e/b988f3ac-00c7-49e0-947e-5f2743e6ea8d/preview_540p_crf22_higher_quality.mp4';

const root = ref(null);
const vid = ref(null);
let io = null;
let inView = true;
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function onLoaded() {
  const v = vid.value;
  if (v && v.paused && v.currentTime === 0) v.currentTime = 0.05;
}
function onCanPlay() {
  if (!reduce() && inView) vid.value?.play().catch(() => {});
}
onMounted(() => {
  if (reduce()) {
    vid.value?.pause();
    return;
  }
  vid.value?.play().catch(() => {});
  io = new IntersectionObserver(([e]) => {
    const v = vid.value;
    if (!v) return;
    inView = e.isIntersecting;
    if (e.isIntersecting) v.play().catch(() => {});
    else v.pause();
  }, { threshold: 0.1 });
  if (root.value) io.observe(root.value);
});
onBeforeUnmount(() => io?.disconnect());
</script>

<style scoped>
.ih {
  --ink: #17191d;
  --edge: clamp(10px, 1.3vw, 24px);
  --hdr: 114px; /* 42px contact bar + 72px navigation */
  --gap-top: 2px;
  position: relative;
  padding: calc(var(--hdr) + var(--gap-top)) var(--edge) var(--edge);
  text-align: center;
  color: var(--ink);
  background: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
}
.ih *, .ih *::before, .ih *::after { box-sizing: border-box; }
.card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 66vh;
  min-height: 66svh;
  margin: 0 auto;
  border-radius: clamp(18px, 2.4vw, 36px);
  background: #0b0c0e;
}
.bg-video {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  pointer-events: none;
  user-select: none;
}
.shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(8, 10, 14, .55) 0%, rgba(8, 10, 14, .48) 50%, rgba(8, 10, 14, .6) 100%);
}
.wrap {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(980px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(36px, 4.5vw, 72px) 0 clamp(32px, 3vw, 48px);
}
.hero-copy { text-align: center; }
h1 {
  margin: 0;
  font-size: clamp(38px, 5vw, 68px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -.05em;
  color: #fff;
  text-wrap: balance;
  animation: rise .9s cubic-bezier(.2,.7,.2,1) both;
}
.accent { display: block; color: #fff; }
.ih h1#hh-title,
.ih h1#hh-title .accent {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
  background: none !important;
  opacity: 1 !important;
}
.lead {
  max-width: 760px;
  margin: 26px 0 0;
  font-size: clamp(15px, 1.25vw, 17px);
  line-height: 1.75;
  color: #fff;
  text-wrap: pretty;
  animation: rise .9s .1s cubic-bezier(.2,.7,.2,1) both;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 34px;
  animation: rise .9s .2s cubic-bezier(.2,.7,.2,1) both;
}
.support {
  margin: 18px 0 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: #fff;
  animation: rise .9s .3s cubic-bezier(.2,.7,.2,1) both;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 54px;
  padding: 0 24px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: transform .2s, background .2s, border-color .2s;
}
.btn:hover { transform: translateY(-2px); }
/* Primary CTA: solid black, no orange gradient */
.ih .actions .btn-primary,
.ih .actions .btn-primary:hover {
  color: #fff !important;
  background: #000 !important;
  background-image: none !important;
  border: 1px solid #000 !important;
  box-shadow: none !important;
}
/* Secondary CTA: transparent glass effect, white text */
.ih .actions .btn-outline {
  color: #fff !important;
  background: rgba(255, 255, 255, .08) !important;
  background-image: none !important;
  border: 1px solid rgba(255, 255, 255, .45) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: none !important;
}
.ih .actions .btn-outline:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, .16) !important;
  border-color: rgba(255, 255, 255, .7) !important;
}
@keyframes rise {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: none; }
}
@media (max-width: 1340px) { .ih { --hdr: 106px; /* 42px contact bar + 64px navigation */ } }
@media (max-width: 760px) {
  .wrap { width: calc(100% - 32px); }
  .btn { min-height: 50px; padding: 0 20px; font-size: 14px; }
}
@media (max-width: 380px) {
  .actions { flex-direction: column; align-items: stretch; width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  h1, .lead, .actions, .support { animation: none; }
  .btn { transition: none; }
}
</style>
