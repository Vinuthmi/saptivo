<template>
  <section id="deployments" ref="root" class="trusted-brands" aria-labelledby="trusted-brands-title">
    <h2 id="trusted-brands-title" class="trusted-brands-title">
      Proven <span>deployments</span>
    </h2>
    <p class="trusted-brands-lead">
      From resorts and furniture retailers to computer stores and service businesses, Sri Lankan companies such as Tree of Life Nature Resort, Nilkamal and Tera Computers run their customer relationships on Saptivo.
    </p>
    <ul class="trusted-logos">
      <li v-for="(client, i) in clients" :key="client.name" :style="{ '--i': i }">
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
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'ProvenDeployments' })

const clients = [
  { name: 'Tree of Life Nature Resort', src: `${import.meta.env.BASE_URL}images/clients/tree-of-life1.png`, w: 136, h: 91, dw: 120 },
  { name: 'Nilkamal', src: `${import.meta.env.BASE_URL}images/clients/nilkamal1.png`, w: 130, h: 90, dw: 100 },
  { name: 'Tera Computers', src: `${import.meta.env.BASE_URL}images/clients/tera1.png`, w: 447, h: 447, dw: 76 },
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
  width: min(1000px, calc(100% - 40px));
  margin: clamp(48px, 6vw, 96px) auto;
}

.trusted-brands-title {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 0.2em;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  color: #0f172a;
  font-size: clamp(32px, 4.2vw, 62px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.05em;
  text-align: center;
}

.trusted-brands-title span {
  display: inline-block;
  padding-bottom: 0.08em;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.trusted-brands-lead {
  max-width: 760px;
  margin: 10px auto 0;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(15px, 1.15vw, 18px);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.015em;
  color: #475569;
  text-align: center;
}

.trusted-logos {
  display: flex;
  justify-content: center;
  align-items: stretch;
  max-width: 860px;
  margin: clamp(32px, 4vw, 52px) auto 0;
  padding: 18px 0;
  list-style: none;
  border-top: 1px solid #e6e6ea;
  border-bottom: 1px solid #e6e6ea;
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

/* entrance */
.trusted-brands-title,
.trusted-brands-lead,
.trusted-logos li {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.in .trusted-brands-title,
.in .trusted-brands-lead,
.in .trusted-logos li { opacity: 1; transform: none; }
.in .trusted-brands-lead { transition-delay: 0.1s; }
.in .trusted-logos li { transition-delay: calc(0.25s + var(--i) * 0.07s); }

@media (max-width: 900px) {
  .trusted-logos {
    flex-wrap: wrap;
    row-gap: 6px;
    margin-top: 26px;
    border-bottom: 0;
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

@media (prefers-reduced-motion: reduce) {
  .trusted-brands-title, .trusted-brands-lead, .trusted-logos li { opacity: 1; transform: none; transition: none; }
}
</style>