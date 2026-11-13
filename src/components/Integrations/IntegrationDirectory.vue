<template>
  <section ref="root" class="su" :class="{ 'su-arm': armed, 'su-in': shown }" aria-label="WordPress and Facebook lead integrations">
    <div class="su-wrap">
      <div class="su-grid">
        <!-- ============ 1 · WordPress website inquiry sync ============ -->
        <article class="su-col" style="--i: 0">
          <div class="su-card su-grad">
            <span class="su-grain" aria-hidden="true"></span>

            <div class="su-panel" aria-hidden="true">
              <div class="pn-h">
                <img class="pn-logo" :src="logoSrc" alt="" draggable="false" />
                <b>New inquiry</b>
                <em class="chip" :class="wpStage.cls">
                  <svg v-if="tick >= 4" viewBox="0 0 24 24"><path d="m6 12.500 4 4 8-9" /></svg>
                  <i v-else></i>
                  {{ wpStage.t }}
                </em>
              </div>

              <div class="pn-rows">
                <div class="pn-r">
                  <span>Customer</span>
                  <b>John Smith</b>
                </div>
                <div class="pn-r">
                  <span>Came from</span>
                  <b class="from"><i class="wp" v-html="brand.wp"></i>/contact-us</b>
                </div>
                <div class="pn-r">
                  <span>Assigned to</span>
                  <b :key="ind" class="by swap"><i>{{ rep.i }}</i>{{ rep.n }}<u>{{ rep.m }}</u></b>
                </div>
              </div>

              <div class="pn-ev">
                <small>Timeline</small>
                <ol>
                  <li v-for="(e, k) in events" :key="e[0]" :class="{ show: tick >= 1 + k * 2 }">
                    <span><i class="ev-ic"><svg viewBox="0 0 24 24" v-html="icons[e[2]]"></svg></i>{{ e[0] }}</span>
                    <b>{{ e[1] }}</b>
                  </li>
                </ol>
                <div class="timer">
                  <span><i></i>Response time</span>
                  <b>{{ clock }}</b>
                </div>
              </div>
            </div>
          </div>

          <div class="su-txt">
          <h2 class="su-ct">WordPress website inquiry sync</h2>
          <p class="su-cd">
            Your website is often the first place a customer reaches out. With Saptivo's WordPress CRM integration,
            every contact-form submission arrives in your CRM as a new inquiry within moments, with the customer's
            details, message and the page they came from.
          </p>
          <ul class="su-list">
            <li v-for="b in wpBullets" :key="b"><i><svg viewBox="0 0 24 24"><path d="m6 12.500 4 4 8-9" /></svg></i>{{ b }}</li>
          </ul>
          </div>
        </article>

        <!-- ============ 2 · Facebook Lead Ads integration ============ -->
        <article class="su-col" style="--i: 1">
          <div class="su-card su-photo">
            <img v-if="photo && !photoFail" class="su-img" :src="photo" alt="" loading="lazy" decoding="async" draggable="false" @error="photoFail = true" />
            <span class="su-grain" aria-hidden="true"></span>
            <span class="su-sky" aria-hidden="true"></span>

            <!-- illustrated Instant Form on a phone (shown when no photo is supplied) -->
            <div v-if="!photo || photoFail" class="su-phone" aria-hidden="true">
              <div class="ph-in">
                <div class="ph-top">
                  <i class="fbp" v-html="brand.fb"></i>
                  <span><b>Your Page</b><small>Sponsored</small></span>
                </div>
                <div class="ph-ad"></div>
                <b class="ph-h">Book a test drive</b>
                <div class="ph-f"><small>Full name</small><u></u></div>
                <div class="ph-f"><small>Phone number</small><u></u></div>
                <span class="ph-b" :class="{ press: tick === 2 }">Submit</span>
                <i v-if="tick === 2" :key="'ping' + tick" class="ph-ping"></i>
              </div>
            </div>

            <div class="su-over" aria-hidden="true">
              <div class="pn-h">
                <i class="fbp sm" v-html="brand.fb"></i>
                <b>Instant Form lead</b>
                <em class="chip" :class="tick >= 3 ? 'blue' : 'wip'">
                  <svg v-if="tick >= 3" viewBox="0 0 24 24"><path d="m6 12.500 4 4 8-9" /></svg>
                  <i v-else></i>
                  {{ tick >= 3 ? 'New lead' : 'Submitted' }}
                </em>
              </div>
              <div class="ov-g">
                <div><small>Lead</small><b>Kasun Perera</b></div>
                <div><small>Form</small><b>SUV test drive</b></div>
              </div>
              <div class="ov-c"><small>Campaign</small><b>Q3 launch · Colombo</b></div>
              <div class="ov-t">
                <span><small>Lead score</small><b>{{ score }} · Hot</b></span>
                <i class="bar"><u :style="{ width: score + '%' }"></u></i>
              </div>
              <div class="ov-f">
                <span class="by" :class="{ off: tick < 5 }"><i>KK</i>Routed to Kavindu K.</span>
                <em class="chip ok" :class="{ off: tick < 7 }"><svg viewBox="0 0 24 24"><path d="m6 12.500 4 4 8-9" /></svg>WhatsApp sent</em>
              </div>
            </div>
          </div>

          <div class="su-txt">
          <h2 class="su-ct">Facebook Lead Ads integration</h2>
          <p class="su-cd">
            Paid social campaigns only pay off if leads are called back quickly. Saptivo's Facebook Lead Ads CRM
            integration creates a lead the moment someone submits an Instant Form on your Facebook Page, scores it
            and routes it to a salesperson.
          </p>
          <ul class="su-list">
            <li v-for="b in fbBullets" :key="b"><i><svg viewBox="0 0 24 24"><path d="m6 12.500 4 4 8-9" /></svg></i>{{ b }}</li>
          </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * SectionLeadSources.vue — "WordPress website inquiry sync" + "Facebook Lead Ads integration" (Vue 3, <script setup>)
 *
 * Same design as the "How industry setup works" section: two large cards, each with a white UI panel, and the
 * H2, paragraph and three points underneath.
 * • Left card: a soft gradient with a panel that plays the inquiry journey — form submitted, inquiry created,
 *   assigned (round-robin / territory) — with a running response timer.
 * • Right card: a Facebook Instant Form on a phone, with an overlay card showing the lead arriving, scored,
 *   routed to a salesperson and acknowledged on WhatsApp. Pass `photo` to use a real image instead of the phone.
 * • Loops while on screen; respects prefers-reduced-motion (static, finished state).
 *
 * Names, scores and times on the cards are sample data. Prop: photo. SSR / Nuxt safe (browser APIs only in onMounted).
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'LeadSourcesSection' })

// Saptivo logo (public/saptivo-logo.png, same file the footer uses), shown in black
const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`

defineProps({
  photo: { type: String, default: '' }, // optional photo for the Facebook card (e.g. a phone in hand)
})

const wpBullets = [
  'No plugins to maintain on the CRM side',
  'Inquiries are assigned automatically by round-robin or territory',
  'Response time is tracked from the moment the form is submitted',
]
const fbBullets = [
  'Leads from every connected Page in one pipeline',
  'Campaign and form name recorded for ROI reporting',
  'Automatic WhatsApp or SMS acknowledgement to the new lead',
]

const brand = {
  wp: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#21759b"/><text x="12" y="16.800" text-anchor="middle" font-family="Georgia,serif" font-size="13.500" font-weight="700" fill="#fff">W</text></svg>',
  fb: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1877f2"/><text x="12.800" y="18" text-anchor="middle" font-family="Poppins,sans-serif" font-size="16" font-weight="700" fill="#fff">f</text></svg>',
}
const icons = {
  send: '<path d="M4 12 20 4l-4 16-4.500-6.500z"/><path d="m11.500 13.500 4-5"/>',
  inbox: '<path d="M4 13.500 6.500 5h11L20 13.500V19H4z"/><path d="M4 13.500h4.500l1 2h5l1-2H20"/>',
  user: '<circle cx="12" cy="8.500" r="3.500"/><path d="M5 20c0-3.800 3.100-6 7-6s7 2.200 7 6"/>',
}
const events = [
  ['Form submitted', '10:58:02', 'send'],
  ['Inquiry created', '10:58:04', 'inbox'],
  ['Assigned', '10:58:05', 'user'],
]
const reps = [
  { i: 'YA', n: 'Yasasi Anjana', m: 'Round-robin' },
  { i: 'KK', n: 'Kavindu K.', m: 'Territory' },
]

const root = ref(null)
const armed = ref(false)
const shown = ref(false)
const photoFail = ref(false)
const tick = ref(0) // demo clock 0..9
const ind = ref(0)
const LOOP = 10
const rep = computed(() => reps[ind.value])
const wpStage = computed(() => (tick.value < 2 ? { t: 'Submitting', cls: 'wip' } : tick.value < 4 ? { t: 'New inquiry', cls: 'blue' } : { t: 'Assigned', cls: 'ok' }))
const clock = computed(() => `0:${String(2 + tick.value * 6).padStart(2, '0')}`)
const score = computed(() => (tick.value >= 3 ? 82 : 0))

let io = null
let timer = null
let inView = false

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    tick.value = LOOP - 1
    shown.value = true
    return
  }
  armed.value = true
  io = new IntersectionObserver(
    ([e]) => {
      inView = e.isIntersecting
      if (e.isIntersecting) shown.value = true
    },
    { threshold: 0.2 },
  )
  io.observe(root.value)
  timer = setInterval(() => {
    if (!inView || document.hidden) return
    const n = (tick.value + 1) % LOOP
    if (n === 0) ind.value = (ind.value + 1) % reps.length
    tick.value = n
  }, 1100)
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
.su {
  --ink: #0f172a;
  --mute: #6b7280;
  --sky: #c0e6fd;
  --sky-2: #80aad3;
  --sky-3: #5b86b6;
  --sand: #d4c4a8;
  --ivory: #f4f1de;
  --o: #f2540c;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  margin: clamp(10px, 1.6vw, 28px); /* gap around the rounded box */
  border-radius: clamp(28px, 3.4vw, 48px);
  overflow: hidden;
  padding: clamp(36px, 5vw, 72px) clamp(14px, 3vw, 32px);
  background: #fff;
  color: var(--ink);
  font-family: 'Poppins', system-ui, sans-serif;
}
.su *,
.su *::before,
.su *::after {
  box-sizing: border-box;
}
.su svg {
  display: block;
}
.su-wrap {
  max-width: 1240px;
  margin: 0 auto;
}

/* ============ grid ============ */
.su-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(48px, 6vw, 88px);
}
/* each row: card + description side by side; the second row flips (description left, card right) */
.su-col {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr);
  gap: clamp(28px, 5vw, 76px);
  align-items: center;
}
.su-col:nth-child(even) {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr);
}
.su-col:nth-child(even) .su-card {
  order: 2;
}
.su-txt {
  min-width: 0;
}
.su-card {
  position: relative;
  height: clamp(420px, 41vw, 574px);
  border-radius: clamp(22px, 2.4vw, 30px);
  overflow: hidden;
  isolation: isolate;
}
.su-ct {
  margin: 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(26px, 2.6vw, 36px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.035em;
  color: #0a0a0a;
}
.su-cd {
  max-width: 560px;
  margin: 10px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1.1vw, 17px);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.01em;
  color: #475569;
}
.su-list {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: grid;
  gap: 11px;
}
.su-list li {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1.1vw, 17px);
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: -0.01em;
  color: #0a0a0a;
}
.su-list i {
  flex: none;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  border-radius: 50%;
  background: #e4edf7;
  color: #3f6593;
}
.su-list svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ---------- left: gradient card ---------- */
.su-grad {
  background:
    radial-gradient(72% 56% at 18% -6%, var(--sky) 0%, rgba(192, 230, 253, 0) 70%),
    radial-gradient(60% 50% at 104% 14%, #e5edf6 0%, rgba(229, 237, 246, 0) 72%),
    radial-gradient(90% 46% at 22% 54%, rgba(91, 134, 182, 0.95) 0%, rgba(91, 134, 182, 0) 70%),
    radial-gradient(78% 56% at 86% 106%, rgba(255, 160, 126, 0.85) 0%, rgba(255, 160, 126, 0) 70%),
    radial-gradient(70% 56% at 6% 104%, rgba(226, 140, 158, 0.9) 0%, rgba(226, 140, 158, 0) 70%),
    linear-gradient(165deg, #a9d3ef 0%, #8fb5da 48%, #d6b9c9 100%);
}
.su-grain {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.18;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* white UI panels (shared look) */
.su-panel,
.su-over {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 34px 60px -30px rgba(23, 50, 90, 0.45), 0 2px 8px rgba(23, 50, 90, 0.06);
  font-family: 'Poppins', system-ui, sans-serif;
}
.su-panel {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  width: min(66%, 410px);
  min-width: 300px;
  padding: 22px 24px 20px;
  transform: translate(-50%, -52%);
}
.pn-h {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f1f4;
}
.pn-h b {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pn-logo {
  flex: none;
  display: block;
  width: auto;
  height: 17px;
  max-width: 80px;
  object-fit: contain;
  filter: brightness(0); /* logo in black */
}
.pn-rows {
  padding: 4px 0 6px;
  border-bottom: 1px solid #f0f1f4;
}
.pn-r {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  font-size: 14px;
  color: var(--mute);
}
.pn-r b {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.swap {
  animation: su-swap 0.5s var(--ease);
}
.by {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.5s;
}
.by.off {
  opacity: 0.2;
}
.by i {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #0f172a;
  color: #fff;
  font-style: normal;
  font-size: 9.5px;
  font-weight: 600;
}
.by u {
  text-decoration: none;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef3f9;
  color: #3f6593;
  font-size: 10.5px;
  font-weight: 600;
}
.from {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.wp,
.fbp {
  display: block;
  flex: none;
  width: 20px;
  height: 20px;
}
.wp svg,
.fbp svg {
  width: 100%;
  height: 100%;
}
.fbp.sm {
  width: 24px;
  height: 24px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px;
  border-radius: 8px;
  font-style: normal;
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.4s, color 0.4s, opacity 0.5s;
}
.chip svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.chip.ok {
  background: #e6f8ef;
  color: #16a05a;
}
.chip.off {
  opacity: 0.2;
}
.chip.wip {
  background: #fff1d6;
  color: #b7740b;
}
.chip.wip i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: su-blink 1.2s ease-in-out infinite;
}
.chip.blue {
  background: #e4edff;
  color: #3f63d8;
}
.pn-ev {
  padding-top: 12px;
}
.pn-ev small {
  font-size: 13px;
  color: var(--mute);
}
.pn-ev ol {
  position: relative;
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  display: grid;
  gap: 13px;
}
.pn-ev ol::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 14px;
  bottom: 14px;
  width: 1px;
  background: #e7e9ee;
}
.pn-ev li {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  opacity: 0.25;
  transform: translateX(-6px);
  transition: opacity 0.5s ease, transform 0.6s var(--ease);
}
.pn-ev li.show {
  opacity: 1;
  transform: none;
}
.pn-ev li > span {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: var(--mute);
  white-space: nowrap;
}
.pn-ev li > b {
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}
.ev-ic {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background: #fff;
  color: #16a05a;
}
.ev-ic svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.timer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding: 9px 12px;
  border-radius: 12px;
  background: #f4f7fb;
}
.timer span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--mute);
}
.timer i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f2540c;
  animation: su-blink 1.2s ease-in-out infinite;
}
.timer b {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

/* ---------- right: phone / photo card ---------- */
.su-photo {
  background:
    radial-gradient(70% 50% at 20% -4%, var(--sky) 0%, rgba(192, 230, 253, 0) 70%),
    radial-gradient(70% 56% at 90% 104%, rgba(212, 196, 168, 0.95) 0%, rgba(212, 196, 168, 0) 72%),
    radial-gradient(60% 46% at 8% 100%, rgba(255, 170, 140, 0.7) 0%, rgba(255, 170, 140, 0) 70%),
    linear-gradient(170deg, #b9dcf3 0%, #8fb5da 52%, #e6d9c4 100%);
}
.su-img {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 28%;
  transition: transform 1.4s var(--ease);
}
.su-photo:hover .su-img {
  transform: scale(1.04);
}
.su-sky {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(192, 230, 253, 0.2) 0%, rgba(192, 230, 253, 0) 38%),
    linear-gradient(0deg, rgba(13, 27, 42, 0.18) 0%, rgba(13, 27, 42, 0) 42%);
}

/* illustrated phone */
.su-phone {
  position: absolute;
  z-index: 0;
  right: clamp(14px, 6%, 56px);
  top: clamp(20px, 5%, 40px);
  width: clamp(168px, 34%, 214px);
  padding: 7px;
  border-radius: 34px;
  background: #0f1420;
  box-shadow: 0 40px 60px -26px rgba(13, 27, 42, 0.65);
  rotate: 5deg;
  animation: su-bob 7s ease-in-out infinite;
}
.ph-in {
  position: relative;
  padding: 18px 12px 14px;
  border-radius: 28px;
  background: #fff;
  display: grid;
  gap: 9px;
}
.ph-in::before {
  content: '';
  position: absolute;
  top: 7px;
  left: 50%;
  width: 46px;
  height: 11px;
  margin-left: -23px;
  border-radius: 8px;
  background: #0f1420;
}
.ph-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.ph-top .fbp {
  width: 24px;
  height: 24px;
}
.ph-top span {
  display: grid;
  line-height: 1.2;
}
.ph-top b {
  font-size: 11px;
  font-weight: 600;
}
.ph-top small {
  font-size: 9px;
  color: var(--mute);
}
.ph-ad {
  height: 66px;
  border-radius: 12px;
  background: linear-gradient(140deg, #c0e6fd 0%, #80aad3 55%, #d4c4a8 100%);
}
.ph-h {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.ph-f {
  display: grid;
  gap: 3px;
}
.ph-f small {
  font-size: 9px;
  color: var(--mute);
}
.ph-f u {
  display: block;
  height: 20px;
  border-radius: 7px;
  background: #f1f4f8;
  border: 1px solid #e6ebf2;
}
.ph-b {
  position: relative;
  display: grid;
  place-items: center;
  height: 30px;
  margin-top: 3px;
  border-radius: 9px;
  background: #1877f2;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  transition: transform 0.25s;
}
.ph-b.press {
  transform: scale(0.94);
  background: #1563cc;
}
.ph-ping {
  position: absolute;
  right: 24px;
  bottom: 10px;
  width: 30px;
  height: 30px;
  margin: 0 -15px -15px 0;
  border-radius: 50%;
  border: 2px solid #1877f2;
  animation: su-ping 0.9s ease-out both;
}

/* overlay card */
.su-over {
  position: absolute;
  z-index: 2;
  left: clamp(16px, 2.6vw, 32px);
  bottom: clamp(16px, 2.6vw, 32px);
  width: min(92%, 430px);
  padding: 18px 20px 18px;
}
.su-over .pn-h {
  padding-bottom: 12px;
}
.su-over .chip {
  padding: 3px 10px;
  font-size: 12px;
}
.ov-g {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px 0 10px;
}
.ov-g small,
.ov-c small,
.ov-t small {
  display: block;
  font-size: 12.5px;
  color: var(--mute);
}
.ov-g b {
  display: block;
  margin-top: 3px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.ov-c {
  padding: 0 0 12px;
  border-bottom: 1px solid #f0f1f4;
}
.ov-c b {
  display: block;
  margin-top: 3px;
  font-size: 14.5px;
  font-weight: 600;
}
.ov-t {
  padding-top: 12px;
}
.ov-t span {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.ov-t b {
  font-size: 13.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.bar {
  display: block;
  height: 6px;
  margin-top: 8px;
  border-radius: 6px;
  background: #eceef3;
  overflow: hidden;
}
.bar u {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #80aad3, #3f6593);
  transition: width 1.2s var(--ease);
}
.ov-f {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f0f1f4;
  font-size: 13px;
  font-weight: 500;
}

/* ============ motion ============ */
.su-arm .su-col {
  opacity: 0;
  transform: translateY(34px);
}
.su-arm.su-in .su-col {
  opacity: 1;
  transform: none;
  transition: opacity 0.9s var(--ease), transform 1.1s var(--ease);
  transition-delay: calc(var(--i) * 0.14s);
}
.su-arm .su-panel,
.su-arm .su-over {
  opacity: 0;
}
.su-arm.su-in .su-panel {
  opacity: 1;
  transition: opacity 0.8s ease 0.4s;
}
.su-arm.su-in .su-over {
  opacity: 1;
  transition: opacity 0.8s ease 0.6s;
}
@keyframes su-swap { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes su-blink { 50% { opacity: 0.3; } }
@keyframes su-bob { 50% { transform: translateY(-8px); } }
@keyframes su-ping { from { opacity: 0.9; transform: scale(0.4); } to { opacity: 0; transform: scale(1.8); } }

/* ============ responsive ============ */
@media (max-width: 860px) {
  .su-grid {
    gap: 52px;
  }
  .su-col,
  .su-col:nth-child(even) {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
    align-items: start;
  }
  .su-col:nth-child(even) .su-card {
    order: 0;
  }
  .su-card {
    height: clamp(440px, 100vw, 540px);
  }
  .su-panel {
    width: min(90%, 410px);
  }
  .su-over {
    width: calc(100% - 32px);
  }
  .su-phone {
    right: 14px;
    width: clamp(150px, 38%, 200px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .su *,
  .su *::before,
  .su *::after {
    animation: none !important;
    transition: none !important;
  }
  .su-arm .su-col,
  .su-arm .su-panel,
  .su-arm .su-over {
    opacity: 1;
    transform: none;
  }
}
</style>