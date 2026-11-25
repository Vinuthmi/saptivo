<template>
  <section class="wc" aria-labelledby="wc-title">
    <header class="wc-head">
      <h2 id="wc-title" class="wc-title">
        Who the program is for
      </h2>
    </header>

    <ul class="wc-track">
      <li
        v-for="(s, i) in slides"
        :key="s.t"
        class="wc-item"
      >
        <article class="wc-card">
          <img
            v-if="!failed[i]"
            class="wc-img"
            :src="s.img"
            :style="{ objectPosition: s.pos }"
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
            @error="failed[i] = true"
          />

          <span
            class="wc-shade"
            aria-hidden="true"
          ></span>

          <h3 class="wc-t">
            {{ s.t }}
          </h3>
        </article>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { reactive } from 'vue'

defineOptions({
  name: 'SectionWhoCards'
})

const failed = reactive({})

const slides = [
  {
    t: 'IT solution providers and system integrators',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80&auto=format&fit=crop',
    pos: '50% 50%'
  },
  {
    t: 'Digital marketing and web agencies',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80&auto=format&fit=crop',
    pos: '50% 50%'
  },
  {
    t: 'Accountants and business consultants',
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=80&auto=format&fit=crop',
    pos: '50% 50%'
  },
  {
    t: 'Telecom and 3CX partners',
    img: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=1000&q=80&auto=format&fit=crop',
    pos: '50% 40%'
  },
  {
    t: 'POS and hardware resellers',
    img: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=1000&q=80&auto=format&fit=crop',
    pos: '50% 50%'
  }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');

.wc,
.wc * {
  box-sizing: border-box;
}

/* ---------- Main section ---------- */

.wc {
  --edge: clamp(16px, 4vw, 64px);

  width: 100%;
  padding: clamp(56px, 8vw, 110px) 0;
  overflow: hidden;

  font-family: 'Urbanist', system-ui, sans-serif;
  background: #ffffff;
  color: #171717;
}

/* ---------- Heading ---------- */

.wc-head {
  padding: 0 var(--edge);
}

.wc-title {
  margin: 0;
  padding-bottom: 0.12em;

  font-size: clamp(30px, 4vw, 58px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.055em;

  color: #0a0a0a;
}

/* ---------- Horizontal card layout ---------- */

.wc-track {
  display: flex;
  gap: 16px;

  margin: clamp(26px, 3.4vw, 44px) 0 0;
  padding: 0 var(--edge);

  list-style: none;
  overflow-x: auto;

  scroll-snap-type: x mandatory;
  scroll-padding: 0 var(--edge);
  scrollbar-width: none;

  -webkit-overflow-scrolling: touch;
}

.wc-track::-webkit-scrollbar {
  display: none;
}

.wc-item {
  flex: none;
  width: clamp(250px, 22vw, 340px);
  scroll-snap-align: start;
}

/* ---------- Cards ---------- */

.wc-card {
  position: relative;
  isolation: isolate;

  aspect-ratio: 1 / 1.04;

  overflow: hidden;
  border-radius: 24px;

  background: #292929;
  color: #ffffff;
}

/* ---------- Background images ---------- */

.wc-img {
  position: absolute;
  inset: 0;
  z-index: 0;

  display: block;
  width: 100%;
  height: 100%;

  object-fit: cover;
  pointer-events: none;
}

/* ---------- Bottom overlay ---------- */

.wc-shade {
  position: absolute;
  inset: 0;
  z-index: 1;

  background: linear-gradient(
    180deg,
    transparent 30%,
    rgba(0, 0, 0, 0.05) 45%,
    rgba(0, 0, 0, 0.35) 65%,
    rgba(0, 0, 0, 0.85) 100%
  );

  pointer-events: none;
}

/* ---------- White card content ---------- */

.wc .wc-card .wc-t {
  position: absolute;
  z-index: 2;

  left: 24px;
  right: 24px;
  bottom: 26px;

  margin: 0;

  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(22px, 1.8vw, 27px);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.025em;

  color: #ffffff !important;

  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
  text-wrap: balance;

  user-select: text;
}

/* ---------- Tablet ---------- */

@media (max-width: 1000px) {
  .wc-item {
    width: clamp(250px, 32vw, 320px);
  }

  .wc .wc-card .wc-t {
    font-size: 23px;
  }
}

/* ---------- Mobile ---------- */

@media (max-width: 560px) {
  .wc {
    padding: 56px 0;
  }

  .wc-title {
    font-size: 36px;
  }

  .wc-track {
    gap: 14px;
    margin-top: 24px;
  }

  .wc-item {
    width: min(78vw, 300px);
  }

  .wc-card {
    border-radius: 22px;
  }

  .wc .wc-card .wc-t {
    left: 20px;
    right: 20px;
    bottom: 24px;

    font-size: 23px;
  }
}
</style>