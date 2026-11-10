<template>
  <section ref="rootEl" class="ms" :class="{ 'ms-js': mounted, 'ms-in': revealed }" aria-labelledby="ms-title">
    <div class="ms-wrap">
      <h2 id="ms-title" class="ms-title">
        Built for businesses with <em>more than one branch, counter or crew</em>
      </h2>

      <ul class="ms-grid">
        <li
          v-for="(c, i) in cards"
          :key="c.id"
          class="ms-card"
          :class="[`ms-${c.kind}`, `ms-c${i}`]"
          :style="{ '--i': i }"
        >
          <img v-if="c.img && !failed[c.id]" class="ms-img" :src="c.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[c.id] = true" />
          <span v-if="c.kind === 'photo'" class="ms-shade" aria-hidden="true"></span>
          <svg v-else class="ms-deco" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="c.icon"></svg>

          <div class="ms-body">
            <span class="ms-cat">{{ c.cat }}</span>
            <h3 class="ms-h">{{ c.title }}</h3>
            <p class="ms-p">{{ c.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeMultiBranchSection' })
/**
 * SectionMultiBranch.vue — "Built for businesses with more than one branch, counter or crew"
 * Vue 3, <script setup>. Mixed bento: light colour cards, a dark card and photo cards.
 * Photos fall back to a gradient if a URL fails. Swap the `img` URLs below for your own. SSR / Nuxt safe.
 */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const cards = [
  {
    id: 'hq', kind: 'tint', cat: 'Head office', title: 'One head-office dashboard',
    text: 'Run one store or one hundred from a single head-office dashboard.',
    icon: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="4" rx="1.5"/><rect x="13" y="10" width="7" height="10" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/>',
  },
  {
    id: 'stock', kind: 'slate', cat: 'Stock sync', title: 'Stock stays in sync',
    text: 'Keep stock synced across warehouses and service vans.',
    icon: '<path d="M3.5 8 12 4l8.5 4v8L12 20l-8.5-4z"/><path d="M3.5 8 12 12l8.5-4M12 12v8"/>',
  },
  {
    id: 'roles', kind: 'photo', cat: 'Branch control', title: 'Role-based permissions',
    text: 'Set role-based permissions for each branch.',
    img: 'https://images.unsplash.com/photo-1753354868616-544973e405c9?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'revenue', kind: 'photo', cat: 'Live numbers', title: 'Consolidated revenue',
    text: 'See consolidated revenue without waiting for end-of-day reports.',
    img: 'https://images.unsplash.com/photo-1742836531271-98fd8151d257?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'grow', kind: 'sand', cat: 'Room to grow', title: 'Saptivo grows with you',
    text: 'Add users, branches and modules whenever you need them, with no upgrade fees.',
    icon: '<path d="M12 5v14M5 12h14"/>',
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
.ms, .ms * { box-sizing: border-box; }
.ms { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.ms-wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px);
}

.ms-title {
  max-width: 20em;
  margin: 0;
  padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.055em;
  text-wrap: balance;
}
.ms-title em {
  font-style: normal;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.ms-sub-unused {
  max-width: 760px;
  margin: 16px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1.1vw, 18px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.015em;
  color: #475569;
}

/* ---------- bento ---------- */
.ms-grid {
  margin: clamp(26px, 3.4vw, 44px) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: clamp(250px, 21vw, 290px);
  gap: 16px;
}
.ms-c0 { grid-column: 1 / 3; }
.ms-c1 { grid-column: 3; }
.ms-c2 { grid-column: 1; }
.ms-c3 { grid-column: 4; grid-row: 1 / 3; }
.ms-c4 { grid-column: 2 / 4; }

.ms-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 0;
}
.ms-js .ms-card { opacity: 0; translate: 0 26px; }
.ms-in .ms-card {
  opacity: 1;
  translate: 0 0;
  transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
  transition-delay: calc(var(--i) * 0.09s);
}

.ms-body { position: relative; z-index: 2; padding: 30px 30px 28px; display: flex; flex-direction: column; height: 100%; }
.ms-cat {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.75;
}
.ms-h {
  margin: 14px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(21px, 1.9vw, 28px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.03em;
}
.ms-p {
  margin: 10px 0 0;
  max-width: 34ch;
  font-size: 13.5px;
  line-height: 1.55;
  opacity: 0.8;
}

/* light colour cards */
.ms-tint { background: linear-gradient(140deg, #fff3ea 0%, #ffe3d0 100%); color: #1b1a26; }
.ms-sand { background: linear-gradient(140deg, #f6efe8 0%, #eadfd3 100%); color: #1b1a26; }
.ms-tint .ms-cat { color: #c2410c; opacity: 1; }
.ms-sand .ms-cat { color: #8f6a52; opacity: 1; }
.ms-slate { background: linear-gradient(140deg, #e8eef1 0%, #d3dfe4 100%); color: #1b1a26; }
.ms-slate .ms-cat { color: #3d4d55; opacity: 1; }
.ms-deco {
  position: absolute;
  z-index: 0;
  right: -22px;
  bottom: -26px;
  width: 210px;
  height: 210px;
  opacity: 0.22;
  transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ms-tint .ms-deco { color: #f2540c; }
.ms-sand .ms-deco { color: #8f6a52; }
.ms-slate .ms-deco { color: #3d4d55; }
.ms-card:hover .ms-deco { transform: rotate(-6deg) scale(1.06); }
.ms-c1 .ms-deco { width: 150px; height: 150px; right: -26px; bottom: -28px; }
.ms-c4 .ms-deco { width: 250px; height: 250px; right: 20px; bottom: -50px; }

/* photo cards */
.ms-photo { background: linear-gradient(150deg, #3d4d55, #1c2a31); color: #fff; }
.ms-photo .ms-body { justify-content: flex-end; }
.ms-img { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ms-card:hover .ms-img { scale: 1.05; }
.ms-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(10, 14, 20, 0) 30%, rgba(10, 14, 20, 0.78) 100%); }
.ms-photo .ms-cat { color: rgba(255, 255, 255, 0.85); opacity: 1; }
.ms-photo .ms-h { color: #fff; }
.ms-photo .ms-p { opacity: 0.88; }
.ms-c3 .ms-h { font-size: clamp(24px, 2.4vw, 32px); }

/* explicit text colours (win over any global heading / paragraph styles) */
.ms .ms-card .ms-h {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  max-width: 14em;
  text-wrap: balance;
}
.ms .ms-tint .ms-h, .ms .ms-sand .ms-h, .ms .ms-slate .ms-h { color: #17172b; }
.ms .ms-photo .ms-h { color: #fff; text-shadow: 0 2px 18px rgba(0, 0, 0, 0.7); }
.ms .ms-photo .ms-cat { color: #fff; text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5); }
.ms .ms-photo .ms-shade { background: linear-gradient(180deg, rgba(8, 11, 16, 0.12) 0%, rgba(8, 11, 16, 0.55) 45%, rgba(8, 11, 16, 0.92) 100%); }

/* descriptions */
.ms .ms-card .ms-p { max-width: 34ch; margin: 12px 0 0; font-size: 14px; line-height: 1.55; opacity: 1; }
.ms .ms-tint .ms-p, .ms .ms-sand .ms-p, .ms .ms-slate .ms-p { color: #3b3f4a; }

/* photo cards: all text white (Role-based permissions, Consolidated revenue) */
.ms .ms-photo .ms-cat,
.ms .ms-photo .ms-h,
.ms .ms-photo .ms-p { color: #fff !important; }
.ms .ms-photo .ms-p { text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6); }

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .ms-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 260px; }
  .ms-c0 { grid-column: 1 / -1; grid-row: auto; }
  .ms-c1, .ms-c2 { grid-column: auto; grid-row: auto; }
  .ms-c3 { grid-column: 1 / -1; grid-row: auto; }
  .ms-c4 { grid-column: 1 / -1; }
}
@media (max-width: 620px) {
  .ms-grid { grid-template-columns: minmax(0, 1fr); grid-auto-rows: minmax(240px, auto); gap: 14px; }
  .ms-c0, .ms-c1, .ms-c2, .ms-c3, .ms-c4 { grid-column: 1 / -1; }
  .ms-card { min-height: 240px; border-radius: 24px; }
  .ms-body { padding: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .ms * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>