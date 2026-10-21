<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'IpsovaNavbar' })

const menuOpen = ref(false)
const industriesOpen = ref(false)
const scrolled = ref(false)

const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Reseller', href: '#reseller' },
  { label: 'Reseller Signup', href: '#signup' },
  { label: 'Contact Us', href: '#contact' },
]

const industries = [
  {
    title: 'Retail & Supermarkets',
    description: 'Multi-counter barcode POS & instant inventory audit',
    icon: 'cart',
    href: '#retail'
  },
  {
    title: 'Wholesale & Distribution',
    description: 'Bulk tier pricing & supplier credit repayment tracking',
    icon: 'layers',
    href: '#wholesale'
  },
  {
    title: 'Contractors & Services',
    description: 'Job tracking, milestone deposits & mobile receipts',
    icon: 'briefcase',
    href: '#contractors'
  },
  {
    title: 'Fast-Growing Startups',
    description: 'Zero-friction quotation dispatch & client pipeline',
    icon: 'rocket',
    href: '#startups'
  }
]

function handleScroll() {
  scrolled.value = window.scrollY > 24
}

function closeMenu() {
  menuOpen.value = false
}

function closeIndustries() {
  industriesOpen.value = false
}

function toggleIndustries() {
  industriesOpen.value = !industriesOpen.value
}

function handleDocumentClick(event) {
  const target = event.target

  if (!target.closest('.industries-wrap')) {
    industriesOpen.value = false
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    industriesOpen.value = false
    menuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header
    class="nav-shell"
    :class="{
      scrolled,
      expanded: menuOpen,
      'industries-active': industriesOpen
    }"
  >



    <!-- =====================================================
         NAVBAR
    ====================================================== -->
    <nav class="glass-nav" aria-label="Main navigation">

      <!-- BRAND -->
      <a
        href="#top"
        class="brand"
        aria-label="Saptivo home"
        @click="closeMenu"
      >
        <img
          class="brand-logo"
          :src="logoSrc"
          alt="Saptivo"
        />
      </a>


      <!-- ===================================================
           DESKTOP LINKS
      ==================================================== -->
      <div class="desktop-links">

        <a
          href="#features"
          class="nav-link"
        >
          Features
        </a>


        <!-- INDUSTRIES -->
        <div
          class="industries-wrap"
          @mouseenter="industriesOpen = true"
        >

          <button
            type="button"
            class="nav-link industries-trigger"
            :class="{ active: industriesOpen }"
            :aria-expanded="industriesOpen"
            @click.stop="toggleIndustries"
          >
            Industries

            <svg
              viewBox="0 0 16 16"
              class="chevron"
              fill="none"
              aria-hidden="true"
              :class="{ rotate: industriesOpen }"
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </button>


          <!-- =================================================
               MEGA MENU
          ================================================== -->
          <Transition name="mega">

            <div
              v-if="industriesOpen"
              class="mega-menu"
              @mouseenter="industriesOpen = true"
              @mouseleave="industriesOpen = false"
            >

              <div class="mega-inner">

                <!-- LEFT INTRO -->
                <div class="mega-intro">

                  <div class="mega-number">
                    02 <span>/</span> SOLUTIONS
                  </div>

                  <div class="mega-label">
                    Industry Workflows
                  </div>

                  <h3>
                    Tailor-made systems for
                    <strong>high-volume trade.</strong>
                  </h3>

                  <p>
                    Whether operating multi-branch supermarket chains,
                    bulk distribution hubs, or service fleets, Saptivo
                    adapts to your daily velocity.
                  </p>

                  <a
                    href="#industries"
                    class="explore-industries"
                    @click="closeIndustries"
                  >
                    <span>Explore All Industries</span>

                    <span class="small-arrow">
                      <svg viewBox="0 0 20 20" fill="none">
                        <path d="M4 10h12m-5-5 5 5-5 5" />
                      </svg>
                    </span>
                  </a>

                </div>


                <!-- CENTER LIST -->
                <div class="mega-list">

                  <div class="mega-list-header">
                    <span>Select Industry</span>
                    <span>Proven Deployments</span>
                  </div>


                  <div
                    v-for="industry in industries"
                    :key="industry.title"
                    class="industry-item"
                  >

                    <a
                      :href="industry.href"
                      class="industry-link"
                      @click="closeIndustries"
                    >

                      <div class="industry-content">

                        <div class="industry-title">
                          {{ industry.title }}
                        </div>

                        <div class="industry-description">
                          {{ industry.description }}
                        </div>

                      </div>

                      <span class="industry-arrow">

                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path d="M4 10h12m-5-5 5 5-5 5" />
                        </svg>

                      </span>

                    </a>

                  </div>

                </div>


                <!-- RIGHT FEATURED CARD -->
                <div class="mega-feature">

                  <div class="feature-image">

                    <div class="feature-glow"></div>

                    <div class="feature-shape shape-one"></div>
                    <div class="feature-shape shape-two"></div>
                    <div class="feature-shape shape-three"></div>

                    <div class="feature-grid"></div>

                    <div class="feature-content">

                      <span class="feature-badge">
                        INDUSTRY SOLUTIONS
                      </span>

                      <h4>
                        Multi-Branch Retail Chains &
                        Enterprise Startups
                      </h4>

                    </div>

                    <a
                      href="#retail"
                      class="feature-arrow"
                      @click="closeIndustries"
                    >
                      <svg viewBox="0 0 20 20" fill="none">
                        <path d="M4 10h12m-5-5 5 5-5 5" />
                      </svg>
                    </a>

                  </div>

                </div>

              </div>

            </div>

          </Transition>

        </div>


        <!-- OTHER LINKS -->
        <a
          v-for="item in navItems.slice(1)"
          :key="item.label"
          :href="item.href"
          class="nav-link"
        >
          {{ item.label }}
        </a>

      </div>


      <!-- ===================================================
           DESKTOP ACTIONS
      ==================================================== -->
      <div class="desktop-actions">

        <a
          href="#demo"
          class="demo-btn"
        >
          Get a Demo
        </a>

        <a
          href="#signup"
          class="start-btn"
        >
          Get Started Free

          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path d="M4 10h12m-5-5 5 5-5 5" />
          </svg>

        </a>

      </div>


      <!-- ===================================================
           MOBILE TOGGLE
      ==================================================== -->
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


      <!-- ===================================================
           MOBILE MENU
      ==================================================== -->
      <Transition name="dropdown">

        <div
          v-if="menuOpen"
          class="mobile-menu"
        >

          <a
            href="#features"
            class="mobile-link"
            @click="closeMenu"
          >
            <span>Features</span>

            <svg viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m-5-5 5 5-5 5" />
            </svg>
          </a>


          <!-- MOBILE INDUSTRIES -->
          <div class="mobile-industries">

            <button
              type="button"
              class="mobile-industries-trigger"
              @click="industriesOpen = !industriesOpen"
            >

              <span>Industries</span>

              <svg
                viewBox="0 0 16 16"
                fill="none"
                :class="{ rotate: industriesOpen }"
              >
                <path d="m4 6 4 4 4-4" />
              </svg>

            </button>


            <Transition name="mobile-industry">

              <div
                v-if="industriesOpen"
                class="mobile-industry-list"
              >

                <a
                  v-for="industry in industries"
                  :key="industry.title"
                  :href="industry.href"
                  @click="closeMenu"
                >
                  <span>
                    <strong>{{ industry.title }}</strong>
                    <small>{{ industry.description }}</small>
                  </span>

                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12m-5-5 5 5-5 5" />
                  </svg>

                </a>

              </div>

            </Transition>

          </div>


          <a
            v-for="item in navItems.slice(1)"
            :key="item.label"
            :href="item.href"
            class="mobile-link"
            @click="closeMenu"
          >
            <span>{{ item.label }}</span>

            <svg viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m-5-5 5 5-5 5" />
            </svg>
          </a>


          <!-- MOBILE ACTIONS -->
          <div class="mobile-actions">

            <a
              href="#demo"
              class="demo-btn"
              @click="closeMenu"
            >
              Get a Demo
            </a>

            <a
              href="#signup"
              class="start-btn"
              @click="closeMenu"
            >
              Get Started Free
            </a>

          </div>

        </div>

      </Transition>

    </nav>

  </header>
</template>


<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;650;700;750;800&display=swap');


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
   ANNOUNCEMENT
========================================================= */

.announcement-bar {

  width: 100%;

  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      90deg,
      #101521,
      #111827,
      #101521
    );

  color: white;

}

.announcement-inner {

  position: relative;

  width: min(1400px, 100%);

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  height: 100%;

  font-size: 11px;

}

.announcement-dot {

  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: var(--orange);

  box-shadow:
    0 0 0 4px rgba(255, 104, 24, 0.12);

}

.announcement-text {

  color: rgba(255,255,255,0.78);

}

.announcement-link {

  display: inline-flex;

  align-items: center;

  gap: 4px;

  color: var(--orange);

  font-weight: 650;

  text-decoration: none;

}

.announcement-link svg {

  width: 13px;
  height: 13px;

  stroke: currentColor;

  stroke-width: 1.7;

  transition: transform .2s ease;

}

.announcement-link:hover svg {

  transform: translateX(3px);

}

.announcement-close {

  position: absolute;

  right: 2px;

  top: 50%;

  transform: translateY(-50%);

  border: 0;

  background: transparent;

  color: rgba(255,255,255,.55);

  font-size: 18px;

  cursor: pointer;

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

  margin: 0 auto;

  margin-top: 8px;

  padding: 11px 13px 11px 25px;

  border: 1px solid rgba(255,255,255,.8);

  border-radius: 22px;

  background:
    rgba(255,255,255,.82);

  backdrop-filter:
    blur(26px)
    saturate(170%);

  -webkit-backdrop-filter:
    blur(26px)
    saturate(170%);

  box-shadow:
    0 2px 5px rgba(27,39,59,.025),
    0 12px 35px rgba(27,39,59,.065),
    inset 0 1px 0 rgba(255,255,255,.95);

  transition:
    background .3s ease,
    box-shadow .3s ease,
    border-radius .3s ease,
    transform .3s ease;

}

.scrolled .glass-nav {

  background:
    rgba(255,255,255,.94);

  border-color:
    rgba(255,255,255,.98);

  box-shadow:
    0 18px 50px rgba(27,39,59,.13),
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

  gap: clamp(13px, 1.6vw, 26px);

  flex: 1;

}

.nav-link {

  position: relative;

  display: inline-flex;

  align-items: center;

  gap: 5px;

  padding: 10px 0;

  color: var(--muted);

  background: transparent;

  border: 0;

  text-decoration: none;

  white-space: nowrap;

  font-family: inherit;

  font-size: 12.5px;

  font-weight: 550;

  letter-spacing: -.15px;

  cursor: pointer;

  transition:
    color .22s ease;

}

.nav-link::after {

  position: absolute;

  bottom: 3px;
  left: 0;

  width: 0;
  height: 2px;

  border-radius: 20px;

  background: var(--orange);

  content: '';

  transition:
    width .25s ease;

}

.nav-link:hover,
.nav-link.active {

  color: var(--orange-dark);

}

.nav-link:hover::after,
.nav-link.active::after {

  width: 100%;

}

.chevron {

  width: 13px;
  height: 13px;

  stroke: currentColor;

  stroke-width: 1.5;

  transition:
    transform .25s ease;

}

.chevron.rotate {

  transform: rotate(180deg);

}


/* =========================================================
   INDUSTRIES WRAPPER
========================================================= */

.industries-wrap {

  position: static;

}


/* =========================================================
   MEGA MENU
========================================================= */

.mega-menu {

  position: absolute;

  top: calc(100% + 12px);

  left: 50%;

  transform: translateX(-50%);

  width: min(1075px, calc(100vw - 48px));

  padding: 10px;

  border: 1px solid rgba(255,255,255,.92);

  border-radius: 17px;

  background:
    rgba(247,248,250,.96);

  backdrop-filter:
    blur(30px)
    saturate(170%);

  -webkit-backdrop-filter:
    blur(30px)
    saturate(170%);

  box-shadow:
    0 30px 80px rgba(16,28,46,.16),
    0 8px 25px rgba(16,28,46,.07),
    inset 0 1px 0 rgba(255,255,255,.95);

}

.mega-inner {

  display: grid;

  grid-template-columns:
    1.05fr
    1.12fr
    .82fr;

  gap: 10px;

}


/* =========================================================
   MEGA INTRO
========================================================= */

.mega-intro {

  min-height: 382px;

  display: flex;

  flex-direction: column;

  padding: 27px 22px 18px;

  border-radius: 8px;

  background:
    rgba(255,255,255,.94);

  border: 1px solid rgba(22,36,58,.04);

}

.mega-number {

  color: #9aa8bd;

  font-size: 10px;

  font-weight: 750;

  letter-spacing: .6px;

}

.mega-number span {

  color: #c2c9d3;

  margin: 0 3px;

}

.mega-label {

  margin-top: 18px;

  color: var(--orange);

  font-size: 11px;

  font-weight: 700;

}

.mega-intro h3 {

  margin: 9px 0 10px;

  color: #18253a;

  font-size: 21px;

  line-height: 1.22;

  letter-spacing: -.7px;

  font-weight: 650;

}

.mega-intro h3 strong {

  display: block;

  font-weight: 800;

}

.mega-intro p {

  max-width: 285px;

  margin: 0;

  color: #718097;

  font-size: 11.5px;

  line-height: 1.6;

}

.explore-industries {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-top: auto;

  min-height: 50px;

  padding: 0 10px 0 14px;

  border: 1px solid #e1e4e8;

  border-radius: 7px;

  background: #f7f7f6;

  color: #17243a;

  text-decoration: none;

  font-size: 11px;

  font-weight: 700;

  transition:
    background .25s ease,
    transform .25s ease,
    border-color .25s ease;

}

.explore-industries:hover {

  background: #fff;

  border-color: #d5dae1;

  transform: translateY(-2px);

}

.small-arrow {

  width: 31px;
  height: 31px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 7px;

  background: white;

  border: 1px solid #e1e5ea;

}

.small-arrow svg {

  width: 15px;
  height: 15px;

  stroke: currentColor;

  stroke-width: 1.7;

}


/* =========================================================
   MEGA LIST
========================================================= */

.mega-list {

  padding: 22px 16px;

  border-radius: 8px;

  background: rgba(255,255,255,.94);

  border: 1px solid rgba(22,36,58,.04);

}

.mega-list-header {

  display: flex;

  justify-content: space-between;

  padding: 0 3px 12px;

  border-bottom: 1px solid #edf0f3;

  color: #9aa8bd;

  text-transform: uppercase;

  font-size: 9px;

  font-weight: 750;

  letter-spacing: .7px;

}

.mega-list-header span:last-child {

  color: #46546b;

  text-transform: none;

  letter-spacing: 0;

  font-size: 10px;

}

.industry-item {

  border-bottom: 1px solid #f0f2f4;

}

.industry-item:last-child {

  border-bottom: 0;

}

.industry-link {

  min-height: 79px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  padding: 11px 3px;

  color: inherit;

  text-decoration: none;

}

.industry-content {

  min-width: 0;

}

.industry-title {

  color: #1a273c;

  font-size: 12.5px;

  font-weight: 700;

  transition: color .2s ease;

}

.industry-description {

  max-width: 240px;

  margin-top: 4px;

  color: #7a879a;

  font-size: 10.5px;

  line-height: 1.45;

}

.industry-arrow {

  width: 27px;
  height: 27px;

  display: flex;

  flex-shrink: 0;

  align-items: center;
  justify-content: center;

  border: 1px solid #e0e5eb;

  border-radius: 7px;

  background: #f7f8f9;

  transition:
    background .2s ease,
    color .2s ease,
    transform .2s ease,
    border-color .2s ease;

}

.industry-arrow svg {

  width: 13px;
  height: 13px;

  stroke: currentColor;

  stroke-width: 1.6;

}

.industry-link:hover .industry-title {

  color: var(--orange);

}

.industry-link:hover .industry-arrow {

  color: white;

  background: var(--orange);

  border-color: var(--orange);

  transform: translateX(3px);

}


/* =========================================================
   FEATURED CARD
========================================================= */

.mega-feature {

  min-height: 382px;

  overflow: hidden;

  border-radius: 8px;

}

.feature-image {

  position: relative;

  height: 100%;

  min-height: 382px;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 70% 20%,
      rgba(255,104,24,.45),
      transparent 35%
    ),
    linear-gradient(
      145deg,
      #131b1c,
      #080b10 70%,
      #121827
    );

}


/* fake futuristic image */

.feature-grid {

  position: absolute;

  inset: 0;

  opacity: .18;

  background-image:
    linear-gradient(
      rgba(255,255,255,.08) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,255,255,.08) 1px,
      transparent 1px
    );

  background-size: 30px 30px;

  mask-image:
    linear-gradient(
      to bottom,
      transparent,
      black 35%,
      black 80%,
      transparent
    );

}

.feature-glow {

  position: absolute;

  width: 220px;
  height: 220px;

  top: -70px;
  right: -30px;

  border-radius: 50%;

  background:
    rgba(255,104,24,.28);

  filter: blur(55px);

}

.feature-shape {

  position: absolute;

  border-radius: 4px;

  transform:
    rotate(-7deg)
    skewY(2deg);

  box-shadow:
    0 25px 50px rgba(0,0,0,.4);

}

.shape-one {

  width: 155px;
  height: 48px;

  top: 78px;
  left: 48px;

  background:
    linear-gradient(
      90deg,
      #6e280f,
      #ff6818,
      #a83b14
    );

  filter: blur(.2px);

}

.shape-two {

  width: 125px;
  height: 42px;

  top: 154px;
  left: 72px;

  background:
    linear-gradient(
      90deg,
      #4c1d12,
      #d34d17,
      #713017
    );

}

.shape-three {

  width: 100px;
  height: 33px;

  top: 218px;
  left: 98px;

  background:
    linear-gradient(
      90deg,
      #2a1a17,
      #843514,
      #4d2218
    );

}

.feature-content {

  position: absolute;

  left: 20px;
  right: 20px;
  bottom: 20px;

  z-index: 3;

}

.feature-badge {

  display: inline-flex;

  padding: 5px 8px;

  border: 1px solid rgba(255,255,255,.3);

  border-radius: 4px;

  background:
    rgba(255,104,24,.55);

  color: white;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: .4px;

}

.feature-content h4 {

  max-width: 205px;

  margin: 9px 0 0;

  color: white;

  font-size: 14px;

  line-height: 1.35;

  letter-spacing: -.3px;

}

.feature-arrow {

  position: absolute;

  right: 20px;
  bottom: 20px;

  width: 34px;
  height: 34px;

  z-index: 4;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: white;

  color: #17243a;

  text-decoration: none;

  transition:
    transform .25s ease,
    background .25s ease;

}

.feature-arrow svg {

  width: 16px;
  height: 16px;

  stroke: currentColor;

  stroke-width: 1.7;

}

.feature-arrow:hover {

  transform: translateX(3px);

  background: var(--orange);

  color: white;

}


/* =========================================================
   MEGA ANIMATION
========================================================= */

.mega-enter-active,
.mega-leave-active {

  transition:
    opacity .22s ease,
    transform .28s cubic-bezier(.22,1,.36,1);

}

.mega-enter-from,
.mega-leave-to {

  opacity: 0;

  transform:
    translateX(-50%)
    translateY(-10px)
    scale(.98);

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

  transition:
    transform .25s ease,
    box-shadow .25s ease,
    background .25s ease;

}

.demo-btn {

  color: var(--ink);

  border: 1px solid rgba(28,41,61,.07);

  background: rgba(255,255,255,.9);

  box-shadow:
    0 3px 10px rgba(28,41,61,.045);

}

.start-btn {

  color: white;

  border: 1px solid rgba(255,255,255,.28);

  background:
    linear-gradient(
      115deg,
      #ff7b2a,
      #ff5c0a
    );

  box-shadow:
    0 5px 13px rgba(255,104,24,.22),
    inset 0 1px 0 rgba(255,255,255,.3);

}

.start-btn svg {

  width: 15px;
  height: 15px;

  stroke: currentColor;

  stroke-width: 1.8;

  transition:
    transform .25s ease;

}

.demo-btn:hover,
.start-btn:hover {

  transform: translateY(-2px);

}

.demo-btn:hover {

  box-shadow:
    0 8px 20px rgba(28,41,61,.1);

}

.start-btn:hover {

  background:
    linear-gradient(
      115deg,
      #ff8a40,
      #ed570b
    );

  box-shadow:
    0 9px 24px rgba(255,104,24,.32);

}

.start-btn:hover svg {

  transform: translateX(3px);

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

  border: 1px solid rgba(23,36,58,.08);

  border-radius: 14px;

  background:
    rgba(255,255,255,.8);

  cursor: pointer;

}

.menu-toggle span {

  width: 18px;
  height: 2px;

  border-radius: 5px;

  background: var(--ink);

  transition:
    transform .25s ease,
    opacity .2s ease;

}

.menu-toggle .first {

  transform:
    translateY(7px)
    rotate(45deg);

}

.menu-toggle .second {

  opacity: 0;

}

.menu-toggle .third {

  transform:
    translateY(-7px)
    rotate(-45deg);

}


/* =========================================================
   MOBILE MENU
========================================================= */

.mobile-menu {

  position: absolute;

  top: calc(100% + 10px);

  left: 0;
  right: 0;

  padding: 13px 20px 20px;

  border: 1px solid rgba(255,255,255,.9);

  border-radius: 22px;

  background:
    rgba(255,255,255,.96);

  backdrop-filter:
    blur(25px);

  -webkit-backdrop-filter:
    blur(25px);

  box-shadow:
    0 25px 65px rgba(27,39,59,.15);

}

.mobile-link {

  display: flex;

  align-items: center;
  justify-content: space-between;

  padding: 14px 3px;

  border-bottom:
    1px solid rgba(23,36,58,.07);

  color: var(--ink);

  text-decoration: none;

  font-size: 13px;

  font-weight: 550;

}

.mobile-link:hover {

  color: var(--orange-dark);

}

.mobile-link svg {

  width: 17px;
  height: 17px;

  stroke: currentColor;

  stroke-width: 1.6;

}


/* MOBILE INDUSTRIES */

.mobile-industries-trigger {

  width: 100%;

  display: flex;

  align-items: center;
  justify-content: space-between;

  padding: 14px 3px;

  border: 0;

  border-bottom:
    1px solid rgba(23,36,58,.07);

  background: transparent;

  color: var(--ink);

  font-family: inherit;

  font-size: 13px;

  font-weight: 550;

  cursor: pointer;

}

.mobile-industries-trigger svg {

  width: 15px;
  height: 15px;

  stroke: currentColor;

  stroke-width: 1.6;

  transition:
    transform .25s ease;

}

.mobile-industries-trigger svg.rotate {

  transform: rotate(180deg);

}

.mobile-industry-list {

  padding: 5px 0 8px;

}

.mobile-industry-list a {

  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 10px;

  padding: 12px 5px 12px 13px;

  border-bottom:
    1px solid #f0f1f3;

  color: var(--ink);

  text-decoration: none;

}

.mobile-industry-list strong {

  display: block;

  font-size: 11.5px;

}

.mobile-industry-list small {

  display: block;

  max-width: 260px;

  margin-top: 3px;

  color: #7d899b;

  font-size: 9.5px;

  line-height: 1.4;

}

.mobile-industry-list svg {

  width: 15px;
  height: 15px;

  flex-shrink: 0;

  stroke: currentColor;

  stroke-width: 1.5;

}

.mobile-industry-enter-active,
.mobile-industry-leave-active {

  transition:
    opacity .2s ease,
    transform .2s ease;

}

.mobile-industry-enter-from,
.mobile-industry-leave-to {

  opacity: 0;

  transform: translateY(-5px);

}


/* =========================================================
   MOBILE ACTIONS
========================================================= */

.mobile-actions {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 9px;

  padding-top: 17px;

}

.mobile-actions .demo-btn,
.mobile-actions .start-btn {

  min-width: 0;

  padding: 0 10px;

  font-size: 11px;

}


/* =========================================================
   DROPDOWN ANIMATION
========================================================= */

.dropdown-enter-active,
.dropdown-leave-active {

  transition:
    opacity .2s ease,
    transform .2s ease;

}

.dropdown-enter-from,
.dropdown-leave-to {

  opacity: 0;

  transform:
    translateY(-7px);

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1180px) {

  .glass-nav {

    gap: 18px;

    padding-left: 20px;

  }

  .desktop-links {

    gap: 13px;

  }

  .nav-link {

    font-size: 11.5px;

  }

  .demo-btn,
  .start-btn {

    padding-inline: 14px;

    font-size: 11px;

  }

  .mega-menu {

    width:
      min(1000px, calc(100vw - 30px));

  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 980px) {

  .nav-shell {

    padding-inline: 16px;

  }

  .announcement-bar {

    height: 34px;

  }

  .announcement-inner {

    font-size: 9px;

    gap: 6px;

  }

  .announcement-close {

    display: none;

  }

  .glass-nav {

    min-height: 66px;

    margin-top: 7px;

    padding:
      10px
      14px
      10px
      20px;

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


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 480px) {

  .nav-shell {

    padding-inline: 10px;

  }

  .announcement-text {

    display: none;

  }

  .announcement-inner {

    justify-content: center;

  }

  .glass-nav {

    min-height: 61px;

    padding:
      8px
      10px
      8px
      17px;

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


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .nav-shell *,
  .nav-shell *::before,
  .nav-shell *::after {

    transition: none !important;

    animation: none !important;

  }

}

</style>
