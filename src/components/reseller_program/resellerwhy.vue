<template>
  <section ref="rootEl" class="ry" :class="{ 'ry-js': mounted, 'ry-in': revealed }" aria-labelledby="ry-title">
    <div class="ry-wrap">
      <h2 id="ry-title" class="ry-title">Why partners choose Saptivo</h2>

      <ul class="ry-grid">
        <li v-for="(c, i) in cards" :key="c.t" class="ry-card" :class="[`ry-${c.kind}`, `ry-c${i}`]" :style="{ '--i': i }">
          <svg class="ry-deco" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path v-for="d in c.icon" :key="d" :d="d" /></svg>
          <h3 class="ry-h">{{ c.t }}</h3>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'ResellerWhy' })

/** "Why partners choose Saptivo": five bento cards, copy exactly as supplied (same bento style as the other Saptivo sections). */
const cards = [
  { kind: 'sand', t: 'A complete CRM with WhatsApp, 3CX, invoicing and field service already built in',
    icon: ['M4 4h7v7H4Z', 'M13 4h7v4h-7Z', 'M13 10h7v10h-7Z', 'M4 13h7v7H4Z'] },
  { kind: 'grey', t: 'Recurring subscription revenue instead of one-off project fees',
    icon: ['M4 12a8 8 0 0 1 13.700-5.600L20 8.500', 'M20 4v4.500h-4.500', 'M20 12a8 8 0 0 1-13.700 5.600L4 15.500', 'M4 20v-4.500h4.500'] },
  { kind: 'black', t: 'No development, hosting or maintenance burden',
    icon: ['M7 18a4 4 0 0 1-.6-7.960A5.500 5.500 0 0 1 17 9a4.500 4.500 0 0 1 .5 9Z', 'M9 14.500l2 2 4-4'] },
  { kind: 'grey', t: 'Backing from Weblook International, building software since 1997',
    icon: ['M12 3 5 6v5.500c0 4.200 2.900 7.500 7 9.500 4.100-2 7-5.300 7-9.500V6Z', 'M9 12l2.200 2.200L15.500 10'] },
  { kind: 'sand', t: 'A product designed for the markets your clients operate in',
    icon: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M3 12h18', 'M12 3c2.500 2.700 3.800 5.700 3.800 9s-1.300 6.300-3.800 9c-2.500-2.700-3.800-5.700-3.800-9S9.500 5.700 12 3Z'] },
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
.ry, .ry * { box-sizing: border-box; }
.ry { font-family: 'Urbanist', system-ui, sans-serif; color: #17191d; background: #fff; }
.ry-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px); }
.ry-title { margin: 0; padding-bottom: 0.12em; font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; color: #0a0a0a; }

.ry-grid { margin: clamp(26px, 3.4vw, 44px) 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: clamp(230px, 19vw, 270px); gap: 16px; }
.ry-c0 { grid-column: 1 / 3; }
.ry-c1 { grid-column: 3; }
.ry-c2 { grid-column: 4; grid-row: 1 / 3; }
.ry-c3 { grid-column: 1 / 3; }
.ry-c4 { grid-column: 3; }

.ry-card { position: relative; isolation: isolate; overflow: hidden; min-width: 0; padding: 30px; border-radius: 28px; }
.ry-sand { background: #f4f1de; }
.ry-grey { background: #f4f4f5; }
.ry-black { background: #17191d; color: #fff; }
.ry-h { position: relative; z-index: 2; margin: 0; max-width: 14em; font-size: clamp(22px, 2vw, 30px); font-weight: 600; line-height: 1.15; letter-spacing: -0.03em; color: #17191d; text-wrap: balance; }
.ry-black .ry-h { color: #fff; }
.ry-c2 .ry-h { font-size: clamp(26px, 2.6vw, 36px); }

.ry-deco { position: absolute; z-index: 0; right: -18px; bottom: -22px; width: 150px; height: 150px; opacity: 0.22; color: #ff6b16; transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ry-c0 .ry-deco, .ry-c3 .ry-deco { width: 240px; height: 240px; right: 20px; bottom: -46px; }
.ry-c2 .ry-deco { width: 230px; height: 230px; right: -30px; bottom: -30px; opacity: 0.5; }
.ry-card:hover .ry-deco { transform: rotate(-6deg) scale(1.06); }

.ry-js .ry-card { opacity: 0; translate: 0 26px; }
.ry-in .ry-card { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--i) * 0.09s); }

@media (max-width: 1000px) {
  .ry-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 240px; }
  .ry-c0, .ry-c1, .ry-c2, .ry-c3, .ry-c4 { grid-column: auto; grid-row: auto; }
  .ry-c0, .ry-c3 { grid-column: 1 / -1; }
}
@media (max-width: 620px) {
  .ry-grid { grid-template-columns: minmax(0, 1fr); grid-auto-rows: minmax(200px, auto); gap: 12px; }
  .ry-c0, .ry-c3 { grid-column: auto; }
  .ry-card { min-height: 200px; padding: 24px; border-radius: 24px; }
}
@media (prefers-reduced-motion: reduce) { .ry * { transition: none !important; } }
</style>