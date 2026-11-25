<template>
  <section ref="rootEl" class="sp" :class="{ 'sp-js': mounted, 'sp-in': revealed }" aria-labelledby="sp-title">
    <div class="sp-wrap">
      <h2 id="sp-title" class="sp-title">How to <em>choose your plan</em></h2>

      <ol class="sp-steps">
        <li v-for="(s, i) in steps" :key="s.t" class="sp-step" :style="{ '--i': i }">
          <span class="sp-num">{{ i + 1 }}</span>
          <span class="sp-ico" aria-hidden="true" v-html="s.icon"></span>
          <h3 class="sp-h">{{ s.t }}</h3>
          <p class="sp-p">{{ s.p }}</p>
        </li>
      </ol>

      <div class="sp-foot">
        <p class="sp-note">Our team can recommend the right plan in a short call, and you can change plans at any time.</p>
        <router-link to="/contact/" class="sp-cta">
          Talk to our team
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'ChoosePlan' })
/**
 * SectionChoosePlan.vue — "How to choose your plan": three numbered step cards and a dark closing bar with a CTA.
 * Vue 3, <script setup>. No images. The CTA links to /contact/ — change the `to` if needed. SSR safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const ic = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const steps = [
  { t: 'Count your users', p: 'Count the people who will log in, including sales, support and service staff.', icon: ic('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1"/><circle cx="18" cy="9" r="2.5"/><path d="M18 14c2.2 0 3.5 1.6 3.5 3.5V19"/>') },
  { t: 'List your channels', p: 'List the channels you need connected, such as WhatsApp, 3CX and your website.', icon: ic('<path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1"/><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/>') },
  { t: 'Pick your modules', p: 'Decide whether you need multi-branch, inventory or service management now or later.', icon: ic('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><path d="M16.500 13v7M13 16.500h7"/>') },
]

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
let io = null
onMounted(() => {
  mounted.value = true
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.12 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
.sp, .sp * { box-sizing: border-box; }
.sp { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.sp-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px); }

.sp-title {
  max-width: 20em; margin: 0; padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.sp .sp-title { color: #0f172a !important; }
.sp-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}

.sp-steps { margin: clamp(26px, 3.4vw, 44px) 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; counter-reset: s; }
.sp-step {
  position: relative; overflow: hidden; isolation: isolate; min-height: clamp(260px, 22vw, 320px); padding: 30px;
  display: flex; flex-direction: column; border-radius: 28px; background: linear-gradient(140deg, #f3f3f5 0%, #e4e4e8 100%);
}
.sp-step:nth-child(2) { background: linear-gradient(140deg, #e8ecef 0%, #d3dade 100%); }
.sp-step:nth-child(3) { background: linear-gradient(140deg, #f5f3f0 0%, #e8e4de 100%); }
.sp-num {
  position: absolute; z-index: -1; right: 18px; bottom: -34px; font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(150px, 15vw, 220px); font-weight: 600; line-height: 1; letter-spacing: -0.06em; color: rgba(23, 23, 43, 0.07);
  transition: translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sp-step:hover .sp-num { translate: -6px -8px; }
.sp-ico { display: grid; place-items: center; width: 50px; height: 50px; border-radius: 50%; background: #fff; color: #17172b; box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.25); }
.sp-ico svg { width: 23px; height: 23px; }
.sp-h { margin: auto 0 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(22px, 2vw, 30px); font-weight: 600; line-height: 1.15; letter-spacing: -0.03em; }
.sp .sp-h { color: #17172b !important; }
.sp-p { margin: 10px 0 0; max-width: 30ch; font-size: 14.5px; line-height: 1.6; }
.sp .sp-p { color: #3b3f4a !important; }

.sp-foot {
  margin-top: 16px; display: flex; align-items: center; justify-content: space-between; gap: 20px 32px; flex-wrap: wrap;
  padding: clamp(22px, 2.4vw, 34px) clamp(24px, 3vw, 44px); border-radius: 28px; background: linear-gradient(150deg, #2c2c31 0%, #19191c 100%);
}
.sp-note { margin: 0; max-width: 34em; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(18px, 1.7vw, 25px); font-weight: 500; line-height: 1.3; letter-spacing: -0.02em; }
.sp .sp-note { color: #fff !important; }
.sp-cta {
  display: inline-flex; align-items: center; gap: 12px; padding: 14px 26px; border-radius: 999px; background: #fff; color: #17172b !important;
  font-size: 15px; font-weight: 500; text-decoration: none; transition: transform 0.3s, background 0.3s;
}
.sp-cta svg { width: 18px; height: 18px; transition: transform 0.3s; }
.sp-cta:hover { background: #ececef; }
.sp-cta:hover svg { transform: translateX(4px); }
.sp-cta:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

.sp-js .sp-title, .sp-js .sp-step, .sp-js .sp-foot { opacity: 0; translate: 0 24px; }
.sp-in .sp-title, .sp-in .sp-step, .sp-in .sp-foot { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sp-in .sp-step { transition-delay: calc(0.1s + var(--i) * 0.09s); }
.sp-in .sp-foot { transition-delay: 0.4s; }

@media (max-width: 900px) {
  .sp-steps { grid-template-columns: minmax(0, 1fr); }
  .sp-step { min-height: 240px; }
}
@media (prefers-reduced-motion: reduce) {
  .sp-js .sp-title, .sp-js .sp-step, .sp-js .sp-foot { opacity: 1; translate: 0 0; }
  .sp * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>