<script setup>
import { ref } from "vue";

defineOptions({ name: "MobileCRMFAQ" });

const open = ref(0);
const faqs = [
  {
    q: "Does the mobile app work without internet?",
    a: "Yes. Changes made offline sync automatically when you're back online.",
  },
  {
    q: "Can I scan business cards?",
    a: "Yes. The scanner reads the card and creates the contact automatically.",
  },
  {
    q: "Is the mobile app included?",
    a: "Ask our team which mobile options your plan includes.",
  },
];

const links = [
  { label: "Service & AMC Management", href: "/saptivo/features/service-maintenance-management/" },
  { label: "Sales Pipeline", href: "/saptivo/features/sales-pipeline/" },
  { label: "Field Service & Maintenance", href: "/saptivo/features/service-maintenance-management/" },
];
</script>

<template>
  <section class="mobile-faq" aria-labelledby="mobile-faq-title">
    <div class="wrap">
      <div class="content">
        <h2 id="mobile-faq-title">Who uses Saptivo mobile</h2>
        <p class="intro">Field sales reps visiting customers, distributors' route salespeople, contractors on site, branch managers on the move and owners who want to check the numbers from anywhere.</p>
        <div class="faqs">
          <article v-for="(faq, i) in faqs" :key="faq.q" class="faq" :class="{ open: open === i }">
            <h3>
              <button type="button" :aria-expanded="open === i" @click="open = open === i ? -1 : i">
                <span>{{ faq.q }}</span><span class="plus" aria-hidden="true">{{ open === i ? "−" : "+" }}</span>
              </button>
            </h3>
            <p v-if="open === i">{{ faq.a }}</p>
          </article>
        </div>

        <nav class="related" aria-label="Related features">
          <span>Explore:</span>
          <template v-for="(link, i) in links" :key="link.label">
            <a :href="link.href">{{ link.label }}</a><span v-if="i < links.length - 1" aria-hidden="true">·</span>
          </template>
        </nav>
      </div>

      <aside class="cta">
        <span class="eyebrow">Saptivo Mobile CRM</span>
        <h3>Take your work with you</h3>
        <p>Keep customer details, follow-ups and updates close wherever the day takes you.</p>
        <a class="button" href="#signup">Get started free on mobile <span aria-hidden="true">→</span></a>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.mobile-faq {
  --ink: #17151b;
  --muted: #696a73;
  --line: #e9e7ee;
  padding: 96px 20px;
  background: #fff;
  color: var(--ink);
  font-family: "Urbanist", system-ui, sans-serif;
}
.wrap { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr); gap: 56px; max-width: 1120px; margin: 0 auto; align-items: start; }
h2 { margin: 0 0 28px; font-size: clamp(34px, 4vw, 52px); line-height: 1.1; font-weight: 600; letter-spacing: -.035em; }
.intro { margin: -8px 0 28px; color: var(--muted); font-size: 17px; line-height: 1.65; }
.faqs { border-top: 1px solid var(--line); }
.faq { border-bottom: 1px solid var(--line); }
.faq h3 { margin: 0; }
.faq button { display: flex; justify-content: space-between; align-items: center; gap: 20px; width: 100%; padding: 19px 2px; border: 0; background: transparent; color: var(--ink); text-align: left; font: inherit; font-size: 18px; font-weight: 600; cursor: pointer; }
.faq button:focus-visible, .button:focus-visible, .related a:focus-visible { outline: 2px solid #744bd8; outline-offset: 4px; }
.plus { color: #7958ce; font-size: 24px; font-weight: 400; }
.faq p { max-width: 680px; margin: -2px 0 20px; color: var(--muted); font-size: 16px; line-height: 1.65; }
.related { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 24px; color: var(--muted); font-size: 14px; }
.related a { color: #5e43a7; text-decoration: none; }
.related a:hover { text-decoration: underline; }
.cta { position: sticky; top: 24px; padding: 32px; border-radius: 28px; background: linear-gradient(145deg, rgba(30, 24, 48, .88), rgba(54, 42, 83, .72)), url("/saptivo/images/features/enthusiastic-man-talking-on-phone-in-office-2026-09-22-05-25-14-utc.webp") center / cover; color: #fff; box-shadow: 0 24px 56px rgba(48, 34, 88, .18); }
.eyebrow { display: inline-block; margin-bottom: 18px; color: #e4dcff; font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.cta h3 { margin: 0 0 12px; font-size: 30px; line-height: 1.15; }
.cta p { margin: 0 0 26px; color: rgba(255, 255, 255, .78); font-size: 16px; line-height: 1.6; }
.button { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 14px 18px; border-radius: 14px; background: #fff; color: #332755; font-size: 15px; font-weight: 700; text-decoration: none; transition: transform .2s ease; }
.button:hover { transform: translateY(-2px); }
@media (max-width: 800px) { .wrap { grid-template-columns: 1fr; gap: 36px; } .cta { position: static; } }
@media (max-width: 600px) { .mobile-faq { padding: 64px 18px; } .cta { padding: 26px; border-radius: 22px; } .faq button { font-size: 16px; } }
@media (prefers-reduced-motion: reduce) { .button { transition: none; } }
</style>
