
<template>
  <section
    ref="sectionEl"
    class="partner-value"
    :class="{ 'pv-revealed': revealed }"
    :style="{
      '--brand-color': currentBrand.color,
      '--brand-light': currentBrand.light
    }"
    aria-label="Saptivo partner benefits"
  >
    <div class="pv-wrap">
      <div class="pv-grid">

        <!-- WHITE-LABEL CRM -->

        <article class="pv-card pv-brand-card">

          <div class="pv-content">
            <h2>White-label CRM under your brand</h2>

            <p>
              Offer Saptivo as your own product, with your logo,
              colours and domain on the CRM and customer portal.
              Saptivo's white-label CRM option lets you build a
              recurring software line without a development team.
            </p>
          </div>

          <div class="pv-brand-visual" aria-hidden="true">

            <!-- Desktop CRM -->

            <div class="pv-desktop">

              <div class="pv-browser">
                <div class="pv-browser-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <div class="pv-address">
                  <svg viewBox="0 0 24 24">
                    <rect x="6" y="10" width="12" height="10" rx="2"/>
                    <path d="M9 10V7a3 3 0 0 1 6 0v3"/>
                  </svg>

                  <Transition name="pv-swap" mode="out-in">
                    <span :key="currentBrand.domain">
                      {{ currentBrand.domain }}
                    </span>
                  </Transition>
                </div>
              </div>

              <div class="pv-app">

                <!-- Sidebar -->

                <aside class="pv-sidebar">

                  <div class="pv-logo">
                    <span class="pv-logo-icon">
                      <svg viewBox="0 0 24 24">
                        <path :d="currentBrand.logo"/>
                      </svg>
                    </span>

                    <Transition name="pv-swap" mode="out-in">
                      <strong :key="currentBrand.name">
                        {{ currentBrand.name }}
                      </strong>
                    </Transition>
                  </div>

                  <span class="pv-menu-label">
                    WORKSPACE
                  </span>

                  <div
                    v-for="(item, i) in menu"
                    :key="item.name"
                    class="pv-menu-item"
                    :class="{ active: i === 0 }"
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        v-for="d in item.icon"
                        :key="d"
                        :d="d"
                      />
                    </svg>

                    {{ item.name }}
                  </div>

                  <div class="pv-sidebar-bottom">
                    <div class="pv-avatar">JD</div>

                    <div>
                      <strong>Jamie Davis</strong>
                      <small>Administrator</small>
                    </div>
                  </div>

                </aside>

                <!-- Dashboard -->

                <div class="pv-dashboard">

                  <div class="pv-dashboard-head">
                    <div>
                      <span class="pv-muted">
                        Workspace / Overview
                      </span>

                      <h3>Business overview</h3>
                    </div>

                    <div class="pv-date">
                      This month
                    </div>
                  </div>

                  <!-- Statistics -->

                  <div class="pv-stats">

                    <div
                      v-for="stat in animatedStats"
                      :key="stat.label"
                      class="pv-stat"
                    >
                      <span>{{ stat.label }}</span>

                      <div class="pv-stat-value">
                        <Transition
                          name="pv-number"
                          mode="out-in"
                        >
                          <strong :key="stat.value">
                            {{ stat.value }}
                          </strong>
                        </Transition>
                      </div>

                      <small>{{ stat.note }}</small>
                    </div>

                  </div>

                  <!-- Revenue chart -->

                  <div class="pv-chart">

                    <div class="pv-chart-head">
                      <div>
                        <strong>Sales performance</strong>
                        <span>Monthly overview</span>
                      </div>

                      <span class="pv-chart-key">
                        <i></i>
                        Revenue
                      </span>
                    </div>

                    <div class="pv-line-chart">

                      <div class="pv-chart-axis">
                        <span>60k</span>
                        <span>40k</span>
                        <span>20k</span>
                        <span>0</span>
                      </div>

                      <div class="pv-line-area">

                        <svg
                          viewBox="0 0 360 130"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              :id="chartGradientId"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                :stop-color="currentBrand.color"
                                stop-opacity=".30"
                              />

                              <stop
                                offset="100%"
                                :stop-color="currentBrand.color"
                                stop-opacity="0"
                              />
                            </linearGradient>
                          </defs>

                          <g
                            stroke="#e9edf2"
                            stroke-width="1"
                            stroke-dasharray="4 4"
                          >
                            <path d="M0 10H360"/>
                            <path d="M0 45H360"/>
                            <path d="M0 80H360"/>
                            <path d="M0 115H360"/>
                          </g>

                          <path
                            :key="'area-' + activeBrand"
                            class="pv-chart-area"
                            :d="currentBrand.chart + ' V130H0Z'"
                            :fill="`url(#${chartGradientId})`"
                          />

                          <path
                            :key="'line-' + activeBrand"
                            class="pv-chart-line"
                            :d="currentBrand.chart"
                            fill="none"
                            :stroke="currentBrand.color"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            pathLength="1"
                          />
                        </svg>

                        <div class="pv-chart-months">
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>Apr</span>
                          <span>May</span>
                          <span>Jun</span>
                        </div>

                      </div>
                    </div>
                  </div>

                  <!-- Recent contacts -->

                  <div class="pv-contacts">

                    <div class="pv-contacts-head">
                      <strong>Recent contacts</strong>
                      <span>View all</span>
                    </div>

                    <div class="pv-table-head">
                      <span>Name</span>
                      <span>Company</span>
                      <span>Status</span>
                    </div>

                    <div
                      v-for="client in clients"
                      :key="client.name"
                      class="pv-table-row"
                    >
                      <div class="pv-contact-name">
                        <span
                          class="pv-contact-avatar"
                          :style="{ background: client.color }"
                        >
                          {{ client.initial }}
                        </span>

                        {{ client.name }}
                      </div>

                      <span>{{ client.company }}</span>

                      <span class="pv-contact-status">
                        Active
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            <!-- Compact mobile portal -->

            <div class="pv-phone">

              <div class="pv-phone-frame">

                <div class="pv-phone-screen">

                  <div class="pv-phone-camera"></div>

                  <div class="pv-phone-status">
                    <strong>9:41</strong>

                    <div>
                      <svg viewBox="0 0 24 24">
                        <path d="M4 18v-4M9 18v-8M14 18V6M19 18V2"/>
                      </svg>

                      <svg viewBox="0 0 24 24">
                        <rect x="2" y="7" width="18" height="10" rx="2"/>
                        <path d="M22 10v4"/>
                      </svg>
                    </div>
                  </div>

                  <div class="pv-phone-brand">

                    <span class="pv-logo-icon">
                      <svg viewBox="0 0 24 24">
                        <path :d="currentBrand.logo"/>
                      </svg>
                    </span>

                    <Transition name="pv-swap" mode="out-in">
                      <strong :key="currentBrand.name">
                        {{ currentBrand.name }}
                      </strong>
                    </Transition>

                  </div>

                  <div class="pv-phone-welcome">
                    <span>Customer portal</span>
                    <h3>Welcome back.</h3>
                    <p>Manage your account in one place.</p>
                  </div>

                  <div class="pv-phone-account">
                    <span>Account status</span>

                    <strong>
                      <i></i>
                      Active
                    </strong>

                    <small>Your account is up to date.</small>
                  </div>

                  <div class="pv-phone-section-title">
                    Quick access
                  </div>

                  <div
                    v-for="item in portal"
                    :key="item.name"
                    class="pv-portal-item"
                  >
                    <span class="pv-portal-icon">
                      <svg viewBox="0 0 24 24">
                        <path
                          v-for="d in item.icon"
                          :key="d"
                          :d="d"
                        />
                      </svg>
                    </span>

                    <div>
                      <strong>{{ item.name }}</strong>
                      <small>{{ item.description }}</small>
                    </div>
                  </div>

                  <div class="pv-phone-home"></div>

                </div>
              </div>
            </div>

            <!-- Floating brand customization widget -->

            <div class="pv-brand-settings">

              <div class="pv-settings-head">

                <span class="pv-settings-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4 2 2 0 0 1 0-4h3a4 4 0 0 0 4-4c0-3-4-6-9-6Z"/>
                    <path d="M7 10h.01M10 6h.01M15 7h.01"/>
                  </svg>
                </span>

                <div>
                  <strong>Brand appearance</strong>
                  <small>Make it yours</small>
                </div>

              </div>

              <div class="pv-color-options">

                <span
                  v-for="(brand, i) in brands"
                  :key="brand.name"
                  class="pv-color-option"
                  :class="{ selected: activeBrand === i }"
                  :style="{ '--swatch': brand.color }"
                >
                  <svg
                    v-if="activeBrand === i"
                    viewBox="0 0 24 24"
                  >
                    <path d="m5 12 4 4L19 6"/>
                  </svg>
                </span>

              </div>

              <div class="pv-settings-status">
                <span class="pv-status-dot"></span>

                <Transition name="pv-swap" mode="out-in">
                  <span :key="currentBrand.name">
                    {{ currentBrand.name }} theme
                  </span>
                </Transition>
              </div>

            </div>

          </div>
        </article>

        <!-- TIERED WHOLESALE PRICING -->

        <article class="pv-card pv-pricing-card">

          <div class="pv-content">
            <h2>Tiered wholesale pricing</h2>

            <p>
              The more you sell, the bigger your wholesale
              discount. Pricing tiers rise with your monthly
              partner sales, so your margin grows as your
              client base grows.
            </p>
          </div>

          <div class="pv-pricing-visual" aria-hidden="true">

            <div class="pv-pricing-stack">

              <!-- Wholesale tier widget -->

              <div class="pv-widget pv-tier-widget">

                <div class="pv-widget-head">

                  <div class="pv-widget-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 19v-5M9 19V9M14 19V5M19 19V2"/>
                    </svg>
                  </div>

                  <div>
                    <h3>Wholesale pricing</h3>
                    <span>Partner sales tiers</span>
                  </div>

                </div>

                <div class="pv-tier-list">

                  <div
                    v-for="(tier, i) in tiers"
                    :key="tier.name"
                    class="pv-tier"
                    :class="{ 'tier-active': activeTier === i }"
                  >
                    <div class="pv-tier-head">
                      <strong>{{ tier.name }}</strong>
                      <span>{{ tier.label }}</span>
                    </div>

                    <div class="pv-tier-track">
                      <div
                        class="pv-tier-fill"
                        :style="{
                          width: tier.width + '%',
                          '--tier-index': i
                        }"
                      ></div>
                    </div>
                  </div>

                </div>

                <div class="pv-tier-footer">

                  <span class="pv-tier-dot"></span>

                  <Transition name="pv-swap" mode="out-in">
                    <span :key="activeTier">
                      {{ tiers[activeTier].name }} highlighted
                    </span>
                  </Transition>

                </div>

              </div>

              <!-- Monthly sales chart -->

              <div class="pv-widget pv-sales-widget">

                <span class="pv-sales-label">
                  Monthly partner sales
                </span>

                <h3>Growing margins</h3>

                <div class="pv-sales-caption">
                  <span class="pv-sales-indicator"></span>
                  Higher sales. Bigger discounts.
                </div>

                <div class="pv-sales-chart">

                  <div class="pv-sales-grid">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>

                  <div class="pv-sales-bars">

                    <span
                      v-for="(bar, i) in currentBars"
                      :key="i"
                      :style="{
                        height: bar + '%',
                        '--bar-index': i
                      }"
                    ></span>

                  </div>
                </div>

                <div class="pv-sales-months">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>

              </div>

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
  computed,
  useId,
  onMounted,
  onBeforeUnmount
} from 'vue'

defineOptions({
  name: 'PartnerValueCards'
})

const chartGradientId = `pv-chart-${useId()}`

const sectionEl = ref(null)
const revealed = ref(false)

const activeBrand = ref(0)
const activeTier = ref(0)
const activeChart = ref(0)

/* =====================================
   BRAND CUSTOMIZATION
===================================== */

const brands = [
  {
    name: 'Studio North',
    domain: 'crm.studionorth.com',
    color: '#e69b68',
    light: '#fff0e4',
    contacts: '128',
    deals: '36',
    revenue: '$24.8k',
    logo: 'm12 3 9 9-9 9-9-9Z M8 12l4-4 4 4-4 4Z',
    chart: `
      M0 108
      C20 108 28 88 50 90
      S80 105 100 80
      S130 68 150 76
      S180 45 200 52
      S230 65 250 38
      S280 50 300 30
      S340 38 360 18
    `
  },
  {
    name: 'Nova Group',
    domain: 'crm.novagroup.com',
    color: '#8ca7bf',
    light: '#edf3f8',
    contacts: '246',
    deals: '58',
    revenue: '$38.6k',
    logo: 'M12 3 21 20H3Z M12 10l4 7H8Z',
    chart: `
      M0 110
      C20 95 28 100 50 80
      S80 90 100 65
      S130 75 150 48
      S180 62 200 35
      S230 50 250 25
      S280 40 300 18
      S340 30 360 9
    `
  },
  {
    name: 'Bloom Digital',
    domain: 'crm.bloomdigital.com',
    color: '#83ad96',
    light: '#eaf4ed',
    contacts: '384',
    deals: '72',
    revenue: '$52.4k',
    logo: 'M12 12C2 12 2 3 8 4c4 0 4 8 4 8ZM12 12c0-10 9-10 8-4 0 4-8 4-8 4ZM12 12c10 0 10 9 4 8-4 0-4-8-4-8ZM12 12c0 10-9 10-8 4 0-4 8-4 8-4Z',
    chart: `
      M0 100
      C20 95 28 72 50 78
      S80 88 100 60
      S130 65 150 42
      S180 55 200 30
      S230 42 250 20
      S280 35 300 12
      S340 22 360 3
    `
  }
]

const currentBrand = computed(
  () => brands[activeBrand.value]
)

const animatedStats = computed(() => [
  {
    label: 'Total contacts',
    value: currentBrand.value.contacts,
    note: 'This month'
  },
  {
    label: 'Active deals',
    value: currentBrand.value.deals,
    note: 'In progress'
  },
  {
    label: 'Revenue',
    value: currentBrand.value.revenue,
    note: 'Monthly revenue'
  }
])

/* =====================================
   DASHBOARD DATA
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
    name: 'Contacts',
    icon: [
      'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
      'M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8'
    ]
  },
  {
    name: 'Sales pipeline',
    icon: [
      'M3 3h18v18H3Z',
      'M9 3v18M15 3v18'
    ]
  },
  {
    name: 'Quotations',
    icon: [
      'M6 3h9l4 4v14H6Z',
      'M9 12h7M9 16h7'
    ]
  },
  {
    name: 'Invoices',
    icon: [
      'M5 3h14v18l-4-2-3 2-3-2-4 2Z',
      'M8 8h8M8 12h8'
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

const clients = [
  {
    name: 'Alex Morgan',
    company: 'Studio North',
    initial: 'AM',
    color: '#fbe6d8'
  },
  {
    name: 'Sarah Wilson',
    company: 'Bright Retail',
    initial: 'SW',
    color: '#e1eaf3'
  },
  {
    name: 'Daniel Lee',
    company: 'Nova Group',
    initial: 'DL',
    color: '#e1f0e7'
  }
]

const portal = [
  {
    name: 'My invoices',
    description: 'View your invoices',
    icon: [
      'M6 3h12v18H6Z',
      'M9 8h6M9 12h6M9 16h4'
    ]
  },
  {
    name: 'My quotations',
    description: 'Review quotations',
    icon: [
      'M5 3h10l4 4v14H5Z',
      'M9 12h6M9 16h6'
    ]
  },
  {
    name: 'Support',
    description: 'Get help anytime',
    icon: [
      'M4 13v-2a8 8 0 0 1 16 0v2',
      'M4 12h4v7H4ZM16 12h4v7h-4Z'
    ]
  }
]

/* =====================================
   WHOLESALE PRICING DATA
===================================== */

const tiers = [
  {
    name: 'Starter tier',
    label: 'Base discount',
    width: 32
  },
  {
    name: 'Growth tier',
    label: 'Higher discount',
    width: 65
  },
  {
    name: 'Advanced tier',
    label: 'Greater savings',
    width: 100
  }
]

const chartSets = [
  [
    9, 14, 19, 26, 32, 24,
    36, 43, 29, 38, 48, 58,
    45, 65, 83, 100, 72, 58,
    47, 54, 63, 71, 84, 79,
    91, 76, 65, 70, 59, 68
  ],
  [
    15, 22, 30, 25, 38, 42,
    30, 48, 39, 54, 61, 48,
    65, 78, 67, 89, 100, 81,
    63, 72, 80, 69, 88, 92,
    76, 85, 92, 80, 89, 95
  ],
  [
    20, 29, 25, 38, 45, 36,
    48, 56, 42, 60, 68, 59,
    76, 69, 88, 80, 95, 88,
    76, 85, 92, 80, 95, 88,
    100, 89, 94, 86, 97, 100
  ]
]

const currentBars = computed(
  () => chartSets[activeChart.value]
)

/* =====================================
   ANIMATION CONTROLLER
===================================== */

let observer = null
let brandTimer = null
let pricingTimer = null
let motionQuery = null
let isVisible = false

function startAnimations() {
  if (
    !isVisible ||
    document.hidden ||
    motionQuery?.matches
  ) return

  if (brandTimer === null) {
    brandTimer = window.setInterval(() => {
      activeBrand.value =
        (activeBrand.value + 1) % brands.length
    }, 4500)
  }

  if (pricingTimer === null) {
    pricingTimer = window.setInterval(() => {
      activeTier.value =
        (activeTier.value + 1) % tiers.length

      activeChart.value =
        (activeChart.value + 1) % chartSets.length
    }, 3500)
  }
}

function stopAnimations() {
  window.clearInterval(brandTimer)
  window.clearInterval(pricingTimer)

  brandTimer = null
  pricingTimer = null
}

function syncAnimations() {
  if (
    !isVisible ||
    document.hidden ||
    motionQuery?.matches
  ) {
    stopAnimations()
  } else {
    startAnimations()
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
      { threshold: 0.1 }
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

.partner-value,
.partner-value * {
  box-sizing: border-box;
}

.partner-value {
  --brand-color: #e69b68;
  --brand-light: #fff0e4;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);

  width: 100%;
  background: #ffffff;
  color: #192331;
  font-family: 'Urbanist', system-ui, sans-serif;
}

.pv-wrap {
  max-width: 1440px;
  margin: 0 auto;

  padding: clamp(40px, 6vw, 90px)
           clamp(16px, 3vw, 36px);
}

/* =====================================
   TWO-CARD GRID
===================================== */

.pv-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  align-items: stretch;
  gap: 16px;
}

.pv-card {
  position: relative;
  isolation: isolate;

  display: flex;
  flex-direction: column;

  min-width: 0;
  min-height: 590px;

  border-radius: 22px;
  overflow: hidden;
}

/* =====================================
   NEW SAPTIVO PASTEL BACKGROUNDS
===================================== */

/* Peach + cream + pastel orange */

.pv-brand-card {
  background:
    radial-gradient(
      ellipse at 95% 5%,
      #fff9f0 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse at 0% 100%,
      #edbfa6 0%,
      transparent 65%
    ),
    linear-gradient(
      135deg,
      #fff7ec 0%,
      #f9ddc8 35%,
      #f1d3bd 70%,
      #e9c4b1 100%
    );

  border: 1px solid #efded1;
}

/* Sage green + mint + powder blue */

.pv-pricing-card {
  background:
    radial-gradient(
      ellipse at 100% 0%,
      #f8f9ef 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse at 100% 100%,
      #c6dce3 0%,
      transparent 65%
    ),
    linear-gradient(
      145deg,
      #f4f7ed 0%,
      #dce9df 35%,
      #d1e3dc 70%,
      #c6dce3 100%
    );

  border: 1px solid #dce6de;
}

/* =====================================
   CARD CONTENT
===================================== */

.pv-content {
  position: relative;
  z-index: 3;
  padding: 30px 30px 0;
  background: transparent;
}

.partner-value .pv-content h2 {
  margin: 0;

  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(26px, 2.5vw, 36px);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.04em;

  color: #202020;
}

.partner-value .pv-content p {
  max-width: 65ch;
  margin: 14px 0 0;

  font-size: 15px;
  font-weight: 500;
  line-height: 1.65;

  color: #515650;
}

/* =====================================
   WHITE-LABEL VISUAL
===================================== */

.pv-brand-visual {
  position: relative;
  flex: 1;

  min-height: 420px;
  margin-top: 16px;

  overflow: hidden;
  background: transparent;
}

/* =====================================
   DESKTOP CRM
===================================== */

.pv-desktop {
  position: absolute;

  top: 35px;
  left: 34%;

  width: 88%;
  min-width: 510px;
  height: 440px;

  background: #ffffff;
  border: 1px solid #e6e9ef;
  border-radius: 12px 12px 0 0;

  box-shadow:
    0 15px 45px rgba(90, 62, 40, 0.10);

  overflow: hidden;
}

/* Browser toolbar */

.pv-browser {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 35px;
  padding: 0 16px;

  background: #f9fafc;
  border-bottom: 1px solid #e9edf2;
}

.pv-browser-dots {
  position: absolute;
  left: 16px;

  display: flex;
  gap: 5px;
}

.pv-browser-dots i {
  width: 7px;
  height: 7px;

  border-radius: 50%;
  background: #d9dfe8;
}

.pv-address {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  width: 54%;
  height: 22px;

  background: #ffffff;
  border: 1px solid #e8ebf1;
  border-radius: 20px;

  font-size: 9px;
  font-weight: 600;
  color: #748092;
}

.pv-address svg {
  width: 10px;
  height: 10px;

  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.pv-app {
  display: grid;
  grid-template-columns: 135px minmax(0, 1fr);
  height: calc(100% - 35px);
}

/* =====================================
   DASHBOARD SIDEBAR
===================================== */

.pv-sidebar {
  position: relative;
  padding: 17px 10px;

  background: #fafbfc;
  border-right: 1px solid #edf0f5;
}

.pv-logo {
  display: flex;
  align-items: center;
  gap: 6px;

  min-height: 26px;
  padding: 0 3px;
}

.pv-logo strong {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.04em;
  white-space: nowrap;
  color: #17283d;
}

.pv-logo-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 25px;
  height: 25px;

  background: var(--brand-color);
  color: #ffffff;
  border-radius: 7px;

  transition: background-color 0.9s var(--ease);
}

.pv-logo-icon svg {
  width: 16px;
  height: 16px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linejoin: round;
}

.pv-menu-label {
  display: block;
  margin: 24px 0 10px 8px;

  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9ba4b1;
}

.pv-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 9px 8px;
  margin-bottom: 3px;

  border-radius: 6px;

  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  color: #657184;
}

.pv-menu-item.active {
  background: var(--brand-light);
  color: var(--brand-color);

  transition:
    background-color 0.9s var(--ease),
    color 0.9s var(--ease);
}

.pv-menu-item svg {
  flex-shrink: 0;
  width: 13px;
  height: 13px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pv-sidebar-bottom {
  position: absolute;

  left: 10px;
  right: 10px;
  bottom: 15px;

  display: flex;
  align-items: center;
  gap: 7px;

  padding-top: 12px;
  border-top: 1px solid #e8ecf1;
}

.pv-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 27px;
  height: 27px;

  border-radius: 50%;
  background: #f6e5d8;

  font-size: 9px;
  font-weight: 700;
  color: #a77b60;
}

.pv-sidebar-bottom strong {
  display: block;
  font-size: 9px;
  color: #334155;
}

.pv-sidebar-bottom small {
  display: block;
  margin-top: 3px;

  font-size: 8px;
  color: #8d96a5;
}

/* =====================================
   DASHBOARD CONTENT
===================================== */

.pv-dashboard {
  min-width: 0;
  padding: 17px 16px;
  background: #ffffff;
}

.pv-dashboard-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}

.pv-muted {
  display: block;
  font-size: 9px;
  font-weight: 500;
  color: #8b95a5;
}

.pv-dashboard-head h3 {
  margin: 6px 0 0;

  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: #17283d;
}

.pv-date {
  padding: 6px 9px;

  border: 1px solid #e5eaf0;
  border-radius: 5px;

  font-size: 9px;
  color: #697587;
  white-space: nowrap;
}

/* Statistics */

.pv-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 9px;
  margin-top: 14px;
}

.pv-stat {
  min-width: 0;
  padding: 10px;

  border: 1px solid #e5eaf0;
  border-radius: 8px;
  background: #ffffff;
}

.pv-stat > span {
  display: block;
  font-size: 9px;
  color: #748092;
}

.pv-stat-value {
  display: flex;
  align-items: center;

  height: 28px;
  margin-top: 5px;
  overflow: hidden;
}

.pv-stat-value strong {
  display: block;

  font-size: 22px;
  font-weight: 750;
  letter-spacing: -0.05em;
  color: #17283d;
  white-space: nowrap;
}

.pv-stat > small {
  display: block;
  margin-top: 5px;

  font-size: 8px;
  color: #54896d;
}

/* =====================================
   REVENUE CHART
===================================== */

.pv-chart {
  margin-top: 10px;
  padding: 12px;

  border: 1px solid #e5eaf0;
  border-radius: 8px;
}

.pv-chart-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pv-chart-head strong {
  display: block;

  font-size: 12px;
  font-weight: 700;
  color: #26364a;
}

.pv-chart-head div > span {
  display: block;
  margin-top: 4px;

  font-size: 9px;
  color: #8b95a5;
}

.pv-chart-key {
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 9px;
  color: #657184;
}

.pv-chart-key i {
  width: 6px;
  height: 6px;

  border-radius: 50%;
  background: var(--brand-color);

  transition: background-color 0.9s ease;
}

.pv-line-chart {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.pv-chart-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100px;

  font-size: 8px;
  color: #929cab;
}

.pv-line-area {
  flex: 1;
  min-width: 0;
}

.pv-line-area svg {
  display: block;

  width: 100%;
  height: 100px;
  overflow: visible;
}

.pv-chart-line {
  transition: stroke 0.8s ease;
}

.pv-chart-months {
  display: flex;
  justify-content: space-between;

  margin-top: 7px;

  font-size: 8px;
  color: #929cab;
}

/* =====================================
   CONTACT TABLE
===================================== */

.pv-contacts {
  margin-top: 10px;
  padding: 10px;

  border: 1px solid #e5eaf0;
  border-radius: 8px;
}

.pv-contacts-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pv-contacts-head strong {
  font-size: 12px;
  color: #26364a;
}

.pv-contacts-head > span {
  font-size: 9px;
  color: var(--brand-color);

  transition: color 0.8s ease;
}

.pv-table-head,
.pv-table-row {
  display: grid;
  grid-template-columns: 1.3fr 1fr .6fr;
  align-items: center;
  gap: 5px;
}

.pv-table-head {
  margin-top: 10px;
  padding: 7px 5px;

  background: #f7f8fa;
  font-size: 8px;
  color: #8b95a5;
}

.pv-table-row {
  padding: 6px 5px;
  border-bottom: 1px solid #f0f2f5;

  font-size: 9px;
  color: #526073;
}

.pv-contact-name {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pv-contact-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 22px;
  height: 22px;

  border-radius: 50%;
  font-size: 8px;
  font-weight: 700;
}

.pv-contact-status {
  justify-self: start;
  padding: 4px 7px;

  border-radius: 4px;
  background: #eaf5ed;

  font-size: 8px;
  color: #4e8a60;
}

/* =====================================
   COMPACT MOBILE PHONE
===================================== */

.pv-phone {
  position: absolute;
  z-index: 2;

  top: 48px;
  left: 6%;

  width: 25%;
  max-width: 185px;
  min-width: 155px;

  padding: 5px 5px 9px;

  border: 1px solid #f6eae1;
  border-radius: 27px;

  background: linear-gradient(
    145deg,
    #ffffff,
    #eee1d8
  );

  box-shadow:
    0 5px 0 #dbc4b5,
    0 10px 0 #ead5c7,
    0 20px 35px rgba(90, 62, 40, 0.12);
}

.pv-phone-frame {
  padding: 6px;
  border-radius: 23px;
  background: #111111;
}

.pv-phone-screen {
  position: relative;

  min-height: 0;
  padding: 10px 9px 18px;

  border-radius: 17px;
  background: #ffffff;
  overflow: hidden;
}

.pv-phone-camera {
  position: absolute;
  top: 4px;
  left: 50%;

  transform: translateX(-50%);

  width: 40px;
  height: 9px;

  border-radius: 12px;
  background: #111111;
}

.pv-phone-status {
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 8px;
  color: #26364a;
}

.pv-phone-status > div {
  display: flex;
  gap: 3px;
}

.pv-phone-status svg {
  width: 10px;
  height: 10px;

  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.pv-phone-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 20px;
  margin-top: 13px;
}

.pv-phone-brand strong {
  font-size: 11px;
  font-weight: 800;
  color: #17283d;
  white-space: nowrap;
}

.pv-phone-brand .pv-logo-icon {
  width: 19px;
  height: 19px;
}

.pv-phone-brand .pv-logo-icon svg {
  width: 13px;
  height: 13px;
}

.pv-phone-welcome {
  margin-top: 12px;
  text-align: center;
}

.pv-phone-welcome > span {
  font-size: 8px;
  color: #8490a0;
}

.pv-phone-welcome h3 {
  margin: 4px 0 0;

  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #17283d;
}

.pv-phone-welcome p {
  margin: 4px 0 0;

  font-size: 8px;
  line-height: 1.3;
  color: #748092;
}

.pv-phone-account {
  margin-top: 10px;
  padding: 9px;

  border: 1px solid var(--brand-light);
  border-radius: 7px;
  background: var(--brand-light);

  transition:
    background-color 0.9s var(--ease),
    border-color 0.9s var(--ease);
}

.pv-phone-account > span {
  display: block;
  font-size: 8px;
  color: #777781;
}

.pv-phone-account strong {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 4px;

  font-size: 14px;
  color: #17283d;
}

.pv-phone-account strong i {
  width: 6px;
  height: 6px;

  border-radius: 50%;
  background: #79b394;
}

.pv-phone-account small {
  display: block;
  margin-top: 4px;

  font-size: 7px;
  color: #777781;
}

.pv-phone-section-title {
  margin-top: 10px;

  font-size: 9px;
  font-weight: 700;
  color: #344054;
}

.pv-portal-item {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 0;
  border-bottom: 1px solid #edf0f4;
}

.pv-portal-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 22px;
  height: 22px;

  border-radius: 5px;
  background: #f5f6f8;
  color: #64748b;
}

.pv-portal-icon svg {
  width: 11px;
  height: 11px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pv-portal-item strong {
  display: block;
  font-size: 9px;
  color: #344054;
}

.pv-portal-item small {
  display: block;
  margin-top: 2px;

  font-size: 7px;
  color: #8b95a5;
}

.pv-phone-home {
  position: absolute;

  bottom: 5px;
  left: 50%;

  transform: translateX(-50%);

  width: 40px;
  height: 3px;

  border-radius: 4px;
  background: #242424;
}

/* =====================================
   FLOATING BRAND SETTINGS
===================================== */

.pv-brand-settings {
  position: absolute;
  z-index: 4;

  left: 26%;
  bottom: 22px;

  width: 175px;
  padding: 12px;

  background: rgba(255, 255, 255, 0.97);
  border: 1px solid #eee5dc;
  border-radius: 12px;

  box-shadow:
    0 12px 30px rgba(90, 62, 40, 0.10);
}

.pv-settings-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pv-settings-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 30px;
  height: 30px;

  border-radius: 7px;
  background: var(--brand-light);
  color: var(--brand-color);

  transition:
    background-color 0.8s ease,
    color 0.8s ease;
}

.pv-settings-icon svg {
  width: 17px;
  height: 17px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pv-settings-head strong {
  display: block;
  font-size: 11px;
  color: #253246;
}

.pv-settings-head small {
  display: block;
  margin-top: 3px;

  font-size: 9px;
  color: #8c95a2;
}

.pv-color-options {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 13px;
}

.pv-color-option {
  display: grid;
  place-items: center;

  width: 24px;
  height: 24px;

  background: var(--swatch);
  border-radius: 50%;

  outline: 1px solid transparent;
  outline-offset: 3px;

  transition:
    outline-color 0.4s ease,
    transform 0.4s var(--ease);
}

.pv-color-option.selected {
  outline-color: var(--swatch);
  transform: scale(1.08);
}

.pv-color-option svg {
  width: 13px;
  height: 13px;

  fill: none;
  stroke: #ffffff;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pv-settings-status {
  display: flex;
  align-items: center;
  gap: 6px;

  min-height: 14px;
  margin-top: 12px;

  font-size: 9px;
  font-weight: 600;
  color: #687484;
}

.pv-status-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;
  background: #88b79c;
}

/* =====================================
   WHOLESALE PRICING VISUAL
===================================== */

.pv-pricing-visual {
  position: relative;
  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 420px;
  margin-top: 16px;

  background: transparent;
  overflow: hidden;
}

.pv-pricing-stack {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  gap: 12px;

  width: 100%;
  max-width: 350px;

  padding: 16px 24px 24px;
}

.pv-widget {
  min-width: 0;
  padding: 15px;

  background: #ffffff;
  border: 1px solid #e5ede8;
  border-radius: 12px;

  box-shadow:
    0 12px 30px rgba(45, 80, 65, 0.08);
}

.pv-widget-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pv-widget-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 35px;
  height: 35px;

  border: 1px solid #dce9e0;
  border-radius: 7px;

  background: #f0f6f1;
  color: #729c85;
}

.pv-widget-icon svg {
  width: 20px;
  height: 20px;

  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.pv-widget-head h3 {
  margin: 0;

  font-size: 14px;
  font-weight: 700;
  color: #17283d;
}

.pv-widget-head div > span {
  display: block;
  margin-top: 4px;

  font-size: 11px;
  color: #7b8798;
}

/* =====================================
   PRICING TIERS
===================================== */

.pv-tier-list {
  display: flex;
  flex-direction: column;
  gap: 7px;

  margin-top: 12px;
}

.pv-tier {
  padding: 6px 8px;

  border: 1px solid transparent;
  border-radius: 7px;

  transition:
    background-color 0.7s var(--ease),
    border-color 0.7s var(--ease);
}

.pv-tier.tier-active {
  background: #f1f7f2;
  border-color: #dce9df;
}

.pv-tier-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.pv-tier-head strong {
  font-size: 11px;
  font-weight: 700;
  color: #26364a;
}

.pv-tier-head > span {
  font-size: 9px;
  color: #8a94a3;
}

.pv-tier-track {
  height: 7px;
  margin-top: 8px;

  background: #edf2ee;
  border-radius: 4px;
  overflow: hidden;
}

.pv-tier-fill {
  height: 100%;
  border-radius: inherit;

  background: linear-gradient(
    90deg,
    #83ad96 0%,
    #a8c9b5 55%,
    #c3dcd1 100%
  );

  transform-origin: left center;
  opacity: 0.65;

  transition: opacity 0.7s ease;
}

.pv-tier.tier-active .pv-tier-fill {
  opacity: 1;
}

.pv-tier-footer {
  display: flex;
  align-items: center;
  gap: 6px;

  min-height: 14px;
  margin-top: 10px;
  padding-top: 10px;

  border-top: 1px solid #e6eee8;

  font-size: 10px;
  font-weight: 600;
  color: #658b75;
}

.pv-tier-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;
  background: #83ad96;
}

/* =====================================
   MONTHLY SALES CHART
===================================== */

.pv-sales-label {
  display: block;

  font-size: 11px;
  font-weight: 500;
  color: #7b8798;
}

.pv-sales-widget h3 {
  margin: 6px 0 0;

  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: #17283d;
}

.pv-sales-caption {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 7px;

  font-size: 9px;
  color: #718096;
}

.pv-sales-indicator {
  width: 6px;
  height: 6px;

  border-radius: 50%;
  background: #83ad96;
}

.pv-sales-chart {
  position: relative;

  height: 105px;
  margin-top: 15px;
}

.pv-sales-grid {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.pv-sales-grid i {
  width: 100%;
  border-bottom: 1px dashed #e7eee9;
}

.pv-sales-bars {
  position: relative;
  z-index: 1;

  display: flex;
  align-items: flex-end;
  gap: 3px;

  width: 100%;
  height: 100%;
}

.pv-sales-bars span {
  flex: 1;
  min-width: 2px;

  background: #a9c9b7;
  border-radius: 2px 2px 0 0;

  transform-origin: center bottom;

  transition:
    height 1.4s var(--ease),
    background-color 0.8s ease;

  transition-delay:
    calc(var(--bar-index, 0) * 0.015s);
}

.pv-sales-bars span:nth-child(3n) {
  background: #83ad96;
}

.pv-sales-bars span:nth-child(5n) {
  background: #c2d9cf;
}

.pv-sales-months {
  display: flex;
  justify-content: space-between;

  margin-top: 8px;

  font-size: 8px;
  color: #8b95a5;
}

/* =====================================
   TEXT TRANSITIONS
===================================== */

.pv-swap-enter-active,
.pv-swap-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.4s var(--ease);
}

.pv-swap-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.pv-swap-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.pv-number-enter-active,
.pv-number-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.4s var(--ease);
}

.pv-number-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.pv-number-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* =====================================
   SCROLL REVEAL ANIMATIONS
===================================== */

.pv-revealed .pv-card {
  animation:
    pv-card-reveal 0.95s var(--ease) both;
}

.pv-revealed .pv-pricing-card {
  animation-delay: 0.12s;
}

@keyframes pv-card-reveal {
  from {
    opacity: 0;
    translate: 0 25px;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

/* Desktop entrance */

.pv-revealed .pv-desktop {
  animation:
    pv-desktop-reveal 1.4s var(--ease)
    0.2s both;
}

@keyframes pv-desktop-reveal {
  from {
    opacity: 0;
    translate: 45px 18px;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

/* Mobile entrance */

.pv-revealed .pv-phone {
  animation:
    pv-phone-reveal 1.4s var(--ease)
    0.35s both;
}

@keyframes pv-phone-reveal {
  from {
    opacity: 0;
    translate: -15px 35px;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

/* Widget entrance */

.pv-revealed .pv-brand-settings {
  animation:
    pv-widget-reveal 1.1s var(--ease)
    0.85s both;
}

.pv-revealed .pv-tier-widget {
  animation:
    pv-widget-reveal 1.1s var(--ease)
    0.35s both;
}

.pv-revealed .pv-sales-widget {
  animation:
    pv-widget-reveal 1.1s var(--ease)
    0.55s both;
}

@keyframes pv-widget-reveal {
  from {
    opacity: 0;
    translate: 0 30px;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

/* =====================================
   CHART ANIMATIONS
===================================== */

.pv-revealed .pv-chart-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 0;

  animation:
    pv-draw-line 1.8s var(--ease) both;
}

@keyframes pv-draw-line {
  from {
    stroke-dashoffset: 1;
  }

  to {
    stroke-dashoffset: 0;
  }
}

.pv-revealed .pv-chart-area {
  animation:
    pv-area-reveal 1.6s ease both;
}

@keyframes pv-area-reveal {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Wholesale progress bars */

.pv-revealed .pv-tier-fill {
  animation:
    pv-tier-grow 1.5s var(--ease) both;

  animation-delay:
    calc(0.8s + var(--tier-index, 0) * 0.2s);
}

@keyframes pv-tier-grow {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

/* Sales bar chart */

.pv-revealed .pv-sales-bars span {
  animation:
    pv-bar-grow 1.2s var(--ease) both;

  animation-delay:
    calc(0.8s + var(--bar-index, 0) * 0.035s);
}

@keyframes pv-bar-grow {
  from {
    transform: scaleY(0);
    opacity: 0.3;
  }

  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

/* =====================================
   TABLET RESPONSIVE
===================================== */

@media (max-width: 1100px) {

  .pv-card {
    min-height: 590px;
  }

  .pv-content {
    padding: 25px 22px 0;
  }

  .partner-value .pv-content h2 {
    font-size: 29px;
  }

  .partner-value .pv-content p {
    font-size: 14px;
  }

  .pv-phone {
    left: 4%;
    min-width: 145px;
  }

  .pv-desktop {
    left: 34%;
  }

  .pv-pricing-stack {
    padding: 16px;
  }

  .pv-widget {
    padding: 14px;
  }

  .pv-sales-bars {
    gap: 2px;
  }

  .pv-brand-settings {
    left: 25%;
  }
}

/* =====================================
   SMALL TABLET
===================================== */

@media (max-width: 850px) {

  .pv-grid {
    grid-template-columns: 1fr;
  }

  .pv-card {
    min-height: 560px;
  }

  .pv-content {
    padding: 26px 25px 0;
  }

  .partner-value .pv-content h2 {
    font-size: 34px;
  }

  .pv-desktop {
    left: 34%;
    width: 80%;
  }

  .pv-phone {
    left: 7%;
    width: 25%;
    max-width: 185px;
  }

  .pv-brand-settings {
    left: 28%;
  }

  .pv-pricing-card {
    min-height: 0;
  }

  .pv-pricing-visual {
    min-height: 340px;
  }

  .pv-pricing-stack {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;

    max-width: 680px;
    padding: 24px;
  }
}

/* =====================================
   MOBILE RESPONSIVE
===================================== */

@media (max-width: 540px) {

  .pv-wrap {
    padding: 48px 16px;
  }

  .pv-grid {
    gap: 16px;
  }

  .pv-card {
    min-height: 0;
    border-radius: 18px;
  }

  .pv-content {
    padding: 24px 22px 0;
  }

  .partner-value .pv-content h2 {
    font-size: 30px;
  }

  .partner-value .pv-content p {
    font-size: 15px;
    line-height: 1.6;
  }

  .pv-brand-visual {
    min-height: 310px;
    margin-top: 15px;
  }

  .pv-desktop {
    top: 25px;
    left: 39%;

    width: 510px;
    height: 440px;

    transform: scale(0.72);
    transform-origin: top left;
  }

  .pv-phone {
    top: 25px;
    left: 5%;

    width: 165px;
    min-width: 165px;

    transform: scale(0.78);
    transform-origin: top left;
  }

  .pv-brand-settings {
    left: 30%;
    bottom: 14px;

    transform: scale(0.75);
    transform-origin: bottom left;
  }

  .pv-pricing-visual {
    min-height: 420px;
  }

  .pv-pricing-stack {
    display: flex;
    flex-direction: column;

    max-width: 340px;
    padding: 20px;
  }

  .pv-widget {
    width: 100%;
    padding: 15px;
  }
}

/* =====================================
   REDUCED MOTION ACCESSIBILITY
===================================== */

@media (prefers-reduced-motion: reduce) {

  .partner-value *,
  .partner-value *::before,
  .partner-value *::after {
    animation: none !important;
    transition: none !important;
  }

}
</style>
