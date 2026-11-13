<template>
  <section ref="root" class="wi" :class="{ 'wi-arm': armed, 'wi-in': shown }" aria-labelledby="wi-title">
    <div class="wi-wrap">
      <header class="wi-head">
        <h2 id="wi-title" class="wi-h">Why integrations matter for your CRM</h2>
        <p class="wi-intro">
          A CRM is only as good as the data inside it. When enquiries, calls and chats have to be copied in by hand,
          they often aren't, and your reports quietly stop telling the truth. Integrations remove that gap. Every lead
          is captured, every conversation is logged and every follow-up appears on the right calendar, without relying
          on anyone's memory.
        </p>
      </header>

      <div class="wi-body">
        <!-- ============ cards ============ -->
        <div class="wi-cards" aria-hidden="true">
          <div class="wi-card wi-a">
            <span class="wi-grain"></span>
            <div class="pn">
              <div class="pn-h"><b>Incoming</b><em>Auto-synced</em></div>
              <ul class="src">
                <li v-for="(s, i) in items" :key="s.src" :class="{ on: active === i }">
                  <i :class="'ic ic' + i"></i>
                  <span>{{ s.src }}</span>
                  <u>{{ s.when }}</u>
                </li>
              </ul>
            </div>
          </div>

          <div class="wi-card wi-b">
            <span class="wi-grain"></span>
            <div class="pn">
              <Transition name="swap" mode="out-in">
                <div :key="active" class="det">
                  <div class="pn-h"><b>{{ items[active].panel }}</b><em class="ok">Done</em></div>
                  <div v-for="r in items[active].rows" :key="r[0]" class="kv">
                    <span>{{ r[0] }}</span><b>{{ r[1] }}</b>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- ============ list ============ -->
        <ul class="wi-list">
          <li v-for="(it, i) in items" :key="it.title" class="wi-item" :class="{ open: active === i }">
            <button type="button" class="wi-btn" :aria-expanded="active === i" @click="pick(i)">
              {{ it.title }}
            </button>
            <div class="wi-more" :style="{ gridTemplateRows: active === i ? '1fr' : '0fr' }">
              <p><span>{{ it.text }}</span></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * SectionWhyIntegrations.vue — "Why integrations matter for your CRM" (Vue 3, <script setup>)
 * Heading + intro, two gradient cards on the left and an accordion list on the right. The list rotates on its own
 * while the section is on screen and can be clicked. The card panels follow the open item. Sample data only.
 * Respects prefers-reduced-motion (no auto-rotate). SSR / Nuxt safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'WhyIntegrationsSection' })

const items = [
  {
    title: 'Every lead is captured',
    text: 'Website forms and enquiries land in Saptivo as leads the moment they arrive, with the source and owner filled in.',
    src: 'Website enquiry',
    when: 'Just now',
    panel: 'Lead created',
    rows: [['Name', 'Nimali Silva'], ['Source', 'Website form'], ['Owner', 'Auto-assigned']],
  },
  {
    title: 'Every conversation is logged',
    text: 'WhatsApp chats and phone calls are saved on the customer timeline, so the whole team sees the full history.',
    src: 'WhatsApp chat',
    when: '2 min ago',
    panel: 'Timeline updated',
    rows: [['Chat', '4 messages'], ['Call', '3:42 · Resolved'], ['Visible to', 'Whole team']],
  },
  {
    title: 'Every follow-up lands on the calendar',
    text: 'Follow-ups and callbacks appear on the right calendar automatically, so nothing depends on anyone\'s memory.',
    src: 'Follow-up call',
    when: 'Fri 10:30',
    panel: 'Follow-up scheduled',
    rows: [['Task', 'Demo call'], ['When', 'Fri · 10:30'], ['Calendar', 'Added']],
  },
]

const root = ref(null)
const armed = ref(false)
const shown = ref(false)
const active = ref(0)
let io = null
let timer = null
let inView = false
let paused = 0

function pick(i) {
  active.value = i
  paused = Date.now() + 9000 // stop auto-rotating for a while after a click
}

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    shown.value = true
    return
  }
  armed.value = true
  io = new IntersectionObserver(
    ([e]) => {
      inView = e.isIntersecting
      if (e.isIntersecting) shown.value = true
    },
    { threshold: 0.25 },
  )
  io.observe(root.value)
  timer = setInterval(() => {
    if (!inView || document.hidden || Date.now() < paused) return
    active.value = (active.value + 1) % items.length
  }, 3600)
})
onBeforeUnmount(() => {
  io?.disconnect()
  clearInterval(timer)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Urbanist:wght@500;600&display=swap');
</style>

<style scoped>
.wi {
  --ink: #0f172a;
  --mute: #6b7280;
  --sky: #c0e6fd;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  margin: clamp(10px, 1.6vw, 28px);
  border-radius: clamp(28px, 3.4vw, 48px);
  padding: clamp(40px, 6vw, 88px) clamp(16px, 3vw, 32px);
  background: #fff;
  color: var(--ink);
  font-family: 'Urbanist', system-ui, sans-serif;
}
.wi *,
.wi *::before,
.wi *::after {
  box-sizing: border-box;
}
.wi-wrap {
  max-width: 1240px;
  margin: 0 auto;
}

/* ---------- heading ---------- */
.wi-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(20px, 4vw, 64px);
  align-items: end;
}
.wi-h {
  margin: 0;
  font-size: clamp(34px, 4.4vw, 60px);
  font-weight: 600;
  line-height: 1.06;
  letter-spacing: -0.05em;
  color: #0a0a0a;
  text-wrap: balance;
}
.wi-intro {
  margin: 0;
  font-size: clamp(15px, 1.15vw, 17px);
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: -0.01em;
  color: #475569;
  text-wrap: pretty;
}

/* ---------- body ---------- */
.wi-body {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(28px, 5vw, 80px);
  align-items: center;
  margin-top: clamp(32px, 4.5vw, 64px);
}

/* cards */
.wi-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(12px, 1.6vw, 20px);
  align-items: start;
}
.wi-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  height: clamp(280px, 27vw, 360px);
  border-radius: clamp(18px, 1.8vw, 24px);
}
.wi-b {
  margin-top: clamp(36px, 5vw, 72px);
}
.wi-a {
  background:
    radial-gradient(72% 56% at 18% -6%, var(--sky) 0%, rgba(192, 230, 253, 0) 70%),
    radial-gradient(90% 46% at 22% 54%, rgba(91, 134, 182, 0.9) 0%, rgba(91, 134, 182, 0) 70%),
    radial-gradient(78% 56% at 86% 106%, rgba(255, 160, 126, 0.8) 0%, rgba(255, 160, 126, 0) 70%),
    linear-gradient(165deg, #a9d3ef 0%, #8fb5da 48%, #d6b9c9 100%);
}
.wi-b {
  background:
    radial-gradient(70% 56% at 84% -6%, #dbe9f8 0%, rgba(219, 233, 248, 0) 70%),
    radial-gradient(70% 56% at 100% 104%, rgba(212, 196, 168, 0.95) 0%, rgba(212, 196, 168, 0) 72%),
    radial-gradient(60% 46% at 8% 100%, rgba(255, 170, 140, 0.7) 0%, rgba(255, 170, 140, 0) 70%),
    linear-gradient(170deg, #b9dcf3 0%, #8fb5da 52%, #e6d9c4 100%);
}
.wi-grain {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.18;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* panel */
.pn {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  width: calc(100% - 28px);
  max-width: 290px;
  padding: 16px 16px 12px;
  border-radius: 16px;
  background: #fff;
  font-family: 'Poppins', system-ui, sans-serif;
  box-shadow: 0 30px 50px -28px rgba(23, 50, 90, 0.45), 0 2px 8px rgba(23, 50, 90, 0.06);
  transform: translate(-50%, -50%);
}
.pn-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 11px;
  border-bottom: 1px solid #f0f1f4;
}
.pn-h b {
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.pn-h em {
  padding: 3px 9px;
  border-radius: 8px;
  background: #e4edff;
  color: #3f63d8;
  font-style: normal;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
}
.pn-h em.ok {
  background: #e6f8ef;
  color: #16a05a;
}
.src {
  list-style: none;
  margin: 0;
  padding: 6px 0 0;
}
.src li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 8px;
  margin: 2px -8px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--mute);
  transition: background 0.4s, color 0.4s;
}
.src li span {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.src li u {
  text-decoration: none;
  font-size: 11px;
  opacity: 0.8;
  white-space: nowrap;
}
.src li.on {
  background: #fff3ec;
  color: var(--ink);
}
.ic {
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 6px;
}
.ic0 { background: #3f6593; }
.ic1 { background: #25d366; }
.ic2 { background: linear-gradient(135deg, #f2540c, #ff9a3d); }
.kv {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 0;
  font-size: 12.5px;
  color: var(--mute);
}
.kv b {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.35s ease, transform 0.4s var(--ease);
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ---------- list ---------- */
.wi-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.wi-item {
  border-top: 1px solid #dcdfe4;
}
.wi-item:first-child {
  border-top: 0;
}
.wi-btn {
  display: block;
  width: 100%;
  padding: clamp(14px, 1.4vw, 20px) 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(20px, 1.8vw, 26px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.035em;
  color: #9aa1ad;
  transition: color 0.3s;
}
.wi-item.open .wi-btn,
.wi-btn:hover {
  color: #0a0a0a;
}
.wi-btn:focus-visible {
  outline: 2px solid #f2540c;
  outline-offset: 3px;
  border-radius: 6px;
}
.wi-more {
  display: grid;
  transition: grid-template-rows 0.5s var(--ease);
}
.wi-more p {
  margin: 0;
  overflow: hidden;
}
.wi-more span {
  display: block;
  padding: 0 0 clamp(16px, 1.6vw, 22px);
  font-size: clamp(15px, 1.1vw, 16.5px);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.01em;
  color: #475569;
}

/* ---------- motion ---------- */
.wi-arm .wi-head,
.wi-arm .wi-cards,
.wi-arm .wi-list {
  opacity: 0;
  transform: translateY(28px);
}
.wi-arm.wi-in .wi-head,
.wi-arm.wi-in .wi-cards,
.wi-arm.wi-in .wi-list {
  opacity: 1;
  transform: none;
  transition: opacity 0.9s var(--ease), transform 1s var(--ease);
}
.wi-arm.wi-in .wi-cards { transition-delay: 0.12s; }
.wi-arm.wi-in .wi-list { transition-delay: 0.24s; }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .wi-head,
  .wi-body {
    grid-template-columns: minmax(0, 1fr);
  }
  .wi-head { gap: 16px; }
}
@media (max-width: 520px) {
  .wi-cards { grid-template-columns: minmax(0, 1fr); }
  .wi-card { height: 300px; }
  .wi-b { margin-top: 0; }
  .pn { max-width: 320px; }
}
@media (prefers-reduced-motion: reduce) {
  .wi *,
  .wi *::before,
  .wi *::after {
    transition: none !important;
    animation: none !important;
  }
  .wi-arm .wi-head,
  .wi-arm .wi-cards,
  .wi-arm .wi-list {
    opacity: 1;
    transform: none;
  }
}
</style>