<template>
  <section ref="rootEl" class="ci" :class="{ 'ci-js': mounted, 'ci-in': revealed }" aria-labelledby="ci-title">
    <div class="ci-wrap">
      <div class="ci-panel">
        <!-- left: copy -->
        <div class="ci-copy">
          <h2 id="ci-title" class="ci-title">Secure cloud <em>infrastructure</em></h2>
          <p class="ci-lead">Saptivo runs on enterprise-grade cloud infrastructure with encrypted connections between your browser and our servers, regular backups and continuous monitoring.</p>

          <ul class="ci-tags">
            <li v-for="t in tags" :key="t">{{ t }}</li>
          </ul>

          <div class="ci-note">
            <span class="ci-nico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4.5 6v5.5c0 4.5 3 7.7 7.5 9.5 4.5-1.8 7.5-5 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>
            </span>
            <p>Updates and security patches are applied automatically, so you are always on the latest, most secure version without lifting a finger.</p>
          </div>
        </div>

        <!-- right: photo + floating status card -->
        <div class="ci-art">
          <img v-if="!failed" class="ci-img" :src="photo" alt="" loading="lazy" decoding="async" draggable="false" @error="failed = true" />
          <span class="ci-shade" aria-hidden="true"></span>

          <div class="ci-card" aria-hidden="true">
            <div class="ci-ch"><i class="ci-live"></i><b>System status</b><small>All systems operational</small></div>
            <ul class="ci-rows">
              <li v-for="r in status" :key="r.k">
                <span class="ci-rico" v-html="r.icon"></span>
                <span class="ci-rt"><strong>{{ r.k }}</strong><small>{{ r.s }}</small></span>
                <em class="ci-ok">✓</em>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'CloudInfrastructure' })
/**
 * SectionCloudInfrastructure.vue — "Secure cloud infrastructure": a big rounded ash panel, copy + tags + a note on the
 * left, a photo with a floating "System status" card on the right. Vue 3, <script setup>.
 * The photo falls back to a dark gradient if the URL fails — swap `photo` for your own image. SSR safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const photo = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=80&auto=format&fit=crop'
const failed = ref(false)

const tags = ['Encrypted connections', 'Regular backups', 'Continuous monitoring', 'Automatic patches']

const ic = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const status = [
  { k: 'Encrypted connection', s: 'Browser to server', icon: ic('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>') },
  { k: 'Backups', s: 'Running regularly', icon: ic('<path d="M3.5 12a8.500 8.500 0 1 0 2.600-6.100L3.500 8.500"/><path d="M3.500 3.500v5h5M12 7.500V12l3 2"/>') },
  { k: 'Monitoring', s: 'Continuous', icon: ic('<path d="M3 12h4l2.500-6 4 12 2.500-6H21"/>') },
  { k: 'Version', s: 'Latest, patched automatically', icon: ic('<path d="M12 4v10M7.500 9.500 12 14l4.500-4.500"/><path d="M5 19h14"/>') },
]

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
.ci, .ci * { box-sizing: border-box; }
.ci { --edge: clamp(10px, 1.3vw, 24px); font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.ci-wrap { padding: clamp(24px, 4vw, 56px) var(--edge); }

.ci-panel {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(20px, 3vw, 48px); align-items: stretch;
  padding: clamp(14px, 1.8vw, 28px); border-radius: clamp(18px, 2.4vw, 36px); background: #efeff1;
}
.ci-copy { display: flex; flex-direction: column; padding: clamp(14px, 3vw, 56px) clamp(8px, 2vw, 40px); }
.ci-title {
  margin: 0; padding-bottom: 0.12em; max-width: 12em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.ci .ci-title { color: #0f172a !important; }
.ci-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}
.ci-lead { margin: 16px 0 0; max-width: 32em; font-size: clamp(15px, 1.15vw, 17px); line-height: 1.65; color: #64748b; }

.ci-tags { margin: clamp(20px, 2.4vw, 32px) 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 8px; }
.ci-tags li { padding: 8px 16px; border-radius: 999px; background: #fff; border: 1px solid #e4e4e9; font-size: 13px; font-weight: 500; color: #0f172a; }

.ci-note { margin-top: auto; padding-top: clamp(24px, 3vw, 48px); }
.ci-note { display: flex; gap: 16px; align-items: flex-start; }
.ci-nico { flex: none; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 50%; background: #0f172a; color: #fff; }
.ci-nico svg { width: 22px; height: 22px; }
.ci-note p { margin: 0; max-width: 28em; font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(17px, 1.5vw, 22px); font-weight: 500; line-height: 1.35; letter-spacing: -0.02em; color: #0f172a; }

/* ---------- art ---------- */
.ci-art {
  position: relative; isolation: isolate; overflow: hidden; min-height: clamp(380px, 38vw, 580px);
  border-radius: clamp(14px, 1.8vw, 26px); background: linear-gradient(150deg, #3b3f4a, #15171c); display: flex; align-items: flex-end; justify-content: center;
  padding: clamp(14px, 2vw, 28px);
}
.ci-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ci-art:hover .ci-img { scale: 1.04; }
.ci-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(8, 10, 14, 0.1) 30%, rgba(8, 10, 14, 0.55) 100%); }

.ci-card { width: min(420px, 100%); padding: 16px; border-radius: 18px; background: rgba(255, 255, 255, 0.97); box-shadow: 0 30px 50px -26px rgba(0, 0, 0, 0.6); }
.ci-ch { display: flex; align-items: center; gap: 9px; padding-bottom: 12px; border-bottom: 1px solid #eef0f3; }
.ci-ch b { font-size: 14px; font-weight: 600; }
.ci-ch small { margin-left: auto; font-size: 11.5px; color: #15803d; font-weight: 600; }
.ci-live { width: 9px; height: 9px; border-radius: 50%; background: #15803d; box-shadow: 0 0 0 4px rgba(21, 128, 61, 0.2); }
.ci-rows { margin: 0; padding: 4px 0 0; list-style: none; }
.ci-rows li { display: flex; align-items: center; gap: 12px; padding: 10px 0; }
.ci-rows li + li { border-top: 1px solid #f3f4f6; }
.ci-rico { flex: none; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #f4f4f6; color: #0f172a; }
.ci-rico svg { width: 18px; height: 18px; }
.ci-rt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.ci-rt strong { font-size: 13.5px; font-weight: 600; }
.ci-rt small { font-size: 12px; color: #94a3b8; }
.ci-ok { flex: none; display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: #15803d; color: #fff; font-style: normal; font-size: 11px; }

/* ---------- reveal ---------- */
.ci-js .ci-copy > *, .ci-js .ci-art { opacity: 0; translate: 0 22px; }
.ci-in .ci-copy > *, .ci-in .ci-art { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ci-in .ci-copy > :nth-child(2) { transition-delay: 0.06s; }
.ci-in .ci-copy > :nth-child(3) { transition-delay: 0.12s; }
.ci-in .ci-copy > :nth-child(4) { transition-delay: 0.18s; }
.ci-in .ci-art { transition-delay: 0.15s; }

@media (max-width: 900px) {
  .ci-panel { grid-template-columns: 1fr; }
  .ci-art { min-height: 420px; }
}
@media (prefers-reduced-motion: reduce) {
  .ci-js .ci-copy > *, .ci-js .ci-art { opacity: 1; translate: 0 0; }
  .ci * { transition: none !important; }
}
</style>