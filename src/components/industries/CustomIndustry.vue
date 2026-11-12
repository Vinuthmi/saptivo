<template>
  <section ref="rootEl" class="ic" :class="{ 'ic-js': mounted, 'ic-in': revealed }" aria-labelledby="ic-title">
    <div class="ic-wrap">
      <div class="ic-head">
        <div class="ic-l">
          <h2 id="ic-title" class="ic-title">Don't see your industry?</h2>
          <a class="ic-btn" :href="ctaHref">Book a demo</a>
        </div>
        <p class="ic-desc">
          Saptivo's custom fields, pipelines and workflow automation adapt to almost any business that sells, quotes and serves customers. Tell us how you work and we'll show you Saptivo configured for it.
        </p>
      </div>

      <ul class="ic-cards">
        <li class="ic-card ic-c0" style="--i: 0">
          <h3 class="ic-h">Custom fields</h3>

          <!-- photo (falls back to the illustration if it cannot load) -->
          <img v-if="!imgFailed" class="ic-photo" :src="photo" alt="" loading="lazy" decoding="async" draggable="false" @error="imgFailed = true" />
          <span v-if="!imgFailed" class="ic-wash" aria-hidden="true"></span>
          <svg v-else class="ic-art" viewBox="0 0 220 230" aria-hidden="true">
            <defs>
              <linearGradient id="ic-coin" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#f3faff" />
                <stop offset="1" stop-color="#9fc6ea" />
              </linearGradient>
              <linearGradient id="ic-petal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#5b86b6" />
                <stop offset="1" stop-color="#1b3554" />
              </linearGradient>
            </defs>
            <ellipse cx="118" cy="222" rx="104" ry="14" fill="#80aad3" opacity=".55" />
            <circle cx="96" cy="170" r="58" fill="url(#ic-coin)" />
            <circle cx="96" cy="170" r="46" fill="none" stroke="#5b86b6" stroke-width="2" opacity=".8" />
            <path d="M150 218C150 170 156 120 160 70" fill="none" stroke="#3f6593" stroke-width="4" stroke-linecap="round" />
            <g transform="translate(160 62)">
              <g v-for="a in 11" :key="a" :transform="`rotate(${(a - 1) * 32 - 100})`">
                <ellipse cx="0" cy="-30" rx="6.5" ry="22" fill="url(#ic-petal)" opacity=".92" />
              </g>
              <circle r="15" fill="#1b3554" />
              <circle r="9" fill="#3f6593" />
            </g>
          </svg>

          <p class="ic-t">Capture the details your business actually needs, in the fields you choose.</p>
        </li>

        <li class="ic-card ic-c1" style="--i: 1">
          <h3 class="ic-h">Pipelines that<br />fit your sales</h3>
          <p class="ic-t">Shape the stages from enquiry to quote to won, the way your team works.</p>
        </li>

        <li class="ic-card ic-c2" style="--i: 2">
          <h3 class="ic-h">Workflow<br />automation</h3>
          <p class="ic-t">Let Saptivo handle the repeat steps while your team serves customers.</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeIndustryCtaSection' })
/**
 * SectionIndustryCta.vue — "Don't see your industry?" (Vue 3, <script setup>)
 * Heading + button on the left, description on the right, three light cards below
 * (one wide card with an illustration, two compact). SSR / Nuxt safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({ ctaHref: { type: String, default: '#demo' } })

/* swap for your own photo */
const photo = 'https://images.unsplash.com/photo-1742836531271-98fd8151d257?w=1200&q=80&auto=format&fit=crop'
const imgFailed = ref(false)

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
let io = null
onMounted(() => {
  mounted.value = true
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.15 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
.ic, .ic * { box-sizing: border-box; }
.ic { font-family: 'Poppins', system-ui, sans-serif; color: #17172b; background: #fff; }
.ic-wrap { width: 100%; max-width: none; margin: 0; padding: clamp(56px, 7vw, 96px) clamp(28px, 9vw, 168px); }

/* ---------- head ---------- */
.ic-head {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: clamp(24px, 5vw, 80px);
  align-items: start;
}
.ic-title {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 0.1em;
  font-family: Urbanist, "Urbanist Placeholder", sans-serif;
  font-size: 54px;
  font-weight: 600;
  line-height: 65px;
  letter-spacing: -1px;
  color: #0a0a0a;
}
.ic-btn {
  display: inline-flex;
  align-items: center;
  margin-top: 26px;
  padding: 10px 22px;
  border-radius: 999px;
  background: #0b0c0e;
  color: #fff;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.25s ease, transform 0.25s ease;
}
.ic-btn:hover { background: #f2540c; transform: translateY(-1px); }
.ic-desc {
  margin: 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: #475569;
}

/* ---------- cards ---------- */
.ic-cards {
  margin: clamp(30px, 4vw, 52px) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1.7fr 1fr 1fr;
  gap: 14px;
}
.ic-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 330px;
  padding: 24px 24px 22px;
  border-radius: 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.ic-js .ic-card { opacity: 0; translate: 0 22px; }
.ic-in .ic-card {
  opacity: 1;
  translate: 0 0;
  transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
  transition-delay: calc(var(--i) * 0.1s);
}
.ic-c0 { background: linear-gradient(150deg, #d9efff 0%, #c0e6fd 100%); }
.ic-c1 { background: linear-gradient(150deg, #e3eefa 0%, #b9d3ec 100%); }
.ic-c2 { background: linear-gradient(150deg, #edf4fb 0%, #cfe0f1 100%); }

.ic-h {
  margin: 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(22px, 2vw, 27px);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: #17172b;
}
.ic-t {
  position: relative;
  z-index: 2;
  margin: 0;
  max-width: 24ch;
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(23, 23, 43, 0.66);
}
.ic-c0 .ic-t { max-width: 26ch; }

.ic-photo {
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ic-c0:hover .ic-photo { scale: 1.04; }
.ic-wash {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(90deg, rgba(217, 239, 255, 0.96) 0%, rgba(200, 232, 253, 0.78) 42%, rgba(192, 230, 253, 0.1) 100%);
}
.ic-c0 .ic-h, .ic-c0 .ic-t { position: relative; z-index: 2; }
.ic-art {
  position: absolute;
  z-index: 1;
  right: 4%;
  bottom: -6px;
  height: 92%;
  width: auto;
  transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ic-c0:hover .ic-art { transform: translateY(-4px) rotate(-1.5deg); }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .ic-head { grid-template-columns: minmax(0, 1fr); gap: 18px; }
  .ic-title { white-space: normal; }
  .ic-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ic-c0 { grid-column: 1 / -1; min-height: 300px; }
}
@media (max-width: 560px) {
  .ic-title { font-size: 36px; line-height: 46px; letter-spacing: -0.7px; }
  .ic-cards { grid-template-columns: minmax(0, 1fr); }
  .ic-card { min-height: 220px; border-radius: 22px; }
  .ic-c0 { min-height: 300px; }
  .ic-art { right: -4%; height: 78%; }
  .ic-wash { background: linear-gradient(180deg, rgba(217, 239, 255, 0.94) 0%, rgba(200, 232, 253, 0.72) 60%, rgba(192, 230, 253, 0.5) 100%); }
}
@media (prefers-reduced-motion: reduce) {
  .ic * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>