<template>
  <section ref="rootEl" class="sc" :class="{ 'sc-js': mounted, 'sc-in': revealed }" aria-label="Security features">
    <ul
      ref="trackEl"
      class="sc-track"
      tabindex="0"
      aria-label="Security features carousel"
      @scroll.passive="onScroll"
      @keydown.left.prevent="go(-1)"
      @keydown.right.prevent="go(1)"
    >
      <li v-for="(f, i) in items" :key="f.id" class="sc-card" tabindex="0" :style="{ '--i': i }">
        <!-- backdrop: photo on top of a drawn fallback -->
        <svg class="sc-bg" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient :id="`sc-g-${i}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" :stop-color="f.pal[0]" />
              <stop offset="1" :stop-color="f.pal[1]" />
            </linearGradient>
            <radialGradient :id="`sc-s-${i}`" cx="0.35" cy="0.3" r="0.85">
              <stop offset="0" :stop-color="f.pal[2]" />
              <stop offset="1" :stop-color="f.pal[3]" />
            </radialGradient>
          </defs>
          <rect width="400" height="600" :fill="`url(#sc-g-${i})`" />
          <rect x="40" y="330" width="120" height="300" rx="60" fill="#fff" opacity="0.06" />
          <circle cx="310" cy="470" r="125" :fill="`url(#sc-s-${i})`" opacity="0.9" />
          <rect x="-20" y="520" width="440" height="120" fill="#000" opacity="0.22" />
        </svg>
        <img v-if="!failed[f.id]" class="sc-img" :src="f.img" alt="" loading="lazy" decoding="async" draggable="false" @error="failed[f.id] = true" />
        <span class="sc-shade" aria-hidden="true"></span>

        <!-- copy -->
        <div class="sc-copy">
          <h3 class="sc-h">{{ f.h }}</h3>
          <div class="sc-desc"><div class="sc-descin">
            <p v-for="t in f.p" :key="t" class="sc-p">{{ t }}</p>
          </div></div>
        </div>

        <!-- floating UI -->
        <div class="sc-vis" aria-hidden="true">
          <template v-if="f.kind === 'tfa'">
            <div class="sc-u sc-w1">
              <div class="sc-lab">SMS code · ••• 214</div>
              <div class="sc-codes"><i>4</i><i>8</i><i>2</i><i>9</i><i>1</i><i>6</i></div>
            </div>
            <div class="sc-pill sc-r"><span class="sc-ok">✓</span> Login confirmed</div>
            <div class="sc-pill"><span class="sc-mail"></span> Email code required</div>
          </template>

          <template v-else-if="f.kind === 'rbac'">
            <div class="sc-u sc-w1">
              <div class="sc-g sc-gh"><span>Role</span><span>View</span><span>Edit</span><span>Del</span><span>Exp</span></div>
              <div class="sc-g"><strong>Admin</strong><i class="sc-y"></i><i class="sc-y"></i><i class="sc-y"></i><i class="sc-y"></i></div>
              <div class="sc-g"><strong>Manager</strong><i class="sc-y"></i><i class="sc-y"></i><i class="sc-y"></i><i class="sc-n"></i></div>
              <div class="sc-g"><strong>Sales rep</strong><i class="sc-y"></i><i class="sc-y"></i><i class="sc-n"></i><i class="sc-n"></i></div>
            </div>
            <div class="sc-pill sc-r">Deal value · <b>Hidden</b></div>
            <div class="sc-pill">Margin · <b>Hidden</b></div>
          </template>

          <template v-else-if="f.kind === 'dev'">
            <div class="sc-u sc-w1">
              <div class="sc-lab"><i class="sc-dot"></i>Unknown device · Colombo</div>
              <div class="sc-tags"><em>Flagged</em><em>Challenged</em></div>
            </div>
            <div class="sc-pill sc-r">Admin notified</div>
            <div class="sc-pill">IP · office network only</div>
          </template>

          <template v-else-if="f.kind === 'ses'">
            <div class="sc-u sc-w1">
              <div class="sc-lab">Automatic logout in <b>04:32</b></div>
              <div class="sc-bar"><i></i></div>
            </div>
            <div class="sc-pill sc-r"><span class="sc-cap">k7Fp9</span> Image captcha</div>
            <div class="sc-pill">6 + 3 = <span class="sc-box"></span></div>
          </template>

          <template v-else>
            <div class="sc-u sc-w1">
              <div class="sc-lab">Audit trail</div>
              <div class="sc-row"><span>Stage changed to <b>Won</b></span><small>10:42</small></div>
              <div class="sc-row"><span>Value edited · <b>Quote 1042</b></span><small>10:15</small></div>
            </div>
            <div class="sc-pill sc-r">Quote 1042 deleted · <b>Restore</b></div>
          </template>
        </div>

        <span class="sc-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
        </span>
      </li>
    </ul>

    <!-- dots + buttons -->
    <div class="sc-foot">
      <div class="sc-dots" role="tablist" aria-label="Choose a card">
        <button
          v-for="i in pages"
          :key="i"
          type="button"
          class="sc-d"
          :class="{ 'is-on': i - 1 === active }"
          :aria-label="`Go to slide ${i}`"
          :aria-current="i - 1 === active"
          @click="goTo(i - 1)"
        ></button>
      </div>
      <div class="sc-nav">
        <button type="button" class="sc-btn" :disabled="active === 0" aria-label="Previous" @click="go(-1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7" /></svg>
        </button>
        <button type="button" class="sc-btn" :disabled="active >= pages - 1" aria-label="Next" @click="go(1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'SecurityCards' })
/**
 * SectionSecurityCards.vue — five security features as a swipeable row of tall dark cards (title + text on top,
 * floating UI chips in the middle, arrow at the bottom), with dots and prev/next buttons underneath.
 * Vue 3, <script setup>. Native scroll-snap, so touch / trackpad / keyboard all work. Backdrops are SVG (no images).
 * The dots and buttons follow the scroll position. SSR safe.
 */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

const items = [
  {
    id: 'tfa', kind: 'tfa',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&q=80&auto=format&fit=crop', h: 'Two-factor authentication',
    p: ["Every login is confirmed with a one-time code sent by SMS, and sensitive account changes require an email code. Stolen passwords alone can't open your CRM."],
    pal: ['#6d5846', '#2a211b', '#d9b79a', '#6b4d3a'],
  },
  {
    id: 'rbac', kind: 'rbac',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&q=80&auto=format&fit=crop', h: 'Role-based access control',
    p: [
      "Give each person exactly the access their job needs. Saptivo's role-based access control lets you grant view, edit, delete and export rights per role, per module and per branch.",
      "Field-level permissions hide deal values, margins or customer financials from roles that don't need them. Admin always keeps full access.",
    ],
    pal: ['#34445a', '#12171f', '#9fb6d0', '#3d5069'],
  },
  {
    id: 'dev', kind: 'dev',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&q=80&auto=format&fit=crop', h: 'Device fingerprinting and login rules',
    p: [
      'Saptivo recognises the devices your team normally uses. A login from an unknown device is flagged, challenged and reported to an administrator.',
      'You can also restrict access by IP address, for example to your office network only.',
    ],
    pal: ['#46564d', '#161b18', '#b5c8b9', '#4a5e50'],
  },
  {
    id: 'ses', kind: 'ses',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&q=80&auto=format&fit=crop', h: 'Session timeout and bot protection',
    p: ["Idle sessions log out automatically after a period you set, so an unattended screen doesn't expose customer data. Image and math captchas keep automated bots away from your login page."],
    pal: ['#43405a', '#15131c', '#b6b0cf', '#4b4768'],
  },
  {
    id: 'aud', kind: 'aud',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&q=80&auto=format&fit=crop', h: 'Full audit trail and recycle bin',
    p: ['See who changed what and when on every record. Deleted leads and quotes go to a recycle bin with one-click restore and an audit entry, protecting your pipeline from accidental or rogue deletion.'],
    pal: ['#5b5855', '#1c1b1a', '#d4d0cb', '#625e59'],
  },
]

const failed = reactive({})
const pages = ref(items.length)
const rootEl = ref(null)
const trackEl = ref(null)
const mounted = ref(false)
const revealed = ref(false)
const active = ref(0)
let io = null

function stepSize() {
  const t = trackEl.value
  const c = t && t.querySelector('.sc-card')
  if (!c) return 0
  const gap = parseFloat(getComputedStyle(t).columnGap) || 0
  return c.getBoundingClientRect().width + gap
}
function measure() {
  const t = trackEl.value
  if (!t) return
  const step = stepSize() || 1
  pages.value = Math.max(1, Math.round((t.scrollWidth - t.clientWidth) / step) + 1)
}
function onScroll() {
  const t = trackEl.value
  if (!t) return
  const step = stepSize() || 1
  const atEnd = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4
  active.value = atEnd ? pages.value - 1 : Math.min(pages.value - 1, Math.max(0, Math.round(t.scrollLeft / step)))
}
function onResize() { measure(); onScroll() }
function goTo(i) {
  const t = trackEl.value
  if (!t) return
  t.scrollTo({ left: i * stepSize(), behavior: 'smooth' })
}
function go(dir) {
  goTo(Math.min(pages.value - 1, Math.max(0, active.value + dir)))
}

onMounted(() => {
  mounted.value = true
  onResize()
  window.addEventListener('resize', onResize, { passive: true })
  io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { revealed.value = true; io.disconnect() }
  }, { threshold: 0.1 })
  io.observe(rootEl.value)
})
onBeforeUnmount(() => {
  io?.disconnect()
  window.removeEventListener('resize', onResize)
})
</script>

<style>
.sc, .sc * { box-sizing: border-box; }
.sc { --pad: clamp(16px, 4vw, 96px); --gap: clamp(12px, 1.4vw, 20px); font-family: 'Poppins', system-ui, sans-serif; color: #0f172a; background: #fff; padding: clamp(18px, 2.4vw, 36px) 0 clamp(18px, 2.4vw, 36px); }

/* ---------- track ---------- */
.sc-track {
  margin: 0; padding: 0 var(--pad) 4px; list-style: none; outline: none;
  display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 2 * var(--gap)) / 3); column-gap: var(--gap); align-items: stretch;
  overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: var(--pad); scrollbar-width: none; overscroll-behavior-x: contain;
}
.sc-track::-webkit-scrollbar { display: none; }
.sc-track:focus-visible { outline: 2px solid #71717a; outline-offset: -2px; }

.sc-card {
  position: relative; isolation: isolate; overflow: hidden; scroll-snap-align: start; min-width: 0;
  display: flex; flex-direction: column; border-radius: clamp(22px, 2.2vw, 34px); color: #fff; background: #1c1b1a; height: clamp(540px, calc(100svh - 220px), 600px); outline: none; container-type: inline-size;
}
.sc-bg, .sc-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; display: block; }
.sc-img { z-index: -2; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sc-card:hover .sc-img { scale: 1.04; }
.sc-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(8, 10, 14, 0.78) 0%, rgba(8, 10, 14, 0.5) 38%, rgba(8, 10, 14, 0.18) 66%, rgba(8, 10, 14, 0.5) 100%); }

.sc-copy { position: relative; z-index: 3; padding: clamp(20px, 1.8vw, 26px) clamp(20px, 1.8vw, 26px) 0; }
.sc-h {
  margin: 0; font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(14px, 4.2cqw, 30px); font-weight: 500; line-height: 1.15; letter-spacing: -0.025em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sc .sc-h { color: #fff !important; }
.sc-desc {
  position: absolute; left: clamp(20px, 1.8vw, 26px); right: clamp(20px, 1.8vw, 26px); top: 100%; margin-top: 10px;
  opacity: 0; translate: 0 -6px; pointer-events: none; transition: opacity 0.35s ease, translate 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sc-descin { min-height: 0; }
.sc-card:hover .sc-desc, .sc-card:focus-visible .sc-desc { opacity: 1; translate: 0 0; }
.sc-card:focus-visible { box-shadow: 0 0 0 3px #71717a; }
.sc-p { margin: 0; font-size: clamp(12px, 3.7cqw, 15.5px); line-height: 1.5; }
.sc .sc-p { color: #fff !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 2px 18px rgba(0, 0, 0, 0.75); }
.sc-p + .sc-p { margin-top: 8px; }

/* ---------- floating UI ---------- */
.sc-vis {
  margin-top: auto; padding: 24px clamp(20px, 1.8vw, 26px) 64px;
  display: flex; flex-direction: column; align-items: flex-start; gap: 8px; color: #0f172a;
}
.sc-u {
  width: 100%; padding: 12px 14px; border-radius: 10px; background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 20px 36px -18px rgba(0, 0, 0, 0.6); font-size: 12px;
}
.sc-pill {
  display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 999px; background: #fff;
  box-shadow: 0 14px 26px -14px rgba(0, 0, 0, 0.6); font-size: 12px; font-weight: 500; color: #0f172a;
}
.sc-pill b, .sc-u b { font-weight: 600; }
.sc-r { align-self: flex-end; }
.sc-lab { display: flex; align-items: center; gap: 7px; font-size: 11.5px; font-weight: 500; color: #52525b; margin-bottom: 8px; }
.sc-lab b { color: #0f172a; }
.sc-dot { width: 8px; height: 8px; border-radius: 50%; background: #71717a; box-shadow: 0 0 0 3px rgba(113, 113, 122, 0.25); }
.sc-ok { display: grid; place-items: center; width: 16px; height: 16px; border-radius: 50%; background: #15803d; color: #fff; font-size: 10px; }
.sc-mail { width: 13px; height: 9px; border-radius: 2px; border: 1.5px solid #0f172a; }

.sc-codes { display: flex; gap: 5px; }
.sc-codes i { flex: 1; display: grid; place-items: center; height: 34px; border-radius: 8px; font-style: normal; font-size: 15px; font-weight: 600; background: #f4f4f6; border: 1px solid #e4e4e9; }
.sc-g { display: grid; grid-template-columns: 1.5fr repeat(4, 1fr); align-items: center; gap: 4px; padding: 6px 0; border-top: 1px solid #f0f0f3; }
.sc-gh { font-size: 10.5px; font-weight: 600; color: #94a3b8; border-top: 0; padding-top: 0; }
.sc-g strong { font-weight: 600; }
.sc-y, .sc-n { justify-self: start; display: grid; place-items: center; width: 16px; height: 16px; border-radius: 50%; }
.sc-y { background: #0f172a; }
.sc-y::after { content: ''; width: 6px; height: 3px; border-left: 1.6px solid #fff; border-bottom: 1.6px solid #fff; rotate: -45deg; translate: 0 -1px; }
.sc-n { background: #ececef; }
.sc-n::after { content: ''; width: 6px; height: 1.6px; background: #a1a1aa; }
.sc-tags { display: flex; gap: 6px; }
.sc-tags em { font-style: normal; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: #efeff2; color: #3f3f46; }
.sc-bar { height: 5px; border-radius: 999px; background: #ececef; overflow: hidden; }
.sc-bar i { display: block; width: 68%; height: 100%; border-radius: inherit; background: #52525b; }
.sc-cap { padding: 2px 8px; border-radius: 6px; font-family: 'Urbanist', sans-serif; font-weight: 700; font-style: italic; letter-spacing: 2px; background: repeating-linear-gradient(135deg, #f1f1f4 0 5px, #e6e6ea 5px 10px); color: #52525b; }
.sc-box { width: 26px; height: 22px; border-radius: 6px; border: 1px solid #d4d4d8; background: #fafafa; }
.sc-row { display: flex; justify-content: space-between; gap: 10px; padding: 6px 0; border-top: 1px solid #f0f0f3; color: #52525b; }
.sc-row small { color: #94a3b8; }

.sc-arrow {
  position: absolute; right: 18px; bottom: 18px; z-index: 3; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%;
  background: #fff; color: #0f172a; box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.55); transition: translate 0.3s ease;
}
.sc-arrow svg { display: block; width: 20px; height: 20px; }
.sc-card:hover .sc-arrow { translate: 3px 0; }

/* ---------- dots + buttons ---------- */
.sc-foot { position: relative; margin-top: clamp(14px, 1.6vw, 22px); padding: 0 var(--pad); display: flex; align-items: center; justify-content: center; min-height: 46px; }
.sc-dots { display: flex; align-items: center; gap: 8px; }
.sc-d { width: 8px; height: 8px; padding: 0; border: 0; border-radius: 999px; background: #a1a1aa; cursor: pointer; transition: width 0.35s ease, background 0.35s ease; }
.sc-d.is-on { width: 34px; background: #0f172a; }
.sc-d:focus-visible { outline: 2px solid #0f172a; outline-offset: 3px; }
.sc-nav { position: absolute; right: var(--pad); top: 50%; translate: 0 -50%; display: flex; gap: 10px; }
.sc-btn { display: grid; place-items: center; width: 46px; height: 46px; padding: 0; border-radius: 50%; border: 1.5px solid #0f172a; background: #fff; color: #0f172a; cursor: pointer; transition: opacity 0.2s, scale 0.2s; }
.sc-btn svg { width: 20px; height: 20px; }
.sc-btn:hover:not(:disabled) { scale: 1.08; }
.sc-btn:disabled { opacity: 0.35; cursor: default; }
.sc-btn:focus-visible { outline: 2px solid #0f172a; outline-offset: 2px; }

/* ---------- reveal ---------- */
.sc-js .sc-card { opacity: 0; translate: 0 26px; }
.sc-in .sc-card { opacity: 1; translate: 0 0; transition: opacity 0.8s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--i) * 0.08s); }

@media (max-height: 800px) {
  .sc-vis { padding-top: 14px; padding-bottom: 58px; gap: 6px; }
  .sc-u { padding: 10px 12px; }
  .sc-pill { padding: 6px 12px; }
}
@media (hover: none) {
  .sc-card { height: auto; min-height: 560px; }
  .sc-desc { position: static; margin: 10px 0 0; padding: 0; background: none; -webkit-backdrop-filter: none; backdrop-filter: none; opacity: 1; translate: 0 0; pointer-events: auto; }
}
@media (max-width: 900px) {
  .sc-track { grid-auto-columns: calc((100% - var(--gap)) / 2); }
}
@media (max-width: 640px) {
  .sc-track { grid-auto-columns: 82%; }
  .sc-nav { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sc-js .sc-card { opacity: 1; translate: 0 0; }
  .sc * { transition: none !important; }
  .sc-desc { translate: 0 0; }
}
</style>