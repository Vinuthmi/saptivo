<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="bg" aria-hidden="true"></div>
    <div class="content">
      <h1 id="hero-title">
        Capture every lead.
        <span class="accent">Lose none.</span>
      </h1>

      <p class="lead">
        Leads arrive from everywhere: WhatsApp messages, Facebook forms, website enquiries, walkins and phone calls. When they land in different inboxes and notebooks, some are never
answered. Saptivo's lead management software brings every enquiry into one list, removes
duplicates and routes each lead to the right salesperson within seconds.
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
.hero {
  --ink: #17191d;
  --paper: #fff;
  --title: clamp(46px, 4.2vw, 104px);

  position: relative;
  isolation: isolate;
  overflow: clip;
  padding-bottom: 96px;
  text-align: center;
  color: var(--ink);
  background: var(--paper);
  font-family: 'Urbanist', system-ui, sans-serif;
}
.hero *, .hero *::before, .hero *::after { box-sizing: border-box; }
.hero a:focus-visible { outline: 2px solid #33485d; outline-offset: 4px; }

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, #000 calc(100% - 80px), transparent 100%);
  mask-image: linear-gradient(180deg, #000 calc(100% - 80px), transparent 100%);
  background:
    radial-gradient(ellipse 52% 48% at 50% 38%, #fff 0%, rgba(255, 255, 255, 0.88) 44%, rgba(255, 255, 255, 0.5) 68%, transparent 100%),
    linear-gradient(180deg, transparent 0%, #fff clamp(240px, 32vh, 360px)),
    linear-gradient(90deg, #dce5eb 0%, #edf1f4 25%, #e4ebf0 50%, #edf1f4 75%, #dce5eb 100%);
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
  -webkit-mask-image: linear-gradient(90deg, #000 0%, transparent 30%, transparent 70%, #000 100%);
  mask-image: linear-gradient(90deg, #000 0%, transparent 30%, transparent 70%, #000 100%);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}

.content {
  position: relative;
  z-index: 1;
  display: flex; flex-direction: column; align-items: center;
  width: min(1040px, calc(100% - 40px)); margin: 0 auto;
  padding: 112px 0 28px;
}
h1 {
  margin: 0; font-weight: 500; line-height: 1.12; letter-spacing: -0.06em; color: #0f172a;
  font-size: var(--title);
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.accent {
  display: block;
  width: fit-content;
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em;
  background: linear-gradient(100deg, #526b81 0%, #33485d 55%, #26394d 100%);
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
.btn-primary { color: #fff; background: #17191d; border: 1px solid #17191d; box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18); }
.btn-primary:hover { transform: translateY(-2px); background: #000; border-color: #000; box-shadow: 0 16px 32px rgba(0, 0, 0, 0.24); }
.btn-outline { color: #17191d; background: #fff; border: 1px solid #17191d; box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08); }
.btn-outline:hover { transform: translateY(-2px); background: #f5f5f5; border-color: #000; box-shadow: 0 16px 32px rgba(0, 0, 0, 0.14); }

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
