
<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'

defineOptions({
  name: 'RetailPOS'
})

const base = import.meta.env.BASE_URL

const root = ref(null)
const shown = ref(false)
const ok = ref(true)
const still = ref(false)
const n = ref(0)

let timer = null
let io = null

/* Background photograph */

const photo =
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=85&auto=format&fit=crop'

/* Original brand logos */

const logos = {
  saptivo: `${base}saptivo-logo.png`,
  cartinno: `${base}images/clients/cartinno.webp`
}

const failed = reactive({
  saptivo: false,
  cartinno: false
})

/* Animation stages */

const stages = [
  'Collecting customer data',
  'Synchronizing platforms',
  'Customer records synced'
]

const stage = computed(() =>
  still.value ? 2 : Math.floor((n.value % 12) / 4)
)

const connected = computed(() => stage.value === 2)

/* Customer channels */

const channels = [
  {
    title: 'Instore customers',
    subtitle: 'POS transactions',
    icon: `
      <path d="M3 10l2-6h14l2 6"/>
      <path d="M3 10a3 3 0 0 0 6 0
               3 3 0 0 0 6 0
               3 3 0 0 0 6 0"/>
      <path d="M5 13v8h14v-8"/>
      <path d="M9 21v-6h6v6"/>
    `
  },
  {
    title: 'Online customers',
    subtitle: 'E-commerce orders',
    icon: `
      <path d="M5 7h14l2 14H3z"/>
      <path d="M8 9V6a4 4 0 0 1 8 0v3"/>
    `
  }
]

function start() {
  if (timer || still.value) return

  timer = setInterval(() => {
    n.value += 1
  }, 800)
}

function stop() {
  clearInterval(timer)
  timer = null
}

onMounted(() => {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    still.value = true
    shown.value = true
    return
  }

  io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        shown.value = true
        start()
      } else {
        stop()
      }
    },
    {
      threshold: 0.2
    }
  )

  if (root.value) {
    io.observe(root.value)
  }
})

onBeforeUnmount(() => {
  stop()
  io?.disconnect()
})
</script>

<template>
  <section
    ref="root"
    class="pos"
    :class="{ 'pos-in': shown }"
    aria-labelledby="pos-title"
  >

    <div class="pos-wrap">

      <div class="pos-panel">

        <!-- LEFT SIDE CONTENT -->

        <div class="pos-copy">

          <h2 id="pos-title">
            <span class="pos-l1">Works with</span>
            <span class="pos-l2">your POS</span>
          </h2>

          <p>
            Saptivo pairs with Cartinno, Weblook's
            e-commerce and POS system, for a single
            view of instore and online customers.
            Plug-and-play POS hardware and peripherals
            are supported.
          </p>

        </div>

        <!-- RIGHT SIDE PHOTOGRAPH -->

        <figure class="pos-photo">

          <img
            v-if="ok"
            :src="photo"
            class="pos-photo-image"
            alt=""
            loading="lazy"
            decoding="async"
            @error="ok = false"
          />

          <!-- FLOATING POS INTEGRATION BOARD -->

          <div class="pos-board" aria-hidden="true">

            <!-- Board heading -->

            <div class="pos-top">

              <span class="pos-label">
                Connected platforms
              </span>

              <span
                class="pos-pill"
                :class="{ 'pos-pill-connected': connected }"
              >
                <i></i>

                {{ connected ? 'Connected' : 'Syncing' }}
              </span>

            </div>

            <!-- ORIGINAL BRAND LOGOS -->

            <div class="pos-platforms">

              <!-- Cartinno -->

              <div class="pos-brand">

                <img
                  v-if="!failed.cartinno"
                  :src="logos.cartinno"
                  alt="Cartinno"
                  draggable="false"
                  @error="failed.cartinno = true"
                />

                <strong
                  v-else
                  class="pos-fallback"
                >
                  Cartinno
                </strong>

                <small>E-commerce &amp; POS</small>

              </div>

              <!-- Synchronization icon -->

              <div
                class="pos-link"
                :class="{
                  'pos-link-active': stage === 1,
                  'pos-link-done': connected
                }"
              >

                <span class="pos-line">
                  <i></i>
                </span>

                <span class="pos-sync">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 7v5h-5"/>
                    <path d="M4 17v-5h5"/>
                    <path d="M6 7a7 7 0 0 1 12-1l2 3"/>
                    <path d="m4 15 2 3a7 7 0 0 0 12-1"/>
                  </svg>

                </span>

                <span class="pos-line">
                  <i></i>
                </span>

              </div>

              <!-- Saptivo -->

              <div class="pos-brand">

                <img
                  v-if="!failed.saptivo"
                  :src="logos.saptivo"
                  alt="Saptivo"
                  draggable="false"
                  @error="failed.saptivo = true"
                />

                <strong
                  v-else
                  class="pos-fallback"
                >
                  Saptivo
                </strong>

                <small>Customer management</small>

              </div>

            </div>

            <!-- CUSTOMER CHANNELS -->

            <div class="pos-channels">

              <div
                v-for="channel in channels"
                :key="channel.title"
                class="pos-channel"
                :class="{ 'pos-channel-done': connected }"
              >

                <span class="pos-channel-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    v-html="channel.icon"
                  ></svg>

                </span>

                <div class="pos-channel-copy">

                  <b>{{ channel.title }}</b>

                  <small>{{ channel.subtitle }}</small>

                </div>

                <span
                  class="pos-check"
                  :class="{ 'pos-check-visible': connected }"
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m5 12 5 5 9-10"/>
                  </svg>

                </span>

              </div>

            </div>

            <!-- UNIFIED CUSTOMER PROFILE -->

            <div
              class="pos-result"
              :class="{ 'pos-result-done': connected }"
            >

              <span class="pos-result-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/>
                </svg>

              </span>

              <div class="pos-result-copy">

                <b>Unified customer profile</b>

                <small>
                  Instore and online, together.
                </small>

              </div>

              <span
                v-if="connected"
                class="pos-ready"
              >
                Synced
              </span>

            </div>

            <!-- ANIMATION STATUS -->

            <div class="pos-progress-label">

              <span>{{ stages[stage] }}</span>

              <span>{{ stage + 1 }}/3</span>

            </div>

            <div class="pos-rail">

              <i
                :style="{
                  width: ((stage + 1) / 3) * 100 + '%'
                }"
              ></i>

            </div>

          </div>

        </figure>

      </div>

    </div>

  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');

/* =========================================
   MAIN SECTION
========================================= */

.pos {
  --ink: #14120f;
  --muted: #666b73;
  --peach: #fff0df;
  --mint: #dff3e8;
  --green: #2c7a56;
  --line: rgba(20, 18, 15, 0.1);

  width: 100%;

  padding: 80px clamp(24px, 4vw, 64px);

  background: #fff;

  color: var(--ink);

  font-family: 'Poppins', system-ui, sans-serif;
}

.pos,
.pos *,
.pos *::before,
.pos *::after {
  box-sizing: border-box;
}

/* =========================================
   WIDER SECTION WRAPPER
========================================= */

.pos-wrap {
  width: 100%;

  max-width: 1440px;

  margin: 0 auto;
}

/* =========================================
   MAIN PANEL
========================================= */

.pos-panel {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1.1fr);

  align-items: center;

  gap: clamp(40px, 5vw, 80px);

  padding:
    56px
    clamp(40px, 5vw, 80px);

  border-radius: 36px;

  background: var(--peach);
}

.pos-in .pos-panel {
  animation: pos-reveal 0.6s ease both;
}

@keyframes pos-reveal {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================================
   LEFT SIDE CONTENT
========================================= */

.pos-copy {
  width: 100%;

  min-width: 0;
}

.pos-copy h2 {
  margin: 0 0 20px;

  font-family: 'Urbanist', system-ui, sans-serif;

  font-size: clamp(34px, 3.8vw, 56px);

  font-weight: 500;

  line-height: 1.12;

  letter-spacing: -0.05em;

  text-wrap: balance;
}

.pos-copy h2 span {
  display: block;
}

.pos-copy h2 .pos-l1 {
  color: #111111 !important;

  -webkit-text-fill-color: #111111 !important;
}

.pos-copy h2 .pos-l2 {
  color: #8a8f97 !important;

  -webkit-text-fill-color: #8a8f97 !important;
}

.pos-copy p {
  width: 100%;

  max-width: 58ch;

  margin: 0;

  font-size: 16px;

  font-weight: 400;

  line-height: 1.8;

  color: var(--muted);
}

/* =========================================
   RIGHT SIDE PHOTOGRAPH
========================================= */

.pos-photo {
  position: relative;

  display: flex;

  align-items: flex-end;

  width: 100%;

  min-width: 0;

  min-height: 560px;

  margin: 0;

  border-radius: 28px;

  overflow: hidden;

  background: linear-gradient(
    160deg,
    #ffe8d1,
    #fff2e5
  );
}

.pos-photo-image {
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  object-position: center 20%;
}

/* =========================================
   FLOATING BOARD
========================================= */

.pos-board {
  position: relative;

  display: flex;

  flex-direction: column;

  gap: 14px;

  width: calc(100% - 28px);

  max-width: none;

  min-width: 0;

  margin: 14px;

  padding: 18px;

  border-radius: 22px;

  background: #fff;

  box-shadow:
    0 18px 40px -18px rgba(20, 18, 15, 0.4);
}

/* =========================================
   BOARD HEADER
========================================= */

.pos-top {
  display: flex;

  align-items: center;

  justify-content: space-between;

  flex-wrap: wrap;

  gap: 8px;
}

.pos-label {
  font-size: 11px;

  font-weight: 600;

  letter-spacing: 0.05em;

  text-transform: uppercase;

  color: var(--muted);
}

.pos-pill {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 5px 11px;

  border-radius: 99px;

  background: var(--ink);

  color: #fff;

  font-size: 10px;

  font-weight: 500;

  transition:
    background 0.4s ease,
    color 0.4s ease;
}

.pos-pill i {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: currentColor;
}

.pos-pill-connected {
  background: var(--mint);

  color: var(--green);
}

/* =========================================
   BRAND PLATFORMS
========================================= */

.pos-platforms {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    42px
    minmax(0, 1fr);

  align-items: center;

  gap: 4px;
}

.pos-brand {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 8px;

  min-width: 0;

  min-height: 94px;

  padding: 12px 10px;

  border: 1px solid #e9e9ed;

  border-radius: 14px;

  background: #fafafa;
}

.pos-brand img {
  display: block;

  width: 100%;

  max-width: 140px;

  height: 38px;

  object-fit: contain;

  filter: brightness(0) saturate(100%);

  user-select: none;
}

.pos-brand small {
  font-size: 9px;

  line-height: 1.4;

  text-align: center;

  color: var(--muted);
}

.pos-fallback {
  font-family: 'Urbanist', sans-serif;

  font-size: 24px;

  font-weight: 800;

  letter-spacing: -0.04em;

  color: #111;
}

/* =========================================
   SYNCHRONIZATION ANIMATION
========================================= */

.pos-link {
  display: flex;

  align-items: center;

  justify-content: center;
}

.pos-line {
  position: relative;

  flex: 1;

  height: 1px;

  overflow: hidden;

  background: #d4d4d8;
}

.pos-line i {
  position: absolute;

  inset: 0;

  background: #c87532;

  transform: translateX(-100%);
}

.pos-sync {
  flex: none;

  display: grid;

  place-items: center;

  width: 30px;
  height: 30px;

  border-radius: 50%;

  background: var(--peach);

  color: #a86b39;

  transition:
    background 0.4s ease,
    color 0.4s ease;
}

.pos-sync svg {
  width: 17px;
  height: 17px;
}

.pos-link-active .pos-sync svg {
  animation: pos-spin 1.2s linear infinite;
}

.pos-link-active .pos-line i {
  animation: pos-flow 0.9s linear infinite;
}

.pos-link-done .pos-sync {
  background: var(--mint);

  color: var(--green);
}

@keyframes pos-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pos-flow {
  to {
    transform: translateX(100%);
  }
}

/* =========================================
   CUSTOMER CHANNELS
========================================= */

.pos-channels {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 8px;
}

.pos-channel {
  display: flex;

  align-items: center;

  gap: 8px;

  min-width: 0;

  padding: 12px 9px;

  border-radius: 12px;

  background: #f6f6f8;

  transition: background 0.4s ease;
}

.pos-channel-done {
  background: #edf6ef;
}

.pos-channel-icon {
  flex: none;

  display: grid;

  place-items: center;

  width: 30px;
  height: 30px;

  border-radius: 9px;

  background: #fff;

  color: #52525b;
}

.pos-channel-icon svg {
  width: 17px;
  height: 17px;
}

.pos-channel-copy {
  display: flex;

  flex: 1;

  min-width: 0;

  flex-direction: column;

  gap: 3px;
}

.pos-channel-copy b {
  font-size: 10px;

  font-weight: 600;

  line-height: 1.4;

  color: var(--ink);
}

.pos-channel-copy small {
  font-size: 9px;

  line-height: 1.4;

  color: var(--muted);
}

.pos-check {
  flex: none;

  display: grid;

  place-items: center;

  width: 15px;
  height: 15px;

  border-radius: 50%;

  background: var(--mint);

  color: var(--green);

  opacity: 0;

  transform: scale(0.6);

  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.pos-check-visible {
  opacity: 1;

  transform: scale(1);
}

.pos-check svg {
  width: 10px;
  height: 10px;
}

/* =========================================
   UNIFIED CUSTOMER PROFILE
========================================= */

.pos-result {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 12px;

  border: 1px solid #e8e8ed;

  border-radius: 13px;

  background: #fafafa;

  transition:
    background 0.4s ease,
    border-color 0.4s ease;
}

.pos-result-done {
  border-color: #d6e9dd;

  background: #f1f8f3;
}

.pos-result-icon {
  flex: none;

  display: grid;

  place-items: center;

  width: 34px;
  height: 34px;

  border-radius: 10px;

  background: #fff;

  color: var(--ink);
}

.pos-result-icon svg {
  width: 19px;
  height: 19px;
}

.pos-result-copy {
  display: flex;

  flex: 1;

  min-width: 0;

  flex-direction: column;

  gap: 3px;
}

.pos-result-copy b {
  font-size: 11px;

  font-weight: 600;

  line-height: 1.4;
}

.pos-result-copy small {
  font-size: 10px;

  color: var(--muted);
}

.pos-ready {
  flex: none;

  padding: 4px 9px;

  border-radius: 6px;

  background: var(--mint);

  color: var(--green);

  font-size: 9px;

  font-weight: 600;

  animation: pos-status-in 0.4s ease both;
}

@keyframes pos-status-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================================
   PROGRESS INDICATOR
========================================= */

.pos-progress-label {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;

  font-size: 10px;

  color: var(--muted);
}

.pos-rail {
  height: 3px;

  margin-top: -7px;

  border-radius: 3px;

  background: #eef0f2;

  overflow: hidden;
}

.pos-rail i {
  display: block;

  height: 100%;

  border-radius: 3px;

  background: var(--ink);

  transition: width 0.6s ease;
}

/* =========================================
   TABLET
========================================= */

@media (max-width: 900px) {

  .pos {
    padding: 64px 24px;
  }

  .pos-panel {
    grid-template-columns: minmax(0, 1fr);

    padding: 36px;

    gap: 36px;
  }

  .pos-copy p {
    max-width: 60ch;
  }

  .pos-photo {
    min-height: 560px;
  }

  .pos-board {
    width: calc(100% - 28px);

    max-width: none;

    margin: 14px;
  }

}

/* =========================================
   MOBILE
========================================= */

@media (max-width: 640px) {

  .pos {
    padding: 48px 16px;
  }

  .pos-panel {
    padding: 24px 18px;

    gap: 28px;

    border-radius: 26px;
  }

  .pos-copy h2 {
    font-size: 38px;

    margin-bottom: 16px;
  }

  .pos-copy p {
    max-width: 100%;

    font-size: 14px;

    line-height: 1.8;
  }

  .pos-photo {
    min-height: 480px;

    border-radius: 22px;
  }

  .pos-board {
    width: calc(100% - 20px);

    margin: 10px;

    padding: 12px;

    gap: 12px;

    border-radius: 18px;
  }

  .pos-label {
    font-size: 9px;
  }

  .pos-pill {
    font-size: 9px;

    padding: 4px 8px;
  }

  .pos-platforms {
    grid-template-columns:
      minmax(0, 1fr)
      32px
      minmax(0, 1fr);
  }

  .pos-brand {
    min-height: 78px;

    padding: 8px 6px;

    gap: 5px;
  }

  .pos-brand img {
    height: 30px;

    max-width: 110px;
  }

  .pos-brand small {
    font-size: 8px;
  }

  .pos-fallback {
    font-size: 19px;
  }

  .pos-sync {
    width: 26px;
    height: 26px;
  }

  .pos-sync svg {
    width: 14px;
    height: 14px;
  }

  .pos-channel {
    padding: 9px 7px;

    gap: 6px;
  }

  .pos-channel-icon {
    width: 25px;
    height: 25px;
  }

  .pos-channel-icon svg {
    width: 14px;
    height: 14px;
  }

  .pos-channel-copy b {
    font-size: 9px;
  }

  .pos-channel-copy small {
    font-size: 8px;
  }

  .pos-check {
    width: 13px;
    height: 13px;
  }

  .pos-result {
    padding: 9px;

    gap: 7px;
  }

  .pos-result-copy b {
    font-size: 10px;
  }

  .pos-result-copy small {
    font-size: 9px;
  }

  .pos-ready {
    font-size: 8px;
  }

  .pos-progress-label {
    font-size: 9px;
  }

}

/* =========================================
   SMALL MOBILE
========================================= */

@media (max-width: 380px) {

  .pos-copy h2 {
    font-size: 34px;
  }

  .pos-channels {
    grid-template-columns: minmax(0, 1fr);
  }

  .pos-photo {
    min-height: 500px;
  }

  .pos-result {
    flex-wrap: wrap;
  }

}

/* =========================================
   REDUCED MOTION
========================================= */

@media (prefers-reduced-motion: reduce) {

  .pos *,
  .pos *::before,
  .pos *::after {
    animation: none !important;

    transition: none !important;
  }

}
</style>
