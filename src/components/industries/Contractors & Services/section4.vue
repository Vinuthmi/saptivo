
<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'ContractorServiceBusinesses' })

const root = ref(null)
const shown = ref(false)
const failed = reactive({})

let observer = null

const photo = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=85&auto=format&fit=crop`

const businesses = [
  {
    id: 'building',
    title: 'Building and renovation contractors',
    color: '#E9E2D8',
    image: photo('1504307651254-35680f356dfd'),
    icon: `
      <path d="M3 21h18M5 21V8l7-5v18"/>
      <path d="M12 10h7v11M8 10v2M8 15v2M15 14h1"/>
    `
  },
  {
    id: 'interior',
    title: 'Interior designers',
    color: '#F0E8DF',
    image: photo('1600210492486-724fe5c67fb0'),
    icon: `
      <path d="M3 12h18v7H3zM5 12V8a2 2 0 0 1 2-2h10
      a2 2 0 0 1 2 2v4M5 19v2M19 19v2M12 6v6"/>
    `
  },
  {
    id: 'electrical',
    title: 'Electrical and plumbing firms',
    color: '#DFE9F3',
    icon: `
      <path d="m13 2-9 12h7l-1 8 10-12h-7z"/>
    `
  },
  {
    id: 'landscape',
    title: 'Landscapers',
    color: '#DFEBDD',
    icon: `
      <path d="M12 22v-9M12 13C4 13 3 7 3 3
      c7 0 9 4 9 10zM12 17c0-7 3-10 9-10
      0 6-3 10-9 10z"/>
    `
  },
  {
    id: 'events',
    title: 'Event companies',
    color: '#EAE3EF',
    image: photo('1511795409834-ef04bbd61622'),
    icon: `
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M7 3v4M17 3v4M3 10h18"/>
      <path d="m9 15 2 2 4-4"/>
    `
  },
  {
    id: 'professional',
    title: 'Professional services',
    color: '#EAE8E2',
    image: photo('1521737711867-e3b97375f902'),
    icon: `
      <rect x="3" y="7" width="18" height="14" rx="2"/>
      <path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>
    `
  }
]

onMounted(() => {
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    shown.value = true
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        shown.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.1 }
  )

  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <section
    ref="root"
    class="csb"
    :class="{ 'csb-in': shown }"
    aria-labelledby="csb-title"
  >

    <div class="csb-wrap">

      <!-- Section heading -->

      <header class="csb-header">

        <h2 id="csb-title">
          For every kind of
          <span>service business</span>
        </h2>

        <p>
          Saptivo suits building and renovation contractors,
          interior designers, electrical and plumbing firms,
          landscapers, event companies and professional
          services that quote, deliver and bill in stages.
        </p>

      </header>

      <!-- Bento grid -->

      <div class="csb-grid">

        <article
          v-for="(business, index) in businesses"
          :key="business.id"
          class="csb-card"
          :class="'csb-' + business.id"
          :style="{
            '--bg': business.color,
            '--i': index
          }"
        >

          <!-- Image area -->

          <div
            v-if="business.image"
            class="csb-image"
          >
            <img
              v-if="!failed[business.id]"
              :src="business.image"
              alt=""
              loading="lazy"
              decoding="async"
              draggable="false"
              @error="failed[business.id] = true"
            />

            <div v-else class="csb-image-fallback">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                v-html="business.icon"
                aria-hidden="true"
              ></svg>
            </div>

          </div>

          <!-- Card content -->

          <div class="csb-content">

            <span class="csb-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                v-html="business.icon"
                aria-hidden="true"
              ></svg>

            </span>

            <h3>{{ business.title }}</h3>

          </div>

          <!-- Oversized decorative icon -->

          <svg
            v-if="!business.image"
            class="csb-decoration"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width=".5"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="business.icon"
            aria-hidden="true"
          ></svg>

        </article>

      </div>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.csb,
.csb * {
  box-sizing: border-box;
}

.csb {
  width: 100%;
  padding: clamp(48px, 6vw, 96px) 0;
  background: #fff;
}

.csb-wrap {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(24px, 6vw, 96px);
}

/* Heading */

.csb-header {
  max-width: 950px;
  margin: 0 auto 42px;
  text-align: center;
}

.csb-header h2 {
  margin: 0 0 20px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.csb-header h2 span {
  background: linear-gradient(100deg, #a1a1aa, #777780);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.csb-header p {
  max-width: 760px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  line-height: 1.8;
  color: #666b73;
}

/* Bento layout */

.csb-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: 250px 250px 230px;
  gap: 16px;
}

.csb-card {
  position: relative;
  isolation: isolate;
  min-width: 0;
  overflow: hidden;
  border-radius: 26px;
  background: var(--bg);
}

.csb-building {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;
}

.csb-interior {
  grid-column: 3 / 5;
  grid-row: 1;
}

.csb-electrical {
  grid-column: 3;
  grid-row: 2;
  color: #71869d;
}

.csb-landscape {
  grid-column: 4;
  grid-row: 2;
  color: #718d6b;
}

.csb-events {
  grid-column: 1 / 3;
  grid-row: 3;
}

.csb-professional {
  grid-column: 3 / 5;
  grid-row: 3;
}

/* Photography */

.csb-image {
  position: relative;
  min-width: 0;
  overflow: hidden;
}

.csb-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.csb-building .csb-image {
  flex: 1;
  min-height: 0;
}

.csb-interior,
.csb-events,
.csb-professional {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
}

.csb-image-fallback {
  display: grid;
  place-items: center;
  height: 100%;
  color: #777;
}

.csb-image-fallback svg {
  width: 90px;
  height: 90px;
  opacity: .35;
}

/* Content */

.csb-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 26px;
}

.csb-building .csb-content {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 28px;
}

.csb-electrical .csb-content,
.csb-landscape .csb-content {
  height: 100%;
}

.csb-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,.8);
  color: #303030;
}

.csb-icon svg {
  width: 22px;
  height: 22px;
}

.csb-content h3 {
  margin: 0;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(23px, 2vw, 32px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -.035em;
  color: #222;
}

.csb-building h3 {
  max-width: 20ch;
  font-size: clamp(27px, 2.5vw, 38px);
}

/* Decorative icons */

.csb-decoration {
  position: absolute;
  z-index: -1;
  top: 10px;
  right: -38px;
  width: 180px;
  height: 180px;
  opacity: .2;
  transform: rotate(-12deg);
  pointer-events: none;
}

/* Entrance animation */

.csb-in .csb-card {
  animation: csb-reveal .75s ease both;
  animation-delay: calc(var(--i) * .09s);
}

@keyframes csb-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tablet */

@media (max-width: 1100px) {
  .csb-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: auto;
  }

  .csb-card {
    grid-column: auto;
    grid-row: auto;
    min-height: 250px;
  }

  .csb-building {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    min-height: 320px;
  }

  .csb-building .csb-content {
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }

  .csb-interior {
    grid-column: 1 / -1;
    min-height: 280px;
  }
}

/* Mobile */

@media (max-width: 640px) {
  .csb-wrap {
    padding: 0 20px;
  }

  .csb-header {
    margin-bottom: 28px;
  }

  .csb-header h2 {
    font-size: 36px;
  }

  .csb-header p {
    font-size: 14px;
  }

  .csb-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .csb-card {
    grid-column: auto;
    min-height: 220px;
    border-radius: 22px;
  }

  .csb-building {
    display: flex;
    min-height: 0;
  }

  .csb-building .csb-image {
    flex: none;
    height: 260px;
  }

  .csb-building .csb-content {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  .csb-content {
    padding: 20px;
  }

  .csb-content h3 {
    font-size: 26px;
  }

  .csb-interior,
  .csb-events,
  .csb-professional {
    grid-template-columns: 1fr 1fr;
  }

  .csb-icon {
    width: 38px;
    height: 38px;
  }

  .csb-icon svg {
    width: 19px;
    height: 19px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .csb-in .csb-card {
    animation: none;
  }
}
</style>
