<template>
  <section ref="rootEl" class="is" :class="{ 'is-js': mounted, 'is-in': revealed }" aria-labelledby="is-title">
    <div class="is-wrap">
      <div class="is-panel">
        <span class="is-blob is-b1" aria-hidden="true"></span>
        <span class="is-blob is-b2" aria-hidden="true"></span>

        <!-- text -->
        <div class="is-copy">
          <h2 id="is-title" class="is-title">Setting up <em>integrations</em></h2>
          <p class="is-lead">Most integrations are switched on from Saptivo's settings in a few minutes.</p>

          <div class="is-assist">
            <span class="is-aico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"/><circle cx="10" cy="8" r="3.5"/><path d="m16 11 2 2 4-4"/></svg>
            </span>
            <p>For the WhatsApp Business API and 3CX, our onboarding team helps you connect your number and map your extensions so everything works on day one.</p>
          </div>
        </div>

        <!-- mock settings window -->
        <div class="is-win" role="img" aria-label="Saptivo integration settings">
          <div class="is-wh"><span class="is-dots"><i></i><i></i><i></i></span><b>Settings · Integrations</b></div>

          <ul class="is-list">
            <li v-for="(r, i) in rows" :key="r.t" class="is-row" :style="{ '--i': i }">
              <i class="is-lg" v-html="r.logo"></i>
              <span class="is-rt"><strong>{{ r.t }}</strong><small>{{ r.s }}</small></span>
              <span v-if="r.assist" class="is-badge">With our team</span>
              <span v-else class="is-sw" aria-hidden="true"><i></i></span>
            </li>
          </ul>

          <div class="is-done"><span class="is-ok">✓</span><b>Everything works on day one</b></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'IntegrationsSetup' })
/**
 * SectionIntegrationsSetup.vue — "Setting up integrations"
 * Vue 3, <script setup>. A rounded gradient panel: copy on the left, a mock "Settings · Integrations" window on
 * the right where self-serve integrations flip on and the WhatsApp / 3CX rows carry a "With our team" badge.
 * No external images. Logos are own drawings. SSR safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const L = {
  fb: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877f2"/><path d="M13.3 20.5v-6.7h2.3l.4-2.7h-2.7V9.4c0-.8.3-1.4 1.5-1.4h1.3V5.6c-.2 0-1-.1-1.9-.1-2.1 0-3.5 1.3-3.5 3.6v2H8.4v2.7h2.3v6.7z" fill="#fff"/></svg>',
  web: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#21759b"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M5.5 12h13M12 5.5c2.2 2.3 2.2 10.7 0 13M12 5.5c-2.2 2.3-2.2 10.7 0 13" fill="none" stroke="#fff" stroke-width="1.4"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="19" rx="4" fill="#fff" stroke="#4285f4" stroke-width="1.8"/><path d="M2 8.5h20V7a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4z" fill="#4285f4"/><text x="12" y="19" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="9" font-weight="700" fill="#4285f4">31</text></svg>',
  wa: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#25d366"/><path d="M12 5.4a6.6 6.6 0 0 0-5.7 9.9L5.4 18.6l3.4-.9A6.6 6.6 0 1 0 12 5.4z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.6 9.3c.3 1.7 2 3.5 3.8 4l.9-1-1.4-.9-.6.5c-.7-.3-1.4-1-1.7-1.7l.5-.6-.9-1.4z" fill="#fff"/></svg>',
  cx: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#0f6cbd"/><text x="12" y="15.2" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="8.6" font-weight="700" fill="#fff">3CX</text></svg>',
}

const rows = [
  { t: 'Website forms', s: 'Switched on in settings', logo: L.web },
  { t: 'Facebook leads', s: 'Switched on in settings', logo: L.fb },
  { t: 'Google Calendar', s: 'Switched on in settings', logo: L.cal },
  { t: 'WhatsApp Business API', s: 'We connect your number', logo: L.wa, assist: true },
  { t: '3CX', s: 'We map your extensions', logo: L.cx, assist: true },
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
.is, .is * { box-sizing: border-box; }
.is { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.is { --edge: clamp(10px, 1.3vw, 24px); }
.is-wrap { max-width: none; margin: 0; padding: clamp(24px, 4vw, 56px) var(--edge); }

.is-panel {
  position: relative; isolation: isolate; overflow: hidden;
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: clamp(28px, 5vw, 80px); align-items: center;
  min-height: clamp(480px, 50vw, 700px); padding: clamp(32px, 5.5vw, 88px) clamp(20px, 4vw, 96px);
  border-radius: clamp(18px, 2.4vw, 36px);
  background: linear-gradient(160deg, #e7e7ea 0%, #d9d9de 55%, #cdcdd3 100%);
}
.is-blob { position: absolute; z-index: -1; border-radius: 50%; filter: blur(60px); }
.is-b1 { width: 30%; aspect-ratio: 1; left: 30%; top: -20%; background: #fff; opacity: 0.55; }
.is-b2 { width: 26%; aspect-ratio: 1; left: -6%; bottom: -16%; background: #fff; opacity: 0.35; }

.is-title {
  margin: 0; padding-bottom: 0.12em; max-width: 20em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.is .is-title { color: #000 !important; -webkit-text-fill-color: #000 !important; }
.is-title em { font-style: normal; color: #000 !important; -webkit-text-fill-color: #000 !important; }
.is-lead { margin: 16px 0 0; max-width: 26em; font-size: clamp(15px, 1.2vw, 18px); line-height: 1.6; color: #475569; }

.is-assist {
  margin-top: clamp(22px, 2.6vw, 34px); display: flex; gap: 14px; align-items: flex-start;
  padding: 16px 18px; border-radius: 18px; background: rgba(255, 255, 255, 0.78); max-width: 30em;
}
.is-assist p { margin: 0; font-size: clamp(13.5px, 1vw, 15px); line-height: 1.65; color: #475569; }
.is-aico { flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: #0f172a; color: #fff; }
.is-aico svg { width: 19px; height: 19px; }

/* ---------- mock window ---------- */
.is-win {
  min-width: 0; padding: 16px; border-radius: 22px; background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 40px 70px -34px rgba(40, 40, 50, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.8);
}
.is-wh { display: flex; align-items: center; gap: 12px; padding: 2px 4px 12px; border-bottom: 1px solid #eef0f3; }
.is-wh b { font-size: 13.5px; font-weight: 600; color: #0f172a; }
.is-dots { display: flex; gap: 5px; }
.is-dots i { width: 9px; height: 9px; border-radius: 50%; background: #e4e4e9; }
.is-list { margin: 0; padding: 4px 0 0; list-style: none; }
.is-row { display: flex; align-items: center; gap: 12px; padding: 11px 4px; }
.is-row + .is-row { border-top: 1px solid #f3f4f6; }
.is-lg { flex: none; display: block; width: 34px; height: 34px; }
.is-lg svg { display: block; width: 100%; height: 100%; }
.is-rt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.is-rt strong { font-size: 14px; font-weight: 600; color: #0f172a; }
.is-rt small { font-size: 12px; color: #94a3b8; }
.is-badge { flex: none; font-size: 11.5px; font-weight: 600; padding: 5px 11px; border-radius: 999px; background: #f1f1f3; color: #52525b; }

.is-sw { flex: none; position: relative; width: 38px; height: 22px; border-radius: 999px; background: #d4d4d8; transition: background 0.4s ease; }
.is-sw i { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); transition: translate 0.4s cubic-bezier(0.3, 1.4, 0.5, 1); }
.is-in .is-sw { background: #71717a; transition-delay: calc(0.7s + var(--i) * 0.18s); }
.is-in .is-sw i { translate: 16px 0; transition-delay: calc(0.7s + var(--i) * 0.18s); }

.is-done {
  margin-top: 6px; display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 14px;
  background: #f6f7f9; font-size: 13px; color: #0f172a;
}
.is-done b { font-weight: 600; }
.is-ok { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #15803d; color: #fff; font-size: 12px; }

/* ---------- reveal ---------- */
.is-js .is-copy > *, .is-js .is-win { opacity: 0; translate: 0 22px; }
.is-in .is-copy > *, .is-in .is-win { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.is-in .is-copy > :nth-child(2) { transition-delay: 0.06s; }
.is-in .is-copy > :nth-child(3) { transition-delay: 0.12s; }
.is-in .is-copy > :nth-child(4) { transition-delay: 0.18s; }
.is-in .is-win { transition-delay: 0.25s; }

@media (max-width: 900px) {
  .is-panel { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .is-js .is-copy > *, .is-js .is-win { opacity: 1; translate: 0 0; }
  .is * { transition: none !important; }
  .is-sw { background: #71717a; } .is-sw i { translate: 16px 0; }
}
</style>