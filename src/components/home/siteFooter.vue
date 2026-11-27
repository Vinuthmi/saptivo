<script setup>
import { ref, onMounted } from 'vue'
defineOptions({ name: 'SiteFooter' })

const year = new Date().getFullYear()
const baseUrl = import.meta.env.BASE_URL
const logoSrc = `${baseUrl}saptivo-logo.png`

const clients = [
  {
    name: 'AutoSale.lk',
    src: `${baseUrl}images/clients/autosale-monochrome.png`,
    width: 1694,
    height: 255,
    displayWidth: 142,
  },
  {
    name: 'Cartinno',
    src: `${baseUrl}images/clients/cartinno.webp`,
    width: 800,
    height: 226,
    displayWidth: 100,
  },
  {
    name: 'SaaSBeds',
    src: `${baseUrl}images/clients/saasbeds.png`,
    width: 2048,
    height: 462,
    displayWidth: 94,
  },
  {
    name: 'Ipsova',
    src: `${baseUrl}images/clients/ipsova.png`,
    width: 1000,
    height: 284,
    displayWidth: 110,
  },
  {
    name: 'Saptify',
    src: `${baseUrl}images/clients/saptify.png`,
    width: 720,
    height: 180,
    displayWidth: 105,
  },
  {
    name: 'Sepova',
    src: `${baseUrl}images/clients/sepova.png`,
    width: 2048,
    height: 283,
    displayWidth: 102,
  },
  {
    name: 'Veyogo',
    src: `${baseUrl}images/clients/veyogo.png`,
    width: 1154,
    height: 224,
    displayWidth: 115,
  },
  {
    name: 'Voxinnova',
    src: `${baseUrl}images/clients/voxinnova.png`,
    width: 433,
    height: 102,
    displayWidth: 120,
  },
  {
    name: 'Smardove',
    src: `${baseUrl}images/clients/smardove.png`,
    width: 727,
    height: 275,
    displayWidth: 136,
  },
]

// The AutoSale file has a badge (A and tyre) followed by the AUTOSALE.LK letters. To enlarge only the letters we
// need to know where the badge ends, so the first empty vertical strip after the badge is found from the image itself.
// 0.23 is only the fallback if the image can't be read.
const asSplit = ref(0.23)
onMounted(() => {
  const logo = clients.find((c) => c.name === 'AutoSale.lk')
  const im = new Image()
  im.onload = () => {
    try {
      const w = Math.min(im.naturalWidth, 1000)
      const h = Math.max(1, Math.round((im.naturalHeight * w) / im.naturalWidth))
      const cv = document.createElement('canvas')
      cv.width = w
      cv.height = h
      const cx = cv.getContext('2d', { willReadFrequently: true })
      cx.drawImage(im, 0, 0, w, h)
      const d = cx.getImageData(0, 0, w, h).data
      const bgClear = d[3] < 40
      const isInk = (i) => (bgClear ? d[i + 3] > 40 : d[i + 3] > 40 && Math.abs(d[i] - d[0]) + Math.abs(d[i + 1] - d[1]) + Math.abs(d[i + 2] - d[2]) > 120)
      const col = new Array(w).fill(false)
      for (let x = 0; x < w; x++) for (let y = 0; y < h && !col[x]; y++) if (isInk((y * w + x) * 4)) col[x] = true
      let x = col.indexOf(true)
      if (x < 0) return
      while (x < w && col[x]) x++            // end of the badge
      let gapStart = x
      while (x < w && !col[x]) x++           // empty strip between the badge and the letters
      const gap = x - gapStart
      if (x < w && gap >= 2) {
        const mid = (gapStart + x / 1) / 2 / w
        if (mid > 0.06 && mid < 0.45) asSplit.value = Math.round(mid * 1000) / 1000
      }
    } catch (e) { /* keep the fallback */ }
  }
  im.src = logo.src
})

const featureGroups = [
  { title: 'Sales & CRM', links: [
    { label: 'Lead & Contact Management', href: '/features/lead-management/' },
    { label: 'Sales Pipeline & Deals', href: '/features/sales-pipeline/' },
    { label: 'Quotations & Invoicing', href: '/features/quotations-invoicing/' },
    { label: 'Customer Portal', href: '/features/customer-portal/' },
  ] },
  { title: 'Communication & Marketing', links: [
    { label: 'WhatsApp CRM', href: '/features/whatsapp-crm/' },
    { label: '3CX Call Integration', href: '/features/3cx-crm-integration/' },
    { label: 'Vodia Integration & AI Calls', href: '/features/vodia-integration/' },
    { label: 'Marketing Campaigns', href: '/features/marketing-campaigns/' },
  ] },
  { title: 'Operations & Service', links: [
    { label: 'Multi-Branch Management', href: '/features/multi-branch-management/' },
    { label: 'Inventory & Multi-Warehouse', href: '/features/inventory-management/' },
    { label: 'Service & AMC Management', href: '/features/service-maintenance-management/' },
    { label: 'Help Desk & Ticketing', href: '/features/help-desk/' },
  ] },
  { title: 'Automation & Intelligence', links: [
    { label: 'Workflow Automation', href: '/features/workflow-automation/' },
    { label: 'Reports & Analytics', href: '/features/reports-analytics/' },
    { label: 'AI CRM', href: '/features/ai-crm/' },
    { label: 'Mobile CRM', href: '/features/mobile-crm/' },
  ] },
]

const industryLinks = [
  { label: 'Retail & Supermarkets', href: '/industries/retail/' },
  { label: 'Wholesale & Distribution', href: '/industries/wholesale-distribution/' },
  { label: 'Contractors & Services', href: '/industries/contractors-services/' },
  { label: 'Field Service & Maintenance', href: '/industries/field-service/' },
  { label: 'Startups & SMEs', href: '/industries/startups/' },
]

const companyLinks = [
  { label: 'Integrations', href: '/integrations/' },
  { label: 'Security', href: '/security/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Blog', href: '/blog/' },
]

const conversionLinks = [
  { label: 'Pricing', href: '/pricing/' },
  { label: 'Free Trial', href: '/free-trial/' },
  { label: 'Book a Demo', href: '/demo/' },
  { label: 'Reseller Program', href: '/reseller/' },
  { label: 'Reseller Signup', href: '/reseller/signup/' },
]

</script>

<template>
  <footer class="site-footer">
    <div class="footer-card">
      <!-- Row 1: four equally spaced feature groups -->
      <section class="feature-section" aria-label="CRM features">
        <div class="feature-grid">
          <nav v-for="group in featureGroups" :key="group.title" class="feature-group" :aria-label="group.title">
            <h2 class="footer-heading">{{ group.title }}</h2>
            <div class="footer-link-list">
              <router-link v-for="link in group.links" :key="link.href" :to="link.href">{{ link.label }}</router-link>
            </div>
          </nav>
        </div>
      </section>

      <!-- Row 2: industries, company and conversion -->
      <section class="footer-middle" aria-label="Explore Saptivo">
        <nav class="footer-links" aria-label="Industries">
          <router-link class="footer-heading" to="/industries/">Industries</router-link>
          <div class="footer-link-list"><router-link v-for="link in industryLinks" :key="link.href" :to="link.href">{{ link.label }}</router-link></div>
        </nav>
        <nav class="footer-links" aria-label="Company and trust">
          <h2 class="footer-heading">Company &amp; Trust</h2>
          <div class="footer-link-list"><router-link v-for="link in companyLinks" :key="link.href" :to="link.href">{{ link.label }}</router-link></div>
        </nav>
        <nav class="footer-links" aria-label="Conversion">
          <h2 class="footer-heading">Conversion</h2>
          <div class="footer-link-list"><router-link v-for="link in conversionLinks" :key="link.href" :to="link.href">{{ link.label }}</router-link></div>
        </nav>
      </section>

      <!-- Row 3: brand and client logos -->
      <section class="trusted-brands" aria-label="Saptivo and trusted businesses">
        <div class="footer-brand-block">
          <router-link to="/" class="footer-brand" aria-label="Saptivo home"><img :src="logoSrc" alt="Saptivo" /></router-link>
          <p>One connected workspace for customers, sales, and every store you run.</p>
        </div>
        <ul class="trusted-logos">
          <li v-for="client in clients" :key="client.name" :class="{ 'logo-emphasis': client.name === 'AutoSale.lk' || client.name === 'Smardove', 'logo-autosale': client.name === 'AutoSale.lk', 'logo-smardove': client.name === 'Smardove', 'logo-saasbeds': client.name === 'SaaSBeds', 'logo-voxinnova': client.name === 'Voxinnova' }">
            <span v-if="client.name === 'AutoSale.lk'" class="autosale" :aria-label="client.name">
              <!-- two copies of the same file: the badge keeps its size, the AUTOSALE.LK letters are scaled up -->
              <span class="autosale-art" :style="{ '--as-split-n': asSplit }">
                <img class="as-badge" :src="client.src" :alt="client.name" :width="client.width" :height="client.height" loading="lazy" draggable="false" />
                <img class="as-text" :src="client.src" alt="" aria-hidden="true" :width="client.width" :height="client.height" loading="lazy" draggable="false" />
              </span>
            </span>
            <span v-else :aria-label="client.name"><img :src="client.src" :alt="client.name" :width="client.width" :height="client.height" :style="{ '--dw': `${client.displayWidth}px` }" loading="lazy" draggable="false" /></span>
          </li>
        </ul>
      </section>

      <!-- Row 4: bottom content -->
      <div class="footer-bottom">
        <span>© {{ year }} Saptivo. All rights reserved.</span>
        <a class="footer-back-to-top" href="#top">Back to top ↑</a>
        <nav class="footer-legal" aria-label="Legal links">
          <router-link to="/terms-and-services/">Terms &amp; Services</router-link>
          <router-link to="/privacy-policy/">Privacy Policy</router-link>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
</style>

<style scoped>
.site-footer {
  --footer-ink: #171717;
  --footer-muted: #65615e;
  --footer-rule: rgba(38, 32, 27, .13);
  --footer-columns: repeat(4, minmax(0, 1fr));
  --footer-gap: clamp(28px, 4.4vw, 88px);
  width: 100%;
  background: #F2E9E0;
  border-radius: 56px 56px 0 0;
  overflow: hidden;
  color: var(--footer-ink);
  font-family: 'Outfit', sans-serif;
  -webkit-font-smoothing: antialiased;
}
.site-footer *, .site-footer *::before, .site-footer *::after { box-sizing: border-box; }
.footer-card { width: 100%; max-width: 1920px; margin: 0 auto; padding: 52px clamp(28px, 4.5vw, 86px) 25px; }
.feature-grid, .footer-middle {
  display: grid;
  grid-template-columns: var(--footer-columns);
  column-gap: var(--footer-gap);
  align-items: start;
}
.feature-section { padding: 0 0 53px; }
.feature-group, .footer-links { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; }
/* Shared typography for all footer headings. */
.site-footer :is(.feature-group, .footer-links) .footer-heading {
  display: block;
  width: 100%;
  min-height: 25px;
  margin: 0 0 14px;
  padding: 0;
  font-family: 'Outfit', sans-serif !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  line-height: 1.5 !important;
  letter-spacing: -.015em !important;
  color: #171717 !important;
  text-decoration: none;
  text-transform: none;
}
.footer-link-list { display: flex; flex-direction: column; align-items: stretch; gap: 0; width: 100%; }
.site-footer .footer-link-list a {
  display: block;
  width: 100%;
  max-width: 100%;
  padding: 11px 0;
  color: #292624;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.55;
  text-decoration: none;
  overflow-wrap: break-word;
  transition: color .2s ease, padding-left .2s ease;
}
/* A hairline divider between each link (none above the first). */
.site-footer .footer-link-list a + a { border-top: 1px solid var(--footer-rule); }
.site-footer .footer-link-list a:hover { color: #e55a13; padding-left: 4px; }
.footer-middle {
  padding: 47px 0 57px;
  border-top: 1px solid var(--footer-rule);
}
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.trusted-brands { display: grid; grid-template-columns: minmax(200px, 0.9fr) minmax(0, 4.4fr); gap: clamp(28px, 4vw, 72px); align-items: center; padding: 35px 0 39px; border-top: 1px solid var(--footer-rule); }
.footer-brand-block { min-width: 0; }
.footer-brand { display: inline-flex; align-items: center; }
.footer-brand img { display: block; width: 160px; max-width: 100%; height: auto; filter: brightness(0); }
.footer-brand-block p { max-width: 280px; margin: 15px 0 0; color: var(--footer-muted); font-size: 13px; line-height: 1.75; }
/* Equal-width logo slots and a real gap prevent logos from crowding neighbours. */
.trusted-logos { display: grid; grid-template-columns: repeat(10, minmax(0, 1fr)); align-items: center; column-gap: clamp(24px, 2.6vw, 48px); row-gap: 30px; min-width: 0; margin: 0; padding: 0; list-style: none; }
.trusted-logos li { display: flex; min-width: 0; min-height: 60px; align-items: center; justify-content: center; }
.trusted-logos li span { display: flex; width: 100%; min-width: 0; align-items: center; justify-content: center; }
.trusted-logos img { display: block; width: min(var(--dw), 100%); max-width: 100%; max-height: 34px; height: auto; object-fit: contain; object-position: center; filter: brightness(0); opacity: .5; transition: opacity .2s ease; }
/* Preserve the individually balanced sizes without transforms that overlap the gaps. */
.trusted-logos li.logo-emphasis img { max-height: 40px; }
/* AutoSale gets a double-width slot so it can be larger than the others. */
.trusted-logos li.logo-autosale { grid-column: span 2; }
.trusted-logos li.logo-autosale, .trusted-logos li.logo-autosale .autosale { justify-content: flex-end; }
.trusted-logos li.logo-autosale .autosale-art {
  /* --as-split-n: where the A-and-tyre badge ends (0.23 = 23% of the image width); --as-scale: size of the letters. */
  --as-split-n: 0.23;
  --as-split: calc(var(--as-split-n) * 100%);
  --as-scale: 1.5;
  --as-w: clamp(84px, 7vw, 100px);
  position: relative; flex: none; width: var(--as-w); aspect-ratio: 1694 / 255;
  /* the enlarged letters grow to the right, so reserve that room and keep the same gap to the next logo */
  margin-right: calc(var(--as-w) * (1 - var(--as-split-n)) * (var(--as-scale) - 1));
}
.trusted-logos li.logo-autosale .autosale-art img { position: absolute; inset: 0; width: 100%; height: 100%; max-width: none; max-height: none; }
.trusted-logos li.logo-autosale .as-badge { clip-path: inset(0 calc(100% - var(--as-split)) 0 0); }
.trusted-logos li.logo-autosale .as-text { clip-path: inset(0 0 0 var(--as-split)); transform: scale(var(--as-scale)); transform-origin: var(--as-split) 50%; }
.trusted-logos li.logo-smardove img { width: min(136px, calc(100% + 16px)); max-width: none; max-height: 50px; flex: 0 0 auto; margin-inline: auto; transform: translateY(-6px); }
.trusted-logos li.logo-saasbeds img { width: min(var(--dw), 96%); max-height: 32px; }
.trusted-logos li.logo-voxinnova img { width: min(104px, 100%); max-height: 32px; }
.trusted-logos li:hover img { opacity: .85; }
.footer-bottom { display: flex; justify-content: flex-start; align-items: center; gap: 20px; padding-top: 22px; border-top: 1px solid var(--footer-rule); color: #625d59; font-size: 12px; }
.footer-bottom a { color: #282522; text-decoration: none; }
.footer-legal { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 12px 28px; margin-left: auto; }
.footer-back-to-top { margin-left: auto; }
.footer-bottom a:hover { text-decoration: underline; }
@media (max-width: 1250px) {
  .site-footer { --footer-gap: 32px; }
  .trusted-brands { grid-template-columns: minmax(190px, 1fr) minmax(0, 3fr); gap: 35px; }
  .trusted-logos { grid-template-columns: repeat(5, minmax(0,1fr)); gap: 26px 32px; }
}
@media (max-width: 900px) {
  .site-footer { --footer-columns: repeat(2, minmax(0,1fr)); }
  .footer-card { padding-top: 38px; }
  .feature-grid, .footer-middle { row-gap: 38px; }
  .trusted-brands { grid-template-columns: 1fr; gap: 25px; }
  .trusted-logos { grid-template-columns: repeat(5, minmax(0,1fr)); }
}
@media (max-width: 540px) {
  .site-footer { --footer-gap: 20px; }
  .footer-card { padding: 30px 20px 22px; }
  .feature-section { padding-bottom: 35px; }
  .footer-middle { padding: 35px 0 39px; }
  .feature-grid, .footer-middle { row-gap: 31px; }
  .site-footer :is(.feature-group, .footer-links) .footer-heading { margin-bottom: 10px; font-size: 15px !important; }
  .site-footer .footer-link-list a { padding: 9px 0; font-size: 13px; }
  .trusted-logos { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 24px 28px; }
  .footer-bottom { flex-direction: column; align-items: flex-start; font-size: 11px; }
  .footer-legal { justify-content: flex-start; margin-left: 0; }
  .footer-back-to-top { margin-left: 0; }
  .site-footer { border-radius: 34px 34px 0 0; }
}
@media (max-width: 365px) { .site-footer { --footer-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .site-footer .footer-link-list a, .trusted-logos img { transition: none; } }
</style>