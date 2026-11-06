<template>
  <section id="how-it-works" class="hw" aria-labelledby="hw-title">
    <h2 id="hw-title" class="title">
      <span>How Saptivo</span>
      <span class="soft">lead management works</span>
    </h2>

    <ol class="steps">
      <li v-for="(s, i) in steps" :key="s.title" ref="stepElements" class="step" :class="{ act: i === active, past: i < active, flip: i % 2 === 1 }">
        <div class="txt">
          <span class="kick">Step {{ i + 1 }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </div>

        <button type="button" class="node" :aria-label="`Show step ${i + 1}: ${s.title}`" :aria-current="i === active ? 'step' : undefined" @click="pick(i)">{{ i + 1 }}</button>

        <div class="mock">
          <!-- 1 · capture -->
          <div v-if="i === 0" class="m m1">
            <ul class="src">
              <li style="--d: 0s"><span class="dot web"></span>Website form</li>
              <li style="--d: 0.45s"><span class="dot wa"></span>WhatsApp message</li>
              <li style="--d: 0.9s"><span class="dot fb"></span>Facebook lead form</li>
            </ul>
            <span class="arr">→</span>
            <div class="newlead"><b>New enquiry</b><small>Nimal Perera · Solar quote</small></div>
          </div>

          <!-- 2 · create + dedupe + source -->
          <div v-else-if="i === 1" class="m m2">
            <div class="rec">
              <b>Nimal Perera</b>
              <small>nimal@abcsolar.lk · +94 77 123 4567</small>
            </div>
            <ul class="chk">
              <li style="--d: 0.1s"><span class="ck">✓</span>Lead created</li>
              <li style="--d: 0.6s"><span class="ck">✓</span>Duplicate check <em>none found</em></li>
              <li style="--d: 1.1s"><span class="ck">✓</span>Source <em>Facebook Lead Ads · Solar Oct</em></li>
            </ul>
          </div>

          <!-- 3 · score + route -->
          <div v-else-if="i === 2" class="m m3">
            <div class="score">
              <div class="sh"><span>Lead score</span><b>82 <em>Hot</em></b></div>
              <div class="bar"><i></i></div>
            </div>
            <div class="route">
              <span class="rl">Rule · City is Colombo</span>
              <span class="who"><span class="av">IS</span>Assigned to <b>Ishara</b></span>
            </div>
          </div>

          <!-- 4 · notify + task -->
          <div v-else-if="i === 3" class="m m4">
            <div class="note">
              <span class="bell">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
              </span>
              <span class="nt"><b>New hot lead assigned</b><small>Nimal Perera · Score 82</small></span>
              <span class="now">now</span>
            </div>
            <div class="task">
              <span class="cb"></span>
              <span class="nt"><b>Call Nimal Perera</b><small>Follow-up task</small></span>
              <span class="due">Due 4:30 PM</span>
            </div>
          </div>

          <!-- 5 · timeline -->
          <div v-else class="m m5">
            <ul class="tl">
              <li style="--d: 0s"><span class="ty">Call</span><span class="tx">Inbound call logged · 3 min</span><span class="tm">4:12 PM</span></li>
              <li style="--d: 0.45s"><span class="ty">Chat</span><span class="tx">WhatsApp: site visit agreed</span><span class="tm">Tue</span></li>
              <li style="--d: 0.9s"><span class="ty">Email</span><span class="tx">Quotation QT-1042 sent</span><span class="tm">Wed</span></li>
              <li class="won" style="--d: 1.4s"><span class="ty">Won</span><span class="tx">Converted to customer</span><span class="tm">Fri</span></li>
            </ul>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineOptions({ name: "HowLeadManagementWorks" });

const steps = [
  { title: "An enquiry comes in", text: "A customer fills in your website form, messages you on WhatsApp or submits a Facebook lead form." },
  { title: "The lead is created", text: "Saptivo creates the lead, checks for duplicates and records the source." },
  { title: "Scored and routed", text: "Scoring rules rank the lead and routing rules assign it to the right salesperson." },
  { title: "The salesperson is told", text: "The salesperson gets a notification and a follow-up task with a due time." },
  { title: "Every touch is logged", text: "Every call, chat and email afterwards is logged to the lead's timeline until it becomes a customer." },
];

const active = ref(0);
const stepElements = ref([]);

function pick(i) {
  active.value = i;
}

function updateActiveStep() {
  const viewportCenter = window.innerHeight / 2;
  let closestStep = 0;
  let closestDistance = Infinity;

  stepElements.value.forEach((element, index) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestStep = index;
    }
  });

  active.value = closestStep;
}

onMounted(() => {
  updateActiveStep();
  window.addEventListener("scroll", updateActiveStep, { passive: true });
  window.addEventListener("resize", updateActiveStep);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateActiveStep);
  window.removeEventListener("resize", updateActiveStep);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.hw {
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
.hw *, .hw *::before, .hw *::after { box-sizing: border-box; }
.hw button:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

.title {
  margin: 0 auto; width: min(900px, calc(100% - 40px)); text-align: center; text-wrap: balance;
  font-size: clamp(34px, 3.6vw, 56px); font-weight: 500; line-height: 1.15; letter-spacing: -0.03em;
}
.title span { display: block; }
.title .soft { color: var(--muted); }

/* ---------- zig-zag timeline ---------- */
.steps { list-style: none; margin: 64px auto 0; padding: 0; width: min(1080px, calc(100% - 40px)); }
.step {
  position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 64px minmax(0, 1fr); grid-template-areas: "txt node mock";
  align-items: center; padding: 22px 0;
}
.step.flip { grid-template-areas: "mock node txt"; }
.txt { grid-area: txt; padding-right: 36px; text-align: right; }
.flip .txt { padding-right: 0; padding-left: 36px; text-align: left; }
.mock { grid-area: mock; padding-left: 36px; }
.flip .mock { padding-left: 0; padding-right: 36px; }
.node { grid-area: node; justify-self: center; z-index: 1; }

.kick { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #b8b1ab; transition: color 0.4s; }
.act .kick { color: var(--orange); }
.txt h3 { margin: 6px 0 8px; font-size: 22px; font-weight: 500; letter-spacing: -0.015em; }
.txt p { margin: 0; font-size: 15px; line-height: 1.7; color: var(--muted); }

.node {
  display: grid; place-items: center; width: 44px; height: 44px; border: 2px solid #eadbd1; border-radius: 50%; background: #fff; cursor: pointer;
  font: 600 15px "Poppins", system-ui, sans-serif; color: #b8b1ab; transition: background 0.4s, border-color 0.4s, color 0.4s, transform 0.4s;
}
.past .node { border-color: var(--orange); color: var(--orange); }
.act .node { background: var(--orange); border-color: var(--orange); color: #fff; transform: scale(1.12); }

/* spine: grey line, orange fill once a step is passed */
.step::before, .step::after { content: ""; position: absolute; left: 50%; top: 50%; bottom: -50%; width: 2px; margin-left: -1px; }
.step::before { background: #f1e7e2; }
.step::after { background: var(--orange); transform: scaleY(0); transform-origin: top; transition: transform 0.6s ease; }
.step.past::after { transform: scaleY(1); }
.step:last-child::before, .step:last-child::after { display: none; }

/* ---------- mocks ---------- */
.m { padding: 18px; border: 1px solid var(--line); border-radius: 22px; background: #fffaf7; transition: border-color 0.4s, box-shadow 0.4s; }
.act .m { border-color: rgba(255, 99, 56, 0.45); box-shadow: 0 14px 34px rgba(120, 50, 20, 0.1); }
.m b { font-weight: 500; }

/* 1 */
.m1 { display: flex; align-items: center; gap: 14px; }
.src { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; flex: 1; }
.src li { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border: 1px solid var(--line); border-radius: 12px; background: #fff; font-size: 13px; }
.dot { width: 9px; height: 9px; border-radius: 50%; }
.dot.web { background: #4f8cff; }
.dot.wa { background: #25d366; }
.dot.fb { background: #1877f2; }
.arr { color: #c9c2bb; font-size: 18px; }
.newlead { display: grid; gap: 2px; padding: 12px 14px; border-radius: 14px; background: var(--ink); color: #fff; }
.newlead b { font-size: 13.5px; }
.newlead small { font-size: 11.5px; color: #b8b1ab; }
.act .src li { animation: nudge 0.7s ease var(--d) backwards; }
.act .newlead { animation: pop 0.6s cubic-bezier(0.3, 1.3, 0.5, 1) 1.1s backwards; }

/* 2 */
.m2 { display: grid; gap: 14px; }
.rec { display: grid; gap: 2px; padding: 12px 14px; border-radius: 14px; background: #fff; border: 1px solid var(--line); }
.rec b { font-size: 14.5px; }
.rec small { font-size: 12px; color: var(--muted); }
.chk { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.chk li { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.chk em { font-style: normal; color: var(--muted); }
.ck { display: grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 50%; background: #e4f5ec; color: var(--green); font-size: 11px; font-weight: 600; }
.act .chk li { animation: pop 0.5s cubic-bezier(0.3, 1.3, 0.5, 1) var(--d) backwards; }

/* 3 */
.m3 { display: grid; gap: 16px; }
.sh { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; font-size: 12.5px; color: var(--muted); }
.sh b { font-size: 20px; color: var(--ink); }
.sh em { margin-left: 4px; padding: 2px 9px; border-radius: 99px; background: var(--orange-soft); color: var(--orange); font-size: 11px; font-style: normal; font-weight: 600; vertical-align: middle; }
.bar { height: 8px; border-radius: 99px; background: #f3ece8; overflow: hidden; }
.bar i { display: block; height: 100%; width: 82%; border-radius: 99px; background: var(--orange); }
.act .bar i { animation: grow 1.2s cubic-bezier(0.3, 0.7, 0.2, 1) backwards; }
.route { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding: 12px 14px; border-radius: 14px; background: #fff; border: 1px solid var(--line); }
.rl { font-size: 12px; color: var(--muted); }
.who { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.av { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #d9e6ff; font-size: 10px; font-weight: 600; }
.act .route { animation: pop 0.55s cubic-bezier(0.3, 1.3, 0.5, 1) 1s backwards; }

/* 4 */
.m4 { display: grid; gap: 12px; }
.note, .task { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; background: #fff; border: 1px solid var(--line); }
.bell { display: grid; place-items: center; flex: none; width: 34px; height: 34px; border-radius: 10px; background: var(--orange-soft); color: var(--orange); }
.nt { flex: 1; min-width: 0; }
.nt b { display: block; font-size: 13.5px; }
.nt small { display: block; font-size: 11.5px; color: var(--muted); }
.now { font-size: 11px; color: #a39d97; }
.cb { flex: none; width: 20px; height: 20px; border: 2px solid #d9cfc7; border-radius: 6px; }
.due { padding: 3px 10px; border-radius: 99px; background: var(--orange-soft); color: var(--orange); font-size: 11px; font-weight: 600; white-space: nowrap; }
.act .note { animation: drop 0.6s cubic-bezier(0.3, 1.3, 0.5, 1) backwards; }
.act .task { animation: pop 0.5s cubic-bezier(0.3, 1.3, 0.5, 1) 0.7s backwards; }

/* 5 */
.tl { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.tl li { display: grid; grid-template-columns: 46px 1fr auto; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; background: #fff; border: 1px solid var(--line); font-size: 12.5px; }
.ty { padding: 2px 0; border-radius: 99px; background: var(--orange-soft); color: var(--orange); text-align: center; font-size: 10.5px; font-weight: 600; }
.tx { min-width: 0; }
.tm { color: #a39d97; font-size: 11px; }
.tl li.won { border-color: rgba(31, 157, 99, 0.4); background: #f4fbf7; font-weight: 500; }
.won .ty { background: var(--green); color: #fff; }
.act .tl li { animation: pop 0.5s cubic-bezier(0.3, 1.3, 0.5, 1) var(--d) backwards; }

@keyframes pop { from { opacity: 0; transform: translateY(8px) scale(0.97); } to { opacity: 1; transform: none; } }
@keyframes nudge { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
@keyframes drop { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: none; } }
@keyframes grow { from { width: 0; } to { width: 82%; } }

/* ---------- responsive: spine moves to the left ---------- */
@media (max-width: 860px) {
  .step, .step.flip { grid-template-columns: 44px minmax(0, 1fr); grid-template-areas: "node txt" ". mock"; align-items: start; column-gap: 16px; row-gap: 14px; }
  .txt, .flip .txt { padding: 0; text-align: left; }
  .mock, .flip .mock { padding: 0; }
  .step::before, .step::after { left: 22px; top: 66px; bottom: -22px; }
  .node { justify-self: start; }
}
@media (max-width: 560px) {
  .hw { padding: 72px 0; }
  .steps { margin-top: 44px; }
  .m { padding: 14px; border-radius: 18px; }
  .m1 { flex-direction: column; align-items: stretch; }
  .arr { text-align: center; transform: rotate(90deg); }
}
@media (prefers-reduced-motion: reduce) {
  .hw *, .hw *::before, .hw *::after { animation: none !important; transition: none !important; }
}
</style>
