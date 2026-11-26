
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'FieldServiceGettingStarted' })

const root = ref(null)
const shown = ref(false)

let observer = null

const steps = [
  {
    number: '01',
    title: 'Import your data',
    description:
      'Our onboarding team imports your customers and installed assets.',
    color: '#F1E8DB',
    type: 'import'
  },
  {
    number: '02',
    title: 'Set up your contracts',
    description:
      'Bring your existing maintenance contracts into Saptivo.',
    color: '#E1EBDD',
    type: 'contracts'
  },
  {
    number: '03',
    title: 'Configure checklists',
    description:
      'Set up service checklists for each equipment type.',
    color: '#E1E9F3',
    type: 'checklists'
  },
  {
    number: '04',
    title: 'Train your technicians',
    description:
      'Help your field technicians get started with the mobile app.',
    color: '#E9E3EF',
    type: 'mobile'
  }
]

const imports = [
  'Customers',
  'Installed assets',
  'Existing records'
]

const contracts = [
  { name: 'Annual maintenance', status: 'Active' },
  { name: 'Service agreement', status: 'Active' }
]

const checklists = [
  'Equipment inspection',
  'Record readings',
  'Capture service photos'
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
    class="fgs"
    :class="{ 'fgs-in': shown }"
    aria-labelledby="fgs-title"
  >

    <div class="fgs-wrap">

      <!-- Heading -->

      <header class="fgs-header">

        <h2 id="fgs-title">
          Getting <span>started</span>
        </h2>

        <p>
          Our onboarding team imports your customers,
          installed assets and existing contracts, sets up
          checklists for each equipment type and trains
          your technicians on the mobile app. Most of the
          work of getting started is done for you.
        </p>

      </header>

      <!-- Onboarding journey -->

      <div class="fgs-grid">

        <article
          v-for="(step, index) in steps"
          :key="step.number"
          class="fgs-step"
          :style="{
            '--bg': step.color,
            '--i': index
          }"
        >

          <!-- Timeline -->

          <div class="fgs-timeline">

            <span class="fgs-number">
              {{ step.number }}
            </span>

            <span class="fgs-line"></span>

          </div>

          <!-- Visual card -->

          <div class="fgs-visual" aria-hidden="true">

            <span class="fgs-circle"></span>

            <!-- Import illustration -->

            <div
              v-if="step.type === 'import'"
              class="fgs-window fgs-import"
            >

              <div class="fgs-window-header">
                <strong>Import data</strong>
                <span class="fgs-success">Complete</span>
              </div>

              <div
                v-for="item in imports"
                :key="item"
                class="fgs-import-row"
              >

                <span class="fgs-mini-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                  >
                    <ellipse cx="12" cy="5" rx="8" ry="3"/>
                    <path d="M4 5v14a8 3 0 0 0 16 0V5"/>
                    <path d="M4 12a8 3 0 0 0 16 0"/>
                  </svg>

                </span>

                <span>{{ item }}</span>

                <span class="fgs-check">✓</span>

              </div>

              <div class="fgs-progress">
                <i></i>
              </div>

            </div>

            <!-- Contracts illustration -->

            <div
              v-else-if="step.type === 'contracts'"
              class="fgs-window"
            >

              <div class="fgs-window-header">
                <strong>Service contracts</strong>
              </div>

              <div
                v-for="contract in contracts"
                :key="contract.name"
                class="fgs-contract"
              >

                <span class="fgs-document">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M14 2H6v20h12V8z"/>
                    <path d="M14 2v6h4M9 13h6M9 17h6"/>
                  </svg>

                </span>

                <div class="fgs-contract-copy">
                  <strong>{{ contract.name }}</strong>
                  <small>Renewal alerts enabled</small>
                </div>

                <span class="fgs-contract-status">
                  {{ contract.status }}
                </span>

              </div>

            </div>

            <!-- Checklist illustration -->

            <div
              v-else-if="step.type === 'checklists'"
              class="fgs-window"
            >

              <div class="fgs-window-header">
                <strong>Service checklist</strong>
              </div>

              <div class="fgs-equipment">
                Equipment inspection
              </div>

              <div
                v-for="(item, i) in checklists"
                :key="item"
                class="fgs-checklist-row"
                :style="{ '--delay': i * .15 + 's' }"
              >

                <span class="fgs-checkbox">✓</span>

                <span>{{ item }}</span>

              </div>

            </div>

            <!-- Mobile app illustration -->

            <div v-else class="fgs-mobile">

              <div class="fgs-mobile-notch"></div>

              <div class="fgs-mobile-content">

                <span class="fgs-mobile-label">
                  Technician app
                </span>

                <strong>Today's jobs</strong>

                <div class="fgs-mobile-job">

                  <span class="fgs-mobile-job-icon">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 5h18v16H3zM7 3v4M17 3v4M3 10h18"/>
                    </svg>

                  </span>

                  <div>
                    <b>Preventive service</b>
                    <small>Scheduled visit</small>
                  </div>

                </div>

                <div class="fgs-mobile-task">
                  <span class="fgs-check">✓</span>
                  Checklist completed
                </div>

                <div class="fgs-mobile-task">
                  <span class="fgs-check">✓</span>
                  Photos uploaded
                </div>

                <div class="fgs-mobile-button">
                  Complete service
                </div>

              </div>

            </div>

          </div>

          <!-- Step content -->

          <div class="fgs-step-copy">

            <h3>{{ step.title }}</h3>

            <p>{{ step.description }}</p>

          </div>

        </article>

      </div>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.fgs,
.fgs * {
  box-sizing: border-box;
}

.fgs {
  width: 100%;
  padding: clamp(56px, 7vw, 110px) 0;
  background: #fff;
}

.fgs-wrap {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(24px, 6vw, 96px);
}

/* Heading */

.fgs-header {
  max-width: 900px;
  margin: 0 auto clamp(36px, 5vw, 64px);
  text-align: center;
}

.fgs-header h2 {
  margin: 0 0 20px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.fgs-header h2 span {
  background: linear-gradient(100deg, #a1a1aa, #777780);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.fgs-header p {
  max-width: 780px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  line-height: 1.85;
  color: #666b73;
}

/* Journey grid */

.fgs-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.fgs-step {
  min-width: 0;
}

.fgs-timeline {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.fgs-number {
  display: grid;
  place-items: center;
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #292929;
  color: #fff;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.fgs-line {
  flex: 1;
  height: 1px;
  background: #dcdce1;
}

.fgs-step:last-child .fgs-line {
  background: linear-gradient(90deg, #dcdce1, transparent);
}

/* Visual card */

.fgs-visual {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
  padding: 20px;
  overflow: hidden;
  border-radius: 24px;
  background: var(--bg);
  font-family: 'Poppins', sans-serif;
}

.fgs-circle {
  position: absolute;
  z-index: -1;
  width: 320px;
  height: 320px;
  right: -120px;
  top: -100px;
  border: 1px solid rgba(255,255,255,.8);
  border-radius: 50%;
}

.fgs-circle::after {
  content: '';
  position: absolute;
  inset: 28px;
  border: 1px solid rgba(255,255,255,.8);
  border-radius: 50%;
}

/* Mini UI window */

.fgs-window {
  position: relative;
  width: 100%;
  max-width: 280px;
  padding: 14px;
  border: 1px solid rgba(255,255,255,.9);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 18px 35px -20px rgba(35,35,35,.35);
}

.fgs-window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.fgs-window-header strong {
  font-size: 11px;
  font-weight: 600;
  color: #333;
}

.fgs-success {
  padding: 4px 6px;
  border-radius: 5px;
  background: #e4eee1;
  color: #64815f;
  font-size: 8px;
}

/* Import */

.fgs-import-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 0;
  border-bottom: 1px solid #f0f0f2;
}

.fgs-import-row > span:nth-child(2) {
  flex: 1;
  font-size: 10px;
  color: #555;
}

.fgs-mini-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: #f4f1eb;
  color: #8b7d68;
}

.fgs-mini-icon svg {
  width: 15px;
  height: 15px;
}

.fgs-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #e2eddf;
  color: #63825e;
  font-size: 10px;
  font-weight: 600;
}

.fgs-progress {
  height: 4px;
  margin-top: 14px;
  overflow: hidden;
  border-radius: 4px;
  background: #eee;
}

.fgs-progress i {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: #8ca486;
  transform-origin: left;
}

.fgs-in .fgs-progress i {
  animation: fgs-grow 1.2s .3s ease both;
}

@keyframes fgs-grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* Contracts */

.fgs-contract {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
  padding: 10px 7px;
  border-radius: 8px;
  background: #f6f7f5;
}

.fgs-document {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 30px;
  border-radius: 6px;
  background: #e1ebdd;
  color: #728b6d;
}

.fgs-document svg {
  width: 15px;
  height: 15px;
}

.fgs-contract-copy {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.fgs-contract-copy strong {
  font-size: 9px;
  font-weight: 600;
  line-height: 1.4;
  color: #444;
}

.fgs-contract-copy small {
  font-size: 8px;
  color: #888;
}

.fgs-contract-status {
  font-size: 8px;
  color: #64815f;
}

/* Checklists */

.fgs-equipment {
  margin: 12px 0 6px;
  padding: 8px;
  border-radius: 6px;
  background: #e8eef6;
  color: #62758d;
  font-size: 9px;
  font-weight: 500;
}

.fgs-checklist-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 0;
  border-bottom: 1px solid #eee;
  font-size: 9px;
  color: #555;
}

.fgs-checkbox {
  display: grid;
  place-items: center;
  flex: none;
  width: 15px;
  height: 15px;
  border-radius: 4px;
  background: #e1ecdf;
  color: #62835e;
  font-size: 10px;
}

.fgs-in .fgs-checkbox {
  animation: fgs-check-in .5s ease both;
  animation-delay: calc(.6s + var(--delay));
}

@keyframes fgs-check-in {
  from {
    opacity: 0;
    transform: scale(.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Mobile app */

.fgs-mobile {
  position: relative;
  align-self: flex-start;
  width: 170px;
  max-width: 100%;
  min-height: 285px;
  padding: 8px;
  border: 5px solid #343434;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 18px 35px -15px rgba(0,0,0,.3);
  transform: translateY(4px);
}

.fgs-mobile-notch {
  width: 42px;
  height: 10px;
  margin: 0 auto 14px;
  border-radius: 20px;
  background: #343434;
}

.fgs-mobile-content {
  padding: 4px;
}

.fgs-mobile-label {
  display: block;
  margin-bottom: 5px;
  font-size: 8px;
  color: #888;
}

.fgs-mobile-content > strong {
  display: block;
  font-family: 'Urbanist', sans-serif;
  font-size: 19px;
  font-weight: 700;
  color: #292929;
}

.fgs-mobile-job {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 12px 0;
  padding: 9px 6px;
  border-radius: 8px;
  background: #f2edf6;
}

.fgs-mobile-job-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #fff;
  color: #8a7b9c;
}

.fgs-mobile-job-icon svg {
  width: 14px;
  height: 14px;
}

.fgs-mobile-job b,
.fgs-mobile-job small {
  display: block;
}

.fgs-mobile-job b {
  font-size: 8px;
  font-weight: 600;
  color: #444;
}

.fgs-mobile-job small {
  margin-top: 4px;
  font-size: 7px;
  color: #888;
}

.fgs-mobile-task {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 0;
  border-bottom: 1px solid #eee;
  font-size: 8px;
  color: #666;
}

.fgs-mobile-button {
  margin-top: 12px;
  padding: 9px 5px;
  border-radius: 7px;
  background: #292929;
  text-align: center;
  font-size: 8px;
  color: #fff;
}

/* Text */

.fgs-step-copy {
  padding: 24px 4px 0;
}

.fgs-step-copy h3 {
  margin: 0 0 12px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(23px, 2vw, 29px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -.035em;
  color: #222;
}

.fgs-step-copy p {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  line-height: 1.8;
  color: #666b73;
}

/* Animation */

.fgs-in .fgs-step {
  animation: fgs-reveal .75s ease both;
  animation-delay: calc(var(--i) * .12s);
}

@keyframes fgs-reveal {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tablet */

@media (max-width: 1150px) {
  .fgs-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 36px;
  }

  .fgs-visual {
    height: 300px;
  }

  .fgs-step:nth-child(2) .fgs-line {
    background: linear-gradient(90deg, #dcdce1, transparent);
  }
}

/* Mobile */

@media (max-width: 640px) {
  .fgs-wrap {
    padding: 0 20px;
  }

  .fgs-header h2 {
    font-size: 36px;
  }

  .fgs-header p {
    font-size: 14px;
  }

  .fgs-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;
  }

  .fgs-visual {
    height: 270px;
    border-radius: 22px;
  }

  .fgs-step-copy {
    padding-top: 20px;
  }

  .fgs-step-copy h3 {
    font-size: 27px;
  }

  .fgs-timeline {
    margin-bottom: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fgs *,
  .fgs *::before,
  .fgs *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
