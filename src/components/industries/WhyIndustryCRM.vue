<template>
  <section ref="root" class="wy" :class="{ 'wy-arm': armed, 'wy-in': shown }" aria-labelledby="wy-title">
    <div class="wy-wrap">
      <!-- left: heading, copy, closing line -->
      <div class="wy-left">
        <div class="wy-top">
          <h2 id="wy-title" class="wy-title">Why choose an <span>industry-specific</span> CRM</h2>
          <p class="wy-sub">
            A generic CRM gives you empty boxes to fill. An industry-specific CRM arrives with the fields, stages and
            reports your business already uses.
          </p>
        </div>
        <p class="wy-end">
          That means faster setup, quicker adoption by staff and reports that answer the questions your industry
          actually asks.
        </p>
      </div>

      <!-- centre: tall photo -->
      <figure class="wy-photo">
        <img v-if="photo && !failed" class="wy-img" :src="photo" alt="" loading="lazy" decoding="async" draggable="false" @error="failed = true" />
      </figure>

      <!-- right: the four examples from the copy -->
      <ul class="wy-list">
        <li v-for="(it, i) in items" :key="it[0]" class="wy-item" :style="{ '--i': i }">
          <h3>{{ it[0] }}</h3>
          <p>{{ it[1] }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
/**
 * WhyIndustryCrm.vue — "Why choose an industry-specific CRM" (Vue 3, <script setup>)
 *
 * Layout from the reference on a plain white background: heading and copy on the left, one tall rounded photo in
 * the middle, and a ruled list on the right. The right-hand list is the four examples from your paragraph
 * (loyalty tiers / credit limits / milestones / maintenance contracts, each with the business it is for); the line
 * at the bottom left is the last sentence of your paragraph. No other text was added.
 * • Blocks rise in on scroll (staggered); the photo slowly zooms in with the reveal. prefers-reduced-motion respected.
 * • Photo: pass `photo` (any image URL). If it fails to load the card stays a flat pastel. SSR / Nuxt safe.
 * The previous overlapping-cards version is saved as WhyIndustryCrm.cards.vue.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'WhyIndustryCrm' })

defineProps({
  photo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80&auto=format&fit=crop',
  },
})

const items = [
  ['Loyalty tiers', 'For retailers.'],
  ['Credit limits', 'For distributors.'],
  ['Milestones', 'For contractors.'],
  ['Maintenance contracts', 'For service companies.'],
]
const failed = ref(false)

const root = ref(null)
const armed = ref(false)
const shown = ref(false)
let io = null
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = true
    return
  }
  armed.value = true
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true
        io.disconnect()
      }
    },
    { threshold: 0.2 },
  )
  io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Urbanist:wght@500;600&display=swap');
</style>

<style scoped>
.wy {
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  padding: clamp(40px, 6vw, 96px) clamp(16px, 4vw, 56px);
  background: #fff;
  color: #0a0a0a;
  font-family: 'Poppins', system-ui, sans-serif;
}
.wy *,
.wy *::before,
.wy *::after {
  box-sizing: border-box;
}
.wy-wrap {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1fr);
  gap: clamp(28px, 4.5vw, 64px);
  align-items: stretch;
}

/* ---------- left ---------- */
.wy-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 36px;
}
.wy-title {
  margin: 0;
  font-family: Urbanist, "Urbanist Placeholder", sans-serif !important;
  font-size: clamp(38px, 3.9vw, 54px) !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
  letter-spacing: -1px !important;
  color: #0a0a0a !important;
}
.wy-title span {
  background: none !important;
  color: #615f5a !important;
  -webkit-text-fill-color: #615f5a !important;
  white-space: nowrap;
}
.wy-sub,
.wy-end {
  max-width: 400px;
  margin: 18px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1.15vw, 18px);
  font-weight: 500;
  line-height: 1.65;
  letter-spacing: -0.015em;
  color: #5b6472;
}
.wy-end {
  margin: 0;
  padding-top: 18px;
  border-top: 1px solid #ececef;
  color: #0a0a0a;
}

/* ---------- photo ---------- */
.wy-photo {
  position: relative;
  margin: 0;
  min-height: clamp(420px, 50vw, 700px);
  border-radius: clamp(16px, 1.6vw, 22px);
  background: #e8e2d6;
  overflow: hidden;
  isolation: isolate;
}
.wy-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.6s var(--ease);
}
.wy-photo:hover .wy-img {
  transform: scale(1.04);
}

/* ---------- right list ---------- */
.wy-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.wy-item {
  padding: clamp(22px, 2.6vw, 34px) 0;
  border-bottom: 1px solid #e6e7ea;
  transition: border-color 0.4s ease;
}
.wy-item:first-child {
  padding-top: 0;
}
.wy-item:hover {
  border-bottom-color: #0a0a0a;
}
.wy-item h3 {
  margin: 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(22px, 2vw, 28px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.03em;
}
.wy-item p {
  margin: 8px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1.1vw, 17px);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: #5b6472;
}

/* ---------- motion ---------- */
.wy-arm .wy-left,
.wy-arm .wy-item {
  opacity: 0;
  translate: 0 30px;
}
.wy-arm .wy-photo {
  opacity: 0;
}
.wy-arm .wy-img {
  scale: 1.12;
}
.wy-arm.wy-in .wy-left {
  opacity: 1;
  translate: 0 0;
  transition: opacity 0.9s var(--ease), translate 1.1s var(--ease);
}
.wy-arm.wy-in .wy-photo {
  opacity: 1;
  transition: opacity 1s var(--ease) 0.15s;
}
.wy-arm.wy-in .wy-img {
  scale: 1;
  transition: scale 1.8s var(--ease) 0.15s, transform 1.6s var(--ease);
}
.wy-arm.wy-in .wy-item {
  opacity: 1;
  translate: 0 0;
  transition: opacity 0.9s var(--ease), translate 1.1s var(--ease), border-color 0.4s ease;
  transition-delay: calc(0.3s + var(--i) * 0.12s), calc(0.3s + var(--i) * 0.12s), 0s;
}

/* ---------- responsive ---------- */
@media (max-width: 980px) {
  .wy-wrap {
    grid-template-columns: minmax(0, 1fr);
  }
  .wy-left {
    gap: 24px;
  }
  .wy-photo {
    min-height: clamp(320px, 80vw, 520px);
    order: 2;
  }
  .wy-list {
    order: 3;
  }
  .wy-item:first-child {
    padding-top: clamp(22px, 2.6vw, 34px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .wy *,
  .wy *::before,
  .wy *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>