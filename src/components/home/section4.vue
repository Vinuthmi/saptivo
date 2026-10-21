<template>
  <section
    ref="rootEl"
    class="ig"
    :class="{ 'ig-in': revealed }"
    aria-labelledby="ig-title"
    aria-roledescription="carousel"
  >
    <div class="ig-wrap">
      <!-- ============ header ============ -->
      <header class="ig-head">
        <div class="ig-hl">
          <span class="ig-logo" aria-hidden="true">
            <svg width="21" height="21" viewBox="0 0 24 24"><path d="m12 3 9 4.6-9 4.6-9-4.6z" /><path d="m3 12 9 4.6 9-4.6" /><path d="m3 16.4 9 4.6 9-4.6" /></svg>
          </span>
          <h2 id="ig-title" class="ig-title">
            Built-in integrations that work for you <em>24/7.</em>
          </h2>
        </div>
        <div class="ig-hr">
          <a class="ig-btn" :href="hubUrl">Explore Integrations Hub</a>
          <p class="ig-sub">
            Saptivo connects your entire operational stack seamlessly. Auto-log phone calls, sync
            WhatsApp chats, ingest social leads instantly, and mirror tasks to Google Calendar in
            real time.
          </p>
        </div>
      </header>

      <!-- ============ tabs ============ -->
      <div class="ig-tabs" role="tablist" aria-label="Integrations">
        <button
          v-for="(s, i) in slides"
          :id="`ig-tab-${i}`"
          :key="s.id"
          type="button"
          role="tab"
          class="ig-tab"
          :class="{ on: active === i }"
          :aria-selected="active === i"
          :aria-controls="`ig-panel-${i}`"
          :tabindex="active === i ? 0 : -1"
          @click="goTo(i)"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" v-html="icon[s.icon]"></svg>
          {{ s.tab }}
        </button>
      </div>

      <!-- ============ stage ============ -->
      <div
        ref="stageEl"
        class="ig-stage"
        tabindex="0"
        role="group"
        aria-label="Integration previews"
        @keydown="onKey"
        @pointerenter="paused = true"
        @pointerleave="paused = false"
        @focusin="paused = true"
        @focusout="paused = false"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <div class="ig-view" :style="{ height: SCENE_H * scale + 'px' }">
          <button type="button" class="ig-nav ig-prev" aria-label="Previous integration" @click="step(-1)">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="m14.5 6-6 6 6 6" /></svg>
          </button>
          <button type="button" class="ig-nav ig-next" aria-label="Next integration" @click="step(1)">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6" /></svg>
          </button>

          <div class="ig-scene" :class="{ compact }" :style="{ transform: `translateX(-50%) scale(${scale})` }">
            <!-- ================= 1 · WordPress website ================= -->
            <div
              :id="`ig-panel-0`"
              class="sl"
              :class="{ on: active === 0 }"
              role="tabpanel"
              aria-labelledby="ig-tab-0"
              :aria-hidden="active === 0 ? undefined : 'true'"
            >
              <div class="col">
                <div class="src card" style="--d: 0">
                  <div class="src-top">
                    <span class="brand"><svg width="34" height="34" viewBox="0 0 48 48" v-html="art.wp"></svg></span>
                    <span class="st ok"><i></i>CONNECTED</span>
                  </div>
                  <b class="src-n">WordPress Website</b>
                  <span class="src-s">septivo.com</span>
                  <div class="metas">
                    <span><small>LAST INQUIRY</small><b>28th Sep 2026</b></span>
                    <span><small>LAST ACTIVITY</small><b>28th Sep 2026</b></span>
                  </div>
                  <span class="src-l">Manage <svg width="15" height="15" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                </div>
                <div class="side card" style="--d: 1">
                  <div class="sd-h"><b>{{ sides[0].title }}</b><span class="sd-tag"><i></i>{{ sides[0].tag }}</span></div>
                  <svg class="spark" viewBox="0 0 260 56" preserveAspectRatio="none" aria-hidden="true">
                    <path class="sa" :d="sides[0].area" />
                    <path class="sln" pathLength="100" :d="sides[0].line" />
                  </svg>
                  <div class="sd-stats">
                    <span v-for="m in sides[0].stats" :key="m.l"><b>{{ m.v }}</b><small>{{ m.l }}</small></span>
                  </div>
                </div>
              </div>

              <svg class="link" viewBox="0 0 120 40" aria-hidden="true">
                <path id="lk0" d="M2 20 H118" />
                <circle v-if="motion" r="4"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0s"><mpath href="#lk0" /></animateMotion></circle>
                <circle v-if="motion" r="4"><animateMotion dur="2.2s" repeatCount="indefinite" begin="1.1s"><mpath href="#lk0" /></animateMotion></circle>
              </svg>

              <div class="win" style="--d: 1">
                <div class="hero">
                  <div><small>INQUIRY CRM</small><h3>Inquiries</h3><p>View and manage contact inquiries received for your inventory.</p></div>
                  <span class="count"><b>4</b><small>INQUIRIES</small></span>
                </div>
                <div class="kpis">
                  <span v-for="(k, i) in webKpis" :key="k.l" :style="{ '--k': i }">
                    <b>{{ k.v }}</b><small>{{ k.l }}</small><i>{{ k.d }}</i>
                  </span>
                </div>
                <div class="thead web"><span>CUSTOMER</span><span>CONTACT</span><span>SOURCE</span><span>STATUS</span><span class="rc">RECEIVED</span></div>
                <div v-for="(r, k) in inquiries" :key="r.n" class="trow web" :class="{ fresh: k === 0 }" :style="{ '--k': k }">
                  <span class="who"><i class="av">{{ r.i }}</i><span><b>{{ r.n }}</b><small>{{ r.no }}</small></span></span>
                  <span class="ct">{{ r.e }}</span>
                  <span class="chip"><svg width="18" height="18" viewBox="0 0 24 24" v-html="icon.globe"></svg>Website integration</span>
                  <span class="pend" :class="r.cls">{{ r.s }}</span>
                  <span class="ct rc">{{ r.t }}</span>
                </div>
                <p class="foot">Showing 1–4 of 4 matching inquiries</p>
              </div>

              <div class="toast t1" style="--d: 3">
                <span class="tic"><svg width="18" height="18" viewBox="0 0 24 24" v-html="icon.chat"></svg></span>
                <span><b>New Inquiry</b><small>John Smith sent a new inquiry</small><em>28th September 2026, 10:58 AM</em></span>
              </div>
            </div>

            <!-- ================= 2 · Facebook lead ads ================= -->
            <div
              :id="`ig-panel-1`"
              class="sl"
              :class="{ on: active === 1 }"
              role="tabpanel"
              aria-labelledby="ig-tab-1"
              :aria-hidden="active === 1 ? undefined : 'true'"
            >
              <div class="col">
                <div class="src card" style="--d: 0">
                  <div class="src-top">
                    <span class="brand"><svg width="34" height="34" viewBox="0 0 48 48" v-html="art.fb"></svg></span>
                    <span class="st live"><i></i>AVAILABLE</span>
                  </div>
                  <b class="src-n">Facebook Lead Integration</b>
                  <span class="src-s">Instant Form leads from Facebook Pages</span>
                  <div class="toggle-row"><span>Auto-create leads</span><i class="sw"></i></div>
                  <div class="note"><svg width="18" height="18" viewBox="0 0 24 24" v-html="icon.bolt"></svg><span><b>Automatically add to Leads</b>New submissions are saved and ready for your team to follow up.</span></div>
                </div>
                <div class="side card" style="--d: 1">
                  <div class="sd-h"><b>{{ sides[1].title }}</b><span class="sd-tag"><i></i>{{ sides[1].tag }}</span></div>
                  <svg class="spark" viewBox="0 0 260 56" preserveAspectRatio="none" aria-hidden="true">
                    <path class="sa" :d="sides[1].area" />
                    <path class="sln" pathLength="100" :d="sides[1].line" />
                  </svg>
                  <div class="sd-stats">
                    <span v-for="m in sides[1].stats" :key="m.l"><b>{{ m.v }}</b><small>{{ m.l }}</small></span>
                  </div>
                </div>
              </div>

              <svg class="link" viewBox="0 0 120 40" aria-hidden="true">
                <path id="lk1" d="M2 20 H118" />
                <circle v-if="motion" r="4"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0s"><mpath href="#lk1" /></animateMotion></circle>
                <circle v-if="motion" r="4"><animateMotion dur="2.2s" repeatCount="indefinite" begin="1.1s"><mpath href="#lk1" /></animateMotion></circle>
              </svg>

              <div class="win" style="--d: 1">
                <div class="hero">
                  <div><small>LEAD CRM</small><h3>Lead pipeline</h3><p>Every Facebook form lands here, scored and assigned.</p></div>
                  <span class="count"><b>3</b><small>NEW LEADS</small></span>
                </div>
                <div class="pipe">
                  <div v-for="(p, k) in pipeline" :key="p.n" class="stage" :style="{ '--k': k }">
                    <small>{{ p.n }}</small>
                    <i class="orb" :class="p.c">{{ p.v }}</i>
                    <em>CONV <b>{{ p.p }}</b></em>
                  </div>
                </div>
                <div class="thead two"><span>CUSTOMER</span><span>SOURCE</span><span>LEAD STAGE</span><span class="rc">RECEIVED</span></div>
                <div v-for="(l, k) in leads" :key="l.n" class="trow two" :class="{ fresh: k === 0 }" :style="{ '--k': k }">
                  <span class="who"><i class="av">{{ l.i }}</i><span><b>{{ l.n }}</b><small>{{ l.camp }}</small></span></span>
                  <span class="chip fb"><svg width="12" height="12" viewBox="0 0 48 48" v-html="art.fb"></svg>Facebook Lead Ads</span>
                  <span class="pend" :class="l.cls">{{ l.s }}</span>
                  <span class="ct rc">{{ l.t }}</span>
                </div>
                <p class="foot">Showing 1–3 of 3 leads · last sync 0.6 s ago</p>
              </div>

              <div class="toast t2" style="--d: 3">
                <span class="tic g"><svg width="18" height="18" viewBox="0 0 24 24" v-html="icon.pin"></svg></span>
                <span><b>Lead created</b><small>Added in under 0.6 s</small></span>
              </div>
            </div>

            <!-- ================= 3 · Calls & WhatsApp ================= -->
            <div
              :id="`ig-panel-2`"
              class="sl"
              :class="{ on: active === 2 }"
              role="tabpanel"
              aria-labelledby="ig-tab-2"
              :aria-hidden="active === 2 ? undefined : 'true'"
            >
              <div class="col">
                <div class="src card" style="--d: 0">
                  <div class="src-top">
                    <span class="brand ph"><svg width="30" height="30" viewBox="0 0 24 24" v-html="icon.phone"></svg></span>
                    <span class="st ok"><i></i>ENABLED</span>
                  </div>
                  <b class="src-n">3CX Telephony Mapping</b>
                  <span class="src-s">Incoming calls open the vendor panel</span>
                  <div class="metas four">
                    <span><small>MAIN DID</small><b>117432944</b></span>
                    <span><small>QUEUE</small><b>8001</b></span>
                    <span><small>DEFAULT EXT</small><b>1001</b></span>
                    <span><small>YOUR EXT</small><b>1001</b></span>
                  </div>
                </div>
                <div class="side card" style="--d: 1">
                  <div class="sd-h"><b>{{ sides[2].title }}</b><span class="sd-tag"><i></i>{{ sides[2].tag }}</span></div>
                  <svg class="spark" viewBox="0 0 260 56" preserveAspectRatio="none" aria-hidden="true">
                    <path class="sa" :d="sides[2].area" />
                    <path class="sln" pathLength="100" :d="sides[2].line" />
                  </svg>
                  <div class="sd-stats">
                    <span v-for="m in sides[2].stats" :key="m.l"><b>{{ m.v }}</b><small>{{ m.l }}</small></span>
                  </div>
                </div>
              </div>

              <svg class="link" viewBox="0 0 120 40" aria-hidden="true">
                <path id="lk2" d="M2 20 H118" />
                <circle v-if="motion" r="4"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0s"><mpath href="#lk2" /></animateMotion></circle>
                <circle v-if="motion" r="4"><animateMotion dur="2.2s" repeatCount="indefinite" begin="1.1s"><mpath href="#lk2" /></animateMotion></circle>
              </svg>

              <div class="win" style="--d: 1">
                <div class="hero slim">
                  <div><small>PBX CALL JOURNAL</small><h3>Calls</h3></div>
                  <span class="ready"><svg width="18" height="18" viewBox="0 0 24 24" v-html="icon.phone"></svg><span><b>Call Back Ready</b><small>extension 1001 can place callbacks</small></span></span>
                </div>
                <div class="pills"><span class="on">All</span><span>Missed</span><span>Answered</span><span>Outbound</span></div>
                <div class="thead calls"><span>CUSTOMER</span><span>CALL TYPE</span><span>EXT</span><span>DURATION</span><span>DATE / TIME</span></div>
                <div v-for="(c, k) in calls" :key="c.p" class="trow calls" :class="{ fresh: k === 0 }" :style="{ '--k': k }">
                  <span class="who"><i class="av dk">{{ c.i }}</i><span><b>{{ c.n }}</b><small>{{ c.p }}</small></span></span>
                  <span class="cp" :class="c.t">{{ c.t }}</span>
                  <span class="ct">{{ c.x }}</span>
                  <span class="ct">{{ c.d }}</span>
                  <span class="ct">{{ c.at }}</span>
                </div>
                <p class="foot">Showing 1–5 of 126 calls · auto-matched to customers</p>
              </div>

              <div class="toast t3" style="--d: 3">
                <span class="tic wa"><svg width="18" height="18" viewBox="0 0 24 24" v-html="icon.wa"></svg></span>
                <span><b>WhatsApp · Kasun Perera</b><small>“Is the SUV still available?”</small><em>Logged to customer timeline</em></span>
              </div>
            </div>

            <!-- ================= 4 · Google Calendar ================= -->
            <div
              :id="`ig-panel-3`"
              class="sl"
              :class="{ on: active === 3 }"
              role="tabpanel"
              aria-labelledby="ig-tab-3"
              :aria-hidden="active === 3 ? undefined : 'true'"
            >
              <div class="col">
                <div class="src card" style="--d: 0">
                  <div class="src-top">
                    <span class="brand"><svg width="34" height="34" viewBox="0 0 24 24" v-html="art.gcal"></svg></span>
                    <span class="st ok"><i></i>2-WAY SYNC</span>
                  </div>
                  <b class="src-n">Google Calendar</b>
                  <span class="src-s">designer@saptivo.com</span>
                  <div class="mini-cal">
                    <span v-for="(d, i) in 'SMTWTFS'.split('')" :key="'h' + i" class="dw">{{ d }}</span>
                    <span v-for="n in monthDays" :key="n" :class="{ today: n === 16, ev: n === 9 || n === 22 }">{{ n }}</span>
                  </div>
                </div>
                <div class="side card" style="--d: 1">
                  <div class="sd-h"><b>{{ sides[3].title }}</b><span class="sd-tag"><i></i>{{ sides[3].tag }}</span></div>
                  <svg class="spark" viewBox="0 0 260 56" preserveAspectRatio="none" aria-hidden="true">
                    <path class="sa" :d="sides[3].area" />
                    <path class="sln" pathLength="100" :d="sides[3].line" />
                  </svg>
                  <div class="sd-stats">
                    <span v-for="m in sides[3].stats" :key="m.l"><b>{{ m.v }}</b><small>{{ m.l }}</small></span>
                  </div>
                </div>
              </div>

              <svg class="link" viewBox="0 0 120 40" aria-hidden="true">
                <path id="lk3" d="M2 20 H118" />
                <circle v-if="motion" r="4"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0s"><mpath href="#lk3" /></animateMotion></circle>
                <circle v-if="motion" r="4"><animateMotion dur="2.2s" repeatCount="indefinite" begin="1.1s" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href="#lk3" /></animateMotion></circle>
              </svg>

              <div class="win" style="--d: 1">
                <div class="cal-bar">
                  <span class="dbox"><small>OCT</small><b>16</b></span>
                  <span class="cal-t"><b>October 2026</b><small>Friday</small></span>
                  <span class="cal-act">
                    <i class="btn">Today</i>
                    <i class="btn g"><svg width="12" height="12" viewBox="0 0 48 48" v-html="art.g"></svg>Sync Google</i>
                    <i class="btn o">+ Add event</i>
                  </span>
                </div>
                <div class="day">
                  <div v-for="h in hours" :key="h" class="hr"><small>{{ h }}</small></div>
                  <span class="now"><i></i></span>
                  <div class="evt e4"><b>Quote follow-up · Lead #L-318</b><small>9:30 AM · Task</small></div>
                  <div class="evt e2"><b>Call customer</b><small>11:00 AM · Task</small></div>
                  <div class="evt e5"><b>Sales stand-up</b><small>12:30 PM · Synced to Google</small></div>
                  <div class="evt e1"><b>Client vehicle handover</b><small>2:30 PM · Synced to Google</small></div>
                  <div class="evt e3"><b>Prepare documents</b><small>4:00 PM · Task</small></div>
                  <div class="evt e6"><b>Supplier call</b><small>3:00 PM · Synced to Google</small></div>
                </div>
              </div>

              <div class="toast t4" style="--d: 3">
                <span class="tic"><svg width="18" height="18" viewBox="0 0 24 24" v-html="icon.refresh"></svg></span>
                <span><b>Event mirrored</b><small>CRM task → Google Calendar</small></span>
              </div>
            </div>
          </div>
        </div>

        <div class="ig-dots" aria-hidden="true">
          <span v-for="(s, i) in slides" :key="s.id" class="ig-dot" :class="{ on: active === i }"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * IntegrationsShowcase.vue — "Built-in integrations that work for you 24/7" (Vue 3, <script setup>)
 *
 * Each slide pairs an integration + a live-stats card (left) with the Saptivo CRM screen it feeds (right),
 * drawn from the real product UI: Inquiries, Lead pipeline, 3CX call journal and the Tasks calendar.
 * • Tabs, arrows, ← → keys, swipe and autoplay (7s; pauses on hover/focus/off-screen).
 * • Pure HTML/CSS/SVG — no image files. Scene is authored at 1160×490 and scaled to fit.
 * • prefers-reduced-motion: no autoplay, no looping animation.
 *
 * Prop: hubUrl — link for the "Explore Integrations Hub" button.
 * Browser APIs are only used in onMounted / handlers (SSR / Nuxt safe).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({ hubUrl: { type: String, default: '#integrations' } })

const SCENE_W = 1160
const SCENE_H = 490
const COMPACT_W = 700
const AUTOPLAY_MS = 7000

const slides = [
  { id: 'web', tab: 'Website leads', icon: 'globe' },
  { id: 'fb', tab: 'Social lead ads', icon: 'bolt' },
  { id: 'calls', tab: 'Calls & WhatsApp', icon: 'phone' },
  { id: 'cal', tab: 'Google Calendar', icon: 'calendar' },
]

/* demo data (mirrors the CRM screens) */
const webKpis = [
  { v: '3', l: 'New today', d: '+2' },
  { v: '4 min', l: 'Avg first reply', d: '−38%' },
  { v: '12', l: 'Won this month', d: '+4' },
]
const inquiries = [
  { i: 'JS', n: 'John Smith', no: 'Inquiry #28', e: 'john.uk.test@example.com', s: 'PENDING', cls: '', t: '2 min ago' },
  { i: 'KP', n: 'Kasun Perera', no: 'Inquiry #27', e: 'kasun.phone.test@example.com', s: 'PENDING', cls: '', t: '1 h ago' },
  { i: 'NF', n: 'Nadeesha F.', no: 'Inquiry #12', e: 'nadeesha.f@example.com', s: 'REPLIED', cls: 'blue', t: 'Yesterday' },
  { i: 'DP', n: 'Daniel Perera', no: 'Inquiry #1', e: 'daniel.perera@example.com', s: 'PENDING', cls: '', t: '3 d ago' },
]
const pipeline = [
  { n: 'Pending', v: 6, p: '100%', c: 'a' },
  { n: 'Replied', v: 2, p: '33%', c: 'a' },
  { n: 'Active', v: 2, p: '33%', c: 'a' },
  { n: 'Leads', v: 3, p: '50%', c: 'a' },
  { n: 'Failed', v: 0, p: '—', c: 'x' },
]
const leads = [
  { i: 'AS', n: 'Amal Silva', camp: 'Q3 SUV Promotion', s: 'NEW LEAD', cls: 'lead', t: '1 min ago' },
  { i: 'RJ', n: 'Ruwan Jayasinghe', camp: 'Hybrid Weekend Offer', s: 'CONTACTED', cls: 'blue', t: '22 min ago' },
  { i: 'TW', n: 'Tharushi Wickrama', camp: 'Q3 SUV Promotion', s: 'NEW LEAD', cls: 'lead', t: '2 h ago' },
]
const calls = [
  { i: 'UC', n: 'Unknown customer', p: '755322689', t: 'Missed', x: '8001', d: '0:56', at: '2026-10-07 06:49' },
  { i: 'UC', n: 'Unknown customer', p: '770629341', t: 'Answered', x: '1032', d: '1:40', at: '2026-09-30 10:29' },
  { i: 'Y', n: 'Yasasi', p: '94703970813', t: 'Outbound', x: '1001', d: '—', at: '2026-09-17 04:39' },
  { i: 'N', n: 'Nadeesha', p: '94771234567', t: 'Answered', x: '1001', d: '3:12', at: '2026-09-15 02:11' },
  { i: 'KP', n: 'Kasun Perera', p: '94712345098', t: 'Answered', x: '1032', d: '2:05', at: '2026-09-12 11:42' },
]
const monthDays = Array.from({ length: 31 }, (_, i) => i + 1)
const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM']

/* left-hand stats card: sparkline + 3 numbers per slide */
function spark(vals) {
  const W = 260
  const H = 56
  const max = Math.max(...vals)
  const pts = vals.map((v, i) => [+((i * W) / (vals.length - 1)).toFixed(1), +(H - 6 - (v / max) * (H - 16)).toFixed(1)])
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')
  return { line, area: `${line} L${W} ${H} L0 ${H}Z` }
}
const sides = [
  { title: 'Website → CRM', tag: 'Last 7 days', v: [4, 6, 5, 9, 7, 12, 15], stats: [{ v: '38', l: 'Inquiries' }, { v: '4 min', l: 'First reply' }, { v: '27%', l: 'Became leads' }] },
  { title: 'Lead ads performance', tag: 'This week', v: [2, 3, 6, 5, 9, 8, 14], stats: [{ v: '64', l: 'Leads captured' }, { v: '0.6 s', l: 'Sync time' }, { v: '92%', l: 'Contacted' }] },
  { title: 'Call & chat activity', tag: 'Today', v: [3, 7, 5, 11, 8, 6, 10], stats: [{ v: '126', l: 'Calls logged' }, { v: '18', l: 'WhatsApp chats' }, { v: '96%', l: 'Auto-matched' }] },
  { title: 'Calendar sync', tag: 'Live', v: [5, 5, 8, 6, 9, 7, 8], stats: [{ v: '42', l: 'Events mirrored' }, { v: '2-way', l: 'Direction' }, { v: '< 5 s', l: 'Latency' }] },
].map((s) => ({ ...s, ...spark(s.v) }))

const icon = {
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  phone: '<path d="M7 4.5h3l1.4 4-2 1.4a10 10 0 0 0 4.7 4.7l1.4-2 4 1.4v3a2 2 0 0 1-2.2 2A14.500 14.500 0 0 1 5 6.7 2 2 0 0 1 7 4.5z"/>',
  calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M4 10h16M8.5 4v3M15.5 4v3"/>',
  chat: '<path d="M4 5h16v11H9.5L5 20v-4H4z"/><path d="M8.5 10.5h7"/>',
  pin: '<path d="m14.5 4.5 5 5-3 .8-3.2 3.2.2 3.5-1.3 1.3-3.5-3.5L5 19l-.7-.7 4.2-5.200-3.5-3.5L6.300 8.3l3.5.2L13 5.3z"/>',
  refresh: '<path d="M19 11a7 7 0 0 0-12.500-3.800L5 9"/><path d="M5 4.5V9h4.5"/><path d="M5 13a7 7 0 0 0 12.500 3.800L19 15"/><path d="M19 19.500V15h-4.500"/>',
  wa: '<path d="M12 3.8a8.200 8.200 0 0 0-7 12.400L3.800 20.200l4.100-1.100A8.200 8.200 0 1 0 12 3.800z"/><path d="M9 8.600c.3 2.600 2.300 5.100 5.700 6.200l1.400-1.500-2-1.200-1 .8c-.8-.3-1.700-1.200-2.100-2.100l.8-.9-1-2.200z"/>',
}
const art = {
  wp: '<circle cx="24" cy="24" r="21" fill="#21759b"/><circle cx="24" cy="24" r="17.8" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M13.5 17h4.4l3.700 11.600L24 21.200l-1.300-4.200h4.500l3.600 11.600 2.300-7.600c.3-1.100-.3-2-1.500-2h-1.400v-1.400h6.200v1.400h-1c-1.100 0-1.900.7-2.300 1.800l-3.600 11.600h-1.600L25.600 21l-3.300 9.400h-1.700z" fill="#fff" transform="translate(-2.4 2) scale(1.06)"/>',
  fb: '<circle cx="24" cy="24" r="21" fill="#1877f2"/><path d="M26.200 41V27.600h4.100l.7-4.800h-4.800v-3c0-1.400.6-2.500 2.500-2.500H31V13c-.5-.1-2-.2-3.700-.2-3.700 0-6.100 2.200-6.100 6.200v3.800H17v4.800h4.200V41z" fill="#fff"/>',
  g: '<path d="M43.600 20.500H42V20H24v8h11.300A12 12 0 1 1 24 12c3 0 5.800 1.100 7.900 3l5.700-5.700A20 20 0 1 0 44 24c0-1.200-.1-2.400-.4-3.500z" fill="#4285f4"/>',
  gcal: '<rect x="3" y="3" width="18" height="18" rx="3.500" fill="#fff" stroke="#4285f4" stroke-width="1.6"/><path d="M3 8.500h18" stroke="#4285f4" stroke-width="3.4"/><text x="12" y="18.200" text-anchor="middle" font-size="8" font-weight="700" fill="#4285f4" font-family="Poppins,sans-serif">31</text>',
}

const rootEl = ref(null)
const stageEl = ref(null)
const active = ref(0)
const paused = ref(false)
const inView = ref(false)
const revealed = ref(false)
const scale = ref(1)
const compact = ref(false)
const motion = ref(true)

let timer = null
let ro = null
let io = null
let touchX = 0

function goTo(i, restart = true) {
  active.value = (i + slides.length) % slides.length
  if (restart) startTimer()
}
const step = (d) => goTo(active.value + d)

function startTimer() {
  stopTimer()
  if (!motion.value) return
  timer = setInterval(() => {
    if (!paused.value && inView.value && !document.hidden) goTo(active.value + 1, false)
  }, AUTOPLAY_MS)
}
function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
}

function onKey(e) {
  if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
}
const onTouchStart = (e) => { touchX = e.changedTouches[0].clientX }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchX
  if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1)
}

function fit() {
  if (!stageEl.value) return
  const w = stageEl.value.clientWidth
  compact.value = w < 820 // phones/small tablets: show the CRM window only, so text stays readable
  scale.value = Math.min(1, +(w / (compact.value ? COMPACT_W : SCENE_W)).toFixed(3)) || 1
}

onMounted(() => {
  motion.value = !(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  fit()
  ro = new ResizeObserver(fit)
  ro.observe(stageEl.value)
  io = new IntersectionObserver(([en]) => {
    inView.value = en.isIntersecting
    if (en.isIntersecting) revealed.value = true
  }, { threshold: 0.25 })
  io.observe(rootEl.value)
  startTimer()
})
onBeforeUnmount(() => {
  stopTimer()
  ro && ro.disconnect()
  io && io.disconnect()
})
</script>

<style scoped>
.ig,
.ig * {
  box-sizing: border-box;
}
.ig {
  --o: #ff5722;
  --o-soft: #fff4ed;
  --navy: #0f172a;
  --ink: #475569;
  --mute: #94a3b8;
  --line: #f1f5f9;
  position: relative;
  /* boxed: a rounded card inset from the page edges */
  width: calc(100% - 2 * clamp(12px, 3vw, 40px));
  max-width: 1680px;
  margin: clamp(16px, 3vw, 40px) auto;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: clamp(22px, 2.6vw, 36px);
  box-shadow: 0 30px 60px -36px rgba(150, 70, 30, 0.35), 0 1px 0 #fff inset;
  overflow: hidden;
  isolation: isolate;
  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--navy);
  padding: clamp(28px, 4vw, 56px) 0 clamp(32px, 4vw, 52px);
  background:
    radial-gradient(900px 420px at 100% 0%, #fde3d9 0%, transparent 70%),
    radial-gradient(800px 500px at 0% 0%, #fce7e0 0%, transparent 65%),
    linear-gradient(180deg, #fdeee8 0%, #fbf3ef 55%, #fdf7f3 100%);
}
.ig::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(190, 120, 90, 0.13) 1px, transparent 1.2px);
  background-size: 26px 26px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 60%, #000 30%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 60%, #000 30%, transparent 85%);
  pointer-events: none;
}
.ig-wrap {
  position: relative;
  max-width: 1620px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 64px);
}

/* ============ header ============ */
.ig-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}
.ig-logo {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.07);
  margin-bottom: 14px;
}
.ig-logo svg { width: 21px; height: 21px; fill: none; stroke: var(--o); stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.ig-title {
  margin: 0;
  max-width: 560px;
  font-family: 'Inter Display', Inter, system-ui, sans-serif;
  font-size: 3.5vw;
  line-height: 1.15;
  font-weight: 500;
  letter-spacing: -0.02em;
}
.ig-title em { font-style: normal; color: var(--o); white-space: nowrap; }
.ig-hr { display: flex; flex-direction: column; align-items: flex-end; gap: 20px; padding-top: 26px; }
.ig-btn {
  display: inline-flex;
  align-items: center;
  height: 42px;
  padding: 0 22px;
  border: 1.5px solid var(--navy);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);
  color: var(--navy);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.25s, color 0.25s, transform 0.25s, box-shadow 0.25s;
}
.ig-btn:hover { background: var(--navy); color: #fff; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15, 23, 42, 0.18); }
.ig-btn:focus-visible, .ig-nav:focus-visible, .ig-tab:focus-visible { outline: 2px solid var(--o); outline-offset: 3px; }
.ig-sub { margin: 0; max-width: 480px; text-align: right; font-family: 'Inter Display', Inter, system-ui, sans-serif; font-size: 24px; font-weight: 600; line-height: 34px; letter-spacing: -0.72px; color: var(--ink); }

/* ============ tabs ============ */
.ig-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 34px auto 0;
}
.ig-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  color: var(--ink);
  font: 500 13.5px/1 'Poppins', system-ui, sans-serif;
  cursor: pointer;
  transition: background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.25s;
}
.ig-tab svg { width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.ig-tab:hover { background: #fff; color: var(--navy); }
.ig-tab.on { background: var(--navy); border-color: var(--navy); color: #fff; box-shadow: 0 10px 22px -8px rgba(15, 23, 42, 0.5); }

/* ============ stage ============ */
.ig-stage { position: relative; margin: 22px auto 0; max-width: 1240px; outline: none; }
.ig-view { position: relative; }
.ig-view:has(.compact) { margin-bottom: 4px; }
.ig-scene {
  position: absolute;
  left: 50%;
  top: 0;
  width: 1160px;
  height: 490px;
  transform-origin: 50% 0;
}
.sl {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease, visibility 0s linear 0.4s;
}
.sl.on { opacity: 1; visibility: visible; transition: opacity 0.5s ease 0.05s, visibility 0s; }

/* soft floor glow */
.sl::before {
  content: '';
  position: absolute;
  left: 4%; right: 4%; bottom: 22px; height: 40px;
  background: radial-gradient(closest-side, rgba(190, 90, 50, 0.2), transparent);
  filter: blur(10px);
}

/* entrances */
.card, .win, .toast, .link {
  opacity: 0;
  translate: 0 18px;
  transition: opacity 0.5s ease, translate 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.card { translate: -22px 0; }
.sl.on .card, .sl.on .win, .sl.on .toast, .sl.on .link {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(var(--d, 0) * 0.14s + 0.1s);
}
.sl.on .link { transition-delay: 0.45s; }
.sl.on .toast { animation: ig-bob 5.5s ease-in-out 1.2s infinite; }
@keyframes ig-bob { 50% { margin-top: -7px; } }

/* ---------- shared surfaces ---------- */
.card, .win, .toast {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 18px;
  box-shadow: 0 1px 0 #fff inset, 0 24px 40px -18px rgba(150, 70, 30, 0.35), 0 4px 10px rgba(150, 70, 30, 0.06);
}

/* left column: integration card + stats card */
.col {
  position: absolute;
  left: 0;
  top: 0;
  width: 310px;
  height: 458px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.src {
  flex: none;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.src-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.brand { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 15px; background: #f8fafc; border: 1px solid var(--line); }
.brand svg { width: 34px; height: 34px; }
.brand.ph { background: var(--o-soft); border-color: #ffe0cf; }
.brand.ph svg { fill: none; stroke: var(--o); stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.st { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px; font-size: 10px; font-weight: 600; letter-spacing: 0.04em; }
.st i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.st.ok { background: #e8f8ee; color: #15803d; }
.st.live { background: #e8f1ff; color: #1d4ed8; }
.src-n { font-size: 17px; font-weight: 600; line-height: 1.25; }
.src-s { font-size: 12.5px; color: var(--ink); line-height: 1.45; }
.metas { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.metas span { padding: 9px 10px; border-radius: 10px; background: #f8fafc; display: flex; flex-direction: column; gap: 2px; }
.metas small { font-size: 8.5px; letter-spacing: 0.06em; color: var(--mute); }
.metas b { font-size: 12px; font-weight: 600; }
.src-l { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; font-size: 13px; font-weight: 500; color: #1d4ed8; }
.src-l svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.toggle-row { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; font-size: 13px; font-weight: 500; }
.sw { position: relative; width: 40px; height: 22px; border-radius: 999px; background: var(--o); }
.sw::after { content: ''; position: absolute; top: 3px; right: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); }
.sl.on .sw { animation: ig-sw 3.5s ease-in-out 0.8s infinite; }
@keyframes ig-sw { 0%, 12% { background: #cbd5e1; } 22%, 100% { background: var(--o); } }
.sl.on .sw::after { animation: ig-swk 3.5s ease-in-out 0.8s infinite; }
@keyframes ig-swk { 0%, 12% { right: 21px; } 22%, 100% { right: 3px; } }
.note { display: flex; gap: 9px; margin-top: 10px; padding: 11px; border-radius: 12px; background: var(--o-soft); font-size: 11.5px; line-height: 1.45; color: var(--ink); }
.note svg { flex: none; width: 17px; height: 17px; margin-top: 1px; fill: none; stroke: var(--o); stroke-width: 1.9; stroke-linejoin: round; }
.note b { display: block; color: #c2410c; font-size: 12px; font-weight: 600; }
.metas.four { grid-template-columns: 1fr 1fr; }

/* stats card (fills the rest of the left column) */
.side {
  flex: 1;
  min-height: 0;
  padding: 14px 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}
.sd-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.sd-h b { font-size: 12.5px; font-weight: 600; }
.sd-tag { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; background: var(--o-soft); color: #c2410c; font-size: 9px; font-weight: 600; white-space: nowrap; }
.sd-tag i { width: 5px; height: 5px; border-radius: 50%; background: var(--o); }
.sl.on .sd-tag i { animation: ig-blink 1.6s ease-in-out infinite; }
@keyframes ig-blink { 50% { opacity: 0.3; } }
.spark { flex: 1; min-height: 28px; width: 100%; overflow: visible; }
.spark .sa { fill: url(#ig-spark); fill: rgba(255, 87, 34, 0.12); stroke: none; opacity: 0; transition: opacity 0.6s ease 1s; }
.spark .sln { fill: none; stroke: var(--o); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 100; stroke-dashoffset: 100; }
.sl.on .spark .sa { opacity: 1; }
.sl.on .spark .sln { animation: ig-draw 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s forwards; }
@keyframes ig-draw { to { stroke-dashoffset: 0; } }
.sd-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.sd-stats span { display: flex; flex-direction: column; gap: 1px; padding: 7px 8px; border-radius: 10px; background: #f8fafc; min-width: 0; }
.sd-stats b { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; }
.sd-stats small { font-size: 8.5px; color: var(--mute); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* connector */
.link { position: absolute; left: 306px; top: 120px; width: 110px; height: 40px; overflow: visible; }
.link path { fill: none; stroke: #ffb48c; stroke-width: 2; stroke-dasharray: 3 6; stroke-linecap: round; }
.link circle { fill: var(--o); filter: drop-shadow(0 0 5px rgba(255, 87, 34, 0.8)); }

/* CRM window */
.win {
  position: absolute;
  left: 406px;
  top: 0;
  width: 754px;
  height: 458px;
  padding: 14px;
  overflow: hidden;
  background: #fbfbfc;
}
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #ffab80;
  border-radius: 14px;
  background:
    radial-gradient(rgba(255, 87, 34, 0.1) 1px, transparent 1.2px) 0 0 / 8px 8px,
    #fff;
}
.hero small { display: block; font-size: 9px; font-weight: 600; letter-spacing: 0.08em; color: var(--o); }
.hero h3 { margin: 1px 0 2px; font-size: 21px; font-weight: 600; letter-spacing: -0.01em; }
.hero p { margin: 0; font-size: 11px; color: var(--ink); }
.hero.slim { padding: 12px 16px; }
.count { display: grid; place-items: center; width: 82px; height: 50px; border: 1px solid #ffab80; border-radius: 12px; background: #fff; text-align: center; line-height: 1; flex: none; }
.count b { font-size: 21px; font-weight: 600; }
.count small { font-size: 7.5px; margin-top: 3px; color: var(--ink); }
.ready { display: flex; align-items: center; gap: 9px; padding: 9px 12px; border: 1px solid #bbf0cf; border-radius: 12px; background: #effcf4; flex: none; }
.ready svg { width: 18px; height: 18px; fill: none; stroke: #15803d; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ready b { display: block; font-size: 11.5px; font-weight: 600; color: #15803d; }
.ready small { font-size: 9.5px; letter-spacing: 0; color: #4b7a5c; font-weight: 400; }

/* KPI strip */
.kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
.kpis span {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  opacity: 0;
  translate: 0 8px;
  transition: opacity 0.4s ease, translate 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sl.on .kpis span { opacity: 1; translate: 0 0; transition-delay: calc(0.45s + var(--k, 0) * 0.1s); }
.kpis b { font-size: 17px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.2; }
.kpis small { font-size: 9.5px; color: var(--mute); }
.kpis i { position: absolute; right: 10px; top: 10px; padding: 2px 7px; border-radius: 999px; background: #e8f8ee; color: #15803d; font-style: normal; font-size: 9px; font-weight: 700; }

.thead, .trow { display: grid; align-items: center; column-gap: 10px; grid-template-columns: 1.3fr 1.4fr 1.15fr 0.7fr; }
.thead.web, .trow.web { grid-template-columns: 1.25fr 1.5fr 1.15fr 0.7fr 0.6fr; }
.thead { margin: 12px 4px 2px; padding: 0 8px; font-size: 8.5px; letter-spacing: 0.06em; color: var(--mute); }
.trow {
  margin-top: 6px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  opacity: 0;
  translate: 0 10px;
  transition: opacity 0.4s ease, translate 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s;
}
.sl.on .trow { opacity: 1; translate: 0 0; transition-delay: calc(0.55s + var(--k, 0) * 0.12s); }
.trow.fresh { border-color: #ffd2b8; background: linear-gradient(90deg, #fff8f3, #fff); box-shadow: 0 8px 16px -10px rgba(255, 87, 34, 0.5); }
.sl.on .trow.fresh { animation: ig-fresh 3.2s ease-in-out 1.4s infinite; }
@keyframes ig-fresh { 0%, 100% { box-shadow: 0 8px 16px -10px rgba(255, 87, 34, 0.5); } 50% { box-shadow: 0 0 0 3px rgba(255, 87, 34, 0.14), 0 10px 18px -10px rgba(255, 87, 34, 0.6); } }
.who { display: flex; align-items: center; gap: 9px; min-width: 0; }
.who b { display: block; font-size: 12.5px; font-weight: 600; line-height: 1.2; white-space: nowrap; }
.who small { display: block; font-size: 10px; color: var(--mute); white-space: nowrap; }
.av { display: grid; place-items: center; flex: none; width: 30px; height: 30px; border-radius: 9px; background: var(--o); color: #fff; font: 600 10.5px/1 'Poppins', sans-serif; font-style: normal; }
.av.dk { border-radius: 50%; background: var(--navy); box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px var(--o); }
.ct { font-size: 11px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chip { display: inline-flex; align-items: center; gap: 5px; width: fit-content; padding: 5px 9px; border: 1px solid #e2e8f0; border-radius: 999px; font-size: 10px; font-weight: 500; color: var(--ink); white-space: nowrap; }
.chip svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
.chip.fb svg { stroke: none; }
.pend { width: fit-content; padding: 4px 9px; border-radius: 999px; background: #fff3d6; color: #b45309; font-size: 9px; font-weight: 700; letter-spacing: 0.05em; }
.pend.lead { background: #e8f8ee; color: #15803d; }
.pend.blue { background: #e3edff; color: #1d4ed8; }

.foot { margin: 10px 6px 0; font-size: 10.5px; color: var(--mute); }

/* pipeline */
.pipe { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); margin: 10px 0 0; padding: 14px 0 8px; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
.pipe::before { content: ''; position: absolute; left: 10%; right: 10%; top: 46px; border-top: 2px dashed #ffd2b8; }
.stage { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 11px; opacity: 0; translate: 0 8px; transition: opacity 0.4s, translate 0.5s; }
.sl.on .stage { opacity: 1; translate: 0 0; transition-delay: calc(0.5s + var(--k) * 0.1s); }
.stage small { font-size: 10.5px; color: var(--ink); }
.orb { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; font: 600 14px/1 'Poppins', sans-serif; font-style: normal; background: #ffd9c4; color: #7c2d12; box-shadow: 0 0 0 4px #fff, 0 0 0 5px #ffe4d4; }
.orb.a { background: linear-gradient(160deg, #ff8a4c, #ff5722); color: #fff; }
.orb.x { background: #cbd5e1; color: #475569; }
.stage em { font-style: normal; font-size: 8.5px; color: var(--mute); }
.stage em b { color: var(--navy); font-weight: 600; }
.sl.on .stage:nth-child(4) .orb { animation: ig-pulse 2.4s ease-out 1.2s infinite; }
@keyframes ig-pulse { 0% { box-shadow: 0 0 0 4px #fff, 0 0 0 5px #ffe4d4, 0 0 0 5px rgba(255, 87, 34, 0.5); } 100% { box-shadow: 0 0 0 4px #fff, 0 0 0 5px #ffe4d4, 0 0 0 18px rgba(255, 87, 34, 0); } }
.thead.two, .trow.two { grid-template-columns: 1.3fr 1.2fr 0.8fr 0.6fr; }

/* calls */
.pills { display: flex; gap: 6px; margin: 12px 2px 0; }
.pills span { padding: 5px 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 10.5px; font-weight: 500; color: var(--ink); }
.pills .on { background: var(--navy); border-color: var(--navy); color: #fff; }
.thead.calls, .trow.calls { grid-template-columns: 1.55fr 0.8fr 0.5fr 0.6fr 1.05fr; column-gap: 8px; }
.trow.calls { padding: 8px 10px; margin-top: 5px; }
.cp { width: fit-content; padding: 3px 9px; border-radius: 6px; font-size: 9.5px; font-weight: 600; }
.cp.Missed { background: #fee4e2; color: #b42318; }
.cp.Answered { background: #e8f8ee; color: #15803d; }
.cp.Outbound { background: #e3edff; color: #1d4ed8; }

/* calendar */
.cal-bar { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
.dbox { display: grid; place-items: center; width: 40px; height: 42px; border-radius: 10px; background: var(--o-soft); line-height: 1; }
.dbox small { font-size: 8px; font-weight: 600; color: var(--o); }
.dbox b { font-size: 17px; font-weight: 600; color: #c2410c; }
.cal-t { display: flex; flex-direction: column; flex: 1; }
.cal-t b { font-size: 15px; font-weight: 600; }
.cal-t small { font-size: 10.5px; color: var(--mute); }
.cal-act { display: flex; gap: 6px; }
.btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 11px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; font-style: normal; font-size: 10.5px; font-weight: 500; }
.btn svg { width: 12px; height: 12px; }
.btn.o { background: var(--o); border-color: var(--o); color: #fff; }
.btn.g { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.5); }
.sl.on .btn.g { animation: ig-gs 2.8s ease-out 1s infinite; }
@keyframes ig-gs { 0% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.45); } 70%, 100% { box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); } }
.day { position: relative; margin-top: 10px; height: 362px; padding: 4px 0; border: 1px solid var(--line); border-radius: 14px; background: #fff; overflow: hidden; }
.hr { height: 44px; border-top: 1px solid #f3f4f7; padding: 3px 0 0 10px; }
.hr:first-child { border-top: 0; }
.hr small { font-size: 9.5px; color: var(--mute); }
.now { position: absolute; left: 52px; right: 10px; top: 121px; border-top: 1.5px solid var(--o); }
.now i { position: absolute; left: -4px; top: -5px; width: 8px; height: 8px; border-radius: 50%; background: var(--o); }
.evt { position: absolute; left: 62px; width: 300px; padding: 7px 12px; border-radius: 10px; border-left: 4px solid var(--o); background: #fff1e9; opacity: 0; translate: 14px 0; transition: opacity 0.4s, translate 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sl.on .evt { opacity: 1; translate: 0 0; }
.evt b { display: block; font-size: 11.5px; font-weight: 600; color: #7c2d12; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.evt small { font-size: 9.5px; color: #9a5b3c; }
.e4 { top: 28px; height: 40px; width: 270px; transition-delay: 0.55s; }
.e2 { top: 92px; height: 40px; transition-delay: 0.65s; }
.e5 { left: 390px; top: 160px; height: 40px; width: 250px; background: #e8f0fe; border-left-color: #4285f4; transition-delay: 0.75s; }
.e5 b { color: #1a3f8a; }
.e5 small { color: #4a6aa8; }
.e1 { top: 248px; height: 52px; width: 340px; background: #e8f0fe; border-left-color: #4285f4; transition-delay: 0.85s; }
.e1 b { color: #1a3f8a; }
.e1 small { color: #4a6aa8; }
.e3 { top: 312px; height: 40px; width: 250px; transition-delay: 0.95s; }
.e6 { left: 430px; top: 272px; height: 40px; width: 250px; background: #e8f0fe; border-left-color: #4285f4; transition-delay: 1.05s; }
.e6 b { color: #1a3f8a; }
.e6 small { color: #4a6aa8; }
.mini-cal { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px 0; margin-top: 8px; padding: 7px 8px; border-radius: 12px; background: #f8fafc; font-size: 10px; text-align: center; color: var(--ink); }
.mini-cal .dw { font-weight: 600; color: var(--navy); }
.mini-cal span { display: grid; place-items: center; height: 17px; }
.mini-cal .today { width: 20px; margin: 0 auto; border-radius: 50%; background: var(--o); color: #fff; font-weight: 600; }
.mini-cal .ev { position: relative; }
.mini-cal .ev::after { content: ''; position: absolute; bottom: 0; width: 4px; height: 4px; border-radius: 50%; background: #4285f4; }

/* floating toasts: hang over the bottom-right edge of the CRM window */
.toast { position: absolute; z-index: 5; display: flex; align-items: center; gap: 11px; padding: 12px 15px; border-radius: 14px; font-size: 11px; }
.toast b { display: block; font-size: 12.5px; font-weight: 600; }
.toast small { display: block; font-size: 11px; color: var(--ink); }
.toast em { display: block; font-style: normal; font-size: 9.5px; color: var(--mute); margin-top: 1px; }
.tic { display: grid; place-items: center; flex: none; width: 34px; height: 34px; border-radius: 10px; background: var(--o-soft); }
.tic svg { width: 18px; height: 18px; fill: none; stroke: var(--o); stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.tic.g { background: #e8f8ee; }
.tic.g svg { stroke: #15803d; }
.tic.wa { background: #e6f9ee; }
.tic.wa svg { stroke: #16a34a; }
.t1 { left: 830px; top: 424px; width: 310px; }
.t2 { left: 880px; top: 428px; }
.t3 { left: 830px; top: 424px; width: 310px; }
.t4 { left: 880px; top: 430px; }

/* compact (phone) scene: CRM window only */
.compact { width: 700px; }
.compact .col, .compact .link { display: none; }
.compact .win { left: 0; width: 700px; }
.compact .rc { display: none; }
.compact .thead.web, .compact .trow.web { grid-template-columns: 1.3fr 1.4fr 1.15fr 0.7fr; }
.compact .thead.two, .compact .trow.two { grid-template-columns: 1.3fr 1.2fr 0.8fr; }
.compact .e5, .compact .e6 { left: 400px; width: 240px; }
.compact .t1, .compact .t3 { left: 380px; }
.compact .t2, .compact .t4 { left: 420px; }

/* ============ nav + dots ============ */
.ig-nav {
  position: absolute;
  top: 50%;
  z-index: 6;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
  cursor: pointer;
  translate: 0 -50%;
  transition: transform 0.2s, box-shadow 0.2s;
}
.ig-nav svg { width: 18px; height: 18px; fill: none; stroke: var(--navy); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.ig-nav:hover { transform: scale(1.08); box-shadow: 0 10px 22px rgba(15, 23, 42, 0.18); }
.ig-prev { left: -10px; }
.ig-next { right: -10px; }
.ig-dots { display: flex; justify-content: center; gap: 6px; margin-top: 18px; }
.ig-dot { width: 8px; height: 8px; border-radius: 8px; background: #cfcbd0; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s; }
.ig-dot.on { width: 28px; background: var(--o); }

/* reveal */
.ig-head, .ig-tabs, .ig-stage { opacity: 0; transform: translateY(16px); transition: opacity 0.7s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
.ig-tabs { transition-delay: 0.08s; }
.ig-stage { transition-delay: 0.16s; }
.ig-in .ig-head, .ig-in .ig-tabs, .ig-in .ig-stage { opacity: 1; transform: none; }

/* ============ responsive ============ */
@media (max-width: 860px) {
  .ig-head { flex-direction: column; gap: 14px; }
  .ig-hr { align-items: flex-start; padding-top: 0; flex-direction: column-reverse; gap: 16px; }
  .ig-sub { text-align: left; }
  .ig-tabs { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; margin-inline: calc(clamp(16px, 4vw, 64px) * -1); padding: 0 clamp(16px, 4vw, 64px) 4px; scrollbar-width: none; }
  .ig-tabs::-webkit-scrollbar { display: none; }
  .ig-tab { flex: none; }
  .ig-nav { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ig *, .ig *::before { animation: none !important; }
  .spark .sln { stroke-dashoffset: 0; }
  .card, .win, .toast, .link, .trow, .stage, .evt, .kpis span, .sl, .ig-head, .ig-tabs, .ig-stage { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>
