<template>
  <section ref="rootEl" class="bn" :class="{ 'bn-in': revealed }" aria-labelledby="bn-title">
    <div class="bn-wrap">
      <h2 id="bn-title" class="bn-title">
        Built for businesses with <em>more than one branch, counter or crew</em>
      </h2>

      <div class="bn-grid">
        <!-- ============ 1 · head-office dashboard ============ -->
        <article class="bn-card bn-c1 bn-dark" style="--i: 0" tabindex="0">
          <h3 class="bn-t">One head-office dashboard</h3>
          <div class="bn-hov" aria-hidden="false"><p>Run one store or one hundred from a single head-office dashboard.</p></div>
          <div class="bn-win bn-dash">
            <div class="bn-dl">
              <span class="bn-k"><s></s>Live · all 4 branches</span>
              <strong class="bn-tot">LKR {{ total }}</strong>
              <span class="bn-seg">
                <button v-for="r in ranges" :key="r" type="button" :class="{ on: range === r }" @click="range = r">{{ r }}</button>
              </span>
            </div>
            <ul class="bn-cols">
              <li v-for="(b, i) in view" :key="b.n" :class="{ top: i === 0 }">
                <small>{{ b.v }}</small>
                <span class="bn-cb"><i :style="{ height: b.w + '%' }"></i></span>
                <em>{{ b.n }}</em>
              </li>
            </ul>
          </div>
        </article>

        <!-- ============ 2 · role-based permissions (photo) ============ -->
        <article class="bn-card bn-c2" style="--i: 1" tabindex="0">
          <h3 class="bn-t">Role-based permissions</h3>
          <div class="bn-hov" aria-hidden="false"><p>Set role-based permissions for each branch.</p></div>
          <div class="bn-ph">
            <img :src="photos.team" alt="Two shop employees in aprons smiling inside a store" loading="lazy" decoding="async" />
            <div class="bn-float bn-roles">
              <div class="bn-rt">Kandy branch access</div>
              <div v-for="(r, ri) in roles" :key="r.n" class="bn-rr" :class="{ hot: roleHot === ri }">
                <span class="bn-role"><i>{{ r.n[0] }}</i>{{ r.n }}</span>
                <span class="bn-chips"><b v-for="(on, pi) in r.p" :key="pi" :class="{ on }">{{ perms[pi] }}</b></span>
              </div>
            </div>
          </div>
        </article>

        <!-- ============ 3 · stock sync ============ -->
        <article class="bn-card bn-c3" style="--i: 2" tabindex="0">
          <h3 class="bn-t">Stock stays in sync</h3>
          <div class="bn-hov" aria-hidden="false"><p>Keep stock synced across warehouses and service vans.</p></div>
          <div class="bn-win bn-stk">
            <span class="bn-ok" :class="{ pop: pulse }">12 units moved · Synced ✓</span>
            <ul class="bn-sl">
              <li><span class="bn-si bn-si-o"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="ico.box"></svg></span><b>Central warehouse</b><em>{{ whQty.toLocaleString('en-US') }}</em><span class="bn-mt"><i :style="{ width: Math.round(whQty / 1240 * 100) + '%' }"></i></span></li>
              <li><span class="bn-si"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="ico.van"></svg></span><b>Service van 07</b><em>{{ vanQty }}</em><span class="bn-mt"><i :style="{ width: Math.round(vanQty / 120 * 100) + '%' }"></i></span></li>
              <li><span class="bn-si"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="ico.store"></svg></span><b>Galle branch</b><em>212</em><span class="bn-mt"><i style="width: 18%"></i></span></li>
            </ul>
          </div>
        </article>

        <!-- ============ 4 · consolidated revenue (photo) ============ -->
        <article class="bn-card bn-c4" style="--i: 3" tabindex="0">
          <h3 class="bn-t">Consolidated revenue</h3>
          <div class="bn-hov" aria-hidden="false"><p>See consolidated revenue without waiting for end-of-day reports.</p></div>
          <div class="bn-ph">
            <img :src="photos.owner" alt="A tablet point-of-sale at a store checkout counter" loading="lazy" decoding="async" />
            <div class="bn-float bn-rev">
              <div class="bn-rv-h"><span>Revenue today</span><em><s></s>Live</em></div>
              <div class="bn-big">LKR {{ revNum }}M</div>
              <div class="bn-bars">
                <i v-for="(h, i) in bars" :key="i" :class="{ last: i === bars.length - 1 }" :style="{ '--h': h + '%', '--d': i * 0.05 + 's' }"></i>
              </div>
            </div>
          </div>
        </article>

        <!-- ============ 5 · grows with you ============ -->
        <article class="bn-card bn-c5" style="--i: 4" tabindex="0">
          <h3 class="bn-t">Saptivo grows with you</h3>
          <div class="bn-hov" aria-hidden="false"><p>Add users, branches and modules whenever you need them, with no upgrade fees.</p></div>
          <div class="bn-win bn-win-s">
            <ul class="bn-plan">
              <li v-for="(p, i) in plan" :key="p.n" :class="{ flash: flashI === i }">
                <span class="bn-pn">{{ p.n }}</span>
                <span class="bn-pv">{{ p.v }}</span>
                <span class="bn-add">+ Add</span>
              </li>
            </ul>
            <div class="bn-fee"><span>Upgrade fee</span><strong>LKR 0</strong><b>✓</b></div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'HomeMultiBranchBentoSection' })
/**
 * MultiBranchBento.vue — "Built for businesses with more than one branch, counter or crew"
 * Vue 3, <script setup>. Two rows of cards (2 + 3) that fit one desktop screen.
 * Restrained palette: white / navy / one orange accent. Two photo cards (swap URLs below).
 * Each card shows its title; the description slides up when the card is hovered or focused (always shown on touch).
 * SSR/Nuxt safe (browser APIs only inside onMounted).
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const photos = {
  team: 'https://images.unsplash.com/photo-1753354868616-544973e405c9?w=1200&q=80&auto=format&fit=crop', // Vitaly Gariev / Unsplash
  owner: 'https://images.unsplash.com/photo-1742836531271-98fd8151d257?w=1200&q=80&auto=format&fit=crop', // Unsplash
}

const ico = {
  store: '<path d="M4 9l1.5-5h13L20 9v1a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-6 0 2.5 2.5 0 0 1-5 0z"/><path d="M5.5 12v8h13v-8"/>',
  van: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  box: '<path d="M3.5 8 12 4l8.5 4v8L12 20l-8.5-4z"/><path d="M3.5 8 12 12l8.5-4M12 12v8"/>',
}

/* ---- 1 · dashboard ---- */
const ranges = ['Day', 'Week', 'Month']
const range = ref('Day')
// LKR thousands per branch (Day total = the "Revenue today" figure in the revenue card)
const data = {
  Day: [['Colombo', 842], ['Kandy', 628], ['Galle', 496], ['Jaffna', 364]],
  Week: [['Colombo', 5370], ['Kandy', 4060], ['Galle', 3190], ['Jaffna', 2350]],
  Month: [['Colombo', 22400], ['Kandy', 17100], ['Galle', 13900], ['Jaffna', 10300]],
}
const fmt = (k) => (k >= 1000 ? `${(k / 1000).toFixed(2)}M` : `${k}k`)
const shown = ref(false)
const view = computed(() => {
  const rows = data[range.value]
  const max = Math.max(...rows.map((r) => r[1]))
  return rows.map(([n, v]) => ({ n, v: fmt(v), w: shown.value ? Math.round((v / max) * 100) : 0 }))
})
const total = computed(() => fmt(data[range.value].reduce((a, r) => a + r[1], 0)))

/* ---- 2 · roles ---- */
const perms = ['Sell', 'Stock', 'Reports']
const roles = [
  { n: 'Branch manager', p: [1, 1, 1] },
  { n: 'Cashier', p: [1, 0, 0] },
  { n: 'Stock clerk', p: [0, 1, 0] },
]
const roleHot = ref(0)

/* ---- 3 · stock ---- */
const whQty = ref(1240)
const vanQty = ref(36)
const pulse = ref(false)

/* ---- 4 · revenue ---- */
const bars = [24, 36, 30, 48, 42, 60, 54, 72, 66, 84, 100]
const rev = ref(0)
const revNum = computed(() => rev.value.toFixed(2))

/* ---- 5 · plan ---- */
const plan = ref([
  { n: 'Users', v: 24 },
  { n: 'Branches', v: 6 },
  { n: 'Modules', v: 8 },
])
const flashI = ref(-1)

const rootEl = ref(null)
const revealed = ref(false)
const inView = ref(false)
let io = null
let timer = null
let raf = 0
let tick = 0

function countUp() {
  const t0 = performance.now()
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 1600)
    rev.value = 2.33 * (1 - Math.pow(1 - k, 3))
    if (k < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  io = new IntersectionObserver(([en]) => {
    inView.value = en.isIntersecting
    if (en.isIntersecting && !revealed.value) {
      revealed.value = true
      setTimeout(() => { shown.value = true }, 500)
      if (reduce) rev.value = 2.33
      else countUp()
    }
  }, { threshold: 0.25 })
  io.observe(rootEl.value)
  if (reduce) return
  timer = setInterval(() => {
    if (!inView.value || document.hidden) return
    tick++
    roleHot.value = tick % roles.length
    if (tick % 3 === 0) {
      whQty.value -= 12
      vanQty.value += 12
      pulse.value = true
      setTimeout(() => { pulse.value = false }, 900)
      if (whQty.value < 1100) { whQty.value = 1240; vanQty.value = 36 }
    }
    const i = tick % plan.value.length
    plan.value[i].v++
    flashI.value = i
    setTimeout(() => { flashI.value = -1 }, 900)
    if (plan.value[i].v > [30, 12, 12][i]) plan.value[i].v = [24, 6, 8][i]
  }, 1600)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  cancelAnimationFrame(raf)
  io?.disconnect()
})
</script>

<style>
.bn, .bn * { box-sizing: border-box; }
.bn {
  --o: #f2540c;
  --ink: #0f172a;
  --mut: #6b7280;
  --line: #ececf0;
  --u: clamp(26px, 4.4vh, 38px); /* row unit for mocks */
  --bn-offset: 72px; /* height of your sticky site header; set 0 if none */
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
}
.bn-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(40px, 6vw, 80px) clamp(16px, 3vw, 32px); }

.bn-title {
  margin: 0 auto clamp(24px, 3.4vw, 44px);
  max-width: 900px;
  padding-bottom: 0.12em;
  text-align: center;
  text-wrap: balance;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(36px, 3.6vw, 56px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.06em;
}
.bn-title em {
  display: inline-block;
  font-style: normal;
  background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- grid: 2 + 3 ---------- */
.bn-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: clamp(10px, 1.3vw, 16px); }
.bn-c1, .bn-c2 { grid-column: span 3; }
.bn-c3, .bn-c4, .bn-c5 { grid-column: span 2; }

.bn-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 380px;
  padding: clamp(18px, 2vw, 26px);
  border: 1px solid var(--line);
  border-radius: 26px;
  overflow: hidden;
  background: #fafafb;
  opacity: 0;
  translate: 0 22px;
  transition: opacity 0.7s ease, translate 0.9s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease;
  transition-delay: calc(var(--i) * 0.1s);
}
.bn-in .bn-card { opacity: 1; translate: 0 0; }
.bn-card:hover { box-shadow: 0 26px 46px -32px rgba(15, 23, 42, 0.35); }

.bn-t { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 0 0 clamp(12px, 2vh, 18px); font-family: 'Inter Display', Inter, system-ui, sans-serif; font-size: clamp(18px, 1.5vh + 6px, 22px); font-weight: 500; line-height: 1.25; letter-spacing: -0.025em; color: #14152b; }
/* "+" marker that turns into "x" on hover */
.bn-t::after { content: ''; flex: none; width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(20, 21, 43, 0.14); background: linear-gradient(currentColor, currentColor) center / 10px 1.5px no-repeat, linear-gradient(currentColor, currentColor) center / 1.5px 10px no-repeat; color: #14152b; transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.3s, border-color 0.3s, color 0.3s; }
.bn-card:hover .bn-t::after, .bn-card:focus-visible .bn-t::after { transform: rotate(135deg); background-color: var(--o); border-color: var(--o); color: #fff; }

/* description opens inline under the title; the visual below makes room */
.bn-card { outline: none; }
.bn-card:focus-visible { box-shadow: 0 0 0 3px rgba(242, 84, 12, 0.55); }
.bn-hov { flex: none; display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s ease; }
.bn-hov p::after { content: ''; display: block; height: clamp(12px, 2vh, 18px); }
.bn-hov p { min-height: 0; overflow: hidden; margin: 0; padding-right: 34px; font-size: clamp(13.5px, 1.4vh + 3px, 15px); line-height: 1.55; color: #64748b; }
.bn-card:hover .bn-hov, .bn-card:focus-visible .bn-hov { grid-template-rows: 1fr; opacity: 1; }

/* single dark card keeps the section rich without extra colours */
.bn-dark { border-color: transparent; background: radial-gradient(420px 260px at 100% 0%, rgba(242, 84, 12, 0.28), transparent 70%), linear-gradient(160deg, #1a2338, #0b1120); }
.bn-dark .bn-t { color: #fff; }
.bn-dark .bn-t::after { border-color: rgba(255, 255, 255, 0.3); color: #fff; }
.bn-dark .bn-hov p { color: rgba(255, 255, 255, 0.72); }

/* ---------- white mock window ---------- */
.bn-win { flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; border-radius: 16px; background: #fff; box-shadow: 0 22px 40px -26px rgba(0, 0, 0, 0.55); }
.bn-seg { display: inline-flex; gap: 2px; padding: 3px; border-radius: 10px; background: #f4f4f6; }
.bn-seg button { padding: 3px 10px; border: 0; border-radius: 8px; background: transparent; color: var(--mut); font: 500 12px 'Poppins', system-ui, sans-serif; cursor: pointer; transition: background 0.25s, color 0.25s; }
.bn-seg button:hover { color: var(--ink); }
.bn-seg button.on { background: #fff; color: var(--o); box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12); }
.bn-live s, .bn-rv-h s { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: bn-blink 1.6s ease-in-out infinite; }
@keyframes bn-blink { 50% { opacity: 0.3; } }

/* dashboard: total on the left, one column per branch on the right */
.bn-dash { flex-direction: row; gap: clamp(14px, 2vw, 28px); padding: clamp(14px, 2.4vh, 22px) clamp(16px, 1.8vw, 24px); }
.bn-dl { flex: 0 0 38%; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
.bn-k { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--mut); }
.bn-k s { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: bn-blink 1.6s ease-in-out infinite; }
.bn-tot { font-family: 'Inter Display', Inter, system-ui, sans-serif; font-size: clamp(26px, 4.4vh, 38px); font-weight: 500; letter-spacing: -0.05em; line-height: 1; font-variant-numeric: tabular-nums; }
.bn-dl .bn-seg { align-self: flex-start; }
.bn-cols { flex: 1; min-width: 0; margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(8px, 1vw, 14px); }
.bn-cols li { display: flex; flex-direction: column; align-items: center; gap: 6px; min-height: 0; }
.bn-cols small { font-size: 11.5px; font-weight: 500; color: #475569; font-variant-numeric: tabular-nums; }
.bn-cols em { font-size: 11.5px; font-style: normal; color: var(--mut); }
.bn-cb { flex: 1; width: 100%; min-height: 0; display: flex; align-items: flex-end; border-radius: 9px; background: #f4f4f6; overflow: hidden; }
.bn-cb i { width: 100%; border-radius: 9px; background: #d5d9e0; transition: height 1.1s cubic-bezier(0.2, 0.8, 0.2, 1); }
.bn-cols li.top .bn-cb i { background: var(--o); }
.bn-cols li.top small { color: var(--o); font-weight: 600; }

/* stock window */
.bn-stk { position: relative; padding: clamp(10px, 2vh, 18px) 16px; }
.bn-sl { flex: 1; min-height: 0; margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; justify-content: space-evenly; }
.bn-sl li { display: grid; grid-template-columns: 30px minmax(0, 1fr) auto; grid-template-areas: 'i n q' 'i m m'; column-gap: 10px; row-gap: 5px; align-items: center; }
.bn-sl .bn-si { grid-area: i; align-self: center; }
.bn-sl b { grid-area: n; font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bn-sl em { grid-area: q; font-style: normal; font-size: 12.5px; color: var(--mut); font-variant-numeric: tabular-nums; }
.bn-mt { grid-area: m; height: 5px; border-radius: 99px; background: #f0f0f3; overflow: hidden; }
.bn-mt i { display: block; height: 100%; border-radius: 99px; background: #cfd5de; transition: width 0.8s ease; }
.bn-sl li:first-child .bn-mt i { background: var(--o); }
.bn-ok { position: absolute; right: 12px; top: -11px; z-index: 2; padding: 3px 10px; border-radius: 999px; background: #ecfdf3; color: #15803d; font-size: 10.5px; font-weight: 600; box-shadow: 0 6px 14px -8px rgba(21, 128, 61, 0.6); opacity: 0; translate: 0 4px; transition: opacity 0.3s, translate 0.3s; }
.bn-ok.pop { opacity: 1; translate: 0 0; }
.bn-stk { overflow: visible; }
.bn-si { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; background: #f4f4f6; color: #475569; }
.bn-si-o { background: #fff1ea; color: var(--o); }

/* ---------- photo block ---------- */
.bn-ph { position: relative; flex: 1; min-height: 0; border-radius: 16px; overflow: hidden; background: linear-gradient(160deg, #cfd3da, #9aa1ad); }
.bn-ph > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.bn-card:hover .bn-ph > img { scale: 1.04; }
.bn-float { position: absolute; left: 12px; bottom: 12px; border-radius: 16px; background: rgba(255, 255, 255, 0.96); box-shadow: 0 18px 34px -18px rgba(15, 23, 42, 0.55); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }

/* roles panel */
.bn-roles { width: min(92%, 340px); padding: 10px 10px 8px; }
.bn-rt { padding: 0 6px 6px; font-size: 12px; font-weight: 500; }
.bn-rr { display: flex; align-items: center; justify-content: space-between; gap: 8px; height: calc(var(--u) * 0.9); padding: 0 6px; border-radius: 10px; transition: background 0.4s; }
.bn-rr.hot { background: #fff3ec; }
.bn-role { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; white-space: nowrap; }
.bn-role i { flex: none; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 10px; font-style: normal; font-weight: 600; }
.bn-chips { display: inline-flex; gap: 4px; }
.bn-chips b { padding: 2px 7px; border-radius: 99px; background: #f1f2f5; color: #a3a9b5; font-size: 10px; font-weight: 500; text-decoration: line-through; text-decoration-color: transparent; transition: background 0.3s, color 0.3s; }
.bn-chips b.on { background: #fff1ea; color: var(--o); font-weight: 600; }

/* revenue float */
.bn-rev { width: min(76%, 240px); padding: 12px 14px 12px; }
.bn-rv-h { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--mut); }
.bn-rv-h em { display: inline-flex; align-items: center; gap: 6px; padding: 2px 8px; border-radius: 999px; background: #ecfdf3; color: #15803d; font-size: 10.5px; font-style: normal; font-weight: 600; }
.bn-big { margin-top: 4px; font-family: 'Inter Display', Inter, system-ui, sans-serif; font-size: clamp(26px, 4.2vh, 34px); font-weight: 500; letter-spacing: -0.05em; line-height: 1.1; font-variant-numeric: tabular-nums; }
.bn-bars { display: flex; align-items: flex-end; gap: 4px; height: calc(var(--u) * 0.85); margin-top: 8px; }
.bn-bars i { flex: 1; height: 0; border-radius: 4px 4px 2px 2px; background: #f6c9b3; transition: height 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(0.5s + var(--d)); }
.bn-in .bn-bars i { height: var(--h); }
.bn-bars i.last { background: var(--o); }

/* plan */
.bn-plan { flex: 1; min-height: 0; margin: 0; padding: 4px 16px 0; list-style: none; display: flex; flex-direction: column; justify-content: space-evenly; }
.bn-plan li { display: flex; align-items: center; gap: 10px; flex: 1; border-bottom: 1px solid #f0f0f3; border-radius: 8px; transition: background 0.4s; }
.bn-plan li.flash { background: #fff6f1; }
.bn-pn { font-size: 13.5px; font-weight: 500; }
.bn-pv { margin-left: auto; min-width: 26px; text-align: right; font-size: 17px; font-weight: 500; font-variant-numeric: tabular-nums; }
.bn-plan li.flash .bn-pv { color: var(--o); }
.bn-add { padding: 3px 10px; border-radius: 999px; background: #fff1ea; color: var(--o); font-size: 11.5px; font-weight: 600; }
.bn-fee { display: flex; align-items: center; gap: 10px; margin: 10px 14px 14px; padding: 10px 12px; border-radius: 12px; background: #f4f4f6; color: #334155; font-size: 12.5px; }
.bn-fee strong { margin-left: auto; font-size: 15px; font-weight: 600; color: var(--ink); }
.bn-fee b { display: grid; place-items: center; width: 19px; height: 19px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 11px; }

/* ---------- fit one desktop screen ---------- */
@media (min-width: 1024px) and (min-height: 600px) {
  .bn { height: calc(100svh - var(--bn-offset)); min-height: 560px; display: flex; }
  .bn-wrap { width: 100%; display: flex; flex-direction: column; padding-top: clamp(12px, 2.6vh, 32px); padding-bottom: clamp(12px, 2.6vh, 32px); }
  .bn-title { flex: none; font-size: clamp(26px, min(3.2vw, 5vh), 50px); margin-bottom: clamp(10px, 2.2vh, 24px); }
  .bn-grid { flex: 1; min-height: 0; grid-template-rows: repeat(2, minmax(0, 1fr)); }
  .bn-card { min-height: 0; padding: clamp(14px, 2.6vh, 24px) clamp(16px, 1.7vw, 24px); }
}

/* touch screens: no hover, so show the description under the title */
@media (hover: none) {
  .bn-t::after { display: none; }
  .bn-hov { grid-template-rows: 1fr; opacity: 1; margin-top: calc(clamp(12px, 2vh, 18px) * -0.5); }
  .bn-hov p { padding-right: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .bn * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
}

/* ---------- smaller screens: natural stacking ---------- */
@media (max-width: 1023px), (max-height: 599px) {
  .bn-c3, .bn-c4 { grid-column: span 3; }
  .bn-c5 { grid-column: span 6; }
  .bn-win, .bn-ph { flex: none; }
  .bn-win { min-height: 220px; }
  .bn-dash { min-height: 230px; }
  .bn-ph { height: 260px; }
  .bn-plan { min-height: 150px; }
}
@media (max-width: 760px) {
  .bn-c1, .bn-c2, .bn-c3, .bn-c4, .bn-c5 { grid-column: span 6; }
  .bn-card { min-height: 0; }
  .bn-ph { height: 280px; }
  .bn-dash { flex-direction: column; }
  .bn-dl { flex: none; }
  .bn-cols { min-height: 150px; }
  .bn-role i { display: none; }
}
</style>