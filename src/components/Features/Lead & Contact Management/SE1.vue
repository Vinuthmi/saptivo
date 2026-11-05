<template>
  <section id="lead-capture" class="cap" aria-labelledby="cap-title">
    <h2 id="cap-title" class="title">
      <span>Automatic lead capture</span>
      <span class="soft">from every channel</span>
    </h2>
    <p class="lead">Stop copying enquiries by hand. Saptivo captures leads automatically from:</p>

    <div class="grid">
      <!-- sources -->
      <ul class="sources">
        <li v-for="(s, i) in sources" :key="s.key">
          <button type="button" class="src" :class="{ on: i === current }" :aria-pressed="i === current" @click="current = i">
            <span class="ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path v-for="(d, k) in s.icon" :key="k" :d="d" /></svg>
            </span>
            <span class="txt">
              <b>{{ s.title }}</b>
              <small>{{ s.sub }}</small>
            </span>
          </button>
        </li>
      </ul>

      <!-- leads + source chart -->
      <div class="panel">
        <div class="win">
          <div class="wh">
            <b>Leads</b>
            <span class="all">{{ sources[current].tag }}</span>
          </div>
          <ul class="rows">
            <li v-for="l in leads" :key="l.id" class="row">
              <span class="av" :style="{ background: l.color }">{{ l.ini }}</span>
              <span class="who">
                <b>{{ l.name }}</b>
                <small>{{ l.campaign }}</small>
              </span>
              <span class="tag" :class="sources[l.src].cls">{{ sources[l.src].tag }}</span>
            </li>
          </ul>
        </div>

        <div class="chart">
          <div class="ch-head"><b>Leads by source</b><small>This month</small></div>
          <div v-for="(s, i) in sources" :key="s.key" class="bar">
            <span class="bl">{{ s.tag }}</span>
            <span class="bt"><i :class="s.cls" :style="{ width: (counts[i] / max) * 100 + '%' }"></i></span>
            <span class="bn">{{ counts[i] }}</span>
          </div>
        </div>
      </div>
    </div>

    <p class="note">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
      Every lead records its source and campaign, so you can see which channel brings customers, not just clicks.
    </p>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
defineOptions({ name: "LeadCaptureSection" });

const sources = [
  { key: "web", tag: "Website", cls: "web", title: "Website contact forms", sub: "Including WordPress",
    icon: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M3 12h18", "M12 3a14 14 0 0 1 0 18", "M12 3a14 14 0 0 0 0 18"] },
  { key: "fb", tag: "Facebook", cls: "fb", title: "Facebook Lead Ads", sub: "Instant Forms",
    icon: ["M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z"] },
  { key: "wa", tag: "WhatsApp", cls: "wa", title: "WhatsApp Business", sub: "Conversations",
    icon: ["M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.9A8.5 8.5 0 1 1 21 11.5z", "M8.5 10h7", "M8.5 13.5h4.5"] },
  { key: "call", tag: "3CX call", cls: "call", title: "Inbound phone calls", sub: "Through 3CX",
    icon: ["M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"] },
  { key: "imp", tag: "Import", cls: "imp", title: "Imports and manual entry", sub: "CSV, Excel, business card scans",
    icon: ["M12 15V3", "m7 8 5-5 5 5", "M4 17v3h16v-3"] },
];

const pool = [
  { src: 0, name: "Ayesha Fernando", campaign: "Contact form · WordPress", ini: "AF", color: "#ffd9c9" },
  { src: 1, name: "Kasun Silva", campaign: "Diwali Offer · Instant Form", ini: "KS", color: "#d9e6ff" },
  { src: 2, name: "Nimal Perera", campaign: "Click-to-WhatsApp ad", ini: "NP", color: "#d4f2e0" },
  { src: 3, name: "Dilini Jayasinghe", campaign: "Inbound call · Sales line", ini: "DJ", color: "#e6dcff" },
  { src: 4, name: "Ruwan Madushanka", campaign: "Business card scan", ini: "RM", color: "#ffe9b8" },
  { src: 0, name: "Tharindu Bandara", campaign: "Pricing page form", ini: "TB", color: "#ffd9c9" },
  { src: 2, name: "Sachini Wickrama", campaign: "WhatsApp enquiry", ini: "SW", color: "#d4f2e0" },
  { src: 1, name: "Malik Rodrigo", campaign: "New Year Promo · Instant Form", ini: "MR", color: "#d9e6ff" },
  { src: 3, name: "Priya Nadarajah", campaign: "Inbound call · Kandy office", ini: "PN", color: "#e6dcff" },
  { src: 4, name: "Chamari Perera", campaign: "CSV import · Expo list", ini: "CP", color: "#ffe9b8" },
];

const leadsBySource = pool.map((lead, id) => ({ ...lead, id }));
const counts = [24, 18, 31, 12, 9];
const max = Math.max(...counts) + 6;
const current = ref(0);
const leads = computed(() => leadsBySource.filter((lead) => lead.src === current.value));
</script>

<style scoped>
.cap {
  --orange: #e85b32;
  --ink: #252525;
  --muted: #666;
  --line: #e5e5e5;
  position: relative;
  scroll-margin-top: 100px;
  padding: 88px 0;
  color: var(--ink);
  background: #fff;
  font-family: 'Urbanist', system-ui, sans-serif;
}
.cap *, .cap *::before, .cap *::after { box-sizing: border-box; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(32px, 3.4vw, 48px); font-weight: 600; line-height: 1.2;
  color: var(--ink);
}
.title span { display: block; }
.title .soft { color: var(--ink); }
.lead { margin: 22px auto 0; width: min(640px, calc(100% - 40px)); text-align: center; font-size: 16.5px; line-height: 1.7; color: var(--muted); }

.grid {
  width: min(1100px, calc(100% - 40px)); margin: 56px auto 0;
  display: grid; grid-template-columns: 1fr 1.05fr; gap: 48px; align-items: stretch;
}

/* ---------- sources ---------- */
.sources { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; align-content: center; min-width: 0; }
.src {
  width: 100%; display: flex; align-items: center; gap: 14px; padding: 14px 16px;
  border: 1px solid var(--line); border-radius: 8px; background: #fff; color: inherit;
  text-align: left; font: inherit; cursor: pointer;
}
.src:hover, .src.on { border-color: var(--orange); background: #fff8f5; }
.src:focus-visible { outline: 2px solid var(--orange); outline-offset: 2px; }
.ic { flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 6px; background: #f2f2f2; color: #555; }
.src.on .ic { background: #fbe5dc; color: var(--orange); }
.txt { min-width: 0; }
.txt b { display: block; font-size: 15px; font-weight: 600; }
.txt small { display: block; margin-top: 1px; font-size: 12.5px; color: var(--muted); }

/* ---------- panel ---------- */
.panel {
  display: flex; flex-direction: column; gap: 14px; padding: 20px; min-width: 0;
  border: 1px solid var(--line); border-radius: 10px; background: #f7f7f7;
}
.win { padding: 14px 16px 16px; border: 1px solid var(--line); border-radius: 8px; background: #fff; }
.wh { display: flex; align-items: center; gap: 10px; }
.wh b { font-size: 14px; font-weight: 600; }
.all { margin-left: 4px; color: var(--muted); font-size: 12px; }

.rows { position: relative; list-style: none; margin: 12px 0 0; padding: 0; display: grid; gap: 8px; }
.row { display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 12px; border-radius: 6px; background: #f7f7f7; }
.av { flex: none; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; font-size: 11.5px; font-weight: 600; color: var(--ink); }
.who { flex: 1; min-width: 0; }
.who b { display: block; font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.who small { display: block; font-size: 11.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tag { flex: none; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
.web { background: #fff0e8; color: #c4400f; }
.fb { background: #e7f0ff; color: #0b57d0; }
.wa { background: #e6f9ee; color: #128a47; }
.call { background: #efe9ff; color: #6b3fd1; }
.imp { background: #f1ece8; color: #5d6068; }

.chart { padding: 14px 16px 16px; border: 1px solid var(--line); border-radius: 8px; background: #fff; display: grid; gap: 9px; }
.ch-head { display: flex; justify-content: space-between; align-items: baseline; }
.ch-head b { font-size: 13px; font-weight: 600; }
.ch-head small { font-size: 11px; color: var(--muted); }
.bar { display: grid; grid-template-columns: 66px 1fr 28px; align-items: center; gap: 10px; font-size: 11.5px; }
.bl { color: var(--muted); }
.bt { display: block; height: 7px; border-radius: 4px; background: #f4efec; overflow: hidden; }
.bt i { display: block; height: 100%; border-radius: 4px; background: var(--orange); }
.bn { text-align: right; font-weight: 600; }

.note {
  display: flex; align-items: center; justify-content: center; gap: 10px; text-wrap: balance; text-align: center;
  width: fit-content; max-width: calc(100% - 40px); margin: 48px auto 0; padding: 14px 22px;
  color: var(--muted); font-size: 14px; font-weight: 400; line-height: 1.5;
}
.note svg { flex: none; }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .grid { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 760px) {
  .cap { padding: 72px 0; }
  .grid { width: calc(100% - 32px); margin-top: 40px; }
  .panel { padding: 16px; }
  .src { padding: 13px 14px; }
  .note { text-align: left; justify-content: flex-start; font-size: 13px; }
}
</style>
