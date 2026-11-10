<template>
  <section ref="rootEl" class="oc" :class="{ 'oc-js': mounted, 'oc-in': revealed }" aria-labelledby="oc-title">
    <div class="oc-wrap">
      <h2 id="oc-title" class="oc-title">
        One CRM for leads, conversations <em>and revenue.</em>
      </h2>

      <div class="oc-grid">
        <!-- 1 · the problem -->
        <article class="oc-card oc-tint" style="--i: 0">
          <span class="oc-cat">The problem</span>
          <h3 class="oc-h">Deals slip away quietly</h3>
          <p class="oc-p">
            When leads sit in WhatsApp, calls go unlogged and quotations live in spreadsheets, deals slip away quietly.
            Your best salesperson leaves and takes the customer history with them. A branch manager can't see what head
            office promised.
          </p>

          <div class="oc-panel">
            <span class="oc-label">Where deals leak</span>
            <ul class="oc-list">
              <li v-for="r in leaks" :key="r.t">
                <i class="oc-ic"><svg viewBox="0 0 24 24" aria-hidden="true" v-html="icon[r.icon]"></svg></i>
                <span><b>{{ r.t }}</b><small>{{ r.s }}</small></span>
              </li>
            </ul>
          </div>
        </article>

        <!-- 2 · the fix (photo) -->
        <article class="oc-card oc-photo" style="--i: 1">
          <img
            v-if="!imgFailed"
            class="oc-img"
            :src="photo"
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
            @error="imgFailed = true"
          />
          <span class="oc-shade" aria-hidden="true"></span>
          <div class="oc-cap">
            <span class="oc-cat">The fix</span>
            <h3 class="oc-h">One all-in-one CRM</h3>
            <p class="oc-p">
              Saptivo replaces those scattered tools with one all-in-one CRM built around the way sales, support and
              service teams actually work. Every enquiry, chat, call, quote, invoice and service visit sits on a single
              customer record.
            </p>
          </div>
        </article>

        <!-- 3 · the result -->
        <article class="oc-card oc-tint" style="--i: 2">
          <span class="oc-cat">The result</span>
          <h3 class="oc-h">Everyone knows where it stands</h3>
          <p class="oc-p">
            Anyone on your team can open it and know exactly where the relationship stands, what was promised and what
            happens next.
          </p>

          <div class="oc-panel">
            <span class="oc-label">On one customer record</span>
            <ol class="oc-steps">
              <li v-for="(e, k) in record" :key="e">
                <em>{{ String(k + 1).padStart(2, '0') }}</em>{{ e }}
              </li>
            </ol>
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
 * Three cards: problem (light) · fix (photo) · result (light). Cards rise in once when the section scrolls into view.
 * The photo falls back to a dark gradient if the URL fails. Swap `photo` for your own image. SSR / Nuxt safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const photo = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80&auto=format&fit=crop'
const imgFailed = ref(false)

const leaks = [
  { icon: 'chat', t: 'Leads sit in WhatsApp', s: 'Nobody else on the team can see them' },
  { icon: 'phone', t: 'Calls go unlogged', s: 'Missed and answered calls leave no trace' },
  { icon: 'sheet', t: 'Quotations live in spreadsheets', s: 'Which version is the current one?' },
]

const record = ['Enquiry', 'WhatsApp chat', 'Call', 'Quote', 'Invoice', 'Service visit']

const icon = {
  chat: '<path d="M4 5h16v11H9.5L5 20v-4H4z"/><path d="M8.5 10.5h7"/>',
  phone: '<path d="M7 4.5h3l1.4 4-2 1.4a10 10 0 0 0 4.7 4.7l1.4-2 4 1.4v3a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 5 6.7 2 2 0 0 1 7 4.5z"/>',
  sheet: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M4 9.5h16M4 14.5h16M10 4v16"/>',
}

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
.oc, .oc * { box-sizing: border-box; }
.oc {
  --oc-tint-a: #fff3ea;
  --oc-tint-b: #ffe3d0;
  --oc-accent: #f2540c;
  font-family: 'Poppins', system-ui, sans-serif;
  color: #0f172a;
  background: #fff;
}
.oc-wrap { max-width: 1280px; margin: 0 auto; padding: clamp(40px, 6vw, 90px) clamp(16px, 3vw, 32px); }

/* heading: unchanged from the original section */
.oc-title {
  max-width: 1000px;
  margin: 0 auto clamp(24px, 3vw, 40px);
  padding-bottom: 0.15em;
  text-align: center;
  text-wrap: balance;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(32px, 4.2vw, 62px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.05em;
  color: #0f172a;
}
/* highlighted words: same grey as the original heading */
.oc-title em {
  font-style: normal;
  color: #615f5a;
}

/* ---------- cards ---------- */
.oc-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(12px, 1.4vw, 20px);
}
.oc-card {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: clamp(460px, 34vw, 520px);
  padding: clamp(22px, 2.2vw, 30px);
  border-radius: 30px;
  overflow: hidden;
}
.oc-js .oc-card { opacity: 0; translate: 0 26px; }
.oc-in .oc-card {
  opacity: 1;
  translate: 0 0;
  transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
  transition-delay: calc(var(--i) * 0.12s);
}

.oc-cat {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.oc .oc-h {
  margin: 14px 0 0;
  max-width: 14em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(24px, 2.2vw, 32px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.03em;
  text-wrap: balance;
}
.oc .oc-p {
  margin: 14px 0 0;
  font-size: 13.5px;
  line-height: 1.7;
}

/* light cards */
.oc-tint { background: linear-gradient(150deg, var(--oc-tint-a) 0%, var(--oc-tint-b) 100%); }
.oc-tint .oc-cat { color: #c2410c; }
.oc .oc-tint .oc-h { color: #17172b; }
.oc .oc-tint .oc-p { color: #4a4d58; }

/* white panel inside the light cards */
.oc-panel {
  margin-top: auto;
  padding: 18px 20px 8px;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 16px 34px -22px rgba(120, 50, 10, 0.35);
}
.oc-label {
  display: block;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(23, 23, 43, 0.09);
  color: #7a7d88;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.oc-list, .oc-steps { margin: 0; padding: 0; list-style: none; }
.oc-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(23, 23, 43, 0.09);
}
.oc-list li:last-child, .oc-steps li:last-child { border-bottom: 0; }
.oc-ic {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: #ffeadb;
  color: var(--oc-accent);
}
.oc-ic svg { width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.oc-list span { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; }
.oc-list b { color: #17172b; font-size: 12.5px; font-weight: 600; }
.oc-list small { margin-top: 2px; color: #7a7d88; font-size: 11px; }

.oc-steps { display: grid; grid-template-columns: 1fr 1fr; column-gap: 18px; }
.oc-steps li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(23, 23, 43, 0.09);
  color: #3b3f4a;
  font-size: 12px;
  white-space: nowrap;
}
.oc-steps li:nth-last-child(2) { border-bottom: 0; }
.oc-steps em {
  color: var(--oc-accent);
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
}

/* photo card */
.oc-photo { justify-content: flex-end; color: #fff; background: linear-gradient(150deg, #3d4d55, #1c2a31); }
.oc-img {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.oc-photo:hover .oc-img { scale: 1.05; }
.oc-shade {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(8, 11, 16, 0.05) 0%, rgba(8, 11, 16, 0.3) 40%, rgba(8, 11, 16, 0.9) 100%);
}
.oc .oc-photo .oc-cat,
.oc .oc-photo .oc-h,
.oc .oc-photo .oc-p { color: #fff !important; opacity: 1; text-shadow: 0 1px 14px rgba(0, 0, 0, 0.55); }
.oc .oc-photo .oc-h { max-width: 12em; }

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .oc-grid { grid-template-columns: minmax(0, 1fr); }
  .oc-card { min-height: 0; }
  .oc-photo { min-height: 420px; order: -1; }
  .oc-panel { margin-top: 26px; }
  .oc .oc-h { max-width: none; }
}
@media (max-width: 460px) {
  .oc-card { border-radius: 24px; }
  .oc-steps { grid-template-columns: minmax(0, 1fr); }
  .oc-steps li:nth-last-child(2) { border-bottom: 1px solid rgba(23, 23, 43, 0.09); }
}
@media (prefers-reduced-motion: reduce) {
  .oc * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>