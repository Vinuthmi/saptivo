<template>
  <section ref="rootEl" class="sb" :class="{ 'sb-js': mounted, 'sb-in': revealed }" aria-labelledby="sb-title">
    <div class="sb-wrap">
      <h2 id="sb-title" class="sb-title">Security controls <em>you manage</em></h2>

      <ul class="sb-grid">
        <li
          v-for="(c, i) in cards"
          :key="c.id"
          class="sb-card"
          :class="[`sb-${c.kind}`, `sb-c${i}`]"
          :style="{ '--i': i }"
        >
          <!-- photo cards -->
          <img v-if="c.img && !failed[c.id]" class="sb-img" :src="c.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[c.id] = true" />
          <span v-if="c.kind === 'photo'" class="sb-shade" aria-hidden="true"></span>
          <svg v-else class="sb-deco" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="c.icon"></svg>

          <div class="sb-body">
            <h3 class="sb-h">{{ c.title }}</h3>
            <p class="sb-p">{{ c.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'SecurityBento' })
/**
 * SectionSecurityBento.vue — "Security controls you manage" in the same bento style as the multi-branch section:
 * light colour cards and a dark card, with two photo cards (the tall one and the wide one). Vue 3, <script setup>.
 * The photo falls back to a dark gradient if the URL fails — swap `img` for your own. SSR safe.
 */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const cards = [
  {
    id: 'roles', kind: 'tint', title: 'Roles that fit your team',
    text: 'Create roles that match your organisation chart.',
    icon: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1"/><circle cx="18" cy="9" r="2.5"/><path d="M18 14c2.2 0 3.5 1.6 3.5 3.5V19"/>',
  },
  {
    id: 'export', kind: 'slate', title: 'Export or view only',
    text: 'Decide who can export data and who can only view it.',
    icon: '<path d="M12 3v12M7 10.5l5 5 5-5"/><path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',
  },
  {
    id: 'devices', kind: 'sand', title: 'Approved logins only',
    text: 'Limit logins to approved devices or office IP addresses.',
    icon: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="m9.5 10 1.8 1.8 3.5-3.5"/>',
  },
  {
    id: 'audit', kind: 'photo', title: 'A full audit log',
    text: 'Review the audit log for any record or user.',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'offboard', kind: 'photo', title: 'One-click offboarding',
    text: "Remove a departing employee's access in one click.",
    img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80&auto=format&fit=crop',
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
.sb, .sb * { box-sizing: border-box; }
.sb { --pad: clamp(20px, 5vw, 80px); font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.sb-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px); }

.sb-title {
  max-width: 20em; margin: 0; padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.sb .sb-title { color: #0f172a !important; }
.sb-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}

/* ---------- bento ---------- */
.sb-grid {
  margin: clamp(26px, 3.4vw, 44px) 0 0; padding: 0; list-style: none;
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: clamp(250px, 21vw, 300px); gap: 16px;
}
.sb-c0 { grid-column: 1 / 3; }
.sb-c1 { grid-column: 3; }
.sb-c2 { grid-column: 1; }
.sb-c3 { grid-column: 4; grid-row: 1 / 3; }
.sb-c4 { grid-column: 2 / 4; }

.sb-card { position: relative; isolation: isolate; overflow: hidden; border-radius: 28px; display: flex; flex-direction: column; min-width: 0; }
.sb-js .sb-card { opacity: 0; translate: 0 26px; }
.sb-in .sb-card { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--i) * 0.09s); }

.sb-body { position: relative; z-index: 2; padding: 30px 30px 28px; display: flex; flex-direction: column; height: 100%; }
.sb-h { margin: 0; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(21px, 1.9vw, 28px); font-weight: 600; line-height: 1.15; letter-spacing: -0.03em; max-width: 14em; text-wrap: balance; }
.sb-p { margin: 12px 0 0; max-width: 34ch; font-size: 14px; line-height: 1.55; }

/* light + dark colour cards (ash) */
.sb-tint { background: linear-gradient(140deg, #f3f3f5 0%, #e4e4e8 100%); }
.sb-sand { background: linear-gradient(140deg, #f5f3f0 0%, #e8e4de 100%); }
.sb-slate { background: linear-gradient(140deg, #e8ecef 0%, #d3dade 100%); }
.sb-dark { background: linear-gradient(150deg, #2c2c31 0%, #19191c 100%); }
.sb .sb-tint .sb-h, .sb .sb-sand .sb-h, .sb .sb-slate .sb-h { color: #17172b !important; }
.sb .sb-tint .sb-p, .sb .sb-sand .sb-p, .sb .sb-slate .sb-p { color: #3b3f4a !important; }
.sb .sb-dark .sb-h { color: #fff !important; }
.sb .sb-dark .sb-p { color: rgba(255, 255, 255, 0.82) !important; }

.sb-deco { position: absolute; z-index: 0; right: -22px; bottom: -26px; width: 210px; height: 210px; opacity: 0.22; transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sb-tint .sb-deco { color: #52525b; }
.sb-sand .sb-deco { color: #8a7a6a; }
.sb-slate .sb-deco { color: #3d4d55; }
.sb-dark .sb-deco { color: #fff; opacity: 0.16; }
.sb-card:hover .sb-deco { transform: rotate(-6deg) scale(1.06); }
.sb-c1 .sb-deco { width: 150px; height: 150px; right: -26px; bottom: -28px; }
.sb-c4 .sb-deco { width: 250px; height: 250px; right: 20px; bottom: -50px; }

/* the one photo card */
.sb-photo { background: linear-gradient(150deg, #4a4f5a, #1a1c21); }
.sb-photo .sb-body { justify-content: flex-end; }
.sb-img { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sb-card:hover .sb-img { scale: 1.05; }
.sb-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(8, 11, 16, 0.12) 0%, rgba(8, 11, 16, 0.55) 45%, rgba(8, 11, 16, 0.92) 100%); }
.sb .sb-photo .sb-h { color: #fff !important; text-shadow: 0 2px 18px rgba(0, 0, 0, 0.7); font-size: clamp(24px, 2.4vw, 32px); }
.sb .sb-photo .sb-p { color: #fff !important; text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6); }

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .sb-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 260px; }
  .sb-c0 { grid-column: 1 / -1; grid-row: auto; }
  .sb-c1, .sb-c2 { grid-column: auto; grid-row: auto; }
  .sb-c3 { grid-column: 1 / -1; grid-row: auto; }
  .sb-c4 { grid-column: 1 / -1; }
}
@media (max-width: 620px) {
  .sb-grid { grid-template-columns: minmax(0, 1fr); grid-auto-rows: minmax(240px, auto); gap: 14px; }
  .sb-c0, .sb-c1, .sb-c2, .sb-c3, .sb-c4 { grid-column: 1 / -1; }
  .sb-card { min-height: 240px; border-radius: 24px; }
  .sb-body { padding: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .sb-js .sb-card { opacity: 1; translate: 0 0; }
  .sb * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>