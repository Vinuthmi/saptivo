<template>
  <section class="ih" aria-labelledby="hh-title">
   <div ref="root" class="card">
    
    <video
      ref="vid"
      class="bg-video"
      :src="videoSrc"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      aria-hidden="true"
      tabindex="-1"
    ></video>
    <!-- dark overlay so the white text is easy to read -->
    <span class="shade" aria-hidden="true"></span>

    <div class="wrap">
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
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "HomeHeroSimple" });

const videoSrc = "https://public-assets.content-platform.envatousercontent.com/b988f3ac-00c7-49e0-947e-5f2743e6ea8d/d47db0a7-fe33-45c5-b831-412229fb0b2e/b988f3ac-00c7-49e0-947e-5f2743e6ea8d/preview_540p_crf22_higher_quality.mp4";

const root = ref(null);
const vid = ref(null);
let io = null;

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    vid.value?.pause();
    return;
  }
  // play only while the section is on screen (saves battery / CPU)
  io = new IntersectionObserver(([e]) => {
    const v = vid.value;
    if (!v) return;
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
  --edge: 8px; /* gap around the video panel (top and sides) */
  position: relative;
  padding: var(--edge) var(--edge) 0;
  text-align: center;
  color: var(--ink);
  background: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
}

/* the video panel: fills the page width, the navbar floats on top of it */
.card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: clamp(560px, 82svh, 780px);
  margin: 0 auto;
  border-radius: clamp(12px, 1.4vw, 20px);
  background: #0b0c0e; /* shows until the video loads */
}
.ih *, .ih *::before, .ih *::after { box-sizing: border-box; }

.bg-video {
  position: absolute; inset: 0; z-index: 0;
  display: block; width: 100%; height: 100%;
  object-fit: cover; pointer-events: none; user-select: none;
}
.shade {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg, rgba(8, 10, 14, 0.55) 0%, rgba(8, 10, 14, 0.48) 50%, rgba(8, 10, 14, 0.6) 100%);
}

.wrap {
  position: relative; z-index: 3;
  display: flex; flex-direction: column; align-items: center;
  width: min(980px, calc(100% - 40px)); margin: 0 auto;
  padding: clamp(136px, 12vw, 168px) 0 clamp(48px, 5vw, 72px); /* top clears the floating navbar */
}
h1 {
  margin: 0;
  font-size: clamp(38px, 5vw, 68px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.05em;
  color: #fff;
  text-wrap: balance;
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.accent { display: block; color: #fff; }
/* keep the white even if a global heading style exists on the site */
.ih h1#hh-title {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
  background: none !important;
  opacity: 1 !important;
}
.ih h1#hh-title .accent {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
  background: none !important;
}
.lead {
  max-width: 760px; margin: 26px 0 0;
  font-size: clamp(15px, 1.25vw, 17px); line-height: 1.75; color: #fff;
  text-wrap: pretty;
  animation: rise 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.actions {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 34px;
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
  transition: transform 0.2s, background 0.2s, border-color 0.2s;
}
.btn:hover { transform: translateY(-2px); }
.ih .actions .btn-primary {
  color: #fff !important;
  background: linear-gradient(135deg, #f26a1b 0%, #cf440a 100%) !important;
  border: 1px solid transparent !important;
  box-shadow: none !important;
}
.ih .actions .btn-primary:hover {
  background: linear-gradient(135deg, #f97b2d 0%, #dc4c0d 100%) !important;
}
.ih .actions .btn-outline {
  color: #fff !important;
  background: #000 !important;
  border: 1px solid #000 !important;
  box-shadow: none !important;
}
.ih .actions .btn-outline:hover {
  background: #1a1a1a !important;
  border-color: #1a1a1a !important;
}

@keyframes rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }

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