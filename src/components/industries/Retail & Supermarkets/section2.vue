
<template>
  <section
    ref="rootEl"
    class="ra"
    :class="{
      'ra-js': mounted,
      'ra-in': revealed
    }"
    aria-labelledby="ra-title"
  >

    <div class="ra-wrap">

      <!-- LEFT SIDE -->

      <div class="ra-head">

        <h2 id="ra-title" class="ra-title">
          Retail <em>analytics</em>
        </h2>

        <p class="ra-lead">
          Understand your customers, track sales performance
          and make smarter retail decisions with actionable
          insights across every branch.
        </p>

      </div>

      <!-- RIGHT SIDE -->

      <ul class="ra-list">

        <li
          v-for="(it, i) in items"
          :key="it.t"
          class="ra-item"
          :style="{ '--i': i }"
        >

          <span
            class="ra-ico"
            aria-hidden="true"
            v-html="it.icon"
          ></span>

          <span class="ra-t">
            {{ it.t }}
          </span>

        </li>

      </ul>

    </div>

  </section>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount
} from 'vue'

defineOptions({
  name: 'RetailAnalytics'
})

/* =========================================
   SVG ICON HELPER
========================================= */

const svg = (d) => `
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    ${d}
  </svg>
`

/* =========================================
   RETAIL ANALYTICS FEATURES
========================================= */

const items = [

  {
    t: 'Repeat purchase rate and customer retention',

    icon: svg(`
      <path d="M20 7v5h-5"/>
      <path d="M4 17v-5h5"/>
      <path d="M6.1 7a7 7 0 0 1 11.6-1L20 9"/>
      <path d="M4 15l2.3 3A7 7 0 0 0 18 17"/>
      <circle cx="12" cy="10" r="2"/>
      <path d="M8.5 16a3.5 3.5 0 0 1 7 0"/>
    `)
  },

  {
    t: 'Sales by branch, category and staff member',

    icon: svg(`
      <path d="M3 3v18h18"/>
      <rect x="6" y="12" width="3" height="6" rx="0.7"/>
      <rect x="11" y="8" width="3" height="10" rx="0.7"/>
      <rect x="16" y="4" width="3" height="14" rx="0.7"/>
    `)
  },

  {
    t: 'Best sellers and slow movers',

    icon: svg(`
      <path d="M3 8l5-5 5 5"/>
      <path d="M8 3v17"/>
      <path d="M11 16l5 5 5-5"/>
      <path d="M16 21V4"/>
    `)
  },

  {
    t: 'Campaign results and VIP tier movement',

    icon: svg(`
      <path d="M3 18l6-6 4 4 8-9"/>
      <path d="M16 7h5v5"/>
      <path d="m7 3 1.2 2.5L11 6l-2 2 .5 2.8L7 9.5l-2.5 1.3L5 8 3 6l2.8-.5z"/>
    `)
  }

]

/* =========================================
   SCROLL REVEAL
========================================= */

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)

let io = null

onMounted(() => {

  mounted.value = true

  if (
    !rootEl.value ||
    !('IntersectionObserver' in window)
  ) {
    revealed.value = true
    return
  }

  io = new IntersectionObserver(
    ([entry]) => {

      if (entry.isIntersecting) {
        revealed.value = true
        io.disconnect()
      }

    },
    {
      threshold: 0.15
    }
  )

  io.observe(rootEl.value)

})

onBeforeUnmount(() => {
  io?.disconnect()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

/* =========================================
   SECTION
========================================= */

.ra,
.ra * {
  box-sizing: border-box;
}

.ra {
  /* Increased left and right spacing */

  --pad: clamp(24px, 7vw, 120px);

  width: 100%;

  font-family: 'Poppins', system-ui, sans-serif;

  color: #0f172a;
  background: #fff;
}

/* =========================================
   CENTERED TWO COLUMN LAYOUT
========================================= */

.ra-wrap {
  width: 100%;

  max-width: 1600px;

  margin: 0 auto;

  padding: clamp(56px, 8vw, 110px) var(--pad);

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1.15fr);

  gap: clamp(28px, 6vw, 96px);

  align-items: start;
}

/* =========================================
   LEFT SIDE
========================================= */

.ra-head {
  min-width: 0;
}

/* =========================================
   SECTION HEADING
========================================= */

.ra-title {
  margin: 0;

  padding-bottom: 0.12em;

  max-width: 20em;

  font-family: 'Urbanist', system-ui, sans-serif;

  font-size: clamp(30px, 4vw, 58px);
  font-weight: 500;

  line-height: 1.08;
  letter-spacing: -0.055em;

  text-wrap: balance;
}

.ra .ra-title {
  color: #0f172a !important;
}

/* =========================================
   GRADIENT HEADING TEXT
========================================= */

.ra-title em {
  font-style: normal;

  background: linear-gradient(
    100deg,
    #a1a1aa 0%,
    #8b8b93 50%,
    #6f6f78 100%
  );

  -webkit-background-clip: text;
  background-clip: text;

  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
}

/* =========================================
   INTRODUCTION
========================================= */

.ra-lead {
  margin: 18px 0 0;

  max-width: 26em;

  font-size: clamp(15px, 1.15vw, 17px);
  font-weight: 400;

  line-height: 1.65;

  color: #64748b;
}

/* =========================================
   ANALYTICS FEATURE LIST
========================================= */

.ra-list {
  min-width: 0;

  margin: 0;
  padding: 0;

  list-style: none;

  border-top: 1px solid #e4e4e9;
}

.ra-item {
  display: flex;

  align-items: center;

  gap: 18px;

  padding: clamp(16px, 1.6vw, 22px) 4px;

  border-bottom: 1px solid #e4e4e9;
}

/* =========================================
   CIRCULAR FEATURE ICONS
========================================= */

.ra-ico {
  flex: none;

  display: grid;
  place-items: center;

  width: 44px;
  height: 44px;

  border-radius: 50%;

  background: #f4f4f6;

  color: #0f172a;

  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.ra-ico :deep(svg) {
  width: 21px;
  height: 21px;
}

/* =========================================
   ICON HOVER
========================================= */

.ra-item:hover .ra-ico {
  background: #0f172a;

  color: #fff;
}

/* =========================================
   FEATURE TEXT
========================================= */

.ra-t {
  font-family: 'Urbanist', system-ui, sans-serif;

  font-size: clamp(17px, 1.5vw, 22px);

  font-weight: 600;

  letter-spacing: -0.02em;

  line-height: 1.25;
}

.ra .ra-t {
  color: #0f172a !important;
}

/* =========================================
   INITIAL ANIMATION STATE
========================================= */

.ra-js .ra-head > *,
.ra-js .ra-item {
  opacity: 0;

  translate: 0 20px;
}

/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

.ra-in .ra-head > *,
.ra-in .ra-item {
  opacity: 1;

  translate: 0 0;

  transition:
    opacity 0.8s ease,
    translate 0.9s cubic-bezier(
      0.2,
      0.8,
      0.2,
      1
    );
}

.ra-in .ra-head > :nth-child(2) {
  transition-delay: 0.08s;
}

.ra-in .ra-item {
  transition-delay: calc(
    0.1s + var(--i) * 0.08s
  );
}

/* =========================================
   TABLET RESPONSIVE
========================================= */

@media (max-width: 860px) {

  .ra-wrap {
    grid-template-columns: minmax(0, 1fr);

    gap: 32px;
  }

  .ra-lead {
    max-width: 34em;
  }

}

/* =========================================
   MOBILE RESPONSIVE
========================================= */

@media (max-width: 560px) {

  .ra-wrap {
    padding: 48px 24px;

    gap: 28px;
  }

  .ra-title {
    font-size: 36px;
  }

  .ra-lead {
    margin-top: 14px;

    font-size: 14px;
  }

  .ra-item {
    gap: 14px;

    padding: 18px 0;
  }

  .ra-ico {
    width: 42px;
    height: 42px;
  }

  .ra-t {
    font-size: 18px;
  }

}

/* =========================================
   REDUCED MOTION
========================================= */

@media (prefers-reduced-motion: reduce) {

  .ra-js .ra-head > *,
  .ra-js .ra-item {
    opacity: 1;

    translate: 0 0;
  }

  .ra * {
    transition: none !important;
  }

}
</style>
