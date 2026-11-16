<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "ServiceJobDispatchSection" });

const root = ref(null);
const shown = ref(false);
const seen = ref(false);
const hl = ref(-1);
let io = null;


const imgs = {
  hero: "/saptivo/images/features/dd.webp",
  techs: [
    "/saptivo/images/features/15.webp",
    "/saptivo/images/features/10.jpg",
    "/saptivo/images/features/12.jpg",
  ],
};
const heroOk = ref(true);
const techOk = reactive([true, true, true]);

const features = [
  "Job types: installation, preventive service, breakdown, inspection and warranty claim",
  "Technician assignment by skill, availability and geographic zone",
  "Status pipeline: scheduled, dispatched, in progress, completed and invoiced",
  "Drag-and-drop scheduling calendar",
  "Estimated versus actual time for productivity tracking",
  "Multi-technician jobs for larger installations",
  "Customer signature on completion",
];

const types = {
  install: { n: "Installation", tone: "lav" },
  prev: { n: "Preventive service", tone: "mint" },
  brk: { n: "Breakdown", tone: "rose" },
  insp: { n: "Inspection", tone: "sky" },
  war: { n: "Warranty claim", tone: "butter" },
};
const statuses = ["Scheduled", "Dispatched", "In progress", "Completed", "Invoiced"];
const slots = ["9 am", "11 am", "1 pm", "3 pm"];
const techs = [
  { n: "Nimal P.", i: "NP", skill: "Air conditioning", zone: "Colombo" },
  { n: "Kasun R.", i: "KR", skill: "Generators", zone: "Colombo" },
  { n: "Dilani S.", i: "DS", skill: "Installations", zone: "Galle" },
];
const away = new Set(["1-0", "2-3"]); // not available in those slots

const jobs = reactive([
  { id: "JC-1041", cust: "Acme Ltd", place: "Colombo 03", type: "prev", r: 0, c: 0, st: 2, est: 120, act: 140, techs: [0] },
  { id: "JC-1042", cust: "Harbour Hotel", place: "Galle", type: "install", r: 2, c: 1, st: 0, est: 240, act: null, techs: [2, 0] },
  { id: "JC-1043", cust: "Lanka Foods", place: "Colombo 07", type: "brk", r: 1, c: 1, st: 1, est: 90, act: null, techs: [1] },
  { id: "JC-1044", cust: "City Clinic", place: "Colombo 05", type: "insp", r: 0, c: 2, st: 3, est: 60, act: 55, techs: [0] },
  { id: "JC-1045", cust: "Metro Mall", place: "Colombo 02", type: "war", r: 1, c: 3, st: 0, est: 75, act: null, techs: [1] },
]);

const sel = ref("JC-1042");
const job = computed(() => jobs.find((j) => j.id === sel.value));
const at = (r, c) => jobs.find((j) => j.r === r && j.c === c);

/* ---------- moving jobs: drag and drop, or select a job then tap a free slot ---------- */
const over = ref("");
const bad = ref("");
let dragId = null;
function onDragStart(e, j) {
  dragId = j.id;
  sel.value = j.id;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", j.id);
}
function move(id, r, c) {
  const key = `${r}-${c}`;
  const j = jobs.find((x) => x.id === id);
  if (!j) return;
  if (away.has(key) || at(r, c)) {
    bad.value = key;
    setTimeout(() => (bad.value = ""), 500);
    return;
  }
  j.r = r;
  j.c = c;
  j.techs = [r, ...j.techs.slice(1).filter((t) => t !== r)]; // the row's technician leads; helpers stay
  sel.value = id;
}
function onDrop(r, c) {
  over.value = "";
  if (dragId) move(dragId, r, c);
  dragId = null;
}

/* ---------- status pipeline ---------- */
function advance() {
  const j = job.value;
  if (!j || j.st >= statuses.length - 1) return;
  j.st += 1;
  if (j.st === 2 && j.act == null) j.act = Math.round((j.est * 1.15) / 5) * 5;
}
const hm = (m) => (m == null ? "—" : `${Math.floor(m / 60) ? Math.floor(m / 60) + " h " : ""}${m % 60 ? (m % 60) + " m" : ""}`.trim() || "0 m");
const maxT = computed(() => Math.max(job.value.est, job.value.act || 0));
const delta = computed(() => (job.value.act == null ? null : job.value.act - job.value.est));

onMounted(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    seen.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        seen.value = true;
      }
    },
    { threshold: 0.12 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => io && io.disconnect());
</script>

<template>
  <section ref="root" class="hw" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Service job cards and</span> <span class="l2">technician dispatch</span></h2>
        <p class="sub">
          Every visit, preventive or breakdown, becomes a job card that is assigned, tracked and closed with a full record.
        </p>
      </header>

      <!-- ============ photo banner ============ -->
      <figure class="banner" :class="{ on: seen }">
        <img v-if="heroOk" :src="imgs.hero" alt="Technician on a service visit" loading="lazy" @error="heroOk = false" />
        <svg v-else class="fb" viewBox="0 0 1000 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="jd-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#e8e3ff" />
              <stop offset="1" stop-color="#d3f0e1" />
            </linearGradient>
          </defs>
          <rect width="1000" height="260" fill="url(#jd-g)" />
          <g fill="#fff" opacity=".7">
            <circle cx="150" cy="60" r="90" /><circle cx="860" cy="220" r="120" />
          </g>
          <rect x="360" y="70" width="280" height="130" rx="26" fill="#fff" />
          <rect x="384" y="94" width="120" height="14" rx="7" fill="#e8e3ff" />
          <rect x="384" y="120" width="200" height="10" rx="5" fill="#ece9f3" />
          <rect x="384" y="142" width="160" height="10" rx="5" fill="#ece9f3" />
          <circle cx="596" cy="166" r="22" fill="#2f9c6b" />
          <path d="M586 166l8 8 14-16" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="shade"></div>
        <figcaption>
          <span class="p1 tone-lav"><i></i>Job card created</span>
          <span class="p2 tone-sky"><i></i>Technician dispatched</span>
          <span class="p3 tone-mint"><i></i>Closed with customer signature</span>
        </figcaption>
      </figure>

      <!-- ============ live board ============ -->
      <div class="board" :class="{ on: seen }">
        <!-- calendar -->
        <div class="cal" :class="{ hl: hl === 3 }">
          <div class="bh">
            <b>Dispatch calendar</b>
            <small>Drag a job to another slot, or select it and tap a free one</small>
          </div>

          <div class="scroll">
            <div class="gridc">
              <span></span>
              <span v-for="s in slots" :key="s" class="sl">{{ s }}</span>

              <template v-for="(t, r) in techs" :key="t.n">
                <div class="tech" :class="{ hl: hl === 1 }">
                  <span class="av">
                    <img v-if="techOk[r]" :src="imgs.techs[r]" alt="" @error="techOk[r] = false" />
                    <template v-else>{{ t.i }}</template>
                  </span>
                  <div>
                    <b>{{ t.n }}</b>
                    <small>{{ t.skill }} · {{ t.zone }}</small>
                  </div>
                </div>

                <template v-for="(s, c) in slots" :key="s">
                  <div
                    v-if="away.has(r + '-' + c)"
                    class="cell off"
                    :class="{ shake: bad === r + '-' + c }"
                    title="Not available"
                  >
                    <small>Unavailable</small>
                  </div>

                  <div
                    v-else-if="at(r, c)"
                    class="cell"
                    :class="{ over: over === r + '-' + c, shake: bad === r + '-' + c }"
                    @dragover.prevent="over = r + '-' + c"
                    @dragleave="over = ''"
                    @drop.prevent="onDrop(r, c)"
                  >
                    <button
                      type="button"
                      class="job"
                      :class="['tone-' + types[at(r, c).type].tone, { sel: sel === at(r, c).id }]"
                      draggable="true"
                      :aria-pressed="sel === at(r, c).id"
                      @click="sel = at(r, c).id"
                      @dragstart="onDragStart($event, at(r, c))"
                    >
                      <b>{{ at(r, c).cust }}</b>
                      <small>{{ types[at(r, c).type].n }}</small>
                      <span v-if="at(r, c).techs.length > 1" class="plus">+{{ at(r, c).techs.length - 1 }}</span>
                    </button>
                  </div>

                  <button
                    v-else
                    type="button"
                    class="cell free"
                    :class="{ over: over === r + '-' + c, shake: bad === r + '-' + c }"
                    :aria-label="`Move the selected job to ${t.n} at ${s}`"
                    @click="move(sel, r, c)"
                    @dragover.prevent="over = r + '-' + c"
                    @dragleave="over = ''"
                    @drop.prevent="onDrop(r, c)"
                  >
                    <i>+</i>
                  </button>
                </template>
              </template>
            </div>
          </div>

          <ul class="legend" :class="{ hl: hl === 0 }">
            <li v-for="(t, k) in types" :key="k" :class="'tone-' + t.tone"><i></i>{{ t.n }}</li>
          </ul>
        </div>

        <!-- job card -->
        <div v-if="job" class="jc" :key="job.id">
          <div class="jh">
            <div>
              <small>{{ job.id }}</small>
              <b>{{ job.cust }}</b>
              <em>{{ job.place }}</em>
            </div>
            <span class="badge" :class="'tone-' + types[job.type].tone">{{ types[job.type].n }}</span>
          </div>

          <!-- pipeline -->
          <ol class="pipe" :class="{ hl: hl === 2 }" aria-label="Job status">
            <li v-for="(s, k) in statuses" :key="s" :class="{ done: job.st > k, cur: job.st === k }">
              <i>
                <svg v-if="job.st > k" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                <template v-else>{{ k + 1 }}</template>
              </i>
              <span>{{ s }}</span>
            </li>
          </ol>
          <button type="button" class="go" :disabled="job.st >= statuses.length - 1" @click="advance">
            {{ job.st >= statuses.length - 1 ? "✓ Invoiced" : "Move to " + statuses[job.st + 1].toLowerCase() }}
          </button>

          <!-- time -->
          <div class="time" :class="{ hl: hl === 4 }">
            <div class="tr">
              <span>Estimated</span>
              <div><i class="e" :style="{ width: (job.est / maxT) * 100 + '%' }"></i></div>
              <b>{{ hm(job.est) }}</b>
            </div>
            <div class="tr">
              <span>Actual</span>
              <div><i class="a" :class="{ over: delta > 0 }" :style="{ width: job.act ? (job.act / maxT) * 100 + '%' : '0%' }"></i></div>
              <b>{{ hm(job.act) }}</b>
            </div>
            <small v-if="delta !== null" :class="delta > 0 ? 'late' : 'fast'">
              {{ delta > 0 ? hm(delta) + " over estimate" : delta < 0 ? hm(-delta) + " under estimate" : "On estimate" }}
            </small>
          </div>

          <!-- technicians -->
          <div class="crew" :class="{ hl: hl === 5 || hl === 1 }">
            <div class="avs">
              <span v-for="t in job.techs" :key="t" class="av">
                <img v-if="techOk[t]" :src="imgs.techs[t]" alt="" @error="techOk[t] = false" />
                <template v-else>{{ techs[t].i }}</template>
              </span>
            </div>
            <div>
              <b>{{ job.techs.map((t) => techs[t].n).join(" + ") }}</b>
              <small>{{ job.techs.length > 1 ? "Multi-technician job" : "Assigned by skill, availability and zone" }}</small>
            </div>
          </div>

          <!-- signature -->
          <div class="sig" :class="{ hl: hl === 6, signed: job.st >= 3 }">
            <small>Customer signature</small>
            <svg v-if="job.st >= 3" :key="job.id + '-signed'" viewBox="0 0 120 50" aria-label="Signed">
              <path d="M6 38 C 14 6, 24 6, 26 28 S 36 46, 46 20 S 64 8, 68 30 S 92 38, 114 18" pathLength="1" />
            </svg>
            <span v-else>Awaiting signature</span>
          </div>
        </div>
      </div>

      <!-- ============ feature list ============ -->
      <ul class="feat">
        <li
          v-for="(t, i) in features"
          :key="t"
          :class="{ on: seen, act: hl === i }"
          :style="{ '--d': i * 0.07 + 's' }"
          tabindex="0"
          @pointerenter="hl = i"
          @pointerleave="hl = -1"
          @focus="hl = i"
          @blur="hl = -1"
        >
          <span class="num">{{ i + 1 }}</span>
          <p>{{ t }}</p>
        </li>
      </ul>
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
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.hw h2 .l1 { color: #111111 !important; opacity: 1; }
.hw h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.sub { margin: 18px auto 0; max-width: 52ch; font-size: 16px; line-height: 1.7; color: var(--muted); }
.head { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head { opacity: 1; transform: none; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); }
.tone-rose { --t: var(--rose); --ti: var(--rose-i); }

/* highlight ring, driven by hovering a feature below */
.hl { box-shadow: 0 0 0 2px var(--lav-i); background-color: #faf8ff; }

/* photo banner */
.banner { position: relative; margin: 0 0 18px; height: clamp(180px, 24vw, 260px); border-radius: 30px; overflow: hidden; background: #f1eefb; opacity: .35; transform: translateY(14px); transition: all .8s cubic-bezier(.3, .8, .3, 1); box-shadow: 0 20px 44px rgba(60, 50, 120, .1); }
.banner.on { opacity: 1; transform: none; }
.banner img, .banner .fb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block; }
.banner .shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(20, 18, 15, .5) 0%, rgba(20, 18, 15, 0) 65%); }
.banner figcaption { position: absolute; left: 20px; bottom: 18px; display: flex; flex-wrap: wrap; gap: 8px; max-width: calc(100% - 40px); }
.banner figcaption span { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 99px; background: #fff; color: var(--ink); font-size: 12.5px; font-weight: 600; box-shadow: 0 10px 24px rgba(20, 18, 15, .18); opacity: 0; transform: translateY(12px); }
.banner figcaption i { width: 9px; height: 9px; border-radius: 50%; background: var(--ti); box-shadow: 0 0 0 4px color-mix(in srgb, var(--ti) 22%, transparent); }
.banner.on figcaption span { animation: chip .6s cubic-bezier(.3, 1.3, .5, 1) both; }
.banner.on .p1 { animation-delay: .4s; }
.banner.on .p2 { animation-delay: .9s; }
.banner.on .p3 { animation-delay: 1.4s; }
@keyframes chip { to { opacity: 1; transform: none; } }

/* board */
.board { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 18px; padding: 18px; border-radius: 34px; background: #faf9ff; border: 1.5px solid var(--line); opacity: .35; transform: translateY(14px); transition: all .8s cubic-bezier(.3, .8, .3, 1); }
.board.on { opacity: 1; transform: none; box-shadow: 0 24px 54px rgba(60, 50, 120, .1); }
.cal, .jc { background: #fff; border-radius: 26px; padding: 18px; min-width: 0; transition: box-shadow .3s; }
.bh { display: flex; flex-direction: column; gap: 2px; margin-bottom: 14px; }
.bh b { font-size: 15px; }
.bh small { font-size: 11.5px; color: var(--muted); }

.scroll { overflow-x: auto; padding-bottom: 4px; }
.gridc { display: grid; grid-template-columns: 132px repeat(4, minmax(96px, 1fr)); gap: 8px; min-width: 560px; align-items: stretch; }
.sl { font-size: 11px; font-weight: 600; color: var(--muted); text-align: center; padding-bottom: 2px; }
.tech { display: flex; align-items: center; gap: 8px; padding: 6px; border-radius: 14px; transition: box-shadow .3s; min-width: 0; }
.tech b { display: block; font-size: 12.5px; }
.tech small { display: block; font-size: 10.5px; color: var(--muted); line-height: 1.3; }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; border-radius: 50%; display: block; }
.av { overflow: hidden; flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: var(--ink); color: #fff; font-size: 10.5px; font-weight: 700; border: 2px solid #fff; }

.cell { position: relative; min-height: 64px; border-radius: 14px; background: #f6f4ff; border: 1.5px dashed transparent; padding: 0; transition: background .2s, border-color .2s; }
.free { display: grid; place-items: center; font: inherit; cursor: pointer; border: 1.5px dashed #ddd8f2; background: #fbfaff; }
.free i { font-style: normal; font-size: 18px; color: #bdb7dc; opacity: 0; transition: opacity .2s; }
.free:hover i, .free:focus-visible i { opacity: 1; }
.free:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 2px; }
.cell.over { border-color: var(--lav-i); background: var(--lav); }
.cell.off { display: grid; place-items: center; background: repeating-linear-gradient(135deg, #f3f2f7 0 6px, #eceaf3 6px 12px); }
.cell.off small { font-size: 10px; color: #a29fb2; font-weight: 600; }
.cell.shake { animation: shake .4s ease; border-color: var(--rose-i); }
@keyframes shake { 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }

.job { position: relative; display: flex; flex-direction: column; gap: 1px; width: 100%; height: 100%; min-height: 64px; padding: 8px 10px; border: 1.5px solid transparent; border-radius: 14px; background: var(--t); color: var(--ti); font: inherit; text-align: left; cursor: grab; transition: box-shadow .25s, transform .25s, border-color .25s; }
.job:active { cursor: grabbing; }
.job:hover { transform: translateY(-1px); }
.job.sel { border-color: var(--ti); box-shadow: 0 8px 20px color-mix(in srgb, var(--ti) 28%, transparent); }
.job:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.job b { font-size: 12px; line-height: 1.25; }
.job small { font-size: 10.5px; font-weight: 600; opacity: .85; }
.job .plus { position: absolute; right: 8px; top: 8px; padding: 1px 7px; border-radius: 99px; background: #fff; color: var(--ink); font-size: 10px; font-weight: 700; }

.legend { list-style: none; display: flex; flex-wrap: wrap; gap: 6px 8px; margin: 14px 0 0; padding: 8px; border-radius: 14px; }
.legend li { display: flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 99px; background: var(--t); color: var(--ti); font-size: 11px; font-weight: 600; }
.legend i { width: 7px; height: 7px; border-radius: 50%; background: var(--ti); }

/* job card */
.jc { display: flex; flex-direction: column; gap: 14px; animation: up .45s ease both; }
@keyframes up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.jh { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; }
.jh small { display: block; font-size: 11px; font-weight: 600; letter-spacing: .05em; color: var(--muted); }
.jh b { display: block; font-size: 17px; letter-spacing: -.01em; }
.jh em { font-style: normal; font-size: 12px; color: var(--muted); }
.badge { flex: none; padding: 6px 12px; border-radius: 99px; background: var(--t); color: var(--ti); font-size: 11px; font-weight: 700; }

.pipe { list-style: none; margin: 0; padding: 6px; border-radius: 14px; display: flex; justify-content: space-between; position: relative; transition: box-shadow .3s; }
.pipe::before { content: ""; position: absolute; left: 24px; right: 24px; top: 21px; height: 3px; background: #e7e3f4; }
.pipe li { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 600; color: #a29fb2; text-align: center; line-height: 1.2; }
.pipe i { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 700; background: #fff; border: 2px solid #e3dff2; transition: all .4s; }
.pipe i svg { width: 14px; height: 14px; }
.pipe .done i { background: var(--mint-i); border-color: var(--mint-i); color: #fff; }
.pipe .done span { color: var(--mint-i); }
.pipe .cur i { background: var(--ink); border-color: var(--ink); color: #fff; box-shadow: 0 0 0 5px rgba(20, 18, 15, .1); }
.pipe .cur span { color: var(--ink); }
.go { align-self: flex-start; padding: 10px 18px; border: 0; border-radius: 99px; background: var(--ink); color: #fff; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: transform .25s, background .3s; }
.go:hover:not(:disabled) { transform: translateY(-1px); }
.go:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 3px; }
.go:disabled { background: var(--mint-i); cursor: default; }

.time { display: flex; flex-direction: column; gap: 8px; padding: 10px; border-radius: 14px; background: #f9f8ff; transition: box-shadow .3s; }
.tr { display: grid; grid-template-columns: 66px 1fr 58px; align-items: center; gap: 8px; font-size: 11.5px; color: var(--muted); }
.tr div { height: 9px; border-radius: 99px; background: #eeebf8; overflow: hidden; }
.tr i { display: block; height: 100%; border-radius: 99px; transition: width .9s cubic-bezier(.3, .8, .3, 1); }
.tr .e { background: #b9b0e4; }
.tr .a { background: var(--mint-i); }
.tr .a.over { background: var(--rose-i); }
.tr b { color: var(--ink); text-align: right; font-variant-numeric: tabular-nums; }
.time small { font-size: 11.5px; font-weight: 600; }
.time .late { color: var(--rose-i); }
.time .fast { color: var(--mint-i); }

.crew { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 14px; transition: box-shadow .3s; }
.crew .avs { display: flex; }
.crew .av { width: 34px; height: 34px; margin-left: -8px; }
.crew .av:first-child { margin-left: 0; }
.crew b { display: block; font-size: 13px; }
.crew small { font-size: 11px; color: var(--muted); }

.sig { padding: 10px 12px; border-radius: 14px; border: 1.5px dashed #ddd8f2; display: flex; flex-direction: column; gap: 4px; min-height: 84px; transition: box-shadow .3s, border-color .4s; }
.sig small { font-size: 10.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.sig > span { margin: auto; font-size: 12px; color: #b3b0c4; }
.sig svg { width: 130px; height: 50px; margin: 0 auto; }
.sig path { fill: none; stroke: var(--ink); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.3s ease forwards; }
.sig.signed { border-style: solid; border-color: var(--mint); background: #f7fcf9; }
@keyframes draw { to { stroke-dashoffset: 0; } }

/* feature list */
.feat { list-style: none; margin: 22px 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.feat li { display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; border-radius: 22px; background: #faf9ff; border: 1.5px solid var(--line); opacity: .35; transform: translateY(12px); transition: all .6s cubic-bezier(.3, .8, .3, 1) var(--d), box-shadow .3s, border-color .3s, background .3s; }
.feat li.on { opacity: 1; transform: none; background: #fff; }
.feat li.act { border-color: var(--lav-i); box-shadow: 0 12px 28px rgba(125, 107, 230, .18); }
.feat li:focus-visible { outline: 2px solid var(--lav-i); outline-offset: 2px; }
.num { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font-size: 12.5px; font-weight: 700; background: #fff; color: var(--lav-i); border: 2px solid var(--lav); transition: all .3s; }
.feat li.act .num { background: var(--lav-i); border-color: var(--lav-i); color: #fff; }
.feat p { margin: 0; font-size: 13.5px; font-weight: 500; line-height: 1.55; }

.note { margin: 26px 0 0; text-align: center; font-size: 12px; color: #a3a6b4; }

@media (max-width: 980px) {
  .board { grid-template-columns: minmax(0, 1fr); }
  .feat { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .hw { padding: 64px 16px; }
  .board { padding: 12px; border-radius: 28px; }
  .feat { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .head { opacity: 1; transform: none; transition: none; }
  .jc, .cell.shake, .banner.on figcaption span { animation: none; }
  .banner figcaption span { opacity: 1; transform: none; }
  .sig path { animation: none; stroke-dashoffset: 0; }
  * { transition-duration: 0s !important; }
}
</style>
