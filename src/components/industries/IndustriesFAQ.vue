<template>
  <section class="fq" aria-labelledby="fq-title">
    <div class="fq-wrap">
      <img
        class="fq-image"
        :src="faqImage"
        alt="Colleagues working together around a laptop"
        loading="lazy"
      />

      <div class="fq-content">
        <h2 id="fq-title" class="fq-title">
          Frequently <span class="fq-g">asked questions</span>
        </h2>

        <ul class="fq-list">
          <li v-for="(it, i) in items" :key="it.q" :class="{ on: open === i }">
            <h3 class="fq-h">
              <button
                :id="`fq-b${i}`"
                type="button"
                :aria-expanded="open === i"
                :aria-controls="`fq-p${i}`"
                @click="open = open === i ? -1 : i"
              >
                <span class="fq-q">{{ it.q }}</span>
                <span class="fq-pm" aria-hidden="true"></span>
              </button>
            </h3>
            <div :id="`fq-p${i}`" class="fq-a" role="region" :aria-labelledby="`fq-b${i}`">
              <div>
                <p>{{ it.a }}</p>
              </div>
            </div>
          </li>
        </ul>

        <a class="fq-cta" :href="ctaHref">Book an industry demo</a>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'IndustryFaqSection' })
defineProps({
  // where the "Book an industry demo" button goes (set this to your demo / contact page)
  ctaHref: { type: String, default: '#demo' },
})
/**
 * SectionFaqIndustry.vue — FAQ accordion with an image and a CTA button (first item open by default).
 * Matches SectionHero / SectionWhy: Poppins, orange accent, same heading style.
 */
import { ref } from 'vue'

const open = ref(0)
const faqImage = `${import.meta.env.BASE_URL}images/features/threecolleagues-.jpg`

const items = [
  {
    q: 'Can Saptivo be customised for my industry?',
    a: 'Yes. Custom fields, pipeline stages, checklists, workflows and reports can all be configured for your business.',
  },
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Urbanist:wght@500;600&display=swap');

.fq {
  --ink: #14152b;
  --mute: #6c7084;
  --line: rgba(20, 21, 43, 0.12);
  --accent: #33485d;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  padding: 112px 0;
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
}
.fq *,
.fq *::before,
.fq *::after {
  box-sizing: border-box;
}
.fq-wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 40px);
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(32px, 5vw, 72px);
}
.fq-image {
  grid-column: 2;
  grid-row: 1;
  display: block;
  width: 100%;
  height: 100%;
  min-height: 500px;
  max-height: 680px;
  border-radius: 24px;
  object-fit: cover;
  object-position: 64% center;
}
.fq-content {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
}
.fq-title {
  margin: 0 0 36px;
  text-align: left;
  font-family: Urbanist, "Urbanist Placeholder", sans-serif !important;
  font-size: clamp(38px, 3.9vw, 54px) !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
  letter-spacing: -1px !important;
  color: #0a0a0a !important;
}
.fq-g {
  background: none !important;
  color: #615f5a !important;
  -webkit-text-fill-color: #615f5a !important;
}
.fq-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}
.fq-list li {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: #fff;
  transition: border-color 0.3s, background 0.3s, box-shadow 0.4s;
}
.fq-list li.on {
  border-color: rgba(51, 72, 93, 0.35);
  background: #f5f7f8;
  box-shadow: 0 16px 36px rgba(51, 72, 93, 0.1);
}
.fq-h {
  margin: 0;
  font: inherit;
}
.fq-h button {
  display: flex;
  width: 100%;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px;
  border: 0;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
  color: var(--ink);
}
.fq-h button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.fq-q {
  flex: 1;
  min-width: 0;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.01em;
  transition: color 0.3s;
}
.fq-list li:not(.on) button:hover .fq-q {
  color: var(--accent);
}
.fq-pm {
  position: relative;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f4efec;
  transition: background 0.3s, transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.fq-pm::before,
.fq-pm::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 2px;
  border-radius: 2px;
  background: var(--ink);
  transform: translate(-50%, -50%);
  transition: transform 0.4s, background 0.3s;
}
.fq-pm::after {
  transform: translate(-50%, -50%) rotate(90deg);
}
.fq-list li.on .fq-pm {
  background: var(--accent);
  transform: rotate(180deg);
}
.fq-list li.on .fq-pm::before,
.fq-list li.on .fq-pm::after { background: #fff; }
.fq-list li.on .fq-pm::after {
  transform: translate(-50%, -50%) rotate(0);
}
.fq-a {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s var(--ease);
}
.fq-a > div {
  overflow: hidden;
}
.fq-a p {
  margin: 0;
  padding: 0 24px 24px;
  max-width: 72ch;
  font-size: 15.5px;
  line-height: 1.7;
  color: var(--mute);
  opacity: 0;
  transition: opacity 0.3s;
}
.fq-list li.on .fq-a {
  grid-template-rows: 1fr;
}
.fq-list li.on .fq-a p {
  opacity: 1;
  transition-delay: 0.12s;
}

.fq-cta {
  display: inline-flex;
  align-items: center;
  margin-top: 28px;
  padding: 15px 28px;
  border-radius: 999px;
  background: #17191d;
  color: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: background 0.3s, transform 0.4s var(--ease);
}
.fq-cta:hover {
  background: #f2540c;
  transform: translateY(-2px);
}
.fq-cta:focus-visible {
  outline: 2px solid #f2540c;
  outline-offset: 3px;
}

@media (max-width: 760px) {
  .fq { padding: 72px 0; }
  .fq-wrap {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
  .fq-image,
  .fq-content {
    grid-column: 1;
    grid-row: auto;
  }
  .fq-image {
    height: auto;
    min-height: 0;
    max-height: none;
    aspect-ratio: 16 / 10;
    object-position: center 48%;
  }
  .fq-title { margin-bottom: 32px; font-size: clamp(34px, 9vw, 44px) !important; }
  .fq-h button { padding: 18px 16px; }
  .fq-q { font-size: 15.5px; }
  .fq-a p { padding: 0 16px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .fq-cta,
  .fq-a,
  .fq-pm::before,
  .fq-pm::after,
  .fq-a p {
    transition: none;
  }
}
</style>