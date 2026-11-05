<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="bg" aria-hidden="true"></div>

    <div class="top">
      <div class="content">
        <h1 id="hero-title">
          Tailor-made CRM workflows
          <span class="accent">for high-volume businesses</span>
        </h1>

        <p class="lead">
          Whether you operate a multi-branch supermarket chain, a bulk distribution hub or a fleet of service
          technicians, Saptivo adapts to your daily velocity. Generic CRMs make you bend your process to fit the
          software. Saptivo's industry-specific CRM workflows start from how your business already runs.
        </p>

      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'IndustriesHero' })
</script>

<style scoped>
.hero {
  --orange: #ff6338;
  --orange-deep: #f04b23;
  --ink: #17191d;
  --paper: #fff;
  --muted: #5d6068;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-bottom: 56px;
  text-align: center;
  color: var(--ink);
  background: var(--paper);
  font-family: 'Urbanist', system-ui, sans-serif;
}

.hero *,
.hero *::before,
.hero *::after {
  box-sizing: border-box;
}

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
    linear-gradient(90deg, #ffb29a 0%, #ff9a7c 25%, #ff967b 50%, #ff9a7c 75%, #ffb29a 100%);
}

.bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent 0px,
    transparent 34px,
    rgba(255, 255, 255, 0.025) 38px,
    rgba(255, 255, 255, 0.055) 41px,
    rgba(255, 255, 255, 0.08) 43px,
    rgba(255, 255, 255, 0.035) 46px,
    transparent 51px,
    transparent 82px
  );
  -webkit-mask-image: linear-gradient(90deg, #000 0%, transparent 30%, transparent 70%, #000 100%);
  mask-image: linear-gradient(90deg, #000 0%, transparent 30%, transparent 70%, #000 100%);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}

.top {
  position: relative;
  z-index: 1;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(1040px, calc(100% - 40px));
  margin: 0 auto;
  padding: 112px 0 28px;
}

h1 {
  margin: 0;
  font-family: Urbanist, "Urbanist Placeholder", sans-serif;
  font-size: clamp(60px, 5vw, 72px);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -1px;
  color: #0f172a;
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.accent {
  display: block;
  width: fit-content;
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lead {
  max-width: 760px;
  margin: 24px 0 0;
  font-size: 16px;
  line-height: 1.7;
  color: #4a4d55;
  animation: rise 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
}

@media (max-width: 760px) {
  .hero {
    padding-bottom: 40px;
  }

  h1 {
    font-size: clamp(40px, 9vw, 58px);
  }

  .content {
    width: calc(100% - 32px);
    padding: 76px 0 24px;
  }

  .lead {
    font-size: 15px;
    margin-top: 22px;
  }

}


@media (prefers-reduced-motion: reduce) {
  h1,
  .lead {
    animation: none;
  }
}
</style>
