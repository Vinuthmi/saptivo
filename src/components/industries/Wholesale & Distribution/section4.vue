
<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount
} from 'vue'

defineOptions({
  name: 'DistributorScale'
})

const base = import.meta.env.BASE_URL
const logo = `${base}saptivo-logo.png`

const root = ref(null)
const shown = ref(false)
const logoOk = ref(true)
const active = ref(1)
const reducedMotion = ref(false)

let observer = null
let timer = null

const nodes = [
  {
    title: 'Warehouses',
    subtitle: 'Inventory management',
    position: 'top',
    icon: `
      <path d="m3 9 9-6 9 6v12H3z"/>
      <path d="M7 21V11h10v10M7 15h10M7 18h10"/>
    `
  },
  {
    title: 'Territories',
    subtitle: 'Regional coverage',
    position: 'right',
    icon: `
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/>
      <path d="M9 3v15M15 6v15"/>
    `
  },
  {
    title: 'Sales reps',
    subtitle: 'Connected sales teams',
    position: 'bottom',
    icon: `
      <circle cx="9" cy="7" r="4"/>
      <path d="M2 21v-3a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v3"/>
      <path d="M17 4a4 4 0 0 1 0 8M19 14a5 5 0 0 1 3 5v2"/>
    `
  },
  {
    title: 'Reseller partners',
    subtitle: 'Partner networks',
    position: 'left',
    icon: `
      <rect x="3" y="3" width="6" height="6" rx="1.5"/>
      <rect x="15" y="15" width="6" height="6" rx="1.5"/>
      <rect x="3" y="15" width="6" height="6" rx="1.5"/>
      <path d="M6 9v6M9 18h6M6 12h12v3"/>
    `
  }
]

function start() {
  if (timer || reducedMotion.value) return

  timer = setInterval(() => {
    active.value = active.value >= 7
      ? 1
      : active.value + 1
  }, 1300)
}

function stop() {
  clearInterval(timer)
  timer = null
}

onMounted(() => {
  reducedMotion.value = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (
    reducedMotion.value ||
    !('IntersectionObserver' in window)
  ) {
    shown.value = true
    active.value = 4
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        shown.value = true
        start()
      } else {
        stop()
      }
    },
    { threshold: 0.2 }
  )

  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
})
</script>

<template>
  <section
    ref="root"
    class="ds"
    :class="{ 'ds-in': shown }"
    aria-labelledby="ds-title"
  >

    <div class="ds-wrap">

      <!-- LEFT SIDE NETWORK VISUAL -->

      <div class="ds-visual" aria-hidden="true">

        <div class="ds-visual-header">

          <span class="ds-visual-label">
            Distribution network
          </span>

          <span class="ds-status">
            <i></i>
            Connected
          </span>

        </div>

        <div class="ds-network">

          <!-- Background network rings -->

          <div class="ds-ring ds-ring-one"></div>
          <div class="ds-ring ds-ring-two"></div>
          <div class="ds-ring ds-ring-three"></div>

          <!-- Connection lines -->

          <svg
            class="ds-connections"
            viewBox="0 0 500 500"
            preserveAspectRatio="none"
          >

            <line
              x1="250"
              y1="250"
              x2="250"
              y2="60"
              :class="{ connected: active >= 1 }"
            />

            <line
              x1="250"
              y1="250"
              x2="440"
              y2="250"
              :class="{ connected: active >= 2 }"
            />

            <line
              x1="250"
              y1="250"
              x2="250"
              y2="440"
              :class="{ connected: active >= 3 }"
            />

            <line
              x1="250"
              y1="250"
              x2="60"
              y2="250"
              :class="{ connected: active >= 4 }"
            />

          </svg>

          <!-- Central Saptivo hub -->

          <div class="ds-hub">

            <span class="ds-hub-indicator">
              <i></i>
            </span>

            <img
              v-if="logoOk"
              :src="logo"
              alt=""
              draggable="false"
              @error="logoOk = false"
            />

            <strong v-else class="ds-logo-fallback">
              Saptivo
            </strong>

            <span>Central CRM</span>

          </div>

          <!-- Network nodes -->

          <div
            v-for="(node, index) in nodes"
            :key="node.title"
            class="ds-node"
            :class="[
              'ds-node-' + node.position,
              { 'ds-node-active': active >= index + 1 }
            ]"
          >

            <span class="ds-node-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                v-html="node.icon"
              ></svg>

            </span>

            <strong>{{ node.title }}</strong>

            <small>{{ node.subtitle }}</small>

            <span class="ds-node-dot"></span>

          </div>

        </div>

        <!-- Network status footer -->

        <div class="ds-visual-footer">

          <div class="ds-footer-copy">

            <span class="ds-footer-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 17l6-6 4 4 8-10"/>
                <path d="M15 5h6v6"/>
              </svg>
            </span>

            <div>
              <strong>One connected network</strong>
              <small>Built for growing businesses</small>
            </div>

          </div>

          <span class="ds-count">
            {{ Math.min(active, 4) }}/4 connected
          </span>

        </div>

      </div>

      <!-- RIGHT SIDE CONTENT -->

      <div class="ds-copy">

        <h2 id="ds-title">
          Built to scale
          <span>with your network</span>
        </h2>

        <p>
          Add warehouses, territories and reps without
          new systems. Saptivo's multi-branch and
          inventory modules grow with your distribution
          footprint, and the reseller hub supports
          partner networks.
        </p>

      </div>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

.ds,
.ds * {
  box-sizing: border-box;
}

.ds {
  width: 100%;
  background: #fff;
  padding: clamp(48px, 6vw, 96px) 0;
}

.ds-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(40px, 7vw, 110px);
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(24px, 6vw, 96px);
}

/* Visual container */

.ds-visual {
  position: relative;
  isolation: isolate;
  min-width: 0;
  padding: 24px;
  overflow: hidden;
  border-radius: 32px;
  background: radial-gradient(
    ellipse at center,
    #f9f8fb 0%,
    #eeedf3 50%,
    #e3e1e9 100%
  );
  font-family: 'Poppins', sans-serif;
}

.ds-visual-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ds-visual-label {
  font-size: 12px;
  font-weight: 500;
  color: #66636d;
}

.ds-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, .9);
  border-radius: 30px;
  background: rgba(255, 255, 255, .7);
  color: #547d5c;
  font-size: 10px;
  font-weight: 500;
}

.ds-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #699571;
}

/* Network canvas */

.ds-network {
  position: relative;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 1.1;
  margin: 24px auto;
}

/* Concentric circles */

.ds-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  aspect-ratio: 1;
  border: 1px solid rgba(126, 120, 144, .17);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ds-ring-one {
  width: 38%;
}

.ds-ring-two {
  width: 63%;
  border-style: dashed;
}

.ds-ring-three {
  width: 87%;
}

/* Network lines */

.ds-connections {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.ds-connections line {
  stroke: #d0cdd7;
  stroke-width: 1.4;
  stroke-dasharray: 5 6;
  transition: stroke .6s ease;
}

.ds-connections line.connected {
  stroke: #819a85;
  animation: ds-flow 1.5s linear infinite;
}

@keyframes ds-flow {
  to {
    stroke-dashoffset: -22;
  }
}

/* Central hub */

.ds-hub {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 30%;
  min-height: 112px;
  padding: 18px 12px;
  border: 1px solid #fff;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 14px 35px -12px rgba(47, 43, 58, .25);
  transform: translate(-50%, -50%);
}

.ds-hub img {
  display: block;
  width: 100%;
  max-width: 125px;
  max-height: 38px;
  object-fit: contain;
  filter: brightness(0) saturate(100%);
}

.ds-hub > span:last-child {
  font-size: 10px;
  color: #777;
}

.ds-logo-fallback {
  font-family: 'Urbanist', sans-serif;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -.05em;
  color: #111;
}

.ds-hub-indicator {
  position: absolute;
  top: -7px;
  right: -5px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #dcebdc;
}

.ds-hub-indicator i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #699571;
}

/* Network cards */

.ds-node {
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 29%;
  min-height: 108px;
  padding: 14px 8px;
  border: 1px solid rgba(255, 255, 255, .95);
  border-radius: 16px;
  background: rgba(255, 255, 255, .65);
  text-align: center;
  box-shadow: 0 10px 25px -15px rgba(50, 45, 65, .15);
  transition:
    background .5s ease,
    border-color .5s ease,
    box-shadow .5s ease;
}

.ds-node-active {
  border-color: #cbdccb;
  background: #fff;
  box-shadow: 0 12px 30px -12px rgba(50, 65, 50, .2);
}

.ds-node-top {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.ds-node-right {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.ds-node-bottom {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.ds-node-left {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.ds-node-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #efedf3;
  color: #817a91;
  transition: background .5s, color .5s;
}

.ds-node-active .ds-node-icon {
  background: #e6efe3;
  color: #64866a;
}

.ds-node-icon svg {
  width: 19px;
  height: 19px;
}

.ds-node strong {
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(12px, 1.1vw, 16px);
  font-weight: 700;
  line-height: 1.15;
  color: #292929;
}

.ds-node small {
  font-size: 9px;
  line-height: 1.4;
  color: #85818c;
}

.ds-node-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d3d0da;
  transition: background .5s;
}

.ds-node-active .ds-node-dot {
  background: #769a7a;
}

/* Network footer */

.ds-visual-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, .9);
  border-radius: 14px;
  background: rgba(255, 255, 255, .65);
}

.ds-footer-copy {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ds-footer-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #e1ebdf;
  color: #638467;
}

.ds-footer-icon svg {
  width: 19px;
  height: 19px;
}

.ds-footer-copy strong,
.ds-footer-copy small {
  display: block;
}

.ds-footer-copy strong {
  font-size: 11px;
  font-weight: 600;
  color: #292929;
}

.ds-footer-copy small {
  margin-top: 4px;
  font-size: 10px;
  color: #888;
}

.ds-count {
  flex: none;
  font-size: 10px;
  color: #638467;
}

/* Right content */

.ds-copy h2 {
  margin: 0 0 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: clamp(34px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.05em;
  color: #111 !important;
}

.ds-copy h2 span {
  display: block;
  background: linear-gradient(
    100deg,
    #a1a1aa,
    #777780
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ds-copy p {
  max-width: 48ch;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(14px, 1.15vw, 16px);
  line-height: 1.85;
  color: #666b73;
}

/* Entrance animations */

.ds-in .ds-visual {
  animation: ds-reveal .8s ease both;
}

.ds-in .ds-copy {
  animation: ds-reveal .8s .12s ease both;
}

@keyframes ds-reveal {
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
  .ds-wrap {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .ds-copy {
    grid-row: 1;
  }

  .ds-copy p {
    max-width: 65ch;
  }

  .ds-visual {
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
  }
}

/* Mobile */

@media (max-width: 640px) {
  .ds-wrap {
    padding: 0 20px;
    gap: 28px;
  }

  .ds-copy h2 {
    font-size: 38px;
    margin-bottom: 18px;
  }

  .ds-copy p {
    font-size: 14px;
  }

  .ds-visual {
    padding: 14px;
    border-radius: 24px;
  }

  .ds-network {
    aspect-ratio: .9;
    margin: 20px auto;
  }

  .ds-node {
    width: 30%;
    min-height: 90px;
    padding: 10px 5px;
    border-radius: 12px;
    gap: 5px;
  }

  .ds-node strong {
    font-size: 12px;
  }

  .ds-node small {
    font-size: 8px;
  }

  .ds-node-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
  }

  .ds-node-icon svg {
    width: 16px;
    height: 16px;
  }

  .ds-node-dot {
    top: 7px;
    right: 7px;
    width: 5px;
    height: 5px;
  }

  .ds-hub {
    width: 32%;
    min-height: 84px;
    padding: 12px 8px;
    border-radius: 14px;
    gap: 6px;
  }

  .ds-hub > span:last-child {
    font-size: 8px;
  }

  .ds-visual-footer {
    padding: 10px;
    gap: 8px;
  }

  .ds-footer-copy {
    gap: 7px;
  }

  .ds-footer-copy strong {
    font-size: 10px;
  }

  .ds-footer-copy small,
  .ds-count {
    font-size: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ds *,
  .ds *::before,
  .ds *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
