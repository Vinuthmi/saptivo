<template>
  <section ref="rootEl" class="sz" :class="{ 'sz-js': mounted, 'sz-in': revealed }" aria-labelledby="sz-title">
    <div class="sz-wrap">
      <h2 id="sz-title" class="sz-title">Saptivo for every <em>size of business</em></h2>

      <ul class="sz-grid">
        <li v-for="(c, i) in cards" :key="c.id" class="sz-card" :class="`sz-${c.kind}`" :style="{ '--i': i }">
          <span class="sz-letter" aria-hidden="true">{{ c.letter }}</span>
          <span class="sz-ico" aria-hidden="true" v-html="c.icon"></span>
          <h3 class="sz-h">{{ c.title }}</h3>
          <p class="sz-p">{{ c.text }}</p>
        </li>
      </ul>

      <p class="sz-price">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
        Whatever your size, the price you see is the price you pay.
      </p>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'EverySizeSection' })
/**
 * SectionEverySize.vue — "Saptivo for every size of business": three cards that step up in height (small, growing,
 * larger), the last one dark, and a closing price line. Vue 3, <script setup>. No images. SSR safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const ic = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const cards = [
  {
    id: 's', kind: 'a', letter: 'S', title: 'Small teams',
    text: 'Small teams get a professional CRM without enterprise cost.',
    icon: ic('<circle cx="12" cy="8" r="3.500"/><path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/>'),
  },
  {
    id: 'm', kind: 'b', letter: 'M', title: 'Growing companies',
    text: 'Growing companies add branches, users and modules without switching systems.',
    icon: ic('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  },
  {
    id: 'l', kind: 'c', letter: 'L', title: 'Larger organisations',
    text: 'Larger organisations get advanced analytics, the customer portal and API access on an Enterprise plan tailored to their needs.',
    icon: ic('<rect x="4" y="3" width="10" height="18" rx="1.500"/><rect x="14" y="9" width="6" height="12" rx="1.500"/><path d="M7.500 7h3M7.500 11h3M7.500 15h3"/>'),
  },
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
.sz, .sz * { box-sizing: border-box; }
.sz { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.sz-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px); }

.sz-title {
  max-width: 20em; margin: 0; padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.sz .sz-title { color: #0f172a !important; }
.sz-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}

/* ---------- stepped cards ---------- */
.sz-grid { margin: clamp(26px, 3.4vw, 44px) 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: end; }
.sz-card { position: relative; overflow: hidden; isolation: isolate; display: flex; flex-direction: column; padding: 30px; border-radius: 28px; }
.sz-a { min-height: clamp(280px, 23vw, 330px); background: linear-gradient(140deg, #f3f3f5 0%, #e4e4e8 100%); }
.sz-b { min-height: clamp(340px, 28vw, 400px); background: linear-gradient(140deg, #e8ecef 0%, #d3dade 100%); }
.sz-c { min-height: clamp(400px, 33vw, 470px); background: linear-gradient(150deg, #2c2c31 0%, #19191c 100%); }

.sz-letter {
  position: absolute; z-index: -1; right: 18px; top: -18px; font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(150px, 15vw, 230px); font-weight: 600; line-height: 1; letter-spacing: -0.06em; color: rgba(23, 23, 43, 0.07);
  transition: translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sz-c .sz-letter { color: rgba(255, 255, 255, 0.08); }
.sz-card:hover .sz-letter { translate: -6px 8px; }

.sz-ico { display: grid; place-items: center; width: 50px; height: 50px; border-radius: 50%; background: #fff; color: #17172b; box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.25); }
.sz-ico svg { width: 23px; height: 23px; }
.sz-h { margin: auto 0 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(24px, 2.2vw, 32px); font-weight: 600; line-height: 1.12; letter-spacing: -0.03em; }
.sz-p { margin: 12px 0 0; max-width: 32ch; font-size: 14.5px; line-height: 1.6; }
.sz .sz-a .sz-h, .sz .sz-b .sz-h { color: #17172b !important; }
.sz .sz-a .sz-p, .sz .sz-b .sz-p { color: #3b3f4a !important; }
.sz .sz-c .sz-h { color: #fff !important; }
.sz .sz-c .sz-p { color: rgba(255, 255, 255, 0.84) !important; }

.sz-price {
  margin: 16px 0 0; display: flex; align-items: center; gap: 14px; padding: clamp(18px, 2vw, 28px) clamp(22px, 3vw, 40px); border-radius: 999px;
  border: 1px solid #e4e4e9; background: #f7f7f8; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(17px, 1.7vw, 25px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.3;
}
.sz .sz-price { color: #17172b !important; }
.sz-price svg { flex: none; width: 34px; height: 34px; padding: 8px; border-radius: 50%; background: #17172b; color: #fff; }

/* ---------- reveal ---------- */
.sz-js .sz-title, .sz-js .sz-card, .sz-js .sz-price { opacity: 0; translate: 0 24px; }
.sz-in .sz-title, .sz-in .sz-card, .sz-in .sz-price { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sz-in .sz-card { transition-delay: calc(0.1s + var(--i) * 0.1s); }
.sz-in .sz-price { transition-delay: 0.45s; }

@media (max-width: 900px) {
  .sz-grid { grid-template-columns: minmax(0, 1fr); align-items: stretch; }
  .sz-a, .sz-b, .sz-c { min-height: 260px; }
}
@media (max-width: 560px) {
  .sz-price { border-radius: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .sz-js .sz-title, .sz-js .sz-card, .sz-js .sz-price { opacity: 1; translate: 0 0; }
  .sz * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>