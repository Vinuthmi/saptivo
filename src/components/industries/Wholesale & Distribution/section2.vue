
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'DistributorWorkflow'
})

const root = ref(null)
const shown = ref(false)

let observer = null

const steps = [
  {
    number: '01',
    label: 'Dealer inquiry',
    title: 'From message to quotation',
    description:
      "A dealer messages for a price on WhatsApp; the rep sends a quotation using the dealer's price book.",
    color: '#F3E7D9',
    accent: '#A7835E',
    icon: `
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5
      9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4
      A8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8z"/>
      <path d="M8 10h8M8 14h5"/>
    `
  },
  {
    number: '02',
    label: 'Credit control',
    title: 'Check before confirming',
    description:
      "Saptivo checks the dealer's credit limit before the order is confirmed.",
    color: '#E1ECDF',
    accent: '#6C9471',
    icon: `
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/>
      <path d="m9 12 2 2 4-4"/>
    `
  },
  {
    number: '03',
    label: 'Order fulfilment',
    title: 'Invoice and update stock',
    description:
      'The invoice is issued and stock deducts from the right warehouse.',
    color: '#DFE9F4',
    accent: '#728FAF',
    icon: `
      <path d="m3 9 9-6 9 6v12H3z"/>
      <path d="M7 21V11h10v10M7 15h10M7 18h10"/>
    `
  },
  {
    number: '04',
    label: 'Payment collection',
    title: 'Stay ahead of due dates',
    description:
      'Payment reminders go out automatically as the due date approaches.',
    color: '#EDE3F0',
    accent: '#9C82AD',
    icon: `
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
      <path d="M10 21h4"/>
      <path d="M12 2v2"/>
    `
  },
  {
    number: '05',
    label: 'Management review',
    title: 'See the bigger picture',
    description:
      'Managers review sales, margins and overdue balances by territory each week.',
    color: '#ECE8DC',
    accent: '#A09572',
    icon: `
      <path d="M3 3v18h18"/>
      <rect x="7" y="12" width="3" height="5" rx="1"/>
      <rect x="12" y="8" width="3" height="9" rx="1"/>
      <rect x="17" y="4" width="3" height="13" rx="1"/>
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
    { threshold: 0.12 }
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
    class="dw"
    :class="{ 'dw-in': shown }"
    aria-labelledby="dw-title"
  >
    <div class="dw-wrap">

      <!-- Heading -->

      <header class="dw-header">
        <h2 id="dw-title">
          How distributors <span>use Saptivo</span>
        </h2>
      </header>

      <!-- Workflow -->

      <ol class="dw-grid">

        <li
          v-for="(step, index) in steps"
          :key="step.number"
          class="dw-step"
          :style="{
            '--card-bg': step.color,
            '--accent': step.accent,
            '--i': index
          }"
        >

          <!-- Connected timeline -->

          <div class="dw-timeline">
            <span class="dw-number">
              {{ step.number }}
            </span>

            <span class="dw-line"></span>
          </div>

          <!-- Workflow card -->

          <article class="dw-card">

            <div class="dw-card-top">

              <span class="dw-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  v-html="step.icon"
                  aria-hidden="true"
                ></svg>
              </span>

              <span class="dw-label">
                {{ step.label }}
              </span>

            </div>

            <!-- Decorative oversized icon -->

            <svg
              class="dw-decoration"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width=".55"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="step.icon"
              aria-hidden="true"
            ></svg>

            <div class="dw-content">

              <h3>{{ step.title }}</h3>

              <p>{{ step.description }}</p>

            </div>

          </article>

        </li>

      </ol>

    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.dw,
.dw * {
  box-sizing: border-box;
}

.dw {
  width: 100%;
  background: #fff;
  padding: clamp(48px, 6vw, 96px) 0;
}

.dw-wrap {
  width: 100%;
  max-width: 1700px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 80px);
}

/* Heading */

.dw-header {
  margin-bottom: clamp(36px, 5vw, 64px);
  text-align: center;
}

.dw-header h2 {
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.dw-header h2 span {
  background: linear-gradient(
    100deg,
    #a1a1aa,
    #777780
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Workflow grid */

.dw-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dw-step {
  min-width: 0;
}

.dw-in .dw-step {
  animation: dw-reveal .7s ease both;
  animation-delay: calc(var(--i) * .12s);
}

@keyframes dw-reveal {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Timeline */

.dw-timeline {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.dw-number {
  display: grid;
  place-items: center;
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #252525;
  color: #fff;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.dw-line {
  flex: 1;
  height: 1px;
  margin-right: -2px;
  background: #d9d9de;
}

.dw-step:last-child .dw-line {
  display: none;
}

/* Cards */

.dw-card {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 350px;
  height: calc(100% - 58px);
  padding: clamp(20px, 1.8vw, 28px);
  gap: 50px;
  overflow: hidden;
  border-radius: 24px;
  background: var(--card-bg);
}

.dw-card-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.dw-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .8);
  color: #292929;
}

.dw-icon svg {
  width: 23px;
  height: 23px;
}

.dw-label {
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: #5e5e5e;
}

/* Decorative illustration */

.dw-decoration {
  position: absolute;
  z-index: -1;
  top: 38px;
  right: -42px;
  width: 190px;
  height: 190px;
  color: var(--accent);
  opacity: .18;
  transform: rotate(-12deg);
  pointer-events: none;
}

.dw-content {
  position: relative;
}

.dw-content h3 {
  margin: 0 0 14px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(23px, 1.8vw, 29px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -.035em;
  color: #171717;
}

.dw-content p {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  line-height: 1.75;
  color: #55565b;
}

/* Responsive */

@media (max-width: 1150px) {
  .dw-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 24px 16px;
  }

  .dw-step {
    grid-column: span 2;
  }

  .dw-step:nth-child(4),
  .dw-step:nth-child(5) {
    grid-column: span 3;
  }

  .dw-step:nth-child(3) .dw-line {
    display: none;
  }

  .dw-card {
    min-height: 300px;
  }
}

@media (max-width: 700px) {
  .dw-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 12px;
  }

  .dw-step,
  .dw-step:nth-child(4),
  .dw-step:nth-child(5) {
    grid-column: auto;
  }

  .dw-step:last-child {
    grid-column: 1 / -1;
  }

  .dw-step:nth-child(2n) .dw-line {
    display: none;
  }

  .dw-card {
    min-height: 290px;
    padding: 20px;
    gap: 40px;
    border-radius: 20px;
  }

  .dw-content h3 {
    font-size: 25px;
  }
}

@media (max-width: 480px) {
  .dw-wrap {
    padding: 0 20px;
  }

  .dw-header h2 {
    font-size: 36px;
  }

  .dw-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .dw-step {
    grid-column: auto !important;
  }

  .dw-card {
    min-height: 250px;
    gap: 38px;
  }

  .dw-card-top {
    flex-direction: row;
    align-items: center;
  }

  .dw-timeline .dw-line {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dw-in .dw-step {
    animation: none;
  }
}
</style>
