
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'StartupTeamBenefits' })

const root = ref(null)
const shown = ref(false)
const active = ref(0)

let observer = null
let timer = null

const stats = [
  { label: 'New leads', value: '24', color: '#F1E9DE' },
  { label: 'Follow-ups', value: '08', color: '#E3EAF4' },
  { label: 'Deals won', value: '12', color: '#E1EBDF' }
]

const stages = [
  {
    title: 'New lead',
    color: '#B5A28A',
    deals: [
      { name: 'Website enquiry', value: 'Rs. 45,000' },
      { name: 'WhatsApp lead', value: 'Rs. 28,000' }
    ]
  },
  {
    title: 'Quotation',
    color: '#91A7C2',
    deals: [
      { name: 'Service proposal', value: 'Rs. 75,000' },
      { name: 'Product order', value: 'Rs. 32,500' }
    ]
  },
  {
    title: 'Won',
    color: '#91AA87',
    deals: [
      { name: 'New customer', value: 'Rs. 60,000' },
      { name: 'Order confirmed', value: 'Rs. 48,000' }
    ]
  }
]

const activities = [
  {
    title: 'Follow-up reminder',
    description: 'Customer quotation awaiting response'
  },
  {
    title: 'Customer history updated',
    description: 'Latest conversation saved to the CRM'
  },
  {
    title: 'Sales report ready',
    description: 'Your team performance in one place'
  }
]

function start() {
  if (timer) return

  timer = setInterval(() => {
    active.value = (active.value + 1) % activities.length
  }, 2800)
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
    { threshold: .15 }
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
    class="stb"
    :class="{ 'stb-in': shown }"
    aria-labelledby="stb-title"
  >

    <div class="stb-wrap">

      <div class="stb-panel">

        <span class="stb-orbit stb-orbit-one"></span>
        <span class="stb-orbit stb-orbit-two"></span>

        <!-- Left content -->

        <div class="stb-copy">

          <h2 id="stb-title">
            Benefits for
            <span>small teams</span>
          </h2>

          <p>
            You'll answer enquiries faster, follow up
            consistently and know exactly where every
            deal stands. Your customer history stays
            with the business, not in one person's phone.
            And you'll have the reports investors and
            banks ask for, without building spreadsheets.
          </p>

        </div>

        <!-- CRM dashboard -->

        <div class="stb-visual" aria-hidden="true">

          <div class="stb-dashboard">

            <div class="stb-header">

              <div class="stb-heading">

                <span class="stb-dots">
                  <i></i><i></i><i></i>
                </span>

                <div>
                  <h3>Sales overview</h3>
                  <small>Team workspace</small>
                </div>

              </div>

              <span class="stb-status">
                <i></i>
                Up to date
              </span>

            </div>

            <!-- Statistics -->

            <div class="stb-stats">

              <div
                v-for="stat in stats"
                :key="stat.label"
                class="stb-stat"
                :style="{ background: stat.color }"
              >
                <small>{{ stat.label }}</small>
                <strong>{{ stat.value }}</strong>
              </div>

            </div>

            <!-- Pipeline -->

            <div class="stb-section-title">

              <h4>Sales pipeline</h4>

              <span>All deals</span>

            </div>

            <div class="stb-pipeline">

              <div
                v-for="(stage, index) in stages"
                :key="stage.title"
                class="stb-column"
                :style="{ '--delay': index * .15 + 's' }"
              >

                <div class="stb-column-heading">

                  <i :style="{ background: stage.color }"></i>

                  <strong>{{ stage.title }}</strong>

                  <small>{{ stage.deals.length }}</small>

                </div>

                <div
                  v-for="deal in stage.deals"
                  :key="deal.name"
                  class="stb-deal"
                >

                  <strong>{{ deal.name }}</strong>

                  <span>{{ deal.value }}</span>

                  <div class="stb-deal-bottom">

                    <span class="stb-avatar">

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                      >
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 22v-3a8 8 0 0 1 16 0v3"/>
                      </svg>

                    </span>

                    <span class="stb-deal-line"></span>

                  </div>

                </div>

              </div>

            </div>

            <!-- Animated notification -->

            <div class="stb-activity">

              <span class="stb-activity-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 8a6 6 0 0 0-12 0
                  c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
                  <path d="M10 21h4"/>
                </svg>

              </span>

              <Transition name="stb-message" mode="out-in">

                <div
                  :key="active"
                  class="stb-activity-copy"
                >
                  <strong>{{ activities[active].title }}</strong>
                  <small>{{ activities[active].description }}</small>
                </div>

              </Transition>

              <span class="stb-check">✓</span>

            </div>

            <div class="stb-rail">

              <i
                :style="{
                  width: ((active + 1) / activities.length) * 100 + '%'
                }"
              ></i>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');

.stb,
.stb * {
  box-sizing: border-box;
}

.stb {
  width: 100%;
  padding: 40px clamp(24px, 4vw, 64px);
  background: #fff;
}

.stb-wrap {
  max-width: 1440px;
  margin: 0 auto;
}

.stb-panel {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(36px, 5vw, 80px);
  padding: clamp(36px, 5vw, 72px);
  border-radius: 36px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #f1f1f3,
    #e4e4e9 55%,
    #d6d6de
  );
}

.stb-orbit {
  position: absolute;
  z-index: -1;
  border: 1px solid rgba(255,255,255,.8);
  border-radius: 50%;
  pointer-events: none;
}

.stb-orbit-one {
  width: 800px;
  height: 800px;
  right: -280px;
  bottom: -320px;
}

.stb-orbit-two {
  width: 650px;
  height: 650px;
  right: -205px;
  bottom: -245px;
}

/* Content */

.stb-copy h2 {
  margin: 0 0 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.stb-copy h2 span {
  display: block;
  background: linear-gradient(100deg, #a1a1aa, #777780);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stb-copy p {
  max-width: 52ch;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  line-height: 1.85;
  color: #666b73;
}

/* Dashboard */

.stb-visual {
  min-width: 0;
}

.stb-dashboard {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  padding: 24px;
  border-radius: 24px;
  background: #fff;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 28px 60px -28px rgba(35,35,45,.35);
}

.stb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eee;
}

.stb-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stb-dots {
  display: flex;
  gap: 4px;
}

.stb-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #dedee4;
}

.stb-heading h3 {
  margin: 0 0 4px;
  font-family: 'Urbanist', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #292929;
}

.stb-heading small {
  font-size: 10px;
  color: #999;
}

.stb-status {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 20px;
  background: #e4eee1;
  color: #64815f;
  font-size: 10px;
}

.stb-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Statistics */

.stb-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 20px 0 24px;
}

.stb-stat {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.stb-stat small {
  font-size: 10px;
  color: #666;
}

.stb-stat strong {
  font-family: 'Urbanist', sans-serif;
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.04em;
  color: #292929;
}

/* Pipeline */

.stb-section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.stb-section-title h4 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.stb-section-title > span {
  font-size: 10px;
  color: #999;
}

.stb-pipeline {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.stb-column {
  min-width: 0;
  padding: 10px;
  border-radius: 12px;
  background: #f5f5f7;
}

.stb-column-heading {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 12px;
}

.stb-column-heading i {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.stb-column-heading strong {
  flex: 1;
  font-size: 10px;
  font-weight: 600;
  color: #555;
}

.stb-column-heading small {
  font-size: 9px;
  color: #999;
}

.stb-deal {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-height: 100px;
  margin-bottom: 8px;
  padding: 12px 9px;
  border: 1px solid #ececf0;
  border-radius: 9px;
  background: #fff;
}

.stb-deal:last-child {
  margin-bottom: 0;
}

.stb-deal > strong {
  font-size: 10px;
  font-weight: 600;
  line-height: 1.4;
  color: #333;
}

.stb-deal > span {
  font-size: 10px;
  color: #777;
}

.stb-deal-bottom {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: auto;
}

.stb-avatar {
  display: grid;
  place-items: center;
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e9e8ec;
  color: #888;
}

.stb-avatar svg {
  width: 12px;
  height: 12px;
}

.stb-deal-line {
  width: 50%;
  height: 4px;
  border-radius: 4px;
  background: #e9e9ed;
}

/* Activity notification */

.stb-activity {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 70px;
  margin-top: 20px;
  padding: 12px;
  border-radius: 12px;
  background: #eef4ec;
}

.stb-activity-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #dfeadb;
  color: #6c8865;
}

.stb-activity-icon svg {
  width: 20px;
  height: 20px;
}

.stb-activity-copy {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.stb-activity-copy strong {
  font-size: 11px;
  font-weight: 600;
  color: #3e5139;
}

.stb-activity-copy small {
  font-size: 10px;
  color: #788374;
}

.stb-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dce9d8;
  color: #6c8865;
  font-size: 12px;
}

.stb-rail {
  height: 3px;
  margin-top: 16px;
  overflow: hidden;
  border-radius: 3px;
  background: #eee;
}

.stb-rail i {
  display: block;
  height: 100%;
  background: #292929;
  transition: width .6s ease;
}

/* Animation */

.stb-in .stb-column {
  animation: stb-reveal .7s var(--delay) ease both;
}

@keyframes stb-reveal {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stb-message-enter-active,
.stb-message-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}

.stb-message-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.stb-message-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Responsive */

@media (max-width: 1050px) {
  .stb-panel {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .stb-copy p {
    max-width: 70ch;
  }
}

@media (max-width: 640px) {
  .stb {
    padding: 28px 16px;
  }

  .stb-panel {
    padding: 28px 18px;
    border-radius: 26px;
    gap: 28px;
  }

  .stb-copy h2 {
    font-size: 38px;
    margin-bottom: 18px;
  }

  .stb-copy p {
    font-size: 14px;
  }

  .stb-dashboard {
    padding: 12px;
    border-radius: 18px;
  }

  .stb-dots {
    display: none;
  }

  .stb-heading h3 {
    font-size: 18px;
  }

  .stb-stat {
    padding: 12px 8px;
  }

  .stb-stat strong {
    font-size: 26px;
  }

  .stb-stat small {
    font-size: 9px;
  }

  .stb-pipeline {
    gap: 5px;
  }

  .stb-column {
    padding: 6px;
  }

  .stb-deal {
    padding: 8px 5px;
  }

  .stb-deal > strong,
  .stb-deal > span,
  .stb-column-heading strong {
    font-size: 8px;
  }

  .stb-activity-copy small {
    font-size: 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stb *,
  .stb *::before,
  .stb *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
