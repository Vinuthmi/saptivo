<template>
  <section ref="root" class="ilc" :class="{ 'ilc-arm': armed, 'ilc-in': shown }" aria-label="WordPress and Facebook Lead Ads integrations">
    <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
      <symbol id="ilc-check" viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></symbol>
    </svg>

    <div class="ilc-wrap">
      <div v-for="(b, bi) in blocks" :key="b.key" class="ilc-blk">
      <h2 class="d-h rv" :style="{ '--i': bi * 3 }">{{ b.title }}</h2>
      <div class="ilc-row" :class="{ flip: b.flip }">
        <!-- ================= card 1: main visual ================= -->
        <div class="card c1" :class="'t-' + b.key" :style="{ '--i': bi * 3 }" aria-hidden="true">
          <span class="orb o1"></span>
          <span class="orb o2"></span>

          <template v-if="b.key === 'wp'">
            <div class="win float" style="--d: 0s">
              <div class="win-bar"><i></i><i></i><i></i><span class="url">yourwebsite.com/contact</span></div>
              <div class="win-body">
                <b class="f-title">Contact us</b>
                <div class="field"><small>Name</small><u></u></div>
                <div class="field"><small>Email</small><u></u></div>
                <div class="field"><small>Message</small><u class="tall"></u></div>
                <span class="btn-or">Send message</span>
              </div>
            </div>
            <span class="mk mk-wp float" style="--d: 0.8s">W</span>
            <div class="glass g-sub float" style="--d: 1.6s"><i class="dot"></i>Form submitted</div>
            <div class="cap"><span>Website contact form</span><span>WordPress</span></div>
          </template>

          <template v-else>
            <div class="phone float" style="--d: 0s">
              <div class="ph-screen">
                <div class="fb-top"><i class="fbc">f</i><div><b>Your Facebook Page</b><small>Instant Form</small></div></div>
                <div class="field"><small>Full name</small><u></u></div>
                <div class="field"><small>Email</small><u></u></div>
                <div class="field"><small>Phone</small><u></u></div>
                <span class="btn-fb">Submit</span>
              </div>
            </div>
            <span class="mk mk-fb float" style="--d: 0.8s">f</span>
            <div class="glass g-sub g-sub-fb float" style="--d: 1.6s"><i class="dot"></i>Instant Form submitted</div>
          </template>
        </div>

        <!-- ================= card 2: glass CRM panel ================= -->
        <div class="card c2" :class="'t-' + b.key" :style="{ '--i': bi * 3 + 1 }" aria-hidden="true">
          <span class="orb o1"></span>
          <span class="orb o2"></span>

          <template v-if="b.key === 'wp'">
            <div class="glass g-main float" style="--d: 0.3s">
              <div class="g-h"><img class="lg" :src="logoSrc" alt="" draggable="false" /><b>New inquiry</b><em class="chip ok">just now</em></div>
              <div class="rw"><small>Customer</small><u></u></div>
              <div class="rw"><small>Message</small><u class="s"></u></div>
              <div class="rw"><small>From page</small><u class="m"></u></div>
              <div class="rw"><small>Assigned</small><span class="av">AS</span><b>Round-robin</b></div>
              <div class="rw"><small>Status</small><em class="chip wip">New</em></div>
            </div>
            <div class="glass g-time float" style="--d: 1.8s">
              <span class="ring"><i></i></span>
              <div class="ic-t"><small>Response time</small><b class="tm">{{ clock }}</b></div>
            </div>
            <div class="cap dark"><span>Inquiry</span><span>Assigned automatically</span></div>
          </template>

          <template v-else>
            <div class="glass g-main float" style="--d: 0.3s">
              <div class="g-h"><img class="lg" :src="logoSrc" alt="" draggable="false" /><b>New lead</b><em class="chip ok">just now</em></div>
              <div class="rw"><small>Campaign</small><u></u></div>
              <div class="rw"><small>Form name</small><u class="m"></u></div>
              <div class="rw"><small>Lead score</small><span class="meter"><i></i></span></div>
              <div class="rw"><small>Routed to</small><span class="av">SP</span><b>Salesperson</b></div>
            </div>
            <div class="glass g-ack float" style="--d: 1.8s"><i class="dot"></i>WhatsApp or SMS acknowledgement</div>
            <div class="cap dark"><span>Lead</span><span>One pipeline</span></div>
          </template>
        </div>

        <!-- ================= card 3: description ================= -->
        <div class="txt rv" :style="{ '--i': bi * 3 + 2 }">
          <p class="d-p">{{ b.text }}</p>
          <ul class="d-ul">
            <li v-for="p in b.points" :key="p">{{ p }}</li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * SectionInquiryLeadCards.vue — WordPress inquiry sync and Facebook Lead Ads, laid out like the "Why choose us" reference:
 * two visual cards plus the plain description text in a row, with the H2 above, and the same again for the second integration.
 * Vue 3, <script setup>, scoped CSS, no external animation libraries.
 *
 * Content: both blocks live in the `blocks` array below, word for word. Mockup labels are illustrative and nothing
 * statistical is invented. Each description card carries the H2. The two brand marks (W, f) are simple stand-ins:
 * swap in the official, permitted assets before launch. The Saptivo logo is read from `saptivo-logo.png` in /public,
 * shown in black.
 * Desktop: three cards per row (the second row is mirrored). Tablet: two visual cards, then the description full width.
 * Mobile: single column. Floating motion and the entrance reveal switch off for prefers-reduced-motion.
 * New file: it does not touch SectionLeadSync.vue or any other component.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'SectionInquiryLeadCards' })

const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`

const blocks = [
  {
    key: 'wp',
    flip: false,
    title: 'WordPress website inquiry sync',
    text: "Your website is often the first place a customer reaches out. With Saptivo's WordPress CRM integration, every contact-form submission arrives in your CRM as a new inquiry within moments, with the customer's details, message and the page they came from.",
    points: [
      'No plugins to maintain on the CRM side',
      'Inquiries are assigned automatically by round-robin or territory',
      'Response time is tracked from the moment the form is submitted',
    ],
  },
  {
    key: 'fb',
    flip: true,
    title: 'Facebook Lead Ads integration',
    text: "Paid social campaigns only pay off if leads are called back quickly. Saptivo's Facebook Lead Ads CRM integration creates a lead the moment someone submits an Instant Form on your Facebook Page, scores it and routes it to a salesperson.",
    points: [
      'Leads from every connected Page in one pipeline',
      'Campaign and form name recorded for ROI reporting',
      'Automatic WhatsApp or SMS acknowledgement to the new lead',
    ],
  },
]

const root = ref(null)
const armed = ref(false)
const shown = ref(false)
const clock = ref('00:00')
let io = null
let timer = null
let sec = 0

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    shown.value = true
    return
  }
  armed.value = true
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true
        io.disconnect()
      }
    },
    { threshold: 0.12 },
  )
  io.observe(root.value)
  timer = setInterval(() => {
    if (document.hidden) return
    sec = (sec + 1) % 60
    clock.value = `00:${String(sec).padStart(2, '0')}`
  }, 1000)
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
.ilc {
  --navy: #14243a;
  --orange: #ff6b16;
  --ivory: #f9f8f4;
  --beige: #f4f1de;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --gap: clamp(12px, 1.5vw, 20px);
  box-sizing: border-box;
  width: 100%;
  padding: clamp(28px, 4vw, 64px) clamp(14px, 3vw, 40px);
  background: #fff;
  color: var(--navy);
  font-family: 'Poppins', system-ui, sans-serif;
  overflow-x: clip;
}
.ilc *,
.ilc *::before,
.ilc *::after {
  box-sizing: border-box;
}
.ilc svg {
  display: block;
}
.ilc-wrap {
  display: grid;
  gap: clamp(56px, 7vw, 104px);
  max-width: 1400px;
  margin: 0 auto;
}
.ilc-blk { display: grid; gap: clamp(22px, 2.6vw, 36px); }
.ilc-row {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 1.12fr) minmax(0, 1fr);
  gap: var(--gap);
}
.ilc-row.flip { grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr) minmax(0, 1.12fr); }
.ilc-row.flip .txt { order: -1; }

/* ---------- shared card ---------- */
.card {
  position: relative;
  container-type: inline-size;
  border: 1px solid rgba(20, 36, 58, 0.08);
  border-radius: 20px;
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.5s var(--ease);
}
.card:hover { transform: translateY(-4px); }
.c1, .c2 { aspect-ratio: 4 / 5; }
.orb { position: absolute; z-index: -1; border-radius: 50%; filter: blur(34px); }
.c1 > :not(.orb), .c2 > :not(.orb) { position: absolute; }

/* tones: navy, beige, warm grey, muted blue; orange stays a small accent */
.t-wp.c1 { background: linear-gradient(165deg, #243d5e 0%, #14243a 62%, #0f1c2e 100%); }
.t-wp.c1 .o1 { right: -18%; bottom: -16%; width: 80%; aspect-ratio: 1; background: #4d79b3; opacity: 0.4; }
.t-wp.c1 .o2 { left: -22%; top: -18%; width: 70%; aspect-ratio: 1; background: #3d5f8f; opacity: 0.4; }
.t-wp.c2 { background: linear-gradient(160deg, #f4f1de 0%, #dfe5d0 100%); }
.t-wp.c2 .o1 { left: -16%; top: -14%; width: 70%; aspect-ratio: 1; background: #fff; opacity: 0.8; }
.t-wp.c2 .o2 { right: -18%; bottom: -14%; width: 76%; aspect-ratio: 1; background: #c4d4b4; opacity: 0.6; }
.t-fb.c1 { background: linear-gradient(165deg, #f1e6dc 0%, #dccabc 100%); }
.t-fb.c1 .o1 { left: -20%; top: -16%; width: 74%; aspect-ratio: 1; background: #fff; opacity: 0.8; }
.t-fb.c1 .o2 { right: -22%; bottom: -18%; width: 80%; aspect-ratio: 1; background: #c9b3a2; opacity: 0.6; }
.t-fb.c2 { background: linear-gradient(165deg, #dce8f8 0%, #b6cbe8 100%); }
.t-fb.c2 .o1 { right: -16%; top: -14%; width: 70%; aspect-ratio: 1; background: #fff; opacity: 0.8; }
.t-fb.c2 .o2 { left: -20%; bottom: -16%; width: 76%; aspect-ratio: 1; background: #7f9fcf; opacity: 0.5; }

/* small helpers */
.ilc u { display: block; height: 2.2cqw; min-height: 6px; border-radius: 6px; background: rgba(20, 36, 58, 0.1); text-decoration: none; }
.ilc small { font-size: clamp(9px, 2.7cqw, 11px); color: #6b7685; }
.ilc b { font-weight: 600; }

/* glass */
.glass {
  padding: 3.4cqw 3.8cqw;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: clamp(12px, 4cqw, 18px);
  background: rgba(255, 255, 255, 0.5);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 20px 40px -22px rgba(20, 36, 58, 0.45);
  font-size: clamp(10px, 3cqw, 12.5px);
  color: var(--navy);
}
.g-h { display: flex; align-items: center; gap: 2.4cqw; margin-bottom: 2.4cqw; }
.g-h b { flex: 1; min-width: 0; font-size: clamp(11px, 3.4cqw, 13.5px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lg { display: block; width: auto; height: clamp(10px, 3cqw, 13px); filter: brightness(0); }
.chip { display: inline-flex; align-items: center; padding: 0.6cqw 2.4cqw; border-radius: 8px; font-style: normal; font-size: clamp(9px, 2.6cqw, 11px); font-weight: 500; white-space: nowrap; }
.chip.ok { background: #e1f5ea; color: #16a05a; }
.chip.wip { background: #fff0d3; color: #b7740b; }
.rw { display: flex; align-items: center; gap: 2.4cqw; padding: 1.5cqw 0; }
.rw small { flex: none; min-width: 19cqw; }
.rw u { flex: 1; }
.rw u.s { width: 70%; flex: none; }
.rw u.m { width: 52%; flex: none; }
.rw b { font-size: clamp(10px, 3cqw, 12px); }
.av { flex: none; display: grid; place-items: center; width: 7cqw; min-width: 22px; aspect-ratio: 1; border-radius: 50%; background: linear-gradient(145deg, #2a4263, #14243a); color: #fff; font-size: clamp(7px, 2.1cqw, 9px); font-weight: 600; }
.dot { flex: none; width: 2.4cqw; min-width: 8px; aspect-ratio: 1; border-radius: 50%; background: #25d366; }
.meter { flex: 1; height: 2.2cqw; min-height: 7px; border-radius: 6px; background: rgba(20, 36, 58, 0.12); overflow: hidden; }
.meter i { display: block; width: 80%; height: 100%; border-radius: 6px; background: var(--orange); transform-origin: left; animation: ilc-meter 4s ease-in-out infinite alternate; }
@keyframes ilc-meter { from { transform: scaleX(0.55); } to { transform: scaleX(1); } }

/* captions (bottom of visual cards) */
.cap { left: 6cqw; right: 6cqw; bottom: 5cqw; display: flex; justify-content: space-between; gap: 12px; font-size: clamp(11px, 3.3cqw, 13.5px); font-weight: 500; color: #fff; }
.cap.dark { color: var(--navy); }

/* floating */
.float { animation: ilc-float 6s ease-in-out infinite; animation-delay: var(--d, 0s); }
@keyframes ilc-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.8cqw); } }

/* browser window + forms */
.win { overflow: hidden; border-radius: clamp(10px, 3.4cqw, 16px); background: #fff; box-shadow: 0 30px 50px -28px rgba(0, 0, 0, 0.55); }
.win-bar { display: flex; align-items: center; gap: 1.4cqw; padding: 2.8cqw 3.4cqw; background: #f3f4f7; }
.win-bar i { width: 2cqw; min-width: 6px; aspect-ratio: 1; border-radius: 50%; background: #d5d9e1; }
.url { flex: 1; margin-left: 2cqw; padding: 0.8cqw 2.6cqw; border-radius: 6px; background: #fff; font-size: clamp(8.5px, 2.5cqw, 10.5px); color: #8a93a1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.win-body { padding: 4cqw; }
.f-title { display: block; margin-bottom: 2.6cqw; font-family: Urbanist, sans-serif; font-size: clamp(12px, 4cqw, 16px); letter-spacing: -0.02em; }
.field { margin-bottom: 2.4cqw; }
.field small { display: block; margin-bottom: 0.8cqw; }
.field u { height: 5.2cqw; min-height: 16px; border: 1px solid #e3e6ec; background: #fff; border-radius: 6px; }
.field u.tall { height: 9cqw; }
.btn-or { display: inline-block; margin-top: 1cqw; padding: 2cqw 4.4cqw; border-radius: 8px; background: var(--orange); font-size: clamp(9px, 2.7cqw, 11px); font-weight: 600; color: #fff; }

.win { left: 9%; top: 11%; width: 82%; }
.g-sub { left: 14%; bottom: 17%; display: flex; align-items: center; gap: 2.4cqw; padding: 2.6cqw 4cqw; font-weight: 500; }
.g-sub-fb { left: 9%; right: 9%; bottom: 6%; }

/* brand marks (stand-ins) */
.mk { display: grid; place-items: center; width: 11cqw; min-width: 36px; aspect-ratio: 1; border-radius: 50%; right: 7%; top: 5%; background: #fff; box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.5); font-weight: 700; z-index: 2; }
.mk-wp { font-family: Georgia, serif; font-size: clamp(16px, 5.4cqw, 22px); color: #21759b; }
.mk-fb { font-family: Arial, sans-serif; font-size: clamp(18px, 6.4cqw, 26px); color: #fff; background: #1877f2; }

/* phone */
.phone { left: 17%; top: 13%; width: 66%; height: 100%; padding: 1.2cqw; border-radius: 9cqw 9cqw 0 0; background: #111317; box-shadow: 0 34px 54px -28px rgba(20, 36, 58, 0.7); }
.ph-screen { height: 100%; overflow: hidden; padding: 5cqw 4.4cqw; border-radius: 8cqw 8cqw 0 0; background: #fff; }
.fb-top { display: flex; align-items: center; gap: 2.4cqw; margin-bottom: 3.6cqw; }
.fb-top b { display: block; font-size: clamp(9px, 2.8cqw, 11.5px); line-height: 1.2; }
.fb-top small { display: block; font-size: clamp(8px, 2.3cqw, 10px); }
.fbc { display: grid; place-items: center; flex: none; width: 7.6cqw; min-width: 22px; aspect-ratio: 1; border-radius: 50%; background: #1877f2; font-style: normal; font-weight: 700; font-family: Arial, sans-serif; font-size: clamp(11px, 4cqw, 16px); color: #fff; }
.btn-fb { display: block; margin-top: 2.6cqw; padding: 2.4cqw 0; border-radius: 8px; background: #1877f2; text-align: center; font-size: clamp(9px, 2.8cqw, 11.5px); font-weight: 600; color: #fff; }

/* card 2 panels */
.g-main { left: 7%; right: 7%; top: 8%; }
.g-time { left: 24%; right: 7%; top: 63%; display: flex; align-items: center; gap: 3cqw; }
.g-ack { left: 7%; right: 7%; top: 63%; display: flex; align-items: center; gap: 2.6cqw; font-weight: 500; }
.ring { flex: none; display: block; width: 10cqw; min-width: 32px; aspect-ratio: 1; border-radius: 50%; border: 0.9cqw solid rgba(20, 36, 58, 0.12); position: relative; }
.ring i { position: absolute; inset: -0.9cqw; border-radius: 50%; border: 0.9cqw solid transparent; border-top-color: var(--orange); border-right-color: var(--orange); animation: ilc-spin 3s linear infinite; }
@keyframes ilc-spin { to { transform: rotate(360deg); } }
.ic-t { display: grid; gap: 0.4cqw; }
.ic-t b { font-size: clamp(13px, 4.4cqw, 18px); font-variant-numeric: tabular-nums; }

/* ---------- heading + plain description (no card) ---------- */
.d-h {
  margin: 0 !important;
  font-family: Urbanist, 'Urbanist Placeholder', sans-serif !important;
  font-size: clamp(32px, 4vw, 54px) !important;
  font-weight: 600 !important;
  line-height: 1.08 !important;
  letter-spacing: -0.045em !important;
  color: var(--navy) !important;
}
.txt { align-self: center; padding: 0 clamp(4px, 1vw, 14px); }
.d-p { margin: 0; font-size: clamp(14.5px, 1.15vw, 16.5px); line-height: 1.7; color: #556070; }
.d-ul { margin: clamp(20px, 2vw, 30px) 0 0; padding: 0; list-style: none; }
.d-ul li { padding: 14px 0; border-top: 1px solid rgba(20, 36, 58, 0.12); font-size: clamp(14px, 1.1vw, 16px); font-weight: 500; line-height: 1.5; color: var(--navy); }
.d-ul li:last-child { border-bottom: 1px solid rgba(20, 36, 58, 0.12); }

/* ---------- entrance ---------- */
.ilc-arm .card, .ilc-arm .rv { opacity: 0; transform: translateY(30px); }
.ilc-arm.ilc-in .card, .ilc-arm.ilc-in .rv { opacity: 1; transform: none; transition: opacity 0.9s ease, transform 1s var(--ease); transition-delay: calc(var(--i) * 0.08s); }
.ilc-arm.ilc-in .card:hover { transform: translateY(-4px); transition-delay: 0s; }

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .ilc-row, .ilc-row.flip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ilc-row .txt, .ilc-row.flip .txt { grid-column: 1 / -1; order: 3; padding: 4px 0 0; }
}
@media (max-width: 640px) {
  .ilc-row, .ilc-row.flip { grid-template-columns: minmax(0, 1fr); }
  .c1, .c2 { aspect-ratio: 5 / 6; }
}
@media (prefers-reduced-motion: reduce) {
  .ilc *, .ilc *::before, .ilc *::after { animation: none !important; transition: none !important; }
  .ilc-arm .card, .ilc-arm .rv { opacity: 1; transform: none; }
}
</style>