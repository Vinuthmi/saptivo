<template>
  <section class="fq" aria-labelledby="fq-title">
    <div class="fq-wrap">
      <h2 id="fq-title" class="fq-title">
        <span>Frequently</span>
        <span class="fq-g">asked questions.</span>
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
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeFaqSection' })
/**
 * SectionFaq.vue — plain typographic accordion (one open at a time, first open by default).
 * Matches SectionHero / SectionWhy: Poppins, orange accent, same heading style.
 */
import { ref } from 'vue'

const open = ref(0)

const items = [
  {
    q: 'What is Saptivo CRM?',
    a: 'Saptivo is a cloud-based customer relationship management platform by Weblook International. It combines lead management, sales pipeline, WhatsApp, phone calls, quotations, invoicing and after-sales service in one system.',
  },
  {
    q: 'What is the best CRM software in Sri Lanka for small businesses?',
    a: 'The best CRM is one your team will actually use. Saptivo is built for Sri Lankan and international SMEs: it works with WhatsApp and 3CX, invoices in LKR with VAT, has no setup fee, and you can start with a single user.',
  },
  {
    q: 'Does Saptivo work with WhatsApp?',
    a: 'Yes. Saptivo connects to the official WhatsApp Business API, so your team shares one inbox, sends approved templates and logs every chat to the customer record.',
  },
  {
    q: 'Can I use Saptivo for more than one branch?',
    a: 'Yes. You can manage one to 100+ branches from a single dashboard, with permissions and reports for each branch.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. You get 14 days with full features and no credit card required.',
  },
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.fq {
  --ink: #14152b;
  --mute: #6c7084;
  --line: rgba(20, 21, 43, 0.12);
  --o2: #f2540c;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
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
  padding: clamp(48px, 6vw, 96px) clamp(20px, 4vw, 40px);
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
  gap: clamp(28px, 6vw, 96px);
  align-items: start;
}
.fq-title {
  position: sticky;
  top: 32px;
  margin: 0;
  padding-bottom: 0.2em;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(40px, 3.5vw, 104px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.06em;
  color: #0f172a;
}
.fq-title span {
  display: block;
}
.fq-g {
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  padding-bottom: 0.08em;
}
.fq-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1.5px solid var(--ink);
}
.fq-list li {
  border-bottom: 1px solid var(--line);
}
.fq-h {
  margin: 0;
  font: inherit;
}
.fq-h button {
  display: flex;
  width: 100%;
  gap: 24px;
  justify-content: space-between;
  align-items: flex-start;
  padding: 22px 0;
  border: 0;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
  color: var(--ink);
}
.fq-h button:focus-visible {
  outline: 2px solid var(--o2);
  outline-offset: 2px;
}
.fq-q {
  font-size: clamp(17px, 1.4vw, 20px);
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.01em;
  transition: color 0.3s;
}
.fq-list li:not(.on) button:hover .fq-q {
  color: var(--o2);
}
.fq-pm {
  position: relative;
  flex: none;
  width: 18px;
  height: 18px;
  margin-top: 6px;
}
.fq-pm::before,
.fq-pm::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 8px;
  height: 2px;
  border-radius: 2px;
  background: var(--ink);
  transition: transform 0.45s var(--ease), background 0.3s;
}
.fq-pm::after {
  transform: rotate(90deg);
}
.fq-list li.on .fq-pm::before,
.fq-list li.on .fq-pm::after {
  background: var(--o2);
}
.fq-list li.on .fq-pm::after {
  transform: rotate(0);
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
  padding: 0 42px 24px 0;
  max-width: 62ch;
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

@media (max-width: 860px) {
  .fq-wrap {
    grid-template-columns: minmax(0, 1fr);
  }
  .fq-title {
    position: static;
  }
}
@media (prefers-reduced-motion: reduce) {
  .fq-a,
  .fq-pm::before,
  .fq-pm::after,
  .fq-a p {
    transition: none;
  }
}
</style>
