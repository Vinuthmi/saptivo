
<script setup>
import { reactive, ref } from 'vue'

defineOptions({ name: 'ContractorWorkflow' })

const failed = reactive({})
const paused = ref(false)

const photo = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=85&auto=format&fit=crop`

const steps = [
  {
    title: 'Capture the enquiry',
    description:
      'Enquiry arrives from your website or WhatsApp and becomes a lead.',
    color: '#F4E8D8',
    image: photo('1499951360447-b19be8fe80f5'),
    icon: `
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5
      9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4
      A8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8z"/>
      <path d="M8 10h8M8 14h5"/>
    `
  },
  {
    title: 'Book a site visit',
    description:
      'Site visit is booked and photos and measurements are attached.',
    color: '#DFEBDD',
    image: photo('1504307651254-35680f356dfd'),
    icon: `
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M7 3v4M17 3v4M3 10h18"/>
      <path d="m8 15 3 3 5-6"/>
    `
  },
  {
    title: 'Prepare the estimate',
    description:
      'Estimate is prepared, revised and approved.',
    color: '#DCE8F4',
    image: photo('1503387762-592deb58ef4e'),
    icon: `
      <path d="M14 2H6a2 2 0 0 0-2 2v16
      a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6M8 13h8M8 17h5"/>
    `
  },
  {
    title: 'Confirm the job',
    description:
      'Quotation is accepted and the deposit invoice is issued.',
    color: '#E9E2EF',
    image: photo('1450101499163-c8848c66ca85'),
    icon: `
      <path d="M5 3h14v18l-3-2-4 2-4-2-3 2z"/>
      <path d="M8 8h8M8 12h8M8 16h4"/>
    `
  },
  {
    title: 'Track project progress',
    description:
      'Progress milestones are updated with photos for the customer.',
    color: '#E8E2D7',
    image: photo('1541888946425-d81bb19240f5'),
    icon: `
      <path d="M3 7h4l2-3h6l2 3h4v13H3z"/>
      <circle cx="12" cy="13" r="4"/>
    `
  },
  {
    title: 'Complete the job',
    description:
      'Final invoice is issued and payment is recorded.',
    color: '#DCEBE5',
    image: photo('1554224155-6726b3ff858f'),
    icon: `
      <rect x="3" y="5" width="18" height="15" rx="3"/>
      <path d="M3 10h18M7 15h4"/>
      <path d="m15 15 2 2 3-4"/>
    `
  }
]

const tiles = steps.flatMap((step, index) => [
  {
    ...step,
    key: `step-${index}`,
    type: 'text',
    number: String(index + 1).padStart(2, '0'),
    width: 310
  },
  {
    ...step,
    key: `photo-${index}`,
    type: 'photo',
    width: index % 2 === 0 ? 390 : 350
  }
])
</script>

<template>
  <section
    class="cw"
    aria-labelledby="cw-title"
    :class="{ 'cw-paused': paused }"
  >
    <header class="cw-header">
      <h2 id="cw-title">
        How a contracting job
        <span>flows through Saptivo</span>
      </h2>
    </header>

    <div class="cw-viewport">
      <div class="cw-track">

        <!-- Duplicate set for seamless scrolling -->

        <div
          v-for="set in 2"
          :key="set"
          class="cw-set"
          :aria-hidden="set === 2 ? 'true' : undefined"
        >
          <article
            v-for="tile in tiles"
            :key="tile.key"
            class="cw-card"
            :class="'cw-' + tile.type"
            :style="{
              '--w': tile.width + 'px',
              background: tile.color
            }"
          >

            <!-- Photograph card -->

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

              <div v-else class="cw-fallback">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  v-html="tile.icon"
                  aria-hidden="true"
                ></svg>
              </div>
            </template>

            <!-- Workflow text card -->

            <template v-else>
              <div class="cw-top">

                <span class="cw-icon">
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

                <span class="cw-number">
                  {{ tile.number }}
                </span>

              </div>

              <div class="cw-content">
                <h3>{{ tile.title }}</h3>
                <p>{{ tile.description }}</p>
              </div>
            </template>

          </article>
        </div>

      </div>
    </div>

    <div class="cw-controls">
      <button
        type="button"
        class="cw-pause"
        :aria-label="paused ? 'Play workflow' : 'Pause workflow'"
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

.cw,
.cw * {
  box-sizing: border-box;
}

.cw {
  --gap: 16px;
  --scale: 1;

  width: 100%;
  padding: clamp(48px, 6vw, 96px) 0;
  overflow: hidden;
  background: #fff;
}

/* Heading */

.cw-header {
  padding: 0 24px;
  margin-bottom: clamp(30px, 4vw, 54px);
}

.cw-header h2 {
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

.cw-header h2 span {
  background: linear-gradient(
    100deg, #a1a1aa, #777780
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Marquee */

.cw-viewport {
  width: 100%;
  overflow: hidden;
}

.cw-track {
  display: flex;
  width: max-content;
  animation: cw-scroll 100s linear infinite;
  will-change: transform;
}

.cw-set {
  display: flex;
  flex: none;
  gap: var(--gap);
  padding-right: var(--gap);
}

@keyframes cw-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

.cw-viewport:hover .cw-track,
.cw-viewport:active .cw-track,
.cw-paused .cw-track {
  animation-play-state: paused;
}

/* Cards */

.cw-card {
  position: relative;
  flex: none;
  width: calc(var(--w) * var(--scale));
  height: calc(370px * var(--scale));
  border-radius: 24px;
  overflow: hidden;
}

.cw-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(28px * var(--scale));
}

.cw-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cw-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #292929;
  color: #fff;
}

.cw-icon svg {
  width: 23px;
  height: 23px;
}

.cw-number {
  font-family: 'Urbanist', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #777;
}

.cw-content h3 {
  margin: 0 0 14px;
  font-family: 'Urbanist', sans-serif;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -.035em;
  color: #171717;
}

.cw-content p {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  line-height: 1.75;
  color: #55565b;
}

/* Photography */

.cw-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cw-fallback {
  display: grid;
  place-items: center;
  height: 100%;
  color: #777;
}

.cw-fallback svg {
  width: 100px;
  height: 100px;
  opacity: .4;
}

/* Pause control */

.cw-controls {
  display: flex;
  justify-content: flex-end;
  padding: 20px clamp(24px, 5vw, 80px) 0;
}

.cw-pause {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid #e1e1e5;
  border-radius: 50%;
  background: #fff;
  color: #333;
  cursor: pointer;
}

.cw-pause svg {
  width: 18px;
  height: 18px;
}

/* Responsive */

@media (max-width: 900px) {
  .cw {
    --scale: .9;
  }
}

@media (max-width: 560px) {
  .cw {
    --scale: .8;
    --gap: 12px;
    padding: 48px 0;
  }

  .cw-header h2 {
    font-size: 36px;
  }

  .cw-card {
    border-radius: 20px;
  }

  .cw-icon {
    width: 40px;
    height: 40px;
  }

  .cw-content h3 {
    font-size: 26px;
  }

  .cw-content p {
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cw-track {
    animation: none;
    will-change: auto;
  }

  .cw-viewport {
    overflow-x: auto;
  }

  .cw-set:nth-child(2),
  .cw-controls {
    display: none;
  }
}
</style>
