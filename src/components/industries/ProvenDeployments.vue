<template>
  <section id="deployments" ref="root" class="trusted-brands" aria-labelledby="trusted-brands-title">
    <div class="tb-text">
      <h2 id="trusted-brands-title" class="trusted-brands-title">
        Proven <span>deployments</span>
      </h2>
    </div>

    <!-- logo marquee beside the heading -->
    <div class="tb-marquee" aria-label="Businesses running on Saptivo">
      <div class="tb-track">
        <ul class="trusted-logos">
          <li v-for="client in clients" :key="client.name">
            <img
              :src="client.src"
              :alt="client.name"
              :width="client.w"
              :height="client.h"
              :style="{ '--dw': `${client.dw}px` }"
              loading="lazy"
              draggable="false"
            />
          </li>
        </ul>
        <ul class="trusted-logos" aria-hidden="true">
          <li v-for="client in clients" :key="client.name + '-2'">
            <img
              :src="client.src"
              alt=""
              :width="client.w"
              :height="client.h"
              :style="{ '--dw': `${client.dw}px` }"
              loading="lazy"
              draggable="false"
            />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'ProvenDeployments' })

const base = import.meta.env.BASE_URL
const clients = [
  { name: 'AutoSale.lk', src: `${base}images/clients/autosale.png`, w: 1694, h: 255, dw: 125 },
  { name: 'Cartinno', src: `${base}images/clients/cartinno.webp`, w: 800, h: 226, dw: 100 },
  { name: 'SaaSBeds', src: `${base}images/clients/saasbeds.png`, w: 2048, h: 462, dw: 115 },
  { name: 'Ipsova', src: `${base}images/clients/ipsova.png`, w: 1000, h: 284, dw: 110 },
  { name: 'Saptify', src: `${base}images/clients/saptify.png`, w: 720, h: 180, dw: 105 },
  { name: 'Sepova', src: `${base}images/clients/sepova.png`, w: 2048, h: 283, dw: 130 },
  { name: 'Veyogo', src: `${base}images/clients/veyogo.png`, w: 1154, h: 224, dw: 115 },
  { name: 'Voxinnova', src: `${base}images/clients/voxinnova.png`, w: 433, h: 102, dw: 120 },
  { name: 'Smardove', src: `${base}images/clients/smardove.png`, w: 727, h: 275, dw: 115 },
]

const root = ref(null)
let io
onMounted(() => {
  if (!('IntersectionObserver' in window)) return root.value?.classList.add('in')
  io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.disconnect())),
    { threshold: 0.25 }
  )
  io.observe(root.value)
})
onBeforeUnmount(() => io && io.disconnect())
</script>

<style scoped>
.trusted-brands {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: clamp(56px, 7vw, 96px) clamp(28px, 9vw, 168px);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(28px, 5vw, 80px);
}

.tb-text { min-width: 0; }

.trusted-brands .trusted-brands-title {
  margin: 0;
  padding-bottom: 0.1em;
  font-family: Urbanist, "Urbanist Placeholder", sans-serif;
  color: #0a0a0a;
  font-size: 54px;
  font-weight: 600;
  line-height: 65px;
  letter-spacing: -1px;
  white-space: nowrap; /* heading stays on one line */
}

.trusted-brands .trusted-brands-title span {
  display: inline;
  color: #615f5a;
  -webkit-text-fill-color: currentColor;
  background: none;
}

/* ---------- logo marquee ---------- */
.tb-marquee {
  min-width: 0;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 10%, #000 90%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 10%, #000 90%, transparent 100%);
}

.tb-track {
  display: flex;
  width: max-content;
  animation: tb-marquee 36s linear infinite;
}

.tb-marquee:hover .tb-track { animation-play-state: paused; }

.trusted-logos {
  display: flex;
  flex: none;
  align-items: center;
  gap: clamp(40px, 4.5vw, 72px);
  margin: 0;
  padding: 0 clamp(40px, 4.5vw, 72px) 0 0; /* trailing gap keeps the loop seamless */
  list-style: none;
}

.trusted-logos li {
  display: flex;
  flex: none;
  align-items: center;
  height: 88px;
}

.trusted-logos img {
  display: block;
  width: var(--dw);
  height: auto;
  object-fit: contain;
  user-select: none;
  filter: brightness(0); /* logos in black */
  opacity: 0.85;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.trusted-logos li:hover img {
  opacity: 1;
  transform: scale(1.05);
}

@keyframes tb-marquee {
  to { transform: translateX(-50%); }
}

/* entrance */
.trusted-brands-title,
.tb-marquee {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.in .trusted-brands-title,
.in .tb-marquee { opacity: 1; transform: none; }
.in .tb-marquee { transition-delay: 0.15s; }

@media (max-width: 1100px) {
  .trusted-brands { grid-template-columns: minmax(0, 1fr); gap: 20px; }
}

@media (max-width: 620px) {
  .trusted-brands .trusted-brands-title { font-size: 36px; line-height: 46px; letter-spacing: -0.7px; white-space: normal; }
  .trusted-logos li { height: 68px; }
  .trusted-logos img { width: calc(var(--dw) * 0.7); }
}

@media (prefers-reduced-motion: reduce) {
  .tb-track { animation: none; }
  .tb-marquee { overflow-x: auto; scrollbar-width: none; }
  .trusted-brands-title, .tb-marquee { opacity: 1; transform: none; transition: none; }
}
</style>