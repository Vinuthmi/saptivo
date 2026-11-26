
<template>
  <section class="sc" aria-label="Startup CRM features">

    <ul class="sc-grid">

      <li
        v-for="c in cards"
        :key="c.id"
        class="sc-card"
        tabindex="0"
      >

        <img
          v-if="!failed[c.id]"
          class="sc-img"
          :src="c.img"
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          @error="failed[c.id] = true"
        />

        <span class="sc-shade" aria-hidden="true"></span>

        <div class="sc-copy">

          <h2 class="sc-h">{{ c.h }}</h2>

          <p class="sc-p">{{ c.p }}</p>

        </div>

      </li>

    </ul>

  </section>
</template>

<script setup>
import { reactive } from 'vue'

defineOptions({
  name: 'StartupCards'
})

const u = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=85&auto=format&fit=crop`

const cards = [
  {
    id: 'setup',
    h: 'Up and running in minutes',
    img: u('1499951360447-b19be8fe80f5'),
    p: "Import your contacts from Excel, connect your website form and WhatsApp number, and start working. A setup specialist helps during your free trial, so you don't need an IT team."
  },
  {
    id: 'pipeline',
    h: 'A clear client pipeline',
    img: u('1552664730-d307ca884978'),
    p: "See every opportunity on one board, know what needs to happen next and never forget a follow-up. Even a team of two benefits from knowing who is talking to which customer."
  },
  {
    id: 'quotations',
    h: 'Zero-friction quotations',
    img: u('1554224155-6726b3ff858f'),
    p: "Send a branded quotation while the customer is still interested, then convert it to an invoice in one click when they say yes. Look bigger than you are from your very first quote."
  },
  {
    id: 'growth',
    h: 'Pay as you grow',
    img: u('1522071820081-009f0129c71c'),
    p: "No setup fee and no upgrade fees. Start with what you need and add users, modules and branches when you're ready. Saptivo is the CRM for startups that won't punish you for growing."
  }
]

const failed = reactive({})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');

.sc,
.sc * {
  box-sizing: border-box;
}

.sc {
  font-family: 'Urbanist', system-ui, sans-serif;

  background: #fff;
  color: #0f172a;

  padding: clamp(32px, 5vw, 72px)
           clamp(16px, 3vw, 32px);
}

/* Four-column static grid */

.sc-grid {
  list-style: none;

  margin: 0 auto;
  padding: 0;

  max-width: 1560px;

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: clamp(12px, 1.4vw, 20px);
}

/* Photo cards */

.sc-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  aspect-ratio: 1 / 1.1;

  border-radius: clamp(20px, 2vw, 28px);

  color: #fff;

  background: linear-gradient(
    150deg,
    #5b5855,
    #1c1b1a
  );

  outline: none;
}

/* Background image */

.sc-img {
  position: absolute;
  inset: 0;
  z-index: -2;

  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}

/* Dark gradient for text readability */

.sc-shade {
  position: absolute;
  inset: 0;
  z-index: -1;

  background: linear-gradient(
    180deg,
    rgba(8, 10, 14, 0.72) 0%,
    rgba(8, 10, 14, 0.30) 55%,
    rgba(8, 10, 14, 0.10) 100%
  );
}

.sc-card:hover .sc-shade,
.sc-card:focus-within .sc-shade {
  background: rgba(8, 10, 14, 0.78);
}

.sc-card:focus-visible {
  outline: 3px solid #71717a;
  outline-offset: -3px;
}

/* Card content */

.sc-copy {
  padding: clamp(18px, 1.8vw, 26px);

  max-height: 100%;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: #ffffff60 transparent;
}

.sc-h {
  margin: 0;

  font-size: clamp(20px, 1.75vw, 25px);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.015em;

  color: #fff !important;
}

/* Description hidden by default */

.sc-p {
  display: none;

  margin: 10px 0 0;

  font-size: clamp(12.5px, 0.95vw, 14.5px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.012em;

  color: #fff !important;

  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.6),
    0 2px 16px rgba(0, 0, 0, 0.7);
}

/* Reveal description */

.sc-card:hover .sc-p,
.sc-card:focus-within .sc-p {
  display: block;
}

/* Touch devices */

@media (hover: none) {
  .sc-p {
    display: block;
  }

  .sc-card {
    aspect-ratio: auto;
    min-height: 320px;
  }

  .sc-shade {
    background: rgba(8, 10, 14, 0.75);
  }

  .sc-copy {
    overflow-y: visible;
  }
}

/* Tablet */

@media (max-width: 1100px) {
  .sc-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

/* Mobile */

@media (max-width: 560px) {
  .sc-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .sc-card {
    aspect-ratio: auto;
    min-height: 300px;
  }

  .sc-p {
    display: block;
  }

  .sc-shade {
    background: rgba(8, 10, 14, 0.75);
  }

  .sc-copy {
    overflow-y: visible;
  }
}
</style>
