<template>
  <section ref="rootEl" class="pc" :class="{ 'pc-js': mounted, 'pc-in': revealed }" aria-labelledby="pc-title">
    <div class="pc-wrap">
      <div class="pc-head">
        <h2 id="pc-title" class="pc-title">Privacy and <em>compliance</em></h2>
        <p class="pc-lead">Saptivo includes the tools to meet data-privacy obligations, including the EU GDPR and Sri Lanka's Personal Data Protection Act:</p>
      </div>

      <ul class="pc-list">
        <li v-for="(it, i) in items" :key="it.t" class="pc-item" :style="{ '--i': i }">
          <span class="pc-ico" aria-hidden="true" v-html="it.icon"></span>
          <span class="pc-t">{{ it.t }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'PrivacyCompliance' })
/**
 * SectionPrivacyCompliance.vue — "Privacy and compliance": heading and intro on the left, the five
 * capabilities as a clean ruled list with icons on the right. Vue 3, <script setup>. No images. SSR safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`

const items = [
  { t: 'Consent capture and withdrawal tracking', icon: svg('<path d="M12 3 4.500 6v5.500c0 4.500 3 7.700 7.500 9.500 4.500-1.800 7.500-5 7.500-9.500V6z"/><path d="m9 12 2.200 2.200L15.500 10"/>') },
  { t: 'Data-retention and automatic purge rules', icon: svg('<circle cx="12" cy="13" r="8"/><path d="M12 8.500V13l3 2M9.500 2.500h5"/>') },
  { t: 'Right-to-erasure request workflows', icon: svg('<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1"/><path d="m16.500 9.500 5 5M21.500 9.500l-5 5"/>') },
  { t: 'Data export for the data subject', icon: svg('<path d="M12 3v12M7 10.500l5 5 5-5"/><path d="M4 17v2.500A1.500 1.500 0 0 0 5.500 21h13a1.500 1.500 0 0 0 1.500-1.500V17"/>') },
  { t: 'Masking of sensitive fields by role', icon: svg('<path d="M3 12s3.500-6.500 9-6.500S21 12 21 12s-3.500 6.500-9 6.500S3 12 3 12z"/><circle cx="12" cy="12" r="2.800"/><path d="m4 4 16 16"/>') },
]

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
let io = null
onMounted(() => {
  mounted.value = true
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.15 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
.pc, .pc * { box-sizing: border-box; }
.pc { --pad: clamp(20px, 4vw, 96px); font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.pc-wrap {
  padding: clamp(56px, 8vw, 110px) var(--pad);
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: clamp(28px, 6vw, 96px); align-items: start;
}

.pc-title {
  margin: 0; padding-bottom: 0.12em; max-width: 20em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.pc .pc-title { color: #0f172a !important; }
.pc-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}
.pc-lead { margin: 18px 0 0; max-width: 26em; font-size: clamp(15px, 1.15vw, 17px); line-height: 1.65; color: #64748b; }

.pc-list { margin: 0; padding: 0; list-style: none; border-top: 1px solid #e4e4e9; }
.pc-item { display: flex; align-items: center; gap: 18px; padding: clamp(16px, 1.6vw, 22px) 4px; border-bottom: 1px solid #e4e4e9; }
.pc-ico { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: #f4f4f6; color: #0f172a; transition: background 0.3s, color 0.3s; }
.pc-ico svg { width: 21px; height: 21px; }
.pc-item:hover .pc-ico { background: #0f172a; color: #fff; }
.pc-t { font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(17px, 1.5vw, 22px); font-weight: 600; letter-spacing: -0.02em; line-height: 1.25; }
.pc .pc-t { color: #0f172a !important; }

/* ---------- reveal ---------- */
.pc-js .pc-head > *, .pc-js .pc-item { opacity: 0; translate: 0 20px; }
.pc-in .pc-head > *, .pc-in .pc-item { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.pc-in .pc-head > :nth-child(2) { transition-delay: 0.08s; }
.pc-in .pc-item { transition-delay: calc(0.1s + var(--i) * 0.08s); }

@media (max-width: 860px) {
  .pc-wrap { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .pc-js .pc-head > *, .pc-js .pc-item { opacity: 1; translate: 0 0; }
  .pc * { transition: none !important; }
}
</style>