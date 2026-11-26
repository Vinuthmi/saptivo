
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'DistributorBenefits'
})

const root = ref(null)
const shown = ref(false)

let observer = null

const stats = [
  {
    label: 'Total sales',
    value: 'Rs. 4.8M',
    growth: '+12.8%',
    note: 'vs. previous month'
  },
  {
    label: 'Gross margin',
    value: '24.6%',
    growth: '+2.4%',
    note: 'vs. previous month'
  }
]

const territories = [
  { name: 'Western', value: 92, amount: '1.8M' },
  { name: 'Central', value: 65, amount: '1.2M' },
  { name: 'Southern', value: 52, amount: '980K' },
  { name: 'Northern', value: 43, amount: '820K' }
]

const controls = [
  {
    title: 'Dealer price books',
    note: 'Correct pricing applied',
    icon: `
      <path d="M3 3h7l11 11-7 7L3 10z"/>
      <circle cx="7.5" cy="7.5" r="1"/>
    `
  },
  {
    title: 'Credit control',
    note: 'Credit limits checked',
    icon: `
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/>
      <path d="m9 12 2 2 4-4"/>
    `
  },
  {
    title: 'Payment reminders',
    note: 'Automated follow-ups active',
    icon: `
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
      <path d="M10 21h4"/>
    `
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
    class="db"
    :class="{ 'db-in': shown }"
    aria-labelledby="db-title"
  >
    <div class="db-wrap">

      <div class="db-panel">

        <!-- Decorative background -->

        <span class="db-orbit db-orbit-one"></span>
        <span class="db-orbit db-orbit-two"></span>

        <!-- LEFT SIDE CONTENT -->

        <div class="db-copy">

          <h2 id="db-title">
            Benefits for
            <span>distributors</span>
          </h2>

          <p>
            Correct prices on every quote protect your
            margins. Credit control before the order,
            not after, reduces bad debt. Reps spend
            more time selling and less time checking
            stock or chasing payments. Management sees
            the whole distribution network in one place.
          </p>

        </div>

        <!-- RIGHT SIDE DASHBOARD -->

        <div class="db-visual" aria-hidden="true">

          <div class="db-dashboard">

            <!-- Dashboard header -->

            <div class="db-header">

              <div class="db-header-left">

                <span class="db-header-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </span>

                <div>
                  <strong>Distribution overview</strong>
                  <small>Network performance</small>
                </div>

              </div>

              <span class="db-period">
                This month
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>

            </div>

            <!-- Statistics -->

            <div class="db-stats">

              <div
                v-for="stat in stats"
                :key="stat.label"
                class="db-stat"
              >

                <span class="db-stat-label">
                  {{ stat.label }}
                </span>

                <strong>{{ stat.value }}</strong>

                <div class="db-stat-bottom">
                  <span class="db-growth">
                    {{ stat.growth }}
                  </span>

                  <small>{{ stat.note }}</small>
                </div>

              </div>

            </div>

            <!-- Territory chart -->

            <div class="db-chart">

              <div class="db-chart-header">
                <strong>Sales by territory</strong>
                <small>Revenue · LKR</small>
              </div>

              <div class="db-chart-body">

                <div
                  v-for="(territory, index) in territories"
                  :key="territory.name"
                  class="db-chart-row"
                  :style="{ '--i': index }"
                >

                  <span class="db-territory">
                    {{ territory.name }}
                  </span>

                  <div class="db-bar-track">
                    <i
                      :style="{
                        '--bar-width': territory.value + '%'
                      }"
                    ></i>
                  </div>

                  <span class="db-amount">
                    {{ territory.amount }}
                  </span>

                </div>

              </div>

            </div>

            <!-- Operational controls -->

            <div class="db-controls">

              <div
                v-for="control in controls"
                :key="control.title"
                class="db-control"
              >

                <span class="db-control-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    v-html="control.icon"
                  ></svg>

                </span>

                <div class="db-control-copy">
                  <strong>{{ control.title }}</strong>
                  <small>{{ control.note }}</small>
                </div>

                <span class="db-active">
                  <i></i>
                  Active
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.db,
.db * {
  box-sizing: border-box;
}

.db {
  width: 100%;
  padding: 40px clamp(24px, 4vw, 64px);
  background: #fff;
}

.db-wrap {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

/* Main panel */

.db-panel {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(40px, 6vw, 90px);
  padding: clamp(40px, 5vw, 72px);
  border-radius: 36px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #eef2eb 0%,
    #e2e9df 55%,
    #d5e0d2 100%
  );
}

/* Decorative circles */

.db-orbit {
  position: absolute;
  z-index: -1;
  border: 1px solid rgba(255, 255, 255, .75);
  border-radius: 50%;
  pointer-events: none;
}

.db-orbit-one {
  width: 740px;
  height: 740px;
  top: -220px;
  right: -200px;
}

.db-orbit-two {
  width: 590px;
  height: 590px;
  top: -145px;
  right: -125px;
}

/* Left content */

.db-copy h2 {
  margin: 0 0 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.db-copy h2 span {
  display: block;
  color: #85858d !important;
  -webkit-text-fill-color: #85858d;
}

.db-copy p {
  max-width: 52ch;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(14px, 1.15vw, 16px);
  line-height: 1.85;
  color: #5c655c;
}

/* Dashboard */

.db-visual {
  min-width: 0;
  width: 100%;
}

.db-dashboard {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, .9);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 65px -30px rgba(44, 65, 45, .35);
  font-family: 'Poppins', sans-serif;
}

/* Dashboard header */

.db-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eee;
}

.db-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.db-header-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 10px;
  background: #e9efe6;
  color: #527052;
}

.db-header-icon svg {
  width: 19px;
  height: 19px;
}

.db-header-left strong,
.db-header-left small {
  display: block;
}

.db-header-left strong {
  font-size: 13px;
  font-weight: 600;
  color: #202020;
}

.db-header-left small {
  margin-top: 3px;
  font-size: 10px;
  color: #888;
}

.db-period {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 10px;
  color: #666;
  white-space: nowrap;
}

.db-period svg {
  width: 12px;
  height: 12px;
}

/* Statistics */

.db-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.db-stat {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 18px;
  border: 1px solid #e9eee7;
  border-radius: 14px;
  background: #f6f8f5;
}

.db-stat-label {
  font-size: 11px;
  color: #777;
}

.db-stat > strong {
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(25px, 2.3vw, 36px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.045em;
  color: #202820;
}

.db-stat-bottom {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.db-growth {
  padding: 3px 7px;
  border-radius: 5px;
  background: #e1eee0;
  color: #407747;
  font-size: 10px;
  font-weight: 600;
}

.db-stat-bottom small {
  font-size: 9px;
  color: #888;
}

/* Territory chart */

.db-chart {
  margin-top: 24px;
}

.db-chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.db-chart-header strong {
  font-size: 13px;
  font-weight: 600;
  color: #292929;
}

.db-chart-header small {
  font-size: 10px;
  color: #888;
}

.db-chart-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.db-chart-row {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) 40px;
  align-items: center;
  gap: 12px;
}

.db-territory,
.db-amount {
  font-size: 10px;
  color: #666;
}

.db-amount {
  text-align: right;
}

.db-bar-track {
  height: 13px;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f2ef;
}

.db-bar-track i {
  display: block;
  width: var(--bar-width);
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #b7cbb2,
    #78967a
  );
  transform-origin: left;
}

.db-in .db-bar-track i {
  animation: db-grow 1.1s ease both;
  animation-delay: calc(.2s + var(--i) * .12s);
}

@keyframes db-grow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Operational controls */

.db-controls {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  border-top: 1px solid #eee;
}

.db-control {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.db-control:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.db-control-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #f2f5f0;
  color: #68856a;
}

.db-control-icon svg {
  width: 18px;
  height: 18px;
}

.db-control-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.db-control-copy strong {
  font-size: 11px;
  font-weight: 600;
  color: #303030;
}

.db-control-copy small {
  font-size: 10px;
  color: #888;
}

.db-active {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-radius: 20px;
  background: #e8f2e6;
  color: #528158;
  font-size: 9px;
  font-weight: 500;
}

.db-active i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

/* Entrance animation */

.db-in .db-copy {
  animation: db-reveal .7s ease both;
}

.db-in .db-visual {
  animation: db-reveal .8s .12s ease both;
}

@keyframes db-reveal {
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

@media (max-width: 1000px) {
  .db-panel {
    grid-template-columns: minmax(0, 1fr);
    padding: 40px;
    gap: 36px;
  }

  .db-copy p {
    max-width: 65ch;
  }
}

/* Mobile */

@media (max-width: 640px) {
  .db {
    padding: 28px 16px;
  }

  .db-panel {
    padding: 28px 18px;
    border-radius: 26px;
    gap: 28px;
  }

  .db-copy h2 {
    font-size: 38px;
    margin-bottom: 18px;
  }

  .db-copy p {
    font-size: 14px;
  }

  .db-dashboard {
    padding: 14px;
    border-radius: 18px;
  }

  .db-header-left strong {
    font-size: 11px;
  }

  .db-header-icon {
    width: 30px;
    height: 30px;
  }

  .db-period {
    padding: 6px;
    font-size: 9px;
  }

  .db-stats {
    gap: 8px;
  }

  .db-stat {
    padding: 12px;
  }

  .db-stat > strong {
    font-size: 25px;
  }

  .db-chart-row {
    grid-template-columns: 55px minmax(0, 1fr) 34px;
    gap: 8px;
  }

  .db-control-copy small {
    font-size: 9px;
  }
}

@media (max-width: 360px) {
  .db-header {
    flex-wrap: wrap;
  }

  .db-stat > strong {
    font-size: 21px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .db *,
  .db *::before,
  .db *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
