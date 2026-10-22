<template>
  <section class="cm" aria-labelledby="cm-title">
    <header class="cm-head">
      <span class="cm-eyebrow">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3.500 11.800 8.200 16.500 10 11.800 11.800 10 16.500 8.200 11.800 3.500 10 8.200 8.200Z" /><path d="M18 14l.9 2.100L21 17l-2.100.9L18 20l-.9-2.100L15 17l2.100-.9Z" /><path d="M18.500 3.500l.6 1.400 1.400.6-1.400.6-.6 1.400-.6-1.400-1.400-.6 1.400-.6Z" /></svg>
        Unified CRM Ecosystem
      </span>
      <h2 id="cm-title" class="cm-title">All your leads, customer conversations &amp; deals in <span class="nb">one place.</span></h2>
    </header>

    <div class="cm-viewport">
      <div class="cm-track">
        <div v-for="n in 2" :key="n" class="cm-set" :aria-hidden="n === 2 ? 'true' : undefined">
          <article v-for="t in tiles" :key="t.key" class="cm-tile" :class="t.kind === 'vis' ? ['cm-vis', t.bg] : 'cm-txt'" :style="{ '--w': t.w, '--k': t.k }">
            <!-- ============ visual tile ============ -->
            <div v-if="t.kind === 'vis'" class="cm-st" :class="t.st" aria-hidden="true">
              <!-- pipeline -->
              <template v-if="t.id === 'pipeline'">
                <div class="cm-kb">
                  <div class="cm-kb-h"><b>Deal pipeline</b><em>Closing date</em></div>
                  <div class="cm-kb-g">
                    <div v-for="c in kanban" :key="c.n" class="cm-kb-c">
                      <span class="ch"><i :class="c.k"></i>{{ c.n }}</span>
                      <span v-for="d in c.cards" :key="d[0]" class="cd" :class="{ drag: d[2] }"><small>{{ d[0] }}</small><b>{{ d[1] }}</b></span>
                    </div>
                  </div>
                </div>
                <div class="cm-pill dk"><i class="ok"><svg viewBox="0 0 16 16"><path d="m4 8.200 2.700 2.700L12 5.400" /></svg></i><span><b>Moved to Won</b><small>LKR 22,000</small></span></div>
              </template>

              <!-- customer 360 -->
              <template v-else-if="t.id === 'c360'">
                <div class="cm-360">
                  <div class="cm-360-h"><i>ED</i><span><b>Emily Davis</b><small>Galle · Silver</small></span></div>
                  <div class="cm-360-r"><i class="a"><svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-11.600 7.100L4 20l1-4.200A8 8 0 1 1 20 12Z" /></svg></i><span><b>WhatsApp chat</b><small>Asked about pricing</small></span><time>10:15</time></div>
                  <div class="cm-360-r"><i class="b"><svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7Z" /><path d="M14 3v5h5" /></svg></i><span><b>Quote sent</b><small>QT-2026-000010</small></span><time>Mon</time></div>
                </div>
                <div class="cm-pill lt c"><i class="ac"><svg viewBox="0 0 24 24"><path d="M4 12.500 9 17.500 20 6.500" /></svg></i><span><b>Call recorded</b><small>ext 1001 · 4:05</small></span></div>
              </template>

              <!-- quotation -->
              <template v-else-if="t.id === 'quote'">
                <div class="cm-doc">
                  <div class="cm-doc-h"><em>QUOTATION</em><b>QT-2026-000010</b></div>
                  <div class="cm-doc-cli"><i></i><span><b>John Smith</b><small>Services</small></span></div>
                  <div class="cm-doc-row"><span>Installation</span><b>LKR 12,000</b></div>
                  <div class="cm-doc-row"><span>Support plan</span><b>LKR 6,500</b></div>
                  <div class="cm-doc-tot"><span>Total</span><b>LKR 18,500</b></div>
                </div>
                <div class="cm-pill dk"><i class="ok"><svg viewBox="0 0 16 16"><path d="m4 8.200 2.700 2.700L12 5.400" /></svg></i><span><b>Invoice ready</b><small>1-click convert</small></span></div>
              </template>

              <!-- reminders -->
              <template v-else-if="t.id === 'tasks'">
                <div class="cm-cal">
                  <div class="cm-cal-h"><b>September 2026</b><span><i></i><i></i></span></div>
                  <div class="cm-cal-g">
                    <span v-for="(d, k) in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="'w' + k" class="w">{{ d }}</span>
                    <span v-for="(d, k) in days" :key="'d' + k" :class="{ on: d === 16, dot: d === 9 || d === 23 }">{{ d }}</span>
                  </div>
                </div>
                <div class="cm-rem a">
                  <i class="bell"><svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0c0 6 2.500 7.500 2.500 7.500h-17S6 15 6 9Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg></i>
                  <span><b>Follow up call</b><small>Emily Davis · 9:00 AM</small></span>
                </div>
                <div class="cm-rem b">
                  <i class="warn">!</i>
                  <span><b>Overdue deal</b><small>QT-2026-000005</small></span>
                </div>
              </template>

              <!-- mobile -->
              <template v-else-if="t.id === 'mobile'">
                <div class="cm-phone">
                  <div class="cm-notch"></div>
                  <div class="cm-ph-top"><small>11:47</small></div>
                  <div class="cm-ph-hi"><small>Hey Maria</small><b>Today's visits</b></div>
                  <div class="cm-ph-row" v-for="(r, i) in visits" :key="r[0]" :class="{ on: i === 0 }">
                    <i>{{ r[0] }}</i><span><b>{{ r[1] }}</b><small>{{ r[2] }}</small></span>
                  </div>
                </div>
                <div class="cm-pill lt l"><i class="ac"><svg viewBox="0 0 24 24"><path d="M4 12.500 9 17.500 20 6.500" /></svg></i><span><b>Estimate sent</b><small>from the field</small></span></div>
                <div class="cm-pill lt r"><i class="ac"><svg viewBox="0 0 24 24"><path d="M4 12.500 9 17.500 20 6.500" /></svg></i><span><b>Notes logged</b><small>meeting · 10:30</small></span></div>
              </template>

              <!-- recycle -->
              <template v-else>
                <div class="cm-bin">
                  <div class="cm-bin-h"><i class="tr"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4.500h6V7M6.500 7l1 13h9l1-13" /></svg></i><b>Recycle Bin</b><small>2 items</small></div>
                  <div class="cm-bin-r on"><span><b>John Smith</b><small>Lead · deleted 2 days ago</small></span><em>Restore</em></div>
                  <div class="cm-bin-r"><span><b>QT-2026-000002</b><small>Quote · deleted 5 days ago</small></span><em>Restore</em></div>
                </div>
                <div class="cm-pill dk c"><i class="ok"><svg viewBox="0 0 16 16"><path d="m4 8.200 2.700 2.700L12 5.400" /></svg></i><span><b>Lead restored</b><small>Audit log updated</small></span></div>
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
/**
 * CrmMarquee.vue — Section 1: continuously scrolling feature marquee (Vue 3, <script setup>).
 * All six CRM features: Sales Deal Pipeline & Kanban · Customer 360° & Activity Timeline ·
 *   Scheduled Tasks, Follow-Up Reminders & Overdue Deal Alerts · Instant PDF Quotations & Proposals ·
 *   Lead Recycle Bin & Anti-Loss Data Protection · Mobile Sales & Field Rep Companion
 * Header = eyebrow + heading only (no sub-paragraph).
 * Everything is CSS-only mock UI (no image assets needed). The set is rendered twice (second copy aria-hidden)
 * and translated by -50% for a seamless loop; it pauses on hover / focus and respects reduced motion.
 */
// each feature = one visual tile + one text tile (w = tile width at desktop size, k = zoom of the mock UI)
const features = [
  {
    id: 'pipeline', bg: 'img1', w: 500, k: 1.3, st: '',
    name: 'Sales Deal Pipeline',
    text: 'Drag and drop quotes across customizable pipeline stages and watch stage volumes update in real time.',
    icon: ['M7 4v16M17 4v16', 'M3 8h8M13 14h8'],
  },
  {
    id: 'c360', bg: 'stone', w: 420, k: 1.3, st: '',
    name: 'Customer 360° Timeline',
    text: 'Calls, WhatsApp chats, quotes, invoices and follow-ups for every customer in one unified view.',
    icon: ['M12 7v5l3 2', 'M21 12a9 9 0 1 1-3-6.700', 'M21 4v4h-4'],
  },
  {
    id: 'tasks', bg: 'peach', w: 440, k: 1.25, st: '',
    name: 'Follow-Up Reminders',
    text: 'Snooze-ready follow-up tasks, pop-up reminders and overdue deal alerts so no lead ever goes cold.',
    icon: ['M6 9a6 6 0 0 1 12 0c0 6 2.500 7.500 2.500 7.500h-17S6 15 6 9Z', 'M10 20a2 2 0 0 0 4 0'],
  },
  {
    id: 'quote', bg: 'img2', w: 470, k: 1.3, st: '',
    name: 'Instant PDF Quotations',
    text: 'Generate audit-ready PDF quotes in seconds, apply taxes and discounts, and convert to an invoice in one click.',
    icon: ['M7 3h7l5 5v13H7Z', 'M14 3v5h5', 'M10 13h6M10 17h6'],
  },
  {
    id: 'bin', bg: 'dusk', w: 430, k: 1.25, st: '',
    name: 'Lead Recycle Bin',
    text: 'One-click restore and an audit log protect your pipeline from accidental or rogue deletion.',
    icon: ['M4 7h16M9 7V4.500h6V7M6.500 7l1 13h9l1-13'],
  },
  {
    id: 'mobile', bg: 'coral', w: 420, k: 1.3, st: 'phone',
    name: 'Mobile Sales Companion',
    text: 'Reps on the move can open customer records, log meeting notes and send estimates from any smartphone.',
    icon: ['M8 3h8a1.500 1.500 0 0 1 1.500 1.500v15A1.500 1.500 0 0 1 16 21H8a1.500 1.500 0 0 1-1.500-1.500v-15A1.500 1.500 0 0 1 8 3Z', 'M11 18h2'],
  },
]
// text-tile widths vary a little, like the reference
const textW = [330, 310, 340, 320, 310, 330]
const tiles = features.flatMap((f, i) => [
  { ...f, kind: 'vis', key: f.id + '-v' },
  { ...f, kind: 'txt', key: f.id + '-t', w: textW[i] },
])

const kanban = [
  { n: 'Draft', k: 'd', cards: [['QT-…0010', 'LKR 18.5k'], ['QT-…0015', 'LKR 8.4k']] },
  { n: 'Sent', k: 's', cards: [['QT-…0008', 'LKR 20k'], ['QT-…0012', 'LKR 22k', true]] },
  { n: 'Won', k: 'w', cards: [['QT-…0004', 'LKR 41k'], ['QT-…0003', 'LKR 25k']] },
]

// September 2026 starts on a Tuesday → one leading blank cell in a Monday-first grid
const days = ['', ...Array.from({ length: 30 }, (_, i) => i + 1)]
const visits = [
  ['JS', 'John Smith', 'Colombo · 10:30'],
  ['SJ', 'S. Johnson', 'Kandy · 13:00'],
  ['ED', 'Emily Davis', 'Galle · 15:15'],
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap');

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
.cm:hover .cm-track {
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
.cm-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 clamp(16px, 4vw, 48px) clamp(28px, 4vw, 52px);
  text-align: center;
}
.cm-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: linear-gradient(#f8f6f1, #f8f6f1) padding-box, linear-gradient(90deg, #ff9a3d, #e5336b) border-box;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #e2492b;
}
.cm-eyebrow svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.800;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cm-title {
  max-width: 980px;
  margin: 22px 0 0;
  color: #0f172a;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: clamp(30px, 4.4vw, 62px);
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
  background: url('./assets/crm-grad-orange.jpg') center / cover no-repeat, linear-gradient(160deg, #e9732a, #2c5d93);
}
.cm-vis.img2 {
  background: url('./assets/crm-grad-sky.jpg') center / cover no-repeat, linear-gradient(180deg, #4677ac, #ff6a1a);
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