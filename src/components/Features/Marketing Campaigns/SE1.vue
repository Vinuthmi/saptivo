<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "SegmentsSection" });

const root = ref(null);
const shown = ref(false);
const n = ref(0);
const ok = ref(true);
let timer = null;
let io = null;
let reduce = false;

const base = "/saptivo/images/features/";
const photo = base + "contemplative-man-using-phone-in-gray-suit-2026-09-23-19-59-43-utc.webp";

const fields = ["Purchase history", "VIP tier", "Location", "Industry", "Lead source", "Deal stage", "AMC status"];
const rules = [
  { f: "VIP tier", op: "is", v: "Gold" },
  { f: "Location", op: "is", v: "Colombo" },
  { f: "AMC status", op: "is", v: "Active" },
];
const counts = [1240, 312, 86, 41, 41, 41, 42, 42, 42, 42];
const people = [
  { n: "Dilani Perera", c: "Colombo 07", t: "Gold" },
  { n: "Saman Silva", c: "Colombo 03", t: "Gold" },
  { n: "Ayesha Raheem", c: "Colombo 05", t: "Gold" },
];
const fresh = { n: "Kamal Fernando", c: "Colombo 02", t: "Gold", fresh: true };

const step = computed(() => (reduce ? 7 : n.value % 10));
const ruleCount = computed(() => Math.min(3, step.value));
const active = computed(() => rules.slice(0, ruleCount.value));
const activeField = computed(() => {
  if (step.value >= 6) return "AMC status";
  return ruleCount.value === 0 ? "" : rules[ruleCount.value - 1].f;
});
const count = computed(() => counts[step.value]);
const list = computed(() => (step.value >= 6 ? [fresh, ...people] : people));
const hasRules = computed(() => ruleCount.value > 0);

function tick() {
  n.value += 1;
}
function start() {
  if (timer || reduce) return;
  timer = setInterval(tick, 1300);
}
function stop() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
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
  <section ref="root" class="sg" :class="{ in: shown }">
    <div class="wrap">
      <figure class="ph">
        <img v-if="ok" :src="photo" alt="" @error="ok = false" />
        <div class="cap">
          <small>Segment</small>
          <strong>Gold customers in Colombo with active AMC</strong>
          <div class="cnt"><b>{{ count.toLocaleString("en-US") }}</b><span>customers</span></div>
        </div>
      </figure>

      <div class="col">
        <h2><span class="l1">Segments from</span> <span class="l2">any field</span></h2>
        <p class="lead">
          Build audiences by purchase history, VIP tier, location, industry, lead source, deal stage or AMC status.
          Segments update automatically as customer data changes.
        </p>

        <div class="fl">
          <span v-for="f in fields" :key="f" class="fc" :class="{ on: f === activeField }">{{ f }}</span>
        </div>

        <div class="rl">
          <div v-if="!hasRules" class="all">All customers</div>
          <TransitionGroup name="ru" tag="ul" class="ruls">
            <li v-for="(r, i) in active" :key="r.f">
              <span class="and">{{ i === 0 ? "Where" : "And" }}</span>
              <b>{{ r.f }}</b>
              <span class="op">{{ r.op }}</span>
              <em>{{ r.v }}</em>
            </li>
          </TransitionGroup>
        </div>

        <TransitionGroup name="pp" tag="ul" class="ppl">
          <li v-for="p in list" :key="p.n">
            <span class="av"><b>{{ p.n.charAt(0) }}</b></span>
            <div class="pi"><strong>{{ p.n }}</strong><small>{{ p.c }}</small></div>
            <em v-if="p.fresh" class="new">Just added</em>
            <span class="tag">{{ p.t }}</span>
          </li>
        </TransitionGroup>

        <div class="auto" :class="{ on: step >= 6 }">
          <i></i>
          <span v-if="step >= 6">Kamal's AMC was renewed. Segment updated automatically.</span>
          <span v-else>Segments update automatically as customer data changes.</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sg {
  --ink: #14120f; --muted: #666b73; --line: rgba(20, 18, 15, .1);
  --lav: #eeeafd; --lav-i: #6a59d6;
  --mint: #dff3e8; --mint-i: #2c7a56;
  --butter: #fff4d2; --butter-i: #94700a;
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #fff;
  padding: 96px 16px;
}
.wrap { max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr); gap: 56px; align-items: center; }

.ph, .col { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.in .ph, .in .col { opacity: 1; transform: none; }
.in .col { transition-delay: .1s; }

/* big image */
.ph { position: relative; margin: 0; min-height: 640px; height: 100%; border-radius: 28px; overflow: hidden; background: linear-gradient(160deg, #e4ddfb, #d6e8f8); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
.cap { position: absolute; left: 20px; right: 20px; bottom: 20px; background: #fff; border-radius: 18px; padding: 16px 18px; display: grid; grid-template-columns: 1fr auto; gap: 2px 16px; align-items: end; }
.cap small { grid-column: 1 / -1; font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.cap strong { font-size: 14px; font-weight: 600; line-height: 1.4; }
.cnt { display: flex; align-items: baseline; gap: 6px; }
.cnt b { font-size: 36px; font-weight: 500; letter-spacing: -.03em; font-variant-numeric: tabular-nums; line-height: 1; }
.cnt span { font-size: 12.5px; color: var(--muted); }

/* content */
h2 { margin: 0 0 18px; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; text-wrap: balance; }
h2 span { display: block; }
.sg h2 .l1 { color: #111111 !important; opacity: 1; }
.sg h2 .l2 { color: #8a8f97 !important; opacity: 1; }
.lead { margin: 0 0 28px; font-size: 16px; line-height: 1.75; color: var(--muted); max-width: 560px; }

.fl { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.fc { font-size: 13px; font-weight: 500; padding: 7px 14px; border-radius: 99px; background: #f1f2f4; color: var(--muted); transition: all .3s; }
.fc.on { background: var(--ink); color: #fff; }
.rl { min-height: 150px; margin-bottom: 14px; }
.all { padding: 14px 16px; border-radius: 14px; background: #f6f7f9; font-size: 14px; color: var(--muted); }
.ruls { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.ruls li { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 12px 16px; border-radius: 14px; background: var(--lav); font-size: 14px; }
.and { font-size: 12px; color: var(--muted); width: 44px; }
.ruls b { font-weight: 600; }
.op { color: var(--muted); }
.ruls em { font-style: normal; font-weight: 600; background: #fff; padding: 3px 12px; border-radius: 8px; color: var(--lav-i); }
.ru-enter-active { transition: all .4s ease; }
.ru-enter-from { opacity: 0; transform: translateX(-10px); }
.ru-leave-active { display: none; }

.ppl { list-style: none; margin: 0 0 14px; padding: 0; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--line); padding-top: 14px; }
.ppl li { display: flex; align-items: center; gap: 12px; padding: 4px 0; }
.av { width: 34px; height: 34px; border-radius: 50%; background: var(--lav); color: var(--lav-i); display: grid; place-items: center; font-weight: 700; font-size: 12.5px; flex: none; }
.pi { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.pi strong { font-size: 13.5px; }
.pi small { font-size: 12px; color: var(--muted); }
.new { font-style: normal; font-size: 11px; font-weight: 600; color: var(--mint-i); background: var(--mint); padding: 3px 9px; border-radius: 6px; }
.tag { font-size: 11.5px; font-weight: 600; color: var(--butter-i); background: var(--butter); padding: 3px 10px; border-radius: 6px; }
.pp-enter-active, .pp-move { transition: all .45s ease; }
.pp-enter-from { opacity: 0; transform: translateY(-10px); }

.auto { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 14px; background: #f6f7f9; font-size: 13px; color: var(--muted); transition: background .4s, color .4s; }
.auto i { width: 8px; height: 8px; border-radius: 50%; background: #c3c7cd; flex: none; transition: background .4s; }
.auto.on { background: var(--mint); color: var(--mint-i); font-weight: 500; }
.auto.on i { background: var(--mint-i); }

@media (max-width: 960px) {
  .wrap { grid-template-columns: 1fr; gap: 36px; }
  .ph { min-height: 420px; height: 420px; }
}
@media (max-width: 640px) {
  .sg { padding: 64px 16px; }
  .ph { min-height: 340px; height: 340px; border-radius: 22px; }
  .cap { left: 12px; right: 12px; bottom: 12px; }
  .cnt b { font-size: 30px; }
}
@media (prefers-reduced-motion: reduce) {
  .ph, .col { opacity: 1; transform: none; transition: none; }
  * { transition-duration: 0s !important; }
}
</style>
