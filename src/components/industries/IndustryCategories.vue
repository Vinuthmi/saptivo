<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'IndustriesStack' })

const root = ref(null)
let io
let timer = null

const img = (id) => `https://images.unsplash.com/photo-${id}?w=1400&q=80&auto=format&fit=crop`

/* small decorative icons on the floating card */
const tools = [
  '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/>',
  '<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',
]

/* Photos are free Unsplash photos — swap any URL below. Copy and bullets come from the Saptivo content doc. */
const industries = [
  {
    key: 'retail',
    to: '/industries/retail/',
    pre: 'Retail and',
    em: 'supermarkets',
    text: 'Multi-counter checkouts, instant inventory audits, VIP loyalty tiers and WhatsApp receipts. Run every store from one head-office dashboard and turn one-time shoppers into regulars.',
    photo: 'https://images.unsplash.com/photo-1605447813584-26aeb3f8e6ae?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', // Retail and supermarkets
    alt: 'Shoppers in a brightly lit supermarket aisle',
    card: { title: 'Counter checkout', steps: ['Customer recognised', 'Gold tier applied', 'WhatsApp receipt sent'], pairs: [['Loyalty', 'Gold tier'], ['Receipt', 'WhatsApp']] },
  },
  {
    key: 'wholesale',
    to: '/industries/wholesale-distribution/',
    pre: 'Wholesale and',
    em: 'distribution',
    text: 'Bulk tier pricing, dealer credit limits and repayment tracking, fast bulk quotations and stock across multiple warehouses. Your reps sell more and your accounts team chases less.',
    photo: img('1664382953403-fc1ac77073a0'), // Centre for Ageing Better
    alt: 'Two people walking through a warehouse aisle with shelving',
    card: { title: 'Dealer order', steps: ['Order placed', 'Credit limit checked', 'Approved within limit'], pairs: [['Credit', 'Within limit'], ['Pricing', 'Bulk tier']] },
  },
  {
    key: 'contractors',
    to: '/industries/contractors-services/',
    pre: 'Contractors and',
    em: 'services',
    text: 'Job tracking from enquiry to final payment: estimates, milestone deposits, site photos and mobile receipts, with clients following progress in their own portal.',
    photo: img('1694521787193-9293daeddbaa'), // Glenov Brankovic
    alt: 'Construction workers in hard hats measuring a concrete block wall',
    card: { title: 'Job progress', steps: ['Estimate approved', 'Deposit received', 'Site photos added'], pairs: [['Deposit', 'Received'], ['Client portal', 'Shared']] },
  },
  {
    key: 'field',
    to: '/industries/field-service/',
    pre: 'Field service and',
    em: 'maintenance',
    text: 'Built for air conditioning, solar, generator, lift and CCTV companies: installed asset registers, annual maintenance contracts, preventive scheduling, technician apps and warranty-aware billing.',
    photo: img('1758101755915-462eddc23f57'), // Toolmash Expo
    alt: 'A technician testing an electrical panel with a multimeter',
    card: { title: 'Maintenance contract', steps: ['Visit scheduled', 'Technician on site', 'Service report sent'], pairs: [['Visit', 'Scheduled'], ['Warranty', 'Covered']] },
  },
  {
    key: 'startups',
    to: '/industries/startups/',
    pre: 'Startups and',
    em: 'SMEs',
    text: 'Zero-friction quotations and a clear client pipeline, up and running in an afternoon. No setup fee, no upgrade fees, and room to grow as you hire.',
    photo: img('1781246212288-7fa538344718'), // Ngital
    alt: 'A small team collaborating around a table with laptops',
    card: { title: 'Client pipeline', steps: ['Lead added', 'Quotation sent', 'Deal won'], pairs: [['Quotation', 'Sent'], ['Setup fee', 'None']] },
  },
]

/* the floating card acts out a short process: its steps advance in turn, then loop */
const phase = ref(0)

onMounted(() => {
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) phase.value = 2
  else timer = setInterval(() => { if (!document.hidden) phase.value++ }, 2300)

  const items = root.value?.querySelectorAll('.is-row') || []
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'))
    return
  }
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }),
    { threshold: 0.3 }
  )
  items.forEach((el) => io.observe(el))
})
onBeforeUnmount(() => {
  clearInterval(timer)
  io && io.disconnect()
})
</script>

<template>
  <section class="is" ref="root" aria-label="Industries">
    <article
      v-for="(it, i) in industries"
      :key="it.key"
      class="is-row"
      :style="{ '--i': i }"
    >
      <div class="is-copy">
        <h2 class="is-title">{{ it.pre }} <em>{{ it.em }}</em></h2>
        <p class="is-text">{{ it.text }}</p>
        <router-link :to="it.to" class="is-btn">
          Explore industry
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
            <path d="M4 10h11m-4-4.5L15.5 10 11 14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </router-link>

      </div>

      <div class="is-visual">
        <img class="is-photo" :src="it.photo" :alt="it.alt" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />

        <div class="is-card" aria-hidden="true">
          <div class="ic-head">
            <i class="ic-dot"></i>
            <b>{{ it.card.title }}</b>
            <span class="ic-kebab"><i></i><i></i><i></i></span>
          </div>
          <p class="ic-step" :key="(phase + i) % 3">{{ it.card.steps[(phase + i) % 3] }}</p>
          <div class="ic-tools">
            <span v-for="(t, n) in tools" :key="n"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="t"></svg></span>
            <span class="ic-more">+ more</span>
          </div>
          <div class="ic-meta">
            <div v-for="p in it.card.pairs" :key="p[0]"><small>{{ p[0] }}</small><b>{{ p[1] }}</b></div>
          </div>
          <div class="ic-prog">
            <small>Progress</small>
            <span class="ic-bar"><i :style="{ transform: 'scaleX(' + (((phase + i) % 3) + 1) / 3 + ')' }"></i></span>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.is { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; padding: clamp(16px, 3vw, 36px) clamp(10px, 1.8vw, 28px) clamp(40px, 6vw, 80px); }

/* stacked cards: each one pins near the top and the next card slides over it */
.is-row {
  --top: clamp(72px, 10vh, 104px);
  position: sticky;
  top: calc(var(--top) + var(--i) * 14px);
  max-width: 1360px;
  height: clamp(440px, 74svh, 620px);
  margin: 0 auto clamp(24px, 6vh, 56px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid #efe6dc;
  border-radius: 30px;
  background: #fbf8f4;
  box-shadow: 0 30px 60px -36px rgba(15, 23, 42, 0.35);
}
.is-row:last-child { margin-bottom: 0; }

/* ---------- left: copy ---------- */
.is-copy { display: flex; flex-direction: column; align-items: flex-start; padding: clamp(24px, 3.2vw, 48px); min-height: 0; }
.is-title {
  margin: 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 3.4vw, 50px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.055em;
  color: #0f172a;
}
.is-title em {
  font-style: normal;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.is-text { margin: auto 0 0; max-width: 440px; font-size: clamp(14px, 1.1vw, 16px); line-height: 1.65; color: #5b6676; }
.is-btn {
  margin-top: 18px;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px; border-radius: 999px;
  font-size: 14px; font-weight: 500; text-decoration: none; color: #fff;
  background: linear-gradient(135deg, #ff6818, #f2540c);
  box-shadow: 0 10px 24px -12px rgba(242, 84, 12, 0.7);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.is-btn svg { transition: transform 0.25s ease; }
.is-btn:hover { transform: translateY(-2px); }
.is-btn:hover svg { transform: translateX(3px); }
.is-btn:focus-visible { outline: 2px solid #0f172a; outline-offset: 3px; }


/* entrance */
.is-title, .is-text, .is-btn { opacity: 0; transform: translateY(16px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1); }
.is-row.in .is-title, .is-row.in .is-text, .is-row.in .is-btn { opacity: 1; transform: none; }
.is-row.in .is-title { transition-delay: 0.08s; }
.is-row.in .is-text { transition-delay: 0.16s; }
.is-row.in .is-btn { transition-delay: 0.24s; }

/* ---------- right: photo, runs to the card edge ---------- */
.is-visual { position: relative; overflow: hidden; min-height: 0; background: linear-gradient(145deg, #ff9a3d 0%, #ff6a1a 48%, #f2540c 100%); /* shows if a photo fails to load */ }
.is-visual::before { /* warm brand tint */
  content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(135deg, rgba(255, 106, 26, 0.3) 0%, rgba(242, 84, 12, 0.08) 45%, rgba(11, 17, 32, 0.22) 100%);
  mix-blend-mode: multiply;
}
.is-visual::after { /* shade so the card always reads */
  content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(to top, rgba(11, 17, 32, 0.5), transparent 60%);
}
.is-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.1); transition: transform 1.8s cubic-bezier(0.2, 0.7, 0.2, 1); }
.is-row.in .is-photo { transform: scale(1); }
.is-row:hover .is-photo { transform: scale(1.04); }

/* floating card — words only, no figures */
.is-card {
  position: absolute; z-index: 2; left: 50%; top: 50%;
  width: min(80%, 380px);
  padding: 18px 18px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  box-shadow: 0 28px 60px -22px rgba(0, 0, 0, 0.6);
  transform: translate(-50%, calc(-50% + 22px)); opacity: 0;
  transition: opacity 0.7s ease 0.5s, transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s;
}
.is-row.in .is-card { transform: translate(-50%, -50%); opacity: 1; }
.ic-head { display: flex; align-items: center; gap: 10px; font-size: 15px; }
.ic-head b { font-weight: 600; letter-spacing: -0.01em; }
.ic-dot { width: 10px; height: 10px; border-radius: 50%; background: #f2540c; box-shadow: 0 0 0 4px rgba(242, 84, 12, 0.16); animation: ic-pulse 1.8s ease-out infinite; }
@keyframes ic-pulse { 50% { box-shadow: 0 0 0 7px rgba(242, 84, 12, 0.04); } }
.ic-kebab { margin-left: auto; display: grid; gap: 3px; }
.ic-kebab i { width: 3.5px; height: 3.5px; border-radius: 50%; background: #94a0b0; }
.ic-step { margin: 12px 0 0; font-size: 14px; color: #334155; animation: ic-swap 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
@keyframes ic-swap { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.ic-tools { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
.ic-tools span { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; border: 1px solid #e8ebf0; color: #475569; background: #fff; }
.ic-tools .ic-more { width: auto; padding: 0 12px; border-radius: 999px; font-size: 11.5px; font-weight: 600; background: #f4f5f7; }
.ic-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; padding-top: 12px; border-top: 1px solid #eef0f3; }
.ic-meta small { display: block; font-size: 11.5px; color: #64748b; }
.ic-meta b { display: block; margin-top: 2px; font-size: 14px; font-weight: 600; }
.ic-prog { margin-top: 12px; }
.ic-prog small { display: block; font-size: 11.5px; color: #64748b; }
.ic-bar { display: block; margin-top: 6px; height: 5px; border-radius: 5px; background: #eceef2; overflow: hidden; }
.ic-bar i { display: block; height: 100%; width: 100%; border-radius: inherit; background: linear-gradient(90deg, #ff9a3d, #f2540c); transform-origin: left; transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1); }

/* ---------- smaller screens: plain stacked cards ---------- */
@media (max-width: 860px) {
  .is-row { position: relative; top: auto; height: auto; grid-template-columns: 1fr; border-radius: 24px; margin-bottom: 16px; }
  .is-visual { order: 1; aspect-ratio: 1.25; }
  .is-copy { order: 2; padding: 22px 20px 26px; }
  .is-card { width: min(86%, 340px); padding: 14px 14px 13px; }
}
@media (max-height: 600px) and (min-width: 861px) {
  .is-row { position: relative; top: auto; height: auto; min-height: 440px; }
}
@media (prefers-reduced-motion: reduce) {
  .is-title, .is-text, .is-btn { opacity: 1; transform: none; transition: none; }
  .is-card { opacity: 1; transform: translate(-50%, -50%); transition: none; }
  .is-photo { transform: none; transition: none; }
  .ic-dot, .ic-step { animation: none; }
  .ic-bar i { transition: none; }
}
</style>