<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "OfflineModeSection" });

const root = ref(null);
const shown = ref(false);
const still = ref(false);
const n = ref(0);
let timer = null;
let io = null;

const queue = [
  { t: "Visit note saved", d: "Colombo Hotels · AMC review" },
  { t: "Deal stage updated", d: "Proposal to Negotiation" },
  { t: "New contact added", d: "Ayesha Raheem · Site contact" },
];

const sub = computed(() => (still.value ? 11 : n.value % 12));
const net = computed(() => (sub.value < 2 ? 0 : sub.value < 7 ? 1 : 2));
const bars = computed(() => (net.value === 1 ? 0 : sub.value >= 7 && sub.value < 9 ? 2 : 4));
const syncing = computed(() => sub.value >= 7 && sub.value < 11);
const state = computed(() => (net.value === 1 ? "No signal · working offline" : syncing.value ? "Back online · syncing" : "Online"));
const vis = (i) => sub.value >= 4 + i;
const synced = (i) => sub.value >= 8 + i;
const pending = computed(() => queue.filter((_, i) => vis(i) && !synced(i)).length);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || still.value) return;
  timer = setInterval(tick, 900);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    still.value = true;
    shown.value = true;
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
  <section ref="root" class="of" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Offline</span> <span class="l2">mode</span></h2>
        <p>
          Poor coverage at a site doesn't stop work. Saptivo's offline CRM mode lets you view records and enter data
          without signal, and syncs automatically when you reconnect.
        </p>
      </header>

      <div class="grid">
        <!-- device -->
        <article class="dev" :class="['n' + net]">
          <div class="st">
            <span class="sig" aria-hidden="true"><i v-for="k in 4" :key="k" :class="{ on: k <= bars }" :style="{ height: 4 + k * 3 + 'px' }"></i></span>
            <span class="pill" :class="['p' + net, { sy: syncing }]">{{ state }}</span>
          </div>

          <div class="rec">
            <div class="rh"><b>Colombo Hotels (Pvt) Ltd</b><em>Available offline</em></div>
            <dl>
              <div><dt>Contact</dt><dd>Dilani Perera</dd></div>
              <div><dt>Open deal</dt><dd>AMC renewal · LKR 150,000</dd></div>
              <div><dt>Last visit</dt><dd>12 Nov</dd></div>
            </dl>
          </div>

          <div class="ent" :class="{ vis: sub >= 4 && net !== 0 }">
            <small>New note</small>
            <p>Wants the revised price before month end.</p>
          </div>
        </article>

        <!-- sync queue -->
        <article class="sync">
          <div class="qh">
            <span class="lb">Saved on this device</span>
            <span class="cnt" :class="{ zero: pending === 0 }">{{ pending === 0 ? "All synced" : pending + " waiting" }}</span>
          </div>
          <ul>
            <li v-for="(q, i) in queue" :key="q.t" :class="{ vis: vis(i), ok: synced(i) }">
              <span class="ck">
                <svg v-if="synced(i)" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
              </span>
              <span class="tx"><b>{{ q.t }}</b><small>{{ q.d }}</small></span>
              <em>{{ synced(i) ? "Synced" : "Waiting to sync" }}</em>
            </li>
          </ul>
          <div class="flow" aria-hidden="true">
            <span :class="{ on: net === 0 }">Online</span>
            <i></i>
            <span :class="{ on: net === 1 }">No signal</span>
            <i></i>
            <span :class="{ on: net === 2 }">Reconnected</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.of {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --sky: #e4f0fb; --sky-i: #3a7fbd;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  --rose: #fde7ed; --rose-i: #c94b73;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.of *, .of *::before, .of *::after { box-sizing: border-box; }
.wrap { max-width: 1080px; margin: 0 auto; }
.head { text-align: center; max-width: 740px; margin: 0 auto 48px; }
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 { white-space: nowrap; }
h2 span { display: inline; }
.of h2 .l1 { color: #111111 !important; opacity: 1; }
.of h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.head p { margin: 0; font-size: 16px; line-height: 1.75; color: var(--muted); }
.head, .grid { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .grid { opacity: 1; transform: none; }
.in .grid { transition-delay: .1s; }

.grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: stretch; }
.lb { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

.dev { background: var(--lav); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 14px; transition: background .5s; min-width: 0; }
.dev.n1 { background: var(--butter); }
.st { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.sig { display: flex; align-items: flex-end; gap: 3px; height: 19px; }
.sig i { width: 5px; border-radius: 2px; background: rgba(20, 18, 15, .15); transition: background .3s; }
.sig i.on { background: var(--ink); }
.pill { font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 99px; background: #fff; transition: all .3s; }
.pill.p0 { color: var(--mint-i); }
.pill.p1 { color: var(--rose-i); background: var(--rose); }
.pill.p2 { color: var(--mint-i); }
.pill.sy { color: var(--sky-i); background: var(--sky); }

.rec { background: #fff; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
.rh { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.rh b { font-size: 15px; font-weight: 600; }
.rh em { font-style: normal; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 6px; background: var(--mint); color: var(--mint-i); }
dl { margin: 0; }
dl div { display: grid; grid-template-columns: 96px 1fr; gap: 10px; padding: 9px 0; border-top: 1px solid var(--line); font-size: 13.5px; }
dt { color: var(--muted); font-size: 12.5px; }
dd { margin: 0; font-weight: 500; }
.ent { background: #fff; border-radius: 16px; padding: 12px 16px; border: 1.5px solid var(--ink); opacity: .25; transform: translateY(6px); transition: all .4s ease; }
.ent.vis { opacity: 1; transform: none; }
.ent small { font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
.ent p { margin: 4px 0 0; font-size: 13.5px; line-height: 1.6; }

.sync { background: var(--sky); border-radius: 28px; padding: 22px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.qh { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.cnt { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #fff; color: var(--butter-i); transition: all .3s; }
.cnt.zero { color: var(--mint-i); }
.sync ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.sync li { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 12px; align-items: center; background: #fff; border-radius: 16px; padding: 14px 16px; opacity: .25; transform: translateX(-6px); transition: all .45s ease; }
.sync li.vis { opacity: 1; transform: none; }
.ck { width: 22px; height: 22px; border-radius: 50%; border: 2px dashed #c9ccd2; display: grid; place-items: center; color: #fff; transition: all .3s; }
.sync li.ok .ck { background: var(--mint-i); border: 2px solid var(--mint-i); }
.tx { display: flex; flex-direction: column; min-width: 0; }
.tx b { font-size: 13.5px; font-weight: 500; }
.tx small { font-size: 12px; color: var(--muted); }
.sync li em { font-style: normal; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 6px; background: var(--butter); color: var(--butter-i); white-space: nowrap; transition: all .3s; }
.sync li.ok em { background: var(--mint); color: var(--mint-i); }

.flow { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.flow span { padding: 5px 12px; border-radius: 99px; background: rgba(255, 255, 255, .6); color: var(--muted); font-weight: 500; transition: all .3s; white-space: nowrap; }
.flow span.on { background: var(--ink); color: #fff; }
.flow i { flex: 1; height: 1px; background: rgba(20, 18, 15, .2); }

@media (max-width: 860px) {
  .grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .of { padding: 64px 16px; }
  .dev, .sync { padding: 16px; border-radius: 22px; }
  dl div { grid-template-columns: 80px 1fr; }
  .sync li { grid-template-columns: 22px minmax(0, 1fr); }
  .sync li em { grid-column: 2; justify-self: start; }
  .flow span { padding: 5px 8px; font-size: 11px; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .grid { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
