<template>
  <section
    ref="rootEl"
    class="op"
    :class="{ 'op-in': revealed, 'op-hold': paused || !inView }"
    aria-labelledby="op-title"
  >
    <div class="op-wrap">
      <h2 id="op-title" class="op-title">
        One CRM for leads, conversations <em>and revenue.</em>
      </h2>

      <div
        class="op-row"
        @pointerenter="paused = true"
        @pointerleave="paused = false"
        @focusin="paused = true"
        @focusout="paused = false"
      >
        <article
          v-for="(p, i) in panels"
          :key="p.id"
          class="op-panel"
          :class="[{ on: active === i }, 'op-' + p.id]"
          :style="{ '--i': i }"
          role="button"
          tabindex="0"
          :aria-expanded="active === i"
          :aria-label="p.title"
          @pointerenter="onEnter($event, i)"
          @pointerleave="cancelEnter"
          @click="select(i)"
          @keydown.enter.prevent="select(i)"
          @keydown.space.prevent="select(i)"
          @keydown.right.prevent="select(i + 1)"
          @keydown.left.prevent="select(i - 1)"
        >
          <img class="op-img" :src="p.img" alt="" loading="lazy" decoding="async" draggable="false" @error="$event.target.style.display = 'none'" />

          <!-- label at the top of the card -->
          <span class="op-tag">
            <i><svg viewBox="0 0 24 24" aria-hidden="true" v-html="icon[p.tagIcon]"></svg></i>{{ p.tag }}
          </span>

          <!-- ============ animated product demo over the photo ============ -->
          <div class="op-ui" aria-hidden="true">
            <!-- problem: scattered tools arrive one by one -->
            <template v-if="p.id === 'problem'">
              <div class="ui-head">
                <span class="ui-t"><b>Team inbox</b><small>3 tools · nothing connected</small></span>
                <em class="ui-bd bad">Out of sync</em>
              </div>
              <div class="ui-row" :class="{ show: tick >= 1 }">
                <i class="ui-ic wa"><svg viewBox="0 0 24 24" v-html="icon.chat"></svg></i>
                <span class="ui-t"><b>WhatsApp · Kasun</b><small>“Is the SUV still available?”</small></span>
                <em class="ui-bd ok">3 new</em>
              </div>
              <div class="ui-row" :class="{ show: tick >= 3 }">
                <i class="ui-ic red"><svg viewBox="0 0 24 24" v-html="icon.phone"></svg></i>
                <span class="ui-t"><b>Missed call · 0:56</b><small>Daniel Perera</small></span>
                <em class="ui-bd bad" :class="{ show: tick >= 4 }">Unlogged</em>
              </div>
              <div class="ui-row" :class="{ show: tick >= 5 }">
                <i class="ui-ic grn"><svg viewBox="0 0 24 24" v-html="icon.sheet"></svg></i>
                <span class="ui-t"><b>quotes_final_v7.xlsx</b><small>Which version is current?</small></span>
              </div>
              <span class="ui-chip" :class="{ show: tick >= 7 }"><i></i>Deal slipping · LKR 4.2M</span>
              <svg class="ui-cur" :style="{ transform: `translate(${curProblem.x}px, ${curProblem.y}px)` }" width="22" height="22" viewBox="0 0 24 24"><path d="M5 3l14 7.500-6 1.800L10.500 19z" /></svg>
            </template>

            <!-- solution: everything lands on one customer record -->
            <template v-else>
              <div class="ui-head">
                <i class="ui-av">KP</i>
                <span class="ui-t"><b>Kasun Perera</b><small>One customer record</small></span>
                <em class="ui-bd live"><i></i>Live</em>
              </div>
              <ol class="ui-tl">
                <li v-for="(e, k) in events" :key="e.t" :class="{ show: tick >= k + 1, hot: tick === k + 1 }">
                  <i><svg viewBox="0 0 24 24" v-html="icon[e.icon]"></svg></i>
                  <b>{{ e.t }}</b>
                  <small>{{ e.s }}</small>
                </li>
              </ol>
              <div class="ui-facts" :class="{ show: tick >= 8 }">
                <span v-for="f in facts" :key="f.k"><small>{{ f.k }}</small><b>{{ f.v }}</b></span>
              </div>
              <svg class="ui-cur" :style="{ transform: `translate(${curRecord.x}px, ${curRecord.y}px)` }" width="22" height="22" viewBox="0 0 24 24"><path d="M5 3l14 7.500-6 1.800L10.500 19z" /></svg>
            </template>
          </div>

          <!-- ============ caption ============ -->
          <div class="op-cap">
            <h3>{{ p.title }}</h3>
            <div class="op-desc">
              <div class="op-desc-in">
                <p v-for="(t, j) in p.body" :key="j">{{ t }}</p>
              </div>
            </div>
          </div>

          <!-- autoplay progress; when it finishes the next card opens -->
          <i v-if="active === i" :key="'bar' + active" class="op-bar" @animationend="next"></i>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeOneCrmPanelsSection' })
/**
 * SectionOneCrmPanels.vue — "One CRM for leads, conversations and revenue" (Vue 3, <script setup>)
 * Two photo cards: the problem and the fix. Move the mouse over a card to open it (tap on touch screens,
 * ← → work too). The open card plays a short product demo (items arrive, a cursor moves, the record fills in).
 * Auto-advances (a thin progress bar fills, then the other card opens); pauses on hover/focus and off-screen.
 * SSR/Nuxt safe (browser APIs only in onMounted).
 *
 * PHOTOS: swap the two Unsplash URLs below for any images you prefer.
 */
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const photos = [
  'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=1400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80&auto=format&fit=crop',
]

const panels = [
  {
    id: 'problem',
    tag: 'Scattered tools',
    tagIcon: 'scatter',
    img: photos[0],
    title: 'Deals slip away quietly',
    body: [
      "When leads sit in WhatsApp, calls go unlogged and quotations live in spreadsheets, deals slip away quietly. Your best salesperson leaves and takes the customer history with them. A branch manager can't see what head office promised.",
    ],
  },
  {
    id: 'solution',
    tag: 'One customer record',
    tagIcon: 'check',
    img: photos[1],
    title: 'One all-in-one CRM',
    body: [
      'Saptivo replaces those scattered tools with one all-in-one CRM built around the way sales, support and service teams actually work. Every enquiry, chat, call, quote, invoice and service visit sits on a single customer record.',
      'Anyone on your team can open it and know exactly where the relationship stands, what was promised and what happens next.',
    ],
  },
]

const events = [
  { icon: 'inbox', t: 'Enquiry', s: '9:02' },
  { icon: 'chat', t: 'WhatsApp chat', s: '9:14' },
  { icon: 'phone', t: 'Call logged', s: '10:05' },
  { icon: 'quote', t: 'Quote sent', s: '11:30' },
  { icon: 'invoice', t: 'Invoice paid', s: 'Tue' },
  { icon: 'wrench', t: 'Service visit', s: 'Fri' },
]
const facts = [
  { k: 'Where it stands', v: 'Deposit paid' },
  { k: 'Promised', v: '5% off, Friday' },
  { k: 'Next', v: 'Handover · Thu' },
]

const icon = {
  chat: '<path d="M4 5h16v11H9.5L5 20v-4H4z"/><path d="M8.5 10.5h7"/>',
  phone: '<path d="M7 4.5h3l1.4 4-2 1.4a10 10 0 0 0 4.7 4.7l1.4-2 4 1.4v3a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 5 6.7 2 2 0 0 1 7 4.5z"/>',
  sheet: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M4 9.5h16M4 14.5h16M10 4v16"/>',
  inbox: '<path d="M4 13.5 6.5 5h11L20 13.5V19H4z"/><path d="M4 13.5h4.5l1 2h5l1-2H20"/>',
  quote: '<path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5v4h4M9.5 12h6M9.5 15.5h6"/>',
  invoice: '<path d="M6 3.5h12v17l-3-1.8-3 1.8-3-1.8-3 1.8z"/><path d="M9.5 8.5h5M9.5 12h5"/>',
  wrench: '<path d="M14.5 6a4 4 0 0 0 4.9 5L9.5 20.9a2 2 0 0 1-2.8-2.8L16.6 8.2A4 4 0 0 0 14.5 6z"/>',
  scatter: '<circle cx="6" cy="7" r="2.2"/><circle cx="17.500" cy="6" r="2.200"/><circle cx="12" cy="17.500" r="2.200"/><path d="M8 8l2.500 7M15.500 7.500l-2.500 8" stroke-dasharray="2 2.500"/>',
  check: '<path d="m5 12.500 4.500 4.500L19 7"/>',
}

const rootEl = ref(null)
const revealed = ref(false)
const inView = ref(false)
const paused = ref(false)
const active = ref(0)
const tick = ref(0) // demo clock, restarts whenever a card opens
const CYCLE = 13
let io = null
let clock = null
let enterTimer = null

const select = (i) => { active.value = (i + panels.length) % panels.length }
const next = () => select(active.value + 1)
watch(active, () => { tick.value = 0 })

// hover (mouse) opens a card; a short delay stops it flickering when the cursor just passes over
function onEnter(e, i) {
  if (e.pointerType && e.pointerType !== 'mouse') return // touch / pen: tap to open
  clearTimeout(enterTimer)
  if (active.value === i) return
  enterTimer = setTimeout(() => select(i), 90)
}
const cancelEnter = () => clearTimeout(enterTimer)

/* cursor positions inside the demo card (px from its top-left) */
const curProblem = computed(() => {
  const t = tick.value
  const row = t < 3 ? 0 : t < 5 ? 1 : 2
  return { x: t < 1 ? 330 : 250, y: 58 + row * 56 + (t >= 7 ? 40 : 14) - (t >= 7 ? 0 : 0) }
})
const curRecord = computed(() => {
  const t = tick.value
  if (t < 1) return { x: 360, y: 20 }
  if (t >= 8) return { x: 170 + ((t - 8) % 3) * 80, y: 232 }
  const k = t - 1 // newest row
  return { x: k % 2 === 0 ? 90 : 300, y: 62 + Math.floor(k / 2) * 46 + 18 }
})

onMounted(() => {
  io = new IntersectionObserver(([en]) => {
    inView.value = en.isIntersecting
    if (en.isIntersecting) revealed.value = true
  }, { threshold: 0.05 })
  io.observe(rootEl.value)
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) { tick.value = CYCLE; return }
  clock = setInterval(() => {
    if (inView.value && !document.hidden) tick.value = tick.value >= CYCLE ? 0 : tick.value + 1
  }, 850)
})
onBeforeUnmount(() => {
  clearInterval(clock)
  clearTimeout(enterTimer)
  io?.disconnect()
})
</script>

<style>
.op, .op * { box-sizing: border-box; }
.op {
  --op-ms: 11000ms;
  font-family: 'Poppins', system-ui, sans-serif;
  color: #0f172a;
  background: #fff;
}
.op-wrap { max-width: 1280px; margin: 0 auto; padding: clamp(32px, 4vw, 64px) clamp(16px, 3vw, 32px); }

/* heading: same style as the other sections */
.op-title {
  margin: 0 auto clamp(24px, 3vw, 40px);
  max-width: 1000px;
  padding-bottom: 0.15em;
  text-align: center;
  text-wrap: balance;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(32px, 4.2vw, 62px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.05em;
  color: #0f172a;
}
.op-title em {
  font-style: normal;
  color: inherit;
}

/* ---------- cards ---------- */
.op-row { display: flex; gap: clamp(10px, 1.2vw, 16px); height: clamp(480px, 39vw, 560px); }
.op-panel {
  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 0;
  padding: clamp(18px, 1.8vw, 26px);
  border-radius: 26px;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  background: linear-gradient(160deg, #4a3a32, #1b1512);
  cursor: pointer;
  outline: none;
  opacity: 0;
  translate: 0 22px;
  transition: flex-grow 0.85s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.7s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
  transition-delay: 0s, calc(var(--i) * 0.12s), calc(var(--i) * 0.12s);
}
.op-in .op-panel { opacity: 1; translate: 0 0; }
.op-panel.on { flex-grow: 2.3; cursor: default; }
.op-panel:focus-visible { box-shadow: 0 0 0 3px #ff6a1a; }

.op-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; filter: saturate(0.9) brightness(0.86); transition: scale 1.4s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.6s ease; }
.op-problem .op-img { filter: grayscale(1) contrast(1.05) brightness(0.78); }
.op-panel:hover .op-img { filter: saturate(1) brightness(0.95); }
.op-problem:hover .op-img, .op-problem.on .op-img { filter: grayscale(0.85) contrast(1.05) brightness(0.85); }
.op-panel.on .op-img { scale: 1.04; filter: saturate(1) brightness(0.95); }
.op-problem.on .op-img { filter: grayscale(0.85) contrast(1.05) brightness(0.85); }
.op-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(14, 10, 8, 0.1) 0%, rgba(14, 10, 8, 0.1) 30%, rgba(14, 10, 8, 0.62) 62%, rgba(14, 10, 8, 0.92) 100%);
}
.op-solution::after {
  background: linear-gradient(180deg, rgba(14, 10, 8, 0.1) 0%, rgba(14, 10, 8, 0.1) 30%, rgba(14, 10, 8, 0.62) 62%, rgba(14, 10, 8, 0.92) 100%);
}

/* label at the top of each card (no numbers) */
.op-tag {
  position: absolute;
  left: clamp(18px, 1.8vw, 26px);
  top: clamp(18px, 1.8vw, 26px);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 7px 15px 7px 8px;
  border-radius: 999px;
  background: rgba(40, 34, 30, 0.5);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}
.op-tag i { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: rgba(255, 255, 255, 0.18); }
.op-tag svg { width: 14px; height: 14px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.op-problem .op-tag { border: 1px dashed rgba(255, 255, 255, 0.45); }
.op-solution .op-tag { background: linear-gradient(135deg, rgba(255, 138, 76, 0.95), rgba(242, 84, 12, 0.95)); box-shadow: 0 10px 22px -12px rgba(242, 84, 12, 0.9); }
.op-solution .op-tag i { background: rgba(255, 255, 255, 0.25); }

/* caption */
.op-cap h3 { margin: 0; color: #fff !important; text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35); font-family: 'Urbanist', system-ui, sans-serif; font-size: clamp(20px, 1.8vw, 26px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.2; transition: font-size 0.5s ease; }
.op-panel.on .op-cap h3 { font-size: clamp(24px, 2.2vw, 32px); }
.op-cap { max-width: 640px; }
.op-desc { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); }
.op-desc-in { min-height: 0; overflow: hidden; opacity: 0; transform: translateY(10px); transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
.op-panel.on .op-desc { grid-template-rows: 1fr; }
.op-panel.on .op-desc-in { opacity: 1; transform: none; transition-delay: 0.3s; }
.op-desc p { margin: 12px 0 0; font-size: clamp(13.5px, 1vw, 15px); line-height: 1.6; color: #fff; text-shadow: 0 1px 10px rgba(0, 0, 0, 0.4); }
.op-desc p + p { margin-top: 8px; }

/* autoplay progress */
.op-bar { position: absolute; left: 0; bottom: 0; height: 3px; width: 100%; transform-origin: 0 50%; background: linear-gradient(90deg, #ff9a3d, #f2540c); animation: op-fill var(--op-ms) linear forwards; }
.op-hold .op-bar { animation-play-state: paused; }
@keyframes op-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }

/* ---------- animated product demo card ---------- */
.op-ui {
  position: absolute;
  left: clamp(18px, 1.8vw, 26px);
  top: clamp(60px, 4.6vw, 72px);
  width: min(440px, calc(100% - 2 * clamp(18px, 1.8vw, 26px)));
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  color: #14152b;
  box-shadow: 0 28px 44px -24px rgba(0, 0, 0, 0.6);
  display: grid;
  gap: 6px;
  opacity: 0;
  transform: translateY(14px) scale(0.98);
  transform-origin: 0 0;
  pointer-events: none;
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.op-panel.on .op-ui { opacity: 1; transform: none; transition: opacity 0.6s ease 0.4s, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s; }

.ui-head { display: flex; align-items: center; gap: 10px; padding: 2px 4px 8px; border-bottom: 1px solid rgba(20, 21, 43, 0.08); }
.ui-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 12px; background: #f8f6f1; opacity: 0; transform: translateX(-14px); transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ui-row.show { opacity: 1; transform: none; }
.ui-ic { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; }
.ui-ic svg { width: 16px; height: 16px; fill: none; stroke: #fff; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.ui-ic.wa { background: #22c55e; }
.ui-ic.red { background: #ef4444; }
.ui-ic.grn { background: #16a34a; }
.ui-av { flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(160deg, #ff8a4c, #f2540c); color: #fff; font-style: normal; font-size: 12px; font-weight: 600; }
.ui-t { display: flex; flex: 1; flex-direction: column; min-width: 0; line-height: 1.25; }
.ui-t b { font-size: 12.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-t small { font-size: 11px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-bd { flex: none; padding: 3px 9px; border-radius: 999px; font-style: normal; font-size: 10.5px; font-weight: 700; white-space: nowrap; }
.ui-bd.ok { background: #dcfce7; color: #15803d; }
.ui-bd.bad { background: #fee2e2; color: #b91c1c; }
.ui-row .ui-bd.bad { opacity: 0; scale: 0.6; transition: opacity 0.35s ease, scale 0.35s ease; }
.ui-row .ui-bd.bad.show { opacity: 1; scale: 1; }
.ui-bd.live { display: inline-flex; align-items: center; gap: 5px; background: #e8f8ee; color: #15803d; }
.ui-bd.live i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: op-blink 1.6s ease-in-out infinite; }
@keyframes op-blink { 50% { opacity: 0.3; } }
.ui-chip { justify-self: start; display: inline-flex; align-items: center; gap: 7px; margin-top: 2px; padding: 5px 11px; border: 1px dashed #f3a37a; border-radius: 999px; background: #fff1e7; color: #c2410c; font-size: 11px; font-weight: 600; opacity: 0; scale: 0.9; transition: opacity 0.4s ease, scale 0.4s ease; }
.ui-chip.show { opacity: 1; scale: 1; animation: op-fade 2.6s ease-in-out 0.5s infinite; }
.ui-chip i { width: 6px; height: 6px; border-radius: 50%; background: #f2540c; }
@keyframes op-fade { 50% { opacity: 0.55; } }

/* record timeline: two columns of three, filled one by one */
.ui-tl { list-style: none; margin: 0; padding: 2px 0 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.ui-tl li { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; column-gap: 8px; align-items: center; padding: 6px 9px; border-radius: 12px; background: #f8f6f1; opacity: 0; transform: translateY(8px) scale(0.97); transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease, box-shadow 0.4s ease; }
.ui-tl li.show { opacity: 1; transform: none; }
.ui-tl li.hot { background: #fff1e7; box-shadow: inset 0 0 0 1px #ffc9a8; }
.ui-tl i { grid-row: 1 / 3; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(160deg, #ff8a4c, #f2540c); }
.ui-tl svg { width: 13px; height: 13px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ui-tl b { font-size: 11.5px; font-weight: 600; line-height: 1.2; white-space: nowrap; }
.ui-tl small { font-size: 10px; color: #6b7280; }

/* facts strip */
.ui-facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; opacity: 0; transform: translateY(8px); transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ui-facts.show { opacity: 1; transform: none; }
.ui-facts span { display: flex; flex-direction: column; gap: 1px; padding: 6px 9px; border-radius: 12px; background: #14152b; color: #fff; min-width: 0; }
.ui-facts small { font-size: 9px; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255, 255, 255, 0.6); white-space: nowrap; }
.ui-facts b { font-size: 11.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* animated cursor */
.ui-cur { position: absolute; left: 0; top: 0; z-index: 3; fill: #14152b; stroke: #fff; stroke-width: 1.6; stroke-linejoin: round; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.35)); transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1); }

/* ---------- tablet + phone: stacked accordion ---------- */
@media (max-width: 860px) {
  .op-row { flex-direction: column; height: auto; }
  .op-panel { flex: none; height: 96px; justify-content: flex-end; transition: height 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.7s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: 0s, calc(var(--i) * 0.12s), calc(var(--i) * 0.12s); }
  .op-panel.on { height: 640px; }
  .op-tag { display: none; }
  .op-panel.on .op-tag { display: inline-flex; }
  .op-panel:not(.on) { justify-content: center; }
  .op-ui { top: 64px; width: min(440px, calc(100% - 36px)); }
  .op-cap { max-width: none; }
}
@media (max-width: 420px) {
  .op-panel { border-radius: 22px; padding: 18px; }
  .op-panel.on { height: 700px; }
  .ui-tl li { padding: 5px 7px; column-gap: 6px; }
  .ui-tl small { display: none; }
  .ui-tl i { grid-row: 1; }
  .ui-facts small { font-size: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .op * { animation-duration: 0.01s !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  .op-bar { display: none; }
}
</style>