<template>
  <section class="cm" aria-labelledby="cm-title">
    <header class="cm-head">
      <h2 id="cm-title" class="cm-title">CRM solutions for your <span class="nb">industry.</span></h2>
      <p class="cm-sub">
        Saptivo adapts to the pace of your business, whether you run a supermarket chain, a distribution hub,
        a contracting firm or a fleet of service technicians.
      </p>
    </header>

    <div class="cm-viewport">
      <div class="cm-track">
        <div v-for="n in 2" :key="n" class="cm-set" :aria-hidden="n === 2 ? 'true' : undefined">
          <article v-for="t in tiles" :key="t.key" class="cm-tile" :class="t.kind === 'vis' ? ['cm-vis', t.bg] : t.kind === 'photo' ? 'cm-photo' : 'cm-txt'" :style="{ '--w': t.w, '--k': t.k }">
            <!-- ============ photo tile ============ -->
            <template v-if="t.kind === 'photo'">
              <img class="cm-img" :src="t.src" :style="{ objectPosition: t.pos }" alt="" loading="lazy" draggable="false" @error="$event.target.style.display = 'none'" />
              <div class="cm-pill lt ph" :class="t.side" aria-hidden="true">
                <i class="ac"><svg viewBox="0 0 24 24"><path :d="t.pill[2]" /></svg></i>
                <span><b>{{ t.pill[0] }}</b><small>{{ t.pill[1] }}</small></span>
              </div>
            </template>

            <!-- ============ visual tile ============ -->
            <div v-else-if="t.kind === 'vis'" class="cm-st" :class="t.st" aria-hidden="true">
              <!-- retail & supermarkets -->
              <template v-if="t.id === 'retail'">
                <div class="cm-360">
                  <div class="cm-360-h"><i>ED</i><span><b>Emily Davis</b><small>Colombo 03 branch · Gold tier</small></span></div>
                  <div class="cm-360-r"><i class="a"><svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-11.600 7.100L4 20l1-4.200A8 8 0 1 1 20 12Z" /></svg></i><span><b>WhatsApp receipt</b><small>INV-2041 · LKR 8,450</small></span><time>10:15</time></div>
                  <div class="cm-360-r"><i class="b"><svg viewBox="0 0 24 24"><path d="m12 3.500 2.600 5.300 5.800.8-4.200 4.100 1 5.800L12 16.800l-5.200 2.700 1-5.800-4.200-4.100 5.800-.8Z" /></svg></i><span><b>+84 loyalty points</b><small>Silver → Gold tier</small></span><time>Today</time></div>
                </div>
                <div class="cm-pill lt c"><i class="ac"><svg viewBox="0 0 24 24"><path d="M4 12.500 9 17.500 20 6.500" /></svg></i><span><b>12 branches</b><small>one live dashboard</small></span></div>
              </template>

              <!-- wholesale & distribution -->
              <template v-else-if="t.id === 'wholesale'">
                <div class="cm-doc">
                  <div class="cm-doc-h"><em>BULK QUOTE</em><b>BQ-0042</b></div>
                  <div class="cm-doc-cli"><i></i><span><b>Lanka Traders</b><small>Credit · 30 days</small></span></div>
                  <div class="cm-doc-row"><span>100–499 units</span><b>LKR 410</b></div>
                  <div class="cm-doc-row"><span>500+ units</span><b>LKR 385</b></div>
                  <div class="cm-doc-tot"><span>Total</span><b>LKR 192.5k</b></div>
                </div>
                <div class="cm-cred"><b>Credit limit</b><span class="bar"><i></i></span><small>72% used · LKR 1.8M</small></div>
                <div class="cm-pill dk cr"><i class="ok"><svg viewBox="0 0 16 16"><path d="m4 8.200 2.700 2.700L12 5.400" /></svg></i><span><b>Tier applied</b><small>500+ units</small></span></div>
              </template>

              <!-- contractors & services -->
              <template v-else-if="t.id === 'jobs'">
                <div class="cm-ms">
                  <div class="cm-ms-h"><span><b>Kitchen renovation</b><small>Job #214 · LKR 480,000</small></span><em>Estimate approved</em></div>
                  <div class="cm-ms-r done"><i><svg viewBox="0 0 24 24"><path d="M4 12.500 9 17.500 20 6.500" /></svg></i><span><b>Deposit paid</b><small>30% · LKR 144,000</small></span></div>
                  <div class="cm-ms-r on"><i></i><span><b>Framing and fit-out</b><small>In progress · 62%</small></span><em>62%</em></div>
                  <div class="cm-ms-r"><i></i><span><b>Final handover</b><small>30% · on completion</small></span></div>
                </div>
              </template>

              <!-- field service & maintenance -->
              <template v-else-if="t.id === 'field'">
                <div class="cm-phone">
                  <div class="cm-notch"></div>
                  <div class="cm-ph-top"><small>11:47</small></div>
                  <div class="cm-ph-hi"><small>Hey Nimal</small><b>Today's visits</b></div>
                  <div class="cm-ph-row" v-for="(r, i) in visits" :key="r[0]" :class="{ on: i === 0 }">
                    <i>{{ r[0] }}</i><span><b>{{ r[1] }}</b><small>{{ r[2] }}</small></span>
                  </div>
                </div>
                <div class="cm-pill lt l"><i class="ac"><svg viewBox="0 0 24 24"><path d="M4 12.500 9 17.500 20 6.500" /></svg></i><span><b>AMC visit logged</b><small>from the field</small></span></div>
                <div class="cm-pill lt r"><i class="ac"><svg viewBox="0 0 24 24"><path d="M4 12.500 9 17.500 20 6.500" /></svg></i><span><b>Next service booked</b><small>in 90 days</small></span></div>
              </template>

              <!-- startups & SMEs -->
              <template v-else>
                <div class="cm-plan">
                  <div class="cm-plan-h"><b>Growing with you</b><em>Starter</em></div>
                  <div v-for="r in plan" :key="r[0]" class="cm-plan-r">
                    <span><b>{{ r[0] }}</b><small>{{ r[1] }}</small></span>
                    <span class="bar"><i :style="{ width: r[2] + '%' }"></i></span>
                  </div>
                </div>
                <div class="cm-pill dk c"><i class="ok"><svg viewBox="0 0 16 16"><path d="m4 8.200 2.700 2.700L12 5.400" /></svg></i><span><b>Scales with you</b><small>add users and branches</small></span></div>
              </template>
            </div>

            <!-- ============ text tile (the description lives in its own card) ============ -->
            <template v-else>
              <i class="cm-ti"><svg viewBox="0 0 24 24" aria-hidden="true"><path v-for="d in t.icon" :key="d" :d="d" /></svg></i>
              <div>
                <h3>{{ t.name }}</h3>
                <p>{{ t.text }}</p>
              </div>
            </template>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: "HomeSectionTen" });

/**
 * CrmIndustries.vue — "CRM solutions for your industry": continuously scrolling marquee (Vue 3, <script setup>).
 * Five industries: Retail & supermarkets · Wholesale & distribution · Contractors & services ·
 *   Field service & maintenance · Startups & SMEs.
 * Header = heading + one-line intro.
 * Mock UIs are CSS-only; photo tiles use the `photos` list below. The set is rendered twice (second copy aria-hidden)
 * and translated by -50% for a seamless loop; it pauses on hover / focus and respects reduced motion.
 */
// each industry = one visual tile + one text tile (w = tile width at desktop size, k = zoom of the mock UI)
const features = [
  {
    id: 'retail', bg: 'img1', w: 460, k: 1.3, st: '',
    name: 'Retail and supermarkets',
    text: 'Loyalty tiers, WhatsApp receipts and multi-branch control.',
    icon: ['M4 9l1.500-5h13L20 9', 'M4 9h16v11H4Z', 'M9.500 20v-5h5v5'],
  },
  {
    id: 'wholesale', bg: 'stone', w: 440, k: 1.3, st: '',
    name: 'Wholesale and distribution',
    text: 'Tier pricing, credit tracking and bulk quotations.',
    icon: ['M3 8l9-5 9 5v8l-9 5-9-5Z', 'M3 8l9 5 9-5', 'M12 13v8'],
  },
  {
    id: 'jobs', bg: 'peach', w: 440, k: 1.25, st: '',
    name: 'Contractors and services',
    text: 'Estimates, milestone deposits and job tracking.',
    icon: ['M4 17h16', 'M6 17a6 6 0 0 1 12 0', 'M12 6v5', 'M9.500 6h5'],
  },
  {
    id: 'field', bg: 'coral', w: 420, k: 1.3, st: 'phone',
    name: 'Field service and maintenance',
    text: 'AMC contracts, preventive visits and technician apps.',
    icon: ['M14.500 6a4 4 0 0 0 4.900 5L9.500 20.900a2 2 0 0 1-2.800-2.800L16.600 8.200A4 4 0 0 0 14.500 6z'],
  },
  {
    id: 'sme', bg: 'dusk', w: 430, k: 1.25, st: '',
    name: 'Startups and SMEs',
    text: 'A simple, affordable CRM for small business that scales.',
    icon: ['M3 17l6-6 4 4 8-8', 'M15 7h6v6'],
  },
]
// text-tile widths vary a little, like the reference
const textW = [320, 320, 310, 330, 320]

// ---- photo tiles ------------------------------------------------------------------------------
// Real photos between the feature pairs (like the reference). Add more URLs to this list for variety;
// with a single photo the tiles simply reuse it with a different crop. If an image fails to load the
// tile falls back to a gradient. Each photo tile carries a small floating UI chip.
const photos = [
  'https://images.unsplash.com/photo-1678227547316-fb79e35b085d?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  `${import.meta.env.BASE_URL}images/marquee-tablet-dashboard.png`,
]
const photoMeta = [
  { w: 380, pos: '50% 30%', side: 'bl', pill: ['Loyalty points added', 'Emily Davis · Gold tier', 'M4 12.500 9 17.500 20 6.500'] },
  { w: 420, pos: '50% 50%', side: 'br', pill: ['Bulk quote accepted', 'BQ-0042 · LKR 192,500', 'M4 12.500 9 17.500 20 6.500'] },
  { w: 360, pos: '78% 40%', side: 'bl', pill: ['AMC visit scheduled', 'Preventive · Thu 09:30', 'M4 12.500 9 17.500 20 6.500'] },
]
const photoTile = (n) => ({
  ...photoMeta[n % photoMeta.length],
  kind: 'photo',
  key: 'photo-' + n,
  src: photos[n % photos.length],
})

// order: [feature pair] [feature pair] [photo] …  → 6 features, 3 photos
const tiles = features.flatMap((f, i) => {
  const pair = [
    { ...f, kind: 'vis', key: f.id + '-v' },
    { ...f, kind: 'txt', key: f.id + '-t', w: textW[i] },
  ]
  return i % 2 === 1 ? [...pair, photoTile((i - 1) / 2)] : pair
})

const visits = [
  ['CP', 'Chiller PM', 'Cargills · 09:30'],
  ['AC', 'AC service', 'Hotel Lagoon · 12:00'],
  ['GN', 'Generator check', 'AMC · 15:15'],
]
const plan = [
  ['Users', '3 → 25', 34],
  ['Leads', '120 → 5,000', 52],
  ['Branches', '1 → 12', 22],
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.cm {
  --cm-ink: #14152b;
  --cm-mute: #6f6a63;
  --cm-bg: #fff;
  --cm-card: #fff;
  --cm-line: rgba(20, 21, 43, 0.08);
  --cm-o: #f2540c;
  --cm-og: linear-gradient(145deg, #ff7a1a, #f2540c);
  --cm-gap: 16px;
  --s: 1;
  position: relative;
  padding: clamp(40px, 6vw, 84px) 0 clamp(28px, 4vw, 52px);
  background: var(--cm-bg);
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--cm-ink);
  overflow: hidden;
  isolation: isolate;
}
.cm,
.cm *,
.cm *::before,
.cm *::after {
  box-sizing: border-box;
}
.cm svg {
  display: block;
}

.cm-viewport {
  overflow: hidden;
}
.cm-track {
  display: flex;
  width: max-content;
  animation: cm-loop 62s linear infinite;
  will-change: transform;
}
.cm-viewport:hover .cm-track,
.cm-viewport:active .cm-track {
  animation-play-state: paused;
}
.cm-set {
  display: flex;
  gap: var(--cm-gap);
  padding-right: var(--cm-gap); /* so -50% lands exactly on the start of the 2nd set */
}
@keyframes cm-loop {
  to {
    transform: translateX(-50%);
  }
}

/* ---------- header ---------- */
.cm-sub {
  max-width: 720px;
  margin: 14px 0 0;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(15px, 1.1vw, 18px);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.015em;
  color: #475569;
}

.cm-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 clamp(16px, 4vw, 48px) clamp(28px, 4vw, 52px);
  text-align: center;
}

.cm-title {
  max-width: 980px;
  margin: 0;
  padding-bottom: 0.1em;
  color: #0f172a;
  font-family: 'Urbanist', system-ui, sans-serif;
  font-size: clamp(32px, 4.2vw, 62px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.05em;
}
.cm-title span {
  white-space: nowrap;
   background: linear-gradient(100deg, #ff9a3d 0%, #ff6a1a 45%, #f2540c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: 0.1em;
}
.cm-vis.dusk {
  background:
    radial-gradient(60% 70% at 92% 8%, #ff9a2e 0, transparent 62%),
    radial-gradient(60% 60% at 8% 90%, #1d4f86 0, transparent 70%),
    linear-gradient(150deg, #24456f, #e5762c);
}

/* ---------- 0 · pipeline ---------- */
.cm-kb {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 14px;
  padding: 9px 10px 10px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 14px 26px -16px rgba(0, 0, 0, 0.55);
}
.cm-kb-h {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
}
.cm-kb-h b {
  font-size: 10.500px;
  font-weight: 600;
}
.cm-kb-h em {
  font-style: normal;
  font-size: 8.500px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #15162b;
  color: #fff;
}
.cm-kb-g {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}
.cm-kb-c {
  display: grid;
  gap: 4px;
  align-content: start;
}
.cm-kb-c .ch {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 8.500px;
  font-weight: 600;
}
.cm-kb-c .ch i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
}
.cm-kb-c .ch i.s {
  background: #3b82f6;
}
.cm-kb-c .ch i.w {
  background: #16a34a;
}
.cm-kb-c .cd {
  display: grid;
  gap: 1px;
  padding: 5px 6px;
  border: 1px solid #eee7de;
  border-radius: 7px;
  background: #fff;
}
.cm-kb-c .cd small {
  font-size: 7px;
  color: var(--cm-mute);
  white-space: nowrap;
}
.cm-kb-c .cd b {
  font-size: 8.500px;
  font-weight: 600;
  white-space: nowrap;
}
.cm-kb-c .cd.drag {
  border-color: #ffc9a8;
  background: #fff6f0;
  transform: rotate(-2deg);
  box-shadow: 0 8px 12px -6px rgba(20, 21, 43, 0.35);
}

/* ---------- 1 · customer 360 ---------- */
.cm-360 {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 16px;
  padding: 10px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 14px 26px -18px rgba(20, 21, 43, 0.35);
  display: grid;
  gap: 6px;
}
.cm-360-h {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--cm-line);
}
.cm-360-h i {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #15162b;
  color: #fff;
  font-style: normal;
  font-size: 8.500px;
  font-weight: 600;
}
.cm-360-h span,
.cm-360-r span {
  display: grid;
  line-height: 1.25;
}
.cm-360-h b {
  font-size: 11px;
  font-weight: 600;
}
.cm-360-h small,
.cm-360-r small {
  font-size: 8.500px;
  color: var(--cm-mute);
}
.cm-360-r {
  display: flex;
  align-items: center;
  gap: 8px;
}
.cm-360-r i {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  flex: none;
}
.cm-360-r i.a {
  background: #f1ece5;
}
.cm-360-r i.b {
  background: #fff1e7;
}
.cm-360-r i svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: var(--cm-ink);
  stroke-width: 1.900;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cm-360-r i.b svg {
  stroke: var(--cm-o);
}
.cm-360-r b {
  font-size: 10px;
  font-weight: 500;
}
.cm-360-r time {
  margin-left: auto;
  font-size: 8.500px;
  color: #9a948b;
}

/* ---------- tiles (borderless, varied widths, like the reference) ---------- */
.cm-tile {
  position: relative;
  flex: none;
  width: calc(var(--w, 400) * var(--s) * 1px);
  height: calc(380px * var(--s));
  border-radius: 16px;
  overflow: hidden;
}
.cm-st {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 318px;
  height: 212px;
  transform: translate(-50%, -50%) scale(calc(var(--k, 1.2) * var(--s)));
  transform-origin: 50% 50%;
}
.cm-st.phone {
  top: calc(34px * var(--s));
  transform: translate(-50%, 0) scale(calc(var(--k, 1.2) * var(--s)));
  transform-origin: 50% 0;
}
.cm-st.phone .cm-phone {
  height: 340px;
}
.cm-txt {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding: calc(30px * var(--s));
  background: #efe9e3;
}
.cm-ti {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #15162b;
}
.cm-ti svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.700;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cm-txt h3 {
  margin: 0;
  font-size: clamp(18px, 1.5vw, 21px);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.015em;
}
.cm-txt p {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--cm-mute);
}

/* ---------- visual backdrops ---------- */
.cm-vis.img1 {
  background: linear-gradient(160deg, #e9732a, #2c5d93);
}
.cm-vis.img2 {
  background: linear-gradient(180deg, #4677ac, #ff6a1a);
}
.cm-vis.stone {
  background: linear-gradient(180deg, #ece6df, #e6dfd6);
}
.cm-vis.peach {
  background: linear-gradient(180deg, #fff0e6, #fcdcc8);
}
.cm-vis.coral {
  background: linear-gradient(165deg, #d4503c 0%, #e5826a 55%, #f1c9b3 100%);
}

/* ---------- photo tiles ---------- */
.cm-photo {
  background: linear-gradient(160deg, #24456f, #e5762c); /* fallback while / if the photo is unavailable */
}
.cm-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.cm-photo:hover .cm-img {
  transform: scale(1.04);
}
.cm-pill.ph {
  bottom: calc(18px * var(--s));
  padding-right: 18px;
  z-index: 1;
}
.cm-pill.ph.bl {
  left: calc(18px * var(--s));
}
.cm-pill.ph.br {
  right: calc(18px * var(--s));
}
.cm-pill.ph b {
  font-size: 12.500px;
}
.cm-pill.ph small {
  font-size: 10.500px;
}

/* floating pills */
.cm-pill {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 14px 8px 8px;
  border-radius: 999px;
  white-space: nowrap;
}
.cm-pill span {
  display: grid;
  line-height: 1.25;
}
.cm-pill b {
  font-size: 11.500px;
  font-weight: 600;
}
.cm-pill small {
  font-size: 9.500px;
  opacity: 0.7;
}
.cm-pill i {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex: none;
}
.cm-pill i svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: #fff;
  stroke-width: 2.200;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cm-pill.dk {
  background: #15162b;
  color: #fff;
  box-shadow: 0 14px 24px -12px rgba(0, 0, 0, 0.55);
}
.cm-pill.dk i.ok {
  background: var(--cm-og);
}
.cm-pill.lt {
  background: rgba(255, 255, 255, 0.95);
  color: var(--cm-ink);
  box-shadow: 0 12px 22px -12px rgba(15, 23, 42, 0.45);
}
.cm-pill.lt i.ac {
  background: var(--cm-og);
}

/* ---------- 1 · quotation ---------- */
.cm-doc {
  position: absolute;
  left: 14px;
  top: 16px;
  width: 162px;
  padding: 11px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 16px 30px -16px rgba(0, 0, 0, 0.5);
  display: grid;
  gap: 7px;
}
.cm-doc-h {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.cm-doc-h em {
  font-style: normal;
  font-size: 7.500px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--cm-o);
}
.cm-doc-h b {
  white-space: nowrap;
  font-size: 9px;
  font-weight: 600;
}
.cm-doc-cli {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px;
  border-radius: 8px;
  background: #f6f2ec;
}
.cm-doc-cli i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #15162b;
}
.cm-doc-cli span {
  display: grid;
  line-height: 1.2;
}
.cm-doc-cli b {
  font-size: 10px;
  font-weight: 600;
}
.cm-doc-cli small {
  font-size: 8.500px;
  color: var(--cm-mute);
}
.cm-doc-row {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: var(--cm-mute);
  padding-bottom: 5px;
  border-bottom: 1px dashed #e8e1d8;
}
.cm-doc-row b {
  font-weight: 500;
  color: var(--cm-ink);
}
.cm-doc-tot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 10px;
  font-weight: 600;
}
.cm-doc-tot b {
  font-size: 13px;
  color: var(--cm-o);
}
.cm-pill.dk:not(.c) {
  right: 12px;
  bottom: 14px;
}

/* ---------- 2 · reminders ---------- */
.cm-cal {
  position: absolute;
  left: 14px;
  top: 16px;
  width: 144px;
  padding: 9px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 10px 22px -16px rgba(20, 21, 43, 0.35);
}
.cm-cal-h {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.cm-cal-h b {
  font-size: 10px;
  font-weight: 600;
}
.cm-cal-h span {
  display: flex;
  gap: 4px;
}
.cm-cal-h i {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: #f1ece5;
}
.cm-cal-g {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
  font-size: 8.500px;
  color: var(--cm-ink);
}
.cm-cal-g span {
  display: grid;
  place-items: center;
  height: 16px;
  border-radius: 50%;
}
.cm-cal-g .w {
  color: #a39d94;
  font-size: 8px;
}
.cm-cal-g .on {
  background: var(--cm-og);
  color: #fff;
  font-weight: 600;
}
.cm-cal-g .dot {
  background: #fde4d2;
  color: var(--cm-o);
}
.cm-rem {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 12px 22px -14px rgba(20, 21, 43, 0.4);
  border: 1px solid rgba(20, 21, 43, 0.05);
}
.cm-rem span {
  display: grid;
  line-height: 1.25;
}
.cm-rem b {
  font-size: 10.500px;
  font-weight: 600;
}
.cm-rem small {
  font-size: 9px;
  color: var(--cm-mute);
}
.cm-rem em {
  font-style: normal;
  font-size: 9px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f1ece5;
}
.cm-rem i {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  flex: none;
}
.cm-rem .bell {
  background: var(--cm-og);
}
.cm-rem .bell svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cm-rem .warn {
  background: #fde8e3;
  color: #c2391b;
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
}
.cm-rem.a {
  right: 12px;
  top: 30px;
  width: 148px;
  animation: cm-bob 5s ease-in-out infinite;
}
.cm-rem.b {
  right: 12px;
  top: 98px;
  width: 148px;
  animation: cm-bob 5s ease-in-out -2.500s infinite;
}
.cm-rem.a em {
  margin-left: auto;
}
@keyframes cm-bob {
  50% {
    transform: translateY(-4px);
  }
}

/* ---------- 3 · mobile ---------- */
.cm-phone {
  position: absolute;
  right: 16px;
  top: 22px;
  width: 124px;
  height: 230px;
  padding: 6px;
  border-radius: 24px;
  background: #0d0e1c;
  box-shadow: 0 18px 30px -14px rgba(0, 0, 0, 0.6);
  display: grid;
  align-content: start;
  gap: 5px;
  overflow: hidden;
}
.cm-phone::before {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 19px;
  background: #fff;
}
.cm-phone > * {
  position: relative;
}
.cm-notch {
  justify-self: center;
  width: 36px;
  height: 10px;
  margin-top: 5px;
  border-radius: 8px;
  background: #0d0e1c;
  z-index: 1;
}
.cm-ph-top {
  padding: 0 10px;
  margin-top: -14px;
}
.cm-ph-top small {
  font-size: 7.500px;
  font-weight: 600;
}
.cm-ph-hi {
  display: grid;
  padding: 8px 10px 2px;
  line-height: 1.2;
}
.cm-ph-hi small {
  font-size: 8px;
  color: var(--cm-mute);
}
.cm-ph-hi b {
  font-size: 12px;
  font-weight: 600;
}
.cm-ph-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 8px;
  padding: 5px;
  border-radius: 9px;
  background: #f6f2ec;
}
.cm-ph-row.on {
  background: #fff1e7;
  box-shadow: inset 0 0 0 1px #ffd3b6;
}
.cm-ph-row i {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #15162b;
  color: #fff;
  font-style: normal;
  font-size: 6.500px;
  font-weight: 600;
}
.cm-ph-row span {
  display: grid;
  line-height: 1.2;
}
.cm-ph-row b {
  font-size: 8.500px;
  font-weight: 600;
}
.cm-ph-row small {
  font-size: 7px;
  color: var(--cm-mute);
}
.cm-pill.l {
  left: 10px;
  top: 46px;
  animation: cm-bob 5s ease-in-out infinite;
}
.cm-pill.r {
  left: 10px;
  top: 108px;
  animation: cm-bob 5s ease-in-out -2.500s infinite;
}

/* ---------- 4 · recycle bin ---------- */
.cm-bin {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  padding: 10px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 14px 26px -18px rgba(150, 60, 10, 0.55);
  display: grid;
  gap: 6px;
}
.cm-bin-h {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 2px 4px;
}
.cm-bin-h b {
  font-size: 11px;
  font-weight: 600;
  flex: 1;
}
.cm-bin-h small {
  font-size: 9px;
  color: var(--cm-mute);
}
.cm-bin-h .tr {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 7px;
  background: #fde4d2;
}
.cm-bin-h .tr svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: var(--cm-o);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cm-bin-r {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 9px;
  background: #f8f5f0;
}
.cm-bin-r.on {
  background: #fff6f0;
  box-shadow: inset 0 0 0 1px #ffd3b6;
}
.cm-bin-r span {
  display: grid;
  line-height: 1.25;
}
.cm-bin-r b {
  font-size: 10px;
  font-weight: 600;
}
.cm-bin-r small {
  font-size: 8.500px;
  color: var(--cm-mute);
}
.cm-bin-r em {
  font-style: normal;
  font-size: 9px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #ebe3d9;
}
.cm-bin-r.on em {
  background: var(--cm-og);
  border-color: transparent;
  color: #fff;
}
.cm-pill.c {
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
}


/* ---------- wholesale: credit meter ---------- */
.cm-cred { position: absolute; right: 14px; top: 20px; width: 124px; padding: 9px 10px; border-radius: 12px; background: #fff; box-shadow: 0 12px 22px -14px rgba(20, 21, 43, 0.4); display: grid; gap: 5px; }
.cm-cred b { font-size: 10px; font-weight: 600; }
.cm-cred small { font-size: 8.5px; color: var(--cm-mute); }
.cm-cred .bar, .cm-plan .bar { display: block; height: 6px; border-radius: 999px; background: #f1ece5; overflow: hidden; }
.cm-cred .bar i, .cm-plan .bar i { display: block; height: 100%; border-radius: 999px; background: var(--cm-og); }
.cm-cred .bar i { width: 72%; }
.cm-pill.dk.cr { right: 10px; bottom: auto; top: 100px; }

/* ---------- contractors: milestones ---------- */
.cm-ms { position: absolute; left: 20px; right: 20px; top: 16px; padding: 10px; border-radius: 14px; background: #fff; box-shadow: 0 14px 26px -18px rgba(20, 21, 43, 0.4); display: grid; gap: 6px; }
.cm-ms-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; line-height: 1.25; padding-bottom: 6px; border-bottom: 1px solid var(--cm-line); }
.cm-ms-h > span { display: grid; }
.cm-ms-h em { font-style: normal; font-size: 8px; font-weight: 600; padding: 3px 7px; border-radius: 999px; background: #e8f8ee; color: #15803d; white-space: nowrap; }
.cm-ms-h b { font-size: 11px; font-weight: 600; }
.cm-ms-h small { font-size: 8.5px; color: var(--cm-mute); }
.cm-ms-r { display: flex; align-items: center; gap: 8px; padding: 5px 6px; border-radius: 9px; background: #f8f5f0; }
.cm-ms-r.on { background: #fff6f0; box-shadow: inset 0 0 0 1px #ffd3b6; }
.cm-ms-r i { display: grid; place-items: center; flex: none; width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid #d9cfc3; background: #fff; }
.cm-ms-r.on i { border-color: var(--cm-o); }
.cm-ms-r.done i { border-color: transparent; background: var(--cm-og); }
.cm-ms-r i svg { width: 10px; height: 10px; fill: none; stroke: #fff; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
.cm-ms-r span { display: grid; line-height: 1.2; }
.cm-ms-r b { font-size: 9.5px; font-weight: 600; }
.cm-ms-r small { font-size: 8px; color: var(--cm-mute); }
.cm-ms-r em { margin-left: auto; font-style: normal; font-size: 8.5px; font-weight: 600; color: var(--cm-o); }

/* ---------- startups: plan growth ---------- */
.cm-plan { position: absolute; left: 20px; right: 20px; top: 18px; padding: 10px 11px; border-radius: 14px; background: #fff; box-shadow: 0 14px 26px -18px rgba(20, 21, 43, 0.45); display: grid; gap: 9px; }
.cm-plan-h { display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid var(--cm-line); }
.cm-plan-h b { font-size: 11px; font-weight: 600; }
.cm-plan-h em { font-style: normal; font-size: 8.5px; font-weight: 600; padding: 3px 8px; border-radius: 999px; background: #15162b; color: #fff; }
.cm-plan-r { display: grid; gap: 4px; }
.cm-plan-r > span:first-child { display: flex; justify-content: space-between; align-items: baseline; }
.cm-plan-r b { font-size: 9.5px; font-weight: 600; }
.cm-plan-r small { font-size: 8.5px; color: var(--cm-mute); }

/* ---------- responsive / motion ---------- */
@media (max-width: 900px) {
  .cm {
    --s: 0.88;
  }
}
@media (max-width: 560px) {
  .cm {
    --s: 0.76;
    --cm-gap: 12px;
  }
  .cm-track {
    animation-duration: 48s;
  }
  .cm-doc-cli {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .cm-track {
    animation: none;
  }
  .cm-viewport {
    overflow-x: auto;
  }
  .cm-set[aria-hidden='true'] {
    display: none;
  }
  .cm-rem,
  .cm-pill {
    animation: none !important;
  }
}
</style>
