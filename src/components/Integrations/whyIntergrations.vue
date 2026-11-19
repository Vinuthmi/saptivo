<template>
  <section class="ico" aria-labelledby="ico-title">
    <div class="ico-in">
      <h2 id="ico-title" class="ico-h">Popular integration combinations</h2>

      <div class="ico-grid">
        <article
          v-for="(c, i) in combos"
          :key="c.title"
          class="cd"
          :class="[c.tone, { shown: shown }]"
          :style="{ '--d': i * 110 + 'ms' }"
        >
          <!-- photo + colour wash -->
          <img v-if="c.tone === 'dark'" class="cd-photo" :src="c.img" alt="" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
          <span v-if="c.tone === 'dark'" class="cd-wash" aria-hidden="true"></span>

          <!-- the combination, as a glass panel on dark cards and a plain list on the light card -->
          <div class="cd-panel">
            <ul class="cd-list">
              <li v-for="it in c.items" :key="it">
                <i aria-hidden="true"></i>
                <span>{{ it }}</span>
              </li>
            </ul>
          </div>

          <div class="cd-foot">
            <h3 class="cd-t">{{ c.title }}</h3>
          </div>

          <!-- light card: photo sits at the bottom, like the plant in the reference -->
          <img v-if="c.tone === 'light'" class="cd-photo-b" :src="c.img" alt="" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'SectionIntegrationCombos' })

/* copy is exactly as supplied; photos are swappable */
const combos = [
  {
    title: 'Retailers',
    tone: 'dark',
    img: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=900&q=80&auto=format&fit=crop',
    items: ['WhatsApp receipts', 'Facebook leads', 'POS']
  },
  {
    title: 'Service companies',
    tone: 'light',
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900&q=80&auto=format&fit=crop',
    items: ['WhatsApp complaints', '3CX calls', 'Google Calendar for technician visits']
  },
  {
    title: 'B2B sales teams',
    tone: 'dark',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop',
    items: ['Website forms', 'Facebook leads', '3CX', 'Email sync']
  }
]

const shown = ref(false)
let io = null
onMounted(() => {
  const node = document.querySelector('.ico-grid')
  if (!('IntersectionObserver' in window) || !node) { shown.value = true; return }
  io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { shown.value = true; io.disconnect() }
  }, { threshold: 0.15 })
  io.observe(node)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');

.ico {
  --navy: #14243a;
  --orange: #ff6b16;
  --ivory: #f9f8f4;
  --beige: #f4f1de;
  background: #fff;
  padding: clamp(48px, 6vw, 88px) clamp(16px, 3vw, 40px);
  font-family: 'Urbanist', Arial, Helvetica, sans-serif;
  color: var(--navy);
}
.ico *, .ico *::before, .ico *::after { box-sizing: border-box; }

.ico-in { max-width: 1240px; margin: 0 auto; }

.ico-h {
  margin: 0 0 clamp(28px, 3.4vw, 44px);
  font-size: clamp(30px, 3.6vw, 44px);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.04em;
  color: #000;
}

.ico-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

/* ---------- card ---------- */
.cd {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: clamp(400px, 34vw, 470px);
  padding: 14px;
  border-radius: 22px;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.7s ease var(--d), transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) var(--d);
}
.cd.shown { opacity: 1; transform: none; }

.cd-photo {
  position: absolute; inset: 0; z-index: -2;
  width: 100%; height: 100%; object-fit: cover;
}
.cd-wash {
  position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(180deg, rgba(28, 50, 80, 0.72) 0%, rgba(20, 36, 58, 0.78) 45%, rgba(12, 22, 38, 0.92) 100%);
}
.cd.dark { background: var(--navy); color: #fff; }

/* the combination panel */
.cd-panel {
  padding: 18px 18px 16px;
  border-radius: 16px;
}
.cd.dark .cd-panel {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}
.cd-eyebrow {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}
.cd-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; }
.cd-list li {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 0;
  font-size: 16px; font-weight: 500; line-height: 1.3;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
}
.cd-list li:first-child { border-top: 0; padding-top: 0; }
.cd-list i {
  flex: none; width: 8px; height: 8px; border-radius: 50%;
  background: var(--orange);
}

.cd-foot { position: relative; padding: 4px 6px 8px; }
.cd-t {
  margin: 0;
  font-size: clamp(26px, 2.6vw, 34px);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.04em;
}
.cd.dark .cd-t { color: #fff; }

/* ---------- light card ---------- */
.cd.light {
  background: var(--ivory);
  border: 1px solid #ece9df;
  color: var(--navy);
}
.cd.light .cd-list li { border-top-color: #e4e0d2; color: var(--navy); }
.cd.light .cd-t { color: #000; position: relative; z-index: 2; }
.cd.light { justify-content: flex-start; }
.cd.light .cd-foot { order: -1; padding: 10px 12px 0; }
.cd.light .cd-panel { padding: 10px 12px 0; }

.cd-photo-b {
  position: absolute; z-index: -1;
  left: 0; right: 0; bottom: 0;
  width: 100%; height: 52%;
  object-fit: cover; object-position: center;
  -webkit-mask: linear-gradient(to bottom, transparent 0%, #000 42%);
  mask: linear-gradient(to bottom, transparent 0%, #000 42%);
}

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .ico-grid { grid-template-columns: 1fr; }
  .cd { min-height: 340px; }
  .cd.light { min-height: 400px; }
}

@media (prefers-reduced-motion: reduce) {
  .cd { opacity: 1; transform: none; transition: none; }
}
</style>