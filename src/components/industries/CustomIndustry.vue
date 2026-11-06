<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'IndustryCta' })

const root = ref(null)
let io
const chips = ['Retail', 'Wholesale', 'Contractors', 'Field service', 'Startups']

onMounted(() => {
  if (!('IntersectionObserver' in window)) return root.value?.classList.add('in')
  io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.disconnect())),
    { threshold: 0.25 }
  )
  io.observe(root.value)
})
onBeforeUnmount(() => io && io.disconnect())
</script>

<template>
  <section class="ico" ref="root" aria-labelledby="ico-title">
    <div class="ico-card">
      <div class="ico-copy">
        <h2 id="ico-title" class="ico-title">Don't see your <em>industry?</em></h2>
        <p class="ico-text">
          Saptivo's custom fields, pipelines and workflow automation adapt to almost any business that sells, quotes and serves customers. Tell us how you work and we'll show you Saptivo configured for it.
        </p>
        <div class="ico-actions">
          <router-link to="/contact/" class="ico-btn primary">
            Contact Us
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true"><path d="M4 10h11m-4-4.5L15.5 10 11 14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </router-link>
          <router-link to="/demo/" class="ico-btn ghost">Book a Demo</router-link>
        </div>
      </div>

      <div class="ico-chips" aria-hidden="true">
        <span v-for="(c, i) in chips" :key="c" class="chip" :style="{ '--i': i }">{{ c }}</span>
        <span class="chip you" :style="{ '--i': chips.length }">+ Your industry</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ico { font-family: 'Poppins', system-ui, sans-serif; background: #fff; padding: clamp(40px, 6vw, 96px) clamp(20px, 4vw, 40px); }

.ico-card {
  position: relative; overflow: hidden; isolation: isolate;
  max-width: 1180px; margin: 0 auto;
  display: grid; grid-template-columns: 1.2fr 1fr; align-items: center;
  gap: clamp(24px, 5vw, 72px);
  padding: clamp(32px, 5vw, 72px);
  border-radius: 32px;
  color: #fff;
  background: linear-gradient(135deg, #ff7a2a 0%, #f2540c 60%, #d9420a 100%);
  opacity: 0; transform: translateY(28px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.in .ico-card { opacity: 1; transform: none; }
.ico-card::before {
  content: ''; position: absolute; inset: 0; z-index: -1;
  background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1.4px);
  background-size: 18px 18px;
  -webkit-mask-image: linear-gradient(120deg, #000, transparent 70%);
  mask-image: linear-gradient(120deg, #000, transparent 70%);
}
.ico-card::after {
  content: ''; position: absolute; z-index: -1; width: 420px; height: 420px; right: -120px; bottom: -200px;
  border-radius: 50%; background: radial-gradient(circle, rgba(255, 255, 255, 0.28), transparent 68%);
}

.ico-title {
  margin: 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(32px, 4.2vw, 58px);
  font-weight: 500; line-height: 1.06; letter-spacing: -0.06em;
}
.ico-title em { font-style: normal; color: #0f172a; }
.ico-text { margin: 18px 0 0; max-width: 520px; font-size: clamp(14px, 1.15vw, 16.5px); line-height: 1.7; color: rgba(255, 255, 255, 0.92); }

.ico-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.ico-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 26px; border-radius: 999px;
  font-size: 14.5px; font-weight: 500; text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}
.ico-btn.primary { background: #0f172a; color: #fff; box-shadow: 0 12px 24px -12px rgba(15, 23, 42, 0.7); }
.ico-btn.ghost { color: #fff; border: 1.5px solid rgba(255, 255, 255, 0.65); }
.ico-btn:hover { transform: translateY(-2px); }
.ico-btn.ghost:hover { background: rgba(255, 255, 255, 0.14); }
.ico-btn svg { transition: transform 0.25s ease; }
.ico-btn:hover svg { transform: translateX(3px); }
.ico-btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

/* chips */
.ico-chips { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; align-content: center; gap: 12px; }
.chip {
  font-size: clamp(13px, 1.1vw, 15px); font-weight: 500;
  padding: 11px 20px; border-radius: 999px;
  background: rgba(255, 255, 255, 0.95); color: #0f172a;
  box-shadow: 0 14px 26px -16px rgba(15, 23, 42, 0.55);
  opacity: 0; transform: translateY(14px) scale(0.95);
}
.chip.you { background: transparent; color: #fff; border: 1.5px dashed rgba(255, 255, 255, 0.8); box-shadow: none; }
.in .chip { animation: chipin 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both, bob 5s ease-in-out infinite; animation-delay: calc(0.4s + var(--i) * 0.1s), calc(1.2s + var(--i) * 0.3s); }
@keyframes chipin { to { opacity: 1; transform: none; } }
@keyframes bob { 50% { translate: 0 -5px; } }

@media (max-width: 860px) {
  .ico-card { grid-template-columns: 1fr; border-radius: 26px; }
  .ico-chips { justify-content: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .ico-card, .chip { opacity: 1; transform: none; transition: none; animation: none !important; }
}
</style>