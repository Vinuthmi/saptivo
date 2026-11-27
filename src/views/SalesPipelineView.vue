<template>
  <main class="features-page sales-pipeline-page">
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
    <SE11 />
  </main>
</template>

<script setup>
import SE2 from '../components/Features/Sales Pipeline & Deals/SE2.vue';
import HeroSection from '../components/Features/Sales Pipeline & Deals/HeroSection.vue';
import SE1 from '../components/Features/Sales Pipeline & Deals/SE1.vue';
import SE3 from '@/components/Features/Sales Pipeline & Deals/SE3.vue';
import SE4 from '@/components/Features/Sales Pipeline & Deals/SE4.vue';
import SE5 from '@/components/Features/Sales Pipeline & Deals/SE5.vue';
import SE6 from '@/components/Features/Sales Pipeline & Deals/SE6.vue';
import SE7 from '@/components/Features/Sales Pipeline & Deals/SE7.vue';
import SE8 from '@/components/Features/Sales Pipeline & Deals/SE8.vue';
import SE9 from '@/components/Features/Sales Pipeline & Deals/SE9.vue';
import SE10 from '@/components/Features/Sales Pipeline & Deals/SE10.vue';
import SE11 from '@/components/Features/Sales Pipeline & Deals/SE11.vue';
</script>

<style scoped>
@media (max-width: 640px) {
  .sales-pipeline-page {
    overflow-x: clip;
  }

  .sales-pipeline-page :deep(.kb),
  .sales-pipeline-page :deep(.mp),
  .sales-pipeline-page :deep(.fu),
  .sales-pipeline-page :deep(.fc),
  .sales-pipeline-page :deep(.dt),
  .sales-pipeline-page :deep(.sa),
  .sales-pipeline-page :deep(.pq),
  .sales-pipeline-page :deep(.rb),
  .sales-pipeline-page :deep(.ps),
  .sales-pipeline-page :deep(.cp),
  .sales-pipeline-page :deep(.faq) {
    max-width: 100%;
    min-width: 0;
  }

  .sales-pipeline-page :deep(.title) {
    font-size: clamp(30px, 8vw, 42px);
    line-height: 1.12;
  }

  .sales-pipeline-page :deep(img),
  .sales-pipeline-page :deep(video),
  .sales-pipeline-page :deep(svg) {
    max-width: 100%;
  }

  .sales-pipeline-page :deep(.head),
  .sales-pipeline-page :deep(.wrap),
  .sales-pipeline-page :deep(.grid),
  .sales-pipeline-page :deep(.board),
  .sales-pipeline-page :deep(.app),
  .sales-pipeline-page :deep(.card),
  .sales-pipeline-page :deep(.panel),
  .sales-pipeline-page :deep(.row) {
    min-width: 0;
  }
}
</style>
