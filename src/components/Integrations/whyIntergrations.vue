<template>
  <section ref="rootEl" class="iw" :class="{ 'iw-js': mounted, 'iw-in': revealed }" aria-labelledby="iw-title">
    <div class="iw-wrap">
      <div class="iw-head">
        <div class="iw-left">
          <h2 id="iw-title" class="iw-title">Why integrations matter for your <em>CRM</em></h2>
          <p class="iw-lead">A CRM is only as good as the data inside it.</p>
        </div>

        <ul class="iw-points">
          <li v-for="p in points" :key="p.h" class="iw-point">
            <span class="iw-ico" v-html="p.icon"></span>
            <div>
              <h3 class="iw-h">{{ p.h }}</h3>
              <p class="iw-p">{{ p.p }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- stage: soft gradient backdrop with two floating CRM cards -->
      <div class="iw-stage">
        <span class="iw-blob iw-b1" aria-hidden="true"></span>
        <span class="iw-blob iw-b2" aria-hidden="true"></span>
        <span class="iw-blob iw-b3" aria-hidden="true"></span>

        <div class="iw-card iw-c1">
          <div class="iw-ch"><b>Lead inbox</b><small>Today</small></div>
          <ul class="iw-rows">
            <li v-for="r in inbox" :key="r.t" class="iw-row">
              <i class="iw-lg" v-html="r.logo"></i>
              <span class="iw-rt"><strong>{{ r.t }}</strong><small>{{ r.s }}</small></span>
              <em class="iw-chip">Logged</em>
            </li>
          </ul>
        </div>

        <div class="iw-card iw-c2">
          <div class="iw-ch"><b>Follow-ups</b><small>On the right calendar</small></div>
          <ul class="iw-rows">
            <li v-for="r in follow" :key="r.t" class="iw-row">
              <i class="iw-lg" v-html="r.logo"></i>
              <span class="iw-rt"><strong>{{ r.t }}</strong><small>{{ r.s }}</small></span>
              <em class="iw-time">{{ r.time }}</em>
            </li>
          </ul>
          <div class="iw-foot"><span class="iw-ok">✓</span>Nothing copied in by hand</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'IntegrationsWhy' })
/**
 * SectionIntegrationsWhy.vue — "Why integrations matter for your CRM"
 * Vue 3, <script setup>. Heading + lead on the left, two points on the right, then a stage with two floating
 * CRM cards on a soft gradient (no external images, so it never breaks). Logos are own drawings. SSR safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const L = {
  wa: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#25d366"/><path d="M12 5.4a6.6 6.6 0 0 0-5.7 9.9L5.4 18.6l3.4-.9A6.6 6.6 0 1 0 12 5.4z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.6 9.3c.3 1.7 2 3.5 3.8 4l.9-1-1.4-.9-.6.5c-.7-.3-1.4-1-1.7-1.7l.5-.6-.9-1.4z" fill="#fff"/></svg>',
  fb: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877f2"/><path d="M13.3 20.5v-6.7h2.3l.4-2.7h-2.7V9.4c0-.8.3-1.4 1.5-1.4h1.3V5.6c-.2 0-1-.1-1.9-.1-2.1 0-3.5 1.3-3.5 3.6v2H8.4v2.700h2.300v6.7z" fill="#fff"/></svg>',
  web: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#21759b"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M5.5 12h13M12 5.5c2.2 2.3 2.2 10.7 0 13M12 5.5c-2.2 2.3-2.2 10.7 0 13" fill="none" stroke="#fff" stroke-width="1.4"/></svg>',
  cx: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#0f6cbd"/><text x="12" y="15.2" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="8.6" font-weight="700" fill="#fff">3CX</text></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="19" rx="4" fill="#fff" stroke="#4285f4" stroke-width="1.8"/><path d="M2 8.5h20V7a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4z" fill="#4285f4"/><text x="12" y="19" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="9" font-weight="700" fill="#4285f4">31</text></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#71717a"/><rect x="5" y="7" width="14" height="10" rx="2" fill="none" stroke="#fff" stroke-width="1.6"/><path d="m5.8 8.5 6.2 4.8 6.2-4.8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>',
}

const points = [
  {
    h: 'Copied in by hand',
    p: "When enquiries, calls and chats have to be copied in by hand, they often aren't, and your reports quietly stop telling the truth.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.01"/></svg>',
  },
  {
    h: 'Integrations remove that gap',
    p: "Every lead is captured, every conversation is logged and every follow-up appears on the right calendar, without relying on anyone's memory.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8L16.3 9.5"/></svg>',
  },
]

const inbox = [
  { t: 'WhatsApp enquiry', s: 'New chat from a customer', logo: L.wa },
  { t: 'Facebook lead', s: 'Lead form submitted', logo: L.fb },
  { t: 'Website form', s: 'Quote request', logo: L.web },
  { t: '3CX call', s: 'Inbound call, notes saved', logo: L.cx },
]
const follow = [
  { t: 'Call back the customer', s: 'Added to calendar', time: '10:30', logo: L.cal },
  { t: 'Technician visit', s: 'Added to calendar', time: '14:00', logo: L.cal },
  { t: 'Send quotation', s: 'Email synced', time: '16:15', logo: L.mail },
]

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
let io = null
onMounted(() => {
  mounted.value = true
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.12 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
.iw, .iw * { box-sizing: border-box; }
.iw { font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; }
.iw { --edge: clamp(10px, 1.3vw, 24px); --pad: clamp(20px, 4vw, 96px); }
.iw-wrap { max-width: none; margin: 0; padding: clamp(56px, 8vw, 110px) var(--edge); }
.iw-head { padding-inline: calc(var(--pad) - var(--edge)); }

.iw-head { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: clamp(28px, 6vw, 96px); align-items: start; }

.iw-title {
  margin: 0; padding-bottom: 0.12em; max-width: 20em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(30px, 4vw, 58px); font-weight: 500; line-height: 1.08; letter-spacing: -0.055em; text-wrap: balance;
}
.iw .iw-title { color: #0f172a !important; }
.iw-title em {
  font-style: normal;
  background: linear-gradient(100deg, #a1a1aa 0%, #8b8b93 50%, #6f6f78 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent !important; -webkit-text-fill-color: transparent !important;
}
.iw-lead { margin: 18px 0 0; max-width: 24em; font-size: clamp(15px, 1.15vw, 17px); line-height: 1.6; color: #64748b; }

.iw-points { margin: 6px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 26px; }
.iw-point { display: flex; gap: 16px; align-items: flex-start; }
.iw-ico {
  flex: none; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%;
  background: #eef3f8; color: #0f172a;
}
.iw-ico svg { width: 20px; height: 20px; }
.iw-h {
  margin: 0; font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(21px, 1.9vw, 28px); font-weight: 600; letter-spacing: -0.03em; line-height: 1.15;
}
.iw .iw-h { color: #0f172a !important; }
.iw-p { margin: 8px 0 0; max-width: 30em; font-size: clamp(14px, 1.05vw, 15.5px); line-height: 1.65; color: #64748b; }

/* ---------- stage ---------- */
.iw-stage {
  position: relative; isolation: isolate; overflow: hidden; margin-top: clamp(32px, 4vw, 56px);
  display: flex; justify-content: center; align-items: center; gap: 20px;
  min-height: clamp(420px, 46vw, 640px); padding: clamp(36px, 6vw, 84px) clamp(16px, 4vw, 48px);
  border-radius: clamp(18px, 2.4vw, 36px);
  background: linear-gradient(180deg, #9dbfe0 0%, #aecbe5 45%, #c3d8ec 100%);
}
.iw-stage::after {
  content: ''; position: absolute; inset: 0; z-index: -1; opacity: 0.35;
  background-image: radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1.4px); background-size: 18px 18px;
}
.iw-blob { position: absolute; z-index: -1; border-radius: 50%; filter: blur(50px); }
.iw-b1 { width: 38%; aspect-ratio: 1.6; left: -6%; bottom: -18%; background: #fff; opacity: 0.85; }
.iw-b2 { width: 34%; aspect-ratio: 1.6; right: -4%; bottom: -16%; background: #fff; opacity: 0.8; }
.iw-b3 { width: 28%; aspect-ratio: 1.6; left: 36%; top: -14%; background: #e6f0f9; opacity: 0.75; }

.iw-card {
  flex: 1 1 0; max-width: 460px; min-width: 0; padding: 18px; border-radius: 20px;
  background: rgba(255, 255, 255, 0.96); box-shadow: 0 30px 60px -28px rgba(30, 60, 100, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.7);
}
.iw-c2 { margin-top: 44px; }
.iw-ch { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 2px 4px 12px; border-bottom: 1px solid #eef0f3; }
.iw-ch b { font-size: 14.5px; font-weight: 600; color: #0f172a; }
.iw-ch small { font-size: 12px; color: #94a3b8; }
.iw-rows { margin: 0; padding: 6px 0 0; list-style: none; }
.iw-row { display: flex; align-items: center; gap: 12px; padding: 10px 4px; }
.iw-row + .iw-row { border-top: 1px solid #f3f4f6; }
.iw-lg { flex: none; display: block; width: 32px; height: 32px; }
.iw-lg svg { display: block; width: 100%; height: 100%; }
.iw-rt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.iw-rt strong { font-size: 13.5px; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.iw-rt small { font-size: 12px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.iw-chip { flex: none; font-style: normal; font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: #e8f7ee; color: #15803d; }
.iw-time { flex: none; font-style: normal; font-size: 12.5px; font-weight: 600; color: #0f172a; }
.iw-foot {
  margin-top: 8px; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px;
  background: #f6f7f9; font-size: 12.5px; font-weight: 500; color: #3f3f46;
}
.iw-ok { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: #15803d; color: #fff; font-size: 11px; }

/* ---------- reveal ---------- */
.iw-js .iw-title, .iw-js .iw-lead, .iw-js .iw-point, .iw-js .iw-stage { opacity: 0; translate: 0 22px; }
.iw-in .iw-title, .iw-in .iw-lead, .iw-in .iw-point, .iw-in .iw-stage {
  opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.iw-in .iw-title { transition-delay: 0.06s; }
.iw-in .iw-lead { transition-delay: 0.12s; }
.iw-in .iw-point:nth-child(1) { transition-delay: 0.14s; }
.iw-in .iw-point:nth-child(2) { transition-delay: 0.22s; }
.iw-in .iw-stage { transition-delay: 0.3s; }
.iw-js .iw-card { opacity: 0; translate: 0 30px; }
.iw-in .iw-card { opacity: 1; translate: 0 0; transition: opacity 0.9s ease, translate 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
.iw-in .iw-c1 { transition-delay: 0.5s; }
.iw-in .iw-c2 { transition-delay: 0.65s; }

@media (max-width: 860px) {
  .iw-head { grid-template-columns: 1fr; gap: 28px; }
  .iw-title { max-width: none; }
}
@media (max-width: 700px) {
  .iw-stage { flex-direction: column; }
  .iw-card { width: 100%; max-width: none; }
  .iw-c2 { margin-top: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .iw-js .iw-title, .iw-js .iw-lead, .iw-js .iw-point, .iw-js .iw-stage, .iw-js .iw-card { opacity: 1; translate: 0 0; }
  .iw * { transition: none !important; }
}
</style>