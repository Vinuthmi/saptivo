<template>
  <section ref="rootEl" class="cb" :class="{ 'cb-js': mounted, 'cb-in': revealed }" aria-labelledby="cb-title">
    <div class="cb-wrap">
      <h2 id="cb-title" class="cb-title">Popular integration <em>combinations</em></h2>

      <ul class="cb-grid">
        <li v-for="(c, i) in cards" :key="c.id" class="cb-card" :class="`cb-c${i}`" :style="{ '--i': i, '--tone': c.tone }">
          <img v-if="!failed[c.id]" class="cb-img" :src="c.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[c.id] = true" />
          <span class="cb-shade" aria-hidden="true"></span>

          <!-- the combination: logos joined with + -->
          <div class="cb-chain" aria-hidden="true">
            <template v-for="(p, k) in c.parts" :key="p.t">
              <i v-if="k" class="cb-plus">+</i>
              <i class="cb-lg" v-html="p.logo"></i>
            </template>
          </div>

          <div class="cb-body">
            <span class="cb-cat">Combination 0{{ i + 1 }}</span>
            <h3 class="cb-h">{{ c.who }}</h3>
            <p class="cb-p">{{ c.line }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'IntegrationCombinations' })
/**
 * SectionIntegrationCombos.vue — "Popular integration combinations"
 * Vue 3, <script setup>. Three photo cards in the same bento style as the multi-branch section: Retailers,
 * Service companies, B2B sales teams. Each card has a photo, the logos of its integrations joined with "+",
 * a heading and one line. Photos fall back to a gradient if a URL fails; swap the `img` URLs for your own.
 * Logos are own drawings (swap in official SVGs if you have them). SSR / Nuxt safe.
 */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const logos = {
  wa: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#25d366"/><path d="M12 5.4a6.6 6.6 0 0 0-5.7 9.9L5.4 18.6l3.4-.9A6.6 6.6 0 1 0 12 5.4z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.6 9.3c.3 1.7 2 3.5 3.8 4l.9-1-1.4-.9-.6.5c-.7-.3-1.4-1-1.7-1.7l.5-.6-.9-1.4z" fill="#fff"/></svg>',
  cx: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#0f6cbd"/><text x="12" y="15.2" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="8.6" font-weight="700" fill="#fff">3CX</text></svg>',
  vo: '<svg viewBox="0 0 24 24"><defs><linearGradient id="vdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a3d"/><stop offset="1" stop-color="#f2540c"/></linearGradient></defs><rect width="24" height="24" rx="7" fill="url(#vdg)"/><path d="M6.5 7.5 12 17l5.500-9.500" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="19" rx="4" fill="#fff" stroke="#4285f4" stroke-width="1.8"/><path d="M2 8.5h20V7a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4z" fill="#4285f4"/><text x="12" y="19" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="9" font-weight="700" fill="#4285f4">31</text></svg>',
  api: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#0f172a"/><path d="M9.5 8 5.500 12l4 4M14.500 8l4 4-4 4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}
const brand = {
  // WordPress: blue disc with a clean white W
  wp: '<svg viewBox="0 0 24 24"><defs><linearGradient id="wpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f8fbf"/><stop offset="1" stop-color="#1b5f84"/></linearGradient></defs><circle cx="12" cy="12" r="12" fill="url(#wpg)"/><path d="M5.600 8.600 9.200 17l2.800-6.300L14.800 17l3.600-8.400" fill="none" stroke="#fff" stroke-width="2.100" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // Facebook: blue disc with the white f
  fb: '<svg viewBox="0 0 24 24"><defs><linearGradient id="fbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d8cff"/><stop offset="1" stop-color="#1665d8"/></linearGradient></defs><circle cx="12" cy="12" r="12" fill="url(#fbg)"/><path d="M13.300 20.500v-6.700h2.300l.4-2.700h-2.700V9.400c0-.8.300-1.400 1.500-1.400h1.300V5.600c-.2 0-1-.1-1.900-.1-2.100 0-3.500 1.300-3.500 3.600v2h-2.300v2.700h2.300v6.700z" fill="#fff"/></svg>',
}
const more = {
  pos: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#14152b"/><rect x="6.500" y="4.500" width="11" height="15" rx="2" fill="none" stroke="#fff" stroke-width="1.600"/><rect x="8.500" y="6.800" width="7" height="3.200" rx=".8" fill="#fff"/><path d="M9 13h.01M12 13h.01M15 13h.01M9 16h.01M12 16h.01M15 16h.01" stroke="#fff" stroke-width="1.800" stroke-linecap="round"/></svg>',
  web: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#21759b"/><circle cx="12" cy="12" r="6.500" fill="none" stroke="#fff" stroke-width="1.600"/><path d="M5.500 12h13M12 5.500c2.200 2.300 2.200 10.700 0 13M12 5.500c-2.200 2.300-2.200 10.700 0 13" fill="none" stroke="#fff" stroke-width="1.400"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#f2540c"/><rect x="5" y="7" width="14" height="10" rx="2" fill="none" stroke="#fff" stroke-width="1.600"/><path d="m5.800 8.500 6.200 4.800 6.200-4.800" fill="none" stroke="#fff" stroke-width="1.600" stroke-linejoin="round"/></svg>',
}

const cards = [
  {
    id: 'retail', who: 'Retailers', tone: '#1f6b43',
    line: 'WhatsApp receipts, Facebook leads and POS',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80&auto=format&fit=crop',
    parts: [{ t: 'WhatsApp receipts', logo: logos.wa }, { t: 'Facebook leads', logo: brand.fb }, { t: 'POS', logo: more.pos }],
  },
  {
    id: 'service', who: 'Service companies', tone: '#1d4f86',
    line: 'WhatsApp complaints, 3CX calls and Google Calendar for technician visits',
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1400&q=80&auto=format&fit=crop',
    parts: [{ t: 'WhatsApp complaints', logo: logos.wa }, { t: '3CX calls', logo: logos.cx }, { t: 'Google Calendar', logo: logos.cal }],
  },
  {
    id: 'b2b', who: 'B2B sales teams', tone: '#9a4a0a',
    line: 'Website forms, Facebook leads, 3CX and email sync',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=80&auto=format&fit=crop',
    parts: [{ t: 'Website forms', logo: more.web }, { t: 'Facebook leads', logo: brand.fb }, { t: '3CX', logo: logos.cx }, { t: 'Email sync', logo: more.mail }],
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
.cb, .cb * { box-sizing: border-box; }
.cb { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.cb-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px); }

.cb-title {
  max-width: 20em; margin: 0; padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.cb-title em {
  font-style: normal;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

/* ---------- bento ---------- */
.cb-grid {
  margin: clamp(26px, 3.4vw, 44px) 0 0; padding: 0; list-style: none;
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: clamp(250px, 21vw, 290px); gap: 16px;
}
.cb-c0 { grid-column: 1 / 3; }
.cb-c1 { grid-column: 3; grid-row: 1 / 3; }
.cb-c2 { grid-column: 1 / 3; }

.cb-card {
  position: relative; isolation: isolate; overflow: hidden; border-radius: 28px;
  display: flex; flex-direction: column; justify-content: space-between; min-width: 0;
  background: linear-gradient(150deg, color-mix(in srgb, var(--tone) 70%, #fff), var(--tone)); color: #fff;
}
.cb-js .cb-card { opacity: 0; translate: 0 26px; }
.cb-in .cb-card { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--i) * 0.09s); }

.cb-img { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.cb-card:hover .cb-img { scale: 1.05; }
.cb-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(8, 11, 16, 0.12) 0%, rgba(8, 11, 16, 0.5) 50%, rgba(8, 11, 16, 0.9) 100%); }

.cb-chain {
  position: relative; z-index: 2; align-self: flex-start;
  display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
  margin: 24px 0 0 24px; padding: 6px 10px; border-radius: 999px;
  background: rgba(255, 255, 255, 0.92); box-shadow: 0 12px 24px -12px rgba(8, 11, 16, 0.6);
}
.cb-lg { display: block; flex: none; width: 30px; height: 30px; }
.cb-lg svg { display: block; width: 100%; height: 100%; }
.cb-plus { font-style: normal; font-size: 15px; font-weight: 600; line-height: 1; color: #0f172a; }

.cb-body { position: relative; z-index: 2; padding: 0 30px 28px; display: flex; flex-direction: column; }
.cb-cat { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #fff; text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5); }
.cb-h {
  margin: 14px 0 0; max-width: 14em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(21px, 1.9vw, 28px); font-weight: 600; line-height: 1.15; letter-spacing: -0.03em;
  color: #fff; text-shadow: 0 2px 18px rgba(0, 0, 0, 0.7); text-wrap: balance;
}
.cb-c1 .cb-h { font-size: clamp(24px, 2.4vw, 32px); }
.cb-p { margin: 12px 0 0; max-width: 34ch; font-size: 14px; line-height: 1.55; color: #fff; text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6); }

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .cb-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 260px; }
  .cb-c0 { grid-column: 1 / -1; grid-row: auto; }
  .cb-c1 { grid-column: 1; grid-row: auto; }
  .cb-c2 { grid-column: 2; grid-row: auto; }
}
@media (max-width: 620px) {
  .cb-grid { grid-template-columns: minmax(0, 1fr); grid-auto-rows: minmax(250px, auto); gap: 14px; }
  .cb-c0, .cb-c1, .cb-c2 { grid-column: 1 / -1; }
  .cb-card { min-height: 250px; border-radius: 24px; }
  .cb-body { padding: 0 24px 24px; }
  .cb-chain { margin: 20px 0 0 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .cb * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>