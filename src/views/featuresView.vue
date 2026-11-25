<template>
  <main class="features-page">
    <HeroSection />
    <Section1 />
    <Section2 />
    <Section3 />
    <Section4 />
    <Section5 />
    <Section6 />
    <Section7 />
    <Section8 />
  </main>
</template>

<script setup>
import HeroSection from '../components/Features/HeroSection.vue'
import Section1 from '../components/Features/Section1.vue'
import Section2 from '../components/Features/Section2.vue';
import Section3 from '../components/Features/Section3.vue';
import Section4 from '../components/Features/Section4.vue';
import Section5 from '../components/Features/Section5.vue';
import Section6 from '../components/Features/Section6.vue';
import Section7 from '../components/Features/Section7.vue';
import Section8 from '../components/Features/Section8.vue';

</script>

<style scoped>
.features-page > :deep(section) {
  background: #fff !important;
}

.features-page :deep(h1),
.features-page :deep(h2),
.features-page :deep(h1 span),
.features-page :deep(h2 span) {
  color: #111 !important;
  -webkit-text-fill-color: #111 !important;
  background: none !important;
  background-image: none !important;
}

.features-page :deep(h1 .accent),
.features-page :deep(h1 .blue),
.features-page :deep(h1 .blue-text),
.features-page :deep(h1 .primary),
.features-page :deep(h1 .grad),
.features-page :deep(h2 .soft),
.features-page :deep(h2 .l2),
.features-page :deep(h2 .accent),
.features-page :deep(h2 .blue),
.features-page :deep(h2 .blue-text),
.features-page :deep(h2 .primary),
.features-page :deep(h2 .grad) {
  color: #8a8f97 !important;
  -webkit-text-fill-color: #8a8f97 !important;
}
</style>