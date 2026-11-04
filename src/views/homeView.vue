<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeroSection from '../components/home/herosection.vue'
import Section1 from '../components/home/section1.vue'
import Section2 from '../components/home/section2.vue'
import Section3 from '../components/home/section3.vue'
import Section4 from '../components/home/section4.vue'
import Section5 from '../components/home/section5.vue'
import Section10 from '../components/home/section10.vue'
import Section6 from '../components/home/section6.vue'
import Section9 from '../components/home/section9.vue'
import Section11 from '../components/home/section11.vue'
import TrustedBusinesses from '../components/home/trustedBusinesses.vue'
import Sectionwhy from '../components/home/Sectionwhy.vue'
import FAQ from '../components/home/faq.vue'
import SiteHeader from '../components/home/siteHeader.vue'
import SiteFooter from '../components/home/siteFooter.vue'

const route = useRoute()
const isSection2Preview = computed(() => route.query.preview === 'section2')
const isSection6Preview = computed(() => route.query.preview === 'section6')
</script>

<template>
  <main>
    <Section6 v-if="isSection6Preview" preview />
    <template v-else>
      <SiteHeader />
      <HeroSection />
      <Section2 :preview="isSection2Preview" />
      <Section1 v-if="!isSection2Preview" />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section10 />
      <Section6 />
      <TrustedBusinesses />
      <Sectionwhy />
      <Section9 />
      <FAQ />
      <Section11 />
      <SiteFooter />
    </template>
  </main>
</template>
