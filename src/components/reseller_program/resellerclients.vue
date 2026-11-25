<template>
  <section class="rc" aria-labelledby="rc-title">
    <div class="rc-stage">
      <span class="rc-glow" aria-hidden="true"></span>
      <div class="rc-wrap">
        <h2 id="rc-title" class="rc-title">What your clients get</h2>
        <div class="rc-copy">
          <p class="rc-lead">Your clients get a proven, secure CRM with local support, and you become the trusted adviser who made their business more organised.</p>
          <p class="rc-p">Many partners bundle Saptivo with their own services, such as website design, phone systems or IT support, to increase the value of every client relationship.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'ResellerClients' })
/** "What your clients get": black stage with the supplied paragraph (first sentence larger, the rest below). */
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Urbanist:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.rc, .rc * { box-sizing: border-box; }
.rc { padding: clamp(16px, 3vw, 32px) clamp(16px, 3vw, 32px) clamp(40px, 6vw, 88px); background: #fff; font-family: 'Poppins', system-ui, sans-serif; }
.rc-stage { position: relative; overflow: hidden; isolation: isolate; max-width: 1240px; margin: 0 auto; border-radius: clamp(24px, 3vw, 40px); background: #17191d; color: #fff; }
.rc-glow { position: absolute; z-index: -1; top: -220px; right: -120px; width: 480px; height: 480px; border-radius: 50%; background: rgba(255, 107, 22, 0.3); filter: blur(100px); pointer-events: none; }
.rc-wrap { display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); gap: clamp(24px, 6vw, 96px); align-items: start; padding: clamp(40px, 6vw, 88px); }
.rc-title { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(32px, 4vw, 56px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; color: #fff; }
.rc-lead { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(22px, 2.2vw, 32px); font-weight: 500; line-height: 1.3; letter-spacing: -0.03em; color: #fff; text-wrap: pretty; }
.rc-p { margin: 28px 0 0; padding-top: 28px; border-top: 1px solid rgba(255, 255, 255, 0.18); max-width: 560px; font-size: clamp(15px, 1.2vw, 17px); line-height: 1.75; color: rgba(255, 255, 255, 0.72); }
@media (max-width: 860px) { .rc-wrap { grid-template-columns: minmax(0, 1fr); } }
</style>