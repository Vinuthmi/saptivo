
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'HowIndustrySetup' })

const active = ref(0)
const root = ref(null)
const inView = ref(false)

let timer = null
let observer = null

const steps = [
  {
    id: 'configure',
    number: '01',
    tag: 'Industry configuration',
    title: 'Configured around your industry.',
    description:
      'We set up pipelines, custom fields, checklists and reports to match the way your business operates.',
    details: ['Sales pipelines', 'Custom fields', 'Checklists & reports'],
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=85&auto=format&fit=crop',
    visualTitle: 'Industry workspace',
    visualItems: [
      ['Sales pipeline', 'Configured'],
      ['Custom fields', 'Added'],
      ['Reports', 'Ready'],
    ],
  },
  {
    id: 'import',
    number: '02',
    tag: 'Business data migration',
    title: 'Your business data, brought together.',
    description:
      'We import your existing customer and product information so your team can continue working with organised business data.',
    details: ['Customer records', 'Product information', 'Organised data'],
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop',
    visualTitle: 'Data import',
    visualItems: [
      ['Customers', 'Imported'],
      ['Products', 'Imported'],
      ['Business data', 'Organised'],
    ],
  },
  {
    id: 'training',
    number: '03',
    tag: 'Team onboarding',
    title: 'Your team, ready to get started.',
    description:
      'We train your staff to use the configured system, helping your team get started with a CRM that already speaks your business language.',
    details: ['Staff training', 'System walkthrough', 'Ready to get started'],
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=85&auto=format&fit=crop',
    visualTitle: 'Team onboarding',
    visualItems: [
      ['Team training', 'Completed'],
      ['System walkthrough', 'Ready'],
      ['CRM setup', 'Complete'],
    ],
  },
]

function select(index) {
  active.value = (index + steps.length) % steps.length
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      inView.value = entry.isIntersecting
    },
    { threshold: 0.1 }
  )

  if (root.value) observer.observe(root.value)

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (!reducedMotion) {
    timer = setInterval(() => {
      if (inView.value && !document.hidden) {
        select(active.value + 1)
      }
    }, 6500)
  }
})

onBeforeUnmount(() => {
  clearInterval(timer)
  observer?.disconnect()
})
</script>

<template>
  <section class="his" ref="root" aria-labelledby="his-title">
    <div class="his-wrap">

      <!-- Heading -->
      <div class="his-heading">
        <h2 id="his-title">
          How industry <em>setup works.</em>
        </h2>

        <p>
          From configuration to team training, we prepare Saptivo around
          your business so you can get started without building a CRM
          from scratch.
        </p>
      </div>

      <!-- Interactive panels -->
      <div class="his-panels">
        <article
          v-for="(step, i) in steps"
          :key="step.id"
          class="his-panel"
          :class="{ active: active === i }"
          :style="{ '--i': i, '--panel-image': `url('${step.image}')` }"
          role="button"
          tabindex="0"
          :aria-expanded="active === i"
          @click="select(i)"
          @pointerenter="active = i"
          @keydown.enter.prevent="select(i)"
          @keydown.space.prevent="select(i)"
          @keydown.right.prevent="select(i + 1)"
          @keydown.left.prevent="select(i - 1)"
        >

          <div class="his-bg"></div>

          <!-- Top label -->
          <div class="his-tag">
            {{ step.tag }}
          </div>

          <!-- Floating UI preview -->
          <div class="his-preview">
            <div class="preview-head">
              <span class="preview-dot"></span>
              <b>{{ step.visualTitle }}</b>
              <span class="preview-status">Ready</span>
            </div>

            <div class="preview-body">
              <div
                v-for="(item, n) in step.visualItems"
                :key="item[0]"
                class="preview-item"
                :style="{ '--item': n }"
              >
                <span class="preview-check">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 10.5L8 14L16 6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>

                <span class="preview-label">{{ item[0] }}</span>
                <span class="preview-value">{{ item[1] }}</span>
              </div>
            </div>

            <div class="preview-footer">
              <span> Saptivo onboarding </span>
              <span class="preview-live">
                <i></i> In progress
              </span>
            </div>
          </div>

          <!-- Card content -->
          <div class="his-content">
            <span class="his-step">STEP {{ step.number }}</span>

            <h3>{{ step.title }}</h3>

            <div class="his-description">
              <p>{{ step.description }}</p>

              <ul>
                <li v-for="detail in step.details" :key="detail">
                  <span class="detail-check">✓</span>
                  {{ detail }}
                </li>
              </ul>
            </div>
          </div>

        </article>
      </div>

    </div>
  </section>
</template>

<style scoped>
.his,
.his * {
  box-sizing: border-box;
}

.his {
  background-color: #ffffff;
  color: #0f172a;
  font-family: 'Poppins', system-ui, sans-serif;
  padding: clamp(55px, 7vw, 100px) 20px;
}

.his-wrap {
  max-width: 1280px;
  margin: 0 auto;
}

/* Heading */

.his-heading {
  max-width: 760px;
  margin: 0 auto 42px;
  text-align: center;
}

.his-heading h2 {
  margin: 0;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.055em;
}

.his-heading h2 em {
  font-style: normal;
  background: linear-gradient(100deg, #ff9a3d, #ff6a1a, #f2540c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.his-heading > p {
  max-width: 720px;
  margin: 14px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1.1vw, 18px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.015em;
  color: #475569;
}

/* Cards */

.his-panels {
  display: flex;
  gap: 14px;
  height: clamp(470px, 43vw, 570px);
}

.his-panel {
  position: relative;
  isolation: isolate;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 0;
  overflow: hidden;
  padding: 24px;
  border-radius: 25px;
  color: #fff;
  background: #211d1b;
  cursor: pointer;
  outline: none;
  transition:
    flex-grow 0.8s cubic-bezier(.2,.8,.2,1),
    border-radius 0.4s ease;
}

.his-panel.active {
  flex-grow: 2.2;
  cursor: default;
}

.his-panel:focus-visible {
  box-shadow: 0 0 0 3px #f2540c;
}

/* Background images */

.his-bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image: var(--panel-image);
  background-position: center;
  background-size: cover;
  filter: brightness(.75) saturate(.85);
  transform: scale(1.04);
  transition:
    transform 1.2s ease,
    filter .6s ease;
}

.his-panel.active .his-bg {
  transform: scale(1);
  filter: brightness(.8) saturate(1);
}

.his-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    180deg,
    rgba(10, 12, 20, .12) 0%,
    rgba(10, 12, 20, .2) 35%,
    rgba(10, 12, 20, .8) 100%
  );
}

/* Top tag */

.his-tag {
  position: absolute;
  top: 23px;
  left: 23px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 8px 14px;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 50px;
  background: rgba(20,20,25,.4);
  backdrop-filter: blur(12px);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

/* Preview UI */

.his-preview {
  position: absolute;
  top: 75px;
  left: 22px;
  width: min(390px, calc(100% - 44px));
  padding: 14px;
  border: 1px solid rgba(255,255,255,.7);
  border-radius: 17px;
  color: #14152b;
  background: rgba(255,255,255,.95);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 50px rgba(0,0,0,.25);
  opacity: 0;
  transform: translateY(15px);
  pointer-events: none;
  transition:
    opacity .5s ease,
    transform .6s ease;
}

.his-panel.active .his-preview {
  opacity: 1;
  transform: translateY(0);
  transition-delay: .2s;
}

.preview-head {
  display: flex;
  align-items: center;
  gap: 9px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eceef2;
  font-size: 12px;
}

.preview-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #f2540c;
}

.preview-head b {
  font-weight: 600;
}

.preview-status {
  margin-left: auto;
  padding: 4px 9px;
  border-radius: 30px;
  color: #15803d;
  background: #dcfce7;
  font-size: 10px;
}

.preview-body {
  display: grid;
  gap: 7px;
  margin-top: 12px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px;
  border-radius: 10px;
  background: #f8f6f2;
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity .4s ease, transform .4s ease;
  transition-delay: calc(var(--item) * .12s);
}

.his-panel.active .preview-item {
  opacity: 1;
  transform: none;
}

.preview-check {
  display: grid;
  place-items: center;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  color: #f2540c;
  background: #fff0e7;
}

.preview-check svg {
  width: 14px;
  height: 14px;
}

.preview-label {
  flex: 1;
  font-size: 11px;
  font-weight: 500;
}

.preview-value {
  color: #15803d;
  font-size: 10px;
  font-weight: 600;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #eceef2;
  color: #64748b;
  font-size: 10px;
}

.preview-live {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #15803d;
}

.preview-live i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
}

/* Content */

.his-content {
  position: relative;
  z-index: 2;
  max-width: 520px;
}

.his-step {
  display: block;
  margin-bottom: 10px;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .13em;
}

.his-content h3 {
  margin: 0;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(19px, 2vw, 27px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -.035em;
}

.his-description {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows .6s ease,
    opacity .4s ease;
}

.his-panel.active .his-description {
  grid-template-rows: 1fr;
  opacity: 1;
}

.his-description p {
  overflow: hidden;
  margin: 12px 0 0;
  color: rgba(255,255,255,.85);
  font-size: 13px;
  line-height: 1.7;
}

.his-description ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  padding: 0;
  margin: 14px 0 0;
}

.his-description li {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,.9);
  font-size: 11px;
}

.detail-check {
  color: #ff9a3d;
  font-weight: 700;
}

/* Responsive */

@media (max-width: 860px) {
  .his-panels {
    flex-direction: column;
    height: auto;
  }

  .his-panel {
    flex: none;
    height: 100px;
    padding: 20px;
    border-radius: 20px;
    transition: height .65s ease;
  }

  .his-panel.active {
    height: 490px;
  }

  .his-preview {
    top: 65px;
    left: 20px;
    width: min(390px, calc(100% - 40px));
  }

  .his-tag {
    top: 19px;
    left: 20px;
  }

  .his-content h3 {
    font-size: 23px;
  }

}

@media (max-width: 480px) {
  .his {
    padding: 55px 16px;
  }

  .his-heading {
    margin-bottom: 30px;
  }

  .his-panel.active {
    height: 510px;
  }

  .his-description li {
    font-size: 10px;
  }

}

@media (prefers-reduced-motion: reduce) {
  .his *,
  .his *::before,
  .his *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
