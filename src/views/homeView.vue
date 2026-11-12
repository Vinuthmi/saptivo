<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeroSection from '../components/home/herosection.vue'
import Section1 from '../components/home/section1.vue'
import Section2 from '../components/home/section2.vue'
import Section3 from '../components/home/section3.vue'
import Section4 from '../components/home/section4.vue'
import Section10 from '../components/home/section10.vue'
import Section6 from '../components/home/section6.vue'
import Section9 from '../components/home/section9.vue'
import Sectionwhy from '../components/home/Sectionwhy.vue'
import FAQ from '../components/home/FAQ.vue'
import Section11 from '../components/home/section11.vue'
import FooterCta from '../components/home/footercta.vue'
import TrustedBusinesses from '../components/home/trustedBusinesses.vue'



const route = useRoute()
const isSection2Preview = computed(() => route.query.preview === 'section2')
const isSection6Preview = computed(() => route.query.preview === 'section6')
</script>

<template>
  <main class="home-page">
    <Section6 v-if="isSection6Preview" preview />
    <template v-else>
      <HeroSection />
      <Section2 v-if="!isSection2Preview" />
      <Section1 :preview="isSection2Preview" />
      <Section4 />
      <Section3 />
      <Section10 />
      <Section6 preview />
      <TrustedBusinesses />
      <Section9 />
      <Sectionwhy />
      <FAQ />
      <Section11 />
      <FooterCta />
    </template>
  </main>
</template>
