<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Section1 from '../components/home/section1.vue'
import Section2 from '../components/home/section2.vue'
import Section3 from '../components/home/section3.vue'
import Section4 from '../components/home/section4.vue'
import Section5 from '../components/home/section5.vue'
import Section6 from '../components/home/section6.vue'
import Section9 from '../components/home/section9.vue'



const route = useRoute()
const isSection2Preview = computed(() => route.query.preview === 'section2')
const isSection6Preview = computed(() => route.query.preview === 'section6')
</script>

<template>
  <main>
    <Section6 v-if="isSection6Preview" preview />
    <template v-else>
      <Section1 v-if="!isSection2Preview" />
      <Section2 :preview="isSection2Preview" />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 preview />
      <Section9 />
      
    </template>
  </main>
</template>
