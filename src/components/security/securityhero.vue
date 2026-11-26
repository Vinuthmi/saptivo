
<template>
  <section class="ih" aria-labelledby="ih-title">
    <div class="wrap">
      <h1 id="ih-title">
        Your customer data is protected.
        <span class="accent">Period.</span>
      </h1>

      <p class="lead">
        Your CRM holds your most valuable asset: customer
        relationships, prices and pipeline. Saptivo is secure
        CRM software hardened at every layer, from login to
        export, so your business data is never left unguarded.
      </p>

      <div v-if="$slots.default" class="actions">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'InnerHeroSecurity' });
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
  padding: clamp(104px, 11vw, 150px) 0
           clamp(56px, 7vw, 96px);
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
