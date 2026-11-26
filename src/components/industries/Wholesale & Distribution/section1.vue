<template>
  <section class="dc" aria-label="Distributor features">
    <ul ref="trackEl" class="dc-grid" aria-label="Distributor features carousel" @scroll.passive="onScroll">
      <li v-for="c in cards" :key="c.id" class="dc-card" tabindex="0">
        <img v-if="!failed[c.id]" class="dc-img" :src="c.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[c.id] = true" />
        <span class="dc-shade" aria-hidden="true"></span>
        <div class="dc-copy">
          <h3 class="dc-h">{{ c.h }}</h3>
          <p class="dc-p">{{ c.p }}</p>
        </div>
      </li>
    </ul>

    <div class="dc-nav">
      <div class="dc-dots" aria-hidden="true">
        <i v-for="n in pages" :key="n" :class="{ 'is-on': n - 1 === active }"></i>
      </div>
      <button type="button" class="dc-btn" :disabled="atStart" aria-label="Previous" @click="go(-1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7" /></svg>
      </button>
      <button type="button" class="dc-btn" :disabled="atEnd" aria-label="Next" @click="go(1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7" /></svg>
      </button>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'DistributorCards' })
/**
 * SectionDistributorCards.vue — six photo cards, 4 full cards in view, with dots and prev/next arrows (same size as the retail cards). Heading on top; the description
 * shows on hover or keyboard focus (always visible on touch). No animations. Photos fall back to a tinted gradient.
 */
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'

const u = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`
const cards = [
  { id: 'acc', h: 'Dealer and retailer accounts', img: u('1556742049-0cfed4f6a45d'),
    p: 'Every dealer, retailer and corporate buyer gets an account with contacts, branches, order history, price group and credit terms. Reps see the full relationship before every visit or call.' },
  { id: 'prc', h: 'Bulk tier pricing and price books', img: u('1556740738-b6a63e27c4df'),
    p: 'Set price books by customer group, with volume breaks and special prices for key accounts. Discounts above a set level go through an approval workflow, protecting your margins. Reps always quote the right price automatically.' },
  { id: 'crd', h: 'Credit limits and repayment tracking', img: u('1553729459-efe14ef6055d'),
    p: "See each customer's outstanding balance, credit notes, overdue invoices and payment status in one place. Saptivo flags customers over their limit before a new order is confirmed, and automated reminders chase overdue payments politely." },
  { id: 'quo', h: 'Fast bulk quotations', img: u('1486312338219-ce68d2c6f44d'),
    p: 'Large orders are quoted from the catalog in minutes and sent on WhatsApp or email. Approved quotations become invoices in one click, with VAT calculated automatically.' },
  { id: 'stk', h: 'Stock across warehouses', img: u('1586528116311-ad8dd3c8310d'),
    p: 'Live stock levels by warehouse, reorder alerts and recorded transfers mean you only promise what you can deliver.' },
  { id: 'fld', h: 'Field sales and route coverage', img: u('1581092160562-40aa08e78837'),
    p: 'Reps use Saptivo mobile to visit accounts, take orders, capture notes and send quotations on the road. Territory rules route new enquiries to the right rep.' },
]
const failed = reactive({})
const trackEl = ref(null)
const atStart = ref(true)
const atEnd = ref(false)
const pages = ref(1)
const active = ref(0)

function onScroll() {
  const t = trackEl.value
  if (!t) return
  const c = t.querySelector('.dc-card')
  const step = c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(t).columnGap) || 0) : 1
  pages.value = Math.max(1, Math.round((t.scrollWidth - t.clientWidth) / step) + 1)
  active.value = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4 ? pages.value - 1 : Math.min(pages.value - 1, Math.round(t.scrollLeft / step))
  atStart.value = t.scrollLeft <= 4
  atEnd.value = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4
}
function go(dir) {
  const t = trackEl.value
  const c = t && t.querySelector('.dc-card')
  if (!c) return
  const gap = parseFloat(getComputedStyle(t).columnGap) || 0
  t.scrollBy({ left: dir * (c.getBoundingClientRect().width + gap), behavior: 'smooth' })
}
onMounted(() => { onScroll(); window.addEventListener('resize', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('resize', onScroll))
</script>

<style>
.dc, .dc * { box-sizing: border-box; }
.dc { font-family: 'Urbanist', system-ui, sans-serif; background: #fff; color: #0f172a; padding: clamp(32px, 5vw, 72px) clamp(16px, 3vw, 32px); }
.dc { --gap: clamp(12px, 1.4vw, 20px); }
.dc-grid { list-style: none; margin: 0 auto; padding: 0; max-width: 1560px; display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 3 * var(--gap)) / 4); column-gap: var(--gap); overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; overscroll-behavior-x: contain; }
.dc-grid::-webkit-scrollbar { display: none; }
.dc-card { scroll-snap-align: start; }
.dc-nav { max-width: 1560px; margin: clamp(16px, 2vw, 26px) auto 0; display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
.dc-dots { display: flex; align-items: center; gap: 8px; margin-right: auto; }
.dc-dots i { width: 8px; height: 8px; border-radius: 999px; background: #a1a1aa; }
.dc-dots i.is-on { width: 28px; background: #0f172a; }
.dc-btn { display: grid; place-items: center; width: 46px; height: 46px; padding: 0; border-radius: 50%; border: 1.5px solid #0f172a; background: #fff; color: #0f172a; cursor: pointer; }
.dc-btn svg { width: 20px; height: 20px; }
.dc-btn:disabled { opacity: 0.35; cursor: default; }
.dc-btn:focus-visible { outline: 2px solid #0f172a; outline-offset: 2px; }
.dc-card { position: relative; isolation: isolate; overflow: hidden; aspect-ratio: 1 / 1.1; border-radius: clamp(20px, 2vw, 28px); color: #fff; background: linear-gradient(150deg, #5b5855, #1c1b1a); outline: none; }
.dc-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; display: block; }
.dc-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(8, 10, 14, 0.72) 0%, rgba(8, 10, 14, 0.3) 55%, rgba(8, 10, 14, 0.1) 100%); }
.dc-card:focus-visible { box-shadow: 0 0 0 3px #71717a; }
.dc-copy { padding: clamp(18px, 1.8vw, 26px); }
.dc-h { margin: 0; font-size: clamp(20px, 1.75vw, 25px); font-weight: 600; line-height: 1.18; letter-spacing: -0.015em; }
.dc .dc-h { color: #fff !important; }
.dc-p { margin: 10px 0 0; font-size: clamp(12.5px, 0.95vw, 14.5px); font-weight: 500; line-height: 1.5; letter-spacing: 0.012em; display: none; }
.dc .dc-p { color: #fff !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 2px 16px rgba(0, 0, 0, 0.7); }
.dc-card:hover .dc-p, .dc-card:focus-visible .dc-p { display: block; }

@media (hover: none) { .dc-p { display: block; } .dc-card { aspect-ratio: auto; min-height: 320px; } }
@media (max-width: 1100px) { .dc-grid { grid-auto-columns: calc((100% - var(--gap)) / 2); } }
@media (max-width: 560px) { .dc-grid { grid-auto-columns: 82%; } .dc-nav { display: none; } .dc-card { aspect-ratio: auto; min-height: 300px; } .dc-p { display: block; } }
</style>