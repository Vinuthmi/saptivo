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
    displayWidth: 125,
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
    displayWidth: 115,
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
    displayWidth: 130,
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
    displayWidth: 115,
  },
]

const featureLinks = [
  { label: 'Lead & Contact Management', href: '/features/lead-management/' },
  { label: 'Sales Pipeline & Deals', href: '/features/sales-pipeline/' },
  { label: 'Quotations & Invoicing', href: '/features/quotations-invoicing/' },
  { label: 'WhatsApp CRM', href: '/features/whatsapp-crm/' },
  { label: '3CX Call Integration', href: '/features/3cx-crm-integration/' },
  { label: 'Workflow Automation', href: '/features/workflow-automation/' },
  { label: 'Multi-Branch Management', href: '/features/multi-branch-management/' },
  { label: 'Inventory & Multi-Warehouse', href: '/features/inventory-management/' },
  { label: 'Service & AMC Management', href: '/features/service-maintenance-management/' },
  { label: 'Help Desk & Ticketing', href: '/features/help-desk/' },
  { label: 'Marketing Campaigns', href: '/features/marketing-campaigns/' },
  { label: 'Reports & Analytics', href: '/features/reports-analytics/' },
  { label: 'AI CRM', href: '/features/ai-crm/' },
  { label: 'Customer Portal', href: '/features/customer-portal/' },
  { label: 'Mobile CRM', href: '/features/mobile-crm/' },
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
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms of Service', href: '/terms-of-service/' },
]

const conversionLinks = [
  { label: 'Pricing', href: '/pricing/' },
  { label: 'Free Trial', href: '/free-trial/' },
  { label: 'Book a Demo', href: '/demo/' },
  { label: 'Reseller Program', href: '/reseller/' },
  { label: 'Reseller Signup', href: '/reseller/signup/' },
]

const footerGroups = [
  { title: 'Features', href: '/features/', links: featureLinks },
  { title: 'Industries', href: '/industries/', links: industryLinks },
  { title: 'Company & Trust', links: companyLinks },
  { title: 'Conversion', links: conversionLinks },
]
</script>

<template>
  <footer class="site-footer">
    <div class="footer-card">
      <div class="footer-dots" aria-hidden="true"></div>

      <div class="footer-main">
        <!-- Brand -->
        <div class="footer-brand-block">
          <router-link to="/" class="footer-brand" aria-label="Saptivo home">
            <img :src="logoSrc" alt="Saptivo" />
          </router-link>

          <p>
            One connected workspace for customers, sales, and every store you run.
          </p>
        </div>

        <!-- Sitemap columns -->
        <nav
          v-for="group in footerGroups"
          :key="group.title"
          class="footer-links"
          :aria-label="group.title"
        >
          <router-link
            v-if="group.href"
            :to="group.href"
            class="footer-heading"
          >
            {{ group.title }}
          </router-link>

          <b v-else class="footer-heading">{{ group.title }}</b>

          <router-link
            v-for="link in group.links"
            :key="link.href"
            :to="link.href"
          >
            {{ link.label }}
          </router-link>
        </nav>
      </div>

      <!-- Trusted businesses -->
      <section class="trusted-brands" aria-label="Trusted businesses">
        <ul class="trusted-logos">
          <li v-for="client in clients" :key="client.name">
            <component
              :is="client.href ? 'a' : 'span'"
              :href="client.href"
              :aria-label="client.href ? `Visit ${client.name} website` : client.name"
              :target="client.href ? '_blank' : null"
              :rel="client.href ? 'noopener noreferrer' : null"
            >
              <img
                :src="client.src"
                :alt="client.name"
                :width="client.width"
                :height="client.height"
                :style="{ '--dw': `${client.displayWidth}px` }"
                loading="lazy"
                draggable="false"
              />
            </component>
          </li>
        </ul>
      </section>

      <div class="footer-bottom">
        <span>© {{ year }} Saptivo. All rights reserved.</span>

        <div class="footer-legal">
          <router-link to="/privacy-policy/">Privacy Policy</router-link>
          <router-link to="/terms-of-service/">Terms of Service</router-link>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
</style>

<style scoped>
.site-footer {
  --orange: #ff6818;

  position: relative;
  z-index: 2;
  width: 100%;
  /* white behind the rounded top corners of the dark card */
  background: #fff;
  color: #fff;
  font-family: 'Outfit', 'Urbanist', Arial, sans-serif;
}

/* Footer card */

.footer-card {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 44px max(clamp(20px, 5vw, 80px), calc((100% - 1560px) / 2 + 80px)) 26px;
  overflow: hidden;
  border-radius: 50px 50px 0 0;
  background: #17191d;
  color: #fff;
  box-shadow: 0 30px 60px rgba(23, 25, 29, 0.25);
}

.footer-dots {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background-image: radial-gradient(
    circle,
    rgba(148, 153, 163, 0.42) 1px,
    transparent 1.4px
  );
  background-size: 22px 22px;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.6) 55%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.6) 55%, transparent 100%);
  pointer-events: none;
}

/* Main footer sitemap */

.footer-main {
  position: relative;
  display: grid;
  /* brand column + four link columns sized to their content and spread evenly:
     equal gaps between columns, first column on the left edge, last column ending on the right edge */
  grid-template-columns: minmax(200px, 280px) repeat(4, max-content);
  justify-content: space-between;
  align-items: start;
  column-gap: clamp(22px, 3vw, 42px);
  row-gap: 30px;
  padding-bottom: 44px;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
}

.footer-brand img {
  display: block;
  width: 160px;
  max-width: 100%;
  height: auto;
  filter: brightness(0) invert(1);
}

.footer-brand-block p {
  max-width: 280px;
  margin: 15px 0 18px;
  color: #9a9ba3;
  font-size: 13px;
  line-height: 1.8;
}

.footer-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.footer-heading {
  display: inline-block;
  margin-bottom: 5px;
  line-height: 1.3;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}

.footer-links a:not(.footer-heading) {
  color: #a4a5ac;
  font-size: 13px;
  line-height: 1.4;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}

.footer-links a:hover {
  color: #ff7a3a;
  transform: translateX(3px);
}

.footer-heading:hover {
  color: #ff7a3a;
}

/* Trusted businesses */

.trusted-brands {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow-x: auto;
  margin: 0 auto;
  padding: 30px 0 34px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  scrollbar-width: none;
}

.trusted-brands::-webkit-scrollbar {
  display: none;
}

.trusted-logos {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px clamp(6px, 0.7vw, 10px);
  margin: 0;
  padding: 0;
  list-style: none;
}

.trusted-logos li {
  display: grid;
  flex: 1 1 0;
  min-width: 0;
  height: 72px;
  place-items: center;
}

.trusted-logos li > :is(a, span) {
  display: grid;
  width: 100%;
  height: 100%;
  padding: 8px 2px;
  place-items: center;
}

.trusted-logos img {
  display: block;
  width: min(var(--dw), calc((100vw - 132px) / 9));
  max-width: 100%;
  height: auto;
  object-fit: contain;
  user-select: none;
  filter: brightness(0) invert(0.7);
  transition: filter 0.3s ease, transform 0.3s ease;
}

.trusted-logos li > :is(a, span):hover img {
  filter: brightness(0);
  transform: scale(1.04);
}

.trusted-logos a:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 5px;
  border-radius: 5px;
}

/* Bottom bar */

.footer-bottom {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding-top: 19px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #7f8088;
  font-size: 12px;
}

.footer-legal {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
}

.footer-bottom a {
  color: #a4a5ac;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-bottom a:hover {
  color: #ff7a3a;
}

/* Responsive */

@media (max-width: 1100px) {
  .trusted-brands {
    width: calc(100% + 160px);
    margin-left: -80px;
    padding-right: 16px;
    padding-left: 16px;
    box-sizing: border-box;
  }

  .footer-main {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    justify-content: normal;
  }

  .footer-brand-block {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .trusted-logos li {
    height: 64px;
  }

  .footer-main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-content: normal;
  }

  .footer-brand-block {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .footer-card {
    padding: 32px 20px 22px;
    border-radius: 22px 22px 0 0;
  }

  .trusted-brands {
    width: calc(100% + 40px);
    margin-left: -20px;
    padding: 24px 0 26px;
    padding-right: 8px;
    padding-left: 8px;
  }

  .trusted-logos li {
    flex: 0 0 auto;
    height: 56px;
  }

  .trusted-logos {
    width: max-content;
    min-width: 100%;
  }

  .trusted-logos li > :is(a, span) {
    width: auto;
    padding: 6px 2px;
  }

  .trusted-logos img {
    width: calc(var(--dw) * 0.62);
  }

  .footer-main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30px 20px;
    padding-bottom: 32px;
  }

  .footer-links a {
    overflow-wrap: anywhere;
  }

  .footer-brand-block {
    grid-column: 1 / -1;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
    font-size: 11px;
  }

  .footer-legal {
    gap: 14px;
  }
}

@media (max-width: 400px) {
  .footer-main {
    grid-template-columns: minmax(0, 1fr);
  }

  .footer-bottom a,
  .footer-legal {
    gap: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .trusted-logos img {
    transition: none;
  }
}
</style>