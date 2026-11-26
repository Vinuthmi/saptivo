
<script setup>
import { reactive, ref } from 'vue'

defineOptions({ name: 'StartupGrowthMarquee' })

const failed = reactive({})
const paused = ref(false)

const photo = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=85&auto=format&fit=crop`

const stages = [
  {
    title: 'Week one',
    description:
      'Import contacts, connect WhatsApp and your website, and set up your pipeline.',
    color: '#F1E6D7',
    image: photo('1499951360447-b19be8fe80f5'),
    icon: `
      <path d="M12 15l-3-3 5-5c3-3 6-3 8-3
      0 2 0 5-3 8l-5 5z"/>
      <path d="M9 12H5l-3 4 7 1M14 17v4l-4 2-1-6"/>
      <circle cx="16" cy="9" r="2"/>
    `
  },
  {
    title: 'Month one',
    description:
      'Send every quotation from Saptivo and track every follow-up.',
    color: '#DFEBDD',
    image: photo('1521737711867-e3b97375f902'),
    icon: `
      <path d="M14 2H6a2 2 0 0 0-2 2v16
      a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6M8 13h8M8 17h6"/>
    `
  },
  {
    title: 'Month three',
    description:
      'Add automations, such as welcome messages for new leads.',
    color: '#DCE9F4',
    image: photo('1551288049-bebda4e38f71'),
    icon: `
      <rect x="3" y="3" width="7" height="7" rx="2"/>
      <rect x="14" y="14" width="7" height="7" rx="2"/>
      <path d="M10 6h7v8M6 10v7h8"/>
    `
  },
  {
    title: 'As you grow',
    description:
      'Add users, branches, inventory or service management without changing systems.',
    color: '#E8E2EF',
    image: photo('1522071820081-009f0129c71c'),
    icon: `
      <path d="M3 3v18h18"/>
      <path d="m6 16 5-5 4 3 6-8"/>
      <path d="M15 6h6v6"/>
    `
  }
]

const tiles = stages.flatMap((stage, index) => [
  {
    ...stage,
    key: `stage-${index}`,
    type: 'text',
    number: String(index + 1).padStart(2, '0'),
    width: 330
  },
  {
    ...stage,
    key: `image-${index}`,
    type: 'photo',
    width: 410
  }
])
</script>

<template>
  <section
    class="sgm"
    :class="{ paused }"
    aria-labelledby="sgm-title"
  >

    <header class="sgm-header">

      <h2 id="sgm-title">
        How startups use <span>Saptivo</span>
      </h2>

    </header>

    <div class="sgm-viewport">

      <div class="sgm-track">

        <div
          v-for="set in 2"
          :key="set"
          class="sgm-set"
          :aria-hidden="set === 2 ? 'true' : undefined"
        >

          <article
            v-for="tile in tiles"
            :key="tile.key"
            class="sgm-card"
            :class="'sgm-' + tile.type"
            :style="{
              '--w': tile.width + 'px',
              background: tile.color
            }"
          >

            <!-- Photograph -->

            <template v-if="tile.type === 'photo'">

              <img
                v-if="!failed[tile.key]"
                :src="tile.image"
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
                @error="failed[tile.key] = true"
              />

              <div v-else class="sgm-fallback">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width=".8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  v-html="tile.icon"
                  aria-hidden="true"
                ></svg>

              </div>

            </template>

            <!-- Text card -->

            <template v-else>

              <div class="sgm-top">

                <span class="sgm-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    v-html="tile.icon"
                    aria-hidden="true"
                  ></svg>

                </span>

                <span class="sgm-number">
                  {{ tile.number }}
                </span>

              </div>

              <div class="sgm-copy">

                <h3>{{ tile.title }}</h3>

                <p>{{ tile.description }}</p>

              </div>

            </template>

          </article>

        </div>

      </div>

    </div>

    <div class="sgm-controls">

      <button
        type="button"
        :aria-label="paused ? 'Play marquee' : 'Pause marquee'"
        @click="paused = !paused"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path v-if="paused" d="m8 5 12 7-12 7z"/>
          <path v-else d="M9 5v14M15 5v14"/>
        </svg>
      </button>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');

.sgm,
.sgm * {
  box-sizing: border-box;
}

.sgm {
  --gap: 16px;
  --scale: 1;

  width: 100%;
  padding: clamp(48px, 6vw, 96px) 0;
  background: #fff;
  overflow: hidden;
}

.sgm-header {
  margin-bottom: clamp(32px, 4vw, 56px);
  padding: 0 24px;
  text-align: center;
}

.sgm-header h2 {
  margin: 0;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.sgm-header h2 span {
  background: linear-gradient(100deg, #a1a1aa, #777780);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Marquee */

.sgm-viewport {
  width: 100%;
  overflow: hidden;
}

.sgm-track {
  display: flex;
  width: max-content;
  animation: sgm-scroll 65s linear infinite;
  will-change: transform;
}

.sgm-set {
  display: flex;
  flex: none;
  gap: var(--gap);
  padding-right: var(--gap);
}

@keyframes sgm-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.sgm-viewport:hover .sgm-track,
.sgm-viewport:active .sgm-track,
.sgm.paused .sgm-track {
  animation-play-state: paused;
}

/* Cards */

.sgm-card {
  position: relative;
  flex: none;
  width: calc(var(--w) * var(--scale));
  height: calc(380px * var(--scale));
  overflow: hidden;
  border-radius: 24px;
}

.sgm-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(30px * var(--scale));
}

.sgm-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sgm-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #292929;
  color: #fff;
}

.sgm-icon svg {
  width: 24px;
  height: 24px;
}

.sgm-number {
  font-family: 'Urbanist', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #777;
}

.sgm-copy h3 {
  margin: 0 0 14px;
  font-family: 'Urbanist', sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -.04em;
  color: #222;
}

.sgm-copy p {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: #55565b;
}

/* Photographs */

.sgm-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sgm-fallback {
  display: grid;
  place-items: center;
  height: 100%;
  color: #777;
}

.sgm-fallback svg {
  width: 120px;
  height: 120px;
  opacity: .3;
}

/* Pause control */

.sgm-controls {
  display: flex;
  justify-content: flex-end;
  padding: 18px clamp(24px, 5vw, 80px) 0;
}

.sgm-controls button {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e1e1e5;
  border-radius: 50%;
  background: #fff;
  color: #333;
  cursor: pointer;
}

.sgm-controls svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 900px) {
  .sgm {
    --scale: .9;
  }
}

@media (max-width: 560px) {
  .sgm {
    --scale: .82;
    --gap: 12px;
    padding: 48px 0;
  }

  .sgm-header h2 {
    font-size: 36px;
  }

  .sgm-card {
    border-radius: 20px;
  }

  .sgm-icon {
    width: 40px;
    height: 40px;
  }

  .sgm-copy h3 {
    font-size: 27px;
  }

  .sgm-copy p {
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sgm-track {
    animation: none;
    will-change: auto;
  }

  .sgm-viewport {
    overflow-x: auto;
  }

  .sgm-set:nth-child(2),
  .sgm-controls {
    display: none;
  }
}
</style>
