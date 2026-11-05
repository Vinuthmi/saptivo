<template>
  <section ref="rootEl" class="ms" :class="{ 'ms-in': revealed }" aria-labelledby="ms-title">
    <div class="ms-wrap">
      <h2 id="ms-title" class="ms-title">
        Built for businesses with <em>more than one branch, counter or crew</em>
      </h2>

      <ul class="ms-list">
        <li v-for="(f, i) in features" :key="f.title" class="ms-row" :style="{ '--i': i }">
          <span class="ms-ic">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" v-html="f.icon"></svg>
          </span>
          <div class="ms-tx">
            <h3>{{ f.title }}</h3>
            <p>{{ f.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeMultiBranchSimpleSection' })
/**
 * MultiBranchSimple.vue — "Built for businesses with more than one branch, counter or crew"
 * Vue 3, <script setup>. Heading on the left, five clean rows on the right. Only the given copy. SSR/Nuxt safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const features = [
  {
    title: 'One head-office dashboard',
    text: 'Run one store or one hundred from a single head-office dashboard.',
    icon: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="4" rx="1.5"/><rect x="13" y="10" width="7" height="10" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/>',
  },
  {
    title: 'Role-based permissions',
    text: 'Set role-based permissions for each branch.',
    icon: '<path d="M12 3.5 19 6v5.5c0 4.2-2.8 7.6-7 9-4.2-1.4-7-4.8-7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  },
  {
    title: 'Stock stays in sync',
    text: 'Keep stock synced across warehouses and service vans.',
    icon: '<path d="M3.5 8 12 4l8.5 4v8L12 20l-8.5-4z"/><path d="M3.5 8 12 12l8.5-4M12 12v8"/>',
  },
  {
    title: 'Consolidated revenue',
    text: 'See consolidated revenue without waiting for end-of-day reports.',
    icon: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  },
  {
    title: 'Saptivo grows with you',
    text: 'Add users, branches and modules whenever you need them, with no upgrade fees.',
    icon: '<path d="M12 5v14M5 12h14"/>',
  },
]

const rootEl = ref(null)
const revealed = ref(false)
let io = null
onMounted(() => {
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.2 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
.ms, .ms * { box-sizing: border-box; }
.ms { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.ms-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  align-items: center;
  gap: clamp(32px, 6vw, 96px);
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(56px, 8vw, 112px) clamp(16px, 3vw, 32px);
}

.ms-title {
  margin: 0;
  padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(34px, 3.7vw, 56px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.06em;
  text-wrap: balance;
}
.ms-title em {
  display: inline;
  font-style: normal;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ms-list { margin: 0; padding: 0; list-style: none; border-top: 1px solid #ececf0; }
.ms-row {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 22px 8px;
  border-bottom: 1px solid #ececf0;
  opacity: 0;
  translate: 0 18px;
  transition: opacity 0.7s ease, translate 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.3s ease, padding 0.3s ease;
  transition-delay: calc(var(--i) * 0.1s);
}
.ms-in .ms-row { opacity: 1; translate: 0 0; }
.ms-row:hover { background: #fff8f4; padding-left: 16px; transition-delay: 0s; }

.ms-ic {
  flex: none;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #fff1ea;
  color: #f2540c;
  transition: background 0.3s ease, color 0.3s ease;
}
.ms-row:hover .ms-ic { background: #f2540c; color: #fff; }

.ms-tx h3 { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(18px, 1.5vw, 21px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.25; }
.ms-tx p { margin: 6px 0 0; font-size: 15px; line-height: 1.6; color: #64748b; }

@media (max-width: 900px) {
  .ms-wrap { grid-template-columns: minmax(0, 1fr); }
  .ms-title { text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .ms * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>
