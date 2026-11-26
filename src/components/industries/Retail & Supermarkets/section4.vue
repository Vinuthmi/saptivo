
<template>
  <section
    class="retail-trusted"
    aria-labelledby="retail-trusted-title"
  >

    <!-- Section heading -->

    <h2
      id="retail-trusted-title"
      class="retail-trusted-title"
    >
      Retailers who <span>trust Saptivo</span>
    </h2>

    <!-- Client logos -->

    <ul class="retail-trusted-logos">

      <li
        v-for="client in clients"
        :key="client.name"
        class="retail-logo-item"
        :class="{
          'retail-logo-autosale': client.name === 'AutoSale.lk'
        }"
      >

        <span class="retail-logo-wrap">

          <img
            v-if="!failed[client.name]"
            :src="client.src"
            :alt="client.name"
            :width="client.w"
            :height="client.h"
            :style="{ '--dw': `${client.dw}px` }"
            loading="lazy"
            decoding="async"
            draggable="false"
            @error="failed[client.name] = true"
          />

          <span
            v-else
            class="retail-logo-fallback"
          >
            {{ client.name }}
          </span>

        </span>

      </li>

    </ul>

  </section>
</template>

<script setup>
import { reactive } from 'vue'

defineOptions({
  name: 'RetailTrustedBrands'
})

const base = import.meta.env.BASE_URL

const failed = reactive({})

const clients = [
  {
    name: 'AutoSale.lk',
    src: `${base}images/clients/autosale-monochrome.png`,
    w: 1694,
    h: 255,
    dw: 132
  },
  {
    name: 'Cartinno',
    src: `${base}images/clients/cartinno.webp`,
    w: 800,
    h: 226,
    dw: 100
  },
  {
    name: 'SaaSBeds',
    src: `${base}images/clients/saasbeds.png`,
    w: 2048,
    h: 462,
    dw: 115
  },
  {
    name: 'Ipsova',
    src: `${base}images/clients/ipsova.png`,
    w: 1000,
    h: 284,
    dw: 110
  },
  {
    name: 'Saptify',
    src: `${base}images/clients/saptify.png`,
    w: 720,
    h: 180,
    dw: 105
  },
  {
    name: 'Sepova',
    src: `${base}images/clients/sepova.png`,
    w: 2048,
    h: 283,
    dw: 130
  },
  {
    name: 'Veyogo',
    src: `${base}images/clients/veyogo.png`,
    w: 1154,
    h: 224,
    dw: 115
  },
  {
    name: 'Voxinnova',
    src: `${base}images/clients/voxinnova.png`,
    w: 433,
    h: 102,
    dw: 120
  },
  {
    name: 'Smardove',
    src: `${base}images/clients/smardove.png`,
    w: 727,
    h: 275,
    dw: 115
  }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');

.retail-trusted,
.retail-trusted * {
  box-sizing: border-box;
}

/* =========================================
   MAIN SECTION
========================================= */

.retail-trusted {
  position: relative;

  width: 100%;
  max-width: 1700px;

  margin: 0 auto;

  padding:
    clamp(40px, 5vw, 72px)
    clamp(24px, 4vw, 64px);

  background: #fff;

  font-family: 'Urbanist', system-ui, sans-serif;
}

/* =========================================
   SECTION HEADING
========================================= */

.retail-trusted-title {
  max-width: 1200px;

  margin: 0 auto;

  padding-bottom: 0.12em;

  font-family: 'Urbanist', system-ui, sans-serif;

  font-size: clamp(32px, 4vw, 58px);

  font-weight: 500;

  line-height: 1.08;

  letter-spacing: -0.055em;

  color: #0a0a0a !important;

  text-align: center;

  text-wrap: balance;
}

/* Grey gradient heading */

.retail-trusted-title span {
  display: inline;

  background: linear-gradient(
    100deg,
    #a1a1aa 0%,
    #8b8b93 50%,
    #6f6f78 100%
  );

  background-clip: text;

  -webkit-background-clip: text;

  color: transparent !important;

  -webkit-text-fill-color: transparent !important;
}

/* =========================================
   LOGO ROW
========================================= */

.retail-trusted-logos {
  display: grid;

  grid-template-columns: repeat(9, minmax(0, 1fr));

  align-items: center;

  justify-items: center;

  width: 100%;

  max-width: 1560px;

  margin: clamp(36px, 4vw, 60px) auto 0;

  padding: 0;

  gap: 0;

  list-style: none;
}

/* =========================================
   INDIVIDUAL LOGO CONTAINERS
========================================= */

.retail-logo-item {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 100%;

  min-width: 0;

  height: 88px;

  padding: 0 clamp(12px, 1.5vw, 24px);
}

/* =========================================
   VERTICAL DIVIDERS
========================================= */

.retail-logo-item:not(:last-child)::after {
  content: '';

  position: absolute;

  top: 50%;

  right: 0;

  width: 1px;

  height: 42px;

  background: #dedee3;

  transform: translateY(-50%);

  pointer-events: none;
}

/* =========================================
   LOGO IMAGES
========================================= */

.retail-logo-wrap {
  display: grid;

  place-items: center;

  width: 100%;

  max-width: 100%;
}

.retail-logo-wrap img {
  display: block;

  width: var(--dw);

  max-width: 100%;

  max-height: 65px;

  height: auto;

  object-fit: contain;

  user-select: none;

  filter: brightness(0) invert(0.7);

  transition:
    filter 0.3s ease,
    transform 0.3s ease;
}

/* AutoSale logo */

.retail-logo-autosale img {
  width: min(var(--dw), 100%);
}

/* =========================================
   LOGO HOVER
========================================= */

.retail-logo-item:hover img {
  filter: brightness(0);

  transform: scale(1.04);
}

/* =========================================
   MISSING IMAGE FALLBACK
========================================= */

.retail-logo-fallback {
  display: block;

  max-width: 100%;

  font-family: 'Urbanist', system-ui, sans-serif;

  font-size: clamp(12px, 1.2vw, 18px);

  font-weight: 800;

  line-height: 1.15;

  color: #b3b3b3;

  text-align: center;

  overflow-wrap: anywhere;

  transition: color 0.3s ease;
}

.retail-logo-item:hover .retail-logo-fallback {
  color: #000;
}

/* =========================================
   SMALL DESKTOP
========================================= */

@media (max-width: 1200px) {

  .retail-trusted {
    padding: 56px 32px;
  }

  .retail-logo-item {
    padding: 0 12px;
  }

  .retail-logo-item:not(:last-child)::after {
    height: 36px;
  }

}

/* =========================================
   TABLET
========================================= */

@media (max-width: 1000px) {

  .retail-trusted {
    padding: 48px 32px;
  }

  .retail-trusted-logos {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    max-width: 720px;

    row-gap: 24px;

    margin-top: 32px;
  }

  .retail-logo-item {
    height: 76px;

    padding: 0 24px;
  }

  .retail-logo-wrap img {
    max-height: 60px;
  }

  /* Remove divider at the end of each row */

  .retail-logo-item:nth-child(3n)::after {
    display: none;
  }

}

/* =========================================
   MOBILE
========================================= */

@media (max-width: 640px) {

  .retail-trusted {
    padding: 40px 20px;
  }

  .retail-trusted-title {
    font-size: 36px;

    line-height: 1.12;
  }

  .retail-trusted-logos {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    row-gap: 16px;

    margin-top: 28px;
  }

  .retail-logo-item {
    height: 68px;

    padding: 0 12px;
  }

  .retail-logo-wrap img {
    width: calc(var(--dw) * 0.85);

    max-height: 48px;
  }

  .retail-logo-item:not(:last-child)::after {
    height: 30px;
  }

  .retail-logo-fallback {
    font-size: 14px;
  }

}

/* =========================================
   SMALL MOBILE
========================================= */

@media (max-width: 380px) {

  .retail-trusted {
    padding: 36px 16px;
  }

  .retail-trusted-title {
    font-size: 32px;
  }

  .retail-logo-item {
    height: 60px;

    padding: 0 10px;
  }

  .retail-trusted-logos {
    row-gap: 12px;
  }

}

/* =========================================
   REDUCED MOTION
========================================= */

@media (prefers-reduced-motion: reduce) {

  .retail-logo-wrap img,
  .retail-logo-fallback {
    transition: none;
  }

  .retail-logo-item:hover img {
    transform: none;
  }

}
</style>
