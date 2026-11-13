<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="bg" aria-hidden="true"></div>
    <div class="content">
      <h1 id="hero-title">
        Automate the busywork.
        <span class="accent">Keep the follow-ups.</span>
      </h1>

      <p class="lead">
        Your team didn't join to copy data between screens and remind each other about follow-ups.
        Saptivo's CRM workflow automation does that work for you, every time, triggered by data
        changes, dates or user actions.
      </p>

      <div class="actions">
        <a href="mailto:hello@saptivo.com?subject=Start%20my%2014-day%20free%20trial" class="btn btn-primary">
          Start free for 14 days
        </a>
        <a href="mailto:hello@saptivo.com?subject=Book%20a%20Saptivo%20demo" class="btn btn-outline">Book a demo</a>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: "FeaturesHero" });
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.hero {
  --orange: #7a7f86;
  --ink: #17191d;
  --paper: #eef1f3;
  --title: clamp(46px, 4.2vw, 104px);

  position: relative;
  isolation: isolate;
  overflow: clip;
  min-height: 70vh;
  padding-bottom: clamp(48px, 7vh, 96px);
  text-align: center;
  color: var(--ink);
  background: var(--paper);
  font-family: "Inter", system-ui, sans-serif;
}
.hero *, .hero *::before, .hero *::after { box-sizing: border-box; }
.hero a:focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background:
    linear-gradient(180deg, transparent 45%, rgba(248,246,255,0.72) 78%, #f8f6ff 100%),
    radial-gradient(ellipse 52% 48% at 50% 38%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 44%, rgba(255,255,255,0.14) 68%, transparent 100%),
    linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.8) clamp(240px, 32vh, 360px)),
    linear-gradient(90deg, #dfe5e8 0%, #edf0f2 25%, #e2e7eb 50%, #edf0f2 75%, #dfe5e8 100%);
}
.bg::before {
  content: "";
  position: absolute;
  inset: 14% 10% 12%;
  border-radius: 32px;
  background-image: radial-gradient(rgba(55, 66, 74, 0.2) 1.2px, transparent 1.6px);
  background-size: 18px 18px;
  opacity: 0.7;
  mask-image: radial-gradient(circle at center, black 0%, black 55%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 0%, black 55%, transparent 100%);
}

.bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      90deg,
      transparent 0px, transparent 34px,
      rgba(255, 255, 255, 0.025) 38px, rgba(255, 255, 255, 0.055) 41px,
      rgba(255, 255, 255, 0.08) 43px, rgba(255, 255, 255, 0.035) 46px,
      transparent 51px, transparent 82px
    );
  opacity: 0.9;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}

.content {
  position: relative;
  z-index: 1;
  display: flex; flex-direction: column; align-items: center;
  justify-content: center;
  width: min(1040px, calc(100% - 40px));
  min-height: 70vh;
  margin: 0 auto;
  padding: clamp(88px, 11vh, 112px) 0 clamp(20px, 4vh, 28px);
}
h1 {
  margin: 0; font-weight: 600; line-height: 1.12; letter-spacing: -0.06em; color: #6B6866;
  font-size: var(--title);
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.accent {
  display: block;
  width: fit-content;
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em;
  background: linear-gradient(100deg, #3a3d40 0%, #202428 45%, #0f1113 100%);
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
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 54px; padding: 0 24px; border-radius: 12px;
  text-decoration: none; font-size: 15px; font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary { color: #fff; background: linear-gradient(180deg, #5d6670, #3b4249); box-shadow: inset 0 0 0 1px rgba(255,255,255,.35), 0 10px 24px rgba(76,85,92,.28); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px rgba(255,255,255,.4), 0 16px 32px rgba(76,85,92,.36); }
.btn-outline { color: #fff; background: #0b0c0e; box-shadow: inset 0 0 0 1px rgba(255,255,255,.14), 0 10px 24px rgba(0,0,0,.18); }
.btn-outline:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px rgba(255,255,255,.28), 0 16px 32px rgba(0,0,0,.28); }

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

@media (max-width: 900px) {
  .content { padding-top: 96px; }
}
@media (max-width: 760px) {
  .hero { --title: clamp(38px, 10.5vw, 64px); padding-bottom: 64px; }
  .content { width: calc(100% - 32px); padding: 76px 0 24px; }
  .lead { font-size: 15px; margin-top: 22px; }
  .actions { width: 100%; gap: 10px; margin-top: 28px; }
  .btn { min-height: 50px; padding: 0 20px; font-size: 14px; }
}
@media (max-width: 380px) {
  .actions { flex-direction: column; align-items: stretch; }
}
@media (prefers-reduced-motion: reduce) {
  h1, .lead, .actions { animation: none; }
}
</style>
