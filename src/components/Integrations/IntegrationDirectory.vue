<template>
  <section ref="root" class="wc" :class="{ 'wc-arm': armed, 'wc-in': shown }" aria-labelledby="wc-title">
    <div class="wc-stage">
      <div class="wc-box">
        <span class="wc-glow" aria-hidden="true"></span>

        <!-- centre copy -->
        <header class="wc-head">
          <h2 id="wc-title" class="wc-title">Why integrations matter <span>for your CRM</span></h2>
          <p class="wc-sub">
            <b>A CRM is only as good as the data inside it.</b>
            When enquiries, calls and chats have to be copied in by hand, they often aren't, and your reports quietly
            stop telling the truth. Integrations remove that gap. Every lead is captured, every conversation is logged
            and every follow-up appears on the right calendar, without relying on anyone's memory.
          </p>
        </header>

        <!-- floating product windows (decorative) -->
        <div class="wc-cards" aria-hidden="true">
          <!-- 1 · lead captured -->
          <div class="win a" style="--i: 0; --x: 1.5; --y: 10; --w: 23; --r: -2.5deg">
            <div class="wh"><img :src="logoSrc" alt="" draggable="false" /><b>Lead captured</b><i class="ok"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg></i></div>
            <div class="lead-row">
              <span class="av"></span>
              <span class="lines"><u></u><u></u></span>
            </div>
            <span class="chip peach">New enquiry</span>
          </div>

          <!-- 2 · recent activity -->
          <div class="win b" style="--i: 1; --x: 36.5; --y: 0; --w: 27; --r: 0deg">
            <div class="wh"><img :src="logoSrc" alt="" draggable="false" /><b>Recent activity</b></div>
            <ul class="acts">
              <li v-for="(a, k) in acts" :key="a" :class="{ show: tick > k }">
                <span class="ic"><svg viewBox="0 0 24 24"><path v-for="(d, j) in icons[k]" :key="j" :d="d" /></svg></span>
                <span class="tx"><strong>{{ a }}</strong><u></u></span>
                <i class="ok"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg></i>
              </li>
            </ul>
          </div>

          <!-- 3 · calendar -->
          <div class="win c" style="--i: 2; --x: 75.5; --y: 6; --w: 23; --r: 2.5deg">
            <div class="wh"><img :src="logoSrc" alt="" draggable="false" /><b>Follow-up on calendar</b></div>
            <div class="cal">
              <span v-for="d in days" :key="d.k" class="cd">{{ d.l }}</span>
              <span v-for="n in 14" :key="'c' + n" class="cs" :class="{ hot: n === 10 }">
                <svg v-if="n === 10" viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg>
              </span>
            </div>
          </div>

          <!-- 4 · call -->
          <div class="win d" style="--i: 3; --x: 3; --y: 54; --w: 22; --r: 2deg">
            <div class="wh"><img :src="logoSrc" alt="" draggable="false" /><b>Call logged</b><i class="ok"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg></i></div>
            <div class="wave"><u v-for="n in 18" :key="n" :style="{ '--n': n }"></u></div>
            <span class="lines"><u></u><u></u></span>
          </div>

          <!-- 5 · chat -->
          <div class="win e" style="--i: 4; --x: 36; --y: 62; --w: 28; --r: -1.5deg">
            <div class="wh"><img :src="logoSrc" alt="" draggable="false" /><b>Conversation logged</b><i class="ok"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg></i></div>
            <div class="chat">
              <span class="bub l"><u></u><u></u></span>
              <span class="bub r"><u></u></span>
              <span class="bub l"><u></u></span>
            </div>
          </div>

          <!-- 6 · reports -->
          <div class="win f" style="--i: 5; --x: 75; --y: 52; --w: 23; --r: -2deg">
            <div class="wh"><img :src="logoSrc" alt="" draggable="false" /><b>Reports</b></div>
            <div class="bars"><u v-for="h in bars" :key="h" :style="{ '--h': h + '%' }"></u></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * WhyIntegrationsCards.vue — "Why integrations matter for your CRM" (Vue 3, <script setup>)
 *
 * Layout from the reference: your heading and paragraph in the middle, with small product windows floating around
 * them. The windows are decorative and use only wording from your copy (Lead captured, Conversation logged,
 * Follow-up on calendar, Call logged, Recent activity, Reports); lines and bars are placeholders, no figures.
 * • "Recent activity" ticks its three rows in a loop; the call waveform moves; the report bars grow in.
 * • Windows float gently and fly in from the centre on scroll. Positioned in container-query units so the whole
 *   composition scales; under 760px the windows become a tidy two-column grid below the text.
 * • The Saptivo logo (public/saptivo-logo.png, same file the footer uses) is shown in black in each window.
 * prefers-reduced-motion respected. SSR / Nuxt safe.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'WhyIntegrationsCards' })

const logoSrc = `${import.meta.env.BASE_URL}saptivo-logo.png`

const acts = ['Lead captured', 'Conversation logged', 'Follow-up on calendar']
const icons = [
  ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M19 8v6', 'M22 11h-6'],
  ['M7.9 20A9 9 0 1 0 4 16.1L2 22z'],
  ['M4 5h16v15H4z', 'M4 10h16', 'M8 3v4', 'M16 3v4'],
]
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, k) => ({ l, k }))
const bars = [34, 52, 44, 70, 62, 88]

const root = ref(null)
const armed = ref(false)
const shown = ref(false)
const tick = ref(0) // 0..4 for the activity rows

let io = null
let timer = null
let inView = false
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = true
    tick.value = 3
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
    tick.value = (tick.value + 1) % 6
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
.wc {
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --mute: #6b7280;
  padding: clamp(36px, 6vw, 96px) clamp(14px, 3vw, 40px);
  background: #fff;
  color: #0a0a0a;
  font-family: 'Urbanist', system-ui, sans-serif;
}
.wc *,
.wc *::before,
.wc *::after {
  box-sizing: border-box;
}
.wc svg {
  display: block;
}
.wc-stage {
  max-width: 1240px;
  margin: 0 auto;
  container-type: inline-size;
}
.wc-box {
  position: relative;
  min-height: 79cqw;
}

/* soft glow behind the copy */
.wc-glow {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 62cqw;
  height: 40cqw;
  translate: -50% -50%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(192, 214, 240, 0.45), rgba(192, 214, 240, 0) 100%);
  pointer-events: none;
}

/* ---------- centre copy ---------- */
.wc-head {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 21.5cqw;
  width: 50cqw;
  translate: -50% 0;
  text-align: center;
}
.wc-title {
  margin: 0;
  text-wrap: balance;
  font-family: Urbanist, "Urbanist Placeholder", sans-serif !important;
  font-size: clamp(28px, 4.4cqw, 54px) !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
  letter-spacing: -1px !important;
  color: #0a0a0a !important;
}
.wc-title span {
  background: none !important;
  color: #615f5a !important;
  -webkit-text-fill-color: #615f5a !important;
}
.wc-sub {
  max-width: 44cqw;
  margin: clamp(10px, 1.6cqw, 20px) auto 0;
  font-size: clamp(13px, 1.3cqw, 16px);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.01em;
  color: #6b7280;
}
.wc-sub b {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #0a0a0a;
}

/* ---------- floating windows ---------- */
.win {
  --u: clamp(8.5px, 1.1cqw, 14px); /* base font / spacing unit for everything inside a window */
  position: absolute;
  z-index: 1;
  left: calc(var(--x) * 1cqw);
  top: calc(var(--y) * 1cqw);
  width: calc(var(--w) * 1cqw);
  padding: calc(var(--u) * 1.1) calc(var(--u) * 1.2) calc(var(--u) * 1.2);
  border-radius: calc(var(--u) * 1.3);
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 18px 40px -16px rgba(23, 50, 90, 0.28), 0 2px 6px rgba(23, 50, 90, 0.05);
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: var(--u);
  rotate: var(--r);
  animation: wc-float 7s ease-in-out infinite;
  animation-delay: calc(var(--i) * -1.3s);
}
.wh {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding-bottom: 0.8em;
  border-bottom: 1px solid #f0f1f4;
}
.wh img {
  flex: none;
  display: block;
  width: auto;
  height: 1.35em;
  filter: brightness(0);
}
.wh b {
  flex: 1;
  min-width: 0;
  font-size: 1em;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ok {
  flex: none;
  display: grid;
  place-items: center;
  width: 1.9em;
  height: 1.9em;
  border-radius: 50%;
  background: #e6f8ef;
  color: #16a05a;
}
.ok svg {
  width: 62%;
  height: 62%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.lines {
  display: grid;
  gap: 0.55em;
  flex: 1;
}
.lines u,
.acts u,
.bub u {
  display: block;
  height: 0.55em;
  border-radius: 1em;
  background: #eceef3;
  text-decoration: none;
}
.lines u:first-child { width: 78%; }
.lines u:last-child { width: 52%; }
.chip {
  display: inline-block;
  margin-top: 0.9em;
  padding: 0.35em 0.9em;
  border-radius: 999px;
  font-size: 0.9em;
  font-weight: 500;
}
.chip.peach { background: #f9c5ad; color: #7a2f0d; }

/* 1 · lead */
.lead-row {
  display: flex;
  align-items: center;
  gap: 0.9em;
  padding-top: 1em;
}
.av {
  flex: none;
  width: 2.8em;
  height: 2.8em;
  border-radius: 50%;
  background: #d9e6f2;
}

/* 2 · activity */
.acts {
  list-style: none;
  margin: 0;
  padding: 0.5em 0 0;
  display: grid;
  gap: 0.8em;
}
.acts li {
  display: flex;
  align-items: center;
  gap: 0.9em;
  padding-top: 0.6em;
  opacity: 0.3;
  transform: translateX(-4px);
  transition: opacity 0.5s ease, transform 0.6s var(--ease);
}
.acts li.show {
  opacity: 1;
  transform: none;
}
.acts .ic {
  flex: none;
  display: grid;
  place-items: center;
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  background: #e6dcec;
}
.acts li:nth-child(2) .ic { background: #e7e2c9; }
.acts li:nth-child(3) .ic { background: #d9e6f2; }
.acts .ic svg {
  width: 55%;
  height: 55%;
  fill: none;
  stroke: #0a0a0a;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.acts .tx {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 0.45em;
}
.acts strong {
  font-size: 1em;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.acts u { width: 60%; }

/* 3 · calendar */
.cal {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5em;
  padding-top: 1em;
}
.cd {
  text-align: center;
  font-size: 0.85em;
  font-weight: 500;
  color: var(--mute);
}
.cs {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border-radius: 0.7em;
  background: #f4f5f7;
}
.cs.hot {
  background: #f9c5ad;
  color: #7a2f0d;
}
.cs svg {
  width: 62%;
  height: 62%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 4 · call */
.wave {
  display: flex;
  align-items: center;
  gap: 0.28em;
  height: 3.4em;
  padding: 0.6em 0 0.7em;
}
.wave u {
  flex: 1;
  height: 100%;
  border-radius: 1em;
  background: #bcd8f1;
  transform: scaleY(0.25);
  animation: wc-wave 1.3s ease-in-out infinite;
  animation-delay: calc(var(--n) * -0.12s);
}

/* 5 · chat */
.chat {
  display: grid;
  gap: 0.7em;
  padding-top: 0.9em;
}
.bub {
  display: grid;
  gap: 0.4em;
  width: 62%;
  padding: 0.8em 1em;
  border-radius: 1em;
  background: #f1f2f5;
}
.bub.r {
  justify-self: end;
  width: 48%;
  background: #f9c5ad;
}
.bub.r u { background: rgba(122, 47, 13, 0.25); }
.bub u:last-child { width: 60%; }
.bub u:only-child { width: 100%; }

/* 6 · reports */
.bars {
  display: flex;
  align-items: flex-end;
  gap: 0.6em;
  height: 6.4em;
  padding-top: 1em;
}
.bars u {
  flex: 1;
  height: var(--h);
  border-radius: 0.5em 0.5em 0.2em 0.2em;
  background: #d9e6f2;
  transform-origin: bottom;
}
.bars u:last-child { background: #f9c5ad; }

@keyframes wc-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -0.6cqw; }
}
@keyframes wc-wave {
  0%, 100% { transform: scaleY(0.25); }
  50% { transform: scaleY(1); }
}
@keyframes wc-grow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

/* ---------- reveal ---------- */
.wc-arm .wc-head { opacity: 0; translate: -50% 26px; }
.wc-arm .win {
  opacity: 0;
  scale: 0.9;
}
.wc-arm .bars u { transform: scaleY(0); }
.wc-arm.wc-in .wc-head {
  opacity: 1;
  translate: -50% 0;
  transition: opacity 0.9s var(--ease), translate 1.1s var(--ease);
}
.wc-arm.wc-in .win {
  opacity: 1;
  scale: 1;
  transition: opacity 0.8s ease, scale 1s var(--ease);
  transition-delay: calc(0.15s + var(--i) * 0.1s);
}
.wc-arm.wc-in .bars u {
  transform: scaleY(1);
  transition: transform 0.9s var(--ease);
  transition-delay: calc(0.7s + var(--k, 0) * 0.08s);
}

/* ---------- small screens: text first, windows in a grid ---------- */
@media (max-width: 760px) {
  .wc-box { min-height: 0; display: grid; gap: 28px; }
  .wc-glow { display: none; }
  .wc-head { position: static; width: auto; translate: none; }
  .wc-arm .wc-head { translate: 0 26px; }
  .wc-arm.wc-in .wc-head { translate: 0 0; }
  .wc-title { font-size: clamp(32px, 9vw, 44px) !important; }
  .wc-sub { max-width: 560px; font-size: 15px; }
  .wc-cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  .win {
    --u: 12px;
    position: static;
    width: auto;
    rotate: none;
    animation: none;
  }
  .win.b,
  .win.e { grid-column: 1 / -1; }
}
@media (max-width: 420px) {
  .wc-cards { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .wc *,
  .wc *::before,
  .wc *::after {
    animation: none !important;
    transition: none !important;
  }
  .wave u { transform: scaleY(0.6); }
}
</style>