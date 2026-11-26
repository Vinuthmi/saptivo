
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'FieldServiceManagerBenefits' })

const root = ref(null)
const shown = ref(false)

let observer = null

const stats = [
  {
    label: 'Scheduled jobs',
    value: '24',
    note: 'Today',
    color: '#F3F3F5',
    icon: 'M3 5h18v16H3zM7 3v4M17 3v4M3 10h18'
  },
  {
    label: 'Active technicians',
    value: '08',
    note: 'In the field',
    color: '#E6EFE4',
    icon: 'M4 21v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8'
  },
  {
    label: 'Upcoming renewals',
    value: '12',
    note: 'Next 30 days',
    color: '#E5EAF4',
    icon: 'M20 7v5h-5M4 17v-5h5M6 7a7 7 0 0 1 12-1l2 3M4 15l2 3a7 7 0 0 0 12-1'
  },
  {
    label: 'Unbilled jobs',
    value: '05',
    note: 'Awaiting invoice',
    color: '#F7EBDD',
    icon: 'M5 3h14v18l-3-2-4 2-4-2-3 2zM8 8h8M8 12h8M8 16h4'
  }
]

const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM']

const technicians = [
  {
    name: 'Technician 01',
    initials: 'T1',
    color: '#E8E3DB',
    status: 'On site',
    jobs: [
      { start: 1, span: 2, title: 'AC service', color: '#DCE9D8' },
      { start: 4, span: 3, title: 'Inspection', color: '#E2E8F3' }
    ]
  },
  {
    name: 'Technician 02',
    initials: 'T2',
    color: '#E0E8EF',
    status: 'Available',
    jobs: [
      { start: 2, span: 2, title: 'Maintenance', color: '#F1E4D3' },
      { start: 5, span: 2, title: 'Repair', color: '#E8E2EF' }
    ]
  },
  {
    name: 'Technician 03',
    initials: 'T3',
    color: '#E3EADD',
    status: 'On site',
    jobs: [
      { start: 1, span: 3, title: 'Site visit', color: '#E2E8F3' },
      { start: 5, span: 2, title: 'Service', color: '#DCE9D8' }
    ]
  }
]

const metrics = [
  {
    label: 'First-time fix rate',
    value: 92,
    color: '#91A98A'
  },
  {
    label: 'SLA compliance',
    value: 96,
    color: '#9CAFC5'
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
    { threshold: 0.15 }
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
    class="fsm"
    :class="{ 'fsm-in': shown }"
    aria-labelledby="fsm-title"
  >

    <div class="fsm-wrap">

      <div class="fsm-panel">

        <span class="fsm-orbit fsm-orbit-one"></span>
        <span class="fsm-orbit fsm-orbit-two"></span>

        <!-- Left dashboard -->

        <div class="fsm-visual" aria-hidden="true">

          <div class="fsm-dashboard">

            <div class="fsm-header">

              <div>
                <h3>Service overview</h3>
                <small>Today's operations</small>
              </div>

              <span class="fsm-date">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2"/>
                  <path d="M7 3v4M17 3v4M3 10h18"/>
                </svg>

                Today

              </span>

            </div>

            <!-- Statistics -->

            <div class="fsm-stats">

              <div
                v-for="stat in stats"
                :key="stat.label"
                class="fsm-stat"
                :style="{ background: stat.color }"
              >

                <div class="fsm-stat-top">

                  <span>{{ stat.label }}</span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path :d="stat.icon"/>
                  </svg>

                </div>

                <strong>{{ stat.value }}</strong>
                <small>{{ stat.note }}</small>

              </div>

            </div>

            <!-- Technician schedule -->

            <div class="fsm-schedule">

              <div class="fsm-section-title">
                <h4>Technician schedule</h4>
                <span>3 technicians</span>
              </div>

              <div class="fsm-calendar">

                <div class="fsm-time-row">

                  <span></span>

                  <div class="fsm-hours">
                    <span v-for="hour in hours" :key="hour">
                      {{ hour }}
                    </span>
                  </div>

                </div>

                <div
                  v-for="(tech, index) in technicians"
                  :key="tech.name"
                  class="fsm-tech-row"
                >

                  <div class="fsm-tech">

                    <span
                      class="fsm-avatar"
                      :style="{ background: tech.color }"
                    >
                      {{ tech.initials }}
                    </span>

                    <div>
                      <strong>{{ tech.name }}</strong>
                      <small>{{ tech.status }}</small>
                    </div>

                  </div>

                  <div class="fsm-timeline">

                    <div
                      v-for="cell in 6"
                      :key="'cell-' + cell"
                      class="fsm-cell"
                      :style="{ gridColumn: cell }"
                    ></div>

                    <div
                      v-for="job in tech.jobs"
                      :key="job.title"
                      class="fsm-job"
                      :style="{
                        gridColumn: job.start + ' / span ' + job.span,
                        background: job.color,
                        '--delay': index * .15 + 's'
                      }"
                    >
                      {{ job.title }}
                    </div>

                  </div>

                </div>

              </div>

            </div>

            <!-- Performance -->

            <div class="fsm-performance">

              <div class="fsm-section-title">
                <h4>Service performance</h4>
                <span>This month</span>
              </div>

              <div
                v-for="metric in metrics"
                :key="metric.label"
                class="fsm-metric"
              >

                <div class="fsm-metric-label">
                  <span>{{ metric.label }}</span>
                  <strong>{{ metric.value }}%</strong>
                </div>

                <div class="fsm-progress">
                  <i
                    :style="{
                      width: metric.value + '%',
                      background: metric.color
                    }"
                  ></i>
                </div>

              </div>

            </div>

          </div>

        </div>

        <!-- Right content -->

        <div class="fsm-copy">

          <h2 id="fsm-title">
            Benefits for
            <span>service managers</span>
          </h2>

          <p>
            You'll see every technician's jobs, every
            contract's renewal date and every unbilled
            job on one screen. Instead of reacting to
            complaints, you'll plan preventive work,
            reduce breakdowns and grow renewals.
          </p>

        </div>

      </div>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.fsm,
.fsm * {
  box-sizing: border-box;
}

.fsm {
  width: 100%;
  padding: 40px clamp(24px, 4vw, 64px);
  background: #fff;
}

.fsm-wrap {
  max-width: 1440px;
  margin: 0 auto;
}

.fsm-panel {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(36px, 5vw, 80px);
  padding: clamp(36px, 5vw, 72px);
  overflow: hidden;
  border-radius: 36px;
  background: linear-gradient(
    135deg,
    #f1f2f4,
    #e5e7eb 55%,
    #d9dce1
  );
}

/* Decorative background */

.fsm-orbit {
  position: absolute;
  z-index: -1;
  border: 1px solid rgba(255,255,255,.8);
  border-radius: 50%;
  pointer-events: none;
}

.fsm-orbit-one {
  width: 800px;
  height: 800px;
  left: -220px;
  bottom: -300px;
}

.fsm-orbit-two {
  width: 650px;
  height: 650px;
  left: -145px;
  bottom: -225px;
}

/* Content */

.fsm-copy h2 {
  margin: 0 0 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.fsm-copy h2 span {
  display: block;
  background: linear-gradient(100deg, #a1a1aa, #777780);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.fsm-copy p {
  max-width: 50ch;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  line-height: 1.85;
  color: #666b73;
}

/* Dashboard */

.fsm-visual {
  min-width: 0;
}

.fsm-dashboard {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  padding: 24px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 65px -28px rgba(35,40,50,.3);
  font-family: 'Poppins', sans-serif;
}

.fsm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eee;
}

.fsm-header h3 {
  margin: 0 0 4px;
  font-family: 'Urbanist', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #222;
}

.fsm-header small {
  font-size: 10px;
  color: #888;
}

.fsm-date {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border: 1px solid #e9e9ec;
  border-radius: 8px;
  font-size: 10px;
  color: #666;
}

.fsm-date svg {
  width: 15px;
  height: 15px;
}

/* Statistics */

.fsm-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.fsm-stat {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 15px;
  border-radius: 12px;
}

.fsm-stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.fsm-stat-top span {
  font-size: 11px;
  color: #666;
}

.fsm-stat-top svg {
  flex: none;
  width: 17px;
  height: 17px;
  color: #777;
}

.fsm-stat strong {
  font-family: 'Urbanist', sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.04em;
  color: #292929;
}

.fsm-stat small {
  font-size: 9px;
  color: #777;
}

/* Schedule */

.fsm-schedule {
  margin-top: 24px;
}

.fsm-section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.fsm-section-title h4 {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.fsm-section-title > span {
  font-size: 9px;
  color: #888;
}

.fsm-calendar {
  width: 100%;
  overflow-x: auto;
}

.fsm-time-row,
.fsm-tech-row {
  display: grid;
  grid-template-columns: 125px minmax(0, 1fr);
  align-items: center;
  min-width: 420px;
  gap: 8px;
}

.fsm-hours {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  text-align: center;
}

.fsm-hours span {
  padding: 6px 0;
  font-size: 8px;
  color: #999;
}

.fsm-tech-row {
  min-height: 54px;
  border-bottom: 1px solid #f0f0f2;
}

.fsm-tech {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fsm-avatar {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 600;
  color: #666;
}

.fsm-tech strong,
.fsm-tech small {
  display: block;
}

.fsm-tech strong {
  font-size: 9px;
  font-weight: 600;
  color: #333;
}

.fsm-tech small {
  margin-top: 3px;
  font-size: 8px;
  color: #888;
}

.fsm-timeline {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-template-rows: 32px;
  gap: 3px;
}

.fsm-cell {
  grid-row: 1;
  border-radius: 5px;
  background: #f5f5f7;
}

.fsm-job {
  z-index: 1;
  grid-row: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 5px 7px;
  overflow: hidden;
  border-radius: 6px;
  font-size: 8px;
  font-weight: 500;
  white-space: nowrap;
  color: #53565a;
  transform-origin: left;
}

.fsm-in .fsm-job {
  animation: fsm-grow .8s var(--delay) ease both;
}

/* Performance */

.fsm-performance {
  margin-top: 24px;
}

.fsm-metric + .fsm-metric {
  margin-top: 14px;
}

.fsm-metric-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 10px;
  color: #777;
}

.fsm-metric-label strong {
  color: #333;
  font-weight: 600;
}

.fsm-progress {
  height: 6px;
  overflow: hidden;
  border-radius: 10px;
  background: #eeeef0;
}

.fsm-progress i {
  display: block;
  height: 100%;
  border-radius: inherit;
  transform-origin: left;
}

.fsm-in .fsm-progress i {
  animation: fsm-grow 1.2s .2s ease both;
}

@keyframes fsm-grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.fsm-in .fsm-visual,
.fsm-in .fsm-copy {
  animation: fsm-reveal .8s ease both;
}

@keyframes fsm-reveal {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */

@media (max-width: 1050px) {
  .fsm-panel {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .fsm-copy {
    grid-row: 1;
  }

  .fsm-copy p {
    max-width: 65ch;
  }
}

@media (max-width: 640px) {
  .fsm {
    padding: 28px 16px;
  }

  .fsm-panel {
    padding: 28px 18px;
    border-radius: 26px;
    gap: 28px;
  }

  .fsm-copy h2 {
    font-size: 38px;
    margin-bottom: 18px;
  }

  .fsm-copy p {
    font-size: 14px;
  }

  .fsm-dashboard {
    padding: 14px;
    border-radius: 18px;
  }

  .fsm-stat {
    padding: 12px 10px;
  }

  .fsm-stat-top span {
    font-size: 9px;
  }

  .fsm-stat-top svg {
    width: 14px;
    height: 14px;
  }

  .fsm-stat strong {
    font-size: 27px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fsm *,
  .fsm *::before,
  .fsm *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
