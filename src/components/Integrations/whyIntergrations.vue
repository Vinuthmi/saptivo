<template>
  <section ref="root" class="why-integrations" :class="{ 'is-visible': shown }" aria-labelledby="wi-heading">
    <div class="wi-container">
      <div class="bento-grid">
        <!-- White animated integration card -->
        <article class="bento-card sources-card">
          
          <!-- Upper semicircle: Saptivo anchors the bottom, integrations arc above -->
          <div class="half-orbit" aria-label="Saptivo connected to WhatsApp, Facebook, 3CX, Vodia, Google Calendar and REST API">
            <div class="half-ring ring-outer"></div>
            <div class="half-ring ring-middle"></div>
            <div class="half-ring ring-inner"></div>
            <svg class="half-flow" viewBox="0 0 360 174" aria-hidden="true">
              <path d="M 22 151 A 158 158 0 0 1 338 151" />
              <circle r="3" class="flow-dot"><animateMotion dur="7s" repeatCount="indefinite" path="M 22 151 A 158 158 0 0 1 338 151" /></circle>
              <circle r="3" class="flow-dot"><animateMotion dur="7s" begin="-3.5s" repeatCount="indefinite" path="M 338 151 A 158 158 0 0 0 22 151" /></circle>
              <circle r="2.5" class="flow-dot"><animateMotion dur="5.5s" begin="-1.5s" repeatCount="indefinite" path="M 338 151 A 158 158 0 0 0 22 151" /></circle>
            </svg>
            <div class="half-orbit-center"><img :src="logoSrc" alt="Saptivo" class="half-saptivo-logo" /></div>
            <div class="source-bubble source-one" title="WhatsApp Business" aria-label="WhatsApp Business">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#25d366"/><path d="M12 5.4a6.6 6.6 0 0 0-5.7 9.9l-.9 3.3 3.4-.9A6.6 6.6 0 1 0 12 5.4z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.6 9.3c.3 1.7 2 3.5 3.8 4l.9-1-1.4-.9-.6.5c-.7-.3-1.4-1-1.7-1.7l.5-.6-.9-1.4z" fill="#fff"/></svg>
            </div>
            <div class="source-bubble source-facebook" title="Facebook" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path fill="#fff" d="M13.5 20.7v-7.4h2.5l.4-2.9h-2.9V8.6c0-.84.24-1.42 1.44-1.42h1.55V4.6c-.27-.04-1.2-.12-2.28-.12-2.28 0-3.84 1.39-3.84 3.95v1.97H7.8v2.9h2.57v7.4z"/></svg>
            </div>
            <div class="source-bubble source-two" title="3CX phone system" aria-label="3CX phone system">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="7" fill="#0f6cbd"/><text x="12" y="15.2" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.6" font-weight="700" fill="#fff">3CX</text></svg>
            </div>
            <div class="source-bubble source-three" title="Vodia PBX" aria-label="Vodia PBX">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="7" fill="#f4782a"/><path d="M6.5 7.5 12 17l5.5-9.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="source-bubble source-four" title="Google Calendar" aria-label="Google Calendar">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="20" height="19" rx="4" fill="#fff" stroke="#4285f4" stroke-width="1.8"/><path d="M2 8.5h20V7a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4z" fill="#4285f4"/><text x="12" y="19" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#4285f4">31</text></svg>
            </div>
            <div class="source-bubble source-five" title="REST API and webhooks" aria-label="REST API and webhooks">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="7" fill="#0f172a"/><path d="M9.5 8 5.5 12l4 4M14.5 8l4 4-4 4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
          <div class="sources-caption"><strong>One connected CRM</strong><span>Every channel. Every lead.</span></div>
        </article>

        <!-- Heading directly beside the CRM card -->
        <div class="heading-area"><h2 id="wi-heading">Why integrations matter for your CRM<span class="heading-dot">.</span></h2></div>

        <article class="bento-card stat-card"><div class="stat-orb"></div><div class="stat-content"><span class="mini-label light">DATA ACCURACY</span><strong>Live</strong><span class="stat-description">Data synced across your CRM</span></div></article>

        <article class="bento-card conversation-card">
          <div class="conversation-glow"></div><div class="conversation-top"><span class="mini-label light">CONVERSATION HISTORY</span><span class="conversation-sparkle">✳</span></div>
          <div class="conversation-center">
            <div class="chat-bubble bubble-a"><span class="chat-avatar">NS</span><div><small>Nimali Silva</small><p>Hi, I'd like to know more.</p></div></div>
            <div class="chat-bubble bubble-b"><span class="chat-avatar crm-avatar">S</span><div><small>Saptivo CRM</small><p>Conversation logged ✓</p></div></div>
            <div class="chat-status"><span class="status-dot"></span>Timeline updated</div>
          </div>
          <div class="conversation-bottom"><strong>Every conversation,<br />in one place.</strong><span>Nothing gets lost.</span></div>
        </article>

        <!-- Every lead directly above calendar -->
        <article class="bento-card capture-card"><div class="capture-glow"></div><div class="capture-content"><span class="mini-label light">AUTOMATIC CAPTURE</span><div class="capture-check"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="capture-bottom"><strong>Every lead.</strong><span>Captured automatically</span></div></div></article>

        <!-- Calendar: no symbols or eyebrow label -->
        <article class="bento-card calendar-card">
          <div class="calendar-copy"><h3>Never miss<br />the next step.</h3><p>Every follow-up lands on the right calendar, automatically.</p></div>
          <div class="calendar-mockup"><div class="calendar-device"><div class="device-notch"></div><div class="device-content">
            <div class="device-header"><span>Calendar</span><span>•••</span></div><div class="device-month"><strong>November 2026</strong><span>‹ &nbsp; ›</span></div>
            <div class="calendar-days"><span v-for="(d,i) in days" :key="i">{{ d }}</span></div>
            <div class="calendar-dates"><span v-for="d in dates" :key="d" :class="{ selected: d === 18 }">{{ d }}</span></div>
            <div class="device-divider"></div><div class="schedule-title">Upcoming</div>
            <div class="schedule-event"><div class="event-time"><strong>10:30</strong><small>AM</small></div><div class="event-info"><strong>Follow-up call</strong><span>Nimali Silva</span></div></div>
            <div class="schedule-event second-event"><div class="event-time"><strong>02:00</strong><small>PM</small></div><div class="event-info"><strong>Product demo</strong><span>New prospect</span></div></div>
          </div></div></div>
          <div class="floating-confirmation"><span class="confirmation-icon">✓</span><div><strong>Follow-up scheduled</strong><small>Added to your calendar</small></div></div>
        </article>
      </div>
      <div class="wi-description"><span class="description-marker"></span><p>A CRM is only as good as the data inside it. When enquiries, calls and chats have to be copied in by hand, they often aren't, and your reports quietly stop telling the truth. Integrations remove that gap. Every lead is captured, every conversation is logged and every follow-up appears on the right calendar, without relying on anyone's memory.</p></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'SectionWhyIntegrations' })
const root = ref(null)
const shown = ref(false)
// Place your actual Saptivo logo at public/saptivo-logo.png
const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const dates = Array.from({ length: 28 }, (_, i) => i + 1)
let observer = null
onMounted(() => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { shown.value = true; return }
  observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { shown.value = true; observer?.disconnect() } }, { threshold: 0.12 })
  if (root.value) observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Urbanist:wght@500;600;700&display=swap');
</style>

<style scoped>

.why-integrations{--ink:#0a0a0a;--ease:cubic-bezier(.2,.8,.2,1);width:100%;padding:clamp(48px,7vw,100px) 24px;background:#fff;color:var(--ink);font-family:'Urbanist',system-ui,sans-serif}
.why-integrations *,.why-integrations *::before,.why-integrations *::after{box-sizing:border-box}
.wi-container{max-width:1240px;margin:auto}
.bento-grid{display:grid;grid-template-columns:.8fr 1.2fr 1.15fr 1.15fr;grid-template-rows:220px 170px 190px;gap:14px}
.bento-card{position:relative;min-width:0;overflow:hidden;border-radius:22px;isolation:isolate}
.mini-label{font-family:'Poppins',sans-serif;font-size:9px;font-weight:600;letter-spacing:1px;color:#64748b}.mini-label.light{color:rgba(255,255,255,.9)}
/* Top row */
.sources-card{grid-column:1/3;grid-row:1;background:#fff;border:none}
.heading-area{grid-column:3/5;grid-row:1;display:flex;align-items:center;padding:10px 4px 10px 26px;min-width:0}
.heading-area h2{margin:0;font-size:clamp(34px,3.6vw,52px);font-weight:600;line-height:1.06;letter-spacing:-.045em;overflow-wrap:normal}.heading-dot{color:#ee8d82}
.sources-top{position:absolute;z-index:5;top:16px;left:20px;right:20px;display:flex;align-items:center;justify-content:space-between}
.live-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;background:#e7f5eb;color:#268453;border-radius:20px;font:600 10px 'Poppins',sans-serif}.live-tag i{width:7px;height:7px;background:#2fb36a;border-radius:50%;animation:syncPulse 2s infinite}
.orbit-container{position:absolute;width:min(100%,400px);height:260px;left:50%;top:-8px;transform:translateX(-50%)}
.orbit{position:absolute;top:50%;left:50%;border:1px solid rgba(125,145,140,.18);border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;animation:orbitGlow 4s ease-in-out infinite}
.orbit-one{width:105px;height:105px}.orbit-two{width:185px;height:185px;animation-delay:.8s}.orbit-three{width:270px;height:270px;animation-delay:1.6s}
.connection-svg{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none}.connection-path{fill:none;stroke:#cbded4;stroke-width:1.3;stroke-dasharray:3 5;opacity:.8}.flow-dot{fill:#50a77b}
.orbit-center{position:absolute;z-index:4;top:50%;left:50%;width:90px;height:90px;display:grid;place-items:center;transform:translate(-50%,-50%);background:#fff;border:1px solid #edf0ee;border-radius:50%;box-shadow:0 8px 28px rgba(35,65,55,.09),0 0 0 7px rgba(230,240,235,.45);animation:centerBreathe 4s ease-in-out infinite}
.saptivo-logo{position:relative;z-index:2;width:75px;max-height:55px;object-fit:contain;filter:brightness(0)}.center-pulse{position:absolute;inset:-8px;border:2px solid rgba(90,165,125,.25);border-radius:50%;animation:logoPulse 3s ease-out infinite}
.source-bubble{position:absolute;z-index:3;width:40px;height:40px;display:grid;place-items:center;border-radius:13px;background:#fff;border:1px solid #edf0f2;box-shadow:0 6px 20px rgba(35,65,55,.1)}.source-bubble svg{width:25px;height:25px}
.source-one{top:14%;left:14%;animation:floatOne 4s ease-in-out infinite}.source-two{top:14%;right:14%;animation:floatTwo 4.5s ease-in-out infinite}.source-three{bottom:14%;left:14%;animation:floatThree 5s ease-in-out infinite}.source-four{bottom:14%;right:14%;animation:floatFour 4.2s ease-in-out infinite}
.sources-caption{position:absolute;z-index:5;left:20px;bottom:16px;display:flex;flex-direction:column;gap:3px}.sources-caption strong{font-size:17px;font-weight:600}.sources-caption span{font-size:11px;color:#64748b}
/* Lower bento layout */
.stat-card{grid-column:1;grid-row:2;background:linear-gradient(145deg,#b8d0aa,#84aa7d 55%,#527e60)}.stat-orb{position:absolute;width:180px;height:180px;right:-80px;top:-75px;border-radius:50%;background:rgba(255,255,255,.22);filter:blur(15px)}.stat-content{position:relative;height:100%;display:flex;flex-direction:column;padding:17px}.stat-content strong{margin-top:auto;font-size:clamp(35px,4vw,52px);line-height:1;font-weight:600;color:#fff;letter-spacing:-2px}.stat-description{max-width:140px;margin-top:7px;font-size:12px;font-weight:500;line-height:1.3;color:#fff}
.conversation-card{grid-column:2;grid-row:2/4;background:linear-gradient(160deg,#f9c9b6,#f39a8e 55%,#e66f79)}.conversation-glow{position:absolute;width:250px;height:250px;right:-90px;top:35px;border-radius:50%;background:rgba(255,227,165,.5);filter:blur(28px)}.conversation-top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:18px}.conversation-sparkle{font-size:26px;color:#fff}.conversation-center{position:relative;z-index:2;height:160px;margin:0 12px}.chat-bubble{position:absolute;display:flex;gap:8px;width:90%;padding:10px;border-radius:12px;background:rgba(255,255,255,.94);box-shadow:0 8px 25px rgba(139,58,66,.12)}.bubble-a{top:12px;left:0;transform:rotate(-3deg)}.bubble-b{top:78px;right:0;transform:rotate(3deg)}.chat-avatar{flex-shrink:0;width:27px;height:27px;display:grid;place-items:center;border-radius:50%;background:#f2d7ca;font:600 9px 'Poppins',sans-serif}.crm-avatar{background:#dbe9f2;color:#3f6593}.chat-bubble small{display:block;font-size:10px;font-weight:600}.chat-bubble p{margin:3px 0 0;font-size:10px;color:#566273}.chat-status{position:absolute;top:138px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:20px;background:#fff4d8;font:600 9px 'Poppins',sans-serif;white-space:nowrap}.status-dot{width:6px;height:6px;border-radius:50%;background:#3ca76a}.conversation-bottom{position:absolute;left:18px;right:18px;bottom:20px;display:flex;flex-direction:column;gap:6px}.conversation-bottom strong{font-size:25px;font-weight:600;line-height:1.1;letter-spacing:-.7px;color:#fff}.conversation-bottom span{font-size:11px;font-weight:500;color:#fff}
.capture-card{grid-column:3;grid-row:2;background:linear-gradient(145deg,#d2ded1,#a5bba8 45%,#728f7d)}.capture-glow{position:absolute;width:220px;height:220px;right:-65px;top:-80px;border-radius:50%;background:rgba(255,255,255,.3);filter:blur(20px)}.capture-content{position:relative;z-index:1;height:100%;padding:18px;display:flex;flex-direction:column;justify-content:space-between}.capture-check{position:absolute;right:25px;top:50%;transform:translateY(-50%);width:58px;height:58px;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.25);border:1px solid rgba(255,255,255,.5);backdrop-filter:blur(8px)}.capture-check svg{width:28px;height:28px;color:#fff}.capture-bottom{display:flex;flex-direction:column;gap:3px}.capture-bottom strong{font-size:27px;font-weight:600;color:#fff;letter-spacing:-.7px}.capture-bottom span{font-size:12px;font-weight:500;color:rgba(255,255,255,.9)}
.calendar-card{grid-column:3/5;grid-row:3;background:#e9eee5}.calendar-copy{position:relative;z-index:2;width:52%;padding:23px 20px}.calendar-copy h3{margin:0 0 10px;font-size:clamp(23px,2.4vw,33px);font-weight:600;line-height:1.08;letter-spacing:-.04em}.calendar-copy p{max-width:205px;margin:0;font-size:11px;line-height:1.45;color:#64748b}
.calendar-mockup{position:absolute;right:8%;top:15px;width:190px;height:330px;z-index:1}.calendar-device{position:relative;width:100%;height:100%;padding:7px;border-radius:29px;background:#151515;box-shadow:0 18px 35px rgba(0,0,0,.2);transform:rotate(-4deg)}.device-notch{position:absolute;z-index:3;top:12px;left:50%;width:58px;height:14px;border-radius:12px;background:#151515;transform:translateX(-50%)}.device-content{height:100%;padding:27px 12px 12px;border-radius:23px;background:#fff;overflow:hidden;font-family:'Poppins',sans-serif}.device-header,.device-month{display:flex;align-items:center;justify-content:space-between}.device-header{font-size:10px;font-weight:600}.device-month{margin-top:17px;font-size:9px}.device-month span{color:#7c8794}.calendar-days,.calendar-dates{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;gap:3px}.calendar-days{margin-top:14px;font-size:7px;color:#9aa3ad}.calendar-dates{margin-top:8px;font-size:8px}.calendar-dates span{height:16px;display:grid;place-items:center}.calendar-dates .selected{border-radius:50%;background:#ee8d82;color:#fff}.device-divider{height:1px;margin:13px 0;background:#eef0f3}.schedule-title{font-size:10px;font-weight:600}.schedule-event{display:flex;gap:9px;margin-top:10px;padding:9px 7px;border-radius:7px;background:#fce8e6}.second-event{background:#eaf1e8}.event-time,.event-info{display:flex;flex-direction:column;gap:3px}.event-time strong,.event-info strong{font-size:8px}.event-time small,.event-info span{font-size:7px}.event-info span{color:#6b7280}.floating-confirmation{position:absolute;z-index:4;right:130px;bottom:14px;display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:10px;background:#fff;box-shadow:0 8px 24px rgba(24,39,66,.12);white-space:nowrap}.confirmation-icon{width:23px;height:23px;display:grid;place-items:center;border-radius:50%;background:#e4f6eb;color:#25995a;font-size:12px}.floating-confirmation div{display:flex;flex-direction:column;gap:3px}.floating-confirmation strong{font-size:9px;font-weight:600}.floating-confirmation small{font-size:8px;color:#8b95a1}
.wi-description{display:flex;align-items:flex-start;gap:18px;max-width:850px;margin:38px auto 0}.description-marker{flex-shrink:0;width:30px;height:2px;margin-top:13px;background:#ee8d82}.wi-description p{margin:0;font-size:clamp(15px,1.2vw,17px);font-weight:500;line-height:1.75;color:#475569}
@keyframes orbitGlow{0%,100%{border-color:rgba(125,145,140,.12)}50%{border-color:rgba(75,140,110,.35)}}@keyframes centerBreathe{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.045)}}@keyframes logoPulse{0%{transform:scale(.9);opacity:.7}70%,100%{transform:scale(1.45);opacity:0}}@keyframes floatOne{50%{transform:translateY(-9px)}}@keyframes floatTwo{50%{transform:translateY(8px)}}@keyframes floatThree{50%{transform:translateY(-7px)}}@keyframes floatFour{50%{transform:translateY(7px)}}@keyframes syncPulse{50%{opacity:.5;box-shadow:0 0 0 7px rgba(47,179,106,.08)}}
@media (prefers-reduced-motion:no-preference){.bento-grid>* , .wi-description{opacity:0;transform:translateY(22px);transition:opacity .8s var(--ease),transform .9s var(--ease)}.is-visible .bento-grid>*,.is-visible .wi-description{opacity:1;transform:translateY(0)}.is-visible .bento-grid>:nth-child(2){transition-delay:.08s}.is-visible .bento-grid>:nth-child(3){transition-delay:.14s}.is-visible .bento-grid>:nth-child(4){transition-delay:.2s}.is-visible .bento-grid>:nth-child(5){transition-delay:.26s}.is-visible .bento-grid>:nth-child(6){transition-delay:.32s}.is-visible .wi-description{transition-delay:.4s}}


/* =====================================================
   REFERENCE-INSPIRED ASYMMETRIC MOSAIC
   Wide orbit / tall conversation / editorial heading
   Small live card / tall capture / wide calendar
   ===================================================== */
.why-integrations {
  padding: clamp(48px, 6vw, 86px) clamp(18px, 3vw, 40px);
}
.wi-container { max-width: 1240px; }
.bento-grid {
  display: grid;
  grid-template-columns: minmax(0,.88fr) minmax(0,1.12fr) minmax(0,1.14fr) minmax(0,1.12fr);
  grid-template-rows: 226px 168px 168px;
  gap: 14px;
  align-items: stretch;
}
.bento-card { border-radius: 22px; }
/* The airy illustration occupies the entire left side of the first row. */
.sources-card {
  grid-column: 1 / 3;
  grid-row: 1;
  background: #fff !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0;
  overflow: hidden;
}
/* Tall peach tile like the vertical feature image in the example. */
.conversation-card {
  grid-column: 3;
  grid-row: 1 / 3;
}
.heading-area {
  grid-column: 4;
  grid-row: 1 / 3;
  padding: 14px 0 0 22px;
  display: flex;
  align-items: flex-start;
}
.heading-area h2 {
  font-size: clamp(36px, 3.9vw, 57px);
  line-height: 1.035;
  letter-spacing: -0.055em;
  font-weight: 600;
  text-wrap: balance;
  overflow-wrap: break-word;
}
.stat-card { grid-column: 1; grid-row: 2; }
/* Portrait tile below the half-circle, like the orange center tile in the example. */
.capture-card { grid-column: 2; grid-row: 2 / 4; }
.calendar-card { grid-column: 3 / 5; grid-row: 3; }
/* The Saptivo mark sits below the upper semicircle; never give it a badge/border. */
.half-orbit {
  position: absolute;
  top: 10px;
  left: 54%;
  width: min(92%, 360px);
  height: 180px;
  transform: translateX(-50%);
  pointer-events: none;
}
.half-ring {
  position: absolute;
  bottom: 17px;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid rgba(130, 158, 145, .18);
  border-bottom: 0;
  border-radius: 200px 200px 0 0;
  animation: arcBreathe 5.5s ease-in-out infinite;
}
.ring-outer { width: 316px; height: 158px; max-width: 100%; }
.ring-middle { width: 234px; height: 117px; animation-delay: -1.6s; }
.ring-inner { width: 146px; height: 73px; animation-delay: -3.2s; }
.half-flow { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.half-flow path { fill: none; stroke: #c4dcd0; stroke-width: 1; stroke-dasharray: 2 6; opacity: .52; }
.half-flow .flow-dot { fill: #43a774; filter: drop-shadow(0 0 3px #71bd93); }
.half-orbit-center {
  position: absolute;
  z-index: 5;
  left: 50%; bottom: 0;
  width: 112px; height: 49px;
  transform: translateX(-50%);
  display: grid; place-items: center;
  background: transparent; border: 0; outline: 0; box-shadow: none; border-radius: 0;
}
.half-saptivo-logo {
  width: 106px;
  max-height: 46px;
  object-fit: contain;
  filter: brightness(0);
}
.half-orbit .source-bubble {
  position: absolute;
  z-index: 6;
  width: 36px; height: 36px;
  display: grid; place-items: center;
  border: 0; border-radius: 12px;
  background: white;
  box-shadow: 0 7px 21px rgba(29, 57, 49, .10);
  animation: halfFloat 4.3s ease-in-out infinite;
}
.half-orbit .source-bubble svg { width: 25px; height: 25px; }
.half-orbit .source-one { left: 1%; top: 73%; animation-delay: -.1s; }
.half-orbit .source-facebook { left: 13%; top: 23%; animation-delay: -.8s; }
.half-orbit .source-two { left: 49%; top: -3%; animation-delay: -1.5s; }
.half-orbit .source-three { right: 14%; left: auto; top: 22%; bottom: auto; animation-delay: -2.4s; }
.half-orbit .source-four { right: 1%; left: auto; top: 73%; bottom: auto; animation-delay: -3.0s; }
.half-orbit .source-five { right: 27%; left: auto; top: 2%; bottom: auto; animation-delay: -2s; }
.sources-caption { bottom: 12px; left: 16px; z-index: 8; }
.sources-caption strong { font-size: 18px; }
.sources-caption span { font-size: 11px; }
/* The original card contents remain, adjusted to the taller editorial format. */
.conversation-center { height: 179px; margin-top: 18px; }
.bubble-a { top: 7px; }
.bubble-b { top: 80px; }
.chat-status { top: 151px; }
.conversation-bottom { bottom: 23px; }
.conversation-bottom strong { font-size: clamp(23px, 2.2vw, 29px); }
.capture-content { padding: 20px; }
.capture-check {
  position: absolute;
  top: 43%; left: 50%; right: auto;
  transform: translate(-50%, -50%);
  width: 86px; height: 86px;
  border: 1px solid rgba(255,255,255,.7);
  border-radius: 50%;
  background: rgba(255,255,255,.2);
  box-shadow: 0 0 0 15px rgba(255,255,255,.08), 0 0 0 37px rgba(255,255,255,.045);
}
.capture-check svg { width: 38px; height: 38px; }
.capture-bottom strong { font-size: 30px; }
.capture-bottom span { font-size: 13px; }
.calendar-copy { padding: 22px 20px; }
.calendar-mockup { top: 4px; }
.wi-description { max-width: 900px; margin-top: 42px; }
@keyframes arcBreathe { 0%,100% {opacity: .3} 50% {opacity: .9} }
@keyframes halfFloat { 0%,100% {translate: 0 0} 50% {translate: 0 -7px} }
/* Tablet: preserve intentional big/small rhythm but avoid cramped heading. */
@media (max-width: 1000px) {
  .bento-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: 230px 180px 180px;
  }
  .heading-area { padding-left: 12px; }
  .heading-area h2 { font-size: clamp(30px, 4.1vw, 44px); }
  .calendar-mockup { right: 3%; }
}
@media (max-width: 760px) {
  .bento-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: auto; gap: 12px; }
  .heading-area { grid-column: 1/3; grid-row: 1; padding: 0 0 14px; }
  .heading-area h2 { font-size: clamp(36px, 6.4vw, 50px); }
  .sources-card { grid-column: 1/3; grid-row: 2; height: 242px; }
  .stat-card { grid-column: 1; grid-row: 3; height: 175px; }
  .capture-card { grid-column: 2; grid-row: 3; height: 175px; }
  .capture-check { width: 54px; height: 54px; left: auto; right: 15px; top: 49%; transform: translateY(-50%); box-shadow: 0 0 0 10px rgba(255,255,255,.08); }
  .capture-check svg { width: 25px; height: 25px; }
  .capture-bottom strong { font-size: 23px; }
  .capture-bottom span { font-size: 11px; }
  .conversation-card { grid-column: 1; grid-row: 4; height: 340px; }
  .calendar-card { grid-column: 2; grid-row: 4; height: 340px; }
  .conversation-bottom strong { font-size: 23px; }
  .calendar-copy { width: 100%; }
  .calendar-mockup { top: 165px; right: 5%; width: 150px; }
  .floating-confirmation { right: 50px; bottom: 14px; }
}
@media (max-width: 520px) {
  .why-integrations { padding: 48px 16px; }
  .heading-area h2 { font-size: clamp(32px, 8.8vw, 44px); }
  .bento-grid { gap: 10px; }
  .bento-card { border-radius: 18px; }
  .sources-card { height: 238px; border-radius: 0; }
  .half-orbit { width: min(93%, 330px); height: 161px; left: 51%; top: 20px; }
  .ring-outer { width: 290px; height: 145px; }
  .ring-middle { width: 210px; height: 105px; }
  .ring-inner { width: 132px; height: 66px; }
  .half-orbit .source-bubble { width: 33px; height: 33px; }
  .half-orbit .source-bubble svg { width: 23px; height: 23px; }
  .half-orbit-center { width: 96px; height: 45px; }
  .half-saptivo-logo { width: 90px; }
  .stat-card, .capture-card { height: 160px; }
  .stat-content strong { font-size: 39px; }
  .capture-bottom strong { font-size: 21px; }
  .conversation-card { grid-column: 1/3; grid-row: 4; height: 318px; }
  .calendar-card { grid-column: 1/3; grid-row: 5; height: 270px; }
  .calendar-copy { width: 54%; }
  .calendar-mockup { top: 24px; right: 5%; width: 160px; }
  .floating-confirmation { right: 82px; bottom: 16px; }
  .wi-description { margin-top: 30px; gap: 12px; }
  .wi-description p { font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .why-integrations *, .why-integrations *::before, .why-integrations *::after { animation: none !important; transition: none !important; }
  .half-flow .flow-dot { display: none; }
}

</style>
