
<template>
  <section
    ref="rootEl"
    class="rch"
    :class="{ 'rch-in': revealed }"
    aria-labelledby="rch-title"
  >

    <div class="rch-wrap">

      <!-- Section heading -->

      <h2 id="rch-title" class="rch-title">
        Common retail challenges
        <em>Saptivo solves</em>
      </h2>

      <!-- Asymmetric bento grid -->

      <ul class="rch-grid">

        <li
          v-for="(card, i) in cards"
          :key="card.id"
          class="rch-card"
          :class="`rch-${card.id}`"
          :style="{
            '--i': i,
            background: card.bg
          }"
        >

          <!-- Tall photography card -->

          <template v-if="card.kind === 'photo'">

            <div class="rch-photo-wrap">

              <img
                v-if="!failed[card.id]"
                :src="card.img"
                class="rch-img"
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
                @error="failed[card.id] = true"
              />

              <span
                v-else
                class="rch-photo-fallback"
                v-html="card.icon"
              ></span>

            </div>

            <div class="rch-photo-copy">

              <h3>{{ card.title }}</h3>

            </div>

          </template>

          <!-- Wide inventory card -->

          <template v-else-if="card.kind === 'wide'">

            <div class="rch-wide-copy">

              <span
                class="rch-small-icon"
                v-html="card.icon"
                aria-hidden="true"
              ></span>

              <h3>{{ card.title }}</h3>

            </div>

            <div class="rch-wide-photo">

              <img
                v-if="!failed[card.id]"
                :src="card.img"
                class="rch-img"
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
                @error="failed[card.id] = true"
              />

              <span
                v-else
                class="rch-photo-fallback"
                v-html="card.icon"
              ></span>

            </div>

          </template>

          <!-- Pastel icon cards -->

          <template v-else>

            <div class="rch-card-body">

              <span
                class="rch-small-icon"
                aria-hidden="true"
                v-html="card.icon"
              ></span>

              <h3>{{ card.title }}</h3>

            </div>

            <span
              class="rch-deco"
              aria-hidden="true"
              v-html="card.icon"
            ></span>

          </template>

        </li>

      </ul>

    </div>

  </section>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount
} from 'vue'

defineOptions({
  name: 'RetailChallenges'
})

const svg = (d) => `
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    ${d}
  </svg>
`

const cards = [
  {
    id: 'returning',
    kind: 'photo',

    title: 'Customers buy once and never return',

    bg: '#EEE8DF',

    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85&auto=format&fit=crop',

    icon: svg(`
      <circle cx="12" cy="7" r="4"/>
      <path d="M4 21v-2a8 8 0 0 1 16 0v2"/>
    `)
  },

  {
    id: 'loyalty',
    kind: 'tint',

    title: 'Loyalty cards and points tracked on paper or in spreadsheets',

    bg: '#F1E8D9',

    icon: svg(`
      <rect x="4" y="3" width="16" height="18" rx="2"/>
      <path d="M8 3v18M11 8h5M11 12h5M11 16h3"/>
      <path d="M2 7h4M2 12h4M2 17h4"/>
    `)
  },

  {
    id: 'offers',
    kind: 'tint',

    title: 'No way to contact customers with offers',

    bg: '#E3E8F1',

    icon: svg(`
      <path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5
               8.5 8.5 0 0 1-4-.9L3 21l1.5-4.5
               A8.5 8.5 0 0 1 20 11.5z"/>
      <path d="m9 9 6 6M15 9l-6 6"/>
    `)
  },

  {
    id: 'stock',
    kind: 'wide',

    title: 'Stock imbalances between stores',

    bg: '#E2EBDD',

    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=85&auto=format&fit=crop',

    icon: svg(`
      <path d="m12 2 5 3-5 3-5-3z"/>
      <path d="M7 5v6l5 3 5-3V5M12 8v6"/>
      <path d="m6 12 5 3-5 3-5-3z"/>
      <path d="M1 15v5l5 3 5-3v-5M6 18v5"/>
      <path d="m18 12 5 3-5 3-5-3z"/>
      <path d="M13 15v5l5 3 5-3v-5M18 18v5"/>
    `)
  }
]

const failed = reactive({})
const rootEl = ref(null)
const revealed = ref(false)

let io = null

onMounted(() => {
  if (!rootEl.value || !('IntersectionObserver' in window)) {
    revealed.value = true
    return
  }

  io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      revealed.value = true
      io.disconnect()
    }
  }, {
    threshold: 0.1
  })

  io.observe(rootEl.value)
})

onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.rch,
.rch * {
  box-sizing: border-box;
}

.rch {
  width: 100%;

  background: #fff;
  color: #0f172a;

  font-family: 'Poppins', sans-serif;
}

.rch-wrap {
  max-width: 1600px;

  margin: 0 auto;

  padding:
    clamp(48px, 6vw, 88px)
    clamp(24px, 7vw, 120px);
}

/* Heading */

.rch-title {
  max-width: 18em;

  margin: 0;
  padding-bottom: 0.12em;

  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.05em;

  color: #171717 !important;
  text-wrap: balance;
}

.rch-title em {
  font-style: normal;

  background: linear-gradient(
    100deg,
    #a1a1aa,
    #85858d,
    #71717a
  );

  background-clip: text;
  -webkit-background-clip: text;

  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
}

/* Bento grid */

.rch-grid {
  display: grid;

  grid-template-columns:
    minmax(0, 1.15fr)
    minmax(0, 1fr)
    minmax(0, 1fr);

  grid-template-rows:
    minmax(230px, auto)
    minmax(210px, auto);

  gap: 16px;

  margin: 36px 0 0;
  padding: 0;

  list-style: none;
}

.rch-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  min-width: 0;

  border-radius: 26px;
}

/* Tall card */

.rch-returning {
  grid-column: 1;
  grid-row: 1 / 3;

  display: flex;
  flex-direction: column;
}

.rch-photo-wrap {
  position: relative;

  flex: 1;
  min-height: 290px;

  overflow: hidden;
}

.rch-img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

.rch-photo-wrap .rch-img {
  position: absolute;
  inset: 0;
}

.rch-photo-copy {
  padding: 26px 28px;
}

.rch-card h3 {
  position: relative;
  z-index: 2;

  margin: 0;

  font-family: 'Urbanist', sans-serif;
  font-size: clamp(23px, 2vw, 30px);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.035em;

  color: #262626 !important;

  text-wrap: balance;
}

/* Pastel cards */

.rch-loyalty {
  grid-column: 2;
  grid-row: 1;

  color: #9a8265;
}

.rch-offers {
  grid-column: 3;
  grid-row: 1;

  color: #788ba5;
}

.rch-card-body {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100%;
  min-height: 230px;

  gap: 28px;
  padding: 25px;
}

.rch-small-icon {
  flex: none;

  display: grid;
  place-items: center;

  width: 44px;
  height: 44px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);

  color: #343434;
}

.rch-small-icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.rch-deco {
  position: absolute;

  right: -22px;
  bottom: -35px;

  z-index: 0;

  width: 180px;
  height: 180px;

  opacity: 0.15;

  transform: rotate(-12deg);

  pointer-events: none;
}

.rch-deco :deep(svg) {
  width: 100%;
  height: 100%;

  stroke-width: 0.6;
}

/* Wide inventory card */

.rch-stock {
  grid-column: 2 / 4;
  grid-row: 2;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 0.95fr);

  align-items: stretch;

  gap: 20px;

  padding: 14px;
}

.rch-wide-copy {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 24px;

  padding: 12px;
}

.rch-wide-photo {
  position: relative;

  min-height: 180px;

  overflow: hidden;

  border-radius: 18px;

  background: #d4e0d0;
}

.rch-wide-photo .rch-img {
  position: absolute;
  inset: 0;
}

/* Photo fallback */

.rch-photo-fallback {
  position: absolute;
  inset: 0;

  display: grid;
  place-items: center;

  color: #8b8b83;
}

.rch-photo-fallback :deep(svg) {
  width: 90px;
  height: 90px;

  opacity: 0.4;
}

/* Entrance animation */

.rch-in .rch-card {
  animation: rch-reveal 0.8s
    cubic-bezier(0.2, 0.8, 0.2, 1)
    calc(var(--i) * 0.1s) both;
}

@keyframes rch-reveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tablet */

@media (max-width: 1050px) {
  .rch-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    grid-template-rows: auto;
  }

  .rch-returning {
    grid-column: 1 / -1;
    grid-row: auto;

    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .rch-photo-wrap {
    min-height: 250px;
  }

  .rch-photo-copy {
    display: flex;
    align-items: center;
  }

  .rch-loyalty,
  .rch-offers {
    grid-column: auto;
    grid-row: auto;
  }

  .rch-stock {
    grid-column: 1 / -1;
    grid-row: auto;
  }
}

/* Mobile */

@media (max-width: 620px) {
  .rch-wrap {
    padding: 40px 24px;
  }

  .rch-title {
    font-size: 36px;
  }

  .rch-grid {
    grid-template-columns: minmax(0, 1fr);

    gap: 14px;
    margin-top: 26px;
  }

  .rch-card {
    grid-column: 1 / -1;
    grid-row: auto;

    border-radius: 22px;
  }

  .rch-returning {
    display: flex;
    flex-direction: column;
  }

  .rch-photo-wrap {
    min-height: 230px;
  }

  .rch-photo-copy {
    padding: 24px;
  }

  .rch-card-body {
    min-height: 220px;
    padding: 24px;
  }

  .rch-card h3 {
    font-size: 27px;
  }

  .rch-stock {
    grid-template-columns: minmax(0, 1fr);

    gap: 18px;
    padding: 14px;
  }

  .rch-wide-copy {
    padding: 10px;
  }

  .rch-wide-photo {
    min-height: 200px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rch-in .rch-card {
    animation: none;
  }
}
</style>
