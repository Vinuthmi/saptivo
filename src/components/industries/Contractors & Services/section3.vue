
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'ContractorBenefits' })

const root = ref(null)
const shown = ref(false)

let observer = null

const stats = [
  {
    label: 'Project value',
    value: 'Rs. 850K',
    note: 'Approved quotation',
    color: 'neutral'
  },
  {
    label: 'Payments received',
    value: 'Rs. 510K',
    note: '60% of project value',
    color: 'neutral'
  },
  {
    label: 'Estimated margin',
    value: '28%',
    note: 'Project profitability',
    color: 'green'
  }
]

const milestones = [
  {
    title: 'Estimate approved',
    subtitle: 'Project confirmed',
    status: 'Completed',
    done: true
  },
  {
    title: 'Deposit received',
    subtitle: 'Deposit invoice paid',
    status: 'Completed',
    done: true
  },
  {
    title: 'Site work completed',
    subtitle: 'Progress photos uploaded',
    status: 'Completed',
    done: true
  },
  {
    title: 'Final handover',
    subtitle: 'Final invoice and payment',
    status: 'Pending',
    done: false
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
    class="cb"
    :class="{ 'cb-in': shown }"
    aria-labelledby="cb-title"
  >
    <div class="cb-wrap">

      <div class="cb-panel">

        <!-- Decorative background -->

        <span class="cb-orbit cb-orbit-one"></span>
        <span class="cb-orbit cb-orbit-two"></span>

        <!-- Left content -->

        <div class="cb-copy">

          <h2 id="cb-title">
            Benefits for
            <span>contractors</span>
          </h2>

          <p>
            Every job has one home, so office staff
            and site teams work from the same information.
            Customers feel informed and confident, which
            leads to referrals. Milestone billing keeps
            cash flowing, and you can see at a glance
            which jobs are profitable.
          </p>

        </div>

        <!-- Right project dashboard -->

        <div class="cb-visual" aria-hidden="true">

          <div class="cb-dashboard">

            <div class="cb-header">

              <div class="cb-project">

                <span class="cb-project-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 21h18M5 21V7l7-4v18"/>
                    <path d="M12 10h7v11M8 9v1M8 13v1M8 17v1"/>
                    <path d="M15 13h1M15 17h1"/>
                  </svg>
                </span>

                <div>
                  <strong>Residential renovation</strong>
                  <small>Project #PRJ-024</small>
                </div>

              </div>

              <span class="cb-status">
                <i></i>
                In progress
              </span>

            </div>

            <!-- Project progress -->

            <div class="cb-progress">

              <div class="cb-progress-label">
                <strong>Project completion</strong>
                <span>75%</span>
              </div>

              <div class="cb-progress-track">
                <i></i>
              </div>

              <small>3 of 4 milestones completed</small>

            </div>

            <!-- Project statistics -->

            <div class="cb-stats">

              <div
                v-for="stat in stats"
                :key="stat.label"
                class="cb-stat"
                :class="'cb-stat-' + stat.color"
              >
                <span>{{ stat.label }}</span>
                <strong>{{ stat.value }}</strong>
                <small>{{ stat.note }}</small>
              </div>

            </div>

            <!-- Milestones -->

            <div class="cb-milestones">

              <h3>Project milestones</h3>

              <div
                v-for="(item, index) in milestones"
                :key="item.title"
                class="cb-milestone"
                :class="{ 'cb-complete': item.done }"
                :style="{ '--i': index }"
              >

                <span class="cb-check">

                  <svg
                    v-if="item.done"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m5 12 5 5 9-10"/>
                  </svg>

                  <span v-else></span>

                </span>

                <div class="cb-milestone-copy">
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.subtitle }}</small>
                </div>

                <span class="cb-milestone-status">
                  {{ item.status }}
                </span>

              </div>

            </div>

            <!-- Customer update -->

            <div class="cb-update">

              <span class="cb-update-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8" cy="8" r="2"/>
                  <path d="m3 18 6-6 4 4 4-5 4 5"/>
                </svg>
              </span>

              <div>
                <strong>Progress photos shared</strong>
                <small>Customer portal updated</small>
              </div>

              <span class="cb-shared">Shared</span>

            </div>

          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.cb,
.cb * {
  box-sizing: border-box;
}

.cb {
  width: 100%;
  padding: 40px clamp(24px, 4vw, 64px);
  background: #fff;
}

.cb-wrap {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

/* Main panel */

.cb-panel {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  align-items: center;
  gap: clamp(36px, 5vw, 80px);
  padding: clamp(36px, 5vw, 72px);
  border-radius: 36px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #F5F1EA 0%,
    #EAE3D8 55%,
    #E2D9CD 100%
  );
}

.cb-orbit {
  position: absolute;
  z-index: -1;
  border: 1px solid rgba(255,255,255,.75);
  border-radius: 50%;
  pointer-events: none;
}

.cb-orbit-one {
  width: 740px;
  height: 740px;
  right: -220px;
  top: -220px;
}

.cb-orbit-two {
  width: 590px;
  height: 590px;
  right: -145px;
  top: -145px;
}

/* Left content */

.cb-copy h2 {
  margin: 0 0 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.cb-copy h2 span {
  display: block;
  background: linear-gradient(100deg, #a1a1aa, #777780);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cb-copy p {
  max-width: 53ch;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.85;
  color: #66615b;
}

/* Dashboard */

.cb-visual {
  width: 100%;
  min-width: 0;
}

.cb-dashboard {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #fff;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 32px 65px -30px rgba(64,48,32,.35);
  font-family: 'Poppins', sans-serif;
}

.cb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eee;
}

.cb-project {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cb-project-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #f2ede5;
  color: #8b755b;
}

.cb-project-icon svg {
  width: 22px;
  height: 22px;
}

.cb-project strong,
.cb-project small {
  display: block;
}

.cb-project strong {
  font-size: 13px;
  font-weight: 600;
  color: #222;
}

.cb-project small {
  margin-top: 4px;
  font-size: 10px;
  color: #888;
}

.cb-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 20px;
  background: #edf3e9;
  color: #64805d;
  font-size: 10px;
  white-space: nowrap;
}

.cb-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Progress */

.cb-progress {
  margin-top: 20px;
}

.cb-progress-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #333;
}

.cb-progress-label strong {
  font-weight: 600;
}

.cb-progress-label span {
  color: #68835e;
  font-weight: 600;
}

.cb-progress-track {
  height: 8px;
  margin: 12px 0 8px;
  border-radius: 10px;
  background: #efede8;
  overflow: hidden;
}

.cb-progress-track i {
  display: block;
  width: 75%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #b2c2a5, #819675);
  transform-origin: left;
}

.cb-in .cb-progress-track i {
  animation: cb-grow 1.2s .2s ease both;
}

@keyframes cb-grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.cb-progress > small {
  font-size: 10px;
  color: #888;
}

/* Statistics */

.cb-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.cb-stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 12px;
  border: 1px solid #eeebe6;
  border-radius: 12px;
  background: #f8f6f2;
}

.cb-stat > span {
  font-size: 10px;
  color: #777;
}

.cb-stat strong {
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(20px, 1.8vw, 29px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.04em;
  color: #252525;
}

.cb-stat small {
  font-size: 9px;
  line-height: 1.4;
  color: #888;
}

.cb-stat-green {
  background: #edf3eb;
  border-color: #e4ece1;
}

.cb-stat-green strong {
  color: #5d7c58;
}

/* Milestones */

.cb-milestones {
  margin-top: 24px;
}

.cb-milestones h3 {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: #292929;
}

.cb-milestone {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.cb-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 24px;
  height: 24px;
  border: 1px dashed #c9c9c9;
  border-radius: 50%;
  color: #68865f;
}

.cb-complete .cb-check {
  border: 0;
  background: #e6efe2;
}

.cb-check svg {
  width: 13px;
  height: 13px;
}

.cb-milestone-copy {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.cb-milestone-copy strong {
  font-size: 11px;
  font-weight: 600;
  color: #333;
}

.cb-milestone-copy small {
  font-size: 10px;
  color: #888;
}

.cb-milestone-status {
  font-size: 10px;
  color: #999;
}

.cb-complete .cb-milestone-status {
  color: #68865f;
}

/* Customer update */

.cb-update {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  padding: 12px;
  border-radius: 12px;
  background: #edf3eb;
}

.cb-update-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: #fff;
  color: #68865f;
}

.cb-update-icon svg {
  width: 19px;
  height: 19px;
}

.cb-update > div {
  flex: 1;
}

.cb-update strong,
.cb-update small {
  display: block;
}

.cb-update strong {
  font-size: 11px;
  font-weight: 600;
  color: #374d34;
}

.cb-update small {
  margin-top: 4px;
  font-size: 10px;
  color: #778673;
}

.cb-shared {
  padding: 4px 8px;
  border-radius: 6px;
  background: #dcead7;
  font-size: 9px;
  color: #5b7856;
}

/* Entrance animation */

.cb-in .cb-copy {
  animation: cb-reveal .7s ease both;
}

.cb-in .cb-visual {
  animation: cb-reveal .8s .12s ease both;
}

@keyframes cb-reveal {
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

@media (max-width: 1000px) {
  .cb-panel {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .cb-copy p {
    max-width: 65ch;
  }
}

@media (max-width: 640px) {
  .cb {
    padding: 28px 16px;
  }

  .cb-panel {
    padding: 28px 18px;
    gap: 28px;
    border-radius: 26px;
  }

  .cb-copy h2 {
    font-size: 38px;
    margin-bottom: 18px;
  }

  .cb-copy p {
    font-size: 14px;
  }

  .cb-dashboard {
    padding: 14px;
    border-radius: 18px;
  }

  .cb-header {
    flex-wrap: wrap;
  }

  .cb-stats {
    gap: 6px;
  }

  .cb-stat {
    padding: 10px 8px;
  }

  .cb-stat strong {
    font-size: 20px;
  }

  .cb-stat > span,
  .cb-stat small {
    font-size: 9px;
  }

  .cb-milestone-copy small {
    font-size: 9px;
  }
}

@media (max-width: 380px) {
  .cb-stats {
    grid-template-columns: 1fr;
  }

  .cb-update {
    flex-wrap: wrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cb *,
  .cb *::before,
  .cb *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
