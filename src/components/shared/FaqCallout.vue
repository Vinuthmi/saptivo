<template>
  <aside class="faq-callout" aria-label="Still have questions?">
    <div class="faq-callout-copy">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div class="faq-callout-actions">
      <router-link class="faq-callout-primary" :to="primaryTo">{{ primaryLabel }}</router-link>
      <router-link class="faq-callout-secondary" :to="secondaryTo">{{ secondaryLabel }}</router-link>
    </div>
  </aside>
</template>

<script setup>
defineOptions({ name: 'FaqCallout' })

defineProps({
  title: { type: String, default: 'Still have questions?' },
  description: { type: String, default: 'Start free for 14 days with no credit card, or talk to our team about plans and Enterprise.' },
  primaryLabel: { type: String, default: 'Start your free trial' },
  primaryTo: { type: String, default: '/demo/' },
  secondaryLabel: { type: String, default: 'Talk to sales' },
  secondaryTo: { type: String, default: '/contact/' },
})
</script>
