<template>
  <section id="clean-data" ref="root" class="cd" :class="{ in: seen, live }" aria-labelledby="cd-title">
    <h2 id="cd-title" class="title">
      <span>Clean, trustworthy</span>
      <span class="soft">customer data</span>
    </h2>
    <p class="lead">Clean data makes every other part of the CRM work better: reports are accurate, campaigns reach the right people and nobody calls the same customer twice.</p>

    <div class="grid">
      <!-- 1 · duplicates -->
      <article class="card c-dup" style="--i: 0">
        <header>
          <span class="ico"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" /></svg></span>
          <h3>Duplicate detection with smart merge suggestions</h3>
        </header>
        <div class="stage dup" :class="{ merged: dup === 'merged' }">
          <div class="pair">
            <div class="rec a">
              <b>Nimal Perera</b>
              <small>nimal@abcsolar.lk</small>
              <small>077 123 4567</small>
            </div>
            <div class="rec b">
              <b>N. Perera</b>
              <small>nimal@abcsolar.lk</small>
              <small>+94 77 123 4567</small>
            </div>
            <div class="rec one">
              <span class="tick">✓</span>
              <b>Nimal Perera</b>
              <small>nimal@abcsolar.lk</small>
              <small>+94 77 123 4567</small>
            </div>
          </div>
          <div class="dbar">
            <span class="match">
              <Transition name="fade" mode="out-in">
                <em v-if="dup === 'two'" key="m">92% match · same email and phone</em>
                <em v-else key="d" class="ok">Merged into one contact</em>
              </Transition>
            </span>
            <button type="button" class="btn" @click="toggleDup">{{ dup === 'two' ? 'Merge' : 'Undo merge' }}</button>
          </div>
        </div>
      </article>

      <!-- 2 · import / export -->
      <article class="card c-io" style="--i: 1">
        <header>
          <span class="ico"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 20h14" /></svg></span>
          <h3>Bulk import and export in CSV and Excel</h3>
        </header>
        <div class="stage io">
          <div class="seg" role="group" aria-label="Direction">
            <button type="button" :class="{ on: dir === 'import' }" @click="setDir('import')">Import</button>
            <button type="button" :class="{ on: dir === 'export' }" @click="setDir('export')">Export</button>
          </div>
          <div class="file">
            <span class="ext" :class="fmt">{{ fmt === 'csv' ? 'CSV' : 'XLSX' }}</span>
            <span class="fn">
              <b>{{ dir === 'import' ? 'customers' : 'contacts-export' }}.{{ fmt === 'csv' ? 'csv' : 'xlsx' }}</b>
              <small>{{ rows.toLocaleString('en-US') }} of 1,240 rows {{ dir === 'import' ? 'imported' : 'exported' }}</small>
            </span>
            <button type="button" class="fmt" :aria-label="`Switch file type, now ${fmt === 'csv' ? 'CSV' : 'Excel'}`" @click="toggleFmt">{{ fmt === 'csv' ? 'CSV' : 'Excel' }} ⇄</button>
          </div>
          <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="pct"><i :style="{ width: pct + '%' }"></i></div>
          <p class="done" :class="{ show: pct >= 100 }">✓ {{ dir === 'import' ? 'Import complete · 38 duplicates skipped' : 'Export ready to download' }}</p>
        </div>
      </article>

      <!-- 3 · tags & segments -->
      <article class="card c-seg" style="--i: 2">
        <header>
          <span class="ico"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.2" /></svg></span>
          <h3>Tags, segments and saved contact lists</h3>
        </header>
        <div class="stage seg-stage">
          <div class="chips" role="group" aria-label="Segments">
            <button v-for="s in segs" :key="s" type="button" class="chip" :class="{ on: seg === s }" @click="pickSeg(s)">{{ s }}</button>
          </div>
          <TransitionGroup name="row" tag="ul" class="list">
            <li v-for="c in shown" :key="c.name">
              <span class="av">{{ c.name.slice(0, 1) }}</span>
              <span class="nm"><b>{{ c.name }}</b><small>{{ c.tags.join(' · ') }}</small></span>
            </li>
          </TransitionGroup>
          <p class="saved"><span class="dot"></span>Saved list · <b>{{ seg }}</b> · {{ shown.length }} contacts</p>
        </div>
      </article>

      <!-- 4 · recycle bin & audit -->
      <article class="card c-bin" style="--i: 3">
        <header>
          <span class="ico"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16" /><path d="M9 7V4.5h6V7" /><path d="m6 7 1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></svg></span>
          <h3>A recycle bin with one-click restore and an audit log</h3>
        </header>
        <div class="stage bin">
          <div class="cols">
            <div>
              <p class="cap">Recycle bin</p>
              <TransitionGroup name="row" tag="ul" class="list">
                <li v-for="b in binItems" :key="b.name">
                  <span class="nm"><b>{{ b.name }}</b><small>{{ b.what }}</small></span>
                  <button type="button" class="btn sm" :aria-label="`Restore ${b.name}`" @click="restore(b.name)">Restore</button>
                </li>
              </TransitionGroup>
              <p v-if="!binItems.length" class="empty">Bin is empty</p>
            </div>
            <div>
              <p class="cap">Audit log</p>
              <TransitionGroup name="row" tag="ul" class="log">
                <li v-for="a in audit" :key="a.id">
                  <span class="t">{{ a.t }}</span>
                  <span class="tx"><b :class="a.kind">{{ a.verb }}</b> {{ a.name }}</span>
                </li>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </article>
    </div>

    <ul class="outs">
      <li><b>Accurate reports</b><small>One record per customer</small></li>
      <li><b>Right people</b><small>Campaigns reach the right segment</small></li>
      <li><b>No double calls</b><small>Duplicates are caught early</small></li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "CleanDataSection" });

/* ---------- 1 · duplicates ---------- */
const dup = ref("two");
const dupManual = ref(false);
function toggleDup() {
  dupManual.value = true;
  dup.value = dup.value === "two" ? "merged" : "two";
}

/* ---------- 2 · import / export ---------- */
const dir = ref("import");
const fmt = ref("xlsx");
const pct = ref(0);
const ioManual = ref(false);
const rows = computed(() => Math.round((pct.value / 100) * 1240));
function setDir(d) {
  ioManual.value = true;
  dir.value = d;
  pct.value = 0;
}
function toggleFmt() {
  ioManual.value = true;
  fmt.value = fmt.value === "csv" ? "xlsx" : "csv";
  pct.value = 0;
}

/* ---------- 3 · segments ---------- */
const segs = ["Hot leads", "Colombo", "Solar", "Newsletter"];
const people = [
  { name: "Nimal Perera", tags: ["Hot leads", "Solar"] },
  { name: "Ayesha Fernando", tags: ["Colombo", "Newsletter"] },
  { name: "Kasun Silva", tags: ["Solar", "Colombo"] },
  { name: "Dilini Jayasinghe", tags: ["Hot leads", "Newsletter"] },
  { name: "Ruwan Madushanka", tags: ["Solar", "Hot leads"] },
  { name: "Sachini Wickrama", tags: ["Colombo", "Newsletter"] },
];
const seg = ref("Hot leads");
const segManual = ref(false);
const shown = computed(() => people.filter((p) => p.tags.includes(seg.value)));
function pickSeg(s) {
  segManual.value = true;
  seg.value = s;
}

/* ---------- 4 · recycle bin + audit ---------- */
const trashPool = [
  { name: "Tharindu Bandara", what: "Contact" },
  { name: "Quote #1042", what: "Quotation" },
  { name: "Priya Nadarajah", what: "Contact" },
  { name: "Galle Hardware", what: "Company" },
];
const binItems = ref([{ name: "Quote #1038", what: "Quotation" }]);
const audit = ref([{ id: 1, t: "10:41", verb: "Deleted", kind: "del", name: "Quote #1038" }]);
const binManual = ref(false);
let auditId = 1;
let clock = 41;
let poolIx = 0;
function stamp() {
  clock += 1;
  return `10:${String(clock % 60).padStart(2, "0")}`;
}
function logIt(verb, kind, name) {
  auditId += 1;
  audit.value = [{ id: auditId, t: stamp(), verb, kind, name }, ...audit.value].slice(0, 4);
}
function remove() {
  const item = trashPool[poolIx % trashPool.length];
  poolIx += 1;
  if (binItems.value.some((b) => b.name === item.name)) return;
  binItems.value = [item, ...binItems.value].slice(0, 3);
  logIt("Deleted", "del", item.name);
}
function restore(name) {
  if (!binItems.value.some((b) => b.name === name)) return;
  binManual.value = true;
  binItems.value = binItems.value.filter((b) => b.name !== name);
  logIt("Restored", "res", name);
}

/* ---------- ticking demo ---------- */
let tick = 0;
function step() {
  tick += 1;
  // duplicates: two records for 3 ticks, merged for 3 ticks
  if (!dupManual.value) {
    if (tick % 6 === 1) dup.value = "two";
    if (tick % 6 === 4) dup.value = "merged";
  } else if (tick % 12 === 0) {
    dupManual.value = false;
  }
  // import/export progress, 8 ticks per run
  const phase = tick % 8;
  pct.value = phase === 0 ? 100 : Math.min(100, Math.round((phase / 6) * 100));
  if (phase === 1 && !ioManual.value && tick > 8) {
    dir.value = dir.value === "import" ? "export" : "import";
    fmt.value = fmt.value === "csv" ? "xlsx" : "csv";
  }
  // segments rotate every 3 ticks
  if (!segManual.value && tick % 3 === 0) {
    seg.value = segs[(segs.indexOf(seg.value) + 1) % segs.length];
  }
  // bin: delete, then restore, alternately
  if (!binManual.value && tick % 4 === 0) {
    if ((tick / 4) % 2 === 1) remove();
    else if (binItems.value.length) {
      const name = binItems.value[0].name;
      binItems.value = binItems.value.filter((b) => b.name !== name);
      logIt("Restored", "res", name);
    }
  }
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function start() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1100);
}
function stop() {
  live.value = false;
  if (st.timer !== null) {
    window.clearInterval(st.timer);
    st.timer = null;
  }
}

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window) || !root.value) {
    seen.value = true;
    pct.value = 100;
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) start();
      else stop();
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  st.io.observe(root.value);
  st.fallback = window.setTimeout(() => {
    if (!seen.value) seen.value = true;
  }, 2500);
});
onBeforeUnmount(() => {
  if (st.io) st.io.disconnect();
  window.clearTimeout(st.fallback);
  stop();
});
</script>

<style scoped>
.cd {
  --orange: #ff6338;
  --orange-soft: #fff1ec;
  --ink: #14120f;
  --muted: #6a6560;
  --line: #f1e7e2;
  --green: #1f9d63;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
}
.cd *, .cd *::before, .cd *::after { box-sizing: border-box; }
.cd button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em;
}
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { width: min(620px, calc(100% - 40px)); margin: 26px auto 0; text-align: center; font-size: 16px; line-height: 1.75; color: var(--muted); }

/* ---------- bento grid ---------- */
.grid {
  width: min(1180px, calc(100% - 40px)); margin: 56px auto 0;
  display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px;
}
.card {
  display: flex; flex-direction: column; gap: 20px; padding: 26px; border: 1px solid var(--line); border-radius: 28px; background: #fffaf7;
}
.c-dup { grid-column: span 7; }
.c-io { grid-column: span 5; }
.c-seg { grid-column: span 5; }
.c-bin { grid-column: span 7; }
.card header { display: flex; align-items: center; gap: 14px; }
.card h3 { margin: 0; font-size: 17px; font-weight: 500; line-height: 1.4; letter-spacing: -0.01em; }
.ico { flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: var(--orange-soft); color: var(--orange); }
.stage { flex: 1; padding: 18px; border: 1px solid var(--line); border-radius: 20px; background: #fff; }

.btn {
  padding: 8px 16px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; cursor: pointer;
  font: 500 12.5px "Poppins", system-ui, sans-serif; transition: background 0.25s, transform 0.2s;
}
.btn:hover { background: var(--orange); }
.btn:active { transform: scale(0.96); }
.btn.sm { padding: 6px 12px; font-size: 11.5px; background: var(--orange-soft); color: var(--orange); }
.btn.sm:hover { background: var(--orange); color: #fff; }

/* 1 · duplicates */
.dup { display: grid; gap: 16px; align-content: space-between; }
.pair { position: relative; height: 128px; }
.rec {
  position: absolute; top: 0; width: calc(50% - 10px); display: grid; gap: 2px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 16px; background: #fff;
  transition: transform 0.7s cubic-bezier(0.6, 0, 0.2, 1), opacity 0.5s;
}
.rec.a { left: 0; }
.rec.b { right: 0; }
.rec b { font-size: 14.5px; font-weight: 500; }
.rec small { font-size: 12px; color: var(--muted); }
.rec.b { border-color: rgba(255, 99, 56, 0.45); background: #fff8f5; }
.rec.one {
  left: 50%; width: calc(50% - 10px); transform: translateX(-50%) scale(0.92); opacity: 0; border-color: rgba(31, 157, 99, 0.45); background: #f4fbf7;
  transition: transform 0.6s cubic-bezier(0.3, 1.3, 0.5, 1) 0.25s, opacity 0.4s 0.25s;
}
.tick { position: absolute; top: 12px; right: 14px; display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: var(--green); color: #fff; font-size: 11px; }
.merged .rec.a { transform: translateX(calc(50% + 10px)); opacity: 0; }
.merged .rec.b { transform: translateX(calc(-50% - 10px)); opacity: 0; }
.merged .rec.one { transform: translateX(-50%); opacity: 1; }
.dbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 14px; border-top: 1px dashed var(--line); }
.match em { font-style: normal; font-size: 12.5px; font-weight: 500; color: var(--orange); }
.match em.ok { color: var(--green); }

/* 2 · import / export */
.io { display: grid; gap: 16px; align-content: start; }
.seg { display: flex; width: fit-content; padding: 3px; border-radius: 10px; background: #f5f1ee; }
.seg button { padding: 7px 14px; border: 0; border-radius: 8px; background: none; cursor: pointer; font: 500 12.5px "Poppins", system-ui, sans-serif; color: #8a857f; transition: background 0.25s, color 0.25s; }
.seg button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgba(20, 18, 15, 0.14); }
.file { display: flex; align-items: center; gap: 12px; }
.ext { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #e4f5ec; color: var(--green); transition: background 0.3s, color 0.3s; }
.ext.csv { background: var(--orange-soft); color: var(--orange); }
.fn { flex: 1; min-width: 0; }
.fn b { display: block; font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fn small { font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.fmt { padding: 6px 10px; border: 1px solid var(--line); border-radius: 99px; background: #fff; cursor: pointer; font: 500 11.5px "Poppins", system-ui, sans-serif; color: var(--ink); }
.fmt:hover { border-color: rgba(255, 99, 56, 0.5); }
.bar { height: 8px; border-radius: 99px; background: #f3ece8; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 99px; background: var(--orange); transition: width 0.9s linear; }
.done { margin: 0; font-size: 12.5px; font-weight: 500; color: var(--green); opacity: 0; transform: translateY(4px); transition: opacity 0.4s, transform 0.4s; }
.done.show { opacity: 1; transform: none; }

/* 3 · segments */
.seg-stage { display: grid; gap: 14px; align-content: start; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { padding: 6px 13px; border: 1px solid var(--line); border-radius: 99px; background: #fff; cursor: pointer; font: 500 12.5px "Poppins", system-ui, sans-serif; color: var(--muted); transition: background 0.25s, color 0.25s, border-color 0.25s; }
.chip:hover { border-color: rgba(255, 99, 56, 0.5); }
.chip.on { background: var(--orange); border-color: var(--orange); color: #fff; }
.list, .log { list-style: none; margin: 0; padding: 0; position: relative; }
.seg-stage .list { min-height: 148px; }
.list li { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f6efeb; }
.list li:last-child { border-bottom: 0; }
.av { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--orange-soft); color: var(--orange); font-size: 12px; font-weight: 600; }
.nm { flex: 1; min-width: 0; }
.nm b { display: block; font-size: 13.5px; font-weight: 500; }
.nm small { display: block; font-size: 11.5px; color: var(--muted); }
.saved { display: flex; align-items: center; gap: 8px; margin: 0; padding-top: 12px; border-top: 1px dashed var(--line); font-size: 12px; color: var(--muted); }
.saved b { color: var(--ink); font-weight: 500; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); }

/* 4 · bin */
.bin .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.cap { margin: 0 0 8px; font-size: 11.5px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.bin .list { min-height: 132px; }
.empty { margin: 0; padding: 14px 0; font-size: 12.5px; color: #a39d97; }
.log { min-height: 160px; }
.log li { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f6efeb; font-size: 12.5px; }
.log li:last-child { border-bottom: 0; }
.t { flex: none; font-variant-numeric: tabular-nums; color: #a39d97; }
.tx { min-width: 0; color: var(--muted); }
.tx b { font-weight: 500; }
.tx b.del { color: #c4452b; }
.tx b.res { color: var(--green); }

/* outcomes */
.outs { list-style: none; margin: 28px auto 0; padding: 0; width: min(1180px, calc(100% - 40px)); display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.outs li { display: grid; gap: 2px; padding: 18px 22px; border-left: 3px solid var(--orange); background: var(--orange-soft); border-radius: 0 16px 16px 0; }
.outs b { font-size: 15px; font-weight: 500; }
.outs small { font-size: 12.5px; color: var(--muted); }

/* list transitions */
.row-enter-active, .row-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.row-enter-from { opacity: 0; transform: translateY(-8px); }
.row-leave-to { opacity: 0; transform: translateX(14px); }
.row-leave-active { position: absolute; left: 0; right: 0; }
.row-move { transition: transform 0.4s ease; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* entrance (runs once) */
.cd:not(.in) .lead, .cd:not(.in) .card, .cd:not(.in) .outs { opacity: 0; }
.cd.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.cd.in .title .soft { animation-delay: 0.1s; }
.cd.in .lead { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.cd.in .card { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) calc(var(--i) * 0.12s + 0.25s) backwards; }
.cd.in .outs { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.8s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 960px) {
  .c-dup, .c-io, .c-seg, .c-bin { grid-column: 1 / -1; }
  .outs { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .cd { padding: 72px 0; }
  .card { padding: 18px; border-radius: 22px; }
  .bin .cols { grid-template-columns: 1fr; gap: 16px; }
  .log, .bin .list { min-height: 0; }
  .rec { padding: 12px; }
  .rec small { font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}
@media (prefers-reduced-motion: reduce) {
  .cd *, .cd *::before, .cd *::after { animation: none !important; transition: none !important; }
  .cd:not(.in) .lead, .cd:not(.in) .card, .cd:not(.in) .outs { opacity: 1; }
}
</style>
