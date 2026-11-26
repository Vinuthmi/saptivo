
<template>
  <section class="ec" aria-label="Equipment service features">

    <ul class="ec-grid">

      <li
        v-for="c in cards"
        :key="c.id"
        :class="['ec-card', `ec-${c.id}`]"
        tabindex="0"
      >

        <img
          v-if="!failed[c.id]"
          class="ec-img"
          :src="fallbackUsed[c.id] ? c.fallback : c.img"
          :style="{
            objectPosition: c.position || 'center'
          }"
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          @error="handleImageError(c.id)"
        />

        <span
          class="ec-shade"
          aria-hidden="true"
        ></span>

        <div class="ec-copy">

          <h2 class="ec-h">{{ c.h }}</h2>

          <p class="ec-p">{{ c.p }}</p>

        </div>

      </li>

    </ul>

  </section>
</template>

<script setup>
import { reactive } from 'vue'

defineOptions({
  name: 'EquipmentServiceCards'
})

const u = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=85&auto=format&fit=crop`

const cards = [
  {
    id: 'ac',
    h: 'Air conditioning service companies',

    img: u('1581092921461-eab62e97a780'),
    fallback: u('1621905251189-08b45d6a269e'),

    position: 'center 40%',

    p: "Each AC unit is registered with its serial number, tonnage, brand and installation date at the customer's site. A quarterly preventive service schedule generates job cards automatically. Technicians follow a digital checklist covering gas pressure, filter cleaning, coil wash and drainage, capture before and after photos and record refrigerant top-ups. AMC contracts cover a set number of visits a year, and breakdown calls outside the AMC are flagged as chargeable automatically. It's AC service software built around how AC companies really work."
  },

  {
    id: 'solar',
    h: 'Solar power system maintenance',

    img: u('1509391366360-2e959784a276'),
    fallback: u('1473341304170-971dccb5ac1d'),

    position: 'center',

    p: "Each installation is registered with panel count, inverter model, system capacity in kW and commissioning date. Six-monthly panel cleaning and annual inverter inspections are scheduled automatically. Technicians log generation output in kWh, string voltage and earthing resistance on site. Saptivo tracks performance over time, flags underperforming systems for proactive service and manages inverter warranty claims with the manufacturer."
  },

  {
    id: 'generator',
    h: 'Generator and power backup service',

    img: u('1581092160562-40aa08e78837'),
    fallback: u('1581092921461-eab62e97a780'),

    position: 'center',

    p: "Service intervals are driven by running hours rather than calendar dates. When a generator crosses its threshold, a job card is created automatically. Oil, filter and coolant changes are logged with parts deducted from van stock, and load test results are recorded against the asset."
  },

  {
    id: 'facility',
    h: 'CCTV, lifts and facility equipment',

    img: u('1557597774-9d273605dfa9'),
    fallback: u('1497366754035-f200968a6e72'),

    position: 'center',

    p: "Multi-asset sites are managed under one customer account, with an individual record for every camera, lift or unit. Recurring inspections, statutory compliance certificates and breakdown response SLAs are tracked per asset, with a site-level service history for facility managers."
  }
]

const failed = reactive({})
const fallbackUsed = reactive({})

function handleImageError(id) {
  if (!fallbackUsed[id]) {
    fallbackUsed[id] = true
  } else {
    failed[id] = true
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');

/* =========================================
   SECTION — NO TOP PADDING
========================================= */

.ec,
.ec * {
  box-sizing: border-box;
}

.ec {
  --ec-gap: clamp(12px, 1.4vw, 20px);

  font-family: 'Urbanist', system-ui, sans-serif;

  background: #fff;
  color: #0f172a;

  margin-top: 0;

  padding: 0
           clamp(16px, 3vw, 32px)
           clamp(32px, 5vw, 72px);
}

/* =========================================
   GRID LAYOUT

   First row: One full-width card
   Second row: Three equal-width cards
========================================= */

.ec-grid {
  list-style: none;

  margin: 0 auto;
  padding: 0;

  max-width: 1560px;

  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: var(--ec-gap);
}

/* =========================================
   PHOTO CARDS
========================================= */

.ec-card {
  position: relative;
  isolation: isolate;

  min-width: 0;
  min-height: 0;

  overflow: hidden;

  border-radius: clamp(20px, 2vw, 28px);

  color: #fff;

  background: linear-gradient(
    150deg,
    #5b5855,
    #1c1b1a
  );

  outline: none;
}

/* =========================================
   FIRST CARD — FULL WIDTH
========================================= */

.ec-ac {
  grid-column: 1 / -1;

  height: auto;
  min-height: clamp(360px, 30vw, 460px);
}

/* =========================================
   SECOND ROW — THREE EQUAL CARDS
========================================= */

.ec-solar,
.ec-generator,
.ec-facility {
  grid-column: span 1;

  height: clamp(350px, 30vw, 440px);
}

/* =========================================
   BACKGROUND IMAGES
========================================= */

.ec-img {
  position: absolute;
  inset: 0;

  z-index: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  display: block;

  pointer-events: none;
}

/* =========================================
   IMAGE OVERLAY
========================================= */

.ec-shade {
  position: absolute;
  inset: 0;

  z-index: 1;

  pointer-events: none;

  background: linear-gradient(
    180deg,
    rgba(8, 10, 14, 0.72) 0%,
    rgba(8, 10, 14, 0.30) 55%,
    rgba(8, 10, 14, 0.10) 100%
  );
}

/* First card horizontal gradient */

.ec-ac .ec-shade {
  background: linear-gradient(
    90deg,
    rgba(8, 10, 14, 0.78) 0%,
    rgba(8, 10, 14, 0.48) 40%,
    rgba(8, 10, 14, 0.12) 75%,
    transparent 100%
  );
}

/* Darker overlay on hover */

.ec-card:hover .ec-shade,
.ec-card:focus-within .ec-shade {
  background: rgba(8, 10, 14, 0.78);
}

/* First card hover gradient */

.ec-ac:hover .ec-shade,
.ec-ac:focus-within .ec-shade {
  background: linear-gradient(
    90deg,
    rgba(8, 10, 14, 0.90) 0%,
    rgba(8, 10, 14, 0.78) 40%,
    rgba(8, 10, 14, 0.25) 75%,
    transparent 100%
  );
}

/* =========================================
   CARD CONTENT
========================================= */

.ec-copy {
  position: relative;
  z-index: 2;

  padding: clamp(22px, 2.2vw, 34px);

  height: 100%;
  max-height: 100%;

  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: #ffffff60 transparent;
}

/* =========================================
   FIRST CARD CONTENT — NO SCROLLBAR
========================================= */

.ec-ac .ec-copy {
  width: 100%;
  max-width: 780px;

  height: auto;
  max-height: none;

  padding: clamp(26px, 3.5vw, 54px);

  overflow: visible;

  scrollbar-width: none;
  -ms-overflow-style: none;
}

.ec-ac .ec-copy::-webkit-scrollbar {
  display: none;
}

/* =========================================
   CARD HEADINGS
========================================= */

.ec-h {
  margin: 0;

  font-family: 'Urbanist', system-ui, sans-serif;

  font-size: clamp(24px, 2.1vw, 32px);
  font-weight: 600;

  line-height: 1.18;
  letter-spacing: -0.025em;

  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

/* First card heading */

.ec-ac .ec-h {
  max-width: 680px;

  font-size: clamp(32px, 3.6vw, 54px);

  font-weight: 600;
  line-height: 1.1;

  letter-spacing: -0.035em;
}

/* =========================================
   CARD DESCRIPTIONS
========================================= */

.ec-p {
  display: none;

  margin: 14px 0 0;

  font-size: clamp(13px, 1.05vw, 15px);
  font-weight: 500;

  line-height: 1.6;
  letter-spacing: 0.005em;

  color: #fff !important;
  -webkit-text-fill-color: #fff !important;

  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.6),
    0 2px 16px rgba(0, 0, 0, 0.7);
}

/* First card description */

.ec-ac .ec-p {
  max-width: 680px;

  margin-top: 18px;

  font-size: clamp(14px, 1.1vw, 16px);
  line-height: 1.65;
}

/* =========================================
   HOVER AND KEYBOARD FOCUS
========================================= */

.ec-card:hover .ec-p,
.ec-card:focus-within .ec-p {
  display: block;
}

.ec-card:focus-visible {
  outline: 3px solid #71717a;
  outline-offset: -3px;
}

/* =========================================
   SCROLLBAR — BOTTOM THREE CARDS ONLY
========================================= */

.ec-card:not(.ec-ac) .ec-copy::-webkit-scrollbar {
  width: 4px;
}

.ec-card:not(.ec-ac) .ec-copy::-webkit-scrollbar-track {
  background: transparent;
}

.ec-card:not(.ec-ac) .ec-copy::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.45);

  border-radius: 999px;
}

/* =========================================
   TABLET RESPONSIVE
========================================= */

@media (max-width: 1100px) {

  .ec-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ec-ac {
    height: auto;
    min-height: 400px;
  }

  .ec-solar,
  .ec-generator,
  .ec-facility {
    height: 380px;
  }

  .ec-copy {
    padding: 22px;
  }

  .ec-ac .ec-copy {
    max-width: 720px;

    height: auto;
    max-height: none;

    padding: 32px;

    overflow: visible;
  }

  .ec-h {
    font-size: 24px;
  }

  .ec-ac .ec-h {
    font-size: clamp(32px, 4vw, 44px);
  }

  .ec-p {
    font-size: 13px;
  }

  .ec-ac .ec-p {
    font-size: 15px;
    line-height: 1.65;
  }

}

/* =========================================
   SMALL TABLET
========================================= */

@media (max-width: 760px) {

  .ec-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .ec-ac,
  .ec-solar,
  .ec-generator,
  .ec-facility {
    grid-column: 1 / -1;

    height: auto;
    min-height: 340px;
  }

  .ec-ac {
    min-height: 420px;
  }

  .ec-copy,
  .ec-ac .ec-copy {
    max-width: 100%;

    height: auto;
    max-height: none;

    padding: 26px;

    overflow: visible;
  }

  .ec-h,
  .ec-ac .ec-h {
    font-size: 30px;
    line-height: 1.15;
  }

  .ec-p,
  .ec-ac .ec-p {
    display: block;

    margin-top: 14px;

    font-size: 14px;
    line-height: 1.6;
  }

  .ec-card .ec-shade,
  .ec-card:hover .ec-shade,
  .ec-card:focus-within .ec-shade {
    background: rgba(8, 10, 14, 0.76);
  }

}

/* =========================================
   TOUCH DEVICES
========================================= */

@media (hover: none) {

  .ec-card {
    height: auto;
    min-height: 340px;
  }

  .ec-ac {
    min-height: 420px;
  }

  .ec-p {
    display: block;
  }

  .ec-card .ec-shade,
  .ec-card:hover .ec-shade,
  .ec-card:focus-within .ec-shade {
    background: rgba(8, 10, 14, 0.76);
  }

  .ec-copy,
  .ec-ac .ec-copy {
    height: auto;
    max-height: none;

    overflow: visible;
  }

}

/* =========================================
   MOBILE RESPONSIVE — NO TOP PADDING
========================================= */

@media (max-width: 560px) {

  .ec {
    padding: 0 16px 32px;
  }

  .ec-grid {
    gap: 14px;
  }

  .ec-card {
    min-height: 320px;

    border-radius: 22px;
  }

  .ec-ac {
    min-height: 420px;
  }

  .ec-solar {
    min-height: 380px;
  }

  .ec-copy,
  .ec-ac .ec-copy {
    max-width: 100%;

    padding: 24px;

    height: auto;
    max-height: none;

    overflow: visible;
  }

  .ec-h,
  .ec-ac .ec-h {
    font-size: 27px;
    line-height: 1.15;
  }

  .ec-p,
  .ec-ac .ec-p {
    font-size: 14px;
    line-height: 1.6;
  }

}
</style>
