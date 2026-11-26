
<script setup>
import { reactive, ref } from 'vue'

defineOptions({ name: 'FieldServiceFeatures' })

const failed = reactive({})
const paused = ref(false)

const photo = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=85&auto=format&fit=crop`

const features = [
  {
    title: 'Installed asset registry',
    description: 'Installed asset registry with QR codes.',
    color: '#F1E6D7',
    image: photo('1581092921461-eab62e97a780'),
    icon: `
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <path d="M14 14h3v3h4v4h-7z"/>
    `
  },
  {
    title: 'Maintenance contracts',
    description: 'Annual maintenance contracts with renewal alerts.',
    color: '#DFEBDD',
    icon: `
      <path d="M14 2H6a2 2 0 0 0-2 2v16
      a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6M8 15l3 3 5-6"/>
    `
  },
  {
    title: 'Preventive scheduling',
    description: 'Preventive scheduling by date, season or usage.',
    color: '#DCE9F4',
    image: photo('1621905251189-08b45d6a269e'),
    icon: `
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M7 3v4M17 3v4M3 10h18"/>
      <circle cx="12" cy="15" r="3"/>
      <path d="M12 13v2l1 1"/>
    `
  },
  {
    title: 'Technician dispatch',
    description: 'Technician dispatch by skill, zone and availability.',
    color: '#E8E2EF',
    icon: `
      <path d="M3 11l18-8-8 18-2-8z"/>
      <path d="M11 13l10-10"/>
    `
  },
  {
    title: 'Technician mobile app',
    description:
      'Checklists, photos, readings and signatures, available offline.',
    color: '#E9E3D8',
    image: photo('1512941937669-90a1b58e7e9c'),
    icon: `
      <rect x="6" y="2" width="12" height="20" rx="3"/>
      <path d="M10 18h4M9 10l2 2 4-4"/>
    `
  },
  {
    title: 'Spare parts and van stock',
    description: 'Spare parts and van stock control.',
    color: '#E1EBE4',
    icon: `
      <path d="m12 3 9 5v9l-9 5-9-5V8z"/>
      <path d="m3 8 9 5 9-5M12 13v9M7 5l10 6"/>
    `
  },
  {
    title: 'Automatic billing',
    description:
      'AMC-covered, in warranty or chargeable, with recurring card payments for contracts.',
    color: '#F3E5DA',
    image: photo('1554224155-6726b3ff858f'),
    icon: `
      <rect x="3" y="5" width="18" height="15" rx="3"/>
      <path d="M3 10h18M7 15h5M16 15h2"/>
    `
  },
  {
    title: 'AI reminder calls',
    description:
      'AI reminder calls for visits and renewals through Vodia voice agents.',
    color: '#E5E5F0',
    icon: `
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2
      A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3
      a2 2 0 0 1 2 1.7l.6 3a2 2 0 0 1-.6 2.1L8 10
      a16 16 0 0 0 6 6l1.2-1.1a2 2 0 0 1 2.1-.6
      l3 .6a2 2 0 0 1 1.7 2z"/>
      <path d="M15 3a6 6 0 0 1 6 6M15 7a2 2 0 0 1 2 2"/>
    `
  },
  {
    title: 'Service analytics',
    description:
      'First-time fix rate, SLA compliance and contract profitability.',
    color: '#DCE8EF',
    image: photo('1551288049-bebda4e38f71'),
    icon: `
      <path d="M3 3v18h18M7 16v-4M12 16V8M17 16V5"/>
    `
  }
]

const tiles = features.flatMap((feature, index) => {
  const items = [
    {
      ...feature,
      key: `feature-${index}`,
      type: 'text',
      number: String(index + 1).padStart(2, '0'),
      width: 320
    }
  ]

  if (feature.image) {
    items.push({
      ...feature,
      key: `photo-${index}`,
      type: 'photo',
      width: 390
    })
  }

  return items
})
</script>

<template>
  <section
    class="fsf"
    :class="{ 'fsf-paused': paused }"
    aria-labelledby="fsf-title"
  >

    <header class="fsf-header">
      <h2 id="fsf-title">
        What every field service
        <span>business gets</span>
      </h2>
    </header>

    <div class="fsf-viewport">

      <div class="fsf-track">

        <div
          v-for="set in 2"
          :key="set"
          class="fsf-set"
          :aria-hidden="set === 2 ? 'true' : undefined"
        >

          <article
            v-for="tile in tiles"
            :key="tile.key"
            class="fsf-card"
            :class="'fsf-' + tile.type"
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

              <div v-else class="fsf-fallback">
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

            <!-- Feature card -->

            <template v-else>

              <div class="fsf-top">

                <span class="fsf-icon">
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

                <span class="fsf-number">
                  {{ tile.number }}
                </span>

              </div>

              <div class="fsf-content">
                <h3>{{ tile.title }}</h3>
                <p>{{ tile.description }}</p>
              </div>

            </template>

          </article>

        </div>

      </div>

    </div>

    <div class="fsf-controls">

      <button
        type="button"
        class="fsf-pause"
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
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.fsf,
.fsf * {
  box-sizing: border-box;
}

.fsf {
  --gap: 16px;
  --scale: 1;

  width: 100%;
  padding: clamp(48px, 6vw, 96px) 0;
  background: #fff;
  overflow: hidden;
}

/* Heading */

.fsf-header {
  padding: 0 24px;
  margin-bottom: clamp(30px, 4vw, 54px);
}

.fsf-header h2 {
  max-width: 1050px;
  margin: 0 auto;
  text-align: center;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.fsf-header h2 span {
  background: linear-gradient(100deg, #a1a1aa, #777780);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Marquee */

.fsf-viewport {
  width: 100%;
  overflow: hidden;
}

.fsf-track {
  display: flex;
  width: max-content;
  animation: fsf-scroll 115s linear infinite;
  will-change: transform;
}

.fsf-set {
  display: flex;
  flex: none;
  gap: var(--gap);
  padding-right: var(--gap);
}

@keyframes fsf-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.fsf-viewport:hover .fsf-track,
.fsf-viewport:active .fsf-track,
.fsf-paused .fsf-track {
  animation-play-state: paused;
}

/* Cards */

.fsf-card {
  position: relative;
  flex: none;
  width: calc(var(--w) * var(--scale));
  height: calc(380px * var(--scale));
  border-radius: 24px;
  overflow: hidden;
}

.fsf-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(30px * var(--scale));
}

.fsf-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fsf-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #292929;
  color: #fff;
}

.fsf-icon svg {
  width: 23px;
  height: 23px;
}

.fsf-number {
  font-family: 'Urbanist', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #777;
}

.fsf-content h3 {
  margin: 0 0 14px;
  font-family: 'Urbanist', sans-serif;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -.035em;
  color: #171717;
}

.fsf-content p {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  line-height: 1.75;
  color: #55565b;
}

/* Photographs */

.fsf-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fsf-fallback {
  display: grid;
  place-items: center;
  height: 100%;
  color: #777;
}

.fsf-fallback svg {
  width: 110px;
  height: 110px;
  opacity: .35;
}

/* Pause control */

.fsf-controls {
  display: flex;
  justify-content: flex-end;
  padding: 18px clamp(24px, 5vw, 80px) 0;
}

.fsf-pause {
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

.fsf-pause svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 900px) {
  .fsf {
    --scale: .9;
  }
}

@media (max-width: 560px) {
  .fsf {
    --scale: .82;
    --gap: 12px;
    padding: 48px 0;
  }

  .fsf-header h2 {
    font-size: 36px;
  }

  .fsf-card {
    border-radius: 20px;
  }

  .fsf-icon {
    width: 40px;
    height: 40px;
  }

  .fsf-content h3 {
    font-size: 26px;
  }

  .fsf-content p {
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fsf-track {
    animation: none;
    will-change: auto;
  }

  .fsf-viewport {
    overflow-x: auto;
  }

  .fsf-set:nth-child(2),
  .fsf-controls {
    display: none;
  }
}
</style>
