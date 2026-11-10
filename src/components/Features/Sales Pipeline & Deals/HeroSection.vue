<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="bg" aria-hidden="true"></div>
    <div class="content">
      <h1 id="hero-title">
         See every deal.
        <span class="accent">Close more of them.</span>
      </h1>

      <p class="lead">
       A sales team without a clear pipeline runs on memory and hope. Saptivo's sales pipeline
        software shows every open deal on one visual board. Drag a deal to the next stage and totals,
        forecasts and reminders update instantly.
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
  --accent: #33485d;
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
  font-family: "Urbanist", sans-serif;
}
.hero *, .hero *::before, .hero *::after { box-sizing: border-box; }
.hero a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, #000 calc(100% - 80px), transparent 100%);
  mask-image: linear-gradient(180deg, #000 calc(100% - 80px), transparent 100%);
  background: #fff;
}
.bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: radial-gradient(circle, rgba(23, 25, 29, 0.14) 1px, transparent 1.5px) 0 0 / 22px 22px;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 60%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 60%, transparent 100%);
  animation: dot-drift 24s linear infinite;
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
  color: var(--accent);
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
.btn-primary {
  color: #fff;
  background: #17191d;
  border: 1px solid #17191d;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}
.btn-primary:hover {
  transform: translateY(-2px);
  background: #000;
  border-color: #000;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.24);
}
.btn-outline {
  color: #17191d;
  background: #fff;
  border: 1px solid #17191d;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}
.btn-outline:hover {
  transform: translateY(-2px);
  background: #f5f5f5;
  border-color: #000;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.14);
}

@keyframes dot-drift { to { background-position: 44px 44px; } }
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
  .bg::before { animation: none; }
}
</style>
