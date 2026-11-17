<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="bg" aria-hidden="true"></div>
    <div class="content">
      <h1 id="hero-title">
        Turn after-sales service into
        <span class="accent">predictable revenue</span>
      </h1>

      <p class="lead">
        Many businesses don't sell a product once. They install air conditioners, solar systems,
        generators, lifts, CCTV or water purifiers, and then service them for years. That recurring
        revenue only works if no contract lapses, no visit is missed and every chargeable job is billed.
        Saptivo's AMC management software runs the whole after-sales cycle and ties it back to the
        customer.
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
  background-color: #fff;
  background-image:
    radial-gradient(ellipse 68% 55% at 50% 42%, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.55) 55%, rgba(255, 255, 255, 0) 100%),
    radial-gradient(circle, rgba(23, 25, 29, 0.24) 1.15px, transparent 1.35px),
    linear-gradient(180deg, #e6edf2 0%, #f4f7f9 50%, #ffffff 100%);
  background-size: 100% 100%, 22px 22px, 100% 100%;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.85) 55%, rgba(0, 0, 0, 0.35) 82%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.85) 55%, rgba(0, 0, 0, 0.35) 82%, transparent 100%);
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
