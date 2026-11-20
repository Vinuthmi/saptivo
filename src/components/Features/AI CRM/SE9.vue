<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "AiDataEnrichmentSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref(false);
let io = null;
const timers = [];
let typing = null;
let reduce = false;

/* All companies, contacts and details are SAMPLE data. */
const EMAIL = "ravi@harbourhotel.lk";
const typed = ref("");
const filled = ref(false);
const fields = [
  { k: "Company", v: "Harbour Hotel Ltd" },
  { k: "Industry", v: "Hospitality" },
  { k: "Size", v: "120 employees" },
  { k: "City", v: "Galle" },
];

function enrich() {
  clearInterval(typing);
  typed.value = "";
  filled.value = false;
  if (reduce) {
    typed.value = EMAIL;
    filled.value = true;
    return;
  }
  let i = 0;
  typing = setInterval(() => {
    i += 1;
    typed.value = EMAIL.slice(0, i);
    if (i >= EMAIL.length) {
      clearInterval(typing);
      timers.push(setTimeout(() => (filled.value = true), 350));
    }
  }, 45);
}

/* duplicates */
const merged = ref(false);

/* data decay */
const reviewed = ref(false);

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    seen.value = true;
    enrich();
    merged.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      shown.value = true;
      seen.value = true;
      io.disconnect();
      timers.push(setTimeout(enrich, 500));
      timers.push(setTimeout(() => (merged.value = true), 3600));
    },
    { threshold: 0.3 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  if (io) io.disconnect();
  clearInterval(typing);
  timers.forEach(clearTimeout);
});
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">AI data</span> <span class="l2">enrichment</span></h2>
        <p class="sub">
          Saptivo fills in company details from an email domain, suggests duplicate merges and flags data decay such as bounced emails, keeping your database accurate without manual research.
        </p>
      </header>

      <div class="grid" :class="{ on: seen }">
        <!-- 1 enrich -->
        <article class="card c1">
          <div class="vis">
            <div class="mail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg><span>{{ typed }}<u v-if="!filled"></u></span></div>
            <div class="co" :class="{ on: filled }">
              <span class="logo">H</span>
              <ul>
                <li v-for="(f, k) in fields" :key="f.k" :style="{ '--d': k * 0.18 + 's' }">
                  <small>{{ f.k }}</small>
                  <b v-if="filled">{{ f.v }}</b>
                  <i v-else></i>
                </li>
              </ul>
            </div>
          </div>
          <h3>Details from a domain</h3>
          <button type="button" class="btn" @click="enrich">Run again</button>
        </article>

        <!-- 2 duplicates -->
        <article class="card c2">
          <div class="vis dup" :class="{ merged }">
            <div class="rec a"><span class="av">RP</span><div><b>Ravi Perera</b><small>ravi@harbourhotel.lk</small></div></div>
            <span class="flag"><i></i>Possible duplicate</span>
            <div class="rec b"><span class="av">RP</span><div><b>R. Perera</b><small>ravi.p@harbourhotel.lk</small></div></div>
            <div class="rec one"><span class="av">RP</span><div><b>Ravi Perera</b><small>2 emails · 1 record</small></div><em>✓ Merged</em></div>
          </div>
          <h3>Duplicate merges suggested</h3>
          <button type="button" class="btn" @click="merged = !merged">{{ merged ? "Undo" : "Merge" }}</button>
        </article>

        <!-- 3 decay -->
        <article class="card c3">
          <div class="vis dec">
            <div class="row"><span class="dot ok"></span><b>Nimal Fernando</b><small>Active</small></div>
            <div class="row bad" :class="{ done: reviewed }">
              <span class="dot"></span>
              <b>Kasun Silva</b>
              <small>{{ reviewed ? "Reviewed" : "Email bounced" }}</small>
            </div>
            <div class="row"><span class="dot ok"></span><b>Dilani Wickrama</b><small>Active</small></div>
          </div>
          <h3>Data decay flagged</h3>
          <button type="button" class="btn" :disabled="reviewed" @click="reviewed = true">
            {{ reviewed ? "✓ Sent to the owner" : "Send for review" }}
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hw {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1080px; margin: 0 auto; }
.head { text-align: center; max-width: 760px; margin: 0 auto 52px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 56ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.card { display: flex; flex-direction: column; gap: 18px; padding: 18px 18px 22px; border-radius: 32px; background: #faf9ff; border: 1.5px solid var(--line); opacity: .35; transform: translateY(16px); transition: all .8s cubic-bezier(.3, .8, .3, 1); }
.on .card { opacity: 1; transform: none; background: #fff; box-shadow: 0 22px 48px rgba(60, 50, 120, .1); }
.on .c2 { transition-delay: .12s; }
.on .c3 { transition-delay: .24s; }
.vis { flex: 1; min-height: 250px; border-radius: 24px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.c1 .vis { background: var(--lav); }
.c2 .vis { background: var(--mint); }
.c3 .vis { background: var(--butter); }
h3 { margin: 0 6px; font-size: 18px; font-weight: 600; letter-spacing: -.015em; }
.btn { align-self: flex-start; margin: -6px 6px 0; padding: 9px 20px; border: 1.5px solid var(--line); border-radius: 99px; background: #fff; font: inherit; font-size: 12.5px; font-weight: 600; color: var(--ink); cursor: pointer; transition: all .25s; }
.btn:hover:not(:disabled) { background: var(--ink); border-color: var(--ink); color: #fff; }
.btn:disabled { color: var(--mint-i); border-color: var(--mint); cursor: default; }
.btn:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 3px; }

/* 1 enrich */
.mail { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 99px; background: #fff; font-size: 13px; font-weight: 500; min-height: 42px; }
.mail svg { width: 16px; height: 16px; flex: none; color: var(--lav-i); }
.mail u { display: inline-block; width: 2px; height: 1em; margin-left: 1px; vertical-align: -2px; background: var(--lav-i); animation: caret 1s steps(1) infinite; }
@keyframes caret { 50% { opacity: 0; } }
.co { position: relative; flex: 1; padding: 16px 16px 14px; border-radius: 20px; background: #fff; }
.logo { position: absolute; right: 14px; top: 14px; width: 40px; height: 40px; border-radius: 14px; display: grid; place-items: center; background: var(--lav-i); color: #fff; font-size: 17px; font-weight: 700; transform: scale(.6); opacity: 0; transition: all .5s cubic-bezier(.3, 1.5, .5, 1); }
.co.on .logo { transform: none; opacity: 1; }
.co ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.co small { display: block; font-size: 10px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.co b { display: block; margin-top: 1px; font-size: 13.5px; animation: up .5s ease both; animation-delay: var(--d); }
.co i { display: block; width: 62%; height: 13px; margin-top: 3px; border-radius: 6px; background: linear-gradient(90deg, #efecf7 25%, #e3dff2 50%, #efecf7 75%); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; }
@keyframes shimmer { to { background-position: -200% 0; } }
@keyframes up { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

/* 2 duplicates */
.dup { position: relative; justify-content: center; }
.rec { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 20px; background: #fff; transition: transform .7s cubic-bezier(.3, .8, .3, 1), opacity .5s; }
.av { flex: none; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: var(--ink); color: #fff; font-size: 11px; font-weight: 700; }
.rec b { display: block; font-size: 13px; }
.rec small { font-size: 11px; color: var(--muted); }
.flag { align-self: center; display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 99px; background: var(--butter); color: var(--butter-i); font-size: 11px; font-weight: 700; transition: opacity .4s, transform .5s; }
.flag i { width: 8px; height: 8px; border-radius: 50%; background: var(--butter-i); }
.rec.one { position: absolute; left: 16px; right: 16px; top: 50%; margin-top: -30px; opacity: 0; transform: scale(.92); pointer-events: none; }
.rec.one em { margin-left: auto; font-style: normal; font-size: 12px; font-weight: 700; color: var(--mint-i); }
.dup.merged .a { transform: translateY(26px); opacity: 0; }
.dup.merged .b { transform: translateY(-26px); opacity: 0; }
.dup.merged .flag { opacity: 0; transform: scale(.8); }
.dup.merged .one { opacity: 1; transform: none; transition: all .6s cubic-bezier(.3, 1.4, .5, 1) .45s; }

/* 3 decay */
.dec { justify-content: center; }
.row { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 20px; background: #fff; transition: background .4s, box-shadow .4s; }
.row b { flex: 1; font-size: 13px; }
.row small { font-size: 11px; font-weight: 600; color: var(--muted); }
.dot { flex: none; width: 10px; height: 10px; border-radius: 50%; background: var(--rose-i); }
.dot.ok { background: var(--mint-i); }
.row.bad { box-shadow: 0 0 0 2px var(--rose-i); background: #fff6f8; }
.row.bad small { color: var(--rose-i); }
.row.bad .dot { animation: ping 1.6s ease infinite; }
.row.bad.done { box-shadow: 0 0 0 2px var(--mint-i); background: #f7fcf9; }
.row.bad.done small { color: var(--mint-i); }
.row.bad.done .dot { background: var(--mint-i); animation: none; }
@keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(216, 86, 127, .5); } 80%, 100% { box-shadow: 0 0 0 9px rgba(216, 86, 127, 0); } }

.note { margin: 28px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 900px) {
  .grid { grid-template-columns: minmax(0, 1fr); max-width: 460px; margin: 0 auto; }
  .vis { min-height: 220px; }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .mail u, .co i, .co b, .row.bad .dot { animation: none; }
  * { transition-duration: 0s !important; }
}
</style>
