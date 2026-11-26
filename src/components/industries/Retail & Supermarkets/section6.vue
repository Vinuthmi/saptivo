
<template>
  <section
    ref="rootEl"
    class="rb"
    :class="{ 'rb-in': revealed }"
    aria-labelledby="rb-title"
  >

    <div class="rb-wrap">

      <div class="rb-panel">

        <span class="rb-orbit rb-orbit-one"></span>
        <span class="rb-orbit rb-orbit-two"></span>

        <!-- LEFT SIDE -->

        <div class="rb-copy">

          <h2 id="rb-title" class="rb-title">
            The benefits for <em>your stores</em>
          </h2>

          <p class="rb-lead">
            Retail CRM software turns anonymous
            transactions into relationships. You'll know
            who your best customers are, why they come
            back and what makes them spend more, and
            you'll have a direct channel to bring them
            back when they drift away.
          </p>

        </div>

        <!-- RIGHT SIDE CUSTOMER MOCKUP -->

        <div
          class="rb-visual"
          role="img"
          aria-label="Illustrative customer profile with purchase history, loyalty membership and personalized offers"
        >

          <div class="rb-window">

            <!-- Dashboard header -->

            <div class="rb-window-head">

              <span class="rb-dots">
                <i></i>
                <i></i>
                <i></i>
              </span>

              <strong>Customer overview</strong>

              <span class="rb-crm">CRM</span>

            </div>

            <!-- Customer profile -->

            <div class="rb-profile">

              <div class="rb-avatar">

                <img
                  v-if="!avatarFailed"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69da69?w=160&h=160&q=85&fit=crop&crop=faces"
                  alt=""
                  loading="lazy"
                  @error="avatarFailed = true"
                />

                <span v-else>SW</span>

              </div>

              <div class="rb-profile-text">

                <strong>Sarah Wilson</strong>

                <small>Returning customer</small>

              </div>

              <span class="rb-tier">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                >
                  <path d="m12 3 3 6 7 1-5 5
                           1 7-6-3-6 3 1-7-5-5 7-1z"/>
                </svg>

                Gold member

              </span>

            </div>

            <!-- Customer statistics -->

            <div class="rb-stats">

              <div
                v-for="stat in stats"
                :key="stat.label"
                class="rb-stat"
              >

                <span>{{ stat.label }}</span>

                <strong>{{ stat.value }}</strong>

                <small>{{ stat.note }}</small>

              </div>

            </div>

            <!-- Purchase activity chart -->

            <div class="rb-chart">

              <div class="rb-chart-head">

                <strong>Purchase activity</strong>

                <span>Last 12 months</span>

              </div>

              <div class="rb-chart-body">

                <div class="rb-gridlines">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <div class="rb-bars">

                  <div
                    v-for="(bar, i) in bars"
                    :key="i"
                    class="rb-bar-col"
                  >

                    <div
                      class="rb-bar"
                      :class="{ 'rb-highlight': i > 8 }"
                      :style="{
                        '--height': bar + '%',
                        '--i': i
                      }"
                    ></div>

                  </div>

                </div>

              </div>

              <div class="rb-chart-labels">
                <span>Jan</span>
                <span>Apr</span>
                <span>Jul</span>
                <span>Oct</span>
                <span>Dec</span>
              </div>

            </div>

            <!-- Offer notification -->

            <div class="rb-offer">

              <span class="rb-offer-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 11.5a9 9 0 0 1-9 9
                           9 9 0 0 1-4-.9L3 21l1.4-5
                           A9 9 0 1 1 21 11.5z"/>
                  <path d="m8 12 3 3 5-6"/>
                </svg>

              </span>

              <div>

                <strong>Personalized offer</strong>

                <small>Ready to reconnect with your customer</small>

              </div>

              <span class="rb-offer-status">Ready</span>

            </div>

          </div>

        </div>

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
  name: 'RetailBenefits'
})

const rootEl = ref(null)
const revealed = ref(false)
const avatarFailed = ref(false)

const stats = [
  {
    label: 'Lifetime value',
    value: 'Rs. 48,500',
    note: 'Customer spending'
  },
  {
    label: 'Total purchases',
    value: '24',
    note: 'Returning shopper'
  },
  {
    label: 'Reward points',
    value: '1,240',
    note: 'Available points'
  }
]

const bars = [
  28, 42, 35, 52, 45, 62,
  50, 70, 58, 85, 74, 96
]

let io = null

onMounted(() => {
  if (!rootEl.value || !('IntersectionObserver' in window)) {
    revealed.value = true
    return
  }

  io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      revealed.value = true
      io.disconnect()
    }
  }, {
    threshold: 0.15
  })

  io.observe(rootEl.value)
})

onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.rb,
.rb * {
  box-sizing: border-box;
}

.rb {
  width: 100%;

  font-family: 'Poppins', sans-serif;

  background: #fff;
  color: #0f172a;
}

.rb-wrap {
  max-width: 1700px;

  margin: 0 auto;

  padding: 28px clamp(16px, 2vw, 32px);
}

/* Main panel */

.rb-panel {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;

  gap: clamp(28px, 5vw, 80px);

  padding:
    clamp(32px, 4vw, 60px)
    clamp(24px, 6vw, 96px);

  border-radius: clamp(22px, 2.5vw, 36px);

  background: linear-gradient(
    135deg,
    #f4f1eb 0%,
    #eae4da 65%,
    #e4ded5 100%
  );
}

/* Decorative background */

.rb-orbit {
  position: absolute;
  z-index: -1;

  width: 650px;
  height: 650px;

  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;

  pointer-events: none;
}

.rb-orbit-one {
  top: -260px;
  right: -120px;
}

.rb-orbit-two {
  top: -180px;
  right: -200px;
}

/* Left content */

.rb-copy {
  min-width: 0;
}

.rb-title {
  margin: 0;
  padding-bottom: 0.1em;

  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.05em;

  color: #171717 !important;

  text-wrap: balance;
}

.rb-title em {
  font-style: normal;
  color: #8b8074 !important;
}

.rb-lead {
  max-width: 35em;

  margin: 20px 0 0;

  font-size: clamp(14px, 1.15vw, 17px);
  line-height: 1.8;

  color: #57534e;
}

/* Dashboard */

.rb-visual {
  min-width: 0;
}

.rb-window {
  width: 100%;
  max-width: 570px;

  margin: 0 auto;
  padding: 20px;

  border: 1px solid #fff;
  border-radius: 24px;

  background: #fff;

  box-shadow: 0 32px 60px -30px rgba(63, 51, 40, 0.3);
}

.rb-window-head {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0 0 14px;

  border-bottom: 1px solid #f0f0f2;
}

.rb-window-head strong {
  font-size: 12px;
  font-weight: 600;
}

.rb-dots {
  display: flex;
  gap: 4px;
}

.rb-dots i {
  width: 7px;
  height: 7px;

  border-radius: 50%;
  background: #dedee3;
}

.rb-crm {
  margin-left: auto;

  font-size: 10px;
  color: #94a3b8;
}

/* Customer profile */

.rb-profile {
  display: flex;
  align-items: center;
  gap: 12px;

  margin: 18px 0;
}

.rb-avatar {
  flex: none;

  display: grid;
  place-items: center;

  width: 50px;
  height: 50px;

  border-radius: 50%;
  overflow: hidden;

  background: #f0e8dd;
  color: #76604b;

  font-weight: 600;
}

.rb-avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.rb-profile-text {
  display: flex;
  flex: 1;
  min-width: 0;

  flex-direction: column;
  gap: 4px;
}

.rb-profile-text strong {
  font-size: 14px;
  font-weight: 600;
}

.rb-profile-text small {
  font-size: 11px;
  color: #94a3b8;
}

.rb-tier {
  flex: none;

  display: flex;
  align-items: center;
  gap: 5px;

  padding: 7px 10px;

  border-radius: 999px;

  background: #f7efda;
  color: #967331;

  font-size: 10px;
  font-weight: 500;
}

.rb-tier svg {
  width: 13px;
  height: 13px;
}

/* Statistics */

.rb-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 8px;
}

.rb-stat {
  display: flex;
  flex-direction: column;
  gap: 7px;

  min-width: 0;
  padding: 13px 11px;

  border: 1px solid #efeff1;
  border-radius: 13px;

  background: #fafafa;
}

.rb-stat > span {
  font-size: 10px;
  color: #71717a;
}

.rb-stat strong {
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(16px, 1.5vw, 23px);
  font-weight: 700;
  letter-spacing: -0.035em;
  overflow-wrap: anywhere;
}

.rb-stat small {
  font-size: 9px;
  line-height: 1.4;
  color: #94a3b8;
}

/* Chart */

.rb-chart {
  margin-top: 20px;
}

.rb-chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;
}

.rb-chart-head strong {
  font-size: 12px;
  font-weight: 600;
}

.rb-chart-head span {
  font-size: 10px;
  color: #94a3b8;
}

.rb-chart-body {
  position: relative;

  height: 90px;
  margin-top: 16px;
}

.rb-gridlines {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rb-gridlines i {
  display: block;

  border-top: 1px dashed #e9e9ed;
}

.rb-bars {
  position: relative;

  display: flex;
  align-items: flex-end;

  height: 100%;
  gap: 8px;
}

.rb-bar-col {
  flex: 1;

  display: flex;
  align-items: flex-end;

  height: 100%;
}

.rb-bar {
  width: 100%;
  height: var(--height);

  border-radius: 5px 5px 2px 2px;

  background: #e5e0d8;

  transform-origin: bottom;
}

.rb-highlight {
  background: #d69b70;
}

.rb-in .rb-bar {
  animation: rb-grow 0.85s
    cubic-bezier(0.2, 0.8, 0.2, 1)
    calc(0.3s + var(--i) * 0.06s) both;
}

@keyframes rb-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

.rb-chart-labels {
  display: flex;
  justify-content: space-between;

  margin-top: 9px;

  font-size: 9px;
  color: #94a3b8;
}

/* Offer notification */

.rb-offer {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-top: 18px;
  padding: 12px;

  border-radius: 13px;

  background: #edf5ed;
}

.rb-offer-icon {
  flex: none;

  display: grid;
  place-items: center;

  width: 34px;
  height: 34px;

  border-radius: 10px;

  background: #dcebdc;
  color: #477950;
}

.rb-offer-icon svg {
  width: 20px;
  height: 20px;
}

.rb-offer > div {
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 3px;
}

.rb-offer strong {
  font-size: 11px;
  font-weight: 600;
  color: #365e3d;
}

.rb-offer small {
  font-size: 10px;
  line-height: 1.5;
  color: #64806a;
}

.rb-offer-status {
  flex: none;

  font-size: 10px;
  font-weight: 500;
  color: #477950;
}

/* Reveal */

.rb-in .rb-copy {
  animation: rb-reveal 0.8s ease both;
}

.rb-in .rb-visual {
  animation: rb-reveal 0.9s ease 0.15s both;
}

@keyframes rb-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */

@media (max-width: 1000px) {
  .rb-panel {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }

  .rb-lead {
    max-width: 45em;
  }
}

@media (max-width: 560px) {
  .rb-wrap {
    padding: 16px;
  }

  .rb-panel {
    padding: 28px 18px;
    gap: 24px;
    border-radius: 24px;
  }

  .rb-title {
    font-size: 36px;
  }

  .rb-lead {
    margin-top: 14px;
    font-size: 14px;
  }

  .rb-window {
    padding: 12px;
    border-radius: 18px;
  }

  .rb-profile {
    gap: 8px;
  }

  .rb-avatar {
    width: 38px;
    height: 38px;
  }

  .rb-profile-text strong {
    font-size: 12px;
  }

  .rb-profile-text small {
    font-size: 10px;
  }

  .rb-tier {
    font-size: 9px;
    padding: 5px 6px;
  }

  .rb-stats {
    gap: 5px;
  }

  .rb-stat {
    padding: 10px 7px;
  }

  .rb-stat strong {
    font-size: 17px;
  }

  .rb-stat > span,
  .rb-stat small {
    font-size: 9px;
  }

  .rb-bars {
    gap: 5px;
  }

  .rb-offer {
    padding: 9px;
    gap: 7px;
  }
}

@media (max-width: 360px) {
  .rb-profile {
    flex-wrap: wrap;
  }

  .rb-stats {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rb *,
  .rb *::before,
  .rb *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
