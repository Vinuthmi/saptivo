<template>
  <section ref="root" class="su" :class="{ 'su-arm': armed, 'su-in': shown }" aria-labelledby="su-title">
    <div class="su-wrap">
      <!-- ============ heading ============ -->
      <header class="su-head">
        <h2 id="su-title" class="su-title">How <span>industry setup</span> works</h2>
        <p class="su-sub">
          You start with a system that already speaks your language rather than a blank CRM you have to design yourself.
        </p>
      </header>

      <div class="su-grid">
        <!-- ============ 1 · configured for your industry ============ -->
        <article class="su-col" style="--i: 0">
          <div class="su-card su-grad">
            <span class="su-grain" aria-hidden="true"></span>

            <div class="su-panel" aria-hidden="true">
              <div class="pn-h">
                <img class="pn-logo" :src="logoSrc" alt="" draggable="false" />
                <b>Saptivo onboarding</b>
              </div>

              <div class="pn-rows">
                <div class="pn-r">
                  <span>Status</span>
                  <em class="chip" :class="done ? 'ok' : 'wip'">
                    <svg v-if="done" viewBox="0 0 24 24"><path d="m6 12.500 4 4 8-9" /></svg>
                    <i v-else></i>
                    {{ done ? 'Configured' : 'Configuring' }}
                  </em>
                </div>
                <div class="pn-r">
                  <span>Industry</span>
                  <b :key="ind" class="swap">{{ industries[ind] }}</b>
                </div>
                <div class="pn-r">
                  <span>Set up by</span>
                  <b class="by"><i>S</i>Saptivo team</b>
                </div>
              </div>

              <div class="pn-ev">
                <small>Setup steps</small>
                <ol>
                  <li v-for="(e, k) in events" :key="e[1]" :class="{ show: tick >= 2 + k * 2 }">
                    <span><i class="ev-ic"><svg viewBox="0 0 24 24" v-html="icons[e[0]]"></svg></i>{{ e[1] }}</span>
                    <b>{{ e[2] }}</b>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <h3 class="su-ct">Configured for your industry.</h3>
          <p class="su-cd">Our team configures pipelines, custom fields, checklists and reports for your industry.</p>
        </article>

        <!-- ============ 2 · imported and trained ============ -->
        <article class="su-col" style="--i: 1">
          <div class="su-card su-photo">
            <img v-if="photo && !photoFail" class="su-img" :src="photo" alt="" loading="lazy" decoding="async" draggable="false" @error="photoFail = true" />
            <span class="su-sky" aria-hidden="true"></span>

            <div class="su-over" aria-hidden="true">
              <div class="pn-h">
                <img class="pn-logo" :src="logoSrc" alt="" draggable="false" />
                <b>Your data and team</b>
                <em class="chip blue"><svg viewBox="0 0 24 24"><path d="m6 12.500 4 4 8-9" /></svg>In progress</em>
              </div>
              <div class="ov-g">
                <div><small>Customers imported</small><b>1,284</b></div>
                <div><small>Products imported</small><b>342</b></div>
              </div>
              <div class="ov-t">
                <span><small>Staff trained</small><b>{{ trained }} of 12</b></span>
                <i class="bar"><u :style="{ width: (trained / 12) * 100 + '%' }"></u></i>
              </div>
            </div>
          </div>

          <h3 class="su-ct">Imported and trained.</h3>
          <p class="su-cd">We import your customers and products, and train your staff.</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * SectionSetup.vue — "How industry setup works" (Vue 3, <script setup>)
 *
 * Two large cards like the reference: a soft gradient card with a white onboarding panel, and a photo card with a
 * white overlay card. Each has a caption underneath; the heading and the closing sentence sit above.
 * • The left panel plays a short loop (status flips from "Configuring" to "Configured", the setup steps tick in,
 *   the industry cycles); the right card's training bar fills. Loops while on screen; respects prefers-reduced-motion.
 * • Palette: the light tones of the Holst / blue swatches (sky #c0e6fd, #80aad3, #5b86b6, sand #D4C4A8, ivory #F4F1DE)
 *   with a soft peach glow that ties back to the Saptivo orange.
 * • Photo: pass `photo` (any image URL). If it fails to load the card falls back to a gradient.
 *
 * Figures on the cards (1,284 / 342 / 8 of 12) are sample data. Prop: photo. SSR / Nuxt safe.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'IndustrySetupSection' })

// Saptivo logo (public/saptivo-logo.png, same file the footer uses), shown in black
const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`

defineProps({
  photo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80&auto=format&fit=crop',
  },
})

const icons = {
  flow: '<circle cx="6" cy="6" r="2.200"/><circle cx="6" cy="18" r="2.200"/><circle cx="18" cy="12" r="2.200"/><path d="M6 8.200v7.600M8 6c6 0 8 2 8 4M8 18c6 0 8-2 8-4"/>',
  list: '<path d="M9 7h11M9 12h11M9 17h11"/><path d="m3.500 7 1.200 1.200L6.800 6M3.500 12l1.200 1.200L6.800 11M3.500 17l1.200 1.200L6.800 16"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
}
const events = [
  ['flow', 'Step 1', 'Pipelines and fields set up'],
  ['list', 'Step 2', 'Checklists added'],
  ['chart', 'Step 3', 'Reports ready'],
]
const industries = ['Retail chain', 'Solar installer', 'Distribution hub', 'Contracting firm']

const root = ref(null)
const armed = ref(false)
const shown = ref(false)
const photoFail = ref(false)
const tick = ref(0) // demo clock 0..9
const ind = ref(0)
const LOOP = 10
const done = computed(() => tick.value >= 8)
const trained = computed(() => (tick.value >= 3 ? 8 : 0))

let io = null
let timer = null
let inView = false

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    tick.value = LOOP - 1
    shown.value = true
    return
  }
  armed.value = true
  io = new IntersectionObserver(
    ([e]) => {
      inView = e.isIntersecting
      if (e.isIntersecting) shown.value = true
    },
    { threshold: 0.2 },
  )
  io.observe(root.value)
  timer = setInterval(() => {
    if (!inView || document.hidden) return
    const n = (tick.value + 1) % LOOP
    if (n === 0) ind.value = (ind.value + 1) % industries.length
    tick.value = n
  }, 1100)
})
onBeforeUnmount(() => {
  io?.disconnect()
  clearInterval(timer)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Urbanist:wght@500;600&display=swap');
</style>

<style scoped>
.su {
  --ink: #0f172a;
  --mute: #6b7280;
  --sky: #c0e6fd;
  --sky-2: #80aad3;
  --sky-3: #5b86b6;
  --sand: #d4c4a8;
  --ivory: #f4f1de;
  --o: #f2540c;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  margin: clamp(10px, 1.6vw, 28px); /* gap around the rounded box */
  border-radius: clamp(28px, 3.4vw, 48px);
  overflow: hidden;
  padding: clamp(36px, 5vw, 72px) clamp(14px, 3vw, 32px);
  background: #fff;
  color: var(--ink);
  font-family: 'Poppins', system-ui, sans-serif;
}
.su *,
.su *::before,
.su *::after {
  box-sizing: border-box;
}
.su svg {
  display: block;
}
.su-wrap {
  max-width: 1240px;
  margin: 0 auto;
}

/* ============ heading ============ */
.su-head {
  text-align: center;
  margin-bottom: clamp(22px, 3vw, 36px);
}
.su-title {
  margin: 0;
  font-family: Urbanist, "Urbanist Placeholder", sans-serif !important;
  font-size: 54px !important;
  font-weight: 600 !important;
  line-height: 65px !important;
  letter-spacing: -1px !important;
  color: #0a0a0a !important;
}
.su-title span {
  background: none !important;
  color: #615f5a !important;
  -webkit-text-fill-color: #615f5a !important;
}
.su-sub {
  max-width: 640px;
  margin: 14px auto 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1.1vw, 18px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.015em;
  color: #475569;
}

/* ============ grid ============ */
.su-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 1.8vw, 24px);
}
.su-card {
  position: relative;
  height: clamp(420px, 41vw, 574px);
  border-radius: clamp(22px, 2.4vw, 30px);
  overflow: hidden;
  isolation: isolate;
}
.su-ct {
  margin: 20px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(20px, 1.8vw, 26px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: #0a0a0a;
}
.su-cd {
  max-width: 400px;
  margin: 8px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1.1vw, 17px);
  font-weight: 500;
  line-height: 1.55;
  letter-spacing: -0.01em;
  color: #475569;
}

/* ---------- left: gradient card ---------- */
.su-grad {
  background:
    radial-gradient(72% 56% at 18% -6%, var(--sky) 0%, rgba(192, 230, 253, 0) 70%),
    radial-gradient(60% 50% at 104% 14%, #e5edf6 0%, rgba(229, 237, 246, 0) 72%),
    radial-gradient(90% 46% at 22% 54%, rgba(91, 134, 182, 0.95) 0%, rgba(91, 134, 182, 0) 70%),
    radial-gradient(78% 56% at 86% 106%, rgba(255, 160, 126, 0.85) 0%, rgba(255, 160, 126, 0) 70%),
    radial-gradient(70% 56% at 6% 104%, rgba(226, 140, 158, 0.9) 0%, rgba(226, 140, 158, 0) 70%),
    linear-gradient(165deg, #a9d3ef 0%, #8fb5da 48%, #d6b9c9 100%);
}
.su-grain {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.18;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* white UI panels (shared look) */
.su-panel,
.su-over {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 34px 60px -30px rgba(23, 50, 90, 0.45), 0 2px 8px rgba(23, 50, 90, 0.06);
  font-family: 'Poppins', system-ui, sans-serif;
}
.su-panel {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  width: min(62%, 392px);
  min-width: 290px;
  padding: 22px 24px 20px;
  transform: translate(-50%, -52%);
}
.pn-h {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f1f4;
}
.pn-h b {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pn-logo {
  flex: none;
  display: block;
  width: auto;
  height: 17px;
  max-width: 80px;
  object-fit: contain;
  filter: brightness(0); /* logo in black */
}
.pn-rows {
  padding: 4px 0 6px;
  border-bottom: 1px solid #f0f1f4;
}
.pn-r {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 0;
  font-size: 14px;
  color: var(--mute);
}
.pn-r b {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.swap {
  animation: su-swap 0.5s var(--ease);
}
.by {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.by i {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #0f172a;
  color: #fff;
  font-style: normal;
  font-size: 10.5px;
  font-weight: 600;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px;
  border-radius: 8px;
  font-style: normal;
  font-size: 12.5px;
  font-weight: 500;
  transition: background 0.4s, color 0.4s;
}
.chip svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.chip.ok {
  background: #e6f8ef;
  color: #16a05a;
}
.chip.wip {
  background: #fff1d6;
  color: #b7740b;
}
.chip.wip i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: su-blink 1.2s ease-in-out infinite;
}
.chip.blue {
  background: #e4edff;
  color: #3f63d8;
}
.pn-ev {
  padding-top: 12px;
}
.pn-ev small {
  font-size: 13.5px;
  color: var(--mute);
}
.pn-ev ol {
  position: relative;
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  display: grid;
  gap: 15px;
}
.pn-ev ol::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 14px;
  bottom: 14px;
  width: 1px;
  background: #e7e9ee;
}
.pn-ev li {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  opacity: 0.25;
  transform: translateX(-6px);
  transition: opacity 0.5s ease, transform 0.6s var(--ease);
}
.pn-ev li.show {
  opacity: 1;
  transform: none;
}
.pn-ev li > span {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: var(--mute);
  white-space: nowrap;
}
.pn-ev li > b {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-align: right;
}
.ev-ic {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background: #fff;
  color: #16a05a;
}
.ev-ic svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ---------- right: photo card ---------- */
.su-photo {
  background: linear-gradient(165deg, #b9dcf3 0%, #8fb5da 55%, #d9c3a6 100%); /* fallback if the photo can't load */
}
.su-img {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 28%;
  transition: transform 1.4s var(--ease);
}
.su-photo:hover .su-img {
  transform: scale(1.04);
}
.su-sky {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(192, 230, 253, 0.28) 0%, rgba(192, 230, 253, 0) 38%),
    linear-gradient(0deg, rgba(13, 27, 42, 0.38) 0%, rgba(13, 27, 42, 0) 42%);
}
.su-over {
  position: absolute;
  left: clamp(16px, 2.6vw, 32px);
  bottom: clamp(16px, 2.6vw, 32px);
  width: min(90%, 420px);
  padding: 18px 20px 18px;
}
.su-over .pn-h {
  padding-bottom: 12px;
}
.su-over .chip {
  padding: 3px 10px;
  font-size: 12px;
}
.ov-g {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px 0 12px;
  border-bottom: 1px solid #f0f1f4;
}
.ov-g small,
.ov-t small {
  display: block;
  font-size: 12.5px;
  color: var(--mute);
}
.ov-g b {
  display: block;
  margin-top: 3px;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}
.ov-t {
  padding-top: 12px;
}
.ov-t span {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.ov-t b {
  font-size: 13.5px;
  font-weight: 600;
}
.bar {
  display: block;
  height: 6px;
  margin-top: 8px;
  border-radius: 6px;
  background: #eceef3;
  overflow: hidden;
}
.bar u {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #80aad3, #3f6593);
  transition: width 1.2s var(--ease);
}

/* ============ motion ============ */
.su-arm .su-col {
  opacity: 0;
  transform: translateY(34px);
}
.su-arm.su-in .su-col {
  opacity: 1;
  transform: none;
  transition: opacity 0.9s var(--ease), transform 1.1s var(--ease);
  transition-delay: calc(var(--i) * 0.14s);
}
.su-arm .su-panel,
.su-arm .su-over {
  opacity: 0;
}
.su-arm.su-in .su-panel {
  opacity: 1;
  transition: opacity 0.8s ease 0.4s;
}
.su-arm.su-in .su-over {
  opacity: 1;
  transition: opacity 0.8s ease 0.6s;
}
@keyframes su-swap { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes su-blink { 50% { opacity: 0.3; } }

/* ============ responsive ============ */
@media (max-width: 860px) {
  .su-title {
    font-size: clamp(36px, 8vw, 48px) !important;
    line-height: 1.15 !important;
  }
  .su-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 34px;
  }
  .su-card {
    height: clamp(420px, 96vw, 520px);
  }
  .su-panel {
    width: min(88%, 392px);
  }
  .su-over {
    width: calc(100% - 32px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .su *,
  .su *::before,
  .su *::after {
    animation: none !important;
    transition: none !important;
  }
  .su-arm .su-col,
  .su-arm .su-panel,
  .su-arm .su-over {
    opacity: 1;
    transform: none;
  }
}
</style>