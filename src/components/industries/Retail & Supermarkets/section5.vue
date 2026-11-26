
<template>
  <section class="rdw" aria-labelledby="rdw-title">

    <!-- Section heading -->

    <header class="rdw-head">

      <h2 id="rdw-title" class="rdw-title">
        How retailers use Saptivo <em>day to day</em>
      </h2>

    </header>

    <!-- Continuous marquee -->

    <div class="rdw-viewport">

      <div class="rdw-track">

        <div
          v-for="n in 2"
          :key="n"
          class="rdw-set"
          :aria-hidden="n === 2 ? 'true' : undefined"
        >

          <article
            v-for="tile in tiles"
            :key="tile.key"
            class="rdw-tile"
            :class="tile.kind === 'photo'
              ? 'rdw-photo'
              : 'rdw-text'"
            :style="{
              '--w': tile.width,
              background: tile.bg
            }"
          >

            <!-- Photography card -->

            <template v-if="tile.kind === 'photo'">

              <img
                v-if="!failed[tile.key]"
                class="rdw-img"
                :src="tile.src"
                :style="{ objectPosition: tile.position }"
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
                @error="failed[tile.key] = true"
              />

              <span
                v-else
                class="rdw-photo-fallback"
                v-html="tile.icon"
              ></span>

            </template>

            <!-- Pastel content card -->

            <template v-else>

              <div class="rdw-card-top">

                <span
                  class="rdw-icon"
                  aria-hidden="true"
                  v-html="tile.icon"
                ></span>

                <span class="rdw-number">
                  {{ tile.number }}
                </span>

              </div>

              <div class="rdw-content">

                <h3>{{ tile.title }}</h3>

                <p>{{ tile.text }}</p>

              </div>

            </template>

          </article>

        </div>

      </div>

    </div>

  </section>
</template>

<script setup>
import { reactive } from 'vue'

defineOptions({
  name: 'RetailDailyWorkflow'
})

const failed = reactive({})

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

const items = [
  {
    id: 'counter',
    number: '01',
    title: 'At the counter',
    text: 'Staff look up the customer by phone number and apply their reward.',

    bg: '#F3E5D5',
    photoBg: '#E9E1D9',

    icon: svg(`
      <path d="M3 8V4h4M17 4h4v4"/>
      <path d="M3 16v4h4M17 20h4v-4"/>
      <path d="M7 8v8M10 8v8M14 8v8M17 8v8"/>
    `),

    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000&q=85&auto=format&fit=crop',

    position: 'center'
  },

  {
    id: 'sale',
    number: '02',
    title: 'After the sale',
    text: 'A digital receipt and points update go out on WhatsApp.',

    bg: '#DFEBDD',
    photoBg: '#E4EDE4',

    icon: svg(`
      <path d="M21 11.5a9 9 0 0 1-9 9
               9 9 0 0 1-4-.9L3 21l1.4-5
               A9 9 0 1 1 21 11.5z"/>
      <path d="M8 9c0 3 3 6 6 6l2-2-2-1-1 1
               c-2-1-3-2-3-3l1-1-1-2z"/>
    `),

    src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1000&q=85&auto=format&fit=crop',

    position: 'center'
  },

  {
    id: 'weekly',
    number: '03',
    title: 'Weekly',
    text: 'Marketing sends offers to segments such as lapsed customers or Gold members.',

    bg: '#E8E3F2',
    photoBg: '#E9E5EE',

    icon: svg(`
      <path d="M3 10v4l5 2 12 4V4L8 8z"/>
      <path d="M8 8v8M8 16l2 5h4l-2-4"/>
      <path d="M22 9v6"/>
    `),

    src: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1000&q=85&auto=format&fit=crop',

    position: 'center'
  },

  {
    id: 'monthly',
    number: '04',
    title: 'Monthly',
    text: 'Head office compares branches and adjusts stock and staffing.',

    bg: '#DCE9F4',
    photoBg: '#DFE7ED',

    icon: svg(`
      <path d="M3 3v18h18"/>
      <rect x="6" y="12" width="3" height="6" rx="1"/>
      <rect x="11" y="8" width="3" height="10" rx="1"/>
      <rect x="16" y="4" width="3" height="14" rx="1"/>
    `),

    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=85&auto=format&fit=crop',

    position: 'center'
  }
]

const tiles = items.flatMap((item, i) => {
  const text = {
    ...item,
    kind: 'text',
    key: item.id + '-text',
    width: i === 2 ? 330 : 300
  }

  const photo = {
    ...item,
    kind: 'photo',
    key: item.id + '-photo',
    width: i % 2 === 0 ? 380 : 350,
    bg: item.photoBg
  }

  return [text, photo]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');

.rdw,
.rdw * {
  box-sizing: border-box;
}

.rdw {
  --gap: 16px;
  --scale: 1;

  position: relative;

  width: 100%;

  padding:
    clamp(40px, 5vw, 76px)
    0
    clamp(28px, 4vw, 56px);

  overflow: hidden;

  background: #fff;
  color: #0f172a;

  font-family: 'Poppins', sans-serif;
}

/* Heading */

.rdw-head {
  display: flex;
  justify-content: center;

  padding:
    0
    clamp(24px, 7vw, 120px)
    clamp(28px, 4vw, 48px);

  text-align: center;
}

.rdw-title {
  max-width: 950px;

  margin: 0;
  padding-bottom: 0.1em;

  font-family: 'Urbanist', sans-serif;
  font-size: clamp(32px, 4vw, 56px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.045em;

  color: #0a0a0a !important;
  text-wrap: balance;
}

.rdw-title em {
  font-style: normal;
  color: #85858d !important;
}

/* Marquee */

.rdw-viewport {
  overflow: hidden;
}

.rdw-track {
  display: flex;
  width: max-content;

  animation: rdw-loop 65s linear infinite;

  will-change: transform;
}

.rdw-set {
  display: flex;
  flex: none;

  gap: var(--gap);
  padding-right: var(--gap);
}

.rdw-viewport:hover .rdw-track,
.rdw-viewport:active .rdw-track {
  animation-play-state: paused;
}

@keyframes rdw-loop {
  to {
    transform: translateX(-50%);
  }
}

/* Cards */

.rdw-tile {
  position: relative;
  flex: none;

  width: calc(var(--w) * var(--scale) * 1px);
  height: calc(340px * var(--scale));

  overflow: hidden;
  border-radius: 24px;
}

.rdw-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: calc(28px * var(--scale));
}

.rdw-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rdw-icon {
  display: grid;
  place-items: center;

  width: 48px;
  height: 48px;

  border-radius: 50%;

  background: #252525;
  color: #fff;
}

.rdw-icon :deep(svg) {
  width: 23px;
  height: 23px;
}

.rdw-number {
  font-family: 'Urbanist', sans-serif;
  font-size: 15px;
  font-weight: 600;

  color: rgba(15, 23, 42, 0.45);
}

.rdw-content h3 {
  margin: 0;

  font-family: 'Urbanist', sans-serif;
  font-size: clamp(25px, 2.2vw, 32px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.035em;

  color: #171717 !important;
}

.rdw-content p {
  margin: 12px 0 0;

  font-size: 14px;
  line-height: 1.7;

  color: #4b5563;
}

/* Photography */

.rdw-img {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

.rdw-photo-fallback {
  position: absolute;
  inset: 0;

  display: grid;
  place-items: center;

  color: #71717a;
}

.rdw-photo-fallback :deep(svg) {
  width: 100px;
  height: 100px;
  opacity: 0.4;
}

@media (max-width: 900px) {
  .rdw {
    --scale: 0.9;
  }
}

@media (max-width: 560px) {
  .rdw {
    --scale: 0.82;
    --gap: 12px;
  }

  .rdw-title {
    font-size: 36px;
  }

  .rdw-tile {
    border-radius: 20px;
  }

  .rdw-icon {
    width: 42px;
    height: 42px;
  }

  .rdw-content h3 {
    font-size: 26px;
  }

  .rdw-content p {
    font-size: 13px;
  }

  .rdw-track {
    animation-duration: 50s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rdw-track {
    animation: none;
    will-change: auto;
  }

  .rdw-viewport {
    overflow-x: auto;
  }

  .rdw-set[aria-hidden='true'] {
    display: none;
  }
}
</style>
