
<template>
  <main>
    <SiteHeader />
    <HeroSection />
    <Section1 />
    <Section2 />
    <Section3 />
    <Section4 />
    <Section5 />
    <Section10 />
    <Section6 />
    <Section9 />

    <SiteFooter />
  </main>
</template>

<script setup>
import HeroSection from "./components/home/herosection.vue";
import Section1 from "./components/home/section1.vue";
import Section2 from "./components/home/section2.vue";
import Section3 from "./components/home/section3.vue";
import Section4 from "./components/home/section4.vue";
import Section5 from "./components/home/section5.vue";
import Section6 from "./components/home/section6.vue";
import Section9 from "./components/home/section9.vue";
import Section10 from "./components/home/section10.vue";
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
