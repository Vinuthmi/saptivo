<template>
  <main class="features-page help-desk-ticketing-page">
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
  </main>
</template>

<script setup>
import HeroSection from '@/components/Features/Help Desk & Ticketing/HeroSection.vue'
import SE1 from '@/components/Features/Help Desk & Ticketing/SE1.vue'
import SE2 from '@/components/Features/Help Desk & Ticketing/SE2.vue'
import SE3 from '@/components/Features/Help Desk & Ticketing/SE3.vue'
import SE4 from '@/components/Features/Help Desk & Ticketing/SE4.vue'
import SE5 from '@/components/Features/Help Desk & Ticketing/SE5.vue'
import SE6 from '@/components/Features/Help Desk & Ticketing/SE6.vue'
import SE7 from '@/components/Features/Help Desk & Ticketing/SE7.vue'
import SE8 from '@/components/Features/Help Desk & Ticketing/SE8.vue'
import SE9 from '@/components/Features/Help Desk & Ticketing/SE9.vue'

</script>

<style scoped>
.help-desk-ticketing-page :deep(h2),
.help-desk-ticketing-page :deep(h2 span) {
  color: #111 !important;
  -webkit-text-fill-color: #111 !important;
  background: none !important;
  background-image: none !important;
}

.help-desk-ticketing-page :deep(h2 .soft),
.help-desk-ticketing-page :deep(h2 .l2),
.help-desk-ticketing-page :deep(h2 .accent),
.help-desk-ticketing-page :deep(h2 .blue),
.help-desk-ticketing-page :deep(h2 .blue-text),
.help-desk-ticketing-page :deep(h2 .primary),
.help-desk-ticketing-page :deep(h2 .grad) {
  color: #8a8f97 !important;
  -webkit-text-fill-color: #8a8f97 !important;
}
</style>
