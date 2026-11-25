<template>
  <section ref="rootEl" class="sv" :class="{ 'sv-js': mounted, 'sv-in': revealed }" aria-labelledby="sv-title">
    <div class="sv-wrap">
      <div class="sv-copy">
        <h2 id="sv-title" class="sv-title">What you save by <em>moving to Saptivo</em></h2>
        <p class="sv-p">Consider what you pay today for separate tools: a contact database, an invoicing tool, a help desk, a WhatsApp solution and the spreadsheets that hold them together.</p>
        <p class="sv-p">Add the hours your team spends copying data between them and the enquiries that slip through.</p>
      </div>

      <div class="sv-stage" aria-hidden="true">
        <!-- the patchwork -->
        <ul class="sv-tools">
          <li v-for="(t, i) in tools" :key="t" class="sv-tool" :style="{ '--i': i }"><i></i>{{ t }}</li>
          <li class="sv-tool sv-lost" :style="{ '--i': 5 }">Hours lost copying data</li>
          <li class="sv-tool sv-lost" :style="{ '--i': 6 }">Enquiries that slip through</li>
        </ul>

        <span class="sv-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>

        <!-- one system -->
        <div class="sv-one">
          <span class="sv-logo">Saptivo</span>
          <p class="sv-statement">Saptivo replaces that patchwork with one subscription, one login and one source of truth.</p>
          <ul class="sv-tags">
            <li>One subscription</li>
            <li>One login</li>
            <li>One source of truth</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'SavingsSection' })
/**
 * SectionSavings.vue — "What you save by moving to Saptivo": copy on the left; on the right an ash panel where the
 * patchwork of separate tools flows into one dark Saptivo card. Vue 3, <script setup>. No images. SSR safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const tools = ['Contact database', 'Invoicing tool', 'Help desk', 'WhatsApp solution', 'Spreadsheets']

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
let io = null
onMounted(() => {
  mounted.value = true
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.15 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
.sv, .sv * { box-sizing: border-box; }
.sv { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.sv-wrap {
  max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 110px) clamp(16px, 3vw, 32px);
  display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: clamp(28px, 5vw, 72px); align-items: center;
}
.sv-title {
  margin: 0; padding-bottom: 0.12em; max-width: 12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.sv .sv-title { color: #0f172a !important; }
.sv-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}
.sv-p { margin: 18px 0 0; max-width: 32em; font-size: clamp(15px, 1.15vw, 17px); line-height: 1.7; }
.sv .sv-p { color: #64748b !important; }

/* ---------- stage ---------- */
.sv-stage {
  display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: clamp(10px, 1.6vw, 22px);
  padding: clamp(18px, 2.4vw, 36px); border-radius: 28px; background: linear-gradient(140deg, #f3f3f5 0%, #e1e1e6 100%);
}
.sv-tools { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.sv-tool {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; background: #fff; border: 1px solid #e4e4e9;
  font-size: clamp(12.5px, 1vw, 14px); font-weight: 500; color: #3f3f46;
}
.sv-tool i { flex: none; width: 8px; height: 8px; border-radius: 50%; background: #a1a1aa; }
.sv-tool:nth-child(odd) { translate: -6px 0; }
.sv-tool:nth-child(even) { translate: 6px 0; }
.sv-lost { background: transparent; border: 1px dashed #a1a1aa; color: #71717a; font-style: italic; }
.sv-lost::before { content: '×'; font-style: normal; font-weight: 700; color: #71717a; }

.sv-arrow { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: #17172b; color: #fff; }
.sv-arrow svg { width: 20px; height: 20px; }

.sv-one {
  align-self: stretch; display: flex; flex-direction: column; padding: clamp(18px, 1.8vw, 26px); border-radius: 22px;
  background: linear-gradient(150deg, #2c2c31 0%, #19191c 100%); box-shadow: 0 30px 50px -28px rgba(0, 0, 0, 0.6);
}
.sv-logo { font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(22px, 2vw, 30px); font-weight: 600; letter-spacing: -0.03em; }
.sv .sv-logo { color: #fff !important; }
.sv-statement { margin: 10px 0 0; font-size: clamp(13px, 1vw, 14.5px); line-height: 1.55; }
.sv .sv-statement { color: rgba(255, 255, 255, 0.82) !important; }
.sv-tags { margin: auto 0 0; padding: 18px 0 0; list-style: none; display: flex; flex-wrap: wrap; gap: 6px; }
.sv-tags li { padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.08); font-size: 12px; font-weight: 500; color: #fff; }

/* ---------- reveal ---------- */
.sv-js .sv-copy > *, .sv-js .sv-stage { opacity: 0; translate: 0 24px; }
.sv-in .sv-copy > *, .sv-in .sv-stage { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sv-in .sv-copy > :nth-child(2) { transition-delay: 0.08s; }
.sv-in .sv-copy > :nth-child(3) { transition-delay: 0.16s; }
.sv-in .sv-stage { transition-delay: 0.15s; }
.sv-js .sv-tool { opacity: 0; }
.sv-in .sv-tool { opacity: 1; transition: opacity 0.6s ease; transition-delay: calc(0.35s + var(--i) * 0.07s); }

@media (max-width: 900px) {
  .sv-wrap { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 560px) {
  .sv-stage { grid-template-columns: minmax(0, 1fr); }
  .sv-arrow { rotate: 90deg; justify-self: center; }
  .sv-tool:nth-child(odd), .sv-tool:nth-child(even) { translate: 0 0; }
}
@media (prefers-reduced-motion: reduce) {
  .sv-js .sv-copy > *, .sv-js .sv-stage, .sv-js .sv-tool { opacity: 1; translate: 0 0; }
  .sv * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>