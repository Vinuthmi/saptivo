<template>
  <section id="features" class="trusted-brands" aria-labelledby="trusted-brands-title">
    <h2 id="trusted-brands-title" class="trusted-brands-title">
      Trusted by businesses <span>across Sri Lanka</span> and beyond
    </h2>
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
  </section>
</template>

<script setup>
const clients = [
  { name: 'Tree of Life Nature Resort', src: `${import.meta.env.BASE_URL}images/clients/tree-of-life1.png`, w: 136, h: 91, dw: 116 },
  { name: 'Nilkamal', src: `${import.meta.env.BASE_URL}images/clients/nilkamal1.png`, w: 144, h: 82, dw: 132 },
  { name: 'Nastars', src: `${import.meta.env.BASE_URL}images/clients/nastars1.png`, w: 1878, h: 203, dw: 148 },
  { name: 'Be Waxed Sri Lanka', src: `${import.meta.env.BASE_URL}images/clients/bewaxed1.png`, w: 220, h: 219, dw: 68 },
  { name: 'Paint House by Nadeeka', src: `${import.meta.env.BASE_URL}images/clients/paint-house1.png`, w: 2045, h: 727, dw: 145 },
  { name: 'Tera Computers', src: `${import.meta.env.BASE_URL}images/clients/tera1.png`, w: 447, h: 447, dw: 68 },
  { name: 'Lanka Grills', src: `${import.meta.env.BASE_URL}images/clients/lanka-grills1.png`, w: 1317, h: 783, dw: 100 },
]
</script>

<style scoped>
.trusted-brands {
  position: relative;
  width: min(1240px, calc(100% - 40px));
  margin: clamp(36px, 5vw, 72px) auto;
}

.trusted-brands-title {
  max-width: 760px;
  margin: 0 auto;
  color: #0b0c0e;
  font-size: clamp(26px, 2.8vw, 40px);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.045em;
  text-align: center;
  text-wrap: balance;
}

.trusted-brands-title span {
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.trusted-logos {
  display: flex;
  justify-content: center;
  align-items: stretch;
  margin: 40px 0 0;
  padding: 0;
  list-style: none;
}

.trusted-logos li {
  flex: 1 1 0;
  min-width: 0;
  display: grid;
  place-items: center;
  height: 88px;
  padding: 0 clamp(12px, 1.4vw, 20px);
}

.trusted-logos li + li {
  border-left: 1px solid #e6e6ea;
}

.trusted-logos img {
  display: block;
  width: var(--dw);
  max-width: 100%;
  height: auto;
  object-fit: contain;
  user-select: none;
  transition: filter 0.3s ease, transform 0.3s ease;
}

.trusted-logos li:hover img {
  filter: brightness(0);
  transform: scale(1.04);
}

@media (max-width: 900px) {
  .trusted-logos {
    flex-wrap: wrap;
    row-gap: 6px;
    margin-top: 26px;
  }

  .trusted-logos li {
    flex: 0 0 33.333%;
    height: 76px;
    border-left: 0;
  }

  .trusted-logos img {
    width: calc(var(--dw) * 0.85);
  }
}

@media (max-width: 480px) {
  .trusted-logos li {
    flex-basis: 50%;
  }

  .trusted-logos img {
    width: calc(var(--dw) * 0.78);
  }
}
</style>
