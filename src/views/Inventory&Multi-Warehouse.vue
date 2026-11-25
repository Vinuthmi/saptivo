<template>
  <main class="features-page inventory-multi-warehouse-page">
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
import HeroSection from '@/components/Features/Inventory & Multi-Warehouse/HeroSection.vue'
import SE1 from '@/components/Features/Inventory & Multi-Warehouse/SE1.vue';
import SE2 from '@/components/Features/Inventory & Multi-Warehouse/SE2.vue';
import SE3 from '@/components/Features/Inventory & Multi-Warehouse/SE3.vue';
import SE4 from '@/components/Features/Inventory & Multi-Warehouse/SE4.vue';
import SE5 from '@/components/Features/Inventory & Multi-Warehouse/SE5.vue';
import SE6 from '@/components/Features/Inventory & Multi-Warehouse/SE6.vue';
import SE7 from '@/components/Features/Inventory & Multi-Warehouse/SE7.vue';
import SE8 from '@/components/Features/Inventory & Multi-Warehouse/SE8.vue';
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
