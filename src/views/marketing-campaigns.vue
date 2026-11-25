<template>
  <main class="features-page help-desk-ticketing-page">
    <HeroSection />
    <SE1 />
    <SE2 />
    <SE4 />
    <SE5 />
    <SE6 />
    <SE8 />
    <SE9 />
    <SE10 />
    <SE11 />
    <FAQ />

  </main>
</template>
<script setup>
import HeroSection from '@/components/Features/Marketing Campaigns/HeroSection.vue'
import SE1 from '@/components/Features/Marketing Campaigns/SE1.vue'
import SE2 from '@/components/Features/Marketing Campaigns/SE2.vue'
//import SE3 from '@/components/Features/Marketing Campaigns/SE3.vue'
import SE4 from '@/components/Features/Marketing Campaigns/SE4.vue'
import SE5 from '@/components/Features/Marketing Campaigns/SE5.vue'
import SE6 from '@/components/Features/Marketing Campaigns/SE6.vue'
import SE8 from '@/components/Features/Marketing Campaigns/SE8.vue'
import SE9 from '@/components/Features/Marketing Campaigns/SE9.vue'
import SE10 from '@/components/Features/Marketing Campaigns/SE10.vue'
import SE11 from '@/components/Features/Marketing Campaigns/SE11.vue'
import FAQ from '@/components/Features/Marketing Campaigns/FAQ.vue'


</script>

<style scoped>
.features-page :deep(h2),
.features-page :deep(h2 span) {
  color: #111 !important;
  -webkit-text-fill-color: #111 !important;
  background: none !important;
  background-image: none !important;
}

.features-page :deep(h2 .soft),
.features-page :deep(h2 .l2),
.features-page :deep(h2 .accent),
.features-page :deep(h2 .blue),
.features-page :deep(h2 .blue-text),
.features-page :deep(h2 .primary),
.features-page :deep(h2 .grad) {
  color: #8a8f97 !important;
  -webkit-text-fill-color: #8a8f97 !important;
}
</style>
