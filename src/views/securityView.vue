<script setup>
import securityhero from '@/components/security/securityhero.vue'
import securityfeatures from '@/components/security/securityfeatures.vue'
import privacy from '@/components/security/privacy.vue'
import cloud from '@/components/security/cloud.vue'
import securitycontrols from '@/components/security/securitycontrols.vue'
import securityfaq from '@/components/security/securityfaq.vue'

</script>

<template>
  <main class="integrations-page">
    <securityhero />
    <securityfeatures />
    <privacy />
    <cloud />
    <securitycontrols />
    <securityfaq />
  </main>
</template>