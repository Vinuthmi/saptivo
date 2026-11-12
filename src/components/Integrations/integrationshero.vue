<template>
  <section class="ih" aria-labelledby="ih-title">
    <!-- dotted pattern at the top (same as the home hero and footer) -->
    <span class="dots" aria-hidden="true"></span>

    <div class="wrap">
      <h1 id="ih-title">
        Connect Saptivo
        <span class="accent">to the tools you already use</span>
      </h1>

      <p class="lead">
        Saptivo's built-in CRM integrations work for you around the clock. Phone calls log themselves, WhatsApp chats
        sync both ways, social leads arrive instantly and CRM tasks appear in your calendar. No copy-and-paste, no
        missed enquiries.
      </p>

      <!-- optional: <InnerHeroIntegrations><a class="btn">…</a></InnerHeroIntegrations> to add buttons later -->
      <div v-if="$slots.default" class="actions"><slot /></div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: "InnerHeroIntegrations" });
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
.ih *, .ih *::before, .ih *::after { box-sizing: border-box; }

.dots {
  position: absolute; top: 0; left: 0; right: 0; z-index: 0; pointer-events: none;
  height: 100%;
  background-image: radial-gradient(circle, rgba(23, 25, 29, 0.42) 1px, transparent 1.4px);
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(ellipse 85% 100% at 50% 0%, #000 0%, rgba(0, 0, 0, 0.5) 55%, transparent 95%);
  mask-image: radial-gradient(ellipse 85% 100% at 50% 0%, #000 0%, rgba(0, 0, 0, 0.5) 55%, transparent 95%);
}

.wrap {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center;
  width: min(980px, calc(100% - 40px)); margin: 0 auto;
  padding: clamp(104px, 11vw, 150px) 0 clamp(56px, 7vw, 96px);
}
h1 {
  margin: 0;
  font-size: clamp(38px, 5vw, 68px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.05em;
  color: #0a0a0a;
  text-wrap: balance;
  animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.accent { display: block; color: #6b6866; }
.lead {
  max-width: 760px; margin: 26px 0 0;
  font-size: clamp(15px, 1.25vw, 17px); line-height: 1.75; color: #4a4d55;
  text-wrap: pretty;
  animation: rise 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.actions {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 34px;
  animation: rise 0.9s 0.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

@keyframes rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }

@media (max-width: 760px) {
  .wrap { width: calc(100% - 32px); }
  .dots { background-size: 20px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  h1, .lead, .actions { animation: none; }
}
</style>