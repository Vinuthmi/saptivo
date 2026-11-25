<template>
  <section ref="rootEl" class="rs" :class="{ 'rs-js': mounted, 'rs-in': revealed }" aria-labelledby="rs-title">
    <div class="rs-wrap">
      <h2 id="rs-title" class="rs-title">How it works</h2>

      <ol class="rs-grid">
        <li v-for="(s, i) in steps" :key="s" class="rs-step" :class="{ dark: i === steps.length - 1 }" :style="{ '--i': i }">
          <span class="rs-n">{{ i + 1 }}</span>
          <h3>{{ s }}</h3>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'ResellerSteps' })

/** "How it works": four numbered steps, copy exactly as supplied. */
const steps = [
  'Apply through the reseller signup form',
  'Meet our partner team and agree your tier',
  'Get your partner hub, demo workspace and training',
  'Start onboarding clients and earning recurring revenue',
]

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
let io = null
onMounted(() => {
  mounted.value = true
  io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { revealed.value = true; io.disconnect() } }, { threshold: 0.1 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.rs, .rs * { box-sizing: border-box; }
.rs { font-family: 'Urbanist', system-ui, sans-serif; color: #17191d; background: #fff; }
.rs-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px); }
.rs-title { margin: 0; padding-bottom: 0.12em; font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; color: #0a0a0a; }

.rs-grid { position: relative; margin: clamp(26px, 3.4vw, 44px) 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.rs-step { display: flex; flex-direction: column; justify-content: space-between; gap: 72px; min-height: 300px; padding: 30px; border-radius: 28px; background: #f4f4f5; }
.rs-step:nth-child(2) { background: #f4f1de; }
.rs-step.dark { background: #17191d; color: #fff; }
.rs-n { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: #17191d; color: #fff; font-size: 20px; font-weight: 600; }
.rs-step.dark .rs-n { background: #ff6b16; }
.rs-step h3 { margin: 0; font-size: clamp(21px, 1.8vw, 27px); font-weight: 600; line-height: 1.18; letter-spacing: -0.03em; color: #17191d; text-wrap: balance; }
.rs-step.dark h3 { color: #fff; }

.rs-js .rs-step { opacity: 0; translate: 0 26px; }
.rs-in .rs-step { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--i) * 0.1s); }

@media (max-width: 1000px) { .rs-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .rs-step { min-height: 240px; } }
@media (max-width: 560px) {
  .rs-grid { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .rs-step { min-height: 0; gap: 40px; padding: 24px; border-radius: 24px; }
}
@media (prefers-reduced-motion: reduce) { .rs * { transition: none !important; } }
</style>