<script setup>
import pricinghero from '@/components/pricing/pricinghero.vue'
import pricingtable from '@/components/pricing/pricingtable.vue'
import pricingplans from '@/components/pricing/pricingplans.vue'
import pricingCRM from '@/components/pricing/pricingCRM.vue'
import chooseplan from '@/components/pricing/chooseplan.vue';
import savings from '@/components/pricing/savings.vue';
import everysize from '@/components/pricing/everysize.vue';
import pricingfaq from '@/components/pricing/pricingfaq.vue';

</script>

<template>
  <main class="integrations-page">
    <pricinghero />
    <pricingtable />
    <pricingplans />
    <pricingCRM />
    <chooseplan />
    <savings />
    <everysize />
    <pricingfaq />
  </main>
</template>