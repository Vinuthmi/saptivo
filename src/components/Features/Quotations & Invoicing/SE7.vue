<template>
  <section id="documents" ref="root" class="dc" :class="{ in: seen, live }" aria-labelledby="dc-title">
    <h2 id="dc-title" class="title">
      <span>Documents on</span>
      <span class="soft">the right record</span>
    </h2>
    <p class="lead">Proposals, contracts and signed agreements are stored on the contact, account or deal they belong to, with templates, version control, folder search and per-document permissions. <b>Esignature integration is available for faster approvals.</b></p>

    <div class="panel">
      <!-- photo header with the record switcher -->
      <div class="photo">
        <template v-for="(src, i) in photos" :key="src">
          <img v-if="ok[i]" :src="src" alt="" loading="lazy" :class="{ on: i === photoIdx }" @error="ok[i] = false" />
        </template>
        <span class="glass">
          <i :class="{ done: cur && cur.sign === 3 }"></i>
          <span v-if="cur"><b>{{ cur.name }}</b><small>{{ signLabel }}</small></span>
          <span v-else><b>No document selected</b></span>
        </span>
        <div class="recs" role="group" aria-label="Record">
          <button v-for="r in records" :key="r.key" type="button" :class="{ on: record === r.key }" :aria-pressed="record === r.key" @click="pickRecord(r.key)">
            <small>{{ r.key }}</small><b>{{ r.name }}</b>
          </button>
        </div>
      </div>

      <div class="body">
        <!-- left: list -->
        <div class="left">
          <label class="search">
            <span class="sr">Search documents and folders</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>
            <input type="search" :value="query" placeholder="Search documents and folders" @input="setQuery($event.target.value)" />
          </label>

          <TransitionGroup name="doc" tag="ul" class="docs">
            <li v-for="d in shown" :key="d.id">
              <button type="button" class="doc" :class="[d.tone, { sel: cur && d.id === cur.id }]" :aria-pressed="cur && d.id === cur.id" @click="pick(d)">
                <span class="ext">{{ d.ext }}</span>
                <span class="dn"><b>{{ d.name }}</b><small>{{ d.folder }} · v{{ d.versions.length }}</small></span>
                <span class="st" :class="'s' + d.sign">{{ ['Draft', 'Sent', 'Viewed', 'Signed'][d.sign] }}</span>
              </button>
            </li>
          </TransitionGroup>
          <p v-if="!shown.length" class="empty">No documents match "{{ query }}"</p>

          <div class="tpl">
            <span class="cap">New from template</span>
            <button v-for="t in templates" :key="t" type="button" @click="addFromTemplate(t, true)"><span class="plus" aria-hidden="true"></span>{{ t }}</button>
          </div>
        </div>

        <!-- right: detail -->
        <div v-if="cur" :key="cur.id" class="detail" :class="cur.tone">
          <p class="crumb">{{ record }} · {{ recName }} <span>›</span> {{ cur.folder }}</p>
          <h3>{{ cur.name }}</h3>

          <p class="cap">Version control</p>
          <ol class="vers">
            <li v-for="(v, i) in cur.versions" :key="v.v" :class="{ now: i === 0 }">
              <b>v{{ v.v }}</b><span>{{ v.note }}</span><small>{{ v.by }} · {{ v.date }}</small>
            </li>
          </ol>

          <p class="cap">Who can open it</p>
          <ul class="perm" role="group" aria-label="Document permissions">
            <li v-for="p in roles" :key="p">
              <button type="button" :class="{ on: cur.perm[p] }" :aria-pressed="cur.perm[p]" @click="togglePerm(p)">{{ p }}<i></i></button>
            </li>
          </ul>

          <p class="cap">E-signature</p>
          <ol class="sig" aria-label="Signature progress">
            <li v-for="(s, i) in ['Draft', 'Sent', 'Viewed', 'Signed']" :key="s" :class="{ on: cur.sign >= i }"><span></span>{{ s }}</li>
          </ol>
          <button type="button" class="send" :disabled="cur.sign > 0" @click="sendSign">
            {{ cur.sign === 0 ? 'Send for e-signature' : cur.sign < 3 ? 'Waiting for the customer…' : '✓ Signed and stored on this record' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "DocumentsSection" });

// Photos live in public/images/features/ (file names are case sensitive).
// A missing file just shows the pastel gradient.
const base = "/saptivo/images/features/";
const photos = [
  base + "young-man-works-at-laptop-in-bright-setting-2026-09-24-04-42-17-utc (1).jpg",
  base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
];
const ok = ref(photos.map(() => true));

const records = [
  { key: "Contact", name: "Nimal Perera" },
  { key: "Account", name: "ABC Solar" },
  { key: "Deal", name: "Solar installation" },
];
const roles = ["Sales", "Managers", "Operations", "Customer portal"];
const templates = ["Proposal", "Contract", "NDA"];

const mk = (id, record, name, ext, folder, tone, sign, versions, perm) => ({
  id, record, name, ext, folder, tone, sign, versions,
  perm: Object.fromEntries(roles.map((r) => [r, perm.includes(r)])),
});
const seed = () => [
  mk(1, "Deal", "Proposal – 5 kW system", "PDF", "Proposals", "lav", 3,
    [{ v: 3, by: "Ishara", date: "4 Nov", note: "Final pricing" }, { v: 2, by: "Ishara", date: "29 Oct", note: "Added battery option" }, { v: 1, by: "Chathura", date: "22 Oct", note: "First draft" }],
    ["Sales", "Managers", "Customer portal"]),
  mk(2, "Deal", "Installation contract", "DOCX", "Contracts", "sky", 0,
    [{ v: 2, by: "Ishara", date: "5 Nov", note: "Payment terms updated" }, { v: 1, by: "Ishara", date: "3 Nov", note: "From contract template" }],
    ["Sales", "Managers"]),
  mk(3, "Account", "Master service agreement", "PDF", "Agreements", "mint", 3,
    [{ v: 1, by: "Kasun", date: "12 Sep", note: "Signed by both parties" }],
    ["Managers", "Operations"]),
  mk(4, "Account", "Mutual NDA", "PDF", "Agreements", "butter", 3,
    [{ v: 1, by: "Kasun", date: "2 Sep", note: "Signed" }],
    ["Sales", "Managers"]),
  mk(5, "Contact", "Site visit notes", "DOCX", "Notes", "rose", 0,
    [{ v: 1, by: "Chathura", date: "30 Oct", note: "After the site visit" }],
    ["Sales"]),
];
const docs = reactive(seed());

const record = ref("Deal");
const query = ref("");
const selId = ref(1);
const manual = ref(false);

const recName = computed(() => records.find((r) => r.key === record.value).name);
const shown = computed(() => {
  const q = query.value.trim().toLowerCase();
  return docs.filter((d) => d.record === record.value && (!q || (d.name + " " + d.folder).toLowerCase().includes(q)));
});
const cur = computed(() => docs.find((d) => d.id === selId.value && d.record === record.value) || shown.value[0] || null);
const signLabel = computed(() => (cur.value ? ["Draft · not sent", "Sent for signature", "Opened by the customer", "Signed and stored"][cur.value.sign] : ""));
const photoIdx = computed(() => (records.findIndex((r) => r.key === record.value) % 2 === 0 ? 0 : 1));

function pick(d) { manual.value = true; selId.value = d.id; }
function pickRecord(k) {
  manual.value = true;
  record.value = k;
  query.value = "";
  const first = docs.find((d) => d.record === k);
  if (first) selId.value = first.id;
}
function setQuery(v) { manual.value = true; query.value = v; }
function togglePerm(p) { manual.value = true; if (cur.value) cur.value.perm[p] = !cur.value.perm[p]; }
function sendSign() { manual.value = true; if (cur.value && cur.value.sign === 0) cur.value.sign = 1; }
let nextId = 100;
function addFromTemplate(t, byUser) {
  if (byUser) manual.value = true;
  nextId += 1;
  docs.push(mk(nextId, record.value, "New " + t.toLowerCase(), t === "NDA" ? "PDF" : "DOCX", t === "Proposal" ? "Proposals" : t === "Contract" ? "Contracts" : "Agreements",
    t === "Proposal" ? "lav" : t === "Contract" ? "sky" : "butter", 0,
    [{ v: 1, by: "You", date: "Today", note: "From " + t.toLowerCase() + " template" }], ["Sales", "Managers"]));
  query.value = "";
  selId.value = nextId;
}

/* demo loop: 13 steps */
let tick = 0;
function step() {
  if (manual.value) return;
  const p = tick % 13;
  tick += 1;
  const sel = (id) => { selId.value = id; };
  if (p === 0) { docs.splice(0, docs.length, ...seed()); record.value = "Deal"; query.value = ""; sel(1); }
  if (p === 1) sel(2);
  if (p === 2) query.value = "contract";
  if (p === 3) { query.value = ""; const d = docs.find((x) => x.id === 2); if (d) d.sign = 1; }
  if (p === 4) { const d = docs.find((x) => x.id === 2); if (d) d.sign = 2; }
  if (p === 5) { const d = docs.find((x) => x.id === 2); if (d) d.sign = 3; }
  if (p === 6) { record.value = "Account"; sel(3); }
  if (p === 7) { const d = docs.find((x) => x.id === 3); if (d) d.perm["Customer portal"] = true; }
  if (p === 8) { record.value = "Contact"; sel(5); }
  if (p === 9) addFromTemplate("NDA", false);
  if (p === 10) { const d = docs.find((x) => x.id === nextId); if (d) d.sign = 1; }
}

const root = ref(null);
const seen = ref(false);
const live = ref(false);
const st = { timer: null, io: null, fallback: null };

function begin() {
  seen.value = true;
  live.value = true;
  if (st.timer === null) st.timer = window.setInterval(step, 1700);
}
function halt() {
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
    return;
  }
  st.io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (e && e.isIntersecting) begin();
      else halt();
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
  halt();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.dc {
  --ink: #14120f;
  --muted: #6a6560;
  --line: #ece8e4;
  --lav: #e8e3ff; --lav-d: #7d6be6;
  --sky: #dcecfb; --sky-d: #3f87c7;
  --butter: #fff1c9; --butter-d: #a77d00;
  --mint: #d3f0e1; --mint-d: #2f9c6b;
  --rose: #fde3ea; --rose-d: #d8567f;
  position: relative;
  overflow: clip;
  scroll-margin-top: 100px;
  padding: 112px 0;
  color: var(--ink);
  background: #fff;
  font-family: "Poppins", system-ui, sans-serif;
}
.dc *, .dc *::before, .dc *::after { box-sizing: border-box; }
.dc button:focus-visible, .dc input:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.lav { --t: var(--lav); --td: var(--lav-d); }
.sky { --t: var(--sky); --td: var(--sky-d); }
.mint { --t: var(--mint); --td: var(--mint-d); }
.butter { --t: var(--butter); --td: var(--butter-d); }
.rose { --t: var(--rose); --td: var(--rose-d); }

.title { margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance; font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em; }
.title span { display: block; }
.title .soft { color: var(--muted); }
.lead { width: min(720px, calc(100% - 40px)); margin: 26px auto 0; text-align: center; font-size: 16px; line-height: 1.75; color: var(--muted); }
.lead b { color: var(--ink); font-weight: 500; }

.panel { width: min(1100px, calc(100% - 40px)); margin: 52px auto 0; border-radius: 32px; overflow: hidden; background: #f8f7fb; border: 1px solid #efedf6; }

/* photo header */
.photo { position: relative; height: 250px; background: linear-gradient(135deg, #e8e3ff 0%, #dcecfb 55%, #d3f0e1 100%); }
.photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 28%; opacity: 0; transition: opacity 0.9s ease; }
.photo img.on { opacity: 1; }
.photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(232, 227, 255, 0.25) 0%, rgba(232, 227, 255, 0) 40%, rgba(20, 18, 15, 0.4) 100%); pointer-events: none; }
.glass { position: absolute; z-index: 1; top: 16px; left: 16px; display: flex; align-items: center; gap: 12px; padding: 10px 16px 10px 13px; border-radius: 16px; background: rgba(255, 255, 255, 0.86); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 14px 30px -12px rgba(20, 18, 15, 0.4); }
.glass i { flex: none; width: 10px; height: 10px; border-radius: 50%; background: var(--butter-d); transition: background 0.4s; }
.glass i.done { background: var(--mint-d); }
.glass b { display: block; font-size: 13px; font-weight: 600; }
.glass small { display: block; font-size: 11.5px; color: var(--muted); }
.recs { position: absolute; z-index: 1; left: 16px; right: 16px; bottom: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 6px; border-radius: 20px; background: rgba(255, 255, 255, 0.86); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.recs button { display: grid; gap: 1px; justify-items: start; padding: 9px 14px; border: 0; border-radius: 14px; background: none; cursor: pointer; text-align: left; font-family: inherit; color: var(--ink); transition: background 0.3s, color 0.3s; }
.recs small { font-size: 10.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; transition: color 0.3s; }
.recs b { font-size: 13.5px; font-weight: 500; }
.recs button.on { background: var(--ink); color: #fff; }
.recs button.on small { color: #b8b1ab; }

/* body */
.body { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 20px; align-items: start; }
.left { display: grid; gap: 12px; }
.search { position: relative; display: block; }
.search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #a39d97; }
.search input { width: 100%; padding: 11px 14px 11px 40px; border: 1px solid var(--line); border-radius: 14px; background: #fff; font: 400 13.5px "Poppins", system-ui, sans-serif; color: var(--ink); }
.search input:focus { border-color: var(--lav-d); outline: 0; }

.docs { position: relative; list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; min-height: 120px; align-content: start; }
.doc { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; width: 100%; padding: 11px 12px; border: 1px solid transparent; border-radius: 16px; background: #fff; cursor: pointer; text-align: left; font-family: inherit; color: var(--ink); transition: border-color 0.3s, box-shadow 0.3s; }
.doc:hover { border-color: #ddd6f2; }
.doc.sel { border-color: var(--td); box-shadow: 0 10px 24px -14px var(--td); }
.ext { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: var(--t); color: var(--td); font-size: 10.5px; font-weight: 700; }
.dn { min-width: 0; }
.dn b { display: block; font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dn small { font-size: 11.5px; color: var(--muted); }
.st { padding: 2px 10px; border-radius: 99px; font-size: 10.5px; font-weight: 600; background: #eeeae6; color: var(--muted); transition: background 0.3s, color 0.3s; }
.st.s1 { background: var(--sky); color: var(--sky-d); }
.st.s2 { background: var(--butter); color: var(--butter-d); }
.st.s3 { background: var(--mint); color: #1d7a52; }
.empty { margin: 0; padding: 16px; border: 1.5px dashed #ddd6f2; border-radius: 14px; text-align: center; font-size: 12.5px; color: #a39d97; }
.doc-enter-active { transition: opacity 0.4s, transform 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
.doc-leave-active { position: absolute; left: 0; right: 0; transition: opacity 0.2s; }
.doc-enter-from { opacity: 0; transform: translateY(10px); }
.doc-leave-to { opacity: 0; }
.doc-move { transition: transform 0.4s ease; }

.tpl { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.cap { margin: 0 0 8px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #a39d97; }
.tpl .cap { margin: 0 4px 0 0; }
.tpl button { display: inline-flex; align-items: center; gap: 8px; padding: 6px 13px 6px 8px; border: 1px dashed #cfc8e6; border-radius: 99px; background: none; cursor: pointer; font: 500 12.5px "Poppins", system-ui, sans-serif; color: var(--ink); transition: background 0.25s, border-color 0.25s; }
.tpl button:hover { background: #fff; border-color: var(--lav-d); }
.plus { position: relative; width: 16px; height: 16px; border-radius: 50%; background: var(--ink); }
.plus::before, .plus::after { content: ""; position: absolute; left: 50%; top: 50%; width: 7px; height: 1.6px; margin: -0.8px 0 0 -3.5px; background: #fff; border-radius: 2px; }
.plus::after { transform: rotate(90deg); }

/* detail */
.detail { padding: 20px; border-radius: 24px; background: #fff; animation: pop 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
.crumb { margin: 0; font-size: 11.5px; color: var(--muted); }
.crumb span { margin: 0 4px; color: #c9c2bb; }
.detail h3 { margin: 4px 0 16px; font-size: 18px; font-weight: 500; letter-spacing: -0.01em; }
.vers { list-style: none; margin: 0 0 16px; padding: 0; display: grid; gap: 6px; }
.vers li { display: grid; grid-template-columns: 34px 1fr auto; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 11px; background: #f8f7fb; font-size: 12px; }
.vers li.now { background: var(--t); }
.vers b { font-weight: 600; }
.vers small { font-size: 11px; color: var(--muted); }
.perm { list-style: none; margin: 0 0 16px; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.perm button { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border: 1px solid var(--line); border-radius: 99px; background: #fff; cursor: pointer; font: 500 12px "Poppins", system-ui, sans-serif; color: #a39d97; transition: background 0.3s, color 0.3s, border-color 0.3s; }
.perm button i { width: 8px; height: 8px; border-radius: 50%; background: #d9d3ce; transition: background 0.3s; }
.perm button.on { background: var(--mint); border-color: transparent; color: #1d5f43; }
.perm button.on i { background: var(--mint-d); }
.sig { list-style: none; margin: 0 0 12px; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.sig li { display: grid; gap: 6px; font-size: 11px; color: #a39d97; transition: color 0.3s; }
.sig li span { height: 6px; border-radius: 99px; background: #ece8f5; transition: background 0.5s; }
.sig li.on { color: var(--ink); }
.sig li.on span { background: var(--lav-d); }
.send { width: 100%; padding: 11px; border: 0; border-radius: 14px; background: var(--ink); color: #fff; cursor: pointer; font: 500 13px "Poppins", system-ui, sans-serif; transition: background 0.3s, color 0.3s; }
.send:disabled { background: #f3f0ec; color: var(--muted); cursor: default; }

@keyframes pop { from { opacity: 0; transform: translateY(6px) scale(0.98); } to { opacity: 1; transform: none; } }

/* entrance (runs once) */
.dc:not(.in) .lead, .dc:not(.in) .panel { opacity: 0; }
.dc.in .title span { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
.dc.in .title .soft { animation-delay: 0.1s; }
.dc.in .lead { animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s backwards; }
.dc.in .panel { animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s backwards; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

@media (max-width: 900px) {
  .body { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .dc { padding: 72px 0; }
  .panel { border-radius: 24px; }
  .photo { height: 280px; }
  .recs { grid-template-columns: 1fr; }
  .recs button { padding: 7px 12px; grid-template-columns: auto 1fr; align-items: center; gap: 10px; }
  .body { padding: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .dc *, .dc *::before, .dc *::after { animation: none !important; transition: none !important; }
  .dc:not(.in) .lead, .dc:not(.in) .panel { opacity: 1; }
}
</style>
