<template>
  <section id="pricing" class="sp" aria-label="Pricing">
    <div class="in">

      <!-- plan cards -->
      <div class="cards">
        <article v-for="(p, i) in plans" :key="p.name" class="card" :class="{ hot: i === featured }">
          <h3 class="c-name">{{ p.name }}</h3>
          <p class="c-price"><b>${{ p.price }}</b><span>/12 months</span></p>
          <p class="c-setup">Setup Fee - {{ p.setup }}</p>

          <p class="c-inc">Includes:</p>
          <ul class="c-list">
            <li v-for="k in shown(p)" :key="k">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" /><path d="m7.3 12.4 3.2 3.2 6.2-6.4" /></svg>
              {{ p.q[k] }} {{ labels[k] }}
            </li>
          </ul>

          <a class="c-btn" :href="p.href">Buy</a>
        </article>
      </div>

      <!-- comparison table -->
      <div class="tbl-wrap" tabindex="0" role="region" aria-label="Compare plans">
        <table class="tbl">
          <thead>
            <tr>
              <td class="blank"></td>
              <th v-for="p in plans" :key="p.name" scope="col">{{ p.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Price</th>
              <td v-for="p in plans" :key="p.name">${{ p.price }}/12 months</td>
            </tr>
            <tr>
              <th scope="row">Setup Fee</th>
              <td v-for="p in plans" :key="p.name">{{ p.setup }}</td>
            </tr>
            <tr v-for="(l, k) in labels" :key="l">
              <th scope="row">{{ l }}</th>
              <td v-for="p in plans" :key="p.name">{{ p.q[k] ?? '' }}</td>
            </tr>
            <tr class="buy">
              <th scope="row"></th>
              <td v-for="p in plans" :key="p.name"><a class="t-btn" :href="p.href">Buy</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * SectionPricingClean.vue: clean pricing cards and a comparison table (Vue 3, <script setup>, scoped CSS).
 *
 * Built like your reference: soft grey cards (one in black) with a ticked list and a Buy button,
 * then a table with a black header row and the limits as rows. Orange appears only on hover and focus.
 * Figures are copied from your pricing video (USD per 12 months, setup fee $100). Nothing added.
 * Cards list Staff, Contacts, Invoices and MB Storage (blank values are skipped); the table has every limit.
 * `featured` is the index of the black card (null for none).
 * Check before publishing: "Co-Oporate" spelling; Enterprise CRM contacts (100) is below Co-Oporate (500);
 * Enterprise 100 Staff has numbers only for Staff, Projects and MB Storage, other cells are blank.
 * `href` is a placeholder (#) on each plan.
 */
defineOptions({ name: 'SectionPricingClean' })

const featured = 2
const labels = ['Staff', 'Contacts', 'Invoices', 'Creditnotes', 'Projects', 'Tickets', 'Items',
  'Contracts', 'Estimates', 'Proposals', 'Tasks', 'Leads', 'MB Storage']

const plans = [
  { name: 'Developer CRM', price: '239.40', q: ['10','250','100','0','0','250','100','0','100','250','250','50','2500'] },
  { name: 'Co-Oporate CRM', price: '430.80', q: ['20','500','250','0','10','500','250','25','250','500','500','250','5000'] },
  { name: 'Enterprise CRM', price: '599.40', q: ['30','100','500','100','20','1000','500','50','500','500','100','500','10000'] },
  { name: 'Enterprise 40 Staff CRM', price: '1188.00', q: ['40','2000','1000','200','50','1500','1500','250','1000','1000','1500','1000','20000'] },
  { name: 'Enterprise 50 Staff CRM', price: '1799.40', q: ['50','2500','2500','500','100','2500','2500','2500','2500','3000','2500','2500','50000'] },
  { name: 'Enterprise 100 Staff CRM', price: '2399.40', q: ['100',null,null,null,'0',null,null,null,null,null,null,null,'100000'] },
].map((p) => ({ ...p, setup: '$100', href: '#' }))

const shown = (p) => [0, 1, 2, 12].filter((k) => p.q[k] != null)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.sp {
  --black: #121212;
  --orange: #ff6b16;
  --card: #f7f6f3;
  --line: #e6e5e1;
  --mute: #6f6f6c;
  background: #fff;
  padding: clamp(56px, 7vw, 112px) clamp(16px, 3vw, 40px);
  font-family: 'Urbanist', Arial, Helvetica, sans-serif;
  color: var(--black);
}
.sp, .sp *, .sp *::before, .sp *::after { box-sizing: border-box; }
.in { max-width: 1240px; margin: 0 auto; }


/* ---------- cards ---------- */
.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.card { display: flex; flex-direction: column; padding: clamp(22px, 2.2vw, 28px); border-radius: 16px; background: var(--card); }
.card.hot { background: var(--black); color: #fff; }

.c-name { margin: 0; font-size: 17px; font-weight: 500; letter-spacing: -0.01em; }
.c-price { margin: 22px 0 0; display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
.c-price b { font-size: clamp(36px, 3.4vw, 46px); font-weight: 500; line-height: 1; letter-spacing: -0.05em; }
.c-price span { font-size: 14px; color: var(--mute); }
.c-setup { margin: 12px 0 0; font-size: 14.5px; color: var(--mute); }
.card.hot .c-name, .card.hot .c-price b, .card.hot .c-price span, .card.hot .c-setup, .card.hot .c-inc, .card.hot .c-list li { color: #fff !important; }

.c-inc { margin: 26px 0 14px; font-size: 14px; color: var(--mute); }
.c-list { margin: 0 0 28px; padding: 0; list-style: none; display: grid; gap: 12px; }
.c-list li { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 500; }
.c-list svg { flex: none; width: 18px; height: 18px; }
.c-list circle { fill: var(--black); }
.c-list path { fill: none; stroke: #fff; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.card.hot .c-list circle { fill: #fff; }
.card.hot .c-list path { stroke: var(--black); }

.c-btn { margin-top: auto; display: flex; align-items: center; justify-content: center; min-height: 48px; border-radius: 10px; background: var(--black); color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; transition: background 0.2s ease, color 0.2s ease; }
.c-btn:hover { background: var(--orange); }
.card.hot .c-btn { background: #fff; color: var(--black) !important; }
.card.hot .c-btn:hover { background: var(--orange); color: #fff !important; }
.c-btn:focus-visible, .t-btn:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

/* ---------- table ---------- */
.tbl-wrap { margin-top: clamp(56px, 7vw, 96px); overflow-x: auto; -webkit-overflow-scrolling: touch; }
.tbl-wrap:focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }
.tbl { width: 100%; min-width: 1040px; border-collapse: separate; border-spacing: 0; table-layout: fixed; }
.tbl .blank { width: 17%; background: var(--black); border-top-left-radius: 14px; }

.tbl thead th { padding: 20px 12px; background: var(--black); color: #fff; font-size: 14.5px; font-weight: 500; text-align: center; line-height: 1.25; }
.tbl thead th:last-child { border-top-right-radius: 14px; }

.tbl tbody th, .tbl tbody td { height: 54px; padding: 0 16px; border-bottom: 1px solid var(--line); border-right: 1px solid var(--line); font-size: 14.5px; font-weight: 500; text-align: center; font-variant-numeric: tabular-nums; }
.tbl tbody th { border-left: 1px solid var(--line); text-align: left; padding-left: 18px; }
.tbl tbody tr.buy th, .tbl tbody tr.buy td { height: 78px; }
.tbl tbody tr.buy th { border-bottom-left-radius: 14px; }
.tbl tbody tr.buy td:last-child { border-bottom-right-radius: 14px; }

.t-btn { display: inline-flex; align-items: center; justify-content: center; min-width: 88px; min-height: 40px; padding: 0 20px; border-radius: 8px; background: var(--black); color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; transition: background 0.2s ease; }
.t-btn:hover { background: var(--orange); }

@media (max-width: 1000px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) {
  .cards { grid-template-columns: minmax(0, 1fr); }
  .tbl tbody th { position: sticky; left: 0; z-index: 1; min-width: 120px; background: #fff; }
}
@media (prefers-reduced-motion: reduce) { .c-btn, .t-btn { transition: none; } }
</style>