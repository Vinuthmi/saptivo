<template>
  <section class="ih" aria-labelledby="ih-title">
    <div class="wrap">
      <h1 id="ih-title">
        Talk to our team about <span class="accent">Saptivo</span>
      </h1>

      <p class="lead">
        Questions about features, pricing or moving from another CRM?
        Want to become a partner? Get in touch and the right person
        will reply.
      </p>

      <div v-if="$slots.default" class="actions">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'ContactHero' });
</script>

<style scoped>
.ih {
  --ink: #17191d;
  position: relative;
  isolation: isolate;
  overflow: clip;
  text-align: center;
  color: var(--ink);
  background: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
}

.ih *,
.ih *::before,
.ih *::after {
  box-sizing: border-box;
}

.wrap {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(980px, calc(100% - 40px));
  margin: 0 auto;
  /* extra space above the heading; small bottom space so the section below sits close */
  padding: clamp(136px, 14vw, 190px) 0
           0;
}

h1 {
  margin: 0;
  font-size: clamp(38px, 5vw, 68px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.05em;
  color: #0a0a0a;
  text-wrap: balance;
  animation: rise 0.9s
    cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.accent {
  display: block;
  color: #6b6866;
}

.lead {
  max-width: 760px;
  margin: 26px 0 0;
  font-size: clamp(15px, 1.25vw, 17px);
  font-weight: 500;
  line-height: 1.75;
  letter-spacing: 0.012em;
  color: #3d4148;
  text-wrap: pretty;
  animation: rise 0.9s 0.1s
    cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 34px;
  animation: rise 0.9s 0.2s
    cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.actions a {
  padding: 13px 20px;
  border-radius: 999px;
  color: #fff;
  background: #ff6818;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.actions a:hover {
  background: #e9570c;
}

.actions a:focus-visible {
  outline: 3px solid #17191d;
  outline-offset: 3px;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 760px) {
  .wrap {
    width: calc(100% - 32px);
  }
}

@media (prefers-reduced-motion: reduce) {
  h1,
  .lead,
  .actions {
    animation: none;
  }
}
</style>