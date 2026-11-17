<script setup>
import Integrationshero from '@/components/Integrations/integrationshero.vue'
import IntegrationDirectory from '@/components/Integrations/IntegrationDirectory.vue'
import WhyIntegrations from '@/components/Integrations/whyIntergrations.vue'
import Whatsapp from '@/components/Integrations/whatsapp.vue'
</script>

<template>
  <main class="integrations-page">
    <Integrationshero />

    <IntegrationDirectory />
    <Whatsapp />
    
    <WhyIntegrations />
  </main>
</template>