<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "BranchPermissionsSection" });

const root = ref(null);
const shown = ref(false);
const idx = ref(0);
const manual = ref(false);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";

const menu = [
  { k: "dash", t: "Dashboard", ic: "M4 13h6V4H4zM14 20h6V4h-6zM4 20h6v-4H4z" },
  { k: "cust", t: "Customers", ic: "M16 11a4 4 0 1 0-8 0M4 20a8 8 0 0 1 16 0" },
  { k: "stock", t: "Stock", ic: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10" },
  { k: "rep", t: "Reports", ic: "M4 20V10M10 20V4M16 20v-8M22 20H2" },
  { k: "pos", t: "POS", ic: "M5 3h14v18H5zM9 7h6M9 11h6M9 15h3" },
  { k: "quo", t: "Quotations", ic: "M7 3h8l4 4v14H7zM15 3v4h4M10 13h6M10 17h4" },
  { k: "aud", t: "Audit log", ic: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" },
  { k: "br", t: "All branches", ic: "M3 21V9l9-6 9 6v12M9 21v-6h6v6" },
];

const roles = [
  {
    k: "cashier",
    n: "Cashier",
    who: "Ruwan",
    line: "Only the screens a cashier needs",
    scope: "Colombo branch",
    allow: ["pos", "cust"],
    photo: base + "man-using-point-of-sale-system-in-cafe-2026-09-23-07-53-09-utc.jpg",
    tone: "butter",
  },
  {
    k: "sales",
    n: "Sales staff",
    who: "Hasitha",
    line: "Only the screens sales work requires",
    scope: "Colombo branch",
    allow: ["dash", "cust", "quo"],
    photo: base + "confident-man-uses-cellphone-near-modern-city-buil-2026-09-24-03-29-45-utc.jpg",
    tone: "sky",
  },
  {
    k: "manager",
    n: "Branch manager",
    who: "Nimali",
    line: "Own customers, stock and reports",
    scope: "Colombo branch",
    allow: ["dash", "cust", "stock", "rep", "pos", "quo"],
    photo: base + "smiling-woman-using-smartphone-in-front-of-green-w-2026-10-27-20-08-47-utc.jpg",
    tone: "mint",
  },
  {
    k: "head",
    n: "Head office",
    who: "Kasun",
    line: "Full visibility and audit control",
    scope: "All branches",
    allow: ["dash", "cust", "stock", "rep", "pos", "quo", "aud", "br"],
    photo: base + "professional-woman-during-online-meeting-in-modern-2026-09-21-18-23-13-utc.jpg",
    tone: "lav",
  },
];
const ok = ref([true, true, true, true]);

const customers = [
  { id: 1, n: "Dilani Perera", b: "Colombo", v: "LKR 42,000" },
  { id: 2, n: "Ravi Fernando", b: "Kandy", v: "LKR 18,500" },
  { id: 3, n: "Malini Jayasuriya", b: "Colombo", v: "LKR 68,500" },
  { id: 4, n: "Hasitha Traders", b: "Galle", v: "LKR 120,000" },
  { id: 5, n: "Sewwandi K.", b: "Kandy", v: "LKR 9,800" },
  { id: 6, n: "Kasun Silva", b: "Colombo", v: "LKR 31,200" },
];
const audit = [
  { t: "Nimali (Colombo) edited a quotation", w: "2 min ago" },
  { t: "Ruwan (Kandy) refunded a receipt", w: "11 min ago" },
  { t: "Stock report exported by Galle manager", w: "26 min ago" },
];

const role = computed(() => roles[idx.value]);
const can = (k) => role.value.allow.includes(k);
const rows = computed(() => (role.value.k === "head" ? customers : customers.filter((c) => c.b === "Colombo")));

function next() {
  idx.value = (idx.value + 1) % roles.length;
}
function pick(i) {
  manual.value = true;
  stop();
  idx.value = i;
}
function start() {
  if (timer || reduce || manual.value) return;
  timer = setInterval(next, 3600);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = true;
    idx.value = 2;
    return;
  }
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        shown.value = true;
        start();
      } else stop();
    },
    { threshold: 0.2 }
  );
  io.observe(root.value);
});
onBeforeUnmount(() => {
  stop();
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="bp" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Branch-level</span> <span class="l2">permissions</span></h2>
        <p>
          Staff see what their branch needs and nothing more. Branch managers handle their own customers, stock and
          reports; cashiers and sales staff get only the screens their role requires. Head office keeps full
          visibility and audit control across the company.
        </p>
      </header>

      <div class="board">
        <!-- roles -->
        <ul class="roles" role="tablist">
          <li v-for="(r, i) in roles" :key="r.k" :class="['tone-' + r.tone, { act: idx === i, run: idx === i && !manual }]">
            <button type="button" role="tab" :aria-selected="idx === i" @click="pick(i)">
              <span class="av">
                <img v-if="ok[i]" :src="r.photo" alt="" @error="ok[i] = false" />
                <b v-else>{{ r.who[0] }}</b>
              </span>
              <span class="rt">
                <strong>{{ r.n }}</strong>
                <small>{{ r.line }}</small>
              </span>
              <span class="scope">{{ r.scope }}</span>
              <span class="prog"><i></i></span>
            </button>
          </li>
        </ul>

        <!-- app -->
        <div class="app" role="img" aria-label="The same Saptivo app as seen by different roles, with locked screens and branch-filtered customers">
          <div class="bar">
            <i></i><i></i><i></i>
            <span class="as">
              Viewing as <b>{{ role.who }}</b> · {{ role.n }}
            </span>
            <span class="br" :class="'tone-' + role.tone">{{ role.scope }}</span>
          </div>

          <div class="body">
            <nav class="menu">
              <div
                v-for="m in menu"
                :key="m.k"
                class="mi"
                :class="{ on: can(m.k), off: !can(m.k) }"
              >
                <svg class="mic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="m.ic" /></svg>
                <span>{{ m.t }}</span>
                <svg v-if="!can(m.k)" class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              </div>
              <div class="count"><b>{{ role.allow.length }}</b> of {{ menu.length }} screens</div>
            </nav>

            <div class="main">
              <div class="mh">
                <strong>Customers</strong>
                <span>{{ rows.length }} {{ rows.length === 1 ? "customer" : "customers" }} · {{ role.scope }}</span>
              </div>

              <TransitionGroup name="row" tag="ul" class="tbl">
                <li v-for="c in rows" :key="c.id">
                  <span class="cn">{{ c.n }}</span>
                  <em :class="c.b.toLowerCase()">{{ c.b }}</em>
                  <span class="cv">{{ c.v }}</span>
                </li>
              </TransitionGroup>

              <Transition name="fade" mode="out-in">
                <div v-if="role.k === 'head'" key="a" class="aud">
                  <div class="ah"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" /></svg><strong>Audit log</strong><span>Across the company</span></div>
                  <ul>
                    <li v-for="a in audit" :key="a.t"><span>{{ a.t }}</span><time>{{ a.w }}</time></li>
                  </ul>
                </div>
                <div v-else key="l" class="aud locked">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                  <div><strong>Other branches and the audit log</strong><span>Head office only</span></div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bp {
  --ink: #14120f; --muted: #666b73; --line: #ece9f3;
  --lav: #e8e3ff; --lav-i: #7d6be6;
  --sky: #dcecfb; --sky-i: #3f87c7;
  --mint: #d3f0e1; --mint-i: #2f9c6b;
  --butter: #fff1c9; --butter-i: #a77d00;
  --rose: #fde3ea; --rose-i: #d8567f;
  font-family: "Urbanist", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1120px; margin: 0 auto; }
.head { text-align: center; max-width: 780px; margin: 0 auto 44px; }
.eyebrow { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; background: var(--lav); color: var(--lav-i); padding: 6px 14px; border-radius: 99px; margin-bottom: 16px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.bp h2 .l1 { color: #111111 !important; opacity: 1; }
.bp h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16.5px; line-height: 1.75; color: var(--muted); }

.head, .board { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .1s; }

.tone-lav { --t: var(--lav); --ti: var(--lav-i); --tb: #f6f4ff; }
.tone-sky { --t: var(--sky); --ti: var(--sky-i); --tb: #f3f9ff; }
.tone-mint { --t: var(--mint); --ti: var(--mint-i); --tb: #f2fbf6; }
.tone-butter { --t: var(--butter); --ti: var(--butter-i); --tb: #fffaea; }

.board { display: grid; grid-template-columns: 340px 1fr; gap: 20px; align-items: stretch; }

/* roles */
.roles { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.roles li { flex: 1; }
.roles button { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; height: 100%; display: grid; grid-template-columns: 48px 1fr; grid-template-areas: "a t" "a s"; column-gap: 14px; row-gap: 6px; align-items: center; padding: 14px 16px; border-radius: 22px; border: 1px solid var(--line); background: #fff; position: relative; overflow: hidden; transition: background .35s, border-color .35s, transform .35s; }
.roles button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.roles li.act button { background: var(--tb); border-color: var(--ti); transform: translateX(6px); }
.av { grid-area: a; width: 48px; height: 48px; border-radius: 50%; overflow: hidden; background: var(--t); color: var(--ti); display: grid; place-items: center; font-weight: 700; border: 3px solid #fff; box-sizing: border-box; box-shadow: 0 0 0 1px var(--line); }
.av img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.rt { grid-area: t; display: flex; flex-direction: column; min-width: 0; }
.rt strong { font-size: 15px; }
.rt small { font-size: 12px; color: var(--muted); line-height: 1.45; }
.scope { grid-area: s; justify-self: start; font-size: 10.5px; font-weight: 700; padding: 3px 10px; border-radius: 99px; background: var(--t); color: var(--ti); }
.prog { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; }
.prog i { display: block; width: 0; height: 100%; background: var(--ink); }
.roles li.act:not(.run) .prog i { width: 100%; }
.roles li.act.run .prog i { animation: fill 3.6s linear forwards; }
@keyframes fill { to { width: 100%; } }

/* app */
.app { background: #fff; border: 1px solid var(--line); border-radius: 26px; box-shadow: 0 28px 70px rgba(60, 50, 120, .14); overflow: hidden; display: flex; flex-direction: column; min-width: 0; }
.bar { display: flex; align-items: center; gap: 6px; padding: 12px 18px; background: #faf9ff; border-bottom: 1px solid var(--line); }
.bar > i { width: 10px; height: 10px; border-radius: 50%; background: #e3e0ee; }
.as { margin-left: 12px; font-size: 12.5px; color: var(--muted); }
.as b { color: var(--ink); }
.br { margin-left: auto; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 99px; background: var(--t); color: var(--ti); transition: all .35s; white-space: nowrap; }

.body { display: grid; grid-template-columns: 190px 1fr; flex: 1; min-height: 440px; }
.menu { border-right: 1px solid var(--line); padding: 14px; display: flex; flex-direction: column; gap: 4px; background: #fbfaff; }
.mi { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 12px; font-size: 13px; font-weight: 500; transition: all .35s; }
.mic { width: 18px; height: 18px; flex: none; }
.mi.on { color: var(--ink); background: #fff; box-shadow: 0 2px 8px rgba(60, 50, 120, .08); }
.mi.on .mic { color: var(--mint-i); }
.mi.off { color: #b4b0c4; }
.lock { width: 14px; height: 14px; margin-left: auto; flex: none; }
.count { margin-top: auto; font-size: 11.5px; color: var(--muted); padding: 10px 6px 0; }
.count b { color: var(--ink); font-size: 15px; }

.main { padding: 18px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.mh { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.mh strong { font-size: 16px; }
.mh span { font-size: 12px; color: var(--muted); }
.tbl { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; position: relative; min-height: 222px; align-content: flex-start; }
.tbl li { display: grid; grid-template-columns: 1fr auto auto; gap: 14px; align-items: center; padding: 10px 14px; border-radius: 14px; background: #f8f7fc; font-size: 13px; transition: all .4s ease; }
.cn { font-weight: 600; }
.tbl em { font-style: normal; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 99px; }
.tbl em.colombo { background: var(--mint); color: var(--mint-i); }
.tbl em.kandy { background: var(--sky); color: var(--sky-i); }
.tbl em.galle { background: var(--butter); color: var(--butter-i); }
.cv { font-size: 12px; color: var(--muted); min-width: 92px; text-align: right; }

.aud { border-radius: 18px; padding: 14px 16px; background: #1d1a24; color: #f4eef7; margin-top: auto; }
.ah { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.ah svg { width: 20px; height: 20px; color: #7fe0b0; }
.ah strong { font-size: 13px; }
.ah span { margin-left: auto; font-size: 10.5px; color: #a79fb4; }
.aud ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.aud li { display: flex; justify-content: space-between; gap: 10px; font-size: 12px; color: #e0d8e8; }
.aud time { color: #8f879b; white-space: nowrap; }
.aud.locked { background: #f8f7fc; color: var(--muted); display: flex; align-items: center; gap: 12px; }
.aud.locked svg { width: 34px; height: 34px; padding: 8px; border-radius: 11px; background: #eceaf3; color: #8f8aa3; flex: none; }
.aud.locked strong { display: block; font-size: 13px; color: var(--ink); }
.aud.locked span { font-size: 12px; }

.row-enter-active, .row-leave-active { transition: all .4s ease; }
.row-enter-from { opacity: 0; transform: translateX(-12px); }
.row-leave-to { opacity: 0; transform: translateX(12px); }
.row-leave-active { position: absolute; left: 0; right: 0; }
.row-move { transition: transform .4s ease; }
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 1000px) {
  .board { grid-template-columns: 1fr; }
  .roles { display: grid; grid-template-columns: repeat(2, 1fr); }
  .roles li.act button { transform: none; }
}
@media (max-width: 640px) {
  .bp { padding: 64px 16px; }
  .roles { grid-template-columns: 1fr; }
  .body { grid-template-columns: 1fr; }
  .menu { flex-direction: row; flex-wrap: wrap; border-right: 0; border-bottom: 1px solid var(--line); }
  .mi span { font-size: 12px; }
  .count { width: 100%; margin-top: 4px; }
  .cv { display: none; }
  .tbl li { grid-template-columns: 1fr auto; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board { opacity: 1; transform: none; transition: none; }
  .roles li.act.run .prog i { animation: none; width: 100%; }
  * { transition-duration: 0s !important; }
}
</style>
