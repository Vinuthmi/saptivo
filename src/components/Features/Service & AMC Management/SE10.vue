<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({ name: "WhoUsesSaptivoSection" });

const root = ref(null);
const shown = ref(false);
const photoOk = ref(true);
let io = null;
let reduce = false;

const photo = "/saptivo/images/features/dd.webp";

/* data */
const industries = [
  { id: "ac", n: "Air conditioning contractors", d: "Streamline HVAC maintenance, scheduling, and first-time fix rates.", img: "/saptivo/images/features/3C.webp" },
  { id: "solar", n: "Solar power installers", d: "Manage panel installations, site surveys, and grid integration workflows.", img: "/saptivo/images/features/15.webp" },
  { id: "gen", n: "Generator and power backup suppliers", d: "Track emergency callouts, AMCs, and load testing service records.", img: "/saptivo/images/features/12.jpg" },
  { id: "lift", n: "Lift maintenance firms", d: "Ensure compliance, routine elevator inspections, and safety logging.", img: "/saptivo/images/features/mob.webp" },
  { id: "cctv", n: "CCTV integrators", d: "Organize security system layouts, wiring tasks, and client sign-offs.", img: "/saptivo/images/features/14.jpg" },
  { id: "water", n: "Water treatment companies", d: "Schedule filter replacements, chemical level checks, and regular routes.", img: "/saptivo/images/features/13.jpg" }
];

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
      }
    },
    { threshold: 0.2 }
  );
  if (root.value) io.observe(root.value);
});

onBeforeUnmount(() => {
  if (io) io.disconnect();
});
</script>

<template>
  <section ref="root" class="wu" :class="{ in: shown }">
    <div class="wrap">
      <header class="head">
        <h2><span class="l1">Who uses Saptivo</span> <span class="l2">service management software</span></h2>
      </header>

      <div class="board">
        <!-- left: image & link -->
        <div class="left">
          <figure class="ph">
            <div class="bg"></div>
            <img v-if="photoOk" :src="photo" alt="Field service technician working on site" @error="photoOk = false" />
          </figure>

          <div class="cta-box">
            <p>See the field service industry page for detailed examples.</p>
            <a href="/industries/field-service" class="btn">See the field service industry page &rarr;</a>
          </div>
        </div>

        <!-- right: structured grid matching ServiceAnalyticsSection -->
        <div class="rep" aria-label="Industries using Saptivo service management software">
          <div class="grid">
            <div 
              v-for="(ind, i) in industries" 
              :key="ind.id" 
              class="card" 
              :style="{ transitionDelay: reduce ? '0s' : `${(i * 0.06) + 0.12}s` }"
            >
              <div class="card-top">
                <span class="num">{{ String(i + 1).padStart(2, "0") }}</span>
                <div class="thumb">
                  <img :src="ind.img" :alt="ind.n" loading="lazy" @error="($event.target).style.display = 'none'" />
                </div>
              </div>
              <b>{{ ind.n }}</b>
              <span>{{ ind.d }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wu {
  --ink: #14120f; 
  --muted: #6b6f76; 
  --line: #e4e2dc; 
  --paper: #f6f5f1;
  --acc: #5b4bd0;
  
  font-family: "Poppins", system-ui, sans-serif;
  color: var(--ink);
  background: #ffffff;
  padding: 96px 16px;
}

.wrap { max-width: 1120px; margin: 0 auto; }
.head { margin-bottom: 48px; }
h2 { margin: 0; font-size: clamp(34px, 3.8vw, 56px); font-weight: 500; line-height: 1.12; letter-spacing: -0.035em; }
h2 span { display: block; }
.wu h2 .l1 { color: #111111 !important; opacity: 1; }
.wu h2 .l2 { color: #8a8f97 !important; opacity: 1; }

.head, .board { opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; }
.in .head, .in .board { opacity: 1; transform: none; }
.in .board { transition-delay: .08s; }

.board { display: grid; grid-template-columns: 1fr 1.25fr; gap: 56px; align-items: start; }

.left { display: flex; flex-direction: column; gap: 28px; }
.ph { margin: 0; position: relative; aspect-ratio: 16 / 10; border-radius: 14px; overflow: hidden; background: var(--paper); border: 1px solid var(--line); }
.bg { position: absolute; inset: 0; background: linear-gradient(160deg, #eae8e1, #dcd9d0); }
.ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }

.cta-box {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 24px;
  border-radius: 14px;
}
.cta-box p { margin: 0 0 16px; font-size: 14.5px; color: var(--muted); line-height: 1.5; }
.btn { 
  display: inline-flex; 
  align-items: center;
  gap: 6px;
  color: var(--ink); 
  text-decoration: none; 
  font-size: 13.5px; 
  font-weight: 500; 
  background: #ffffff; 
  border: 1px solid var(--line); 
  padding: 10px 16px; 
  border-radius: 8px; 
  transition: border-color .2s ease, background .2s ease, color .2s ease; 
}
.btn:hover { border-color: var(--ink); background: var(--ink); color: #ffffff; }

/* right: light editorial cards */
.rep { display: flex; flex-direction: column; min-width: 0; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

.card { 
  background: #ffffff; 
  border: 1px solid var(--line); 
  border-radius: 14px; 
  padding: 22px; 
  display: flex; 
  flex-direction: column; 
  gap: 10px; 
  opacity: 0; 
  transform: translateY(12px); 
  transition: opacity .5s ease, transform .5s ease, border-color .25s, background .25s; 
}
.in .card { opacity: 1; transform: none; }
.card:hover { border-color: #c9c6be; background: var(--paper); }

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.num {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--paper);
  border: 1px solid var(--line);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card b { font-size: 15px; font-weight: 500; color: var(--ink); line-height: 1.35; }
.card span { font-size: 13px; color: var(--muted); line-height: 1.48; }

@media (max-width: 960px) {
  .board { grid-template-columns: 1fr; gap: 36px; }
}
@media (max-width: 640px) {
  .wu { padding: 64px 16px; }
  .grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .head, .board, .card { opacity: 1; transform: none; transition: none !important; }
  * { transition-duration: 0s !important; }
}
</style>