<template>
  <section ref="rootEl" class="fx" :class="{ 'fx-in': revealed }" aria-label="Industries">
    <div class="fx-wrap">
      <div class="fx-grid">
        <!-- ============ left: stays in view while you scroll ============ -->
        <aside class="fx-aside">
          <div class="fx-aside-in">
            <div class="fx-copy-box">
              <Transition name="fx-swap" mode="out-in">
                <div :key="cur.id" class="fx-copy">
                  <h2>{{ cur.title }}</h2>
                  <p>{{ cur.description }}</p>
                  <router-link class="fx-btn" :to="cur.href">Explore</router-link>
                </div>
              </Transition>
            </div>

            <ul class="fx-list" aria-label="Industries">
              <li v-for="(f, i) in items_" :key="f.id">
                <button type="button" :class="{ on: active === i }" :aria-current="active === i ? 'true' : undefined" @click="goTo(i)">
                  {{ f.title }}
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- ============ right: one card per industry ============ -->
        <div class="fx-cards">
          <article v-for="(f, i) in items_" :key="f.id" :ref="(el) => (items[i] = el)" class="fx-item">
            <!-- phones: the text sits above each card instead of pinned on the left -->
            <div class="fx-mcopy">
              <h2>{{ f.title }}</h2>
              <p>{{ f.description }}</p>
              <router-link class="fx-btn" :to="f.href">Explore</router-link>
            </div>

            <div class="fx-card" :style="{ background: f.bg }" aria-hidden="true">
              <img class="fx-img" :src="f.img" alt="" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
              <span class="fx-of">{{ f.title }}</span>
              <div class="fx-chips">
                <span v-for="(c, n) in f.chips" :key="c" class="fx-chip" :style="{ '--i': n }">
                  <i><svg viewBox="0 0 24 24"><path d="m5 12.500 4.500 4.500L19 7" /></svg></i>{{ c }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'IndustriesScroll' })
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/* `img` is the photo on each card (swap any URL), `bg` the flat pastel shown behind / until the photo loads.
   `chips` are the features named in each description. */
const items_ = [
  {
    id: 'retail',
    href: '/industries/retail/',
    title: 'Retail and supermarkets',
    description:
      'Multi-counter checkouts, instant inventory audits, VIP loyalty tiers and WhatsApp receipts. Run every store from one head-office dashboard and turn one-time shoppers into regulars.',
    img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&q=80&auto=format&fit=crop',
    bg: '#D6E0D3',
    chips: ['Multi-counter checkouts', 'Instant inventory audits', 'VIP loyalty tiers', 'WhatsApp receipts', 'One head-office dashboard'],
  },
  {
    id: 'wholesale',
    href: '/industries/wholesale-distribution/',
    title: 'Wholesale and distribution',
    description:
      'Bulk tier pricing, dealer credit limits and repayment tracking, fast bulk quotations and stock across multiple warehouses. Your reps sell more and your accounts team chases less.',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80&auto=format&fit=crop',
    bg: '#DCE5EF',
    chips: ['Bulk tier pricing', 'Dealer credit limits', 'Repayment tracking', 'Fast bulk quotations', 'Stock across multiple warehouses'],
  },
  {
    id: 'contractors',
    href: '/industries/contractors-services/',
    title: 'Contractors and services',
    description:
      'Job tracking from enquiry to final payment: estimates, milestone deposits, site photos and mobile receipts, with clients following progress in their own portal.',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop',
    bg: '#F0DBC6',
    chips: ['Estimates', 'Milestone deposits', 'Site photos', 'Mobile receipts', 'Client progress portal'],
  },
  {
    id: 'field',
    href: '/industries/field-service/',
    title: 'Field service and maintenance',
    description:
      'Built for air conditioning, solar, generator, lift and CCTV companies: installed asset registers, annual maintenance contracts, preventive scheduling, technician apps and warranty-aware billing.',
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80&auto=format&fit=crop',
    bg: '#E9DDD9',
    chips: ['Installed asset registers', 'Annual maintenance contracts', 'Preventive scheduling', 'Technician apps', 'Warranty-aware billing'],
  },
  {
    id: 'startups',
    href: '/industries/startups/',
    title: 'Startups and SMEs',
    description:
      'Zero-friction quotations and a clear client pipeline, up and running in an afternoon. No setup fee, no upgrade fees, and room to grow as you hire.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop',
    bg: '#F4F1DE',
    chips: ['Zero-friction quotations', 'Clear client pipeline', 'Up and running in an afternoon', 'No setup fee', 'No upgrade fees'],
  },
]

/* ---------- scroll logic ---------- */
const rootEl = ref(null)
const active = ref(0)
const revealed = ref(false)
const cur = computed(() => items_[active.value])

const items = [] // the <article> elements
let cards = [] // their .fx-card children
let raf = 0
let io = null
let rootIo = null

/* the card closest to the middle of the screen is the active one;
   --p (-1 … 1) is how far a card is from the middle, used for a gentle parallax */
function update() {
  raf = 0
  const vh = window.innerHeight
  const mid = midLine()
  let best = 0
  let bestD = Infinity
  cards.forEach((el, i) => {
    if (!el) return
    const r = el.getBoundingClientRect()
    const c = r.top + r.height / 2
    const d = Math.abs(c - mid)
    if (d < bestD) {
      bestD = d
      best = i
    }
    el.style.setProperty('--p', Math.max(-1, Math.min(1, (c - mid) / vh)).toFixed(3))
  })
  if (best !== active.value) active.value = best
}
function queue() {
  if (!raf) raf = requestAnimationFrame(update)
}
/* centre of the visible area under the fixed header; the pinned column is centred on the same line */
function midLine() {
  const vh = window.innerHeight
  const aside = rootEl.value?.querySelector('.fx-aside')
  const top = aside ? parseFloat(getComputedStyle(aside).top) || 0 : 0
  return top + (vh - top) / 2
}
function goTo(i) {
  const el = cards[i]
  if (!el) return
  const r = el.getBoundingClientRect()
  window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - midLine(), behavior: 'smooth' })
}

onMounted(() => {
  cards = items.map((el) => el?.querySelector('.fx-card'))
  update()
  window.addEventListener('scroll', queue, { passive: true })
  window.addEventListener('resize', queue)

  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in')
          io.unobserve(en.target)
        }
      }),
    { threshold: 0.12 },
  )
  items.forEach((el) => el && io.observe(el))

  rootIo = new IntersectionObserver(([en]) => en.isIntersecting && (revealed.value = true), { threshold: 0.1 })
  rootIo.observe(rootEl.value)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', queue)
  window.removeEventListener('resize', queue)
  io?.disconnect()
  rootIo?.disconnect()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Urbanist:wght@500;600&display=swap');

/* NOTE: no `overflow: hidden` on .fx or its parents, it would stop the left column from staying pinned. */
.fx {
  --navy: #0f172a;
  --ink: #3b4659;
  --nav-dim: #667085;
  --fx-top: var(--fx-header, 104px); /* distance below the fixed site header; set --fx-header on a parent if your header is taller */
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  width: 100%;
  padding: clamp(32px, 4vw, 56px) clamp(12px, 1.6vw, 28px) clamp(48px, 6vw, 88px);
  background: #fff;
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--navy);
}
.fx, .fx *, .fx *::before, .fx *::after { box-sizing: border-box; }
.fx svg { display: block; }
.fx-wrap { width: 100%; max-width: 1240px; margin: 0 auto; }

.fx-aside { opacity: 0; transform: translateY(16px); transition: opacity 0.7s ease, transform 0.8s var(--ease); }
.fx-in .fx-aside { opacity: 1; transform: none; }

/* ---------- two columns ---------- */
.fx-grid {
  display: grid;
  grid-template-columns: minmax(300px, 520px) minmax(0, 560px);
  justify-content: space-between;
  gap: 24px;
  align-items: start;
}

/* ---------- left: pinned text ---------- */
.fx-aside {
  position: sticky;
  top: var(--fx-top);
  display: flex;
  height: calc(100vh - 2 * var(--fx-top));
  height: calc(100svh - 2 * var(--fx-top));
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  padding: 4px 6px 4px 0;
}
.fx-aside::-webkit-scrollbar { display: none; }
.fx-aside-in { width: 100%; margin: auto 0; }
.fx-copy-box { min-height: clamp(230px, 34svh, 290px); }
.fx-copy h2, .fx-mcopy h2 {
  margin: 0 0 14px;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 3.1vw, 42px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.05em;
  color: #0a0a0a;
}
.fx-copy p, .fx-mcopy p {
  margin: 0 0 24px;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.fx-swap-enter-active { transition: opacity 0.5s ease 0.05s, transform 0.65s var(--ease), filter 0.5s ease; }
.fx-swap-leave-active { transition: opacity 0.22s ease, transform 0.3s ease, filter 0.25s ease; }
.fx-swap-enter-from { opacity: 0; transform: translateY(16px); filter: blur(3px); }
.fx-swap-leave-to { opacity: 0; transform: translateY(-10px); filter: blur(4px); }

/* industry list */
.fx-list { margin: 20px 0 0; padding: 18px 0 0; list-style: none; border-top: 1px solid #e6e3df; display: grid; gap: 1px; }
.fx-list button {
  display: flex; align-items: center; width: 100%; padding: 4px 0;
  border: 0; background: none; cursor: pointer; text-align: left;
  font-family: 'Urbanist', system-ui, sans-serif; font-size: 18px; font-weight: 500; line-height: 1.3; letter-spacing: -0.02em;
  color: var(--nav-dim); transition: color 0.3s;
}
.fx-list button::before {
  content: ''; flex: none; width: 0; height: 7px; margin-right: 0; border-radius: 50%; background: #0a0a0a;
  transition: width 0.3s var(--ease), margin-right 0.3s var(--ease);
}
.fx-list button:hover { color: #0a0a0a; }
.fx-list button.on { color: #0a0a0a; font-weight: 600; }
.fx-list button.on::before { width: 7px; margin-right: 10px; }
.fx-list button:focus-visible { outline: 2px solid #0a0a0a; outline-offset: 3px; border-radius: 6px; }

/* Explore button */
.fx-btn {
  display: inline-flex; align-items: center;
  padding: 14px 26px; border-radius: 999px;
  background: #0a0a0a; color: #fff; text-decoration: none;
  font: 500 14px/1 'Poppins', system-ui, sans-serif;
  transition: background 0.3s, transform 0.3s;
}
.fx-btn:hover { background: #2a2a2e; transform: translateY(-2px); }
.fx-btn:focus-visible { outline: 2px solid #0a0a0a; outline-offset: 3px; }

/* ---------- right: cards ---------- */
.fx-item { padding-bottom: clamp(56px, 12vh, 120px); }
.fx-item:last-child { padding-bottom: 130px; } /* keeps the left text pinned while the last card is in view */
.fx-mcopy { display: none; }
.fx-card {
  --p: 0;
  position: relative;
  height: 480px;
  border-radius: 36px;
  overflow: hidden;
  isolation: isolate;
  opacity: 0;
  transform: translateY(44px) scale(0.97);
  transition: opacity 0.8s ease, transform 1s var(--ease);
}
.fx-item.in .fx-card { opacity: 1; transform: none; }

.fx-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transform: scale(calc(1.08 + var(--p) * 0.04)) translateY(calc(var(--p) * 16px)); }
.fx-of {
  position: absolute; right: 26px; top: 26px; max-width: calc(100% - 52px);
  padding: 0 16px; height: 42px; display: inline-flex; align-items: center; border-radius: 999px;
  background: rgba(255, 255, 255, 0.78); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  font: 600 13px/1 'Poppins', sans-serif; color: #0a0a0a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.fx-chips {
  position: absolute; left: 24px; right: 24px; bottom: 26px;
  display: flex; flex-wrap: wrap; gap: 8px;
  transform: translateY(calc(var(--p) * -14px));
}
.fx-chip {
  display: inline-flex; align-items: center; gap: 9px;
  max-width: 100%;
  padding: 7px 15px 7px 7px; border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  font-family: 'Urbanist', system-ui, sans-serif; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; color: #0a0a0a;
  opacity: 0; transform: translateY(14px);
  transition: opacity 0.6s ease, transform 0.8s var(--ease);
  transition-delay: calc(0.25s + var(--i) * 0.09s);
}
.fx-item.in .fx-chip { opacity: 1; transform: none; }
.fx-chip i { flex: none; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #0a0a0a; }
.fx-chip svg { width: 12px; height: 12px; fill: none; stroke: #fff; stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; }

/* short laptop screens */
@media (min-width: 901px) and (max-height: 760px) {
  .fx-copy h2 { font-size: 34px; margin-bottom: 10px; }
  .fx-copy p { font-size: 14.5px; margin-bottom: 18px; }
  .fx-copy-box { min-height: 220px; }
  .fx-list { margin-top: 14px; padding-top: 12px; }
  .fx-list button { font-size: 17px; padding: 3px 0; }
}

/* ---------- tablets / phones: text moves above each card ---------- */
@media (max-width: 900px) {
  .fx-grid { grid-template-columns: minmax(0, 1fr); max-width: 560px; margin: 0 auto; gap: 0; }
  .fx-aside { display: none; }
  .fx-mcopy { display: block; margin-bottom: 22px; }
  .fx-mcopy h2 { font-size: clamp(32px, 8vw, 44px); line-height: 1.2; }
  .fx-item, .fx-item:last-child { padding-bottom: 64px; }
  .fx-item:last-child { padding-bottom: 0; }
  .fx-card { height: 440px; border-radius: 28px; }
}
@media (max-width: 480px) {
  .fx-copy h2, .fx-mcopy h2 { font-size: 34px; line-height: 1.2; }
  .fx-of { right: 18px; top: 18px; }
  .fx-chips { left:a 16px; right: 16px; bottom: 18px; }
  .fx-chip { font-size: 14px; }
}

@media (prefers-reduced-motion: reduce) {
  .fx-card, .fx-chip, .fx-aside { opacity: 1 !important; transform: none !important; transition: none !important; }
  .fx-img, .fx-chips { transform: none !important; }
}
</style>