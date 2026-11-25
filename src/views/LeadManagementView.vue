<template>
  <main class="features-page lead-management-page">
    <HeroSection />
    <SE1 />
    <SE2 />
    <SE3 />
    <SE4 />
    <SE5 />
    <SE6 />
    <SE7 />
    <SE8 />
    <SE9 />
    <SE10 />
  </main>
</template>

<script setup>
import SE1 from '@/components/Features/Lead & Contact Management/SE1.vue';
import SE2 from '@/components/Features/Lead & Contact Management/SE2.vue';
import HeroSection from '../components/Features/Lead & Contact Management/HeroSection.vue'
import SE3 from '@/components/Features/Lead & Contact Management/SE3.vue';
import SE4 from '@/components/Features/Lead & Contact Management/SE4.vue';
import SE5 from '@/components/Features/Lead & Contact Management/SE5.vue';
import SE6 from '@/components/Features/Lead & Contact Management/SE6.vue';
import SE7 from '@/components/Features/Lead & Contact Management/SE7.vue';
import SE8 from '@/components/Features/Lead & Contact Management/SE8.vue';
import SE9 from '@/components/Features/Lead & Contact Management/SE9.vue';
import SE10 from '@/components/Features/Lead & Contact Management/SE10.vue';


</script>

<style scoped>
.lead-management-page :deep(h1),
.lead-management-page :deep(h2) {
  color: #111111 !important;
  -webkit-text-fill-color: #111111 !important;
  background: none !important;
  background-image: none !important;
}
.lead-management-page :deep(h1 span),
.lead-management-page :deep(h2 span) {
  color: #111111 !important;
  -webkit-text-fill-color: #111111 !important;
  background: none !important;
  background-image: none !important;
}
.lead-management-page :deep(h1 .accent),
.lead-management-page :deep(h2 .soft) {
  color: #8a8f97 !important;
  -webkit-text-fill-color: #8a8f97 !important;
}
</style>
