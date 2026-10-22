<script setup>
import { RouterView } from 'vue-router'
import SiteHeader from './components/home/siteHeader.vue'
import SiteFooter from './components/home/siteFooter.vue'
</script>

<template>
  <SiteHeader />
  <RouterView />
  <SiteFooter />
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
</style>
