<template>
  <section ref="root" class="mc" :class="{ 'mc-arm': armed, 'mc-in': shown }" aria-label="WhatsApp, 3CX and Vodia integrations">
    <div class="mc-wrap">
      <div class="mc-top">
        <!-- ============ 1 · WhatsApp Business API ============ -->
        <article class="mc-card mc-green" style="--i: 0">
          <div class="mc-txt">
            <h2 class="mc-h">WhatsApp Business API</h2>
            <p class="mc-p">
              Connect your official WhatsApp Business number and turn it into a shared team inbox. Chats, media and
              templates sync both ways, and every conversation is logged on the customer timeline.
            </p>
            <router-link class="mc-btn" :to="links.whatsapp">
              Learn more about WhatsApp CRM
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </router-link>
          </div>

          <div class="mc-vis" aria-hidden="true">
            <div class="win win-wa">
              <div class="win-h">
                <img class="win-logo" :src="logoSrc" alt="" draggable="false" />
                <b>Shared inbox</b>
                <em class="chip ok"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg>Synced</em>
              </div>

              <div class="chat">
                <div class="bub in" :class="{ show: tick >= 1 }"><u></u><u class="s"></u></div>
                <div class="bub out" :class="{ show: tick >= 2 }">
                  <span class="tag">Template</span>
                  <u></u><u class="s"></u>
                </div>
                <div class="bub in media" :class="{ show: tick >= 3 }">
                  <span class="img"><svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10.5" r="1.6" /><path d="m4.5 17 4.5-4.5 3.5 3.5 2.5-2.5 4.5 4.5" /></svg></span>
                  <small>Media</small>
                </div>
              </div>

              <div class="log" :class="{ show: tick >= 4 }">
                <i><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg></i>
                Logged on customer timeline
              </div>
            </div>
          </div>
        </article>

        <!-- ============ 2 · 3CX phone system ============ -->
        <article class="mc-card mc-blue" style="--i: 1">
          <div class="mc-txt">
            <h2 class="mc-h">3CX phone system</h2>
            <p class="mc-p">
              Map your 3CX DID, queues and extensions to Saptivo. Incoming calls open the caller's record before you
              answer, every call is logged with duration and outcome, and missed calls turn into callback tasks.
            </p>
            <router-link class="mc-btn" :to="links.cx">
              Learn more about 3CX call integration
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </router-link>
          </div>

          <div class="mc-vis" aria-hidden="true">
            <div class="win win-cx">
              <div class="win-h">
                <img class="win-logo" :src="logoSrc" alt="" draggable="false" />
                <b>{{ tick < 2 ? 'Incoming call' : miss ? 'Missed call' : 'Call' }}</b>
                <em class="chip" :class="tick >= 5 ? 'ok' : 'wip'">
                  <svg v-if="tick >= 5" viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg>
                  <i v-else></i>
                  {{ tick >= 5 ? 'Logged' : tick < 2 ? 'Ringing' : miss ? 'Not answered' : 'In call' }}
                </em>
              </div>

              <div class="map">
                <span>DID</span><span>Queue</span><span>Extension</span>
              </div>

              <div class="rec" :class="{ show: tick >= 1 }">
                <small>Caller record</small>
                <div class="who"><span class="av"></span><div><u></u><u class="s"></u></div></div>
              </div>

              <div class="rows">
                <div class="r"><span>Duration</span><b class="tm">{{ miss ? '—' : tick >= 5 ? '02:14' : tick >= 2 ? '00:0' + Math.min(tick, 9) : '—' }}</b></div>
                <div class="r"><span>Outcome</span><b :key="miss + '-' + (tick >= 5)">{{ tick < 5 ? '…' : miss ? 'Missed' : 'Answered' }}</b></div>
                <div v-if="miss" class="r task" :class="{ show: tick >= 6 }"><span>Callback task</span><b>Created</b></div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- ============ 3 · Vodia PBX and AI voice agents (wide) ============ -->
      <article class="mc-card mc-wide mc-lilac" style="--i: 2">
        <div class="mc-txt">
          <h2 class="mc-h">Vodia PBX and AI voice agents</h2>
          <p class="mc-p">
            Connect a Vodia phone system to log calls, pop up caller details and click to call, just as with 3CX.
            Vodia's AI voice agents can also call customers for appointment, payment and renewal reminders using
            Saptivo data, and the outcome of each call comes back into the CRM.
          </p>
          <router-link class="mc-btn" :to="links.vodia">
            Learn more about Vodia integration and AI calls
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </router-link>
        </div>

        <div class="mc-vis mc-vis-wide" aria-hidden="true">
          <div class="win win-vo1">
            <div class="win-h">
              <img class="win-logo" :src="logoSrc" alt="" draggable="false" />
              <b>Caller details</b>
            </div>
            <div class="who"><span class="av"></span><div><u></u><u class="s"></u></div></div>
            <div class="rows">
              <div class="r"><span>Call log</span><b>Logged</b></div>
            </div>
            <span class="call" :class="{ on: tick % 4 < 2 }">
              <svg viewBox="0 0 24 24"><path d="M6.6 3.5h3l1.3 4-2 1.3a11 11 0 0 0 5.3 5.3l1.3-2 4 1.3v3a2 2 0 0 1-2.2 2A15.8 15.8 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" /></svg>
              Click to call
            </span>
          </div>

          <div class="win win-vo2">
            <div class="win-h">
              <b>AI voice agent</b>
              <em class="chip ok"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg>Saptivo data</em>
            </div>
            <ul class="rem">
              <li v-for="(r, k) in reminders" :key="r" :class="{ on: Math.floor(tick / 2) % 3 === k }">
                <i></i>{{ r }}
              </li>
            </ul>
            <div class="back" :class="{ show: tick % 2 === 1 }">
              <i><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg></i>
              Outcome back in the CRM
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
/**
 * SectionMessagingCalls.vue — WhatsApp Business API · 3CX phone system · Vodia PBX and AI voice agents (Vue 3, <script setup>)
 *
 * Layout like the Sendbird reference: two cards on top, one full-width card underneath. Each card has the title and
 * paragraph (your copy word for word), a white "Learn more" pill, and a white product window that bleeds off the
 * bottom edge. Windows only use ideas from the copy (shared inbox, chats / media / templates, customer timeline;
 * DID / queue / extension, caller record, duration and outcome, callback task; caller details, click to call,
 * appointment / payment / renewal reminders, outcome back in the CRM). Grey bars are placeholders, no real names.
 * • Windows play a short loop while on screen. prefers-reduced-motion respected. SSR / Nuxt safe.
 * • The "Learn more" targets are in `links` below. The Vodia path is a guess, change it to your real route.
 * • Saptivo logo: public/saptivo-logo.png (same file the footer uses), shown in black.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'SectionMessagingCalls' })

const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`
const links = {
  whatsapp: '/features/whatsapp-crm/',
  cx: '/features/3cx-crm-integration/',
  vodia: '/integrations/vodia/',
}
const reminders = ['Appointment reminder', 'Payment reminder', 'Renewal reminder']

const root = ref(null)
const armed = ref(false)
const shown = ref(false)
const tick = ref(0) // demo clock 0..7
const miss = ref(false) // 3CX card alternates answered / missed
const LOOP = 8

let io = null
let t = null
let inView = false
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
    { threshold: 0.15 },
  )
  io.observe(root.value)
  t = setInterval(() => {
    if (!inView || document.hidden) return
    const n = (tick.value + 1) % LOOP
    if (n === 0) miss.value = !miss.value
    tick.value = n
  }, 1100)
})
onBeforeUnmount(() => {
  io?.disconnect()
  clearInterval(t)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Urbanist:wght@500;600&display=swap');
</style>

<style scoped>
.mc {
  --ink: #0f172a;
  --mute: #6b7280;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  padding: clamp(36px, 5vw, 72px) clamp(14px, 3vw, 32px);
  background: #fff;
  color: var(--ink);
  font-family: 'Poppins', system-ui, sans-serif;
}
.mc *,
.mc *::before,
.mc *::after {
  box-sizing: border-box;
}
.mc svg {
  display: block;
}
.mc-wrap {
  display: grid;
  gap: clamp(12px, 1.4vw, 20px);
  max-width: 1240px;
  margin: 0 auto;
}
.mc-top {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(12px, 1.4vw, 20px);
}

/* ---------- cards ---------- */
.mc-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: clamp(540px, 46vw, 640px);
  padding: clamp(26px, 3vw, 40px) clamp(22px, 3vw, 40px) 0;
  border-radius: clamp(22px, 2.4vw, 30px);
  overflow: hidden;
  isolation: isolate;
}
.mc-green { background: #dcefe2; }
.mc-blue { background: #d9e6f2; }
.mc-lilac { background: #e6e2f3; }

.mc-h {
  margin: 0 !important;
  font-family: Urbanist, 'Urbanist Placeholder', sans-serif !important;
  font-size: clamp(26px, 2.6vw, 36px) !important;
  font-weight: 600 !important;
  line-height: 1.12 !important;
  letter-spacing: -0.04em !important;
  color: #0a0a0a !important;
}
.mc-p {
  max-width: 520px;
  margin: 14px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1.1vw, 17px);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.01em;
  color: #4b5563;
}
.mc-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  padding: 11px 18px;
  border-radius: 8px;
  background: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #0a0a0a;
  text-decoration: none;
  transition: transform 0.25s var(--ease), background 0.25s;
}
.mc-btn svg {
  flex: none;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.25s var(--ease);
}
.mc-btn:hover { background: #0a0a0a; color: #fff; }
.mc-btn:hover svg { transform: translateX(3px); }
.mc-btn:focus-visible { outline: 2px solid #0a0a0a; outline-offset: 3px; }

/* ---------- visual area ---------- */
.mc-vis {
  position: relative;
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-top: clamp(26px, 3vw, 40px);
  min-height: 250px;
}

/* wide card: text left, visual right */
.mc-wide {
  flex-direction: row;
  align-items: stretch;
  gap: clamp(24px, 4vw, 64px);
  min-height: clamp(400px, 34vw, 480px);
}
.mc-wide .mc-txt {
  flex: 0 1 44%;
  align-self: center;
  padding-bottom: clamp(26px, 3vw, 40px);
}
.mc-vis-wide {
  flex: 1 1 56%;
  margin-top: clamp(26px, 3vw, 40px);
  gap: 14px;
  justify-content: flex-end;
}

/* ---------- white windows ---------- */
.win {
  width: min(86%, 440px);
  padding: 18px 20px 22px;
  border-radius: 16px 16px 0 0;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(23, 50, 90, 0.05), 0 30px 60px -30px rgba(23, 50, 90, 0.4);
}
.win-h {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f1f4;
}
.win-h b {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.win-logo {
  flex: none;
  display: block;
  width: auto;
  height: 16px;
  max-width: 76px;
  object-fit: contain;
  filter: brightness(0); /* logo in black */
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  font-style: normal;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.4s, color 0.4s;
}
.chip svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.chip.ok { background: #e6f8ef; color: #16a05a; }
.chip.wip { background: #fff1d6; color: #b7740b; }
.chip.wip i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: mc-blink 1.2s ease-in-out infinite;
}
u {
  display: block;
  height: 8px;
  border-radius: 8px;
  background: #eceef3;
  text-decoration: none;
}
u.s { width: 60%; margin-top: 7px; }

/* the two top windows share one height so they line up */
.win-wa,
.win-cx { min-height: 340px; }

/* WhatsApp window */
.chat {
  display: grid;
  gap: 10px;
  padding: 16px 0 14px;
}
.bub {
  width: 70%;
  padding: 12px 14px;
  border-radius: 14px;
  opacity: 0.18;
  transform: translateY(6px);
  transition: opacity 0.5s ease, transform 0.6s var(--ease);
}
.bub.show { opacity: 1; transform: none; }
.bub.in { background: #f2f3f6; border-bottom-left-radius: 4px; }
.bub.out { justify-self: end; background: #d9f3dd; border-bottom-right-radius: 4px; }
.bub.out u { background: #b5e2bd; }
.bub .tag {
  display: inline-block;
  margin-bottom: 8px;
  padding: 2px 8px;
  border-radius: 6px;
  background: #fff;
  font-size: 11px;
  font-weight: 500;
  color: #16a05a;
}
.bub.media { display: flex; align-items: center; gap: 10px; width: 54%; }
.bub .img {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #fff;
  color: #8b93a1;
}
.bub .img svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bub small { font-size: 12px; color: var(--mute); }
.log {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f1f4;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  opacity: 0.25;
  transition: opacity 0.5s ease;
}
.log.show { opacity: 1; }
.log i, .back i {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e6f8ef;
  color: #16a05a;
}
.log svg, .back svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 3CX window */
.map {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 0;
}
.map span {
  padding: 5px 11px;
  border-radius: 8px;
  background: #f4f5f7;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
}
.rec {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f6f7f9;
  opacity: 0.25;
  transition: opacity 0.5s ease;
}
.rec.show { opacity: 1; }
.rec small, .rem small { font-size: 12px; color: var(--mute); }
.who {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
.who > div { flex: 1; }
.av {
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #cfdcec;
}
.rows { padding-top: 6px; }
.r {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  font-size: 13.5px;
  color: var(--mute);
}
.r + .r { border-top: 1px solid #f0f1f4; }
.r b { font-size: 14px; font-weight: 600; color: var(--ink); letter-spacing: -0.01em; animation: mc-swap 0.5s var(--ease); }
.tm { font-variant-numeric: tabular-nums; }
.r.task { opacity: 0.2; transition: opacity 0.5s ease; }
.r.task.show { opacity: 1; }
.r.task b { color: #16a05a; }

/* Vodia windows */
.win-vo1 { width: min(44%, 250px); }
.win-vo2 { width: min(52%, 300px); }
.win-vo1 .who { padding: 14px 0 6px; margin: 0; }
.call {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 9px 14px;
  border-radius: 8px;
  background: #0a0a0a;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  transition: transform 0.4s var(--ease), box-shadow 0.4s;
}
.call.on { transform: scale(1.04); box-shadow: 0 0 0 5px rgba(10, 10, 10, 0.08); }
.call svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linejoin: round;
}
.rem {
  list-style: none;
  margin: 0;
  padding: 12px 0 8px;
  display: grid;
  gap: 8px;
}
.rem li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  background: #f6f7f9;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  transition: background 0.4s, color 0.4s;
}
.rem li i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cfd3db;
  transition: background 0.4s;
}
.rem li.on { background: #ece8f8; color: #0a0a0a; }
.rem li.on i { background: #7c5cd6; }
.back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid #f0f1f4;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  opacity: 0.25;
  transition: opacity 0.5s ease;
}
.back.show { opacity: 1; }

@keyframes mc-swap { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
@keyframes mc-blink { 50% { opacity: 0.3; } }

/* ---------- motion ---------- */
.mc-arm .mc-card {
  opacity: 0;
  transform: translateY(34px);
}
.mc-arm.mc-in .mc-card {
  opacity: 1;
  transform: none;
  transition: opacity 0.9s var(--ease), transform 1.1s var(--ease);
  transition-delay: calc(var(--i) * 0.14s);
}

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .mc-top { grid-template-columns: minmax(0, 1fr); }
  .mc-card { min-height: 0; }
  .mc-vis { min-height: 270px; }
  .mc-wide { flex-direction: column; gap: 0; min-height: 0; }
  .mc-wide .mc-txt { flex: none; align-self: stretch; padding-bottom: 0; }
  .mc-vis-wide { flex: none; width: 100%; }
}
@media (max-width: 560px) {
  .win-logo { display: none; } /* keeps the window titles from being cut off */
  .win { width: 94%; }
  .win-vo1 { width: 46%; padding: 14px 12px 18px; }
  .win-vo2 { width: 52%; padding: 14px 12px 18px; }
  .win-vo2 .chip { display: none; }
  .win-vo1 .call { font-size: 12px; padding: 8px 10px; }
  .mc-btn { font-size: 14px; padding: 10px 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .mc *,
  .mc *::before,
  .mc *::after {
    animation: none !important;
    transition: none !important;
  }
  .mc-arm .mc-card { opacity: 1; transform: none; }
}
</style>