<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'IpsovaNavbar' })

/**
 * Saptivo header — navigation follows the sitemap in "Saptivo Website Content & SEO Copy" (v1.0):
 *   Features (hub + 16 feature pages) · Industries (hub + 5 industry pages) · Integrations · Security · Pricing
 *   Reseller (program, signup) · About · Blog · Contact (separate links)
 *   CTAs: Book a Demo (/demo/) and Free Trial (/free-trial/)
 */

const menuOpen = ref(false)
const openMenu = ref(null) // 'features' | 'industries' | 'reseller' | null (desktop dropdowns)
const mobileSection = ref(null) // open accordion in the mobile menu
const scrolled = ref(false)

const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`
const featuresHref = `${import.meta.env.BASE_URL}features`

/* ---------------- FEATURES (all 16 pages, in the order of the doc's sitemap) ---------------- */
const features = [
  { title: 'Lead & Contact Management', href: '/features/lead-management/' },
  { title: 'Sales Pipeline & Deals', href: '/features/sales-pipeline/' },
  { title: 'Quotations & Invoicing', href: '/features/quotations-invoicing/' },
  { title: 'WhatsApp CRM', href: '/features/whatsapp-crm/' },
  { title: '3CX Call Integration', href: '/features/3cx-crm-integration/' },
  { title: 'Vodia Integration & AI Calls', href: '/features/vodia-integration/' },
  { title: 'Workflow Automation', href: '/features/workflow-automation/' },
  { title: 'Multi-Branch Management', href: '/features/multi-branch-management/' },
  { title: 'Inventory & Multi-Warehouse', href: '/features/inventory-management/' },
  { title: 'Service & AMC Management', href: '/features/service-maintenance-management/' },
  { title: 'Help Desk & Ticketing', href: '/features/help-desk/' },
  { title: 'Marketing Campaigns', href: '/features/marketing-campaigns/' },
  { title: 'Reports & Analytics', href: '/features/reports-analytics/' },
  { title: 'AI CRM', href: '/features/ai-crm/' },
  { title: 'Customer Portal', href: '/features/customer-portal/' },
  { title: 'Mobile CRM', href: '/features/mobile-crm/' }
]

/* ---------------- INDUSTRIES (names, URLs and copy from the /industries/ hub) ---------------- */
const industries = [
  {
    title: 'Retail & Supermarkets',
    description: 'Multi-counter checkouts, instant inventory audits, VIP loyalty tiers and WhatsApp receipts',
    href: '/industries/retail/'
  },
  {
    title: 'Wholesale & Distribution',
    description: 'Bulk tier pricing, dealer credit limits and repayment tracking',
    href: '/industries/wholesale-distribution/'
  },
  {
    title: 'Contractors & Services',
    description: 'Job tracking from enquiry to final payment, milestone deposits and mobile receipts',
    href: '/industries/contractors-services/'
  },
  {
    title: 'Field Service & Maintenance',
    description: 'Installed asset registers, annual maintenance contracts and technician apps',
    href: '/industries/field-service/'
  },
  {
    title: 'Startups & SMEs',
    description: 'Zero-friction quotations and a clear client pipeline, with no setup fee',
    href: '/industries/startups/'
  }
]

/* photos on the right-hand help card of each mega menu (swap freely) */
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
      { title: 'Reseller Program', description: 'Partner with Saptivo and grow with us', href: '/reseller/' },
      { title: 'Become a Reseller', description: 'Apply to join the program', href: '/reseller/signup/' }
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
      <!-- BRAND -->
      <router-link to="/" class="brand" aria-label="Saptivo CRM home" @click="closeAll">
        <img class="brand-logo" :src="logoSrc" alt="Saptivo CRM" />
      </router-link>

      <!-- =================================================== DESKTOP LINKS -->
      <div class="desktop-links">
        <!-- FEATURES (mega) -->
        <div
          class="nav-dd"
          @pointerenter="openOn('features', $event)"
          @pointerleave="closeSoon($event)"
        >
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
            <svg viewBox="0 0 16 16" class="chevron" fill="none" aria-hidden="true" :class="{ rotate: openMenu === 'features' }">
              <path d="m4 6 4 4 4-4" />
            </svg>
          </router-link>

          <Transition name="mega">
            <div v-if="openMenu === 'features'" class="mega-menu mm mm-narrow mm-wide">
              <div class="mm-grid mm-grid-2">
                <!-- all 16 feature pages -->
                <div class="mm-left mm-left-list mm-two">
                  <router-link
                    v-for="item in features"
                    :key="item.href"
                    :to="item.href"
                    class="mm-cat"
                    @click="closeAll"
                  >
                    <span>{{ item.title }}</span>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
                  </router-link>
                  <p class="mm-note"><i></i>16 features, one shared customer record</p>
                </div>

                <!-- help card -->
                <div class="mm-card">
                  <img :src="menuPhotos.features" alt="" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
                  <div class="mm-card-box">
                    <strong>Can't find the feature you need?</strong>
                    <router-link to="/demo/" class="mm-cta" @click="closeAll">Book a Demo</router-link>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- INDUSTRIES (mega) -->
        <div
          class="nav-dd"
          @pointerenter="openOn('industries', $event)"
          @pointerleave="closeSoon($event)"
        >
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
            <svg viewBox="0 0 16 16" class="chevron" fill="none" aria-hidden="true" :class="{ rotate: openMenu === 'industries' }">
              <path d="m4 6 4 4 4-4" />
            </svg>
          </router-link>

          <Transition name="mega">
            <div v-if="openMenu === 'industries'" class="mega-menu mm mm-narrow">
              <div class="mm-grid mm-grid-2">
                <!-- the 5 industry pages -->
                <div class="mm-left mm-left-list">
                  <router-link
                    v-for="industry in industries"
                    :key="industry.href"
                    :to="industry.href"
                    class="mm-cat"
                    @click="closeAll"
                  >
                    <span>{{ industry.title }}</span>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
                  </router-link>
                  <p class="mm-note"><i></i>5 industries, one platform that adapts to yours</p>
                </div>

                <!-- help card -->
                <div class="mm-card">
                  <img :src="menuPhotos.industries" alt="" loading="lazy" decoding="async" @error="$event.target.style.display = 'none'" />
                  <div class="mm-card-box">
                    <strong>Don't see your industry?</strong>
                    <router-link to="/contact/" class="mm-cta" @click="closeAll">Talk to our team</router-link>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- PLAIN LINKS -->
        <router-link
          v-for="item in plainLinks"
          :key="item.href"
          :to="item.href"
          class="nav-link"
          @click="closeAll"
        >
          {{ item.label }}
        </router-link>

        <!-- RESELLER (simple dropdown) -->
        <div
          v-for="menu in simpleMenus"
          :key="menu.key"
          class="nav-dd nav-dd-simple"
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
            <svg viewBox="0 0 16 16" class="chevron" fill="none" aria-hidden="true" :class="{ rotate: openMenu === menu.key }">
              <path d="m4 6 4 4 4-4" />
            </svg>
          </button>

          <Transition name="drop">
            <div v-if="openMenu === menu.key" class="simple-menu">
              <router-link
                v-for="item in menu.items"
                :key="item.href"
                :to="item.href"
                class="simple-link"
                @click="closeAll"
              >
                <span>
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.description }}</small>
                </span>
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
              </router-link>
            </div>
          </Transition>
        </div>

        <!-- ABOUT · BLOG · CONTACT -->
        <router-link
          v-for="item in trailingLinks"
          :key="item.href"
          :to="item.href"
          class="nav-link"
          @click="closeAll"
        >
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* =========================================================
   ROOT
========================================================= */

* {
  box-sizing: border-box;
}

.nav-shell {
  --orange: #ff6818;
  --orange-dark: #ed570b;
  --ink: #17243a;
  --muted: #657187;
  --white: #ffffff;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99999;
  padding: 0 24px;
  font-family: 'Inter', sans-serif;
}

/* =========================================================
   NAVBAR
========================================================= */

.glass-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: min(1390px, 100%);
  min-height: 72px;
  margin: 8px auto 0;
  padding: 11px 13px 11px 25px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(26px) saturate(170%);
  -webkit-backdrop-filter: blur(26px) saturate(170%);
  box-shadow:
    0 2px 5px rgba(27, 39, 59, 0.025),
    0 12px 35px rgba(27, 39, 59, 0.065),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  transition: background 0.3s ease, box-shadow 0.3s ease, border-radius 0.3s ease, transform 0.3s ease;
}

.scrolled .glass-nav {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(255, 255, 255, 0.98);
  box-shadow:
    0 18px 50px rgba(27, 39, 59, 0.13),
    inset 0 1px 0 #fff;
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
  max-height: 38px;
  object-fit: contain;
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
  color: #2b374c;
  background: transparent;
  text-decoration: none;
  white-space: nowrap;
  font-family: inherit;
  font-size: 13px;
  font-weight: 560;
  letter-spacing: -0.15px;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--orange-dark);
  background: rgba(255, 104, 24, 0.08);
}

.nav-link.router-link-active {
  color: var(--orange-dark);
}

.nav-link:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 1px;
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

.nav-dd-simple {
  position: relative; /* simple menus hang under their own trigger */
}

/* =========================================================
   MEGA MENU  (categories | links | help card)
========================================================= */

.mega-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  width: min(900px, calc(100vw - 48px));
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 26px;
  background: rgba(250, 250, 249, 0.97);
  backdrop-filter: blur(30px) saturate(170%);
  -webkit-backdrop-filter: blur(30px) saturate(170%);
  box-shadow:
    0 30px 80px rgba(16, 28, 46, 0.16),
    0 8px 25px rgba(16, 28, 46, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

/* invisible bridge so the menu stays open while the pointer crosses the gap */
.mega-menu::before {
  position: absolute;
  top: -16px;
  left: 0;
  right: 0;
  height: 16px;
  content: '';
}

.mm-grid {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) 270px;
  gap: 10px;
  min-height: 330px;
}

/* ---------- 1 · categories ---------- */

.mm-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 18px;
  background: transparent;
}

.mm-cat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 13px 14px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #1a273c;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.3;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.mm-cat svg {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  stroke: currentColor;
  stroke-width: 1.7;
}

.mm-cat svg {
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mm-cat:hover,
.mm-cat.on {
  background: #fff1e8;
  color: var(--orange-dark);
}

.mm-cat.on {
  color: var(--orange-dark);
  box-shadow: 0 4px 12px rgba(255, 104, 24, 0.1);
}

.mm-cat.on svg,
.mm-cat:hover svg {
  opacity: 1;
  transform: none;
}

.mm-cat:focus-visible,
.mm-cta:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 2px;
}

/* ---------- 2 · layout variants ---------- */

.mm-narrow {
  width: min(660px, calc(100vw - 48px));
}

.mm-grid-2 {
  grid-template-columns: minmax(0, 1fr) 260px;
}

.mm-wide {
  width: min(820px, calc(100vw - 48px));
}

.mm-left-list {
  min-height: 330px;
}

/* all 16 features: two columns, the footer note spans both */
.mm-two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: start;
  gap: 2px 6px;
}

.mm-two .mm-note {
  grid-column: 1 / -1;
}

/* quiet one-line footer inside the left panel */
.mm-note {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: auto 0 0;
  padding: 12px 14px 4px;
  border-top: 1px solid #eceef2;
  color: #657187;
  font-size: 11.5px;
  font-weight: 600;
}

.mm-note i {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--orange);
  box-shadow: 0 0 0 4px rgba(255, 104, 24, 0.16);
}

/* ---------- 3 · help card ---------- */

.mm-card {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(160deg, #2a3550, #131b2e);
}

.mm-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mm-card-box {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 14px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.96);
  text-align: center;
}

.mm-card-box strong {
  color: #17243a;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.3px;
}

.mm-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  border-radius: 10px;
  background: linear-gradient(180deg, #ff7a45, #f2531f);
  color: #fff;
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 650;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 10px 24px rgba(240, 75, 35, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mm-cta:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4), 0 16px 32px rgba(240, 75, 35, 0.4);
}

/* =========================================================
   SIMPLE DROPDOWN (Reseller)
========================================================= */

.simple-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  width: 286px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 15px;
  background: rgba(250, 251, 252, 0.97);
  backdrop-filter: blur(30px) saturate(170%);
  -webkit-backdrop-filter: blur(30px) saturate(170%);
  box-shadow:
    0 26px 60px rgba(16, 28, 46, 0.16),
    0 6px 20px rgba(16, 28, 46, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.simple-menu::before {
  position: absolute;
  top: -16px;
  left: 0;
  right: 0;
  height: 16px;
  content: '';
}

.simple-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 9px;
  color: #1a273c;
  text-decoration: none;
  transition: background 0.2s ease;
}

.simple-link strong {
  display: block;
  font-size: 12.5px;
  font-weight: 700;
  transition: color 0.2s ease;
}

.simple-link small {
  display: block;
  margin-top: 3px;
  color: #7a879a;
  font-size: 10.5px;
  line-height: 1.4;
}

.simple-link svg {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  stroke: currentColor;
  stroke-width: 1.6;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.simple-link:hover {
  background: #fff;
}

.simple-link:hover strong {
  color: var(--orange);
}

.simple-link:hover svg {
  opacity: 1;
  transform: none;
  color: var(--orange);
}

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
  font-size: 12px;
  font-weight: 650;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* same two buttons as the hero: black "Book a Demo", orange "Free Trial" */
.demo-btn {
  color: #fff;
  background: #0b0c0e;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14), 0 10px 24px rgba(0, 0, 0, 0.18);
}

.start-btn {
  color: #fff;
  background: linear-gradient(180deg, #ff7a45, #f2531f);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 10px 24px rgba(240, 75, 35, 0.3);
}

.demo-btn:hover,
.start-btn:hover {
  transform: translateY(-2px);
}

.demo-btn:hover {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28), 0 16px 32px rgba(0, 0, 0, 0.28);
}

.start-btn:hover {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4), 0 16px 32px rgba(240, 75, 35, 0.4);
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
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  box-shadow: 0 25px 65px rgba(27, 39, 59, 0.15);
}

.mobile-link,
.mobile-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 3px;
  border: 0;
  border-bottom: 1px solid rgba(23, 36, 58, 0.07);
  background: transparent;
  color: var(--ink);
  text-decoration: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 550;
  cursor: pointer;
}

.mobile-link:hover,
.mobile-trigger:hover {
  color: var(--orange-dark);
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
  color: var(--orange-dark);
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

.mobile-sub-title {
  padding: 14px 13px 4px;
  color: #9aa8bd;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
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
    font-size: 12px;
  }

  .demo-btn,
  .start-btn {
    padding-inline: 14px;
    font-size: 11px;
  }

  .mega-menu {
    width: min(860px, calc(100vw - 30px));
  }

  .mm-grid-2 {
    grid-template-columns: minmax(0, 1fr) 230px;
  }
}

@media (max-width: 1040px) {
  .nav-shell {
    padding-inline: 16px;
  }

  .glass-nav {
    min-height: 66px;
    margin-top: 7px;
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
</style>
