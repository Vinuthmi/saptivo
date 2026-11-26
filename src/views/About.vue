<template>
  <main class="about-page">
    <HeroSection />
    <SE1/>
    <SE2/>
    <SE3/>
    <SE4/>
    <SE5/>
    <SE6/>
    <SE7/>
  </main>
</template>

<script setup>
import HeroSection from '@/components/About/HeroSection.vue'
import SE1 from '@/components/About/SE1.vue';
import SE2 from '@/components/About/SE2.vue';
import SE3 from '@/components/About/SE3.vue';
import SE4 from '@/components/About/SE4.vue';
import SE5 from '@/components/About/SE5.vue';
import SE6 from '@/components/About/SE6.vue';
import SE7 from '@/components/About/SE7.vue';
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #fff;
}
</style>
