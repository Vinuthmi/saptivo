<template>
  <section ref="rootEl" class="wc" :class="{ 'wc-js': mounted, 'wc-in': revealed }" aria-labelledby="wc-title">
    <div class="wc-wrap">
      <!-- featured photo card -->
      <article class="wc-hero" style="--i: 0">
        <img v-if="!failed" class="wc-img" :src="photo" alt="" loading="lazy" decoding="async" draggable="false" @error="failed = true" />
        <span class="wc-shade" aria-hidden="true"></span>

        <div class="wc-hero-body">
          <h2 id="wc-title" class="wc-title">What your clients get</h2>
          <p class="wc-lead">Your clients get a proven, secure CRM with local support, and you become the trusted adviser who made their business more organised.</p>
        </div>
      </article>

      <!-- three smaller cards -->
      <ul class="wc-row">
        <li class="wc-card wc-grey" style="--i: 1">
          <span class="wc-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4.5 6v5.5c0 4.5 3 7.7 7.5 9.5 4.5-1.8 7.5-5 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>
          </span>
          <h3 class="wc-h">A proven, secure CRM</h3>
        </li>

        <li class="wc-card wc-grey" style="--i: 2">
          <span class="wc-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/></svg>
          </span>
          <h3 class="wc-h">Local support for your clients</h3>
        </li>

        <li class="wc-card wc-quote" style="--i: 3">
          <span class="wc-qmark" aria-hidden="true">“</span>
          <p class="wc-q">Many partners bundle Saptivo with their own services, such as website design, phone systems or IT support, to increase the value of every client relationship.</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'SectionWhatClientsGet' })
/**
 * SectionWhatClientsGet.vue — "What your clients get": one large photo card with the heading and lead,
 * then three smaller cards (two light, one outlined quote card). Vue 3, <script setup>, SSR safe.
 * Swap `photo` for your own image; the card falls back to a dark gradient if the URL fails.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const photo = 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1800&q=80&auto=format&fit=crop'

const failed = ref(false)
const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
let io = null

onMounted(() => {
  mounted.value = true
  if (!('IntersectionObserver' in window)) { revealed.value = true; return }
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.1 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
.wc, .wc * { box-sizing: border-box; }
.wc { background: #fff; font-family: 'Urbanist', system-ui, sans-serif; color: #0a0a0a; }
.wc-wrap { max-width: 1320px; margin: 0 auto; padding: clamp(40px, 6vw, 88px) clamp(10px, 1.3vw, 24px); display: grid; gap: 20px; }

.wc-js .wc-hero, .wc-js .wc-card { opacity: 0; translate: 0 26px; }
.wc-in .wc-hero, .wc-in .wc-card { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--i) * 0.1s); }

/* ---------- featured photo card ---------- */
.wc-hero {
  position: relative; isolation: isolate; overflow: hidden; display: flex; align-items: flex-end;
  min-height: clamp(460px, 42vw, 580px); border-radius: clamp(24px, 2.6vw, 36px);
  background: linear-gradient(150deg, #4a5667, #14243a);
}
.wc-img { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.08); transition: scale 1.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
.wc-hero:hover .wc-img { scale: 1.04; }
.wc-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(10, 14, 20, 0.22) 0%, rgba(10, 14, 20, 0.14) 32%, rgba(10, 14, 20, 0.62) 62%, rgba(10, 14, 20, 0.88) 100%); }


.wc-hero-body { position: relative; z-index: 2; padding: clamp(22px, 2.8vw, 40px); max-width: 860px; }
.wc-title { margin: 0; font-size: clamp(36px, 4.6vw, 66px); font-weight: 600; line-height: 1.04; letter-spacing: -0.035em; text-wrap: balance; }
.wc-lead { margin: 18px 0 0; max-width: 640px; font-size: clamp(16px, 1.5vw, 21px); font-weight: 500; line-height: 1.5; text-wrap: pretty; }

/* ---------- smaller cards ---------- */
.wc-row { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.wc-card { position: relative; display: flex; flex-direction: column; justify-content: space-between; min-height: clamp(260px, 22vw, 320px); padding: clamp(22px, 2.6vw, 38px); border-radius: clamp(22px, 2.4vw, 32px); min-width: 0; }
.wc-grey { background: #f4f4f4; transition: background 0.3s ease, transform 0.4s ease; }
.wc-grey:hover { background: #eef1f6; transform: translateY(-3px); }
.wc-ico { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 16px; background: #fff; color: #14243a; box-shadow: 0 6px 18px -10px rgba(20, 36, 58, 0.4); }
.wc-ico svg { width: 26px; height: 26px; }
.wc-h { margin: 0; max-width: 11em; font-size: clamp(24px, 2.2vw, 32px); font-weight: 600; line-height: 1.12; letter-spacing: -0.03em; color: #0a0a0a; text-wrap: balance; }

.wc-quote { background: #fff; border: 1px solid #ececec; justify-content: flex-start; gap: 6px; }
.wc-qmark { font-size: 64px; font-weight: 700; line-height: 0.8; height: 34px; color: #14243a; }
.wc-q { margin: 8px 0 0; font-size: clamp(19px, 1.7vw, 24px); font-weight: 500; line-height: 1.35; letter-spacing: -0.02em; color: #0a0a0a; text-wrap: pretty; }

/* keep colours even when the site's global styles colour headings and paragraphs */
.wc .wc-hero .wc-title, .wc .wc-hero .wc-lead { color: #fff !important; -webkit-text-fill-color: #fff !important; }
.wc .wc-card .wc-h, .wc .wc-card .wc-q, .wc .wc-card .wc-qmark { color: #0a0a0a !important; -webkit-text-fill-color: #0a0a0a !important; }

@media (max-width: 900px) {
  .wc-row { grid-template-columns: minmax(0, 1fr); }
  .wc-card { min-height: 220px; }
}
@media (max-width: 520px) {
  .wc-hero { min-height: 480px; }
  .wc-wrap { gap: 14px; } .wc-row { gap: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .wc-js .wc-hero, .wc-js .wc-card { opacity: 1; translate: 0 0; }
  .wc * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>