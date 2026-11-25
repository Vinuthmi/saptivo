
<template>
  <section
    ref="sectionEl"
    class="partner-support"
    :class="{ 'ps-revealed': revealed }"
    aria-label="Saptivo partner support"
  >
    <div class="ps-wrap">
      <div class="ps-grid">

        <!-- =====================================
             CARD 1 — TRAINING AND SALES SUPPORT
        ====================================== -->

        <article class="ps-card ps-training-card">

          <div class="ps-content">
            <h2>Training and sales support</h2>

            <p>
              Partners receive product training, demo workspaces,
              sales materials and a dedicated partner contact at
              Weblook. We help with your first client deployments
              so you can sell with confidence.
            </p>
          </div>

          <div class="ps-training-visual" aria-hidden="true">

            <!-- Learning centre -->

            <div class="ps-learning">

              <div class="ps-learning-header">

                <div class="ps-learning-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="m2 10 10-6 10 6-10 6-10-6Z"/>
                    <path d="M6 13v5c4 3 8 3 12 0v-5"/>
                  </svg>
                </div>

                <div>
                  <h3>Partner learning centre</h3>
                  <span>Build your product knowledge</span>
                </div>

              </div>

              <!-- Training course -->

              <div class="ps-course">

                <div class="ps-course-thumbnail">

                  <div class="ps-orbit"></div>
                  <div class="ps-orbit second"></div>

                  <div class="ps-mini-screen">

                    <div class="ps-mini-top">
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>

                    <div class="ps-mini-body">

                      <div class="ps-mini-sidebar">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>

                      <div class="ps-mini-dashboard">

                        <div class="ps-mini-stats">
                          <i></i>
                          <i></i>
                          <i></i>
                        </div>

                        <div class="ps-mini-chart">
                          <span
                            v-for="(bar, i) in miniBars"
                            :key="i"
                            :style="{ height: bar + '%' }"
                          ></span>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div class="ps-play">
                    <svg viewBox="0 0 24 24">
                      <path d="m9 5 12 7-12 7Z"/>
                    </svg>
                  </div>

                </div>

                <div class="ps-course-info">

                  <span class="ps-course-label">
                    PRODUCT TRAINING
                  </span>

                  <h4>Getting started with Saptivo</h4>

                  <div class="ps-course-meta">
                    <span>Partner essentials</span>
                    <span>3 modules</span>
                  </div>

                </div>
              </div>

              <!-- Learning progress -->

              <div class="ps-progress-heading">

                <strong>Your learning progress</strong>

                <span>
                  {{ completedLessons }}/3 completed
                </span>

              </div>

              <div class="ps-progress-track">

                <div
                  class="ps-progress-fill"
                  :style="{
                    width: completedLessons / 3 * 100 + '%'
                  }"
                ></div>

              </div>

              <div class="ps-lessons">

                <div
                  v-for="(lesson, i) in lessons"
                  :key="lesson"
                  class="ps-lesson"
                  :class="{
                    completed: i < completedLessons
                  }"
                >

                  <span class="ps-lesson-check">

                    <svg
                      v-if="i < completedLessons"
                      viewBox="0 0 24 24"
                    >
                      <path d="m5 12 4 4L19 6"/>
                    </svg>

                    <span v-else>
                      {{ i + 1 }}
                    </span>

                  </span>

                  <span>{{ lesson }}</span>

                </div>

              </div>

            </div>

            <!-- Sales resources -->

            <div class="ps-resources">

              <div class="ps-resource-icon">

                <svg viewBox="0 0 24 24">
                  <path d="M5 3h10l4 4v14H5Z"/>
                  <path d="M14 3v5h5M8 12h8M8 16h6"/>
                </svg>

              </div>

              <div class="ps-resource-text">
                <strong>Sales resources</strong>
                <span>Brochures and demo workspaces</span>
              </div>

              <span class="ps-resource-ready">

                <svg viewBox="0 0 24 24">
                  <path d="m5 12 4 4L19 6"/>
                </svg>

              </span>

            </div>

            <!-- Dedicated partner support -->

            <div class="ps-support-widget">

              <div class="ps-support-header">

                <div class="ps-support-avatar">
                  W
                  <span></span>
                </div>

                <div>
                  <strong>Weblook team</strong>
                  <small>Dedicated partner contact</small>
                </div>

              </div>

              <div class="ps-support-message">

                <p>
                  We're here to help with your first
                  client deployment.
                </p>

              </div>

              <div class="ps-support-footer">
                <span class="ps-online-dot"></span>
                Partner deployment support
              </div>

            </div>

          </div>

        </article>

        <!-- =====================================
             CARD 2 — CENTRAL PARTNER HUB
        ====================================== -->

        <article class="ps-card ps-hub-card">

          <div class="ps-content">

            <h2>One partner hub for everything</h2>

            <p>
              Provision new client workspaces in minutes,
              manage your accounts, track every client's
              subscription and see commissions earned this
              month, all from one central partner dashboard.
            </p>

          </div>

          <div class="ps-hub-visual" aria-hidden="true">

            <!-- Main dashboard -->

            <div class="ps-dashboard">

              <!-- Browser header -->

              <div class="ps-browser">

                <div class="ps-browser-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <div class="ps-browser-address">

                  <svg viewBox="0 0 24 24">
                    <rect
                      x="6"
                      y="10"
                      width="12"
                      height="10"
                      rx="2"
                    />
                    <path d="M9 10V7a3 3 0 0 1 6 0v3"/>
                  </svg>

                  partners.saptivo.com

                </div>

              </div>

              <div class="ps-dashboard-app">

                <!-- Dashboard sidebar -->

                <aside class="ps-sidebar">

                  <div class="ps-logo">

                    <span class="ps-logo-symbol">
                      S
                    </span>

                    <div>
                      <strong>SAPTIVO</strong>
                      <small>Partner portal</small>
                    </div>

                  </div>

                  <span class="ps-sidebar-label">
                    PARTNER WORKSPACE
                  </span>

                  <div
                    v-for="(item, i) in menu"
                    :key="item.name"
                    class="ps-menu-item"
                    :class="{ active: i === 0 }"
                  >

                    <svg viewBox="0 0 24 24">

                      <path
                        v-for="path in item.icon"
                        :key="path"
                        :d="path"
                      />

                    </svg>

                    <span>{{ item.name }}</span>

                  </div>

                  <div class="ps-sidebar-bottom">

                    <div class="ps-partner-avatar">
                      JD
                    </div>

                    <div>
                      <strong>Jamie Davis</strong>
                      <small>Saptivo partner</small>
                    </div>

                  </div>

                </aside>

                <!-- Dashboard main content -->

                <div class="ps-main">

                  <div class="ps-main-heading">

                    <div>
                      <span>Partner portal / Overview</span>
                      <h3>Partner overview</h3>
                    </div>

                    <div class="ps-period">
                      This month
                    </div>

                  </div>

                  <!-- Static dashboard statistics -->

                  <div class="ps-stats">

                    <div
                      v-for="stat in stats"
                      :key="stat.label"
                      class="ps-stat"
                    >

                      <div class="ps-stat-heading">

                        <span>{{ stat.label }}</span>

                        <svg viewBox="0 0 24 24">
                          <path :d="stat.icon"/>
                        </svg>

                      </div>

                      <strong class="ps-stat-value">
                        {{ stat.value }}
                      </strong>

                      <small>
                        <i></i>
                        {{ stat.note }}
                      </small>

                    </div>

                  </div>

                  <!-- Commission chart -->

                  <div class="ps-commission">

                    <div class="ps-commission-header">

                      <div>
                        <strong>Commission overview</strong>
                        <span>Monthly partner earnings</span>
                      </div>

                      <span class="ps-chart-key">
                        <i></i>
                        Commission
                      </span>

                    </div>

                    <div class="ps-chart">

                      <div class="ps-chart-axis">
                        <span>3k</span>
                        <span>2k</span>
                        <span>1k</span>
                        <span>0</span>
                      </div>

                      <div class="ps-chart-area">

                        <div class="ps-chart-lines">
                          <i></i>
                          <i></i>
                          <i></i>
                          <i></i>
                        </div>

                        <div class="ps-chart-bars">

                          <span
                            v-for="(bar, i) in commissionBars"
                            :key="i"
                            :style="{
                              height: bar + '%',
                              '--i': i
                            }"
                          ></span>

                        </div>

                      </div>

                    </div>

                    <div class="ps-chart-months">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                    </div>

                  </div>

                  <!-- Static client workspace table -->

                  <div class="ps-workspaces">

                    <div class="ps-workspaces-header">

                      <div>
                        <strong>Client workspaces</strong>
                        <span>Manage your client accounts</span>
                      </div>

                      <span class="ps-new-workspace">

                        <svg viewBox="0 0 24 24">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>

                        New workspace

                      </span>

                    </div>

                    <div class="ps-table-heading">
                      <span>Client</span>
                      <span>Subscription</span>
                      <span>Status</span>
                    </div>

                    <div
                      v-for="client in clients"
                      :key="client.name"
                      class="ps-table-row"
                    >

                      <div class="ps-client-name">

                        <span
                          class="ps-client-avatar"
                          :style="{
                            background: client.background,
                            color: client.color
                          }"
                        >
                          {{ client.initial }}
                        </span>

                        <div>
                          <strong>{{ client.name }}</strong>
                          <small>{{ client.domain }}</small>
                        </div>

                      </div>

                      <span>{{ client.plan }}</span>

                      <span class="ps-client-status">
                        <i></i>
                        Active
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <!-- Workspace provisioning widget -->

            <div class="ps-provision-widget">

              <div class="ps-provision-header">

                <div class="ps-provision-icon">

                  <svg viewBox="0 0 24 24">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="3"
                    />
                    <path d="M12 7v10M7 12h10"/>
                  </svg>

                </div>

                <div>
                  <strong>New client workspace</strong>
                  <small>Workspace provisioning</small>
                </div>

              </div>

              <div class="ps-provision-client">

                <span class="ps-provision-avatar">
                  SN
                </span>

                <strong>Studio North</strong>

              </div>

              <div class="ps-provision-steps">

                <div
                  v-for="(step, i) in provisionSteps"
                  :key="step"
                  class="ps-provision-step"
                  :class="{ done: i < provisionStage }"
                >

                  <span class="ps-step-icon">

                    <svg
                      v-if="i < provisionStage"
                      viewBox="0 0 24 24"
                    >
                      <path d="m5 12 4 4L19 6"/>
                    </svg>

                    <span v-else></span>

                  </span>

                  {{ step }}

                </div>

              </div>

              <div class="ps-provision-track">

                <div
                  :style="{
                    width: provisionStage / 3 * 100 + '%'
                  }"
                ></div>

              </div>

              <div class="ps-provision-status">

                <span>Workspace setup</span>

                <strong>
                  {{ Math.round(provisionStage / 3 * 100) }}%
                </strong>

              </div>

            </div>

            <!-- Static commission widget -->

            <div class="ps-earning-widget">

              <div class="ps-earning-icon">

                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9"/>
                  <path
                    d="M12 6v12M16 8H10a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8"
                  />
                </svg>

              </div>

              <div>
                <span>Commission earned</span>
                <strong>+$240.00</strong>
              </div>

              <span class="ps-earning-status">
                Recorded
              </span>

            </div>

          </div>

        </article>

      </div>
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
  name: 'PartnerSupportCards'
})

const sectionEl = ref(null)
const revealed = ref(false)

/* =====================================
   TRAINING DATA
===================================== */

const lessons = [
  'CRM fundamentals',
  'Running a client demo',
  'First client deployment'
]

const miniBars = [
  24, 38, 31, 52, 43,
  67, 59, 81, 73, 95
]

const completedLessons = ref(1)

/* =====================================
   DASHBOARD SIDEBAR
===================================== */

const menu = [
  {
    name: 'Overview',
    icon: [
      'M3 3h7v7H3Z',
      'M14 3h7v7h-7Z',
      'M3 14h7v7H3Z',
      'M14 14h7v7h-7Z'
    ]
  },
  {
    name: 'Workspaces',
    icon: [
      'M3 7h18v14H3Z',
      'M8 7V3h8v4'
    ]
  },
  {
    name: 'Subscriptions',
    icon: [
      'M3 5h18v14H3Z',
      'M3 10h18M7 15h4'
    ]
  },
  {
    name: 'Commissions',
    icon: [
      'M4 19v-5M9 19V9M14 19V5M19 19V2'
    ]
  },
  {
    name: 'Resources',
    icon: [
      'M5 3h10l4 4v14H5Z',
      'M8 12h8M8 16h6'
    ]
  },
  {
    name: 'Settings',
    icon: [
      'M4 7h16M4 17h16',
      'M9 4v6M15 14v6'
    ]
  }
]

/* =====================================
   STATIC DASHBOARD STATISTICS
===================================== */

const stats = [
  {
    label: 'Client workspaces',
    value: '24',
    note: 'Total workspaces',
    icon: 'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z'
  },
  {
    label: 'Active subscriptions',
    value: '21',
    note: 'Active accounts',
    icon: 'M3 5h18v14H3ZM3 10h18M7 15h4'
  },
  {
    label: 'Monthly commission',
    value: '$2,480',
    note: 'This month',
    icon: 'M12 3v18M17 7H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7'
  }
]

const commissionBars = [
  15, 24, 20, 32, 28, 43,
  35, 48, 39, 54, 62, 49,
  68, 75, 64, 82, 73, 92,
  81, 89, 100, 85, 94, 97
]

/* =====================================
   CLIENT WORKSPACES
===================================== */

const clients = [
  {
    name: 'Studio North',
    domain: 'studio-north',
    initial: 'SN',
    plan: 'Professional',
    background: '#f7e5d7',
    color: '#b9815b'
  },
  {
    name: 'Nova Group',
    domain: 'nova-group',
    initial: 'NG',
    plan: 'Growth',
    background: '#e4e8f8',
    color: '#7b88ba'
  },
  {
    name: 'Bloom Digital',
    domain: 'bloom-digital',
    initial: 'BD',
    plan: 'Professional',
    background: '#e1efe7',
    color: '#66977e'
  }
]

/* =====================================
   WORKSPACE PROVISIONING
===================================== */

const provisionSteps = [
  'Workspace created',
  'Subscription configured',
  'Client access enabled'
]

const provisionStage = ref(1)

/* =====================================
   MINIMAL ANIMATION CONTROLLER

   Only progress bars and checkmarks
   animate. All other content is static.

   Animations stop after completion.
===================================== */

let observer = null
let timer = null
let motionQuery = null
let isVisible = false
let tick = 0

function advanceAnimations() {
  tick += 1

  // Workspace setup progresses slowly
  if (
    tick % 2 === 0 &&
    provisionStage.value < 3
  ) {
    provisionStage.value += 1
  }

  // Training progress changes less frequently
  if (
    tick % 3 === 0 &&
    completedLessons.value < 3
  ) {
    completedLessons.value += 1
  }

  // Stop completely when both are finished
  if (
    provisionStage.value === 3 &&
    completedLessons.value === 3
  ) {
    stopAnimations()
  }
}

function stopAnimations() {
  if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
}

function syncAnimations() {
  if (motionQuery?.matches) {
    provisionStage.value = 3
    completedLessons.value = 3

    stopAnimations()
    return
  }

  if (!isVisible || document.hidden) {
    stopAnimations()
    return
  }

  if (
    provisionStage.value === 3 &&
    completedLessons.value === 3
  ) {
    stopAnimations()
    return
  }

  if (timer === null) {
    timer = window.setInterval(
      advanceAnimations,
      2500
    )
  }
}

onMounted(() => {
  motionQuery = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  )

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting

        if (isVisible) {
          revealed.value = true
        }

        syncAnimations()
      },
      {
        threshold: 0.1
      }
    )

    if (sectionEl.value) {
      observer.observe(sectionEl.value)
    }
  } else {
    isVisible = true
    revealed.value = true
    syncAnimations()
  }

  document.addEventListener(
    'visibilitychange',
    syncAnimations
  )

  motionQuery.addEventListener?.(
    'change',
    syncAnimations
  )

  syncAnimations()
})

onBeforeUnmount(() => {
  stopAnimations()

  observer?.disconnect()

  document.removeEventListener(
    'visibilitychange',
    syncAnimations
  )

  motionQuery?.removeEventListener?.(
    'change',
    syncAnimations
  )
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');

/* =====================================
   MAIN SECTION
===================================== */

.partner-support,
.partner-support * {
  box-sizing: border-box;
}

.partner-support {
  --ink: #172033;
  --muted: #758094;
  --orange: #e99b68;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);

  width: 100%;
  background: #ffffff;
  color: var(--ink);

  font-family:
    'Urbanist',
    system-ui,
    sans-serif;
}

.ps-wrap {
  max-width: 1440px;
  margin: 0 auto;

  padding:
    0
    clamp(16px, 3vw, 36px)
    70px;
}

.ps-grid {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 2fr);

  gap: 16px;
  align-items: stretch;
}

.ps-card {
  position: relative;
  isolation: isolate;

  display: flex;
  flex-direction: column;

  min-width: 0;
  min-height: 590px;

  border-radius: 26px;
  overflow: hidden;
}

/* =====================================
   FULL PASTEL MESH BACKGROUNDS
===================================== */

/* Card 1 — Peach, blush and lavender */

.ps-training-card {
  background:
    radial-gradient(
      ellipse at 0% 0%,
      #f8e6d2 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse at 100% 0%,
      #e0e6f5 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse at 0% 100%,
      #eab5c2 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse at 100% 100%,
      #b6b7df 0%,
      transparent 65%
    ),
    linear-gradient(
      145deg,
      #f4d8c5 0%,
      #e7c1c9 45%,
      #c8bfdc 100%
    );
}

/* Card 2 — Powder blue and lavender */

.ps-hub-card {
  background:
    radial-gradient(
      ellipse at 0% 0%,
      #d5e8f5 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse at 100% 0%,
      #d9dff3 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse at 0% 100%,
      #cbb2df 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse at 100% 100%,
      #f2c6b7 0%,
      transparent 60%
    ),
    linear-gradient(
      155deg,
      #bcd6eb 0%,
      #a9b8dc 45%,
      #bfb8dc 70%,
      #e5bcca 100%
    );
}

/* =====================================
   CARD CONTENT
===================================== */

.ps-content {
  position: relative;
  z-index: 5;

  padding: 30px 30px 0;
}

.ps-content h2 {
  margin: 0;

  font-size: clamp(26px, 2.5vw, 36px);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.04em;

  color: #172033;
}

.ps-content p {
  max-width: 65ch;
  margin: 14px 0 0;

  font-size: 15px;
  font-weight: 500;
  line-height: 1.65;

  color: #39475c;
}

.ps-training-visual,
.ps-hub-visual {
  position: relative;
  flex: 1;

  min-height: 440px;
  margin-top: 16px;

  overflow: hidden;
}

/* =====================================
   LEARNING CENTRE
===================================== */

.ps-learning {
  position: relative;

  width: calc(100% - 48px);
  max-width: 350px;

  margin: 15px auto 0;
  padding: 17px;

  border: 1px solid #ffffffcc;
  border-radius: 15px;

  background: #ffffff;

  box-shadow:
    0 20px 45px rgba(68, 51, 87, 0.13);
}

.ps-learning-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ps-learning-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 35px;
  height: 35px;

  border-radius: 9px;
  background: #f0eaf8;
  color: #9481b7;
}

.ps-learning-icon svg {
  width: 20px;
  height: 20px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linejoin: round;
}

.ps-learning-header h3 {
  margin: 0;

  font-size: 14px;
  font-weight: 750;
}

.ps-learning-header span {
  display: block;
  margin-top: 4px;

  font-size: 10px;
  color: var(--muted);
}

/* =====================================
   TRAINING COURSE PREVIEW
===================================== */

.ps-course {
  margin-top: 15px;

  border: 1px solid #ece9f1;
  border-radius: 10px;

  overflow: hidden;
}

.ps-course-thumbnail {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  height: 104px;
  overflow: hidden;

  background:
    linear-gradient(
      130deg,
      #e9dff5,
      #c8c4e8 55%,
      #edc8c4
    );
}

.ps-orbit {
  position: absolute;
  top: -65px;
  left: -25px;

  width: 210px;
  height: 210px;

  border: 1px solid #ffffff80;
  border-radius: 50%;
}

.ps-orbit.second {
  top: -45px;
  left: -5px;

  width: 170px;
  height: 170px;
}

.ps-mini-screen {
  position: relative;

  width: 155px;
  height: 85px;

  background: #ffffff;

  border: 1px solid #ffffffcc;
  border-radius: 6px;

  box-shadow: 0 8px 25px #77719d30;

  overflow: hidden;
  transform: rotate(-5deg);
}

.ps-mini-top {
  display: flex;
  align-items: center;
  gap: 3px;

  height: 12px;
  padding: 0 6px;

  background: #f6f7fa;
}

.ps-mini-top i {
  width: 3px;
  height: 3px;

  border-radius: 50%;
  background: #c6cbd6;
}

.ps-mini-body {
  display: flex;
  height: calc(100% - 12px);
}

.ps-mini-sidebar {
  width: 34px;
  padding: 7px 5px;

  background: #f8f9fb;
}

.ps-mini-sidebar i {
  display: block;

  height: 4px;
  margin-bottom: 6px;

  border-radius: 2px;
  background: #e3e5ec;
}

.ps-mini-sidebar i:first-child {
  background: #efd2b9;
}

.ps-mini-dashboard {
  flex: 1;
  padding: 8px;
}

.ps-mini-stats {
  display: flex;
  gap: 4px;
}

.ps-mini-stats i {
  flex: 1;
  height: 16px;

  border: 1px solid #e9eaf0;
  border-radius: 3px;
}

.ps-mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 3px;

  height: 31px;
  margin-top: 8px;
}

.ps-mini-chart span {
  flex: 1;

  background: #b8b1db;
  border-radius: 2px 2px 0 0;
}

.ps-play {
  position: absolute;

  display: grid;
  place-items: center;

  width: 35px;
  height: 35px;

  border-radius: 50%;
  background: #fffffff0;

  box-shadow: 0 4px 15px #50476b20;
}

.ps-play svg {
  width: 15px;
  height: 15px;

  fill: #8d80b5;
}

.ps-course-info {
  padding: 11px;
}

.ps-course-label {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;

  color: #9685b9;
}

.ps-course-info h4 {
  margin: 5px 0 0;

  font-size: 12px;
  font-weight: 700;
}

.ps-course-meta {
  display: flex;
  justify-content: space-between;
  gap: 5px;

  margin-top: 7px;

  font-size: 9px;
  color: var(--muted);
}

/* =====================================
   LEARNING PROGRESS
===================================== */

.ps-progress-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;

  margin-top: 14px;
}

.ps-progress-heading strong {
  font-size: 10px;
}

.ps-progress-heading > span {
  font-size: 9px;
  color: #9283b2;
}

.ps-progress-track {
  height: 6px;
  margin-top: 8px;

  border-radius: 10px;
  background: #f0edf5;

  overflow: hidden;
}

.ps-progress-fill {
  height: 100%;
  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #a6b6dc,
      #c5b3dd,
      #e6b7c9
    );

  transition: width 1.5s ease-in-out;
}

.ps-lessons {
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-top: 14px;
}

.ps-lesson {
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 10px;
  font-weight: 600;

  color: #6b7587;
}

.ps-lesson-check {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 17px;
  height: 17px;

  border-radius: 50%;
  background: #f1f2f5;

  font-size: 8px;
  color: #8791a1;

  transition:
    background-color 0.6s ease,
    color 0.6s ease;
}

.ps-lesson-check svg {
  width: 11px;
  height: 11px;

  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ps-lesson.completed {
  color: #344054;
}

.ps-lesson.completed .ps-lesson-check {
  background: #e5f3e9;
  color: #639b79;
}

/* =====================================
   SALES RESOURCES WIDGET
===================================== */

.ps-resources {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  gap: 9px;

  width: calc(100% - 85px);
  max-width: 275px;

  margin: 12px auto 0 18px;
  padding: 12px;

  border-radius: 12px;
  background: #ffffff;

  box-shadow: 0 12px 30px #52466e20;
}

.ps-resource-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 32px;
  height: 32px;

  border-radius: 8px;
  background: #fff0e5;
  color: #d29a75;
}

.ps-resource-icon svg {
  width: 17px;
  height: 17px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linejoin: round;
}

.ps-resource-text {
  flex: 1;
  min-width: 0;
}

.ps-resource-text strong {
  display: block;
  font-size: 11px;
}

.ps-resource-text > span {
  display: block;
  margin-top: 4px;

  font-size: 9px;
  line-height: 1.4;
  color: var(--muted);
}

.ps-resource-ready {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 18px;
  height: 18px;

  border-radius: 50%;
  background: #e7f4eb;
  color: #6ba184;
}

.ps-resource-ready svg {
  width: 11px;
  height: 11px;

  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

/* =====================================
   PARTNER SUPPORT WIDGET
===================================== */

.ps-support-widget {
  position: relative;
  z-index: 3;

  width: calc(100% - 65px);
  max-width: 280px;

  margin: 10px 18px 24px auto;
  padding: 13px;

  border-radius: 13px;
  background: #ffffff;

  box-shadow: 0 15px 35px #52466e25;
}

.ps-support-header {
  display: flex;
  align-items: center;
  gap: 9px;
}

.ps-support-avatar {
  position: relative;

  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 31px;
  height: 31px;

  border-radius: 50%;
  background: #dfe8f6;

  font-size: 13px;
  font-weight: 800;
  color: #7388b1;
}

.ps-support-avatar > span {
  position: absolute;
  right: 0;
  bottom: 0;

  width: 9px;
  height: 9px;

  border: 2px solid #ffffff;
  border-radius: 50%;
  background: #8cbea0;
}

.ps-support-header strong {
  display: block;
  font-size: 11px;
}

.ps-support-header small {
  display: block;
  margin-top: 3px;

  font-size: 9px;
  color: var(--muted);
}

.ps-support-message {
  margin-top: 10px;
  padding: 9px 10px;

  border-radius: 2px 9px 9px 9px;
  background: #f3f4fa;
}

.ps-support-message p {
  margin: 0;

  font-size: 10px;
  line-height: 1.5;
  color: #56637a;
}

.ps-support-footer {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 9px;

  font-size: 8px;
  color: #729b83;
}

.ps-online-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;
  background: #8cbea0;
}

/* =====================================
   MAIN PARTNER DASHBOARD
===================================== */

.ps-dashboard {
  position: absolute;

  top: 20px;
  left: 14%;

  width: 91%;
  min-width: 580px;
  height: 470px;

  border: 1px solid #ffffffd9;
  border-radius: 13px 13px 0 0;
  background: #ffffff;

  box-shadow:
    0 20px 55px rgba(51, 65, 100, 0.17);

  overflow: hidden;
}

/* Browser header */

.ps-browser {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 34px;

  border-bottom: 1px solid #e9edf3;
  background: #f8f9fc;
}

.ps-browser-dots {
  position: absolute;
  left: 13px;

  display: flex;
  gap: 5px;
}

.ps-browser-dots i {
  width: 7px;
  height: 7px;

  border-radius: 50%;
  background: #d6dce7;
}

.ps-browser-address {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  width: 49%;
  height: 21px;

  border: 1px solid #e7eaf0;
  border-radius: 20px;
  background: #ffffff;

  font-size: 9px;
  color: var(--muted);
}

.ps-browser-address svg {
  width: 10px;
  height: 10px;

  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.ps-dashboard-app {
  display: grid;

  grid-template-columns:
    135px
    minmax(0, 1fr);

  height: calc(100% - 34px);
}

/* =====================================
   DASHBOARD SIDEBAR
===================================== */

.ps-sidebar {
  position: relative;
  padding: 16px 10px;

  background: #fafbfc;
  border-right: 1px solid #edf0f5;
}

.ps-logo {
  display: flex;
  align-items: center;
  gap: 7px;

  padding: 0 3px;
}

.ps-logo-symbol {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 27px;
  height: 27px;

  border-radius: 7px;
  background: #192333;

  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
}

.ps-logo strong {
  display: block;

  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.ps-logo small {
  display: block;
  margin-top: 2px;

  font-size: 8px;
  color: var(--muted);
}

.ps-sidebar-label {
  display: block;
  margin: 25px 0 10px 6px;

  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.07em;

  color: #98a2b3;
}

.ps-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 9px 7px;
  margin-bottom: 3px;

  border-radius: 6px;

  font-size: 10px;
  font-weight: 600;
  color: #657184;
}

.ps-menu-item.active {
  background: #fff0e5;
  color: #d38c5d;
}

.ps-menu-item svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ps-sidebar-bottom {
  position: absolute;

  bottom: 16px;
  left: 10px;
  right: 10px;

  display: flex;
  align-items: center;
  gap: 7px;

  padding-top: 12px;
  border-top: 1px solid #e8ebf0;
}

.ps-partner-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 27px;
  height: 27px;

  border-radius: 50%;
  background: #f5e3d7;

  font-size: 9px;
  font-weight: 700;
  color: #ad8064;
}

.ps-sidebar-bottom strong {
  display: block;
  font-size: 9px;
}

.ps-sidebar-bottom small {
  display: block;
  margin-top: 3px;

  font-size: 8px;
  color: var(--muted);
}

/* =====================================
   MAIN DASHBOARD CONTENT
===================================== */

.ps-main {
  min-width: 0;
  padding: 16px;
}

.ps-main-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}

.ps-main-heading > div > span {
  font-size: 9px;
  color: var(--muted);
}

.ps-main-heading h3 {
  margin: 5px 0 0;

  font-size: 21px;
  font-weight: 750;
  letter-spacing: -0.04em;
}

.ps-period {
  padding: 6px 9px;

  border: 1px solid #e6eaf0;
  border-radius: 5px;

  font-size: 9px;
  white-space: nowrap;
  color: #657184;
}

/* =====================================
   STATISTICS
===================================== */

.ps-stats {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 9px;
  margin-top: 14px;
}

.ps-stat {
  min-width: 0;
  padding: 11px;

  border: 1px solid #e7eaf0;
  border-radius: 8px;
}

.ps-stat-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;

  font-size: 9px;
  color: var(--muted);
}

.ps-stat-heading svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;

  fill: none;
  stroke: #b0a2c9;
  stroke-width: 1.5;
  stroke-linecap: round;
}

.ps-stat-value {
  display: block;
  margin-top: 5px;

  font-size: 23px;
  font-weight: 750;
  letter-spacing: -0.05em;

  white-space: nowrap;
}

.ps-stat > small {
  display: flex;
  align-items: center;
  gap: 4px;

  margin-top: 4px;

  font-size: 8px;
  color: #6c9b80;
}

.ps-stat > small i {
  width: 5px;
  height: 5px;

  border-radius: 50%;
  background: #8bbba0;
}

/* =====================================
   COMMISSION CHART
===================================== */

.ps-commission {
  margin-top: 11px;
  padding: 12px;

  border: 1px solid #e7eaf0;
  border-radius: 8px;
}

.ps-commission-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.ps-commission-header strong {
  display: block;
  font-size: 12px;
}

.ps-commission-header div > span {
  display: block;
  margin-top: 4px;

  font-size: 9px;
  color: var(--muted);
}

.ps-chart-key {
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 8px;
  color: var(--muted);
}

.ps-chart-key i {
  width: 6px;
  height: 6px;

  border-radius: 50%;
  background: #b1a8d7;
}

.ps-chart {
  display: flex;
  gap: 8px;

  height: 87px;
  margin-top: 13px;
}

.ps-chart-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  font-size: 8px;
  color: #98a2b3;
}

.ps-chart-area {
  position: relative;
  flex: 1;
}

.ps-chart-lines {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ps-chart-lines i {
  border-bottom: 1px dashed #e9eaf0;
}

.ps-chart-bars {
  position: relative;
  z-index: 1;

  display: flex;
  align-items: flex-end;
  gap: 4px;

  height: 100%;
}

.ps-chart-bars span {
  flex: 1;
  min-width: 2px;

  border-radius: 3px 3px 0 0;
  background: #b6c5e4;

  transform-origin: bottom;
}

.ps-chart-bars span:nth-child(3n) {
  background: #9faed6;
}

.ps-chart-bars span:nth-child(5n) {
  background: #c7b6dd;
}

.ps-chart-bars span:nth-child(7n) {
  background: #e6b9cc;
}

.ps-chart-months {
  display: flex;
  justify-content: space-between;

  padding-left: 20px;
  margin-top: 7px;

  font-size: 8px;
  color: #98a2b3;
}

/* =====================================
   CLIENT WORKSPACES TABLE
===================================== */

.ps-workspaces {
  margin-top: 11px;
  padding: 12px;

  border: 1px solid #e7eaf0;
  border-radius: 8px;
}

.ps-workspaces-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ps-workspaces-header strong {
  display: block;
  font-size: 12px;
}

.ps-workspaces-header div > span {
  display: block;
  margin-top: 4px;

  font-size: 9px;
  color: var(--muted);
}

.ps-new-workspace {
  display: flex;
  align-items: center;
  gap: 4px;

  padding: 7px 9px;

  border-radius: 5px;
  background: #fff0e5;

  font-size: 9px;
  font-weight: 700;
  color: #c68a63;

  white-space: nowrap;
}

.ps-new-workspace svg {
  width: 11px;
  height: 11px;

  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.ps-table-heading,
.ps-table-row {
  display: grid;

  grid-template-columns:
    1.4fr
    1fr
    0.7fr;

  align-items: center;
  gap: 7px;
}

.ps-table-heading {
  margin-top: 10px;
  padding: 7px 5px;

  border-radius: 4px;
  background: #f7f8fa;

  font-size: 8px;
  color: var(--muted);
}

.ps-table-row {
  padding: 7px 5px;

  border-bottom: 1px solid #f0f2f5;

  font-size: 9px;
  color: #657184;
}

.ps-client-name {
  display: flex;
  align-items: center;
  gap: 7px;
}

.ps-client-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 25px;
  height: 25px;

  border-radius: 6px;

  font-size: 8px;
  font-weight: 750;
}

.ps-client-name strong {
  display: block;

  font-size: 10px;
  font-weight: 700;
  color: #344054;
}

.ps-client-name small {
  display: block;
  margin-top: 3px;

  font-size: 8px;
  color: #98a2b3;
}

.ps-client-status {
  display: flex;
  align-items: center;
  justify-self: start;
  gap: 4px;

  padding: 4px 7px;

  border-radius: 4px;
  background: #eaf5ed;

  font-size: 8px;
  color: #629477;
}

.ps-client-status i {
  width: 5px;
  height: 5px;

  border-radius: 50%;
  background: #85b99a;
}

/* =====================================
   WORKSPACE PROVISIONING WIDGET
===================================== */

.ps-provision-widget {
  position: absolute;
  z-index: 4;

  left: 4%;
  bottom: 24px;

  width: 208px;
  padding: 14px;

  border: 1px solid #ffffffcc;
  border-radius: 13px;
  background: #ffffff;

  box-shadow:
    0 15px 40px rgba(48, 58, 95, 0.18);
}

.ps-provision-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ps-provision-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 30px;
  height: 30px;

  border-radius: 7px;
  background: #eeeaf8;
  color: #9385b8;
}

.ps-provision-icon svg {
  width: 17px;
  height: 17px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
}

.ps-provision-header strong {
  display: block;
  font-size: 11px;
}

.ps-provision-header small {
  display: block;
  margin-top: 3px;

  font-size: 8px;
  color: var(--muted);
}

.ps-provision-client {
  display: flex;
  align-items: center;
  gap: 7px;

  margin-top: 12px;
  padding: 8px;

  border-radius: 6px;
  background: #f7f8fb;
}

.ps-provision-avatar {
  display: grid;
  place-items: center;

  width: 23px;
  height: 23px;

  border-radius: 5px;
  background: #f7e5d7;

  font-size: 8px;
  font-weight: 750;
  color: #b9815b;
}

.ps-provision-client strong {
  font-size: 10px;
}

.ps-provision-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-top: 12px;
}

.ps-provision-step {
  display: flex;
  align-items: center;
  gap: 7px;

  font-size: 9px;
  color: #8a94a4;

  transition: color 0.6s ease;
}

.ps-provision-step.done {
  color: #43536a;
}

.ps-step-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 15px;
  height: 15px;

  border-radius: 50%;
  background: #f0f2f6;

  transition:
    background-color 0.6s ease,
    color 0.6s ease;
}

.ps-step-icon > span {
  width: 5px;
  height: 5px;

  border-radius: 50%;
  background: #c2c9d5;
}

.ps-provision-step.done .ps-step-icon {
  background: #e4f3e9;
  color: #669d7d;
}

.ps-step-icon svg {
  width: 10px;
  height: 10px;

  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ps-provision-track {
  height: 5px;
  margin-top: 13px;

  border-radius: 8px;
  background: #edf0f5;

  overflow: hidden;
}

.ps-provision-track > div {
  height: 100%;
  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #9eb6d9,
      #bdb0d8,
      #e1b6ce
    );

  transition: width 1.5s ease-in-out;
}

.ps-provision-status {
  display: flex;
  justify-content: space-between;
  gap: 5px;

  margin-top: 8px;

  font-size: 8px;
  color: #7b8798;
}

.ps-provision-status strong {
  color: #8c80b1;
}

/* =====================================
   COMMISSION NOTIFICATION
===================================== */

.ps-earning-widget {
  position: absolute;
  z-index: 3;

  right: 5%;
  bottom: 25px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 13px;

  border-radius: 12px;
  background: #ffffff;

  box-shadow:
    0 15px 35px rgba(48, 58, 95, 0.15);
}

.ps-earning-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 34px;
  height: 34px;

  border-radius: 9px;
  background: #e7f3eb;
  color: #77a98c;
}

.ps-earning-icon svg {
  width: 21px;
  height: 21px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
}

.ps-earning-widget div > span {
  display: block;

  font-size: 9px;
  color: var(--muted);
}

.ps-earning-widget div > strong {
  display: block;
  margin-top: 4px;

  font-size: 17px;
  font-weight: 750;
  letter-spacing: -0.03em;

  color: #344054;
}

.ps-earning-status {
  padding: 5px 7px;

  border-radius: 5px;
  background: #eaf5ed;

  font-size: 8px;
  color: #67967a;
}

/* =====================================
   MINIMAL PREMIUM ANIMATIONS

   No floating cards
   No changing text
   No pulsing elements
   No hover effects
   No continuous chart movement
===================================== */

/* Subtle entrance for main interfaces */

.ps-revealed .ps-learning,
.ps-revealed .ps-dashboard {
  animation:
    ps-soft-reveal
    0.9s
    ease-out
    both;
}

@keyframes ps-soft-reveal {
  from {
    opacity: 0;
    translate: 0 10px;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

/* Chart grows once when entering viewport */

.ps-revealed .ps-chart-bars span {
  animation:
    ps-chart-grow
    1.2s
    var(--ease)
    both;

  animation-delay:
    calc(0.3s + var(--i) * 0.025s);
}

@keyframes ps-chart-grow {
  from {
    transform: scaleY(0);
    opacity: 0.5;
  }

  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

/* =====================================
   RESPONSIVE — LARGE TABLETS
===================================== */

@media (max-width: 1100px) {

  .ps-content {
    padding: 25px 22px 0;
  }

  .ps-content h2 {
    font-size: 29px;
  }

  .ps-content p {
    font-size: 14px;
  }

  .ps-learning {
    width: calc(100% - 30px);
    padding: 13px;
  }

  .ps-resources {
    width: calc(100% - 40px);
    margin-left: 12px;
  }

  .ps-support-widget {
    width: calc(100% - 40px);
    margin-right: 12px;
  }

  .ps-dashboard {
    left: 12%;
  }

  .ps-provision-widget {
    left: 3%;
    width: 190px;
  }

  .ps-earning-widget {
    right: 3%;
  }

}

/* =====================================
   RESPONSIVE — TABLETS
===================================== */

@media (max-width: 850px) {

  .ps-grid {
    grid-template-columns: 1fr;
  }

  .ps-hub-card {
    min-height: 560px;
  }

  .ps-training-card {
    min-height: 0;
  }

  .ps-content {
    padding: 26px 25px 0;
  }

  .ps-content h2 {
    font-size: 34px;
  }

  .ps-training-visual {
    display: grid;

    grid-template-columns:
      1.2fr
      1fr;

    grid-template-rows:
      1fr
      1fr;

    align-items: center;
    gap: 15px;

    min-height: 0;
    padding: 15px 24px 28px;
  }

  .ps-learning {
    grid-row: span 2;

    width: 100%;
    max-width: none;
    margin: 0;
  }

  .ps-resources,
  .ps-support-widget {
    width: 100%;
    max-width: none;
    margin: 0;
  }

  .ps-resources {
    align-self: end;
  }

  .ps-support-widget {
    align-self: start;
  }

}

/* =====================================
   RESPONSIVE — MOBILE
===================================== */

@media (max-width: 540px) {

  .ps-wrap {
    padding: 0 16px 48px;
  }

  .ps-card {
    min-height: 0;
    border-radius: 20px;
  }

  .ps-content {
    padding: 24px 22px 0;
  }

  .ps-content h2 {
    font-size: 30px;
  }

  .ps-content p {
    font-size: 15px;
    line-height: 1.6;
  }

  .ps-hub-visual {
    min-height: 340px;
  }

  .ps-dashboard {
    top: 15px;
    left: 12%;

    width: 580px;
    min-width: 580px;

    transform: scale(0.72);
    transform-origin: top left;
  }

  .ps-provision-widget {
    left: 12px;
    bottom: 20px;

    width: 208px;

    transform: scale(0.8);
    transform-origin: bottom left;
  }

  .ps-earning-widget {
    right: 10px;
    bottom: 13px;

    transform: scale(0.68);
    transform-origin: bottom right;
  }

  .ps-training-visual {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 12px;
    padding: 12px 20px 25px;
  }

  .ps-learning {
    max-width: 350px;
    padding: 16px;
  }

  .ps-resources {
    align-self: flex-start;
    width: 85%;
  }

  .ps-support-widget {
    align-self: flex-end;
    width: 88%;
  }

}

/* Smaller mobile screens */

@media (max-width: 380px) {

  .ps-content h2 {
    font-size: 27px;
  }

  .ps-content {
    padding: 22px 18px 0;
  }

  .ps-hub-visual {
    min-height: 310px;
  }

  .ps-dashboard {
    transform: scale(0.64);
  }

  .ps-provision-widget {
    transform: scale(0.72);
  }

  .ps-earning-widget {
    transform: scale(0.58);
  }

}

/* =====================================
   REDUCED MOTION ACCESSIBILITY
===================================== */

@media (prefers-reduced-motion: reduce) {

  .partner-support *,
  .partner-support *::before,
  .partner-support *::after {
    animation: none !important;
    transition: none !important;
  }

}
</style>
