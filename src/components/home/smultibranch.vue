<template>
  <section ref="root" class="mb" :class="{ 'mb-play': play }" aria-labelledby="mb-title">
    <div class="mb-grid">
      <!-- ============ copy ============ -->
      <div class="mb-copy">
        <h2 id="mb-title" class="mb-title">
          Built for businesses with
          <span>more than one branch, counter or crew</span>
        </h2>
        <p class="mb-lead">
          Run one store or one hundred from a single head-office dashboard. Set role-based permissions for each
          branch, keep stock synced across warehouses and service vans, and see consolidated revenue without
          waiting for end-of-day reports.
        </p>
        <p class="mb-sub">
          Saptivo grows with you: add users, branches and modules whenever you need them, with no upgrade fees.
        </p>
      </div>

      <!-- ============ art ============ -->
      <div class="mb-visual" :style="{ height: ART_H * k + 'px' }">
        <div class="mb-scale" :style="{ transform: `scale(${k})` }" aria-hidden="true">
          <div class="mb-art">
            <div class="mb-plane">
              <!-- back card · branch revenue -->
              <div class="mb-card mb-rev">
                <header>
                  <div><b>Branch revenue</b><small>Live sales today · every branch</small></div>
                  <span class="mb-sel">Today <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg></span>
                </header>
                <div class="mb-bars">
                  <div v-for="(b, i) in branches" :key="b.n" class="mb-col" :class="{ top: i === 0 }" :style="{ '--i': i, '--h': b.h }">
                    <em>{{ b.v }}</em>
                    <div class="mb-bar"><i></i></div>
                    <span class="mb-bav" :style="{ background: b.c }">{{ b.n[0] }}</span>
                    <small>{{ b.n }}</small>
                  </div>
                </div>
              </div>

              <!-- front card · consolidated gauge -->
              <div class="mb-card mb-gauge">
                <header><b>Consolidated revenue</b></header>
                <svg class="mb-fan" viewBox="0 0 340 186">
                  <defs>
                    <linearGradient id="mb-og" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="320" y2="0">
                      <stop offset="0" stop-color="#ff9a3d" /><stop offset="1" stop-color="#f2540c" />
                    </linearGradient>
                  </defs>
                  <path v-for="(w, i) in wedges" :key="i" :d="w.d" class="mb-w" :class="{ on: w.on }" :style="{ '--i': i }" />
                </svg>
                <div class="mb-gv">
                  <b>${{ rev.toFixed(1) }}k</b>
                  <span>Updated live · no end-of-day wait</span>
                  <p>{{ Math.round(brs) }} branches online · <em>▲ 12.4%</em></p>
                </div>
              </div>

              <!-- floating · permissions -->
              <div class="mb-card mb-roles">
                <header><b>Role-based access</b><small>Kandy branch</small></header>
                <div v-for="r in roles" :key="r[0]" class="mb-role">
                  <i :style="{ background: r[2] }">{{ r[0] }}</i>
                  <span>{{ r[1] }}</span>
                  <u :class="{ on: r[3] }"></u>
                </div>
              </div>

              <!-- floating · stock sync -->
              <div class="mb-card mb-sync">
                <i class="mb-dot"></i>
                <span><b>Stock synced</b><small>Warehouse → Service van 03</small></span>
                <em>38 ms</em>
              </div>

              <!-- floating · branch tiles -->
              <div class="mb-card mb-tile t1"><b>HQ</b><small>Head office</small></div>
              <div class="mb-card mb-tile t2"><b>+1</b><small>Add a branch</small></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({ name: 'MultiBranchSection' })

const ART_W = 720
const ART_H = 690

const branches = [
  { n: 'Colombo', v: '$42.1k', h: 100, c: '#0f172a' },
  { n: 'Kandy', v: '$28.6k', h: 68, c: '#f2540c' },
  { n: 'Galle', v: '$19.4k', h: 46, c: '#6366f1' },
  { n: 'Jaffna', v: '$15.8k', h: 38, c: '#0ea5a4' },
  { n: 'Negombo', v: '$11.3k', h: 27, c: '#e11d74' },
]
const roles = [
  ['BM', 'Branch manager', '#0f172a', true],
  ['CS', 'Cashier', '#f2540c', true],
  ['SK', 'Stock keeper', '#6366f1', false],
]

/* segmented fan gauge: N wedges on a half ring, the first `FILLED` are lit */
const N = 14
const FILLED = 11
const wedges = (() => {
  const cx = 170, cy = 172, ro = 150, ri = 84, gap = 2.6
  const pt = (r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]
  return Array.from({ length: N }, (_, i) => {
    const a0 = 180 + (i * 180) / N + gap / 2
    const a1 = 180 + ((i + 1) * 180) / N - gap / 2
    const [x0, y0] = pt(ro, a0), [x1, y1] = pt(ro, a1), [x2, y2] = pt(ri, a1), [x3, y3] = pt(ri, a0)
    const f = (n) => n.toFixed(1)
    return {
      on: i < FILLED,
      d: `M${f(x0)} ${f(y0)}A${ro} ${ro} 0 0 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${ri} ${ri} 0 0 0 ${f(x3)} ${f(y3)}Z`,
    }
  })
})()

/* state */
const root = ref(null)
const k = ref(1)
const play = ref(false)
const rev = ref(106.2)
const brs = ref(12)

let ro, io, raf, timer
const tween = (r, to, ms = 1400, from = 0) => {
  const t0 = performance.now()
  const step = (t) => {
    const p = Math.min((t - t0) / ms, 1)
    r.value = from + (to - from) * (1 - Math.pow(1 - p, 3))
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

function fit() {
  const el = root.value?.querySelector('.mb-visual')
  if (!el) return
  k.value = Math.min(1.25, +(el.clientWidth / ART_W).toFixed(3)) || 1
}

onMounted(() => {
  fit()
  ro = new ResizeObserver(fit)
  ro.observe(root.value)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting && !play.value) {
        play.value = true
        rev.value = 0
        brs.value = 0
        timer = setTimeout(() => {
          tween(rev, 106.2, 1600)
          tween(brs, 12, 1400)
        }, 500)
      }
    },
    { threshold: 0.25 },
  )
  io.observe(root.value)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  io?.disconnect()
  cancelAnimationFrame(raf)
  clearTimeout(timer)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');
</style>

<style scoped>
.mb {
  --o: #f2540c;
  --navy: #0f172a;
  --ink: #475569;
  --line: #f1ece8;
  position: relative;
  width: calc(100% - 2 * clamp(8px, 1.6vw, 24px));
  max-width: 1680px;
  margin: clamp(32px, 5vw, 64px) auto;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: clamp(22px, 2.6vw, 36px);
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--navy);
  background:
    radial-gradient(46% 70% at 72% 4%, rgba(255, 112, 69, 0.66), transparent 66%),
    radial-gradient(44% 80% at 104% 40%, rgba(86, 120, 255, 0.62), transparent 70%),
    radial-gradient(50% 62% at 92% 110%, rgba(80, 140, 255, 0.58), transparent 70%),
    radial-gradient(44% 56% at 60% 100%, rgba(255, 150, 168, 0.5), transparent 72%),
    linear-gradient(100deg, #fff8f4 0%, #fdeee8 46%, #f6f3ff 100%);
}
.mb *, .mb *::before, .mb *::after { box-sizing: border-box; }
.mb svg { display: block; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
/* large soft ring, top right */
.mb::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: -34%;
  right: -9%;
  width: 62%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.05) 60%);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.mb-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
  align-items: center;
  gap: clamp(16px, 3vw, 48px);
  max-width: 1360px;
  margin: 0 auto;
  padding: clamp(40px, 6vw, 88px) clamp(20px, 5vw, 72px);
}

/* ---------- copy ---------- */
.mb-title {
  margin: 0;
  max-width: 640px;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(34px, 3.7vw, 60px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.055em;
  color: var(--navy);
  text-wrap: balance;
}
.mb-title span {
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.mb-lead {
  max-width: 560px;
  margin: 24px 0 0;
  font-size: clamp(15px, 1.15vw, 18px);
  line-height: 1.7;
  color: #3f4654;
}
.mb-sub {
  max-width: 560px;
  margin: 12px 0 0;
  font-size: clamp(15px, 1.15vw, 18px);
  line-height: 1.7;
  font-weight: 500;
  color: var(--navy);
}
/* ---------- art ---------- */
.mb-visual { position: relative; width: 100%; }
.mb-scale { position: absolute; top: 0; left: 0; width: 720px; height: 690px; transform-origin: top left; }
.mb-art { position: relative; width: 720px; height: 690px; perspective: 1900px; perspective-origin: 30% 40%; }
.mb-plane { position: absolute; inset: 0; transform-style: preserve-3d; transform: rotateY(-24deg) rotateX(9deg) rotateZ(7deg); }
.mb-card {
  position: absolute;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 40px 70px -28px rgba(120, 50, 20, 0.35), 0 2px 0 rgba(255, 255, 255, 0.9) inset;
  font-family: 'Poppins', system-ui, sans-serif;
}
.mb-card header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.mb-card header b { display: block; font-size: 19px; font-weight: 600; letter-spacing: -0.02em; }
.mb-card header small { display: block; margin-top: 3px; font-size: 12px; color: #94a3b8; }

/* branch revenue (back) */
.mb-rev { left: 322px; top: 66px; width: 398px; height: 440px; padding: 28px 30px; transform: translateZ(0); }
.mb-sel { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 10px; background: #f6f4f2; font-size: 12px; color: #334155; }
.mb-sel svg { width: 13px; height: 13px; }
.mb-bars { position: absolute; left: 26px; right: 26px; bottom: 26px; top: 96px; display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; }
.mb-col { position: relative; flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
.mb-col em {
  position: relative;
  margin-bottom: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #1e293b;
  color: #fff;
  font-style: normal;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}
.mb-col.top em { background: var(--o); }
.mb-bar { width: 100%; flex: none; height: calc((100% - 84px) * var(--h) / 100); border-radius: 12px 12px 4px 4px; background: #f3f2f1; overflow: hidden; position: relative; }
.mb-bar i { position: absolute; inset: 0; border-radius: inherit; background: repeating-linear-gradient(135deg, #cfd2d8 0 2px, transparent 2px 8px); transform-origin: bottom; }
.mb-col.top .mb-bar { background: linear-gradient(180deg, #ff8a3d, #f2540c); }
.mb-col.top .mb-bar i { background: repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0 2px, transparent 2px 8px); }
.mb-bav { margin-top: 10px; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px #e8e4e0; color: #fff; font-size: 10px; font-weight: 600; }
.mb-col small { margin-top: 4px; font-size: 11px; color: #64748b; }

/* consolidated gauge (front-left) */
.mb-gauge { left: 0; top: 196px; width: 330px; height: 392px; padding: 26px 14px 0; transform: translateZ(70px); }
.mb-gauge header { padding: 0 12px; }
.mb-fan { width: 300px; height: 164px; margin: 44px auto 0; overflow: visible; }
.mb-w { fill: #f3f1ef; stroke: #f3f1ef; stroke-width: 5; stroke-linejoin: round; }
.mb-w.on { fill: url(#mb-og); stroke: url(#mb-og); }
.mb-gv { position: absolute; left: 0; right: 0; bottom: 30px; text-align: center; }
.mb-gv b { display: block; font-size: 38px; font-weight: 600; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.mb-gv span { display: block; margin-top: 7px; font-size: 12px; color: #64748b; }
.mb-gv p { margin: 12px 0 0; font-size: 13px; color: #334155; }
.mb-gv em { font-style: normal; font-weight: 600; color: #15803d; }

/* permissions (floating) */
.mb-roles { left: 372px; top: 520px; width: 296px; padding: 20px 22px 18px; transform: translateZ(120px); }
.mb-roles header b { font-size: 15px; }
.mb-role { display: flex; align-items: center; gap: 11px; margin-top: 12px; font-size: 13px; color: #1f2937; }
.mb-role i { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; color: #fff; font-style: normal; font-size: 10px; font-weight: 600; }
.mb-role span { flex: 1; }
.mb-role u { position: relative; width: 34px; height: 20px; border-radius: 999px; background: #e5e7eb; }
.mb-role u::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); transition: transform 0.35s; }
.mb-role u.on { background: var(--o); }
.mb-role u.on::after { transform: translateX(14px); }

/* stock sync (floating) */
.mb-sync { left: 300px; top: 4px; width: 262px; display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-radius: 18px; transform: translateZ(130px); }
.mb-dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); flex: none; }
.mb-sync b { display: block; font-size: 13.5px; font-weight: 600; }
.mb-sync small { display: block; font-size: 11px; color: #94a3b8; margin-top: 1px; }
.mb-sync em { margin-left: auto; padding: 4px 9px; border-radius: 8px; background: #e8f8ee; color: #15803d; font-style: normal; font-size: 11.5px; font-weight: 600; }

/* branch tiles (floating, like profile chips) */
.mb-tile { display: grid; align-content: end; gap: 2px; padding: 14px 16px; border-radius: 22px; color: #fff; }
.mb-tile b { font-size: 30px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; }
.mb-tile small { font-size: 11.5px; opacity: 0.85; }
.mb-tile.t1 { left: 64px; top: 86px; width: 128px; height: 116px; background: linear-gradient(150deg, #1e293b, #0f172a); transform: translateZ(100px); border: 4px solid #fff; }
.mb-tile.t2 { left: 34px; top: 584px; width: 118px; height: 104px; background: linear-gradient(150deg, #ff9a3d, #f2540c); transform: translateZ(150px); border: 4px solid #fff; }

/* ---------- motion (only once the section is visible) ---------- */
.mb-play .mb-card { animation: mb-in 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.mb-play .mb-rev { animation-delay: 0.05s; }
.mb-play .mb-gauge { animation-delay: 0.2s; }
.mb-play .mb-roles { animation-delay: 0.4s; }
.mb-play .mb-sync { animation-delay: 0.5s; }
.mb-play .mb-tile.t1 { animation-delay: 0.6s; }
.mb-play .mb-tile.t2 { animation-delay: 0.7s; }
.mb-play .mb-bar i { animation: mb-grow 1.1s cubic-bezier(0.3, 0.8, 0.2, 1) both; animation-delay: calc(var(--i) * 0.12s + 0.6s); }
.mb-play .mb-col em { animation: mb-pop 0.5s cubic-bezier(0.2, 1.6, 0.4, 1) both; animation-delay: calc(var(--i) * 0.12s + 1.4s); }
.mb-play .mb-w.on { animation: mb-wedge 0.5s ease both; animation-delay: calc(var(--i) * 0.07s + 0.6s); }
.mb-play .mb-card.mb-roles, .mb-play .mb-card.mb-sync, .mb-play .mb-tile { animation-name: mb-in, mb-float; animation-duration: 0.9s, 6s; animation-delay: var(--d0, 0.4s), 1.5s; animation-iteration-count: 1, infinite; animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1), ease-in-out; animation-fill-mode: both, none; }
.mb-play .mb-sync { --d0: 0.5s; }
.mb-play .mb-tile.t1 { --d0: 0.6s; }
.mb-play .mb-tile.t2 { --d0: 0.7s; }
.mb-play .mb-roles { --d0: 0.4s; }
.mb-play .mb-tile.t2 { animation-duration: 0.9s, 7s; }
.mb-play .mb-sync .mb-dot { animation: mb-ping 2s infinite; }

@keyframes mb-in { from { opacity: 0; translate: 0 34px; } to { opacity: 1; translate: 0 0; } }
@keyframes mb-float { 50% { translate: 0 -9px; } }
@keyframes mb-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes mb-pop { from { opacity: 0; transform: translateY(8px) scale(0.7); } to { opacity: 1; transform: none; } }
@keyframes mb-wedge { from { opacity: 0.15; } to { opacity: 1; } }
@keyframes mb-ping { 70%, 100% { box-shadow: 0 0 0 9px rgba(34, 197, 94, 0); } }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .mb-grid { grid-template-columns: minmax(0, 1fr); gap: 28px; padding-bottom: 20px; }
  .mb-title, .mb-lead, .mb-sub { max-width: none; }
}
@media (prefers-reduced-motion: reduce) {
  .mb *, .mb *::before, .mb *::after { animation: none !important; transition: none !important; }
}
</style>