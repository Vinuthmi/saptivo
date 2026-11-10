<template>
  <section ref="rootEl" class="s4" :class="{ 's4-js': mounted, 's4-in': revealed }" aria-labelledby="s4-security-title">
    <header class="s4-security-intro">
      <h2 id="s4-security-title" class="s4-security-title">
        Your customer data is protected. <span>Period.</span>
      </h2>
      <p class="s4-security-sub">
        Every layer of Saptivo is hardened: SMS and email one-time passwords, role-based access control, device fingerprinting, automatic session timeout and a complete audit log. Your data stays private, and only the people you choose can see it.
      </p>
    </header>

    <div class="sx-grid" role="list">
      <article
        v-for="(it, i) in items"
        :key="it.id"
        class="sx-card"
        role="listitem"
        :style="{ '--i': i, '--c1': it.c1, '--c2': it.c2, '--acc': it.acc, '--tint': it.tint, '--tint2': it.tint2 }"
      >
        <div class="sx-top">
          <span class="sx-n">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="sx-cat">{{ it.cat }}</span>
        </div>
        <h3 class="sx-t">{{ it.name }}</h3>
        <p class="sx-d">{{ it.desc }}</p>

        <!-- product window -->
        <div class="sx-win" aria-hidden="true">
          <div class="sx-wh">
            <span class="sx-logo">saptivo<i>.</i></span>
            <span class="sx-wl">{{ it.label }}</span>
          </div>
          <div class="sx-wb">
            <template v-if="it.id === 'otp'">
              <div class="m-h"><i class="m-dot"></i>Saptivo · SMS<em class="m-sep">Your login code</em></div>
              <div class="m-code">
                <span v-for="(d, k) in ['4', '8', '2', '9', '1', '7']" :key="k" :style="{ '--k': k }">{{ d }}</span>
              </div>
              <span class="m-pill g"><i></i>Delivered &lt; 3s</span>
              <hr class="m-hr" />
              <div class="m-h">
                <svg viewBox="0 0 24 24" class="m-i" v-html="icons.mail"></svg>
                Verify your change<em class="m-sep">Email code</em>
              </div>
              <span class="m-pill o"><i></i>Expires in 10 min</span>
            </template>

            <template v-else-if="it.id === 'rbac'">
              <div v-for="r in roles" :key="r.n" class="m-role">
                <b>{{ r.n }}</b>
                <span class="m-perms">
                  <em v-for="(p, k) in ['R', 'E', 'D', 'X']" :key="p" :class="{ on: r.p[k] }">{{ p }}</em>
                </span>
              </div>
              <span class="m-pill">Read · Edit · Delete · Export</span>
            </template>

            <template v-else-if="it.id === 'device'">
              <div class="m-row">
                <svg viewBox="0 0 64 64" class="m-fp">
                  <circle v-for="(r, k) in [6, 11, 16, 21, 26]" :key="r" cx="32" cy="32" :r="r" :style="{ '--k': k }" :stroke-dasharray="k % 2 ? '14 6 30 8' : '22 5 12 7'" />
                  <circle cx="32" cy="32" r="2.2" class="core" />
                </svg>
                <div class="m-col">
                  <p class="m-t b">New device detected</p>
                  <p class="m-t">Windows · Chrome</p>
                </div>
              </div>
              <div class="m-pills">
                <span class="m-pill r"><i></i>Challenged</span>
                <span class="m-pill">Admin notified</span>
              </div>
            </template>

            <template v-else-if="it.id === 'timeout'">
              <div class="m-row">
                <div class="m-ring">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" class="bg" />
                    <circle cx="50" cy="50" r="42" class="fg" />
                  </svg>
                  <b>15:00</b>
                </div>
                <div class="m-col">
                  <p class="m-t b">Still there?</p>
                  <p class="m-t">Session ends in 0:30</p>
                  <span class="m-pill o"><i></i>Auto logout</span>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="m-h">
                <svg viewBox="0 0 24 24" class="m-i" v-html="icons.audit"></svg>
                Audit trail<em class="m-imm">Immutable</em>
              </div>
              <div v-for="(r, k) in auditRows" :key="k" class="m-ev" :style="{ '--k': k }">
                <span class="m-av" :style="{ '--c': r.c }">{{ r.u }}</span>
                <div class="m-evm">
                  <p><b>{{ r.n }}</b> {{ r.a }} <u>{{ r.t }}</u></p>
                  <span>{{ r.f }}: <s>{{ r.from }}</s> → <strong>{{ r.to }}</strong></span>
                </div>
                <span class="m-time">{{ r.time }}</span>
              </div>
            </template>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeSecuritySection' })

/**
 * SectionSecurity.vue — "Your customer data is protected. Period." (Vue 3, <script setup>)
 *
 * Five pastel cards in the style of a product showcase: number badge, category label, heading,
 * short description and a mini product window for each protection.
 * Layout: 3 cards on the first row, 2 wider cards on the second (stacks on tablet / phone).
 * No props. Browser APIs are only used in onMounted (SSR / Nuxt safe).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const rootEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
let io

const icons = {
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
  audit: '<path d="M7 3.5h7.5l4.5 4.5v12.5H7z"/><path d="M14.5 3.5V8H19M10 12.5h6M10 16h6"/>',
}

/* c1/c2: pastel card gradient · acc: accent used inside the window · tint/tint2: soft fills */
const items = [
  { id: 'otp', cat: 'Two-step login', label: 'LOGIN', name: 'SMS & Email OTP',
    desc: 'One-time codes by SMS on every login and by email for sensitive changes.',
    c1: '#f3ebe5', c2: '#e6d8cd', acc: '#8f6a52', tint: '#f8f2ee', tint2: '#e9dbd0' },
  { id: 'rbac', cat: 'Right access', label: 'PERMISSIONS', name: 'Role-Based Access Control',
    desc: 'Each staff member sees only what their role allows.',
    c1: '#ebe7e6', c2: '#dcd6d4', acc: '#6f6663', tint: '#f2efee', tint2: '#dfd9d7' },
  { id: 'device', cat: 'Trusted devices', label: 'DEVICES', name: 'Device Fingerprinting',
    desc: 'Unknown devices are flagged and challenged, and your admins are alerted.',
    c1: '#f3e6d7', c2: '#ead3b9', acc: '#9a6c45', tint: '#f9f0e6', tint2: '#ecd5ba' },
  { id: 'timeout', cat: 'Auto lock', label: 'SESSION', name: 'Session Timeout Lock',
    desc: 'Idle sessions log out automatically, 15 minutes by default.',
    c1: '#f5eee8', c2: '#ebdfd5', acc: '#7a6455', tint: '#faf6f2', tint2: '#eadccf' },
  { id: 'audit', cat: 'Full visibility', label: 'AUDIT LOG', name: 'Audit Trail Logs',
    desc: 'Every change is recorded: who did what, from where, and when.',
    c1: '#e5eaec', c2: '#d4dde1', acc: '#3d4d55', tint: '#eef2f3', tint2: '#d3dde1' },
]

const roles = [
  { n: 'SuperAdmin', p: [1, 1, 1, 1] },
  { n: 'Manager', p: [1, 1, 0, 1] },
  { n: 'Staff', p: [1, 0, 0, 0] },
]
const auditRows = [
  { u: 'NP', c: '#8f6a52', n: 'Nimal P.', a: 'edited', t: 'Quote #Q-2041', f: 'Discount', from: '5%', to: '10%', time: '10:42' },
  { u: 'SK', c: '#3d4d55', n: 'Sara K.', a: 'updated', t: 'Lead #L-318', f: 'Stage', from: 'New', to: 'Won', time: '10:39' },
  { u: 'RM', c: '#9a6c45', n: 'Ravi M.', a: 'deleted', t: 'Lead #L-297', f: 'Status', from: 'Active', to: 'Deleted', time: '10:24' },
]

onMounted(() => {
  mounted.value = true
  io = new IntersectionObserver(
    (es, o) => {
      if (es[0].isIntersecting) {
        revealed.value = true
        o.disconnect()
      }
    },
    { threshold: 0.08 },
  )
  io.observe(rootEl.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
.s4 {
  --ink: #17172b;
  --ink-2: #2b2d45;
  --muted: #6c7084;
  --line: rgba(20, 21, 43, 0.08);
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(72px, 8vw, 112px) clamp(18px, 4vw, 40px) clamp(76px, 8.5vw, 120px);
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
}
.s4 *,
.s4 *::before,
.s4 *::after {
  box-sizing: border-box;
}
.s4 svg {
  display: block;
}

/* ============ intro ============ */
.s4-security-intro {
  max-width: 1240px;
  margin: 0 auto;
  text-align: center;
}
.s4-security-title {
  margin: 18px 0 0;
  padding-bottom: 0.2em;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(32px, 4.2vw, 62px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.05em;
  color: #0f172a;
}
.s4-security-title span {
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.s4-security-sub {
  max-width: 820px;
  margin: 14px auto 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: #475569;
}

/* ============ cards ============ */
.sx-grid {
  max-width: 1240px;
  margin: clamp(36px, 5vw, 60px) auto 0;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px;
}
.sx-card {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  padding: 22px 22px 22px;
  border-radius: 32px;
  background: linear-gradient(150deg, var(--c1) 0%, var(--c2) 100%);
  min-width: 0;
}
.sx-card:nth-child(n + 4) {
  grid-column: span 3;
}
.s4-js .sx-card {
  opacity: 0;
  transform: translateY(26px);
}
.s4-js.s4-in .sx-card {
  opacity: 1;
  transform: none;
  transition: opacity 0.8s var(--ease), transform 0.9s var(--ease);
  transition-delay: calc(var(--i) * 0.09s);
}

.sx-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.sx-n {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(20, 21, 43, 0.14);
  background: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  font-weight: 600;
  color: var(--ink);
}
.sx-cat {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--acc);
  opacity: 0.85;
}
.sx-t {
  margin: 26px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(22px, 2vw, 27px);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: #17172b;
}
.sx-d {
  margin: 10px 0 24px;
  min-height: 3.1em;
  max-width: 44ch;
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(23, 23, 43, 0.66);
}

/* ---------- product window ---------- */
.sx-win {
  flex: 1;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 22px 40px -26px rgba(40, 30, 60, 0.35), 0 0 0 1px rgba(20, 21, 43, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 236px;
}
.sx-wh {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px solid rgba(20, 21, 43, 0.07);
}
.sx-logo {
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #17172b;
}
.sx-logo i {
  font-style: normal;
  color: var(--acc);
}
.sx-wl {
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #9a9cac;
}
.sx-wb {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 11px;
  padding: 16px 18px 18px;
}

/* ---------- widget internals ---------- */
.m-h {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-2);
}
.m-dot {
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background: var(--acc);
}
.m-i {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--acc);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.m-sep {
  margin-left: auto;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  color: var(--muted);
}
.m-hr {
  width: 100%;
  height: 1px;
  margin: 1px 0;
  border: 0;
  background: var(--line);
}
.m-t {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.35;
  color: var(--muted);
}
.m-t.b {
  color: var(--ink);
  font-weight: 600;
  font-size: 12.5px;
}
.m-code {
  display: flex;
  gap: 6px;
}
.m-code span {
  flex: 1;
  height: 36px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: var(--tint);
  border: 1px solid var(--tint2);
  color: var(--acc);
  font-size: 16px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.s4-in .m-code span {
  animation: s4-pop 0.5s var(--ease) both;
  animation-delay: calc(0.7s + var(--k) * 0.08s);
}
.m-pill {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #f3f1ee;
  color: var(--ink-2);
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}
.m-pill i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  animation: s4-blink 1.6s ease-in-out infinite;
}
.m-pill.g { color: #15803d; background: #ecfdf3; }
.m-pill.o { color: #b84a0a; background: #fff3e8; }
.m-pill.r { color: #c2262b; background: #fff0f0; }
.m-pills {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.m-role {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.m-role b {
  font-size: 12.5px;
  font-weight: 600;
}
.m-perms {
  display: flex;
  gap: 5px;
}
.m-perms em {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  font-style: normal;
  font-size: 10.5px;
  font-weight: 700;
  background: #f1efec;
  color: #b3b5c3;
}
.m-perms em.on {
  background: var(--acc);
  color: #fff;
}

.m-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.m-col {
  display: grid;
  gap: 5px;
  min-width: 0;
}
.m-ring {
  position: relative;
  flex: none;
  width: 100px;
  height: 100px;
  display: grid;
  place-items: center;
}
.m-ring svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.m-ring circle {
  fill: none;
  stroke-width: 8;
}
.m-ring .bg { stroke: var(--tint2); }
.m-ring .fg {
  stroke: var(--acc);
  stroke-linecap: round;
  stroke-dasharray: 264;
  animation: s4-drain 7s linear infinite;
}
.m-ring b {
  font-size: 20px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.m-fp {
  flex: none;
  width: 72px;
  height: 72px;
  padding: 4px;
  border-radius: 16px;
  background: var(--tint);
}
.m-fp circle {
  fill: none;
  stroke: var(--acc);
  stroke-width: 1.7;
  stroke-linecap: round;
  transform-origin: 32px 32px;
  animation: s4-spin 14s linear infinite;
  animation-delay: calc(var(--k) * -2s);
}
.m-fp circle:nth-child(even) { animation-direction: reverse; }
.m-fp .core {
  fill: var(--acc);
  stroke: none;
  animation: none !important;
}

.m-imm {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--tint);
  color: var(--acc);
  font-style: normal;
  font-size: 9.5px;
  font-weight: 700;
}
.m-ev {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 9px;
  border-radius: 11px;
  background: #f7f6f4;
  min-width: 0;
}
.s4-in .m-ev {
  animation: s4-in 0.55s var(--ease) both;
  animation-delay: calc(0.6s + var(--k) * 0.14s);
}
.m-av {
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--c);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
}
.m-evm {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 2px;
}
.m-evm p {
  margin: 0;
  font-size: 10.5px;
  line-height: 1.3;
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.m-evm p b { color: var(--ink); font-weight: 600; }
.m-evm p u { text-decoration: none; color: var(--acc); font-weight: 600; }
.m-evm > span { font-size: 9px; color: var(--muted); }
.m-evm s { color: #c2262b; }
.m-evm strong { color: #15803d; font-weight: 700; }
.m-time {
  flex: none;
  font-size: 9.5px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

@keyframes s4-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
@keyframes s4-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes s4-blink { 50% { opacity: 0.3; } }
@keyframes s4-drain { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 264; } }
@keyframes s4-spin { to { transform: rotate(360deg); } }

/* ============ responsive ============ */
@media (max-width: 1000px) {
  .sx-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sx-card,
  .sx-card:nth-child(n + 4) { grid-column: span 1; }
  .sx-card:last-child { grid-column: 1 / -1; }
}
@media (max-width: 680px) {
  .sx-grid { grid-template-columns: 1fr; gap: 14px; }
  .sx-card,
  .sx-card:nth-child(n + 4),
  .sx-card:last-child { grid-column: 1 / -1; border-radius: 26px; padding: 18px; }
  .sx-win { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .s4 *,
  .s4 *::before,
  .s4 *::after {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
    transition-delay: 0s !important;
  }
  .s4-js .sx-card { opacity: 1; transform: none; }
}
</style>