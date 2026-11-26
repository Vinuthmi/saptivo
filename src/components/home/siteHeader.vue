<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'IpsovaNavbar' })
/**
 * Saptivo header — navigation follows the sitemap in "Saptivo Website Content & SEO Copy" (v1.0):
 *   Features (hub + 16 feature pages) · Industries (hub + 5 industry pages) · Integrations · Security · Pricing
 *   Reseller (program, signup) · About · Blog · Contact (separate links)
 *   CTAs: Book a Demo (/demo/) and Get Started (/free-trial/); Reseller Signup in top bar
 *   Layout: full-width white header with an ash top row (dummy phone numbers) and full-width white mega menus
 */
const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`
/* Regional contact numbers in international format */
const phones = [
  { label: 'Sri Lanka', flag: 'https://flagcdn.com/w40/lk.png', number: '+94 11 200 0569', href: 'tel:+94112000569' },
  { label: 'Australia', flag: 'https://flagcdn.com/w40/au.png', number: '+61 2 8880 0333', href: 'tel:+61288800333' },
  { label: 'Canada', flag: 'https://flagcdn.com/w40/ca.png', number: '+1 403 800 0111', href: 'tel:+14038000111' }
]
const menuOpen = ref(false)
const openMenu = ref(null) // 'features' | 'industries' | 'reseller' | null (desktop dropdowns)
const mobileSection = ref(null) // open accordion in the mobile menu
const activeGroup = ref(0) // active tab in the Features mega menu
const scrolled = ref(false)
const menuX = ref(0) // left edge of the trigger that opened a compact menu (Industries / Reseller)
/* ---------------- ICONS (24px outline set, drawn inline so no icon package is needed) ---------------- */
const c = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
const ICONS = {
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', c(9, 7, 4), 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  userPlus: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', c(9, 7, 4), 'M19 8v6', 'M22 11h-6'],
  pipeline: ['M3 3v18h18', 'm19 9-5 5-4-4-3 3'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  chat: ['M7.9 20A9 9 0 1 0 4 16.1L2 22z'],
  phone: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'],
  sparkles: ['M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z', 'M19 17v4', 'M17 19h4'],
  zap: ['M13 2 3 14h9l-1 8 10-12h-9z'],
  store: ['M3 9l1-5h16l1 5', 'M4 9v11h16V9', 'M9 20v-6h6v6', 'M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0'],
  box: ['M21 8l-9-5-9 5v8l9 5 9-5z', 'M3.3 7 12 12l8.7-5', 'M12 22V12'],
  wrench: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'],
  lifebuoy: [c(12, 12, 10), c(12, 12, 4), 'm4.93 4.93 4.24 4.24', 'm14.83 9.17 4.24-4.24', 'm14.83 14.83 4.24 4.24', 'm9.17 14.83-4.24 4.24'],
  megaphone: ['m3 11 18-5v12L3 14v-3z', 'M11.6 16.8a3 3 0 1 1-5.8-1.6'],
  chart: ['M12 20V10', 'M18 20V4', 'M6 20v-4'],
  globe: [c(12, 12, 10), 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'],
  mobile: ['M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', 'M12 18h.01'],
  cart: ['M3 3h2l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6', c(10, 20.5, 1), c(18, 20.5, 1)],
  truck: ['M1 3h15v13H1z', 'M16 8h4l3 3v5h-7z', c(5.5, 18.5, 2.5), c(18.5, 18.5, 2.5)],
  clipboard: ['M9 2h6v4H9z', 'M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2', 'm9 14 2 2 4-4'],
  rocket: ['M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z', 'M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6']
}
/* ---------------- FEATURES (all 16 pages, grouped like the /features/ hub) ---------------- */
const featureGroups = [
  {
    title: 'Sales & CRM',
    description: 'Manage customers and close deals.',
    items: [
      { title: 'Lead & Contact Management', href: '/features/lead-management/', icon: 'users' },
      { title: 'Sales Pipeline & Deals', href: '/features/sales-pipeline/', icon: 'pipeline' },
      { title: 'Quotations & Invoicing', href: '/features/quotations-invoicing/', icon: 'file' },
      { title: 'Customer Portal', href: '/features/customer-portal/', icon: 'globe' }
    ]
  },
  {
    title: 'Communication & Marketing',
    description: 'Connect and engage with customers.',
    items: [
      { title: 'WhatsApp CRM', href: '/features/whatsapp-crm/', icon: 'chat' },
      { title: '3CX Call Integration', href: '/features/3cx-crm-integration/', icon: 'phone' },
      { title: 'Vodia Integration & AI Calls', href: '/features/vodia-integration/', icon: 'sparkles' },
      { title: 'Marketing Campaigns', href: '/features/marketing-campaigns/', icon: 'megaphone' }
    ]
  },
  {
    title: 'Operations & Service',
    description: 'Streamline everyday business operations.',
    items: [
      { title: 'Multi-Branch Management', href: '/features/multi-branch-management/', icon: 'store' },
      { title: 'Inventory & Multi-Warehouse', href: '/features/inventory-management/', icon: 'box' },
      { title: 'Service & AMC Management', href: '/features/service-maintenance-management/', icon: 'wrench' },
      { title: 'Help Desk & Ticketing', href: '/features/help-desk/', icon: 'lifebuoy' }
    ]
  },
  {
    title: 'Automation & Intelligence',
    description: 'Work smarter with data and automation.',
    items: [
      { title: 'Workflow Automation', href: '/features/workflow-automation/', icon: 'zap' },
      { title: 'Reports & Analytics', href: '/features/reports-analytics/', icon: 'chart' },
      { title: 'AI CRM', href: '/features/ai-crm/', icon: 'sparkles' },
      { title: 'Mobile CRM', href: '/features/mobile-crm/', icon: 'mobile' }
    ]
  }
]
/* flat list for the mobile menu */
const features = featureGroups.flatMap((g) => g.items)
const featureColumns = featureGroups
/* ---------------- INDUSTRIES (names, URLs and copy from the /industries/ hub) ---------------- */
const industries = [
  {
    title: 'Retail & Supermarkets',
    description: 'Multi-counter checkouts, instant inventory audits, VIP loyalty tiers and WhatsApp receipts',
    blurb: 'Checkouts, stock and loyalty',
    href: '/industries/retail/',
    icon: 'cart'
  },
  {
    title: 'Wholesale & Distribution',
    description: 'Bulk tier pricing, dealer credit limits and repayment tracking',
    blurb: 'Tier pricing and dealer credit',
    href: '/industries/wholesale-distribution/',
    icon: 'truck'
  },
  {
    title: 'Contractors & Services',
    description: 'Job tracking from enquiry to final payment, milestone deposits and mobile receipts',
    blurb: 'Jobs, deposits and receipts',
    href: '/industries/contractors-services/',
    icon: 'clipboard'
  },
  {
    title: 'Field Service & Maintenance',
    description: 'Installed asset registers, annual maintenance contracts and technician apps',
    blurb: 'Assets, contracts and technicians',
    href: '/industries/field-service/',
    icon: 'wrench'
  },
  {
    title: 'Startups & SMEs',
    description: 'Zero-friction quotations and a clear client pipeline, with no setup fee',
    blurb: 'Quotes and pipeline, no setup fee',
    href: '/industries/startups/',
    icon: 'rocket'
  },
]
const industryColumns = [industries.slice(0, 3), industries.slice(3, 5)]
/* photos on the right-hand card of each mega menu (swap freely) */
const menuPhotos = {
  features: 'https://images.unsplash.com/photo-1742836531271-98fd8151d257?w=900&q=80&auto=format&fit=crop',
  industries: 'https://images.unsplash.com/photo-1753354868616-544973e405c9?w=900&q=80&auto=format&fit=crop',
  industriesSecond: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80&auto=format&fit=crop'
}
/* ---------------- SIMPLE DROPDOWNS ---------------- */
const simpleMenus = [
  {
    key: 'reseller',
    label: 'Reseller',
    items: [
      { title: 'Reseller Program', description: 'Partner with Saptivo and grow with us', href: '/reseller/', icon: 'users' },
      { title: 'Become a Reseller', description: 'Apply to join the program', href: '/reseller/signup/', icon: 'userPlus' }
    ]
  }
]
const plainLinks = [
  { label: 'Integrations', href: '/integrations/' },
  { label: 'Security', href: '/security/' },
  { label: 'Pricing', href: '/pricing/' }
]
/* shown after the Reseller dropdown — names and URLs as in the doc's sitemap */
const trailingLinks = [
  { label: 'About', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/contact/' }
]
/* ---------------- behaviour ---------------- */
let closeTimer = 0
function handleScroll() {
  scrolled.value = window.scrollY > 24
}
/* compact menus open right under the link that triggered them */
function anchor(event) {
  const el = event && event.currentTarget && event.currentTarget.closest ? event.currentTarget.closest('.nav-dd') : null
  if (el) menuX.value = Math.round(el.getBoundingClientRect().left)
}
function openOn(key, event) {
  if (event && event.pointerType && event.pointerType !== 'mouse') return
  clearTimeout(closeTimer)
  anchor(event)
  openMenu.value = key
}
function closeSoon(event) {
  if (event && event.pointerType && event.pointerType !== 'mouse') return
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    openMenu.value = null
  }, 140)
}
function toggleMenu(key, event) {
  clearTimeout(closeTimer)
  anchor(event)
  openMenu.value = openMenu.value === key ? null : key
}
/* Features / Industries are links to their hub pages; on touch screens the first tap opens the menu instead */
function onHubClick(key, event) {
  if (event.pointerType && event.pointerType !== 'mouse') {
    event.preventDefault()
    toggleMenu(key, event)
    return
  }
  closeAll()
}
function toggleMobile(key) {
  mobileSection.value = mobileSection.value === key ? null : key
}
function closeAll() {
  clearTimeout(closeTimer)
  activeGroup.value = 0
  openMenu.value = null
  menuOpen.value = false
  mobileSection.value = null
}
function handleDocumentClick(event) {
  if (!event.target.closest('.nav-dd')) openMenu.value = null
}
function handleKeydown(event) {
  if (event.key === 'Escape') closeAll()
}
onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  clearTimeout(closeTimer)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
<template>
  <header class="nav-shell" :class="{ scrolled, expanded: menuOpen }" :style="{ '--x': menuX + 'px' }">
    <!-- ASH TOP ROW: regional contact numbers and reseller signup -->
    <div class="topbar">
      <div class="topbar-in">
        <a v-for="ph in phones" :key="ph.href" :href="ph.href" class="tb-phone" :aria-label="ph.label + ': ' + ph.number">
          <img :src="ph.flag" class="tb-flag" alt="" width="22" height="15" draggable="false" />
          <span class="tb-number">{{ ph.number }}</span>
        </a>
        <router-link to="/reseller/signup/" class="topbar-reseller" @click="closeAll">Reseller Signup</router-link>
      </div>
    </div>
    <nav class="main-bar" aria-label="Main navigation">
     <div class="bar-in">
      <!-- BRAND (original full-colour logo) -->
      <router-link to="/" class="brand" aria-label="Saptivo CRM home" @click="closeAll">
        <span class="brand-logo" role="img" aria-label="Saptivo CRM" :style="{ '--logo': `url(${logoSrc})` }"></span>
      </router-link>
      <!-- =================================================== DESKTOP LINKS -->
      <div class="desktop-links">
        <!-- FEATURES (mega) -->
        <div class="nav-dd" @pointerenter="openOn('features', $event)" @pointerleave="closeSoon($event)">
          <router-link
            to="/features/"
            class="nav-link"
            :class="{ active: openMenu === 'features' }"
            :aria-expanded="openMenu === 'features'"
            aria-haspopup="true"
            @focus="openMenu = 'features'"
            @click="onHubClick('features', $event)"
          >
            Features
            <svg viewBox="0 0 16 16" class="chevron" fill="none" aria-hidden="true" :class="{ rotate: openMenu === 'features' }"><path d="m4 6 4 4 4-4" /></svg>
          </router-link>
          <Transition name="mega">
                          <div v-if="openMenu === 'features'" class="mega-menu mm mm-features">
                <div class="mm-grid mm-features-grid">
                  <div class="mm-tabs mm-hub-only">
                    <router-link to="/features/" class="mm-hub-link" @click="closeAll">All CRM Features</router-link>
                  </div>
                  <div class="mm-feature-columns">
                    <div v-for="(column, ci) in featureColumns" :key="ci" class="mm-feature-column">
                        <p class="mm-h mm-feature-group-heading">{{ column.title }}</p>
                        <router-link v-for="item in column.items" :key="item.href" :to="item.href" class="mm-it" @click="closeAll">
                        <svg class="ic" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path v-for="(d, i) in ICONS[item.icon]" :key="i" :d="d" /></svg>
                        <span class="mm-it-t"><strong>{{ item.title }}</strong></span>
                      </router-link>
                    </div>
                  </div>
                  <div class="mm-card mm-feature-card">
                    <img :src="menuPhotos.features" alt="Saptivo CRM features" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
                    <div class="mm-card-ov">
                      <strong>Can't find the feature you need?</strong>
                      <router-link to="/demo/" class="mm-go" aria-label="Book a Demo" @click="closeAll"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></router-link>
                    </div>
                  </div>
                </div>
              </div>
</Transition>
        </div>
        <!-- INDUSTRIES (mega) -->
        <div class="nav-dd dd-industries" @pointerenter="openOn('industries', $event)" @pointerleave="closeSoon($event)">
          <router-link
            to="/industries/"
            class="nav-link"
            :class="{ active: openMenu === 'industries' }"
            :aria-expanded="openMenu === 'industries'"
            aria-haspopup="true"
            @focus="openOn('industries', $event)"
            @click="onHubClick('industries', $event)"
          >
            Industries
            <svg viewBox="0 0 16 16" class="chevron" fill="none" aria-hidden="true" :class="{ rotate: openMenu === 'industries' }"><path d="m4 6 4 4 4-4" /></svg>
          </router-link>
          <Transition name="mega">
                          <div v-if="openMenu === 'industries'" class="mega-menu mm mm-industries">
                <div class="mm-grid mm-industries-grid">
                  <div class="mm-tabs mm-hub-only">
                    <router-link to="/industries/" class="mm-hub-link" @click="closeAll">All Industries</router-link>
                  </div>
                  <div class="mm-industry-columns">
                    <div v-for="(column, ci) in industryColumns" :key="ci" class="mm-industry-column">
                      <router-link v-for="industry in column" :key="industry.href" :to="industry.href" class="mm-it" @click="closeAll">
                        <svg class="ic" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path v-for="(d, i) in ICONS[industry.icon]" :key="i" :d="d" /></svg>
                        <span class="mm-it-t"><strong>{{ industry.title }}</strong><small>{{ industry.blurb }}</small></span>
                      </router-link>
                    </div>
                  </div>
                  <div class="mm-industry-cards">
                    <div class="mm-card">
                      <img :src="menuPhotos.industries" alt="Retail business owners" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
                      <div class="mm-card-ov mm-industry-feature-copy">
                        <strong>Built for<br />your industry</strong>
                        <span class="mm-industry-feature-subtitle">One powerful CRM, tailored to the way you work.</span>
                      </div>
                    </div>
                    <div class="mm-card">
                      <img :src="menuPhotos.industriesSecond" alt="Business team working together" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
                      <div class="mm-card-ov"><strong>Don't see your industry?</strong><router-link to="/contact/" class="mm-go" aria-label="Contact us" @click="closeAll"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></router-link></div>
                    </div>
                  </div>
                </div>
              </div>
</Transition>
        </div>
        <!-- PLAIN LINKS -->
        <router-link v-for="item in plainLinks" :key="item.href" :to="item.href" class="nav-link" @click="closeAll">
          {{ item.label }}
        </router-link>
        <!-- RESELLER (mega) -->
        <div
          v-for="menu in simpleMenus"
          :key="menu.key"
          class="nav-dd"
          :class="'dd-' + menu.key"
          @pointerenter="openOn(menu.key, $event)"
          @pointerleave="closeSoon($event)"
        >
          <button
            type="button"
            class="nav-link"
            :class="{ active: openMenu === menu.key }"
            :aria-expanded="openMenu === menu.key"
            aria-haspopup="true"
            @click.stop="toggleMenu(menu.key, $event)"
          >
            {{ menu.label }}
            <svg viewBox="0 0 16 16" class="chevron" fill="none" aria-hidden="true" :class="{ rotate: openMenu === menu.key }"><path d="m4 6 4 4 4-4" /></svg>
          </button>
          <Transition name="mega">
            <div v-if="openMenu === menu.key" class="mega-menu mm mm-mid mm-reseller">
              <div class="mm-grid mm-grid-3 mm-grid-sm">
                <div class="mm-tabs">
                  <span class="mm-tab on">{{ menu.label }}</span>
                </div>
                <div class="mm-body">
                  <p class="mm-h">Earn recurring income reselling Saptivo CRM</p>
                  <div class="mm-items">
                    <router-link v-for="item in menu.items" :key="item.href" :to="item.href" class="mm-it" @click="closeAll">
                      <svg class="ic" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path v-for="(d, i) in ICONS[item.icon]" :key="i" :d="d" /></svg>
                      <span class="mm-it-t">
                        <strong>{{ item.title }}</strong>
                        <small>{{ item.description }}</small>
                      </span>
                    </router-link>
                  </div>
                </div>
                <div class="mm-card">
                  <img :src="menuPhotos.features" alt="" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
                  <div class="mm-card-ov">
                    <strong>Ready to grow with Saptivo?</strong>
                    <router-link to="/reseller/signup/" class="mm-go" aria-label="Become a Reseller" @click="closeAll"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></router-link>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
        <!-- ABOUT · BLOG · CONTACT -->
        <router-link v-for="item in trailingLinks" :key="item.href" :to="item.href" class="nav-link" @click="closeAll">
          {{ item.label }}
        </router-link>
      </div>
      <!-- =================================================== DESKTOP ACTIONS -->
      <div class="desktop-actions">
        <router-link to="/demo/" class="demo-btn" @click="closeAll">Book a Demo</router-link>
        <router-link to="/free-trial/" class="start-btn" @click="closeAll">Get Started</router-link>
      </div>
      <!-- =================================================== MOBILE TOGGLE -->
      <button
        type="button"
        class="menu-toggle"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation"
        @click="menuOpen = !menuOpen"
      >
        <span :class="{ first: menuOpen }"></span>
        <span :class="{ second: menuOpen }"></span>
        <span :class="{ third: menuOpen }"></span>
      </button>
     </div>
      <!-- =================================================== MOBILE MENU -->
      <Transition name="dropdown">
        <div v-if="menuOpen" class="mobile-menu">
          <!-- Features -->
          <div class="mobile-group">
            <button type="button" class="mobile-trigger" :aria-expanded="mobileSection === 'features'" @click="toggleMobile('features')">
              <span>Features</span>
              <svg viewBox="0 0 16 16" fill="none" :class="{ rotate: mobileSection === 'features' }"><path d="m4 6 4 4 4-4" /></svg>
            </button>
            <Transition name="mobile-industry">
              <div v-if="mobileSection === 'features'" class="mobile-sub">
                <router-link to="/features/" class="mobile-all" @click="closeAll">All CRM features</router-link>
                <router-link v-for="item in features" :key="item.href" :to="item.href" @click="closeAll">
                  <span><strong>{{ item.title }}</strong></span>
                  <svg viewBox="0 0 20 20" fill="none"><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
                </router-link>
              </div>
            </Transition>
          </div>
          <!-- Industries -->
          <div class="mobile-group">
            <button type="button" class="mobile-trigger" :aria-expanded="mobileSection === 'industries'" @click="toggleMobile('industries')">
              <span>Industries</span>
              <svg viewBox="0 0 16 16" fill="none" :class="{ rotate: mobileSection === 'industries' }"><path d="m4 6 4 4 4-4" /></svg>
            </button>
            <Transition name="mobile-industry">
              <div v-if="mobileSection === 'industries'" class="mobile-sub">
                <router-link to="/industries/" class="mobile-all" @click="closeAll">All industries</router-link>
                <router-link v-for="industry in industries" :key="industry.href" :to="industry.href" @click="closeAll">
                  <span>
                    <strong>{{ industry.title }}</strong>
                    <small>{{ industry.description }}</small>
                  </span>
                  <svg viewBox="0 0 20 20" fill="none"><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
                </router-link>
              </div>
            </Transition>
          </div>
          <!-- Plain links -->
          <router-link v-for="item in plainLinks" :key="item.href" :to="item.href" class="mobile-link" @click="closeAll">
            <span>{{ item.label }}</span>
            <svg viewBox="0 0 20 20" fill="none"><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
          </router-link>
          <!-- Reseller -->
          <div v-for="menu in simpleMenus" :key="menu.key" class="mobile-group">
            <button type="button" class="mobile-trigger" :aria-expanded="mobileSection === menu.key" @click="toggleMobile(menu.key)">
              <span>{{ menu.label }}</span>
              <svg viewBox="0 0 16 16" fill="none" :class="{ rotate: mobileSection === menu.key }"><path d="m4 6 4 4 4-4" /></svg>
            </button>
            <Transition name="mobile-industry">
              <div v-if="mobileSection === menu.key" class="mobile-sub">
                <router-link v-for="item in menu.items" :key="item.href" :to="item.href" @click="closeAll">
                  <span>
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.description }}</small>
                  </span>
                  <svg viewBox="0 0 20 20" fill="none"><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
                </router-link>
              </div>
            </Transition>
          </div>
          <!-- About · Blog · Contact -->
          <router-link v-for="item in trailingLinks" :key="item.href" :to="item.href" class="mobile-link" @click="closeAll">
            <span>{{ item.label }}</span>
            <svg viewBox="0 0 20 20" fill="none"><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
          </router-link>
          <!-- Actions -->
          <div class="mobile-actions">
            <router-link to="/reseller/signup/" class="reseller-btn" @click="closeAll">Reseller Signup</router-link>
            <router-link to="/demo/" class="demo-btn" @click="closeAll">Book a Demo</router-link>
            <router-link to="/free-trial/" class="start-btn" @click="closeAll">Get Started</router-link>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Urbanist:wght@500;600&display=swap');
/* =========================================================
   ROOT
========================================================= */
* {
  box-sizing: border-box;
}
.nav-shell {
  --orange: #ff6818;
  --orange-dark: #ed570b;
  --ink: #0b0c0e;
  --navy: #0b0c0e;
  --accent: #ed570b; /* orange used for hovers and highlights */
  --ash: #e6e6e9;
  --muted: #5d6b82;
  --beige: #d4c4a8;
  --beige-soft: #f4efe4;
  --white: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99999;
  padding: 0;
  font-family: 'Outfit', system-ui, sans-serif;
}
/* =========================================================
   TOP ROW (ash) + MAIN BAR (white, full width)
========================================================= */
.topbar {
  background: var(--ash);
  max-height: 120px;
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.25s ease;
}
.topbar-in {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(18px, 3vw, 44px);
  min-height: 38px;
  padding: 0 16px;
}
.tb-phone {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--navy);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}
.tb-phone svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.tb-label {
  color: var(--muted);
}
.tb-phone:hover {
  color: var(--navy);
}
/* the ash row folds away once the page scrolls, the white bar stays */
.scrolled .topbar {
  max-height: 0;
  opacity: 0;
}
.main-bar {
  position: relative;
  background: #fff;
  border-bottom: 0; /* no line under the header */
  transition: box-shadow 0.3s ease;
}
.scrolled .main-bar {
  box-shadow: 0 10px 28px -14px rgba(15, 23, 42, 0.2);
}
.bar-in {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* logo, then the menus right after it; buttons are pushed to the far right */
  gap: clamp(20px, 2vw, 32px);
  width: 100%;
  max-width: none;
  min-height: 72px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 96px); /* breathing room left and right */
}
/* =========================================================
   BRAND
========================================================= */
.brand {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 8px 3px;
  text-decoration: none;
}
.brand-logo {
  display: block;
  width: 132px;
  height: 32px;
  background: var(--logo) left center / contain no-repeat; /* original Saptivo logo colours */
}
/* =========================================================
   DESKTOP LINKS
========================================================= */
.desktop-links {
  display: flex;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 0 1 auto;
}
.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 9px clamp(7px, 0.75vw, 16px); /* space between Features, Industries and the other links grows with the screen */
  border: 0;
  border-radius: 10px;
  color: var(--navy);
  background: transparent;
  text-decoration: none;
  white-space: nowrap;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}
.nav-link:hover,
.nav-link.active,
.nav-link.router-link-active {
  color: var(--accent);
  background: transparent;
}
.nav-link:focus-visible {
  outline: none;
  color: var(--accent);
}
.chevron {
  width: 13px;
  height: 13px;
  stroke: currentColor;
  stroke-width: 1.5;
  transition: transform 0.25s ease;
}
.chevron.rotate {
  transform: rotate(180deg);
}
/* =========================================================
   DROPDOWN WRAPPERS
========================================================= */
.nav-dd {
  position: static; /* mega menus are positioned against the white bar, full width */
  display: flex;
  align-items: center;
  align-self: stretch;
}
/* =========================================================
   MEGA MENU  (groups | links with icons)
========================================================= */
.mega-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: clamp(24px, 9vw, 180px);
  right: clamp(24px, 9vw, 180px);
  padding: 24px;
  border: 1px solid #e4e4e9;
  border-radius: 18px;
  background: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
  box-shadow: 0 30px 60px -24px rgba(15, 23, 42, 0.28), 0 2px 6px rgba(15, 23, 42, 0.04);
}
.mm-grid {
  display: grid;
  gap: 24px;
  min-height: 0;
  max-width: none;
  margin: 0;
}
.mm-grid-3 {
  grid-template-columns: 240px minmax(0, 1fr) 300px;
}
.mm-grid-sm {
  grid-template-columns: 240px minmax(0, 1fr) 300px;
  min-height: 0;
}
/* ---------- 1 · groups ---------- */
.mm-tabs {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 0 24px 0 0;
  border-right: 1px solid #ececef;
}
.mm-tab {
  position: relative;
  width: 100%;
  padding: 11px 14px;
  border: 0;
  border-radius: 10px;
  background: none;
  color: #7b879b;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}
.mm-tab:hover {
  color: var(--navy);
  background: #f6f6f8;
}
.mm-tab.on {
  color: var(--navy);
  background: #f1f1f4;
}
.mm-all {
  margin-top: auto;
  padding: 10px 14px 4px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}
.mm-all:hover {
  text-decoration: underline;
}
/* ---------- 2 · links ---------- */
.mm-body {
  padding: 0;
}
.mm-h {
  margin: 0 0 10px;
  padding: 0 14px;
  color: #98a2b3;
  font-size: 12.5px;
  font-weight: 500;
}
.mm-items {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px;
}
.mm-items-2 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 10px;
}
.mm-it {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  color: var(--navy);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}
.mm-it .ic {
  flex: none;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  stroke: #7b879b;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.2s ease, transform 0.2s ease;
}
.mm-it-t strong {
  display: block;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
}
.mm-it-t small {
  display: block;
  margin-top: 3px;
  color: #8a96a8;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;
}
.mm-it:hover {
  background: #f3f3f5;
}
.mm-it:hover .ic {
  stroke: var(--accent);
  transform: scale(1.1);
}
.mm-tab:focus-visible,
.mm-it:focus-visible,
.mm-go:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
/* ---------- 3 · photo card ---------- */
.mm-card { position: relative; min-height: 280px; overflow: hidden; border-radius: 16px; background: linear-gradient(160deg, #3a3a40, #0b0c0e); }
.mm-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.mm-card::after { position: absolute; inset: 0; content: ''; background: linear-gradient(to top, rgba(11, 12, 14, 0.88) 8%, rgba(11, 12, 14, 0.1) 62%); }
.mm-card-ov { position: absolute; z-index: 1; left: 16px; right: 14px; bottom: 16px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
.mm-card-ov strong { color: #fff; font-size: 17px; font-weight: 500; line-height: 1.25; }
.mm-go { display: grid; flex: none; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: #fff; color: var(--navy); transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease; }
.mm-go svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.mm-go:hover { background: var(--accent); color: #fff; transform: translateX(2px); }
/* =========================================================
   MENU ANIMATION
========================================================= */
.mega-enter-active,
.mega-leave-active,
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.22s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.mega-enter-from,
.mega-leave-to,
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
/* =========================================================
   DESKTOP ACTIONS
========================================================= */
.desktop-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;
}
.demo-btn,
.start-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 43px;
  padding: 0 19px;
  border-radius: 999px;
  text-decoration: none;
  white-space: nowrap;
  font-family: 'Urbanist', system-ui, sans-serif; /* same font as the hero buttons */
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  transition: transform 0.2s ease, background 0.2s ease;
}
/* Reseller Signup: outlined, so Book a Demo and Free Trial stay the main actions */
.reseller-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 43px;
  padding: 0 19px;
  border: 1.5px solid var(--ink);
  border-radius: 999px;
  background: #fff;
  color: var(--ink);
  text-decoration: none;
  white-space: nowrap;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  transition: transform 0.2s ease, background 0.2s ease;
}
.reseller-btn:hover {
  background: #f3f3f5;
  transform: translateY(-2px);
}
/* Refined header CTAs: glass-effect demo and solid black Get Started. */
.demo-btn {
  color: #fff !important;
  background: #000 !important;
  border: 1px solid #000 !important;
  box-shadow: none !important;
}
.start-btn {
  color: #fff !important;
  background: linear-gradient(135deg, #ff8126 0%, #ff6b00 55%, #d94d00 100%) !important;
  border: 1px solid #f66a0a !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15) !important;
}
.demo-btn:hover, .start-btn:hover {
  transform: translateY(-2px);
}
.demo-btn:hover {
  color: #fff !important;
  background: #1c1c1c !important;
  border-color: #1c1c1c !important;
}
.start-btn:hover {
  color: #fff !important;
  background: linear-gradient(135deg, #ff8c36 0%, #f76500 50%, #c94500 100%) !important;
  border-color: #f66a0a !important;
}
/* =========================================================
   MOBILE BUTTON
========================================================= */
.menu-toggle {
  display: none;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  border: 1px solid rgba(23, 36, 58, 0.08);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}
.menu-toggle span {
  width: 18px;
  height: 2px;
  border-radius: 5px;
  background: var(--ink);
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.menu-toggle .first {
  transform: translateY(7px) rotate(45deg);
}
.menu-toggle .second {
  opacity: 0;
}
.menu-toggle .third {
  transform: translateY(-7px) rotate(-45deg);
}
/* =========================================================
   MOBILE MENU
========================================================= */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 10px clamp(20px, 4vw, 32px) 22px;
  border: 0;
  border-top: 1px solid #ececef;
  border-radius: 0;
  background: #fff;
  box-shadow: 0 30px 50px -24px rgba(11, 12, 14, 0.25);
}
.mobile-link,
.mobile-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 3px;
  border: 0;
  border-bottom: 1px solid rgba(11, 12, 14, 0.07);
  background: transparent;
  color: var(--ink);
  text-decoration: none;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 500;
  cursor: pointer;
}
.mobile-link:hover,
.mobile-trigger:hover {
  color: var(--accent);
}
.mobile-link svg {
  width: 17px;
  height: 17px;
  stroke: currentColor;
  stroke-width: 1.6;
}
.mobile-trigger svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  stroke-width: 1.6;
  transition: transform 0.25s ease;
}
.mobile-trigger svg.rotate {
  transform: rotate(180deg);
}
.mobile-sub {
  padding: 5px 0 8px;
}
.mobile-sub a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 5px 12px 13px;
  border-bottom: 1px solid #f0f1f3;
  color: var(--ink);
  text-decoration: none;
}
.mobile-sub a.mobile-all {
  color: var(--accent);
  font-size: 11.5px;
  font-weight: 700;
}
.mobile-sub strong {
  display: block;
  font-size: 11.5px;
}
.mobile-sub small {
  display: block;
  max-width: 260px;
  margin-top: 3px;
  color: #7d899b;
  font-size: 9.5px;
  line-height: 1.4;
}
.mobile-sub svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  stroke: currentColor;
  stroke-width: 1.5;
}
.mobile-industry-enter-active,
.mobile-industry-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-industry-enter-from,
.mobile-industry-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.mobile-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  padding-top: 17px;
}
.mobile-actions .demo-btn,
.mobile-actions .start-btn {
  min-width: 0;
  padding: 0 10px;
  font-size: 11px;
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-7px);
}
/* =========================================================
   RESPONSIVE
========================================================= */
@media (max-width: 1480px) {
  .nav-link {
    font-size: 13.5px;
  }
  .desktop-actions {
    gap: 7px;
  }
  .reseller-btn,
  .demo-btn,
  .start-btn {
    min-height: 41px;
    padding-inline: 15px;
    font-size: 13.5px;
  }
}
@media (max-width: 1300px) {
  .nav-link {
    font-size: 13px;
  }
  .brand-logo {
    width: 120px;
    height: 29px;
  }
  .mm-grid-3,
  .mm-grid-sm {
    grid-template-columns: 210px minmax(0, 1fr) 270px;
  }
  .mm-items-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 1340px) {
  .bar-in {
    justify-content: space-between;
    min-height: 64px;
  }
  .desktop-links,
  .desktop-actions {
    display: none;
  }
  .menu-toggle {
    display: flex;
  }
}
@media (max-width: 480px) {
  .topbar-in {
    gap: 14px;
    padding: 0 10px;
  }
  .tb-phone {
    gap: 5px;
    font-size: 12px;
  }
  .tb-label {
    display: none;
  }
  .brand-logo {
    width: 112px;
    height: 27px;
  }
  .mobile-actions {
    grid-template-columns: 1fr;
  }
  .mobile-actions .reseller-btn,
  .mobile-actions .demo-btn,
  .mobile-actions .start-btn {
    min-height: 43px;
    font-size: 12px;
  }
}
.mobile-actions .reseller-btn {
  grid-column: 1 / -1;
  min-width: 0;
  padding: 0 10px;
  font-size: 11px;
}
@media (prefers-reduced-motion: reduce) {
  .nav-shell *,
  .nav-shell *::before,
  .nav-shell *::after {
    transition: none !important;
    animation: none !important;
  }
}
/* Targeted desktop mega-menu layout updates */
.mm-features,
.mm-industries,
.mm-reseller {
  height: 330px;
  min-height: 330px;
}
.mm-features {
  left: 50%;
  right: auto;
  width: min(1320px, calc(100vw - 112px));
  max-width: calc(100vw - 112px);
  transform: translateX(-50%);
}
.mm-features.mega-enter-from,
.mm-features.mega-leave-to,
.mm-industries.mega-enter-from,
.mm-industries.mega-leave-to {
  transform: translate(-50%, -8px);
}
.mm-features-grid {
  grid-template-columns: 175px minmax(0, 1fr) 180px;
  height: 100%;
  gap: 12px;
}
.mm-hub-only { height: 100%; padding-right: 18px; min-width: 0; }
.mm-hub-link {
  display: block;
  width: 100%;
  padding: 11px 10px;
  border-radius: 10px;
  color: var(--ink);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: background .2s ease, color .2s ease;
}
.mm-hub-link:hover,
.mm-hub-link:focus-visible { background: #f1f1f4; color: var(--ink); }
.mm-feature-columns { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 8px; align-content: start; }
.mm-feature-column { display: flex; flex-direction: column; gap: 19px; min-width: 0; }
.mm-feature-column .mm-it { padding: 12px 4px; gap: 10px; }
.mm-feature-column .mm-it-t strong { font-size: 14px; }
.mm-feature-card { min-width: 0; min-height: 280px; }
.mm-feature-card .mm-card-ov strong { font-size: 15px; }
.mm-feature-column .mm-it-t strong { white-space: nowrap; }
.mm-industries {
  left: 50%;
  right: auto;
  width: min(1320px, calc(100vw - 112px));
  max-width: calc(100vw - 112px);
  transform: translateX(-50%);
}
.mm-industries-grid { grid-template-columns: 145px minmax(0, 450px) minmax(0, 1fr); height: 100%; gap: 14px; }
.mm-industry-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 14px; align-content: start; }
.mm-industry-column { display: flex; flex-direction: column; gap: 19px; min-width: 0; }
.mm-industry-column .mm-it { padding: 12px 5px; gap: 11px; }
.mm-industry-column .mm-it-t strong { white-space: nowrap; }
.mm-industry-cards { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 14px; min-width: 0; }
.mm-industry-cards .mm-card { min-height: 280px; }
.mm-industry-cards .mm-card-ov { left: 12px; right: 10px; bottom: 13px; gap: 6px; }
.mm-industry-cards .mm-card-ov strong { font-size: 14px; }
.mm-industry-cards .mm-go { width: 32px; height: 32px; }
/* Industry hero image: richer editorial caption, without an action button. */
.mm-industry-cards .mm-industry-feature-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 7px;
  left: 22px;
  right: 20px;
  bottom: 22px;
}
.mm-industry-cards .mm-industry-feature-copy strong {
  color: #fff;
  font-size: clamp(27px, 2vw, 36px);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.6px;
}
.mm-industry-feature-subtitle {
  max-width: 240px;
  color: rgba(255,255,255,.87);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
}
.mm-reseller { left: auto; right: clamp(24px, 9vw, 180px); width: min(1000px, calc(100% - 48px)); }
.mm-reseller .mm-grid-sm { height: 100%; }
@media (max-width: 1530px) and (min-width: 1341px) {
  .mm-features, .mm-industries { left: 50%; right: auto; width: calc(100vw - 112px); max-width: calc(100vw - 112px); }
  .mm-features-grid { grid-template-columns: 170px minmax(0, 1fr) 160px; gap: 8px; }
  .mm-feature-columns { column-gap: 8px; }
  .mm-feature-column .mm-it { padding-inline: 2px; gap: 8px; }
  .mm-feature-column .mm-it-t strong { font-size: 14px; }
  .mm-feature-column .ic { width: 18px; height: 18px; }
  .mm-industries-grid { grid-template-columns: 170px minmax(0, 410px) minmax(0, 1fr); gap: 10px; }
  .mm-industry-column .mm-it { padding-inline: 4px; gap: 7px; }
  .mm-industry-cards { gap: 8px; }
  .mm-reseller { right: 24px; }
}
/* Large desktop refinement: laptop sizing above remains unchanged. */
@media (min-width: 1700px) {
  .mm-features,
  .mm-industries {
    width: min(1540px, calc(100vw - 160px));
    max-width: calc(100vw - 160px);
  }
  .mm-features-grid {
    grid-template-columns: 185px minmax(0, 1fr) 230px;
    gap: 20px;
  }
  .mm-feature-columns { column-gap: 18px; }
  .mm-feature-column .mm-it { padding-inline: 5px; gap: 11px; }
  .mm-industries-grid {
    grid-template-columns: 175px minmax(0, 500px) minmax(0, 1fr);
    gap: 20px;
  }
  .mm-industry-columns { column-gap: 20px; }
  .mm-industry-cards { gap: 14px; }
  /* Keep Reseller aligned to the right, but balanced on wide monitors. */
  .mm-reseller {
    width: min(1100px, calc(100vw - 160px));
    right: max(80px, calc((100vw - 1540px) / 2));
  }
}
/* Group labels for the four Features mega-menu columns. */
.mm-feature-group-heading {
  /* Same typography and muted tone as the Reseller .mm-h caption. */
  margin: 0 0 10px;
  padding: 0 4px;
  color: #98a2b3;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.4;
  min-height: 36px;
  display: flex;
  align-items: flex-start;
}
/* Remove flex gap around the caption; apply spacing only to feature links. */
.mm-feature-column { gap: 0; }
.mm-feature-column .mm-it { padding-block: 11px; margin-bottom: 12px; }
.mm-feature-column .mm-it:last-child { margin-bottom: 0; }
/* Top strip uses the same horizontal gutters as the main navigation. */
.topbar-in {
  width: 100%;
  max-width: none;
  margin-inline: auto;
  padding-inline: clamp(20px, 4vw, 96px);
  justify-content: flex-start;
}
.tb-flag { font-size: 16px; line-height: 1; }
/* Phone numbers underline on hover without changing color. */
.tb-phone, .tb-phone:hover { color: var(--navy); }
.tb-number { text-decoration: none; text-underline-offset: 3px; }
.tb-phone:hover .tb-number, .tb-phone:focus-visible .tb-number {
  text-decoration: underline;
}
/* Plain underlined text link rather than a pill-shaped button. */
.topbar-reseller {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--navy);
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  text-decoration: underline;
  text-underline-offset: 3px;
  white-space: nowrap;
}
.topbar-reseller:hover { color: var(--navy); background: transparent; }
.topbar-reseller:focus-visible { outline: 2px solid var(--navy); outline-offset: 3px; }
@media (max-width: 760px) {
  .topbar-in {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 8px 16px;
    padding-block: 9px;
  }
  .topbar-reseller { margin-left: auto; }
  .tb-phone { font-size: 11px; }
  .topbar { max-height: 180px; }
}
/* Keep all top-row items on a shared baseline with consistent spacing. */
.topbar-in { gap: clamp(18px, 2.2vw, 36px); min-height: 42px; }
.tb-phone { display: inline-flex; align-items: center; gap: 6px; line-height: 1.4; }
.tb-phone svg { flex: 0 0 14px; display: block; }
.tb-flag { display: inline-flex; align-items: center; justify-content: center; width: 20px; flex: 0 0 20px; }
.tb-label, .tb-number { display: inline-block; line-height: 1.4; }
.topbar-reseller { align-self: center; font-size: 14px; line-height: 1.4; }
@media (max-width: 760px) {
  .topbar-in { gap: 10px 18px; }
  .topbar-reseller { font-size: 13px; }
}
/* Header CTAs — hero orange gradient and solid black demo button */
.nav-shell .desktop-actions a.start-btn,
.nav-shell .mobile-actions a.start-btn {
  color: #fff !important;
  background: linear-gradient(135deg, #ff8126 0%, #ff6b00 55%, #d94d00 100%) !important;
  border: 1px solid #f66a0a !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15) !important;
}
.nav-shell .desktop-actions a.start-btn:hover,
.nav-shell .mobile-actions a.start-btn:hover {
  color: #fff !important;
  background: linear-gradient(135deg, #ff8c36 0%, #f76500 50%, #c94500 100%) !important;
  border-color: #f66a0a !important;
}
.nav-shell .desktop-actions a.demo-btn,
.nav-shell .mobile-actions a.demo-btn {
  color: #fff !important;
  background: #000 !important;
  border: 1px solid #000 !important;
  box-shadow: none !important;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.nav-shell .desktop-actions a.demo-btn:hover,
.nav-shell .mobile-actions a.demo-btn:hover {
  color: #fff !important;
  background: #1c1c1c !important;
  border-color: #1c1c1c !important;
  transform: translateY(-2px);
}
/* =========================================================
   RESPONSIVE LAYOUT FOR ALL SCREEN SIZES (incl. large monitors)
   One shared gutter (--gut) is used by the top row, the main bar AND the mega
   menus, so the menus always line up with the logo on the left and the buttons
   on the right. Above 1760px of content width the header stays centred instead
   of stretching edge to edge (mega menus used to be centred on the window
   while the logo and links sat further left).
========================================================= */
.nav-shell {
  --gut: max(clamp(20px, 4vw, 96px), calc((100% - 1760px) / 2));
}
.topbar-in,
.bar-in {
  max-width: none;
  padding-inline: var(--gut);
}
/* mega menus: same left and right edges as the header content */
.mm-features,
.mm-industries {
  left: var(--gut);
  right: var(--gut);
  width: auto;
  max-width: none;
  transform: none;
}
.mm-features.mega-enter-from,
.mm-features.mega-leave-to,
.mm-industries.mega-enter-from,
.mm-industries.mega-leave-to {
  transform: translateY(-8px);
}
/* Reseller menu hugs the right edge of the content */
.mm-reseller {
  left: auto;
  right: var(--gut);
  width: min(1100px, calc(100% - 2 * var(--gut)));
  max-width: none;
}
/* the Features / Industries grids keep their proportions as the menu widens */
@media (min-width: 1700px) {
  .mm-features,
  .mm-industries {
    width: auto;
    max-width: none;
  }
}
/* very large monitors: slightly bigger type and logo so the header does not look tiny */
@media (min-width: 2200px) {
  .bar-in { min-height: 80px; }
  .brand-logo { width: 150px; height: 36px; }
  .nav-link { font-size: 15.5px; padding-inline: 16px; }
  .tb-phone, .topbar-reseller { font-size: 14.5px; }
  .demo-btn, .start-btn { min-height: 47px; padding: 0 24px; font-size: 16px; }
  .mm-features, .mm-industries, .mm-reseller { height: 360px; min-height: 360px; }
  .mm-hub-link, .mm-feature-column .mm-it-t strong, .mm-industry-column .mm-it-t strong { font-size: 15.5px; }
  .mm-feature-group-heading, .mm-h { font-size: 13.5px; }
  .mm-it-t small { font-size: 13px; }
  .mm-feature-card .mm-card-ov strong, .mm-industry-cards .mm-card-ov strong { font-size: 17px; }
}
@media (min-width: 3000px) {
  .nav-shell { --gut: max(clamp(20px, 4vw, 96px), calc((100% - 2000px) / 2)); }
  .nav-link { font-size: 17px; }
  .brand-logo { width: 170px; height: 41px; }
}
/* Country flag images */
.tb-phone .tb-flag {
  display: block;
  width: 22px;
  height: 15px;
  flex: 0 0 22px;
  object-fit: contain;
  border-radius: 2px;
}
.tb-phone { gap: 8px; }
/* Reseller Signup: a pill button like Book a Demo / Get Started, with a grey background. */
.nav-shell .topbar-reseller {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  margin-block: 5px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease;
}
.nav-shell .topbar-reseller:hover { color: var(--ink); background: transparent; text-decoration: underline; text-underline-offset: 3px; }
.nav-shell .topbar-reseller:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
/* the same grey button inside the mobile menu */
.nav-shell .mobile-actions .reseller-btn {
  border: 0;
  background: transparent;
  color: var(--ink);
}
.nav-shell .mobile-actions .reseller-btn:hover { background: transparent; text-decoration: underline; text-underline-offset: 3px; transform: none; }
/* =========================================================
   MEGA MENUS (final, consistent rules)
   Features: full content width. Industries and Reseller: compact panels that open
   right under their own link (--x is set from the link position) and never leave the page gutters.
========================================================= */
.nav-shell .mm-industries,
.nav-shell .mm-reseller {
  --w: 1100px;
  left: clamp(var(--gut), calc(var(--x, 0px) - 16px), calc(100% - var(--gut) - var(--w)));
  right: auto;
  width: var(--w);
  max-width: calc(100% - 2 * var(--gut));
  transform: none;
  top: calc(100% + 8px);
}
.nav-shell .mm-reseller { --w: 700px; }
.nav-shell .mm-industries .mm-industries-grid { grid-template-columns: 150px 480px minmax(0, 1fr); gap: 16px; }
.nav-shell .mm-reseller .mm-grid-sm { grid-template-columns: 130px 250px minmax(0, 1fr); gap: 16px; }
.nav-shell .mm-reseller .mm-tabs { padding-right: 16px; }
.nav-shell .mm-reseller .mm-tab.on,
.nav-shell .mm-reseller .mm-tab:hover { background: transparent; }
.nav-shell .mm-industries .mm-industry-feature-copy strong { font-size: clamp(24px, 1.8vw, 30px); }
.nav-shell .mm-industries.mega-enter-from,
.nav-shell .mm-industries.mega-leave-to,
.nav-shell .mm-reseller.mega-enter-from,
.nav-shell .mm-reseller.mega-leave-to { transform: translateY(-8px); }
/* invisible bridge so the pointer can travel from the link into the panel */
.nav-shell .mm-features::before,
.nav-shell .mm-industries::before,
.nav-shell .mm-reseller::before { content: ''; position: absolute; left: 0; right: 0; top: -12px; height: 12px; }
@media (max-width: 1560px) {
  .nav-shell .mm-industries { --w: 1010px; }
  .nav-shell .mm-reseller { --w: 640px; }
  .nav-shell .mm-industries .mm-industries-grid { grid-template-columns: 130px 440px minmax(0, 1fr); gap: 12px; }
  .nav-shell .mm-reseller .mm-grid-sm { grid-template-columns: 120px 230px minmax(0, 1fr); gap: 14px; }
  .nav-shell .mm-industries .mm-industry-feature-copy strong { font-size: 22px; }
}
</style>
