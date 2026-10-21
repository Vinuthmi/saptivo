
<template>
  <main>
    <SiteHeader />
    <HeroSection />
    <Section5 />
    <SiteFooter />
  </main>
</template>

<script setup>
import HeroSection from "./components/home/herosection.vue";
import Section5 from "./components/home/section5.vue";
import SiteHeader from "./components/home/siteHeader.vue";
import SiteFooter from "./components/home/siteFooter.vue";
</script>
<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
</style>
