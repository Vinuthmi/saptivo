
<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount
} from 'vue'

defineOptions({ name: 'FieldServiceWhyMatters' })

const root = ref(null)
const shown = ref(false)
const photoOk = ref(true)
const active = ref(2)

let observer = null
let timer = null

const photo =
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=85&auto=format&fit=crop'

const activities = [
  {
    title: 'Preventive visit scheduled',
    description: 'Annual maintenance contract',
    color: '#E3EAF4',
    icon: `
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M7 3v4M17 3v4M3 10h18"/>
      <path d="m8 15 3 3 5-6"/>
    `
  },
  {
    title: 'Service invoice generated',
    description: 'Job completed successfully',
    color: '#F4E7D8',
    icon: `
      <path d="M5 3h14v18l-3-2-4 2-4-2-3 2z"/>
      <path d="M8 8h8M8 12h8M8 16h4"/>
    `
  },
  {
    title: 'Renewal reminder sent',
    description: 'Upcoming contract renewal',
    color: '#DFEBDD',
    icon: `
      <path d="M18 8a6 6 0 0 0-12 0
      c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
      <path d="M10 21h4"/>
    `
  }
]

function start() {
  if (timer) return

  active.value = 0

  timer = setInterval(() => {
    active.value = (active.value + 1) % 3
  }, 2000)
}

function stop() {
  clearInterval(timer)
  timer = null
}

onMounted(() => {
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    shown.value = true
    active.value = 2
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        shown.value = true
        start()
      } else {
        stop()
      }
    },
    { threshold: 0.2 }
  )

  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
})
</script>

<template>
  <section
    ref="root"
    class="fwm"
    :class="{ 'fwm-in': shown }"
    aria-labelledby="fwm-title"
  >

    <div class="fwm-wrap">

      <div class="fwm-panel">

        <!-- Left content -->

        <div class="fwm-copy">

          <h2 id="fwm-title">
            <span class="fwm-l1">Why it</span>
            <span class="fwm-l2">matters</span>
          </h2>

          <p>
            Missed preventive visits lead to breakdowns,
            unhappy customers and lost renewals. Unbilled
            jobs are revenue you earned but never collected.
            Saptivo closes both gaps, turning after-sales
            service into a dependable, growing income stream.
          </p>

        </div>

        <!-- Right visual -->

        <figure class="fwm-photo">

          <img
            v-if="photoOk"
            :src="photo"
            alt=""
            loading="lazy"
            decoding="async"
            @error="photoOk = false"
          />

          <!-- Floating activity board -->

          <div class="fwm-board" aria-hidden="true">

            <div class="fwm-board-header">

              <div class="fwm-board-title">
                <span class="fwm-dots">
                  <i></i><i></i><i></i>
                </span>
                <strong>Service activity</strong>
              </div>

              <span class="fwm-status">
                <i></i>
                Up to date
              </span>

            </div>

            <div class="fwm-activities">

              <div
                v-for="(item, index) in activities"
                :key="item.title"
                class="fwm-activity"
                :class="{ 'fwm-active': index === active }"
              >

                <span
                  class="fwm-icon"
                  :style="{ background: item.color }"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    v-html="item.icon"
                  ></svg>
                </span>

                <div class="fwm-activity-copy">
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.description }}</small>
                </div>

                <span class="fwm-check">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m5 12 5 5 9-10"/>
                  </svg>

                </span>

              </div>

            </div>

            <div class="fwm-rail">
              <i :style="{ width: ((active + 1) / 3) * 100 + '%' }"></i>
            </div>

          </div>

        </figure>

      </div>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');

.fwm,
.fwm * {
  box-sizing: border-box;
}

.fwm {
  width: 100%;
  padding: 40px clamp(24px, 4vw, 64px);
  background: #fff;
  font-family: 'Poppins', sans-serif;
}

.fwm-wrap {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.fwm-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(36px, 5vw, 80px);
  padding: clamp(36px, 5vw, 72px);
  border-radius: 36px;
  background: #fff0df;
}

.fwm-in .fwm-panel {
  animation: fwm-reveal .7s ease both;
}

@keyframes fwm-reveal {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Left content */

.fwm-copy h2 {
  margin: 0 0 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
}

.fwm-copy h2 span {
  display: block;
}

.fwm-copy .fwm-l1 {
  color: #111 !important;
  -webkit-text-fill-color: #111 !important;
}

.fwm-copy .fwm-l2 {
  color: #8a8f97 !important;
  -webkit-text-fill-color: #8a8f97 !important;
}

.fwm-copy p {
  max-width: 52ch;
  margin: 0;
  font-size: 16px;
  line-height: 1.85;
  color: #666b73;
}

/* Photography */

.fwm-photo {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: flex-end;
  min-width: 0;
  min-height: 560px;
  margin: 0;
  overflow: hidden;
  border-radius: 28px;
  background: linear-gradient(145deg, #e6cdb5, #fff1e4);
}

.fwm-photo > img {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
}

/* Activity board */

.fwm-board {
  position: relative;
  width: calc(100% - 32px);
  margin: 16px;
  padding: 20px;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 18px 40px -18px rgba(20,18,15,.4);
}

.fwm-board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.fwm-board-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fwm-board-title strong {
  font-size: 12px;
  font-weight: 600;
  color: #222;
}

.fwm-dots {
  display: flex;
  gap: 4px;
}

.fwm-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #dedee4;
}

.fwm-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 20px;
  background: #e5f1e3;
  font-size: 10px;
  font-weight: 500;
  color: #60815b;
}

.fwm-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Activity rows */

.fwm-activities {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
}

.fwm-activity {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: #f7f7f8;
  transition: background .5s, border-color .5s;
}

.fwm-active {
  background: #fff5e9;
  border-color: #ead5bf;
}

.fwm-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  color: #555;
}

.fwm-icon svg {
  width: 20px;
  height: 20px;
}

.fwm-activity-copy {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.fwm-activity-copy strong {
  font-size: 11px;
  font-weight: 600;
  color: #292929;
}

.fwm-activity-copy small {
  font-size: 10px;
  color: #888;
}

.fwm-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e0eee0;
  color: #60815b;
}

.fwm-check svg {
  width: 12px;
  height: 12px;
}

.fwm-rail {
  height: 3px;
  margin-top: 18px;
  border-radius: 3px;
  overflow: hidden;
  background: #eee;
}

.fwm-rail i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #292929;
  transition: width .6s ease;
}

/* Responsive */

@media (max-width: 1000px) {
  .fwm-panel {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .fwm-copy p {
    max-width: 65ch;
  }

  .fwm-board {
    max-width: 550px;
    margin: 16px auto;
  }
}

@media (max-width: 640px) {
  .fwm {
    padding: 28px 16px;
  }

  .fwm-panel {
    padding: 28px 18px;
    border-radius: 26px;
    gap: 28px;
  }

  .fwm-copy h2 {
    font-size: 38px;
    margin-bottom: 18px;
  }

  .fwm-copy p {
    font-size: 14px;
  }

  .fwm-photo {
    min-height: 480px;
    border-radius: 22px;
  }

  .fwm-board {
    width: calc(100% - 20px);
    margin: 10px;
    padding: 12px;
    border-radius: 18px;
  }

  .fwm-activity {
    padding: 10px 8px;
    gap: 8px;
  }

  .fwm-icon {
    width: 32px;
    height: 32px;
  }

  .fwm-icon svg {
    width: 17px;
    height: 17px;
  }

  .fwm-dots {
    display: none;
  }

  .fwm-activity-copy small {
    font-size: 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fwm *,
  .fwm *::before,
  .fwm *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
