<template>
  <section class="fq" aria-labelledby="fq-title">
    <div class="fq-wrap">
      <h2 id="fq-title" class="fq-title">Frequently <br /> <em>asked questions</em></h2>

      <div class="fq-main">
        <ul class="fq-list">
          <li v-for="(it, i) in items" :key="it.q" class="fq-item" :class="{ on: isOpen(i) }">
            <h3 class="fq-h">
              <button :id="`fq-b${i}`" type="button" :aria-expanded="isOpen(i)" :aria-controls="`fq-p${i}`" @click="toggle(i)">
                <span class="fq-q">{{ it.q }}</span>
                <svg class="fq-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </button>
            </h3>
            <div :id="`fq-p${i}`" class="fq-a" role="region" :aria-labelledby="`fq-b${i}`">
              <div><p>{{ it.a }}</p></div>
            </div>
          </li>
        </ul>

        <div class="fq-cta">
          <div class="fq-cta-text">
            <h3 class="fq-cta-h">Still have questions?</h3>
            <p class="fq-cta-p">Talk to our team about loyalty, stores and WhatsApp receipts for your retail business.</p>
          </div>
          <router-link :to="ctaTo" class="fq-btn">
            Book a retail demo
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'FaqRetail' })
/**
 * FaqRetail.vue — "Frequently asked questions" for the retail page, in the Pricing FAQ format:
 * big heading on the left, soft grey accordion rows on the right (one open at a time, first open by default)
 * and a black call-to-action box with a line of text and a button under the list. Vue 3, <script setup>, SSR safe.
 * The button goes to `cta-to` (default /demo/).
 */
import { ref } from 'vue'

defineProps({
  ctaTo: { type: String, default: '/demo/' },
})

const open = ref(0) // one answer open at a time; -1 means all closed
const isOpen = (i) => open.value === i
const toggle = (i) => {
  open.value = open.value === i ? -1 : i
}

const items = [
  { q: "Can Saptivo run a loyalty program?", a: "Yes. Set up points and tiers, and Saptivo updates them automatically with every purchase." },
  { q: "Can I send receipts on WhatsApp?", a: "Yes, using the official WhatsApp Business API and approved templates." },
  { q: "Can I manage several stores?", a: "Yes. Saptivo supports one to 100+ stores from a single head-office dashboard." },
  { q: "Does Saptivo work with my POS?", a: "Saptivo pairs with Cartinno POS, and other systems can connect through the API." },
  { q: "What is a CRM for retail?", a: "It records each shopper's purchases and preferences so stores can reward loyal customers, send personal offers and bring shoppers back." },
  { q: "How do VIP tiers work?", a: "Customers move between tiers such as Silver, Gold and Platinum automatically based on rules you set." },
  { q: "Can staff look up customers at the counter?", a: "Yes. Search by phone number to see a customer's tier, points and last purchase." },
  { q: "Can I send birthday offers?", a: "Yes. Automated birthday rewards and offers go out by WhatsApp or email." },
  { q: "Can I see my repeat purchase rate?", a: "Yes. Retail reports show repeat purchases, retention and branch performance." },
  { q: "Can I see best sellers by branch?", a: "Yes. Reports show best sellers and slow movers by branch and category." },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');

.fq, .fq * { box-sizing: border-box; }
.fq { --ease: cubic-bezier(0.2, 0.8, 0.2, 1); font-family: 'Urbanist', system-ui, sans-serif; color: #0f172a; background: #fff; }
.fq-wrap {
  max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px);
  display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); gap: clamp(24px, 6vw, 96px); align-items: start;
}

.fq-title {
  position: sticky; top: 130px; margin: 0; padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em;
}
.fq .fq-title { color: #0f172a !important; }
.fq-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}

.fq-main { min-width: 0; }
.fq-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.fq-item { overflow: hidden; border-radius: 18px; background: #f4f4f5; transition: background 0.3s ease; }
.fq-item.on { background: #ececee; }
.fq-h { margin: 0; font: inherit; }
.fq-h button {
  display: flex; font-family: inherit; width: 100%; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 24px;
  border: 0; background: none; font: inherit; text-align: left; cursor: pointer; color: #0f172a;
}
.fq-h button:focus-visible { outline: 2px solid #0f172a; outline-offset: -2px; border-radius: 18px; }
.fq-q { flex: 1; min-width: 0; font-size: clamp(16px, 1.25vw, 18.5px); font-weight: 600; line-height: 1.35; letter-spacing: -0.012em; }
.fq .fq-q { color: #0f172a; }
.fq-chev { flex: none; width: 22px; height: 22px; color: #3f3f46; transition: rotate 0.4s var(--ease); }
.fq-item.on .fq-chev { rotate: 180deg; }
.fq-item:not(.on) button:hover .fq-chev { translate: 0 2px; }

.fq-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s var(--ease); }
.fq-a > div { overflow: hidden; min-height: 0; }
.fq-a p { margin: 0; padding: 0 24px 24px; max-width: 58ch; font-size: 16px; font-weight: 500; line-height: 1.6; opacity: 0; transition: opacity 0.3s ease; }
.fq .fq-a p { color: #3b3f4a; }
.fq-item.on .fq-a { grid-template-rows: 1fr; }
.fq-item.on .fq-a p { opacity: 1; transition-delay: 0.1s; }

/* ---------- black call-to-action box ---------- */
.fq-cta {
  margin-top: clamp(22px, 2.6vw, 34px); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 22px 28px;
  padding: clamp(24px, 3vw, 40px); border-radius: clamp(22px, 2.4vw, 30px); background: #0a0a0a;
}
.fq-cta-text { flex: 1 1 280px; min-width: 0; }
.fq-cta-h { margin: 0; font-size: clamp(22px, 2.2vw, 30px); font-weight: 600; line-height: 1.15; letter-spacing: -0.03em; }
.fq-cta-p { margin: 8px 0 0; max-width: 34em; font-size: clamp(15px, 1.2vw, 17px); font-weight: 500; line-height: 1.55; }
.fq .fq-cta-h { color: #fff !important; -webkit-text-fill-color: #fff !important; }
.fq .fq-cta-p { color: rgba(255, 255, 255, 0.72) !important; -webkit-text-fill-color: rgba(255, 255, 255, 0.72) !important; }
.fq-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px; flex: none;
  min-height: 54px; padding: 0 28px; border-radius: 999px; background: #fff; color: #0a0a0a !important;
  font-size: clamp(15px, 1.1vw, 16.5px); font-weight: 600; text-decoration: none; white-space: nowrap;
  transition: background 0.3s, color 0.3s, transform 0.3s;
}
.fq-btn svg { width: 17px; height: 17px; transition: transform 0.3s var(--ease); }
.fq-btn:hover { background: #ff6b16; color: #fff !important; transform: translateY(-2px); }
.fq-btn:hover svg { transform: translateX(3px); }
.fq-btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

@media (max-width: 860px) {
  .fq-wrap { grid-template-columns: minmax(0, 1fr); }
  .fq-title { position: static; }
  .fq-h button { padding: 18px; }
  .fq-a p { padding: 0 18px 20px; }
}
@media (max-width: 520px) { .fq-btn { width: 100%; white-space: normal; text-align: center; } }
@media (prefers-reduced-motion: reduce) {
  .fq * { transition: none !important; }
}
</style>