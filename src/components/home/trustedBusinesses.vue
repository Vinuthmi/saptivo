<template>
  <section class="trusted-brands" aria-labelledby="trusted-brands-title">
    <h2 id="trusted-brands-title" class="trusted-brands-title">
      Trusted by Businesses That <span>Move Forward</span>
    </h2>
    <ul class="trusted-logos">
      <li v-for="client in clients" :key="client.name">
        <span>
          <img
            :src="client.src"
            :alt="client.name"
            :width="client.w"
            :height="client.h"
            :style="{ '--dw': `${client.dw}px` }"
            loading="lazy"
            draggable="false"
          />
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup>
const clients = [
  { name: 'AutoSale.lk', src: `${import.meta.env.BASE_URL}images/clients/autosale.png`, w: 1694, h: 255, dw: 125 },
  { name: 'Cartinno', src: `${import.meta.env.BASE_URL}images/clients/cartinno.webp`, w: 800, h: 226, dw: 100 },
  { name: 'SaaSBeds', src: `${import.meta.env.BASE_URL}images/clients/saasbeds.png`, w: 2048, h: 462, dw: 115 },
  { name: 'Ipsova', src: `${import.meta.env.BASE_URL}images/clients/ipsova.png`, w: 1000, h: 284, dw: 110 },
  { name: 'Saptify', src: `${import.meta.env.BASE_URL}images/clients/saptify.png`, w: 720, h: 180, dw: 105 },
  { name: 'Sepova', src: `${import.meta.env.BASE_URL}images/clients/sepova.png`, w: 2048, h: 283, dw: 130 },
  { name: 'Veyogo', src: `${import.meta.env.BASE_URL}images/clients/veyogo.png`, w: 1154, h: 224, dw: 115 },
  { name: 'Voxinnova', src: `${import.meta.env.BASE_URL}images/clients/voxinnova.png`, w: 433, h: 102, dw: 120 },
  { name: 'Smardove', src: `${import.meta.env.BASE_URL}images/clients/smardove.png`, w: 727, h: 275, dw: 115 },
]
</script>

<style scoped>
.trusted-brands {
  position: relative;
  width: min(1240px, calc(100% - 16px));
  margin: clamp(36px, 5vw, 72px) auto;
}

.trusted-brands-title {
  max-width: 760px;
  margin: 0 auto;
  padding-bottom: 0.2em;
  font-family: 'Urbanist', system-ui, sans-serif;
  color: #0f172a;
  font-size: clamp(32px, 4.2vw, 62px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.05em;
  text-align: center;
}

.trusted-brands-title span {
  display: block;
  padding-bottom: 0.08em;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.trusted-logos {
  display: flex;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  align-items: center;
  gap: 8px;
  scrollbar-width: none;
  margin: 40px 0 0;
  list-style: none;
}

.trusted-logos li {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  align-items: center;
  justify-content: center;
  height: 88px;
  padding: 0 6px;
}

.trusted-logos li > span {
  display: grid;
  max-width: 100%;
  place-items: center;
}

.trusted-logos::-webkit-scrollbar {
  display: none;
}

.trusted-logos img {
  display: block;
  width: min(var(--dw), calc((100vw - 132px) / 9));
  max-width: 100%;
  height: auto;
  object-fit: contain;
  user-select: none;
  filter: brightness(0) invert(0.7);
  transition: filter 0.3s ease, transform 0.3s ease;
}

.trusted-logos li:hover img {
  filter: brightness(0);
  transform: scale(1.04);
}

@media (max-width: 900px) {
  .trusted-logos li {
    height: 68px;
  }
}

@media (max-width: 640px) {
  .trusted-logos li {
    flex: 0 0 auto;
    height: 68px;
  }

  .trusted-logos {
    width: max-content;
    min-width: 100%;
  }

  .trusted-logos img {
    width: calc(var(--dw) * 0.7);
  }
}
</style>
