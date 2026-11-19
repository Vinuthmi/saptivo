<script setup>
import Integrationshero from '@/components/Integrations/integrationshero.vue'
import IntegrationDirectory from '@/components/Integrations/IntegrationDirectory.vue'
import WhyIntegrations from '@/components/Integrations/whyIntergrations.vue'
import Whatsapp from '@/components/Integrations/combinations.vue'
import setupintegrations from '@/components/Integrations/setupintegrations.vue';
import faq from '@/components/Integrations/faq.vue';

</script>

<template>
  <main class="integrations-page">
    <Integrationshero />
    <IntegrationDirectory />
    <WhyIntegrations />
    <Whatsapp />
    <setupintegrations />
    <faq />
  </main>
</template>