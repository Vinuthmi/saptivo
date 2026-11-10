
<template>
  <section ref="rootEl" class="wis" aria-labelledby="wis-title">
    <div class="wis-wrap">

      <!-- Section heading -->
      <header class="wis-heading">

        <h2 id="wis-title">
          Why choose an <em>industry-specific CRM?</em>
        </h2>

        <p>
          Your business isn't generic. Your CRM shouldn't be either.
          Get the fields, workflows and reports your industry already
          understands.
        </p>
      </header>

      <!-- Main interactive panel -->
      <div class="wis-panel">

        <!-- LEFT: Dynamic industry preview -->
        <div class="wis-visual">

          <div class="wis-visual-top">
            <div class="wis-brand">
              <span class="wis-brand-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="4"
                    stroke="currentColor" stroke-width="1.7"/>
                  <path d="M8 12h8M12 8v8"
                    stroke="currentColor" stroke-width="1.7"
                    stroke-linecap="round"/>
                </svg>
              </span>
              <span>
                <b>Saptivo CRM</b>
                <small>Industry workspace</small>
              </span>
            </div>

            <span class="wis-live">
              <i></i> Industry configured
            </span>
          </div>

          <!-- Dynamic preview -->
          <div class="wis-demo">

            <div class="wis-demo-heading">
              <div>
                <span class="wis-demo-label">YOUR WORKSPACE</span>
                <h3>{{ current.previewTitle }}</h3>
              </div>

              <span class="wis-demo-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path :d="current.iconPath"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>
                </svg>
              </span>
            </div>

            <!-- Metric cards -->
            <div class="wis-metrics">
              <div v-for="metric in current.metrics"
                :key="metric.label"
                class="wis-metric">
                <span>{{ metric.label }}</span>
                <strong>{{ metric.value }}</strong>
                <small>{{ metric.note }}</small>
              </div>
            </div>

            <!-- Dynamic industry-specific data -->
            <div class="wis-data-card">
              <div class="wis-data-head">
                <div>
                  <b>{{ current.dataTitle }}</b>
                  <small>{{ current.dataSubtitle }}</small>
                </div>
                <span class="wis-data-menu">•••</span>
              </div>

              <div class="wis-data-list">
                <div class="wis-data-row wis-data-header">
                  <span>{{ current.columns[0] }}</span>
                  <span>{{ current.columns[1] }}</span>
                  <span>{{ current.columns[2] }}</span>
                </div>

                <div v-for="(row, index) in current.rows"
                  :key="row[0]"
                  class="wis-data-row"
                  :style="{ '--row': index }">
                  <span class="wis-row-name">{{ row[0] }}</span>
                  <span>{{ row[1] }}</span>
                  <span class="wis-row-status">
                    <i></i>{{ row[2] }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Industry-specific field -->
            <div class="wis-special">
              <div class="wis-special-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5L10 17L19 7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>
                </svg>
              </div>

              <div>
                <small>INDUSTRY-SPECIFIC FIELD</small>
                <b>{{ current.specialField }}</b>
              </div>

              <span class="wis-special-badge">Configured</span>
            </div>
          </div>

          <!-- Visual footer -->
          <div class="wis-visual-footer">
            <span>
              <i></i> {{ current.footerText }}
            </span>
            <span class="wis-footer-brand">SAPTIVO</span>
          </div>

        </div>

        <!-- RIGHT: Industry accordion -->
        <div class="wis-options">

          <div class="wis-options-heading">
            <span class="wis-options-label">ONE CRM. FOUR INDUSTRIES.</span>
            <h3>Designed around how you work.</h3>
            <p>
              Select your industry to see the fields, stages and
              information that matter to your business.
            </p>
          </div>

          <div class="wis-list" role="group" aria-label="Industry examples">

            <article
              v-for="(item, index) in industries"
              :key="item.id"
              class="wis-item"
              :class="{ active: active === index }"
              :style="{ '--i': index }"
            >
              <button
                class="wis-item-button"
                type="button"
                :aria-expanded="active === index"
                @click="select(index)"
              >
                <span class="wis-item-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path :d="item.iconPath"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
                  </svg>
                </span>

                <span class="wis-item-title">
                  {{ item.name }}
                </span>

                <span class="wis-item-arrow">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 10L12 15L17 10"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
                  </svg>
                </span>
              </button>

              <div class="wis-item-content">
                <div class="wis-item-inner">
                  <p>{{ item.description }}</p>

                  <div class="wis-tags">
                    <span v-for="tag in item.tags" :key="tag">
                      <i></i>{{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="wis-item-progress">
                <span :style="{
                  width: active === index ? progress + '%' : '0%'
                }"></span>
              </div>
            </article>

          </div>

          <div class="wis-side-note">
            <span class="wis-note-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"/>
              </svg>
            </span>

            <p>
              <b>Not a one-size-fits-all system.</b>
              Your workflows are configured to match your industry.
            </p>
          </div>

        </div>
      </div>

      <!-- Benefits strip -->
      <div class="wis-benefits">

        <div class="wis-benefit">
          <span class="wis-benefit-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9"
                stroke="currentColor" stroke-width="1.7"/>
              <path d="M12 7V12L15.5 14"
                stroke="currentColor" stroke-width="1.7"
                stroke-linecap="round"/>
            </svg>
          </span>
          <div>
            <b>Faster setup</b>
            <small>Start with workflows built for your industry.</small>
          </div>
        </div>

        <span class="wis-benefit-divider"></span>

        <div class="wis-benefit">
          <span class="wis-benefit-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M16 21V19C16 16.8 14.2 15 12 15H6C3.8 15 2 16.8 2 19V21"
                stroke="currentColor" stroke-width="1.7"
                stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4"
                stroke="currentColor" stroke-width="1.7"/>
              <path d="M17 11L19 13L22 9"
                stroke="currentColor" stroke-width="1.7"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div>
            <b>Quicker staff adoption</b>
            <small>Familiar fields and processes from day one.</small>
          </div>
        </div>

        <span class="wis-benefit-divider"></span>

        <div class="wis-benefit">
          <span class="wis-benefit-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 19V5M4 19H21"
                stroke="currentColor" stroke-width="1.7"
                stroke-linecap="round"/>
              <path d="M7 15L11 11L14 13L20 6"
                stroke="currentColor" stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"/>
            </svg>
          </span>
          <div>
            <b>Relevant reports</b>
            <small>See the numbers your industry needs.</small>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'WhyIndustrySpecific' })

const rootEl = ref(null)
const active = ref(0)
const progress = ref(0)
const inView = ref(false)
const paused = ref(false)

let observer = null
let timer = null

const INTERVAL = 6500
const TICK = 80

const industries = [
  {
    id: 'retail',
    name: 'Retailers',
    iconPath: 'M3 9L5 3H19L21 9M4 9V20H20V9M3 9H21M9 20V14H15V20',
    description:
      'Track customer loyalty tiers, repeat purchases and sales activity with fields and workflows designed for retail operations.',
    tags: ['Loyalty tiers', 'Purchase history', 'Repeat customers'],
    previewTitle: 'Retail workspace',
    dataTitle: 'Customer loyalty',
    dataSubtitle: 'Customer segments and loyalty status',
    columns: ['Customer', 'Tier', 'Status'],
    metrics: [
      { label: 'Customers', value: '1,248', note: 'Customer records' },
      { label: 'Loyalty tiers', value: '04', note: 'Customer levels' },
      { label: 'Repeat buyers', value: '68%', note: 'Illustrative data' }
    ],
    rows: [
      ['Kasun Perera', 'Gold', 'Active'],
      ['Sarah Silva', 'Silver', 'Active'],
      ['Nimal Fernando', 'Platinum', 'Active']
    ],
    specialField: 'Customer loyalty tier',
    footerText: 'Retail management workspace'
  },
  {
    id: 'distribution',
    name: 'Distributors',
    iconPath: 'M3 7H14V17H3Z M14 11H18L21 14V17H14Z M7 20A2 2 0 1 0 7 16A2 2 0 0 0 7 20Z M18 20A2 2 0 1 0 18 16A2 2 0 0 0 18 20Z',
    description:
      'Manage distributor relationships, account information and credit limits through workflows built for distribution businesses.',
    tags: ['Credit limits', 'Account balances', 'Order tracking'],
    previewTitle: 'Distribution workspace',
    dataTitle: 'Distributor accounts',
    dataSubtitle: 'Account and credit monitoring',
    columns: ['Account', 'Credit', 'Status'],
    metrics: [
      { label: 'Accounts', value: '356', note: 'Distributor records' },
      { label: 'Credit limit', value: 'LKR 5M', note: 'Illustrative value' },
      { label: 'Active orders', value: '84', note: 'Order records' }
    ],
    rows: [
      ['City Wholesale', 'LKR 2M', 'Active'],
      ['Prime Traders', 'LKR 1M', 'Active'],
      ['Metro Supplies', 'LKR 2M', 'Review']
    ],
    specialField: 'Distributor credit limit',
    footerText: 'Distribution management workspace'
  },
  {
    id: 'contractors',
    name: 'Contractors',
    iconPath: 'M3 21H21M5 21V7L12 3L19 7V21M9 21V14H15V21M9 9H9.01M15 9H15.01',
    description:
      'Organise projects around milestones, track progress and keep important project stages visible to your team.',
    tags: ['Project milestones', 'Stage tracking', 'Progress reports'],
    previewTitle: 'Project workspace',
    dataTitle: 'Project milestones',
    dataSubtitle: 'Project progress and delivery stages',
    columns: ['Project', 'Stage', 'Status'],
    metrics: [
      { label: 'Projects', value: '42', note: 'Project records' },
      { label: 'Milestones', value: '128', note: 'Tracked milestones' },
      { label: 'On track', value: '86%', note: 'Illustrative data' }
    ],
    rows: [
      ['Office Complex', 'Foundation', 'Active'],
      ['Villa Project', 'Structure', 'Active'],
      ['Retail Building', 'Handover', 'Review']
    ],
    specialField: 'Project milestone tracking',
    footerText: 'Contractor project workspace'
  },
  {
    id: 'services',
    name: 'Service Companies',
    iconPath: 'M14.5 6A4 4 0 0 0 19.5 11L9 21A2 2 0 0 1 6 18L16.5 8A4 4 0 0 0 14.5 6Z M5 4L9 8M5 8L9 4',
    description:
      'Keep maintenance contracts, service schedules and customer service history organised in one connected workspace.',
    tags: ['Maintenance contracts', 'Service schedules', 'Customer history'],
    previewTitle: 'Service workspace',
    dataTitle: 'Maintenance contracts',
    dataSubtitle: 'Service agreements and renewals',
    columns: ['Customer', 'Contract', 'Status'],
    metrics: [
      { label: 'Contracts', value: '284', note: 'Service agreements' },
      { label: 'Renewals', value: '18', note: 'Upcoming records' },
      { label: 'Active plans', value: '92%', note: 'Illustrative data' }
    ],
    rows: [
      ['ABC Holdings', 'Annual', 'Active'],
      ['Green Estates', 'Quarterly', 'Active'],
      ['Metro Hotels', 'Annual', 'Renewal']
    ],
    specialField: 'Maintenance contract tracking',
    footerText: 'Service management workspace'
  }
]

const current = computed(() => industries[active.value])

function select(index) {
  if (index === active.value) return
  active.value = index
  progress.value = 0
}

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    inView.value = entry.isIntersecting
  }, { threshold: 0.12 })

  if (rootEl.value) observer.observe(rootEl.value)

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (!reducedMotion) {
    timer = setInterval(() => {
      if (!inView.value || paused.value || document.hidden) return

      progress.value += (TICK / INTERVAL) * 100

      if (progress.value >= 100) {
        select((active.value + 1) % industries.length)
      }
    }, TICK)
  } else {
    progress.value = 100
  }
})

onBeforeUnmount(() => {
  clearInterval(timer)
  observer?.disconnect()
})
</script>

<style scoped>
.wis,
.wis * {
  box-sizing: border-box;
}

.wis {
  --wis-ink: #14152b;
  --wis-muted: #6c7084;
  --wis-orange: #f2540c;
  --wis-orange-light: #ff9a3d;
  --wis-peach: #fff1e7;
  --wis-line: rgba(20, 21, 43, .08);
  --wis-ease: cubic-bezier(.2, .8, .2, 1);

  position: relative;
  padding: clamp(65px, 8vw, 110px) 22px;
  background: #fff;
  color: var(--wis-ink);
  font-family: 'Poppins', system-ui, sans-serif;
}

.wis-wrap {
  max-width: 1240px;
  margin: 0 auto;
}

/* Heading */

.wis-heading {
  max-width: 800px;
  margin: 0 auto 40px;
  text-align: center;
}

.wis-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 17px;
  color: var(--wis-orange);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .13em;
}

.wis-eyebrow i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--wis-orange);
  box-shadow: 0 0 0 4px var(--wis-peach);
}

.wis-heading h2 {
  margin: 0;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4.4vw, 60px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -.05em;
}

.wis-heading h2 em {
  font-style: normal;
  background: linear-gradient(100deg, #ff9a3d, #ff6a1a, #f2540c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.wis-heading > p {
  max-width: 660px;
  margin: 17px auto 0;
  color: #697386;
  font-size: 15px;
  line-height: 1.75;
}

/* Main panel */

.wis-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
  gap: clamp(25px, 3.5vw, 48px);
  align-items: stretch;
  padding: 23px;
  border: 1px solid var(--wis-line);
  border-radius: 25px;
  background: #fff;
  box-shadow: 0 35px 75px -55px rgba(20, 21, 43, .4);
}

/* Left visual */

.wis-visual {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 530px;
  padding: 23px;
  overflow: hidden;
  border-radius: 22px;
  background:
    radial-gradient(ellipse at 90% 5%, rgba(255, 197, 156, .42), transparent 50%),
    radial-gradient(ellipse at 5% 100%, rgba(255, 226, 196, .65), transparent 55%),
    linear-gradient(145deg, #fff7ef, #fcece3 55%, #fff4ed);
}

.wis-visual::before {
  content: '';
  position: absolute;
  width: 270px;
  height: 270px;
  right: -120px;
  bottom: -120px;
  border: 1px solid rgba(242, 84, 12, .12);
  border-radius: 50%;
  box-shadow:
    0 0 0 35px rgba(242, 84, 12, .025),
    0 0 0 70px rgba(242, 84, 12, .025);
  pointer-events: none;
}

.wis-visual-top {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.wis-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wis-brand-icon {
  display: grid;
  place-items: center;
  width: 37px;
  height: 37px;
  border-radius: 11px;
  color: #fff;
  background: linear-gradient(145deg, #ff9a3d, #f2540c);
  box-shadow: 0 7px 16px rgba(242, 84, 12, .2);
}

.wis-brand-icon svg {
  width: 21px;
  height: 21px;
}

.wis-brand > span:last-child {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wis-brand b {
  font-size: 13px;
  font-weight: 600;
}

.wis-brand small {
  color: var(--wis-muted);
  font-size: 10px;
}

.wis-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border: 1px solid rgba(22, 163, 74, .15);
  border-radius: 30px;
  background: rgba(255, 255, 255, .7);
  color: #15803d;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.wis-live i,
.wis-visual-footer i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
}

/* Demo */

.wis-demo {
  position: relative;
  z-index: 2;
  margin: auto 0;
  padding: 19px;
  border: 1px solid rgba(255, 255, 255, .9);
  border-radius: 19px;
  background: rgba(255, 255, 255, .85);
  box-shadow: 0 24px 55px -35px rgba(112, 51, 20, .35);
  backdrop-filter: blur(15px);
  animation: wis-enter .5s var(--wis-ease);
}

@keyframes wis-enter {
  from {
    opacity: 0;
    transform: translateY(9px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.wis-demo-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.wis-demo-label {
  color: #9a7867;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: .12em;
}

.wis-demo-heading h3 {
  margin: 5px 0 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -.035em;
}

.wis-demo-icon {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  border-radius: 12px;
  color: var(--wis-orange);
  background: var(--wis-peach);
}

.wis-demo-icon svg {
  width: 21px;
  height: 21px;
}

/* Metrics */

.wis-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.wis-metric {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 5px;
  padding: 11px 9px;
  border: 1px solid #f0eeeb;
  border-radius: 11px;
  background: #fff;
}

.wis-metric > span {
  color: #85899a;
  font-size: 9px;
  white-space: nowrap;
}

.wis-metric strong {
  color: #17182c;
  font-size: clamp(13px, 1.5vw, 19px);
  font-weight: 600;
  letter-spacing: -.04em;
  white-space: nowrap;
}

.wis-metric small {
  color: #a0a3ad;
  font-size: 8px;
}

/* Data table */

.wis-data-card {
  padding: 13px;
  border: 1px solid #f0eeeb;
  border-radius: 12px;
  background: #fff;
}

.wis-data-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.wis-data-head > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.wis-data-head b {
  font-size: 11px;
  font-weight: 600;
}

.wis-data-head small {
  color: #9295a2;
  font-size: 9px;
}

.wis-data-menu {
  color: #85899a;
  letter-spacing: 2px;
  font-size: 12px;
}

.wis-data-row {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, .8fr) minmax(0, .8fr);
  align-items: center;
  gap: 5px;
  padding: 10px 5px;
  border-top: 1px solid #f1f0ed;
  color: #555b6e;
  font-size: 9px;
}

.wis-data-header {
  color: #a0a3ad;
  font-size: 8px;
  font-weight: 600;
}

.wis-row-name {
  overflow: hidden;
  color: #303348;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wis-row-status {
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.wis-row-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #16a34a;
}

.wis-data-row:last-child .wis-row-status i {
  background: #f59e0b;
}

/* Special field */

.wis-special {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #ffdfc9;
  border-radius: 12px;
  background: #fff7f0;
}

.wis-special-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: var(--wis-orange);
  background: #ffe8d7;
}

.wis-special-icon svg {
  width: 16px;
  height: 16px;
}

.wis-special > div:nth-child(2) {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.wis-special small {
  color: #b27a5b;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: .07em;
}

.wis-special b {
  overflow: hidden;
  font-size: 10px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wis-special-badge {
  padding: 5px 8px;
  border-radius: 20px;
  color: #15803d;
  background: #e9f8ee;
  font-size: 9px;
  font-weight: 600;
  white-space: nowrap;
}

/* Visual footer */

.wis-visual-footer {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
  color: #81766e;
  font-size: 9px;
}

.wis-visual-footer > span:first-child {
  display: flex;
  align-items: center;
  gap: 7px;
}

.wis-footer-brand {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .15em;
  color: #a68e80;
}

/* Right side */

.wis-options {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 8px 8px 8px 0;
}

.wis-options-label {
  color: var(--wis-orange);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .12em;
}

.wis-options-heading h3 {
  margin: 10px 0 0;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(24px, 2.5vw, 32px);
  font-weight: 500;
  letter-spacing: -.04em;
  line-height: 1.2;
}

.wis-options-heading p {
  max-width: 420px;
  margin: 10px 0 24px;
  color: var(--wis-muted);
  font-size: 13px;
  line-height: 1.7;
}

/* Accordion */

.wis-list {
  display: flex;
  flex-direction: column;
}

.wis-item {
  position: relative;
  padding: 14px 0 15px;
  border-bottom: 1px solid var(--wis-line);
}

.wis-item:first-child {
  border-top: 1px solid var(--wis-line);
}

.wis-item-button {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: var(--wis-ink);
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.wis-item-button:focus-visible {
  outline: 2px solid var(--wis-orange);
  outline-offset: 5px;
}

.wis-item-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 39px;
  height: 39px;
  border: 1px solid #ffe4d2;
  border-radius: 11px;
  color: var(--wis-orange);
  background: var(--wis-peach);
  transition: all .4s var(--wis-ease);
}

.wis-item-icon svg {
  width: 20px;
  height: 20px;
}

.wis-item.active .wis-item-icon {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(145deg, #ff9a3d, #f2540c);
  box-shadow: 0 8px 17px -8px rgba(242, 84, 12, .7);
  transform: scale(1.04);
}

.wis-item-title {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -.015em;
  transition: color .3s ease;
}

.wis-item.active .wis-item-title {
  color: var(--wis-orange);
}

.wis-item-arrow {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  color: #7c8190;
  background: #f6f5f2;
  transition: all .4s var(--wis-ease);
}

.wis-item-arrow svg {
  width: 15px;
  height: 15px;
}

.wis-item.active .wis-item-arrow {
  color: #fff;
  background: var(--wis-orange);
  transform: rotate(180deg);
}

/* Accordion content */

.wis-item-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .55s var(--wis-ease);
}

.wis-item.active .wis-item-content {
  grid-template-rows: 1fr;
}

.wis-item-inner {
  min-height: 0;
  overflow: hidden;
}

.wis-item-inner p {
  margin: 10px 0 0 51px;
  color: var(--wis-muted);
  font-size: 12px;
  line-height: 1.7;
  opacity: 0;
  transform: translateY(7px);
  transition: all .4s ease;
}

.wis-item.active .wis-item-inner p {
  opacity: 1;
  transform: none;
  transition-delay: .12s;
}

.wis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 11px 0 2px 51px;
  opacity: 0;
  transform: translateY(6px);
  transition: all .4s ease;
}

.wis-item.active .wis-tags {
  opacity: 1;
  transform: none;
  transition-delay: .2s;
}

.wis-tags span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border: 1px solid #f2eee9;
  border-radius: 30px;
  color: #666a7b;
  background: #faf9f7;
  font-size: 9px;
}

.wis-tags i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--wis-orange);
}

/* Progress line */

.wis-item-progress {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  overflow: hidden;
  background: transparent;
}

.wis-item-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #ff9a3d, #f2540c);
  transition: width .1s linear;
}

/* Side note */

.wis-side-note {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 22px;
  padding: 13px;
  border: 1px solid #f4e9df;
  border-radius: 13px;
  background: #fdf9f5;
}

.wis-note-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  color: var(--wis-orange);
  background: #fff0e7;
}

.wis-note-icon svg {
  width: 19px;
  height: 19px;
}

.wis-side-note p {
  margin: 0;
  color: #737789;
  font-size: 10px;
  line-height: 1.6;
}

.wis-side-note b {
  color: var(--wis-ink);
}

/* Bottom benefits */

.wis-benefits {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 20px;
  margin-top: 22px;
  padding: 23px 25px;
  border: 1px solid #f0e9e3;
  border-radius: 17px;
  background: #fbfaf8;
}

.wis-benefit {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.wis-benefit-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 41px;
  height: 41px;
  border-radius: 12px;
  color: var(--wis-orange);
  background: #fff0e7;
}

.wis-benefit-icon svg {
  width: 21px;
  height: 21px;
}

.wis-benefit > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.wis-benefit b {
  font-size: 12px;
  font-weight: 600;
}

.wis-benefit small {
  color: #7c8190;
  font-size: 10px;
  line-height: 1.5;
}

.wis-benefit-divider {
  width: 1px;
  height: 38px;
  background: #e9e4df;
}

/* Responsive */

@media (max-width: 960px) {
  .wis-panel {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .wis-visual {
    min-height: 540px;
  }

  .wis-options {
    padding: 5px;
  }

  .wis-options-heading h3 {
    font-size: 29px;
  }
}

@media (max-width: 650px) {
  .wis {
    padding: 55px 16px;
  }

  .wis-heading {
    margin-bottom: 28px;
  }

  .wis-heading h2 {
    font-size: 36px;
  }

  .wis-heading > p {
    font-size: 13px;
  }

  .wis-panel {
    padding: 12px;
    border-radius: 19px;
  }

  .wis-visual {
    min-height: 510px;
    padding: 16px;
    border-radius: 16px;
  }

  .wis-demo {
    padding: 13px;
  }

  .wis-live {
    font-size: 8px;
    padding: 6px 7px;
  }

  .wis-demo-heading h3 {
    font-size: 16px;
  }

  .wis-metric {
    padding: 9px 6px;
  }

  .wis-data-card {
    padding: 10px;
  }

  .wis-options-heading h3 {
    font-size: 26px;
  }

  .wis-benefits {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 18px;
  }

  .wis-benefit-divider {
    width: 100%;
    height: 1px;
  }
}

@media (max-width: 380px) {
  .wis-visual {
    padding: 12px;
  }

  .wis-brand b {
    font-size: 11px;
  }

  .wis-live {
    font-size: 7px;
  }

  .wis-metric > span {
    font-size: 8px;
  }

  .wis-data-row {
    font-size: 8px;
  }

  .wis-item-title {
    font-size: 13px;
  }

  .wis-item-inner p,
  .wis-tags {
    margin-left: 0;
  }

  .wis-special-badge {
    font-size: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wis *,
  .wis *::before,
  .wis *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
</style>
