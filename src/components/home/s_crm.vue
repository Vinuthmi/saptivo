<template>
  <section ref="rootEl" class="oc3" :class="{ 'oc3-in': revealed }" aria-labelledby="oc3-title">
    <div class="oc3-wrap">
      <h2 id="oc3-title" class="oc3-title">
        One CRM for leads, conversations <em>and revenue.</em>
      </h2>

      <div class="oc3-grid">
        <!-- ============ 1 · the problem (photo) ============ -->
        <article class="oc3-card oc3-photo" style="--i: 0">
          <img class="oc3-img" :src="photos.problem" alt="A salesperson with a tablet checking customer details at a car dealership" loading="lazy" decoding="async" />
          <span class="oc3-glass oc3-glass-1"><svg width="16" height="16" viewBox="0 0 24 24" v-html="icon.chat"></svg>WhatsApp · Calls · Spreadsheets</span>
          <div class="oc3-cap">
            <h3>Deals slip away quietly</h3>
            <p>
              When leads sit in WhatsApp, calls go unlogged and quotations live in spreadsheets, deals slip away
              quietly. Your best salesperson leaves and takes the customer history with them. A branch manager
              can't see what head office promised.
            </p>
          </div>
        </article>

        <!-- ============ 2 · the solution (colour card + flow chips) ============ -->
        <article class="oc3-card oc3-color" style="--i: 1">
          <span class="oc3-badge"><svg width="22" height="22" viewBox="0 0 24 24" v-html="icon.merge"></svg></span>

          <div class="oc3-flow" aria-hidden="true">
            <template v-for="(r, i) in rows" :key="i">
              <span class="oc3-chip" :class="{ on: step % 3 === i }"><svg width="18" height="18" viewBox="0 0 24 24" v-html="icon[r[0].icon]"></svg>{{ r[0].t }}</span>
              <svg class="oc3-arrow" width="18" height="18" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              <span class="oc3-chip" :class="{ on: step % 3 === i }"><svg width="18" height="18" viewBox="0 0 24 24" v-html="icon[r[1].icon]"></svg>{{ r[1].t }}</span>
            </template>
            <span class="oc3-record"><i></i>One customer record</span>
          </div>

          <div class="oc3-cap">
            <h3>One all-in-one CRM</h3>
            <p>
              Saptivo replaces those scattered tools with one all-in-one CRM built around the way sales, support
              and service teams actually work. Every enquiry, chat, call, quote, invoice and service visit sits on
              a single customer record.
            </p>
          </div>
        </article>

        <!-- ============ 3 · the outcome (photo) ============ -->
        <article class="oc3-card oc3-photo" style="--i: 2">
          <img class="oc3-img" :src="photos.team" alt="A sales and support team reviewing customer details together" loading="lazy" decoding="async" />
          <span class="oc3-glass oc3-glass-2"><svg width="16" height="16" viewBox="0 0 24 24" v-html="icon.shield"></svg>Everyone on the same page</span>
          <div class="oc3-cap">
            <h3>Everyone stays aligned</h3>
            <p>
              Anyone on your team can open it and know exactly where the relationship stands, what was promised
              and what happens next.
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeOneCrmCardsSection' })
/**
 * SectionOneCrmCards.vue — "One CRM for leads, conversations and revenue" (Vue 3, <script setup>)
 * Three tall cards: photo · colour card with a flow animation · photo.
 * Place directly after the hero. SSR/Nuxt safe (browser APIs only inside onMounted).
 *
 * PHOTOS: swap the two Unsplash URLs below for any images you prefer (keep ?w=1200&q=80&auto=format&fit=crop).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const photos = {
  problem: 'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/e9/d2/cf/80/25/v1_E10/E10RNGP.jpg?w=1600&cf_fit=scale-down&q=85&format=auto&s=391b3a0bd3d1da4d616b3593c3a0a538303cd56f90af486c5e7755d3b27858dc', // Clayton Cardinalli / Unsplash
  team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop',
}

const rows = [
  [{ icon: 'inbox', t: 'Enquiry' }, { icon: 'chat', t: 'Chat' }],
  [{ icon: 'phone', t: 'Call' }, { icon: 'quote', t: 'Quote' }],
  [{ icon: 'invoice', t: 'Invoice' }, { icon: 'wrench', t: 'Service visit' }],
]

const icon = {
  chat: '<path d="M4 5h16v11H9.5L5 20v-4H4z"/><path d="M8.5 10.5h7"/>',
  phone: '<path d="M7 4.5h3l1.4 4-2 1.4a10 10 0 0 0 4.7 4.7l1.4-2 4 1.4v3a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 5 6.7 2 2 0 0 1 7 4.5z"/>',
  inbox: '<path d="M4 13.5 6.5 5h11L20 13.5V19H4z"/><path d="M4 13.5h4.5l1 2h5l1-2H20"/>',
  quote: '<path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5v4h4M9.5 12h6M9.5 15.5h6"/>',
  invoice: '<path d="M6 3.5h12v17l-3-1.8-3 1.8-3-1.8-3 1.8z"/><path d="M9.5 8.5h5M9.5 12h5"/>',
  wrench: '<path d="M14.5 6a4 4 0 0 0 4.9 5L9.5 20.9a2 2 0 0 1-2.8-2.8L16.6 8.2A4 4 0 0 0 14.5 6z"/>',
  merge: '<path d="M5 5c0 6 4 7 7 7s7 1 7 7M19 5c0 6-4 7-7 7"/><circle cx="12" cy="12" r="1.2"/>',
  shield: '<path d="M12 3.5 19 6v5.500c0 4.200-2.800 7.600-7 9-4.200-1.400-7-4.800-7-9V6z"/><path d="m9 12 2.200 2.200L15.500 10"/>',
}

const rootEl = ref(null)
const revealed = ref(false)
const inView = ref(false)
const step = ref(0)
let io = null
let timer = null

onMounted(() => {
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  io = new IntersectionObserver(([en]) => {
    inView.value = en.isIntersecting
    if (en.isIntersecting) revealed.value = true
  }, { threshold: 0.2 })
  io.observe(rootEl.value)
  if (!reduce) {
    timer = setInterval(() => {
      if (inView.value && !document.hidden) step.value++
    }, 1600)
  }
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  io?.disconnect()
})
</script>

<style>
.oc3, .oc3 * { box-sizing: border-box; }
.oc3 {
  font-family: 'Poppins', system-ui, sans-serif;
  color: #14152b;
  background: #fff;
}
.oc3-wrap { max-width: 1280px; margin: 0 auto; padding: clamp(32px, 4vw, 56px) clamp(16px, 3vw, 32px); }
.oc3-title {
  margin: 0 auto clamp(20px, 2.4vw, 32px);
  max-width: 1000px;
  padding-bottom: 0.15em;
  text-align: center;
  text-wrap: balance;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(46px, 3.5vw, 104px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.06em;
  color: #0f172a;
}
.oc3-title em {
  font-style: normal;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- grid + cards ---------- */
.oc3-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(12px, 1.6vw, 20px); }
.oc3-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: clamp(430px, 33vw, 480px);
  padding: clamp(18px, 1.6vw, 24px);
  border-radius: 24px;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  opacity: 0;
  translate: 0 22px;
  transition: opacity 0.7s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
  transition-delay: calc(var(--i) * 0.12s);
}
.oc3-in .oc3-card { opacity: 1; translate: 0 0; }

/* photo cards */
.oc3-photo { background: linear-gradient(160deg, #3a3a4a, #14152b); }
.oc3-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.oc3-photo:hover .oc3-img { scale: 1.04; }
.oc3-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(10, 10, 20, 0) 30%, rgba(10, 10, 20, 0.55) 62%, rgba(10, 10, 20, 0.88) 100%);
}

/* glass tag on photos */
.oc3-glass {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(40, 36, 34, 0.38);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}
.oc3-glass svg { fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.oc3-glass-1 { left: 18%; top: 22%; }
.oc3-glass-2 { right: 8%; top: 28%; }
.oc3-in .oc3-glass { animation: oc3-float 6s ease-in-out infinite; }
.oc3-in .oc3-glass-2 { animation-delay: -3s; }
@keyframes oc3-float { 50% { translate: 0 -5px; } }

/* caption */
.oc3-cap h3 { margin: 0; font-family: 'Inter Display', Inter, system-ui, sans-serif; font-size: clamp(20px, 1.7vw, 24px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.15; }
.oc3-cap p { margin: 8px 0 0; font-size: clamp(12.5px, 0.95vw, 13.5px); line-height: 1.55; color: rgba(255, 255, 255, 0.82); }

/* colour card */
.oc3-color {
  background:
    radial-gradient(420px 300px at 20% 12%, rgba(255, 190, 140, 0.55), transparent 70%),
    radial-gradient(380px 300px at 90% 70%, rgba(180, 40, 0, 0.35), transparent 70%),
    linear-gradient(165deg, #ff8a4c 0%, #f45a13 55%, #e04a0a 100%);
}
.oc3-badge {
  position: absolute;
  left: clamp(20px, 2vw, 28px);
  top: clamp(20px, 2vw, 28px);
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
.oc3-badge svg { fill: none; stroke: #fff; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }

.oc3-flow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 8px 8px;
  margin: auto 0;
  padding: 56px 0 14px;
}
.oc3-chip {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.4s ease, color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
}
.oc3-chip svg { flex: none; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.oc3-chip.on { background: #fff; color: #c2410c; transform: translateY(-2px); box-shadow: 0 12px 22px -10px rgba(120, 30, 0, 0.55); }
.oc3-arrow { fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; opacity: 0.9; }
.oc3-record {
  grid-column: 1 / -1;
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(20, 21, 43, 0.82);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.oc3-record i { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; animation: oc3-blink 1.6s ease-in-out infinite; }
@keyframes oc3-blink { 50% { opacity: 0.3; } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .oc3-grid { grid-template-columns: minmax(0, 1fr); max-width: 600px; margin: 0 auto; }
  .oc3-card { min-height: 420px; }
  .oc3-color { min-height: 440px; }
  .oc3-glass-1 { left: 8%; top: 18%; }
  .oc3-glass-2 { right: 8%; top: 22%; }
}
@media (max-width: 420px) {
  .oc3-chip { padding: 12px 10px; font-size: 13px; gap: 7px; }
  .oc3-chip svg { width: 16px; height: 16px; }
  .oc3-glass { font-size: 12px; padding: 8px 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .oc3 * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>    