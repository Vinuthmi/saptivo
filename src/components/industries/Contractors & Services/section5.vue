
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'ContractorChallenges' })

const root = ref(null)
const shown = ref(false)
const photoOk = ref(true)

let observer = null

const photo =
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=85&auto=format&fit=crop'

const challenges = [
  {
    number: '01',
    problem: 'Enquiries lost in WhatsApp and missed calls',
    solution: 'Centralized lead capture',
    color: '#F3E8DA',
    icon: `
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5
      9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4
      A8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8z"/>
      <path d="M8 10h8M8 14h5"/>
    `
  },
  {
    number: '02',
    problem: 'Estimates rebuilt from scratch for every job',
    solution: 'Reusable estimates',
    color: '#E3E9F2',
    icon: `
      <path d="M14 2H6a2 2 0 0 0-2 2v16
      a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6M8 13h8M8 17h5"/>
    `
  },
  {
    number: '03',
    problem: 'Deposits and progress payments tracked in notebooks',
    solution: 'Milestone billing',
    color: '#E8E2EF',
    icon: `
      <rect x="3" y="5" width="18" height="15" rx="3"/>
      <path d="M3 10h18M7 15h4M15 15h2"/>
    `
  },
  {
    number: '04',
    problem: "Customers calling for updates because they can't see progress",
    solution: 'Customer portal',
    color: '#E1ECDF',
    icon: `
      <circle cx="9" cy="7" r="4"/>
      <path d="M2 21v-3a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v3"/>
      <path d="M17 4a4 4 0 0 1 0 8M19 14a5 5 0 0 1 3 5v2"/>
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
    class="cc"
    :class="{ 'cc-in': shown }"
    aria-labelledby="cc-title"
  >

    <div class="cc-wrap">

      <!-- Left content -->

      <div class="cc-copy">

        <h2 id="cc-title">
          Common problems
          <span>contractors face</span>
        </h2>

        <p>
          Saptivo solves each one with lead capture,
          reusable estimates, milestone billing and
          a customer portal.
        </p>

        <figure class="cc-photo">

          <img
            v-if="photoOk"
            :src="photo"
            alt=""
            loading="lazy"
            decoding="async"
            @error="photoOk = false"
          />

          <svg
            v-else
            class="cc-photo-fallback"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width=".7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 21h18M5 21V8l7-5v18"/>
            <path d="M12 10h7v11M8 10v2M8 15v2M15 14h1"/>
          </svg>

          <!-- Floating visual -->

          <div class="cc-photo-note">

            <span class="cc-note-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m5 12 5 5 9-10"/>
              </svg>
            </span>

            <div>
              <strong>Everything in one place</strong>
              <small>From enquiry to final payment</small>
            </div>

          </div>

        </figure>

      </div>

      <!-- Right problem-to-solution cards -->

      <div class="cc-list">

        <article
          v-for="(item, index) in challenges"
          :key="item.number"
          class="cc-card"
          :style="{
            '--bg': item.color,
            '--i': index
          }"
        >

          <div class="cc-card-top">

            <span class="cc-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                v-html="item.icon"
                aria-hidden="true"
              ></svg>

            </span>

            <span class="cc-number">
              {{ item.number }}
            </span>

          </div>

          <div class="cc-problem">

            <span class="cc-label">The challenge</span>

            <h3>{{ item.problem }}</h3>

          </div>

          <div class="cc-solution">

            <span class="cc-check">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m5 12 5 5 9-10"/>
              </svg>

            </span>

            <div class="cc-solution-copy">

              <small>Saptivo solution</small>

              <strong>{{ item.solution }}</strong>

            </div>

          </div>

        </article>

      </div>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.cc,
.cc * {
  box-sizing: border-box;
}

.cc {
  width: 100%;
  padding: clamp(48px, 6vw, 96px) 0;
  background: #fff;
}

.cc-wrap {
  display: grid;
  grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
  align-items: start;
  gap: clamp(40px, 7vw, 110px);
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(24px, 6vw, 96px);
}

/* Left content */

.cc-copy {
  position: sticky;
  top: 120px;
  min-width: 0;
}

.cc-copy h2 {
  margin: 0 0 22px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.cc-copy h2 span {
  display: block;
  background: linear-gradient(100deg, #a1a1aa, #777780);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cc-copy p {
  max-width: 48ch;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  line-height: 1.85;
  color: #666b73;
}

/* Photograph */

.cc-photo {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 340px;
  margin: 30px 0 0;
  overflow: hidden;
  border-radius: 26px;
  background: #e9e3da;
}

.cc-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.cc-photo-fallback {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 130px;
  height: 130px;
  color: #9c8e7c;
  transform: translate(-50%, -50%);
}

/* Floating note */

.cc-photo-note {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - 28px);
  margin: 14px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 10px 30px -15px rgba(0,0,0,.3);
  font-family: 'Poppins', sans-serif;
}

.cc-note-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #e5eee1;
  color: #63825e;
}

.cc-note-icon svg {
  width: 20px;
  height: 20px;
}

.cc-photo-note strong,
.cc-photo-note small {
  display: block;
}

.cc-photo-note strong {
  font-size: 12px;
  font-weight: 600;
  color: #292929;
}

.cc-photo-note small {
  margin-top: 4px;
  font-size: 10px;
  color: #888;
}

/* Challenge cards */

.cc-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cc-card {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 20px;
  padding: 26px;
  border-radius: 24px;
  background: var(--bg);
}

.cc-card-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.cc-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,.85);
  color: #292929;
}

.cc-icon svg {
  width: 23px;
  height: 23px;
}

.cc-number {
  font-family: 'Urbanist', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #777;
}

/* Problem */

.cc-problem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.cc-label {
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #777;
}

.cc-problem h3 {
  margin: 0;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(23px, 2vw, 29px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -.035em;
  color: #292929;
}

/* Solution */

.cc-solution {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(255,255,255,.8);
  border-radius: 14px;
  background: rgba(255,255,255,.6);
}

.cc-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e2eddf;
  color: #64835f;
}

.cc-check svg {
  width: 16px;
  height: 16px;
}

.cc-solution-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cc-solution-copy small {
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  color: #777;
}

.cc-solution-copy strong {
  font-family: 'Urbanist', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #303a2e;
}

/* Entrance animations */

.cc-in .cc-copy {
  animation: cc-reveal .8s ease both;
}

.cc-in .cc-card {
  animation: cc-reveal .7s ease both;
  animation-delay: calc(var(--i) * .1s);
}

@keyframes cc-reveal {
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
  .cc-wrap {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .cc-copy {
    position: relative;
    top: auto;
  }

  .cc-copy p {
    max-width: 65ch;
  }

  .cc-photo {
    min-height: 380px;
  }

  .cc-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Mobile */

@media (max-width: 640px) {
  .cc-wrap {
    padding: 0 20px;
    gap: 28px;
  }

  .cc-copy h2 {
    font-size: 36px;
    margin-bottom: 18px;
  }

  .cc-copy p {
    font-size: 14px;
  }

  .cc-photo {
    min-height: 270px;
    margin-top: 24px;
    border-radius: 22px;
  }

  .cc-list {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .cc-card {
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 16px;
    padding: 20px;
    border-radius: 22px;
  }

  .cc-icon {
    width: 42px;
    height: 42px;
  }

  .cc-icon svg {
    width: 20px;
    height: 20px;
  }

  .cc-problem h3 {
    font-size: 25px;
  }

  .cc-solution {
    padding: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cc-in .cc-copy,
  .cc-in .cc-card {
    animation: none;
  }
}
</style>
