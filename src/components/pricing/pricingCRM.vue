<template>
  <section ref="rootEl" class="sa" :class="{ 'sa-js': mounted, 'sa-in': revealed }" aria-labelledby="sa-title">
    <div class="sa-wrap">
      <h2 id="sa-title" class="sa-title">Why Saptivo is <em>affordable CRM software</em></h2>

      <ul class="sa-grid">
        <li
          v-for="(c, i) in cards"
          :key="c.id"
          class="sa-card"
          :class="[`sa-${c.kind}`, `sa-c${i}`]"
          :style="{ '--i': i }"
        >
          <img v-if="c.img && !failed[c.id]" class="sa-img" :src="c.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[c.id] = true" />
          <span v-if="c.kind === 'photo'" class="sa-shade" aria-hidden="true"></span>
          <svg v-else class="sa-deco" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="c.icon"></svg>

          <div class="sa-body">
            <h3 class="sa-h">{{ c.title }}</h3>
            <p class="sa-p">{{ c.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'AffordableSection' })
/**
 * SectionAffordable.vue — "Why Saptivo is affordable CRM software" in the same bento style as the multi-branch
 * section: ash colour cards plus two photo cards (swap the `img` URLs for your own photos).
 * Vue 3, <script setup>. Photos fall back to a dark gradient if a URL fails — swap `img` for your own. SSR safe.
 */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const cards = [
  {
    id: 'bill', kind: 'tint', title: 'Cheap until the bill arrives',
    text: 'Many CRMs look cheap until the setup invoice, the per-feature add-ons and the forced upgrade arrive.',
    icon: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  },
  {
    id: 'one', kind: 'slate', title: 'One clear subscription',
    text: 'You pay one clear subscription.',
    icon: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M9.5 10c0-1 1-1.700 2.500-1.700s2.500.7 2.500 1.700-1 1.500-2.500 1.900-2.500.9-2.500 1.900 1 1.700 2.500 1.700 2.500-.7 2.500-1.700"/>',
  },
  {
    id: 'included', kind: 'photo', title: 'Features are included',
    text: 'Features such as WhatsApp, 3CX and invoicing are part of the product rather than paid extras.',
    img: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'teams', kind: 'photo', title: 'Small teams to large ones',
    text: 'That makes Saptivo genuinely affordable CRM software for small teams and predictable for large ones.',
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'three', kind: 'sand', title: 'Saptivo removes all three',
    text: 'No setup invoice, no per-feature add-ons and no forced upgrade.',
    icon: '<path d="M12 3 4.500 6v5.500c0 4.500 3 7.700 7.500 9.500 4.500-1.800 7.500-5 7.500-9.500V6z"/><path d="m9 12 2.200 2.200L15.500 10"/>',
  },
]

const failed = reactive({})
const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
let io = null
onMounted(() => {
  mounted.value = true
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.1 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
.sa, .sa * { box-sizing: border-box; }
.sa { --pad: clamp(20px, 4vw, 96px); font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.sa-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px); }

.sa-title {
  max-width: 20em; margin: 0; padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.sa .sa-title { color: #0f172a !important; }
.sa-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}

/* ---------- bento ---------- */
.sa-grid {
  margin: clamp(26px, 3.4vw, 44px) 0 0; padding: 0; list-style: none;
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: clamp(250px, 21vw, 300px); gap: 16px;
}
.sa-c0 { grid-column: 1 / 3; }
.sa-c1 { grid-column: 3; }
.sa-c2 { grid-column: 1; }
.sa-c3 { grid-column: 4; grid-row: 1 / 3; }
.sa-c4 { grid-column: 2 / 4; }

.sa-card { position: relative; isolation: isolate; overflow: hidden; border-radius: 28px; display: flex; flex-direction: column; min-width: 0; }
.sa-js .sa-card { opacity: 0; translate: 0 26px; }
.sa-in .sa-card { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--i) * 0.09s); }

.sa-body { position: relative; z-index: 2; padding: 30px 30px 28px; display: flex; flex-direction: column; height: 100%; }
.sa-h { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(21px, 1.9vw, 28px); font-weight: 600; line-height: 1.15; letter-spacing: -0.03em; max-width: 14em; text-wrap: balance; }
.sa-p { margin: 12px 0 0; max-width: 34ch; font-size: 14px; line-height: 1.55; }

.sa-tint { background: linear-gradient(140deg, #f3f3f5 0%, #e4e4e8 100%); }
.sa-sand { background: linear-gradient(140deg, #f5f3f0 0%, #e8e4de 100%); }
.sa-slate { background: linear-gradient(140deg, #e8ecef 0%, #d3dade 100%); }
.sa .sa-tint .sa-h, .sa .sa-sand .sa-h, .sa .sa-slate .sa-h { color: #17172b !important; }
.sa .sa-tint .sa-p, .sa .sa-sand .sa-p, .sa .sa-slate .sa-p { color: #3b3f4a !important; }

.sa-deco { position: absolute; z-index: 0; right: -22px; bottom: -26px; width: 210px; height: 210px; opacity: 0.22; transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sa-tint .sa-deco { color: #52525b; }
.sa-sand .sa-deco { color: #8a7a6a; }
.sa-slate .sa-deco { color: #3d4d55; }
.sa-card:hover .sa-deco { transform: rotate(-6deg) scale(1.06); }
.sa-c1 .sa-deco { width: 150px; height: 150px; right: -26px; bottom: -28px; }
.sa-c4 .sa-deco { width: 250px; height: 250px; right: 20px; bottom: -50px; }

/* photo cards */
.sa-photo { background: linear-gradient(150deg, #3d4d55, #1c2a31); }
.sa-photo .sa-body { justify-content: flex-end; }
.sa-img { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sa-card:hover .sa-img { scale: 1.05; }
.sa-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(8, 11, 16, 0.12) 0%, rgba(8, 11, 16, 0.55) 45%, rgba(8, 11, 16, 0.92) 100%); }
.sa .sa-photo .sa-h { color: #fff !important; text-shadow: 0 2px 18px rgba(0, 0, 0, 0.7); }
.sa .sa-photo .sa-p { color: #fff !important; text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6); }
.sa-c3 .sa-h { font-size: clamp(24px, 2.4vw, 32px); }

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .sa-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 260px; }
  .sa-c0 { grid-column: 1 / -1; grid-row: auto; }
  .sa-c1, .sa-c2 { grid-column: auto; grid-row: auto; }
  .sa-c3 { grid-column: 1 / -1; grid-row: auto; }
  .sa-c4 { grid-column: 1 / -1; }
}
@media (max-width: 620px) {
  .sa-grid { grid-template-columns: minmax(0, 1fr); grid-auto-rows: minmax(240px, auto); gap: 14px; }
  .sa-c0, .sa-c1, .sa-c2, .sa-c3, .sa-c4 { grid-column: 1 / -1; }
  .sa-card { min-height: 240px; border-radius: 24px; }
  .sa-body { padding: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .sa-js .sa-card { opacity: 1; translate: 0 0; }
  .sa * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>