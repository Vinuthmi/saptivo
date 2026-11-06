
<script setup>
import { ref } from 'vue'

defineOptions({ name: 'SiteFooter' })

const year = new Date().getFullYear()
const baseUrl = import.meta.env.BASE_URL
const logoSrc = `${baseUrl}saptivo-logo.png`

const clients = [
  {
    name: 'Tree of Life Nature Resort',
    src: `${baseUrl}images/clients/tree-of-life1.png`,
    width: 136,
    height: 91,
    displayWidth: 95,
    href: 'https://hoteltreeoflife.com/',
  },
  {
    name: 'Nilkamal',
    src: `${baseUrl}images/clients/nilkamal1.png`,
    width: 130,
    height: 90,
    displayWidth: 80,
    href: 'https://nilkamal.lk/',
  },
  {
    name: 'Nastars',
    src: `${baseUrl}images/clients/nastars1.png`,
    width: 1878,
    height: 203,
    displayWidth: 130,
    href: 'https://nastars.com/',
  },
  {
    name: 'Be Waxed Sri Lanka',
    src: `${baseUrl}images/clients/bewaxed1.png`,
    width: 220,
    height: 219,
    displayWidth: 68,
    href: 'https://bewaxed.lk/',
  },
  {
    name: 'Paint House by Nadeeka',
    src: `${baseUrl}images/clients/paint-house1.png`,
    width: 2045,
    height: 727,
    displayWidth: 115,
    href: 'https://painthouse.lk/',
  },
  {
    name: 'Tera Computers',
    src: `${baseUrl}images/clients/tera1.png`,
    width: 447,
    height: 447,
    displayWidth: 60,
    href: 'https://tera-computers.business.site/',
  },
  {
    name: 'Lanka Grills',
    src: `${baseUrl}images/clients/lanka-grills1.png`,
    width: 1317,
    height: 783,
    displayWidth: 75,
    href: 'https://lankagrills.com/',
  },
]

const orbitIcons = [
  { name: 'Instagram', src: `${baseUrl}orbit/instagram.svg`, size: 40 },
  { name: 'Facebook', src: `${baseUrl}orbit/facebook.svg`, size: 40 },
  { name: 'WordPress', src: `${baseUrl}orbit/wordpress.svg`, size: 40 },
  { name: '3CX', src: `${baseUrl}orbit/3cx.svg`, size: 56 },
  { name: 'Google Calendar', src: `${baseUrl}orbit/google-calendar.svg`, size: 38 },
]

const trust = [
  {
    title: '99.99% Uptime SLA',
    sub: 'Enterprise cloud reliability',
    svg: '<path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.4 7.5 9.5 4.4-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m8.8 12 2.4 2.4 4.2-4.6"/>',
  },
  {
    title: 'Bank-Grade Security',
    sub: '256-bit encryption & RBAC',
    svg: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  },
  {
    title: 'Live Multi-Store Sync',
    sub: 'Sub-60s ledger updates',
    svg: '<path d="M20 11a8 8 0 0 0-14-4.5L4 9"/><path d="M4 4v5h5"/><path d="M4 13a8 8 0 0 0 14 4.5L20 15"/><path d="M20 20v-5h-5"/>',
  },
  {
    title: 'Dedicated Support',
    sub: '24/7 technical onboarding',
    svg: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6" rx="2"/><rect x="16.5" y="14" width="4" height="6" rx="2"/><path d="M20 19.5c0 1.4-1.6 2-4 2h-2"/>',
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

const orbitRadius = ref(340)
</script>

<template>
  <footer id="contact" class="site-footer">
    <!-- CTA -->
    <section class="cta">
      <h2 class="cta-title">
        Ready to run
        <span class="grad">every store as one?</span>
      </h2>

      <p class="cta-sub">
        One connected workspace for customers, sales, and every store you run.
        Work smarter, move faster and make every opportunity count.
      </p>

      <div class="cta-actions">
        <router-link to="/free-trial/" class="btn btn-primary">
          Start your free trial
        </router-link>

        <router-link to="/demo/" class="btn btn-light">
          Book a Demo
        </router-link>
      </div>

      <!-- Rotating integration orbit -->
      <div class="orbit-wrap" aria-hidden="true">
        <div class="orbit">
          <div
            v-for="(icon, i) in orbitIcons"
            :key="icon.name"
            class="orbit-item"
            :style="{ '--a': `${(360 / orbitIcons.length) * i}deg` }"
          >
            <span class="orbit-badge">
              <img
                :src="icon.src"
                :alt="icon.name"
                :style="{ width: `${icon.size}px`, height: `${icon.size}px` }"
                draggable="false"
              />
            </span>
          </div>
        </div>

        <div class="orbit-inner">
          <i class="orbit-dot"></i>
        </div>
      </div>
    </section>

    <!-- Footer navigation -->
    <div class="footer-card">
      <div class="footer-dots" aria-hidden="true"></div>

      <!-- Trust bar -->
      <ul class="trust">
        <li v-for="item in trust" :key="item.title" class="trust-item">
          <span class="trust-icon">
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="item.svg"
            ></svg>
          </span>

          <span class="trust-text">
            <b>{{ item.title }}</b>
            <small>{{ item.sub }}</small>
          </span>
        </li>
      </ul>

      <div class="footer-main">
        <!-- Brand -->
        <div class="footer-brand-block">
          <router-link to="/" class="footer-brand" aria-label="Saptivo home">
            <img :src="logoSrc" alt="Saptivo" />
          </router-link>

          <p>
            One connected workspace for customers, sales, and every store you run.
          </p>

          <span class="status">
            <i></i>
            All systems operational
          </span>
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
            <a
              :href="client.href"
              :aria-label="`Visit ${client.name} website`"
              target="_blank"
              rel="noopener noreferrer"
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
            </a>
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

<style scoped>
.site-footer {
  --orange: #ff6818;
  --ink: #17191d;
  --muted: #9a9ba3;
  --radius: 340px;

  position: relative;
  width: 100%;
  padding: 0;
  overflow: hidden;
  background: #fff;
  color: #17191d;
  font-family: 'Urbanist', 'Poppins', Arial, sans-serif;
}

.site-footer::before {
  position: absolute;
  top: 40px;
  left: 50%;
  width: 1000px;
  height: 560px;
  transform: translateX(-50%);
  background: radial-gradient(
    closest-side,
    rgba(240, 100, 43, 0.14),
    rgba(240, 100, 43, 0.05) 60%,
    transparent
  );
  content: '';
  pointer-events: none;
}

/* Trusted businesses */

.trusted-brands {
  position: relative;
  z-index: 1;
  width: 100%;
  margin: 0 auto;
  padding: 0 0 28px;
}

.trusted-logos {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  scrollbar-width: none;
  list-style: none;
}

.trusted-logos::-webkit-scrollbar {
  display: none;
}

.trusted-logos li {
  display: grid;
  flex: 1 0 0;
  min-width: 120px;
  height: 76px;
  place-items: center;
}

.trusted-logos a {
  display: grid;
  width: 100%;
  height: 100%;
  padding: 10px 14px;
  place-items: center;
}

.trusted-logos img {
  display: block;
  width: var(--dw);
  max-width: 100%;
  height: auto;
  object-fit: contain;
  user-select: none;
  transition: transform 0.3s ease;
}

.trusted-logos a:hover img {
  transform: scale(1.04);
}

.trusted-logos a:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 5px;
  border-radius: 5px;
}

/* CTA */

.cta {
  position: relative;
  box-sizing: border-box;
  max-width: 1476px;
  margin: 0 auto;
  padding: clamp(65px, 8vw, 110px) 24px 0;
  text-align: center;
}

.cta-title {
  margin: 0;
  color: #0f172a;
  font-size: clamp(32px, 4.2vw, 62px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.05em;
}

.grad {
  display: block;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.cta-sub {
  max-width: 560px;
  margin: 22px auto 32px;
  color: #475569;
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.02em;
}

.cta-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  color: #fff;
  background: linear-gradient(180deg, #ff7a45, #f2531f);
  box-shadow: 0 10px 24px rgba(240, 75, 35, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 16px 32px rgba(240, 75, 35, 0.4);
}

.btn-light {
  color: #fff;
  background: #0b0c0e;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.btn-light:hover {
  background: #292b30;
}

/* Orbit animation */

.orbit-wrap {
  position: relative;
  height: 300px;
  margin-top: 46px;
  overflow: hidden;
}

.orbit,
.orbit-inner {
  position: absolute;
  left: 50%;
  border-radius: 50%;
}

.orbit {
  top: 50px;
  width: calc(var(--radius) * 2);
  height: calc(var(--radius) * 2);
  margin-left: calc(var(--radius) * -1);
  border: 1px solid rgba(23, 25, 29, 0.14);
  animation: spin 60s linear infinite;
}

.orbit-item {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 76px;
  height: 76px;
  margin: -38px 0 0 -38px;
  transform: rotate(var(--a)) translateY(calc(var(--radius) * -1));
}

.orbit-badge {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  border: 1px solid rgba(23, 25, 29, 0.08);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(23, 25, 29, 0.14);
  transform: rotate(calc(var(--a) * -1));
  animation: upright 60s linear infinite;
}

.orbit-badge img {
  display: block;
  object-fit: contain;
  user-select: none;
}

.orbit-inner {
  --r2: calc(var(--radius) - 95px);
  top: 145px;
  width: calc(var(--r2) * 2);
  height: calc(var(--r2) * 2);
  margin-left: calc(var(--r2) * -1);
  border: 1px dashed rgba(23, 25, 29, 0.24);
  animation: spin-rev 90s linear infinite;
}

.orbit-dot {
  position: absolute;
  top: -7px;
  left: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border: 2px solid #f0642b;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 12px rgba(240, 100, 43, 0.7);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-rev {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes upright {
  to {
    transform: rotate(calc(var(--a) * -1 - 360deg));
  }
}

/* Footer card */

.footer-card {
  position: relative;
  z-index: 2;
  width: 100%;
  box-sizing: border-box;
  margin: -70px 0 0;
  padding: 44px max(clamp(20px, 4vw, 56px), calc((100% - 1440px) / 2 + 56px)) 26px;
  overflow: hidden;
  border-radius: 50px 50px 0 0;
  background: #17191d;
  color: #fff;
  box-shadow: 0 30px 60px rgba(23, 25, 29, 0.25);
}

.footer-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    rgba(148, 153, 163, 0.42) 1px,
    transparent 1.4px
  );
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(
    ellipse 85% 100% at 50% 0%,
    #000 0%,
    rgba(0, 0, 0, 0.5) 55%,
    transparent 95%
  );
  mask-image: radial-gradient(
    ellipse 85% 100% at 50% 0%,
    #000 0%,
    rgba(0, 0, 0, 0.5) 55%,
    transparent 95%
  );
  pointer-events: none;
}

.footer-card::after {
  position: absolute;
  top: 0;
  left: 8%;
  right: 8%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #f0642b, transparent);
  content: '';
}

/* Trust bar */

.trust {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin: 0 0 24px;
  padding: 0 0 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  list-style: none;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.trust-icon {
  display: grid;
  flex: none;
  width: 52px;
  height: 52px;
  place-items: center;
  border: 1px solid rgba(240, 100, 43, 0.3);
  border-radius: 15px;
  background: rgba(240, 100, 43, 0.12);
  color: #ff6a2c;
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
}

.trust-item:hover .trust-icon {
  transform: translateY(-3px);
  background: #f0642b;
  color: #fff;
}

.trust-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.trust-text b {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

.trust-text small {
  color: #9a9ba3;
  font-size: 13px;
  line-height: 1.4;
}

/* Main footer sitemap */

.footer-main {
  position: relative;
  display: grid;
  grid-template-columns: minmax(180px, 1.15fr) minmax(0, 1.5fr) minmax(0, 0.85fr) minmax(0, 0.9fr) minmax(0, 0.8fr);
  gap: clamp(22px, 3vw, 42px);
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

.status {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 7px 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.06);
  color: #c9cad0;
  font-size: 12px;
  font-weight: 500;
}

.status i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2ecc71;
  box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  70% {
    box-shadow: 0 0 0 8px rgba(46, 204, 113, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
  }
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
  .footer-main {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .footer-brand-block {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .trusted-logos {
    justify-content: flex-start;
  }

  .trusted-logos li {
    flex: 0 0 160px;
    height: 76px;
  }

  .trusted-logos img {
    width: calc(var(--dw) * 0.85);
  }

  .trust {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-brand-block {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .site-footer {
    --radius: 200px;
  }

  .trusted-logos li {
    flex-basis: 140px;
  }

  .trusted-logos img {
    width: calc(var(--dw) * 0.78);
  }

  .cta {
    padding-top: 55px;
  }

  .orbit-wrap {
    height: 230px;
  }

  .orbit-item {
    width: 56px;
    height: 56px;
    margin: -28px 0 0 -28px;
  }

  .orbit-badge {
    border-radius: 15px;
  }

  .orbit-badge img {
    transform: scale(0.7);
  }

  .footer-card {
    margin-top: -50px;
    padding: 32px 20px 22px;
    border-radius: 22px 22px 0 0;
  }

  .trust {
    grid-template-columns: 1fr;
    gap: 18px;
    padding-bottom: 28px;
  }

  .footer-main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30px 20px;
    padding-bottom: 32px;
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

@media (prefers-reduced-motion: reduce) {
  .orbit,
  .orbit-inner,
  .orbit-badge,
  .status i {
    animation: none;
  }

  .trusted-logos img,
  .btn,
  .trust-icon {
    transition: none;
  }
}
</style>
