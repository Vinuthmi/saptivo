<script setup>
defineOptions({ name: 'SiteFooter' })

const year = new Date().getFullYear()
const baseUrl = import.meta.env.BASE_URL
const logoSrc = `${baseUrl}saptivo-logo.png`

const clients = [
  {
    name: 'AutoSale.lk',
    src: `${baseUrl}images/clients/autosale.png`,
    width: 1694,
    height: 255,
    displayWidth: 140,
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
          <li v-for="client in clients" :key="client.name" :class="{ 'logo-emphasis': client.name === 'AutoSale.lk' || client.name === 'Smardove', 'logo-smardove': client.name === 'Smardove', 'logo-voxinnova': client.name === 'Voxinnova' }">
            <span :aria-label="client.name"><img :src="client.src" :alt="client.name" :width="client.width" :height="client.height" :style="{ '--dw': `${client.displayWidth}px` }" loading="lazy" draggable="false" /></span>
          </li>
        </ul>
      </section>

      <!-- Row 4: bottom content -->
      <div class="footer-bottom">
        <span>© {{ year }} Saptivo. All rights reserved.</span>
        <a href="#top">Back to top ↑</a>
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
  color: var(--footer-ink);
  font-family: 'Outfit', sans-serif;
  -webkit-font-smoothing: antialiased;
}
.site-footer *, .site-footer *::before, .site-footer *::after { box-sizing: border-box; }
.footer-card { width: 100%; max-width: 1920px; margin: 0 auto; padding: 64px clamp(28px, 4.5vw, 86px) 25px; }
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
  margin: 0 0 26px;
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
.footer-link-list { display: flex; flex-direction: column; align-items: flex-start; gap: 17px; width: 100%; }
.site-footer .footer-link-list a {
  display: block;
  width: fit-content;
  max-width: 100%;
  color: #292624;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.55;
  text-decoration: none;
  overflow-wrap: break-word;
  transition: color .2s ease, transform .2s ease;
}
.site-footer .footer-link-list a:hover { color: #e55a13; transform: translateX(3px); }
.footer-middle {
  padding: 47px 0 57px;
  border-top: 1px solid var(--footer-rule);
}
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.trusted-brands { display: grid; grid-template-columns: minmax(210px, 1fr) minmax(0, 4fr); gap: clamp(32px, 4.5vw, 84px); align-items: center; padding: 35px 0 39px; border-top: 1px solid var(--footer-rule); }
.footer-brand-block { min-width: 0; }
.footer-brand { display: inline-flex; align-items: center; }
.footer-brand img { display: block; width: 160px; max-width: 100%; height: auto; filter: brightness(0); }
.footer-brand-block p { max-width: 280px; margin: 15px 0 0; color: var(--footer-muted); font-size: 13px; line-height: 1.75; }
/* Equal-width logo slots and a real gap prevent logos from crowding neighbours. */
.trusted-logos { display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); align-items: center; column-gap: clamp(18px, 1.65vw, 32px); row-gap: 22px; min-width: 0; margin: 0; padding: 0; list-style: none; }
.trusted-logos li { display: flex; min-width: 0; min-height: 60px; align-items: center; justify-content: center; }
.trusted-logos li span { display: flex; width: 100%; min-width: 0; align-items: center; justify-content: center; }
.trusted-logos img { display: block; width: min(var(--dw), 100%); max-width: 100%; max-height: 34px; height: auto; object-fit: contain; object-position: center; filter: brightness(0); transition: opacity .2s ease; }
/* Preserve the individually balanced sizes without transforms that overlap the gaps. */
.trusted-logos li.logo-emphasis img { max-height: 40px; }
.trusted-logos li.logo-smardove img { width: min(136px, 100%); max-height: 44px; transform: translateY(-4px); }
.trusted-logos li.logo-voxinnova img { width: min(104px, 100%); max-height: 32px; }
.trusted-logos li:hover img { opacity: .8; }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding-top: 22px; border-top: 1px solid var(--footer-rule); color: #625d59; font-size: 12px; }
.footer-bottom a { color: #282522; text-decoration: none; }
.footer-bottom a:hover { text-decoration: underline; }
@media (max-width: 1250px) {
  .site-footer { --footer-gap: 32px; }
  .trusted-brands { grid-template-columns: minmax(190px, 1fr) minmax(0, 3fr); gap: 35px; }
  .trusted-logos { grid-template-columns: repeat(5, minmax(0,1fr)); gap: 18px 24px; }
}
@media (max-width: 900px) {
  .site-footer { --footer-columns: repeat(2, minmax(0,1fr)); }
  .footer-card { padding-top: 45px; }
  .feature-grid, .footer-middle { row-gap: 38px; }
  .trusted-brands { grid-template-columns: 1fr; gap: 25px; }
  .trusted-logos { grid-template-columns: repeat(5, minmax(0,1fr)); }
}
@media (max-width: 540px) {
  .site-footer { --footer-gap: 20px; }
  .footer-card { padding: 35px 20px 22px; }
  .feature-section { padding-bottom: 35px; }
  .footer-middle { padding: 35px 0 39px; }
  .feature-grid, .footer-middle { row-gap: 31px; }
  .site-footer :is(.feature-group, .footer-links) .footer-heading { margin-bottom: 17px; font-size: 15px !important; }
  .footer-link-list { gap: 13px; }
  .site-footer .footer-link-list a { font-size: 13px; }
  .trusted-logos { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 18px 24px; }
  .footer-bottom { flex-direction: column; align-items: flex-start; font-size: 11px; }
}
@media (max-width: 365px) { .site-footer { --footer-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .footer-link-list a, .trusted-logos img { transition: none; } }
</style>
