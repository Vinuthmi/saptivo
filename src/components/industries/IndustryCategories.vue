<template>
  <section class="sc" aria-label="Industries Saptivo is built for">
    <div class="sc-box">
      <!-- connected white pill that floats over the top edge of the container -->
      <div class="sc-navwrap">
        <div class="sc-nav" role="tablist" aria-label="Industries" @keydown="onKey">
          <button
            v-for="(c, i) in items"
            :id="'sc-tab-' + c.id"
            :key="c.id"
            ref="tabEls"
            type="button"
            role="tab"
            class="sc-tab"
            :class="{ on: i === active }"
            :aria-selected="i === active"
            :aria-controls="'sc-panel-' + c.id"
            :tabindex="i === active ? 0 : -1"
            @click="select(i)"
          >
            <span>{{ c.tab }}</span>
          </button>
        </div>
      </div>

      <!-- photo layer (clipped to the rounded corners) -->
      <div class="sc-media" aria-hidden="true">
        <img
          v-for="(c, i) in items"
          :key="c.id"
          class="sc-img"
          :class="{ on: i === active }"
          :src="c.img"
          alt=""
          :loading="i === 0 ? 'eager' : 'lazy'"
          decoding="async"
          draggable="false"
          @error="$event.target.style.display = 'none'"
        />
        <span class="sc-shade"></span>
      </div>

      <!-- content -->
      <div class="sc-body">
        <Transition name="sc-swap" mode="out-in">
          <div :id="'sc-panel-' + cur.id" :key="cur.id" class="sc-copy" role="tabpanel" :aria-labelledby="'sc-tab-' + cur.id">
            <h2 class="sc-h">{{ cur.title }}</h2>
            <p class="sc-p">{{ cur.text }}</p>
            <router-link class="sc-btn" :to="cur.href">
              Explore
            </router-link>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * SectionIndustriesShowcase.vue — interactive industries showcase (Vue 3, Composition API, <script setup>)
 *
 * One large rounded photo container. The five industry tabs sit in a white panel cut into the top edge of the photo
 * (centred, rounded bottom corners, concave corners where it meets the edge, like the Cova reference). Active tab = orange text + no underline; inactive = navy.
 * Below the pill: full-width photo (cross-fades per tab), navy-to-transparent overlay for white text, and the
 * industry title, paragraph (your copy word for word) and an underlined Explore link on the left. The right side is left
 * open so the photo shows.
 * Keyboard: Left / Right / Home / End move between tabs. On narrow screens the pill scrolls sideways.
 * `img` is the photo for each industry (swap any URL, or /images/industries/xxx.jpg from /public).
 * Brand: navy #14243A, orange #FF6B16, ivory #F9F8F4, beige #F4F1DE.
 */
import { ref, computed, nextTick, watch } from 'vue'
defineOptions({ name: 'SectionIndustriesShowcase' })

const items = [
  {
    id: 'retail',
    tab: 'Retail & Supermarkets',
    title: 'Retail and supermarkets',
    text: 'Multi-counter checkouts, instant inventory audits, VIP loyalty tiers and WhatsApp receipts. Run every store from one head-office dashboard and turn one-time shoppers into regulars.',
    href: '/industries/retail/',
    img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1800&q=80&auto=format&fit=crop',
  },
  {
    id: 'wholesale',
    tab: 'Wholesale & Distribution',
    title: 'Wholesale and distribution',
    text: 'Bulk tier pricing, dealer credit limits and repayment tracking, fast bulk quotations and stock across multiple warehouses. Your reps sell more and your accounts team chases less.',
    href: '/industries/wholesale-distribution/',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&q=80&auto=format&fit=crop',
  },
  {
    id: 'contractors',
    tab: 'Contractors & Services',
    title: 'Contractors and services',
    text: 'Job tracking from enquiry to final payment: estimates, milestone deposits, site photos and mobile receipts, with clients following progress in their own portal.',
    href: '/industries/contractors-services/',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=80&auto=format&fit=crop',
  },
  {
    id: 'field',
    tab: 'Field Service & Maintenance',
    title: 'Field service and maintenance',
    text: 'Built for air conditioning, solar, generator, lift and CCTV companies: installed asset registers, annual maintenance contracts, preventive scheduling, technician apps and warranty-aware billing.',
    href: '/industries/field-service/',
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1800&q=80&auto=format&fit=crop',
  },
  {
    id: 'startups',
    tab: 'Startups & SMEs',
    title: 'Startups and SMEs',
    text: 'Zero-friction quotations and a clear client pipeline, up and running in an afternoon. No setup fee, no upgrade fees, and room to grow as you hire.',
    href: '/industries/startups/',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&q=80&auto=format&fit=crop',
  },
]

const active = ref(0)
const tabEls = ref([])
const cur = computed(() => items[active.value])

function select(i) {
  active.value = i
}
function onKey(e) {
  const n = items.length
  let k = null
  if (e.key === 'ArrowRight') k = (active.value + 1) % n
  else if (e.key === 'ArrowLeft') k = (active.value + n - 1) % n
  else if (e.key === 'Home') k = 0
  else if (e.key === 'End') k = n - 1
  if (k === null) return
  e.preventDefault()
  active.value = k
  nextTick(() => tabEls.value[k]?.focus())
}
// on small screens keep the active tab inside the scrolling pill
watch(active, (i) => {
  nextTick(() => tabEls.value[i]?.scrollIntoView?.({ inline: 'center', block: 'nearest', behavior: 'smooth' }))
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Urbanist:wght@500;600&display=swap');
</style>

<style scoped>
.sc {
  --navy: #14243a;
  --orange: #ff6b16;
  --ivory: #f9f8f4;
  --beige: #f4f1de;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  padding: clamp(36px, 5vw, 72px) clamp(4px, 0.6vw, 8px);
  background: #fff;
  font-family: 'Poppins', system-ui, sans-serif;
}
.sc *,
.sc *::before,
.sc *::after {
  box-sizing: border-box;
}
.sc svg {
  display: block;
}

/* the photo layer is clipped to the rounded corners; the tab panel sits on the top edge */
.sc-box {
  position: relative;
  max-width: 1680px;
  height: clamp(480px, 42vw, 560px);
  margin: 0 auto;
  border-radius: clamp(24px, 2.6vw, 34px);
  background: var(--navy);
}

/* ---------- tab panel: a white notch cut into the top edge, with concave corners where it meets the photo ---------- */
.sc-navwrap {
  --r: clamp(18px, 2.2vw, 30px); /* radius of the panel's bottom corners and of the concave corners */
  position: absolute;
  z-index: 5;
  top: 0;
  left: 50%;
  width: max-content;
  max-width: calc(100% - 2 * var(--r) - 2 * clamp(24px, 2.6vw, 34px)); /* stays clear of the container's own rounded corners */
  transform: translateX(-50%);
  border-radius: 0 0 var(--r) var(--r);
  background: #fff; /* same white as the page, so the panel reads as a cut-out of the container */
}
.sc-navwrap::before,
.sc-navwrap::after {
  /* concave (inverted) corners joining the panel to the container's top edge */
  content: '';
  position: absolute;
  top: 0;
  width: calc(var(--r) + 1px);
  height: var(--r);
  pointer-events: none;
}
.sc-navwrap::before {
  right: calc(100% - 1px); /* 1px overlap hides the hairline seam */
  background: radial-gradient(circle at 0 100%, transparent calc(var(--r) - 0.5px), #fff var(--r));
}
.sc-navwrap::after {
  left: calc(100% - 1px);
  background: radial-gradient(circle at 100% 100%, transparent calc(var(--r) - 0.5px), #fff var(--r));
}
.sc-nav {
  display: flex;
  align-items: center;
  gap: clamp(0px, 0.6vw, 8px);
  padding: 4px clamp(10px, 1.4vw, 20px) 6px;
  overflow-x: auto;
  scrollbar-width: none;
}
.sc-nav::-webkit-scrollbar {
  display: none;
}
.sc-tab {
  position: relative;
  flex: none;
  padding: 14px clamp(11px, 1.15vw, 16px);
  border: 0;
  background: none;
  cursor: pointer;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(13.5px, 1.05vw, 15px);
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  color: #8a8f98;
  text-decoration: none;
  transition: color 0.3s ease;
}
.sc-tab span {
  display: inline-block;
  text-decoration: none;
}
.sc-tab:hover,
.sc-tab.on,
.sc-tab:focus-visible {
  color: #0a0a0a;
}
.sc-tab:focus-visible {
  outline: 2px solid #0a0a0a;
  outline-offset: -4px;
  border-radius: 999px;
}

/* ---------- photo layer ---------- */
.sc-media {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  overflow: hidden;
  background: var(--navy);
}
.sc-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.06);
  transition: opacity 0.8s ease, transform 1.4s var(--ease);
  user-select: none;
}
.sc-img.on {
  opacity: 1;
  transform: scale(1);
}
.sc-shade {
  /* navy overlay: strong on the text side, lighter on the right so the photo still shows */
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(20, 36, 58, 0.88) 0%, rgba(20, 36, 58, 0.62) 42%, rgba(20, 36, 58, 0.18) 100%),
    linear-gradient(0deg, rgba(20, 36, 58, 0.5) 0%, rgba(20, 36, 58, 0) 45%);
}

/* ---------- content ---------- */
.sc-body {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  height: 100%;
  padding: clamp(64px, 7vw, 84px) clamp(16px, 2vw, 30px) clamp(24px, 3vw, 36px);
}
.sc-copy {
  max-width: 520px;
}
.sc-h {
  margin: 0 !important;
  font-family: Urbanist, 'Urbanist Placeholder', sans-serif !important;
  font-size: 54px !important;
  font-weight: 600 !important;
  line-height: 65px !important;
  letter-spacing: -1px !important;
  color: #fff !important;
}
.sc-p {
  margin: 16px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15.5px, 1.25vw, 18px);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.9);
}
.sc-btn {
  display: inline-block;
  margin-top: 24px;
  padding: 4px 0;
  color: #fff;
  font: 600 16px/1.2 'Urbanist', system-ui, sans-serif;
  letter-spacing: -0.01em;
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 6px;
  transition: opacity 0.3s, text-underline-offset 0.3s var(--ease);
}
.sc-btn:hover {
  opacity: 0.8;
  text-underline-offset: 9px;
}
.sc-btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 4px;
  border-radius: 4px;
}

.sc-swap-enter-active {
  transition: opacity 0.5s ease 0.05s, transform 0.65s var(--ease);
}
.sc-swap-leave-active {
  transition: opacity 0.2s ease, transform 0.25s ease;
}
.sc-swap-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.sc-swap-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ---------- responsive ---------- */
@media (max-width: 1100px) {
  .sc-tab { padding: 14px 9px; font-size: 13px; }
}
@media (max-width: 900px) {
  .sc-box { height: clamp(500px, 78vw, 560px); }
  .sc-shade {
    background:
      linear-gradient(90deg, rgba(20, 36, 58, 0.86) 0%, rgba(20, 36, 58, 0.55) 100%),
      linear-gradient(0deg, rgba(20, 36, 58, 0.5) 0%, rgba(20, 36, 58, 0) 45%);
  }
}
@media (max-width: 620px) {
  .sc-h {
    font-size: 36px !important;
    line-height: 46px !important;
    letter-spacing: -0.7px !important;
  }
}
@media (max-width: 560px) {
  .sc-box { height: 560px; }
  .sc-body { align-items: flex-end; padding: 64px 14px 20px; }
  .sc-copy { max-width: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sc *,
  .sc *::before,
  .sc *::after {
    transition: none !important;
  }
}
</style>