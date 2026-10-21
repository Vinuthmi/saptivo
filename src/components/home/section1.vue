<template>
  <section class="features-section">
    <div class="features-container">
      <!-- Heading -->
      <header class="features-heading">
        <h2>
          Everything you need to
          <span>grow &amp; scale.</span>
        </h2>
        <p>Customer relationships, multi-store sync, and automated sales in one platform.</p>
      </header>

      <!-- Feature tabs -->
      <div class="feature-tabs" role="tablist" aria-label="Product features">
        <button
          v-for="(feature, index) in features"
          :id="`feature-tab-${feature.id}`"
          :key="feature.id"
          type="button"
          class="feature-tab"
          :class="{ active: activeIndex === index, 'is-dotted': feature.dotted }"
          role="tab"
          :aria-selected="activeIndex === index"
          aria-controls="feature-panel"
          @click="goTo(index)"
        >
          <svg class="tab-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path v-for="d in feature.icon" :key="d" :d="d" />
          </svg>
          <span>{{ feature.tab }}</span>
        </button>
      </div>

      <!-- Active feature panel -->
      <div
        id="feature-panel"
        class="feature-panel"
        role="tabpanel"
        :aria-labelledby="`feature-tab-${currentFeature.id}`"
      >
        <div :key="currentFeature.id" class="feature-content">
          <div class="feature-label">
            <svg class="label-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path v-for="d in currentFeature.icon" :key="d" :d="d" />
            </svg>
            {{ currentFeature.label }}
          </div>

          <h3>{{ currentFeature.title }}</h3>
          <p class="feature-description">{{ currentFeature.description }}</p>

          <ul class="feature-list">
            <li v-for="point in currentFeature.points" :key="point">
              <span class="check-icon">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="m4 8 2.5 2.5L12 5" />
                </svg>
              </span>
              {{ point }}
            </li>
          </ul>

          <div class="feature-metrics">
            <div v-for="metric in currentFeature.metrics" :key="metric.label" class="metric">
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.label }}</span>
            </div>
          </div>
        </div>

        <!-- Feature artwork -->
        <div :key="currentFeature.id" class="feature-visual">
          <img class="feature-image" :src="currentFeature.image" :alt="currentFeature.imageAlt" />
        </div>

        <!-- Slider controls -->
        <div class="slider-footer">
          <button
            type="button"
            class="slider-arrow"
            aria-label="Previous feature"
            @click="step(-1)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>

          <div class="slider-dots" role="group" aria-label="Choose a feature">
            <button
              v-for="(feature, index) in features"
              :key="feature.id"
              type="button"
              :aria-label="`Show ${feature.tab}`"
              :aria-current="activeIndex === index ? 'true' : undefined"
              :class="{ active: activeIndex === index }"
              @click="goTo(index)"
            ></button>
          </div>

          <button type="button" class="slider-arrow" aria-label="Next feature" @click="step(1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeSection1' })
import { ref, computed, onMounted, onUnmounted } from 'vue'

const ROTATION_INTERVAL_MS = 6000

const features = [
  {
    id: 'crm',
    icon: [
      'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
      'M2 21v-2a7 7 0 0 1 14 0v2',
      'M19 8a4 4 0 0 1 0 8M22 21v-2a5 5 0 0 0-3-4.58',
    ],
    image: 'https://cp.saptivo.com/assets/images/types/image%20copy%202.webp',
    imageAlt: 'Build customer loyalty that drives repeat growth',
    tab: 'Omnichannel CRM',
    label: 'CRM & Customer Intelligence',
    title: 'Build customer loyalty that drives repeat growth.',
    description:
      'Capture buyer history, track VIP reward tiers, and auto-dispatch personalized WhatsApp follow-ups.',
    points: [
      'Real-time customer frequency & lifetime value',
      'Automated loyalty tiers & VIP reward triggers',
      'Instant WhatsApp digital receipts & offers',
    ],
    metrics: [
      { value: '+46%', label: 'Repeat Buyers' },
      { value: '98.4%', label: 'Retention Rate' },
      { value: '0-Click', label: 'WhatsApp Receipts' },
    ],
  },
  {
    id: 'stores',
    icon: ['m12 3 9 5-9 5-9-5 9-5Z', 'm3 12 9 5 9-5M3 16l9 5 9-5'],
    image:
      'https://cp.saptivo.com/assets/images/types/ChatGPT%20Image%20Sep%2011,%202026,%2003_47_28%20PM.webp',
    imageAlt: 'Multi-Branch Management - Manage 1 to 100+ stores from a single HQ dashboard',
    tab: 'Multi-Store Sync',
    label: 'Multi-Branch Management',
    title: 'Manage 1 to 100+ stores from a single HQ dashboard.',
    description:
      'Centralized control over branch operations, staff permissions, customer assignments, and consolidated company financials.',
    points: [
      'Instant multi-branch operations & centralized control',
      'Granular staff role permissions & audit trails',
      'Global catalog & pricing updates in under 50ms',
    ],
    metrics: [
      { value: '100+', label: 'Stores Scalable' },
      { value: '<50ms', label: 'Sync Latency' },
      { value: '100%', label: 'HQ Audit Control' },
    ],
  },
  {
    id: 'quotes',
    icon: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z', 'M14 2v6h6M8 13h8M8 17h8'],
    image: 'https://cp.saptivo.com/assets/images/types/smart%20qutoes.webp',
    imageAlt: 'Fast Proposals & Automated Invoicing - Quotations',
    tab: 'Smart Quotes',
    label: 'Fast Proposals & Automated Invoicing',
    title: 'Instant professional quotations. Faster approvals.',
    description:
      'Generate branded PDF estimates in seconds, track client views, and convert approved quotes into invoices in 1 click.',
    points: [
      'Instant branded PDF quotation & estimate generation',
      'Real-time client view tracking & WhatsApp dispatch',
      '1-Click quote-to-invoice conversion & payment logs',
    ],
    metrics: [
      { value: '3x Faster', label: 'Quote Turnaround' },
      { value: '1-Click', label: 'Invoice Conversion' },
      { value: '100%', label: 'Tax & Audit Ready' },
    ],
  },
  {
    id: 'analytics',
    icon: ['M3 3v18h18M8 16V9M13 16V5M18 16v-4'],
    image: 'https://cp.saptivo.com/assets/images/types/image.webp',
    imageAlt: 'Real-time visibility into revenue & pipeline velocity - Sales Analytics',
    tab: 'Sales Analytics',
    label: 'Revenue & Pipeline Intelligence',
    title: 'Real-time visibility into revenue & pipeline velocity.',
    description:
      'Track deal conversion velocity, won revenue, sales rep quotas, and generate exportable tax and audit reports with 1 click.',
    points: [
      'Live deal pipeline stages & conversion tracking',
      'Net profit margins & commission audit trails',
      'One-click tax & financial summary exports',
    ],
    metrics: [
      { value: '+38.4%', label: 'Pipeline Velocity' },
      { value: 'Real-time', label: 'Margin Reports' },
      { value: '1-Click', label: 'Tax & CSV Export' },
    ],
  },
  {
    id: 'calls',
    dotted: true,
    icon: [
      'M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.2 18.8a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.2 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.05 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69a2 2 0 0 1 1.77 2.05Z',
    ],
    image: 'https://cp.saptivo.com/assets/images/types/image%20copy.webp',
    imageAlt: 'Customer Calls - 3CX Call Journal',
    tab: '3CX Call Journal',
    label: '3CX Call Journal & Telephony',
    title: 'Inbound & outbound customer calls, logged automatically.',
    description:
      'Track every customer call, missed inquiry, and callback in one unified journal. Connect phone numbers directly to buyer history with instant caller ID matching.',
    points: [
      'Automated 3CX inbound, outbound & missed call logging',
      'Instant caller ID lookup & customer history popup',
      'Quick callback queues to eliminate missed customer leads',
    ],
    metrics: [
      { value: '100%', label: 'Calls Logged' },
      { value: '<1s', label: 'Caller Matching' },
      { value: '0', label: 'Lost Inquiries' },
    ],
  },
]

const activeIndex = ref(0)
const currentFeature = computed(() => features[activeIndex.value])

let rotationTimer

function stopRotation() {
  window.clearInterval(rotationTimer)
}

function startRotation() {
  stopRotation()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  rotationTimer = window.setInterval(() => step(1, false), ROTATION_INTERVAL_MS)
}

/** Jump to a feature and restart the auto-rotation clock. */
function goTo(index) {
  activeIndex.value = index
  startRotation()
}

/** Move forwards/backwards by `direction`, wrapping around the list. */
function step(direction, restart = true) {
  activeIndex.value = (activeIndex.value + direction + features.length) % features.length
  if (restart) startRotation()
}

onMounted(startRotation)
onUnmounted(stopRotation)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */

.features-section {
  --feature-orange: #ff5722;
  --feature-orange-text: #ea580c;
  --feature-orange-tint: #fff4ed;
  --feature-navy: #0f172a;
  --feature-ink: #334155;
  --feature-muted: #64748b;
  --feature-bg: #f1efec;
  --feature-line: #f1f5f9;

  --panel-pad: 48px;
  --panel-gap: 38px;
  --panel-top: 54px;
  --panel-bottom: 44px;

  position: relative;
  width: 100%;
  padding: 96px 16px;
  background: var(--feature-bg);
  color: var(--feature-navy);
  font-family:
    Poppins,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  overflow: hidden;
}

.features-section,
.features-section *,
.features-section *::before,
.features-section *::after {
  box-sizing: border-box;
}

.features-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

/* ------------------------------------------------------------------ */
/* Heading                                                             */
/* ------------------------------------------------------------------ */

.features-heading {
  padding: 0 16px;
  text-align: center;
}

.features-heading h2 {
  max-width: 900px;
  margin: 0 auto;
  color: var(--feature-navy);
  font-size: clamp(26px, 5vw, 46px);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.features-heading h2 span {
  display: block;
  width: fit-content; /* gradient spans the text itself, not the whole heading */
  margin: 0 auto -0.14em;
  padding-bottom: 0.14em; /* keeps the "g" descender inside the clipped background */
  background: linear-gradient(135deg, #ff6b00, #ff5722, #c2410c);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.features-heading > p {
  margin: 14px 0 0;
  color: var(--feature-muted);
  font-size: 0.92rem; /* 14.72px */
  line-height: 1.55;
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

.feature-tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 48px auto 60px;
}

.feature-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  padding: 12px 24px;
  border: 1px solid #e3e6ea;
  border-radius: 50px;
  background: #fff;
  color: #263142;
  box-shadow: 0 4px 12px rgb(15 23 42 / 5%);
  font: inherit;
  font-size: 0.92rem; /* 14.72px */
  line-height: 1.5;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.feature-tab.is-dotted {
  border-style: dotted;
  border-color: var(--feature-orange);
}

.feature-tab:hover {
  transform: translateY(-1px);
  border-color: #ffc9b3;
  background: var(--feature-orange-tint);
  color: var(--feature-orange);
}

.feature-tab:focus-visible {
  outline: 2px solid var(--feature-orange);
  outline-offset: 3px;
}

.feature-tab.active,
.feature-tab.active:hover {
  border-color: var(--feature-orange);
  background: var(--feature-orange);
  color: #fff;
  box-shadow: 0 8px 20px rgb(255 87 34 / 25%);
}

/* Shared line-icon styling (tabs + label chip) */
.tab-icon,
.label-icon {
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tab-icon {
  width: 22px;
  height: 22px;
}

.label-icon {
  width: 16px;
  height: 16px;
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

.feature-panel {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.95fr);
  grid-template-rows: 1fr auto;
  column-gap: var(--panel-gap);
  min-height: 519px;
  padding: var(--panel-top) var(--panel-pad) 0;
  border: 1px solid #f0efed;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 20px 50px -15px rgb(15 23 42 / 8%);
  overflow: hidden;
}

/* Faint dot-grid accent in the top-right corner */
.feature-panel::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 130px;
  height: 110px;
  background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.4px);
  background-size: 12px 12px;
  opacity: 0.7;
  mask-image: radial-gradient(circle at 100% 0, #000 0%, transparent 75%);
  pointer-events: none;
}

@keyframes feature-appear {
  from {
    opacity: 0.7;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ------------------------------------------------------------------ */
/* Content column                                                      */
/* ------------------------------------------------------------------ */

.feature-content {
  position: relative;
  z-index: 1;
  align-self: center;
  min-width: 0;
  animation: feature-appear 0.3s ease both;
}

.feature-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 11px;
  padding: 7px 12px;
  border-radius: 5px;
  background: #fef5ed;
  color: var(--feature-orange-text);
  font-size: 12px;
  line-height: 1.5;
}

.feature-content h3 {
  max-width: 650px;
  margin: 0;
  color: var(--feature-navy);
  min-height: 2.6em; /* reserve two lines so every feature lines up */
  font-size: clamp(21px, 2.6vw, 26px);
  font-weight: 400;
  line-height: 1.3;
}

.feature-description {
  max-width: 690px;
  margin: 2px 0 16px;
  color: var(--feature-muted);
  font-size: 0.88rem; /* 14.08px */
  line-height: 1.6;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: var(--feature-ink);
  font-size: 0.84rem; /* 13.44px */
  line-height: 1.5;
}

.check-icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  margin-top: 1.5px;
  border-radius: 50%;
  background: var(--feature-orange);
  color: #fff;
}

.check-icon svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.feature-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #edf0f4;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.metric strong {
  color: var(--feature-orange);
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
}

.metric span {
  color: var(--feature-muted);
  font-size: 0.72rem; /* 11.52px */
  line-height: 1.5;
}

/* ------------------------------------------------------------------ */
/* Artwork column                                                      */
/* ------------------------------------------------------------------ */

.feature-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  animation: feature-appear 0.3s ease both;
}

.feature-image {
  display: block;
  width: 100%;
  max-width: 520px;
  height: 350px;
  border-radius: 10px;
  object-fit: cover;
}

/* ------------------------------------------------------------------ */
/* Slider footer                                                       */
/* ------------------------------------------------------------------ */

.slider-footer {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
  height: 68px;
  margin: var(--panel-bottom) calc(var(--panel-pad) * -1) 0; /* bleed to the panel edges */
  padding: 0 32px;
  border-top: 1px solid var(--feature-line);
  background: #fff;
}

.slider-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.slider-dots button {
  width: 12px;
  height: 12px;
  padding: 0;
  border: 0;
  border-radius: 20px;
  background: #cbd5e1;
  cursor: pointer;
  transition:
    width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slider-dots button.active {
  width: 28px;
  background: var(--feature-orange);
}

.slider-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--feature-line);
  border-radius: 8px;
  background: #f8fafc;
  color: var(--feature-ink);
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.slider-arrow svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.slider-arrow:hover {
  border-color: #ffc9b3;
  background: var(--feature-orange-tint);
  color: var(--feature-orange);
}

.slider-dots button:focus-visible,
.slider-arrow:focus-visible {
  outline: 2px solid var(--feature-orange);
  outline-offset: 2px;
}

/* ------------------------------------------------------------------ */
/* Tablet                                                              */
/* ------------------------------------------------------------------ */

@media (max-width: 900px) {
  .features-section {
    --panel-pad: 24px;
    --panel-gap: 24px;
    --panel-top: 32px;
    --panel-bottom: 32px;
  }

  .feature-tabs {
    gap: 9px;
    margin: 28px auto 32px;
  }

  .feature-tab {
    gap: 7px;
    padding: 9px 14px;
  }

  .feature-content h3 {
    min-height: 0;
  }

  .feature-description {
    margin-top: 12px;
  }

  .feature-image {
    height: 270px;
  }

  .feature-metrics {
    gap: 9px;
  }

  .metric strong {
    font-size: 16px;
  }
}

/* ------------------------------------------------------------------ */
/* Mobile                                                              */
/* ------------------------------------------------------------------ */

@media (max-width: 600px) {
  .features-section {
    --panel-pad: 18px;
    --panel-top: 24px;
    --panel-bottom: 24px;

    padding: 56px 12px;
  }

  .features-heading {
    padding: 0 4px;
  }

  .features-heading > p {
    max-width: 340px;
    margin: 12px auto 0;
  }

  .feature-tabs {
    gap: 10px;
    margin: 28px 0 24px;
  }

  .feature-tab {
    padding: 10px 15px;
  }

  .feature-panel {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-height: 0;
  }

  .feature-label {
    font-size: 10px;
  }

  .feature-content h3 {
    max-width: none;
  }

  .feature-description {
    margin: 12px 0 15px;
  }

  .feature-list {
    gap: 11px;
  }

  .feature-metrics {
    gap: 8px;
    margin-top: 20px;
  }

  .metric strong {
    font-size: 16.8px;
    overflow-wrap: anywhere;
  }

  .metric span {
    font-size: 0.65rem; /* 10.4px */
  }

  .feature-image {
    max-width: none;
    height: auto;
    aspect-ratio: 1;
  }

  .slider-footer {
    grid-template-columns: 32px 1fr 32px;
    height: 56px;
    margin-top: 6px;
    padding: 0 14px;
  }

  .slider-arrow {
    width: 32px;
    height: 32px;
  }

  .slider-dots {
    gap: 6px;
  }

  .slider-dots button {
    width: 8px;
    height: 8px;
  }

  .slider-dots button.active {
    width: 20px;
  }
}

/* ------------------------------------------------------------------ */
/* Reduced motion                                                      */
/* ------------------------------------------------------------------ */

@media (prefers-reduced-motion: reduce) {
  .feature-content,
  .feature-visual {
    animation: none;
  }

  .features-section *,
  .features-section *::before,
  .features-section *::after {
    transition-duration: 0.01ms !important;
  }
}
</style>
