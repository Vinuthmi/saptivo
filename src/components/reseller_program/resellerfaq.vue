<template>
  <section class="pf" aria-labelledby="pf-title">
    <div class="pf-wrap">
      <h2 id="pf-title" class="pf-title">Frequently <br> <em>asked questions</em></h2>

      <div class="pf-main">
        <ul class="pf-list">
          <li v-for="(it, i) in items" :key="it.q" class="pf-item" :class="{ on: isOpen(i) }">
            <h3 class="pf-h">
              <button
                :id="`pf-b${i}`"
                type="button"
                :aria-expanded="isOpen(i)"
                :aria-controls="`pf-p${i}`"
                @click="toggle(i)"
              >
                <span class="pf-q">{{ it.q }}</span>
                <svg class="pf-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </button>
            </h3>
            <div :id="`pf-p${i}`" class="pf-a" role="region" :aria-labelledby="`pf-b${i}`">
              <div><p>{{ it.a }}</p></div>
            </div>
          </li>
        </ul>

        <FaqCallout
          primary-label="Apply to become a reseller"
          :primary-to="applyTo"
          secondary-label="Start your free trial"
          secondary-to="/demo/"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'PricingFaq' })
/**
- SectionPricingFaq.vue — "FAQ": big heading on the left, a stack of soft grey accordion rows on the right
- (several can be open at once, first open by default) and the CTA under the list. Vue 3, <script setup>.
- The CTA link defaults to /contact/ — pass `apply-to` or edit the default. SSR safe.
 */
import { ref } from 'vue'
import FaqCallout from '@/components/shared/FaqCallout.vue'

defineProps({
  applyTo: { type: String, default: '/contact/' },
})

const open = ref([0])
const isOpen = (i) => open.value.includes(i)
const toggle = (i) => {
  open.value = isOpen(i) ? open.value.filter((n) => n !== i) : [...open.value, i]
}

const items = [
  {
    q: 'Can I sell Saptivo under my own brand?',
    a: 'Yes, through the white-label option.',
  },
  {
    q: 'How are commissions tracked?',
    a: 'The partner hub shows your clients, their subscriptions and your commissions in real time.',
  },
  {
    q: 'Who can become a Saptivo reseller?',
    a: 'IT solution providers, digital agencies, accountants, business consultants, telecom and 3CX partners, and POS or hardware resellers.',
  },
  {
    q: 'How does wholesale pricing work?',
    a: 'Your discount tier rises as your monthly partner sales grow.',
  },
  {
    q: 'Do I need technical skills to resell Saptivo?',
    a: 'No. Weblook provides training, demo workspaces and help with your first deployments.',
  },
  {
    q: 'Can I use my own domain for clients?',
    a: 'Yes. The white-label option puts your logo, colours and domain on the CRM and customer portal.',
  },
  {
    q: 'How do I create a workspace for a new client?',
    a: 'Provision client workspaces in minutes from the partner hub.',
  },
  {
    q: 'Do I get sales materials?',
    a: 'Yes. Partners receive sales materials and a demo workspace.',
  },
  {
    q: 'Who supports my clients?',
    a: 'Talk to our partner team about support arrangements for your tier.',
  },
  {
    q: 'How do I apply?',
    a: 'Complete the reseller signup form and our partner team will contact you.',
  },
]
</script>

<style>
.pf, .pf * { box-sizing: border-box; }
.pf { --ease: cubic-bezier(0.2, 0.8, 0.2, 1); font-family: 'Urbanist', system-ui, sans-serif; color: #0f172a; background: #fff; }
.pf-wrap {
  max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px);
  display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); gap: clamp(24px, 6vw, 96px); align-items: start;
}

.pf-title {
  position: sticky; top: 130px; margin: 0; padding-bottom: 0.12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em;
}
.pf .pf-title { color: #0f172a !important; }
.pf-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}

.pf-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.pf-item { overflow: hidden; border-radius: 18px; background: #f4f4f5; transition: background 0.3s ease; }
.pf-item.on { background: #ececee; }
.pf-h { margin: 0; font: inherit; }
.pf-h button {
  display: flex; font-family: inherit; width: 100%; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 24px;
  border: 0; background: none; font: inherit; text-align: left; cursor: pointer; color: #0f172a;
}
.pf-h button:focus-visible { outline: 2px solid #0f172a; outline-offset: -2px; border-radius: 18px; }
.pf-q { flex: 1; min-width: 0; font-size: clamp(16px, 1.25vw, 18.5px); font-weight: 600; line-height: 1.35; letter-spacing: -0.012em; }
.pf .pf-q { color: #0f172a; }
.pf-chev { flex: none; width: 22px; height: 22px; color: #3f3f46; transition: rotate 0.4s var(--ease); }
.pf-item.on .pf-chev { rotate: 180deg; }
.pf-item:not(.on) button:hover .pf-chev { translate: 0 2px; }

.pf-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s var(--ease); }
.pf-a > div { overflow: hidden; min-height: 0; }
.pf-a p { margin: 0; padding: 0 24px 24px; max-width: 58ch; font-family: 'Urbanist', system-ui, sans-serif; font-size: 16px; font-weight: 500; line-height: 1.6; opacity: 0; transition: opacity 0.3s ease; }
.pf .pf-a p { color: #3b3f4a; }
.pf-item.on .pf-a { grid-template-rows: 1fr; }
.pf-item.on .pf-a p { opacity: 1; transition-delay: 0.1s; }

.pf-cta { margin-top: clamp(22px, 2.6vw, 34px); display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.pf-btn {
  font-family: inherit; display: inline-flex; align-items: center; justify-content: center; padding: 15px 30px; border-radius: 999px; border: 1.5px solid #0f172a;
  background: #fff; color: #0f172a !important; font-size: clamp(15px, 1.1vw, 16.5px); font-weight: 500; text-decoration: none; transition: background 0.3s, color 0.3s, transform 0.3s;
}
.pf-btn:hover { background: #f4f4f5; transform: translateY(-2px); }
.pf-btn-d { background: #0f172a; color: #fff !important; }
.pf-btn-d:hover { background: #2b3446; }
.pf-btn:focus-visible { outline: 2px solid #0f172a; outline-offset: 3px; }

@media (max-width: 860px) {
  .pf-wrap { grid-template-columns: minmax(0, 1fr); }
  .pf-title { position: static; }
  .pf-h button { padding: 18px 18px; }
  .pf-a p { padding: 0 18px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .pf * { transition: none !important; }
}
</style>
