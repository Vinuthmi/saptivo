<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "CampaignBuilderSection" });

const base = "/saptivo/images/features/";
const sidePhoto = base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg";
const heroPhoto = base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg";
const ok = ref([true, true]);

// merge-field text lives in script so the template never holds a literal double brace
const rawName = "{{first_name}}";
const rawUrl = "{{quote_url}}";
const rawSlot = "{{1}}";
const merges = ["{{first_name}}", "{{company}}", "{{last_order}}"];

const blocks = [
  { n: "Text", d: "M5 6h14M12 6v13M9 19h6" },
  { n: "Image", d: "M4 5h16v14H4ZM4 16l5-5 4 4 3-3 4 4" },
  { n: "Button", d: "M3 8h18v8H3ZM8 12h8" },
  { n: "Divider", d: "M4 12h16" },
];
const variants = [
  { k: "A", s: "Your service plan is ready", pct: 52, rate: "24.1%" },
  { k: "B", s: "Nimal, your service plan is ready", pct: 68, rate: "31.6%", win: true },
];

const root = ref(null);
const seen = ref(false);
const mode = ref("dd");
const drag = ref(0);
const btn = ref(false);
const mf = ref(0);
const ab = ref(0);
const wa = ref(0);
const st = { beat: 0, timer: null, io: null };
const LEN = 20;

function reset() {
  mode.value = "dd";
  drag.value = 0;
  btn.value = false;
  mf.value = 0;
  ab.value = 0;
  wa.value = 0;
}
function tick() {
  const b = st.beat;
  if (b === 0) reset();
  if (b === 1) drag.value = 1;
  if (b === 2) drag.value = 2;
  if (b === 3) {
    drag.value = 0;
    btn.value = true;
  }
  if (b === 5) mf.value = 1;
  if (b === 6) mf.value = 2;
  if (b === 8) mode.value = "html";
  if (b === 11) mode.value = "dd";
  if (b === 12) ab.value = 1;
  if (b === 14) ab.value = 2;
  if (b === 15) wa.value = 1;
  if (b === 17) wa.value = 2;
  st.beat = (b + 1) % LEN;
}
function start() {
  seen.value = true;
  if (st.timer === null) st.timer = window.setInterval(tick, 1200);
}
function stop() {
  if (st.timer !== null) {
    window.clearInterval(st.timer);
    st.timer = null;
  }
}

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    seen.value = true;
    for (let k = 0; k < 19; k++) tick();
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) start();
      else stop();
    },
    { threshold: 0.15 }
  );
  st.io.observe(root.value);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  stop();
});
</script>

<template>
  <section ref="root" class="cb" :class="{ in: seen }">
    <div class="wrap">
      <!-- copy -->
      <div class="copy">
        <h2><span class="l1">Campaign</span> <span class="l2">builder</span></h2>
        <p class="lead">
          Design emails with a drag-and-drop or HTML editor, personalise them with merge fields, and test subject lines
          and content with A/B testing. WhatsApp template campaigns reach customers on the channel they read most.
        </p>
        <figure class="side">
          <img v-if="ok[0]" :src="sidePhoto" alt="" loading="lazy" @error="ok[0] = false" />
        </figure>
      </div>

      <!-- visual -->
      <div class="visual">
        <article class="win" aria-label="Email editor">
          <div class="bar">
            <span class="name">Service reminder · Email</span>
            <span class="tabs">
              <span class="tab" :class="{ on: mode === 'dd' }">Drag and drop</span>
              <span class="tab" :class="{ on: mode === 'html' }">HTML</span>
            </span>
          </div>

          <div class="body">
            <aside class="pal">
              <small>Blocks</small>
              <span v-for="b in blocks" :key="b.n" class="blk" :class="{ pick: b.n === 'Button' && drag > 0 }">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="b.d" /></svg>{{ b.n }}
              </span>
              <small class="mt">Merge fields</small>
              <span v-for="(m, i) in merges" :key="m" class="mrg" :class="{ on: mf >= 1 && i === 0 }">{{ m }}</span>
            </aside>

            <div class="stagec">
              <div v-if="mode === 'dd'" class="mail">
                <div class="hero">
                  <img v-if="ok[1]" :src="heroPhoto" alt="" loading="lazy" @error="ok[1] = false" />
                  <span class="logo">Ceylon Service Co.</span>
                </div>
                <h4>Hi <span class="m" :class="{ on: mf >= 1, res: mf >= 2 }">{{ mf >= 2 ? "Nimal" : rawName }}</span>,</h4>
                <p>Your fleet service plan is ready for review. Everything is in the quotation below.</p>
                <div class="slot" :class="{ over: drag === 2, filled: btn }">
                  <span class="cta" :class="{ shown: btn }">View my quotation</span>
                  <em v-if="!btn">Drop a block here</em>
                </div>
                <small class="foot">Unsubscribe · Saptivo</small>
              </div>

              <pre v-else class="code" aria-label="HTML source"><code><span class="c1">&lt;h1&gt;</span>Hi <span class="c2">{{ rawName }}</span>,<span class="c1">&lt;/h1&gt;</span>
<span class="c1">&lt;p&gt;</span>Your fleet service plan
is ready for review.<span class="c1">&lt;/p&gt;</span>
<span class="c1">&lt;a</span> <span class="c3">href</span>=<span class="c4">"{{ rawUrl }}"</span><span class="c1">&gt;</span>
  View my quotation
<span class="c1">&lt;/a&gt;</span></code></pre>

              <div class="ghost" :class="'d' + drag" aria-hidden="true">
                <span class="gb">Button</span>
                <svg class="curs" viewBox="0 0 24 24" width="22" height="22" fill="#14120f" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"><path d="M5 3l14 8-6 2-3 6Z" /></svg>
              </div>
            </div>
          </div>
        </article>

        <div class="duo">
          <article class="card ab" aria-label="A/B test">
            <div class="ch"><span class="badge">A/B test</span><small>Subject line · 50 / 50 split</small></div>
            <div v-for="v in variants" :key="v.k" class="vr" :class="{ win: ab >= 2 && v.win }">
              <div class="vh"><b>{{ v.k }}</b><span>{{ v.s }}</span><em v-if="ab >= 2 && v.win">Winner</em></div>
              <div class="track"><i :style="{ width: (ab >= 1 ? v.pct : 0) + '%' }"></i></div>
              <small class="mono">{{ ab >= 1 ? v.rate : "—" }} opened</small>
            </div>
          </article>

          <article class="card wa" aria-label="WhatsApp template">
            <div class="ch"><span class="badge g">WhatsApp</span><small>Template campaign</small></div>
            <div class="chat">
              <div class="bubble" :class="{ show: wa >= 1 }">
                <p>Hi <b>{{ mf >= 2 ? "Nimal" : rawSlot }}</b>, your fleet service is due on <b>14 Nov</b>. Reply YES to book a slot.</p>
                <span class="tm">10:24</span>
              </div>
              <div class="qr" :class="{ show: wa >= 2 }"><span>Yes, book it</span><span>Later</span></div>
            </div>
            <span class="appr" :class="{ show: wa >= 2 }">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
              Template approved
            </span>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cb {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.cb *, .cb *::before, .cb *::after { box-sizing: border-box; }
.mono { font-variant-numeric: tabular-nums; }
.wrap { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.3fr); gap: 56px; align-items: start; }

/* copy */
h2 { margin: 0 0 20px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; }
h2 span { display: block; }
.cb h2 .l1 { color: #111111 !important; opacity: 1; }
.cb h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.lead { margin: 0 0 28px; font-size: 16px; line-height: 1.75; color: var(--muted); }
.side { margin: 0; height: 340px; border-radius: 26px; overflow: hidden; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); }
.side img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }

/* editor */
.visual { display: grid; gap: 18px; min-width: 0; }
.win { border-radius: 26px; background: var(--lav); padding: 10px; min-width: 0; }
.bar { display: flex; align-items: center; gap: 10px; padding: 8px 12px 12px; }
.name { font-size: 12.5px; font-weight: 600; color: var(--lav-i); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tabs { margin-left: auto; display: inline-flex; padding: 3px; border-radius: 99px; background: #fff; }
.tab { padding: 6px 13px; border-radius: 99px; font-size: 12px; font-weight: 500; color: var(--muted); white-space: nowrap; transition: background .3s, color .3s; }
.tab.on { background: var(--ink); color: #fff; }

.body { display: grid; grid-template-columns: 148px minmax(0, 1fr); gap: 10px; }
.pal { display: grid; align-content: start; gap: 6px; padding: 12px; border-radius: 18px; background: #fff; }
.pal small { margin-bottom: 2px; color: var(--muted); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
.pal .mt { margin-top: 10px; }
.blk { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 10px; background: #f6f4fd; color: #4b3f87; font-size: 12.5px; font-weight: 500; transition: background .3s, box-shadow .3s; }
.blk.pick { background: var(--butter); box-shadow: inset 0 0 0 1.5px var(--butter-i); }
.mrg { padding: 6px 10px; border-radius: 8px; background: #f1f2f4; color: var(--muted); font-size: 11.5px; font-weight: 500; font-family: ui-monospace, Menlo, monospace; transition: background .3s, color .3s; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mrg.on { background: var(--ink); color: #fff; }

.stagec { position: relative; min-width: 0; border-radius: 18px; background: #e6e1f4; padding: 16px; overflow: hidden; min-height: 440px; }
.mail { max-width: 400px; margin: 0 auto; border-radius: 14px; background: #fff; overflow: hidden; }
.hero { position: relative; height: 150px; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); overflow: hidden; }
.hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.logo { position: absolute; left: 14px; top: 12px; padding: 4px 10px; border-radius: 99px; background: #fff; font-size: 11px; font-weight: 600; }
.mail h4 { margin: 16px 18px 6px; font-size: 18px; font-weight: 600; letter-spacing: -.02em; }
.m { padding: 1px 6px; border-radius: 6px; transition: background .3s, color .3s; }
.m.on { background: var(--lav); color: var(--lav-i); font-family: ui-monospace, Menlo, monospace; font-size: 14px; }
.m.res { background: transparent; color: inherit; font-family: inherit; font-size: inherit; padding: 0; }
.mail p { margin: 0 18px 14px; font-size: 13px; line-height: 1.6; color: var(--muted); }
.slot { position: relative; display: grid; place-items: center; height: 62px; margin: 0 18px 14px; border-radius: 12px; border: 1.5px dashed #cfc7ea; transition: border-color .3s, background .3s; }
.slot em { font-size: 12px; font-style: normal; color: #9a8fc0; }
.slot.over { border-color: var(--butter-i); background: var(--butter); }
.slot.filled { border-color: transparent; }
.cta { position: absolute; padding: 12px 22px; border-radius: 99px; background: var(--ink); color: #fff; font-size: 13px; font-weight: 600; opacity: 0; transform: scale(.92); transition: opacity .35s, transform .4s ease; }
.cta.shown { opacity: 1; transform: none; }
.foot { display: block; padding: 10px 18px 14px; border-top: 1px solid #f1eef8; font-size: 10.5px; color: #a8a2b4; }

.code { margin: 0; padding: 18px; border-radius: 14px; background: #1b1830; color: #e8e4ff; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; line-height: 1.8; overflow: hidden; min-height: 408px; }
.code .c1 { color: #8fb4ff; } .code .c2 { color: #ffb380; } .code .c3 { color: #c9a8ff; } .code .c4 { color: #8fe3b5; }

.ghost { position: absolute; left: -30px; top: 40%; opacity: 0; display: flex; align-items: flex-start; pointer-events: none; transition: left .9s cubic-bezier(.4, 0, .2, 1), top .9s cubic-bezier(.4, 0, .2, 1), opacity .3s; }
.ghost.d1 { opacity: 1; left: 12px; top: 38%; }
.ghost.d2 { opacity: 1; left: 42%; top: 74%; }
.gb { padding: 8px 14px; border-radius: 10px; background: var(--butter); border: 1.5px solid var(--butter-i); font-size: 12px; font-weight: 600; }
.curs { margin: 10px 0 0 -6px; }

/* cards */
.duo { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 18px; }
.card { border-radius: 24px; padding: 20px; display: grid; gap: 12px; align-content: start; }
.ab { background: var(--butter); }
.wa { background: var(--mint); }
.ch { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.ch small { color: var(--muted); font-size: 11.5px; text-align: right; }
.badge { padding: 5px 12px; border-radius: 99px; background: #fff; color: var(--butter-i); font-size: 12px; font-weight: 600; white-space: nowrap; }
.badge.g { color: var(--mint-i); }
.vr { display: grid; gap: 7px; padding: 12px 14px; border-radius: 16px; background: #fff; transition: box-shadow .4s; }
.vr.win { box-shadow: inset 0 0 0 1.5px var(--mint-i); }
.vh { display: flex; align-items: center; gap: 10px; font-size: 12.5px; }
.vh b { display: grid; place-items: center; flex: none; width: 24px; height: 24px; border-radius: 8px; background: var(--butter); color: var(--butter-i); font-size: 12px; }
.vh span { flex: 1; min-width: 0; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vh em { flex: none; padding: 2px 9px; border-radius: 6px; background: var(--mint); color: var(--mint-i); font-size: 10.5px; font-style: normal; font-weight: 600; }
.track { height: 6px; border-radius: 4px; background: #f5efdc; overflow: hidden; }
.track i { display: block; height: 100%; border-radius: 4px; background: #d8b13a; transition: width 1s cubic-bezier(.2, .8, .2, 1); }
.vr.win .track i { background: var(--mint-i); }
.vr small { color: var(--muted); font-size: 11.5px; }

.chat { display: grid; gap: 8px; padding: 14px; border-radius: 16px; background: #efeae2; min-height: 156px; align-content: start; }
.bubble { max-width: 92%; padding: 10px 12px 6px; border-radius: 4px 14px 14px 14px; background: #fff; font-size: 12.5px; line-height: 1.5; opacity: 0; transform: translateY(8px); transition: opacity .4s, transform .45s ease; }
.bubble.show { opacity: 1; transform: none; }
.bubble p { margin: 0; }
.tm { display: block; text-align: right; font-size: 10px; color: #7a8a80; }
.qr { display: flex; gap: 6px; opacity: 0; transform: translateY(6px); transition: opacity .4s, transform .4s; }
.qr.show { opacity: 1; transform: none; }
.qr span { flex: 1; padding: 8px; border-radius: 12px; background: #fff; color: var(--mint-i); font-size: 12px; font-weight: 600; text-align: center; }
.appr { display: inline-flex; align-items: center; gap: 6px; justify-self: start; padding: 6px 12px; border-radius: 99px; background: #fff; color: var(--mint-i); font-size: 11.5px; font-weight: 600; opacity: 0; transition: opacity .4s; }
.appr.show { opacity: 1; }

/* entrance */
.cb:not(.in) .wrap { opacity: 0; transform: translateY(14px); }
.cb .wrap { transition: opacity .7s ease, transform .7s ease; }

@media (max-width: 1020px) {
  .wrap { grid-template-columns: minmax(0, 1fr); gap: 40px; max-width: 720px; }
  .side { height: 300px; }
}
@media (max-width: 640px) {
  .cb { padding: 64px 16px; }
  .body { grid-template-columns: minmax(0, 1fr); }
  .pal { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pal small { grid-column: 1 / -1; }
  .stagec { min-height: 0; }
  .ghost { display: none; }
  .duo { grid-template-columns: minmax(0, 1fr); }
  .name { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .cb *, .cb *::before, .cb *::after { transition: none !important; }
  .cb:not(.in) .wrap { opacity: 1; transform: none; }
}
</style>
