<template>
  <section ref="rootEl" class="pt" :class="{ 'pt-js': mounted, 'pt-in': revealed }" aria-labelledby="pt-title">
    <div class="pt-wrap">
      <h2 id="pt-title" class="pt-title">Why partners choose <em>Saptivo</em></h2>

      <ul class="pt-grid">
        <li
          v-for="(c, i) in cards"
          :key="c.id"
          class="pt-card"
          :class="[`pt-${c.kind}`, `pt-c${i}`]"
          :style="{ '--i': i }"
        >
          <img v-if="c.img && !failed[c.id]" class="pt-img" :src="c.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[c.id] = true" />
          <span v-if="c.kind === 'photo'" class="pt-shade" :class="`pt-t-${c.tone}`" aria-hidden="true"></span>
          <svg v-else class="pt-deco" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="c.icon"></svg>

          <div class="pt-body">
            <h3 class="pt-h">{{ c.title }}</h3>
            <p class="pt-p">{{ c.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'PartnersSection' })
/**
 * SectionPartners.vue — "Why partners choose Saptivo" in the same bento style as the multi-branch section, in soft
 * pastel colours with two photo cards that fade into a light pastel wash. Vue 3, <script setup>.
 * Photos fall back to a pastel gradient if a URL fails — swap `img` for your own. SSR safe.
 */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const cards = [
  {
    id: 'complete', kind: 'sky', title: 'A complete CRM, built in',
    text: 'A complete CRM with WhatsApp, 3CX, invoicing and field service already built in.',
    icon: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="4" rx="1.5"/><rect x="13" y="10" width="7" height="10" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/>',
  },
  {
    id: 'recurring', kind: 'mint', title: 'Recurring revenue',
    text: 'Recurring subscription revenue instead of one-off project fees.',
    icon: '<path d="M20 12a8 8 0 1 1-2.400-5.700"/><path d="M20 4v5h-5"/>',
  },
  {
    id: 'nothing', kind: 'photo', tone: 'peach', title: 'Nothing to build or host',
    text: 'No development, hosting or maintenance burden.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'since', kind: 'photo', tone: 'blue', title: 'Building software since 1997',
    text: 'Backing from Weblook International, building software since 1997.',
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'markets', kind: 'lilac', title: 'Made for your markets',
    text: 'A product designed for the markets your clients operate in.',
    icon: '<circle cx="12" cy="12" r="8.500"/><path d="M3.500 12h17M12 3.500c2.500 2.600 2.500 14.400 0 17M12 3.500c-2.500 2.600-2.500 14.400 0 17"/>',
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
.pt, .pt * { box-sizing: border-box; }
.pt { --pad: clamp(20px, 4vw, 96px); font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.pt-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px); }

.pt-title {
  max-width: 20em; margin: 0; padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.pt .pt-title { color: #0f172a !important; }
.pt-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}

/* ---------- bento ---------- */
.pt-grid {
  margin: clamp(26px, 3.4vw, 44px) 0 0; padding: 0; list-style: none;
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: clamp(250px, 21vw, 300px); gap: 16px;
}
.pt-c0 { grid-column: 1 / 3; }
.pt-c1 { grid-column: 3; }
.pt-c2 { grid-column: 1; }
.pt-c3 { grid-column: 4; grid-row: 1 / 3; }
.pt-c4 { grid-column: 2 / 4; }

.pt-card { position: relative; isolation: isolate; overflow: hidden; border-radius: 28px; display: flex; flex-direction: column; min-width: 0; }
.pt-js .pt-card { opacity: 0; translate: 0 26px; }
.pt-in .pt-card { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--i) * 0.09s); }

.pt-body { position: relative; z-index: 2; padding: 30px 30px 28px; display: flex; flex-direction: column; height: 100%; }
.pt-h { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(21px, 1.9vw, 28px); font-weight: 600; line-height: 1.15; letter-spacing: -0.03em; max-width: 14em; text-wrap: balance; }
.pt-p { margin: 12px 0 0; max-width: 34ch; font-size: 14px; line-height: 1.55; }

.pt-sky { background: linear-gradient(140deg, #eaf3fd 0%, #d4e6f9 100%); }
.pt-mint { background: linear-gradient(140deg, #eaf7f0 0%, #d0ebdc 100%); }
.pt-lilac { background: linear-gradient(140deg, #f1edfc 0%, #ddd5f6 100%); }
.pt .pt-sky .pt-h, .pt .pt-mint .pt-h, .pt .pt-lilac .pt-h { color: #1f2a44 !important; }
.pt .pt-sky .pt-p, .pt .pt-mint .pt-p, .pt .pt-lilac .pt-p { color: #4a5470 !important; }

.pt-deco { position: absolute; z-index: 0; right: -22px; bottom: -26px; width: 210px; height: 210px; opacity: 0.22; transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.pt-sky .pt-deco { color: #5b8fd0; }
.pt-mint .pt-deco { color: #4fa57b; }
.pt-lilac .pt-deco { color: #8a74d4; }
.pt-card:hover .pt-deco { transform: rotate(-6deg) scale(1.06); }
.pt-c1 .pt-deco { width: 150px; height: 150px; right: -26px; bottom: -28px; }
.pt-c4 .pt-deco { width: 250px; height: 250px; right: 20px; bottom: -50px; }

/* photo cards */
.pt-photo { background: linear-gradient(150deg, #dbe7f5, #c9d6ea); }
.pt-photo .pt-body { justify-content: flex-end; }
.pt-img { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.pt-card:hover .pt-img { scale: 1.05; }
.pt-shade { position: absolute; inset: 0; z-index: 1; }
.pt-t-peach { background: linear-gradient(180deg, rgba(255, 245, 238, 0) 28%, rgba(255, 240, 230, 0.82) 62%, rgba(254, 236, 224, 0.97) 100%); }
.pt-t-blue { background: linear-gradient(180deg, rgba(240, 247, 255, 0) 28%, rgba(232, 242, 253, 0.82) 62%, rgba(224, 237, 252, 0.97) 100%); }
.pt .pt-photo .pt-h { color: #1f2a44 !important; }
.pt .pt-photo .pt-p { color: #3f4a66 !important; }
.pt-c3 .pt-h { font-size: clamp(24px, 2.4vw, 32px); }

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .pt-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 260px; }
  .pt-c0 { grid-column: 1 / -1; grid-row: auto; }
  .pt-c1, .pt-c2 { grid-column: auto; grid-row: auto; }
  .pt-c3 { grid-column: 1 / -1; grid-row: auto; }
  .pt-c4 { grid-column: 1 / -1; }
}
@media (max-width: 620px) {
  .pt-grid { grid-template-columns: minmax(0, 1fr); grid-auto-rows: minmax(240px, auto); gap: 14px; }
  .pt-c0, .pt-c1, .pt-c2, .pt-c3, .pt-c4 { grid-column: 1 / -1; }
  .pt-card { min-height: 240px; border-radius: 24px; }
  .pt-body { padding: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .pt-js .pt-card { opacity: 1; translate: 0 0; }
  .pt * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>