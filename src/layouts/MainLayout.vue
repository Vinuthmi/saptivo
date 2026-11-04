<template>
  <div class="main-layout">
    <SiteHeader />

    <router-view />

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '../components/home/siteHeader.vue'
import SiteFooter from '../components/home/siteFooter.vue'
</script>