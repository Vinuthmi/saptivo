<template>
  <section class="rc" aria-label="Retail features">
    <ul class="rc-grid">
      <li v-for="c in cards" :key="c.id" class="rc-card" tabindex="0">
        <img v-if="!failed[c.id]" class="rc-img" :src="c.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[c.id] = true" />
        <span class="rc-shade" aria-hidden="true"></span>
        <div class="rc-copy">
          <h3 class="rc-h">{{ c.h }}</h3>
          <p class="rc-p">{{ c.p }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineOptions({ name: 'RetailCards' })
/**
 * SectionRetailCards.vue — four photo cards (4 in view, same size as the distributor cards). Heading on top; the description
 * shows on hover or keyboard focus (always visible on touch). No animations. Photos fall back to a tinted gradient.
 */
import { reactive } from 'vue'

const u = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`
const cards = [
  { id: 'cus', h: 'Know every customer, not just every sale', img: u('1556742049-0cfed4f6a45d'),
    p: "Saptivo builds a profile for each shopper: purchase history, lifetime value, visit frequency, favourite products and the branch they use most. Search by phone number at the counter and see the customer's tier, points and last purchase instantly." },
  { id: 'loy', h: 'Loyalty and VIP tiers that run themselves', img: u('1521737604893-d14cc237f11d'),
    p: "Create reward tiers such as Silver, Gold and Platinum with your own rules. Points accrue automatically with every purchase, customers move up tiers without manual work and staff can see how close a customer is to the next reward. Saptivo's loyalty program software gives regulars a reason to choose you." },
  { id: 'wa', h: 'WhatsApp receipts and personal offers', img: u('1556740738-b6a63e27c4df'),
    p: 'Send a digital receipt on WhatsApp after every purchase, along with loyalty points earned. Follow up with personal offers based on what each customer buys, birthday rewards or new-stock alerts, all through approved WhatsApp Business templates.' },
  { id: 'br', h: 'Multi-branch and multi-counter control', img: u('1586528116311-ad8dd3c8310d'),
    p: 'Run every store, counter and warehouse from one head-office dashboard. Branch managers handle their own staff and stock, while head office sees sales, stock levels and audit trails across the chain. Instant inventory audits and branch transfers keep shelves full.' },
]
const failed = reactive({})
</script>

<style>
.rc, .rc * { box-sizing: border-box; }
.rc { font-family: 'Urbanist', system-ui, sans-serif; background: #fff; color: #0f172a; padding: clamp(32px, 5vw, 72px) clamp(16px, 3vw, 32px); }
.rc-grid { list-style: none; margin: 0 auto; padding: 0; max-width: 1560px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(12px, 1.4vw, 20px); }
.rc-card { position: relative; isolation: isolate; overflow: hidden; aspect-ratio: 1 / 1.1; border-radius: clamp(20px, 2vw, 28px); color: #fff; background: linear-gradient(150deg, #5b5855, #1c1b1a); outline: none; }
.rc-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; display: block; }
.rc-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(8, 10, 14, 0.72) 0%, rgba(8, 10, 14, 0.3) 55%, rgba(8, 10, 14, 0.1) 100%); }
.rc-card:focus-visible { box-shadow: 0 0 0 3px #71717a; }
.rc-copy { padding: clamp(18px, 1.8vw, 26px); }
.rc-h { margin: 0; font-size: clamp(20px, 1.75vw, 25px); font-weight: 600; line-height: 1.18; letter-spacing: -0.015em; }
.rc .rc-h { color: #fff !important; }
.rc-p { margin: 10px 0 0; font-size: clamp(12.5px, 0.95vw, 14.5px); font-weight: 500; line-height: 1.5; letter-spacing: 0.012em; display: none; }
.rc .rc-p { color: #fff !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 2px 16px rgba(0, 0, 0, 0.7); }
.rc-card:hover .rc-p, .rc-card:focus-visible .rc-p { display: block; }

@media (hover: none) { .rc-p { display: block; } .rc-card { aspect-ratio: auto; min-height: 320px; } }
@media (max-width: 1100px) { .rc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .rc-grid { grid-template-columns: 1fr; } .rc-card { aspect-ratio: auto; min-height: 300px; } .rc-p { display: block; } }
</style>