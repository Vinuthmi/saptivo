<template>
  <section ref="rootEl" class="ip" :class="{ 'ip-js': mounted, 'ip-in': revealed }" aria-labelledby="ip-title">
    <div class="ip-wrap">
      <!-- left: heading -->
      <div class="ip-head">
        <h2 id="ip-title" class="ip-title">Popular integration <em>combinations</em></h2>
        <p class="ip-sub">The mixes our customers use most, by type of business.</p>
      </div>

      <!-- right: tall photo cards -->
      <ul class="ip-track">
        <li v-for="(c, i) in cards" :key="c.id" class="ip-card" :style="{ '--i': i, '--tone': c.tone }">
          <div class="ip-ph">
            <img v-if="!failed[c.id]" :src="c.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[c.id] = true" />
            <span class="ip-shade" aria-hidden="true"></span>
            <div class="ip-chain" aria-hidden="true">
              <template v-for="(p, k) in c.parts" :key="p.t">
                <i v-if="k" class="ip-plus">+</i>
                <i class="ip-lg" v-html="p.logo"></i>
              </template>
            </div>
          </div>
          <h3 class="ip-h">{{ c.who }}</h3>
          <p class="ip-p">{{ c.line }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'IntegrationsPopular' })
/**
 * SectionIntegrationsPopular.vue — "Popular integration combinations"
 * Vue 3, <script setup>. Heading on the left, three tall rounded photo cards on the right (title + one line
 * underneath); below ~900px the cards become a swipeable scroll-snap row.
 * Photos fall back to a tinted gradient if a URL fails. Logos are own drawings. SSR safe.
 */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const L = {
  wa: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#25d366"/><path d="M12 5.4a6.6 6.6 0 0 0-5.7 9.9L5.4 18.6l3.4-.9A6.6 6.6 0 1 0 12 5.4z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.6 9.3c.3 1.7 2 3.5 3.8 4l.9-1-1.4-.9-.6.5c-.7-.3-1.4-1-1.7-1.7l.5-.6-.9-1.4z" fill="#fff"/></svg>',
  fb: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877f2"/><path d="M13.3 20.5v-6.7h2.3l.4-2.7h-2.7V9.4c0-.8.3-1.4 1.5-1.4h1.3V5.6c-.2 0-1-.1-1.9-.1-2.1 0-3.5 1.3-3.5 3.6v2H8.4v2.7h2.3v6.7z" fill="#fff"/></svg>',
  pos: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#14152b"/><rect x="6.5" y="4.5" width="11" height="15" rx="2" fill="none" stroke="#fff" stroke-width="1.6"/><rect x="8.5" y="6.8" width="7" height="3.2" rx=".8" fill="#fff"/><path d="M9 13h.01M12 13h.01M15 13h.01M9 16h.01M12 16h.01M15 16h.01" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  cx: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#0f6cbd"/><text x="12" y="15.2" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="8.6" font-weight="700" fill="#fff">3CX</text></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="19" rx="4" fill="#fff" stroke="#4285f4" stroke-width="1.8"/><path d="M2 8.5h20V7a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4z" fill="#4285f4"/><text x="12" y="19" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="9" font-weight="700" fill="#4285f4">31</text></svg>',
  web: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#21759b"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M5.5 12h13M12 5.5c2.2 2.3 2.2 10.7 0 13M12 5.5c-2.2 2.3-2.2 10.7 0 13" fill="none" stroke="#fff" stroke-width="1.4"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#71717a"/><rect x="5" y="7" width="14" height="10" rx="2" fill="none" stroke="#fff" stroke-width="1.6"/><path d="m5.8 8.5 6.2 4.8 6.2-4.8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>',
}

const cards = [
  {
    id: 'retail', who: 'Retailers', tone: '#1f6b43',
    line: 'WhatsApp receipts, Facebook leads and POS',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80&auto=format&fit=crop',
    parts: [{ t: 'WhatsApp', logo: L.wa }, { t: 'Facebook', logo: L.fb }, { t: 'POS', logo: L.pos }],
  },
  {
    id: 'service', who: 'Service companies', tone: '#1d4f86',
    line: 'WhatsApp complaints, 3CX calls and Google Calendar for technician visits',
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=80&auto=format&fit=crop',
    parts: [{ t: 'WhatsApp', logo: L.wa }, { t: '3CX', logo: L.cx }, { t: 'Calendar', logo: L.cal }],
  },
  {
    id: 'b2b', who: 'B2B sales teams', tone: '#9a4a0a',
    line: 'Website forms, Facebook leads, 3CX and email sync',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format&fit=crop',
    parts: [{ t: 'Website', logo: L.web }, { t: 'Facebook', logo: L.fb }, { t: '3CX', logo: L.cx }, { t: 'Email', logo: L.mail }],
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
  }, { threshold: 0.12 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
.ip, .ip * { box-sizing: border-box; }
.ip { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.ip-wrap {
  --pad: clamp(20px, 4vw, 96px);
  max-width: none; margin: 0; padding: clamp(56px, 8vw, 110px) var(--pad);
  display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 2.4fr); gap: clamp(24px, 4vw, 64px); align-items: start;
}

.ip-title {
  margin: 0; padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.ip .ip-title { color: #0f172a !important; }
.ip-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}
.ip-sub { margin: 16px 0 0; max-width: 18em; font-size: clamp(14px, 1.05vw, 15.5px); line-height: 1.6; color: #64748b; }

/* ---------- cards ---------- */
.ip-track {
  margin: 0; padding: 0; list-style: none; min-width: 0;
  display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 40px) / 3); gap: 20px;
  overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
}
.ip-track::-webkit-scrollbar { display: none; }
.ip-card { scroll-snap-align: start; min-width: 0; }

.ip-ph {
  position: relative; isolation: isolate; overflow: hidden; aspect-ratio: 3 / 4; border-radius: 28px;
  background: linear-gradient(150deg, color-mix(in srgb, var(--tone) 65%, #fff), var(--tone));
}
.ip-ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ip-card:hover .ip-ph img { scale: 1.05; }
.ip-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(8, 11, 16, 0) 55%, rgba(8, 11, 16, 0.55) 100%); }
.ip-chain {
  position: absolute; left: 14px; bottom: 14px; right: 14px; width: fit-content; max-width: calc(100% - 28px);
  display: flex; align-items: center; flex-wrap: wrap; gap: 5px; padding: 5px 9px; border-radius: 999px;
  background: rgba(255, 255, 255, 0.94); box-shadow: 0 12px 24px -12px rgba(8, 11, 16, 0.6);
}
.ip-lg { display: block; flex: none; width: 28px; height: 28px; }
.ip-lg svg { display: block; width: 100%; height: 100%; }
.ip-plus { font-style: normal; font-size: 14px; font-weight: 600; line-height: 1; color: #0f172a; }

.ip-h {
  margin: 16px 0 0; font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(21px, 1.9vw, 28px); font-weight: 600; letter-spacing: -0.03em; line-height: 1.15;
}
.ip .ip-h { color: #0f172a !important; }
.ip-p { margin: 8px 0 0; max-width: 34ch; font-size: 13.5px; line-height: 1.55; color: #64748b; }

/* ---------- reveal ---------- */
.ip-js .ip-head > *, .ip-js .ip-card { opacity: 0; translate: 0 24px; }
.ip-in .ip-head > *, .ip-in .ip-card { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ip-in .ip-head > :nth-child(2) { transition-delay: 0.08s; }
.ip-in .ip-card { transition-delay: calc(0.12s + var(--i) * 0.1s); }

@media (max-width: 960px) {
  .ip-wrap { grid-template-columns: 1fr; }
  .ip-sub { max-width: 30em; }
  .ip-track { grid-auto-columns: 68%; margin-inline: calc(var(--pad) * -1); padding-inline: var(--pad); scroll-padding-inline: var(--pad); }
}
@media (max-width: 560px) {
  .ip-track { grid-auto-columns: 82%; }
}
@media (prefers-reduced-motion: reduce) {
  .ip-js .ip-head > *, .ip-js .ip-card { opacity: 1; translate: 0 0; }
  .ip * { transition: none !important; }
}
</style>