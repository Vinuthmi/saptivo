
<template>
  <section class="dc" aria-label="Contractor features">
    <ul
      ref="trackEl"
      class="dc-grid"
      :class="{ 'dc-static': cards.length <= 4 }"
      aria-label="Contractor features carousel"
      @scroll.passive="onScroll"
    >
      <li
        v-for="c in cards"
        :key="c.id"
        class="dc-card"
        tabindex="0"
      >
        <img
          v-if="!failed[c.id]"
          class="dc-img"
          :src="c.img"
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          @error="failed[c.id] = true"
        />

        <span class="dc-shade" aria-hidden="true"></span>

        <div class="dc-copy">
          <h2 class="dc-h">{{ c.h }}</h2>
          <p class="dc-p">{{ c.p }}</p>
        </div>
      </li>
    </ul>

    <!-- Navigation only when more than four cards -->

    <div v-if="cards.length > 4" class="dc-nav">

      <div class="dc-dots" aria-hidden="true">
        <i
          v-for="n in pages"
          :key="n"
          :class="{ 'is-on': n - 1 === active }"
        ></i>
      </div>

      <button
        type="button"
        class="dc-btn"
        :disabled="atStart"
        aria-label="Previous"
        @click="go(-1)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 5-7 7 7 7" />
        </svg>
      </button>

      <button
        type="button"
        class="dc-btn"
        :disabled="atEnd"
        aria-label="Next"
        @click="go(1)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>

    </div>
  </section>
</template>

<script setup>
import {
  reactive,
  ref,
  onMounted,
  onBeforeUnmount
} from 'vue'

defineOptions({
  name: 'ContractorCards'
})

const u = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=85&auto=format&fit=crop`

const cards = [
  {
    id: 'enquiries',
    h: 'Capture and qualify every enquiry',
    img: u('1504307651254-35680f356dfd'),
    p: "Website forms, Facebook leads, WhatsApp messages and calls all arrive as leads with their source recorded. Book the site visit, attach photos and measurements, and move the job into your pipeline."
  },
  {
    id: 'estimates',
    h: 'Estimates to quotations',
    img: u('1503387762-592deb58ef4e'),
    p: "Give the customer rough numbers today with Saptivo's estimates engine, including multi-tier options and version history. When scope is agreed, turn the estimate into a polished, branded quotation."
  },
  {
    id: 'billing',
    h: 'Milestone deposits and progress billing',
    img: u('1450101499163-c8848c66ca85'),
    p: "Bill by project stage: deposit, mid-point and completion. Saptivo tracks what has been invoiced and paid for each milestone, so cash flow stays healthy."
  },
  {
    id: 'tracking',
    h: 'Job tracking customers can follow',
    img: u('1541888946425-d81bb19240f5'),
    p: "Milestones, site photos and notes are recorded against the job. Customers follow progress in their own branded portal, with expected dates and milestone notifications, cutting down status calls."
  },
  {
    id: 'mobile',
    h: 'Mobile receipts and field updates',
    img: u('1512941937669-90a1b58e7e9c'),
    p: "Collect payments on site and send receipts instantly from Saptivo mobile. Teams log notes, photos and outcomes from the field, even offline."
  }
]

const failed = reactive({})
const trackEl = ref(null)

const atStart = ref(true)
const atEnd = ref(false)
const pages = ref(1)
const active = ref(0)

let resizeObserver = null

function onScroll() {
  const t = trackEl.value

  if (!t) return

  const c = t.querySelector('.dc-card')

  const gap =
    parseFloat(getComputedStyle(t).columnGap) || 0

  const step = c
    ? c.getBoundingClientRect().width + gap
    : 1

  const maxScroll = Math.max(
    0,
    t.scrollWidth - t.clientWidth
  )

  pages.value = Math.max(
    1,
    Math.ceil((maxScroll - 1) / step) + 1
  )

  atStart.value = t.scrollLeft <= 4

  atEnd.value =
    t.scrollLeft + t.clientWidth >= t.scrollWidth - 4

  active.value = atEnd.value
    ? pages.value - 1
    : Math.min(
        pages.value - 1,
        Math.round(t.scrollLeft / step)
      )
}

function go(dir) {
  const t = trackEl.value
  const c = t?.querySelector('.dc-card')

  if (!t || !c) return

  const gap =
    parseFloat(getComputedStyle(t).columnGap) || 0

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  t.scrollBy({
    left: dir * (c.getBoundingClientRect().width + gap),
    behavior: reducedMotion ? 'auto' : 'smooth'
  })
}

onMounted(() => {
  onScroll()

  window.addEventListener('resize', onScroll, {
    passive: true
  })

  if ('ResizeObserver' in window && trackEl.value) {
    resizeObserver = new ResizeObserver(onScroll)
    resizeObserver.observe(trackEl.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onScroll)
  resizeObserver?.disconnect()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');

.dc,
.dc * {
  box-sizing: border-box;
}

.dc {
  --gap: clamp(12px, 1.4vw, 20px);

  font-family: 'Urbanist', system-ui, sans-serif;
  background: #fff;
  color: #0f172a;

  padding: clamp(32px, 5vw, 72px)
           clamp(16px, 3vw, 32px);
}

/* Carousel layout */

.dc-grid {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 1560px;

  display: grid;
  grid-auto-flow: column;

  grid-auto-columns:
    calc((100% - 3 * var(--gap)) / 4);

  column-gap: var(--gap);

  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
}

.dc-grid::-webkit-scrollbar {
  display: none;
}

/* Static layout for four cards or fewer */

.dc-grid.dc-static {
  grid-auto-flow: row;
  grid-auto-columns: auto;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: var(--gap);

  overflow: visible;
  scroll-snap-type: none;
}

/* Photo cards */

.dc-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  scroll-snap-align: start;

  aspect-ratio: 1 / 1.1;

  border-radius: clamp(20px, 2vw, 28px);

  color: #fff;

  background: linear-gradient(
    150deg,
    #5b5855,
    #1c1b1a
  );

  outline: none;
}

.dc-img {
  position: absolute;
  inset: 0;
  z-index: -2;

  width: 100%;
  height: 100%;

  object-fit: cover;
  display: block;
}

.dc-shade {
  position: absolute;
  inset: 0;
  z-index: -1;

  background: linear-gradient(
    180deg,
    rgba(8, 10, 14, 0.72) 0%,
    rgba(8, 10, 14, 0.30) 55%,
    rgba(8, 10, 14, 0.10) 100%
  );
}

.dc-card:hover .dc-shade,
.dc-card:focus-within .dc-shade {
  background: rgba(8, 10, 14, 0.78);
}

.dc-card:focus-visible {
  outline: 3px solid #71717a;
  outline-offset: -3px;
}

/* Card content */

.dc-copy {
  padding: clamp(18px, 1.8vw, 26px);

  max-height: 100%;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: #ffffff60 transparent;
}

.dc-h {
  margin: 0;

  font-size: clamp(20px, 1.75vw, 25px);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.015em;

  color: #fff !important;
}

.dc-p {
  display: none;

  margin: 10px 0 0;

  font-size: clamp(12.5px, 0.95vw, 14.5px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.012em;

  color: #fff !important;

  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.6),
    0 2px 16px rgba(0, 0, 0, 0.7);
}

.dc-card:hover .dc-p,
.dc-card:focus-within .dc-p {
  display: block;
}

/* Carousel navigation */

.dc-nav {
  max-width: 1560px;

  margin: clamp(16px, 2vw, 26px) auto 0;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 10px;
}

/* Pagination dots */

.dc-dots {
  display: flex;
  align-items: center;

  gap: 8px;
  margin-right: auto;
}

.dc-dots i {
  width: 8px;
  height: 8px;

  border-radius: 999px;
  background: #a1a1aa;
}

.dc-dots i.is-on {
  width: 28px;
  background: #0f172a;
}

/* Navigation arrows */

.dc-btn {
  display: grid;
  place-items: center;

  width: 46px;
  height: 46px;
  padding: 0;

  border-radius: 50%;
  border: 1.5px solid #0f172a;

  background: #fff;
  color: #0f172a;

  cursor: pointer;
}

.dc-btn svg {
  width: 20px;
  height: 20px;
}

.dc-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

.dc-btn:focus-visible {
  outline: 2px solid #0f172a;
  outline-offset: 2px;
}

/* Touch devices */

@media (hover: none) {
  .dc-p {
    display: block;
  }

  .dc-card {
    aspect-ratio: auto;
    min-height: 320px;
  }

  .dc-shade {
    background: rgba(8, 10, 14, 0.75);
  }

  .dc-copy {
    overflow-y: visible;
  }
}

/* Tablet */

@media (max-width: 1100px) {
  .dc-grid {
    grid-auto-columns:
      calc((100% - var(--gap)) / 2);
  }

  .dc-grid.dc-static {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

/* Mobile */

@media (max-width: 560px) {
  .dc-grid {
    grid-auto-columns: 82%;
  }

  .dc-grid.dc-static {
    grid-template-columns: minmax(0, 1fr);
  }

  .dc-card {
    aspect-ratio: auto;
    min-height: 320px;
  }

  .dc-p {
    display: block;
  }

  .dc-shade {
    background: rgba(8, 10, 14, 0.75);
  }

  .dc-btn {
    width: 40px;
    height: 40px;
  }

  .dc-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>
