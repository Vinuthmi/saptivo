<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'IpsovaNavbar' })

/**
 * Saptivo header — navigation follows the sitemap in "Saptivo Website Content & SEO Copy" (v1.0):
 *   Features (hub + 16 feature pages) · Industries (hub + 5 industry pages) · Integrations · Security · Pricing
 *   Reseller (program, signup) · About · Blog · Contact (separate links)
 *   CTAs: Book a Demo (/demo/) and Free Trial (/free-trial/)
 */

const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`

const menuOpen = ref(false)
const openMenu = ref(null) // 'features' | 'industries' | 'reseller' | null (desktop dropdowns)
const mobileSection = ref(null) // open accordion in the mobile menu
const activeGroup = ref(0) // active tab in the Features mega menu
const scrolled = ref(false)

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
    title: 'Win more customers',
    items: [
      { title: 'Lead & Contact Management', href: '/features/lead-management/', icon: 'users' },
      { title: 'Sales Pipeline & Deals', href: '/features/sales-pipeline/', icon: 'pipeline' },
      { title: 'Quotations & Invoicing', href: '/features/quotations-invoicing/', icon: 'file' },
      { title: 'Marketing Campaigns', href: '/features/marketing-campaigns/', icon: 'megaphone' }
    ]
  },
  {
    title: 'Talk to customers on every channel',
    items: [
      { title: 'WhatsApp CRM', href: '/features/whatsapp-crm/', icon: 'chat' },
      { title: '3CX Call Integration', href: '/features/3cx-crm-integration/', icon: 'phone' },
      { title: 'Vodia Integration & AI Calls', href: '/features/vodia-integration/', icon: 'sparkles' },
      { title: 'Customer Portal', href: '/features/customer-portal/', icon: 'globe' },
      { title: 'Mobile CRM', href: '/features/mobile-crm/', icon: 'mobile' }
    ]
  },
  {
    title: 'Run operations and after-sales service',
    items: [
      { title: 'Service & AMC Management', href: '/features/service-maintenance-management/', icon: 'wrench' },
      { title: 'Help Desk & Ticketing', href: '/features/help-desk/', icon: 'lifebuoy' },
      { title: 'Inventory & Multi-Warehouse', href: '/features/inventory-management/', icon: 'box' },
      { title: 'Multi-Branch Management', href: '/features/multi-branch-management/', icon: 'store' }
    ]
  },
  {
    title: 'Work smarter',
    items: [
      { title: 'Workflow Automation', href: '/features/workflow-automation/', icon: 'zap' },
      { title: 'Reports & Analytics', href: '/features/reports-analytics/', icon: 'chart' },
      { title: 'AI CRM', href: '/features/ai-crm/', icon: 'sparkles' }
    ]
  }
]

/* flat list for the mobile menu */
const features = featureGroups.flatMap((g) => g.items)

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
  {
    title: 'More industries',
    description: 'Custom setups for almost any business',
    blurb: 'Custom setups for any business',
    href: '/industries/',
    icon: 'globe'
  }
]

/* photos on the right-hand card of each mega menu (swap freely) */
const menuPhotos = {
  features: 'https://images.unsplash.com/photo-1742836531271-98fd8151d257?w=900&q=80&auto=format&fit=crop',
  industries: 'https://images.unsplash.com/photo-1753354868616-544973e405c9?w=900&q=80&auto=format&fit=crop'
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

function openOn(key, event) {
  if (event && event.pointerType && event.pointerType !== 'mouse') return
  clearTimeout(closeTimer)
  openMenu.value = key
}

function closeSoon(event) {
  if (event && event.pointerType && event.pointerType !== 'mouse') return
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    openMenu.value = null
  }, 140)
}

function toggleMenu(key) {
  clearTimeout(closeTimer)
  openMenu.value = openMenu.value === key ? null : key
}

/* Features / Industries are links to their hub pages; on touch screens the first tap opens the menu instead */
function onHubClick(key, event) {
  if (event.pointerType && event.pointerType !== 'mouse') {
    event.preventDefault()
    toggleMenu(key)
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
  <header class="nav-shell" :class="{ scrolled, expanded: menuOpen }">
    <nav class="glass-nav" aria-label="Main navigation">
      <!-- BRAND (original logo, painted with a black to orange gradient through a mask, so any transparent PNG works) -->
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
            <div v-if="openMenu === 'features'" class="mega-menu mm mm-wide">
              <div class="mm-grid mm-grid-3">
                <!-- 1 · groups -->
                <div class="mm-tabs">
                  <button
                    v-for="(group, gi) in featureGroups"
                    :key="group.title"
                    type="button"
                    class="mm-tab"
                    :class="{ on: activeGroup === gi }"
                    @pointerenter="activeGroup = gi"
                    @focus="activeGroup = gi"
                    @click="activeGroup = gi"
                  >
                    {{ group.title }}
                  </button>
                  <router-link to="/features/" class="mm-all" @click="closeAll">All CRM features</router-link>
                </div>

                <!-- 2 · pages of the active group -->
                <div class="mm-body">
                  <p class="mm-h">{{ featureGroups[activeGroup].title }}</p>
                  <div class="mm-items mm-items-2">
                    <router-link v-for="item in featureGroups[activeGroup].items" :key="item.href" :to="item.href" class="mm-it" @click="closeAll">
                      <svg class="ic" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path v-for="(d, i) in ICONS[item.icon]" :key="i" :d="d" /></svg>
                      <span class="mm-it-t"><strong>{{ item.title }}</strong></span>
                    </router-link>
                  </div>
                </div>

                <div class="mm-card">
                  <img :src="menuPhotos.features" alt="" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
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
        <div class="nav-dd" @pointerenter="openOn('industries', $event)" @pointerleave="closeSoon($event)">
          <router-link
            to="/industries/"
            class="nav-link"
            :class="{ active: openMenu === 'industries' }"
            :aria-expanded="openMenu === 'industries'"
            aria-haspopup="true"
            @focus="openMenu = 'industries'"
            @click="onHubClick('industries', $event)"
          >
            Industries
            <svg viewBox="0 0 16 16" class="chevron" fill="none" aria-hidden="true" :class="{ rotate: openMenu === 'industries' }"><path d="m4 6 4 4 4-4" /></svg>
          </router-link>

          <Transition name="mega">
            <div v-if="openMenu === 'industries'" class="mega-menu mm mm-wide">
              <div class="mm-grid mm-grid-3">
                <div class="mm-tabs">
                  <span class="mm-tab on">Industries</span>
                  <router-link to="/industries/" class="mm-all" @click="closeAll">All industries</router-link>
                </div>
                <div class="mm-body">
                  <p class="mm-h">Built for the way you sell</p>
                  <div class="mm-items mm-items-2">
                    <router-link v-for="industry in industries" :key="industry.href" :to="industry.href" class="mm-it" @click="closeAll">
                      <svg class="ic" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path v-for="(d, i) in ICONS[industry.icon]" :key="i" :d="d" /></svg>
                      <span class="mm-it-t">
                        <strong>{{ industry.title }}</strong>
                        <small>{{ industry.blurb }}</small>
                      </span>
                    </router-link>
                  </div>
                </div>
                <div class="mm-card">
                  <img :src="menuPhotos.industries" alt="" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
                  <div class="mm-card-ov">
                    <strong>Don't see your industry?</strong>
                    <router-link to="/contact/" class="mm-go" aria-label="Contact us" @click="closeAll"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></router-link>
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
          @pointerenter="openOn(menu.key, $event)"
          @pointerleave="closeSoon($event)"
        >
          <button
            type="button"
            class="nav-link"
            :class="{ active: openMenu === menu.key }"
            :aria-expanded="openMenu === menu.key"
            aria-haspopup="true"
            @click.stop="toggleMenu(menu.key)"
          >
            {{ menu.label }}
            <svg viewBox="0 0 16 16" class="chevron" fill="none" aria-hidden="true" :class="{ rotate: openMenu === menu.key }"><path d="m4 6 4 4 4-4" /></svg>
          </button>

          <Transition name="mega">
            <div v-if="openMenu === menu.key" class="mega-menu mm mm-mid">
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

        <router-link to="/free-trial/" class="start-btn" @click="closeAll">Free Trial</router-link>
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
            <router-link to="/demo/" class="demo-btn" @click="closeAll">Book a Demo</router-link>
            <router-link to="/free-trial/" class="start-btn" @click="closeAll">Free Trial</router-link>
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
  padding: 0 24px;
  font-family: 'Outfit', system-ui, sans-serif;
}

/* =========================================================
   NAVBAR  (no border, soft shadow around)
========================================================= */

.glass-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: min(1390px, 100%);
  min-height: 72px;
  margin: 20px auto 0; /* space above the header, so it sits inside the hero panel */
  padding: 11px 13px 11px 25px;
  /* glass effect: translucent white and a strong blur, no edge line */
  border: 0;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.46) 0%, rgba(255, 255, 255, 0.24) 100%);
  backdrop-filter: blur(34px) saturate(240%) brightness(1.08);
  -webkit-backdrop-filter: blur(34px) saturate(240%) brightness(1.08);
  box-shadow: 0 12px 38px -6px rgba(15, 23, 42, 0.28), 0 2px 8px rgba(15, 23, 42, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease, border-radius 0.3s ease, transform 0.3s ease;
}

/* a little more opaque once the page scrolls, so it stays readable over any section */
.scrolled .glass-nav {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.74) 0%, rgba(255, 255, 255, 0.62) 100%);
  box-shadow: 0 16px 44px -4px rgba(15, 23, 42, 0.22), 0 3px 10px rgba(15, 23, 42, 0.08);
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
  width: 156px;
  height: 38px;
  background: linear-gradient(90deg, #0b0c0e 0%, #0b0c0e 45%, #f2531f 82%, #ff7a45 100%);
  -webkit-mask: var(--logo) left center / contain no-repeat;
  mask: var(--logo) left center / contain no-repeat;
}

/* =========================================================
   DESKTOP LINKS
========================================================= */

.desktop-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 9px 12px;
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
  position: static; /* mega menus are positioned against the nav bar */
}

/* =========================================================
   MEGA MENU  (groups | links with icons)
========================================================= */

.mega-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: min(900px, calc(100vw - 48px));
  padding: 14px;
  border: 0;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.18), 0 4px 14px rgba(15, 23, 42, 0.06);
}

.mm-wide {
  width: min(1020px, calc(100vw - 48px));
}

.mm-mid {
  width: min(780px, calc(100vw - 48px));
}

/* invisible bridge so the menu stays open while the pointer crosses the gap */
.mega-menu::before {
  position: absolute;
  top: -18px;
  left: 0;
  right: 0;
  height: 18px;
  content: '';
}

.mm-grid {
  display: grid;
  gap: 14px;
  min-height: 300px;
}

.mm-grid-3 {
  grid-template-columns: 210px minmax(0, 1fr) 270px;
}

.mm-grid-sm {
  grid-template-columns: 150px minmax(0, 1fr) 240px;
  min-height: 280px;
}

/* ---------- 1 · groups ---------- */

.mm-tabs {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 10px 6px 10px 10px;
  border-right: 1px solid #ececef;
}

.mm-tab {
  position: relative;
  width: 100%;
  padding: 10px 0 11px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: none;
  color: #7b879b;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.mm-tab:hover {
  color: var(--navy);
}

.mm-tab.on {
  color: var(--navy);
  border-bottom-color: var(--accent);
}

.mm-all {
  margin-top: auto;
  padding: 10px 0 4px;
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
  padding: 10px 6px 8px 8px;
}

.mm-h {
  margin: 0 0 10px;
  padding: 0 12px;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.mm-it {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 11px 12px;
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

.mm-card { position: relative; overflow: hidden; border-radius: 16px; background: linear-gradient(160deg, #3a3a40, #0b0c0e); }
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
  transform: translateX(-50%) translateY(-10px) scale(0.98);
}

/* =========================================================
   DESKTOP ACTIONS
========================================================= */

.desktop-actions {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
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

/* Same colours as the hero buttons: black for the demo, orange gradient for the trial, no shadows. */
.demo-btn {
  color: #fff;
  background: #000;
  box-shadow: none;
}

.start-btn {
  color: #fff;
  background: linear-gradient(135deg, #f26a1b 0%, #cf440a 100%) !important;
  box-shadow: none !important;
}

.demo-btn:hover,
.start-btn:hover {
  transform: translateY(-2px);
}

.demo-btn:hover {
  background: #1a1a1a;
}

.start-btn:hover {
  background: linear-gradient(135deg, #f97b2d 0%, #dc4c0d 100%) !important;
  box-shadow: none !important;
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
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 13px 20px 20px;
  border: 0;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  box-shadow: 0 25px 65px rgba(11, 12, 14, 0.15);
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

@media (max-width: 1180px) {
  .glass-nav {
    gap: 18px;
    padding-left: 20px;
  }

  .desktop-links {
    gap: 0;
  }

  .nav-link {
    padding-inline: 9px;
    font-size: 13px;
  }

  .demo-btn,
  .start-btn {
    padding-inline: 14px;
    font-size: 11px;
  }

  .mm-grid-3 {
    grid-template-columns: 180px minmax(0, 1fr) 230px;
  }

  .mm-grid-sm {
    grid-template-columns: 140px minmax(0, 1fr) 210px;
  }

  .mm-wide { width: min(940px, calc(100vw - 30px)); }
  .mm-mid { width: min(740px, calc(100vw - 30px)); }
}

@media (max-width: 1040px) {
  .nav-shell {
    padding-inline: 16px;
  }

  .glass-nav {
    min-height: 66px;
    margin-top: 16px;
    padding: 10px 14px 10px 20px;
    border-radius: 19px;
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
  .nav-shell {
    padding-inline: 10px;
  }

  .glass-nav {
    min-height: 61px;
    padding: 8px 10px 8px 17px;
    border-radius: 17px;
  }

  .brand-logo {
    width: 135px;
  }

  .mobile-menu {
    border-radius: 18px;
    padding-inline: 16px;
  }

  .mobile-actions {
    grid-template-columns: 1fr;
  }

  .mobile-actions .demo-btn,
  .mobile-actions .start-btn {
    min-height: 43px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-shell *,
  .nav-shell *::before,
  .nav-shell *::after {
    transition: none !important;
    animation: none !important;
  }
}

.glass-nav {
  background: rgba(255, 255, 255, 0.72) !important;
  -webkit-backdrop-filter: blur(26px) saturate(170%) !important;
  backdrop-filter: blur(26px) saturate(170%) !important;
}
</style>