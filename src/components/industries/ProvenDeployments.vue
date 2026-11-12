<template>
  <section id="deployments" ref="root" class="trusted-brands" aria-labelledby="trusted-brands-title">
    <div class="tb-text">
      <h2 id="trusted-brands-title" class="trusted-brands-title">
        Proven <span>deployments</span>
      </h2>
      <p class="trusted-brands-lead">
        From resorts and furniture retailers to computer stores and service businesses, Sri Lankan companies such as Tree of Life Nature Resort, Nilkamal and Tera Computers run their customer relationships on Saptivo.
      </p>
    </div>
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
  width: 100%;
  max-width: none;
  margin: 0;
  padding: clamp(56px, 7vw, 96px) clamp(28px, 9vw, 168px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(28px, 5vw, 80px);
}

.tb-text { min-width: 0; max-width: 720px; }

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

.trusted-brands-lead {
  margin: 18px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.02em;
  color: #475569;
}

/* logos beside the text */
.trusted-logos {
  display: flex;
  align-items: stretch;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #fff;
}

.trusted-logos li {
  display: grid;
  place-items: center;
  width: clamp(150px, 15vw, 210px);
  height: 140px;
  padding: 0 20px;
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
  transform: scale(1.05);
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
.in .trusted-logos li { transition-delay: calc(0.25s + var(--i) * 0.08s); }

@media (max-width: 1100px) {
  .trusted-brands { grid-template-columns: minmax(0, 1fr); }
  .trusted-logos { justify-self: start; }
}

@media (max-width: 620px) {
  .trusted-brands .trusted-brands-title { font-size: 36px; line-height: 46px; letter-spacing: -0.7px; white-space: normal; }
  .trusted-logos { width: 100%; }
  .trusted-logos li { flex: 1 1 0; width: auto; height: 100px; padding: 0 10px; }
  .trusted-logos img { width: calc(var(--dw) * 0.7); }
}

@media (prefers-reduced-motion: reduce) {
  .trusted-brands-title, .trusted-brands-lead, .trusted-logos li { opacity: 1; transform: none; transition: none; }
}
</style>