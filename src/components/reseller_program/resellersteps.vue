<template>
  <section ref="rootEl" class="hw" :class="{ 'hw-js': mounted, 'hw-in': revealed }" aria-labelledby="hw-title">
    <div class="hw-wrap">
      <h2 id="hw-title" class="hw-title">How it works</h2>

      <ol class="hw-grid">
        <li v-for="(s, i) in steps" :key="s.id" class="hw-card" :class="{ 'hw-has-cta': s.cta }" :style="{ '--i': i }">
          <img v-if="!failed[s.id]" class="hw-img" :src="s.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[s.id] = true" />
          <span class="hw-shade" aria-hidden="true"></span>

          <span class="hw-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="s.icon"></svg>
          </span>
          <span class="hw-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>

          <div class="hw-body">
            <h3 class="hw-h">{{ s.title }}</h3>
            <p class="hw-p">{{ s.text }}</p>
            <router-link v-if="s.cta" :to="s.cta.to" class="hw-btn">{{ s.cta.label }}</router-link>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'SectionHowItWorksCards' })
/**
 * SectionHowItWorksCards.vue — "How it works" as four tall photo cards (dark overlay, icon, step number,
 * heading, text and an optional button). Swap the `img` URLs for your own photos; a card falls back to a
 * dark gradient if its photo fails. Vue 3, <script setup>. SSR safe.
 */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const steps = [
  {
    id: 'apply', title: 'Apply',
    text: 'Apply through the reseller signup form.',
    img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1000&q=80&auto=format&fit=crop',
    icon: '<path d="M9 3h6v3H9z"/><path d="M7 5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1"/><path d="m9 14 2 2 4-4"/>',
    cta: { label: 'Apply now', to: '/reseller/signup/' },
  },
  {
    id: 'meet', title: 'Meet the partner team',
    text: 'Meet our partner team and agree your tier.',
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=80&auto=format&fit=crop',
    icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    id: 'setup', title: 'Get set up',
    text: 'Get your partner hub, demo workspace and training.',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1000&q=80&auto=format&fit=crop',
    icon: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/><path d="M9 20v-4h6v4"/>',
  },
  {
    id: 'earn', title: 'Start earning',
    text: 'Start onboarding clients and earning recurring revenue.',
    img: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=1000&q=80&auto=format&fit=crop',
    icon: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    cta: { label: 'Become a reseller', to: '/reseller/signup/' },
  },
]

const failed = reactive({})
const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
let io = null
onMounted(() => {
  mounted.value = true
  if (!('IntersectionObserver' in window)) { revealed.value = true; return }
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.12 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
.hw, .hw * { box-sizing: border-box; }
.hw { font-family: 'Urbanist', system-ui, sans-serif; color: #fff; background: #fff; }
.hw-wrap { max-width: 1680px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(10px, 1.3vw, 24px); }

.hw-title {
  margin: 0 0 clamp(26px, 3.4vw, 44px);
  font-family: 'Urbanist', 'Urbanist Placeholder', sans-serif;
  font-size: 54px; font-weight: 600; line-height: 65px; letter-spacing: -1px; color: #0a0a0a;
}

.hw-grid { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }

.hw-card {
  position: relative; isolation: isolate; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end;
  min-height: clamp(520px, 40vw, 640px); border-radius: 36px; background: linear-gradient(150deg, #3a4a60, #0f1a2a);
}
.hw-js .hw-card { opacity: 0; translate: 0 28px; }
.hw-in .hw-card { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--i) * 0.1s); }

.hw-img { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.hw-card:hover .hw-img { scale: 1.05; }
.hw-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(10, 16, 26, 0.08) 0%, rgba(10, 16, 26, 0.3) 38%, rgba(10, 16, 26, 0.9) 100%); }

.hw-ico, .hw-num { position: absolute; z-index: 2; top: 22px; width: 58px; height: 58px; border-radius: 50%; display: grid; place-items: center; }
.hw-ico { left: 22px; background: #fff; color: #14243a; box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.4); }
.hw-ico svg { width: 24px; height: 24px; }
.hw-num { right: 22px; background: rgba(255, 255, 255, 0.22); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }

.hw-body { position: relative; z-index: 2; padding: 0 30px 30px; display: flex; flex-direction: column; align-items: flex-start; }
.hw-h { margin: 0; max-width: 11em; font-size: clamp(26px, 2.1vw, 34px); font-weight: 600; line-height: 1.12; letter-spacing: -0.02em; text-wrap: balance; text-shadow: 0 2px 16px rgba(0, 0, 0, 0.45); }
.hw-p { margin: 14px 0 0; max-width: 32ch; font-size: 16px; line-height: 1.55; color: rgba(255, 255, 255, 0.9); text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5); }
.hw-card:not(.hw-has-cta) .hw-body { padding-bottom: 106px; } /* keeps all four headings on one line */
.hw-btn {
  margin-top: 24px; display: inline-flex; align-items: center; justify-content: center; min-height: 52px; padding: 0 30px;
  border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.28); background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  color: #fff; font-size: 15px; font-weight: 700; text-decoration: none; transition: background 0.25s, transform 0.25s;
}
.hw-btn:hover { background: rgba(255, 255, 255, 0.26); transform: translateY(-2px); }
.hw-btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

/* keep the text white even when the site's global styles colour headings and paragraphs */
.hw .hw-card .hw-h,
.hw .hw-card .hw-p,
.hw .hw-card .hw-num,
.hw .hw-card .hw-btn { color: #fff !important; -webkit-text-fill-color: #fff !important; }
.hw .hw-card .hw-p { color: rgba(255, 255, 255, 0.92) !important; -webkit-text-fill-color: rgba(255, 255, 255, 0.92) !important; }
.hw .hw-card .hw-ico { color: #14243a !important; }
.hw .hw-title { color: #0a0a0a !important; }

@media (max-width: 1180px) {
  .hw-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hw-card { min-height: 520px; }
}
@media (max-width: 760px) {
  .hw-title { font-size: 40px; line-height: 1.2; }
}
@media (max-width: 620px) {
  .hw-grid { grid-template-columns: minmax(0, 1fr); gap: 14px; }
  .hw-card { min-height: 460px; border-radius: 28px; }
  .hw-title { font-size: 32px; }
  .hw-body { padding: 0 24px 26px; }
}
@media (prefers-reduced-motion: reduce) {
  .hw-js .hw-card { opacity: 1; translate: 0 0; }
  .hw * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>